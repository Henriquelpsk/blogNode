module.exports = {
	isAdmin: function (req, res, next) {

		if (req.isAuthenticated() && req.user.isAdm == 1) {
			return next();
		}

		req.flash('error_msg', 'Você precisa ser um admin para acessar essa área');
		res.redirect('/');
	}
};