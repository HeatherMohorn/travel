import './styles/style.scss'


/* Global Variables */
const baseURL = 'http://api.geonames.org/searchJSON?q=';
const username = "heather.mohorn";

//add event listener for button
document.getElementById('generate').addEventListener('click', performAction);

//do this when clicked

function performAction(e){
  const destination =  document.getElementById('city').value;
  const departureDate = document.getElementById('date').value;
  console.log(departureDate);
  let count = countdown(departureDate);
  const daysRemaining = countdown(departureDate);
  getLatLong(baseURL,destination,username)
  .then(function(data){
    //change to whatever geonames returns
    postData('/addData', {lat: data.geonames[0].lat, long:data.geonames[0].lng, country:data.geonames[0].countryCode});
  })
  .then(()=>{
    updateUI()
  })
};

function countdown(date){
  let today = new Date();
  console.log(today);
  let depDate = new Date(date);
  console.log(depDate);
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
