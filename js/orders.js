# Create order.js - connects product to payment
order_js = '''// ============================================
// ORDER SYSTEM - Connects to Payment
// ============================================

// Product data
const productData = {
    id: 'FLW-001',
    name: 'Fresh Flower (USA & CANADA ONLY)',
    price: 50000,
    customizationFee: 10000,
    image: 'https://via.placeholder.com/500x500/d32f2f/ffffff?text=Red+Roses'
};

// Calculate total
let basePrice = productData.price;
let totalAmount = basePrice;

// Customization toggle
const customizeToggle = document.getElementById('customizeToggle');
const customTextArea = document.getElementById('customTextArea');
const totalPriceEl = document.getElementById('totalPrice');

if (customizeToggle) {
    customizeToggle.addEventListener('change', function() {
        if (this.checked) {
            customTextArea.style.display = 'block';
            totalAmount = basePrice + productData.customizationFee;
        } else {
            customTextArea.style.display = 'none';
            totalAmount = basePrice;
        }
        totalPriceEl.textContent = '₦' + totalAmount.toLocaleString() + '.00';
    });
}

// Form submission
const orderForm = document.getElementById('orderForm');
if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect order data
        const orderData = {
            orderId: 'ORD-' + Date.now(),
            product: productData,
            recipient: {
                name: document.getElementById('recipientName').value,
                phone: document.getElementById('recipientPhone').value
            },
            sender: {
                name: document.getElementById('senderName').value,
                phone: document.getElementById('senderPhone').value,
                email: document.getElementById('senderEmail').value
            },
            address: {
                street: document.getElementById('streetAddress').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value
            },
            customization: {
                enabled: customizeToggle.checked,
                message: customizeToggle.checked ? document.getElementById('customMessage').value : ''
            },
            totalAmount: totalAmount,
            status: 'pending_payment',
            date: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('currentOrder', JSON.stringify(orderData));
        
        // Add to orders history
        let orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Redirect to payment
        window.location.href = 'payment.html';
    });
}'''

with open(os.path.join(base_dir, "js", "order.js"), "w") as f:
    f.write(order_js)

print("✓ js/order.js created - connects product to payment")