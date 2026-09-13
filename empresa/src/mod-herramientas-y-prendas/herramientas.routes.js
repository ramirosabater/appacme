const { Router } = require('express');
const router = Router();
const { getAllDetalle_Solicitudes,getAllSolicitudes,getSolicitudesByJefeDirecto,getAllDetalle_SolicitudesByJefe,realizarSolicitud, aprobarSolicitudRRHH,denegarSolicitudRRHH,recepcionEmpleado,rechazoEmpleado,getSolicitudesByEmpleado,getAllDetalle_SolicitudesByEmpleado, ListadoHerramientasPrendas, getSolicitudById
} = require('./herramientas.controllers');
const { verifyToken } = require('../middleware/authentication');
const { isUser, isJefeDirecto, isRecursosHumanos } = require('../middleware/adminRoles');



//Get all Detalle_solicitudes - RRHH
router.get('/detalle', [verifyToken], [isUser], getAllDetalle_Solicitudes);

//Get all solicitudes - RRHH
router.get('/', [verifyToken], [isUser],getAllSolicitudes);


//Get all solicitudes - Jefedirecto
router.get('/jefe/:jefe_directo',[verifyToken], [isUser], getSolicitudesByJefeDirecto);


//Get all detalle_solicitudes - Jefe directo
router.get('/jefedetalle/:jefe_directo', [verifyToken], [isUser], getAllDetalle_SolicitudesByJefe);


//Get all solicitudes - Empleado
router.get('/empleado/:id_empleado', [verifyToken],getSolicitudesByEmpleado);

//Get all detalle_solicitud - Empleado
router.get('/empleadodetalle/:id_empleado',[verifyToken], [isUser], getAllDetalle_SolicitudesByEmpleado);


//Realizar pedido/solicitud - Jefe directo
router.post('/', [verifyToken], [isJefeDirecto], realizarSolicitud);

//Aprobar solicitud desde RRHH
router.put('/aprobar/:id_solicitud', [verifyToken], [isRecursosHumanos],aprobarSolicitudRRHH);

//Denegar solicitud desde RRHH
router.put('/denegar', [verifyToken], [isRecursosHumanos],denegarSolicitudRRHH);

//Confirmar recepcion Empleado
router.put('/recepcion/:id_solicitud', [verifyToken], [isUser],recepcionEmpleado);

//Rechado de pedido por parte de empleado
router.put('/rechazo', [verifyToken], [isUser], rechazoEmpleado);

router.get('/listado', [verifyToken], [isUser], ListadoHerramientasPrendas);

router.get('/solicitudid/:id_solicitud',[verifyToken], [isUser], getSolicitudById)



module.exports = router;