import './styles/style.scss'


/* Global Variables */
const baseURL = 'http://api.geonames.org/searchJSON?q=';
const username = "heather.mohorn";
const weatherKey = '1fdda4fba1ca46608824ac663b96e9d1';
const weatherURL =  'https://api.weatherbit.io/v2.0/forecast/daily?';
const pixURL = 'https://pixabay.com/api/?key=';
const pixKey = '23559203-267f128dc735339c66b1aebd9';

//add event listener for button
document.getElementById('generate').addEventListener('click', performAction);

//do this when clicked

function performAction(e){
  const destination =  document.getElementById('city').value;
  const departureDate = document.getElementById('date').value;
  //console.log(departureDate);
  let count = countdown(departureDate);
  const daysRemaining = countdown(departureDate);


  getLatLong(baseURL,destination,username)
  .then(function(data){
    postData('/addData', {lat: data.geonames[0].lat, long:data.geonames[0].lng, country:data.geonames[0].countryCode});
  })
  .then(()=>{
    getWeather(weatherKey, weatherURL, data.geonames[0].lat, data.geonames[0].lng,daysRemaining)
  })
  .then(()=>{
    getPic(pixKey, pixURL, destination);
  })
  .then(()=>{
    updateUI()
  })

  //REPLACE WITH LAT AND LONG RETURNED FROM GET LAT LONG
  //getWeather(weatherKey, weatherURL, 40, 140,daysRemaining)
  //.then(()=>{
  //  updateUI()
  //})

};

const getPic = async(pixKey, pixURL, destination)=>{
  const resp = await fetch(pixURL+pixKey+'&q='+destination)
  try{
    const res = await resp.json();
    console.log(res.hits[0].webformatURL);
    return res.hits[0].webformatURL;
  }
  catch(error){
    console.log("error", error);
  }
}
function countdown(date){
  let today = new Date();
  //console.log(today);
  let depDate = new Date(date);
  //console.log(depDate);
  let dif = depDate.getTime() - today.getTime();
  let days = dif/(1000 * 3600 * 24);
  days = Math.round(days);
  console.log(days);
  return days;
}

//get location data from API
const getLatLong = async (baseURL, destination, username)=>{
  const response = await fetch(baseURL+destination+'&username='+username)
  try {
    const data = await response.json();
    //console.log(data);
    //console.log(data.geonames[0].lng);
    //console.log(data.geonames[0].lat);
    //console.log(data.geonames[0].countryCode);
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
  const forecast = await fetch(weatherURL+'&lat='+lat+'&lon='+long+'&key='+weatherKey)
  try{
    const weather = await forecast.json();
    console.log(weather.data[days]);
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
    console.log(stats.high);
    console.log(stats.low);
    console.log(stats.description);
    return stats;
  }
  catch(error){
    console.log("error", error);
  }
}

//async post data function
const postData = async ( url = '', data = {})=>{
      console.log("posting data");
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

      document.getElementById('weather').innerHTML = "update me";
      document.getElementById('countdown').innerHTML = "update me";
      document.getElementById('departureDate').innerHTML = count;
      document.getElementById('latitude').innerHTML = allData.lat;
      document.getElementById('latitude').innerHTML = allData.long;
      console.log(allData);
      index ++;
  }catch(error){
    console.log("error", error);
  }
}
