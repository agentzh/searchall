package SearchAll::View::Base;

use strict;
use warnings;
use base 'Template::Declare';
use Template::Declare::Tags
    'XUL', HTML => { namespace => 'html' };

$::XUL_NAME_SPACE = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
$::HTML_NAME_SPACE = "http://www.w3.org/1999/xhtml";

template header => sub {
    xml_decl { 'xml', version => '1.0', encoding => 'UTF-8' };
    xml_decl { 'xml-stylesheet',
        href => "chrome://global/skin/",
        type => "text/css"
    };
};

template status_bar => sub {
    statusbar {
        statusbarpanel {
            attr {
                id => 'statusbar-display',
                flex => 1,
                label => 'Ready.',
                _timeunit => _('sec'),
            }
        }
        statusbarpanel {
            attr {
                # XXX should set to true for production
                collapsed => 'false',
            }
            progressmeter {
                attr {
                    id => 'status-progress',
                    mode => 'determined',
                    value => 50,
                }
            }
        }
    }
};

1;

