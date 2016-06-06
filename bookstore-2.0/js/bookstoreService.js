var bookstoreService = angular.module("bookstoreService", ["ngResource"]);
bookstoreService.factory('bookstoreService',function($resource){
	return $resource("db/:id.json");
});