function getAnonElem (node, path) {
    var elems = path.split(/>/);
    alert("Found elems: " + elems.length);
    var nodes = document.getAnonymousNodes(gBrowser);
    if (nodes == 0) return null;

}

function toSearchAll (uri, query, event) {
    //alert("Anonymouse Nodes: " + node);
    //var node = document.getAnonymousElementByAttribute(gBrowser, 'class', 'tabs-stack');
    //alert("Anonymouse Nodes: " + node);
    if (query == undefined)
        query = "";
    //alert("query: " + query);
    //alert("URI: " + uri);
    //var win = window.open(uri, "_blank", winopts);
    var doc = gBrowser.contentDocument;
    if (doc.location == uri) {
        //alert("Got tabbrowser: " + gBrowser.nodeName);
        //alert("Length: " + $(".tab-icon-image", ).length);
        //alert("Hit shortcut! " + query);
        if (query != '') {
            // XXX need to use event to pass data...
            //$("#search-box", doc)[0].value = query;
            var element = doc.createElement("MyExtensionDataElement");
            element.setAttribute("query", query);
            doc.documentElement.appendChild(element);
            var evt = doc.createEvent("Events");
            evt.initEvent("SearchAllEvent", true, false);
            element.dispatchEvent(evt);
        }
    } else {
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

        openUILink(uri, event, false, true);
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

/*
var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIWebNavigation)
                   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                   .rootTreeItem
                   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIDOMWindow) 

*/
