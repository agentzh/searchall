// Class SearchAll.LinkTester
// -- agentzh

if (typeof SearchAll == 'undefined') SearchAll = {};

SearchAll.LinkTester = {
    testers: {},
    regAjaxHandle: function (req, doc, selector, timer, url) {
        this.testers[selector] = url;
        var self = this;
        req.onreadystatechange = function (aEvt) {
            if (typeof app == 'undefined' || app == null) return;
            if (req.readyState == 4) {
                if (self.testers[selector] != url) {
                    // out-dated tester:
                    //alert("Out-dated tester found in ready state!");
                    clearTimeout(timer);
                    return;
                }

                clearTimeout(timer);
                self.testers[selector] = null;

                var status;
                try {
                    status = req.status;
                } catch (e) {
                    //alert(e);
                    $(selector, doc).attr('src', "cross.png");
                    return;
                }
                if (status < 400) {
                    //alert("URL Exists! " + url + " " + ln + " : " + col);
                    $(selector, doc).attr('src', "accept.png");
                } else if (status != 402 && status != 403 && status != 405 && status != 500) {
                    //error("Bad status code: " + url + ": " + status);
                    $(selector, doc).attr('src', "cross.png");
                    //alert("Hiya" + id);
                } else {
                    $(selector, doc).attr('src', "weather_clouds.png");
                }
            }
        };
    },

    handleCheckTimeout: function (req, doc, selector, timeout, url) {
        var self = this;
        return app.setTimeout(function () {
            if (self.testers[selector] != url) {
                // out-dated tester:
                //alert("Out-dated tester found in timeout state!");
                return;
            }

            self.testers[selector] = null;
            req.abort();
            //alert("Timout!" + ln + ":" + col);
            $(selector, doc).attr('src', "clock_stop.png");
        }, timeout);
    },

    test: function (url, doc, selector, timeout) {
        var req = new XMLHttpRequest();
        req.open('HEAD', url, true);

        var timer = this.handleCheckTimeout(req, doc, selector, timeout, url);
        this.regAjaxHandle(req, doc, selector, timer, url);
        req.send(null);
    }
};

