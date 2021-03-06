

/* jQuery.ajax() client for EvoApp */
/* Generated from "http://localhost:52628/Client/jQueryAjax" on 2015/11/15 18:39:26 */

// Declares the EvoApp Services object:
$.evoAppServices = { };
//$.evoAppServices._url = 'http://localhost:52628';
$.evoAppServices._url = 'http://10.211.55.3:52628';
$.evoAppServices._postContentType = 'application/json';
$.evoAppServices._postContentTransform = function(data) { return JSON.stringify(data); };

// Declares the AspNetUsers service:
$.evoAppServices.aspNetUsers = { };

// Declares the getAspNetUsers service method:
// <a href="http://localhost:52628//Help/Api/GET-api-AspNetUsers">Help for getAspNetUsers</a>
$.evoAppServices.aspNetUsers.getAspNetUsers = function () {
    return $.ajax({
        url: $.evoAppServices._url + '/api/AspNetUsers',
        type: 'GET'
   });
};

// Declares the getAspNetUsers service method:
// <a href="http://localhost:52628//Help/Api/GET-api-AspNetUsers-id">Help for getAspNetUsers2</a>
$.evoAppServices.aspNetUsers.getAspNetUsers2 = function (id) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/AspNetUsers/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putAspNetUsers service method:
// <a href="http://localhost:52628//Help/Api/PUT-api-AspNetUsers-id">Help for putAspNetUsers</a>
$.evoAppServices.aspNetUsers.putAspNetUsers = function (id, aspNetUsers) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/AspNetUsers/'+encodeURIComponent(id)+'',
        contentType: $.evoAppServices._postContentType,
        data: $.evoAppServices._postContentTransform(aspNetUsers),
        type: 'PUT'
   });
};

// Declares the postAspNetUsers service method:
// <a href="http://localhost:52628//Help/Api/POST-api-AspNetUsers">Help for postAspNetUsers</a>
$.evoAppServices.aspNetUsers.postAspNetUsers = function (aspNetUsers) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/AspNetUsers',
        contentType: $.evoAppServices._postContentType,
        data: $.evoAppServices._postContentTransform(aspNetUsers),
        type: 'POST'
   });
};

// Declares the deleteAspNetUsers service method:
// <a href="http://localhost:52628//Help/Api/DELETE-api-AspNetUsers-id">Help for deleteAspNetUsers</a>
$.evoAppServices.aspNetUsers.deleteAspNetUsers = function (id) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/AspNetUsers/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the CueMappings service:
$.evoAppServices.cueMappings = { };

// Declares the getCueMapping service method:
// <a href="http://localhost:52628//Help/Api/GET-api-CueMappings">Help for getCueMapping</a>
$.evoAppServices.cueMappings.getCueMapping = function () {
    return $.ajax({
        url: $.evoAppServices._url + '/api/CueMappings',
        type: 'GET'
   });
};

// Declares the getCueMapping service method:
// <a href="http://localhost:52628//Help/Api/GET-api-CueMappings-id">Help for getCueMapping2</a>
$.evoAppServices.cueMappings.getCueMapping2 = function (id) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/CueMappings/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putCueMapping service method:
// <a href="http://localhost:52628//Help/Api/PUT-api-CueMappings-id">Help for putCueMapping</a>
$.evoAppServices.cueMappings.putCueMapping = function (id, cueMapping) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/CueMappings/'+encodeURIComponent(id)+'',
        contentType: $.evoAppServices._postContentType,
        data: $.evoAppServices._postContentTransform(cueMapping),
        type: 'PUT'
   });
};

// Declares the postCueMapping service method:
// <a href="http://localhost:52628//Help/Api/POST-api-CueMappings">Help for postCueMapping</a>
$.evoAppServices.cueMappings.postCueMapping = function (cueMapping) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/CueMappings',
        contentType: $.evoAppServices._postContentType,
        data: $.evoAppServices._postContentTransform(cueMapping),
        type: 'POST'
   });
};

// Declares the deleteCueMapping service method:
// <a href="http://localhost:52628//Help/Api/DELETE-api-CueMappings-id">Help for deleteCueMapping</a>
$.evoAppServices.cueMappings.deleteCueMapping = function (id) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/CueMappings/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the DatasetFulls service:
$.evoAppServices.datasetFulls = { };

// Declares the getDatasetFullsByDatasetId service method:
// <a href="http://localhost:52628//Help/Api/GET-api-datasetfulls-datasetid-dataId">Help for getDatasetFullsByDatasetId</a>
$.evoAppServices.datasetFulls.getDatasetFullsByDatasetId = function (dataId) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/datasetfulls/datasetid/'+encodeURIComponent(dataId)+'',
        type: 'GET'
   });
};

// Declares the getDatasetFull service method:
// <a href="http://localhost:52628//Help/Api/GET-api-DatasetFulls">Help for getDatasetFull</a>
$.evoAppServices.datasetFulls.getDatasetFull = function () {
    return $.ajax({
        url: $.evoAppServices._url + '/api/DatasetFulls',
        type: 'GET'
   });
};

// Declares the getDatasetFull service method:
// <a href="http://localhost:52628//Help/Api/GET-api-DatasetFulls-id">Help for getDatasetFull2</a>
$.evoAppServices.datasetFulls.getDatasetFull2 = function (id) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/DatasetFulls/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putDatasetFull service method:
// <a href="http://localhost:52628//Help/Api/PUT-api-DatasetFulls-id">Help for putDatasetFull</a>
$.evoAppServices.datasetFulls.putDatasetFull = function (id, datasetFull) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/DatasetFulls/'+encodeURIComponent(id)+'',
        contentType: $.evoAppServices._postContentType,
        data: $.evoAppServices._postContentTransform(datasetFull),
        type: 'PUT'
   });
};

// Declares the postDatasetFull service method:
// <a href="http://localhost:52628//Help/Api/POST-api-DatasetFulls">Help for postDatasetFull</a>
$.evoAppServices.datasetFulls.postDatasetFull = function (datasetFull) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/DatasetFulls',
        contentType: $.evoAppServices._postContentType,
        data: $.evoAppServices._postContentTransform(datasetFull),
        type: 'POST'
   });
};

// Declares the deleteDatasetFull service method:
// <a href="http://localhost:52628//Help/Api/DELETE-api-DatasetFulls-id">Help for deleteDatasetFull</a>
$.evoAppServices.datasetFulls.deleteDatasetFull = function (id) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/DatasetFulls/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the DatasetInfoes service:
$.evoAppServices.datasetInfoes = { };

// Declares the getDatasetInfo service method:
// <a href="http://localhost:52628//Help/Api/GET-api-DatasetInfoes">Help for getDatasetInfo</a>
$.evoAppServices.datasetInfoes.getDatasetInfo = function () {
    return $.ajax({
        url: $.evoAppServices._url + '/api/DatasetInfoes',
        type: 'GET'
   });
};

// Declares the getDatasetInfo service method:
// <a href="http://localhost:52628//Help/Api/GET-api-DatasetInfoes-id">Help for getDatasetInfo2</a>
$.evoAppServices.datasetInfoes.getDatasetInfo2 = function (id) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/DatasetInfoes/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putDatasetInfo service method:
// <a href="http://localhost:52628//Help/Api/PUT-api-DatasetInfoes-id">Help for putDatasetInfo</a>
$.evoAppServices.datasetInfoes.putDatasetInfo = function (id, datasetInfo) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/DatasetInfoes/'+encodeURIComponent(id)+'',
        contentType: $.evoAppServices._postContentType,
        data: $.evoAppServices._postContentTransform(datasetInfo),
        type: 'PUT'
   });
};

// Declares the postDatasetInfo service method:
// <a href="http://localhost:52628//Help/Api/POST-api-DatasetInfoes">Help for postDatasetInfo</a>
$.evoAppServices.datasetInfoes.postDatasetInfo = function (datasetInfo) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/DatasetInfoes',
        contentType: $.evoAppServices._postContentType,
        data: $.evoAppServices._postContentTransform(datasetInfo),
        type: 'POST'
   });
};

// Declares the deleteDatasetInfo service method:
// <a href="http://localhost:52628//Help/Api/DELETE-api-DatasetInfoes-id">Help for deleteDatasetInfo</a>
$.evoAppServices.datasetInfoes.deleteDatasetInfo = function (id) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/DatasetInfoes/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the HeuristicInfoes service:
$.evoAppServices.heuristicInfoes = { };

// Declares the getHeuristicInfo service method:
// <a href="http://localhost:52628//Help/Api/GET-api-HeuristicInfoes">Help for getHeuristicInfo</a>
$.evoAppServices.heuristicInfoes.getHeuristicInfo = function () {
    return $.ajax({
        url: $.evoAppServices._url + '/api/HeuristicInfoes',
        type: 'GET'
   });
};

// Declares the getHeuristicInfo service method:
// <a href="http://localhost:52628//Help/Api/GET-api-HeuristicInfoes-id">Help for getHeuristicInfo2</a>
$.evoAppServices.heuristicInfoes.getHeuristicInfo2 = function (id) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/HeuristicInfoes/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putHeuristicInfo service method:
// <a href="http://localhost:52628//Help/Api/PUT-api-HeuristicInfoes-id">Help for putHeuristicInfo</a>
$.evoAppServices.heuristicInfoes.putHeuristicInfo = function (id, heuristicInfo) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/HeuristicInfoes/'+encodeURIComponent(id)+'',
        contentType: $.evoAppServices._postContentType,
        data: $.evoAppServices._postContentTransform(heuristicInfo),
        type: 'PUT'
   });
};

// Declares the postHeuristicInfo service method:
// <a href="http://localhost:52628//Help/Api/POST-api-HeuristicInfoes">Help for postHeuristicInfo</a>
$.evoAppServices.heuristicInfoes.postHeuristicInfo = function (heuristicInfo) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/HeuristicInfoes',
        contentType: $.evoAppServices._postContentType,
        data: $.evoAppServices._postContentTransform(heuristicInfo),
        type: 'POST'
   });
};

// Declares the deleteHeuristicInfo service method:
// <a href="http://localhost:52628//Help/Api/DELETE-api-HeuristicInfoes-id">Help for deleteHeuristicInfo</a>
$.evoAppServices.heuristicInfoes.deleteHeuristicInfo = function (id) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/HeuristicInfoes/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};

// Declares the HeuristicStructures service:
$.evoAppServices.heuristicStructures = { };

// Declares the getHeuristicStructuresByHeuristicId service method:
// <a href="http://localhost:52628//Help/Api/GET-api-heuristicstructures-heuristicid-heurId">Help for getHeuristicStructuresByHeuristicId</a>
$.evoAppServices.heuristicStructures.getHeuristicStructuresByHeuristicId = function (heurId) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/heuristicstructures/heuristicid/'+encodeURIComponent(heurId)+'',
        type: 'GET'
   });
};

// Declares the getHeuristicStructure service method:
// <a href="http://localhost:52628//Help/Api/GET-api-HeuristicStructures">Help for getHeuristicStructure</a>
$.evoAppServices.heuristicStructures.getHeuristicStructure = function () {
    return $.ajax({
        url: $.evoAppServices._url + '/api/HeuristicStructures',
        type: 'GET'
   });
};

// Declares the getHeuristicStructure service method:
// <a href="http://localhost:52628//Help/Api/GET-api-HeuristicStructures-id">Help for getHeuristicStructure2</a>
$.evoAppServices.heuristicStructures.getHeuristicStructure2 = function (id) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/HeuristicStructures/'+encodeURIComponent(id)+'',
        type: 'GET'
   });
};

// Declares the putHeuristicStructure service method:
// <a href="http://localhost:52628//Help/Api/PUT-api-HeuristicStructures-id">Help for putHeuristicStructure</a>
$.evoAppServices.heuristicStructures.putHeuristicStructure = function (id, heuristicStructure) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/HeuristicStructures/'+encodeURIComponent(id)+'',
        contentType: $.evoAppServices._postContentType,
        data: $.evoAppServices._postContentTransform(heuristicStructure),
        type: 'PUT'
   });
};

// Declares the postHeuristicStructure service method:
// <a href="http://localhost:52628//Help/Api/POST-api-HeuristicStructures">Help for postHeuristicStructure</a>
$.evoAppServices.heuristicStructures.postHeuristicStructure = function (heuristicStructure) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/HeuristicStructures',
        contentType: $.evoAppServices._postContentType,
        data: $.evoAppServices._postContentTransform(heuristicStructure),
        type: 'POST'
   });
};

// Declares the deleteHeuristicStructure service method:
// <a href="http://localhost:52628//Help/Api/DELETE-api-HeuristicStructures-id">Help for deleteHeuristicStructure</a>
$.evoAppServices.heuristicStructures.deleteHeuristicStructure = function (id) {
    return $.ajax({
        url: $.evoAppServices._url + '/api/HeuristicStructures/'+encodeURIComponent(id)+'',
        type: 'DELETE'
   });
};


