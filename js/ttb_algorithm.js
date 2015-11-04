/**
 * Created by evo on 10/10/15.
 */

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
        myValidObj.cueId = myCueId;
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
    console.log(myValidArray);

    return myValidArray;

}
function AddPredictionValues(myPredictArray, myCueId, myCorrPred, myAllPred) {
    // finds the object(s) with the selected key
    var myFindArray = $.grep(myPredictArray, function(e){
        return e.cueId == myCueId;
    });
    var myValidObj = myFindArray[0];  // the first (and hopefully the only) object in the myFindArray

    myValidObj.corrPred = myValidObj.corrPred + myCorrPred;
    myValidObj.allPred = myValidObj.allPred + myAllPred;
    //console.log(myValidObj);
}

function OrderCuesByValidities(myValidArray, myArea) {
    myValidArray.forEach(function (myValidObj) {
        var myCueId = myValidObj.cueId;
        $('#'+myCueId).appendTo('#'+myArea);
    });
}
