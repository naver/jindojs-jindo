/**
 
 * @fileOverview A file to define the constructor and method of $Element
 * @name element.js
  
 */

/**
 
 * Creates and returns the $Element object.
 * @class The $Element class performs a wrapping of HTML Elements and provides a method to handle the elements.<br>
 * Wrapping means adding newly extended attributes to the features by wrapping JavaScript functions.
 * @constructor
 * @description [Lite]
 * @author Kim, Taegon
 *
 * @param {String | HTML Element | $Element} el
 * <br>
 * A string, HTML Elements, or $Element can be specified as a parameter of $Element.<br>
 * <br>
 * If a parameter is a string, either of below operations are processed.<br>
 * If a string is in a format such as &lt;tagName&gt;, the object with tagName is created.<br>
 * The $Element object is created by using HTML Elements in which id is string otherwise.<br>
 * <br>
 * If a parameter is an HTML Element, $Element is created by wrapping the HTML Element.<br>
 * <br>
 * If a parameter is $Element, the passed parameter itself is returned without any changes. If a parameter is undefined or null, null is returned.
 * @return {$Element} Returns the $Element object created.
 *
 * @example
var element = $Element($("box"));	// Specifies an HTML Element as a parameter.
var element = $Element("box");		// Specifies the id of an HTML Element as a parameter.
var element = $Element("<DIV>");	// Specifies a tag as a parameter. Wrapping by creating a DIV element.         
  
 */
jindo.$Element = function(el) {
	var cl = arguments.callee;
	if (el && el instanceof cl) return el;
	
	if (el===null || typeof el == "undefined"){
		return null;
	}else{
		el = jindo.$(el);
		if (el === null) {
			return null;
		};
	}
	if (!(this instanceof cl)) return new cl(el);
	
	this._element = (typeof el == "string") ? jindo.$(el) : el;
	var tag = this._element.tagName;		
	// tagname
	this.tag = (typeof tag!='undefined')?tag.toLowerCase():''; 

}

/**
 
 *	It is specified separately in order to eliminate dependency of agent.
 *	@ignore
  
 **/
var _j_ag = navigator.userAgent;
var IS_IE = _j_ag.indexOf("MSIE") > -1;
var IS_FF = _j_ag.indexOf("Firefox") > -1;
var IS_OP = _j_ag.indexOf("Opera") > -1;
var IS_SF = _j_ag.indexOf("Apple") > -1;
var IS_CH = _j_ag.indexOf("Chrome") > -1;

/**
 
 * Returns original HTML Elements.
 * @return {HTML Element} The original element wrapped
 * @description [Lite]
 *
 * @example
var element = $Element("sample_div");
element.$value(); // Returns the original HTML Elements.
  
 */
jindo.$Element.prototype.$value = function() {
	return this._element;
};

/**
 
 * It is used in order to check or set the disply attribute of HTML Elements.
 *
 * @param {Boolean} [bVisible] Whether to display on the screen<br>
 * If a parameter is omitted, true/false is returned depending on the current display attribute of an HTML Element (returns false if none is specified).<br>
 * If a parameter is true, it is set to the value of display attribute. If it is false, it is set to none.
 * @param {String} [sDisplay] The value of display attribute<br>
 * If a bVisible parameter is true, it is set to the display attribute as a passed parameter.
 * @return {$Element} Returns the $Element object in which the display attribute was changed.
 *
 * @description [Lite]
 * @since Available since 1.1.2
 * @since Since 1.4.5, if the value of bVisible parameter is true, the display attribute can be set with using the value of the sDisplay parameter.
 * @see $Element#show
 * @see $Element#hide
 * @see $Element#toggle
 *
 * @example
<div id="sample_div" style="display:none">Hello world</div>

// Searches
$Element("sample_div").visible(); // false

 * @example
// Sets it to be visible state on the screen.
$Element("sample_div").visible(true, 'block');

//Before
<div id="sample_div" style="display:none">Hello world</div>

//After
<div id="sample_div" style="display:block">Hello world</div> 
   
 */
jindo.$Element.prototype.visible = function(bVisible, sDisplay) {
	if (typeof bVisible != "undefined") {
		this[bVisible?"show":"hide"](sDisplay);
		return this;
	}

	return (this.css("display") != "none");
};

/**
 
 * Changes the display attribute so that the HTML Element can appear on the screen.
 * @param {String} [sDisplay] The value of display attribute to change<br>
 * If a parameter is omitted, it is set to a pre-defined default value for each tag.<br>
 * If a pre-defined default value does not exist, it is set to "inline."
 * @return {$Element} Returns the $Element object in which the display attribute was changed.
 * @description [Lite]
 * @see $Element#hide
 * @see $Element#toggle
 * @see $Element#visible
 * @since Since 1.4.5, it is available to set the value of sDisplay attribute as a value of the display property.
 *
 * @example
// Sets it to be the visible state on the screen.
$Element("sample_div").show();

//Before
<div id="sample_div" style="display:none">Hello world</div>

//After
<div id="sample_div" style="display:block">Hello world</div>
  
 */
jindo.$Element.prototype.show = function(sDisplay) {
	var s = this._element.style;
	var b = "block";
	var c = { p:b,div:b,form:b,h1:b,h2:b,h3:b,h4:b,ol:b,ul:b,fieldset:b,td:"table-cell",th:"table-cell",
			  li:"list-item",table:"table",thead:"table-header-group",tbody:"table-row-group",tfoot:"table-footer-group",
			  tr:"table-row",col:"table-column",colgroup:"table-column-group",caption:"table-caption",dl:b,dt:b,dd:b};

	try {
		if (sDisplay) {
			s.display = sDisplay;
		}else{
			var type = c[this.tag];
			s.display = type || "inline";
		}
	} catch(e) {
		/*
		 When the value of sDisplay is abnormal in Internet Explorer, it is set to block.
		 */
		s.display = "block";
	}

	return this;
};

/**
 
 * Changes the display attribute to none so that the HTML Element cannot appear on the screen.
 * @returns {$Element} Returns the $Element object in which the display attribute was changed.
 * @description [Lite]
 * @see $Element#show
 * @see $Element#toggle
 * @see $Element#visible
 *
 * @example
// Sets it to be the invisible state on the screen.
$Element("sample_div").hide();

//Before
<div id="sample_div" style="display:block">Hello world</div>

//After
<div id="sample_div" style="display:none">Hello world</div>
  
 */
jindo.$Element.prototype.hide = function() {
	this._element.style.display = "none";

	return this;
};

/**
 
 * Changes the display attribute so that the HTML Element can/cannot appear on the screen.
 * @param {String} [sDisplay] The value of display attribute when it is the visible state.
 * @returns {$Element} Returns the $Element object in which the display attribute was changed.
 * @description [Lite]
 * @see $Element#show
 * @see $Element#hide
 * @see $Element#visible
 * @since Since 1.4.5, it is available to set the value of sDisplay attribute as a value of the display property when it is the visible state.
 * @example
// Sets it to be the visible/invisible state on the screen.
$Element("sample_div1").toggle();
$Element("sample_div2").toggle();

//Before
<div id="sample_div1" style="display:block">Hello</div>
<div id="sample_div2" style="display:none">Good Bye</div>

//After
<div id="sample_div1" style="display:none">Hello</div>
<div id="sample_div2" style="display:block">Good Bye</div>
  
 */
jindo.$Element.prototype.toggle = function(sDisplay) {
	this[this.visible()?"hide":"show"](sDisplay);

	return this;
};

/**
 
 * Gets or sets the opacity value of HTML Elements.
 * @param {Number} [value]  The opacity value to be set<br>
 * The opacity value should be a real number between 0 and 1.<br>
 * The value should be set to 0 if the value of the parameter is less than 0, and set to 1 if the value of the parameter is greater than 1.
 * @return {Number} The opacity value of HTML Elements
 * @description [Lite]
 *
 * @example
<div id="sample" style="background-color:#2B81AF; width:20px; height:20px;"></div>

// Searches
$Element("sample").opacity();	// 1

 * @example
// Sets the opacity value.
$Element("sample").opacity(0.4);

//Before
<div style="background-color: rgb(43, 129, 175); width: 20px; height: 20px;" id="sample"></div>

//After
<div style="background-color: rgb(43, 129, 175); width: 20px; height: 20px; opacity: 0.4;" id="sample"></div>       
  
 */
jindo.$Element.prototype.opacity = function(value) {
	var v,e = this._element,b = (this._getCss(e,"display") != "none");	
	value = parseFloat(value);
    /*
     If IE does not have layout, opacity is not applied.
     */ 
	e.style.zoom = 1;
	if (!isNaN(value)) {
		value = Math.max(Math.min(value,1),0);

		if (typeof e.filters != "undefined") {
			value = Math.ceil(value*100);
			
			if (typeof e.filters != 'unknown' && typeof e.filters.alpha != "undefined") {
				e.filters.alpha.opacity = value;
			} else {
				e.style.filter = (e.style.filter + " alpha(opacity=" + value + ")");
			}		
		} else {
			e.style.opacity = value;
		}

		return value;
	}

	if (typeof e.filters != "undefined") {
		v = (typeof e.filters.alpha == "undefined")?(b?100:0):e.filters.alpha.opacity;
		v = v / 100;
	} else {
		v = parseFloat(e.style.opacity);
		if (isNaN(v)) v = b?1:0;
	}

	return v;
};


/**
 
 * Gets or sets the CSS attributes of HTML Elements.
 * @remark The Camel notation is used to represent CSS attributes. Thus, border-width-bottom should be defined as borderWidthBottom.
 * @remark The JavaScript reserved words are used to represent the float attribute. Thus, cssFloat, not float, should be used in the css method. styleFloat is used in Internet Explorer and cssFloat is used otherwise.
 * @param {String | Object | $H} sName An object with the name of CSS attributes, or an object that has one or more CSS attributes and values<br>
 * The css method can have a string, Object, or $H as a parameter.
 * <br>
 * If a parameter is a string, either of below operations are processed.<br>
 * If the sValue parameter, the second parameter, is omitted, a CSS attribute value is obtained.<br>
 * If the sValue parameter, the second parameter, has a value, a CSS attribute value is set as the sValue value.<br>
 * <br>
 * If Object or $H object is used, two or more CSS attributes can be set at once.<br>
 * Searches the CSS attributes with the attribute names of an object and sets it to the property values.
 * @param {String | Number} [sValue] A value to set in CSS attributes<br>
 * A string including numbers or units is used for the value that requies a measuring unit.
 * @return {String | $Element} Returns a string when getting a value, or returns the current $Element when setting a value.
 * @description [Lite]
 * @example
<style type="text/css">
	#btn {
		width: 120px;
		height: 30px;
		background-color: blue;
	}
</style>

<span id="btn"></span>

...

// Searches the value of the CSS attribute.
$Element('btn').css('backgroundColor');		// rgb (0, 0, 255)

 * @example
// Sets the value of the CSS attribute.
$Element('btn').css('backgroundColor', 'red');

//Before
<span id="btn"></span>

//After
<span id="btn" style="background-color: red;"></span>

 * @example
// Sets multiple CSS attribute values.
$Element('btn').css({
	width: "200px",		// 200
	height: "80px"  	// The result would be same even though it is set to 80.
});

//Before
<span id="btn" style="background-color: red;"></span>

//After
<span id="btn" style="background-color: red; width: 200px; height: 80px;"></span>
  
 */
jindo.$Element.prototype.css = function(sName, sValue) {
	
	var e = this._element;
	
	var type_v = (typeof sValue);
	
	if (sName == 'opacity') return  type_v == 'undefined' ? this.opacity() : this.opacity(sValue);
	
	var type_n = (typeof sName);
	if (type_n == "string") {
		var view;

		if (type_v == "string" || type_v == "number") {
			var obj = {};
			obj[sName] = sValue;
			sName = obj;
		} else {
			var _getCss = this._getCss;
			if((IS_FF||IS_OP)&&(sName=="backgroundPositionX"||sName=="backgroundPositionY")){
				var bp = _getCss(e, "backgroundPosition").split(/\s+/);
				return (sName == "backgroundPositionX") ? bp[0] : bp[1];
			}
			if (IS_IE && sName == "backgroundPosition") {
				return _getCss(e, "backgroundPositionX") + " " + _getCss(e, "backgroundPositionY")
			}
			if ((IS_FF||IS_SF||IS_CH) && (sName=="padding"||sName=="margin")) {
				var top		= _getCss(e, sName+"Top");
				var right	= _getCss(e, sName+"Right");
				var bottom	= _getCss(e, sName+"Bottom");
				var left	= _getCss(e, sName+"Left");
				if ((top == right) && (bottom == left)) {
					return top;
				}else if (top == bottom) {
					if (right == left) {
						return top+" "+right;
					}else{
						return top+" "+right+" "+bottom+" "+left;
					}
				}else{
					return top+" "+right+" "+bottom+" "+left;
				}
			}
			return _getCss(e, sName);
		}
	}
	var h = jindo.$H;
	if (typeof h != "undefined" && sName instanceof h) {
		sName = sName._table;
	}
	if (typeof sName == "object") {
		var v, type;

		for(var k in sName) {
			if(sName.hasOwnProperty(k)){
				v    = sName[k];
				type = (typeof v);
				if (type != "string" && type != "number") continue;
				if (k == 'opacity') {
					type == 'undefined' ? this.opacity() : this.opacity(v);
					continue;
				}
				if (k == "cssFloat" && IS_IE) k = "styleFloat";
			
				if((IS_FF||IS_OP)&&( k =="backgroundPositionX" || k == "backgroundPositionY")){
					var bp = this.css("backgroundPosition").split(/\s+/);
					v = k == "backgroundPositionX" ? v+" "+bp[1] : bp[0]+" "+v;
					this._setCss(e, "backgroundPosition", v);
				}else{
					this._setCss(e, k, v);
				}
			}
		}
	}

	return this;
};

/**
 
 * A function to use in css
 * @ignore
 * @param {Element} e
 * @param {String} sName
  
 */
jindo.$Element.prototype._getCss = function(e, sName){
	var fpGetCss;
	if (e.currentStyle) {
		
		fpGetCss = function(e, sName){
			try{
				if (sName == "cssFloat") sName = "styleFloat";
				var sStyle = e.style[sName];
				if(sStyle){
					return sStyle;
				}else{
					var oCurrentStyle = e.currentStyle;
					if (oCurrentStyle) {
						return oCurrentStyle[sName];
					}
				}
				return sStyle;
			}catch(ex){
				throw new Error((e.tagName||"document") + "cannot use css.");
			}
		}
	} else if (window.getComputedStyle) {
		fpGetCss = function(e, sName){
			try{
				if (sName == "cssFloat") sName = "float";
				var d = e.ownerDocument || e.document || document;
				var sVal =  (e.style[sName]||d.defaultView.getComputedStyle(e,null).getPropertyValue(sName.replace(/([A-Z])/g,"-$1").toLowerCase()));
				if (sName == "textDecoration") sVal = sVal.replace(",","");
				return sVal;
			}catch(ex){
				throw new Error((e.tagName||"document") + "cannot use css.");
			}
		}
	
	} else {
		fpGetCss = function(e, sName){
			try{
				if (sName == "cssFloat" && IS_IE) sName = "styleFloat";
				return e.style[sName];
			}catch(ex){
				throw new Error((e.tagName||"document") + "cannot use css.");
			}
		}
	}
	jindo.$Element.prototype._getCss = fpGetCss;
	return fpGetCss(e, sName);
	
}

/**
 
 * A function to set css in css
 * @ignore
 * @param {Element} e
 * @param {String} k
 * @param {String} v
  
 */
jindo.$Element.prototype._setCss = function(e, k, v){
	if (("#top#left#right#bottom#").indexOf(k+"#") > 0 && (typeof v == "number" ||(/\d$/.test(v)))) {
		e.style[k] = parseInt(v,10)+"px";
	}else{
		e.style[k] = v;
	}
}

/**
 
 * Gets or sets the HTML attributes of DOM Elements.
 * If one parameter is used, the attribute value of HTML attributes is obtained. If no property is specified, null is returned.
 * If two parameters are used, the attribute value that corresponds to the first propery of HTML attributes is specified as a second property.
 * If Object or $H object is used as a first parameter, two or more HTML attributes can be set at once.
 * @param {String|Object|$H} sName The HTML attribute name or a setting value object
 * @param {String|Number} [sValue] A setting value. If null is specified as a setting value, HTML attributes are deleted.
 * @return {String|$Element} Returns the String setting value when getting a value, or returns the current $Element that sets the value when setting a value.
 * @description [Lite]
 *
 * @example
<a href="http://www.naver.com" id="sample_a" target="_blank">Naver</a>

$Element("sample_a").attr("href"); // http://www.naver.com
 * @example
$Element("sample_a").attr("href", "http://www.hangame.com/");

//Before
<a href="http://www.naver.com" id="sample_a" target="_blank">Naver</a>
//After
<a href="http://www.hangame.com" id="sample_a" target="_blank">Naver</a>
 * @example
$Element("sample_a").attr({
    "href" : "http://www.hangame.com",
    "target" : "_self"
})

//Before
<a href="http://www.naver.com" id="sample_a" target="_blank">Naver</a>
//After
<a href="http://www.hangame.com" id="sample_a" target="_self">Naver</a>
  
 */
jindo.$Element.prototype.attr = function(sName, sValue) {
	var e = this._element;

	if (typeof sName == "string") {
		if (typeof sValue != "undefined") {
			var obj = {};
			obj[sName] = sValue;
			sName = obj;
		} else {
			if (sName == "class" || sName == "className"){ 
				return e.className;
			}else if(sName == "style"){
				return e.style.cssText;
			}else if(sName == "checked"||sName == "disabled"){
				return !!e[sName];
			}else if(sName == "value"){
				return e.value;
			}else if(sName == "href"){
				return e.getAttribute(sName,2);
			}
			return e.getAttribute(sName);
		}
	}

	if (typeof jindo.$H != "undefined" && sName instanceof jindo.$H) {
		sName = sName.$value();
	}

	if (typeof sName == "object") {
		for(var k in sName) {
			if(sName.hasOwnProperty(k)){
				if (typeof(sValue) != "undefined" && sValue === null) {
					e.removeAttribute(k);
				}else{
					if (k == "class"|| k == "className") { 
						e.className = sName[k];
					}else if(k == "style"){
						e.style.cssText = sName[k];
					}else if(k == "checked"||k == "disabled"){
						e[k] = sName[k];
					}else if(k == "value"){
						e.value = sName[k];
					}else{
						e.setAttribute(k, sName[k]);	
					}
					
				} 
			}
		}
	}

	return this;
};

/**
 
 * Gets or sets the width of HTML Elements.
 * @remark The width gets the actual width of HTML Elements. Each browser calculates the size of the Box model in a different manner. For this reason, the value of the width attribute of CSS may differ from the return value of the width method.
 * @param {Number} [width]	The width value to set. The pixel (px) unit is used, and numbers are specified as a parameter value.
 * @return {Number | $Element} Returns the actul width of HTML Elements if a value is obtained. Retunrs the current $Element object whose height value was changed if a value is set.
 * @description [Lite]
 * @see $Element#height
 *
 * @example
<style type="text/css">
	div { width:70px; height:50px; padding:5px; margin:5px; background:red; }
</style>

<div id="sample_div"></div>

...

// Searches
$Element("sample_div").width();	// 80

 * @example
// Sets the width value in HTML Elements described above.
$Element("sample_div").width(200);

//Before
<div id="sample_div"></div>

//After
<div id="sample_div" style="width: 190px"></div>
  
 */
jindo.$Element.prototype.width = function(width) {
	
	if (typeof width == "number") {
		var e = this._element;
		e.style.width = width+"px";
		var off = e.offsetWidth;
		if (off != width && off!==0) {
			var w = (width*2 - off);
			if (w>0)
				e.style.width = w + "px";
		}
		return this;
	}

	return this._element.offsetWidth;
};

/**
 
 * Gets or sets the height of HTML Elements.
 * @remark The height method gets the actual height of HTML Elements. Each browser calculates the size of the Box model in a different manner. For this reason, the value of the height attribute of CSS may differ from the return value of the height method.
 * @param {Number} [height]	The height value to be set. The pixel (px) unit is used, and numbers are specified as a parameter value.
 * @return {Number | $Element} Returns the actul height of HTML Elements if a value is obtained. Returns the current $Element object whose height value was changed if a value is set.
 * @description [Lite]
 * @see $Element#width
 *
 * @example
<style type="text/css">
	div { width:70px; height:50px; padding:5px; margin:5px; background:red; }
</style>

<div id="sample_div"></div>

...

// Searches
$Element("sample_div").height(); // 60

 * @example
// Sets the height value of HTML Elements described above.
$Element("sample_div").height(100);

//Before
<div id="sample_div"></div>

//After
<div id="sample_div" style="height: 90px"></div>
  
 */
jindo.$Element.prototype.height = function(height) {
	
	if (typeof height == "number") {
		var e = this._element;
		e.style.height = height+"px";
		var off = e.offsetHeight;
		if (off != height && off!==0) {
			var height = (height*2 - off);
			if(height>0)
				e.style.height = height + "px";
		}

		return this;
	}

	return this._element.offsetHeight;
};

/**
 
 * Sets or returns the class names of HTML Elements.
 * @param {String} [sClass] A class name to set<br>
 * If a parameter is omitted, the current class name of HTML Elements is returned.<br>
 * If a parameter is specified, the class name is set. A space is used to set multiple class names.
 * @return {String | $Element} Returns a class name when a class name is searched.<br>
 * If two or more classes exist, a string including spaces is returned with space-separated class names.<br>
 * If a class name is set, the current $Element object is returned.
 * @description [Lite]
 * @see $Element#hasClass
 * @see $Element#addClass
 * @see $Element#removeClass
 * @see $Element#toggleClass
 *
 * @example
<style type="text/css">
p { margin: 8px; font-size:16px; }
.selected { color:#0077FF; }
.highlight { background:#C6E746; }
</style>

<p>Hello and <span id="sample_span" class="selected">Goodbye</span></p>

...

// Searches a class name.
$Element("sample_span").className(); // selected

 * @example
// Sets class names in HTML Elements described above.
welSample.className("highlight");

//Before
<p>Hello and <span id="sample_span" class="selected">Goodbye</span></p>

//After
<p>Hello and <span id="sample_span" class="highlight">Goodbye</span></p>
  
 */
jindo.$Element.prototype.className = function(sClass) {
	var e = this._element;

	if (typeof sClass == "undefined") return e.className;
	e.className = sClass;

	return this;
};

/**
 
 * Checks whether to use specific classes in HTML Elements.
 * @param {String} sClass A class name to check
 * @return {Boolean} Returns whether to use classes.
 * @description [Lite]
 * @see $Element#className
 * @see $Element#addClass
 * @see $Element#removeClass
 * @see $Element#toggleClass
 *
 * @example
<style type="text/css">
	p { margin: 8px; font-size:16px; }
	.selected { color:#0077FF; }
	.highlight { background:#C6E746; }
</style>

<p>Hello and <span id="sample_span" class="selected highlight">Goodbye</span></p>

...

// Checks whether to use classes.
var welSample = $Element("sample_span");
welSample.hasClass("selected"); 			// true
welSample.hasClass("highlight"); 			// true
  
 */
jindo.$Element.prototype.hasClass = function(sClass) {
	if(this._element.classList){
		jindo.$Element.prototype.hasClass = function(sClass){
			return this._element.classList.contains(sClass);
		}
	} else {
		jindo.$Element.prototype.hasClass = function(sClass){
			return (" "+this._element.className+" ").indexOf(" "+sClass+" ") > -1;
		}
	}
	return this.hasClass(sClass);
	
};

/**
 
 * Adds classes in HTML Elements.
 * @param {String} sClass A class name to add. A space is used to add multiple class names.
 * @return {$Element} Returns the $Element object that classes are added in.
 * @description [Lite]
 * @see $Element#className
 * @see $Element#hasClass
 * @see $Element#removeClass
 * @see $Element#toggleClass
 *
 * @example
// Adds classes.
$Element("sample_span1").addClass("selected");
$Element("sample_span2").addClass("selected highlight");

//Before
<p>Hello and <span id="sample_span1">Goodbye</span></p>
<p>Hello and <span id="sample_span2">Goodbye</span></p>

//After
<p>Hello and <span id="sample_span1" class="selected">Goodbye</span></p>
<p>Hello and <span id="sample_span2" class="selected highlight">Goodbye</span></p>
  
 */
jindo.$Element.prototype.addClass = function(sClass) {
	if(this._element.classList){
		jindo.$Element.prototype.addClass = function(sClass){
			var aClass = sClass.split(/\s+/);
			var flistApi = this._element.classList;
			for(var i = aClass.length ; i-- ;){
				flistApi.add(aClass[i]);
			}
			return this;
		}
	} else {
		jindo.$Element.prototype.addClass = function(sClass){
			var e = this._element;
			var aClass = sClass.split(/\s+/);
			var eachClass;
			for (var i = aClass.length - 1; i >= 0 ; i--){
				eachClass = aClass[i];
				if (!this.hasClass(eachClass)) { 
					e.className = (e.className+" "+eachClass).replace(/^\s+/, "");
				};
			};
			return this;
		}
	}
	return this.addClass(sClass);

};


/**
 
 * Removes specific classes from HTML Elements.
 * @param {String} sClass A class name to remove. A space is used to remove multiple class names.
 * @return {$Element} Returns the current $Element object in which classes are removed.
 * @description [Lite]
 * @see $Element#className
 * @see $Element#hasClass
 * @see $Element#addClass
 * @see $Element#toggleClass
 *
 * @example
// Removing classes.
$Element("sample_span").removeClass("selected");

//Before
<p>Hello and <span id="sample_span" class="selected highlight">Goodbye</span></p>

//After
<p>Hello and <span id="sample_span" class="highlight">Goodbye</span></p>
 * @example
// Removes multiple classes.
$Element("sample_span").removeClass("selected highlight");
$Element("sample_span").removeClass("highlight selected");

//Before
<p>Hello and <span id="sample_span" class="selected highlight">Goodbye</span></p>

//After
<p>Hello and <span id="sample_span" class="">Goodbye</span></p> 
   
 */
jindo.$Element.prototype.removeClass = function(sClass) {
	
	if(this._element.classList){
		jindo.$Element.prototype.removeClass = function(sClass){
			var flistApi = this._element.classList;
			var aClass = sClass.split(" ");
			for(var i = aClass.length ; i-- ;){
				flistApi.remove(aClass[i]);
			}
			return this;
		}
	} else {
		jindo.$Element.prototype.removeClass = function(sClass){
			var e = this._element;
			var aClass = sClass.split(/\s+/);
			var eachClass;
			for (var i = aClass.length - 1; i >= 0 ; i--){
				eachClass = aClass[i];
				if (this.hasClass(eachClass)) { 
					 e.className = (" "+e.className.replace(/\s+$/, "").replace(/^\s+/, "")+" ").replace(" "+eachClass+" ", " ").replace(/\s+$/, "").replace(/^\s+/, "");
				};
			};
			return this;
		}
	}
	return this.removeClass(sClass);
	
};


/**
 
 * Removes a class if the class has already been applied to HTML Elements, and adds a class otherwise.
 * @param {String} sClass A class name to add or remove
 * @param {String} [sClass2] A class name to add or remove<br>
 * If the sClass2 parameter is omitted, whether the class with the sClass parameter value is being used in the HTML Elements is returned.<br>
 * If the class is being used, the class should be removed. If not, it should be added.<br>
 * If both parameters are used, a class that matches with a parameter among classes that are being used in HTML Elements is deleted. The other parameters are added in HTML Elements as a new class.
 * @return {$Element} The current $Element object in which classes are added or removed.
 * @import core.$Element[hasClass,addClass,removeClass]
 * @description [Lite]
 * @see $Element#className
 * @see $Element#hasClass
 * @see $Element#addClass
 * @see $Element#removeClass
 *
 * @example
// If one parameter exists
$Element("sample_span1").toggleClass("highlight");
$Element("sample_span2").toggleClass("highlight");

//Before
<p>Hello and <span id="sample_span1" class="selected highlight">Goodbye</span></p>
<p>Hello and <span id="sample_span2" class="selected">Goodbye</span></p>

//After
<p>Hello and <span id="sample_span1" class="selected">Goodbye</span></p>
<p>Hello and <span id="sample_span2" class="selected highlight">Goodbye</span></p>

 * @example
// If two parameter values exist
$Element("sample_span1").toggleClass("selected", "highlight");
$Element("sample_span2").toggleClass("selected", "highlight");

//Before
<p>Hello and <span id="sample_span1" class="highlight">Goodbye</span></p>
<p>Hello and <span id="sample_span2" class="selected">Goodbye</span></p>

//After
<p>Hello and <span id="sample_span1" class="selected">Goodbye</span></p>
<p>Hello and <span id="sample_span2" class="highlight">Goodbye</span></p> 
   
 */
jindo.$Element.prototype.toggleClass = function(sClass, sClass2) {
	
	if(this._element.classList){
		jindo.$Element.prototype.toggleClass = function(sClass, sClass2){
			if (typeof sClass2 == "undefined") {
				this._element.classList.toggle(sClass);
			} else {
				if(this.hasClass(sClass)){
					this.removeClass(sClass);
					this.addClass(sClass2);
				}else{
					this.addClass(sClass);
					this.removeClass(sClass2);
				}
			}
			
			return this;
		}
	} else {
		jindo.$Element.prototype.toggleClass = function(sClass, sClass2){
			sClass2 = sClass2 || "";
			if (this.hasClass(sClass)) {
				this.removeClass(sClass);
				if (sClass2) this.addClass(sClass2);
			} else {
				this.addClass(sClass);
				if (sClass2) this.removeClass(sClass2);
			}

			return this;
		}
	}
	
	return this.toggleClass(sClass, sClass2);
	
	
};

/**
 
 * Gets or set the text node value of HTML Elements.
 * @param {String} [sText] A text to set<br>
 * If a parameter is omitted, the text node is searched; if a parameter is specified, the text node is set with the parameter value.
 * @returns {String} Returns the HTML Element text node if a value is searched.<br>
 * Returns the current $Element object that sets the text node if a value is set.
 * @description [Lite]
 *
 * @example
<ul id="sample_ul">
	<li>One</li>
	<li>Two</li>
	<li>Three</li>
	<li>Four</li>
</ul>

...

// Searches the text node value.
$Element("sample_ul").text();
// Results
//	One
//	Two
//	Three
//	Four
@example
// Setting for the text node value
$Element("sample_ul").text('Five');

//Before
<ul id="sample_ul">
	<li>One</li>
	<li>Two</li>
	<li>Three</li>
	<li>Four</li>
</ul>

//After
<ul id="sample_ul">Five</ul>
@example
// Sets the text node value.
$Element("sample_p").text("New Content");

//Before
<p id="sample_p">
	Old Content
</p>

//After
<p id="sample_p">
	New Content
</p>
  
 */
jindo.$Element.prototype.text = function(sText) {
	var ele = this._element;
	var tag = this.tag;
	var prop = (typeof ele.innerText != "undefined")?"innerText":"textContent";

	if (tag == "textarea" || tag == "input") prop = "value";
	
	var type =  (typeof sText);
	if (type != "undefined"&&(type == "string" || type == "number" || type == "boolean")) {
		sText += "";
		try {
			/*
			 
 * for Opera 11.01. Opera 11.01 has textContent bug.so using innerText.
  
			 */ 
			if (prop!="value") prop = (typeof ele.textContent != "undefined")?"textContent":"innerText";
			ele[prop] = sText; 
		} catch(e) {
			return this.html(sText.replace(/&/g, '&amp;').replace(/</g, '&lt;'));
		}
		return this;
	}
	return ele[prop];
};

/**
 
 * Gets or sets the inner HTML (innerHTML) elements.
 * @param {String} [sHTML] The HTML string to set<br>
 * If a parameter is omitted, the inner HTML is searched; if a parameter is specified, the inner HTML is changed with the parameter value.
 * @return {String | $Element} Returns the inner HTML of HTML Elements if a value is searched.<br>
 * Returns the current $Element object that changes the inner HTML if a value is set.
 * @see $Element#outerHTML
 * @description [Lite]
 *
 * @example
 <div id="sample_container">
  	<p><em>Old</em> content</p>
 </div>

...

// Searches inner HTML values.
$Element("sample_container").html(); // <p><em>Old</em> content</p>

 * @example
// Searches inner HTML values.
$Element("sample_container").html("<p>New <em>content</em></p>");

//Before
<div id="sample_container">
 	<p><em>Old</em> content</p>
</div>

//After
<div id="sample_container">
 	<p>New <em>content</em></p>
</div>
  
 */
jindo.$Element.prototype.html = function(sHTML) {
	var isIe = IS_IE;
	var isFF = IS_FF;
	if (isIe) {
		jindo.$Element.prototype.html = function(sHTML){
			if (typeof sHTML != "undefined" && arguments.length) {
				sHTML += ""; 
				jindo.$$.release();
				var oEl = this._element;


				while(oEl.firstChild){
					oEl.removeChild(oEl.firstChild);
				}
				/*
				 
Fixes a problem so as to ensure that no error occurs when setting innerHTML
even in Select or TABLE, TR, THEAD, and TBODY tags in Internet Explorer or FireFox - hooriza
  
				 */
				var sId = 'R' + new Date().getTime() + parseInt(Math.random() * 100000,10);
				var oDoc = oEl.ownerDocument || oEl.document || document;

				var oDummy;
				var sTag = oEl.tagName.toLowerCase();

				switch (sTag) {
				case 'select':
				case 'table':
					oDummy = oDoc.createElement("div");
					oDummy.innerHTML = '<' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '>';
					break;

				case 'tr':
				case 'thead':
				case 'tbody':
				case 'colgroup':
					oDummy = oDoc.createElement("div");
					oDummy.innerHTML = '<table><' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '></table>';
					break;

				default:
					oEl.innerHTML = sHTML;
					break;
				}

				if (oDummy) {

					var oFound;
					for (oFound = oDummy.firstChild; oFound; oFound = oFound.firstChild)
						if (oFound.className == sId) break;

					if (oFound) {
						var notYetSelected = true;
						for (var oChild; oChild = oEl.firstChild;) oChild.removeNode(true); // innerHTML = '';

						for (var oChild = oFound.firstChild; oChild; oChild = oFound.firstChild){
							if(sTag=='select'){
								/*
								 
 *For the select tags in Internet Explorer, if the option that is selected exists and
 * the selected option is in the middle, the selected is continually set to true afterwards.
 * To solve this problem, copy the option by using cloneNode and then change selected. - mixed
  
								 */
								var cloneNode = oChild.cloneNode(true);
								if (oChild.selected && notYetSelected) {
									notYetSelected = false;
									cloneNode.selected = true;
								}
								oEl.appendChild(cloneNode);
								oChild.removeNode(true);
							}else{
								oEl.appendChild(oChild);
							}

						}
						oDummy.removeNode && oDummy.removeNode(true);

					}

					oDummy = null;

				}

				return this;

			}
			return this._element.innerHTML;
		}
	}else if(isFF){
		jindo.$Element.prototype.html = function(sHTML){
			if (typeof sHTML != "undefined" && arguments.length) {
				sHTML += ""; 
				var oEl = this._element;
				
				if(!oEl.parentNode){
					/*
					 
Fixes a problem so as to ensure that no error occurs when setting innerHTML
even in Select or TABLE, TR, THEAD, and TBODY tags in Internet Explorer or FireFox - hooriza
  
					 */
					var sId = 'R' + new Date().getTime() + parseInt(Math.random() * 100000,10);
					var oDoc = oEl.ownerDocument || oEl.document || document;

					var oDummy;
					var sTag = oEl.tagName.toLowerCase();

					switch (sTag) {
					case 'select':
					case 'table':
						oDummy = oDoc.createElement("div");
						oDummy.innerHTML = '<' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '>';
						break;

					case 'tr':
					case 'thead':
					case 'tbody':
					case 'colgroup':
						oDummy = oDoc.createElement("div");
						oDummy.innerHTML = '<table><' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '></table>';
						break;

					default:
						oEl.innerHTML = sHTML;
						break;
					}

					if (oDummy) {
						var oFound;
						for (oFound = oDummy.firstChild; oFound; oFound = oFound.firstChild)
							if (oFound.className == sId) break;

						if (oFound) {
							for (var oChild; oChild = oEl.firstChild;) oChild.removeNode(true); // innerHTML = '';

							for (var oChild = oFound.firstChild; oChild; oChild = oFound.firstChild){
								oEl.appendChild(oChild);
							}

							oDummy.removeNode && oDummy.removeNode(true);

						}

						oDummy = null;

					}
				}else{
					oEl.innerHTML = sHTML;
				}
				

				return this;

			}
			return this._element.innerHTML;
		}
	}else{
		jindo.$Element.prototype.html = function(sHTML){
			if (typeof sHTML != "undefined" && arguments.length) {
				sHTML += ""; 
				var oEl = this._element;
				oEl.innerHTML = sHTML;
				return this;
			}
			return this._element.innerHTML;
		}
	}
	
	return this.html(sHTML);
};

/**
 
 * Returns the outer HTML (outerHTML) of HTML Elements.
 * @return {String} The outer HTML
 * @see $Element#html
 * @description [Lite]
 *
 * @example
<h2 id="sample0">Today is...</h2>

<div id="sample1">
  	<p><span id="sample2">Sample</span> content</p>
</div>

...

// Searches outer HTML values.
$Element("sample0").outerHTML(); // <h2 id="sample0">Today is...</h2>

$Element("sample1").outerHTML(); // <div id="sample1">  <p><span id="sample2">Sample</span> content</p>  </div>

$Element("sample2").outerHTML(); // <span id="sample2">Sample</span>
  
 */
jindo.$Element.prototype.outerHTML = function() {
	var e = this._element;
	if (typeof e.outerHTML != "undefined") return e.outerHTML;
	
	var oDoc = e.ownerDocument || e.document || document;
	var div = oDoc.createElement("div");
	var par = e.parentNode;

    /**
      Returns innerHTML if no supernodes exist.
     */
	if(!par) return e.innerHTML;

	par.insertBefore(div, e);
	div.style.display = "none";
	div.appendChild(e);

	var s = div.innerHTML;
	par.insertBefore(e, div);
	par.removeChild(div);

	return s;
};

/**
 
 * Converts an HTML Element to an HTML string and returns it (same as the outerHTML method).
 * @return {String} The outer HTML
 * @see $Element#outerHTML
  
 */
jindo.$Element.prototype.toString = jindo.$Element.prototype.outerHTML;
