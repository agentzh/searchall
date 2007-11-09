package SearchAll::View::Base;

use strict;
use warnings;

use base 'XUL::App::View::Base';
use Template::Declare::Tags
    'XUL', HTML => { namespace => 'html' };

template status_bar => sub {
    statusbar {
        statusbarpanel {
            attr {
                id => 'statusbar-display',
                flex => 1,
                label => 'Loading...',
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

