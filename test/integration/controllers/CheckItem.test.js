const request = require('supertest');
const should = require('should');


describe('Check Item Valid', function () {

  before(function (done) {
    // if (process.env.NODE_ENV === 'production') {
    //   throw new Error('Test runner is refusing to proceed (for safety\'s sake, since NODE_ENV=production)');
    // }//•
    // this._url = '/api/v1/entrance/login';

    // return request(sails.hooks.http.app).get('/login')
    // .then(getRes => {
    //   const reTokenCapture = /_csrf:\s*unescape\('([^']+)'\)/;
    //   const foundToken = reTokenCapture.exec(getRes.text);
    //   this._csrf = sails.config.security.csrf ? foundToken[1] : '';
    //   this._cookie = getRes.headers['set-cookie'].join('; ');
    // });
    done(null, sails);
  });

  // it('should accept the session ID & CSRF token procured by GET /login', () => {
  //   return supertest(sails.hooks.http.app)
  //   .put(this._url)
  //   .set('Cookie', this._cookie)
  //   .set('X-CSRF-Token', this._csrf)
  //   .send({
  //     emailAddress: 'j@crowe.com',
  //     password: 'abc123',
  //   })
  //   .expect(200);
  // });

  // it('check item valid', function (done) {
  //   request(sails.hooks.http.app)
  //     .set('Cookie', this._cookie)
  //     .set('X-CSRF-Token', this._csrf)
  //     .post('/api/v1/cart/check-cart-item-valid')
  //     .send(
  //       {
  //         Id: 161,
  //         Quantity: "1000",
  //         DateStart: "2020-07-10",
  //         DateEnd: "2020-07-14",
  //         DaysOfUse: "5"
  //       }
  //     )
  //     .expect(200)
  //     .end(function (err, res) {
  //       if (err) return done(err);
  //       const body = res.body;
  //       body[0].should.containDeep(
  //         {
  //           totalPrice: 120000,
  //           totalAvailable: 9700,
  //         }
  //       );
  //       should.exist(res.body);
  //       done();
  //     });
  // });

});
