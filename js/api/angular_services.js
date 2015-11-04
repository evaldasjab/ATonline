/*
Client Code AngularJS
[Download client here]

Or add following line in your client:

<script src="http://localhost:62417/Client/AngularJS"></script>
This will include the following code in your application: (approx. 895 code lines)
*/

/* AngularJS service module for Api_AppName_From_WebConfig_AppSettings */
/* Generated from "http://localhost:62417/Client/AngularJS" on 2015/10/07 12:49:49 */

_api_AppName_From_WebConfig_AppSettings_services_url = 'http://10.211.55.3:62417';
//_api_AppName_From_WebConfig_AppSettings_services_url = 'http://localhost:62417';
_api_AppName_From_WebConfig_AppSettings_services_postContentTransform = function(data) { return angular.toJson(data); };

angular

    .module('api_AppName_From_WebConfig_AppSettings.services', [])

    .factory('accountService', ['$http', function($http) {

        function AccountService() {

            // <a href="http://localhost:62417//Help/Api/GET-api-Account-UserInfo">Help for getUserInfo</a>
            this.getUserInfo = function () {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Account/UserInfo',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-Account-Logout">Help for logout</a>
            this.logout = function () {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Account/Logout',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/GET-api-Account-ManageInfo_returnUrl_generateState">Help for getManageInfo</a>
            this.getManageInfo = function (returnUrl, generateState) {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Account/ManageInfo?returnUrl='+encodeURIComponent(returnUrl)+'&generateState='+encodeURIComponent(generateState)+'',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-Account-ChangePassword">Help for changePassword</a>
            this.changePassword = function (model) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Account/ChangePassword',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(model),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-Account-SetPassword">Help for setPassword</a>
            this.setPassword = function (model) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Account/SetPassword',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(model),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-Account-AddExternalLogin">Help for addExternalLogin</a>
            this.addExternalLogin = function (model) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Account/AddExternalLogin',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(model),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-Account-RemoveLogin">Help for removeLogin</a>
            this.removeLogin = function (model) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Account/RemoveLogin',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(model),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/GET-api-Account-ExternalLogin_provider_error">Help for getExternalLogin</a>
            this.getExternalLogin = function (provider, error) {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Account/ExternalLogin?provider='+encodeURIComponent(provider)+'&error='+encodeURIComponent(error)+'',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/GET-api-Account-ExternalLogins_returnUrl_generateState">Help for getExternalLogins</a>
            this.getExternalLogins = function (returnUrl, generateState) {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Account/ExternalLogins?returnUrl='+encodeURIComponent(returnUrl)+'&generateState='+encodeURIComponent(generateState)+'',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-Account-Register">Help for register</a>
            this.register = function (model) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Account/Register',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(model),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-Account-RegisterExternal">Help for registerExternal</a>
            this.registerExternal = function (model) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Account/RegisterExternal',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(model),
                    cache: false
                });
            };
        }

        return new AccountService();
    }])

    .factory('casesService', ['$http', function($http) {

        function CasesService() {

            // <a href="http://localhost:62417//Help/Api/GET-api-Cases">Help for getCaseSet</a>
            this.getCaseSet = function () {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Cases',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/GET-api-Cases-id">Help for getCase</a>
            this.getCase = function (id) {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Cases/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/PUT-api-Cases-id">Help for putCase</a>
            this.putCase = function (id, caseX) {
                return $http({
                    method: 'PUT',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Cases/'+encodeURIComponent(id)+'',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(caseX),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-Cases">Help for postCase</a>
            this.postCase = function (caseX) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Cases',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(caseX),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/DELETE-api-Cases-id">Help for deleteCase</a>
            this.deleteCase = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Cases/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new CasesService();
    }])

    .factory('cueInfoService', ['$http', function($http) {

        function CueInfoService() {

            // <a href="http://localhost:62417//Help/Api/GET-api-CueInfo">Help for getCueInfoSet</a>
            this.getCueInfoSet = function () {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/CueInfo',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/GET-api-CueInfo-id">Help for getCueInfo</a>
            this.getCueInfo = function (id) {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/CueInfo/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/PUT-api-CueInfo-id">Help for putCueInfo</a>
            this.putCueInfo = function (id, cueInfo) {
                return $http({
                    method: 'PUT',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/CueInfo/'+encodeURIComponent(id)+'',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(cueInfo),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-CueInfo">Help for postCueInfo</a>
            this.postCueInfo = function (cueInfo) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/CueInfo',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(cueInfo),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/DELETE-api-CueInfo-id">Help for deleteCueInfo</a>
            this.deleteCueInfo = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/CueInfo/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new CueInfoService();
    }])

    .factory('cueMappingsService', ['$http', function($http) {

        function CueMappingsService() {

            // <a href="http://localhost:62417//Help/Api/GET-api-CueMappings">Help for getCueMappingSet</a>
            this.getCueMappingSet = function () {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/CueMappings',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/GET-api-CueMappings-id">Help for getCueMapping</a>
            this.getCueMapping = function (id) {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/CueMappings/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/PUT-api-CueMappings-id">Help for putCueMapping</a>
            this.putCueMapping = function (id, cueMapping) {
                return $http({
                    method: 'PUT',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/CueMappings/'+encodeURIComponent(id)+'',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(cueMapping),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-CueMappings">Help for postCueMapping</a>
            this.postCueMapping = function (cueMapping) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/CueMappings',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(cueMapping),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/DELETE-api-CueMappings-id">Help for deleteCueMapping</a>
            this.deleteCueMapping = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/CueMappings/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new CueMappingsService();
    }])

    .factory('cuesService', ['$http', function($http) {

        function CuesService() {

            // <a href="http://localhost:62417//Help/Api/GET-api-Cues">Help for getCueSet</a>
            this.getCueSet = function () {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Cues',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/GET-api-Cues-id">Help for getCue</a>
            this.getCue = function (id) {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Cues/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/PUT-api-Cues-id">Help for putCue</a>
            this.putCue = function (id, cue) {
                return $http({
                    method: 'PUT',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Cues/'+encodeURIComponent(id)+'',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(cue),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-Cues">Help for postCue</a>
            this.postCue = function (cue) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Cues',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(cue),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/DELETE-api-Cues-id">Help for deleteCue</a>
            this.deleteCue = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Cues/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new CuesService();
    }])

    .factory('datasetInfoService', ['$http', function($http) {

        function DatasetInfoService() {

            // <a href="http://localhost:62417//Help/Api/GET-api-DatasetInfo">Help for getDatasetInfoSet</a>
            this.getDatasetInfoSet = function () {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/DatasetInfo',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/GET-api-DatasetInfo-id">Help for getDatasetInfo</a>
            this.getDatasetInfo = function (id) {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/DatasetInfo/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/PUT-api-DatasetInfo-id">Help for putDatasetInfo</a>
            this.putDatasetInfo = function (id, datasetInfo) {
                return $http({
                    method: 'PUT',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/DatasetInfo/'+encodeURIComponent(id)+'',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(datasetInfo),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-DatasetInfo">Help for postDatasetInfo</a>
            this.postDatasetInfo = function (datasetInfo) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/DatasetInfo',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(datasetInfo),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/DELETE-api-DatasetInfo-id">Help for deleteDatasetInfo</a>
            this.deleteDatasetInfo = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/DatasetInfo/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new DatasetInfoService();
    }])

    .factory('datasetsService', ['$http', function($http) {

        function DatasetsService() {

            // <a href="http://localhost:62417//Help/Api/GET-api-Datasets">Help for getDatasetSet</a>
            this.getDatasetSet = function () {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Datasets',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/GET-api-Datasets-id">Help for getDataset</a>
            this.getDataset = function (id) {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Datasets/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/PUT-api-Datasets-id">Help for putDataset</a>
            this.putDataset = function (id, dataset) {
                return $http({
                    method: 'PUT',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Datasets/'+encodeURIComponent(id)+'',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(dataset),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-Datasets">Help for postDataset</a>
            this.postDataset = function (dataset) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Datasets',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(dataset),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/DELETE-api-Datasets-id">Help for deleteDataset</a>
            this.deleteDataset = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Datasets/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new DatasetsService();
    }])

    .factory('heuristicsInfoService', ['$http', function($http) {

        function HeuristicsInfoService() {

            // <a href="http://localhost:62417//Help/Api/GET-api-HeuristicsInfo">Help for getHeuristicsInfoSet</a>
            this.getHeuristicsInfoSet = function () {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/HeuristicsInfo',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/GET-api-HeuristicsInfo-id">Help for getHeuristicsInfo</a>
            this.getHeuristicsInfo = function (id) {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/HeuristicsInfo/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/PUT-api-HeuristicsInfo-id">Help for putHeuristicsInfo</a>
            this.putHeuristicsInfo = function (id, heuristicsInfo) {
                return $http({
                    method: 'PUT',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/HeuristicsInfo/'+encodeURIComponent(id)+'',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(heuristicsInfo),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-HeuristicsInfo">Help for postHeuristicsInfo</a>
            this.postHeuristicsInfo = function (heuristicsInfo) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/HeuristicsInfo',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(heuristicsInfo),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/DELETE-api-HeuristicsInfo-id">Help for deleteHeuristicsInfo</a>
            this.deleteHeuristicsInfo = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/HeuristicsInfo/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new HeuristicsInfoService();
    }])

    .factory('heuristicsSettingsService', ['$http', function($http) {

        function HeuristicsSettingsService() {

            // <a href="http://localhost:62417//Help/Api/GET-api-HeuristicsSettings">Help for getHeuristicsSettingsSet</a>
            this.getHeuristicsSettingsSet = function () {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/HeuristicsSettings',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/GET-api-HeuristicsSettings-id">Help for getHeuristicsSettings</a>
            this.getHeuristicsSettings = function (id) {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/HeuristicsSettings/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/PUT-api-HeuristicsSettings-id">Help for putHeuristicsSettings</a>
            this.putHeuristicsSettings = function (id, heuristicsSettings) {
                return $http({
                    method: 'PUT',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/HeuristicsSettings/'+encodeURIComponent(id)+'',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(heuristicsSettings),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-HeuristicsSettings">Help for postHeuristicsSettings</a>
            this.postHeuristicsSettings = function (heuristicsSettings) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/HeuristicsSettings',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(heuristicsSettings),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/DELETE-api-HeuristicsSettings-id">Help for deleteHeuristicsSettings</a>
            this.deleteHeuristicsSettings = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/HeuristicsSettings/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new HeuristicsSettingsService();
    }])

    .factory('treeCuesService', ['$http', function($http) {

        function TreeCuesService() {

            // <a href="http://localhost:62417//Help/Api/GET-api-TreeCues">Help for getCueSet</a>
            this.getCueSet = function () {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/TreeCues',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/GET-api-TreeCues-id">Help for getTreeCue</a>
            this.getTreeCue = function (id) {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/TreeCues/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/PUT-api-TreeCues-id">Help for putTreeCue</a>
            this.putTreeCue = function (id, treeCue) {
                return $http({
                    method: 'PUT',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/TreeCues/'+encodeURIComponent(id)+'',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(treeCue),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-TreeCues">Help for postTreeCue</a>
            this.postTreeCue = function (treeCue) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/TreeCues',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(treeCue),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/DELETE-api-TreeCues-id">Help for deleteTreeCue</a>
            this.deleteTreeCue = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/TreeCues/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new TreeCuesService();
    }])

    .factory('treeInfoService', ['$http', function($http) {

        function TreeInfoService() {

            // <a href="http://localhost:62417//Help/Api/GET-api-TreeInfo">Help for getTreeInfoSet</a>
            this.getTreeInfoSet = function () {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/TreeInfo',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/GET-api-TreeInfo-id">Help for getTreeInfo</a>
            this.getTreeInfo = function (id) {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/TreeInfo/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/PUT-api-TreeInfo-id">Help for putTreeInfo</a>
            this.putTreeInfo = function (id, treeInfo) {
                return $http({
                    method: 'PUT',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/TreeInfo/'+encodeURIComponent(id)+'',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(treeInfo),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-TreeInfo">Help for postTreeInfo</a>
            this.postTreeInfo = function (treeInfo) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/TreeInfo',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(treeInfo),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/DELETE-api-TreeInfo-id">Help for deleteTreeInfo</a>
            this.deleteTreeInfo = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/TreeInfo/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new TreeInfoService();
    }])

    .factory('treesService', ['$http', function($http) {

        function TreesService() {

            // <a href="http://localhost:62417//Help/Api/GET-api-Trees">Help for getTreeSet</a>
            this.getTreeSet = function () {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Trees',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/GET-api-Trees-id">Help for getTree</a>
            this.getTree = function (id) {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Trees/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/PUT-api-Trees-id">Help for putTree</a>
            this.putTree = function (id, tree) {
                return $http({
                    method: 'PUT',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Trees/'+encodeURIComponent(id)+'',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(tree),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-Trees">Help for postTree</a>
            this.postTree = function (tree) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Trees',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(tree),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/DELETE-api-Trees-id">Help for deleteTree</a>
            this.deleteTree = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Trees/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new TreesService();
    }])

    .factory('treeSettingsService', ['$http', function($http) {

        function TreeSettingsService() {

            // <a href="http://localhost:62417//Help/Api/GET-api-TreeSettings">Help for getTreeSettingsSet</a>
            this.getTreeSettingsSet = function () {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/TreeSettings',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/GET-api-TreeSettings-id">Help for getTreeSettings</a>
            this.getTreeSettings = function (id) {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/TreeSettings/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/PUT-api-TreeSettings-id">Help for putTreeSettings</a>
            this.putTreeSettings = function (id, treeSettings) {
                return $http({
                    method: 'PUT',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/TreeSettings/'+encodeURIComponent(id)+'',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(treeSettings),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-TreeSettings">Help for postTreeSettings</a>
            this.postTreeSettings = function (treeSettings) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/TreeSettings',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(treeSettings),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/DELETE-api-TreeSettings-id">Help for deleteTreeSettings</a>
            this.deleteTreeSettings = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/TreeSettings/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new TreeSettingsService();
    }])

    .factory('usersService', ['$http', function($http) {

        function UsersService() {

            // <a href="http://localhost:62417//Help/Api/GET-api-Users">Help for getUserSet</a>
            this.getUserSet = function () {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Users',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/GET-api-Users-id">Help for getUser</a>
            this.getUser = function (id) {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Users/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/PUT-api-Users-id">Help for putUser</a>
            this.putUser = function (id, user) {
                return $http({
                    method: 'PUT',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Users/'+encodeURIComponent(id)+'',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(user),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-Users">Help for postUser</a>
            this.postUser = function (user) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Users',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(user),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/DELETE-api-Users-id">Help for deleteUser</a>
            this.deleteUser = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Users/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new UsersService();
    }])

    .factory('valuesService', ['$http', function($http) {

        function ValuesService() {

            // <a href="http://localhost:62417//Help/Api/GET-api-Values">Help for get</a>
            this.get = function () {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Values',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/GET-api-Values-id">Help for get2</a>
            this.get2 = function (id) {
                return $http({
                    method: 'GET',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Values/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/POST-api-Values">Help for post</a>
            this.post = function (value) {
                return $http({
                    method: 'POST',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Values',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(value),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/PUT-api-Values-id">Help for put</a>
            this.put = function (id, value) {
                return $http({
                    method: 'PUT',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Values/'+encodeURIComponent(id)+'',
                    data: _api_AppName_From_WebConfig_AppSettings_services_postContentTransform(value),
                    cache: false
                });
            };

            // <a href="http://localhost:62417//Help/Api/DELETE-api-Values-id">Help for delete</a>
            this.delete = function (id) {
                return $http({
                    method: 'DELETE',
                    url: _api_AppName_From_WebConfig_AppSettings_services_url + '/api/Values/'+encodeURIComponent(id)+'',
                    cache: false
                });
            };
        }

        return new ValuesService();
    }])
;
