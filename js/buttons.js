/**
 * Takes care of all buttons & controls
 */

function ShowSpinner(myLocationId) {
    var opts = {
        lines: 11 // The number of lines to draw
        , length: 42 // The length of each line
        , width: 22 // The line thickness
        , radius: 43 // The radius of the inner circle
        , scale: 1 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#000' // #rgb or #rrggbb or array of colors
        , opacity: 0.25 // Opacity of the lines
        , rotate: 0 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 1 // Rounds per second
        , trail: 60 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '50%' // Top position relative to parent
        , left: '50%' // Left position relative to parent
        , shadow: false // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'absolute' // Element positioning
    }
        /*lines: 8 // The number of lines to draw
        , length: 15 // The length of each line
        , width: 10 // The line thickness
        , radius: 12 // The radius of the inner circle
        , scale: 0.25 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: 'Grey' // #rgb or #rrggbb or array of colors
        , opacity: 0.10 // Opacity of the lines
        , rotate: 0 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 1 // Rounds per second
        , trail: 60 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '50%' // Top position relative to parent
        , left: '50%' // Left position relative to parent
        , shadow: false // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'absolute' // Element positioning*/

    var target = document.getElementById(myLocationId)
    var spinner = new Spinner(opts).spin(target);
}

function xButtonContTablePercent() {

    // reset previous button event
    $('#stats_container .button_stat').unbind('mouseup');

    // hide the percentage table
    $('#stats_container #cont_percent').hide();

    // on mouse click, toggle between number and percentage contingency tables
    $('#stats_container .button_stat').mouseup(function () {

        // hide cue stats and show tree stats, sliding left
        $('#stats_container #cont_number').slideToggle();
        $('#stats_container #cont_percent').slideToggle();

        //$('#stats_container .eval_table').animate({height: 'toggle'});
    });
}


function ButtonSaveHeuristic() {

    // enable the button
    $('#save').prop('disabled', false);

    // reset just in case
    $('#save').unbind('mouseup');

    $('#save').mouseup(function (e) {
        console.log('SAVE heuristic BUTTON!');

        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        // connect to angular's scope
        var scope = angular.element(document.querySelector('#ng_territory')).scope();
        scope.$apply(function() {

            // create loading spinner
            ShowSpinner('save');

            console.log('scope:');
            console.log(scope);

            // check if this heuristic already was saved on server before
            //var myHeuristicId = scope.heuristic_id;

            console.log('myHeuristicId:');
            console.log(scope.heuristic_id);

            // update the date
            scope.heuristic_info.Date = new Date();

            // set user to current
            scope.heuristic_info.UserName = 'steve@jobs.com'; // FIX THIS!!!

            // set access to private
            scope.heuristic_info.Access = 'private';

            // take all cues in the tree in the right order
            var myHeuristicStructure = scope.drag_tree;   // in scope.cues_enabled - wrong order!
            // add criterion to beginning of array
            myHeuristicStructure.unshift(scope.drag_criterion[0]);

            // use the same array for cue mapping - works good???
            var myCueMapping = myHeuristicStructure;  // FIX THIS!!!

            scope.heuristic_info.HeuristicStructure = myHeuristicStructure;
            scope.heuristic_info.CueMapping = myCueMapping;

            //console.log(scope.heuristic_info);
            //debugger;

            // add cue objects to arrays
            /*scope.cues_enabled.forEach(function(myCueObj, myIndex) {

                if (myCueObj.CueType != 'cue') {

                    myHeuristicStructure.push(myCueObj); // AR VEIKS su nereikalingais attributais???
                    myCueMapping.push(myCueObj); // ???

                    /!*var myHeurStrObj = {}
                     if (myCueObj.EntryId) {myHeurStrObj.EntryId = myCueObj.EntryId};
                     if (myCueObj.HeuristicId) {myHeurStrObj.HeuristicId = myCueObj.HeuristicId};
                     myHeurStrObj.CueName = myCueObj.CueName;
                     myHeurStrObj.CueType = 'criterion';
                     myHeurStrObj.BranchNo = myCueObj.BranchNo;
                     myHeurStrObj.BranchYes = myCueObj.BranchYes;
                     myHeuristicStructure.push(myHeurStrObj);*!/

                    /!*var myCueMapObj = {}
                     if (myCueObj.MapId) {myCueMapObj.MapId = myCueObj.MapId};
                     if (myCueObj.DatasetId) {myCueMapObj.DatasetId = myCueMapObj.DatasetId};
                     if (myCueObj.HeuristicId) {myCueMapObj.HeuristicId = myCueMapObj.HeuristicId};
                     myCueMapObj.DatasetCueName = myCueObj.DatasetCueName;
                     myCueMapObj.CueName = myCueObj.CueName;
                     myCueMapObj.SplitValue = myCueObj.SplitValue;
                     myCueMapObj.IsFlipped = myCueObj.IsFlipped;
                     myCueMapObj.MinValue = myCueObj.MinValue;
                     myCueMapObj.MaxValue = myCueObj.MaxValue;
                     myCueMapping.push(myCueMapObj);*!/
                }
            });*/

            /*scope.drag_tree.forEach(function(myCueObj, myIndex) {
                var myHeurStrObj = {}
                if (myCueObj.EntryId) {myHeurStrObj.EntryId = myCueObj.EntryId};
                if (myCueObj.HeuristicId) {myHeurStrObj.HeuristicId = myCueObj.HeuristicId};
                myHeurStrObj.CueName = myCueObj.CueName;
                myHeurStrObj.CueType = 'treecue';
                myHeurStrObj.BranchNo = myCueObj.BranchNo;
                myHeurStrObj.BranchYes = myCueObj.BranchYes;
                myHeuristicStructure.push(myHeurStrObj);

                var myCueMapObj = {}
                if (myCueObj.MapId) {myCueMapObj.MapId = myCueObj.MapId};
                if (myCueObj.DatasetId) {myCueMapObj.DatasetId = myCueMapObj.DatasetId};
                if (myCueObj.HeuristicId) {myCueMapObj.HeuristicId = myCueMapObj.HeuristicId};
                myCueMapObj.DatasetCueName = myCueObj.DatasetCueName;
                myCueMapObj.CueName = myCueObj.CueName;
                myCueMapObj.SplitValue = myCueObj.SplitValue;
                myCueMapObj.IsFlipped = myCueObj.IsFlipped;
                myCueMapObj.MinValue = myCueObj.MinValue;
                myCueMapObj.MaxValue = myCueObj.MaxValue;
                myCueMapping.push(myCueMapObj);
            });
            scope.drag_cues_list.forEach(function(myCueObj, myIndex) {

                // check if cue is not selected (already in criterion or tree), - semitransparent
                if (!$('#'+myCueObj.CueName+' .widget_head').hasClass('cue_selected')) {

                    var myHeurStrObj = {}
                    if (myCueObj.EntryId) {myHeurStrObj.EntryId = myCueObj.EntryId};
                    if (myCueObj.HeuristicId) {myHeurStrObj.HeuristicId = myCueObj.HeuristicId};
                    myHeurStrObj.CueName = myCueObj.CueName;
                    myHeurStrObj.CueType = 'cue';
                    myHeurStrObj.BranchNo = myCueObj.BranchNo;
                    myHeurStrObj.BranchYes = myCueObj.BranchYes;
                    myHeuristicStructure.push(myHeurStrObj);

                    var myCueMapObj = {}
                    if (myCueObj.MapId) {myCueMapObj.MapId = myCueObj.MapId};
                    if (myCueObj.DatasetId) {myCueMapObj.DatasetId = myCueMapObj.DatasetId};
                    if (myCueObj.HeuristicId) {myCueMapObj.HeuristicId = myCueMapObj.HeuristicId};
                    myCueMapObj.DatasetCueName = myCueObj.DatasetCueName;
                    myCueMapObj.CueName = myCueObj.CueName;
                    myCueMapObj.SplitValue = myCueObj.SplitValue;
                    myCueMapObj.IsFlipped = myCueObj.IsFlipped;
                    myCueMapObj.MinValue = myCueObj.MinValue;
                    myCueMapObj.MaxValue = myCueObj.MaxValue;
                    myCueMapping.push(myCueMapObj);
                }
            });*/

            console.log('Posting to server, PLEASE WAIT...');

            $.evoAppServices.heuristicInfoes.postHeuristicInfo(scope.heuristic_info)
                .success(function (response) {
                    console.log('POST heuristic SUCCESS! response:');
                    console.log(response);
                    //scope.heuristic_id = response.HeuristicId;
                    //scope.heuristic_info.HeuristicId = response.HeuristicId;
                    //scope.heuristic_info = response;

                    // go to page heuristics/heuristic_id
                    document.location.href = 'index.html#/fft/'+response.HeuristicId; // FIX THIS!!!
                    // window.location.href  // use to reload the page after changing the URL
                    // $location.path('/heur/'+scope.heuristic_id;  // doesn't reload the page
                    //$location.path();   // get the current path

                }).error(function (data, status, headers, config) {
                    console.log('POST heuristic info FAIL');

                    // delete loading spinner
                    $('#save .spinner').remove();
                });

            // save to scope, just in case
            //scope.heuristic_info.HeuristicStructure = myHeuristicStructure;
            //scope.heuristic_info.CueMapping = myCueMapping;

            // get heuristic info from scope
            //var myHeuristicInfo = scope.heuristic_info;
            //var myHeuristicStructure = scope.heuristic_info.HeuristicStructure;

            /*console.log('myHeuristicInfo for PUT or POST');

            // POST if there is no heuristic_id (save new) or access is public (save copy)
            if (!myHeuristicId || scope.heuristic_info.Access == 'public') {

                scope.heuristic_info.Access = 'private';

                $.evoAppServices.heuristicInfoes.postHeuristicInfo(scope.heuristic_info)
                    .success(function (response) {
                        console.log('AJAX POST SUCCESS! response:');
                        console.log(response);
                        scope.heuristic_id = response.HeuristicId;
                        //scope.heuristic_info.HeuristicId = response.HeuristicId;
                        //scope.heuristic_info = response;

                        // go to page heuristics/heuristic_id
                        document.location.href = 'index.html#/heur/'+scope.heuristic_id; // FIX THIS!!!
                        // window.location.href  // use to reload the page after changing the URL
                        // $location.path('/heur/'+scope.heuristic_id;  // doesn't reload the page
                        //$location.path();   // get the current path

                    }).error(function (data, status, headers, config) {
                        console.log('AJAX POST FAIL');
                    });

            } else {

                // PUT if there is heuristic_id (update in SQL) using AJAX
                $.evoAppServices.heuristicInfoes.putHeuristicInfo(myHeuristicId, myHeuristicInfo)
                    .success(function (response) {
                        console.log('AJAX PUT SUCCESS! response:');
                        //console.log(response);
                    }).error(function (response, status, headers, config) {
                        console.log('AJAX PUT FAIL');
                    });


                // update HeuristicStructure entries separately one by one, doesn't update with heuristic_info...
                //var myHeurStructArray = myHeuristicInfo.HeuristicStructure;
                myHeuristicStructure.forEach(function(myEntry, myIndex) {
                    $.evoAppServices.heuristicStructures.putHeuristicStructure(myEntry.EntryId, myEntry)
                        .success(function (response) {
                            console.log('ADDITIONAL AJAX PUT SUCCESS! response:');
                            //console.log(response);
                        }).error(function (response, status, headers, config) {
                            console.log('ADDITIONAL AJAX PUT FAIL');
                        });
                });
            }*/
        });

        //return false;                                            // Return false, prevent default action
    })
}

function ButtonPublishHeuristic() {

    // enable the button
    $('#publish').prop('disabled', false);

    // reset just in case
    $('#publish').unbind('mouseup');

    $('#publish').mouseup(function (e) {
        console.log('PUBLISH BUTTON!');

        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        // connect to angular's scope
        var scope = angular.element(document.querySelector('#ng_territory')).scope();
        scope.$apply(function() {

            // update date
            scope.heuristic_info.Date = new Date();

            // update access
            scope.heuristic_info.Access = 'public';

            // remove CueMapping, otherwise the server gives an error
            //var myHeuristicInfo = $.extend(true, [], scope.heuristic_info);  // make DEEP copy
            //delete myHeuristicInfo.AspNetUsers;  // ??
            //delete myHeuristicInfo.CueMapping;
            //delete myHeuristicInfo.HeuristicStructure;

            //console.log(myHeuristicInfo);
            //debugger;

            // update the heuristic_info on server
            $.evoAppServices.heuristicInfoes.putHeuristicInfo(scope.heuristic_id, scope.heuristic_info)
                .success(function (response) {
                    console.log('PUT heuristic_info SUCCESS');
                    //console.log(response) <-- server doesn't send any response;

                    // disable PUBLISH button
                    $('#publish').prop('disabled', true);
                    $('#publish').unbind('mouseup');

                    // disable REMOVE button
                    $('#remove').prop('disabled', true);
                    $('#remove').unbind('mouseup');

                }).error(function (response, status, headers, config) {
                    console.log('PUT heuristic_info FAIL');
                    console.log(response);

                    // update access back
                    scope.heuristic_info.Access = 'private';
                });
        });

        return false;      // prevent default action
    })
}

function ButtonChooseDataset(myHeurId) {

    // enable the button
    $('#choose_dataset').prop('disabled', false);

    // reset just in case
    $('#choose_dataset').unbind('mouseup');

    $('#choose_dataset').mouseup(function (e) {
        console.log('PUBLISH BUTTON!');

        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        // go to page heuristics/heuristic_id/choose_data
        document.location.href = 'index.html#/heur/'+myHeurId+'/choose_data';

        // connect to angular's scope
        /*var scope = angular.element(document.querySelector('#ng_territory')).scope();
        scope.$apply(function() {

            // go to page heuristics/heuristic_id/choose_data
            document.location.href = 'index.html#/heur/'+scope.heuristic_id+'/choose_data';
        });*/

        return false;                                            // Return false, prevent default action
    })
}

function ButtonRemoveHeuristic(myHeurId) {

    // enable the button
    $('#remove').prop('disabled', false);

    // reset just in case
    $('#remove').unbind('mouseup');

    $('#remove').mouseup(function (e) {
        console.log('REMOVE BUTTON!');

        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        $.evoAppServices.heuristicInfoes.deleteHeuristicInfo(myHeurId)
            .success(function (response) {
                console.log('AJAX SUCCESS! response:');
                console.log(response);
                //scope.heuristic_info = response;

                // go to the parent page - FIX THIS!!!
                window.location.href = window.location.pathname+'#/';

            }).error(function (data, status, headers, config) {
                console.log('AJAX FAIL');
            });
        /*
        // connect to angular's scope
        var scope = angular.element(document.querySelector('#ng_territory')).scope();
        scope.$apply(function() {

            $.evoAppServices.heuristicInfoes.deleteHeuristicInfo(myHeuristicId)
                .success(function (response) {
                    console.log('AJAX SUCCESS! response:');
                    console.log(response);
                    //scope.heuristic_info = response;

                    // go to the parent page - FIX THIS!!!
                    window.location.href = window.location.pathname+'#/';

                }).error(function (data, status, headers, config) {
                    console.log('AJAX FAIL');
                });
        });*/

        return false;    // prevent default action
    })
}

function ButtonSaveDataset() {

    // enable the button
    $('#save').prop('disabled', false);

    // reset just in case
    $('#save').unbind('mouseup');

    $('#save').mouseup(function (e) {
        console.log('SAVE dataset BUTTON!');

        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        // connect to angular's scope
        var scope = angular.element(document.querySelector('#ng_territory')).scope();
        scope.$apply(function() {

            // create loading spinner
            ShowSpinner('save');

            console.log('scope:');
            console.log(scope);

            // check if this dataset already was saved on server before
            //var myDatasetId = scope.dataset_id;

            console.log('myDatasetId:');
            console.log(scope.dataset_id);

            // set user to current
            scope.dataset_info.UserName = 'steve@jobs.com'; // FIX THIS!!!

            // set access to private
            scope.dataset_info.Access = 'private';

            // update the date
            scope.dataset_info.Date = new Date();

            // get dataset info from scope
            //var myObj = scope.dataset_info;
            //var myDataInfo = scope.dataset_info;
            //var myDataFull = scope.dataset_info.DatasetFull;

            //delete myDataInfo.CueMapping;
            //delete myDataInfo.DatasetFull

            console.log('Posting to server, PLEASE WAIT...');

            $.evoAppServices.datasetInfoes.postDatasetInfo(scope.dataset_info)
                .success(function (response) {
                    console.log('POST dataset info SUCCESS! response:');
                    console.log(response);
                    //scope.dataset_id = response.DatasetId;
                    //scope.dataset_info = response;

                    // go to page datasets/dataset_id
                    document.location.href = 'index.html#/data/'+response.DatasetId; // FIX THIS!!!

                }).error(function (data, status, headers, config) {
                    console.log('POST dataset info FAIL');
                });

            // POST (add) if there is no dataset_id
            /*if (!myDatasetId) {

                console.log('Posting to server, PLEASE WAIT...');

                $.evoAppServices.datasetInfoes.postDatasetInfo(myDataInfo)
                    .success(function (response) {
                        console.log('POST dataset info SUCCESS! response:');
                        console.log(response);
                        scope.dataset_id = response.DatasetId;
                        //scope.dataset_info = response;

                        // go to page datasets/dataset_id
                        document.location.href = 'index.html#/data/'+scope.dataset_id; // FIX THIS!!!

                    }).error(function (data, status, headers, config) {
                        console.log('POST dataset info FAIL');
                    });

            } else {   // PUT (update) if there is dataset_id

                console.log(myDatasetId);
                console.log('Updating to server, PLEASE WAIT...');

                $.evoAppServices.datasetInfoes.putDatasetInfo(myDatasetId, myObj)
                    .success(function (response) {
                        console.log('PUT dataset info SUCCESS! response:');
                        console.log(response);
                    }).error(function (response, status, headers, config) {
                        console.log('PUT dataset info FAIL');
                        //console.log(response);

                    });*/

                //console.log(myObj.DatasetFull);
                //debugger;

                // update HeuristicStructure entries separately one by one, doesn't update with heuristic_info...
                /*var myHeurStructArray = myObj.HeuristicStructure;
                myHeurStructArray.forEach(function(myEntry, myIndex) {
                    $.evoAppServices.heuristicStructures.putHeuristicStructure(myEntry.EntryId, myEntry)
                        .success(function (response) {
                            console.log('ADDITIONAL AJAX SUCCESS! response:');
                            //console.log(response);
                        }).error(function (response, status, headers, config) {
                            console.log('AJAX FAIL');
                            console.log(response);

                        });

                });*/





        });

        return false;                                            // Return false, prevent default action
    })
}

function ButtonPublishDataset() {

    // enable the button
    $('#publish').prop('disabled', false);

    // reset just in case
    $('#publish').unbind('mouseup');

    $('#publish').mouseup(function (e) {
        console.log('PUBLISH BUTTON!');
        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        // connect to angular's scope
        var scope = angular.element(document.querySelector('#ng_territory')).scope();
        scope.$apply(function() {

            // update date
            scope.dataset_info.Date = new Date();

            // update access
            scope.dataset_info.Access = 'public';

            // update the dataset_info on server
            $.evoAppServices.datasetInfoes.putDatasetInfo(scope.dataset_id, scope.dataset_info)
                .success(function (response) {
                    console.log('PUT dataset_info SUCCESS');
                    //console.log(response) <-- server doesn't send any response;

                    // disable PUBLISH button
                    $('#publish').prop('disabled', true);
                    $('#publish').unbind('mouseup');

                    // disable REMOVE button
                    $('#remove').prop('disabled', true);
                    $('#remove').unbind('mouseup');

                }).error(function (response, status, headers, config) {
                    console.log('PUT dataset_info FAIL');
                    console.log(response);
                });
        });

        return false;  // prevent default action
    })
}

function ButtonDownloadDataset(myDataFull, myDataName) {

    // enable the button
    $('#download').prop('disabled', false);

    // reset just in case
    $('#download').unbind('mouseup');

    $('#download').mouseup(function (e) {
        console.log('DOWNLOAD BUTTON!');
        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        // Convert back to CSV
        var csv = Papa.unparse(myDataFull, {
            quotes: false,
            delimiter: ";",
            newline: "\r\n"
        });

        var blob = new Blob([csv]);
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob, {type: 'text/plain'});
        a.download = myDataName+'.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        /*var csvData = new Blob([str], {type: 'text/csv;charset=utf-8;'});
        var csvURL =  null;
        if (navigator.msSaveBlob) {
            csvURL = navigator.msSaveBlob(csvData, 'download.csv');
        } else {
            csvURL = window.URL.createObjectURL(csvData);
        }
        var tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', 'download.csv');
        tempLink.click();*/
    });
}

function ButtonRemoveDataset(myDatasetId) {

    // enable the button
    $('#remove').prop('disabled', false);

    // reset just in case
    $('#remove').unbind('mouseup');

    $('#remove').mouseup(function (e) {
        console.log('REMOVE BUTTON!');

        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        // connect to angular's scope
        var scope = angular.element(document.querySelector('#ng_territory')).scope();
        scope.$apply(function() {

            $.evoAppServices.datasetInfoes.deleteDatasetInfo(myDatasetId)
                .success(function (response) {
                    console.log('AJAX SUCCESS! response:');
                    console.log(response);
                    //scope.dataset_info = response;

                    // go to the parent page - FIX THIS!!!
                    window.location.href = window.location.pathname+'#/';

                }).error(function (data, status, headers, config) {
                    console.log('AJAX FAIL');
                });
        });
        return false;                                            // Return false, prevent default action
    })
}

