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
  "All": [0, 1],
  "Entire Home/Apt": [0, 0],
  "Private Room": [1, 1]
}

const accommodateRange = {
  "All": [0, 16],
  "1-2": [1, 2],
  "3-4": [3, 4],
  "5": [5, 16]
}

const bedroomsRange = {
  "All": [1, 25],
  "1-2": [1, 2],
  "3-4": [3, 4],
  "5": [5, 25]
}

const bedsRange = {
  "All": [1, 25],
  "1-2": [1, 2],
  "3-4": [3, 4],
  "5": [5, 25]
}

const responseTimeRange = {
  "All": [0, Number.MAX_SAFE_INTEGER],
  "<1hr": [0, 1],
  "1hr": [1, Number.MAX_SAFE_INTEGER]
}

const responseRateRange = {
  "All": [0, 1],
  "<0.9": [0, 0.9],
  "0.9": [0.9, 1]
}

const acceptanceRateRange = {
  "All": [0, 1],
  "<0.9": [0, 0.9],
  "0.9": [0.9, 1]
}

const superhostRange = {
  "All": [0, 1],
  "Yes": [1, 1],
  "No": [0, 0]
}

const totalListingRange = {
  "All": [1, Number.MAX_SAFE_INTEGER],
  "<5": [1, 5],
  "5": [5, Number.MAX_SAFE_INTEGER]
}

const reviewTypeMap = {
  'RATING': 'g.review_scores_rating',
  'ACCURACY': 'g.review_scores_accuracy',
  'CLEANLINESS': 'g.review_scores_cleanliness',
  'CHECKIN': 'g.review_scores_checkin',
  'COMMUNICATION': 'g.review_scores_communication',
  'LOCATION': 'g.review_scores_location',
  'VALUE': 'g.review_scores_value'
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
  SUM(IF(b.price>=250,1,0)) as 'OVER 250',
  SUM(IF(b.price IS NULL, 1, 0)) as 'Not Filled In (NULL)'
  FROM
      (SELECT g.ind, g.room_type, g.accommodates, g.bedrooms, g.beds, g.general_price AS price
       FROM General_listings g
       WHERE g.ind NOT IN
       (SELECT a.ind
       FROM
         (SELECT l.ind, AVG(price)
          FROM General_listings g JOIN LongTermRental l ON g.ind = l.ind
          WHERE date< CURDATE()
          GROUP BY l.ind) a)) b
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
      (SELECT g.ind, g.room_type, g.accommodates, g.bedrooms, g.beds
       FROM General_listings g
       WHERE g.ind NOT IN
       (SELECT a.ind
       FROM
         (SELECT l.ind
          FROM LongTermRental l
          WHERE date< CURDATE()
          ) a)) b
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
      (SELECT g.ind, g.room_type, g.accommodates, g.bedrooms, g.beds
       FROM General_listings g
       WHERE g.ind NOT IN
       (SELECT a.ind
       FROM
         (SELECT l.ind
          FROM LongTermRental l
          WHERE date< CURDATE()
          ) a)) b
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
  const responseTime = responseTimeRange[req.query.responseTime ?? 'All'];
  const responseRate = responseRateRange[req.query.responseRate ?? 'All'];
  const acceptanceRate = acceptanceRateRange[req.query.acceptanceRate ?? 'All'];
  const superhost = superhostRange[req.query.superhost ?? 'All'];
  const totalListing = totalListingRange[req.query.totalListing ?? 'All'];

  connection.query(`
  SELECT
      SUM(IF(b.price<50,1,0)) as 'UNDER 50',
      SUM(IF(b.price BETWEEN 50 AND 99,1,0)) as '50-99',
      SUM(IF(b.price BETWEEN 100 AND 149,1,0)) as '100-149',
      SUM(IF(b.price BETWEEN 150 AND 199,1,0)) as '150-199',
      SUM(IF(b.price BETWEEN 200 AND 249,1,0)) as '200-249',
      SUM(IF(b.price>=250,1,0)) as 'OVER 250',
      SUM(IF(b.price IS NULL, 1, 0)) as 'Not Filled In (NULL)'
      FROM
          (SELECT g.ind, g.host_id, g.general_price AS price
           FROM General_listings g
           WHERE g.ind NOT IN
           (SELECT a.ind
           FROM
             (SELECT l.ind, AVG(price)
              FROM General_listings g JOIN LongTermRental l ON g.ind = l.ind
              WHERE date< CURDATE()
              GROUP BY l.ind) a)) b
          JOIN Host_information h ON h.host_id=b.host_id
  WHERE h.host_response_time>='${responseTime[0]}' && h.host_response_time<='${responseTime[1]}' && 
        h.host_response_rate IS NOT NULL && h.host_response_rate>='${responseRate[0]}' && h.host_response_rate<='${responseRate[1]}' &&
        h.host_acceptance_rate IS NOT NULL && h.host_acceptance_rate>='${acceptanceRate[0]}' && h.host_acceptance_rate<='${acceptanceRate[1]}' && 
        h.host_is_superhost>='${superhost[0]}' && h.host_is_superhost<='${superhost[1]}' && 
        h.host_total_listings_count>='${totalListing[0]}' && h.host_total_listings_count<='${totalListing[1]}';
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
  const responseTime = responseTimeRange[req.query.responseTime ?? 'All'];
  const responseRate = responseRateRange[req.query.responseRate ?? 'All'];
  const acceptanceRate = acceptanceRateRange[req.query.acceptanceRate ?? 'All'];
  const superhost = superhostRange[req.query.superhost ?? 'All'];
  const totalListing = totalListingRange[req.query.totalListing ?? 'All'];

  connection.query(`
  SELECT COUNT(b.ind) AS COUNT
  FROM
            (SELECT g.ind, g.host_id
             FROM General_listings g
             WHERE g.ind NOT IN
             (SELECT a.ind
             FROM
               (SELECT l.ind
                FROM LongTermRental l
                WHERE date< CURDATE()
                ) a)) b
            JOIN Host_information h ON h.host_id=b.host_id
  WHERE h.host_response_time>='${responseTime[0]}' && h.host_response_time<='${responseTime[1]}' && 
        h.host_response_rate IS NOT NULL && h.host_response_rate>='${responseRate[0]}' && h.host_response_rate<='${responseRate[1]}' &&
        h.host_acceptance_rate IS NOT NULL && h.host_acceptance_rate>='${acceptanceRate[0]}' && h.host_acceptance_rate<='${acceptanceRate[1]}' && 
        h.host_is_superhost>='${superhost[0]}' && h.host_is_superhost<='${superhost[1]}' && 
        h.host_total_listings_count>='${totalListing[0]}' && h.host_total_listings_count<='${totalListing[1]}';

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
  const responseTime = responseTimeRange[req.query.responseTime ?? 'All'];
  const responseRate = responseRateRange[req.query.responseRate ?? 'All'];
  const acceptanceRate = acceptanceRateRange[req.query.acceptanceRate ?? 'All'];
  const superhost = superhostRange[req.query.superhost ?? 'All'];
  const totalListing = totalListingRange[req.query.totalListing ?? 'All'];

  connection.query(`
  SELECT 1.0*
  (SELECT COUNT(b.ind)
   FROM
     (SELECT g.ind, g.host_id
      FROM General_listings g
      WHERE g.ind NOT IN
      (SELECT a.ind
      FROM
        (SELECT l.ind
         FROM LongTermRental l
         WHERE date< CURDATE()
         ) a)) b
     JOIN Host_information h ON h.host_id=b.host_id
        WHERE h.host_response_time>='${responseTime[0]}' && h.host_response_time<='${responseTime[1]}' && 
              h.host_response_rate IS NOT NULL && h.host_response_rate>='${responseRate[0]}' && h.host_response_rate<='${responseRate[1]}' &&
              h.host_acceptance_rate IS NOT NULL && h.host_acceptance_rate>='${acceptanceRate[0]}' && h.host_acceptance_rate<='${acceptanceRate[1]}' && 
              h.host_is_superhost>='${superhost[0]}' && h.host_is_superhost<='${superhost[1]}' && 
              h.host_total_listings_count>='${totalListing[0]}' && h.host_total_listings_count<='${totalListing[1]}')/
       (SELECT COUNT(g.ind)
        FROM General_listings g) * 100 AS PERCENTAGE;
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
  const reviewType = reviewTypeMap[req.query.reviewType ?? 'RATING'];
  const listingSize = req.query.listingSize ?? 10;

  connection.query(`
  SELECT g.ind AS ID,
      g.review_scores_rating AS RATING, 
      g.review_scores_accuracy AS ACCURACY, 
      g.review_scores_cleanliness AS CLEANLINESS,
      g.review_scores_checkin AS CHECKIN, 
      g.review_scores_communication AS COMMUNICATION, 
      g.review_scores_location AS LOCATION,
      g.review_scores_value AS VALUE
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
  SELECT g.neighborhood, g.area, g.latitude, g.longitude, g.general_price,
      g.review_scores_rating AS RATING, 
      g.review_scores_accuracy AS ACCURACY, 
      g.review_scores_cleanliness AS CLEANLINESS,
      g.review_scores_checkin AS CHECKIN, 
      g.review_scores_communication AS COMMUNICATION, 
      g.review_scores_location AS LOCATION,
      g.review_scores_value AS VALUE
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

// route 9: For each neighborhood, calculate the average per-capita price for Airbnb and Hotels,
// and conclude whether one should accommodate in Airbnb or Hotels.
// For each neighborhood, compute the aggregate ratings, and calculate the average for Airbnb and 
// Hotels,and conclude whether one should accommodate in Airbnb or Hotels.
const recommendation = async function(req, res){
  const neighborhood = req.query.neighborhood ?? 'Inglewood';

  connection.query(`
    WITH airbnbs AS (SELECT g.*
      FROM General_listings g
      WHERE g.ind NOT IN
      (SELECT a.ind
      FROM
        (SELECT ind, AVG(price)
        FROM LongTermRental
        WHERE date< CURDATE()
        GROUP BY ind) a)),

    #compute ratings for short-term airbnbs
    airbnbs2 AS(SELECT ind, neighborhood,general_price,accommodates,
          (review_scores_accuracy+
          review_scores_cleanliness+
          review_scores_checkin+
          review_scores_communication+
          review_scores_location+
          review_scores_value) AS sum_ratings,
      SUM(CASE WHEN review_scores_accuracy IS NULL THEN 0 ELSE 1 END+
          CASE WHEN review_scores_cleanliness IS NULL THEN 0 ELSE 1 END+
          CASE WHEN review_scores_checkin IS NULL THEN 0 ELSE 1 END+
          CASE WHEN review_scores_communication IS NULL THEN 0 ELSE 1 END+
          CASE WHEN review_scores_location IS NULL THEN 0 ELSE 1 END+
          CASE WHEN review_scores_value IS NULL THEN 0 ELSE 1 END) AS count_ratings
      FROM airbnbs
      GROUP BY ind),

    #compute per-capita price for airbnbs
    airbnbs3 AS(SELECT *,
                (sum_ratings/count_ratings/5)*100 AS percentage_ratings,
                (general_price/accommodates) AS percapita_price
             FROM airbnbs2),

    #group by neighborhood
    airbnbs4 AS(SELECT DISTINCT neighborhood,
                AVG(percentage_ratings) AS avg_bnbratings,
                AVG(percapita_price) AS avg_bnbprice
            FROM airbnbs3
            GROUP BY neighborhood),

    #compute ratings for hotels
    hotels2 AS(SELECT hotel_id,neighborhood,price,number_people,
                (cleanness+service+amenities+facilities+ecofriendly) AS sum_ratings,
            SUM(CASE WHEN cleanness IS NULL THEN 0 ELSE 1 END+
            CASE WHEN service IS NULL THEN 0 ELSE 1 END+
            CASE WHEN amenities IS NULL THEN 0 ELSE 1 END+
            CASE WHEN facilities IS NULL THEN 0 ELSE 1 END+
            CASE WHEN ecofriendly IS NULL THEN 0 ELSE 1 END)
            AS count_ratings
            FROM hotels
            GROUP BY hotel_id),

    #compute per-capita price for hotels
    hotels3 AS(SELECT *,
            (sum_ratings/count_ratings/10)*100 AS percentage_ratings,
            (price/number_people) AS percapita_price
            FROM hotels2),

    #group results by neighborhood
    hotels4 AS(SELECT DISTINCT neighborhood,
              AVG(percentage_ratings) AS avg_hotelsratings,
              AVG(percapita_price) AS avg_hotelsprice
            FROM hotels3
            GROUP BY neighborhood),

    #join airbnbs and hotels, and display the better options
    summ_stats AS(SELECT a.neighborhood AS neighborhood,
        (CASE WHEN h.avg_hotelsratings>a.avg_bnbratings THEN 'Hotels' ELSE 'Airbnb' END) AS better_rating,
        (CASE WHEN h.avg_hotelsprice<a.avg_bnbprice THEN 'Hotels' ELSE 'Airbnb' END) AS better_price
        FROM airbnbs4 a
        LEFT JOIN hotels4 h
        ON a.neighborhood = h.neighborhood)
        
    #select results from designated neighborhood
    SELECT * FROM summ_stats WHERE neighborhood = '${neighborhood}';
  `, (err, data) => {
    if (err){
      console.log(err);
      console.log('query failed');
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
  listing_info,
  recommendation
}
