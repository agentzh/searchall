// Class SearchAll.PrevNext
// -- agentzh

if (typeof SearchAll == 'undefined') SearchAll = {};

SearchAll.PrevNext = {
    prevGuard: null,
    done: [false, false, false],
    setDone: function (index) {
        this.done[index] = true;
    },
    isDone: function (index) {
        return this.done[index];
    },
    reset: function () {
        this.done = [false, false, false];
    }
}

SearchAll.PrevNext.gotoNext = function (i) {
    var doc = app.origViews[i].document();
    var links = $("a:contains('Next')", doc);
    if (links.length == 0) {
        links = $("a:contains('下一页')", doc);
        if (links.length == 0) {
            links = $("a[@id*=next]", doc);
            if (links.length == 0) {
                links = $("img[@alt*='下一页']", doc).parent('a');
                if (links.length == 0) {
                    links = $("img[@alt*='Next']", doc).parent('a');
                    if (links.length == 0) {
                        links = $("a:contains('次へ')", doc);
                        if (links.length == 0) {
                            links = $("a:contains('next')", doc);
                        }
                    }
                }
            }
        }
    }
    var hostname = app.origViews[i].hostname();
    if (links.length == 0) {
        app.progress.setDone(hostname, 'N/A');
        info("[WARNING] No next button found for browser " + i);
        return;
    }

    var link = links[links.length-1];
    this.setDone(i, false);
    app.timer.start(hostname);
    app.threads[i].startDaemon();
    try {
        sendMouseEvent({type:'click'}, link);
    } catch (e) {
        error(e);
        return;
    }

    try {
        var browser = $("#fmt-view")[0];
        if (browser) {
            var fmt_view_doc = browser.contentDocument;
            //alert("Setting loading.gif...");
            if (fmt_view_doc)  {
                var cols = $(".col-" + i, fmt_view_doc);
                if (cols.length) {
                    cols.empty();
                    $(cols[0]).html('<img src="loading.gif" />');
                }
            }
        }
    } catch (e) { info(e); }

    // handle out of date calls?
    var self = this;
    app.setTimeout (function () {
        if (! self.done[i]) {
            info("Last resort for paging is running: " + hostname);
            app.fmtViews[i].update(hostname, doc, false/* don't force mining */);
        }
    }, 1000);
};

SearchAll.PrevNext.gotoPrev = function (i) {
    var doc = app.origViews[i].document();
    var links = $("a:contains('Prev')", doc);
    if (links.length == 0) {
        links = $("a:contains('上一页')", doc);
        if (links.length == 0) {
            links = $("a[@id*=prev]", doc);
            if (links.length == 0) {
                links = $("img[@alt*='上一页']", doc).parent('a');
                if (links.length == 0) {
                    links = $("img[@alt*='Prev']", doc).parent('a');
                    if (links.length == 0) {
                        links = $("a:contains('前へ')", doc);
                        if (links.length == 0) {
                            links = $("a:contains('previous')", doc);
                        }
                    }
                }
            }
        }
    }
    var hostname = app.origViews[i].hostname();
    if (links.length == 0) {
        error("No prev button found for browser " + i);
        this.setDone(i);
        app.progress.setDone(hostname, 'N/A');
        return;
    }

    var link = links[links.length-1];
    app.timer.start(hostname);
    app.threads[i].startDaemon();
    try {
        sendMouseEvent({type:'click'}, link);
    } catch (e) {
        error(e);
        return;
    }

    try {
        var browser = $("#fmt-view")[0];
        if (browser) {
            var fmt_view_doc = browser.contentDocument;
            //alert("Setting loading.gif...");
            $(".col-" + i, fmt_view_doc).empty();
            $($(".col-" + i, fmt_view_doc)[0]).html('<img src="loading.gif" />');
        }
    } catch (e) { info(e); }

    //var guard;
    var self = this;
    guard = function () {
        if (! self.isDone(i)) {
            var success = app.fmtViews[i].update(i, app.origViews[i].hostname(), doc, false/* don't force mining */);
            //if (!success) {
                //guard();
            //}
        }
    };
    app.setTimeout(guard, 1000);
};

$(document).ready(function () {
    $(app.prevButton).click(function () {
        //alert("Previous!");
        for (var i = 0; i < 3; i++) {
            app.threads[i].reset();
            app.threads[i].mineResults = true;
            SearchAll.PrevNext.reset();
            SearchAll.PrevNext.gotoPrev(i);
        }
    });
    $(app.nextButton).click(function () {
        //alert("Next!");
        for (var i = 0; i < 3; i++) {
            app.threads[i].reset();
            app.threads[i].mineResults = true;
            SearchAll.PrevNext.reset();
            SearchAll.PrevNext.gotoNext(i);
        }
    });
});


