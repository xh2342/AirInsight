import React, { useEffect, useState } from 'react';
import { MenuItem, Select, Button,  Container, Grid } from '@mui/material';

const config = require('../config.json');

function changeBackgroundImg(){
  document.getElementById("page-container").style.backgroundImage = "url(../img/hostinfo-background.jpg)";
}

export default function HostInfoPage() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const [responseTime, setResponseTime] = useState('All');
  const [responseRate, setResponseRate] = useState('All');
  const [acceptanceRate, setAcceptanceRate] = useState('All');
  const [superhost, setSuperhost] = useState('All');
  const [totalListing, setTotalListing] = useState('All');

  changeBackgroundImg();
  
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
        <Grid container spacing={2}>
          <Grid item xs={9}>
          <h1>Host Information</h1>
          </Grid>
          <Grid item xs={3}>
          <Container class = 'btn-container'>
            <Button variant="contained" class='btn' onClick={() => search()}>
              <b>SEARCH</b>
            </Button>
            </Container>
          </Grid>
        </Grid>
        
        <Grid container spacing={6} paddingBottom={'30px'}>
          <Grid item xs={2.4}>
          <h3 class='menu-item'>Response Time</h3>
            <Select className='menu-list' value={responseTime} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setResponseTime(e.target.value)}>
              <MenuItem value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem value='<1hr'><div className='menu-each'>{'\u003C'} 1 Hour</div></MenuItem>
              <MenuItem value='1hr'><div className='menu-each'>{'\u003E'} 1 Hour</div></MenuItem> 
            </Select>
          </Grid>

          <Grid item xs={2.4}>
            <h3 class='menu-item'>Response Rate</h3>
            <Select className='menu-list' value={responseRate} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setResponseRate(e.target.value)}>
              <MenuItem value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem value='<0.9'><div className='menu-each'>{'\u003C'} 0.9</div></MenuItem>
              <MenuItem value='0.9'><div className='menu-each'>{'\u003E'} 0.9</div></MenuItem> 
            </Select>
          </Grid>

          <Grid item xs={2.4}>
            <h3 class='menu-item'>Acceptance Rate</h3>
            <Select className='menu-list' value={acceptanceRate} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setAcceptanceRate(e.target.value)}>
              <MenuItem value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem value='<0.9'><div className='menu-each'>{'\u003C'} 0.9</div></MenuItem>
              <MenuItem value='0.9'><div className='menu-each'>{'\u003E'} 0.9</div></MenuItem> 
            </Select>
          </Grid>

          <Grid item xs={2.4}>
            <h3 class='menu-item'>Superhost</h3>
            <Select className='menu-list' value={superhost} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setSuperhost(e.target.value)}>
              <MenuItem value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem value='Yes'><div className='menu-each'> Yes</div></MenuItem>
              <MenuItem value='No'><div className='menu-each'> No</div></MenuItem> 
            </Select>     
          </Grid>

          <Grid item xs={2.4}>
            <h3 class='menu-item'>Total Listing</h3>
            <Select className='menu-list' value={totalListing} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setTotalListing(e.target.value)}>
              <MenuItem value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem value='<5'><div className='menu-each'>{'\u003C'} 5</div></MenuItem>
              <MenuItem value='5'><div className='menu-each'>{'\u003E'} 5</div></MenuItem>  
            </Select>
          </Grid>

        </Grid>
        

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