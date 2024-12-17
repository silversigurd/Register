const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Configuración de CORS más permisiva
app.use(cors({
  origin: '*', // Cambia esto a tu dominio real en producción
  methods: ['GET', 'POST']
}));

app.use(bodyParser.json());

// Resto de tu código de server.js permanece igual...

// Exportar para Vercel
module.exports = app;