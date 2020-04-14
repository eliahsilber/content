/*!
 * $Id: app.js 81703 2019-11-20 14:25:38Z sseiz $
 * Copyright Zeta Software GmbH
 */
/* jshint strict: false, multistr: true, smarttabs:true, jquery:true, devel:true */

document.documentElement.className = document.documentElement.className.replace(/no-js/g, 'js');

var nualc = navigator.userAgent.toLowerCase();
var lazyObserver;

$z.support.placeholder = (function(){
    var i = document.createElement('input');
    return 'placeholder' in i;
})();
$z.support.IntersectionObserver = 'IntersectionObserver' in window;
$z.support.beforeprint = 'onbeforeprint' in window;

var debug = false;
if (document.getElementsByTagName("html")[0].getAttribute("data-zpdebug") == "true") {
  debug = true;
  debuglog("Debug-output is: ON");
}
function debuglog(s, v, channel) {
	if (typeof(s)==='undefined') s = "";
	if (typeof(v)==='undefined') v = "";
	if (typeof(channel)==='undefined') channel = "log";

	if ( debug ){ 
		var ts = new Date();
		var pad = "000";
		var ms = ts.getMilliseconds().toString();
		var timestamp = ts.toLocaleTimeString("de-DE") + "." + pad.substring(0,pad.length - ms.length) + ms + ": ";
	
		var cmd = 'console.' + channel + '("' + timestamp + s + '"';
		if ( v !== ""){
			cmd += ',v';
		}
		cmd +=  ')';
	
		try { 
			eval(cmd);
		} 
		catch (e) { 
			//noop 
		}
	}
}

// run this before printing to i.e. change the dom
function zpPreparePrint(){		
	// load all lazy loading images
	$z("noscript.lazy").each(function(){
		var content = $z(this).text();
		$z(this).replaceWith(content);
	});
	$z("img.zplazyloading").each(function(){
		var source = $z(this).attr("data-src");
		$z(this).attr("src", source).removeClass("zplazyloading");
		$z(this).hide().show();
		//$z(this).clone().addClass("zplazyloadingclone printonly").insertAfter($z(this));
	});	
	$("window").trigger("resize").trigger("ready");
}

// function to preload images
function zpPreloadImage(url)
{
    var img=new Image();
    img.src=url;
}

// add classes to nav menus which help to decide wether hierarchies collapse left or right
function zpIsLeftOrRight(navselector){
	navselector = typeof navselector !== 'undefined' ? navselector : "ul.nav > li";
	$z(navselector).each(function(i,o){
		var current = $z(this);
		var elwidth = current.width();
		var elleft = current.offset().left;
		var elmiddle = elleft + (elwidth / 2);
		var helperClass = "zpisleft";
		
		if ( elmiddle >= $z(document).width()/2 ){
			helperClass = "zpisright";
		}
		current.removeClass('zpisleft zpisright');
		current.addClass(helperClass);
	});
}

// get a parameter from the querystring by name
function zpGetParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
// add or update a QueryString Parameter in a URL
function zpUpdateQueryStringParameter(uri, key, value) {
	var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	var separator = uri.indexOf('?') !== -1 ? "&" : "?";
	if (uri.match(re)) {
		// update parameter
		return uri.replace(re, '$1' + key + "=" + value + '$2');
	}
	else {
		// add parameter
		if ( typeof(value) !== "undefined" && value !== "" ){
			return uri + separator + key + "=" + value;
		}
	}
}

function zpTextOverflow(e, filler){
	filler = typeof filler !== 'undefined' ? filler : "…";
	
	$z(e).each(function(d){
		var wordcount = 0;
		var nodes = $z(this).find("*");
		var nodecount = nodes.length;
		var done = false;
		
		while ( !done && $z(this).overflown() && nodecount >= 0 ){
			//console.log(Date.now() + " Article No.:" + d + " Nodecount: " + nodecount);
			if ( nodecount > 0 ){
				var chtml = $z(nodes).eq(nodecount-1).html();
				var target = $z(nodes).eq(nodecount-1);
			}
			else{
				var chtml = $z(this).html();
				var target = $z(this);
			}
			var words = chtml.split(" ");
			
			for (i = words.length; i >= 0; i--){
				if ( i == words.length ){ // only runs this in the first iteration of the for loop
					// schnell an die richtige Wortanzahl rantasten, wenn mehr als 7 wörter durschsucht werden müssen.
					while ( i >=2 && $z(this).overflown() ){
						i = parseInt(i / 2);
						//console.log("    " + Date.now() + " Wordsestimate: " + i);
						$z(target).html(words.slice(0,i).join(" ") + filler);
					}
					i = i * 2;
				}
				//console.log("    Wordcount: " + i );
				if ( i > 0 ) {
					$z(target).html(words.slice(0,i).join(" ") + filler);
				}
				else{
					$z(target).remove();
				}
				if (!$z(this).overflown()){
					done = true;
					break;
				}
			}
			nodecount--;
		}
	});
};

//
// Debounce calls to "callback" routine so that multiple calls
// made to the event handler before the expiration of "delay" are
// coalesced into a single call to "callback". Also causes the
// wait period to be reset upon receipt of a call to the
// debounced routine.
//
function zpdebounce(delay, callback) {
    if (typeof(delay)==='undefined') delay = 250;
    var timeout = null;
    return function () {
        //
        // if a timeout has been registered before then
        // cancel it so that we can setup a fresh timeout
        //
        if (timeout) {
            clearTimeout(timeout);
        }
        var args = arguments;
        timeout = setTimeout(function () {
            callback.apply(null, args);
            timeout = null;
        }, delay);
    };
}
//
// Throttle calls to "callback" routine and ensure that it
// is not invoked any more often than "delay" milliseconds.
// http://blogorama.nerdworks.in/javascriptfunctionthrottlingan/
//
function zpthrottle(delay, callback) {
	if (typeof(delay)==='undefined') delay = 250;
    var timeout = null;
    var previousCall = new Date().getTime();
    return function() {
        var time = new Date().getTime();

        //
        // if "delay" milliseconds have expired since
        // the previous call then propagate this call to
        // "callback"
        //
        if ((time - previousCall) >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
            
             // make sure callback is called again in case event ended before timer elapsed
	    	if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(function () {
				callback.apply(null, arguments);
				timeout = null;
			}, delay);
        }
    };
}

function trace(s) {
  try { console.log(s); } catch (e) { alert(s); }
}

// test for touch device
function is_touch_device() {
	//return !!('ontouchstart' in window) || !!(navigator.msMaxTouchPoints) || !!(navigator.maxTouchPoints) || window.DocumentTouch && document instanceof DocumentTouch ;

	// use same logic as jquery.flexslider.js
	//var msGesture = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
    //touch = (( "ontouchstart" in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch);
    // in the responsive preview, we set the touch class manually, so we also need to check tor that, so we can simulate
	var touch = 'ontouchstart' in window || navigator.maxTouchPoints || $z('body').hasClass('touch');
	return touch;
}


// Helper for Nav-Menues with hover effects to make them work via alternating clicks
// 1st Click will open the Submenues, 2nd Click will load the link associated with the clicked element
function hoverToClickMenu(element, breakpointMobileMenu, instancenumber, triangleMode) { 
	//var listenEvent = 'ontouchend' in document.documentElement ? "touchend" : "click";
	var listenEvent = "click";
		
	// The stock browser on Android 4.X can't cancel touchend events and will thus always fire an additional click event, so we need to revert to click events StS 2015-02-24
	if ( nualc.indexOf("android 4") > -1 && nualc.indexOf("chrome") === -1 ) {
		listenEvent = "click";
	}
	
	/* clean up added styles after the user resizes the browser window and might reach desktop resolution */
	if ( instancenumber == 1 && (breakpointMobileMenu !== undefined || triangleMode)  ) {
			var menuResizeTimer;
			
			var clearAddedStyles = function(){
				if (  triangleMode || $z(window).width() > parseInt(breakpointMobileMenu) ){					
					$z(".hoverToClickMenuAdded").children("ul").css({'display' : '', 'visibility' : ''});
					$z(".hoverToClickMenuAdded").removeClass("clicked").removeClass("open").removeClass("hoverToClickMenuAdded");
				}
			};
			
			$z(window).resize(function(e) {
				clearTimeout(menuResizeTimer);
				menuResizeTimer = setTimeout(clearAddedStyles, 250);
			});
	}

	var firstClick = function(element, event) {
		var event = event || window.event;
		var mobileMenu = false;
		if ( breakpointMobileMenu !== undefined && $z(window).width() <= parseInt(breakpointMobileMenu) ){
			triangleMode = true;
			mobileMenu = true;
		}
		else if ( !is_touch_device() && breakpointMobileMenu !== undefined && listenEvent == "click" && $z(window).width() > parseInt(breakpointMobileMenu) ) {
			// we're NOT displaying a mobile menu on non-touch devices, so return and don't modify the click behavior
			return true;
		}
		
		if ( triangleMode ){
			if ( (event.pageX - $z(element).offset().left) <= parseInt($z(element).css("padding-left")) || (event.pageX - $z(element).offset().left) > (parseInt($z(element).css("padding-left")) + $z(element).width() -6) ){
				// user clicked on triangle to the left or right of a link
				var hasVisibleChilds = $z(element).parent().children("ul").css("display") == "block" && $z(element).parent().children("ul").css("visibility") == "visible";
				//var hasVisibleChilds = $z(element).parent().children("ul").is(":visible") && $z(element).parent().children("ul").css("visibility") !== "hidden";
				if ( hasVisibleChilds && ($z(element).parent().hasClass("open") ||  $z(element).parent().hasClass("active")) ){
					$z(element).parent().removeClass("clicked").removeClass("open").addClass("closed");
					$z(element).parent().children("ul").css({'display' : 'none', 'visibility' : ''});
					
					// remove manually set classes and styles on mouseout, so a consecutive mouseover on non touch devices will trigger the open state again
					if ( !is_touch_device() ){
						$z(element).parent().prevAll(".clicked").off("mouseleave.nav");
						$z(element).parent().off("mouseleave.nav");
						$z(element).parent().on("mouseleave.nav", function(e){
							// return if mobile menu is active
							if ( $z(element).parents("nav.on").length || $z(element).parents("#nav.on").length || mobileMenu ){
								//console.log("Mobile menu is didplayed. Returning early. breakpointMobileMenu: " + breakpointMobileMenu);
								return;
							}
							$z(element).parent().removeClass("hoverToClickMenuAdded").removeClass("clicked").removeClass("open").removeClass("closed");
							$z(element).parent().children("ul").css({'display' : '', 'visibility' : ''});
						});
					}
				}
				else{
					$z(element).parent().addClass("hoverToClickMenuAdded").removeClass("closed").addClass("clicked").addClass("open");
					$z(element).parent().children("ul").css({'display' : 'block', 'visibility' : 'visible'});
				}
				event.preventDefault();
				return false;
			}	
			else{
				// user clicked directly on link, so we load the url immediately
				return true;
			}
		}
		else{
			var otherMenus = $z(element).parent().prevAll(".clicked").add($z(element).parent().nextAll(".clicked"));
			otherMenus.removeClass("clicked").removeClass("open");
			otherMenus.find("ul").css({'display' : '', 'visibility' : ''});
			otherMenus.find(".clicked").removeClass("clicked");
			otherMenus.find(".open").removeClass("open");
			otherMenus.find(".hoverToClickMenuAdded").removeClass("hoverToClickMenuAdded");
			var hasVisibleChilds = $z(element).parent().children("ul").css("display") == "block" && $z(element).parent().children("ul").css("visibility") == "visible";
		
			if ( $z(element).parent().hasClass("clicked") || hasVisibleChilds ){ // TODO ZP13 check layouts for incompatibilities due to commenting out this: || ($z(element).parent().children("xul").css("display") == "block" && $z(element).parent().children("xul").css("visibility") == "visible") ) {
				// element has been clicked before, so now we fire a click
				return true;
			}
			// element has been clicked for the first time, so we do not fire a click and only show submenues
		
			// add ".open" classname to parent li element so we can style it if we want
			$z(element).parent().addClass("clicked").addClass("open");
			// in case suckerfish is used
			$z(element).parent().children("ul").css({'display' : 'block', 'visibility' : 'visible'});
			return false;
		}
	};
	$z(element).off("click touchend");
	$z(element).on( listenEvent , function(event) {
		var firstClickResult = firstClick($z(this), event);
		if ( !firstClickResult ){
			event.preventDefault();
		}
		return firstClickResult;
	});
}

// For IE8 and earlier version which don't have native support for Date.now.
if (!Date.now) {
  Date.now = function() {
    return new Date().valueOf();
  };
}

// polyfill for array.find (native substitute for underscrote _.find
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
if (!Array.prototype.find && Object.defineProperty) {
  Object.defineProperty(Array.prototype, 'find', {
	value: function(predicate) {
	 'use strict';
	 if (this == null) {
	   throw new TypeError('Array.prototype.find called on null or undefined');
	 }
	 if (typeof predicate !== 'function') {
	   throw new TypeError('predicate must be a function');
	 }
	 var list = Object(this);
	 var length = list.length >>> 0;
	 var thisArg = arguments[1];
	 var value;

	 for (var i = 0; i < length; i++) {
	   value = list[i];
	   if (predicate.call(thisArg, value, i, list)) {
		 return value;
	   }
	 }
	 return undefined;
	}
  });
}

// FIX Viewports for iOS Devices as they always report the short side for "device-width", even when in landscape
/*
if (navigator.userAgent.match(/xxiPhone/i) || navigator.userAgent.match(/xxiPad/i)) {
	var viewportmeta = $z('meta[name=viewport]'); //document.querySelector('meta[name="viewport"]');
	if (viewportmeta) {
		// set viewport on first page load if in portrait orientation
		if ( window.orientation !== 0 && window.orientation !== 180 ){
			viewportmeta.attr("content", "width=device-height, initial-scale=1.0");
		}
		// add eventListener so viewport is set when device is rotated after the initial page load
		document.addEventListener('orientationchange', function () {
			if ( window.orientation !== 0 && window.orientation !== 180 ){
				viewportmeta.attr("content", "width=device-height, initial-scale=1.0");
			}
			else{
				viewportmeta.attr("content", "width=device-width, initial-scale=1.0");
			}
		}, false);
	}
}
*/

// lets us define css classes which only apply after all assets are loaded
$z(window).on('load', function(){
	$z("body").addClass("loaded");
});
				
$z(document).ready(function () {
	var url = window.location.href;
	var responsivePreview = false;
	var pvmode = zpGetParameterByName("responsivepreview", url); //url.searchParams.get("responsivepreview");
	if ( pvmode ){
		responsivePreview = true;
		window.location = window.location.origin + "/supplemental-external-previewing/index.html?url=" + url;
		//alert("Responsive-Preview Reload");
	}
	
	if ( $z(".zpgrid").length === 0 ){
		// we have a layout that was not modified for ZP13 i.e. a copied Layout from Version 12.5 or earlier
		// layouts not modified have no div with class .zpgrid, so we append the class to the document body
		$z('.zparea[data-areaname="Standard"], .zparea[data-areaname="Banner"], .zparea[data-areaname="Footer"]').addClass("zpgrid copiedlayout");
	}

	//define some helper css classes
		$z("html").removeClass("no-js");
		$z("html, body").addClass("js");
		// recognize IE (since IE10 doesn't support conditional comments anymore)
		// removed in jQuery 1.9, so be careful!
		if ( $z.browser.msie || !!navigator.userAgent.match(/Trident.*rv\:11\./) ) {
			$z("html").removeClass("notie");
			$z("html").addClass("ie");
			$z("html").addClass("ie" + parseInt($z.browser.version, 10));
		}
		else if( !!navigator.userAgent.match(/Edge\/\d\d/) ){
			$z("html").addClass("edge");
		}
		else if ($z.browser.mozilla){
			$z("html").addClass("mozilla");
		}
		else if ($z.browser.safari && !navigator.appVersion.match(/Chrome\//) ){
			$z("html").addClass("safari");
			if ( navigator.appVersion.match(/version\/(\d+)/i) ){
				$z("html").addClass("safari" + navigator.appVersion.match(/version\/(\d+)/i)[1]);
			}
		}
		
		// detect object-fit css support
		if ( document.createElement("detect").style.objectFit === "" ) {
			$z("body").addClass("objectfit");
		}
		
		// system prefers reduced motion (used i.e. to switch off animations in css)
		if ( window.matchMedia && window.matchMedia( "(prefers-reduced-motion: reduce)" ).matches ){
			$z("body").addClass("zpreducemotion");
		}
		
		// add a top-padding to html5 audio because firefox has a time indicator implemented as a bubble which would be cut off due to our overflow hidden grid system
		if ($z.browser.mozilla){
			$z("audio").animate({paddingTop: '+=12px'}, 0); // we only use .animate() here, as that is a convenient way to be able to add values to (possibly) existing values
		}
		
		if(is_touch_device()) {
			// add .touch class to body if we run on a touch device, so we can use the class in css (used e.g. in ONLINE-CMS)
			$z("body").removeClass("notouch");
			$z("body").addClass("touch");
			
			// fix for hover menues (which contain submenues) to make them work on touch devices
			var breakpointmobilemenu = $z(".clickhovermenu").data("breakpointmobilemenu");
			var trianglemode = $z(".clickhovermenu").data("trianglemode") || false;
			$z(".touchhovermenu li:has(li) > a").each(function(i){
				hoverToClickMenu(this, breakpointmobilemenu, i, trianglemode);
			});
		}
		else{
			// In case we want to substitute hover with click menues on non touch devices too
			$z("body").removeClass("touch");
			$z("body").addClass("notouch");
			var breakpointmobilemenu = $z(".clickhovermenu").data("breakpointmobilemenu");
			var trianglemode = $z(".clickhovermenu").data("trianglemode") || false;
			$z(".clickhovermenu li:has(li) > a").each(function(i){
				hoverToClickMenu(this, breakpointmobilemenu, i, trianglemode);
			});
		}
		
	// make sure, the mobile menu is closed, if a link to an article on the same page is clicked
	$z('#nav ul li a:not(#mobilenavtoggle), nav ul li a:not(#mobilenavtoggle), div.nav-collapse ul li a:not(#mobilenavtoggle):not(.btn-navbar)').on('click.closeafterclick', function(e){
	//$('.nav-collapse ul li a').on('click', function(e){
		//console.log("Clicked on nav. defaultPrevented: " + e.isDefaultPrevented() + " ", e);
		if ( !e.isDefaultPrevented() && $z(".btn-navbar[data-toggle], #mobilenavtoggle").is(":visible") ){
			$z('.btn-navbar[data-toggle], #mobilenavtoggle').click();
		}
	});
	
	// set correct dimensions for breakout elements which in CSS are only approximated due to problems with browsers handling scrollbars differently when using vw/vh
	function setBreakout(){
		var bodyWidth = $z("body").outerWidth();
		// any widget
		$z(".supportsbreakout body:not(.withnews) .zpBreakout:not(.hasNews):not(.zpwBild)").css("width",bodyWidth+"px").css("padding-left", "0").css("margin-left","calc(-" + bodyWidth/2 + "px + 50% )");
		$z("body.supportsbreakout:not(.withnews) .zpBreakout:not(.hasNews):not(.zpwBild)").css("width",bodyWidth+"px").css("padding-left", "0").css("margin-left","calc(-" + bodyWidth/2 + "px + 50% )");
		// image widget
		$z(".supportsbreakout body:not(.withnews) .zpColumn.c12 .zpwBild.zpBreakout:not(.hasNews), body.supportsbreakout:not(.withnews) .zpColumn.c12 .zpwBild.zpBreakout:not(.hasNews)").each( function(index, value){
			// adjust css of image wrapper
			$z(this).css("width",bodyWidth+"px").css("padding-left", "0").css("margin-left","calc(-" + bodyWidth/2 + "px + 50% )")
			// set image width to browser-window-width, so it also enlarges if necessary
			$z(this).find('img.singleImage').css('width', bodyWidth + 'px').css('max-width','none');
			// set width of image description to column-width and horizontally center it
			var columnWidth = parseInt($z(this).parent('.zpColumnItem').width()) + "px";
			$z(this).find('.imagedescription').css("max-width", columnWidth).css("margin-left", "auto").css("margin-right", "auto");
		});
	}
	
	setBreakout();
	
	$z(window).resize(zpdebounce(100, function(event) {
		setBreakout();
		// set some helper classnames on first level menu items to assist dropdown positioning
		zpIsLeftOrRight();
	}));
	
	// animate Containers on Scroll
	function isElementInViewport (el) {
		//special bonus for those using jQuery
		if (el instanceof jQuery) {
			el = el[0];
		}
		
		var rect = el.getBoundingClientRect();

		//document.documentElement.clientHeight is a fallback for IE8
		return ( (rect.top >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight) ) || (rect.bottom >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) );
	}
	
	var lastScrollTop = 0;
	var hasAnimatableContent = $z("body:not(.zpreducemotion) .zpanimate").length;
	if ( hasAnimatableContent ){
		if ( $z.support.IntersectionObserver ){
			var zpanimCallback = function(entries, observer) { 
				entries.forEach(function(entry) {
					if ( entry.isIntersecting ){
						//console.log("IntersectionObserver. Element became visible: ", entry.target);
						observer.unobserve(entry.target);
						$z(entry.target).find(".zpanimate").addBack().addClass("show");
					}
				});
			};
			var zpanimObserver = new IntersectionObserver(zpanimCallback, {rootMargin: '0px', threshold: 0});
		}
	
		// wrap animatable content in wrapper with overflow hidden to prevent scrollbars due to content shifted to the right
		$z('body:not(.zpreducemotion) .zpanimate.slideleft, body:not(.zpreducemotion) .zpanimate.floatin, body:not(.zpreducemotion) .zpanimate.zoomout').each(function(i, el){
			var inlineStyles = "width:" + $z(this).css("width") + ";";
			inlineStyles += "padding-left:" + $z(this).css("padding-left") + ";";
			inlineStyles += "margin-left: auto;";
			inlineStyles += "margin-right: auto;";
			inlineStyles += "padding-top: 0;";
			inlineStyles += "padding-bottom: 0;";
			var currentElement = $z(this);
			// remove margins from current element since they'll be applied to wrapper by the zpContainer/zpRow class css
			currentElement.css("margin-top", "0px");
			currentElement.css("margin-bottom", "0px");
			// depending if current Element is zpRow or zpContainer, use propper className in wrapper too, so the correct CSS applies to the wrapper
			var currentElementClass = "zpContainer";
			
			var currentContainerId = ''; // we set the wrapper to the same IDs, so the inline CSS applies to the wrappers too 
			var currentRowId = '';		 // and keeps margins etc. set in the "Darstellungs-Tab"
			if ( currentElement.hasClass("zpContainer") ){
				currentContainerId = ' id="container_' + currentElement.attr("data-zpleid") + '"';
			}
			if ( currentElement.hasClass("zpRow") ){
				currentRowId = ' data-row-id="' + currentElement.attr("data-row-id") + '"';
				currentElementClass = "zpRow";
			}
			if ( currentElement.hasClass("floatin") ){
				currentElementClass += " floatin";
			}
			if ( currentElement.hasClass("zpBreakout") ){
				currentElementClass += " zpBreakout";
			}
			// remove inline-scripts from ZP search-page as these destroy the dom during animation
			var currentScript = currentElement.find('script.zpsearchinlinescript').text();
			currentElement.find('script.zpsearchinlinescript').remove();
			currentElement.css("width", "100%").wrap('<div' + currentContainerId + currentRowId + ' class="zpanimatewrap ' + currentElementClass + '" style="' + inlineStyles + '">');
			// unwrap the content again after the animation finished to make sure it properly displays and doesn't get disturbed by the wrapper
			currentElement.off("webkitTransitionEnd.zpaniwrap otransitionend.zpaniwrap oTransitionEnd.zpaniwrap msTransitionEnd.zpaniwrap transitionend.zpaniwrap animationend.zpaniwrap" );
			currentElement.on( "webkitTransitionEnd.zpaniwrap otransitionend.zpaniwrap oTransitionEnd.zpaniwrap msTransitionEnd.zpaniwrap transitionend.zpaniwrap animationend.zpaniwrap", function(event) {
				if ( event && event.currentTarget == event.target ){
					//console.log(new Date().toISOString() + ": transitionEnd() Event:", event);
					if ( currentElement.parent().hasClass("zpanimatewrap") ){
						currentElement.addClass("played").unwrap(); // .played is used to avoid animations playing again if el is unwrapped
					}
					// reset added CSS – width and margins
					currentElement.css("width", "");
					currentElement.css("margin-top", "");
					currentElement.css("margin-bottom", "");	
				}
			});
		}); ;
		
		function doAnimations(e){
			var delay = 0;
			var st = $z(this).scrollTop();
			if (st > lastScrollTop){
				var scrollDirection = "down";
			}
			else{
				var scrollDirection = "up";
			}
			lastScrollTop = st;
			$z("body:not(.zpreducemotion) .zpanimate:not(.zppreview)").each(function(i, el){
				// find children with position fixed and hide them because they'd be positioned wrong
				var fixedChilds = $z(el).find('*').filter(function(){
					var $this = $(this);
					//return $this.css('position') == 'relative';
					return $this.css('position') == 'fixed';
				});
				fixedChilds.hide();
				
				$z(el).off("webkitTransitionEnd.zpaniend otransitionend.zpaniend oTransitionEnd.zpaniend msTransitionEnd.zpaniend transitionend.zpaniend animationend.zpaniend" );
				$z(el).on( "webkitTransitionEnd.zpaniend otransitionend.zpaniend oTransitionEnd.zpaniend msTransitionEnd.zpaniend transitionend.zpaniend animationend.zpaniend", function(event) {
					if ( event && event.currentTarget == event.target ){
						// remove animation classes so that fixed Widgets (e.g. Reservierungs-Popup) are placed correctly
						$z(el).removeClass("zpanimate show played slideleft slideright fadein floatin zoomout");
						// show fixed children again
						fixedChilds.fadeIn();
						// set breakout dimensions
						setBreakout();
					}
				});
				
				var viewportTestElement = el;
				// FYI: el is a Dom-Object, not a jQuery-Object
				if ( el.className.indexOf("floatin") !== -1 ){
					// Elements with Effect "Einschweben" have a translateY(50%) applied, so we need to get the proper .top coordinates of the parent-wrapper in order to find out if it's in viewport
					viewportTestElement = el.parentElement;
				}
				
				if ( $z.support.IntersectionObserver ){
					zpanimObserver.observe(viewportTestElement);
				}
				else{
					if ( isElementInViewport(viewportTestElement) ) {
						if ( ! $z(this).hasClass("show")){
							var currentElement = $z(this);
							// animate consecutively visible elements via setTimeout, so the elements are animated consecutive and not at the same time 
							if ( typeof this.timeoutId !== 'undefined' ) {
								clearTimeout(this.timeoutId);
							}
							this.timeoutId = setTimeout(function() { 
								currentElement.addClass("show");
							}, delay);
							delay += 250;
						}
					}
					else{
						// reset delay once we reach an element out of viewport, so once this reaches viewport, it isn't animated with delay
						delay = 0;
					}
				}
			});
		}
		
		$z(window).off('load.zpanim scroll.zpanim');
		$z(window).on('load.zpanim', doAnimations); 
		if ( ! $z.support.IntersectionObserver ){
			$z(window).on('scroll.zpanim', zpthrottle(50, doAnimations)); 
		}
	}
	
	// set some helper classnames on first level menu items to assist dropdown positioning
	zpIsLeftOrRight();
		
	// wire up xmenu language selection
	function setLanguageSelectWidth(element){
		// find the width of the selected element and set the width of the select accordingly, so the selected element will never be cut off
		var text = $z(element).find("option:selected").text() || "";
		$z('a.xmenulink').css("vertical-align","top");
		var itemwrapper = $z('i.zpextralang').attr('data-itemwrapper').split(',') || ["",""];
		var $link = $('<a class="xmenulink">').html(text);
		$link.insertBefore('i.zpextralang');
		
		// set styles, so it displays properly and width is calculated correctly
		$z('i.zpextralang').css('color', $link.css('color'));
		$z('i.zpextralang').css('line-height', $link.css('line-height'));
		$z('i.zpextralang').css('padding', $link.css('padding'));
		$z('i.zpextralang').css('margin-left', $link.css('margin-left'));
		$z('i.zpextralang').css('margin-top', $link.css('margin-top'));
		$z('i.zpextralang').css('margin-bottom', $link.css('margin-bottom'));
		$z('i.zpextralang').css('border-width', $link.css('border-width'));
		$z('i.zpextralang').css('border-style', $link.css('border-style'));
		
		$z(element).css('font-family', $link.css('font-family'));
		$z(element).css('font-size', $link.css('font-size'));
		$z(element).css('font-weight', $link.css('font-weight'));
		$z(element).css('font-style', $link.css('font-style'));
		$z(element).css('font-style', $link.css('font-style'));
		$z(element).css('text-shadow', $link.css('text-shadow'));
		$z(element).css('color', $link.css('color'));
		$z(element).css('text-decoration', $link.css('text-decoration'));
		
		// measure link-width
		var width = parseInt($link.innerWidth());// + 5;
		// remove link-element we only temporarily inserted to measure
		$link.remove();
		
		var arrowWidth = .5 *1.4142;// ".5em"; //parseInt($z(element).css("padding-right")) || 0;
		$z(element).css("width", "calc( "+ width + "px + " + arrowWidth + "em)");
	}
	$z('#zpextralang').each(function(){
		// set select width to width of selected option
		setLanguageSelectWidth(this); //$z('a.xmenulink').last();
	});

	$z('#zpextralang').on("change", function(){
		var url = this.value;
		if ( url ){
			//setLanguageSelectWidth(this);
			// go to the respective url
			window.location.href = url;
		}
	});
	
	// lazyLoad images when scrolled into view
	zpLoadMedia(null, function(){
		this.classList.add('zplazyloaded');
		this.classList.remove('zplazyloading');
	}, true);
	
	// js triggered by print	
	// print button in ZP is clicked
	if ( zpGetParameterByName("zpprint", window.location.href) === "1" ){
		zpPreparePrint();
	}
	// FF and IE
	if ( $z.support.beforeprint ){
		window.addEventListener('beforeprint', function(){
			zpPreparePrint();
			//console.log('onbeforeprint');
		});
		
		window.addEventListener('afterprint', function(){
			$z('.chromeprintwarning').remove();
			//console.log('onafterprint');
		});
	}
	// Chrome etc.
	else{
		var mediaQueryList = window.matchMedia('print');
		mediaQueryList.addListener(function(mql) {
			if (mql.matches) {
				// executed before print
				zpPreparePrint();
				//console.log('onbeforeprint equivalent');
			} else {
				// executed after print
				//console.log('onafterprint equivalent');
			}
		});
    }
    
	
});

// define zp Namespace for later use in individual widgets
var zp = {  
}; // end zp

// test HTML5 field-type support and store it in zp.html5support
zp.html5support = {number: false, email: false, tel: false, url: false, date: false, time: false, color: false, search: false};
var tester = document.createElement('input');
for(var i in zp.html5support){
	// Use try/catch because IE9 throws "Invalid Argument" when trying to use unsupported input types
	try {
		tester.type = i;
		if(tester.type === i){
			zp.html5support[i] = true;
		}
	} catch (e){}
}

(function($){
	// make $z.unique also work on arrays and not only DOM-Elements (without this, we have a problem with the EventCalendars in Chrome)
	// http://stackoverflow.com/a/7366133
    var _old = $.unique;
    $.unique = function(arr){
        // do the default behavior only if we got an array of elements
        if ( arr.length == 0  || !!arr[0].nodeType){
            return _old.apply(this,arguments);
        }
        else {
            // reduce the array to contain no dupes via grep/inArray
            return $.grep(arr,function(v,k){
                return $.inArray(v,arr) === k;
            });
        }
    };
    
    // custom function to shorten and suffix text with _filler_ to make it fit its container - StS 2016-10-27
    // call it like this: $z(".mySelector").fitText();
    $.fn.fitText = function( filler ){
    	filler = typeof filler !== 'undefined' ? filler : "…";
    	
		zpTextOverflow(this, filler);
	
		return this;
	}
	
	// custom function to find out if content of an element is overflowing 
	$.fn.overflown=function(direction){
		if (typeof(direction)==='undefined') direction = "any";
		var e=this[0];
		var buffer = 4; // needs to be greater than value + buffer to be considered overflown. Compensates Browser rounding-bugs(cough, IE)…
		if ( typeof e !== "undefined" ){
			switch(direction) {
				case "x":
					return e.scrollWidth>(e.clientWidth+buffer);
					break;
				case "y":
					return e.scrollHeight>(e.clientHeight+buffer);
					break;
				default:
					return e.scrollHeight>(e.clientHeight+buffer)||e.scrollWidth>(e.clientWidth+buffer);
			}
		}
		else{
			return false;
		}
	}
})($z);

/*!
  stickybits - Stickybits is a lightweight alternative to `position: sticky` polyfills
  @version v3.6.1
  @link https://github.com/dollarshaveclub/stickybits#readme
  @author Jeff Wainwright <yowainwright@gmail.com> (https://jeffry.in)
  @license MIT
*/
!function(t){"function"==typeof define&&define.amd?define(t):t()}(function(){"use strict";var s=function(){function t(t,s){var e=void 0!==s?s:{};this.version="3.6.1",this.userAgent=window.navigator.userAgent||"no `userAgent` provided by the browser",this.props={customStickyChangeNumber:e.customStickyChangeNumber||null,noStyles:e.noStyles||!1,stickyBitStickyOffset:e.stickyBitStickyOffset||0,parentClass:e.parentClass||"js-stickybit-parent",scrollEl:"string"==typeof e.scrollEl?document.querySelector(e.scrollEl):e.scrollEl||window,stickyClass:e.stickyClass||"js-is-sticky",stuckClass:e.stuckClass||"js-is-stuck",stickyChangeClass:e.stickyChangeClass||"js-is-sticky--change",useStickyClasses:e.useStickyClasses||!1,useFixed:e.useFixed||!1,useGetBoundingClientRect:e.useGetBoundingClientRect||!1,verticalPosition:e.verticalPosition||"top"},this.props.positionVal=this.definePosition()||"fixed",this.instances=[];var i=this.props,n=i.positionVal,o=i.verticalPosition,r=i.noStyles,a=i.stickyBitStickyOffset,l=i.useStickyClasses,c="top"!==o||r?"":a+"px",f="fixed"!==n?n:"";this.els="string"==typeof t?document.querySelectorAll(t):t,"length"in this.els||(this.els=[this.els]);for(var u=0;u<this.els.length;u++){var p=this.els[u];if(p.style[o]=c,p.style.position=f,"fixed"===n||l){var h=this.addInstance(p,this.props);this.instances.push(h)}}}var s=t.prototype;return s.definePosition=function(){var t;if(this.props.useFixed)t="fixed";else{for(var s=["","-o-","-webkit-","-moz-","-ms-"],e=document.head.style,i=0;i<s.length;i+=1)e.position=s[i]+"sticky";t=e.position?e.position:"fixed",e.position=""}return t},s.addInstance=function(t,s){var e=this,i={el:t,parent:t.parentNode,props:s};this.isWin=this.props.scrollEl===window;var n=this.isWin?window:this.getClosestParent(i.el,i.props.scrollEl);return this.computeScrollOffsets(i),i.parent.className+=" "+s.parentClass,i.state="default",i.stateContainer=function(){return e.manageState(i)},n.addEventListener("scroll",i.stateContainer),i},s.getClosestParent=function(t,s){var e=s,i=t;if(i.parentElement===e)return e;for(;i.parentElement!==e;)i=i.parentElement;return e},s.getTopPosition=function(t){if(this.props.useGetBoundingClientRect)return t.getBoundingClientRect().top+(this.props.scrollEl.pageYOffset||document.documentElement.scrollTop);for(var s=0;s=t.offsetTop+s,t=t.offsetParent;);return s},s.computeScrollOffsets=function(t){var s=t,e=s.props,i=s.el,n=s.parent,o=!this.isWin&&"fixed"===e.positionVal,r="bottom"!==e.verticalPosition,a=o?this.getTopPosition(e.scrollEl):0,l=o?this.getTopPosition(n)-a:this.getTopPosition(n),c=null!==e.customStickyChangeNumber?e.customStickyChangeNumber:i.offsetHeight,f=l+n.offsetHeight;return s.offset=a+e.stickyBitStickyOffset,s.stickyStart=r?l-s.offset:0,s.stickyChange=s.stickyStart+c,s.stickyStop=r?f-(i.offsetHeight+s.offset):f-window.innerHeight,s},s.toggleClasses=function(t,s,e){var i=t,n=i.className.split(" ");e&&-1===n.indexOf(e)&&n.push(e);var o=n.indexOf(s);-1!==o&&n.splice(o,1),i.className=n.join(" ")},s.manageState=function(t){var s=t,e=s.el,i=s.props,n=s.state,o=s.stickyStart,r=s.stickyChange,a=s.stickyStop,l=e.style,c=i.noStyles,f=i.positionVal,u=i.scrollEl,p=i.stickyClass,h=i.stickyChangeClass,d=i.stuckClass,y=i.verticalPosition,k="bottom"!==y,g=function(t){t()},m=this.isWin&&(window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame)||g,v=this.toggleClasses,C=this.isWin?window.scrollY||window.pageYOffset:u.scrollTop,w=k&&C<=o&&("sticky"===n||"stuck"===n),S=a<=C&&"sticky"===n;o<C&&C<a&&("default"===n||"stuck"===n)?(s.state="sticky",m(function(){v(e,d,p),l.position=f,c||(l.bottom="",l[y]=i.stickyBitStickyOffset+"px")})):w?(s.state="default",m(function(){v(e,p),v(e,d),"fixed"===f&&(l.position="")})):S&&(s.state="stuck",m(function(){v(e,p,d),"fixed"!==f||c||(l.top="",l.bottom="0",l.position="absolute")}));var b=r<=C&&C<=a;return C<r/2||a<C?m(function(){v(e,h)}):b&&m(function(){v(e,"stub",h)}),s},s.update=function(t){void 0===t&&(t=null);for(var s=0;s<this.instances.length;s+=1){var e=this.instances[s];if(this.computeScrollOffsets(e),t)for(var i in t)e.props[i]=t[i]}return this},s.removeInstance=function(t){var s=t.el,e=t.props,i=this.toggleClasses;s.style.position="",s.style[e.verticalPosition]="",i(s,e.stickyClass),i(s,e.stuckClass),i(s.parentNode,e.parentClass)},s.cleanup=function(){for(var t=0;t<this.instances.length;t+=1){var s=this.instances[t];s.props.scrollEl.removeEventListener("scroll",s.stateContainer),this.removeInstance(s)}this.manageState=!1,this.instances=[]},t}();if("undefined"!=typeof window){var t=window.$z||window.$||window.jQuery||window.Zepto;t&&(t.fn.stickybits=function(t){return new s(this,t)})}});

/*!
	The MIT License (MIT)

	lazy-progressive-enhancement.js – Copyright (c) 2016 Tyler Deitz
	https://github.com/tvler/lazy-progressive-enhancement
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/
/* @license
lazy-progressive-enhancement.js
https://github.com/tvler/lazy-progressive-enhancement
The MIT License (MIT)
Copyright (c) 2016 Tyler Deitz
*/

/**
 * Loads media, hooking an optional onload function,
 * optionally loading when scrolled into the viewport.
 *
 * @param {String | NodeList | Element} [media]
 *        String - (optional) A CSS selector targeting the noscript elements to be loaded.
 *        NodeList - (optional) A nodelist of noscript elements to be loaded.
 *        Element - (optional) A singular noscript element to be loaded.
 *        If not defined, targets every 'noscript' element on the page.
 * @param {Function} [onloadfn] - (optional) The onload function fired for each targeted element.
 * @param {Boolean} [scroll] - (optional) Load image when scrolled into the viewport.
 */
function zpLoadMedia(media, onloadfn, scroll) {

   'use strict'

   var intervals = []
   var observerOptions = {
	  rootMargin: '300px',
	  threshold: 0
   }
   
   function getNextSiblings(el, filter) {
		var siblings = [];
		while (el= el.nextSibling) { if (!filter || filter(el)) siblings.push(el); }
		return siblings;
   }
   function siblingFilter(el) {
		if (el.className){
			return el.className.indexOf("zplazyloadingclone") !== -1
		}
		else{
			return false;
		}
   }
   var observerCallback = function(entries, observer) { 
	  entries.forEach(function(entry) {
		if ( entry.isIntersecting ){
			//console.log("in observer callback. LazyLoading image: ", entry.target);
			var img = entry.target;
			img.onload = onloadfn;
			img.src = img.getAttribute('data-src');
			img.removeAttribute('data-src');
			if ( img.getAttribute('data-srcset') ){
				img.srcset = img.getAttribute('data-srcset');
				img.removeAttribute('data-srcset');
			}
			// remove the image clone we added for print only
			$z(img).nextAll(".zplazyloadingclone.printonly").remove();			
			
			// preload lightbox image
			$z(img).parents("a.preloadimg").each(function(){
				zpPreloadImage($z(this).attr("href"));
			});
			
			observer.unobserve(entry.target);
		}
	  });
	};

   // Fires replaceNoscript either on DOMContentLoaded or after
   // @see https://gist.github.com/tvler/8fd53d11ed775ebc72419bb5d96b8696
   // @author tvler
   function onwheneva() {
     replaceNoscript(media)
   }

   document.readyState !== 'loading' ? onwheneva() :
    document.addEventListener('DOMContentLoaded', onwheneva)

   function scrollVisibility(timg, tsrc, tsrcset, imdgid) {
      var rect = timg.getBoundingClientRect(),
          offset = 300
      if (
         (rect.bottom >= -offset && rect.top - window.innerHeight < offset) &&
         (rect.right >= -offset && rect.left - window.innerWidth < offset)
      ) {
         clearInterval(intervals[imdgid])
         timg.onload = onloadfn
         timg.src = timg.getAttribute('data-src');
		 timg.removeAttribute('data-src');
                   
         // preload lightbox image
		 $z(timg).parents("a.preloadimg").each(function(){
		 	zpPreloadImage($z(this).attr("href"));
		 });
			
         // remove the image clone we added for print only
		 $z(timg).nextAll(".zplazyloadingclone.printonly").remove();			
      }
   }

   function replaceNoscript(media) {
      var noscript, img, src, srcset, parent, i = 0,

      // Smallest data URI image possible for a transparent image
      // @see http://stackoverflow.com/questions/6018611/smallest-data-uri-image-possible-for-a-transparent-image
      // @author layke
      tempSrc = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

      if (media == null || typeof media === 'string') {
         media = document.body.querySelectorAll(media || 'noscript.lazy')
      } else if (!media.length) {
         media = [media]
      }
      if ( $z.support.IntersectionObserver ){
      	lazyObserver = new IntersectionObserver(observerCallback, observerOptions);
      }
      
      // polyfill to support old browsers (and our screenshot-tool)
   	  (function(DOMParser) {
			"use strict";

			var proto = DOMParser.prototype, 
				nativeParse = proto.parseFromString;

			// Firefox/Opera/IE throw errors on unsupported types
			try {
				// WebKit returns null on unsupported types
				if ((new DOMParser()).parseFromString("", "text/html")) {
					// text/html parsing is natively supported
					return;
				}
			} catch (ex) {}

			proto.parseFromString = function(markup, type) {
				if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
					var
					  doc = document.implementation.createHTMLDocument("")
					;
						if (markup.toLowerCase().indexOf('<!doctype') > -1) {
							doc.documentElement.innerHTML = markup;
						}
						else {
							doc.body.innerHTML = markup;
						}
					return doc;
				} else {
					return nativeParse.apply(this, arguments);
				}
			};
	  }(DOMParser));

      while (noscript = media[i++]) {
         // Create an img element in a DOMParser so the image won't load.
         //.replace("src=", "data-src=") before creating an img dom node to prevent preloading of src
         img = document.importNode((new DOMParser()).parseFromString(noscript.textContent.replace("src=", "data-src="), 'text/html').body.firstChild, true);
         //img1 = document.importNode((new DOMParser()).parseFromString(noscript.textContent.replace("src=", "data-src="), 'text/html').body.firstChild, true)
         parent = noscript.parentElement

         if ( scroll ) {
         	img.classList.add('zplazyloading');
         	//img1.classList.add('zplazyloadingclone', 'printonly');
         	
         	// aded by StS – if possible, use IntersectionObserver to find out if an image gets into the viewport 
         	// which should be much faster than the built in method with intervals
            if ( $z.support.IntersectionObserver ){
				srcset = img.getAttribute('srcset');
            	if ( srcset ){
            		img.setAttribute('data-srcset', srcset);
            	}
            	img.src = tempSrc;
				img.removeAttribute('srcset');
	            parent.replaceChild(img, noscript);
	            //$z(img1).insertAfter($z(img));

         		lazyObserver.observe(img);
         	}
         	else{
         		src = img.getAttribute('data-src');
				srcset = img.getAttribute('srcset');
            	if ( srcset ){
            		img.setAttribute('data-srcset', srcset);
            	}
            	img.setAttribute('src', tempSrc);
				img.removeAttribute('srcset')
	            parent.replaceChild(img, noscript);
	            //$z(img1).insertAfter($z(img));
         		intervals[i] = setInterval(scrollVisibility, 100, img, src, srcset, i);
         	}
         } else {
            img.onload = onloadfn
            parent.replaceChild(img, noscript)
         }
      }
      // trigger a resize event, so i.e. zpBreakout Images get scaled correctly
      $z(window).trigger('resize');
   }
}




/*!
 * END $Id: app.js 81703 2019-11-20 14:25:38Z sseiz $ 
 */


