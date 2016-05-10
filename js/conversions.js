/**
 * Created by evo on 10/04/16.
 */

// in data_show.html - converts the dataset to the original format
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

// in data_show.html - displays dataset in a Excel-style table
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
function GetCueValues(myDatasetId, myDataset, myHeurName) {

    var myCueNamesArray = Object.keys(myDataset[0]);

    var myCueValuesArray = [];

    // go through every cue in the dataset (of the first case)
    //for (var myCueId in myDataset[0] ) {
    myCueNamesArray.forEach(function(myCueId, myIndex) {

        // initial values based on the first case
        var myMinValue = parseFloat(myDataset[0][myCueId]);
        var myMaxValue = parseFloat(myDataset[0][myCueId]);
        var isNumber = true;

        // go through every object (case/row) and find MIN and MAX values
        myDataset.forEach(function(myObj) {
            //console.log('HERE CHECK! myObj: '+JSON.stringify(myObj, null, "  "));

            // check if the value is a number
            if ( !isNaN(myDataset[0][myCueId]) ) {

                // convert string to number
                var myValue = parseFloat(myObj[myCueId]);

                // get MIN and MAX values
                if (myValue < myMinValue) {
                    myMinValue = myValue;
                }
                if (myValue > myMaxValue) {
                    myMaxValue = myValue;
                }
                // if not number, remember
            } else {
                isNumber = false;
            }
        });

        // add cue, if it had only numbers
        if (isNumber == true){

            var myMeanValue = (myMaxValue + myMinValue) / 2;

            var myMapObj = {};

            myMapObj.DatasetId = myDatasetId;
            myMapObj.DatasetCueName = myCueId;    // FIX THIS!!!
            myMapObj.CueName = myCueId;
            myMapObj.CueType = 'cue';
            myMapObj.BranchNoExit = true;
            myMapObj.BranchYesExit = true;
            myMapObj.BranchNoName = 'no';
            myMapObj.BranchYesName = 'yes';
            myMapObj.MinValue = myMinValue;
            myMapObj.MaxValue = myMaxValue;
            myMapObj.SplitValue = myMeanValue;
            myMapObj.IsFlipped = false;
            myMapObj.IsDisabled = false;
            myMapObj.WidgetExpand = false;

            /*switch (myHeurName) {
                case 'Fast-and-Frugal Tree':
                    myMapObj.BranchNoName = 'no';
                    myMapObj.BranchYesName = 'yes';
                    break;

                case 'Take The Best':
                case "Minimalist":

                    myMapObj.BranchNoName = 'equal';
                    myMapObj.BranchYesName = 'different';
                    break;

                case "Tallying":
                case "Weighted Tallying":

                    myMapObj.BranchNoName = '';
                    myMapObj.BranchYesName = '';

                    break;
            }*/

            myCueValuesArray.push(myMapObj);
        }
    });

    return myCueValuesArray;
}

// converts continuous data to binary based on split values
function ConvertToBinary(myOrigDataset, myHeurInfo, myEnabledCues) {

    // make DEEP copy of the dataset
    var myDataset = $.extend(true, [], myOrigDataset);

    // get values
    var mySplitValuesArray = myEnabledCues;
    var myHeuristic = myHeurInfo.DecisionAlgorithm;
    var myCritFind = $.grep(myEnabledCues, function(e){ return e.CueType == 'criterion'; }); // find criterion
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
            if ( (myHeuristic == 'Fast-and-Frugal Tree') || (myHeuristic != 'Fast-and-Frugal Tree') && (myCueId != myCritId) ) {

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

    var myConversion = {};
    myConversion.dataset_binary = myDataset;
    //myConversion.CueMapping = mySplitValuesArray;

    return myConversion;
}

// sort dataset cases by criterion
function SortByCriterion(myDataset, myCritId) {

    // make DEEP copy of the dataset
    var myDataSorted = $.extend(true, [], myDataset);

    // sort the list in descending order by validities
    myDataSorted.sort(function(a, b) {
        return parseFloat(b[myCritId]) - parseFloat(a[myCritId]);
    });

    return myDataSorted;
}


function OrderCuesByValiditiesTable(myCuesList, myValidities) {

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

function RestoreLists(myHeurInfo, myDataset) {

    var myHeurStr = myHeurInfo.HeuristicStructure;
    var myCueMap = myHeurInfo.CueMapping;
    var myDatasetId = myHeurInfo.CueMapping[0].DatasetId;
    var myHeurName = myHeurInfo.DecisionAlgorithm;

    // using dataset, finds min, max values and sets mean value as a split value
    var myDataCuesArray = GetCueValues(myDatasetId, myDataset, myHeurName);

    // go through every cue in heuristic structure
    myHeurStr.forEach(function(myStrObj, myIndex) {

        // add property
        myStrObj.IsDisabled = false;

        // find cue mapping
        var myMapObj = $.grep(myCueMap, function(e){ return e.CueName == myStrObj.CueName; })[0];

        // merge properties
        //var myCueObj = $.extend({}, myStrObj, myMapObj);
        myStrObj = $.extend(myStrObj, myMapObj);

        // remove from dataset's array of cues
        myDataCuesArray = $.grep(myDataCuesArray, function(e){ return e.CueName != myMapObj.DatasetCueName; });
    });

    // for comparison tasks
    if (myHeurInfo.DecisionAlgorithm != 'Fast-and-Frugal Tree') {
        // mark unused cues as disabled, because all enabled should be in the tree
        myDataCuesArray.forEach(function(myObj, myIndex) {
            myObj.IsDisabled = true;
        });
    }

    myDataCuesArray = $.merge(myDataCuesArray, myHeurStr);

    return myDataCuesArray;

    // split to drag lists
    //var myResult = {};
    //myResult.cues_all = $.merge([], myHeurStr, myDataCuesArray);
    //myResult.cues_enabled = myHeurStr;
    //myResult.drag_cues_list = myDataCuesArray; // cues, which are in the dataset, but not in the heuristic structure
    //myResult.drag_criterion = $.grep(myHeurStr, function(e){ return e.CueType == 'criterion'; });
    //myResult.drag_tree = $.grep(myHeurStr, function(e){ return e.CueType == 'treecue'; });

    /*
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

        if (myCueObj.CueType == 'cue') {
            myCueObj.IsDisabled = true;
        } else {
            myCueObj.IsDisabled = false;
        }
    });

    // split to areas
    var myResult = {};
    myResult.drag_criterion = $.grep(myAllList, function(e){ return e.CueType == 'criterion'; });
    myResult.drag_tree = $.grep(myAllList, function(e){ return e.CueType == 'treecue'; });
    myResult.drag_cues_list = $.grep(myAllList, function(e){ return e.CueType == 'cue'; });

    myResult.cues_enabled = $.grep(myAllList, function(e){
        //return (e.CueType != 'criterion') && (e.IsDisabled == false);
        return (e.IsDisabled == false);
    });*/

    //return myResult;
}

function UpdateCueTypeExitBranches(myHeuristicName, myTreeArray, myCueType) {

    myTreeArray.forEach(function (myCueObj, myIndex) {

        // mark that this is tree cue - FIX THIS!!! somewhere you should mark criterion and the rest of cues
        myCueObj.CueType = myCueType;

        if (myCueType == 'treecue') {

            // depending on the heuristic, do the following
            switch (myHeuristicName) {

                case 'Fast-and-Frugal Tree':
                case 'Take The Best':
                case 'Minimalist':

                    // do for all cues except LAST CUE
                    if (myIndex < myTreeArray.length - 1) {

                        // depending on how many EXITs are already
                        switch (myCueObj.BranchNoExit + '|' + myCueObj.BranchYesExit) {

                            case 'true|true':
                            case 'false|false':

                                myCueObj.BranchNoExit = false;
                                myCueObj.BranchYesExit = true;

                                break;

                            default:
                                // do nothing, if one exit exists
                                break;
                        }
                        // do for the LAST CUE
                    } else {
                        myCueObj.BranchNoExit = true;
                        myCueObj.BranchYesExit = true;
                    }
                    break;

                case 'Tallying':
                case 'Weighted Tallying':

                    // do for all cues except LAST CUE
                    if (myIndex < myTreeArray.length - 1) {

                        myCueObj.BranchNoExit = false;
                        myCueObj.BranchYesExit = false;
                        //myCueObj.BranchNoName = '';
                        //myCueObj.BranchYesName = '';

                        // do for the LAST CUE
                    } else {
                        myCueObj.BranchNoExit = true;
                        myCueObj.BranchYesExit = true;
                        //myCueObj.BranchNoName = 'equal';
                        //myCueObj.BranchYesName = 'different';
                    }
                    break;
            }
        } else {  // for criterion and cues in cues_list
            myCueObj.BranchNoExit = true;
            myCueObj.BranchYesExit = true;
        }
    });

    return myTreeArray;
}

function GetDatasetUsage(myCueMapping, myHeurList) {

    //initial values
    var myHeurId = -1;
    var myDataUsageArray = [];

    // make the list of heuristic info
    myCueMapping.forEach(function(myMapObj, myIndex) {

        // check if it's a new heuristic
        if (myHeurId != myMapObj.HeuristicId) {

            // remember heuristic id
            myHeurId = myMapObj.HeuristicId;

            // find heuristic_info
            var myHeurInfo = $.grep(myHeurList, function(e){ return e.HeuristicId == myHeurId; })[0];

            // if was found - bug workaround
            if (myHeurInfo) {  // is not undefined

                // get info
                var myUsageObj = {};
                myUsageObj.HeuristicId = myHeurInfo.HeuristicId;
                myUsageObj.Title = myHeurInfo.Title;
                myUsageObj.DecisionAlgorithm = myHeurInfo.DecisionAlgorithm;
                myUsageObj.Date = myHeurInfo.Date;
                myUsageObj.UserName = myHeurInfo.UserName;

                // get abbreviation
                if (myHeurInfo.DecisionAlgorithm == 'Fast-and-Frugal Tree') {
                    myUsageObj.heuristic_abbr = 'fft';
                } else {
                    myUsageObj.heuristic_abbr = 'heur';
                }

                // add to the list
                myDataUsageArray.push(myUsageObj);
            }
        }
    });

    var myResult = {};
    myResult.dataset_usage = myDataUsageArray;

    // get number of users
    var myUsers = { };
    myDataUsageArray.forEach(function(myObj, myIndex) {

        myUsers[myObj.UserName] = (myUsers[myObj.UserName] || 0) + 1;
    });
    myResult.UsageUsers = Object.keys(myUsers).length;

    return myResult;
}
