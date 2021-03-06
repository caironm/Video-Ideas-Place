const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema fields

const UserSchema = new Schema({
	name:{
		type: String,
		required: true
	},
	email:{
		type: String,
		required: true
    },
    password:{
		type: String,
		required: true
    },
    role:{
        type: Number,
        required: true,
        default: 0
    },
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('users', UserSchema);