var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var questionSchema = new Schema({
	questionText: {type: String, required: true, unique: true},
    });

// export personSchema as a class called Person
module.exports = mongoose.model('Question', questionSchema);

questionSchema.methods.standardizeQuestionText = function() {
    this.questionText = this.questionText.toLowerCase();
    return this.questionText;
}
