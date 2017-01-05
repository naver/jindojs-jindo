/**
 
  * @fileOverview $Element의 생성자 및 메서드를 정의한 파일
  * @name element.js
  * @author Kim, Taegon
  
 */

/**
 
 * @class $Element() 객체는 HTML 요소를 래핑(wrapping)하며, 해당 요소를 좀 더 쉽게 다룰 수 있는 기능을 제공한다.
 * @constructor
 * @description $Element() 객체를 생성한다.
 * @param {Variant} vElement $Element() 객체 생성자는 문자열(String), HTML 요소(Element), 또는 $Element() 객체를 파라미터로 지정할 수 있다.<br>
 <ul>
	<li>파라미터가 문자열이면 두 가지 방식으로 동작한다.
		<ul>
			<li>만일 "&lt;tagName&gt;"과 같은 형식의 문자열이면 tagName을 가지는 객체를 생성한다.</li>
			<li>그 이외의 경우 지정한 문자열을 ID로 갖는 HTML 요소를 사용하여 $Element() 객체를 생성한다.</li>
		</ul>
	</li>
	<li>파라미터가 HTML 요소이면 해당 요소를 래핑하여 $Element() 를 생성한다.</li>
	<li>파라미터가 $Element()이면 전달된 파라미터를 그대로 반환한다.</li>
</ul>
생성자의 파라미터가 undefined 혹은 null인 경우 null을 반환한다.
 * @return {$Element} 생성된 $Element() 객체.
 * @example
var element = $Element($("box"));	// HTML 요소를 파라미터로 지정
var element = $Element("box");		// HTML 요소의 id를 파라미터로 지정
var element = $Element("<DIV>");	// 태그를 파라미터로 지정, DIV 엘리먼트를 생성하여 래핑함       
  
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
 
 *	agent의 dependency를 없애기 위해 별로도 설정.
 *	@ignore
  
 **/
var _j_ag = navigator.userAgent;
var IS_IE = _j_ag.indexOf("MSIE") > -1;
var IS_FF = _j_ag.indexOf("Firefox") > -1;
var IS_OP = _j_ag.indexOf("Opera") > -1;
var IS_SF = _j_ag.indexOf("Apple") > -1;
var IS_CH = _j_ag.indexOf("Chrome") > -1;

/**
 
 * @description $value() 메서드는 원래의 HTML 요소를 반환한다.
 * @return {Element} $Element() 객체가 감싸고 있는 원본 요소.
 * @see $Element
 * @example
var element = $Element("sample_div");
element.$value(); // 원래의 엘리먼트가 반환된다
  
 */
jindo.$Element.prototype.$value = function() {
	return this._element;
};

/**
 
 * @description visible() 메서드는 HTML 요소의 display 속성을 확인하거나 display 속성을 설정하기 위해 사용한다. 파라미터를 생략하면 해당 요소의 display 속성을 확인하여 표시 여부를 Boolean 형태로 반환한다. display 속성이 none이면 false 값을 반환한다. 파라미터를 입력한 경우 display 속성에 대해 추가적인 설정이 가능하다.
 * @param {Boolean} [bVisible] 해당 요소의 표시 여부.<br>입력한 파라미터가 true인 경우 display 속성을 설정하고 false인 경우에는 display 속성을 none으로 변경한다.
 * @param {String} [sDisplay] 해당 요소의 display 속성 값.<br>bVisible 파라미터가 true 이면 sDisplay 값을 display 속성으로 설정한다.
 * @return {$Element} display 속성을 변경한 $Element() 객체
 * @since 1.1.2부터 bVisible 파라미터를 사용할 수 있다.
 * @since 1.4.5부터 sDisplay 파라미터를 사용할 수 있다.
 * @see <a href="http://www.w3.org/TR/2008/REC-CSS2-20080411/visuren.html#display-prop">display 속성</a> - W3C CSS2 Specification
 * @see $Element#show
 * @see $Element#hide
 * @see $Element#toggle
 * @example
<div id="sample_div" style="display:none">Hello world</div>

// 조회
$Element("sample_div").visible(); // false

 * @example
// 화면에 보이도록 설정
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
 
 * @description show() 메서드는 HTML 요소가 화면에 보이도록 display 속성을 변경한다.
 * @param {String} [sDisplay] display 속성에 지정할 값.<br>파라미터를 생략하면 태그별로 미리 지정된 기본 값이 속성 값으로 설정된다. 미리 지정된 기본 값이 없으면 "inline"으로 설정된다.
 * @return {$Element} display 속성이 변경된 $Element() 객체.
 * @since 1.4.5부터 sDisplay 파라미터를 사용할 수 있다.
 * @see <a href="http://www.w3.org/TR/2008/REC-CSS2-20080411/visuren.html#display-prop">display 속성</a> - W3C CSS2 Specification
 * @see $Element#hide
 * @see $Element#toggle
 * @see $Element#visible
 * @example
// 화면에 보이도록 설정
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
		 
IE에서 sDisplay값이 비정상적일때 block로 셋팅한다.
  
		 */
		s.display = "block";
	}

	return this;
};

/**
 
 * @description hide() 메서드는 HTML 요소가 화면에 보이지 않도록 display 속성을 none으로 변경한다.
 * @returns {$Element} display 속성이 none으로 변경된 $Element() 객체.
 * @see <a href="http://www.w3.org/TR/2008/REC-CSS2-20080411/visuren.html#display-prop">display 속성</a> - W3C CSS2 Specification
 * @see $Element#show
 * @see $Element#toggle
 * @see $Element#visible
 * @example
// 화면에 보이지 않도록 설정
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
 
 * @description toggle() 메서드는 HTML 요소의 display 속성을 변경하여 해당 요소를 화면에 보이거나, 보이지 않게 한다. 이 메서드는 마치 스위치를 켜고 끄는 것과 같이 요소의 표시 여부를 반전시킨다.
 * @param {String} [sDisplay] 해당 요소가 보이도록 변경할 때 display 속성에 지정할 값.<br>파라미터를 생략하면 태그별로 미리 지정된 기본 값이 속성 값으로 설정된다. 미리 지정된 기본 값이 없으면 "inline"으로 설정된다.
 * @returns {$Element} display 속성이 변경된 $Element() 객체.
 * @since 1.4.5부터 보이도록 설정할 때 sDisplay 값으로 display 속성 값 지정이 가능하다.
 * @see <a href="http://www.w3.org/TR/2008/REC-CSS2-20080411/visuren.html#display-prop">display 속성</a> - W3C CSS2 Specification
 * @see $Element#show
 * @see $Element#hide
 * @see $Element#visible
 * @example
// 화면에 보이거나, 보이지 않도록 처리
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
 
 * @description opacity() 메서드는 HTML 요소의 투명도(opacity 속성) 값을 가져오거나 설정한다.
 * @param {Number} [nValue] 설정할 투명도 값.<br>투명도 값은 0에서 1 사이의 실수 값으로 지정한다. 지정한 파라미터의 값이 0보다 작으면 0을, 1보다 크면 1을 설정한다.
 * @return {Number} HTML 요소의 투명도 값.
 * @example
<div id="sample" style="background-color:#2B81AF; width:20px; height:20px;"></div>

// 조회
$Element("sample").opacity();	// 1

 * @example
// 투명도 값 설정
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
     
IE에서 layout을 가지고 있지 않으면 opacity가 적용되지 않음.
  
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
 
 * @description css() 메서드는 HTML 요소의 CSS 속성 값을 가져오거나 설정한다. 이 메서드로 CSS 속성은 카멜 표기법(Camel Notation)을 사용한다. 예를 들면 border-width-bottom 속성은 borderWidthBottom으로 지정할 수 있다. 또한 float 속성은 JavaScript의 예약어로 사용되므로 css() 메서드에서는 float 대신 cssFloat을 사용한다(Internet Explorer에서는 styleFloat, 그 외의 브라우저에서는 cssFloat를 사용한다.).
 * @param {Variant} vName CSS 속성 이름(String), 하나 이상의 CSS 속성과 값을 가지는 객체(Object) 또는 해시 객체($H() 객체).<br>
 <ul>
	<li>파라미터가 문자열이면 다음과 같이 동작한다.
		<ul>
			<li>두 번째 파라미터인 vValue를 생략하면 vName으로 지정한 CSS 속성의 값을 가져온다.</li>
			<li>두 번째 파라미터인 vVlaue를 입력하면 vName으로 지정한 CSS 속성 값을 vValue로 설정한다.</li>
		</ul>
	</li>
	<li>Object 혹은 $H 객체를 사용하면 두 개 이상의 CSS 속성을 한번에 설정할 수 있다.</li>
</ul>
 * @param {Variant} [vValue] CSS 속성에 설정할 값.<br>숫자(Number) 혹은 단위를 포함한 문자열(String)을 사용한다.
 * @return {Variant} CSS 속성 값을 확인할 때는 문자열(String)을 반환하고, CSS 속성 값을 설정할 때는 값을 반영한 $Element() 객체를 반환한다.
 * @see $Element#attr
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

// CSS 속성 값 조회
$Element('btn').css('backgroundColor');		// rgb (0, 0, 255)

 * @example
// CSS 속성 값 설정
$Element('btn').css('backgroundColor', 'red');

//Before
<span id="btn"></span>

//After
<span id="btn" style="background-color: red;"></span>

 * @example
// 여러개의 CSS 속성 값을 설정
$Element('btn').css({
	width: "200px",		// 200
	height: "80px"  	// 80 으로 설정하여도 결과는 같음
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
 
 * css에서 사용되는 함수
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
				throw new Error((e.tagName||"document") + "는 css를 사용 할수 없습니다.");
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
				throw new Error((e.tagName||"document") + "는 css를 사용 할수 없습니다.");
			}
		}
	
	} else {
		fpGetCss = function(e, sName){
			try{
				if (sName == "cssFloat" && IS_IE) sName = "styleFloat";
				return e.style[sName];
			}catch(ex){
				throw new Error((e.tagName||"document") + "는 css를 사용 할수 없습니다.");
			}
		}
	}
	jindo.$Element.prototype._getCss = fpGetCss;
	return fpGetCss(e, sName);
	
}

/**
 
 * css에서 css를 세팅하기 위한 함수
 * @ignore
 * @param {Element} e
 * @param {String} k
  
 */
jindo.$Element.prototype._setCss = function(e, k, v){
	if (("#top#left#right#bottom#").indexOf(k+"#") > 0 && (typeof v == "number" ||(/\d$/.test(v)))) {
		e.style[k] = parseInt(v,10)+"px";
	}else{
		e.style[k] = v;
	}
}

/**
 
 * @description attr() 메서드는 HTML 요소의 속성을 가져오거나 설정한다. 하나의 파라미터만 사용하면 지정한 속성의 값을 반환하고 해당 속성이 없다면 null을 반환한다.
 * @param {Variant} vName 속성 이름(String), 하나 이상의 속성과 값을 가지는 객체(Object) 또는 해시 객체($H() 객체).<br>
 <ul>
	<li>파라미터가 문자열이면 다음과 같이 동작한다.
		<ul>
			<li>두 번째 파라미터인 vValue를 생략하면 vName으로 지정한 속성의 값을 가져온다.</li>
			<li>두 번째 파라미터인 vVlaue를 입력하면 vName으로 지정한 속성 값을 vValue로 설정한다.</li>
		</ul>
	</li>
	<li>Object 혹은 $H 객체를 사용하면 두 개 이상의 속성을 한번에 설정할 수 있다.</li>
</ul>
 
 * @param {Variant} [vValue] 속성에 설정할 값.<br>숫자(Number) 혹은 단위를 포함한 문자열(String)을 사용한다. 또한 속성의 값을 null로 설정하면 해당 HTML 속성을 삭제한다.
 * @return {Variant} 속성 값을 확인할 때는 문자열(String)을 반환하고, 속성 값을 설정할 때는 값을 반영한 $Element() 객체를 반환한다.
 * @see $Element#css
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
 
 * @description width() 메서드는 HTML 요소의 너비를 가져오거나 설정한다. width() 메서드는 HTML 요소의 실제 너비를 가져온다. 브라우저마다 Box 모델의 크기 계산 방법이 다르므로 CSS의 width 속성 값과 width 메서드()의 반환 값은 서로 다를 수 있다.
 * @param {Number} [nWidth]	설정할 너비 값.<br>단위는 픽셀(px)이며 파라미터의 값은 숫자로 지정한다. 파라미터를 생략하면 너비 값을 반환한다.
 * @return {Variant} 너비 값을 가져오는 경우에는 HTML 요소의 실제 너비(Number)를, 값을 설정하는 경우에는 너비 값이 반영된 $Element() 객체를 반환한다.
 * @see $Element#height
 * @example
<style type="text/css">
	div { width:70px; height:50px; padding:5px; margin:5px; background:red; }
</style>

<div id="sample_div"></div>

...

// 조회
$Element("sample_div").width();	// 80

 * @example
// 위의 예제 HTML 요소에 너비 값을 설정
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
 
 * @description height() 메서드는 HTML 요소의 높이를 가져오거나 설정한다. height() 메서드는 HTML 요소의 실제 높이를 가져온다. 브라우저마다 Box 모델의 크기 계산 방법이 다르므로 CSS의 height 속성 값과 height() 메서드의 반환 값은 서로 다를 수 있다.
 * @param {Number} [nHeight] 설정할 높이 값.<br>단위는 픽셀(px)이며 파라미터의 값은 숫자로 지정한다. 파라미터를 생략하면 높이 값을 반환한다.
 * @return {Variant} 높이 값을 가져오는 경우에는 HTML 요소의 실제 높이(Number)를, 값을 설정하는 경우에는 높이 값이 반영된 $Element() 객체를 반환한다.
 * @see $Element#width
 * @example
<style type="text/css">
	div { width:70px; height:50px; padding:5px; margin:5px; background:red; }
</style>

<div id="sample_div"></div>

...

// 조회
$Element("sample_div").height(); // 60

 * @example
// 위의 예제 HTML 요소에 높이 값을 설정
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
 
 * @description className() 메서드는 HTML 요소의 클래스 이름을 설정하거나 반환한다.
 * @param {String} [sClass] 설정할 클래스 이름.<br>이 파라미터를 생략하면 해당 요소에 현재 지정된 클래스 이름을 반환한다. 또한 하나 이상의 클래스를 지정하려면 공백으로 구분하여 지정할 클래스 이름을 나열한다.
 * @return {Variant} 클래스 이름(String)을 반환하거나 지정한 클래스가 반영된 $Element 객체가 반환된다. 클래스 이름을 결과로 받을 때 하나 이상의 클래스가 지정된 경우 공백으로 구분된 문자열이 반환된다.
 * @see $Element#hasClass
 * @see $Element#addClass
 * @see $Element#removeClass
 * @see $Element#toggleClass
 * @example
<style type="text/css">
p { margin: 8px; font-size:16px; }
.selected { color:#0077FF; }
.highlight { background:#C6E746; }
</style>

<p>Hello and <span id="sample_span" class="selected">Goodbye</span></p>

...

// 클래스 이름 조회
$Element("sample_span").className(); // selected

 * @example
// 위의 예제 HTML 요소에 클래스 이름 설정
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
 
 * @description hasClass() 메서드는 HTML 요소에서 특정 클래스를 사용하고 있는지 확인한다.
 * @param {String} sClass 확인할 클래스 이름.
 * @return {Boolean} 지정한 클래스의 사용 여부.
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

// 클래스의 사용여부를 확인
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
 
 * @description addClass() 메서드는 HTML 요소에 클래스를 추가한다.
 * @param {String} sClass 추가할 클래스 이름. 둘 이상의 클래스를 추가하려면 클래스 이름을 공백으로 구분하여 나열한다.
 * @return {$Element} 지정한 클래스가 추가된 $Element() 객체.
 * @see $Element#className
 * @see $Element#hasClass
 * @see $Element#removeClass
 * @see $Element#toggleClass
 * @example
// 클래스 추가
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
 
 * @description removeClass() 메서드는 HTML 요소에서 특정 클래스를 제거한다.
 * @param {String} sClass 제거할 클래스 이름. 둘 이상의 클래스를 제거하려면 클래스 이름을 공백으로 구분하여 나열한다.
 * @return {$Element} 지정한 클래스가 제거된 $Element() 객체.
 * @see $Element#className
 * @see $Element#hasClass
 * @see $Element#addClass
 * @see $Element#toggleClass
 *
 * @example
// 클래스 제거
$Element("sample_span").removeClass("selected");

//Before
<p>Hello and <span id="sample_span" class="selected highlight">Goodbye</span></p>

//After
<p>Hello and <span id="sample_span" class="highlight">Goodbye</span></p>
 * @example
// 여러개의 클래스를 제거
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
 
 * @description toogleClass() 메서드는 HTML 요소에 클래스가 이미 적용되어 있으면 제거하고 만약 없으면 추가한다. 파라미터를 하나만 입력할 경우 파라미터로 지정한 클래스가 사용되고 있으면 제거하고 사용되고 있지 않으면 추가한다. 만약 두 개의 파라미터를 입력할 경우 두 클래스 중에서 사용하고 있는 것을 제거하고 나머지 클래스를 추가한다.
 * @param {String} sClass 추가 혹은 제거할 클래스 이름.
 * @param {String} [sClass2] 추가 혹은 제거할 클래스 이름.
 * @return {$Element} 클래스가 추가 혹은 제거된 현재의 $Element 객체
 * @import core.$Element[hasClass,addClass,removeClass]
 * @see $Element#className
 * @see $Element#hasClass
 * @see $Element#addClass
 * @see $Element#removeClass
 * @example
// 파라미터가 하나인 경우
$Element("sample_span1").toggleClass("highlight");
$Element("sample_span2").toggleClass("highlight");

//Before
<p>Hello and <span id="sample_span1" class="selected highlight">Goodbye</span></p>
<p>Hello and <span id="sample_span2" class="selected">Goodbye</span></p>

//After
<p>Hello and <span id="sample_span1" class="selected">Goodbye</span></p>
<p>Hello and <span id="sample_span2" class="selected highlight">Goodbye</span></p>

 * @example
// 파라미터가 두 개인 경우
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
 
 * @description text() 메서드는 HTML 요소의 텍스트 노드 값을 가져오거나 설정한다. 파라미터를 생략하면 텍스트 노드의 값을 가져오고, 파라미터를 지정하면 텍스트 노드를 지정한 값으로 설정한다.
 * @param {String} [sText] 지정할 텍스트.
 * @returns {Variant} 텍스트 노드의 값을 조회하는 경우에는 HTML 요소의 텍스트 노드(String)를 반환하고, 텍스트 노드의 값을 설정하는 경우에는 지정한 값으로 설정된 $Element() 객체를 반환.
 * @example
<ul id="sample_ul">
	<li>하나</li>
	<li>둘</li>
	<li>셋</li>
	<li>넷</li>
</ul>

...

// 텍스트 노드 값 조회
$Element("sample_ul").text();
// 결과
//	하나
//	둘
//	셋
//	넷
@example
// 텍스트 노드 값 설정
$Element("sample_ul").text('다섯');

//Before
<ul id="sample_ul">
	<li>하나</li>
	<li>둘</li>
	<li>셋</li>
	<li>넷</li>
</ul>

//After
<ul id="sample_ul">다섯</ul>
@example
// 텍스트 노드 값 설정
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
			 
 * Opera 11.01에서 textContext가 Get일때 정상적으로 동작하지 않음. 그래서 get일 때는 innerText을 사용하고 set하는 경우는 textContent을 사용한다.(http://devcafe.nhncorp.com/ajaxui/295768)
  
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
 
 * @description html() 메서드는 HTML 요소의 내부 HTML 코드(innerHTML)를 가져오거나 설정한다. 파라미터를 생략하면 내부 HTML 코드를 가져오고, 파라미터를 지정하면 내부 HTML 코드를 지정한 값으로 변경한다.
 * @param {String} [sHTML] 내부 HTML 코드로 설정할 HTML 문자열.
 * @return {Variant} 내부 HTML 코드를 조회하는 경우에는 내부 HTML(String)을 반환하고, 내부 HTML 값을 설정하는 경우에는 지정한 값으로 설정된 $Element() 객체를 반환.
 * @see <a href="https://developer.mozilla.org/en/DOM/element.innerHTML">element.innerHTML</a> - MDN Docs
 * @see $Element#outerHTML
 * @example
 <div id="sample_container">
  	<p><em>Old</em> content</p>
 </div>

...

// 내부 HTML 조회
$Element("sample_container").html(); // <p><em>Old</em> content</p>

 * @example
// 내부 HTML 설정
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
				 
	IE 나 FireFox 의 일부 상황에서 SELECT 태그나 TABLE, TR, THEAD, TBODY 태그에 innerHTML 을 셋팅해도
	문제가 생기지 않도록 보완 - hooriza
  
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
								 
* ie에서 select테그일 경우 option중 selected가 되어 있는 option이 있는 경우 중간에
* selected가 되어 있으면 그 다음 부터는 계속 selected가 true로 되어 있어
* 해결하기 위해 cloneNode를 이용하여 option을 카피한 후 selected를 변경함. - mixed
  
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
					 
	IE 나 FireFox 의 일부 상황에서 SELECT 태그나 TABLE, TR, THEAD, TBODY 태그에 innerHTML 을 셋팅해도
	문제가 생기지 않도록 보완 - hooriza
  
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
 
 * @description outerHTML() 메서드는 HTML 요소의 내부 코드(innerHTML)에 해당하는 부분과 자신의 태그를 포함한 HTML 코드를 반환한다.
 * @return {String} HTML 코드.
 * @see $Element#html
 * @example
<h2 id="sample0">Today is...</h2>

<div id="sample1">
  	<p><span id="sample2">Sample</span> content</p>
</div>

...

// 외부 HTML 값을 조회
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
      상위노드가 없으면 innerHTML반환
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
 
 * @function
 * @description toString() 메서드는 해당 요소의 코드를 문자열로 변환하여 반환한다(outerHTML 메서드와 동일).
 * @return {String} HTML 코드.
 * @see $Element#outerHTML
  
 */
jindo.$Element.prototype.toString = jindo.$Element.prototype.outerHTML;
