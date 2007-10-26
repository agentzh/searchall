if (typeof SearchAll == 'undefined') SearchAll = {};
if (typeof SearchAll.Dom == 'undefined') SearchAll.Dom = {};

SearchAll.Dom.dump = function (node, indent, isLast) {
    var indent = indent || '';
    var prefix;
    if (isLast) {
        prefix = indent.replace(/\|\s+$/, '`-- ');
        indent = indent.replace(/\|\s+$/, '    ');
    } else {
        prefix = indent.replace(/\s+$/, '-- ');
    }

    if (!node)
        return "";

    if (node.nodeType == Node.TEXT_NODE) {
        var val = node.nodeValue
            .replace(/^\s+|\s+$/g, '')
            .replace(/[\n\r]+/g, '')
            .replace(/\s\s+/g, ' ');
        if (val.length > 15)
            val = val.substr(0, 35) + "...";
        if (val == '') return '';
        return prefix + '"' +  val + "\"\n";
    }

    var str = prefix + node.nodeName.toLowerCase();
    var attrs = [];
    if (node.nodeType == Node.ELEMENT_NODE) {
        if (node.hasAttribute('id'))
            attrs.push("id=" + node.getAttribute('id'));
        if (node.hasAttribute('class'))
            attrs.push('class=' + node.getAttribute('class'));
        if (node.nodeName == 'INPUT') {
            attrs.push('type=' + node.type);
            if (node.hasAttribute('name') && ! node.name.match(/^\s*$/))
                attrs.push('name=' + node.name);
            if (node.hasAttribute('value') && ! node.value.match(/^\s*$/))
                attrs.push('value=' + node.value);
            if (node.hasAttribute('title') && ! node.title.match(/^\s*$/))
                attrs.push('title=' + node.title);
        }
        if (attrs.length > 0)
            str += ' [' + attrs.join(" ") + "]";
    }
    str += "\n";

    var children = node.childNodes;
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (i == children.length - 1)
            str += SearchAll.Dom.dump(child, indent + "|    ", 1);
        else
            str += SearchAll.Dom.dump(child, indent + "|    ", 0);
    }
    return str;
}

