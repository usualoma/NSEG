(function($) {
	$('#test_container').prependTo('body');

	var svg = new NsegIconIdeaSVG;
	setTimeout(function() {
		try {
			module('NsegIconIdeaSVG');

			var prefecture_paths = [];
			$('#prefecture path').each(function(index) {
				prefecture_paths[index] = $.trim(this.getAttribute('d'));
			});

			var nseg_chars = ['N', 'S', 'E', 'G'];
			var nseg_paths = [];
			$('#nseg path').each(function(index) {
				nseg_paths[index] = $.trim(this.getAttribute('d'));
			});

			var nseg_red_path = $.trim($('#nseg_red path').attr('d'));

			test('初期化', function() {
				equals(
					NsegIconIdeaSVG.attached, true,
					'初期化完了フラグが立っていること'
				);
				equals(
					$('body svg').length, 1,
					'SVGが1つだけロードされていること'
				);
			});

			svg.draw_rhombic(function() {
				test('菱形の描画', function() {
					$('#prefecture path').each(function(index) {
						equals(
							prefecture_paths[index],
							$.trim(this.getAttribute('d')),
							'菱形(' + (index+1) + '番目)が描画されていること'
						);
					});
				});
			});

			svg.draw_nseg(function() {
				test('NSEGの描画', function() {
					$('#nseg path').each(function(index) {
						equals(
							nseg_paths[index],
							$.trim(this.getAttribute('d')),
							nseg_chars[index] + 'が描画されていること'
						);
					});
				});
			});

			svg.draw_red_n(function() {
				test('赤いNの描画', function() {
					equals(
						$.trim($('#nseg_red path').attr('d')),
						nseg_red_path,
						'赤いNが描画されていること'
					);
				});
			});

			svg.iconic(function() {
				test('アイコン化', function() {
					equals(
						$('body svg').css('width'), '32px',
						'SVGの幅が32pxに設定されていること'
					);
					equals(
						$('body svg').css('height'), '32px',
						'SVGの高さが32pxに設定されていること'
					);
				});
			});

		} 
		catch (e) {
		}
	}, 1000);
})(jQuery);
