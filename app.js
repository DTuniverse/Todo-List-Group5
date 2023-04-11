//Selectors

const addButton = document.getElementById("addBtn");
const todoInput = document.getElementById("newTask");
const incompleteTaskList = document.getElementById("incompleteTask");

// execute loadtodos function after page loads

document.addEventListener(
  "DOMContentLoaded",
  function () {
    
    loadTodos();
  },
  false
);

// functions that loads all todos from storage to page

const loadTodos = () => {
  let todos = JSON.parse(window.localStorage.getItem("todos"));

  if (todos) {
    todos.forEach((todo) => {
      addTodoToHtml(todo.name);
    });
  }
};

// eventlistener edit and delete button clicks

document.body.addEventListener("click", (event) => {
  
  if (
    event.target.closest(".deleteBtn")
  ) {
    deleteTodo(event);
  }
});

// eventlistener add todo button

addButton.addEventListener("click", () => {
  addTodo();
});

//add todo function

const addTodo = () => {
  // console.log(todoInput.value)
  addTodoToHtml(todoInput.value);
  addTodoToLocalStorage(todoInput.value);
};

//add todo to html only

const addTodoToHtml = (value) => {
  //   <li class="list-item">
  //     <div class="check-wrapper">
  //       <input type="checkbox" />
  //       <label class="todo-label">Renovate the nursery room</label>
  //     </div>
  //     <div>
  //       <button class="btn editBtn">
  //         <img src="./images/edit_btn.png" alt="Edit Button" />
  //       </button>
  //       <button class="btn deleteBtn">
  //         <img src="./images/delete_btn.png" alt="Delete Button" />
  //       </button>
  //     </div>
  //   </li>;

  let checkWrapper = document.createElement("div");
  checkWrapper.className = "check-wrapper";
  checkWrapper.innerHTML = `<input type="checkbox" /><label class="todo-label">${value}</label>`;

  let buttonWrapper = document.createElement("div");

  let editButton = document.createElement("button");
  editButton.className = "btn editBtn";
  editButton.innerHTML =
    '<img src="./images/edit_btn.png" alt="Edit Button" />';

  let deleteButton = document.createElement("button");
  deleteButton.className = "btn deleteBtn";
  deleteButton.innerHTML =
    '<img src="./images/delete_btn.png" alt="Delete Button" />';

  buttonWrapper.appendChild(editButton);
  buttonWrapper.appendChild(deleteButton);
  

  let listItem = document.createElement("li");
  listItem.className = "list-item";
  listItem.appendChild(checkWrapper);
  listItem.appendChild(buttonWrapper);

  incompleteTaskList.appendChild(listItem);
};

//add todo to local storage only

const addTodoToLocalStorage = (value) => {
  
  let obj = { name: value,checked:false};

  let todos = JSON.parse(window.localStorage.getItem("todos"));

  if (todos) {
    todos.push(obj);
  } else {
    todos = [obj];
  }

  window.localStorage.setItem("todos", JSON.stringify(todos));
};

// delete todo

const deleteTodo = (event) => {
  // deleteTodoFromPage(event);
  deleteTodoFromLocalStorage(event);
};

//delete todo from only page function

const deleteTodoFromPage = (event) => {

  event.target.parentElement.parentElement.parentElement.remove()

};

//delete todo from only local storage

const deleteTodoFromLocalStorage = (event) => {

  const deleteTodoName =
    event.target.parentElement.parentElement.previousSibling.childNodes[1].textContent

  const todos = JSON.parse(window.localStorage.getItem("todos"));

  const newTodos = todos.filter((todo) => todo.name !== deleteTodoName);

  window.localStorage.setItem("todos", JSON.stringify(newTodos));
};
