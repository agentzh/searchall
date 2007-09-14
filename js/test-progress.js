// Test the Progress class in progress.js

JSAN.use('Test.More');
JSAN.use('Debug');
JSAN.use('datadumper');

function test_progress () {
    plan({tests: 11});

    var obj = new Progress(3);
    ok(obj, 'obj ok');
    isaOK(obj, 'Progress');
    is(obj.count, 3, '.count ok');

    obj.setDone('google.cn', 18);
    like(obj.percent().toString(), /^0\.333/, 'percent 1/3 ok');
    is(obj.tasks['google.cn'], 18, 'value reads okay');

    obj.setDone('yahoo.cn', 12);
    like(obj.percent().toString(), /^0\.666/, 'percent 2/3 ok');
    is(obj.tasks['google.cn'], 18, 'value 18 still ok');
    is(obj.tasks['yahoo.cn'], 12, 'value 12 ok');

    obj.setDone('google.cn', 20);
    like(obj.percent().toString(), /^0\.666/, 'still percent 2/3');
    is(obj.tasks['google.cn'], 20, "google's value updated to 20");

    obj.setDone('baidu.cn', 10);
    like(obj.percent().toString(), /^1/, 'we got 100%!');

    summary();
}

