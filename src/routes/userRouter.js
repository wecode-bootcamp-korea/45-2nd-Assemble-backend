const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

const { validateToken } = require('../middlewares/auth');

router.get('/kakaologin', userController.kakaologin);
router.get('', validateToken, userController.getUserById);

module.exports = {
  router,
};
