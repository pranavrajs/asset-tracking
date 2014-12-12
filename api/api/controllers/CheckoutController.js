/**
 * CheckoutController
 *
 * @description :: Server-side logic for managing checkouts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
		
		findbyRefId: function (req,res) {
			 
			 var id = req.param('id');
			 Checkout.find({refid:id})
			 		 .sort('id DESC')
			 		 .then(function(data){
			 		 	if(data === undefined)
			 		 		res.json({notDefined:true},403);
			 		 	else
			 		 		res.json({notDefined:false,data:data});

			 		 })
			 		 .fail(function(err){
			 		 	console.log("Err : "+err);
			 		 });
		},
		addcheckout : function(req,res){

			var id = req.param('id');

			Checkout.findOne({refid:id})
					.sort('id DESC')
					.then(function(data){
						if(data === undefined || data.status === 0)
						{
							Checkout.create({refid:id,status:1})
									.then(function(data){
										console.log(data);
										return res.json(data);
									});
						}
						if(data.status === 1)
						{
							Checkout.create({refid:id,status:0})
									.then(function(data){
										console.log(data);
										return res.json(data);
									});
						}
					});
		}
};	

