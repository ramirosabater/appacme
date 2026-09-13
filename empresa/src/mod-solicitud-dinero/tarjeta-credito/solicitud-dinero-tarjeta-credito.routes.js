const { Router } = require('express');
const router = Router();
const { createSolicitudTarjetaCredito, aprobarRendicionTarjetaCreditoTesoreria, rechazarRendicionTarjetaCreditoTesoreria
} = require('../tarjeta-credito/solicitud-dinero-tarjeta-credito.controller.js');
const { isSolicitante, isTesoreria } = require('../../middleware/adminRoles.js');
const { verifyToken } = require('../../middleware/authentication.js');


//Crear solicitud tarjeta-credito
router.post('/:id_empleado', [verifyToken], [isSolicitante], createSolicitudTarjetaCredito);

//Aprobar presentacion de rendicion Tarjeta-credito tesoreria - cierre de circuito
router.post('/aprobar-rendicion-tesoreria/:id_solicitud_dinero', [verifyToken], [isTesoreria] ,aprobarRendicionTarjetaCreditoTesoreria);

//Rechazar rendicion viaje vendedores tesoreria - vuelve atras
router.post('/rechazar-rendicion-tesoreria/:id_solicitud_dinero' ,[verifyToken], [isTesoreria], rechazarRendicionTarjetaCreditoTesoreria);



module.exports = router;