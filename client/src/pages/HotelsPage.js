import React, {  useState, useEffect ,useRef} from 'react';
import { Container, Grid, TextField, Button } from '@mui/material';

const config = require('../config.json');

function changeBackgroundImg(){
  document.getElementById("page-container").style.backgroundImage = "url(../img/vshotel-background.jpg)";
};

export default function HotelsPage() {
  const google = window.google
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null); 
  const [isGoogleMapsApiLoaded, setIsGoogleMapsApiLoaded] = useState(false);
  const [neighborhood, setNeighborhood] = useState('');
  const [neighborhoodList, setneighborhoodList] = useState([]);
  const [betterRating, setBetterRating] = useState('');
  const [betterPrice, setBetterPrice] = useState('');
  const [airbnbs, setAirbnbs] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [midpoint, setMidpoint] = useState({ lat: 34.050416, lng: -118.243862 }); // Set default value

  function initMap() {

    changeBackgroundImg()
    console.log("midpoint", midpoint)
    const mapOptions = {
      center: { lat: midpoint.lat, lng: midpoint.lng },
      zoom: 11,
    };

    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(document.getElementById('map'), mapOptions);
    }

      fetch(`http://${config.server_host}:${config.server_port}/neighborhoods`)
    .then((res) => res.json())
    .then((resJson) => {
      setneighborhoodList(resJson.map((obj) => obj.neighborhood.toLowerCase()));
    })
    try {
     setMap(new window.google.maps.Map(document.getElementById('map'), mapOptions));
      
      airbnbs.forEach((airbnb) => {
        const marker = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(parseFloat(airbnb['latitude']), parseFloat(airbnb['longitude'])),
          map: map,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          },
        });
        setMarkers(prevMarkers => [...prevMarkers, marker]);

      });

      //Add Hotels as red dots
      hotels.forEach((hotel) => {
        const marker2 = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(parseFloat(hotel['latitude']), parseFloat(hotel['longitude'])),
          map: map,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          },
        });
        setMarkers(prevMarkers => [...prevMarkers, marker2]);

      });
    } catch (error) {

    }
    setMap(new window.google.maps.Map(document.getElementById('map'), mapOptions));

  };

  useEffect(() => {
    // Check if the Google Maps API script has been loaded before initializing the map
    if (window.google && window.google.maps) {
      initMap();
    }
  }, [airbnbs, hotels]);

  useEffect(() => {
    window.initMap = function() {
      setIsGoogleMapsApiLoaded(true);
    };
  
    if (!isGoogleMapsApiLoaded) {
      loadGoogleMapsAPIScript();
    }
  }, [isGoogleMapsApiLoaded, airbnbs, hotels]);
  
  useEffect(() => {
    if (isGoogleMapsApiLoaded) {
      initMap();
    }
  }, [isGoogleMapsApiLoaded]);

  function loadGoogleMapsAPIScript() {
    try {
      if (!document.getElementById('googleMaps')) {
        const script = document.createElement('script');
        script.id = 'googleMaps';
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAk_m1W6tWAV_VGy-oouiMf6A1EvKf3ZKo&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    } catch {
      console.log("error is caught");
    }
  }
  
  function updateMarkers() {
    // clear markers
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);  // clear markers data

    fetch(`http://${config.server_host}:${config.server_port}/midpoint?neighborhood=${neighborhood}`)
    .then((res) => res.json())
    .then((resJson) => {
      if (resJson.length > 0) {
        setMidpoint({ lat: parseFloat(resJson[0]['mid_lat']), lng: parseFloat(resJson[0]['mid_long'])});
      }
      fetch(`http://${config.server_host}:${config.server_port}/airbnb_neighborhood?neighborhood=${neighborhood}`)
      .then((res) => res.json())
      .then((resJson) => {
  // add new Airbnb markers
  resJson.forEach((airbnb) => {
    const marker = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(airbnb['latitude']), parseFloat(airbnb['longitude'])),
        map: map,
        icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        },
    });
    setMarkers(prevMarkers => [...prevMarkers, marker]);
  });
  fetch(`http://${config.server_host}:${config.server_port}/hotels_neighborhood?neighborhood=${neighborhood}`)
  .then((res) => res.json())
  .then((resJson) => {
 // add new hotels markers
 resJson.forEach((hotel) => {
  const marker2 = new google.maps.Marker({
      position: new google.maps.LatLng(parseFloat(hotel['latitude']), parseFloat(hotel['longitude'])),
      map: map,
      icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      },
  });
  setMarkers(prevMarkers => [...prevMarkers, marker2]);
});

  })
      });
    });  
}



  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/rec?neighborhood=${neighborhood}`)
    .then(res => res.json())
    .then(resJson => {
      if (resJson.length === 0){
        setBetterRating('NULL');
        setBetterPrice('NULL');
      }else{
        setBetterRating(resJson[0]['better_rating']);
        setBetterPrice(resJson[0]['better_price']);
      }
    }).then(() => {
      updateMarkers();
    });;
  };


  function btnListener(){
    var text = document.getElementById("txt").value;
    if (!text){
      alert("Neighborhood cannot be empty!")
    }else if (!neighborhoodList.includes(text.toLowerCase())){
      alert("Neighborhood '"+text+"' doesn't exist!")
    }else{
      document.getElementById('map-result').style.visibility = 'visible';
      search();
    }
  }
  
  function onTextChangeListener(e){
    document.getElementById('map-result').style.visibility = 'hidden';
    setNeighborhood(e.target.value);
  }

  return (
    <Container>
      
      <h2 style={{marginBottom: 0}}>
        Airbnb vs Hotel Map
      </h2>
      <p class='regular' style={{textAlign: 'center',marginTop : 0}}>
        Blue: Airbnb, Red: Hotel
      </p>
       
      {/* Add the div element for the map */}
      <div id="map"></div>
      
      <Grid container spacing={6} className='map-box-container'>
        
        <Grid item xs={8}>
        <p className='regular'>Recommendation by Neighborhood</p>
          <TextField className='txt' id='txt' value={neighborhood ?? ''}
          onChange={(e) => onTextChangeListener(e)} />
        </Grid>

        <Grid item xs={4}>
          <Container className = 'btn-container' style={{paddingTop : 60}}>
            <Button variant="contained" class='btn' onClick={() => btnListener()}>
              <b>SEARCH</b> 
            </Button>
          </Container>
        </Grid>
      </Grid>

      <h2 id='map-result'>
        After evaluating all the hotel and Airbnb data in {neighborhood}, the average per-capita price suggests 
        <div style={{color : "cyan", display: "inline"}}> {betterRating}</div> has better rating and 
        <div style={{color : "cyan", display: "inline"}}> {betterPrice} </div> has better price in the area.
      </h2>
    </Container>
  );
}
