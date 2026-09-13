const { Router } = require('express');
const router = Router();
const multer = require('../libs/multer.adjuntos');

const { getAdjuntosActivosByIdUsuario, getAdjuntosByIdAdjunto, createAdjunto, deleteAdjunto } = require('./adjuntos.controllers');

const { verifyToken } = require('../middleware/authentication');

const { isUser
} = require('../middleware/adminRoles');



//Get active adjunto by id_empleado
router.get('/:id_empleado', [verifyToken], [isUser], getAdjuntosActivosByIdUsuario);

//Get adjunto by id_adjunto
router.get('/id/:id_adjunto', [verifyToken], [isUser], getAdjuntosByIdAdjunto);


//Create adjunto
router.post('/', [verifyToken], [isUser], multer.single('file'), createAdjunto);


//Create adjunto
router.delete('/:id_adjunto', [verifyToken], [isUser], deleteAdjunto);





module.exports = router;