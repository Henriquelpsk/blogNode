//Modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const admin = require('./routes/admin');
const user = require('./routes/user');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./config/auth')(passport);
const homeController = require('./controllers/homeController');

//Session
app.use(session({
	secret: 'teste',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//Middleware
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});
//Configs
//Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Ejs
app.set('view engine', 'ejs');
//Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogapp')
	.then(() => console.log('Concetado ao Mongo'))
	.catch((err) => console.log('Erro ao se conectar: ' + err));
//Public
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));
//Routes
app.get('/', homeController.index);
app.get('/postagem/:slug', homeController.postSlug);
app.get('/categorias', homeController.category);
app.get('/categorias/:slug', homeController.categorySlug);
app.use('/admin', admin);
app.use('/usuario', user);
app.get('/404', homeController.err404);
//Others
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
	console.log('Servidor aberto em: ');
	console.log('http://localhost:' + PORT);
});