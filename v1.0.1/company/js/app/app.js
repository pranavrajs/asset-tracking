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
assetApp.service('urlService', function() {
        return {
            globalUrl: function() {
				return "http://localhost:1337/";
            }
        };
});

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
					.otherwise({
							redirectTo:'/add-asset'
					});
	
}]);

assetApp.controller('ListAssetController',function($scope,$http){
	$scope.assetList=[];
	$http.get("http://localhost:1337/asset/findAllAssets")
		 .success(function(data){
		 	$scope.assetList=data;
		 });
});
assetApp.controller('OwnHistController',function($scope,$http,$log){
	/*
		
	*/

	$scope.assetSelected=0;
	
	/*

		assetList - shows the assets in Dropwdown in UI
		HTTP GET to API to get the list of ASSETS

	*/
	$scope.assetList=[];																			
	$http.get("http://localhost:1337/asset/findAllAssets")														
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

		 	data.forEach(function(dataItem,index){
	/*
		
		For each dataItem in mapList find Employee Name and Asset Name
		HTTP GET to /employee/findEmpbyId/:employeeId 
		HTTP GET to /asset/findAssetbyId/:assetTag

	*/
		 		$http.get("http://localhost:1337/employee/findEmpbyId/"+dataItem.empid)
		 			 .success(function(empData){
		 			 	if(!index)
		 			 		$scope.empData = empData;

		 			 	dataItem.empname = empData.name;
		 			 	$log.info(dataItem.employee);
		 			 	$log.info(empData.name);
		 			 });
		 		if(!$scope.assetSelected)
		 		{	
		 			$http.get("http://localhost:1337/asset/findAssetbyId/"+dataItem.asid)
		 				 .success(function(assetData){
		 			 		dataItem.assetname = assetData.name;
		 			 	});
				}
				else
					dataItem.assetname = $scope.assetData.name;		 		
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