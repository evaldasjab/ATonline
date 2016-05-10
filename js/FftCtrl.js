/**
 * Created by evo on 10/04/16.
 */

(function() {  // to keep variable myApp local

    // get all info about myApp, defined in main.js
    var myApp = angular.module("myApp");

    //*** CLASSIFICATION TASKS (FFT) ***********//

    // angularjs for fft_list.html
    myApp.controller("ListFftCtrl", function ($scope, $http, heuristicInfoesService) {

        // set the color scheme
        $scope.color_theme = $scope.$parent.color_theme = 'color_fft';

        // change the page's title
        //$('#page_title').html('ADAPTIVE TOOLBOX Online');
        // change the color of the active menu
        //$('#menu .inline').removeClass('active');
        //$('#menu_fft').addClass('active');

        // get data from the server using Web API for angularjs
        heuristicInfoesService.getHeuristicInfo()
            .success(function (data) {
                console.log('SUCCESS getHeuristicINFO');
                // filter only public datasets
                var myFindArray = $.grep(data, function(e){ return e.Access == 'public'; });
                // filter only other heuristics, not FFTs
                var myFindArray2 = $.grep(myFindArray, function(e){ return e.DecisionAlgorithm == 'Fast-and-Frugal Tree'; });
                $scope.heuristics = myFindArray2;
            })
            .error(function (errdata, status, headers, config) {
                console.log('FAIL getHeuristicInfo:');
                console.log(errdata);
            });

        /*
         // get data from the server using Web API for angularjs
         heuristicInfoesService.getHeuristicInfo()
         .success(function (data) {
         console.log('SUCCESS getHeuristicInfo:');
         console.log(data);
         $scope.heuristics = data;

         }).error(function (errdata, status, headers, config) {
         console.log('FAIL getHeuristicInfo:');
         console.log(errdata);
         });*/

        console.log($scope);
    });

}());
