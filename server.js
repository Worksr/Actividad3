const express = require('express');
const app = express();
const PORT = 3000;

// Importaciones de handlers y middleware de autenticación
const { obtenerTareas, guardarTareas, actualizarTarea, eliminarTarea } = require('./tareasHandler');
const { router: authRouter, autenticarToken } = require('./auth');


// Middleware para parsear el cuerpo de las solicitudes a JSON
app.use(express.json());

// Router para manejar la autenticación
app.use(authRouter);

// Rutas para manejar tareas con autenticación aplicada a las rutas que necesitan protección
app.get('/tareas', autenticarToken, async (req, res, next) => {
    try {
        const tareas = await obtenerTareas();
        res.json(tareas);
    } catch (err) {
        next(err);  // Pasar el error al middleware de manejo de errores
    }
});

app.post('/tareas', autenticarToken, async (req, res, next) => {
    try {
        const nuevaTarea = req.body;
        await guardarTareas(nuevaTarea);
        res.status(201).send('Tarea creada');
    } catch (err) {
        next(err);  // Pasar el error al middleware de manejo de errores
    }
});

app.put('/tareas/:id', autenticarToken, async (req, res, next) => {
    const id = req.params.id;
    const datosTarea = req.body;
    try {
        await actualizarTarea(id, datosTarea);
        res.status(200).send(`Tarea ${id} actualizada`);
    } catch (err) {
        next(err);  // Pasar el error al middleware de manejo de errores
    }
});

app.delete('/tareas/:id', autenticarToken, async (req, res, next) => {
    const id = req.params.id;
    try {
        await eliminarTarea(id);
        res.status(200).send(`Tarea ${id} eliminada`);
    } catch (err) {
        next(err);  // Pasar el error al middleware de manejo de errores
    }
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack); // Imprimir la pila de errores en la consola
    res.status(500).send('Error en el servidor'); // Enviar respuesta de error
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
