import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { FormData, PriceResult } from '@/lib/types';

interface Result {
  aircraftType: string;
  ceilingPrice: number | undefined; // Adjust type as necessary
  floorPrice: number | undefined; // Adjust type as necessary
  isValid: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json();
    
    // First, check if airports exist in any table
    const allAirports = new Set<string>();
    const tables = ['JET', 'SMALL PROPELLER', 'BIG PROPELLER'];
    
    for (const table of tables) {
      const { data } = await supabase
        .from(table)
        .select('point_1, point_2');
      
      if (data) {
        data.forEach(item => {
          if (item.point_1) allAirports.add(item.point_1.toUpperCase());
          if (item.point_2) allAirports.add(item.point_2.toUpperCase());
        });
      }
    }
    
    // Check if origin and destination exist
    const originExists = allAirports.has(formData.origin.toUpperCase());
    const destinationExists = allAirports.has(formData.destination.toUpperCase());
    
    if (!originExists) {
      return NextResponse.json({ 
        error: `${formData.origin} is not available in our database, please select another airport.` 
      }, { status: 404 });
    }
    
    if (!destinationExists) {
      return NextResponse.json({ 
        error: `${formData.destination} is not available in our database, please select another airport.` 
      }, { status: 404 });
    }
    
    // STEP 2: Get airline service category
    const { data: airlineData, error: airlineError } = await supabase
      .from('SERVICE CATEGORY')
      .select('category')
      .ilike('airlines', formData.airline)
      .maybeSingle();
    
    if (airlineError) {
      console.error('Error fetching airline category:', airlineError);
      return NextResponse.json({ error: 'Failed to fetch airline category' }, { status: 500 });
    }
    
    if (!airlineData) {
      return NextResponse.json({ error: 'Airline not found' }, { status: 404 });
    }
    
    const serviceCategory = airlineData.category;
    
    // STEP 3: Find matching routes in all relevant tables
    let results: Result[] = [];
    const tablesToCheck = formData.aircraftType === 'I DON\'T KNOW' 
      ? ['JET', 'SMALL PROPELLER', 'BIG PROPELLER'] 
      : [formData.aircraftType];
    
    for (const table of tablesToCheck) {
      // Check for route match (origin in point_1 and destination in point_2 OR vice versa)
      const { data: routeMatches, error: routeError } = await supabase
        .from(table)
        .select('*')
        .or(`and(point_1.ilike.${formData.origin},point_2.ilike.${formData.destination}),and(point_1.ilike.${formData.destination},point_2.ilike.${formData.origin})`);
      
      if (routeError) {
        console.error(`Error checking ${table} for route match:`, routeError);
        continue;
      }
      
      if (routeMatches && routeMatches.length > 0) {
        // For each matching route, determine ceiling and floor prices
        routeMatches.forEach(match => {
          let ceilingPrice, floorPrice;
          
          switch (serviceCategory) {
            case 'FULL SERVICE':
              ceilingPrice = match.ceiling_price_full_service;
              floorPrice = match.floor_price_full_service;
              break;
            case 'MEDIUM SERVICE':
              ceilingPrice = match.ceiling_price_medium_service;
              floorPrice = match.floor_price_medium_service;
              break;
            case 'NO FRILLS':
              ceilingPrice = match.ceiling_price_no_frills;
              floorPrice = match.floor_price_no_frills;
              break;
          }
          
          results.push({
            aircraftType: table,
            ceilingPrice,
            floorPrice,
            isValid: formData.offeredPrice >= floorPrice && formData.offeredPrice <= ceilingPrice
          });
        });
      }
    }
    
    // If no matches found in requested aircraft type but found in others
    if (results.length === 0) {
      // Check if route exists in any table
      for (const table of tables) {
        if (tablesToCheck.includes(table)) continue; // Skip already checked tables
        
        const { data: routeMatches } = await supabase
          .from(table)
          .select('*')
          .or(`and(point_1.ilike.${formData.origin},point_2.ilike.${formData.destination}),and(point_1.ilike.${formData.destination},point_2.ilike.${formData.origin})`);
        
        if (routeMatches && routeMatches.length > 0) {
          return NextResponse.json({ 
            error: `The chosen route is not available for the ${formData.aircraftType} aircraft type, please choose another aircraft type.`,
            availableAircraftTypes: [table]
          }, { status: 404 });
        }
      }
      
      return NextResponse.json({ 
        error: `No direct route found between ${formData.origin} and ${formData.destination}.` 
      }, { status: 404 });
    }
    
    // Create result based on whether we have one or multiple matches
    if (formData.aircraftType === 'I DON\'T KNOW') {
      const result = {
        origin: formData.origin,
        destination: formData.destination,
        airline: formData.airline,
        serviceCategory,
        offeredPrice: formData.offeredPrice,
        multipleOptions: results
      };
      
      return NextResponse.json(result);
    } else {
      // Single aircraft type result
      const result: PriceResult = {
        origin: formData.origin,
        destination: formData.destination,
        airline: formData.airline,
        aircraftType: results[0].aircraftType,
        serviceCategory,
        offeredPrice: formData.offeredPrice,
        ceilingPrice: results[0].ceilingPrice ?? 0,
        floorPrice: results[0].floorPrice ?? 0,
        isValid: results[0].isValid
      };
      
      return NextResponse.json(result);
    }
    
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 