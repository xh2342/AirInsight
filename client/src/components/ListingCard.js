import { useEffect, useState } from 'react';
import { Box, Button, Modal } from '@mui/material';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const config = require('../config.json');

export default function ListingCard({ listingId, handleClose }) {
  const [listingData, setListingData] = useState({});
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/top_listing/${listingId}`)
      .then(res => res.json())
      .then(resJson => {
        setListingData(resJson[0]);
      });
  }, [listingId]);

  const chartData = [
    { name: 'Rating', value: listingData.RATING, range: 5.5 },
    { name: 'Accuracy', value: listingData.ACCURACY, range: 5.5 },
    { name: 'Cleanliness', value: listingData.CLEANLINESS, range: 5.5 },
    { name: 'Communication', value: listingData.COMMUNICATION, range: 5.5 },
    { name: 'Location', value: listingData.LOCATION, range: 5.5 },
    { name: 'Value', value: listingData.VALUE, range: 5.5 }
  ];

  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex',
      justifyContent: 'center', alignItems: 'center' }}
    >
      <Box id='listing-card' p={3}>
        <p id='card-text-head'>PROPERTY ID - {listingId}</p>
        <hr/>
        <p className='card-text'>Neighborhood: {listingData.neighborhood}</p>
        <p className='card-text'>Area: {listingData.area}</p>
        <p className='card-text'>Latitude: {listingData.latitude}</p>
        <p className='card-text'>Longitude: {listingData.longitude}</p>
        <p className='card-text'>General Price: {listingData.general_price}</p>

        <div id="chart" style={{ margin: 20 }}>
          <ResponsiveContainer height={250}>
            <RadarChart
              outerRadius={100} 
              innerRadius={0}
              width={730} 
              height={250} 
              data={chartData}
              layers={['grid', 'radar', 'legend']}
            >
              <Radar dataKey="range" fill="#B9EDDD" stroke='black'/>
              <Radar dataKey="value" fill="#87CBB9" stroke='black'/>
              <PolarAngleAxis dataKey="name" tick={{fill: 'white', fontSize: 15, fontWeight:"bold", fontFamily:"Nunito", dy: 5 }}/>
              <PolarRadiusAxis angle ={30} domain={[0, 5]} tick = {{fill: 'none'}} ticks = {[1,2,3,4,5]}/>
              <PolarGrid gridLevels={1} stroke='black'/>
              </RadarChart>
          </ResponsiveContainer>
        </div>
        <Button onClick={handleClose} class='btn' style={{left: "40%"}}>
          <p>Close</p>
        </Button>
      </Box>
    </Modal>
  );
}
