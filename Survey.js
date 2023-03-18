var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var surveySchema = new Schema({
    title : {type: String, required: true},
    description : {type: String, required: true},
    questions: [{type: String, required: true}],    //array cause well have a couple questions
    created_last: {type: Date, default: Date.now}
});

// export personSchema as a class called Person
module.exports = mongoose.model('Survey', surveySchema);


surveySchema.methods.standardizeDescription = function() {
    this.description = this.description.toLowerCase();
    return this.description;
}
