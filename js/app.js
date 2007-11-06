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

    // The following SE's need POST for shortcuts:
    // taobao, image.baidu.com, amazon
    this.shortcuts = {
        'www.google.com': ["http://www.google.com/search?q={searchTerms}"],
        'www.google.com/en': ["http://www.google.com/search?q={searchTerms}"],
        'www.google.cn': ["http://www.google.cn/search?q={searchTerms}"],
        'www.yahoo.cn': ['http://www.yahoo.cn/s?p={searchTerms}'],
        'www.baidu.com': ['http://www.baidu.com/s?wd={searchTerms}', 'GBK'],
        'www.baidu.cn': ['http://www.baidu.com/s?wd={searchTerms}', 'GBK'],
        'www.a9.com': ['http://www.a9.com/{searchTerms}'],
        'search.cpan.org': ['http://search.cpan.org/search?query=Perl&mode=all'],
        'www.ask.com': ['http://www.ask.com/web?q={searchTerms}'],
        'www.sogou.com': ['http://www.sogou.com/web?query={searchTerms}', 'GBK'],
        'www.yisou.com': ['http://www.yisou.com/search:{searchTerms}'],
        'so.163.com': ['http://so.163.com/search.php?q={searchTerms}', 'GBK'],
        'www.answers.com': ['http://www.answers.com/{searchTerms}'],
        'search.yahoo.com': ['http://search.yahoo.com/search?p={searchTerms}'],
        'search.ebay.com': ['http://search.ebay.com/{searchTerms}'],
        'addons.mozilla.org/search': ['https://addons.mozilla.org/search?q={searchTerms}'],
        'image.cn.yahoo.com': ['http://image.cn.yahoo.com/search?p={searchTerms}', 'GBK'],
        'images.google.cn': ['http://images.google.cn/images?q={searchTerms}'],
        'images.google.com': ['http://images.google.com/images?q={searchTerms}'],
        'images.search.yahoo.com': ['http://images.search.yahoo.com/search/images?p={searchTerms}&ei=UTF-8'],
        'www.youtube.com': ['http://www.youtube.com/results?search_query={searchTerms}&search=Search'],
        'www.flickr.com': ['http://www.flickr.com/search/?q={searchTerms}'],
        'www.flickr.com/search': ['http://www.flickr.com/search/?q={searchTerms}'],
    };
};

