import { create } from 'zustand';
import { dummyArticles } from '@/data/articles';
import type { Article } from '@/types';

interface ArticleStore {
  articles: Article[];
  add: (article: Article) => void;
  update: (article: Article) => void;
  remove: (id: string) => void;
}

export const useArticleStore = create<ArticleStore>((set) => ({
  articles: dummyArticles,
  add: (article) => set((s) => ({ articles: [article, ...s.articles] })),
  update: (article) => set((s) => ({ articles: s.articles.map((a) => (a.id === article.id ? article : a)) })),
  remove: (id) => set((s) => ({ articles: s.articles.filter((a) => a.id !== id) })),
}));
