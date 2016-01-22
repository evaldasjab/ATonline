/**
 * Created by evo on 14/12/15.
 */
function GetValidities(myDataset, myCritId, myCueMapping) {

    // get the list of cues (headers of the dataset)
    //var myCuesArray = Object.keys(myDataset[0]);

    // remove criterion from the list - FIND ATTRIBUTE IN ARRAY
    //var myIndex = myCuesArray.indexOf(myCritId);
    //myCuesArray.splice(myIndex, 1);

    // remove criterion from cue mapping array
    var myCuesArray = $.grep(myCueMapping, function(e){ return e.CueName != myCritId; });

    // set the initial values
    var myValidArray = [];

    // go through each cue
    myCuesArray.forEach(function (myCueObj) {

        var myCueId = myCueObj.CueName;

        // set the initial values
        var myValidObj = {};
        myValidObj.CueName = myCueId;
        myValidObj.corrPred = 0;
        myValidObj.allPred = 0;
        myValidObj.validity = 0;
        myValidObj.isFlipped = false;



        // go through every case, except the last one
        for (var c1 = 0; c1 < myDataset.length; c1++) {
            var myCase1 = myDataset[c1];

            // go through every case, except the first one
            for (var c2 = c1+1; c2 < myDataset.length; c2++) {
                var myCase2 = myDataset[c2];

                // if criterion values in both cases are different and cue values are also different
                if ((myCase1[myCritId] != myCase2[myCritId]) && (myCase1[myCueId] != myCase2[myCueId])) {

                    // it's a possible prediction
                    //myAllPred++;
                    myValidObj.allPred++;

                    // if the cue correctly predicts the criterion
                    //if (myCase1[myCritId] == myCase1[myCueId]) {  // which also means myCase2[myCritId] == myCase2[myCueId]
                        // it's a correct prediction
                        //myValidObj.corrPred++;

                        /*console.log(myCueId);
                         console.log(myCase1);
                         console.log(myCase2);
                         console.log(myAllPred);
                         console.log(myCorrPred);
                    }*/

                    // if case 1 is bigger than case 2 in both cue and criterion
                    if ( (myCase1[myCueId] > myCase2[myCueId]) && (myCase1[myCritId] > myCase2[myCritId]) ) {
                        // it's a correct prediction
                        myValidObj.corrPred++;
                    // or if case 1 is smaller than case 2 in both cue and criterion
                    } else if ( (myCase1[myCueId] < myCase2[myCueId]) && (myCase1[myCritId] < myCase2[myCritId]) ) {
                        // it's a correct prediction
                        myValidObj.corrPred++;
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

function AnalyzeDataset(myHeuristic, myDataset, myCritId, myTreeArray, myValidities) {
    /*console.log('ANALYSE!!! myHeurStr: ')
    console.log(myHeurStr);
    console.log('ANALYSE!!! myCritId: '+myCritId);
    console.log('ANALYSE!!! myTreeArray: ');
    console.log(myTreeArray);*/

    // prepare array for StepInfo
    var myDatasetStepInfo = [];

    var STEPS = 0, HITS = 0, MISSES = 0, FALSE_ALARMS = 0, CORRECT_REJECTIONS = 0, UNDECIDED_POS = 0, UNDECIDED_NEG = 0;

    // add zero values
    myTreeArray.forEach(function(myCueObj) {

        myCueObj.HITS = 0;
        myCueObj.MISSES = 0;
        myCueObj.FALSE_ALARMS = 0;
        myCueObj.CORRECT_REJECTIONS = 0;
        myCueObj.UNDECIDED_POS = 0;
        myCueObj.UNDECIDED_NEG = 0;
        myCueObj.STEPS = 0;
    });

    //console.log('myTreeArray in ANALYSIS:');
    //console.log(myTreeArray);

    // depending on the heuristic, analyse
    switch (myHeuristic) {

        case 'Fast-and-Frugal Tree':

            // first count undecided cases
            myDataset.forEach(function (myCaseObj) {
                if (myCaseObj[myCritId] === 1)
                    UNDECIDED_POS++;
                else if (myCaseObj[myCritId] === 0)
                    UNDECIDED_NEG++;
            });

            // for each row/case
            myDataset.forEach(function (myCaseObj) {
                //for (var myCase in myDataset) {  //myDataset.forEach(function(myObj) {

                // for step info, get values
                var innerStep = 0;
                var stepInfo = '';
                var myCaseStepObj = {};
                myCaseStepObj[myCritId] = myCaseObj[myCritId];
                myCaseStepObj.StepInfo = []; // for info about every step (stepInfo)
                myTreeArray.forEach(function (myCueObj) {
                    myCaseStepObj[myCueObj.CueName] = myCaseObj[myCueObj.CueName];
                });

                // for each tree cue
                for (var c = 0; c < myTreeArray.length; c++) {  // CAN'T USE forEach because need to use 'break' statement
                    innerStep++;
                    stepInfo += 'STEP '+innerStep+'. ';

                    var cueName = myTreeArray[c].CueName;
                    var cueValue = myCaseObj[cueName];
                    var cueText = cueValue?'yes':'no';

                    // flip cue
                    /*if (cueValue == 1) {
                        var cueText = myTreeArray[c].IsFlipped? 'no':'yes';
                    } else {  // cueValue == 0
                        var cueText = myTreeArray[c].IsFlipped? 'yes':'no';
                    }*/

                    if (myTreeArray[c].BranchYes == 'exit' && cueValue == 1) {
                        stepInfo += 'EXIT on ' +cueName+ ' = '+cueValue+' ('+cueText+'), ';
                        stepInfo += 'DECISION: '+myCritId+' = 1 (yes) ';

                        if (myCaseObj[myCritId] == 1) {
                            stepInfo += '=> HIT';

                            HITS++;
                            UNDECIDED_POS--;
                            myTreeArray[c].HITS++; // for the cue, count hit cases

                        } else {  // if (myCaseObj[myCritId] == 0)
                            stepInfo += '=> FALSE ALARM';

                            FALSE_ALARMS++;
                            UNDECIDED_NEG--;
                            myTreeArray[c].FALSE_ALARMS++; // for the cue, count false alarm cases
                        }
                        myCaseStepObj.StepInfo.push(stepInfo);
                        STEPS += innerStep;
                        myTreeArray[c].STEPS += innerStep;  // for the cue, count steps
                        break;

                    } else if (myTreeArray[c].BranchNo == 'exit' && cueValue == 0) {
                        stepInfo += 'EXIT on ' +cueName+ ' = '+cueValue+' ('+cueText+'), ';
                        stepInfo += 'DECISION: '+myCritId+' = 0 (no) ';

                        if (myCaseObj[myCritId] == 0) {
                            stepInfo += '=> CORRECT REJECTION';

                            CORRECT_REJECTIONS++;
                            UNDECIDED_NEG--;
                            myTreeArray[c].CORRECT_REJECTIONS++; // for the cue, count correct rejection cases

                        } else {  // if (myCaseObj[myCritId] == 1)
                            stepInfo += '=> MISS';

                            MISSES++;
                            UNDECIDED_POS--;
                            myTreeArray[c].MISSES++;  // for the cue, count miss cases
                        }
                        myCaseStepObj.StepInfo.push(stepInfo);
                        STEPS += innerStep;
                        myTreeArray[c].STEPS += innerStep;  // for the cue, count steps
                        break;

                    } else {
                        stepInfo += 'CONTINUE on ' +cueName+ ' = '+cueValue+' ('+cueText+'), ';
                        //stepInfo += 'CONTINUE on ' +cueName+ ': Cue = '+cueValue?'yes':'no'+', ';

                        if (myCaseObj[myCritId] == 1) {    // for the cue, count undecided cases, split to positive and negative (by criterion value)
                            myTreeArray[c].UNDECIDED_POS++;

                        } else {  // if (myCaseObj[myCritId] == 0)
                            myTreeArray[c].UNDECIDED_NEG++;
                        }
                    }
                    //myCaseStepObj.StepInfo.push(stepInfo);
                }

                // convert StepInfo from array to string
                var myString = myCaseStepObj.StepInfo.toString();
                myCaseStepObj.StepInfo = myString.split(',').join('\n');

                // add to dataset stepinfo array
                myDatasetStepInfo.push(myCaseStepObj);

                /*console.log('CASE HITS: '+HITS);
                 console.log('CASE MISSES: ' + MISSES);
                 console.log('CASE CORRECT_REJECTIONS: ' + CORRECT_REJECTIONS);
                 console.log('CASE FALSE_ALARMS: ' + FALSE_ALARMS);
                 console.log('CASE UNDECIDED_POS: ' + UNDECIDED_POS);
                 console.log('CASE UNDECIDED_NEG: ' + UNDECIDED_NEG);
                debugger;*/

            });
            break;

        case 'Take The Best':
        case 'Minimalist':

            ////// the decision rule:
            ////// if caseX.cue > caseX+N.cue , then caseX.criterion > caseX+N.criterion
            //////            PREDICTION                           CRITERION
            //////            true            ,                    true                  => hit
            //////            true            ,                    false                 => false alarm
            //////            false           ,                    true                  => miss
            //////            false           ,                    false                 => correct rejection

            // go through every case, except the last one
            for (var c1 = 0; c1 < myDataset.length; c1++) {
                var myCase1 = myDataset[c1];

                // go through every case, except the first one
                for (var c2 = c1 + 1; c2 < myDataset.length; c2++) {
                    var myCase2 = myDataset[c2];

                    /*console.log('CASE 1:');
                     console.log(myCase1);

                     console.log('CASE 2:');
                     console.log(myCase2);*/

                    // for step info, get values
                    var innerStep = 0;
                    var myCaseStepObj = {};
                    myCaseStepObj.Cases = (c1+1) + ' vs ' + (c2+1);
                    myCaseStepObj[myCritId] = myCase1[myCritId] + ' vs ' + myCase2[myCritId];
                    myCaseStepObj.StepInfo = []; // for info about every step (stepInfo)
                    myTreeArray.forEach(function (myCueObj) {
                        myCaseStepObj[myCueObj.CueName] = myCase1[myCueObj.CueName] + ' vs ' + myCase2[myCueObj.CueName];
                    });

                    // reset the decision variable
                    var myDecision = '';

                    // go through each tree cue with the possibility to stop the loop
                    for (var t = 0; t < myTreeArray.length; t++) {  // CAN'T USE forEach because need to use 'break' statement
                        innerStep++;
                        var stepInfo = 'STEP '+innerStep+'. ';

                        var cueName = myTreeArray[t].CueName;

                        // if validities exist already (criterion is selected), get cue's validity, remember if it is flipped
                        if (myValidities.length > 0) {
                            var myFind = $.grep(myValidities, function (e) {
                                return e.CueName == cueName;
                            });
                            var isValidFlipped = myFind[0].isFlipped;
                        } else {
                            var isValidFlipped = false;
                        }

                        // if case1 cue value is bigger than case2 cue value and validity is not flipped OR the other way around
                        if ((myCase1[cueName] > myCase2[cueName] && isValidFlipped == false) || (myCase1[cueName] < myCase2[cueName] && isValidFlipped == true)) {
                            stepInfo += 'EXIT on ' +cueName+ ' ('+myCase1[cueName]+' > '+myCase2[cueName]+'), ';
                            stepInfo += 'DECISION: ';

                            myDecision = 'true';

                        // if case1 cue value is smaller than case2 cue value and cue's validity is not flipped OR the other way around
                        } else if ((myCase1[cueName] < myCase2[cueName] && isValidFlipped == false) || (myCase1[cueName] > myCase2[cueName] && isValidFlipped == true)) {
                            stepInfo += 'EXIT on ' +cueName+ ' ('+myCase1[cueName]+' < '+myCase2[cueName]+'), ';
                            stepInfo += 'DECISION: ';

                            myDecision = 'false';

                        // if this was the last cue, guess
                        } else if (t == myTreeArray.length - 1) {
                            stepInfo += 'EXIT on ' + cueName + ' ('+myCase1[cueName]+' = '+myCase2[cueName]+'), ';
                            stepInfo += 'GUESS: ';

                            if (Math.random() < 0.5) {
                                myDecision = 'true';
                            } else {
                                myDecision = 'false';
                            }

                        // if neither, go to the next cue
                        } else {
                        stepInfo += 'CONTINUE on ' + cueName + ' ('+myCase1[cueName]+' = '+myCase2[cueName]+')';

                            // if case1 criterion value  is bigger than case2 criterion value
                            if (myCase1[myCritId] > myCase2[myCritId]) {

                                myTreeArray[t].UNDECIDED_POS++; // for cue stats

                                // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                            } else if (myCase1[myCritId] < myCase2[myCritId]) {

                                myTreeArray[t].UNDECIDED_NEG++;  // for cue stats
                            }
                        }

                        //////////////////
                        // if there was a decision/guess and prediction is true
                        if (myDecision == 'true') {
                            stepInfo += myCritId+' of first case is bigger ';

                            // if case1 criterion value  is bigger than case2 cue value
                            if (myCase1[myCritId] > myCase2[myCritId]) {
                                stepInfo += '=> HIT ('+myCase1[myCritId]+' > '+myCase2[myCritId]+')';
                                myCaseStepObj.StepInfo.push(stepInfo);

                                HITS++;                // for general stats
                                myTreeArray[t].HITS++; // for cue stats
                                STEPS += innerStep;
                                myTreeArray[t].STEPS += innerStep;
                                break;

                            // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                            } else {
                                stepInfo += '=> FALSE ALARM ('+myCase1[myCritId]+' = '+myCase2[myCritId]+')';
                                myCaseStepObj.StepInfo.push(stepInfo);

                                FALSE_ALARMS++;           // for general stats
                                myTreeArray[t].FALSE_ALARMS++;  // for cue stats
                                STEPS += innerStep;
                                myTreeArray[t].STEPS += innerStep;
                                break;
                            }
                        // if there was a decision/guess and prediction is false
                        } else if (myDecision == 'false') {
                            stepInfo += myCritId+' of both cases are equal ';

                            // if case1 criterion value  is bigger than case2 criterion value
                            if (myCase1[myCritId] > myCase2[myCritId]) {
                                stepInfo += '=> MISS ('+myCase1[myCritId]+' > '+myCase2[myCritId]+')';
                                myCaseStepObj.StepInfo.push(stepInfo);

                                MISSES++;                // for general stats
                                myTreeArray[t].MISSES++; // for cue stats
                                STEPS += innerStep;
                                myTreeArray[t].STEPS += innerStep;
                                break;

                            // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                            } else {
                                stepInfo += '=> CORRECT REJECTION ('+myCase1[myCritId]+' = '+myCase2[myCritId]+')';
                                myCaseStepObj.StepInfo.push(stepInfo);

                                CORRECT_REJECTIONS++;           // for general stats
                                myTreeArray[t].CORRECT_REJECTIONS++;  // for cue stats
                                STEPS += innerStep;
                                myTreeArray[t].STEPS += innerStep;
                                break;
                            }
                        }
                        //////////////////////////

                        myCaseStepObj.StepInfo.push(stepInfo);
                    }

                    // convert StepInfo from array to string
                    var myString = myCaseStepObj.StepInfo.toString();
                    myCaseStepObj.StepInfo = myString.split(',').join('\n');

                    // add to dataset stepinfo array
                    myDatasetStepInfo.push(myCaseStepObj);

                    /*console.log('CASE HITS: '+HITS);
                     console.log('CASE MISSES: ' + MISSES);
                     console.log('CASE CORRECT_REJECTIONS: ' + CORRECT_REJECTIONS);
                     console.log('CASE FALSE_ALARMS: ' + FALSE_ALARMS);
                     console.log('CASE UNDECIDED_POS: ' + UNDECIDED_POS);
                     console.log('CASE UNDECIDED_NEG: ' + UNDECIDED_NEG);
                     console.log('CASE STEPS: ' + STEPS);*/
                }
            }
            break;

        case 'Tallying':
        case 'Weighted Tallying':

            ////// the decision rule:
            ////// if caseX.all cues > caseX+N.all cues , then caseX.criterion > caseX+N.criterion
            //////            PREDICTION                           CRITERION
            //////            true            ,                    true                  => hit
            //////            true            ,                    false                 => false alarm
            //////            false           ,                    true                  => miss
            //////            false           ,                    false                 => correct rejection

            // go through every case, except the last one
            for (var c1 = 0; c1 < myDataset.length; c1++) {
                var myCase1 = myDataset[c1];

                // go through every case, except the first one
                for (var c2 = c1 + 1; c2 < myDataset.length; c2++) {
                    var myCase2 = myDataset[c2];

                    // for step info, prepare values
                    var innerStep = 0;
                    var stepInfo = '';
                    var myCaseStepObj = {};
                    myCaseStepObj.Cases = (c1+1) + ' vs ' + (c2+1);
                    myCaseStepObj[myCritId] = myCase1[myCritId] + ' vs ' + myCase2[myCritId];
                    myCaseStepObj.StepInfo = []; // for info about every step (stepInfo)
                    myTreeArray.forEach(function (myCueObj) {
                        myCaseStepObj[myCueObj.CueName] = myCase1[myCueObj.CueName] + ' vs ' + myCase2[myCueObj.CueName];
                    })

                    // reset variables
                    var sumCase1 = 0;
                    var sumCase2 = 0;
                    var myDecision = '';

                    // go through each tree cue
                    for (var t = 0; t < myTreeArray.length; t++) {  // CAN'T USE forEach because need to use 'break' statement
                        innerStep++;
                        stepInfo += 'STEP'+innerStep+'. ';

                        var cueName = myTreeArray[t].CueName;

                        // get cue's validity, remember if it is flipped
                        var myFind = $.grep(myValidities, function (e) {
                            return e.CueName == cueName;
                        });
                        var isValidFlipped = myFind[0].isFlipped;
                        if (myHeuristic == 'Tallying') {
                            var myValidity = 1;
                        } else {
                            var myValidity = myFind[0].validity;
                        }

                        // if cue validity is not flipped
                        if (isValidFlipped == false) {
                            // add cue values (1 or 0) weighted  according to validity
                            var myCase1Add = myCase1[cueName]* myValidity;
                            var myCase2Add = myCase2[cueName]* myValidity;

                        } else {
                            // add the opposite binary values (0 or 1) weighted  according to validity
                            var myCase1Add = myCase1[cueName]?0:1 * myValidity;
                            var myCase2Add = myCase2[cueName]?0:1 * myValidity;
                        }

                        // add stepinfo except for the last cue
                        if (t < myTreeArray.length - 1) {
                            stepInfo += ': CONTINUE on ' + cueName + ' ('+parseFloat(sumCase1.toFixed(3))+'+'+parseFloat(myCase1Add.toFixed(3))+' vs '+parseFloat(sumCase2.toFixed(3))+'+'+parseFloat(myCase2Add.toFixed(3))+'), ';
                        } else {
                            stepInfo += ': EXIT on ' + cueName + ' ('+parseFloat(sumCase1.toFixed(3))+'+'+parseFloat(myCase1Add.toFixed(3))+' vs '+parseFloat(sumCase2.toFixed(3))+'+'+parseFloat(myCase2Add.toFixed(3))+';  ';
                        }

                        sumCase1 += myCase1Add;
                        sumCase2 += myCase2Add;

                        // if case1 criterion value  is bigger than case2 criterion value
                        if (myCase1[myCritId] > myCase2[myCritId]) {

                            myTreeArray[t].UNDECIDED_POS++; // for cue stats
                            myTreeArray[t].STEPS += innerStep;

                            // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                        } else {

                            myTreeArray[t].UNDECIDED_NEG++;  // for cue stats
                            myTreeArray[t].STEPS += innerStep;
                        }
                    }

                    // if the sum of caseX positive cues is bigger than caseY, predict caseX criterion bigger than caseY
                    if (sumCase1 > sumCase2) {
                        stepInfo += parseFloat(sumCase1.toFixed(3))+' > '+parseFloat(sumCase2.toFixed(3))+'), ';
                        stepInfo += 'DECISION: ';

                        myDecision = 'true';

                        // if the sum is smaller, predict caseX criterion the same as caseY
                    } else if (sumCase1 < sumCase2) {
                        stepInfo += parseFloat(sumCase1.toFixed(3))+' < '+parseFloat(sumCase2.toFixed(3))+'), ';
                        stepInfo += 'DECISION: ';

                        myDecision = 'false';

                    // if the sum is equal, guess
                    } else {
                        stepInfo += parseFloat(sumCase1.toFixed(3))+' = '+parseFloat(sumCase2.toFixed(3))+'), ';
                        stepInfo += 'GUESS: ';

                        if (Math.random() < 0.5) {
                            myDecision = 'true';
                        } else {
                            myDecision = 'false';
                        }
                    }

                    //////////////////////
                    // if the prediction is true
                    if (myDecision == 'true') {
                        stepInfo += myCritId+' of first case is bigger ';

                        // if case1 criterion value  is bigger than case2 cue value
                        if (myCase1[myCritId] > myCase2[myCritId]) {
                            stepInfo += ' => HIT ('+myCase1[myCritId]+' > '+myCase2[myCritId]+')';
                            //myCaseStepObj.StepInfo.push(stepInfo);

                            HITS++;                // for general stats
                            myTreeArray[myTreeArray.length-1].HITS++; // for cue stats
                            STEPS += innerStep;
                            myTreeArray[myTreeArray.length-1].UNDECIDED_POS--;

                         // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                        } else {
                            stepInfo += '=> FALSE ALARM ('+myCase1[myCritId]+' = '+myCase2[myCritId]+')';
                            //myCaseStepObj.StepInfo.push(stepInfo);

                            FALSE_ALARMS++;           // for general stats
                            myTreeArray[myTreeArray.length-1].FALSE_ALARMS++;  // for cue stats
                            STEPS += innerStep;
                            myTreeArray[myTreeArray.length-1].UNDECIDED_NEG--;
                        }
                    } else if (myDecision == 'false') {
                        stepInfo += myCritId+' of both cases are equal ';

                        // if case1 criterion value  is bigger than case2 criterion value
                        if (myCase1[myCritId] > myCase2[myCritId]) {
                            stepInfo += '=> MISS ('+myCase1[myCritId]+' > '+myCase2[myCritId]+')';

                            MISSES++;                // for general stats
                            myTreeArray[myTreeArray.length-1].MISSES++; // for cue stats
                            STEPS += innerStep;
                            myTreeArray[myTreeArray.length-1].UNDECIDED_POS--;

                        // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                        } else {
                            stepInfo += '=> CORRECT REJECTION ('+myCase1[myCritId]+' = '+myCase2[myCritId]+')';
                            //myCaseStepObj.StepInfo.push(stepInfo);

                            CORRECT_REJECTIONS++;           // for general stats
                            myTreeArray[myTreeArray.length-1].CORRECT_REJECTIONS++;  // for cue stats
                            STEPS += innerStep;
                            myTreeArray[myTreeArray.length-1].UNDECIDED_NEG--;
                        }
                    }
                    ////////////////////////////////

                    myCaseStepObj.StepInfo.push(stepInfo);

                    // convert StepInfo from array to string
                    var myString = myCaseStepObj.StepInfo.toString();
                    myCaseStepObj.StepInfo = myString.split(',').join('\n');

                    // add to dataset stepinfo array
                    myDatasetStepInfo.push(myCaseStepObj);

                    /*console.log('CASE HITS: '+HITS);
                     console.log('CASE MISSES: ' + MISSES);
                     console.log('CASE CORRECT_REJECTIONS: ' + CORRECT_REJECTIONS);
                     console.log('CASE FALSE_ALARMS: ' + FALSE_ALARMS);
                     console.log('CASE UNDECIDED_POS: ' + UNDECIDED_POS);
                     console.log('CASE UNDECIDED_NEG: ' + UNDECIDED_NEG);
                     console.log('CASE STEPS: ' + STEPS);*/
                }
            }

            break;
    }

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
    myTreeArray.forEach(function(myCueObj, myIndex) {

        // get derivative statistics for each cue
        var myStats = GetDerivativeStatistics(
            myCueObj.HITS,
            myCueObj.MISSES,
            myCueObj.FALSE_ALARMS,
            myCueObj.CORRECT_REJECTIONS,
            myCueObj.UNDECIDED_POS,
            myCueObj.UNDECIDED_NEG,
            myCueObj.STEPS);
        // add derivative stats to other stats
        for (var myAttr in myStats) {
            myCueObj[myAttr] = myStats[myAttr];
        }

        // update statistics of the tree up to the each cue
        if (myIndex==0) {

            // update statistics of the tree up to the FIRST cue
            myCueObj.treeHITS = myCueObj.HITS;
            myCueObj.treeMISSES = myCueObj.MISSES;
            myCueObj.treeFALSE_ALARMS = myCueObj.FALSE_ALARMS;
            myCueObj.treeCORRECT_REJECTIONS = myCueObj.CORRECT_REJECTIONS;
            myCueObj.treeUNDECIDED_POS = myCueObj.UNDECIDED_POS;
            myCueObj.treeUNDECIDED_NEG = myCueObj.UNDECIDED_NEG;
            myCueObj.treeSTEPS = myCueObj.STEPS;

        } else {

            // update statistics of the tree up to OTHER cues
            myCueObj.treeHITS = myTreeArray[myIndex-1].treeHITS + myCueObj.HITS;
            myCueObj.treeMISSES = myTreeArray[myIndex-1].treeMISSES + myCueObj.MISSES;
            myCueObj.treeFALSE_ALARMS = myTreeArray[myIndex-1].treeFALSE_ALARMS + myCueObj.FALSE_ALARMS;
            myCueObj.treeCORRECT_REJECTIONS = myTreeArray[myIndex-1].treeCORRECT_REJECTIONS + myCueObj.CORRECT_REJECTIONS;
            myCueObj.treeUNDECIDED_POS = myCueObj.UNDECIDED_POS;
            myCueObj.treeUNDECIDED_NEG = myCueObj.UNDECIDED_NEG;
            myCueObj.treeSTEPS = myTreeArray[myIndex-1].treeSTEPS + myCueObj.STEPS;

        }

        // get derivative stats
        var myStats = GetDerivativeStatistics(
            myCueObj.treeHITS,
            myCueObj.treeMISSES,
            myCueObj.treeFALSE_ALARMS,
            myCueObj.treeCORRECT_REJECTIONS,
            myCueObj.treeUNDECIDED_POS,
            myCueObj.treeUNDECIDED_NEG,
            myCueObj.treeSTEPS);
        // rename keys e.g. PHITS to treePHITS and add derivative stats to other stats
        for (var myAttr in myStats) {
            myCueObj['tree'+myAttr] = myStats[myAttr];
        }

    });

    var myAnalysis = {};
    myAnalysis.general_stats = myGeneralStats;
    myAnalysis.cues_stats = myTreeArray;
    myAnalysis.dataset_stepinfo = myDatasetStepInfo;

    return myAnalysis
}

/*
function AnalyzeDatasetPairs(myDataset, myCritId, myTreeArray) {

    /!*console.log('ANALYSE!!! myCritId: '+myCritId);
    console.log('ANALYSE!!! myTreeArray: ');
    console.log(myTreeArray);
    console.log(myDataset);
    debugger;*!/

    // prepare array for StepInfo
    var myDatasetStepInfo = [];

    var STEPS = 0, HITS = 0, MISSES = 0, FALSE_ALARMS = 0, CORRECT_REJECTIONS = 0, UNDECIDED_POS = 0, UNDECIDED_NEG = 0;

    // add zero values
    myTreeArray.forEach(function(myCueObj) {

        myCueObj.HITS = 0;
        myCueObj.MISSES = 0;
        myCueObj.FALSE_ALARMS = 0;
        myCueObj.CORRECT_REJECTIONS = 0;
        myCueObj.UNDECIDED_POS = 0;
        myCueObj.UNDECIDED_NEG = 0;
        myCueObj.STEPS = 0;
    });

    ////// the decision rule:
    ////// if caseX.cue > caseX+N.cue , then caseX.criterion > caseX+N.criterion
    //////            PREDICTION                           CRITERION
    //////            true            ,                    true                  => hit
    //////            true            ,                    false                 => false alarm
    //////            false           ,                    true                  => miss
    //////            false           ,                    false                 => correct rejection

    // go through every case, except the last one
    for (var c1 = 0; c1 < myDataset.length; c1++) {
        var myCase1 = myDataset[c1];

        // go through every case, except the first one
        for (var c2 = c1+1; c2 < myDataset.length; c2++) {
            var myCase2 = myDataset[c2];

            /!*console.log('CASE 1:');
            console.log(myCase1);

            console.log('CASE 2:');
            console.log(myCase2);*!/

            // for step info, get values
            var innerStep = 0;
            var myCaseStepObj = {};
            myCaseStepObj.CaseXvsCaseY = c1+' vs '+c2;
            myCaseStepObj[myCritId] = myCase1[myCritId]+' vs '+myCase2[myCritId];
            myCaseStepObj.StepInfo = []; // for info about every step (stepInfo)
            myTreeArray.forEach(function(myCueObj) {
                myCaseStepObj[myCueObj.CueName] = myCase1[myCueObj.CueName]+' vs '+myCase2[myCueObj.CueName];
            })

            // go through each tree cue with the possibility to stop the loop
            for (var t = 0; t < myTreeArray.length; t++) {  // CAN'T USE forEach because need to use 'break' statement
                innerStep++;
                var stepInfo = 'STEP ' + innerStep.toString() + ': ';

                var cueName = myTreeArray[t].CueName

                // if case1 cue value is bigger than case2 cue value
                if (myCase1[cueName] > myCase2[cueName]) {
                    stepInfo += 'EXIT on ' + cueName + ' (CaseX Cue > CaseY Cue), ';

                    // if case1 criterion value  is bigger than case2 cue value
                    if (myCase1[myCritId] > myCase2[myCritId]) {
                        stepInfo += 'DECISION: CaseX Criterion > CaseY Criterion => HIT';
                        myCaseStepObj.StepInfo.push(stepInfo);

                        HITS++;                // for general stats
                        myTreeArray[t].HITS++; // for cue stats
                        STEPS += innerStep;
                        myTreeArray[t].STEPS += innerStep;
                        break;

                    // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                    } else {
                        stepInfo += 'DECISION: CaseX Criterion > CaseY Criterion => FALSE ALARM';
                        myCaseStepObj.StepInfo.push(stepInfo);

                        FALSE_ALARMS++;           // for general stats
                        myTreeArray[t].FALSE_ALARMS++;  // for cue stats
                        STEPS += innerStep;
                        myTreeArray[t].STEPS += innerStep;
                        break;
                    }

                // if case1 cue value is smaller than case2 cue value
                } else if (myCase1[cueName] < myCase2[cueName]) {
                    stepInfo += 'EXIT on ' + cueName + ' (CaseX Cue < CaseY Cue), ';

                    // if case1 criterion value  is bigger than case2 criterion value
                    if (myCase1[myCritId] > myCase2[myCritId]) {
                        stepInfo += 'DECISION: CaseX Criterion = CaseY Criterion => MISS';
                        myCaseStepObj.StepInfo.push(stepInfo);

                        MISSES++;                // for general stats
                        myTreeArray[t].MISSES++; // for cue stats
                        STEPS += innerStep;
                        myTreeArray[t].STEPS += innerStep;
                        break;

                     // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                    } else {
                        stepInfo += 'DECISION: CaseX Criterion = CaseY Criterion => CORRECT REJECTION';
                        myCaseStepObj.StepInfo.push(stepInfo);

                        CORRECT_REJECTIONS++;           // for general stats
                        myTreeArray[t].CORRECT_REJECTIONS++;  // for cue stats
                        STEPS += innerStep;
                        myTreeArray[t].STEPS += innerStep;
                        break;
                    }

                // if this was the last cue, guess
                } else if (t == myTreeArray.length - 1) {
                    stepInfo += 'EXIT on ' + cueName + ' (CaseX Cue = CaseY Cue), ';

                    if (Math.random() < 0.5) {
                        var myGuess = true;
                        stepInfo += 'GUESS: CaseX Criterion > CaseY Criterion ';
                    } else {
                        var myGuess = false;
                        stepInfo += 'GUESS: CaseX Criterion = CaseY Criterion ';
                    }

                    // if the prediction is true
                    if (myGuess) {

                        // if case1 criterion value  is bigger than case2 cue value
                        if (myCase1[myCritId] > myCase2[myCritId]) {
                            stepInfo += ' => HIT';
                            myCaseStepObj.StepInfo.push(stepInfo);

                            HITS++;                // for general stats
                            myTreeArray[t].HITS++; // for cue stats
                            STEPS += innerStep;
                            myTreeArray[t].STEPS += innerStep;
                            break;

                        // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                        } else {
                            stepInfo += ' => FALSE ALARM';
                            myCaseStepObj.StepInfo.push(stepInfo);

                            FALSE_ALARMS++;           // for general stats
                            myTreeArray[t].FALSE_ALARMS++;  // for cue stats
                            STEPS += innerStep;
                            myTreeArray[t].STEPS += innerStep;
                            break;
                        }
                    // if the prediction is false
                    } else {

                        // if case1 criterion value  is bigger than case2 criterion value
                        if (myCase1[myCritId] > myCase2[myCritId]) {
                            stepInfo += ' => MISS';
                            myCaseStepObj.StepInfo.push(stepInfo);

                            MISSES++;                // for general stats
                            myTreeArray[t].MISSES++; // for cue stats
                            STEPS += innerStep;
                            myTreeArray[t].STEPS += innerStep;
                            break;

                        // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                        } else {
                            stepInfo += ' => CORRECT REJECTION';
                            myCaseStepObj.StepInfo.push(stepInfo);

                            CORRECT_REJECTIONS++;           // for general stats
                            myTreeArray[t].CORRECT_REJECTIONS++;  // for cue stats
                            STEPS += innerStep;
                            myTreeArray[t].STEPS += innerStep;
                            break;
                        }
                    }
                // else, go to next cue
                } else {
                    stepInfo += 'CONTINUE on ' + cueName + ' (CaseX Cue = CaseY Cue)';

                    // if case1 criterion value  is bigger than case2 criterion value
                    if (myCase1[myCritId] > myCase2[myCritId]) {

                        myTreeArray[t].UNDECIDED_POS++; // for cue stats

                    // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                    } else if (myCase1[myCritId] < myCase2[myCritId]) {

                        myTreeArray[t].UNDECIDED_NEG++;  // for cue stats
                    }
                }
                myCaseStepObj.StepInfo.push(stepInfo);

            }

            // convert StepInfo from array to string
            var myString = myCaseStepObj.StepInfo.toString();
            myCaseStepObj.StepInfo = myString.split(',').join('\n');

            // add to dataset stepinfo array
            myDatasetStepInfo.push(myCaseStepObj);

            /!*console.log('CASE HITS: '+HITS);
            console.log('CASE MISSES: ' + MISSES);
            console.log('CASE CORRECT_REJECTIONS: ' + CORRECT_REJECTIONS);
            console.log('CASE FALSE_ALARMS: ' + FALSE_ALARMS);
            console.log('CASE UNDECIDED_POS: ' + UNDECIDED_POS);
            console.log('CASE UNDECIDED_NEG: ' + UNDECIDED_NEG);
            console.log('CASE STEPS: ' + STEPS);*!/
        }
    }

    /!*console.log('TREE HITS: '+HITS);
    console.log('TREE MISSES: ' + MISSES);
    console.log('TREE CORRECT_REJECTIONS: ' + CORRECT_REJECTIONS);
    console.log('TREE FALSE_ALARMS: ' + FALSE_ALARMS);
    console.log('TREE UNDECIDED_POS: ' + UNDECIDED_POS);
    console.log('TREE UNDECIDED_NEG: ' + UNDECIDED_NEG);
    console.log('TREE STEPS: ' + STEPS);*!/

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
    myTreeArray.forEach(function(myCueObj, myIndex) {

        // get derivative statistics for each cue
        var myStats = GetDerivativeStatistics(
            myCueObj.HITS,
            myCueObj.MISSES,
            myCueObj.FALSE_ALARMS,
            myCueObj.CORRECT_REJECTIONS,
            myCueObj.UNDECIDED_POS,
            myCueObj.UNDECIDED_NEG,
            myCueObj.STEPS);
        // add derivative stats to other stats
        for (var myAttr in myStats) {
            myCueObj[myAttr] = myStats[myAttr];
        }

        // update statistics of the tree up to the each cue
        if (myIndex==0) {

            // update statistics of the tree up to the FIRST cue
            myCueObj.treeHITS = myCueObj.HITS;
            myCueObj.treeMISSES = myCueObj.MISSES;
            myCueObj.treeFALSE_ALARMS = myCueObj.FALSE_ALARMS;
            myCueObj.treeCORRECT_REJECTIONS = myCueObj.CORRECT_REJECTIONS;
            myCueObj.treeUNDECIDED_POS = myCueObj.UNDECIDED_POS;
            myCueObj.treeUNDECIDED_NEG = myCueObj.UNDECIDED_NEG;
            myCueObj.treeSTEPS = myCueObj.STEPS;

        } else {

            // update statistics of the tree up to OTHER cues
            myCueObj.treeHITS = myTreeArray[myIndex-1].treeHITS + myCueObj.HITS;
            myCueObj.treeMISSES = myTreeArray[myIndex-1].treeMISSES + myCueObj.MISSES;
            myCueObj.treeFALSE_ALARMS = myTreeArray[myIndex-1].treeFALSE_ALARMS + myCueObj.FALSE_ALARMS;
            myCueObj.treeCORRECT_REJECTIONS = myTreeArray[myIndex-1].treeCORRECT_REJECTIONS + myCueObj.CORRECT_REJECTIONS;
            myCueObj.treeUNDECIDED_POS = myCueObj.UNDECIDED_POS;
            myCueObj.treeUNDECIDED_NEG = myCueObj.UNDECIDED_NEG;
            myCueObj.treeSTEPS = myTreeArray[myIndex-1].treeSTEPS + myCueObj.STEPS;

        }

        // get derivative stats
        var myStats = GetDerivativeStatistics(
            myCueObj.treeHITS,
            myCueObj.treeMISSES,
            myCueObj.treeFALSE_ALARMS,
            myCueObj.treeCORRECT_REJECTIONS,
            myCueObj.treeUNDECIDED_POS,
            myCueObj.treeUNDECIDED_NEG,
            myCueObj.treeSTEPS);
        // rename keys e.g. PHITS to treePHITS and add derivative stats to other stats
        for (var myAttr in myStats) {
            myCueObj['tree'+myAttr] = myStats[myAttr];
        }

    });

    var myAnalysis = {};
    myAnalysis.general_stats = myGeneralStats;
    myAnalysis.cues_stats = myTreeArray;
    myAnalysis.dataset_stepinfo = myDatasetStepInfo;

    return myAnalysis
}

function AnalyzeDatasetTally(myDataset, myCritId, myTreeArray) {

    /!*console.log('ANALYSE!!! myCritId: '+myCritId);
     console.log('ANALYSE!!! myTreeArray: ');
     console.log(myTreeArray);
     console.log(myDataset);
     debugger;*!/

    // prepare array for StepInfo
    var myDatasetStepInfo = [];

    var STEPS = 0, HITS = 0, MISSES = 0, FALSE_ALARMS = 0, CORRECT_REJECTIONS = 0, UNDECIDED_POS = 0, UNDECIDED_NEG = 0;

    // add zero values
    myTreeArray.forEach(function(myCueObj) {

        myCueObj.HITS = 0;
        myCueObj.MISSES = 0;
        myCueObj.FALSE_ALARMS = 0;
        myCueObj.CORRECT_REJECTIONS = 0;
        myCueObj.UNDECIDED_POS = 0;
        myCueObj.UNDECIDED_NEG = 0;
        myCueObj.STEPS = 0;
    });

    ////// the decision rule:
    ////// if caseX.all cues > caseX+N.all cues , then caseX.criterion > caseX+N.criterion
    //////            PREDICTION                           CRITERION
    //////            true            ,                    true                  => hit
    //////            true            ,                    false                 => false alarm
    //////            false           ,                    true                  => miss
    //////            false           ,                    false                 => correct rejection

    // go through every case, except the last one
    for (var c1 = 0; c1 < myDataset.length; c1++) {
        var myCase1 = myDataset[c1];

        // go through every case, except the first one
        for (var c2 = c1+1; c2 < myDataset.length; c2++) {
            var myCase2 = myDataset[c2];

            /!*console.log('CASE 1:');
             console.log(myCase1);

             console.log('CASE 2:');
             console.log(myCase2);*!/

            // for step info, prepare values
            var innerStep = 0;
            var stepInfo = '';
            var myCaseStepObj = {};
            myCaseStepObj.CaseXvsCaseY = c1+' vs '+c2;
            myCaseStepObj[myCritId] = myCase1[myCritId]+' vs '+myCase2[myCritId];
            myCaseStepObj.StepInfo = []; // for info about every step (stepInfo)
            myTreeArray.forEach(function(myCueObj) {
                myCaseStepObj[myCueObj.CueName] = myCase1[myCueObj.CueName]+' vs '+myCase2[myCueObj.CueName];
            })

            // reset sum variables
            var sumCase1 = 0;
            var sumCase2 = 0;

            // go through each tree cue
            for (var t = 0; t < myTreeArray.length; t++) {  // CAN'T USE forEach because need to use 'break' statement
                innerStep++;
                stepInfo += 'STEP' + innerStep.toString() + ': ';

                var cueName = myTreeArray[t].CueName;

                // add cue values (1 or 0)
                sumCase1 += myCase1[cueName];
                sumCase2 += myCase2[cueName];

                // add stepinfo except for the last cue
                if (t < myTreeArray.length-1) {
                    stepInfo += ': CONTINUE on ' + cueName + ' (CaseX Cue Add & CaseY Cue Add), ';
                }

                // if case1 criterion value  is bigger than case2 criterion value
                if (myCase1[myCritId] > myCase2[myCritId]) {

                    myTreeArray[t].UNDECIDED_POS++; // for cue stats
                    myTreeArray[t].STEPS += innerStep;

                    // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                } else if (myCase1[myCritId] < myCase2[myCritId]) {

                    myTreeArray[t].UNDECIDED_NEG++;  // for cue stats
                    myTreeArray[t].STEPS += innerStep;
                }
            }

            // if the sum of caseX positive cues is bigger than caseY, predict caseX criterion bigger than caseY
            if (sumCase1 > sumCase2) {
                stepInfo += 'EXIT on ' + cueName + ' (CaseX Cues Sum > CaseY Cues Sum), ';

                // if case1 criterion value  is bigger than case2 cue value
                if (myCase1[myCritId] > myCase2[myCritId]) {
                    stepInfo += 'DECISION: CaseX Criterion > CaseY Criterion => HIT';
                    //myCaseStepObj.StepInfo.push(stepInfo);

                    HITS++;                // for general stats
                    //myTreeArray[t].HITS++; // for cue stats
                    STEPS += innerStep;
                    //myTreeArray[t].STEPS += innerStep;
                    //break;

                    // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                } else {
                    stepInfo += 'DECISION: CaseX Criterion > CaseY Criterion => FALSE ALARM';
                    //myCaseStepObj.StepInfo.push(stepInfo);

                    FALSE_ALARMS++;           // for general stats
                    //myTreeArray[t].FALSE_ALARMS++;  // for cue stats
                    STEPS += innerStep;
                    //myTreeArray[t].STEPS += innerStep;
                    //break;
                }

            // if the sum is smaller, predict caseX criterion the same as caseY
            } else if (sumCase1 < sumCase2) {
                stepInfo += 'EXIT on ' + cueName + ' (CaseX Cues Sum < CaseY Cues Sum), ';

                // if case1 criterion value  is bigger than case2 criterion value
                if (myCase1[myCritId] > myCase2[myCritId]) {
                    stepInfo += 'DECISION: CaseX Criterion = CaseY Criterion => MISS';
                    //myCaseStepObj.StepInfo.push(stepInfo);

                    MISSES++;                // for general stats
                    //myTreeArray[t].MISSES++; // for cue stats
                    STEPS += innerStep;
                    //myTreeArray[t].STEPS += innerStep;
                    //break;

                    // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                } else {
                    stepInfo += 'DECISION: CaseX Criterion = CaseY Criterion => CORRECT REJECTION';
                    //myCaseStepObj.StepInfo.push(stepInfo);

                    CORRECT_REJECTIONS++;           // for general stats
                    //myTreeArray[t].CORRECT_REJECTIONS++;  // for cue stats
                    STEPS += innerStep;
                    //myTreeArray[t].STEPS += innerStep;
                    //break;
                }

            // if the sum is equal, guess
            } else {
                debugger;
                stepInfo += 'EXIT on ' + cueName + ' (CaseX Cues Sum = CaseY Cues Sum), ';

                if (Math.random() < 0.5) {
                    var myGuess = true;
                    stepInfo += 'GUESS: CaseX Criterion > CaseY Criterion ';
                } else {
                    var myGuess = false;
                    stepInfo += 'GUESS: CaseX Criterion = CaseY Criterion ';
                }

                // if the prediction is true
                if (myGuess) {

                    // if case1 criterion value  is bigger than case2 cue value
                    if (myCase1[myCritId] > myCase2[myCritId]) {
                        stepInfo += ' => HIT';
                        //myCaseStepObj.StepInfo.push(stepInfo);

                        HITS++;                // for general stats
                        //myTreeArray[t].HITS++; // for cue stats
                        STEPS += innerStep;
                        //myTreeArray[t].STEPS += innerStep;
                        //break;

                        // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                    } else {
                        stepInfo += ' => FALSE ALARM';
                        //myCaseStepObj.StepInfo.push(stepInfo);

                        FALSE_ALARMS++;           // for general stats
                        //myTreeArray[t].FALSE_ALARMS++;  // for cue stats
                        STEPS += innerStep;
                        //myTreeArray[t].STEPS += innerStep;
                        //break;
                    }
                    // if the prediction is false
                } else {

                    // if case1 criterion value  is bigger than case2 criterion value
                    if (myCase1[myCritId] > myCase2[myCritId]) {
                        stepInfo += ' => MISS';
                        //myCaseStepObj.StepInfo.push(stepInfo);

                        MISSES++;                // for general stats
                        //myTreeArray[t].MISSES++; // for cue stats
                        STEPS += innerStep;
                        //myTreeArray[t].STEPS += innerStep;
                        //break;

                        // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                    } else {
                        stepInfo += ' => CORRECT REJECTION';
                        //myCaseStepObj.StepInfo.push(stepInfo);

                        CORRECT_REJECTIONS++;           // for general stats
                        //myTreeArray[t].CORRECT_REJECTIONS++;  // for cue stats
                        STEPS += innerStep;
                        //myTreeArray[t].STEPS += innerStep;
                        //break;
                    }
                }
            }

            myCaseStepObj.StepInfo.push(stepInfo);

            // convert StepInfo from array to string
            var myString = myCaseStepObj.StepInfo.toString();
            myCaseStepObj.StepInfo = myString.split(',').join('\n');

            // add to dataset stepinfo array
            myDatasetStepInfo.push(myCaseStepObj);

            /!*console.log('CASE HITS: '+HITS);
             console.log('CASE MISSES: ' + MISSES);
             console.log('CASE CORRECT_REJECTIONS: ' + CORRECT_REJECTIONS);
             console.log('CASE FALSE_ALARMS: ' + FALSE_ALARMS);
             console.log('CASE UNDECIDED_POS: ' + UNDECIDED_POS);
             console.log('CASE UNDECIDED_NEG: ' + UNDECIDED_NEG);
             console.log('CASE STEPS: ' + STEPS);*!/
        }
    }

    /!*console.log('TREE HITS: '+HITS);
     console.log('TREE MISSES: ' + MISSES);
     console.log('TREE CORRECT_REJECTIONS: ' + CORRECT_REJECTIONS);
     console.log('TREE FALSE_ALARMS: ' + FALSE_ALARMS);
     console.log('TREE UNDECIDED_POS: ' + UNDECIDED_POS);
     console.log('TREE UNDECIDED_NEG: ' + UNDECIDED_NEG);
     console.log('TREE STEPS: ' + STEPS);*!/

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
    myTreeArray.forEach(function(myCueObj, myIndex) {

        // get derivative statistics for each cue
        var myStats = GetDerivativeStatistics(
            myCueObj.HITS,
            myCueObj.MISSES,
            myCueObj.FALSE_ALARMS,
            myCueObj.CORRECT_REJECTIONS,
            myCueObj.UNDECIDED_POS,
            myCueObj.UNDECIDED_NEG,
            myCueObj.STEPS);
        // add derivative stats to other stats
        for (var myAttr in myStats) {
            myCueObj[myAttr] = myStats[myAttr];
        }

        // update statistics of the tree up to the each cue
        if (myIndex==0) {

            // update statistics of the tree up to the FIRST cue
            myCueObj.treeHITS = myCueObj.HITS;
            myCueObj.treeMISSES = myCueObj.MISSES;
            myCueObj.treeFALSE_ALARMS = myCueObj.FALSE_ALARMS;
            myCueObj.treeCORRECT_REJECTIONS = myCueObj.CORRECT_REJECTIONS;
            myCueObj.treeUNDECIDED_POS = myCueObj.UNDECIDED_POS;
            myCueObj.treeUNDECIDED_NEG = myCueObj.UNDECIDED_NEG;
            myCueObj.treeSTEPS = myCueObj.STEPS;

        } else {

            // update statistics of the tree up to OTHER cues
            myCueObj.treeHITS = myTreeArray[myIndex-1].treeHITS + myCueObj.HITS;
            myCueObj.treeMISSES = myTreeArray[myIndex-1].treeMISSES + myCueObj.MISSES;
            myCueObj.treeFALSE_ALARMS = myTreeArray[myIndex-1].treeFALSE_ALARMS + myCueObj.FALSE_ALARMS;
            myCueObj.treeCORRECT_REJECTIONS = myTreeArray[myIndex-1].treeCORRECT_REJECTIONS + myCueObj.CORRECT_REJECTIONS;
            myCueObj.treeUNDECIDED_POS = myCueObj.UNDECIDED_POS;
            myCueObj.treeUNDECIDED_NEG = myCueObj.UNDECIDED_NEG;
            myCueObj.treeSTEPS = myTreeArray[myIndex-1].treeSTEPS + myCueObj.STEPS;

        }

        // get derivative stats
        var myStats = GetDerivativeStatistics(
            myCueObj.treeHITS,
            myCueObj.treeMISSES,
            myCueObj.treeFALSE_ALARMS,
            myCueObj.treeCORRECT_REJECTIONS,
            myCueObj.treeUNDECIDED_POS,
            myCueObj.treeUNDECIDED_NEG,
            myCueObj.treeSTEPS);
        // rename keys e.g. PHITS to treePHITS and add derivative stats to other stats
        for (var myAttr in myStats) {
            myCueObj['tree'+myAttr] = myStats[myAttr];
        }

    });

    var myAnalysis = {};
    myAnalysis.general_stats = myGeneralStats;
    myAnalysis.cues_stats = myTreeArray;
    myAnalysis.dataset_stepinfo = myDatasetStepInfo;

    return myAnalysis
}

function AnalyzeDatasetWeTa(myDataset, myCritId, myTreeArray, myValidities) {

    /!*console.log('ANALYSE!!! myCritId: '+myCritId);
     console.log('ANALYSE!!! myTreeArray: ');
     console.log(myTreeArray);
     console.log(myDataset);
     debugger;*!/

    // prepare array for StepInfo
    var myDatasetStepInfo = [];

    var STEPS = 0, HITS = 0, MISSES = 0, FALSE_ALARMS = 0, CORRECT_REJECTIONS = 0, UNDECIDED_POS = 0, UNDECIDED_NEG = 0;

    // add zero values
    myTreeArray.forEach(function(myCueObj) {

        myCueObj.HITS = 0;
        myCueObj.MISSES = 0;
        myCueObj.FALSE_ALARMS = 0;
        myCueObj.CORRECT_REJECTIONS = 0;
        myCueObj.UNDECIDED_POS = 0;
        myCueObj.UNDECIDED_NEG = 0;
        myCueObj.STEPS = 0;
    });

    ////// the decision rule:
    ////// if caseX.all cues > caseX+N.all cues , then caseX.criterion > caseX+N.criterion
    //////            PREDICTION                           CRITERION
    //////            true            ,                    true                  => hit
    //////            true            ,                    false                 => false alarm
    //////            false           ,                    true                  => miss
    //////            false           ,                    false                 => correct rejection

    // go through every case, except the last one
    for (var c1 = 0; c1 < myDataset.length; c1++) {
        var myCase1 = myDataset[c1];

        // go through every case, except the first one
        for (var c2 = c1+1; c2 < myDataset.length; c2++) {
            var myCase2 = myDataset[c2];

            /!*console.log('CASE 1:');
             console.log(myCase1);

             console.log('CASE 2:');
             console.log(myCase2);*!/

            // for step info, prepare values
            var innerStep = 0;
            var stepInfo = '';
            var myCaseStepObj = {};
            myCaseStepObj.CaseXvsCaseY = c1+' vs '+c2;
            myCaseStepObj[myCritId] = myCase1[myCritId]+' vs '+myCase2[myCritId];
            myCaseStepObj.StepInfo = []; // for info about every step (stepInfo)
            myTreeArray.forEach(function(myCueObj) {
                myCaseStepObj[myCueObj.CueName] = myCase1[myCueObj.CueName]+' vs '+myCase2[myCueObj.CueName];
            })

            // reset sum variables
            var sumCase1 = 0;
            var sumCase2 = 0;

            // go through each tree cue
            for (var t = 0; t < myTreeArray.length; t++) {  // CAN'T USE forEach because need to use 'break' statement
                innerStep++;
                stepInfo += 'STEP' + innerStep.toString() + '. ';

                var cueName = myTreeArray[t].CueName;

                // get cue's validity
                var myFind = $.grep(myValidities, function(e){ return e.CueName == cueName; });
                var myValidity = myFind[0].validity;

                // add cue values (1 or 0) weighted  according to validity
                sumCase1 += myCase1[cueName] * myValidity;
                sumCase2 += myCase2[cueName] * myValidity;

                // add stepinfo except for the last cue
                if (t < myTreeArray.length-1) {
                    stepInfo += 'CONTINUE on ' + cueName + ' (CaseX Cue Add & CaseY Cue Add), ';
                }

                // if case1 criterion value  is bigger than case2 criterion value
                if (myCase1[myCritId] > myCase2[myCritId]) {

                    myTreeArray[t].UNDECIDED_POS++; // for cue stats
                    myTreeArray[t].STEPS += innerStep;

                    // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                } else if (myCase1[myCritId] < myCase2[myCritId]) {

                    myTreeArray[t].UNDECIDED_NEG++;  // for cue stats
                    myTreeArray[t].STEPS += innerStep;
                }
            }

            // if the sum of caseX positive cues is bigger than caseY, predict caseX criterion bigger than caseY
            if (sumCase1 > sumCase2) {
                stepInfo += 'EXIT on ' + cueName + ': CaseX Cues Sum > CaseY Cues Sum ('+sumCase1.toFixed(3)+' > '+sumCase2.toFixed(3)+'), ';

                // if case1 criterion value  is bigger than case2 cue value
                if (myCase1[myCritId] > myCase2[myCritId]) {
                    stepInfo += 'DECISION: CaseX Criterion > CaseY Criterion => HIT';
                    //myCaseStepObj.StepInfo.push(stepInfo);

                    HITS++;                // for general stats
                    //myTreeArray[t].HITS++; // for cue stats
                    STEPS += innerStep;
                    //myTreeArray[t].STEPS += innerStep;
                    //break;

                    // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                } else {
                    stepInfo += 'DECISION: CaseX Criterion > CaseY Criterion => FALSE ALARM';
                    //myCaseStepObj.StepInfo.push(stepInfo);

                    FALSE_ALARMS++;           // for general stats
                    //myTreeArray[t].FALSE_ALARMS++;  // for cue stats
                    STEPS += innerStep;
                    //myTreeArray[t].STEPS += innerStep;
                    //break;
                }

                // if the sum is smaller, predict caseX criterion the same as caseY
            } else if (sumCase1 < sumCase2) {
                stepInfo += 'EXIT on ' + cueName + ': CaseX Cues Sum < CaseY Cues Sum ('+sumCase1.toFixed(3)+' < '+sumCase2.toFixed(3)+'), ';

                // if case1 criterion value  is bigger than case2 criterion value
                if (myCase1[myCritId] > myCase2[myCritId]) {
                    stepInfo += 'DECISION: CaseX Criterion = CaseY Criterion => MISS';
                    //myCaseStepObj.StepInfo.push(stepInfo);

                    MISSES++;                // for general stats
                    //myTreeArray[t].MISSES++; // for cue stats
                    STEPS += innerStep;
                    //myTreeArray[t].STEPS += innerStep;
                    //break;

                    // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                } else {
                    stepInfo += 'DECISION: CaseX Criterion = CaseY Criterion => CORRECT REJECTION';
                    //myCaseStepObj.StepInfo.push(stepInfo);

                    CORRECT_REJECTIONS++;           // for general stats
                    //myTreeArray[t].CORRECT_REJECTIONS++;  // for cue stats
                    STEPS += innerStep;
                    //myTreeArray[t].STEPS += innerStep;
                    //break;
                }

                // if the sum is equal, guess
            } else {
                stepInfo += 'EXIT on ' + cueName + ': CaseX Cues Sum = CaseY Cues Sum ('+sumCase1.toFixed(3)+' = '+sumCase2.toFixed(3)+'), ';

                if (Math.random() < 0.5) {
                    var myGuess = true;
                    stepInfo += 'GUESS: CaseX Criterion > CaseY Criterion ';
                } else {
                    var myGuess = false;
                    stepInfo += 'GUESS: CaseX Criterion = CaseY Criterion ';
                }

                // if the prediction is true
                if (myGuess) {

                    // if case1 criterion value  is bigger than case2 cue value
                    if (myCase1[myCritId] > myCase2[myCritId]) {
                        stepInfo += ' => HIT';
                        //myCaseStepObj.StepInfo.push(stepInfo);

                        HITS++;                // for general stats
                        //myTreeArray[t].HITS++; // for cue stats
                        STEPS += innerStep;
                        //myTreeArray[t].STEPS += innerStep;
                        //break;

                        // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                    } else {
                        stepInfo += ' => FALSE ALARM';
                        //myCaseStepObj.StepInfo.push(stepInfo);

                        FALSE_ALARMS++;           // for general stats
                        //myTreeArray[t].FALSE_ALARMS++;  // for cue stats
                        STEPS += innerStep;
                        //myTreeArray[t].STEPS += innerStep;
                        //break;
                    }
                    // if the prediction is false
                } else {

                    // if case1 criterion value  is bigger than case2 criterion value
                    if (myCase1[myCritId] > myCase2[myCritId]) {
                        stepInfo += ' => MISS';
                        //myCaseStepObj.StepInfo.push(stepInfo);

                        MISSES++;                // for general stats
                        //myTreeArray[t].MISSES++; // for cue stats
                        STEPS += innerStep;
                        //myTreeArray[t].STEPS += innerStep;
                        //break;

                        // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                    } else {
                        stepInfo += ' => CORRECT REJECTION';
                        //myCaseStepObj.StepInfo.push(stepInfo);

                        CORRECT_REJECTIONS++;           // for general stats
                        //myTreeArray[t].CORRECT_REJECTIONS++;  // for cue stats
                        STEPS += innerStep;
                        //myTreeArray[t].STEPS += innerStep;
                        //break;
                    }
                }
            }

            myCaseStepObj.StepInfo.push(stepInfo);

            // convert StepInfo from array to string
            var myString = myCaseStepObj.StepInfo.toString();
            myCaseStepObj.StepInfo = myString.split(',').join('\n');

            // add to dataset stepinfo array
            myDatasetStepInfo.push(myCaseStepObj);

            /!*console.log('CASE HITS: '+HITS);
             console.log('CASE MISSES: ' + MISSES);
             console.log('CASE CORRECT_REJECTIONS: ' + CORRECT_REJECTIONS);
             console.log('CASE FALSE_ALARMS: ' + FALSE_ALARMS);
             console.log('CASE UNDECIDED_POS: ' + UNDECIDED_POS);
             console.log('CASE UNDECIDED_NEG: ' + UNDECIDED_NEG);
             console.log('CASE STEPS: ' + STEPS);*!/
        }
    }

    /!*console.log('TREE HITS: '+HITS);
     console.log('TREE MISSES: ' + MISSES);
     console.log('TREE CORRECT_REJECTIONS: ' + CORRECT_REJECTIONS);
     console.log('TREE FALSE_ALARMS: ' + FALSE_ALARMS);
     console.log('TREE UNDECIDED_POS: ' + UNDECIDED_POS);
     console.log('TREE UNDECIDED_NEG: ' + UNDECIDED_NEG);
     console.log('TREE STEPS: ' + STEPS);*!/

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
    myTreeArray.forEach(function(myCueObj, myIndex) {

        // get derivative statistics for each cue
        var myStats = GetDerivativeStatistics(
            myCueObj.HITS,
            myCueObj.MISSES,
            myCueObj.FALSE_ALARMS,
            myCueObj.CORRECT_REJECTIONS,
            myCueObj.UNDECIDED_POS,
            myCueObj.UNDECIDED_NEG,
            myCueObj.STEPS);
        // add derivative stats to other stats
        for (var myAttr in myStats) {
            myCueObj[myAttr] = myStats[myAttr];
        }

        // update statistics of the tree up to the each cue
        if (myIndex==0) {

            // update statistics of the tree up to the FIRST cue
            myCueObj.treeHITS = myCueObj.HITS;
            myCueObj.treeMISSES = myCueObj.MISSES;
            myCueObj.treeFALSE_ALARMS = myCueObj.FALSE_ALARMS;
            myCueObj.treeCORRECT_REJECTIONS = myCueObj.CORRECT_REJECTIONS;
            myCueObj.treeUNDECIDED_POS = myCueObj.UNDECIDED_POS;
            myCueObj.treeUNDECIDED_NEG = myCueObj.UNDECIDED_NEG;
            myCueObj.treeSTEPS = myCueObj.STEPS;

        } else {

            // update statistics of the tree up to OTHER cues
            myCueObj.treeHITS = myTreeArray[myIndex-1].treeHITS + myCueObj.HITS;
            myCueObj.treeMISSES = myTreeArray[myIndex-1].treeMISSES + myCueObj.MISSES;
            myCueObj.treeFALSE_ALARMS = myTreeArray[myIndex-1].treeFALSE_ALARMS + myCueObj.FALSE_ALARMS;
            myCueObj.treeCORRECT_REJECTIONS = myTreeArray[myIndex-1].treeCORRECT_REJECTIONS + myCueObj.CORRECT_REJECTIONS;
            myCueObj.treeUNDECIDED_POS = myCueObj.UNDECIDED_POS;
            myCueObj.treeUNDECIDED_NEG = myCueObj.UNDECIDED_NEG;
            myCueObj.treeSTEPS = myTreeArray[myIndex-1].treeSTEPS + myCueObj.STEPS;

        }

        // get derivative stats
        var myStats = GetDerivativeStatistics(
            myCueObj.treeHITS,
            myCueObj.treeMISSES,
            myCueObj.treeFALSE_ALARMS,
            myCueObj.treeCORRECT_REJECTIONS,
            myCueObj.treeUNDECIDED_POS,
            myCueObj.treeUNDECIDED_NEG,
            myCueObj.treeSTEPS);
        // rename keys e.g. PHITS to treePHITS and add derivative stats to other stats
        for (var myAttr in myStats) {
            myCueObj['tree'+myAttr] = myStats[myAttr];
        }

    });

    var myAnalysis = {};
    myAnalysis.general_stats = myGeneralStats;
    myAnalysis.cues_stats = myTreeArray;
    myAnalysis.dataset_stepinfo = myDatasetStepInfo;

    return myAnalysis
}
*/
