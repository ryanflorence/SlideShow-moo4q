SlideShow-moo4q
=============

SlideShow-moo4q is built on moo4q, check it out [here](http://moo4q.com).

Highly extensible slideshow widget. Use any element, not just images. Comes with packaged transitions but is easy to extend and create your own transitions.  The class is built to handle the _basics_ of a slideshow, extend it to implement your own navigation piece and custom transitions.

You can use this class to create slideshows, galleries, tabs, news tickers ... a lot of things.

Features:
---------

* Autoplay
* Reverse
* Show next slide
* Show previous slide
* Show arbitrary slide
* Transitions by slide
* Durations by slide
* Default transitions
* Default durations
* On-the-fly transitions

Packaged Transitions
--------------------

* fade
* crossFade
* fadeThroughBackground
* pushLeft, pushRight, pushUp, pushDown
* blindLeft, blindRight, blindUp, blindDown
* blindLeftFade, blindRightFade, blindUpFade, blindDownFade


How to use
----------

#### html

SlideShow can get the transition information from the class attribute of your slide.  It will only grab the immediate children of the container (`slides` in this case).  You can put whatever element type you want as the slides, and put anything inside of the slides.

    #HTML
    <div id="slides">
    	<div class="transition:crossFade duration:1000"     >1</div>
    	<div                                                >2</div> <!-- gets defaults -->
    	<div class="transition:blindRightFade duration:400" >3</div>
    	<div class="transition:fade           duration:1000">4</div>
    	<div class="transition:pushUp         duration:2000">5</div>
    	<div class="transition:pushDown       duration:500" >6</div>
    </div>

#### javascript

###### constructor

    #JS
    
		// jQuery API
    $('#slides').slideshow({
    	delay: 2000,
    	transition: 'fade',
    	duration: 500,
    	autoplay: true
    });

		// JavaScript native API
    mySlideShow2 = new SlideShow('#slideshow');

    
##### Controlling the slideshow

By default, `autoplay` is false and you're in charge of controlling the slideshow using the `show` method.  It takes a number for the index of the slide you want to show and a second argument for options.

    // show the 4th slide
		$('#slides).slideshow('show', 3); // jQuery API
    mySlideShow.show(3);              // Native API    

SlideShow implements [Loop](http://mootools.net/forge/p/loop) so it inherits `startLoop` and `stopLoop`.  SlideShow creates aliases for these as `play` and `pause`.

	$('#slides').slideshow('play'); // jQuery API
	mySlideShow.play();             // Native API
    
	// later
	$('#slides').slideshow('pause');
	mySlideShow.pause();

If you wanted a navigation piece you could do something like:

    $$('.some-elements-in-the-same-order-as-the-slides').click(function(){
			$('#slides').slideshow('show', $(this).index());
    });
    
#### css

SlideShow will set the position of your container to `relative` if it is not already positioned `absolute`.  It will also set all of your slides to `position: absolute`, `display: block`, and `z-index: 0`.  Because they are positioned absolutely you'll need to give them a width.  Also, you'll usually want to set the container overflow to hidden in your CSS.

    #CSS
    div#slideshow {
    	width: 500px;
    	height: 280px;
    	overflow: hidden;
    }

    div#slideshow div {
      width: 500px
    	height: 280px;
    }    

Extending SlideShow with your own transitions
---------------------------------------------

Adding transitions is a snap.  The Class itself has an `add` function that takes two arguments: the name of the transition, and the function to control it.

The function signature:

  function(previous, next, duration, instance)

* `previous` is the previous slide element reference
* `next` is the next slide element reference
* `duration` is how long the transition should last.
* `instance` is the instance of SlideShow, handy to find the size of the container (`instance.element`) or any other information.

When writing your own transitions there are a few things to note:

1. The previous slide's `z-index` is `1` so it's on top.
2. The next slide's `z-index` is `0` so it's behind.
3. Both slides have `top: 0` and `left:0`, so you'll need to reposition `next` for any fancy movement.
4. All other slides have `display:none`
5. When the `duration` is met, the previous slide will be reset to `display: none`, `top:0`, `left:0`.
 
So here are a few examples:

	SlideShow.add('fade', function(previous, next, duration, instance){
		previous.fadeOut(duration);
		return this;
	});

Pretty simple.  Since the next slide is directly behind the previous, we can just fade out the previous slide and there's our new one.

    SlideShow.add('blindLeft', function(previous, next, duration, index){
			var distance = instance.element.css('width').toInt();
			next
				.css({
					'left': distance,
					'z-index': 1
				})
				.animate({'left': 0}, d);
			return this;
		});

A bit more complicated.  First we have to measure the distance our slide needs to travel, then we set it's `left` style to be totally out of the slideshow view and change it's `z-index` from `0` to `2` so it's above the previous slides `z-index: 1`.  Once it's all setup we just tween left back to 0.  Our slide smoothly slides over the the previous slide.
    
    SlideShow.add('blindLeftFade',function(p, n, d, i){
      this.blindLeft(p,n,d,i).fade(p,n,d,i);
    });
    
`this` references the object containing all of the transitions _so you can chain effects_.


View the [MooDoc](http://moodocs.net/rpflo/mootools-rpflo/SlideShow) for more usage and examples (MooTools, but pretty much every method is there).
