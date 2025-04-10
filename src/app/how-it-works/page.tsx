'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();
  
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">{t('how_it_works_title')}</h1>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-4">{t('general_context')}</h2>
        
        <p className="mb-4" dangerouslySetInnerHTML={{ __html: t('how_it_works_intro') }} />
        <p className="mb-4" dangerouslySetInnerHTML={{ __html: t('how_it_works_focus') }} />
        <p className="mb-4" dangerouslySetInnerHTML={{ __html: t('how_it_works_tool') }} />

        <h3 className="text-xl font-semibold mt-6 mb-3">{t('interpreting_calculation')}</h3>
        
        <p className="mb-4" dangerouslySetInnerHTML={{ __html: t('calculation_simple') }} />

        <p className="mb-4" dangerouslySetInnerHTML={{ __html: t('red_light_possibilities') }} />

        <ul className="list-disc pl-5 mb-4">
          <li>{t('red_light_high')}</li>
          <li>{t('red_light_low')}</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">{t('what_to_do')}</h3>

        <p className="mb-4">{t('actions_intro')}</p>

        <ol className="list-decimal pl-5 mb-4">
          <li className="mb-2" dangerouslySetInnerHTML={{ __html: t('action_1') }} />
          <li className="mb-2" dangerouslySetInnerHTML={{ __html: t('action_2') }} />
          <li className="mb-2" dangerouslySetInnerHTML={{ __html: t('action_3') }} />
          <li className="mb-2" dangerouslySetInnerHTML={{ __html: t('action_4') }} />
        </ol>

        <h3 className="text-xl font-semibold mt-6 mb-3">{t('for_whom')}</h3>
        
        <p className="mb-4" dangerouslySetInnerHTML={{ __html: t('useful_peak') }} />
        <p className="mb-4" dangerouslySetInnerHTML={{ __html: t('useful_low') }} />
        <p className="mb-4" dangerouslySetInnerHTML={{ __html: t('useful_finance') }} />

        <h3 className="text-xl font-semibold mt-6 mb-3">{t('why_aircraft_type')}</h3>
        
        <p className="mb-4">{t('aircraft_factors')}</p>
        <p className="mb-4">{t('aircraft_types_detail')}</p>
        <p className="mb-4">{t('aircraft_help')}</p>
      </div>
    </main>
  );
} 