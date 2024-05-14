const request = require('supertest');
const app = require('../index.js'); 

describe('Authentication', () => {
    it('should login with correct credentials', async () => {
        const res = await request(app)
            .post('/login')
            .send({ username: 'ons', password: 'onspassword' });
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Login successful!');
    });

    it('should not login with incorrect credentials', async () => {
        const res = await request(app)
            .post('/login')
            .send({ username: 'ons', password: 'password' });
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual('Invalid username or password');
    });

    it('should logout successfully', async () => {
        const res = await request(app).get('/logout');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Logged out successfully');
    });
});
