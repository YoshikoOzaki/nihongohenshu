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

module.exports.bootstrap = async function(done) {
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
    if (process.env.NODE_ENV==='production' || sails.config.models.migrate === 'safe') {
      sails.log.warn('Since we are running with migrate: \'safe\' and/or NODE_ENV=production (in the "'+sails.config.environment+'" Sails environment, to be precise), skipping the rest of the bootstrap to avoid data loss...');
      return done();
    }//•

    // Compare bootstrap version from code base to the version that was last run
    var lastRunBootstrapInfo = await sails.helpers.fs.readJson(bootstrapLastRunInfoPath)
    .tolerate('doesNotExist');// (it's ok if the file doesn't exist yet-- just keep going.)

    if (lastRunBootstrapInfo && lastRunBootstrapInfo.lastRunVersion === HARD_CODED_DATA_VERSION) {
      sails.log('Skipping v'+HARD_CODED_DATA_VERSION+' bootstrap script...  (because it\'s already been run)');
      sails.log('(last run on this computer: @ '+(new Date(lastRunBootstrapInfo.lastRunAt))+')');
      return done();
    }//•

    sails.log('Running v'+HARD_CODED_DATA_VERSION+' bootstrap script...  ('+(lastRunBootstrapInfo ? 'before this, the last time the bootstrap ran on this computer was for v'+lastRunBootstrapInfo.lastRunVersion+' @ '+(new Date(lastRunBootstrapInfo.lastRunAt)) : 'looks like this is the first time the bootstrap has run on this computer')+')');
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
  await User.createEach([
    { emailAddress: 'jarodccrowe@gmail.com', fullName: 'Harry', isSuperAdmin: true, password: await sails.helpers.passwords.hashPassword('abc123') },
    { emailAddress: 'j@crowe.com', fullName: 'Jarod Crowe', isSuperAdmin: true, password: await sails.helpers.passwords.hashPassword('abc123') },
    { emailAddress: 'richard@email.com', fullName: 'Richard', isSuperAdmin: false, password: await sails.helpers.passwords.hashPassword('abc123') },
  ]);

  await Glass.createEach([
    {
      NameEng: 'Handmade Vintage WHITE',
      NameJap: '北海道札幌市',
      TotalQuantityInSystem: 10000,
      ImgSrc: 'https://www.plumm.com/globalassets/productassets/pluh3320a/plumm-large/pluh3320a_3_plumm-large.jpg',
      Sku: 160,
      UnitPrice: 10,
      RackCapacity: 10,
    },
    {
      NameEng: 'Handmade Glass WHITE',
      NameJap: '東京都新島村',
      TotalQuantityInSystem: 20000,
      ImgSrc: 'https://www.plumm.com/globalassets/productassets/pluh3320b/plumm-large/pluh3320b_6_plumm-large.jpg',
      Sku: 161,
      UnitPrice: 12,
      RackCapacity: 10,
    },
    {
      NameEng: 'Handmade Glass RED',
      NameJap: '東京都新島村',
      TotalQuantityInSystem: 20000,
      ImgSrc: 'https://www.plumm.com/globalassets/productassets/pluo6660rw/plumm-large/pluo6660rw_3_plumm-large.jpg',
      Sku: 162,
      UnitPrice: 12,
      RackCapacity: 10,
    },
    {
      NameEng: 'Vintage WHITEb Retail',
      NameJap: '東京都新島村',
      TotalQuantityInSystem: 20000,
      ImgSrc: 'https://www.plumm.com/globalassets/productassets/pluv4420b2/plumm-large/pluv4420b2_6_plumm-large.jpg',
      Sku: 162,
      UnitPrice: 12,
      RackCapacity: 10,
    },
  ]);

  await DeliveryCost.createEach([
    {
      LowZip: '0010010',
      HighZip: '0070895',
      Place: '北海道札幌市',
      Truck_OK: 0,
      Takuhai_Factor: '4',
      OFFSET: 1,
      ZIP_VALUE: 10010,
      OFFSET_CALC: 0,
    },
    {
      LowZip: '0100000',
      HighZip: '0185422',
      Place: '秋田県鹿角市',
      Truck_OK: 0,
      Takuhai_Factor: '1',
      OFFSET: 2,
      ZIP_VALUE: 100000,
      OFFSET_CALC: 1,
    },
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
      Description: 'Rental order',
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
  ]);

  await Order.createEach([
    {
      DateStart: '2019-05-01',
      DateEnd: '2019-05-10',
      DaysOfUse: '6',
      User: '2',
    },
    {
      DateStart: '2019-05-01',
      DateEnd: '2019-05-10',
      DaysOfUse: '6',
      User: '3',
    },
    {
      DateStart: '2019-05-01',
      DateEnd: '2019-05-10',
      DaysOfUse: '6',
      CustomerKeyword: 'wineorder1234',
    },
  ]);

  await OrderLineNumber.createEach([
    {
      Quantity: '1000',
      Glass: '1',
      Order: '1',
    },
    {
      Quantity: '1000',
      Glass: '2',
      Order: '1',
    },
    {
      Quantity: '1000',
      Glass: '3',
      Order: '1',
    },
    {
      Quantity: '500',
      Glass: '1',
      Order: '2',
    },
    {
      Quantity: '500',
      Glass: '2',
      Order: '2',
    },
  ]);

  // these should actually be different orders or a few orders updating
  // over time into different states
  await Transaction.createEach([
    {
      TransactionType: '10',
      Product: '1',
      Quantity: '5000',
      Warehouse: '60',
      Comment: 'stock added into system',
      Date: '2019-04-01',
    },
    {
      TransactionType: '10',
      Product: '1',
      Quantity: '10000',
      Warehouse: '60',
      Comment: 'stock added into system',
      Date: '2019-04-01',
    },
    {
      TransactionType: '10',
      Product: '3',
      Quantity: '5000',
      Warehouse: '60',
      Comment: 'stock added into system',
      Date: '2019-04-01',
    },
    {
      TransactionType: '40',
      Product: '1',
      Quantity: '1000',
      UnitPrice: '100',
      Warehouse: '60',
      Comment: 'rental order',
      Date: '2019-05-01',
    },
    {
      TransactionType: '40',
      Product: '1',
      Quantity: '1000',
      UnitPrice: '100',
      Warehouse: '60',
      Comment: 'rental order',
      Date: '2019-05-01',
    },
    {
      TransactionType: '44',
      Product: '1',
      Quantity: '100',
      UnitPrice: '100',
      Warehouse: '60',
      Comment: 'return planned',
      Date: '2019-05-03',
    },
    {
      TransactionType: '55',
      Product: '1',
      Quantity: '1000',
      UnitPrice: '100',
      Warehouse: '60',
      Comment: 'order returned',
      Date: '2019-05-05',
    },
    {
      TransactionType: '57',
      Product: '1',
      Quantity: '1000',
      UnitPrice: '100',
      Warehouse: '60',
      Comment: 'washed and restocked',
      Date: '2019-05-05',
    },
    {
      TransactionType: '40',
      Product: '1',
      Quantity: '15000',
      UnitPrice: '100',
      Warehouse: '60',
      Comment: 'rental order',
      Date: '2019-05-06',
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

  // Save new bootstrap version
  await sails.helpers.fs.writeJson.with({
    destination: bootstrapLastRunInfoPath,
    json: {
      lastRunVersion: HARD_CODED_DATA_VERSION,
      lastRunAt: Date.now()
    },
    force: true
  })
  .tolerate((err)=>{
    sails.log.warn('For some reason, could not write bootstrap version .json file.  This could be a result of a problem with your configured paths, or, if you are in production, a limitation of your hosting provider related to `pwd`.  As a workaround, try updating app.js to explicitly pass in `appPath: __dirname` instead of relying on `chdir`.  Current sails.config.appPath: `'+sails.config.appPath+'`.  Full error details: '+err.stack+'\n\n(Proceeding anyway this time...)');
  });

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
