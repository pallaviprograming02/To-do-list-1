

// Select elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearAllBtn = document.getElementById("clearAllBtn");

// Event Listeners
document.addEventListener("DOMContentLoaded", loadTasks);
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});
clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    localStorage.removeItem("tasks");
    taskList.innerHTML = "";
    updateTaskCount();
  }
});

// Functions
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") {
    // Add a subtle shake animation or visual cue for error (optional, for now alert or nothing)
    taskInput.placeholder = "Please enter a task!";
    setTimeout(() => taskInput.placeholder = "Add a new task...", 2000);
    return;
  }

  createTaskElement(text);
  saveTaskToLocal(text);
  taskInput.value = "";
  updateTaskCount();
}

function createTaskElement(text, isCompleted = false) {
  const li = document.createElement("li");
  if (isCompleted) li.classList.add("completed");

  // Custom checkbox approach for better styling
  const checkbox = document.createElement("div");
  checkbox.classList.add("custom-checkbox");
  checkbox.addEventListener("click", () => toggleComplete(li, text));

  const span = document.createElement("span");
  span.textContent = text;
  span.addEventListener("click", () => toggleComplete(li, text));

  const startDiv = document.createElement("div");
  startDiv.style.display = "flex";
  startDiv.style.alignItems = "center";
  startDiv.style.flexGrow = "1";
  startDiv.appendChild(checkbox);
  startDiv.appendChild(span);

  const delBtn = document.createElement("button");
  delBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  delBtn.classList.add("delete-btn");
  delBtn.addEventListener("click", () => deleteTask(li, text));

  li.appendChild(startDiv);
  li.appendChild(delBtn);

  taskList.prepend(li); // Add new tasks to the top
}

function toggleComplete(li, text) {
  li.classList.toggle("completed");
  updateLocalTaskStatus(text);
}

function deleteTask(li, text) {
  li.style.animation = "fadeOut 0.3s ease forwards";
  li.addEventListener("animationend", () => {
    li.remove();
    removeTaskFromLocal(text);
    updateTaskCount();
  });
}

function updateTaskCount() {
  const count = taskList.children.length;
  taskCount.textContent = `${count} task${count !== 1 ? 's' : ''} left`;
}

// Local Storage Logic
function saveTaskToLocal(text) {
  let tasks = getTasksFromLocal();
  tasks.push({ text: text, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasksFromLocal() {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  return tasks;
}

function loadTasks() {
  let tasks = getTasksFromLocal();
  tasks.forEach(task => {
    createTaskElement(task.text, task.completed);
  });
  updateTaskCount();
}

function removeTaskFromLocal(text) {
  let tasks = getTasksFromLocal();
  // Filter out the task. Note: this might delete duplicates if text is same. 
  // For a simple todo, this is acceptable, but using IDs is better in production.
  const index = tasks.findIndex(task => task.text === text);
  if (index > -1) {
    tasks.splice(index, 1);
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateLocalTaskStatus(text) {
  let tasks = getTasksFromLocal();
  const index = tasks.findIndex(task => task.text === text);
  if (index > -1) {
    tasks[index].completed = !tasks[index].completed;
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add CSS keyframe for fadeOut via JS if not in CSS
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes fadeOut {
    to { opacity: 0; transform: translateX(20px); }
}`;
document.head.appendChild(styleSheet);

