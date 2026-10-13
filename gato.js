// Gato PvP + vs CPU
(() => {
const board=document.getElementById("board"), status=document.getElementById("status");
const mode=document.getElementById("mode");
let cells, turn, sx=0, so=0, se=0, lock=false;
const WINS=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function render(){
  board.innerHTML="";
  cells.forEach((v,i)=>{
    const b=document.createElement("button");
    b.textContent=v||""; b.onclick=()=>move(i);
    board.appendChild(b);
  });
  document.getElementById("sx").textContent=sx;
  document.getElementById("so").textContent=so;
  document.getElementById("se").textContent=se;
}
function winner(){
  for(const w of WINS){ const [a,b,c]=w; if(cells[a]&&cells[a]===cells[b]&&cells[a]===cells[c])return cells[a]; }
  return cells.every(v=>v)?"E":null;
}
function move(i){
  if(cells[i]||lock)return;
  cells[i]=turn; Sound.play("click");
  let w=winner();
  if(w)return finish(w);
  turn=turn==="X"?"O":"X";
  status.textContent="Turno: "+turn;
  render();
  if(mode.value==="cpu"&&turn==="O"){ lock=true; setTimeout(cpu,400); }
}
function cpu(){
  const empty=cells.map((v,i)=>v?null:i).filter(v=>v!==null);
  // ganar o bloquear
  for(const p of ["O","X"])for(const i of empty){
    cells[i]=p; let win=false;
    for(const w of WINS){const[a,b,c]=w;if(cells[a]===p&&cells[b]===p&&cells[c]===p)win=true;}
    cells[i]=""; if(win){cells[i]="O";return afterCpu();}
  }
  cells[empty[Math.floor(Math.random()*empty.length)]]="O";
  afterCpu();
}
function afterCpu(){
  Sound.play("move"); lock=false;
  let w=winner(); if(w)return finish(w);
  turn="X"; status.textContent="Turno: "+turn; render();
}
function finish(w){
  render(); lock=false;
  if(w==="E"){se++;status.textContent="Empate";Sound.play("hit");}
  else{if(w==="X"){sx++;Auth.setBest("gato_X",sx);}else{so++;}status.textContent="Gana "+w;Sound.play("win");}
  render();
  setTimeout(()=>{cells=Array(9).fill("");turn="X";status.textContent="Turno: X";render();},1200);
}
document.getElementById("restart").onclick=()=>{cells=Array(9).fill("");turn="X";status.textContent="Turno: X";lock=false;Sound.play("click");render();};
mode.onchange=()=>{cells=Array(9).fill("");turn="X";status.textContent="Turno: X";lock=false;render();};
cells=Array(9).fill("");turn="X";render();
})();
