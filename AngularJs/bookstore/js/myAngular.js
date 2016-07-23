var myModule = angular.module('MAngular', []);
myModule.controller('mAngular', ['$scope',
	function MAngular($scope){
		$scope.name={text:'Zhang'};
	}
])