var toolbar = null;
var onToolbarArea = false;
var toolbarHeight = 0;
var toolbarDelay = 200;
var toolbarTimer = null;
var isToolbarHidden = false;

function onMouseOver (e) {
    //info("e.screenX: " + e.screenX);
    var navigator = document.getElementById("navigator");
    //info("navigator.x: " + navigator.boxObject.x);
    //info("prev-button: " + $("#prev-button")[0].boxObject.x);
    if (isToolbarHidden) {
        onToolbarArea = (
            e.clientY < toolbarHeight/3*2 &&
            e.clientX > navigator.boxObject.x + 5 &&
            e.clientX < document.getElementById('prev-button').boxObject.x - 5);
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
        toolbarHeight   = toolbar.boxObject.height;
        isToolbarHidden = true;
        toolbar.setAttribute(
            'style',
            'margin-top:' + (0-toolbarHeight) + 'px; margin-bottom:0px;'
        );

        $("#panel").mouseover(onMouseOver);
    }
});

