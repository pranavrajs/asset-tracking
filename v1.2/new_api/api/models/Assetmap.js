/**
* Assetmap.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		
		asid:{
			type:"string",
			required:true
		},
		empid:{
			type:"string",
			required:true
		},
		notes:
		{
			type:"string"
		},
		status:{
			type:"integer",
			defaultsTo:1
		}

	}
};

