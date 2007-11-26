// Class SearchAll.MapView
// -- agentzh

if (typeof SearchAll == 'undefined') SearchAll = {};

SearchAll.MapView = function () {
    this.browser = document.getElementById('map-view');
};

SearchAll.MapView.prototype = {
    timeouts: [],
    prevHtmlLens: [0, 0, 0],
    _document: null,
    _canvas: null,
    reset: function () {
        for (var i = 0; i < this.timeouts.length; i++) {
            clearTimeout(this.timeouts[i]);
        }
        this.timeouts = [];
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
        info("Updating the Mapping View...");
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.reset();
        for (var i = 0; i < 3; i++)
            this.drawIcon(ctx, i);

        for (var i = 0; i < 3; i++)
            this.timeouts.push(this.asyncUpdateThread(ctx, i));
        return true;
    },

    drawIcon: function (ctx, index) {
        var path = app.fmtViews[index].favicon;
        var img = new Image();
        var xStep = 200;
        var x = 10 + index * xStep;
        img.onload = function(){
            ctx.drawImage(img, x - 7, 20);
        }
        //alert(path);
        img.src = path;
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
            ctx.beginPath();
            ctx.fillStyle = "pink";
            ctx.arc(x, y, radius, 0, Math.PI*2, true); // Outer circle
            ctx.fill();
            ctx.closePath();
            if (prevSeq) {
                for (var j = 0; j < prevSeq.length; j++) {
                    var prevURI = prevSeq[j];
                    if (util.trimURI(prevURI) == util.trimURI(url)) {
                        info("Found equivalent URLs: " + prevURI + " <=> "
                            + url);
                        var y2 = 40 + (radius * 2 + yStep) * (j + 1);
                        this.drawLine(ctx, x, y, x2, y2);
                        //ctx.moveTo(x2, y2);
                    }
                }
            }
        }
    },

    drawLine: function (ctx, x1, y1, x2, y2) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.stroke();
    }
};

