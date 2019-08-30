module.exports = {


  friendlyName: 'Get takuhai time slots',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    var timeSlots = await TakuhaiTimeSlot.find();

    // All done.
    return exits.success(timeSlots);

  }


};
