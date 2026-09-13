const { Router } = require('express');
const router = Router();

const { getFeriados, getFeriadosActuales, getFeriadoByFecha, createFeriado, updateFeriado, deleteFeriado, getProximoFeriado } = require('./feriados.controllers');
const { verifyToken } = require('../middleware/authentication');
const { isUser, isAdmFeriados,
} = require('../middleware/adminRoles');


//Get all feriados 
router.get('/', [verifyToken], [isUser], getFeriados);
//Get all LicenciasById
router.get('/actuales', [verifyToken], [isUser], getFeriadosActuales);
//Get feriadoById
router.get('/fecha', [verifyToken], [isUser], getFeriadoByFecha);
//Crear feriado
router.post('/', [verifyToken], [isAdmFeriados], createFeriado);
//Delete feriado
router.delete('/', [verifyToken], [isAdmFeriados], deleteFeriado);
//Update feriado

router.put('/actualizar', [verifyToken], [isAdmFeriados], updateFeriado);

//Get proximo feriado
router.get('/proximo', [verifyToken], [isUser], getProximoFeriado);


//Delete feriado
router.delete('/', [verifyToken], [isAdmFeriados], deleteFeriado);





module.exports = router;