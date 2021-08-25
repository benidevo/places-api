const axios = require('axios');
require('dotenv').config()

const API_KEY = process.env.API_KEY;

const getCoordsForAddress = async address => {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);

  const data = response.data;

  if (!data || data.status === 'ZERO_RESULTS') {
    throw new Error('Could not find a location for the specified address')
  };

  const coordinates = data.results[0].geometry.location;

  return coordinates;
};

module.exports = getCoordsForAddress;
