const { Router } = require('express');
const router = Router();
const multer = require('../libs/multer.adjuntos-pedidos-dinero');
const { getSolicitudDineroById_empleado, geticketsByIdSolicitudDinero, getSolicitudDineroByIdSolicitudDinero, sumaMontoTotalTicketsByIdSolicitudDinero, getTipoSolicitudes,getCategoriasPedidos,getConfiguraciones, adjuntarTicketSolicitudByIdSolicitudDinero, notificarLiderPresentacionRendicionFinal, getSolicitudDineroByJefeDirecto,getSolicitudDineroByAdministracion, getSolicitudDineroByTesoreria, getSolicitudDineroByRRHH, eliminarTicketByIdTicket, notificarTesoreriaPresentacionRendicionFinal, 
descargarRendicionTicketsByUsuario
 } = require('./solicitud-dinero.controller');
 const {  isUser, isJefeDirecto, isRecursosHumanos, isSolicitante, isTesoreria, isAdministracion } = require('../middleware/adminRoles');
const { verifyToken } = require('../middleware/authentication');


//Get solicitud_dinero by id_empleado
router.get('/:id_empleado', [verifyToken], [isSolicitante], getSolicitudDineroById_empleado);//, [verifyToken], [isRecursosHumanos]

//Get solicitud_dinero by id_solicitud_dinero
router.get('/solicitud/:id_solicitud_dinero',[verifyToken], [isUser], getSolicitudDineroByIdSolicitudDinero);//, 

//Get tickets by id_solicitud_dinero
router.get('/tickets/:id_solicitud_dinero', [verifyToken], [isUser], geticketsByIdSolicitudDinero);

//Get solicitud by jefe_directo
router.get('/solicitudes-jefe/:id_jefe_directo', [verifyToken], [isJefeDirecto], getSolicitudDineroByJefeDirecto);

//Get solicitud by administracion
router.put('/solicitudes-administracion/', [verifyToken], [isJefeDirecto], getSolicitudDineroByAdministracion);

//Get solicitud by tesoreria
router.put('/solicitudes-tesoreria/', [verifyToken], [isTesoreria], getSolicitudDineroByTesoreria);

//Get solicitud by rrhh
router.put('/solicitudes-rrhh/', [verifyToken], [isRecursosHumanos], getSolicitudDineroByRRHH);


//Suma total tickets by id_solicitud_dinero
router.get('/suma-tickets/:id_solicitud_dinero', [verifyToken], [isUser], sumaMontoTotalTicketsByIdSolicitudDinero);

//Adjuntar tickets by id_solicitud_dinero
router.post('/tickets/:id_solicitud_dinero', multer.single('file'), [verifyToken], [isSolicitante], adjuntarTicketSolicitudByIdSolicitudDinero);

//Eliminar tickets by id_solicitud_dinero
router.put('/eliminar-ticket/:id_ticket', [verifyToken], [isSolicitante], eliminarTicketByIdTicket);



//Presentar rendicion final todas-las-solicitudes jefe-directo
router.post('/presentar-rendicion/:id_solicitud_dinero', [verifyToken], [isSolicitante], notificarLiderPresentacionRendicionFinal);

//Presentar rendicion final todas-las-solicitudes tesorería
router.post('/presentar-rendicion-tarjeta/:id_solicitud_dinero', [verifyToken], [isSolicitante], notificarTesoreriaPresentacionRendicionFinal );


//Get categorias para combobox
router.post('/categorias-solicitudes', [verifyToken], [isSolicitante], getTipoSolicitudes);

//Get categorias de pedidos para combobox
router.post('/categorias-pedidos', [verifyToken], [isSolicitante], getCategoriasPedidos);

//get configuraciones
router.post('/configuraciones', [verifyToken], [isSolicitante], getConfiguraciones);

//Descargar rendicion de tickets entre fecha y fecha filtrado por empleado
router.post('/descargar-tickets-usuario', [verifyToken], [isUser], descargarRendicionTicketsByUsuario);



module.exports = router;