// Class SearchAll.PatternMiner
// -- agentzh

if (typeof SearchAll == 'undefined') SearchAll = {};

SearchAll.PatternMiner = {
    hitCount: 0,
    hostname: undefined,

    mineDoc: function (doc, count, hostname) {
        if (typeof doc.getElementsByTagName == 'undefined') {
            //alert("HERE!");
            return [];
        }
        var body = doc.getElementsByTagName("body")[0];
        this.hostname = hostname;
        this.hitCount = 0;
        var patterns = this.mineNode(body, count, 'body>');
        //Debug.JJJ(patterns);
        return patterns;
    }
};

SearchAll.PatternMiner.mineNode = function (node, count, prefix) {
    //alert(node);
    prefix = prefix || '';
    var list = node.childNodes;
    if (!node) {
        alert(prefix + node);
        return [];
    }
    var categories = [];
    var locator = '';
    var elems = [];
    var samples = {};
    var matchedElems = {};
    for (var i = 0; i < list.length; i++) {
        var elem = list[i];
        if (elem.nodeType != Node.ELEMENT_NODE)
            continue;
        //info(this.hostname + ": locator: " + locator);

        var seq = this.computeSeq(elem);
        //info(this.hostname + ": seq: " + seq);

        if (!seq || ! (/\+.*\+.*\+/.test(seq))) {
            //alert(tagName + ": " + seq);
            continue;
        }
        samples[seq] += "[" + seq + "] " + $(elem).text() + "\n\n";
        matchedElems[seq] = elem;
        category = categories.filter(
            function (c) { return c[0] == seq; }
        )[0];
        if (!category) {
            // create a new category:
            categories.push([seq]);
        } else {
            category.push(seq);
        }
        elems.push(elem);
    }
    //alert("elems: " + elems.length);
    //if (this.hostname == 'www.yisou.com')
        //info(this.hostname + ": Categories:\n" + Dumper(categories));
    var retvals = [];

    var hits = categories.filter(function (e) {
        return e.length >= count;
    });
    if (hits.length > 0) {
        this.hitCount++;
        var seq = hits[0][0];
        //info(this.hostname + ": hits:\n" + Dumper(hits));
        var pattern = this.genSelector(matchedElems[seq]);
        retvals.push(pattern);
        info(this.hostname + ": pattern:\n" + pattern);
        //info(this.hostname + ": sample:\n" + Dumper(samples[seq]));

    } else {
        for (var i = 0; i < elems.length; i++) {
            var elem = elems[i];
            //alert(i + ": " + elem);
            //alert(i + ": " + elem.nodeType);
            var more = retvals.concat(this.mineNode(elem, count, prefix + locator + ">"));
            //if (more.length > 0)
                //alert("Found more!");
            retvals = retvals.concat(more);
        }
    }
    return retvals;
};

SearchAll.PatternMiner.genSelector = function (node) {
    var selector = '';
    while (true) {
        if (node == null) break;
        if (node != null) {
            var tagId = node.getAttribute('id');
            var tagName = node.tagName.toLowerCase();
            var tagClass = node.getAttribute('class');
            if (tagClass) {
                tagClass = tagClass.split(/\s+/)[0];
            } else {
                tagClass = "";
            }
            var locator = tagName;
            if (selector != '' && tagId && /^[-\w]+$/.test(tagId))
                locator += "#" + tagId;
            else if (tagClass && /^[-\w]+$/.test(tagClass))
            locator += "." + tagClass;

            if (selector != '')
                selector = locator + ">" + selector;
            else
                selector = locator;
        }
        if (node.tagName == 'BODY') break;
        node = node.parentNode;
    }
    return selector;
};

SearchAll.PatternMiner.computeSeq = function (node) {
    var html = $(node).html();
    var s = '';
    var tagRe = /<(\/?)\s*(\w+)[^>]*>|<()(\w+)\s*(\/)\s*>/g;
    while ((matches = tagRe.exec(html)) != null) {
        var before = matches[1];
        var tag    = matches[2].toLowerCase();
        var after  = matches[3];
        if (/^(?:[biu]|\d+|nobr|wbr|br|span|font|small|big|em|strong|dfn|code|samp|kbd|var|cite|basefont|img|applet|script|noscript|map|area|tt|trike|big|sub|sup)$/.test(tag))
            continue;
        //info(this.hostname + ": tag: " + tag);
        //info(this.hostname + ": before: " + before);
        //info(this.hostname + ": after: " + after);
        if (before)
            s += "-" + tag;
        else if (after)
            s += "+" + tag + "-" + tag;
        else
            s += "+" + tag;
    }
    return s;
};

