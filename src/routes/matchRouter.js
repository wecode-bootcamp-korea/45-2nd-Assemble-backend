const express = require('express');
const matchController = require('../controllers/matchController');

const router = express.Router();

const { validateTokenUserUndefined } = require('../middlewares/auth');

router.get('', validateTokenUserUndefined, matchController.getMatchList);

module.exports = {
  router,
};
