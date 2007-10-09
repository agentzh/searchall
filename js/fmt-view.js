var Patterns = {
    'www.baidu.cn'    : "tbody>tr>td.f",
    'www.baidu.com'   : "tbody>tr>td.f",
    'www.google.cn'   : "div.g[h2]",
    'www.google.com'  : "div.g[h2]",
    'www.yisou.com'   : "div.web>ol>li",
    'so.sohu.com'     : "body>div#content>div",
    'www.sogou.com'   : "body>div#content>div",
    'search.cpan.org' : "body>p[small]",
    'www.yahoo.cn'    : ".yst-web>ul>li[h3]",
    'so.163.com'      : 'body>div>div.r',
    'addons.mozilla.org' : 'div#container>div#content>div.addon-listitem',
    'search.yahoo.com': "div#yschweb>ol>li",
    'www.ask.com'     : "div#main>div#content>div#midRail>div#rpane>div#teoma-results>div",
    'image.baidu.com' : "div#imgid>table.r1>tbody>tr>td",
    'image.baidu.cn'  : "div#imgid>table.r1>tbody>tr>td",
    'images.search.yahoo.com':  'div#yschbody>div#yschres>table#yschimg>tbody>tr>td'
};

var fmtViewHistory = ['0', '0', '0'];

function isEmpty (html) {
    var res = html.replace(/<[^>]+>|\s+/g, '');
    return /^$/.test(res);
}

function gen_fmt_view (index, hostname, doc, forceMining) {
    setTimeout(function () {
        var list = [];
        var pattern = Patterns[hostname];
        if (!forceMining && pattern) {
            list = $(pattern, doc);
        } else {
            //if (list.length == 0) {
            //alert("Start to mine!");
            var count = 5;
            while (count >= 2) {
                var patterns = mine_pattern(doc, count, hostname);
                if (patterns.length > 0) {
                    pattern = patterns[0];
                    //pattern = pattern.replace(/.*>([^>]+>[^>]+>[^>]+)$/, "$1");

                    info("Selected: " + hostname + ": pattern: " + pattern);
                    list = $(pattern, doc);
                    Patterns[hostname] = pattern;
                    break;
                } else {
                    count--;
                }
            }
            if (!pattern) {
                info("Failed to mine for " + hostname);
                return;
            }
        }
        //alert("list len: " + list.length);

        /*
            msg = "<p /><p /><p /><p /><p />\n" +
                "<center>Sorry, " + hostname +
                " is not currently supported in the " +
                "Formatted View :(</center>\n";
            list = [msg];
        */

        var browser = $("#fmt-view")[0];
        if (!browser) return;
        var fmt_view_doc = browser.contentDocument;
        if (!fmt_view_doc) {
            Debug.log("WARNING: fmt_view_doc not found.");
            return;
        }

        var html = $("body", doc).html();
        //info("XXX WWW" + html);
        //info("XXX QQQ" + fmtViewHistory[index]);
        if (fmtViewHistory[index] == html) {
            //alert("No change!");
            return;
        }
        fmtViewHistory[index] = html;

        $("h1#default", fmt_view_doc).hide();
        $("span#loading", fmt_view_doc).hide();

        Debug.log(hostname + ": " + list.length);
        var snippets = [];
        for (var i = 0; i < list.length; i++) {
            //Debug.log(hostname + ": " + $(list[i]).text());
            var elem = list[i];
            //if ($(elem).find("a").length == 0) continue;
            //if ($(elem).find("form").length > 0) continue;
            var snippet;
            if (typeof elem == 'string') {
                //alert(elem);
                snippet = elem;
            } else {
                snippet = $(elem).html();
            }
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
                .replace(/<a /ig, '<a target="_blank" ');
            //Debug.log(hostname + snippet);
            //snippet = snippet.replace(/[\w.?=&\/]{45,45}/g, "$1<wbr/>");
            if (isEmpty(snippet)) {
                //alert("It's empty!");
                continue;
            }
            snippets.push(snippet);
        }

        for (var i = 0; i < snippets.length; i++) {
            var snippet = snippets[i];
            var rows = $(".row", fmt_view_doc);
            if (rows[i] == undefined) {
                var tbodies = $("#content>tbody", fmt_view_doc);
                //alert(tbodies[0]);
                //Debug.log("appending row " + i + " for " + hostname);
                //alert($(rows[0]).parent()[0].tagName);
                var row_html;
                if (i == 0) {
                    row_html =
                    '<tr class="row">' +
                        '<td class="col-0"><img src="loading.gif" /></td>' +
                        '<td class="col-1"><img src="loading.gif" /></td>' +
                        '<td class="col-2"><img src="loading.gif" /></td>' +
                    '</tr>';
                } else {
                    row_html =
                    '<tr class="row">' +
                        '<td class="col-0" />' +
                        '<td class="col-1" />' +
                        '<td class="col-2" />' +
                    '</tr>';
                }
                $(tbodies[0]).parent().append(row_html);
                rows = $(".row", fmt_view_doc);
            }
            var cell = $(".col-" + index, rows[i])[0];
            cell.innerHTML = snippet;
        }
        if (! $("#enable-view-" + index)[0].checked) {
            $(".col-" + index, fmt_view_doc).hide();
        }
        if (snippets.length == 0) {
            //alert("Hey, here!");
            var cols = $(".col-" + index, fmt_view_doc);
            if (cols.length) {
                //alert("Empty doc: " + doc.contentType);
                cols.empty();
                $(cols[0]).html("Sorry, no results found :(");
            }
        }
        //fmtViewHistory = snippets;

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
        if (!fmt_view_doc.location) { return; }
        fmt_view_doc.location.hash = '#__top';
    }, 100);
}


