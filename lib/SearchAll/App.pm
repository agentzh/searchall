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

        #xulfile 'searchall-debug.xul' =>
            #generated from 'SearchAll::View::Debug',
            #includes qw(
                #searchall.js
                #Test/More.js Test/Builder.js
                #test.js searchall.css
            #);

        jsfile 'searchall.js' =>
            requires qw(
                xpcom.js
                jquery.js JSAN.js
                datadumper.js Debug.js
                timer.js dom-logger.js dom.js map-view.js thread.js
                progress.js pattern-miner.js util.js link-tester.js fmt-view.js
                persist.js app.js
                orig-view.js progress-listener.js
                event-util.js
                prev-next.js toggle-bar.js
            );

        jsfile 'Debug.js' =>
            requires qw( io.js );

        jsfile 'toolbar.js' =>
            requires qw( jquery.js xpcom.js );

        #jsfile 'test.js' =>
            #requires qw( test-browser.js test-progress.js );

        xpifile 'searchall.xpi' =>
            id is 'searchall@yahoo.cn',
            name is 'SearchAll',
            description is 'A side-by-side search engine comparison tool',
            version is '0.5.1',
            targets {
                Firefox => ['2.0' => '6.*'],
                Mozilla => ['1.5' => '1.8'],
            },
            creator is 'The Yahoo! China EEEE team',
            developers are ['Zhang "agentzh" Yichun (章亦春)'],
            contributors are ['Zhang "agetnzh" Yichun (章亦春)', 'Ye Dan', 'Jianing Yang', 'Laser Henry', 'Chuanwen Cheng', 'cnhackTNT'];
            homepageURL is 'http://searchall.agentzh.org',
            iconURL is 'chrome://searchall/content/logo.png';
            # XXX should disable it for the final release
            #updateURL is 'http://10.62.136.17/repos/loki/agentz/searchall/branches/xulapp/searchall.xpi';
};

1;

