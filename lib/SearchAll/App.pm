use strict;
use warnings;

package SearchAll::App;
our $VERSION = '0.01';
use XUL::App::Schema;
use XUL::App schema {
        xulfile 'searchall.xul' =>
            generated from 'SearchAll::View::Main',
            includes qw( searchall.js searchall.css );

        xulfile 'searchall-page.xul' =>
            generated from 'SearchAll::View::Page',
            includes qw( searchall.js searchall.css );

        xulfile 'browser-overlay.xul' =>
            generated from 'SearchAll::View::Overlay',
            includes qw( toolbar.js overlay.css ),
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
                progress.js miner.js fmt-view.js
                persist.js
                browser.js progress-listener.js
                event-util.js
                prev-next.js toggle-bar.js
            );

        jsfile 'toolbar.js' =>
            requires qw( jquery.js );

        jsfile 'test.js' =>
            requires qw( test-browser.js test-progress.js );

        xpifile 'searchall.xpi' =>
            id is 'searchall@yahoo.cn',
            name is 'SearchAll',
            version is '0.1.6',
            targets {
                Firefox => ['2.0' => '3.0a5'],
                Mozilla => ['1.5' => '1.8'],
            },
            creator is 'The Yahoo! China EEEE team',
            developers are ['Agent Zhang (章亦春)'],
            contributors are ['Ye Dan', 'Jianingy Yang', 'Laser Henry', 'Chuanwen Cheng', 'cnhackTNT'];
            homepageURL is 'http://cn.yahoo.com',
            iconURL is 'chrome://searchall/content/logo.png';
            # XXX should disable it for the final release
            #updateURL is 'http://10.62.136.17/repos/loki/agentz/searchall/branches/xulapp/searchall.xpi';
};

1;

