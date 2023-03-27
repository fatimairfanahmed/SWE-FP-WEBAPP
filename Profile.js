var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');


var Schema = mongoose.Schema;


var profSchema = new Schema({
    title: {type: String, required: false},
    description: {type: String, required: false},
    email: {type: String, required: true},
    password: {type: String, required: true},
    userName: {type: String, required: true},
    created_last: {type: Date, default: Date.now}
});


module.exports = mongoose.model('Profile', profSchema);
