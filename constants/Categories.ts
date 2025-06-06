export type NewsCategory =
  | "general"
  | "world"
  | "nation"
  | "business"
  | "technology"
  | "entertainment"
  | "sports"
  | "science"
  | "health";

export type CategoryItem = {
  category: NewsCategory;
  label: string;
  image: any;
};

export const CATEGORIES: CategoryItem[] = [
  {
    category: "technology",
    label: "Tecnologia",
    image: require("@/assets/images/tecnologia.jpg"),
  },
  {
    category: "business",
    label: "Economia",
    image: require("@/assets/images/economia.jpg"),
  },
  {
    category: "science",
    label: "Ciência",
    image: require("@/assets/images/ciencia.jpg"),
  },
  {
    category: "sports",
    label: "Esportes",
    image: require("@/assets/images/esporte.jpg"),
  },
  {
    category: "nation",
    label: "Política",
    image: require("@/assets/images/politica.jpeg"),
  },
  {
    category: "entertainment",
    label: "Entretenimento",
    image: require("@/assets/images/entretenimento.jpg"),
  },
  {
    category: "health",
    label: "Saúde",
    image: require("@/assets/images/saude.jpg"),
  },
  {
    category: "world",
    label: "Mundo",
    image: require("@/assets/images/mundo.jpg"),
  },
];

// Mapeamento para busca rápida
export const CATEGORY_TO_LABEL: Record<NewsCategory, string> = CATEGORIES.reduce(
  (acc, item) => {
    acc[item.category] = item.label;
    return acc;
  },
  {} as Record<NewsCategory, string>
);

export const LABEL_TO_CATEGORY: Record<string, NewsCategory> = CATEGORIES.reduce(
  (acc, item) => {
    acc[item.label] = item.category;
    return acc;
  },
  {} as Record<string, NewsCategory>
);

// Função para verificar se é categoria
export const isNewsCategory = (term: string): term is NewsCategory => {
  return CATEGORIES.some(item => item.category === term);
};

// Função para obter o label da categoria
export const getCategoryLabel = (category: string): string => {
  return CATEGORY_TO_LABEL[category as NewsCategory] || category;
};

// Função para obter a categoria do label
export const getCategoryFromLabel = (label: string): NewsCategory | null => {
  return LABEL_TO_CATEGORY[label] || null;
};