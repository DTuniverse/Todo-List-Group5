//Selectors

const addButton = document.getElementById("addBtn");
const todoInput = document.getElementById("newTask");
const incompleteTaskList = document.getElementById("incompleteTask");
const editIcon = document.getElementsByClassName("editImage");
let todoArray = [];
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
  console.log(todos)

  if (todos) {
    todos.forEach((todo) => {
      todoArray.push(newTodoItem(todo.name))
      addTodoToHtml(todo.name);
      console.log("todoArray:", todoArray)
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
  console.log("add section:", todoInput)
//  console.log(todoInput.value)
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
    '<img src="./images/edit_btn.png" alt="Edit Button" class="editImage" />';

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
  bindTaskEvents(listItem);


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

  // Store my Todo List in an Array
  
  // const todoItem = {
  //   value,
  //   checked: false,
  //   id: Date.now(),
  // };

  todoArray.push(newTodoItem(value));
  console.log(todoArray);
};

// this function returns a new todo item object
function newTodoItem(name) {
  return {
    name: name,
    checked: false,
    id: Date.now(),
  };
}


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

// EVENT LISTENER WHEN EDIT BUTTON IS CLICKED
// editIcon.addEventListener("click", event => {
//   console.log("Edit button clicked:", editIcon);
// });

const bindTaskEvents = (listItem) => {
  console.log("li:", listItem);
    const checkBox = listItem.querySelector('input[type="checkbox"]');
    const editIcon = listItem.querySelector(".editImage");
    console.log("edit button:", editIcon);
    const deleteButton = listItem.querySelector("deleteBtn");
    editIcon.onclick = () => setToEditMode(listItem);

 //   checkBox.onchange = checkBoxEventHandler;
};

const setToEditMode = (listItem) => {
  //const listItem = this.parentNode;
  // const editInput = listItem.querySelector("input[type=text]");
  let label = listItem.querySelector("label");
  label.setAttribute("contenteditable", "");
  console.log("editTask ran.", label);

  label.onblur = () => {
    console.log("blur called.");
    label.removeAttribute("contenteditable")
  }; 




  // let containsClass = listItem.classList.contains("editMode");

  // if (containsClass) {
  //     label.innerText = editInput.value;
  // } else {
  //     editInput.value = label.innerText;
  // }

  // listItem.classList.toggle("editMode");

};