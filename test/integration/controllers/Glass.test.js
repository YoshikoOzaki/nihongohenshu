var request = require('supertest'),
    should = require('should');


describe('Glass Controller', function () {

    before(function (done) {
        done(null, sails);
    });

    it('get glasses', function (done) {
        request(sails.hooks.http.app)
            .get('/api/v1/glass/get-glasses')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                const body = res.body;
                // body.length.should.equal(5);
                body[1].should.containDeep(
                  {
                    id: 161,
                    NameE: 'Rental Plumm Glass Flute',
                  }
                );
                should.exist(res.body);

                done();
            });
    });
});