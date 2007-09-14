JSAN.use('JSON');

if (Debug == undefined) {
    var Debug = {
        get console() {
            return Components.classes[
                "@mozilla.org/consoleservice;1"
            ].getService(
                Components.interfaces.nsIConsoleService
            );
        }
    };
}

Debug.EXPORT = [ 'log', 'XXX', 'JJJ' ];

Debug.log = function (msg) {
    Debug.console.logStringMessage(msg);
}

Debug.err = function (msg) {
    Components.utils.reportError(msg);
}

Debug.XXX = function (msg) {
    if (! confirm(msg))
        throw("terminated...");
    return msg;
}

Debug.JJJ = function (obj) {
    Debug.XXX(JSON.stringify(obj));
    return obj;
}

