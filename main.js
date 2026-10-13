// Home: hero rotativo + buscador
const FEATURED = [
  { title:"Tetris", desc:"Apila bloques y limpia líneas.", art:"🧱", link:"tetris.html" },
  { title:"Gato", desc:"Tres en raya. PvP local o contra CPU.", art:"⭕", link:"gato.html" },
  { title:"Snake", desc:"Come, crece y no choques.", art:"🐍", link:"snake.html" },
  { title:"Pong", desc:"Tenis clásico. Vs CPU o 2P local.", art:"🏓", link:"pong.html" }
];
document.addEventListener("DOMContentLoaded", () => {
  let i = 0;
  const t=document.getElementById("heroTitle"), d=document.getElementById("heroDesc"),
        a=document.getElementById("heroArt"), l=document.getElementById("heroLink");
  setInterval(()=>{
    i=(i+1)%FEATURED.length;
    const f=FEATURED[i];
    t.textContent=f.title; d.textContent=f.desc; a.textContent=f.art; l.href=f.link;
  }, 4000);
  const s=document.getElementById("search");
  s.addEventListener("input",()=>{
    const q=s.value.toLowerCase();
    document.querySelectorAll("#grid .card").forEach(c=>{
      c.style.display=c.dataset.name.includes(q)?"":"none";
    });
  });
});
