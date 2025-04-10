'use client';

import { FiMail } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa6";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { FormData } from '@/lib/types';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

// Create separate types for form input and output
type FormInput = {
  origin: string;
  destination: string;
  airline: string;
  aircraftType: 'SMALL PROPELLER' | 'BIG PROPELLER' | 'JET' | 'I DON\'T KNOW';
  offeredPrice: string; // String in the form
};

const formSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  airline: z.string().min(1, 'Airline is required'),
  aircraftType: z.enum(['SMALL PROPELLER', 'BIG PROPELLER', 'JET', 'I DON\'T KNOW']),
  offeredPrice: z.string()
    .regex(/^\d{1,8}$/, 'Must be a number with maximum 8 digits')
});

// Assume these are the images in the public folder
const slideshowImages = [
  '/garuda_indonesia.png',
  '/pelita_air.png',
  '/lion_air.png',
];

export default function PriceCheckForm() {
  const router = useRouter();
  const [airports, setAirports] = useState<string[]>([]);
  const [airlines, setAirlines] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, language } = useLanguage();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aircraftType: 'JET',
      offeredPrice: ''
    }
  });

  useEffect(() => {
    const fetchOptions = async () => {
      // Fetch airports from all tables
      const tables = ['JET', 'SMALL PROPELLER', 'BIG PROPELLER'];
      const uniqueAirports = new Set<string>();
      
      // Fetch airports from all tables
      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('point_1, point_2');
        
        if (error) {
          console.error(`Error fetching airports from ${table}:`, error);
        } else if (data) {
          data.forEach(item => {
            if (item.point_1) uniqueAirports.add(item.point_1);
            if (item.point_2) uniqueAirports.add(item.point_2);
          });
        }
      }
      
      setAirports(Array.from(uniqueAirports).sort());

      // Fetch airlines from SERVICE CATEGORY table
      const { data: airlineData, error: airlineError } = await supabase
        .from('SERVICE CATEGORY')
        .select('airlines')
        .order('airlines');
      
      if (airlineError) {
        console.error('Error fetching airlines:', airlineError);
      } else if (airlineData) {
        const uniqueAirlines = airlineData.map(item => item.airlines);
        setAirlines(uniqueAirlines);
      }
    };

    fetchOptions();
  }, []);

  const onSubmit = async (data: FormInput) => {
    setIsSubmitting(true);
    try {
      const formData: FormData = {
        origin: data.origin,
        destination: data.destination,
        airline: data.airline,
        aircraftType: data.aircraftType as FormData['aircraftType'],
        offeredPrice: parseInt(data.offeredPrice, 10)
      };

      const response = await fetch('/api/check-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      // Store result in localStorage and redirect to results page
      localStorage.setItem('priceCheckResult', JSON.stringify(result));
      router.push('/results');
    } catch (error) {
      console.error('Error submitting form:', error);
      localStorage.setItem('priceCheckResult', JSON.stringify({ 
        error: 'Failed to connect to the server. Please try again later.' 
      }));
      router.push('/results');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slideshowImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideshowImages.length - 1 : prev - 1));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-6 text-center">{t('domestic_basic_fare_validator')}</h1>
      
      {/* Modal for Basic Fare Explanation */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{t('what_is_basic_fare')}</h2>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div 
                className="mb-4"
                dangerouslySetInnerHTML={{ __html: t('basic_fare_explanation') }}
              />
              
              {/* Slideshow */}
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9 mb-2 bg-gray-100">
                  <div className="relative h-64 w-full cursor-pointer">
                    <a 
                      href={slideshowImages[currentSlide]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      <Image 
                        src={slideshowImages[currentSlide]} 
                        alt={`Basic fare example ${currentSlide + 1}`} 
                        layout="fill"
                        objectFit="contain"
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {t('click_to_view_full_size')}
                      </div>
                    </a>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => setCurrentSlide(prev => prev === 0 ? slideshowImages.length - 1 : prev - 1)}
                    className="p-1 text-gray-600 hover:text-indigo-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="text-sm text-gray-600">
                    {currentSlide + 1} / {slideshowImages.length}
                  </div>
                  
                  <button 
                    onClick={() => setCurrentSlide(prev => (prev + 1) % slideshowImages.length)}
                    className="p-1 text-gray-600 hover:text-indigo-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {t('got_it')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Origin Field */}
        <div>
          <label htmlFor="origin" className="block text-sm font-medium text-gray-700">
            {t('origin')}
          </label>
          <input
            id="origin"
            list="origin-options"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            {...register('origin')}
          />
          <datalist id="origin-options">
            {airports.map(airport => (
              <option key={airport} value={airport} />
            ))}
          </datalist>
          {errors.origin && (
            <p className="mt-1 text-sm text-red-600">{t('origin_required')}</p>
          )}
        </div>

        {/* Destination Field */}
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
            {t('destination')}
          </label>
          <input
            id="destination"
            list="destination-options"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            {...register('destination')}
          />
          <datalist id="destination-options">
            {airports.map(airport => (
              <option key={airport} value={airport} />
            ))}
          </datalist>
          {errors.destination && (
            <p className="mt-1 text-sm text-red-600">{t('destination_required')}</p>
          )}
        </div>

        {/* Airline Field */}
        <div>
          <label htmlFor="airline" className="block text-sm font-medium text-gray-700">
            {t('airline')}
          </label>
          <input
            id="airline"
            list="airline-options"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            {...register('airline')}
          />
          <datalist id="airline-options">
            {airlines.map(airline => (
              <option key={airline} value={airline} />
            ))}
          </datalist>
          {errors.airline && (
            <p className="mt-1 text-sm text-red-600">{t('airline_required')}</p>
          )}
        </div>

        {/* Aircraft Type Field */}
        <div>
          <label htmlFor="aircraftType" className="block text-sm font-medium text-gray-700">
            {t('aircraft_type')}
          </label>
          <select
            id="aircraftType"
            className="mt-1 block w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            {...register('aircraftType')}
          >
            <option value="SMALL PROPELLER">{t('small_propeller')}</option>
            <option value="BIG PROPELLER">{t('big_propeller')}</option>
            <option value="JET">{t('jet')}</option>
            <option value="I DON'T KNOW">{t('i_dont_know')}</option>
          </select>
          {errors.aircraftType && (
            <p className="mt-1 text-sm text-red-600">{errors.aircraftType.message}</p>
          )}
        </div>

        {/* Offered Price Field */}
        <div>
          <label htmlFor="offeredPrice" className="block text-sm font-medium text-gray-700 flex items-center">
            {t('offered_basic_fare')}
            <button 
              type="button"
              onClick={() => setModalOpen(true)}
              className="ml-1 text-gray-400 hover:text-indigo-500 focus:outline-none"
              aria-label="Learn more about basic fare"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </label>
          <input
            id="offeredPrice"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            {...register('offeredPrice')}
            maxLength={8}
          />
          {errors.offeredPrice && (
            <p className="mt-1 text-sm text-red-600">{t('invalid_price')}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? t('checking') : t('check_fare')}
        </button>
      </form>

      <div className="mt-6 text-center space-y-4">
        <div className="flex justify-center gap-4">
          <a
            href="mailto:hanaekandreas@gmail.com"
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Email"
          >
            <FiMail size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/ayh04/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={22} />
          </a>
        </div>
        
        <div className="space-y-1">
          <a
            href="http://www.onlinewebfonts.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 block"
          >
            Web Fonts Author Credit
          </a>
        </div>
      </div>
    </div>
  );
} 