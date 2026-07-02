
// ---- TYPEBOT CHATBOT 

  import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js'

  Typebot.initPopup({
    typebot: "dev-wear-chatbot-de-atendimento-u7ajfp8",
    autoShowDelay: 2000,
  });



// ── PRODUCTS DATA
const products = [
  { id:1, name:'Camiseta Hello, World!', tag:'Python', desc:'A primeira linha de código de todo dev, agora no seu peito.', price:89.90, emoji:'👕', code:'print("hello, world")', category:'camiseta', badge:'new' },
  { id:2, name:'Camiseta { } Syntax', tag:'JavaScript', desc:'Curly braces nunca foram tão estilosas. Clean e minimalista.', price:89.90, emoji:'👕', code:'const dev = true;', category:'camiseta', badge:null },
  { id:3, name:'Camiseta Dark Mode', tag:'CSS', desc:'Fundo preto, letras brancas. Assim como seu editor favorito.', price:94.90, emoji:'👕', code:'color-scheme: dark;', category:'camiseta', badge:'hot' },
  { id:4, name:'Moletom git commit', tag:'Git', desc:'Comfortable como um git stash antes de sair pra reunião.', price:189.90, emoji:'🧥', code:'git commit -m "wip"', category:'moletom', badge:'new' },
  { id:5, name:'Moletom Stack Overflow', tag:'Meme', desc:'Em homenagem ao lugar que te salvou mais de uma vez.', price:189.90, emoji:'🧥', code:'// copy-paste mode', category:'moletom', badge:null },
  { id:6, name:'Boné Terminal', tag:'Linux', desc:'$ prompt bordado na frente. Chapéu de dev sério.', price:69.90, emoji:'🧢', code:'$ sudo style', category:'bone', badge:'limited' },
  { id:7, name:'Boné404 Not Found', tag:'HTTP', desc:'Para os dias em que você também não foi encontrado.', price:69.90, emoji:'🧢', code:'404: not found', category:'bone', badge:null },
  { id:8, name:'Caneca Ctrl+C / Ctrl+V', tag:'Dev Life', desc:'Sua dev tools preferidas, em cerâmica de 350ml.', price:49.90, emoji:'☕', code:'ctrl+c; ctrl+v;', category:'acessorio', badge:null },
  { id:9, name:'Meia NaN%', tag:'JavaScript', desc:'typeof conforto === "undefined". Qualidade não definida, experiência indefinível.', price:34.90, emoji:'🧦', code:'typeof sock', category:'acessorio', badge:'new' },
];

// ── RENDER PRODUCTS
function renderProducts(filter='all') {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';
  products.forEach(p => {
    if(filter !== 'all' && p.category !== filter) return;
    const badgeHTML = p.badge
      ? `<span class="product-badge badge-${p.badge}">${p.badge.toUpperCase()}</span>`
      : '';
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img" data-code="${p.code}">${p.emoji}${badgeHTML}</div>
      <div class="product-info">
        <div class="product-tag">#${p.tag}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div class="product-price">R$ ${p.price.toFixed(2).replace('.',',')}</div>
          <button class="add-cart-btn" onclick="addToCart(${p.id})">+ COMPRAR</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ── FILTER TABS
document.getElementById('filter-tabs').addEventListener('click', e => {
  const tab = e.target.closest('.filter-tab');
  if(!tab) return;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  renderProducts(tab.dataset.filter);
});

// ── CART STATE
let cart = [];

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if(existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  updateCartUI();
  showToast(`${product.emoji} ${product.name} adicionado!`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

function updateCartUI() {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  document.getElementById('cart-count').textContent = count;

  const body = document.getElementById('cart-body');
  const foot = document.getElementById('cart-foot');

  if(cart.length === 0) {
    body.innerHTML = `<div class="cart-empty"><span class="empty-icon">🛒</span>Carrinho vazio.<br>Adicione produtos pra continuar.</div>`;
    foot.style.display = 'none';
  } else {
    body.innerHTML = cart.map(i => `
      <div class="cart-item">
        <div class="cart-item-icon">${i.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${i.name}</div>
          <div class="cart-item-price">R$ ${(i.price * i.qty).toFixed(2).replace('.',',')}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateQty(${i.id},-1)">−</button>
            <span class="qty-val">${i.qty}</span>
            <button class="qty-btn" onclick="updateQty(${i.id},1)">+</button>
          </div>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${i.id})" title="Remover">🗑</button>
      </div>
    `).join('');
    foot.style.display = 'block';
    document.getElementById('cart-total-val').textContent = `R$ ${total.toFixed(2).replace('.',',')}`;
  }
}

function openCart() {
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-drawer').classList.add('open');
}
function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-drawer').classList.remove('open');
}
function checkout() {
  showToast('🚀 Redirecionando para pagamento...');
  closeCart();
}

// ── TOAST
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── NEWSLETTER
function subscribe() {
  const val = document.getElementById('email-input').value.trim();
  if(!val || !val.includes('@')) { showToast('⚠️ Digite um e-mail válido'); return; }
  showToast('✅ Inscrito com sucesso!');
  document.getElementById('email-input').value = '';
}

// ── TYPED HERO
const words = ['programa!', 'codifica.', 'deploya.', 'ama fazer.'];
let wi=0, ci=0, deleting=false;
function type() {
  const el = document.getElementById('typed');
  const word = words[wi];
  if(!deleting) {
    el.textContent = word.slice(0, ++ci);
    if(ci === word.length) { deleting=true; setTimeout(type, 1800); return; }
  } else {
    el.textContent = word.slice(0, --ci);
    if(ci === 0) { deleting=false; wi=(wi+1)%words.length; }
  }
  setTimeout(type, deleting ? 60 : 110);
}

// ── INIT
renderProducts();
updateCartUI();
setTimeout(type, 800);
