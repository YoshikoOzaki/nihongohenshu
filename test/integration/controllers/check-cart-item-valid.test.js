// test/integration/controllers/check-cart-item-valid.test.js
var supertest = require('supertest');
console.log('testing');

describe('check-cart-item-valid', function() {

  describe('check-cart-item-valid', function() {
    it('should return a item response', function (done) {
      supertest(sails.hooks.http.app)
      .post('http://localhost:1337/api/v1/cart/check-cart-item-valid')
      .send({"Id":1,"Quantity":"100","DateStart":"2019-06-11","DateEnd":"2019-06-14","DaysOfUse":"3"})
      .expect(200)
      // .expect('location','/my/page', done);
    });
  });

});