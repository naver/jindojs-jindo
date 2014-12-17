/**
 {{title}}
 */
//-!jindo.$Window start!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$Window = function(el) {
	//-@@$Window-@@//
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	
	if (!(this instanceof cl)){
		try {
			jindo.$Jindo._maxWarn(arguments.length, 1,"$Window");
			return new cl(el||window);
		} catch(e) {
			if (e instanceof TypeError) { return null; }
			throw e;
		}
	}	
	
	var oArgs = g_checkVarType(arguments, {
		'4win' : ['el:Window+']
	},"$Window");
	
	this._win = el;
};
//-!jindo.$Window end!-//

//-!jindo.$Window.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$Window.prototype.$value = function() {
	//-@@$Window.$value-@@//
	return this._win;
};
//-!jindo.$Window.prototype.$value end!-//

//-!jindo.$Window.prototype.resizeTo start!-//
/**
 {{resizeTo}}
 */
jindo.$Window.prototype.resizeTo = function(nWidth, nHeight) {
	//-@@$Window.resizeTo-@@//
	var oArgs = g_checkVarType(arguments, {
		'4num' : ['nWidth:Numeric','nHeight:Numeric']
	},"$Window#resizeTo");
	this._win.resizeTo(nWidth, nHeight);
	return this;
};
//-!jindo.$Window.prototype.resizeTo end!-//

//-!jindo.$Window.prototype.resizeBy start!-//
/**
 {{resizeBy}}
 */
jindo.$Window.prototype.resizeBy = function(nWidth, nHeight) {
	//-@@$Window.resizeBy-@@//
	var oArgs = g_checkVarType(arguments, {
		'4num' : ['nWidth:Numeric','nHeight:Numeric']
	},"$Window#resizeBy");
	this._win.resizeBy(nWidth, nHeight);
	return this;
};
//-!jindo.$Window.prototype.resizeBy end!-//

//-!jindo.$Window.prototype.moveTo start!-//
/**
 {{moveTo}}
 */
jindo.$Window.prototype.moveTo = function(nLeft, nTop) {
	//-@@$Window.moveTo-@@//
	var oArgs = g_checkVarType(arguments, {
		'4num' : ['nLeft:Numeric','nTop:Numeric']
	},"$Window#moveTo");
	this._win.moveTo(nLeft, nTop);
	return this;
};
//-!jindo.$Window.prototype.moveTo end!-//

//-!jindo.$Window.prototype.moveBy start!-//
/**
 {{moveBy}}
 */
 jindo.$Window.prototype.moveBy = function(nLeft, nTop) {
 	//-@@$Window.moveBy-@@//
	var oArgs = g_checkVarType(arguments, {
		'4num' : ['nLeft:Numeric','nTop:Numeric']
	},"$Window#moveBy");
	this._win.moveBy(nLeft, nTop);
	return this;
};
//-!jindo.$Window.prototype.moveBy end!-//

//-!jindo.$Window.prototype.sizeToContent start!-//
/**
 {{sizeToContent}}
 */	
jindo.$Window.prototype.sizeToContent = function(nWidth, nHeight) {
	//-@@$Window.sizeToContent-@@//
	var oArgs = g_checkVarType(arguments, {
		'4num' : ['nWidth:Numeric','nHeight:Numeric'],
		'4voi' : []
	},"$Window#sizeToContent");
	if (this._win.sizeToContent) {
		this._win.sizeToContent();
	} else {
		if(arguments.length != 2){
			// use trick by Peter-Paul Koch
			// http://www.quirksmode.org/
			var innerX,innerY;
			var self = this._win;
			var doc = this._win.document;
			if (self.innerHeight) {
				// all except Explorer
				innerX = self.innerWidth;
				innerY = self.innerHeight;
			} else if (doc.documentElement && doc.documentElement.clientHeight) {
				// Explorer 6 Strict Mode
				innerX = doc.documentElement.clientWidth;
				innerY = doc.documentElement.clientHeight;
			} else if (doc.body) {
				// other Explorers
				innerX = doc.body.clientWidth;
				innerY = doc.body.clientHeight;
			}

			var pageX,pageY;
			var test1 = doc.body.scrollHeight;
			var test2 = doc.body.offsetHeight;

			if (test1 > test2) {
				// all but Explorer Mac
				pageX = doc.body.scrollWidth;
				pageY = doc.body.scrollHeight;
			} else {
				// Explorer Mac;
				//would also work in Explorer 6 Strict, Mozilla and Safari
				pageX = doc.body.offsetWidth;
				pageY = doc.body.offsetHeight;
			}
			nWidth  = pageX - innerX;
			nHeight = pageY - innerY;
		}
		this._win.resizeBy(nWidth, nHeight);
	}

	return this;
};
//-!jindo.$Window.prototype.sizeToContent end!-//