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
				.where({status:1})
				.exec(function(err,data){	
					if(err)
						return res.json({status:404},404);
					console.log(data);
					if(data === undefined)
						return res.json({notDefined:true});
					else
						return res.json({notDefined:false,data:data});
					});
	},
	findEmployeeDetails:function(req,res){
		
		var id = req.param('id');

		Checkout.findOne({refid:id})
				.sort('id DESC')
				.then(function(data){
					if(data === undefined || data.status === 0)
					{
						Checkout.create({refid:id,status:1})
								.then(function(data){
									return data;
								});
					}
					if(data.status === 1)
					{
						Checkout.create({refid:id,status:0})
								.then(function(data){
									return data;
								});
					}
				});


		Employee.findOne({empid:id})
				.where({status:1})
				.then(function(data)
				{

					var empAssetData = Assetmap.find({empid:data.empid})
										 		.where({status:1})
										 		.sort('id DESC')
										 		.then(function(assetEmployee){
										 				return assetEmployee;										 			
										 		});
					return [data,empAssetData];
				})
				.spread(function(emplData,empAssetData){
					
					console.log(emplData);
					console.log(empAssetData);
					
					var data = '{"emp":'+JSON.stringify(emplData)+',"assets":'+JSON.stringify(empAssetData)+'}';
					
					res.json(JSON.parse(data));
				})
				.fail(function(err){
					console.log(err);
					res.json({notFound:404});
				});
	}

};

