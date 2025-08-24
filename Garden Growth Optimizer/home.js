import { WEATHERS, SPRINKLERS, FALLBACK_PLANTS } from "./data.js";

// header stats
document.getElementById("stat-weathers").textContent = WEATHERS.length;
document.getElementById("stat-sprinklers").textContent = SPRINKLERS.length;

// load plants from wiki (fallback offline)
let PLANTS=[];
const msg=document.getElementById("plant-msg");
const gallery=document.getElementById("plant-gallery");
const search=document.getElementById("plant-search");

async function loadPlants(){
  try{
    const url="https://growagarden.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:Crops&cmlimit=500&format=json&origin=*";
    const r=await fetch(url);
    if(!r.ok) throw new Error(r.status);
    const j=await r.json();
    PLANTS=(j?.query?.categorymembers||[]).map(x=>x.title).filter(t=>!t.startsWith("Category:"));
    PLANTS=[...new Set(PLANTS)].sort((a,b)=>a.localeCompare(b));
    msg.textContent=`${PLANTS.length} plants loaded from the wiki`;
  }catch{
    PLANTS=[...FALLBACK_PLANTS].sort((a,b)=>a.localeCompare(b));
    msg.textContent=`Offline fallback list (${PLANTS.length})`;
  }
  render(PLANTS.slice(0,120));
  document.getElementById("stat-plants").textContent = PLANTS.length;
}
function render(list){ gallery.innerHTML=list.map(n=>`<span class="chip">${n}</span>`).join(""); }
search.addEventListener("input",e=>{
  const q=e.target.value.toLowerCase();
  render(PLANTS.filter(p=>p.toLowerCase().includes(q)).slice(0,200));
});
loadPlants();
