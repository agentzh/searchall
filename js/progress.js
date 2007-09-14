var Progress = function (count) {
    return this.reset(count);
};

Progress.fn = Progress.prototype = {
    reset: function (count) {
        this.count = count;
        this.tasks = {};
    },
    setDone: function (key, val) {
        if (val == undefined) val = 1;
        this.tasks[key] = val;
    },
    percent: function () {
        var n = 0;
        for (key in this.tasks) n++;
        return n/this.count;
    },
};

