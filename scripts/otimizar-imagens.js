// Converte as imagens originais (originais/imagens) para WebP otimizado em public/images
// Uso: npm run imagens
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const ORIGEM = 'originais/imagens';
const DESTINO = 'public/images';
const LARGURA_MAX = 2000;
const QUALIDADE = 80;

// Arquivo original -> nome novo. "simbolo: true" = desenho preto que vira PNG transparente
const imagens = [
  { de: 'robinlukasart-mistborn-fanart.jpg', para: 'luthadel-panorama' },
  { de: 'd88fff6b9639d12792d23a180754ed08.jpg', para: 'vin-moedas' },
  { de: 'chris-mcgrath-well-of-ascension-final-flat1.jpg', para: 'capa-poco-da-ascensao' },
  { de: 'marc-antoni-mestre-el-juicio-de-tensoon-marc-mestre.jpg', para: 'julgamento-tenson' },
  { de: 'johanna-rupprecht-johannarupprecht-mistbornventure-3.jpg', para: 'salao-baile' },
  { de: 'f45c99fb87835903b9851b25376482c6.jpg', para: 'equipe-kelsier' },
  { de: '91648f3c56f85ff52acae20e5ca55481.jpg', para: 'nascido-linhas-aco' },
  { de: 'nia-kovalevski-mistborn-past-and-present-final-nia-kovalevski.webp', para: 'vin-e-wax' },
  { de: '4c8c9319e730699399f0ee1077ec6db8.jpg', para: 'vin-vitral' },
  { de: '5a7303a9fb4537b8adae52ca418bfe94.jpg', para: 'kelsier-telhado' },
  { de: '6bacac1b0d078ec4b5bac9fe77626cd2.jpg', para: 'vin-sol-vermelho' },
  { de: 'artur-mosca-mbdbg-ex-action-pinpoint-artur-mosca.webp', para: 'nascido-janela' },
  { de: '447bf21e706d404a5805c7ec909564ee.jpg', para: 'kelsier-vin-bruma' },
  { de: 'huu-ha-steel-ministry-6-2000.jpg', para: 'ministerio-aco' },
  { de: 'a5aad5705d85a209aea0f89e531bf116.jpg', para: 'inquisidor-machado' },
  { de: 'bd38220611fd2aeab1fa6b6f7a5ed4ab.jpg', para: 'inquisidor-retrato' },
  { de: 'johanna-rupprecht-johannarupprecht-mistbornventure-2.jpg', para: 'fortaleza-venture' },
  { de: 'bf72c2d1928365c545708c4b9b896fe8.jpg', para: 'tabela-alomantica', simbolo: true },
  { de: 'images.png', para: 'simbolo-cravos', simbolo: true },
  {
    de: 'png-transparent-symbol-mistborn-the-final-empire-tin-metal-symbol-miscellaneous-gold-silhouette.png',
    para: 'simbolo-estanho',
    simbolo: true,
  },
];

// O mapa gera duas versões grandes (para o zoom de uma parte futura) e uma leve para o card da home
const mapa = { de: 'Mapa.jpg', larguras: [1200, 2400, 4096] };

// Miniaturas pequenas (página de créditos)
const MINIATURAS = join(DESTINO, 'miniaturas');
const LARGURA_MINIATURA = 480;

// Foto/arte comum: reduz para no máximo LARGURA_MAX e salva em WebP
async function converterArte(entrada, saida, largura = LARGURA_MAX) {
  return sharp(entrada)
    .resize({ width: largura, withoutEnlargement: true })
    .webp({ quality: QUALIDADE })
    .toFile(saida);
}

// Símbolo: os PNGs originais NÃO têm transparência (fundo branco ou quadriculado desenhado).
// Aqui o preto vira opaco e o claro vira transparente, para usar com CSS mask-image.
async function converterSimbolo(entrada, saida) {
  const { data, info } = await sharp(entrada)
    .resize({ width: LARGURA_MAX, withoutEnlargement: true })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const total = info.width * info.height;
  const rgba = Buffer.alloc(total * 4); // começa tudo zerado: preto e transparente

  for (let i = 0; i < total; i++) {
    const claro = data[i * info.channels];
    // Até 90 = traço (opaco); a partir de 170 = fundo (transparente); no meio, borda suave
    rgba[i * 4 + 3] = claro <= 90 ? 255 : claro >= 170 ? 0 : Math.round((255 * (170 - claro)) / 80);
  }

  return sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: QUALIDADE, alphaQuality: 100 })
    .toFile(saida);
}

// Mostra o resultado de cada arquivo (as medidas vão no width/height do HTML)
async function registrar(nome, resultado) {
  const kb = Math.round((await stat(join(DESTINO, nome))).size / 1024);
  console.log(`${nome.padEnd(32)} ${String(resultado.width).padStart(4)}x${resultado.height}  ${kb} KB`);
}

await mkdir(MINIATURAS, { recursive: true });

for (const imagem of imagens) {
  const nome = `${imagem.para}.webp`;
  const entrada = join(ORIGEM, imagem.de);
  const saida = join(DESTINO, nome);

  if (imagem.simbolo) {
    await registrar(nome, await converterSimbolo(entrada, saida));
  } else {
    await registrar(nome, await converterArte(entrada, saida));
    await converterArte(entrada, join(MINIATURAS, nome), LARGURA_MINIATURA);
  }
}

for (const largura of mapa.larguras) {
  const nome = `mapa-${largura}.webp`;
  const resultado = await converterArte(join(ORIGEM, mapa.de), join(DESTINO, nome), largura);
  await registrar(nome, resultado);
}
await converterArte(join(ORIGEM, mapa.de), join(MINIATURAS, 'mapa.webp'), LARGURA_MINIATURA);
console.log(`Miniaturas (${LARGURA_MINIATURA}px) salvas em ${MINIATURAS}`);
