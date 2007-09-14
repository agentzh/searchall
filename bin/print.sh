#!/bin/sh

fjoin -o print.txt Makefile install.rdf chrome.manifest content/browserOverlay.xul \
    content/searchall.js \
    content/browser.js content/progress-listener.js content/timer.js \
    content/progress.js content/test.js content/test-browser.js \
    content/test-progress.js \
    content/dom.js content/Debug.js \
    lib/SearchAll.pm lib/SearchAll/Base.pm lib/SearchAll/Debug.pm
echo "\n\nLayout\n======" >> print.txt
tree . | egrep -v '~|\.swp' >> print.txt

