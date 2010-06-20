(function($) {
	$('#test_container').prependTo('body');

	var svg = new MrNsegSVG;
	setTimeout(function() {
		try {
			module('MrNsegSVG');

			var nseg_chars = ['N', 'S', 'E', 'G'];
			var nseg_paths = [];
			$('#mr_nseg path').each(function(index) {
				nseg_paths[index] = $.trim(this.getAttribute('d'));
			});

			test('初期化', function() {
				equals(
					MrNsegSVG.attached, true,
					'初期化完了フラグが立っていること'
				);
				equals(
					$('body svg').length, 1,
					'SVGが1つだけロードされていること'
				);
			});

			svg.draw_path(function() {
				test('描画', function() {
					$('#mr_nseg path').each(function(index) {
						equals(
							nseg_paths[index],
							$.trim(this.getAttribute('d')),
							nseg_chars[index] + 'が描画されていること'
						);
					});
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
