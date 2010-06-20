var set_image_data;

(function() {

	var FPS = 100;
	var background = [255, 255, 255, 255];


	var random_offs = null;
	var moves       = null;
	var patterns    = 10;

	function get_random_offs() {
		if (! random_offs) {
			random_offs = [];
			for (var i = 0; i < width+patterns; i++) {
				random_offs[i] = parseInt(Math.random()*300) - 150;
			}
		}

		return random_offs;
	}

	function get_moves() {
		if (! moves) {
			moves = [];
			for (var i = 0; i < width+patterns; i++) {
				var m = parseInt(Math.random()*5) - 2;
				if (m > 1 || m < -1) {
					m = 2;
				}
				moves[i] = m;
			}
		}

		return moves;
	}



	var Lines = function(original_data, data, width, height) {
		this.width  = width;
		this.height = height;
		this.data   = data;
		this.original_data = original_data;

		this.length = 0;
		this.lines  = [];

		this.add_line();
	};
	Lines.prototype = {
		add_line: function() {
			var self = this;
			var line = null;

			while (true) {
				line = new Line(
					this.original_data, this.data, this.width,
					this.height-(this.length)-1
				);
				this.length++;

				if (
					(! line.is_background) ||
					(this.length >= height)
				) {
					break;
				}
			}

			if (line) {
				this.lines.push(line);
			}

			if (this.length < height) {
				setTimeout(function() {
					self.add_line();
				}, 25);
			}
		},
		render: function() {
			if (this.lines.length <= 0) {
				return false;
			}

			for (var i = 0; i < this.lines.length; i++) {
				this.lines[i].render();
			}

			while (this.lines[0].finished) {
				this.lines.shift();
			}

			return true;
		}
	};



	var Line = function(original_data, data, width, y) {

		this.current = -1;
		this.step    = 2;

		this.y = y;
		this.data  = data;
		this.width = width;
		this.line  = [];

		this.offsets = [];

		var is_background = true;
		var finished      = false;

		var line = this.line;
		var random_offs = get_random_offs();
		var random_offs_pattern = parseInt(Math.random()*patterns);

		var rmask = 0xff;
		var gmask = 0xff00;
		var bmask = 0xff0000;

		for (var i = 0; i < width; i++) {
			var off  = width*y + i;
			var loff = i*4;
			line[loff]   = original_data[off] & rmask;
			line[loff+1] = (original_data[off] & gmask) >> 8;
			line[loff+2] = (original_data[off] & bmask) >> 16;
			line[loff+3] = 255;

			if (is_background) {
				if (
					(line[loff] != background[0]) ||
					(line[loff+1] != background[1]) ||
					(line[loff+2] != background[2])
				) {
					is_background = false;
				}
			}

			this.offsets[i] = this.fix_offset(
				random_offs[random_offs_pattern+i],
				i, width, y-this.current
			);
		}

		this.is_background = is_background;
	};
	Line.prototype = {
		render: function() {
			var width = this.width;
			var line  = this.line;
			var data  = this.data;

			var moves = get_moves();
			var moves_pattern = parseInt(Math.random()*patterns);

			if (this.current >= 0) {
				for (var i = 0; i < width; i++) {
					var off = (width*this.current + i)*4;
					data[off] = background[0];
					data[off+1] = background[1];
					data[off+2] = background[2];
					data[off+3] = background[3];
				}
			}

			this.current += this.step;
			if (this.step > 0) {
				if (this.current > this.y) {
					this.current = this.y;
				}
			}
			else {
				if (this.current < this.y) {
					this.current = this.y;
				}
			}

			for (var i = 0; i < width; i++) {
				this.offsets[i] = this.fix_offset(
					this.offsets[i]+moves[moves_pattern+i],
					i, width, this.y-this.current, moves[moves_pattern+i]
				);

				var off = (width*this.current + i + this.offsets[i])*4;
				var loff = i*4;
				data[off] = line[loff];
				data[off+1] = line[loff+1];
				data[off+2] = line[loff+2];
				data[off+3] = line[loff+3];
			}


			if (this.current == this.y) {
				this.finished = true;
			}
		},
		fix_offset: function(off, x, width, rest, force) {
			if (force == 2) {
				if (off > 0) {
					off = off-2-1;
				}
				else {
					off = off-2+1;
				}
			}
			else {
				if (off+x > width) {
					off = width-x;
				}
				else if (off+x < 0) {
					off = -x;
				}
			}

			if (off > rest) {
				off = rest;
			}
			else if (off < -rest) {
				off = -rest;
			}

			return off;
		}
	};


	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext("2d");
	var image_data, width, height, interval_id;

	/*
	 * コールバック
	 */
	set_image_data = function(original_data, _width, _height) {

		width  = _width;
		height = _height;

		canvas.setAttribute('width', width);
		canvas.setAttribute('height', height);
		canvas.style.width  = width  + 'px';
		canvas.style.height = height + 'px';

		image_data = ctx.getImageData(0, 0, width, height);

		lines = new Lines(original_data, image_data.data, width, height);

		interval_id = setInterval(render, FPS/1000);
	}

	/*
	 * 描画
	 */
	function render(e) {
		if (lines.render()) {
			try {
				ctx.putImageData(image_data, 0, 0);
			}
			catch(e) {
				clearInterval(interval_id);
			}
		}
		else {
			clearInterval(interval_id);
		}
	}

	/*
	 * 画像データのロード
	 */
	(function() {
		var elm = document.createElement('script');
		elm.type = 'text/javascript';
		elm.src = 'http://dl.dropbox.com/u/3313134/nseg_image_data.js';
		document.body.appendChild(elm);
	})();

})();
