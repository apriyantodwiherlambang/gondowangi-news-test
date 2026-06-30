export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface NewsCard {
  id: number;
  slug: string;
  title: string;
  thumbnail: string;
  date: string;
}

export interface NewsArticle {
  slug: string;
  title: string;
  date: string;
  reading_time: string;
  author: Author;
  thumbnail: string;
  content_html: string;
  video_url: string;
  tags: string[];
  views: number;
  recommended_news: NewsCard[];
  related_news: NewsCard[];
  latest_news: NewsCard[];
}

export interface NewsResponse {
  status: number;
  data: NewsArticle;
}