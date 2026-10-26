

let cart = JSON.parse(localStorage.getItem('metemorali_cart')) || [];



function saveCart() {
    localStorage.setItem('metemorali_cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    badges.forEach(badge => {
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

function addToCart(product) {
    const existingIndex = cart.findIndex(item => 
        item.id === product.id && 
        item.size === product.size && 
        (item.color || '') === (product.color || '')
    );
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += product.quantity;
    } else {
        cart.push(product);
    }
    
    saveCart();
    
    const lang = (window.i18n && window.i18n.currentLang) || (new URLSearchParams(window.location.search).get('lang')) || localStorage.getItem('metemorali_lang') || 'tr';
    const toastText = (window.i18n && window.i18n.t('cart_toast')) || 'sepete eklendi!';
    const displayTitle = typeof product.title === 'object' 
        ? (product.title[lang] || product.title['tr']) 
        : product.title;
    const variantInfo = product.color 
        ? `${product.size} - ${product.color}` 
        : product.size;
    showToast(`${displayTitle} (${variantInfo}) ${toastText}`, 'success');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    if (typeof renderCart === 'function') {
        renderCart();
    }
}

function updateQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) {
        cart[index].quantity = 1;
    }
    saveCart();
    if (typeof renderCart === 'function') {
        renderCart();
    }
}

function showToast(message, type = 'success') {
    if (window.showToast) {
        window.showToast(message, type);
        return;
    }
    let toast = document.getElementById('cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cart-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = 'cart-toast show';
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});
