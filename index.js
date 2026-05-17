const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');
const dotenv = require('dotenv');

const app = express();
const port = 3000;
dotenv.config();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
  res.sendFile('public/home.html', { root: __dirname });
});

app.get('/assessJob', async (req, res) => {
  try {
    const query = req.query.q;
    
    const response = await fetch(
      `https://api.logo.dev/search?q=${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LOGO_DEV_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Search failed",
    });
  }
});

app.post('/savedJobs', async (req, res) => {
  console.log('Adding job post');
  console.log(`Request: ${JSON.stringify(req.body)}`);

  const userEmail = req.body.userEmail;
  const jobTitle = req.body.jobTitle;
  const companyName = req.body.companyName;
  const companyDomain = req.body.companyDomain;
  const logoURL = req.body.logoURL;
  const jobDesc = req.body.jobDesc;
  const flagged = req.body.flagged;

  const { data, error } = await supabase
    .from('savedJobs')
    .insert({
      userEmail,
      jobTitle,
      companyName,
      companyDomain,
      logoURL,
      jobDesc,
      flagged
    })
    .select();

  if (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
    console.log(error);
  } else {
    res.json(data);
  }
});

app.get('/savedJobs', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('savedJobs')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.listen(port, () => {
  console.log(`App is available on port: ${port}`);
});
