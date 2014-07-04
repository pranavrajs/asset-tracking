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
					return res.json({status:404},404);
				return res.json(data);
			});
	},

	findAssetbyId:function(req,res){
		var id = req.param('id');
		Asset.findOne({tag:id})
			 .exec(function(err,data){
				if(err)
					return res.json({status:404},404);
				return res.json(data);
			});
	},
	deleteAsset:function(req,res){

		var id = req.param('id');
		Asset.update({'id':id})
			 .where({status:1})
			 .exec(function(err,data){
				if(err)
					return res.json({status:404},404);
				data.status=0;
				return res.json(data);
			});	
	}	


};

