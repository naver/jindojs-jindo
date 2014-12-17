var Avatar = (function(sNamespace){

/* Jindo Custom 2.0.1 mobile with [ba1,ba2,bg1,bg14,bg15,bq1,bq2,bq5,bq6,br1] */
//-!namespace.default start!-//
/**

 * @fileOverview	$() 함수, $Jindo() 객체, $Class() 객체를 정의한 파일.          
  
 */

var jindo = {};

/**
 
 *	@description agent의 dependency를 없애기 위해 별로도 설정.
 *	@ignore
  
 **/
var _j_ag = navigator.userAgent;
var _JINDO_IS_FF = _j_ag.indexOf("Firefox") > -1;
var _JINDO_IS_OP = _j_ag.indexOf("Opera") > -1;
var _JINDO_IS_SP = _j_ag.indexOf("Safari") > -1;
var _JINDO_IS_SF = _j_ag.indexOf("Apple") > -1;
var _JINDO_IS_CH = _j_ag.indexOf("Chrome") > -1;
var _JINDO_IS_WK = _j_ag.indexOf("WebKit") > -1;
var _JINDO_IS_MO = /(iPad|Mobile|Android|Nokia|webOS|BlackBerry|Opera Mini)/.test(_j_ag);

//-!jindo.$Jindo.default start!-//
/**

 * @class $Jindo 객체는 프레임워크에 대한 정보와 유틸리티 함수를 제공한다.
 * @constructor
 * @description $Jindo() 객체를 생성한다. $Jindo 객체는 프레임웍에 대한 정보와 유틸리티 함수를 제공한다. 다음은 Jindo 프레임워크 정보를 담고 있는 객체의 속성을 설명한 표이다.<br>
<table>
	<caption>Jindo 프레임워크 정보 객체 속성</caption>
	<thead>
		<tr>
			<th scope="col">이름</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>version</td>
			<td>Number</td>
			<td>Jindo 프레임워크의 버전을 저장한다.</td>
		</tr>
 </table>
  
 */
jindo.$Jindo = function() {
	//-@@$Jindo.default-@@//
	var cl=arguments.callee;
	var cc=cl._cached;
	
	if (cc) return cc;
	if (!(this instanceof cl)) return new cl();
	if (!cc) cl._cached = this;
	
	this.version = "2.0.1";
};
/**

 * @description 호환 모드를 설정하거 반환하는 함수.
 * @ignore
 * @name $Jindo#compatible
 * @param {Boolean} bType
 * @return {Boolean} [true|false]
  
 */
jindo.$Jindo.compatible = function(){
	return false;
};

var _objToString = Object.prototype.toString;
var _slice = Array.prototype.slice;

jindo.$Error = function(sMessage,sMethod){
	this.message = "\tmethod : "+sMethod+"\n\tmessage : "+sMessage;
	this.type = "Jindo Custom Error";
	this.toString = function(){
		return this.message+"\n\t"+this.type;
	}
};

jindo.$Except = {
	CANNOT_USE_OPTION:"해당 옵션은 사용할 수 없습니다.",
	PARSE_ERROR:"파싱중 에러가 발생했습니다.",
	NOT_FOUND_ARGUMENT:"파라메터가 없습니다.",
	NOT_STANDARD_QUERY:"css셀렉터가 정상적이지 않습니다.",
	INVALID_DATE:"날짜 포멧이 아닙니다.",
	REQUIRE_AJAX:"가 없습니다.",
	NOT_FOUND_ELEMENT:"엘리먼트가 없습니다.",
	HAS_FUNCTION_FOR_GROUP:"그룹으로 지우지 않는 경우 detach할 함수가 있어야 합니다.",
	NONE_ELEMENT:"에 해당하는 엘리먼트가 없습니다.",
	NOT_SUPPORT_SELECTOR:"는 지원하지 않는 selector입니다.",
	NOT_SUPPORT_METHOD:"desktop에서 지원하지 않는 메서드 입니다.",
	JSON_MUST_HAVE_ARRAY_HASH:"get메서드는 json타입이 hash나 array타입만 가능합니다.",
	MUST_APPEND_DOM : "document에 붙지 않은 엘리먼트를 기준 엘리먼트로 사용할 수 없습니다.",
	NOT_USE_CSS : "는 css를 사용 할수 없습니다.",
	NOT_WORK_DOMREADY : "domready이벤트는 iframe안에서 사용할 수 없습니다."
};

/**
 * @ignore
 */
function _toArray(aArray){
	return _slice.apply(aArray);
}

try{
	_slice.apply(document.documentElement.childNodes);
}catch(e){
	_toArray = function(aArray){
		var returnArray = [];
		var leng = aArray.length;
		for ( var i = 0; i < leng; i++ ) {
			returnArray.push( aArray[i] );
		}
		return returnArray;
	}
}
/**

 * @description 파라메터가 Function인지 확인하는 함수.
 * @static
 * @function
 * @name $Jindo#isFunction
 * @since 2.0.0
 * @param {Variant} oObj
 * @return {Boolean} [true|false]
  
 */

/**

 * @description 파라메터가 Array인지 확인하는 함수.
 * @static
 * @function
 * @name $Jindo#isArray
 * @since 2.0.0
 * @param {Variant} oObj
 * @return {Boolean} [true|false]
  
 */

/**

 * @description 파라메터가 String인지 확인하는 함수.
 * @static
 * @function
 * @name $Jindo#isString
 * @since 2.0.0
 * @param {Variant} oObj
 * @return {Boolean} [true|false]
  
 */

/**

 * @description 파라메터가 Numeric인지 확인하는 함수.
 * @static
 * @function
 * @name $Jindo#isNumeric
 * @since 2.0.0
 * @param {Variant} oObj
 * @return {Boolean} [true|false]
  
 */
jindo.$Jindo.isNumeric = function(nNum){
	return !isNaN(parseFloat(nNum)) && !jindo.$Jindo.isArray(nNum) &&isFinite( nNum );
};
/**

 * @description 파라메터가 Boolean인지 확인하는 함수.
 * @static
 * @function
 * @name $Jindo#isBoolean
 * @since 2.0.0
 * @param {Variant} oObj
 * @return {Boolean} [true|false]
  
 */
/**

 * @description 파라메터가 Date인지 확인하는 함수.
 * @static
 * @function
 * @name $Jindo#isDate
 * @since 2.0.0
 * @param {Variant} oObj
 * @return {Boolean} [true|false]
  
 */
/**

 * @description 파라메터가 Regexp인지 확인하는 함수.
 * @static
 * @function
 * @name $Jindo#isRegexp
 * @since 2.0.0
 * @param {Variant} oObj
 * @return {Boolean} [true|false]
  
 */
/**

 * @description 파라메터가 Element인지 확인하는 함수.
 * @static
 * @function
 * @name $Jindo#isElement
 * @since 2.0.0
 * @param {Variant} oObj
 * @return {Boolean} [true|false]
  
 */
/**

 * @description 파라메터가 Document인지 확인하는 함수.
 * @static
 * @function
 * @name $Jindo#isDocument
 * @since 2.0.0
 * @param {Variant} oObj
 * @return {Boolean} [true|false]
  
 */
(function(){
	var oType = {"Element" : 1,"Document" : 9};
	for(var i in oType){
		jindo.$Jindo["is"+i] = (function(sType,nNodeNumber){
			return function(oObj){
				if(new RegExp(sType).test(_objToString.call(oObj))){
					return true;
				}else if(_objToString.call(oObj) == "[object Object]"&&oObj !== null&&oObj !== undefined&&oObj.nodeType==nNodeNumber){
					return true;
				}
				return false;
			}
		})(i,oType[i])
	}
	var _$type = ["Function","Array","String","Boolean","Date","RegExp"]; 
	for(var i = 0, l = _$type.length; i < l ;i++){
		jindo.$Jindo["is"+_$type[i]] = (function(type){
			return function(oObj){
				return _objToString.call(oObj) == "[object "+type+"]";
			}
		})(_$type[i]);
	}
})();

/**

 * @description 파라메터가 Node인지 확인하는 함수.
 * @static
 * @function
 * @since 2.0.0
 * @param {Variant} oObj
 * @return {Boolean} [true|false]
  
 */
jindo.$Jindo.isNode = function(eEle){
	try{
		return !!(eEle&&eEle.nodeType);
	}catch(e){
		return false;
	}
};

/**

 * @description 파라메터가 Hash인지 확인하는 함수.
 * @static
 * @function
 * @name $Jindo#isHash
 * @since 2.0.0
 * @param {Variant} oObj
 * @return {Boolean} [true|false]
  
 */
jindo.$Jindo.isHash = function(oObj){
	return _objToString.call(oObj) == "[object Object]"&&oObj !== null&&oObj !== undefined&&!!!oObj.nodeType&&!jindo.$Jindo.isWindow(oObj);
};

/**

 * @description 파라메터가 Null인지 확인하는 함수.
 * @function
 * @name $Jindo#isNull
 * @since 2.0.0
 * @param {Variant} oObj
 * @return {Boolean} [true|false]
  
 */
jindo.$Jindo.isNull = function(oObj){
	return oObj === null;
};
/**

 * @description 파라메터가 Undefined인지 확인하는 함수.
 * @static
 * @function
 * @name $Jindo#isUndefined
 * @since 2.0.0
 * @param {Variant} oObj
 * @return {Boolean} [true|false]
  
 */
jindo.$Jindo.isUndefined = function(oObj){
	return oObj === undefined;
};

/**

 * @description 파라메터가 Window인지 확인하는 함수.
 * @static
 * @function
 * @since 2.0.0
 * @param {Variant} oObj
 * @return {Boolean} [true|false]
  
 */
jindo.$Jindo.isWindow = function(oObj){
	return oObj == window || oObj == window.top;
};
/**
 * @ignore
 */
jindo.$Jindo.Break = function(){
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};
/**
 * @ignore
 */
jindo.$Jindo.Continue = function(){
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};

/**

 * @description 함수 파라미터가 원하는 규칙에 맞는지 검사한다.
 * @param {Array} aArgs 파라미터 목록
 * @param {Hash} oRules 규칙 목록
 * @param {String} sFuncName 에러메시지를 보여줄때 사용할 함수명
 * @return {Object}
 * @ignore
  
 */
jindo.$Jindo._F = function(sKeyType) {
	return sKeyType;
};

jindo.$Jindo._warn = function(nCurrentLength, nMaxLength, sMessage) {
	if(nCurrentLength > nMaxLength) window.console && ( (console.warn && console.warn('추가적인 파라메터가 있습니다. : '+sMessage), true) || (console.log && console.log('추가적인 파라메터가 있습니다. : '+sMessage), true) );
};

jindo.$Jindo.checkVarType = function(aArgs, oRules, sFuncName) {
	
	var sFuncName = sFuncName || aArgs.callee.name || 'anonymous';
	
	var $Jindo = jindo.$Jindo;
	var bCompat = $Jindo.compatible();
	
	var fpChecker = aArgs.callee['_checkVarType_' + bCompat];
	if (fpChecker) { return fpChecker(aArgs, oRules, sFuncName); }
	
	var aPrependCode = [];
	aPrependCode.push('var nArgsLen = aArgs.length;');
	aPrependCode.push('var $Jindo = '+sNamespace+'.$Jindo;');
	
	if (bCompat) {
		aPrependCode.push('var nMatchScore;');
		aPrependCode.push('var nMaxMatchScore = -1;');
		aPrependCode.push('var oFinalRet = null;');
	}
	
	var aBodyCode = [];
	var nMaxRuleLen = 0;
	
	for (var sType in oRules) if (oRules.hasOwnProperty(sType)) {
		nMaxRuleLen = Math.max(oRules[sType].length, nMaxRuleLen);
	}
	
	for (var sType in oRules) if (oRules.hasOwnProperty(sType)) {
		
		// console.log(sType);
		
		var aRule = oRules[sType];
		var nRuleLen = aRule.length;
		
		var aBodyPrependCode = [];
		var aBodyIfCode = [];
		var aBodyThenCode = [];
		
		if (!bCompat) {
			if (nRuleLen < nMaxRuleLen) { aBodyIfCode.push('nArgsLen === ' + nRuleLen); }
			else { aBodyIfCode.push('nArgsLen >= ' + nRuleLen); }
		}
		
		aBodyThenCode.push('var oRet = new $Jindo._varTypeRetObj();');
		
		var nTypeCount = nRuleLen;
		
		for (var i = 0; i < nRuleLen; ++i) {
			
			/^([^:]+):([^\+]*)(\+?)$/.test(aRule[i]);
			
			var sVarName = RegExp.$1;
			var sVarType = RegExp.$2;
			var bAutoCast = RegExp.$3 ? true : false;
			
			// 모든 타입을 허용하면
			if (sVarType === 'Variant') {
				
				if (bCompat) {
					aBodyIfCode.push(i + ' in aArgs');
				}
				
				aBodyThenCode.push('oRet["' + sVarName + '"] = aArgs[' + i + '];');
				nTypeCount--;
				
			// 사용자 정의 타입이면
			} else if ($Jindo._varTypeList[sVarType]) {
				
				var vVar = 'tmp' + sVarType + '_' + i;
				
				aBodyPrependCode.push('var ' + vVar + ' = $Jindo._varTypeList.' + sVarType + '(aArgs[' + i + '], ' + bAutoCast + ');');
				aBodyIfCode.push(vVar + ' !== '+sNamespace+'.$Jindo.VARTYPE_NOT_MATCHED');
				aBodyThenCode.push('oRet["' + sVarName + '"] = ' + vVar + ';');
				
			// Jindo 랩핑 타입이면
			} else if (/^\$/.test(sVarType) && jindo[sVarType]) {
				
				var sOR = '';
				var sNativeVarType;
				
				if (bAutoCast) {
					sNativeVarType = ({ $Fn : 'Function', $S : 'String', $A : 'Array', $H : 'Hash', $ElementList : 'Array' })[sVarType] || sVarType.replace(/^\$/, '');
					if (jindo.$Jindo['is' + sNativeVarType]) {
						sOR = ' || $Jindo.is' + sNativeVarType + '(vNativeArg_' + i + ')';
					}
				}
				
				aBodyIfCode.push('(aArgs[' + i + '] instanceof jindo.' + sVarType + sOR + ')');
				aBodyThenCode.push('oRet["' + sVarName + '"] = jindo.' + sVarType + '(aArgs[' + i + ']);');
				
			// 기타 Native 타입이면
			} else if (jindo.$Jindo['is' + sVarType]) {

				var sOR = '';
				var sWrapedVarType;
				
				if (bAutoCast) {
					sWrapedVarType = ({ 'Function' : '$Fn', 'String' : '$S', 'Array' : '$A', 'Hash' : '$H' })[sVarType] || '$' + sVarType;
					if (jindo[sWrapedVarType]) {
						sOR = ' || aArgs[' + i + '] instanceof jindo.' + sWrapedVarType;
					}
				}
				
				aBodyIfCode.push('($Jindo.is' + sVarType + '(aArgs[' + i + '])' + sOR + ')');
				aBodyThenCode.push('oRet["' + sVarName + '"] = vNativeArg_' + i + ';');
			
			// 없는 타입이면
			} else {
				
				throw new Error('VarType(' + sVarType + ') Not Found');
				
			}
			
		}
		
		aBodyThenCode.push('oRet.__type = "' + sType + '";');
		
		if (bCompat) {
			aBodyThenCode.push('nMatchScore = ' + (nRuleLen * 1000 + nTypeCount * 10) + ' + (nArgsLen === ' + nRuleLen + ' ? 1 : 0);');
			aBodyThenCode.push('if (nMatchScore > nMaxMatchScore) {');
			aBodyThenCode.push('	nMaxMatchScore = nMatchScore;');
			aBodyThenCode.push('	oFinalRet = oRet;');
			aBodyThenCode.push('}');
		} else {
			aBodyThenCode.push('return oRet;');
		}
		
		aBodyCode.push(aBodyPrependCode.join('\n'));
		
		if (aBodyIfCode.length) { aBodyCode.push('if (' + aBodyIfCode.join(' && ') + ') {'); }
		aBodyCode.push(aBodyThenCode.join('\n'));
		if (aBodyIfCode.length) { aBodyCode.push('}'); }
		
	}
	
	aPrependCode.push('	$Jindo._warn(nArgsLen,'+nMaxRuleLen+',"'+sFuncName+'");');
	
	for (var i = 0; i < nMaxRuleLen; ++i) {
		var sArg = 'aArgs[' + i + ']';
		aPrependCode.push([ 'var vNativeArg_', i, ' = ', sArg, ' && ', sArg, '.$value ? ', sArg, '.$value() : ', sArg + ';' ].join('')); 
	}
	
	if (!bCompat) {
		aBodyCode.push('$Jindo.checkVarType._throwException(aArgs, oRules, sFuncName);');
	}

	aBodyCode.push('return oFinalRet;');

	// if (bCompat) { console.log(aPrependCode.join('\n') + aBodyCode.join('\n')); }
	
	aArgs.callee['_checkVarType_' + bCompat] = fpChecker = new Function('aArgs,oRules,sFuncName', aPrependCode.join('\n') + aBodyCode.join('\n'));
	
	return fpChecker(aArgs, oRules, sFuncName);
	
};

jindo.$Jindo._varTypeRetObj = function() {};
jindo.$Jindo._varTypeRetObj.prototype.toString = function() { return this.__type; };

jindo.$Jindo.checkVarType._throwException = function(aArgs, oRules, sFuncName) {
	
	var fpGetType = function(vArg) {

		for (var sKey in jindo) if (jindo.hasOwnProperty(sKey)) {
			var oConstructor = jindo[sKey];
			if (typeof oConstructor !== 'function') { continue; }
			if (vArg instanceof oConstructor) { return sKey; }
		}
		
		var $Jindo = jindo.$Jindo;
		
		for (var sKey in $Jindo) if ($Jindo.hasOwnProperty(sKey)) {
			if (!/^is(.+)$/.test(sKey)) { continue; }
			var sType = RegExp.$1;
			var fpMethod = $Jindo[sKey];
			if (fpMethod(vArg)) { return sType; }
		}
		
		return 'Unknown';
		
	};
	
	var fpErrorMessage = function(sUsed, aSuggs, sURL) {
		
		var aMsg = [ '잘못된 파라미터입니다.', '' ];
		
		if (sUsed) {
			aMsg.push('호출한 형태 :');
			aMsg.push('\t' + sUsed);
			aMsg.push('');
		}
		
		if (aSuggs.length) {
			aMsg.push('사용 가능한 형태 :');
			for (var i = 0, nLen = aSuggs.length; i < nLen; i++) {
				aMsg.push('\t' + aSuggs[i]);
			}
			aMsg.push('');
		}
		
		if (sURL) {
			aMsg.push('매뉴얼 페이지 :');
			aMsg.push('\t' + sURL);
			aMsg.push('');
		}
		
		aMsg.unshift();
		
		return aMsg.join('\n');
		
	};
	
	var aArgName = [];
	
	for (var i = 0, ic = aArgs.length; i < ic; ++i) {
		try { aArgName.push(fpGetType(aArgs[i])); }
		catch(e) { aArgName.push('Unknown'); }
	}
	
	var sUsed = sFuncName + '(' + aArgName.join(', ') + ')';
	var aSuggs = [];
	
	for (var sKey in oRules) if (oRules.hasOwnProperty(sKey)) {
		var aRule = oRules[sKey];
		aSuggs.push('' + sFuncName + '(' + aRule.join(', ').replace(/(^|,\s)[^:]+:/g, '$1') + ')');
	}
	
	var sURL;
	
	if (/(\$\w+)(#\w+)?/.test(sFuncName)) {
		sURL = '@docurl@' + encodeURIComponent(RegExp.$1) + '.html' + RegExp.$2;
	}
	
	throw new TypeError(fpErrorMessage(sUsed, aSuggs, sURL));

};

/**

 * @description checkVarType 를 수행할때 사용할 타입을 설정한다.
 *
 * @param1 {String+} sTypeName 타입 이름
 * @param1 {Function+} fpFunc 타입을 검사하는 규칙을 구현하는 함수
 * @return1 {$Jindo}
 * @ignore
 *
 * checkVarType 를 수행할때 사용할 여러개의 타입들을 한번에 설정한다.
 * @param2 {Hash+} oTypeLists 타입 규칙을 담은 객체
 * @return2 {$Jindo}
 * @ignore
 *
 * checkVarType 를 수행할때 사용하고 있는 타입을 얻는다.
 * @param3 {String+} sTypeName 타입 이름
 * @return3 {Function} 타입을 검사하는 규칙을 구현하는 함수
 * @ignore
 
 */
jindo.$Jindo.varType = function() {
	
	var oArgs = this.checkVarType(arguments, {
		's4str' : [ 'sTypeName:String+', 'fpFunc:Function+' ],
		's4obj' : [ 'oTypeLists:Hash+' ],
		'g' : [ 'sTypeName:String+' ]
	});
	
	var sDenyTypeListComma = jindo.$Jindo._denyTypeListComma;
	
	switch (oArgs+"") {
	case 's4str':
		var sTypeNameComma = ',' + oArgs.sTypeName.replace(/\+$/, '') + ',';
		if (sDenyTypeListComma.indexOf(sTypeNameComma) > -1) {
			throw new Error('Not allowed Variable Type');
		}
		
		this._varTypeList[oArgs.sTypeName] = oArgs.fpFunc;
		return this;
		
	case 's4obj':
		var oTypeLists = oArgs.oTypeLists;
		for (var sTypeName in oTypeLists) if (oTypeLists.hasOwnProperty(sTypeName)) {
			fpFunc = oTypeLists[sTypeName];
			arguments.callee.call(this, sTypeName, fpFunc);
		}
		return this;
		
	case 'g':
		return this._varTypeList[oArgs.sTypeName];
	}

};

/**

 * varType 에 등록한 타입 체크 함수에서 타입이 매칭되지 않음을 알리고 싶을때 사용한다.
 * @ignore
 
 */
jindo.$Jindo.VARTYPE_NOT_MATCHED = {};

(function() {
	
	var oVarTypeList = jindo.$Jindo._varTypeList = {};
	var ___jindo = jindo.$Jindo;
	var ___notMatched = ___jindo.VARTYPE_NOT_MATCHED;
	oVarTypeList['Numeric'] = function(v) {
		if (___jindo.isNumeric(v)) { return v * 1; }
		return ___notMatched;
	};

	oVarTypeList['Hash'] = function(val, bAutoCast){
		if (bAutoCast && jindo.$H && val instanceof jindo.$H) {
			return val.$value();
		} else if (___jindo.isHash(val)) {
			return val;
		}
		return ___notMatched;
	};
	
	oVarTypeList['$Class'] = function(val, bAutoCast){
		if ((!___jindo.isFunction(val))||!val.extend) {
			return ___notMatched;
		}
		return val;
	};
	
	var aDenyTypeList = [];
	
	for (var sTypeName in ___jindo) if (___jindo.hasOwnProperty(sTypeName)) {
		if (/^is(.+)$/.test(sTypeName)) { aDenyTypeList.push(RegExp.$1); }
	}
	
	___jindo._denyTypeListComma = aDenyTypeList.join(',');
	
	___jindo.varType("ArrayStyle",function(val, bAutoCast){
		if(!val) { return ___notMatched; }
		if (  
		    /(Arguments|NodeList|HTMLCollection|global|Window)/.test(_objToString.call(val)) ||
			/Object/.test(_objToString.call(val))&&___jindo.isNumeric(val.length)) {
			return _toArray(val);
		}
		return ___notMatched;
	});
	
	___jindo.varType("Form",function(val, bAutoCast){
		if(!val) { return ___notMatched; }
		if(bAutoCast&&val.$value){
			val = val.$value();
		}
		if (val.tagName&&val.tagName.toUpperCase()=="FORM") {
			return val
		}
		return ___notMatched;
	});
//	___jindo.varType("FormId",function(val, bAutoCast){
//		if(___jindo.isString(val)){
//			val = jindo.$(val);
//			if (val.tagName&&val.tagName.toUpperCase()=="FORM") {
//				return val;
//			}
//		}
//		return ___notMatched;
//	});
	
//	___jindo.varType("PrimativeStyle",function(val, bAutoCast){
//		if(
//		___jindo.isNumeric(val) ||
//		___jindo.isString(val) ||
//		___jindo.isBoolean(val)
//		){
//			return val;
//		}
//		return ___notMatched;
//		
//	});
	
})();

//-!jindo.$H start!-//
/**
 
 * @class $H() 객체는 키(key)와 값(value)을 원소로 가지는 열거형 배열인 해시(Hash)를 구현하고, 해시를 다루기 위한 여러 가지 위한 메서드를 제공한다.
 * @constructor
 * @description $H() 객체를 생성한다.
 * @param {Hash+} oHashObject 해시로 만들 객체.
 * @example
var h = $H({one:"first", two:"second", three:"third"})

  
 */
jindo.$H = function(hashObject) {
	//-@@$H-@@//
	var cl = arguments.callee;
	if (hashObject instanceof cl) return hashObject;
	
	if (!(this instanceof cl)){
		try {
			jindo.$Jindo._warn(arguments.length, 1,"$H");
			return new cl(hashObject||{});
		} catch(e) {
			if (e instanceof TypeError) { return null; }
			throw e;
		}
	}
	
	var oArgs = jindo.$Jindo.checkVarType(arguments, {
		'4obj' : ['oObj:Hash+'],
		'4vod' : []
	},"$H");

	this._table = {};
	for(var k in hashObject) {
		if(hashObject.hasOwnProperty(k)){
			this._table[k] = hashObject[k];	
		}
	}
};

//-!jindo.$H.prototype.ksort start(jindo.$H.prototype.keys)!-//
/**
 
 * @description ksort() 메서드는 키를 기준으로 해시의 원소를 오름차순 정렬한다.
 * @return {$H} 원소를 정렬한 해시 객체.
 * @see $H#sort
 * @example
var h = $H({one:"하나", two:"둘", three:"셋"});
h.sort ();
// h => {one:"하나", three:"셋", two:"둘"}
  
 */
jindo.$H.prototype.ksort = function() {
	//-@@$H.ksort-@@//
	var o = new Object;
	var a = this.keys();

	a.sort();

	for(var i=0; i < a.length; i++) {
		o[a[i]] = this._table[a[i]];
	}

	this._table = o;

	return this;
};

//-!jindo.$H.prototype.keys start!-//
/**
 
 * @description keys() 메서드는 해시의 키를 배열로 반환한다.
 * @return {Array} 해시 키의 배열.
 * @see $H#values
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.keys ();
// ["one", "two", "three"]
  
 */
jindo.$H.prototype.keys = function() {
	//-@@$H.keys-@@//
	var keys = new Array;
	for(var k in this._table) {
		if(this._table.hasOwnProperty(k))
			keys.push(k);
	}

	return keys;
};

//-!jindo.$Json start(jindo.$Json._oldMakeJSON)!-//
/**
 
 * @class $Json 객체는 JSON(JavaScript Object Notation)을 다루기 위한 다양한 기능을 제공한다. 생성자에 파라미터로 객체나 문자열을 입력한다. XML 형태의 문자열로 $Json() 객체를 생성하려면 fromXML() 메서드를 사용한다.
 * @constructor
 * @description $Json() 객체를 생성한다.
 * @param {Varaint} 다양한 타입
 * @return {$Json} 인수를 인코딩한 $Json() 객체.
 * @see $Json#fromXML
 * @see <a href="http://www.json.org/json-ko.html">json.org</a>
 * @example
var oStr = $Json ('{ zoo: "myFirstZoo", tiger: 3, zebra: 2}');

var d = {name : 'nhn', location: 'Bundang-gu'}
var oObj = $Json (d);
  
 */

jindo.$Json = function (sObject) {
	//-@@$Json-@@//
	var cl = arguments.callee;
	if (sObject instanceof cl) return sObject;
	
	if (!(this instanceof cl)){
		try {
			jindo.$Jindo._warn(arguments.length, 1,"$Json");
			return new cl(arguments.length?sObject:{});
		} catch(e) {
			if (e instanceof TypeError) { return null; }
			throw e;
		}
	}	
		
	jindo.$Jindo.checkVarType(arguments, {
		'4var' : ['oObject:Variant']
	},"$Json");
	this._object = sObject;
};

//-!jindo.$Json._oldMakeJSON.hidden start!-//
jindo.$Json._oldMakeJSON = function(sObject,sType){
	try {
		if(jindo.$Jindo.isString(sObject)&&/^(?:\s*)[\{\[]/.test(sObject)){
			sObject = eval("("+sObject+")");
		}else{
			return sObject;
		}
	} catch(e) {
		throw new jindo.$Error(jindo.$Except.PARSE_ERROR,sType);
	}
	return sObject;
};

//-!jindo.$Json.prototype.toString start(jindo.$Json._oldToString)!-//
/**
 
 * @function
 * @description toString() 메서드는 $Json() 객체를 JSON 문자열 형태로 반환한다.
 * @return {String} JSON 문자열.
 * @see $Json#toObject
 * @see $Json#toXML
 * @see <a href="http://www.json.org/json-ko.html">json.org</a>
 * @example
var j = $Json({foo:1, bar: 31});
document.write (j.toString());
document.write (j);

// 결과 :
// {"bar":31,"foo":1}{"bar":31,"foo":1}
   
 */
jindo.$Json.prototype.toString = function() {
	//-@@$Json.toString-@@//
	if (window.JSON&&window.JSON.stringify&&window.JSON.stringify(/!/)) {
		jindo.$Json.prototype.toString = function() {
			try{
				return (window.JSON.stringify(this._object)).substr(0);
			}catch(e){
				return jindo.$Json._oldToString(this._object);
			}
		}
	}else{
		jindo.$Json.prototype.toString = function() {
			return jindo.$Json._oldToString(this._object);
		}
	}
	
	return this.toString();
};

//-!jindo.$Json._oldToString.hidden start(jindo.$H.prototype.ksort)!-//
jindo.$Json._oldToString = function(oObj){
	var ___jindo = jindo.$Jindo;
	var func = {
		$ : function($) {
			if (___jindo.isNull($)||$==Infinity) return "null";
			if (___jindo.isFunction($)) return undefined;
			if (___jindo.isUndefined($)) return undefined;
			if (___jindo.isBoolean($)) return $?"true":"false";
			if (___jindo.isString($)) return this.s($);
			if (___jindo.isNumeric($)) return $;
			if (___jindo.isArray($)) return this.a($);
			if (___jindo.isHash($)) return this.o($);
			if (typeof $ == "object"||___jindo.isRegExp($)) return "{}";
			if (isNaN($)) return "null";
		},
		s : function(s) {
			var e = {'"':'\\"',"\\":"\\\\","\n":"\\n","\r":"\\r","\t":"\\t"};
			var c = function(m){ return (e[m] !== undefined)?e[m]:m };
			return '"'+s.replace(/[\\"'\n\r\t]/g, c)+'"';
		},
		a : function(a) {
			// a = a.sort();
			var s = "[",c = "",n=a.length;
			for(var i=0; i < n; i++) {
				if (___jindo.isFunction(a[i])) continue;
				s += c+this.$(a[i]);
				if (!c) c = ",";
			}
			return s+"]";
		},
		o : function(o) {
			o = jindo.$H(o).ksort().$value();
			var s = "{",c = "";
			for(var x in o) {
				if (o.hasOwnProperty(x)) {
					if (___jindo.isUndefined(o[x])||___jindo.isFunction(o[x])) continue;
					s += c+this.s(x)+":"+this.$(o[x]);
					if (!c) c = ",";
				}
			}
			return s+"}";
		}
	}

	return func.$(oObj);
};

//-!jindo.$Ajax start(jindo.$Json.prototype.toString)!-//
/**

 * @class $Ajax() 객체는 다양한 개발 환경에서 Ajax 요청과 응답을 쉽게 구현하기 위한 메서드를 제공한다.<br>
 * @extends core
 * @constructor
 * @description $Ajax() 객체는 서버와 브라우저 사이의 비동기 통신, 즉 Ajax 통신을 지원한다. $Ajax() 객체는 XHR 객체(XMLHTTPRequest)를 사용한 기본적인 방식과 함께 다른 도메인 사이의 통신을 위한 여러 방식을 제공한다. $Ajax() 객체의 기본적인 초기화 방식은 다음과 같다.
 <textarea name="code" class="js:nocontrols">
 var oAjax = new $Ajax('server.php', {
    type : 'xhr',
    method : 'get',     // GET 방식으로 통신
    onload : function(res){ // 요청이 완료되면 실행될 콜백 함수
      $('list').innerHTML = res.text();
    },
    timeout : 3,      // 3초 이내에 요청이 완료되지 않으면 ontimeout 실행 (생략 시 0)
    ontimeout : function(){ // 타임 아웃이 발생하면 실행될 콜백 함수, 생략 시 타임 아웃이 되면 아무 처리도 하지 않음
      alert("Timeout!");
    },
    async : true      // 비동기로 호출하는 경우, 생략하면 true
  });
  oAjax.request();
}
</textarea>
 * @param {String+} sUrl Ajax 요청을 보낼 서버의 URL.
 * @param {Hash+} oOption $Ajax()에서 사용하는 콜백 함수, 통신 방식 등과 같은 다양한 정보를 정의한다. oOption 객체의 프로퍼티와 사용법에 대한 설명은 다음 표와 같다.<br>
 * @throws {jindo.$Except.REQUIRE_AJAX} 사용하는 타입의 ajax가 없는 경우. 
 * @throws {jindo.$Except.CANNOT_USE_OPTION} 사용하지 못하는 옵션을 사용할 경우.
<table>
	<caption>oOption 객체의 속성</caption>
	<thead>
		<th>속성</th>
		<th>타입</th>
		<th>설명</th>
	</thead>
	<tbody>
		<tr>
			<td style="font-weight:bold;">type</td>
			<td>String</td>
			<td>
				Ajax 요청 방식. 생략하면 기본 값은 xhr이다.
				<ul>
					<li><strong>xhr</strong><br>
						브라우저에 내장된 XMLHttpRequest 객체를 이용하여 Ajax 요청을 처리한다. text, xml, json 형식의 응답 데이터를 처리할 수 있다. 요청 실패 시 HTTP 응답 코드를 통해 원인 파악이 가능하다. 단, 크로스 도메인(Cross-Domain) 상황에서 사용할 수 없다.
					</li>
					<li><strong>iframe</strong><br>
						iframe 요소를 프록시로 사용하여 Ajax 요청을 처리한다. 크로스 도메인 상황에서 사용할 수 있다. iframe 요청 방식은 다음과 같이 동작한다.
						<ol>
							<li>로컬(요청 하는 쪽)과 원격(요청 받는 쪽)에 모두 프록시용 HTML 파일을 만든다.</li>
							<li>로컬 프록시에서 원격 프록시로 데이터를 요청한다.</li>
							<li>원격 프록시가 원격 도메인에 XHR 방식으로 다시 Ajax 요청한다.</li>
							<li>응답을 받은 원격 프록시에서 로컬 프록시로 데이터를 전달한다.</li>
							<li>로컬 프록시에서 최종적으로 콜백 함수(onload)를 호출하여 처리한다.</li>
						</ol>
						<br>
						로컬 프록시 파일과 원격 프록시 파일은 다음과 같이 작성할 수 있다.
						<ul type="disc">
							<li>원격 프록시 파일 : ajax_remote_callback.html</li>
							<li>로컬 프록시 파일 : ajax_local_callback.html</li>
						</ul>
						※ iframe 요소를 사용한 방식은 인터넷 익스플로러에서 "딱딱"하는 페이지 이동음이 발생할 수 있다(요청당 2회).
					</li>
					<li><strong>jsonp</strong><br>
							JSON 형식과 &lt;script&gt; 태그를 사용하여 사용하여 Ajax 요청을 처리한다. 크로스 도메인 상황에서 사용할 수 있다. jsonp 요청 방식은 다음과 같이 동작한다.<br>
							<ol>
								<li>&lt;script&gt; 태그를 동적으로 생성한다. 이때 요청할 원격 페이지를 src 속성으로 입력하여 GET 방식으로 요청을 전송한다.</li>
								<li>요청 시에 콜백 함수를 매개 변수로 넘기면, 원격 페이지에서 전달받은 콜백 함수명으로 아래와 같이 응답을 보낸다.
									<ul type="disc">
										<li>function_name(...결과 값...)</li>
									</ul>
								</li>
								<li>응답은 콜백 함수(onload)에서 처리된다.</li>
							</ol>
							※ GET 방식만 가능하므로, 전송 데이터의 길이는 URL에서 허용하는 길이로 제한된다.
					</li>
					<li><strong>flash</strong><br>
						플래시 객체를 사용하여 Ajax 요청을 처리한다. 크로스 도메인 상황에에서 사용할 수 있다. 이 방식을 사용할 때 원격 서버의 웹 루트 디렉터리에 crossdomain.xml 파일이 존재해야 하며 해당 파일에 접근 권한이 설정되어 있어야 한다. 모든 통신은 플래시 객체를 통하여 주고 받으며 Ajax 요청을 시도하기 전에 반드시 플래시 객체를 초기화해야 한다. $Ajax.SWFRequest.write() 메서드를 사용하여 플래시 객체를 초기화하며 해당 메서드는 &lt;body&gt; 요소 안에 작성한다.
						만약 https에서 https 쪽으로 호출할 경우 &lt;allow-access-from domain="*" secure="true" /&gt; 처럼 secure을 true로 설정해야 하며 그 이외에는 false로 설정한다.
					</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">method</td>
			<td>String</td>
			<td>
				HTTP 요청 방식으로 post, get, put, delete 방식을 지원한다.
				<ul>
					<li><strong>post</strong><br>
					post 방식으로 http 요청을 전달한다. 기본 값이다.</li>
					<li><strong>get</strong><br>
					get 방식으로 http 요청을 전달한다. type 속성이 "jsonp" 방식으로 지정되면 HTTP 요청 방식은 "get"으로 설정된다.</li>
					<li><strong>put</strong><br>
					put 방식으로 http 요청을 전달한다. 1.4.2 부터 사용 가능하다.</li>
					<li><strong>delete</strong><br>
					delete 방식으로 http 요청을 전달한다. 1.4.2 부터 사용 가능하다.</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">timeout</td>
			<td>Number</td>
			<td>
				요청 타임 아웃 시간(초 단위).<br>
				기본 값은 0으로 타임 아웃을 적용하지 않는다. 타임 아웃 시간 안에 요청이 완료되지 않으면 Ajax 요청을 중지한다. 비동기 호출인 경우에만 사용 가능하다.
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">onload</td>
			<td>Function</td>
			<td>
				요청이 완료되면 실행할 콜백 함수.<br>
				반드시 지정해야 하며 콜백 함수의 파라미터로 응답 객체인 {@link $Ajax.Response} 객체가 전달된다.
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">onerror</td>
			<td>Function</td>
			<td>
				요청이 실패하면 실행할 콜백 함수.<br>
				생략하면 오류가 발생해도 onload 속성에 지정한 콜백 함수를 실행한다.
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">ontimeout</td>
			<td>Function</td>
			<td>
				타임 아웃이 되었을 때 실행할 콜백 함수.<br>
				생략하면 타임 아웃 발생해도 아무런 처리를 하지 않는다.
			</td>
		</tr>
		<tr>
		<td style="font-weight:bold;">proxy</td>
			<td>String</td>
			<td>
				로컬 프록시 파일의 경로.<br>
				type 속성이 "iframe"일 때 사용하며 반드시 지정해야 한다.
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">jsonp_charset</td>
			<td>String</td>
			<td>
				요청 시 사용할 &lt;script&gt; 인코딩 방식.<br>
				type 속성이 "jsonp"일 때 사용한다. 생략하면 "utf-8"이 기본값이다(0.4.2 버전부터 지원).
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">callbackid</td>
			<td>String</td>
			<td>
				콜백 함수 이름에 사용할 ID.<br>
				type 속성이 "jsonp"일 때 사용한다(1.3.0 부터 지원). 생략하면 랜덤한 ID 값이 생성된다.<br>
				jsonp 방식에서 Ajax 요청할 때 콜백 함수 이름에 랜덤한 ID 값을 덧붙여 만든 콜백 함수 이름을 서버로 전달한다. 이때 랜덤한 값을 ID로 사용하여 넘기므로 요청 URL이 매번 새롭게 생성되어 캐쉬 서버가 아닌 서버로 직접 데이터를 요청하게 된다. 따라서 ID 값을 지정하면 랜덤한 아이디 값으로 콜백 함수 이름을 생성하지 않으므로 캐쉬 서버를 사용하여 그에 대한 히트율을 높이고자 할 때 ID를 지정하여 사용할 수 있다.
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">callbackname</td>
			<td>String</td>
			<td>
				콜백 함수 이름.<br>
				type 속성이 "jsonp"일 때 사용하며, 서버에 요청할 콜백 함수의 이름을 지정할 수 있다. 기본 값은 "_callback"이다(1.3.8 부터 지원).
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">sendheader</td>
			<td>Boolean</td>
			<td>
				요청 헤더를 전송할지 여부.<br>
				type 속성이 "flash"일 때 사용하며, 서버에서 접근 권한을 설정하는 crossdomain.xml에 allow-header가 없는 경우에 false 로 설정해야 한다.<br>
				플래시 9에서는 allow-header가 false인 경우 get 방식으로만 ajax 통신이 가능하다.<br>
				플래시 10에서는 allow-header가 false인 경우 get,post 둘다 ajax 통신이 안된다.<br>
				allow-header가 설정되어 있지 않다면 반드시 false로 설정해야 한다. 기본 값은 true 이다(1.3.4부터 지원). 
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">async</td>
			<td>Boolean</td>
			<td>
				비동기 호출 여부.<br>
				type 속성이 "xhr"일 때 이 속성 값이 유효하다. 기본 값은 true 이다(1.3.7부터 지원).
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">decode</td>
			<td>Boolean</td>
			<td>
				type 속성이 "flash"일 때 사용하며, 요청한 데이터 안에 utf-8 이 아닌 다른 인코딩이 되어 있을때 false 로 지정한다. 기본 값은 true 이다(1.4.0부터 지원). 
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">postBody</td>
			<td>Boolean</td>
			<td>
				Ajax 요청 시 서버로 전달할 데이터를 Body 요소에 전달할 지의 여부.<br>
				type 속성이 "xhr"이고 method가 "get"이 아니어야 유효하며 REST 환경에서 사용된다. 기본값은 false 이다(1.4.2부터 지원).
			</td>
		</tr>
	</tbody>
</table>

 * @see $Ajax.Response
 * @see <a href="http://dev.naver.com/projects/jindo/wiki/cross%20domain%20ajax">Cross Domain Ajax 이해</a>
 * @example
// 'Get List' 버튼 클릭 시, 서버에서 데이터를 받아와 리스트를 구성하는 예제
// (1) 서버 페이지와 서비스 페이지가 같은 도메인에 있는 경우 - xhr

// [client.html]
<!DOCTYPE html>
<html>
	<head>
		<title>Ajax Sample</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<script type="text/javascript" language="javascript" src="lib/jindo.all.js"></script>
		<script type="text/javascript" language="javascript">
			function getList() {
				var oAjax = new $Ajax('server.php', {
					type : 'xhr',
					method : 'get',			// GET 방식으로 통신
					onload : function(res){	// 요청이 완료되면 실행될 콜백 함수
						$('list').innerHTML = res.text();
					},
					timeout : 3,			// 3초 이내에 요청이 완료되지 않으면 ontimeout 실행 (생략 시 0)
					ontimeout : function(){	// 타임 아웃이 발생하면 실행될 콜백 함수, 생략 시 타임 아웃이 되면 아무 처리도 하지 않음
						alert("Timeout!");
					},
					async : true			// 비동기로 호출하는 경우, 생략하면 true
				});
				oAjax.request();
			}
		</script>
	</head>
	<body>
		<button onclick="getList(); return false;">Get List</button>

		<ul id="list">

		</ul>
	</body>
</html>

// [server.php]
<?php
	echo "<li>첫번째</li><li>두번째</li><li>세번째</li>";
?>

 * @example
// 'Get List' 버튼 클릭 시, 서버에서 데이터를 받아와 리스트를 구성하는 예제
// (2) 서버 페이지와 서비스 페이지가 같은 도메인에 있는 경우 - iframe

// [http://local.com/some/client.html]
<!DOCTYPE html>
<html>
	<head>
		<title>Ajax Sample</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<script type="text/javascript" language="javascript" src="lib/jindo.all.js"></script>
		<script type="text/javascript" language="javascript">
			function getList() {
				var oAjax = new $Ajax('http://server.com/some/some.php', {
					type : 'iframe',
					method : 'get',			// GET 방식으로 통신
											// POST로 지정하면 원격 프록시 파일에서 some.php 로 요청 시에 POST 방식으로 처리
					onload : function(res){	// 요청이 완료되면 실행될 콜백 함수
						$('list').innerHTML = res.text();
					},
					// 로컬 프록시 파일의 경로.
					// 반드시 정확한 경로를 지정해야 하며, 로컬 도메인의 경로라면 어디에 두어도 상관 없음
					// (※ 원격 프록시 파일은 반드시  원격 도메인 서버의 도메인 루트 상에 두어야 함)
					proxy : 'http://local.naver.com/some/ajax_local_callback.html'
				});
				oAjax.request();
			}

		</script>
	</head>
	<body>
		<button onclick="getList(); return false;">Get List</button>

		<ul id="list">

		</ul>
	</body>
</html>

// [http://server.com/some/some.php]
<?php
	echo "<li>첫번째</li><li>두번째</li><li>세번째</li>";
?>

 * @example
// 'Get List' 버튼 클릭 시, 서버에서 데이터를 받아와 리스트를 구성하는 예제
// (3) 서버 페이지와 서비스 페이지가 같은 도메인에 있는 경우 - jsonp

// [http://local.com/some/client.html]
<!DOCTYPE html>
<html>
	<head>
		<title>Ajax Sample</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<script type="text/javascript" language="javascript" src="lib/jindo.all.js"></script>
		<script type="text/javascript" language="javascript">
			function getList(){
				var oAjax = new $Ajax('http://server.com/some/some.php', {
					type: 'jsonp',
					method: 'get',			// type 이 jsonp 이면 get 으로 지정하지 않아도 자동으로 get 으로 처리함 (생략가능)
					jsonp_charset: 'utf-8',	// 요청 시 사용할 <script> 인코딩 방식 (생략 시 utf-8)
					onload: function(res){	// 요청이 완료되면 실행될 콜백 함수
						var response = res.json();
						var welList = $Element('list').empty();

						for (var i = 0, nLen = response.length; i < nLen; i++) {
							welList.append($("<li>" + response[i] + "</li>"));
						}
					},
					callbackid: '12345',				// 콜백 함수 이름에 사용할 아이디 값 (생략가능)
					callbackname: 'ajax_callback_fn'	// 서버에서 사용할 콜백 함수이름을 가지는 매개 변수 이름 (생략 시 '_callback')
				});
				oAjax.request();
			}
		</script>
	</head>
	<body>
		<button onclick="getList(); return false;">Get List</button>

		<ul id="list">

		</ul>
	</body>
</html>

// [http://server.com/some/some.php]
<?php
	$callbackName = $_GET['ajax_callback_fn'];
	echo $callbackName."(['첫번째','두번째','세번째'])";
?>

 * @example
// 'Get List' 버튼 클릭 시, 서버에서 데이터를 받아와 리스트를 구성하는 예제
// (4) 서버 페이지와 서비스 페이지가 같은 도메인에 있는 경우 - flash

// [http://local.com/some/client.html]
<!DOCTYPE html>
<html>
	<head>
		<title>Ajax Sample</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<script type="text/javascript" language="javascript" src="lib/jindo.all.js"></script>
		<script type="text/javascript" language="javascript">
			function getList(){
				var oAjax = new $Ajax('http://server.com/some/some.php', {
					type : 'flash',
					method : 'get',			// GET 방식으로 통신
					sendheader : false,		// 요청 헤더를 전송할지 여부. (생략 시 true)
					decode : true,			// 요청한 데이터 안에 utf-8 이 아닌 다른 인코딩이 되어 있을때 false. (생략 시 true)
					onload : function(res){	// 요청이 완료되면 실행될 콜백 함수
						$('list').innerHTML = res.text();
					},
				});
				oAjax.request();
			}
		</script>
	</head>
	<body>
		<script type="text/javascript">
			$Ajax.SWFRequest.write("swf/ajax.swf");	// Ajax 호출을 하기 전에 반드시 플래시 객체를 초기화
		</script>
		<button onclick="getList(); return false;">Get List</button>

		<ul id="list">

		</ul>
	</body>
</html>

// [http://server.com/some/some.php]
<?php
	echo "<li>첫번째</li><li>두번째</li><li>세번째</li>";
?>

<table>
	<caption>타입에 따른 옵션의 사용 가능 여부</caption>
	<thead>
		<th>옵션</th>
		<th>xhr</th>
		<th>jsonp</th>
		<th>flash</th>
		<th>iframe</th>
	</thead>
	<tbody>
		<tr>
			<td style="font-weight:bold;">method(get, post, put, delete)</td>
			<td>O</td>
			<td>get</td>
			<td>get, post</td>
			<td>iframe</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">onload</td>
			<td>O</td>
			<td>O</td>
			<td>O</td>
			<td>O</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">timeout</td>
			<td>O</td>
			<td>O</td>
			<td>O</td>
			<td>X</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">ontimeout</td>
			<td>O</td>
			<td>O</td>
			<td>O</td>
			<td>X</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">onerror</td>
			<td>O</td>
			<td>O</td>
			<td>O</td>
			<td>X</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">async</td>
			<td>O</td>
			<td>X</td>
			<td>X</td>
			<td>X</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">postBody</td>
			<td>method가 post, put, delete만 가능</td>
			<td>X</td>
			<td>X</td>
			<td>X</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">jsonp_charset</td>
			<td>X</td>
			<td>O</td>
			<td>X</td>
			<td>X</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">callbackid</td>
			<td>X</td>
			<td>O</td>
			<td>X</td>
			<td>X</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">callbackname</td>
			<td>X</td>
			<td>O</td>
			<td>X</td>
			<td>X</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">setheader</td>
			<td>O</td>
			<td>X</td>
			<td>O</td>
			<td>X</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">decode</td>
			<td>X</td>
			<td>X</td>
			<td>O</td>
			<td>X</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">proxy</td>
			<td>X</td>
			<td>X</td>
			<td>X</td>
			<td>O</td>
		</tr>
	</tbody>
</table>


<table>
	<caption>타입에 따른 메서드의 사용 가능 여부</caption>
	<thead>
		<th>메서드</th>
		<th>xhr</th>
		<th>jsonp</th>
		<th>flash</th>
		<th>iframe</th>
	</thead>
	<tbody>
		<tr>
			<td style="font-weight:bold;">abort</td>
			<td>O</td>
			<td>O</td>
			<td>O</td>
			<td>O</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">isIdle</td>
			<td>O</td>
			<td>O</td>
			<td>O</td>
			<td>O</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">option</td>
			<td>O</td>
			<td>O</td>
			<td>O</td>
			<td>O</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">request</td>
			<td>O</td>
			<td>O</td>
			<td>O</td>
			<td>O</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">header</td>
			<td>O</td>
			<td>X</td>
			<td>O</td>
			<td>O</td>
		</tr>
	</tbody>
</table>
	
 */
jindo.$Ajax = function (url, option) {
	var cl = arguments.callee;

	if (!(this instanceof cl)){
		try {
			jindo.$Jindo._warn(arguments.length, 2,"$Ajax");
			return new cl(url, option||{});
		} catch(e) {
			if (e instanceof TypeError) { return null; }
			throw e;
		}
	}	
	var ___ajax = jindo.$Ajax;
	var oArgs = jindo.$Jindo.checkVarType(arguments, {
		'4str' : [ 'sURL:String+' ],
		'4obj' : [ 'sURL:String+', 'oOption:Hash+' ]
	},"$Ajax");
		
	if(oArgs+"" == "for_string"){
		oArgs.oOption = {};
	}
	
	function _getXHR() {
		return new XMLHttpRequest();
	}

	var loc    = location.toString();
	var domain = '';
	try { domain = loc.match(/^https?:\/\/([a-z0-9_\-\.]+)/i)[1]; } catch(e) {}
	
	this._status = 0;
	this._url = oArgs.sURL;
	this._headers  = {};
	this._options = {
		type   :"xhr",
		method :"post",
		proxy  :"",
		timeout:0,
		onload :function(req){},
		onerror :null,
		ontimeout:function(req){},
		jsonp_charset : "utf-8",
		callbackid : "",
		callbackname : "",
		sendheader : true,
		async : true,
		decode :true,
		postBody :false
	};

	this._options = ___ajax._setProperties(oArgs.oOption,this);
	___ajax._validationOption(this._options,"$Ajax");
	
	/*
	 
테스트를 위해 우선 적용가능한 설정 객체가 존재하면 적용
	
	 */
	if(___ajax.CONFIG){
		this.option(___ajax.CONFIG);
	}	

	var _opt = this._options;

	_opt.type   = _opt.type.toLowerCase();
	_opt.method = _opt.method.toLowerCase();

	if (window.__jindo2_callback === undefined) {
		window.__jindo2_callback = [];
	}

	var t = this;
	switch (_opt.type) {
		case "put":
		case "delete":
		case "get":
		case "post":
			_opt.method = _opt.type;
		case "xhr":
			//-@@$Ajax.xhr-@@//
			this._request = _getXHR();
			break;
		case "jsonp":
			//-@@$Ajax.jsonp-@@//
			if(!___ajax.JSONPRequest) throw new jindo.$Error('jindo.$Ajax.JSONPRequest'+jindo.$Except.REQUIRE_AJAX, "$Ajax");
			this._request = new ___ajax.JSONPRequest( function(name,value){return t.option.apply(t, arguments);} );
			
	}
};
jindo.$Ajax._setProperties = function(option){
	option = option||{};
	var type;
	type = option.type = option.type||"xhr";
	option.onload = option.onload||function(){};
	option.method = option.method ||"post";
	if(type == "xhr"){
		option.async = option.async === undefined?true:option.async;
		option.postBody = option.postBody === undefined?false:option.postBody;
		option.sendheader = option.sendheader === undefined ? true : option.sendheader;
	}else if(type == "jsonp"){
		option.method = "get";
		option.jsonp_charset = option.jsonp_charset ||"utf-8";
		option.callbackid = option.callbackid ||"";
		option.callbackname = option.callbackname ||"";
	}
	return option;
};
jindo.$Ajax._validationOption = function(oOption,sMethod){
	var ___error = jindo.$Error;
	var ___except = jindo.$Except;
	var sType = oOption.type;
	if(sType === "jsonp"){
		if(oOption["method"] !== "get") throw new ___error(___except.CANNOT_USE_OPTION,sMethod);
	}else if(sType === "flash"){
		if(!(oOption["method"] === "get" || oOption["method"] === "post")) throw new ___error(___except.CANNOT_USE_OPTION,sMethod,sMethod);
	}
	
	if(oOption["postBody"]){
		if(!(sType === "xhr" && (oOption["method"]!=="get"))){
			throw new ___error(___except.CANNOT_USE_OPTION,sMethod);
		}
	}
	
	var oTypeProperty = {
			"xhr": "onload|timeout|ontimeout|onerror|async|method|postBody|sendheader|type" , 
			"jsonp": "onload|timeout|ontimeout|onerror|jsonp_charset|callbackid|callbackname|method|type"
	}
	var aName = [];
	var i = 0;
	for(aName[i++] in oOption){}
	var sProperty = oTypeProperty[sType];
	
	for(var i = 0 ,l = aName.length; i < l ; i++){
		if(sProperty.indexOf(aName[i]) == -1) throw new ___error(___except.CANNOT_USE_OPTION,sMethod);
	}
};
/**
 * @ignore
 */
jindo.$Ajax.prototype._onload = function(){
	var bSuccess = this._request.readyState == 4 && this._request.status == 200;
	var oResult;
	if (this._request.readyState == 4) {
		try {
	  		
			if (this._request.status != 200 && jindo.$Jindo.isFunction(this._options.onerror)){
				this._options.onerror(new jindo.$Ajax.Response(this._request));
			}else{
				oResult = this._options.onload(new jindo.$Ajax.Response(this._request));
			} 
		}finally{
			this._status--;
			if(jindo.$Jindo.isFunction(this._oncompleted)){
				this._oncompleted(bSuccess, oResult);
			} 
		}
	}
};


/**

 * @description request() 메서드는 Ajax 요청을 서버에 전송한다. 요청에 사용할 파라미터는 $Ajax() 객체 생성자에서 설정하거나 option() 메서드를 사용하여 변경할 수 있다. 요청 타입(type)이 "flash"면 이 메소드를 실행하기 전에 body 요소에서 {@link $Ajax.SWFRequest.write}() 메서드를 반드시 실행해야 한다.
 *
 * @param1 {Void}
 * @return1 {$Ajax} $Ajax() 객체.
 *
 * @param2 {String+} oData 서버로 전송할 데이터. (postbody가 true, type이 xhr, method가 get이 아닌 경우만 사용가능)
 * @return2 {$Ajax} $Ajax() 객체.
 *
 * @param3 {Hash+} oData 서버로 전송할 데이터.
 * @return3 {$Ajax} $Ajax() 객체.
 *
 * @see $Ajax#option
 * @see $Ajax.SWFRequest.write
 * @example
var ajax = $Ajax("http://www.remote.com", {
   onload : function(res) {
      // onload 핸들러
   }
});

ajax.request( {key1:"value1", key2:"value2"} );	// 서버에 전송할 데이터를 매개변수로 넘긴다.
ajax.request( );

 * @example
var ajax2 = $Ajax("http://www.remote.com", {
   type : "xhr",
   method : "post",
   postBody : true
 
});

ajax2.request({key1:"value1", key2:"value2"});
ajax2.request("{key1:\"value1\", key2:\"value2\"}");

	
 */
jindo.$Ajax.prototype.request = function(oData) {
	var ___jindo = jindo.$Jindo;
	var oArgs = ___jindo.checkVarType(arguments, {
		'4voi' : [ ],
		'4obj' : [ ___jindo._F('oData:Hash+') ],
		'4str' : [ 'sData:String+' ]
	},"$Ajax#request");
	
	this._status++;
	var t   = this;
	var req = this._request;
	var opt = this._options;
	var data, v,a = [], data = "";
	var _timer = null;
	var url = this._url;
	this._is_abort = false;
	var sUpType = opt.type.toUpperCase();
	var sUpMethod = opt.method.toUpperCase();
	if (opt.postBody && sUpType == "XHR" && sUpMethod != "GET") {
		if(oArgs+"" == "4str"){
			data = oArgs.sData;
		}else if(oArgs+"" == "4obj"){
			data = jindo.$Json(oArgs.oData).toString();	
		}else{
			data = null;
		}
	}else{
		switch(oArgs+""){
			case "4voi" : 
				data = null;
				break;
			case "4obj":
				var oData = oArgs.oData;
				for(var k in oData) {
					if(oData.hasOwnProperty(k)){
						v = oData[k];
						if (___jindo.isFunction(v)) v = v();
						
						if (___jindo.isArray(v) || (jindo.$A && v instanceof jindo.$A)) {
							if(v instanceof jindo.$A) v = v._array;
							
							for(var i=0; i < v.length; i++) {
								a[a.length] = k+"="+encodeURIComponent(v[i]);
							}
						} else {
							a[a.length] = k+"="+encodeURIComponent(v);
						}
					}
				}
				data = a.join("&");
		}
	}
	
	/*
	 
XHR GET 방식 요청인 경우 URL에 파라미터 추가
	
	 */
	if(data && sUpType=="XHR" && sUpMethod=="GET"){
		if(url.indexOf('?')==-1){
			url += "?";
		} else {
			url += "&";			
		}
		url += data;
		data = null;
	}

	if(sUpType=="XHR"&&opt.async){
		req.open(sUpMethod, url, opt.async);
	}else if(sUpType=="XHR"){
		req.open(sUpMethod, url, false);
	}else{
		req.open(sUpMethod, url);
	}
	if (opt.sendheader) {
		if(!this._headers["Content-Type"]){
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
		}
		req.setRequestHeader("charset", "utf-8");
		for (var x in this._headers) {
			if(this._headers.hasOwnProperty(x)){
				if (typeof this._headers[x] == "function") 
					continue;
				req.setRequestHeader(x, String(this._headers[x]));
			}
		}
	}
	if(req.addEventListener&&!_JINDO_IS_OP){
		/*
		 
 * opera 10.60에서 XMLHttpRequest에 addEventListener기 추가되었지만 정상적으로 동작하지 않아 opera는 무조건 dom1방식으로 지원함.
 * IE9에서도 opera와 같은 문제가 있음.
	
		 */
		if(this._loadFunc){ req.removeEventListener("load", this._loadFunc, false); }
		this._loadFunc = function(rq){ 
			clearTimeout(_timer);
			_timer = undefined; 
			t._onload(rq); 
		}
		req.addEventListener("load", this._loadFunc, false);
	}else{
		if (req.onload !== undefined) {
			req.onload = function(rq){
				if(req.readyState == 4 && !t._is_abort){
					clearTimeout(_timer); 
					_timer = undefined;
					t._onload(rq);
				}
			};
		} else {
            /*
            
 * IE6에서는 onreadystatechange가 동기적으로 실행되어 timeout이벤트가 발생안됨.
 * 그래서 interval로 체크하여 timeout이벤트가 정상적으로 발생되도록 수정. 비동기 방식일때만
	
             */
			req.onreadystatechange = function(rq){
				if(req.readyState == 4){
					clearTimeout(_timer); 
					_timer = undefined;
					t._onload(rq);
				}
			};
		}
	}
	if (opt.timeout > 0) {
		
//		if(this._interval)clearInterval(this._interval);
		if(this._timer) clearTimeout(this._timer);
		
		_timer = setTimeout(function(){
			t._is_abort = true;
			if(t._interval){
				clearInterval(t._interval);
				t._interval = undefined;
			}
			try{ req.abort(); }catch(e){};

			opt.ontimeout(req);	
			if(___jindo.isFunction(t._oncompleted)) t._oncompleted(false);
		}, opt.timeout * 1000 );
		this._timer = _timer;
	}
	/*
	
 * test을 하기 위한 url
	
	 */
	this._test_url = url;
	req.send(data);

	return this;
};

/**

 * @description isIdle() 메서드는 $Ajax() 객체가 현재 요청 대기 상태인지 확인한다.
 * @since 1.3.5
 * @return {Boolean} 현재 대기 중이면 true 를, 그렇지 않으면 false를 리턴한다.
 * @example
 var ajax = $Ajax("http://www.remote.com",{
     onload : function(res){
         // onload 핸들러
     }
});

if(ajax.isIdle()) ajax.request();
    
 */
jindo.$Ajax.prototype.isIdle = function(){
	return this._status==0;
};

/**

 * @description abort() 메서드는 서버로 전송한 Ajax 요청을 취소한다. Ajax 요청의 응답 시간이 길거나 강제로 Ajax 요청을 취소할 경우 사용한다.
 * @caution type이 jsonp일 경우 abort를 해도 요청을 멈추진 않는다.
 * @return {$Ajax} 전송을 취소한 $Ajax() 객체
 * @example
var ajax = $Ajax("http://www.remote.com", {
	timeout : 3,
	ontimeout : function() {
		stopRequest();
	}
	onload : function(res) {
		// onload 핸들러
	}
}).request( {key1:"value1", key2:"value2"} );

function stopRequest() {
    ajax.abort();
}
    
 */
jindo.$Ajax.prototype.abort = function() {
	try {
		if(this._interval) clearInterval(this._interval);
		if(this._timer) clearTimeout(this._timer);
		this._interval = undefined;
		this._timer = undefined;
		this._is_abort = true;
		this._request.abort();
	}finally{
		this._status--;
	}

	return this;
};

/**

 * @description url()메서드는 url을 변경하거나 반환한다.
 *
 * @param1 {Void}
 * @return1 {String} URL의 값.
 *
 * @param2 {String+} url
 * @return2 {$Ajax} $Ajax() 객체 자신.
 *
 * @since 2.0.0
	
 */
jindo.$Ajax.prototype.url = function(sURL){
	var oArgs = jindo.$Jindo.checkVarType(arguments, {
		'g' : [ ],
		's' : [ 'sURL:String+' ]
	},"$Ajax#url");
	
	switch(oArgs+"") {
		case 'g':
	    	return this._url;
		case 's':
	    	this._url = oArgs.sURL;
			return this;
			
	}
};
/**

 * @description option() 메서드는 $Ajax() 객체의 옵션 객체(oOption) 속성에 정의된 Ajax 요청 옵션에 대한 정보를 가져오거나 혹은 설정한다. Ajax 요청 옵션을 설정하려면 이름과 값을, 혹은 이름과 값을 원소로 가지는 하나의 객체를 파라미터로 입력한다. 이름과 값을 원소로 가지는 객체를 입력하면 하나 이상의 정보를 한 번에 설정할 수 있다.
 * @memberOf $Ajax#
 *
 * @param1 {String+} sName 옵션 객체의 속성 이름
 * @param1 {Variant} vValue 새로 설정할 옵션 속성의 값.
 * @return1 {$Ajax} $Ajax() 객체를 반환한다.
 *
 * @param2 {Hash+} oOption 속성 값이 정의된 객체.
 * @return2 {$Ajax} $Ajax() 객체를 반환한다.
 *
 * @param3 {String+} sName 옵션 객체의 속성 이름
 * @return3 {Variant} 해당 옵션에 해당하는 값.
 * 
 * @throws {jindo.$Except.CANNOT_USE_OPTION} 해당 타입에 적절한 옵션이 아닌 경우.
 * @example
var ajax = $Ajax("http://www.remote.com", {
	type : "xhr",
	method : "get",
	onload : function(res) {
		// onload 핸들러
	}
});

var request_type = ajax.option("type");					// type 인 xhr 을 리턴한다.
ajax.option("method", "post");							// method 를 post 로 설정한다.
ajax.option( { timeout : 0, onload : handler_func } );	// timeout 을 으로, onload 를 handler_func 로 설정한다.
    
 */

jindo.$Ajax.prototype.option = function(name, value) {
	var oArgs = jindo.$Jindo.checkVarType(arguments, {
		's4var' : [ 'sKey:String+', 'vValue:Variant' ],
		's4obj' : [ 'oOption:Hash+'],
		'g' : [ 'sKey:String+']
	},"$Ajax#option");
	
	switch(oArgs+"") {
		case "s4var":
			this._options[oArgs.sKey] = oArgs.vValue;
			break;
		case "s4obj":
			var oOption = oArgs.oOption;
			try {
				for (var x in oOption) {
					if (oOption.hasOwnProperty(x)) 
						this._options[x] = oOption[x];
				}
			}catch (e) {};
			break;
		case 'g':
			return this._options[oArgs.sKey];
			
	}
	
	jindo.$Ajax._validationOption(this._options,"$Ajax#option");
	return this;
};

/**

 * @description header() 메서드는 Ajax 요청에서 사용할 HTTP 요청 헤더를 가져오거나 설정한다. 헤더를 설정하려면 헤더의 이름과 값을 각각 파라미터로 입력하거나 헤더의 이름과 값을 원소로 가지는 객체를 파라미터로 입력한다. 객체를 파라미터로 입력하면 하나 이상의 헤더를 한 번에 설정할 수 있다. 헤더에서 특정 속성 값을 가져오려면 속성의 이름을 파라미터로 입력한다.
 * @memberOf $Ajax#
 *
 * @param1 {String+} sName 헤더 이름
 * @param1 {String+} sValue 설정할 헤더 값.
 * @return1 {$Ajax} $Ajax() 객체를 반환한다.
 *
 * @param2 {Hash+} oHeader 하나 이상의 헤더 값이 정의된 객체
 * @return2 {$Ajax}$Ajax() 객체를 반환한다.
 *
 * @param3 {String+} vName 헤더 이름
 * @return3 {String} 문자열을 반환한다.
 *
 * @throws {jindo.$Except.CANNOT_USE_OPTION} jsonp 타입일 경우 header메서드를 사용시 할 때.
 * @example
var customheader = ajax.header("myHeader"); 		// HTTP 요청 헤더에서 myHeader 의 값
ajax.header( "myHeader", "someValue" );				// HTTP 요청 헤더의 myHeader 를 someValue 로 설정한다.
ajax.header( { anotherHeader : "someValue2" } );	// HTTP 요청 헤더의 anotherHeader 를 someValue2 로 설정한다.
    
 */
jindo.$Ajax.prototype.header = function(name, value) {
	if(this._options["type"]==="jsonp"){throw new jindo.$Error(jindo.$Except.CANNOT_USE_OPTION,"$Ajax#header");} 
	
	var oArgs = jindo.$Jindo.checkVarType(arguments, {
		's4str' : [ 'sKey:String+', 'sValue:String+' ],
		's4obj' : [ 'oOption:Hash+' ],
		'g' : [ 'sKey:String+' ]
	},"$Ajax#option");
	
	switch(oArgs+"") {
		case 's4str':
			this._headers[oArgs.sKey] = oArgs.sValue;
			break;
		case 's4obj':
			var oOption = oArgs.oOption;
			try {
				for (var x in oOption) {
					if (oOption.hasOwnProperty(x)) 
						this._headers[x] = oOption[x];
				}
			}catch (e) {};
			break;
		case 'g':
			return this._headers[oArgs.sKey];
			
	}

	return this;
};

/**

 * @class $Ajax.Response 객체를 생성한다. $Ajax.Response 객체는 $Ajax() 객체에서 request() 메서드의 요청 처리 완료한 후 생성된다. $Ajax() 객체를 생성할 때 onload 속성에 설정한 콜백 함수의 파라미터로 $Ajax.Response 객체가 전달된다.
 * @constructor
 * @description Ajax 응답 객체를 래핑하여 응답 데이터를 가져오거나 활용하는데 유용한 기능을 제공한다.
 * @param {Hash+} oReq 요청 객체
 * @see $Ajax
    
 */
jindo.$Ajax.Response  = function(req) {
	this._response = req;
	this._regSheild = /^for\(;;\);/;
};

/**

 * @description xml() 메서드는 응답을 XML 객체로 반환한다. XHR의 responseXML 속성과 유사하다.
 * @return {Object} 응답 XML 객체. 
 * @see <a href="https://developer.mozilla.org/en/XMLHttpRequest">XMLHttpRequest</a> - MDN Docs
 * @example
// some.xml
<?xml version="1.0" encoding="utf-8"?>
<data>
	<li>첫번째</li>
	<li>두번째</li>
	<li>세번째</li>
</data>

// client.html
var oAjax = new $Ajax('some.xml', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		var elData = cssquery.getSingle('data', res.xml());	// 응답을 XML 객체로 리턴한다
		$('list').innerHTML = elData.firstChild.nodeValue;
	},
}).request();
    
 */
jindo.$Ajax.Response.prototype.xml = function() {
	return this._response.responseXML;
};

/**

 * @description text() 메서드는 응답을 문자열(String)로 반환한다. XHR의 responseText 와 유사하다.
 * @return {String} 응답 문자열. 
 * @see <a href="https://developer.mozilla.org/en/XMLHttpRequest">XMLHttpRequest</a> - MDN Docs
 * @example
// some.php
<?php
	echo "<li>첫번째</li><li>두번째</li><li>세번째</li>";
?>

// client.html
var oAjax = new $Ajax('some.xml', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		$('list').innerHTML = res.text();	// 응답을 문자열로 리턴한다
	},
}).request();
    
 */
jindo.$Ajax.Response.prototype.text = function() {
	return this._response.responseText.replace(this._regSheild, '');
};

/**

 * @description status() 메서드는 HTTP 응답 코드를 반환한다. HTTP 응답 코드표를 참고한다.
 * @return {Numeric} 응답 코드. 
 * @see <a href="http://www.w3.org/Protocols/HTTP/HTRESP.html">HTTP Status codes</a> - W3C
 * @example
var oAjax = new $Ajax('some.php', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		if(res.status() == 200){	// HTTP 응답 코드를 확인한다.
			$('list').innerHTML = res.text();
		}
	},
}).request();
    
 */
jindo.$Ajax.Response.prototype.status = function() {
	return this._response.status;
};

/**

 * @description readyState() 메서드는 응답 상태(readyState)를 반환한다. readyState 속성 값에 대한 설명은 다음 표와 같다.<br>
 <tabel>
	<caption>readyState 속성 설명</caption>
	<thead>
		<tr>
			<th>값</th>
			<th>설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>0(UNINITIALIZED)</td>
			<td>요청이 초기화되지 않은 상태.</td>
		</tr>
		<tr>
			<td>1(LOADING)</td>
			<td>요청 옵션을 설정했으나, 요청하지 않은 상태</td>
		</tr>
		<tr>
			<td>2(LOADED)</td>
			<td>요청을 보내고 처리 중인 상태. 이 상태에서 응답 헤더를 얻을 수 있다.</td>
		</tr>
		<tr>
			<td>3(INTERACTIVE)</td>
			<td>요청이 처리 중이며, 부분적인 응답 데이터를 받은 상태.</td>
		</tr>
		<tr>
			<td>4(COMPLETED)</td>
			<td>응답 데이터를 모두 받아 통신을 완료한 상태.</td>
		</tr>
	</tbody>
</table>
 * @return {Numeric}  readyState 값.
 * @see open
 * @see send
 * @example
var oAjax = new $Ajax('some.php', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		if(res.readyState() == 4){	// 응답의 readyState 를 확인한다.
			$('list').innerHTML = res.text();
		}
	},
}).request();
    
 */
jindo.$Ajax.Response.prototype.readyState = function() {
	return this._response.readyState;
};

/**

 * @description json() 메서드는 응답을 JSON 객체로 반환한다. 응답 문자열을 자동으로 JSON 객체로 변환하여 반환한다. 변환 과정에서 오류가 발생하면 빈 객체를 반환한다.
 * @return {Object} JSON 객체.
 * @throw {jindo.$Except.PARSE_ERROR} json파싱할 때 에러 발생한 경우.
 * @example
// some.php
<?php
	echo "['첫번째', '두번째', '세번째']";
?>

// client.html
var oAjax = new $Ajax('some.php', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		var welList = $Element('list').empty();
		var jsonData = res.json();	// 응답을 JSON 객체로 리턴한다

		for(var i = 0, nLen = jsonData.length; i < nLen; i++){
			welList.append($("<li>" + jsonData[i] + "</li>"));
		}
	},
}).request();
    
 */
jindo.$Ajax.Response.prototype.json = function() {
	if (this._response.responseJSON) {
		return this._response.responseJSON;
	} else if (this._response.responseText) {
		try {
			return eval("("+this.text()+")");
		} catch(e) {
			throw new jindo.$Error(jindo.$Except.PARSE_ERROR,"$Ajax#json");
		}
	}

	return {};
};

/**

 * @description header() 메서드는 응답 헤더를 가져온다. 파라미터를 입력하지 않으면 헤더 전체를 반환한다.
 * @memberOf $Ajax.Response#
 *
 * @param1 {Void}
 * @return1 {Object} 헤더 전체(Object)를 반환한다.
 *
 * @param2 {String+} sName 가져올 응답 헤더의 이름.
 * @return2 {String} 해당하는 헤더 값(String)
 *
 * @example
var oAjax = new $Ajax('some.php', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		res.header("Content-Length")	// 응답 헤더에서 "Content-Length" 의 값을 리턴한다.
	},
}).request();
    
 */
jindo.$Ajax.Response.prototype.header = function(name) {
	var oArgs = jindo.$Jindo.checkVarType(arguments, {
		'4str' : [ 'name:String+' ],
		'4voi' : [ ]
	},"$Ajax.Response#header");
	
	switch (oArgs+"") {
	case '4str':
		return this._response.getResponseHeader(name);
	case '4voi':
		return this._response.getAllResponseHeaders();
	}
};
return jindo;
})("Avatar");