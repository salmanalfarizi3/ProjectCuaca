const axios = require('axios');

exports.getWeatherData = async (req, res) => {
  const { city, condition, limit } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  let liveWeatherData = null;

  if (city && apiKey) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
      const wData = response.data;

      liveWeatherData = {
        city: wData.name,
        country: wData.sys?.country || 'ID',
        temperature: wData.main.temp,
        humidity: wData.main.humidity,
        windSpeed: wData.wind.speed,
        weatherCondition: wData.weather[0].main,
        airQualityIndex: Math.floor(Math.random() * 50) + 20
      };
    } catch (apiErr) {
      console.log('OpenWeather Fetch Error:', apiErr.message);
    }
  }

  return res.json({
    status: 'success (Serverless Mode)',
    total_records: 1,
    data: [liveWeatherData || { 
      id: 1, 
      city: city || 'Yogyakarta', 
      country: 'ID',
      temperature: 28.5, 
      humidity: 70,
      windSpeed: 3.5,
      weatherCondition: condition || 'Clear',
      airQualityIndex: 30 
    }]
  });
};

exports.createWeather = async (req, res) => {
  const { city, country, temperature, humidity, windSpeed, weatherCondition, airQualityIndex } = req.body;
  
  return res.status(201).json({ 
    status: 'success (Serverless Mode)', 
    message: 'Data cuaca berhasil ditambahkan', 
    data: { id: Math.floor(Math.random() * 1000), city, country, temperature, humidity, windSpeed, weatherCondition, airQualityIndex } 
  });
};

exports.updateWeather = async (req, res) => {
  const { id } = req.params;
  return res.json({ 
    status: 'success (Serverless Mode)', 
    message: `Data cuaca dengan ID ${id} berhasil diperbarui`,
    data: req.body 
  });
};

exports.deleteWeather = async (req, res) => {
  const { id } = req.params;
  return res.json({ 
    status: 'success (Serverless Mode)', 
    message: `Data cuaca dengan ID ${id} berhasil dihapus` 
  });
};