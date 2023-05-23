const express = require('express');
const courtController = require('../controllers/courtController');

const router = express.Router();

router.get('', courtController.getCourtList);

module.exports = { router };
