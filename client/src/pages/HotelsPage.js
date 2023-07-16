import { useState } from 'react';
import { Container, Grid, TextField, MenuItem, Button } from '@mui/material';

const config = require('../config.json');

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


  return (
    <Container>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <h2>
         Map
         </h2>
        </Grid>

        <Grid item xs={8}>
          <TextField 
          label='Select Area'
          select value={area} sx={{width:200}} onChange={(e) => setArea(e.target.value)}>
            <MenuItem value='Los Angeles'>Los Angeles</MenuItem>
            <MenuItem value='City of Los Angeles'>City of Los Angeles</MenuItem>
            <MenuItem value='Adams-Normandie'>Adams-Normandie</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Grid container spacing={6}>

        <Grid item xs={8}>
          <h2>
         Recommendation
         </h2>
        </Grid>

        <Grid item xs={8}>
          <TextField label='neighborhood' value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} style={{ width: "100%" }}/>
        </Grid>

        <Grid item xs={4}>
          <Button xs={4} onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Search
          </Button>
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