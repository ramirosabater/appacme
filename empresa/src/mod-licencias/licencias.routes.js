const { Router } = require('express');
const router = Router();
const multer = require('../libs/multer');
const { getLicencias, getLicenciasByEmpleado, getLicenciasByEstado, getLicenciasByEmpleadoEstado, revisarLicenciaJefe, revisarLicenciaRecursos, createLicencia, deleteLicencia, getTipoLicencias, getLicenciasIdJefe, getLicenciasIdJefeEstado, getLicenciaById, rechazarLicenciaJefe, getLicenciasRecursos, rechazarLicenciaRecursos, adjuntarArchivoLicencia,getTipoLicenciasxEmpresa,getLicenciaDescarga } = require('./licencias.controllers');
const { verifyToken } = require('../middleware/authentication');
const { isUser, isJefeDirecto, isRecursosHumanos
} = require('../middleware/adminRoles');


//Get all licencias por Recursos_humanos
router.get('/recursos', [verifyToken], [isRecursosHumanos], getLicenciasRecursos);

//Get all licencias 
router.get('/', [verifyToken], [isUser], getLicencias);

//Get tipo de licencias 
router.get('/tipo',[verifyToken], [isUser], getTipoLicencias);

//get licencias x id
router.get('/:id_licencia', [verifyToken], [isUser], getLicenciaById);

//Get Licencias x empleado 
router.get('/empleado/:id_empleado', [verifyToken], [isUser], getLicenciasByEmpleado);

//Get Licencias x estado 
router.get('/estado', [verifyToken], [isUser], getLicenciasByEstado);

//Get Licencias x estado 
router.get('/estadoempleado', [verifyToken], [isUser], getLicenciasByEmpleadoEstado);

//Crear Licencia
router.post('/', [verifyToken], [isUser], createLicencia);

//Adjuntar archivo a licencia
router.post('/adjunto', [verifyToken], [isUser], multer.single('file'), adjuntarArchivoLicencia)

//Revision licencia Jefe
router.post('/revisionjefe', [verifyToken], [isJefeDirecto], revisarLicenciaJefe);

//Revision licencia RRHH
router.post('/revisionrecursos', [verifyToken], [isRecursosHumanos], revisarLicenciaRecursos);

//Delete licencia
//router.delete('/', [verifyToken], [isUser], deleteLicencia);

//Get all licencias por Jefe_directo x Id
router.get('/jefe/:jefe_directo', [verifyToken], [isUser], getLicenciasIdJefe);

//Get all licencias por Jefe_directo x Id x estado
router.get('/jefeestado', [verifyToken], [isUser], getLicenciasIdJefeEstado);

//Rechazar licencia Jefe
router.post('/rechazarjefe', [verifyToken], [isJefeDirecto], rechazarLicenciaJefe);

//Rechazar licencia Recursos_humanos
router.post('/rechazarrecursos', [verifyToken], [isRecursosHumanos], rechazarLicenciaRecursos);

//Obtener todas los tipo de Licencias x id Empresa
router.get('/tl/:id_empresa',[verifyToken], [isUser], getTipoLicenciasxEmpresa);//, [verifyToken], [isUser]

//Descargar licencias entre fecha y fecha en formato Json
router.post('/descargas',[verifyToken], [isRecursosHumanos],getLicenciaDescarga);




module.exports = router;