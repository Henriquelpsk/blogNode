const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
	title: {
		type: String,
		requird: true
	},
	slug: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: "categories",
		required: true
	},
	date: {
		type: Date,
		default: Date.now()
	}
})

mongoose.model('posts', Post)