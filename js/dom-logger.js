// Class SearchAll.DomLogger
// -- agentzh

if (typeof SearchAll == 'undefined') SearchAll = {};

SearchAll.DomLogger = function (listWidget, textWidget) {
    this.domTable = {};
    this.listWidget = listWidget;
    this.textWidget = textWidget;
    var logger = this;
    $(listWidget).select(function () {
        //alert(this);
        var label = this.selectedItem.label;
        //alert(label);
        textWidget.value = logger.domTable[label];
    });
};

SearchAll.DomLogger.prototype.log = function (dom, desc) {
    if (!desc) {
        var time = new Date().getTime();
        desc = time;
    }
    var label = desc;
    var i = 1;
    while (this.domTable[label]) {
        i++;
        label = desc + "-" + i;
    }
    this.listWidget.appendItem(label, label);
    var str = SearchAll.Dom.dump(dom);
    this.domTable[label] = str;
    this.textWidget.value = str;
}

