var express = require('express');
var app = express();

// set up BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// import the Person class from Person.js
var Survey = require('./Survey.js');

// first need to create the Survey!
/*
This endpoint creates the Survey with a title, a description, and a set of qeustions
 */
app.use('/create', (req, res)=> {
    var addSurvey = new Survey({
        title: req.body.title,
        description : req.body.description,
        questions: req.body.questions,
    });
    addSurvey.save()
        .then(() => {
            console.log('Survey added:', addSurvey);
            res.json({ success: 'Survey saved successfully.' });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Survey could not be saved.' });
        });
    });



//endpoint to add survey data
/*
The goal for this endpoint is to add new data (aka new questions ) to the Survey and it updates it.
 */
app.use('/add', (req, res) =>{
    const surveyId = req.body.surveyId;
        Survey.findOneAndUpdate(
            { _id: surveyId },
            { $push: { questions: req.body.questions } },
            { new: true }
        )
            .then(survey => {
                console.log('Survey updated:', survey);
                res.json({ success: 'Survey updated successfully.' });
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: 'Survey could not be updated.' });
            });
});

app.use('/edit', (req, res) => {
    //this one will allow to edit the questions in the survey from an administrator side.

});


/*I edited the index.html file so it shows me to create the survey. and the /add feature. I think we have to fix it though
 b/c rn, it shows me both tasks on the same page, and ideally i think we want the create survey, and then
 in the view feature should be a button to add a question to the survey (i think?
 */

app.use('/home', (req, res) => {

    res.send("hello word\n");
 });

app.use(express.static(__dirname));





app.use('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.use('/profile', (req, res) => {

});

app.post('/', (req, res) => {
    
});







// add endpoint




 app.listen(3000, () => {
	console.log('Listening on port 3000');
    });
