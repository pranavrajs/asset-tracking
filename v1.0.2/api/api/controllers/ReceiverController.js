/**
 * ReceiverController
 *
 * @description :: Server-side logic for managing receivers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	
	searchRRbyFid:function(req,res){

		var id = req.param('id');
		id = parseInt(id);
		console.log(id);
		Receiver.query("SELECT name,id FROM receiver WHERE zone IN (SELECT id FROM zone WHERE floor ="+id+")",function(err,data){
					if(err)
						return res.json({"status":404},404);
					return res.json(data);
				});
				
	},
	searchRRbyZid:function(req,res){

		var id = req.param('id');
		id = parseInt(id);
		console.log(id);
		Receiver.query("SELECT name,id FROM receiver WHERE zone = "+id+"",function(err,data){
					console.log(data);
					if(err)
						return res.json({"status":404},404);
					return res.json(data);
				});
				
	}			
};

