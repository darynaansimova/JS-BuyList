document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.add-product');
    const input = document.getElementById('add');
    const productListContainer = document.querySelectorAll('.column-section')[0];
    const toBuyList = document.querySelectorAll('.to-buy')[0];
    const boughtList = document.querySelectorAll('.to-buy')[1];

    let products = loadProducts();

    function saveProducts() {
        localStorage.setItem('products', JSON.stringify(products));
    }

    function loadProducts() {
        const data = localStorage.getItem('products');
        return data ? JSON.parse(data) : [
            { name: 'Cookies', quantity: 1, bought: true },
            { name: 'Apples', quantity: 4, bought: false },
            { name: 'Cheese', quantity: 1, bought: false },
        ];
    }

    function renderAll() {
        productListContainer.querySelectorAll('.product-container').forEach(el => el.remove());
        toBuyList.innerHTML = '';
        boughtList.innerHTML = '';
        products.forEach(product => {
            renderProduct(product);
            renderStats();
        });
    }

    function renderStats() {
        toBuyList.innerHTML = '';
        boughtList.innerHTML = '';
        products.forEach(p => {
            const span = document.createElement('span');
            span.className = 'product-item';
            span.innerHTML = `${p.bought ? `<del>${p.name}</del>` : p.name} <span class="amount">${p.quantity}</span>`;
            (p.bought ? boughtList : toBuyList).appendChild(span);
        });
    }

    function renderProduct(product) {
        const div = document.createElement('div');
        div.className = 'product-container';

        const label = document.createElement('label');
        label.className = 'product-name';
        label.textContent = product.name;
        label.addEventListener('click', () => {
            if (product.bought) return;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = product.name;
            input.autofocus = true;
            label.replaceWith(input);
            input.focus();
            input.addEventListener('blur', () => {
                product.name = input.value.trim() || product.name;
                saveProducts();
                renderAll();
            });
        });

        if (product.bought) {
            const del = document.createElement('del');
            del.textContent = product.name;
            label.innerHTML = '';
            label.appendChild(del);
            div.appendChild(label);

            const quantity = document.createElement('span');
            quantity.className = 'product-amount';
            quantity.textContent = product.quantity;
            div.appendChild(quantity);

            const btn = document.createElement('button');
            btn.className = 'buy-button not-bought';
            btn.textContent = 'Not bought';
            btn.setAttribute('data-tooltip', 'Mark as not bought'); 
            btn.addEventListener('click', () => {
                product.bought = false;
                saveProducts();
                renderAll();
            });
            div.appendChild(btn);
        } else {
            div.appendChild(label);

            const minus = document.createElement('button');
            minus.className = 'sign minus';
            minus.textContent = '-';
            minus.disabled = product.quantity <= 1;
            minus.setAttribute('data-tooltip', 'Decrease quantity');
            minus.addEventListener('click', () => {
                if (product.quantity > 1) product.quantity--;
                saveProducts();
                renderAll();
            });

            const plus = document.createElement('button');
            plus.className = 'sign plus';
            plus.textContent = '+';
            plus.setAttribute('data-tooltip', 'Increase quantity');
            plus.addEventListener('click', () => {
                product.quantity++;
                saveProducts();
                renderAll();
            });

            const quantity = document.createElement('span');
            quantity.className = 'product-amount';
            quantity.textContent = product.quantity;

            const buyBtn = document.createElement('button');
            buyBtn.className = 'buy-button bought';
            buyBtn.textContent = 'Bought';
            buyBtn.setAttribute('data-tooltip', 'Mark as bought');
            buyBtn.addEventListener('click', () => {
                product.bought = true;
                saveProducts();
                renderAll();
            });

            const remove = document.createElement('button');
            remove.className = 'sign remove';
            remove.textContent = '⨯';
            remove.setAttribute('data-tooltip', 'Remove product');
            remove.addEventListener('click', () => {
                products = products.filter(p => p !== product);
                saveProducts();
                renderAll();
            });

            div.append(minus, quantity, plus, buyBtn, remove);
        }

        productListContainer.appendChild(div);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = input.value.trim();
        if (!name) return;
        products.push({ name, quantity: 1, bought: false });
        input.value = '';
        input.focus();
        saveProducts();
        renderAll();
    });

    renderAll();
});