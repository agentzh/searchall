var toolbar = null;
var onToolbarArea = false;
var toolbarHeight = 0;
var toolbarDelay = 200;
var toolbarTimer = null;
var isToolbarHidden = false;
var firstTab, lastTab, prevButton;

function onMouseOver (e) {
    //info("e.screenX: " + e.screenX);
    var navigator = document.getElementById("navigator");
    //info("navigator.x: " + navigator.boxObject.x);
    //info("prev-button: " + $("#prev-button")[0].boxObject.x);
    var tabsLeft = firstTab.boxObject.x;
    var tabsRight = lastTab.boxObject.x + lastTab.boxObject.width;
    var prevButtonLeft = prevButton.boxObject.x;
    //info("tabsLeft: " + tabsLeft);
    //info("tabsRight: " + tabsRight);
    //info("prevButtonLeft: " + prevButtonLeft);
    //info("toolbarHeight: " + toolbarHeight);
    if (isToolbarHidden) {
        onToolbarArea = (
            e.clientY <= toolbarHeight
            && (e.clientX < tabsLeft ||
                e.clientX > tabsRight)
            && e.clientX < prevButtonLeft - 5
            );
    } else {
        onToolbarArea = (e.clientY < toolbarHeight);
    }
    //if (onToolbarAear) alert("Yes!");
    if (isToolbarHidden == onToolbarArea) {
        //alert(e.clientY);
        //info("onMouseOver!");
        //info("isToolbarHidden: " + isToolbarHidden);
        if (toolbarTimer)
            window.clearTimeout(toolbarTimer);

        toolbarTimer = window.setTimeout(
            function () { onMouseMoveOnCanvasCallback(e); },
            toolbarDelay
        );
    }
    //alert("Yes!");
}

function onMouseMoveOnCanvasCallback (e) {
    //alert("clientX: " + e.clientX);
    info("callback!");
    info("isToolbarHidden: " + isToolbarHidden);
    info("onToolbarArea: " + onToolbarArea);
    if (isToolbarHidden == onToolbarArea)
        showHideToolbar();
}

function showHideToolbar () {
    //info("showHideToolbar with " + isToolbarHidden);
    if (isToolbarHidden) {
        //alert("showing...");
        toolbar.setAttribute(
            'style',
            'margin-top:' + 0 + 'px; margin-bottom:0px;'
        );

        //$("#my-bar").show();
    } else {
        //alert("hiding...");
        toolbar.setAttribute(
            'style',
            'margin-top:' + (0-toolbarHeight) + 'px; margin-bottom:0px;'
        );

        //$("#my-bar").hide();
    }
    isToolbarHidden = ! isToolbarHidden;
}

$(document).ready(function () {
    //$("#my-bar").hide();
    if ($("page").length) {
        toolbar = $("#my-bar")[0];
        toolbarHeight   = $("#engine-bar")[0].boxObject.height;
        isToolbarHidden = true;
        toolbar.setAttribute(
            'style',
            'margin-top:' + (0-toolbarHeight) + 'px; margin-bottom:0px;'
        );

        $("#panel").mouseover(onMouseOver);
        $("#search-bar").hide();
        firstTab = $("#view-tab-0")[0];
        lastTab = $("#view-tabs")[0].lastChild;
        prevButton = document.getElementById('prev-button');
    }
});

