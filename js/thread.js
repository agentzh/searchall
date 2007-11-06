// Class SearchAll.App
// -- agentzh

if (typeof SearchAll == 'undefined') SearchAll = {};

SearchAll.Thread = function (index) {
    this.id = "thr" + index;
    this.index = index;
    this.autoSubmit = false;
    this.mineResults = false;
    this.firstTime = true;
    this.interval = 2000;  /* 2 sec */
    this.prevDaemon = null;
    this.query = '';
}

SearchAll.Thread.prototype = {
    goHome: function (home) {
        var delay = 0;
        this.mineResults = false;
        if (!app.pageMode && this.firstTime) {
            // such a delay is necessary in 'window mode'
            delay = 500;
            this.firstTime = false;
        }
        var thread = this;
        if (delay) {
            setTimeout(function () {
                app.origViews[thread.index].goHome(home);
                if (!app.pageMode) app.searchBox.focus();
            }, delay);
        } else {
            app.origViews[thread.index].goHome(home);
            if (!app.pageMode) app.searchBox.focus();
        }
    },
    reset: function () {
        app.fmtViews[this.index].reset();
        app.origViews[this.index].stop();
        if (this.prevDaemon != null)
            clearTimeout(this.prevDaemon);
    },
    switchEngine: function (home) {
        info("Switching engine to: " + home);
        var query = this.query;
        var key = home.replace(/^https?:\/\//, '');
        var shortcut = app.shortcuts[key];
        var origView = app.origViews[this.index];
        if (shortcut && shortcut.length && query != '') {
            var charset = shortcut[1] || 'UTF-8';
            var template = shortcut[0];
            var encodedQuery = SearchAll.Util.encodeQuery(query, charset);
            info("encodedQuery: " + encodedQuery);
            var url = template.replace(/\{searchTerms\}/g, encodedQuery);
            //url = encodeURIComponent(url);
            info("opensearch URL: " + url);
            // XXX refactor the following out?
            this.autoSubmit = false;
            this.mineResults = true;
            this.reset();
            this.startDaemon();
            origView.goHome(url);
            return;
        }
        if (query != '') {
            this.autoSubmit = true;
            this.mineResults = true;
            this.reset();
            this.startDaemon();
            origView.goHome(home);
        } else {
            this.autoSubmit = false;
            this.goHome(home);
        }
    },
    doSearch: function (query) {
        this.mineResults = true;
        this.reset();
        this.startDaemon();
        this.query = query;
        app.origViews[this.index].doSearch(query);
    },
    startDaemon: function (count) {
        if (!count) count = 0;
        var thread = this;
        var index = thread.index;
        this.prevDaemon  = setTimeout(function () {
            if (thread.mineResults) {
                info("daemon " + index + ": " + "Mining results.");
                var origView = app.origViews[index];
                var doc = origView.document();
                var hostname = origView.hostname();
                try {
                    app.fmtViews[index].update(
                        hostname, doc, false /* don't force mining */
                    );
                } catch (e) { info("fmt view update failed."); }
                if (app.fmtViews[index].prevResults.length > 0) {
                    // XXX error handling
                    info("daemon " + index + ": " + "Run out of limit.");
                } else {
                    thread.startDaemon(count + 1);
                }
            }
        }, this.interval);
    }
};

