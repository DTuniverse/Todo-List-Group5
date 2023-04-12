//Selectors

const addButton = document.getElementById("addBtn");
const todoInput = document.getElementById("newTask");
const incompleteTaskList = document.getElementById("incompleteTask");
const editIcon = document.getElementsByClassName("editImage");
const doneTaskList = document.getElementById("doneTask");
const clearAllTodosButton = document.querySelector(".btn-clear");

// execute loadtodos function after page loads

clearAllTodosButton.addEventListener("click", () => {
  window.localStorage.removeItem("todos");
  loadTodos();
});

//clear all tasks from html file

const clearHtml = () => {
  incompleteTaskList.innerHTML = "";
  doneTaskList.innerHTML = "";
};

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
  // console.log("storage:", todos); //ggl

  if (todos) {
    todos.forEach((todo) => {
      // addTodoToHtml(todo.name);
      addTodoToHtml(todo);
    });
  } else {
    clearHtml();
  }
};

// eventlistener edit and delete button clicks

document.body.addEventListener("click", (event) => {
  if (event.target.closest(".deleteBtn")) {
    deleteTodo(event);
  }

  if (event.target.type === "checkbox") {
    afterCheckboxClick(event);
  }
});

//after checkbox click function

const afterCheckboxClick = (event) => {
  const targetName = event.target.nextSibling.textContent;
  let todos = loadData();
  const selectedTodo = todos.find((el) => el.name === targetName);

  Promise.all(
    event.target.parentElement
      .getAnimations({ subtree: true })
      .map((animation) => animation.finished)
  ).then(() => {
    event.target.closest(".list-item").remove();
    if (selectedTodo.checked == true) {
      addTodoToHtml({ ...selectedTodo, checked: false });
      selectedTodo.checked = false;
    } else {
      addTodoToHtml({ ...selectedTodo, checked: true });
      selectedTodo.checked = true;
    }

    saveData(todos);
  });
};

// eventlistener add todo button

addButton.addEventListener("click", () => {
  addTodo();
});

//add todo function

const addTodo = () => {
  if (todoInput.value) {
    //  console.log(todoInput.value)
    const newTodoObj = addTodoToLocalStorage(todoInput.value);
    // addTodoToHtml(todoInput.value);
    addTodoToHtml(newTodoObj);

    //empty input value after todo is added

    todoInput.value = "";
    // addTodoToLocalStorage(todoInput.value);
  }
};

//add todo to html only

const addTodoToHtml = (newTodoObj, list = "incomplete") => {
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
  checkWrapper.innerHTML = `<input type="checkbox" checked=${newTodoObj.checked} /><label class="todo-label">${newTodoObj.name}</label>`; //ggl

  let buttonWrapper = document.createElement("div");

  let editButton = document.createElement("button");
  editButton.className = "btn editBtn";
  editButton.innerHTML =
    '<img src="./images/edit_btn.png" alt="Edit Button" class="editImage" />'; //ggl

  let deleteButton = document.createElement("button");
  deleteButton.className = "btn deleteBtn";
  deleteButton.innerHTML =
    '<img src="./images/delete_btn.png" alt="Delete Button" />';

  buttonWrapper.appendChild(editButton);
  buttonWrapper.appendChild(deleteButton);

  let listItem = document.createElement("li");
  listItem.className = "list-item";
  // Attributes for drag and drop
  listItem.setAttribute("draggable", "true");
  listItem.id = newTodoObj.id;

  //
  listItem.appendChild(checkWrapper);
  listItem.appendChild(buttonWrapper);

  document
    .getElementById(`${newTodoObj.checked ? "done" : "incomplete"}Task`)
    .appendChild(listItem);
  bindTaskEvents(listItem, newTodoObj); //ggl

  listItem.addEventListener("dragstart", handleDragstart);

  newTodoObj.checked
    ? (listItem.querySelector("input").checked = true)
    : (listItem.querySelector("input").checked = false);

  // list === "incomplete"
  //   ? (newTodoObj.checked = false)
  //   : (newTodoObj.checked = true);
};

//add todo to local storage only

const addTodoToLocalStorage = (value) => {
  let obj = { name: value, checked: false, id: Date.now() };

  let todos = JSON.parse(window.localStorage.getItem("todos"));

  if (todos) {
    todos.push(obj);
  } else {
    todos = [obj];
  }

  window.localStorage.setItem("todos", JSON.stringify(todos));

  return obj; //ggl
};

// delete todo

const deleteTodo = (event) => {
  deleteTodoFromPage(event);
  deleteTodoFromLocalStorage(event);
};

//delete todo from only page function

const deleteTodoFromPage = (event) => {
  event.target.parentElement.parentElement.parentElement.remove();
  // event.target.closest(".list-item").remove();
};

//delete todo from only local storage

const deleteByTextFromLSt = (deleteTodoName) => {
  const todos = JSON.parse(window.localStorage.getItem("todos"));

  const newTodos = todos.filter((todo) => todo.name !== deleteTodoName);

  window.localStorage.setItem("todos", JSON.stringify(newTodos));
};

const deleteTodoFromLocalStorage = (event) => {
  // console.log(event.target.closest(".list-item"));
  // const deleteTodoName =
  //   event.target.parentElement.parentElement.previousSibling.childNodes[1]
  //     .textContent;
  const deleteTodoName = event.target.closest(".list-item").textContent;
  deleteByTextFromLSt(deleteTodoName);
};

// Drag'n'Drop

// Event Handlers
function handleDragstart(e) {
  e.dataTransfer.clearData();
  e.dataTransfer.setData("text/plain", e.target.id);
  setTimeout(() => {
    e.target.classList.add("hide");
  }, 0);
}

const dragenter = (event) => {
  event.preventDefault();
  event.stopPropagation();
  const listEl = event.target.closest(".todo-list");
  if (!listEl) return;
  listEl.classList.add("drag-active");
};

const dragleave = (event) => {
  event.preventDefault();
  event.stopPropagation();
  if ([...event.target.parentElement.classList].includes("todo-section"));
  event.srcElement.classList.remove("drag-active");
};

const dragover = (event) => {
  event.preventDefault();
};

const drop = (event) => {
  event.preventDefault();
  const listEl = event.target.closest(".todo-list");
  if (!listEl) return;
  listEl.classList.remove("drag-active");

  const targetList = listEl.id.split("Task")[0];
  const checked = targetList === "incomplete" ? false : true;
  const todoID = event.dataTransfer.getData("text");
  // deleteByTextFromLSt(todoText);

  let todoArray = loadData();

  // find thing in array and update
  const index = todoArray.findIndex((el) => +el.id === +todoID);
  const todoText = todoArray[index].name;
  todoArray[index].checked = checked;
  saveData(todoArray);

  const previousElementsId = addTodoToHtml(
    { name: todoText, checked: checked, id: todoID },
    targetList
  );
};

[...document.querySelectorAll(".todo-section")].forEach((list) => {
  list.addEventListener("dragenter", (e) => dragenter(e));
  list.addEventListener("dragleave", (e) => dragleave(e));
  list.addEventListener("dragover", (e) => dragover(e));
  list.addEventListener("drop", (e) => drop(e));
});

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
  label.focus();

  label.onblur = (event) => {
    // console.log("blur called.", event);
    label.removeAttribute("contenteditable");

    const newValue = event.target.innerHTML;
    // console.log("newVal:", newValue)
    updateItemInLocalStorage(todoObj, newValue);
  };
};

const updateItemInLocalStorage = (todoObj, newValue) => {
  // read local storage into array
  let todoArray = loadData();

  // find thing in array and update
  const index = todoArray.findIndex((el) => +el.id === +todoObj.id);
  todoArray[index].name = newValue;

  // save the array into local storage
  saveData(todoArray);
};

// this function returns array of todos from local storage
const loadData = () => JSON.parse(window.localStorage.getItem("todos"));

const saveData = (todoArray) => {
  window.localStorage.setItem("todos", JSON.stringify(todoArray));
};

// DANIIL

const myNameInput = document.getElementById("newNameInput");
const saveNameGroup5 = () => {
  let nameGroup5 = myNameInput.innerText;
  window.localStorage.setItem("nameGroup5", nameGroup5);
};
myNameInput.addEventListener("blur", saveNameGroup5);
if (
  localStorage.nameGroup5 != "undefined" ||
  localStorage.nameGroup5 != "null"
) {
  myNameInput.innerText = window.localStorage.nameGroup5;
} else {
  myNameInput.innerText = "my name goes here";
}
// console.dir(myNameInput.innerText);
// console.dir(localStorage.name);
