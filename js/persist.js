var AutoSearch = [];
var selectedURLIndex, selectedTabIndex;
var myTimer = new Timer();
var Replies = {};
var myProgress = new Progress(3);
var prefs;

$(document).ready( function () {
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
        //alert("Found query: " + query);
        $("#search-box")[0].value = query;
        prefs.setCharPref('query', '');
        AutoSearch = [true, true, true];
    }

    try {
        selectedTabIndex = prefs.getIntPref('tab.lastSelected');
        //$("#view-tabs").attr("lastSelected");
    } catch (e) { error(e); }
    if (selectedTabIndex == undefined) {
        selectedTabIndex = 0;
    }
    Debug.log("Selecting tab " + selectedTabIndex + "...");
    //alert("I got this: " + $("#view-tabbox")[0].selectedIndex);
    $("#view-tabbox")[0].selectedIndex = selectedTabIndex;
    $("#view-tabs")[0].addEventListener(
        'command',
        function () {
            selectedTabIndex = this.selectedIndex;
            //this.setAttribute("lastSelected", this.selectedIndex);
            try {
                prefs.setIntPref('tab.lastSelected', this.selectedIndex);
            } catch (e) {
                error(e);
            }
            //alert(selectedTabIndex);
            $("#search-box").focus();
        },
        false
    );

    Replies = {};
    myProgress.reset(3);
    //progressmeters.show();
    //progressmeters[0].value = 0;
    //$("#view-tab-" + selectedTab)[0].selected = true;
    //alert($("#url-list-0").attr('lastSelected'));
    for (var i = 0; i < 3; i++) {
        try {
            selectedURLIndex = prefs.getIntPref('url.lastSelected.' + i);
        } catch (e) { error(e); }
        if (selectedURLIndex != undefined) {
            var url_list = $("#url-list-" + i)[0];
            url_list.selectedIndex = selectedURLIndex;
            set_home(i, url_list.value);
        } else {
            set_home(i);
        }
    }
} );

function set_home (i, home) {
    var hostname;
    if (home) {
        hostname = home
            .replace(/^http:\/\//, '')
            .replace(/\/.*/, '');
    } else {
        hostname = browsers[i].hostname();
    }
    info("Setting host2ind " + hostname + " => " + i);
    host2ind[hostname] = i;

    setTimeout(function () { 
        browsers[i].goHome(home);
        $("#search-box").focus();
    }, 500);
}

