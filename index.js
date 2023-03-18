var express = require('express');
var app = express();

// set up BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// import the Person class from Person.js
var Survey = require('./Survey.js');


app.use("/add", (req, res)=> {
    var addSurvey = new Survey({
        title: req.body.title,
        description : req.body.description,
        questions: req.body.questions,
    });
    addSurvey.save((err)=>{
        if (err) {
            res.type('html').status(200);
            res.write('uh oh: ' + err);
            console.log(err);
            res.end();
        } else if (!Survey) {
            res.json({'status': 'error'});
            console.log('error')
        } else {
            res.send('status' + addSurvey + ' success');
        }
    });
});


//endpoint to edit survey data.


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
