// Animações de entrada: cada elemento com [data-revelar] aparece quando entra na tela.
// O IntersectionObserver avisa quando o elemento fica visível; o CSS faz a animação.
export function iniciarRevelar() {
  const elementos = document.querySelectorAll('[data-revelar]');
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sem animação: com "reduzir movimento" os elementos simplesmente já estão visíveis
  if (movimentoReduzido || elementos.length === 0) return;

  // Liga as regras de animação do CSS (.js-animar [data-revelar] ...)
  document.documentElement.classList.add('js-animar');

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('revelado');
          observador.unobserve(entrada.target); // anima só uma vez
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  );

  elementos.forEach((elemento) => observador.observe(elemento));
}
