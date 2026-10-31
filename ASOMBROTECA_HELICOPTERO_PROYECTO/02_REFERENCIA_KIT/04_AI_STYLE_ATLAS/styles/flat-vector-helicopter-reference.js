// ASOMBROTECA — ADAPTACIÓN FUNCIONAL, NO COPIA LITERAL DE styles/flat-space.js
// Técnicas fieles al lenguaje Flat-Vector Science: gradientes, crescent shadows,
// glows, partículas H.rng, flechas curvas redondeadas, zoom y parallax.
// Escena de demostración de 15s; la película definitiva debe durar lo que dicte la voz.
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = H.clamp, mix = H.mix, lerp = H.lerp;
  const smooth = (t,a,b) => H.smooth(a,b,t);
  const C = {
    sky0:'#090b2c', sky1:'#18134f', sky2:'#3a1a6c',
    ink:'#141846', visor:'#10164a',
    teal:['#a4fbef','#3ccbdc','#1d64b0'],
    orange:['#ffcc7a','#ff8d3f','#d24a2a'],
    yellow:'#ffd23f', pink:'#ff5d8f', red:'#ff3b5c',
    green:'#38e08e', cyan:'#56e8ff', violet:'#8b5cff'
  };
  const pad = (x,y) => [x,y];
  function glow(ctx,x,y,r,col,a){
    if(r<1||a<=0)return;
    const g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,H.rgba(col,a));g.addColorStop(.4,H.rgba(col,a*.4));g.addColorStop(1,H.rgba(col,0));
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  }
  function crescent(ctx,x,y,r,dx,dy,color){
    ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();
    ctx.beginPath();ctx.rect(x-r-2,y-r-2,r*2+4,r*2+4);
    ctx.arc(x+dx,y+dy,r*1.02,0,TAU);
    ctx.fillStyle=color;ctx.fill('evenodd');ctx.restore();
  }
  function ball(ctx,x,y,r,colors,o={}){
    if(r<.5)return;
    const la=o.la==null?-2.25:o.la,lx=Math.cos(la),ly=Math.sin(la);
    const g=ctx.createLinearGradient(x+lx*r,y+ly*r,x-lx*r,y-ly*r);
    g.addColorStop(0,colors[0]);g.addColorStop(.48,colors[1]);g.addColorStop(1,H.rgba(mix(colors[1],colors[2],.65)));
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
    crescent(ctx,x,y,r,lx*r*.35,ly*r*.35,H.rgba(colors[2],.5));
    crescent(ctx,x,y,r,lx*r*.7,ly*r*.7,H.rgba(colors[2],.2));
    crescent(ctx,x,y,r,-lx*r*.075,-ly*r*.075,'rgba(255,255,255,.37)');
  }
  function rr(ctx,x,y,w,h,r){
    r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
  }
  function label(ctx,str,x,y,px=28,opts={}){
    ctx.save();ctx.font=`900 ${px}px Nunito, Fredoka, sans-serif`;
    const tw=ctx.measureText(str).width,w=tw+px*1.1,h=px*1.65;
    ctx.fillStyle='rgba(9,11,44,.43)';rr(ctx,x-w/2+3,y-h/2+6,w,h,h/2);ctx.fill();
    ctx.fillStyle=opts.bg||'#e7fbff';rr(ctx,x-w/2,y-h/2,w,h,h/2);ctx.fill();
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=opts.fg||C.ink;
    ctx.fillText(str,x,y+2);ctx.restore();
  }
  const rand = H.rng(77);
  const STARS = Array.from({length:270},()=>({x:rand.range(-90,1370),y:rand.range(-80,800),r:rand.range(.5,2),phase:rand.range(0,TAU),z:rand.range(.2,1)}));
  function sky(ctx,W,Hh,t,camX=0){
    const g=ctx.createLinearGradient(0,0,W*.25,Hh);
    g.addColorStop(0,C.sky0);g.addColorStop(.55,C.sky1);g.addColorStop(1,C.sky2);
    ctx.fillStyle=g;ctx.fillRect(0,0,W,Hh);
    glow(ctx,1080,100,560,'#6f41be',.24);glow(ctx,100,690,620,'#294caa',.37);
    for(const p of STARS){
      const x=(p.x-t*5*p.z-camX*p.z*0.12+1550)%1550-100;
      ctx.globalAlpha=(.3+.4*Math.sin(t*1.1+p.phase))*(.3+.7*p.z);
      ctx.fillStyle='#eaf7ff';ctx.beginPath();ctx.arc(x,p.y,p.r,0,TAU);ctx.fill();
    }
    ctx.globalAlpha=1;
  }
  function finish(ctx,W,Hh,t){
    // Deterministic fine animated overlay. For true atlas fidelity, prefer its original finish().
    const tex = window.__flatVectorGrain || (window.__flatVectorGrain = (()=>{
      const c=H.layer(128,128),k=c.getContext('2d'),img=k.createImageData(128,128),r=H.rng(4242);
      for(let i=0;i<img.data.length;i+=4){const v=128+(r()+r()+r()-1.5)*80;img.data[i]=img.data[i+1]=img.data[i+2]=v;img.data[i+3]=255;}
      k.putImageData(img,0,0);return c;
    })());
    ctx.save();ctx.globalCompositeOperation='overlay';ctx.globalAlpha=.075;
    const p=ctx.createPattern(tex,'repeat');if(typeof DOMMatrix!=='undefined'&&p.setTransform)p.setTransform(new DOMMatrix().translateSelf(Math.floor(t*24)*47%128,Math.floor(t*24)*71%128));
    ctx.fillStyle=p;ctx.fillRect(0,0,W,Hh);ctx.restore();
  }
  function bez(P,u){const v=1-u;return [v*v*v*P[0][0]+3*v*v*u*P[1][0]+3*v*u*u*P[2][0]+u*u*u*P[3][0],v*v*v*P[0][1]+3*v*v*u*P[1][1]+3*v*u*u*P[2][1]+u*u*u*P[3][1]];}
  function arrow(ctx,P,prog,col,width=9,options={}){
    if(prog<=0)return;prog=clamp(prog);
    ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';
    if(options.dots)ctx.setLineDash([.01,width*1.9]);
    ctx.beginPath();ctx.moveTo(...bez(P,0));for(let i=1;i<=50;i++)ctx.lineTo(...bez(P,prog*i/50));ctx.stroke();ctx.setLineDash([]);
    if(options.head!==false){const p=bez(P,prog),b=bez(P,Math.max(0,prog-.02)),a=Math.atan2(p[1]-b[1],p[0]-b[0]);ctx.translate(...p);ctx.rotate(a);
      ctx.beginPath();ctx.moveTo(width*2,0);ctx.lineTo(-width*1.2,width*1.3);ctx.lineTo(-width*1.2,-width*1.3);ctx.closePath();ctx.fill();}
    ctx.restore();
  }
  function wing(ctx,x,y,rotorRadius=180,phase=0){
    ctx.save();ctx.translate(x,y);ctx.rotate(phase);
    // Rotor blade section top view, dark crescent bottom + soft highlights.
    const g=ctx.createLinearGradient(-rotorRadius,-10,rotorRadius,10);
    g.addColorStop(0,'#a4fbef');g.addColorStop(.45,'#3ccbdc');g.addColorStop(1,'#1d64b0');
    ctx.fillStyle=g;rr(ctx,-rotorRadius,-10,rotorRadius*2,20,10);ctx.fill();
    ctx.fillStyle='rgba(5,16,62,.3)';rr(ctx,0,1,rotorRadius,7,4);ctx.fill();
    ctx.restore();
  }
  function helicopter(ctx,x,y,scale,t,fail){
    ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
    // tail boom
    ctx.fillStyle='#2252a1';ctx.beginPath();ctx.moveTo(20,-2);ctx.lineTo(260,-35);ctx.lineTo(264,-10);ctx.lineTo(20,46);ctx.fill();
    ctx.fillStyle='#5acbd8';ctx.beginPath();ctx.moveTo(260,-12);ctx.lineTo(286,-70);ctx.lineTo(291,-69);ctx.lineTo(279,15);ctx.fill();
    // tail rotor subtle
    ctx.strokeStyle='#a4fbef';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(281,-40);ctx.lineTo(281,10);ctx.stroke();
    // body shadow and gradient
    const g=ctx.createLinearGradient(-165,-95,130,120);g.addColorStop(0,'#a4fbef');g.addColorStop(.42,'#3ccbdc');g.addColorStop(1,'#1d64b0');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-200,12);ctx.bezierCurveTo(-201,-74,-107,-112,30,-94);ctx.bezierCurveTo(135,-78,146,4,90,74);ctx.bezierCurveTo(19,112,-160,78,-200,12);ctx.fill();
    ctx.save();ctx.clip();ctx.fillStyle='rgba(17,39,104,.38)';ctx.beginPath();ctx.ellipse(36,70,169,60,-.15,0,TAU);ctx.fill();ctx.restore();
    // cockpit
    const cg=ctx.createLinearGradient(-170,-87,-13,65);cg.addColorStop(0,'#17368c');cg.addColorStop(1,'#0a1a55');
    ctx.fillStyle=cg;ctx.beginPath();ctx.moveTo(-175,-12);ctx.quadraticCurveTo(-149,-92,-58,-80);ctx.quadraticCurveTo(-24,-19,-49,59);ctx.quadraticCurveTo(-133,75,-175,-12);ctx.fill();
    ctx.fillStyle='rgba(173,244,255,.28)';ctx.beginPath();ctx.moveTo(-150,-44);ctx.quadraticCurveTo(-123,-70,-85,-63);ctx.lineTo(-102,-55);ctx.lineTo(-150,-4);ctx.fill();
    // landing skids
    ctx.strokeStyle='#b9f5fc';ctx.lineWidth=9;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(-138,132);ctx.lineTo(70,132);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-106,80);ctx.lineTo(-93,132);ctx.moveTo(35,82);ctx.lineTo(45,132);ctx.stroke();
    // shaft and main rotor: ALWAYS rotating even after engine fail.
    ctx.strokeStyle='#a4fbef';ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(-10,-93);ctx.lineTo(-10,-128);ctx.stroke();
    ctx.fillStyle='#ffd23f';ctx.beginPath();ctx.arc(-10,-128,13,0,TAU);ctx.fill();
    const ang=t*18;wing(ctx,-10,-132,230,Math.sin(ang)*.035);
    // blurred rotor disc represented by fine arcs, continuous spin signature
    ctx.strokeStyle='rgba(164,251,239,.32)';ctx.lineWidth=3;
    ctx.beginPath();ctx.ellipse(-10,-132,232,17,0,0,TAU);ctx.stroke();
    if(!fail){glow(ctx,52,8,100,'#ff8d3f',.12);} else {glow(ctx,52,8,110,'#ff3b5c',.2);}
    ctx.restore();
  }
  function section(ctx,x,y,scale,t,angle){
    ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
    const deg=(1-angle)*.19+angle*.04;
    ctx.rotate(-deg);const g=ctx.createLinearGradient(-160,-60,170,80);
    g.addColorStop(0,'#a4fbef');g.addColorStop(.5,'#3ccbdc');g.addColorStop(1,'#1d64b0');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-175,6);ctx.bezierCurveTo(-60,-50,114,-45,183,8);ctx.bezierCurveTo(100,26,-90,36,-175,6);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-140,0);ctx.quadraticCurveTo(0,-38,150,3);ctx.stroke();
    ctx.restore();
  }
  function demo(ctx,W,Hh,t){
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,W,Hh);
    const fail=t>2.3;
    sky(ctx,W,Hh,t,t*30);
    // ground ridge for scale
    ctx.fillStyle='#213e76';ctx.beginPath();ctx.moveTo(0,Hh);ctx.lineTo(0,580);ctx.lineTo(160,470);ctx.lineTo(390,610);ctx.lineTo(700,475);ctx.lineTo(975,550);ctx.lineTo(W,430);ctx.lineTo(W,Hh);ctx.fill();
    ctx.fillStyle='rgba(24,72,105,.6)';ctx.beginPath();ctx.moveTo(0,Hh);ctx.lineTo(0,655);ctx.lineTo(200,610);ctx.lineTo(500,690);ctx.lineTo(800,605);ctx.lineTo(W,665);ctx.lineTo(W,Hh);ctx.fill();
    const zoom=smooth(t,5.8,7.8),cut=smooth(t,8.7,9.8);
    const posX=lerp(650,450,zoom),posY=lerp(295,265+Math.min(95,Math.max(0,t-6)*18),zoom);
    if(t<9){
      helicopter(ctx,posX,posY,lerp(1,.78,zoom),t,fail);
      if(fail){label(ctx,'MOTOR APAGADO',850,85,30,{bg:C.red,fg:'#ffffff'});}
      if(t>=3.8){label(ctx,'ROTOR EN GIRO',310,110,27,{bg:C.cyan});}
      if(t>=6){
        for(let i=0;i<7;i++){
          const px=posX-125+i*42,phase=(t*1.4+i*.22)%1,
          yy=posY+170-phase*290;
          glow(ctx,px,yy,18,C.cyan,.25);
          ctx.fillStyle=H.rgba(C.cyan,.55+.4*Math.sin(phase*Math.PI));ctx.beginPath();ctx.arc(px,yy,6,0,TAU);ctx.fill();
        }
        arrow(ctx,[[posX-170,posY+210],[posX-180,posY+100],[posX-60,posY],[posX-70,posY-75]],smooth(t,6,6.8),C.cyan,8,{dots:true});
        label(ctx,'FLUJO RELATIVO ↑',980,185,26,{bg:'#ffffff'});
      }
    }else{
      const a=smooth(t,9,10);
      label(ctx,'PASO COLECTIVO',640,105,34,{bg:C.yellow});
      section(ctx,640,365,1.35,t,a);
      arrow(ctx,[[370,485],[450,525],[600,525],[690,480]],smooth(t,9.4,10.2),C.orange[1],8,{dots:true});
    }
    if(t<2.3){label(ctx,'¿Y SI FALLA EL MOTOR?',620,615,38,{bg:C.yellow});}
    else if(t<3.8){label(ctx,'EL ROTOR NO SE DETIENE',650,620,34,{bg:C.yellow});}
    else if(t>11){label(ctx,'AUTORROTACIÓN',650,625,43,{bg:C.yellow});}
    finish(ctx,W,Hh,t);
  }
  function score(k){
    k.play('whoosh',0,{gain:.17,dur:.5,minor:true});
    k.play('error',2.3,{gain:.3,minor:true});
    k.play('pop',3.8,{gain:.25,minor:true});
    k.play('whoosh',5.9,{gain:.22,dur:.7,minor:true});
    k.play('pop',9.3,{gain:.3,minor:true});
    k.play('ding',11.1,{gain:.26,minor:true});
  }
  registerStyle({
    id:'flat-vector-helicopter-adapted-reference',
    name:'Flat-Vector Science — Helicóptero (adaptación)',
    category:'Popular Explainer Looks',
    description:'Adaptación aerodinámica con técnicas y paleta Flat-Vector Science. No es el archivo original íntegro del Atlas.',
    fonts:['900 64px "Nunito"','700 28px "Nunito"','700 32px "Fredoka"'],
    duration:5, frameT:5, explainerDuration:15,readsPixels:false,
    draw(ctx,W,Hh,t){demo(ctx,W,Hh,t);},
    explainer(ctx,W,Hh,t){demo(ctx,W,Hh,t);},
    explainerSound(k){score(k);}
  });
})();
