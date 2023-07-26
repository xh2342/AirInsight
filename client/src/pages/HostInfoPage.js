import React, { useEffect, useState } from 'react';
import { TextField, MenuItem, Select, Button,  Container, Grid, Link, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function HostInfoPage() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const [responseTime, setResponseTime] = useState('All');
  const [responseRate, setResponseRate] = useState('All');
  const [acceptanceRate, setAcceptanceRate] = useState('All');
  const [superhost, setSuperhost] = useState('All');
  const [totalListing, setTotalListing] = useState('All');

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_host_info`)
      .then(res => res.json())
      .then(resJson => {
        // const ranges = resJson.map((range) => ({ ...range }));
        // setData(ranges);
        setData(resJson);
      });

    fetch(`http://${config.server_host}:${config.server_port}/search_host_info_count`)
    .then(res => res.json())
    .then(resJson => {
      setCount(resJson[0]['COUNT']);
    });

    fetch(`http://${config.server_host}:${config.server_port}/search_host_info_percentage`)
    .then(res => res.json())
    .then(resJson => {
      console.log(resJson)
      setPercentage(resJson[0]['PERCENTAGE']);
    });
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_host_info?responseTime=${responseTime}` +
      `&responseRate=${responseRate}` +
      `&acceptanceRate=${acceptanceRate}` +
      `&superhost=${superhost}` +
      `&totalListing=${totalListing}`
    )
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        
        setData(resJson);
      });

    fetch(`http://${config.server_host}:${config.server_port}/search_host_info_count?responseTime=${responseTime}` +
    `&responseRate=${responseRate}` +
    `&acceptanceRate=${acceptanceRate}` +
    `&superhost=${superhost}` +
    `&totalListing=${totalListing}`
    )
      .then(res => res.json())
      .then(resJson => {
        setCount(resJson[0]['COUNT']);
      });

    
    fetch(`http://${config.server_host}:${config.server_port}/search_host_info_percentage?responseTime=${responseTime}` +
    `&responseRate=${responseRate}` +
    `&acceptanceRate=${acceptanceRate}` +
    `&superhost=${superhost}` +
    `&totalListing=${totalListing}`
    )
    .then(res => res.json())
    .then(resJson => {
      setPercentage(resJson[0]['PERCENTAGE']);
    });
  }

    return (
      <Container>
        
        <Grid container spacing={6}>
          <Grid item xs={2.4}>
            <p>Response Time</p>
            <TextField 
            label='Select Response Time'
            select value={responseTime} sx={{width:200}} onChange={(e) => setResponseTime(e.target.value)}>
              <MenuItem value='All'>All</MenuItem>
              <MenuItem value='<1hr'>{'\u003C'} 1 Hour</MenuItem>
              <MenuItem value='1hr'>{'\u003E'} 1 Hour</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={2.4}>
            <p>Response Rate</p>
            <TextField 
            label='Select Response Rate'
            select value={responseRate} sx={{width:200}} onChange={(e) => setResponseRate(e.target.value)}>
              <MenuItem value='All'>All</MenuItem>
              <MenuItem value='<0.9'>{'\u003C'} 0.9</MenuItem>
              <MenuItem value='0.9'>{'\u003E'} 0.9</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={2.4}>
            <p>Acceptance Rate</p>
            <TextField 
            label='Select Acceptance Rate'
            select value={acceptanceRate} sx={{width:200}} onChange={(e) => setAcceptanceRate(e.target.value)}>
              <MenuItem value='All'>All</MenuItem>
              <MenuItem value='<0.9'>{'\u003C'} 0.9</MenuItem>
              <MenuItem value='0.9'>{'\u003E'} 0.9</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={2.4}>
            <p>Superhost</p>
            <TextField 
            label='Select Superhost'
            select value={superhost} sx={{width:200}} onChange={(e) => setSuperhost(e.target.value)}>
              <MenuItem value='All'>All</MenuItem>
              <MenuItem value='Yes'>Yes</MenuItem>
              <MenuItem value='No'>No</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={2.4}>
            <p>Total Listing</p>
            <TextField 
            label='Select Total Listing'
            select value={totalListing} sx={{width:200}} onChange={(e) => setTotalListing(e.target.value)}>
              <MenuItem value='All'>All</MenuItem>
              <MenuItem value='<5'>{'\u003C'} 5</MenuItem>
              <MenuItem value='5'>{'\u003E'} 5</MenuItem>
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
            The Greater Los Angeles Area has {count} short-term Airbnbs with the selected features, which is {percentage}% of the total Airbnbs in the region.
          </h3>
        </div>


      </Container>
    );    
};