var Done = [false, false, false];

$(document).ready(function () {
    $("#prev-button").click(function () {
        //alert("Previous!");
        for (var i = 0; i < 3; i++) {
            gotoPrev(i);
        }
    });
    $("#next-button").click(function () {
        //alert("Next!");
        for (var i = 0; i < 3; i++) {
            gotoNext(i);
        }
    });
});

function gotoNext (i) {
    var doc = browsers[i].document();
    var links = $("a:contains('Next')", doc);
    if (links.length == 0) {
        links = $("a:contains('下一页')", doc);
        if (links.length == 0) {
            links = $("a[@id*=next]", doc);
            if (links.length == 0) {
                links = $("img[@alt*='下一页']", doc).parent('a');
                if (links.length == 0) {
                    links = $("img[@alt*='Next']", doc).parent('a');
                }
            }
        }
    }
    var hostname = browsers[i].hostname();
    if (links.length == 0) {
        myProgress.setDone(hostname, 'N/A');
        error("No next button found for browser " + i);
        return;
    }

    var link = links[links.length-1];
    Done[i] = false;
    myTimer.start(hostname);
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

    setTimeout (function () {
        if (! Done[i]) {
            info("Last resort for paging is running: " + hostname);
            noMining[i] = false;
            gen_fmt_view(i, hostname, doc, false/* don't force mining */);
        }
    }, 1000);
}

function gotoPrev (i) {
    var doc = browsers[i].document();
    var links = $("a:contains('Prev')", doc);
    if (links.length == 0) {
        links = $("a:contains('上一页')", doc);
        if (links.length == 0) {
            links = $("a[@id*=prev]", doc);
            if (links.length == 0) {
                links = $("img[@alt*='上一页']", doc).parent('a');
                if (links.length == 0) {
                    links = $("img[@alt*='Prev']", doc).parent('a');
                }
            }
        }
    }
    var hostname = browsers[i].hostname();
    if (links.length == 0) {
        error("No prev button found for browser " + i);
        Done[i] = true;
        myProgress.setDone(hostname, 'N/A');
        return;
    }

    var link = links[links.length-1];
    Done[i] = false;
    myTimer.start(hostname);
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

    setTimeout (function () {
        if (! Done[i]) {
            gen_fmt_view(i, browsers[i].hostname(), doc, false/* don't force mining */);
        }
    }, 1000);
}

