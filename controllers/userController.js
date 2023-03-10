const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('users');
const bCrypt = require('bcryptjs');
const passport = require('passport');

exports.getRegister =  (req, res) => {
	var errors = [];
	res.render('users/register', { errors: errors });
};

exports.postRegister = (req, res) => {
	var errors = [];

	if (!req.body.name || req.body.name == 'undefined' || req.body.name == null) {
		errors.push({ text: 'Nome inválido' });
	}
	if (!req.body.email || req.body.email == 'undefined' || req.body.email == null) {
		errors.push({ text: 'Email inválido' });
	}
	if (!req.body.password || req.body.password == 'undefined' || req.body.password == null) {
		errors.push({ text: 'Senha inválida' });
	}

	if (req.body.password.length < 4) {
		errors.push({ text: 'Senha muito curta' });
	}

	if (req.body.password !== req.body.password2) {
		errors.push({ text: 'As senhas devem ser iguais' });
	}

	if (errors.length > 0) {
		res.render('users/register', { errors: errors });
	} else {
		User.findOne({ email: req.body.email }).then((user) => {
			if (user) {
				req.flash('error_msg', 'Já existe uma conta com esse email no nosso sistema');
				res.redirect('/usuario/registro');
			} else {
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password
				});

				bCrypt.genSalt(10, (err, salt) => {
					bCrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) {
							req.flash('error_msg', 'Houve um erro durante o salvamento do usuario');
							res.redirect('/');
						}

						newUser.password = hash;

						newUser.save().then(() => {
							req.flash('success_msg', 'Usuario criado com sucesso!');
							res.redirect('/');
						}).catch(() => {
							req.flash('error_msg', 'Houve um erro ao criar o usuario');
							res.redirect('/');
						});
					});
				});
			}
		}).catch(() => {
			req.flash('error_msg', 'Houve um erro intero');
			res.redirect('/');
		});

	}
};

exports.getLogin = (req, res) => {
	var errors = [];
	res.render('users/login', { errors: errors });
};

exports.postLogin =  (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/usuario/login',
		failureFlash: true
	})(req, res, next);
};

exports.getLogout = (req, res) => {
	req.logout(() => {
		req.flash('success_msg', 'Deslogado com sucesso!');
		res.redirect('/');
	});
};
