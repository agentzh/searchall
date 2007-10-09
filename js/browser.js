
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
        var forms = this.find('form[input:text]');
        this._form = forms[0];
        return this._form;
    },
    textbox: function () {
        this.form();
        var nodes = $("input[@type=text]", this._form);
        if (nodes.length == 0)
            error("textbox not found!");
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
        var textboxes = this.textbox();
        textboxes.val(query);
        textboxes.blur();
        myTimer.start(this.hostname());
        //delete top.location;
        top.watch("location", watchAssignment);
        top.location.watch("href", watchAssignment);
        //var buttons = this.button();
        /*
        try {
            buttons[0].click();
        } catch (e) {
            buttons.click();
        }
        */
        var textbox = textboxes[0];
        info("Sent the enter key: " + sendKey('enter', textbox));
    },
};

function watchAssignment (id, oldval, newval) {
    //alert("o." + id + " changed from "
        //+ oldval + " to " + newval);
    throw("abc");
    //return '#';
}

