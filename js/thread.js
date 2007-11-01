// Class SearchAll.App
// -- agentzh

if (typeof SearchAll == 'undefined') SearchAll = {};

SearchAll.Thread = function (index) {
    this.id = "thr" + index;
    this.index = index;
    this.autoSubmit = false;
    this.mineResults = false;
    this.firstTime = true;
}

SearchAll.Thread.prototype = {
    goHome: function (home) {
        var delay = 0;
        var app = SearchAll.app;
        if (!app.pageMode && this.firstTime) {
            // such a delay is necessary in 'window mode'
            delay = 500;
            this.firstTime = false;
        }
        var self = this;
        setTimeout(function () {
            self.mineResults = false;
            app.origViews[self.index].goHome(home);
            if (app.pageMode) app.searchBox.focus();
        }, delay);
    }
};

