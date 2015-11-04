/**
 * Takes care of the arrows and exits of the tree
 */

/*****************************
 UNIVERSAL - for all ffts and heuristics
 *****************************/

function UpdateArrowsAndExits(myHeuristic, myListId) {

    // if it's criterion_place or cues_list
    if (myListId != 'tree') {
        // remove all exits and arrows
        $('#'+myListId).find('.arrows_exits').empty();

    } else {  // if the list is a tree

        // get the array of cues in the tree, "sortable" may be disabled ($('#tree').sortable('toArray') doesn't work)
        var myTreeArray = GetElementsArray(myListId, 'widget');

        // get the last cue
        var myLastCueId = $(myTreeArray).get(-1);

        myTreeArray.forEach(function (myCueId) {

            // do for all cues, depending on the heuristic
            switch (myHeuristic) {

                case 'Fast And Frugal Tree':

                    // add EXIT node to right
                    AddExitNode(myCueId, 'exit_right', 'yes', 'decide'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                    // activate the EXIT switch button
                    ButtonSwitchExit(myCueId);  // activate the switch button

                    // draw ARROW to next cue
                    DrawArrowToNextCue(myCueId, 'no');

                    break;

                case 'Take The Best':
                case "Minimalist":

                    // add EXIT node to right
                    AddExitNode(myCueId, 'exit_right', 'different', 'decide'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                    // draw ARROW to next cue
                    DrawArrowToNextCue(myCueId, 'equal');

                    break;

                case "Tallying":
                case "Weighted Tallying":

                    // draw ARROW to next cue
                    DrawArrowToNextCue(myCueId, '');

                    break;
            }

            // do only for the LAST cue
            if (myCueId == myLastCueId) {

                switch (myHeuristic) {

                    case 'Fast And Frugal Tree':

                        // add the second EXIT node
                        AddExitNode(myCueId,'second','second','decide'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                        // remove ARROW to next cue
                        RemoveElement(myCueId,'cue_arrow');

                        break;

                    case 'Take The Best':
                    case "Minimalist":

                        // add EXIT node to down
                        AddExitNode(myCueId,'exit_down','equal','guess'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                        break;

                    case "Tallying":
                    case "Weighted Tallying":

                        // add EXIT node to the right
                        AddExitNode(myCueId,'exit_right','different','decide'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                        // add EXIT node to down
                        AddExitNode(myCueId,'exit_down','equal','guess'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                        break;
                }
            }
        });
    }
}
function GetElementsArray(myListId, myElementClass) {
    var myWidgetsArray = new Array();
    $('#'+myListId+' .'+myElementClass).each(function(){
        myWidgetsArray.push($(this).attr('id'));
    });
    return myWidgetsArray;
}
function AddExitNode(myCueId, myExitClass, myExitArrowText, myExitTitle) {

    // get the list of existing EXIT nodes
    var myExitsArray = GetElementsArray(myCueId, 'exit_widget');

    // for the second EXIT node, change class depending on the first node
    if (myExitClass == 'second') {
        switch (myExitsArray[0]) {
            case 'exit_left':
                myExitClass = 'exit_right';
                myExitArrowText = 'yes';
                break;
            case 'exit_right':
                myExitClass = 'exit_left';
                myExitArrowText = 'no';
                break;
        }
        // remember that the second node is needed
        var needSecondNode = true;
    }

    // prepare the html code for the EXIT arrow
    switch(myExitClass) {

        case 'exit_left':
            var myArrowHtml =   '<line x1="0" y1="45" x2="45" y2="0"/>'+
                                '<line x1="1" y1="25" x2="1" y2="44"/>'+
                                '<line x1="1" y1="44" x2="20" y2="44"/>'+
                                '<text text-anchor="middle" x="22" y="25"'+
                                'font-size="10px" stroke-width="1" stroke="none"'+
                                'fill="black">'+ myExitArrowText +'</text>';
            break;

        case 'exit_right':
            var myArrowHtml =   '<line x1="0" y1="0" x2="45" y2="45"/>'+
                                '<line x1="44" y1="25" x2="44" y2="44"/>'+
                                '<line x1="25" y1="44" x2="44" y2="44"/>'+
                                '<text text-anchor="middle" x="22" y="25"'+
                                'font-size="10px" stroke-width="1" stroke="none"'+
                                'fill="black">'+ myExitArrowText +'</text>';
            break;

        case 'exit_down':
            var myArrowHtml = '';
            // exit_down i always a second EXIT node
            var needSecondNode = true;
            break;
    }

    var myExitNode =  '<li id="'+myExitClass+'" class="'+myExitClass+' exit_widget unsortable"> \
                        <div class="exit_widget_title"> \
                            <span>'+myExitTitle+'</span> \
                        </div> \
                        <svg class="exit_arrow" height="45" width="45"> \
                          '+myArrowHtml+' \
                        </svg> \
                    </li>';

    // depending on how many EXITs are already
    switch(myExitsArray.length) {

        case 0:
            // create the EXIT node with fade in
            $(myExitNode).hide().appendTo('#'+myCueId+' .arrows_exits').fadeIn(300);
            break;

        case 1:
            if (needSecondNode == true) {
                // create the EXIT node with fade in
                $(myExitNode).hide().appendTo('#'+myCueId+' .arrows_exits').fadeIn(300);
            } else {
                // the EXIT node already exists, do nothing
            }
            break;

        case 2:
            if (needSecondNode == true) {
                // two nodes exist, do nothing
            } else {
                // remove one exit node
                $('#'+myCueId+' .'+myExitsArray[0]).remove();
            }
            break;
    }
}
function DrawArrowToNextCue (myCueId, myLabelText) {
    //console.log('DRAW ARROW');

    // remove the old arrow if there was
    //$('#'+myCueId+' .cue_arrow').remove();  // CHECK THIS do i need it?

    // set the html code
    var myHtml =  '<svg class="cue_arrow" height="40" width="40"> \
                        <line x1="20" y1="0" x2="20" y2="40"/> \
                        <line x1="5" y1="25" x2="20" y2="40"/> \
                        <line x1="35" y1="25" x2="20" y2="40"/> \
                        <text text-anchor="middle" x="20" y="23" font-size="10px" stroke-width="1" stroke="none" fill="black">'+myLabelText+'</text> \
                    </svg>';

    // draw the SVG arrow
    //$('#'+myCueId).append( myHtml );
    $(myHtml).hide().appendTo('#'+myCueId+' .arrows_exits').fadeIn(300);
}

function SwitchExitDirectionCHECKNEED (myCueId) {

    //console.log('SWITCH EXIT DIRECTION! myCueId: '+myCueId);
    // check if Exit nodes exist
    var myExitLeftTest = $('#'+myCueId).find('.exit_left').length;
    var myExitRightTest = $('#'+myCueId).find('.exit_right').length;

    if ((myExitLeftTest != 0) && (myExitRightTest == 0)) { //if there is left EXIT only (double-check)
        RemoveElement(myCueId, 'exit_left');
        AddExitNode(myCueId, 'exit_right');
        DrawArrowToNextCue(myCueId, 'no');
    } else if ((myExitLeftTest == 0) && (myExitRightTest != 0)) { //if there is right EXIT only (double-check)
        RemoveElement(myCueId, 'exit_right');
        AddExitNode(myCueId, 'exit_left');
        DrawArrowToNextCue(myCueId, 'yes');
    }
}

function UpdateValidityTags(myHeuristic, myListId) {

    // if it's criterion_place or cues_list
    if (myListId != 'tree') {
        // remove all exits and arrows
        $('#'+myListId).find('.widget_tags').empty();

    } else {  // if the list is a tree

        switch (myHeuristic) {
            case 'Take The Best':

                // define the html code
                var myHtml = '<div class="widget_validity">v</div>';
                break;

            case 'Weighted Tallying':

                // define the html code
                var myHtml = '<svg class="widget_multiply" height="20" width="20">'+
                    '<polyline points="4 17, 17 4"/>' +
                    '<polyline points="4 4, 17 17"/>' +
                    '</svg>' +
                    '<div class="widget_validity_weta">v</div>';
                break;
        }

        // get the array of cues in the tree, "sortable" may be disabled ($('#tree').sortable('toArray') doesn't work)
        var myTreeArray = GetElementsArray(myListId, 'widget');

        var v = 1;
        myTreeArray.forEach(function (myCueId) {

            // add the html code
            $(myHtml).hide().appendTo('#'+myCueId+' .widget_tags').fadeIn(300);
            // add the index
            $('#'+myCueId+' .widget_validity').html('v'+ v);
            v++;
        });

    }
}











/* ****************************
 FAST AND FRUGAL TREE
 *****************************/

function UpdateArrowsAndExitsFFT(myListId) {

    if (myListId != 'tree') {
        //console.log('its not tree!');
        RemoveElement(myListId, 'exit_left');
        RemoveElement(myListId, 'exit_right');
        RemoveArrowToNextCue(myListId);
    } else {

        // get the last and ex-last cue
        var myTreeArray = GetWidgetsArray(myListId);

        var myLastCueId = $(myTreeArray).get(-1);                     // get the last cue

        myTreeArray.forEach(function (myCueId) {

            // do for each cue in the tree, except the last cue
            if (myCueId != myLastCueId) {
                // set only one EXIT node and draw ARROW to next cue
                SetExitNodesAndArrows(myCueId, false);  //  SetExitNodesAndArrows(myCueId, isLastCueBool)

                // do for the last cue
            } else {
                // add the second EXIT node
                SetExitNodesAndArrows(myCueId, true);  //  SetExitNodesAndArrows(myCueId, isLastCueBool)
            }
        });
    }
}

function SetExitNodesAndArrowsFFT(myCueId, isLastCueBool) {

    // check if Exit nodes exist
    var myExitLeftTest = $('#'+myCueId).find('.exit_left').length;
    var myExitRightTest = $('#'+myCueId).find('.exit_right').length;

    // check if Arrow to next cue exist
    var myArrowToNextCueTest = $('#'+myCueId).find('.cue_arrow').length;
    //console.log('myArrowToNextCue: '+myArrowToNextCue);


    switch (isLastCueBool) {  // two exits for last cue, one for others
        case false:    // not the last cue
            if ((myExitLeftTest == 0) && (myExitRightTest == 0)) {       // no EXIT nodes
                AddExitNode(myCueId, 'exit_right');        // add right EXIT node
            } else if ((myExitLeftTest != 0) && (myExitRightTest != 0)) { // two EXIT nodes
                RemoveElement(myCueId, 'exit_left');      // remove LEFT exit node
            }
            if (myArrowToNextCueTest == 0) {          // no arrow
                DrawArrowToNextCue(myCueId, 'no')     // DrawArrowToNextCue(myCueId, myLabel)
            }

            break;
        case true:     // last cue
            if (myExitLeftTest == 0) {       // no left EXIT node
                AddExitNode(myCueId, 'exit_left');        // add left EXIT node
            }
            if (myExitRightTest == 0) {       // no left EXIT node
                AddExitNode(myCueId, 'exit_right');        // add right EXIT node
            }
            if (myArrowToNextCueTest != 0) {            // there is arrow to the next cue
                RemoveArrowToNextCue(myCueId)     //   remove
            }
            break;
    }
}
function AddExitNodeFFT(myCueId, myExitClass) {
    //console.log('ADD EXIT NODE! '+myCueId+' '+myExitClass);

    switch(myExitClass) {
        case 'exit_left':
            var myExitText = 'no';
            var myArrowHtml =  '<line x1="0" y1="45" x2="45" y2="0"/> \
                                <line x1="1" y1="25" x2="1" y2="44"/> \
                                <line x1="1" y1="44" x2="20" y2="44"/> \
                                <text x="15" y="25" font-size="10px" stroke-width="1" stroke="none" fill="black">'+myExitText+'</text>';
            var myIconHtml =  '<div title="Switch EXIT Direction"><svg class="button_controls button_switch switch_to_right" height="20" width="20"> \
                                    <polyline class="right" points="7 3,14 10,7 17"/> \
                               </svg></div>';
            break;
        case 'exit_right':
            var myExitText = 'yes';
            var myArrowHtml =  '<line x1="0" y1="0" x2="45" y2="45"/> \
                                <line x1="44" y1="25" x2="44" y2="44"/> \
                                <line x1="25" y1="44" x2="44" y2="44"/> \
                                <text x="17" y="25" font-size="10px" stroke-width="1" stroke="none" fill="black">'+myExitText+'</text>';
            var myIconHtml =  '<div title="Switch EXIT Direction"><svg class="button_controls button_switch switch_to_left" height="20" width="20"> \
                                    <polyline class="left" points="13 3,6 10,13 17"/> \
                               </svg></div>';
            break;
    }

    var exitNode =  '<li id="'+myExitClass+'" class="'+myExitClass+' exit_widget unsortable"> \
                        '+myIconHtml+' \
                        <div class="exit_widget_title"> \
                            <span>DECIDE</span> \
                        </div> \
                        <svg class="exit_arrow" height="45" width="45"> \
                          '+myArrowHtml+' \
                        </svg> \
                    </li>';
    $(exitNode).hide().appendTo('#'+myCueId+' .exits').fadeIn(300);

    // activate the EXIT switch button
    ButtonSwitchExit(myCueId, myExitClass);  // activate the switch button
}




function SetExitNodesAndArrowsTTB(myCueId, isLastCueBool) {

    // check if Exit nodes exist
    //var myExitLeftTest = $('#'+myCueId).find('.exit_left').length;
    //var myExitRightTest = $('#'+myCueId).find('.exit_right').length;

    // check if Arrow to next cue exist
    //var myArrowToNextCueTest = $('#'+myCueId).find('.cue_arrow').length;
    //console.log('myArrowToNextCue: '+myArrowToNextCue);

    AddExitNodeTTB(myCueId, 'exit_right', 'decide');        // AddExitNodeTTB(myCueId, myExitClass, myExitTitle)
    DrawArrowToNextCue(myCueId, 'equal');     // DrawArrowToNextCue(myCueId, myLabel)

    if (isLastCueBool == true) {
        AddExitNodeTTB(myCueId, 'exit_down', 'guess');        // AddExitNodeTTB(myCueId, myExitClass, myExitTitle)
    }
}
function AddExitNodeTTBCHECK(myCueId, myExitClass, myExitTitle) {
    //console.log('ADD EXIT NODE! '+myCueId+' '+myExitClass);

    switch(myExitClass) {

        case 'exit_right':
            var myArrowText = 'different';
            var myArrowHtml =  '<line x1="0" y1="0" x2="45" y2="45"/> \
                                <line x1="44" y1="25" x2="44" y2="44"/> \
                                <line x1="25" y1="44" x2="44" y2="44"/> \
                                <text text-anchor="middle" x="22" y="25" font-size="10px" stroke-width="1" stroke="none" fill="black">'+myArrowText+'</text>';
            //var myExitTitle = 'decide';
            break;
        case 'exit_down':
            var myArrowHtml =  '';
            //var myExitTitle = 'guess';
            break;
    }

    var exitNode =  '<li id="'+myExitClass+'" class="'+myExitClass+' exit_widget unsortable"> \
                        <div class="exit_widget_title"> \
                            <span>'+myExitTitle+'</span> \
                        </div> \
                        <svg class="exit_arrow" height="45" width="45"> \
                          '+myArrowHtml+' \
                        </svg> \
                    </li>';
    $(exitNode).hide().appendTo('#'+myCueId+' .exits').fadeIn(300);

    // activate the EXIT switch button
    //ButtonSwitchExit(myCueId, myExitClass);  // activate the switch button
}




/* ****************************
 WEIGHTED TALLYING
 *****************************/

function ArrowsAndExitsWTCHECK(myListId) {

    $('#tree').find('.exits').empty();

    //remove all if there is any
    RemoveElement(myListId, 'exit_left');
    RemoveElement(myListId, 'exit_right');
    RemoveElement(myListId, 'exit_down');
    RemoveElement(myListId, 'widget_validity');
    RemoveElement(myListId, 'widget_multiply');
    RemoveElement(myListId, 'cue_arrow');

    if (myListId == 'tree') {

        // get the array of cues in the tree, "sortable" is disabled ($('#tree').sortable('toArray') doesn't work)
        var myTreeArray = GetWidgetsArray(myListId);

        // get the last cue
        var myLastCueId = $(myTreeArray).get(-1);

        myTreeArray.forEach(function (myCueId) {

            // do for each cue in the tree, except the last cue
            if (myCueId != myLastCueId) {
                // draw ARROW to next cue
                DrawArrowToNextCue(myCueId, '');

                // do for the last cue
            } else {

                // add EXIT node to right
                AddExitNodeTTB(myCueId, 'exit_right', 'decide');        // AddExitNodeTTB(myCueId, myExitClass, myExitTitle)

                // draw ARROW to next cue
                DrawArrowToNextCue(myCueId, 'equal');

                // add the EXIT node down
                AddExitNodeTTB(myCueId, 'exit_down', 'guess');        // AddExitNodeTTB(myCueId, myExitClass, myExitTitle)
            }
        });
    }
}

/* ****************************
 WEIGHTED TALLYING
 *****************************/

function ArrowsAndExitsTA(myListId) {

    $('#tree').find('.exits').empty();

    //remove all if there is any
    RemoveElement(myListId, 'exit_left');
    RemoveElement(myListId, 'exit_right');
    RemoveElement(myListId, 'exit_down');
    RemoveElement(myListId, 'widget_validity');
    RemoveElement(myListId, 'widget_multiply');
    RemoveElement(myListId, 'cue_arrow');

    if (myListId == 'tree') {

        // get the array of cues in the tree, "sortable" is disabled ($('#tree').sortable('toArray') doesn't work)
        var myTreeArray = GetWidgetsArray(myListId);

        // get the last cue
        var myLastCueId = $(myTreeArray).get(-1);

        myTreeArray.forEach(function (myCueId) {

            // do for each cue in the tree, except the last cue
            if (myCueId != myLastCueId) {
                // draw ARROW to next cue
                DrawArrowToNextCue(myCueId, '');

            // do for the last cue
            } else {

                // add EXIT node to right
                AddExitNodeTTB(myCueId, 'exit_right', 'decide');        // AddExitNodeTTB(myCueId, myExitClass, myExitTitle)

                // draw ARROW to next cue
                DrawArrowToNextCue(myCueId, 'equal');

                // add the EXIT node down
                AddExitNodeTTB(myCueId, 'exit_down', 'guess');        // AddExitNodeTTB(myCueId, myExitClass, myExitTitle)
            }
        });
    }
}
