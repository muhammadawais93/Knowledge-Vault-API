import supertest from 'supertest';

describe('Register API Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    test('should register a new user', async () => {
      const newUser = {
        firstName: 'test',
        lastName: 'bob',
        email: 'hellobob@gmail.com',
        password: 'test1256',
      };
      const response = await supertest(global.__APP__).post('/api/auth/register').send(newUser).expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', newUser.email);
      expect(response.body.user).toHaveProperty('firstName', newUser.firstName);
      expect(response.body.user).toHaveProperty('lastName', newUser.lastName);
      expect(response.body.message).toBe('User created successfully');

      // Verify that the user is actually created in the database
      const createdUser = await supertest(global.__APP__)
        .post('/api/auth/login')
        .send({ email: newUser.email, password: newUser.password })
        .expect(200);

      expect(createdUser.body).toHaveProperty('user');
      expect(createdUser.body).toHaveProperty('token');
      expect(typeof createdUser.body.token).toBe('string');
      expect(createdUser.body.user).toHaveProperty('id', response.body.user.id);
      expect(createdUser.body.message).toBe('Login successful');
    });
  });
});
