// Animação de cinzas caindo sobre o hero, desenhada em um <canvas>
export function iniciarCinzas(canvas) {
  const ctx = canvas.getContext('2d');

  // Preferência do sistema "reduzir movimento" (acessibilidade)
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');

  let particulas = [];
  let largura = 0;
  let altura = 0;
  let idAnimacao = null; // guarda o requestAnimationFrame para poder parar
  let naTela = true; // o canvas está visível? (o hero pode ter saído da tela)

  // Cria um floco de cinza; "noTopo" faz ele nascer logo acima da tela
  function criarParticula(noTopo = false) {
    return {
      x: Math.random() * largura,
      y: noTopo ? -10 : Math.random() * altura,
      raio: 0.6 + Math.random() * 1.8,
      velocidade: 0.25 + Math.random() * 0.6,
      fase: Math.random() * Math.PI * 2, // usada no balanço para os lados
      opacidade: 0.15 + Math.random() * 0.45,
    };
  }

  // Ajusta o canvas ao tamanho que ele ocupa na página e a quantidade de flocos à área
  function redimensionar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // nitidez em telas de alta densidade
    largura = canvas.clientWidth;
    altura = canvas.clientHeight;
    canvas.width = largura * dpr;
    canvas.height = altura * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Mais flocos em telas maiores, com limite de 120 para não pesar
    const quantidade = Math.min(120, Math.round((largura * altura) / 12000));
    while (particulas.length < quantidade) particulas.push(criarParticula());
    particulas.length = quantidade;

    desenhar();
  }

  // Desenha todos os flocos na posição atual
  function desenhar() {
    ctx.clearRect(0, 0, largura, altura);
    for (const p of particulas) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.raio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 194, 184, ${p.opacidade})`;
      ctx.fill();
    }
  }

  // Move cada floco: cai, balança e é levado por um vento leve
  function atualizar() {
    for (const p of particulas) {
      p.fase += 0.01;
      p.y += p.velocidade;
      p.x += Math.sin(p.fase) * 0.3 + 0.1;

      // Saiu da tela? Volta para o topo como um floco novo
      if (p.y > altura + 10 || p.x > largura + 10) {
        Object.assign(p, criarParticula(true));
      }
    }
  }

  // Um quadro da animação (repete cerca de 60 vezes por segundo)
  function quadro() {
    atualizar();
    desenhar();
    idAnimacao = requestAnimationFrame(quadro);
  }

  function iniciar() {
    // Com "reduzir movimento" ativo, os flocos ficam parados (só um desenho estático)
    if (idAnimacao === null && naTela && !movimentoReduzido.matches && !document.hidden) {
      quadro();
    }
  }

  function parar() {
    cancelAnimationFrame(idAnimacao);
    idAnimacao = null;
  }

  // Redimensiona sempre que o tamanho do canvas mudar
  new ResizeObserver(redimensionar).observe(canvas);

  // Pausa quando o hero sai da tela (rolou para baixo) e volta quando reaparece
  new IntersectionObserver(([entrada]) => {
    naTela = entrada.isIntersecting;
    if (naTela) iniciar();
    else parar();
  }).observe(canvas);

  // Pausa quando a aba não está visível (economiza bateria)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) parar();
    else iniciar();
  });

  // Se o usuário mudar a preferência com a página aberta, respeita na hora
  movimentoReduzido.addEventListener('change', () => {
    if (movimentoReduzido.matches) parar();
    else iniciar();
  });

  redimensionar();
  iniciar();
}
