/**
 * Takes care of all buttons & controls
 */

// activates expand button-controls
function ButtonsExpand() {

    // hide icon UP by default
    $('.button_expand .up').hide();

    //console.log('ACTIVATE EXPANSION!');

    $('.button_expand').mouseup(function (e) {

        // if the widget content is hidden, expand
        if ( $(this).closest('.widget').find('.widget_content').is(':hidden') ) {
            //console.log('EXPAND!');

            $(this).closest('.widget').find('.widget_content').animate({height:'show',width:'show'});

            // change the icons - individual and 'expand all'
            $(this).find('.up').show(300);
            $(this).find('.down').hide();
            //$(this).closest('.page_area').find('.button_expand_all .up').show(300);
            //$(this).closest('.page_area').find('.button_expand_all .down').hide();

        // if the widget content is shown, collapse
        } else {
            //console.log('COLLAPSE!');

            $(this).closest('.widget').find('.widget_content').animate({height:'hide',width:'hide'});

            // change the icons - individual and 'expand all'
            $(this).find('.up').hide();
            $(this).find('.down').show(300);
            $(this).closest('.page_area').find('.button_expand_all .up').hide();
            $(this).closest('.page_area').find('.button_expand_all .down').show(300);
        }
    });

    // hide the content by default
    $('#cues_list').find('.widget_content').hide();  // DISABLE FOR TESTING!!!

    //$('.horiz_scroll, .trees').on('click', '.button_expand', function (e) {
    //    $(this).parents('.widget').find('.widget_content').slideToggle('slow');
    //});
}

// activates shuffle button-controls
function ButtonsShuffle(myHeuristicName) {

    console.log('ACTIVATE SHUFFLE, heuristic '+ myHeuristicName);

    // show icon UP by default
    $('.button_shuffle').hide(); // already in the html, FIX THIS!!!
    //$('#tree').find('.button_shuffle').show();

    // depending on the heuristic, show the button
    switch (myHeuristicName) {
        case 'Fast-and-Frugal Tree':
        case 'Take The Best':
            $('.button_shuffle').hide();
            break;
        case 'Minimalist':
        case 'Tallying':
        case 'Weighted Tallying':
            // show the shuffle buttons
            $('#tree').find('.button_shuffle').show();
            console.log('SHOW SHUFFLE');
            debugger;
            break;
    }

    $('.button_shuffle').mouseup(function (e) {

        // get the list of cues
        var myTreeArray = GetElementsArray('widget','tree');

        // reorder randomly
        myTreeArray = ShuffleArray(myTreeArray);

        // rebuild the tree
        MoveAllCuesToArea(myTreeArray, 'tree');

        UpdateArrowsAndExits(myHeuristicName, 'tree');
    });
}
function ShuffleArray(myArray) {

    for(var j, x, i = myArray.length; i; j = Math.floor(Math.random() * i), x = myArray[--i], myArray[i] = myArray[j], myArray[j] = x);
    return myArray;

    /*$.fn.randomize = function(childElem) {
        function shuffle(o) {
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        };
        return this.each(function() {
            var $this = $(this);
            var elems = $this.children(childElem);

            shuffle(elems);

            $this.detach(childElem);

            for(var i=0; i < elems.length; i++) {
                $this.append(elems[i]);
            }
        });
    }*/
}

function ButtonSwitchExit(myCueId, myExitClass) {

    $('#'+myCueId+' .'+myExitClass+' .button_switch').mouseup(function (e) {

        console.log('SWITCH!');

        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        //var myExitClass = $(this).closest('.exit_widget').attr('id');
        console.log('EXIT BUTTON! myCueId: '+myCueId+' myExitClass: '+myExitClass);

        // create EXIT node on another side
        SwitchExitDirection(myCueId, myExitClass);

        // get heuristic structure for scope
        var myHeurStr = GetHeuristicStructure();

        // update scope to make ready for save
        UpdateScope('heuristic_info.HeuristicStructure', myHeurStr);

        return false;                                            // Return false, prevent default action
    })
}

function ButtonSaveHeuristic() {

    $('#save').mouseup(function (e) {
        console.log('SAVE BUTTON!');

        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        // connect to angular's scope
        var scope = angular.element(document.querySelector('#ng_territory')).scope();
        scope.$apply(function() {

            // update the date
            scope.heuristic_info.Date = new Date();

            // get heuristic info from scope
            var myHeuristicInfo = scope.heuristic_info;
            var myHeuristicStructure = scope.heuristic_info.HeuristicStructure;

            console.log('myHeuristicInfo for PUT or POST:');
            console.log(myHeuristicInfo);

            console.log('scope:');
            console.log(scope);

            // check if this heuristic already was saved on server before
            var myHeuristicId = scope.heuristic_id;

            console.log('myHeuristicId:');
            console.log(myHeuristicId);

            // POST if there is no heuristic_id (send to SQL server if doesn't exist) using AJAX
            if (!myHeuristicId) {

                $.evoAppServices.heuristicInfoes.postHeuristicInfo(myHeuristicInfo)
                    .success(function (response) {
                        console.log('AJAX SUCCESS! response:');
                        console.log(response);
                        scope.heuristic_id = response.HeuristicId;
                        //scope.heuristic_info.HeuristicId = response.HeuristicId;
                        //scope.heuristic_info = response;

                        // go to page heuristics/heuristic_id
                        document.location.href = '/HTML5Boilerplate/index.html#/heuristics/'+scope.heuristic_id; // FIX THIS!!!

                    }).error(function (data, status, headers, config) {
                        console.log('AJAX FAIL');
                    });

            } else {   // PUT if there is heuristic_id (update in SQL) using AJAX

                console.log('PUT!');
                console.log(myHeuristicStructure);
                debugger;

                /*angular.injector(['ng']).invoke(['$q', function($q) {

                    $q.all([   // angular promise - when this is done, then do the next
                        // get old HeuristicStructure entries
                        $.evoAppServices.heuristicStructures.getHeuristicStructuresByHeuristicId(myHeuristicId)
                            .success(function (response) {
                                console.log('AJAX SUCCESS getHeuristicStructuresByHeuristicId! response:');
                                console.log(response);

                                // delete old entries
                                var myOldHeuristicStructure = response;

                                myOldHeuristicStructure.forEach(function(myEntry, myIndex) {
                                    $.evoAppServices.heuristicStructures.deleteHeuristicStructure(myEntry.EntryId)
                                        .success(function (response) {
                                            console.log('AJAX SUCCESS deleteHeuristicStructure! response:');
                                            //console.log(response);
                                        }).error(function (response, status, headers, config) {
                                            console.log('AJAX FAIL deleteHeuristicStructure');
                                            console.log(response);
                                        });
                                });

                            }).error(function (response, status, headers, config) {
                                console.log('AJAX FAIL getHeuristicStructuresByHeuristicId');
                                console.log(response);
                            })

                    ]).then(function() {

                        // post new HeuristicStructure entries
                        myHeuristicStructure.forEach(function(myEntry, myIndex) {
                            console.log(myIndex);
                            console.log(myEntry);
                            $.evoAppServices.heuristicStructures.postHeuristicStructure(myEntry)
                                .success(function (response) {
                                    console.log('AJAX SUCCESS postHeuristicStructure! response:');
                                    //console.log(response);
                                }).error(function (response, status, headers, config) {
                                    console.log('AJAX FAIL postHeuristicStructure');
                                    console.log(response);
                                });
                        });
                    });

                }]);*/



                //delete myHeuristicInfo[CueMapping];
                //delete myHeuristicInfo[HeuristicStructure];

                $.evoAppServices.heuristicInfoes.putHeuristicInfo(myHeuristicId, myHeuristicInfo)
                    .success(function (response) {
                        console.log('AJAX SUCCESS putHeuristicInfo! response:');
                        //console.log(response);
                    }).error(function (response, status, headers, config) {
                        console.log('AJAX FAIL putHeuristicInfo');
                        console.log(response);

                    });


                // update HeuristicStructure entries separately one by one, doesn't update with heuristic_info...
                var myHeurStructArray = myHeuristicInfo.HeuristicStructure;
                myHeurStructArray.forEach(function(myEntry, myIndex) {
                    $.evoAppServices.heuristicStructures.putHeuristicStructure(myEntry.EntryId, myEntry)
                        .success(function (response) {
                            console.log('ADDITIONAL AJAX SUCCESS! response:');
                            //console.log(response);
                        }).error(function (response, status, headers, config) {
                            console.log('AJAX FAIL');
                            console.log(response);

                        });
                });
            }
        });

        return false;                                            // Return false, prevent default action
    })
}

function ButtonPublishHeuristic() {

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
            var myHeuristicInfo = scope.heuristic_info;
            delete myHeuristicInfo.CueMapping;
            delete myHeuristicInfo.HeuristicStructure;

            // update the heuristic_info on server
            $.evoAppServices.heuristicInfoes.putHeuristicInfo(scope.heuristic_id, myHeuristicInfo)
                .success(function (response) {
                    console.log('AJAX SUCCESS putHeuristicInfo!');
                    //console.log(response) <-- server doesn't send any response;
                }).error(function (response, status, headers, config) {
                    console.log('AJAX FAIL putHeuristicInfo');
                    console.log(response);
                });
        });

        return false;                                            // Return false, prevent default action
    })
}

function ButtonChooseDataset(myHeurId) {

    $('#choose_dataset').mouseup(function (e) {
        console.log('PUBLISH BUTTON!');

        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        // go to page heuristics/heuristic_id/choose_data
        document.location.href = '/HTML5Boilerplate/index.html#/heuristics/'+myHeurId+'/choose_data';

        // connect to angular's scope
        /*var scope = angular.element(document.querySelector('#ng_territory')).scope();
        scope.$apply(function() {

            // go to page heuristics/heuristic_id/choose_data
            document.location.href = '/HTML5Boilerplate/index.html#/heuristics/'+scope.heuristic_id+'/choose_data';
        });*/

        return false;                                            // Return false, prevent default action
    })
}

function ButtonRemove(myHeuristicId) {

    $('#remove').mouseup(function (e) {
        console.log('REMOVE BUTTON!');

        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        // connect to angular's scope
        var scope = angular.element(document.querySelector('#ng_territory')).scope();
        scope.$apply(function() {

            $.evoAppServices.heuristicInfoes.deleteHeuristicInfo(myHeuristicId)
                .success(function (response) {
                    console.log('AJAX SUCCESS! response:');
                    console.log(response);
                    //scope.heuristic_info = response;

                    // go to the parent page - FIX THIS!!!
                    window.location.href = window.location.pathname+'#/heuristics';

                }).error(function (data, status, headers, config) {
                    console.log('AJAX FAIL');
                });
        });
            return false;                                            // Return false, prevent default action
    })
}

function ButtonClone() {

    $('#clone').mouseup(function (e) {
        console.log('CLONE BUTTON!');

        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        var printWindow = window.open(''),
            html = $('html').clone(true, true);

        printWindow.document.write("<!DOCTYPE html><html><head></head><body></body></html>");

        $(printWindow.document).find('html').replaceWith(html);

        return false;                                            // Return false, prevent default action
    })
}

/*function ButtonUpload(){

    $('#button_upload_csv_file').mouseup(function (e) {
        // get the file
        document.getElementById('csv-file').click();
    });

    $("#csv-file").change(HandleFileSelect);

}
function HandleFileSelect(evt) {

    // activate select data buttons
    //buttonsAllcasesTrainingTesting();

    var myFile = evt.target.files[0];

    Papa.parse(myFile, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            console.log('UPLOADED CSV FILE:');
            console.log(results);

            // go to page dataset_show
            document.location.href = '/HTML5Boilerplate/index.html#/new_dataset'; // FIX THIS!!!

            // put the dataset to scope
            UpdateScope('dataset_full', results.data);

            // connect to angular's scope
            //var scope = angular.element(document.querySelector('#ng_territory')).scope();
            //scope.$apply(function (sharedProperties) {
            //    sharedProperties.setShared(results.data);
            //});
        }
    });
    // mark the button as selected
    //$('#button_upload_csv_file').toggleClass('button_on', true);
    //$('#button_load_csv_sample').toggleClass('button_on', false);
}*/

function ButtonSaveDataset() {

    $('#save').mouseup(function (e) {
        console.log('SAVE BUTTON!');

        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        // connect to angular's scope
        var scope = angular.element(document.querySelector('#ng_territory')).scope();
        scope.$apply(function() {

            // update the date
            scope.dataset_info.Date = new Date();

            // get dataset info from scope
            var myObj = scope.dataset_info;

            console.log('myObj for PUT or POST:');
            console.log(myObj);

            console.log('scope:');
            console.log(scope);

            // check if this dataset already was saved on server before
            var myDatasetId = scope.dataset_id;

            console.log('myDatasetId:');
            console.log(myDatasetId);

            // POST if there is no heuristic_id (send to SQL if doesn't exist) using AJAX
            if (!myDatasetId) {

                console.log('Posting to server, PLEASE WAIT...');
                debugger;

                $.evoAppServices.datasetInfoes.postDatasetInfo(myObj)
                    .success(function (response) {
                        console.log('AJAX SUCCESS! response:');
                        console.log(response);
                        scope.dataset_id = response.DatasetId;
                        scope.dataset_info = response;

                        debugger;

                        // go to page datasets/dataset_id
                        document.location.href = '/HTML5Boilerplate/index.html#/datasets/'+scope.dataset_id; // FIX THIS!!!

                    }).error(function (data, status, headers, config) {
                        console.log('AJAX FAIL');
                    });

            } else {   // PUT if there is dataset_id (update in SQL) using AJAX

                console.log(myDatasetId);
                console.log('Updating to server, PLEASE WAIT...');
                debugger;

                $.evoAppServices.datasetInfoes.putDatasetInfo(myDatasetId, myObj)
                    .success(function (response) {
                        console.log('AJAX SUCCESS! response:');
                        //console.log(response);
                    }).error(function (response, status, headers, config) {
                        console.log('AJAX FAIL');
                        console.log(response);

                    });

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




            }
        });

        return false;                                            // Return false, prevent default action
    })
}

function ButtonRemoveDataset(myDatasetId) {

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
                    window.location.href = window.location.pathname+'#/datasets';

                }).error(function (data, status, headers, config) {
                    console.log('AJAX FAIL');
                });
        });
        return false;                                            // Return false, prevent default action
    })
}
