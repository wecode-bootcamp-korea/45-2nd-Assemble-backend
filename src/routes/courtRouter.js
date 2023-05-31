const express = require('express');
const multer = require('multer');
const upload = multer();
const courtController = require('../controllers/courtController');

const router = express.Router();

const { validateToken } = require('../middlewares/auth');

router.get('', courtController.getCourtList);
router.get('/hosting', validateToken, courtController.getHostingCourts);
router.post(
  '',
  validateToken,
  upload.single('courtImage'),
  courtController.createCourt
);

module.exports = { router };
