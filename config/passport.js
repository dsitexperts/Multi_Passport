var LocalStrategy = require('passport-local').Strategy;


var User            = require('../app/models/user');
var Admin = require('../app/models/admin');

module.exports = function(passport) {


	passport.serializeUser(function(user, done){
		console.log(user.id);
		if(User(user)){
		done(null, user);
		}else if(Admin(user)){
			done(null, user);
		}
		
	});

	passport.deserializeUser(function(user, done){
		if(User(user)){
		User.find(user, function(err, user){
			done(err, user);
		})
		} else if(Admin(user)){
			User.find(user, function(err, user){
			done(err, user);
			})
		}
		});


	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({'local.username': email}, function(err, user){
				if(err)
					return done(err);
				if(user){
					return done(null, false, req.flash('signupMessage', 'That email already taken'));
				} else {
					var newUser = new User();
					newUser.local.username = email;
					newUser.local.password = newUser.generateHash(password);

					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					})
				}
			})

		});
	}));
	passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done){
			process.nextTick(function(){
				User.findOne({ 'local.username': email}, function(err, user){
					if(err)
						return done(err);
					if(!user)
						return done(null, false, req.flash('loginMessage', 'No User found'));
					if(!user.validPassword(password)){
						return done(null, false, req.flash('loginMessage', 'invalid password'));
					}
					return done(null, user);

				});
			});
		}
	));
passport.use('local-adminsignup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			Admin.findOne({'local.username': email}, function(err, admin){
				if(err)
					return done(err);
				if(admin){
					return done(null, false, req.flash('signupMessage', 'That email already taken'));
				} else {
					var newAdmin = new Admin();
					newAdmin.local.username = email;
					newAdmin.local.password = newAdmin.generateHash(password);

					newAdmin.save(function(err){
						if(err)
							throw err;
						return done(null, newAdmin);
					})
				}
			})

		});
	}));	
	
passport.use('local-adminlogin', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done){
			process.nextTick(function(){
				Admin.findOne({ 'local.username': email}, function(err, admin){
					if(err)
						return done(err);
					if(!admin)
						return done(null, false, req.flash('loginMessage', 'No User found'));
					if(!admin.validPassword(password)){
						return done(null, false, req.flash('loginMessage', 'invalid password'));
					}
					return done(null, admin);

				});
			});
		}
	));
	};
	
	exports.loginUser = function(req,res, next){
		passport.authenticate('local-login', function(err, user, info){
			var error = err || info;
			if(error) return res.json(401,error);
			req.logIn(user, function(err){
				if(err) return res.send(err);
				res.json(req.user.userInfo);
			})
		})(req, res, next);
	};
	
	exports.loginAdmin = function(req,res, next){
		passport.authenticate('local-adminlogin', function(err, admin, info){
			var error = err || info;
			if(error) return res.json(401,error);
			req.logIn(admin, function(err){
				if(err) return res.send(err);
				res.json(req.user.userInfo);
			})
		})(req, res, next);
	};