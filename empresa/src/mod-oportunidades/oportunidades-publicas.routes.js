const { Router } = require('express');
const router = Router();
const multer = require('../libs/multer.oportunidades');

const { createPostulante } = require('./postulantes.controllers');
const { getOportunidades, getOportunidadById, getCategoriasTrabajo } = require('./oportunidades.controllers');

router.get('/oportunidades', getOportunidades);

router.get('/oportunidades/:id', getOportunidadById);

router.post('/postulantes', multer.single('file'), createPostulante);

router.get('/categorias-trabajo', getCategoriasTrabajo);


module.exports = router;

