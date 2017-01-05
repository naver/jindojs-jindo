//-!jindo.$Document start!-//
/**
 {{title}}
 */

/**
 {{constructor}}
 */
jindo.$Document = function (el) {
	
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);
	
	this._doc = el || document;
	
	this._docKey = this.renderingMode() == 'Standards' ? 'documentElement' : 'body';	
};
//-!jindo.$Document end!-//

//-!jindo.$Document.prototype.$value start!-//
/**
 {{value}}
 */
jindo.$Document.prototype.$value = function() {
	
	return this._doc;
};
//-!jindo.$Document.prototype.$value end!-//

//-!jindo.$Document.prototype.scrollSize start!-//
/**
 {{scrollSize}} 
 */
jindo.$Document.prototype.scrollSize = function() {
	
	/*
	  {{scrollSize_1}}
	 */
	var isWebkit = navigator.userAgent.indexOf("WebKit")>-1;
	var oDoc = this._doc[isWebkit?'body':this._docKey];
	
	return {
		width : Math.max(oDoc.scrollWidth, oDoc.clientWidth),
		height : Math.max(oDoc.scrollHeight, oDoc.clientHeight)
	};

};
//-!jindo.$Document.prototype.scrollSize end!-//

//-!jindo.$Document.prototype.scrollPosition start!-//
/**
 {{scrollPosition}}
 */
jindo.$Document.prototype.scrollPosition = function() {
	
	/*
	 {{scrollPosition_1}}
	 */
	var isWebkit = navigator.userAgent.indexOf("WebKit")>-1;
	var oDoc = this._doc[isWebkit?'body':this._docKey];
	return {
		left : oDoc.scrollLeft||window.pageXOffset||window.scrollX||0,
		top : oDoc.scrollTop||window.pageYOffset||window.scrollY||0
	};

};
//-!jindo.$Document.prototype.scrollPosition end!-//

//-!jindo.$Document.prototype.clientSize start!-//
/**
 {{clientSize}} 
 */
jindo.$Document.prototype.clientSize = function() {
	
	var agent = navigator.userAgent;
	var oDoc = this._doc[this._docKey];
	
	var isSafari = agent.indexOf("WebKit")>-1 && agent.indexOf("Chrome")==-1;

	/*
	 {{clientSize_1}}
	 */
	return (isSafari)?{
					width : window.innerWidth,
					height : window.innerHeight
				}:{
					width : oDoc.clientWidth,
					height : oDoc.clientHeight
				};
};
//-!jindo.$Document.prototype.clientSize end!-//

//-!jindo.$Document.prototype.renderingMode start!-//
/**
 {{renderingMode}}
 */
jindo.$Document.prototype.renderingMode = function() {
	
	var agent = navigator.userAgent;
	var isIe = (typeof window.opera=="undefined" && agent.indexOf("MSIE")>-1);
	var isSafari = (agent.indexOf("WebKit")>-1 && agent.indexOf("Chrome")<0 && navigator.vendor.indexOf("Apple")>-1);
	var sRet;

	if ('compatMode' in this._doc){
		sRet = this._doc.compatMode == 'CSS1Compat' ? 'Standards' : (isIe ? 'Quirks' : 'Almost');
	}else{
		sRet = isSafari ? 'Standards' : 'Quirks';
	}

	return sRet;

};
//-!jindo.$Document.prototype.renderingMode end!-//

//-!jindo.$Document.prototype.queryAll start(jindo.cssquery)!-//
/**
 {{queryAll}}
 */
jindo.$Document.prototype.queryAll = function(sSelector) { 
	
	return jindo.cssquery(sSelector, this._doc); 
};
//-!jindo.$Document.prototype.queryAll end!-//

//-!jindo.$Document.prototype.query start(jindo.cssquery)!-//
/**
 {{query}}
 */
jindo.$Document.prototype.query = function(sSelector) { 
	
	return jindo.cssquery.getSingle(sSelector, this._doc); 
};
//-!jindo.$Document.prototype.query end!-//

//-!jindo.$Document.prototype.xpathAll start(jindo.cssquery)!-//
/**
 {{xpathAll}}
 */
jindo.$Document.prototype.xpathAll = function(sXPath) { 
	
	return jindo.cssquery.xpath(sXPath, this._doc); 
};
//-!jindo.$Document.prototype.xpathAll end!-//