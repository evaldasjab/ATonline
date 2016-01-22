/**
 * Takes care of all buttons & controls
 */

// activates expand button-controls
function ButtonsExpand() {

    //console.log('ACTIVATE EXPAND');

    // reset previous expand event everywhere FIX THIS!!!
    $('.button_expand').unbind('mouseup');

    // hide icon UP by default
    $('.button_expand .up').hide();

    //console.log('ACTIVATE EXPANSION!');

    $('.button_expand').mouseup(function (e) {

        // if the widget content is hidden, expand
        if ( $(this).closest('.widget').find('.widget_content').is(':hidden') ) {
            //console.log('EXPAND!');

            //$(this).closest('.widget').find('.widget_content').animate({height:'show',width:'show'});
            $(this).closest('.widget').find('.widget_content').animate({height:'show'});

            // change the icons - individual and 'expand all'
            $(this).find('.up').show(300);
            $(this).find('.down').hide();
            $(this).closest('.page_area').find('.button_expand_all .up').show(300);
            $(this).closest('.page_area').find('.button_expand_all .down').hide();

        // if the widget content is shown, collapse
        } else {
            //console.log('COLLAPSE!');

            $(this).closest('.widget').find('.widget_content').animate({height:'hide'});

            // change the icons - individual and 'expand all'
            $(this).find('.up').hide();
            $(this).find('.down').show(300);
            $(this).closest('.page_area').find('.button_expand_all .up').hide();
            $(this).closest('.page_area').find('.button_expand_all .down').show(300);
        }
    });

    // hide the content by default
    $('.page_area').find('.widget_content').hide();  // DISABLE FOR TESTING!!!

}

function ButtonExpandAll(myAreaId) {

    //console.log('ACTIVATE EXPAND ALL!');

    // remove event if already was activated
    $('#'+myAreaId+' .button_expand_all').unbind('mouseup');

    // remove class 'disabled'
    //$('#'+myAreaId+' .button_expand_all').attr('class', 'buttons_controls button_expand_all');

    // hide icon UP by default
    $('#'+myAreaId+' .button_expand_all .up').hide();
    $('#'+myAreaId+' .button_expand_all .udown').show();

    $('#'+myAreaId+' .button_expand_all').mouseup(function (e) {

        // if there is no cue with expanded stats, expand all
        if ($(this).parent('.page_area').find('.widget_content:visible').length == 0) {

            //$(this).parent('.page_area').find('.widget_content').animate({height:'show',width:'show'});
            $(this).parent('.page_area').find('.widget_content').slideDown();

            // change the icons - individual and 'expand all'
            $(this).parent('.page_area').find('.button_expand .up').show(300);
            $(this).parent('.page_area').find('.button_expand .down').hide();
            $(this).find('.up').show(300);
            $(this).find('.down').hide();

            // if there is at least one expanded, collapse all
        } else {
            //$(this).parent('.page_area').find('.widget_content').animate({height:'hide',width:'hide'});
            $(this).parent('.page_area').find('.widget_content').slideUp();

            // change the icons - individual and 'expand all'
            $(this).parent('.page_area').find('.button_expand .up').hide();
            $(this).parent('.page_area').find('.button_expand .down').show(300);
            $(this).find('.up').hide();
            $(this).find('.down').show(300);

        }
    });
}

// activates shuffle button-controls
function ButtonsShuffle(myHeuristicName) {

    //console.log('ACTIVATE SHUFFLE, heuristic '+ myHeuristicName);

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
            break;
    }

    $('.button_shuffle').mouseup(function (e) {

        // change branch values in scope
        var scope = angular.element(document.querySelector('#ng_territory')).scope();
        scope.$apply(function () {

            // reorder tree cues randomly
            scope.drag_tree = ShuffleArray(scope.drag_tree);

            // manually trigger sortable
            //angular.element('ui-sortable').sortable('stop');

            // rebuild arrows and exits
            UpdateArrowsAndExits(myHeuristicName, scope.drag_tree);
        });
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

        // change branch values in scope
        var scope = angular.element(document.querySelector('#ng_territory')).scope();
        scope.$apply(function () {

            // get object from scope
            var myFind = $.grep(scope.drag_tree, function (e) {return e.CueName == myCueId;});
            var myCueObj = myFind[0];
            var myIndex = scope.drag_tree.indexOf(myCueObj);

            // swap branch values
            //b = [a, a = b][0];
            var myTemp = myCueObj.BranchNo;
            myCueObj.BranchNo = myCueObj.BranchYes;
            myCueObj.BranchYes = myTemp;

            // update object in scope
            scope.drag_tree[myIndex] = myCueObj;

            // update statistics
            var myAnalysis = AnalyzeDataset(scope.heuristic_name, scope.dataset_binary, scope.drag_criterion[0].CueName, scope.drag_tree, scope.validities);
            //console.log(myAnalysis);
            scope.general_stats = myAnalysis.general_stats;
            scope.drag_tree = myAnalysis.cues_stats;
        });

        //var myExitClass = $(this).closest('.exit_widget').attr('id');
        console.log('EXIT BUTTON! myCueId: '+myCueId+' myExitClass: '+myExitClass);

        // create EXIT node on another side
        SwitchExitDirection(myCueId, myExitClass);

        // get heuristic structure for scope
        var myHeurStr = GetHeuristicStructure();

        return false;                                            // Return false, prevent default action
    })
}

function SplitValueSliderChangeSwap(myCuesList) {

    myCuesList.forEach(function(mySplitObj) {

        var myCueId = mySplitObj.CueName;

        $('#'+myCueId+' .split_slider').slider({
            min: mySplitObj.MinValue,
            max: mySplitObj.MaxValue,
            value: mySplitObj.SplitValue,
            step: 0.5,
            slide: function(event, ui) {
                $(this).closest('.widget').find('#split_value').val(ui.value);
                //$( "input" ).val( "$" + ui.value );
                //$('li[id^='+myTrueCueId+']').find('.split_slider').slider('refresh');
            },
            change: function( event, ui ) {

                // change binary values of this cue/field in the dataset
                mySplitObj.SplitValue = ui.value;

                // in scope, update cue mapping, binary dataset, cues_list, treecues and general analysis
                UpdateScopeModels();

            }
        });

        $('li[id^='+myCueId+'] #split_value').change(function () {
            //var value = this.value.substring(1);
            var myValue = $(this).val();
            $('li[id^='+myCueId+'] .split_slider').slider("value", parseFloat(myValue));
        });

        // reset previous swap button event
        $('#'+myCueId+' .button_swap').unbind('mouseup');

        // activate yes-no swap button (changes isFlipped value)
        $('#'+myCueId+' .button_swap').mouseup(function () {

            // change the direction in the mySplitValuesArray
            mySplitObj.IsFlipped = !mySplitObj.IsFlipped;  // if true then false, if false then true

            // in scope, update cue mapping, binary dataset, cues_list, treecues and general analysis
            UpdateScopeModels();

        });
        $.fn.toggleText = function(t1, t2){
            if (this.text() == t1) this.text(t2);
            else                   this.text(t1);
            return this;
        };
    });
}
function UpdateScopeModels() {

    var scope = angular.element(document.querySelector('#ng_territory')).scope();

    if(!scope.$$phase) {     // bug workaround FIX THIS!!!
        scope.$apply(function () {

            // merge drag lists for cue mapping update
            var myDragListsArray = $.merge([], scope.drag_cues_list);  // make copy of cues list array
            $.merge(myDragListsArray, scope.drag_tree);  // add tree array
            $.merge(myDragListsArray, scope.drag_criterion);  // add criterion array

            // update cue mapping
            scope.heuristic_info.CueMapping = UpdateCueMapping(scope.heuristic_info.CueMapping, myDragListsArray);

            // update the dataset
            scope.dataset_binary = ConvertToBinary(scope.dataset_original, scope.heuristic_info.CueMapping);
            scope.dataset_sorted = scope.dataset_binary;

            // if criterion is already selected
            if (scope.drag_criterion.length > 0) {

                // bug workaround FIX THIS!!!
                if (scope.heuristic_name != 'Fast-and-Frugal Tree') {
                    // get binary dataset except criterion
                    scope.dataset_binary_exceptcriterion = ConvertToBinaryExceptCriterion(scope.dataset_original, scope.heuristic_info.CueMapping, scope.drag_criterion[0].CueName);
                    // sort by criterion
                    scope.dataset_sorted = SortByCriterion(scope.dataset_binary_exceptcriterion, scope.drag_criterion[0].CueName);
                }

                // analyse every cue in cues_list as one-cue-tree
                scope.drag_cues_list.forEach(function (myCueObj, myIndex) {
                    var myAnalysis = AnalyzeDataset(scope.heuristic_name, scope.dataset_sorted, scope.drag_criterion[0].CueName, [myCueObj], scope.validities);
                    scope.drag_cues_list[myIndex] = myAnalysis.cues_stats[0];
                });

                // update statistics
                var myAnalysis = AnalyzeDataset(scope.heuristic_name, scope.dataset_sorted, scope.drag_criterion[0].CueName, scope.drag_tree, scope.validities);
                //console.log(myAnalysis);
                scope.general_stats = myAnalysis.general_stats;
                scope.drag_tree = myAnalysis.cues_stats;
                scope.dataset_stepinfo = myAnalysis.dataset_stepinfo;
                scope.dataset_stepinfo_colheads = Object.keys(scope.dataset_stepinfo[0]);

            // if criterion is not selected
            } else {

                // analyse every cue in cues_list as one-cue-tree with itself as a criterion
                scope.drag_cues_list.forEach(function(myCueObj, myIndex) {
                    var myAnalysis = AnalyzeDataset('Fast-and-Frugal Tree', scope.dataset_sorted, myCueObj.CueName, [myCueObj], scope.validities);
                    scope.drag_cues_list[myIndex] = myAnalysis.cues_stats[0];
                });
            }

        });
    }
}

function ButtonsStatistics(myCuesList) {

    myCuesList.forEach(function(myCueObj) {

        var myCueId = myCueObj.CueName;

        // reset previous button event
        $('#' + myCueId + ' .button_stat').unbind('mouseup');

        // hide the statistics of the tree
        $('#' + myCueId).find('.conting_tree').hide();
        $('#' + myCueId).find('.stat_tree').hide();

        // on mouse click, toggle between cue and tree statistics
        $('#' + myCueId + ' .button_stat').mouseup(function () {

        // hide cue stats and show tree stats, sliding left
        $(this).closest('.widget_content').find('.conting_cue').slideToggle();
        $(this).closest('.widget_content').find('.conting_tree').slideToggle();

        // hide cue stats and show tree stats, sliding up
        $(this).closest('.widget_content').find('.stat_cue').slideToggle();
        $(this).closest('.widget_content').find('.stat_tree').slideToggle();

            //$(this).closest('.widget_content').find('.stat_cue').animate({width: 'toggle'});
            //$(this).closest('.widget_content').find('.stat_tree').animate({width: 'toggle'}, 600);
        });
    });
}

function ButtonDatasetStepInfo() {

    // hide by default
    //.hide();
    //$('#dataset_container').delay(800).slideUp();  //.fadeIn(400)  DISABLE WHEN TESTING!

    $('#button_stepinfo').mouseup(function (e) {
        console.log('STEPINFO BUTTON!');

        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        $('#dataset_container').slideToggle();

        // hide general statistics column
        //$('#stats_column').animate({width:'toggle'});

        return false;                                            // Return false, prevent default action
    })
}


function ButtonSaveHeuristic() {

    // reset just in case
    $('#save').unbind('mouseup');

    $('#save').mouseup(function (e) {
        console.log('SAVE BUTTON!');

        //e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        // connect to angular's scope
        var scope = angular.element(document.querySelector('#ng_territory')).scope();
        scope.$apply(function() {

            // check if this heuristic already was saved on server before
            var myHeuristicId = scope.heuristic_id;

            console.log('myHeuristicId:');
            console.log(myHeuristicId);

            // update the date
            scope.heuristic_info.Date = new Date();

            //var myCritArray = [];
            //var myTreeArray = [];
            //var myCuesListArray = [];
            var myHeuristicStructure = [];
            var myCueMapping = [];

            // add cue attributes to objects
            scope.drag_criterion.forEach(function(myCueObj, myIndex) {
                var myHeurStrObj = {}
                if (myCueObj.EntryId) {myHeurStrObj.EntryId = myCueObj.EntryId};
                if (myCueObj.HeuristicId) {myHeurStrObj.HeuristicId = myCueObj.HeuristicId};
                myHeurStrObj.CueName = myCueObj.CueName;
                myHeurStrObj.CueType = 'criterion';
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
            scope.drag_tree.forEach(function(myCueObj, myIndex) {
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
            });

            /*console.log(myCueMapping);
            console.log(scope.heuristic_info.CueMapping);
            debugger;*/

            // merge the lists for heuristic structure
            //var myHeuristicStructure = $.merge([], myCritArray);  // make copy of criterion array
            //$.merge( myHeuristicStructure, myTreeArray);  // add tree array
            //$.merge( myHeuristicStructure, myCuesListArray);  // add cues list array

            // save to scope, just in case
            scope.heuristic_info.HeuristicStructure = myHeuristicStructure;
            //scope.heuristic_info.CueMapping = myCueMapping;

            // get heuristic info from scope
            var myHeuristicInfo = scope.heuristic_info;
            //var myHeuristicStructure = scope.heuristic_info.HeuristicStructure;

            console.log('myHeuristicInfo for PUT or POST');
            //console.log(JSON.stringify(myHeuristicInfo, null, "  "));

            //console.log('scope:');
            //console.log(scope);

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
                        document.location.href = '/ato/index.html#/heur/'+scope.heuristic_id; // FIX THIS!!!

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
            }
        });

        //return false;                                            // Return false, prevent default action
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
            var myHeuristicInfo = $.extend(true, [], scope.heuristic_info);  // make DEEP copy
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
        document.location.href = '/ato/index.html#/heur/'+myHeurId+'/choose_data';

        // connect to angular's scope
        /*var scope = angular.element(document.querySelector('#ng_territory')).scope();
        scope.$apply(function() {

            // go to page heuristics/heuristic_id/choose_data
            document.location.href = '/ato/index.html#/heur/'+scope.heuristic_id+'/choose_data';
        });*/

        return false;                                            // Return false, prevent default action
    })
}

function ButtonRemoveHeuristic(myHeuristicId) {

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
                    window.location.href = window.location.pathname+'#/';

                }).error(function (data, status, headers, config) {
                    console.log('AJAX FAIL');
                });
        });
            return false;                                            // Return false, prevent default action
    })
}

function ButtonSaveDataset() {

    $('#save').mouseup(function (e) {
        console.log('SAVE BUTTON!');

        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        // connect to angular's scope
        var scope = angular.element(document.querySelector('#ng_territory')).scope();
        scope.$apply(function() {

            console.log('scope:');
            console.log(scope);

            // update the date
            scope.dataset_info.Date = new Date();

            // get dataset info from scope
            var myObj = scope.dataset_info;
            var myDataInfo = scope.dataset_info;
            var myDataFull = scope.dataset_info.DatasetFull;

            delete myDataInfo.CueMapping;
            //delete myDataInfo.DatasetFull;

            // check if this dataset already was saved on server before
            var myDatasetId = scope.dataset_id;

            console.log('myDatasetId:');
            console.log(myDatasetId);

            // POST (add) if there is no dataset_id
            if (!myDatasetId) {

                console.log('Posting to server, PLEASE WAIT...');

                $.evoAppServices.datasetInfoes.postDatasetInfo(myDataInfo)
                    .success(function (response) {
                        console.log('POST dataset info SUCCESS! response:');
                        console.log(response);
                        scope.dataset_id = response.DatasetId;
                        //scope.dataset_info = response;

                        // go to page datasets/dataset_id
                        document.location.href = '/ato/index.html#/data/'+scope.dataset_id; // FIX THIS!!!

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
                    window.location.href = window.location.pathname+'#/';

                }).error(function (data, status, headers, config) {
                    console.log('AJAX FAIL');
                });
        });
        return false;                                            // Return false, prevent default action
    })
}

