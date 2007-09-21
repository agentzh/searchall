var browser0 = new Browser("#browser-0");
var browser1 = new Browser("#browser-1");
var browser2 = new Browser("#browser-2");
browsers = [browser0, browser1, browser2];

var progressmeters;

function error (msg) {
    Debug.err("[ERROR] " + msg);
}

function info (msg) {
    Debug.log("[INFO] " + msg);
}

/*
// unload the listener to avoid FF memory leaking:
$(window).unload( function () {
    unregisterMyListener(browser0);
    unregisterMyListener(browser1);
    unregisterMyListener(browser2);
} );
*/

var host2ind = {};

//alert($("#search-box").focus());
$("#search-button").click( function () {
    //browser.url = 'about:blank';
    $("#fmt-view")[0].reload();

    var query = $("#search-box").val();

    //timer = timer || new Timer();
    Replies = {};
    //progressmeters = $("#status-progress");
    myProgress.reset(3);
    progressmeters.show();
    //JJJ(progressmeters[0]);

    progressmeters[0].value = 0;
    host2ind[browser0.hostname()] = 0;
    browser0.doSearch(query);

    host2ind[browser1.hostname()] = 1;
    browser1.doSearch(query);

    host2ind[browser2.hostname()] = 2;
    browser2.doSearch(query);
} );

// auto-submit if the user presses the Enter key
// in the search box:
$("#search-box").keydown( function (e) {
    if (e.keyCode == 13) {
        //alert("Found enter key!");
        $("#search-button").click();
        return false;
    } else {
        //info("Got key: " + e.keyCode);
    }
    //alert(e.keyCode + " pressed!");
    //return false;
} );

function prepareUriList (i) {
    var uriLists = $("#url-list-" + i);
    uriLists.change( function (e) {
        var fmt_view_doc = $("#fmt-view")[0].contentDocument;
        if (fmt_view_doc) {
            $(".col-" + i, fmt_view_doc).empty();
        }

        browsers[i].goHome(this.value);
    } );
    uriLists[0].addEventListener(
        'command',
        function (e) {
            var home = this.value.replace(/^http:\/\//, '');
            //this.label = this.value = home;

            // clear the fmt view's corresponding col
            var fmt_view_doc = $("#fmt-view")[0].contentDocument;
            if (fmt_view_doc) {
                $(".col-" + i, fmt_view_doc).empty();
            }

            browsers[i].goHome(home);
        },
        true
    );
    uriLists[0].addEventListener(
        'popupshowing',
        function (e) {
            var shown = [];
            var j = i;
            while (--j >= 0) {
                prev = $("#url-list-" + j);
                shown.push(prev[0].value);
            }
            j = i;
            while (++j <= 2) {
                next = $("#url-list-" + j);
                shown.push(next[0].value);
            }
            //Debug.JJJ(shown);
            //showDOM(this.firstChild);
            //showDOM(this.firstChild.firstChild);
            //info("Found URLs: " + $("#url-list-" + i + " > menupopup > .url").length);
            //$(".url").show();
            $("#url-list-" + i + " > menupopup > .url").show();
            var popup = this.firstChild;
            //showDOM(popup);
            var items = popup.childNodes;
            for (var k = 0; k < items.length; k++) {
                var item = items[k];
                //info("Checking item " + item.label);
                if (shown.indexOf(item.label) >= 0) {
                    //info("Found duplicated item " + item.label);
                    $(item).hide();
                }
            }
        },
        true
    );
}

function set_splitter_1 (dir) {
    $("#splitter-1")[0].setAttribute('collapse', dir);
}

function handleCheckbox (i) {
    $("#enable-view-" + i)[0].addEventListener(
        'command',
        function () {
            var id = i;
            info("checkbox " + id);
            //alert("checked: " + this.checked);
            if (this.checked) {
                this.nextSibling.disabled = false;
                for (var j = 0; j < 3; j++) {
                    if (j == i) continue;
                    $("#enable-view-" + j)[0].disabled = false;
                }

                //$("#browser-" + i).show();
                if (i == 2) {
                    //alert("hi!");
                    id = 1;
                    //set_splitter_1('before');
                    $("#splitter-1")[0].setAttribute('state', 'none');
                    var fmt_view_doc = $("#fmt-view")[0].contentDocument;
                    if (fmt_view_doc) {
                        $(".col-" + i, fmt_view_doc).show();
                    }
                    return;
                } else {
                    //$("#splitter-" + i)[0].setAttribute('collapse', 'after');
                    //alert("Hey!");
                   // $("#splitter-" + i)[0].setAttribute('collapse', 'before');

                }
                $("#splitter-" + id)[0].setAttribute('state', 'none');
                var fmt_view_doc = $("#fmt-view")[0].contentDocument;
                if (fmt_view_doc) {
                    $(".col-" + i, fmt_view_doc).show();
                }

            } else { // not checked
                this.setAttribute('checked', false);
                for (var j = 0; j < 3; j++) {
                    if (j == i) continue;
                    $("#enable-view-" + j)[0].disabled = true;
                }
                if (i == 2) {
                    id = 1;
                    set_splitter_1('after');
                } else {
                    set_splitter_1('before');
                }

                this.nextSibling.disabled = true;
                //$("#browser-" + i).hide();
                $("#splitter-" + id)[0].setAttribute('state', 'collapsed');
                var fmt_view_doc = $("#fmt-view")[0].contentDocument;
                if (fmt_view_doc) {
                    $(".col-" + i, fmt_view_doc).hide();
                }
            }
        },
        true
    );

}

function gen_fmt_view (index, hostname, doc) {
    setTimeout(function () {
        var list;
        var html = '';
        if (hostname == 'www.baidu.cn') {
            list = $("tbody>tr>td.f", doc); // body
        } else if (hostname == 'www.google.cn') {
            //list = $("div.g>h2.r", doc); // title + url
            list = $("div.g[h2]", doc);
        } else if (hostname == 'www.yisou.com') {
            //list = $("div.g>h2.r", doc); // title + url
            list = $("div.web>ol>li", doc);
        } else if (hostname == 'www.google.com') {
            list = $("div.g[h2]", doc);
        } else if (hostname == 'so.sohu.com') {
            list = $("div#content>div", doc);
        } else if (hostname == 'search.cpan.org') {
            list = $("body>p[small]", doc);
        } else if (hostname == 'www.yahoo.cn') {
            list = $(".yst-web>ul>li[h3]", doc);
        } else if (hostname == 'search.yahoo.com') {
            list = $("div#yschweb>ol>li", doc);
        } else {
            list = [];
            html = "<p /><p /><p /><p /><p />\n" +
                "<center>Sorry, " + hostname +
                " is not currently supported in the " +
                "Formatted View :(</center>\n";
        }

        var fmt_view_doc = $("#fmt-view")[0].contentDocument;
        if (!fmt_view_doc) {
            Debug.log("WARNING: fmt_view_doc not found.");
            return;
        }

        Debug.log(hostname + ": " + list.length);
        for (var i = 0; i < list.length; i++) {
            //Debug.log(hostname + ": " + $(list[i]).text());
            var snippet = $(list[i]).html();
            snippet = snippet
                .replace(/<(\/?)wbr>/ig, '')
                .replace(/<(\/?)nobr>/ig, '')
                .replace(/<(\/?)span>/ig, '')
                .replace(/<\/h\d+[^>]*>/ig, '<br/>')
                .replace(/<h\d+[^>]*>/ig, '')
                .replace(/<\/?table[^>]*>/ig, '')
                .replace(/<\/?tbody[^>]*>/ig, '')
                .replace(/<\/?tr[^>]*>/ig, '')
                .replace(/<\/?td[^>]*>/ig, '')
            //Debug.log(hostname + snippet);
            //snippet = snippet.replace(/[\w.?=&\/]{45,45}/g, "$1<wbr/>");
            var rows = $(".row", fmt_view_doc);
            if (rows[i] == undefined) {
                var tbodies = $("#content>tbody", fmt_view_doc);
                //alert(tbodies[0]);
                Debug.log("appending row " + i + " for " + hostname);
                //alert($(rows[0]).parent()[0].tagName);
                $(tbodies[0]).parent().append(
                    '<tr class="row">' +
                        '<td class="col-0" />' +
                        '<td class="col-1" />' +
                        '<td class="col-2" />' +
                    '</tr>'
                );
                rows = $(".row", fmt_view_doc);
            }
            var cell = $(".col-" + index, rows[i])[0];
            cell.innerHTML = snippet;
        }
        if (! $("#enable-view-" + index)[0].checked) {
            $(".col-" + index, fmt_view_doc).hide();
        }

        //showDOM(fmt_view_doc, "DOM");
        //alert(html);

        //alert(index);
        //var fmt_view_col = $(".col-" + index, fmt_view_doc)[0];
        //if (!fmt_view_col) {
            //Debug.log("WARNING: fmt_view_col " + index + " not found.");
            //return;
        //}

        //fmt_view_col.innerHTML = html;
        //Debug.log(fmt_view_doc.innerHTML);
    }, 100);
}

$(window).ready( function () {
    for (var i = 0; i < 3; i++) {
        handleCheckbox(i);
    }

    registerMyListener(browser0.browser);
    registerMyListener(browser1.browser);
    registerMyListener(browser2.browser);

    progressmeters = $("#status-progress");
    for (var i = 0; i < 3; i++)
        prepareUriList(i);
    //alert("ther!!");
    //info("focusing search box... (1)");
    //info("blurring contentWindow...");
    // we need the following syntax error to retain the focus
    //browser0.browser.contentDocument.blur();
    //browser1.browser.contentDocument.blur();
    //browser2.browser.contentDocument.blur();
    $("#search-box").focus();

    /*
    for (var i = 0; i < 2; i++) {
        $("#splitter-" + i)[0].disabled = true;
    }
    */
} );

