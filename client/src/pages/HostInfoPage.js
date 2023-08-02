import React, { useEffect, useState } from 'react';
import { MenuItem, Select, Button,  Container, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, LabelList, ResponsiveContainer } from 'recharts';

const config = require('../config.json');

function changeBackgroundImg(){
  document.getElementById("page-container").style.backgroundImage = "url(../img/hostinfo-background.jpg)";
}

function twoDecimals(num){
  return (Math.round(num * 100) / 100).toFixed(2);
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
      setPercentage(twoDecimals(resJson[0]['PERCENTAGE']));
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

  const transformedData = data.map((item) => {
    return Object.entries(item).map(([name, value]) => ({ name, value }));
  }).flat();
  
  const keyToRemove = "Not Filled In (NULL)";
  const chartData = transformedData.filter((item) => item.name !== keyToRemove);

  function btnHandler(){
    document.getElementById('hirc').style.visibility = 'visible';
    search();
  }

    return (
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={7.15}>
          <h1 style = {{textAlign: 'left'}}>Host Information</h1>
          </Grid>
          <Grid item xs={4.85}>
          <Container className = 'btn-container'>
            <Button variant="contained" class='btn' onClick={() => btnHandler()}>
              <b>SEARCH</b>
            </Button>
            </Container>
          </Grid>
        </Grid>
        
        <Grid container spacing={6} paddingBottom={'30px'}>
          <Grid item xs={2.4}>
          <h3 className='menu-item'>Response Time</h3>
            <Select className='menu-list' value={responseTime} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setResponseTime(e.target.value)}>
              <MenuItem value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem value='<1hr'><div className='menu-each'>{'\u003C'} 1 Hour</div></MenuItem>
              <MenuItem value='1hr'><div className='menu-each'>{'\u003E'} 1 Hour</div></MenuItem> 
            </Select>
          </Grid>

          <Grid item xs={2.4}>
            <h3 className='menu-item'>Response Rate</h3>
            <Select className='menu-list' value={responseRate} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setResponseRate(e.target.value)}>
              <MenuItem value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem value='<0.9'><div className='menu-each'>{'\u003C'} 0.9</div></MenuItem>
              <MenuItem value='0.9'><div className='menu-each'>{'\u003E'} 0.9</div></MenuItem> 
            </Select>
          </Grid>

          <Grid item xs={2.4}>
            <h3 className='menu-item'>Acceptance Rate</h3>
            <Select className='menu-list' value={acceptanceRate} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setAcceptanceRate(e.target.value)}>
              <MenuItem value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem value='<0.9'><div className='menu-each'>{'\u003C'} 0.9</div></MenuItem>
              <MenuItem value='0.9'><div className='menu-each'>{'\u003E'} 0.9</div></MenuItem> 
            </Select>
          </Grid>

          <Grid item xs={2.4}>
            <h3 className='menu-item'>Superhost</h3>
            <Select className='menu-list' value={superhost} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setSuperhost(e.target.value)}>
              <MenuItem value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem value='Yes'><div className='menu-each'> Yes</div></MenuItem>
              <MenuItem value='No'><div className='menu-each'> No</div></MenuItem> 
            </Select>     
          </Grid>

          <Grid item xs={2.4}>
            <h3 className='menu-item'>Total Listing</h3>
            <Select className='menu-list' value={totalListing} sx={{borderRadius:'0 0 10px 10px'}}
            onChange={(e) => setTotalListing(e.target.value)}>
              <MenuItem value='All'><div className='menu-each'>All</div></MenuItem>
              <MenuItem value='<5'><div className='menu-each'>{'\u003C'} 5</div></MenuItem>
              <MenuItem value='5'><div className='menu-each'>{'\u003E'} 5</div></MenuItem>  
            </Select>
          </Grid>

        </Grid>
        
        <div className='result-container' id='hirc'>
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