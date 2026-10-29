// Dados dos locais do mapa (usados em src/js/pagina-mapa.js)
// "x" e "y": posição do ponto na imagem do mapa, em porcentagem (0 a 100).
// Para descobrir x/y de um lugar novo: na página do mapa, segure Alt e clique no lugar (aparece no console).
// "livros": números dos livros em que o local tem destaque (opcional)
// "imagem": arte mostrada no painel (opcional)
export const locais = [
  {
    id: 'luthadel',
    nome: 'Luthadel',
    tipo: 'Capital do Império Final',
    regiao: 'Domínio Central',
    x: 64.6,
    y: 52.8,
    descricao:
      'Sede do poder do Senhor Soberano, que governa do palácio de Kredik Shaw. As grandes casas nobres erguem suas fortalezas pela cidade, enquanto os skaa trabalham e vivem sob a chuva constante de cinzas. É o principal cenário dos dois primeiros livros.',
    livros: [1, 2],
    imagem: {
      src: '/images/luthadel-panorama.webp',
      alt: 'Telhados e torres de Luthadel cobertos pela bruma à noite',
      largura: 2000,
      altura: 851,
    },
  },
  {
    id: 'monte-tyrian',
    nome: 'Monte Tyrian',
    tipo: 'Monte de cinzas',
    regiao: 'A noroeste de Luthadel',
    x: 56.6,
    y: 47.0,
    descricao:
      'Um dos montes de cinzas, os vulcões espalhados pelo Império Final. São eles que soltam a fumaça que escurece o céu e as cinzas que caem sem parar sobre cidades e campos.',
  },
  {
    id: 'fadrex',
    nome: 'Fadrex',
    tipo: 'Cidade',
    regiao: 'Domínio Ocidental',
    x: 42.4,
    y: 48.2,
    descricao:
      'Cidade cercada por formações rochosas que funcionam quase como muralhas naturais. Ganha importância no terceiro livro, e é melhor descobrir o porquê lendo.',
    livros: [3],
  },
  {
    id: 'urteau',
    nome: 'Urteau',
    tipo: 'Cidade',
    regiao: 'Domínio Norte',
    x: 77.6,
    y: 40.2,
    descricao:
      'Cidade ligada à Casa Venture, a família de Elend, e conhecida pelos canais que cortam suas ruas. Também tem papel importante no terceiro livro.',
    livros: [3],
  },
  {
    id: 'tathingdwen',
    nome: 'Tathingdwen',
    tipo: 'Cidade',
    regiao: 'Domínio de Terris',
    x: 67.0,
    y: 7.8,
    descricao:
      'Cidade no norte frio e montanhoso do império. É a terra dos terrisanos, o povo de Sazed, que vive há séculos sob a opressão do Senhor Soberano.',
  },
];
