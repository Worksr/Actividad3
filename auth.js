const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Modelo de usuario ficticio, debes crear un modelo adecuado según tu base de datos
const users = [];

// Registro de usuario
router.post('/register', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send('El nombre de usuario y la contraseña son obligatorios');
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { username: req.body.username, password: hashedPassword };
        users.push(user); // En un caso real, aquí insertarías el usuario en la base de datos
        res.status(201).send('Usuario registrado');
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).send('Error al registrar el usuario');
    }
});

// Inicio de sesión y generación de token
router.post('/login', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send('El nombre de usuario y la contraseña son obligatorios');
    }

    const user = users.find(user => user.username === req.body.username);
    if (user == null) {
        return res.status(404).send('No se puede encontrar el usuario');
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({ name: user.username }, 'clave_secreta', { expiresIn: '30m' });
            res.json({ token: token });
        } else {
            res.status(401).send('Contraseña no válida');
        }
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).send('Error al procesar el inicio de sesión');
    }
});

// Middleware para autenticar token
const autenticarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Acceso denegado');
    }

    try {
        const verified = jwt.verify(token, 'clave_secreta');
        req.user = verified;
        next();
    } catch (error) {
        console.error('Token inválido:', error);
        res.status(403).send('Token inválido');
    }
};

module.exports = { router, autenticarToken };
