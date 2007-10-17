package XUL::App::XULFile;

use lib 'lib';
use strict;
use warnings;
use File::Slurp;
use Encode;
#use Smart::Comments;
use XUL::App;

use base 'Class::Accessor::Fast';
__PACKAGE__->mk_accessors(qw{
    name generated_from prereqs overlays
});

sub new {
    my $proto = shift;
    my $self = $proto->SUPER::new(@_);
    my $src = $self->generated_from;
    my ($module, $opts);
    if (ref $src eq 'HASH') {
        ($module, $opts) = %$src;
    } elsif (ref $src) {
        ($module, $opts) = @$src;
    } else {
        $module = $src;
        $opts = {};
    }
    $self->{module} = $module;
    $self->{template} = delete $opts->{template} || 'main';
    my $args = delete $opts->{arguments} || [];
    if (ref $args ne 'ARRAY') { $args = [$args]; }
    $self->{args} = $args;
    if (%$opts) {
        die "Unknown option for view class $self->{template}: ", join(" ", keys %$opts);
    }
   return $self;
}

sub go {
    my ($self, $file) = @_;
    my $module = $self->{module};
    my $args = $self->{args};
    my $template = $self->{template};
    eval "use $module;";
    if ($@) {
        warn $@;
        die "Can't load $module due to compilation errors.\n";
    }
    Template::Declare->init(roots => [$module]);
    # XXX $opts->{template}, $opts->{arguments}
    mkdir 'tmp' if !-d 'tmp';
    mkdir 'tmp/content' if !-d 'tmp/content';
    my @all_prereqs = find_all_prereqs($file);
    ### @all_prereqs
    my $xml = Template::Declare->show($template, @$args);
    my (@jsfiles, @cssfiles);
    for my $file (@all_prereqs) {
        if ($file =~ /\.js$/i) {
            push @jsfiles, $file;
        } else {
            push @cssfiles, $file;
        }
    }
    my $last_tag_pat = qr{ </ [^>]+ > \s* $}xs;
    for my $file (@jsfiles) {
        if ($file !~ /^\w+:\/\//) {
            check_js_file($file);
            $file = "chrome://$XUL::App::APP_NAME/content/$file";
        }
        $xml =~ s{$last_tag_pat}{<script src="$file" type="application/javascript;version=1.7"/>\n$&};
    }
    my $first_tag_pat = qr{ .* <\? [^>]+ \?> }xs;
    for my $file (reverse @cssfiles) {
        if ($file !~ /^\w+:\/\//) {
            check_css_file($file);
            $file = "chrome://$XUL::App::APP_NAME/content/$file";
        }
        $xml =~ s{$first_tag_pat}{$&\n<?xml-stylesheet href="$file" type="text/css"?>};
    }
    my $path = "tmp/content/$file";
    warn "Writing file $path\n";
    $xml = encode('UTF-8', $xml);
    write_file(
        $path,
        $xml
    );
}

sub find_all_prereqs {
    my ($file, $visited) = @_;
    $visited ||= {};
    if ($visited->{$file}) { return () };
    $visited->{$file} = 1;
    ## File: $file
    my $obj = XUL::App->FILES->{$file};
    ## Obj: $obj
    return () unless $obj;
    my $prereqs = $obj->prereqs;
    ## $prereqs
    if ($prereqs and !ref $prereqs) { $prereqs = [$prereqs]; }
    if ($prereqs and @$prereqs) {
        return map {
            find_all_prereqs($_, $visited), $_
        } @$prereqs;
    }
    return ();
}

sub check_js_file {
    my $file = shift;
    if (!-f "js/$file" and !-f "js/thirdparty/$file") {
        die "Can't find JavaScript file $file in either js/ or js/thirdparty/\n";
    }
}

sub check_css_file {
    my $file = shift;
    if (!-f "css/$file") {
        die "Can't find CSS file $file in either js/ or js/thirdparty/\n";
    }
}

1;
