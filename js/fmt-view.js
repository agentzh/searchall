// Class SearchAll.FmtView
// -- agentzh

if (typeof SearchAll == 'undefined') SearchAll = {};

SearchAll.FmtView = function (index) {
    if (index == undefined) {
        return null;
    }
    this.index = index;
    this.browser = document.getElementById("fmt-view");
    this.prevHtmlLen = 0;
    this.prevResults = [];
};

SearchAll.patterns = {
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
        //'search.cpan.org' : "body>p[small]",
        'search.ebay.com' : "form#find>div.ebContainer>div#ebContent>div.ebFrame>table.adTest>tbody>tr>td>table.ebItemlist>tbody>tr.ebHlOdd",
        'www.amazon.com'  : 'table.searchresults>tbody>tr',

        'images.search.yahoo.com':  'div#yschbody>div#yschres>table#yschimg>tbody>tr>td',
        'images.google.com' : 'div#ImgContent>table>tbody>tr>td',
        'images.google.cn' : 'div#ImgContent>table>tbody>tr>td',
        'image.baidu.com' : "div#imgid>table.r1>tbody>tr>td",
        'image.baidu.cn'  : "div#imgid>table.r1>tbody>tr>td",
        'image.cn.yahoo.com': 'body.y>div#bd>div.yui-g>div.cnt>ul>li',
        'www.flickr.com' : 'table.DetailResults>tbody>tr',
        'www.youtube.com' : 'div#mainContent>div>div.vEntry'
};

SearchAll.FmtView.prototype = {
    curPath: null,  // XXX moved to SearchAll.OrgView.prototype
    rootPath: null, // ditto
    get document () {
        return this.browser.contentDocument;
    },
    reset: function () {
        //this.prevHtmlLen = 0;
        this.prevResults = [];
    }
};

SearchAll.FmtView.prototype.update = function (hostname, origDoc, forceMining) {
    //var origView = app.origViews[this.index];
    //origDoc = origView.document();
    //hostname = origView.hostname();

    if (origDoc == null) {
        return;
    }

    var Util = SearchAll.Util;  // namespace alias
    var index = this.index;
    var thread = app.threads[index];
    $("div.error", this.document).hide();
    var list = [];
    var pattern = SearchAll.patterns[hostname];
    if (!forceMining && pattern) {
        list = $(pattern, origDoc);
    } else {
        //if (list.length == 0) {
        //alert("Start to mine!");
        var count = 5;
        while (count >= 2) {
            var patterns = SearchAll.PatternMiner.mineDoc(origDoc, count, hostname);
            if (patterns.length > 0) {
                //alert("Got patterns!");
                pattern = Util.findShortest(patterns);
                //pattern = pattern.replace(/.*>([^>]+>[^>]+>[^>]+)$/, "$1");

                info("Selected: " + hostname + ": pattern: " + pattern);
                list = $(pattern, origDoc);
                SearchAll.patterns[hostname] = pattern;
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

    $("h1#default", this.document).hide();
    //alert("Here!" + index);

    var html = $("body", origDoc).html();
    //info("XXX WWW" + html);
    //info("XXX QQQ" + this.history[index]);
    var len;
    try {
        len = html.length;
    } catch (e) {
    }
    if (!forceMining && this.prevHtmlLen == len) {
        //alert("No change!");
        info("fmt view gen: No change for " + index);
        return false;
    }
    this.prevHtmlLen = html.length;

    $("span#loading", this.document).hide();

    Debug.log(hostname + ": " + list.length);
    var loc = origDoc.location;
    var rootPath = loc.protocol + "//" + loc.host;
    var curPath =  rootPath + loc.pathname.replace(/\/([^\/]*)$/, '/');
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
            .replace(/<\/?td[^>]*>/ig, '&#160;')
            .replace(/<(\/?)th[^>]*>/ig, '<$1h3>')
            .replace(/<a /ig, '<a target="_blank" ');

        snippet = Util.rel2abs(snippet, rootPath, curPath);
        //if (hostname.match(/answers/)) info(hostname + snippet);
        //snippet = snippet.replace(/[\w.?=&\/]{45,45}/g, "$1<wbr/>");
        if (Util.isEmpty(snippet)) {
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

    var imgs = $(".col-" + index + ">img.loading", this.document);
    //var status = imgs.css('display');
    //info("My status: " + status + " " + imgs.length);

    if (!forceMining && !thread.final && imgs.length == 0  && this.prevResults.length >= snippets.length) {
        info("Rejected bogus results");
        return false;
    }
    var prevResultsLen = this.prevResults.length;
    this.prevResults = snippets;

    var FoundFirebug = false;
    for (var i = 0; i < snippets.length; i++) {
        var snippet = snippets[i];
        var url = Util.extractUrl(snippet);
        //alert(url);
        if (url) {
            try {
                var selector = '#' + i + "-" + index + ">img.status";
                SearchAll.LinkTester.test(url, this.document, selector, 5*1000);
            } catch (e) {
                if (!FoundFirebug) {
                    error(e);
                    $("div.error", this.document).show();
                }
                //error("Firebug conflicted with SearchAll's AJAX checking");
            }
        }
        //info("[URL] " + hostname + ": URL: " + url);
        snippet = '<img class="status" src="bullet_yellow.png"/>&#160;&#160;<img src="' + rootPath + '/favicon.ico" alt=" "/>&#160;' + snippet;
        var rows = $(".row", this.document);
        if (rows[i] == undefined) {
            this.createRow(i);
            rows = $(".row", this.document);
        }
        var cell = $(".col-" + index, rows[i])[0];
        cell.innerHTML = snippet;
    }
    if (! $("#enable-view-" + index)[0].checked) {
        $(".col-" + index, this.document).hide();
    }
    if (snippets.length == 0) {
        //alert("Hey, here!");
        var cols = $(".col-" + index, this.document);
        if (cols.length == 0) {
            this.createRow(0);
            cols = $(".col-" + index, this.document);
        }
        if (cols.length && thread.final) {
            //alert("Empty doc: " + origDoc.contentType);
            //$(".col-" + index + ">img.loading", this.document).hide();
            cols.empty();
            $(cols[0]).html("<p>Sorry, no results found :(</p>" +
                '<p><a class="force-mining" href="javascript:void();">' +
                "Try mining the original view" +
                '</a><p>');
            $("a.force-mining", cols[0]).click( function () {
                //alert("Hey!");
                app.fmtViews[index].update(hostname, origDoc, true);
                this.className = '';
                return false;
            } );
        }
    }
    app.setTimeout(function () {
        //alert("HEEEE!!!");
        $(".col-" + index + ">img.loading", this.document).hide();
    }, 500);

    if (!this.document.location) { return true; }
    //alert(prevResultsLen);
    if (prevResultsLen == 0)
        this.document.location.hash = '#__top';
    return true;
};

SearchAll.FmtView.prototype.createRow = function (i) {
    var tbodies = $("#content>tbody", this.document);
    //alert(tbodies[0]);
    //Debug.log("appending row " + i);
    //alert($(rows[0]).parent()[0].tagName);
    var rowHtml;
    if (i == 0) {
        rowHtml =
        '<tr class="row">' +
            '<td id="0-0" class="col-0"><img class="loading" src="loading.gif" /></td>' +
            '<td id="0-1" class="col-1"><img class="loading" src="loading.gif" /></td>' +
            '<td id="0-2" class="col-2"><img class="loading" src="loading.gif" /></td>' +
        '</tr>';
    } else {
        rowHtml =
        '<tr class="row">' +
            '<td id="' + i + '-0" class="col-0" />' +
            '<td id="' + i + '-1" class="col-1" />' +
            '<td id="' + i + '-2" class="col-2" />'
        '</tr>';
    }
    $(tbodies[0]).parent().append(rowHtml);
};

