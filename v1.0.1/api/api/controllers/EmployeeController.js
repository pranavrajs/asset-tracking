/**
 * EmployeeController
 *
 * @description :: Server-side logic for managing employees
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	
	findAllEmployees:function(req,res){
		
		Employee.find()
			 .where({status:1})
			 .exec(function(err,data){
			 	console.log(err);
				if(err)
					return res.json({status:404},404);
				return res.json(data);
			});
	},

	findEmpbyId:function(req,res){
		var id = req.param('id');
		Employee.findOne({empid:id})
				.exec(function(err,data){	
					if(err)
						return res.json({status:404},404);
					console.log(data);
					if(data === undefined)
						return res.json({});
					else
						return res.json(data);
					});
	}
};

