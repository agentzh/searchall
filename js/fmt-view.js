// Class SearchAll.FmtView
// -- agentzh

if (typeof SearchAll == 'undefined') SearchAll = {};

SearchAll.FmtView = function (index) {
    if (index == undefined) {
        return null;
    }
    this.index = index;
};

SearchAll.FmtView.prototype = {
    patterns: {
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
        'www.flickr.com' : 'table.DetailResults>tbody>tr',
        'www.youtube.com' : 'div#mainContent>div>div.vEntry'
    },

    history: 0,
    document: null,
    curPath: null,  // XXX moved to SearchAll.OrgView.prototype
    rootPath: null, // ditto

    isEmpty: function (html) {
        var res = html.replace(
            /<\s*\/?\s*(\w+)[^>]*>|\s+/g,
            function (s, tag) {
                if (tag.toLowerCase() == 'img') {
                    return s;
                } else {
                    return '';
                }
            }
        );
        return /^$/.test(res);
    },

    findShortest: function (list) {
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
    },

    replacer: function (s, prefix, url, curPath, rootPath) {
        //info("Found str: " + s);
        //info("Found prefix: " + prefix);
        //info("Found url: " + url);
        if ( /^\w+:\/\//.test(url) ) return s;
        info("curPath (i): " + curPath);
        info("rootPath (i): " + rootPath);
        if (url[0] == '/') {
            //alert("Hey!" + url);
            return prefix + rootPath + url;
        }
        return prefix + curPath + url;
    },

    rel2abs: function (html, loc) {
        this.rootPath = loc.protocol + "//" + loc.host;
        this.curPath =  this.rootPath + loc.pathname.replace(/\/([^\/]*)$/, '/');
        //var rootPath = this.rootPath;
        //var curPath = this.curPath;
        //info("curPath: " + curPath);
        //info("rootPath: " + rootPath);
        var obj = this;
        html = html.replace(
            /(<[^>]+href\s*=\s*")([^"]+)/ig,
            function (s, prefix, url) {
                return obj.replacer(s, prefix, url, obj.curPath, obj.rootPath);
            }
        );
        //if (this.rootPath.match(/google/)) alert(html);
        return html;
    },

    extractUrl: function (html) {
        var regex = /href\s*=\s*"([^"]+)"/i;
        var match = regex.exec(html);
        if (match) {
            var url = match[1];
            if ( url.match(/javascript:void/) ) {
                html = html.replace(regex, '');
                match = regex.exec(html);
                if (match) {
                    var url = match[1];
                    return url;
                }
                return undefined;
                //alert("Here!" + match[2]);
            }
            return url;
        }
        return undefined;
    },

    regAjaxHandle: function (req, ln, col, timer, url) {
        var fmtDoc = this.document;
        req.onreadystatechange = function (aEvt) {
            if (req.readyState == 4) {
                clearTimeout(timer);
                var pattern = "#" + ln + "-" + col + ">img.status";
                var status;
                try {
                    status = req.status;
                } catch (e) {
                    //$(pattern, this.document).attr('src', "cross.png");
                    //alert(e);
                    $(pattern, fmtDoc).attr('src', "cross.png");
                    return;
                }
                if (status < 400) {
                    //alert("URL Exists! " + url + " " + ln + " : " + col);
                    $(pattern, fmtDoc).attr('src', "accept.png");
                } else if (status != 402 && status != 403 && status != 405 && status != 500) {
                    error("Bad status code: " + url + ": " + status);
                    $(pattern, fmtDoc).attr('src', "cross.png");
                    //alert("Hiya" + id);
                    //alert("405 found! " + pattern);
                    //$(pattern, this.document).attr('src', "about:blank");
                } else {
                    $(pattern, fmtDoc).attr('src', "weather_clouds.png");
                }
            }
        };
    },

    handleCheckTimeout: function (req, ln, col, timeout) {
        var fmtDoc = this.document;
        return setTimeout(function () {
            req.abort();
            //alert("Timout!" + ln + ":" + col);
            var pattern = "#" + ln + "-" + col + ">img.status";
            $(pattern, fmtDoc).attr('src', "clock_stop.png");
        }, timeout);
    }
};

SearchAll.FmtView.prototype.update = function (hostname, origDoc, forceMining) {
    if (this.document == null) {
        var browser = document.getElementById("fmt-view");
        if (!browser) return false;
        this.document = browser.contentDocument;
    }
    if (origDoc == null) {
        return;
    }

    var index = this.index;
    $("div.error", this.document).hide();
    var list = [];
    var pattern = this.patterns[hostname];
    if (!forceMining && pattern) {
        list = $(pattern, origDoc);
    } else {
        //if (list.length == 0) {
        //alert("Start to mine!");
        var count = 5;
        while (count >= 2) {
            var patterns = SearchAll.PatternMiner.mineDoc(origDoc, count, hostname);
            if (patterns.length > 0) {
                pattern = this.findShortest(patterns);
                //pattern = pattern.replace(/.*>([^>]+>[^>]+>[^>]+)$/, "$1");

                info("Selected: " + hostname + ": pattern: " + pattern);
                list = $(pattern, origDoc);
                this.patterns[hostname] = pattern;
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
    var len = html.length;
    if (this.history.length == len) {
        //alert("No change!");
        return false;
    }
    this.history.length = len;

    $("span#loading", this.document).hide();

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
            .replace(/<\/?td[^>]*>/ig, '&#160;')
            .replace(/<(\/?)th[^>]*>/ig, '<$1h3>')
            .replace(/<a /ig, '<a target="_blank" ');
        snippet = this.rel2abs(snippet, origDoc.location);
        //if (hostname.match(/answers/)) info(hostname + snippet);
        //snippet = snippet.replace(/[\w.?=&\/]{45,45}/g, "$1<wbr/>");
        if (this.isEmpty(snippet)) {
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

    var FoundFirebug = false;
    for (var i = 0; i < snippets.length; i++) {
        var snippet = snippets[i];
        var url = this.extractUrl(snippet);
        //alert(url);
        if (url) {
            try {
                var req = new XMLHttpRequest();
                req.open('HEAD', url, true);

                var timer = this.handleCheckTimeout(req, i, index, 5*1000);
                this.regAjaxHandle(req, i, index, timer, url);
                req.send(null);
            } catch (e) {
                if (!FoundFirebug) {
                    error(e);
                    $("div.error", this.document).show();
                }
                //error("Firebug conflicted with SearchAll's AJAX checking");
            }
        }
        info("[URL] " + hostname + ": URL: " + url);
        snippet = '<img class="status" src="bullet_yellow.png"/>&#160;&#160;<img src="' + this.rootPath + '/favicon.ico" alt=" "/>&#160;' + snippet;
        var rows = $(".row", this.document);
        if (rows[i] == undefined) {
            var tbodies = $("#content>tbody", this.document);
            //alert(tbodies[0]);
            //Debug.log("appending row " + i + " for " + hostname);
            //alert($(rows[0]).parent()[0].tagName);
            var row_html;
            if (i == 0) {
                row_html =
                '<tr class="row">' +
                    '<td id="0-0" class="col-0"><img class="loading" src="loading.gif" /></td>' +
                    '<td id="0-1" class="col-1"><img class="loading" src="loading.gif" /></td>' +
                    '<td id="0-2" class="col-2"><img class="loading" src="loading.gif" /></td>' +
                '</tr>';
            } else {
                row_html =
                '<tr class="row">' +
                    '<td id="' + i + '-0" class="col-0" />' +
                    '<td id="' + i + '-1" class="col-1" />' +
                    '<td id="' + i + '-2" class="col-2" />'
                '</tr>';
            }
            $(tbodies[0]).parent().append(row_html);
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
        if (cols.length) {
            //alert("Empty doc: " + origDoc.contentType);
            //$(".col-" + index + ">img.loading", this.document).hide();
            cols.empty();
            $(cols[0]).html("Sorry, no results found :(");
        }
    }
    setTimeout(function () {
        //alert("HEEEE!!!");
        $(".col-" + index + ">img.loading", this.document).hide();
    }, 500);

    //this.history = snippets;

    //showDOM(this.document, "DOM");
    //alert(html);

    //alert(index);
    //var fmt_view_col = $(".col-" + index, this.document)[0];
    //if (!fmt_view_col) {
        //Debug.log("WARNING: fmt_view_col " + index + " not found.");
        //return;
    //}

    //fmt_view_col.innerHTML = html;
    //Debug.log(this.document.innerHTML);
    if (!this.document.location) { return true; }
    this.document.location.hash = '#__top';
    return true;
};

