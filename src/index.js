const express = require('express');
const cors = require('cors');
const { Permit } = require('permitio');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const permit = new Permit({
  token: process.env.PERMIT_API_KEY,
  pdp: process.env.PDP_URL
});

app.listen(port, () => {
  console.log(`Authorization server running on port ${port}`);
  console.log(`Connected to Permit.io PDP at ${process.env.PDP_URL || 'http://localhost:7766'}`);
});