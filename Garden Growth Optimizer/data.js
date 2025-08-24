// In-game data only

export const SPRINKLERS = [
  {name:"Basic Sprinkler", icon:"💧", category:"core", durationMin:5, sizeAdd:0.25, info:"~1.25× size"},
  {name:"Advanced Sprinkler", icon:"🔧", category:"core", durationMin:5, sizeAdd:null, info:"bonus unconfirmed"},
  {name:"Godly Sprinkler", icon:"⚡", category:"core", durationMin:5, sizeAdd:1, info:"2× size"},
  {name:"Master Sprinkler", icon:"🏆", category:"core", durationMin:10, sizeAdd:2, info:"3× size"},
  {name:"Grandmaster Sprinkler", icon:"👑", category:"core", durationMin:10, sizeAdd:3, info:"4× size"},
  {name:"Chocolate Sprinkler", icon:"🍫", category:"event", durationMin:1, sizeAdd:null, info:"Choc x2"},
  {name:"Honey Sprinkler", icon:"🍯", category:"event", durationMin:1, sizeAdd:null, info:"Honeyglazed x5"},
  {name:"Sweet Soaker Sprinkler", icon:"🍬", category:"merchant", durationMin:5, sizeAdd:null, info:"Sweet crops"},
  {name:"Flower Froster Sprinkler", icon:"❄️", category:"merchant", durationMin:5, sizeAdd:null, info:"Frozen on flowers"},
  {name:"Tropical Mist Sprinkler", icon:"🌴", category:"merchant", durationMin:5, sizeAdd:null, info:"Tropical crops"},
  {name:"Berry Blusher Sprinkler", icon:"🫐", category:"merchant", durationMin:5, sizeAdd:null, info:"Berry crops"},
  {name:"Spice Spritzer Sprinkler", icon:"🌶️", category:"merchant", durationMin:5, sizeAdd:null, info:"Spicy crops"},
  {name:"Stalk Sprout Sprinkler", icon:"🌽", category:"merchant", durationMin:5, sizeAdd:null, info:"Stalk crops"}
];

export const WEATHERS = [
  {name:"Rain", icon:"🌧️", tier:"permanent", effects:["Wet x2"]},
  {name:"Thunderstorm", icon:"⛈️", tier:"permanent", effects:["Wet x2","Shocked x100 if struck"]},
  {name:"Frost", icon:"🥶", tier:"permanent", effects:["Chilled x2","Frozen x10 with Wet/Drenched"]},
  {name:"Night", icon:"🌙", tier:"permanent", effects:["Moonlit x2"]},
  {name:"Meteor Shower", icon:"☄️", tier:"permanent", effects:["Celestial x120"]},
  {name:"Heatwave", icon:"🔥", tier:"permanent", effects:["Sundried x85"]},
  {name:"Aurora", icon:"🌈", tier:"permanent", effects:["Aurora x90"]},
  {name:"Sandstorm", icon:"🌪️", tier:"permanent", effects:["Sandy x3"]},
  {name:"Tropical Rain", icon:"🌦️", tier:"permanent", effects:["Drenched x5"]},
  {name:"Solar Eclipse", icon:"🌑", tier:"limited", effects:["Eclipsed x15"]},
  {name:"Bee Swarm", icon:"🐝", tier:"limited", effects:["Pollinated x3"]},
  {name:"Black Hole", icon:"🌀", tier:"admin", effects:["Voidtouched x135"]},
  {name:"Space Travel", icon:"🚀", tier:"admin", effects:["Galactic x120","Starised x230 (rare)"]},
  {name:"Solar Flare", icon:"☀️", tier:"admin", effects:["Verdant x5 + Sundried x85 or Paradisal x100"]},
  {name:"Lightning Storm", icon:"⚡", tier:"admin", effects:["Shocked x100"]},
  {name:"Stoplight", icon:"🚦", tier:"admin", effects:["Lightcycle x50"]}
];

// Growth + Environmental mutation multipliers
export const MUTATIONS = {
  growth: [
    {key:"none", name:"None", mult:1},
    {key:"silver", name:"Silver", mult:5},
    {key:"gold", name:"Gold", mult:20},
    {key:"rainbow", name:"Rainbow", mult:50}
  ],
  environmental: [
    {key:"wet", name:"Wet", mult:2},
    {key:"windstruck", name:"Windstruck", mult:2},
    {key:"moonlit", name:"Moonlit", mult:2},
    {key:"chilled", name:"Chilled", mult:2},
    {key:"choc", name:"Choc", mult:2},
    {key:"pollinated", name:"Pollinated", mult:3},
    {key:"sandy", name:"Sandy", mult:3},
    {key:"clay", name:"Clay (Wet + Sandy)", mult:5, combo:["wet","sandy"], replaces:["wet","sandy"]},
    {key:"verdant", name:"Verdant", mult:5},
    {key:"bloodlit", name:"Bloodlit", mult:5},
    {key:"twisted", name:"Twisted", mult:5},
    {key:"drenched", name:"Drenched", mult:5, replaces:["wet"]},
    {key:"honeyglazed", name:"Honeyglazed", mult:5},
    {key:"cloudtouched", name:"Cloudtouched", mult:5},
    {key:"frozen", name:"Frozen (Wet/Drenched + Chilled)", mult:10, comboAny:[["wet","drenched"],["chilled"]], replaces:["wet","drenched","chilled"]},
    {key:"acidic", name:"Acidic", mult:12, forbidsAny:["wet","drenched"]},
    {key:"eclipsed", name:"Eclipsed", mult:15},
    {key:"tempestuous", name:"Tempestuous (Windstruck + Twisted)", mult:19, combo:["windstruck","twisted"], replaces:["windstruck","twisted"]},
    {key:"ceramic", name:"Ceramic (Clay + Burn/Fry/Cook/Molten/Sundried/Meteoric/Plasma)", mult:30,
      comboAny:[["clay"],["burnt","fried","cooked","molten","sundried","meteoric","plasma"]],
      replaces:["clay","burnt","fried","cooked","molten","sundried","meteoric","plasma"]},
    {key:"friendbound", name:"Friendbound", mult:70},
    {key:"sundried", name:"Sundried", mult:85},
    {key:"aurora", name:"Aurora", mult:90},
    {key:"shocked", name:"Shocked", mult:100},
    {key:"paradisal", name:"Paradisal (Verdant + Sundried)", mult:100, combo:["verdant","sundried"], replaces:["verdant","sundried"]},
    {key:"celestial", name:"Celestial", mult:120},
    {key:"galactic", name:"Galactic", mult:120},
    {key:"voidtouched", name:"Voidtouched", mult:135},
    {key:"dawnbound", name:"Dawnbound", mult:150},

    {key:"burnt", name:"Burnt", mult:4},
    {key:"fried", name:"Fried", mult:8},
    {key:"cooked", name:"Cooked", mult:10},
    {key:"molten", name:"Molten", mult:25},
    {key:"meteoric", name:"Meteoric", mult:125},
    {key:"plasma", name:"Plasma", mult:5},
    {key:"lightcycle", name:"Lightcycle", mult:50},
    {key:"radioactive", name:"Radioactive", mult:80}
  ]
};

// Fallback plants; full list is fetched on Home
export const FALLBACK_PLANTS = [
  "Carrot","Strawberry","Blueberry","Tomato","Onion","Pepper","Cucumber","Corn","Lettuce",
  "Apple","Pear","Grape","Banana","Watermelon","Mango","Pineapple","Dragon Fruit","Coconut",
  "Kiwi","Papaya","Avocado","Cranberry","Moon Melon","Bone Blossom","Candy Blossom","Glowshroom",
  "Aloe Vera","Duskpuff","Pricklefruit","Romanesco","Foxglove","Cyclamen","Nectarshade"
];
