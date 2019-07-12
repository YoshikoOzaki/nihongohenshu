var request = require('supertest'),
  should = require('should');


describe('Shipping Testing', function () {

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

  it('should return correct takuhai shipping price', () => {
    return request(sails.hooks.http.app)
    .post('/api/v1/cart/check-shipping-price')
    .set('Cookie', this._cookie)
    .set('X-CSRF-Token', this._csrf)
    .send(
      {
        "Postcode": 8141234,
        "PostcodeRaw": "814-1234",
        "Cart": {
          "timePeriod": {
            "DateStart": "2020-07-11",
            "DateEnd": "2020-07-14",
            "DaysOfUse": "4"
          },
          "items": [
            {
              "createdAt": 1562730845666,
              "updatedAt": 1562730845666,
              "id": 162,
              "NameE1": "Rental Plumm Glass",
              "NameE2": "White A",
              "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
              "NameJ2": "ﾎﾜｲﾄA",
              "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
              "UnitPrice": 170,
              "RackCapacity": 25,
              "RackHeight": 280,
              "Type": "Glassware",
              "Quantity": "160",
              "WashAndPolish": 32,
              "TotalPrice": 27200,
              "TotalPriceWithWash": 32320,
              "DiscountedBasePrice": 25323.121371801,
              "DiscountedUnitPrice": 158,
              "DiscountedUnitPriceWithWash": 190,
              "DiscountedTotalPrice": 30400,
              "Available": {
                "available": "Available",
                "remaining": 10000,
                "totalAvailable": 10000
              },
              "quantityFactorForFullRack": 0.93099710925738
            },
            {
              "createdAt": 1562731097119,
              "updatedAt": 1562731097119,
              "id": 168,
              "NameE1": "Rental Plumm Glass",
              "NameE2": "White A (Handmade)",
              "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
              "NameJ2": "ﾎﾜｲﾄA (ﾊﾝﾄﾞﾒｲﾄﾞ)",
              "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
              "UnitPrice": 300,
              "RackCapacity": 25,
              "RackHeight": 280,
              "Type": "Glassware",
              "Quantity": "217",
              "WashAndPolish": 32,
              "TotalPrice": 65100,
              "TotalPriceWithWash": 72044,
              "DiscountedBasePrice": 58294.661069393,
              "DiscountedUnitPrice": 269,
              "DiscountedUnitPriceWithWash": 301,
              "DiscountedTotalPrice": 65317,
              "Available": {
                "available": "Available",
                "remaining": 10000,
                "totalAvailable": 10000
              },
              "quantityFactorForFullRack": 0.89546330367731
            },
            {
              "createdAt": 1562731097119,
              "updatedAt": 1562731097119,
              "id": 164,
              "NameE1": "Rental Plumm Glass",
              "NameE2": "Red or White",
              "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
              "NameJ2": "RW",
              "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
              "UnitPrice": 170,
              "RackCapacity": 25,
              "RackHeight": 280,
              "Type": "Glassware",
              "Quantity": "215",
              "WashAndPolish": 32,
              "TotalPrice": 36550,
              "TotalPriceWithWash": 43430,
              "DiscountedBasePrice": 32729.183749406,
              "DiscountedUnitPrice": 152,
              "DiscountedUnitPriceWithWash": 184,
              "DiscountedTotalPrice": 39560,
              "Available": {
                "available": "Available",
                "remaining": 20000,
                "totalAvailable": 20000
              },
              "quantityFactorForFullRack": 0.89546330367731
            },
            {
              "createdAt": 1562731097119,
              "updatedAt": 1562731097119,
              "id": 163,
              "NameE1": "Rental Plumm Glass",
              "NameE2": "White B",
              "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
              "NameJ2": "ﾎﾜｲﾄB",
              "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
              "UnitPrice": 230,
              "RackCapacity": 16,
              "RackHeight": 280,
              "Type": "Glassware",
              "Quantity": "180",
              "WashAndPolish": 32,
              "TotalPrice": 41400,
              "TotalPriceWithWash": 47160,
              "DiscountedBasePrice": 35070.987059983,
              "DiscountedUnitPrice": 195,
              "DiscountedUnitPriceWithWash": 227,
              "DiscountedTotalPrice": 40860,
              "Available": {
                "available": "Available",
                "remaining": 10000,
                "totalAvailable": 10000
              },
              "quantityFactorForFullRack": 0.84712529130394
            }
          ],
          "shipping": {
            "postcode": 8141234,
            "postcodeRaw": "814-1234",
            "price": 38628,
            "shippingFactorRecord": {
              "createdAt": 1562731100034,
              "updatedAt": 1562731100034,
              "id": 75,
              "LowZip": 8120000,
              "HighZip": 8168670,
              "Place": "福岡県春日市",
              "Truck_OK": 0,
              "Truck_Distance_Factor": "",
              "Takuhai_Factor": 4,
              "OFFSET": 75,
              "ZIP_VALUE": 8120000,
              "OFFSET_CALC": 74
            },
            "shippingPossible": true,
            "shippingType": "takuhai",
            "result2": {
              "9": 0,
              "10": 0,
              "16": 4,
              "25": 42,
              "36": 0
            }
          }
        }
      }
    )
    .expect(200)
    .then(res => {
       res.body.should.containEql({
          postcode: 8141234,
          price: 38628,
          shippingPossible: true,
          shippingType: "takuhai",
       });
    });
  });

  it('should return correct truck shipping price', () => {
    return request(sails.hooks.http.app)
    .post('/api/v1/cart/check-shipping-price')
    .set('Cookie', this._cookie)
    .set('X-CSRF-Token', this._csrf)
    .send(
      {
        "Postcode": 1000000,
        "PostcodeRaw": "100-0000",
        "Cart": {
          "timePeriod": {
            "DateStart": "2019-07-11",
            "DateEnd": "2019-07-14",
            "DaysOfUse": "4"
          },
          "items": [
            {
              "createdAt": 1562731097119,
              "updatedAt": 1562731097119,
              "id": 161,
              "NameE1": "Rental Plumm Glass",
              "NameE2": "Flute",
              "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
              "NameJ2": "ﾌﾙｰﾄ",
              "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
              "UnitPrice": 120,
              "RackCapacity": 36,
              "RackHeight": 280,
              "Type": "Glassware",
              "Quantity": "400",
              "WashAndPolish": 32,
              "TotalPrice": 48000,
              "TotalPriceWithWash": 60800,
              "DiscountedBasePrice": 40662.01398258891,
              "DiscountedUnitPrice": 102,
              "DiscountedUnitPriceWithWash": 134,
              "DiscountedTotalPrice": 53600,
              "Available": {
                "available": "Available",
                "remaining": 10000,
                "totalAvailable": 10000
              },
              "quantityFactorForFullRack": 0.8471252913039357
            },
            {
              "createdAt": 1562731097119,
              "updatedAt": 1562731097119,
              "id": 189,
              "NameE1": "Rental Plumm Glass",
              "NameE2": "MultiRed",
              "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
              "NameJ2": "ﾏﾙﾁﾚｯﾄﾞ",
              "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
              "UnitPrice": 170,
              "RackCapacity": 25,
              "RackHeight": 280,
              "Type": "Glassware",
              "Quantity": "600",
              "WashAndPolish": 32,
              "TotalPrice": 102000,
              "TotalPriceWithWash": 121200,
              "DiscountedBasePrice": 71583.32610615867,
              "DiscountedUnitPrice": 119,
              "DiscountedUnitPriceWithWash": 151,
              "DiscountedTotalPrice": 90600,
              "Available": {
                "available": "Available",
                "remaining": 10000,
                "totalAvailable": 10000
              },
              "quantityFactorForFullRack": 0.7017973147662615
            },
            {
              "createdAt": 1562731097119,
              "updatedAt": 1562731097119,
              "id": 164,
              "NameE1": "Rental Plumm Glass",
              "NameE2": "Red or White",
              "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
              "NameJ2": "RW",
              "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
              "UnitPrice": 170,
              "RackCapacity": 25,
              "RackHeight": 280,
              "Type": "Glassware",
              "Quantity": "300",
              "WashAndPolish": 32,
              "TotalPrice": 51000,
              "TotalPriceWithWash": 60600,
              "DiscountedBasePrice": 43203.38985650072,
              "DiscountedUnitPrice": 144,
              "DiscountedUnitPriceWithWash": 176,
              "DiscountedTotalPrice": 52800,
              "Available": {
                "available": "Available",
                "remaining": 20000,
                "totalAvailable": 20000
              },
              "quantityFactorForFullRack": 0.8471252913039357
            },
            {
              "createdAt": 1562733160925,
              "updatedAt": 1562733160925,
              "id": 173,
              "NameE1": "Rental Plumm Glass",
              "NameE2": "Red A (Stemless)",
              "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
              "NameJ2": "ﾚｯﾄﾞA (ｽﾃﾑﾚｽ)",
              "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
              "UnitPrice": 220,
              "RackCapacity": 16,
              "RackHeight": 280,
              "Type": "Glassware",
              "Quantity": "200",
              "WashAndPolish": 32,
              "TotalPrice": 44000,
              "TotalPriceWithWash": 50400,
              "DiscountedBasePrice": 36618.37770901267,
              "DiscountedUnitPrice": 183,
              "DiscountedUnitPriceWithWash": 215,
              "DiscountedTotalPrice": 43000,
              "Available": {
                "available": "Available",
                "remaining": 10000,
                "totalAvailable": 10000
              },
              "quantityFactorForFullRack": 0.8322358570230151
            }
          ],
          "shipping": {
            "postcode": 1000000,
            "postcodeRaw": "100-0000",
            "price": 10000,
            "shippingPossible": true,
            "shippingType": "truck",
            "totalCalculatedDeliveryCharge": 14200,
            "shippingFactorRecord": {
              "createdAt": 1562733164086,
              "updatedAt": 1562733164086,
              "id": 8,
              "LowZip": 1000000,
              "HighZip": 1000010,
              "Place": "東京都千代田区",
              "Truck_OK": 1,
              "Truck_Distance_Factor": "200",
              "Takuhai_Factor": 1,
              "OFFSET": 8,
              "ZIP_VALUE": 1000000,
              "OFFSET_CALC": 7
            }
          }
        }
      }
    )
    .expect(200)
    .then(res => {
       res.body.should.containEql({
          postcode: 1000000,
          price: 10000,
          shippingPossible: true,
          totalCalculatedDeliveryCharge: 14200,
          shippingType: 'truck',
       });
    });
  });

});
