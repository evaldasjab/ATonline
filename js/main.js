/**
 * Javascript commands for mytoolbox.html
 */

// in DATASET_SHOW.HTML - converts the dataset to the original format
function ConvertDataset(myDataset, myFormat) {

    var myConvertedDataset = [];

    switch (myFormat) {

        case 'forServer':

            // go through every object (case/row) in the data array
            myDataset.forEach(function(myCaseObj, myIndex) {    // "forEach" works for arrays only

                //console.log(myCaseObj);

                // go through every cue/attribute in the case
                for (var myCue in myCaseObj ) {          // "for in" works for objects, not only arrays

                    //console.log(myCue);

                    var myNewCaseObj = {};
                    //myCueObj.CueId = i;
                    myNewCaseObj.CaseId = myIndex;
                    myNewCaseObj.CueName = myCue;
                    myNewCaseObj.CueValue = myCaseObj[myCue];

                    //console.log(myNewCaseObj);

                    myConvertedDataset.push(myNewCaseObj);
                };
            });

            break;

        case 'forClient':

            // get the first case id, probably it's 0
            var myCaseId = myDataset[0].CaseId;
            var myNewCaseObj = {};

            // go through every object (case/row) in the data array
            myDataset.forEach(function(myEntryObj, myIndex) {    // "forEach" works for arrays only
                //console.log(myEntryObj);

                // if already went through all entries of one case
                if (myEntryObj.CaseId != myCaseId) {
                    myConvertedDataset.push(myNewCaseObj); // add to array
                    myCaseId ++;       // next case
                    myNewCaseObj = {}; // reset obj
                };

                var myCueName = myEntryObj.CueName;
                var myCueValue = myEntryObj.CueValue;

                //console.log(myCueName);
                //console.log(myCueValue);

                myNewCaseObj[myCueName] = myCueValue;

                //console.log(myNewCaseObj);
            });
            myConvertedDataset.push(myNewCaseObj); // add the last case to array
            break;
    };
    //console.log(myConvertedDataset);

    return myConvertedDataset;
}


// in DATASET_SHOW.HTML - displays dataset in a Excel-style table
function ShowTable(myDataset) {
    //console.log(JSON.stringify(my_data, null, "  "));
    myContainer = document.getElementById('dataset_container');

    var hot = new Handsontable(myContainer, {
        data: myDataset,
        colHeaders: function(index) {
            return Object.keys(myDataset[0])[index];
        },
        rowHeaders: true,
        minSpareRows: 1
    });
}

// finds min, max values and sets mean value as a split value
function GetSplitValues(myDataset) {

    var mySplitValuesArray = [];

    // go through every attribute
    for (var myAttr in myDataset[0] ) {

        //console.log('myAttr: '+myAttr);

        // initial values based on the first case
        var myAttrMin = myDataset[0][myAttr];
        var myAttrMax = myDataset[0][myAttr];

        // go through every object (case/row) in the data array
        // and find MIN and MAX values
        myDataset.forEach(function(myObj) {
            //console.log('HERE CHECK! myObj: '+JSON.stringify(myObj, null, "  "));

            // get MIN and MAX values
            if (myObj[myAttr] < myAttrMin) {
                myAttrMin = myObj[myAttr];
            }
            if (myObj[myAttr] > myAttrMax) {
                myAttrMax = myObj[myAttr];
            }
        });
        var myAttrMean = (myAttrMax + myAttrMin) / 2;

        var mySplitObj = {};
        mySplitObj.CueName = myAttr;
        mySplitObj.MinValue = myAttrMin;
        mySplitObj.MaxValue = myAttrMax;
        mySplitObj.SplitValue = myAttrMean;
        mySplitObj.IsFlipped = false;
        mySplitValuesArray.push(mySplitObj);
    }

    //console.log('mySplitValuesArray: '+JSON.stringify(mySplitValuesArray, null, "  "));

    return mySplitValuesArray;
}

// converts continuous data to binary based on split values
function ConvertToBinary(myDataset, myOrigDataset, mySplitValuesArray) {

    //console.log('CONVERT mySplitValuesArray: '+JSON.stringify(mySplitValuesArray, null, "  "));
    //console.log('BEFORE Dataset: '+JSON.stringify(mySet, null, "  "));
    //console.log('TRUE Dataset: '+JSON.stringify(myTrueSet, null, "  "));

    // go through every attribute
    for (var myAttr in mySplitValuesArray) {
        //console.log(i+'i LOOP! myAttrValues: '+JSON.stringify(myAttrValues, null, "  "));

        var myAttrValues = mySplitValuesArray[myAttr];

        // go through every object (case/row) in the ORIGINAL data array (results)
        // and replace value to 0 or 1, based on the split value in the BINARY data array (myDataset)
        for (var myCase in myDataset) {  //myDataset.forEach(function(myObj) {

            var myOrigObj = myOrigDataset[myCase];
            var myObj = myDataset[myCase];
            //console.log(c+'c LOOP! myOrigObj: '+JSON.stringify(myOrigObj, null, "  "));
            //console.log(c+'c LOOP! myObj: '+JSON.stringify(myObj, null, "  "));

            // replace value to 0, if it's in range of MIN (included) and SPLIT (included)
            if ( (myOrigObj[myAttrValues.CueName] >= myAttrValues.MinValue) && (myOrigObj[myAttrValues.CueName] <= myAttrValues.SplitValue) ) {
                //console.log('MIN-SPLIT');
                switch (myAttrValues.IsFlipped) {
                    case false:
                        //console.log('NOT FLIPPED, so 0');
                        myObj[myAttrValues.CueName] = 0;
                        break;
                    case true:
                        //console.log('FLIPPED, so 1');
                        myObj[myAttrValues.CueName] = 1;
                        break;
                }
                // replace value to 1, if it's in range of SPLIT (excluded) and MAX (included)
            } else if ( (myOrigObj[myAttrValues.CueName] > myAttrValues.SplitValue) && (myOrigObj[myAttrValues.CueName] <= myAttrValues.MaxValue) ) {
                //console.log('SPLIT-MAX');
                switch (myAttrValues.IsFlipped) {
                    case false:
                        //console.log('NOT FLIPPED, so 1');
                        myObj[myAttrValues.CueName] = 1;
                        break;
                    case true:
                        //console.log('FLIPPED, so 0');
                        myObj[myAttrValues.CueName] = 0;
                        break;
                }
            }
        };
    }

    // add OR update the processed split_value to the dataset
    /*if (myDataset.split_values == undefined) {
        myDataset.split_values = mySplitValuesArray;
    } else {
        var mySplitId = mySplitValuesArray[0].id;
        var result = $.grep(mySet.split_values, function(e){ return e.id == mySplitId; });
        result[0] = mySplitValuesArray[0];
    }*/

    //console.log('AFTER Dataset: '+JSON.stringify(myDataset, null, "  "));
    //console.log('Orig Dataset: '+JSON.stringify(myOrigSet, null, "  "));

    return myDataset;
}

// makes cues draggable and sortable with jqueryui
function DragCues() {

    $('.sortable_area').sortable({
        connectWith: '.sortable_area',
        //helper: 'clone',
        handle: '.widget_title',        // Set the handle to the top bar
        placeholder: 'widget_placeholder',
        forcePlaceholderSize: 'true',
        items: 'li:not(.unsortable)',
        revert: true,
        update: function(event,ui) {

            var currentList = $(this);

            // if criterion list is updated, make sure only one widget is there
            if (currentList.attr('id') == 'criterion_place') {
                if (currentList.children().length > 0) {  // lets drop a cue = criterion when empty
                    console.log('check on update: one criterion!');
                    $(this).removeClass('sortable_area');
                } else {
                    console.log('check on update: zero criterion!');
                    $(this).addClass('sortable_area');
                }
            }

            /*// if tree list is updated, take care of the arrows and exits
            if (currentList.attr('id') == 'tree') {
                UpdateArrowsAndExits();
            }*/

            UpdateArrowsAndExits(currentList.attr('id'));

            var myJsonTreeObj = UpdateJsonTreeObj();
            UpdateScope(myJsonTreeObj);

            //console.log('cues: '+ $('#cues_list').sortable('toArray') );
            //console.log('criterion: '+ $('#criterion_place').sortable('toArray') );
            //console.log('tree: '+ $('#tree').sortable('toArray') );
            //console.log('$this: '+ $(this).sortable('toArray') );
            //console.log('********DONE**********');

        }
    }).disableSelection();

}


// makes cues draggable and sortable with jqueryui
function DragCriterion(myHeuristic, myDataset) {

    console.log(myHeuristic);

    $('.sortable_area').sortable({
        connectWith: '.sortable_area',
        //helper: 'clone',
        handle: '.widget_title',        // Set the handle to the top bar
        placeholder: 'widget_placeholder',
        forcePlaceholderSize: 'true',
        items: 'li:not(.unsortable)',
        revert: true,
        update: function(event,ui) {

            // get the updated area id
            var myAreaId = $(this).attr('id');

            switch (myAreaId) {

                case 'criterion_place':

                    // if criterion has been selected
                    if ($(this).children().length > 0) {

                        // disable sortable for the criterion
                        $(this).removeClass('sortable_area');

                        // get the criterion id
                        var myCritId = $(this).sortable('toArray')[0];

                        // calculate validities
                        var myValidArray = GetValidities(myCritId, myDataset);
                        //console.log(myValidArray);

                        // display validities via scope and ng-repeat
                        UpdateScope('validities', myValidArray);   //UpdateScope(myScopeKey, myScopeValue)

                        // depending on the heuristic, do the following
                        switch (myHeuristic) {

                            case 'Fast And Frugal Tree':

                                // nothing?..

                                break;

                            case 'Take The Best':

                                // disable sortable for the tree area
                                $('#tree').removeClass('sortable_area');

                                // rearrange the cues by validities
                                OrderCuesByValidities(myValidArray, 'cues_list');

                                // get the cues in the cues_list
                                var myCuesArray = GetElementsArray('cues_list', 'widget');

                                // add all cues to the decision tree
                                MoveAllCuesToArea(myCuesArray, 'tree');

                                // take care of the arrows and exits
                                UpdateArrowsAndExits(myHeuristic, 'tree');

                                // add validity tags
                                UpdateValidityTags(myHeuristic, 'tree');

                                // JSON from FFT
                                UpdateCuesInfo();

                                // activate the SAVE button
                                ButtonSave(myHeuristic);

                                break;

                            case 'Minimalist':

                                // get the cues in the cues_list
                                var myCuesArray = GetElementsArray('cues_list', 'widget');

                                // build the decision tree
                                MoveAllCuesToArea(myCuesArray, 'tree');

                                // take care of the arrows and exits
                                UpdateArrowsAndExits(myHeuristic, 'tree');

                                // show the shuffle buttons
                                $('#tree').find('.button_shuffle').show();

                                break;

                            case 'Weighted Tallying':
                                // rearrange the cues by validities
                                //OrderCuesByValidities(myValidArray, 'cues_list');

                                // get the cues in the cues_list
                                var myCuesArray = GetElementsArray('cues_list', 'widget');

                                // build the decision tree
                                MoveAllCuesToArea(myCuesArray, 'tree');

                                // take care of the arrows and exits
                                UpdateArrowsAndExits(myHeuristic, 'tree');

                                // show the shuffle buttons
                                $('#tree').find('.button_shuffle').show();

                                // add validity tags
                                UpdateValidityTags(myHeuristic, 'tree');

                                break;

                            case 'Tallying':
                                // rearrange the cues by validities
                                //OrderCuesByValidities(myValidArray, 'cues_list');

                                // get the cues in the cues_list
                                var myCuesArray = GetElementsArray('cues_list', 'widget');

                                // build the decision tree
                                MoveAllCuesToArea(myCuesArray, 'tree');

                                // take care of the arrows and exits
                                UpdateArrowsAndExits(myHeuristic, 'tree');

                                // show the shuffle buttons
                                $('#tree').find('.button_shuffle').show();

                                // add validity tags
                                //AddValidityTags(myHeuristic);

                                break;
                        }

                    } else { // if criterion has been removed

                        // unlock the criterion area
                        $(this).addClass('sortable_area');
                        $('#tree').addClass('sortable_area');

                        // get the list of cues in the tree
                        var myCuesArray = GetElementsArray('tree','widget');

                        // destroy Take The Best decision tree, move the cues back to the initial list,
                        MoveAllCuesToArea(myCuesArray, 'cues_list');

                        // take care of the arrows and exits
                        //UpdateArrowsAndExits('cues_list');

                        // hide the shuffle buttons
                        $('#cues_list').find('.button_shuffle').hide();
                    }

                    break;

                case 'tree':

                    UpdateArrowsAndExits(myHeuristic,'tree');

                    //var myJsonTreeObj = UpdateJsonTreeObj();
                    //UpdateScope(myJsonTreeObj);

                    break;

                case 'cues_list':

                    // take care of the arrows and exits
                    UpdateArrowsAndExits(myHeuristic, 'cues_list');

                    // remove tags
                    UpdateValidityTags(myHeuristic, 'cues_list');

                    break;
            }
        }
    }).disableSelection();

}

// adds all cues to a decision tree
function MoveAllCuesToArea(myCuesArray, myToArea){

    // move the cues to the new area
    myCuesArray.forEach(function (myCueId) {
        $('#' +myCueId).appendTo($('#'+myToArea))
    });
}


function UpdateCuesInfo() {

    // get the order of the cues in the tree
    var myTreeCuesArray = GetElementsArray('tree', 'widget');

    // get the criterion
    var myCritCueArray = GetElementsArray('criterion_place', 'widget');
    if (myCritCueArray.length > 0) {
        var myCritCueId = myCritCueArray[0]  // the first and only in the array
    } else {
        var myCritCueId = '';
    }
    console.log(myTreeCuesArray);
    console.log(myCritCueId);

    // get the cues_info from scope
    var scope = angular.element(document.querySelector('#ng_territory')).scope();
    scope.$apply(function(){
        var myCuesInfoArray = scope['cues_info'];
        console.log(myCuesInfoArray);

        var treeCuesInfoArray = [];

        // in array find object by key! another solution - filter (slow) or find (experimental)
        // find the criterion
        var myFind = $.grep(myCuesInfoArray, function(e){ return e.CueName == myCritCueId; });
        var myCueObj = myFind[0];

        myCueObj.CueType = 'criterion';
        myCueObj.BranchYes = 'exit';
        myCueObj.BranchNo = 'exit';

        treeCuesInfoArray.push(myCueObj);

        // go through every cue in the tree
        myTreeCuesArray.forEach(function(myCueId, myIndex) {    // "forEach" works for arrays only
            console.log(myCueId);

            // find the cue
            var myFind = $.grep(myCuesInfoArray, function(e){ return e.CueName == myCueId; });
            var myCueObj = myFind[0];

            myCueObj.CueType = 'treecue';

            // check if Exit nodes exist
            var myExitLeftTest = $('#'+myCueId).find('.exit_left').length;
            var myExitRightTest = $('#'+myCueId).find('.exit_right').length;

            myCueObj.BranchYes = myExitRightTest == 0 ? 'continue' : 'exit';
            myCueObj.BranchNo = myExitLeftTest == 0 ? 'continue' : 'exit';

            treeCuesInfoArray.push(myCueObj);
        });

        // update cues_info in the scope
        scope.treecues_info = treeCuesInfoArray;
        console.log(scope);
    });
}


function SaveHeuristic(myHeuristic) {

    // take the screenshot
    html2canvas($("#tree"), {
        onrendered: function (canvas) {
            theCanvas = canvas;


            canvas.toBlob(function (blob) {
                saveAs(blob, "Tree.png");
                debugger;
            });
        }
    });

    var myHeurObj = {};
    myHeurObj.DecisionAlgorithm = myHeuristic;
    myHeurObj.Image = '';
}

/*
    {
        //"HeuristicId": 1,
        "DecisionAlgorithm": "sample string 2",
        "Image": "sample string 3",
        "Title": "sample string 4",
        "Date": "sample string 5",
        "UserId": 4,
        "SizeCues": 1,
        "Description": "sample string 6",
        "CueMapping": [
        {
            "MapId": 1,
            "DatasetId": 2,
            "HeuristicId": 3,
            "DatasetCueName": "sample string 4",
            "HeuristicCueName": "sample string 5",
            "SplitValue": 1.1,
            "IsFlipped": true,
        },
        {
            "MapId": 1,
            "DatasetId": 2,
            "HeuristicId": 3,
            "DatasetCueName": "sample string 4",
            "HeuristicCueName": "sample string 5",
            "SplitValue": 1.1,
            "IsFlipped": true,
        }
    ],
        "HeuristicStructure": [
        {
            "EntryId": 1,
            "HeuristicId": 2,
            "CueName": "sample string 3",
            "CueType": "sample string 4",
            "BranchYes": "sample string 5",
            "BranchNo": "sample string 6"
        },
        {
            "EntryId": 1,
            "HeuristicId": 2,
            "CueName": "sample string 3",
            "CueType": "sample string 4",
            "BranchYes": "sample string 5",
            "BranchNo": "sample string 6"
        }
    ]
    }

}*/
















// ANGULAR START ////////////////////////////////////////////////////////


// run angularjs, activate ngRepeatFinished when done (to run functions after Angularjs has finished)
var myApp = angular.module("myApp", ['ngRoute', 'evoApp.services'])
    .directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');

                        console.log('ngRepeatFinished');
                    });
                }
            }
        }
    });

// angularjs configuration, when use which controller
myApp.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'toolbox.html',
            controller: 'ToolboxCtrl'
        }).
        when('/datasets', {
            templateUrl: 'dataset_list.html',
            controller: 'DatasetListCtrl'
        }).
        when('/heuristics', {
            templateUrl: 'heuristic_list.html',
            controller: 'HeuristicListCtrl'
        }).
        when('/datasets/:dataset_id', {
            templateUrl: 'dataset_show.html',
            controller: 'DatasetShowCtrl'
        }).
        when('/heuristics/:heuristic_id', {
            templateUrl: 'heur.html',
            controller: 'HeuristicShowCtrl'
        }).
        when('/:dataset_id/new_ttb', {
            templateUrl: 'heur.html',
            controller: 'TakeTheBestCtrl'
        }).
        when('/:dataset_id/tree/:tree_id', {
            templateUrl: 'tree.html',
            controller: 'TreeCtrl'
        }).
        when('/:dataset_id/ttb/:heur_id', {
            templateUrl: 'heur.html',
            controller: 'OldTakeTheBestCtrl'
        }).
        when('/:dataset_id/mini/:heur_id', {
            templateUrl: 'heur.html',
            controller: 'MinimalistCtrl'
        }).
        when('/:dataset_id/weta/:heur_id', {
            templateUrl: 'heur.html',
            controller: 'WeightedTallyingCtrl'
        }).
        when('/:dataset_id/tall/:heur_id', {
            templateUrl: 'heur.html',
            controller: 'TallyingCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
});

// get and cache the info from the server
myApp.factory('getDatasetInfoFactory', function($http, datasetInfoesService){

    function getData(callback){

        // get data from the server using Web API for angularjs
        datasetInfoesService.getDatasetInfo()
            .success(callback)
            .error(function (errdata, status, headers, config) {
                console.log('FAIL getDatasetInfo:');
                console.log(errdata);
            });

       /* $http({
            method: 'GET',
            url: 'json/trees_info.json',
            cache: true
        }).success(callback);*/
    }

    return {
        list: getData,
        find: function(myid, callback){
            getData(function(data) {
                var myDataInfo = data.filter(function(entry){
                    return entry.DatasetId == myid;
                })[0];
                callback(myDataInfo);
            });
        }
    };
});

// angularjs for toolbox.html
myApp.controller("ToolboxCtrl", function($scope, $http, getDatasetInfoFactory, heuristicInfoesService) {
//myApp.controller("DatasetListCtrl", function($scope, $http, datasetInfoesService) {

    // change the page's title
    $('#page_title').html('ADAPTIVE TOOLBOX Online');
    // change the color of the active menu
    $('#menu_mytoolbox').addClass('active');
    $('#menu_datasets').removeClass('active');
    $('#menu_heuristics').removeClass('active');

    getDatasetInfoFactory.list(function(data) {
        $scope.datasets = data;
    });

    // get data from the server using Web API for angularjs
    heuristicInfoesService.getHeuristicInfo()
        .success(function (data) {
            console.log('SUCCESS getHeuristicInfo:');
            console.log(data);
            $scope.heuristics = data;

        }).error(function (errdata, status, headers, config) {
            console.log('FAIL getHeuristicInfo:');
            console.log(errdata);
        });

    console.log($scope);
});

// angularjs for dataset_list.html
myApp.controller("DatasetListCtrl", function($scope, $http, getDatasetInfoFactory) {
//myApp.controller("DatasetListCtrl", function($scope, $http, datasetInfoesService) {

    // change the page's title
    $('#page_title').html('ADAPTIVE TOOLBOX Online');
    // change the color of the active menu
    $('#menu_mytoolbox').removeClass('active');
    $('#menu_datasets').addClass('active');
    $('#menu_heuristics').removeClass('active');

    getDatasetInfoFactory.list(function(datasets) {
        $scope.datasets = datasets;
    });

        // get data from the server using Web API for angularjs
        /*datasetInfoesService.getDatasetInfo()
            .success(function (data) {
                console.log('SUCCESS getDatasetInfo:');
                console.log(data);
                $scope.datasets = data;

            }).error(function (errdata, status, headers, config) {
                console.log('FAIL getDatasetInfo:');
                console.log(errdata);
            });*/

    console.log($scope);
});

// angularjs for dataset_list.html
myApp.controller("HeuristicListCtrl", function($scope, $http, heuristicInfoesService) {
//myApp.controller("DatasetListCtrl", function($scope, $http, datasetInfoesService) {

    // change the page's title
    $('#page_title').html('ADAPTIVE TOOLBOX Online');
    // change the color of the active menu
    $('#menu_mytoolbox').removeClass('active');
    $('#menu_datasets').removeClass('active');
    $('#menu_heuristics').addClass('active');

    // get data from the server using Web API for angularjs
    heuristicInfoesService.getHeuristicInfo()
        .success(function (data) {
            console.log('SUCCESS getHeuristicInfo:');
            console.log(data);
            $scope.heuristics = data;

        }).error(function (errdata, status, headers, config) {
            console.log('FAIL getHeuristicInfo:');
            console.log(errdata);
        });

    console.log($scope);
});

// angularjs for dataset_show.html
myApp.controller('DatasetShowCtrl', function ($scope, $routeParams, datasetInfoesService, datasetFullsService){

    // change the page's title
    $('#page_title').html('ADAPTIVE TOOLBOX Online');

    console.log($routeParams);

    // get data from the server using Web API for angularjs
    datasetInfoesService.getDatasetInfo2($routeParams.dataset_id)
        .success(function (data) {
            console.log('SUCCESS getDatasetInfo:');
            console.log(data);
            $scope.dataset_info = data;

        }).error(function (errdata, status, headers, config) {
            console.log('FAIL getDatasetInfo:');
            console.log(errdata);
        });

    // get data from the server using Web API for angularjs
    datasetFullsService.getDatasetFullsByDatasetId($routeParams.dataset_id)
        .success(function (data) {
            console.log('SUCCESS getDatasetFULL:');
            console.log(data);

            // convert the table to the format for the browser
            var myDataset = ConvertDataset(data, 'forClient');

            $scope.dataset_full = myDataset;

            //console.log($scope);

            // create the table with "handsontable.js"
            ShowTable($scope.dataset_full);

        }).error(function (errdata, status, headers, config) {
            console.log('FAIL getDatasetFULL:');
            console.log(errdata);
        });

    console.log($scope);

});

// angularjs for dataset_show.html
myApp.controller('HeuristicShowCtrl', function ($scope, $routeParams, $q, heuristicInfoesService, heuristicStructuresService, datasetFullsService){

    // change the page's title
    $('#page_title').html('Take The Best');

    console.log($routeParams);
    var myDatasetId = '';

    $q.all([   // angular promise - when this is done, then do the next
        // get data from the server using Web API for angularjs
        heuristicInfoesService.getHeuristicInfo2($routeParams.heuristic_id)
            .success(function (data) {
                console.log('SUCCESS getHeuristicInfo:');
                console.log(data);
                $scope.heuristic_info = data;

                myDatasetId = data.CueMapping[0].DatasetId;
                $scope.dataset_id = myDatasetId;
                $scope.cues_info = data.CueMapping;  // here are split values - in place of splitValuesArray

            }).error(function (errdata, status, headers, config) {
                console.log('FAIL getHeuristicInfo:');
                console.log(errdata);
            })
    ]).then(function() {

        // get data from the server using Web API for angularjs
        datasetFullsService.getDatasetFullsByDatasetId(myDatasetId)
            .success(function (data) {
                console.log('SUCCESS getDatasetFULL:');
                //console.log(data);

                // convert the table to the format for the browser
                var myDataset = ConvertDataset(data, 'forClient');
                $scope.dataset_full = myDataset;

                // DEEP COPY the original dataset!
                var origDataset = jQuery.extend(true, {}, $scope.dataset_full);   //was GLOBAL VARIABLE!
                $scope.dataset_original = origDataset;

                // get split values - means (average of min and max) of every variable's values
                //var splitValuesArray = GetSplitValues($scope.dataset_full);
                //$scope.cues_info = splitValuesArray;

                // convert values to binary
                var binDataset = ConvertToBinary($scope.dataset_full, origDataset, $scope.cues_info);
                $scope.dataset_binary = binDataset;

                // add the empty array for validities
                $scope.validities = [];

                // activate drag'n'drop of cues
                DragCriterion('Take The Best', $scope.dataset_binary);

                // activate expand buttons
                ButtonsExpand();

                console.log($scope);

            }).error(function (errdata, status, headers, config) {
                console.log('FAIL getDatasetFULL:');
                console.log(errdata);
            });
    })

});

// angularjs for ttb.html
myApp.controller('TakeTheBestCtrl', function ($scope, $routeParams, datasetFullsService){

    // change the page's title
    $('#page_title').html('Take The Best');

    // create heuristic_info with initial values
    var myHeurInfoObj = {};
    myHeurInfoObj.Title = 'Please Name Your Heuristic';
    myHeurInfoObj.Image = '';
    myHeurInfoObj.Date = 'NOT SAVED YET';  // FIX THIS!!!
    myHeurInfoObj.Username = 'Steve Jobs'  // FIX THIS!!!
    myHeurInfoObj.SizeCues = 0;            // FIX THIS!!! must be updated when there are cues in the tree
    myHeurInfoObj.UsageUsers = 1;          // FIX THIS!!!
    myHeurInfoObj.UsageDatasets = 1;       // FIX THIS!!!
    myHeurInfoObj.Description = 'Please describe your heuristic';
    $scope.heuristic_info = myHeurInfoObj;

    console.log($routeParams);
    $scope.dataset_id = $routeParams.dataset_id;
    //$scope.heur_id = $routeParams.heur_id;

    // get data from the server using Web API for angularjs
    datasetFullsService.getDatasetFullsByDatasetId($routeParams.dataset_id)
        .success(function (data) {
            console.log('SUCCESS getDatasetFULL:');
            //console.log(data);

            // convert the table to the format for the browser
            var myDataset = ConvertDataset(data, 'forClient');
            $scope.dataset_full = myDataset;

            // DEEP COPY the original dataset!
            var origDataset = jQuery.extend(true, {}, $scope.dataset_full);   //was GLOBAL VARIABLE!
            $scope.dataset_original = origDataset;

            // get split values - means (average of min and max) of every variable's values
            var splitValuesArray = GetSplitValues($scope.dataset_full);
            $scope.cues_info = splitValuesArray;

            // convert values to binary
            var binDataset = ConvertToBinary($scope.dataset_full, origDataset, splitValuesArray);
            $scope.dataset_binary = binDataset;

            // add the empty array for validities
            $scope.validities = [];

            // activate drag'n'drop of cues
            //DragCriterion('Take The Best', $scope.dataset_binary);

            // activate expand buttons
            //ButtonsExpand();

        }).error(function (errdata, status, headers, config) {
            console.log('FAIL getDatasetFULL:');
            console.log(errdata);
        });

    console.log($scope);

    // in array find object by key! another solution - grep or filter
    //heuristics_info.find($routeParams.heur_id, function(my_heur) {
    //    $scope.heuristics_info = my_heur;
    //});

    // execute function when ng-repeat is done
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) { //you also get the actual event object

        console.log('NGREPEAT FINISHED');

        // activate drag'n'drop of cues
        DragCriterion('Take The Best', $scope.dataset_binary);

        // activate expand buttons
        ButtonsExpand();
     });

});

function GetScope(myScopeKey) {
    var scope = angular.element(document.querySelector('#ng_territory')).scope();
    scope.$apply(function(){
        var myScopeValue = scope[myScopeKey];

        // DEEP COPY the variable
        var origScopeValue = jQuery.extend(true, {}, myScopeValue);
        console.log(origScopeValue);
        return origScopeValue;
    });
}
function UpdateScope(myScopeKey, myScopeValue) {
    var scope = angular.element(document.querySelector('#ng_territory')).scope();
    scope.$apply(function(){
        scope[myScopeKey] = myScopeValue;
        //scope.jsonTreeObj = jsonTreeObj;
    });
    console.log(scope);
}

// angularjs for tree.html
myApp.controller('TreeCtrl', function ($scope, $routeParams, $http, trees, cueInfoService){

    // change the page's title
    $('#page_title').html('Fast-And-Frugal Tree');

    console.log($routeParams);
    $scope.dataset_id = $routeParams.dataset_id;
    $scope.tree_id = $routeParams.tree_id;

    trees.find($routeParams.tree_id, function(mytree) {
        $scope.tree_info = mytree;
    });

    // get the dataset in json file
    $http.get('json/dataset_'+$scope.dataset_id+'.json').
        success(function(json_data) {
            $scope.myDataset = json_data.data;

            // DEEP COPY the original dataset!
            var origDataset = jQuery.extend(true, {}, $scope.myDataset);   // was GLOBAL VARIABLE!
            $scope.origDataset = origDataset;

            // get split values - means (average of min and max) of every variable's values
            var splitValuesArray = GetSplitValues($scope.myDataset);
            $scope.attributes_info = splitValuesArray;

            // convert values to binary
            var binDataset = ConvertToBinary($scope.myDataset, origDataset, splitValuesArray);
            $scope.binDataset = binDataset;

            console.log($scope);

        }).
        error(function(data, status, headers, config) {
            // log error
            console.log('$http.get error');
        });

    // execute function when ng-repeat is done
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) { //you also get the actual event object

        // activate drag'n'drop of cues
        DragCues();

        // activate expand buttons
        ButtonsExpand();
    });

});



// angularjs for ttb.html
myApp.controller('OldTakeTheBestCtrl', function ($scope, $routeParams, datasetFullsService){

    console.log($scope);
    debugger;

    // change the page's title
    $('#page_title').html('Take The Best');

    console.log($routeParams);
    $scope.dataset_id = $routeParams.dataset_id;
    $scope.heur_id = $routeParams.heur_id;

    // get data from the server using Web API for angularjs
    datasetFullsService.getDatasetFullsByDatasetId($routeParams.dataset_id)
        .success(function (data) {
            console.log('SUCCESS getDatasetFULL:');
            console.log(data);

            // convert the table to the format for the browser
            var myDataset = ConvertDataset(data, 'forClient');

            $scope.dataset_full = myDataset;

            console.log($scope);
            debugger;

            // DEEP COPY the original dataset!
            var origDataset = jQuery.extend(true, {}, $scope.dataset_full);   //was GLOBAL VARIABLE!
            $scope.dataset_original = origDataset;

            // get split values - means (average of min and max) of every variable's values
            var splitValuesArray = GetSplitValues($scope.dataset_full);
            $scope.cues = splitValuesArray;

            // convert values to binary
            var binDataset = ConvertToBinary($scope.dataset_full, origDataset, splitValuesArray);
            $scope.dataset_binary = binDataset;

            // add the empty array for validities
            $scope.validities = [];

            // activate drag'n'drop of cues
            DragCriterion('Take The Best', $scope.dataset_binary);

            // activate expand buttons
            ButtonsExpand();

        }).error(function (errdata, status, headers, config) {
            console.log('FAIL getDatasetFULL:');
            console.log(errdata);
        });

    console.log($scope);
    debugger;

    // in array find object by key! another solution - grep or filter
    //heuristics_info.find($routeParams.heur_id, function(my_heur) {
    //    $scope.heuristics_info = my_heur;
    //});

    // execute function when ng-repeat is done
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) { //you also get the actual event object

        console.log('FINISHED');
        debugger;

        // activate drag'n'drop of cues
        DragCriterion('Take The Best', $scope.dataset_binary);

        // activate expand buttons
        ButtonsExpand();
    });

});

// angularjs for mini.html
myApp.controller('MinimalistCtrl', function ($scope, $routeParams, $http, heuristics_info){

    // change the page's title
    $('#page_title').html('Minimalist');

    console.log($routeParams);
    $scope.dataset_id = $routeParams.dataset_id;
    $scope.heur_id = $routeParams.heur_id;

    // get the dataset in json file
    $http.get('json/dataset_'+$scope.dataset_id+'.json').
        success(function(json_data) {
            $scope.myDataset = json_data.data;

            // DEEP COPY the original dataset!
            var origDataset = jQuery.extend(true, {}, $scope.myDataset);   //was GLOBAL VARIABLE!
            $scope.origDataset = origDataset;

            // get split values - means (average of min and max) of every variable's values
            var splitValuesArray = GetSplitValues($scope.myDataset);
            $scope.attributes_info = splitValuesArray;

            // convert values to binary
            var binDataset = ConvertToBinary($scope.myDataset, origDataset, splitValuesArray);
            $scope.binDataset = binDataset;

            // add the empty array for validities
            $scope.validities = [];

            console.log($scope);

        }).
        error(function(data, status, headers, config) {
            // log error
            console.log('$http.get error: '+data);
        });

    // in array find object by key! another solution - grep or filter
    heuristics_info.find($routeParams.heur_id, function(my_heur) {
        $scope.heuristics_info = my_heur;
    });

    // execute function when ng-repeat is done
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) { //you also get the actual event object

        // activate drag'n'drop of cues
        DragCriterion('Minimalist', $scope.binDataset);

        // activate expand buttons
        ButtonsExpand();

        // activate shuffle buttons
        ButtonsShuffle('Minimalist');
    });

});

// angularjs for weta.html
myApp.controller('WeightedTallyingCtrl', function ($scope, $routeParams, $http, heuristics_info){

    console.log($routeParams);
    $scope.dataset_id = $routeParams.dataset_id;
    $scope.heur_id = $routeParams.heur_id;

    // get the dataset in json file
    $http.get('json/dataset_'+$scope.dataset_id+'.json').
        success(function(json_data) {
            $scope.myDataset = json_data.data;

            // DEEP COPY the original dataset!
            var origDataset = jQuery.extend(true, {}, $scope.myDataset);   //was GLOBAL VARIABLE!
            $scope.origDataset = origDataset;

            // get split values - means (average of min and max) of every variable's values
            var splitValuesArray = GetSplitValues($scope.myDataset);
            $scope.attributes_info = splitValuesArray;

            // convert values to binary
            var binDataset = ConvertToBinary($scope.myDataset, origDataset, splitValuesArray);
            $scope.binDataset = binDataset;

            // add the empty array for validities
            $scope.validities = [];

            console.log($scope);

        }).
        error(function(data, status, headers, config) {
            // log error
            console.log('$http.get error: '+data);
        });

    // in array find object by key! another solution - grep or filter
    heuristics_info.find($routeParams.heur_id, function(my_heur) {
        $scope.heuristics_info = my_heur;
    });

    // execute function when ng-repeat is done
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) { //you also get the actual event object

        // change the page's title
        $('#page_title').html('Weighted Tallying');

        // activate drag'n'drop of cues
        DragCriterion('Weighted Tallying', $scope.binDataset);

        // activate expand buttons
        ButtonsExpand();

        // activate shuffle buttons
        ButtonsShuffle('Weighted Tallying');
    });

});

// angularjs for tall.html
myApp.controller('TallyingCtrl', function ($scope, $routeParams, $http, heuristics_info){

    console.log($routeParams);
    $scope.dataset_id = $routeParams.dataset_id;
    $scope.heur_id = $routeParams.heur_id;

    // get the dataset in json file
    $http.get('json/dataset_'+$scope.dataset_id+'.json').
        success(function(json_data) {
            $scope.myDataset = json_data.data;

            // DEEP COPY the original dataset!
            var origDataset = jQuery.extend(true, {}, $scope.myDataset);   //was GLOBAL VARIABLE!
            $scope.origDataset = origDataset;

            // get split values - means (average of min and max) of every variable's values
            var splitValuesArray = GetSplitValues($scope.myDataset);
            $scope.attributes_info = splitValuesArray;

            // convert values to binary
            var binDataset = ConvertToBinary($scope.myDataset, origDataset, splitValuesArray);
            $scope.binDataset = binDataset;

            // add the empty array for validities
            $scope.validities = [];

            console.log($scope);

        }).
        error(function(data, status, headers, config) {
            // log error
            console.log('$http.get error: '+data);
        });

    // in array find object by key! another solution - grep or filter
    heuristics_info.find($routeParams.heur_id, function(my_heur) {
        $scope.heuristics_info = my_heur;
    });

    // execute function when ng-repeat is done
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) { //you also get the actual event object

        // change the page's title
        $('#page_title').html('Tallying');

        // activate drag'n'drop of cues
        DragCriterion('Tallying', $scope.binDataset);

        // activate expand buttons
        ButtonsExpand();

        // activate shuffle buttons
        ButtonsShuffle('Tallying');
    });

});

$(document).ready(function(){

/*    // get data from the server using Web API for jquery/ajax
    $.api_AppName_From_WebConfig_AppSettingsServices.datasetInfo.getDatasetInfoSet()
        .success(function (data) {
            console.log('JQUERY getDatasetInfoSet:');
            console.log(data);
        }).error(function (data, status, headers, config) {
            console.log('JQUERY Oops... something went wrong');
        });*/

/*

    var myNewDatasetInfo = {
        "DatasetInfoId": 100,
        "Image": "sample string 2",
        "Title": "sample string 3",
        "Date": "sample string 4",
        "NoOfCues": 5,
        "NoOfCases": 6,
        "Description": "sample string 7",
        "Owner": {
            "UserId": 1,
            "UserName": "sample string 2",
            "FirstName": "sample string 3",
            "LastName": "sample string 4",
            "Email": "sample string 5"
        }
    };

    // update data to the server using Web API for jquery/ajax
    $.api_AppName_From_WebConfig_AppSettingsServices.datasetInfo.putDatasetInfo(1,myNewDatasetInfo)
        .success(function () {
            console.log('JQUERY putDatasetInfo:');
            //console.log(data);
        }).error(function (data, status, headers, config) {
            console.log('JQUERY Oops... something went wrong');
        });

    $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        url: "http://10.211.55.3:62417/api/DatasetInfo",
    success: function (msg) {
        console.log('Result: '+msg);
    },
    error: function (errmsg) {
        console.log('error ocured:' + errmsg.responseText);
    },
    complete: function () { console.log('completed'); } });
*/
/*

    // activate 'upload csv' button
    $('#button_upload_csv_file').mouseup(function (e) {
        console.log('YESSS');
        // send click to the input type='file'
        document.getElementById('csv-file').click();
    });
    $('#csv-file').change(GetParseFile);


    // activate button "View in LIST or GRID"
    $('#button_view').change(function(){
        var selVal = $('#button_view option:selected').val();
        console.log("selVal: " + selVal);
        switch (selVal) {
            case 'list':
                $('#view_tools').removeClass('view-grid');
                $('#view_tools').addClass('view-list');
                break;
            case 'grid':
                $('#view_tools').removeClass('view-list');
                $('#view_tools').addClass('view-grid');
            default:
                return false;  // if none is selected
        }
    });*/
});

