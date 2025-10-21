// Minimal JS for navigation, cart actions, and checkout validation
(function () {
  'use strict';

  // Utility: Smooth scroll to section
  window.scrollToSection = function (id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Demo products
  const products = [
    { id: 're-001', name: 'Air Filter (Classic 350)', price: 499, img: 'https://via.placeholder.com/600x400?text=Air+Filter' },
    { id: 're-002', name: 'Oil Filter (Himalayan)', price: 349, img: 'https://via.placeholder.com/600x400?text=Oil+Filter' },
    { id: 're-003', name: 'Spark Plug (Bullet 500)', price: 299, img: 'https://via.placeholder.com/600x400?text=Spark+Plug' },
    { id: 're-004', name: 'Brake Pad Set', price: 899, img: 'https://via.placeholder.com/600x400?text=Brake+Pads' },
    { id: 're-005', name: 'Clutch Cable', price: 279, img: 'https://via.placeholder.com/600x400?text=Clutch+Cable' },
    { id: 're-006', name: 'Chain & Sprocket Kit', price: 2499, img: 'https://via.placeholder.com/600x400?text=Chain+%26+Sprocket' }
  ];

  // State
  const state = {
    cart: [],
  };

  // DOM refs
  const productsGrid = document.getElementById('productsGrid');
  const cartBtn = document.getElementById('cartBtn');
  const cartCount = document.getElementById('cartCount');
  const cartModal = document.getElementById('cartModal');
  const closeCart = document.getElementById('closeCart');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutModal = document.getElementById('checkoutModal');
  const closeCheckout = document.getElementById('closeCheckout');
  const checkoutForm = document.getElementById('checkoutForm');

  // Render products
  function renderProducts() {
    if (!productsGrid) return;
    productsGrid.innerHTML = products.map(p => `
      <div class="product-card">
        <img src="${p.img}" width="360" height="240" alt="${p.name}" loading="lazy" />
        <h3>${p.name}</h3>
        <div class="price">₹${p.price}</div>
        <button class="add-btn" data-id="${p.id}">Add to Cart</button>
      </div>
    `).join('');
  }

  // Cart helpers
  function updateCartCount() { cartCount.textContent = state.cart.reduce((s, i) => s + i.qty, 0); }
  function updateCartTotal() { cartTotal.textContent = state.cart.reduce((s, i) => s + i.qty * i.price, 0); }
  function renderCart() {
    if (!cartItems) return;
    if (!state.cart.length) {
      cartItems.innerHTML = '<p>Your cart is empty.</p>';
      updateCartTotal();
      return;
    }
    cartItems.innerHTML = state.cart.map(i => `
      <div class="cart-row" data-id="${i.id}" style="display:flex;gap:8px;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee">
        <div style="flex:1 1 auto">
          <strong>${i.name}</strong><br/>
          <small>₹${i.price} × ${i.qty}</small>
        </div>
        <div style="display:flex;gap:6px;align-items:center">
          <button class="qty-dec" data-id="${i.id}">-</button>
          <span>${i.qty}</span>
          <button class="qty-inc" data-id="${i.id}">+</button>
          <button class="remove" data-id="${i.id}">Remove</button>
        </div>
      </div>
    `).join('');
    updateCartTotal();
  }

  function addToCart(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const item = state.cart.find(x => x.id === id);
    if (item) item.qty += 1; else state.cart.push({ ...p, qty: 1 });
    updateCartCount();
  }
  function decQty(id) { const it = state.cart.find(x => x.id === id); if (!it) return; it.qty -= 1; if (it.qty <= 0) state.cart = state.cart.filter(x => x.id !== id); updateCartCount(); }
  function incQty(id) { const it = state.cart.find(x => x.id === id); if (!it) return; it.qty += 1; updateCartCount(); }
  function removeItem(id) { state.cart = state.cart.filter(x => x.id !== id); updateCartCount(); }

  // Event listeners
  if (productsGrid) {
    productsGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.add-btn');
      if (!btn) return;
      addToCart(btn.dataset.id);
    });
  }

  cartBtn && cartBtn.addEventListener('click', () => {
    renderCart();
    cartModal.classList.add('open');
  });
  closeCart && closeCart.addEventListener('click', () => cartModal.classList.remove('open'));

  cartItems && cartItems.addEventListener('click', (e) => {
    const t = e.target;
    if (t.classList.contains('qty-dec')) decQty(t.dataset.id);
    if (t.classList.contains('qty-inc')) incQty(t.dataset.id);
    if (t.classList.contains('remove')) removeItem(t.dataset.id);
    renderCart();
  });

  checkoutBtn && checkoutBtn.addEventListener('click', () => {
    if (!state.cart.length) { alert('Add items before checkout.'); return; }
    checkoutModal.classList.add('open');
  });
  closeCheckout && closeCheckout.addEventListener('click', () => checkoutModal.classList.remove('open'));

  // Checkout validation
  checkoutForm && checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();

    if (!name || !email || !phone || !address) { alert('Please fill all fields.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Enter a valid email.'); return; }
    if (!/^\+?[0-9\-\s]{7,15}$/.test(phone)) { alert('Enter a valid phone number.'); return; }

    alert('Order placed successfully! (Demo)');
    state.cart = [];
    updateCartCount();
    renderCart();
    checkoutModal.classList.remove('open');
  });

  // Init
  renderProducts();
  updateCartCount();
})();
