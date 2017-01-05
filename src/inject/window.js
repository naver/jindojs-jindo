/**
 {{title}}
 */

//-!jindo.$Window start!-//
/**
 {{constructor}}
 */
jindo.$Window = function(el) {
	
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);

	this._win = el || window;
}
//-!jindo.$Window end!-//

//-!jindo.$Window.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$Window.prototype.$value = function() {
	
	return this._win;
};
//-!jindo.$Window.prototype.$value end!-//

//-!jindo.$Window.prototype.resizeTo start!-//
/**
 {{resizeTo}}
 */
jindo.$Window.prototype.resizeTo = function(nWidth, nHeight) {
	
	this._win.resizeTo(nWidth, nHeight);
	return this;
};
//-!jindo.$Window.prototype.resizeTo end!-//

//-!jindo.$Window.prototype.resizeBy start!-//
/**
 {{resizeBy}}
 */
jindo.$Window.prototype.resizeBy = function(nWidth, nHeight) {
	
	this._win.resizeBy(nWidth, nHeight);
	return this;
};
//-!jindo.$Window.prototype.resizeBy end!-//

//-!jindo.$Window.prototype.moveTo start!-//
/**
 {{moveTo}}
 */
jindo.$Window.prototype.moveTo = function(nLeft, nTop) {
	
	this._win.moveTo(nLeft, nTop);
	return this;
};
//-!jindo.$Window.prototype.moveTo end!-//

//-!jindo.$Window.prototype.moveBy start!-//
/**
 {{moveBy}}
 */
 jindo.$Window.prototype.moveBy = function(nLeft, nTop) {
 	
	this._win.moveBy(nLeft, nTop);
	return this;
};
//-!jindo.$Window.prototype.moveBy end!-//

//-!jindo.$Window.prototype.sizeToContent start!-//
/**
 {{sizeToContent}}
 */	
jindo.$Window.prototype.sizeToContent = function(nWidth, nHeight) {
	
	if (typeof this._win.sizeToContent == "function") {
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