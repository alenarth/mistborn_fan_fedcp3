// Monta a lista da página de créditos a partir de src/data/creditos.js
import { creditos } from '../data/creditos.js';

// Miniatura: foto pequena (480px) ou, nos símbolos, o desenho pintado em latão
function criarMiniatura(credito) {
  if (credito.simbolo) {
    return `
      <span class="grid h-24 w-24 shrink-0 place-items-center border border-latao/30 bg-carvao-900">
        <span class="simbolo h-14 w-14" style="--simbolo: url('/images/${credito.arquivo}.webp')"></span>
      </span>`;
  }

  // alt vazio: o título ao lado já descreve a imagem
  return `
    <img src="/images/miniaturas/${credito.arquivo}.webp" width="96" height="96" loading="lazy" alt=""
         class="h-24 w-24 shrink-0 border border-latao/30 object-cover" />`;
}

const lista = document.getElementById('lista-creditos');

lista.innerHTML = creditos
  .map(
    (credito) => `
      <li class="flex items-center gap-5 bg-carvao-950 p-5">
        ${criarMiniatura(credito)}
        <div>
          <h2 class="text-lg text-latao-claro">${credito.titulo}</h2>
          <p class="text-bruma">${credito.artista}</p>
          <p class="text-base text-cinza-400">${credito.uso}</p>
        </div>
      </li>`,
  )
  .join('');
