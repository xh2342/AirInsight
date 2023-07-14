const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));


// Route 1: GET /search_features
// After excluding those for long-term rental from general_listings, classify the 
// remaining listings by property features, and return the sum information for number 
// of airbnb listingsamong different price ranges
const search_features = async function(req, res){
  const inputRoom_type = req.query.inputRoom_type? req.query.inputRoom_type : '%';
  const inputAccommodates = req.query.inputAccommodates ?? 0;
  const inputBedrooms = req.query.inputBedrooms ?? 0;
  const inputBeds = req.query.inputBeds ?? 0;

  connection.query(`
  SELECT
      SUM(IF(b.price<50,1,0)) as 'UNDER 50',
      SUM(IF(b.price BETWEEN 50 AND 99,1,0)) as '50-99',
      SUM(IF(b.price BETWEEN 100 AND 149,1,0)) as '100-149',
      SUM(IF(b.price BETWEEN 150 AND 199,1,0)) as '150-199',
      SUM(IF(b.price BETWEEN 200 AND 249,1,0)) as '200-249',
      SUM(IF(b.price BETWEEN 250 AND 299,1,0)) as '250-299',
      SUM(IF(b.price BETWEEN 300 AND 349,1,0)) as '300-349',
      SUM(IF(b.price BETWEEN 350 AND 399,1,0)) as '350-399',
      SUM(IF(b.price>=400,1,0)) as 'OVER 400',
      SUM(IF(b.price IS NULL, 1, 0)) as 'Not Filled In (NULL)'
      FROM
          (SELECT g.ind, g.room_type, g.accommodates, g.bedrooms, g.beds, g.general_price AS price
           FROM General_listings g
           WHERE g.ind NOT IN
           (SELECT a.ind
           FROM
             (SELECT ind, AVG(price)
              FROM LongTermRental
              WHERE date< CURDATE()
              GROUP BY ind) a)) b
      WHERE b.room_type='${inputRoom_type}' && b.accommodates='${inputAccommodates}' &&
            b.bedrooms='${inputBedrooms}' && b.beds='${inputBeds}';
  `, (err, data) => {
    if (err){
      console.log(err);
      res.json([]);
    }else if (data.length === 0){
      res.json([]);
    }else{
      res.json(data);
    }
  })
}

// Route 2: how many records could we get by searching features
const search_features_count = async function(req, res){
  const inputRoom_type = req.query.inputRoom_type? req.query.inputRoom_type : '%';
  const inputAccommodates = req.query.inputAccommodates ?? 0;
  const inputBedrooms = req.query.inputBedrooms ?? 0;
  const inputBeds = req.query.inputBeds ?? 0;

  connection.query(`
  SELECT COUNT(b.ind)
  FROM
        (SELECT g.ind, g.room_type, g.accommodates, g.bedrooms, g.beds, g.general_price
        FROM General_listings g
        WHERE g.ind NOT IN
        (SELECT a.ind
        FROM
          (SELECT ind, AVG(price)
            FROM LongTermRental
            WHERE date< CURDATE()
            GROUP BY ind) a)) b
  WHERE b.room_type='${inputRoom_type}' && b.accommodates='${inputAccommodates}' &&
              b.bedrooms='${inputBedrooms}' && b.beds='${inputBeds}';
  `, (err, data) => {
    if (err){
      console.log(err);
      res.json([]);
    }else if (data.length === 0){
      res.json([]);
    }else{
      res.json(data);
    }
  })
}


// Route 3: calculate the percentage of the records gained among the whole general_listings
const search_features_percentage = async function(req, res){
  const inputRoom_type = req.query.inputRoom_type? req.query.inputRoom_type : '%';
  const inputAccommodates = req.query.inputAccommodates ?? 0;
  const inputBedrooms = req.query.inputBedrooms ?? 0;
  const inputBeds = req.query.inputBeds ?? 0;

  connection.query(`
  SELECT 1.0*
       (SELECT COUNT(b.ind)
        FROM
      (SELECT g.ind, g.general_price, g.room_type, g.accommodates, g.bedrooms, g.beds
       FROM General_listings g
       WHERE g.ind NOT IN
       (SELECT a.ind
       FROM
         (SELECT ind, AVG(price)
          FROM LongTermRental
          WHERE date< CURDATE()
          GROUP BY ind) a)) b
        WHERE b.room_type='${inputRoom_type}' && b.accommodates='${inputAccommodates}' &&
            b.bedrooms='${inputBedrooms}' && b.beds='${inputBeds}')/
       (SELECT COUNT(g.ind)
        FROM General_listings g ) * 100 AS Percentage;
  `, (err, data) => {
    if (err){
      console.log(err);
      res.json([]);
    }else if (data.length === 0){
      res.json([]);
    }else{
      res.json(data);
    }
  })
}

// Route 4: After excluding those for long-term rental from general_listings, we join
// host information table, and based on the host information categories, return the sum information for number of airbnb listings
// among different price ranges
const search_host_info = async function(req, res){
  const inputHost_response_time = req.query.inputHost_response_time ?? 0;
  const inputHost_response_rate = req.query.inputHost_response_rate ?? 0;
  const inputHost_acceptance_rate = req.query.inputHost_acceptance_rate ?? 0;
  const inputHost_is_superhost = req.query.inputHost_is_superhost === 'true'? 1 : 0;
  const inputHost_total_listings_count = req.query.inputHost_total_listings_count ?? 0;

  connection.query(`
  SELECT
  SUM(IF(b.price<50,1,0)) as 'UNDER 50',
  SUM(IF(b.price BETWEEN 50 AND 99,1,0)) as '50-99',
  SUM(IF(b.price BETWEEN 100 AND 149,1,0)) as '100-149',
  SUM(IF(b.price BETWEEN 150 AND 199,1,0)) as '150-199',
  SUM(IF(b.price BETWEEN 200 AND 249,1,0)) as '200-249',
  SUM(IF(b.price BETWEEN 250 AND 299,1,0)) as '250-299',
  SUM(IF(b.price BETWEEN 300 AND 349,1,0)) as '300-349',
  SUM(IF(b.price BETWEEN 350 AND 399,1,0)) as '350-399',
  SUM(IF(b.price>=400,1,0)) as 'OVER 400',
  SUM(IF(b.price IS NULL, 1, 0)) as 'Not Filled In (NULL)'
  FROM
      (SELECT g.ind, g.host_id, g.general_price AS price
       FROM General_listings g
       WHERE g.ind NOT IN
       (SELECT a.ind
       FROM
         (SELECT ind, AVG(price)
          FROM LongTermRental
          WHERE date< CURDATE()
          GROUP BY ind) a)) b
      JOIN Host_information h ON h.host_id=b.host_id
  WHERE h.host_response_time='${inputHost_response_time}' && h.host_response_rate IS NOT NULL &&
        h.host_response_rate='${inputHost_response_rate}' && h.host_acceptance_rate IS NOT NULL
        && h.host_acceptance_rate='${inputHost_acceptance_rate}'
        && h.host_is_superhost=='${inputHost_is_superhost}' && h.host_total_listings_count='${inputHost_total_listings_count}';
  `, (err, data) => {
    if (err){
      console.log(err);
      res.json([]);
    }else if (data.length === 0){
      res.json([]);
    }else{
      res.json(data);
    }
  })
}

// Route 3: get hotel comparisons page
// app.get('/hotels', routes.hotels);
const search_hotels = async function(req, res){
  
}

// Route 4: get top listing page
// app.get('/top_listing', routes.top_listing);
const search_top_listing = async function(req, res){
  
}

// Rooute 5: get information for individual top listing airbnb (pop-up window)
// app.get('/top_listing/:air_id', routes.listing_info);
const listing_info = async function(req, res){
  
}

module.exports = {
  search_features,
  search_features_count,
  search_features_percentage,
  search_host_info,
}
