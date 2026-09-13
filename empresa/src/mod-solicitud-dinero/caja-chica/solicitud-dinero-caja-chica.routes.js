const { Router } = require('express');
const router = Router();
const multer = require('../../mod-correo/notificaciones/correo-solicitud-dinero');
const{createSolicitudCajaChica,aprobarCajaChicaJefeDirecto,
denegarCajaChicaJefeDirecto,aprobarCajaChicaAdministracion,
denegarCajaChicaAdministracion,rechazarPresentacionRendicionFinalCajaChicaJefeDirecto,
aprobarRendicionCajaChicaJefeDirecto,cierreCircuitoCajaChicaAdministracion,
rechazarRendicionCajaChicaAdministracion} = require('../caja-chica/solicitud-dinero-caja-chica.controller');
const { isJefeDirecto, isSolicitante, isAdministracion } = require('../../middleware/adminRoles.js');
const { verifyToken } = require('../../middleware/authentication.js');


//Crear solicitud caja chica
router.post('/:id_empleado', [verifyToken],[isSolicitante], createSolicitudCajaChica);

//Aprobar solicitud caja chica jefe directo
router.post('/aprobar-jefe/:id_solicitud_dinero', [verifyToken], [isJefeDirecto], aprobarCajaChicaJefeDirecto);

//Denegar solicitud caja chica jefe directo
router.post('/denegar-jefe/:id_solicitud_dinero', [verifyToken], [isJefeDirecto], denegarCajaChicaJefeDirecto);

//Aprobar solicitud caja chica administracion
router.post('/aprobar-administracion/:id_solicitud_dinero', [verifyToken], [isAdministracion], aprobarCajaChicaAdministracion);

//Denegar solicitud caja chica administracion
router.post('/denegar-administracion/:id_solicitud_dinero', [verifyToken], [isAdministracion], denegarCajaChicaAdministracion);

//Aprobar rendicion caja chica JefeDirecto
router.put('/aprobar-rendicion-jd/:id_solicitud_dinero', [verifyToken], [isJefeDirecto], aprobarRendicionCajaChicaJefeDirecto);

//Denegar rendicion caja chica JefeDirecto
router.put('/denegar-rendicion-jd/:id_solicitud_dinero', [verifyToken], [isJefeDirecto], rechazarPresentacionRendicionFinalCajaChicaJefeDirecto);

//Aprobar rendicion caja chica Administracion- Circuito cerrado
router.put('/aprobar-rendicion-administracion/:id_solicitud_dinero', [verifyToken], [isAdministracion], cierreCircuitoCajaChicaAdministracion);

//Rechazar rendicion caja chica Administracion- Circuito cerrado
router.put('/rechazar-rendicion-administracion/:id_solicitud_dinero', [verifyToken], [isAdministracion], rechazarRendicionCajaChicaAdministracion);




module.exports = router;