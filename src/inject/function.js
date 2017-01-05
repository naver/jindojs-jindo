//-!jindo.$Fn start(jindo.$Fn.prototype.attach)!-//
/**
 {{title}}
 */

/**
 {{constructor}}
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
//-!jindo.$Fn end!-//

//-!jindo.$Fn.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$Fn.prototype.$value = function() {
	
	return this._func;
};
//-!jindo.$Fn.prototype.$value end!-//

//-!jindo.$Fn.prototype.bind start!-//
/**
 {{bind}}
*/
jindo.$Fn.prototype.bind = function() {
	
	var a = Array.prototype.slice.call( arguments, 0 );
	var f = this._func;
	var t = this._this;

	var b = function() {
		var args = Array.prototype.slice.call( arguments, 0 );
		// fix opera concat bug
		if (a.length) args = a.concat(args);

		return f.apply(t, args);
	};
	return b;
};
//-!jindo.$Fn.prototype.bind end!-//

//-!jindo.$Fn.prototype.attach start(jindo.$,jindo.$Event,jindo.$Element,jindo.$Element.prototype.isChildOf,jindo.$Element.prototype.isEqual,jindo.$Fn.agent)!-//
/**
 {{bindForEvent}}
 */
jindo.$Fn.prototype.bindForEvent = function() {
	var a = arguments;
	var f = this._func;
	var t = this._this;
	var m = this._tmpElm || null;

	var b = function(e) {
		var args =Array.prototype.slice.call( a, 0 );
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
 {{attach}}
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
			 {{attach_1}}
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
             {{attach_2}}
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
 {{sign_domready}}
 */
jindo.$Fn._domready = function(doc, func) {
	if (typeof jindo.$Fn._domready.list == "undefined") {
		var f = null, l  = jindo.$Fn._domready.list = [func];
		
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
 {{sign_fireWhenElementBoundary}}
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
 {{free}}
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
         {{free_1}}
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
 {{gc}}
 */
jindo.$Fn.gc = function() {
	var p = jindo.$Fn.gc.pool;
	for(var key in p) {
		if(p.hasOwnProperty(key))
			try { p[key].free(); }catch(e){ };
	}

	/*
	 {{gc_1}}
	 */
	jindo.$Fn.gc.pool = p = {};
};

/**
 {{freeElement}}
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

/**
 {{detach}}
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
	var arr = [];
	
	for(var i=0, l = e.length; i < l; i++) {
		if (e[i].element !== el || e[i].event !== ev){
			arr.push(e[i]);
			continue;
		}
		
		fn = e[i].func;
		this._events = arr;
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
			arr = [];
			var list = jindo.$Fn._domready.list;
			for(var i=0,l=list.length; i < l ;i++){
				if(list[i]!=fn){
					arr.push(list[i]);
				}	
			}
			jindo.$Fn._domready.list = arr;
			return this;
		} else {
			el.detachEvent("on"+ev, fn);
		}
	}

	return this;
};
//-!jindo.$Fn.prototype.attach end!-//

//-!jindo.$Fn.prototype.detach start!-//
//-!jindo.$Fn.prototype.detach end!-//

//-!jindo.$Fn.prototype.delay start(jindo.$Fn.prototype.bind)!-//
/**
 {{delay}}
 */
jindo.$Fn.prototype.delay = function(nSec, args) {
	
	if (typeof args == "undefined") args = [];
	this._delayKey = setTimeout(this.bind.apply(this, args), nSec*1000);
	return this;
};
//-!jindo.$Fn.prototype.delay end!-//

//-!jindo.$Fn.prototype.setInterval start(jindo.$Fn.prototype.bind)!-//
/**
 {{setInterval}}
 */
jindo.$Fn.prototype.setInterval = function(nSec, args) {
	
	if (typeof args == "undefined") args = [];
	this._repeatKey = setInterval(this.bind.apply(this, args), nSec*1000);
	return this._repeatKey;
};
//-!jindo.$Fn.prototype.setInterval end!-//

//-!jindo.$Fn.prototype.repeat start(jindo.$Fn.prototype.setInterval)!-//
/**
 {{repeat}}
 */
jindo.$Fn.prototype.repeat = jindo.$Fn.prototype.setInterval;
//-!jindo.$Fn.prototype.repeat end!-//

//-!jindo.$Fn.prototype.stopDelay start!-//
/**
 {{stopDelay}}
 */
jindo.$Fn.prototype.stopDelay = function(){
	
	if(typeof this._delayKey != "undefined"){
		window.clearTimeout(this._delayKey);
		delete this._delayKey;
	}
	return this;
}
//-!jindo.$Fn.prototype.stopDelay end!-//

//-!jindo.$Fn.prototype.stopRepeat start!-//
/**
 {{stopRepeat}}
 */
jindo.$Fn.prototype.stopRepeat = function(){
	
	if(typeof this._repeatKey != "undefined"){
		window.clearInterval(this._repeatKey);
		delete this._repeatKey;
	}
	return this;
}
//-!jindo.$Fn.prototype.stopRepeat end!-//

//-!jindo.$Fn.agent start!-//
/**
 {{etc}}
 */
var _ua = navigator.userAgent;

if (typeof window != "undefined" && !(_ua.indexOf("IEMobile") == -1 && _ua.indexOf("Mobile") > -1 && _ua.indexOf("Safari") > -1)) {
 	jindo.$Fn(jindo.$Fn.gc).attach(window, "unload");
}
//-!jindo.$Fn.agent end!-//