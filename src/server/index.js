const dotenv = require('dotenv');
dotenv.config();
const { allowedNodeEnvironmentFlags } = require('process');

//Setup empty JS object to act as endpoint for all routes
let projectData = {};

var path = require('path')
const express = require('express');

//Start up an instance of an app
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

/* Middleware */
//Configuring express to use body-bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

var json = {
    'title': 'test json response',
    'message': 'this is a message',
    'time': 'now'
}

//Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
const fetch = require('node-fetch')

//Initialize main project folder
app.use(express.static('dist'));

// designates what port the app will listen to for incoming requests
app.listen(8000, function () {
    console.log('Example app listening on port 8000!')
})


//Set up GET route
app.get('/all', getData);

function getData(request, response) {
  console.log("begin getData- send projectData");
  console.log(projectData);
  response.send(projectData);
}

//Add POST route to add new data to projectData
app.post('/addData', addData);

function addData(request, response){
  console.log("begin addData");
  newData = request.body;
  if(request.body.lat){
    projectData.lat = request.body.lat;
    projectData.long = request.body.long;
  }
  else if(request.body.high){
    projectData.high = request.body.high;
    projectData.low = request.body.low;
    projectData.description = request.body.description;
    projectData.countdown = request.body.countdown;
  }
  else{
    projectData.image = request.body.image;
  }

  response.send(projectData);
  console.log("addData sends response: " + projectData);
  console.log(projectData);
  /*


  console.log("requested body");
  newEntry = {
    lat: newData.lat,
    lng: newData.long,
    country: newData.country
  }
  projectData=newEntry;
  response.send(projectData);
  console.log("addData sends response: " + projectData);
  console.log(projectData);
  */
}
