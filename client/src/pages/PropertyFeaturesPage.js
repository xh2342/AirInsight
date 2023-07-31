import React, { useEffect, useState } from 'react';
import { MenuItem, Select, Button,  Container, Grid } from '@mui/material';

const config = require('../config.json');
function changeBackgroundImg(){
  document.getElementById("page-container").style.backgroundImage = "url(../img/propertyfeature-background.jpg)";
};

export default function PropertyFeaturesPage() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const [roomType, setRoomType] = useState('All');
  const [accommodates, setAccommodates] = useState('All');
  const [bedrooms, setBedrooms] = useState('All');
  const [beds, setBeds] = useState('All');

  changeBackgroundImg();
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
        <Grid container spacing={2}>
          <Grid item xs={9}>
          <h1>Property Features</h1>
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
          <Grid item xs={3}>
            <h2 class='menu-item'>Room Type</h2>
            <Select className='menu-list' value={roomType} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setRoomType(e.target.value)}>
              <MenuItem value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem value='Entire Home/Apt'><div className='menu-each'>Entire Home/Apt</div></MenuItem>
              <MenuItem value='Private Room'><div className='menu-each'>Private Room</div></MenuItem> 
            </Select>
          </Grid>

          <Grid item xs={3}>
            <h2 class='menu-item'>Accommodates</h2>
            <Select className='menu-list' value={accommodates} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setAccommodates(e.target.value)}>
            <MenuItem value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem value='1-2'><div className='menu-each'>1-2</div></MenuItem>
              <MenuItem value='3-4'><div className='menu-each'>3-4</div></MenuItem>
              <MenuItem value='5'><div className='menu-each'>5+</div></MenuItem>
            </Select>
          </Grid>

          <Grid item xs={3}>
            <h2 class='menu-item'>Bedrooms</h2>
            <Select className='menu-list' value={bedrooms} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setBedrooms(e.target.value)}>
            <MenuItem className= 'option' value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem className= 'option'value='1-2'><div className='menu-each'>1-2</div></MenuItem>
              <MenuItem className= 'option'value='3-4'><div className='menu-each'>3-4</div></MenuItem>
              <MenuItem className= 'option'value='5'><div className='menu-each'>5+</div></MenuItem>
            </Select>
          </Grid>

          <Grid item xs={3}>
            <h2 class='menu-item'>Beds</h2>
            <Select className='menu-list' value={beds} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setBeds(e.target.value)}>
            <MenuItem value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem value='1-2'><div className='menu-each'>1-2</div></MenuItem>
              <MenuItem value='3-4'><div className='menu-each'>3-4</div></MenuItem>
              <MenuItem value='5'><div className='menu-each'>5+</div></MenuItem>
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
            The Greater Los Angeles Area has {count} short-term Airbnbs  with the selected features, which is {percentage}% of the total Airbnbs in the region.
          </h3>
        </div>


      </Container>
    );    
};