/*
Client Code jQueryAjax
[Download client here]

Or add following line in your client:

<script src="http://localhost:62417/Client/jQueryAjax"></script>
This will include the following code in your application: (approx. 854 code lines)
*/

/* jQuery.ajax() client for Api_AppName_From_WebConfig_AppSettings */
/* Generated from "http://localhost:62417/Client/jQueryAjax" on 2015/10/07 12:49:56 */

// Declares the Api_AppName_From_WebConfig_AppSettings Services object:
$.api_AppName_From_WebConfig_AppSettingsServices = { };
$.api_AppName_From_WebConfig_AppSettingsServices._url = 'http://10.211.55.3:62417';
//$.api_AppName_From_WebConfig_AppSettingsServices._url = 'http://localhost:62417';
$.api_AppName_From_WebConfig_AppSettingsServices._postContentType = 'application/json';
$.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform = function(data) { return JSON.stringify(data); };

// Declares the Account service:
$.api_AppName_From_WebConfig_AppSettingsServices.account = { };

// Declares the getUserInfo service method:
// <a href="http://localhost:62417//Help/Api/GET-api-Account-UserInfo">Help for getUserInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.account.getUserInfo = function () {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Account/UserInfo',
        type: 'GET'
   });
};

// Declares the logout service method:
// <a href="http://localhost:62417//Help/Api/POST-api-Account-Logout">Help for logout</a>
$.api_AppName_From_WebConfig_AppSettingsServices.account.logout = function () {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Account/Logout',
        type: 'POST'
   });
};

// Declares the getManageInfo service method:
// <a href="http://localhost:62417//Help/Api/GET-api-Account-ManageInfo_returnUrl_generateState">Help for getManageInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.account.getManageInfo = function (returnUrl, generateState) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Account/ManageInfo?returnUrl='+encodeURIComponent(returnUrl)+'&generateState='+encodeURIComponent(generateState)+'',
        type: 'GET'
   });
};

// Declares the changePassword service method:
// <a href="http://localhost:62417//Help/Api/POST-api-Account-ChangePassword">Help for changePassword</a>
$.api_AppName_From_WebConfig_AppSettingsServices.account.changePassword = function (model) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Account/ChangePassword',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(model),
        type: 'POST'
   });
};

// Declares the setPassword service method:
// <a href="http://localhost:62417//Help/Api/POST-api-Account-SetPassword">Help for setPassword</a>
$.api_AppName_From_WebConfig_AppSettingsServices.account.setPassword = function (model) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Account/SetPassword',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(model),
        type: 'POST'
   });
};

// Declares the addExternalLogin service method:
// <a href="http://localhost:62417//Help/Api/POST-api-Account-AddExternalLogin">Help for addExternalLogin</a>
$.api_AppName_From_WebConfig_AppSettingsServices.account.addExternalLogin = function (model) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Account/AddExternalLogin',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(model),
        type: 'POST'
   });
};

// Declares the removeLogin service method:
// <a href="http://localhost:62417//Help/Api/POST-api-Account-RemoveLogin">Help for removeLogin</a>
$.api_AppName_From_WebConfig_AppSettingsServices.account.removeLogin = function (model) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Account/RemoveLogin',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(model),
        type: 'POST'
   });
};

// Declares the getExternalLogin service method:
// <a href="http://localhost:62417//Help/Api/GET-api-Account-ExternalLogin_provider_error">Help for getExternalLogin</a>
$.api_AppName_From_WebConfig_AppSettingsServices.account.getExternalLogin = function (provider, error) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Account/ExternalLogin?provider='+encodeURIComponent(provider)+'&error='+encodeURIComponent(error)+'',
        type: 'GET'
   });
};

// Declares the getExternalLogins service method:
// <a href="http://localhost:62417//Help/Api/GET-api-Account-ExternalLogins_returnUrl_generateState">Help for getExternalLogins</a>
$.api_AppName_From_WebConfig_AppSettingsServices.account.getExternalLogins = function (returnUrl, generateState) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Account/ExternalLogins?returnUrl='+encodeURIComponent(returnUrl)+'&generateState='+encodeURIComponent(generateState)+'',
        type: 'GET'
   });
};

// Declares the register service method:
// <a href="http://localhost:62417//Help/Api/POST-api-Account-Register">Help for register</a>
$.api_AppName_From_WebConfig_AppSettingsServices.account.register = function (model) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Account/Register',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(model),
        type: 'POST'
   });
};

// Declares the registerExternal service method:
// <a href="http://localhost:62417//Help/Api/POST-api-Account-RegisterExternal">Help for registerExternal</a>
$.api_AppName_From_WebConfig_AppSettingsServices.account.registerExternal = function (model) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Account/RegisterExternal',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(model),
        type: 'POST'
   });
};

// Declares the Cases service:
$.api_AppName_From_WebConfig_AppSettingsServices.cases = { };

// Declares the getCaseSet service method:
// <a href="http://localhost:62417//Help/Api/GET-api-Cases">Help for getCaseSet</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cases.getCaseSet = function () {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Cases',
        type: 'GET'
   });
};

// Declares the getCase service method:
// <a href="http://localhost:62417//Help/Api/GET-api-Cases-id">Help for getCase</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cases.getCase = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Cases/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putCase service method:
// <a href="http://localhost:62417//Help/Api/PUT-api-Cases-id">Help for putCase</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cases.putCase = function (id, caseX) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Cases/'+encodeURIComponent(id)+'',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(caseX),
        type: 'PUT'
   });
};

// Declares the postCase service method:
// <a href="http://localhost:62417//Help/Api/POST-api-Cases">Help for postCase</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cases.postCase = function (caseX) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Cases',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(caseX),
        type: 'POST'
   });
};

// Declares the deleteCase service method:
// <a href="http://localhost:62417//Help/Api/DELETE-api-Cases-id">Help for deleteCase</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cases.deleteCase = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Cases/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the CueInfo service:
$.api_AppName_From_WebConfig_AppSettingsServices.cueInfo = { };

// Declares the getCueInfoSet service method:
// <a href="http://localhost:62417//Help/Api/GET-api-CueInfo">Help for getCueInfoSet</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cueInfo.getCueInfoSet = function () {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/CueInfo',
        type: 'GET'
   });
};

// Declares the getCueInfo service method:
// <a href="http://localhost:62417//Help/Api/GET-api-CueInfo-id">Help for getCueInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cueInfo.getCueInfo = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/CueInfo/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putCueInfo service method:
// <a href="http://localhost:62417//Help/Api/PUT-api-CueInfo-id">Help for putCueInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cueInfo.putCueInfo = function (id, cueInfo) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/CueInfo/'+encodeURIComponent(id)+'',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(cueInfo),
        type: 'PUT'
   });
};

// Declares the postCueInfo service method:
// <a href="http://localhost:62417//Help/Api/POST-api-CueInfo">Help for postCueInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cueInfo.postCueInfo = function (cueInfo) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/CueInfo',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(cueInfo),
        type: 'POST'
   });
};

// Declares the deleteCueInfo service method:
// <a href="http://localhost:62417//Help/Api/DELETE-api-CueInfo-id">Help for deleteCueInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cueInfo.deleteCueInfo = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/CueInfo/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the CueMappings service:
$.api_AppName_From_WebConfig_AppSettingsServices.cueMappings = { };

// Declares the getCueMappingSet service method:
// <a href="http://localhost:62417//Help/Api/GET-api-CueMappings">Help for getCueMappingSet</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cueMappings.getCueMappingSet = function () {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/CueMappings',
        type: 'GET'
   });
};

// Declares the getCueMapping service method:
// <a href="http://localhost:62417//Help/Api/GET-api-CueMappings-id">Help for getCueMapping</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cueMappings.getCueMapping = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/CueMappings/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putCueMapping service method:
// <a href="http://localhost:62417//Help/Api/PUT-api-CueMappings-id">Help for putCueMapping</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cueMappings.putCueMapping = function (id, cueMapping) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/CueMappings/'+encodeURIComponent(id)+'',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(cueMapping),
        type: 'PUT'
   });
};

// Declares the postCueMapping service method:
// <a href="http://localhost:62417//Help/Api/POST-api-CueMappings">Help for postCueMapping</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cueMappings.postCueMapping = function (cueMapping) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/CueMappings',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(cueMapping),
        type: 'POST'
   });
};

// Declares the deleteCueMapping service method:
// <a href="http://localhost:62417//Help/Api/DELETE-api-CueMappings-id">Help for deleteCueMapping</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cueMappings.deleteCueMapping = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/CueMappings/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the Cues service:
$.api_AppName_From_WebConfig_AppSettingsServices.cues = { };

// Declares the getCueSet service method:
// <a href="http://localhost:62417//Help/Api/GET-api-Cues">Help for getCueSet</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cues.getCueSet = function () {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Cues',
        type: 'GET'
   });
};

// Declares the getCue service method:
// <a href="http://localhost:62417//Help/Api/GET-api-Cues-id">Help for getCue</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cues.getCue = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Cues/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putCue service method:
// <a href="http://localhost:62417//Help/Api/PUT-api-Cues-id">Help for putCue</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cues.putCue = function (id, cue) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Cues/'+encodeURIComponent(id)+'',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(cue),
        type: 'PUT'
   });
};

// Declares the postCue service method:
// <a href="http://localhost:62417//Help/Api/POST-api-Cues">Help for postCue</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cues.postCue = function (cue) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Cues',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(cue),
        type: 'POST'
   });
};

// Declares the deleteCue service method:
// <a href="http://localhost:62417//Help/Api/DELETE-api-Cues-id">Help for deleteCue</a>
$.api_AppName_From_WebConfig_AppSettingsServices.cues.deleteCue = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Cues/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the DatasetInfo service:
$.api_AppName_From_WebConfig_AppSettingsServices.datasetInfo = { };

// Declares the getDatasetInfoSet service method:
// <a href="http://localhost:62417//Help/Api/GET-api-DatasetInfo">Help for getDatasetInfoSet</a>
$.api_AppName_From_WebConfig_AppSettingsServices.datasetInfo.getDatasetInfoSet = function () {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/DatasetInfo',
        type: 'GET'
   });
};

// Declares the getDatasetInfo service method:
// <a href="http://localhost:62417//Help/Api/GET-api-DatasetInfo-id">Help for getDatasetInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.datasetInfo.getDatasetInfo = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/DatasetInfo/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putDatasetInfo service method:
// <a href="http://localhost:62417//Help/Api/PUT-api-DatasetInfo-id">Help for putDatasetInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.datasetInfo.putDatasetInfo = function (id, datasetInfo) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/DatasetInfo/'+encodeURIComponent(id)+'',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(datasetInfo),
        type: 'PUT'
   });
};

// Declares the postDatasetInfo service method:
// <a href="http://localhost:62417//Help/Api/POST-api-DatasetInfo">Help for postDatasetInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.datasetInfo.postDatasetInfo = function (datasetInfo) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/DatasetInfo',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(datasetInfo),
        type: 'POST'
   });
};

// Declares the deleteDatasetInfo service method:
// <a href="http://localhost:62417//Help/Api/DELETE-api-DatasetInfo-id">Help for deleteDatasetInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.datasetInfo.deleteDatasetInfo = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/DatasetInfo/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the Datasets service:
$.api_AppName_From_WebConfig_AppSettingsServices.datasets = { };

// Declares the getDatasetSet service method:
// <a href="http://localhost:62417//Help/Api/GET-api-Datasets">Help for getDatasetSet</a>
$.api_AppName_From_WebConfig_AppSettingsServices.datasets.getDatasetSet = function () {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Datasets',
        type: 'GET'
   });
};

// Declares the getDataset service method:
// <a href="http://localhost:62417//Help/Api/GET-api-Datasets-id">Help for getDataset</a>
$.api_AppName_From_WebConfig_AppSettingsServices.datasets.getDataset = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Datasets/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putDataset service method:
// <a href="http://localhost:62417//Help/Api/PUT-api-Datasets-id">Help for putDataset</a>
$.api_AppName_From_WebConfig_AppSettingsServices.datasets.putDataset = function (id, dataset) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Datasets/'+encodeURIComponent(id)+'',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(dataset),
        type: 'PUT'
   });
};

// Declares the postDataset service method:
// <a href="http://localhost:62417//Help/Api/POST-api-Datasets">Help for postDataset</a>
$.api_AppName_From_WebConfig_AppSettingsServices.datasets.postDataset = function (dataset) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Datasets',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(dataset),
        type: 'POST'
   });
};

// Declares the deleteDataset service method:
// <a href="http://localhost:62417//Help/Api/DELETE-api-Datasets-id">Help for deleteDataset</a>
$.api_AppName_From_WebConfig_AppSettingsServices.datasets.deleteDataset = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Datasets/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the HeuristicsInfo service:
$.api_AppName_From_WebConfig_AppSettingsServices.heuristicsInfo = { };

// Declares the getHeuristicsInfoSet service method:
// <a href="http://localhost:62417//Help/Api/GET-api-HeuristicsInfo">Help for getHeuristicsInfoSet</a>
$.api_AppName_From_WebConfig_AppSettingsServices.heuristicsInfo.getHeuristicsInfoSet = function () {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/HeuristicsInfo',
        type: 'GET'
   });
};

// Declares the getHeuristicsInfo service method:
// <a href="http://localhost:62417//Help/Api/GET-api-HeuristicsInfo-id">Help for getHeuristicsInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.heuristicsInfo.getHeuristicsInfo = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/HeuristicsInfo/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putHeuristicsInfo service method:
// <a href="http://localhost:62417//Help/Api/PUT-api-HeuristicsInfo-id">Help for putHeuristicsInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.heuristicsInfo.putHeuristicsInfo = function (id, heuristicsInfo) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/HeuristicsInfo/'+encodeURIComponent(id)+'',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(heuristicsInfo),
        type: 'PUT'
   });
};

// Declares the postHeuristicsInfo service method:
// <a href="http://localhost:62417//Help/Api/POST-api-HeuristicsInfo">Help for postHeuristicsInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.heuristicsInfo.postHeuristicsInfo = function (heuristicsInfo) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/HeuristicsInfo',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(heuristicsInfo),
        type: 'POST'
   });
};

// Declares the deleteHeuristicsInfo service method:
// <a href="http://localhost:62417//Help/Api/DELETE-api-HeuristicsInfo-id">Help for deleteHeuristicsInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.heuristicsInfo.deleteHeuristicsInfo = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/HeuristicsInfo/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the HeuristicsSettings service:
$.api_AppName_From_WebConfig_AppSettingsServices.heuristicsSettings = { };

// Declares the getHeuristicsSettingsSet service method:
// <a href="http://localhost:62417//Help/Api/GET-api-HeuristicsSettings">Help for getHeuristicsSettingsSet</a>
$.api_AppName_From_WebConfig_AppSettingsServices.heuristicsSettings.getHeuristicsSettingsSet = function () {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/HeuristicsSettings',
        type: 'GET'
   });
};

// Declares the getHeuristicsSettings service method:
// <a href="http://localhost:62417//Help/Api/GET-api-HeuristicsSettings-id">Help for getHeuristicsSettings</a>
$.api_AppName_From_WebConfig_AppSettingsServices.heuristicsSettings.getHeuristicsSettings = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/HeuristicsSettings/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putHeuristicsSettings service method:
// <a href="http://localhost:62417//Help/Api/PUT-api-HeuristicsSettings-id">Help for putHeuristicsSettings</a>
$.api_AppName_From_WebConfig_AppSettingsServices.heuristicsSettings.putHeuristicsSettings = function (id, heuristicsSettings) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/HeuristicsSettings/'+encodeURIComponent(id)+'',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(heuristicsSettings),
        type: 'PUT'
   });
};

// Declares the postHeuristicsSettings service method:
// <a href="http://localhost:62417//Help/Api/POST-api-HeuristicsSettings">Help for postHeuristicsSettings</a>
$.api_AppName_From_WebConfig_AppSettingsServices.heuristicsSettings.postHeuristicsSettings = function (heuristicsSettings) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/HeuristicsSettings',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(heuristicsSettings),
        type: 'POST'
   });
};

// Declares the deleteHeuristicsSettings service method:
// <a href="http://localhost:62417//Help/Api/DELETE-api-HeuristicsSettings-id">Help for deleteHeuristicsSettings</a>
$.api_AppName_From_WebConfig_AppSettingsServices.heuristicsSettings.deleteHeuristicsSettings = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/HeuristicsSettings/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the TreeCues service:
$.api_AppName_From_WebConfig_AppSettingsServices.treeCues = { };

// Declares the getCueSet service method:
// <a href="http://localhost:62417//Help/Api/GET-api-TreeCues">Help for getCueSet</a>
$.api_AppName_From_WebConfig_AppSettingsServices.treeCues.getCueSet = function () {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/TreeCues',
        type: 'GET'
   });
};

// Declares the getTreeCue service method:
// <a href="http://localhost:62417//Help/Api/GET-api-TreeCues-id">Help for getTreeCue</a>
$.api_AppName_From_WebConfig_AppSettingsServices.treeCues.getTreeCue = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/TreeCues/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putTreeCue service method:
// <a href="http://localhost:62417//Help/Api/PUT-api-TreeCues-id">Help for putTreeCue</a>
$.api_AppName_From_WebConfig_AppSettingsServices.treeCues.putTreeCue = function (id, treeCue) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/TreeCues/'+encodeURIComponent(id)+'',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(treeCue),
        type: 'PUT'
   });
};

// Declares the postTreeCue service method:
// <a href="http://localhost:62417//Help/Api/POST-api-TreeCues">Help for postTreeCue</a>
$.api_AppName_From_WebConfig_AppSettingsServices.treeCues.postTreeCue = function (treeCue) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/TreeCues',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(treeCue),
        type: 'POST'
   });
};

// Declares the deleteTreeCue service method:
// <a href="http://localhost:62417//Help/Api/DELETE-api-TreeCues-id">Help for deleteTreeCue</a>
$.api_AppName_From_WebConfig_AppSettingsServices.treeCues.deleteTreeCue = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/TreeCues/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the TreeInfo service:
$.api_AppName_From_WebConfig_AppSettingsServices.treeInfo = { };

// Declares the getTreeInfoSet service method:
// <a href="http://localhost:62417//Help/Api/GET-api-TreeInfo">Help for getTreeInfoSet</a>
$.api_AppName_From_WebConfig_AppSettingsServices.treeInfo.getTreeInfoSet = function () {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/TreeInfo',
        type: 'GET'
   });
};

// Declares the getTreeInfo service method:
// <a href="http://localhost:62417//Help/Api/GET-api-TreeInfo-id">Help for getTreeInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.treeInfo.getTreeInfo = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/TreeInfo/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putTreeInfo service method:
// <a href="http://localhost:62417//Help/Api/PUT-api-TreeInfo-id">Help for putTreeInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.treeInfo.putTreeInfo = function (id, treeInfo) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/TreeInfo/'+encodeURIComponent(id)+'',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(treeInfo),
        type: 'PUT'
   });
};

// Declares the postTreeInfo service method:
// <a href="http://localhost:62417//Help/Api/POST-api-TreeInfo">Help for postTreeInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.treeInfo.postTreeInfo = function (treeInfo) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/TreeInfo',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(treeInfo),
        type: 'POST'
   });
};

// Declares the deleteTreeInfo service method:
// <a href="http://localhost:62417//Help/Api/DELETE-api-TreeInfo-id">Help for deleteTreeInfo</a>
$.api_AppName_From_WebConfig_AppSettingsServices.treeInfo.deleteTreeInfo = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/TreeInfo/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the Trees service:
$.api_AppName_From_WebConfig_AppSettingsServices.trees = { };

// Declares the getTreeSet service method:
// <a href="http://localhost:62417//Help/Api/GET-api-Trees">Help for getTreeSet</a>
$.api_AppName_From_WebConfig_AppSettingsServices.trees.getTreeSet = function () {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Trees',
        type: 'GET'
   });
};

// Declares the getTree service method:
// <a href="http://localhost:62417//Help/Api/GET-api-Trees-id">Help for getTree</a>
$.api_AppName_From_WebConfig_AppSettingsServices.trees.getTree = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Trees/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putTree service method:
// <a href="http://localhost:62417//Help/Api/PUT-api-Trees-id">Help for putTree</a>
$.api_AppName_From_WebConfig_AppSettingsServices.trees.putTree = function (id, tree) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Trees/'+encodeURIComponent(id)+'',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(tree),
        type: 'PUT'
   });
};

// Declares the postTree service method:
// <a href="http://localhost:62417//Help/Api/POST-api-Trees">Help for postTree</a>
$.api_AppName_From_WebConfig_AppSettingsServices.trees.postTree = function (tree) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Trees',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(tree),
        type: 'POST'
   });
};

// Declares the deleteTree service method:
// <a href="http://localhost:62417//Help/Api/DELETE-api-Trees-id">Help for deleteTree</a>
$.api_AppName_From_WebConfig_AppSettingsServices.trees.deleteTree = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Trees/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the TreeSettings service:
$.api_AppName_From_WebConfig_AppSettingsServices.treeSettings = { };

// Declares the getTreeSettingsSet service method:
// <a href="http://localhost:62417//Help/Api/GET-api-TreeSettings">Help for getTreeSettingsSet</a>
$.api_AppName_From_WebConfig_AppSettingsServices.treeSettings.getTreeSettingsSet = function () {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/TreeSettings',
        type: 'GET'
   });
};

// Declares the getTreeSettings service method:
// <a href="http://localhost:62417//Help/Api/GET-api-TreeSettings-id">Help for getTreeSettings</a>
$.api_AppName_From_WebConfig_AppSettingsServices.treeSettings.getTreeSettings = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/TreeSettings/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putTreeSettings service method:
// <a href="http://localhost:62417//Help/Api/PUT-api-TreeSettings-id">Help for putTreeSettings</a>
$.api_AppName_From_WebConfig_AppSettingsServices.treeSettings.putTreeSettings = function (id, treeSettings) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/TreeSettings/'+encodeURIComponent(id)+'',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(treeSettings),
        type: 'PUT'
   });
};

// Declares the postTreeSettings service method:
// <a href="http://localhost:62417//Help/Api/POST-api-TreeSettings">Help for postTreeSettings</a>
$.api_AppName_From_WebConfig_AppSettingsServices.treeSettings.postTreeSettings = function (treeSettings) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/TreeSettings',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(treeSettings),
        type: 'POST'
   });
};

// Declares the deleteTreeSettings service method:
// <a href="http://localhost:62417//Help/Api/DELETE-api-TreeSettings-id">Help for deleteTreeSettings</a>
$.api_AppName_From_WebConfig_AppSettingsServices.treeSettings.deleteTreeSettings = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/TreeSettings/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the Users service:
$.api_AppName_From_WebConfig_AppSettingsServices.users = { };

// Declares the getUserSet service method:
// <a href="http://localhost:62417//Help/Api/GET-api-Users">Help for getUserSet</a>
$.api_AppName_From_WebConfig_AppSettingsServices.users.getUserSet = function () {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Users',
        type: 'GET'
   });
};

// Declares the getUser service method:
// <a href="http://localhost:62417//Help/Api/GET-api-Users-id">Help for getUser</a>
$.api_AppName_From_WebConfig_AppSettingsServices.users.getUser = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Users/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putUser service method:
// <a href="http://localhost:62417//Help/Api/PUT-api-Users-id">Help for putUser</a>
$.api_AppName_From_WebConfig_AppSettingsServices.users.putUser = function (id, user) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Users/'+encodeURIComponent(id)+'',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(user),
        type: 'PUT'
   });
};

// Declares the postUser service method:
// <a href="http://localhost:62417//Help/Api/POST-api-Users">Help for postUser</a>
$.api_AppName_From_WebConfig_AppSettingsServices.users.postUser = function (user) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Users',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(user),
        type: 'POST'
   });
};

// Declares the deleteUser service method:
// <a href="http://localhost:62417//Help/Api/DELETE-api-Users-id">Help for deleteUser</a>
$.api_AppName_From_WebConfig_AppSettingsServices.users.deleteUser = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Users/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the Values service:
$.api_AppName_From_WebConfig_AppSettingsServices.values = { };

// Declares the get service method:
// <a href="http://localhost:62417//Help/Api/GET-api-Values">Help for get</a>
$.api_AppName_From_WebConfig_AppSettingsServices.values.get = function () {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Values',
        type: 'GET'
   });
};

// Declares the get service method:
// <a href="http://localhost:62417//Help/Api/GET-api-Values-id">Help for get2</a>
$.api_AppName_From_WebConfig_AppSettingsServices.values.get2 = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Values/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the post service method:
// <a href="http://localhost:62417//Help/Api/POST-api-Values">Help for post</a>
$.api_AppName_From_WebConfig_AppSettingsServices.values.post = function (value) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Values',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(value),
        type: 'POST'
   });
};

// Declares the put service method:
// <a href="http://localhost:62417//Help/Api/PUT-api-Values-id">Help for put</a>
$.api_AppName_From_WebConfig_AppSettingsServices.values.put = function (id, value) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Values/'+encodeURIComponent(id)+'',
        contentType: $.api_AppName_From_WebConfig_AppSettingsServices._postContentType,
        data: $.api_AppName_From_WebConfig_AppSettingsServices._postContentTransform(value),
        type: 'PUT'
   });
};

// Declares the delete service method:
// <a href="http://localhost:62417//Help/Api/DELETE-api-Values-id">Help for delete</a>
$.api_AppName_From_WebConfig_AppSettingsServices.values.delete = function (id) {
    return $.ajax({
        url: $.api_AppName_From_WebConfig_AppSettingsServices._url + '/api/Values/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};


