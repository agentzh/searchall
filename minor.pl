#!/usr/bin/env perl

use strict;
use warnings;

use Encode::Guess;
use WWW::Mechanize;
use Encode::Guess;
use Encode;
use LWP::Simple;
use HTML::DOM;
use HTML::DOM::Node ':all';
use List::Util 'first';
use Smart::Comments;

my $HitCount = 0;
my $url = shift or die "No URL specified.\n";
my $count = shift || 10;
my $encoding = shift;
my $mech = WWW::Mechanize->new(
    cookie_jar => {},
    autocheck => 1,
);
$mech->agent_alias('Linux Mozilla');
$mech->get($url);
my $html = $mech->content;
if (!defined $encoding) {
    my $decoder = guess_encoding($html, qw/utf8 gbk/);
    die $decoder unless ref($decoder);
    $html = encode('utf8', $decoder->decode($html));
} else {
    $html = encode('utf8', decode($encoding, $html));
}
#$html = decode('UTF8', $html);
my $doc = HTML::DOM->new;
#$doc->utf8_mode(1);
$doc->parse($html);
#print $doc->as_HTML;
my $body = $doc->body;
#print $body->as_HTML;
mine_pattern($body);
warn "\n\ninfo: For total $HitCount hit(s) found.\n";

sub mine_pattern {
    my $node = shift;
    my $prefix = shift || 'body>';
    my $list = $node->childNodes;
    my @categories;
    my $locator;
    my @elems;
    my %sample;
    for my $i (0..$list->length-1) {
        my $elem = $list->item($i);
        next unless $elem->nodeType == ELEMENT_NODE;
        my $tag_name = lc($elem->tagName);
        my ($tag_class) = split /\s+/, $elem->getAttribute("class");
        my $tag_id = $elem->getAttribute("id");
        $locator = $tag_name;

        if ($tag_id) { $locator .= "#$tag_id"; }
        if ($tag_class) { $locator .= ".$tag_class"; }

        my $seq = compute_seq($elem);
        if (!$seq || $seq !~ /\+.*\+.*\+/) {
            next;
        }
        $sample{$seq} .= "[$prefix$locator - $seq] " . $elem->as_text . "\n\n";
        my $category = first { contains($_, $seq) } @categories;
        if (!$category) {
            # create a new category:
            push @categories, [$seq];
        } else {
            # push $seq to the existing category:
            push @$category, $seq;
        }
        push @elems, $elem;
    }
    my @hits = grep {
        #warn scalar(@$_), "\n";
        scalar(@$_) >= $count
    } @categories;

    if (@hits) {
        $HitCount++;
        my $seq = $hits[0]->[0];
        ### @hits
        ### text: $sample{$seq}
        ## @categories
    }
    for my $elem (@elems) {
        mine_pattern($elem, $prefix . $locator . '>');
    }
    return unless @hits;
    #warn $prefix . $locator;
}

sub contains {
    my ($list, $elem) = @_;
    return first { $_ eq $elem } @$list;
}

sub compute_seq {
    my $node = shift;
    my $html = $node->as_HTML;
    my $s;
    while ($html =~ /<(\/?)\s*(\w+)[^>]*>/gcs or
        $html =~ /<()(\w+)\s*(\/)\s*>/gcs) {
        my ($before, $tag, $after) = ($1, $2);
        $tag = lc($tag);
        next if $tag =~ /^ (?: [aubiu] |\d+|nobr|wbr|hr|br|span|font|small|big|em|strong|dfn|code|samp|kbd|var|cite|basefont|img|applet|script|noscript|map|area|tt|trike|big|sub|sup ) $/x;
        if ($before) {
            $s .= "-$tag";
        } elsif ($after) {
            $s .= "+$tag-$tag";
        } else {
            $s .= "+$tag";
        }
    }
    return $s;
    #warn ($s =~ s/<(\w+)><\/\1>|<\w+\/>//gs);
    #warn $s;
    #die $node->nodeType;
    #warn "==========================";
    #warn $html;
}

