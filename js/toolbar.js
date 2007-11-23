const nsIPermissionManager = CI("nsIPermissionManager");
const PermManager = CC("@mozilla.org/permissionmanager;1");
const pm = PermManager.getService(nsIPermissionManager);
const DENY_ACTION = nsIPermissionManager.DENY_ACTION;
const ALLOW_ACTION = nsIPermissionManager.ALLOW_ACTION;

$(document).ready(init);

function getAnonElem (node, path) {
    var elems = path.split(/>/);
    alert("Found elems: " + elems.length);
    var nodes = document.getAnonymousNodes(gBrowser);
    if (nodes == 0) return null;

}

function setQuery (query) {
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

function init () {
    try {
        var ioService = CCSV("@mozilla.org/network/io-service;1", "nsIIOService");
        var host = 'searchall';
        var uri = ioService.newURI("http://" + host, null, null);
        pm.add(uri, "firebug", DENY_ACTION);
    } catch (e) { error("perm.disableFirebug: " + e); }

    var contextMenu = document.getElementById("contentAreaContextMenu");
    if (contextMenu)
        contextMenu.addEventListener("popupshowing", showHideMenu, false);
}

function showHideMenu (event) {
    var show = document.getElementById("right-click-sa");
    show.hidden = !(gContextMenu.isTextSelected);
}

function contextSearchAll (uri) {
    var query;
    if (gContextMenu.onTextInput) {
        var text = document.popupNode;
        query = text.value.substring(text.selectionStart, text.selectionEnd);
        if (query.length > 50) query = query.substr(0, 49);
    } else {
        if (gContextMenu.searchSelected)
            query = gContextMenu.searchSelected();
        else
            query = getBrowserSelection();
        if (query.length > 50)
            text = text.substr(0, 49);
    }
    // elimiate double-quotes
    query = query.replace(/"/g, '');
    if (query.length > 0) {
        setQuery('"' + query + '"');
        var newTab = gBrowser.addTab(uri);
        gBrowser.selectedTab = newTab;
        //gBrowser.selectedBrowser.removeAttribute("type");
        gBrowser.selectedTab.id = 'searchall';
    }
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
        //gBrowser.selectedBrowser.removeAttribute("type");
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
            setQuery(query);
        }

        //gBrowser.selectedBrowser.removeAttribute("type");
        openUILink(uri, event, false, true);
        //gBrowser.selectedBrowser.docShell.allowMetaRedirects = false;
        //gBrowser.selectedBrowser.docShell.allowJavascript = false;
        gBrowser.selectedTab.id = 'searchall';
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

/*
var Counter = {};

var httpRequestObserver =
{
  observe: function(subject, topic, data)
  {
        if (topic == "http-on-modify-request") {
            var httpChannel = subject.QueryInterface(Components.interfaces.nsIHttpChannel);
            //httpChannel.setRequestHeader("X-Hello", "World", false);
            var url = httpChannel.documentURI;
            var str = '';
            if (url) {
                //alert(referrer.host);
                str += url.host;
                if (! str.match(/google/)) {
                    Counter[str] = Counter[str] || 0;
                    var c = Counter[str]++;
                    if (c == 1 || c == 2) {
                        alert("Cancel " + c);
                        subject.cancel(2152398850);
                    }
                    alert(str + url.path);
                }
            }
            //str += httpChannel.originalURI.host;
            //alert(str);
        }
  },

  get observerService() {
    return Components.classes["@mozilla.org/observer-service;1"]
                     .getService(Components.interfaces.nsIObserverService);
  },

  register: function()
  {
    this.observerService.addObserver(this, "http-on-modify-request", false);
  },

  unregister: function()
  {
    this.observerService.removeObserver(this, "http-on-modify-request");
  }
};

$(window).ready( function () {
    httpRequestObserver.register();
} );

$(window).unload( function () {
    httpRequestObserver.unregister();
} );
*/

