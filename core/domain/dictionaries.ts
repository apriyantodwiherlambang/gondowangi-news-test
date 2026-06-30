export const dictionaries = {
  id: {
    navigation: {
      home: "Beranda",
      about: "Tentang Kami",
      brands: "Brands",
      career: "Karir",
      news: "Berita",
    },
    meta: {
      readCount: "Dibaca:",
      times: "kali"
    }
  },
  en: {
    navigation: {
      home: "Home",
      about: "About Us",
      brands: "Brands",
      career: "Career",
      news: "News",
    },
    meta: {
      readCount: "Read:",
      times: "times"
    }
  },
};

export type Locale = keyof typeof dictionaries;