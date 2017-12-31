const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs")
const passport = require('passport')
const mongoose = require('mongoose')

//load user model
require('../models/User')
const User = mongoose.model('users')

//const passport = require('passport')
router.get('/login', (req, res) => {
	res.render('users/login')
})

router.post('/login', (req, res, next) => {
	passport.authenticate('local',{
		successRedirect: '/ideas',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next)
})

router.get('/register', (req, res) => {
	res.render('users/register')
})

// Register form

router.post('/register', (req, res) => {
	let errors = [];
	if(req.body.password != req.body.repeatPassword){
		errors.push({text: "As senhas são diferentes"})
	}

	if(req.body.password.length < 4){
		errors.push({text: "A senha eh muito pequena"})
	}

	if(errors.length > 0){
		res.render('users/register', {
			errors: errors,
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		});	
	}else{
		User.findOne({email: req.body.email})
			.then(user => {
				if(user){
					req.flash("error_msg", "Já existe um conta com esse email")
					res.redirect("/users/register")
					return 
				}else{
					const newUser = new User({
						name: req.body.name,
						email: req.body.email,
						password: req.body.password
					})
			
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if(err) throw err;
							newUser.password = hash;
							newUser.save().then(user => {
								req.flash('success_msg', 'Conta criada com sucesso')
								res.redirect('login');
							}).catch(err => {
								console.log(err)
								return;
							})
						});
					})
				}
			})
	}
})

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg','Deslogado')
	res.redirect('/users/login')
})

module.exports = router