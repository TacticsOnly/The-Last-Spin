const COLORS = ["#ff6b6b", "#70e2ff", "#ffd85a", "#9cff7a", "#d978ff", "#ff9e57", "#f7f0d8", "#75ffd8"];
const REDS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const nums = Array.from({length: 37}, (_, i) => i);

const marbleCatalog = [
  {id:"classic", name:"Klassische Murmel", rarity:"Start", color:"#f7f0d8", desc:"Solide Kugel. +8 Punkte pro Treffer.", apply:(ctx)=>ctx.add+=8},
  {id:"ruby", name:"Rubin-Murmel", rarity:"Common", color:"#ff4c5b", desc:"Rote Zahlen geben +18 Punkte.", apply:(ctx)=>{if(REDS.has(ctx.n)) ctx.add+=18}},
  {id:"onyx", name:"Onyx-Murmel", rarity:"Common", color:"#33313e", desc:"Schwarze Zahlen geben +18 Punkte.", apply:(ctx)=>{if(ctx.n!==0&&!REDS.has(ctx.n)) ctx.add+=18}},
  {id:"zero", name:"Zero-Flüsterer", rarity:"Rare", color:"#33d17a", desc:"Bei 0: x6 und +120 Punkte.", apply:(ctx)=>{if(ctx.n===0){ctx.mult*=6;ctx.add+=120}}},
  {id:"even", name:"Gerade Murmel", rarity:"Common", color:"#8be9fd", desc:"Gerade Treffer: +14 Punkte.", apply:(ctx)=>{if(ctx.n>0&&ctx.n%2===0) ctx.add+=14}},
  {id:"odd", name:"Ungerade Murmel", rarity:"Common", color:"#ff79c6", desc:"Ungerade Treffer: +14 Punkte.", apply:(ctx)=>{if(ctx.n%2===1) ctx.add+=14}},
  {id:"low", name:"Tiefspieler", rarity:"Common", color:"#a3ff8f", desc:"1-18: +16 Punkte.", apply:(ctx)=>{if(ctx.n>=1&&ctx.n<=18) ctx.add+=16}},
  {id:"high", name:"Hochroller", rarity:"Common", color:"#ffc66d", desc:"19-36: +16 Punkte.", apply:(ctx)=>{if(ctx.n>=19) ctx.add+=16}},
  {id:"dozen1", name:"Erstes Dutzend", rarity:"Common", color:"#e6db74", desc:"1-12: x1.35.", apply:(ctx)=>{if(ctx.n>=1&&ctx.n<=12) ctx.mult*=1.35}},
  {id:"dozen2", name:"Zweites Dutzend", rarity:"Common", color:"#66d9ef", desc:"13-24: x1.35.", apply:(ctx)=>{if(ctx.n>=13&&ctx.n<=24) ctx.mult*=1.35}},
  {id:"dozen3", name:"Drittes Dutzend", rarity:"Common", color:"#ae81ff", desc:"25-36: x1.35.", apply:(ctx)=>{if(ctx.n>=25&&ctx.n<=36) ctx.mult*=1.35}},
  {id:"prime", name:"Primzahl-Perle", rarity:"Rare", color:"#50fa7b", desc:"Primzahlen geben x2.1.", apply:(ctx)=>{if([2,3,5,7,11,13,17,19,23,29,31].includes(ctx.n)) ctx.mult*=2.1}},
  {id:"square", name:"Quadrat-Kern", rarity:"Rare", color:"#ffb86c", desc:"1,4,9,16,25,36 geben +60.", apply:(ctx)=>{if([1,4,9,16,25,36].includes(ctx.n)) ctx.add+=60}},
  {id:"lucky7", name:"Sieben-Splitter", rarity:"Rare", color:"#fff176", desc:"Zahlen mit 7 oder Vielfache von 7 geben x2.4.", apply:(ctx)=>{if(ctx.n>0&&(String(ctx.n).includes("7")||ctx.n%7===0)) ctx.mult*=2.4}},
  {id:"mirror", name:"Spiegelmurmel", rarity:"Rare", color:"#c0c0ff", desc:"11,22,33 geben +90 und x1.8.", apply:(ctx)=>{if([11,22,33].includes(ctx.n)){ctx.add+=90;ctx.mult*=1.8}}},
  {id:"streak", name:"Serien-Murmel", rarity:"Rare", color:"#ff5555", desc:"Jeder Treffer dieser Murmel im Level erhöht ihren Bonus um +12.", apply:(ctx,m)=>{ctx.add+=m.charge*12; m.charge++}},
  {id:"banker", name:"Bankiers-Murmel", rarity:"Rare", color:"#7dffb2", desc:"+1 Punkt je 20 Bank-Punkte, max. +80.", apply:(ctx)=>ctx.add+=Math.min(80, Math.floor(state.bank/20))},
  {id:"snowball", name:"Schneeball", rarity:"Epic", color:"#d8ffff", desc:"Permanent +4 Basiswert nach jedem Treffer.", apply:(ctx,m)=>{ctx.add+=m.power; m.power+=4}},
  {id:"chaos", name:"Chaos-Murmel", rarity:"Epic", color:"#ff6df0", desc:"Zufällig x0.8 bis x3.2.", apply:(ctx)=>ctx.mult*=randFloat(.8,3.2)},
  {id:"neighbor", name:"Nachbar-Magnet", rarity:"Epic", color:"#8affc1", desc:"Zählt zusätzlich beide Nachbarzahlen mit je 12 Punkten.", apply:(ctx)=>ctx.add+=24},
  {id:"gold", name:"Goldader", rarity:"Epic", color:"#ffdf5d", desc:"+25 Punkte und +10 Bank-Punkte bei Treffer.", apply:(ctx)=>{ctx.add+=25; ctx.bankGain+=10}},
  {id:"glass", name:"Glas-Kanonenkugel", rarity:"Epic", color:"#bdf9ff", desc:"x4, aber 20% Chance nach Treffer zu zerbrechen.", apply:(ctx,m)=>{ctx.mult*=4; if(Math.random()<.2)m.broken=true}},
  {id:"echo", name:"Echo-Murmel", rarity:"Epic", color:"#b388ff", desc:"Wiederholt 35% des letzten Spin-Scores.", apply:(ctx)=>ctx.add+=Math.floor(state.lastSpinScore*.35)},
  {id:"royal", name:"Königs-Murmel", rarity:"Legendary", color:"#ffd700", desc:"36-facher Roulette-Flair: Treffer x3 und +Zahl²/2.", apply:(ctx)=>{ctx.mult*=3; ctx.add+=Math.floor(ctx.n*ctx.n/2)}},
  {id:"void", name:"Void-Zero", rarity:"Legendary", color:"#1b0033", desc:"Bei Nicht-0 x1.25. Bei 0 sofort +1000.", apply:(ctx)=>{if(ctx.n===0)ctx.add+=1000; else ctx.mult*=1.25}}
];

const charms = [
  {id:"redFelt", name:"Roter Filz", price:120, desc:"Rote Treffer geben x1.25.", hook:(ctx)=>{if(REDS.has(ctx.n))ctx.mult*=1.25}},
  {id:"blackFelt", name:"Schwarzer Filz", price:120, desc:"Schwarze Treffer geben x1.25.", hook:(ctx)=>{if(ctx.n!==0&&!REDS.has(ctx.n))ctx.mult*=1.25}},
  {id:"doubleSpin", name:"Croupier-Handschuh", price:260, desc:"+1 Spin pro Runde.", passive:()=>state.maxSpins+=1},
  {id:"fatWallet", name:"Fettes Portemonnaie", price:180, desc:"+20% Bank-Gewinn am Rundenende.", end:(surplus)=>Math.floor(surplus*.2)},
  {id:"polished", name:"Poliertuch", price:170, desc:"Alle Murmeln erhalten +6 Basispunkte.", hook:(ctx)=>ctx.add+=6},
  {id:"luckyChip", name:"Glücks-Chip", price:220, desc:"Erster Spin jeder Runde x1.75.", hook:(ctx)=>{if(state.spinsLeft===state.maxSpins-1)ctx.mult*=1.75}},
  {id:"rouletteBook", name:"Roulette-Buch", price:240, desc:"Dutzend-Treffer geben zusätzlich x1.15.", hook:(ctx)=>{if(ctx.n>0)ctx.mult*=1.15}},
  {id:"compound", name:"Zinseszins-Talisman", price:300, desc:"Nach jeder geschafften Runde +5% globaler Multiplikator.", end:()=>{state.globalMult+=.05; return 0}},
  {id:"zeroPoster", name:"Zero-Poster", price:260, desc:"0 ist nicht mehr leer: jeder 0-Treffer erhält +250.", hook:(ctx)=>{if(ctx.n===0)ctx.add+=250}},
  {id:"marbleBag", name:"Murmelsack", price:210, desc:"Shop bietet einen extra Gegenstand an.", passive:()=>state.extraShop+=1}
];

let state;
const $ = id => document.getElementById(id);
function rand(a){return Math.floor(Math.random()*a)}
function randFloat(a,b){return a+Math.random()*(b-a)}
function pick(arr){return arr[rand(arr.length)]}
function cloneMarble(template){return {...template, uid: crypto.randomUUID(), power: 10, charge: 1, broken:false}}

function newRun(){
  state = {level:1, target:420, roundScore:0, bank:0, maxSpins:3, spinsLeft:3, marbles:[], ownedCharms:[], shopOpen:false, lastSpinScore:0, globalMult:1, extraShop:0};
  for(let i=0;i<5;i++) state.marbles.push(cloneMarble(marbleCatalog[0]));
  buildBoard(); log("Willkommen am Murmeltisch. Triff das Levelziel in maximal 3 Spins."); render();
}

function buildBoard(){
  const board = $("rouletteBoard"); board.innerHTML="";
  nums.forEach(n=>{
    const d=document.createElement("div"); d.className=`slot ${n===0?'zero':REDS.has(n)?'red':''}`; d.id=`slot-${n}`;
    d.innerHTML=`<div class="num">${n}</div><div class="marble-row"></div><div class="payout">${n===0?'Zero':'Basis '+baseValue(n)}</div>`;
    board.appendChild(d);
  });
}
function baseValue(n){ if(n===0) return 90; return 20 + Math.ceil(n/3); }
function placeMarbles(){
  document.querySelectorAll('.marble-row').forEach(r=>r.innerHTML='');
  document.querySelectorAll('.slot').forEach(s=>s.classList.remove('hit'));
  const used = new Set();
  state.marbles.filter(m=>!m.broken).forEach(m=>{
    let n; do { n=rand(37); } while(used.has(n)); used.add(n); m.position=n;
    const token=document.createElement('span'); token.className='marble-token'; token.style.background=m.color; token.title=m.name;
    document.querySelector(`#slot-${n} .marble-row`).appendChild(token);
  });
}
function spin(){
  if(state.shopOpen||state.spinsLeft<=0) return;
  placeMarbles();
  const result=rand(37); $(`slot-${result}`).classList.add('hit'); state.spinsLeft--;
  let spinScore=0; let bankGain=0; let lines=[`Spin auf ${result}!`];
  const hit = state.marbles.filter(m=>!m.broken && m.position===result);
  if(hit.length===0){ lines.push('Keine Murmel getroffen.'); }
  hit.forEach(m=>{
    let ctx={n:result, add:baseValue(result), mult:1, bankGain:0};
    m.apply(ctx,m);
    state.ownedCharms.forEach(c=>c.hook?.(ctx));
    const gained=Math.max(0, Math.floor(ctx.add*ctx.mult*state.globalMult));
    spinScore+=gained; bankGain+=ctx.bankGain;
    lines.push(`${m.name}: +${gained} (${Math.floor(ctx.add)} x ${ctx.mult.toFixed(2)})`);
  });
  const broken=state.marbles.filter(m=>m.broken);
  if(broken.length){ lines.push(`${broken.map(m=>m.name).join(', ')} zerbricht!`); state.marbles=state.marbles.filter(m=>!m.broken); }
  state.roundScore += spinScore; state.bank += bankGain; state.lastSpinScore = spinScore;
  log(lines.join('<br>'));
  render();
  if(state.spinsLeft===0) endRound();
}
function endRound(){
  if(state.shopOpen) return;
  if(state.roundScore>=state.target){
    const surplus=state.roundScore-state.target;
    let bonus=0; state.ownedCharms.forEach(c=>bonus += c.end?.(surplus) || 0);
    state.bank += surplus + bonus;
    state.shopOpen=true; generateShop();
    log(`Level geschafft! Überschuss ${surplus} + Bonus ${bonus} geht in die Bank.`);
  } else {
    gameOver(false);
  }
  render();
}
function nextLevel(){
  state.level++;
  state.target = Math.floor(420 * Math.pow(1.52, state.level-1) + state.level*55);
  state.roundScore=0; state.spinsLeft=state.maxSpins; state.shopOpen=false;
  $("shop").classList.add('hidden'); log(`Level ${state.level}: Ziel ${state.target}.`); render();
}
function offerPool(){
  const pool=[];
  for(let i=0;i<4+state.extraShop;i++) pool.push({type:'marble', item:pick(marbleCatalog.slice(1)), price: priceForMarble()});
  for(let i=0;i<2;i++) pool.push({type:'charm', item:pick(charms.filter(c=>!state.ownedCharms.some(o=>o.id===c.id))), price:null});
  return pool.filter(x=>x.item).sort(()=>Math.random()-.5).slice(0,6+state.extraShop);
}
function priceForMarble(){ return Math.floor(70 + state.level*28 + rand(80)); }
function generateShop(){
  const el=$("shopItems"); el.innerHTML=''; $("shop").classList.remove('hidden');
  offerPool().forEach(offer=>{
    const item=offer.item; const price=offer.type==='charm'?Math.floor(item.price+state.level*20):offer.price;
    const div=document.createElement('div'); div.className='shop-item';
    div.innerHTML=`<h3>${offer.type==='charm'?'🍀':'●'} ${item.name}</h3><p>${item.desc}</p><div class="price">Preis: ${price}</div><button>Kaufen</button>`;
    div.querySelector('button').onclick=()=>buy(offer,item,price,div);
    el.appendChild(div);
  });
}
function buy(offer,item,price,div){
  if(state.bank<price){log('Nicht genug Bank-Punkte.'); return;}
  state.bank-=price;
  if(offer.type==='charm'){ const c={...item}; state.ownedCharms.push(c); c.passive?.(); }
  else state.marbles.push(cloneMarble(item));
  div.remove(); log(`${item.name} gekauft.`); render();
}
function gameOver(win){
  $("gameOver").classList.remove('hidden');
  $("gameOverTitle").textContent=win?'Run gewonnen!':'Run beendet';
  $("gameOverText").textContent=`Du hast Level ${state.level} erreicht. Score: ${state.roundScore}/${state.target}.`;
  $("spinBtn").disabled=true; $("endRoundBtn").disabled=true;
}
function render(){
  $("level").textContent=state.level; $("target").textContent=state.target; $("roundScore").textContent=state.roundScore; $("bank").textContent=state.bank; $("spins").textContent=state.spinsLeft;
  $("spinBtn").disabled=state.shopOpen||state.spinsLeft<=0; $("endRoundBtn").disabled=state.shopOpen;
  const ml=$("marbleList"); ml.innerHTML='';
  state.marbles.forEach(m=>{const d=document.createElement('div'); d.className='card'; d.innerHTML=`<span class="marble-token" style="background:${m.color}"></span><div><h3>${m.name}</h3><p>${m.desc}</p><small>${m.rarity}${m.power?` · Power ${m.power}`:''}${m.charge?` · Serie ${m.charge}`:''}</small></div>`; ml.appendChild(d)});
  const cl=$("charmList"); cl.innerHTML=state.ownedCharms.length?'':'<p>Noch keine Glücksbringer.</p>';
  state.ownedCharms.forEach(c=>{const d=document.createElement('div'); d.className='card'; d.innerHTML=`<div><h3>🍀 ${c.name}</h3><p>${c.desc}</p></div>`; cl.appendChild(d)});
}
function log(msg){ $("spinLog").innerHTML = `<div>${msg}</div>` + $("spinLog").innerHTML; }

$("spinBtn").onclick=spin; $("endRoundBtn").onclick=endRound; $("nextLevelBtn").onclick=nextLevel; $("newRunBtn").onclick=newRun; $("restartBtn").onclick=()=>{ $("gameOver").classList.add('hidden'); $("spinBtn").disabled=false; $("endRoundBtn").disabled=false; newRun(); };
newRun();
