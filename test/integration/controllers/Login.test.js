/**
 * /test/integration/controllers/entrance/login.test.js
 */

'use strict';

const supertest = require('supertest');  // also tried

describe('Entrance controllers', () => {

  describe('/api/v1/entrance/login', () => {

    before(() => {
      this._url = '/api/v1/entrance/login';
      return supertest(sails.hooks.http.app).get('/login')
      .then(getRes => {
        const reTokenCapture = /_csrf:\s*unescape\('([^']+)'\)/;
        const foundToken = reTokenCapture.exec(getRes.text);
        this._csrf = sails.config.security.csrf ? foundToken[1] : '';
        this._cookie = getRes.headers['set-cookie'].join('; ');
      });

    });

    it('should accept the session ID & CSRF token procured by GET /login', () => {
      return supertest(sails.hooks.http.app)
      .put(this._url)
      .set('Cookie', this._cookie)
      .set('X-CSRF-Token', this._csrf)
      .send({
        emailAddress: 'j@crowe.com',
        password: 'abc123',
      })
      .expect(200);
    });

    it('should reject requests without a CSRF token', () => {
      return supertest(sails.hooks.http.app)
      .put(this._url)
      .set('Cookie', this._cookie)
      .expect(403);
    });

    it('should reject requests without a session cookie', () => {
      return supertest(sails.hooks.http.app)
      .put(this._url)
      .set('Cookie', '')
      .set('x-csrf-token', this._csrf)
      .expect(403);
    });

    it('should reject requests with invalid tokens', () => {
      return supertest(sails.hooks.http.app)
      .put(this._url)
      .set('Cookie', 'sails.sid=foo; Path=/; HttpOnly')
      .set('X-CSRF-Token', 'foo')
      .send({
        emailAddress: 'admin@example.com',
        password: 'abc123',
      })
      .expect(403);
    });

    it('should reject requests with invalid credentionals', () => {
      return supertest(sails.hooks.http.app)
      .put(this._url)
      .set('Cookie', this._cookie)
      .set('X-CSRF-Token', this._csrf)
      .send({
        emailAddress: 'user@example.com',
        password: 'password'
      })
      .expect(401);
    });

    it('should reject get requests', () => {
      return supertest(sails.hooks.http.app)
      .get(this._url)
      .set('Cookie', this._cookie)
      .set('X-CSRF-Token', this._csrf)
      .send({
        emailAddress: 'admin@example.com',
        password: 'abc123',
      })
      .expect(404);
    });

    it('should reject post requests', () => {
      return supertest(sails.hooks.http.app)
      .post(this._url)
      .set('Cookie', this._cookie)
      .set('X-CSRF-Token', this._csrf)
      .send({
        emailAddress: 'admin@example.com',
        password: 'abc123',
      })
      .expect(404);
    });

  });

});