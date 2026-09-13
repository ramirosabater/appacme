const { Router } = require('express');
const router = Router();
const {getNovedades,createNovedadEmpleado,getNovedadesEmpleados,getNovedadesJefe,
    bajaNovedad,descargarNovedades,getNovedadesByJefeDirecto,getAllNovedadesByJefeDirecto} = require('./novedades.controllers');
const { isUser, isJefeDirecto, isAdmFeriados } = require('../middleware/adminRoles');
const { verifyToken } = require('../middleware/authentication');

//Get novedades by id_empresa
router.get('/:id_empresa', [verifyToken], [isUser], getNovedades);

//Crear novedad_empleado
router.post('/', [verifyToken], [isJefeDirecto], createNovedadEmpleado);//

//Get novedades_empleados
router.get('/', [verifyToken], [isUser],getNovedadesEmpleados );

//Get novedades jefe_directo
router.get('/jefe/:jefe_directo', [verifyToken], [isUser],getNovedadesJefe );

//Update novedades
router.post('/editar', [verifyToken], [isJefeDirecto],bajaNovedad);

//Descargar Novedades entre fecha y fecha filtrado por empresa
router.post('/descargar', [verifyToken], [isUser],descargarNovedades);

//Descargar Novedades entre fecha y fecha filtrado por empresa
router.post('/descargarjefe', [verifyToken], [isUser],getNovedadesByJefeDirecto);

//Descargar Novedades entre fecha y fecha filtrado por empresa
router.get('/getjefe/:jefe_directo', [verifyToken], [isUser],getAllNovedadesByJefeDirecto);





module.exports = router;