// JavaScript for themezinho
$(document).ready(function() {
	"use strict";
	
	
	// FANCYBOX
	$(".fancybox").fancybox({
		helpers: {
		overlay: {
		  locked: false
			}
		  }
	});
	
	// STELLAR PARALLAX
		$.stellar({
			horizontalScrolling: false,
			verticalOffset: 0,
			responsive:true
		});
		
	
	// SMOOTH SCROLL
	$('header a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 500);
        return false;
      }
    }
  	});
	
	
	// SCREENSHOT
	$('.screenshot-carousel').owlCarousel({
		center: true,
       loop:true,
		nav:true,
	   	responsive:{
		479:{
            items:1,
			  nav:false,
        },
        767:{
            items:2,
			  nav:false,
        },
        990:{
            items:3
        },
		1290:{
            items:4
        }
	   }
    });
	
	
	
	// SCREENSHOT	
	$('.screenshot-carousel2').owlCarousel({
		center: true,
       loop:true,
		nav:true,
	   	responsive:{
		479:{
            items:1,
			  nav:false,
        },
        767:{
            items:2,
			  nav:false,
        },
        990:{
            items:3
        },
		1290:{
            items:4
        }
	   }
    });
	
	
	// TESTIMONIALS CAROUSEL
	$('.testimonials-carousel').owlCarousel({
		
	   items:1,
		nav:true,
		loop:true,
		responsive:{
        767:{
            items:1
        },
        990:{
            items:2
        }
	   }
    });
	
	
	// TEAM CAROUSEL
	$('.team-carousel').owlCarousel({
		
	   margin:80,
		nav:false,
		dots:true,
		loop:true,
		responsive:{
		479:{
            items:1
        },
		639:{
            items:1
        },
        766:{
            items:2
        },
        979:{
            items:4
        }
	   }
    });
	

});

// Wow animations
		wow = new WOW(
      	{
       		animateClass: 'animated',
        	offset:       50
      	}
    	);
    	wow.init();
	
	
	// COUNTER EFFECT
	var n = document.getElementById("counter");
		if (n == null) {
	} 
	else {
	
	var lastWasLower = false;
		$(document).scroll(function(){
		
		var p = $( "#counter" );
		var position = p.position();
		var position2 = position.top;
	
		if ($(document).scrollTop() > position2-300){
		if (!lastWasLower)
			$('#1').html('1376');
			$('#2').html('473');
			$('#3').html('23');
			$('#4').html('100');
	
		lastWasLower = true;
			} else {
		lastWasLower = false;
		}
		});		
	};