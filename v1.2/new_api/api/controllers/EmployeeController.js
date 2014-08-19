/**
 * EmployeeController
 *
 * @description :: Server-side logic for managing employees
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Converter=require("csvtojson").core.Converter;
	var fs=require("fs");	

module.exports = {
	

	// List all assets with complete details
	findAllEmployeeDetails:function(req,res){
		Employee.find()
			 .where({'status':1})
			 .exec(function(err,data){
			 	// Handle Error
				if(err)
					return res.json({status:403},403);

				// Only relevant data is returned
				var new_data = [];
					data.forEach(function(employee){
						var new_emp = employee;
							delete new_emp.createdAt;
							delete new_emp.updatedAt;	
						new_data.push(new_emp);
						console.log(new_emp);
					});
				
				return res.json(new_data);
			});
	},

	findAllEmployees:function(req,res){
		Employee.find()
			 .where({'status':1})
			 .exec(function(err,data){
			 	// Handle Error
				if(err)
					return res.json({status:403},403);

				// Only relevant data is returned
				var new_data = [];
					data.forEach(function(employee){
						var new_emp = {};
							new_emp.name = employee.name;
							new_emp.uid = employee.uid;
						new_data.push(new_emp);
						console.log(new_emp);
					});
				
				return res.json(new_data);
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
						data.uid = "EM-"+data.empid;
						newJsonArr.push(data);
					});

				Employee.create(newJsonArr)
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
	findEmpbyId:function(req,res){
		var id = req.param('id');
		Employee.findOne({uid:id})
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


		Employee.findOne({uid:id})
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

