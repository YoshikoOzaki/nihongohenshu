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
    //     .send({ email: "jarodccrowe@gmail.com", password:'abc123' })
    //     .expect(200)
    //     .end(function(err,res){
    //       // res.headers['set-cookie'].should.exist;

    //       // cookie = res.headers['set-cookie'];
    //       // console.log(cookie);
    //       done();
    //     })
    //   });

    // it('should create an order', function (done) {
    //   request(sails.hooks.http.app)
    //     .post('/api/v1/order/create-reserve-order')
    //     .send(

    //     )
    //     .expect(200)
    //     .end(function (err, res) {
    //         if (err) return done(err);
    //         const body = res.body;
    //         body.length.should.equal(5);
    //         body[0].should.containDeep(
    //           {
    //             id: 1,
    //             NameEng: 'Handmade Vintage',
    //           }
    //         );
    //         should.exist(res.body);
    //         console.log(cookie);
    //         done();
    //     });
    // });

    // it('should get order data', function (done) {
    //     request(sails.hooks.http.app)
    //         .get('/api/v1/order/get-order?id=1')
    //         .send({id: 123, someOtherParam: "something"})
    //         .expect(200)
    //         .end(function (err, res) {
    //             if (err) return done(err);
    //             const body = res.body;
    //             body[0].should.containDeep(
    //               {
    //                 id: 1,
    //               }
    //             );
    //             should.exist(res.body);

    //             done();
    //         });
    // });
});