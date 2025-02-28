// Profile Dropdown
document.getElementById('profile').addEventListener('click', function () {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('show'); // Toggle the 'show' class to display/hide the dropdown
});

document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('profileDropdown');
    const profile = document.getElementById('profile');

    if (!profile.contains(event.target)) {
        dropdown.classList.remove('show'); // Close dropdown if click is outside the profile area
    }
});

// Redirect based on login status
document.getElementById("createTodoBtn").addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default anchor behavior

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Check if user is logged in

    if (isLoggedIn) {
        window.location.href = "todos.html";
    } else {
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    }
});

// Update auth link based on login status
document.addEventListener('DOMContentLoaded', function () {
    const authLink = document.getElementById('authLink');
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; 

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
});