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
// get the percentage of the records retrived among the whole general_listings
app.get('/search_features_percentage', routes.search_features_percentage);
// get host information
app.get('/search_host_info', routes.search_host_info);
// get the number of hotel records for the retrived hotel data
app.get('/search_host_info_count', routes.search_host_info_count);
// get the percentage of the records retrived among the whole general listing
app.get('/search_host_info_percentage', routes.search_host_info_percentage);
// get top ranking for the selected categories
app.get('/top_ranking', routes.top_ranking);
// get the information for the selected listing
app.get('/top_listing/:listing_id', routes.listing_info);
// get recommendation for accommodation based on price per-capita
app.get('/rec', routes.recommendation);
// get the middle point for maps by neighborhood, used for mapping
app.get('/midpoint',routes.neighborhood_midpoint);
// get the airbnb listings for the given neighborhood
app.get('/airbnb_neighborhood',routes.airbnb_neighborhood);
// get the hotels listings for the given neighborhood
app.get('/hotels_neighborhood',routes.hotels_neighborhood);
// get all the neighborhoods in the data
app.get('/neighborhoods',routes.neighborhoods);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
