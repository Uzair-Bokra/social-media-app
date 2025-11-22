const signupForm = document.getElementById('signup-form');
const errorMessage = document.getElementById('error-message');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!username || !firstName || !lastName || !email || !password || !confirmPassword) {
        errorMessage.textContent = 'All fields are required.';
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match.';
        return;
    }

    if (localStorage.getItem('auth_user')) {
        const existingUser = JSON.parse(localStorage.getItem('auth_user'));
        if (existingUser.email === email) {
            errorMessage.textContent = 'User with this email already exists.';
            return;
        }
    }

    const user = {
        username,
        firstName,
        lastName,
        email,
        password
    };

    localStorage.setItem('auth_user', JSON.stringify(user));
    window.location.href = '../Login/login.html';
});
