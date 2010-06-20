var NsegIconIdeaSVG;

(function($) {


NsegIconIdeaSVG = function() {
	this.attach();
};
NsegIconIdeaSVG.attached = false;

NsegIconIdeaSVG.prototype = jQuery.extend({
	svg: null,

	attach: function() {
		var self = this;

		// イベントのアタッチ
		$('#draw').css('display', '').click(function() { self.draw() });

		// SVGのロード
		$('#nseg_icon_container').loadSVG({
			url           : './nseg_icon_idea_svg.svg',
			clipping_rect : '#clip0 rect',
			complete      : function(svg) { self.init(svg) }
		});

		// JavaScript が有効な時にだけ有効にする CSS を挿入
		$('head').append('<link rel="stylesheet" href="./nseg_icon_idea_svg.css" type="text/css" media="screen,print" />');

		// ロード済み
		NsegIconIdeaSVG.attached = true;
	},

	init: function(svg) {
		this.svg = svg;
		this.clear();
	},

	clear: function() {
		this.svg.restore_original_size();
		$('#prefecture path, #nseg path, #nseg_red path').each(function() {
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

	// 4つの菱形を描画
	draw_rhombic: function(complete) {
		var self = this;
		$('#prefecture path').each(function() {
			var path = $(this);
			self.svg.queue(function() {
				path.animate(
					{ opacity: 1 },
					500,
					function() { self.svg.dequeue() }
				);
			});
		});

		self.enqueue(complete);
	},

	// NSEGを描画
	draw_nseg: function(complete) {
		var self = this;
		$('#nseg path').each(function() {
			var path = $(this);
			self.svg.queue(function() {
				path.drawPath({
					duration: 800,
					easing  : 'easeOutBounce',
					complete: function() { self.svg.dequeue() }
				});
			});
		});

		self.enqueue(complete);
	},

	// 赤いNを描画
	draw_red_n: function(complete) {
		var self = this;
		$('#nseg_red path').each(function() {
			var path = $(this);
			svg.queue(function() {
				path.animate(
					{ opacity: 1 },
					1000,
					'easeOutBounce',
					function() { self.svg.dequeue() }
				);
			});
		});

		self.enqueue(complete);
	},

	// アイコン化
	iconic: function(complete) {
		var self = this;
		var diff = null;
		var diff_prop = null;

		self.svg.animate(
			{ width: 32, height: 32 },
			{
				duration: 1000,
				step: function(s, obj) {
					if (! diff) {
						diff = obj.start - obj.end;
						diff_prop = obj.prop;
					}
					if (diff_prop == obj.prop) {
						var deg = 360 * (obj.start - obj.now) / diff;
						self.svg.css({
							'-webkit-transform': 'rotate(' + deg + 'deg)',
							'-moz-transform': 'rotate(' + deg + 'deg)'
						});
					}
				}
			}
		);

		self.enqueue(complete);
	},

	draw: function() {
		this.clear();

		this.draw_rhombic();
		this.draw_nseg();
		this.draw_red_n();

		this.iconic();
	}
}, new Object);

$(function() {
	if (! NsegIconIdeaSVG.attached) {
		new NsegIconIdeaSVG;
	}
});


})(jQuery);
