const { dataSource } = require('./dataSource');

const levelEnum = Object.freeze({
  ONE: 1,
  TWO: 2,
  THREE: 3,
});

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

const getUserById = async (userId) => {
  try {
    return await dataSource.query(
      `
        SELECT
          u.id,
          u.kakao_id AS kakaoId,
          u.name,
          u.gender,
          l.level
        FROM users u
        LEFT JOIN levels l ON u.level_id = l.id
        WHERE u.id = ?
      `,
      [userId]
    );
  } catch (error) {
    error = new Error('DATABASE_CONNECTION_ERROR');
    error.statusCode = 400;
    throw error;
  }
};

const updateUserInfo = async (userId, name, gender, level) => {
  try {
    await dataSource.query(
      `
      UPDATE users
        SET name = ?, gender = ?, level_id = ?
      WHERE id = ? 
        `,
      [name, gender, levelEnum.level, userId]
    );
  } catch (error) {
    error = new Error('DATABASE_CONNECTION_ERROR');
    error.statusCode = 400;
    throw error;
  }
};

module.exports = { getUserByKakaoId, getUserById, createUser, updateUserInfo };
