/**
 * Takes care of the arrows and exits of the tree
 */

/*****************************
 UNIVERSAL - for all ffts and heuristics
 *****************************/

function RestoreCuesArrowsAndExits(myHeuristicName, myTreeArray) {

    // select text, depending on the heuristic
    switch (myHeuristicName) {

        case 'Fast-and-Frugal Tree':

            var myNoText = 'no';
            var myYesText = 'yes';
            break;

        case 'Take The Best':
        case "Minimalist":

            var myNoText = 'equal';
            var myYesText = 'different';
            break;

        case "Tallying":
        case "Weighted Tallying":

            var myNoText = '';
            var myYesText = '';
            break;
    }

    myTreeArray.forEach(function (myCueObj, myIndex) {

        var myCueId = myCueObj.CueName;

        if (myCueObj.CueType == 'criterion') {

            // move criterion to criterion_place
            $('#' +myCueId).appendTo($('#criterion_place'));

        } else if (myCueObj.CueType == 'treecue') {

            // move cue to tree
            $('#' +myCueId).appendTo($('#tree'));

            UpdateArrowsAndExits(myHeuristicName, myTreeArray);

            /*switch (myCueObj.BranchNo +'|'+ myCueObj.BranchYes) {

                case 'exit|continue':

                    // add EXIT node to left
                    AddExitNode(myCueId, 'exit_left', myNoText, 'decide'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                    // draw ARROW to next cue
                    DrawArrowToNextCue(myCueId, myYesText);

                    break;

                case 'continue|exit':

                    // add EXIT node to right
                    AddExitNode(myCueId, 'exit_right', myYesText, 'decide'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                    // draw ARROW to next cue
                    DrawArrowToNextCue(myCueId, myNoText);

                    break;

                case 'exit|exit':

                    // add EXIT node to left
                    AddExitNode(myCueId, 'exit_left', myNoText, 'decide'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                    // add EXIT node to right
                    AddExitNode(myCueId, 'second', myYesText, 'decide'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                    break;

                case 'continue|continue':

                    // draw ARROW to next cue
                    DrawArrowToNextCue(myCueId, myNoText);

                    break;
            }*/
        }

        // do for the last cue
        /*if (myIndex == myTreeArray.length-1) {

            switch (myHeuristicName) {

                case 'Fast And Frugal Tree':

                    break;

                case 'Take The Best':
                case "Minimalist":

                    // add EXIT node to down
                    AddExitNode(myCueId,'exit_down','equal','guess'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                    // remove all buttons switch EXIT
                    $('.button_switch').remove();
                    break;

                case "Tallying":
                case "Weighted Tallying":

                    // add EXIT node to the right
                    AddExitNode(myCueId,'exit_right','different','decide'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                    // add EXIT node to down
                    AddExitNode(myCueId,'exit_down','equal','guess'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                    // remove all buttons switch EXIT
                    $('.button_switch').remove();

                    break;
            }
        }*/
    });
}

function UpdateArrowsAndExits(myHeuristicName, myTreeArray) {
    console.log('Updating arrows and exits...');

    // select text, depending on the heuristic
    switch (myHeuristicName) {

        case 'Fast-and-Frugal Tree':

            var myNoText = 'no';
            var myYesText = 'yes';
            break;

        case 'Take The Best':
        case "Minimalist":

            var myNoText = 'equal';
            var myYesText = 'different';
            break;

        case "Tallying":
        case "Weighted Tallying":

            var myNoText = '';
            var myYesText = '';
            break;
    }

    myTreeArray.forEach(function (myCueObj, myIndex) {

        //console.log(myCueObj);
        //debugger;

        var myCueId = myCueObj.CueName;

        switch (myCueObj.BranchNo +'|'+ myCueObj.BranchYes) {

            case 'exit|continue':

                // add EXIT node to left
                AddExitNode(myCueId, 'exit_left', myNoText, 'decide'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                // draw ARROW to next cue
                DrawArrowToNextCue(myCueId, myYesText);

                break;

            case 'continue|exit':

                // add EXIT node to right
                AddExitNode(myCueId, 'exit_right', myYesText, 'decide'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                // draw ARROW to next cue
                DrawArrowToNextCue(myCueId, myNoText);

                break;

            case 'exit|exit':

                // add EXIT node to right
                AddExitNode(myCueId, 'exit_right', myYesText, 'decide'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                // add second EXIT node to left
                //AddExitNode(myCueId, 'second', myNoText, 'decide'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                break;

            case 'continue|continue':

                // draw ARROW to next cue
                DrawArrowToNextCue(myCueId, myNoText);

                break;
        }

        // do for the last cue
        if (myIndex == myTreeArray.length-1) {

            switch (myHeuristicName) {

                case 'Fast-and-Frugal Tree':

                    // add EXIT node to left
                    AddExitNode(myCueId, 'exit_left', myNoText, 'decide'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                    // add EXIT node to right
                    AddExitNode(myCueId, 'second', myYesText, 'decide'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)


                    // remove arrow to the next cue
                    $('#'+myCueId+' .cue_arrow').remove();

                    break;

                case 'Take The Best':
                case "Minimalist":

                    // draw ARROW to next cue
                    DrawArrowToNextCue(myCueId, myNoText);

                    // add EXIT node to down
                    AddExitNode(myCueId,'exit_down','equal','guess'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                    // remove all buttons switch EXIT
                    $('.button_switch').remove();
                    break;

                case "Tallying":
                case "Weighted Tallying":

                    // draw ARROW to next cue
                    DrawArrowToNextCue(myCueId, myNoText);

                    // remove EXIT node to the right
                    $('#'+myCueId+' .exit_right').remove();

                    // add EXIT node to down
                    AddExitNode(myCueId,'exit_down','','decide'); // AddExitNode(myCueId,myExitClass,myExitArrowText,myExitTitle)

                    // remove all buttons switch EXIT
                    //$('.button_switch').remove();

                    break;
            }
        }
    });
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
                //myExitArrowText = 'yes';
                break;
            case 'exit_right':
                myExitClass = 'exit_left';
                //myExitArrowText = 'no';
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
            var myIconHtml =  '<div title="Switch EXIT Direction">'+
                '<svg class="button_controls button_switch switch_to_right" height="20" width="20">'+
                '<polyline class="right" points="7 3,14 10,7 17"/>'+
                '</svg>'+
                '</div>';
            break;

        case 'exit_right':
            var myArrowHtml =   '<line x1="0" y1="0" x2="45" y2="45"/>'+
                '<line x1="44" y1="25" x2="44" y2="44"/>'+
                '<line x1="25" y1="44" x2="44" y2="44"/>'+
                '<text text-anchor="middle" x="22" y="25"'+
                'font-size="10px" stroke-width="1" stroke="none"'+
                'fill="black">'+ myExitArrowText +'</text>';
            var myIconHtml =  '<div title="Switch EXIT Direction">'+
                '<svg class="button_controls button_switch switch_to_left" height="20" width="20">'+
                '<polyline class="left" points="13 3,6 10,13 17"/>'+
                '</svg>'+
                '</div>';
            break;

        case 'exit_down':
            var myArrowHtml = '';
            var myIconHtml = '';
            // exit_down i always a second EXIT node
            var needSecondNode = true;
            break;
    }

    var myExitNode =  '<li id="'+myExitClass+'" class="'+myExitClass+' exit_widget unsortable">'+ myIconHtml+
        '<div class="exit_widget_title"><span>'+myExitTitle+'</span></div>'+
        '<svg class="exit_arrow" height="45" width="45">'+myArrowHtml+'</svg></li>';

    // depending on how many EXITs are already
    switch(myExitsArray.length) {

        case 0:
            // create the EXIT node with fade in
            $(myExitNode).hide().appendTo('#'+myCueId+' .arrows_exits').fadeIn(300);
            // activate SWITCH EXIT button
            ButtonSwitchExit(myCueId, myExitClass);
            break;

        case 1:
            if (needSecondNode == true) {
                // create the EXIT node with fade in
                $(myExitNode).hide().appendTo('#'+myCueId+' .arrows_exits').fadeIn(300);
                // activate SWITCH EXIT button
                ButtonSwitchExit(myCueId, myExitClass);
            } else {
                // the EXIT node already exists, do nothing
            }
            break;

        case 2:
            if (needSecondNode == true) {
                // two nodes exist, do nothing
            } else {
                // remove one exit node
                $('#'+myCueId+' .exit_left').remove();
            }
            break;
    }
}

function SwitchExitDirection (myCueId, myOldExitClass) {

    // get the list of existing EXIT nodes
    var myExitsArray = GetElementsArray(myCueId, 'exit_widget');

    // do only if there is one EXIT node
    if (myExitsArray.length == 1) {

        switch (myOldExitClass) {
            case 'exit_left':
                var myExitClass = 'exit_right';
                var myExitArrowText = 'yes';
                var myCueArrowText = 'no';
                break;
            case 'exit_right':
                var myExitClass = 'exit_left';
                var myExitArrowText = 'no';
                var myCueArrowText = 'yes';
                break;
        }

        // change cue arrow text
        //document.getElementById('cue_arrow_text').textContent = myCueArrowText;
        $('#'+myCueId).find('#cue_arrow_text').text(myCueArrowText);

        // remove old EXIT node
        $('#'+myCueId+' .'+myOldExitClass).remove();

        // add new EXIT node
        AddExitNode(myCueId, myExitClass, myExitArrowText, 'decide');
    }
}

function DrawArrowToNextCue (myCueId, myArrowText) {
    //console.log('DRAW ARROW');

    // remove the old arrow if there was
    //$('#'+myCueId+' .cue_arrow').remove();  // CHECK THIS do i need it?

    // get the list of existing EXIT nodes
    var myCueArrowsArray = GetElementsArray(myCueId, 'cue_arrow');

    // draw the arrow only if it doesn't exist already
    if (myCueArrowsArray.length == 0){

        // set the html code
        var myHtml =  '<svg class="cue_arrow" height="40" width="40"> \
                            <line x1="20" y1="0" x2="20" y2="40"/> \
                            <line x1="5" y1="25" x2="20" y2="40"/> \
                            <line x1="35" y1="25" x2="20" y2="40"/> \
                            <text id="cue_arrow_text" text-anchor="middle" x="20" y="23" font-size="10px" stroke-width="1" stroke="none" fill="black">'+myArrowText+'</text> \
                        </svg>';

        // draw the SVG arrow
        //$('#'+myCueId).append( myHtml );
        $(myHtml).hide().appendTo('#'+myCueId+' .arrows_exits').fadeIn(300);

    }
}


function UpdateValidityTags(myHeuristic, myListId, myValidities) {

    // if it's criterion_place or drag_cues_list
    if (myListId != 'tree') {
        // remove all exits and arrows
        $('#'+myListId).find('.widget_tags').empty();

    } else {  // if the list is a tree

        switch (myHeuristic) {
            case 'Take The Best':

                // define the html code
                var myHtml = '<div class="widget_validity validity_ttb">v</div>';
                break;

            case 'Weighted Tallying':

                // define the html code
                var myHtml = '<svg class="widget_multiply" height="20" width="20">'+
                    '<polyline points="4 17, 17 4"/>' +
                    '<polyline points="4 4, 17 17"/>' +
                    '</svg>' +
                    '<div class="widget_validity validity_weta">v</div>';
                break;
        }

        // get the array of cues in the tree, "sortable" may be disabled ($('#tree').sortable('toArray') doesn't work)
/*        var myTreeArray = GetElementsArray(myListId, 'widget');

        var v = 1;
        myTreeArray.forEach(function (myCueId) {

            // add the html code
            $(myHtml).hide().appendTo('#'+myCueId+' .widget_tags').fadeIn(300);
            // add the index
            $('#'+myCueId+' .widget_validity').html('v'+ v);
            v++;
        });*/

        // add the validity tags with index
        myValidities.forEach(function(myCueObj, myIndex) {

            // add the html code
            $(myHtml).hide().appendTo('#'+myCueObj.CueName+' .widget_tags').fadeIn(300);
            // add the index
            var v = myCueObj.index + 1;
            $('#'+myCueObj.CueName+' .widget_validity').html('v'+ v);

        })

    }
}


