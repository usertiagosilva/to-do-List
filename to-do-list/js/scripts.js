// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");
let oldInputValue;

// Funções
// Função para salvar tarefas
const saveTodo = (text, done = 0, save = 1) => {

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

    // Utilizando dados da LocalStorage
    if(done) {
        todo.classList.add("done");
    }

    if(save) {
        saveTodoLocalStorage({text, done});
    }

    // Colocar to do na lista geral
    todoList.appendChild(todo);

    // Limpar valor quando terminar de digitar
    todoInput.value = "";

    // Focar no input 
    todoInput.focus();
}

// Editar tarefas
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
        let todoTitle = todo.querySelector("h3");
        // Comparar titulo atual com valor salvo na memoria
        if(todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;

            updateTodoLocalStorage(oldInputValue, text);
        }
    });
}

// Função para busca
const getSearchTodos = (search) => {
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => {
        // Normalizar a pequisa (Diferença de minusculas e maiusculas)
        let todoTitle = todo.querySelector("h3").innerText.toLocaleLowerCase();

        const normalizedSearch = search.toLowerCase();
        todo.style.display = "flex";

        // Veririficar todos os to dos que nao incluem o search
        if(!todoTitle.includes(normalizedSearch)) {
            todo.style.display = "none";
        }   
});
}

// Validar filtros 
const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");
    // Validação filtro
    switch(filterValue) {
        // todos os casos do filtro
        case "all":
            // Forçar a prorpiedade display exibir igual a flex
            todos.forEach((todo) => todo.style.display = "flex");
            break;
        
        case "done":
            // Verificar na lista de classe se a done esta presente
            todos.forEach((todo) => todo.classList.contains("done") ? todo.style.display = "flex" : todo.style.display = "none");
            break;
        
        case "todo":
        // Verificar na lista de classe se a done esta presente
         todos.forEach((todo) => 
         !todo.classList.contains("done") 
         ?(todo.style.display = "flex")
         : (todo.style.display = "none")
         );
         break;

        default:
            break;
    }
}

// Eventos
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
    // Selecionar elemento pai mais próximo
    const parentEl = targetEl.closest("div");
    let todoTitle;

    // Verificar requisitos para ter um titulo
    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    // Completar tarefa
    if (targetEl.classList.contains("finish-todo")) {        
        parentEl.classList.toggle("done");

        updateTodosStatusLocalStorage(todoTitle);
    }

    // Remover tarefa
    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();

        removeTodoLocalStorage(todoTitle);
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

// Selecionar valor do input e executar a busca
searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;
    getSearchTodos(search)
});

// Ressetar a busca
eraseBtn.addEventListener("click", (e) => {
    // Não enviar formulário
    e.preventDefault()
    // Zerar valor do search
    searchInput.value = "";
    // Simular keyup
    searchInput.dispatchEvent(new Event("keyup"));
});

// Filtrar
filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;

    filterTodos(filterValue)
});


// Local storage
// Função para pegar to do
const getTodosLocalStorage = () => {
    // converter json em objeto para pegar dados
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
};

// Função para recarregar to dos
const loadTodos = () => {
    const todos = getTodosLocalStorage();
    // 
    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0);
    });
}

const saveTodoLocalStorage = (todo) => {
    // Pegar todos os to dos da Local Storage
    const todos = getTodosLocalStorage();

    // Add o novo to do no arrey que receber da Local Storage
    todos.push(todo);

    // Salvar tudo na Local Storage
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Remover to do da LocalStorage
const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
    // Filtrar to dos para remover
    const filterTodos = todos.filter((todo) => todo.text !== todoText);

    // Salvar resultados
    localStorage.setItem("todos", JSON.stringify(filterTodos));
}

// Função para Atualizar status da local storage
const updateTodosStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
    // Verificar se o texto é igual 
    todos.map((todo) =>
     todo.text === todoText ? (todo.done = !todo.done) : null
    );

    // Salvar resultados
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Função para atualizar o edit
const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();
    // Verificar se o texto é igual 
    todos.map((todo) =>
     todo.text === todoOldText ? (todo.text = todoNewText) : null
    );

    // Salvar resultados
    localStorage.setItem("todos", JSON.stringify(todos));
}

loadTodos();
