#!/usr/bin/perl -w

while (<STDIN>) {
    s/\&\#(\d+);/sprintf("\\u%X",$1)/ige;
    print;
}
