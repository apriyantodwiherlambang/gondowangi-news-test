"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Locale } from "@/core/domain/dictionaries";
import { NewsArticle } from "@/core/domain/models";

export default function BeritaListPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params) as { lang: Locale };
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        const res = await fetch(`/api/berita-${lang}.json`);
        const result = await res.json();
        setNews(result.data);
      } catch (error) {
        console.error("Error fetching news list:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllNews();
  }, [lang]);

  if (isLoading) return <div className="text-center py-20 text-gray-500">Memuat indeks berita...</div>;
  if (!news || news.length === 0) return <div className="text-center py-20 text-red-500">Data tidak ditemukan.</div>;

  const headline = news[0];
  const newsList = news.slice(1);

  const ui = lang === 'id' ? {
    indexTitle: "Indeks Berita",
    highlight: "Sorotan",
    latest: "Berita Terkini",
    subscribe: "Dapatkan Info Terbaru",
    emailPlaceholder: "Ketik Email Anda...",
    btnSubscribe: "Langganan",
    popular: "Terpopuler"
  } : {
    indexTitle: "News Index",
    highlight: "Highlight",
    latest: "Latest News",
    subscribe: "Get Latest Updates",
    emailPlaceholder: "Your Email...",
    btnSubscribe: "Subscribe",
    popular: "Popular News"
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 border-b-2 border-[#0b5932] inline-block pb-2">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">{ui.indexTitle}</h1>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-9">

            <Link href={`/${lang}/berita/${headline.slug}`} className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8 sm:mb-10 hover:shadow-lg transition duration-300">
              <div className="relative h-[220px] sm:h-[300px] md:h-[400px] overflow-hidden">
                <img src={headline.thumbnail} alt={headline.title} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-600 text-white text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded uppercase tracking-widest animate-pulse">{ui.highlight}</div>
              </div>
              <div className="p-4 sm:p-6 md:p-8">
                <span className="text-xs font-bold text-[#0b5932] bg-[#0b5932]/10 px-3 py-1.5 rounded mb-3 sm:mb-4 inline-block">{headline.tags[0]}</span>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 group-hover:text-[#0b5932] leading-tight mb-3 sm:mb-4 transition">{headline.title}</h2>
                <div
                  className="text-gray-600 mb-4 line-clamp-2 text-sm"
                  dangerouslySetInnerHTML={{ __html: headline.content_html.substring(0, 150) + "..." }}
                />
                <p className="text-xs text-gray-400 font-semibold">{headline.date}</p>
              </div>
            </Link>

            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 uppercase tracking-wide border-b-2 border-gray-200 pb-2">{ui.latest}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
              {newsList.map(item => (
                <Link href={`/${lang}/berita/${item.slug}`} key={item.slug} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300 flex flex-col">
                  <div className="aspect-video overflow-hidden">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    <span className="text-[10px] font-bold text-[#0b5932] uppercase tracking-wider mb-2 block">{item.tags[0]}</span>
                    <h4 className="text-sm sm:text-base font-bold text-gray-800 group-hover:text-[#0b5932] leading-snug mb-3 line-clamp-3 flex-1">{item.title}</h4>
                    <p className="text-[11px] text-gray-500 font-semibold mt-auto">{item.date}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="bg-[#0b5932] p-6 sm:p-8 rounded-2xl text-center text-white shadow-lg mb-8 lg:mb-0">
              <h4 className="text-xl sm:text-2xl font-black mb-2 uppercase tracking-wide">{ui.subscribe}</h4>
              <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2 mt-6">
                <input type="email" placeholder={ui.emailPlaceholder} className="w-full sm:flex-1 px-4 py-3 rounded-lg text-gray-900 bg-white placeholder-gray-500 text-sm focus:outline-none shadow-inner" />
                <button className="w-full sm:w-auto bg-emerald-600 text-white border border-emerald-400 font-bold px-6 py-3 rounded-lg hover:bg-emerald-500 transition text-sm whitespace-nowrap">{ui.btnSubscribe}</button>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-8">
              <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2 border-b-2 border-[#0b5932] pb-2 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  {ui.popular}
                </h3>
                <ul className="space-y-4">
                  {news.map((item, index) => (
                    <li key={item.slug} className="flex gap-3 group cursor-pointer items-start border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                      <span className="text-2xl sm:text-3xl font-black text-gray-200 group-hover:text-[#0b5932]/30 transition leading-none w-7 sm:w-8 text-center shrink-0">0{index + 1}</span>
                      <Link href={`/${lang}/berita/${item.slug}`} className="font-bold text-gray-700 group-hover:text-[#0b5932] text-xs leading-snug transition mt-0.5 line-clamp-2">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}