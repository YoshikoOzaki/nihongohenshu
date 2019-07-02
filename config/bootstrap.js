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

  await Product.createEach([
    {
      NameE: 'Rental Plumm Glass Flute',
      NameJ: '北海道札幌市',
      ImgSrc: 'https://www.plumm.com/globalassets/productassets/pluh3320a/plumm-large/pluh3320a_3_plumm-large.jpg',
      id: 161,
      UnitPrice: 100,
      RackCapacity: 36,
      RackHeight: 340,
    },
    {
      NameE: 'Rental Plumm Glass MultiRed',
      NameJ: '東京都新島村',
      ImgSrc: 'https://www.plumm.com/globalassets/productassets/pluh3320b/plumm-large/pluh3320b_6_plumm-large.jpg',
      id: 189,
      UnitPrice: 120,
      RackCapacity: 25,
      RackHeight: 340,
    },
    {
      NameE: 'Rental Plumm Glass Red A (Stemless)',
      NameJ: '東京都新島村',
      ImgSrc: 'https://www.plumm.com/globalassets/productassets/pluo6660rw/plumm-large/pluo6660rw_3_plumm-large.jpg',
      id: 173,
      UnitPrice: 120,
      RackCapacity: 16,
      RackHeight: 380,
    },
    {
      NameE: 'Rental Plumm Glass Red or White',
      NameJ: '東京都新島村',
      ImgSrc: 'https://www.plumm.com/globalassets/productassets/pluv4420b2/plumm-large/pluv4420b2_6_plumm-large.jpg',
      id: 164,
      UnitPrice: 120,
      RackCapacity: 25,
      RackHeight: 340,
    },
    {
      NameE: 'Handmade Red',
      NameJ: '東京都新島村',
      ImgSrc: 'https://www.plumm.com/globalassets/productassets/pluh3310b/plumm-large/pluh3310b_3_plumm-large.jpg',
      id: 165,
      UnitPrice: 120,
      RackCapacity: 25,
      RackHeight: 340,
    },
    {
      NameE: 'Rental Delivery and Pickup',
      NameJ: 'ﾚﾝﾀﾙ用配達と引き取り',
      id: 160,
      UnitPrice: 3000,
    },
    {
      NameE: 'Rental Delivery by Courier. Return not included',
      NameJ: 'ﾚﾝﾀﾙ用宅配料金(お届けのみ）',
      id: 210,
      UnitPrice: 1,
    },
    {
      NameE: 'Rental Freight (Delivery and Return Included)',
      NameJ: 'ﾚﾝﾀﾙ用宅配料金(往復）',
      id: 211,
      UnitPrice: 1,
    }
  ]);



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
      TakuhaiFactor: 9,
      TakuhaiUnitCharge: 2295,
    },
  ]);

  await DeliveryCost.createEach(
    [
      {
        "LowZip": 4104,
        "HighZip": 70895,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 32768,
        "HighZip": 185422,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 185501,
        "HighZip": 185501,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 185511,
        "HighZip": 192742,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 65536,
        "HighZip": 295701,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 98377,
        "HighZip": 395346,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 131073,
        "HighZip": 996506,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 1000000,
        "HighZip": 1000014,
        "Truck_OK": 1,
        "Truck_Distance_Factor": 200,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 1000100,
        "HighZip": 1000212,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 1000301,
        "HighZip": 1000301,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 1000400,
        "HighZip": 1000402,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 1000511,
        "HighZip": 1000511,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 1000601,
        "HighZip": 1000601,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 1001100,
        "HighZip": 1001213,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 1001301,
        "HighZip": 1001301,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 1001400,
        "HighZip": 1001623,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 1001701,
        "HighZip": 1001701,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 1002100,
        "HighZip": 1002211,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 1006001,
        "HighZip": 2088585,
        "Truck_OK": 1,
        "Truck_Distance_Factor": 200,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 2100000,
        "HighZip": 2591335,
        "Truck_OK": 1,
        "Truck_Distance_Factor": 200,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 2600000,
        "HighZip": 2995506,
        "Truck_OK": 1,
        "Truck_Distance_Factor": 200,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 3000000,
        "HighZip": 3193705,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 3200001,
        "HighZip": 3294425,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 3300000,
        "HighZip": 3691998,
        "Truck_OK": 1,
        "Truck_Distance_Factor": 200,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 3700000,
        "HighZip": 3792398,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 3800801,
        "HighZip": 3840096,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 3840097,
        "HighZip": 3840097,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 3840301,
        "HighZip": 3890115,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 3890121,
        "HighZip": 3890121,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 3890192,
        "HighZip": 3999601,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 4000000,
        "HighZip": 4093898,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 4100000,
        "HighZip": 4314112,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 4314121,
        "HighZip": 4314121,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 4314195,
        "HighZip": 4398651,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 4400001,
        "HighZip": 4970058,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 4980000,
        "HighZip": 4980823,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 5000000,
        "HighZip": 5099298,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 5100000,
        "HighZip": 5195835,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 5200000,
        "HighZip": 5200363,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 5200461,
        "HighZip": 5200465,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 5200471,
        "HighZip": 5291892,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 5300000,
        "HighZip": 5630373,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 5630801,
        "HighZip": 5630801,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 5638567,
        "HighZip": 5998531,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 6000000,
        "HighZip": 6170857,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 6180000,
        "HighZip": 6180024,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 6180071,
        "HighZip": 6180091,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 6188503,
        "HighZip": 6188589,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 6190200,
        "HighZip": 6293579,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 6300000,
        "HighZip": 6300267,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 6300271,
        "HighZip": 6300272,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 6301101,
        "HighZip": 6393809,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 6400000,
        "HighZip": 6471235,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 6471271,
        "HighZip": 6471271,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 6471321,
        "HighZip": 6471325,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 6471581,
        "HighZip": 6471584,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 6471700,
        "HighZip": 6480263,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 6480300,
        "HighZip": 6480309,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 6480401,
        "HighZip": 6480405,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 6490100,
        "HighZip": 6497216,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 6500000,
        "HighZip": 6795654,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 2
      },
      {
        "LowZip": 6800000,
        "HighZip": 6840075,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 3
      },
      {
        "LowZip": 6840100,
        "HighZip": 6850435,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 3
      },
      {
        "LowZip": 6890100,
        "HighZip": 6895673,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 3
      },
      {
        "LowZip": 6900000,
        "HighZip": 6995637,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 3
      },
      {
        "LowZip": 7000000,
        "HighZip": 7193814,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 3
      },
      {
        "LowZip": 7200001,
        "HighZip": 7398616,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 3
      },
      {
        "LowZip": 7400000,
        "HighZip": 7596614,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 3
      },
      {
        "LowZip": 7600000,
        "HighZip": 7692992,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 3
      },
      {
        "LowZip": 7700000,
        "HighZip": 7795453,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 3
      },
      {
        "LowZip": 7800000,
        "HighZip": 7891992,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 3
      },
      {
        "LowZip": 7900001,
        "HighZip": 7993772,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 3
      },
      {
        "LowZip": 8000000,
        "HighZip": 8114393,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8115100,
        "HighZip": 8115757,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8120000,
        "HighZip": 8168666,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8170000,
        "HighZip": 8172333,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8180000,
        "HighZip": 8391415,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8391421,
        "HighZip": 8391421,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8391493,
        "HighZip": 8398540,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8400001,
        "HighZip": 8480146,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8480400,
        "HighZip": 8480408,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8488501,
        "HighZip": 8498588,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8500000,
        "HighZip": 8596415,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8600001,
        "HighZip": 8696405,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8700001,
        "HighZip": 8708691,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8710000,
        "HighZip": 8710208,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8710226,
        "HighZip": 8710226,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8710295,
        "HighZip": 8710795,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8710801,
        "HighZip": 8710993,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8718501,
        "HighZip": 8797885,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8800000,
        "HighZip": 8894602,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 8900000,
        "HighZip": 8998608,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 4
      },
      {
        "LowZip": 9000000,
        "HighZip": 9071801,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 9
      },
      {
        "LowZip": 9100001,
        "HighZip": 9192392,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 9200000,
        "HighZip": 9220673,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 9220679,
        "HighZip": 9220679,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 9220801,
        "HighZip": 9292392,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 9300001,
        "HighZip": 9390156,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 9390171,
        "HighZip": 9390171,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 9390192,
        "HighZip": 9398650,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 9400000,
        "HighZip": 9594636,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 9600000,
        "HighZip": 9793204,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 9800000,
        "HighZip": 9896941,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
      },
      {
        "LowZip": 9900000,
        "HighZip": 9998531,
        "Truck_OK": 0,
        "Truck_Distance_Factor": 0,
        "Takuhai_Factor": 1
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
