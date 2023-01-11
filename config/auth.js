const localStragegy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bCrypt = require('bcryptjs');

//Model do usuario
require('../models/User');
const User = mongoose.model('users');

module.exports = function (passport) {

	passport.use(new localStragegy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
		User.findOne({ email: email }).then((user) => {
			if (!user) {
				return done(null, false, { message: 'Esta conta não existe!' });
			}

			bCrypt.compare(password, user.password, (err, same) => {
				if (same) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Senha incorreta' });
				}
			});
		});
	}));

	passport.serializeUser((user, done) => {

		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
};
