document.addEventListener("DOMContentLoaded", function () {
    // Profile Dropdown
    const profile = document.getElementById('profile');
    const dropdown = document.getElementById('profileDropdown');

    if (profile && dropdown) {
        profile.addEventListener('click', function () {
            dropdown.classList.toggle('show'); // Toggle dropdown visibility
        });

        document.addEventListener('click', function (event) {
            if (!profile.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.remove('show'); // Hide dropdown if clicked outside
            }
        });
    }

    // Redirect based on login status
    const createTodoBtn = document.getElementById("createTodoBtn");

    if (createTodoBtn) {
        createTodoBtn.addEventListener("click", function (e) {
            e.preventDefault();

            const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

            if (isLoggedIn) {
                window.location.href = "todos.html";
            } else {
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1000);
            }
        });
    }

    // Update auth link based on login status
    const authLink = document.getElementById('authLink');
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (authLink) {
        if (isLoggedIn) {
            authLink.textContent = 'Logout';
            authLink.href = '#';
            authLink.addEventListener("click", () => {
                localStorage.setItem("isLoggedIn", "false");
                window.location.href = "login.html";
            });
        } else {
            authLink.textContent = 'Login';
            authLink.href = 'login.html';
        }
    }
});
