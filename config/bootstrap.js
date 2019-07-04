/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function (done) {
  // Import dependencies
  var path = require('path');

  // This bootstrap version indicates what version of fake data we're dealing with here.
  var HARD_CODED_DATA_VERSION = 0;

  // This path indicates where to store/look for the JSON file that tracks the "last run bootstrap info"
  // locally on this development computer (if we happen to be on a development computer).
  var bootstrapLastRunInfoPath = path.resolve(sails.config.appPath, '.tmp/bootstrap-version.json');

  // Whether or not to continue doing the stuff in this file (i.e. wiping and regenerating data)
  // depends on some factors:
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // If the hard-coded data version has been incremented, or we're being forced
  // (i.e. `--drop` or `--environment=test` was set), then run the meat of this
  // bootstrap script to wipe all existing data and rebuild hard-coded data.
  if (sails.config.models.migrate !== 'drop' && sails.config.environment !== 'test') {
    // If this is _actually_ a production environment (real or simulated), or we have
    // `migrate: safe` enabled, then prevent accidentally removing all data!
    if (process.env.NODE_ENV === 'production' || sails.config.models.migrate === 'safe') {
      sails.log.warn('Since we are running with migrate: \'safe\' and/or NODE_ENV=production (in the "' + sails.config.environment + '" Sails environment, to be precise), skipping the rest of the bootstrap to avoid data loss...');
      return done();
    }//•

    // Compare bootstrap version from code base to the version that was last run
    var lastRunBootstrapInfo = await sails.helpers.fs.readJson(bootstrapLastRunInfoPath)
      .tolerate('doesNotExist');// (it's ok if the file doesn't exist yet-- just keep going.)

    if (lastRunBootstrapInfo && lastRunBootstrapInfo.lastRunVersion === HARD_CODED_DATA_VERSION) {
      sails.log('Skipping v' + HARD_CODED_DATA_VERSION + ' bootstrap script...  (because it\'s already been run)');
      sails.log('(last run on this computer: @ ' + (new Date(lastRunBootstrapInfo.lastRunAt)) + ')');
      return done();
    }//•

    sails.log('Running v' + HARD_CODED_DATA_VERSION + ' bootstrap script...  (' + (lastRunBootstrapInfo ? 'before this, the last time the bootstrap ran on this computer was for v' + lastRunBootstrapInfo.lastRunVersion + ' @ ' + (new Date(lastRunBootstrapInfo.lastRunAt)) : 'looks like this is the first time the bootstrap has run on this computer') + ')');
  }
  else {
    sails.log('Running bootstrap script because it was forced...  (either `--drop` or `--environment=test` was used)');
  }

  // Since the hard-coded data version has been incremented, and we're running in
  // a "throwaway data" environment, delete all records from all models.
  for (let identity in sails.models) {
    await sails.models[identity].destroy({});
  }//∞

  // By convention, this is a good place to set up fake data during development.
  await TakuhaiTimeSlot.createEach([
    {
      Name: 'A.M.',
      YuPackCode: '0812',
    },
    {
      Name: '12:00-14:00',
      YuPackCode: '1214',
    },
    {
      Name: '14:00-16:00',
      YuPackCode: '1416',
    },
    {
      Name: '16:00-18:00',
      YuPackCode: '1618',
    },
    {
      Name: '18:00-20:00',
      YuPackCode: '1820',
    },
    {
      Name: '20:00-21:00',
      YuPackCode: '2021',
    },
    {
      Name: 'Anytime',
      YuPackCode: '',
    },
  ]);

  await WashAndPolish.createEach([
    {
      Name: 'Wash And Polish',
      Price: '23',
      Valid: true,
    },
  ]);

  await User.createEach([
    {emailAddress: 'jarodccrowe@gmail.com', fullName: 'Harry', isSuperAdmin: true, password: await sails.helpers.passwords.hashPassword('abc123')},
    {emailAddress: 'j@crowe.com', fullName: 'Jarod Crowe', isSuperAdmin: true, password: await sails.helpers.passwords.hashPassword('abc123')},
    {emailAddress: 'richard@email.com', fullName: 'Richard', isSuperAdmin: false, password: await sails.helpers.passwords.hashPassword('abc123')},
  ]);

  await Product.createEach(
    [
      {
        "id": 160,
        "NameJ1": "ﾚﾝﾀﾙ用配達と引き取り",
        "NameJ2": "",
        "NameE1": "Rental Delivery and Pickup",
        "NameE2": "",
        "UnitPrice": 3000,
        "Type": "Delivery"
      },
      {
        "id": 161,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾌﾙｰﾄ",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "Flute",
        "UnitPrice": 120,
        "RackCapacity": 36,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 162,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾎﾜｲﾄA",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "White A",
        "UnitPrice": 170,
        "RackCapacity": 25,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 163,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾎﾜｲﾄB",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "White B",
        "UnitPrice": 230,
        "RackCapacity": 16,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 164,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "RW",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "Red or White",
        "UnitPrice": 170,
        "RackCapacity": 25,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 165,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾚｯﾄﾞA",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "Red A",
        "UnitPrice": 230,
        "RackCapacity": 16,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 166,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾚｯﾄﾞB",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "Red B",
        "UnitPrice": 230,
        "RackCapacity": 16,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 167,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾌﾙｰﾄ (ﾊﾝﾄﾞﾒｲﾄﾞ)",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "Flute (Handmade)",
        "UnitPrice": 300,
        "RackCapacity": 25,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 168,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾎﾜｲﾄA (ﾊﾝﾄﾞﾒｲﾄﾞ)",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "White A (Handmade)",
        "UnitPrice": 300,
        "RackCapacity": 25,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 169,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾎﾜｲﾄB (ﾊﾝﾄﾞﾒｲﾄﾞ)",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "White B (Handmade)",
        "UnitPrice": 300,
        "RackCapacity": 16,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 170,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾚｯﾄﾞA (ﾊﾝﾄﾞﾒｲﾄﾞ)",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "Red A (Handmade)",
        "UnitPrice": 300,
        "RackCapacity": 16,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 171,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾚｯﾄﾞB (ﾊﾝﾄﾞﾒｲﾄﾞ)",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "Red B (Handmade)",
        "UnitPrice": 300,
        "RackCapacity": 9,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 172,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾎﾜｲﾄA (ｽﾃﾑﾚｽ)",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "White A (Stemless)",
        "UnitPrice": 160,
        "RackCapacity": 25,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 173,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾚｯﾄﾞA (ｽﾃﾑﾚｽ)",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "Red A (Stemless)",
        "UnitPrice": 220,
        "RackCapacity": 16,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 174,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾌﾙｰﾄ･ｱｳﾄﾄﾞｱ",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "Flute Outdoors",
        "UnitPrice": 230,
        "RackCapacity": 36,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 175,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾎﾜｲﾄA･ｱｳﾄﾄﾞｱ",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "White A Outdoors",
        "UnitPrice": 230,
        "RackCapacity": 25,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 176,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "RW･ｱｳﾄﾄﾞｱ",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "Red or White Outdoors",
        "UnitPrice": 230,
        "RackCapacity": 16,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 177,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾚｯﾄﾞA･ｱｳﾄﾄﾞｱ",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "Red A Outdoors",
        "UnitPrice": 230,
        "RackCapacity": 16,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 178,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾎﾜｲﾄA･ｱｳﾄﾄﾞｱ (ｽﾃﾑﾚｽ)",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "White A Outdoors (Stemless)",
        "UnitPrice": 200,
        "RackCapacity": 25,
        "RackHeight": 220,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 179,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾚｯﾄﾞA･ｱｳﾄﾄﾞｱ (ｽﾃﾑﾚｽ)",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "Red A Outdoors (Stemless)",
        "UnitPrice": 200,
        "RackCapacity": 16,
        "RackHeight": 220,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 180,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ﾃﾞｶﾝﾀ",
        "NameJ2": "ﾌﾘﾝﾀﾞｰｽﾞ",
        "NameE1": "Rental Plumm Decanter",
        "NameE2": "Flinders",
        "UnitPrice": 1200,
        "RackCapacity": 2,
        "RackHeight": 300,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 181,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ﾃﾞｶﾝﾀ",
        "NameJ2": "ﾗｲｺﾞﾝ",
        "NameE1": "Rental Plumm Decanter",
        "NameE2": "Lygon",
        "UnitPrice": 1400,
        "RackCapacity": 2,
        "RackHeight": 300,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 182,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ﾃﾞｶﾝﾀ",
        "NameJ2": "ｺﾘﾝｽﾞ",
        "NameE1": "Rental Plumm Decanter",
        "NameE2": "Collins",
        "UnitPrice": 1800,
        "RackCapacity": 2,
        "RackHeight": 300,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 183,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ﾃﾞｶﾝﾀ",
        "NameJ2": "ﾌﾘﾝﾀﾞｰｽﾞ･ﾐﾆ",
        "NameE1": "Rental Plumm Decanter",
        "NameE2": "Flinders Mini",
        "UnitPrice": 450,
        "RackCapacity": 2,
        "RackHeight": 300,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 184,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ﾃﾞｶﾝﾀ",
        "NameJ2": "ｽﾌﾟﾘﾝｸﾞ 2ltr",
        "NameE1": "Rental Plumm Decanter",
        "NameE2": "Spring 2ltr",
        "UnitPrice": 960,
        "RackCapacity": 2,
        "RackHeight": 300,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 187,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾎﾜｲﾄB (ｽﾃﾑﾚｽ)",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "White B (Stemless)",
        "UnitPrice": 200,
        "RackCapacity": 16,
        "RackHeight": 220,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 188,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾚｯﾄﾞB (ｽﾃﾑﾚｽ)",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "Red B (Stemless)",
        "UnitPrice": 200,
        "RackCapacity": 16,
        "RackHeight": 220,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 189,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ﾏﾙﾁﾚｯﾄﾞ",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "MultiRed",
        "UnitPrice": 170,
        "RackCapacity": 25,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 204,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "ｼｬﾝﾊﾟｰﾆｭ (ﾊﾝﾄﾞﾒｲﾄﾞ)",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "Champagne (Handmade )",
        "UnitPrice": 300,
        "RackCapacity": 16,
        "RackHeight": 280,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      },
      {
        "id": 210,
        "NameJ1": "ﾚﾝﾀﾙ用宅配料金(お届けのみ）",
        "NameJ2": "",
        "NameE1": "Rental Delivery by Courier. Return not included",
        "NameE2": "",
        "UnitPrice": 1,
        "Type": "Delivery"
      },
      {
        "id": 211,
        "NameJ1": "ﾚﾝﾀﾙ用宅配料金(往復）",
        "NameJ2": "",
        "NameE1": "Rental Freight (Delivery and Return Included)",
        "NameE2": "",
        "UnitPrice": 1,
        "Type": "Delivery"
      },
      {
        "id": 239,
        "NameJ1": "ﾚﾝﾀﾙ用ｻｰﾋﾞｽ",
        "NameJ2": "ﾄレー",
        "NameE1": "Rental Glass",
        "NameE2": "Service Tray",
        "UnitPrice": 1,
        "Type": "Addon"
      },
      {
        "id": 240,
        "NameJ1": "ﾚﾝﾀﾙ用ｻｰﾋﾞｽ",
        "NameJ2": "ﾊﾞﾅｰ",
        "NameE1": "Rental Plumm",
        "NameE2": "Banner",
        "UnitPrice": 1,
        "Type": "Addon",
      },
      {
        "id": 241,
        "NameJ1": "ﾚﾝﾀﾙ用宅配料金(返却分）",
        "NameJ2": "",
        "NameE1": "Rental Delivery by Courier (Return)",
        "NameE2": "",
        "UnitPrice": 1,
        "Type": "Delivery"
      },
      {
        "id": 260,
        "NameJ1": "ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ",
        "NameJ2": "RW･ﾐﾆ",
        "NameE1": "Rental Plumm Glass",
        "NameE2": "Red or White Mini",
        "UnitPrice": 120,
        "RackCapacity": 36,
        "RackHeight": 340,
        "ImgSrc": "https://www.plumm.com/globalassets/productassets/pluh3310a/plumm-large/pluh3310a_4_plumm-large.jpg",
        "Type": "Glassware"
      }
    ]
  );



  await TransactionType.createEach([
    {
      id: 10,
      Name: '確定',
      Description: 'Stock in',
      RecordHandlingGuide: '11',
    },
    {
      id: 40,
      Name: '注文確定',
      Description: 'Order Confirmed',
      RecordHandlingGuide: '12',
    },
    {
      id: 53,
      Name: 'ﾚﾝﾀﾙ中',
      Description: 'With the renter',
      RecordHandlingGuide: '22',
    },
    {
      id: 44,
      Name: 'ﾚﾝﾀﾙ中',
      Description: 'Rental return planned',
      RecordHandlingGuide: '22',
    },
    {
      id: 55,
      Name: '返却済み',
      Description: 'Rental Return Confirmed',
      RecordHandlingGuide: '22',
    },
    {
      id: 57,
      Name: '洗浄済み転記可',
      Description: 'Wash Completed, post to accounts receivable. If payment already received, ' +
        'it will be recorded in the independent accounts receivable package. Lotus posts across' +
        ' the systems, but this could be handled as a separately developed batch op.',
      RecordHandlingGuide: '22',
    },
    {
      id: 60,
      Name: '洗浄済み転記可',
      Description: 'Sale - also used for delivery costs',
      RecordHandlingGuide: '11',
    },
  ]);

  // these should actually be different orders or a few orders updating
  // over time into different states
  await Transaction.createEach([
    {
      TransactionType: '10',
      Product: '161',
      Quantity: '10000',
      Warehouse: '60',
      Comment: 'stock added into system',
      Date: '2019-04-01',
    },
    {
      TransactionType: '10',
      Product: '189',
      Quantity: '10000',
      Warehouse: '60',
      Comment: 'stock added into system',
      Date: '2019-04-01',
    },
    {
      TransactionType: '10',
      Product: '173',
      Quantity: '10000',
      Warehouse: '60',
      Comment: 'stock added into system',
      Date: '2019-04-01',
    },
    {
      TransactionType: '10',
      Product: '164',
      Quantity: '10000',
      Warehouse: '60',
      Comment: 'stock added into system',
      Date: '2019-04-01',
    },
    {
      TransactionType: '10',
      Product: '165',
      Quantity: '10000',
      Warehouse: '60',
      Comment: 'stock added into system',
      Date: '2019-04-01',
    },
  ]);

  await TakuhaiUnitCharge.createEach([
    {
      TakuhaiFactor: 1,
      TakuhaiUnitCharge: 1776,
    },
    {
      TakuhaiFactor: 2,
      TakuhaiUnitCharge: 1863,
    },
    {
      TakuhaiFactor: 3,
      TakuhaiUnitCharge: 1960,
    },
    {
      TakuhaiFactor: 4,
      TakuhaiUnitCharge: 2146,
    },
    {
      TakuhaiFactor: 5,
      TakuhaiUnitCharge: 10000000,
    },
    {
      TakuhaiFactor: 6,
      TakuhaiUnitCharge: 10000000,
    },
    {
      TakuhaiFactor: 7,
      TakuhaiUnitCharge: 10000000,
    },
    {
      TakuhaiFactor: 8,
      TakuhaiUnitCharge: 10000000,
    },
    {
      TakuhaiFactor: 9,
      TakuhaiUnitCharge: 2295,
    },
  ]);

  await TruckDistanceFactorCosting.createEach(
    [
      {
        "TruckDistanceFactor": 100,
        "ChargeFirst500x500mm": 1100,
        "ChargePerExtraDolly": 500,
        "ChargePerExtraRackFromSecondDolly": 100,
        "Comment": "Truck minimum charge single journey Tokyo and Surrouding Areas"
      },
      {
        "TruckDistanceFactor": 101,
        "ChargeFirst500x500mm": 3000,
        "ChargePerExtraDolly": 1500,
        "ChargePerExtraRackFromSecondDolly": 300,
        "Comment": "Truck minimum charge single journey Remote Area 1"
      },
      {
        "TruckDistanceFactor": 200,
        "ChargeFirst500x500mm": 2200,
        "ChargePerExtraDolly": 1000,
        "ChargePerExtraRackFromSecondDolly": 200,
        "Comment": "Truck minimum charge delivery and pickup Tokyo and Surrounding Areas"
      },
      {
        "TruckDistanceFactor": 201,
        "ChargeFirst500x500mm": 6000,
        "ChargePerExtraDolly": 3000,
        "ChargePerExtraRackFromSecondDolly": 600,
        "Comment": "Truck minimum charge delivery and pickup Remote Area 1"
      }
    ]
  );

  await DeliveryCost.createEach(
    [
      {
        "LowZip": "0010010",
        "HighZip": "0070895",
        "Place": "北海道札幌市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 1,
        "ZIP_VALUE": 10010,
        "OFFSET_CALC": 0
      },
      {
        "LowZip": "0100000",
        "HighZip": "0185422",
        "Place": "秋田県鹿角市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 2,
        "ZIP_VALUE": 100000,
        "OFFSET_CALC": 1
      },
      {
        "LowZip": "0185501",
        "HighZip": "0185501",
        "Place": "青森県十和田市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 3,
        "ZIP_VALUE": 185501,
        "OFFSET_CALC": 2
      },
      {
        "LowZip": "0185511",
        "HighZip": "0192742",
        "Place": "秋田県鹿角郡小坂町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 4,
        "ZIP_VALUE": 185511,
        "OFFSET_CALC": 3
      },
      {
        "LowZip": "0200000",
        "HighZip": "0295701",
        "Place": "岩手県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 5,
        "ZIP_VALUE": 200000,
        "OFFSET_CALC": 4
      },
      {
        "LowZip": "0300111",
        "HighZip": "0395346",
        "Place": "青森県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 6,
        "ZIP_VALUE": 300111,
        "OFFSET_CALC": 5
      },
      {
        "LowZip": "0400001",
        "HighZip": "0996506",
        "Place": "北海道",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 7,
        "ZIP_VALUE": 400001,
        "OFFSET_CALC": 6
      },
      {
        "LowZip": 1000000,
        "HighZip": 1000014,
        "Place": "東京都千代田区",
        "Truck_OK": 1,
        "Truck_Distance_Factor": 200,
        "Takuhai_Factor": 1,
        "OFFSET": 8,
        "ZIP_VALUE": 1000000,
        "OFFSET_CALC": 7
      },
      {
        "LowZip": 1000100,
        "HighZip": 1000212,
        "Place": "東京都大島町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 9,
        "ZIP_VALUE": 1000100,
        "OFFSET_CALC": 8
      },
      {
        "LowZip": 1000301,
        "HighZip": 1000301,
        "Place": "東京都利島村",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 10,
        "ZIP_VALUE": 1000301,
        "OFFSET_CALC": 9
      },
      {
        "LowZip": 1000400,
        "HighZip": 1000402,
        "Place": "東京都新島村",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 11,
        "ZIP_VALUE": 1000400,
        "OFFSET_CALC": 10
      },
      {
        "LowZip": 1000511,
        "HighZip": 1000511,
        "Place": "東京都新島村式根島",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 12,
        "ZIP_VALUE": 1000511,
        "OFFSET_CALC": 11
      },
      {
        "LowZip": 1000601,
        "HighZip": 1000601,
        "Place": "神津島村",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 13,
        "ZIP_VALUE": 1000601,
        "OFFSET_CALC": 12
      },
      {
        "LowZip": 1001100,
        "HighZip": 1001213,
        "Place": "東京都三宅島",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 14,
        "ZIP_VALUE": 1001100,
        "OFFSET_CALC": 13
      },
      {
        "LowZip": 1001301,
        "HighZip": 1001301,
        "Place": "東京都三宅島",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 15,
        "ZIP_VALUE": 1001301,
        "OFFSET_CALC": 14
      },
      {
        "LowZip": 1001400,
        "HighZip": 1001623,
        "Place": "八丈島",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 16,
        "ZIP_VALUE": 1001400,
        "OFFSET_CALC": 15
      },
      {
        "LowZip": 1001701,
        "HighZip": 1001701,
        "Place": "青ヶ島",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 17,
        "ZIP_VALUE": 1001701,
        "OFFSET_CALC": 16
      },
      {
        "LowZip": 1002100,
        "HighZip": 1002211,
        "Place": "小笠原",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 18,
        "ZIP_VALUE": 1002100,
        "OFFSET_CALC": 17
      },
      {
        "LowZip": 1006001,
        "HighZip": 2088585,
        "Place": "東京都",
        "Truck_OK": 1,
        "Truck_Distance_Factor": 200,
        "Takuhai_Factor": 1,
        "OFFSET": 19,
        "ZIP_VALUE": 1006001,
        "OFFSET_CALC": 18
      },
      {
        "LowZip": 2100000,
        "HighZip": 2591335,
        "Place": "神奈川県",
        "Truck_OK": 1,
        "Truck_Distance_Factor": 200,
        "Takuhai_Factor": 1,
        "OFFSET": 20,
        "ZIP_VALUE": 2100000,
        "OFFSET_CALC": 19
      },
      {
        "LowZip": 2600000,
        "HighZip": 2995506,
        "Place": "千葉県",
        "Truck_OK": 1,
        "Truck_Distance_Factor": 200,
        "Takuhai_Factor": 1,
        "OFFSET": 21,
        "ZIP_VALUE": 2600000,
        "OFFSET_CALC": 20
      },
      {
        "LowZip": 3000000,
        "HighZip": 3193705,
        "Place": "茨城県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 22,
        "ZIP_VALUE": 3000000,
        "OFFSET_CALC": 21
      },
      {
        "LowZip": 3200001,
        "HighZip": 3294425,
        "Place": "栃木県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 23,
        "ZIP_VALUE": 3200001,
        "OFFSET_CALC": 22
      },
      {
        "LowZip": 3300000,
        "HighZip": 3691998,
        "Place": "埼玉県",
        "Truck_OK": 1,
        "Truck_Distance_Factor": 200,
        "Takuhai_Factor": 1,
        "OFFSET": 24,
        "ZIP_VALUE": 3300000,
        "OFFSET_CALC": 23
      },
      {
        "LowZip": 3700000,
        "HighZip": 3792398,
        "Place": "群馬県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 25,
        "ZIP_VALUE": 3700000,
        "OFFSET_CALC": 24
      },
      {
        "LowZip": 3800801,
        "HighZip": 3840096,
        "Place": "長野県小諸市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 26,
        "ZIP_VALUE": 3800801,
        "OFFSET_CALC": 25
      },
      {
        "LowZip": 3840097,
        "HighZip": 3840097,
        "Place": "群馬県吾妻郡嬬恋村",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 27,
        "ZIP_VALUE": 3840097,
        "OFFSET_CALC": 26
      },
      {
        "LowZip": 3840301,
        "HighZip": 3890115,
        "Place": "長野県北佐久郡軽井沢町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 28,
        "ZIP_VALUE": 3840301,
        "OFFSET_CALC": 27
      },
      {
        "LowZip": 3890121,
        "HighZip": 3890121,
        "Place": "群馬県安中市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 29,
        "ZIP_VALUE": 3890121,
        "OFFSET_CALC": 28
      },
      {
        "LowZip": 3890192,
        "HighZip": 3999601,
        "Place": "長野県北佐久郡軽井沢町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 30,
        "ZIP_VALUE": 3890192,
        "OFFSET_CALC": 29
      },
      {
        "LowZip": 4000000,
        "HighZip": 4093898,
        "Place": "山梨県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 31,
        "ZIP_VALUE": 4000000,
        "OFFSET_CALC": 30
      },
      {
        "LowZip": 4100000,
        "HighZip": 4314112,
        "Place": "静岡県浜松市天竜区",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 32,
        "ZIP_VALUE": 4100000,
        "OFFSET_CALC": 31
      },
      {
        "LowZip": 4314121,
        "HighZip": 4314121,
        "Place": "愛知県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 33,
        "ZIP_VALUE": 4314121,
        "OFFSET_CALC": 32
      },
      {
        "LowZip": 4314195,
        "HighZip": 4398651,
        "Place": "静岡県浜松市天竜区",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 34,
        "ZIP_VALUE": 4314195,
        "OFFSET_CALC": 33
      },
      {
        "LowZip": 4400001,
        "HighZip": 4970058,
        "Place": "愛知県海部郡蟹江町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 35,
        "ZIP_VALUE": 4400001,
        "OFFSET_CALC": 34
      },
      {
        "LowZip": 4980000,
        "HighZip": 4980823,
        "Place": "三重県桑名郡木曽岬町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 36,
        "ZIP_VALUE": 4980000,
        "OFFSET_CALC": 35
      },
      {
        "LowZip": 5000000,
        "HighZip": 5099298,
        "Place": "岐阜県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 37,
        "ZIP_VALUE": 5000000,
        "OFFSET_CALC": 36
      },
      {
        "LowZip": 5100000,
        "HighZip": 5195835,
        "Place": "三重県三重郡朝日町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 38,
        "ZIP_VALUE": 5100000,
        "OFFSET_CALC": 37
      },
      {
        "LowZip": 5200000,
        "HighZip": 5200363,
        "Place": "滋賀県大津市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 39,
        "ZIP_VALUE": 5200000,
        "OFFSET_CALC": 38
      },
      {
        "LowZip": 5200461,
        "HighZip": 5200465,
        "Place": "京都府京都市左京区",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 40,
        "ZIP_VALUE": 5200461,
        "OFFSET_CALC": 39
      },
      {
        "LowZip": 5200471,
        "HighZip": 5291892,
        "Place": "滋賀県大津市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 41,
        "ZIP_VALUE": 5200471,
        "OFFSET_CALC": 40
      },
      {
        "LowZip": 5300000,
        "HighZip": 5630373,
        "Place": "大阪府豊能郡能勢町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 42,
        "ZIP_VALUE": 5300000,
        "OFFSET_CALC": 41
      },
      {
        "LowZip": 5630801,
        "HighZip": 5630801,
        "Place": "兵庫県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 43,
        "ZIP_VALUE": 5630801,
        "OFFSET_CALC": 42
      },
      {
        "LowZip": 5638567,
        "HighZip": 5998531,
        "Place": "大阪府堺市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 44,
        "ZIP_VALUE": 5638567,
        "OFFSET_CALC": 43
      },
      {
        "LowZip": 6000000,
        "HighZip": 6170857,
        "Place": "京都府長岡京市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 45,
        "ZIP_VALUE": 6000000,
        "OFFSET_CALC": 44
      },
      {
        "LowZip": 6180000,
        "HighZip": 6180024,
        "Place": "大阪府三島郡島本町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 46,
        "ZIP_VALUE": 6180000,
        "OFFSET_CALC": 45
      },
      {
        "LowZip": 6180071,
        "HighZip": 6180091,
        "Place": "京都府乙訓郡大山崎町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 47,
        "ZIP_VALUE": 6180071,
        "OFFSET_CALC": 46
      },
      {
        "LowZip": 6188503,
        "HighZip": 6188589,
        "Place": "大阪府三島郡島本町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 48,
        "ZIP_VALUE": 6188503,
        "OFFSET_CALC": 47
      },
      {
        "LowZip": 6190200,
        "HighZip": 6293579,
        "Place": "京都府木津川市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 49,
        "ZIP_VALUE": 6190200,
        "OFFSET_CALC": 48
      },
      {
        "LowZip": 6300000,
        "HighZip": 6300267,
        "Place": "奈良県生駒市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 50,
        "ZIP_VALUE": 6300000,
        "OFFSET_CALC": 49
      },
      {
        "LowZip": 6300271,
        "HighZip": 6300272,
        "Place": "大阪府池田市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 51,
        "ZIP_VALUE": 6300271,
        "OFFSET_CALC": 50
      },
      {
        "LowZip": 6301101,
        "HighZip": 6393809,
        "Place": "奈良県奈良市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 52,
        "ZIP_VALUE": 6301101,
        "OFFSET_CALC": 51
      },
      {
        "LowZip": 6400000,
        "HighZip": 6471235,
        "Place": "和歌山県新宮市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 53,
        "ZIP_VALUE": 6400000,
        "OFFSET_CALC": 52
      },
      {
        "LowZip": 6471271,
        "HighZip": 6471271,
        "Place": "奈良県吉野郡十津川村",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 54,
        "ZIP_VALUE": 6471271,
        "OFFSET_CALC": 53
      },
      {
        "LowZip": 6471321,
        "HighZip": 6471325,
        "Place": "三重県熊野市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 55,
        "ZIP_VALUE": 6471321,
        "OFFSET_CALC": 54
      },
      {
        "LowZip": 6471581,
        "HighZip": 6471584,
        "Place": "奈良県吉野郡十津川村",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 56,
        "ZIP_VALUE": 6471581,
        "OFFSET_CALC": 55
      },
      {
        "LowZip": 6471700,
        "HighZip": 6480263,
        "Place": "和歌山県伊都郡高野町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 57,
        "ZIP_VALUE": 6471700,
        "OFFSET_CALC": 56
      },
      {
        "LowZip": 6480300,
        "HighZip": 6480309,
        "Place": "奈良県吉野郡野迫川村",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 58,
        "ZIP_VALUE": 6480300,
        "OFFSET_CALC": 57
      },
      {
        "LowZip": 6480401,
        "HighZip": 6480405,
        "Place": "和歌山県伊都郡高野町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 59,
        "ZIP_VALUE": 6480401,
        "OFFSET_CALC": 58
      },
      {
        "LowZip": 6490100,
        "HighZip": 6497216,
        "Place": "和歌山県海南市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 60,
        "ZIP_VALUE": 6490100,
        "OFFSET_CALC": 59
      },
      {
        "LowZip": 6500000,
        "HighZip": 6795654,
        "Place": "兵庫県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 2,
        "OFFSET": 61,
        "ZIP_VALUE": 6500000,
        "OFFSET_CALC": 60
      },
      {
        "LowZip": 6800000,
        "HighZip": 6840075,
        "Place": "鳥取県境港市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 3,
        "OFFSET": 62,
        "ZIP_VALUE": 6800000,
        "OFFSET_CALC": 61
      },
      {
        "LowZip": 6840100,
        "HighZip": 6850435,
        "Place": "島根県隠岐郡隠岐の島町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 3,
        "OFFSET": 63,
        "ZIP_VALUE": 6840100,
        "OFFSET_CALC": 62
      },
      {
        "LowZip": 6890100,
        "HighZip": 6895673,
        "Place": "鳥取県日野郡日南町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 3,
        "OFFSET": 64,
        "ZIP_VALUE": 6890100,
        "OFFSET_CALC": 63
      },
      {
        "LowZip": 6900000,
        "HighZip": 6995637,
        "Place": "島根県松江市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 3,
        "OFFSET": 65,
        "ZIP_VALUE": 6900000,
        "OFFSET_CALC": 64
      },
      {
        "LowZip": 7000000,
        "HighZip": 7193814,
        "Place": "岡山県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 3,
        "OFFSET": 66,
        "ZIP_VALUE": 7000000,
        "OFFSET_CALC": 65
      },
      {
        "LowZip": 7200001,
        "HighZip": 7398616,
        "Place": "広島県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 3,
        "OFFSET": 67,
        "ZIP_VALUE": 7200001,
        "OFFSET_CALC": 66
      },
      {
        "LowZip": 7400000,
        "HighZip": 7596614,
        "Place": "山口県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 3,
        "OFFSET": 68,
        "ZIP_VALUE": 7400000,
        "OFFSET_CALC": 67
      },
      {
        "LowZip": 7600000,
        "HighZip": 7692992,
        "Place": "香川県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 3,
        "OFFSET": 69,
        "ZIP_VALUE": 7600000,
        "OFFSET_CALC": 68
      },
      {
        "LowZip": 7700000,
        "HighZip": 7795453,
        "Place": "徳島県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 3,
        "OFFSET": 70,
        "ZIP_VALUE": 7700000,
        "OFFSET_CALC": 69
      },
      {
        "LowZip": 7800000,
        "HighZip": 7891992,
        "Place": "高知県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 3,
        "OFFSET": 71,
        "ZIP_VALUE": 7800000,
        "OFFSET_CALC": 70
      },
      {
        "LowZip": 7900001,
        "HighZip": 7993772,
        "Place": "愛媛県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 3,
        "OFFSET": 72,
        "ZIP_VALUE": 7900001,
        "OFFSET_CALC": 71
      },
      {
        "LowZip": 8000000,
        "HighZip": 8114393,
        "Place": "福岡県遠賀郡遠賀町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 73,
        "ZIP_VALUE": 8000000,
        "OFFSET_CALC": 72
      },
      {
        "LowZip": 8115100,
        "HighZip": 8115757,
        "Place": "長崎県壱岐市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 74,
        "ZIP_VALUE": 8115100,
        "OFFSET_CALC": 73
      },
      {
        "LowZip": 8120000,
        "HighZip": 8168666,
        "Place": "福岡県春日市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 75,
        "ZIP_VALUE": 8120000,
        "OFFSET_CALC": 74
      },
      {
        "LowZip": 8170000,
        "HighZip": 8172333,
        "Place": "長崎県対馬市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 76,
        "ZIP_VALUE": 8170000,
        "OFFSET_CALC": 75
      },
      {
        "LowZip": 8180000,
        "HighZip": 8391415,
        "Place": "福岡県うきは市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 77,
        "ZIP_VALUE": 8180000,
        "OFFSET_CALC": 76
      },
      {
        "LowZip": 8391421,
        "HighZip": 8391421,
        "Place": "大分県日田市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 78,
        "ZIP_VALUE": 8391421,
        "OFFSET_CALC": 77
      },
      {
        "LowZip": 8391493,
        "HighZip": 8398540,
        "Place": "福岡県久留米市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 79,
        "ZIP_VALUE": 8391493,
        "OFFSET_CALC": 78
      },
      {
        "LowZip": 8400001,
        "HighZip": 8480146,
        "Place": "佐賀県伊万里市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 80,
        "ZIP_VALUE": 8400001,
        "OFFSET_CALC": 79
      },
      {
        "LowZip": 8480400,
        "HighZip": 8480408,
        "Place": "長崎県松浦市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 81,
        "ZIP_VALUE": 8480400,
        "OFFSET_CALC": 80
      },
      {
        "LowZip": 8488501,
        "HighZip": 8498588,
        "Place": "佐賀県佐賀市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 82,
        "ZIP_VALUE": 8488501,
        "OFFSET_CALC": 81
      },
      {
        "LowZip": 8500000,
        "HighZip": 8596415,
        "Place": "長崎県佐世保市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 83,
        "ZIP_VALUE": 8500000,
        "OFFSET_CALC": 82
      },
      {
        "LowZip": 8600001,
        "HighZip": 8696405,
        "Place": "熊本県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 84,
        "ZIP_VALUE": 8600001,
        "OFFSET_CALC": 83
      },
      {
        "LowZip": 8700001,
        "HighZip": 8708691,
        "Place": "大分県大分市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 85,
        "ZIP_VALUE": 8700001,
        "OFFSET_CALC": 84
      },
      {
        "LowZip": 8710000,
        "HighZip": 8710208,
        "Place": "大分県中津市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 86,
        "ZIP_VALUE": 8710000,
        "OFFSET_CALC": 85
      },
      {
        "LowZip": 8710226,
        "HighZip": 8710226,
        "Place": "福岡県築上郡上毛町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 87,
        "ZIP_VALUE": 8710226,
        "OFFSET_CALC": 86
      },
      {
        "LowZip": 8710295,
        "HighZip": 8710795,
        "Place": "大分県中津市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 88,
        "ZIP_VALUE": 8710295,
        "OFFSET_CALC": 87
      },
      {
        "LowZip": 8710801,
        "HighZip": 8710993,
        "Place": "福岡県築上郡上毛町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 89,
        "ZIP_VALUE": 8710801,
        "OFFSET_CALC": 88
      },
      {
        "LowZip": 8718501,
        "HighZip": 8797885,
        "Place": "大分県大分市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 90,
        "ZIP_VALUE": 8718501,
        "OFFSET_CALC": 89
      },
      {
        "LowZip": 8800000,
        "HighZip": 8894602,
        "Place": "宮崎県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 91,
        "ZIP_VALUE": 8800000,
        "OFFSET_CALC": 90
      },
      {
        "LowZip": 8900000,
        "HighZip": 8998608,
        "Place": "鹿児島県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 4,
        "OFFSET": 92,
        "ZIP_VALUE": 8900000,
        "OFFSET_CALC": 91
      },
      {
        "LowZip": 9000000,
        "HighZip": 9071801,
        "Place": "沖縄県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 9,
        "OFFSET": 93,
        "ZIP_VALUE": 9000000,
        "OFFSET_CALC": 92
      },
      {
        "LowZip": 9100001,
        "HighZip": 9192392,
        "Place": "福井県大飯郡高浜町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 94,
        "ZIP_VALUE": 9100001,
        "OFFSET_CALC": 93
      },
      {
        "LowZip": 9200000,
        "HighZip": 9220673,
        "Place": "石川県加賀市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 95,
        "ZIP_VALUE": 9200000,
        "OFFSET_CALC": 94
      },
      {
        "LowZip": 9220679,
        "HighZip": 9220679,
        "Place": "福井県あわら市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 96,
        "ZIP_VALUE": 9220679,
        "OFFSET_CALC": 95
      },
      {
        "LowZip": 9220801,
        "HighZip": 9292392,
        "Place": "石川県輪島市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 97,
        "ZIP_VALUE": 9220801,
        "OFFSET_CALC": 96
      },
      {
        "LowZip": 9300001,
        "HighZip": 9390156,
        "Place": "富山県高岡市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 98,
        "ZIP_VALUE": 9300001,
        "OFFSET_CALC": 97
      },
      {
        "LowZip": 9390171,
        "HighZip": 9390171,
        "Place": "石川県羽咋郡宝達志水町",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 99,
        "ZIP_VALUE": 9390171,
        "OFFSET_CALC": 98
      },
      {
        "LowZip": 9390192,
        "HighZip": 9398650,
        "Place": "富山県富山市",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 100,
        "ZIP_VALUE": 9390192,
        "OFFSET_CALC": 99
      },
      {
        "LowZip": 9400000,
        "HighZip": 9594636,
        "Place": "新潟県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 101,
        "ZIP_VALUE": 9400000,
        "OFFSET_CALC": 100
      },
      {
        "LowZip": 9600000,
        "HighZip": 9793204,
        "Place": "福島県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 102,
        "ZIP_VALUE": 9600000,
        "OFFSET_CALC": 101
      },
      {
        "LowZip": 9800000,
        "HighZip": 9896941,
        "Place": "宮城県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 103,
        "ZIP_VALUE": 9800000,
        "OFFSET_CALC": 102
      },
      {
        "LowZip": 9900000,
        "HighZip": 9998531,
        "Place": "山形県",
        "Truck_OK": 0,
        "Truck_Distance_Factor": "",
        "Takuhai_Factor": 1,
        "OFFSET": 104,
        "ZIP_VALUE": 9900000,
        "OFFSET_CALC": 103
      }
    ]
  );

  // Save new bootstrap version
  await sails.helpers.fs.writeJson.with({
    destination: bootstrapLastRunInfoPath,
    json: {
      lastRunVersion: HARD_CODED_DATA_VERSION,
      lastRunAt: Date.now()
    },
    force: true
  })
    .tolerate((err) => {
      sails.log.warn('For some reason, could not write bootstrap version .json file.  This could be a result of a problem with your configured paths, or, if you are in production, a limitation of your hosting provider related to `pwd`.  As a workaround, try updating app.js to explicitly pass in `appPath: __dirname` instead of relying on `chdir`.  Current sails.config.appPath: `' + sails.config.appPath + '`.  Full error details: ' + err.stack + '\n\n(Proceeding anyway this time...)');
    });

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
