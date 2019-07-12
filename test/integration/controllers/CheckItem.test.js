const request = require('supertest');
const should = require('should');


describe('Check Item Valid', function () {

  before(() => {
    this._url = '/api/v1/entrance/login';
    return request(sails.hooks.http.app).get('/login')
    .then(getRes => {
      const reTokenCapture = /_csrf:\s*unescape\('([^']+)'\)/;
      const foundToken = reTokenCapture.exec(getRes.text);
      this._csrf = sails.config.security.csrf ? foundToken[1] : '';
      this._cookie = getRes.headers['set-cookie'].join('; ');
    });
  });

  // this is based on the transactions entered in our bootstrap
  it('should check if the item is available and calculate the cost of it', () => {
    return request(sails.hooks.http.app)
    .post('/api/v1/cart/check-cart-item-valid')
    .set('Cookie', this._cookie)
    .set('X-CSRF-Token', this._csrf)
    .send(
      {
        Id: 165,
        Quantity: "1000",
        DateStart: "2020-01-05",
        DateEnd: "2020-01-09",
        DaysOfUse: "2"
      }
    )
    .expect(200)
    .then(res => {
      res.body.should.containEql({
        DiscountedTotalPrice: 150000,
        Available: {
          available: 'Available',
          remaining: 9464,
          totalAvailable: 9464,
        },
      });
   });
  });
});
