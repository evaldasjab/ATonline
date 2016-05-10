/**
 * Created by evo on 10/04/16.
 */

(function() {  // to keep variable myApp local

    // get all info about myApp, defined in main.js
    var myApp = angular.module("myApp");

    //*** MY TOOLBOX ***//

    // angularjs for toolbox.html
    myApp.controller("ToolboxCtrl", function ($scope, $http, datasetInfoesService, heuristicInfoesService, aspNetUsersService, sharedDatasetFull, sharedUser, sharedDatasetName) {
        //myApp.controller("DatasetListCtrl", function($scope, $http, datasetInfoesService) {

        // set the color scheme
        $scope.color_theme = $scope.$parent.color_theme = 'color_tool';

        // change the page's title
        //$('#page_title').html('ADAPTIVE TOOLBOX Online');
        // change the color of the active menu
        //$('#menu .inline').removeClass('active');
        //$('#menu_mytoolbox').addClass('active');

        // activate button upload csv
        $scope.clickUpload = function(){
            angular.element('#csv-file').trigger('click');
        };

        // activate parsing of uploaded csv file
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
                    document.location.href = 'index.html#/data_new'; // FIX THIS!!!
                }
            });
        };

        // get data from the server using Web API for angularjs
        datasetInfoesService.getDatasetInfo()
            .success(function (data) {
                console.log('SUCCESS getDatasetINFO');
                // filter only private datasets
                var myFindArray = $.grep(data, function(e){ return e.Access == 'private'; });
                $scope.datasets = myFindArray;

                // get datasets of current user
                //$scope.user_datasets = $.grep($scope.datasets, function(e){ return e.UserName == $scope.user_current; });
            })
            .error(function (errdata, status, headers, config) {
                console.log('FAIL getDatasetInfo:');
                console.log(errdata);
            });

        // get all heuristic_info - run AFTER scope has user_current!
        heuristicInfoesService.getHeuristicInfo()
            .success(function (data) {
                console.log('SUCCESS getHeuristicInfo:');
                console.log(data);
                // filter only private heuristics
                var myFindArray = $.grep(data, function(e){ return e.Access == 'private'; });

                $scope.fftrees = $.grep(myFindArray, function(e){ return e.DecisionAlgorithm == 'Fast-and-Frugal Tree'; });
                $scope.heuristics = $.grep(myFindArray, function(e){ return e.DecisionAlgorithm != 'Fast-and-Frugal Tree'; });

                // get heuristics of current user  FIX THIS!!!
                //$scope.user_heuristics = $.grep($scope.heuristics, function(e){ return e.UserName == $scope.user_current; });

            }).error(function (errdata, status, headers, config) {
                console.log('FAIL getHeuristicInfo:');
                console.log(errdata);
            });

        console.log($scope);

        // execute function when ng-repeat is done
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) { //you also get the actual event object

            console.log('NGREPEAT FINISHED');

            // select the current user in dropdown
            $('select#button_user').val($scope.user_current);
        });

    });


}());
