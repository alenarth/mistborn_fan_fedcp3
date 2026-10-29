// Mapa interativo: cria os marcadores, dá zoom no local escolhido e abre o painel com os detalhes
import { locais } from '../data/locais.js';

const TITULOS_LIVROS = { 1: 'O Império Final', 2: 'O Poço da Ascensão', 3: 'O Herói das Eras' };

// Zoom ao abrir um local (no celular o mapa é pequeno, então aproxima um pouco mais)
const ESCALA_DESKTOP = 1.8;
const ESCALA_CELULAR = 2.4;

const secao = document.getElementById('mapa');
const area = document.getElementById('mapa-area');
const palco = document.getElementById('mapa-palco');
const listaMarcadores = document.getElementById('mapa-marcadores');
const painel = document.getElementById('painel');
const celular = window.matchMedia('(max-width: 767px)');

// Atalho para pegar elementos do painel pelo id
const el = (id) => document.getElementById(id);

let indiceAtual = -1; // local aberto no painel (-1 = painel fechado)

// ---------- 1. Marcadores ----------
// Cada local vira um <button> posicionado com left/top em %:
// como o palco tem o mesmo aspect-ratio da imagem, o ponto fica no lugar em qualquer tamanho de tela
listaMarcadores.innerHTML = locais
  .map(
    (local, i) => `
      <li class="mapa__ponto" style="left: ${local.x}%; top: ${local.y}%">
        <button type="button" class="marcador" data-indice="${i}"
                aria-label="${local.nome}, ${local.tipo}" aria-expanded="false" aria-controls="painel">
          <span class="marcador__nome" aria-hidden="true">${local.nome}</span>
        </button>
      </li>`,
  )
  .join('');

const marcadores = [...listaMarcadores.querySelectorAll('.marcador')];

// ---------- 2. Painel ----------
function preencherPainel(local) {
  el('painel-tipo').textContent = `${local.tipo} · ${local.regiao}`;
  el('painel-nome').textContent = local.nome;
  el('painel-descricao').textContent = local.descricao;

  // Livros: o bloco só aparece se o local tiver livros cadastrados
  const livros = local.livros ?? [];
  el('painel-livros').hidden = livros.length === 0;
  el('painel-lista-livros').innerHTML = livros
    .map((n) => `<li class="border border-latao/40 px-3 py-1 font-titulo text-sm text-latao-claro">${TITULOS_LIVROS[n]}</li>`)
    .join('');

  // Imagem: mostra a arte do local ou, se não houver, um símbolo no lugar
  const imagem = el('painel-imagem');
  if (local.imagem) {
    imagem.src = local.imagem.src;
    imagem.alt = local.imagem.alt;
    imagem.width = local.imagem.largura;
    imagem.height = local.imagem.altura;
  } else {
    imagem.removeAttribute('src');
  }
  imagem.hidden = !local.imagem;
  el('painel-sem-imagem').hidden = Boolean(local.imagem);

  // Navegação: o anterior do primeiro é o último (e vice-versa)
  const total = locais.length;
  el('nome-anterior').textContent = locais[(indiceAtual - 1 + total) % total].nome;
  el('nome-proximo').textContent = locais[(indiceAtual + 1) % total].nome;
  el('painel-contador').textContent = `${indiceAtual + 1} / ${total}`;
  el('painel-anuncio').textContent = `${local.nome}, local ${indiceAtual + 1} de ${total}`;
}

// ---------- 3. Zoom ----------
// O palco recebe translate + scale (transform-origin no canto superior esquerdo).
// A conta posiciona o local no centro da parte do mapa que o painel NÃO cobre.
function aplicarZoom(local) {
  const escala = celular.matches ? ESCALA_CELULAR : ESCALA_DESKTOP;

  // Centro do espaço livre: no desktop o painel ocupa a direita; no celular, a parte de baixo
  const livreX = area.clientWidth - (celular.matches ? 0 : painel.offsetWidth);
  const livreY = area.clientHeight - (celular.matches ? painel.offsetHeight : 0);

  // Posição do local dentro do palco, em pixels (antes do zoom)
  const pontoX = (local.x / 100) * palco.offsetWidth;
  const pontoY = (local.y / 100) * palco.offsetHeight;

  // Quanto mover para que (posição do palco + ponto × escala) caia no centro do espaço livre
  const moverX = livreX / 2 - palco.offsetLeft - pontoX * escala;
  const moverY = livreY / 2 - palco.offsetTop - pontoY * escala;

  palco.style.setProperty('--escala', escala); // usado no CSS para os marcadores não crescerem
  palco.style.transform = `translate(${moverX}px, ${moverY}px) scale(${escala})`;
}

function tirarZoom() {
  palco.style.setProperty('--escala', 1);
  palco.style.transform = '';
}

// ---------- 4. Abrir e fechar ----------
function abrir(indice, { focarTitulo = true } = {}) {
  indiceAtual = (indice + locais.length) % locais.length; // dá a volta nas pontas
  const local = locais[indiceAtual];

  preencherPainel(local);
  marcadores.forEach((marcador, i) => marcador.setAttribute('aria-expanded', String(i === indiceAtual)));
  painel.setAttribute('data-aberto', '');
  secao.setAttribute('data-zoom', '');
  aplicarZoom(local);

  // Leva o foco para o nome do local (útil para teclado e leitor de tela)
  if (focarTitulo) el('painel-nome').focus({ preventScroll: true });
}

function fechar() {
  if (indiceAtual === -1) return;

  const marcador = marcadores[indiceAtual];
  const focoNoPainel = painel.contains(document.activeElement);

  painel.removeAttribute('data-aberto');
  secao.removeAttribute('data-zoom');
  marcador.setAttribute('aria-expanded', 'false');
  tirarZoom();
  indiceAtual = -1;

  // Devolve o foco ao marcador que abriu o painel
  if (focoNoPainel) marcador.focus({ preventScroll: true });
}

// ---------- 5. Eventos ----------
marcadores.forEach((marcador, i) => {
  marcador.addEventListener('click', (evento) => {
    if (evento.altKey) return; // Alt + clique é a ferramenta de coordenadas (abaixo)
    if (i === indiceAtual) fechar(); // clicar no ponto ativo fecha
    else abrir(i);
  });
});

el('painel-fechar').addEventListener('click', fechar);
el('painel-anterior').addEventListener('click', () => abrir(indiceAtual - 1, { focarTitulo: false }));
el('painel-proximo').addEventListener('click', () => abrir(indiceAtual + 1, { focarTitulo: false }));

// Tecla Esc fecha
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') fechar();
});

// Clique fora do painel e fora dos marcadores fecha
document.addEventListener('click', (evento) => {
  if (indiceAtual === -1 || evento.altKey) return;
  if (painel.contains(evento.target) || evento.target.closest('.marcador')) return;
  fechar();
});

// Se a tela mudar de tamanho com o painel aberto, recalcula o zoom
new ResizeObserver(() => {
  if (indiceAtual !== -1) aplicarZoom(locais[indiceAtual]);
}).observe(area);

// ---------- 6. Ferramenta para adicionar locais ----------
// Segure Alt e clique no mapa: o console mostra x/y em % daquele ponto.
// getBoundingClientRect já considera o zoom, então funciona com o mapa aproximado também.
area.addEventListener('click', (evento) => {
  if (!evento.altKey) return;

  const caixa = palco.getBoundingClientRect();
  const x = (((evento.clientX - caixa.left) / caixa.width) * 100).toFixed(1);
  const y = (((evento.clientY - caixa.top) / caixa.height) * 100).toFixed(1);
  console.log(`Posição no mapa → x: ${x}, y: ${y}`);
});
