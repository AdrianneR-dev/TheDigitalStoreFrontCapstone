// =============================================
//   SALVG BEAUTY — SLIDE-OUT CART
// =============================================

// Cart state: array of { id, name, price, image, quantity }
// Load from localStorage so cart persists across pages
let cart = JSON.parse(localStorage.getItem("salvgCart")) || [];

// ── Read product info from the current detail page ──────────────────────────
function getPageProductInfo() {
    // Name: grab from the <section> h1
    const nameEl = document.querySelector("section h1");
    const name = nameEl ? nameEl.textContent.trim() : "Product";

    // Image: first <img> inside the <section>
    const imgEl = document.querySelector("section img");
    const image = imgEl ? imgEl.getAttribute("src") : "";

    // Price: look it up from the products array (defined in products.js)
    // Match by the current page filename e.g. "sulfurbarsoap.html"
    const pageFile = window.location.pathname.split("/").pop();
    let price = "$0.00 USD";
    if (typeof products !== "undefined") {
        const match = products.find(p => p.link === pageFile);
        if (match) price = match.price;
    }

    // Fallback: search any <span> on the page containing a $ sign
    if (price === "$0.00 USD") {
        document.querySelectorAll("span").forEach(span => {
            if (span.textContent.includes("$")) price = span.textContent.trim();
        });
    }

    return { name, price, image };
}

// Save cart to localStorage so it survives page navigation
function saveCart() {
    localStorage.setItem("salvgCart", JSON.stringify(cart));
}

// Parse "$13.00 USD" → 13.00
function parsePrice(priceStr) {
    const match = priceStr.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
}

// ── Cart HTML Injection ──────────────────────────────────────────────────────
function injectCartHTML() {
    const html = `
    <!-- Cart toggle button -->
    <button class="cart-toggle" id="cart-toggle" aria-label="Open cart">
        <span class="cart-icon">🛒</span>
        <span>Cart</span>
        <span class="cart-count" id="cart-count">0</span>
    </button>

    <!-- Overlay -->
    <div class="cart-overlay" id="cart-overlay"></div>

    <!-- Slide-out drawer -->
    <aside class="cart-drawer" id="cart-drawer" aria-label="Shopping cart">
        <div class="cart-header">
            <h2>Your Cart</h2>
            <div class="cart-header-meta">
                <span class="cart-item-total-label" id="cart-item-label">0 items</span>
                <button class="cart-close" id="cart-close" aria-label="Close cart">✕</button>
            </div>
        </div>

        <div class="cart-items" id="cart-items">
            <div class="cart-empty">
                <span class="empty-icon">🛍️</span>
                <p>Your cart is empty.<br>Add something beautiful!</p>
            </div>
        </div>

        <div class="cart-footer" id="cart-footer" style="display:none;">
            <div class="cart-totals">
                <div class="cart-subtotal-row">
                    <span>Subtotal</span>
                    <span id="cart-subtotal">$0.00</span>
                </div>
                <div class="cart-subtotal-row">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                </div>
                <div class="cart-total-row">
                    <span>Total</span>
                    <span id="cart-total">$0.00</span>
                </div>
            </div>
            <button class="cart-checkout-btn">Proceed to Checkout</button>
            <button class="cart-continue-btn" id="cart-continue">Continue Shopping</button>
        </div>
    </aside>

    <!-- Added to cart flash notification -->
    <div class="added-flash" id="added-flash">✓ Added to cart</div>
    `;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
}

// ── Render cart items ────────────────────────────────────────────────────────
function renderCart() {
    const itemsContainer = document.getElementById("cart-items");
    const cartFooter = document.getElementById("cart-footer");
    const cartCount = document.getElementById("cart-count");
    const cartItemLabel = document.getElementById("cart-item-label");
    const cartSubtotal = document.getElementById("cart-subtotal");
    const cartTotal = document.getElementById("cart-total");

    // Total item count (sum of quantities)
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);

    // Update header badges
    cartCount.textContent = totalQty;
    cartItemLabel.textContent = totalQty === 1 ? "1 item" : `${totalQty} items`;
    cartSubtotal.textContent = `$${totalPrice.toFixed(2)}`;
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

    // Show/hide footer
    cartFooter.style.display = cart.length > 0 ? "flex" : "none";

    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="cart-empty">
                <span class="empty-icon">🛍️</span>
                <p>Your cart is empty.<br>Add something beautiful!</p>
            </div>`;
        return;
    }

    itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img class="cart-item-thumb" src="${item.image}" alt="${item.name}" onerror="this.style.background='#eee';this.src='';">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price}</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="qty-btn plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
            <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove item">✕</button>
        </div>
    `).join("");

    // Attach quantity and remove listeners
    itemsContainer.querySelectorAll(".qty-btn.plus").forEach(btn => {
        btn.addEventListener("click", () => changeQty(btn.dataset.id, 1));
    });
    itemsContainer.querySelectorAll(".qty-btn.minus").forEach(btn => {
        btn.addEventListener("click", () => changeQty(btn.dataset.id, -1));
    });
    itemsContainer.querySelectorAll(".cart-item-remove").forEach(btn => {
        btn.addEventListener("click", () => removeItem(btn.dataset.id));
    });
}

// ── Cart actions ─────────────────────────────────────────────────────────────
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    renderCart();
    showFlash(product.name);
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeItem(id);
    } else {
        saveCart();
        renderCart();
    }
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

// ── Flash notification ───────────────────────────────────────────────────────
function showFlash(productName) {
    const flash = document.getElementById("added-flash");
    flash.textContent = `✓ ${productName} added to cart`;
    flash.classList.add("show");
    setTimeout(() => flash.classList.remove("show"), 2200);
}

// ── Open / Close drawer ──────────────────────────────────────────────────────
function openCart() {
    document.getElementById("cart-drawer").classList.add("active");
    document.getElementById("cart-overlay").classList.add("active");
}

function closeCart() {
    document.getElementById("cart-drawer").classList.remove("active");
    document.getElementById("cart-overlay").classList.remove("active");
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject cart HTML into the page
    injectCartHTML();

    // 2. Read this page's product info
    const product = getPageProductInfo();
    // Generate a simple unique ID from the page URL
    product.id = window.location.pathname.split("/").pop().replace(".html", "") || "product";

    // 3. Wire up the Add to Cart button(s)
    document.querySelectorAll(".lift-button").forEach(btn => {
        btn.addEventListener("click", () => addToCart(product));
    });

    // 4. Cart open/close events
    document.getElementById("cart-toggle").addEventListener("click", openCart);
    document.getElementById("cart-close").addEventListener("click", closeCart);
    document.getElementById("cart-overlay").addEventListener("click", closeCart);
    document.getElementById("cart-continue").addEventListener("click", closeCart);

    // 5. Initial render
    renderCart();
});