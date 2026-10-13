// Snake
(() => {
const cv=document.getElementById("cv"), ctx=cv.getContext("2d");
const N=20, S=20;
let snake, dir, food, score, timer, over;
const $=id=>document.getElementById(id);
function place(){ food={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)}; }
function start(){
  snake=[{x:10,y:10}]; dir={x:1,y:0}; score=0; over=false;
  $("best").textContent=Auth.getBest("snake");
  place(); clearInterval(timer); timer=setInterval(tick,150); draw(); upd();
}
function tick(){
  const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
  if(h.x<0||h.y<0||h.x>=N||h.y>=N||snake.some(s=>s.x===h.x&&s.y===h.y)){
    over=true; clearInterval(timer); Sound.play("die");
    Auth.setBest("snake",score); $("best").textContent=Auth.getBest("snake");
    return;
  }
  snake.unshift(h);
  if(h.x===food.x&&h.y===food.y){ score+=10; Sound.play("eat"); place();
    clearInterval(timer); timer=setInterval(tick,Math.max(70,150-score)); }
  else snake.pop();
  draw(); upd();
}
function draw(){
  ctx.fillStyle="#0e141b"; ctx.fillRect(0,0,400,400);
  ctx.fillStyle="#f27e7e"; ctx.fillRect(food.x*S+2,food.y*S+2,S-4,S-4);
  ctx.fillStyle="#7ee081"; snake.forEach(s=>ctx.fillRect(s.x*S+1,s.y*S+1,S-2,S-2));
  if(over){ctx.fillStyle="#fff";ctx.font="20px Arial";ctx.textAlign="center";ctx.fillText("GAME OVER "+score,200,200);}
}
function upd(){$("score").textContent=score;}
document.addEventListener("keydown",e=>{
  const k=e.key.toLowerCase();
  if((k==="arrowup"||k==="w")&&dir.y!==1)dir={x:0,y:-1};
  if((k==="arrowdown"||k==="s")&&dir.y!==-1)dir={x:0,y:1};
  if((k==="arrowleft"||k==="a")&&dir.x!==1)dir={x:-1,y:0};
  if((k==="arrowright"||k==="d")&&dir.x!==-1)dir={x:1,y:0};
});
document.getElementById("restart").onclick=()=>{Sound.play("click");start();};
start();
})();
