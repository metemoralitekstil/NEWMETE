

let cart = JSON.parse(localStorage.getItem('metemorali_cart')) || [];

// Hotfix: map old .png images to .webp and fix naming issues
let needsSave = false;
cart.forEach(item => {
    if (item.image) {
        if (item.image.includes('Mavi-Sari.png')) {
            item.image = item.image.replace('Mavi-Sari.png', 'Mavi_sari.webp');
            needsSave = true;
        } else if (item.image.includes('Sari-Mavi.png')) {
            item.image = item.image.replace('Sari-Mavi.png', 'Coksari_mavi.webp');
            needsSave = true;
        } else if (item.image.endsWith('.png')) {
            item.image = item.image.replace('.png', '.webp');
            needsSave = true;
        }
    }
});
if (needsSave) {
    localStorage.setItem('metemorali_cart', JSON.stringify(cart));
}

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
    
    const lang = localStorage.getItem('metemorali_lang') || 'tr';
    const toastText = window.i18n && window.i18n.translations[lang] 
        ? window.i18n.translations[lang]['cart_toast'] 
        : 'sepete eklendi!';
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
