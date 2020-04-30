(function(window){
    const doc = window.document;
    const input = doc.getElementById('new-task');
    const addButton = doc.getElementById('add-task');
    const todoList = doc.getElementById('todo-list')
    let initialTasks = []
    fetch('/todo/tasks').then(res => res.json()).then(tasks => initialTasks = tasks).then(()=> renderTasks(initialTasks))
    const renderTasks = ()=>{
        let taskItemsHtml = ''
        initialTasks.forEach((taks)=>{
            taskItemsHtml+= addTodoToList(taks)
        })
        todoList.innerHTML=taskItemsHtml;
    }
    const addTodoToList = ({id, text, completed})=>{

        return `
        <li class="todo list item ${completed ? 'completed' : ''}">
            <div>
                <label>
                    <input type="checkbox" value="${id}" ${completed?'checked': ''}/>
                    <span>${text}</span>
                </label>
            </div>
        </li>`; 
    }
    const api = {
        create :  (todo) => {
            return window.fetch('/todo/tasks/create', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: todo,
                    completed: false
                })
            }).then((res)=> res.json())
        },
        update: (id)=>{
            console.log(initialTasks)
            const theTask = initialTasks.find( t => t.id === parseInt(id));
            console.log(theTask)
            return window.fetch(`/todo/tasks/${id}/edit`, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    completed: !theTask.completed
                })
            }).then((res)=> res.json())
        }
    }
    addButton.onclick = function addTodo(e){
        e.preventDefault();
        const todo = input.value;
        api.create(todo).then((newTask)=> { 
            initialTasks.push(newTask);
            renderTasks(initialTasks);
        })
    }
    input.addEventListener('keydown',(e)=>{
        if(e.keyCode === 13){
            addTodoToList();
        }
    })

    todoList.addEventListener('click', (e)=>{
        api.update(e.target.value);
    })

})(window);