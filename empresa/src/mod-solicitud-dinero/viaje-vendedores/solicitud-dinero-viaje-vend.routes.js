const { Router } = require('express');
const router = Router();
const multer = require('../../mod-correo/notificaciones/correo-solicitud-dinero');
const{crearSolicitudViajeVendedores, aprobarViajeVendedoresJefeDirecto,
rechazarViajeVendedoresJefeDirecto, aprobarViajeVendedoresTesoreria,
aprobarRendicionViajeVendedoresJefeDirecto, aprobarRendicionViajeVendedoresTesoreria, rechazarViajeVendedoresTesoreria, rechazarRendicionViajeVendedoresJefeDirecto, rechazarRendicionViajeVendedoresTesoreria} = require('./solicitud-dinero-viaje-vend.controller');
const { isJefeDirecto, isSolicitante, isTesoreria } = require('../../middleware/adminRoles');
const { verifyToken } = require('../../middleware/authentication');

//Crear solicitud viaje-vendedores
router.post('/:id_empleado',[verifyToken],[isSolicitante], crearSolicitudViajeVendedores);

//Aprobar solicitud viaje vendedores jefe directo
router.post('/aprobar-jefe/:id_solicitud_dinero',[verifyToken],[isJefeDirecto], aprobarViajeVendedoresJefeDirecto);

//Rechazar solicitud viaje vendedores jefe directo
router.post('/rechazar-jefe/:id_solicitud_dinero',[verifyToken],[isJefeDirecto], rechazarViajeVendedoresJefeDirecto);

//Aprobar solicitud viaje vendedores tesoreria
router.post('/aprobar-tesoreria/:id_solicitud_dinero',[verifyToken],[isTesoreria], aprobarViajeVendedoresTesoreria);

//Rechazar solicitud viaje vendedores tesoreria
router.post('/rechazar-tesoreria/:id_solicitud_dinero',[verifyToken],[isTesoreria], rechazarViajeVendedoresTesoreria);

//Aprobar rendicion viaje vendedores jefe directo
router.post('/aprobar-rendicion-jefe/:id_solicitud_dinero',[verifyToken],[isJefeDirecto], aprobarRendicionViajeVendedoresJefeDirecto);

//Rechazar rendicion viaje vendedores jefe directo
router.post('/rechazar-rendicion-jefe/:id_solicitud_dinero',[verifyToken],[isJefeDirecto], rechazarRendicionViajeVendedoresJefeDirecto);

//Aprobar rendicion viaje vendedores tesoreria - cierre de circuito
router.post('/aprobar-rendicion-tesoreria/:id_solicitud_dinero', [verifyToken],[isTesoreria], aprobarRendicionViajeVendedoresTesoreria);

//Rechazar rendicion viaje vendedores tesoreria - vuelve atras
router.post('/rechazar-rendicion-tesoreria/:id_solicitud_dinero',[verifyToken],[isTesoreria], rechazarRendicionViajeVendedoresTesoreria);



module.exports = router;