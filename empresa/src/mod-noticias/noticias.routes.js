const { Router } = require('express');
const router = Router();

const multer = require('../libs/multer.js');
const { getNews, getActiveNews, getNewsById, createNews, insertImgNews, editNews, getImgNews, altaNews,
    bajaNews, deleteImgNews, getCategories } = require('./noticias.controllers.js');
const { isUser, isAdmNoticias } = require('../middleware/adminRoles');
const { verifyToken } = require('../middleware/authentication');


//Get all News
router.get('/', [verifyToken], [isAdmNoticias], getNews);
//Get active News
router.get('/active', [verifyToken], [isUser], getActiveNews);
//Get News by Id
router.get('/newsByid/:id', [verifyToken], [isUser], getNewsById);


//Create News
router.post('/',[verifyToken], [isAdmNoticias], multer.single('file'), createNews);
//Edit News
router.post('/edit', [verifyToken], [isAdmNoticias], editNews);
//Alta News
router.post('/alta', [verifyToken], [isAdmNoticias], altaNews);
//Baja News
router.post('/baja', [verifyToken], [isAdmNoticias], bajaNews);


// Add imagen to news
router.post('/imgnews', [verifyToken], [isAdmNoticias], multer.single('file'), insertImgNews);

// Get imagen to news
router.get('/imgnews', [verifyToken], [isAdmNoticias], getImgNews);

//Delete Imagen to news
router.post('/deleteimgnews', [verifyToken], [isAdmNoticias], deleteImgNews);


//Get all categories
router.get('/categories', [verifyToken], [isAdmNoticias], getCategories);





module.exports = router;