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

                    // if the value is null (last row, PapaParse CSV upload bug), skip to next case
                    if (myCaseObj[myCue] === undefined || myCaseObj[myCue] === null) {
                        break;
                    } else {

                        var myNewCaseObj = {};
                        //myCueObj.CueId = i;
                        myNewCaseObj.CaseId = myIndex;
                        myNewCaseObj.CueName = myCue;
                        myNewCaseObj.CueValue = myCaseObj[myCue];

                        //console.log(myNewCaseObj);

                        myConvertedDataset.push(myNewCaseObj);
                    };
                };
            });

            break;

        case 'forClient':

            // get the first case id, probably it's 0
            var myCaseId = myDataset[0].CaseId;
            var myNewCaseObj = {};
            var isNullValue = false;

            // go through every object (entry) in the data array
            myDataset.forEach(function(myEntryObj, myIndex) {    // "forEach" works for arrays only
                //console.log(myEntryObj);

                // if already went through all entries of one case
                if (myEntryObj.CaseId != myCaseId) {

                    // if in the row/case was NO null value
                    if (isNullValue == false) {
                        myConvertedDataset.push(myNewCaseObj); // add the row/case to array
                    }

                    myCaseId ++;       // next case
                    myNewCaseObj = {}; // reset obj
                    isNullValue == false //reset the null value indicator
                };

                var myCueName = myEntryObj.CueName;
                var myCueValue = myEntryObj.CueValue;

                //console.log(myCueName);
                //console.log(myCueValue);

                // if the value is null (last row, PapaParse CSV upload bug), MARK to skip to next case
                if (myCueValue === undefined || myCueValue === null) {
                    isNullValue = true;
                }

                // add entry to the row/case
                myNewCaseObj[myCueName] = myCueValue;

                //console.log(myNewCaseObj);
            });

            // if in the row/case was NO null value
            if (isNullValue == false) {
                myConvertedDataset.push(myNewCaseObj); // add the last row/case to array
            };
            break;
    };
    //console.log(myConvertedDataset);

    return myConvertedDataset;
}

// in DATASET_SHOW.HTML - displays dataset in a Excel-style table
function ShowTable(myDataset, myController) {

    if (myController == 'ShowHeur') {
        var myOption = [{col:1, className: "htRight"}];
    } else {
        var myOption = [];
    }

    //console.log(JSON.stringify(my_data, null, "  "));
    var myContainer = document.getElementById('dataset_container');

    var hot = new Handsontable(myContainer, {
        data: myDataset,
        colHeaders: function(index) {
            return Object.keys(myDataset[0])[index];
        },
        rowHeaders: true
        //columns: {data: 'StepInfo', className: "htLeft"}
    });

}

// finds min, max values and sets mean value as a split value
function GetCueMapping(myDatasetId, myDatasetFull) {

    var myCueMappingArray = [];

    // go through every cue in the dataset (of the first case)
    for (var myCueId in myDatasetFull[0] ) {

        //console.log('myCueId: '+myCueId);

        // initial values based on the first case
        var myMinValue = myDatasetFull[0][myCueId];
        var myMaxValue = myDatasetFull[0][myCueId];

        // go through every object (case/row) in the data array
        // and find MIN and MAX values
        myDatasetFull.forEach(function(myObj) {
            //console.log('HERE CHECK! myObj: '+JSON.stringify(myObj, null, "  "));

            // get MIN and MAX values
            if (myObj[myCueId] < myMinValue) {
                myMinValue = myObj[myCueId];
            }
            if (myObj[myCueId] > myMaxValue) {
                myMaxValue = myObj[myCueId];
            }
        });
        var myMeanValue = (myMaxValue + myMinValue) / 2;

        var myMapObj = {};
        myMapObj.DatasetId = myDatasetId;
        myMapObj.DatasetCueName = myCueId;    // FIX THIS!!!
        myMapObj.CueName = myCueId;
        myMapObj.MinValue = myMinValue;
        myMapObj.MaxValue = myMaxValue;
        myMapObj.SplitValue = myMeanValue;
        myMapObj.IsFlipped = false;
        myCueMappingArray.push(myMapObj);
    }

    return myCueMappingArray;
}

// updates cue mapping based on scope drag lists
function UpdateCueMapping(myOldCueMapping, myDragListsArray) {

    // go through every cue in old mapping
    myOldCueMapping.forEach(function(myOldCueObj) {

        // find the cue with new values
        var myFind = $.grep(myDragListsArray, function(e){ return e.CueName == myOldCueObj.CueName; });
        var myNewCueObj = myFind[0];

        // update values
        myOldCueObj.MinValue = myNewCueObj.MinValue;
        myOldCueObj.MaxValue = myNewCueObj.MaxValue;
        myOldCueObj.SplitValue = myNewCueObj.SplitValue;
        myOldCueObj.IsFlipped = myNewCueObj.IsFlipped;

    });

    return myOldCueMapping;
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

    return myDataset;
}

// adds all cues to a decision tree
function MoveAllCuesToArea(myCuesArray, myToArea){

    // move the cues to the new area
    myCuesArray.forEach(function (myCueId) {
        $('#' +myCueId).appendTo($('#'+myToArea))
    });
}

function GetHeuristicStructure() {

    // get criterion
    var myCritCueId = GetElementsArray('criterion_place', 'widget')[0];
    // get the cues in the tree
    var myTreeArray = GetElementsArray('tree', 'widget');
    // get the cues in the drag_cues_list
    var myCuesListArray = GetElementsArray('drag_cues_list', 'widget');

    var myHeurStructArray = [];

    // add criterion
    var myStructObj = {};
    //if (myHeuristicId) myStructObj.HeuristicId = myHeuristicId; // if myHeuristicId exists, save to the object
    myStructObj.CueName = myCritCueId;
    myStructObj.CueType = 'criterion';
    myStructObj.BranchYes = '';
    myStructObj.BranchNo = '';
    myHeurStructArray.push(myStructObj);

    // if there are cues in tree
    if (myTreeArray.length > 0) {

        // add tree cues
        myTreeArray.forEach(function (myCueId, myIndex) {

            var myStructObj = {};
            //var myStructObj = {};
            //myStructObj.EntryId = myHeurInfoObj.EntryId;
            //myStructObj.HeuristicId = myHeurInfoObj.HeuristicId;
            //if (myHeuristicId) myStructObj.HeuristicId = myHeuristicId;
            myStructObj.CueName = myCueId;
            myStructObj.CueType = 'treecue';

            // check if Exit nodes exist
            var myExitLeftTest = $('#'+myCueId).find('.exit_left').length;
            var myExitRightTest = $('#'+myCueId).find('.exit_right').length;

            myStructObj.BranchYes = myExitRightTest == 0 ? 'continue' : 'exit';
            myStructObj.BranchNo = myExitLeftTest == 0 ? 'continue' : 'exit';

            myHeurStructArray.push(myStructObj);
        });
    }

    // if there are cues in drag_cues_list
    if (myCuesListArray.length > 0) {

        // add cues
        myCuesListArray.forEach(function (myCueId, myIndex) {

            var myStructObj = {};
            //var myStructObj = {};
            //myStructObj.EntryId = myHeurInfoObj.EntryId;
            //myStructObj.HeuristicId = myHeurInfoObj.HeuristicId;
            //if (myHeuristicId) myStructObj.HeuristicId = myHeuristicId;
            myStructObj.CueName = myCueId;
            myStructObj.CueType = 'cue';
            myStructObj.BranchYes = '';
            myStructObj.BranchNo = '';

            myHeurStructArray.push(myStructObj);
        });
    }

    return myHeurStructArray;
}

function GetValidities(myCritId, myDataset) {

    // get the list of cues (headers of the dataset)
    var myCuesArray = Object.keys(myDataset[0]);

    // remove criterion from the list
    var myIndex = myCuesArray.indexOf(myCritId);
    myCuesArray.splice(myIndex, 1);

    //console.log(myCuesArray);

    // set the initial values
    var myValidArray = [];

    // go through each cue
    myCuesArray.forEach(function (myCueId) {

        // set the initial values
        var myValidObj = {};
        myValidObj.CueName = myCueId;
        myValidObj.corrPred = 0;
        myValidObj.allPred = 0;
        myValidObj.validity = 0;
        myValidObj.isFlipped = false;



        // go through every case, except the last one
        //for (var a1 = 0; a1 < myCuesArray.length; a1++) {
        for (var c1 = 0; c1 < myDataset.length; c1++) {
            var myCase1 = myDataset[c1];

            //var myAllPred = 0;  // number of all possible predictions (where the values in pairs differ)
            //var myCorrPred = 0;  // number of correct predictions

            // go through every case, except the first one
            for (var c2 = c1+1; c2 < myDataset.length; c2++) {
                var myCase2 = myDataset[c2];

                // if criterion values in both cases are different and cue values are also different
                if ((myCase1[myCritId] != myCase2[myCritId]) && (myCase1[myCueId] != myCase2[myCueId])) {

                    // it's a possible prediction
                    //myAllPred++;
                    myValidObj.allPred++;

                    // if the cue correctly predicts the criterion
                    if (myCase1[myCritId] == myCase1[myCueId]) {
                        // it's a correct prediction
                        //myCorrPred++;
                        myValidObj.corrPred++;

                        /*console.log(myCueId);
                         console.log(myCase1);
                         console.log(myCase2);
                         console.log(myAllPred);
                         console.log(myCorrPred);*/
                    } else {
                        /*console.log(myCueId);
                         console.log(c1);
                         console.log(myCase1);
                         console.log(c2);
                         console.log(myCase2);
                         console.log(myValidObj.allPred);
                         console.log(myValidObj.corrPred);
                         debugger;*/
                    }
                }


            }

            //AddPredictionValues(myValidArray, myCueId, myCorrPred, myAllPred); // AddPredictionValues(myValidArray, myCueId, myCorrPred, myAllPred)
            //console.log(myValidArray);
        }
        // calculate validities
        myValidObj.validity = myValidObj.corrPred / myValidObj.allPred;

        // if the validity is less than 0.5, flip the cue
        if (myValidObj.validity < 0.5) {
            myValidObj.validity = 1 - myValidObj.validity;
            myValidObj.isFlipped = true;
        }

        // add to the array
        myValidArray.push(myValidObj);
    });

    // sort the list in descending order by validities
    myValidArray.sort(function(a, b) {
        return parseFloat(b.validity) - parseFloat(a.validity);
    });

    // add index to every entry
    myValidArray.forEach(function (myEntry, myIndex) {
        myEntry.index = myIndex;
    });

    return myValidArray;
}

function OrderCuesByValidities(myCuesList, myValidities) {

    var myNewList = [];

    myValidities.forEach(function (myValidObj) {

        var myFind = $.grep(myCuesList, function(e){ return e.CueName == myValidObj.CueName; });

        if (myFind.length>0) {
            myNewList.push(myFind[0]);
        }

        //var myCueId = myValidObj.cueId;
        //$('#'+myCueId).appendTo('#'+myArea);
    });

    return myNewList;
}

function RestoreLists(myHeurInfo) {

    var myAllList = myHeurInfo.HeuristicStructure;

    // merge heuristic structure with cue mapping
    myAllList.forEach(function(myCueObj) {
        var myFind = $.grep(myHeurInfo.CueMapping, function(e){ return e.CueName == myCueObj.CueName; });
        if (myFind[0].MapId) {myCueObj.MapId = myFind[0].MapId};
        if (myFind[0].DatasetId) {myCueObj.DatasetId = myFind[0].DatasetId};
        if (myFind[0].DatasetCueName) {myCueObj.DatasetCueName = myFind[0].DatasetCueName};
        myCueObj.SplitValue = myFind[0].SplitValue;
        myCueObj.IsFlipped = myFind[0].IsFlipped;
        myCueObj.MinValue = myFind[0].MinValue;
        myCueObj.MaxValue = myFind[0].MaxValue;
    });

    // split to areas
    var myResult = {};
    myResult.drag_criterion = $.grep(myAllList, function(e){ return e.CueType == 'criterion'; });
    myResult.drag_tree = $.grep(myAllList, function(e){ return e.CueType == 'treecue'; });
    myResult.drag_cues_list = $.grep(myAllList, function(e){ return e.CueType == 'cue'; });

    return myResult;
}

function UpdateExitBranches(myHeuristicName, myTreeArray) {

    // depending on the heuristic, do the following
    switch (myHeuristicName) {

        case 'Fast-and-Frugal Tree':
        case 'Take The Best':
        case 'Minimalist':

            myTreeArray.forEach(function (myCueObj, myIndex) {

                // mark that this is tree cue - FIX THIS!!! somewhere you should mark criterion and the rest of cues
                myCueObj.CueType = 'treecue';

                // do for all cues except LAST CUE
                if (myIndex < myTreeArray.length - 1) {

                    // depending on how many EXITs are already
                    switch (myCueObj.BranchNo + '|' + myCueObj.BranchYes) {

                        case 'exit|exit':
                        case 'continue|continue':

                            myCueObj.BranchNo = 'continue';
                            myCueObj.BranchYes = 'exit';

                            break;

                        default:
                            // do nothing, if one exit exists
                            break;
                    }
                    // do for the LAST CUE
                } else {
                    myCueObj.BranchNo = 'exit';
                    myCueObj.BranchYes = 'exit';
                }
            });

            break;

        case 'Tallying':
        case 'Weighted Tallying':

            myTreeArray.forEach(function (myCueObj, myIndex) {

                // do for all cues except LAST CUE
                if (myIndex < myTreeArray.length - 1) {

                    myCueObj.BranchNo = 'continue';
                    myCueObj.BranchYes = 'continue';

                    // do for the LAST CUE
                } else {
                    myCueObj.BranchNo = 'exit';
                    myCueObj.BranchYes = 'exit';
                }
            });
            break;
    }

    return myTreeArray;
}


function UpdateScope(myScopeKey, myScopeValue) {

    var scope = angular.element(document.querySelector('#ng_territory')).scope();

    // handle scope key with a child
    var myScopeArray = myScopeKey.split(".");

    if (myScopeArray.length == 1) {
        scope.$apply(function(){

            //console.log(myScopeValue);
            //debugger;

            //scope[myScopeKey] = myScopeValue;
            //scope[myScopeKey] = angular.merge({}, scope[myScopeKey], myScopeValue);   // angular.extend(dst, src)
            scope[myScopeKey] = $.extend(true, scope[myScopeKey], myScopeValue);   // newdefaults = $.extend(defaults, options);

        });
        console.log('UPDATE SCOPE one level:');
        console.log(scope);

    } else if (myScopeArray.length == 2) {

        scope.$apply(function () {

            //console.log(myScopeValue);

            var myScopeParent = scope[myScopeArray[0]];

            //myScopeParent[myScopeArray[1]] = myScopeValue;
            //myScopeParent[myScopeArray[1]] = angular.merge({}, myScopeParent[myScopeArray[1]], myScopeValue);   // angular.extend(dst, src)
            myScopeParent[myScopeArray[1]] = $.extend(true, myScopeParent[myScopeArray[1]], myScopeValue);   // newdefaults = $.extend(defaults, options);

            //console.log(myScopeParent[myScopeArray[1]]);
        });
        console.log('UPDATE SCOPE two levels:');
        console.log(scope);
    };
}








// ANGULAR START ////////////////////////////////////////////////////////


// run angularjs, activate ngRepeatFinished when done (to run functions after Angularjs has finished)
var myApp = angular.module("myApp", ['ngRoute', 'evoApp.services', 'ui.sortable', 'ngHandsontable'])
    .service('sharedUser', function () {
        var sharedProperty = []; // initial value

        return {
            getShared: function () {
                return sharedProperty;
            },
            setShared: function (value) {
                sharedProperty = value;
            }
        }
    })
    .service('sharedDatasetName', function () {
        var sharedProperty = []; // initial value

        return {
            getShared: function () {
                return sharedProperty;
            },
            setShared: function (value) {
                sharedProperty = value;
            }
        }
    })
    .service('sharedDatasetFull', function () {
        var sharedProperty = []; // initial value

        return {
            getShared: function () {
                return sharedProperty;
            },
            setShared: function (value) {
                sharedProperty = value;
            }
        }
    })
    .directive('customOnChange', function() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeHandler = scope.$eval(attrs.customOnChange);
                element.bind('change', onChangeHandler);
            }
        };
    })
    .directive('onFinishRender', function ($timeout) {
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

// angularjs configuration, when use which controller
myApp.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'toolbox.html',
            controller: 'ToolboxCtrl'
        }).
        when('/datasets', {
            templateUrl: 'dataset_list.html',
            controller: 'ListDataCtrl'
        }).
        when('/ffts', {
            templateUrl: 'heuristic_list.html',
            controller: 'ListFftCtrl'
        }).
        when('/heuristics', {
            templateUrl: 'heuristic_list.html',
            controller: 'ListHeurCtrl'
        }).
        when('/datasets/:dataset_id', {
            templateUrl: 'dataset_show.html',
            controller: 'ShowDataCtrl'
        }).
        when('/new_dataset', {
            templateUrl: 'dataset_show.html',
            controller: 'UploadDataCtrl'
        }).
        when('/heuristics/:heuristic_id', {
            templateUrl: 'heur.html',
            controller: 'ShowHeurCtrl'
        }).
        when('/:dataset_id/:heuristic_abbr', {
            templateUrl: 'heur.html',
            controller: 'CreateHeurCtrl'
        }).
        when('/heuristics/:heuristic_id/choose_data', {
            templateUrl: 'dataset_list.html',
            controller: 'ChooseDataCtrl'
        }).
        when('/heuristics/:heuristic_id/datasets/:dataset_id', {
            templateUrl: 'heur.html',
            controller: 'ShowHeurDiffDataCtrl'
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
});

// get and cache the info from the server
myApp.factory('getHeuristicInfoFactory', function($http, heuristicInfoesService){

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
});

// angularjs for toolbox.html
myApp.controller("ToolboxCtrl", function ($scope, $http, getDatasetInfoFactory, heuristicInfoesService, aspNetUsersService, sharedDatasetFull, sharedUser, sharedDatasetName) {
//myApp.controller("DatasetListCtrl", function($scope, $http, datasetInfoesService) {

    // change the page's title
    $('#page_title').html('ADAPTIVE TOOLBOX Online');
    // change the color of the active menu
    $('#menu .inline').removeClass('active');
    $('#menu_mytoolbox').addClass('active');

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
                document.location.href = '/HTML5Boilerplate/index.html#/new_dataset'; // FIX THIS!!!
            }
        });
    };

    // get data from the server using Web API for angularjs
    aspNetUsersService.getAspNetUsers()
        .success(function (data) {
            console.log('SUCCESS getAspNetUsers:');
            console.log(data);
            $scope.users = data;

            // get username from service
            var myUserName = sharedUser.getShared();
            // if username exists, select it
            if (myUserName != '') {
                $scope.user_current = myUserName;
            } else {  // if not, get the first user in the list
                $scope.user_current = $scope.users[0].UserName;
                // put the user to service for access from another controller
                sharedUser.setShared($scope.user_current);
            }
            console.log("current user: " + $scope.user_current);

            // get all dataset_info - run AFTER scope has user_current!
            getDatasetInfoFactory.list(function(data) {
                $scope.datasets = data;

                // get datasets of current user
                $scope.user_datasets = $.grep($scope.datasets, function(e){ return e.UserName == $scope.user_current; });
            });

            // get all heuristic_info - run AFTER scope has user_current!
            heuristicInfoesService.getHeuristicInfo()
                .success(function (data) {
                    console.log('SUCCESS getHeuristicInfo:');
                    console.log(data);
                    $scope.heuristics = data;

                    // get heuristics of current user
                    $scope.user_heuristics = $.grep($scope.heuristics, function(e){ return e.UserName == $scope.user_current; });

                }).error(function (errdata, status, headers, config) {
                    console.log('FAIL getHeuristicInfo:');
                    console.log(errdata);
                });

        }).error(function (errdata, status, headers, config) {
            console.log('FAIL getAspNetUsers:');
            console.log(errdata);
        });

    // select the current user
    //$scope.user_current = $('#button_user').val();

    // activate button "Select User"
    $('#button_user').change(function(){
        $scope.user_current = $('#button_user option:selected').val();;
        console.log("current user: " + $scope.user_current);

        // put the user to service for access from another controller
        sharedUser.setShared($scope.user_current);

        // find datasets and heuristics of current user
        $scope.user_datasets = $.grep($scope.datasets, function(e){ return e.UserName == $scope.user_current; });
        $scope.user_heuristics = $.grep($scope.heuristics, function(e){ return e.UserName == $scope.user_current; });
        console.log($scope);
        $scope.$apply();
    });

    console.log($scope);

    // execute function when ng-repeat is done
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) { //you also get the actual event object

        console.log('NGREPEAT FINISHED');

        // select the current user in dropdown
        $('select#button_user').val($scope.user_current);
    });

});

// angularjs for dataset_list.html
myApp.controller("ListDataCtrl", function($scope, $http, getDatasetInfoFactory, sharedDatasetFull, sharedDatasetName) {

    // change the page's title
    $('#page_title').html('ADAPTIVE TOOLBOX Online');
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
                document.location.href = '/HTML5Boilerplate/index.html#/new_dataset'; // FIX THIS!!!
            }
        });
    };

    // get all dataset_info
    getDatasetInfoFactory.list(function(data) {
        // filter only public datasets
        var myFindArray = $.grep(data, function(e){ return e.Access == 'public'; });
        $scope.datasets = myFindArray;
    });

    console.log($scope);

});

// angularjs for dataset_list.html
myApp.controller("ChooseDataCtrl", function($scope, $routeParams, $http, getDatasetInfoFactory, sharedDatasetFull, sharedDatasetName) {

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
                document.location.href = '/HTML5Boilerplate/index.html#/heuristics/'+$scope.heuristic_id+'/new_data_show'; // FIX THIS!!!
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

        // change hyperlink, so that it leads to #/heuristics/heur_id/datasets/data_id
        $('a.image').each(function(){
            this.href = this.href.replace('#', '#/heuristics/'+$scope.heuristic_id);
        });
    });

    });

// angularjs for new_data.html
myApp.controller('UploadDataCtrl', function ($scope, $routeParams, sharedDatasetFull, sharedDatasetName, sharedUser){

    // change the page's title
    $('#page_title').html('UPLOAD Dataset');

    // get the user from service
    $scope.user_current = sharedUser.getShared();

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
    myDataInfoObj.UsageUsers = 1;          // FIX THIS!!!
    myDataInfoObj.UsageDatasets = 1;       // FIX THIS!!!
    myDataInfoObj.Description = 'Please describe your dataset';
    myDataInfoObj.Access = 'private';
    myDataInfoObj.CueMapping = [];
    myDataInfoObj.DatasetFull = [];
    $scope.dataset_info = myDataInfoObj;
    $scope.heuristic_name = myDataInfoObj.heuristic_name;

    //console.log($routeParams);
    //$scope.dataset_id = parseInt($routeParams.dataset_id);
    //$scope.heur_id = $routeParams.heur_id;

    // get dataset from angular service
    $scope.dataset_full = sharedDatasetFull.getShared();

    // create the table with "handsontable.js"
    ShowTable($scope.dataset_full);

    // convert the table to the format for the server
    var myDataset = ConvertDataset($scope.dataset_full, 'forServer');

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

// angularjs for dataset_list.html
myApp.controller("ListFftCtrl", function ($scope, $http, getHeuristicInfoFactory) {
//myApp.controller("DatasetListCtrl", function($scope, $http, datasetInfoesService) {

    // change the page's title
    $('#page_title').html('ADAPTIVE TOOLBOX Online');
    // change the color of the active menu
    $('#menu .inline').removeClass('active');
    $('#menu_ffts').addClass('active');

    // get all heuristics info
    getHeuristicInfoFactory.list(function(data) {
        // filter only public heuristics
        var myFindArray = $.grep(data, function(e){ return e.Access == 'public'; });
        //$scope.heuristics = myFindArray;
        // filter only FFTs
        var myFindArray2 = $.grep(myFindArray, function(e){ return e.DecisionAlgorithm == 'Fast-and-Frugal Tree'; });
        $scope.heuristics = myFindArray2;
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

// angularjs for dataset_list.html
myApp.controller("ListHeurCtrl", function($scope, $http, getHeuristicInfoFactory) {

    // change the page's title
    $('#page_title').html('ADAPTIVE TOOLBOX Online');
    // change the color of the active menu
    $('#menu .inline').removeClass('active');
    $('#menu_heuristics').addClass('active');

    // get all heuristics info
    getHeuristicInfoFactory.list(function(data) {
        // filter only public heuristics
        var myFindArray = $.grep(data, function(e){ return e.Access == 'public'; });
        // filter only other heuristics, not FFTs
        var myFindArray2 = $.grep(myFindArray, function(e){ return e.DecisionAlgorithm != 'Fast-and-Frugal Tree'; });
        $scope.heuristics = myFindArray2;
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

// angularjs for dataset_show.html
myApp.controller('ShowDataCtrl', function ($scope, $routeParams, datasetInfoesService, datasetFullsService){

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

        }).error(function (errdata, status, headers, config) {
            console.log('FAIL getDatasetInfo:');
            console.log(errdata);
        });

    // get data from the server using Web API for angularjs
    datasetFullsService.getDatasetFullsByDatasetId($routeParams.dataset_id)
        .success(function (data) {
            console.log('SUCCESS getDatasetFULL:');
            //console.log(data);

            // activate remove button
            ButtonRemoveDataset($scope.dataset_id);

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

// angularjs for ttb.html
myApp.controller('CreateHeurCtrl', function ($scope, $routeParams, datasetFullsService, getDatasetInfoFactory, sharedUser){

    console.log($routeParams);
    $scope.dataset_id = parseInt($routeParams.dataset_id);
    $scope.heuristic_abbr = $routeParams.heuristic_abbr;

    // get the user from service
    $scope.user_current = sharedUser.getShared();
    // antibug FIX THIS!!!
    if ($scope.user_current.length == 0) {
        $scope.user_current = '';
    }

    switch ($scope.heuristic_abbr) {

        case 'new_fft':
            $scope.heuristic_name = 'Fast-and-Frugal Tree';
            $scope.heuristic_icon = 'icon_fft_512.jpg';

            // enable sortable for the tree
            $('#tree').addClass('sortable_area');
            break;
        case 'new_ttb':
            $scope.heuristic_name = 'Take The Best';
            $scope.heuristic_icon = 'icon_ttb_512.jpg';

            break;
        case 'new_mini':
            $scope.heuristic_name = 'Minimalist';
            $scope.heuristic_icon = 'icon_mini_512.jpg';
            break;
        case 'new_tall':
            $scope.heuristic_name = 'Tallying';
            $scope.heuristic_icon = 'icon_tall_512.jpg';
            break;
        case 'new_weta':
            $scope.heuristic_name = 'Weighted Tallying';
            $scope.heuristic_icon = 'icon_weta_512.jpg';
            break;
    }

    // change the page's title
    $('#page_title').html('NEW '+$scope.heuristic_name);

    // create heuristic_info with initial values
    var myHeurInfoObj = {};
    myHeurInfoObj.DecisionAlgorithm = $scope.heuristic_name;
    myHeurInfoObj.Title = $scope.heuristic_name;
    myHeurInfoObj.Image = $scope.heuristic_icon;
    myHeurInfoObj.Date = 'NOT SAVED YET';  // FIX THIS!!!
    //myHeurInfoObj.UserName = $scope.user_current;
    myHeurInfoObj.SizeCues = 0;            // FIX THIS!!! must be updated when there are cues in the tree
    myHeurInfoObj.UsageUsers = 1;          // FIX THIS!!!
    myHeurInfoObj.UsageDatasets = 1;       // FIX THIS!!!
    myHeurInfoObj.Description = 'Please describe your decision tree';
    myHeurInfoObj.Access = 'private';
    myHeurInfoObj.CueMapping = [];
    myHeurInfoObj.HeuristicStructure = [];
    $scope.heuristic_info = myHeurInfoObj;

    // prepare empty lists for criterion and tree
    $scope.drag_criterion = [];
    $scope.drag_tree = [];

    // get dataset_info
    getDatasetInfoFactory.find($scope.dataset_id, function(data) {
        // filter only public datasets
        //var myFindArray = $.grep(data, function(e){ return e.Access == 'public'; });
        $scope.dataset_info = data;
    });

    // get data from the server using Web API for angularjs
    datasetFullsService.getDatasetFullsByDatasetId($routeParams.dataset_id)
        .success(function (data) {
            console.log('SUCCESS getDatasetFULL:');
            //console.log(data);

            // convert the table to the format for the browser
            $scope.dataset_full = ConvertDataset(data, 'forClient');

            // DEEP COPY the original dataset!
            $scope.dataset_original = jQuery.extend(true, [], $scope.dataset_full);

            // get cue mappings with split, min, max values
            $scope.heuristic_info.CueMapping = GetCueMapping($scope.dataset_id, $scope.dataset_full);

            // convert values to binary
            $scope.dataset_binary = ConvertToBinary($scope.dataset_full, $scope.dataset_original, $scope.heuristic_info.CueMapping);

            // add the empty array for validities
            $scope.validities = [];

            // list cues from scope !DEEP COPY!
            $scope.drag_cues_list = jQuery.extend(true, [], $scope.heuristic_info.CueMapping);

            // add exit nodes to cues in list
            $scope.drag_cues_list.forEach(function(myCueObj, myIndex) {
                myCueObj.BranchNo = 'exit';
                myCueObj.BranchYes = 'exit';
            });

            //////////////////////////////////////////////////
            // SHOULD BE THE SAME IN BOTH CONTROLLERS CreateHeur AND ShowHeur
            //////////////////////////////////////////////////

            // set sortable options
            $scope.sortableOptions = {
                connectWith: '.sortable_area',
                handle: '.widget_title',        // Set the handle to the top bar
                placeholder: 'widget_placeholder',
                forcePlaceholderSize: 'true',
                items: 'li:not(.unsortable)',
                revert: true,
                update: function (event, ui) {
                    // doesn't update in time with angular ui-sortable, use STOP event
                },
                stop: function( event, ui ) {

                    // activate expand buttons
                    ButtonsExpand();

                    // take care of the arrows and exits
                    UpdateArrowsAndExits($scope.heuristic_name, $scope.drag_tree);

                    console.log($scope);
                }
            }

            // WATCH IF validities WAS UPDATED
            $scope.$watchCollection('validities', function() {
                console.log('WATCH validities');

                if($scope.heuristic_name =='Take The Best') {
                    if ($scope.validities.length>0) {

                        // rearrange the cues by validities
                        $scope.drag_tree = OrderCuesByValidities($scope.drag_cues_list, $scope.validities);

                        // move all cues to the decision tree, if cues_list is not empty (bug workaround, when runs initially)
                        //$scope.drag_tree = $scope.drag_cues_list;
                        $scope.drag_cues_list = [];
                    }
                }
                // add validity tags
                UpdateValidityTags($scope.heuristic_name, 'tree', $scope.validities);
            });

            //$scope.dropTarget = null;

            // WATCH IF drag_criterion WAS UPDATED
            $scope.$watchCollection('drag_criterion', function() {
                $scope.drag_target = 'drag_criterion';
                console.log('WATCH drag_criterion');

                // if criterion has been selected
                if ($scope.drag_criterion.length > 0) {

                    // remove arrows and exits
                    $('#criterion_place').find('.arrows_exits').empty();

                    // disable sortable for the criterion
                    $('#criterion_place').removeClass('sortable_area');

                    // enable sortable for the tree
                    $('#tree').addClass('sortable_area');

                    // hide contents FIX THIS!!! should be possible to expand to change split value
                    $('#criterion_place').find('.widget_content').hide();

                    // calculate validities
                    $scope.validities = GetValidities($scope.drag_criterion[0].CueName, $scope.dataset_binary);

                    // depending on the heuristic, do the following
                    switch ($scope.heuristic_name) {

                        case 'Fast-and-Frugal Tree':

                            // take care of the arrows and exits
                            //UpdateArrowsAndExits($scope.heuristic_name, 'tree');

                            // get heuristic structure for scope
                            //$scope.heuristic_info.HeuristicStructure = GetHeuristicStructure($scope.heuristic_id);

                            // analyse every cue in cues_list as one-cue-tree
                            $scope.drag_cues_list.forEach(function(myCueObj, myIndex) {
                                var myAnalysis = AnalyzeDataset($scope.dataset_binary, $scope.drag_criterion[0].CueName, [myCueObj]);
                                $scope.drag_cues_list[myIndex] = myAnalysis.cues_stats[0];
                            });

                            break;

                        case 'Take The Best':

                        // get heuristic structure for scope
                        //$scope.heuristic_info.HeuristicStructure = GetHeuristicStructure($scope.heuristic_id);

                            //$scope.validities = GetValidities($scope.drag_criterion[0].CueName, $scope.dataset_binary);

                            break;

                        case 'Minimalist':
                        case 'Tallying':
                        case 'Weighted Tallying':

                            // move all cues to the decision tree, if cues_list is not empty (bug workaround, when runs initially)
                            if ($scope.drag_cues_list.length >0) {
                                $scope.drag_tree = $.merge([], $scope.drag_cues_list);  // make DEEP copy
                                $scope.drag_cues_list = [];
                            }

                            // get heuristic structure for scope
                            //$scope.heuristic_info.HeuristicStructure = GetHeuristicStructure($scope.heuristic_id);

                            break;
                    }

                    // update general statistics
                    var myAnalysis = AnalyzeDataset($scope.dataset_binary, $scope.drag_criterion[0].CueName, $scope.drag_tree);
                    $scope.general_stats = myAnalysis.general_stats;
                    // tree is supposed to be empty, so no $scope.drag_tree = myAnalysis.cues_stats
                    $scope.dataset_stepinfo = myAnalysis.dataset_stepinfo;
                    $scope.dataset_stepinfo_colheads = Object.keys($scope.dataset_stepinfo[0]);

                // if criterion was removed
                } else {
                    // unlock the criterion area
                    $('#criterion_place').addClass('sortable_area');

                    // move all cues from tree to cues list, next to criterion
                    $scope.drag_cues_list = $.merge($scope.drag_cues_list, $scope.drag_tree);
                    $scope.drag_tree = [];

                    // hide the shuffle buttons
                    $('#drag_cues_list').find('.button_shuffle').hide();

                    // activate expand buttons
                    //ButtonsExpand();
                }

            });

            // WATCH IF drag_tree WAS UPDATED
            $scope.$watchCollection('drag_tree', function() {
                $scope.drag_target = 'drag_tree';
                console.log('WATCH drag_tree');

                // if tree is not empty
                if ($scope.drag_tree.length > 0) {

                    $scope.drag_tree = UpdateExitBranches($scope.heuristic_name, $scope.drag_tree);

                    // take care of the arrows and exits
                    //UpdateArrowsAndExits($scope.heuristic_name, $scope.drag_tree);

                    // get heuristic structure for scope
                    //$scope.heuristic_info.HeuristicStructure = GetHeuristicStructure($scope.heuristic_id);

                    // update statistics
                    var myAnalysis = AnalyzeDataset($scope.dataset_binary, $scope.drag_criterion[0].CueName, $scope.drag_tree);
                    $scope.general_stats = myAnalysis.general_stats;
                    $scope.drag_tree = myAnalysis.cues_stats;
                    $scope.dataset_stepinfo = myAnalysis.dataset_stepinfo;
                    $scope.dataset_stepinfo_colheads = Object.keys($scope.dataset_stepinfo[0]);

                    // activate expand buttons
                    //ButtonsExpand();
                }
            });

            // WATCH IF drag_cues_list WAS UPDATED
            $scope.$watchCollection('drag_cues_list', function() {
                $scope.drag_target = 'drag_cues_list';
                console.log('WATCH drag_cues_list');

                // remove arrows and exits
                $('#cues_list').find('.arrows_exits').empty();

                // remove tags
                UpdateValidityTags($scope.heuristic_name, 'drag_cues_list');
            });

            //////////////////////////////////////////////////
            // END - SHOULD BE THE SAME IN BOTH CONTROLLERS CreateHeur AND ShowHeur
            //////////////////////////////////////////////////

        }).error(function (errdata, status, headers, config) {
            console.log('FAIL getDatasetFULL:');
            console.log(errdata);
        });

    // execute function when ng-repeat is done
    $scope.$on('ngFinished cue in drag_cues_list', function(ngRepeatFinishedEvent) { //you also get the actual event object

        console.log('NGREPEAT FINISHED --> all cues are listed');

        // activate expand buttons
        ButtonsExpand();

        // activate expand all buttons
        ButtonExpandAll('blue_area');

        // activate stepinfo button
        ButtonDatasetStepInfo();

        // activate sliders and swap buttons
        SplitValueSliderChangeSwap($scope.drag_cues_list);

        // activate the SAVE button
        ButtonSaveHeuristic();

        // activate the REMOVE button
        ButtonRemoveHeuristic($scope.heuristic_id);

    });

    // execute function when ng-repeat is done
    $scope.$on('ngFinished cue in drag_tree', function(ngRepeatFinishedEvent) { //you also get the actual event object

        console.log('NGREPEAT FINISHED --> all cues are in tree');

        // take care of the arrows and exits
        //UpdateArrowsAndExits($scope.heuristic_name, $scope.drag_tree);

        // add validity tags
        UpdateValidityTags($scope.heuristic_name, 'tree', $scope.validities);

        // activate expand buttons
        //ButtonsExpand();

        // activate expand all buttons
        ButtonExpandAll('white_area');

        // activate sliders and swap buttons
        SplitValueSliderChangeSwap($scope.drag_tree);

        // activate statistics button - switch between stats of this cue & stats of the tree up to this cue
        ButtonsStatistics($scope.drag_tree);

        // depending on the heuristic, do the following
        switch ($scope.heuristic_name) {

            case 'Take The Best':

                // disable sortable for the tree cues
                $('#tree .widget').addClass('unsortable');

                // disable switch of EXIT nodes
                $('.button_switch').remove();

                break;

            case 'Minimalist':

                // disable switch of EXIT nodes
                $('.button_switch').remove();

                // activate shuffle buttons
                ButtonsShuffle($scope.heuristic_name);

                break;
        }

    });

    console.log($scope);
});

// angularjs for dataset_show.html
myApp.controller('ShowHeurCtrl', function ($scope, $routeParams, $q, heuristicInfoesService, heuristicStructuresService, datasetFullsService, getDatasetInfoFactory){

    // change the page's title
    //$('#page_title').html('SHOW Heuristic');

    console.log($routeParams);
    $scope.heuristic_id = parseInt($routeParams.heuristic_id);

    $q.all([   // angular promise - when this is done, then do the next
        // get data from the server using Web API for angularjs
        heuristicInfoesService.getHeuristicInfo2($routeParams.heuristic_id)
            .success(function (data) {
                console.log('SUCCESS getHeuristicInfo:');
                console.log(data);
                $scope.heuristic_info = data;

                $scope.heuristic_name = $scope.heuristic_info.DecisionAlgorithm;
                $scope.dataset_id = data.CueMapping[0].DatasetId;

                // make the proper drag_cues_list, drag_criterion and drag_tree
                var myLists = RestoreLists($scope.heuristic_info);
                $scope.drag_criterion = myLists.drag_criterion;
                $scope.drag_tree = myLists.drag_tree;
                $scope.drag_cues_list = myLists.drag_cues_list;

                // update the page's title
                $('#page_title').html('SHOW '+$scope.heuristic_name);

            }).error(function (errdata, status, headers, config) {
                console.log('FAIL getHeuristicInfo:');
                console.log(errdata);
            })

    // do after dataset_id is retreaved from heuristic_info
    ]).then(function() {

        // get dataset_info
        getDatasetInfoFactory.find($scope.dataset_id, function(data) {
            // filter only public datasets
            //var myFindArray = $.grep(data, function(e){ return e.Access == 'public'; });
            $scope.dataset_info = data;
        });

        // get data from the server using Web API for angularjs
        datasetFullsService.getDatasetFullsByDatasetId($scope.dataset_id)
            .success(function (data) {
                console.log('SUCCESS getDatasetFULL:');
                //console.log(data);

                // convert the table to the format for the browser
                $scope.dataset_full = ConvertDataset(data, 'forClient');

                // DEEP COPY the original dataset!
                $scope.dataset_original = jQuery.extend(true, [], $scope.dataset_full);

                // get cue mappings with split, min, max values
                // ALREADY HAVE IN heuristic_info.CueMapping

                // convert values to binary
                $scope.dataset_binary = ConvertToBinary($scope.dataset_full, $scope.dataset_original, $scope.heuristic_info.CueMapping);

                /*// take care of the cues, arrows and exits
                RestoreCuesArrowsAndExits($scope.heuristic_name, $scope.drag_tree);

                // activate expand all buttons
                ButtonExpandAll('white_area');

                // activate sliders and swap buttons
                SplitValueSliderChangeSwap($scope.drag_cues_list);
                SplitValueSliderChangeSwap($scope.drag_tree);

                // activate statistics button
                ButtonsStatistics($scope.drag_tree);*/

                // calculate and display validities
                $scope.validities = GetValidities($scope.drag_criterion[0].CueName, $scope.dataset_binary);

                /*// analyse every cue in cues_list as one-cue-tree
                $scope.drag_cues_list.forEach(function(myCueObj, myIndex) {
                    var myAnalysis = AnalyzeDataset($scope.dataset_binary, $scope.drag_criterion[0].CueName, [myCueObj]);
                    $scope.drag_cues_list[myIndex] = myAnalysis.cues_stats[0];
                });

                // update general statistics
                var myAnalysis = AnalyzeDataset($scope.dataset_binary, $scope.drag_criterion[0].CueName, $scope.drag_tree);
                $scope.general_stats = myAnalysis.general_stats;
                $scope.drag_tree = myAnalysis.cues_stats;
                $scope.dataset_stepinfo = myAnalysis.dataset_stepinfo;
                $scope.dataset_stepinfo_colheads = Object.keys($scope.dataset_stepinfo[0]);
*/
                //////////////////////////////////////////////////
                // SHOULD BE THE SAME IN BOTH CONTROLLERS CreateHeur AND ShowHeur
                //////////////////////////////////////////////////

                // set sortable options
                $scope.sortableOptions = {
                    connectWith: '.sortable_area',
                    handle: '.widget_title',        // Set the handle to the top bar
                    placeholder: 'widget_placeholder',
                    forcePlaceholderSize: 'true',
                    items: 'li:not(.unsortable)',
                    revert: true,
                    update: function (event, ui) {
                        // doesn't update in time with angular ui-sortable, use STOP event
                    },
                    stop: function( event, ui ) {

                        // activate expand buttons
                        ButtonsExpand();

                        // take care of the arrows and exits
                        UpdateArrowsAndExits($scope.heuristic_name, $scope.drag_tree);
                        console.log($scope);
                    }
                }

                // WATCH IF validities WAS UPDATED
                $scope.$watchCollection('validities', function() {
                    console.log('WATCH validities');

                    // add validity tags
                    UpdateValidityTags($scope.heuristic_name, 'tree', $scope.validities);
                });

                //$scope.dropTarget = null;

                // WATCH IF drag_criterion WAS UPDATED
                $scope.$watchCollection('drag_criterion', function() {
                    $scope.drag_target = 'drag_criterion';
                    console.log('WATCH drag_criterion');

                    // if criterion has been selected
                    if ($scope.drag_criterion.length > 0) {

                        // remove arrows and exits
                        $('#criterion_place').find('.arrows_exits').empty();

                        // disable sortable for the criterion
                        $('#criterion_place').removeClass('sortable_area');

                        // enable sortable for the tree
                        $('#tree').addClass('sortable_area');

                        // hide contents FIX THIS!!! should be possible to expand to change split value
                        $('#criterion_place').find('.widget_content').hide();

                        // calculate validities
                        $scope.validities = GetValidities($scope.drag_criterion[0].CueName, $scope.dataset_binary);

                        // depending on the heuristic, do the following
                        switch ($scope.heuristic_name) {

                            case 'Fast-and-Frugal Tree':

                                // take care of the arrows and exits
                                //UpdateArrowsAndExits($scope.heuristic_name, 'tree');

                                // get heuristic structure for scope
                                //$scope.heuristic_info.HeuristicStructure = GetHeuristicStructure($scope.heuristic_id);

                                // analyse every cue in cues_list as one-cue-tree
                                $scope.drag_cues_list.forEach(function(myCueObj, myIndex) {
                                    var myAnalysis = AnalyzeDataset($scope.dataset_binary, $scope.drag_criterion[0].CueName, [myCueObj]);
                                    $scope.drag_cues_list[myIndex] = myAnalysis.cues_stats[0];
                                });

                                break;

                            case 'Take The Best':

                                // move all cues to the decision tree, if cues_list is not empty (bug workaround, when runs initially)
                                if ($scope.drag_cues_list.length >0) {
                                    // rearrange the cues by validities
                                    $scope.drag_cues_list = OrderCuesByValidities($scope.drag_cues_list, $scope.validities);
                                }

                            // get heuristic structure for scope
                            //$scope.heuristic_info.HeuristicStructure = GetHeuristicStructure($scope.heuristic_id);

                            // don't use break to continue executing the code
                            //break;

                            case 'Minimalist':
                            case 'Tallying':
                            case 'Weighted Tallying':

                                // move all cues to the decision tree, if cues_list is not empty (bug workaround, when runs initially)
                                if ($scope.drag_cues_list.length >0) {
                                    $scope.drag_tree = $scope.drag_cues_list;
                                    $scope.drag_cues_list = [];
                                }

                                // get heuristic structure for scope
                                //$scope.heuristic_info.HeuristicStructure = GetHeuristicStructure($scope.heuristic_id);

                                break;
                        }

                        // update general statistics
                        var myAnalysis = AnalyzeDataset($scope.dataset_binary, $scope.drag_criterion[0].CueName, $scope.drag_tree);
                        $scope.general_stats = myAnalysis.general_stats;
                        // tree is supposed to be empty, so no $scope.drag_tree = myAnalysis.cues_stats
                        $scope.dataset_stepinfo = myAnalysis.dataset_stepinfo;
                        $scope.dataset_stepinfo_colheads = Object.keys($scope.dataset_stepinfo[0]);

                        // if criterion was removed
                    } else {
                        // unlock the criterion area
                        $('#criterion_place').addClass('sortable_area');

                        // move all cues from tree to cues list, next to criterion
                        $scope.drag_cues_list = $.merge($scope.drag_cues_list, $scope.drag_tree);
                        $scope.drag_tree = [];

                        // hide the shuffle buttons
                        $('#drag_cues_list').find('.button_shuffle').hide();

                        // activate expand buttons
                        //ButtonsExpand();
                    }

                });

                // WATCH IF drag_tree WAS UPDATED
                $scope.$watchCollection('drag_tree', function() {
                    $scope.drag_target = 'drag_tree';
                    console.log('WATCH drag_tree');

                    // if tree is not empty
                    if ($scope.drag_tree.length > 0) {

                        $scope.drag_tree = UpdateExitBranches($scope.heuristic_name, $scope.drag_tree);

                        // take care of the arrows and exits
                        //UpdateArrowsAndExits($scope.heuristic_name, $scope.drag_tree);

                        // get heuristic structure for scope
                        //$scope.heuristic_info.HeuristicStructure = GetHeuristicStructure($scope.heuristic_id);

                        // update statistics
                        var myAnalysis = AnalyzeDataset($scope.dataset_binary, $scope.drag_criterion[0].CueName, $scope.drag_tree);
                        $scope.general_stats = myAnalysis.general_stats;
                        $scope.drag_tree = myAnalysis.cues_stats;
                        $scope.dataset_stepinfo = myAnalysis.dataset_stepinfo;
                        $scope.dataset_stepinfo_colheads = Object.keys($scope.dataset_stepinfo[0]);

                        // activate expand buttons
                        //ButtonsExpand();
                    }
                });

                // WATCH IF drag_cues_list WAS UPDATED
                $scope.$watchCollection('drag_cues_list', function() {
                    $scope.drag_target = 'drag_cues_list';
                    console.log('WATCH drag_cues_list');

                    // remove arrows and exits
                    $('#cues_list').find('.arrows_exits').empty();

                    // remove tags
                    UpdateValidityTags($scope.heuristic_name, 'drag_cues_list');
                });

                //////////////////////////////////////////////////
                // END - SHOULD BE THE SAME IN BOTH CONTROLLERS CreateHeur AND ShowHeur
                //////////////////////////////////////////////////

                // if heurstic is private, allow changing and deleting the tree, otherwise allow choosing different dataset
                switch ($scope.heuristic_info.Access) {

                    case 'private':

                        // activate SAVE button
                        ButtonSaveHeuristic($scope.heuristic_name);

                        // activate PUBLISH button
                        ButtonPublishHeuristic();

                        break;

                    case 'public':

                        // disable sortable everywhere
                        $scope.sortableOptions = {
                            disabled: true
                        };

                        // disable switch of EXIT nodes
                        $('.button_switch').remove();

                        // activate SAVE button
                        ButtonSaveHeuristic();

                        // activate CHOOSE DATASET button
                        ButtonChooseDataset($scope.heuristic_id);
                        break;
                }
                console.log($scope);

            }).error(function (errdata, status, headers, config) {
                console.log('FAIL getDatasetFULL:');
                console.log(errdata);
            });
    })

    // execute function when ng-repeat is done
    $scope.$on('ngFinished cue in drag_cues_list', function(ngRepeatFinishedEvent) { //you also get the actual event object

        console.log('NGREPEAT FINISHED -> cues are listed');

        // activate expand all buttons
        ButtonExpandAll('blue_area');

        // activate sliders and swap buttons
        SplitValueSliderChangeSwap($scope.drag_cues_list);

    });

    // execute function when ng-repeat is done
    $scope.$on('ngFinished cue in drag_tree', function(ngRepeatFinishedEvent) { //you also get the actual event object

        console.log('NGREPEAT FINISHED -> cues are listed');

        // take care of the arrows and exits
        UpdateArrowsAndExits($scope.heuristic_name, $scope.drag_tree);

        // activate expand buttons
        ButtonsExpand();

        // activate expand all buttons
        ButtonExpandAll('white_area');

        // activate sliders and swap buttons
        SplitValueSliderChangeSwap($scope.drag_tree);

        // activate statistics button - switch between stats of this cue & stats of the tree up to this cue
        ButtonsStatistics($scope.drag_tree);

        // depending on the heuristic, do the following
        switch ($scope.heuristic_name) {

            case 'Take The Best':

                // disable sortable for the tree cues
                $('#tree .widget').addClass('unsortable');

                // disable switch of EXIT nodes
                $('.button_switch').remove();

                break;

            case 'Minimalist':

                // disable switch of EXIT nodes
                $('.button_switch').remove();

                // activate shuffle buttons
                ButtonsShuffle($scope.heuristic_name);

                break;
        }

        // activate stepinfo button
        ButtonDatasetStepInfo();

        // activate the SAVE button
        ButtonSaveHeuristic();

        // activate the REMOVE button
        ButtonRemoveHeuristic($scope.heuristic_id);

    });
});

// angularjs for dataset_show.html
myApp.controller('ShowHeurDiffDataCtrl', function ($scope, $routeParams, $q, datasetInfoesService, heuristicInfoesService, heuristicStructuresService, datasetFullsService){

    // change the page's title
    //$('#page_title').html('SHOW Heuristic');

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
                $scope.dataset_full = ConvertDataset(data, 'forClient');

                // DEEP COPY the original dataset!
                $scope.dataset_original = jQuery.extend(true, [], $scope.dataset_full);

                // get cue mappings with split, min, max values
                // ALREADY HAVE IN heuristic_info.CueMapping

                // convert values to binary
                $scope.dataset_binary = ConvertToBinary($scope.dataset_full, $scope.dataset_original, $scope.heuristic_info.CueMapping);

                // remove cues from drag_cues_list, if there are
                //$('#drag_cues_list .widget').remove();
                //$scope.drag_cues_list = [];

                // get cue mappings with split, min, max values
                //$scope.drag_cues_list_new = GetCueMapping($scope.dataset_id_new, $scope.dataset_full);
                $scope.drag_cues_list = GetCueMapping($scope.dataset_id_new, $scope.dataset_full);

                // add the empty array for validities
                //$scope.validities = [];

                //// find criterion in the array of objects
                //var myFind = $.grep($scope.heuristic_info.HeuristicStructure, function(e){ return e.CueType == 'criterion'; });
                //var myCritCueId = myFind[0].CueName;

                // convert values to binary
                //$scope.dataset_binary = ConvertToBinary($scope.dataset_full, $scope.dataset_full, $scope.heuristic_info.CueMapping);

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

            // if all cues are valid, mark button SAVE red and update cue mappings in scope
            var myCueNoMatchArray = GetElementsArray('white_area', 'cue_no_match');
            if (myCueNoMatchArray.length == 0) {
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
        ButtonsExpand();

        // activate shuffle buttons
        //ButtonsShuffle($scope.heuristic_name);

        // activate SAVE button
        ButtonSaveHeuristic($scope.heuristic_name);

        // activate CHOOSE DATASET button
        //ButtonChooseDataset($scope.heuristic_id);

        // activate REMOVE button
        //ButtonRemoveHeuristic($scope.heuristic_id);

    });

    console.log($scope);
    //$scope.$apply();

});
