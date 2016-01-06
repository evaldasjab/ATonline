/**
 * Created by evo on 14/12/15.
 */
function GetDerivativeStatistics(HITS, MISSES, FALSE_ALARMS, CORRECT_REJECTIONS, UNDECIDED_POS, UNDECIDED_NEG, STEPS) {

    var myStats = {};

    myStats.CRIT_YES_SUM = HITS + MISSES + UNDECIDED_POS;
    myStats.CRIT_NO_SUM = FALSE_ALARMS + CORRECT_REJECTIONS + UNDECIDED_NEG;

    myStats.PRED_YES_SUM = HITS + FALSE_ALARMS;
    myStats.PRED_NO_SUM = MISSES + CORRECT_REJECTIONS;
    myStats.PRED_UND_SUM = UNDECIDED_POS + UNDECIDED_NEG;
    myStats.PRED_SUM_SUM = myStats.CRIT_YES_SUM + myStats.CRIT_NO_SUM;

    var ts = new TreeStatistics();
    ts.setHitCount(HITS);
    ts.setMissCount(MISSES);
    ts.setFaCount(FALSE_ALARMS);
    ts.setCrCount(CORRECT_REJECTIONS);
    ts.setStepsSum(STEPS);

    myStats.PHITS = Math.round(ts.getHitsProbability() * 1000) / 1000;
    myStats.PFA = Math.round(ts.getFalseAlarmsProbability() * 1000) / 1000;
    myStats.PHITSMINUSPFA = Math.round((myStats.PHITS - myStats.PFA) * 1000) / 1000;
    myStats.DPRIME = Math.round(ts.getDPrime() * 1000) / 1000;
    myStats.FRUGALITY = Math.round(ts.frugality() * 1000) / 1000;
    myStats.APRIME = Math.round(ts.getAPrime() * 1000) / 1000;
    myStats.BPRIME = Math.round(ts.getBPrime() * 1000) / 1000;
    myStats.BDPRIME = Math.round(ts.getBDoublePrime() * 1000) / 1000;
    myStats.BIAS = Math.round(ts.getBias() * 1000) / 1000;

    return myStats;
}

function AnalyzeDataset(myDataset, myCritId, myTreeArray) {
    /*console.log('ANALYSE!!! myHeurStr: ')
    console.log(myHeurStr);
    console.log('ANALYSE!!! myCritId: '+myCritId);
    console.log('ANALYSE!!! myTreeArray: ');
    console.log(myTreeArray);*/

    // prepare array for StepInfo
    var myDatasetStepInfo = [];

    var h = 0, m = 0, fa = 0, cr = 0;
    var STEPS = 0, HITS = 0, MISSES = 0, FALSE_ALARMS = 0, CORRECT_REJECTIONS = 0, UNDECIDED_POS = 0, UNDECIDED_NEG = 0;

    // add zero values
    myTreeArray.forEach(function(myTreeCueObj) {

        // find cue mapping of the cue
        //var myCueMapping = $.grep(myHeurStr.CueMapping, function(e){ return e.CueName == myTreeCueObj.CueName; });
        //myTreeCueObj.MinValue = myCueMapping[0].MinValue;
        //myTreeCueObj.SplitValue = myCueMapping[0].SplitValue;
        //myTreeCueObj.MaxValue = myCueMapping[0].MaxValue;
        //myTreeCueObj.IsFlipped = myCueMapping[0].IsFlipped;

        myTreeCueObj.HITS = 0;
        myTreeCueObj.MISSES = 0;
        myTreeCueObj.FALSE_ALARMS = 0;
        myTreeCueObj.CORRECT_REJECTIONS = 0;
        myTreeCueObj.UNDECIDED_POS = 0;
        myTreeCueObj.UNDECIDED_NEG = 0;
        myTreeCueObj.STEPS = 0;
    });

    //console.log('myTreeArray in ANALYSIS:');
    //console.log(myTreeArray);

    myDataset.forEach(function (myCaseObj) {

        // first count undecided cases
        if (myCaseObj[myCritId] === 1)
            UNDECIDED_POS++;
        else if (myCaseObj[myCritId] === 0)
            UNDECIDED_NEG++;
    });

    // for each row/case

    myDataset.forEach(function (myCaseObj) {
    //for (var myCase in myDataset) {  //myDataset.forEach(function(myObj) {

        //console.log('DATASET LOOP myCaseObj: '+ JSON.stringify(myCaseObj, null, "  "));

        // e.g. "0 0 1 0"
        // checks cues of the tree sequentially until row/case exits
        h = 0;
        m = 0;
        fa = 0;
        cr = 0;
        var innerStep = 0;

        // for step info, get values
        var myCaseStepObj = {};
        myCaseStepObj[myCritId] = myCaseObj[myCritId];
        myCaseStepObj.StepInfo = []; // for info about every step (stepInfo)
        myTreeArray.forEach(function(myCueObj) {
            myCaseStepObj[myCueObj.CueName] = myCaseObj[myCueObj.CueName];
        })

        // for each tree cue
        for (var c = 0; c < myTreeArray.length; c++) {  // CAN'T USE forEach because need to use 'break' statement

            var cueName = myTreeArray[c].CueName;
            //console.log('TREE LOOP cueName: '+cueName);

            innerStep++;
            // STEPS++;
            var stepInfo = "STEP " + innerStep.toString() + ": ";

            var cueValue = myCaseObj[cueName];

            // for step info, get cue value
            //myCaseStepObj[cueName] = cueValue;

            if (cueValue === 0 && myTreeArray[c].BranchNo == 'exit') {
                stepInfo += "EXIT on " + cueName + " (Cue: 0 - ";
                if (myCaseObj[myCritId] === 0) {
                    cr = 1;
                    UNDECIDED_NEG--;
                    stepInfo += "Criterion: 0 => CORRECT REJECTION)";
                    myTreeArray[c].CORRECT_REJECTIONS++; // for the cue, count correct rejection cases
                }
                else {
                    m = 1;
                    UNDECIDED_POS--;
                    stepInfo += "Criterion: 1 => MISSES)";
                    myTreeArray[c].MISSES++;  // for the cue, count miss cases
                }
                myCaseStepObj.StepInfo.push(stepInfo);
                STEPS += innerStep;
                myTreeArray[c].STEPS += innerStep;  // for the cue, count steps
                break;
            }
            else if (cueValue === 0 && myTreeArray[c].BranchNo === 'continue') {
                stepInfo += "CONTINUE on " + cueName + " (Exit: 1 - Cue: 0)";
                if (myCaseObj[myCritId] === 1) // for the cue, count undecided cases, split to positive and negative (by criterion value)
                    myTreeArray[c].UNDECIDED_POS++;
                else
                    myTreeArray[c].UNDECIDED_NEG++;
            }
            else if (cueValue === 1 && myTreeArray[c].BranchYes === 'exit') {
                stepInfo += "EXIT on " + cueName + " (Cue: 1 - ";
                if (myCaseObj[myCritId] === 0) {
                    fa = 1;
                    UNDECIDED_NEG--;
                    stepInfo += "Criterion: 0 => FALSE ALARM)";
                    myTreeArray[c].FALSE_ALARMS++; // for the cue, count false alarm cases
                }
                else {
                    h = 1;
                    UNDECIDED_POS--;
                    stepInfo += "Criterion: 1 => HIT)";
                    myTreeArray[c].HITS++; // for the cue, count hit cases
                }
                myCaseStepObj.StepInfo.push(stepInfo);
                STEPS += innerStep;
                myTreeArray[c].STEPS += innerStep;  // for the cue, count steps
                break;
            }
            else {
                stepInfo += "CONTINUE on " + cueName + " (Exit: 0 - Cue: 1)";
                if (myCaseObj[myCritId] === 1) // for the cue, count undecided cases, split to positive and negative (by criterion value)
                    myTreeArray[c].UNDECIDED_POS++;
                else
                    myTreeArray[c].UNDECIDED_NEG++;
            }
            myCaseStepObj.StepInfo.push(stepInfo);

        }

        // convert StepInfo from array to string
        var myString = myCaseStepObj.StepInfo.toString();
        myCaseStepObj.StepInfo = myString.split(',').join('\n');

        // add to dataset stepinfo array
        myDatasetStepInfo.push(myCaseStepObj);

        // tree general stats
        HITS += h;
        MISSES += m;
        CORRECT_REJECTIONS += cr;
        FALSE_ALARMS += fa;

        /*console.log('CASE HITS: '+HITS);
        console.log('CASE MISSES: ' + MISSES);
        console.log('CASE CORRECT_REJECTIONS: ' + CORRECT_REJECTIONS);
        console.log('CASE FALSE_ALARMS: ' + FALSE_ALARMS);
        console.log('CASE UNDECIDED_POS: ' + UNDECIDED_POS);
        console.log('CASE UNDECIDED_NEG: ' + UNDECIDED_NEG);*/

    });

    /*console.log('TREE HITS: '+HITS);
    console.log('TREE MISSES: ' + MISSES);
    console.log('TREE CORRECT_REJECTIONS: ' + CORRECT_REJECTIONS);
    console.log('TREE FALSE_ALARMS: ' + FALSE_ALARMS);
    console.log('TREE UNDECIDED_POS: ' + UNDECIDED_POS);
    console.log('TREE UNDECIDED_NEG: ' + UNDECIDED_NEG);*/

    // make object of tree's general stats
    var myGeneralStats = {};
    myGeneralStats.HITS = HITS;
    myGeneralStats.MISSES = MISSES;
    myGeneralStats.FALSE_ALARMS = FALSE_ALARMS;
    myGeneralStats.CORRECT_REJECTIONS = CORRECT_REJECTIONS;
    myGeneralStats.UNDECIDED_POS = UNDECIDED_POS;
    myGeneralStats.UNDECIDED_NEG = UNDECIDED_NEG;
    myGeneralStats.STEPS = STEPS;

    // get derivative statistics (here - for tree general stats)
    var myStats = GetDerivativeStatistics(
        HITS,
        MISSES,
        FALSE_ALARMS,
        CORRECT_REJECTIONS,
        UNDECIDED_POS,
        UNDECIDED_NEG,
        STEPS);
    // add derivative stats to other stats
    for (var myAttr in myStats) {  // get key / attribute / property of the object
        myGeneralStats[myAttr] = myStats[myAttr];
    }

    // calculate and display statistics for the cues in the tree
    //for (var c = 0; c < myTreeArray.length; c++) {
    myTreeArray.forEach(function(myTreeCueObj, myIndex) {

        // get derivative statistics for each cue
        var myStats = GetDerivativeStatistics(
            myTreeCueObj.HITS,
            myTreeCueObj.MISSES,
            myTreeCueObj.FALSE_ALARMS,
            myTreeCueObj.CORRECT_REJECTIONS,
            myTreeCueObj.UNDECIDED_POS,
            myTreeCueObj.UNDECIDED_NEG,
            myTreeCueObj.STEPS);
        // add derivative stats to other stats
        for (var myAttr in myStats) {
            myTreeCueObj[myAttr] = myStats[myAttr];
        }

        // update statistics of the tree up to the each cue
        if (myIndex==0) {

            // update statistics of the tree up to the FIRST cue
            myTreeCueObj.treeHITS = myTreeCueObj.HITS;
            myTreeCueObj.treeMISSES = myTreeCueObj.MISSES;
            myTreeCueObj.treeFALSE_ALARMS = myTreeCueObj.FALSE_ALARMS;
            myTreeCueObj.treeCORRECT_REJECTIONS = myTreeCueObj.CORRECT_REJECTIONS;
            myTreeCueObj.treeUNDECIDED_POS = myTreeCueObj.UNDECIDED_POS;
            myTreeCueObj.treeUNDECIDED_NEG = myTreeCueObj.UNDECIDED_NEG;
            myTreeCueObj.treeSTEPS = myTreeCueObj.STEPS;

        } else {

            // update statistics of the tree up to OTHER cues
            myTreeCueObj.treeHITS = myTreeArray[myIndex-1].treeHITS + myTreeCueObj.HITS;
            myTreeCueObj.treeMISSES = myTreeArray[myIndex-1].treeMISSES + myTreeCueObj.MISSES;
            myTreeCueObj.treeFALSE_ALARMS = myTreeArray[myIndex-1].treeFALSE_ALARMS + myTreeCueObj.FALSE_ALARMS;
            myTreeCueObj.treeCORRECT_REJECTIONS = myTreeArray[myIndex-1].treeCORRECT_REJECTIONS + myTreeCueObj.CORRECT_REJECTIONS;
            myTreeCueObj.treeUNDECIDED_POS = myTreeCueObj.UNDECIDED_POS;
            myTreeCueObj.treeUNDECIDED_NEG = myTreeCueObj.UNDECIDED_NEG;
            myTreeCueObj.treeSTEPS = myTreeArray[myIndex-1].treeSTEPS + myTreeCueObj.STEPS;

        }

        // get derivative stats
        var myStats = GetDerivativeStatistics(
            myTreeCueObj.treeHITS,
            myTreeCueObj.treeMISSES,
            myTreeCueObj.treeFALSE_ALARMS,
            myTreeCueObj.treeCORRECT_REJECTIONS,
            myTreeCueObj.treeUNDECIDED_POS,
            myTreeCueObj.treeUNDECIDED_NEG,
            myTreeCueObj.treeSTEPS);
        // rename keys e.g. PHITS to treePHITS and add derivative stats to other stats
        for (var myAttr in myStats) {
            myTreeCueObj['tree'+myAttr] = myStats[myAttr];
        }

    });

    var myAnalysis = {};
    myAnalysis.general_stats = myGeneralStats;
    myAnalysis.cues_stats = myTreeArray;
    myAnalysis.dataset_stepinfo = myDatasetStepInfo;

    return myAnalysis
}
