const userService = require('../services/userService');
const { catchAsync } = require('../middlewares/error');

const kakaologin = catchAsync(async (req, res) => {
  const { code } = req.query;

  if (!code) {
    const error = new Error('NO_CODE_PROVIDED');
    error.statusCode = 400;
    throw error;
  }

  const accessToken = await userService.kakaologin(code);

  return res.status(200).json({ accessToken: accessToken });
});

module.exports = { kakaologin };
