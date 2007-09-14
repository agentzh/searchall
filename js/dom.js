function dumpDOM () {
    if (arguments.length == 0)
        return "";
    var node = arguments[0];
    var indent = arguments[1] || '';
    if (!node) { // || typeof node.hasAttribute == 'undefined') {
        return node;
    }
    if (node.nodeType == Node.TEXT_NODE) {
        var val = node.nodeValue
            .replace(/^\s+|\s+$/g, '')
            .replace(/[\n\r]+/g, '')
            .replace(/\s\s+/g, ' ');
        if (val.length > 15)
            val = val.substr(0, 15) + "...";
        if (val == '') return '';
        return indent + '"' +  val + "\"\n";
    }

    var str = indent + node.nodeName.toLowerCase();
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
        str += dumpDOM(child, indent + "  ");
    }
    return str;
}

function showDOM (dom) {
    var textbox = $("#dom")[0];
    if (!textbox) return;
    textbox.value += "////////////////////////////////\n";
    textbox.value += dumpDOM(dom);
}

