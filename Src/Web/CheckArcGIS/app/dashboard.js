(function (angular) {
    angular.module('arcGISDashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$q', 'arcgisdata'];

    function DashboardController($scope, $q, arcgisdata) {
        var vm = this;

        vm.layers = [];
        vm.tables = [];
        vm.changeService = changeService;
        vm.refreshData = refreshData;

        // Enter your Map- or FeatureServer URL(s) (e.g. http://domain:6080/arcgis/rest/services/[Folder]/[Service]/FeatureServer)
        vm.services = [{
            name: 'Dutch railway',
            url: 'http://mapservices.prorail.nl/arcgis/rest/services/BBK_spoorobjecten_001/MapServer'
        }];

        var workingUrl = vm.services[0].url;

        activate();

        function activate() {
            fillData();
        }

        function changeService(url) {
            workingUrl = url;

            fillData();
        }

        function refreshData() {
            fillData();
        }

        function fillData() {
            vm.layers = [];
            vm.tables = [];

            arcgisdata.getData(workingUrl).then(function (data) {
                vm.layers = data.layers;
                vm.tables = data.tables;

                for (var i = 0; i < vm.layers.length; i++) {
                    vm.layers[i].urls = {
                        definition: workingUrl + '/' + vm.layers[i].id,
                        listAll: workingUrl + '/' + vm.layers[i].id + '/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&gdbVersion=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=&resultOffset=&resultRecordCount=&f=html'
                    }
                }

                for (var i = 0; i < vm.tables.length; i++) {
                    vm.tables[i].urls = {
                        definition: workingUrl + '/' + vm.tables[i].id,
                        listAll: workingUrl + '/' + vm.tables[i].id + '/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&gdbVersion=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=&resultOffset=&resultRecordCount=&f=html'
                    }
                }
            });
        }
    }
})(window.angular);