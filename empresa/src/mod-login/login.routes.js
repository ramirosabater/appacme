const { Router } = require('express');
const router = Router();

const { loginUsuario } = require('./login.controller');

//Login Users
router.post('/', loginUsuario)

module.exports = router;