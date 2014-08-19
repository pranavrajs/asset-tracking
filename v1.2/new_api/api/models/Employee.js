/**
* Employee.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	adapter:'mysqlServer',
	schema: false,
	beforeCreate: function(values, next) {
	  next();
	},
  	attributes: {
  		name:{
  			type:"string",
  			required:true,
		    minLength: 2
  		},
  		phone:{
  			type:"string",
  			required:true
  		},
  		email:{
  			type:"email",
  			required:"true",
  			unique: true
  		},
  		desig:{
  			type:"string",
  			required:"true"
  		},
  		empid:{
  			type:"string",
  			required:"true",
  			unique: true
  		},
  		uid:{
  			type:"string",
  			required:true,
        unique:true
  		},
      url:{
        type:"string",
      },
  		status:{
			type:"integer",
			defaultsTo:1
		}
	
  	}
};

