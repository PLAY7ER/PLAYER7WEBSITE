// ====== ORB CANVAS CON PALETAS ======
const cvs = document.getElementById('orb');
const ctx = cvs.getContext('2d');
let W, H, DPR;

function fit(){
  DPR = Math.max(1, Math.min(2, devicePixelRatio || 1));
  W = cvs.clientWidth; H = cvs.clientHeight;
  cvs.width = Math.floor(W * DPR); cvs.height = Math.floor(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
addEventListener('resize', fit, { passive:true }); fit();

// Puntos en esfera (igual que antes)
const points = [];
const rings = 36, segments = 72;
for(let i=0;i<=rings;i++){
  const v = i/rings, phi = v*Math.PI;
  for(let j=0;j<segments;j++){
    const u = j/segments, theta = u*Math.PI*2;
    const x = Math.sin(phi)*Math.cos(theta);
    const y = Math.cos(phi);
    const z = Math.sin(phi)*Math.sin(theta);
    points.push({x,y,z});
  }
}

// ==== Paletas y helpers de color ====
const PALETTES = {
  neon:   ['#8a2be2','#00f7ff'],
  fire:   ['#ff3d00','#ffd60a'],
  aqua:   ['#00bcd4','#00ff9c'],
  sunset: ['#ff6b6b','#f7b267'],
  // rainbow: ignora array; usa hue girando
  rainbow:['#ff0000','#0000ff']
};
const palKeys = Object.keys(PALETTES);
let palIndex = 0;            // paleta activa
let autoHue = 0;             // para rainbow

function hexToRgb(hex){
  const m = hex.replace('#','');
  const int = parseInt(m,16);
  return { r:(int>>16)&255, g:(int>>8)&255, b:int&255 };
}
function lerp(a,b,t){ return a + (b-a)*t; }
function mixRGB(c1,c2,t){
  return {
    r: Math.round(lerp(c1.r,c2.r,t)),
    g: Math.round(lerp(c1.g,c2.g,t)),
    b: Math.round(lerp(c1.b,c2.b,t))
  };
}
function hslToRgb(h,s,l){ // h[0..360], s/l[0..1]
  const c = (1-Math.abs(2*l-1))*s;
  const x = c*(1-Math.abs((h/60)%2-1));
  const m = l-c/2;
  let r=0,g=0,b=0;
  if(h<60){r=c;g=x;} else if(h<120){r=x;g=c;}
  else if(h<180){g=c;b=x;} else if(h<240){g=x;b=c;}
  else if(h<300){r=x;b=c;} else {r=c;b=x;}
  return { r:Math.round((r+m)*255), g:Math.round((g+m)*255), b:Math.round((b+m)*255) };
}

// ==== Render animado con color cambiante ====
let t = 0;
function render(){
  t += 0.006;
  ctx.clearRect(0,0,W,H);

  const cx = W/2, cy = H/2, scale = Math.min(W,H)*0.32;
  const rotY = Math.sin(t*0.7)*0.9, rotX = Math.cos(t*0.5)*0.6;

  // mezcla temporal 0..1
  const mix = (Math.sin(t*0.6)+1)/2;

  // color base según paleta
  let rgb;
  const activeKey = palKeys[palIndex];
  if(activeKey === 'rainbow'){
    autoHue = (autoHue + 0.4) % 360; // gira continuamente
    rgb = hslToRgb(autoHue, 0.85, 0.6);
  }else{
    const [cA, cB] = PALETTES[activeKey].map(hexToRgb);
    rgb = mixRGB(cA, cB, mix);
  }

  for(const p of points){
    let {x,y,z} = p;

    // rotaciones
    let y1 = y*Math.cos(rotX) - z*Math.sin(rotX);
    let z1 = y*Math.sin(rotX) + z*Math.cos(rotX);
    y = y1; z = z1;
    let x2 = x*Math.cos(rotY) + z*Math.sin(rotY);
    let z2 = -x*Math.sin(rotY) + z*Math.cos(rotY);
    x = x2; z = z2;

    const depth = (z+2.2)/3.2;
    const px = cx + x*scale;
    const py = cy + y*scale;

    const alpha = 0.28 + (1-depth)*0.6;         // similar al original
    const size  = 1.0 + (1-depth)*1.8;

    ctx.beginPath();
    ctx.arc(px,py,size,0,Math.PI*2);
    ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
    ctx.fill();
  }

  requestAnimationFrame(render);
}
render();

// ====== CONTROLES ======
const btnNext = document.getElementById('palette-next');
const dots = document.querySelectorAll('.dot');

function setPaletteByKey(key){
  const idx = palKeys.indexOf(key);
  if(idx>=0){ palIndex = idx; markActiveDot(); }
}
function nextPalette(){
  palIndex = (palIndex+1) % palKeys.length;
  markActiveDot();
}
function markActiveDot(){
  dots.forEach(d => d.classList.toggle('active', d.dataset.pal === palKeys[palIndex]));
}

// eventos
if(btnNext){ btnNext.addEventListener('click', nextPalette); }
dots.forEach(d => d.addEventListener('click', () => setPaletteByKey(d.dataset.pal)));
markActiveDot();
