/**
 * AssetController
 *
 * @description :: Server-side logic for managing assets
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
			var Converter= require("csvtojson").core.Converter;
			var fs=require("fs");	

module.exports = {
	

	
	// List all assets --- return data consists of only Asset Name and Unique ID for Asset 
	findAllAssets:function(req,res){
		Asset.find()
			 .where({'status':1})
			 .exec(function(err,data){
			 	// Handle Error
				if(err)
					return res.json({status:403},403);

				// Only relevant data is returned
				var new_data = [];
					data.forEach(function(asset){
						var new_asset = {};
							new_asset.name = asset.name;
							new_asset.uid = asset.uid;
						new_data.push(new_asset);
						console.log(new_asset);
					});
				
				return res.json(new_data);
			});
	},

	// List all assets with complete details
	findAllAssetDetails:function(req,res){
		Asset.find()
			 .where({'status':1})
			 .exec(function(err,data){
			 	// Handle Error
				if(err)
					return res.json({status:403},403);

				// Only relevant data is returned
				var new_data = [];
					data.forEach(function(asset){
						var new_asset = asset;
							delete new_asset.createdAt;
							delete new_asset.updatedAt;	
						new_data.push(new_asset);
						console.log(new_asset);
					});
				
				return res.json(new_data);
			});
	},

	findAssetbyId:function(req,res){
		var id = req.param('id');
		Asset.findOne({uid:id})
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

	upload: function  (req, res) {
		if(req.method == 'GET')
			return res.json({'status':'GET not allowed'});						//	Call to /upload via GET is error

		var csvFile = req.file('csvFile');
		console.log(csvFile);
		// if(!csvFile)
		// 	return res.json({'status':'No file Found'})


	    csvFile.upload(function onUploadComplete (err, files) {					//	Files will be uploaded to .tmp/uploads
	    																		
	    	if (err) return res.serverError(err);								//	IF ERROR Return and send 500 error with error

	      	var csvFileName  = "./.tmp/uploads/"+files[0].filename;				
				fileStream   = fs.createReadStream(csvFileName);				
				csvConverter = new Converter({constructResult:true}); 			//	New converter instance

			csvConverter.on("end_parsed",function(jsonArr){						//	end_parsed will be emitted once parsing finished
				var newJsonArr = [];
					jsonArr.forEach(function(data){
						data.uid = "AS-"+data.asid;
						newJsonArr.push(data);
					});

				Asset.create(newJsonArr)
					 .exec(function(err,users){
						if(!err)
							console.log('ok');
						else
							return res.json({error:err.invalidAttributes});

						return res.json({'status':'Import Complete'});
				});
 
			});

			//read from file
			fileStream.pipe(csvConverter);     
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

		Assetmap.findOne({uid:id})
				.where({status:1})
				.then(function(data)
				{

					var emplData  = Employee.findOne({empid:data.empid})
										 .where({status:1})
										 .then(function(employee){
										 	return employee;
										 });

					var empAssetData = Assetmap.find({uid:data.empid})
										 		.where({status:1})
										 		.sort('id DESC')
										 		.then(function(assetEmployee){
										 			return assetEmployee;
										 		});

					return [emplData,empAssetData];
				})
				.spread(function(emplData,empAssetData){
					// console.log(empAssetData);
					//var data = '{"emp":'+JSON.stringify(emplData)+',"assets":'+JSON.stringify(empAssetData)+'}';
					
					var data = {};
						data.emp = emplData;
						data.assets = [];
							empAssetData.forEach(function(ndata){

								new_data = ndata;
								
								var new_name ="";
								new_name = Asset.findOne({uid:ndata.asid})
													 .where({status:1})
													 .exec(function(err,empData){
													 		console.log(empData);
													 		return empData;
													 });
								new_data.name = new_name;
								data.assets.push(new_data);
							});	
					res.json(data);
				})
				.fail(function(err){
					console.log(err);
					res.json({notFound:404});
				});
	}
};

