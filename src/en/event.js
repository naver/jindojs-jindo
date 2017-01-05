/**
 
 * @fileOverview A file to define the constructor and methods of $Event
 * @name event.js
  
 */

/**
 
 * Creates a $Event object from the JavaScript Core event object.
 * @class A Wrapper class of a JavaScript Event object. A developer can recognize an object in which the event occurred by using the $Event.element method.
 * @param {Event} e The Event object
 * @constructor
 * @description [Lite]
 * @author Kim, Taegon
  
 */
jindo.$Event = function(e) {
	var cl = arguments.callee;
	if (e instanceof cl) return e;
	if (!(this instanceof cl)) return new cl(e);

	if (typeof e == "undefined") e = window.event;
	if (e === window.event && document.createEventObject) e = document.createEventObject(e);

	this._event = e;
	this._globalEvent = window.event;

    /**  
     
Event types
  
     */
	this.type = e.type.toLowerCase();
	if (this.type == "dommousescroll") {
		this.type = "mousewheel";
	} else if (this.type == "domcontentloaded") {
		this.type = "domready";
	}

	this.canceled = false;

	/**  
     
The element in which the event occurred
  
     */
	this.element = e.target || e.srcElement;
    /**
     
The element in which an event has defined
  
     */
	this.currentElement = e.currentTarget;
    /**
     
The related element of an event
  
     */
	this.relatedElement = null;

	if (typeof e.relatedTarget != "undefined") {
		this.relatedElement = e.relatedTarget;
	} else if(e.fromElement && e.toElement) {
		this.relatedElement = e[(this.type=="mouseout")?"toElement":"fromElement"];
	}
}

/**
 
 * Returns the button and wheel information of a mouse event.
 * @description [Lite]
 * @example
function eventHandler(evt) {
   var mouse = evt.mouse();

   mouse.delta;   // Number. The degree of wheel movement. Returns positive numbers if the wheel is scrolled upward, or negative numbers if the wheel is scrolled downward.
   mouse.left;    // Boolean. true if the left mouse button is held down, false otherwise.
   mouse.middle;  // Boolean. true if the middle mouse button is held down, false otherwise.
   mouse.right;   // Boolean. true if the right mouse button is held down, false otherwise.
}
 * @return {Object} Returns an object that has mouse information. For attributes of the returned object, see the example.
  
 */
jindo.$Event.prototype.mouse = function() {
	var e    = this._event;
	var delta = 0;
	var left = false,mid = false,right = false;

	var left  = e.which ? e.button==0 : !!(e.button&1);
	var mid   = e.which ? e.button==1 : !!(e.button&4);
	var right = e.which ? e.button==2 : !!(e.button&2);
	var ret   = {};

	if (e.wheelDelta) {
		delta = e.wheelDelta / 120;
	} else if (e.detail) {
		delta = -e.detail / 3;
	}

	ret = {
		delta  : delta,
		left   : left,
		middle : mid,
		right  : right
	};
	// replace method
	this.mouse = function(){ return ret };

	return ret;
};

/**
 
 * Returns keyboard event information.
 * @description [Lite]
 * @example
function eventHandler(evt) {
   var key = evt.key();

   key.keyCode; // Number. The key code of a keyboard to be held down.
   key.alt;     // Boolean. true if the Alt key is held down.
   key.ctrl;    // Boolean. true if the Ctrl key is held down.
   key.meta;    // Boolean. true if the Meta key is held down. The Meta key is used to detect command keys of Mac.
   key.shift;   // Boolean. true if the Shift key is held down.
   key.up;      // Boolean. true if the up arrow key is held down.
   key.down;    // Boolean. true if the down arrow key is held down.
   key.left;    // Boolean. true if the left arrow key is held down.
   key.right;   // Boolean. true if the right arrow key is held down.
   key.enter;   // Boolean. true if the return key is held down.
   key.esc;   // Boolean. true if the ESC key is held down.
   }
}
 * @return {Object} Returns the held-down key value of a keyboard event. For the object attributes, see the example.
  
 */
jindo.$Event.prototype.key = function() {
	var e     = this._event;
	var k     = e.keyCode || e.charCode;
	var ret   = {
		keyCode : k,
		alt     : e.altKey,
		ctrl    : e.ctrlKey,
		meta    : e.metaKey,
		shift   : e.shiftKey,
		up      : (k == 38),
		down    : (k == 40),
		left    : (k == 37),
		right   : (k == 39),
		enter   : (k == 13),		
		esc   : (k == 27)
	};

	this.key = function(){ return ret };

	return ret;
};

/**
 
 * Returns information on mouse cursor position.
 * @param {Boolean} bGetOffset Whether to compute offsetX and offsetY, the relative mouse positions to the current element. If it is set to true, the computed values will be obtained (offsetX and offsetY are available since 1.2.0). $Element must be included.
 * @description [Lite]
 * @example
function eventHandler(evt) {
   var pos = evt.pos();

   pos.clientX;  // Number. X coordinate of the current page
   pos.clientY;  // Number. Y coordinate of the current page
   pos.pageX;  // Number. X coordinate of the entire document
   pos.pageY;  // Number. Y coordinate of the entire document
   pos.layerX;  // Number. <b>deprecated.</b> The relative X coordinate to the element in which the event occurred
   pos.layerY;  // Number. <b>deprecated.</b> The relative Y coordinate to the element in which the event occurred
   pos.offsetX; // Number. The relative X coordinate of a mouse cursor to the element in which the event occurred (available since 1.2.0)
   pos.offsetY; // Number. The relative Y coordinate of a mouse cursor to the element in which the event occurred (available since 1.2.0)

}
 * @return {Object} Returns information on mouse cursor position. For the object attributes, see the example.
 * @remark The layerX and layerY is planned to be deprecated.
  
 */
jindo.$Event.prototype.pos = function(bGetOffset) {
	var e   = this._event;
	var b   = (this.element.ownerDocument||document).body;
	var de  = (this.element.ownerDocument||document).documentElement;
	var pos = [b.scrollLeft || de.scrollLeft, b.scrollTop || de.scrollTop];
	var ret = {
		clientX : e.clientX,
		clientY : e.clientY,
		pageX   : 'pageX' in e ? e.pageX : e.clientX+pos[0]-b.clientLeft,
		pageY   : 'pageY' in e ? e.pageY : e.clientY+pos[1]-b.clientTop,
		layerX  : 'offsetX' in e ? e.offsetX : e.layerX - 1,
		layerY  : 'offsetY' in e ? e.offsetY : e.layerY - 1
	};

    /*
     
As the method used for calculating offsets is CPU-intensive, use it only when necessary.
  
     */
	if (bGetOffset && jindo.$Element) {
		var offset = jindo.$Element(this.element).offset();
		ret.offsetX = ret.pageX - offset.left;
		ret.offsetY = ret.pageY - offset.top;
	}

	return ret;
};

/**
 
 * Stops the bubbling and default operation of an event.
 * @remark Bubbling is a phenomenon in which an event that occurred in a subnode is spreading through its supernodes, in specific HTML Elements. For example, clicking a div object creates an onclick event in a document, the super element, as well as div. The stop() method stops the bubbling so that an event can occur in specified events.
 * @description [Lite]
 * @example
// To stop only basic operations (available since 1.1.3)
function stopDefaultOnly(evt) {
	// Here is some code to execute

	// Stop default event only
	evt.stop($Event.CANCEL_DEFAULT);
}
 * @return {$Event} An event object
 * @param {Number} nCancel An event type to stop. It determines whether to stop either of a bubbling event or a default event, or both of them.
 To stop a bubbling event, $Event.CANCEL_BUBBLE should be used; to stop a default event, $Event.CANCEL_DEFAULT should be used; to stop both of them, $Event.CANCEL_ALL should be used.
 The default value is $Event.CANCEL_ALL (available since 1.1.3).
  
 */
jindo.$Event.prototype.stop = function(nCancel) {
	nCancel = nCancel || jindo.$Event.CANCEL_ALL;

	var e = (window.event && window.event == this._globalEvent)?this._globalEvent:this._event;
	var b = !!(nCancel & jindo.$Event.CANCEL_BUBBLE); // stop bubbling
	var d = !!(nCancel & jindo.$Event.CANCEL_DEFAULT); // stop default event

	this.canceled = true;

	if (typeof e.preventDefault != "undefined" && d) e.preventDefault();
	if (typeof e.stopPropagation != "undefined" && b) e.stopPropagation();

	if(d) e.returnValue = false;
	if(b) e.cancelBubble = true;

	return this;
};

/**
 
 * Stops the default operation of an event.
 * @return {$Event} An event object
 * @see $Event#stop
 * @description [Lite]
  
 */
jindo.$Event.prototype.stopDefault = function(){
	return this.stop(jindo.$Event.CANCEL_DEFAULT);
}

/**
 
 * Stops the bubbling of an event.
 * @return {$Event} An event object
 * @see $Event#stop
 * @description [Lite]
  
 */
jindo.$Event.prototype.stopBubble = function(){
	return this.stop(jindo.$Event.CANCEL_BUBBLE);
}

/**
 
 * Returns the original event object.
 * @example
	function eventHandler(evt){
		evt.$value();
	}
 * @return {Event} Event
  
 */
jindo.$Event.prototype.$value = function() {
	return this._event;
};

/**
 
 * Stops the bubbling of the $Event#stop method.
 * @final
  
 */
jindo.$Event.CANCEL_BUBBLE = 1;

/**
 
 * Stops the basic operation of the $Event#stop method.
 * @final
  
 */
jindo.$Event.CANCEL_DEFAULT = 2;

/**
 
 * Stops the bubbling and basic operation of the $Event#stop method.
 * @final
  
 */
jindo.$Event.CANCEL_ALL = 3;
