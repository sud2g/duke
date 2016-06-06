var bookstoreRoutes = angular.module("bookstoreRoutes", ["ngRoute"])
bookstoreRoutes.config(function($routeProvider){
		$routeProvider
			.when("/",{
				templateUrl : "bookList-res.html",
				controller : "bookListController"
			})
			.when("/:id",{
				templateUrl : "bookDetail.html",
				controller : "bookDetailController"
			})
			.otherwise({
				redirectTo:"/"
			});
	});