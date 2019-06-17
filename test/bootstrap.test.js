var Sails = require('sails');

before(function (done) {
    Sails.lift({
        // models: {
        //     connection: 'localDiskDb',
        //     migrate: 'drop'
        // }
    }, function (err, server) {
        sails = server;
        if (err) return done(err);

        sails.log.info('***** Starting tests... *****');
        console.log('\n');

        done(null, sails);
    });
});

after(function (done) {
    sails.lower(done);
});