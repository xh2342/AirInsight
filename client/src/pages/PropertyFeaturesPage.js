import React, { useEffect, useState } from 'react';
import { TextField, MenuItem, Select, Button,  Container, Grid, Link, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function PropertyFeaturesPage() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const [roomType, setRoomType] = useState('All');
  const [accommodates, setAccommodates] = useState('All');
  const [bedrooms, setBedrooms] = useState('All');
  const [beds, setBeds] = useState('All');

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_features`)
      .then(res => res.json())
      .then(resJson => {
        // const ranges = resJson.map((range) => ({ ...range }));
        // setData(ranges);
        setData(resJson);
      });

    fetch(`http://${config.server_host}:${config.server_port}/search_features_count`)
    .then(res => res.json())
    .then(resJson => {
      setCount(resJson[0]['COUNT']);
    });

    fetch(`http://${config.server_host}:${config.server_port}/search_features_percentage`)
    .then(res => res.json())
    .then(resJson => {
      console.log(resJson)
      setPercentage(resJson[0]['PERCENTAGE']);
    });
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_features?roomType=${roomType}` +
      `&accommodates=${accommodates}` +
      `&bedrooms=${bedrooms}` +
      `&beds=${beds}`
    )
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        
        setData(resJson);
      });

    fetch(`http://${config.server_host}:${config.server_port}/search_features_count?roomType=${roomType}` +
      `&accommodates=${accommodates}` +
      `&bedrooms=${bedrooms}` +
      `&beds=${beds}`
    )
      .then(res => res.json())
      .then(resJson => {
        setCount(resJson[0]['COUNT']);
      });

    
      fetch(`http://${config.server_host}:${config.server_port}/search_features_percentage?roomType=${roomType}` +
      `&accommodates=${accommodates}` +
      `&bedrooms=${bedrooms}` +
      `&beds=${beds}`
      )
      .then(res => res.json())
      .then(resJson => {
        setPercentage(resJson[0]['PERCENTAGE']);
      });
    }

    return (
      <Container>
        
        <Grid container spacing={6}>
          <Grid item xs={3}>
            <p>Room Type</p>
            <TextField 
            label='Select Room Type'
            select value={roomType} sx={{width:200}} onChange={(e) => setRoomType(e.target.value)}>
              <MenuItem value='All'>All</MenuItem>
              <MenuItem value='Entire Home/Apt'>Entire Home/Apt</MenuItem>
              <MenuItem value='Private Room'>Private Room</MenuItem>
              <MenuItem value='Hotel Room'>Hotel Room</MenuItem>
              <MenuItem value='Shared Room'>Shared Room</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={3}>
            <p>Accommodates</p>
            <TextField 
            label='Select Accommodates'
            select value={accommodates} sx={{width:200}} onChange={(e) => setAccommodates(e.target.value)}>
            <MenuItem value='All'>All</MenuItem>
              <MenuItem value='1-2'>1-2</MenuItem>
              <MenuItem value='3-4'>3-4</MenuItem>
              <MenuItem value='5-8'>5-8</MenuItem>
              <MenuItem value='9-16'>9+</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={3}>
            <p>Bedrooms</p>
            <TextField 
            label='Select Bedrooms'
            select value={bedrooms} sx={{width:200}} onChange={(e) => setBedrooms(e.target.value)}>
            <MenuItem value='All'>All</MenuItem>
              <MenuItem value='1-2'>1-2</MenuItem>
              <MenuItem value='3-4'>3-4</MenuItem>
              <MenuItem value='5-8'>5-8</MenuItem>
              <MenuItem value='9-16'>9+</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={3}>
            <p>Beds</p>
            <TextField 
            label='Select Beds'
            select value={beds} sx={{width:200}} onChange={(e) => setBeds(e.target.value)}>
            <MenuItem value='All'>All</MenuItem>
              <MenuItem value='1-2'>1-2</MenuItem>
              <MenuItem value='3-4'>3-4</MenuItem>
              <MenuItem value='5-8'>5-8</MenuItem>
              <MenuItem value='9-16'>9+</MenuItem>
            </TextField>
          </Grid>

        </Grid>
        
        <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
        </Button>

        <h2>Results</h2>
        <div>
          {data.map((item, index) => (
            <div>
              <h3 key={index}>
                {Object.keys(item).join(" | ")}
              </h3>
              <h3 key={index}>
                {Object.values(item).join(" | ")}
              </h3>
            </div>
          ))}
        </div>

        <div>
          <h3>
            The Greater Los Angeles Area has {count} short-term Airbnbs  with the selected features, which is {percentage}% of the total Airbnbs in the region.
          </h3>
        </div>


      </Container>
    );    
};