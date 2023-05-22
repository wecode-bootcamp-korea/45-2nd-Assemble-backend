const express = require('express');

const courtRouter = require('./courtRouter');

const router = express.Router();

router.use('/courts', courtRouter.router);

module.exports = router;
