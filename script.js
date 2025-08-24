// Orb canvas animado
const cvs=document.getElementById('orb');
const ctx=cvs.getContext('2d');
let W,H,DPR;

function fit(){
  DPR=Math.max(1,Math.min(2,devicePixelRatio||1));
  W=cvs.clientWidth;H=cvs.clientHeight;
  cvs.width=Math.floor(W*DPR);cvs.height=Math.floor(H*DPR);
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
addEventListener('resize',fit,{passive:true});fit();

const points=[];const rings=36,segments=72;
for(let i=0;i<=rings;i++){
  const v=i/rings;const phi=v*Math.PI;
  for(let j=0;j<segments;j++){
    const u=j/segments;const theta=u*Math.PI*2;
    const x=Math.sin(phi)*Math.cos(theta);
    const y=Math.cos(phi);
    const z=Math.sin(phi)*Math.sin(theta);
    points.push({x,y,z});
  }
}

let t=0;
function render(){
  t+=0.006;ctx.clearRect(0,0,W,H);
  const cx=W/2,cy=H/2,scale=Math.min(W,H)*0.32;
  const rotY=Math.sin(t*0.7)*0.9,rotX=Math.cos(t*0.5)*0.6;
  for(const p of points){
    let{x,y,z}=p;
    let y1=y*Math.cos(rotX)-z*Math.sin(rotX);
    let z1=y*Math.sin(rotX)+z*Math.cos(rotX);y=y1;z=z1;
    let x2=x*Math.cos(rotY)+z*Math.sin(rotY);
    let z2=-x*Math.sin(rotY)+z*Math.cos(rotY);x=x2;z=z2;
    const depth=(z+2.2)/3.2;
    const px=cx+x*scale;const py=cy+y*scale;
    const alpha=0.35+(1-depth)*0.55;
    ctx.beginPath();
    ctx.arc(px,py,1.2+(1-depth)*1.6,0,Math.PI*2);
    ctx.fillStyle=`rgba(234,248,255,${alpha})`;
    ctx.fill();
  }
  requestAnimationFrame(render);
}
render();
