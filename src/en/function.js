/**
 
 * @fileOverview A file to define the constructor and methods of $Fn
 * @name function.js
  
 */

/**
 
 * Returns the $Fn object.
 * @extends core
 * @class The $Fn class is a Wrapper class of the JavaScript Function object.
 * @constructor
 * @param {Function | String} func
 * <br>
 * A Function object or a string that represents a function parameter
 * @param {Object | String} thisObject
 * <br>
 * A string that represents a function body. If the function is an method of a specific object, the object is passed as well.
 * @return {$Fn} The $Fn object
 * @see $Fn#toFunction
 * @description [Lite]
 * @example
func : function() {
       // code here
}

var fn = $Fn(func, this);
 * @example
var someObject = {
    func : function() {
       // code here
   }
}

var fn = $Fn(someObject.func, someObject);

 * @example
var fn = $Fn("a, b", "return a + b;");
var result = fn.$value()(1, 2) // result = 3;

// fn wraps the same function as function(a, b){ return a + b;}, a function literal.

 * @author Kim, Taegon
  
 */
jindo.$Fn = function(func, thisObject) {
	var cl = arguments.callee;
	if (func instanceof cl) return func;
	if (!(this instanceof cl)) return new cl(func, thisObject);

	this._events = [];
	this._tmpElm = null;
	this._key    = null;

	if (typeof func == "function") {
		this._func = func;
		this._this = thisObject;
	} else if (typeof func == "string" && typeof thisObject == "string") {
		//this._func = new Function(func, thisObject);
		this._func = eval("false||function("+func+"){"+thisObject+"}")
	}
}
/**
 
 * userAgent cache
 * @ignore
  
 */
var _ua = navigator.userAgent;
/**
 
 * The $value method returns the original Function object.
 * @return {Function} The function object
 * @description [Lite]
 * @example
func : function() {
	// code here
}

var fn = $Fn(func, this);
     fn.$value(); // Returns the original function.
  
 */
jindo.$Fn.prototype.$value = function() {
	return this._func;
};

/**
 
 * The bind method returns a Function object whose function was bounded to work as a method.
 * @return {Function} The Function object that was bounded by the metodh of thisObject.
 * @description [Lite]
 * @example
var sName = "OUT";
var oThis = {
    sName : "IN"
};

function getName() {
    return this.sName;
}

oThis.getName = $Fn(getName, oThis).bind();

alert( getName() );       	  //  OUT
alert( oThis.getName() ); //   IN

 * @example
// When declaring a function first and the using it later,
// use bind because the function refers to the values used at the time of execution, not the values used at the time of creation.
for(var i=0; i<2;i++){
	aTmp[i] = function(){alert(i);}
}

for(var n=0; n<2;n++){
	aTmp[n](); // Executes alter only the number 2 two times.
}

for(var i=0; i<2;i++){
aTmp[i] = $Fn(function(nTest){alert(nTest);}, this).bind(i);
}

for(var n=0; n<2;n++){
	aTmp[n](); // Executes alter the number 0 and 1.
}

 * @example
// Use bind so that it cannot get beyond the scope when using a function as a parameter upon creation of classes.
var MyClass = $Class({
	fFunc : null,
	$init : function(func){
		this.fFunc = func;

		this.testFunc();
	},
	testFunc : function(){
		this.fFunc();
	}
})
var MainClass = $Class({
	$init : function(){
		var oMyClass1 = new MyClass(this.func1);
		var oMyClass2 = new MyClass($Fn(this.func2, this).bind());
	},
	func1 : function(){
		alert(this);// this means MyClass.
	},
	func2 : function(){
		alert(this);// this means MainClass.
	}
})
function init(){
	var a = new MainClass();
}
  
*/
jindo.$Fn.prototype.bind = function() {
	var a = jindo.$A(arguments).$value();
	var f = this._func;
	var t = this._this;

	var b = function() {
		var args = jindo.$A(arguments).$value();

		// fix opera concat bug
		if (a.length) args = a.concat(args);

		return f.apply(t, args);
	};
	return b;
};

/**
 
 * bingForEvent binds an object and method and returns them as one event handler Function.
 * @param {Element, ...} [elementN] The value to pass together with an event object
 * @see $Fn#bind
 * @see $Event
 * @description [Lite]
 * @ignore
  
 */
jindo.$Fn.prototype.bindForEvent = function() {
	var a = arguments;
	var f = this._func;
	var t = this._this;
	var m = this._tmpElm || null;

	var b = function(e) {
		var args = Array.prototype.slice.apply(a);
		if (typeof e == "undefined") e = window.event;

		if (typeof e.currentTarget == "undefined") {
			e.currentTarget = m;
		}
		var oEvent = jindo.$Event(e);
		args.unshift(oEvent);

		var returnValue = f.apply(t, args);
		if(typeof returnValue != "undefined" && oEvent.type=="beforeunload"){
			e.returnValue =  returnValue;
		}
		return returnValue;
	};

	return b;
};

/**
 
 * The attach method assigns a function to an event handler of a specific element.<br>
 * If the return value is false, be careful that you do not use it because the default features of Internet Explorer will be blocked when it is binding to $Fn.
<ul>
	<li>Do not use the prefix on for event names.</li>
	<li>Use the mouse wheel scroll event with mousewheel.</li>
	<li>The domready, mouseenter, mouseleave, and mousewheel events can be used in addition to the default events.</li>
</ul>
 * @param {Element | Array} oElement The element to assign an event handler (an array that contains HTML Elements can be used).
 * @param {String} sEvent The event type
 * @param {Boolean} bUseCapture When using capturing (available since 1.4.2)
 * @see $Fn#detach
 * @description [Lite]
 * @return {$Fn} The $Fn object created
 * @example
var someObject = {
    func : function() {
		// code here
   }
}

$Fn(someObject.func, someObject).attach($("test"),"click"); // Assigns click to a single element.
$Fn(someObject.func, someObject).attach($$(".test"),"click"); // Assigns click to multiple elements.
// If an element array is given to attach as a first parameter, all corresponding events will be binded.       
  
 */
jindo.$Fn.prototype.attach = function(oElement, sEvent, bUseCapture) {
	var fn = null, l, ev = sEvent, el = oElement, ua = _ua;
	
	if (typeof bUseCapture == "undefined") {
		bUseCapture = false;
	};
	
	this._bUseCapture = bUseCapture;

	if ((el instanceof Array) || (jindo.$A && (el instanceof jindo.$A) && (el=el.$value()))) {
		for(var i=0; i < el.length; i++) this.attach(el[i], ev, bUseCapture);
		return this;
	}

	if (!el || !ev) return this;
	if (typeof el.$value == "function") el = el.$value();

	el = jindo.$(el);
	ev = ev.toLowerCase();
	
	this._tmpElm = el;
	fn = this.bindForEvent();
	this._tmpElm = null;
	var bIsIE = ua.indexOf("MSIE") > -1;
	if (typeof el.addEventListener != "undefined") {
		if (ev == "domready") {
			ev = "DOMContentLoaded";	
		}else if (ev == "mousewheel" && ua.indexOf("WebKit") < 0 && !/Opera/.test(ua) && !bIsIE) {
			/*
			 
DOMMouseScroll is not working in Internet Explorer 9.
  
			 */
			ev = "DOMMouseScroll";	
		}else if (ev == "mouseenter" && !bIsIE){
			ev = "mouseover";
			fn = jindo.$Fn._fireWhenElementBoundary(el, fn);
		}else if (ev == "mouseleave" && !bIsIE){
			ev = "mouseout";
			fn = jindo.$Fn._fireWhenElementBoundary(el, fn);
		}else if(ev == "transitionend"||ev == "transitionstart"){
			var sPrefix, sPostfix = ev.replace("transition","");
			
			sPostfix = sPostfix.substr(0,1).toUpperCase() + sPostfix.substr(1);
			
			if(typeof document.body.style.WebkitTransition !== "undefined"){
				sPrefix = "webkit";
			}else if(typeof document.body.style.OTransition !== "undefined"){
				sPrefix = "o";
			}else if(typeof document.body.style.MsTransition !== "undefined"){
				sPrefix = "ms";
			}
			ev = (sPrefix?sPrefix+"Transition":"transition")+sPostfix;
			this._for_test_attach = ev;
			this._for_test_detach = "";
		}else if(ev == "animationstart"||ev == "animationend"||ev == "animationiteration"){
			var sPrefix, sPostfix = ev.replace("animation","");
			
			sPostfix = sPostfix.substr(0,1).toUpperCase() + sPostfix.substr(1);
			
			if(typeof document.body.style.WebkitAnimationName !== "undefined"){
				sPrefix = "webkit";
			}else if(typeof document.body.style.OAnimationName !== "undefined"){
				sPrefix = "o";
			}else if(typeof document.body.style.MsTransitionName !== "undefined"){
				sPrefix = "ms";
			}
			ev = (sPrefix?sPrefix+"Animation":"animation")+sPostfix;
			this._for_test_attach = ev;
			this._for_test_detach = "";
		}
		el.addEventListener(ev, fn, bUseCapture);
	} else if (typeof el.attachEvent != "undefined") {
		if (ev == "domready") {
            /*
             
An error is thrown because the domready is not executed within iframe.
  
             */
			if(window.top != window) throw new Error("Domready Event doesn't work in the iframe.");
			jindo.$Fn._domready(el, fn);
			return this;
		} else {
			el.attachEvent("on"+ev, fn);
		}
	}
	
	if (!this._key) {
		this._key = "$"+jindo.$Fn.gc.count++;
		jindo.$Fn.gc.pool[this._key] = this;
	}

	this._events[this._events.length] = {element:el, event:sEvent.toLowerCase(), func:fn};

	return this;
};

/**
 
 * The detach method releases functions that was assigned as the event handlers of elements.
 * @remark Do not use the prefix on for event names.
 * @remark Use the mouse wheel scroll with mousewheel.
 * @param {Element} oElement The element to release an event handler.
 * @param {String} sEvent The event type
 * @see $Fn#attach
 * @description [Lite]
 * @return {$Fn} The $Fn object created
 * @example
var someObject = {
    func : function() {
		// code here
   }
}

$Fn(someObject.func, someObject).detach($("test"),"click"); // Assigns click to a single element.
$Fn(someObject.func, someObject).detach($$(".test"),"click"); // Assigns click to multiple elements.
  
 */
jindo.$Fn.prototype.detach = function(oElement, sEvent) {
	var fn = null, l, el = oElement, ev = sEvent, ua = _ua;
	
	if ((el instanceof Array) || (jindo.$A && (el instanceof jindo.$A) && (el=el.$value()))) {
		for(var i=0; i < el.length; i++) this.detach(el[i], ev);
		return this;
	}

	if (!el || !ev) return this;
	if (jindo.$Element && el instanceof jindo.$Element) el = el.$value();

	el = jindo.$(el);
	ev = ev.toLowerCase();

	var e = this._events;
	for(var i=0; i < e.length; i++) {
		if (e[i].element !== el || e[i].event !== ev) continue;
		
		fn = e[i].func;
		this._events = jindo.$A(this._events).refuse(e[i]).$value();
		break;
	}

	if (typeof el.removeEventListener != "undefined") {
		
		if (ev == "domready") {
			ev = "DOMContentLoaded";
		}else if (ev == "mousewheel" && ua.indexOf("WebKit") < 0) {
			ev = "DOMMouseScroll";
		}else if (ev == "mouseenter"){
			ev = "mouseover";
		}else if (ev == "mouseleave"){
			ev = "mouseout";
		}else if(ev == "transitionend"||ev == "transitionstart"){
			var sPrefix, sPostfix = ev.replace("transition","");
			
			sPostfix = sPostfix.substr(0,1).toUpperCase() + sPostfix.substr(1);
			
			if(typeof document.body.style.WebkitTransition !== "undefined"){
				sPrefix = "webkit";
			}else if(typeof document.body.style.OTransition !== "undefined"){
				sPrefix = "o";
			}else if(typeof document.body.style.MsTransition !== "undefined"){
				sPrefix = "ms";
			}
			ev = (sPrefix?sPrefix+"Transition":"transition")+sPostfix;
			this._for_test_detach = ev;
			this._for_test_attach = "";
		}else if(ev == "animationstart"||ev == "animationend"||ev == "animationiteration"){
			var sPrefix, sPostfix = ev.replace("animation","");
			
			sPostfix = sPostfix.substr(0,1).toUpperCase() + sPostfix.substr(1);
			
			if(typeof document.body.style.WebkitAnimationName !== "undefined"){
				sPrefix = "webkit";
			}else if(typeof document.body.style.OAnimationName !== "undefined"){
				sPrefix = "o";
			}else if(typeof document.body.style.MsTransitionName !== "undefined"){
				sPrefix = "ms";
			}
			ev = (sPrefix?sPrefix+"Animation":"animation")+sPostfix;
			this._for_test_detach = ev;
			this._for_test_attach = "";
		}
		if (fn) el.removeEventListener(ev, fn, false);
	} else if (typeof el.detachEvent != "undefined") {
		if (ev == "domready") {
			jindo.$Fn._domready.list = jindo.$Fn._domready.list.refuse(fn);
			return this;
		} else {
			el.detachEvent("on"+ev, fn);
		}
	}

	return this;
};

/**
 
 * The delay method invokes a wrapped function after a specified period of time has elapsed.
 * @param {Number} nSec Waiting time until a function is invoked (in seconds)
 * @param {Array} args A parameter to use when invoking a function. Use an array if multiple parameters are required.
 * @see $Fn#bind
 * @see $Fn#setInterval
 * @description [Lite]
 * @return {$Fn} The $Fn object created
 * @example
function func(a, b) {
	alert(a + b);
}

$Fn(func).delay(5, [3, 5]);// Invokes the function func that uses the values of 3 and 5 as parameters after 5 seconds.
  
 */
jindo.$Fn.prototype.delay = function(nSec, args) {
	if (typeof args == "undefined") args = [];
	this._delayKey = setTimeout(this.bind.apply(this, args), nSec*1000);
	return this;
};

/**
 
 * The setInterval method invokes a wrapped function at a specified interval.
 * @param {Number} nSec The interval at which to invoke a function (in seconds)
 * @param {Array} args A parameter to use when invoking a function. Use an array if multiple parameters are required.
 * @return {Number} Returns the unique ID of timer specified by setInterval.
 * @remark To release an execution interval specified by setInterval, use $Fn.stopDelay.
 * @see $Fn#bind
 * @see $Fn#delay
 * @description [Lite]
 * @example
function func(a, b) {
	alert(a + b);
}

$Fn(func).setInterval(5, [3, 5]);// Invokes the function func that uses the values of 3 and 5 as parameters every 5 seconds.
  
 */
jindo.$Fn.prototype.setInterval = function(nSec, args) {
	if (typeof args == "undefined") args = [];
	this._repeatKey = setInterval(this.bind.apply(this, args), nSec*1000);
	return this._repeatKey;
};

/**
 
 * The repeat method is the same as setInterval.
 * @param {Number} nSec Remaining time to invoke a next function
 * @param {Array} args A parameter to use when invoking a function. Use an array if multiple parameters are required.
 * @return {Number} Returns the unique ID of timer specified by setInterval.
 * @remark To release an execution interval specified by setInterval, use $Fn.stopDelay.
 * @see $Fn#bind
 * @see $Fn#delay
 * @description [Lite]
 * @example
function func(a, b) {
	alert(a + b);
}

$Fn(func).repeat(5, [3, 5]);// Invokes the function func that uses the values of 3 and 5 as parameters every 5 seconds.
  
 */
jindo.$Fn.prototype.repeat = jindo.$Fn.prototype.setInterval;

/**
 
 * stopDelay releases the execution delay time set by the delay method.
 * @return {$Fn} The $Fn object
 * @see $Fn#delay
 * @example
function func(a, b) {
	alert(a + b);
}

var fpDelay = $Fn(func);
	fpDelay.delay(5, [3, 5]);
	fpDelay.stopDelay();
  
 */
jindo.$Fn.prototype.stopDelay = function(){
	if(typeof this._delayKey != "undefined"){
		window.clearTimeout(this._delayKey);
		delete this._delayKey;
	}
	return this;
}

/**
 
 * stopRepeat is used to stop function execution set by the repeat method.
 * @return {$Fn} The $Fn object
 * @see $Fn#repeat
 * @example
function func(a, b) {
	alert(a + b);
}

var fpDelay = $Fn(func);
	fpDelay.repeat(5, [3, 5]);
	fpDelay.stopRepeat();
  
 */
jindo.$Fn.prototype.stopRepeat = function(){
	if(typeof this._repeatKey != "undefined"){
		window.clearInterval(this._repeatKey);
		delete this._repeatKey;
	}
	return this;
}


/**
 
 * Detaches all references that use this object in memory (direct invoking prevented).
 * @param {Element} Detaches all events that were attached to a specific element.
 * @ignore
  
 */
jindo.$Fn.prototype.free = function(oElement) {
	var len = this._events.length;
	
	while(len > 0) {
		var el = this._events[--len].element;
		var sEvent = this._events[len].event;
		var fn = this._events[len].func;
		if (oElement && el!==oElement){
			continue;
		}
		
		this.detach(el, sEvent);
		
        /*
         
The logic is created to execute the onload event; the event is not automatically executed because of logic to detach a function that was attached to an element upon uploading.
The created logic is invoked only when the event is invoked in gs.
  
         */
		var isGCCall = !oElement;
		
		if (isGCCall && window === el && sEvent == "unload" && _ua.indexOf("MSIE")<1) {
			this._func.call(this._this);
		}
		delete this._events[len];
	}
	
	if(this._events.length==0)	
		try { delete jindo.$Fn.gc.pool[this._key]; }catch(e){};
};

/**
 
 * Emulates the domready (=DOMContentLoaded) event in Internet Explorer.
 * @ignore
  
 */
jindo.$Fn._domready = function(doc, func) {
	if (typeof jindo.$Fn._domready.list == "undefined") {
		var f = null, l  = jindo.$Fn._domready.list = jindo.$A([func]);
		
		// use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		var done = false, execFuncs = function(){
			if(!done) {
				done = true;
				var evt = {
					type : "domready",
					target : doc,
					currentTarget : doc
				};

				while(f = l.shift()) f(evt);
			}
		};

		(function (){
			try {
				doc.documentElement.doScroll("left");
			} catch(e) {
				setTimeout(arguments.callee, 50);
				return;
			}
			execFuncs();
		})();

		// trying to always fire before onload
		doc.onreadystatechange = function() {
			if (doc.readyState == 'complete') {
				doc.onreadystatechange = null;
				execFuncs();
			}
		};

	} else {
		jindo.$Fn._domready.list.push(func);
	}
};

/**
 
 * The function filter is executed only when it is out of range to emulate the mouseenter/mouseleave events in non-Internet Explorer.
 * @ignore
  
 */
jindo.$Fn._fireWhenElementBoundary = function(doc, func) {
	return function(evt){
		var oEvent = jindo.$Event(evt);
		var relatedElement = jindo.$Element(oEvent.relatedElement);
		if(relatedElement && (relatedElement.isEqual(this) || relatedElement.isChildOf(this))) return;
		
		func.call(this,evt);
	}
};

/**
 
 * The gc method releases all event handlers assigned to an element.
 * @example
var someObject = {
   func1 : function() {
		// code here
   },
   func2 : function() {
		// code here
   }
}

$Fn(someObject.func1, someObject).attach($("test1"),"mouseup");
$Fn(someObject.func2, someObject).attach($("test1"),"mousedown");
$Fn(someObject.func1, someObject).attach($("test2"),"mouseup");
$Fn(someObject.func2, someObject).attach($("test2"),"mousedown");
..
..

$Fn.gc();
  
 */
jindo.$Fn.gc = function() {
	var p = jindo.$Fn.gc.pool;
	for(var key in p) {
		if(p.hasOwnProperty(key))
			try { p[key].free(); }catch(e){ };
	}

	/*
	 
delete all missing references
  
	 */
	jindo.$Fn.gc.pool = p = {};
};

/**
 
 * The freeElement method release all event handler assigned to the specified elements.
 * @since 1.3.5
 * @see $Fn#gc
 * @example
var someObject = {
    func : function() {
		// code here
   }
}

$Fn(someObject.func, someObject).attach($("test"),"mouseup");
$Fn(someObject.func, someObject).attach($("test"),"mousedown");

$Fn.freeElement($("test"));
  
 */
jindo.$Fn.freeElement = function(oElement){
	var p = jindo.$Fn.gc.pool;
	for(var key in p) {
		if(p.hasOwnProperty(key)){
			try { 
				p[key].free(oElement); 
			}catch(e){ };
		}
			
	}	
}

jindo.$Fn.gc.count = 0;

jindo.$Fn.gc.pool = {};

var _ua = navigator.userAgent;
if (typeof window != "undefined" && !(_ua.indexOf("IEMobile") == -1 && _ua.indexOf("Mobile") > -1 && _ua.indexOf("Safari") > -1)) {
 	jindo.$Fn(jindo.$Fn.gc).attach(window, "unload");
}