/**
 * Created by evo on 10/04/16.
 */

(function() {  // to keep variable myApp local

    // get all info about myApp, defined in MyApp.js
    var myApp = angular.module("myApp");

    myApp.animation('.ng-show-toggle-slidedown', function(){
        return {
            beforeAddClass : function(element, className, done){
                debugger;
                if (className == 'ng-hide'){
                    $(element).slideUp({duration: 400}, done);
                } else {done();}
            },
            beforeRemoveClass :  function(element, className, done){
                debugger;
                if (className == 'ng-hide'){
                    $(element).css({display:'none'});
                    $(element).slideDown({duration: 400}, done);
                } else {done();}
            }
        }
    });
    /* Executes jQuery slideDown and slideUp based on value of toggleSlidedown attribute.
    Set duration using slidedown-duration attribute.
    Add the toggle-required attribute to all contained form controls which are input, select, or textarea.
    Defaults to hidden (up) if not specified in slidedown-init attribute.  */
    myApp.directive('toggleSlidedown', function(){
        return {
            restrict: 'A',
            link: function (scope, elem, attrs, ctrl) {
                if ('down' == attrs.slidedownInit){
                    elem.css('display', '');
                } else {
                    elem.css('display', 'none');
                }
                scope.$watch(attrs.WidgetExpand, function (val) {
                    var duration = _.isUndefined(attrs.slidedownDuration) ? 150 : attrs.slidedownDuration;
                    if (val) {
                        elem.slideDown(duration);
                    } else {
                        elem.slideUp(duration);
                    }
                });
            }
        }
    });

    //*** COMPARISON TASKS (HEUR) ****************//

    // angularjs for heur_list.html
    myApp.controller("ListHeurCtrl", function($scope, $http, heuristicInfoesService) {

        // set the color scheme
        $scope.color_theme = $scope.$parent.color_theme = 'color_heur';

        // change the page's title
        //$('#page_title').html('ADAPTIVE TOOLBOX Online');
        // change the color of the active menu
        //$('#menu .inline').removeClass('active');
        //$('#menu_heuristics').addClass('active');

        // get data from the server using Web API for angularjs
        heuristicInfoesService.getHeuristicInfo()
            .success(function (data) {
                console.log('SUCCESS getHeuristicINFO');
                // filter only public datasets
                var myFindArray = $.grep(data, function(e){ return e.Access == 'public'; });
                // filter only other heuristics, not FFTs
                var myFindArray2 = $.grep(myFindArray, function(e){ return e.DecisionAlgorithm != 'Fast-and-Frugal Tree'; });
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

    // angularjs for heur_show.html
    myApp.controller('ShowHeurCtrl', function ($scope, $routeParams, $filter, $q, $timeout, heuristicInfoesService, heuristicStructuresService, datasetFullsService, datasetInfoesService){

        console.log($routeParams);
        $scope.heuristic_id = parseInt($routeParams.heuristic_id);

        $q.all([   // angular promise - when this is done, then do the next

            heuristicInfoesService.getHeuristicInfo2($scope.heuristic_id)
                .success(function (data) {
                    console.log('SUCCESS getHeuristicInfo:');
                    console.log(data);
                    $scope.heuristic_info = data;

                    // if heurstic is private, allow changing and deleting the tree, otherwise allow choosing different dataset
                    switch ($scope.heuristic_info.Access) {

                        case 'private':

                            // activate SAVE button
                            ButtonSaveHeuristic();

                            // activate PUBLISH button
                            ButtonPublishHeuristic($scope.heuristic_info);

                            // activate the REMOVE button
                            ButtonRemoveHeuristic($scope.heuristic_id);

                            break;

                        case 'public':

                            // disable sortable everywhere
                            $scope.sortableOptions = {
                                disabled: true
                            };

                            // activate SAVE button
                            ButtonSaveHeuristic();

                            // activate CHOOSE DATASET button
                            //ButtonChooseDataset($scope.heuristic_id);

                            // activate the REMOVE button - TEMPORARY FOR TESTING
                            ButtonRemoveHeuristic($scope.heuristic_id);

                            break;
                    }

                    $scope.heuristic_name = $scope.heuristic_info.DecisionAlgorithm;
                    $scope.dataset_id = data.CueMapping[0].DatasetId;

                    // update the page's title
                    $('#page_title').html($scope.heuristic_name);

                    switch ($scope.heuristic_name) {

                        case 'Fast-and-Frugal Tree':

                            // set the color scheme
                            $scope.color_theme = $scope.$parent.color_theme = 'color_fft';

                            break;

                        case 'Take The Best':
                        case "Minimalist":
                        case "Tallying":
                        case "Weighted Tallying":

                            // set the color scheme
                            $scope.color_theme = $scope.$parent.color_theme = 'color_heur';

                            break;
                    }

                    // make the proper drag_cues_list, drag_criterion and drag_tree
                    /*var myLists = RestoreLists($scope.heuristic_info);
                    $scope.drag_criterion = myLists.drag_criterion;
                    $scope.drag_tree = myLists.drag_tree;
                    $scope.drag_cues_list = myLists.drag_cues_list;
                    $scope.cues_enabled = myLists.cues_enabled;*/


                }).error(function (errdata, status, headers, config) {
                    console.log('FAIL getHeuristicInfo:');
                    console.log(errdata);
                })

            // do after dataset_id is retreaved from heuristic_info
        ]).then(function() {

            // get data from the server using Web API for angularjs
            datasetInfoesService.getDatasetInfo2($scope.dataset_id)
                .success(function (data) {
                // filter only public datasets
                //var myFindArray = $.grep(data, function(e){ return e.Access == 'public'; });
                $scope.dataset_info = data;
                })
                .error(function (errdata, status, headers, config) {
                    console.log('FAIL getDatasetInfo:');
                    console.log(errdata);
                });

            // get data from the server using Web API for angularjs
            datasetFullsService.getDatasetFullsByDatasetId($scope.dataset_id)
                .success(function (data) {
                    console.log('SUCCESS getDatasetFULL:');
                    //console.log(data);

                    // convert the table to the format for the browser
                    $scope.dataset_full_orig = ConvertDataset(data, 'forClient');

                    // make the proper drag_cues_list, drag_criterion and drag_tree
                    $scope.cues_all = RestoreLists($scope.heuristic_info, $scope.dataset_full_orig);
                    $scope.cues_enabled = $.grep($scope.cues_all, function(e){ return e.IsDisabled == false; });
                    $scope.drag_cues_list = $.grep($scope.cues_all, function(e){ return e.CueType == 'cue'; });
                    $scope.drag_criterion = $.grep($scope.cues_all, function(e){ return e.CueType == 'criterion'; });
                    $scope.drag_tree = $.grep($scope.cues_all, function(e){ return e.CueType == 'treecue'; });

                    // convert values to binary
                    var myConversion = ConvertToBinary($scope.dataset_full_orig, $scope.heuristic_info, $scope.cues_enabled);
                    $scope.dataset_full_bin = myConversion.dataset_binary;
                    //$scope.heuristic_info.CueMapping = myConversion.CueMapping;

                    // add number of cases to the cues in lists - bug workaround, should be stored on server FIX THIS!!!
                    /*$scope.cues_enabled.forEach(function(myCueObj, myIndex) {
                        var myFind = $.grep($scope.dataset_full_bin, function(e){ return e.CueName == myCueObj.CueName; });
                        myCueObj.CasesNo = myFind[0].CasesNo;
                        myCueObj.CasesYes = myFind[0].CasesYes;
                    });*/

                    // bug workaround for FFT analysis
                    //$scope.dataset_sorted_all = $scope.dataset_binary;

                    // initial split the number of cases equally for TRAINING and TESTING
                    /*$scope.dataset_split = {};
                    $scope.dataset_split.AnalMode = 'training';
                    $scope.dataset_split.AllCases = $scope.dataset_binary.length;
                    $scope.dataset_split.TrainNum = Math.floor($scope.dataset_split.AllCases/2);
                    $scope.dataset_split.TrainPerc = $scope.dataset_split.TrainNum/$scope.dataset_split.AllCases *100;
                    $scope.dataset_split.TestNum = $scope.dataset_split.AllCases - $scope.dataset_split.TrainNum;
                    $scope.dataset_split.TestPerc = $scope.dataset_split.TestNum/$scope.dataset_split.AllCases *100;
                    //$scope.dataset_analyse = $scope.dataset_binary.slice(0,$scope.dataset_split.TrainNum);
                    // leave only one decimal
                    $scope.dataset_split.TrainPerc = parseFloat($scope.dataset_split.TrainPerc.toFixed(1));
                    $scope.dataset_split.TestPerc = parseFloat($scope.dataset_split.TestPerc.toFixed(1));
                    $scope.dataset_split.ReshuffleCycles = 100;

                    // activate slider
                    DataSplitSlider($scope.dataset_split.TrainNum, $scope.dataset_split.AllCases);

                    // set to analyse only TRAINING cases
                    $scope.dataset_analyse = $scope.dataset_binary.slice(0,$scope.dataset_split.TrainNum);*/

                    // activate SHUFFLE button
                    //ButtonsShuffleCases();

                    // activate SHUFFLE 100 button
                    //ButtonsShuffle100();

                    // add the empty array for validities
                    $scope.validities = [];

                    // manage buttons via scope
                    EnableAllButtons($scope, $timeout);

                    // manage jQuery sortable - a shared code with ShowHeurCtrl controller
                    EnableDragging($scope, $filter);

                    console.log($scope);

                }).error(function (errdata, status, headers, config) {
                    console.log('FAIL getDatasetFULL:');
                    console.log(errdata);
                });
        })

        // execute function when ng-repeat is done
        $scope.$on('ngFinished cue in drag_cues_list', function(ngRepeatFinishedEvent) { //you also get the actual event object

            console.log('NGREPEAT FINISHED -> cues in list are listed');

            // activate expand all buttons
            //ButtonExpandAllCues('blue_area');

            // activate sliders and swap buttons
            //SplitValueSliderChangeSwap($scope.drag_cues_list);

        });

        // execute function when ng-repeat is done
        $scope.$on('ngFinished cue in drag_criterion', function(ngRepeatFinishedEvent) { //you also get the actual event object

            console.log('NGREPEAT FINISHED --> criterion is listed');

            // activate sliders and swap buttons
            //SplitValueSliderChangeSwap($scope.drag_criterion);
        });

        // execute function when ng-repeat is done
        $scope.$on('ngFinished cue in drag_tree', function(ngRepeatFinishedEvent) { //you also get the actual event object

            console.log('NGREPEAT FINISHED -> cues in tree are listed');

            // take care of the arrows and exits
            //UpdateArrowsAndExits($scope.heuristic_name, $scope.drag_tree);

            // if validities exist
            //if ($scope.validities) {
                // add validity tags
                //UpdateValidityTags($scope.heuristic_name, 'tree', $scope.validities);
            //}

            // activate disable buttons
            //ButtonsDisableCue();

            // activate expand buttons
            //ButtonsExpandCue();

            // activate expand all buttons
            //ButtonExpandAllCues('white_area');

            // activate sliders and swap buttons
            //SplitValueSliderChangeSwap($scope.drag_tree);

            // activate statistics button - switch between stats of this cue & stats of the tree up to this cue
            //ButtonsCueStats($scope.drag_tree);

            // activate button of tree's contingency table
            //ButtonContTablePercent();

            // depending on the heuristic, do the following
            switch ($scope.heuristic_name) {

                case 'Take The Best':

                    // disable sortable for the tree cues
                    //$('#tree .widget').addClass('unsortable');

                    // disable switch of EXIT nodes
                    //$('.button_switch').remove();

                    break;

                case 'Minimalist':

                    // disable switch of EXIT nodes
                    //$('.button_switch').remove();

                    // activate shuffle buttons
                    //ButtonsShuffleCues($scope.heuristic_name);

                    break;
            }

            // activate stepinfo button
            //ButtonDatasetStepInfo();

        });
    });

    // angularjs for heur_show.html
    myApp.controller('CreateHeurCtrl', function ($scope, $routeParams, $filter, $timeout, datasetInfoesService, datasetFullsService, sharedDatasetFull){

        console.log($routeParams);

        $scope.user_current = 'steve@jobs.com'; // get current user from the server - FIX THIS!!!

        //$scope.dataset_id = parseInt($routeParams.dataset_id);
        $scope.dataset_id = $routeParams.dataset_id;
        $scope.heuristic_abbr = $routeParams.heuristic_abbr;

        // angular routing problem workaround FIX THIS!!!
        if ($scope.heuristic_abbr == undefined) {
            $scope.heuristic_abbr = 'fft_new';
        }

        // get dataset from angular service
        //$scope.dataset_full_orig = sharedDatasetFull.getShared();

        // get the user from service
        /*$scope.user_current = sharedUser.getShared();
        // antibug FIX THIS!!!
        if ($scope.user_current.length == 0) {
            $scope.user_current = '';
        }*/

        switch ($scope.heuristic_abbr) {

            case 'fft_new':
                $scope.heuristic_name = 'Fast-and-Frugal Tree';
                $scope.heuristic_icon = 'icon_fft_512.jpg';

                // enable sortable for the tree
                //$('#tree').addClass('sortable_area');

                break;
            case 'ttb_new':
                $scope.heuristic_name = 'Take The Best';
                $scope.heuristic_icon = 'icon_ttb_512.jpg';

                break;
            case 'mini_new':
                $scope.heuristic_name = 'Minimalist';
                $scope.heuristic_icon = 'icon_mini_512.jpg';
                break;
            case 'tall_new':
                $scope.heuristic_name = 'Tallying';
                $scope.heuristic_icon = 'icon_tall_512.jpg';
                break;
            case 'weta_new':
                $scope.heuristic_name = 'Weighted Tallying';
                $scope.heuristic_icon = 'icon_weta_512.jpg';
                break;
        }

        // set the color scheme
        if ($scope.heuristic_name == 'Fast-and-Frugal Tree') {
            $scope.color_theme = $scope.$parent.color_theme = 'color_fft';
        } else {
            $scope.color_theme = $scope.$parent.color_theme = 'color_heur';
        }

        // change the page's title
        $('#page_title').html('New '+$scope.heuristic_name);

        // create heuristic_info with initial values
        $scope.heuristic_info = {};
        $scope.heuristic_info.DecisionAlgorithm = $scope.heuristic_name;
        $scope.heuristic_info.Title = $scope.heuristic_name;
        $scope.heuristic_info.Image = $scope.heuristic_icon;
        $scope.heuristic_info.Date = 'NOT SAVED YET';  // FIX THIS!!!
        $scope.heuristic_info.UserName = $scope.user_current; // FIX THIS!!!
        $scope.heuristic_info.SizeCues = 0;            // FIX THIS!!! must be updated when there are cues in the tree
        $scope.heuristic_info.UsageUsers = 1;          // FIX THIS!!!
        $scope.heuristic_info.UsageDatasets = 1;       // FIX THIS!!!
        $scope.heuristic_info.Description = 'Please describe your decision tree';
        $scope.heuristic_info.Access = 'private';
        $scope.heuristic_info.CueMapping = [];
        $scope.heuristic_info.HeuristicStructure = [];
        // set titles for contingency tables FIX THIS!!!
        //$scope.heuristic_info.ContingencyNames = {'Signal': 'signal', 'Noise': 'noise'};

        // prepare empty lists for cues
        $scope.drag_cues_list = [];
        $scope.drag_criterion = [];
        $scope.drag_tree = [];

        // add the empty array for validities
        $scope.validities = [];

        // if it's a new dataset, get it from angular service FIX THIS!!!
        if ($scope.dataset_id == 'data_new') {
            $scope.dataset_full_orig = sharedDatasetFull.getShared();
            console.log('GOT DatasetFULL from getShared');

            // do stuff the same as if loaded full dataset from the server
            ProcessDatasetFull();

        } else {

            // get data from the server using Web API for angularjs
            datasetInfoesService.getDatasetInfo2($routeParams.dataset_id)
                .success(function (data) {
                    console.log('SUCCESS getDatasetINFO');
                    //console.log(data);
                    $scope.dataset_info = data;
                })
                .error(function (errdata, status, headers, config) {
                    console.log('FAIL getDatasetInfo:');
                    console.log(errdata);
                });

            // get data from the server using Web API for angularjs
            datasetFullsService.getDatasetFullsByDatasetId($routeParams.dataset_id)
                .success(function (data) {
                    console.log('SUCCESS getDatasetFULL');
                    //console.log(data);

                    // convert the table to the format for the browser
                    $scope.dataset_full_orig = ConvertDataset(data, 'forClient');

                    // do stuff the same as if loaded new dataset
                    ProcessDatasetFull();
                })
                .error(function (errdata) {
                    console.log('FAIL getDatasetFULL:');
                    console.log(errdata);
                });
        }

        function ProcessDatasetFull() {

            // get cue mappings with split, min, max values
            $scope.drag_cues_list = GetCueValues($scope.dataset_id, $scope.dataset_full_orig, $scope.heuristic_name);

            // make the list of ALL cues - for future handling
            $scope.cues_all = $.merge([], $scope.drag_cues_list, $scope.drag_tree, $scope.drag_criterion);  // make copy of cues list array
            //$.merge($scope.cues_all, $scope.drag_tree);  // add tree array
            //$.merge($scope.cues_all, $scope.drag_criterion);  // add criterion array

            // make the list of ENABLED cues
            $scope.cues_enabled = $.grep($scope.cues_all, function(e){ return e.IsDisabled == false; });

            // get the number of YES and NO values, converting values to binary - will convert again when criterion is selected
            var myConversion = ConvertToBinary($scope.dataset_full_orig, $scope.heuristic_info, $scope.cues_enabled);
            $scope.dataset_full_bin = myConversion.dataset_binary;

            // activate the SAVE button
            ButtonSaveHeuristic();

            // manage buttons via scope
            EnableAllButtons($scope, $timeout);

            // manage jQuery sortable - a shared code with ShowHeurCtrl controller
            EnableDragging($scope, $filter);
        }

        // execute function when ng-repeat is done
        $scope.$on('ngFinished cue in drag_cues_list', function(ngRepeatFinishedEvent) { //you also get the actual event object

            console.log('NGREPEAT FINISHED --> all cues are listed');

            // enable text scrolling for widget titles
            //$('.widget_title span').hover(StartMarquee, StopMarquee);

            // activate close buttons
            //ButtonsDisableCue();

            // activate expand buttons
            //ButtonsExpandCue();

            // activate expand all buttons
            //ButtonExpandAllCues('blue_area');

            // activate button of tree's contingency table
            //ButtonContTablePercent();

            // activate stepinfo button
            //ButtonDatasetStepInfo();

            // activate sliders and swap buttons
            //SplitValueSliderChangeSwap($scope.drag_cues_list);

            // activate the SAVE button
            //ButtonSaveHeuristic();

            // activate the REMOVE button
            //ButtonRemoveHeuristic($scope.heuristic_id);

        });

        // execute function when ng-repeat is done
        $scope.$on('ngFinished cue in drag_criterion', function(ngRepeatFinishedEvent) { //you also get the actual event object

            console.log('NGREPEAT FINISHED --> criterion is listed');

            // enable text scrolling for widget titles
            //$('.widget_title span').hover(StartMarquee, StopMarquee);

            // activate sliders and swap buttons
            //SplitValueSliderChangeSwap($scope.drag_criterion);
        });

        // execute function when ng-repeat is done
        $scope.$on('ngFinished cue in drag_tree', function(ngRepeatFinishedEvent) { //you also get the actual event object

            console.log('NGREPEAT FINISHED --> all cues are in tree');

            // enable text scrolling for widget titles
            //$('.widget_title span').hover(StartMarquee, StopMarquee);

            // test analysis for pairs
            //AnalyzeDatasetPairs($scope.dataset_binary, $scope.drag_criterion[0].CueName, $scope.drag_tree);

            // take care of the arrows and exits
            //UpdateArrowsAndExits($scope.heuristic_name, $scope.drag_tree);

            // update cue attributes
            //UpdateCueTypeExitBranches($scope.heuristic_name, $scope.drag_tree);

            // add validity tags
            //UpdateValidityTags($scope.heuristic_name, 'tree', $scope.validities);

            // activate expand buttons
            //ButtonsExpandCue();

            // activate expand all buttons
            //ButtonExpandAllCues('white_area');

            // activate sliders and swap buttons
            //SplitValueSliderChangeSwap($scope.drag_tree);

            // activate statistics button - switch between stats of this cue & stats of the tree up to this cue
            //ButtonsCueStats($scope.drag_tree);

            // activate shuffle buttons
            //ButtonsShuffleCues($scope.heuristic_name);

            // depending on the heuristic, do the following
            switch ($scope.heuristic_name) {

                case 'Take The Best':

                    // disable sortable for the tree cues
                    //$('#tree .widget').addClass('unsortable');

                    // disable switch of EXIT nodes
                    //$('.button_switch').remove();

                    break;

                case 'Minimalist':

                    // disable switch of EXIT nodes
                    //$('.button_switch').remove();

                    // activate shuffle buttons
                    //ButtonsShuffleCues($scope.heuristic_name);

                    break;
            }

        });

        console.log($scope);
    });

    // angularjs for data_list.html
    myApp.controller('ShowHeurDiffDataCtrl', function ($scope, $routeParams, $q, datasetInfoesService, heuristicInfoesService, heuristicStructuresService, datasetFullsService){

        // set the color scheme
        $scope.color_theme = $scope.$parent.color_theme = 'color_heur';

        // change the page's title
        //$('#page_title').html('SHOW Heuristic');

        // hide stepinfo
        $('#dataset_stepinfo_container').hide();

        console.log($routeParams);
        $scope.heuristic_id = parseInt($routeParams.heuristic_id);
        $scope.dataset_id_new = parseInt($routeParams.dataset_id);

        // get data from the server using Web API for angularjs
        datasetInfoesService.getDatasetInfo2($routeParams.dataset_id)
            .success(function (data) {
                console.log('SUCCESS getDatasetInfo:');
                console.log(data);
                $scope.dataset_info = data;

            }).error(function (errdata) {
                console.log('FAIL getDatasetInfo:');
                console.log(errdata);
            });

        $q.all([   // angular promise - when this is done, then do the next
            // get data from the server using Web API for angularjs
            heuristicInfoesService.getHeuristicInfo2($routeParams.heuristic_id)
                .success(function (data) {
                    console.log('SUCCESS getHeuristicInfo:');
                    console.log(data);
                    $scope.heuristic_info = data;
                    $scope.heuristic_name = data.DecisionAlgorithm;
                    $scope.dataset_id = data.CueMapping[0].DatasetId;

                    //$scope.drag_cues_list = data.CueMapping;
                    // make the proper drag_cues_list, drag_criterion and drag_tree
                    var myLists = RestoreLists($scope.heuristic_info);
                    $scope.drag_criterion = myLists.drag_criterion;
                    $scope.drag_tree = myLists.drag_tree;
                    //$scope.drag_cues_list = myLists.drag_cues_list;

                    // update the page's title
                    $('#page_title').html('SHOW WITH DIFF DATA '+$scope.heuristic_name);

                }).error(function (errdata, status, headers, config) {
                    console.log('FAIL getHeuristicInfo:');
                    console.log(errdata);
                })
        ]).then(function() {

            // get data from the server using Web API for angularjs
            datasetFullsService.getDatasetFullsByDatasetId($scope.dataset_id_new)
                .success(function (data) {
                    console.log('SUCCESS getDatasetFULL:');
                    //console.log(data);

                    // convert the table to the format for the browser
                    $scope.dataset_full_orig = ConvertDataset(data, 'forClient');

                    // DEEP COPY the original dataset!
                    //$scope.dataset_full_orig = jQuery.extend(true, [], $scope.dataset_full_orig);

                    // get cue mappings with split, min, max values
                    // ALREADY HAVE IN heuristic_info.CueMapping

                    // convert values to binary
                    $scope.dataset_full_bin = ConvertToBinary($scope.dataset_full_orig, $scope.heuristic_info.CueMapping);

                    // remove cues from drag_cues_list, if there are
                    //$('#drag_cues_list .widget').remove();
                    //$scope.drag_cues_list = [];

                    // get cue mappings with split, min, max values
                    //$scope.drag_cues_list_new = GetCueValues($scope.dataset_id_new, $scope.dataset_full_orig);
                    $scope.drag_cues_list = GetCueValues($scope.dataset_id_new, $scope.dataset_full_orig);

                    // add the empty array for validities
                    //$scope.validities = [];

                    //// find criterion in the array of objects
                    //var myFind = $.grep($scope.heuristic_info.HeuristicStructure, function(e){ return e.CueType == 'criterion'; });
                    //var myCritCueId = myFind[0].CueName;

                    // convert values to binary
                    //$scope.dataset_binary = ConvertToBinary($scope.dataset_full_orig, $scope.heuristic_info.CueMapping);

                    // calculate and display validities
                    //$scope.validities = ($scope.drag_criterion[0].CueName, $scope.dataset_binary);

                    // add validity tags
                    //UpdateValidityTags($scope.heuristic_name, 'tree', $scope.validities);

                    // update statistics for single cues
                    //UpdateStatisticsForSingleCues();

                    console.log($scope);

                }).error(function (errdata, status, headers, config) {
                    console.log('FAIL getDatasetFULL:');
                    console.log(errdata);
                });
        });

        // execute function when ng-repeat of drag_cues_list is done
        $scope.$on('ngFinished cue in drag_tree', function(ngRepeatFinishedEvent) { //you also get the actual event object

            console.log('NGREPEAT FINISHED -> cues are listed');

            // take care of the cues, arrows and exits
            RestoreCuesArrowsAndExits($scope.heuristic_name, $scope.drag_tree);

        });

        // execute function when ng-repeat of drag_cues_list_new is done
        $scope.$on('ngFinished cue in drag_cues_list', function(ngRepeatFinishedEvent) { //you also get the actual event object

            console.log('NGREPEAT FINISHED -> new cues are listed');

            var myCueObjList = $scope.drag_cues_list;
            var myHeurStruct = $scope.heuristic_info.HeuristicStructure;

            // for every cue in heuristic structure
            myHeurStruct.forEach(function(myCueObj, myIndex) {

                // do only for criterion and treecues
                if (myCueObj.CueType != 'cue') {

                    // add dropdown box with the cue as selected value
                    var myDropdown = '<div class="styled-select">' +
                        '<select class="cue_dropdown">' +
                        '<option value="'+myCueObj.CueName+'">'+myCueObj.CueName+'</option>' +
                        '</select>' +
                        '</div>';
                    $('#criterion_place #'+myCueObj.CueName+' .widget_title').remove();
                    $('#criterion_place #'+myCueObj.CueName+' .widget_head').prepend(myDropdown);
                    $('#tree #'+myCueObj.CueName+' .widget_title').remove();
                    $('#tree #'+myCueObj.CueName+' .widget_head').prepend(myDropdown);

                    // find matching cue in drag_cues_list
                    var myFindArray = $.grep(myCueObjList, function(e){ return e.CueName == myCueObj.CueName; });
                    if (myFindArray.length == 1) {

                        // if found, mark the cue in drag_cues_list semi-transparent
                        $('#drag_cues_list #'+myCueObj.CueName).find('.widget_head').addClass('cue_selected');

                    } else {
                        // if not found or found several, mark the cue RED
                        $('#'+myCueObj.CueName).find('.widget_head').addClass('cue_no_match');
                    }

                    // add the list of other available cues to dropdown box
                    //var myCuesListArray = GetElementsArray('drag_cues_list', 'widget');
                    myCueObjList.forEach(function(myCuesListObj, myIndex) {
                        if (myCuesListObj.CueName != myCueObj.CueName) {
                            var myDropdownAdd = '<option value="'+myCuesListObj.CueName+'">'+myCuesListObj.CueName+'</option>';
                            $('#'+myCueObj.CueName+' .cue_dropdown').append(myDropdownAdd);
                        }
                    });
                }
            });

            // remember OLD value
            var oldStatus;
            $('.cue_dropdown').on('focus', function () {
                // Store the current value on focus and on change
                oldStatus = this.value;
            }).change(function() {
                // Do something with the previous value after the change
                console.log('old value: ' + oldStatus);
                // Make sure the previous value is updated
                //oldStatus = this.value;
            });

            // activate cue selection, get NEW value
            $('.cue_dropdown').change(function () {

                var newStatus = $(this).val();
                console.log('new value: ' + newStatus);

                // rename the cue id to selected
                //$(this).closest('.widget').attr('id', newStatus);

                // reset semi-transparent marking in drag_cues_list
                $('#drag_cues_list .widget_head').removeClass('cue_selected');

                // check if selected value is one of cues in drag_cues_list AND not selected elsewhere (action is valid):
                // check if selected value is one of cues in drag_cues_list
                var myFindArray1 = $.grep(myCueObjList, function(e){ return e.CueName == newStatus; });

                var myChosenValuesArray = [];
                $('.cue_dropdown').each(function (i) {
                    var foundValue = $(this).find('option:selected').val();
                    // add to array
                    myChosenValuesArray.push(foundValue);

                    // in the drag_cues_list, mark found values semi-transparent
                    $('#drag_cues_list #'+foundValue).find('.widget_head').addClass('cue_selected');
                });

                // check if selected value is not selected elsewhere
                var myFindArray2 = $.grep(myChosenValuesArray, function(e){ return e == newStatus; });

                // if the action is valid, mark cue blue
                if (myFindArray1.length == 1 && myFindArray2.length == 1) {

                    // remove red mark
                    $(this).closest('.widget_head').removeClass('cue_no_match');

                    // if action is invalid, mark cue back to red
                } else {
                    // add red mark
                    $(this).closest('.widget_head').addClass('cue_no_match');
                }

                // if all cues are valid, mark button SAVE green and update cue mappings in scope
                var myCueNoMatchArray = GetElementsArray('white_area', 'cue_no_match');
                if (myCueNoMatchArray.length == 0) {

                    // activate SAVE button
                    ButtonSaveHeuristic($scope.heuristic_name);

                    // mark
                    $('#save').addClass('click_me');

                    // update cue mappings: go through every cue in existing mapping
                    var myCurrentMapping = $scope.heuristic_info.CueMapping;
                    myCurrentMapping.forEach(function(myOldCueObj, myIndex){

                        // update the cue name with selected value
                        var myNewCueId = $('#criterion_place, #tree').find('#'+myOldCueObj.CueName).find('option:selected').val();
                        if (myNewCueId) {
                            $scope.heuristic_info.CueMapping[myIndex].DatasetCueName = myNewCueId;
                        } else {
                            //$scope.heuristic_info.CueMapping[myIndex].DatasetCueName = '';
                            // remove unused mapping
                            $scope.heuristic_info.CueMapping.splice(myIndex,1);
                        }

                    });


                    //var elementPos = $scope.heuristic_info.CueMapping.map(function(x) {return x.CueName; }).indexOf(oldStatus);
                    //$scope.heuristic_info.CueMapping[elementPos].DatasetCueName = newStatus;  // in the server's model, CueMapping must have virtual DatasetInfo

                    console.log($scope);

                } else {
                    $('#save').removeClass('click_me');
                }

            });


            // activate expand buttons
            ButtonsExpandCue();

            // activate stepinfo button
            $('#dataset_container').hide();   // HIDE - FIX THIS!!!

            // activate CHOOSE DATASET button
            //ButtonChooseDataset($scope.heuristic_id);

            // activate REMOVE button
            //ButtonRemoveHeuristic($scope.heuristic_id);

        });

        console.log($scope);
        //$scope.$apply();

    });


}());
