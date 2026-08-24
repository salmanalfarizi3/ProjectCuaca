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


router.get('/v1/weather', apiKeyMiddleware, weatherController.getWeatherData);


router.post('/v1/weather', authJwt, weatherController.createWeather);
router.put('/v1/weather/:id', authJwt, weatherController.updateWeather);
router.delete('/v1/weather/:id', authJwt, weatherController.deleteWeather);

module.exports = router;