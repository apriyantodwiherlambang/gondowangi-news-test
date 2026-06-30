"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dictionaries, Locale } from '@/core/domain/dictionaries';

interface HeaderProps {
  lang: Locale;
}

export default function Header({ lang }: HeaderProps) {
  const dict = dictionaries[lang].navigation;
  const pathname = usePathname();
  const getRedirectPath = (targetLang: 'id' | 'en') => {
    if (!pathname) return `/${targetLang}/berita`;
    
    const segments = pathname.split('/');
    
    if (segments[1] === 'id' || segments[1] === 'en') {
      segments[1] = targetLang;
      return segments.join('/');
    }
    
    return `/${targetLang}/berita`;
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/berita" className="text-2xl font-black text-[#0b5932] tracking-tight">
              Gondowangi
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <span className="text-gray-400 cursor-not-allowed font-medium">{dict.home}</span>
            <span className="text-gray-400 cursor-not-allowed font-medium">{dict.about}</span>
            <span className="text-gray-400 cursor-not-allowed font-medium">{dict.brands}</span>
            <span className="text-gray-400 cursor-not-allowed font-medium">{dict.career}</span>
            
            <Link 
              href="/berita" 
              className="text-[#0b5932] font-bold border-b-2 border-[#0b5932] pb-1"
            >
              {dict.news}
            </Link>
          </nav>

          <div className="flex items-center space-x-3 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
            <Link 
              href={getRedirectPath('id')} 
              className={`text-xs transition ${lang === 'id' ? 'font-black text-[#0b5932]' : 'text-gray-400 hover:text-gray-700 font-medium'}`}
            >
              ID
            </Link>
            <span className="text-gray-300">|</span>
            <Link 
              href={getRedirectPath('en')} 
              className={`text-xs transition ${lang === 'en' ? 'font-black text-[#0b5932]' : 'text-gray-400 hover:text-gray-700 font-medium'}`}
            >
              EN
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}