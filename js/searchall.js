var noMining = [false, false, false];

var browser0 = new Browser("#browser-0");
var browser1 = new Browser("#browser-1");
var browser2 = new Browser("#browser-2");
browsers = [browser0, browser1, browser2];

var progressmeters;

function error (msg) {
    Debug.err("[ERROR] " + msg);
}

function info (msg) {
    Debug.log("[INFO] " + msg);
}

/*
// unload the listener to avoid FF memory leaking:
$(window).unload( function () {
    unregisterMyListener(browser0);
    unregisterMyListener(browser1);
    unregisterMyListener(browser2);
} );
*/

//var host2ind = {};

//alert($("#search-box").focus());
$("#search-button").click( function () {
    //browser.url = 'about:blank';
    //$("#fmt-view")[0];

    var doc = getFmtViewDoc();
    if (doc) {
        $("h1#default", doc).hide();
        $("table#content>tbody", doc)[0].innerHTML = '';
    }

    var query = $("#search-box").val();

    //timer = timer || new Timer();
    Replies = {};
    //progressmeters = $("#status-progress");
    myProgress.reset(3);
    progressmeters.show();
    //JJJ(progressmeters[0]);

    progressmeters[0].value = 0;
    for (var i = 0; i < 3; i++) {
        noMining[i] = false;
        browsers[i].doSearch(query);
    }
} );

// auto-submit if the user presses the Enter key
// in the search box:
$("#search-box").keydown( function (e) {
    if (e.keyCode == 13) {
        //alert("Found enter key!");
        $("#search-button")[0].click();
        return false;
    } else {
        //info("Got key: " + e.keyCode);
    }
    //alert(e.keyCode + " pressed!");
    //return false;
} );

function prepareUriList (i) {
    var uriLists = $("#url-list-" + i);
    uriLists.change( function (e) {
        // XXX add user-entered URL to the URL list
        var fmt_view_doc = $("#fmt-view")[0].contentDocument;
        if (fmt_view_doc) {
            var cols = $(".col-" + i, fmt_view_doc);
            if (cols.length) {
                cols.empty();
                $(cols[0]).html('<img src="loading.gif" />');
            }
        }

        var query = $("#search-box").val();
        //alert(query);
        if (query)
            AutoSearch[i] = true;
        set_home(i, this.value);
    } );
    uriLists[0].addEventListener(
        'command',
        function (e) {
            try {
                prefs.setIntPref('url.lastSelected.' + i, this.selectedIndex);
            } catch (e) { error(e); }
            var home = this.value.replace(/^http:\/\//, '');
            //this.label = this.value = home;

            // clear the fmt view's corresponding col
            var fmt_view_doc = $("#fmt-view")[0].contentDocument;
            if (fmt_view_doc) {
                var cols = $(".col-" + i, fmt_view_doc);
                if (cols.length) {
                    cols.empty();
                    $(cols[0]).html('<img src="loading.gif" />');
                }
            }

            var query = $("#search-box").val();
            //alert(query);
            if (query)
                AutoSearch[i] = true;
            set_home(i, home);
        },
        true
    );
    uriLists[0].addEventListener(
        'popupshowing',
        function (e) {
            var shown = [];
            var j = i;
            while (--j >= 0) {
                prev = $("#url-list-" + j);
                shown.push(prev[0].value);
            }
            j = i;
            while (++j <= 2) {
                next = $("#url-list-" + j);
                shown.push(next[0].value);
            }
            //Debug.JJJ(shown);
            //showDOM(this.firstChild);
            //showDOM(this.firstChild.firstChild);
            //info("Found URLs: " + $("#url-list-" + i + " > menupopup > .url").length);
            //$(".url").show();
            try {
                $("#url-list-" + i + ">menupopup>.url").show();
            } catch (e) { error(e); }
            var popup = this.firstChild;
            //showDOM(popup);
            var items = popup.childNodes;
            for (var k = 0; k < items.length; k++) {
                var item = items[k];
                //info("Checking item " + item.label);
                if (shown.indexOf(item.label) >= 0) {
                    //info("Found duplicated item " + item.label);
                    $(item).hide();
                }
            }
        },
        true
    );
}

function set_splitter_1 (dir) {
    $("#splitter-1")[0].setAttribute('collapse', dir);
}

function handleCheckbox (i) {
    $("#enable-view-" + i)[0].addEventListener(
        'command',
        function () {
            var id = i;
            info("checkbox " + id);
            //alert("checked: " + this.checked);
            if (this.checked) {
                this.nextSibling.disabled = false;
                for (var j = 0; j < 3; j++) {
                    if (j == i) continue;
                    $("#enable-view-" + j)[0].disabled = false;
                }

                //$("#browser-" + i).show();
                if (i == 2) {
                    //alert("hi!");
                    id = 1;
                    //set_splitter_1('before');
                    $("#splitter-1")[0].setAttribute('state', 'none');
                    var fmt_view_doc = $("#fmt-view")[0].contentDocument;
                    if (fmt_view_doc) {
                        $(".col-" + i, fmt_view_doc).show();
                    }
                    return;
                } else {
                    //$("#splitter-" + i)[0].setAttribute('collapse', 'after');
                    //alert("Hey!");
                   // $("#splitter-" + i)[0].setAttribute('collapse', 'before');

                }
                $("#splitter-" + id)[0].setAttribute('state', 'none');
                var fmt_view_doc = $("#fmt-view")[0].contentDocument;
                if (fmt_view_doc) {
                    $(".col-" + i, fmt_view_doc).show();
                }

            } else { // not checked
                this.setAttribute('checked', false);
                for (var j = 0; j < 3; j++) {
                    if (j == i) continue;
                    $("#enable-view-" + j)[0].disabled = true;
                }
                if (i == 2) {
                    id = 1;
                    set_splitter_1('after');
                } else {
                    set_splitter_1('before');
                }

                this.nextSibling.disabled = true;
                //$("#browser-" + i).hide();
                $("#splitter-" + id)[0].setAttribute('state', 'collapsed');
                var fmt_view_doc = $("#fmt-view")[0].contentDocument;
                if (fmt_view_doc) {
                    $(".col-" + i, fmt_view_doc).hide();
                }
            }
        },
        true
    );

}

var Toggle = false;

$(window).ready( function () {

    top.watch("location", watchAssignment);
    top.location.watch("href", watchAssignment);

    for (var i = 0; i < 3; i++) {
        handleCheckbox(i);
        registerMyListener(i);
    }
    var margin = document.getElementById('prev-button').boxObject.x;
    $("#navigator").css('margin-left', margin + 'px');

    progressmeters = $("#status-progress");
    for (var i = 0; i < 3; i++)
        prepareUriList(i);
    //alert("ther!!");
    //info("focusing search box... (1)");
    //info("blurring contentWindow...");
    // we need the following syntax error to retain the focus
    //browser0.browser.contentDocument.blur();
    //browser1.browser.contentDocument.blur();
    //browser2.browser.contentDocument.blur();
    $("#search-box").focus();

    /*
    for (var i = 0; i < 2; i++) {
        $("#splitter-" + i)[0].disabled = true;
    }
    */

    //animate();
} );

function watchAssignment (id, oldval, newval) {
    //alert("o." + id + " changed from "
        //+ oldval + " to " + newval);
    throw("Permission denied");
    //return '#';
}

