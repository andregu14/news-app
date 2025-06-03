export type ArticleParams = {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: { 
    name: string; 
    url: string;
  };
};

export type DataParams = {
  articles: ArticleParams[];
};

export const newsData: DataParams = 
  {
    articles: [
      {
        title:
          "Analistas apontam 5 criptomoedas promissoras para investir em junho",
        description:
          "Bitcoin é o mais recomendado, mas outras altcoins também ganharam espaço",
        content:
          "Publicidade\nO Bitcoin (BTC) fechou maio com o pé no acelerador: valorizou quase 11% no mês, embalado pelo crescente apetite institucional via ETFs (fundos de índice), avanços regulatórios nos Estados Unidos e as declarações favoráveis de Donald Trump... [3959 chars]",
        url: "https://www.infomoney.com.br/onde-investir/analistas-apontam-5-criptomoedas-promissoras-para-investir-em-junho/",
        image:
          "https://www.infomoney.com.br/wp-content/uploads/2024/07/traxer-kM6QNrgo0YE-unsplash.jpg?quality=70",
        publishedAt: "2025-06-02T18:47:22Z",
        source: { name: "InfoMoney", url: "https://www.infomoney.com.br" },
      },
      {
        title:
          "Atenção! Vídeos realistas feitos com IA podem ser usados para golpes",
        description:
          "Veo 3, IA do Google, cria vídeos realistas, mas preocupa por deepfakes; empresa investe em controle para uso seguro e responsável",
        content:
          "Lançado recentemente, o Veo 3 é o modelo mais sofisticado de inteligência artificial (IA) para criação de vídeos desenvolvido pelo Google até hoje. Criada pela DeepMind, essa tecnologia tem revolucionado a produção audiovisual, entregando uma qualida... [1946 chars]",
        url: "https://tribunademinas.com.br/colunas/maistendencias/atencao-videos-realistas-feitos-com-ia-podem-ser-usados-para-golpes/",
        image:
          "https://tribunademinas.com.br/colunas/maistendencias/wp-content/uploads/2025/06/000000-3.png",
        publishedAt: "2025-06-02T18:45:00Z",
        source: {
          name: "Tribuna de Minas",
          url: "https://tribunademinas.com.br",
        },
      },
      {
        title:
          "Carros voadores: quanto vai custar voar em eVTols e por que o valor é alto?",
        description:
          "Preço de viagens com eVTols pode ultrapassar US$ 100. Entenda os motivos e o que falta para os carros voadores decolarem de vez.",
        content:
          "A chegada dos eVTOLs — veículos elétricos de decolagem e pouso vertical, também chamados de carros voadores — promete transformar a mobilidade urbana. No entanto, ainda há incertezas sobre quanto custará uma viagem nesse novo meio de transporte. A es... [2103 chars]",
        url: "https://capitalist.com.br/carros-voadores-quanto-vai-custar-voar-em-evtols-e-por-que-o-valor-e-alto/",
        image:
          "https://capitalist.com.br/wp-content/uploads/2025/04/capitalist-2025-04-17t105705-4541-1000x600.png",
        publishedAt: "2025-06-02T18:12:54Z",
        source: { name: "capitalist.com.br", url: "https://capitalist.com.br" },
      },
      {
        title:
          "Radeon RX 9060 XT começa a ser listada em lojas por valores acima do MSRP",
        description:
          "Valores preliminares para a Radeon RX 9060 XT estão acima do esperado, mas não são oficiais - confira!",
        content:
          "A AMD pretende praticar preços bem competitivos com suas novas GPUs de entrada, as Radeon RX 9060 XT. No entanto, os valores que os usuários encontram nas prateleiras nem sempre são aqueles prometidos pela empresa, e esse pode acabar sendo o caso par... [2224 chars]",
        url: "https://www.adrenaline.com.br/amd/radeon-rx-9060-xt-comeca-a-ser-listada-em-lojas-por-valores-acima-do-msrp/",
        image:
          "https://www.adrenaline.com.br/wp-content/uploads/2025/06/radeon-rx-9060-xt-precos-antecipados.jpg",
        publishedAt: "2025-06-02T17:50:00Z",
        source: { name: "Adrenaline", url: "https://www.adrenaline.com.br" },
      },
      {
        title: "Atenção! Não tire a película da tela do Nintendo Switch 2",
        description:
          "Nintendo reforça aviso para não remover película protetora do Switch 2 e garante segurança do usuário; veja motivos",
        content:
          "O Nintendo Switch 2 está batendo na porta e muito perto do lançamento, marcado para essa quinta-feira (5). A companhia japonesa já está chamando a atenção dos usuários fãs de ASMR que gostam da sensação de tirar o plástico da tela de qualquer novo ap... [2780 chars]",
        url: "https://www.adrenaline.com.br/games/atencao-nao-tire-a-pelicula-da-tela-do-nintendo-switch-2/",
        image:
          "https://www.adrenaline.com.br/wp-content/uploads/2025/04/Referencias-VRR-Somem-Site-Nintendo-Switch-2.jpg",
        publishedAt: "2025-06-02T17:39:00Z",
        source: { name: "Adrenaline", url: "https://www.adrenaline.com.br" },
      },
      {
        title:
          "Google vai investir US$ 500 milhões em reforma antitruste após ação de acionistas",
        description:
          "Portal de notícias e análises de economia, negócios, finanças, tecnologia e investimentos",
        content:
          "Reutersi Reuters https://istoedinheiro.com.br/autor/reuters 02/06/2025 - 14:33 Para compartilhar: Copie a URL: Copiar\nO Google vai gastar US$ 500 milhões ao longo de 10 anos para reformular sua estrutura de conformidade, a fim de encerrar uma ação mo... [1997 chars]",
        url: "https://istoedinheiro.com.br/google-us500-milhoes-antitruste",
        image:
          "https://istoedinheiro.com.br/wp-content/uploads/sites/17/2025/06/googlereuters.jpg",
        publishedAt: "2025-06-02T17:33:25Z",
        source: { name: "ISTOÉ DINHEIRO", url: "https://istoedinheiro.com.br" },
      },
      {
        title:
          "Principia levanta R$ 80 milhões para turbinar IA que reduz inadimplência",
        description:
          "A Principia – uma edtech focada em soluções financeiras e de ERP para educação – acaba de levantar R$ 80 milhões em uma rodada liderada pela Valor Capital",
        content:
          "A Principia – uma edtech focada em soluções financeiras e de ERP para instituições de ensino – acaba de levantar R$ 80 milhões para escalar seu produto de receita garantida e seu software de gestão acadêmica com agentes de IA.\nO aporte foi uma extens... [4287 chars]",
        url: "https://braziljournal.com/principia-levanta-r-80-milhoes-para-turbinar-ia-que-reduz-inadimplencia/",
        image:
          "https://braziljournal.com/wp-content/uploads/2025/06/Sala-de-aula-635x357.jpg",
        publishedAt: "2025-06-02T17:26:15Z",
        source: { name: "Brazil Journal", url: "https://braziljournal.com" },
      },
      {
        title:
          "Cripto: A atualização Pectra do Ethereum pode ser explorada por hackers",
        description:
          "Uma falha na atualização Pectra da Ethereum expõe carteiras de criptomoedas a ataques automatizados, alerta a Wintermute.",
        content:
          "19h15 ▪ 5 min de leitura ▪ por Luc Jose A.\nConsiderada como um avanço decisivo rumo à abstração de contas, a atualização Pectra já está alterando os equilíbrios de segurança na Ethereum. Introduzindo o padrão EIP-7702, apoiado por Vitalik Buterin, el... [5440 chars]",
        url: "https://www.cointribune.com/pt-br/crypto-a-atualizacao-pectra-do-ethereum-pode-ser-explorada-por-hackers/",
        image:
          "https://www.cointribune.com/app/uploads/2025/06/Ethereum-Pectra.png?nowebp",
        publishedAt: "2025-06-02T17:15:00Z",
        source: { name: "Cointribune", url: "https://www.cointribune.com" },
      },
      {
        title:
          'Intel reinventa a campanha "Intel Inside" com nova identidade visual',
        description:
          "A Intel apresenta sua nova campanha 'Intel Inside', focando em entender as necessidades dos clientes e trazendo inovação",
        content:
          "Recentemente, a Intel revelou uma nova fase para sua famosa campanha “Intel Inside” durante o evento Intel Vision 2025 em Las Vegas. Originalmente lançada em 1991, a campanha retorna com uma nova abordagem, destacando a relevância contínua da Intel n... [2621 chars]",
        url: "https://brasil.perfil.com/tecnologia/intel-reinventa-a-campanha-intel-inside-com-nova-identidade-visual.phtml",
        image:
          "https://brasil.perfil.com/wp-content/uploads/2025/05/intel_1746571096645.jpg",
        publishedAt: "2025-06-02T17:09:01Z",
        source: { name: "Perfil Brasil", url: "https://brasil.perfil.com" },
      },
      {
        title:
          "Por que a retirada de mais de US$ 600 milhões de ETFs de bitcoin (BTC) nos Estados Unidos é uma luz amarela para o mercado de criptomoedas",
        description:
          "Só na última sexta-feira (30), foram retirados US$ 616,22 milhões dos fundos negociados em bolsa (ETF) de bitcoin (BTC) à vista (spot) nos EUA",
        content:
          "Saques de ETFs de bitcoin (BTC) à vista acendem luz amarela para o mercado de criptomoedas (Imagem CanvaProMontagem Money Times)\nSó na última sexta-feira (30), foram retirados US$ 616,22 milhões dos fundos negociados em bolsa (ETFs, na sigla em inglê... [2725 chars]",
        url: "https://www.moneytimes.com.br/por-que-a-retirada-de-mais-de-us-600-milhoes-de-etfs-de-bitcoin-btc-nos-estados-unidos-e-uma-luz-amarela-para-o-mercado-rens/",
        image:
          "https://www.moneytimes.com.br/uploads/2025/06/saques-de-etfs-de-bitcoin-btc-a-vista-acendem-luz-amarela-para-o-mercado-de-criptomoedas-imagem-canvapromontagem-money-times.png",
        publishedAt: "2025-06-02T16:46:00Z",
        source: { name: "Money Times", url: "https://www.moneytimes.com.br" },
      },
    ],
  }

