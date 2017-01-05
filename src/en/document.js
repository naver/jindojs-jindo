/**
 
 * @fileOverview A file to define the constructor and method of $Document
 * @name document.js
  
 */

/**
 
 * Creates and returns the $Document object.
 * @class The $Document class provides methods that can perform a variety of features related to a document.
 * @param {Document} doc	A document object. The default value is a document object in the current document.
 * @constructor
 * @author Hooriza
  
 */
jindo.$Document = function (el) {
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);
	
	this._doc = el || document;
	
	this._docKey = this.renderingMode() == 'Standards' ? 'documentElement' : 'body';	
};

/**
 
 * Returns the original document object.
 * @return {HTMLDocument} A document object
  
 */
jindo.$Document.prototype.$value = function() {
	return this._doc;
};

/**
 
 * Measures the actual width and height of a document.
 * @return {Object} Returns width as a width key value and height as a height key value.
 * @example
var size = $Document().scrollSize();
alert('width : ' + size.width + ' / height : ' + size.height); 
   
 */
jindo.$Document.prototype.scrollSize = function() {

	/*
	  
The body must be used to get the scroll Size even in Standard mode for webkit.
  
	 */
	var isWebkit = navigator.userAgent.indexOf("WebKit")>-1;
	var oDoc = this._doc[isWebkit?'body':this._docKey];
	
	return {
		width : Math.max(oDoc.scrollWidth, oDoc.clientWidth),
		height : Math.max(oDoc.scrollHeight, oDoc.clientHeight)
	};

};

/**
 
 * Gets the position of a scroll bar in a document.
 * @return {Object} Returns left as a horizontal scroll bar and top as a vertical scroll bar.
 * @example
var size = $Document().scrollPosition();
alert('horizontal : ' + size.left + ' / vertical : ' + size.top);
* @since 1.3.5
  
 */
jindo.$Document.prototype.scrollPosition = function() {

	/*
	 
The body must be used to get the normal scroll Size even in Standard mode for webkit.
  
	 */
	var isWebkit = navigator.userAgent.indexOf("WebKit")>-1;
	var oDoc = this._doc[isWebkit?'body':this._docKey];
	return {
		left : oDoc.scrollLeft||window.pageXOffset||window.scrollX||0,
		top : oDoc.scrollTop||window.pageYOffset||window.scrollY||0
	};

};

/**
 
 * Gets the sizes of width and height of a document; the hidden areas by a scroll bar in a document are not calculated.
 * @return {Object} Returns width as a width key value and height as a height key value.
 * @example
var size = $Document(document).clientSize();
alert('width : ' + size.width + ' / height : ' + size.height); 
   
 */
jindo.$Document.prototype.clientSize = function() {
	var agent = navigator.userAgent;
	var oDoc = this._doc[this._docKey];
	
	var isSafari = agent.indexOf("WebKit")>-1 && agent.indexOf("Chrome")==-1;

	/*
	 
For Safari, replacing with window.innerWidth,innerHeight as a value of clientWidth,clientHeight is not normally processed when resizing a window.
  
	 */
	return (isSafari)?{
					width : window.innerWidth,
					height : window.innerHeight
				}:{
					width : oDoc.clientWidth,
					height : oDoc.clientHeight
				};
};

/**
 
 * Gets the rendering mode of a document.
 * @return {String} Rendering mode
 * <dl>
 *	<dt>Standards</dt>
 *	<dd>Standard rendering mode</dd>
 *	<dt>Almost</dt>
 *	<dd>Pseudo-standard rendering mode (returned when DTD is incorrectly specified in any browser other than Internet Explorer).
 *	<dt>Quirks</dt>
 *	<dd>Non-standard rendering mode</dd>
 * </dl>
 * @example
var mode = $Document().renderingMode();
alert('rendering mode : ' + mode);
  
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

/**
 
 * Returns an array of elements that satisfies the given selector in a document. An empty array is returned if any element is not satisfied.
 * @param {String} sSelector
 * @return {Array} An array of elements that satisfies conditions
  
 */
jindo.$Document.prototype.queryAll = function(sSelector) { 
	return jindo.$$(sSelector, this._doc); 
};

/**
 
 * Returns a first element that satisfies the given selector in a document. An empty array is returned if any element is not satisfied.
 * @param {String} sSelector
 * @return {Element} The first element that satisfies conditions
  
 */
jindo.$Document.prototype.query = function(sSelector) { 
	return jindo.$$.getSingle(sSelector, this._doc); 
};

/**
 
 * Returns all elements that follow the Xpath syntax in a document as an array.
 * @remark It is recommended to use this method only in certain circumstances as supported syntaxes are extremely limited.
 * @param {String} sXPath The Xpath value that indicates the position of an XPath element.
 * @return {Array} Returns an element array corresponding to path.
 * @example
var oDocument = $Document();
alert (oDocument.xpathAll("body/div/div").length);
  
 */
jindo.$Document.prototype.xpathAll = function(sXPath) { 
	return jindo.$$.xpath(sXPath, this._doc); 
};