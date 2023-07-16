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
    { name: 'RATING', value: listingData.RATING },
    { name: 'ACCURACY', value: listingData.ACCURACY },
    { name: 'CLEANLINESS', value: listingData.CLEANLINESS },
    { name: 'COMMUNICATION', value: listingData.COMMUNICATION },
    { name: 'LOCATION', value: listingData.LOCATION },
    { name: 'VALUE', value: listingData.VALUE }
  ];

  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        p={3}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 600 }}
      >
        <h1>{listingData.ID}</h1>
        <p>neighborhood: {listingData.neighborhood}</p>
        <p>area: {listingData.area}</p>
        <p>latitude: {listingData.latitude}</p>
        <p>longitude: {listingData.longitude}</p>
        <p>general_price: {listingData.general_price}</p>
        <div style={{ margin: 20 }}>
          <ResponsiveContainer height={250}>
            <RadarChart outerRadius={100} width={730} height={250} data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={0.25} domain={[0, 5]} />
            <Radar dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
