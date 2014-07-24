/**
* Zone.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  	adapter:'mysqlServer',
	
	attributes: {

		name:{
			type:"string",
			required:true
		},
		zoneid:{
			type:"string",
			required:true
		},
		floor:{
			type:"integer",
			required:true
		},
		status:{
			type:"integer",
			defaultsTo:1
		}
	}
	
};

