/* ============ STORE CONFIG (edit these) ============ */
const CONFIG = {
  brand: 'VELOCITY',
  currency: '$',
  freeShippingOver: 150,
  flatShipping: 9.99,
  // Plug your payment link/handler in here (Paystack, Flutterwave, Stripe...)
  onCheckout: (cart, total) => {
    alert('Demo checkout: ' + cart.length + ' item(s), total ' + CONFIG.currency + total.toFixed(2) +
      '\n\nConnect Paystack / Flutterwave / Stripe in CONFIG.onCheckout to take real payments.');
  }
};

/* ============ PRODUCTS (edit / add yours) ============ */
const COLORS = {
  Black:'#111', Maroon:'#7f1d1d', Grey:'#9ca3af', Navy:'#1e3a8a', Sky:'#93c5fd',
  White:'#e5e7eb', Red:'#f87171', Yellow:'#facc15', Orange:'#f97316', Green:'#22c55e', Blue:'#3b82f6'
};
const CLOTHES = ['XS','S','M','L','XL','XXL'];
const SHOES = ['7','8','9','10','11','12'];
const PRODUCTS = [
  { id:1, name:"Men's Meridian Long Sleeve Shirt", cat:['Men'], price:70, img:'img2/p1.webp', colors:['Black','Maroon','Grey'], sizes:CLOTHES, desc:'Soft-touch fabric that still wicks sweat like a champ.' },
  { id:2, name:"Women's Storm Forefront Rain Jacket", cat:['Women','Sale'], price:70, sale:55.07, img:'img2/p2.jpeg', colors:['Maroon','Sky'], sizes:CLOTHES, desc:'Our most breathable, 100% waterproof jacket.' },
  { id:3, name:"Women's HeatGear OG Compression Long Sleeve", cat:['Women'], price:40, img:'img2/p3.webp', colors:['Maroon','White','Navy','Black'], sizes:CLOTHES, desc:'Thick, compressive and ultra-cool for training days.' },
  { id:4, name:"Men's Legacy Windbreaker", cat:['Men'], price:90, img:'img2/p4.webp', colors:['Black','Red','Yellow','Orange','Green','Blue'], sizes:CLOTHES, desc:'Every athlete needs a go-to windbreaker, and this is it.' },
  { id:5, name:"Court 11 'Dub' Basketball Shoes", cat:['Shoes','Men'], price:160, img:'img2/p6.webp', colors:['Blue'], sizes:SHOES, desc:'Ultimate bounce, grip and stability on court.' },
  { id:6, name:"Court 11 'Future' Basketball Shoes", cat:['Shoes','Men'], price:160, img:'img2/p7.jpeg', colors:['Black'], sizes:SHOES, desc:'Designed to help every player find their game.' },
  { id:7, name:"Flow 10 Team Basketball Shoes", cat:['Shoes','Men'], price:160, sale:129, img:'img2/p8.jpeg', colors:['Sky'], sizes:SHOES, desc:'Light and ridiculously grippy.' },
  { id:8, name:"Court 11 'Wind' Basketball Shoes", cat:['Shoes','Women'], price:160, img:'img2/p9.webp', colors:['Red'], sizes:SHOES, desc:'Springy cushioning for explosive moves.' },
  { id:9, name:"Men's Reign 6 Training Shoes", cat:['Shoes','Men'], price:130, img:'img2/p6.webp', colors:['Grey','Black','White','Red'], sizes:SHOES, desc:'Supports your best performance in every move.' },
  { id:10, name:"Women's Unstoppable Fleece Hoodie", cat:['Women'], price:100, sale:79, img:'img2/hoodie.webp', colors:['Maroon','Black','Grey'], sizes:CLOTHES, desc:'Premium fleece that is smooth and breathable.' },
  { id:11, name:"Men's Unstoppable Fleece Full-Zip", cat:['Men'], price:100, img:'img2/zip.webp', colors:['Maroon','Navy','Black','Grey'], sizes:CLOTHES, desc:'Built for performance with flexible stretch fabric.' },
  { id:12, name:"Men's Legacy Windbreaker (Classic)", cat:['Men','Sale'], price:90, sale:63, img:'img2/p4.webp', colors:['Black','Red','Green','Blue'], sizes:CLOTHES, desc:'Lightweight, packable and weather ready.' }
];
const POSTS = ['a1.webp','a2.webp','a3.webp','a4.webp'].map((f,i)=>({
  img:'img2/'+f, title:['Rise Together: Champions on the Court','Behind the Design: Recovery Wear','Train Smarter: 5 Tips for Winter','Meet the Athletes of the Season'][i]
}));

/* ============ HELPERS ============ */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const money = n => CONFIG.currency + Number(n).toFixed(2);
const price = p => p.sale || p.price;
const store = {
  get(k, d){ try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='#e5e7eb'/><text x='50%' y='50%' fill='#9ca3af' font-family='sans-serif' font-size='20' text-anchor='middle'>Add photo</text></svg>");
const imgTag = (src, cls='') => `<img src="${src}" alt="" class="${cls}" loading="lazy" onerror="this.onerror=null;this.src='${PLACEHOLDER}'">`;

let cart = store.get('cart', []);      // {key,id,color,size,qty}
let wish = store.get('wish', []);      // [id]
let state = { filter:'All', q:'', sort:'featured' };

/* ============ RENDER SHOP ============ */
function renderChips(){
  const cats = ['All','Men','Women','Shoes','Sale'].concat(state.filter==='Wishlist' ? ['Wishlist'] : []);
  $('#chips').innerHTML = cats.map(c =>
    `<button data-c="${c}" class="chip px-4 py-2 text-xs font-bold border rounded-full ${state.filter===c?'bg-black text-white border-black':'hover:border-black'}">${c==='Sale'?'Outlet':c}</button>`).join('');
}
function filtered(){
  let list = PRODUCTS.filter(p => state.filter==='All' || (state.filter==='Wishlist' ? wish.includes(p.id) : p.cat.includes(state.filter)));
  if (state.q) list = list.filter(p => p.name.toLowerCase().includes(state.q));
  if (state.sort==='low') list.sort((a,b)=>price(a)-price(b));
  if (state.sort==='high') list.sort((a,b)=>price(b)-price(a));
  if (state.sort==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
  return list;
}
function renderGrid(){
  const list = filtered();
  $('#empty').classList.toggle('hidden', list.length>0);
  $('#grid').innerHTML = list.map(p => `
    <article class="card fade-in group">
      <div class="relative overflow-hidden bg-gray-100 aspect-square cursor-pointer" data-open="${p.id}">
        ${imgTag(p.img,'w-full h-full object-cover')}
        ${p.sale?'<span class="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">SALE</span>':''}
        <button data-wish="${p.id}" aria-label="Wishlist" class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
          <i class="fa-${wish.includes(p.id)?'solid text-red-500':'regular'} fa-heart"></i></button>
        <button data-open="${p.id}" class="absolute bottom-0 inset-x-0 bg-black text-white text-xs py-2 font-bold translate-y-full group-hover:translate-y-0 transition-transform">QUICK VIEW</button>
      </div>
      <h3 class="font-semibold text-sm md:text-base mt-3 leading-snug">${p.name}</h3>
      <p class="text-[11px] text-gray-500 mt-1">${p.desc}</p>
      <p class="mt-1 text-sm">${p.sale?`<span class="line-through text-gray-400 mr-2">${money(p.price)}</span><span class="text-red-600 font-bold">${money(p.sale)}</span>`:`<span class="font-bold">${money(p.price)}</span>`}</p>
      <div class="flex gap-1 mt-2">${p.colors.map(c=>`<span title="${c}" class="w-4 h-4 rounded-full border" style="background:${COLORS[c]}"></span>`).join('')}</div>
    </article>`).join('');
}
function renderPosts(){
  $('#posts').innerHTML = POSTS.map(p => `
    <a href="#" class="card block bg-white shadow-sm overflow-hidden">
      <div class="overflow-hidden aspect-[4/3] bg-gray-200">${imgTag(p.img,'w-full h-full object-cover')}</div>
      <div class="p-3 flex justify-between gap-3 text-sm font-semibold"><span>${p.title}</span><i class="fa fa-arrow-right mt-1"></i></div>
    </a>`).join('');
}

/* ============ QUICK VIEW ============ */
let current = null, selColor = null, selSize = null;
function openModal(id){
  current = PRODUCTS.find(p=>p.id===id); if(!current) return;
  selColor = current.colors[0]; selSize = null;
  $('#mImg').src = current.img; $('#mImg').onerror = function(){ this.onerror=null; this.src=PLACEHOLDER; };
  $('#mCat').textContent = current.cat.filter(c=>c!=='Sale').join(' / ');
  $('#mName').textContent = current.name;
  $('#mPrice').innerHTML = current.sale ? `<span class="line-through text-gray-400 mr-2">${money(current.price)}</span><span class="text-red-600 font-bold">${money(current.sale)}</span>` : `<b>${money(current.price)}</b>`;
  $('#mDesc').textContent = current.desc;
  $('#mErr').textContent = '';
  paintModalOptions();
  $('#modal').classList.replace('hidden','flex'); $('#overlay').classList.remove('hidden');
}
function paintModalOptions(){
  $('#mColorName').textContent = selColor;
  $('#mColors').innerHTML = current.colors.map(c=>`<button data-color="${c}" title="${c}" class="swatch w-8 h-8 rounded-full border ${c===selColor?'active':''}" style="background:${COLORS[c]}"></button>`).join('');
  $('#mSizes').innerHTML = current.sizes.map(s=>`<button data-size="${s}" class="size min-w-[44px] px-3 py-2 border text-sm hover:border-black ${s===selSize?'active':''}">${s}</button>`).join('');
}
function closeAll(){
  $('#modal').classList.replace('flex','hidden');
  $('#drawer').classList.add('translate-x-full');
  $('#overlay').classList.add('hidden');
}

/* ============ CART ============ */
function saveCart(){ store.set('cart', cart); renderCart(); }
function addToCart(p, color, size){
  const key = [p.id,color,size].join('|');
  const ex = cart.find(i=>i.key===key);
  ex ? ex.qty++ : cart.push({ key, id:p.id, color, size, qty:1 });
  saveCart(); toast('Added to bag');
}
function renderCart(){
  const count = cart.reduce((n,i)=>n+i.qty,0);
  $('#cartCount').textContent = count;
  $('#drawerTitle').textContent = `Your Bag (${count})`;
  const sub = cart.reduce((n,i)=>n+price(PRODUCTS.find(p=>p.id===i.id))*i.qty,0);
  const ship = sub===0 ? 0 : (sub>=CONFIG.freeShippingOver ? 0 : CONFIG.flatShipping);
  $('#subtotal').textContent = money(sub);
  $('#shipping').textContent = sub===0 ? '-' : (ship===0 ? 'FREE' : money(ship));
  $('#total').textContent = money(sub+ship);
  $('#checkoutBtn').disabled = !cart.length;
  $('#checkoutBtn').classList.toggle('opacity-40', !cart.length);
  const left = CONFIG.freeShippingOver - sub;
  $('#shipBar').innerHTML = sub===0 ? '' : (left>0
    ? `<p>Add <b>${money(left)}</b> more for free shipping</p><div class="h-1.5 bg-gray-200 rounded mt-1"><div class="h-full bg-black rounded" style="width:${Math.min(100,sub/CONFIG.freeShippingOver*100)}%"></div></div>`
    : `<p class="text-green-600 font-semibold"><i class="fa fa-check mr-1"></i>You've unlocked free shipping!</p>`);
  $('#drawerBody').innerHTML = cart.length ? cart.map(i=>{
    const p = PRODUCTS.find(x=>x.id===i.id);
    return `<div class="flex gap-4">
      <div class="w-20 h-20 bg-gray-100 shrink-0">${imgTag(p.img,'w-full h-full object-cover')}</div>
      <div class="flex-1 text-sm">
        <p class="font-semibold leading-snug">${p.name}</p>
        <p class="text-xs text-gray-500">${i.color} / ${i.size}</p>
        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center border">
            <button data-dec="${i.key}" class="w-7 h-7">-</button><span class="w-7 text-center">${i.qty}</span><button data-inc="${i.key}" class="w-7 h-7">+</button>
          </div>
          <span class="font-bold">${money(price(p)*i.qty)}</span>
        </div>
        <button data-rm="${i.key}" class="text-xs text-gray-400 underline mt-1">Remove</button>
      </div></div>`; }).join('')
    : `<div class="text-center text-gray-500 py-20"><i class="fa fa-bag-shopping text-4xl mb-3"></i><p>Your bag is empty</p></div>`;
}
function openCart(){ $('#drawer').classList.remove('translate-x-full'); $('#overlay').classList.remove('hidden'); }

/* ============ MISC UI ============ */
let toastTimer;
function toast(msg){
  const t = $('#toast'); t.textContent = msg; t.style.opacity = 1;
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>t.style.opacity=0, 2000);
}
function renderWish(){
  const c = $('#wishCount'); c.textContent = wish.length; c.classList.toggle('hidden', !wish.length);
}
function setFilter(f){ state.filter = f; renderChips(); renderGrid(); }

/* ============ EVENTS ============ */
document.addEventListener('click', e => {
  const t = e.target;
  const open = t.closest('[data-open]');
  const wishBtn = t.closest('[data-wish]');
  if (wishBtn){
    e.stopPropagation();
    const id = +wishBtn.dataset.wish;
    wish = wish.includes(id) ? wish.filter(x=>x!==id) : [...wish, id];
    store.set('wish', wish); renderWish(); renderGrid();
    toast(wish.includes(id) ? 'Saved to wishlist' : 'Removed from wishlist');
    return;
  }
  if (open) return openModal(+open.dataset.open);
  const chip = t.closest('.chip'); if (chip) return setFilter(chip.dataset.c);
  const nav = t.closest('.navfilter');
  if (nav){ setFilter(nav.dataset.filter); $('#mobileMenu').classList.add('hidden'); }
  const color = t.closest('[data-color]'); if (color){ selColor = color.dataset.color; paintModalOptions(); }
  const size = t.closest('[data-size]'); if (size){ selSize = size.dataset.size; $('#mErr').textContent=''; paintModalOptions(); }
  const inc = t.closest('[data-inc]'), dec = t.closest('[data-dec]'), rm = t.closest('[data-rm]');
  if (inc){ cart.find(i=>i.key===inc.dataset.inc).qty++; saveCart(); }
  if (dec){ const it = cart.find(i=>i.key===dec.dataset.dec); it.qty--; if(it.qty<1) cart = cart.filter(i=>i!==it); saveCart(); }
  if (rm){ cart = cart.filter(i=>i.key!==rm.dataset.rm); saveCart(); }
});
$('#mAdd').onclick = () => {
  if (!selSize){ $('#mErr').textContent = 'Please select a size.'; return; }
  addToCart(current, selColor, selSize); closeAll(); openCart();
};
$('#modalClose').onclick = closeAll;
$('#overlay').onclick = closeAll;
$('#drawerClose').onclick = closeAll;
$('#cartBtn').onclick = openCart;
document.addEventListener('keydown', e => { if (e.key==='Escape') closeAll(); });
$('#menuBtn').onclick = () => $('#mobileMenu').classList.toggle('hidden');
$('#searchToggle').onclick = () => { $('#searchBar').classList.toggle('hidden'); $('#searchInput').focus(); };
$('#searchInput').oninput = e => { state.q = e.target.value.trim().toLowerCase(); renderGrid(); if(state.q) location.hash='#shop'; };
$('#sort').onchange = e => { state.sort = e.target.value; renderGrid(); };
$('#wishBtn').onclick = () => {
  if (!wish.length) return toast('Your wishlist is empty');
  state.filter = 'Wishlist'; state.q = ''; renderChips(); renderGrid();
  toast(wish.length + ' saved item(s)'); location.hash = '#shop';
};
$('#checkoutBtn').onclick = () => {
  const sub = cart.reduce((n,i)=>n+price(PRODUCTS.find(p=>p.id===i.id))*i.qty,0);
  const total = sub + (sub>=CONFIG.freeShippingOver ? 0 : CONFIG.flatShipping);
  CONFIG.onCheckout(cart.map(i=>({...PRODUCTS.find(p=>p.id===i.id), ...i})), total);
};
$('#newsForm').onsubmit = e => {
  e.preventDefault();
  const v = $('#newsEmail').value.trim(), msg = $('#newsMsg');
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  msg.textContent = ok ? "You're in! Check your inbox." : 'Please enter a valid email address.';
  msg.className = 'text-xs mt-2 h-4 ' + (ok ? 'text-green-400' : 'text-red-400');
  if (ok) { e.target.reset(); /* TODO: send to your email provider */ }
};

/* ============ INIT ============ */
document.title = CONFIG.brand + ' | Performance Sportswear';
$('#brand').textContent = CONFIG.brand;
$('#year').textContent = new Date().getFullYear();
$('#freeShipLabel').textContent = money(CONFIG.freeShippingOver);
renderChips(); renderGrid(); renderPosts(); renderCart(); renderWish();