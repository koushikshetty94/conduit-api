const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('slug');

articleSchema = new Schema({
    slug: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    tagList: [{
        type: String
    }],
    favorited: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true })


articleSchema.pre('save', async function (next) {
    this.slug = await slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
    console.log(this.slug)
    next()
})

module.exports = mongoose.model("Article", articleSchema)