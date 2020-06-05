var mongoose = require('mongoose');
var Schema = mongoose.Schema;

commentSchema = new Schema({
  body:{
    type: String
  },
  author:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  article:{
    type: Schema.Types.ObjectId,
    ref: 'Article' }
},{ timestamps: true })


module.exports = mongoose.model('Comment',commentSchema)