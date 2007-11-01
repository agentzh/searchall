// Class SearchAll.App
// -- agentzh

if (typeof SearchAll == 'undefined') SearchAll = {};

SearchAll.Thread = function (index) {
    this.id = "thr" + index;
    this.index = index;
    this.autoSubmit = false;
    this.mineResults = false;
    return this;
}

SearchAll.Thread.prototype = {
    goHome: function (home) {
        var delay = 0;
        var app = SearchAll.app;
        if (!app.pageMode) {
            // such a delay is necessary in 'window mode'
            delay = 500;
        }
        var index = this.index;
        setTimeout(function () {
            this.mineResults = false;
            app.origViews[index].goHome(home);
            if (app.pageMode) app.searchBox.focus();
        }, delay);
    }
};

