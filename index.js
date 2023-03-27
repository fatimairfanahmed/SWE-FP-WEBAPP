// set up Express
var express = require('express');
var app = express();

// set up BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const Question = require('./Question.js');

/***************************************/

//first need to create the Survey!
//This endpoint creates the Survey with a title, a description, and a set of qeustions
app.use('/create', (req, res)=> {
	// construct the Question from the form data which is in the request body
	var newQuestion = new Question ({
		questionText: req.body.questionText, 
        });

    newQuestion.save( (err) => { 
        if (err) {
            res.type('html').status(200);
            res.write('uh oh: ' + err);
            console.log(err);
            res.end();
        }
        else {
        // display the "successfull created" message
            res.send('successfully added ' + newQuestion.questionText + ' to the database');
        }
        });

    });


//endpoint to add survey data
//The goal for this endpoint is to add new data (aka new questions ) to the Survey and it updates it.
//Leaving for Jenii to decide
app.use('/add', (req, res) =>{
    const surveyId = req.body.surveyId;
        Survey.findOneAndUpdate(
            { _id: surveyId }, //id so we can get the survey we want to update
            { $push: { questions: req.body.questions } }, //adds the new question into the array and updates
            { new: true }
        )
            .then(survey => {
                if(!survey){
                    res.status(200).json({error : "Survey not found"});
                }
                console.log('Survey updated:', survey);
                res.json({ success: 'Survey updated successfully.' });
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: 'Survey could not be updated.' });
            });
});


//endpoint for viewing all the questions
app.use('/all', (req, res) => {
	Question.find( {}, (err, questions) => {
		if (err) {
            res.status(500).json({ error: err });
		}
		else {
            const questionList = [];

            questions.forEach((question) => {
              questionList.push({
                question: question.questionText,
                deleteLink: "/delete?text=" + question.questionText,
                editLink: "/edit?text=" + question.questionText
              });
            });
            res.json(questionList); // Send questionList as JSON
        }
	    });
});


app.use('/delete', (req, res) => {

    res.json({ success: 'Deleted' });

});



app.use(express.static(__dirname));


app.use('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.use('/profile', (req, res) => {

});

app.post('/', (req, res) => {
    
});



 app.listen(3000, () => {
	console.log('Listening on port 3000');
    });
