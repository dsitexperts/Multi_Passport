var Admin = require('./models/admin');
module.exports = function(app, passport){
	app.get('/admin', function(req, res){
		res.render('index1.ejs');
	});

	app.get('/adminlogin', function(req, res){
		res.render('login1.ejs', { message: req.flash('loginMessage') });
	});
	app.post('/adminlogin', passport.authenticate('local-adminlogin', {
		successRedirect: '/adminprofile',
		failureRedirect: '/login1',
		failureFlash: true
	}));

	app.get('/adminsignup', function(req, res){
		res.render('signup1.ejs', { message: req.flash('signupMessage') });
	});


	app.post('/adminsignup', passport.authenticate('local-adminsignup', {
		successRedirect: '/admin',
		failureRedirect: '/adminsignup',
		failureFlash: true
	}));

	app.get('/adminprofile', isLoggedIn, function(req, res){
		res.render('profile1.ejs', { user: req.user });
	});

	app.get('/:username1/:password1', function(req, res){
		var newAdmin = new Admin();
		newAdmin.local.username1 = req.params.username1;
		newAdmin.local.password1 = req.params.password1;
		console.log(newUser.local.username1 + " " + newUser.local.password1);
		newAdmin.save(function(err){
			if(err)
				throw err;
		});
		res.send("Success!");
	});



	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	})
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/adminlogin');
}