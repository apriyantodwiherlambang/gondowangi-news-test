"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dictionaries, Locale } from '@/core/domain/dictionaries';

interface HeaderProps {
  lang: Locale;
}

export default function Header({ lang }: HeaderProps) {
  const dict = dictionaries[lang].navigation;
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="flex-shrink-0 flex items-center">
          <Link href="/berita" className="text-xl sm:text-2xl font-black text-[#0b5932] tracking-tight">
            Gondowangi
          </Link>
        </div>

        <nav className="hidden lg:flex flex-1 justify-center items-center space-x-8">
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

        <div className="flex-shrink-0 flex items-center gap-3">
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

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-[#0b5932] hover:bg-gray-100 transition"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out px-4 sm:px-6 ${
          isMenuOpen ? 'max-h-60 opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col space-y-1 pt-2 border-t border-gray-100">
          <span className="text-gray-400 cursor-not-allowed font-medium px-2 py-2">{dict.home}</span>
          <span className="text-gray-400 cursor-not-allowed font-medium px-2 py-2">{dict.about}</span>
          <span className="text-gray-400 cursor-not-allowed font-medium px-2 py-2">{dict.brands}</span>
          <span className="text-gray-400 cursor-not-allowed font-medium px-2 py-2">{dict.career}</span>

          <Link
            href="/berita"
            onClick={() => setIsMenuOpen(false)}
            className="text-[#0b5932] font-bold px-2 py-2"
          >
            {dict.news}
          </Link>
        </nav>
      </div>
    </header>
  );
}