/**
* Asset.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	adapter:'mysqlServer',
	attributes: {

  		uid:{
  			type:"string",
  			required:true,
        unique:true
  		},
  		name:{
  			type:"string",
  			required:true
  		},
  		serial:{
  			type:"string",
  			required:true,
        unique:true
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

      status:{
        type:"integer",
        defaultsTo:1
		  },

      toJSON: function() {
            var obj = this.toObject();
            delete obj.createdAt;
            delete obj.updatedAt;
            return obj;
      }
  }
};

