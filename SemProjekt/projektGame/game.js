// Require the necessary modules
const { Client } = require('pg');
const express = require('express');

// Create a new Express application
const app = express();

// Set the port number to listen on
const port = process.env.PORT || 3000;

// Define the database connection parameters
const connectionString = process.env.hattie.db.elephantsql.com

// Create a new PostgreSQL client instance
const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Connect to the database
client.connect();

// Define the websites array
const websites = [
  { name: "Website 1", co2: 50 },
  { name: "Website 2", co2: 100 },
  { name: "Website 3", co2: 75 },
  { name: "Website 4", co2: 90 },
  { name: "Website 5", co2: 60 },
  { name: "Website 6", co2: 80 },
  { name: "Website 7", co2: 70 },
  { name: "Website 8", co2: 85 },
  { name: "Website 9", co2: 55 },
  { name: "Website 10", co2: 95 }
];

// Define the SQL query to insert the website into the websites table
const insertQuery = 'INSERT INTO websites (name, co2) VALUES ($1, $2)';

// Add a listener to the first button
app.get('/website1', function(req, res) {
  // Choose two random websites from the list
  const website1 = websites[Math.floor(Math.random() * websites.length)];
  const website2 = websites[Math.floor(Math.random() * websites.length)];

  // If the first website has a higher CO2 footprint than the second website
  if (website1.co2 > website2.co2) {
    // Show a message saying that the user chose the correct website
    res.send("You chose " + website1.name + ". Correct!");
  } else {
    // Show a message saying that the user chose the incorrect website
    res.send("You chose " + website1.name + ". Incorrect!");
  }

  // Insert the chosen websites into the database
  client.query(insertQuery, [website1.name, website1.co2], (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Website inserted successfully");
  });
});

// Add a listener to the second button
app.get('/website2', function(req, res) {
  // Choose two random websites from the list
  const website1 = websites[Math.floor(Math.random() * websites.length)];
  const website2 = websites[Math.floor(Math.random() * websites.length)];

  // If the second website has a higher CO2 footprint than the first website
  if (website2.co2 > website1.co2) {
    // Show a message saying that the user chose the correct website
    res.send("You chose " + website2.name + ". Correct!");
  } else {
    // Show a message saying that the user chose the incorrect website
    res.send("You chose " + website2.name + ". Incorrect!");
  }

  // Insert the chosen websites into the database
  client.query(insertQuery, [website1.name, website1.co2], (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Website inserted successfully");
  });
});

