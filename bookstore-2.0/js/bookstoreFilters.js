var bookstoreFilters = angular.module("bookstoreFilters", []);
bookstoreFilters
		.filter("checkStatusFilter",function(){
			return function(status){
				return status==true?"正常出售":"暂无库存";
			};
		})
		.filter("getStatusLabelFilter",function(){
			return function(status){
				return status==true?"label-success":"label-danger";
			};
		});