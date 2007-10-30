// Class SearchAll.FmtView
// -- agentzh

if (typeof SearchAll == 'undefined') SearchAll = {};

SearchAll.LinkTester = {
    regAjaxHandle: function (req, doc, selector, timer, url) {
        req.onreadystatechange = function (aEvt) {
            if (req.readyState == 4) {
                clearTimeout(timer);
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

    handleCheckTimeout: function (req, doc, selector, timeout) {
        return setTimeout(function () {
            req.abort();
            //alert("Timout!" + ln + ":" + col);
            $(selector, doc).attr('src', "clock_stop.png");
        }, timeout);
    },

    test: function (url, doc, selector, timeout) {
        var req = new XMLHttpRequest();
        req.open('HEAD', url, true);

        var timer = this.handleCheckTimeout(req, doc, selector, timeout);
        this.regAjaxHandle(req, doc, selector, timer, url);
        req.send(null);
    }
};

