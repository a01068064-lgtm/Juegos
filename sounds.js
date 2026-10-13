// Sonido con Web Audio API, sin archivos externos
const Sound = (() => {
  const key = "arcade_muted";
  let ctx = null;
  function isMuted(){ return localStorage.getItem(key) === "1"; }
  function setMuted(m){ localStorage.setItem(key, m ? "1" : "0"); updateBtn(); }
  function toggle(){ setMuted(!isMuted()); }
  function ac(){
    if(!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if(ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function beep(freq=440, dur=0.12, type="square", vol=0.08, when=0){
    if(isMuted()) return;
    try{
      const c = ac(), o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.value = vol;
      o.connect(g); g.connect(c.destination);
      const t = c.currentTime + when;
      o.start(t); o.stop(t + dur);
    }catch(e){}
  }
  const sfx = {
    click(){ beep(600,.07); },
    move(){ beep(300,.05); },
    rotate(){ beep(450,.06); },
    eat(){ beep(880,.09); beep(1320,.09,"square",.06,.08); },
    die(){ beep(200,.3,"sawtooth",.1); },
    hit(){ beep(500,.06); },
    line(){ beep(700,.1); beep(1050,.12,"square",.08,.1); },
    score(){ beep(990,.12); },
    win(){ [523,659,784,1046].forEach((f,i)=>beep(f,.14,"square",.08,i*.13)); },
    lose(){ [400,300,200].forEach((f,i)=>beep(f,.16,"sawtooth",.08,i*.15)); }
  };
  function play(name){ (sfx[name]||sfx.click)(); }
  function updateBtn(){
    const b = document.getElementById("soundBtn");
    if(b) b.textContent = isMuted() ? "🔇" : "🔊";
  }
  document.addEventListener("DOMContentLoaded", () => {
    updateBtn();
    const b = document.getElementById("soundBtn");
    if(b) b.onclick = () => { toggle(); Sound.play("click"); };
    document.addEventListener("keydown", e => {
      if(e.key.toLowerCase() === "m" && !e.target.matches("input")) toggle();
    });
  });
  return { play, toggle, isMuted };
})();
