import { emblema } from './emblema.js';

// Lista das páginas do site: o menu é montado a partir dela
const paginas = [
  { id: 'inicio', titulo: 'Início', href: '/' },
  { id: 'personagens', titulo: 'Personagens', href: '/personagens.html' },
  { id: 'mapa', titulo: 'Mapa', href: '/mapa.html' },
  { id: 'alomancia', titulo: 'Alomancia', href: '/alomancia.html' },
  { id: 'curiosidades', titulo: 'Curiosidades', href: '/curiosidades.html' },
];

// Retorna o HTML do header; "paginaAtual" destaca o link da página aberta
export function criarHeader(paginaAtual) {
  const links = paginas
    .map((pagina) => {
      const atual = pagina.id === paginaAtual ? 'aria-current="page"' : '';
      return `
        <li>
          <a href="${pagina.href}" ${atual}
             class="block rounded px-3 py-3 font-titulo text-sm uppercase tracking-widest text-cinza-400
                    transition-colors hover:text-latao-claro
                    aria-[current=page]:text-latao-claro md:py-2">
            ${pagina.titulo}
          </a>
        </li>`;
    })
    .join('');

  return `
    <!-- Link escondido que aparece ao usar Tab: pula direto para o conteúdo -->
    <a href="#conteudo"
       class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50
              focus:rounded focus:bg-latao focus:px-4 focus:py-2 focus:text-carvao-950">
      Pular para o conteúdo
    </a>

    <!-- data-topo = header transparente sobre o hero (controlado por iniciarHeaderTransparente) -->
    <header class="sticky top-0 z-40 border-b border-latao/20 bg-carvao-950/85 backdrop-blur-md transition-colors duration-500
                   data-[topo]:border-transparent data-[topo]:bg-transparent data-[topo]:backdrop-blur-none">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-3 text-latao transition-colors hover:text-latao-claro">
          ${emblema('h-9 w-9')}
          <span class="font-titulo text-base tracking-wider text-latao-claro sm:text-lg">Nascidos da Bruma</span>
        </a>

        <!-- Botão hambúrguer: só aparece no celular (some a partir de md) -->
        <button id="botao-menu" type="button"
                class="grid h-11 w-11 place-items-center rounded text-latao-claro hover:bg-latao/10 md:hidden"
                aria-expanded="false" aria-controls="menu-principal" aria-label="Abrir menu">
          <svg id="icone-abrir" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <svg id="icone-fechar" class="hidden h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <!-- Navegação: lista vertical no celular (aberta pelo botão), horizontal no desktop -->
        <nav aria-label="Navegação principal">
          <ul id="menu-principal"
              class="absolute inset-x-0 top-full hidden flex-col border-b border-latao/20 bg-carvao-950/95 px-4 pb-4
                     md:static md:flex md:flex-row md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0">
            ${links}
          </ul>
        </nav>
      </div>
    </header>
  `;
}

// Liga o botão hambúrguer: abre/fecha o menu no celular
export function iniciarMenu() {
  const botao = document.getElementById('botao-menu');
  const menu = document.getElementById('menu-principal');
  const iconeAbrir = document.getElementById('icone-abrir');
  const iconeFechar = document.getElementById('icone-fechar');

  function definirAberto(aberto) {
    botao.setAttribute('aria-expanded', String(aberto));
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('hidden', !aberto);
    menu.classList.toggle('flex', aberto);
    iconeAbrir.classList.toggle('hidden', aberto);
    iconeFechar.classList.toggle('hidden', !aberto);
  }

  botao.addEventListener('click', () => {
    const aberto = botao.getAttribute('aria-expanded') === 'true';
    definirAberto(!aberto);
  });

  // Tecla Esc fecha o menu e devolve o foco ao botão
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') {
      definirAberto(false);
      botao.focus();
    }
  });
}

// Na home, o header fica transparente enquanto está no topo (sobre a arte do hero)
export function iniciarHeaderTransparente() {
  const header = document.querySelector('header');

  function atualizar() {
    header.toggleAttribute('data-topo', window.scrollY < 40);
  }

  atualizar();
  window.addEventListener('scroll', atualizar, { passive: true });
}
