import { emblema } from './emblema.js';

// Retorna o HTML do footer (igual em todas as páginas)
export function criarFooter() {
  const ano = new Date().getFullYear();

  return `
    <footer class="border-t border-latao/25 bg-carvao-950">
      <div class="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-8 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-12">
        <a href="/" class="flex items-center gap-3 text-latao transition-colors hover:text-latao-claro">
          ${emblema('h-10 w-10')}
          <span class="font-titulo text-lg tracking-wider text-latao-claro">Nascidos da Bruma</span>
        </a>

        <div class="space-y-1 text-base text-cinza-400">
          <p>Site de fã sem fins lucrativos. Mistborn © Brandon Sanderson / Dragonsteel.</p>
          <p>Imagens usadas apenas para fins educacionais; todos os direitos pertencem aos seus autores.</p>
        </div>

        <div class="flex flex-col gap-1 text-base md:items-end">
          <a href="/creditos.html" class="link-latao">Créditos das artes</a>
          <span class="text-sm text-cinza-500">Projeto acadêmico de front-end · ${ano}</span>
        </div>
      </div>
    </footer>
  `;
}
