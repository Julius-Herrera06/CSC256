import { SPRINKLERS, WEATHERS, MUTATIONS, FALLBACK_PLANTS } from "./data.js";

/* ---------- Tabs ---------- */
document.querySelectorAll(".tab-link").forEach(a=>{
  a.addEventListener("click",e=>{
    e.preventDefault();
    const tab=a.dataset.tab;
    document.querySelectorAll(".tab-link").forEach(x=>x.classList.toggle("active",x===a));
    document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x.id===tab));
    // allow "Open Simulator" hero button
    if (a.classList.contains("btn")) document.querySelector(`.tab-link[data-tab="${tab}"]`)?.click();
  });
});

/* ---------- Sprinklers / Boosters UI (cards) ---------- */
const gridSpr = document.getElementById("sprinkler-grid");
const gridBoost = document.getElementById("booster-grid");

function cardHTML(icon, title, lines=[], pills=[]){
  const p = pills.map(t=>`<span class="pill">${t}</span>`).join("");
  const l = lines.map(t=>`<div class="muted tiny">${t}</div>`).join("");
  return `<div class="card">
    <div class="title">${icon}<span>${title}</span></div>
    ${p}${l}
  </div>`;
}

SPRINKLERS.forEach(s=>{
  const pills=[];
  if (s.sizeAdd!=null) pills.push(`${(1+s.sizeAdd).toFixed(2)}× size`);
  pills.push(`${s.durationMin}m`);
  const html=cardHTML(s.icon, s.name, [s.info], pills);
  const box = (s.category==="core") ? gridSpr : gridBoost;
  box.insertAdjacentHTML("beforeend", html);
});

/* ---------- Weather cards, grouped by tier ---------- */
const gridWeather = document.getElementById("weather-grid");
["permanent","limited","admin"].forEach(tier=>{
  const group = WEATHERS.filter(w=>w.tier===tier);
  if (!group.length) return;
  const header = `<div class="card"><div class="title">📌 <span style="opacity:.9;text-transform:capitalize">${tier}</span></div></div>`;
  gridWeather.insertAdjacentHTML("beforeend", header);
  group.forEach(w=>{
    const html = cardHTML(w.icon, w.name, [w.effects.join(" • ")]);
    gridWeather.insertAdjacentHTML("beforeend", html);
  });
});

/* ---------- Plant list: live wiki fetch with fallback ---------- */
let PLANTS=[];
const plantGallery=document.getElementById("plant-gallery");
const plantMsg=document.getElementById("plant-msg");
const plantSelect=document.getElementById("plant-select");

async function loadPlants(){
  try{
    const url="https://growagarden.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:Crops&cmlimit=500&format=json&origin=*";
    const res=await fetch(url);
    if(!res.ok) throw new Error(res.status);
    const json=await res.json();
    const names=(json?.query?.categorymembers||[]).map(x=>x.title).filter(t=>!t.startsWith("Category:"));
    PLANTS=Array.from(new Set(names)).sort((a,b)=>a.localeCompare(b));
    plantMsg.textContent=`${PLANTS.length} plants loaded from the wiki`;
  }catch{
    PLANTS=FALLBACK_PLANTS.slice().sort((a,b)=>a.localeCompare(b));
    plantMsg.textContent=`Offline fallback list (${PLANTS.length})`;
  }
  fillPlantUI();
}
function fillPlantUI(){
  plantSelect.innerHTML=PLANTS.map(p=>`<option value="${p}">${p}</option>`).join("");
  renderPlantChips(PLANTS.slice(0,60));
  document.getElementById("stat-plants").textContent = PLANTS.length.toString();
}
function renderPlantChips(list){
  plantGallery.innerHTML=list.map(n=>`<span class="chip">${n}</span>`).join("");
}
document.getElementById("plant-search").addEventListener("input",e=>{
  const q=e.target.value.toLowerCase();
  const hits=PLANTS.filter(p=>p.toLowerCase().includes(q)).slice(0,120);
  renderPlantChips(hits);
});
loadPlants();

// header stats
document.getElementById("stat-weathers").textContent = WEATHERS.length.toString();
document.getElementById("stat-sprinklers").textContent = SPRINKLERS.length.toString();

/* ---------- Simulator ---------- */
const sizeInput = document.getElementById("size-mult");
const sizeOut = document.getElementById("size-mult-out");
sizeInput.addEventListener("input",()=> sizeOut.textContent = `${(+sizeInput.value).toFixed(2)}×`);
sizeOut.textContent = "1.00×";

const growthSelect = document.getElementById("growth-mutation");
MUTATIONS.growth.forEach(m=>{
  const opt=document.createElement("option");
  opt.value=m.key;
  opt.textContent=`${m.name} (x${m.mult})`;
  growthSelect.appendChild(opt);
});

// environmental checkboxes
const envWrap=document.getElementById("env-mutations");
MUTATIONS.environmental.forEach(m=>{
  const id=`env-${m.key}`;
  const label=document.createElement("label");
  label.innerHTML=`<input type="checkbox" id="${id}" value="${m.key}" /> ${m.name} (x${m.mult})`;
  envWrap.appendChild(label);
});
const envRules=document.getElementById("env-rules");
envRules.textContent = "Rules: one Growth only. Acidic cannot stack with Wet/Drenched. Frozen replaces Wet/Drenched + Chilled. Clay replaces Wet + Sandy. Tempestuous = Windstruck + Twisted. Paradisal = Verdant + Sundried. Ceramic = Clay + (Burnt/Fried/Cooked/Molten/Sundried/Meteoric/Plasma).";

function selectedEnvKeys(){
  const keys=[...envWrap.querySelectorAll("input:checked")].map(i=>i.value);
  return normalizeCombos(keys);
}
function normalizeCombos(keys){
  const set=new Set(keys);
  // Acidic rule
  if(set.has("acidic")){ set.delete("wet"); set.delete("drenched"); }
  // combos
  MUTATIONS.environmental.forEach(m=>{
    if(m.combo && m.combo.every(k=>set.has(k))){
      m.replaces?.forEach(x=>set.delete(x));
      set.add(m.key);
    }
    if(m.comboAny){
      const ok = m.comboAny.every(group=>group.some(k=>set.has(k)));
      if(ok){ m.replaces?.forEach(x=>set.delete(x)); set.add(m.key); }
    }
  });
  return [...set];
}
function envMultiplier(keys){
  const list=MUTATIONS.environmental.filter(m=>keys.includes(m.key));
  const sum=list.reduce((a,m)=>a+m.mult,0);
  return 1 + sum - list.length; // additive stack model per wiki
}

// mode toggle
const modeSel=document.getElementById("mode-select");
const baseFields=document.getElementById("base-fields");
const calFields=document.getElementById("calibrate-fields");
modeSel.addEventListener("change",()=>{
  const cal = modeSel.value==="calibrate";
  baseFields.classList.toggle("hidden",cal);
  calFields.classList.toggle("hidden",!cal);
});

// core math
function computeFromBase({baseValue,baseWeight,finalWeight,growthKey,envKeys}){
  const growth=MUTATIONS.growth.find(x=>x.key===growthKey)?.mult||1;
  const env=envMultiplier(envKeys);
  const constant = baseValue / (baseWeight*baseWeight);
  const cropValue = constant * finalWeight * finalWeight;
  const total = cropValue * growth * env;
  return {constant,cropValue,growth,env,total,finalWeight};
}
function computeFromSample({samplePrice,sampleWeight,sampleEnvKeys,sampleGrowthKey,targetWeight,targetEnvKeys,targetGrowthKey}){
  const gS=MUTATIONS.growth.find(x=>x.key===sampleGrowthKey)?.mult||1;
  const eS=envMultiplier(sampleEnvKeys);
  const constant = (samplePrice / Math.max(1e-9,(gS*eS))) / (sampleWeight*sampleWeight);
  const gT=MUTATIONS.growth.find(x=>x.key===targetGrowthKey)?.mult||1;
  const eT=envMultiplier(targetEnvKeys);
  const cropValue = constant * targetWeight * targetWeight;
  const total = cropValue * gT * eT;
  return {constant,cropValue,growth:gT,env:eT,total,finalWeight:targetWeight};
}

const outTotal = document.getElementById("result-total");
const outCrop = document.getElementById("br-crop");
const outGrowth = document.getElementById("br-growth");
const outEnv = document.getElementById("br-env");
const outWeight = document.getElementById("br-weight");
const outConst = document.getElementById("br-const");

document.getElementById("calc-form").addEventListener("submit",e=>{
  e.preventDefault();
  const growthKey = growthSelect.value;
  const envKeys = selectedEnvKeys();
  const size = parseFloat(sizeInput.value||"1");
  const mode = modeSel.value;

  let res;
  if(mode==="base"){
    const baseValue=parseFloat(document.getElementById("base-value").value);
    const baseWeight=parseFloat(document.getElementById("base-weight").value);
    if(!baseValue || !baseWeight){ outTotal.textContent="Enter base value and base weight"; return; }
    res = computeFromBase({
      baseValue, baseWeight,
      finalWeight: baseWeight*size,
      growthKey, envKeys
    });
  }else{
    const samplePrice=parseFloat(document.getElementById("sample-price").value);
    const sampleWeight=parseFloat(document.getElementById("sample-weight").value);
    if(!samplePrice || !sampleWeight){ outTotal.textContent="Enter sample price and weight"; return; }
    res = computeFromSample({
      samplePrice, sampleWeight,
      sampleEnvKeys: envKeys, sampleGrowthKey: growthKey,
      targetWeight: sampleWeight*size,
      targetEnvKeys: envKeys, targetGrowthKey: growthKey
    });
  }

  outTotal.textContent = `${res.total.toLocaleString(undefined,{maximumFractionDigits:3})} S`;
  outCrop.textContent = `${res.cropValue.toLocaleString(undefined,{maximumFractionDigits:3})} S`;
  outGrowth.textContent = `×${res.growth}`;
  outEnv.textContent = `×${res.env.toFixed(2)}`;
  outWeight.textContent = `${res.finalWeight.toFixed(3)} kg`;
  outConst.textContent = res.constant.toExponential(6);
});

document.getElementById("reset-btn").addEventListener("click",()=>{
  document.getElementById("calc-form").reset();
  sizeInput.value="1";
  sizeOut.textContent="1.00×";
  outTotal.textContent="—"; outCrop.textContent="—"; outGrowth.textContent="—";
  outEnv.textContent="—"; outWeight.textContent="—"; outConst.textContent="—";
});
