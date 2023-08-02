import React, { useEffect, useState } from 'react';
import { MenuItem, Select, Button,  Container, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, LabelList, ResponsiveContainer } from 'recharts';

const config = require('../config.json');
function changeBackgroundImg(){
  document.getElementById("page-container").style.backgroundImage = "url(../img/propertyfeature-background.jpg)";
};

function twoDecimals(num){
  return (Math.round(num * 100) / 100).toFixed(2);
}

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
      setPercentage(twoDecimals(resJson[0]['PERCENTAGE']));
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
    
    const transformedData = data.map((item) => {
      return Object.entries(item).map(([name, value]) => ({ name, value }));
    }).flat();
    
    const keyToRemove = "Not Filled In (NULL)";
    const chartData = transformedData.filter((item) => item.name !== keyToRemove);

    function btnHandler(){
      document.getElementById('pfrc').style.visibility = 'visible';
      search();
    }

    return (
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={5.9}>
          <h1 style = {{textAlign: 'left'}}>Property Features</h1>
          </Grid>
          <Grid item xs={6.1}>
          <Container className = 'btn-container'>
            <Button variant="contained" class='btn' onClick={() => btnHandler()}>
              <b>SEARCH</b>
            </Button>
            </Container>
          </Grid>
        </Grid>
        
        <Grid container spacing={6} paddingBottom={'30px'}>
          <Grid item xs={3}>
            <h2 className='menu-item'>Room Type</h2>
            <Select className='menu-list' value={roomType} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setRoomType(e.target.value)}>
              <MenuItem value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem value='Entire Home/Apt'><div className='menu-each'>Entire Home/Apt</div></MenuItem>
              <MenuItem value='Private Room'><div className='menu-each'>Private Room</div></MenuItem> 
            </Select>
          </Grid>

          <Grid item xs={3}>
            <h2 className='menu-item'>Accommodates</h2>
            <Select className='menu-list' value={accommodates} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setAccommodates(e.target.value)}>
            <MenuItem value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem value='1-2'><div className='menu-each'>1-2</div></MenuItem>
              <MenuItem value='3-4'><div className='menu-each'>3-4</div></MenuItem>
              <MenuItem value='5'><div className='menu-each'>5+</div></MenuItem>
            </Select>
          </Grid>

          <Grid item xs={3}>
            <h2 className='menu-item'>Bedrooms</h2>
            <Select className='menu-list' value={bedrooms} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setBedrooms(e.target.value)}>
            <MenuItem className= 'option' value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem className= 'option'value='1-2'><div className='menu-each'>1-2</div></MenuItem>
              <MenuItem className= 'option'value='3-4'><div className='menu-each'>3-4</div></MenuItem>
              <MenuItem className= 'option'value='5'><div className='menu-each'>5+</div></MenuItem>
            </Select>
          </Grid>

          <Grid item xs={3}>
            <h2 className='menu-item'>Beds</h2>
            <Select className='menu-list' value={beds} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setBeds(e.target.value)}>
            <MenuItem value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem value='1-2'><div className='menu-each'>1-2</div></MenuItem>
              <MenuItem value='3-4'><div className='menu-each'>3-4</div></MenuItem>
              <MenuItem value='5'><div className='menu-each'>5+</div></MenuItem>
            </Select>
          </Grid>

        </Grid>
        
        <div className='result-container' id='pfrc'>
        <Grid container className='result-grid' spacing={2}>
        <Grid item xs={5.9}>
        <h2>Search Results</h2>
          <p className='regular' style={{textAlign: 'center'}}>
          We found {count} results based on your inquiry.<br/>
          The number of listings account for {twoDecimals(percentage)}% of the Airbnb listings in Los Angeles.<br/>
          The following chart illustrates the number of Airbnb listings which satisfy your requirement 
          in different price ranges.
          </p>
        </Grid>
        <Grid item xs={0.1}>
          <div className='vl'></div>
        </Grid>
        <Grid item xs={5.9}>
        
            <ResponsiveContainer height={250} className={'chart'}>
            <BarChart
              data={chartData}
              layout='horizontal'
            >
              <XAxis type='category' dataKey='name'
                label={{value: 'PRICE',fill: '#87CBB9',fontSize: 13, fontWeight:"bold", dy:15,fontFamily:"Nunito"}} 
                tick={{fill: '#87CBB9', fontSize: 13, fontWeight:"bold", fontFamily:"Nunito"}}
                axisLine={{ stroke: '#87CBB9', strokeWidth: 3}}/>
              <YAxis type='number' dataKey='value' 
                tick={{fill: '#87CBB9', fontSize: 13, fontWeight:"bold", fontFamily:"Nunito"}}
                axisLine={{ stroke: '#87CBB9', strokeWidth: 3 }}/>
              <Bar isAnimationActive={false} className='bar' dataKey='value' barSize={40} fill='#87CBB9'>
                <LabelList className="lis" dataKey="value" position="insideTop" fill='#87CBB9'/>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Grid>

        
        </Grid>
        </div>

      </Container>
    );    
};