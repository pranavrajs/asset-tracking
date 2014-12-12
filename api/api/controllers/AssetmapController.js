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
				.sort('id DESC')
				.exec(function(err,data){
					if(err)
						return res.json({status:404},404);
					return res.json(data);
				});

	},

	findMapbyAsset:function(req,res){

		var id = req.param('id');
		Assetmap.find({asid:id})
				.sort('id DESC')
				.exec(function(err,data){
					if(err)
						return res.json({status:404},404);
					return res.json(data);
				});

	}
};

