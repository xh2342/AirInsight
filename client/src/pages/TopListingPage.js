import React, { useEffect, useState } from 'react';
import { Select, Container, Grid, MenuItem, Button, Link} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ListingCard from '../components/ListingCard';

const config = require('../config.json');

function changeBackgroundImg(){
  document.getElementById("page-container").style.backgroundImage = "url(../img/toplisting-background.jpg)";
};

export default function TopListing() {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [listingId, setListingId] = useState(null);
  const [reviewType, setReviewType] = useState('RATING');
  const [listingSize, setListingSize] = useState(10);

  const columns = [
    { field: 'ID', headerName: 'Listing ID', flex: 1 , renderCell: (params) => (
        <Link onClick={() => setListingId(params.row.ID)}>
          <div class="nav-link">{params.value}</div>
        </Link>
    ) },
    { field: 'RATING', headerName: 'Rating',flex: 1  },
    { field: 'ACCURACY', headerName: 'Accuracy',flex: 1 },
    { field: 'CLEANLINESS', headerName: 'Cleanliness',flex: 1 },
    { field: 'CHECKIN', headerName: 'Check-in',flex: 1 },
    { field: 'COMMUNICATION', headerName: 'Communication',flex: 1 },
    { field: 'LOCATION', headerName: 'Location',flex: 1 },
    { field: 'VALUE', headerName: 'Value',flex: 1 }
  ]
  
  changeBackgroundImg();

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
        
      <Grid container spacing={6} paddingBottom={'30px'}>
        <Grid item xs={3}>
          <h2 class='menu-item'>Review Type</h2>
          <Select className='menu-list' value={reviewType} sx={{borderRadius:'0 0 10px 10px'}}
           onChange={(e) => setReviewType(e.target.value)}>
            <MenuItem value='RATING'><div className='menu-each'>Rating</div></MenuItem>
            <MenuItem value='ACCURACY'><div className='menu-each'>Accuracy</div></MenuItem>
            <MenuItem value='CLEANLINESS'><div className='menu-each'>Cleanliness</div></MenuItem>
            <MenuItem value='CHECKIN'><div className='menu-each'>Check-in</div></MenuItem>
            <MenuItem value='COMMUNICATION'><div className='menu-each'>Communication</div></MenuItem>
            <MenuItem value='LOCATION'><div className='menu-each'>Location</div></MenuItem>
            <MenuItem value='VALUE'><div className='menu-each'>Value</div></MenuItem>
          </Select>
        </Grid>

        <Grid item xs={3}>
          <h2 class='menu-item'>Page Size</h2>
          <Select className='menu-list' value={listingSize} sx={{borderRadius:'0 0 10px 10px'}}
          onChange={(e) => setListingSize(e.target.value)}>
            <MenuItem value='10'><div className='menu-each'>10</div></MenuItem>
            <MenuItem value='20'><div className='menu-each'>20</div></MenuItem>
            <MenuItem value='50'><div className='menu-each'>50</div></MenuItem>
            <MenuItem value='100'><div className='menu-each'>100</div></MenuItem>
          </Select>
        </Grid>

        <Grid item xs={3}>
          <Container class = 'btn-container'>
            <Button variant="contained" class='btn' onClick={() => search()}>
              <b>SEARCH</b>
            </Button>
            </Container>
        </Grid>


      </Grid>
      <DataGrid 
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
        isRowSelectable={() => false}
        isCellEditable={() => false}
        sx = {{
          backgroundColor: "rgba(255,255,255, 0.3)",
          color: "white",
          fontFamily: "Nunito"
        }}
      />
      <p class='regular'>
        *numerical review is based on 1-5 Likert scale (1=extremely unsatisfactory; 
        2=very unsatisfactory; 3=neutral; 4=very satisfactory; 5-extremely satisfactory)
      </p>
    </Container>
  );
};