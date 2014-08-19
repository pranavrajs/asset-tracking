
var Converter=require("csvtojson").core.Converter;								//	csvTOjson ; npm install csvtojson
var fs=require("fs");															//	FileStream

module.exports = {

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
	 _config: {}
};
