const { Router } = require('express');
const router = Router();
const multer = require('../../mod-correo/notificaciones/correo-solicitud-dinero');
const{createSolicitudViaticosDeslocalizados,aprobarViaticosDeslocalizadosRRHH,
rechazarViaticosDeslocalizadosRRHH, cierreViaticosDeslocalizadosTesoreria}
= require('../viaticos-deslocalizados/solicitud-dinero-viaticos-des.contrroller');
const { isRecursosHumanos, isSolicitante, isTesoreria } = require('../../middleware/adminRoles');
const { verifyToken } = require('../../middleware/authentication');




//Crear solicitud viaticos deslocalizados
router.post('/:id_empleado',[verifyToken],[isSolicitante], createSolicitudViaticosDeslocalizados);

//Aprobar solicitud viaticos deslocalizados RRHH
router.post('/aprobar-rrhh/:id_solicitud_dinero',[verifyToken],[isRecursosHumanos], aprobarViaticosDeslocalizadosRRHH);

//Rechazar solicitud viaticos deslocalizados RRHH
router.post('/rechazar-rrhh/:id_solicitud_dinero', [verifyToken],[isRecursosHumanos], rechazarViaticosDeslocalizadosRRHH);

//Aprobar rendicion viaticos deslocalizados rrhh- Circuito cerrado
router.put('/aprobar-rendicion-tesoreria/:id_solicitud_dinero',[verifyToken],[isTesoreria], cierreViaticosDeslocalizadosTesoreria);


module.exports = router;