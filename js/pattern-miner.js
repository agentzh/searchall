var HitsCount;
var Hostname;

function mine_pattern (doc, count, hostname) {
    var body = $("body", doc)[0];
    Hostname = hostname;
    HitsCount = 0;
    var patterns = mine_node(body, count, 'body>');
    //Debug.JJJ(patterns);
    return patterns;
}

function mine_node (node, count, prefix) {
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
    var matched_elems = {};
    for (var i = 0; i < list.length; i++) {
        var elem = list[i];
        if (elem.nodeType != Node.ELEMENT_NODE)
            continue;
        //info(Hostname + ": locator: " + locator);

        var seq = compute_seq(elem);
        //info(Hostname + ": seq: " + seq);

        if (!seq || ! (/\+.*\+.*\+/.test(seq))) {
            //alert(tagName + ": " + seq);
            continue;
        }
        samples[seq] += "[" + seq + "] " + $(elem).text() + "\n\n";
        matched_elems[seq] = elem;
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
    //if (Hostname == 'www.yisou.com')
        //info(Hostname + ": Categories:\n" + Dumper(categories));
    var retvals = [];

    var hits = categories.filter(function (e) {
        return e.length >= count;
    });
    if (hits.length > 0) {
        HitsCount++;
        var seq = hits[0][0];
        //info(Hostname + ": hits:\n" + Dumper(hits));
        var pattern = genPattern(matched_elems[seq]);
        retvals.push(pattern);
        info(Hostname + ": pattern:\n" + pattern);
        //info(Hostname + ": sample:\n" + Dumper(samples[seq]));

    } else {
        for (var i = 0; i < elems.length; i++) {
            var elem = elems[i];
            //alert(i + ": " + elem);
            //alert(i + ": " + elem.nodeType);
            var more = retvals.concat(mine_node(elem, count, prefix + locator + ">"));
            //if (more.length > 0)
                //alert("Found more!");
            retvals = retvals.concat(more);
        }
    }
    return retvals;
}

function genPattern (node) {
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
}

function compute_seq (node) {
    var html = $(node).html();
    var s = '';
    var tagRe = /<(\/?)\s*(\w+)[^>]*>|<()(\w+)\s*(\/)\s*>/g;
    while ((matches = tagRe.exec(html)) != null) {
        var before = matches[1];
        var tag    = matches[2].toLowerCase();
        var after  = matches[3];
        if (/^(?:[biu]|\d+|nobr|wbr|br|span|font|small|big|em|strong|dfn|code|samp|kbd|var|cite|basefont|img|applet|script|noscript|map|area|tt|trike|big|sub|sup)$/.test(tag))
            continue;
        //info(Hostname + ": tag: " + tag);
        //info(Hostname + ": before: " + before);
        //info(Hostname + ": after: " + after);
        if (before)
            s += "-" + tag;
        else if (after)
            s += "+" + tag + "-" + tag;
        else
            s += "+" + tag;
    }
    return s;
}

