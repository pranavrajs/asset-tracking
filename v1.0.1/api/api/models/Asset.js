/**
* Asset.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	adapter:'mysqlServer',
	attributes: {

  		tag:{
  			type:"string",
  			required:true
  		},
  		name:{
  			type:"string",
  			required:true
  		},
  		serial:{
  			type:"string",
  			required:true
  		},
  		asid:
  		{
  			type:"string",
  			required:true
  		},
  		modelno:{
  			type:"string",
  			required:true
  		},
  		purdat:{
  			type:"date",
  			required:true
  		},
  		warranty:{
  			type:"integer",
  			required:true
  		},
  		notes:{
  			type:"string"
  		},
		status:{
			type:"integer",
			defaultsTo:1
		}
	
  }
};

