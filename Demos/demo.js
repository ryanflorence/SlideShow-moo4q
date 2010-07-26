$(function(){
	
	$('#slides').slideshow({
		autoplay: true,
		duration: 2000,
		delay: 2500
	})
	
	// Event demonstration
	$('#slides').slideshow('addEvents', {
		onShow:         function(){ $('#onShow')        .effect('highlight'); },
		onShowComplete: function(){ $('#onShowComplete').effect('highlight'); },
		onReverse:      function(){ $('#onReverse')     .effect('highlight'); },
		onPlay:         function(){ $('#onPlay')        .effect('highlight'); },
		onPause:        function(){ $('#onPause')       .effect('highlight'); }
	});
	
	// the rest of the demo showing how to control the instance
	var toggled = [$('#show'), $('#showNext'), $('#showPrevious'), $('#showIndex')];
	
	$('#pause').bind('click',function(){
		// call the pause method
		$('#slides').slideshow('pause')
		// disable buttons
		toggled.each(function(button){ 
			button     .attr('disabled', false);	
		});
		$(this)      .attr('disabled', true);
		$('#play')   .attr('disabled', false);
		$('#reverse').attr('disabled', true);
	});
	
	$('#play').bind('click',function(){
		// call the play method
		$('#slides').slideshow('play')
		// disable buttons
		toggled.each(function(button){
			button     .attr('disabled', true);
		});
		$(this)      .attr('disabled', true);
		$('#pause')  .attr('disabled', false);
		$('#reverse').attr('disabled', false);
	});
	
	$('#reverse').bind('click',function(){
		$('#slides').slideshow('reverse')
	});
	
	$('#show').bind('click',function(){
		// the show method takes an index, and some option
		// if you want to change up the transition on-the-fly
		$('#slides').slideshow('show', 4, {
			duration: 3000,
			transition: 'fadeThroughBackground'
		});
	});
	
	$('#showIndex').bind('click',function(){
		$('#slides').slideshow('show', 0)
	});
	
	$('#showNext').bind('click',function(){
		$('#slides').slideshow('showNext');
	});
	
	$('#showPrevious').bind('click',function(){
		$('#slides').slideshow('showPrevious');
	});
	
})