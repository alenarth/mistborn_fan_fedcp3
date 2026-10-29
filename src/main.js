// Ponto de entrada de TODAS as páginas (carregado no <head> de cada .html)
import { criarHeader, iniciarMenu, iniciarHeaderTransparente } from './components/header.js';
import { criarFooter } from './components/footer.js';
import { iniciarCinzas } from './js/cinzas.js';
import { iniciarParallax } from './js/parallax.js';
import { iniciarRevelar } from './js/revelar.js';

// Cada <body> informa qual página é, ex.: <body data-pagina="mapa">
const paginaAtual = document.body.dataset.pagina;

// Troca os espaços reservados (<div id="site-header"> e <div id="site-footer">) pelo HTML real
document.getElementById('site-header').outerHTML = criarHeader(paginaAtual);
document.getElementById('site-footer').outerHTML = criarFooter();
iniciarMenu();

// Recursos que só existem na home (hero com [data-heroi] e canvas das cinzas)
const heroi = document.querySelector('[data-heroi]');
if (heroi) {
  iniciarHeaderTransparente();
  iniciarParallax(heroi);
}

const canvasCinzas = document.getElementById('cinzas');
if (canvasCinzas) {
  iniciarCinzas(canvasCinzas);
}

// Animações de entrada ao rolar (elementos com o atributo data-revelar)
iniciarRevelar();
