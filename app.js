
const cards=[...document.querySelectorAll('.product-card')];
const grid=document.getElementById('grid'),search=document.getElementById('search'),category=document.getElementById('category'),brand=document.getElementById('brand'),sort=document.getElementById('sort'),empty=document.getElementById('empty');

function applyFilters(){
  const q=search.value.trim().toLowerCase(), c=category.value, b=brand.value;
  const visible=cards.filter(card=>{
    const p=PRODUCTS[+card.dataset.id];
    const hay=(p.name+' '+p.brand+' '+p.category+' '+p.type+' '+p.color+' '+p.gender).toLowerCase();
    const ok=(!q||hay.includes(q))&&(c==='All'||p.category===c)&&(b==='All'||p.brand===b);
    card.style.display=ok?'':'none'; return ok;
  });
  visible.sort((a,b)=>{
    const A=PRODUCTS[+a.dataset.id],B=PRODUCTS[+b.dataset.id];
    if(sort.value==='low')return A.price-B.price;
    if(sort.value==='high')return B.price-A.price;
    if(sort.value==='name')return A.name.localeCompare(B.name);
    return A.id-B.id;
  }).forEach(x=>grid.appendChild(x));
  empty.hidden=visible.length>0;
}
[category,brand,sort].forEach(x=>x.addEventListener('change',applyFilters));search.addEventListener('input',applyFilters);

document.querySelectorAll('[data-cat]').forEach(btn=>btn.addEventListener('click',()=>{
 category.value=btn.dataset.cat;applyFilters();document.getElementById('shop').scrollIntoView({behavior:'smooth'});
}));
document.querySelectorAll('[data-term]').forEach(btn=>btn.addEventListener('click',()=>{
 const term=btn.dataset.term;
 if(term==='Belts'){category.value='Belts';search.value='';}
 else {category.value='All';search.value=term;}
 applyFilters();document.getElementById('shop').scrollIntoView({behavior:'smooth'});
}));
document.querySelectorAll('.sizes button').forEach(btn=>btn.addEventListener('click',()=>{
 btn.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
}));
document.querySelectorAll('.heart').forEach(btn=>btn.addEventListener('click',()=>{
 btn.classList.toggle('saved');btn.textContent=btn.classList.contains('saved')?'♥':'♡';toast(btn.classList.contains('saved')?'Saved to favorites':'Removed from favorites');
}));

let cart=JSON.parse(localStorage.getItem('dalla_real_cart')||'[]');
const save=()=>localStorage.setItem('dalla_real_cart',JSON.stringify(cart));
function add(id){const x=cart.find(i=>i.id===id);if(x)x.qty++;else cart.push({id,qty:1});save();renderCart();toast(PRODUCTS[id].name+' added to cart')}
document.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',()=>add(+btn.dataset.add)));

function renderCart(){
 const wrap=document.getElementById('cartItems');
 const count=cart.reduce((s,x)=>s+x.qty,0),total=cart.reduce((s,x)=>s+PRODUCTS[x.id].price*x.qty,0);
 document.getElementById('cartCount').textContent=count;document.getElementById('subtotal').textContent='$'+total.toFixed(2);
 if(!cart.length){wrap.innerHTML='<p style="color:#777;padding:24px 0">Your cart is empty.</p>';return}
 wrap.innerHTML=cart.map(x=>{const p=PRODUCTS[x.id];return `<div class="cart-item"><img src="${p.image}" referrerpolicy="no-referrer" onerror="this.src='assets/image-fallback.svg'" alt="${p.name}"><div><b>${p.name}</b><small>Qty ${x.qty} · $${p.price.toFixed(2)}</small></div><button data-remove="${x.id}">×</button></div>`}).join('');
 wrap.querySelectorAll('[data-remove]').forEach(btn=>btn.addEventListener('click',()=>{cart=cart.filter(x=>x.id!==+btn.dataset.remove);save();renderCart()}));
}
const drawer=document.getElementById('drawer'),overlay=document.getElementById('overlay');
document.getElementById('cartOpen').onclick=()=>{drawer.classList.add('open');overlay.classList.add('show')};
const close=()=>{drawer.classList.remove('open');overlay.classList.remove('show')};
document.getElementById('cartClose').onclick=close;overlay.onclick=close;
document.getElementById('checkout').onclick=()=>toast(cart.length?'Demo checkout — connect your payment provider.':'Your cart is empty.');
let timer;function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>t.classList.remove('show'),2200)}
renderCart();applyFilters();
