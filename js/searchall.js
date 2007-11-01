const nsIPermissionManager = CI("nsIPermissionManager");
const PermManager = CC("@mozilla.org/permissionmanager;1");
const pm = PermManager.getService(nsIPermissionManager);
const DENY_ACTION = nsIPermissionManager.DENY_ACTION;
const ALLOW_ACTION = nsIPermissionManager.ALLOW_ACTION;

var noMining = [false, false, false];

function error (msg) {
    Debug.err("[ERROR] " + msg);
}

function info (msg) {
    Debug.log("[INFO] " + msg);
}

$("#search-button").click( function () {
    var app = SearchAll.app;
    var doc = app.fmtViews[0].document;
    if (doc) {
        $("h1#default", doc).hide();
        $("table#content>tbody", doc)[0].innerHTML = '';
    }

    var query = app.searchBox.value;

    //timer = timer || new Timer();
    Replies = {};
    app.progress.reset(3);
    $(app.progressmeter).show();

    app.progressmeter.value = 0;
    for (var i = 0; i < 3; i++) {
        noMining[i] = false;
        app.origViews[i].doSearch(query);
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
        var app = SearchAll.app;
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
            app.threads[i].autoSubmit = true;
        app.threads[i].goHome(this.value);
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
                SearchAll.app.threads[i].autoSubmit = true;
            SearchAll.app.threads[i].goHome(home);
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
    var app = SearchAll.app;
    try {
        var ioService = CCSV("@mozilla.org/network/io-service;1", "nsIIOService");
        var host = 'searchall';
        var uri = ioService.newURI("http://" + host, null, null);
        pm.add(uri, "firebug", DENY_ACTION);
    } catch (e) { error("perm.disableFirebug: " + e); }

    top.watch("location", watchAssignment);
    top.location.watch("href", watchAssignment);
    top.location.watch("hostname", watchAssignment);
    top.location.watch("pathname", watchAssignment);
    top.location.watch("host", watchAssignment);
    top.location.watch("replace", watchAssignment);
    //top.location.replace = function () { alert("Hiya, yahoo!"); };
    //top.location = {};
    //top.location.replace("Hiya!");
    //top.location = "abc";


    for (var i = 0; i < 3; i++) {
        handleCheckbox(i);
        registerMyListener(i);
    }
    var margin = document.getElementById('prev-button').boxObject.x;
    $("#navigator").css('margin-left', margin + 'px');

    for (var i = 0; i < 3; i++)
        prepareUriList(i);
    //alert("ther!!");
    //info("focusing search box... (1)");
    //info("blurring contentWindow...");
    // we need the following syntax error to retain the focus
    app.searchBox.focus();

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

