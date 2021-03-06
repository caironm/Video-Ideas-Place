const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema fields

const IdeaSchema = new Schema({
	title:{
		type: String,
		required: true
	},
	details:{
		type: String,
		required: true
	},
	user: {
		type: String,
		require: true
	},
	date: {
		type: Date,
		default: Date.now
	}

});

mongoose.model('ideas', IdeaSchema);