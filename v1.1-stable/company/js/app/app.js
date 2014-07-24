var assetApp = angular.module('assetApp', ['ui.bootstrap','ngRoute']);

assetApp.service('alertService', function() {
        return {
            addAlert: function(arr,data) {
				arr.push(data);
            },
            removeAlert: function($scope) {
				$scope.alerts=[];
            }
        };
});

	/*
		
		urlService - returns absolute url value 
		Configure this url for proper functioning of Angular App

	*/
assetApp.factory('urlFactory', ['$http', function($http) {

    var urlBase = 'http://localhost:1337';
    var url = {};

    url.getAllAssets = function () {
        return $http.get(urlBase+'/asset/findAllAssets');
    };

   
    url.getEmpbyId = function (empid) {
        return $http.post(urlBase+'/employee/findEmpbyId/'+empid);
    };

    url.findAssetbyId = function (assetid) {
        return $http.post(urlBase + '/asset/findAssetbyId/'+assetid);
    };
 	
 	url.findLatestOwner = function (assetid) {
        return $http.post(urlBase + '/assetmap/findLatestOwner/'+assetid);
    };

 	url.findEmpbyId = function (empid) {
        return $http.post(urlBase + '/employee/findEmpbyId/'+empid);
    };

 	url.findMapbyEmp = function (empid) {
        return $http.post(urlBase + '/assetmap/findMapbyEmp/'+empid);
    };

    url.findAssetbyId = function(asid)
    {
		return $http.post(urlBase + '/asset/findAssetbyId/' +asid);
	};
	url.findCheckoutbyRefid = function(refid)
	{
		return $http.post(urlBase + '/checkout/findbyRefid/' +refid);
	};
	url.addCheckout = function(refid)
	{
		return $http.post(urlBase + '/checkout/addcheckout/' +refid);		
	}
    return url;
}]);

	/*
		$routeProvider - UI routing is done here
	*/ 

assetApp.config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/add-asset',{
							templateUrl:'add-asset.html',
							controller:'AddAssetController'
				    })
					.when('/map-asset',{
							templateUrl:'map-asset.html',
							controller:'MapAssetController'
					})
					.when('/view-asset-details',{
							templateUrl:'view-asset-details.html',
							controller:'ViewAssetDetailsController'
					})
					.when('/ownership-history',{
							templateUrl:'ownership.html',
							controller:'OwnHistController'
					})
					.when('/list-all-assets',{
							templateUrl:'list-all-assets.html',
							controller:'ListAssetController'
			   		})
				   .when('/list-all-employees',{
							templateUrl:'list-all-employee.html',
							controller:'ListEmpController'
			   		})
				   .when('/movement-history',{
							templateUrl:'movement-history.html',
							controller:'MovementHistoryController'
			   		})
				   .when('/asset-details/:assetid',{
							templateUrl:'asset-details.html',
							controller:'AssetDetailsController'
					})
				   .when('/remove-asset',{
							templateUrl:'remove-asset.html',
							controller:'RemoveAssetController'
					})
				   .when('/import-csv',{
							templateUrl:'import-csv.html',
							controller:'ImportCsvController'
					})
				   .when('/scan-screen',{
							templateUrl:'scanning-screen.html',
							controller:'ScanningScreenController'
					})
					.otherwise({
							redirectTo:'/scan-screen'
					});
}]);

assetApp.controller('ListAssetController',['$scope','urlFactory',function($scope,urlFactory){
	$scope.assetList=[];
	urlFactory.getAllAssets()
		 .success(function(data){
		 	$scope.assetList=data;
		 });
}]);
assetApp.controller('ScanScreenController',function($scope,$location,urlFactory,$log){

	$scope.submitted = false;
	$scope.dataSearching = false;
	$scope.empData = {};
	$scope.error=false;

	$scope.changeView = function(){
		$scope.dataSearching = true;
		$scope.submitted = true;
		urlFactory.getEmpbyId($scope.tag)
			 .success(function(empData){
				 		$scope.dataSearching = false;
					 	$log.info(empData);
					 	if(empData.notDefined)
					 	{
					 		$scope.error = true;	
					 		return;
					 	}
					 	$scope.empData = empData.data;
					 	$scope.getUserAsset($scope.empData.empid);
			 })
			 .error(function(data, status, headers, config) {
			 	$scope.dataSearching = false;
					 	
    		 });
    };
   	
    $scope.assetSubmitted = false;
	$scope.assetdataSearch = false;
	$scope.assetData = {};
	$scope.assetError=false;
	$scope.errNotOwner = false;

	$scope.assetChangeView = function(){
		$scope.assetDataSearch = true;
		$scope.assetSubmitted = true;
		if($scope.assetDataEmp.indexOf($scope.assettag)==-1)
		{
			$scope.assetDataSearch = false;
			$scope.errNotOwner = true;
		}
    	$scope.addExplanation = function(){
			$scope.expAdd = true;
			$scope.expSubmitted = true;
			$log.info($scope.assettag +""	 +$scope.explnot);
			$scope.explData = '{ "notes" : "'+ $scope.expData.explnot + '"}';
			$http.post("http://localhost:1337/expnotes/create",JSON.parse($scope.explData))
			.success(function(empData){
			 	$log.info(empData);
	    		$scope.expAdd = false;
				$scope.assetDataSearch = false;
				$scope.assetSubmitted = false;
				$scope.assettag = "";
				$scope.expSubmitted = false;		
			});
    	};

    };

    
    $scope.assetDataEmp =[];
    $scope.getUserAsset = function(id){
    	$http.post("http://localhost:1337/assetmap/findMapbyEmp/"+id)
				 .success(function(empData){
				 	 	$log.info(empData);
    					empData.forEach(function(dataItem){
					
		 					$http.get("http://localhost:1337/asset/findAssetbyId/"+dataItem.asid)
		 				 		.success(function(assetData){
		 			 				dataItem.assetname = assetData.name;
		 			 			});
				
		 				});
		 				$scope.assetDataEmp =empData;					
				 });
    }
});

var ModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.items = ["item1","item2"];
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

assetApp.controller('ScanningScreenController',function(urlFactory,$modal,$scope,$log){

	$scope.alerts = [
    	{ type: 'danger', msg: 'Employee / Asset not found . Try submitting again... :( ' },
	];

	$scope.closeAlert = function(index) {
    	$scope.submitted = false;
    	$scope.dataSearch = false;	
    	$scope.error = false;
    	$scope.tag ="";
  	};
	/*
		Submitted true when form is submitted 
	*/ 
		$scope.status = "";
		$scope.icon = "";
		$scope.submitted = false;
		$scope.dataSearch = false;
		$scope.clicked = false;	
		$scope.searchCheckout = false;
	/*
		Error true when the user / asset not found 
	*/	
		$scope.checkout = ["Checkin","Checkout"];
		$scope.getCheckoutHistory = function(data)
		{
			if($scope.clicked == false){
				$scope.clicked = true;
				urlFactory.findCheckoutbyRefid($scope.tag)
						  .success(function(data){

								$scope.searchCheckout = false;
								$log.info(data);
								$scope.searchCheckoutdata = data.data;
						  })
						  .error(function(err){

								$scope.searchCheckout = false;
						  });

			}

		};
		
		$scope.open = function () {

		    var modalInstance = $modal.open({
		      templateUrl: 'myModalContent.html',
		      controller:ModalInstanceCtrl,
		      resolve: {
		        items: function () {
		          return $scope.items;
		        }
		      }
		    });

		    modalInstance.result.then(function (selectedItem) {
		      $scope.selected = selectedItem;
		    }, function () {
		      $log.info('Modal dismissed at: ' + new Date());
		    });
		};

		$scope.submitNFCdata = function()
		{
			$scope.submitted = true;
			$scope.dataSearch = true;

			/*
				

				Search employee Data ... 

			*/ 
			
			var res = $scope.tag.split("-");

			$scope.tag = res[1];
			urlFactory.getEmpbyId($scope.tag)
				 .success(function(empData){
					 		
						 	$log.info(empData);
						 	/*
								No Employee found ... If so search for Asset
						 	*/
						 	if(empData.notDefined)
						 	{
						 		//Searh for Asset
						 		urlFactory.findAssetbyId($scope.tag)
			 				 		.success(function(assetData){
			 				 			$log.info(assetData);
			 				 			
			 				 			
			 				 			//If no Asset then set error flag 
			 				 			if(assetData.notDefined)
			 				 			{
			 				 				$scope.dataSearch = false;
			 				 				$scope.error = true;
			 				 				return;
			 				 			}
			 				 			//else search for the owner 
			 				 			urlFactory.findLatestOwner(assetData.data.tag)
			 				 					  .success(function(ownerData){

			 				 							$log.info(ownerData);
			 				 							// If owner not found show the tab NO OWNER FOUND 
			 				 							if(ownerData.notDefined)
			 				 							{
			 				 								$scope.OwnerNotFoundError = true;
			 				 								return;
			 				 							}
			 				 							//else Search for the employee details  
			 				 							urlFactory.findEmpbyId(ownerData.data.empid)
			 				 									  .success(function(empownerData){

							 				 							$log.info(empownerData);
							 				 							// If owner not found show the tab NO OWNER FOUND 
							 				 							if(empownerData.notDefined)
							 				 							{
							 				 								$scope.OwnerNotFoundError = true;
							 				 								return;
							 				 							}
							 				 							$scope.empData = empownerData.data;
			 				 									  });

			 				 							// and search for his/her assets .. 
			 				 					/*
			 				 							urlFactory.findMapbyEmp(ownerData.data.empid)
			 				 									  .success(function(assetDataEmp){

							 				 							$log.info(assetDataEmp);
							 				 							// If no asset found  
							 				 							if(assetDataEmp.notDefined)
							 				 							{
							 				 								$scope.noAssetFound = true;
							 				 								return;
							 				 							}

							 				 							assetDataEmp.data.forEach(function(dataItem){
																			
																			urlFactory.findAssetbyId(dataItem.asid)					
														 				 		.success(function(assetData){
														 			 				dataItem.assetname = assetData.data.name;
														 			 			});
															
														 				});
							 				 							$scope.assetDataEmp = assetDataEmp.data;
			 				 									  }); */
														$scope.searchAsset(ownerData.data.empid);

			 				 					  })
			 				 					  .error(function(data, status, headers, config) {
				 										$scope.dataSearch = false;	 	
	    		 								  });
			 				 			$scope.dataSearch = false;
			 				 			$scope.searchData = assetData.data;

			 			 			})
			 			 			.error(function(data, status, headers, config) {
				 						$scope.dataSearch = false;	 	
	    		 					});
			 			 			urlFactory.addCheckout($scope.tag)
									  .success(function(data){

									  		$log.info("CHECKOUT/IN - "+data);
									  		
									  		if(data.status ==1){
									  			$scope.icon ="fa fa-sign-out";
									  			$scope.status ="Checkout";
									  		}
									  		else{

									  			$scope.icon ="fa fa-sign-in";
									  			$scope.status = "Checkin";
									  		}
									  });
						 		return;
						 	}
						 	$scope.dataSearch = false;
						 	$scope.searchData = empData.data;
						 	$scope.empData = $scope.searchData;
							$scope.searchAsset($scope.empData.empid);
							
							urlFactory.addCheckout($scope.tag)
									  .success(function(data){

									  		$log.info("CHECKOUT/IN - "+data);
									  		
									  		if(data.status ==1){
									  			$scope.icon ="fa fa-sign-out";
									  			$scope.status ="Checkout";
									  		}
									  		else{

									  			$scope.icon ="fa fa-sign-in";
									  			$scope.status = "Checkin";
									  		}
									  });
				 })
				 .error(function(data, status, headers, config) {
				 	$scope.dataSearch = false;	 	
	    		 });
		};


		$scope.searchAsset = function(empid){
			urlFactory.findMapbyEmp(empid)
					  .success(function(assetDataEmp){

							$log.info(assetDataEmp);
							// If owner not found show the tab NO OWNER FOUND 
							if(assetDataEmp.notDefined)
							{
								$scope.OwnerNotFoundError = true;
								return;
							}

							assetDataEmp.data.forEach(function(dataItem){
																			
								urlFactory.findAssetbyId(dataItem.asid)					
							 		.success(function(assetData){
						 				dataItem.assetname = assetData.data.name;
						 			});
															
							});
							$scope.assetDataEmp = assetDataEmp.data;
			 		  });
		};
});
assetApp.controller('OwnHistController',function($scope,urlFactory,$http,$log){
	/*
		
	*/

	$scope.assetSelected=0;
	
	/*

		assetList - shows the assets in Dropwdown in UI
		HTTP GET to API to get the list of ASSETS

	*/
	$scope.assetList=[];																			
	urlFactory.getAllAssets()												
		 .success(function(data){
		 	$scope.assetList=data;
		 });


	/*
	
		mapList - shows the asset to employee mappings
		HTTP GET to API to get the list of Maps
				returns a jsonArray having Employee Id and Asset Id

	*/

	$scope.mapList = [];
	$scope.empData = [];
	$scope.assetData = []
	$scope.getLatestOwner = function(req,res){

	};
	$scope.getLogAssetFn = function(asset){
	
	/*
		
		Initial Call have no parameter asset => List all asset 
		If Asset is defined GET details for asset from findMapbyAsset

	*/	
		if(asset === undefined)
		{
			url = '/assetmap/findAllAssetMaps';
		}
		else
		{
			$scope.assetSelected=1;
			url = '/assetmap/findMapbyAsset/'+asset;
			
			$http.get("http://localhost:1337/asset/findAssetbyId/"+asset)
		 				 .success(function(assetData){
		 			 		$scope.assetData = assetData;
		 			 	});


		}

		$http.get("http://localhost:1337"+url)
		 .success(function(data){
		 	$scope.empData = [];
		 	data.forEach(function(dataItem,index){
	/*
		
		For each dataItem in mapList find Employee Name and Asset Name
		HTTP GET to /employee/findEmpbyId/:employeeId 
		HTTP GET to /asset/findAssetbyId/:assetTag

	*/
		 		$http.get("http://localhost:1337/employee/findEmpbyId/"+dataItem.empid)
		 			 .success(function(empData){

		 			 	empData = empData.data;
		 			 	if(!index)
		 			 		$scope.empData = empData;

		 			 	dataItem.empname = empData.name;
		 			 	$log.info(dataItem.empid);
		 			 	$log.info(empData.name);
		 			 });
		 	
		 			$http.get("http://localhost:1337/asset/findAssetbyId/"+dataItem.asid)
		 				 .success(function(assetData){
		 			 		dataItem.assetname = assetData.name;
		 			 	});
				
		 	});
		 	$scope.mapList=data;

		 	// if(asset != '/')
	 		// 	$scope.$digest();
		 });
	};
	$scope.getLogAssetFn();


});

assetApp.controller('ListEmpController',function($scope,$http,$log){
	$scope.empList=[];
	$http.get("http://localhost:1337/employee/findAllEmployees")
		 .success(function(data){
		 	$scope.empList=data;
		 	$log.info($scope.empList);
		 });
});

assetApp.controller('RemoveAssetController',['$scope','$http','$log','alertService',function($scope,$http,$log,alertService){
	$scope.alerts = [];

	$scope.assetList=[];
	$scope.UpdateList = function(){
		$http.get("http://localhost:1337/asset/findAllAssets")
			 .success(function(data){
			 	$scope.assetList=data;
			 });
	};
	$scope.UpdateList();
	$scope.removeAlert=function()
	{
		alertService.removeAlert($scope);
	}
	$scope.removeFn = function(id) {
		if(id===undefined)
		{
	 		if($scope.alerts.length===0)	
		 		alertService.addAlert($scope.alerts,JSON.parse('{"type":"danger","msg":"No Value Found"}'));
			return;
		}
		$scope.removeAlert();
		id=parseInt(id);
		$http.post("http://localhost:1337/asset/deleteAsset/",{"id" : id})
		 .success(function(data){
		 	$log.info(data);
		 	$scope.UpdateList();
		  })
		 .error(function(data){
		 		$log.warn(data);
		 		if($scope.alerts.length===0)	
			 		alertService.addAlert($scope.alerts,JSON.parse('{"type":"danger","msg":"Error ! User not found"}'));
		 });

	};
	
}]);

assetApp.controller('AddAssetController',function($scope,$http,$log){
	$scope.assetForm={};
	$scope.err = 0;
	$scope.sendData=function()
	{
		$http.post("http://localhost:1337/asset/create",$scope.assetForm)
			 .success(function(data){
				 	$log.info("Success");
				 	$scope.assetForm={};
			 });
	};
});
assetApp.controller('MapAssetController',function($scope,$http,$log){
	$scope.assetList=[];
	$http.get("http://localhost:1337/asset/findAllAssets")
		 .success(function(data){
		 	$scope.assetList=data;
		 });

	$scope.empList=[];
	$http.get("http://localhost:1337/employee/findAllEmployees")
		 .success(function(data){
		 	$scope.empList=data;
		 	$log.info($scope.empList);
		 });		 
	$scope.sendData=function()
	{
		$http.post("http://localhost:1337/assetmap/create",$scope.mapForm)
			 .success(function(data){
				 	$log.info("Success");
				 	$scope.mapForm={};
			 });

	};
});

assetApp.controller('MovementHistoryController',function($scope){

});
assetApp.controller('AssetDetailsController',['$routeParams','$scope','$location','$resource','$log',function($scope,$routeParams,$log,$location, $resource){
	$scope.assetid = $routeParams.assetid;
	$log.info($routeParams.assetid);

}]);