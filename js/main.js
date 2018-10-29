import scrollreveal from 'scrollreveal';
import 'jquery-mousewheel';
import 'slick-carousel';

if ( window.location.href.indexOf('51.255.207.53') !== -1 ) {
	window.crbSiteData.homeUrl = 'http://51.255.207.53/plesk-site-preview/jigtalk.co/51.255.207.53/';
}

const $win = $(window);
const $doc = $(document);
const tabletBreakpoint = 1024;
const rev = scrollreveal();
const animationTimeout = 100;

let pageLoader;

let lastChange = 0;
let endIntroAnimation = 0;

const puzzleUnveilOrder = [0,3,15,12,4,7,1,13,8,11,2,14,5,10,9,6];
const largestPuzzleUnveilOrderIndex = puzzleUnveilOrder.length - 1;
const smallestPuzzleUnveilOrderIndex = 0;
let currentPuzzlePieceIndex = -1;
let canScroll = true;

let puzzleInterval;

initPopups();
mobileSliderInit();




$win.on('load', function(){
	crb_tweak_mobile_svg();

	rev.reveal('.video-phone', {
		duration : 0,
		viewFactor: 1,
		afterReveal : function (domEl) {
			$(domEl).addClass('playing');
			$(domEl).find('video').get(0).play();
		}
	});

	rev.reveal('.faces', {
		duration : 0,
		viewOffset : {
			bottom: 100,
		},
		afterReveal : function (domEl) {
			if ( winWidth() <= tabletBreakpoint ) {
				$(domEl).addClass('no-opacity')
				$(domEl).find('.face:first-child').addClass('no-opacity animated');
				$(domEl).find('.face:last-child').addClass('no-opacity animated');

				setTimeout(function() {
					puzzlePiecesAnimation();
				}, animationTimeout);
			}
		}
	});

	$('body').addClass('loaded');
});


$doc.on('mousewheel', handleMouseWheel);
$win.on('load', function () {
	setTimeout(handleMouseWheel, 0);
});
function handleMouseWheel(event) {
	if ( winWidth() <= tabletBreakpoint ) {
		return;
	}
	const $container = $('.section-faces');

	if (!$container.length) {
		return;
	}

	let winScroll = $win.scrollTop();

	let offset = 300;
	let containerTop = parseInt($container.offset().top);
	let startAnimation = false;
	if ( ( winScroll >= containerTop - offset && winScroll <= containerTop + offset ) ) {
		startAnimation = true;
	}

	if ( startAnimation ) {
		if ( ! $('body').hasClass('scrolling-puzzle') ) {
			$('body').addClass('scrolling-puzzle');
			$container.find('.face:first-child').addClass('no-opacity animated');
			$container.find('.face:last-child').addClass('no-opacity animated');

			if ( ! $('body').hasClass('puzzle-animating') ) {
				$('body').addClass('puzzle-animating')
				setTimeout(function() {
					puzzlePiecesAnimation();
				}, animationTimeout);
			}
		}
	}
}

function winWidth() {
	return $win.width();
}

function puzzlePiecesAnimation() {
	let $puzzleWrap = $('.puzzle-pieces');

	clearInterval(puzzleInterval);
	let index = 0;
	let isIncrementing = true;
	puzzleInterval = setInterval(function(){
		if ( isIncrementing ) {
			animatePuzzlePieces(true, index);
			index++;
		} else {
			index--;
			animatePuzzlePieces(false, index);
		}

		if ( index >= puzzleUnveilOrder.length + 2 ) {
			isIncrementing = false;
		} else if ( index === - 2 ) {
			isIncrementing = true;
		}
	}, 300);
}

function animatePuzzlePieces(hidePiece, index) {
	let $puzzleWrap = $('.puzzle-pieces');

	let $puzzlePiece = $puzzleWrap.find('img:eq('+puzzleUnveilOrder[index]+')');
	if ( index < puzzleUnveilOrder.length && index >= 0 ) {
		$('.face:first-child .face__inner > img ').addClass('shakeLeft no-opacity animated-short');
		$('.face:last-child .face__inner > img ').addClass('shakeRight no-opacity animated-short');
	}

	if (hidePiece) {
		$puzzlePiece.hide(200, function(){
		});

		setTimeout( function(){
			$('.face:first-child .face__inner > img ').removeClass('shakeLeft no-opacity animated-short');
			$('.face:last-child .face__inner > img ').removeClass('shakeRight no-opacity animated-short');
		}, 400)

	} else {
		$puzzlePiece.show(200, function(){
		});
		setTimeout(function(){
			$('.face:first-child .face__inner > img ').removeClass('shakeLeft no-opacity animated-short');
			$('.face:last-child .face__inner > img ').removeClass('shakeRight no-opacity animated-short');
		}, 400)
	}
}
