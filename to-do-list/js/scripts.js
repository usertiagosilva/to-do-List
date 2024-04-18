// ***Seleção de elementos***
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

let oldInputValue;

// ***Funções***
// Função para salvar tarefas
const saveTodo = (text) => {

    // Criação do template com as tarefas
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    // Colocar to do na lista geral
    todoList.appendChild(todo);

    // Limpar valor quando terminar de digitar
    todoInput.value = "";

    // Focar no input 
    todoInput.focus();
}

// Editar tarefas
// Esconder um formulário e mostrar outro
const toggleForms = () => {
    // Esconder um formulário e mostrar outro
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
}

// Alterar texto para edição
const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) =>{
        let todoTitle = todo.querySelector("h3")
        // Comparar titulo atual com valor salvo na memoria
        if(todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
        }
    });
}

// ***Eventos***
// Enviar formulário do input
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = todoInput.value;
    // Validação para nao enviar tarefas sem titulos
    if(inputValue) {
        saveTodo(inputValue);
    }
});

// Identificar o elemento e executar evento
document.addEventListener("click", (e) => {
    const targetEl = e.target;
    // selecionar elemento pai mais próximo
    const parentEl = targetEl.closest("div");
    let todoTitle;

    // Verificar requisitos para ter um titulo
    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    // Completar tarefa
    if (targetEl.classList.contains("finish-todo")) {        
        parentEl.classList.toggle("done");
    }

    // Remover tarefa
    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
    }

    // Editar tarefa
    if (targetEl.classList.contains("edit-todo")) {
    toggleForms()

    // Mudar valor do input
    editInput.value = todoTitle;
    // Mapear valor (Salvar na memória)
    oldInputValue = todoTitle;
    }
});

// Cancelar edição
cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms()
});

// Enviar formulario de edição
editForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const editInputValue = editInput.value
    // Se estiver vazio cancela edição
    if (editInputValue) {
        updateTodo(editInputValue)
    }

    toggleForms()
});
