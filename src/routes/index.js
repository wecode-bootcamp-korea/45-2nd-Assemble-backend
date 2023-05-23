const express = require('express');

const userRouter = require('./userRouter');
const courtRouter = require('./courtRouter');

const router = express.Router();

router.use('/users', userRouter.router);
router.use('/courts', courtRouter.router);

module.exports = router;
