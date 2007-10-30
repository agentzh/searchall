var timeUnit;
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
        if (!timeUnit) {
            timeUnit = $("#statusbar-display").attr("_timeunit");
            //alert(timeUnit);
        }
        msg += "[ " + alias + ": " + val/1000 + " " + timeUnit + "] ";
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
    SearchAll.app.searchButton.click();
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
        var app = SearchAll.app;
    /*
        var myself = 'chrome://searchall/content/searchall.xul';
        if (top.location != myself) {
            alert("window.location: " + window.location);
            alert("window.parent.location: " + window.opener.location);
            //top.location = top.parent;
        }
    */
        //alert("hi");
        try {
            removeFormTarget(browsers[ind].document());
        } catch (e) {}
        if (flag & WPL.STATE_START) {
        //aRequest.QueryInterface(Components.interfaces.nsIChannel);
            // we don't start timing here...since we
            // can't tell the *first* request.
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
                //alert("browser " + i + " found!");
                //alert("HERE: " + i);
                removeFormTarget(browsers[ind].document());
                browsers[ind].button().click(
                    function () {
                        return handleSearchButton(ind);
                    }
                );
                $("#search-box").focus();
                return;
            }

            if (num == 1 && app.timer.isTiming(hostname)) {
                // we start timing in Browser.doSearch
                app.timer.stop(hostname, { force: true });
                var elapsed = app.timer.lastResult(hostname);
                if (elapsed != undefined) {
                    var msg = hostname + "(" + num + "): " + elapsed + " ms"
                    info(msg);
                    app.progress.setDone(hostname, elapsed);
                    $("#statusbar-display")[0].label =
                        genStatusMsg(app.progress.tasks);
                }
            }
            //alert("Hi (0)");
            //info("blurring contentWindow...");
            //for (var i = 0; i < 3; i++)
                //browsers[i].browser.contentWindow.blur();
            //info("focusing search box... (2)");
            // Ensure we get the focus...
            if (flag & WPL.STATE_IS_NETWORK) {
                //if (hostname.match(/taobao/)) alert("processing " + hostname);
                try {
                    var val = 100 * app.progress.percent();
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
                    app.timer.stop(hostname, { force: true });
                    var elapsed = app.timer.lastResult(hostname);
                    if (elapsed != undefined) {
                        var msg = hostname + "(" + num + "): " + elapsed + " ms"
                        info(msg);
                        app.progress.setDone(hostname, elapsed);
                        $("#statusbar-display")[0].label =
                            genStatusMsg(app.progress.tasks);
                    }
                } catch (e) {
                    info(e);
                }

                var thread = app.threads[ind];
                try {
                    var fmtDoc = app.fmtViews[ind].document;
                    $("span#loading", fmtDoc).hide();
                    if (thread.autoSubmit)
                        $("h1#default", fmtDoc).hide();
                } catch (e) {
                    info(e);
                }

                if (thread.autoSubmit) {
                    thread.autoSubmit = false;
                    //alert("Clicking...");
                    //host2ind[hostname] = ind;
                    var query = app.searchBox.value;
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
                    try {
                        app.domLogger.log(doc, hostname);
                    } catch (e) { info(e) }
                    //alert("Hiya: " + hostname);
                    app.fmtViews[ind].update(hostname, doc, false /* don't force mining */);
                }
                browsers[ind].button().click(
                    function () {
                        return handleSearchButton(ind);
                    }
                );
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

function removeFormTarget (doc) {
    var forms = $("form", doc);
    if (forms.length == 0) return;
    forms.each(function () {
        //alert("hey!");
        //var target = this.getAttribute('target');
        //alert("Target: " + target);
        this.setAttribute('target', '_self');
    });
    //alert(forms.length);
}

