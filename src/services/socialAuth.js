const axios = require('axios');

class SocialAuth {
  constructor(clientId, redirectUrl) {
    this.clientId = clientId;
    this.redirectUrl = redirectUrl;
  }

  async getKakaoToken(code) {
    const kakaoResult = await axios.post(
      `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${this.clientId}&redirect_uri=${this.redirectUrl}&code=${code}`,
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

    return kakaoResult.data['access_token'];
  }

  async getKakaoUser(kakaoToken) {
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

    return response.data;
  }
}

module.exports = { SocialAuth };
