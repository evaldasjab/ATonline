/**
 * Created by evo on 10/04/16.
 */

function EnableDragging($scope, $filter) {

    //////////////////////////////////////////////////
    // SHOULD BE THE SAME IN BOTH CONTROLLERS CreateHeur AND ShowHeur
    //////////////////////////////////////////////////

    //console.log('RUN SORTABLE!');

    // count cases of split dataset, depending on which field was updated
    $scope.DataCountCases = function(changedField) {
        console.log('RUN Dataset Count Cases');

        // check if value is not less than zero
        if ($scope.dataset_split[changedField] < 0) {
            $scope.dataset_split[changedField] = 0;
        }

        // check if value is not more than all cases or 100%
        switch (changedField) {

            case 'TrainNum':
            case 'TestNum':

                if ($scope.dataset_split[changedField] > $scope.dataset_split.AllCases) {
                    $scope.dataset_split[changedField] = $scope.dataset_split.AllCases;
                }
                break;

            case 'TrainPerc':
            case 'TestPerc':

                if ($scope.dataset_split[changedField] > 100) {
                    $scope.dataset_split[changedField] = 100;
                }
                break;
        }

        switch (changedField) {

            case 'TrainNum':

                //$scope.dataset_split.TrainNum = $scope.dataset_split.AllCases - $scope.dataset_split.TestNum;
                $scope.dataset_split.TestNum = $scope.dataset_split.AllCases - $scope.dataset_split.TrainNum;
                $scope.dataset_split.TrainPerc = $scope.dataset_split.TrainNum/$scope.dataset_split.AllCases *100;
                $scope.dataset_split.TestPerc = $scope.dataset_split.TestNum/$scope.dataset_split.AllCases *100;

                break;

            case 'TestNum':

                $scope.dataset_split.TrainNum = $scope.dataset_split.AllCases - $scope.dataset_split.TestNum;
                $scope.dataset_split.TrainPerc = $scope.dataset_split.TrainNum/$scope.dataset_split.AllCases *100;
                $scope.dataset_split.TestPerc = $scope.dataset_split.TestNum/$scope.dataset_split.AllCases *100;

                break;

            case 'TrainPerc':

                $scope.dataset_split.TestPerc = 100 - $scope.dataset_split.TrainPerc;
                $scope.dataset_split.TrainNum = $scope.dataset_split.AllCases * $scope.dataset_split.TrainPerc /100;
                $scope.dataset_split.TestNum = $scope.dataset_split.AllCases - $scope.dataset_split.TrainNum; // order matters!

                break;

            case 'TestPerc':

                $scope.dataset_split.TrainPerc = 100 - $scope.dataset_split.TestPerc;
                $scope.dataset_split.TestNum = $scope.dataset_split.AllCases * $scope.dataset_split.TestPerc /100;
                $scope.dataset_split.TrainNum = $scope.dataset_split.AllCases - $scope.dataset_split.TestNum; // order matters!

                break;
        }

        // round numbers to integer
        $scope.dataset_split.TrainNum = Math.floor($scope.dataset_split.TrainNum);
        $scope.dataset_split.TestNum = Math.ceil($scope.dataset_split.TestNum);

        // round percents to one decimal
        $scope.dataset_split.TrainPerc = parseFloat($scope.dataset_split.TrainPerc.toFixed(1));
        $scope.dataset_split.TestPerc = parseFloat($scope.dataset_split.TestPerc.toFixed(1));

        // update slider
        //$('#datasplit_slider').slider('value', $scope.dataset_split.TrainNum);

        // update split dataset's cases
        $scope.DataSplitCases($scope.dataset_split.AnalMode, true);
    }

    // split dataset to cases for testing and training, set the dataset part for analysis
    $scope.DataSplitCases = function(analMode, forceSplit) {
        console.log('RUN DataSplitCases');

        // check if there is a change in analysis mode or we want to force recalculating all statistics (when criterion is selected)
        if ( (analMode != $scope.dataset_split.AnalMode) || forceSplit == true ) {

            // remember for ng-class to change css
            $scope.dataset_split.AnalMode = analMode;

            // trim the dataset based on split numbers
            $scope.dataset_train_bin = $scope.dataset_full_bin.slice(0,$scope.dataset_split.TrainNum);
            $scope.dataset_test_bin = $scope.dataset_full_bin.slice($scope.dataset_split.TrainNum,$scope.dataset_split.AllCases);

            // select the dataset's sample
            switch (analMode) {

                case 'training':
                    $scope.dataset_selected_bin = $scope.dataset_train_bin;
                    break;
                case 'testing':
                    $scope.dataset_selected_bin = $scope.dataset_test_bin;
                    break;
                case 'allcases':
                    $scope.dataset_selected_bin = $scope.dataset_full_bin;
            }

            // if criterion has been selected
            if ($scope.drag_criterion.length > 0) {

                if ($scope.heuristic_name == 'Fast-and-Frugal Tree') {
                    // analyse every cue in cues_list as one-cue-tree (ONLY FOR FFT ?)
                    $scope.drag_cues_list.forEach(function(myCueObj, myIndex) {
                        var myAnalysis = AnalyseDataset($scope.heuristic_name,
                            $scope.dataset_selected_bin,
                            $scope.cues_enabled,
                            $scope.drag_criterion,
                            [myCueObj],
                            $scope.validities,
                            $scope.validities_ordered_by);

                        $scope.drag_cues_list[myIndex] = myAnalysis.cues_stats[0];
                    });
                    // update statistics
                    $scope.GetGeneralAndTreeStats();

                } else { // for other heuristics, check if the tree is built already - bug workaround FIX THIS!!!

                    // update validities
                    $scope.GetAndOrderValidities();

                    if ($scope.drag_tree.length > 0) {
                        // update statistics
                        $scope.GetGeneralAndTreeStats();
                    }
                }
            }
        } else {
            //var myData = $scope.dataset_analyse;
        }

        //return myData;
    }

    // put the function to scope, which orders cues by validity, discrimination rate or success
    $scope.OrderValiditiesTable = function(myOrderBy) {

        // check if there is a change
        if ( myOrderBy != $scope.validities_ordered_by) {

            // descending order
            $scope.validities_reverse = true;
        } else {
            // invert order
            //$scope.validities_reverse = !$scope.validities_reverse;
        }

        $scope.validities_ordered_by = myOrderBy; // remember for ng-class to change css
        var myValidities = $scope.validities = $filter('orderBy')($scope.validities, myOrderBy, $scope.validities_reverse);

        // remember cue's index in the validity table
        myValidities.forEach(function(myValidObj, myIndex) {
            var myCueObj = $.grep($scope.cues_enabled, function(e){ return e.CueName == myValidObj.CueName; })[0];
            myCueObj.ValidIndex = myIndex+1;
        });

        return myValidities;
    }

    $scope.ConvertToBinary = function() {
        console.log('RUN $scope.ConvertToBinary');

        // make DEEP copy of the dataset
        var myDataset = $.extend(true, [], $scope.dataset_full_orig);

        // get values
        var mySplitValuesArray = $scope.cues_enabled;
        var myHeuristic = $scope.heuristic_name;
        var myCritFind = $scope.drag_criterion; // find criterion
        if (myCritFind.length > 0) {  // if criterion exists
            var myCritId = myCritFind[0].CueName;
        } else {                  // if criterion is not selected yet
            var myCritId = '';
        }

        // go through every attribute
        mySplitValuesArray.forEach(function(mySplitObj) {
            //console.log('LOOP! mySplitValues: '+JSON.stringify(mySplitObj, null, "  "));

            var myCueId = mySplitObj.CueName;
            mySplitObj.CasesNo = 0;
            mySplitObj.CasesYes = 0;

            // go through every object (case/row) in the ORIGINAL data array (results)
            // and replace value to 0 or 1, based on the split value in the BINARY data array (myDataset)
            myDataset.forEach(function(myCase, myIndex) {

                var myValue = parseFloat(myCase[myCueId]);

                // if it's FFT and not CRITERION
                if ( (myHeuristic == 'Fast-and-Frugal Tree') || ((myHeuristic != 'Fast-and-Frugal Tree') && (myCueId != myCritId)) ) {

                    // replace value to 0, if it's in range of MIN (included) and SPLIT (included)
                    if (myValue <= mySplitObj.SplitValue) {

                        if (mySplitObj.IsFlipped) {
                            //console.log('FLIPPED, so 1');
                            myCase[myCueId] = 1;
                            mySplitObj.CasesYes++;
                        } else {
                            //console.log('NOT FLIPPED, so 0');
                            myCase[myCueId] = 0;
                            mySplitObj.CasesNo++;
                        }

                        // replace value to 1, if it's in range of SPLIT (excluded) and MAX (included)
                    } else { // if (myValue > mySplitObj.SplitValue ) {

                        if (mySplitObj.IsFlipped) {
                            //console.log('FLIPPED, so 0');
                            myCase[myCueId] = 0;
                            mySplitObj.CasesNo++;
                        } else {
                            //console.log('NOT FLIPPED, so 1');
                            myCase[myCueId] = 1;
                            mySplitObj.CasesYes++;
                        }
                    }
                    // if it is FFT and CRITERION, convert ONLY from string to number
                } else {
                    myCase[myCueId] = myValue;
                }
            });
        });

        $scope.dataset_full_bin = myDataset;

        // re-split dataset, selecting the selected sample (training/testing/all)
        $scope.DataSplitCases($scope.dataset_split.AnalMode, true);
    }

    // initial split the number of cases equally for TRAINING and TESTING
    $scope.dataset_split = {};
    $scope.dataset_split.AnalMode = 'training';
    $scope.dataset_split.AllCases = $scope.dataset_full_orig.length;
    $scope.dataset_split.TrainNum = Math.floor($scope.dataset_split.AllCases/2);
    $scope.dataset_split.TrainPerc = $scope.dataset_split.TrainNum/$scope.dataset_split.AllCases *100;
    $scope.dataset_split.TrainPerc = parseFloat($scope.dataset_split.TrainPerc.toFixed(1)); // leave only one decimal
    $scope.dataset_split.TestNum = $scope.dataset_split.AllCases - $scope.dataset_split.TrainNum;
    $scope.dataset_split.TestPerc = $scope.dataset_split.TestNum/$scope.dataset_split.AllCases *100;
    $scope.dataset_split.TestPerc = parseFloat($scope.dataset_split.TestPerc.toFixed(1)); // leave only one decimal
    $scope.dataset_split.ReshuffleCycles = 100;  // initial value for multiple reshuffle

    // activate slider for dataset split, don't analyse
    //DataSplitSlider($scope.dataset_split.TrainNum, $scope.dataset_split.AllCases, false);

    // set sortable options
    $scope.sortableOptions = {
        connectWith: '.sortable_area',
        handle: '.widget_title',        // Set the handle to the top bar
        placeholder: 'widget_placeholder',
        forcePlaceholderSize: 'true',
        items: 'li:not(.unsortable)',
        //helper: 'clone',
        revert: true,
        cancel: '.unsortable',
        update: function (event, ui) {
            // doesn't update in time with angular ui-sortable, use STOP event
        },
        stop: function( event, ui ) {

            // activate expand buttons
            //ButtonsExpandCue();

            // take care of the arrows and exits
            //UpdateArrowsAndExits($scope.heuristic_name, $scope.drag_tree);

            console.log($scope);
        }
    }

    // WATCH IF validities WAS UPDATED
    $scope.$watchCollection('validities', function() {
        console.log('WATCH validities');

        if ($scope.validities.length>0) {

            // depending on the heuristic, analyse
            switch ($scope.heuristic_name) {

                case 'Take The Best':

                    // sort cues in the tree by selected validity order
                    $scope.drag_tree = OrderCuesByValiditiesTable($scope.drag_tree, $scope.validities);

                    break;

                case 'Weighted Tallying':

                    // update statistics
                    var myAnalysis = AnalyseDataset($scope.heuristic_name,
                                                    $scope.dataset_selected_bin,
                                                    $scope.cues_enabled,
                                                    $scope.drag_criterion,
                                                    $scope.drag_tree,
                                                    $scope.validities,
                                                    $scope.validities_ordered_by);
                    // update scope
                    $scope.general_stats = myAnalysis.general_stats;
                    $scope.drag_tree = myAnalysis.cues_stats;
                    //$scope.dataset_stepinfo = myAnalysis.dataset_stepinfo;
                    //$scope.dataset_stepinfo_colheads = Object.keys($scope.dataset_stepinfo[0]);
                    $scope.RenderDatasetStepInfoTable();

                    break
            }
        }
        // add validity tags
        //UpdateValidityTags($scope.heuristic_name, 'tree', $scope.validities);
    });

    // WATCH IF drag_criterion WAS UPDATED
    $scope.$watchCollection('drag_criterion', function() {
        $scope.drag_target = 'drag_criterion';
        console.log('WATCH drag_criterion');

        // if criterion has been selected
        if ($scope.drag_criterion.length > 0) {

            // remove arrows and exits
            //$('#criterion_place').find('.arrows_exits').empty();  // FIX THIS!!!

            // disable sortable for the criterion
            $('#criterion_place').removeClass('sortable_area'); // doesn't work using scope and ng-class

            // enable sortable for the tree
            $('#tree').addClass('sortable_area');   // doesn't work using scope and ng-class

            // update criterion's cue type
            //$scope.drag_criterion = UpdateCueTypeExitBranches($scope.heuristic_name, $scope.drag_criterion, 'criterion');
            $scope.drag_criterion[0].CueType = 'criterion';

            // rename yes/no, leave if changed
            if ($scope.drag_criterion[0].BranchYesName == 'yes' && $scope.drag_criterion[0].BranchNoName == 'no') {
                $scope.drag_criterion[0].BranchYesName = 'signal';
                $scope.drag_criterion[0].BranchNoName = 'noise';
            }

            // convert values to binary
            $scope.ConvertToBinary();
            //var myConversion = ConvertToBinary($scope.dataset_full_orig, $scope.heuristic_info, $scope.cues_enabled);
            //$scope.dataset_full_bin = myConversion.dataset_binary;
            //$scope.heuristic_info.CueMapping = myConversion.CueMapping;

            // split dataset, use only selected part for analysis
            //$scope.dataset_selected_bin = $scope.dataset_full_bin.slice(0,$scope.dataset_split.TrainNum);

            // depending on the heuristic, do the following
            switch ($scope.heuristic_name) {

                case 'Fast-and-Frugal Tree':

                    // analyse every cue in cues_list as one-cue-tree
                    /*$scope.drag_cues_list.forEach(function(myCueObj, myIndex) {
                        var myAnalysis = AnalyseDataset($scope.heuristic_name,
                                                        $scope.dataset_selected_bin,
                                                        $scope.drag_criterion,
                                                        [myCueObj]);
                        $scope.drag_cues_list[myIndex] = myAnalysis.cues_stats[0];
                    });
                    // get statistics
                    var myAnalysis = AnalyseDataset($scope.heuristic_name,
                                                    $scope.dataset_selected_bin,
                                                    $scope.drag_criterion,
                                                    $scope.drag_tree);
                    // update statistics
                    $scope.general_stats = myAnalysis.general_stats;*/

                    break;

                case 'Take The Best':
                case 'Minimalist':
                case 'Tallying':
                case 'Weighted Tallying':

                    // calculate validities - $watchCollection('validities') will order cues in the tree by validity
                    //$scope.validities = GetValidities($scope.dataset_full_bin, $scope.drag_criterion, $scope.cues_enabled);

                    // calculate validities using TRAINING sample of dataset
                    var myDataTrain = $scope.dataset_full_bin.slice(0,$scope.dataset_split.TrainNum);
                    $scope.validities = GetValidities(myDataTrain, $scope.drag_criterion, $scope.cues_enabled);

                    // by default, invert reverse, because we want descending initially
                    $scope.validities_reverse = true;
                    // by default, order cues by validity
                    $scope.validities = $scope.OrderValiditiesTable('validity');

                    // split cues to enabled and disabled
                    var enabledCuesList = $.grep($scope.drag_cues_list, function(e){ return e.IsDisabled == false; });
                    var disabledCuesList = $.grep($scope.drag_cues_list, function(e){ return e.IsDisabled == true; });

                    // check if cues_list is not empty (for initial ShowHeur)
                    if (enabledCuesList.length>0) {
                        $scope.drag_tree = enabledCuesList;
                        $scope.drag_cues_list = disabledCuesList;
                    }

                    break;

            }

        // if criterion was removed
        } else {

            // unlock the criterion area
            $('#criterion_place').addClass('sortable_area');

            // disable sortable for the tree
            $('#tree').removeClass('sortable_area');   // doesn't work using scope and ng-class

            // move all cues from tree to cues list, next to criterion and disabled cues
            $scope.drag_cues_list = $.merge($scope.drag_cues_list, $scope.drag_tree);
            $scope.drag_tree = [];

            // rename signal/noise, leave if changed
            $scope.cues_enabled.forEach(function(myCueObj, myIndex) {

                if (myCueObj.BranchYesName == 'signal' && myCueObj.BranchNoName == 'noise') {
                    myCueObj.BranchYesName = 'yes';
                    myCueObj.BranchNoName = 'no';
                }
            });

            // reset general statistics and validity table
            $scope.validities = [];
            $scope.general_stats = {};

            // reset statistics
            ResetCuesStatistics($scope.drag_cues_list);

        }

    });

    // WATCH IF drag_tree WAS UPDATED
    $scope.$watchCollection('drag_tree', function() {
        $scope.drag_target = 'drag_tree';
        console.log('WATCH drag_tree');

        // if tree is not empty
        if ($scope.drag_tree.length > 0) {

            $scope.drag_tree = UpdateCueTypeExitBranches($scope.heuristic_name, $scope.drag_tree, 'treecue');

            // update statistics
            $scope.GetGeneralAndTreeStats();

            // activate sliders and swap buttons
            //SplitValueSliderChangeSwap($scope.drag_tree);

            // activate statistics button - switch between stats of this cue & stats of the tree up to this cue
            //ButtonsCueStats($scope.drag_tree);   //DISABLED FOR TESTING!!!
        }

        // update size of tree
        $scope.heuristic_info.SizeCues = $scope.drag_tree.length;
    });

    // WATCH IF drag_cues_list WAS UPDATED
    $scope.$watchCollection('drag_cues_list', function() {
        $scope.drag_target = 'drag_cues_list';
        console.log('WATCH drag_cues_list');

        $scope.drag_cues_list = UpdateCueTypeExitBranches($scope.heuristic_name, $scope.drag_cues_list, 'cue');

        // remove arrows and exits
        //$('#cues_list').find('.arrows_exits').empty();

        // remove tags
        //UpdateValidityTags($scope.heuristic_name, 'drag_cues_list');
    });

    //////////////////////////////////////////////////
    // END - SHOULD BE THE SAME IN BOTH CONTROLLERS CreateHeur AND ShowHeur
    //////////////////////////////////////////////////
}
