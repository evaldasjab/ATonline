

/* AngularJS service module for EvoApp */
/* Generated from "http://10.211.55.3:52628/Client/AngularJS" on 2015/10/26 17:58:08 */

_evoApp_services_url = 'http://10.211.55.3:52628';
_evoApp_services_postContentTransform = function(data) { return angular.toJson(data); };

angular

    .module('evoApp.services', [])

    .factory('cueMappingsService', ['$http', function($http) {

        function CueMappingsService() {

            // <a href="http://10.211.55.3:52628//Help/Api/GET-api-CueMappings">Help for getCueMapping</a>
            this.getCueMapping = function () {
                return $http({
                    method: 'GET',
                    url: _evoApp_services_url + '/api/CueMappings',
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/GET-api-CueMappings-id">Help for getCueMapping2</a>
            this.getCueMapping2 = function (id) {
                return $http({
                    method: 'GET',
                    url: _evoApp_services_url + '/api/CueMappings/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/PUT-api-CueMappings-id">Help for putCueMapping</a>
            this.putCueMapping = function (id, cueMapping) {
                return $http({
                    method: 'PUT',
                    url: _evoApp_services_url + '/api/CueMappings/'+encodeURIComponent(id)+'',
                    data: _evoApp_services_postContentTransform(cueMapping),
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/POST-api-CueMappings">Help for postCueMapping</a>
            this.postCueMapping = function (cueMapping) {
                return $http({
                    method: 'POST',
                    url: _evoApp_services_url + '/api/CueMappings',
                    data: _evoApp_services_postContentTransform(cueMapping),
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/DELETE-api-CueMappings-id">Help for deleteCueMapping</a>
            this.deleteCueMapping = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _evoApp_services_url + '/api/CueMappings/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new CueMappingsService();
    }])

    .factory('datasetFullsService', ['$http', function($http) {

        function DatasetFullsService() {

            // <a href="http://10.211.55.3:52628//Help/Api/GET-api-datasetfulls-datasetid-dataId">Help for getDatasetFullsByDatasetId</a>
            this.getDatasetFullsByDatasetId = function (dataId) {
                return $http({
                    method: 'GET',
                    url: _evoApp_services_url + '/api/datasetfulls/datasetid/'+encodeURIComponent(dataId)+'',
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/GET-api-DatasetFulls">Help for getDatasetFull</a>
            this.getDatasetFull = function () {
                return $http({
                    method: 'GET',
                    url: _evoApp_services_url + '/api/DatasetFulls',
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/GET-api-DatasetFulls-id">Help for getDatasetFull2</a>
            this.getDatasetFull2 = function (id) {
                return $http({
                    method: 'GET',
                    url: _evoApp_services_url + '/api/DatasetFulls/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/PUT-api-DatasetFulls-id">Help for putDatasetFull</a>
            this.putDatasetFull = function (id, datasetFull) {
                return $http({
                    method: 'PUT',
                    url: _evoApp_services_url + '/api/DatasetFulls/'+encodeURIComponent(id)+'',
                    data: _evoApp_services_postContentTransform(datasetFull),
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/POST-api-DatasetFulls">Help for postDatasetFull</a>
            this.postDatasetFull = function (datasetFull) {
                return $http({
                    method: 'POST',
                    url: _evoApp_services_url + '/api/DatasetFulls',
                    data: _evoApp_services_postContentTransform(datasetFull),
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/DELETE-api-DatasetFulls-id">Help for deleteDatasetFull</a>
            this.deleteDatasetFull = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _evoApp_services_url + '/api/DatasetFulls/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new DatasetFullsService();
    }])

    .factory('datasetInfoesService', ['$http', function($http) {



        function DatasetInfoesService() {



            // <a href="http://10.211.55.3:52628//Help/Api/GET-api-DatasetInfoes">Help for getDatasetInfo</a>
            this.getDatasetInfo = function () {
                return $http({
                    method: 'GET',
                    url: _evoApp_services_url + '/api/DatasetInfoes',
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/GET-api-DatasetInfoes-id">Help for getDatasetInfo2</a>
            this.getDatasetInfo2 = function (id) {
                return $http({
                    method: 'GET',
                    url: _evoApp_services_url + '/api/DatasetInfoes/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/PUT-api-DatasetInfoes-id">Help for putDatasetInfo</a>
            this.putDatasetInfo = function (id, datasetInfo) {
                return $http({
                    method: 'PUT',
                    url: _evoApp_services_url + '/api/DatasetInfoes/'+encodeURIComponent(id)+'',
                    data: _evoApp_services_postContentTransform(datasetInfo),
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/POST-api-DatasetInfoes">Help for postDatasetInfo</a>
            this.postDatasetInfo = function (datasetInfo) {
                return $http({
                    method: 'POST',
                    url: _evoApp_services_url + '/api/DatasetInfoes',
                    data: _evoApp_services_postContentTransform(datasetInfo),
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/DELETE-api-DatasetInfoes-id">Help for deleteDatasetInfo</a>
            this.deleteDatasetInfo = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _evoApp_services_url + '/api/DatasetInfoes/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new DatasetInfoesService();
    }])

    .factory('heuristicInfoesService', ['$http', function($http) {

        function HeuristicInfoesService() {

            // <a href="http://10.211.55.3:52628//Help/Api/GET-api-HeuristicInfoes">Help for getHeuristicInfo</a>
            this.getHeuristicInfo = function () {
                return $http({
                    method: 'GET',
                    url: _evoApp_services_url + '/api/HeuristicInfoes',
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/GET-api-HeuristicInfoes-id">Help for getHeuristicInfo2</a>
            this.getHeuristicInfo2 = function (id) {
                return $http({
                    method: 'GET',
                    url: _evoApp_services_url + '/api/HeuristicInfoes/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/PUT-api-HeuristicInfoes-id">Help for putHeuristicInfo</a>
            this.putHeuristicInfo = function (id, heuristicInfo) {
                return $http({
                    method: 'PUT',
                    url: _evoApp_services_url + '/api/HeuristicInfoes/'+encodeURIComponent(id)+'',
                    data: _evoApp_services_postContentTransform(heuristicInfo),
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/POST-api-HeuristicInfoes">Help for postHeuristicInfo</a>
            this.postHeuristicInfo = function (heuristicInfo) {
                return $http({
                    method: 'POST',
                    url: _evoApp_services_url + '/api/HeuristicInfoes',
                    data: _evoApp_services_postContentTransform(heuristicInfo),
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/DELETE-api-HeuristicInfoes-id">Help for deleteHeuristicInfo</a>
            this.deleteHeuristicInfo = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _evoApp_services_url + '/api/HeuristicInfoes/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new HeuristicInfoesService();
    }])

    .factory('heuristicStructuresService', ['$http', function($http) {

        function HeuristicStructuresService() {

            // <a href="http://10.211.55.3:52628//Help/Api/GET-api-HeuristicStructures">Help for getHeuristicStructure</a>
            this.getHeuristicStructure = function () {
                return $http({
                    method: 'GET',
                    url: _evoApp_services_url + '/api/HeuristicStructures',
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/GET-api-HeuristicStructures-id">Help for getHeuristicStructure2</a>
            this.getHeuristicStructure2 = function (id) {
                return $http({
                    method: 'GET',
                    url: _evoApp_services_url + '/api/HeuristicStructures/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/PUT-api-HeuristicStructures-id">Help for putHeuristicStructure</a>
            this.putHeuristicStructure = function (id, heuristicStructure) {
                return $http({
                    method: 'PUT',
                    url: _evoApp_services_url + '/api/HeuristicStructures/'+encodeURIComponent(id)+'',
                    data: _evoApp_services_postContentTransform(heuristicStructure),
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/POST-api-HeuristicStructures">Help for postHeuristicStructure</a>
            this.postHeuristicStructure = function (heuristicStructure) {
                return $http({
                    method: 'POST',
                    url: _evoApp_services_url + '/api/HeuristicStructures',
                    data: _evoApp_services_postContentTransform(heuristicStructure),
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/DELETE-api-HeuristicStructures-id">Help for deleteHeuristicStructure</a>
            this.deleteHeuristicStructure = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _evoApp_services_url + '/api/HeuristicStructures/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new HeuristicStructuresService();
    }])

    .factory('usersService', ['$http', function($http) {

        function UsersService() {

            // <a href="http://10.211.55.3:52628//Help/Api/GET-api-Users">Help for getUsers</a>
            this.getUsers = function () {
                return $http({
                    method: 'GET',
                    url: _evoApp_services_url + '/api/Users',
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/GET-api-Users-id">Help for getUsers2</a>
            this.getUsers2 = function (id) {
                return $http({
                    method: 'GET',
                    url: _evoApp_services_url + '/api/Users/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/PUT-api-Users-id">Help for putUsers</a>
            this.putUsers = function (id, users) {
                return $http({
                    method: 'PUT',
                    url: _evoApp_services_url + '/api/Users/'+encodeURIComponent(id)+'',
                    data: _evoApp_services_postContentTransform(users),
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/POST-api-Users">Help for postUsers</a>
            this.postUsers = function (users) {
                return $http({
                    method: 'POST',
                    url: _evoApp_services_url + '/api/Users',
                    data: _evoApp_services_postContentTransform(users),
                    cache: false
                });
            };

            // <a href="http://10.211.55.3:52628//Help/Api/DELETE-api-Users-id">Help for deleteUsers</a>
            this.deleteUsers = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _evoApp_services_url + '/api/Users/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new UsersService();
    }])
;
