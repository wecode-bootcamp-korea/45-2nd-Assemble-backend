const userDao = require('../models/userDao');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { SocialAuth } = require('./socialAuth');

const clientId = process.env.KAKAO_CLIENT_ID;
const redirectUrl = process.env.KAKAO_REDIRECT_URL;

const kakaologin = async (code) => {
  const auth = new SocialAuth(clientId, redirectUrl);

  const kakaoToken = await auth.getKakaoToken(code);

  const kakaoUser = await auth.getKakaoUser(kakaoToken);

  const kakaoId = kakaoUser.id;

  let user = await userDao.getUserByKakaoId(kakaoId);

  if (!user) {
    user = await userDao.createUser(kakaoId);
  }

  const payLoad = { id: user.id };

  const accessToken = jwt.sign(payLoad, process.env.JWT_SECRET);

  return accessToken;
};

const getUserById = async (userId) => {
  return userDao.getUserById(userId);
};

const updateUserInfo = async (userId, name, gender, level) => {
  return userDao.updateUserInfo(userId, name, gender, level);
};

module.exports = {
  kakaologin,
  getUserById,
  updateUserInfo,
};
