# 📰 News App

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.79.3-blue.svg?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.11-black.svg?logo=expo)](https://expo.dev/)

Um aplicativo de notícias desenvolvido com React Native + Expo que permite visualizar, buscar, filtrar e favoritar notícias em tempo real.

## 🌟 Features

- ✨ Interface moderna e intuitiva
- 📱 Design responsivo otimizado para Android
- 🔍 Busca por palavras-chave
- 🏷️ Filtros por categoria
- ❤️ Sistema de favoritos
- 📶 Modo offline com cache
- 🌙 Tema escuro/claro
- ♿ Acessibilidade
- 🚀 Scroll infinito
- 🔄 Pull-to-refresh

## 🛠️ Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation](https://reactnavigation.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [GNews API](https://gnews.io/)

## 📱 Screenshots

<div>

| *Tela Inicial* | *Menu* |
|:---:|:---:|
<img src="https://i.ibb.co/wF3SG0JH/home.png" width="300px"> | <img src="https://i.ibb.co/NdwdFG3M/menu.png" width="300px"> |

| *Detalhes da Notícia* | *Favoritos* |
|:---:|:---:|
<img src="https://i.ibb.co/6049D80K/Screenshot-1750205650.png" width="300px"> | <img src="https://i.ibb.co/zyCF7DZ/favorites-dark-theme.png" width="300px"> |

</div>

## 🚀 Instalação

- Faça o dowload do apk em: [https://workupload.com/file/xVgXzuF37V4](https://workupload.com/file/xVgXzuF37V4)

- Instale o apk no emulador ou dispositivo físico

## 🏗️ Arquitetura

O projeto segue uma arquitetura modular com separação clara de responsabilidades:

```
├── app/                  # Screens do Expo Router
├── components/          # Componentes reutilizáveis
├── constants/          # Constantes e configurações
├── services/          # Serviços de API
├── store/            # Redux store e slices
├── utils/           # Funções utilitárias
└── ...
```

## 📝 Decisões Técnicas

- **Expo**: Escolhido pela facilidade de setup e desenvolvimento
- **TypeScript**: Adiciona type-safety e melhora a manutenibilidade
- **Redux Toolkit**: Gerenciamento de estado centralizado e cache
- **Expo Router**: Navegação file-system based e type-safe
- **AsyncStorage**: Armazenamento local para favoritos e cache
- **Jest**: Framework de testes robusto e bem documentado

## 🎯 Desafios e Soluções

1. **Performance**

   - Implementação de scroll infinito otimizado
   - Lazy loading de imagens
   - Memoização de componentes

2. **Offline Save**

   - Cache de notícias com AsyncStorage
   - Indicadores de estado offline

3. **UX**
   - Feedback visual para todas as ações
   - Skeletons durante carregamento
   - Tratamento de erros amigável
   - Pull-to-refresh

## 📫 Contato

André Gustavo Sampaio - andregustavo147@gmail.com - [Linkedin](https://www.linkedin.com/in/andr%C3%A9-sampaio1/)

Link do projeto: [https://github.com/andregu14/news-app](https://github.com/andregu14/news-app)
