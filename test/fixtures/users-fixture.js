const { dataSource } = require('../../src/models/dataSource');

const createUsers = (userList) => {
  let data = [];

  for (const user of userList) {
    data.push([user.id, user.kakaoId, user.name, user.gender, user.levelId]);
  }

  return dataSource.query(
    `
    INSERT INTO users (
      id,
      kakao_id,
      name,
      gender,
      level_id
    ) VALUES ?
  `,
    [data]
  );
};

module.exports = { createUsers };
