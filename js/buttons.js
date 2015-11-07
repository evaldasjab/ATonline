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
function ButtonsShuffle(myHeuristic) {

    // hide icon UP by default
    $('.button_shuffle').hide();

    //console.log('ACTIVATE EXPANSION!');

    $('.button_shuffle').mouseup(function (e) {

        // get the list of cues
        var myTreeArray = GetWidgetsArray('tree');

        // reorder randomly
        myTreeArray = ShuffleArray(myTreeArray);

        // rebuild the tree
        MoveAllCuesToArea(myTreeArray, 'tree');

        switch (myHeuristic) {
            case 'Minimalist':
                // redraw the arrows and nodes
                ArrowsAndExitsTTB('tree');
                break;
            case 'Weighted Tallying':
                ArrowsAndExitsWT('tree');
                break;
        }
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

function ButtonSwitchExit(myCueId) {

    $('#'+myCueId+' .exit_widget .button_switch').mouseup(function (e) {
        console.log('EXIT BUTTON! myCueId: '+myCueId);

        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        // create EXIT node on another side
        SwitchExitDirection(myCueId);

        //updateJsonDataset(myTreeId); // update the changed exit direction

        return false;                                            // Return false, prevent default action
    })
}

function ButtonSave(myHeuristic) {

    $('#save').mouseup(function (e) {
        console.log('SAVE BUTTON!');

        e.stopPropagation();   // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)

        // take the screenshot
        /*html2canvas($("#tree"), {
            onrendered: function (canvas) {
                theCanvas = canvas;


                canvas.toBlob(function (blob) {
                    saveAs(blob, "Tree.png");
                    debugger;
                });
            }
        });*/

        // get the treecues_info from scope
        var scope = angular.element(document.querySelector('#ng_territory')).scope();
        scope.$apply(function() {
            var myTreeCuesInfoArray = scope['treecues_info'];
            var myHeurInfoObj = scope['heuristic_info'];
            myHeurInfoObj.Date = new Date();

            var myObj = {};
            myObj.DecisionAlgorithm = myHeuristic;
            myObj.Image = 'img_TTB_512.jpg';
            myObj.Title = myHeurInfoObj.Title;
            myObj.Date = myHeurInfoObj.Date;
            myObj.UserId = 4;  // FIX THIS!!!
            myObj.SizeCues = myTreeCuesInfoArray.length - 1;  // minus criterion
            myObj.Description = myHeurInfoObj.Description;

            var myCueMapArray = [];
            var myHeurStructArray = [];

            myTreeCuesInfoArray.forEach(function (myCueObj, myIndex) {

                var myMapObj = {};
                myMapObj.DatasetId = scope['dataset_id'];
                myMapObj.DatasetCueName = myCueObj.CueName;    // FIX THIS!!!
                myMapObj.HeuristicCueName = myCueObj.CueName;  // FIX THIS!!!
                myMapObj.SplitValue = myCueObj.SplitValue;
                myMapObj.IsFlipped = myCueObj.IsFlipped;

                myCueMapArray.push(myMapObj);

                var myStructObj = {};
                myStructObj.CueName = myCueObj.CueName;
                myStructObj.CueType = myCueObj.CueType;
                myStructObj.BranchYes = myCueObj.BranchYes;
                myStructObj.BranchNo = myCueObj.BranchNo;

                myHeurStructArray.push(myStructObj);
            });

            myObj.CueMapping = myCueMapArray;
            myObj.HeuristicStructure = myHeurStructArray;

            console.log(myObj);
            debugger;

            var myReturn = $.evoAppServices.heuristicInfoes.postHeuristicInfo(myObj);
            console.log(myReturn);
        });








        return false;                                            // Return false, prevent default action
    })
}
