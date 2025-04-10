'use client';

import { FiMail } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa6";
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactUs() {
  const { t } = useLanguage();
  
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">{t('contact_us')}</h1>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <p className="mb-8 text-lg">
          {t('contact_message')}
        </p>
        
        <div className="flex justify-center gap-8">
          <a
            href="mailto:hanaekandreas@gmail.com"
            className="text-gray-600 hover:text-indigo-600 transition-colors flex flex-col items-center"
            aria-label="Email"
          >
            <FiMail size={32} />
            <span className="mt-2">{t('email')}</span>
          </a>
          
          <a
            href="https://www.linkedin.com/in/ayh04/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-indigo-600 transition-colors flex flex-col items-center"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={32} />
            <span className="mt-2">{t('linkedin')}</span>
          </a>
        </div>
      </div>
    </main>
  );
} 