export type DataParams = {
  id: number;
  title: string;
  description: string;
  image: string;
  department: string;
  time: string;
  created_at?: string;
  author?: string;
};

export const newsData: DataParams[] = [
  {
    id: 1,
    title: "Nova IA da Google Promete Revolucionar a Tradução Automática",
    description:
      "O Google anunciou um novo modelo de inteligência artificial capaz de realizar traduções com precisão quase humana em mais de 100 idiomas, superando modelos anteriores. \n\nSegundo a empresa, o novo sistema utiliza tecnologia de aprendizado profundo e foi treinado com bilhões de exemplos de traduções reais, permitindo que ele compreenda melhor o contexto e as nuances culturais de cada idioma.",
    image: `https://picsum.photos/400/200?random=10`,
    department: "Tecnologia",
    time: "Há 35 minutos",
  },
  {
    id: 2,
    title: "Bolsa de Valores Opera em Alta com Otimismo no Mercado Global",
    description:
      "Investidores reagem positivamente a dados econômicos internacionais, impulsionando os principais índices da bolsa em um dia de negociações voláteis. \n\nAnalistas apontam que a recuperação econômica em mercados-chave e as perspectivas de redução nas taxas de juros são os principais fatores por trás do otimismo dos investidores, que já acumulam ganhos significativos no ano.",
    image: `https://picsum.photos/400/200?random=11`,
    department: "Economia",
    time: "Há 2 horas",
  },
  {
    id: 3,
    title: "Descoberta de Exoplaneta Similar à Terra Anima Astrônomos",
    description:
      "Um novo exoplaneta com tamanho e temperatura potencialmente semelhantes aos da Terra foi identificado por telescópio espacial, aumentando as esperanças na busca por vida fora do sistema solar. \n\nO planeta, localizado a cerca de 40 anos-luz da Terra, orbita uma estrela anã vermelha e está situado na chamada 'zona habitável', região onde as condições podem permitir a existência de água líquida na superfície.",
    image: `https://picsum.photos/400/200?random=12`,
    department: "Ciência",
    time: "Há 8 horas",
  },
  {
    id: 4,
    title: "Final Eletrizante Marca o Fim do Campeonato Nacional de Futebol",
    description:
      "Com gol nos últimos minutos, a equipe da casa conquistou o título nacional em uma partida emocionante que levantou a torcida presente no estádio. \n\nA vitória histórica veio após uma virada impressionante no segundo tempo, com destaque para a atuação do jovem atacante que marcou dois gols decisivos, consolidando sua posição como artilheiro da competição.",
    image: `https://picsum.photos/400/200?random=14`,
    department: "Esportes",
    time: "Há 1 dia",
  },
];