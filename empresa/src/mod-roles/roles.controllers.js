const { pool } = require('../config');


//get roles
const getRoles = async (req, res) => {
    try {
        const response = await pool.query(`SELECT * FROM roles`);
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json(error);
    }
};


//Agregar tipo de roles
const addRoles = async (req, res) => {
    const { rol, descripcion } = req.body;
    try {
        const response = await pool.query(`insert into roles(rol)values ($1)`, [rol]);
        res.status(200).json('Rol agregado con exito');
    } catch (error) {
        res.status(500).json('Error al agregar rol');
    }
};


//Obtener todas las  Licencias
const getRolesUsuarios = async (req, res) => {
    try {
        const response = await pool.query(`select u.id_usuario,u.nombre, u.apellido, r.id_rol,r.rol
        from usuarios u, roles r, roles_usuarios ru
        where u.id_usuario= ru.id_usuario and r.id_rol=ru.id_rol order by u.id_usuario desc`);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};


//agregar rol al usuario
const addRolUsuario = async (req, res) => {
    const { id_usuario, id_rol } = req.body;
    try {
        const response = await pool.query(`insert into roles_usuarios(id_usuario,id_rol)values($1,$2)`, [id_usuario, id_rol]);
        res.status(200).json('Rol agregado a usuario con exito');
    } catch (error) {
        res.status(500).json('Error al agregar rol');
    }
};

//eliminar rol de usuario
const deleteRolUsuario = async (req, res) => {
    const { id_usuario, id_rol } = req.body;
    const response = await pool.query(`select * from roles_usuarios where id_usuario=$1 and id_rol=$2`, [id_usuario, id_rol])
    if (response.rowCount > 0) {
        try {
            const response = await pool.query(`delete from roles_usuarios where id_usuario= $1 and id_rol = $2`, [id_usuario, id_rol]);
            res.status(200).json('Se elimino el rol de usuario con exito');
        } catch (error) {
            res.status(500).json('Error al eliminar rol de usuario');
        }
    } else {
        res.status(500).json('No se pudo eliminar rol')
    }

};


//listar roles a usuarios
const getRolUsuario = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const consulta = await pool.query(`select u.id_usuario,u.nombre, u.apellido, r.id_rol,r.rol
        from usuarios u, roles r, roles_usuarios ru
        where u.id_usuario= ru.id_usuario and r.id_rol=ru.id_rol and u.id_usuario=$1 order by r.id_rol asc`, [id_usuario]);
        res.status(200).json(consulta.rows);

    } catch (error) {
        res.status(500).json('Error al listar roles de usuario');
    }


}

//get permisos de usuario: los permisos se obtienen de la tabla roles_permisos, id_permiso, id_rol, permiso, ruta. Y la tabla roles_usuarios, id_usuario, id_rol
const getPermisosUsuario = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const consulta = await pool.query(`select p.id, p.permiso, p.ruta, p.id_rol, r.rol from roles_permisos p, roles r, roles_usuarios ru where p.id_rol=r.id_rol and ru.id_rol=r.id_rol and ru.id_usuario=$1 order by r.id_rol`, [id_usuario]);
        res.status(200).json(consulta.rows);
    } catch (error) {
        res.status(500).json('Error al listar permisos de usuario');
    }
}




module.exports = {
    getRoles,
    getRolesUsuarios,
    addRoles,
    addRolUsuario,
    deleteRolUsuario,
    getRolUsuario,
    getPermisosUsuario
}