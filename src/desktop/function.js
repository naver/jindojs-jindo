/**
 {{title}}
 */
//-!jindo.$Fn start!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$Fn = function(func, thisObject) {
	//-@@$Fn-@@//
	var cl = arguments.callee;
	if (func instanceof cl) return func;

	if (!(this instanceof cl)){
		try {
			jindo.$Jindo._maxWarn(arguments.length, 2,"$Fn");
			return new cl(func, thisObject);
		} catch(e) {
			if (e instanceof TypeError) { return null; }
			throw e;
		}
	}	

	var oArgs = jindo._checkVarType(arguments, {
		'4fun' : ['func:Function+'],
		'4fun2' : ['func:Function+', "thisObject:Variant"],
		'4str' : ['func:String+', "thisObject:String+"]
	},"$Fn");

	this._tmpElm = null;
	this._key    = null;
	
	switch(oArgs+""){
		case "4str":
			this._func = eval("false||function("+func+"){"+thisObject+"}");
			break;
		case "4fun":
		case "4fun2":
			this._func = func;
			this._this = thisObject;
			
	}

};

/**
 * @ignore 
 */
jindo.$Fn._commonPram = function(oPram,sMethod){
	return jindo._checkVarType(oPram, {
		'4ele' : ['eElement:Element+',"sEvent:String+"],
		'4ele2' : ['eElement:Element+',"sEvent:String+","bUseCapture:Boolean"],
		'4str' : ['eElement:String+',"sEvent:String+"],
		'4str2' : ['eElement:String+',"sEvent:String+","bUseCapture:Boolean"],
		'4arr' : ['aElement:Array+',"sEvent:String+"],
		'4arr2' : ['aElement:Array+',"sEvent:String+","bUseCapture:Boolean"],
		'4doc' : ['eElement:Document+',"sEvent:String+"],
		'4win' : ['eElement:Window+',"sEvent:String+"],
		'4doc2' : ['eElement:Document+',"sEvent:String+","bUseCapture:Boolean"],
		'4win2' : ['eElement:Window+',"sEvent:String+","bUseCapture:Boolean"]
	},sMethod);
};
//-!jindo.$Fn end!-//

//-!jindo.$Fn.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$Fn.prototype.$value = function() {
	//-@@$Fn.$value-@@//
	return this._func;
};
//-!jindo.$Fn.prototype.$value end!-//

//-!jindo.$Fn.prototype.bind start!-//
/**
 {{bind}}
*/
jindo.$Fn.prototype.bind = function() {
	//-@@$Fn.bind-@@//
	var a = jindo._p_._toArray(arguments);
	var f = this._func;
	var t = this._this||this;
	var b;
	if(f.bind){
	    a.unshift(t);
	    b = Function.prototype.bind.apply(f,a);
	}else{
	    
    	b = function() {
    		var args = jindo._p_._toArray(arguments);
    		// fix opera concat bug
    		if (a.length) args = a.concat(args);
    
    		return f.apply(t, args);
    	};
	}
	return b;
};
//-!jindo.$Fn.prototype.bind end!-//

//-!jindo.$Fn.prototype.attach start(jindo.$Fn.prototype.bind, jindo.$Element.prototype.attach, jindo.$Element.prototype.detach)!-//
/**
 {{attach}}
 */
jindo.$Fn.prototype.attach = function(oElement, sEvent, bUseCapture) {
	//-@@$Fn.attach-@@//
	var oArgs = jindo.$Fn._commonPram(arguments,"$Fn#attach");
	var fn = null, l, ev = sEvent, el = oElement, ua = jindo._p_._j_ag;

	if (bUseCapture !== true) {
		bUseCapture = false;
	}

	this._bUseCapture = bUseCapture;

	switch(oArgs+""){
		case "4arr":
		case "4arr2":
			var el = oArgs.aElement;
			var ev = oArgs.sEvent;
			for(var i=0, l= el.length; i < l; i++) this.attach(el[i], ev, !!bUseCapture);
			return this;
	}
	fn = this._bind = this._bind?this._bind:this.bind();
	jindo.$Element(el).attach(ev,fn);

	return this;
};
//-!jindo.$Fn.prototype.attach end!-//

//-!jindo.$Fn.prototype.detach start!-//
/**
 {{detach}}
 */
jindo.$Fn.prototype.detach = function(oElement, sEvent, bUseCapture) {
	//-@@$Fn.detach-@@//
	var oArgs = jindo.$Fn._commonPram(arguments,"$Fn#detach");

	var fn = null, l, el = oElement, ev = sEvent, ua = jindo._p_._j_ag;

	switch(oArgs+""){
		case "4arr":
		case "4arr2":
			var el = oArgs.aElement;
			var ev = oArgs.sEvent;
			for(var i=0, l= el.length; i < l; i++) this.detach(el[i], ev, !!bUseCapture);
			return this;

	}
	fn = this._bind = this._bind?this._bind:this.bind();
	jindo.$Element(oArgs.eElement).detach(oArgs.sEvent, fn);

	return this;
};
//-!jindo.$Fn.prototype.detach end!-//

//-!jindo.$Fn.prototype.delay start(jindo.$Fn.prototype.bind)!-//
/**
 {{delay}}
 */
jindo.$Fn.prototype.delay = function(nSec, args) {
	//-@@$Fn.delay-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4num' : ['nSec:Numeric'],
		'4arr' : ['nSec:Numeric','args:Array+']
	},"$Fn#delay");
	switch(oArgs+""){
		case "4num":
			args = args || [];
			break;
		case "4arr":
			args = oArgs.args;
			
	}
	this._delayKey = setTimeout(this.bind.apply(this, args), nSec*1000);
	return this;
};
//-!jindo.$Fn.prototype.delay end!-//

//-!jindo.$Fn.prototype.setInterval start(jindo.$Fn.prototype.bind)!-//
/**
 {{setInterval}}
 */
jindo.$Fn.prototype.setInterval = function(nSec, args) {
	//-@@$Fn.setInterval-@@//
	//-@@$Fn.repeat-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4num' : ['nSec:Numeric'],
		'4arr' : ['nSec:Numeric','args:Array+']
	},"$Fn#setInterval");
	switch(oArgs+""){
		case "4num":
			args = args || [];
			break;
		case "4arr":
			args = oArgs.args;
			
	}
	this._repeatKey = setInterval(this.bind.apply(this, args), nSec*1000);
	return this;
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
	//-@@$Fn.stopDelay-@@//
	if(this._delayKey !== undefined){
		window.clearTimeout(this._delayKey);
		delete this._delayKey;
	}
	return this;
};
//-!jindo.$Fn.prototype.stopDelay end!-//

//-!jindo.$Fn.prototype.stopRepeat start!-//
/**
 {{stopRepeat}}
 */
jindo.$Fn.prototype.stopRepeat = function(){
	//-@@$Fn.stopRepeat-@@//
	if(this._repeatKey !== undefined){
		window.clearInterval(this._repeatKey);
		delete this._repeatKey;
	}
	return this;
};
//-!jindo.$Fn.prototype.stopRepeat end!-//