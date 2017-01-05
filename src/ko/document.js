/**
 
 * @fileOverview $Document 생성자 및 메서드를 정의한 파일
 * @name document.js
 * @author Hooriza 
  
 */

/**
 
 * @class $Document() 객체는 문서와 관련된 정보를 제공한다.
 * @constructor
 * @description $Document() 객체를 생성한다.
 * @param {Element} [elDocument] 정보를 확인할 document 요소. 파라미터를 생략하면 기본 값으로 현재 문서의 document 요소가 입력된다.
  
 */
jindo.$Document = function (el) {
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);
	
	this._doc = el || document;
	
	this._docKey = this.renderingMode() == 'Standards' ? 'documentElement' : 'body';	
};

/**
 
 * @description $value() 메서드는 원본 document 요소를 반환한다.
 * @return {Element} document 요소
  
 */
jindo.$Document.prototype.$value = function() {
	return this._doc;
};

/**
 
 * @description scrollSize() 메서드는 문서의 가로 크기와 세로 크기 정보를 담은 객체를 반환한다. 다음은 문서의 가로, 세로 크기 정보를 담고 있는 객체의 속성을 설명한 표이다.<br>
 <table>
	<caption>문서 크기 정보 객체</caption>
	<thead>
		<tr>
			<th scope="col">이름</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>width</td>
			<td>Number</td>
			<td>문서의 가로 크기 정보. 단위는 픽셀(px)이다.</td>
		</tr>
		<tr>
			<td>height</td>
			<td>Number</td>
			<td>문서의 세로 크기 정보. 단위는 픽셀(px)이다.</td>
		</tr>
	</tbody>
 </table>
 * @return {Object} 문서의 가로, 세로 크기 정보를 담고 있는 객체.
 * @see $Document#clientSize
 * @example
var size = $Document().scrollSize();
alert('가로 : ' + size.width + ' / 세로 : ' + size.height);
   
 */
jindo.$Document.prototype.scrollSize = function() {

	/*
	  
webkit 계열에서는 Standard 모드라도 body를 사용해야 정상적인 scroll Size를 얻어온다.
  
	 */
	var isWebkit = navigator.userAgent.indexOf("WebKit")>-1;
	var oDoc = this._doc[isWebkit?'body':this._docKey];
	
	return {
		width : Math.max(oDoc.scrollWidth, oDoc.clientWidth),
		height : Math.max(oDoc.scrollHeight, oDoc.clientHeight)
	};

};

/**
 
 * @description scrollPosition() 메서드는 현재 문서에서 스크롤바의 위치를 구한다. 다음은 스크롤바의 위치 정보를 담고 있는 객체의 속성을 설명한 표이다.<br>
 <table>
	<caption>스크롤바 위치 정보 객체의 속성</caption>
	<thead>
		<tr>
			<th scope="col">이름</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>left</td>
			<td>number</td>
			<td>수평 스크롤바의 가로 위치. 단위는 픽셀(px)이다.</td>
		</tr>
		<tr>
			<td>height</td>
			<td>number</td>
			<td>수직 스크롤바의 세로 위치. 단위는 픽셀(px)이다.</td>
		</tr>
	</tbody>
 </table>
 * @return {Object} 가로 위치는 left, 세로위치는 top 라는 키값으로 리턴된다.
 * @since 1.3.5버전부터 사용 가능
 * @example
var size = $Document().scrollPosition();
alert('가로 : ' + size.left + ' / 세로 : ' + size.top);
  
 */
jindo.$Document.prototype.scrollPosition = function() {

	/*
	 
webkit 계열에서는 Standard 모드라도 body를 사용해야 정상적인 scroll Size를 얻어온다.
  
	 */
	var isWebkit = navigator.userAgent.indexOf("WebKit")>-1;
	var oDoc = this._doc[isWebkit?'body':this._docKey];
	return {
		left : oDoc.scrollLeft||window.pageXOffset||window.scrollX||0,
		top : oDoc.scrollTop||window.pageYOffset||window.scrollY||0
	};

};

/**
 
 * @description clientSize() 메서드는 문서에서 스크롤바가 생겨 보이지 않는 부분을 제외한 영역(화면에 보이는 부분)의 가로 크기와 세로 크기 정보를 담은 객체를 반환한다. 다음은 화면에 보이는 영역의 가로, 세로 크기 정보를 담고 있는 객체의 속성을 설명한 표이다.<br>
 <table>
	<caption>화면 크기 정보 객체</caption>
	<thead>
		<tr>
			<th scope="col">이름</th>
			<th scope="col">속성</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>width</td>
			<td>number</td>
			<td>화면에 보이는 부분의 가로 크기. 단위는 픽셀(px)이다.</td>
		</tr>
		<tr>
			<td>height</td>
			<td>number</td>
			<td>화면에 보이는 부분의 세로 크기. 단위는 픽셀(px)이다.</td>
		</tr>
	</tbody>
 </table>
 * @return {Object} 화면에 보이는 부분의 크기를 저장하고 있는 객체.
 * @see $Document#scrollSize
 * @example
var size = $Document(document).clientSize();
alert('가로 : ' + size.width + ' / 세로 : ' + size.height);
   
 */
jindo.$Document.prototype.clientSize = function() {
	var agent = navigator.userAgent;
	var oDoc = this._doc[this._docKey];
	
	var isSafari = agent.indexOf("WebKit")>-1 && agent.indexOf("Chrome")==-1;

	/*
	 
사파리의 경우 윈도우 리사이즈시에 clientWidth,clientHeight값이 정상적으로 나오지 않아서 window.innerWidth,innerHeight로 대체
  
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
 
 * @description renderingMode() 메서드는 문서가 렌더링된 방식을 검사하여 반환한다. 이 메서드가 확인할 수 있는 렌더링 방식은 다음 표와 같다.<br>
  <table>
	<caption>렌더링 방식</caption>
	<thead>
		<tr>
			<th scope="col">렌더링 모드</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Standards</td>
			<td>표준 렌더링 모드.</td>
		</tr>
		<tr>
			<td>Almost</td>
			<td>유사 표준 렌더링 모드. 인터넷 익스플로러 외의 브라우저에서 DTD를 올바르게 지정하지 않았을 때 반환된다.</td>
		</tr>
		<tr>
			<td>Quirks</td>
			<td>비표준 렌더링 모드.</td>
		</tr>
	</tbody>
 </table>
 * @return {String} 렌더링 모드.
 * @see DTD와 브라우저에 따른 렌더링 차이 설명(<a href="http://hsivonen.iki.fi/doctype/">http://hsivonen.iki.fi/doctype/</a>)
 * @example
var mode = $Document().renderingMode();
alert('렌더링 방식 : ' + mode);
  
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
 
 * @description 문서를 대상으로 지정한 선택자를 만족시키는 요소의 배열을 반환한다. 만족하는 요소가 존재하지 않으면 빈 배열을 반환한다. $$() 함수에서 elBaseElement 파라미터에 문서를 지정한 것과 같은 의미이다.
 * @param {String} sSelector CSS 선택자(CSS Selector). CSS 선택자로 사용할 수 있는 패턴은 표준 패턴과 비표준 패턴이 있다. 표준 패턴은 CSS Level3 명세서에 있는 패턴을 지원한다. 선택자의 패턴에 대한 설명은 $$() 함수와 See Also 항목을 참고한다.
 * @return {Array} 조건을 만족하는 요소의 배열
 * @see <a href="_global_.html#$$">$$()</a>
 * @see <a href="http://www.w3.org/TR/css3-selectors/">CSS Level3 명세서</a> - W3C
 * @example
 $Document().queryAll("span");  // 문서 내에 모든 <span> 요소를 선택한다.
  
 */
jindo.$Document.prototype.queryAll = function(sSelector) { 
	return jindo.$$(sSelector, this._doc); 
};

/**
 
 * @description 문서를 대상으로 지정한 선택자를 만족시키는 첫 번째 요소를 반환한다. 만족하는 요소가 존재하지 않으면 null을 반환한다. $$.getSingle 함수에서 elBaseElement 파라미터에 문서를 지정한 것과 같은 의미이다.
 * @param {String} sSelector CSS 선택자(CSS Selector). CSS 선택자로 사용할 수 있는 패턴은 표준 패턴과 비표준 패턴이 있다. 표준 패턴은 CSS Level3 명세서에 있는 패턴을 지원한다. 선택자의 패턴에 대한 설명은 $$() 함수와 See Also 항목을 참고한다.
 * @return {Element} 선택자 조건을 만족하는 첫 번째 요소.
 * @see <a href="_global_.html#.$$.getSingle">$$.getSingle()</a>
 * @see <a href="_global_.html#$$">$$()</a>
 * @see <a href="http://www.w3.org/TR/css3-selectors/">CSS Level3 명세서</a> - W3C
 * @example
 $Document().query("body");  // <body> 요소를 선택한다.
  
 */
jindo.$Document.prototype.query = function(sSelector) { 
	return jindo.$$.getSingle(sSelector, this._doc); 
};

/**
 
 * @description 문서를 대상으로 XPath 문법을 만족하는 요소를 가져온다. 지원하는 문법이 제한 적이므로 특수한 경우에만 사용할 것을 권장한다. $$.xpath() 함수에서 elBaseElement 파라미터에 문서를 지정한 것과 같은 의미이다.
 * @param {String} sXPath XPath 값.
 * @return {Array} XPath 문법을 만족하는 요소를 원소로 하는 배열.
 * @see <a href="_global_.html#.$$.xpath">$$()</a>
 * @see <a href="http://www.w3.org/standards/techs/xpath#w3c_all">XPath 문서</a> - W3C
 * @example
var oDocument = $Document();
alert (oDocument.xpathAll("body/div/div").length);
  
 */
jindo.$Document.prototype.xpathAll = function(sXPath) { 
	return jindo.$$.xpath(sXPath, this._doc); 
};