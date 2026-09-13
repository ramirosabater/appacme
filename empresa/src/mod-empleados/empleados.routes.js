const { Router } = require('express');
const router = Router();
const { getEmpleados, getEmpleadosbyId, updateEmpleado, getSectores, getPosiciones,getEmpleadosbyJefeDirecto } = require('./empleados.controllers');

const { verifyToken } = require('../middleware/authentication');
const { isUser, isAdmUsuarios
} = require('../middleware/adminRoles');



//Get Empleados
router.get('/', [verifyToken], [isUser], getEmpleados);
//Get EmpleadosById
router.get('/:id_empleado', [verifyToken], [isUser], getEmpleadosbyId);
//Update Empleados
router.post('/actualizar', [verifyToken], [isAdmUsuarios], updateEmpleado);

//Get Sectores
router.get('/sectores/listado', [verifyToken], [isUser], getSectores);

//Get Posiciones
router.get('/posiciones/listado', [verifyToken], [isUser], getPosiciones);

//Get Posiciones
router.get('/jefedirecto/:jefe_directo', [verifyToken], [isUser], getEmpleadosbyJefeDirecto);





module.exports = router;