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
    const profilePictureInput = document.getElementById('profile-picture');
    const profilePictureFile = profilePictureInput.files[0]; // Get the selected file

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

    // Handle profile picture
    if (profilePictureFile) {
        // Basic file size validation (e.g., 2MB limit)
        if (profilePictureFile.size > 2 * 1024 * 1024) { // 2MB
            errorMessage.textContent = 'Profile picture must be less than 2MB.';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const profilePictureBase64 = event.target.result;

            const user = {
                username,
                firstName,
                lastName,
                email,
                password,
                profilePictureBase64 // Store Base64 string
            };

            localStorage.setItem('auth_user', JSON.stringify(user));
            window.location.href = '../Login/login.html';
        };
        reader.readAsDataURL(profilePictureFile); // Read file as Base64
    } else {
        // If no profile picture is selected
        const user = {
            username,
            firstName,
            lastName,
            email,
            password,
            profilePictureBase64: null // No profile picture
        };

        localStorage.setItem('auth_user', JSON.stringify(user));
        window.location.href = '../Login/login.html';
    }
});
