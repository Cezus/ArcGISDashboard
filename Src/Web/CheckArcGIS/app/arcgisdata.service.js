(function (angular) {
	angular.module('arcGISDashboard')
		.factory('arcgisdata', arcgisdata);

	arcgisdata.$inject = ['$http', '$q'];

	function arcgisdata($http, $q) {
		var service = {
			getData: getData
		}

		return service;

		function getData(url) {
			var layers = [];
			var tables = [];

			var layerCountPromisses = [];
			var tableCountPromisses = [];

			return $http.get(url + '?f=pjson')
				.then(getDataComplete);

			function getDataComplete(data) {
				var arcgisConfig = data.data;
				for (var i = 0; i < arcgisConfig.layers.length; i++) {
					layers.push({
						id: arcgisConfig.layers[i].id,
						name: arcgisConfig.layers[i].name
					});

					layerCountPromisses.push(getCount(url, arcgisConfig.layers[i].id));
				}

				for (var i = 0; i < arcgisConfig.tables.length; i++) {
					tables.push({
						id: arcgisConfig.tables[i].id,
						name: arcgisConfig.tables[i].name
					});

					tableCountPromisses.push(getCount(url, arcgisConfig.tables[i].id));
				}

				//return $q.all(layerCountPromisses)
				//	.then(function (allCounts) {
				//			for (var i = 0; i < layers.length; i++) {
				//				layers[i].count = allCounts.data[0][i];
				//			}

				//			for (var i = 0; i < tables.length; i++) {
				//				tables[i].count = allCounts.data[1][i];
				//			}

				//			return {
				//				layers: layers,
				//				tables: tables
				//			};
				//		});


				return $q.all([
					$q.all(layerCountPromisses),
					$q.all(tableCountPromisses)])
						.then(function (allCounts) {
							for (var i = 0; i < layers.length; i++) {
								layers[i].count = allCounts[0][i];
							}

							for (var i = 0; i < tables.length; i++) {
								tables[i].count = allCounts[1][i];
							}

							return {
								layers: layers,
								tables: tables
							};
						});
			}
		}

		function getCount(url, id) {
			return $http.get(url + '/' + id + '/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&gdbVersion=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=true&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=&resultOffset=&resultRecordCount=&f=pjson')
				.then(function (data) {
					return data.data.count;
				});
		}
	}
})(window.angular);