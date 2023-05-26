const express = require('express');

const userRouter = require('./userRouter');
const courtRouter = require('./courtRouter');
const matchRouter = require('./matchRouter');

const router = express.Router();

router.use('/users', userRouter.router);
router.use('/courts', courtRouter.router);
router.use('/matches', matchRouter.router);

module.exports = router;
