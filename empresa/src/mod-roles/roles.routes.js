const { Router } = require('express');
const router = Router();

const {
    getRoles, getRolUsuario, addRolUsuario, deleteRolUsuario, getPermisosUsuario

} = require('./roles.controllers');

const { verifyToken } = require('../middleware/authentication');

const { isUser, isAdmUsuarios
} = require('../middleware/adminRoles');

//Get Roles
router.get('/', [verifyToken], [isUser], getRoles);

//Get Roles de usuario por id
router.get('/:id_usuario', [verifyToken], [isUser], getRolUsuario);

//Add rol a usuario
router.post('/add', [verifyToken], [isAdmUsuarios], addRolUsuario)

//Get permisos de usuario
router.get('/permisos/:id_usuario', [verifyToken], [isUser], getPermisosUsuario);

//Delete rol a usuario
router.post('/deleterol', [verifyToken], [isAdmUsuarios], deleteRolUsuario);


module.exports = router;