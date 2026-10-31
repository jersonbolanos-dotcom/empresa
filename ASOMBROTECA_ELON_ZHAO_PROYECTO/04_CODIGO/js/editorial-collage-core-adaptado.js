/*
  ASOMBROTECA — EDITORIAL ESSAY COLLAGE — BASE TÉCNICA ADAPTADA
  NOTA: Este es un núcleo técnico reimplementado a partir del estilo proporcionado;
  NO es una copia íntegra byte por byte del REFERENCE STYLE SOURCE original.
  Incluye el motor gráfico de papeles, recortes, fotos tratadas, marcas y cámara.
  El video final debe programarse de acuerdo con el guion y voz.
  Depends on lib/harness.js, optional lib/sound.js.
*/
(function(){
'use strict';
const H=window.H;
if(!H)throw Error('Cargar lib/harness.js antes de editorial-collage-core-adaptado.js');
const TAU=Math.PI*2;
const PALETTE={KRAFT:'#c9a878',PAPER:'#f0e9d9',INK:'#1a1816',RED:'#b8483a',CARD:'#f5f1e7',NEWS:'#e9e1cb',YELLOW:'#ffe226'};
const C={};
const q12=t=>Math.floor(t*12+1e-6)/12;
const NZ=()=>C.nz||(C.nz=H.makeNoise(4242));
const ell=(c,x,y,rx,ry,rot=0)=>{c.beginPath();c.ellipse(x,y,Math.abs(rx),Math.abs(ry),rot,0,TAU);};
const poly=(c,pts)=>{if(pts.length<2)return;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();};
const measure=(font,s)=>{const c=C.m||(C.m=H.layer(8,8).getContext('2d'));c.font=font;return c.measureText(s);};
function edgePoly(w,h,torn=[0,0,0,0],seed=3,amp=5){
 const nz=NZ(),r=H.rng(seed),cs=[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]],out=[];
 for(let e=0;e<4;e++){
  const [ax,ay]=cs[e],[bx,by]=cs[(e+1)%4],len=Math.hypot(bx-ax,by-ay),dx=(bx-ax)/len,dy=(by-ay)/len;
  if(!torn[e]){out.push([ax,ay]);continue;}
  const offSeed=seed*.37+e*11.3;
  for(let d=0;d<len;d+=2.5){const fade=Math.min(1,d/10,(len-d)/10),off=(nz.fbm2(offSeed+d*.021,offSeed*.5,4)*amp*1.7+(r()-.5)*amp*.3-amp*.25)*fade;
   out.push([ax+dx*d+dy*off,ay+dy*d-dx*off]);}
 }
 return out;
}
function sprite(w,h,pad,paint){const cv=H.layer(Math.ceil(w+pad*2),Math.ceil(h+pad*2)),c=cv.getContext('2d');c.translate(cv.width/2,cv.height/2);paint(c);return{cv,ox:cv.width/2,oy:cv.height/2,w,h};}
const drawSpr=(c,s)=>c.drawImage(s.cv,-s.ox,-s.oy);
function shadowFill(c,p,col,str=1){c.save();c.shadowColor=`rgba(40,28,15,${.38*str})`;c.shadowBlur=15*str;c.shadowOffsetX=4*str;c.shadowOffsetY=8*str;poly(c,p);c.fillStyle=col;c.fill();c.restore();}
function fibre(){
 if(C.fib)return C.fib;
 const W=1280,Hh=1920,cv=H.layer(W,Hh),c=cv.getContext('2d'),r=H.rng(31),nz=NZ();
 c.fillStyle='#f9f6ee';c.fillRect(0,0,W,Hh);
 const lo=H.layer(200,300),lc=lo.getContext('2d'),im=lc.createImageData(200,300);
 for(let y=0;y<300;y++)for(let x=0;x<200;x++){const k=(y*200+x)*4,v=nz.fbm2(x*.07,y*.05,4)*.6+nz.n2(x*.26,y*.23)*.4,g=244+v*22;
 im.data[k]=g;im.data[k+1]=g-2;im.data[k+2]=g-6;im.data[k+3]=255;}
 lc.putImageData(im,0,0);c.drawImage(lo,0,0,W,Hh);
 for(let i=0;i<3500;i++){const x=r()*W,y=r()*Hh,a=r()*TAU,l=4+r()*16;
 c.strokeStyle=r()<.6?`rgba(120,100,70,${.05+r()*.08})`:`rgba(255,255,255,${.2+r()*.3})`;
 c.lineWidth=.6+r()*.7;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);c.stroke();}
 C.fib=cv;return cv;
}
function texture(c,p,a=.45,ox=0,oy=0){c.save();poly(c,p);c.clip();c.globalCompositeOperation='multiply';c.globalAlpha=a;c.drawImage(fibre(),-640+ox,-960+oy);c.restore();}
function grainTiles(){if(C.gr)return C.gr;C.gr=[0,1,2,3].map(s=>{const cv=H.layer(256,256),c=cv.getContext('2d'),im=c.createImageData(256,256),r=H.rng(900+s);
 for(let i=0;i<im.data.length;i+=4){const v=128+(r()+r()+r()-1.5)*150;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255;}
 c.putImageData(im,0,0);return c.createPattern(cv,'repeat');});return C.gr;}
function treat(source,w=source.width,h=source.height,seed=1,opts={}){
 const cell=opts.cell||4,mix=opts.mix==null?.38:opts.mix,con=opts.con||1.25;
 const cv=H.layer(w,h),c=cv.getContext('2d');c.filter=`blur(${opts.blur??1}px)`;c.drawImage(source,0,0,w,h);c.filter='none';
 const img=c.getImageData(0,0,w,h),d=img.data,r=H.rng(seed),ca=Math.cos(Math.PI/4),sa=Math.sin(Math.PI/4);
 const ink=[30,27,25],pap=[238,231,214];
 for(let py=0;py<h;py++)for(let px=0;px<w;px++){
 const k=(py*w+px)*4,u=px/w-.5,v=py/h-.5;
 let L=(.2126*d[k]+.7152*d[k+1]+.0722*d[k+2])/255;
 L*=1-(u*u+v*v)*1.1;L+=(r()+r()+r()-1.5)*.11;L=H.clamp((L-.5)*con+.5+(opts.lift||0));
 const D=1-L,rx=px*ca+py*sa,ry=-px*sa+py*ca,gx=(Math.floor(rx/cell)+.5)*cell,gy=(Math.floor(ry/cell)+.5)*cell;
 const dot=H.clamp(cell*.74*Math.sqrt(D)-Math.hypot(rx-gx,ry-gy)+.6),cov=dot*(1-mix)+D*mix;
 d[k]=pap[0]+(ink[0]-pap[0])*cov;d[k+1]=pap[1]+(ink[1]-pap[1])*cov;d[k+2]=pap[2]+(ink[2]-pap[2])*cov;
 }
 c.putImageData(img,0,0);return cv;
}
function makePrint(img,seed=1,torn=[0,1,1,0],border=12,amp=7){const w=img.width+border*2,h=img.height+border*2;
 return sprite(w,h,34,c=>{const p=edgePoly(w,h,torn,seed,amp);shadowFill(c,p,'#f8f5ee');texture(c,p,.3,seed*13%400,seed*7%200);
 c.save();poly(c,p);c.clip();c.drawImage(img,-img.width/2,-img.height/2);c.restore();});}
function makeStrip(text,font,opts={}){
 const m=measure(font,text),tw=m.width,asc=m.actualBoundingBoxAscent||52,desc=Math.max(1,m.actualBoundingBoxDescent||14),px=asc/.72;
 const padX=opts.padX??px*.2,padY=opts.padY??px*.15,w=tw+2*padX,h=asc+desc+2*padY,base=-h/2+padY+asc;
 const spr=sprite(w,h,30,c=>{const p=edgePoly(w,h,opts.torn||[0,0,0,0],opts.seed||1,4);shadowFill(c,p,opts.bg||PALETTE.CARD,opts.sh||1);texture(c,p,.45);c.font=font;c.fillStyle=opts.fg||PALETTE.INK;c.fillText(text,-tw/2,base);});
 if(opts.hl){const i=text.indexOf(opts.hl);if(i>=0)spr.hl=[-tw/2+measure(font,text.slice(0,i)).width-7,base-asc*.9,measure(font,opts.hl).width+14,asc];}
 return spr;
}
function makeClipping(opts={}){
 const w=opts.w||420,h=opts.h||450,head=opts.head||['DOCUMENTO'],seed=opts.seed||25;
 return sprite(w,h,34,c=>{const p=edgePoly(w,h,[0,1,1,1],seed,5);shadowFill(c,p,PALETTE.NEWS);texture(c,p,.8);
 c.save();poly(c,p);c.clip();let y=-h/2+40;const left=-w/2+26;
 c.font='400 24px "Oswald"';c.fillStyle=PALETTE.INK;c.fillText(opts.kicker||'ARCHIVO · ASOMBROTECA',left,y);y+=20;
 c.fillRect(left,y,w-52,2);y+=42;c.font=`700 ${opts.headPx||38}px "Libre Baskerville"`;
 for(const line of head){c.fillText(line,left,y);y+=(opts.headPx||38)*1.2;}
 c.font='italic 400 22px "Libre Baskerville"';for(const line of opts.deck||[]){c.fillText(line,left,y+20);y+=32;}
 c.fillStyle='rgba(50,45,40,0.65)';for(let column=0;column<2;column++)for(let i=0;i<13;i++){
 const rr=H.rng(seed+column*17+i);c.fillRect(left+column*(w-50)/2,y+40+i*15,(w-70)/2*(.45+rr()*.55),4);}
 c.restore();});
}
const POP={drop:{s:[1.16,1.05,.985,1],r:[.05,.015,-.006,0]},slideL:{dx:[-300,-110,-26,0],r:[-.04,-.015,.004,0]},slideR:{dx:[300,110,26,0],r:[.04,.015,-.004,0]},slideU:{dy:[320,120,28,0],r:[.03,.01,-.003,0]}};
function arrive(tq,a,kind='drop'){if(tq<a-1e-6)return null;const f=Math.min(3,Math.round((tq-a)*12)),P=POP[kind];return{s:P.s?P.s[f]:1,r:P.r[f],dx:P.dx?P.dx[f]:0,dy:P.dy?P.dy[f]:0};}
function place(c,cam,depth,x,y,rot,s,fn){const W=cam.W||1080,Hh=cam.H||1920;c.save();c.translate(W/2,Hh/2);const k=Math.pow(cam.z,depth);c.scale(k,k);c.translate(-cam.x*depth,-cam.y*depth);c.translate(x,y);if(rot)c.rotate(rot);if(s!==1)c.scale(s,s);fn(c);c.restore();}
function putSpr(c,cam,depth,spr,x,y,rot,s,tq,a,kind='drop',extra){const A=arrive(tq,a,kind);if(!A)return false;place(c,cam,depth,x+A.dx,y+A.dy,rot+A.r,s*A.s,cc=>{drawSpr(cc,spr);if(extra)extra(cc);});return true;}
function bgPaper(c,cam,tint=PALETTE.PAPER){c.fillStyle=tint;c.fillRect(0,0,cam.W,cam.H);place(c,cam,.2,0,0,0,1,cc=>{cc.globalCompositeOperation='multiply';cc.drawImage(fibre(),-640,-960);});}
function block(c,cam,d,x,y,w,h,rot,col,seed,torn=[0,0,0,0]){place(c,cam,d,x,y,rot,1,cc=>{const p=edgePoly(w,h,torn,seed);shadowFill(cc,p,col);texture(cc,p,.55,seed*40%300);});}
function hilite(c,rect,progress,seed=3){if(!rect||progress<=0)return;const[x,y,w,h]=rect,nz=NZ(),L=w*H.clamp(progress),top=[],bot=[];
 for(let d=0;d<=L;d+=6){top.push([x+d,y+nz.n2(seed+d*.02,1)*h*.07]);bot.push([x+d,y+h+nz.n2(seed+d*.02,5)*h*.08]);}
 top.push([x+L,y]);bot.push([x+L,y+h]);c.save();c.globalCompositeOperation='multiply';c.beginPath();c.moveTo(x,y);top.forEach(p=>c.lineTo(...p));bot.reverse().forEach(p=>c.lineTo(...p));c.closePath();c.fillStyle='rgba(255,226,38,0.84)';c.fill();c.restore();}
function tape(c,x,y,w,h,rot,seed){const r=H.rng(seed);c.save();c.translate(x,y);c.rotate(rot);const p=edgePoly(w,h,[0,1,0,1],seed,3);
 c.shadowColor='rgba(40,28,15,.22)';c.shadowBlur=3;c.shadowOffsetY=1.5;poly(c,p);c.fillStyle='rgba(228,216,186,.82)';c.fill();c.shadowColor='transparent';c.clip();
 c.strokeStyle='rgba(255,255,255,.22)';for(let i=0;i<5;i++){const yy=-h/2+r()*h;c.beginPath();c.moveTo(-w/2,yy);c.lineTo(w/2,yy+(r()-.5)*2);c.stroke();}c.restore();}
function partial(c,pts,progress){if(!pts.length)return;const n=pts.length-1,f=H.clamp(progress)*n,k=Math.floor(f);c.beginPath();c.moveTo(...pts[0]);for(let i=1;i<=Math.min(k,n);i++)c.lineTo(...pts[i]);if(k<n){const a=pts[k],b=pts[k+1],u=f-k;c.lineTo(H.lerp(a[0],b[0],u),H.lerp(a[1],b[1],u));}}
function marker(c,pts,progress,col=PALETTE.RED,w=7){if(progress<=0)return;c.save();c.strokeStyle=col;c.globalAlpha=.9;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';partial(c,pts,progress);c.stroke();c.restore();}
function loopPts(x,y,rx,ry,seed=2){const pts=[],nz=NZ(),a0=-2.3+seed%1;for(let i=0;i<=70;i++){const u=i/70,a=a0+u*TAU*1.12,k=1+nz.n2(seed+u*3,2)*.06+u*.07;pts.push([x+Math.cos(a)*rx*k,y+Math.sin(a)*ry*k]);}return pts;}
function inkArrow(c,pts,progress,w=3,col=PALETTE.INK){if(progress<=0)return;c.save();c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';partial(c,pts,progress);c.stroke();if(progress>=1&&pts.length>=3){const a=pts.at(-3),b=pts.at(-1),ang=Math.atan2(b[1]-a[1],b[0]-a[0]),L=10+w*2;c.fillStyle=col;c.beginPath();c.moveTo(...b);c.lineTo(b[0]+Math.cos(ang+2.7)*L,b[1]+Math.sin(ang+2.7)*L);c.lineTo(b[0]+Math.cos(ang-2.7)*L,b[1]+Math.sin(ang-2.7)*L);c.closePath();c.fill();}c.restore();}
function finish(c,t,W=1080,Hh=1920){const pats=grainTiles(),f=Math.floor(t*12),r=H.rng(5000+f);c.save();c.globalCompositeOperation='overlay';c.globalAlpha=.22;c.fillStyle=pats[f%4];c.translate(-r()*256,-r()*256);c.fillRect(0,0,W+256,Hh+256);c.restore();
 c.save();c.globalCompositeOperation='multiply';const g=c.createRadialGradient(W/2,Hh/2,Math.min(W,Hh)*.2,W/2,Hh/2,Math.hypot(W,Hh)*.55);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(235,226,215,1)');c.fillStyle=g;c.fillRect(0,0,W,Hh);c.restore();}
// ------------------------------------------------------------------
// PREVIEW: functional look-and-feel showcase, not the finished film.
// In production, replace mock cards with verified images and posts.
// ------------------------------------------------------------------
function drawPreview(ctx,W,Hh,t){const camera={W,H:Hh,x:Math.sin(t*.16)*14,y:-10+t*2,z:1.02+Math.min(.08,t*.008)},tq=q12(t);bgPaper(ctx,camera);
 block(ctx,camera,.5,0,0,W*.8,Hh*.75,-.015,PALETTE.KRAFT,14,[1,1,1,1]);
 if(!C.title)C.title=makeStrip('MUSK vs BINANCE','400 78px "Anton"',{bg:PALETTE.INK,fg:'#f3efe5',seed:10});
 if(!C.hint)C.hint=makeStrip('EL PODER DE UNA RESPUESTA','700 38px "Oswald"',{seed:12,hl:'RESPUESTA'});
 if(!C.news)C.news=makeClipping({w:650,h:520,seed:16,kicker:'NOTICIAS · OCTUBRE DE 2026',head:['BINANCE','Y ELON MUSK'],headPx:48,deck:['Reacciones públicas en X','Evidencia en revisión editorial']});
 putSpr(ctx,camera,.9,C.news,0,-160,-.025,1.0,tq,.2,'drop',cc=>tape(cc,0,-260,120,35,-.15,3));
 putSpr(ctx,camera,1.1,C.title,0,300,.017,1,tq,.5,'drop');
 putSpr(ctx,camera,1.12,C.hint,0,420,-.015,1,tq,1.15,'drop',cc=>hilite(cc,C.hint.hl,(t-1.5)/.55,18));
 finish(ctx,t,W,Hh);
}
const style={id:'editorial-collage-asombroteca-core',name:'Editorial Essay Collage / Núcleo adaptado',category:'Popular Explainer Looks',readsPixels:false,fonts:['400 78px "Anton"','700 38px "Oswald"','700 48px "Libre Baskerville"'],draw(ctx,W,Hh,t){drawPreview(ctx,W,Hh,t);},explainer(ctx,W,Hh,t){drawPreview(ctx,W,Hh,t);},explainerDuration:7,explainerSound(k){k.play('paper',.2,{gain:.6});k.play('stamp',.55,{gain:.5});k.play('stroke',1.5,{material:'sharpie',dur:.55,gain:.35});}};
window.EditorCollageCore={H,PALETTE,q12,edgePoly,sprite,drawSpr,shadowFill,fibre,texture,grainTiles,treat,makePrint,makeStrip,makeClipping,arrive,place,putSpr,bgPaper,block,hilite,tape,partial,marker,loopPts,inkArrow,finish,drawPreview,style};
window.registerStyle(style);
})();
