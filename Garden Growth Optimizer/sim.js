import { MUTATIONS, FALLBACK_PLANTS } from "./data.js";

// plant select: use fallback (simulator doesn’t need full fetch)
const plantSel=document.getElementById("plant-select");
FALLBACK_PLANTS.sort((a,b)=>a.localeCompare(b)).forEach(p=>{
  const o=document.createElement("option"); o.value=p; o.textContent=p; plantSel.appendChild(o);
});

// growth select
const growthSel=document.getElementById("growth-mutation");
MUTATIONS.growth.forEach(m=>{
  const o=document.createElement("option"); o.value=m.key; o.textContent=`${m.name} (x${m.mult})`; growthSel.appendChild(o);
});

// env checkboxes
const envWrap=document.getElementById("env-mutations");
MUTATIONS.environmental.forEach(m=>{
  const id=`env-${m.key}`;
  const label=document.createElement("label");
  label.innerHTML=`<input type="checkbox" id="${id}" value="${m.key}" /> ${m.name} (x${m.mult})`;
  envWrap.appendChild(label);
});
const envRules=document.getElementById("env-rules");
envRules.textContent="Rules: one Growth only. Acidic cannot stack with Wet/Drenched. Frozen replaces Wet/Drenched + Chilled. Clay replaces Wet + Sandy. Tempestuous = Windstruck + Twisted. Paradisal = Verdant + Sundried. Ceramic = Clay + (Burnt/Fried/Cooked/Molten/Sundried/Meteoric/Plasma).";

// size slider
const sizeInput=document.getElementById("size-mult");
const sizeOut=document.getElementById("size-mult-out");
sizeInput.addEventListener("input",()=> sizeOut.textContent = `${(+sizeInput.value).toFixed(2)}×`);
sizeOut.textContent="1.00×";

// mode toggle
const modeSel=document.getElementById("mode-select");
const baseFields=document.getElementById("base-fields");
const calFields=document.getElementById("calibrate-fields");
modeSel.addEventListener("change",()=>{
  const cal = modeSel.value==="calibrate";
  baseFields.classList.toggle("hidden",cal);
  calFields.classList.toggle("hidden",!cal);
});

// helpers
function selectedEnvKeys(){
  const keys=[...envWrap.querySelectorAll("input:checked")].map(i=>i.value);
  return normalizeCombos(keys);
}
function normalizeCombos(keys){
  const set=new Set(keys);
  // Acidic conflict
  if(set.has("acidic")){ set.delete("wet"); set.delete("drenched"); }
  // combo + comboAny handling
  MUTATIONS.environmental.forEach(m=>{
    if(m.combo && m.combo.every(k=>set.has(k))){ m.replaces?.forEach(x=>set.delete(x)); set.add(m.key); }
    if(m.comboAny && m.comboAny.every(group=>group.some(k=>set.has(k)))){ m.replaces?.forEach(x=>set.delete(x)); set.add(m.key); }
  });
  return [...set];
}
function envMultiplier(keys){
  const list=MUTATIONS.environmental.filter(m=>keys.includes(m.key));
  const sum=list.reduce((a,m)=>a+m.mult,0);
  return 1 + sum - list.length;
}

// outputs
const outTotal=document.getElementById("result-total");
const outCrop=document.getElementById("br-crop");
const outGrowth=document.getElementById("br-growth");
const outEnv=document.getElementById("br-env");
const outWeight=document.getElementById("br-weight");
const outConst=document.getElementById("br-const");

// compute
function fromBase({baseValue,baseWeight,finalWeight,growthKey,envKeys}){
  const growth=MUTATIONS.growth.find(x=>x.key===growthKey)?.mult||1;
  const env=envMultiplier(envKeys);
  const constant=baseValue/(baseWeight*baseWeight);
  const cropValue=constant*finalWeight*finalWeight;
  const total=cropValue*growth*env;
  return {constant,cropValue,growth,env,total,finalWeight};
}
function fromSample({samplePrice,sampleWeight,sampleEnvKeys,sampleGrowthKey,targetWeight,targetEnvKeys,targetGrowthKey}){
  const gS=MUTATIONS.growth.find(x=>x.key===sampleGrowthKey)?.mult||1;
  const eS=envMultiplier(sampleEnvKeys);
  const constant=(samplePrice/Math.max(1e-9,(gS*eS)))/(sampleWeight*sampleWeight);
  const gT=MUTATIONS.growth.find(x=>x.key===targetGrowthKey)?.mult||1;
  const eT=envMultiplier(targetEnvKeys);
  const cropValue=constant*targetWeight*targetWeight;
  const total=cropValue*gT*eT;
  return {constant,cropValue,growth:gT,env:eT,total,finalWeight:targetWeight};
}

// handle submit
document.getElementById("calc-form").addEventListener("submit",e=>{
  e.preventDefault();
  const growthKey=growthSel.value;
  const envKeys=selectedEnvKeys();
  const size=parseFloat(sizeInput.value||"1");
  const mode=modeSel.value;

  let res;
  if(mode==="base"){
    const baseValue=parseFloat(document.getElementById("base-value").value);
    const baseWeight=parseFloat(document.getElementById("base-weight").value);
    if(!baseValue || !baseWeight){ outTotal.textContent="Enter base value & base weight"; return; }
    res=fromBase({baseValue,baseWeight,finalWeight:baseWeight*size,growthKey,envKeys});
  }else{
    const samplePrice=parseFloat(document.getElementById("sample-price").value);
    const sampleWeight=parseFloat(document.getElementById("sample-weight").value);
    if(!samplePrice || !sampleWeight){ outTotal.textContent="Enter sample price & weight"; return; }
    res=fromSample({
      samplePrice,sampleWeight,
      sampleEnvKeys:envKeys,sampleGrowthKey:growthKey,
      targetWeight:sampleWeight*size,
      targetEnvKeys:envKeys,targetGrowthKey:growthKey
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
  sizeInput.value="1"; sizeOut.textContent="1.00×";
  outTotal.textContent="—"; outCrop.textContent="—"; outGrowth.textContent="—";
  outEnv.textContent="—"; outWeight.textContent="—"; outConst.textContent="—";
});
