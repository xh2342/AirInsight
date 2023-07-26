import React, { useEffect, useState } from 'react';
import { Container, Grid, TextField, MenuItem, Button, Link} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ListingCard from '../components/ListingCard';

const config = require('../config.json');
export default function TopListing() {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [listingId, setListingId] = useState(null);
  const [reviewType, setReviewType] = useState('RATING');
  const [listingSize, setListingSize] = useState(10);

  const columns = [
    { field: 'ID', headerName: 'ID', width: 300, renderCell: (params) => (
        <Link onClick={() => setListingId(params.row.ID)}>{params.value}</Link>
    ) },
    { field: 'RATING', headerName: 'Rating' },
    { field: 'ACCURACY', headerName: 'Accuracy' },
    { field: 'CLEANLINESS', headerName: 'Cleanliness' },
    { field: 'CHECKIN', headerName: 'Check-in' },
    { field: 'COMMUNICATION', headerName: 'Communication' },
    { field: 'LOCATION', headerName: 'Location' },
    { field: 'VALUE', headerName: 'Value' }
  ]


  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/top_ranking`)
    .then(res => res.json())
    .then(resJson => {
      const rankings = resJson.map((listing) => ({ id: listing.ID, ...listing}));
      setData(rankings);
    });

  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/top_ranking?reviewType=${reviewType}` + 
    `&listingSize=${listingSize}`)
    .then(res => res.json())
    .then(resJson => {
      const rankings = resJson.map((listing) => ({id:listing.ID, ...listing}));
      setData(rankings);
    });
  }

  return (
    <Container>
      {listingId && <ListingCard listingId={listingId} handleClose={() => setListingId(null)} />}
      <h2>Top Listing</h2>
        
      <Grid container spacing={6}>
        <Grid item xs={4}>
          <p>Review Type</p>
          <TextField 
          label='Select Review Type'
          select value={reviewType} sx={{width:200}} onChange={(e) => setReviewType(e.target.value)}>
            <MenuItem value='RATING'>Rating</MenuItem>
            <MenuItem value='ACCURACY'>Accuracy</MenuItem>
            <MenuItem value='CLEANLINESS'>Cleanliness</MenuItem>
            <MenuItem value='CHECKIN'>Check-in</MenuItem>
            <MenuItem value='COMMUNICATION'>Communication</MenuItem>
            <MenuItem value='LOCATION'>Location</MenuItem>
            <MenuItem value='VALUE'>Value</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={4}>
          <p>Page Size</p>
          <TextField 
          label='Select Listing Size'
          select value={listingSize} sx={{width:200}} onChange={(e) => setListingSize(e.target.value)}>
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='20'>20</MenuItem>
            <MenuItem value='50'>50</MenuItem>
            <MenuItem value='100'>100</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={4}>
          <Button xs={4} onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Search
          </Button>
        </Grid>
      </Grid>
     
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

    </Container>
  );
};