package SearchAll::View::Main;

use strict;
use warnings;
use base 'SearchAll::View::Base';
use Template::Declare::Tags 'XUL';

# no search.cpan.org any more
my @URLs = qw(
    www.google.cn
    www.yisou.com
    www.baidu.com

    www.yahoo.cn
    www.sogou.com
    www.yodao.com

    www.google.com/en
    search.yahoo.com
    en.wikipedia.org/wiki/Special:Search

    www.live.com
    www.ask.com
    www.a9.com

    video.google.com
    video.baidu.jp
    sagool.jp/movie/

    www.answers.com
    www.taobao.com
    addons.mozilla.org/search
    search.ebay.com
    www.amazon.com

    www.youtube.com

    www.flickr.com/search
    image.cn.yahoo.com
    images.google.cn
    image.baidu.com

    images.search.yahoo.com
    images.google.com
);

template main => sub {
    show 'header';
    window {
        attr {
            id => "searchall",
            title => _("SearchAll"),
            xmlns => $::XUL_NAME_SPACE,
            #'xmlns:html' => $::HTML_NAME_SPACE,
            width => 1000,
            height => 800,
            persist => "sizemode screenX screenY width height",
        }

	show 'searchall';
        show 'status_bar';
    }
};

template searchall => sub {
    vbox {
        attr { id => 'searchall-panel', flex => 1, _locale => _('en-US') };
        vbox {
            attr { id => 'my-bar' };
            show 'engine_bar';
            show 'search_bar';
        }
        stack {
            attr { flex => 1 };
            show 'results';
            show 'navigator';
        }
    };
};

template engine_bar => sub {
    hbox {
        attr {
	    id => 'engine-bar',
            pack => 'center',
            align => 'center',
            flex => 1,
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
            show 'url_list', $_;
        }
        spacer { attr { flex => 1 } }
    }
};

template search_bar => sub {
    hbox {
        attr {
            id => 'search-bar',
            pack => 'center',
            flex => 1
        }
        textbox {
            attr {
                #type => "autocomplete",
                #autocompletesearch => "form-history history",
                id => 'search-box',
                flex => 1,
                #autocompletesearchparam => "search-box-history",
                #maxlength => 256,
            }
        }
        button {
            attr {
                id => 'search-button',
                label => ' ' . _('Search'),
                image => 'application_lightning.png',
            }
        }
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
            #align => 'center',
        }
        tabs {
            attr {
                id => 'view-tabs',
                persist => 'lastSelected',
            }
            tab {
                attr {
                    id => 'view-tab-0',
                    label => ' ' . _('Original'),
                    image => 'application_tile_horizontal.png',
                }
            }
            tab {
                attr {
                    id => 'view-tab-1',
                    label => ' ' . _('Formatted'),
                    image => 'application_view_columns.png',
                }
            }
            tab {
                attr {
                    id => 'view-tab-2',
                    label => ' ' . _('Mapping'),
                    image => 'table_relationship.png',
                }
            }
        }
        tabpanels {
            attr {
                id => 'view-panels',
                flex => 1,
            }
            tabpanel { show('raw_view'); }
            tabpanel { show('fmt_view'); }
            tabpanel { show('map_view'); }
            #tabpanel { show('merged_view'); }
        }
    }

};

template navigator => sub {
    hbox {
        attr { id => 'navigator', align => 'start', pack => 'end' }
        button { attr { id => 'prev-button', class => 'nav-button', label => "<<" . _('Prev') } }
        button { attr { id => 'next-button', class => 'nav-button', label => _('Next') . ">>" } }
        #button { attr { id => 'stop-button', class => 'nav-button', image => 'cancel.png', label => _('Cancel') } }
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
                src => 'fmt-view.html',
                flex => 1,
                id => "fmt-view",
                type => 'content-primary',
                #homepage => 'chrome://$XUL::App::APP_NAME/content/listing.html',
            }
        }
    }
};

template map_view => sub {
    groupbox {
        attr { flex => 1, orient => 'horizontal' };
        browser {
            attr {
                src => 'map-view.html',
                flex => 1,
                id => "map-view",
                type => 'content-primary',
                #homepage => 'chrome://$XUL::App::APP_NAME/content/listing.html',
            }
        }
    }
};

1;

