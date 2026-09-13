const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool, secret } = require('../config')



//login usuario
const loginUsuario = async (req, res) => {

    try {
        const { dni, password } = req.body;
        const response = await pool.query('select u.id_usuario,u.dni,u.password,ru.id_rol,r.rol, u.nombre, u.apellido, u.reset_password from usuarios u join roles_usuarios ru on u.id_usuario=ru.id_usuario join roles r on r.id_rol=ru.id_rol where u.dni=$1', [dni]);
        
        if (response.rowCount > 0) {
            const pssHash = response.rows[0].password;

            bcrypt.compare(password, pssHash, function (err, result) {

                if (result) {
                    
                    const token = jwt.sign({ dni: response.rows[0].dni }, secret.SECRET, { expiresIn: '1h' })

                    const roles = response.rows.map(row => row.rol); // Array de roles

                    var data = {
                        token: token,
                         user: {
                            dni: response.rows[0].dni,
                            id_usuario: response.rows[0].id_usuario,
                            nombre: response.rows[0].nombre,
                            apellido: response.rows[0].apellido,
                            reset_password: response.rows[0].reset_password,
                            roles:roles,
                        }
                    }

                    //console.log(token);
                    res.json(data);
                } else {
                    res.status(501).json('Contraseña incorrecta');
                }
            });
        } else {
            res.status(501).json('Usuario no existe');
        }
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = {
    loginUsuario
}
