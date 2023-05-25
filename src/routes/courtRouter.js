const express = require('express');
const courtController = require('../controllers/courtController');

const router = express.Router();

const { validateToken } = require('../middlewares/auth');

router.get('', courtController.getCourtList);
router.get('/hosting', validateToken, courtController.getHostingCourts);

module.exports = { router };
