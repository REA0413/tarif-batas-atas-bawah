'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
}

const translations = {
  en: {
    // Navigation
    'how_it_works': 'How It Works',
    'contact_us': 'Contact Us',
    'home': 'Home',
    'language_toggle': '🇮🇩 Bahasa',
    
    // Form labels
    'domestic_basic_fare_validator': 'Domestic Basic Fare Validator',
    'origin': 'Origin',
    'destination': 'Destination',
    'airline': 'Airline',
    'aircraft_type': 'Aircraft Type',
    'offered_basic_fare': 'Offered Basic Fare',
    'check_fare': 'Check Fare',
    'checking': 'Checking...',
    'new_basic_fare_check': 'New Basic Fare Check',
    
    // Aircraft types
    'small_propeller': 'SMALL PROPELLER (LESS THAN 30 SEATS)',
    'big_propeller': 'BIG PROPELLER (MORE THAN 30 SEATS)',
    'jet': 'JET',
    'i_dont_know': 'I DON\'T KNOW',
    
    // Modal content
    'what_is_basic_fare': 'What is Basic Fare?',
    'basic_fare_explanation': 'Don\'t put the Total Price here, but put the <strong>basic fare</strong> instead. Basic Fare is the price component of your airline ticket before taxes, airport fees, and other surcharges. It\'s typically found in the price breakdown before completing your purchase.',
    'click_to_view_full_size': 'Click to view full size',
    'got_it': 'Got it',
    
    // Results page
    'price_check_results': 'Price Check Results',
    'service_category': 'Service Category',
    'offered_price': 'Offered Price',
    'aircraft_options': 'Aircraft Options',
    'floor_price': 'Floor Price',
    'ceiling_price': 'Ceiling Price',
    'valid_basic_fare': 'The offered basic fare is valid for this aircraft type (within floor and ceiling fare rules).',
    'invalid_basic_fare': 'The offered basic fare is invalid for this aircraft type (outside floor and ceiling fare rules).',
    'valid_basic_fare_detail': 'The offered basic fare is valid (within floor and ceiling fare rules).',
    'invalid_basic_fare_detail': 'The offered basic fare is invalid (outside floor and ceiling fare rules).',
    'loading_results': 'Loading results...',
    
    // Contact us page
    'contact_message': 'Hi there, if you have any feedback about this application or if you find something off about the calculation result, drop me a message via email or LinkedIn below. Thank you.',
    'email': 'Email',
    'linkedin': 'LinkedIn',
    
    // How it works page
    'how_it_works_title': 'How It Works',
    'general_context': 'General Context',
    'interpreting_calculation': 'Interpreting the Calculation Result',
    'what_to_do': 'What can I do when I get a red light?',
    'for_whom': 'For whom this application is useful?',
    'why_aircraft_type': 'Why do you ask Aircraft Type in your form?',
    
    // How it works page - detailed content
    'how_it_works_intro': 'When you book an <strong>Indonesian domestic flight</strong>, right before you complete the payment step, you will see the price breakdown of the chosen flight. Normally, you will see several components of the price, such as fuel surcharge, airport tax, value added tax and the <strong>basic fare</strong>.',
    'how_it_works_focus': 'This application focuses on the <strong>basic fare component</strong> as Keputusan Menteri Perhubungan (KM) 106 Tahun 2019 has set the maximum and minimum basic fare an airline can offer to the passengers for each domestic flight route.',
    'how_it_works_tool': 'This application is a tool to help you check the <strong>offered basic fare</strong> of a flight and see if it is within the range set by the Transportation Ministry.',

    'calculation_simple': 'It\'s simple, if you get a <strong>green light</strong>, that means the basic fare is within the range set by the Transportation Ministry. If you get a <strong>red light</strong>, that means the basic fare is outside the range set by the Transportation Ministry.',
    'red_light_possibilities': 'When you get a <strong>red light</strong>, there are two possibilities:',
    'red_light_high': 'The basic fare offered by the airline is too high',
    'red_light_low': 'The basic fare offered by the airline is too low',

    'actions_intro': 'There are at least 4 possible actions you can take:',
    'action_1': 'Double check the basic fare offered by the airline and ensure that you\'re currently looking at the <strong>basic fare component</strong> and not the total price. I know it\'s frustrating to see a domestic flight price is higher than an international flight price, but it\'s important to be sure before you make a complaint.',
    'action_2': 'Take a screenshot of the calculation result and file a complaint to the Indonesian Transportation Ministry, specifically to the Directorate General of Air Transportation. You can visit this link: <a href="https://hubud.kemenhub.go.id/hubud/website/" target="_blank" rel="noopener noreferrer"><strong><u>first option</u></strong></a> and find multiple platform to contact them on the bottom page of that page or you can also try this link: <a href="https://dephub.go.id/post/read/layanan-pengaduan?cat=QmVyaXRhfHNlY3Rpb24tNjU" target="_blank" rel="noopener noreferrer"><strong><u>second option</u></strong></a>. Hopefully you will get a response and good luck with that 🙂',
    'action_3': 'Take a screenshot of the calculation result and file a complaint to the related airline contact center or social media account.',
    'action_4': 'Last option (but often times generate quicker response) is taking a screenshot of the calculation result and post it on your social media account. Then tag the airline\'s social media account or other social influencers.',

    'useful_peak': 'In a peak season, such as Eid al Fitr / Christmas / Year End / School Holidays period, the price of domestic flight can be very expensive. This application is useful for passengers to validate if the <strong>offered basic fare</strong> in the airline\'s website, OTAs, traditional travel agents or airport ticket counter is too high or not.',
    'useful_low': 'In a low season, the price of domestic flight can be very cheap. This application is useful for airline employees to validate if their competitors offers <strong>basic fares below the minimum basic fare set by the Transportation Ministry</strong>.',
    'useful_finance': 'Furthermore, a finance department that handles the travel expense or travel reimbursement activity, can use this application to validate the <strong>basic fare</strong> submitted by their employees.',

    'aircraft_factors': 'The maximum and minimum basic fare offered by an airline in a route is affected by two factors: Aircraft Type and Airline Service Level.',
    'aircraft_types_detail': 'There are three possible aircraft types: SMALL PROPELLER (LESS THAN  30 SEATS), BIG PROPELLER (MORE THAN  30 SEATS) and JET. Transportation Ministry also classifies Indonesian airlines into three types based on their level of services: FULL SERVICE airlines, MEDIUM SERVICE airline, and NO FRILLS / LOW COST airline.',
    'aircraft_help': 'If you know the aircraft type, that\'s great, you will help our system to work faster. If you don\'t know the aircraft type, don\'t worry, you can choose "I DON\'T KNOW" and we will take care of the rest.',

    // First option and second option links
    'first_option': 'first option',
    'second_option': 'second option',
    
    // Error messages
    'origin_required': 'Origin is required',
    'destination_required': 'Destination is required',
    'airline_required': 'Airline is required',
    'invalid_price': 'Must be a number with maximum 8 digits',
    'route_not_available': 'The chosen route is not available for the selected aircraft type, please choose another aircraft type.',
    'no_direct_route': 'No direct route found between {origin} and {destination}.',
    'airport_not_available': '{airport} is not available in our database, please select another airport.',
    'internal_error': 'Internal server error',
    'connection_error': 'Failed to connect to the server. Please try again later.'
  },
  id: {
    // Navigation
    'how_it_works': 'Cara Kerja',
    'contact_us': 'Kontak',
    'home': 'Beranda',
    'language_toggle': '🇬🇧 English',
    
    // Form labels
    'domestic_basic_fare_validator': 'Validator Tarif Batas Atas Bawah',
    'origin': 'Airport Asal',
    'destination': 'Airport Tujuan',
    'airline': 'Maskapai',
    'aircraft_type': 'Tipe Pesawat',
    'offered_basic_fare': 'Tarif Dasar yang Ditawarkan',
    'check_fare': 'Periksa Tarif',
    'checking': 'Memeriksa...',
    'new_basic_fare_check': 'Periksa Tarif Dasar Baru',
    
    // Aircraft types
    'small_propeller': 'PROPELLER KECIL (KURANG DARI 30 KURSI)',
    'big_propeller': 'PROPELLER BESAR (LEBIH DARI 30 KURSI)',
    'jet': 'JET',
    'i_dont_know': 'TIDAK TAHU',
    
    // Modal content
    'what_is_basic_fare': 'Apa itu Tarif Dasar?',
    'basic_fare_explanation': 'Jangan masukkan Harga Total di sini, tetapi masukkan <strong>tarif dasar</strong> saja. Tarif Dasar adalah komponen harga tiket pesawat Anda sebelum pajak, biaya bandara, dan biaya tambahan lainnya. Biasanya dapat ditemukan di rincian harga sebelum menyelesaikan pembelian.',
    'click_to_view_full_size': 'Klik untuk melihat ukuran penuh',
    'got_it': 'Mengerti',
    
    // Results page
    'price_check_results': 'Hasil Pemeriksaan Tarif',
    'service_category': 'Kategori Layanan',
    'offered_price': 'Tarif yang Ditawarkan',
    'aircraft_options': 'Pilihan Pesawat',
    'floor_price': 'Tarif Batas Bawah',
    'ceiling_price': 'Tarif Batas Atas',
    'valid_basic_fare': 'Tarif dasar yang ditawarkan valid untuk tipe pesawat ini (sesuai dengan aturan tarif batas bawah dan atas).',
    'invalid_basic_fare': 'Tarif dasar yang ditawarkan tidak valid untuk tipe pesawat ini (melanggar aturan tarif batas bawah dan atas).',
    'valid_basic_fare_detail': 'Tarif dasar yang ditawarkan valid (sesuai dengan aturan tarif batas bawah dan atas).',
    'invalid_basic_fare_detail': 'Tarif dasar yang ditawarkan tidak valid (melanggar aturan tarif batas bawah dan atas).',
    'loading_results': 'Memuat hasil...',
    
    // Contact us page
    'contact_message': 'Halo, jika Anda memiliki masukan tentang aplikasi ini atau jika Anda menemukan sesuatu yang tidak sesuai dari hasil perhitungan, silahkan kirimkan pesan kepada Saya melalui email atau LinkedIn di bawah ini. Terima kasih.',
    'email': 'Email',
    'linkedin': 'LinkedIn',
    
    // How it works page
    'how_it_works_title': 'Cara Kerja',
    'general_context': 'Konteks Umum',
    'interpreting_calculation': 'Menginterpretasikan Hasil Perhitungan',
    'what_to_do': 'Apa yang dapat saya lakukan ketika mendapat lampu merah?',
    'for_whom': 'Untuk siapa aplikasi ini akan berguna?',
    'why_aircraft_type': 'Mengapa Anda menanyakan Tipe Pesawat di dalam formulir?',
    
    // How it works page - detailed content (Indonesian)
    'how_it_works_intro': 'Ketika Anda memesan <strong>penerbangan domestik</strong>, sebelum Anda menyelesaikan langkah pembayaran, Anda akan melihat rincian harga dari penerbangan yang dipilih. Biasanya, Anda akan melihat beberapa komponen harga, seperti fuel surcharge, pajak bandara, pajak pertambahan nilai dan <strong>tarif dasar</strong>.',
    'how_it_works_focus': 'Aplikasi ini berfokus pada <strong>komponen tarif dasar</strong> karena Keputusan Menteri Perhubungan (KM) 106 Tahun 2019 telah menetapkan tarif dasar maksimum dan minimum yang dapat ditawarkan maskapai kepada penumpang untuk setiap rute penerbangan domestik.',
    'how_it_works_tool': 'Aplikasi ini adalah alat untuk membantu Anda memeriksa <strong>tarif dasar yang ditawarkan</strong> oleh maskapai dan memastikan apakah tarif tersebut berada dalam rentang yang ditetapkan oleh Kementerian Perhubungan.',

    'calculation_simple': 'Sederhana saja, jika Anda mendapatkan <strong>lampu hijau</strong>, itu berarti tarif dasar berada dalam rentang yang ditetapkan oleh Kementerian Perhubungan. Jika Anda mendapatkan <strong>lampu merah</strong>, itu berarti tarif dasar berada di luar rentang yang ditetapkan oleh Kementerian Perhubungan.',
    'red_light_possibilities': 'Ketika Anda mendapatkan <strong>lampu merah</strong>, ada dua kemungkinan:',
    'red_light_high': 'Tarif dasar yang ditawarkan oleh maskapai terlalu tinggi',
    'red_light_low': 'Tarif dasar yang ditawarkan oleh maskapai terlalu rendah',

    'actions_intro': 'Setidaknya ada 4 tindakan yang dapat Anda ambil:',
    'action_1': 'Periksa kembali tarif dasar yang ditawarkan oleh maskapai dan pastikan bahwa Anda sedang memeriksa <strong>komponen tarif dasar</strong> dan bukan harga total. Saya paham betapa menyebalkannya melihat harga penerbangan domestik lebih tinggi daripada harga penerbangan internasional, tetapi penting untuk memastikan sebelum Anda mengajukan keluhan.',
    'action_2': 'Ambil tangkapan layar hasil perhitungan dan ajukan keluhan ke Kementerian Perhubungan Indonesia, khususnya kepada Direktorat Jenderal Perhubungan Udara. Anda dapat mengunjungi tautan ini: <a href="https://hubud.kemenhub.go.id/hubud/website/" target="_blank" rel="noopener noreferrer"><strong><u>opsi pertama</u></strong></a> dan temukan berbagai platform untuk menghubungi mereka di bagian bawah halaman tersebut, atau Anda juga dapat mencoba tautan ini: <a href="https://dephub.go.id/post/read/layanan-pengaduan?cat=QmVyaXRhfHNlY3Rpb24tNjU" target="_blank" rel="noopener noreferrer"><strong><u>opsi kedua</u></strong></a>. Semoga berhasil mendapatkan tanggapan 🙂',
    'action_3': 'Ambil tangkapan layar hasil perhitungan dan ajukan keluhan ke pusat layanan pelanggan maskapai terkait atau akun media sosial mereka.',
    'action_4': 'Pilihan terakhir (tetapi seringkali menghasilkan respon lebih cepat) adalah mengambil tangkapan layar hasil perhitungan dan mempostingnya di akun media sosial Anda. Kemudian tag akun media sosial maskapai atau influencer sosial lainnya.',

    'useful_peak': 'Pada musim puncak, seperti periode Idul Fitri / Natal / Akhir Tahun / Liburan Sekolah, harga penerbangan domestik bisa sangat mahal. Aplikasi ini bermanfaat bagi penumpang untuk memvalidasi apakah <strong>tarif dasar yang ditawarkan</strong> di situs web maskapai, OTA, agen perjalanan tradisional, atau loket tiket bandara terlalu tinggi atau tidak.',
    'useful_low': 'Pada musim sepi, harga penerbangan domestik bisa sangat murah. Aplikasi ini bermanfaat bagi karyawan maskapai untuk memvalidasi apakah kompetitor mereka menawarkan <strong>tarif dasar di bawah tarif dasar minimum yang ditetapkan oleh Kementerian Perhubungan</strong>.',
    'useful_finance': 'Selain itu, profesional keuangan yang menangani aktivitas biaya perjalanan atau penggantian biaya perjalanan, dapat menggunakan aplikasi ini untuk memvalidasi <strong>tarif dasar</strong> yang diajukan oleh karyawan mereka.',

    'aircraft_factors': 'Tarif dasar maksimum dan minimum yang ditawarkan oleh maskapai dalam suatu rute dipengaruhi oleh dua faktor: Tipe Pesawat dan Tingkat Layanan Maskapai.',
    'aircraft_types_detail': 'Ada tiga kemungkinan tipe pesawat: PROPELLER KECIL (KURANG DARI 30 KURSI), PROPELLER BESAR (LEBIH DARI 30 KURSI) dan JET. Kementerian Perhubungan juga mengklasifikasikan maskapai Indonesia menjadi tiga jenis berdasarkan tingkat layanan mereka: maskapai LAYANAN PENUH, maskapai LAYANAN MENENGAH, dan maskapai TANPA FASILITAS / BERBIAYA RENDAH.',
    'aircraft_help': 'Jika Anda mengetahui tipe pesawat, itu bagus, Anda akan membantu sistem kami bekerja lebih cepat. Jika Anda tidak mengetahui tipe pesawat, jangan khawatir, Anda dapat memilih "TIDAK TAHU" dan aplikasi ini akan tetap memproses permintaan Anda.',

    // First option and second option links
    'first_option': 'opsi pertama',
    'second_option': 'opsi kedua',
    
    // Error messages
    'origin_required': 'Airport Asal wajib diisi',
    'destination_required': 'Airport Tujuan wajib diisi',
    'airline_required': 'Maskapai wajib diisi',
    'invalid_price': 'Harus berupa angka dengan maksimal 8 digit',
    'route_not_available': 'Rute yang dipilih tidak tersedia untuk tipe pesawat yang dipilih, silakan pilih tipe pesawat lain.',
    'no_direct_route': 'Tidak ditemukan rute langsung antara {origin} dan {destination}.',
    'airport_not_available': '{airport} tidak tersedia dalam database kami, silakan pilih bandara lain.',
    'internal_error': 'Terjadi kesalahan internal',
    'connection_error': 'Gagal terhubung ke server. Silakan coba lagi nanti.'
  }
};

type TranslationKeys = keyof typeof translations[Language];

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKeys): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 