// set up Express
var express = require('express');
var app = express();

// set up BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const Question = require('./Question.js');
var Profile = require('./Profile.js');

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
            console.log('Question added:', newQuestion);
            res.redirect('/index.html'); //was create.html
           // res.json({ success: 'Question' + ' " ' + newQuestion.questionText + ' " ' + ' saved successfully.' });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Question could not be saved.' });
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


app.get('/delete', (req, res) => {
    const questionText = req.query.text;
  
    // Find the question in the database and delete it
    Question.findOneAndDelete({ questionText }, (err, question) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not delete question.' });
      } else if (!question) {
        res.status(404).json({ error: 'Question not found.' });
      } else {
        console.log('Question deleted:', question);
        res.redirect('/all.html');
      }
    });
  });



app.use(express.static(__dirname));


app.use('/createquestion', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

/**app.use('/ ', (req, res) => {
  res.sendFile(__dirname + '/loginForm.html');
});*/


app.use('/loginsuccess', (req, res) => {
  res.type('html').status(200);
  res.write('<li>');
  res.write("Login successful, welcome!");
  res.write('<ul>')
  res.write(" <a href=\"/createquestion" + "\">[Add a survey question]</a>");
  res.write('</li>');
  res.write('<ul>')
  res.write(" <a href=\"/allprofiles" + "\">[View user profiles]</a>");
  res.write('</li>');
  res.end();
});



app.use('/signup', (req, res) => {
  res.sendFile(__dirname + "/createprofile.html");
});


app.use('/createprof', (req, res) =>{


  var newProf = new Profile ({
      email: req.query.email,
      password: req.query.password,
      userName: req.query.userName
  });


  Profile.findOne({ userName: req.query.userName})
      .then((user)=>{
          if(user != null){
              res.type('html').status(200);
              res.write('<li>');
              res.write("Username: \"" + req.query.userName + "\" is taken.");
              res.write('<ul>')
              res.write(" <a href=\"/signup" + "\">[Try another username]</a>");
              res.write('</li>');
              res.end();
          }
          else{
              newProf.save()
          .then(() => {
              res.redirect('/allProfiles');
          })
          .catch((error) => {
              console.log(error);
          });
          }
      })
      .catch((err)=>{
          console.log(err);
      });


     
         
         
         
         
});


app.use('/login', (req, res) =>{
  res.sendFile(__dirname + "/loginForm.html");
});


app.use('/verifyLogin', (req, res) => {
  var combo = new Profile({
      userName: req.query.userName,
      password: req.query.password
  });


  Profile.findOne({ userName: combo.userName})
  .then((user) =>{
      if(user == null){
          res.type('html').status(200);
              res.write('<li>');
              res.write("No account with username: " + combo.userName + " exists. ");
              res.write('<ul>')
              res.write(" <a href=\"/signup" + "\">[Create an account]</a>");
              res.write('</li>');
              res.write(" <a href=\"/login" + "\">[Try a different Login]</a>");
              res.end();
      }
      else{
          if(user.password == combo.password){
              res.redirect('/loginsuccess'); // should be to home page
          }
          else{
              res.type('html').status(200);
              res.write('<li>');
              res.write("Incorrect password");
              res.write('<ul>')
              res.write(" <a href=\"/signup" + "\">[Create an account]</a>");
              res.write('</li>');
              res.write(" <a href=\"/login" + "\">[Try a different Login]</a>");
              res.end();
          }
      }
  })
  .catch((err) =>{
      console.log(err);
  })
});


app.use('/deleteProfile', (req, res) => {
  var filter = { 'userName' : req.query.userName };
      Profile.findOneAndDelete( filter, (err, profile) => {
          if(err) {
              //res.json({ 'status' : err });
              res.type('html').status(200);
              res.write('<li>');
              res.write(err);
              res.write('</li>');
          }
          else if(!profile){
              res.type('html').status(200);
              res.write('<li>');
              res.write('No Profile with that username exists');
              res.write('</li>');
          }
          else{
              res.type('html').status(200);
              res.write('<li>');
              res.write("User profile " + profile.userName + " successfully deleted. ");
              res.write('<ul>')
              res.write(" <a href=\"/allProfiles" + "\">[Return to profile list]</a>");
              res.write('</li>');
          }
          res.end();


   });
});






app.use('/allProfiles', (req, res) => {
  var prof = new Profile ({
      email: req.query.email,
      password: req.query.password,
      userName: req.query.userName
  });


  Profile.find( {}, (err, profiles) => {
          if (err){
              res.type('html').status(200);
              console.log('error: ' + err);
              res.write(err);
          }
          else{
              if (profiles.length ==0){
                  res.type('html').status(200);
                  res.write('No profiles');
                  res.end();
                  return;
              }
              else{
                  res.type('html').status(200);
                  res.write('Here are the profiles in the database:');
                  res.write('<ul>');
                  res.write(" <a href=\"/signup\">[Add New]</a>");
                  res.write('<ul>');
                  profiles.forEach( (profile) => {
                      res.write('<li>');
                      res.write('Username: ' + profile.userName + '\nEmail: ' + profile.email + '\nPassword: ' + profile.password);
                      res.write(" <a href=\"/deleteProfile?userName=" + profile.userName + "\">[Delete]</a>");
                      res.write(" <a href=\"/editemail?userName=" + profile.userName + "\">[Change Email]</a>");
                      res.write(" <a href=\"/editpassword?userName=" + profile.userName + "\">[Change Password]</a>");
                      res.write('</li>');
                  });
                  res.write('</ul>');
                  res.write(" <a href=\"/loginsuccess\">[return]</a>");
                  res.end();


              }
          }
      });
});


app.use('/editemail', (req, res) =>{
  res.type('html').status(200);
  res.write('<body><h2>change email</h2>');
  res.write('<form action="/changeemail" >');
  //res.write('<label for="Username">Username: ' + req.query.userName + '</label><br>');
  res.write('<input type="text" id="userName" name="userName" value=\"'+ req.query.userName +'\"><br><br>');
  res.write('<label for="email">New Email:</label><br>');
  res.write('<input type="text" id="email" name="email" value="Email"><br><br>');
  res.write('<input type="submit" value="Submit">');
  res.write('</form> ');
  res.write('</body>');
  //res.sendFile(__dirname + '/changeemail.html');
  //take in new email
  //send to change email
});


app.use('/editpassword', (req, res) =>{
  res.type('html').status(200);
  res.write('<body><h2>change email</h2>');
  res.write('<form action="/changepwd" >');
  //res.write('<label for="Username">Username: ' + req.query.userName + '</label><br>');
  res.write('<input type="text" id="userName" name="userName" value=\"'+ req.query.userName +'\"><br><br>');
  res.write('<label for="email">New Password:</label><br>');
  res.write('<input type="text" id="password" name="password" value="New Password"><br><br>');
  res.write('<input type="submit" value="Submit">');
  res.write('</form> ');
  res.write('</body>');
  //res.sendFile(__dirname + '/changeemail.html');
  //take in new email
  //send to change email
});


app.use('/changeemail', (req, res) =>{
  Profile.findOneAndUpdate({ userName: req.query.userName} , {$set:{email: req.query.email}}, {new: true}, (err,doc) =>{
      if(err){
          console.log(err);
      }
      console.log(doc);
  });
  console.log('user' + req.query.userName + 'email: ' + req.query.email);
  res.redirect('/allprofiles');
});


app.use('/changepwd', (req, res) =>{
  Profile.findOneAndUpdate({ userName: req.query.userName} , {$set:{password: req.query.password}}, {new: true}, (err,doc) =>{
      if(err){
          console.log(err);
      }
      console.log(doc);
  });
  console.log('user' + req.query.userName + 'email: ' + req.query.password);
  res.redirect('/allprofiles');
});


app.post('/', (req, res) => {
    
});



 app.listen(3000, () => {
	console.log('Listening on port 3000');
    });
