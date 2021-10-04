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
  //console.log(departureDate);
  //let count = countdown(departureDate);
  const daysRemaining = countdown(departureDate);


  getLatLong(baseURL,destination,username)
  .then(async(locData) => {
    const respone = await postData('http://localhost:8000/addData', {lat: locData.geonames[0].lat, long:locData.geonames[0].lng, city:destination})


  getWeather(weatherKey, weatherURL, locData.geonames[0].lat, locData.geonames[0].lng,daysRemaining)
  .then(async (weatherData) =>{
    const response = await postData('http://localhost:8000/addData', {high: weatherData.high, low: weatherData.low, description: weatherData.description, countdown:daysRemaining})
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

const getPic = async(pixKey, pixURL, destination)=>{
  console.log("begin getPic" + destination);
  const resp = await fetch(pixURL+pixKey+'&q='+destination+'+view')
  try{
    const res = await resp.json();
    if(res.totalHits>0){
      console.log(res.hits[0].webformatURL);
      return res.hits[0].webformatURL;
    }
    else return "https://cdn.pixabay.com/photo/2021/09/07/11/53/car-6603726_1280.jpg";

  }
  catch(error){
    console.log("error", error);
  }
}
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

//get location data from API
const getLatLong = async (baseURL, destination, username)=>{
  console.log("begin getLatLong");
  const response = await fetch(baseURL+destination+'&username='+username)
  try {
    const data = await response.json();
    //console.log(data);
    //console.log(data.geonames[0].lng);
    //console.log(data.geonames[0].lat);
    //console.log(data.geonames[0].countryCode);
    console.log("getLatLong returns");
    console.log(data);
    return data;
    //{
      //response.data.geonames[0].lat,
      //response.data.geonames[0].lng,
    //};
  }  catch(error) {
    console.log("error", error);
  }
}

const getWeather = async(weatherKey, weatherURL, lat, long, days)=>{
  console.log("begin getWeather");
  console.log(days);
  const forecast = await fetch(weatherURL+'&lat='+lat+'&lon='+long+'&key='+weatherKey)
  try{
    const weather = await forecast.json();
    console.log("weather.data[days] " + weather.data[days]);
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
    console.log("High: "+stats.high);
    console.log("Low: "+stats.low);
    console.log("Description: "+stats.description);
    console.log("getWeather returns stats: ");
    console.log(stats);
    return stats;
  }
  catch(error){
    console.log("error", error);
  }
}

//async post data function
const postData = async ( url = '', data = {})=>{
      console.log("begin postData");
      console.log("data:");
      console.log(data);
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
    console.log("begin updateUI");
    const request = await fetch('http://localhost:8000/all');
    try{
      const allData = await request.json();
      document.getElementById('message').innerHTML = "Bon Voyage!";
      document.getElementById('high').innerHTML = "High temperature: " + allData.high.toString();
      document.getElementById('low').innerHTML = "Low temperature: " + allData.low.toString();
      document.getElementById('weather').innerHTML = "Forecast: " + allData.description;
      document.getElementById('locationImage').innerHTML = "<img src ="+allData.image+"></img>";
      document.getElementById('countdown').innerHTML = allData.countdown.toString()+ " days to go";
      if (allData.countdown != 1){
        document.getElementById('countdown').innerHTML = allData.countdown.toString()+ " days to go";
      }
      else {
        document.getElementById('countdown').innerHTML = allData.countdown.toString()+ " day to go";
      }
      index ++;
      console.log(allData);
  }catch(error){
    console.log("error", error);
  }
}
