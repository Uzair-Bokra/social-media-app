document.addEventListener('DOMContentLoaded', () => {
    const postsFeed = document.querySelector('.posts-feed');
    const postButton = document.querySelector('#post-button');
    const postTextInput = document.querySelector('#post-text');
    const postImageUrlInput = document.querySelector('#post-image-url');
    const logoutButton = document.querySelector('#logout-button');
    const searchInput = document.querySelector('#search-input');
    const sortSelect = document.querySelector('#sort-by');
    const themeToggleButton = document.querySelector('#theme-toggle-button');

    // Edit Modal elements
    const editPostModal = document.querySelector('#edit-post-modal');
    const editPostTextarea = document.querySelector('#edit-post-text');
    const editPostImageUrlInput = document.querySelector('#edit-post-image-url');
    const saveEditButton = document.querySelector('#save-edit-button');
    const cancelEditButton = document.querySelector('#cancel-edit-button');

    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let editingPostId = null; // To keep track of which post is being edited

    // Get logged-in user info
    const storedUser = JSON.parse(localStorage.getItem('auth_user'));
    const loggedInUser = storedUser ? `${storedUser.firstName} ${storedUser.lastName}` : 'Anonymous User';
    const loggedInUserProfilePic = storedUser ? storedUser.profilePictureBase64 : null;

    const savePosts = () => {
        localStorage.setItem('posts', JSON.stringify(posts));
    };

    // Theme toggle functionality
    const applyTheme = (theme) => {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        localStorage.setItem('theme', theme);

        const icon = themeToggleButton.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
    };

    // Set initial theme on page load
    const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light
    applyTheme(savedTheme);

    themeToggleButton.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // Function to apply search and sort, then render
    const applySortAndFilter = () => {
        let postsToDisplay = [...posts]; // Start with a fresh copy of all posts

        // Apply search filter
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            postsToDisplay = postsToDisplay.filter(post =>
                post.text.toLowerCase().includes(searchTerm) ||
                post.author.toLowerCase().includes(searchTerm) // Allow searching by author
            );
        }

        // Apply sorting
        const sortBy = sortSelect.value;
        switch (sortBy) {
            case 'latest':
                postsToDisplay.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                break;
            case 'oldest':
                postsToDisplay.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                break;
            case 'likes':
                postsToDisplay.sort((a, b) => b.likes - a.likes);
                break;
        }

        renderPosts(postsToDisplay);
    };

    const renderPosts = (postsToRender) => {
        postsFeed.innerHTML = ''; // Clear current posts
        postsToRender.forEach(post => {
            const postCard = document.createElement('div');
            postCard.classList.add('post-card');
            postCard.dataset.id = post.id;

            const profilePicSrc = post.authorProfilePic || 'https://via.placeholder.com/40/CCCCCC/FFFFFF?text=AV'; // Generic avatar
            const postImageHtml = post.imageUrl ? `<img src="${post.imageUrl}" alt="Post Image" class="post-image">` : '';

            postCard.innerHTML = `
                <div class="post-header">
                    <img src="${profilePicSrc}" alt="Profile Picture" class="post-author-pic">
                    <div class="post-author-info">
                        <span class="post-author">${post.author}</span>
                        <span class="post-date">${new Date(post.timestamp).toLocaleDateString()} ${new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div class="post-options">
                        <button class="three-dots-button">...</button>
                        <div class="dropdown-menu">
                            <button class="edit-button btn">Edit</button>
                            <button class="delete-button btn danger">Delete</button>
                        </div>
                    </div>
                </div>
                <p class="post-content">${post.text}</p>
                ${postImageHtml}
                <div class="post-actions">
                    <button class="like-button ${post.liked ? 'liked' : ''}">
                        <i class="fas fa-heart"></i> Like
                    </button>
                    <span class="like-count">${post.likes} Likes</span>
                </div>
            `;
            postsFeed.append(postCard); // Add new post to the end of the container

            // Add event listeners for like, edit and delete buttons
            const likeButton = postCard.querySelector('.like-button');
            const threeDotsButton = postCard.querySelector('.three-dots-button');
            const dropdownMenu = postCard.querySelector('.dropdown-menu');
            const editButton = postCard.querySelector('.edit-button');
            const deleteButton = postCard.querySelector('.delete-button');

            threeDotsButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent document click from immediately closing
                // Close other open dropdowns
                document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
                    if (menu !== dropdownMenu) {
                        menu.classList.remove('active');
                    }
                });
                dropdownMenu.classList.toggle('active');
            });

            likeButton.addEventListener('click', () => {
                const postId = postCard.dataset.id;
                const postIndex = posts.findIndex(p => p.id === postId);

                if (postIndex !== -1) {
                    posts[postIndex].liked = !posts[postIndex].liked;
                    if (posts[postIndex].liked) {
                        posts[postIndex].likes++;
                    } else {
                        posts[postIndex].likes--;
                    }
                    savePosts();
                    applySortAndFilter(); // Apply sort and filter after post changes
                }
            });

            editButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent dropdown from closing on button click
                editingPostId = post.id;
                editPostTextarea.value = post.text;
                editPostImageUrlInput.value = post.imageUrl;
                editPostModal.classList.add('active'); // Show modal
                dropdownMenu.classList.remove('active'); // Close dropdown after clicking edit
            });

            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent dropdown from closing on button click
                if (confirm('Are you sure you want to delete this post?')) {
                    const postId = postCard.dataset.id;
                    posts = posts.filter(p => p.id !== postId);
                    savePosts();
                    applySortAndFilter(); // Apply sort and filter after post changes
                }
                dropdownMenu.classList.remove('active'); // Close dropdown after clicking delete
            });
        });
    };

    // Close all dropdowns when clicking outside
    document.addEventListener('click', (event) => {
        document.querySelectorAll('.dropdown-menu.active').forEach(dropdown => {
            const threeDotsButton = dropdown.closest('.post-options').querySelector('.three-dots-button');
            if (!dropdown.contains(event.target) && !threeDotsButton.contains(event.target)) {
                dropdown.classList.remove('active');
            }
        });
    });

    // Initial render
    applySortAndFilter(); // Initial render with sorting and filtering

    // Search functionality
    searchInput.addEventListener('keyup', () => {
        applySortAndFilter();
    });

    // Sort and Filter functionality
    sortSelect.addEventListener('change', () => {
        applySortAndFilter();
    });

    // Handle posting new content
    postButton.addEventListener('click', () => {
        const postText = postTextInput.value.trim();
        const postImageUrl = postImageUrlInput.value.trim();

        if (!postText && !postImageUrl) {
            alert('Post content or image URL cannot be empty!');
            return;
        }

        const newPost = {
            id: Date.now().toString(), // Unique ID
            author: loggedInUser, // Assign the logged-in user as author
            authorProfilePic: loggedInUserProfilePic, // Assign the logged-in user's profile pic
            text: postText,
            imageUrl: postImageUrl,
            timestamp: new Date().toISOString(),
            likes: 0,
            liked: false
        };

        posts.unshift(newPost); // Add new post to the beginning of the array
        savePosts();
        sortSelect.value = 'latest'; // Ensure the sort order is 'latest' after new post
        applySortAndFilter(); // Apply sort and filter after post changes
        postTextInput.value = '';
        postImageUrlInput.value = '';
    });

    // Handle saving edited post
    saveEditButton.addEventListener('click', () => {
        const editedText = editPostTextarea.value.trim();
        const editedImageUrl = editPostImageUrlInput.value.trim();

        if (!editedText && !editedImageUrl) {
            alert('Edited post content or image URL cannot be empty!');
            return;
        }

        const postIndex = posts.findIndex(p => p.id === editingPostId);
        if (postIndex !== -1) {
            posts[postIndex].text = editedText;
            posts[postIndex].imageUrl = editedImageUrl;
            savePosts();
            applySortAndFilter(); // Re-render posts with updated content
        }
        editPostModal.classList.remove('active'); // Hide modal
        editingPostId = null;
    });

    // Handle canceling edit
    cancelEditButton.addEventListener('click', () => {
        editPostModal.classList.remove('active'); // Hide modal
        editingPostId = null;
    });

    // Logout functionality
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('auth_logged_in');
        window.location.href = 'features/Login/login.html';
    });
});