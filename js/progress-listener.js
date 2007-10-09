const WPL = Components.interfaces.nsIWebProgressListener;

function registerMyListener (i) {
    //var myListener = genListener();
    var browser = browsers[i].browser;
    var myListener = myListeners[i];
    browser.addProgressListener(myListener, WPL.NOTIFY_STATE_DOCUMENT);
}

function unregisterMyListener (browser) {
    browser.removeProgressListener(myListener);
}

function genStatusMsg (data) {
    list = [];
    for (var key in data) {
        var pair = [key, data[key]];
        //Debug.JJJ(pair)
        list.push(pair);
    }
    list.sort(function (a, b) {
        //alert(b[1].toString() + " " + a[1].toString());
        return a[1] - b[1];
    });
    //JJJ(list);
    var msg = '';
    for (var i = 0; i < list.length; i++) {
        var pair = list[i];
        //JJJ(pair);
        var key = pair[0];
        var val = pair[1];
        var alias = key.replace(/^www\./, '');
        msg += "[ " + alias + ": " + val/1000 + " sec] ";
    }
    return msg;
}

function handleSearchButton (id) {
    //alert(id);
    var browser = new Browser("#browser-" + id);
    var searchboxes = $("#search-box");
    var local_val = browser.textbox().val();
    var global_val = searchboxes.val();
    if (local_val == global_val)
        return true;
    //alert("Clicked me!");
    searchboxes[0].value = local_val;
    //alert("Value set!");
    $("#search-button").click();
    return false;
}

var myListeners = [];
myListeners[0] = genListener(0);
myListeners[1] = genListener(1);
myListeners[2] = genListener(2);

function genListener (ind) {
    return {
    QueryInterface: function (iid) {
        if (iid.equals(Components.interfaces.nsIWebProgressListener) ||
            iid.equals(Components.interfaces.nsISupportsWeakReference) ||
            iid.equals(Components.interfaces.nsISupports))
            return this;
        throw Components.results.NS_NOINTERFACE;
    },
    onStateChange: function (progress, request, flag, status) {
    /*
        var myself = 'chrome://searchall/content/searchall.xul';
        if (top.location != myself) {
            alert("window.location: " + window.location);
            alert("window.parent.location: " + window.opener.location);
            //top.location = top.parent;
        }
    */
        //alert("hi");
        if (flag & WPL.STATE_START) {
        //aRequest.QueryInterface(Components.interfaces.nsIChannel);
            // we don't start timing here...since we
            // can't tell the *first* request.
            //myTimer.start(hostname);
            //alert("Wait a moment!\n" + request.URI);
            //$("#search-box").focus();
        }
        if (flag & WPL.STATE_STOP) {
            var hostname;
            try {
                hostname = progress.DOMWindow.window.location.hostname;
            } catch (e) {
                //error(e);
                //alert(progress.DOMWindow.window.parent.getAttribute(homePage));
                //hostname = '';
            }
            var doc = progress.DOMWindow.document;
            //var ind = host2ind[hostname];
            //if ((flag & STATE_DONE) == STATE_DONE)
            if (!Replies[hostname]) Replies[hostname] = 0;
            num = ++Replies[hostname];
            if (hostname == undefined) {
                //alert("ind undefined!");
                if (num == 4) {
                    var progressmeter = $("#status-progress");
                    progressmeter[0].value = 100;
                    setTimeout( function () {
                        progressmeter.hide();
                    }, 100 );
                }
                for (var i = 0; i < browsers.length; i++) {
                    if (browsers[i].document() == doc) {
                        //alert("browser " + i + " found!");
                        //alert("HERE: " + i);
                        var id = i;
                        browsers[i].button().click(
                            function () {
                                return handleSearchButton(id);
                            }
                        );
                    }
                }
                $("#search-box").focus();
                return;
            }

            if (num == 1 && myTimer.isTiming(hostname)) {
                // we start timing in Browser.doSearch
                myTimer.stop(hostname, { force: true });
                var elapsed = myTimer.lastResult(hostname);
                if (elapsed != undefined) {
                    var msg = hostname + "(" + num + "): " + elapsed + " ms"
                    info(msg);
                    myProgress.setDone(hostname, elapsed);
                    $("#statusbar-display")[0].label =
                        genStatusMsg(myProgress.tasks);
                }
            }
            //alert("Hi (0)");
            //info("blurring contentWindow...");
            //for (var i = 0; i < 3; i++)
                //browsers[i].browser.contentWindow.blur();
            //info("focusing search box... (2)");
            // Ensure we get the focus...
            if (flag & WPL.STATE_IS_NETWORK) {
                try {
                    var val = 100 * myProgress.percent();
                    var progressmeter = $("#status-progress");
                    //alert(ind);
                    progressmeter[0].value = val;
                    if (val >= 100) {
                        setTimeout( function () {
                            progressmeter.hide();
                        }, 100 );
                    }

                    //alert(hostname);
                    // XXX code duplication...
                    myTimer.stop(hostname, { force: true });
                    var elapsed = myTimer.lastResult(hostname);
                    if (elapsed != undefined) {
                        var msg = hostname + "(" + num + "): " + elapsed + " ms"
                        info(msg);
                        myProgress.setDone(hostname, elapsed);
                        $("#statusbar-display")[0].label =
                            genStatusMsg(myProgress.tasks);
                    }
                } catch (e) {
                    info(e);
                }

                try {
                    var browser = $("#fmt-view")[0];
                    if (!browser) return;
                    var fmt_view_doc = browser.contentDocument;
                    $("span#loading", fmt_view_doc).hide();
                    if (AutoSearch[ind]) {
                        $("h1#default", fmt_view_doc).hide();
                    }
                } catch (e) {
                    info(e);
                }

                if (AutoSearch[ind]) {
                    AutoSearch[ind] = false;
                    //alert("Clicking...");
                    //host2ind[hostname] = ind;
                    var query = $("#search-box").val();
                    //ind = host2ind[hostname];
                    info("Autosubmitting...");
                    info("Clicking " + ind + " for host " + hostname);
                    noMining[ind] = false;
                    browsers[ind].doSearch(query);
                    //$("#search-button")[0].click();
                    //$("#search-box").focus();
                    return;
                }

                info(hostname + " loaded.");
                var doc = progress.DOMWindow.document;
                Done[ind] = true;
                //if (noMining[ind]) { info("No mining!!!"); }
                if ($("#search-box").val() != '' && ! noMining[ind]) {
                    //info("XXX: currentURI: " + browsers[ind].uri().prePath);
                    //info("XXX: homePage: " + browsers[ind].homePage());
                    //if (browsers[ind].uri() == browsers[ind].homePage()) {
                        //alert("Hiya! " + browsers[ind].uri());
                    //}
                    showDOM(doc, hostname);
                    //alert("Hiya: " + hostname);
                    gen_fmt_view(ind, hostname, doc, false/* don't force mining */);
                }
                for (var i = 0; i < browsers.length; i++) {
                    if (browsers[i].document() == doc) {
                        //alert("browser " + i + " found!");
                        //alert("HERE: " + i);
                        var id = i;
                        browsers[i].button().click(
                            function () {
                                return handleSearchButton(id);
                            }
                        );
                    }
                }
                $("#search-box").focus();
                setTimeout(function () {
                    //info("blurring contentWindow...");
                    //for (var i = 0; i < 3; i++)
                        //browsers[i].browser.contentDocument.blur();
                    //info("focusing search box... (3)");
                    $("#search-box").focus();
                }, 10);
            }
        }
        //$("#search-box").focus();
    },
    onLocationChange:function(a,b,c){},
    onProgressChange: function (progress, request, curSelf, maxSelf, curTotal, maxTotal) {
        //var hostname = progress.DOMWindow.window.location.hostname;
        //alert(hostname + ":\n" + curSelf + " : " + maxSelf + "\n" + curTotal + " : " + maxTotal);
    },
    onStatusChange:function(a,b,c,d){},
    onSecurityChange: function(a,b,c){},
    onLinkIconAvailable: function(a){},
    };
}


