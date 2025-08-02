let todos = [];
let currentTheme = 'minimal';

function addTodo() {
    const input = document.getElementById('todoInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const text = input.value.trim();
    
    if (text === '') return;
    
    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        dueDate: dueDateInput.value || null
    };
    
    todos.push(todo);
    input.value = '';
    dueDateInput.value = '';
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    renderTodos();
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    const itemCount = document.getElementById('itemCount');
    
    todoList.innerHTML = todos.map(todo => {
        let dueDateDisplay = '';
        if (todo.dueDate) {
            const dueDate = new Date(todo.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            dueDate.setHours(0, 0, 0, 0);
            
            const isOverdue = dueDate < today && !todo.completed;
            const isToday = dueDate.getTime() === today.getTime();
            const isTomorrow = dueDate.getTime() === today.getTime() + 86400000;
            
            let dateText = dueDate.toLocaleDateString();
            if (isToday) dateText = 'Today';
            else if (isTomorrow) dateText = 'Tomorrow';
            
            dueDateDisplay = `<span class="due-date ${isOverdue ? 'overdue' : ''}">${dateText}</span>`;
        }
        
        return `
            <li class="${todo.completed ? 'completed' : ''}">
                <input type="checkbox" 
                       ${todo.completed ? 'checked' : ''} 
                       onchange="toggleTodo(${todo.id})">
                <span>${todo.text}</span>
                ${dueDateDisplay}
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">×</button>
            </li>
        `;
    }).join('');
    
    const activeCount = todos.filter(todo => !todo.completed).length;
    itemCount.textContent = `${activeCount} ${activeCount === 1 ? 'item' : 'items'} left`;
}

function switchTheme(theme) {
    currentTheme = theme;
    document.body.className = `theme-${theme}`;
    
    const buttons = document.querySelectorAll('.theme-switcher button');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(theme) || 
            (theme === 'dark' && btn.textContent === 'Dark Mode') ||
            (theme === 'minimal' && btn.textContent === 'Minimal')) {
            btn.classList.add('active');
        }
    });
}

document.getElementById('todoInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

switchTheme('minimal');
renderTodos();