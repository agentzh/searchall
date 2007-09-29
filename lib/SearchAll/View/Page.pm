package SearchAll::View::Page;

use strict;
use warnings;
use base 'SearchAll::View::Main';
use Template::Declare::Tags 'XUL';

template main => sub {
    show 'header';
    page {
        attr {
            id => "searchall-page",
            title => "SearchAll",
            xmlns => $::XUL_NAME_SPACE,
            width => 800,
            height => 800,
            #'xmlns:html' => $::HTML_NAME_SPACE,
        }

	show 'searchall';
        show 'status_bar';
    }
};

1;

