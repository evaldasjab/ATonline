/**
 * Javascript commands for
 */

// ANGULAR START ////////////////////////////////////////////////////////

(function() {  // to keep variable myApp local

    // run angularjs, activate ngRepeatFinished when done (to run functions after Angularjs has finished)
    var myApp = angular.module("myApp", ['ngRoute', 'evoApp.services', 'ui.sortable', 'rzModule', 'ngHandsontable', 'ngAnimate']);

    myApp.service('sharedUser', function () {
            var sharedProperty = []; // initial value

            return {
                getShared: function () {
                    return sharedProperty;
                },
                setShared: function (value) {
                    sharedProperty = value;
                }
            }
        });

    myApp.service('sharedDatasetName', function () {
            var sharedProperty = []; // initial value

            return {
                getShared: function () {
                    return sharedProperty;
                },
                setShared: function (value) {
                    sharedProperty = value;
                }
            }
        });

    myApp.service('sharedDatasetFull', function () {
            var sharedProperty = []; // initial value

            return {
                getShared: function () {
                    return sharedProperty;
                },
                setShared: function (value) {
                    sharedProperty = value;
                }
            }
        });

    myApp.directive('customOnChange', function() {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var onChangeHandler = scope.$eval(attrs.customOnChange);
                    element.bind('change', onChangeHandler);
                }
            };
        });

    myApp.directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngFinished '+attr.ngRepeat); // attr contains info, which list is processed

                        console.log('DIRECTIVE: ngFinished '+attr.ngRepeat);
                    });
                }
            }
        }
    });

    myApp.directive('myRepeatDirective', function() {
        return function(scope, element, attrs) {
            //angular.element(element).css('color','blue');

            //console.log( scope );
            //console.log( element );
            //console.log( attrs );
            var myCueId = scope.cue.CueName;
            console.log(myCueId);
            debugger;

            $('#'+myCueId).find('.widget_title span').hover(StartMarquee, StopMarquee);

            if (scope.$last){
                window.alert("im the last!");
            }
        };
    });

    myApp.directive('ngMarqueeOverflow', function () {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.on('mouseenter', function() {
                    //console.log('mouseenter');

                    var mySpeed = 50;

                    var menuItemWidth = $(element).width();
                    var listItemWidth = $(element).parent().width();

                    if(menuItemWidth > listItemWidth) {
                        var scrollDistance = menuItemWidth - listItemWidth;
                        var listItem = $(element).parent();
                        // Stop any current animation
                        listItem.stop();

                        var myTime = scrollDistance/mySpeed * 1000;

                        // Start animating the left scroll position over X seconds, using a smooth linear motion
                        listItem.animate({scrollLeft: scrollDistance}, myTime, 'linear');
                    }
                });

                element.on('mouseleave', function() {
                    //console.log('mouseleave');

                    var listItem = $(element).parent();

                    // Stop any current animation
                    listItem.stop();

                    // Start animating the left scroll position quickly, with a bit of a swing to the animation.
                    // This will make the item seem to 'whip' back to it's starting point
                    listItem.animate({scrollLeft: 0}, 'medium', 'swing');

                });
            }
        };
    });

    // directive for dataset split slider (training/testing cases)
    myApp.directive('slider', function() {
        return {
            restrict: 'AE',
            link: function(scope, element, attrs) {
                element.slider({
                    value: scope[attrs.ngModel],
                    min: parseInt(attrs.min),
                    max: parseInt(attrs.max),
                    step: parseFloat(attrs.step),
                    slide: function(event, ui) {
                        scope.$apply(function() {
                            scope[attrs.ngModel] = ui.value;
                        });
                    }
                });
            }
        };
    });

    myApp.filter('percentage', ['$filter', function ($filter) {
        return function (input, decimals) {
            return $filter('number')(input * 100, decimals) + ' %';
        };
    }]); // This filter makes the assumption that the input will be in decimal form (i.e. 17% is 0.17).


    // getDatasetInfoFactory
    /*myApp.factory('getDatasetInfoFactory', function($http, datasetInfoesService){

        function getData(callback){

            // get data from the server using Web API for angularjs
            datasetInfoesService.getDatasetInfo()
                .success(callback)
                .error(function (errdata, status, headers, config) {
                    console.log('FAIL getDatasetInfo:');
                    console.log(errdata);
                });
        }

        return {
            list: getData,                      // getDatasetInfoFactory.list(function(data) {
            find: function(myid, callback){     // getDatasetInfoFactory.find(dataset_id, function(data) {
                getData(function(data) {
                    var myFind = data.filter(function(entry){
                        return entry.DatasetId == myid;
                    })[0];
                    callback(myFind);
                });
            }
        };
    });*/

    // getHeuristicInfoFactory
    /*myApp.factory('getHeuristicInfoFactory', function($http, heuristicInfoesService){

        function getData(callback){

            // get data from the server using Web API for angularjs
            heuristicInfoesService.getHeuristicInfo()
                .success(callback)
                .error(function (errdata, status, headers, config) {
                    console.log('FAIL getHeuristicInfo:');
                    console.log(errdata);
                });
        }

        return {
            list: getData,                      // getHeuristicInfoFactory.list(function(data) {
            find: function(myid, callback){     // getHeuristicInfoFactory.find(heuristic_id, function(data) {
                getData(function(data) {
                    var myFind = data.filter(function(entry){
                        return entry.HeuristicId == myid;
                    })[0];
                    callback(myFind);
                });
            }
        };
    });*/


    // angularjs configuration, when use which controller
    myApp.config(function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'toolbox.html',
                controller: 'ToolboxCtrl'
            }).
            //*** DATASETS ***********************//
            when('/data', {
                templateUrl: 'data_list.html',
                controller: 'ListDataCtrl'
            }).
            when('/data/:dataset_id', {
                templateUrl: 'data_show.html',
                controller: 'ShowDataCtrl'
            }).
            when('/data_new', {
                templateUrl: 'data_show.html',
                controller: 'UploadDataCtrl'
            }).
            //*** CLASSIFICATION TASKS (FFT) ***********//
            when('/fft', {
                templateUrl: 'fft_list.html',
                controller: 'ListFftCtrl'
            }).
            when('/fft/:heuristic_id', {
                templateUrl: 'fft_show.html',
                controller: 'ShowHeurCtrl'
            }).
            when('/data/:dataset_id/fft_new', {  /* must come first, otherwise fft_new will be picked up by '/data/:dataset_id/:heuristic_abbr'  */
                templateUrl: 'fft_show.html',
                controller: 'CreateHeurCtrl'
            }).
            //*** COMPARISON TASKS (HEUR) ****************//
            when('/heur', {
                templateUrl: 'heur_list.html',
                controller: 'ListHeurCtrl'
            }).
            when('/heur/:heuristic_id', {
                templateUrl: 'heur_show.html',
                controller: 'ShowHeurCtrl'
            }).
            when('/data/:dataset_id/:heuristic_abbr', {
                templateUrl: 'heur_show.html',
                controller: 'CreateHeurCtrl'
            }).
            when('/heur/:heuristic_id/choose_data', {
                templateUrl: 'data_list.html',
                controller: 'ChooseDataCtrl'
            }).
            when('/heur/:heuristic_id/data/:dataset_id', {
                templateUrl: 'heur_show.html',
                controller: 'ShowHeurDiffDataCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    });

    //*** INDEX ***//

    myApp.controller('MainCtrl',function($scope){  // run empty controller to create $scope, where page's color_theme will be saved
        //console.log($scope.color_theme);
    });

}());
