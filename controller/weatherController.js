const { Op } = require('sequelize');
const axios = require('axios');

let WeatherLog;
try {
  const models = require('../models');
  WeatherLog = models.WeatherLog;
} catch (e) {
  WeatherLog = null;
}

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

      if (WeatherLog) {
        await WeatherLog.create(liveWeatherData).catch(() => {});
      }
    } catch (apiErr) {
      console.log('OpenWeather Fetch Error:', apiErr.response ? apiErr.response.data : apiErr.message);
    }
  }

  try {
    if (!WeatherLog) {
      return res.json({
        status: 'success (Simulasi DB)',
        total_records: 1,
        data: [liveWeatherData || { id: 1, city: city || 'Yogyakarta', temperature: 28, weatherCondition: 'Clear' }]
      });
    }

    let whereClause = {};
    if (city) whereClause.city = { [Op.iLike]: `%${city}%` };
    if (condition) whereClause.weatherCondition = { [Op.iLike]: `%${condition}%` };

    const queryOptions = {
      where: whereClause,
      order: [['id', 'DESC']]
    };
    if (limit) queryOptions.limit = parseInt(limit);

    const data = await WeatherLog.findAll(queryOptions);

    return res.json({
      status: 'success',
      total_records: data.length,
      data: data
    });

  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data dari database',
      error: err.message
    });
  }
};

exports.createWeather = async (req, res) => {
  try {
    const { city, country, temperature, humidity, windSpeed, weatherCondition, airQualityIndex } = req.body;
    if (!WeatherLog) {
      return res.status(201).json({ 
        status: 'success (Simulasi DB)', 
        message: 'Data cuaca berhasil ditambahkan', 
        data: { id: 1, city, country, temperature, humidity, windSpeed, weatherCondition, airQualityIndex } 
      });
    }

    const newWeather = await WeatherLog.create({
      city, country, temperature, humidity, windSpeed, weatherCondition, airQualityIndex
    });

    return res.status(201).json({ 
      status: 'success', 
      message: 'Data cuaca berhasil ditambahkan ke database', 
      data: newWeather 
    });
  } catch (err) {
    return res.status(500).json({ 
      status: 'error', 
      message: 'Gagal menyimpan data cuaca', 
      error: err.message 
    });
  }
};

exports.updateWeather = async (req, res) => {
  try {
    const { id } = req.params;
    if (!WeatherLog) return res.status(201).json({ status: 'success (Simulasi DB)', message: 'Data berhasil diperbarui' });

    const weather = await WeatherLog.findByPk(id);
    if (!weather) return res.status(404).json({ message: 'Data cuaca tidak ditemukan' });

    await weather.update(req.body);
    return res.json({ status: 'success', message: 'Data cuaca berhasil diperbarui', data: weather });
  } catch (err) {
    return res.status(500).json({ 
      status: 'error', 
      message: 'Gagal memperbarui data cuaca', 
      error: err.message 
    });
  }
};

exports.deleteWeather = async (req, res) => {
  try {
    const { id } = req.params;
    if (!WeatherLog) return res.status(201).json({ status: 'success (Simulasi DB)', message: 'Data berhasil dihapus' });

    const weather = await WeatherLog.findByPk(id);
    if (!weather) return res.status(404).json({ message: 'Data cuaca tidak ditemukan' });

    await weather.destroy();
    return res.json({ status: 'success', message: `Data cuaca dengan ID ${id} berhasil dihapus` });
  } catch (err) {
    return res.status(500).json({ 
      status: 'error', 
      message: 'Gagal menghapus data cuaca', 
      error: err.message 
    });
  }
};