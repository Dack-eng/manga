export interface Chapter {
  id: string;
  number: number;
  title: string;
  date: string;
}

export interface Manga {
  id: string;
  title: string;
  cover: string;
  banner: string;
  rating: number;
  chapters_count: number;
  category: string;
  status: "Үргэлжилж буй" | "Дууссан";
  author: string;
  description: string;
  chapters: Chapter[];
}

export const MOCK_MANGA_DATA: Record<string, Manga> = {
  "sky-boxer": {
    id: "sky-boxer",
    title: "Тэнгэрийн Боксчин (Sky Boxer)",
    cover: "/covers/sky-boxer.png",
    banner: "/covers/sky-boxer.png",
    rating: 4.9,
    chapters_count: 124,
    category: "Action",
    status: "Үргэлжилж буй",
    author: "Shimamoto",
    description: "Дэлхийн хамгийн ширүүн тулаанч болохын төлөөх нэгэн залуугийн аялал. Тэрээр тэнгэрт дүүлэн нисэх мэт хурдтай цохилтоороо алдартай.",
    chapters: [
      { id: "124", number: 124, title: "Эцсийн тулаан", date: "2026-03-15" },
      { id: "123", number: 123, title: "Шийдвэрлэх мөч", date: "2026-03-10" },
      { id: "122", number: 122, title: "Тэнгэрийн хаалга", date: "2026-03-05" },
    ],
  },
  "shadow-blade": {
    id: "shadow-blade",
    title: "Сүүдрийн Ир (Shadow Blade)",
    cover: "/covers/shadow-blade.png",
    banner: "/covers/shadow-blade.png",
    rating: 4.8,
    chapters_count: 86,
    category: "Adventure",
    status: "Үргэлжилж буй",
    author: "Kurosawa",
    description: "Нууцлаг сүүдрийн ертөнцөөс ирсэн дайчин эр. Түүний ир сүүдрээс ч хурдан бөгөөд аюултай.",
    chapters: [
      { id: "86", number: 86, title: "Харанхуйн эзэн", date: "2026-03-12" },
      { id: "85", number: 85, title: "Сүүдрийн бүжиг", date: "2026-03-08" },
    ],
  },
  "urban-mage": {
    id: "urban-mage",
    title: "Хотын Шидтэн (Urban Mage)",
    cover: "/covers/urban-mage.png",
    banner: "/covers/urban-mage.png",
    rating: 4.7,
    chapters_count: 45,
    category: "Fantasy",
    status: "Үргэлжилж буй",
    author: "Aida",
    description: "Орчин үеийн Токио хотын гудамжинд маш том ид шидийн нууц оршиж байдаг. Нэгэн сурагч хүү санамсаргүйгээр энэ ертөнцийг нээх болно.",
    chapters: [
      { id: "45", number: 45, title: "Неон гэрэлт шид", date: "2026-03-14" },
      { id: "44", number: 44, title: "Нууц агент", date: "2026-03-09" },
    ],
  },
};
