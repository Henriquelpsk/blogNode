//Modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const admin = require('./routes/admin');
const user = require('./routes/user')
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./models/Post')
const Post = mongoose.model('posts')
require('./models/Category')
const Category = mongoose.model('categories')
require("./config/auth")(passport)

//Session
app.use(session({
	secret: 'teste',
	resave: true,
	saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
//Middleware
app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg")
	res.locals.error_msg = req.flash("error_msg")
	res.locals.error = req.flash("error")
	res.locals.user = req.user || null
	next()
})
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
app.use(express.static(path.join(__dirname, 'public')));
//Routes
app.get('/', (req, res) => {
	Post.find().populate("category").sort({ date: 'desc' }).then((posts) => {
		res.render('admin/index', { posts: posts })
	}).catch((err) => {
		req.flash("error_msg", "Houve um erro intero")
		res.redirect("/404")
	})
})

app.get('/postagem/:slug', (req, res) => {
	Post.findOne({ slug: req.params.slug }).then((post) => {
		if (post) {
			res.render('post/index', { post: post })
		} else {
			req.flash("error_msg", "Esta postagem não existe")
			res.redirect("/")
		}
	}).catch((err) => {
		req.flash("error_msg", "Houve um erro intero")
		res.redirect("/")
	})
})

app.get('/categorias', (req, res) => {
	Category.find().sort({ name: 'desc' }).then((categories) => {
		res.render("categories/index", { categories: categories })
	})
})

app.get('/categorias/:slug', (req, res) => {
	Category.findOne({ slug: req.params.slug }).then((category) => {
		if (category) {
			Post.find({ category: category._id }).then((posts) => {
				res.render("categories/posts", { posts: posts })
			}).catch((err) => {
				req.flash("error_msg", "Houve um erro ao carregar as postagens com essa categoria")
				res.redirect('/')
			})

		} else {
			req.flash("error_msg", "Esta categoria não existe")
			res.redirect('/')
		}
	}).catch((err) => {
		req.flash("error_msg", "Houve um erro interno ao carregar a página desta categoria")
		res.redirect('/')
	})
})

app.get('/404', (req, res) => {
	res.send('erro 404')
})

app.use('/admin', admin);
app.use('/usuario', user);
//Others
const PORT = 8081;
app.listen(PORT, () => {
	console.log('Servidor aberto em: ');
	console.log('http://localhost:' + PORT);
})