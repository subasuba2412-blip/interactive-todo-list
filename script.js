
const form = document.getElementById("form");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const count = document.getElementById("count");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = load();
let currentFilter = "all";

// Load tasks safely from LocalStorage
function load() {
    try {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    } catch (error) {
        console.error("Unable to load saved tasks:", error);
        return [];
    }
}

// Save tasks
function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks based on selected filter
function render() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.done;
        if (currentFilter === "done") return task.done;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.dataset.id = task.id;
        li.className = task.done ? "completed" : "";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.dataset.action = "toggle";
        checkbox.setAttribute("aria-label", "Mark task completed");

        const label = document.createElement("span");
        label.textContent = task.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.action = "delete";

        li.append(checkbox, label, deleteBtn);
        taskList.appendChild(li);
    });

    const remaining = tasks.filter(task => !task.done).length;

    totalTasks.textContent = `Total: ${tasks.length}`;
    count.textContent = `${remaining} left`;
}

// Add new task
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        done: false
    });

    taskInput.value = "";
    save();
    render();
    taskInput.focus();
});

// Event delegation for complete and delete
taskList.addEventListener("click", function(event) {
    const action = event.target.dataset.action;

    if (!action) return;

    const li = event.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);

    if (action === "toggle") {
        tasks.forEach(task => {
            if (task.id === id) {
                task.done = event.target.checked;
            }
        });
    }

    if (action === "delete") {
        tasks = tasks.filter(task => task.id !== id);
    }

    save();
    render();
});

// Filter buttons
filterButtons.forEach(button => {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        render();
    });
});

// Clear completed tasks
clearCompletedBtn.addEventListener("click", function() {
    const completedCount = tasks.filter(task => task.done).length;

    if (completedCount === 0) {
        alert("No completed tasks to clear!");
        return;
    }

    if (confirm("Clear all completed tasks?")) {
        tasks = tasks.filter(task => !task.done);
        save();
        render();
    }
});

// Initial display
render();
