import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

// Pasta raiz do projeto (onde ficam os arquivos .html)
const raiz = import.meta.dirname;

export default defineConfig({
  // Plugin oficial do Tailwind CSS v4 para o Vite
  plugins: [tailwindcss()],

  build: {
    // Site multi-página: cada .html vira uma página no build final (pasta dist)
    rollupOptions: {
      input: {
        inicio: resolve(raiz, 'index.html'),
        personagens: resolve(raiz, 'personagens.html'),
        mapa: resolve(raiz, 'mapa.html'),
        alomancia: resolve(raiz, 'alomancia.html'),
        curiosidades: resolve(raiz, 'curiosidades.html'),
        creditos: resolve(raiz, 'creditos.html'),
      },
    },
  },
});
