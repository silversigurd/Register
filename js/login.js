const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Servir archivos estáticos

// Función para validar contraseña
function validatePassword(password) {
    // Validaciones de contraseña:
    // - Al menos 8 caracteres
    // - Al menos una mayúscula
    // - Al menos un número
    // - Al menos un carácter especial
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return passwordRegex.test(password);
}

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Validaciones
    if (!username || !password) {
        return res.status(400).send('Nombre de usuario y contraseña son requeridos');
    }

    if (username.length < 3) {
        return res.status(400).send('El nombre de usuario debe tener al menos 3 caracteres');
    }

    if (!validatePassword(password)) {
        return res.status(400).send('La contraseña no cumple con los requisitos de seguridad');
    }

    try {
        // Verificar si existe el archivo, si no, crearlo
        try {
            await fs.access('usuarios.txt');
        } catch (error) {
            await fs.writeFile('usuarios.txt', '');
        }

        // Leer archivo de usuarios
        const data = await fs.readFile('usuarios.txt', 'utf8');
        const users = data.split('\n').filter(line => line.trim() !== '').map(line => line.split(';')[0]);

        // Comprobar si el usuario ya existe
        if (users.includes(username)) {
            return res.status(400).send('El usuario ya existe');
        }

        // Hashear contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Agregar nuevo usuario
        await fs.appendFile('usuarios.txt', `${username};${hashedPassword}\n`);
        
        res.status(201).send('Usuario registrado con éxito');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al registrar usuario');
    }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validaciones básicas
    if (!username || !password) {
        return res.status(400).send('Nombre de usuario y contraseña son requeridos');
    }

    try {
        // Leer archivo de usuarios
        const data = await fs.readFile('usuarios.txt', 'utf8');
        const users = data.split('\n')
            .filter(line => line.trim() !== '')
            .map(line => line.split(';'));
        
        // Buscar usuario
        const user = users.find(u => u[0] === username);

        if (user) {
            // Verificar contraseña
            const passwordMatch = await bcrypt.compare(password, user[1]);
            
            if (passwordMatch) {
                res.status(200).send('Inicio de sesión exitoso');
            } else {
                res.status(401).send('Usuario o contraseña incorrectos');
            }
        } else {
            res.status(401).send('Usuario o contraseña incorrectos');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el inicio de sesión');
    }
});

// Servir archivos HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registro.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});