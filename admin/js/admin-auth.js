// Admin Authentication
document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    // Demo credentials - change in production
    if (email === 'admin@friendylogs.com' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUser', JSON.stringify({ email: email, name: 'Admin User' }));
        window.location.href = 'index.html';
    } else {
        alert('Invalid credentials! Try admin@friendylogs.com / admin123');
    }
});