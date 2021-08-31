/* Global Variables */
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const key = "9f2d67b95c319a699b2f533755b62b02";
var index = 0;

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 +'.'+ d.getDate()+'.'+ d.getFullYear();


//add event listener for button
document.getElementById('generate').addEventListener('click', performAction);

//do this when clicked

function performAction(e){
  const zip =  document.getElementById('zip').value;
  const feeling = document.getElementById('feelings').value;
  getWeather(baseURL,zip,key)
  .then(function(data){
    //console.log(data);
    postData('/addData', {temp: data.main.temp, feeling: feeling, date: newDate});
  })
  .then(()=>{
    updateUI()
  })
};

//get temperature data from API
const getWeather = async (baseURL, zip, key)=>{
  const response = await fetch(baseURL+zip+'&appid='+key+'&units=imperial')
  try {
    const data = await response.json();
    //console.log(data.main.temp);
    return data;
  }  catch(error) {
    console.log("error", error);
  }
}

//async post data function
const postData = async ( url = '', data = {})=>{
      //console.log(data);
      const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

      try {
        const newData = await response.json();
        console.log(newData);
        return newData;
      }catch(error) {
      console.log("error", error);
      }
  };

const updateUI = async () => {
    const request = await fetch('/all');
    try{
      const allData = await request.json();

      document.getElementById('date').innerHTML = allData.date;
      document.getElementById('temp').innerHTML = allData.temp;
      document.getElementById('content').innerHTML = allData.feeling;
      console.log(allData);
      index ++;
  }catch(error){
    console.log("error", error);
  }
}

const getData = async (url = '') =>{
  const request = await fetch(url);
  try{
    const allData = request.json()
  }
  catch(error){
    console.log("error", error);
  }
};
