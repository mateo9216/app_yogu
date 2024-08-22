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
        console.log("Database connected 🔌 ");
        
        // Aquí puedes realizar operaciones adicionales después de la conexión, si es necesario
        // Por ejemplo, inicialización de tablas, etc.
        
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
            // Intentar actualizar si el ID existe
            result = await pool.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [data, data.id]);
            if (result[0].affectedRows === 0) {
                // Si no se actualizó ninguna fila, insertar como nuevo
                result = await pool.query(`INSERT INTO ${tabla} SET ?`, [data]);
            }
        } else {
            // Insertar nuevo registro
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
        const [result] = await pool.query(`SELECT * FROM ${tablas} WHERE ?`,consulta);
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
