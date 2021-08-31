//Setup empty JS object to act as endpoint for all routes
projectData = {};

//Require Express to run server and routes
const express = require('express');

//Start up an instance of an app
const app = express();

/* Middleware */
//Configuring express to use body-bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

//Initialize main project folder
app.use(express.static('dist'));

//Set up server
const port = 8000;
const server = app.listen(port, listening);

function listening(){
  console.log("server running on localhost: " + port);
};


//Set up GET route
app.get('/all', getData);

function getData(request, response) {
  response.send(projectData);
}

//Add POST route to add new data to projectData
app.post('/addData', addData);

function addData(request, response){
  newData = request.body;
  newEntry = {
    temp: newData.temp,
    feeling: newData.feeling,
    date: newData.date
  }
  projectData=newEntry;
  response.send(projectData);
  console.log(projectData);
}
