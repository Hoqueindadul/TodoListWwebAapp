const popupForm = document.getElementById("popupForm");
const popupOverlay = document.getElementById("popupOverlay");
const createTodoButton = document.getElementById("createTodo");
const closePopupButton = document.getElementById("closePopup");
const todoForm = document.getElementById("todoForm");
const todosDiv = document.getElementById("items");

// Ensure todos are always an array
const loadTodos = () => JSON.parse(localStorage.getItem('todos')) || [];
const saveTodos = (todos) => localStorage.setItem('todos', JSON.stringify(todos));
const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");

// Show Todo Popup
if (createTodoButton) {
    createTodoButton.addEventListener('click', () => {
        popupForm.style.display = 'block';
        popupOverlay.style.display = 'block';
    });
}

// Close Todo Popup
const closePopup = () => {
    popupForm.style.display = 'none';
    popupOverlay.style.display = 'none';
};

if (closePopupButton) closePopupButton.addEventListener('click', closePopup);
if (popupOverlay) popupOverlay.addEventListener('click', closePopup);

// Toast Notifications
const showToast = (message) => {
    Toastify({
        text: message,
        duration: 1000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    }).showToast();
};

// Delete Todo
const deleteTodo = (index) => {
    const todos = loadTodos();
    const userTodos = todos.filter(todo => todo.userEmail === loggedInUserEmail);
    const todoToDelete = userTodos[index];

    if (!todoToDelete) return;

    const actualIndex = todos.findIndex(todo => todo.title === todoToDelete.title && todo.userEmail === loggedInUserEmail);
    if (actualIndex > -1) {
        todos.splice(actualIndex, 1);
        saveTodos(todos);
        showAllTodos();
        showToast("Todo deleted successfully!");
    }
};

// Display Todos
const showAllTodos = () => {
    todosDiv.innerHTML = '';
    const todos = loadTodos();
    const userTodos = todos.filter(todo => todo.userEmail === loggedInUserEmail);

    if (userTodos.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.innerText = "You have no Todos. Make your Todos.";
        todosDiv.appendChild(emptyMessage);
        return;
    }

    userTodos.forEach((todo, index) => displayTodo(todo, index));
};

// Display a Single Todo
const displayTodo = (todo, index) => {
    const todoItem = document.createElement('div');
    todoItem.className = "todo-item";
    todoItem.innerHTML = `
        <h3>${todo.title}</h3>
        <p>${todo.description}</p>
        <p>${todo.time}</p>
        <button class="deleteButton" data-index="${index}">Delete</button>
        <button class="gotoSubTaskButton" data-index="${index}">Go To Subtask</button>
    `;
    
    todosDiv.appendChild(todoItem);
    const gotoSubTaskBtn = todoItem.querySelector(".gotoSubTaskButton")
    gotoSubTaskBtn.style.padding = '6px'
    gotoSubTaskBtn.style.borderRadius = '8px'
    gotoSubTaskBtn.style.backgroundColor = 'orange'
    gotoSubTaskBtn.style.border = 'none'
    gotoSubTaskBtn.style.cursor = 'pointer'
    gotoSubTaskBtn.style.fontWeight = 'bold'
    gotoSubTaskBtn.style.marginLeft = "8rem"
    gotoSubTaskBtn.addEventListener('click', () => {
        localStorage.setItem("currentTodoTitle", todo.title); // Save todo title
        window.location.href = "subtask.html";
    });
    
    const deleteTodoBtn = todoItem.querySelector('.deleteButton')
    deleteTodoBtn.style.padding = '6px'
    deleteTodoBtn.style.borderRadius = '8px'
    deleteTodoBtn.style.backgroundColor = 'orange'
    deleteTodoBtn.style.border = 'none'
    deleteTodoBtn.style.cursor = 'pointer'
    deleteTodoBtn.style.fontWeight = 'bold'
    todoItem.querySelector('.deleteButton').addEventListener('click', () => deleteTodo(index));
};

// Add new Todo
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById('todoTitle').value;
    const description = document.getElementById('todoDescription').value;

    const now = new Date();
    const time = now.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const todos = loadTodos();
    const todo = { title, description, time, userEmail: loggedInUserEmail };

    todos.push(todo);
    saveTodos(todos);
    showAllTodos();
    showToast("Todo created successfully!");

    todoForm.reset();
    closePopup();
});

// Load Todos on Page Load
showAllTodos();