import './globals.css';
import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import localFont from 'next/font/local';
import { Analytics } from "@vercel/analytics/react"
import { LanguageProvider } from '@/contexts/LanguageContext';
// const inter = Inter({ subsets: ['latin'] });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: 'Tarif Batas Atas Bawah App',
  description: 'Aplikasi untuk mengecek batas atas dan batas bawah tarif penerbangan domestik Indonesia. An app to check the maximum and minimum basic fare offered by an airline in a Indonesian domestic route. Ceiling Fare and Floor Fare Domestic Flight Validator in Indonesia',
  verification: {
    google: 'A1RAIcX1hfNGRn-aqHOXd17EQnjMvEGd1GXGBlEZhas',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            {children}
            <Analytics />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
} 