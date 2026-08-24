const { Sequelize, DataTypes } = require('sequelize');

// Inisialisasi koneksi langsung dari environment Vercel/Supabase
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  }
});

// Definisikan model WeatherLog secara langsung di sini agar aman
const WeatherLog = sequelize.define('WeatherLog', {
  city: { type: DataTypes.STRING, allowNull: false },
  country: { type: DataTypes.STRING, allowNull: false },
  temperature: { type: DataTypes.DECIMAL(4, 1), allowNull: false },
  humidity: { type: DataTypes.INTEGER, allowNull: false },
  windSpeed: { type: DataTypes.DECIMAL(4, 1), allowNull: false },
  weatherCondition: { type: DataTypes.STRING, allowNull: false },
  airQualityIndex: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'weather_logs',
  timestamps: true
});

// 1. AMBIL DATA CUACA (GET)
exports.getWeatherData = async (req, res) => {
  try {
    const { city, condition } = req.query;
    let filter = {};

    if (city) filter.city = city;
    if (condition) filter.weatherCondition = condition;

    const data = await WeatherLog.findAll({
      where: filter,
      limit: 50,
      order: [['id', 'DESC']]
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

// 2. TAMBAH DATA CUACA (POST)
exports.createWeather = async (req, res) => {
  try {
    const { city, country, temperature, humidity, windSpeed, weatherCondition, airQualityIndex } = req.body;
    
    const newWeather = await WeatherLog.create({
      city: city || 'Yogyakarta',
      country: country || 'ID',
      temperature: temperature || 28.0,
      humidity: humidity || 70,
      windSpeed: windSpeed || 3.0,
      weatherCondition: weatherCondition || 'Clear',
      airQualityIndex: airQualityIndex || 30
    });

    return res.status(201).json({ 
      status: 'success', 
      message: 'Data cuaca berhasil ditambahkan ke database', 
      data: newWeather 
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menyimpan data ke database',
      error: error.message
    });
  }
};

// 3. UPDATE DATA CUACA (PUT)
exports.updateWeather = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await WeatherLog.findByPk(id);

    if (!record) {
      return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' });
    }

    await record.update(req.body);

    return res.json({ 
      status: 'success', 
      message: `Data cuaca dengan ID ${id} berhasil diperbarui`,
      data: record 
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui data',
      error: error.message
    });
  }
};

// 4. HAPUS DATA CUACA (DELETE)
exports.deleteWeather = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await WeatherLog.findByPk(id);

    if (!record) {
      return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' });
    }

    await record.destroy();

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