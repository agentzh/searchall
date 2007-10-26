#!/bin/sh

fjoin -o print.txt Makefile.PL \
                js/timer.js js/dom.js \
                js/progress.js js/miner.js js/fmt-view.js \
                js/persist.js \
                js/browser.js js/progress-listener.js \
                js/prev-next.js js/toggle-bar.js \
                js/searchall.js \
                js/toolbar.js \
    lib/SearchAll/View/*.pm \
    lib/SearchAll/App.pm
#echo "\n\nLayout\n======" >> print.txt
#tree . | egrep -v '~|\.swp' >> print.txt

