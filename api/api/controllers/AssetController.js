/**
 * AssetController
 *
 * @description :: Server-side logic for managing assets
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	

	
	findAllAssets:function(req,res){
		Asset.find()
			 .where({'status':1})
			 .exec(function(err,data){
				if(err)
					return res.json({status:403},403);
				return res.json(data);
			});
	},

	findAssetbyId:function(req,res){
		var id = req.param('id');
		Asset.findOne({tag:id})
			 .exec(function(err,data){
				if(err)
					return res.json({status:403},403);
				console.log(data);
				if(data === undefined)
						return res.json({notDefined:true});
					else
						return res.json({notDefined:false,data:data});

			});
	},
	deleteAsset:function(req,res){

	var id = req.param('id');
		Asset.update({'id':id})
			 .where({status:1})
			 .exec(function(err,data){
				if(err)
					return res.json({status:403},403);
				data.status=0;
				return res.json(data);
			});	
	},	

	findAssetDetails:function(req,res){
		
		var id = req.param('id');

		Checkout.findOne({refid:id})
				.sort('id DESC')
				.then(function(data){
					if(data === undefined || data.status === 0)
					{
						Checkout.create({refid:id,status:1})
								.then(function(data){
									console.log(data)
								});
					}
					if(data.status === 1)
					{
						Checkout.create({refid:id,status:0})
								.then(function(data){
									console.log(data);
								});
					}
				});

		Assetmap.findOne({asid:id})
				.where({status:1})
				.then(function(data)
				{

					var emplData  = Employee.findOne({empid:data.empid})
										 .where({status:1})
										 .then(function(employee){
										 	return employee;
										 });

					var empAssetData = Assetmap.find({empid:data.empid})
										 		.where({status:1})
										 		.sort('id DESC')
										 		.then(function(assetEmployee){
										 							
										 			assetEmployee.forEach(function(data){

										 				Asset.findOne({asid:data.asid})
										 					 .where({status:1})
										 					 .then(function(empData){
										 					 		data.name = empData.name;
										 					 });
										 			});	

										 		}).spread(function(assetData){
										 			return assetData;
										 		});

					return [emplData,empAssetData];
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

