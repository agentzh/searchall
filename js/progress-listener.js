var timeUnit;
const WPL = Components.interfaces.nsIWebProgressListener;

function registerMyListener (i) {
    //var myListener = genListener();
    var browser = SearchAll.app.origViews[i].browser;
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
    var app = SearchAll.app;
    var local_val = app.origViews[id].textbox().val();
    var global_val = app.searchBox.value;
    if (local_val == global_val)
        return true;
    //alert("Clicked me!");
    app.searchBox.value = local_val;
    //alert("Value set!");
    app.searchButton.click();
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
        if (flag & WPL.STATE_START) {
            return;
        }

        var thread = app.threads[ind];
        var hostname, doc;
        if (flag & WPL.STATE_IS_WINDOW) {
            try {
                removeFormTarget(app.origViews[ind].document());
            } catch (e) {}

            try {
                hostname = progress.DOMWindow.window.location.hostname;
            } catch (e) {
                //error(e);
                //alert(progress.DOMWindow.window.parent.getAttribute(homePage));
                //hostname = '';
            }
            doc = progress.DOMWindow.document;
            if (hostname == undefined) {
                // initial loading
                //alert("ind undefined!");
                app.progressmeter.value = 100;
                setTimeout( function () {
                    $(app.progressmeter).hide();
                }, 100 );
                //alert("browser " + i + " found!");
                //alert("HERE: " + i);

                // work around yahoo.com's frame-busting logic:
                //removeFormTarget(app.origViews[ind].document());

                // plant hooks into third-party pages:
                app.origViews[ind].button().click(
                    function () {
                        return handleSearchButton(ind);
                    }
                );
                app.searchBox.focus();
                return;
            }
            /*
            else {
                if (thread.hostname != hostname) {
                    alert("Unmatched hosts: " + thread.hostname + " <=> " + hostname);
                    info("thread state: autoSubmit: " + thread.autoSubmit);
                    info("thread state: mineResults: " + thread.mineResults);
                    return;
                }
            }
            */

            // we refresh benchmark results at every stop:
            if (app.timer.isTiming(hostname)) {
                // we start timing in Browser.doSearch
                app.timer.stop(hostname, { force: true });
                var elapsed = app.timer.lastResult(hostname);
                if (elapsed != undefined) {
                    //var msg = hostname + "(" + num + "): " + elapsed + " ms"
                    //info(msg);
                    app.progress.setDone(hostname, elapsed);

                    // XXX use app.statusbar.label instead:
                    $("#statusbar-display")[0].label =
                        genStatusMsg(app.progress.tasks);
                }
            }

            // auto-submit here...
            if (thread.autoSubmit) {
                var textboxes = app.origViews[ind].textbox();
                if (textboxes.length) {
                    info("autoSubmit: hit the shortcut! " + hostname);
                    thread.autoSubmit = false;
                    //alert("Clicking...");
                    //host2ind[hostname] = ind;
                    var query = app.searchBox.value;
                    //ind = host2ind[hostname];
                    info("Autosubmitting...");
                    info("Clicking " + ind + " for host " + hostname);
                    thread.doSearch(query);
                    //$("#search-button")[0].click();
                    //$("#search-box").focus();
                    return;
                }
            }
        }

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
                    //var msg = hostname + "(" + num + "): " + elapsed + " ms"
                    //info(msg);
                    app.progress.setDone(hostname, elapsed);
                    $("#statusbar-display")[0].label =
                        genStatusMsg(app.progress.tasks);
                }
            } catch (e) {
                info(e);
            }

            try {
                var fmtDoc = app.fmtViews[ind].document;
                $("span#loading", fmtDoc).hide();
                if (thread.autoSubmit)
                    $("h1#default", fmtDoc).hide();
            } catch (e) {
                info(e);
            }

            info(hostname + " loaded.");
            var doc = progress.DOMWindow.document;
            SearchAll.PrevNext.setDone(ind);
            if (app.searchBox.value != '' && thread.mineResults) {
                try {
                    app.domLogger.log(doc, hostname);
                    app.fmtViews[ind].update(hostname, doc, false /* don't force mining */);
                } catch (e) { info(e) }
                //alert("Hiya: " + hostname);

                // stop daemon
                // XXX right thing?
                if (app.fmtViews[ind].prevResults.length > 0)
                    thread.mineResults = false;
            }

            // plant hooks into third-party SE's:
            app.origViews[ind].button().click(
                function () {
                    return handleSearchButton(ind);
                }
            );
            app.searchBox.focus();
            setTimeout(function () {
                //info("blurring contentWindow...");
                //info("focusing search box... (3)");
                app.searchBox.focus();
            }, 10);
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

