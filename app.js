
const cards = [...document.querySelectorAll('.product-card')];
const grid = document.getElementById('productGrid');
const search = document.getElementById('searchInput');
const category = document.getElementById('categoryFilter');
const brand = document.getElementById('brandFilter');
const sort = document.getElementById('sortFilter');
const empty = document.getElementById('emptyState');

function filterProducts(){
  const q=search.value.trim().toLowerCase();
  const c=category.value, b=brand.value;
  const visible=cards.filter(card=>{
    const p=PRODUCTS[+card.dataset.id];
    const hay=(p.name+' '+p.brand+' '+p.category+' '+p.sub+' '+p.color+' '+p.audience).toLowerCase();
    const ok=(!q||hay.includes(q))&&(c==='All'||p.category===c)&&(b==='All'||p.brand===b);
    card.style.display=ok?'':'none';
    return ok;
  });
  const mode=sort.value;
  visible.sort((a,b)=>{
    const pa=PRODUCTS[+a.dataset.id], pb=PRODUCTS[+b.dataset.id];
    if(mode==='low') return pa.price-pb.price;
    if(mode==='high') return pb.price-pa.price;
    if(mode==='name') return pa.name.localeCompare(pb.name);
    return +a.dataset.id-+b.dataset.id;
  }).forEach(card=>grid.appendChild(card));
  empty.hidden=visible.length>0;
}
[category,brand,sort].forEach(x=>x.addEventListener('change',filterProducts));
search.addEventListener('input',filterProducts);

document.querySelectorAll('[data-cat]').forEach(btn=>btn.addEventListener('click',()=>{
  category.value=btn.dataset.cat; filterProducts(); document.getElementById('shop').scrollIntoView({behavior:'smooth'});
}));
document.querySelectorAll('[data-search-term]').forEach(btn=>btn.addEventListener('click',()=>{
  search.value=btn.dataset.searchTerm; filterProducts(); document.getElementById('shop').scrollIntoView({behavior:'smooth'});
}));
document.querySelectorAll('.quick-sizes button').forEach(btn=>btn.addEventListener('click',()=>{
  btn.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
}));
document.querySelectorAll('.heart').forEach(btn=>btn.addEventListener('click',()=>{
  btn.classList.toggle('saved');btn.textContent=btn.classList.contains('saved')?'♥':'♡';toast(btn.classList.contains('saved')?'Saved to favorites':'Removed from favorites');
}));

let cart=JSON.parse(localStorage.getItem('dalla_santaeu_pro_cart')||'[]');
function save(){localStorage.setItem('dalla_santaeu_pro_cart',JSON.stringify(cart))}
function add(id){const x=cart.find(i=>i.id===id);if(x)x.qty++;else cart.push({id,qty:1});save();renderCart();toast(PRODUCTS[id].name+' added to cart')}
document.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',()=>add(+btn.dataset.add)));

function renderCart(){
  const wrap=document.getElementById('cartItems');
  const count=cart.reduce((s,x)=>s+x.qty,0), total=cart.reduce((s,x)=>s+PRODUCTS[x.id].price*x.qty,0);
  document.getElementById('cartCount').textContent=count;document.getElementById('subtotal').textContent='$'+total.toFixed(2);
  if(!cart.length){wrap.innerHTML='<p style="color:#777;padding:25px 0">Your cart is empty.</p>';return}
  wrap.innerHTML=cart.map(x=>{const p=PRODUCTS[x.id];return `<div class="cart-item"><img src="${p.image}" alt="${p.name}"><div><b>${p.name}</b><small>Qty ${x.qty} · $${p.price.toFixed(2)}</small></div><button data-remove="${x.id}">×</button></div>`}).join('');
  wrap.querySelectorAll('[data-remove]').forEach(btn=>btn.addEventListener('click',()=>{cart=cart.filter(x=>x.id!==+btn.dataset.remove);save();renderCart()}));
}
const drawer=document.getElementById('cartDrawer'), overlay=document.getElementById('overlay');
function openCart(){drawer.classList.add('open');overlay.classList.add('show');drawer.setAttribute('aria-hidden','false')}
function closeCart(){drawer.classList.remove('open');overlay.classList.remove('show');drawer.setAttribute('aria-hidden','true')}
document.getElementById('cartOpen').addEventListener('click',openCart);document.getElementById('cartClose').addEventListener('click',closeCart);overlay.addEventListener('click',closeCart);
document.getElementById('checkout').addEventListener('click',()=>toast(cart.length?'Demo checkout — connect Stripe, Shopify or PayPal.':'Your cart is empty'));

let timer;
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>t.classList.remove('show'),2200)}
renderCart();filterProducts();
