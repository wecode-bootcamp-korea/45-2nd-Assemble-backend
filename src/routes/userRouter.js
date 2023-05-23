const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/kakaologin', userController.kakaologin);

module.exports = {
  router,
};
