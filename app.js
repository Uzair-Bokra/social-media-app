const isLoggedIn = localStorage.getItem('auth_logged_in');
        if (isLoggedIn !== 'true') {
            window.location.href = 'features/Login/login.html';
        }