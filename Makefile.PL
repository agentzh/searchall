use strict;
use inc::Module::Install;

name                ('SearchAll');
license             ('perl');
author              ('Agent Zhang <agentzh@yahoo.cn>');
perl_version        ('5.006001');
all_from            ('lib/SearchAll/App.pm');

requires            ('XUL::App' => '0.01');

auto_install();
WriteAll();

