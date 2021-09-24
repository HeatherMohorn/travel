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
  getLatLong(baseURL,city,username)
  .then(function(data){
    //change to whatever geonames returns
    postData('/addData', {});
  })
  .then(()=>{
    updateUI()
  })
};

//get location data from API
const getLatLong = async (baseURL, destination, username)=>{
  const response = await fetch(baseURL+destination+'&username='+username)
  try {
    const data = await response.json();
    console.log(data[0]);
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

      document.getElementById('weather').innerHTML = "update me";
      document.getElementById('countdown').innerHTML = "update me";
      document.getElementById('departureDate').innerHTML = departureDate;
      document.getElementById('latitude').innerHTML = "update me";
      document.getElementById('latitude').innerHTML = "update me";
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
