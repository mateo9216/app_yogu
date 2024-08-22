const TABLA = "auth";
const bcrypt = require('bcrypt');
const auth = require('../../autenticacion/index');

module.exports = function(dbInyectada) {
    let db = dbInyectada;

    if (!db) {
        db = require('../../db/mysql');
    }



    async function login(user, password) {
        const data = await db.query(TABLA, { user: user });

        if (data.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        const userData = data[0];

        const resultado = await bcrypt.compare(password, userData.password);
        if (resultado) {
            // Genera token
            return auth.asignarToken({ ...userData });
        } else {
            throw new Error('Información inválida');
        }
    }

    async function agregar(data) {
        const authData = {
            id: data.id,
        };

        if (data.user) {
            authData.user = data.user;
        }

        if (data.password) {
            authData.password = await bcrypt.hash(data.password.toString(), 5);
        }

        return await db.agregar(TABLA, authData);
    }

    return {
        agregar,
        login
    };
}
