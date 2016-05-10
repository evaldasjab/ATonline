/**
 * Created by evo on 14/12/15.
 */

function GetBetaWeightsForMultiLinearRegression (sampleDataset, dragCriterionList, enabledCues) {
    console.log('RUN Get Beta Weights');

    // make dataset's DEEP copy
    var myDataset = $.extend(true, [], sampleDataset);

    // get criterion
    var myCritId = dragCriterionList[0].CueName;

    // remove criterion from cue mapping array
    var allCuesArray = $.grep(enabledCues, function(e){ return e.CueName != myCritId; });

    // remove disabled cues from cue mapping array - just in case
    var myCuesArray = $.grep(allCuesArray, function(e){ return e.IsDisabled == false; });

    var datasetArray = [];
    var criterionArray = [];

    // convert dataset to array of arrays, leaving only enabled cues without criterion - X (design matrix)
    myDataset.forEach(function(myCaseObj) {

        // start case/row with the column of 1s
        var caseArray= [1];

        myCuesArray.forEach(function(myCueObj) {

            var cueName = myCueObj.CueName;
            //var cueValue = myCaseObj[cueName];
            var cueValue = myCaseObj[cueName] ? 1 : -1; // convert 0 to -1
            caseArray.push(cueValue);
        });

        datasetArray.push(caseArray);

        // create array of criterion values - Y matrix (response vector)
        criterionArray.push( myCaseObj[myCritId] );

    });

    var transpDatasetArray = math.transpose(datasetArray);

    var XtranspMultX = math.multiply(transpDatasetArray, datasetArray);
    var XtranspMultY = math.multiply(transpDatasetArray, criterionArray);
    var betasArray = math.divide(XtranspMultY, XtranspMultX);

    //console.log(betasArray);

    //convert to object, add names
    var myBetaWeights = {};
    // beta zero
    myBetaWeights.betaZero = betasArray[0] // because we added first column of 1s to X matrix
    // other betas
    myCuesArray.forEach(function(myCueObj, myIndex) {

        var cueName = myCueObj.CueName;

        //myBetaWeights[cueName] = betasArray[myIndex];
        myBetaWeights[cueName] = betasArray[myIndex+1];
    });

    console.log(myBetaWeights);
    //debugger;

    return myBetaWeights;
}

function MultiLinearRegression (trainDataset, myDataset, dragCriterionList, origTreeArray) {
    console.log('RUN Multi Linear Regression');
    //console.log(myTreeArray);

    // DEEP COPY tree array
    var myTreeArray = $.extend(true, [], origTreeArray);

    // get betas
    var myBetaWeights = GetBetaWeightsForMultiLinearRegression (trainDataset, dragCriterionList, myTreeArray);

    var myCritId = dragCriterionList[0].CueName;

    var STEPS = 0, HITS = 0, MISSES = 0, FALSE_ALARMS = 0, CORRECT_REJECTIONS = 0, UNDECIDED_POS = 0, UNDECIDED_NEG = 0;
    var HITS_DECIDE = 0, MISSES_DECIDE = 0, UNDECIDABLE_DECIDE = 0;
    var HITS_GUESS = 0, MISSES_GUESS = 0, UNDECIDABLE_GUESS = 0, UNDECIDABLE = 0;

    // go through every case, except the last one
    for (var c1 = 0; c1 < myDataset.length; c1++) {
        var myCase1 = myDataset[c1];

        // go through every case, except the first one
        for (var c2 = c1 + 1; c2 < myDataset.length; c2++) {
            var myCase2 = myDataset[c2];

            // reset variables
            var innerStep = 0;
            var sumCase1 = myBetaWeights.betaZero;  //or 0
            var sumCase2 = myBetaWeights.betaZero;  //or 0
            var myDecision = '';
            var wasGuess = false;

            // go through each tree cue
            for (var t = 0; t < myTreeArray.length; t++) {  // CAN'T USE forEach because need to use 'break' statement
                innerStep++;

                var cueName = myTreeArray[t].CueName;
                var cueValueCase1 = myCase1[cueName] ? 1 : -1; // convert 0 to -1
                var cueValueCase2 = myCase2[cueName] ? 1 : -1; // convert 0 to -1

                // get cue's beta weight
                var betaWeight = myBetaWeights[cueName];

                // add cue values (1 or 0) weighted  according to beta
                var myCase1Add = cueValueCase1 * betaWeight;
                var myCase2Add = cueValueCase2 * betaWeight;

                sumCase1 += myCase1Add;
                sumCase2 += myCase2Add;
            }

            // if the sum of caseX positive cues is bigger than caseY, predict caseX criterion bigger than caseY
            if (sumCase1 > sumCase2) {

                myDecision = 'true';

                // if the sum is smaller, predict caseX criterion the same as caseY
            } else if (sumCase1 < sumCase2) {

                myDecision = 'false';

                // if the sum is equal, guess
            } else {

                if (Math.random() < 0.5) {
                    myDecision = 'true';
                } else {
                    myDecision = 'false';
                }
                wasGuess = true;
            }

            //////////////////////
            // if the prediction is true
            if (myDecision == 'true') {

                // if case1 criterion value  is bigger than case2 criterion value
                if (myCase1[myCritId] > myCase2[myCritId]) {

                    if (wasGuess == false) {
                        HITS_DECIDE++;                                   // for general stats
                    } else {
                        HITS_GUESS++;                                    // for general stats
                    }

                    HITS++;                                   // for general stats
                    STEPS += innerStep;

                // if case1 criterion value is smaller than case2 criterion value
                } else if (myCase1[myCritId] < myCase2[myCritId]) {

                    if (wasGuess == false) {
                        MISSES_DECIDE++;                // for general stats
                    } else {
                        MISSES_GUESS++;                // for general stats
                    }

                    MISSES++;                // for general stats
                    STEPS += innerStep;

                // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                } else {

                    if (wasGuess == false) {
                        UNDECIDABLE_DECIDE++;                // for general stats
                    } else {
                        UNDECIDABLE_GUESS++;                // for general stats
                    }

                    UNDECIDABLE++;           // for general stats
                    STEPS += innerStep;
                }

            // if there was a decision/guess and prediction is false
            } else if (myDecision == 'false') {

                // if case1 criterion value  is bigger than case2 criterion value
                if (myCase1[myCritId] > myCase2[myCritId]) {

                    if (wasGuess == false) {
                        MISSES_DECIDE++;                // for general stats
                    } else {
                        MISSES_GUESS++;                // for general stats
                    }

                    MISSES++;                // for general stats
                    STEPS += innerStep;

                // if case1 criterion value  is smaller than case2 criterion value
                } else if (myCase1[myCritId] < myCase2[myCritId]) {

                    if (wasGuess == false) {
                        HITS_DECIDE++;                // for general stats
                    } else {
                        HITS_GUESS++;                // for general stats
                    }

                    HITS++;                // for general stats
                    STEPS += innerStep;

                // if case1 criterion value is the same as case2 criterion value
                } else {

                    if (wasGuess == false) {
                        UNDECIDABLE_DECIDE++;                // for general stats
                    } else {
                        UNDECIDABLE_GUESS++;                // for general stats
                    }

                    UNDECIDABLE++;           // for general stats
                    STEPS += innerStep;
                }
            }
            ////////////////////////////////

            /*console.log('CASE HITS: '+HITS);
             console.log('CASE MISSES: ' + MISSES);
             console.log('CASE UNDECIDABLE: ' + UNDECIDABLE);
             console.log('CASE STEPS: ' + STEPS);
            debugger;*/
        }
    }

    // make object of tree's general stats
    var myGeneralStats = {};

    myGeneralStats.STEPS = STEPS;

    myGeneralStats.HITS = HITS;
    myGeneralStats.MISSES = MISSES;
    myGeneralStats.FALSE_ALARMS = FALSE_ALARMS;
    myGeneralStats.CORRECT_REJECTIONS = CORRECT_REJECTIONS;
    myGeneralStats.UNDECIDED_POS = UNDECIDED_POS;
    myGeneralStats.UNDECIDED_NEG = UNDECIDED_NEG;

    myGeneralStats.HITS_DECIDE = HITS_DECIDE;
    myGeneralStats.HITS_GUESS = HITS_GUESS;
    myGeneralStats.MISSES_DECIDE = MISSES_DECIDE;
    myGeneralStats.MISSES_GUESS = MISSES_GUESS;
    myGeneralStats.UNDECIDABLE_DECIDE = UNDECIDABLE_DECIDE;
    myGeneralStats.UNDECIDABLE_GUESS = UNDECIDABLE_GUESS;
    myGeneralStats.UNDECIDABLE = UNDECIDABLE;
    myGeneralStats.BetaWeights = myBetaWeights;

    // get derivative statistics (here - for general stats)
    myGeneralStats = GetDerivativeStatistics(myGeneralStats);

    return myGeneralStats;
}

function MultiLogisticRegression (trainDataset, myDataset, dragCriterionList, enabledCues) {
    console.log('RUN Multi Logistic Regression');
    //console.log(myTreeArray);

    var myCritId = dragCriterionList[0].CueName;

    // remove criterion from cue mapping array
    var myTreeArray = $.grep(enabledCues, function(e){ return e.CueName != myCritId; });

    // get betas
    var myBetaWeights = GetBetaWeightsForMultiLinearRegression (trainDataset, dragCriterionList, enabledCues);

    var STEPS = 0, HITS = 0, MISSES = 0, FALSE_ALARMS = 0, CORRECT_REJECTIONS = 0, UNDECIDED_POS = 0, UNDECIDED_NEG = 0;
    var HITS_DECIDE = 0, MISSES_DECIDE = 0, UNDECIDABLE_DECIDE = 0;
    var HITS_GUESS = 0, MISSES_GUESS = 0, UNDECIDABLE_GUESS = 0, UNDECIDABLE = 0;

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
        var sumCase = myBetaWeights.betaZero;  //or 0

        // for each tree cue
        for (var c = 0; c < myTreeArray.length; c++) {  // CAN'T USE forEach because need to use 'break' statement
            innerStep++;

            var cueName = myTreeArray[c].CueName;
            var cueValue = myCaseObj[cueName] ? 1 : -1; // convert 0 to -1
            var betaWeight = myBetaWeights[cueName];

            // add cue values (1 or 0) weighted  according to beta
            var myCaseAdd = myCaseObj[cueName] * betaWeight;
            sumCase += myCaseAdd;
        }

        // get exponential of the sum
        var expCase = Math.exp(sumCase);

        // get probability - multiple logistic equasion
        var probCase = expCase / (1 + expCase);

        // if probability over 0.5, predict 1
        if (probCase > 0.5) {

            if (myCaseObj[myCritId] == 1) {

                HITS++;
                UNDECIDED_POS--;

            } else {  // if (myCaseObj[myCritId] == 0)

                FALSE_ALARMS++;
                UNDECIDED_NEG--;
            }
                STEPS += innerStep;

        // if probability is 0.5 or less, predict 0
        } else {

            if (myCaseObj[myCritId] == 0) {

                CORRECT_REJECTIONS++;
                UNDECIDED_NEG--;

            } else {  // if (myCaseObj[myCritId] == 1)

                MISSES++;
                UNDECIDED_POS--;
            }
            STEPS += innerStep;
        }

        /*console.log('CASE HITS: '+HITS);
         console.log('CASE MISSES: ' + MISSES);
         console.log('CASE CORRECT_REJECTIONS: ' + CORRECT_REJECTIONS);
         console.log('CASE FALSE_ALARMS: ' + FALSE_ALARMS);
         console.log('CASE UNDECIDED_POS: ' + UNDECIDED_POS);
         console.log('CASE UNDECIDED_NEG: ' + UNDECIDED_NEG);
         debugger;*/

    });

    // make object of tree's general stats
    var myGeneralStats = {};

    myGeneralStats.STEPS = STEPS;

    myGeneralStats.HITS = HITS;
    myGeneralStats.MISSES = MISSES;
    myGeneralStats.FALSE_ALARMS = FALSE_ALARMS;
    myGeneralStats.CORRECT_REJECTIONS = CORRECT_REJECTIONS;
    myGeneralStats.UNDECIDED_POS = UNDECIDED_POS;
    myGeneralStats.UNDECIDED_NEG = UNDECIDED_NEG;

    myGeneralStats.HITS_DECIDE = HITS_DECIDE;
    myGeneralStats.HITS_GUESS = HITS_GUESS;
    myGeneralStats.MISSES_DECIDE = MISSES_DECIDE;
    myGeneralStats.MISSES_GUESS = MISSES_GUESS;
    myGeneralStats.UNDECIDABLE_DECIDE = UNDECIDABLE_DECIDE;
    myGeneralStats.UNDECIDABLE_GUESS = UNDECIDABLE_GUESS;
    myGeneralStats.UNDECIDABLE = UNDECIDABLE;
    myGeneralStats.BetaWeights = myBetaWeights;

    // get derivative statistics (here - for general stats)
    myGeneralStats = GetDerivativeStatistics(myGeneralStats);

    return myGeneralStats;
}


function LinearModel (myModel, myDataset, dragCriterionList, origTreeArray, myValidities, myValidOrderBy) {
    console.log('RUN Linear Model');
    //console.log(myTreeArray);

    // DEEP COPY tree array
    var myTreeArray = $.extend(true, [], origTreeArray);

    var myCritId = dragCriterionList[0].CueName;

    var STEPS = 0, HITS = 0, MISSES = 0, FALSE_ALARMS = 0, CORRECT_REJECTIONS = 0, UNDECIDED_POS = 0, UNDECIDED_NEG = 0;
    var HITS_DECIDE = 0, MISSES_DECIDE = 0, UNDECIDABLE_DECIDE = 0;
    var HITS_GUESS = 0, MISSES_GUESS = 0, UNDECIDABLE_GUESS = 0, UNDECIDABLE = 0;

    // go through every case, except the last one
    for (var c1 = 0; c1 < myDataset.length; c1++) {
        var myCase1 = myDataset[c1];

        // go through every case, except the first one
        for (var c2 = c1 + 1; c2 < myDataset.length; c2++) {
            var myCase2 = myDataset[c2];

            // reset variables
            var innerStep = 0;
            var sumCase1 = 0
            var sumCase2 = 0
            var myDecision = '';
            var wasGuess = false;

            // go through each tree cue
            for (var t = 0; t < myTreeArray.length; t++) {  // CAN'T USE forEach because need to use 'break' statement
                innerStep++;

                var cueName = myTreeArray[t].CueName;
                var cueValueCase1 = myCase1[cueName] ? 1 : -1; // convert 0 to -1
                var cueValueCase2 = myCase2[cueName] ? 1 : -1; // convert 0 to -1

                // get cue's validity, remember if it is flipped
                var cueValid = $.grep(myValidities, function (e) {return e.CueName == cueName;})[0];

                // if unit-weight linear model, validities are not used
                if (myModel == 'UWLM') {
                    var myValidity = 1;

                // if weighted linear model
                } else {
                    //var myValidity = myFind[0].validity;
                    var myValidity = cueValid[myValidOrderBy];
                }

                // if cue validity is not flipped
                if (cueValid.isFlipped == false) {
                    // add cue values (1 or 0) weighted  according to validity
                    var myCase1Add = cueValueCase1 * myValidity;
                    var myCase2Add = cueValueCase2 * myValidity;

                } else {
                    // add the opposite binary values (-1 or 1) weighted  according to validity
                    var myCase1Add = cueValueCase1 ? -1 : 1 * myValidity;
                    var myCase2Add = cueValueCase1 ? -1 : 1 * myValidity;
                }

                sumCase1 += myCase1Add;
                sumCase2 += myCase2Add;
            }

            // if the sum of caseX positive cues is bigger than caseY, predict caseX criterion bigger than caseY
            if (sumCase1 > sumCase2) {

                myDecision = 'true';

                // if the sum is smaller, predict caseX criterion the same as caseY
            } else if (sumCase1 < sumCase2) {

                myDecision = 'false';

                // if the sum is equal, guess
            } else {

                if (Math.random() < 0.5) {
                    myDecision = 'true';
                } else {
                    myDecision = 'false';
                }
                wasGuess = true;
            }

            //////////////////////
            // if the prediction is true
            if (myDecision == 'true') {

                // if case1 criterion value  is bigger than case2 criterion value
                if (myCase1[myCritId] > myCase2[myCritId]) {

                    if (wasGuess == false) {
                        HITS_DECIDE++;                                   // for general stats
                    } else {
                        HITS_GUESS++;                                    // for general stats
                    }

                    HITS++;                                   // for general stats
                    STEPS += innerStep;

                    // if case1 criterion value is smaller than case2 criterion value
                } else if (myCase1[myCritId] < myCase2[myCritId]) {

                    if (wasGuess == false) {
                        MISSES_DECIDE++;                // for general stats
                    } else {
                        MISSES_GUESS++;                // for general stats
                    }

                    MISSES++;                // for general stats
                    STEPS += innerStep;

                    // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                } else {

                    if (wasGuess == false) {
                        UNDECIDABLE_DECIDE++;                // for general stats
                    } else {
                        UNDECIDABLE_GUESS++;                // for general stats
                    }

                    UNDECIDABLE++;           // for general stats
                    STEPS += innerStep;
                }

                // if there was a decision/guess and prediction is false
            } else if (myDecision == 'false') {

                // if case1 criterion value  is bigger than case2 criterion value
                if (myCase1[myCritId] > myCase2[myCritId]) {

                    if (wasGuess == false) {
                        MISSES_DECIDE++;                // for general stats
                    } else {
                        MISSES_GUESS++;                // for general stats
                    }

                    MISSES++;                // for general stats
                    STEPS += innerStep;

                    // if case1 criterion value  is smaller than case2 criterion value
                } else if (myCase1[myCritId] < myCase2[myCritId]) {

                    if (wasGuess == false) {
                        HITS_DECIDE++;                // for general stats
                    } else {
                        HITS_GUESS++;                // for general stats
                    }

                    HITS++;                // for general stats
                    STEPS += innerStep;

                    // if case1 criterion value is the same as case2 criterion value
                } else {

                    if (wasGuess == false) {
                        UNDECIDABLE_DECIDE++;                // for general stats
                    } else {
                        UNDECIDABLE_GUESS++;                // for general stats
                    }

                    UNDECIDABLE++;           // for general stats
                    STEPS += innerStep;
                }
            }
            ////////////////////////////////

            /*console.log('CASE HITS: '+HITS);
            console.log('CASE MISSES: ' + MISSES);
            console.log('CASE UNDECIDABLE: ' + UNDECIDABLE);
            console.log('CASE STEPS: ' + STEPS);
            debugger;*/
        }
    }

    // make object of tree's general stats
    var myGeneralStats = {};

    myGeneralStats.STEPS = STEPS;

    myGeneralStats.HITS = HITS;
    myGeneralStats.MISSES = MISSES;
    myGeneralStats.FALSE_ALARMS = FALSE_ALARMS;
    myGeneralStats.CORRECT_REJECTIONS = CORRECT_REJECTIONS;
    myGeneralStats.UNDECIDED_POS = UNDECIDED_POS;
    myGeneralStats.UNDECIDED_NEG = UNDECIDED_NEG;

    myGeneralStats.HITS_DECIDE = HITS_DECIDE;
    myGeneralStats.HITS_GUESS = HITS_GUESS;
    myGeneralStats.MISSES_DECIDE = MISSES_DECIDE;
    myGeneralStats.MISSES_GUESS = MISSES_GUESS;
    myGeneralStats.UNDECIDABLE_DECIDE = UNDECIDABLE_DECIDE;
    myGeneralStats.UNDECIDABLE_GUESS = UNDECIDABLE_GUESS;
    myGeneralStats.UNDECIDABLE = UNDECIDABLE;

    // get derivative statistics (here - for general stats)
    myGeneralStats = GetDerivativeStatistics(myGeneralStats);

    return myGeneralStats;
}

function GetValidities(myDataset, dragCriterionList, enabledCues) {

    var myCritId = dragCriterionList[0].CueName;

    // remove criterion from cue mapping array
    var allCuesArray = $.grep(enabledCues, function(e){ return e.CueName != myCritId; });

    // remove disabled cues from cue mapping array - just in case
    var myCuesArray = $.grep(allCuesArray, function(e){ return e.IsDisabled == false; });

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
        myValidObj.posValues = 0;
        myValidObj.negValues = 0;
        myValidObj.noOfPairs = 0;
        myValidObj.discrate = 0;
        myValidObj.success = 0;

        // go through every case, except the last one
        for (var c1 = 0; c1 < myDataset.length; c1++) {
            var myCase1 = myDataset[c1];

            // go through every case, except the first one
            for (var c2 = c1+1; c2 < myDataset.length; c2++) {
                var myCase2 = myDataset[c2];

                // if criterion values in both cases are different and cue values are also different
                if ((myCase1[myCritId] != myCase2[myCritId]) && (myCase1[myCueId] != myCase2[myCueId])) {

                    // it's a possible prediction
                    myValidObj.allPred++;

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
        }

        // calculate validities
        myValidObj.validity = myValidObj.corrPred / myValidObj.allPred;

        // if the validity is less than 0.5, flip the cue
        if (myValidObj.validity < 0.5) {
            myValidObj.validity = 1 - myValidObj.validity;
            myValidObj.isFlipped = true;
        }

        // go through every case, except the last one
        for (var c1 = 0; c1 < myDataset.length; c1++) {
            var myCase1 = myDataset[c1];

            // go through every case, except the first one
            for (var c2 = c1+1; c2 < myDataset.length; c2++) {
                var myCase2 = myDataset[c2];

                // count the pairs of cases
                myValidObj.noOfPairs++;

                // if cue value of case 1 is bigger than case 2
                if ( myCase1[myCueId] > myCase2[myCueId] ) {
                    // it's a positive value
                    myValidObj.posValues++;
                    // or if cue value of case 1 is smaller than case 2
                } else if ( myCase1[myCueId] < myCase2[myCueId] ) {
                    // it's a negative value
                    myValidObj.negValues++;
                }
            }
        }

        // calculate discrimination rate
        //myValidObj.discrate = 2 * (myValidObj.posValues/myValidObj.noOfPairs) * (myValidObj.negValues/myValidObj.noOfPairs)
        //    / ( 1 - 1 / myDataset.length);
        myValidObj.discrate = 1 * ((myValidObj.posValues + myValidObj.negValues)/myValidObj.noOfPairs)
            / ( 1 - 1 / myDataset.length);

        /*console.log(myValidObj.posValues);
        console.log(myValidObj.negValues);
        console.log(myValidObj.noOfPairs);
        console.log(myDataset.length);
        debugger;*/

        //myValidObj.discrate = 1 * ((myValidObj.posValues + myValidObj.negValues) / myValidObj.noOfPairs)
        //                    / ( 1 - 1 / myDataset.length);

        // calculate success
        myValidObj.success = myValidObj.validity * myValidObj.discrate;

        // add to the array
        myValidArray.push(myValidObj);
    });

    /*
    // sort the list in descending order by validities
    myValidArray.sort(function(a, b) {
        return parseFloat(b.validity) - parseFloat(a.validity);
    });

    // add index to every entry
    myValidArray.forEach(function (myEntry, myIndex) {
        myEntry.index = myIndex;
    });*/

    return myValidArray;
}

function ResetCuesStatistics(myCuesList) {

    myCuesList.forEach(function(myCueObj, myIndex) {
        delete myCueObj.HITS;
        delete myCueObj.MISSES;
        delete myCueObj.FALSE_ALARMS;
        delete myCueObj.CORRECT_REJECTIONS;
        delete myCueObj.UNDECIDED_POS;
        delete myCueObj.UNDECIDED_NEG;
        delete myCueObj.CRIT_YES_SUM;
        delete myCueObj.CRIT_NO_SUM;
        delete myCueObj.PRED_YES_SUM;
        delete myCueObj.PRED_NO_SUM;
        delete myCueObj.PRED_UND_SUM;
        delete myCueObj.PRED_SUM_SUM;
        delete myCueObj.PHITS;
        delete myCueObj.PHITSMINUSPFA;
        delete myCueObj.DPRIME;
        delete myCueObj.FRUGALITY;
        delete myCueObj.BIAS;
    });
}

function GetDerivativeStatistics(myStats) {

    //var myStats = {};

    myStats.CRIT_YES_SUM = myStats.HITS + myStats.MISSES + myStats.UNDECIDED_POS;
    myStats.CRIT_NO_SUM = myStats.FALSE_ALARMS + myStats.CORRECT_REJECTIONS + myStats.UNDECIDED_NEG;

    myStats.PRED_YES_SUM = myStats.HITS + myStats.FALSE_ALARMS;
    myStats.PRED_NO_SUM = myStats.MISSES + myStats.CORRECT_REJECTIONS;
    myStats.PRED_UND_SUM = myStats.UNDECIDED_POS + myStats.UNDECIDED_NEG;
    myStats.PRED_SUM_SUM = myStats.CRIT_YES_SUM + myStats.CRIT_NO_SUM;

    myStats.DECIDE_SUM = myStats.HITS_DECIDE + myStats.MISSES_DECIDE + myStats.UNDECIDABLE_DECIDE;
    myStats.GUESS_SUM = myStats.HITS_GUESS + myStats.MISSES_GUESS + myStats.UNDECIDABLE_GUESS;
    myStats.SUM_SUM = myStats.HITS + myStats.MISSES + myStats.UNDECIDABLE;
    myStats.SUM_EQUAL = myStats.SUM_SUM + myStats.EQUAL;

    var ts = new TreeStatistics();
    ts.setHitCount(myStats.HITS);
    ts.setMissCount(myStats.MISSES);
    ts.setFaCount(myStats.FALSE_ALARMS);
    ts.setCrCount(myStats.CORRECT_REJECTIONS);
    ts.setUndecidableCount(myStats.UNDECIDABLE);
    ts.setStepsSum(myStats.STEPS);

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

function AnalyseDataset(myHeuristic, myDataset, enabledCues, critArray, myTreeArray, myValidities, myValidOrderBy) {
    console.log('RUN AnalyseDataset for:');
    console.log(myTreeArray);

    var myCritId = critArray[0].CueName;

    // prepare array for StepInfo
    var myDatasetStepInfo = [];

    var STEPS = 0, HITS = 0, MISSES = 0, FALSE_ALARMS = 0, CORRECT_REJECTIONS = 0, UNDECIDED_POS = 0, UNDECIDED_NEG = 0;
    var HITS_DECIDE = 0, MISSES_DECIDE = 0, UNDECIDABLE_DECIDE = 0;
    var HITS_GUESS = 0, MISSES_GUESS = 0, UNDECIDABLE_GUESS = 0, UNDECIDABLE = 0;

    // add zero values
    myTreeArray.forEach(function(myCueObj) {

        myCueObj.STEPS = 0;

        myCueObj.HITS = 0;
        myCueObj.MISSES = 0;
        myCueObj.FALSE_ALARMS = 0;
        myCueObj.CORRECT_REJECTIONS = 0;
        myCueObj.UNDECIDED_POS = 0;
        myCueObj.UNDECIDED_NEG = 0;

        myCueObj.HITS_DECIDE = 0;
        myCueObj.HITS_GUESS = 0;
        myCueObj.MISSES_DECIDE = 0;
        myCueObj.MISSES_GUESS = 0;
        myCueObj.UNDECIDABLE_DECIDE = 0;
        myCueObj.UNDECIDABLE_GUESS = 0;
        myCueObj.UNDECIDABLE = 0;
        myCueObj.EQUAL = 0;
    });

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

                    if (myTreeArray[c].BranchYesExit == true && cueValue == 1) {
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

                    } else if (myTreeArray[c].BranchNoExit == true && cueValue == 0) {
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
                    var myDecision = '';  // can't be boolean, because we need a third value 'null'
                    var wasGuess = false;

                    // go through each tree cue with the possibility to stop the loop
                    for (var t = 0; t < myTreeArray.length; t++) {  // CAN'T USE forEach because need to use 'break' statement
                        innerStep++;
                        var stepInfo = 'STEP '+innerStep+'. ';

                        var cueName = myTreeArray[t].CueName;

                        // if validities exist already (criterion is selected), get cue's validity, remember if it is flipped
                        if (myValidities.length > 0 && cueName != myCritId) {
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

                            if (Math.random() < 0.5) {   // or Math.round(Math.random()) returns a 0 or a 1, each value just about half the time.
                                myDecision = 'true';
                            } else {
                                myDecision = 'false';
                            }
                            wasGuess = true;

                        // if neither, go to the next cue
                        } else {
                            stepInfo += 'CONTINUE on ' + cueName + ' ('+myCase1[cueName]+' = '+myCase2[cueName]+')';

                            myTreeArray[t].EQUAL++;  // for cue stats
                            /*
                            // if case1 criterion value  is bigger than case2 criterion value
                            if (myCase1[myCritId] > myCase2[myCritId]) {

                                myTreeArray[t].EQUAL++; // for cue stats

                                // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                            } else if (myCase1[myCritId] < myCase2[myCritId]) {

                                myTreeArray[t].EQUAL++;  // for cue stats
                            }*/
                        }

                        //////////////////
                        // if there was a decision/guess and prediction is true
                        if (myDecision == 'true') {
                            stepInfo += myCritId+' of first case is bigger ';

                            // if case1 criterion value  is bigger than case2 criterion value
                            if (myCase1[myCritId] > myCase2[myCritId]) {
                                stepInfo += '=> HIT (' + myCase1[myCritId] + ' > ' + myCase2[myCritId] + ')';
                                myCaseStepObj.StepInfo.push(stepInfo);

                                if (wasGuess == false) {
                                    HITS_DECIDE++;                // for general stats
                                    myTreeArray[t].HITS_DECIDE++; // for cue stats
                                } else {
                                    HITS_GUESS++;                // for general stats
                                    myTreeArray[t].HITS_GUESS++; // for cue stats
                                }

                                HITS++;                // for general stats
                                myTreeArray[t].HITS++; // for cue stats
                                STEPS += innerStep;
                                myTreeArray[t].STEPS += innerStep;
                                break;

                            // if case1 criterion value is smaller than case2 criterion value
                            } else if (myCase1[myCritId] < myCase2[myCritId]) {
                                stepInfo += '=> MISS ('+myCase1[myCritId]+' < '+myCase2[myCritId]+')';
                                myCaseStepObj.StepInfo.push(stepInfo);

                                if (wasGuess == false) {
                                    MISSES_DECIDE++;                // for general stats
                                    myTreeArray[t].MISSES_DECIDE++; // for cue stats
                                } else {
                                    MISSES_GUESS++;                // for general stats
                                    myTreeArray[t].MISSES_GUESS++; // for cue stats
                                }

                                MISSES++;                // for general stats
                                myTreeArray[t].MISSES++; // for cue stats
                                STEPS += innerStep;
                                myTreeArray[t].STEPS += innerStep;
                                break;

                            // if case1 criterion value is the same as case2 criterion value
                            } else {
                                stepInfo += '=> UNDECIDABLE ('+myCase1[myCritId]+' = '+myCase2[myCritId]+')';
                                myCaseStepObj.StepInfo.push(stepInfo);

                                if (wasGuess == false) {
                                    UNDECIDABLE_DECIDE++;                // for general stats
                                    myTreeArray[t].UNDECIDABLE_DECIDE++; // for cue stats
                                } else {
                                    UNDECIDABLE_GUESS++;                // for general stats
                                    myTreeArray[t].UNDECIDABLE_GUESS++; // for cue stats
                                }

                                UNDECIDABLE++;           // for general stats
                                myTreeArray[t].UNDECIDABLE++;  // for cue stats
                                STEPS += innerStep;
                                myTreeArray[t].STEPS += innerStep;
                                break;
                            }
                        // if there was a decision/guess and prediction is false
                        } else if (myDecision == 'false') {
                            stepInfo += myCritId+' of first case is smaller ';

                            // if case1 criterion value  is bigger than case2 criterion value
                            if (myCase1[myCritId] > myCase2[myCritId]) {
                                stepInfo += '=> MISS (' + myCase1[myCritId] + ' > ' + myCase2[myCritId] + ')';
                                myCaseStepObj.StepInfo.push(stepInfo);

                                if (wasGuess == false) {
                                    MISSES_DECIDE++;                // for general stats
                                    myTreeArray[t].MISSES_DECIDE++; // for cue stats
                                } else {
                                    MISSES_GUESS++;                // for general stats
                                    myTreeArray[t].MISSES_GUESS++; // for cue stats
                                }

                                MISSES++;                // for general stats
                                myTreeArray[t].MISSES++; // for cue stats
                                STEPS += innerStep;
                                myTreeArray[t].STEPS += innerStep;
                                break;

                                // if case1 criterion value  is smaller than case2 criterion value
                            } else if (myCase1[myCritId] < myCase2[myCritId]) {
                                stepInfo += '=> HIT ('+myCase1[myCritId]+' < '+myCase2[myCritId]+')';
                                myCaseStepObj.StepInfo.push(stepInfo);

                                if (wasGuess == false) {
                                    HITS_DECIDE++;                // for general stats
                                    myTreeArray[t].HITS_DECIDE++; // for cue stats
                                } else {
                                    HITS_GUESS++;                // for general stats
                                    myTreeArray[t].HITS_GUESS++; // for cue stats
                                }

                                HITS++;                // for general stats
                                myTreeArray[t].HITS++; // for cue stats
                                STEPS += innerStep;
                                myTreeArray[t].STEPS += innerStep;
                                break;

                            // if case1 criterion value is the same as case2 criterion value
                            } else {
                                stepInfo += '=> UNDECIDABLE ('+myCase1[myCritId]+' = '+myCase2[myCritId]+')';
                                myCaseStepObj.StepInfo.push(stepInfo);

                                if (wasGuess == false) {
                                    UNDECIDABLE_DECIDE++;                // for general stats
                                    myTreeArray[t].UNDECIDABLE_DECIDE++; // for cue stats
                                } else {
                                    UNDECIDABLE_GUESS++;                // for general stats
                                    myTreeArray[t].UNDECIDABLE_GUESS++; // for cue stats
                                }

                                UNDECIDABLE++;           // for general stats
                                myTreeArray[t].UNDECIDABLE++;  // for cue stats
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
                     console.log('CASE STEPS: ' + STEPS);
                    debugger;*/
                }
            }
            break;

        case 'Tallying':
        case 'Weighted Tallying':

            /*if (myTreeArray.length ==0) { // bug workaround - FIX THIS!!!
                // remove criterion from cue mapping array
                var allCuesArray = $.grep(enabledCues, function(e){ return e.CueName != myCritId; });

                // remove disabled cues from cue mapping array - just in case
                var myTreeArray = $.grep(allCuesArray, function(e){ return e.IsDisabled == false; });
            }*/

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
                    var wasGuess = false;

                    // go through each tree cue
                    for (var t = 0; t < myTreeArray.length; t++) {  // CAN'T USE forEach because need to use 'break' statement
                        innerStep++;
                        stepInfo += 'STEP'+innerStep+'. ';

                        var cueName = myTreeArray[t].CueName;

                        // get cue's validity, remember if it is flipped
                        var cueValid = $.grep(myValidities, function (e) {return e.CueName == cueName;})[0];

                        var isValidFlipped = cueValid.isFlipped;  // if tallying heuristic, validities are not used
                        if (myHeuristic == 'Tallying') {
                            var myValidity = 1;
                        } else {
                            //var myValidity = myFind[0].validity;
                            var myValidity = cueValid[myValidOrderBy];
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
                            stepInfo += ': CONTINUE on ' + cueName + ' ('+parseFloat(sumCase1.toFixed(2))+'+'+parseFloat(myCase1Add.toFixed(2))+' vs '+parseFloat(sumCase2.toFixed(2))+'+'+parseFloat(myCase2Add.toFixed(2))+'), ';
                        } else {
                            stepInfo += ': EXIT on ' + cueName + ' ('+parseFloat(sumCase1.toFixed(2))+'+'+parseFloat(myCase1Add.toFixed(2))+' vs '+parseFloat(sumCase2.toFixed(2))+'+'+parseFloat(myCase2Add.toFixed(2))+';  ';
                        }

                        sumCase1 += myCase1Add;
                        sumCase2 += myCase2Add;

                        // if case1 criterion value  is bigger than case2 criterion value - FIX THIS!!!
                        if (myCase1[myCritId] > myCase2[myCritId]) {

                            myTreeArray[t].EQUAL++; // for cue stats
                            myTreeArray[t].STEPS += innerStep;

                            // if case1 criterion value is the same as case2 criterion value
                        } else {

                            myTreeArray[t].EQUAL++;  // for cue stats
                            myTreeArray[t].STEPS += innerStep;
                        }
                    }

                    // if the sum of caseX positive cues is bigger than caseY, predict caseX criterion bigger than caseY
                    if (sumCase1 > sumCase2) {
                        stepInfo += parseFloat(sumCase1.toFixed(2))+' > '+parseFloat(sumCase2.toFixed(2))+'), ';
                        stepInfo += 'DECISION: ';

                        myDecision = 'true';

                        // if the sum is smaller, predict caseX criterion the same as caseY
                    } else if (sumCase1 < sumCase2) {
                        stepInfo += parseFloat(sumCase1.toFixed(2))+' < '+parseFloat(sumCase2.toFixed(2))+'), ';
                        stepInfo += 'DECISION: ';

                        myDecision = 'false';

                    // if the sum is equal, guess
                    } else {
                        stepInfo += parseFloat(sumCase1.toFixed(2))+' = '+parseFloat(sumCase2.toFixed(2))+'), ';
                        stepInfo += 'GUESS: ';

                        if (Math.random() < 0.5) {
                            myDecision = 'true';
                        } else {
                            myDecision = 'false';
                        }
                        wasGuess = true;
                    }

                    //////////////////////
                    // if the prediction is true
                    if (myDecision == 'true') {
                        stepInfo += myCritId+' of first case is bigger ';

                        // if case1 criterion value  is bigger than case2 criterion value
                        if (myCase1[myCritId] > myCase2[myCritId]) {
                            stepInfo += ' => HIT ('+myCase1[myCritId]+' > '+myCase2[myCritId]+')';
                            //myCaseStepObj.StepInfo.push(stepInfo);

                            if (wasGuess == false) {
                                HITS_DECIDE++;                                   // for general stats
                                myTreeArray[myTreeArray.length-1].HITS_DECIDE++; // for cue stats
                            } else {
                                HITS_GUESS++;                                    // for general stats
                                myTreeArray[myTreeArray.length-1].HITS_GUESS++;  // for cue stats
                            }

                            HITS++;                                   // for general stats
                            myTreeArray[myTreeArray.length-1].HITS++; // for cue stats
                            STEPS += innerStep;
                            myTreeArray[myTreeArray.length-1].EQUAL--;

                        // if case1 criterion value is smaller than case2 criterion value
                        } else if (myCase1[myCritId] < myCase2[myCritId]) {
                            stepInfo += '=> MISS ('+myCase1[myCritId]+' < '+myCase2[myCritId]+')';
                            //myCaseStepObj.StepInfo.push(stepInfo);

                            if (wasGuess == false) {
                                MISSES_DECIDE++;                // for general stats
                                myTreeArray[myTreeArray.length-1].MISSES_DECIDE++; // for cue stats
                            } else {
                                MISSES_GUESS++;                // for general stats
                                myTreeArray[myTreeArray.length-1].MISSES_GUESS++; // for cue stats
                            }

                            MISSES++;                // for general stats
                            myTreeArray[myTreeArray.length-1].MISSES++; // for cue stats
                            STEPS += innerStep;
                            //myTreeArray[myTreeArray.length-1].STEPS += innerStep;
                            myTreeArray[myTreeArray.length-1].EQUAL--;

                         // if case1 criterion value is the same as case2 criterion value (can't be smaller, because we sorted cases)
                        } else {
                            stepInfo += '=> UNDECIDABLE ('+myCase1[myCritId]+' = '+myCase2[myCritId]+')';
                            //myCaseStepObj.StepInfo.push(stepInfo);

                            if (wasGuess == false) {
                                UNDECIDABLE_DECIDE++;                // for general stats
                                myTreeArray[myTreeArray.length-1].UNDECIDABLE_DECIDE++; // for cue stats
                            } else {
                                UNDECIDABLE_GUESS++;                // for general stats
                                myTreeArray[myTreeArray.length-1].UNDECIDABLE_GUESS++; // for cue stats
                            }

                            UNDECIDABLE++;           // for general stats
                            myTreeArray[myTreeArray.length-1].UNDECIDABLE++;  // for cue stats
                            STEPS += innerStep;
                            myTreeArray[myTreeArray.length-1].EQUAL--;
                        }


                    // if there was a decision/guess and prediction is false
                    } else if (myDecision == 'false') {
                        stepInfo += myCritId+' of first case is smaller ';

                        // if case1 criterion value  is bigger than case2 criterion value
                        if (myCase1[myCritId] > myCase2[myCritId]) {
                            stepInfo += '=> MISS ('+myCase1[myCritId]+' > '+myCase2[myCritId]+')';

                            if (wasGuess == false) {
                                MISSES_DECIDE++;                // for general stats
                                myTreeArray[myTreeArray.length-1].MISSES_DECIDE++; // for cue stats
                            } else {
                                MISSES_GUESS++;                // for general stats
                                myTreeArray[myTreeArray.length-1].MISSES_GUESS++; // for cue stats
                            }

                            MISSES++;                // for general stats
                            myTreeArray[myTreeArray.length-1].MISSES++; // for cue stats
                            STEPS += innerStep;
                            myTreeArray[myTreeArray.length-1].EQUAL--;

                        // if case1 criterion value  is smaller than case2 criterion value
                        } else if (myCase1[myCritId] < myCase2[myCritId]) {
                            stepInfo += '=> HIT ('+myCase1[myCritId]+' < '+myCase2[myCritId]+')';
                            //myCaseStepObj.StepInfo.push(stepInfo);

                            if (wasGuess == false) {
                                HITS_DECIDE++;                // for general stats
                                myTreeArray[myTreeArray.length-1].HITS_DECIDE++; // for cue stats
                            } else {
                                HITS_GUESS++;                // for general stats
                                myTreeArray[myTreeArray.length-1].HITS_GUESS++; // for cue stats
                            }

                            HITS++;                // for general stats
                            myTreeArray[myTreeArray.length-1].HITS++; // for cue stats
                            STEPS += innerStep;
                            myTreeArray[myTreeArray.length-1].STEPS += innerStep;

                        // if case1 criterion value is the same as case2 criterion value
                        } else {
                            stepInfo += '=> UNDECIDABLE ('+myCase1[myCritId]+' = '+myCase2[myCritId]+')';
                            //myCaseStepObj.StepInfo.push(stepInfo);

                            if (wasGuess == false) {
                                UNDECIDABLE_DECIDE++;                // for general stats
                                myTreeArray[myTreeArray.length-1].UNDECIDABLE_DECIDE++; // for cue stats
                            } else {
                                UNDECIDABLE_GUESS++;                // for general stats
                                myTreeArray[myTreeArray.length-1].UNDECIDABLE_GUESS++; // for cue stats
                            }

                            UNDECIDABLE++;           // for general stats
                            myTreeArray[myTreeArray.length-1].UNDECIDABLE++;  // for cue stats
                            STEPS += innerStep;
                            myTreeArray[myTreeArray.length-1].EQUAL--;
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

    myGeneralStats.STEPS = STEPS;

    myGeneralStats.HITS = HITS;
    myGeneralStats.MISSES = MISSES;
    myGeneralStats.FALSE_ALARMS = FALSE_ALARMS;
    myGeneralStats.CORRECT_REJECTIONS = CORRECT_REJECTIONS;
    myGeneralStats.UNDECIDED_POS = UNDECIDED_POS;
    myGeneralStats.UNDECIDED_NEG = UNDECIDED_NEG;

    myGeneralStats.HITS_DECIDE = HITS_DECIDE;
    myGeneralStats.HITS_GUESS = HITS_GUESS;
    myGeneralStats.MISSES_DECIDE = MISSES_DECIDE;
    myGeneralStats.MISSES_GUESS = MISSES_GUESS;
    myGeneralStats.UNDECIDABLE_DECIDE = UNDECIDABLE_DECIDE;
    myGeneralStats.UNDECIDABLE_GUESS = UNDECIDABLE_GUESS;
    myGeneralStats.UNDECIDABLE = UNDECIDABLE;

    // get derivative statistics (here - for general stats)
    myGeneralStats = GetDerivativeStatistics(myGeneralStats);

    /*
    // add derivative stats to other stats
    for (var myAttr in myStats) {  // get key / attribute / property of the object
        myGeneralStats[myAttr] = myStats[myAttr];
    }*/

    // calculate and display statistics for the cues in the tree
    //for (var c = 0; c < myTreeArray.length; c++) {
    myTreeArray.forEach(function(myCueObj, myIndex) {

        // get derivative statistics for each cue
        myCueObj = GetDerivativeStatistics(myCueObj);
        /*
        // add derivative stats to other stats
        for (var myAttr in myStats) {
            myCueObj[myAttr] = myStats[myAttr];
        }*/

        // prepare object for treeUpToThisCue stats
        myCueObj.treeUpToThisCue = {};
        var treeUpToThisCue = myCueObj.treeUpToThisCue;

        // update statistics of the tree up to the each cue
        if (myIndex==0) {

            // update statistics of the tree up to the FIRST cue
            treeUpToThisCue.STEPS = myCueObj.STEPS;
            treeUpToThisCue.HITS = myCueObj.HITS;
            treeUpToThisCue.MISSES = myCueObj.MISSES;
            treeUpToThisCue.FALSE_ALARMS = myCueObj.FALSE_ALARMS;
            treeUpToThisCue.CORRECT_REJECTIONS = myCueObj.CORRECT_REJECTIONS;
            treeUpToThisCue.UNDECIDED_POS = myCueObj.UNDECIDED_POS;
            treeUpToThisCue.UNDECIDED_NEG = myCueObj.UNDECIDED_NEG;

            treeUpToThisCue.HITS_DECIDE = myCueObj.HITS_DECIDE;
            treeUpToThisCue.HITS_GUESS = myCueObj.HITS_GUESS;
            treeUpToThisCue.MISSES_DECIDE = myCueObj.MISSES_DECIDE;
            treeUpToThisCue.MISSES_GUESS = myCueObj.MISSES_GUESS;
            treeUpToThisCue.UNDECIDABLE_DECIDE = myCueObj.UNDECIDABLE_DECIDE;
            treeUpToThisCue.UNDECIDABLE_GUESS = myCueObj.UNDECIDABLE_GUESS;
            treeUpToThisCue.UNDECIDABLE = myCueObj.UNDECIDABLE;
            treeUpToThisCue.EQUAL = myCueObj.EQUAL;

        } else {

            // update statistics of the tree up to OTHER cues
            treeUpToThisCue.HITS = myTreeArray[myIndex-1].treeUpToThisCue.HITS + myCueObj.HITS;
            treeUpToThisCue.MISSES = myTreeArray[myIndex-1].treeUpToThisCue.MISSES + myCueObj.MISSES;
            treeUpToThisCue.FALSE_ALARMS = myTreeArray[myIndex-1].treeUpToThisCue.FALSE_ALARMS + myCueObj.FALSE_ALARMS;
            treeUpToThisCue.CORRECT_REJECTIONS = myTreeArray[myIndex-1].treeUpToThisCue.CORRECT_REJECTIONS + myCueObj.CORRECT_REJECTIONS;
            treeUpToThisCue.UNDECIDED_POS = myCueObj.UNDECIDED_POS;
            treeUpToThisCue.UNDECIDED_NEG = myCueObj.UNDECIDED_NEG;
            treeUpToThisCue.STEPS = myTreeArray[myIndex-1].treeUpToThisCue.STEPS + myCueObj.STEPS;

            treeUpToThisCue.HITS_DECIDE = myTreeArray[myIndex-1].treeUpToThisCue.HITS_DECIDE + myCueObj.HITS_DECIDE;
            treeUpToThisCue.HITS_GUESS = myTreeArray[myIndex-1].treeUpToThisCue.HITS_GUESS + myCueObj.HITS_GUESS;
            treeUpToThisCue.MISSES_DECIDE = myTreeArray[myIndex-1].treeUpToThisCue.MISSES_DECIDE + myCueObj.MISSES_DECIDE;
            treeUpToThisCue.MISSES_GUESS = myTreeArray[myIndex-1].treeUpToThisCue.MISSES_GUESS + myCueObj.MISSES_GUESS;
            treeUpToThisCue.UNDECIDABLE_DECIDE = myCueObj.UNDECIDABLE_DECIDE;
            treeUpToThisCue.UNDECIDABLE_GUESS = myCueObj.UNDECIDABLE_GUESS;
            treeUpToThisCue.UNDECIDABLE = myCueObj.UNDECIDABLE;
            treeUpToThisCue.EQUAL = myCueObj.EQUAL;

        }

        // get derivative stats
        myCueObj.treeUpToThisCue = GetDerivativeStatistics(treeUpToThisCue);

        /*    myCueObj.treeHITS,
            myCueObj.treeMISSES,
            myCueObj.treeFALSE_ALARMS,
            myCueObj.treeCORRECT_REJECTIONS,
            myCueObj.treeUNDECIDED_POS,
            myCueObj.treeUNDECIDED_NEG,
            myCueObj.treeSTEPS);
        // rename keys e.g. PHITS to treePHITS and add derivative stats to other stats
        for (var myAttr in myStats) {
            myCueObj['tree'+myAttr] = myStats[myAttr];
        }*/

    });

    var myAnalysis = {};
    myAnalysis.general_stats = myGeneralStats;
    myAnalysis.cues_stats = myTreeArray;
    myAnalysis.general_stats.dataset_stepinfo = myDatasetStepInfo;
    if (myDatasetStepInfo[0]) {  // avoid error if there are now cases (dataset is empty array)
        myAnalysis.general_stats.dataset_stepinfo_colheads = Object.keys(myDatasetStepInfo[0]);
    }

    // dataset_stepinfo_hot table in scope
    /*var scope = angular.element(document.querySelector('#ng_territory')).scope();
    if(!scope.$$phase) {     // bug workaround FIX THIS!!!
        scope.$apply(function () {
            scope.dataset_stepinfo_hot.render();
        });
    }*/

    return myAnalysis
}
