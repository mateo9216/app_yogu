const express = require("express");
const { createPool } = require("mysql2/promise");
const { config } = require("dotenv");

config();


const app = express();

const pool = createPool({
    host: process.env.MYSQLDB_HOST,
    user: process.env.MYSQLDB_USER_ROOT,
    password: process.env.MYSQLDB_PASSWORD,
    port: process.env.MYSQLDB_PORT,
});

app.get("/", (req, res) => {
    res.send("hola desde node");
});

app.get("/datos", async (req, res) => {
    const result = await pool.query("SHOW DATABASES;");
    res.json(result[0]);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
