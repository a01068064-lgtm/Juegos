// Tetris 10x20
(() => {
const cv=document.getElementById("cv"), ctx=cv.getContext("2d");
const COLS=10, ROWS=20, S=30;
const COLORS={I:"#66c0f4",O:"#f2c14e",T:"#b388ff",S:"#7ee081",Z:"#f27e7e",J:"#6a8dff",L:"#f2a33c"};
const SHAPES={
 I:[[1,1,1,1]], O:[[1,1],[1,1]], T:[[0,1,0],[1,1,1]],
 S:[[0,1,1],[1,1,0]], Z:[[1,1,0],[0,1,1]], J:[[1,0,0],[1,1,1]], L:[[0,0,1],[1,1,1]]
};
let board, piece, score, lines, over, paused, timer;
const $=id=>document.getElementById(id);
function empty(){ return Array.from({length:ROWS},()=>Array(COLS).fill(0)); }
function newPiece(){
  const k=Object.keys(SHAPES)[Math.floor(Math.random()*7)];
  return { shape:SHAPES[k].map(r=>[...r]), color:COLORS[k], x:3, y:0 };
}
function collide(p=piece){
  for(let r=0;r<p.shape.length;r++)for(let c=0;c<p.shape[r].length;c++){
    if(!p.shape[r][c])continue;
    const x=p.x+c, y=p.y+r;
    if(x<0||x>=COLS||y>=ROWS||(y>=0&&board[y][x]))return true;
  }
  return false;
}
function merge(){ piece.shape.forEach((row,r)=>row.forEach((v,c)=>{ if(v&&piece.y+r>=0)board[piece.y+r][piece.x+c]=piece.color; })); }
function clear(){
  let n=0;
  board=board.filter(row=>{ if(row.every(v=>v)){n++;return false;} return true; });
  while(board.length<ROWS)board.unshift(Array(COLS).fill(0));
  if(n){ lines+=n; score+=n*100; Sound.play("line"); }
}
function step(){
  if(paused||over)return;
  piece.y++;
  if(collide()){ piece.y--; merge(); clear(); piece=newPiece();
    if(collide()){ over=true; end(); return; }
  }
  draw(); update();
}
function end(){
  clearInterval(timer); Sound.play("lose");
  Auth.setBest("tetris",score); $("best").textContent=Auth.getBest("tetris");
  ctx.fillStyle="rgba(0,0,0,.7)"; ctx.fillRect(0,250,300,100);
  ctx.fillStyle="#fff"; ctx.font="20px Arial"; ctx.textAlign="center";
  ctx.fillText("GAME OVER",150,290); ctx.fillText(score+" pts",150,315);
}
function draw(){
  ctx.fillStyle="#0e141b"; ctx.fillRect(0,0,cv.width,cv.height);
  board.forEach((row,r)=>row.forEach((v,c)=>{ if(v){ctx.fillStyle=v;ctx.fillRect(c*S+1,r*S+1,S-2,S-2);} }));
  if(piece)piece.shape.forEach((row,r)=>row.forEach((v,c)=>{ if(v){ctx.fillStyle=piece.color;ctx.fillRect((piece.x+c)*S+1,(piece.y+r)*S+1,S-2,S-2);} }));
}
function update(){ $("score").textContent=score; $("lines").textContent=lines; }
function rotate(){ const s=piece.shape[0].map((_,i)=>piece.shape.map(r=>r[i]).reverse()); const o=piece.shape; piece.shape=s; if(collide())piece.shape=o; else Sound.play("rotate"); }
function start(){
  board=empty(); piece=newPiece(); score=0; lines=0; over=false; paused=false;
  $("best").textContent=Auth.getBest("tetris");
  clearInterval(timer); timer=setInterval(step,500); draw(); update();
}
document.addEventListener("keydown",e=>{
  if(e.key==="p"||e.key==="P"){paused=!paused;return;}
  if(paused||over)return;
  if(e.key==="ArrowLeft"){piece.x--;if(collide())piece.x++;else Sound.play("move");}
  if(e.key==="ArrowRight"){piece.x++;if(collide())piece.x--;else Sound.play("move");}
  if(e.key==="ArrowDown"){step();}
  if(e.key==="ArrowUp"){rotate();}
  draw();
});
document.getElementById("restart").onclick=()=>{Sound.play("click");start();};
start();
})();
