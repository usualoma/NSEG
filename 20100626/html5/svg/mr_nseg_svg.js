var MrNsegSVG;

(function($) {


MrNsegSVG = function() {
	this.attach();
};
MrNsegSVG.attached = false;

MrNsegSVG.prototype = jQuery.extend({
	svg: null,

	attach: function() {
		var self = this;

		// イベントのアタッチ
		$('#draw').css('display', '').click(function() { self.draw() });

		// SVGのロード
		$('#mr_nseg_container').loadSVG({
			url           : './mr_nseg_svg.svg',
			clipping_rect : '#clip0 rect',
			complete      : function(svg) { self.init(svg) }
		});

		// JavaScript が有効な時にだけ有効にする CSS を挿入
		$('head').append('<link rel="stylesheet" href="./mr_nseg_svg.css" type="text/css" media="screen,print" />');

		// ロード済み
		MrNsegSVG.attached = true;
	},

	init: function(svg) {
		this.svg = svg;
		this.clear();
	},

	clear: function() {
		this.svg.restore_original_size();
		$('#mr_nseg path').each(function() {
			$(this).css('opacity', '0');
		});
	},

	enqueue: function(func) {
		if (func) {
			self.svg.queue(function() {
				func();
				self.svg.dequeue()
			});
		}
	},

	// 描画
	draw_path: function(complete) {
		var self = this;
		$('#mr_nseg path').each(function() {
			var path = $(this);
			self.svg.queue(function() {
				path.drawPath({
					duration_par: 100,
					method: 'bend',
					complete: function () { self.svg.dequeue(); }
				});
			});
		});

		self.enqueue(complete);
	},

	// アイコン化
	iconic: function(complete) {
		var self = this;
		var diff = null;

		self.svg.animate(
			{ width: 32, height: 32 },
			{
				duration: 1000,
				step: function(s, obj) {
					if (obj.prop != 'width') {
						return;
					}

					if (! diff) {
						diff = obj.start - obj.end;
					}
					var tmp = (obj.start - obj.now) / diff;
					var deg = Math.PI*(tmp*4+0.5);

					var s = Math.sin(deg);
					var c = Math.cos(deg);

					var matrix =
						'matrix(' +s+ ',' + 0 + ',' + 0 + ',' +1+ ',0,0)';

					self.svg.css({
						'-webkit-transform': matrix,
						'-moz-transform': matrix
					});
				}
			}
		);

		self.enqueue(complete);
	},

	draw: function() {
		this.clear();

		this.draw_path();

		this.iconic();
	}
}, new Object);

$(function() {
	if (! MrNsegSVG.attached) {
		new MrNsegSVG;
	}
});


})(jQuery);
