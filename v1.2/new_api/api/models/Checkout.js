/**
* Checkout.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  		refid:{
  			type:"string",
  			required:true
  		},
  		status:{
  			type:"integer",
  			required:true
  		}
  }
};

