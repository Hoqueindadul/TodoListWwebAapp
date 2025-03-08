const popupForm = document.getElementById("popupForm");
const popupOverlay = document.getElementById("popupOverlay");
const createTodoButton = document.getElementById("createTodo");
const closePopupButton = document.getElementById("closePopup");
const todoForm = document.getElementById("todoForm");
const todosDiv = document.getElementById("items");

const todoTitleInput = document.getElementById("todoTitle");
const todoDescriptionInput = document.getElementById("todoDescription");

let isEditing = false;
let editIndex = null;

// Ensure todos are always an array
const loadTodos = () => {
    const todos = localStorage.getItem('todos');
    try {
        return Array.isArray(JSON.parse(todos)) ? JSON.parse(todos) : [];
    } catch (error) {
        return [];
    }
};

const saveTodos = (todos) => localStorage.setItem('todos', JSON.stringify(todos));
const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");

// Show Todo Popup
if (createTodoButton) {
    createTodoButton.addEventListener('click', () => {
        isEditing = false;  // Reset editing state
        todoForm.reset();
        popupForm.style.display = 'block';
        popupOverlay.style.display = 'block';
    });
}

// Close Todo Popup
const closePopup = () => {
    popupForm.style.display = 'none';
    popupOverlay.style.display = 'none';
    isEditing = false;
    editIndex = null;
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

// Edit Todo
const editTodo = (index) => {
    const todos = loadTodos();
    const userTodos = todos.filter(todo => todo.userEmail === loggedInUserEmail);
    const todoToEdit = userTodos[index];

    if (!todoToEdit) return;

    isEditing = true;
    editIndex = index;

    todoTitleInput.value = todoToEdit.title;
    todoDescriptionInput.value = todoToEdit.description;

    popupForm.style.display = 'block';
    popupOverlay.style.display = 'block';
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
        <div class="todo-actions">
            <button class="deleteButton" data-index="${index}">Delete</button>
            <button class="editButton" data-index="${index}">Edit</button>
            <button class="gotoSubTaskButton" data-index="${index}">Go To Subtask</button>
        </div>
    `;
    
    todosDiv.appendChild(todoItem);

    const gotoSubTaskBtn = todoItem.querySelector(".gotoSubTaskButton");
    gotoSubTaskBtn.addEventListener('click', () => {
        localStorage.setItem("currentTodoTitle", todo.title);
        window.location.href = "subtask.html";
    });

    const deleteTodoBtn = todoItem.querySelector('.deleteButton');
    deleteTodoBtn.style.cssText = `
        padding: 6px;
        border-radius: 8px;
        background-color: orange;
        border: none;
        cursor: pointer;
        font-weight: bold;
    `;
    deleteTodoBtn.addEventListener('click', () => deleteTodo(index));

    const editTodoBtn = todoItem.querySelector('.editButton');
    editTodoBtn.addEventListener('click', () => editTodo(index));
};

// Add or Edit Todo
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = todoTitleInput.value.trim();
    const description = todoDescriptionInput.value.trim();

    if (!title || !description) {
        showToast("Title and description cannot be empty!");
        return;
    }

    const todos = loadTodos();

    if (isEditing && editIndex !== null) {
        // Editing existing todo
        const userTodos = todos.filter(todo => todo.userEmail === loggedInUserEmail);
        const todoToEdit = userTodos[editIndex];

        if (!todoToEdit) return;

        const actualIndex = todos.findIndex(todo => todo.title === todoToEdit.title && todo.userEmail === loggedInUserEmail);
        if (actualIndex > -1) {
            todos[actualIndex].title = title;
            todos[actualIndex].description = description;
            saveTodos(todos);
            showToast("Todo updated successfully!");
        }
    } else {
        // Adding new todo
        const now = new Date();
        const time = now.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        const todo = { title, description, time, userEmail: loggedInUserEmail };
        todos.push(todo);
        saveTodos(todos);
        showToast("Todo created successfully!");
    }

    showAllTodos();
    todoForm.reset();
    closePopup();
});

// Load Todos on Page Load
showAllTodos();
