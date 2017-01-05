/**
 
 * @fileOverview $Element의 확장 메서드를 정의한 파일
 * @name element.extend.js
  
 */


/**
 
 * appear ,disappear에서 사용되는 함수로 현재 transition을 사용 할수 있는지를 학인한다.
 * @ignore
  
 */
jindo.$Element._getTransition = function(){
	var hasTransition = false , sTransitionName = "";
	
	if (typeof document.body.style.trasition != "undefined") {
		hasTransition = true;
		sTransitionName = "trasition";
	}
	/*
	 
아직 firefox는 transitionEnd API를 지원 하지 않음.
  
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
 
 * @description appear() 메서드는 HTML 요소를 서서히 나타나게 한다(Fade-in 효과). 인터넷 익스플로러 6 버전에서 filter를 사용하면서 해당 요소가 position 속성을 가지고 있으며 사라지는 문제가 있다. 이 경우에는 HTML 요소에 position 속성이 없어야 정상적으로 사용할 수 있다. Webkit 기반의 브라우저(Safari 5 버전 이상, Mobile Safari, Chrome, Mobile Webkit), Opear 10.60 버전 이상의 브라우저에서는 CSS3 transition 속성을 사용한다. 그 이외의 브라우저에서는 자바스크립트를 사용한다.
 * @param {Number} nDuration HTML 요소가 완전히 나타날 때까지 걸리는 시간. 단위는 초(second)이다.
 * @param {Function} [fCallback] HTML 요소가 완전히 나타난 후에 실행할 콜백 함수.
 * @return {$Element} 현재의 $Element() 객체
 * @see <a href="http://www.w3.org/TR/css3-transitions/">CSS Transitions</a> - W3C
 * @see $Element#show
 * @see $Element#disappear
 * @example
$Element("sample1").appear(5, function(){
	$Element("sample2").appear(3);
});

//Before
<div style="display: none; background-color: rgb(51, 51, 153); width: 100px; height: 50px;" id="sample1">
	<div style="display: none; background-color: rgb(165, 10, 81); width: 50px; height: 20px;" id="sample2">
	</div>
</div>

//After(1) : sample1 요소가 나타남
<div style="display: block; background-color: rgb(51, 51, 153); width: 100px; height: 50px; opacity: 1;" id="sample1">
	<div style="display: none; background-color: rgb(165, 10, 81); width: 50px; height: 20px;" id="sample2">
	</div>
</div>

//After(2) : sample2 요소가 나타남
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
 
 * @description disappear() 메서드는 HTML 요소를 서서히 사라지게 한다(Fade-out 효과). HTML 요소가 완전히 사라지면 해당 요소의 display 속성은 none으로 변한다. Webkit 기반의 브라우저(Safari 5 버전 이상, Mobile Safari, Chrome, Mobile Webkit), Opear 10.6 버전 이상의 브라우저에서는 CSS3 transition 속성을 사용한다. 그 이외의 브라우저에서는 자바스크립트를 사용한다.
 * @param {Number} nDuration HTML 요소 완전히 사라질 때까지 걸리는 시간. 단위는 초를 사용한다.
 * @param {Function} [fCallback] HTML 요소가 완전히 사라진 후에 실행할 콜백 함수.
 * @return {$Element} 현재의 $Element() 객체.
 * @see <a href="http://www.w3.org/TR/css3-transitions/">CSS Transitions</a> - W3C
 * @see $Element#hide
 * @see $Element#appear
 * @example
$Element("sample1").disappear(5, function(){
	$Element("sample2").disappear(3);
});

//Before
<div id="sample1" style="background-color: rgb(51, 51, 153); width: 100px; height: 50px;">
</div>
<div id="sample2" style="background-color: rgb(165, 10, 81); width: 100px; height: 50px;">
</div>

//After(1) : sample1 요소가 사라짐
<div id="sample1" style="background-color: rgb(51, 51, 153); width: 100px; height: 50px; opacity: 1; display: none;">
</div>
<div id="sample2" style="background-color: rgb(165, 10, 81); width: 100px; height: 50px;">
</div>

//After(2) : sample2 요소가 사라짐
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
			 
opera 버그로 인하여 아래와 같이 처리함.
  
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
 
 * @description offset() 메서드는 HTML 요소의 위치를 가져오거나 설정한다. 파라미터를 생략하면 해당 HTML 요소의 위치 값을 반환한다. 파라미터를 지정하면 HTML 요소의 위치를 설정한다. 위치를 결정하는 기준점은 브라우저가 페이지를 표시하는 화면의 왼쪽 위 모서리이다. HTML 요소가 보이는 상태(display)에서 적용해야 한다. 요소가 화면에 보이지 않으면 정상적으로 동작하지 않을 수 있다. 일부 브라우저와 일부 상황에서 inline 요소에 대한 위치를 올바르게 구하지 못하는 문제가 있으며 이 경우 해당 요소의 position 속성을 relative 값으로 바꿔서 해결할 수 있다.<br>
 다음은 위치 값을 반환할 때 반환되는 객체의 속성 설명이다.<br>
 <table>
	<caption>HTML 요소 위치 정보 객체의 속성</caption>
	<thead>
		<tr>
			<th scope="col">이름</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>top</td>
			<td>Number</td>
			<td>문서의 맨 위에서 HTML 요소의 윗 부분까지의 거리를 저장한다.</td>
		</tr>
		<tr>
			<td>left</td>
			<td>Number</td>
			<td>문서의 왼쪽 가장자리에서 HTML 요소의 왼쪽 가장자리까지의 거리를 저장한다.</td>
		</tr>
	</tbody>
</table>
 * @param {Number} [nTop] 문서의 맨 위에서 HTML 요소의 윗 부분까지의 거리. 단위는 픽셀(px)이다.
 * @param {Number} [nLeft] 문서의 왼쪽 가장자리에서 HTML 요소의 왼쪽 가장자리까지의 거리. 단위는 픽셀(px)이다.
 * @return {Variant} 파라미터를 입력하면 위치 값이 변경된 $Element() 객체를 반환하고, 입력하지 않으면 HTML 요소의 위치 값을 객체(Object)로 반환한다.
 * @example
<style type="text/css">
	div { background-color:#2B81AF; width:20px; height:20px; float:left; left:100px; top:50px; position:absolute;}
</style>

<div id="sample"></div>

...

// 위치 값 조회
$Element("sample").offset(); // { left=100, top=50 }

 * @example
// 위치 값 설정
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
 
 * @description evalScripts() 메서드는 문자열에 포함된 JavaScript 코드를 실행한다. &lt;script&gt; 태그가 포함된 문자열을 파라미터로 지정하면, &lt;script&gt; 안에 있는 내용을 파싱하여 eval() 메서드를 수행한다.
 * @param {String} sHTML &lt;script&gt; 요소가 포함된 HTML 문자열.
 * @return {$Element} 현재의 $Element() 객체를 반환.
 * @example
// script 태그가 포함된 문자열을 지정
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
 
 * element를 뒤에 붙일때 사용되는 함수.
 * @ignore
 * @param {Element} 기준 엘리먼트
 * @param {Element} 붙일 엘리먼트
 * @return {$Element} 두번째 파라메터의 엘리먼트
  
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
 
 * element를 앞에 붙일때 사용되는 함수.
 * @ignore
 * @param {Element} 기준 엘리먼트
 * @param {Element} 붙일 엘리먼트
 * @return {$Element} 두번째 파라메터의 엘리먼트
  
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
 
 * @description append() 메서드는 $Element() 객체에 있는 요소의 마지막 자식 노드로 파라미터로 지정한 HTML 요소를 배정한다.
 * @param {Variant} vElement 마지막 자식 노드로 배정할 HTML 요소. 배정할 요소의 ID(String), HTML 요소(Element) 또는 $Element() 객체를 파라미터로 지정할 수 있다.<br>
<ul>
	<li>파라미터로 문자열이 입력되면 해당 문자열을 ID로 갖는 HTML 요소를 마지막 자식 노드로 배정한다.</li>
	<li>파라미터로 HTML 요소가 입력되면 해당 요소를 마지막 자식 노드로 배정한다.</li>
	<li>파라미터로 $Element() 객체가 입력되면 해당 $Element() 객체 내부의 HTML 요소를 마지막 자식 노드로 배정한다.</li>
</ul>
 * @return {$Element} 입력한 파라미터가 마지막 자식 노드로 배정된 $Element() 객체.
 * @see $Element#prepend
 * @see $Element#before
 * @see $Element#after
 * @see $Element#appendTo
 * @see $Element#prependTo
 * @see $Element#wrap
 * @example
// ID가 sample1인 HTML 요소에
// ID가 sample2인 HTML 요소를 추가
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
// ID가 sample인 HTML 요소에
// 새로운 DIV 요소를 추가
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
 
 * @description prepend() 메서드는 $Element() 객체에 있는 요소의 첫 번째 자식 노드로 파라미터로 지정한 HTML 요소를 배정한다.
 * @param {Variant} vElement 첫 번째 자식 요소로 배정할 HTML 요소. 배정할 요소의 ID(String), HTML 요소(Element) 또는 $Element() 객체를 파라미터로 지정할 수 있다.<br>
<ul>
	<li>파라미터로 문자열이 입력되면 해당 문자열을 ID로 갖는 HTML 요소를 첫 번째 자식 노드로 배정한다.</li>
	<li>파라미터로 HTML 요소가 입력되면 해당 요소를 첫 번째 자식 노드로 배정한다.</li>
	<li>파라미터로 $Element() 객체가 입력되면 해당 $Element() 객체 내부의 HTML 요소를 첫 번째 자식 노드로 배정한다.</li>
</ul>
 * @return {$Element} 입력한 파라미터가 첫 번째 자식 노드로 배정된 $Element() 객체.
 * @see $Element#append
 * @see $Element#before
 * @see $Element#after
 * @see $Element#appendTo
 * @see $Element#prependTo
 * @see $Element#wrap
 * @example
// ID가 sample1인 HTML 요소에서
// ID가 sample2인 HTML 요소를 첫 번째 자식 노드로 이동
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
// ID가 sample인 HTML 요소에
// 새로운 DIV 요소를 추가
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
 
 * @description replace() 메서드는 $Element() 객체 내부의 HTML 요소를 지정한 파라미터의 요소로 대체한다.
 * @param {Variant} vElement 대체할 HTML 요소. 대체할 요소의 ID(String), HTML 요소(Element) 또는 $Element() 객체를 파라미터로 지정할 수 있다.<br>
<ul>
	<li>파라미터로 문자열이 입력되면 해당 문자열을 ID로 갖는 HTML 요소로 현재 $Element() 객체의 요소를 대체한다.</li>
	<li>파라미터로 HTML 요소가 입력되면 해당 요소를 현재 $Element() 객체가 가지고 있는 요소로 대체한다.</li>
	<li>파라미터로 $Element() 객체가 입력되면 해당 $Element() 객체 내부의 HTML 요소를 현재 $Element() 객체가 가지고 있는 요소로 대체한다.</li>
</ul>
 * @return {$Element} 입력한 파라미터로 요소가 변경된 $Element() 객체.
 * @example
// ID가 sample1인 HTML 요소에서
// ID가 sample2인 HTML 요소로 대체
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
// 새로운 DIV 요소로 대체
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
 
 * @description appendTo() 메서드는 $Element() 객체에 있는 요소를 파라미터로 지정한 요소의 마지막 자식 요소로 배정한다.
 * @param {Variant} vElement 마지막 자식 요소로 배정할 HTML 요소. 배정할 요소의 ID(String), HTML 요소(Element) 또는 $Element() 객체를 파라미터로 지정할 수 있다.<br>
<ul>
	<li>파라미터로 문자열이 입력되면 해당 문자열을 ID로 갖는 HTML 요소의 마지막 자식 노드로 자신을 배정한다.</li>
	<li>파라미터로 HTML 요소가 입력되면 해당 요소의 마지막 자식 노드로 자신을 배정한다.</li>
	<li>파라미터로 $Element() 객체가 입력되면 해당 $Element() 객체 내부 HTML 요소의 마지막 자식 노드로 자신을 배정한다.</li>
</ul>
 * @return {$Element} 파라미터로 입력된 $Element() 객체.
 * @see $Element#append
 * @see $Element#prepend
 * @see $Element#before
 * @see $Element#after
 * @see $Element#prependTo
 * @see $Element#wrap
 * @example
// ID가 sample2인 HTML 요소에
// ID가 sample1인 HTML 요소를 추가
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
 
 * @description prependTo() 메서드는 $Element() 객체에 있는 요소를 파라미터로 지정한 요소의 첫 번째 자식 노드로 배정한다.
 * @param {Variant} vElement 첫 번째 자식 노드로 배정할 HTML 요소. 배정할 요소의 ID(String), HTML 요소(Element) 또는 $Element() 객체를 파라미터로 지정할 수 있다.<br>
<ul>
	<li>파라미터로 문자열이 입력되면 해당 문자열을 ID로 갖는 HTML 요소의 첫 번째 자식 노드로 자신을 배정한다.</li>
	<li>파라미터로 HTML 요소가 입력되면 해당 요소의 첫 번째 자식 노드로 자신을 배정한다.</li>
	<li>파라미터로 $Element() 객체가 입력되면 해당 $Element() 객체 내부 HTML 요소의 첫 번째 자식 노드로 자신을 배정한다.</li>
</ul>
 * @return {$Element} 파라미터로 입력된 $Element() 객체.
 * @see $Element#append
 * @see $Element#prepend
 * @see $Element#before
 * @see $Element#after
 * @see $Element#appendTo
 * @see $Element#wrap
 * @example
// ID가 sample2인 HTML 요소에
// ID가 sample1인 HTML 요소를 추가
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
 
 * @description before() 메서드는 $Element() 객체에 있는 요소의 이전 형제 노드(previousSibling)로 파라미터로 지정한 요소를 배정한다.
 * @param {Variant} vElement 이전 형제 노드로 배정할 HTML 요소. 배정할 요소의 ID(String), HTML 요소(Element) 또는 $Element() 객체를 파라미터로 지정할 수 있다.<br>
<ul>
	<li>파라미터로 문자열이 입력되면 해당 문자열을 ID로 갖는 HTML 요소를 자신의 이전 형제 노드로 배정한다.</li>
	<li>파라미터로 HTML 요소가 입력되면 해당 요소를 자신의 이전 형제 노드로 배정한다.</li>
	<li>파라미터로 $Element() 객체가 입력되면 해당 $Element() 객체 내부 HTML 요소를 자신의 이전 형제 노드로 배정한다.</li>
</ul>
 * @return {$Element} 파라미터로 입력된 $Element() 객체.
 * @see $Element#append
 * @see $Element#prepend
 * @see $Element#after
 * @see $Element#appendTo
 * @see $Element#prependTo
 * @see $Element#wrap
 * @example
// ID가 sample1인 HTML 요소 앞에
// ID가 sample2인 HTML 요소를 추가 함
$Element("sample1").before("sample2"); // sample2를 래핑한 $Element 를 반환

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
// 새로운 DIV 요소를 추가
var elNew = $("<div>Hello New</div>");
$Element("sample").before(elNew); // elNew 요소를 래핑한 $Element 를 반환

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
 
 * @description after() 메서드는 $Element() 객체에 있는 요소의 다음 형제 노드(nextSibling)로 파라미터로 지정한 요소를 배정한다.
 * @param {Variant} vElement 다음 형제 노드 배정할 HTML 요소. 배정할 요소의 ID(String), HTML 요소(Element) 또는 $Element() 객체를 파라미터로 지정할 수 있다.<br>
<ul>
	<li>파라미터로 문자열이 입력되면 해당 문자열을 ID로 갖는 HTML 요소를 자신의 다음 형제 노드로 배정한다.</li>
	<li>파라미터로 HTML 요소가 입력되면 해당 요소를 자신의 다음 형제 노드로 배정한다.</li>
	<li>파라미터로 $Element() 객체가 입력되면 해당 $Element() 객체 내부 HTML 요소를 자신의 다음 형제 노드로 배정한다.</li>
</ul>
 * @return {$Element} 파라미터로 입력된 $Element() 객체.
 * @see $Element#append
 * @see $Element#prepend
 * @see $Element#before
 * @see $Element#appendTo
 * @see $Element#prependTo
 * @see $Element#wrap
 * @example
// ID가 sample1인 HTML 요소 뒤에
// ID가 sample2인 HTML 요소를 추가 함
$Element("sample1").after("sample2");  // sample2를 래핑한 $Element 를 반환

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
// 새로운 DIV 요소를 추가
var elNew = $("<div>Hello New</div>");
$Element("sample").after(elNew); // elNew 요소를 래핑한 $Element 를 반환

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
 
 * @description parent() 메서드는 HTML 요소의 상위 노드에 해당하는 요소를 검색한다.
 * @param {Function} [fCallback] 상위 요소의 검색 조건을 지정한 콜백 함수.<br>파라미터를 생략하면 부모 요소를 반환하고, 파라미터로 콜백 함수를 지정하면 콜백 함수의 실행 결과가 true를 반환하는 상위 요소를 반환한다. 이때 콜백 함수는 결과를 배열로 반환한다. 콜백 함수의 파라미터로 탐색 중인 상위 요소의 $Element() 객체가 입력된다.
 * @param {Number} [nLimit] 탐색할 상위 요소의 레벨.<br>파라미터를 생략하면 모든 상위 요소를 탐색한다. fCallback 파라미터를 null로 설정하고 nLimit 파라미터를 설정하면 제한된 레벨의 상위 요소를 조건없이 검색한다.
 * @return {Variant} 부모 요소가 담긴 $Element() 객체 혹은 조건을 만족하는 상위 요소의 배열(Array).<br>파라미터를 생략하여 부모 요소를 반환하는 경우, $Element() 객체로 반환하고 그 이외에는 $Element() 객체를 원소로 갖는 배열로 반환한다.
 * @see $Element#child
 * @see $Element#prev
 * @see $Element#next
 * @see $Element#first
 * @see $Element#last
 * @see $Element#indexOf
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
	// ID가 div3인 DIV를 래핑한 $Element를 반환

	parent = welTarget.parent(function(v){
	        return v.hasClass("sample");
	    });
	// ID가 div3인 DIV를 래핑한 $Element와
	// ID가 div1인 DIV를 래핑한 $Element를 원소로 하는 배열을 반환

	parent = welTarget.parent(function(v){
	        return v.hasClass("sample");
	    }, 1);
	// ID가 div3인 DIV를 래핑한 $Element를 원소로 하는 배열을 반환
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
 
 * @description child() 메서드는 HTML 요소의 하위 노드에 해당하는 요소를 검색한다.
 * @param {Function} [fCallback] 하위 요소의 검색 조건을 지정한 콜백 함수.<br>파라미터를 생략하면 자식 요소를 반환하고, 파라미터로 콜백 함수를 지정하면 콜백 함수의 실행 결과가 true를 반환하는 하위 요소를 반환한다. 이때 콜백 함수는 결과를 배열로 반환한다. 콜백 함수의 파라미터로 탐색 중인 하위 요소의 $Element() 객체가 입력된다.
 * @param {Number} [nLimit] 탐색할 하위 요소의 레벨.<br>파라미터를 생략하면 모든 하위 요소를 탐색한다. fCallback 파라미터를 null로 설정하고 nLimit 파라미터를 설정하면 제한된 레벨의 하위 요소를 조건없이 검색한다.
 * @return {Variant} 자식 요소가 담긴 배열(Array) 혹은 조건을 만족하는 하위 요소의 배열(Array).<br>하나의 하위 요소를 반환할 때는 $Element() 객체를 반환하고 그 이외에는 $Element() 객체를 원소로 갖는 배열로 반환한다.
 * @see $Element#parent
 * @see $Element#prev
 * @see $Element#next
 * @see $Element#first
 * @see $Element#last
 * @see $Element#indexOf
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
	// ID가 div1인 DIV를 래핑한 $Element와
	// ID가 div7인 DIV를 래핑한 $Element를 원소로 하는 배열을 반환

	child = welTarget.child(function(v){
	        return v.hasClass("sample");
	    });
	// ID가 div2인 DIV를 래핑한 $Element와
	// ID가 div5인 DIV를 래핑한 $Element와
	// ID가 div6인 DIV를 래핑한 $Element와
	// ID가 div7인 DIV를 래핑한 $Element를 원소로 하는 배열을 반환

	child = welTarget.child(function(v){
	        return v.hasClass("sample");
	    }, 1);
	// ID가 div7인 DIV를 래핑한 $Element를 원소로 하는 배열을 반환

	child = welTarget.child(function(v){
	        return v.hasClass("sample");
	    }, 2);
	// ID가 div2인 DIV를 래핑한 $Element와
	// ID가 div7인 DIV를 래핑한 $Element를 원소로 하는 배열을 반환
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
 
 * @description prev() 메서드는 HTML 요소의 이전 형제 노드에 해당하는 요소를 검색한다.
 * @param {Function} [fCallback] 이전 형제 요소의 검색 조건을 지정한 콜백 함수.<br>파라미터를 생략하면 바로 이전 형제 요소를 반환하고, 파라미터로 콜백 함수를 지정하면 콜백 함수의 실행 결과가 true를 반환하는 이전 형제 요소를 반환한다. 이때 콜백 함수는 결과를 배열로 반환한다. 콜백 함수의 파라미터로 탐색 중인 이전 형제 요소의 $Element() 객체가 입력된다.
 * @return {Variant} 바로 이전 형제 요소가 담긴 $Element() 객체 혹은 조건을 만족하는 이전 형제 요소의 배열(Array).<br>바로 이전 형제 요소를 반환할 때는 $Element() 객체를 반환하고 그 이외에는 $Element() 객체를 원소로 갖는 배열로 반환한다.
 * @see $Element#parent
 * @see $Element#child
 * @see $Element#next
 * @see $Element#first
 * @see $Element#last
 * @see $Element#indexOf
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
	// ID가 sample_div5인 DIV를 래핑한 $Element를 반환

	sibling = $Element("sample_div").prev(function(v){
	    return $Element(v).hasClass("sample");
	});
	// ID가 sample_div5인 DIV를 래핑한 $Element와
	// ID가 sample_div3인 DIV를 래핑한 $Element를 원소로 하는 배열을 반환
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
 
 * @description next() 메서드는 HTML 요소의 다음 형제 노드에 해당하는 요소를 검색한다.
 * @param {Function} [fCallback] 다음 형제 요소의 검색 조건을 지정한 콜백 함수.<br>파라미터를 생략하면 바로 다음 형제 요소를 반환하고, 파라미터로 콜백 함수를 지정하면 콜백 함수의 실행 결과가 true를 반환하는 다음 형제 요소를 반환한다. 이때 콜백 함수는 결과를 배열로 반환한다. 콜백 함수의 파라미터로 탐색 중인 다음 형제 요소의 $Element() 객체가 입력된다.
 * @return {Variant} 바로 다음 형제 요소가 담긴 $Element() 객체 혹은 조건을 만족하는 다음 형제 요소의 배열(Array).<br>바로 다음 형제 요소를 반환할 때는 $Element() 객체를 반환하고 그 이외에는 $Element() 객체를 원소로 갖는 배열로 반환한다.
 * @see $Element#parent
 * @see $Element#child
 * @see $Element#prev
 * @see $Element#first
 * @see $Element#last
 * @see $Element#indexOf
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
	// ID가 sample_div7인 DIV를 래핑한 $Element를 반환

	sibling = $Element("sample_div").next(function(v){
	    return $Element(v).hasClass("sample");
	});
	// ID가 sample_div8인 DIV를 래핑한 $Element를 원소로 하는 배열을 반환
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
 
 * @description first() 메서드는 HTML 요소의 첫 번째 자식 노드에 해당하는 요소를 반환한다.
 * @return {$Element} 첫 번째 자식 노드에 해당하는 요소.
 * @since 1.2.0 버전부터 사용 가능
 * @see $Element#parent
 * @see $Element#child
 * @see $Element#prev
 * @see $Element#next
 * @see $Element#last
 * @see $Element#indexOf
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
	// ID가 sample_div3인 DIV를 래핑한 $Element를 반환
</script>
  
 */
jindo.$Element.prototype.first = function() {
	var el = this._element.firstElementChild||this._element.firstChild;
	if (!el) return null;
	while(el && el.nodeType != 1) el = el.nextSibling;

	return el?jindo.$Element(el):null;
}

/**
 
 * @description last() 메서드는 HTML 요소의 마지막 자식 노드에 해당하는 요소를 반환한다.
 * @return {$Element} 마지막 자식 노드에 해당하는 요소.
 * @since 1.2.0 버전부터 사용 가능
 * @see $Element#parent
 * @see $Element#child
 * @see $Element#prev
 * @see $Element#next
 * @see $Element#first
 * @see $Element#indexOf
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
	// ID가 sample_div5인 DIV를 래핑한 $Element를 반환
</script>
  
 */
jindo.$Element.prototype.last = function() {
	var el = this._element.lastElementChild||this._element.lastChild;
	if (!el) return null;
	while(el && el.nodeType != 1) el = el.previousSibling;

	return el?jindo.$Element(el):null;
}

/**
 
 * @description isChildOf() 메서드는 파라미터로 지정한 요소가 HTML 요소의 부모 노드인지 검사한다.
 * @param {Variant} vElement 부모 노드인지 검사할 HTML 요소. 검사할 요소의 ID(String), HTML 요소(Element) 또는 $Element() 객체를 파라미터로 지정할 수 있다.<br>
<ul>
	<li>파라미터로 문자열이 입력되면 해당 문자열을 ID로 갖는 HTML 요소가 자신의 부모 요소인지 검사한다.</li>
	<li>파라미터로 HTML 요소가 입력되면 해당 요소가 자신의 부모 요소인지 검사한다.</li>
	<li>파라미터로 $Element() 객체가 입력되면 해당 $Element() 객체 내부의 HTML 요소가 자신의 부모 요소인지 검사한다.</li>
</ul>
 * @return {Boolean} 지정한 요소가 부모 요소이면 true, 그렇지 않으면 false를 반환한다.
 * @see $Element#isParentOf
 * @example
<div id="parent">
	<div id="child">
		<div id="grandchild"></div>
	</div>
</div>
<div id="others"></div>

...

// 부모/자식 확인하기
$Element("child").isChildOf("parent");		// 결과 : true
$Element("others").isChildOf("parent");		// 결과 : false
$Element("grandchild").isChildOf("parent");	// 결과 : true
  
 */
jindo.$Element.prototype.isChildOf = function(element) {
	return jindo.$Element._contain(jindo.$Element(element).$value(),this._element);
};

/**
 
 * @description isParentOf() 메서드는 파라미터로 지정한 요소가 HTML 요소의 자식 노드인지 검사한다.
 * @param {Variant} vElement 자식 노드인지 검사할 HTML 요소. 검사할 요소의 ID(String), HTML 요소(Element) 또는 $Element() 객체를 파라미터로 지정할 수 있다.<br>
<ul>
	<li>파라미터로 문자열이 입력되면 해당 문자열을 ID로 갖는 HTML 요소가 자신의 자식 요소인지 검사한다.</li>
	<li>파라미터로 HTML 요소가 입력되면 해당 요소가 자신의 자식 요소인지 검사한다.</li>
	<li>파라미터로 $Element() 객체가 입력되면 해당 $Element() 객체 내부의 HTML 요소가 자신의 자식 요소인지 검사한다.</li>
</ul>
 * @return {Boolean} 지정한 요소가 자식 요소이면 true, 그렇지 않으면 false를 반환한다.
 * @see $Element#isChildOf
 * @example
<div id="parent">
	<div id="child"></div>
</div>
<div id="others"></div>

...

// 부모/자식 확인하기
$Element("parent").isParentOf("child");		// 결과 : true
$Element("others").isParentOf("child");		// 결과 : false
$Element("parent").isParentOf("grandchild");// 결과 : true
  
 */
jindo.$Element.prototype.isParentOf = function(element) {
	return jindo.$Element._contain(this._element, jindo.$Element(element).$value());
};

/**
 
 * isChildOf , isParentOf의 기본이 되는 API(IE에서는 contains,기타 브라우져에는 compareDocumentPosition을 사용하고 둘다 없는 경우는 기존 레거시 API사용.)
 * @param {HTMLElement} eParent	부모노드
 * @param {HTMLElement} eChild	자식노드
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
 
 * @description isEqual() 메서드는 파라미터로 지정한 요소가 HTML 요소와 같은 요소인지 검사한다. DOM Level 3 명세의 API 중 isSameNode 함수와 같은 메서드로 레퍼런스까지 확인한다. isEqualNode() 메서드와는 다른 함수이기 때문에 주의한다.
 * @param {Variant} vElement 같은 요소인지 비교할 HTML 요소. 비교할 요소의 ID(String), HTML 요소(Element) 또는 $Element() 객체를 파라미터로 지정할 수 있다.<br>
<ul>
	<li>파라미터로 문자열이 입력되면 해당 문자열을 ID로 갖는 HTML 요소가 자신과 같은 요소인지 검사한다.</li>
	<li>파라미터로 HTML 요소가 입력되면 해당 요소가 자신과 같은 요소인지 검사한다.</li>
	<li>파라미터로 $Element() 객체가 입력되면 해당 $Element() 객체 내부의 HTML 요소가 자신과 같은 요소인지 검사한다.</li>
</ul>
 * @return {Boolean} 지정한 요소와 같은 요소요소이면 true, 그렇지 않으면 false를 반환한다.
 * @see <a href="http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-isSameNode">isSameNode</a> - W3C DOM Level 3 Specification
 * @see $Element#isEqualnode
 * @example
<div id="sample1"><span>Sample</span></div>
<div id="sample2"><span>Sample</span></div>

...

// 같은 HTML 요소인지 확인
var welSpan1 = $Element("sample1").first();	// <span>Sample</span>
var welSpan2 = $Element("sample2").first();	// <span>Sample</span>

welSpan1.isEqual(welSpan2); // 결과 : false
welSpan1.isEqual(welSpan1); // 결과 : true
  
 */
jindo.$Element.prototype.isEqual = function(element) {
	try {
		return (this._element === jindo.$Element(element).$value());
	} catch(e) {
		return false;
	}
};

/**
 
 * @description fireEvent() 메서드는 HTML 요소에 이벤트를 발생시킨다. 파라미터로 발생시킬 이벤트 종류와 이벤트 객체의 속성을 지정할 수 있다.
 * @param {String} sEvent 발생시킬 이벤트 이름. on 접두사는 생략한다.
 * @param {Object} [oProps] 이벤트 객체의 속성을 지정한 객체. 이벤트를 발생시킬 때 속성을 설정할 수 있다.
 * @return {$Element} 이벤트가 발생한 HTML 요소의 $Element() 객체.
 * @since 1.4.1 버전부터 keyCode 값을 설정할 수 있다. WebKit 계열에서는 이벤트 객체의 keyCode가 읽기 전용(read-only)인 관계로 key 이벤트를 발생시킬 경우 keyCode 값을 설정할 수 없었다.
 * @example
$Element("div").fireEvent("click", {left : true, middle : false, right : false}); // click 이벤트 발생
$Element("div").fireEvent("mouseover", {screenX : 50, screenY : 50, clientX : 50, clientY : 50}); // mouseover 이벤트 발생
$Element("div").fireEvent("keydown", {keyCode : 13, alt : true, shift : false ,meta : false, ctrl : true}); // keydown 이벤트 발생
  
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
 
 * @description empty() 메서드는 HTML 요소의 자식 노드를 모두 제거한다.
 * @return {$Element} 자식 노드를 모두 제거한 $Element 객체.
 * @see $Element#leave
 * @see $Element#remove
 * @example
// 자식 노드를 모두 제거
$Element("sample").empty();

//Before
<div id="sample"><span>노드</span> <span>모두</span> 삭제하기 </div>

//After
<div id="sample"></div>
  
 */
jindo.$Element.prototype.empty = function() {
	jindo.$$.release();
	this.html("");
	return this;
};

/**
 
 * @description remove() 메서드는 HTML 요소의 특정 자식 노드를 제거한다. 파라미터로 지정한 자식 요소를 제거하며 제거되는 자식 요소의 이벤트 핸들러도 제거한다.
 * @param {Variant} vElement 자식 요소에서 제거할 HTML 요소. 제거할 요소의 ID(String), HTML 요소(Element) 또는 $Element() 객체를 파라미터로 지정할 수 있다.<br>
<ul>
	<li>파라미터로 문자열이 입력되면 해당 문자열을 ID로 갖는 자식 요소를 제거한다.</li>
	<li>파라미터로 HTML 요소가 입력되면 해당 자식 요소를 제거한다.</li>
	<li>파라미터로 $Element() 객체가 입력되면 $Element() 객체 내부의 HTML 요소에 해당하는 자식 요소를 제거한다.</li>
</ul>
 * @return {$Element} 지정한 자식 요소를 제거한 $Element() 객체.
 * @see $Element#empty
 * @see $Element#leave
 * @example
// 특정 자식 노드를 제거
$Element("sample").remove("child2");

//Before
<div id="sample"><span id="child1">노드</span> <span id="child2">삭제하기</span></div>

//After
<div id="sample"><span id="child1">노드</span> </div>
  
 */
jindo.$Element.prototype.remove = function(oChild) {
	jindo.$$.release();
	jindo.$Element(oChild).leave();
	return this;
}

/**
 
 * @description leave() 메서드는 HTML 요소를 자신의 부모 요소에서 제거한다. HTML 요소에 등록된 이벤트 핸들러도 제거한다.
 * @return {$Element} 부모 요소에서 제거된 $Element() 객체.
 * @see $Element#empty
 * @see $Element#remove
 *
 * @example
// 부모 요소 노드에서 제거
$Element("sample").leave();

//Before
<div>
	<div id="sample"><span>노드</span> <span>모두</span> 삭제하기 </div>
</div>

//After
// <div id="sample"><span>노드</span> <span>모두</span> 삭제하기 </div>를 래핑한 $Element가 반환된다
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
 
 * @description wrap() 메서드는 HTML 요소를 지정한 요소로 감싼다. HTML 요소는 지정한 요소의 마지막 자식 요소가 된다.
 * @param {Variant} vElement 부모가 될 HTML 요소. 부모가 될 요소의 ID(String), HTML 요소(Element) 또는 $Element() 객체를 파라미터로 지정할 수 있다.<br>
<ul>
	<li>파라미터로 문자열이 입력되면 해당 문자열을 ID로 갖는 HTML 요소를 자신의 부모 요소로 지정한다.</li>
	<li>파라미터로 HTML 요소가 입력되면 해당 요소를 자신의 부모 요소로 지정한다.</li>
	<li>파라미터로 $Element() 객체가 입력되면 해당 $Element() 객체 내부의 HTML 요소를 자신의 부모 요소로 지정한다.</li>
</ul>
 * @return {$Element} 지정한 요소로 감싸진 $Element() 객체.
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
 
 * @description ellipsis() 메서드는 HTML 요소의 텍스트 노드가 브라우저에서 한 줄로 보이도록 길이를 조절한다. 이 메서드는 HTML 요소가 텍스트 노드만을 포함한다고 가정하고 동작한다. 따라서, 이 외의 상황에서는 사용을 자제한다. 또한 브라우저에서 HTML 요소의 너비를 기준으로 텍스트 노드의 길이를 정하므로 HTML 요소는 반드시 보이는 상태(display)여야 한다. 화면에 전체 텍스트 노드가 보였다가 줄어드는 경우가 있다. 이 경우, HTML 요소에 overflow 속성의 값을 hidden으로 지정하면 해결할 수 있다.
 * @param {String} [sTail] 말줄임 표시자.<br>파라미터에 지정한 문자열을 텍스트 노드 끝에 붙이고 텍스트 노드의 길이를 조절한다. 파라미터를 생락하면 기본 값으로 '...'를 사용한다.
 * @returns {void}
 * @example
$Element("sample_span").ellipsis();

//Before
<div style="width:300px; border:1px solid #CCCCCC; padding:10px">
	<span id="sample_span">NHN은 검색과 게임을 양축으로 혁신적이고 편리한 온라인 서비스를 꾸준히 선보이며 디지털 라이프를 선도하고 있습니다.</span>
</div>

//After
<div style="width:300px; border:1px solid #CCCCCC; padding:10px">
	<span id="sample_span">NHN은 검색과 게임을 양축으로 혁신적...</span>
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
 
 * @description indexOf() 메서드는 HTML 요소에서 파라미터로 지정한 요소가 몇 번째 자식인지 확인하여 인덱스를 반환한다.
 * @param {Variant} vElement 검색할 HTML 요소. 몇 번째 자식인지 검색할 요소의 ID(String), HTML 요소(Element) 또는 $Element() 객체를 파라미터로 지정할 수 있다.<br>
<ul>
	<li>파라미터로 문자열이 입력되면 해당 문자열을 ID로 갖는 HTML 요소가 자신의 몇 번째 자식인지 검사한다.</li>
	<li>파라미터로 HTML 요소가 입력되면 해당 요소가 자신의 몇 번째 자식인지 검사한다.</li>
	<li>파라미터로 $Element() 객체가 입력되면 해당 $Element() 객체 내부의 HTML 요소가 자신의 몇 번째 자식인지 검사한다.</li>
</ul>
 * @return {Number} 검색 결과 인덱스.<br>인덱스는 0부터 시작하며, 찾지 못한 경우에는 -1 을 반환한다.
 * @since 1.2.0
 * @see $Element#parent
 * @see $Element#child
 * @see $Element#prev
 * @see $Element#next
 * @see $Element#first
 * @see $Element#last
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
	welSample.indexOf($Element("sample_div1"));	// 결과 : -1
	welSample.indexOf($Element("sample_div2"));	// 결과 : 0
	welSample.indexOf($Element("sample_div3"));	// 결과 : 1
	welSample.indexOf($Element("sample_div4"));	// 결과 : -1
	welSample.indexOf($Element("sample_div5"));	// 결과 : 2
	welSample.indexOf($Element("sample_div6"));	// 결과 : -1
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
 
 * @description queryAll() 메서드는 HTML 요소에서 특정 CSS 선택자(CSS Selector)를 만족하는 하위 요소를 찾는다.
 * @param {String} sSelector CSS 선택자. CSS 선택자로 사용할 수 있는 패턴은 표준 패턴과 비표준 패턴이 있다. 표준 패턴은 CSS Level3 명세서에 있는 패턴을 지원한다.
 * @return {Array} CSS 셀렉터 조건을 만족하는 HTML 요소의 배열을 반환한다.<br>만족하는 HTML 요소가 존재하지 않으면 빈 배열을 반환한다.
 * @see $Element#query
 * @see $Element#queryAll
 * @see <a href="http://www.w3.org/TR/css3-selectors/">CSS Level3 명세서</a> - W3C
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
	// <div class="pink"></div>와 <div class="pink"></div>를 원소로 하는 배열을 반환

	$Element("sample").queryAll(".green");
	// [] 빈 배열을 반환
</script>
  
 */
jindo.$Element.prototype.queryAll = function(sSelector) { 
	return jindo.$$(sSelector, this._element); 
};

/**
 
 * @description query() 메서드는 HTML 요소에서 특정 CSS 선택자(CSS Selector)를 만족하는 첫 번째 하위 요소를 반환한다.
 * @param {String} sSelector CSS 선택자. CSS 선택자로 사용할 수 있는 패턴은 표준 패턴과 비표준 패턴이 있다. 표준 패턴은 CSS Level3 명세서에 있는 패턴을 지원한다.
 * @return {$Element} CSS 선택자의 조건을 만족하는 첫 번째 HTML 요소.<br>만족하는 HTML 요소가 존재하지 않으면 null을 반환한다.
 * @see $Element#test
 * @see $Element#queryAll
 * @see <a href="http://www.w3.org/TR/css3-selectors/">CSS Level3 명세서</a> - W3C
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
	// 첫 번째 <div class="pink"></div> DIV 요소를 반환

	$Element("sample").query(".green");
	// null 을 반환
</script>
  
 */
jindo.$Element.prototype.query = function(sSelector) { 
	return jindo.$$.getSingle(sSelector, this._element); 
};

/**
 
 * @description test() 메서드는 HTML 요소에서 특정 CSS 선택자(CSS Selector)를 만족하는지 확인한다.
 *
 * @param {String} sSelector CSS 선택자. CSS 선택자로 사용할 수 있는 패턴은 표준 패턴과 비표준 패턴이 있다. 표준 패턴은 CSS Level3 명세서에 있는 패턴을 지원한다.
 * @return {Boolean} CSS 선택자의 조건을 만족하면 true, 그렇지 않으면 false를 반환한다.
 * @see $Element#query
 * @see $Element#queryAll
 * @see <a href="http://www.w3.org/TR/css3-selectors/">CSS Level3 명세서</a> - W3C
 * @example
<div id="sample" class="blue"></div>

<script type="text/javascript">
	$Element("sample").test(".blue");	// 결과 : true
	$Element("sample").test(".red");	// 결과 : false
</script>
  
 */
jindo.$Element.prototype.test = function(sSelector) { 
	return jindo.$$.test(this._element, sSelector); 
};

/**
 
 * @description xpathAll() 메서드는 HTML 요소를 기준으로 XPath 문법을 만족하는 요소를 가져온다. 지원하는 문법이 제한적이므로 특수한 경우에만 사용할 것을 권장한다.
 * @param {String} sXPath XPath 값.
 * @return {Array} XPath 문법을 만족하는 요소를 원소로 하는 배열.
 * @see <a href="_global_.html#$$">$$()</a>
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
	// <div>5</div> 요소를 원소로 하는 배열이 반환 됨
</script>
  
 */
jindo.$Element.prototype.xpathAll = function(sXPath) { 
	return jindo.$$.xpath(sXPath, this._element); 
};

/**
 
 * insertAdjacentHTML 함수. 직접사용하지 못함.
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
 
 * @description appendHTML() 메서드는 내부 HTML 코드(innerHTML)의 뒤에 파라미터로 지정한 HTML 코드를 덧붙인다.
 * @param {String} sHTML 덧붙일 HTML 문자열.
 * @return {$Element} 내부 HTML 코드를 변경한 $Element() 객체.
 * @since 1.4.6 부터 사용 가능.
 * @since 1.4.8 부터 $Element 객체를 반환한다.
 * @see $Element#prependHTML
 * @see $Element#beforeHTML
 * @see $Element#afterHTML
 * @example
// 내부 HTML 가장 뒤에 덧붙이기
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
 
 * @description prependHTML() 메서드는 내부 HTML 코드(innerHTML)의 앞에 파라미터로 지정한 HTML 코드를 삽입한다.
 * @param {String} sHTML 삽입할 HTML 문자열.
 * @return {$Element} 내부 HTML 코드를 변경한 $Element() 객체.
 * @since 1.4.6 부터 사용 가능.
 * @since 1.4.8 부터 $Element 객체를 반환한다.
 * @see $Element#appendHTML
 * @see $Element#beforeHTML
 * @see $Element#afterHTML
 * @example
// 내부 HTML 가장 앞에 삽입
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
 
 * @description beforeHTML() 메서드는 HTML 코드(outerHTML)의 앞에 파라미터로 지정한 HTML 코드를 삽입한다.
 * @param {String} sHTML 삽입할 HTML 문자열.
 * @return {$Element} HTML 코드를 변경한 $Element() 객체.
 * @since 1.4.6 부터 사용 가능.
 * @since 1.4.8 부터 $Element 객체를 반환한다.
 * @see $Element#appendHTML
 * @see $Element#prependHTML
 * @see $Element#afterHTML
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
	<li>5</li>
	<li>6</li>
</ul>
<ul>
	<li>3</li>
	<li>4</li>
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
 
 * @description afterHTML() 메서드는 HTML 코드(outerHTML)의 뒤에 파라미터로 지정한 HTML 코드를 삽입한다.
 * @param {String} sHTML 삽입할 HTML 문자열.
 * @return {$Element} HTML 코드를 변경한 $Element() 객체.
 * @since 1.4.6 부터 사용 가능.
 * @since 1.4.8 부터 $Element 객체를 반환한다.
 * @see $Element#appendHTML
 * @see $Element#prependHTML
 * @see $Element#beforeHTML
 * @example
var welSample = $Element("sample_ul");

welSample.afterHTML("<ul><li>3</li><li>4</li></ul>");
welSample.afterHTML("<ul><li>5</li><li>6</li></ul>");

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
	<li>3</li>
	<li>4</li>
</ul>
<ul>
	<li>5</li>
	<li>6</li>
</ul>
  
 */
jindo.$Element.prototype.afterHTML = function(sHTML) {
	return jindo.$Element.insertAdjacentHTML(this,sHTML,"afterEnd","lastChild",jindo.$Fn(function(oEle){
		this._element.parentNode.insertBefore( oEle, this._element.nextSibling );
	},this).bind());
};

/**
 
 * @description delegate() 메서드는 이벤트 위임(Event Deligation) 방식으로 이벤트를 처리한다. 이벤트 위임이란 이벤트 버블링을 이용하여 이벤트를 관리하는 상위 요소를 따로 두어 효율적으로 이벤트를 관리하는 방법이다.
 * @param {String} sEvent 이벤트 이름.<br>on 접두어는 생략한다. domready, mousewheel, mouseenter, mouseleave 이벤트 지원하지 않는다.
 * @param {Variant} vFilter 특정 HTML 요소에 대해서만 이벤트 핸들러를 실행하도록 하기 위한 필터.<br>
 * 필터는 CSS 선택자(String)와 함수(Function)으로 지정할 수 있다.
<ul>
	<li>문자열을 입력하면 CSS 선택자로 이벤트 핸들러를 실행시킬 요소를 지정할 수 있다.</li>
	<li>Boolean 값을 반환하는 함수를 파라미터 입력할 수 있다. 이 함수를 사용할 경우 함수가 true를 반환할 때 실행할 콜백 함수(fCallback)를 파라미터로 추가 지정해야 한다.
 * @param {Function} [fCallback] vFilter에 지정된 함수가 true를 반환하는 경우 실행할 콜백 함수.<br>콜백 함수의 첫 번째 파라미터는 HTML 요소 자신이고, 두 번째 파라미터는 이벤트가 발생한 HTML 요소가 입력된다.
 * @return {$Element} $Element() 객체.
 * @since 1.4.6부터 사용 가능.
 * @see $Element#undelegate
 * @example
	<ul id="parent">
		<li class="odd">1</li>
		<li>2</li>
		<li class="odd">3</li>
		<li>4</li>
	</ul>

	// CSS 셀렉터를 필터로 사용하는 경우
	$Element("parent").delegate("click",
		".odd", 			// 필터
		function(eEvent){	// 콜백 함수
			alert("odd 클래스를 가진 li가 클릭 될 때 실행");
		});
 * @example
	<ul id="parent">
		<li class="odd">1</li>
		<li>2</li>
		<li class="odd">3</li>
		<li>4</li>
	</ul>

	// 함수를 필터로 사용하는 경우
	$Element("parent").delegate("click",
		function(oEle,oClickEle){	// 필터
			return oClickEle.innerHTML == "2"
		},
		function(eEvent){			// 콜백 함수
			alert("클릭한 요소의 innerHTML이 2인 경우에 실행");
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
 
 * 이벤트를 바인딩 하는 함수.
 * @param {Element} oEle 엘리먼트
 * @param {Boolean} sEvent 이벤트 타입.
 * @param {Function} fAroundFunc 바인딩할 함수
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
 
 * @description undelegate() 메서드는 delegate() 메서드로 등록한 이벤트 위임을 해제한다.
 * @param {String} sEvent 이벤트 위임을 등록할 때 사용한 이벤트 이름.<br>on 접두어는 생략한다.
 * @param {Variant} vFilter 이벤트 위임을 등록할 때 지정한 필터.
 * @param {Function} [fCallback] 이벤트 위임을 등록할 때 지정한 콜백 함수.
 * @return {$Element} $Element() 객체.
 * @since 1.4.6부터 사용 가능.
 * @see $Element#delegate
 * @example
<ul id="parent">
	<li class="odd">1</li>
	<li>2</li>
	<li class="odd">3</li>
	<li>4</li>
</ul>

// 콜백 함수
var fnOddClass = function(eEvent){
	alert("odd 클래스를 가진 li가 클릭 될 때 실행");
};

$Element("parent").delegate("click", ".odd", fnOddClass);	// 이벤트 델리게이션 사용
$Element("parent").undelegate("click", ".odd", fnOddClass);	// 이벤트 해제
  
 */
jindo.$Element.prototype.undelegate = function(sEvent, vFilter, fpCallback){
	this._unbind(sEvent,vFilter,fpCallback);
	return this;
}

/**
 
 * 딜리게이션으로 실행되어야 할 함수를 추가 하는 함수.
 * @param {String} sEvent 이벤트 타입.
 * @param {String|Function} vFilter cssquery,function 이렇게 2가지 타입이 들어옴.
 * @param {Function} fpCallback 해당 cChecker에 들어오는 함수가 맞을때 실행되는 함수.
 * @returns {$Element} $Element 객체.
 * @since 1.4.6부터 사용가능.
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
 
 * 파라메터로 들어오는 엘리먼트 부터 자신의 엘리먼트 까지의 엘리먼트를 구하는 함수.
 * @param {Element} 엘리먼트.
 * @returns {Array} 배열 객체.
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
 
 * 엘리먼트에 이벤트를 추가하는 함수.
 * @param {Object} aDataOfEvent 이벤트와 함수를 가지고 있는 오브젝트.
 * @param {String|Function} vFilter cssquery,check하는 함수.
 * @param {Function} fpCallback 실행될 함수.
 * @param {Function} fpCheck 체크하는 함수.
 * @retruns {Object} aDataOfEvent를 반환.
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
 
 * 딜리게이션에서 해제되어야 할 함수를 삭제하는 함수.
 * @param {String} sEvent 이벤트 타입.
 * @param {String|Function} vFilter cssquery,function 이렇게 2가지 타입이 들어옴.
 * @param {Function} fpCallback 해당 cChecker에 들어오는 함수가 맞을때 실행되는 함수.
 * @returns {$Element} $Element 객체.
 * @since 1.4.6부터 사용가능.
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
 
 * 오브젝트에 키값으로 정보삭제하는 함수
 * @param {Object} 삭제할 오브젝트.
 * @param {String|Function} sType 키값이 들어옴.
 * @returns {Object} 삭제된 오브젝트.
 * @since 1.4.6부터 사용가능.
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
 
 * 플터 기준으로 삭제하는 함수.
 * @param {Element} 삭제할 엘리먼트.
 * @param {String} 이벤트명.
 * @param {String|Function} cssquery, 필터하는 함수.
 * @since 1.4.6부터 사용가능.
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
 
 * event 기준으로 삭제하는 함수.
 * @param {Element} 삭제할 엘리먼트.
 * @param {String} 이벤트명.
 * @param {String|Function} cssquery, 필터하는 함수.
 * @since 1.4.6부터 사용가능.
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
 
 * 이벤트를 해제 하는 함수.
 * @param {Element} oEle 엘리먼트
 * @param {Boolean} sType 이벤트 타입.
 * @param {Function} fAroundFunc 바인딩을 해제할 함수.
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
