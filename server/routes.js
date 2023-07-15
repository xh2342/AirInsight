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

// maps mapping inputs to query conditions
const roomTypeDict = {
  "All": [0, 3],
  "Entire Home/Apt": [0, 0],
  "Private Room": [1, 1],
  "Hotel Roon": [2, 2],
  "Shared Room": [3, 3]
}

const accommodateRange = {
  "All": [0, 16],
  "1-2": [1, 2],
  "3-4": [3, 4],
  "5-8": [5, 8],
  "9+": [9, 16]
}

const bedroomsRange = {
  "All": [1, 25],
  "1-2": [1, 2],
  "3-4": [3, 4],
  "5-8": [5, 8],
  "9+": [9, 25]
}

const bedsRange = {
  "All": [1, 50],
  "1-2": [1, 2],
  "3-4": [3, 4],
  "5-8": [5, 8],
  "9+": [9, 50]
}

// Route 1: GET /search_features
// After excluding those for long-term rental from general_listings, classify the 
// remaining listings by property features, and return the sum information for number 
// of airbnb listingsamong different price ranges
const search_features = async function(req, res){
  const roomType = roomTypeDict[req.query.roomType ?? 'All'];
  const accommodatesLow = accommodateRange[req.query.accommodates ?? 'All'][0];
  const accommodatesHigh = accommodateRange[req.query.accommodates ?? 'All'][1];
  const bedroomsLow = bedroomsRange[req.query.beedrooms ?? 'All'][0];
  const bedroomsHigh = bedroomsRange[req.query.bedrooms ?? 'All'][1];
  const bedsLow = bedsRange[req.query.beds ?? 'All'][0];
  const bedsHigh = bedsRange[req.query.beds ?? 'All'][1];

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
      WHERE b.room_type>='${roomType[0]}' && b.room_type<='${roomType[1]}' && 
            b.accommodates >= '${accommodatesLow}' && b.accommodates <= '${accommodatesHigh}' &&
            b.bedrooms >='${bedroomsLow}' && b.bedrooms <= '${bedroomsHigh}' &&
            b.beds >= '${bedsLow}' && b.beds <= '${bedsHigh}';
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
  const roomType = roomTypeDict[req.query.roomType ?? 'All'];
  const accommodatesLow = accommodateRange[req.query.accommodates ?? 'All'][0];
  const accommodatesHigh = accommodateRange[req.query.accommodates ?? 'All'][1];
  const bedroomsLow = bedroomsRange[req.query.beedrooms ?? 'All'][0];
  const bedroomsHigh = bedroomsRange[req.query.bedrooms ?? 'All'][1];
  const bedsLow = bedsRange[req.query.beds ?? 'All'][0];
  const bedsHigh = bedsRange[req.query.beds ?? 'All'][1];

  connection.query(`
  SELECT COUNT(b.ind) AS COUNT
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
  WHERE b.room_type>='${roomType[0]}' && b.room_type<='${roomType[1]}' && 
        b.accommodates >= '${accommodatesLow}' && b.accommodates <= '${accommodatesHigh}' &&
        b.bedrooms >='${bedroomsLow}' && b.bedrooms <= '${bedroomsHigh}' &&
        b.beds >= '${bedsLow}' && b.beds <= '${bedsHigh}';
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
  const roomType = roomTypeDict[req.query.roomType ?? 'All'];
  const accommodatesLow = accommodateRange[req.query.accommodates ?? 'All'][0];
  const accommodatesHigh = accommodateRange[req.query.accommodates ?? 'All'][1];
  const bedroomsLow = bedroomsRange[req.query.beedrooms ?? 'All'][0];
  const bedroomsHigh = bedroomsRange[req.query.bedrooms ?? 'All'][1];
  const bedsLow = bedsRange[req.query.beds ?? 'All'][0];
  const bedsHigh = bedsRange[req.query.beds ?? 'All'][1];

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
        WHERE b.room_type>='${roomType[0]}' && b.room_type<='${roomType[1]}' && 
              b.accommodates >= '${accommodatesLow}' && b.accommodates <= '${accommodatesHigh}' &&
              b.bedrooms >='${bedroomsLow}' && b.bedrooms <= '${bedroomsHigh}' &&
              b.beds >= '${bedsLow}' && b.beds <= '${bedsHigh}')/
       (SELECT COUNT(g.ind)
        FROM General_listings g ) * 100 AS PERCENTAGE;
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

// Route 4: After excluding those for long-term rental from general_listings, join
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



// Route 5: return the number of records for the retrived hotel data
// app.get('/hotels', routes.hotels);
const search_host_info_count = async function(req, res){
  const inputHost_response_time = req.query.inputHost_response_time ?? 0;
  const inputHost_response_rate = req.query.inputHost_response_rate ?? 0;
  const inputHost_acceptance_rate = req.query.inputHost_acceptance_rate ?? 0;
  const inputHost_is_superhost = req.query.inputHost_is_superhost === 'true'? 1 : 0;
  const inputHost_total_listings_count = req.query.inputHost_total_listings_count ?? 0;

  connection.query(`
  SELECT COUNT(b.ind)
  FROM
          (SELECT g.ind, g.host_id
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

// Route 6: calculate the percentage of the hotel records gained among the whole general_listings
// app.get('/top_listing', routes.top_listing);
const search_host_info_percentage = async function(req, res){
  const inputHost_response_time = req.query.inputHost_response_time ?? 0;
  const inputHost_response_rate = req.query.inputHost_response_rate ?? 0;
  const inputHost_acceptance_rate = req.query.inputHost_acceptance_rate ?? 0;
  const inputHost_is_superhost = req.query.inputHost_is_superhost === 'true'? 1 : 0;
  const inputHost_total_listings_count = req.query.inputHost_total_listings_count ?? 0;

  connection.query(`
  SELECT 1.0*
       (SELECT COUNT(b.ind)
        FROM
          (SELECT g.ind, g.host_id
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
            && h.host_is_superhost=='${inputHost_is_superhost}' && h.host_total_listings_count='${inputHost_total_listings_count}')/
       (SELECT COUNT(g.ind)
        FROM General_listings g) * 100 AS Percentage;
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

// Rooute 7: return the top ranking listings based on review category
const top_ranking = async function(req, res){
  const reviewType = req.query.reviewType ?? 'Overall';
  const listingSize = req.query.listingSize ?? 10;

  connection.query(`
  SELECT g.ind, g.review_scores_rating, g.review_scores_accuracy, g.review_scores_cleanliness,
       g.review_scores_checkin, g.review_scores_communication, g.review_scores_location,
       g.review_scores_rating, g.review_scores_value
FROM General_listings g
ORDER BY ${reviewType} DESC
LIMIT ${listingSize};
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


// route 8: demonstrate the details of the listing when clicking the listing
const listing_info = async function(req, res){
  const listing_id = req.params.listing_id ?? 0;

  connection.query(`
  SELECT g.neighborhood, g.area, g.latitude, g.longitude, g.general_price
  FROM General_listings g
  WHERE g.ind=${listing_id}
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


module.exports = {
  search_features,
  search_features_count,
  search_features_percentage,
  search_host_info,
  search_host_info_count,
  search_host_info_percentage,
  top_ranking,
  listing_info
}
