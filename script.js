
Action: file_editor create /app/static/script.js --file-text "/* ============================================
   FreshBite Cafe — static site logic
   No backend. Cart persists in localStorage.
   Forms show client-side success only (demo).
   ============================================ */

// ---------- MENU DATA ----------
const MENU_ITEMS = [
    { id: \"bf-01\", name: \"Awadhi Masala Omelette\", description: \"Three-egg omelette with caramelised onions, green chilli & coriander, served with sourdough toast.\", price: 220, category: \"Breakfast\", image: \"https://images.unsplash.com/photo-1761210719318-3c2164dfa980?crop=entropy&cs=srgb&fm=jpg&w=400\" },
    { id: \"bf-02\", name: \"Sourdough Avocado Toast\", description: \"Smashed avocado, heirloom tomatoes, chilli flakes, lemon & poached egg on house sourdough.\", price: 280, category: \"Breakfast\", image: \"https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400\" },
    { id: \"bf-03\", name: \"Stuffed Kulcha & Chole\", description: \"Tandoor-finished kulcha stuffed with paneer & herbs, served with chole and pickled onions.\", price: 240, category: \"Breakfast\", image: \"https://images.unsplash.com/photo-1743615380913-5ddf76d92873?w=400\" },

    { id: \"bv-01\", name: \"Single-Origin Pour Over\", description: \"Hand-brewed seasonal beans, served black with delicate floral notes.\", price: 220, category: \"Coffee\", image: \"https://images.unsplash.com/photo-1774294509888-82cdec15589b?w=400\" },
    { id: \"bv-02\", name: \"Iced Spanish Latte\", description: \"Double espresso with condensed milk over slow ice — sweet, silky, refreshing.\", price: 260, category: \"Coffee\", image: \"https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400\" },
    { id: \"bv-03\", name: \"Kesar Pista Cold Brew\", description: \"12-hour cold brew infused with saffron, pistachio & cardamom — a Lucknow original.\", price: 290, category: \"Coffee\", image: \"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400\" },
    { id: \"bv-04\", name: \"Rose & Cardamom Chai\", description: \"Assam leaves simmered with rose petals, green cardamom and farm milk.\", price: 160, category: \"Coffee\", image: \"https://images.unsplash.com/photo-1597318236192-bc4ecf99eddc?w=400\" },

    { id: \"mn-01\", name: \"Truffle Mushroom Pizza\", description: \"Wood-fired thin crust, wild mushrooms, mozzarella, truffle oil & rocket.\", price: 520, category: \"Mains\", image: \"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400\" },
    { id: \"mn-02\", name: \"Galouti Slider Trio\", description: \"Three soft brioche sliders with melt-in-mouth galouti, mint chutney & pickled shallots.\", price: 480, category: \"Mains\", image: \"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400\" },
    { id: \"mn-03\", name: \"Burrata & Heirloom Salad\", description: \"Creamy burrata, heirloom tomatoes, basil oil, balsamic pearls, toasted pine nuts.\", price: 460, category: \"Mains\", image: \"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400\" },
    { id: \"mn-04\", name: \"Lemon Butter Pasta\", description: \"Hand-rolled tagliatelle, brown butter, lemon zest, parmesan & cracked pepper.\", price: 420, category: \"Mains\", image: \"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400\" },

    { id: \"ds-01\", name: \"Shahi Tukda Cheesecake\", description: \"Baked cheesecake layered with saffron rabri & toasted bread crumble.\", price: 320, category: \"Desserts\", image: \"https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400\" },
    { id: \"ds-02\", name: \"Dark Chocolate Lava\", description: \"Warm 70% Belgian chocolate lava with vanilla bean ice cream & sea salt.\", price: 340, category: \"Desserts\", image: \"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400\" },
    { id: \"ds-03\", name: \"Tiramisu in a Jar\", description: \"Espresso-soaked ladyfingers, mascarpone cream, dark cocoa dusting.\", price: 290, category: \"Desserts\", image: \"https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400\" },
];

const TIMES = [\"08:00\",\"09:00\",\"10:00\",\"11:00\",\"12:00\",\"13:00\",\"14:00\",\"15:00\",\"16:00\",\"17:00\",\"18:00\",\"18:30\",\"19:00\",\"19:30\",\"20:00\",\"20:30\",\"21:00\",\"21:30\"];

// ---------- STATE ----------
let cart = JSON.parse(localStorage.getItem(\"fb_cart\") || \"[]\");
let activeCategory = \"All\";
let fulfillment = \"pickup\";

// ---------- HELPERS ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const fmt = (n) => `₹${n}`;
const uid = () => Math.random().toString(36).slice(2, 10).toUpperCase();
const persist = () => localStorage.setItem(\"fb_cart\", JSON.stringify(cart));

function toast(msg, type = \"success\") {
    const t = $(\"#toast\");
    t.textContent = msg;
    t.className = `toast ${type}`;
    t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => (t.hidden = true), 2600);
}

// ---------- NAVBAR ----------
window.addEventListener(\"scroll\", () => {
    $(\"#navbar\").classList.toggle(\"scrolled\", window.scrollY > 20);
});

$(\"#mobileToggle\").addEventListener(\"click\", () => {
    const m = $(\"#mobileMenu\");
    m.hidden = !m.hidden;
});
$$(\"#mobileMenu a\").forEach((a) =>
    a.addEventListener(\"click\", () => ($(\"#mobileMenu\").hidden = true))
);

// ---------- MENU RENDER ----------
function renderCategories() {
    const cats = [\"All\", ...new Set(MENU_ITEMS.map((i) => i.category))];
    $(\"#categories\").innerHTML = cats
        .map(
            (c) => `<button class=\"cat-pill ${c === activeCategory ? \"active\" : \"\"}\" data-cat=\"${c}\">${c}</button>`
        )
        .join(\"\");
    $$(\".cat-pill\").forEach((b) =>
        b.addEventListener(\"click\", () => {
            activeCategory = b.dataset.cat;
            renderCategories();
            renderMenu();
        })
    );
}

function renderMenu() {
    const list = activeCategory === \"All\" ? MENU_ITEMS : MENU_ITEMS.filter((i) => i.category === activeCategory);
    const grouped = list.reduce((acc, i) => {
        (acc[i.category] = acc[i.category] || []).push(i);
        return acc;
    }, {});
    $(\"#menuGrid\").innerHTML = Object.entries(grouped)
        .map(
            ([cat, items]) => `
            <div class=\"menu-group\">
                <h3>${cat}</h3>
                ${items.map(itemHtml).join(\"\")}
            </div>`
        )
        .join(\"\");
    $$(\".add-btn\").forEach((b) =>
        b.addEventListener(\"click\", () => addToCart(b.dataset.id))
    );
}

function itemHtml(i) {
    return `
    <article class=\"menu-item\">
        <div class=\"menu-item-img\"><img src=\"${i.image}\" alt=\"${i.name}\" loading=\"lazy\" /></div>
        <div class=\"menu-item-body\">
            <div class=\"menu-item-head\">
                <h4 class=\"menu-item-name\">${i.name}</h4>
                <span class=\"leader\"></span>
                <span class=\"menu-item-price\">${fmt(i.price)}</span>
            </div>
            <p class=\"menu-item-desc\">${i.description}</p>
            <button class=\"add-btn\" data-id=\"${i.id}\">+ Add to order</button>
        </div>
    </article>`;
}

// ---------- CART ----------
function addToCart(id) {
    const product = MENU_ITEMS.find((m) => m.id === id);
    const existing = cart.find((c) => c.id === id);
    if (existing) existing.quantity++;
    else cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    persist();
    renderCartBadge();
    renderCart();
    toast(`${product.name} added to your order`);
}

function updateQty(id, delta) {
    const item = cart.find((c) => c.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter((c) => c.id !== id);
    persist();
    renderCartBadge();
    renderCart();
}

function removeItem(id) {
    cart = cart.filter((c) => c.id !== id);
    persist();
    renderCartBadge();
    renderCart();
}

function cartCount() { return cart.reduce((s, i) => s + i.quantity, 0); }
function cartTotal() { return cart.reduce((s, i) => s + i.price * i.quantity, 0); }

function renderCartBadge() {
    const b = $(\"#cartBadge\");
    const c = cartCount();
    b.textContent = c;
    b.hidden = c === 0;
}

function renderCart() {
    const body = $(\"#cartBody\");
    const foot = $(\"#cartFoot\");
    if (cart.length === 0) {
        body.innerHTML = `<div class=\"cart-empty\"><span>Your bag is empty.</span><button class=\"btn-secondary\" id=\"browseBtn\">Browse menu</button></div>`;
        foot.hidden = true;
        $(\"#browseBtn\")?.addEventListener(\"click\", closeCart);
        return;
    }
    body.innerHTML = cart
        .map(
            (i) => `
        <div class=\"cart-item\">
            <div class=\"cart-item-info\">
                <div class=\"cart-item-name\">${i.name}</div>
                <div class=\"cart-item-each\">${fmt(i.price)} each</div>
                <div class=\"qty-row\">
                    <button class=\"qty-btn\" data-act=\"dec\" data-id=\"${i.id}\">−</button>
                    <span class=\"qty-val\">${i.quantity}</span>
                    <button class=\"qty-btn\" data-act=\"inc\" data-id=\"${i.id}\">+</button>
                    <button class=\"remove-btn\" data-act=\"rm\" data-id=\"${i.id}\">Remove</button>
                </div>
            </div>
            <div class=\"cart-item-sub\">${fmt(i.price * i.quantity)}</div>
        </div>`
        )
        .join(\"\");
    $$(\"[data-act]\").forEach((btn) => {
        btn.addEventListener(\"click\", () => {
            const { act, id } = btn.dataset;
            if (act === \"inc\") updateQty(id, 1);
            if (act === \"dec\") updateQty(id, -1);
            if (act === \"rm\") removeItem(id);
        });
    });
    foot.hidden = false;
    $(\"#cartCountLabel\").textContent = `Subtotal · ${cartCount()} items`;
    $(\"#cartTotal\").textContent = fmt(cartTotal());
}

function openCart() {
    $(\"#cartDrawer\").hidden = false;
    $(\"#drawerBackdrop\").hidden = false;
    document.body.style.overflow = \"hidden\";
}
function closeCart() {
    $(\"#cartDrawer\").hidden = true;
    $(\"#drawerBackdrop\").hidden = true;
    document.body.style.overflow = \"\";
}
$(\"#cartToggle\").addEventListener(\"click\", openCart);
$(\"#cartClose\").addEventListener(\"click\", closeCart);
$(\"#drawerBackdrop\").addEventListener(\"click\", closeCart);

// ---------- CHECKOUT MODAL ----------
function openCheckout() {
    fulfillment = \"pickup\";
    renderCheckout();
    $(\"#checkoutModal\").hidden = false;
    $(\"#modalBackdrop\").hidden = false;
}
function closeCheckout() {
    $(\"#checkoutModal\").hidden = true;
    $(\"#modalBackdrop\").hidden = true;
}

$(\"#checkoutBtn\").addEventListener(\"click\", openCheckout);
$(\"#modalBackdrop\").addEventListener(\"click\", closeCheckout);

function renderCheckout() {
    $(\"#modalBody\").innerHTML = `
        <h3 class=\"modal-title\">Checkout</h3>
        <p class=\"modal-sub\">Total · ${fmt(cartTotal())} · ${cartCount()} items</p>
        <form id=\"orderForm\">
            <div class=\"fulfillment-grid\">
                <button type=\"button\" class=\"fulfillment-card ${fulfillment === \"pickup\" ? \"active\" : \"\"}\" data-ff=\"pickup\">
                    <div class=\"label\">Pickup</div>
                    <div class=\"desc\">Ready in 20 min</div>
                </button>
                <button type=\"button\" class=\"fulfillment-card ${fulfillment === \"delivery\" ? \"active\" : \"\"}\" data-ff=\"delivery\">
                    <div class=\"label\">Delivery</div>
                    <div class=\"desc\">~35 min · within 5km</div>
                </button>
            </div>
            <div class=\"form-grid\" style=\"margin-top:1.75rem\">
                <div class=\"form-row\">
                    <label class=\"overline\" for=\"ckName\">Name</label>
                    <input id=\"ckName\" class=\"fb-input\" required />
                </div>
                <div class=\"form-row\">
                    <label class=\"overline\" for=\"ckPhone\">Phone</label>
                    <input id=\"ckPhone\" class=\"fb-input\" type=\"tel\" required />
                </div>
                <div class=\"form-row span-2\">
                    <label class=\"overline\" for=\"ckEmail\">Email (optional)</label>
                    <input id=\"ckEmail\" class=\"fb-input\" type=\"email\" />
                </div>
                ${
                    fulfillment === \"delivery\"
                        ? `<div class=\"form-row span-2\"><label class=\"overline\" for=\"ckAddr\">Delivery address</label><textarea id=\"ckAddr\" class=\"fb-input\" rows=\"2\" required></textarea></div>`
                        : \"\"
                }
                <div class=\"form-row span-2\">
                    <label class=\"overline\" for=\"ckNotes\">Notes (optional)</label>
                    <input id=\"ckNotes\" class=\"fb-input\" />
                </div>
            </div>
            <button type=\"submit\" class=\"btn-primary full\" style=\"margin-top:2rem\">Place order · ${fmt(cartTotal())}</button>
        </form>
    `;
    $$(\".fulfillment-card\").forEach((b) =>
        b.addEventListener(\"click\", () => {
            fulfillment = b.dataset.ff;
            renderCheckout();
        })
    );
    $(\"#orderForm\").addEventListener(\"submit\", placeOrder);
}

function placeOrder(e) {
    e.preventDefault();
    const name = $(\"#ckName\").value.trim();
    const phone = $(\"#ckPhone\").value.trim();
    if (!name || !phone) return toast(\"Please enter your name and phone.\", \"error\");
    const orderId = uid();
    const total = cartTotal();
    const customerFirst = name.split(\" \")[0];
    cart = [];
    persist();
    renderCartBadge();
    renderCart();
    $(\"#modalBody\").innerHTML = `
        <div class=\"success-state\">
            <div class=\"success-icon\">✓</div>
            <h3 class=\"modal-title\" style=\"margin-top:1rem\">Order received</h3>
            <p class=\"modal-sub\">Thank you, ${customerFirst}. We're firing up the kitchen.</p>
            <div style=\"margin-top:1.5rem;font-size:0.875rem;color:var(--text-2)\">
                Order ID: <span class=\"order-id\">${orderId}</span><br/>
                Total: ${fmt(total)}
            </div>
            <button class=\"btn-primary\" id=\"ckDone\" style=\"margin-top:2rem\">Done</button>
        </div>
    `;
    $(\"#ckDone\").addEventListener(\"click\", () => {
        closeCheckout();
        closeCart();
    });
}

// ---------- RESERVATION ----------
function fillReservationOptions() {
    $(\"#resTime\").innerHTML =
        `<option value=\"\">Select time</option>` +
        TIMES.map((t) => `<option value=\"${t}\">${t}</option>`).join(\"\");
    $(\"#resGuests\").innerHTML = Array.from({ length: 12 }, (_, i) =>
        `<option value=\"${i + 1}\" ${i === 1 ? \"selected\" : \"\"}>${i + 1} ${i === 0 ? \"guest\" : \"guests\"}</option>`
    ).join(\"\");
    const today = new Date().toISOString().split(\"T\")[0];
    $(\"#resDate\").min = today;
}

$(\"#reservationForm\").addEventListener(\"submit\", (e) => {
    e.preventDefault();
    const date = $(\"#resDate\").value;
    const time = $(\"#resTime\").value;
    const name = $(\"#resName\").value.trim();
    const phone = $(\"#resPhone\").value.trim();
    const guests = $(\"#resGuests\").value;
    if (!date || !time || !name || !phone) return toast(\"Please fill in date, time, name and phone.\", \"error\");
    const id = uid();
    const form = $(\"#reservationForm\");
    form.innerHTML = `
        <div class=\"success-state\" style=\"text-align:center\">
            <div class=\"success-icon\">✓</div>
            <h3 class=\"modal-title\" style=\"margin-top:1rem\">See you soon, ${name.split(\" \")[0]}.</h3>
            <p class=\"prose\" style=\"margin:1rem auto 0;text-align:center\">
                Your table for <strong>${guests}</strong> is booked on <strong>${date}</strong> at <strong>${time}</strong>.
                Reservation ID: <span class=\"order-id\">${id}</span>
            </p>
        </div>
    `;
    toast(\"Table reserved!\");
});

// ---------- CONTACT ----------
$(\"#contactForm\").addEventListener(\"submit\", (e) => {
    e.preventDefault();
    const name = $(\"#cName\").value.trim();
    const email = $(\"#cEmail\").value.trim();
    const msg = $(\"#cMsg\").value.trim();
    if (!name || !email || !msg) return toast(\"Please fill all fields.\", \"error\");
    e.target.reset();
    toast(\"Message sent — we'll write back within a day.\");
});

// ---------- INIT ----------
$(\"#year\").textContent = new Date().getFullYear();
fillReservationOptions();
renderCategories();
renderMenu();
renderCartBadge();
renderCart();
"
Observation: Create successful: /app/static/script.js
