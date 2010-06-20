/*
 *  Copyright (c) 2010 ToI Inc. All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions
 *  are met:
 *
 *  1. Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *
 *  2. Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 *  3. Neither the name of the authors nor the names of its contributors
 *     may be used to endorse or promote products derived from this
 *     software without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *  LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *  A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *  OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 *  TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 *  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * 線を引きます
 *
 * オプション
 *
 * duration: 時間
 * method  : 描画方法 (stretch or bend)
 *
 */
jQuery.fn.drawPath = function(opts) {
	var $ = jQuery;

	opts = $.extend({
		'duration'     : 'slow',
		'method'       : 'stretch',
		placement: null
	}, opts);

	return this.each(function(i, container) {
		if (opts['method'] == 'stretch') {
			return by_stretch();
		}
		else {
			return by_bend();
		}

		function by_stretch() {
			container = $(container);

			var length = 0;
			var lines = container.attr('d').split(/\s+L\s+/);

			var start = lines.shift();
			var startxy = start.replace(/M\s+/, '').split(/\s+/);

			var prev = [];
			prev[0]  = parseFloat(startxy[0]);
			prev[1]  = parseFloat(startxy[1]);

			lines = $.map(lines, function(l) {
				var xy = l.split(/\s+/);
				xy[0]  = parseFloat(xy[0]);
				xy[1]  = parseFloat(xy[1]);

				var len = Math.sqrt(
					Math.pow(prev[0] - xy[0], 2), Math.pow(prev[1] - xy[1], 2)
				);

				var obj = {
					'string': l,
					'prevx' : prev[0],
					'prevy' : prev[1],
					'dx'    : (xy[0] - prev[0]) / len,
					'dy'    : (xy[1] - prev[1]) / len,
					'length': len,
					placement: null
				}

				length += len;
				prev = xy;

				return obj;
			});

			function drawPathInner(step) {
				var str = start;

				var current = 0;
				$.each(lines, function(i, l) {
					var len = step - current;
					if (len > 0) {
						if (len > l['length']) {
							str += ' L ' + l['string'];
						}
						else {
							str +=
								' L ' +
								((l['dx'] * len) + l['prevx']) + ' ' +
								((l['dy'] * len) + l['prevy']);
						}
					}
					else {
						return false;
					}

					current += l['length'];
				});

				container.attr('d', str);
			}
			drawPathInner(0);
			opts['step'] = drawPathInner;

			container.css('fontSize', '0');
			container.css('opacity', '1');

			return container.animate({ 'fontSize': length }, opts);
		}

		function by_bend() {
			container = $(container);

			var steps = 0;
			var lines = container.attr('d').split(/\s+C\s+/);

			var start = lines.shift();
			var startxy = start.replace(/M\s+/, '').split(/\s+/);

			var prev = [];
			prev[0]  = parseFloat(startxy[0]);
			prev[1]  = parseFloat(startxy[1]);

			lines = $.map(lines, function(l) {
				var xytmp = l.split(/\s+/).reverse();
				while (xytmp[0] === '') {
					xytmp.shift();
				}
				var xy = [];
				xy[0]  = parseFloat(xytmp[1]);
				xy[1]  = parseFloat(xytmp[0]);

				var len = Math.sqrt(
					Math.pow(prev[0] - xy[0], 2), Math.pow(prev[1] - xy[1], 2)
				);

				s = ((xytmp.length - 2) / 2);

				var obj = {
					'string': l,
					'prevx' : prev[0],
					'prevy' : prev[1],
					'dx'    : (xy[0] - prev[0]) / len,
					'dy'    : (xy[1] - prev[1]) / len,
					'steps' : s,
					placement: null
				}

				steps += s;
				prev = xy;

				return obj;
			});


			if (opts['duration_par']) {
				container.attr('jquery.drawPath.steps', steps);
				opts['duration'] = opts['duration_par'] * steps;
			}

			function drawPathInner(step) {
				var str = start;

				var current = 0;
				$.each(lines, function(i, l) {
					var diff = Math.ceil(Math.round(step) - current);
					if (diff > 0) {
						if (diff >= l['steps']) {
							str += ' C ' + l['string'];
						}
						else {
							str +=
								' C ' + l['string'].replace(/\s*[\d\.]+\s*[\d\.]+\s*/, '') + ' ' +
								((l['dx'] * 999) + l['prevx']) + ' ' +
								((l['dy'] * 999) + l['prevy']);
						}
					}
					else {
						return false;
					}

					current += l['steps'];
				});

				container.attr('d', str);
			}
			drawPathInner(0);
			opts['step'] = drawPathInner;

			container.css('fontSize', '0');
			container.css('opacity', '1');

			return container.animate({ 'fontSize': steps }, opts);
		}
	});
}
