// Class SearchAll.Util
// -- agentzh

if (typeof SearchAll == 'undefined') SearchAll = {};

SearchAll.Util = {
    trimURI: function (url) {
        //url.replace(/\bindex\.\w+$/, '');
        //url.replace(/^https?:\/\//, '');
        url.replace(/\/+$/g, '');
        return url;
    },
    encodeQuery: function (query, charset) {
        const DEFAULT_QUERY_CHARSET = 'UTF-8';
        var textToSubURI = Cc["@mozilla.org/intl/texttosuburi;1"].
                        getService(Ci.nsITextToSubURI);
        var data = "";
        try {
            data = textToSubURI.ConvertAndEscape(charset, query);
        } catch (ex) {
            error("getSubmission: Falling back to default queryCharset!");
            data = textToSubURI.ConvertAndEscape(DEFAULT_QUERY_CHARSET, query);
        }
        return data;
    },
    url2hostname: function (url) {
        return url.replace(/^https?:\/\//, '')
           .replace(/\/.*/, '');
    },
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

    replacer: function (s, prefix, url, rootPath, curPath) {
        //info("Found str: " + s);
        //info("Found prefix: " + prefix);
        //info("Found url: " + url);
        if ( /^\w+:\/\//.test(url) ) return s;
        //info("curPath (i): " + curPath);
        //info("rootPath (i): " + rootPath);
        if (url[0] == '/') {
            //alert("Hey!" + url);
            return prefix + rootPath + url;
        }
        return prefix + curPath + url;
    },

    rel2abs: function (html, rootPath, curPath) {
        //var rootPath = this.rootPath;
        //var curPath = this.curPath;
        //info("curPath: " + curPath);
        //info("rootPath: " + rootPath);
        var obj = this;
        html = html.replace(
            /(<[^>]+href\s*=\s*")([^"]+)/ig,
            function (s, prefix, url) {
                return obj.replacer(s, prefix, url, rootPath, curPath);
            }
        );
        //if (this.rootPath.match(/google/)) alert(html);
        return html;
    },

    extractUrl: function (html, lastOnly) {
        var regex;
        //info("lastOnly: " + lastOnly);
        if (lastOnly) {
            //info("ask.com HTML: " + html);
            regex = /[\s\S]+href\s*=\s*"([^"]+)"/i;
        } else {
            regex = /href\s*=\s*"([^"]+)"/i;
        }
        var match = regex.exec(html);
        if (match) {
            var url = match[1];
            if (lastOnly) {
                return url;
            }
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
    }
};

