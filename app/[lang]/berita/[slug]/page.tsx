"use client";

import { useEffect, useState, use, useRef } from "react";
import Link from "next/link";
import { Locale, dictionaries } from "@/core/domain/dictionaries";
import { NewsArticle } from "@/core/domain/models";

export default function BeritaPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
  const { lang, slug } = use(params) as { lang: Locale, slug: string };

  const [berita, setBerita] = useState<NewsArticle | null>(null);
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);
  const [viewCount, setViewCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const dict = dictionaries[lang].meta;
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const res = await fetch(`/api/berita-${lang}.json`);
        const result = await res.json();
        const newsArray = result.data;

        setAllNews(newsArray);

        const foundArticle = newsArray.find((item: any) => item.slug === slug);

          if (foundArticle) {
            setBerita(foundArticle);

            const cookieKey = `gondowangi_v4_read_session_${slug}`;
            const hasCountedInSession = document.cookie.includes(`${cookieKey}=true`);
            const syncViews = async () => {
              try {
                let finalViews = foundArticle.views;

                if (!hasCountedInSession) {
                  const res = await fetch(`/api/views`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slug })
                  });
                  const data = await res.json();
                  finalViews = data.totalViews;

                  document.cookie = `${cookieKey}=true; path=/; max-age=86400; SameSite=Lax`;
                } else {
                  const res = await fetch(`/api/views?slug=${slug}`);
                  const data = await res.json();
                  finalViews = data.totalViews;
                }
                setViewCount(finalViews);
              } catch (err) {
                console.error("Gagal sync:", err);
                setViewCount(foundArticle.views);
              }
            };

            syncViews();
          } else {
            setBerita(newsArray[0]);
            setViewCount(newsArray[0].views);
          }
      } catch (error) {
        console.error("Error loading page data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPageData();

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lang, slug]);

  const slide = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 320;
      sliderRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (isLoading) return <div className="text-center py-20 text-gray-500">{lang === 'id' ? 'Memuat berita...' : 'Loading news...'}</div>;
  if (!berita) return <div className="text-center py-20 text-red-500">{lang === 'id' ? 'Gagal memuat data.' : 'Failed to load data.'}</div>;

  const recommendedList = allNews.slice(1);

  return (
    <>
      <div className="fixed top-[64px] left-0 h-1 bg-[#0b5932] z-50 transition-all duration-150" style={{ width: `${scrollProgress}%` }} />

      <div className="max-w-[1440px] mx-auto lg:grid lg:grid-cols-12 lg:gap-8 px-3 sm:px-5 lg:px-6 py-4 sm:py-6">
        <div className="lg:col-span-9 bg-white p-3 sm:p-5 md:p-6 lg:p-8 rounded-xl shadow-sm border border-gray-100">

          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3 gap-2">
            <nav className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center space-x-2 overflow-x-auto whitespace-nowrap">
              <Link href={`/${lang}/berita`} className="hover:text-[#0b5932] transition text-gray-500 font-bold">
                {lang === 'id' ? 'Berita' : 'News'}
              </Link>
              <span>/</span>
              <span className="text-[#0b5932]">{lang === 'id' ? 'Teknologi' : 'Technology'}</span>
            </nav>
            <span className="shrink-0 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest animate-pulse">Live</span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4 tracking-tight">{berita.title}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs md:text-sm text-gray-500 border-b border-gray-100 pb-4">
              <img src={berita.author.avatar} alt={berita.author.name} className="w-7 h-7 rounded-full object-cover border border-gray-200 shadow-sm" />
              <span className="font-bold text-[#0b5932]">{berita.author.name}</span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span>{berita.date}</span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="flex items-center gap-1 bg-[#0b5932]/10 text-[#0b5932] px-2 py-0.5 rounded text-xs font-semibold">⏳ {berita.reading_time} {lang === 'id' ? 'Baca' : 'Read'}</span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="text-gray-600">👁️ {dict.readCount} <strong className="text-gray-900">{viewCount}</strong> {dict.times}</span>
            </div>
          </div>

          <div className="mb-8 rounded-xl overflow-hidden shadow-md">
            <img src={berita.thumbnail} alt={berita.title} className="w-full h-auto max-h-[220px] sm:max-h-[350px] lg:max-h-[550px] object-cover" />
          </div>

          <div
            className="prose prose-sm sm:prose-base lg:prose-lg prose-emerald max-w-none text-gray-800 leading-relaxed text-justify mb-8 prose-p:mb-6 prose-strong:text-[#0b5932] prose-strong:font-bold"
            dangerouslySetInnerHTML={{ __html: berita.content_html }}
          />

          <div className="mb-8">
            <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-gray-100" style={{ paddingTop: '56.25%' }}>
              <iframe className="absolute top-0 left-0 w-full h-full" src={berita.video_url} title="YouTube video player" frameBorder="0" allowFullScreen></iframe>
            </div>
          </div>

          <div className="mb-6 bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100">
            <h4 className="font-bold text-[#0b5932] uppercase tracking-wide mb-3 text-sm">{lang === 'id' ? 'Berita Terkait' : 'Related News'}</h4>
            <ul className="space-y-3">
              {allNews.filter(n => n.slug !== slug).slice(0, 2).map((item) => (
                <li key={item.slug} className="flex items-start gap-2 group cursor-pointer">
                  <span className="text-[#0b5932] shrink-0">▪</span>
                  <Link href={`/${lang}/berita/${item.slug}`} className="text-gray-800 group-hover:text-[#0b5932] font-semibold text-sm hover:underline">{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 relative group">
            <div className="flex items-center justify-between border-b-2 border-[#0b5932] pb-2 mb-6 gap-2">
              <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                {lang === 'id' ? 'Rekomendasi Untuk Anda' : 'Recommended For You'}
              </h3>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => slide('left')} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-[#0b5932] hover:text-white flex items-center justify-center transition shadow-sm font-bold">←</button>
                <button onClick={() => slide('right')} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-[#0b5932] hover:text-white flex items-center justify-center transition shadow-sm font-bold">→</button>
              </div>
            </div>

            <div ref={sliderRef} className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 snap-x snap-mandatory scrollbar-hide">
              {recommendedList.map((item) => (
                <Link href={`/${lang}/berita/${item.slug}`} key={item.slug} className="min-w-[240px] sm:min-w-[280px] lg:min-w-[300px] snap-start group cursor-pointer bg-gray-50 rounded-xl overflow-hidden hover:shadow-md border border-gray-100 transition duration-300 block">
                  <div className="overflow-hidden h-32 sm:h-40">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="text-[11px] font-bold text-[#0b5932] mb-1">{item.date}</p>
                    <h4 className="font-bold text-gray-800 group-hover:text-[#0b5932] transition leading-snug text-sm line-clamp-2">{item.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-[#0b5932] p-5 sm:p-6 rounded-2xl text-center text-white shadow-lg">
            <h4 className="text-lg sm:text-xl font-black mb-1 uppercase tracking-wide">{lang === 'id' ? 'Dapatkan Info Terbaru' : 'Get Updates'}</h4>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2 mt-4">
              <input type="email" placeholder={lang === 'id' ? 'Ketik Email Anda...' : 'Your Email...'} className="w-full sm:flex-1 px-4 py-2.5 rounded-lg text-gray-900 bg-white placeholder-gray-500 text-sm focus:outline-none shadow-inner" />
              <button className="w-full sm:w-auto bg-emerald-600 text-white border border-emerald-400 font-bold px-5 py-2.5 rounded-lg hover:bg-emerald-500 transition text-sm whitespace-nowrap">{lang === 'id' ? 'Langganan' : 'Subscribe'}</button>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-3 mt-8 lg:mt-0">
          <div className="lg:sticky lg:top-24 space-y-8">

            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2 border-b-2 border-[#0b5932] pb-2 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                {lang === 'id' ? 'Berita Terpopuler' : 'Popular News'}
              </h3>
              <ul className="space-y-4">
                {allNews.map((item, index) => (
                  <li key={item.slug} className="flex gap-3 group cursor-pointer items-start border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <span className="text-2xl sm:text-3xl font-black text-gray-200 group-hover:text-[#0b5932]/30 transition leading-none w-7 sm:w-8 text-center shrink-0">0{index + 1}</span>
                    <Link href={`/${lang}/berita/${item.slug}`} className="font-bold text-gray-700 group-hover:text-[#0b5932] text-xs leading-snug transition mt-0.5 line-clamp-2">{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2 border-b-2 border-gray-200 pb-2 uppercase tracking-wider">
                ⏱️ {lang === 'id' ? 'Berita Terbaru' : 'Latest News'}
              </h3>
              <div className="space-y-4">
                {allNews.map((item) => (
                  <div key={item.slug} className="flex gap-3 group cursor-pointer items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                    <div>
                      <Link href={`/${lang}/berita/${item.slug}`} className="font-bold text-gray-700 group-hover:text-[#0b5932] text-xs leading-snug transition line-clamp-2 mb-1">{item.title}</Link>
                      <p className="text-[10px] text-gray-400 font-semibold">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}