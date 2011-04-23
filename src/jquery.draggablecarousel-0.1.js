/*
 * jQuery draggableCarousel
 * http://appzen.org/
 *
 * Copyright (c) 2011 Carlos Roberto Gomes Júnior
 * Licensed under a Creative Commons Attribution 3.0 License
 * http://creativecommons.org/licenses/by-sa/3.0/
 * 
 * Dependencies
 *  jQuery Library, 
 *  jQuery UI Draggable, 
 *  jQuery Easing (optional) for custom transitions
 *
 * Version: 0.1
 */
(function() {

jQuery.fn.draggableCarousel = function(options) {
   
   settings = jQuery.extend({
       'linkNext'           :   '.draggablecarousel-next',
       'linkPrev'           :   '.draggablecarousel-prev',
       'transition'         :   !!$.easing['easeOutBack'] ? 'easeOutBack' : '',
       'transitionDuration' :   500,
       'keyControls'        :   false,
   }, options);
   
   
    
   return this.each(function(){
       var $this = $(this);
       
       $this.addClass( "draggablecarousel-container" );
        var draggableElement = $this.children( "ul" );
       draggableElement.addClass( "draggablecarousel-draggable" );
       draggableElement.children('li').addClass( "draggablecarousel-item" );
       
       $this.data( 'currentElement', draggableElement.children( 'li' ).eq(0) )

       goTo = function( key, sender ) {
           var currentElement = sender.parent().data('currentElement');
           
           if ( key == 'next' || key == 'prev' ) {
               var next = currentElement[ key ]();
           } else if ( typeof(k) == 'number' ) {
               var next = currentElement.parent().children('li').eq( key );
           } else {
               return;
           }

           if ( next[0] != null ) {
               var nextPosition = next.position().left;
               sender.stop().animate({'left': -nextPosition }, settings.transitionDuration, settings.transition);
           } else {
               try{
                   sender.stop().animate({'left': -currentElement.position().left }, settings.transitionDuration, settings.transition);
               } catch(e) {}
           }
           sender.parent().data('currentElement', ( next[0] != undefined || next[0] != null ) ? next : currentElement )
       }

       draggableElement.width( ( parseInt(draggableElement.children('li').width()) + parseInt(draggableElement.children('li').css('margin-right')) ) * draggableElement.find('li').length )

       draggableElement.draggable({

           axis: "x",
           handle: 'li',

           create: function( ev, ui ) {
               
               if ( settings.keyControls ) {
                   $(document).bind('keydown', function(e) {
                       var keyCode = e.keyCode || e.which,
                           arrow = {left: 37, up: 38, right: 39, down: 40 },
                           target = null;

                       switch( keyCode ){
                           // tecla right
                           case arrow.right:
                           goTo('next', draggableElement );
                           break;

                           // tecla left
                           case arrow.left:
                           goTo('prev', draggableElement );
                           break;
                       }
                   });
               }

           },

           start: function( event, ui ) {
               start = ui.position.left;
               draggableElement.css( 'cursor', 'move' );
           },

           stop: function( event, ui ){
               draggableElement.css( 'cursor', 'auto' );
               stop = ui.position.left;
               moveDirection = ( ( start < stop ) ? 'rigth' : 'left' );
               if ( moveDirection == 'left' ) {
                   goTo( 'next', ui.helper);
               } else if ( moveDirection == 'rigth' ){
                   goTo( 'prev', ui.helper);
               }
           }
       });

       draggableElement.children( 'li' ).bind('mousedown touchstart', function(event) {
           $this.data( 'currentElement', $(this) );
       });

       $(settings.linkPrev).bind('click', function(event) {
           event.preventDefault();
           goTo('prev', draggableElement );
       });

       $(settings.linkNext).bind('click', function(event) {
           event.preventDefault();
           goTo('next', draggableElement );
       });


       // Mobiles
       var isTouchScreen  = navigator.userAgent.match(/iPhone|iPod|iPad|Android/i) ? 1 : 0;
       var lastCpos = 0, lastLeft = 0;

       draggableElement.bind('touchstart', function(e){
           var cpos = draggableElement.position().left;
           lastCpos = cpos;

           if( isTouchScreen ) e = e.originalEvent.touches[0];

           var sY = e.pageY, sX = e.pageX;

           draggableElement.bind('touchmove',function( ev ){

               if( isTouchScreen ){
                   ev.preventDefault();
                   ev = ev.originalEvent.touches[0];
               }                        

               var left = cpos+(ev.pageX-sX);

               try{
                   draggableElement.css({ 'left' : left });
                   lastLeft = left;
               } catch(e) {}

           });

           draggableElement.bind('touchend',function( ev ){

               if ( lastCpos > lastLeft ) {
                   goTo('next', draggableElement );
               } else if ( lastCpos < lastLeft ) {
                   goTo('prev', draggableElement );
               }

               draggableElement.unbind('touchmove touchend');
           });

       });
       
   });
  
};

})(jQuery);