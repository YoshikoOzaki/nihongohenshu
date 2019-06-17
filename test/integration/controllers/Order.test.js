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

    agent = request.agent(sails.hooks.http.app);

    it('should create a session', function (done) {
      agent
        .post('/login')
        .send({ email: "jarodccrowe@gmail.com", password:'abc123' })
        .expect(200)
        .end(function(err,res){
          // res.headers['set-cookie'].should.exist;

          // cookie = res.headers['set-cookie'];
          // console.log(cookie);
          done();
        })
      });

    it('should create an order', function (done) {
      agent
        .post('/api/v1/order/create-member-reserve-order')
        .send(
          {
            "DateStart":"2019-06-11",
            "DateEnd":"2019-06-14",
            "DaysOfUse":"3",
            "Items":[
              {
                "Id":"1",
                "NameEng":"Handmade Vintage WHITE",
                "Quantity":"1000",
                "UnitPrice":100,
                "ImgSrc":"https://www.plumm.com/globalassets/productassets/pluh3320a/plumm-large/pluh3320a_3_plumm-large.jpg",
                "WashAndPolish":32,
                "TotalPrice":100000,
                "TotalPriceWithWash":132000,
                "DiscountedBasePrice":90000,
                "DiscountedUnitPrice":90,
                "DiscountedUnitPriceWithWash":122,
                "DiscountedTotalPrice":122000,
                "Available":{
                    "available":"Available",
                    "remaining":1000,
                    "totalAvailable":1000
                }
              },
              {
                "Id":"2",
                "NameEng":"Handmade Glass WHITE",
                "Quantity":"100",
                "UnitPrice":120,
                "ImgSrc":"https://www.plumm.com/globalassets/productassets/pluh3320b/plumm-large/pluh3320b_6_plumm-large.jpg",
                "WashAndPolish":32,
                "TotalPrice":12000,
                "TotalPriceWithWash":15200,
                "DiscountedBasePrice":10800,
                "DiscountedUnitPrice":108,
                "DiscountedUnitPriceWithWash":140,
                "DiscountedTotalPrice":14000,
                "Available":{
                    "available":"Available",
                    "remaining":1000,
                    "totalAvailable":1000
                }
              },
              {
                "Id":"1",
                "NameEng":"Handmade Vintage WHITE",
                "Quantity":"100",
                "UnitPrice":100,
                "ImgSrc":"https://www.plumm.com/globalassets/productassets/pluh3320a/plumm-large/pluh3320a_3_plumm-large.jpg",
                "WashAndPolish":32,
                "TotalPrice":10000,
                "TotalPriceWithWash":13200,
                "DiscountedBasePrice":9000,
                "DiscountedUnitPrice":90,
                "DiscountedUnitPriceWithWash":122,
                "DiscountedTotalPrice":12200,
                "Available":{
                    "available":"Available",
                    "remaining":1000,
                    "totalAvailable":1000
                }
              }
            ],
            "Reserved":true,
            "DeliveryCost":128760,
            "Postcode":60000,
            "User":1
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