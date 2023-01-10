const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Category');
const Category = mongoose.model('categories');
require('../models/Post')
const Post = mongoose.model('posts')
const { isAdmin } = require("../helpers/isAdm")

router.get('/', isAdmin, (req, res) => {
	res.render('admin/index');
});

router.get('/categorias', isAdmin, (req, res) => {
	const categories = Category.find().sort({ date: 'desc' })
		.then((categories) => res.render('admin/category.ejs', { categories: categories }))
		.catch((err) => {
			req.flash("error_msg", "Houve um erro ao listar as categorias")
			res.redirect("/admin")
		})
});

router.get('/categorias/add', isAdmin, (req, res) => {
	var errors = []
	res.render('admin/formCategory.ejs', { errors: errors });
});

router.post('/categorias/add', isAdmin, (req, res) => {

	var errors = []

	if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
		errors.push({ text: "Nome Inválido" })
	}
	if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
		errors.push({ text: "Slug Inválido" })
	}
	if (req.body.name.length < 2) {
		errors.push({ text: "Nome da categoria muito pequeno" })
	}

	if (errors.length > 0) {
		res.render("admin/formCategory.ejs", { errors: errors })
	} else {
		const newCategory = {
			name: req.body.name,
			slug: req.body.slug
		}

		new Category(newCategory).save()
			.then(() => {
				req.flash("success_msg", "Categoria criada com sucesso!")
				res.redirect("/admin/categorias")
			}).catch((err) => {
				req.flash("error_msg", "Houve um erro ao salvar a categoria!")
				console.log(err)
			});

	}
});

router.get("/categorias/edit/:id", isAdmin, (req, res) => {
	Category.findOne({ _id: req.params.id }).then((category) => {
		res.render('admin/editCategory', { category: category });
	}).catch((err) => {
		req.flash("error_msg", "Esta categoria não existe")
		res.redirect("/admin/categorias")
	})
})

router.post("/categorias/edit", isAdmin, (req, res) => {
	Category.findOne({ _id: req.body.id }).then((category) => {
		category.name = req.body.name
		category.slug = req.body.slug

		category.save().then(() => {
			req.flash("success_msg", "Categoria editada com sucesso!")
			res.redirect("/admin/categorias")
		}).catch((err) => {
			req.flash("error_msg", "Erro ao atualizar categoria")
			res.redirect("/admin/categorias")
		})
	})
})

router.post("/categorias/delete", isAdmin, (req, res) => {
	Category.deleteOne({ _id: req.body.id }).then(() => {
		req.flash("success_msg", "Categoria deletada com sucesso!")
		res.redirect("/admin/categorias")
	}).catch((err) => {
		req.flash("error_msg", "Erro ao deletar categoria")
		res.redirect("/admin/categorias")
	})
})

router.get("/postagens", isAdmin, (req, res) => {
	Post.find().populate("category").sort({ date: "desc" }).then((posts) => {
		res.render("admin/posts", { posts: posts })
	}).catch((err) => {
		req.flash("error_msg", "Houve um erro ao carregar as postagens")
	})
})

router.get("/postagens/add", isAdmin, (req, res) => {
	var errors = []
	Category.find().then((categories) => {
		res.render("admin/formPosts", { categories: categories, errors: errors })
	}).catch((err) => {
		req.flash("error_msg", "Houve um erro ao carregar o formulário")
	})
})

router.post("/postagens/add", isAdmin, (req, res) => {
	const newPost = {
		title: req.body.title,
		slug: req.body.slug,
		description: req.body.description,
		content: req.body.content,
		category: req.body.category
	}

	new Post(newPost).save().then(() => {
		req.flash("success_msg", "Post criado com sucesso!")
		res.redirect("/admin/postagens")
	}).catch((e) => {
		req.flash("error_msg", "Erro ao criar postagem")
		res.redirect("admin/postagens")
	})
})

router.get("/postagens/edit/:id", isAdmin, (req, res) => {
	let errors = []
	Post.findOne({ _id: req.params.id }).then((post) => {

		Category.find().then((categories) => {
			res.render("admin/editPosts", { categories: categories, post: post, errors: errors })

		}).catch((err) => {
			req.flash("error_msg", "Houve um erro ao listar as categorias")
			res.redirect("/admin/postagens")
		})

	}).catch((err) => {
		req.flash("error_msg", "Houve uma falha ao editar")
		res.redirect("/admin/postagens")
	})
})

router.post("/postagens/edit", isAdmin, (req, res) => {
	Post.findOne({ _id: req.body.id }).then((post) => {

		post.title = req.body.title
		post.slug = req.body.slug
		post.description = req.body.description
		post.content = req.body.content
		post.category = req.body.category

		post.save().then(() => {
			req.flash("success_msg", "Post editado com sucesso!")
			res.redirect("/admin/postagens")
		}).catch((err) => {
			req.flash("error_msg", "Houve uma falha ao editar" + err)
			res.redirect("/admin/postagens")
		})
	})
})

router.post("/postagens/delete", isAdmin, (req, res) => {
	Post.deleteOne({ _id: req.body.id }).then((post) => {
		req.flash("success_msg", "Postagem deletada com sucesso!")
		res.redirect("/admin/postagens")
	}).catch((err) => {
		req.flash("error_msg", "Houve uma falha ao deletar")
		res.redirect("/admin/postagens")
	})
})

module.exports = router;