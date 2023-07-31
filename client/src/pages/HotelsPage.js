import { useState } from 'react';
import { Container, Grid, TextField, MenuItem, Button, Select } from '@mui/material';

const config = require('../config.json');
function changeBackgroundImg(){
  document.getElementById("page-container").style.backgroundImage = "url(../img/vshotel-background.jpg)";
};

export default function HotelsPage() {
  const [neighborhood, setNeighborhood] = useState(null);
  const [betterRating, setBetterRating] = useState(null);
  const [betterPrice, setBetterPrice] = useState(null);
  const [area, setArea] = useState('Los Angeles');

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
    });
  };
  changeBackgroundImg();

  return (
    <Container>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <h2>
         Map
         </h2>
        </Grid>

        <Grid item xs={8}>
          <p className='regular'>Select Area</p>
          <Select
          select className='menu-list' value={area} sx={{borderRadius:'10px 10px 10px 10px'}} 
          onChange={(e) => setArea(e.target.value)}>
            <MenuItem value='Los Angeles'><div className='menu-each'>Los Angeles</div></MenuItem>
            <MenuItem value='City of Los Angeles'><div className='menu-each'>City of Los Angeles</div></MenuItem>
            <MenuItem value='Adams-Normandie'><div className='menu-each'>Adams-Normandie</div></MenuItem>
          </Select>
        </Grid>
      </Grid>

      <Grid container spacing={6}>

        <Grid item xs={8}>
          <h2>
         Recommendation
         </h2>
        </Grid>

        <Grid item xs={8}>
          <p className='regular'>Neighborhood</p>
          <TextField className = 'txt' value={neighborhood} 
          onChange={(e) => setNeighborhood(e.target.value)} 
          style={{ width: "100%" }}/>
        </Grid>

        <Grid item xs={4}>
        <Container class = 'btn-container'>
            <Button variant="contained" class='btn' onClick={() => search()}>
              <b>SEARCH</b>
            </Button>
            </Container>
        </Grid>

        <Grid item xs={8}>
          <h2>
          After evaluating all the hotel and Airbnb data in {neighborhood}, the average per-capita price suggests {betterRating} has better rating and {betterPrice} has better price in the area.
          </h2>
        </Grid>

      </Grid>
    </Container>
  );
};