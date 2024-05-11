"use strict";
//
let userApiKey;
let loader = document.getElementById("loader");
let tasksContent = document.getElementById("tasksContent");
let addBtn = document.getElementById("addBtn");
let taskInput = document.getElementById("taskInput");
let tasksStats = document.getElementById("tasksStats");
// let todosList = [];

getUserApiKey()
  .then(() => {
    return getTodos(); // Return the promise returned by getTodos() to chain the next .then()
  })
//   .then(() => {
//     displayStats2(); // This will be executed only after getTodos() resolves
// });

//
async function getUserApiKey() {
  try {
    userApiKey = localStorage.getItem("userApiKey");
    if (userApiKey !== null) {
      return;
    }
    const apiKey = await fetchApiKey();
    localStorage.setItem("userApiKey", apiKey);
    return;
  } catch (error) {
    console.error("Error fetching API key:", error);
    throw error;
  }
}

async function fetchApiKey() {
  try {
    loader.classList.remove("hidden");
    const response = await fetch(
      "https://todos.routemisr.com/api/v1/getApiKey"
    );
    const data = await response.json();
    if (!response.ok || data.message !== "success") {
      throw new Error("Failed to fetch API key");
    }
    return data.apiKey;
  } catch (error) {
    throw error;
  } finally {
    loader.classList.add("hidden");
  }
}

//
async function getTodos() {
  try {
    loader.classList.remove("hidden");
    const response = await fetch(
      `https://todos.routemisr.com/api/v1/todos/${userApiKey}`
    );
    const data = await response.json();
    if (!response.ok || data.message !== "success") {
      throw new Error("Failed to fetch API key");
    }
    displayStats(data.todos);
    // todosList = [...data.todos]
    displayTodos(data.todos);
  } catch (error) {
    throw error;
  } finally {
    loader.classList.add("hidden");
  }
}

function displayTodos(data) {
  let dataContainer = "";
  if (data && data.length) {
    for (let i = 0; i < data.length; i++) {
      dataContainer += `
        <div class="task-box ${data[i].completed ? "completed" : ""}">
        <p>${data[i].title}</p>
        <div>
            <button class="delBtn" onclick="deleteTodo('${
              data[i]._id
            }')">Delete</button>
            <button class="doneBtn" onclick="completeTodo('${
              data[i]._id
            }')">Done</button>
        </div>
        </div>        
    `;
    }
  } else {
    dataContainer = `
    <div class="no-tasks-msg">No Tasks Added</div>
    `;
  }
  tasksContent.innerHTML = dataContainer;
}

//
async function addTodo(title) {
  try {
    loader.classList.remove("hidden");
    let bodyData = {
      title: title,
      apiKey: userApiKey,
    };
    let option = {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(bodyData),
    };
    const response = await fetch(
      `https://todos.routemisr.com/api/v1/todos`,
      option
    );
    const data = await response.json();
    if (!response.ok || data.message !== "success") {
      throw new Error("Failed to fetch API key");
    }
    taskInput.value = "";
    getTodos();
  } catch (error) {
    throw error;
  } finally {
    loader.classList.add("hidden");
  }
}

addBtn.addEventListener("click", () => {
  if (taskInput.value) {
    addTodo(taskInput.value);
  }
});

//
async function deleteTodo(todoId) {
  try {
    loader.classList.remove("hidden");
    let bodyData = {
      todoId,
    };
    let option = {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(bodyData),
    };
    const response = await fetch(
      `https://todos.routemisr.com/api/v1/todos`,
      option
    );
    const data = await response.json();
    if (!response.ok || data.message !== "success") {
      throw new Error("Failed to fetch API key");
    }
    getTodos();
  } catch (error) {
    throw error;
  } finally {
    loader.classList.add("hidden");
  }
}

//
async function completeTodo(todoId) {
  try {
    loader.classList.remove("hidden");
    let bodyData = {
      todoId,
    };
    let option = {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(bodyData),
    };
    const response = await fetch(
      `https://todos.routemisr.com/api/v1/todos`,
      option
    );
    const data = await response.json();
    if (!response.ok || data.message !== "success") {
      throw new Error("Failed to fetch API key");
    }
    getTodos();
  } catch (error) {
    throw error;
  } finally {
    loader.classList.add("hidden");
  }
}

//
function displayStats(data) {
  tasksStats.innerHTML = `
    <div class="tasks-count">Tasks <span>${data.length}</span></div>
    <div class="completed-tasks-count">Completed <span>${data.filter(e=>e.completed).length}</span></div>
    `;
}

// function displayStats2() {
//     tasksStats.innerHTML = `
//       <div class="tasks-count">Tasks <span>${todosList.length}</span></div>
//       <div class="completed-tasks-count">Completed <span>${todosList.filter(e=>e.completed).length}</span></div>
//       `;
// }