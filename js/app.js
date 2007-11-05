// Class SearchAll.App
// -- agentzh

if (typeof SearchAll == 'undefined') SearchAll = {};

SearchAll.App = function () {
    var page = $("page#searchall-page")[0];
    this.pageMode = (page != undefined);

    var listWidget = document.getElementById('dom-list');
    var textWidget = document.getElementById('dom');
    this.domLogger = new SearchAll.DomLogger(listWidget, textWidget);

    this.searchBox     = document.getElementById("search-box");
    this.searchButton  = document.getElementById("search-button");
    this.viewTabs      = document.getElementById("view-tabs");
    this.viewTabbox    = document.getElementById("view-tabbox");

    this.prevButton = document.getElementById("prev-button");
    this.nextButton = document.getElementById("next-button");

    this.progress = new SearchAll.Progress(3);
    this.progressmeter = document.getElementById("status-progress");
    this.timer = new SearchAll.Timer();

    this.fmtViews = [];
    this.threads = [];
    this.origViews = [];
    for (var i = 0; i < 3; i++) {
        this.threads[i] = new SearchAll.Thread(i);
        this.origViews[i] = new SearchAll.OrigView(i);
        this.fmtViews[i] = new SearchAll.FmtView(i);
    }

    this.shortcuts = {
        'www.google.com': ["http://www.google.com/search?q={searchTerms}"],
        'www.google.com/en': ["http://www.google.com/search?q={searchTerms}"],
        'www.google.cn': ["http://www.google.cn/search?q={searchTerms}"],
        'www.yahoo.cn': ['http://www.yahoo.cn/s?p={searchTerms}'],
        'www.baidu.com': ['http://www.baidu.com/s?wd={searchTerms}', 'GBK'],
        'www.baidu.cn': ['http://www.baidu.com/s?wd={searchTerms}', 'GBK'],
    };
};

