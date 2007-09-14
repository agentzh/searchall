package XUL::App;

use strict;
use warnings;
use base qw/ Class::Data::Inheritable /;

__PACKAGE__->mk_classdata('FILES' => {});

our ($ID, $APP_NAME);

1;

