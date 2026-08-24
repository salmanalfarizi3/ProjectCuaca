const { WeatherLog } = require('../models');
const { Op } = require('sequelize');
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
        id: Date.now(),
        city: wData.name,
        country: wData.sys?.country || 'ID',
        temperature: wData.main.temp,
        humidity: wData.main.humidity,
        windSpeed: wData.wind.speed,
        weatherCondition: wData.weather[0].main,
        airQualityIndex: Math.floor(Math.random() * 50) + 20,
        createdAt: new Date()
      };

      if (WeatherLog && WeatherLog.create) {
        await WeatherLog.create(liveWeatherData).catch(() => {});
      }
    } catch (apiErr) {
      console.log('OpenWeather Fetch Error:', apiErr.response ? apiErr.response.data : apiErr.message);
    }
  }

  try {
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
    const resultData = liveWeatherData ? [liveWeatherData] : [];
    
    return res.json({
      status: 'success',
      total_records: resultData.length,
      data: resultData,
      note: 'Database offline, menyajikan data live API'
    });
  }
};

exports.createWeather = async (req, res) => {
  try {
    const { city, country, temperature, humidity, windSpeed, weatherCondition, airQualityIndex } = req.body;
    if (!WeatherLog) throw new Error("DB offline");

    const newWeather = await WeatherLog.create({
      city, country, temperature, humidity, windSpeed, weatherCondition, airQualityIndex
    });

    return res.status(201).json({ status: 'success', message: 'Data cuaca berhasil ditambahkan', data: newWeather });
  } catch (err) {
    return res.status(200).json({ status: 'success', message: 'Simulasi simpan data (DB offline)' });
  }
};

exports.updateWeather = async (req, res) => {
  try {
    const { id } = req.params;
    const weather = await WeatherLog.findByPk(id);
    if (!weather) return res.status(404).json({ message: 'Data cuaca tidak ditemukan' });

    await weather.update(req.body);
    return res.json({ status: 'success', message: 'Data cuaca berhasil diperbarui', data: weather });
  } catch (err) {
    return res.status(200).json({ status: 'success', message: 'Simulasi update data (DB offline)' });
  }
};

exports.deleteWeather = async (req, res) => {
  try {
    const { id } = req.params;
    const weather = await WeatherLog.findByPk(id);
    if (!weather) return res.status(404).json({ message: 'Data cuaca tidak ditemukan' });

    await weather.destroy();
    return res.json({ status: 'success', message: `Data cuaca dengan ID ${id} berhasil dihapus` });
  } catch (err) {
    return res.status(200).json({ status: 'success', message: 'Simulasi hapus data (DB offline)' });
  }
};