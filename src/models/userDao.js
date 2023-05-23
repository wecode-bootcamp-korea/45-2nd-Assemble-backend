const { dataSource } = require('./dataSource');

const getUserByKakaoId = async (kakaoId) => {
  try {
    return await dataSource.query(
      `
        SELECT
            id, 
            kakao_id kakaoId,
            name,
            gender,
            level_id levelId
        FROM users
        WHERE kakao_id = ?
    `,
      [kakaoId]
    );
  } catch (error) {
    error = new Error('DATABASE_CONNECTION_ERROR');
    error.statusCode = 400;
    throw error;
  }
};

const createUser = async (kakaoId, userName) => {
  try {
    return await dataSource.query(
      `
        INSERT INTO users (
            kakao_id,
            name
            ) VALUES (
                ?, ?
            )
    `,
      [kakaoId, userName]
    );
  } catch (error) {
    error = new Error('DATABASE_CONNECTION_ERROR');
    error.statusCode = 400;
    throw error;
  }
};

module.exports = { getUserByKakaoId, createUser };
