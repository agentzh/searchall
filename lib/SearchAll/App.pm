use strict;
use warnings;

package SearchAll::App;
our $VERSION = '0.01';
use XUL::App::Schema;
use XUL::App schema {
        xulfile 'searchall.xul' =>
            generated from 'SearchAll::View::Main',
            includes qw( searchall.js persist.js searchall.css );

        xulfile 'browser-overlay.xul' =>
            generated from 'SearchAll::View::Overlay',
            overlays 'chrome://browser/content/browser.xul';

        xulfile 'searchall-debug.xul' =>
            generated from 'SearchAll::View::Debug',
            includes qw(
                searchall.js persist.js 
                Test/More.js Test/Builder.js
                test.js searchall.css
            );

        jsfile 'searchall.js' =>
            requires qw(
                jquery.js JSAN.js
                datadumper.js Debug.js
                timer.js dom.js JSON.js
                progress.js
                browser.js progress-listener.js
            );

        jsfile 'test.js' =>
            requires qw( test-browser.js test-progress.js );

        xpifile 'searchall.xpi' =>
            id is 'searchall@yahoo.cn',
            name is 'SearchAll',
            version is '0.0.7',
            targets {
                Firefox => ['1.5' => '3.0a5'],
                Mozilla => ['1.0' => '1.8'],
            },
            creator is 'The Yahoo! China EEEE team',
            developers are ['Agent Zhang (章亦春)'],
            homepageURL is 'http://cn.yahoo.com',
            iconURL is 'chrome://searchall/content/logo.png';
            # XXX should disable it for the final release
            #updateURL is 'http://10.62.136.17/repos/loki/agentz/searchall/branches/xulapp/searchall.xpi';
};

1;

