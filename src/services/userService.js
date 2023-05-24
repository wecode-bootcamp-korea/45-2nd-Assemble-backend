const userDao = require('../models/userDao');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const kakaoOauthTokenApiUrl = process.env.KAKAO_OAUTH_TOKEN_API_URL;
const grantType = process.env.KAKAO_GRANT_TYPE;
const clientId = process.env.KAKAO_CLIENT_ID;
const redirectUrl = process.env.KAKAO_REDIRECT_URL;

const kakaologin = async (code) => {
  const kakaoResult = await axios.post(
    `${kakaoOauthTokenApiUrl}?grant_type=${grantType}&client_id=${clientId}&redirect_uri=${redirectUrl}&code=${code}`,
    {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    }
  );

  if (!kakaoResult.data.access_token || kakaoResult.status !== 200) {
    const error = new Error('CANNOT_GET_KAKAO_TOKEN');
    error.statusCode = 400;
    throw error;
  }

  const kakaoToken = kakaoResult.data['access_token'];

  const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${kakaoToken}`,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });

  if (response.status != 200) {
    const error = new Error('CANNOT_VERIFY_KAKAO_TOKEN');
    error.statusCode = 400;
    throw error;
  }

  const userName = response.data.properties.nickName;
  const kakaoId = response.data.id;

  let user = await userDao.getUserByKakaoId(kakaoId);

  if (!user) {
    user = await userDao.createUser(kakaoId, userName);
  }

  const payLoad = { id: user.id };

  const accessToken = jwt.sign(payLoad, process.env.JWT_SECERT);

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
