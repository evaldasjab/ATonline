/**
 * Created by evo on 10/04/16.
 */

(function() {  // to keep variable myApp local

    // get all info about myApp, defined in main.js
    var myApp = angular.module("myApp");

    //*** DATASETS ***********************//

    // angularjs for data_list.html
    myApp.controller("ListDataCtrl", function($scope, $http, datasetInfoesService, sharedDatasetFull, sharedDatasetName) {

        // set the color scheme
        $scope.color_theme = $scope.$parent.color_theme = 'color_data';

        // change the page's title
        //$('#page_title').html('ADAPTIVE TOOLBOX Online');
        // change the color of the active menu
        //$('#menu .inline').removeClass('active');
        //$('#menu_datasets').addClass('active');


        // activate button upload csv
        $scope.clickUpload = function(){
            angular.element('#csv-file').trigger('click');
        };

        // activate parsing of csv file
        $scope.uploadFile = function(event){
            var file = event.target.files[0];

            // put the file name to service for access from another controller
            sharedDatasetName.setShared(file.name);

            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: function(results) {
                    console.log('UPLOADED CSV FILE:');
                    console.log(results);

                    // put the   dataset to service for access from another controller
                    sharedDatasetFull.setShared(results.data);

                    // go to page dataset_show
                    document.location.href = 'index.html#/data_new'; // FIX THIS!!!
                }
            });
        };

        // get data from the server using Web API for angularjs
        datasetInfoesService.getDatasetInfo()
            .success(function (data) {
                console.log('SUCCESS getDatasetINFO');
                // filter only public datasets
                var myFindArray = $.grep(data, function(e){ return e.Access == 'public'; });
                $scope.datasets = myFindArray;
            })
            .error(function (errdata, status, headers, config) {
                console.log('FAIL getDatasetInfo:');
                console.log(errdata);
            });

        console.log($scope);

    });

    // angularjs for data_show.html
    myApp.controller('ShowDataCtrl', function ($scope, $routeParams, datasetInfoesService, datasetFullsService, heuristicInfoesService){

        // set the color scheme
        $scope.color_theme = $scope.$parent.color_theme = 'color_data';

        // change the page's title
        $('#page_title').html('ADAPTIVE TOOLBOX Online');

        console.log($routeParams);
        $scope.dataset_id = parseInt($routeParams.dataset_id);

        // get data from the server using Web API for angularjs
        datasetInfoesService.getDatasetInfo2($routeParams.dataset_id)
            .success(function (data) {
                console.log('SUCCESS getDatasetInfo:');
                console.log(data);
                $scope.dataset_info = data;

                // get data from the server using Web API for angularjs
                heuristicInfoesService.getHeuristicInfo()
                    .success(function (data) {
                        console.log('SUCCESS getHeuristicINFO');
                        // filter only public datasets
                        $scope.heuristics = $.grep(data, function(e){ return e.Access == 'public'; });

                        // get the list of heuristics, used with this dataset
                        var myResult = GetDatasetUsage($scope.dataset_info.CueMapping, $scope.heuristics);
                        $scope.dataset_usage = myResult.dataset_usage;
                        $scope.dataset_info.UsageTasks = $scope.dataset_usage.length;
                        $scope.dataset_info.UsageUsers = myResult.UsageUsers;
                    })
                    .error(function (errdata, status, headers, config) {
                        console.log('FAIL getHeuristicInfo:');
                        console.log(errdata);
                    });

                // if dataset is private, allow changing and deleting, otherwise allow publishing
                switch ($scope.dataset_info.Access) {

                    case 'private':

                        // activate SAVE button
                        ButtonSaveDataset();

                        // activate PUBLISH button
                        ButtonPublishDataset();

                        // activate remove button
                        ButtonRemoveDataset($scope.dataset_id);

                        break;

                    case 'public':

                        // activate SAVE button
                        ButtonSaveDataset();

                        // activate remove button  - TEMPORARY FOR TESTING!
                        ButtonRemoveDataset($scope.dataset_id);

                        break;
                }

                // get data from the server using Web API for angularjs
                datasetFullsService.getDatasetFullsByDatasetId($routeParams.dataset_id)
                    .success(function (data) {
                        console.log('SUCCESS getDatasetFULL:');
                        //console.log(data);

                        // add to dataset_info
                        $scope.dataset_info.DatasetFull = data;

                        // convert the table to the format for the browser
                        $scope.dataset_full_orig = ConvertDataset(data, 'forClient');

                        // activate download button
                        ButtonDownloadDataset($scope.dataset_full_orig, $scope.dataset_info.Title);

                        // create the table with "handsontable.js"
                        ShowTable($scope.dataset_full_orig);

                    }).error(function (errdata, status, headers, config) {
                        console.log('FAIL getDatasetFULL:');
                        console.log(errdata);
                    });

            })
            .error(function (errdata, status, headers, config) {
                console.log('FAIL getDatasetInfo:');
                console.log(errdata);
            });

        console.log($scope);

    });

    // angularjs for data_new.html
    myApp.controller('UploadDataCtrl', function ($scope, $routeParams, sharedDatasetFull, sharedDatasetName){

        // set the color scheme
        $scope.color_theme = $scope.$parent.color_theme = 'color_data';

        // set dataset id, marking that it's new - not saved on the server yet
        $scope.dataset_id = 'data_new';

        // change the page's title
        $('#page_title').html('New Dataset');

        $scope.user_current = 'steve@jobs.com'; // get current user from the server - FIX THIS!!!

        // get the file name from service
        $scope.dataset_name = sharedDatasetName.getShared();

        // create dataset_info with initial values
        var myDataInfoObj = {};
        //myDataInfoObj.heuristic_name = 'Dataset';
        myDataInfoObj.Title = $scope.dataset_name;
        myDataInfoObj.Image = 'icon_CSV_512.jpg';
        myDataInfoObj.Date = 'NOT SAVED YET';  // FIX THIS!!!
        myDataInfoObj.UserName = $scope.user_current;              // FIX THIS!!!
        myDataInfoObj.SizeCues = 0;            // FIX THIS!!! must be updated when there are cues in the tree
        myDataInfoObj.SizeCases = 0;
        myDataInfoObj.UsageUsers = 1;          // FIX THIS!!!
        myDataInfoObj.UsageDatasets = 1;       // FIX THIS!!!
        myDataInfoObj.Description = '';
        myDataInfoObj.Access = 'private';
        //myDataInfoObj.CueMapping = [];
        myDataInfoObj.DatasetFull = [];
        $scope.dataset_info = myDataInfoObj;
        $scope.heuristic_name = myDataInfoObj.heuristic_name;

        //console.log($routeParams);
        //$scope.dataset_id = parseInt($routeParams.dataset_id);
        //$scope.heur_id = $routeParams.heur_id;

        // get dataset from angular service
        $scope.dataset_full_orig = sharedDatasetFull.getShared();

        // update the info about dataset
        myDataInfoObj.SizeCases = $scope.dataset_full_orig.length;
        myDataInfoObj.SizeCues = Object.keys($scope.dataset_full_orig[0]).length;

        // create the table with "handsontable.js"
        ShowTable($scope.dataset_full_orig);

        // convert the table to the format for the server
        var myDataset = ConvertDataset($scope.dataset_full_orig, 'forServer');

        $scope.dataset_info.DatasetFull = myDataset;

        console.log($scope);

        // send data to the server using Web API for angularjs
        /*datasetInfoesService.postDatasetInfo($scope.dataset_info)
         .success(function (data) {
         console.log('SUCCESS postDatasetInfo:');
         console.log(data);

         }).error(function (errdata, status, headers, config) {
         console.log('FAIL postDatasetInfo:');
         console.log(errdata);
         });*/

        // activate save button
        ButtonSaveDataset();
    });

    // angularjs for data_list.html
    myApp.controller("ChooseDataCtrl", function($scope, $routeParams, $http, getDatasetInfoFactory, sharedDatasetFull, sharedDatasetName) {

        // set the color scheme
        //$scope.color_theme = $scope.$parent.color_theme = 'color_data';

        console.log($routeParams);
        $scope.heuristic_id = parseInt($routeParams.heuristic_id);

        // change the page's title
        $('#page_title').html('CHOOSE Another Dataset');
        // change the color of the active menu
        $('#menu .inline').removeClass('active');
        $('#menu_datasets').addClass('active');

        // activate button upload csv
        $scope.clickUpload = function(){
            angular.element('#csv-file').trigger('click');
        };

        // activate parsing of csv file
        $scope.uploadFile = function(event){
            var file = event.target.files[0];

            // put the file name to service for access from another controller
            sharedDatasetName.setShared(file.name);

            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: function(results) {
                    console.log('UPLOADED CSV FILE:');
                    console.log(results);

                    // put the dataset to service for access from another controller
                    sharedDatasetFull.setShared(results.data);

                    // go to page dataset_show
                    document.location.href = 'index.html#/heur/'+$scope.heuristic_id+'/data_new_show'; // FIX THIS!!!
                }
            });
        };

        // get all dataset_info
        getDatasetInfoFactory.list(function(data) {
            $scope.datasets = data;
        });

        console.log($scope);

        // execute function when ng-repeat is done
        $scope.$on('ngFinished entry in datasets | filter:query | orderBy:sortField:reverse', function(ngRepeatFinishedEvent) { //you also get the actual event object
            console.log('NGREPEAT FINISHED -> datasets are listed');

            // change hyperlink, so that it leads to #/heur/heur_id/data/data_id
            $('a.image').each(function(){
                this.href = this.href.replace('#', '#/heur/'+$scope.heuristic_id);
            });
        });

    });


}());
