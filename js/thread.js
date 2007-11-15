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
    this.final = false;
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
            app.setTimeout(function () {
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
            this.final = false;
            this.startDaemon();
            origView.goHome(url);
            return;
        }
        if (query != '') {
            this.autoSubmit = true;
            this.mineResults = true;
            this.reset();
            this.final = false;
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
        this.final = false;
        this.startDaemon();
        this.query = query;
        app.origViews[this.index].doSearch(query);
    },
    startDaemon: function (count) {
        if (!count) count = 0;
        var thread = this;
        var index = thread.index;
        this.prevDaemon  = app.setTimeout(function () {
            if (thread.mineResults) {
                info("daemon " + index + ": " + "Mining results.");
                var origView = app.origViews[index];
                var fmtView = app.fmtViews[index];
                var doc = origView.document();
                var hostname = origView.hostname();
                try {
                    app.fmtViews[index].update(
                        hostname, doc, false /* don't force mining */
                    );
                } catch (e) { info("fmt view update failed: " + e); }
                //if (app.fmtViews[index].prevResults.length > 0) {
                    // XXX error handling
                    //info("daemon " + index + ": Stopped due to mined resuts.");
                //} else {
                if (origView.browser.webProgress.isLoadingDocument)
                    thread.startDaemon(count + 1);
                else if (fmtView.prevResults.length > 0) {
                    // XXX error handling
                    info("daemon " + index + ": Stopped due to mined resuts.");
                    //thread.prevDaemon = null;
                } else {
                    info("daemon " + index + ": Stopped due to completed documents.");
                    //info('fmt view document: ' + fmtView.document);
                    var imgs = $(".col-" + index + ">img.loading", fmtView.document);
                    //if (imgs.length == 0) {
                        //alert("Found 0 leng imgs!");
                    //}
                    //info("loading image count: " + imgs.length);
                    var status = imgs.css('display');
                    if (status != 'none') {
                        imgs.hide();
                        //imgs.parent().html("Sorry, no results found :(");
                    }
                    //thread.prevDaemon = null;
                    //info("state: " + status);
                }
                //}
            }
        }, this.interval);
    }
};

