# Proyecto Yogu

## Descripción

Yogu es una API diseñada para gestionar productos lácteos, usuarios y clientes. Esta API está construida con Node.js y MySQL, utilizando Docker para la contenedorización. La aplicación permite realizar operaciones CRUD sobre productos lácteos, usuarios y clientes, y proporciona autenticación basada en JWT para asegurar el acceso.

## Índice

1. [Requisitos](#requisitos)
2. [Configuración del Proyecto](#configuración-del-proyecto)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Docker](#docker)
5. [Configuración de Express](#configuración-de-express)
6. [Autenticación](#autenticación)
7. [Base de Datos](#base-de-datos)
8. [Pruebas con Postman](#pruebas-con-postman)
9. [Contribución](#contribución)

## Requisitos

Antes de comenzar, asegúrate de tener instalados los siguientes programas en tu máquina:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [MySQL](https://www.mysql.com/)
- [Docker](https://www.docker.com/)
- [Postman](https://www.postman.com/)

## Configuración del Proyecto

1. **Clona el Repositorio:**

   ```bash
   git clone https://github.com/mateo9216/app_yogu.git

2. **Navega al Directorio del Proyecto:**

    ```bash
    cd app_yogu


3. **Instala las Dependencias:**

    ```bash
    npm install

4. **Configura el Entorno:**

Crea un archivo .env en la raíz del proyecto con el siguiente contenido:

    PORT=3000

    MYSQL_HOST=mysql_db
    MYSQL_USER=root
    MYSQL_PASSWORD=yogu
    MYSQL_DB=yogu_datadb

5. **Construye y Corre los Contenedores Docker:**

    docker-compose up --build


## Estructura del Proyecto

    .
    ├── Dockerfile
    ├── docker-compose.yaml
    ├── estructura_proyecto.txt
    ├── package-lock.json
    ├── package.json
    └── src
        ├── app.js
        ├── autenticacion
        │   └── index.js
        ├── config.js
        ├── db
        │   └── mysql.js
        ├── index.js
        ├── middleware
        │   └── error.js
        ├── modules
        │   ├── auth
        │   │   ├── controlador.js
        │   │   ├── index.js
        │   │   └── rutas.js
        │   ├── clientes
        │   │   ├── controlador.js
        │   │   ├── index.js
        │   │   └── rutas.js
        │   ├── milk
        │   │   ├── controlador.js
        │   │   ├── index.js
        │   │   └── rutas.js
        │   └── usuarios
        │       ├── controlador.js
        │       ├── index.js
        │       ├── rutas.js
        │       └── seguridad.js
        └── red
            ├── errors.js
            └── respuestas.js
## Docker
**Dockerfile**

    
    # Usa una imagen oficial de Node.js como imagen base
    FROM node:18

    # Establece el directorio de trabajo en el contenedor
    WORKDIR /app

    # Copia el package.json y package-lock.json para instalar dependencias
    COPY package*.json ./

    # Instala las dependencias de la aplicación
    RUN npm install

    # Copia el resto del código de la aplicación al contenedor
    COPY . .

    # Expone el puerto en el que la aplicación estará escuchando
    EXPOSE 3000

    # Comando para iniciar la aplicación
    CMD ["npm", "run", "dev"]


**docker-compose.yaml**

    
    version: '3.8'  # Especifica la versión de Docker Compose que se está utilizando.

    services:  # Define los servicios que forman parte de la aplicación.

    app:  # Servicio para la aplicación Node.js.
        build: .  # Construye la imagen a partir del Dockerfile ubicado en el directorio actual.
        depends_on:  # Asegura que el servicio 'mysql_db' se inicie antes que 'app'.
        - mysql_db
        links:  # Establece un enlace de red entre 'app' y 'mysql_db', permitiendo que 'app' acceda a 'mysql_db' utilizando su nombre como hostname.
        - mysql_db
        ports:  # Mapea el puerto 3000 del contenedor al puerto 3000 de la máquina host, permitiendo el acceso a la aplicación desde fuera del contenedor.
        - "3000:3000"

    mysql_db:  # Servicio para la base de datos MySQL.
        image: mysql  # Utiliza la imagen oficial de MySQL.
        restart: always  # Configura el contenedor para que siempre se reinicie si se detiene, ya sea por error o actualización.
        environment:  # Define variables de entorno para configurar MySQL.
        MYSQL_ROOT_PASSWORD: yogu  # Establece la contraseña para el usuario root de MySQL.
        MYSQL_DATABASE: yogu_datadb  # Crea una base de datos llamada 'yogu_datadb'.
        ports:  # Mapea el puerto 3306 del contenedor al puerto 3306 de la máquina host, permitiendo el acceso a MySQL desde fuera del contenedor.
        - "3306:3306"
        volumes:  # Monta un volumen persistente para almacenar los datos de la base de datos.
        - db_data:/var/lib/mysql  # 'db_data' es el nombre del volumen, y '/var/lib/mysql' es la ubicación dentro del contenedor donde se almacenan los datos.

    volumes:  # Define los volúmenes utilizados por los servicios.
    db_data:  # Crea un volumen llamado 'db_data' para persistir los datos de MySQL, evitando que se pierdan cuando el contenedor se reinicie o elimine.


## Configuración de Express

**Archivo src/app.js:**

    
    const express = require('express');
    const morgan = require('morgan');

    const config = require('./config');
    const error = require('./red/errors');

    const auth = require('./modules/auth/rutas');
    const milk = require('./modules/milk/rutas');
    const usuarios = require('./modules/usuarios/rutas');
    const clientes = require('./modules/clientes/rutas');

    const app = express();

    // Middleware
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Configuración
    app.set('port', config.app.port);

    // Rutas
    app.use('/api/auth', auth);
    app.use('/api/milk', milk);
    app.use('/api/clientes', clientes);
    app.use('/api/usuarios', usuarios);

    // Middleware de manejo de errores
    app.use(error);

    module.exports = app;

## Autenticación

**Archivo src/autenticacion/index.js:**


    const jws = require('jsonwebtoken');
    const config = require('../config');
    const error = require('../middleware/error');

    const secret = config.jwt.secret;

    function asignarToken(data) {
        return jws.sign(data, secret);
    }

    function verificarToken(token) {
        return jws.verify(token, secret);
    }

    const chekToken = {
        confirmarToken: function(req) {
            const decodificado = decodificarCabecera(req);

            if (decodificado.id !== req.body.id) {
                throw error('No tienes privilegios para esto', 401);
            }
        }
    };

    function obtenerToken(autorizacion) {
        if (!autorizacion) {
            throw error('No viene token', 401);
        }

        if (autorizacion.indexOf('Bearer') === -1) {
            throw error('Formato inválido', 401);
        }

        return autorizacion.replace('Bearer ', '');
    }

    function decodificarCabecera(req) {
        const autorizacion = req.headers.authorization || '';
        const token = obtenerToken(autorizacion);
        const decodificado = verificarToken(token);

        req.user = decodificado;

        return decodificado;
    }

    module.exports = {
        asignarToken,
        chekToken
    };

**Descripción del Módulo de Autenticación:**

- Función asignarToken(data): Genera un token JWT para el usuario.
- Función verificarToken(token): Verifica la validez del token JWT.
- Función chekToken.confirmarToken(req): Confirma que el token es válido y el usuario tiene los permisos adecuados.
- Función obtenerToken(autorizacion): Extrae el token del encabezado de autorización.
- Función decodificarCabecera(req): Decodifica y valida el token JWT y lo agrega al objeto req.

## Base de Datos

**Archivo src/db/mysql.js:**


    const mysql = require('mysql2/promise');
    const config = require('../config');

    const configDb = {
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };

    let pool;

    async function connectMySQL() {
        try {
            pool = await mysql.createPool(configDb);
            console.log("Database connected 🔌");
        } catch (error) {
            console.error('Error connecting to database:', error.message);
            throw error;
        }
    }

    connectMySQL();

    async function todos(tablas) {
        try {
            const [rows] = await pool.query(`SELECT * FROM ${tablas}`);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async function individual(tablas, id) {
        try {
            const [rows] = await pool.query(`SELECT * FROM ${tablas} WHERE id = ?`, [id]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async function agregar(tabla, data) {
        try {
            let result;
            if (data.id) {
                result = await pool.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [data, data.id]);
                if (result[0].affectedRows === 0) {
                    result = await pool.query(`INSERT INTO ${tabla} SET ?`, [data]);
                }
            } else {
                result = await pool.query(`INSERT INTO ${tabla} SET ?`, [data]);
            }
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    async function eliminar(tablas, body) {
        try {
            const [result] = await pool.query(`DELETE FROM ${tablas} WHERE id = ?`, [body.id]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async function actualizar(tablas, data) {
        try {
            const [result] = await pool.query(`UPDATE ${tablas} SET ? WHERE id = ?`, [data, data.id]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async function query(tablas, consulta) {
        try {
            const [result] = await pool.query(`SELECT * FROM ${tablas} WHERE ?`, consulta);
            return result;
        } catch (error) {
            throw error;
        }
    }

    module.exports = {
        connectMySQL,
        todos,
        individual,
        eliminar,
        agregar,
        actualizar,
        query,
        configDb
    };


**Descripción del Módulo de Base de Datos:**

- Función connectMySQL(): Conecta a la base de datos MySQL utilizando un pool de conexiones.
- Función todos(tablas): Obtiene todos los registros de una tabla específica.
- Función individual(tablas, id): Obtiene un registro específico por ID de una tabla.
- Función agregar(tabla, data): Inserta o actualiza un registro en una tabla.
- Función eliminar(tablas, body): Elimina un registro específico por ID de una tabla.
- Función actualizar(tablas, data): Actualiza un registro específico en una tabla.
- Función query(tablas, consulta): Realiza una consulta personalizada en una tabla.


## Pruebas con Postman

Para probar la API con Postman, sigue estos pasos:

1. Inicia la Aplicación:

Asegúrate de que la aplicación está corriendo utilizando Docker.

    docker-compose up

2. Configura las Solicitudes en Postman:

**Obtener Todos los Registros:**

- Método: GET
- URL: http://localhost:3000/api/milk (para el recurso de leche)
- Headers: No se requieren headers adicionales.
- Body: No se requiere.

**Obtener un Registro Específico:**

- Método: GET
- URL: http://localhost:3000/api/milk/{id}
- Headers: No se requieren headers adicionales.
- Body: No se requiere.

**Agregar un Nuevo Registro:**

- Método: POST
- URL: http://localhost:3000/api/milk
- Headers: Content-Type: application/json
- Body:

    {
        "id": 1,
        "name": "Milk Product",
        "price": 10.0
    }

**Actualizar un Registro Existente:**

- Método: PUT
- URL: http://localhost:3000/api/milk
- Headers: Content-Type: application/json
- Body:

    {
        "id": 1,
        "name": "Updated Milk Product",
        "price": 12.0
    }

**Eliminar un Registro:**

- Método: DELETE
- URL: http://localhost:3000/api/milk
- Headers: Content-Type: application/json
- Body:

    {
        "id": 1
    }

## Contribución
Para contribuir al proyecto:

1. Fork el Repositorio:
- Haz un fork del proyecto en GitHub.

2. Clona tu Fork:
- Clona el repositorio en tu máquina local.

3. Crea una Rama Nueva:
- Crea una nueva rama para tus cambios.
    ```bash
    git checkout -b nombre-de-tu-rama

4. Realiza Cambios y Haz Commit:
- Realiza los cambios y haz commit de ellos.
    ```bash
    git add .
    git commit -m "Descripción de los cambios"

5. Push a tu Fork:
- Push a tu fork en GitHub.
    ```bash
    git push origin nombre-de-tu-rama

6. Crea un Pull Request:
- Abre un Pull Request desde tu fork hacia el repositorio principal.