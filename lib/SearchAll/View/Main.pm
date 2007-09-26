package SearchAll::View::Main;

use strict;
use warnings;
use base 'SearchAll::View::Base';
use Template::Declare::Tags 'XUL';

my @URLs = qw(
    www.google.cn
    www.yisou.com
    www.baidu.cn
    www.yahoo.cn
    so.sohu.com
    www.google.com
    search.yahoo.com
    search.cpan.org
);

template main => sub {
    show 'header';
    window {
        attr {
            id => "search-all-win",
            title => "SearchAll",
            xmlns => $::XUL_NAME_SPACE,
            #'xmlns:html' => $::HTML_NAME_SPACE,
            width => 800,
            height => 600,
            persist => "sizemode screenX screenY width height",
        }

	show 'searchall';
        show 'status_bar';
    }
};

template searchall => sub {
    vbox {
        attr { flex => 1 };
        show 'engine_bar';
        show 'search_bar';
        show 'results';
    };
};

template search_bar => sub {
    hbox {
        attr { pack => 'center' }
        textbox {
            attr {
                id => 'search-box',
                flex => 1,
                #maxlength => 256,
            }
        }
        button {
            attr {
                id => 'search-button',
                label => 'Search',
            }
        }
    }
};

template engine_bar => sub {
    hbox {
        attr {
	    id => 'engine-bar',
            pack => 'center',
            align => 'center',
            #flex => 1,
        };
        for (0..2) {
            spacer { attr { flex => 1 } };
            checkbox {
                attr {
                    id => 'enable-view-' . $_ ,
                    class => 'enable-view',
                    checked => 'true',
                    persist => 'disabled checked',
                }
            };
            show('url_list', $_);
        }
        spacer { attr { flex => 1 } }
    }
};

template url_list => sub {
    my ($self, $index) = @_;
    menulist {
        attr {
            id => "url-list-" . $index,
            class => 'url-list',
            editable => 'true',
            persist => 'disabled lastSelected',
            #oncommand => 'alert("Yeah yeah yeah!");',
            #onpopupshowing => "alert('popping up! ' + this);",
        };
        menupopup {
            my $j = 0;
            for my $url (@URLs) {
                menuitem {
                    attr {
                        id => "url-$index-" . $j++,
                        class => 'url',
                        label => $url,
                        selected =>
                            $url eq $URLs[$index] ?
                                'true' : 'false',
                        #persist => 'selected',
                    }
                }
            }
        }
    }
};

template results => sub {
    tabbox {
        attr {
            id => 'view-tabbox',
            flex => 1,
        }
        tabs {
            attr {
                id => 'view-tabs',
                persist => 'lastSelected',
            }
            tab {
                attr {
                    id => 'view-tab-0',
                    label => 'Raw View',
                }
            }
            tab {
                attr {
                    id => 'view-tab-1',
                    label => 'Formatted View',
                }
            }
            #tab { attr { label => 'Merged View' } }
        }
        tabpanels {
            attr {
                id => 'view-panels',
                flex => 1,
            }
            tabpanel { show('raw_view'); }
            tabpanel { show('fmt_view'); }
            #tabpanel { show('merged_view'); }
        }
    }
};

template raw_view => sub {
    groupbox {
        attr { flex => 1, orient => 'horizontal' };
        for (0..2) {
            if ($_ > 0) {
                splitter {
                    attr {
                        #resizeafter => 'grow'
                        collapse => 'before',
                        id => 'splitter-' . ($_-1),
                        #state => 'collapsed',
                        persist => 'collapse state',
                    }
                };
            };
            my $url = 'http://' . $URLs[$_];
            browser {
                attr {
                    src => 'about:blank',
                    flex => 1,
                    id => "browser-$_",
                    type => 'content-primary',
                    homepage => $url,
                }
            }
        }
    }
};

template fmt_view => sub {
    groupbox {
        attr { flex => 1, orient => 'horizontal' };
        browser {
            attr {
                src => 'fmt_view.html',
                flex => 1,
                id => "fmt-view",
                #type => 'content-primary',
                homepage => 'chrome://$XUL::App::APP_NAME/content/listing.html',
            }
        }
    }
};

1;

