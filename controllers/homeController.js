const mongoose = require('mongoose');
require('./models/Post');
const Post = mongoose.model('posts');
require('./models/Category');
const Category = mongoose.model('categories');

exports.index = (req, res) => {
	Post.find().populate('category').sort({ date: 'desc' }).then((posts) => {
		res.render('admin/index', { posts: posts });
	}).catch(() => {
		req.flash('error_msg', 'Houve um erro intero');
		res.redirect('/404');
	});
};

exports.postSlug =  (req, res) => {
	Post.findOne({ slug: req.params.slug }).then((post) => {
		if (post) {
			res.render('post/index', { post: post });
		} else {
			req.flash('error_msg', 'Esta postagem não existe');
			res.redirect('/');
		}
	}).catch(() => {
		req.flash('error_msg', 'Houve um erro intero');
		res.redirect('/');
	});
};

exports.category = (req, res) => {
	Category.find().sort({ name: 'desc' }).then((categories) => {
		res.render('categories/index', { categories: categories });
	});
};

exports.categorySlug = (req, res) => {
	Category.findOne({ slug: req.params.slug }).then((category) => {
		if (category) {
			Post.find({ category: category._id }).then((posts) => {
				res.render('categories/posts', { posts: posts });
			}).catch(() => {
				req.flash('error_msg', 'Houve um erro ao carregar as postagens com essa categoria');
				res.redirect('/');
			});

		} else {
			req.flash('error_msg', 'Esta categoria não existe');
			res.redirect('/');
		}
	}).catch(() => {
		req.flash('error_msg', 'Houve um erro interno ao carregar a página desta categoria');
		res.redirect('/');
	});
};

exports.err404 =  (req, res) => {
	res.send('erro 404');
};