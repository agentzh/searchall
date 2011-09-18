const nsIPermissionManager = CI("nsIPermissionManager");
const PermManager = CC("@mozilla.org/permissionmanager;1");
const pm = PermManager.getService(nsIPermissionManager);
const DENY_ACTION = nsIPermissionManager.DENY_ACTION;
const ALLOW_ACTION = nsIPermissionManager.ALLOW_ACTION;

function error (msg) {
    Debug.err("[ERROR] " + msg);
}

function info (msg) {
    Debug.log("[INFO] " + msg);
}

function prepareUriList (i) {
    var uriLists = $("#url-list-" + i);
    uriLists.change( function (e) {
        // XXX add user-entered URL to the URL list
        var fmtDoc = app.fmtViews[0].document;
        if (fmtDoc) {
            var cols = $(".col-" + i, fmtDoc);
            if (cols.length) {
                cols.empty();
                $(cols[0]).html('<img src="loading.gif" />');
            }
        }
        var home = this.value.replace(/^http:\/\//, '');
        info("Change to new home: " + home);

        var query = app.searchBox.value;
        //alert(query);
        var thread = app.threads[i];
        thread.query = query;
        thread.switchEngine(home);
    } );
    uriLists[0].addEventListener(
        'command',
        function (e) {
            try {
                prefs.setIntPref('url.lastSelected.' + i, this.selectedIndex);
            } catch (e) { error(e); }
            //this.label = this.value = home;
            var fmtDoc = app.fmtViews[0].document;
            if (fmtDoc) {
                var cols = $(".col-" + i, fmtDoc);
                if (cols.length) {
                    cols.empty();
                    $(cols[0]).html('<img class="loading" src="loading.gif" />');
                }
            }
            var home = this.value.replace(/^http:\/\//, '');
            info("command to new home: " + home);

            var query = app.searchBox.value;
            //alert(query);
            var thread = app.threads[i];
            thread.query = query;
            thread.switchEngine(home);
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

window.addEventListener("load", function() {
    info("window loaded");

    try {
        var ioService = CCSV("@mozilla.org/network/io-service;1", "nsIIOService");
        var host = 'searchall';
        var uri = ioService.newURI("http://" + host, null, null);
        pm.add(uri, "firebug", DENY_ACTION);

    } catch (e) {
        error("perm.disableFirebug: " + e);
    }

    info("setting hooks to prevent frame explosion");

    /*
    top.watch("location", watchAssignment);
    top.location.watch("href", watchAssignment);
    top.location.watch("hostname", watchAssignment);
    top.location.watch("pathname", watchAssignment);
    top.location.watch("host", watchAssignment);
    top.location.watch("replace", watchAssignment);
    */

    //top.location.replace = function () { alert("Hiya, yahoo!"); };
    //top.location = {};
    //top.location.replace("Hiya!");
    //top.location = "abc";

    // auto-submit if the user presses the Enter key
    // in the search box:

    //alert("register keydown event for search box");

    $(app.searchBox).keydown( function (e) {
        if (e.keyCode == 13) {
            app.searchButton.click();
            return false;
        } else {
            //info("Got key: " + e.keyCode);
        }
        //alert(e.keyCode + " pressed!");
        //return false;
    } );

    info("register window unload event");

    $(window).unload( function (e) {
        for (var i = 0; i < 3; i++) {
            app.threads[i].reset();
            unregisterMyListener(i);
        }
        app = {};
        $('*').unbind();
        //alert("Hey!");
        info("searchall window unloaded.");
    } );

    info("register search button click event");

    $(app.searchButton).click( function () {
        //alert("Howdy!");
        var doc = app.fmtViews[0].document;
        if (doc) {
            $("h1#default", doc).hide();
            $("table#content>tbody", doc)[0].innerHTML = '';
        }

        var query = app.searchBox.value;
        app.progress.reset(3);
        //$(app.progressmeter).show();
        //timer = timer || new Timer();
        //app.progressmeter.value = 0;
        for (var i = 0; i < 3; i++) {
            app.threads[i].doSearch(query);
        }
    } );

    //alert("register browser listeners");

    for (var i = 0; i < 3; i++) {
        handleCheckbox(i);
        registerMyListener(i);
    }

    var button = document.getElementById('prev-button');
    var viewTabbox = document.getElementById('view-tabbox');
    var navigator = document.getElementById('navigator');

    for (var i = 0; i < 3; i++) {
        //app.origViews[i].browser.docShell.allowMetaRedirects = false;
        //app.origViews[i].browser.docShell.allowJavascript = false;
        //app.origViews[i].docShell.allowMetaRedirects = false;
        prepareUriList(i);
    }

    info("blurring contentWindow...");
    // we need the following syntax error to retain the focus
    if (!app.pageMode) {
        app.searchBox.focus();
    }

    info("init done");
}, false);

function watchAssignment (id, oldval, newval) {
    //alert("o." + id + " changed from "
        //+ oldval + " to " + newval);
    throw("Permission denied");
    //return '#';
}

