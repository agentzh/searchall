var selectedURLIndex, selectedTabIndex;
var Replies = {};
var prefs;
var app;

$(document).ready( function () {
    if (typeof SearchAll.app == 'undefined')
        SearchAll.app = new SearchAll.App();
    app = SearchAll.app;

    prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
    prefs = prefs.getBranch("extensions.searchall.");
    var query;
    // we have to use getComplexValue to read UTF-8 strings:
    try {
        query = prefs.getComplexValue('query', Components.interfaces.nsISupportsString).data;
    } catch(e) {
        info("No query found!");
    }
    if (query) {
        //alert("Found query!");
        //alert("Found query: " + query);
        app.searchBox.value = query;
        //prefs.setCharPref('query', '');
        for (var i = 0; i < 3; i++)
            app.threads[i].autoSubmit = true;
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
        try {
            selectedURLIndex = prefs.getIntPref('url.lastSelected.' + i);
        } catch (e) { error(e); }
        if (selectedURLIndex != undefined) {
            var url_list = $("#url-list-" + i)[0];
            url_list.selectedIndex = selectedURLIndex;
            app.threads[i].goHome(url_list.value);
        } else {
            app.threads[i].goHome();
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


