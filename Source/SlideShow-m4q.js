/*
---

script: SlideShow.js

description: Easily extendable, class-based, slideshow widget. Use any element, not just images. Comes with packaged transitions but is easy to extend and create your own transitions.  The class is built to handle the basics of a slideshow, extend it to implement your own navigation piece and custom transitions.

license: MIT-style license.

authors: Ryan Florence <http://ryanflorence.com>

requires:
- /Loop
- more:1.2.4.4:Fx.Elements

provides: [SlideShow]

...
*/


var SlideShow = new Class({
	
	Implements: [Options, Events, Loop],
		
	options: {
		/*
		onShow: $empty,
		onShowComplete: $empty,
		onReverse: $empty,
		onPlay: $empty,
		onPause: $empty,
		*/
		delay: 7000,
		transition: 'crossFade',
		duration: '500',
		autoplay: false
	},
	
	jQuery: 'slideshow',
	
	initialize: function(element, options){
		this.setOptions(options);
		this.setLoop(this.showNext, this.options.delay);
		this.element = jQuery(element);
		this.slides = this.element.children();
		this.current = jQuery(this.slides[0]);
		this.transitioning = false;
		this.setup();
		if (this.options.autoplay) this.play();
	},
	
	setup: function(){
	  this.setupElement().setupSlides(true);
		return this;
	},
	
	setupElement: function(){
		if (this.element.css('position') != 'absolute' && this.element[0] != document.body) this.element.css('position','rthis.elementative');
		return this;
	},
	
	setupSlides: function(hideFirst){
		var self = this;
		this.slides.each(function(index, slide){
			slide = jQuery(slide);
			self.storeTransition(slide).reset(slide);
			if (hideFirst && index != 0) slide.css('display','none');
		});
		return this;
	},
	
	storeTransition: function(slide){
		var classes = slide.attr('class');
		var transitionRegex = /transition:[a-zA-Z]+/;
		var durationRegex = /duration:[0-9]+/;
		var transition = (classes.match(transitionRegex)) ? classes.match(transitionRegex)[0].split(':')[1] : this.options.transition;
		var duration = (classes.match(durationRegex)) ? classes.match(durationRegex)[0].split(':')[1].toInt() : this.options.duration;
		slide.data('ssTransition', transition);
		slide.data('ssDuration', duration);
		return this;
	},
	
	resetOptions: function(options){
		this.options = $merge(this.options, options);
		this.setupSlides(false);
		return this;
	},
	
	getTransition: function(slide){
		return slide.data('ssTransition');
	},
	
	getDuration: function(slide){
		return slide.data('ssDuration');
	},
	
	show: function(slide, options){
		slide = (typeof slide == 'number') ? jQuery(this.slides[slide]) : jQuery(slide);
		if (slide[0] != this.current && !this.transitioning){
			this.transitioning = true;
			var transition = (options && options.transition) ? options.transition: this.getTransition(slide),
				duration = (options && options.duration) ? options.duration: this.getDuration(slide),
				previous = this.current.css('z-index', 1),
				next = this.reset(slide);
			var slideData = {
				previous: {
					element: previous,
					index: this.slides.index(previous)
				}, 
				next: {
					element: next,
					index: this.slides.index(next)
				}
			};
			this.fireEvent('show', slideData);
			this.transitions[transition](previous, next, duration, this);
			(function() { 
				previous.css('display','none');
				this.fireEvent('showComplete', slideData);
				this.transitioning = false;
			}).bind(this).delay(duration);
			this.current = next;
		}
		return this;
	},
	
	reset: function(slide){
		return jQuery(slide).css({
			'position': 'absolute',
			'z-index': 0,
			'display': 'block',
			'left': 0,
			'top': 0
		}).show();
	},
	
	nextSlide: function(){
		var next = this.current.next();
		return (next.length > 0) ? next : this.slides[0];
	},

	previousSlide: function(){
		var previous = this.current.prev();
		return (previous.length > 0) ? previous : this.slides.last();
	},
	
	showNext: function(options){
		this.show(this.nextSlide(), options);
		return this;
	},
	
	showPrevious: function(options){
		this.show(this.previousSlide(), options);
		return this;
	},
	
	play: function(){
		this.startLoop();
		this.fireEvent('play');
		return this;
	},
	
	pause: function(){
		this.stopLoop();
		this.fireEvent('pause');
		return this;
	},
	
	reverse: function(){
		var fn = (this.loopMethod == this.showNext) ? this.showPrevious : this.showNext;
		this.setLoop(fn, this.options.delay);
		this.fireEvent('reverse');
		return this;
	}
	
});


SlideShow.adders = {
	
	transitions:{},
	
	add: function(className, fn){
		this.transitions[className] = fn;
		this.implement({
			transitions: this.transitions
		});
	},
	
	addAllThese : function(transitions){
		$A(transitions).each(function(transition){
			this.add(transition[0], transition[1]);
		}, this);
	}
	
}

$extend(SlideShow, SlideShow.adders);
SlideShow.implement(SlideShow.adders);

SlideShow.add('fade', function(previous, next, duration, instance){
	previous.fadeOut(duration);
	return this;
});

SlideShow.addAllThese([

	['none', function(previous, next, duration, instance){
		previous.css('display','none');
		return this;
	}],

	['crossFade', function(previous, next, duration, instance){
		previous.fadeOut(duration);
		next.fadeIn(duration);
		return this;
	}],
	
	['fadeThroughBackground', function(previous, next, duration, instance){
		var half = duration/2;
		next.hide();
		previous.fadeOut(half, function(){
			next.fadeIn(half);
		});
	}],

	['pushLeft', function(p, n, d, i){
		var distance = i.element.css('width').toInt();
		n.css('left', distance);
		[n, p].each(function(slide){
			var to = slide.css('left').toInt() - distance;
			slide.animate({'left': to}, d);
		});
		return this;
	}],
	
	['pushRight', function(p, n, d, i){
		var distance = i.element.css('width').toInt();
		n.css('left', -distance);
		[n, p].each(function(slide){
			var to = slide.css('left').toInt() + distance;
			slide.animate({'left': to}, d);
		});
		return this;
	}],
	
	['pushDown', function(p, n, d, i){
		var distance = i.element.css('height').toInt();
		n.css('top', -distance);
		[n, p].each(function(slide){
			var to = slide.css('top').toInt() + distance;
			slide.animate({'top': to}, d);
		});
		return this;
	}],
	
	['pushUp', function(p, n, d, i){
		var distance = i.element.css('height').toInt();
		n.css('top', distance);
		[n, p].each(function(slide){
			var to = slide.css('top').toInt() - distance;
			slide.animate({'top': to}, d);
		});
		return this;
	}],
	
	['blindLeft', function(p, n, d, i){
		var distance = i.element.css('width').toInt();
		n
			.css({
				'left': distance,
				'z-index': 1
			})
			.animate({'left': 0}, d);
		return this;
	}],

	['blindRight', function(p, n, d, i){
		var distance = i.element.css('width').toInt();
		n
			.css({
				'left': -distance,
				'z-index': 1
			})
			.animate({'left': 0}, d);
		return this;
	}],
		
	['blindUp', function(p, n, d, i){
		var distance = i.element.css('height').toInt();
		n
			.css({
				'top': distance,
				'z-index': 1
			})
			.animate({'top': 0}, d);
		return this;
	}],
	
	['blindDown', function(p, n, d, i){
		var distance = i.element.css('height').toInt();
		n
			.css({
				'top': -distance,
				'z-index': 1
			})
			.animate({'top': 0}, d);
		return this;
	}],

	['blindDownFade', function(p,n,d,i){ this.blindDown(p,n,d,i).fade(p,n,d,i); }],

	['blindUpFade', function(p,n,d,i){ this.blindUp(p,n,d,i).fade(p,n,d,i); }],

	['blindLeftFade', function(p,n,d,i){ this.blindLeft(p,n,d,i).fade(p,n,d,i); }],

	['blindRightFade', function(p,n,d,i){ this.blindRight(p,n,d,i).fade(p,n,d,i); }]

]);
