// Set copyright year automatically
document.getElementById('year').textContent = new Date().getFullYear();

/* ═══════════════════════════════════════════════
   ANIMATED BACKGROUND: wavy rainbow strands
═══════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function drawBase() {
    const w = canvas.width, h = canvas.height;
    const grad = ctx.createRadialGradient(w*0.42, h*0.38, 0, w*0.5, h*0.5, Math.max(w,h)*0.85);
    grad.addColorStop(0,    '#3a3f52');
    grad.addColorStop(0.28, '#2b2f40');
    grad.addColorStop(0.55, '#23273a');
    grad.addColorStop(0.78, '#1d2132');
    grad.addColorStop(1,    '#16192a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const pools = [
      { x:0.15, y:0.25, r:0.45, col:'rgba(30,58,95,0.38)' },
      { x:0.82, y:0.7,  r:0.45, col:'rgba(70,40,110,0.32)' },
      { x:0.5,  y:0.9,  r:0.35, col:'rgba(40,80,140,0.22)' },
    ];
    pools.forEach(p => {
      const g2 = ctx.createRadialGradient(w*p.x, h*p.y, 0, w*p.x, h*p.y, Math.max(w,h)*p.r);
      g2.addColorStop(0, p.col);
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);
    });
  }

  const NUM_STRANDS = 62;
  const strands = [];
  const rainbowHues = [];
  for (let i = 0; i < 360; i += 360/NUM_STRANDS) rainbowHues.push(i);

  for (let i = 0; i < NUM_STRANDS; i++) {
    strands.push({
      hue:    rainbowHues[i % rainbowHues.length],
      axis:   Math.random() < 0.55 ? 'h' : 'v',
      pos:    Math.random(),
      phaseA: Math.random() * Math.PI * 2,
      phaseB: Math.random() * Math.PI * 2,
      freqA:  0.6 + Math.random() * 1.4,
      freqB:  0.3 + Math.random() * 0.8,
      ampA:   0.04 + Math.random() * 0.1,
      ampB:   0.02 + Math.random() * 0.05,
      speedA: (0.0004 + Math.random() * 0.0008) * (Math.random() < 0.5 ? 1 : -1),
      speedB: (0.0002 + Math.random() * 0.0006) * (Math.random() < 0.5 ? 1 : -1),
      drift:  (0.00005 + Math.random() * 0.0001) * (Math.random() < 0.5 ? 1 : -1),
      width:  0.4 + Math.random() * 1.1,
      alpha:  0.38 + Math.random() * 0.45,
      sat:    85 + Math.random() * 15,
      light:  50 + Math.random() * 20,
      steps:  120,
    });
  }

  function drawStrands() {
    const w = canvas.width, h = canvas.height;
    strands.forEach(s => {
      s.pos += s.drift;
      if (s.pos < -0.1) s.pos = 1.1;
      if (s.pos > 1.1)  s.pos = -0.1;
      s.phaseA += s.speedA;
      s.phaseB += s.speedB;

      ctx.beginPath();
      ctx.lineWidth   = s.width;
      ctx.strokeStyle = `hsla(${s.hue},${s.sat}%,${s.light}%,${s.alpha})`;
      ctx.shadowColor = `hsla(${s.hue},100%,65%,0.15)`;
      ctx.shadowBlur  = 3;

      const N = s.steps;
      if (s.axis === 'h') {
        for (let k = 0; k <= N; k++) {
          const u = k/N;
          const dy = Math.sin(u*Math.PI*2*s.freqA + s.phaseA)*s.ampA*h
                   + Math.sin(u*Math.PI*2*s.freqB + s.phaseB)*s.ampB*h;
          k === 0 ? ctx.moveTo(u*w, s.pos*h + dy) : ctx.lineTo(u*w, s.pos*h + dy);
        }
      } else {
        for (let k = 0; k <= N; k++) {
          const u = k/N;
          const dx = Math.sin(u*Math.PI*2*s.freqA + s.phaseA)*s.ampA*w
                   + Math.sin(u*Math.PI*2*s.freqB + s.phaseB)*s.ampB*w;
          k === 0 ? ctx.moveTo(s.pos*w + dx, u*h) : ctx.lineTo(s.pos*w + dx, u*h);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }

  function frame() {
    drawBase();
    drawStrands();
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ── Form handler ── */
function handleSend() {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !email || !message) {
    alert('Please fill in your name, email, and message before sending.');
    return;
  }
  alert(`Thanks, ${name}! Your message has been received. Richard will be in touch at ${email} soon.`);
}