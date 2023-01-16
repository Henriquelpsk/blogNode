const express = require('express');
const router = express.Router();
const { isAdmin } = require('../helpers/isAdm');
const adminController = require('../controllers/adminController');

router.get('/', isAdmin, adminController.index);
//rotas de categoria
router.get('/categorias', isAdmin, adminController.category);
//Insert
router.get('/categorias/add', isAdmin, adminController.getNewCategory);
router.post('/categorias/add', isAdmin, adminController.postNewCategory);
//Put
router.get('/categorias/edit/:id', isAdmin, adminController.getEditCategory);
router.post('/categorias/edit', isAdmin, adminController.postEditCategory);
//Delete
router.post('/categorias/delete', isAdmin, adminController.deleteCategory);

//rotas de posts
router.get('/postagens', isAdmin, adminController.post);
//Insert
router.get('/postagens/add', isAdmin, adminController.getNewPost);
router.post('/postagens/add', isAdmin, adminController.postNewPost);
//Update
router.get('/postagens/edit/:id', isAdmin, adminController.getEditPost);
router.post('/postagens/edit', isAdmin, adminController.postEditPost);
//Delete
router.post('/postagens/delete', isAdmin, adminController.deletePost);

module.exports = router;