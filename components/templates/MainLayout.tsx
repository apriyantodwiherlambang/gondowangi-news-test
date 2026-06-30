import { ReactNode } from 'react';
import Header from '../organisms/Header';
import { Locale } from '@/core/domain/dictionaries';

interface MainLayoutProps {
  children: ReactNode;
  lang: Locale;
}

export default function MainLayout({ children, lang }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header lang={lang} />
      <main className="w-full px-0 sm:px-2 py-0 sm:py-2">
        {children}
      </main>
    </div>
  );
}