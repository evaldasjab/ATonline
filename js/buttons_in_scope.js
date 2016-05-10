/**
 * Created by evo on 10/04/16.
 */

function EnableAllButtons($scope, $timeout) {

    //console.log('RUN Enable All Buttons');

    $scope.GetAndOrderValidities = function() {

        // calculate validities using TRAINING sample of dataset
        $scope.dataset_train_bin = $scope.dataset_full_bin.slice(0,$scope.dataset_split.TrainNum);
        $scope.validities = GetValidities($scope.dataset_train_bin, $scope.drag_criterion, $scope.cues_enabled);

        // by default, invert reverse, because we want descending initially
        $scope.validities_reverse = true;

        // by default, order cues by validity
        $scope.validities = $scope.OrderValiditiesTable('validity');
    }

    $scope.GetGeneralAndTreeStats = function() {

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

        if ($scope.heuristic_name == 'Fast-and-Frugal Tree') {

            // update multiple logistic regression - DISABLE UNTIL DONE!
            /*$scope.multi_logistic_regression = MultiLogisticRegression ($scope.dataset_train_bin,
                                                                        $scope.dataset_selected_bin,
                                                                        $scope.drag_criterion,
                                                                        $scope.cues_enabled);*/
        } else {
            // update multiple linear regression
            $scope.multi_linear_regression = MultiLinearRegression ($scope.dataset_train_bin,
                                                                    $scope.dataset_selected_bin,
                                                                    $scope.drag_criterion,
                                                                    $scope.drag_tree);

            $scope.unit_weight_linear_model = LinearModel ('UWLM',
                                                            $scope.dataset_selected_bin,
                                                            $scope.drag_criterion,
                                                            $scope.drag_tree,
                                                            $scope.validities,
                                                            $scope.validities_ordered_by);
            $scope.weighted_linear_model = LinearModel ('WLM',
                                                            $scope.dataset_selected_bin,
                                                            $scope.drag_criterion,
                                                            $scope.drag_tree,
                                                            $scope.validities,
                                                            $scope.validities_ordered_by);
        }
    }

    $scope.ButtonDisableCue = function (event) {
        console.log('RUN Button Disable Cue');

        // mark the cue semi-transparent
        $(event.target).closest('.widget').find('.widget_head').toggleClass('cue_disabled unsortable');

        var myCueId = $(event.target).closest('.widget').attr('id');
        console.log('DISABLE: ' + myCueId);

        var myCueObj = $.grep($scope.drag_cues_list, function (e) {
            return e.CueName == myCueId;})[0];
        myCueObj.IsDisabled = myCueObj.IsDisabled ? false : true;

        // update the list of ENABLED cues
        $scope.cues_enabled = $.grep($scope.cues_all, function(e){ return e.IsDisabled == false; });
    }


    $scope.ButtonExpandCue = function(event) {
        console.log('RUN Button Expand Cue');

        $(event.target).closest('.widget').find('.widget_content').slideToggle();

        $scope.$broadcast('reCalcViewDimensions');
    }
    $scope.RefreshSlider = function () {
        // wait for 0.4 sec to finish animation
        $timeout(function () {
            $scope.$broadcast('rzSliderForceRender');
        }, 400);
    }


    $scope.ButtonExpandAllCues = function(myCuesArray) {

        console.log('RUN Button Expand All Cues');

        var expandAll = true;

        myCuesArray.forEach(function(myCueObj) {

            // if at least one widget is expanded, collapse all
            if (myCueObj.WidgetExpand == true) {
                expandAll = false;
            }
        });

        /*myCuesArray.forEach(function(myCueObj) {
            // set all to expandAll value - true or false
            myCueObj.WidgetExpand = expandAll;

        });*/

        myCuesArray.forEach(function(myCueObj) {

            console.log(myCueObj.WidgetExpand);
            console.log(expandAll);

            // if widget is collapsed and all should be expanded AND vice versa
            if (myCueObj.WidgetExpand != expandAll) {

                // trigger click manually
                $timeout(function() {
                    console.log('trigger CLICK!');
                    console.log(myCueObj.CueName);
                    angular.element('#'+myCueObj.CueName).find('.button_expand_div').triggerHandler('click');
                }, 0);
            }
        });
    }


    $scope.ButtonsChangeCueStats = function(event) {
        console.log('RUN Button Change Cue Stats');

        $(event.target).closest('.widget_content').find('.conting_cue').slideToggle();
        $(event.target).closest('.widget_content').find('.conting_tree').slideToggle();
        $(event.target).closest('.widget_content').find('.stat_cue').slideToggle();
        $(event.target).closest('.widget_content').find('.stat_tree').slideToggle();

    }

    $scope.ButtonShowDatasetStepInfo = function() {
        console.log('RUN Button Dataset Step Info');

        $scope.RenderDatasetStepInfoTable();

        //$(event.target).closest('.widget').find('.widget_content').slideToggle();
        $('#dataset_stepinfo_container').slideToggle();

        // wait for 0.4 sec to finish animation
        $timeout(function () {
            $scope.dataset_stepinfo_hot.render();
        }, 400);
    }
    $scope.RenderDatasetStepInfoTable = function() {

        var myContainer = document.getElementById('dataset_stepinfo_container');

        $scope.dataset_stepinfo_hot = new Handsontable(myContainer, {
            //var hot = new Handsontable(myContainer, {
            data: $scope.general_stats.dataset_stepinfo,
            colHeaders: $scope.general_stats.dataset_stepinfo_colheads,
            rowHeaders: true
            //columns: {data: 'StepInfo', className: "htLeft"}
        });
    }

    $scope.ButtonShuffleOrderOfCues = function() {

        // reorder tree cues randomly
        var myArray = $scope.drag_tree;
        for(var j, x, i = myArray.length; i; j = Math.floor(Math.random() * i), x = myArray[--i], myArray[i] = myArray[j], myArray[j] = x);

    }

    $scope.ButtonShuffleDatasetCases = function() {

        var myArray = $scope.dataset_full_bin;
        for(var j, x, i = myArray.length; i; j = Math.floor(Math.random() * i), x = myArray[--i], myArray[i] = myArray[j], myArray[j] = x);

        $scope.DataSplitCases($scope.dataset_split.AnalMode, true);
    }

    $scope.ButtonReshuffle100 = function() {
        console.log('SHUFFLE 100 BUTTON!');

        // don't react, if input field is selected to change the number of reshuffle cycles
        $('#reshuffle_cycles').mouseup(function(event){
            event.stopPropagation();
        });

        // hide statistics table
        //$('#shuffle_100_table').hide();

        // enable the button
        //$('#shuffle_100').prop('disabled', false);

        // reset just in case
        //$('#shuffle_100').unbind('mouseup');

        // prepare arrays for derivative statistics
        var myPhitsArray = [];
        var myPhitsMinArray = [];
        var myDprimArray = [];
        var myFrugArray = [];
        var myBiasArray = [];

        // use the WHOLE dataset, make DEEP COPY
        var myDataset = $.extend(true, [], $scope.dataset_full_bin);  //  DEEP copy

        // get the number of reshuffling
        var myCycles = $scope.dataset_split.ReshuffleCycles;

        for (var cycle = 0; cycle < myCycles; cycle++) {

            // reorder dataset's cases randomly
            var myArray = myDataset;
            for(var j, x, i = myArray.length; i; j = Math.floor(Math.random() * i), x = myArray[--i], myArray[i] = myArray[j], myArray[j] = x);

            // get cases for testing
            var myDatasetTest = myDataset.slice($scope.dataset_split.TrainNum,$scope.dataset_split.AllCases);

            // get statistics
            var myAnalysis = AnalyseDataset($scope.heuristic_name,
                                            myDatasetTest,
                                            $scope.cues_enabled,
                                            $scope.drag_criterion,
                                            $scope.drag_tree,
                                            $scope.validities,
                                            $scope.validities_ordered_by);

            // remember derivative statistics
            myPhitsArray.push(myAnalysis.general_stats.PHITS);
            myPhitsMinArray.push(myAnalysis.general_stats.PHITSMINUSPFA);
            myDprimArray.push(myAnalysis.general_stats.DPRIME);
            myFrugArray.push(myAnalysis.general_stats.FRUGALITY);
            myBiasArray.push(myAnalysis.general_stats.BIAS);
        }

        // get the average of statistics
        $scope.general_stats.PHITS_100 = myPhitsArray.reduce(function(a, b) { return a + b; }) / myCycles;
        $scope.general_stats.PHITSMINUSPFA_100 = myPhitsMinArray.reduce(function(a, b) { return a + b; }) / myCycles;
        $scope.general_stats.DPRIME_100 = myDprimArray.reduce(function(a, b) { return a + b; }) / myCycles;
        $scope.general_stats.FRUGALITY_100 = myFrugArray.reduce(function(a, b) { return a + b; }) / myCycles;
        $scope.general_stats.BIAS_100 = myBiasArray.reduce(function(a, b) { return a + b; }) / myCycles;

        // show the statistics table
        $('#shuffle_100_table').slideDown();
    }

    $scope.ButtonContingencyTableShowPercent = function() {

        // hide cue stats and show tree stats, sliding left
        $('#stats_column #cont_number').slideToggle();
        $('#stats_column #cont_percent').slideToggle();

    }
}

