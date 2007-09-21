var Browser = function (a) {
    return this.init(a);
};

Browser.fn = Browser.prototype = {
    init: function (a) {
        var browser;
        if (typeof a == "string")
            browser = $(a)[0];
        else
            browser = a;
        if (!browser) {
            error("browser not found");
            return;
        }
        this.browser = browser;
        this.id = browser.getAttribute('id');
        //this.browser = $("#browser-1");
        //error(typeof browser);
        return this;
    },
    uri: function () {
        return this.browser.currentURI;
    },
    find: function (p, c) {
        var p = c || this.document();
        return $(p, c);
    },
    form: function () {
        var forms = this.find("form[input:text]");
        if (forms.length == 0)
            error("No form found!");
        return forms;
    },
    textbox: function () {
        var nodes = $("input[@type=text]", this.form());
        if (nodes.length == 0)
            error("textbox not found!");
        return nodes;
    },
    button: function () {
        var nodes = $("input[@type=submit]", this.form());
        if (nodes.length == 0)
            nodes = $("button", this.form());
        //if (nodes.length == 0)
            //error("button not found!");
        return nodes;
    },
    goHome: function (newHome) {
        Replies = {};
        myProgress.reset(1);
        if (newHome) this.browser.homePage = newHome;
        myTimer.start(this.hostname());
        progressmeters.show();
        progressmeters[0].value = 50;
        return this.browser.goHome();
    },
    document: function () {
        return this.browser.contentDocument;
    },
    window: function () {
        return this.browser.contentWindow;
    },
    hostname: function () {
        return this.browser.homePage
            .replace(/^http:\/\//, '')
            .replace(/\/.*/, '');
    },
    doSearch: function (query) {
        //showDOM(this.document());
        //this.goHome();
        this.textbox().val(query);
        this.textbox().blur();
        myTimer.start(this.hostname());
        this.button().click();
    },
};

