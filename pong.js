// Pong vs CPU / 2P
(() => {
const cv=document.getElementById("cv"), ctx=cv.getContext("2d");
const W=cv.width, H=cv.height;
let p1,p2,ball,s1,s2,over,mode;
const $=id=>document.getElementById(id);
const keys={};
function start(){
  mode=document.getElementById("mode").value;
  p1={x:10,y:H/2-40,w:12,h:80,dy:6};
  p2={x:W-22,y:H/2-40,w:12,h:80,dy:6};
  resetBall(); s1=0;s2=0;over=false;upd();
}
function resetBall(){
  ball={x:W/2,y:H/2,vx:(Math.random()<.5?-1:1)*4,vy:(Math.random()*4-2)};
}
function upd(){$("s1").textContent=s1;$("s2").textContent=s2;}
function loop(){
  // input
  if(keys["w"])p1.y-=p1.dy; if(keys["s"])p1.y+=p1.dy;
  if(mode==="2p"){ if(keys["arrowup"])p2.y-=p2.dy; if(keys["arrowdown"])p2.y+=p2.dy; }
  else{ // CPU sigue bola
    if(ball.y<p2.y+p2.h/2)p2.y-=4; else p2.y+=4;
  }
  p1.y=Math.max(0,Math.min(H-p1.h,p1.y)); p2.y=Math.max(0,Math.min(H-p2.h,p2.y));
  ball.x+=ball.vx; ball.y+=ball.vy;
  if(ball.y<0||ball.y>H){ball.vy*=-1;Sound.play("hit");}
  // paletas
  if(ball.x< p1.x+p1.w && ball.y>p1.y && ball.y<p1.y+p1.h){ball.vx=Math.abs(ball.vx);Sound.play("hit");}
  if(ball.x> p2.x && ball.y>p2.y && ball.y<p2.y+p2.h){ball.vx=-Math.abs(ball.vx);Sound.play("hit");}
  if(ball.x<0){s2++;Sound.play("score");check();resetBall();}
  if(ball.x>W){s1++;Sound.play("score");check();resetBall();}
  upd(); draw();
  if(!over)requestAnimationFrame(loop);
}
function check(){
  if(s1>=5||s2>=5){over=true;Sound.play(s1>=5?"win":"lose");
    ctx.fillStyle="#fff";ctx.font="24px Arial";ctx.textAlign="center";
    ctx.fillText(s1>=5?"Gana Jugador 1":"Gana "+(mode==="2p"?"Jugador 2":"CPU"),W/2,H/2);}
}
function draw(){
  ctx.fillStyle="#0e141b";ctx.fillRect(0,0,W,H);
  ctx.fillStyle="#2a475e";for(let y=0;y<H;y+=20)ctx.fillRect(W/2-2,y,4,10);
  ctx.fillStyle="#66c0f4";ctx.fillRect(p1.x,p1.y,p1.w,p1.h);ctx.fillRect(p2.x,p2.y,p2.w,p2.h);
  ctx.fillStyle="#fff";ctx.fillRect(ball.x-6,ball.y-6,12,12);
}
document.addEventListener("keydown",e=>{keys[e.key.toLowerCase()]=true;});
document.addEventListener("keyup",e=>{keys[e.key.toLowerCase()]=false;});
cv.addEventListener("mousemove",e=>{
  if(mode!=="cpu")return;
  const r=cv.getBoundingClientRect();
  p1.y=(e.clientY-r.top)-p1.h/2;
});
document.getElementById("mode").onchange=start;
document.getElementById("restart").onclick=()=>{Sound.play("click");start();loop();};
start();loop();
})();
