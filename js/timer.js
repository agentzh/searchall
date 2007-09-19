var Timer = function () {
    return this.reset();
};

Timer.fn = Timer.prototype = {
    now: function (c) {
        return Date.now();
    },
    start: function (tag) {
        //alert("starting: " + tag);
        if (!this.tags[tag])
            this.tags[tag] = [];
        var pair = [this.now()];
        this.tags[tag].unshift(pair);
    },
    stop: function (tag, params) {
        //alert("stopping: " + tag);
        var end_time = this.now();
        var list = this.tags[tag];
        if (!list) return;
        var pair = list[0];
        if (!pair || pair.length > 1) {
            if (params.force && pair)
                pair[1] = end_time;
            else
                error("Timer: time out of sync!");
            return;
        }
        pair.push(end_time);
    },
    isTiming: function (tag) {
        var list = this.tags[tag];
        //Debug.JJJ(this);
        if (!list)
            return false;
        var pair = list[0];
        return pair && pair.length == 1;
    },
    lastResult: function (tag) { // in ms
        //alert("Here!");
        var list = this.tags[tag];
        if (!list) return undefined;
        var pair = list[0];
        //Debug.JJJ(this);
        return pair[1] - pair[0];
    },
    reset: function () { this.tags = {}; return this; }
};

