// set up Express
var express = require('express');
var app = express();

// set up BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// import the Person class from Person.js
var Survey = require('./Survey.js');

/***************************************/

//first need to create the Survey!
//This endpoint creates the Survey with a title, a description, and a set of qeustions
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
//The goal for this endpoint is to add new data (aka new questions ) to the Survey and it updates it.
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

app.use('/edit', (req, res) => {
    //this one will allow to edit the questions in the survey from an administrator side.
    const surveyId = req.body.surveyId;
    Survey.findOneAndUpdate({_id: surveyId },
        { $set: { questions: req.body.questions } },
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


app.use('/deleteQuestion', (req, res) => {

    const surveyId = req.query.surveyId;
    const questionToDelete = req.query.questionToDelete;

    Survey.findByIdAndUpdate(surveyId, { $pull: { questions: questionToDelete } }, (err, survey) => {
        if (err) {
          console.log("Error:", err);
          return res.status(500).json({ message: "Error deleting question" });
        }
    
        if (!survey) {
          console.log("Survey not found");
          return res.status(404).json({ message: "Survey not found" });
        }
    
        res.redirect('/home');
      });
});

//endpoint for viewing all the questions
app.use('/all', (req, res) => {
    
	// find all the Person objects in the database
	Survey.find( {}, (err, surveys) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
		    if (surveys.length == 0) {
			res.type('html').status(200);
			res.write('There are no surveys');
			res.end();
			return;
		    }
		    else {
			res.type('html').status(200);
			res.write('Here are the surveys in the database:');
			res.write('<ul>');
			// show all the questions in the survey
			surveys.forEach( (survey) => {
			    res.write('<li>');
			    res.write('Title: ' + survey.title + '; decription: ' + survey.description + '; questions: ' + survey.questions);
			    // this creates a link to the /delete endpoint
			    res.write(" <a href=\"/deleteQuestion?qu=" + survey.questions.questionToDelete + "\">[Delete]</a>");
			    res.write('</li>');
					 
			});
			res.write('</ul>');
			res.end();
		    }
		}
	    });
});


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
