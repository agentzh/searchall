// Class SearchAll.Util
// -- agentzh

if (typeof SearchAll == 'undefined') SearchAll = {};

SearchAll.Util = {
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
    }
};

