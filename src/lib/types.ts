export interface ServiceCategory {
  id: string;
  number: number;
  airline: string;
  category: string;
}

export interface AircraftRouteData {
  id: string;
  number: number;
  point_1: string;
  point_2: string;
  ceiling_price_full_service: number;
  floor_price_full_service: number;
  ceiling_price_medium_service: number;
  floor_price_medium_service: number;
  ceiling_price_no_frills: number;
  floor_price_no_frills: number;
}

export interface FormData {
  origin: string;
  destination: string;
  airline: string;
  aircraftType: 'SMALL PROPELLER' | 'BIG PROPELLER' | 'JET' | 'I DON\'T KNOW';
  offeredPrice: number;
}

export interface PriceResult {
  origin: string;
  destination: string;
  airline: string;
  aircraftType: string;
  serviceCategory: string;
  offeredPrice: number;
  ceilingPrice: number;
  floorPrice: number;
  isValid: boolean;
}

export interface MultipleOptionResult {
  aircraftType: string;
  ceilingPrice: number;
  floorPrice: number;
  isValid: boolean;
}

export interface ResultWithMultipleOptions {
  origin: string;
  destination: string;
  airline: string;
  serviceCategory: string;
  offeredPrice: number;
  multipleOptions: MultipleOptionResult[];
} 