const request = require('supertest');

const { createApp } = require('../../app');
const { dataSource } = require('../../src/models/dataSource');
const { SocialAuth } = require('../../src/services/socialAuth');

const { createUsers } = require('../fixtures/users-fixture');
const { createLevels } = require('../fixtures/levels-fixture');
const { truncateTables } = require('../test-client');

jest.mock('../../src/services/socialAuth');

describe('Kakao Social Login', () => {
  let app;

  const user1 = {
    id: 10001,
    kakaoId: 12345,
    name: 'test1',
    gender: 'male',
    levelId: 2,
  };

  const user2 = {
    id: 10000,
    kakaoId: 987654321,
    name: 'test2',
    gender: 'female',
    levelId: 3,
  };

  beforeAll(async () => {
    app = createApp();
    await dataSource.initialize();
    await createLevels();
    await createUsers([user1, user2]);
  });

  afterAll(async () => {
    await truncateTables(['users']);
    await dataSource.destroy();
  });

  test('SUCCESS: kakao login', async () => {
    const mockKakaoToken = jest.fn();
    const mockKakaoUser = jest.fn();

    SocialAuth.prototype.getKakaoToken = mockKakaoToken;
    SocialAuth.prototype.getKakaoUser = mockKakaoUser;

    mockKakaoToken.mockReturnValue({
      data: {
        access_token: 'token',
      },
    });

    mockKakaoUser.mockReturnValue({
      id: 12345,
    });

    const res = await request(app)
      .post('/users/kakaologin')
      .send({ code: 'mockCode' });

    expect(res.status).toEqual(200);
  });
});
