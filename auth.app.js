const request = require('supertest');
const express = require('express');
const session = require('express-session');

const app = require('./app'); // Passe den Pfad entsprechend deiner Projektstruktur an

describe('Authentifizierungstests', () => {
    let testApp;

    beforeAll(() => {
        testApp = express();
        testApp.use(session({
            secret: 'geheimnis',
            resave: false,
            saveUninitialized: false
        }));
        testApp.use('/', app);
    });

    it('sollte eine Benutzersitzung erstellen und erfolgreich einloggen', async () => {
        const response = await request(testApp)
            .post('/login')
            .send({ username: 'user1', password: 'password1' });
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Login erfolgreich');
    });

    it('sollte den Benutzer ausloggen', async () => {
        const response = await request(testApp)
            .post('/logout');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Logout erfolgreich');
    });

    it('sollte auf eine geschützte Ressource zugreifen können, wenn der Benutzer angemeldet ist', async () => {
        const loginResponse = await request(testApp)
            .post('/login')
            .send({ username: 'user1', password: 'password1' });
        const cookie = loginResponse.header['set-cookie'];

        const response = await request(testApp)
            .get('/protected')
            .set('Cookie', cookie);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Geschützte Ressource');
    });

    it('sollte den Zugriff auf eine geschützte Ressource verweigern, wenn der Benutzer nicht angemeldet ist', async () => {
        const response = await request(testApp)
            .get('/protected');
        expect(response.statusCode).toBe(401);
        expect(response.text).toBe('Unberechtigter Zugriff');
    });
});
