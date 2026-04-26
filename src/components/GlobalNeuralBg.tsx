"use client";
import { useEffect, useRef } from "react";

/* ── palette ── */
const CY = "#00d4ff", PU = "#7c3aed", GR = "#10b981", OR = "#f97316", AM = "#f59e0b";
const LAYER_COLS = [OR, "#fbbf24", CY, GR, "#6ee7b7"];
const LAYERS     = [5, 7, 8, 7, 4];

function r(hex: string, a: number) {
  const n = parseInt(hex.replace("#",""),16);
  return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
}
function glowCirc(c: CanvasRenderingContext2D, x: number, y: number, rad: number, col: string, a: number) {
  const g = c.createRadialGradient(x,y,0,x,y,rad);
  g.addColorStop(0, r(col,a)); g.addColorStop(1,"transparent");
  c.beginPath(); c.arc(x,y,rad,0,Math.PI*2); c.fillStyle=g; c.fill();
}

export function GlobalNeuralBg() {
  const ref    = useRef<HTMLCanvasElement>(null);
  const mouse  = useRef({x:-9999,y:-9999});
  const animId = useRef(0);
  const fr     = useRef(0);

  useEffect(()=>{
    const canvas = ref.current!;
    const ctx    = canvas.getContext("2d")!;

    /* ── NN state ── */
    type NNode  = {x:number;y:number;layer:number;idx:number;r:number;phase:number};
    type Pulse  = {li:number;ai:number;bi:number;t:number;spd:number};
    let nodes:  NNode[] = [];
    let pulses: Pulse[] = [];

    /* ── init ── */
    function resize(){
      canvas.width=window.innerWidth;
      canvas.height=window.innerHeight;
      buildNN();
    }

    function buildNN(){
      nodes=[]; pulses=[];
      const W=canvas.width, H=canvas.height;
      const xPad=W*.06, xStep=(W*.88)/(LAYERS.length-1);
      LAYERS.forEach((cnt,li)=>{
        for(let ni=0;ni<cnt;ni++){
          nodes.push({
            x: xPad+li*xStep,
            y: H/(cnt+1)*(ni+1),
            layer:li, idx:ni,
            r: 5+Math.random()*4,
            phase:Math.random()*Math.PI*2
          });
        }
      });
      // edges → pulses
      for(let li=0;li<LAYERS.length-1;li++){
        const A=nodes.filter(n=>n.layer===li);
        const B=nodes.filter(n=>n.layer===li+1);
        A.forEach(a=>B.forEach(b=>{
          if(Math.random()<.55)
            pulses.push({li,ai:a.idx,bi:b.idx,t:Math.random(),spd:.0025+Math.random()*.004});
        }));
      }
    }

    /* ── draw ── */
    function draw(){
      fr.current++;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      drawNN();
      animId.current=requestAnimationFrame(draw);
    }

    function drawNN(){
      const W=canvas.width, H=canvas.height;

      /* edges */
      for(let li=0;li<LAYERS.length-1;li++){
        const A=nodes.filter(n=>n.layer===li);
        const B=nodes.filter(n=>n.layer===li+1);
        ctx.lineWidth=.8;
        A.forEach(a=>B.forEach(b=>{
          const g=ctx.createLinearGradient(a.x,a.y,b.x,b.y);
          g.addColorStop(0,r(LAYER_COLS[li],.18));
          g.addColorStop(1,r(LAYER_COLS[li+1],.18));
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.strokeStyle=g; ctx.stroke();
        }));
      }

      /* pulses */
      for(const p of pulses){
        p.t+=p.spd; if(p.t>1) p.t=0;
        const a=nodes.find(n=>n.layer===p.li&&n.idx===p.ai)!;
        const b=nodes.find(n=>n.layer===p.li+1&&n.idx===p.bi)!;
        if(!a||!b) continue;
        const px=a.x+(b.x-a.x)*p.t, py=a.y+(b.y-a.y)*p.t;
        const col=LAYER_COLS[p.li];
        glowCirc(ctx,px,py,18,col,.65);
        ctx.beginPath(); ctx.arc(px,py,3,0,Math.PI*2);
        ctx.fillStyle=r(col,.95); ctx.fill();
      }

      /* nodes */
      const mx=mouse.current.x, my=mouse.current.y;
      for(const n of nodes){
        n.phase+=.011;
        const pr=n.r*(1+Math.sin(n.phase)*.3);
        const col=LAYER_COLS[n.layer];
        const d=Math.hypot(n.x-mx,n.y-my);
        const boost=d<120?((120-d)/120)*.4:0;
        glowCirc(ctx,n.x,n.y,pr*9+18,col,.15+boost);
        glowCirc(ctx,n.x,n.y,pr*3,col,.5);
        ctx.beginPath(); ctx.arc(n.x,n.y,pr,0,Math.PI*2);
        ctx.fillStyle=r(col,1);
        ctx.shadowColor=col; ctx.shadowBlur=16;
        ctx.fill(); ctx.shadowBlur=0;
      }
    }

    window.addEventListener("mousemove",e=>{mouse.current={x:e.clientX,y:e.clientY};});
    window.addEventListener("mouseleave",()=>{mouse.current={x:-9999,y:-9999};});
    window.addEventListener("resize",resize);
    resize(); draw();

    return ()=>{
      cancelAnimationFrame(animId.current);
      window.removeEventListener("resize",resize);
      window.removeEventListener("mousemove",e=>{mouse.current={x:e.clientX,y:e.clientY};});
    };
  },[]);

  return (
    <canvas
      ref={ref}
      style={{position:"fixed",inset:0,width:"100vw",height:"100vh",
              pointerEvents:"none",zIndex:0,opacity:.82}}
      aria-hidden="true"
    />
  );
}
