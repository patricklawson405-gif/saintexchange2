// ============================================
// ADMIN PANEL JAVASCRIPT
// ============================================

// Check if logged in
if (!localStorage.getItem('adminLoggedIn') && !window.location.href.includes('login.html')) {
    window.location.href = 'login.html';
}

// Sidebar Toggle
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.admin-sidebar');

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Admin Login
const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        
        // Simple validation (replace with real auth)
        if (email && password) {
            localStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'index.html';
        } else {
            alert('Please enter valid credentials');
        }
    });
}

// Logout
const adminLogout = document.getElementById('adminLogout');
if (adminLogout) {
    adminLogout.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'login.html';
    });
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Populate Recent Orders Table
const recentOrdersTable = document.getElementById('recentOrdersTable');
if (recentOrdersTable) {
    const orders = [
        { id: '#ORD-001', customer: 'fmlogstore', product: 'T-Mobile refill pin', amount: '₦27,000', status: 'completed' },
        { id: '#ORD-002', customer: 'Cleavfbee', product: 'PIZZA (USA,CAD)', amount: '₦25,000', status: 'processing' },
        { id: '#ORD-003', customer: 'Royal Logistics', product: 'Express VPN', amount: '₦3,000', status: 'pending' },
        { id: '#ORD-004', customer: 'Walker', product: 'Express VPN 2mo', amount: '₦5,000', status: 'completed' },
    ];
    
    recentOrdersTable.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td>${order.amount}</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
        </tr>
    `).join('');
}

// Populate Top Products
const topProductsList = document.getElementById('topProductsList');
if (topProductsList) {
    const products = [
        { name: 'T-Mobile Refill Pin', sales: 156, revenue: '₦4.2M' },
        { name: 'Express VPN', sales: 142, revenue: '₦426K' },
        { name: 'iTunes Ecode', sales: 98, revenue: '₦2.1M' },
    ];
    
    topProductsList.innerHTML = products.map((product, index) => `
        <div class="top-product-item">
            <span class="rank">${index + 1}</span>
            <div class="product-info">
                <h4>${product.name}</h4>
                <p>${product.sales} sales</p>
            </div>
            <span class="revenue">${product.revenue}</span>
        </div>
    `).join('');
}

// Populate Recent Users
const recentUsersList = document.getElementById('recentUsersList');
if (recentUsersList) {
    const users = [
        { name: 'Green Joshua', email: 'green@email.com', date: '2 mins ago' },
        { name: 'Eunice', email: 'eunice@email.com', date: '15 mins ago' },
        { name: 'Mark Brown', email: 'mark@email.com', date: '1 hour ago' },
    ];
    
    recentUsersList.innerHTML = users.map(user => `
        <div class="recent-user-item">
            <img src="https://via.placeholder.com/40" alt="${user.name}">
            <div class="user-info">
                <h4>${user.name}</h4>
                <p>${user.email}</p>
            </div>
            <span class="time">${user.date}</span>
        </div>
    `).join('');
}

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});