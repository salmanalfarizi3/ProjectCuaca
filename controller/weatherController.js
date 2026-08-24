const { sequelize } = require('../models');

// 1. AMBIL DATA CUACA (GET) - Terhubung langsung ke Supabase
exports.getWeatherData = async (req, res) => {
  try {
    const { city, condition } = req.query;
    
    let query = 'SELECT * FROM weather_logs WHERE 1=1';
    let replacements = {};

    if (city) {
      query += ' AND city ILIKE :city';
      replacements.city = `%${city}%`;
    }

    if (condition) {
      query += ' AND "weatherCondition" ILIKE :condition';
      replacements.condition = `%${condition}%`;
    }

    query += ' ORDER BY id DESC LIMIT 50';

    const data = await sequelize.query(query, {
      replacements: replacements,
      type: sequelize.QueryTypes.SELECT
    });

    return res.status(200).json({
      status: 'success',
      total_records: data.length,
      data: data
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data dari database',
      error: error.message
    });
  }
};

// 2. TAMBAH DATA CUACA (POST) - Masuk langsung ke Supabase
exports.createWeather = async (req, res) => {
  try {
    const { city, country, temperature, humidity, windSpeed, weatherCondition, airQualityIndex } = req.body;
    
    const query = `
      INSERT INTO weather_logs (city, country, temperature, humidity, "windSpeed", "weatherCondition", "airQualityIndex", "createdAt", "updatedAt")
      VALUES (:city, :country, :temperature, :humidity, :windSpeed, :weatherCondition, :airQualityIndex, NOW(), NOW())
      RETURNING *;
    `;

    const result = await sequelize.query(query, {
      replacements: { 
        city: city || 'Yogyakarta', 
        country: country || 'ID', 
        temperature: temperature || 28.0, 
        humidity: humidity || 70, 
        windSpeed: windSpeed || 3.0, 
        weatherCondition: weatherCondition || 'Clear', 
        airQualityIndex: airQualityIndex || 30 
      },
      type: sequelize.QueryTypes.INSERT
    });

    return res.status(201).json({ 
      status: 'success', 
      message: 'Data cuaca berhasil ditambahkan ke database', 
      data: result[0] 
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menyimpan data ke database',
      error: error.message
    });
  }
};

// 3. UPDATE DATA CUACA (PUT) - Memperbarui data di Supabase
exports.updateWeather = async (req, res) => {
  try {
    const { id } = req.params;
    const { city, country, temperature, humidity, windSpeed, weatherCondition, airQualityIndex } = req.body;

    const query = `
      UPDATE weather_logs 
      SET city = COALESCE(:city, city),
          country = COALESCE(:country, country),
          temperature = COALESCE(:temperature, temperature),
          humidity = COALESCE(:humidity, humidity),
          "windSpeed" = COALESCE(:windSpeed, "windSpeed"),
          "weatherCondition" = COALESCE(:weatherCondition, "weatherCondition"),
          "airQualityIndex" = COALESCE(:airQualityIndex, "airQualityIndex"),
          "updatedAt" = NOW()
      WHERE id = :id
      RETURNING *;
    `;

    const result = await sequelize.query(query, {
      replacements: { id, city, country, temperature, humidity, windSpeed, weatherCondition, airQualityIndex },
      type: sequelize.QueryTypes.UPDATE
    });

    return res.json({ 
      status: 'success', 
      message: `Data cuaca dengan ID ${id} berhasil diperbarui`,
      data: result[0] 
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui data',
      error: error.message
    });
  }
};

// 4. HAPUS DATA CUACA (DELETE) - Menghapus data dari Supabase
exports.deleteWeather = async (req, res) => {
  try {
    const { id } = req.params;
    
    await sequelize.query('DELETE FROM weather_logs WHERE id = :id', {
      replacements: { id },
      type: sequelize.QueryTypes.DELETE
    });

    return res.json({ 
      status: 'success', 
      message: `Data cuaca dengan ID ${id} berhasil dihapus dari database` 
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menghapus data',
      error: error.message
    });
  }
};