import { SPRINKLERS, WEATHERS } from "./data.js";

const sprBox=document.getElementById("sprinkler-grid");
const boostBox=document.getElementById("booster-grid");
const wBox=document.getElementById("weather-grid");

function cardHTML(icon,title,lines=[],pills=[]){
  const P=pills.map(t=>`<span class="pill">${t}</span>`).join("");
  const L=lines.map(t=>`<div class="muted tiny">${t}</div>`).join("");
  return `<div class="card"><div class="title">${icon}<span>${title}</span></div>${P}${L}</div>`;
}

// sprinklers
SPRINKLERS.forEach(s=>{
  const pills=[];
  if(s.sizeAdd!=null) pills.push(`${(1+s.sizeAdd).toFixed(2)}× size`);
  pills.push(`${s.durationMin}m`);
  const html=cardHTML(s.icon,s.name,[s.info],pills);
  (s.category==="core"?sprBox:boostBox).insertAdjacentHTML("beforeend",html);
});

// weather grouped by tier
["permanent","limited","admin"].forEach(t=>{
  const group=WEATHERS.filter(w=>w.tier===t);
  if(!group.length) return;
  group.forEach(w=>{
    wBox.insertAdjacentHTML("beforeend", cardHTML(w.icon,w.name,[w.effects.join(" • ")]));
  });
});
