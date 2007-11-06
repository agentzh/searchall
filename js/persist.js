const Ci = Components.interfaces;
const Cc = Components.classes;
var selectedURLIndex, selectedTabIndex;
var Replies = {};
var prefs;
var app;

$(document).ready( function () {
    if (typeof SearchAll.app == 'undefined')
        SearchAll.app = new SearchAll.App();
    app = SearchAll.app;

    // XXX import search engines from FF's OpenSource service

    /*
    var searchService = Cc["@mozilla.org/browser/search-service;1"].
                        getService(Ci.nsIBrowserSearchService);
    for each (engine in searchService.getEngines({})) {
        engine = engine.wrappedJSObject;
        var url = engine._urls[0];
        alert(url.method + ": " + engine._urls[0].template + ": " + engine._urls[0].params.join(","));
        //url = engine._urls[1];
        //alert(url.method + ": " + engine._urls[0].template);
        for (var key in engine) {
            //if (key[0] == '_') continue;
            alert("engine: key: " + key + ": " + engine[key]);
        }
        alert("engine " + engine.name + ": " + engine.searchForm);

    }
    alert("Stop!");
    */

    prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
    prefs = prefs.getBranch("extensions.searchall.");
    var query;
    // we have to use getComplexValue to read UTF-8 strings:
    try {
        query = prefs.getComplexValue('query', Components.interfaces.nsISupportsString).data;
    } catch(e) {
        info("No query found!");
    }
    if (query && app.pageMode) {
        //alert("Found query!");
        //alert("Found query: " + query);
        app.searchBox.value = query;
        //prefs.setCharPref('query', '');
    }

    try {
        selectedTabIndex = prefs.getIntPref('tab.lastSelected');
        //$("#view-tabs").attr("lastSelected");
    } catch (e) { error(e); }
    if (app.pageMode && selectedTabIndex == 0) {
        selectedTabIndex = 1;
    }
    if (selectedTabIndex == undefined) {
        if (SearchAll.app.pageMode)
            selectedTabIndex = 1;
        else
            selectedTabIndex = 0;
    }
    Debug.log("Selecting tab " + selectedTabIndex + "...");
    //alert("I got this: " + $("#view-tabbox")[0].selectedIndex);
    app.viewTabbox.selectedIndex = selectedTabIndex;
    app.viewTabs.addEventListener(
        'command',
        function () {
            selectedTabIndex = this.selectedIndex;
            //this.setAttribute("lastSelected", this.selectedIndex);
            info("Setting tab.lastSelected to " + selectedTabIndex);
            try {
                prefs.setIntPref('tab.lastSelected', selectedTabIndex);
            } catch (e) {
                error(e);
            }
            //alert(selectedTabIndex);
            if (!app.pageMode) app.searchBox.focus();
        },
        false
    );

    app.progress.reset(3);
    //$("#view-tab-" + selectedTab)[0].selected = true;
    //alert($("#url-list-0").attr('lastSelected'));
    for (var i = 0; i < 3; i++) {
        var thread = app.threads[i];
        var home;
        try {
            selectedURLIndex = prefs.getIntPref('url.lastSelected.' + i);
        } catch (e) { error(e); }
        if (selectedURLIndex != undefined) {
            var url_list = $("#url-list-" + i)[0];
            url_list.selectedIndex = selectedURLIndex;
            home = url_list.value;
        } else {
            // XXX choose en sites for non zh locales
            info("Locale: " + app.locale);
            home = app.origViews[i].homePage();
        }
        //alert(home + " " + query);
        if (app.pageMode) {
            thread.query = query;
            thread.switchEngine(home);
        } else {
            thread.goHome(home);
        }
    }

    // for responding request from the SearchAll toolbar.
    var listener = function (evt) {
        //alert("Received from web page: " +
            //evt.target.getAttribute("query"));
        var query = evt.target.getAttribute('query');
        //alert("HERE 0 0");
        if (query != undefined && query != '') {
            //alert("HERE 1 0");
            app.searchBox.value = query;
            app.searchButton.click();
        }
    };
    document.addEventListener("SearchAllEvent", listener, false, true);

} );


