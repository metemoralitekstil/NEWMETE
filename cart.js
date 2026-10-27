// Backward-compatibility shim (cart.js moved to js/cart.js)
if (typeof cart === 'undefined') {
    const s = document.createElement('script');
    s.src = 'js/cart.js?v=3.2';
    s.defer = true;
    document.head.appendChild(s);
}
