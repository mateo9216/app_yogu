const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const config = require('./config');
const error = require('./red/errors');

const auth = require('./modules/auth/rutas');
// const billing = require('./modules/billing/rutas');
// const cereal = require('./modules/cereal/rutas');
// const fruits = require('./modules/fruits/rutas');
// const ice_cream = require('./modules/ice_cream/rutas');
const milk = require('./modules/milk/rutas');
// const order = require('./modules/order/rutas');
// const stock = require('./modules/stock/rutas');
// const type = require('./modules/type/rutas');
// const yogur = require('./modules/yogur/rutas');
const usuarios = require('./modules/usuarios/rutas');
const clientes = require('./modules/clientes/rutas');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración
app.set('port', config.app.port);

app.use(cors({
    origin: 'http://localhost:4200'
  }));

// Rutas
app.use('/api/auth', auth);
// app.use('/api/billing', billing);
// app.use('/api/cereal', cereal);
// app.use('/api/fruits', fruits);
// app.use('/api/ice_cream', ice_cream);
app.use('/api/milk', milk);
// app.use('/api/order', order);
// app.use('/api/stock', stock);
// app.use('/api/type', type);
// app.use('/api/yogur', yogur);
app.use('/api/clientes', clientes);
app.use('/api/usuarios', usuarios);

// Middleware de manejo de errores
app.use(error);

module.exports = app;
