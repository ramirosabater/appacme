const { pool, secret } = require('../config');
const jwt = require("jsonwebtoken");



const isUser = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization;
        const decoded = jwt.verify(token, secret.SECRET);

        const dniUser = decoded.dni;
        //console.log(decoded)

        const user = await pool.query(`select u.id_usuario,u.dni,u.password,ru.id_rol,r.rol from usuarios u join roles_usuarios ru on u.id_usuario=ru.id_usuario join roles r on r.id_rol=ru.id_rol where u.dni=$1`, [dniUser]);
        //console.log(user);
        if (!user) {
            return res.status(403).json({ message: "invalid token, user not found" });
        }
        let found = false;
        user.rows.forEach(row => {
            if (row.id_rol == 1) {
                found = true;
                next();
                return;
            }
        });

        if (!found) {
            res.status(403).json({ message: "rol no autorizado" });
        }
    }
    catch (error) {
        res.status(500).json({
            message: '[isUser] - Error de acceso de usuario server'
        });
    }
}


const isJefeDirecto = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization;
        const decoded = jwt.verify(token, secret.SECRET);

        const dniUser = decoded.dni;
        //console.log(decoded)

        const user = await pool.query(`select u.id_usuario,u.dni,u.password,ru.id_rol,r.rol from usuarios u join roles_usuarios ru on u.id_usuario=ru.id_usuario join roles r on r.id_rol=ru.id_rol where u.dni=$1`, [dniUser]);
        //console.log(user);
        if (!user) {
            return res.status(403).json({ message: "invalid token, user not found" });
        }
        let found = false;
        user.rows.forEach(row => {
            if (row.id_rol == 2) {
                found = true;
                next();
                return;
            }
        });

        if (!found) {
            res.status(403).json({ message: "rol no autorizado" });
        }
    }
    catch (error) {
        res.status(500).json({
            message: '[isJefeDirecto] - Error de acceso de jefe directo server'
        });
    }
}


const isRecursosHumanos = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization;
        const decoded = jwt.verify(token, secret.SECRET);

        const dniUser = decoded.dni;
        //console.log(decoded)

        const user = await pool.query(`select u.id_usuario,u.dni,u.password,ru.id_rol,r.rol from usuarios u join roles_usuarios ru on u.id_usuario=ru.id_usuario join roles r on r.id_rol=ru.id_rol where u.dni=$1`, [dniUser]);
        //console.log(user);
        if (!user) {
            return res.status(403).json({ message: "invalid token, user not found" });
        }
        let found = false;
        user.rows.forEach(row => {
            if (row.id_rol == 3) {
                found = true;
                next();
                return;
            }
        });

        if (!found) {
            res.status(403).json({ message: "rol no autorizado" });
        }
    }
    catch (error) {
        res.status(500).json({
            message: '[isRRHH] - Error de acceso de Recursos Humanos server'
        });
    }
}


const isAdmNoticias = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization;
        const decoded = jwt.verify(token, secret.SECRET);

        const dniUser = decoded.dni;
        //console.log(decoded)

        const user = await pool.query(`select u.id_usuario,u.dni,u.password,ru.id_rol,r.rol from usuarios u join roles_usuarios ru on u.id_usuario=ru.id_usuario join roles r on r.id_rol=ru.id_rol where u.dni=$1`, [dniUser]);
        //console.log(user);
        if (!user) {
            return res.status(403).json({ message: "invalid token, user not found" });
        }
        let found = false;
        user.rows.forEach(row => {
            // Corregido: era id_rol==1 ("User", cualquier usuario logueado pasaba el chequeo).
            // El rol "Administrador Noticias" es id_rol 4 en la tabla roles.
            if (row.id_rol == 4) {
                found = true;
                next();
                return;
            }
        });

        if (!found) {
            res.status(403).json({ message: "rol no autorizado" });
        }
    }
    catch (error) {
        res.status(500).json({
            message: '[isAdminNoticias] - Error de acceso de administrador de noticias server'
        });
    }
}



const isAdmFeriados = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization;
        const decoded = jwt.verify(token, secret.SECRET);

        const dniUser = decoded.dni;
        //console.log(decoded)

        const user = await pool.query(`select u.id_usuario,u.dni,u.password,ru.id_rol,r.rol from usuarios u join roles_usuarios ru on u.id_usuario=ru.id_usuario join roles r on r.id_rol=ru.id_rol where u.dni=$1`, [dniUser]);
        //console.log(user);
        if (!user) {
            return res.status(403).json({ message: "invalid token, user not found" });
        }
        let found = false;
        user.rows.forEach(row => {
            if (row.id_rol == 5) {
                found = true;
                next();
                return;
            }
        });

        if (!found) {
            res.status(403).json({ message: "rol no autorizado" });
        }
    }
    catch (error) {
        res.status(500).json({
            message: '[isAdmFeriados] - Error de acceso de Administrador de Feriados server'
        });
    }
}



const isAdmUsuarios = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization;
        const decoded = jwt.verify(token, secret.SECRET);

        const dniUser = decoded.dni;
        //console.log(decoded)

        const user = await pool.query(`select u.id_usuario,u.dni,u.password,ru.id_rol,r.rol from usuarios u join roles_usuarios ru on u.id_usuario=ru.id_usuario join roles r on r.id_rol=ru.id_rol where u.dni=$1`, [dniUser]);
        //console.log(user);
        if (!user) {
            return res.status(403).json({ message: "invalid token, user not found" });
        }
        let found = false;
        user.rows.forEach(row => {
            if (row.id_rol == 6) {
                found = true;
                next();
                return;
            }
        });

        if (!found) {
            res.status(403).json({ message: "rol no autorizado" });
        }
    }
    catch (error) {
        res.status(500).json({
            message: '[isAdmUsuarios] - Error de acceso de Administrador de Usuarios server'
        });
    }
}


const isSolicitante = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization;
        const decoded = jwt.verify(token, secret.SECRET);

        const dniUser = decoded.dni;
        //console.log(decoded)

        const user = await pool.query(`select u.id_usuario,u.dni,u.password,ru.id_rol,r.rol from usuarios u join roles_usuarios ru on u.id_usuario=ru.id_usuario join roles r on r.id_rol=ru.id_rol where u.dni=$1`, [dniUser]);
        //console.log(user);
        if (!user) {
            return res.status(403).json({ message: "invalid token, user not found" });
        }
        let found = false;
        user.rows.forEach(row => {
            if (row.id_rol == 7) {
                found = true;
                next();
                return;
            }
        });

        if (!found) {
            res.status(403).json({ message: "rol no autorizado" });
        }
    }
    catch (error) {
        res.status(500).json({
            message: '[isJefeDirecto] - Error de acceso de jefe directo server'
        });
    }
}


const isTesoreria = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization;
        const decoded = jwt.verify(token, secret.SECRET);

        const dniUser = decoded.dni;
        //console.log(decoded)

        const user = await pool.query(`select u.id_usuario,u.dni,u.password,ru.id_rol,r.rol from usuarios u join roles_usuarios ru on u.id_usuario=ru.id_usuario join roles r on r.id_rol=ru.id_rol where u.dni=$1`, [dniUser]);
        //console.log(user);
        if (!user) {
            return res.status(403).json({ message: "invalid token, user not found" });
        }
        let found = false;
        user.rows.forEach(row => {
            if (row.id_rol == 8) {
                found = true;
                next();
                return;
            }
        });

        if (!found) {
            res.status(403).json({ message: "rol no autorizado" });
        }
    }
    catch (error) {
        res.status(500).json({
            message: '[isJefeDirecto] - Error de acceso de jefe directo server'
        });
    }
}


const isAdministracion = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization;
        const decoded = jwt.verify(token, secret.SECRET);

        const dniUser = decoded.dni;
        //console.log(decoded)

        const user = await pool.query(`select u.id_usuario,u.dni,u.password,ru.id_rol,r.rol from usuarios u join roles_usuarios ru on u.id_usuario=ru.id_usuario join roles r on r.id_rol=ru.id_rol where u.dni=$1`, [dniUser]);
        //console.log(user);
        if (!user) {
            return res.status(403).json({ message: "invalid token, user not found" });
        }
        let found = false;
        user.rows.forEach(row => {
            if (row.id_rol == 9) {
                found = true;
                next();
                return;
            }
        });

        if (!found) {
            res.status(403).json({ message: "rol no autorizado" });
        }
    }
    catch (error) {
        res.status(500).json({
            message: '[isJefeDirecto] - Error de acceso de jefe directo server'
        });
    }
}


module.exports = {
    isUser,
    isJefeDirecto,
    isRecursosHumanos,
    isAdmNoticias,
    isAdmFeriados,
    isAdmUsuarios,
    isSolicitante,
    isTesoreria,
    isAdministracion

}