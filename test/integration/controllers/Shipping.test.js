var request = require('supertest'),
  should = require('should');


describe('Order Controller', function () {

  let cookie = '';

  before(function (done) {
    done(null, sails);
  });

  // it('should login', function (done) {
  //   request(sails.hooks.http.app)
  //   .post('/login')
  //   .send({ email: "user@gluck.com", password:'password' })
  //   .end(function(err,res){
  //     res.should.have.status(200);
  //     const cookie = res.headers['set-cookie'];
  //     done();
  //   });
  // },

  // agent = request.agent(sails.hooks.http.app);

  // it('should create a session', function (done) {
  //   agent
  //     .post('/login')
  //     .send({email: "jarodccrowe@gmail.com", password: 'abc123'})
  //     .expect(200)
  //     .end(function (err, res) {
  //       // res.headers['set-cookie'].should.exist;

  //       // cookie = res.headers['set-cookie'];
  //       // console.log(cookie);
  //       done();
  //     })
  // });

  it('should create an order', function (done) {
    agent
      .post('/api/v1/order/create-member-reserve-order')
      .send(
        {
          "Postcode": "200000",
          "Cart": {
            "timePeriod": {
              "DateStart": "2019-08-01",
              "DateEnd": "2019-08-08",
              "DaysOfUse": "4"
            },
            "items": [
              {
                "Id": "1",
                "Quantity": "400",
                "UnitPrice": 100,
                "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3320a/plumm-large/pluh3320a_3_plumm-large.jpg",
                "WashAndPolish": 32,
                "TotalPrice": 40000,
                "TotalPriceWithWash": 52800,
                "DiscountedBasePrice": 36000,
                "DiscountedUnitPrice": 90,
                "DiscountedUnitPriceWithWash": 122,
                "DiscountedTotalPrice": 48800,
                "Available": {
                  "available": "Available",
                  "remaining": 10000,
                  "totalAvailable": 10000
                }
              },
              {
                "Id": "2",
                "Quantity": "600",
                "UnitPrice": 120,
                "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3320b/plumm-large/pluh3320b_6_plumm-large.jpg",
                "WashAndPolish": 32,
                "TotalPrice": 72000,
                "TotalPriceWithWash": 91200,
                "DiscountedBasePrice": 64800,
                "DiscountedUnitPrice": 108,
                "DiscountedUnitPriceWithWash": 140,
                "DiscountedTotalPrice": 84000,
                "Available": {
                  "available": "Available",
                  "remaining": 10000,
                  "totalAvailable": 10000
                }
              },
              {
                "Id": "3",
                "NameE": "Rental Plumm Glass Red A (Stemless)",
                "Quantity": "200",
                "UnitPrice": 120,
                "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluo6660rw/plumm-large/pluo6660rw_3_plumm-large.jpg",
                "WashAndPolish": 32,
                "TotalPrice": 24000,
                "TotalPriceWithWash": 30400,
                "DiscountedBasePrice": 21600,
                "DiscountedUnitPrice": 108,
                "DiscountedUnitPriceWithWash": 140,
                "DiscountedTotalPrice": 28000,
                "Available": {
                  "available": "Available",
                  "remaining": 10000,
                  "totalAvailable": 10000
                }
              },
              {
                "Id": "4",
                "NameE": "Rental Plumm Glass Red or White",
                "Quantity": "150",
                "UnitPrice": 120,
                "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluv4420b2/plumm-large/pluv4420b2_6_plumm-large.jpg",
                "WashAndPolish": 32,
                "TotalPrice": 18000,
                "TotalPriceWithWash": 22800,
                "DiscountedBasePrice": 16200,
                "DiscountedUnitPrice": 108,
                "DiscountedUnitPriceWithWash": 140,
                "DiscountedTotalPrice": 21000,
                "Available": {
                  "available": "Available",
                  "remaining": 10000,
                  "totalAvailable": 10000
                }
              },
              {
                "Id": "4",
                "NameE": "Rental Plumm Glass Red or White",
                "Quantity": "150",
                "UnitPrice": 120,
                "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluv4420b2/plumm-large/pluv4420b2_6_plumm-large.jpg",
                "WashAndPolish": 32,
                "TotalPrice": 18000,
                "TotalPriceWithWash": 22800,
                "DiscountedBasePrice": 16200,
                "DiscountedUnitPrice": 108,
                "DiscountedUnitPriceWithWash": 140,
                "DiscountedTotalPrice": 21000,
                "Available": {
                  "available": "Available",
                  "remaining": 10000,
                  "totalAvailable": 10000
                }
              }
            ],
            "shipping": {
              "postcode": 100000,
              "price": 55056,
              "shippingPossible": {
                "createdAt": 1561969665260,
                "updatedAt": 1561969665260,
                "id": 2,
                "LowZip": 100000,
                "HighZip": 185422,
                "Place": "秋田県鹿角市",
                "Truck_OK": 0,
                "Truck_Distance_Factor": 0,
                "Takuhai_Factor": 1,
                "OFFSET": 2,
                "ZIP_VALUE": 100000,
                "OFFSET_CALC": 1
              },
              "result2": {
                "9": 0,
                "10": 0,
                "16": 8,
                "25": 0,
                "36": 4
              }
            }
          }
        }
      )
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        const body = res.body;
        body.length.should.equal(5);
        body[0].should.containDeep(
          {
            id: 1,
            NameEng: 'Handmade Vintage',
          }
        );
        should.exist(res.body);
        console.log(cookie);
        done();
      });
  });

  it('should get order data', function (done) {
    request(sails.hooks.http.app)
      .get('/api/v1/order/get-order?id=1')
      .send({id: 123, someOtherParam: "something"})
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        const body = res.body;
        body[0].should.containDeep(
          {
            id: 1,
          }
        );
        should.exist(res.body);

        done();
      });
  });
});