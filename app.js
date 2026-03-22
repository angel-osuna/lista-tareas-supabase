// 1. Inicializar Supabase (Reemplaza con tus datos)
const SUPABASE_URL = 'https://xafcfbxlyuifjijskcxi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZmNmYnhseXVpZmppanNrY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTgwOTgsImV4cCI6MjA4OTc5NDA5OH0.9Yw3rdJYln6LHIbp_9O3UUF9f25WHOfc335lNqaAWmA';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Referencias del DOM
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const todoList = document.getElementById('todo-list');

// 3. Obtener y mostrar las tareas (READ)
async function fetchTodos() {
    const { data, error } = await supabase
        .from('tareas')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error al cargar:', error);
        return;
    }

    todoList.innerHTML = ''; // Limpiar lista
    
    if (data.length === 0) {
        todoList.innerHTML = '<li class="text-center text-gray-500 text-sm">No hay tareas pendientes.</li>';
        return;
    }

    data.forEach(tarea => {
        const li = document.createElement('li');
        li.className = `flex justify-between items-center p-3 border rounded-lg ${tarea.completada ? 'bg-green-50' : 'bg-gray-50'}`;
        
        li.innerHTML = `
            <div class="flex items-center gap-3">
                <input type="checkbox" ${tarea.completada ? 'checked' : ''} 
                       onchange="toggleTodo(${tarea.id}, ${tarea.completada})"
                       class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer">
                <span class="${tarea.completada ? 'line-through text-gray-400' : 'text-gray-700'}">
                    ${tarea.texto_tarea}
                </span>
            </div>
            <button onclick="deleteTodo(${tarea.id})" 
                    class="text-red-500 hover:text-red-700 font-bold px-2">
                ✕
            </button>
        `;
        todoList.appendChild(li);
    });
}

// 4. Agregar una tarea (CREATE)
todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const texto = taskInput.value;

    const { error } = await supabase
        .from('tareas')
        .insert([{ texto_tarea: texto }]);

    if (!error) {
        taskInput.value = ''; // Limpiar input
        fetchTodos(); // Recargar lista
    } else {
        console.error('Error al agregar:', error);
    }
});

// 5. Marcar como completada/pendiente (UPDATE)
async function toggleTodo(id, estadoActual) {
    const { error } = await supabase
        .from('tareas')
        .update({ completada: !estadoActual })
        .eq('id', id);

    if (!error) fetchTodos();
}

// 6. Eliminar una tarea (DELETE)
async function deleteTodo(id) {
    const { error } = await supabase
        .from('tareas')
        .delete()
        .eq('id', id);

    if (!error) fetchTodos();
}

// Cargar las tareas al iniciar la app
fetchTodos();