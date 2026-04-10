# Create admin/js folder first
admin_js_dir = os.path.join(admin_dir, "js")
os.makedirs(admin_js_dir, exist_ok=True)

# Create payments.js for admin verification
payments_js = '''// ============================================
// ADMIN PAYMENT VERIFICATION
// ============================================

let allPayments = [];
let currentFilter = 'all';

// Load payments from localStorage
function loadPayments() {
    allPayments = JSON.parse(localStorage.getItem('pendingPayments') || '[]');
    updateStats();
    renderPayments();
}

// Update statistics
function updateStats() {
    const pending = allPayments.filter(p => p.payment.status === 'pending_verification').length;
    const verified = allPayments.filter(p => p.payment.status === 'verified').length;
    const rejected = allPayments.filter(p => p.payment.status === 'rejected').length;
    const total = allPayments.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
    
    document.getElementById('pendingPayments').textContent = pending;
    document.getElementById('verifiedPayments').textContent = verified;
    document.getElementById('rejectedPayments').textContent = rejected;
    document.getElementById('totalValue').textContent = '₦' + total.toLocaleString();
    document.getElementById('pendingCount').textContent = pending;
}

// Render payments table
function renderPayments() {
    const tbody = document.getElementById('paymentsTableBody');
    let filtered = allPayments;
    
    if (currentFilter !== 'all') {
        filtered = allPayments.filter(p => p.payment.status === currentFilter);
    }
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem;">No payments found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(payment => `
        <tr>
            <td><strong>${payment.orderId}</strong></td>
            <td>
                <div>${payment.sender.name}</div>
                <small style="color: #6b7280;">${payment.sender.phone}</small>
            </td>
            <td>${payment.product.name}</td>
            <td><strong>₦${payment.totalAmount.toLocaleString()}</strong></td>
            <td>${getBankName(payment.payment.bank)}</td>
            <td>${formatDate(payment.payment.date)}</td>
            <td>
                <button class="btn-action view" onclick="viewProof('${payment.orderId}')">
                    <i class="fas fa-image"></i> View
                </button>
            </td>
            <td>${getStatusBadge(payment.payment.status)}</td>
            <td>
                <button class="btn-action view" onclick="viewDetails('${payment.orderId}')">
                    <i class="fas fa-eye"></i>
                </button>
                ${payment.payment.status === 'pending_verification' ? `
                    <button class="btn-action edit" onclick="verifyPayment('${payment.orderId}')">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-action delete" onclick="rejectPayment('${payment.orderId}')">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function getBankName(code) {
    const banks = { 'gtb': 'GTBank', 'zenith': 'Zenith', 'firstbank': 'First Bank', 'uba': 'UBA' };
    return banks[code] || code;
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

function getStatusBadge(status) {
    const badges = {
        'pending_verification': '<span class="status-badge pending">Pending</span>',
        'verified': '<span class="status-badge completed">Verified</span>',
        'rejected': '<span class="status-badge cancelled">Rejected</span>'
    };
    return badges[status] || status;
}

function filterPayments(filter) {
    currentFilter = filter;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderPayments();
}

function viewDetails(orderId) {
    const payment = allPayments.find(p => p.orderId === orderId);
    if (!payment) return;
    
    document.getElementById('paymentDetails').innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div>
                <h4>Order: ${payment.orderId}</h4>
                <p>Product: ${payment.product.name}</p>
                <p>Amount: ₦${payment.totalAmount.toLocaleString()}</p>
                <p>Customer: ${payment.sender.name}</p>
                <p>Phone: ${payment.sender.phone}</p>
            </div>
            <div>
                <h4>Payment Details</h4>
                <p>Bank: ${getBankName(payment.payment.bank)}</p>
                <p>From: ${payment.payment.senderBank}</p>
                <p>Account: ${payment.payment.senderAccount}</p>
                <p>Date: ${formatDate(payment.payment.date)}</p>
            </div>
        </div>
    `;
    
    document.getElementById('modalActions').innerHTML = payment.payment.status === 'pending_verification' ? `
        <button class="btn-primary" onclick="verifyPayment('${orderId}'); closeModal();" style="background: #22c55e;">
            <i class="fas fa-check"></i> Verify
        </button>
        <button class="btn-secondary" onclick="rejectPayment('${orderId}'); closeModal();" style="background: #ef4444; color: white;">
            <i class="fas fa-times"></i> Reject
        </button>
    ` : '<button class="btn-secondary" onclick="closeModal()">Close</button>';
    
    document.getElementById('paymentModal').classList.add('active');
}

function verifyPayment(orderId) {
    if (!confirm('Verify this payment?')) return;
    const payment = allPayments.find(p => p.orderId === orderId);
    if (payment) {
        payment.payment.status = 'verified';
        localStorage.setItem('pendingPayments', JSON.stringify(allPayments));
        
        // WhatsApp confirmation
        const msg = encodeURIComponent(`*PAYMENT VERIFIED* ✅\\n\\nHello ${payment.sender.name},\\n\\nYour payment of ₦${payment.totalAmount.toLocaleString()} for order *${orderId}* has been verified.\\n\\nWe will now process your order.\\n\\nThank you!`);
        window.open(`https://wa.me/${payment.sender.phone}?text=${msg}`, '_blank');
        
        loadPayments();
        alert('Payment verified! Customer notified.');
    }
}

function rejectPayment(orderId) {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;
    const payment = allPayments.find(p => p.orderId === orderId);
    if (payment) {
        payment.payment.status = 'rejected';
        payment.payment.rejectionReason = reason;
        localStorage.setItem('pendingPayments', JSON.stringify(allPayments));
        
        const msg = encodeURIComponent(`*PAYMENT ISSUE* ⚠️\\n\\nHello ${payment.sender.name},\\n\\nWe could not verify your payment for order *${orderId}*.\\n\\nReason: ${reason}\\n\\nPlease contact us: https://wa.me/2348012345678`);
        window.open(`https://wa.me/${payment.sender.phone}?text=${msg}`, '_blank');
        
        loadPayments();
        alert('Payment rejected. Customer notified.');
    }
}

function closeModal() {
    document.getElementById('paymentModal').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', loadPayments);'''

with open(os.path.join(admin_js_dir, "payments.js"), "w") as f:
    f.write(payments_js)

print("✓ admin/js/payments.js created")