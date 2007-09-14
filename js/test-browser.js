// Test the Browser class in browser.js

JSAN.use('Test.More');
JSAN.use('Debug');
JSAN.use('datadumper');

function test_browser () {
    plan({tests: 16});

    var browser = $("#browser-1")[0];
    is(browser.nodeName, 'browser', 'browser-1 found');
    is(browser.id, 'browser-1', "browser-1's id okay");

    // reset the context:
    browser.homePage = 'http://www.google.cn';
    browser.goHome();

    setTimeout( function () {
        browser = new Browser(browser);
        ok(browser, 'instance ok');
        isaOK(browser, 'Browser');
        //is(Dumper(browser), 'hi');
        // check the sanity of the Google.cn home:
        is(browser.hostname(), 'www.google.cn', 'hostname is google.cn');
        is(browser.textbox()[0].type, 'text', "textbox's type okay");
        is(browser.textbox()[0].value, '', 'textbox is empty');
        like(browser.textbox()[0].title, /Google/, "textbox's title okay");
        is(browser.button()[0].type, 'submit', "button's type okay");
        like(browser.button().val(), /Google/, "button's value okay");

        // Let's search for 'Perl' in Google.cn!
        browser.textbox().val("Perl");
        is(browser.textbox().val(), "Perl", "textbox's value set to 'Perl'");
        browser.button().click();

        // Let's wait for a while to let the new
        // page get loaded
        setTimeout(function () {
            showDOM(browser.document());
            is(browser.hostname(), 'www.google.cn', 'url does not change');
            like(browser.textbox().val(), 'Perl', "textbox's value not changed");
            like(browser.document().title, /Perl - Google/, 'title okay');
            //is(dumpDOM(browser.document), '');

            // Now let's search for 'Howdy' in the
            // resulting page (without going home first)
            browser.textbox().val("Howdy");
            browser.button().click();
            // Let's wait for the new page to load:
            setTimeout(function () {
                showDOM(browser.document());
                like(browser.textbox().val(), 'Howdy', "textbox's value is still 'howdy'");
                like(browser.document().title, /Howdy - Google/, "title okay, it's 'Howdy - Google ...'");

                summary();
            }, 1000);
        }, 1000);
    }, 1000);
}

