/**
 * Created by evo on 10/10/15.
 */


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

