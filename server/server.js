const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
// get property features
app.get('/search_features', routes.search_features);
// get number of result for searching by property features
app.get('/search_features_count', routes.search_features_count);
// calculate the percentage of the records gained among the whole general_listings
app.get('search_features_percentage', routes.search_features_percentage);
// get host information
app.get('/search_host_info', routes.search_host_info);

// get hotel comparisons
app.get('/search_hotels', routes.search_hotels);
// get top listing
app.get('/search_top_listing', routes.search_top_listing);
// get information for individual top listing airbnb (pop-up window)
app.get('/top_listing/:air_id', routes.listing_info);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
