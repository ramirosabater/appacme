const { Router } = require('express');
const router = Router();
const multer = require('../libs/multer');
const { solicitarVacaciones, getVacaciones, getVacacionesByEmpleado, getVacacionesByEstado, getVacacionesById,
    getVacacionesByEmpleadoEstado, revisarVacacionesJefe, deleteVacaciones, getVacacionesByIdJefe,
    getVacacionesIdJefeEstado, getVacacionesFiltro, getSectores, getVacacionesFiltroBySector, eliminarVacaciones } = require('./vacaciones.controllers');
const { verifyToken } = require('../middleware/authentication');

const { isUser, isJefeDirecto, isRecursosHumanos, isAdmUsuarios
} = require('../middleware/adminRoles');

//Get all vacaciones 
router.get('/', [verifyToken], [isUser], getVacaciones);

//Get VacaionesById 
router.get('/:id_vacaciones', [verifyToken], [isUser], getVacacionesById);

//Get Vacaiones x empleado 
router.get('/empleado/:id_empleado', [verifyToken], [isUser], getVacacionesByEmpleado);

//Get Vacaiones x empleado 
router.get('/estado', [verifyToken], [isUser], getVacacionesByEstado,);

//Get Vacaionxes x empleado x estado
router.get('/empleadoestado', [verifyToken], [isUser], getVacacionesByEmpleadoEstado,);

//Get Vacaiones x empleado x estado
router.post('/filtro',  [verifyToken], [isUser], getVacacionesFiltro,);

//Crear vacaciones
router.post('/', [verifyToken], [isUser], solicitarVacaciones);

//Revision Vacaciones Jefe
router.post('/revisionjefe', [verifyToken], [isJefeDirecto], revisarVacacionesJefe);

//Revision vacaciones Jefe
router.get('/jefe/:jefe_directo', [verifyToken], [isJefeDirecto], getVacacionesByIdJefe);

//Get all licencias por Jefe_directo x Id x estado
router.get('/jefeestado', [verifyToken], [isUser], getVacacionesIdJefeEstado);

//Get vacaciones by sector
router.post('/bysector', [verifyToken], [isUser], getVacacionesFiltroBySector);

//eliminar vacaciones
router.post('/eliminar', [verifyToken], [isAdmUsuarios], eliminarVacaciones)

module.exports = router;