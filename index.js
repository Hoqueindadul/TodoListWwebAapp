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

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Check if stored value is "true"

    if (isLoggedIn) {
        window.location.href = "todos.html";
    } else {
        setTimeout(() => {
        window.location.href = "login.html"
    }, 1000)
    }
});

// Logout functionality
document.getElementById("logout").addEventListener("click", () => {
    localStorage.setItem("isLoggedIn", "false"); // Correctly update localStorage
    window.location.href = "login.html"; // Redirect after logout
});