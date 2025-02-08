const fs = require('fs').promises;

// Función para leer el archivo de tareas y parsearlo a JSON
async function leerTareas() {
    try {
        const data = await fs.readFile('tareas.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error al leer el archivo:', err);
        throw err;
    }
}

// Función para escribir tareas al archivo JSON
async function escribirTareas(tareas) {
    try {
        await fs.writeFile('tareas.json', JSON.stringify(tareas, null, 2), 'utf8');
    } catch (err) {
        console.error('Error al escribir en el archivo:', err);
        throw err;
    }
}

// Función para obtener tareas existentes
async function obtenerTareas() {
    return await leerTareas();
}

// Función para guardar una nueva tarea
async function guardarTareas(tarea) {
    const tareas = await leerTareas();
    tarea.id = tareas.reduce((maxId, item) => item.id > maxId ? item.id : maxId, 0) + 1; // Asignar nuevo ID
    tareas.push(tarea);
    await escribirTareas(tareas);
    return tarea;
}

// Función para actualizar una tarea específica
async function actualizarTarea(id, datosTarea) {
    const tareas = await leerTareas();
    const index = tareas.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
        tareas[index] = { ...tareas[index], ...datosTarea };
        await escribirTareas(tareas);
    } else {
        throw new Error('Tarea no encontrada');
    }
}

// Función para eliminar una tarea específica
async function eliminarTarea(id) {
    const tareas = await leerTareas();
    const nuevasTareas = tareas.filter(t => t.id !== parseInt(id));
    if (tareas.length === nuevasTareas.length) {
        throw new Error('Tarea no encontrada');
    }
    await escribirTareas(nuevasTareas);
}

async function guardarTareas(tarea) {
    const tareas = await leerTareas();
    tarea.id = tareas.reduce((maxId, item) => item.id > maxId ? item.id : maxId, 0) + 1; // Asignar un nuevo ID
    tareas.push(tarea);
    await escribirTareas(tareas);
    return tarea;  // Devuelve la tarea completa, incluido el ID
}

module.exports = { obtenerTareas, guardarTareas, actualizarTarea, eliminarTarea };
