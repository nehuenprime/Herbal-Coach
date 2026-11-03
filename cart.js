/* CARRITO DE CONSULTA - HerbalCoach*/

(function () {
    'use strict';

    // ⚠️ Cambiá este número por el tuyo (código de país + código de área + número, sin + ni espacios)
    const WHATSAPP_NUMBER = '5491159372833';
    const STORAGE_KEY = 'herbalcoach_cart';

    let cart = loadCart();

    /* ---------- Storage ---------- */
    function loadCart() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return Array.isArray(data) ? data : [];
        } catch (e) {
            return [];
        }
    }

    function saveCart() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch (e) { /* modo privado / storage lleno: el carrito sigue funcionando en memoria */ }
    }

    /* ---------- Helpers ---------- */
    function cleanText(text) {
        return (text || '').replace(/\s+/g, ' ').trim();
    }

    function makeId(name) {
        return cleanText(name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function totalItems() {
        return cart.reduce((sum, item) => sum + item.qty, 0);
    }

    /* ---------- Acciones del carrito ---------- */
    function addToCart(name, img) {
        name = cleanText(name);
        if (!name) return;
        const id = makeId(name);
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ id: id, name: name, img: img || '', qty: 1 });
        }
        saveCart();
        renderCart();
        showToast('Agregaste "' + name + '" al carrito');
        bumpBadge();
    }

    function changeQty(id, delta) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
        saveCart();
        renderCart();
    }

    function removeItem(id) {
        cart = cart.filter(i => i.id !== id);
        saveCart();
        renderCart();
    }

    function clearCart() {
        cart = [];
        saveCart();
        renderCart();
    }

    function sendToWhatsApp() {
        if (cart.length === 0) return;
        const lines = cart.map(item => '• ' + item.qty + ' x ' + item.name);
        const message =
            'Hola! Quiero consultar por estos productos:\n\n' +
            lines.join('\n') +
            '\n\n¿Me pasás precios y disponibilidad? Gracias!';
        const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
        window.open(url, '_blank');
    }

    /* ---------- UI: estructura del carrito ---------- */
    function buildUI() {
        const html =
            '<button type="button" id="cartButton" class="cart-fab" aria-label="Abrir carrito">' +
                '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                    '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>' +
                    '<path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"></path>' +
                '</svg>' +
                '<span id="cartBadge" class="cart-badge" hidden>0</span>' +
            '</button>' +
            '<div id="cartOverlay" class="cart-overlay"></div>' +
            '<aside id="cartDrawer" class="cart-drawer" aria-hidden="true" aria-label="Carrito de consulta">' +
                '<div class="cart-header">' +
                    '<h2>Tu consulta</h2>' +
                    '<button type="button" id="cartClose" class="cart-close" aria-label="Cerrar carrito">&times;</button>' +
                '</div>' +
                '<div id="cartItems" class="cart-items"></div>' +
                '<div class="cart-footer">' +
                    '<p class="cart-note">Los precios y el stock te los confirmo por WhatsApp.</p>' +
                    '<button type="button" id="cartSend" class="cart-send">Consultar por WhatsApp</button>' +
                    '<button type="button" id="cartClear" class="cart-clear">Vaciar carrito</button>' +
                '</div>' +
            '</aside>' +
            '<div id="cartToast" class="cart-toast" role="status" aria-live="polite"></div>';

        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        while (wrapper.firstChild) document.body.appendChild(wrapper.firstChild);

        document.getElementById('cartButton').addEventListener('click', openCart);
        document.getElementById('cartClose').addEventListener('click', closeCart);
        document.getElementById('cartOverlay').addEventListener('click', closeCart);
        document.getElementById('cartSend').addEventListener('click', sendToWhatsApp);
        document.getElementById('cartClear').addEventListener('click', clearCart);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeCart();
        });

        // Delegación de eventos para los botones +, -, quitar
        document.getElementById('cartItems').addEventListener('click', function (e) {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;
            const id = btn.dataset.id;
            if (btn.dataset.action === 'plus') changeQty(id, 1);
            if (btn.dataset.action === 'minus') changeQty(id, -1);
            if (btn.dataset.action === 'remove') removeItem(id);
        });
    }

    function openCart() {
        document.getElementById('cartDrawer').classList.add('open');
        document.getElementById('cartOverlay').classList.add('open');
        document.getElementById('cartDrawer').setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        const drawer = document.getElementById('cartDrawer');
        if (!drawer) return;
        drawer.classList.remove('open');
        document.getElementById('cartOverlay').classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    /* ---------- UI: render ---------- */
    function renderCart() {
        const container = document.getElementById('cartItems');
        const badge = document.getElementById('cartBadge');
        const send = document.getElementById('cartSend');
        const clear = document.getElementById('cartClear');
        if (!container) return;

        const count = totalItems();
        badge.textContent = count;
        badge.hidden = count === 0;
        send.disabled = count === 0;
        clear.hidden = count === 0;

        if (cart.length === 0) {
            container.innerHTML =
                '<div class="cart-empty">' +
                    '<p>Todavía no agregaste productos.</p>' +
                    '<p>Tocá "Agregar" en los productos que te interesen y consultalos todos juntos.</p>' +
                '</div>';
            return;
        }

        container.innerHTML = cart.map(function (item) {
            const id = escapeHTML(item.id);
            return (
                '<div class="cart-item">' +
                    '<img src="' + escapeHTML(item.img) + '" alt="' + escapeHTML(item.name) + '">' +
                    '<div class="cart-item-info">' +
                        '<p class="cart-item-name">' + escapeHTML(item.name) + '</p>' +
                        '<div class="cart-qty">' +
                            '<button type="button" data-action="minus" data-id="' + id + '" aria-label="Quitar una unidad">−</button>' +
                            '<span>' + item.qty + '</span>' +
                            '<button type="button" data-action="plus" data-id="' + id + '" aria-label="Agregar una unidad">+</button>' +
                        '</div>' +
                    '</div>' +
                    '<button type="button" class="cart-remove" data-action="remove" data-id="' + id + '" aria-label="Eliminar ' + escapeHTML(item.name) + '">&times;</button>' +
                '</div>'
            );
        }).join('');
    }

    function bumpBadge() {
        const btn = document.getElementById('cartButton');
        btn.classList.remove('bump');
        void btn.offsetWidth; // reinicia la animación
        btn.classList.add('bump');
    }

    let toastTimer;
    function showToast(text) {
        const toast = document.getElementById('cartToast');
        toast.textContent = text;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
    }

    /* ---------- Botones "Agregar" en cada producto ---------- */
    function addButtonsToProducts() {
        document.querySelectorAll('.producto').forEach(function (card) {
            if (card.querySelector('.btn-agregar')) return;
            const consultBtn = card.querySelector('.btn-consultar');
            if (!consultBtn) return;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn-agregar';
            btn.textContent = 'Agregar al carrito';
            btn.addEventListener('click', function () {
                const nameEl = card.querySelector('.nombre-producto');
                const imgEl = card.querySelector('.img-producto');
                addToCart(nameEl ? nameEl.textContent : consultBtn.dataset.producto, imgEl ? imgEl.src : '');
            });
            consultBtn.after(btn);
        });
    }

    /* ---------- Botón "Agregar" dentro del modal de producto ---------- */
    function addButtonToModal() {
        const modalBtn = document.getElementById('modalBoton');
        if (!modalBtn || document.getElementById('modalAgregar')) return;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'modalAgregar';
        btn.className = 'btn-agregar';
        btn.textContent = 'Agregar al carrito';
        btn.addEventListener('click', function () {
            const title = document.getElementById('modalTitulo');
            const img = document.getElementById('modalImg');
            const imgSrc = img ? img.src : '';

            // Busca la tarjeta del producto que abrió el modal (por la imagen)
            // para usar el MISMO nombre que en la grilla y no duplicar productos.
            let name = '';
            document.querySelectorAll('.producto .img-producto').forEach(function (cardImg) {
                if (!name && cardImg.src === imgSrc) {
                    const nameEl = cardImg.closest('.producto').querySelector('.nombre-producto');
                    if (nameEl) name = nameEl.textContent;
                }
            });
            if (!name && title) name = title.textContent;

            addToCart(name, imgSrc);
        });
        modalBtn.after(btn);
    }

    /* ---------- Init ---------- */
    document.addEventListener('DOMContentLoaded', function () {
        buildUI();
        addButtonsToProducts();
        addButtonToModal();
        renderCart();
    });

    // Si usás el carrito en varias pestañas, se mantiene sincronizado
    window.addEventListener('storage', function (e) {
        if (e.key === STORAGE_KEY) {
            cart = loadCart();
            renderCart();
        }
    });
})();

