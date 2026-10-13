// Login local con localStorage (sin backend)
const Auth = (() => {
  const UKEY = "arcade_users", SKEY = "arcade_session";
  const getUsers = () => JSON.parse(localStorage.getItem(UKEY) || "{}");
  const saveUsers = u => localStorage.setItem(UKEY, JSON.stringify(u));
  const hash = s => { let h = 0; for(let i=0;i<s.length;i++){ h=(h<<5)-h+s.charCodeAt(i); h|=0; } return String(h); };
  const current = () => localStorage.getItem(SKEY) || null;
  function register(u,p){
    u=(u||"").trim(); if(u.length<3) return "Usuario mínimo 3 letras";
    if((p||"").length<3) return "Contraseña mínima 3 caracteres";
    const users=getUsers();
    if(users[u]) return "Ese usuario ya existe";
    users[u]={pass:hash(p)}; saveUsers(users);
    localStorage.setItem(SKEY,u); return null;
  }
  function login(u,p){
    const users=getUsers();
    if(!users[u]) return "Usuario no registrado";
    if(users[u].pass!==hash(p)) return "Contraseña incorrecta";
    localStorage.setItem(SKEY,u); return null;
  }
  function logout(){ localStorage.removeItem(SKEY); }
  function bestKey(game){ return `best_${current()||"invitado"}_${game}`; }
  function getBest(game){ return Number(localStorage.getItem(bestKey(game))||0); }
  function setBest(game,v){ if(v>getBest(game)) localStorage.setItem(bestKey(game),v); }
  function refreshUI(){
    const u=current();
    const lbl=document.getElementById("userLabel");
    const lin=document.getElementById("loginBtn");
    const lout=document.getElementById("logoutBtn");
    if(lbl) lbl.textContent=u?("👤 "+u):"Invitado";
    if(lin) lin.style.display=u?"none":"";
    if(lout) lout.style.display=u?"":"none";
    const badge=document.getElementById("playerBadge");
    if(badge) badge.textContent=u?("Jugando como: "+u):"Jugando como invitado (entra en Home para login)";
  }
  document.addEventListener("DOMContentLoaded",()=>{
    refreshUI();
    const modal=document.getElementById("modal");
    const msg=document.getElementById("authMsg");
    const show=m=>{ if(msg) msg.textContent=m||""; };
    const lb=document.getElementById("loginBtn");
    if(lb) lb.onclick=()=>{ modal.classList.add("open"); show(""); };
    const cm=document.getElementById("closeModal");
    if(cm) cm.onclick=()=>modal.classList.remove("open");
    const dl=document.getElementById("doLogin");
    if(dl) dl.onclick=()=>{
      const u=document.getElementById("username").value, p=document.getElementById("password").value;
      const err=login(u,p);
      if(err){ show(err); return; }
      modal.classList.remove("open"); refreshUI(); Sound.play("win");
    };
    const dr=document.getElementById("doRegister");
    if(dr) dr.onclick=()=>{
      const u=document.getElementById("username").value, p=document.getElementById("password").value;
      const err=register(u,p);
      if(err){ show(err); return; }
      modal.classList.remove("open"); refreshUI(); Sound.play("win");
    };
    const lo=document.getElementById("logoutBtn");
    if(lo) lo.onclick=()=>{ logout(); refreshUI(); Sound.play("click"); };
  });
  return { current, getBest, setBest };
})();
