import './styles/style.scss'


/* Global Variables */
const baseURL = 'http://api.geonames.org/searchJSON?q=';
const username = "heather.mohorn";
const weatherKey = '1fdda4fba1ca46608824ac663b96e9d1';
const weatherURL =  'https://api.weatherbit.io/v2.0/forecast/daily?';
const pixURL = 'https://pixabay.com/api/?key=';
const pixKey = '23559203-267f128dc735339c66b1aebd9';
let index = 0;

//add event listener for button
document.getElementById('generate').addEventListener('click', performAction);

//do this when clicked
function performAction(e){
  const destination =  document.getElementById('city').value;
  const departureDate = document.getElementById('date').value;
  const returnDate = document.getElementById('retDate').value;
  //console.log(departureDate);
  //let count = countdown(departureDate);
  const daysRemaining = countdown(departureDate);
  const tripLength = countdown(returnDate, departureDate);


  getLatLong(baseURL,destination,username)
  .then(async(locData) => {
    const respone = await postData('http://localhost:8000/addData', {lat: locData.geonames[0].lat, long:locData.geonames[0].lng, city:destination, country:locData.geonames[0].countryName})


  getWeather(weatherKey, weatherURL, locData.geonames[0].lat, locData.geonames[0].lng,daysRemaining, tripLength)
  .then(async (weatherData) =>{
    const response = await postData('http://localhost:8000/addData', {high: weatherData.high, low: weatherData.low, description: weatherData.description, countdown:daysRemaining, length: tripLength})
  })

  getPic(pixKey, pixURL, destination)
  .then(async (imageURL)=>{
    const response = await postData('http://localhost:8000/addData', {image: imageURL})
  })
  .then(()=>{
    updateUI();
  })
})
}

const getPic = async(pixKey, pixURL, destination, locData)=>{
  console.log("begin getPic" + destination);
  const resp = await fetch(pixURL+pixKey+'&q='+destination+'+view')
  try{
    const res = await resp.json();
    if(res.totalHits>0){
      console.log(res.hits[0].webformatURL);
      return res.hits[0].webformatURL;
    }
    else {
      return "https://cdn.pixabay.com/photo/2021/09/07/11/53/car-6603726_1280.jpg";
    }
  }
  catch(error){
    console.log("error", error);
  }
}

//calculate days until trip
function countdown(date){
  console.log("begin countdown");
  let today = new Date();
  //console.log(today);
  let depDate = new Date(date);
  //console.log(depDate);
  let dif = depDate.getTime() - today.getTime();
  let days = dif/(1000 * 3600 * 24);
  days = Math.round(days);
  console.log("countdown returns " + days);
  return days;
}

//calculate trip length
function tripLength(date1, date2){
  let depDate = new Date(date1);
  let retDate = new Date(date2);
  let dif = depDate.getTime() - retDate.getTime();
  let days = dif/(1000 * 3600 * 24);
  days = Math.round(days);
  return days;
}

//get location data from API
const getLatLong = async (baseURL, destination, username)=>{
  console.log("begin getLatLong");
  const response = await fetch(baseURL+destination+'&username='+username)
  try {
    const data = await response.json();
    console.log("getLatLong returns");
    console.log(data);
    return data;
  }
  catch(error) {
    console.log("error", error);
  }
}

const getWeather = async(weatherKey, weatherURL, lat, long, days)=>{
  const forecast = await fetch(weatherURL+'&lat='+lat+'&lon='+long+'&key='+weatherKey)
  try{
    const weather = await forecast.json();
    let high = weather.data[days].max_temp;
    let low = weather.data[days].min_temp;
    let description = weather.data[days].weather.description;
    //console.log(high);
    //console.log(low);
    //console.log(description);
    let stats = {
      high: high,
      low: low,
      description: description
    };
    return stats;
  }
  catch(error){
    console.log("error", error);
  }
}

//async post data function
const postData = async ( url = '', data = {})=>{
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
        console.log("postData returns " + newData);
        return newData;
      }catch(error) {
      console.log("error", error);
      }
  };

const updateUI = async () => {
    const request = await fetch('http://localhost:8000/all');
    try{
      const allData = await request.json();
      document.getElementById('message').innerHTML = "Bon Voyage!";
      document.getElementById('high').innerHTML = "High temperature: " + allData.high.toString();
      document.getElementById('low').innerHTML = "Low temperature: " + allData.low.toString();
      document.getElementById('weather').innerHTML = "Forecast: " + allData.description;
      document.getElementById('locationImage').innerHTML = "<img src ="+allData.image+"></img>";
      if (allData.countdown != 1){
        document.getElementById('countdown').innerHTML = allData.countdown.toString()+ " days to go until your " + allData.length.toString() + "-day trip!";
      }
      else {
        document.getElementById('countdown').innerHTML = allData.countdown.toString()+ " day to go until your " + allData.length.toString() + "-day trip!";
      }
      index ++;
  }catch(error){
    console.log("error", error);
  }
}
