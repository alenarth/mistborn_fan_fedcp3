// Parallax leve no hero: a imagem e as camadas de névoa seguem o mouse em profundidades diferentes.
// O JS só calcula a posição do mouse (--mx e --my, de -1 a 1); o CSS faz o movimento.
export function iniciarParallax(heroi) {
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
  const temMouse = window.matchMedia('(pointer: fine)'); // celular e tablet não têm mouse

  if (!temMouse.matches) return;

  let x = 0;
  let y = 0;
  let pedido = null; // evita recalcular mais de uma vez por quadro

  heroi.addEventListener('pointermove', (evento) => {
    if (movimentoReduzido.matches) return;

    const area = heroi.getBoundingClientRect();
    x = ((evento.clientX - area.left) / area.width) * 2 - 1;
    y = ((evento.clientY - area.top) / area.height) * 2 - 1;

    if (pedido === null) {
      pedido = requestAnimationFrame(() => {
        heroi.style.setProperty('--mx', x.toFixed(3));
        heroi.style.setProperty('--my', y.toFixed(3));
        pedido = null;
      });
    }
  });

  // Mouse saiu do hero: tudo volta ao centro
  heroi.addEventListener('pointerleave', () => {
    heroi.style.setProperty('--mx', '0');
    heroi.style.setProperty('--my', '0');
  });
}
