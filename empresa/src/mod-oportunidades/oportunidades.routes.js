const { Router } = require('express');
const router = Router();

const { getOportunidades,
    getOportunidadById,
    createOportunidad,
    updateOportunidad,
    deleteOportunidad,
    addRequisito,
    deleteRequisito,
    addBeneficio,
    deleteBeneficio,
    getAllOportunidades,
    getCargaHoraria,
    getUbicaciones,
    getModalidad,
    getAreas,
    getCategoriasTrabajo,
    scanOportunidadesPDFs
} = require('./oportunidades.controllers.js');

const {
    getPostulantes,
    getAllPostulantes,
    addCategoriaPostulante
} = require('./postulantes.controllers.js');
const { verifyToken } = require('../middleware/authentication.js');

router.get('/all-postulantes', [verifyToken], getAllPostulantes);

router.get('/ubicaciones', getUbicaciones);

router.get('/categorias-trabajo', getCategoriasTrabajo);

router.get('/carga', [verifyToken], getCargaHoraria);

router.get('/modalidad', [verifyToken], getModalidad);

router.get('/areas', [verifyToken], getAreas);

//Banco de CVs
router.get('/banco', [verifyToken], (req, res) => { req.params.id_oportunidad = 'banco'; scanOportunidadesPDFs(req, res); });

//Scan PDFs in oportunidades folder
router.get('/scan-pdfs/:id_oportunidad', [verifyToken], scanOportunidadesPDFs);

//Get all Oportunidades 
//Esta consulta hay q modificarla
router.get('/', [verifyToken], getAllOportunidades);

router.get('/activas', getOportunidades);

//Get Oportunidad by id
router.get('/:id', getOportunidadById);

//Create Oportunidad
router.post('/', [verifyToken], createOportunidad);

//Update Oportunidad
router.put('/:id', [verifyToken], updateOportunidad);

//Delete Oportunidad
router.delete('/:id', [verifyToken], deleteOportunidad);

//Add Requisito
router.post('/requisitos', [verifyToken], addRequisito);

//Delete Requisito
router.delete('/requisitos/:id', [verifyToken], deleteRequisito);

//Add Beneficio
router.post('/beneficios', [verifyToken], addBeneficio);

//Delete Beneficio
router.delete('/beneficios/:id', [verifyToken], deleteBeneficio);

//Get all postulantes


//Get all Postulantes by empleo
router.get('/postulantes/:id_empleo', [verifyToken], getPostulantes);

//Se agrega categoria a postulante
router.post('/postulante/categoria', [verifyToken], addCategoriaPostulante);

//Se agrega categoria a postulante
router.post('/postulantes-categoria/:id_categoria?', [verifyToken], getAllPostulantes);








module.exports = router;