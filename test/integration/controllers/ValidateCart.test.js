const request = require('supertest');
const should = require('should');


describe('Check cart Valid', function () {

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
    .post('/api/v1/cart/validate-cart')
    .set('Cookie', this._cookie)
    .set('X-CSRF-Token', this._csrf)
    .send(
      {
        "timePeriod": {
          "DateStart": "2019-07-25",
          "DateEnd": "2019-07-31",
          "DaysOfUse": 3
        },
        "items": [
          {
            "createdAt": 1563508625557,
            "updatedAt": 1563508625557,
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
            "Quantity": "110",
            "WashAndPolish": 32,
            "TotalPriceRaw": 15180,
            "TotalPriceWithDiscountsAndWash": 32952,
            "TotalWashingCost": 3520,
            "DiscountedUnitCostWithDaysFactorForDisplay": 268,
            "QuantityDiscountFactor": 0.969430473372781,
            "Available": {
              "available": "Available",
              "remaining": 9550,
              "totalAvailable": 9550
            },
            "Extras": {
              "discountedUnitPrice": 133.78140532544379,
              "discountedUnitPriceWithDaysOfUseIncreaseFactor": 267.56281065088757,
              "totalDiscountedUnitCostWithEverything": 29431.909171597632,
              "totalWashingCost": 3520,
              "daysOfUseIncreaseFactor": 2
            }
          },
          {
            "createdAt": 1563508625557,
            "updatedAt": 1563508625557,
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
            "Quantity": "60",
            "WashAndPolish": 32,
            "TotalPriceRaw": 11880,
            "TotalPriceWithDiscountsAndWash": 25438,
            "TotalWashingCost": 1920,
            "DiscountedUnitCostWithDaysFactorForDisplay": 392,
            "QuantityDiscountFactor": 0.9898076923076924,
            "Available": {
              "available": "Available",
              "remaining": 10000,
              "totalAvailable": 10000
            },
            "Extras": {
              "discountedUnitPrice": 195.9819230769231,
              "discountedUnitPriceWithDaysOfUseIncreaseFactor": 391.9638461538462,
              "totalDiscountedUnitCostWithEverything": 23517.83076923077,
              "totalWashingCost": 1920,
              "daysOfUseIncreaseFactor": 2
            }
          },
          {
            "createdAt": 1563508625557,
            "updatedAt": 1563508625557,
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
            "Quantity": "45",
            "WashAndPolish": 32,
            "TotalPriceRaw": 6210,
            "TotalPriceWithDiscountsAndWash": 13860,
            "TotalWashingCost": 1440,
            "DiscountedUnitCostWithDaysFactorForDisplay": 276,
            "QuantityDiscountFactor": 1,
            "Available": {
              "available": "Available",
              "remaining": 20000,
              "totalAvailable": 20000
            },
            "Extras": {
              "discountedUnitPrice": 138,
              "discountedUnitPriceWithDaysOfUseIncreaseFactor": 276,
              "totalDiscountedUnitCostWithEverything": 12420,
              "totalWashingCost": 1440,
              "daysOfUseIncreaseFactor": 2
            }
          },
          {
            "createdAt": 1563508625557,
            "updatedAt": 1563508625557,
            "id": 165,
            "NameE1": "Rental Plumm Glass",
            "NameE2": "Red A",
            "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
            "NameJ2": "ﾚｯﾄﾞA",
            "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
            "UnitPrice": 230,
            "RackCapacity": 16,
            "RackHeight": 280,
            "Type": "Glassware",
            "Quantity": "60",
            "WashAndPolish": 32,
            "TotalPriceRaw": 11880,
            "TotalPriceWithDiscountsAndWash": 25438,
            "TotalWashingCost": 1920,
            "DiscountedUnitCostWithDaysFactorForDisplay": 392,
            "QuantityDiscountFactor": 0.9898076923076924,
            "Available": {
              "available": "Available",
              "remaining": 9764,
              "totalAvailable": 9764
            },
            "Extras": {
              "discountedUnitPrice": 195.9819230769231,
              "discountedUnitPriceWithDaysOfUseIncreaseFactor": 391.9638461538462,
              "totalDiscountedUnitCostWithEverything": 23517.83076923077,
              "totalWashingCost": 1920,
              "daysOfUseIncreaseFactor": 2
            }
          },
          {
            "createdAt": 1563508625557,
            "updatedAt": 1563508625557,
            "id": 166,
            "NameE1": "Rental Plumm Glass",
            "NameE2": "Red B",
            "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
            "NameJ2": "ﾚｯﾄﾞB",
            "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
            "UnitPrice": 230,
            "RackCapacity": 16,
            "RackHeight": 280,
            "Type": "Glassware",
            "Quantity": "60",
            "WashAndPolish": 32,
            "TotalPriceRaw": 11880,
            "TotalPriceWithDiscountsAndWash": 25438,
            "TotalWashingCost": 1920,
            "DiscountedUnitCostWithDaysFactorForDisplay": 392,
            "QuantityDiscountFactor": 0.9898076923076924,
            "Available": {
              "available": "Not Available",
              "remaining": 0,
              "totalAvailable": 0
            },
            "Extras": {
              "discountedUnitPrice": 195.9819230769231,
              "discountedUnitPriceWithDaysOfUseIncreaseFactor": 391.9638461538462,
              "totalDiscountedUnitCostWithEverything": 23517.83076923077,
              "totalWashingCost": 1920,
              "daysOfUseIncreaseFactor": 2
            }
          }
        ],
        "shipping": {
          "postcode": 1000100,
          "postcodeRaw": "100-0100",
          "price": 17760,
          "consumptionTax": 1420.8,
          "priceWithTax": 19180.8,
          "shippingFactorRecord": {
            "createdAt": 1563508629796,
            "updatedAt": 1563508629796,
            "id": 9,
            "LowZip": 1000100,
            "HighZip": 1000210,
            "Place": "東京都大島町",
            "Truck_OK": 0,
            "Truck_Distance_Factor": "",
            "Takuhai_Factor": 1,
            "OFFSET": 9,
            "ZIP_VALUE": 1000100,
            "OFFSET_CALC": 8
          },
          "shippingPossible": true,
          "shippingType": "takuhai",
          "result2": {
            "9": 0,
            "10": 0,
            "16": 36,
            "25": 30,
            "36": 0
          }
        }
      }
    )
    .expect(200)
    .then(res => {
      res.body.should.containEql({
        // not 100% sure yet
      });
   });
  });
});
