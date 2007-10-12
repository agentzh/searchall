var RootPath;
var CurPath;

var Patterns = {
    'www.baidu.cn'    : "tbody>tr>td.f",
    'www.baidu.com'   : "tbody>tr>td.f",
    'www.google.cn'   : "div.g[h2]",
    'www.google.com'  : "div.g[h2]",
    'www.yisou.com'   : "div.web>ol>li",
    'so.sohu.com'     : "body>div#content>div",
    'www.sogou.com'   : "body>div#content>div",
    'www.yahoo.cn'    : ".yst-web>ul>li[h3]",
    'so.163.com'      : 'body>div>div.r',
    'www.answers.com' : 'div.content',

    'search.yahoo.com': "div#yschweb>ol>li",
    'www.ask.com'     : "div#main>div#content>div#midRail>div#rpane>div#teoma-results>div",
    'www.a9.com'      : 'td#tdweb>div#bxweb>div#cweb>div.cscrollInfo>div.resBlock',

    'www.taobao.com'  : "div#ItemList>div#ListView>div.Item",
    'search1.taobao.com'  : "div#ItemList>div#ListView>div.Item",
    'search.taobao.com'   : "div#ItemList>div#ListView>div.Item",
    'addons.mozilla.org' : 'div#container>div#content>div.addon-listitem',
    'search.cpan.org' : "body>p[small]",
    'search.ebay.com' : "form#find>div.ebContainer>div#ebContent>div.ebFrame>table.adTest>tbody>tr>td>table.ebItemlist>tbody>tr.ebHlOdd",
    'www.amazon.com'  : 'table.searchresults>tbody>tr',

    'images.search.yahoo.com':  'div#yschbody>div#yschres>table#yschimg>tbody>tr>td',
    'images.google.com' : 'div#ImgContent>table>tbody>tr>td',
    'images.google.cn' : 'div#ImgContent>table>tbody>tr>td',
    'image.baidu.com' : "div#imgid>table.r1>tbody>tr>td",
    'image.baidu.cn'  : "div#imgid>table.r1>tbody>tr>td",
    'image.cn.yahoo.com': 'body.y>div#bd>div.yui-g>div.cnt>ul>li',
    'www.flickr.com' : 'table.DetailResults>tbody>tr'
};

var fmtViewHistory = ['0', '0', '0'];

function isEmpty (html) {
    var res = html.replace(/<\s*\/?\s*(\w+)[^>]*>|\s+/g, function (s, tag) {
        if (tag.toLowerCase() == 'img') {
            return s;
        } else {
            return '';
        }
    });
    return /^$/.test(res);
}

function findShortest (list) {
    var shortest;
    for (var i = 0; i < list.length; i++) {
        var s = list[i];
        if (shortest == undefined) {
            shortest = s;
        } else if (s.length < shortest.length) {
            shortest = s;
        }
    }
    return shortest;
}

function replacer (s, prefix, url) {
    //info("Found str: " + s);
    //info("Found prefix: " + prefix);
    //info("Found url: " + url);
    if ( /^\w+:\/\//.test(url) ) return s;
    if (url[0] == '/') {
        //alert("Hey!" + url);
        return prefix + RootPath + url;
    }
    return prefix + CurPath + url;
}

function rel2abs (html, loc) {
    RootPath = loc.protocol + "//" + loc.host;
    CurPath =  RootPath + loc.pathname.replace(/\/([^\/]*)$/, '/');
    //info("CurPath: " + CurPath);
    //info("RootPath: " + RootPath);
    html = html.replace(/(<[^>]+href\s*=\s*")([^"]+)/ig, replacer);
    //if (RootPath.match(/google/)) alert(html);
    return html;
}

function gen_fmt_view (index, hostname, doc, forceMining) {
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
                pattern = findShortest(patterns);
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
            return false;
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
    if (!browser) return false;
    var fmt_view_doc = browser.contentDocument;
    if (!fmt_view_doc) {
        Debug.log("WARNING: fmt_view_doc not found.");
        return false;
    }
    $("h1#default", fmt_view_doc).hide();
    //alert("Here!" + index);

    var html = $("body", doc).html();
    //info("XXX WWW" + html);
    //info("XXX QQQ" + fmtViewHistory[index]);
    if (fmtViewHistory[index] == html) {
        //alert("No change!");
        return false;
    }
    fmtViewHistory[index] = html;

    $("span#loading", fmt_view_doc).hide();

    Debug.log(hostname + ": " + list.length);
    //info("Path name: " + path);
    //alert(path);
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
            .replace(/<(\/?)tr[^>]*>/ig, '<$1p>')
            .replace(/<\/?td[^>]*>/ig, '&nbsp;')
            .replace(/<(\/?)th[^>]*>/ig, '<$1h3>')
            .replace(/<a /ig, '<a target="_blank" ');
        snippet = rel2abs(snippet, doc.location);
        //if (hostname.match(/answers/)) info(hostname + snippet);
        //snippet = snippet.replace(/[\w.?=&\/]{45,45}/g, "$1<wbr/>");
        if (isEmpty(snippet)) {
            //alert("It's empty!");
            continue;
        }
        snippets.push(snippet);
    }

    if (hostname.match('images.google')) {
        var tmp = [];
        for (var i = 0; i < snippets.length; i++) {
            var snip = snippets[i];
            if (snip == undefined) continue;
            if (snip.match(/<img/i)) {
                snip += '<br />' + snippets[i+3];
                snippets[i+3] = undefined;
            }
            tmp.push(snip);
        }
        snippets = tmp;
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
    setTimeout(function () {
        //alert("HEEEE!!!");
        $(".col-" + index + ">img", fmt_view_doc).hide();
    }, 500);

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
    if (!fmt_view_doc.location) { return true; }
    fmt_view_doc.location.hash = '#__top';
    return true;
}


