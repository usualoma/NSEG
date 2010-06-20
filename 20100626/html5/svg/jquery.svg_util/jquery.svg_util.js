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
 */
jQuery.fn.loadSVG = function(opts) {
	var $ = jQuery;

	return this.each(function(i, container) {
		container = $(container);

		function restore_original_size() {
			if (opts['clipping_rect']) {
				var rect   = $(opts['clipping_rect']);
				var width  = rect.attr('width').baseVal.value;
				var height = rect.attr('height').baseVal.value;

				svg.attr(
					'style',
					'width: ' + width +
						'px; height: ' + height +
						'px; display: inline'
				);
			}
		}

		function init() {
			svg = container.find('svg');

			svg.restore_original_size = restore_original_size;
			restore_original_size();

			if (opts['complete']) {
				opts['complete'](svg);
			}
		}

		function loadSVG() {
			if (container.height()) {
				container.svg({
					loadURL: opts['url'],
					onLoad : init
				});
				container.find('object').remove();
			}
			else {
				setTimeout(loadSVG, 100);
			}
		}

		loadSVG();
	});
};
