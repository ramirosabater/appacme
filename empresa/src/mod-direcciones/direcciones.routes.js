const { Router } = require('express');
const router = Router();
const multer = require('../libs/multer.domicilios');
const { getDomicilios, getDireccionesByUsuario, createDomicilio, editDomicilio, bajaDireccion, getDireccionesByIdDireccion } = require('./direcciones.controllers');

const { verifyToken } = require('../middleware/authentication');
const { isUser
} = require('../middleware/adminRoles');


//Get All Domicilios
router.get('/', [verifyToken], [isUser], getDomicilios);//

//Get direcciones By id_usuario
router.get('/:id_usuario', [verifyToken], [isUser], getDireccionesByUsuario);//, [verifyToken], [isUser]

//Get direccion By id_direccion
router.get('/direccion/:id_direccion', [verifyToken], [isUser], getDireccionesByIdDireccion);//, [isUser], [verifyToken]

//Crear Domicilio
router.post('/', multer.single('file'), [verifyToken], [isUser], createDomicilio);


router.post('/edit/:id_direccion', [verifyToken], [isUser], editDomicilio);//, [isUser], [verifyToken]


router.post('/baja', [verifyToken], [isUser], bajaDireccion);//, [verifyToken], [isUser]




module.exports = router;