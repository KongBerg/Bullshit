const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());

const pool = new Pool({
  connectionString: 'postgres://nxxhgnvh:Lc361RU23_qgMnSWMH7613MSiVlFCI0B@hattie.db.elephantsql.com/nxxhgnvh'
});

app.get('/api/sites', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM  hjemmesiders_co2');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  }
});

app.get('/api/sites', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM  infrastruktur');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  }
});

// Enable CORS for all origins
app.use(cors({
    origin: '*'
  }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log( `Server listening on port ${PORT}`));

// Frigør ressourcer, når serveren stoppes
process.on('exit', () => {
  client.end();
});