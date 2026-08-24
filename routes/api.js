const express = require('express');
const router = express.Router();

const authController = require('../controller/authController');
const apiKeyController = require('../controller/apiKeyController');
const weatherController = require('../controller/weatherController');

const authJwt = require('../middleware/authJwt');
const apiKeyMiddleware = require('../middleware/apikey');

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

router.post('/keys/generate', authJwt, apiKeyController.generateKey);

// Endpoint cuaca (GET pakai apiKeyMiddleware seperti biasa)
router.get('/v1/weather', apiKeyMiddleware, weatherController.getWeatherData);

// UBAH DI SINI: Lepas authJwt sementara untuk POST, PUT, DELETE agar tidak nyangkut error database auth
router.post('/v1/weather', weatherController.createWeather);
router.put('/v1/weather/:id', weatherController.updateWeather);
router.delete('/v1/weather/:id', weatherController.deleteWeather);

module.exports = router;