var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var answerSchema = new Schema({
    answerQuestion: {type: String, required: true, unique: false},
    answerText: {type: String, required: true, unique: false},
    answerNumber: {type: String, required: true, unique: false},
    date: {type: String, required: true, unique: false}, //string formatted yearmonthday, ex 20230414
    user: {type: String, required: true, unique: false} //username of the person responding to the question
});

// export personSchema as a class called Person
module.exports = mongoose.model('Answer', answerSchema);

answerSchema.methods.standardizeAnswerText = function() {
    this.answerText = this.answerText.toLowerCase();
    return this.answerText;
}