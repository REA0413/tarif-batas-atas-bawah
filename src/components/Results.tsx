'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PriceResult } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface MultipleOptionResult {
  aircraftType: string;
  ceilingPrice: number;
  floorPrice: number;
  isValid: boolean;
}

interface ResultWithMultipleOptions {
  origin: string;
  destination: string;
  airline: string;
  serviceCategory: string;
  offeredPrice: number;
  multipleOptions: MultipleOptionResult[];
}

export default function Results() {
  const [result, setResult] = useState<PriceResult | ResultWithMultipleOptions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const storedResult = localStorage.getItem('priceCheckResult');
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        if (parsedResult.error) {
          setError(parsedResult.error);
        } else {
          setResult(parsedResult);
        }
      } catch (e) {
        console.error('Error parsing result:', e);
        setError(t('internal_error'));
      }
    } else {
      router.push('/');
    }
  }, [router, t]);

  const handleNewCheck = () => {
    localStorage.removeItem('priceCheckResult');
    router.push('/');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6 max-w-lg mx-auto">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={handleNewCheck}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t('new_basic_fare_check')}
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white shadow rounded-lg p-6 max-w-lg mx-auto">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-4">{t('loading_results')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-lg mx-auto">
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-sm font-medium text-gray-500">{t('origin')}</div>
          <div className="text-sm text-gray-900">{result.origin}</div>

          <div className="text-sm font-medium text-gray-500">{t('destination')}</div>
          <div className="text-sm text-gray-900">{result.destination}</div>

          <div className="text-sm font-medium text-gray-500">{t('airline')}</div>
          <div className="text-sm text-gray-900">{result.airline}</div>

          <div className="text-sm font-medium text-gray-500">{t('service_category')}</div>
          <div className="text-sm text-gray-900">{result.serviceCategory}</div>

          <div className="text-sm font-medium text-gray-500">{t('offered_price')}</div>
          <div className="text-sm text-gray-900">{formatCurrency(result.offeredPrice)}</div>
        </div>

        {'multipleOptions' in result ? (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">{t('aircraft_options')}</h3>
            {result.multipleOptions.map((option, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                <div className="flex items-center mb-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${option.isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div className="font-medium">{option.aircraftType}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">{t('floor_price')}</div>
                  <div>{formatCurrency(option.floorPrice)}</div>
                  
                  <div className="text-gray-500">{t('ceiling_price')}</div>
                  <div>{formatCurrency(option.ceilingPrice)}</div>
                </div>
                
                <div className="mt-2 text-sm">
                  <p className="text-sm">
                    {option.isValid 
                      ? t('valid_basic_fare') 
                      : t('invalid_basic_fare')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="text-sm font-medium text-gray-500">{t('aircraft_type')}</div>
              <div className="text-sm text-gray-900">{(result as PriceResult).aircraftType}</div>

              <div className="text-sm font-medium text-gray-500">{t('floor_price')}</div>
              <div className="text-sm text-gray-900">{formatCurrency((result as PriceResult).floorPrice)}</div>

              <div className="text-sm font-medium text-gray-500">{t('ceiling_price')}</div>
              <div className="text-sm text-gray-900">{formatCurrency((result as PriceResult).ceilingPrice)}</div>
            </div>

            <div className="mt-6 p-4 rounded-md border border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${(result as PriceResult).isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <p className="text-sm font-medium">
                  {(result as PriceResult).isValid 
                    ? t('valid_basic_fare_detail') 
                    : t('invalid_basic_fare_detail')}
                </p>
              </div>
            </div>
          </>
        )}

        <button
          onClick={handleNewCheck}
          className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {t('new_basic_fare_check')}
        </button>
      </div>
    </div>
  );
} 