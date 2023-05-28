const express = require('express');
const matchController = require('../controllers/matchController');

const router = express.Router();

const { validateToken } = require('../middlewares/auth');
const { validateTokenUserUndefined } = require('../middlewares/auth');

router.get('', validateTokenUserUndefined, matchController.getMatchList);
router.get('/guest', validateToken, matchController.getGuestMatches);
router.post('', validateToken, matchController.completeMatch);

module.exports = {
  router,
};
