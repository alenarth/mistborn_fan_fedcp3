import { VIEWBOX, CAMINHO } from './simbolo-oficial.js';

// Emblema do site: o símbolo oficial de Mistborn, vetorizado (ver scripts/gerar-icones.js)
// fill="currentColor" faz o símbolo usar a cor do texto, ex.: emblema('h-8 w-8') dentro de "text-latao"
export function emblema(classes = 'h-8 w-8') {
  return `
    <svg class="${classes}" viewBox="${VIEWBOX}" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="${CAMINHO}" />
    </svg>
  `;
}
