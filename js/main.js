;(function () {
	
	'use strict';



	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	var fullHeight = function() {

		if ( !isMobile.any() ) {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('height', $(window).height());
			});
		}

	};


	var counter = function() {
		$('.js-counter').countTo({
			 formatter: function (value, options) {
	      return value.toFixed(options.decimals);
	    },
		});
	};


	var counterWayPoint = function() {
		if ($('#colorlib-counter').length > 0 ) {
			$('#colorlib-counter').waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {
					setTimeout( counter , 400);					
					$(this.element).addClass('animated');
				}
			} , { offset: '90%' } );
		}
	};

	// Animations
	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated');
							} else {
								el.addClass('fadeInUp animated');
							}

							el.removeClass('item-animate');
						},  k * 200, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '85%' } );
	};


	var burgerMenu = function() {

		$('.js-colorlib-nav-toggle').on('click', function(event){
			event.preventDefault();
			var $this = $(this);

			if ($('body').hasClass('offcanvas')) {
				$this.removeClass('active');
				$('body').removeClass('offcanvas');	
			} else {
				$this.addClass('active');
				$('body').addClass('offcanvas');	
			}
		});



	};

	// Click outside of offcanvass
	var mobileMenuOutsideClick = function() {

		$(document).click(function (e) {
	    var container = $("#colorlib-aside, .js-colorlib-nav-toggle");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {

	    	if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-colorlib-nav-toggle').removeClass('active');
			
	    	}
	    	
	    }
		});

		$(window).scroll(function(){
			if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-colorlib-nav-toggle').removeClass('active');
			
	    	}
		});

	};

	var clickMenu = function() {

		$('#navbar a:not([class="external"])').click(function(event){
			var section = $(this).data('nav-section'),
				navbar = $('#navbar');

				if ( $('[data-section="' + section + '"]').length ) {
			    	$('html, body').animate({
			        	scrollTop: $('[data-section="' + section + '"]').offset().top - 55
			    	}, 500);
			   }

		    if ( navbar.is(':visible')) {
		    	navbar.removeClass('in');
		    	navbar.attr('aria-expanded', 'false');
		    	$('.js-colorlib-nav-toggle').removeClass('active');
		    }

		    event.preventDefault();
		    return false;
		});


	};

	// Reflect scrolling in navigation
	var navActive = function(section) {

		var $el = $('#navbar > ul');
		$el.find('li').removeClass('active');
		$el.each(function(){
			$(this).find('a[data-nav-section="'+section+'"]').closest('li').addClass('active');
		});

	};

	var navigationSection = function() {

		var $section = $('section[data-section]');
		
		$section.waypoint(function(direction) {
		  	
		  	if (direction === 'down') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
	  		offset: '150px'
		});

		$section.waypoint(function(direction) {
		  	if (direction === 'up') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
		  	offset: function() { return -$(this.element).height() + 155; }
		});

	};






	var sliderMain = function() {
		
	  	$('#colorlib-hero .flexslider').flexslider({
			animation: "fade",
			slideshowSpeed: 5000,
			directionNav: true,
			start: function(){
				setTimeout(function(){
					$('.slider-text').removeClass('animated fadeInUp');
					$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
				}, 500);
			},
			before: function(){
				setTimeout(function(){
					$('.slider-text').removeClass('animated fadeInUp');
					$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
				}, 500);
			}

	  	});

	};

	var stickyFunction = function() {

		var h = $('.image-content').outerHeight();

		if ($(window).width() <= 992 ) {
			$("#sticky_item").trigger("sticky_kit:detach");
		} else {
			$('.sticky-parent').removeClass('stick-detach');
			$("#sticky_item").trigger("sticky_kit:detach");
			$("#sticky_item").trigger("sticky_kit:unstick");
		}

		$(window).resize(function(){
			var h = $('.image-content').outerHeight();
			$('.sticky-parent').css('height', h);


			if ($(window).width() <= 992 ) {
				$("#sticky_item").trigger("sticky_kit:detach");
			} else {
				$('.sticky-parent').removeClass('stick-detach');
				$("#sticky_item").trigger("sticky_kit:detach");
				$("#sticky_item").trigger("sticky_kit:unstick");

				$("#sticky_item").stick_in_parent();
			}
			

			

		});

		$('.sticky-parent').css('height', h);

		$("#sticky_item").stick_in_parent();

	};

	var owlCrouselFeatureSlide = function() {
		$('.owl-carousel').owlCarousel({
			animateOut: 'fadeOut',
		   animateIn: 'fadeIn',
		   autoplay: true,
		   loop:true,
		   margin:0,
		   nav:true,
		   dots: false,
		   autoHeight: true,
		   items: 1,
		   navText: [
		      "<i class='icon-arrow-left3 owl-direction'></i>",
		      "<i class='icon-arrow-right3 owl-direction'></i>"
	     	]
		})
	};

	var heroFrameSequence = function () {
		var hero = document.querySelector('.new-hero-section');
		var canvas = document.querySelector('.hero-canvas');
		if (!hero || !canvas) return;

		// ---- Configuration ----
		// Folder created by the notebook export.
		var framesDir = 'frames_hero_webp';
		var framePrefix = 'frame_';
		var frameDigits = 6;
		var frameExt = 'webp';
		// Update this if you export a different number of frames.
		var frameCount = 90;
		// Match your earlier behavior: 1200px scroll maps to the full sequence.
		var scrubDistance = 500;
		// Auto-play the sequence once on load (like the old video), then scrub.
		var autoPlayFps = 30;

		var ctx = canvas.getContext('2d', { alpha: false });
		if (!ctx) return;

		var dpr = window.devicePixelRatio || 1;
		var currentFrameIndex = frameCount - 1; // start on last frame
		var images = new Array(frameCount);
		var loaded = new Array(frameCount);
		var drawQueued = false;
		var heroTopAbs = null;
		var virtualScrollPx = 0;
		var lastTouchY = null;
		var scrubbingEnabled = false;
		var autoPlayEnabled = true;

		var clamp = function (value, min, max) {
			return Math.min(max, Math.max(min, value));
		};

		var pad = function (n, width) {
			var s = String(n);
			while (s.length < width) s = '0' + s;
			return s;
		};

		var frameUrl = function (index) {
			return framesDir + '/' + framePrefix + pad(index, frameDigits) + '.' + frameExt;
		};

		var ensureHeroTopAbs = function () {
			if (heroTopAbs != null) return;
			var rect = hero.getBoundingClientRect();
			heroTopAbs = (window.scrollY || 0) + rect.top;
		};

		var syncVirtualScrollToActual = function () {
			ensureHeroTopAbs();
			var actual = (window.scrollY || 0) - heroTopAbs;
			virtualScrollPx = clamp(actual, 0, scrubDistance);
		};

		var computeFrameIndexFromVirtualScroll = function () {
			var progress = virtualScrollPx / scrubDistance;
			progress = clamp(progress, 0, 1);
			// Scroll down rewinds (last -> first), scroll up plays forward.
			var idx = Math.round((1 - progress) * (frameCount - 1));
			return clamp(idx, 0, frameCount - 1);
		};

		var resizeCanvasToHero = function () {
			var rect = hero.getBoundingClientRect();
			// CSS sizes canvas; we set backing store for crispness.
			dpr = window.devicePixelRatio || 1;
			var w = Math.max(1, Math.floor(rect.width * dpr));
			var h = Math.max(1, Math.floor(rect.height * dpr));
			if (canvas.width !== w) canvas.width = w;
			if (canvas.height !== h) canvas.height = h;
			queueDraw();
		};

		var drawCover = function (img) {
			var cw = canvas.width;
			var ch = canvas.height;
			if (!cw || !ch) return;
			var iw = img.naturalWidth || img.width;
			var ih = img.naturalHeight || img.height;
			if (!iw || !ih) return;

			// object-fit: cover
			var scale = Math.max(cw / iw, ch / ih);
			var dw = iw * scale;
			var dh = ih * scale;
			var dx = (cw - dw) / 2;
			var dy = (ch - dh) / 2 * 0.6;

			ctx.clearRect(0, 0, cw, ch);
			ctx.drawImage(img, dx, dy, dw, dh);
		};

		var queueDraw = function () {
			if (drawQueued) return;
			drawQueued = true;
			window.requestAnimationFrame(function () {
				drawQueued = false;
				var img = images[currentFrameIndex];
				if (img && loaded[currentFrameIndex]) {
					drawCover(img);
				}
			});
		};

		var ensureFrameLoaded = function (index, onLoad) {
			if (index < 0 || index >= frameCount) return;
			if (loaded[index]) {
				if (typeof onLoad === 'function') onLoad();
				return;
			}
			if (!images[index]) {
				images[index] = new Image();
				images[index].decoding = 'async';
				images[index].loading = 'eager';
				images[index].src = frameUrl(index);
			}
			images[index].onload = function () {
				loaded[index] = true;
				if (typeof onLoad === 'function') onLoad();
			};
		};

		var preloadAllInBackground = function () {
			var i = 0;
			var pump = function () {
				var start = i;
				// Load a few at a time to avoid blocking.
				for (var k = 0; k < 4 && i < frameCount; k++, i++) {
					ensureFrameLoaded(i);
				}
				if (i >= frameCount) return;
				if (typeof window.requestIdleCallback === 'function') {
					window.requestIdleCallback(pump);
				} else {
					window.setTimeout(pump, 16);
				}
			};
			pump();
		};

		var setFrameIndex = function (index) {
			index = clamp(index, 0, frameCount - 1);
			if (index === currentFrameIndex) return;
			currentFrameIndex = index;
			ensureFrameLoaded(currentFrameIndex, queueDraw);
		};

		var enableScrollScrub = function () {
			autoPlayEnabled = false;
			scrubbingEnabled = true;
			ensureHeroTopAbs();
			syncVirtualScrollToActual();
			setFrameIndex(computeFrameIndexFromVirtualScroll());
		};

		var onWheel = function (e) {
			if (!scrubbingEnabled) return;
			virtualScrollPx = clamp(virtualScrollPx + (e.deltaY || 0), 0, scrubDistance);
			setFrameIndex(computeFrameIndexFromVirtualScroll());
		};

		var onTouchStart = function (e) {
			if (!e.touches || e.touches.length === 0) return;
			lastTouchY = e.touches[0].clientY;
		};

		var onTouchMove = function (e) {
			if (!scrubbingEnabled) return;
			if (!e.touches || e.touches.length === 0) return;
			if (lastTouchY == null) lastTouchY = e.touches[0].clientY;
			var yNow = e.touches[0].clientY;
			var delta = (lastTouchY - yNow);
			lastTouchY = yNow;
			virtualScrollPx = clamp(virtualScrollPx + delta, 0, scrubDistance);
			setFrameIndex(computeFrameIndexFromVirtualScroll());
		};

		var scrollRafLoop = function () {
			window.requestAnimationFrame(scrollRafLoop);
			if (!scrubbingEnabled) return;
			// When scrollY updates, keep virtual scrub position in sync.
			syncVirtualScrollToActual();
			setFrameIndex(computeFrameIndexFromVirtualScroll());
		};

		var autoPlayOnce = function () {
			if (!autoPlayEnabled) return;
			var startTime = null;
			var totalFrames = frameCount - 1;
			var durationMs = (frameCount / autoPlayFps) * 1000;

			var step = function (ts) {
				if (!autoPlayEnabled) return;
				if (startTime == null) startTime = ts;
				var elapsed = ts - startTime;
				var t = clamp(elapsed / durationMs, 0, 1);
				var idx = Math.round(t * totalFrames);
				setFrameIndex(idx);
				if (t >= 1) {
					// Land on last frame, then enable scrubbing.
					currentFrameIndex = totalFrames;
					queueDraw();
					enableScrollScrub();
					return;
				}
				window.requestAnimationFrame(step);
			};
			window.requestAnimationFrame(step);
		};

		// Initial setup
		resizeCanvasToHero();
		window.addEventListener('resize', resizeCanvasToHero);
		window.addEventListener('wheel', onWheel, { passive: true });
		window.addEventListener('touchstart', onTouchStart, { passive: true });
		window.addEventListener('touchmove', onTouchMove, { passive: true });
		window.requestAnimationFrame(scrollRafLoop);

		// Load the first frame immediately, start background preloading, then auto-play.
		ensureFrameLoaded(0, function () {
			setFrameIndex(0);
			queueDraw();
			preloadAllInBackground();
			autoPlayOnce();
		});
	};

	// Document on load.
	$(function(){
		fullHeight();
		counter();
		counterWayPoint();
		contentWayPoint();
		burgerMenu();

		clickMenu();
		// navActive();
		navigationSection();
		// windowScroll();


		mobileMenuOutsideClick();
		sliderMain();
		stickyFunction();
		owlCrouselFeatureSlide();
		heroFrameSequence();

		$('.scroll-down').on('click', function (event) {
			var $about = $('[data-section="about"]');
			if ($about.length) {
				$('html, body').animate({
					scrollTop: $about.offset().top - 55
				}, 600);
			}
			event.preventDefault();
			return false;
		});
	});


}());