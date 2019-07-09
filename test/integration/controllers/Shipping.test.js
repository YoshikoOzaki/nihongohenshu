var request = require('supertest'),
  should = require('should');


describe('Shipping Testing', function () {

  before(function (done) {
    done(null, sails);
  });

  it('check shipping price', function (done) {
    request(sails.hooks.http.app)
      .post('/api/v1/cart/check-shipping-price')
      .send(
        {
          "Postcode":"1000000",
          "Cart":{
              "timePeriod":{
                "DateStart":"2019-07-04",
                "DateEnd":"2019-07-11",
                "DaysOfUse":"3"
              },
              "items":[
                {
                    "id":"161",
                    "NameE":"Rental Plumm Glass Flute",
                    "Quantity":"400",
                    "UnitPrice":100,
                    "ImgSrc":"https://www.plumm.com/globalassets/productassets/pluh3320a/plumm-large/pluh3320a_3_plumm-large.jpg",
                    "WashAndPolish":32,
                    "TotalPrice":40000,
                    "TotalPriceWithWash":52800,
                    "DiscountedBasePrice":36000,
                    "DiscountedUnitPrice":90,
                    "DiscountedUnitPriceWithWash":122,
                    "DiscountedTotalPrice":48800,
                    "Available":{
                      "available":"Available",
                      "remaining":10000,
                      "totalAvailable":10000
                    }
                },
                {
                    "id":"189",
                    "NameE":"Rental Plumm Glass MultiRed",
                    "Quantity":"600",
                    "UnitPrice":120,
                    "ImgSrc":"https://www.plumm.com/globalassets/productassets/pluh3320b/plumm-large/pluh3320b_6_plumm-large.jpg",
                    "WashAndPolish":32,
                    "TotalPrice":72000,
                    "TotalPriceWithWash":91200,
                    "DiscountedBasePrice":64800,
                    "DiscountedUnitPrice":108,
                    "DiscountedUnitPriceWithWash":140,
                    "DiscountedTotalPrice":84000,
                    "Available":{
                      "available":"Available",
                      "remaining":10000,
                      "totalAvailable":10000
                    }
                },
                {
                    "id":"173",
                    "NameE":"Rental Plumm Glass Red A (Stemless)",
                    "Quantity":"200",
                    "UnitPrice":120,
                    "ImgSrc":"https://www.plumm.com/globalassets/productassets/pluo6660rw/plumm-large/pluo6660rw_3_plumm-large.jpg",
                    "WashAndPolish":32,
                    "TotalPrice":24000,
                    "TotalPriceWithWash":30400,
                    "DiscountedBasePrice":21600,
                    "DiscountedUnitPrice":108,
                    "DiscountedUnitPriceWithWash":140,
                    "DiscountedTotalPrice":28000,
                    "Available":{
                      "available":"Available",
                      "remaining":10000,
                      "totalAvailable":10000
                    }
                },
                {
                    "id":"164",
                    "NameE":"Rental Plumm Glass Red or White",
                    "Quantity":"150",
                    "UnitPrice":120,
                    "ImgSrc":"https://www.plumm.com/globalassets/productassets/pluv4420b2/plumm-large/pluv4420b2_6_plumm-large.jpg",
                    "WashAndPolish":32,
                    "TotalPrice":18000,
                    "TotalPriceWithWash":22800,
                    "DiscountedBasePrice":16200,
                    "DiscountedUnitPrice":108,
                    "DiscountedUnitPriceWithWash":140,
                    "DiscountedTotalPrice":21000,
                    "Available":{
                      "available":"Available",
                      "remaining":10000,
                      "totalAvailable":10000
                    }
                },
                {
                    "id":"164",
                    "NameE":"Rental Plumm Glass Red or White",
                    "Quantity":"150",
                    "UnitPrice":120,
                    "ImgSrc":"https://www.plumm.com/globalassets/productassets/pluv4420b2/plumm-large/pluv4420b2_6_plumm-large.jpg",
                    "WashAndPolish":32,
                    "TotalPrice":18000,
                    "TotalPriceWithWash":22800,
                    "DiscountedBasePrice":16200,
                    "DiscountedUnitPrice":108,
                    "DiscountedUnitPriceWithWash":140,
                    "DiscountedTotalPrice":21000,
                    "Available":{
                      "available":"Available",
                      "remaining":10000,
                      "totalAvailable":10000
                    }
                }
              ],
              "shipping":{
                "postcode":1000000,
                "price":10000,
                "shippingPossible":true,
                "shippingType":"truck"
              }
          }
        }
      )
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        const body = res.body;
        body[0].should.containDeep(
          {
            postcode: 1000000,
            price: 10000,
            shippingPossible: true,
            shippingType: "truck",
            totalCalculatedDeliveryCharge: 16400,
          }
        );
        should.exist(res.body);
        done();
      });
  });

});
