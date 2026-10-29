// Gera os ícones do site a partir do símbolo oficial, vetorizado com potrace
// Uso: npm run icones
import sharp from 'sharp';
import potrace from 'potrace';
import { writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { promisify } from 'node:util';

// Usa o PNG original se existir; senão, a versão otimizada (mesma resolução, transparência sem perda)
const ORIGINAL = existsSync('originais/imagens/images.png')
  ? 'originais/imagens/images.png'
  : 'public/images/simbolo-cravos.webp';
const LATAO = '#d6b67e';
const LATAO_ESCURO = '#7a5c2e'; // usado no favicon quando a aba do navegador é clara
const CARVAO = '#0b0a09';

const vetorizar = promisify(potrace.trace);

// 1. Limpa o PNG: preto e branco puro (some o quadriculado falso do fundo),
//    corta as sobras em volta do desenho e deixa uma pequena folga
const limpo = await sharp(ORIGINAL)
  .flatten({ background: '#fff' })
  .greyscale()
  .threshold(128)
  .trim()
  .extend({ top: 10, bottom: 10, left: 10, right: 10, background: '#fff' })
  .png()
  .toBuffer();

const { width: largura, height: altura } = await sharp(limpo).metadata();

// 2. Vetoriza: o potrace transforma os pixels pretos em curvas (um <path> SVG)
const svgPotrace = await vetorizar(limpo, { threshold: 128, turdSize: 4, optTolerance: 0.3 });
const caminho = svgPotrace.match(/ d="([^"]+)"/)[1];

// 3. viewBox quadrado com o desenho centralizado (ícones são quadrados)
const lado = Math.max(largura, altura);
const viewBox = `${-(lado - largura) / 2} ${-(lado - altura) / 2} ${lado} ${lado}`;

// Monta um SVG do símbolo; "extra" permite colocar width/height.
// "contorno" engrossa o traço: em 16px os cravos finos sumiriam sem isso
function svgSimbolo(cor, extra = '', contorno = 0) {
  const traco = contorno ? ` stroke="${cor}" stroke-width="${contorno}" stroke-linejoin="round"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" ${extra}><path fill="${cor}"${traco} fill-rule="evenodd" d="${caminho}"/></svg>`;
}

// Contorno usado só nos ícones pequenos (favicon.svg e favicon-32.png)
const CONTORNO_PEQUENO = 10;

// favicon.svg: latão com fundo transparente; numa aba clara, troca para um latão escuro legível
const favicon = svgSimbolo(LATAO, '', CONTORNO_PEQUENO).replace(
  '<path',
  `<style>@media (prefers-color-scheme: light) { path { fill: ${LATAO_ESCURO}; stroke: ${LATAO_ESCURO}; } }</style><path`,
);
await writeFile('public/favicon.svg', favicon);

// Versão sem a regra de tema, sempre em latão (usada no hero da home)
await writeFile('public/images/simbolo-oficial.svg', svgSimbolo(LATAO));

// Path para o componente emblema.js (header e footer)
await writeFile(
  'src/components/simbolo-oficial.js',
  `// Arquivo GERADO por scripts/gerar-icones.js (npm run icones). Não edite à mão.\n` +
    `// Símbolo oficial de Mistborn vetorizado com potrace.\n` +
    `export const VIEWBOX = '${viewBox}';\n` +
    `export const CAMINHO = '${caminho}';\n`,
);

// 4. PNGs: símbolo em latão sobre fundo carvão, com margem interna ("margem" = fração de cada lado)
async function gerarPng(tamanho, margem, saida, contorno = 0) {
  const interno = Math.round(tamanho * (1 - 2 * margem));
  const simbolo = await sharp(Buffer.from(svgSimbolo(LATAO, `width="${interno}" height="${interno}"`, contorno)))
    .png()
    .toBuffer();

  await sharp({ create: { width: tamanho, height: tamanho, channels: 4, background: CARVAO } })
    .composite([{ input: simbolo, gravity: 'center' }])
    .png()
    .toFile(saida);

  console.log(`${saida} (${tamanho}px)`);
}

await gerarPng(32, 0.06, 'public/favicon-32.png', CONTORNO_PEQUENO);
await gerarPng(180, 0.14, 'public/apple-touch-icon.png');
await gerarPng(512, 0.18, 'public/icon-512.png');

// 5. Manifesto: nome e ícones usados quando o site é instalado no celular
const manifesto = {
  name: 'Nascidos da Bruma',
  short_name: 'Nascidos',
  description: 'Site de fã sobre Mistborn, de Brandon Sanderson',
  lang: 'pt-BR',
  start_url: '/',
  display: 'standalone',
  background_color: CARVAO,
  theme_color: CARVAO,
  icons: [
    { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
};
await writeFile('public/site.webmanifest', JSON.stringify(manifesto, null, 2) + '\n');

console.log(`favicon.svg, simbolo-oficial.svg e simbolo-oficial.js gerados (path com ${caminho.length} caracteres)`);
