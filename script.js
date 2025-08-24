/* En CodePen: pegá este bloque en el panel JS */
(() => {
  const cube = document.getElementById('cube');
  const btnLeft = document.getElementById('dir-left');
  const btnRight = document.getElementById('dir-right');
  const btnCoords = document.getElementById('toggle-coords');
  const coords = document.getElementById('coords');

  // Estado de rotación (solo eje Y)
  let rotY = 0;           // grados
  let dir = 1;            // 1 = derecha, -1 = izquierda
  let running = true;     // rotación continua
  const degPerMs = 0.02;  // velocidad → ajustá a gusto

  function apply() {
    cube.style.transform = `rotateY(${rotY}deg)`;
  }
  function normDeg(d){
    let n = d % 360;
    if (n < 0) n += 360;
    return n;
  }
  function updateCoords() {
    if (coords.hasAttribute('hidden')) return;
    coords.innerHTML = `Rotación — X: <b>0°</b> · Y: <b>${normDeg(rotY).toFixed(1)}°</b> · Z: <b>0°</b>`;
  }

  // Bucle de animación
  let last = 0;
  function tick(ts){
    const dt = (ts - last) || 16;
    last = ts;
    if (running){
      rotY += dir * degPerMs * dt;
      apply();
      updateCoords();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Controles
  btnLeft.addEventListener('click', () => { dir = -1; });
  btnRight.addEventListener('click', () => { dir =  1; });

  btnCoords.addEventListener('click', () => {
    const show = coords.hasAttribute('hidden');
    if (show){
      coords.removeAttribute('hidden');
      btnCoords.setAttribute('aria-pressed', 'true');
      updateCoords();
    } else {
      coords.setAttribute('hidden', '');
      btnCoords.setAttribute('aria-pressed', 'false');
    }
  });

  // Accesibilidad por teclado
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { dir = -1; }
    if (e.key === 'ArrowRight') { dir =  1; }
  });
})();