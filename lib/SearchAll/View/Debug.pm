use strict;
use warnings;

package SearchAll::View::Debug;
use base 'SearchAll::View::Main';
use Template::Declare::Tags
    'XUL', HTML => { namespace => 'html' };

our @JsTestFiles = qw(
    test-browser.js test-progress.js
);

template main => sub {
    show 'header';
    window {
        attr {
            id => "search-all-debug-win",
            title => _("SearchAll (Debug)"),
            xmlns => $::XUL_NAME_SPACE,
            #'xmlns:html' => $::HTML_NAME_SPACE,
        }

        tabbox {
            attr { selectedIndex => 0, flex => 1 }
            tabs {
                tab { attr { label => 'SearchAll' } }
                tab { attr { label => 'Logs' } }
                tab { attr { label => 'Tester' } }
            }
            tabpanels {
                attr { flex => 1 }
                tabpanel { show('searchall'); }
                tabpanel { show('show_dom'); }
                tabpanel { show('tests'); }
            }
        };
        show('status_bar');
    }
};

template tests => sub {
    hbox {
        show 'file_list', \@JsTestFiles;
        show 'test_pannel';
    }
};

template file_list => sub {
    my ($self, $list) = @_;
    listbox {
        attr { id => 'test-file-list' };
        my $first = 1;
        for my $file (@$list) {
            (my $func = $file) =~ s/\.js$//;
            $func =~ s/-/_/g;
            #warn $func;
            listitem {
                attr {
                    selected => ($first ? 'true' : 'false'),
                    label => $file,
                    value => $func,
                }
            };
            $first = 0;
        } # for
    }
};

template test_pannel => sub {
    vbox {
        attr { flex => 1 }
        hbox {
            button { attr { id => 'run-tests',  label => 'Run!' } }
            spacer { attr { flex => 1 } }
        }
        textbox {
            attr {
                id => 'test',
                multiline => 'true',
                readonly => 'true',
                flex => 1,
                width => 600,
                height => 600,
            }
        }
    }
};

template show_dom => sub {
    hbox {
        attr { flex => 1 }
        listbox {
            attr {
                width => 150,
                id => 'dom-list',
            }
        }
        splitter {
            attr {
                #resizeafter => 'grow'
                collapse => 'before',
                id => 'dom-splitter-' . ($_-1),
                #state => 'collapsed',
            }
        }
        textbox {
            attr {
                id => 'dom',
                multiline => 'true',
                style => 'background-color: white; padding-left: 1em; padding-top: 0.5em;',
                readonly => 'true',
                flex => 1,
            }
        }
    }
};

1;
