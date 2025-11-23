const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        errorMessage.textContent = 'Both fields are required.';
        return;
    }

    const storedUser = localStorage.getItem('auth_user');

    if (!storedUser) {
        errorMessage.textContent = 'No user found. Please sign up.';
        return;
    }

    const user = JSON.parse(storedUser);

    if (user.email === email && user.password === password) {
        localStorage.setItem('auth_logged_in', 'true');
        window.location.href = '../../index.html';
    } else {
        errorMessage.textContent = 'Invalid email or password.';
    }
});
