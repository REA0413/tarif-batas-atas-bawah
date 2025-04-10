'use client';

import Results from '@/components/Results';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ResultsPage() {
  const { t } = useLanguage();
  
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">{t('price_check_results')}</h1>
      <Results />
    </main>
  );
} 