const { Router } = require('express');
const router = Router();

const {
    bajaUser,
    changePass,
    altaUser,
    resetPassword,
    createUsuario,
    getUsuarios,
    getUsuario,
    editUsuario
} = require('./usuarios.controller');


//tokenize
//const { isAdmin, verifyToken } = require('../mod-login/auth');

const { verifyToken } = require('../middleware/authentication');
const { isUser, isAdmUsuarios
} = require('../middleware/adminRoles');


//Users
router.get('/', [verifyToken], [isAdmUsuarios], getUsuarios);

//User
router.get('/:id_usuario', [verifyToken], [isUser], getUsuario);

//edit User
router.post('/editaruser', [verifyToken], [isAdmUsuarios], editUsuario);//

//Crear Users
router.post('/', [verifyToken], [isAdmUsuarios], createUsuario);//

//alta user
router.post('/alta', [verifyToken], [isAdmUsuarios], altaUser);

//baja user
router.post('/bajaUser', [verifyToken], [isAdmUsuarios], bajaUser);

//reset password
router.post('/resetpassword', [verifyToken], [isAdmUsuarios], resetPassword);

//change password
router.post('/changePassword', [verifyToken], [isUser], changePass);


module.exports = router;