const exprexss = require('express');
const router = exprexss.Router();
const userController = require('../controllers/userController');

//registro
router.get('/registro', userController.getRegister);
router.post('/registro', userController.postRegister);
//login
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
//logout
router.get('/logout',userController.getLogout);
module.exports = router;