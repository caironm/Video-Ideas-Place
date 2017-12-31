const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Idea');
const Idea = mongoose.model('ideas');
const {ensureAuthenticated} = require('../helpers/auth');


router.post('/', ensureAuthenticated, (req, res) => {
	let errors = [];
	if(!req.body.title){
		errors.push({text: 'Please add a title'})
	}
	if(!req.body.details){
		errors.push({text:'Please add some details'})
	}

	if(errors.length > 0){
		res.render('ideas/add', {errors: errors, 
			title: req.body.title,
			details: req.body.details
		})
	}else{
		const newUser = {
			title: req.body.title,
			details: req.body.details,
			user: req.user.id
		}
		new Idea(newUser).save().then((idea) => {
			req.flash('success_msg', 'Video Idea Created!')
			res.redirect("/ideas")
		})
	}
});

router.get('/add', ensureAuthenticated, (req, res) => {
	res.render("ideas/add");
})

router.get('/', ensureAuthenticated, (req, res) => {
	Idea.find({user: req.user.id}).sort({date:'desc'}).then(ideas => {
		res.render('ideas/index', {
			ideas: ideas
		})
	})
})

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Idea.findOne({
		_id: req.params.id
	}).then(idea => {
		if(idea.user != req.user.id){
			req.flash('error_msg', 'Você não tem permissão para editar esta ideia')
			res.redirect('/ideas')
		}
		res.render('ideas/edit', {idea:idea});
		console.log(idea)
	})
})

router.put('/:id', ensureAuthenticated, (req, res) => {
	Idea.findOne({
		_id: req.params.id
	}).then(idea => {
		idea.title = req.body.title
		idea.details = req.body.details
		idea.save().then(idea => {
			req.flash('success_msg', 'Video Idea Updated')
			res.redirect('/ideas')
		})
	})
})


router.delete('/:id', ensureAuthenticated, (req,res)=>{
	Idea.remove({_id: req.params.id})
	.then(() => {
		req.flash('success_msg', 'Video Idea Removed')
		res.redirect('/ideas');
	})
})




module.exports = router;