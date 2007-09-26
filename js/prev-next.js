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
        } else {
            error("Next button not found for " + i);
        }
    }

    var link = links[links.length-1];
    Done[i] = false;
    try {
        sendMouseEvent({type:'click'}, link);
    } catch (e) {
        error(e);
        return;
    }

    setTimeout (function () {
        if (! Done[i]) {
            gen_fmt_view(i, browsers[i].hostname(), doc, false/* don't force mining */);
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
        } else {
            error("Previous button not found for " + i);
        }
    }

    var link = links[links.length-1];
    Done[i] = false;
    try {
        sendMouseEvent({type:'click'}, link);
    } catch (e) {
        error(e);
        return;
    }

    setTimeout (function () {
        if (! Done[i]) {
            gen_fmt_view(i, browsers[i].hostname(), doc, false/* don't force mining */);
        }
    }, 1000);
}

