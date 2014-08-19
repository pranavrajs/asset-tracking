/**
 * AssetmapController
 *
 * @description :: Server-side logic for managing assetmaps
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	findLatestOwner:function(req,res){

		var id = req.param('id');
		Assetmap.findOne({asid:id})
				.where({status:1})
				.sort('id DESC')
				.exec(function(err,data){
					if(err)
						return res.json({status:404},404);
					if(data === undefined)
						return res.json({notDefined:true});
					else
						return res.json({notDefined:false,data:data});
				});

	},

	findAllAssetMaps:function(req,res){
		
		Assetmap.find()
			 .where({status:1})
			 .exec(function(err,data){
			 	console.log(err);
				if(err)
					return res.json({status:404},404);
				if(data === undefined)
						return res.json({notDefined:true});
					else
						return res.json({notDefined:false,data:data});
			});
	},


	findMapbyEmp:function(req,res){

		var id = req.param('id');
		Assetmap.find({empid:id})
				.where({status:1})
				.sort('id DESC')
				.exec(function(err,data){
					if(err)
						return res.json({status:404},404);
					if(data === undefined)
						return res.json({notDefined:true});
					else
						return res.json({notDefined:false,data:data});
				});

	},

	findMapbyAsset:function(req,res){

		var id = req.param('id');
		Assetmap.find({asid:id})
				.where({status:1})
				.sort('id DESC')
				.exec(function(err,data){
					if(err)
						return res.json({status:404},404);
					if(data === undefined)
						return res.json({notDefined:true});
					else
						return res.json({notDefined:false,data:data});
				});

	}
};

