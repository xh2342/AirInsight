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
// get home page
app.get('/home', routes.home);
// get property features page
app.get('/property_features', routes.property_features);
// get host information page
app.get('/host_info', routes.host_info);
// get hotel comparisons page
app.get('/hotels', routes.hotels);
// get top listing page
app.get('/top_listing', routes.top_listing);
// get information for individual top listing airbnb (pop-up window)
app.get('/top_listing/:air_id', routes.listing_info);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
