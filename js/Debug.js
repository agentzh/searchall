JSAN.use('JSON');

if (typeof Debug == "undefined") {
    var Debug = {
        _info: null,
        _infoFileName: '/tmp/searchall.info.log',
        get info() {
            if (this._info == null) {
                var fileName = this._infoFileName;
                this._info = FileIO.open(fileName)
                if (!this._info) {
                    Components.utils.reportError("failed to open " +
                            fileName + " for writing");
                    return null;
                }
                FileIO.write(Debug.info, (new Date()).toString() + "\n", "", "utf-8");
            }
            return this._info;
        }
    };
}

Debug.EXPORT = [ 'log', 'XXX', 'JJJ' ];

Debug.log = function (msg) {
    if (!FileIO.write(Debug.info, msg + "\n", "a", "utf-8")) {
        Components.utils.reportError("failed to write to  " +
                this._infoFileName);
    }
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

