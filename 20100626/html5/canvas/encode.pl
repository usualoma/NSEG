#!/opt/local/bin/perl

use GD;
use JSON;

my $img = GD::Image->new(shift);

my ($width, $height) = ($img->width, $img->height);
my @pixels = ();

for (my $j = 0; $j < $height; $j++) {
	for (my $i = 0; $i < $width; $i++) {
       my $index = $img->getPixel($i,$j);
	   my ($r, $g, $b) = $img->rgb($index);
	   push(@pixels, $r | ($g << 8) | ($b << 16));
	}
}

my $json = JSON->new->allow_nonref;
my $json_text = $json->encode(\@pixels);

print(<<__EOS__);
set_image_data($json_text, $width, $height);
__EOS__
