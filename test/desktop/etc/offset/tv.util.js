/**
* @fileOverview	TV편성표에서 사용하는 유틸리티 객체
* @name			tv.util.js
*/

if(typeof tv == "undefined"){ tv = {};}
if(typeof tv.util == "undefined"){ 
	/**
	 * @namespace   TV편성표에서 사용하는 유틸리티 객체
	 * @description TV편성표에서 사용하는 유틸리티 객체
	 */
	tv.util = {};
}

(function(){
	var bIE6 = (function(){var oAgentInfo = jindo.$Agent().navigator(); return oAgentInfo.ie && oAgentInfo.version == 6; })();
	var bIE7 = (function(){var oAgentInfo = jindo.$Agent().navigator(); return oAgentInfo.ie && oAgentInfo.version == 7; })();
	tv.util.isIE6 = function(){ return bIE6; };	
	tv.util.isIE7 = function(){ return bIE7; };

	var bMobileSafari = (function(){ return !!navigator.userAgent.match(/Apple.*Mobile.*Safari/); })();
	tv.util.isMobileSafari = function(){ return bMobileSafari; };
	
	// prevent IE6 flickering
	if(tv.util.isIE6()){
		try {document.execCommand('BackgroundImageCache', false, true);} catch(e) {}
	}
})();

(function(){
/**
 * 문자열 앞 뒤의 공백을 제거해주는 함수
 * @param {String} str
 * @return {String} trim 처리된 문자열
 */
tv.util.trim = function(str) {
	//http://blog.stevenlevithan.com/archives/faster-trim-javascript
	return str.replace(/^\s+/, '').replace(/\s+$/, '');
};

/**
 * 엘리먼트의 클래스명에 해당하는 정보를 얻기 위한 정규식 생성 메소드
 * @param {String} sClassName className
 * @return {Object} className과 조합된 정규식
 * @see tv.util.Bubbler
 */
tv.util._rxClassName = function(sClassName) {
	return new RegExp('(^|\\s+)' + sClassName + '(\\(([^\)]*)\\))?(\\s+|$)', 'i');
};

/**
 * 엘리먼트에 클래스명과 추가정보를 설정하는 메서드
 * 
 * - tv.util.setClass(elDiv, 'hello', [ 1, 2, 3 ]) 이라고 사용하면
 *   elDiv 의 클래스명은 'hello(1,2,3)' 가 된다.
 * @param {HTMLElement} elEl : 클래스명을 변경할 엘리먼트
 * @param {String} sClassName : 클래스명
 * @param {Array} aVars : 클래스명에 추가적으로 넣을 값
 * @return {HTMLElement} 클래스명이 변경된 엘리먼트
 * @see tv.util.Bubbler   
 */
tv.util.setClass = function(elEl, sClassName, aVars) {
	if (this.getClass(elEl, sClassName)){ 
		this.removeClass(elEl, sClassName);
	}

	elEl.className += [(elEl.className ? ' ' : ''), sClassName, (aVars instanceof Array ? '(' + aVars.join(',') + ')' : '')].join('');
	return elEl;
};

/**
 * 엘리먼트에 지정된 클래스명의 추가정보를 얻어오는 메서드
 * 
 * - elDiv 의 클래스명이 'hello(1,2,3)' 인 상태에서
 *   tv.util.getClass(elDiv, 'hello') 이라고 사용하면
 *   반환되는 값은 [ '1', '2', '3' ] 이다.
 * @param {HTMLElement} elEl : 클래스명 정보를 얻어올 엘리먼트
 * @param {String} sClassName : 클래스명
 * @return {Array} 해당 클래스명이 존재하지 않으면 null 이 리턴된다
 * @see tv.util.Bubbler
 */
tv.util.getClass = function(elEl, sClassName) {
	var regExp = this._rxClassName(sClassName);
	if(!regExp.test(elEl.className)){
		return null;
	}
	
	//FIX - 나온 결과값을 ,로 나누었을때는 {},[]가 제대로 파싱되지 않으므로 결과가 있을때 별도의 정규식을 통해 정확히 분리되도록 수정 
	var result = [];
	if(RegExp.$3){
		//"({a:1,b:10},[2,3],a.bcd,,,1,,2)" ==    ['{a:1,b:10}' '[2,3]' 'a.bcd' '' '' '1' '' '2']
		RegExp.$3.replace(/(\{[^\}]+\}|\[[^\]]+\]|[\w\.]+)|,(,+)/g, function($1, $2, $3){
			if($2){ result.push($2); }
		    if($3){ for(var i = 0, len = $3.length; i < len ; i++){ result.push(''); } }
		});
	}
	return result;
};

/**
 * 엘리먼트에 지정된 클래스명을 삭제하는 메서드
 * 
 * - elDiv 의 클래스명이 'hello(1,2,3) world' 인 상태에서
 *   tv.util.removeClass(elDiv, 'hello') 이라고 사용하면
 *   elDiv 의 클래스명은 'world' 가 된다.
 * @param {HTMLElement} elEl : 클래스명을 삭제할 엘리먼트
 * @param {String} sClassName : 클래스명
 * @return {HTMLElement} 클래스명이 삭제된 엘리먼트
 * @see tv.util.Bubbler 
 */
tv.util.removeClass = function(elEl, sClassName) {
	var regExp = this._rxClassName(sClassName);
	elEl.className = this.trim(elEl.className.replace(regExp, '$4'));
	return elEl;
};

/**
 * 자신을 포함하여 부모 엘리먼트로부터 특정한 클래스명이 존재하는지 탐색하여 그 엘리먼트를 반환한다
 * @param {HTMLElement} elEl : 탐색을 시작할 엘리먼트
 * @param {String} sClassName : 클래스명
 * @return {HTMLElement} 찾아낸 엘리먼트 (찾지 못했으면 null 반환)
 * @see tv.util.Bubbler
 */
tv.util.getParentByClass = function(elEl, sClassName) {
	var regExp = this._rxClassName(sClassName);
	var bHasClass = false;
	try { 
		bHasClass = 'className' in elEl;
	} catch(e){}
	for (; elEl && bHasClass; elEl = elEl.parentNode) {
		if (regExp.test(elEl.className)) {
			RegExp.$0 = RegExp.$3;
			return elEl;
		}
	}
	return null;
};


tv.util.Bubbler = jindo.$Class({
	/** @lends tv.util.Bubbler.prototype */
	/**
	 * tv.util.Bubbler 클래스의 인스턴스를 생성한다.
	 * @constructs  
	 * @class 버블링을 사용한 이벤트 바인딩을 구현하는 클래스
	 * @param {HTMLElement} elEl 버블링을 이벤트를 바인딩할 상위 엘리먼트  
	 * @example
<xmp>
<ul>
	<li class="list" id="one">one</li>
	<li class="list item" id="two">two</li>
	<li class="list" id="three">three</li>
</ul>
<script>
 	var oBubbler = new tv.util.Bubbler(document.body);
 	oBubbler.attach({
		'list:click' : listHandler,
		'item:click' : itemHandler
	});
	oBubbler.attach('item:click', itemHandler2);
</script>
</xmp>
*/
	$init : function(elEl) {
		this._el = elEl;
		this._eventTypes = {};
		this._fpEventHandler = jindo.$Fn(this._eventHandler, this);
	},
	
	/**
	 * 엘리먼트에 바인딩할 className:EventType 형식과 이를 수행한 이벤트 핸들러를 Attach한다.
	 * @param {String|Object} sEvent String이면 className과 EventType이 ':' 구분자로 이루어진 문자열, Object이면 여러개의 이벤트 핸들러가 포함된 리터럴 객체
	 * @param {Function} [fpHandler] 이벤트 핸들러 
	 * @return {tv.util.Bubbler} tv.util.Bubbler의 객체 자신
	 */
	attach : function(sEvent, fpHandler) {
		if (typeof sEvent == 'object') {
			var fp = arguments.callee;
			jindo.$H(sEvent).forEach(function(f, k) {
				fp.call(this, k, f);
			}, this);
			return this;
		}

		var aParsed = sEvent.split(':');
		var sClassName = aParsed[0];
		var sType = aParsed[1].toLowerCase();
		var sRealType = sType;

		if (sRealType == 'mouseenter'){ sRealType = 'mouseover'; }
		else if (sRealType == 'mouseleave'){ sRealType = 'mouseout'; }

		// 이벤트 바인딩이 안되어 있으면
		if (!(sType in this._eventTypes)) {
			this._eventTypes[sType] = jindo.$H();
			this._fpEventHandler.attach(this._el, sRealType);
		}

		var whClassNames = this._eventTypes[sType];

		// 해당 클래스가 등록되어 있지 않으면
		if (!whClassNames.hasKey(sClassName)) {
			whClassNames.$(sClassName, jindo.$A());
		}

		// 핸들러 추가
		whClassNames.$(sClassName).push(fpHandler);
		return this;
	},
	/**
	 * 엘리먼트에 바인딩할 className:EventType 형식과 이를 수행한 이벤트 핸들러를 detach한다.
	 * @param {String|Object} sEvent String이면 className과 EventType이 ':' 구분자로 이루어진 문자열, Object이면 여러개의 이벤트 핸들러가 포함된 리터럴 객체
	 * @param {Function} [fpHandler] 이벤트 핸들러 
	 * @return {tv.util.Bubbler} tv.util.Bubbler의 객체 자신
	 */
	detach : function(sEvent, fpHandler) {
		if (typeof sEvent == 'object') {
			var fp = arguments.callee;
			jindo.$H(sEvent).forEach(function(f, k) {
				fp.call(this, k, f);
			}, this);
			return this;
		}

		var aParsed = sEvent.split(':');
		var sClassName = aParsed[0];
		var sType = aParsed[1].toLowerCase();

		var whClassNames = this._eventTypes[sType];
		var waHandlers = whClassNames.$(sClassName);

		if (waHandlers) {
			var nIndexOf = waHandlers.indexOf(fpHandler);
			if (nIndexOf != -1){ 
				waHandlers.splice(nIndexOf, 1); 
			}
		}
	},

	_eventHandler : function(oEvent) {
		var sType = oEvent.type.toLowerCase();
		var sAltType = null;

		if (sType == 'mouseover') { sAltType = 'mouseenter'; }
		else if (sType == 'mouseout'){ sAltType = 'mouseleave'; }

		var whClassNames = this._eventTypes[sAltType || sType];

		if (whClassNames) {
			var elSrc = oEvent.element;
			var elRelSrc = oEvent.relatedElement;
			whClassNames.forEach(function(waHandlers, sClassName) {
				var elTar = tv.util.getParentByClass(elSrc, sClassName);
				if (!elTar){ 
					jindo.$H.Continue();
				}

				if (sAltType) {
					var elRelTar = tv.util.getParentByClass(elRelSrc, sClassName);
					if (elTar === elRelTar){
						jindo.$H.Continue();
					}
				}

				var aArgs = tv.util.getClass(elTar, sClassName);
				waHandlers.forEach(function(fpHandler) {
					fpHandler(oEvent, elTar, aArgs);
				});
				elTar = null;
			}, this);
		}
		oEvent = null;
	}
});

/**
* oObject의 생성자 이름을 반환
* @function
* @param 	{Object} 	oObject 생성자 명을 추출할 객체
* @returns 	{String} 	생성자 이름 (없을 경우: null )
*/
tv.util.getConstructorName = function(oObject){
 	if(oObject && oObject.constructor){
 		var sCode = oObject.constructor.toString();
 		var aMatch = sCode.match(/function ([^\(]*)/);
 		return (aMatch && aMatch[1]) || null;
 	}
 	return null;
};

/**
* oObject 객체를 복제한 새로운 객체를 반환
* @param 	{Object} oObject 복제할 대상 객체
* @returns 	{Object} 복제된 새로운 객체
* @requires 	tv.util.getConstructorName
*/
tv.util.cloneObject = function(oObject){
	var sConstructor;
    var oDestinationTarget;
			
    if(oObject && typeof oObject == "object" && (sConstructor = tv.util.getConstructorName(oObject))){
		oDestinationTarget = eval("new " + sConstructor + "()");
		for(var key in oObject){
			oDestinationTarget[key] = arguments.callee(oObject[key]);
		}
    }else{
		oDestinationTarget = oObject;
	}
    return oDestinationTarget;
};

/**
* 전달인자로 받은 QueryString 형태의 문자열을 Hash Table형태의 오브젝트로 변환하여 반환
* @function
* @param 	{String} 		sQueryString 	QueryString 형태의 문자열
* @returns 	{Hash Table} 	Hash Table( 키 : 값 ) 형태로 변환된 오브젝트
* @see		tv.util.changeObjectToQueryString
* @example
* tv.util.changeQueryStringToObject();
* tv.util.changeQueryStringToObject("");
* // 결과: {}
*
* tv.util.changeQueryStringToObject("query=nhn&cate=1&page=1");
* // 결과: {query : "nhn", cate : "1", page : "1"}
*/

tv.util.changeQueryStringToObject = function(sQueryString) {
    var htObject = {};
    var aParams = [];
	var sQuery = sQueryString || "";
	
    if(sQuery.indexOf("&") > -1){
		aParams = sQuery.split("&");
	}else{
		aParams[0] = sQuery;
	}
    
    for(var i = 0, nLength = aParams.length; i < nLength; i++){
        if(aParams[i].indexOf("=") > -1){
            var aParam = aParams[i].split("=");
            htObject[aParam[0]] = aParam[1];
        }
    }
    
    return htObject;
};

/**
* 전달인자로 받은 Hash Table 형태의 오브젝트(htObject)를 QueryString 형태의 문자열로 변환하여 반환
* @param 	{Hash Table} 	htObject 	Hash Table( 키 : 값 ) 형태의 오브젝트
* @returns 	{String} 		QueryString 형태로 변환된 문자열 
* @see		tv.util.changeQueryStringToObject
* @example
* tv.util.changeObjectToQueryString();
* tv.util.changeObjectToQueryString({});
* // 결과: ""
*
* tv.util.changeObjectToQueryString({query : "nhn", cate : "1", page : "1"});
* // 결과: "query=nhn&cate=1&page=1"
*/
tv.util.changeObjectToQueryString = function(htObject) {
	var aParam = [];

	for(var key in htObject){
		aParam.push(key + "=" + htObject[key]);
	}

	return aParam.join("&");
};


/**
* Layer의 최대 지정된 크기가 넘을 경우 Ellipsis 적용하여 TextLayer에 설정함
* @function
* @param 	{Element} 		elLayer 	크기를 측정 및 제한할 레이어 엘리먼트
* @param 	{Element} 		elTextLayer 텍스트를 설정할 엘리먼트
* @param 	{String} 		sText 		원본 문자열
* @param 	{Object} 		oSize 		수정할 최대 넓이/높이 옵션
* @param 	{String} 		sTail 		수정 후 끝에 붙일 문자열 (default : "")
* @return	{Boolean}		Ellipsis가 적용되었는지 여부를 리턴함
* @requires Jindo.$Element
* @example
* tv.util.ellisisTextByLayerSize(elLayer, elText, elText.innerHTML, { height : 60}, "...");
*/
tv.util.ellisisTextByLayerSize = function(elLayer, elTextLayer, sText, oSize, sTail){
	sTail = sTail || "";
	var aResultString = [];
	var sSource = sText.replace(/\r?\n/gim, " ");
	var nWidthLimit = (oSize && oSize.width) ? parseInt(oSize.width, 10) : null;
	var nHeightLimit = (oSize && oSize.height) ? parseInt(oSize.height, 10) : null;
	if (nWidthLimit === null && nHeightLimit === null) {
		return false;
	}
	elTextLayer.innerHTML = "";
	var sPrevText, sNextText, sEntityCache, regEntity = /^(&[a-z]+;|#[0-9]+;)/g;
	for (var i = 0, sTmpChar = "", bEntity = false, nLen = sSource.length; i < nLen; bEntity = false) {
		sTmpChar = sSource.charAt(i);
		if(sTmpChar === "&" || sTmpChar === "#" ){
			//첫번째 시작 문자열이 &나 #인 시작된다면 entity여부를 체크하고 맞다면 &\w+; 형태의 문자열을 포함하여 하나로 취급하여 건너띈다.
			if(!sEntityCache || sSource.indexOf(sEntityCache) !== 0){
				sSource.substring(i).replace(regEntity, function(m0, m1){
					sEntityCache = m1;
					bEntity = true;
					i+= m1.length - 1;
					sTmpChar = m1;
					return m1;
				});
			}else{
				bEntity = true;
				i += sEntityCache.length;
				sTmpChar = sEntityCache;
			}
			
		}
		sPrevText = [aResultString.join(""), " ", sTail].join("");
		sNextText = [aResultString.join(""), sTmpChar, " ", sTail].join("");
		elTextLayer.innerHTML = sNextText;
		
		if(nWidthLimit !== null && nHeightLimit !== null){
			if(elLayer.offsetWidth > nWidthLimit && elLayer.offsetHeight > nHeightLimit){
				elTextLayer.innerHTML = sPrevText;
				return true; 
			}
		}else{
			if(nWidthLimit !== null && elLayer.offsetWidth > nWidthLimit){ 
				elTextLayer.innerHTML = sPrevText;
				return true;
			}
			if(nHeightLimit !== null && elLayer.offsetHeight > nHeightLimit){ 
				elTextLayer.innerHTML = sPrevText;
				return true;
			}
		}
		aResultString.push(sTmpChar);
		i++;
	}
	
	elTextLayer.innerHTML = sSource;
	return false;
};

/**
 * 인자로 받은 element를 선택이 되지 않도록 설정해 줍니다. 
 * @param {HTMLElement} element 
 */
tv.util.disableSelection = function(element) {
	if (jindo.$Agent().navigator().ie || jindo.$Agent().navigator().opera) {
		element.unselectable = 'on';
	} else if (jindo.$Agent().navigator().safari || jindo.$Agent().navigator().chrome) {
		element.style.KhtmlUserSelect = 'none';
	} else {
		element.style.MozUserSelect = '-moz-none';
	}
};

/**
 * 인자로 받은 날짜 문자열을 글자수를 기준으로 년도, 달, 날짜 프로퍼티를 가진 객체를 리턴합니다. 
 * @param 	{String} sDate 날짜문자열
 * @param 	{String} [sDelimiter] 구분자 생략 가능  
 * @returns {Object} 년도, 달, 날짜 프로퍼티를 가진 객체
 */
tv.util.convertDateTokenObject = function(sDate, sDelimiter){
	var aTokens = null;
	if(sDelimiter){
		aTokens = sDate.split(sDelimiter);
	}else{
		aTokens = [sDate.substr(0,4),sDate.substr(4,2),sDate.substr(6,2)];
	}
	
	return {
		year  : parseInt(aTokens[0], 10),
		month : parseInt(aTokens[1], 10),
		date  : parseInt(aTokens[2], 10)
	};
};

/**
 * 인자로 받은 시간 문자열을 ":" 구분자를 기준으로 시각, 분 프로퍼티를 가진 객체를 리턴합니다. 
 * @param 	{String} sTime 시간 문자열
 * @returns {Object} 시각, 분 프로퍼티를 가진 객체
 */
tv.util.convertTimeTokenObject = function(sTime) {
	var aTimeSplit = sTime.split(":");
	return {
		hour : parseInt(aTimeSplit[0], 10),
		minute : parseInt(aTimeSplit[1], 10)
	};
};


/**
 * 엘리먼트인 elLayer를 위치시키기 위한 top, left값의 validation 처리 및 위치와 오프셋에 대한 고려를 하여 위치를 이동합니다. 
 * @param 	{HTMLElement} elLayer 		레이어 엘리먼트
 * @param 	{Object} oPosition 위치 지정 시 참고할 기본 위치 값
 * @param 	{Object} oOffset 위치 지정 시 참고할 offset 값
 */
tv.util.changeLayerPosition = function(elLayer, oPosition, oOffset){
	oPosition = oPosition || { top : 0, left : 0 };
	oPosition.top = "top" in oPosition ? oPosition.top : 0;
	oPosition.left = "left" in oPosition ? oPosition.left : 0;
	
	oOffset = oOffset || { top : 0, left : 0 };
	oOffset.top = "top" in oOffset ? oOffset.top : 0;
	oOffset.left = "left" in oOffset ? oOffset.left : 0;
	
	jindo.$Element(elLayer).css({"top": oPosition.top + oOffset.top + "px", 
								"left": oPosition.left + oOffset.left + "px"});
};

/**
 * 엘리먼트인 elTarget의 위치를 기준으로 elContainer 영역 내부에 elLayer를 위치시키기 위한 top, left 및 배치된 방식을 리턴합니다.
 * @param 	{HTMLElement} elContainer  	레이어가 위치할 컨테이어 엘리먼트
 * @param 	{HTMLElement} elLayer 		레이어 엘리먼트
 * @param 	{HTMLElement} elTarget 		레이어가 위치할 기준 엘리먼트
 * @param 	{Object} 	oOffsetForPos 	레이어의 위치 지정 시 실제 위치값에 가상의 oOffset을 추가하여 실제 리턴될 Position의 값을 알아오도록 한다.   
 * @returns {Object} top, left 좌표 및 컨테이너내에 위치한 방식 position=["inside-top-left"|"inside-top-right"|"inside-bottom-left"|"inside-bottom-right"]
 */
tv.util.getPositionInContainerInside = function(elContainer, elLayer, elTarget, oOffsetForPos ){
	oOffsetForPos = oOffsetForPos || { top : 0, left : 0 };
	oOffsetForPos.top = "top" in oOffsetForPos ? oOffsetForPos.top : 0;
	oOffsetForPos.left = "left" in oOffsetForPos ? oOffsetForPos.left : 0;
	
	var sYPositionDesc = "top", sXPositionDesc = "left";
	var welDocument  = jindo.$Document(document);
	var welContainer = jindo.$Element(elContainer);
	var welLayer  = jindo.$Element(elLayer);
	var welTarget = jindo.$Element(elTarget);
	
	var oClientSize = welDocument.clientSize();
	var oContainerOffset = welContainer.offset();
	var oTargetOffset = welTarget.offset();
	var nLeft = oTargetOffset.left - oContainerOffset.left + oOffsetForPos.left;
	var nTop = oTargetOffset.top - oContainerOffset.top + oOffsetForPos.top;
	
	//브라우저의 (가로 뷰 영역+현재 스크롤 위치)을 넘어가거나 편성표 리스트의 넓이를 정보 레이어가 넘어가면  Target의 top,right 바운드리 영역에  상세정보의 top,right 바운드리 영역을 위치하도록 한다. 
	if( (oTargetOffset.left + welLayer.width()) > (oContainerOffset.left + welContainer.width()) ||
		(oTargetOffset.left + welLayer.width()) > (oClientSize.width + welDocument.scrollPosition().left) ){
		//nLeft값이 마이너스가 되면 컨테이너 우측 영역을 넘어가 버리므로 무조건 좌측으로 표시하도록 한다. (해상도가 낮아서 브라우저 스크롤로 기능 사용 가능 목적)
		if(nLeft  >  welLayer.width() - welTarget.width() ){
			nLeft -= welLayer.width() - welTarget.width();
			sXPositionDesc = "right";
		}
	}
	
	//브라우저의 (세로 뷰 영역+현재 스크롤 위치)을 넘어가거나  편성표 리스트의 높이를 정보 레이어가 넘어가면   Target의 bottom,right 바운드리 영역에  상세정보의 bottom,right 바운드리 영역을 위치하도록 한다. 
	if(	(oTargetOffset.top + welLayer.height()) > (oContainerOffset.top + welContainer.height()) ||
		(oTargetOffset.top + welLayer.height()) > (oClientSize.height + welDocument.scrollPosition().top)){
		//nTop값이 마이너스가 되면 컨테이너 상단 영역을 넘어가 버리므로 무조건 아래로 표시하도록 한다. (해상도가 낮아서 브라우저 스크롤로 기능 사용 가능 목적)
		if(nTop  >  welLayer.height() - welTarget.height()){
			nTop -= welLayer.height() - welTarget.height();
			sYPositionDesc = "bottom";
		}
	}
	return { position : "inside-" + sYPositionDesc + "-" + sXPositionDesc, top : nTop - oOffsetForPos.top, left : nLeft - oOffsetForPos.left };
};

//참고 : http://www.w3schools.com/jsref/event_img_onerror.asp - onerror support browser reference
var _attachImageLoadEvent = (function(){ 
	var hasImgLoadErrorHandler = (IS_IE || IS_FF || IS_OP || IS_SF || IS_CH);
	
	return hasImgLoadErrorHandler ? function(orginalImg, fpImgErrorCallback){	//for detect img onload || onerror || onabout event browser
		var preloadImg = new Image(); 	//for detect image load event
		
		preloadImg.onload = function() {
			preloadImg.onload = preloadImg.onerror = preloadImg.onabort = null;
		};
		preloadImg.onerror = preloadImg.onabort = function(){
			fpImgErrorCallback(orginalImg);
			preloadImg.onload = preloadImg.onerror = preloadImg.onabort = null;
		};
		preloadImg.src = orginalImg.src; 
	} : function(orginalImg, fpImgErrorCallback){	//for not detect img onload || onerror || onabout event browser
		var isLoaded = false;
		var preloadImg = new Image(); 	//for detect image load event
		
		preloadImg.onload = function() { 
			isLoaded = true;
			preloadImg.onload = null;
		};
		setTimeout(function(){
			if( !isLoaded ){
				fpImgErrorCallback(orginalImg);
			}
		}, 300);
		preloadImg.src = orginalImg.src;
	};
})();


/**
 * 이미지 로드 오류 발생 시 대체할 이미지로 처리할 수 있도록 함
 * @param 	{Array}  aImgList			이미지 리스트 
 * @param 	{String} fpImgErrorCallback	이미지 로드 오류 발생 시 호출될 Callback Function 
 * tv.util.attachImageLoadError(jindo.$$("img._imgerror"), function(elImg){ elImg.src = "/img_default_profile.gif"; });
 * tv.util.attachImageLoadError(jindo.$$("img._imgerror_19x19"), function(elImg){ elImg.src = /ico_blank_19x19.gif"; });
 * tv.util.attachImageLoadError(jindo.$$("img._imgerror_33x33"), function(elImg){ elImg.src = /ico_blank_33x33.gif"; });
 * tv.util.attachImageLoadError(jindo.$$("img._imgerror_44x44"), function(elImg){ elImg.src = /ico_blank_44x44.gif"; });
 * tv.util.attachImageLoadError(jindo.$$("img._imgerror_70x70"), function(elImg){ elImg.src = /ico_blank_70x70.gif"; });
 * tv.util.attachImageLoadError(jindo.$$("img._imgerror_220x220"), function(elImg){ elImg.src = /ico_blank_220x220.gif"; });
 * tv.util.attachImageLoadError(jindo.$$("img._imgerror_336x252"), function(elImg){ elImg.src = /ico_blank_336x252.gif"; });
*/
tv.util.attachImageLoadError = function(aImgList, fpImgErrorCallback){
	if(!aImgList || aImgList.length === 0){ return; }
	
	jindo.$A(aImgList).forEach(function(v,i,o){
		_attachImageLoadEvent(v, fpImgErrorCallback);
	});
};


/**
 * tv.util에서 사용하는 Window 객체를 설정할 때 사용한다. ( 테스트의 용이성 확보 ) 
 * @param {[HTMLElements]} win window 객체
 */
tv.util.window = function(win){
	if(typeof win === "undefined"){ return this._window; }
	this._window = win || window;
};
tv.util.window(window);

/**
 * tv.util에서 사용하는 Document 객체를 설정할 때 사용한다. ( 테스트의 용이성 확보 ) 
 * @param {[HTMLElements]} doc document 객체
 */
tv.util.document = function(doc){
	if(typeof doc === "undefined"){ return this._document; } 
	this._document = doc || document;
};
tv.util.document(document);

/**
 * @class window.name을 이용하여 쿠키 사용없이 브라우저가 실행되는 동안 정보를 유지하고 관리하는 객체
 */

tv.util.jsSessionVar = (function(window2){
	/** @scope tv.util.jsSessionVar */
	var jsSessionVar = {
		/**
		 * @memberof tv.util.jsSessionVar
		 * @param {Window} elWin window 객체
		 * @description window 객체를 인자로 받아 name 프로퍼티를 기반으로 내부 초기화를 진행한다. 
	 	*/
		init : function(elWin){
			this.elWin = elWin || window;
			this.wData = jindo.$Json({});
		},
		/**
		 * @memberof tv.util.jsSessionVar 
		 * @param {String} sName window.name에 저장할 키 
		 * @param {String} sValue 키에 해당하는 값
		 * @description window.name에 지정된 Name에 value를 설정한다.
		 * */
		set : function(sName, sValue){
			this.get()[sName] = sValue;
			this.elWin.name = this.wData.toString(); 
		},
		/** 
		 * @memberof tv.util.jsSessionVar 
		 * @param {String} sName window.name에서 가져올 값에 대한 키 
		 * @return {String} 키에 해당하는 값
		 * @description window.name에 지정된 Name에 해당하는 값을 리턴한다.
		 * */
		get : function(sName){
			return sName ? this.wData.$value()[sName] : this.wData.$value();
		},
		/** 
		 * @memberof tv.util.jsSessionVar 
		 * @return {Array} window.name에 저장된 Name들의 리스트
		 * @description window.name에 지정된 Name에 배열을 리턴한다.
		 * */
		keys : function(){
			var aKeys = [];
			for(var prop in this.get()){
				aKeys[aKeys.length] = prop;
			}
			return aKeys;
		},
		/** 
		 * @memberof tv.util.jsSessionVar 
		 * @param {String} [sName] window.name에 삭제할 값의 키 
		 * @description window.name에 지정된 Name에 해당하는 값을 삭제하거나, Name이 없을 경우 내부 값을 초기화 한다.
		 * */
		remove : function(sName){
			if(sName){ delete this.get()[sName]; }
			else { this.wData = jindo.$Json({}); }
		}
	};
	jsSessionVar.init(window2);
	return jsSessionVar;
})(top);

/**
 * @class 클립보드에 복사되기 전에 내용을 조작할 수 있도록 하는 가상 클립보드 객체
 */
tv.util.fakeClipboardManager = (function(){
	/** @scope tv.util.fakeClipboardManager */
	var FakeClipboard = new jindo.$Class({
		$init : function(){
			var agent = jindo.$Agent().navigator();
			this.IS_FF4 = (agent.firefox && agent.version === 4);
			this.wfCopyEventHandler = jindo.$Fn(function(weEvent){ this.onCopyHandler(weEvent._event); }, this);
			this.wfKeyDownCopyEventHandler = jindo.$Fn(function(weEvent){ this.onKeyDownCopyHandler(weEvent._event); }, this);
		},
		/** @memberof tv.util.fakeClipboardManager */
		_getWrapTextAreaDummy : function(){
			if (!this.welTextAreaDummy){this.welTextAreaDummy = jindo.$Element('<textarea style="position:absolute;top:-9999px;left:-9999px;width:0px;height:0px;"></textarea>'); document.body.appendChild(this.welTextAreaDummy.$value());}
			return this.welTextAreaDummy;
		},
		/** @memberof tv.util.fakeClipboardManager */
		_getWrapHtmlDummy : function(){
			if (!this.welHtmlDummy){this.welHtmlDummy = jindo.$Element('<div style="position:absolute;top:-9999px;left:-9999px;"></div>'); document.body.appendChild(this.welHtmlDummy.$value());}
			return this.welHtmlDummy;
		},
		/** 
		 * @memberof tv.util.fakeClipboardManager 
		 * @description 브라우저에서 클립보드 복사를 할 때 발생하는 onCopy Event에 대해서 Attach를 한다.
		 * 단, FF4에서는 onCopy Event 발생 후에 Selection이 변경되면 클립보드에 복사되지 않으므로 Ctrl+C KeyDown 이벤트를 이용한 별도 예외처리를 한다.
		 */
		attachClipboardCopyEvent : function(){
			var self = this;
			// http://help.dottoro.com/ljwexqxl.php 
			//oncopy Event 지원: Internet Explorer, Firefox, Safari, Chrome 단 Opera는 처리 않함
			this.wfCopyEventHandler.attach(document.body, "copy");
			if(this.IS_FF4){ this.wfKeyDownCopyEventHandler.attach(document, "keydown"); } 
		},
		/** 
		 * @memberof tv.util.fakeClipboardManager
		 * @description 브라우저에서 클립보드 복사를 할 때 발생하는 onCopy Event에 대해서 Detach를 한다.
		 */
		detachClipboardCopyEvent : function(){
			this.wfCopyEventHandler.detach(document.body, "copy");
			if(this.IS_FF4){ this.wfKeyDownCopyEventHandler.detach(document, "keydown"); }
		},
		/** 
		 * @memberof tv.util.fakeClipboardManager
		 * @param {Range} range 선택된 Range 
		 * @description 현재 선택된 Range에서 부모 엘리먼트를 리턴한다.
		 */
		getParent : function(range) {
			var par = range.parentElement?range.parentElement():range.commonAncestorContainer;
			if (!par){ return null; }
			while(par.nodeType != 1) {
				par = par.parentNode;
			}
			return par;
		},
		/** 
		 * @memberof tv.util.fakeClipboardManager
		 * @param {Event} event window.event 객체
		 * @description onCopy Event가 발생시 수행되는 이벤트 핸들러 메소드이다. 
		 */
		onCopyHandler : function(event){
			var regInput = /textarea|input/i;
			if(event){	//FF, SF, CH
				var srcEl = event.target || event.srcElement;
				if(regInput.test(srcEl.tagName)){return;}
			}
			this.copyRangeText();
		},
		/** 
		 * @memberof tv.util.fakeClipboardManager
		 * @param {Event} event window.event 객체
		 * @description KeyDown Event가 발생시 수행되는 이벤트 핸들러 메소드이며 Ctrl+C에 대해서 선택된 Range의 Text를 복사한다. 
		 */
		onKeyDownCopyHandler : function(event){
			if ((event.ctrlKey || event.metaKey) && event.keyCode == 67) {
				this.copyRangeText();
			}
		},
		/** 
		 * @memberof tv.util.fakeClipboardManager
		 * @description 다양한 브라우저에서 선택된 영역을 기반으로 가상 클립보드 영역(TextArea)에 Text를 복사한다.  
		 */
		copyRangeText : function(){
			var sel    = this.getSelection();
			var rng    = this.getRange(sel);
			var html   = null;
			var regInput = /textarea|input/i;

			if (window.getSelection) {	//FF, SF, CH
				if(regInput.test(rng.commonAncestorContainer.tagName)){ return; } // INPUT, TEXTAREA 내부의 텍스트를 선택했으면 PASS
				html = (window.XMLSerializer) ? new XMLSerializer().serializeToString(rng.cloneContents()) : "";
			} else if (document.selection) { //IE
				if(regInput.test(rng.parentElement().tagName)){return;}	// INPUT, TEXTAREA 내부의 텍스트를 선택했으면 PASS
				html = rng.htmlText;
			}
			
			var welPar = jindo.$Element(this.getParent(rng));
			if( this.copy(welPar.offset(), html)){
				this.aftercopy(rng);
			}			
		},
		/** 
		 * @memberof tv.util.fakeClipboardManager
		 * @param {Object} pos 가상 클립보드 영역(TextArea)를 위치할 곳
		 * @param {String} html 가상 클립보드 영역(TextArea)에 복사할 Text 
		 * @description 가상 클립보드 영역을 특정 위치로 이동시킨 후 복사할 Text를 채워놓고 select 시킨다. 이렇게 해 놓으면 브라우저가 최종적으로 Selection된 영역을 클립보드로 복사하게 된다.
		 */
		copy : function(pos, html){
			//TextAreaDummy와 HtmlDummy Element를 실제로 사용할 때 생성하도록 LazyLoading 처리 한다. 
			var welTextAreaDummy = this._getWrapTextAreaDummy();
			var welHtmlDummy = this._getWrapHtmlDummy();
			
			welHtmlDummy.html(html);
			html = welHtmlDummy.html();
			
			//사파리에서는 특수 Entity에 대한 ChartCode 반환에 오류가 있어 직접  html에서 태그를 벗겨내서 적용됨. 예)Soft Hypen -> charCode=173이 아닌 32(빈공백)처리 버그.
			var text = IS_SF ? tv.util.stripTags(html) : welHtmlDummy.text();
			var customEvent = { "text" : text, "html" : html };
			
			if(!this.fireEvent("beforeCopyClipboard", customEvent)){
				return false;
			}
			
			//TextArea 포커스 발생 시 해당 위치로 브라우저 스크롤이 이동하므로 이를 막기 위해 현재 선택된 엘리먼터의 부모와 동일한 위치를 설정하도록 한다.  
			welTextAreaDummy.css({ top : pos.top + "px", left : pos.left + "px"});

			var elTextAreaDummy = welTextAreaDummy.$value(); 
			elTextAreaDummy.value = customEvent.text;
			elTextAreaDummy.focus();
			elTextAreaDummy.select();
			
			return true;
		},
		/** 
		 * @memberof tv.util.fakeClipboardManager
		 * @param {Range} rng 현재 선택된 Range 
		 * @description SF나 CH에서 클립보드가 복사된 이후 예전에 선택된 Selection을 유지하기 위한 복원작업을 진행한다.
		 */
		aftercopy : function(rng){
			var self = this;
			setTimeout(function(){
				//Webkit 계열에서 클립보드에 복사 후 기존 선택된 영역을 재 선택하도록 비동기 호출함
				if (IS_SF || IS_CH) {
					var sel = this.getSelection();
					sel.removeAllRanges();
					sel.addRange(rng);
				}
			},13);
		},
		/** 
		 * @memberof tv.util.fakeClipboardManager
		 * @return {Selection} 각 브라우저에 해당하는 현재 선택된 Selection 객체를 리턴한다.
		 */
		getSelection : function() {
			return window.getSelection ? window.getSelection() : document.selection;
		},
		/** 
		 * @memberof tv.util.fakeClipboardManager
		 * @param {Selection} [selection] 현재 선택된 Selection 객체
		 * @return {Range} 각 브라우저에 해당하는 현재 선택된 Range 객체를 리턴한다.
		 */
		getRange : function(selection) {
			selection = selection || this.getSelection();
			return selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
		}
	}).extend(jindo.Component);
	
	return new FakeClipboard();
})();


/**
 * 화면 가운데 새 창을 연다.
 * @param {String} sUrl 창을 열 주소
 * @param {Number} nWidth 가로 크기
 * @param {Number} nHeight 세로 크기
 */
tv.util.openCenteredWindow = function (sUrl, nWidth, nHeight) {
	var htSize = {
			width : nWidth,
			height: nHeight
	};
	var htPosition = {
		left : Math.round((screen.width - htSize.width) / 2),
		top : Math.round((screen.height - htSize.height) / 2)
	};
	
	var oWin = tv.util.window().open(sUrl, '_tv', 'top='+htPosition.top+',left='+htPosition.left+', menubar=no, scrollbars=no, status=no, toolbar=no, location=no, width=' + nWidth + ',height=' + nHeight);
	oWin.focus();
};

/**
 * 문자열에서 태그 벗겨내기
 * @param {String} p_str 문자열
 * @return {String} 태그를 벗겨낸 문자열
 */
tv.util.stripTags = function(p_str) {
	return p_str.toString().replace(/<\/?[^>]+>/gi, '');
};

/**
 * Document의 ScrollTop의 값을 가져오거나 설정한다. 
 * @param {[Number]} nScrollTop 숫자 (생략하면 현재 설정된 값 리턴)
 */
tv.util.scrollTop = function(nScrollTop) {
//	alert(nScrollTop)
	var doc = tv.util.document() || document;
	if(typeof nScrollTop === "undefined"){
		return doc.documentElement.scrollTop || doc.body.scrollTop;
	}
	doc.documentElement.scrollTop = doc.body.scrollTop = parseInt(nScrollTop, 10);
};
//alert(tv.util.scrollTop);
/**
 * Document의 ScrollLeft의 값을 가져오거나 설정한다. 
 * @param {[Number]} nScrollLeft 숫자 (생략하면 현재 설정된 값 리턴)
 */
tv.util.scrollLeft = function(nScrollLeft) {
	var doc = tv.util.document() || document;
	if(typeof nScrollLeft === "undefined"){
		return doc.documentElement.scrollLeft || doc.body.scrollLeft;
	}
	doc.documentElement.scrollLeft = doc.body.scrollLeft = parseInt(nScrollLeft, 10);
};

/**
 * Document의 ScrollWidth와 ScrollHeight값을 가져온다. 
 */
tv.util.scrollSize = function() {
	var doc = tv.util.document() || document;
	return {
		width : Math.max(
				doc.documentElement.clientWidth, 
				doc.body.scrollWidth, doc.documentElement.scrollWidth,
				doc.body.offsetWidth, doc.documentElement.offsetWidth
		),
		height : Math.max(
				doc.documentElement.clientHeight, 
				doc.body.scrollHeight, doc.documentElement.scrollHeight,
				doc.body.offsetHeight, doc.documentElement.offsetHeight
		)
	};
};

/**
 * Document의 뷰 영역의 Width와 Height값을 가져온다. 
 */
tv.util.clientSize = function() {
	var doc = tv.util.document() || document;
	var elem = doc.compatMode === "CSS1Compat" ? doc.documentElement : doc.body ;
	return {
		width  : elem.clientWidth,
		height : elem.clientHeight
	};
};

})();