/**
 
 * @fileOverview A file to define the extended method of $Element
 * @name element.extend.js
  
 */


/**
 
 * As a function that is used in appear and disappear, it checks whether to use the current transition.
 * @ignore
  
 */
jindo.$Element._getTransition = function(){
	var hasTransition = false , sTransitionName = "";
	
	if (typeof document.body.style.trasition != "undefined") {
		hasTransition = true;
		sTransitionName = "trasition";
	}
	/*
	 
Firefox does not support the API transitionEnd yet.
  
	 */
	// else if(typeof document.body.style.MozTransition !== "undefined"){ 
	// 	hasTransition = true;
	// 	sTransitionName = "MozTransition";
	// }
	else if(typeof document.body.style.webkitTransition !== "undefined"){
		hasTransition = true;
		sTransitionName = "webkitTransition";
	}else if(typeof document.body.style.OTransition !== "undefined"){
		hasTransition = true;
		sTransitionName = "OTransition";
	}
	return (jindo.$Element._getTransition = function(){
		return {
			"hasTransition" : hasTransition,
			"name" : sTransitionName
		};
	})();
}


/**
 
 * Makes the HTML Elements appear gradually (Fade-in effect).
 * @param {Number} duration The time to spend until the HTML Elements fully appear (in seconds).
 * @param {Function} [callback] The callback function to execute after the HTML Elements fully appear.
 * @return {$Element} The current $Element object
 *
 * @remark When using filter in Internet Explorer 6 and if HTML Elements have position attributes, the elements will disappear. Thus, HTML Elements must not have position attributes.
 * @remark Use the CSS3 transition in the webkit-based (Safari5 or later, Mobile Safari, Chrome, and Mobile Webkit) browsers and Opera 10.60 or later. In the other browsers, use JavaScript.
 *
 * @see $Element#show
 * @see $Element#disappear
 *
 * @example
$Element("sample1").appear(5, function(){
	$Element("sample2").appear(3);
});

//Before
<div style="display: none; background-color: rgb(51, 51, 153); width: 100px; height: 50px;" id="sample1">
	<div style="display: none; background-color: rgb(165, 10, 81); width: 50px; height: 20px;" id="sample2">
	</div>
</div>

//After(1): sample1 element appears.
<div style="display: block; background-color: rgb(51, 51, 153); width: 100px; height: 50px; opacity: 1;" id="sample1">
	<div style="display: none; background-color: rgb(165, 10, 81); width: 50px; height: 20px;" id="sample2">
	</div>
</div>

//After(2): sample2 element appears.
<div style="display: block; background-color: rgb(51, 51, 153); width: 100px; height: 50px; opacity: 1;" id="sample1">
	<div style="display: block; background-color: rgb(165, 10, 81); width: 50px; height: 20px; opacity: 1;" id="sample2">
	</div>
</div>
  
 */
jindo.$Element.prototype.appear = function(duration, callback) {
	var oTransition = jindo.$Element._getTransition();
	if (oTransition.hasTransition) {
		
		jindo.$Element.prototype.appear = function(duration, callback) {
			duration = duration||0.3;
			callback = callback || function(){};
			var bindFunc = function(){
				callback();
				this.show();
				this.removeEventListener(oTransition.name+"End", arguments.callee , false );
			};
			var ele = this._element;
			var self = this;
			if(!this.visible()){
				ele.style.opacity = ele.style.opacity||0;
				self.show();
			}
			ele.addEventListener( oTransition.name+"End", bindFunc , false );
			ele.style[oTransition.name + 'Property'] = 'opacity';
			ele.style[oTransition.name + 'Duration'] = duration+'s';
			ele.style[oTransition.name + 'TimingFunction'] = 'linear';
			
			setTimeout(function(){
				ele.style.opacity = '1';
			},1);
			
			return this;
		}
	}else{
		jindo.$Element.prototype.appear = function(duration, callback) {
			var self = this;
			var op   = this.opacity();
			if(!this.visible()) op = 0;
			
			if (op == 1) return this;
			try { clearTimeout(this._fade_timer); } catch(e){};

			callback = callback || function(){};

			var step = (1-op) / ((duration||0.3)*100);
			var func = function(){
				op += step;
				self.opacity(op);

				if (op >= 1) {
					callback(self);
				} else {
					self._fade_timer = setTimeout(func, 10);
				}
			};

			this.show();
			func();
			return this;
		}
	}
	return this.appear(duration, callback);
	
};




/**
 
 * It makes the HTML Elements disappear gradually (Fade-out effect).<br>
 * When the HTML Elements fully disappear, the display attribute is changed to none.
 * @param {Number} duration The time to spend until the HTML Elements fully disappear (in seconds).
 * @param {Function} [callback] The callback function to execute after the HTML Elements fully disappear.
 * @return {$Element} The current $Element object
 *
 * @remark Use the CSS3 transition in the webkit-based (Safari5 or later, Mobile Safari, Chrome, and Mobile Webkit) browsers and Opera 10.60 or later. In the other browsers, use JavaScript.
 *
 * @see $Element#hide
 * @see $Element#appear
 *
 * @example
$Element("sample1").disappear(5, function(){
	$Element("sample2").disappear(3);
});

//Before
<div id="sample1" style="background-color: rgb(51, 51, 153); width: 100px; height: 50px;">
</div>
<div id="sample2" style="background-color: rgb(165, 10, 81); width: 100px; height: 50px;">
</div>

//After(1): sample1 element disappear.
<div id="sample1" style="background-color: rgb(51, 51, 153); width: 100px; height: 50px; opacity: 1; display: none;">
</div>
<div id="sample2" style="background-color: rgb(165, 10, 81); width: 100px; height: 50px;">
</div>

//After(2): sample2 element disappears.
<div id="sample1" style="background-color: rgb(51, 51, 153); width: 100px; height: 50px; opacity: 1; display: none;">
</div>
<div id="sample2" style="background-color: rgb(165, 10, 81); width: 100px; height: 50px; opacity: 1; display: none;">
</div>
  
 */
jindo.$Element.prototype.disappear = function(duration, callback) {
	var oTransition = jindo.$Element._getTransition();
	if (oTransition.hasTransition) {
		jindo.$Element.prototype.disappear = function(duration, callback) {
			duration = duration||0.3
			var self = this;
			callback = callback || function(){};
			var bindFunc = function(){
				callback();
				this.removeEventListener(oTransition.name+"End", arguments.callee , false );
				self.hide();
			};
			var ele = this._element;
			ele.addEventListener( oTransition.name+"End", bindFunc , false );
		
		
			ele.style[oTransition.name + 'Property'] = 'opacity';
			ele.style[oTransition.name + 'Duration'] = duration+'s';
			ele.style[oTransition.name + 'TimingFunction'] = 'linear';
			/*
			 
Handled as below due to an Opera bug.
  
			 */
			setTimeout(function(){
				ele.style.opacity = '0';
			},1);
		
			return this;
		}
	}else{
		jindo.$Element.prototype.disappear = function(duration, callback) {
			var self = this;
			var op   = this.opacity();
	
			if (op == 0) return this;
			try { clearTimeout(this._fade_timer); } catch(e){};

			callback = callback || function(){};

			var step = op / ((duration||0.3)*100);
			var func = function(){
				op -= step;
				self.opacity(op);

				if (op <= 0) {
					self.hide();
					self.opacity(1);
					callback(self);
				} else {
					self._fade_timer = setTimeout(func, 10);
				}
			};

			func();

			return this;
		}
	}
	return this.disappear(duration, callback);
};

/**
 
 * Gets or sets the position of the HTML Element.<br>
 * <br>
 * If a parameter is omitted, the position of the HTML Element is obtained.<br>
 * If a parameter is specified, the position of the HTML Element is set.<br>
 * It is based on the upper-left corner of a browser document.
 *
 * @param {Number} [nTop] The distance from the top of a document to the top of the HTML Element (in pixels).
 * @param {Number} [nLeft] The distance from the left edge of an HTML Element to the left edge of a document (in pixels).
 * @return {$Element | Object} Returns the $Element object in which the position value is changed if a position is set;<br>
 * returns the position value of top and left in the HTML Element if a position value is obtained.
 *
 * @remark Make sure that the HTML Element is visible when it is being applied. If the HTML Element is invisible, offset may not correct.
 * @remark In some circumstances and browsers, the position value of the inline element may not correct. In such cases, you can resolve this problem by changing the value to position:relative; of the element.
 * @author Hooriza
 *
 * @example
<style type="text/css">
	div { background-color:#2B81AF; width:20px; height:20px; float:left; left:100px; top:50px; position:absolute;}
</style>

<div id="sample"></div>

...

// Searches the value of a position.
$Element("sample").offset(); // { left=100, top=50 }

 * @example
// Sets the value of a position.
$Element("sample").offset(40, 30);

//Before
<div id="sample"></div>

//After
<div id="sample" style="top: 40px; left: 30px;"></div>
  
 */
jindo.$Element.prototype.offset = function(nTop, nLeft) {

	var oEl = this._element;
	var oPhantom = null;

	// setter
	if (typeof nTop == 'number' && typeof nLeft == 'number') {
		if (isNaN(parseInt(this.css('top'),10))) this.css('top', 0);
		if (isNaN(parseInt(this.css('left'),10))) this.css('left', 0);

		var oPos = this.offset();
		var oGap = { top : nTop - oPos.top, left : nLeft - oPos.left };

		oEl.style.top = parseInt(this.css('top'),10) + oGap.top + 'px';
		oEl.style.left = parseInt(this.css('left'),10) + oGap.left + 'px';

		return this;

	}

	// getter
	var bSafari = /Safari/.test(navigator.userAgent);
	var bIE = /MSIE/.test(navigator.userAgent);
	var nVer = bIE?navigator.userAgent.match(/(?:MSIE) ([0-9.]+)/)[1]:0;
	
	var fpSafari = function(oEl) {

		var oPos = { left : 0, top : 0 };

		for (var oParent = oEl, oOffsetParent = oParent.offsetParent; oParent = oParent.parentNode; ) {

			if (oParent.offsetParent) {

				oPos.left -= oParent.scrollLeft;
				oPos.top -= oParent.scrollTop;

			}

			if (oParent == oOffsetParent) {

				oPos.left += oEl.offsetLeft + oParent.clientLeft;
				oPos.top += oEl.offsetTop + oParent.clientTop ;

				if (!oParent.offsetParent) {

					oPos.left += oParent.offsetLeft;
					oPos.top += oParent.offsetTop;

				}

				oOffsetParent = oParent.offsetParent;
				oEl = oParent;
			}
		}

		return oPos;

	};

	var fpOthers = function(oEl) {
		var oPos = { left : 0, top : 0 };

		var oDoc = oEl.ownerDocument || oEl.document || document;
		var oHtml = oDoc.documentElement;
		var oBody = oDoc.body;

		if (oEl.getBoundingClientRect) { // has getBoundingClientRect

			if (!oPhantom) {
				var bHasFrameBorder = (window == top); 
				if(!bHasFrameBorder){ 
					try{ 
						bHasFrameBorder = (window.frameElement && window.frameElement.frameBorder == 1); 
					}catch(e){} 
				}
				if ((bIE && nVer < 8 && window.external) && bHasFrameBorder) {
					oPhantom = { left : 2, top : 2 };
					oBase = null;

				} else {

					oPhantom = { left : 0, top : 0 };

				}

			}

			var box = oEl.getBoundingClientRect();
			if (oEl !== oHtml && oEl !== oBody) {

				oPos.left = box.left - oPhantom.left;
				oPos.top = box.top - oPhantom.top;

				oPos.left += oHtml.scrollLeft || oBody.scrollLeft;
				oPos.top += oHtml.scrollTop || oBody.scrollTop;

			}

		} else if (oDoc.getBoxObjectFor) { // has getBoxObjectFor

			var box = oDoc.getBoxObjectFor(oEl);
			var vpBox = oDoc.getBoxObjectFor(oHtml || oBody);

			oPos.left = box.screenX - vpBox.screenX;
			oPos.top = box.screenY - vpBox.screenY;

		} else {

			for (var o = oEl; o; o = o.offsetParent) {

				oPos.left += o.offsetLeft;
				oPos.top += o.offsetTop;

			}

			for (var o = oEl.parentNode; o; o = o.parentNode) {

				if (o.tagName == 'BODY') break;
				if (o.tagName == 'TR') oPos.top += 2;

				oPos.left -= o.scrollLeft;
				oPos.top -= o.scrollTop;

			}

		}

		return oPos;

	};
	
	return (bSafari ? fpSafari : fpOthers)(oEl);
};

/**
 
 * Executes JavaScript within a string.<br>
 * If a string that contains &lt;script&gt; tags as a parameter, eval is executed by parsing the contents of &lt;script&gt;.
 *
 * @param {String} sHTML A string that contains &lt;script&gt; tags
 * @return {$Element} Returns the current $Element object.
 *
 * @example
// Specifies a string that contains script tags.
var response = "<script type='text/javascript'>$Element('sample').appendHTML('<li>4</li>')</script>";

$Element("sample").evalScripts(response);

//Before
<ul id="sample">
	<li>1</li>
	<li>2</li>
	<li>3</li>
</ul>

//After
<ul id="sample">
	<li>1</li>
	<li>2</li>
	<li>3</li>
<li>4</li></ul>
  
 */
jindo.$Element.prototype.evalScripts = function(sHTML) {
	
	var aJS = [];
    sHTML = sHTML.replace(new RegExp('<script(\\s[^>]+)*>(.*?)</'+'script>', 'gi'), function(_1, _2, sPart) { aJS.push(sPart); return ''; });
    eval(aJS.join('\n'));
    
    return this;

};

/**
 
 * A function to use when appending an element at the end
 * @ignore
 * @param {Element} A base element
 * @param {Element} The element to append
 * @return {$Element} The element of a second parameter
  
 */
jindo.$Element._append = function(oParent, oChild){
	
	if (typeof oChild == "string") {
		oChild = jindo.$(oChild);
	}else if(oChild instanceof jindo.$Element){
		oChild = oChild.$value();
	}
	oParent._element.appendChild(oChild);
	

	return oParent;
}

/**
 
 * A function to use when prepending an element at the front
 * @ignore
 * @param {Element} A base element
 * @param {Element} The element to prepend
 * @return {$Element} The element of a second parameter
  
 */
jindo.$Element._prepend = function(oParent, oChild){
	if (typeof oParent == "string") {
		oParent = jindo.$(oParent);
	}else if(oParent instanceof jindo.$Element){
		oParent = oParent.$value();
	}
	var nodes = oParent.childNodes;
	if (nodes.length > 0) {
		oParent.insertBefore(oChild._element, nodes[0]);
	} else {
		oParent.appendChild(oChild._element);
	}

	return oChild;
}


/**
 
 * Adds a last child node to an HTML Element.
 *
 * @param {$Element | HTML Element | String} oElement The HTML Element to add. A string, HTML Element, or $Element can be specified as a parameter.<br>
 * <br>
 * If a string is specified as a parameter, an HTML Elements that has an string id is added to a last child node.<br>
 * If an HTML Element is specified as a parameter, the HTML Element is added to a last child node.<br>
 * If $Element is specified as a parameter, an HTML Element within the $Element object is added to a last child node.
 * @return {$Element} Returns the $Element object that child nodes were added in.
 *
 * @see $Element#prepend
 * @see $Element#before
 * @see $Element#after
 * @see $Element#appendTo
 * @see $Element#prependTo
 *
 * @example
// Adds the HTML Element that has an id with sample2
// to the HTML Element that has an id with sample1.
$Element("sample1").append("sample2");

//Before
<div id="sample2">
    <div>Hello 2</div>
</div>
<div id="sample1">
    <div>Hello 1</div>
</div>

//After
<div id="sample1">
	<div>Hello 1</div>
	<div id="sample2">
		<div>Hello 2</div>
	</div>
</div>

 * @example
// Adds a new DIV element
// to the HTML Element that has an id with sample.
var elChild = $("<div>Hello New</div>");
$Element("sample").append(elChild);

//Before
<div id="sample">
	<div>Hello</div>
</div>

//After
<div id="sample">
	<div>Hello </div>
	<div>Hello New</div>
</div>
  
 */
jindo.$Element.prototype.append = function(oElement) {
	return jindo.$Element._append(this,oElement);
};

/** 
 
 * Adds a first child node to an HTML Element.
 *
 * @param {$Element | HTMLElement | String} oElement The HTML Element to add. A string, HTML Element, or $Element can be specified as a parameter.<br>
 * <br>
 * If a string is specified as a parameter, an HTML Element that has a string id is added to a first child node.<br>
 * If an HTML Element is specified as a parameter, the HTML Element is added to a first child node.<br>
 * If $Element is specified as a parameter, an HTML Element within the $Element object are added to a first child node.
 * @return {$Element} Returns the $Element object that child nodes were added in.
 *
 * @see $Element#append
 * @see $Element#before
 * @see $Element#after
 * @see $Element#appendTo
 * @see $Element#prependTo
 *
 * @example
// In the HTML Element that has an id with sample1,
// moves the HTML Element that has an id with sample2 to the first child node.
$Element("sample1").prepend("sample2");

//Before
<div id="sample1">
    <div>Hello 1</div>
	<div id="sample2">
	    <div>Hello 2</div>
	</div>
</div>

//After
<div id="sample1">
	<div id="sample2">
	    <div>Hello 2</div>
	</div>
    <div>Hello 1</div>
</div>

 * @example
// Adds a new DIV element
// to the HTML Element that has an id with sample.
var elChild = $("<div>Hello New</div>");
$Element("sample").prepend(elChild);

//Before
<div id="sample">
	<div>Hello</div>
</div>

//After
<div id="sample">
	<div>Hello New</div>
	<div>Hello</div>
</div>
  
 */
jindo.$Element.prototype.prepend = function(oElement) {
	return jindo.$Element._prepend(this._element, jindo.$Element(oElement));
};

/**
 
 * Replaces an HTML Element within the $Element object with the element specified as a parameter.
 *
 * @param {$Element | HTML Element | String} oElement The HTML Element to replace. A string, HTML Element, or $Element can be specified as a parameter.<br>
 * <br>
 * If a string is specified as a parameter, the HTML Element that has an string id is replaced.<br>
 * If an HTML Element is specified as a parameter, the HTML Element is replaced.<br>
 * If $Element is specified as a parameter, an HTML Element within the $Element object is replaced.
 * @return {$Element} Returns the $Element object in which HTML Elements were replaced.
 *
 * @example
// Replaces it with an HTML Element that has an id with sample2
// with the HTML Element that has an id with sample1.
$Element('sample1').replace('sample2');

//Before
<div>
	<div id="sample1">Sample1</div>
</div>
<div id="sample2">Sample2</div>

//After
<div>
	<div id="sample2">Sample2</div>
</div>

 * @example
// Replaces with a new DIV element.
$Element("btn").replace($("<div>Sample</div>"));

//Before
<button id="btn">Sample</button>

//After
<div>Sample</div>
  
 */
jindo.$Element.prototype.replace = function(oElement) {
	
	jindo.$$.release();
	var e = this._element;
	var oParentNode = e.parentNode;
	var o = jindo.$Element(oElement);
	if(oParentNode&&oParentNode.replaceChild){
		oParentNode.replaceChild(o.$value(),e);
		return o;
	}
	
	var o = o.$value();

	oParentNode.insertBefore(o, e);
	oParentNode.removeChild(e);

	return o;
};

/**
 
 * Adds an HTML Element to the last child node of another HTML Element.
 *
 * @param {$Element | HTML Element | String} oElement The HTML Element to become its parent node<br>
 * <br>
 * A string, HTML Element, or $Element can be specified as a parameter.<br>
 * <br>
 * If a string is a parameter, the HTML Element that has an string id becomes its parent node.<br>
 * If an HTML Element is specified as a parameter, the HTML Element becomes its parent node.<br>
 * If $Element is specified as a parameter, an HTML Element within the $Element object becomes its parent node.
 * @return {$Element} Returns the parameter $Element object.
 *
 * @see $Element#append
 * @see $Element#prepend
 * @see $Element#after
 * @see $Element#appendTo
 * @see $Element#prependTo
 *
 * @example
// Adds the HTML Element that has an id with sample1
// to the HTML Element that has an id with sample2.
$Element("sample1").appendTo("sample2");

//Before
<div id="sample1">
    <div>Hello 1</div>
</div>
<div id="sample2">
    <div>Hello 2</div>
</div>

//After
<div id="sample2">
    <div>Hello 2</div>
	<div id="sample1">
	    <div>Hello 1</div>
	</div>
</div>
  
 */
jindo.$Element.prototype.appendTo = function(oElement) {
	var ele = jindo.$Element(oElement);
	jindo.$Element._append(ele, this._element);
	return ele;
};

/**
 
 * Adds an HTML Element to the first child node of another HTML Element.
 *
 * @param {$Element | HTML Element | String} oElement The HTML Element to become its parent node. A string, HTML Element, or $Element can be specified as a parameter.<br>
 * <br>
 * If a string is a parameter, the HTML Element that has an string id becomes its parent node.<br>
 * If an HTML Element is specified as a parameter, the HTML Element becomes its parent node.<br>
 * If $Element is specified as a parameter, an HTML Element within the $Element object becomes its parent node.
 * @return {$Element} Returns the parameter $Element object.
 *
 * @see $Element#append
 * @see $Element#prepend
 * @see $Element#after
 * @see $Element#appendTo
 * @see $Element#prependTo
 *
 * @example
// Adds the HTML Element that has an id with sample1
// to the HTML Element that has an id with sample2.
$Element("sample1").prependTo("sample2");

//Before
<div id="sample1">
    <div>Hello 1</div>
</div>
<div id="sample2">
    <div>Hello 2</div>
</div>

//After
<div id="sample2">
	<div id="sample1">
	    <div>Hello 1</div>
	</div>
    <div>Hello 2</div>
</div>
  
 */
jindo.$Element.prototype.prependTo = function(oElement) {
	jindo.$Element._prepend(oElement, this);
	return jindo.$Element(oElement);
};

/**
 
 * Adds an HTML Element right before another HTML Element.
 *
 * @param {$Element | HTML Element | String} oElement The HTML Element to add<br>
 * <br>
 * A string, HTML Element, or $Element can be specified as a parameter.<br>
 * <br>
 * If a string is a parameter, the HTML Element that has an string id becomes its parent node.<br>
 * If an HTML Element is specified as a parameter, the HTML Element becomes its parent node.<br>
 * If $Element is specified as a parameter, an HTML Element within the $Element object becomes its parent node.
 * @return {$Element} Returns the $Element object.
 *
 * @see $Element#append
 * @see $Element#prepend
 * @see $Element#after
 * @see $Element#appendTo
 * @see $Element#prependTo
 *
 * @example
// Adds the HTML Element that has an id with sample1
// right before the HTML Element that has an id with sample2.
$Element("sample1").before("sample2"); // Returns the $Element that wraps sample2.

//Before
<div id="sample1">
    <div>Hello 1</div>
	<div id="sample2">
	    <div>Hello 2</div>
	</div>
</div>

//After
<div id="sample2">
	<div>Hello 2</div>
</div>
<div id="sample1">
  <div>Hello 1</div>
</div>

 * @example
// Adds a new DIV element.
var elNew = $("<div>Hello New</div>");
$Element("sample").before(elNew); // Returns $Element that wraps the elNew element.

//Before
<div id="sample">
	<div>Hello</div>
</div>

//After
<div>Hello New</div>
<div id="sample">
	<div>Hello</div>
</div>
  
 */
jindo.$Element.prototype.before = function(oElement) {
	var oRich = jindo.$Element(oElement);
	var o = oRich.$value();

	this._element.parentNode.insertBefore(o, this._element);

	return oRich;
};

/**
 
 * Adds an HTML Element right after another HTML Element.
 *
 * @param {$Element | HTML Element | String} oElement The HTML Element to add. A string, HTML Element, or $Element can be specified as a parameter.<br>
 * <br>
 * If a string is a parameter, the HTML Element that has a string id is added.<br>
 * If an HTML Element is specified as a parameter, the HTML Element is added.<br>
 * If $Element is specified as a parameter, an HTML Element within the $Element object is added.
 * @return {$Element} Returns the $Element object.
 *
 * @see $Element#append
 * @see $Element#prepend
 * @see $Element#before
 * @see $Element#appendTo
 * @see $Element#prependTo
 *
 * @example
// Adds the HTML Element that has an id with sample2
// right after the HTML Element that has an id with sample1.
$Element("sample1").after("sample2");  // Returns $Element that wraps sample2.

//Before
<div id="sample1">
    <div>Hello 1</div>
	<div id="sample2">
	    <div>Hello 2</div>
	</div>
</div>

//After
<div id="sample1">
	<div>Hello 1</div>
</div>
<div id="sample2">
	<div>Hello 2</div>
</div>

 * @example
// Adds a new DIV element.
var elNew = $("<div>Hello New</div>");
$Element("sample").after(elNew); // Adds $Element that wraps the elNew element.

//Before
<div id="sample">
	<div>Hello</div>
</div>

//After
<div id="sample">
	<div>Hello</div>
</div>
<div>Hello New</div>
  
 */
jindo.$Element.prototype.after = function(oElement) {
	var o = this.before(oElement);
	o.before(this);

	return o;
};

/**
 
 * Searches nodes of an ancestor element in HTML Elements.
 *
 * @param {Function} [pFunc] The callback function to specify search conditions of an ancestor element node<br>
 * If a parameter is omitted, it returns the element's parent node.<br>
 * If the callback function is specified as a parameter, an array of an ancestor element node in which the result of callback function execution is set to true is returned.<br>
 * The $Element object of an ancestor element node that is being searched as a parameter is passed to the callback function.
 * @param {Number} [limit] The depth of an ancestor element node<br>
 * If a parameter is omitted, all ancestor element nodes are searched.<br>
 * If the pFunc parameter is set to null and the limit parameter is specified, the ancestor element nodes at a specific depth are searched without conditions.
 * @return {$Element | Array} Returns the parent element node or an array of the ancestor element nodes.<br>
 * If element's parent nodes are returned by omitting a parameter, they are returned as the $Element type.<br>
 * Element's nodes in which the results were found are returned as the $Element array otherwise.
 *
 * @see $Element#child
 * @see $Element#prev
 * @see $Element#next
 * @see $Element#first
 * @see $Element#last
 * @see $Element#indexOf
 *
 * @example
<div class="sample" id="div1">
	<div id="div2">
		<div class="sample" id="div3">
			<div id="target">
				Sample
				<div id="div4">
					Sample
				</div>
				<div class="sample" id="div5">
					Sample
				</div>
			</div>
			<div class="sample" id="div6">
				Sample
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">
	var welTarget = $Element("target");
	var parent = welTarget.parent();
	// Returns $Element that wraps the DIV whose id div3.

	parent = welTarget.parent(function(v){
	        return v.hasClass("sample");
	    });
	// Returns an array that has $Element wrapping DIV whose id is div3
	// and div1 as an element.

	parent = welTarget.parent(function(v){
	        return v.hasClass("sample");
	    }, 1);
	// Returns an array that has $Element wrapping DIV whose id is div3.
</script>
  
 */
jindo.$Element.prototype.parent = function(pFunc, limit) {
	var e = this._element;
	var a = [], p = null;

	if (typeof pFunc == "undefined") return jindo.$Element(e.parentNode);
	if (typeof limit == "undefined" || limit == 0) limit = -1;

	while (e.parentNode && limit-- != 0) {
		p = jindo.$Element(e.parentNode);
		if (e.parentNode == document.documentElement) break;
		if (!pFunc || (pFunc && pFunc(p))) a[a.length] = p;

		e = e.parentNode;
	}

	return a;
};

/**
 
 * Searches nodes of a descendant element in HTML Elements.
 *
 * @param {Function} [pFunc] The callback function to specify search conditions of a descendant element node<br>
 * If a parameter is omitted, the element's child node is returned.<br>
 * If the callback function is specified as a parameter, an array of an descendant element node in which the result of callback function execution is set to true is returned.<br>
 * The $Element object of a descendant element node that is being searched as a parameter is passed to the callback function.
 * @param {Number} [limit] The depth of a descendant element node<br>
 * If a parameter is omitted, all descendant element nodes are searched.<br>
 * If the pFunc parameter is set to null and the limit parameter is specified, the descendant element nodes at a specific depth are searched without conditions.
 * @return {$Element | Array} Returns the descendant elementan node or an $Element array of the descendant element nodes.
 *
 * @see $Element#parent
 * @see $Element#prev
 * @see $Element#next
 * @see $Element#first
 * @see $Element#last
 * @see $Element#indexOf
 *
 * @example
<div class="sample" id="target">
	<div id="div1">
		<div class="sample" id="div2">
			<div id="div3">
				Sample
				<div id="div4">
					Sample
				</div>
				<div class="sample" id="div5">
					Sample
					<div class="sample" id="div6">
						Sample
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="sample" id="div7">
		Sample
	</div>
</div>

<script type="text/javascript">
	var welTarget = $Element("target");
	var child = welTarget.child();
	// Returns an array that has $Element wrapping DIV whose id is div1
	// and div7 as an element.

	child = welTarget.child(function(v){
	        return v.hasClass("sample");
	    });
	// Returns an array that has $Element wrapping DIV whose id is div2,
	// div5,
	// div6,
	// and div7 as an element.

	child = welTarget.child(function(v){
	        return v.hasClass("sample");
	    }, 1);
	// Returns an array that has $Element wrapping DIV whose id is div7 as an element.

	child = welTarget.child(function(v){
	        return v.hasClass("sample");
	    }, 2);
	// Returns an array that has $Element wrapping DIV whose id is div2
	// and div7 as an element.
</script>
  
 */
jindo.$Element.prototype.child = function(pFunc, limit) {
	var e = this._element;
	var a = [], c = null, f = null;

	if (typeof pFunc == "undefined") return jindo.$A(e.childNodes).filter(function(v){ return v.nodeType == 1}).map(function(v){ return jindo.$Element(v) }).$value();
	if (typeof limit == "undefined" || limit == 0) limit = -1;

	(f = function(el, lim){
		var ch = null, o = null;

		for(var i=0; i < el.childNodes.length; i++) {
			ch = el.childNodes[i];
			if (ch.nodeType != 1) continue;
			
			o = jindo.$Element(el.childNodes[i]);
			if (!pFunc || (pFunc && pFunc(o))) a[a.length] = o;
			if (lim != 0) f(el.childNodes[i], lim-1);
		}
	})(e, limit-1);

	return a;
};

/**
 
 * Searches the element's sibling nodes searched before an HTML Element.
 *
 * @param {Function} [pFunc] The callback function to specify search conditions of a previous sibling node<br>
 * If a parameter is omitted, the previous element's sibling node is returned.<br>
 * If the callback function is specified as a parameter, an array of a sibling node in which the result of callback function execution is set to true is returned.<br>
 * The $Element object of a sibling node that is being searched as a parameter is passed to the callback function ($Element is not an object).
 * @return {$Element | Array} Returns $Element that refers to the previous sibling node or a $Element array of sibling nodes that is satisfied.
 *
 * @see $Element#parent
 * @see $Element#child
 * @see $Element#next
 * @see $Element#first
 * @see $Element#last
 * @see $Element#indexOf
 *
 * @example
<div class="sample" id="sample_div1">
	<div id="sample_div2">
		<div class="sample" id="sample_div3">
			Sample1
		</div>
		<div id="sample_div4">
			Sample2
		</div>
		<div class="sample" id="sample_div5">
			Sample3
		</div>
		<div id="sample_div">
			Sample4
			<div id="sample_div6">
				Sample5
			</div>
		</div>
		<div id="sample_div7">
			Sample6
		</div>
		<div class="sample" id="sample_div8">
			Sample7
		</div>
	</div>
</div>

<script type="text/javascript">
	var sibling = $Element("sample_div").prev();
	// Returns $Element that wraps the DIV whose id is sample_div5.

	sibling = $Element("sample_div").prev(function(v){
	    return $Element(v).hasClass("sample");
	});
	// Returns an array that has $Element wrapping DIV whose id is sample_div5
	// and sample_div3 as an element.
</script>
  
 */
jindo.$Element.prototype.prev = function(pFunc) {
	var e = this._element;
	var a = [];
	var b = (typeof pFunc == "undefined");

	if (!e) return b?jindo.$Element(null):a;
	
	do {
		e = e.previousSibling;
		
		if (!e || e.nodeType != 1) continue;
		if (b) return jindo.$Element(e);
		if (!pFunc || pFunc(e)) a[a.length] = jindo.$Element(e);
	} while(e);

	return b?jindo.$Element(e):a;
};

/**
 
 *Searches the element's sibling nodes that appear next to HTML Elements.
 *
 * @param {Function} [pFunc] The callback function to specify search conditions of a next sibling node<br>
 * If a parameter is omitted, the next element's sibling node is returned.<br>
 * If the callback function is specified as a parameter, an array of a sibling node in which the result of callback function execution is set to true is returned.<br>
 * The $Element object of a sibling node that is being searched as a parameter is passed to the callback function ($Element is not an object).
 * @return {$Element | Array} Returns $Element that refers to the next sibling node or a $Element array of an sibling node that is satisfied.
 *
 * @see $Element#parent
 * @see $Element#child
 * @see $Element#prev
 * @see $Element#first
 * @see $Element#last
 * @see $Element#indexOf
 *
 * @example
<div class="sample" id="sample_div1">
	<div id="sample_div2">
		<div class="sample" id="sample_div3">
			Sample1
		</div>
		<div id="sample_div4">
			Sample2
		</div>
		<div class="sample" id="sample_div5">
			Sample3
		</div>
		<div id="sample_div">
			Sample4
			<div id="sample_div6">
				Sample5
			</div>
		</div>
		<div id="sample_div7">
			Sample6
		</div>
		<div class="sample" id="sample_div8">
			Sample7
		</div>
	</div>
</div>

<script type="text/javascript">
	var sibling = $Element("sample_div").next();
	// Returns $Element that wraps the DIV whose id is sample_div7.

	sibling = $Element("sample_div").next(function(v){
	    return $Element(v).hasClass("sample");
	});
	// Returns an array that has $Element wrapping DIV whose id is sample_div8.
</script>
  
 */
jindo.$Element.prototype.next = function(pFunc) {
	var e = this._element;
	var a = [];
	var b = (typeof pFunc == "undefined");

	if (!e) return b?jindo.$Element(null):a;
	
	do {
		e = e.nextSibling;
		
		if (!e || e.nodeType != 1) continue;
		if (b) return jindo.$Element(e);
		if (!pFunc || pFunc(e)) a[a.length] = jindo.$Element(e);
	} while(e);

	return b?jindo.$Element(e):a;
};

/**
 
 * Returns the first child element node of an HTML Element.
 *
 * @return {$Element} Returns the first child element node.
 * @since 1.2.0
 *
 * @see $Element#parent
 * @see $Element#child
 * @see $Element#prev
 * @see $Element#next
 * @see $Element#last
 * @see $Element#indexOf
 *
 * @example
<div id="sample_div1">
	<div id="sample_div2">
		<div id="sample_div">
			Sample1
			<div id="sample_div3">
				<div id="sample_div4">
					Sample2
				</div>
				Sample3
			</div>
			<div id="sample_div5">
				Sample4
				<div id="sample_div6">
					Sample5
				</div>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">
	var firstChild = $Element("sample_div").first();
	// Returns $Element that wraps whose id is sample_div3.
</script>
  
 */
jindo.$Element.prototype.first = function() {
	var el = this._element.firstElementChild||this._element.firstChild;
	if (!el) return null;
	while(el && el.nodeType != 1) el = el.nextSibling;

	return el?jindo.$Element(el):null;
}

/**
 
 * Returns the last child element node of an HTML Element.
 *
 * @return {$Element} Returns the last child element node of an HTML Element.
 * @since 1.2.0
 *
 * @see $Element#parent
 * @see $Element#child
 * @see $Element#prev
 * @see $Element#next
 * @see $Element#first
 * @see $Element#indexOf
 *
 * @example
<div id="sample_div1">
	<div id="sample_div2">
		<div id="sample_div">
			Sample1
			<div id="sample_div3">
				<div id="sample_div4">
					Sample2
				</div>
				Sample3
			</div>
			<div id="sample_div5">
				Sample4
				<div id="sample_div6">
					Sample5
				</div>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">
	var lastChild = $Element("sample_div").last();
	// Returns $Element that wraps whose id is sample_div5.
</script>
  
 */
jindo.$Element.prototype.last = function() {
	var el = this._element.lastElementChild||this._element.lastChild;
	if (!el) return null;
	while(el && el.nodeType != 1) el = el.previousSibling;

	return el?jindo.$Element(el):null;
}

/**
 
 * Checks parent element nodes of an HTML Element.
 *
 * @param {HTML Element | String | $Element} element The HTML Element to check whether or not a parent node<br>
 * <br>
 * A string, HTML Element, or $Element can be specified as a parameter.<br>
 * <br>
 * If a string is a parameter, the HTML Element that has an string id is checked.<br>
 * If an HTML Element is specified as a parameter, the HTML Element is checked.<br>
 * If $Element is specified as a parameter, HTML Elements within the $Element object are checked.
 * @return {Boolean} Returns true if a parameter is a parent element node, false otherwise.
 *
 * @see $Element#isParentOf
 *
 * @example
<div id="parent">
	<div id="child">
		<div id="grandchild"></div>
	</div>
</div>
<div id="others"></div>

...

// Checks parent/child.
$Element("child").isChildOf("parent");		// Result: true
$Element("others").isChildOf("parent");		// Result: false
$Element("grandchild").isChildOf("parent");	// Result: true
  
 */
jindo.$Element.prototype.isChildOf = function(element) {
	return jindo.$Element._contain(jindo.$Element(element).$value(),this._element);
};

/**
 
 * Checks child element nodes of HTML Elements.
 *
 * @param {HTML Element | String | $Element} element The HTML Elements to check whether or not a child node. A string, HTML Element, or $Element can be specified as a parameter. If a string is a parameter, the HTML Element that has an string id is checked.<br>
 * If an HTML Element is specified as a parameter, the HTML Element is checked.<br>
 * If $Element is specified as a parameter, HTML Elements within the $Element object are checked.
 * @return {Boolean} Returns true if a parameter is a child element node, false otherwise.
 *
 * @see $Element#isChildOf
 *
 * @example
<div id="parent">
	<div id="child"></div>
</div>
<div id="others"></div>

...

// Checks parent/child.
$Element("parent").isParentOf("child");		// Result: true
$Element("others").isParentOf("child");		// Result: false
$Element("parent").isParentOf("grandchild");// Result: true
  
 */
jindo.$Element.prototype.isParentOf = function(element) {
	return jindo.$Element._contain(this._element, jindo.$Element(element).$value());
};

/**
 
 * The basic APIs are isChildOf and isParentOf (in Internet Explorer, contains is used; in others, compareDocumentPosition is used. If both of cases are not applicable, legacy APIs are used).
 * @param {HTMLElement} eParent	A parent node
 * @param {HTMLElement} eChild	A child node
 * @ignore
  
 */
jindo.$Element._contain = function(eParent,eChild){
	if (document.compareDocumentPosition) {
		jindo.$Element._contain = function(eParent,eChild){
			return !!(eParent.compareDocumentPosition(eChild)&16);
		}
	}else if(document.body.contains){
		jindo.$Element._contain = function(eParent,eChild){
			return (eParent !== eChild)&&(eParent.contains ? eParent.contains(eChild) : true);
		}
	}else{
		jindo.$Element._contain = function(eParent,eChild){
			var e  = eParent;
			var el = eChild;

			while(e && e.parentNode) {
				e = e.parentNode;
				if (e == el) return true;
			}
			return false;
		}
	}
	return jindo.$Element._contain(eParent,eChild);
}

/**
 
 * Checks that an element is the same as the current HTML Element.
 *
 * @remark As a function working like isSameNode among APIs of DOM3, it checks even references.
 * @remark Be careful not to confuse this with isEqualNode; they are different.
 *
 * @param {HTML Element | String | $Element} element The HTML Element to check. A string, HTML Element, or $Element can be specified as a parameter.<br>
 * <br>
 * If a string is a parameter, the HTML Element that has an string id is checked.<br>
 * If an HTML Element is specified as a parameter, the HTML Element is checked.<br>
 * If $Element is specified as a parameter, HTML Elements within the $Element object are checked.
 * @return {Boolean} Returns true if a parameter is the same HTML Element, false otherwise.
 *
 * @example
<div id="sample1"><span>Sample</span></div>
<div id="sample2"><span>Sample</span></div>

...

// Checks whether or not the same HTML Element.
var welSpan1 = $Element("sample1").first();	// <span>Sample</span>
var welSpan2 = $Element("sample2").first();	// <span>Sample</span>

welSpan1.isEqual(welSpan2); // Result: false
welSpan1.isEqual(welSpan1); // Result: true
  
 */
jindo.$Element.prototype.isEqual = function(element) {
	try {
		return (this._element === jindo.$Element(element).$value());
	} catch(e) {
		return false;
	}
};

/**
 
 * Occurs an event to HTML Elements.
 *
 * @param {String} sEvent An event name to occur. The prefix on is omitted.
 * @param {Object} [oProps] The attribute of an event object used when an event occurred
 * @return {$Element} Returns the HTML Element where an event occurred.
 *
 * @since For WebKit series, the keyCode of an event object is read-only. Thus, if a key event occurs, the keyCode value is not set. The keyCode value is available since 1.4.1.
 *
 * @example
$Element("div").fireEvent("click", {left : true, middle : false, right : false}); // Occurs a click event.
$Element("div").fireEvent("mouseover", {screenX : 50, screenY : 50, clientX : 50, clientY : 50}); // Occurs a mouseover event.
$Element("div").fireEvent("keydown", {keyCode : 13, alt : true, shift : false ,meta : false, ctrl : true}); // Occurs a keydown event.
  
 */
jindo.$Element.prototype.fireEvent = function(sEvent, oProps) {
	
	function IE(sEvent, oProps) {
		sEvent = (sEvent+"").toLowerCase();
		var oEvent = document.createEventObject();
		if(oProps){
			for (k in oProps){
				if(oProps.hasOwnProperty(k))
					oEvent[k] = oProps[k];
			} 
			oEvent.button = (oProps.left?1:0)+(oProps.middle?4:0)+(oProps.right?2:0);
			oEvent.relatedTarget = oProps.relatedElement||null;
		}
		this._element.fireEvent("on"+sEvent, oEvent);
		return this;
	};

	function DOM2(sEvent, oProps) {
		var sType = "HTMLEvents";
		sEvent = (sEvent+"").toLowerCase();

		if (sEvent == "click" || sEvent.indexOf("mouse") == 0) {
			sType = "MouseEvent";
			if (sEvent == "mousewheel") sEvent = "dommousescroll";
		} else if (sEvent.indexOf("key") == 0) {
			sType = "KeyboardEvent";
		}
		var evt;
		if (oProps) {
			oProps.button = 0 + (oProps.middle?1:0) + (oProps.right?2:0);
			oProps.ctrl = oProps.ctrl||false;
			oProps.alt = oProps.alt||false;
			oProps.shift = oProps.shift||false;
			oProps.meta = oProps.meta||false;
			switch (sType) {
				case 'MouseEvent':
					evt = document.createEvent(sType);

					evt.initMouseEvent( sEvent, true, true, null, oProps.detail||0, oProps.screenX||0, oProps.screenY||0, oProps.clientX||0, oProps.clientY||0, 
										oProps.ctrl, oProps.alt, oProps.shift, oProps.meta, oProps.button, oProps.relatedElement||null);
					break;
				case 'KeyboardEvent':
					if (window.KeyEvent) {
				        evt = document.createEvent('KeyEvents');
				        evt.initKeyEvent(sEvent, true, true, window,  oProps.ctrl, oProps.alt, oProps.shift, oProps.meta, oProps.keyCode, oProps.keyCode);
				    } else {
						try {
				            evt = document.createEvent("Events");
				        } catch (e){
				            evt = document.createEvent("UIEvents");
				        } finally {
							evt.initEvent(sEvent, true, true);
							evt.ctrlKey  = oProps.ctrl;
					        evt.altKey   = oProps.alt;
					        evt.shiftKey = oProps.shift;
					        evt.metaKey  = oProps.meta;
					        evt.keyCode = oProps.keyCode;
					        evt.which = oProps.keyCode;
				        }          
				    }
					break;
				default:
					evt = document.createEvent(sType);
					evt.initEvent(sEvent, true, true);				
			}
		}else{
			evt = document.createEvent(sType);			
			evt.initEvent(sEvent, true, true);
		}
		this._element.dispatchEvent(evt);
		return this;
	};

	jindo.$Element.prototype.fireEvent = (typeof this._element.dispatchEvent != "undefined")?DOM2:IE;

	return this.fireEvent(sEvent, oProps);
};

/**
 
 * Removes all child nodes of HTML Elements.
 *
 * @return {$Element} Returns the current $Element object that child nodes were all removed in.
 *
 * @see $Element#leave
 * @see $Element#remove
 *
 * @example
// Removes all child nodes.
$Element("sample").empty();

//Before
<div id="sample"><span>Node</span> <span>Delete All</span></div>

//After
<div id="sample"></div>
  
 */
jindo.$Element.prototype.empty = function() {
	jindo.$$.release();
	this.html("");
	return this;
};

/**
 
 * Removes a specific child node of HTML Elements. Also, removes the event handler of a child node to be removed.
 *
 * @param {HTML Element | String | $Element} oChild The child element node to remove<br>
 * <br>
 * A string, HTML Element, or $Element can be specified as a parameter.<br>
 * <br>
 * If a string is specified as a parameter, the HTML Element that has an string id is removed.<br>
 * If an HTML Element is specified as a parameter, the HTML Element is removed.<br>
 * If $Element is specified as a parameter, an HTML Element within the $Element object is removed.
 * @return {$Element} Returns the $Element object that all child nodes were removed in.
 *
 * @see $Element#empty
 * @see $Element#leave
 *
 * @example
// Removes a specific child node.
$Element("sample").remove("child2");

//Before
<div id="sample"><span id="child1">Node</span> <span id="child2">Delete</span></div>

//After
<div id="sample"><span id="child1">Node</span> </div>
  
 */
jindo.$Element.prototype.remove = function(oChild) {
	jindo.$$.release();
	jindo.$Element(oChild).leave();
	return this;
}

/**
 
 * Removes an HTML Element from a parent element node.<br>
 * Also, removes the event handler that was registered in HTML Elements.
 *
 * @return {$Element} Returns the $Element object that was removed from a parent element node.
 *
 * @see $Element#empty
 * @see $Element#remove
 *
 * @example
// Removes from a parent element node.
$Element("sample").leave();

//Before
<div>
	<div id="sample"><span>Node</span> <span>Delete All</span> </div>
</div>

//After
// <div id="sample"><span>Note</span> Returns $Element that wraps <span>Delete All</span>.</div>
<div>

</div>
  
 */
jindo.$Element.prototype.leave = function() {
	var e = this._element;

	if (e.parentNode) {
		jindo.$$.release();
		e.parentNode.removeChild(e);
	}
	
	jindo.$Fn.freeElement(this._element);

	return this;
};

/**
 
 * Wraps an HTML Element by another HTML Element.
 *
 * @param {String | HTML Element | $Element} wrapper The HTML Element to wrap. A string, HTML Element, or $Element can be specified as a parameter.<br>
 * <br>
 * If a string is specified as a parameter, the HTML Element that has an string id is used.<br>
 * If an HTML Element is specified as a parameter, the HTML Element is used.<br>
 * If $Element is specified as a parameter, an HTML Element within the $Element object is used.
 * @return {$Element} Returns the $Element object that was wrapped by a new HTML Element.
 *
 * @example
$Element("sample1").wrap("sample2");

//Before
<div id="sample1"><span>Sample</span></div>
<div id="sample2"><span>Sample</span></div>

//After
<div id="sample2"><span>Sample</span><div id="sample1"><span>Sample</span></div></div>

 * @example
$Element("box").wrap($('<DIV>'));

//Before
<span id="box"></span>

//After
<div><span id="box"></span></div>
  
 */
jindo.$Element.prototype.wrap = function(wrapper) {
	var e = this._element;

	wrapper = jindo.$Element(wrapper).$value();
	if (e.parentNode) {
		e.parentNode.insertBefore(wrapper, e);
	}
	wrapper.appendChild(e);

	return this;
};

/**
 
 * Adjusts the length of an HTML text node so that it can appear on one line in a browser.
 *
 * @remark This method assumes that an HTML Element contains a text node. Thus, it may not work in other circumstances.
 * @remark The length of a text node is determined by an HTML Element width in a browser. Thus, the HTML Element must be the visible state.
 * @remark The size of a text node that has been fit to the screen may shrink afterwards. In such case, use the overflow:hidden attribute in HTML Elements.
 *
 * @param {String} [stringTail] An ellipse indicator <br>
 * Appends a string specified to a text node as a parameter at the end, and adjusts the length of that text node.<br>
 * Use an ellipsis ('...') if the parameter is omitted.
 *
 * @example
$Element("sample_span").ellipsis();

//Before
<div style="width:300px; border:1px solid #CCCCCC; padding:10px">
	<span id="sample_span">NHN is leading the digital life by continuously introducing innovative and convenient online services, its search engines and games being the company's two main pillars.</span>
</div>

//After
<div style="width:300px; border:1px solid #CCCCCC; padding:10px">
	<span id="sample_span">NHN is leading the digital life by continuously introducing...</span>
</div> 
   
 */
jindo.$Element.prototype.ellipsis = function(stringTail) {
	stringTail = stringTail || "...";
	var txt   = this.text();
	var len   = txt.length;
	var padding = parseInt(this.css("paddingTop"),10) + parseInt(this.css("paddingBottom"),10);
	var cur_h = this.height() - padding;
	var i     = 0;
	var h     = this.text('A').height() - padding;

	if (cur_h < h * 1.5) return this.text(txt);

	cur_h = h;
	while(cur_h < h * 1.5) {
		i += Math.max(Math.ceil((len - i)/2), 1);
		cur_h = this.text(txt.substring(0,i)+stringTail).height() - padding;
	}

	while(cur_h > h * 1.5) {
		i--;
		cur_h = this.text(txt.substring(0,i)+stringTail).height() - padding;
	}
};

/**
 
 * Checks the level of a child node for a parameter in HTML Elements and returns an index.
 *
 * @param {String | HTML Element | $Element} element The HTML Element to check. A string, HTML Element, or $Element can be specified as a parameter.<br>
 * <br>
 * If a string is specified as a parameter, the HTML Element that has an string id is used.<br>
 * If an HTML Element is specified as a parameter, the HTML Element is used.<br>
 * If $Element is specified as a parameter, an HTML Element within the $Element object is used.
 * @return {Number} The index of search a result.<br>
 * The index starts with 0. If it is not found, -1 is returned.
 *
 * @since 1.2.0
 *
 * @see $Element#parent
 * @see $Element#child
 * @see $Element#prev
 * @see $Element#next
 * @see $Element#first
 * @see $Element#last
 *
 * @example
<div id="sample_div1">
	<div id="sample_div">
		<div id="sample_div2">
			Sample1
		</div>
		<div id="sample_div3">
			<div id="sample_div4">
				Sample2
			</div>
			Sample3
		</div>
		<div id="sample_div5">
			Sample4
			<div id="sample_div6">
				Sample5
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">
	var welSample = $Element("sample_div");
	welSample.indexOf($Element("sample_div1"));	// Result: -1
	welSample.indexOf($Element("sample_div2"));	// Result: 0
	welSample.indexOf($Element("sample_div3"));	// Result: 1
	welSample.indexOf($Element("sample_div4"));	// Result: -1
	welSample.indexOf($Element("sample_div5"));	// Result: 2
	welSample.indexOf($Element("sample_div6"));	// Result: -1
</script>
  
 */
jindo.$Element.prototype.indexOf = function(element) {
	try {
		var e = jindo.$Element(element).$value();
		var n = this._element.childNodes;
		var c = 0;
		var l = n.length;

		for (var i=0; i < l; i++) {
			if (n[i].nodeType != 1) continue;

			if (n[i] === e) return c;
			c++;
		}
	}catch(e){}

	return -1;
};

/**
 
 * Searches descendant element nodes that satisfy a specific CSS selector.
 *
 * @param {String} sSelector The CSS selector
 * @return {Array} Returns an array of HTML Elements that satisfy a CSS selector.<br>
 * Returns an empty arry if no HTML Element satisfies a CSS selector.
 *
 * @see $Element#query
 * @see $Element#queryAll
 *
 * @example
<div id="sample">
	<div></div>
	<div class="pink"></div>
	<div></div>
	<div class="pink"></div>
	<div></div>
	<div class="blue"></div>
	<div class="blue"></div>
</div>

<script type="text/javascript">
	$Element("sample").queryAll(".pink");
	// Returns an array that has an element with <div class="pink"></div> and <div class="pink"></div>.

	$Element("sample").queryAll(".green");
	// Returns an empty array ([]).
</script>
  
 */
jindo.$Element.prototype.queryAll = function(sSelector) { 
	return jindo.$$(sSelector, this._element); 
};

/**
 
 * Searches the node of a first descendant element that satisfies a CSS selector.
 *
 * @param {String} sSelector The CSS selector
 * @return {HTML Element} Returns a first HTML Element that satisfies a CSS selector.<br>
 * Returns null if no HTML Element that satisfies conditions exists.
 *
 * @see $Element#test
 * @see $Element#queryAll
 *
 * @example
<div id="sample">
	<div></div>
	<div class="pink"></div>
	<div></div>
	<div class="pink"></div>
	<div></div>
	<div class="blue"></div>
	<div class="blue"></div>
</div>

<script type="text/javascript">
	$Element("sample").query(".pink");
	// Returns the first <div class="pink"></div> DIV element.

	$Element("sample").query(".green");
	// Returns null.
</script>
  
 */
jindo.$Element.prototype.query = function(sSelector) { 
	return jindo.$$.getSingle(sSelector, this._element); 
};

/**
 
 * Checks whether a specific CSS selector is satisfied in an HTML Element.
 *
 * @param {String} sSelector The CSS selector
 * @return {Boolean} Returns true/false after checking whether a CSS selector is satisfied.
 *
 * @see $Element#query
 * @see $Element#queryAll
 *
 * @example
<div id="sample" class="blue"></div>

<script type="text/javascript">
	$Element("sample").test(".blue");	// Result: true
	$Element("sample").test(".red");	// Result: false
</script>
  
 */
jindo.$Element.prototype.test = function(sSelector) { 
	return jindo.$$.test(this._element, sSelector); 
};

/**
 
 * Gets the HTML Elements by using the XPath syntax based HTML Elements.
 *
 * @remark It is recommended to use this method only in special circumstances as supported syntaxes are extremely limited.
 *
 * @param {String} sXPath The XPath syntax
 * @return {Array} Returns an array that has an HTML Element corresponding to XPath.
 *
 * @example
<div id="sample">
	<div>
		<div>1</div>
		<div>2</div>
		<div>3</div>
		<div>4</div>
		<div>5</div>
		<div>6</div>
	</div>
</div>

<script type="text/javascript">
	$Element("sample").xpathAll("div/div[5]");
	// <div>5</div> Returns an array that has an element.
</script>
  
 */
jindo.$Element.prototype.xpathAll = function(sXPath) { 
	return jindo.$$.xpath(sXPath, this._element); 
};

/**
 
 * insertAdjacentHTML function. It cannot be used directly.
 * @ignore
  
 */
jindo.$Element.insertAdjacentHTML = function(ins,html,insertType,type,fn){
	var _ele = ins._element;
	if( _ele.insertAdjacentHTML && !(/^<(option|tr|td|th|col)(?:.*?)>/.test(html.replace(/^(\s|　)+|(\s|　)+$/g, "").toLowerCase()))){
		_ele.insertAdjacentHTML(insertType, html);
	}else{
		var oDoc = _ele.ownerDocument || _ele.document || document;
		var fragment = oDoc.createDocumentFragment();
		var defaultElement;
		var sTag = html.replace(/^(\s|　)+|(\s|　)+$/g, "");
		var oParentTag = {
			"option" : "select",
			"tr" : "tbody",
			"thead" : "table",
			"tbody" : "table",
			"col" : "table",
			"td" : "tr",
			"th" : "tr",
			"div" : "div"
		}
		var aMatch = /^\<(option|tr|thead|tbody|td|th|col)(?:.*?)\>/i.exec(sTag);
		var sChild = aMatch === null ? "div" : aMatch[1].toLowerCase();
		var sParent = oParentTag[sChild] ;
		defaultElement = jindo._createEle(sParent,sTag,oDoc,true);
		var scripts = defaultElement.getElementsByTagName("script");
	
		for ( var i = 0, l = scripts.length; i < l; i++ ){
			scripts[i].parentNode.removeChild( scripts[i] );
		}
			
		while ( defaultElement[ type ]){
			fragment.appendChild( defaultElement[ type ] );
		}
		
		fn(fragment.cloneNode(true));

	}
	return ins;
}

/**
 
 * Appends HTML at the end of inner HTML of HTML Elements.
 *
 * @param {String} sHTML The HTML string to append
 * @return {$Element} Returns the current $Element object in which inner HTML was changed since 1.4.8.
 * @since Available since 1.4.6
 * @return Returns the $Element object since 1.4.8.
 * @see $Element#prependHTML
 * @see $Element#beforeHTML
 * @see $Element#afterHTML
 *
 * @example
// Appends it at the end of inner HTML.
$Element("sample_ul").appendHTML("<li>3</li><li>4</li>");

//Before
<ul id="sample_ul">
	<li>1</li>
	<li>2</li>
</ul>

//After
<ul id="sample_ul">
	<li>1</li>
	<li>2</li>
	<li>3</li>
	<li>4</li>
</ul>
  
 */
jindo.$Element.prototype.appendHTML = function(sHTML) {
	return jindo.$Element.insertAdjacentHTML(this,sHTML,"beforeEnd","firstChild",jindo.$Fn(function(oEle){
		this.append(oEle);
	},this).bind());
};
/**
 
 * Prepends HTML at the front of inner HTML of HTML Elements.
 *
 * @param {String} sHTML The HTML string to prepend
 * @return {$Element} Returns the current $Element object in which inner HTML was changed since 1.4.8.
 * @since Available since 1.4.6
 * @see $Element#appendHTML
 * @see $Element#beforeHTML
 * @see $Element#afterHTML
 *
 * @example
// Prepends HTML at the front of inner HTML.
$Element("sample_ul").prependHTML("<li>3</li><li>4</li>");

//Before
<ul id="sample_ul">
	<li>1</li>
	<li>2</li>
</ul>

//After
<ul id="sample_ul">
	<li>4</li>
	<li>3</li>
	<li>1</li>
	<li>2</li>
</ul>
  
 */
jindo.$Element.prototype.prependHTML = function(sHTML) {
	return jindo.$Element.insertAdjacentHTML(this,sHTML,"afterBegin","lastChild",jindo.$Fn(function(oEle){
		this.prepend(oEle);
	},this).bind());
};
/**
 
 * Inserts HTML before HTML Elements.
 *
 * @param {String} sHTML The HTML string to insert
 * @return {$Element} Returns the current $Element object since 1.4.8.
 * @since Available since 1.4.6
 * @see $Element#appendHTML
 * @see $Element#prependHTML
 * @see $Element#afterHTML
 *
 * @example
var welSample = $Element("sample_ul");

welSample.beforeHTML("<ul><li>3</li><li>4</li></ul>");
welSample.beforeHTML("<ul><li>5</li><li>6</li></ul>");

//Before
<ul id="sample_ul">
	<li>1</li>
	<li>2</li>
</ul>

//After
<ul>
	<li>3</li>
	<li>4</li>
</ul>
<ul>
	<li>5</li>
	<li>6</li>
</ul>
<ul id="sample_ul">
	<li>1</li>
	<li>2</li>
</ul>
  
 */
jindo.$Element.prototype.beforeHTML = function(sHTML) {
	return jindo.$Element.insertAdjacentHTML(this,sHTML,"beforeBegin","firstChild",jindo.$Fn(function(oEle){
		this.before(oEle);
	},this).bind());
};
/**
 
 * Appends HTML after HTML Elements.
 * @param {String} sHTML The HTML string to append
 * @returns {$Element} Returns the current $Element object since 1.4.8.
 * @since Available since 1.4.6
 * @see $Element#appendHTML
 * @see $Element#prependHTML
 * @see $Element#beforeHTML
 * @example
var welSample = $Element("sample_ul");

welSample.beforeHTML("<ul><li>3</li><li>4</li></ul>");
welSample.beforeHTML("<ul><li>5</li><li>6</li></ul>");

//Before
<ul id="sample_ul">
	<li>1</li>
	<li>2</li>
</ul>

//After
<ul id="sample_ul">
	<li>1</li>
	<li>2</li>
</ul>
<ul>
	<li>5</li>
	<li>6</li>
</ul>
<ul>
	<li>3</li>
	<li>4</li>
</ul>
  
 */
jindo.$Element.prototype.afterHTML = function(sHTML) {
	return jindo.$Element.insertAdjacentHTML(this,sHTML,"afterEnd","lastChild",jindo.$Fn(function(oEle){
		this._element.parentNode.insertBefore( oEle, this._element.nextSibling );
	},this).bind());
};

/**
 
 * Handles an event by event delegation.<br>
 * The event delegation is a method to manage events effectively by using event bubbling.<br>
 * For more information, see the URL below.<br>
 * <br>
 *
 * <ul>
 * 	<li><a href="http://devcode.nhncorp.com/projects/jindo/wiki/EventDelegate" target="_blank">What is Event Delegate?</a></li>
 * <ul>
 *
 * @param {String} sEvent An event name. The prefix on is omitted.<br>
 * domready, mousewheel, mouseenter, and mouseleave are not supported.<br>
 *
 * @param {String | Function} vFilter A filter to execute an event in only desired HTML Elements.<br>
 * <br>
 * The filter has two types such as a CSS selector and a function.<br>
 * <br>
 * To use a filter as a CSS selector, specify a string as a parameter.<br>
 * <br>
 * To use a filter as a function, specify a function that returns a Boolean value as a parameter.<br>
 * The first parameter of a filter function is the HTML Element itself, and the second parameter is the HTML Element in which an event occurred.
 *
 * @param {Function} fpCallback The function to execute when true is returned in filter<br>
 * An event object is specified as a parameter.
 *
 * @return {$Element} Returns the $Element object.
 * @since Available since 1.4.6
 * @see $Element#undelegate
 *
 * @example
	<ul id="parent">
		<li class="odd">1</li>
		<li>2</li>
		<li class="odd">3</li>
		<li>4</li>
	</ul>

	// If a CSS selector is used as a filter
	$Element("parent").delegate("click",
		".odd", 			// filter
		function(eEvent){	// callback function
			alert("Executing when li that has an odd class is being clicked.");
		});
 * @example
	<ul id="parent">
		<li class="odd">1</li>
		<li>2</li>
		<li class="odd">3</li>
		<li>4</li>
	</ul>

	// If a function is used as a filter
	$Element("parent").delegate("click",
		function(oEle,oClickEle){	// filter
			return oClickEle.innerHTML == "2"
		},
		function(eEvent){			// callback function
			alert("Executing when innerHTML of an clicked element is 2.");
		});
  
 */
jindo.$Element.prototype.delegate = function(sEvent , vFilter , fpCallback){
	if(!this._element["_delegate_"+sEvent]){
		this._element["_delegate_"+sEvent] = {};
		
		var fAroundFunc = jindo.$Fn(function(sEvent,wEvent){
			wEvent = wEvent || window.event;
			if (typeof wEvent.currentTarget == "undefined") {
				wEvent.currentTarget = this._element;
			}
			
			var oEle = wEvent.target || wEvent.srcElement;
			var aData = this._element["_delegate_"+sEvent];
			

			var data,func,event,resultFilter; 
			for(var i in aData){
				data = aData[i];
				resultFilter = data.checker(oEle);
				if(resultFilter[0]){
					func = data.func;
					event = jindo.$Event(wEvent);
					event.element = resultFilter[1];
					for(var j = 0, l = func.length ; j < l ;j++){
						func[j](event);
					}
				}
			}
		},this).bind(sEvent);
		
		jindo.$Element._eventBind(this._element,sEvent,fAroundFunc);
		var oEle = this._element;
		oEle["_delegate_"+sEvent+"_func"] = fAroundFunc;
		if (this._element["_delegate_events"]) {
			this._element["_delegate_events"].push(sEvent);
		}else{
			this._element["_delegate_events"] = [sEvent];
		}
		
		oEle = null;
	}
	
	this._bind(sEvent,vFilter,fpCallback);
	
	return this;
	
}

/**
 
 * A function to bind an event
 * @param {Element} oEle An event
 * @param {Boolean} sEvent The event type
 * @param {Function} fAroundFunc A function to bind
 * @ignore.
  
 */
jindo.$Element._eventBind = function(oEle,sEvent,fAroundFunc){
	if(oEle.addEventListener){
		jindo.$Element._eventBind = function(oEle,sEvent,fAroundFunc){
			oEle.addEventListener(sEvent,fAroundFunc,false);
		}
	}else{
		jindo.$Element._eventBind = function(oEle,sEvent,fAroundFunc){
			oEle.attachEvent("on"+sEvent,fAroundFunc);
		}
	}
	jindo.$Element._eventBind(oEle,sEvent,fAroundFunc);
}

/**
 
 * Releases an event delegation that was registered in HTML Elements.
 *
 * @param {String} sEvent The event name used when an event delegation was registered. The prefix on is omitted.
 * @param {String|Function} vFilter The filter used when an event delegation was registered.
 * @param {Function} fpCallback The callback function used when an event delegation was registered.
 * @return {$Element} Returns the $Element object.
 * @since Available since 1.4.6
 * @see $Element#delegate
 *
 * @example
<ul id="parent">
	<li class="odd">1</li>
	<li>2</li>
	<li class="odd">3</li>
	<li>4</li>
</ul>

// The callback function
var fnOddClass = function(eEvent){
	alert("Executing when li that has an odd class is being clicked.");
};

$Element("parent").delegate("click", ".odd", fnOddClass);	// Uses the event delegation.
$Element("parent").undelegate("click", ".odd", fnOddClass);	// Releases an event.
  
 */
jindo.$Element.prototype.undelegate = function(sEvent, vFilter, fpCallback){
	this._unbind(sEvent,vFilter,fpCallback);
	return this;
}

/**
 
 * A function to add the function that should be executed by delegation
 * @param {String} sEvent The event type
 * @param {String|Function} vFilter Two types such as cssquery and function
 * @param {Function} fpCallback A function to be executed when the function that is being delegated to cChecker is correct
 * @returns {$Element} Returns the $Element object.
 * @since Available since 1.4.6
 * @ignore
  
 */
jindo.$Element.prototype._bind = function(sEvent,vFilter,fpCallback){
	var _aDataOfEvent = this._element["_delegate_"+sEvent];
	if(_aDataOfEvent){
		var fpCheck;
		if(typeof vFilter == "string"){
			fpCheck = jindo.$Fn(function(sCssquery,oEle){
				var eIncludeEle = oEle;
				var isIncludeEle = jindo.$$.test(oEle, sCssquery);
				if(!isIncludeEle){
					var aPropagationElements = this._getParent(oEle);
					for(var i = 0, leng = aPropagationElements.length ; i < leng ; i++){
						eIncludeEle = aPropagationElements[i];
						if(jindo.$$.test(eIncludeEle, sCssquery)){
							isIncludeEle = true;
							break;
						}
					}
				}
				return [isIncludeEle,eIncludeEle];
			},this).bind(vFilter);
		}else if(typeof vFilter == "function"){
			fpCheck = jindo.$Fn(function(fpFilter,oEle){
				var eIncludeEle = oEle;
				var isIncludeEle = fpFilter(this._element,oEle);
				if(!isIncludeEle){
					var aPropagationElements = this._getParent(oEle);
					for(var i = 0, leng = aPropagationElements.length ; i < leng ; i++){
						eIncludeEle = aPropagationElements[i];
						if(fpFilter(this._element,eIncludeEle)){
							isIncludeEle = true;
							break;
						}
					}
				}
				return [isIncludeEle,eIncludeEle];
			},this).bind(vFilter);
		}
		
		this._element["_delegate_"+sEvent] = jindo.$Element._addBind(_aDataOfEvent,vFilter,fpCallback,fpCheck);
		
	}else{
		alert("check your delegate event.");
	}
}
/**
 
 * Get parent element from element of parameter.
 * @param {Element} Element.
 * @returns {Array} Array.
 * @ignore
  
 */
jindo.$Element.prototype._getParent = function(oEle) {
	var e = this._element;
	var a = [], p = null;

	while (oEle.parentNode && p != e) {
		p = oEle.parentNode;
		if (p == document.documentElement) break;
		a[a.length] = p;
		oEle = p;
	}

	return a;
};
/**
 
 * A function to add an event to an element
 * @param {Object} aDataOfEvent An object that has events and functions
 * @param {String|Function} vFilter A function to exeucte cssquery and check.
 * @param {Function} fpCallback A function to be exeucted
 * @param {Function} fpCheck A function to check
 * @retruns {Object} Returns aDataOfEvent.
 * @ignore
  
 */
jindo.$Element._addBind = function(aDataOfEvent,vFilter,fpCallback,fpCheck){
	var aEvent = aDataOfEvent[vFilter];
	if(aEvent){
		var fpFuncs = aEvent.func;
		fpFuncs.push(fpCallback);
		aEvent.func = fpFuncs;
		
	}else{
		aEvent = {
			checker : fpCheck,
			func : [fpCallback]
		};
	}
	aDataOfEvent[vFilter] = aEvent
	return aDataOfEvent;
}


/**
 
 * A function to delete the function that should be released in delegation
 * @param {String} sEvent The event type
 * @param {String|Function} vFilter Two types such as cssquery and function
 * @param {Function} fpCallback A function to be executed when the function that is being delegated to cChecker is correct
 * @returns {$Element} The $Element object
 * @since Available since 1.4.6
 * @ignore
  
 */
jindo.$Element.prototype._unbind = function(sEvent, vFilter,fpCallback){
	var oEle = this._element;
	if (sEvent&&vFilter&&fpCallback) {
		var oEventInfo = oEle["_delegate_"+sEvent];
		if(oEventInfo&&oEventInfo[vFilter]){
			var fpFuncs = oEventInfo[vFilter].func;
			fpFuncs = oEventInfo[vFilter].func = jindo.$A(fpFuncs).refuse(fpCallback).$value();
			if (!fpFuncs.length) {
				jindo.$Element._deleteFilter(oEle,sEvent,vFilter);
			}
		}
	}else if (sEvent&&vFilter) {
		jindo.$Element._deleteFilter(oEle,sEvent,vFilter);
	}else if (sEvent) {
		jindo.$Element._deleteEvent(oEle,sEvent,vFilter);
	}else{
		var aEvents = oEle['_delegate_events'];
		var sEachEvent;
		for(var i = 0 , l = aEvents.length ; i < l ; i++){
			sEachEvent = aEvents[i];
			jindo.$Element._unEventBind(oEle,sEachEvent,oEle["_delegate_"+sEachEvent+"_func"]);
			jindo.$Element._delDelegateInfo(oEle,"_delegate_"+sEachEvent);
			jindo.$Element._delDelegateInfo(oEle,"_delegate_"+sEachEvent+"_func");
		}
		jindo.$Element._delDelegateInfo(oEle,"_delegate_events");
	}
	
	return this;
	
}

/**
 
 * A function to delete information by using an object key
 * @param {Object} The object to delete
 * @param {String|Function} sType A key value
 * @returns {Object} Returns a deleted object.
 * @since Available since 1.4.6
 * @ignore
  
 */

jindo.$Element._delDelegateInfo = function(oObj , sType){
	try{
		oObj[sType] = null;
		delete oObj[sType];
	}catch(e){}
	return oObj
}

/**
 
 * A function to delete by filter
 * @param {Element} The element to delete
 * @param {String} An event name
 * @param {String|Function} A function to cssquery or filter
 * @since Available since 1.4.6
 * @ignore
  
 */

jindo.$Element._deleteFilter = function(oEle,sEvent,vFilter){
	var oEventInfo = oEle["_delegate_"+sEvent];
	if(oEventInfo&&oEventInfo[vFilter]){
		if (jindo.$H(oEventInfo).keys().length == 1) {
			jindo.$Element._deleteEvent(oEle,sEvent,vFilter);
		}else{
			jindo.$Element._delDelegateInfo(oEventInfo,vFilter);
		}
	}
}

/**
 
 * A function to delete by event
 * @param {Element} The element to delete
 * @param {String} An event name
 * @param {String|Function} A function to cssquery or filter
 * @since Available since 1.4.6
 * @ignore
  
 */

jindo.$Element._deleteEvent = function(oEle,sEvent,vFilter){
	var aEvents = oEle['_delegate_events'];
	jindo.$Element._unEventBind(oEle,sEvent,oEle["_delegate_"+sEvent+"_func"]);
	jindo.$Element._delDelegateInfo(oEle,"_delegate_"+sEvent);
	jindo.$Element._delDelegateInfo(oEle,"_delegate_"+sEvent+"_func");
	
	aEvents = jindo.$A(aEvents).refuse(sEvent).$value();
	if (!aEvents.length) {
		jindo.$Element._delDelegateInfo(oEle,"_delegate_events");
	}else{
		oEle['_delegate_events'] = jindo.$A(aEvents).refuse(sEvent).$value();
	}
}

/**
 
 * A function to release an event
 * @param {Element} oEle An element
 * @param {Boolean} sType The event type
 * @param {Function} fAroundFunc Returns a function to release binding.
 * @ignore
  
 */
jindo.$Element._unEventBind = function(oEle,sType,fAroundFunc){
	if(oEle.removeEventListener){
		jindo.$Element._unEventBind = function(oEle,sType,fAroundFunc){
			oEle.removeEventListener(sType,fAroundFunc,false);
		}
	}else{
		jindo.$Element._unEventBind = function(oEle,sType,fAroundFunc){
			oEle.detachEvent("on"+sType,fAroundFunc);
		}
	}
	jindo.$Element._unEventBind(oEle,sType,fAroundFunc);
}
