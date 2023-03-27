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
    newQuestion.save()
        .then(() => {
            console.log('Survey added:', newQuestion);
            res.redirect('/all.html');
           // res.json({ success: 'Question' + ' " ' + newQuestion.questionText + ' " ' + ' saved successfully.' });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Survey could not be saved.' });
        });
});


//so i used app.get bc those are the ones that deal with the http requests.

/* This endpoint uses app.get to edit a question. The app.get renders the edit form  */
app.get('/edit', (req, res) => {
    const questionText = req.query.text;

    // Find the question in the database
    Question.findOne({questionText}, (err, question) => {
        if (err) {
            console.error(err);
            res.status(500).json({error: 'Could not find question.'});
        } else {
            // Render the HTML form for editing the question
            res.send(`
        <html>
          <head>
           <link rel="stylesheet" href="app.css" />
            <link
            rel="stylesheet"
            href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.no-icons.min.css"
            />
            <title>Please Edit Question</title>
          </head>
          <body>
            <h1>Edit Question</h1>
            <form method="POST" action="/edit">
              <label for="questionText">Question Text:</label>
              <input type="text" name="questionText" value="${question.questionText}">
              <input type="hidden" name="questionId" value="${question._id}">
              <input type="submit" value="Update">
            </form>
          </body>
        </html>
      `);
        }
    });
});


/*  This endpoint uses app.post because it handles HTTP POST request specifically */

app.post('/edit', (req, res) => {
    const { questionText, questionId } = req.body;

    // Update the question in the database
    Question.findByIdAndUpdate(
        questionId,
        { questionText },
        { new: true },
        (err, question) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Could not update question.' });
            } else {
                console.log('Question updated:', question);
                res.redirect('/all.html');
            }
        }
    );
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

    //res.json({ success: 'Deleted' });
    res.redirect('/all.html');

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
