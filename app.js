//Selectors

const addButton = document.getElementById("addBtn");
const todoInput = document.getElementById("newTask");
const incompleteTaskList = document.getElementById("incompleteTask");
const editIcon = document.getElementsByClassName("editImage");

// execute loadtodos function after page loads

// localStorage.removeItem("todos");

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
  console.log("storage:", todos)    //ggl

  if (todos) {
    todos.forEach((todo) => {
      // addTodoToHtml(todo.name);
      addTodoToHtml(todo);
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
//  console.log(todoInput.value)
  const newTodoObj = addTodoToLocalStorage(todoInput.value);
  // addTodoToHtml(todoInput.value);
  addTodoToHtml(newTodoObj);
  // addTodoToLocalStorage(todoInput.value);
};

//add todo to html only

const addTodoToHtml = (newTodoObj) => {
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
  checkWrapper.innerHTML = `<input type="checkbox" /><label class="todo-label">${newTodoObj.name}</label>`;   //ggl

  let buttonWrapper = document.createElement("div");

  let editButton = document.createElement("button");
  editButton.className = "btn editBtn";
  editButton.innerHTML =
    '<img src="./images/edit_btn.png" alt="Edit Button" class="editImage" />';       //ggl

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
  bindTaskEvents(listItem, newTodoObj);     //ggl
};

//add todo to local storage only

const addTodoToLocalStorage = (value) => {
  
  let obj = { name: value,checked:false, id:Date.now()};

  let todos = JSON.parse(window.localStorage.getItem("todos"));

  if (todos) {
    todos.push(obj);
  } else {
    todos = [obj];
  }

  window.localStorage.setItem("todos", JSON.stringify(todos));

  return obj    //ggl
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

// BIND TASKS EVENTS        -GGL
const bindTaskEvents = (listItem, todoObj) => {
    // const checkBox = listItem.querySelector('input[type="checkbox"]');
    // const deleteButton = listItem.querySelector("deleteBtn");
    const editIcon = listItem.querySelector(".editImage");

    editIcon.onclick = () => setToEditMode(listItem, todoObj);
};

const setToEditMode = (listItem, todoObj) => {
  //const listItem = this.parentNode;
  const label = listItem.querySelector("label");
  label.setAttribute("contenteditable", "");

  label.onblur = (event) => {
    // console.log("blur called.", event);
    label.removeAttribute("contenteditable")
  
    const newValue = event.target.innerHTML
    // console.log("newVal:", newValue)
    updateItemInLocalStorage(todoObj, newValue) 
  }; 

};

const updateItemInLocalStorage = (todoObj, newValue) => {
  // read local storage into array
  todoArray = loadData()

  // find thing in array and update
  index = todoArray.findIndex(el => el.id === todoObj.id)
  todoArray[index].name = newValue

  // save the array into local storage
  saveData(todoArray)
}

// this function returns array of todos from local storage
const loadData = () =>  JSON.parse(window.localStorage.getItem("todos"))

const saveData = todoArray => {
  window.localStorage.setItem("todos", JSON.stringify(todoArray));
}