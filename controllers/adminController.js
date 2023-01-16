const mongoose = require('mongoose');
require('./models/Category');
const Category = mongoose.model('categories');
require('../models/Post');
const Post = mongoose.model('posts');

exports.index =  (req, res) => {
	res.render('admin/index');
};

//Category
exports.category = (req, res) => {
	Category.find().sort({ date: 'desc' })
		.then((categories) => res.render('admin/category.ejs', { categories: categories }))
		.catch(() => {
			req.flash('error_msg', 'Houve um erro ao listar as categorias');
			res.redirect('/admin');
		});
};

exports.getNewCategory = (req, res) => {
	var errors = [];
	res.render('admin/formCategory.ejs', { errors: errors });
};

exports.postNewCategory =  (req, res) => {

	var errors = [];

	if (!req.body.name || typeof req.body.name == 'undefined' || req.body.name == null) {
		errors.push({ text: 'Nome Inválido' });
	}
	if (!req.body.slug || typeof req.body.slug == 'undefined' || req.body.slug == null) {
		errors.push({ text: 'Slug Inválido' });
	}
	if (req.body.name.length < 2) {
		errors.push({ text: 'Nome da categoria muito pequeno' });
	}

	if (errors.length > 0) {
		res.render('admin/formCategory.ejs', { errors: errors });
	} else {
		const newCategory = {
			name: req.body.name,
			slug: req.body.slug
		};

		new Category(newCategory).save()
			.then(() => {
				req.flash('success_msg', 'Categoria criada com sucesso!');
				res.redirect('/admin/categorias');
			}).catch((err) => {
				req.flash('error_msg', 'Houve um erro ao salvar a categoria!');
				console.log(err);
			});

	}
};

exports.getEditCategory = (req, res) => {
	Category.findOne({ _id: req.params.id }).then((category) => {
		res.render('admin/editCategory', { category: category });
	}).catch(() => {
		req.flash('error_msg', 'Esta categoria não existe');
		res.redirect('/admin/categorias');
	});
};

exports.postEditCategory =(req, res) => {
	Category.findOne({ _id: req.body.id }).then((category) => {
		category.name = req.body.name;
		category.slug = req.body.slug;

		category.save().then(() => {
			req.flash('success_msg', 'Categoria editada com sucesso!');
			res.redirect('/admin/categorias');
		}).catch(() => {
			req.flash('error_msg', 'Erro ao atualizar categoria');
			res.redirect('/admin/categorias');
		});
	});
};

exports.deleteCategory =  (req, res) => {
	Category.deleteOne({ _id: req.body.id }).then(() => {
		req.flash('success_msg', 'Categoria deletada com sucesso!');
		res.redirect('/admin/categorias');
	}).catch(() => {
		req.flash('error_msg', 'Erro ao deletar categoria');
		res.redirect('/admin/categorias');
	});
};

// Posts

exports.post =  (req, res) => {
	Post.find().populate('category').sort({ date: 'desc' }).then((posts) => {
		res.render('admin/posts', { posts: posts });
	}).catch(() => {
		req.flash('error_msg', 'Houve um erro ao carregar as postagens');
	});
};

exports.getNewPost = (req, res) => {
	var errors = [];
	Category.find().then((categories) => {
		res.render('admin/formPosts', { categories: categories, errors: errors });
	}).catch(() => {
		req.flash('error_msg', 'Houve um erro ao carregar o formulário');
	});
};

exports.postNewPost = (req, res) => {
	const newPost = {
		title: req.body.title,
		slug: req.body.slug,
		description: req.body.description,
		content: req.body.content,
		category: req.body.category
	};

	new Post(newPost).save().then(() => {
		req.flash('success_msg', 'Post criado com sucesso!');
		res.redirect('/admin/postagens');
	}).catch(() => {
		req.flash('error_msg', 'Erro ao criar postagem');
		res.redirect('admin/postagens');
	});
};

exports.getEditPost = (req, res) => {
	let errors = [];
	Post.findOne({ _id: req.params.id }).then((post) => {

		Category.find().then((categories) => {
			res.render('admin/editPosts', { categories: categories, post: post, errors: errors });

		}).catch(() => {
			req.flash('error_msg', 'Houve um erro ao listar as categorias');
			res.redirect('/admin/postagens');
		});

	}).catch(() => {
		req.flash('error_msg', 'Houve uma falha ao editar');
		res.redirect('/admin/postagens');
	});
};

exports.postEditPost =  (req, res) => {
	Post.findOne({ _id: req.body.id }).then((post) => {

		post.title = req.body.title;
		post.slug = req.body.slug;
		post.description = req.body.description;
		post.content = req.body.content;
		post.category = req.body.category;

		post.save().then(() => {
			req.flash('success_msg', 'Post editado com sucesso!');
			res.redirect('/admin/postagens');
		}).catch((err) => {
			req.flash('error_msg', 'Houve uma falha ao editar' + err);
			res.redirect('/admin/postagens');
		});
	});
};

exports.deletePost =  (req, res) => {
	Post.deleteOne({ _id: req.body.id }).then(() => {
		req.flash('success_msg', 'Postagem deletada com sucesso!');
		res.redirect('/admin/postagens');
	}).catch(() => {
		req.flash('error_msg', 'Houve uma falha ao deletar');
		res.redirect('/admin/postagens');
	});
};