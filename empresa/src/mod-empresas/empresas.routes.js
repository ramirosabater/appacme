const { Router } = require('express');
const router = Router();
const { getEmpresas } = require('./empresa.controllers');

const { verifyToken } = require('../middleware/authentication');
const { isUser, isAdmUsuarios
} = require('../middleware/adminRoles');



//Get Empresas
router.get('/', [verifyToken], [isUser], getEmpresas);



module.exports = router;