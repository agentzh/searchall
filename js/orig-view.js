// Class SearchAll.OrigView
// -- agentzh

if (typeof SearchAll == 'undefined') SearchAll = {};

var FailureCount = 0;

SearchAll.OrigView = function (index) {
    return this.init(index);
};

SearchAll.OrigView.prototype = {
    init: function (index) {
        var browser = document.getElementById("browser-" + index);
        if (!browser) return null;
        this.browser = browser;
        this.id = browser.getAttribute('id');
        this.index = index;
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
        var forms = this.find('form[input:text]');
        this._form = forms[0];
        return this._form;
    },
    stop: function () {
        this.browser.stop();
    },
    textbox: function () {
        this.form();
        var nodes = $("input[@type=text]", this._form);
        //if (nodes.length == 0)
            //error("textbox not found!");
        return nodes;
    },
    button: function () {
        this.form();
        var nodes = $("input[@type=submit]", this._form);
        if (nodes.length == 0)
            nodes = $("button", this._form);
        //if (nodes.length == 0)
            //error("button not found!");
        if (nodes.length == 0) {
            nodes = $(this._form);
        }
        return nodes;
    },
    homePage: function () {
        return this.browser.homePage;
    },
    goHome: function (newHome) {
        app.progress.reset(1);
        if (newHome) this.browser.homePage = newHome;
        SearchAll.app.timer.start(this.hostname());
        //$(app.progressmeter).show();
        //app.progressmeter.value = 50;
        this.browser.stop();

        if (/yahoo|google|baidu|woopie\.jp/.test(newHome)) {
            this.browser.docShell.allowJavascript = false;
        } else {
            this.browser.docShell.allowJavascript = true;
        }

        return this.browser.goHome(home);
    },
    document: function () {
        return this.browser.contentDocument;
    },
    window: function () {
        return this.browser.contentWindow;
    },
    hostname: function () {
        return SearchAll.Util.url2hostname(this.browser.homePage);
    },
    doSearch: function (query) {
        //showDOM(this.document());
        //this.goHome();
        var textboxes = this.textbox();
        textboxes.val(query);
        //textboxes.blur();
        SearchAll.app.timer.start(this.hostname());
        //delete top.location;
        //var buttons = this.button();
        /*
        try {
            buttons[0].click();
        } catch (e) {
            buttons.click();
        }
        */
        var textbox = textboxes[0];
        this.browser.stop();
        var obj = this;
        if (!textbox && FailureCount <= 3) {
            FailureCount++;
            app.setTimeout(function () {
                info("Retrying doSearch..." + FailureCount);
                obj.doSearch(query);
            }, 1000);
        } else {
            try {
                info("Sent the enter key: " + sendKey('enter', textbox));
                FailureCount = 0;
            } catch (e) {
                FailureCount++;
                if (FailureCount > 3) { return; }
                app.setTimeout(function () {
                    info("Retrying doSearch..." + FailureCount);
                    obj.doSearch(query);
                }, 2000);
            }
        }
    }
};

