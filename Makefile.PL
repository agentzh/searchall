use strict;
use inc::Module::Install;

name                ('SearchAll');
license             ('perl');
author              ('Agent Zhang');
perl_version        ('5.006001');
all_from            ('lib/SearchAll/App.pm');

requires            ('Template::Declare' => '0.27');
requires            ('File::Slurp');
requires            ('Class::Accessor::Fast' => '0.30');
requires            ('Class::Data::Inheritable' => '0.06');

install_script      ('bin/xulapp');

auto_install();
WriteAll();

