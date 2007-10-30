// Class SearchAll.App
// -- agentzh

if (typeof SearchAll == 'undefined') SearchAll = {};

SearchAll.Thread = function (index) {
    this.id = "thr" + index;
    this.index = index;
    this.autoSubmit = false;
}

