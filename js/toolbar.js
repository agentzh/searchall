function toSearchAll (uri, query, event) {
    if (query == undefined)
        query = "";
    //alert("query: " + query);
    //alert("URI: " + uri);
    var winopts = "chrome,extrachrome,menubar,resizable,scrollbars,status,toolbar";
    //var win = window.open(uri, "_blank", winopts);
    openUILink(uri, event, false, true);
    if (query != '') {
        var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
        prefs = prefs.getBranch("extensions.searchall.");

        // we have to use setComplexValue to write UTF-8 strings:
        try {
            var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
            str.data = query;
            prefs.setComplexValue('query', Components.interfaces.nsISupportsString, str);
        } catch (e) {}
        //prefs.setCharPref('query', query);
    }
}

function handleKeydown (uri, e, obj) {
    //alert("Hey!");
    if (e.keyCode == 13) {
        //alert("Found enter key!");
        toSearchAll(uri, obj.value, e);
        return false;
    } else {
        //info("Got key: " + e.keyCode);
    }
    //alert(e.keyCode + " pressed!");
    return true;
}

