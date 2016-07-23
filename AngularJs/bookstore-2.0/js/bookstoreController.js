var bookstoreController = angular.module("bookstoreController", []);
bookstoreController.controller("bookListController",function($scope,bookstoreService){

	$scope.books = bookstoreService.get({id:"books"});

	$scope.orderByProp = "title";
});

//获取书的详细信息 [通过 ng-resource] 
bookstoreController.controller("bookDetailController",function($scope,$routeParams,bookstoreService){
	//$scope.id = $routeParams.id;
	$scope.book = bookstoreService.get({id:$routeParams.id});

	$scope.cover = $routeParams.id;
	$scope.setCover = function(id){
		$scope.cover = id;
	}
});