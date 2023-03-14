var express = require('express');
var app = express();

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


 app.listen(3000, () => {
	console.log('Listening on port 3000');
    });
