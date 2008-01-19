// Class SearchAll.MapView
// -- agentzh

if (typeof SearchAll == 'undefined') SearchAll = {};

SearchAll.MapView = function () {
    this.browser = document.getElementById('map-view');
};

SearchAll.MapView.prototype = {
    timeouts: [],
    prevHtmlLens: [0, 0, 0],
    prevUrlHash: {},

    _document: null,
    _canvas: null,

    //matchedNodeColor: '#FD0',
    //normalNodeColor: '#6C0',

    reset: function () {
        for (var i = 0; i < this.timeouts.length; i++) {
            clearTimeout(this.timeouts[i]);
        }
        this.timeouts = [];
        this.prevUrlHash = {};
        $("a", this.document).remove(".temp");
    },

    get document () {
        if (!this._document)
            this._document = this.browser.contentDocument;
        return this._document;
    },

    get canvas () {
        if (!this._canvas)
            this._canvas = this.document.getElementById('mapping');
        return this._canvas;
    },

    update: function () {
        var shouldUpdate = false;
        for (var i = 0; i < 3; i++) {
            var curHtmlLen = app.fmtViews[i].prevHtmlLen;
            if (curHtmlLen != this.prevHtmlLens[i]) {
                shouldUpdate = true;
                this.prevHtmlLens[i] = curHtmlLen;
            }
        }
        if (!shouldUpdate) {
            info("No update to the Mapping View.");
            return false;
        }
        this.reset();
        info("Updating the Mapping View...");
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        $("img#loading", this.document).show();
        for (var i = 0; i < 3; i++)
            this.drawIcon(ctx, i);

        for (var i = 0; i < 3; i++)
            this.timeouts.push(this.asyncUpdateThread(ctx, i));
        return true;
    },

    drawIcon: function (ctx, index) {
        var path = app.fmtViews[index].favicon;
        var hostname = app.fmtViews[index].hostname;
        //var img = new Image();
        //var xStep = 200;
        //var x = 10 + index * xStep;
        $("#favicon-" + index, this.document).attr("src", path).attr("title", hostname);
        //alert(path);
    },

    asyncUpdateThread: function (ctx, index) {
        var mapView = this;
        return app.setTimeout( function () {
            mapView.updateThread(ctx, index);
        }, 0);
    },

    updateThread: function (ctx, index) {
        var urls = app.fmtViews[index].URIs;
        var radius = 10;
        var xStep = 200;
        var yStep = 10;
        var prevSeq = null;
        if (index - 1 >= 0)
            prevSeq = app.fmtViews[index - 1].URIs;
        var x = 10 + index * xStep;
        var y = 40;;
        var util = SearchAll.Util;
        var x2 = 10 + (index-1) * xStep;
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            y +=  radius * 2 + yStep;
            var hit = false;
            if (prevSeq) {
                var j = this.prevUrlHash[url];
                if (j != null) {
                    var prevURI = prevSeq[j];
                    if (util.trimURI(prevURI) == util.trimURI(url)) {
                        //info("Found equivalent URLs: " + prevURI + " <=> "
                            //+ url);
                        var y2 = 40 + (radius * 2 + yStep) * (j + 1);
                        this.drawLine(ctx, x, y, x2, y2);
                        //ctx.fillStyle = this.matchedNodeColor;
                        this.drawBall(ctx, x2, y2, 'matched', prevURI);
                        hit = true;
                       //ctx.moveTo(x2, y2);
                    }
                }
            }
            this.drawBall(ctx, x, y, hit ? 'matched' : 'normal', url);
            this.prevUrlHash[url] = i;
            $("img#loading", this.document).hide();
        }
    },

    drawBall: function (ctx, x, y, type, url) {
        var doc = this.document;
        var ball = $("a.ball", doc);
        var body = $("body", doc);
        var myBall = ball.clone().appendTo(body)
            .find("img").attr('src', type + '-ball.png').show().css(
                { position: 'absolute',
                  top: y + 'px',
                  left: 50 + x + 'px',
                  'border-style': 'none'
                }
            ).attr( { title: url, tooltip: url } ).parent().attr(
                { class: 'temp', 'href': url, target: '_blank' });
        return;
    },

    drawLine: function (ctx, x1, y1, x2, y2) {
        ctx.strokeStyle = 'grey';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.stroke();
    }
};

