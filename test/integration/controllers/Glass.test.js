var request = require('supertest'),
    should = require('should');


describe('My controller', function () {

    before(function (done) {
        done(null, sails);
    });


    it('should get data', function (done) {
        request(sails.hooks.http.app)
            .get('/api/v1/glass/get-glasses')
            .send({id: 123, someOtherParam: "something"})
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

                done();
            });
    });
});