//-!namespace.default start!-//
/**
{{title}}
 */
/**
 {{etc}}
 **/
jindo._p_._j_ag = navigator.userAgent;
jindo._p_._JINDO_IS_FF = jindo._p_._j_ag.indexOf("Firefox") > -1;  // Firefox
jindo._p_._JINDO_IS_OP = jindo._p_._j_ag.indexOf("Opera") > -1;  // Presto engine Opera
jindo._p_._JINDO_IS_SP = /Version\/[\d\.]+\s(Mobile\/[\d\w]+\s)?(?=Safari)/.test(jindo._p_._j_ag);  // Safari
jindo._p_._JINDO_IS_CH = /(Chrome|CriOS)\/[\d\.]+\s(Mobile(\/[\w\d]+)?\s)?Safari\/[\d\.]+(\s\([\w\d-]+\))?$/.test(jindo._p_._j_ag);  // Chrome
jindo._p_._JINDO_IS_WK = jindo._p_._j_ag.indexOf("WebKit") > -1;
jindo._p_._JINDO_IS_MO = /(iPhone|iPod|Mobile|Tizen|Android|Nokia|webOS|BlackBerry|Opera Mobi|Opera Mini)/.test(jindo._p_._j_ag);

jindo._p_.trim = function(str){
    var sBlank = "\\s|\\t|"+ String.fromCharCode(12288), re = new RegExp(["^(?:", ")+|(?:", ")+$"].join(sBlank), "g");
    return str.replace(re, "");
};
//-!namespace.default end!-//

//-!jindo.$Jindo.default start!-//
/**
{{jindo_desc}}
 */
/**
{{constructor}}
 */
jindo.$Jindo = function() {
	//-@@$Jindo.default-@@//
	var cl=arguments.callee;
	var cc=cl._cached;
	
	if (cc) return cc;
	if (!(this instanceof cl)) return new cl();
	if (!cc) cl._cached = this;
};

jindo._p_.addExtension = function(sClass,sMethod,fpFunction){
    // if(jindo[sClass]){
    if(jindo[sClass][sMethod]){
        jindo.$Jindo._warn(sClass+"."+sMethod+" was overwrite.");
    }else{
        if(/^x/.test(sMethod)){
            jindo[sClass][sMethod] = fpFunction;
        }else{
            jindo.$Jindo._warn("The Extension Method("+sClass+"."+sMethod+") must be used with x prefix."); 
        }
    }
};
/**
{{compatible}}
 */
jindo.$Jindo.compatible = function(){
	return false;
};

/**
{{mixin}}
 */
jindo.$Jindo.mixin = function(oDestination, oSource){
    g_checkVarType(arguments, {
       'obj' : [ 'oDestination:Hash+', 'oSource:Hash+' ]
    },"<static> $Jindo#mixin");
    
    var oReturn = {};
    
    for(var i in oDestination){
        oReturn[i] = oDestination[i];
    }
    
    for (i in oSource) if (oSource.hasOwnProperty(i)&&!jindo.$Jindo.isHash(oSource[i])) {
        oReturn[i] = oSource[i];
    }
    return oReturn;
};

jindo._p_._objToString = Object.prototype.toString;

jindo.$Error = function(sMessage,sMethod){
	this.message = "\tmethod : "+sMethod+"\n\tmessage : "+sMessage;
	this.type = "Jindo Custom Error";
	this.toString = function(){
		return this.message+"\n\t"+this.type;
	};
};

jindo.$Except = {
	CANNOT_USE_OPTION:"{{cannot_use_option}}",
	CANNOT_USE_HEADER:"{{cannot_use_header}}",
	PARSE_ERROR:"{{parse_error}}",
	NOT_FOUND_ARGUMENT:"{{not_found_argument}}",
	NOT_STANDARD_QUERY:"{{not_standard_query}}",
	INVALID_DATE:"{{invalid_date}}",
	REQUIRE_AJAX:"{{require_ajax}}",
	NOT_FOUND_ELEMENT:"{{not_found_element}}",
	HAS_FUNCTION_FOR_GROUP:"{{has_function_for_group}}",
	NONE_ELEMENT:"{{none_element}}",
	NOT_SUPPORT_SELECTOR:"{{not_support_selector}}",
	NOT_SUPPORT_CORS:"{{not_support_cors}}",
	NOT_SUPPORT_METHOD:"{{not_support_method}}",
	JSON_MUST_HAVE_ARRAY_HASH:"{{json_must_have_array_hash}}",
	MUST_APPEND_DOM : "{{must_append_dom}}",
	NOT_USE_CSS : "{{not_use_css}}",
	NOT_WORK_DOMREADY : "{{not_work_domready}}",
	CANNOT_SET_OBJ_PROPERTY : "{{cannot_set_obj_property}}",
	NOT_FOUND_HANDLEBARS : "{{not_found_handlebars}}"
};

/**
 * @ignore
 */
jindo._p_._toArray = function(aArray){
	return Array.prototype.slice.apply(aArray);
};

try{
	Array.prototype.slice.apply(document.documentElement.childNodes);
}catch(e){
	jindo._p_._toArray = function(aArray){
		var returnArray = [];
		var leng = aArray.length;
		for ( var i = 0; i < leng; i++ ) {
			returnArray.push( aArray[i] );
		}
		return returnArray;
	};
}
/**
{{is_function}}
 */

/**
{{is_array}}
 */

/**
{{is_string}}
 */

/**
{{is_numeric}}
 */
jindo.$Jindo.isNumeric = function(nNum){
	return !isNaN(parseFloat(nNum)) && !jindo.$Jindo.isArray(nNum) &&isFinite( nNum );
};
/**
{{is_boolean}}
 */
/**
{{is_date}}
 */
/**
{{is_regexp}}
 */
/**
{{is_element}}
 */
/**
{{is_document}}
 */
(function(){
	var oType = {"Element" : 1,"Document" : 9};
	for(var i in oType){
		jindo.$Jindo["is"+i] = (function(sType,nNodeNumber){
			return function(oObj){
				if(new RegExp(sType).test(jindo._p_._objToString.call(oObj))){
					return true;
				}else if(jindo._p_._objToString.call(oObj) == "[object Object]"&&oObj !== null&&oObj !== undefined&&oObj.nodeType==nNodeNumber){
					return true;
				}
				return false;
			};
		})(i,oType[i]);
	}
	var _$type = ["Function","Array","String","Boolean","Date","RegExp"]; 
	for(var i = 0, l = _$type.length; i < l ;i++){
		jindo.$Jindo["is"+_$type[i]] = (function(type){
			return function(oObj){
				return jindo._p_._objToString.call(oObj) == "[object "+type+"]";
			};
		})(_$type[i]);
	}
})();

/**
{{is_node}}
 */
jindo.$Jindo.isNode = function(eEle){
	try{
		return !!(eEle&&eEle.nodeType);
	}catch(e){
		return false;
	}
};

/**
{{is_hash}}
 */
jindo.$Jindo.isHash = function(oObj){
	return jindo._p_._objToString.call(oObj) == "[object Object]"&&oObj !== null&&oObj !== undefined&&!!!oObj.nodeType&&!jindo.$Jindo.isWindow(oObj);
};

/**
{{is_null}}
 */
jindo.$Jindo.isNull = function(oObj){
	return oObj === null;
};
/**
{{is_undefined}}
 */
jindo.$Jindo.isUndefined = function(oObj){
	return oObj === undefined;
};

/**
{{is_window}}
 */
jindo.$Jindo.isWindow = function(oObj){
    return oObj && (oObj == window.top || oObj == oObj.window);
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
{{check_var_type}}
 */
jindo.$Jindo._F = function(sKeyType) {
	return sKeyType;
};

jindo.$Jindo._warn = function(sMessage){
	window.console && ( (console.warn && console.warn(sMessage), true) || (console.log && console.log(sMessage), true) );
};

jindo.$Jindo._maxWarn = function(nCurrentLength, nMaxLength, sMessage) {
	if(nCurrentLength > nMaxLength) {
		jindo.$Jindo._warn('{{exceed_param_warning}} : '+sMessage);
	}
};
jindo.$Jindo.checkVarType = function(aArgs, oRules, sFuncName) {
	
	var sFuncName = sFuncName || aArgs.callee.name || 'anonymous';
	
	var $Jindo = jindo.$Jindo;
	var bCompat = $Jindo.compatible();
	
	var fpChecker = aArgs.callee['_checkVarType_' + bCompat];
	if (fpChecker) { return fpChecker(aArgs, oRules, sFuncName); }
	
	var aPrependCode = [];
	aPrependCode.push('var nArgsLen = aArgs.length;');
	aPrependCode.push('var $Jindo = '+jindo._p_.jindoName+'.$Jindo;');
	
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
			
			var sVarName = RegExp.$1,
			    sVarType = RegExp.$2,
			    bAutoCast = RegExp.$3 ? true : false;
			
			// if accept any type
			if (sVarType === 'Variant') {
				if (bCompat) {
					aBodyIfCode.push(i + ' in aArgs');
				}
				
				aBodyThenCode.push('oRet["' + sVarName + '"] = aArgs[' + i + '];');
				nTypeCount--;
				
			// user defined type only
			} else if ($Jindo._varTypeList[sVarType]) {
				var vVar = 'tmp' + sVarType + '_' + i;
				
				aBodyPrependCode.push('var ' + vVar + ' = $Jindo._varTypeList.' + sVarType + '(aArgs[' + i + '], ' + bAutoCast + ');');
				aBodyIfCode.push(vVar + ' !== '+jindo._p_.jindoName+'.$Jindo.VARTYPE_NOT_MATCHED');
				aBodyThenCode.push('oRet["' + sVarName + '"] = ' + vVar + ';');
				
			// Jiindo wrapped type
			} else if (/^\$/.test(sVarType) && jindo[sVarType]) {
				var sOR = '', sNativeVarType;
				
				if (bAutoCast) {
					sNativeVarType = ({ $Fn : 'Function', $S : 'String', $A : 'Array', $H : 'Hash', $ElementList : 'Array' })[sVarType] || sVarType.replace(/^\$/, '');
					if (jindo.$Jindo['is' + sNativeVarType]) {
						sOR = ' || $Jindo.is' + sNativeVarType + '(vNativeArg_' + i + ')';
					}
				}
				
				aBodyIfCode.push('(aArgs[' + i + '] instanceof '+jindo._p_.jindoName+'.' + sVarType + sOR + ')');
				aBodyThenCode.push('oRet["' + sVarName + '"] = '+jindo._p_.jindoName+'.' + sVarType + '(aArgs[' + i + ']);');
				
			// any native type
			} else if (jindo.$Jindo['is' + sVarType]) {
				var sOR = '', sWrapedVarType;
				
				if (bAutoCast) {
					sWrapedVarType = ({ 'Function' : '$Fn', 'String' : '$S', 'Array' : '$A', 'Hash' : '$H' })[sVarType] || '$' + sVarType;
					if (jindo[sWrapedVarType]) {
						sOR = ' || aArgs[' + i + '] instanceof '+jindo._p_.jindoName+'.' + sWrapedVarType;
					}
				}
				
				aBodyIfCode.push('($Jindo.is' + sVarType + '(aArgs[' + i + '])' + sOR + ')');
				aBodyThenCode.push('oRet["' + sVarName + '"] = vNativeArg_' + i + ';');
			
			// type which doesn't exist
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
	
	aPrependCode.push('	$Jindo._maxWarn(nArgsLen,'+nMaxRuleLen+',"'+sFuncName+'");');
	
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
var g_checkVarType = jindo.$Jindo.checkVarType;
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
		
		var aMsg = [ '{{invalid_param_message}}', '' ];
		
		if (sUsed) {
			aMsg.push('{{invalid_param_called}} :');
			aMsg.push('\t' + sUsed);
			aMsg.push('');
		}
		
		if (aSuggs.length) {
			aMsg.push('{{invalid_param_suggest}} :');
			for (var i = 0, nLen = aSuggs.length; i < nLen; i++) {
				aMsg.push('\t' + aSuggs[i]);
			}
			aMsg.push('');
		}
		
		if (sURL) {
			aMsg.push('{{invalid_param_manual}} :');
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
	
	if (/(\$\w+)#(\w+)?/.test(sFuncName)) {
        sURL = '@docurl@' + encodeURIComponent(RegExp.$1) + '.html' + "#method_"+RegExp.$2;
    }

	throw new TypeError(fpErrorMessage(sUsed, aSuggs, sURL));

};

/**
{{var_type}}
 */
/**
{{var_type2}}
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
		var oTypeLists = oArgs.oTypeLists, fpFunc;
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
{{var_type_not_matched}}
 */
jindo.$Jindo.VARTYPE_NOT_MATCHED = {};

(function() {
	
	var oVarTypeList = jindo.$Jindo._varTypeList = {};
	var cache = jindo.$Jindo;
	var ___notMatched = cache.VARTYPE_NOT_MATCHED;
	oVarTypeList['Numeric'] = function(v) {
		if (cache.isNumeric(v)) { return v * 1; }
		return ___notMatched;
	};

	oVarTypeList['Hash'] = function(val, bAutoCast){
		if (bAutoCast && jindo.$H && val instanceof jindo.$H) {
			return val.$value();
		} else if (cache.isHash(val)) {
			return val;
		}
		return ___notMatched;
	};
	
	oVarTypeList['$Class'] = function(val, bAutoCast){
		if ((!cache.isFunction(val))||!val.extend) {
			return ___notMatched;
		}
		return val;
	};
	
	var aDenyTypeList = [];
	
	for (var sTypeName in cache) if (cache.hasOwnProperty(sTypeName)) {
		if (/^is(.+)$/.test(sTypeName)) { aDenyTypeList.push(RegExp.$1); }
	}
	
	cache._denyTypeListComma = aDenyTypeList.join(',');
	
	cache.varType("ArrayStyle",function(val, bAutoCast){
		if(!val) { return ___notMatched; }
		if (  
		    /(Arguments|NodeList|HTMLCollection|global|Window)/.test(jindo._p_._objToString.call(val)) ||
			/Object/.test(jindo._p_._objToString.call(val))&&cache.isNumeric(val.length)) {
			return jindo._p_._toArray(val);
		}
		return ___notMatched;
	});
	
	cache.varType("Form",function(val, bAutoCast){
		if(!val) { return ___notMatched; }
		if(bAutoCast&&val.$value){
			val = val.$value();
		}
		if (val.tagName&&val.tagName.toUpperCase()=="FORM") {
			return val;
		}
		return ___notMatched;
	});
})();

jindo._p_._createEle = function(sParentTag,sHTML,oDoc,bWantParent){
    //-@@jindo._p_._createEle.hidden-@@//
    var sId = 'R' + new Date().getTime() + parseInt(Math.random() * 100000,10);

    var oDummy = oDoc.createElement("div");
    switch (sParentTag) {
        case 'select':
        case 'table':
        case 'dl':
        case 'ul':
        case 'fieldset':
        case 'audio':
            oDummy.innerHTML = '<' + sParentTag + ' class="' + sId + '">' + sHTML + '</' + sParentTag + '>';
            break;
        case 'thead':
        case 'tbody':
        case 'col':
            oDummy.innerHTML = '<table><' + sParentTag + ' class="' + sId + '">' + sHTML + '</' + sParentTag + '></table>';
            break;
        case 'tr':
            oDummy.innerHTML = '<table><tbody><tr class="' + sId + '">' + sHTML + '</tr></tbody></table>';
            break;
        default:
            oDummy.innerHTML = '<div class="' + sId + '">' + sHTML + '</div>';
    }
    var oFound;
    for (oFound = oDummy.firstChild; oFound; oFound = oFound.firstChild){
        if (oFound.className==sId) break;
    }
    
    return bWantParent? oFound : oFound.childNodes;
};

//-!jindo.$Jindo.default end!-//

//-!jindo.$ start!-//
/** 
{{sign_}}
 */
/** 
{{sign2_}}
 */
jindo.$ = function(sID/*, id1, id2*/) {
	//-@@$-@@//
	if(!arguments.length) throw new jindo.$Error(jindo.$Except.NOT_FOUND_ARGUMENT,"$");
	
	var ret = [], arg = arguments, nArgLeng = arg.length, lastArgument = arg[nArgLeng-1],doc = document,el  = null;
	var reg = /^<([a-z]+|h[1-5])>$/i;
	var reg2 = /^<([a-z]+|h[1-5])(\s+[^>]+)?>/i;
	if (nArgLeng > 1 && typeof lastArgument != "string" && lastArgument.body) {
        /*
         {{sign__1}}
         */
		arg = Array.prototype.slice.apply(arg,[0,nArgLeng-1]);
		doc = lastArgument;
	}

	for(var i=0; i < nArgLeng; i++) {
		el = arg[i] && arg[i].$value ? arg[i].$value() : arg[i];
		if (jindo.$Jindo.isString(el)||jindo.$Jindo.isNumeric(el)) {
			el += "";
			el = el.replace(/^\s+|\s+$/g, "");
			el = el.replace(/<!--(.|\n)*?-->/g, "");
			
			if (el.indexOf("<")>-1) {
				if(reg.test(el)) {
					el = doc.createElement(RegExp.$1);
				} else if (reg2.test(el)) {
					var p = { thead:'table', tbody:'table', tr:'tbody', td:'tr', dt:'dl', dd:'dl', li:'ul', legend:'fieldset',option:"select" ,source:"audio"};
					var tag = RegExp.$1.toLowerCase();
					var ele = jindo._p_._createEle(p[tag],el,doc);

					for (var i=0,leng = ele.length; i < leng ; i++) {
						ret.push(ele[i]);
					}

					el = null;
				}
			}else {
				el = doc.getElementById(el);
			}
		}
		if (el&&el.nodeType) ret[ret.length] = el;
	}
	return ret.length>1?ret:(ret[0] || null);
};
//-!jindo.$ end!-//

//-!jindo.$Class start!-//
/**
{{class_desc}}
 */
/**
{{class}}
 */
jindo.$Class = function(oDef) {
	//-@@$Class-@@//
    var oArgs = g_checkVarType(arguments, {
        '4obj' : [ 'oDef:Hash+' ]
    },"$Class");
	
	function typeClass() {
		var t = this;
		var a = [];
						
		var superFunc = function(m, superClass, func) {
			if(m!='constructor' && func.toString().indexOf("$super")>-1 ) {
				var funcArg = func.toString().replace(/function\s*\(([^\)]*)[\w\W]*/g,"$1").split(",");
				var funcStr = func.toString().replace(/function[^{]*{/,"").replace(/(\w|\.?)(this\.\$super|this)/g,function(m,m2,m3) {
                        if(!m2) { return m3+".$super"; }
                        return m;
                });
				funcStr = funcStr.substr(0,funcStr.length-1);
				func = superClass[m] = eval("false||function("+funcArg.join(",")+"){"+funcStr+"}");
			}
		
			return function() {
				var f = this.$this[m];
				var t = this.$this;
				var r = (t[m] = func).apply(t, arguments);
				t[m] = f;
	
				return r;
			};
		};
		
		while(t._$superClass !== undefined) {
			t.$super = new Object;
			t.$super.$this = this;
					
			for(var x in t._$superClass.prototype) {
				
				if (t._$superClass.prototype.hasOwnProperty(x)){
					if (this[x] === undefined && x !="$init") this[x] = t._$superClass.prototype[x];
					if (x!='constructor' && x!='_$superClass' && typeof t._$superClass.prototype[x] == "function") {
						t.$super[x] = superFunc(x, t._$superClass, t._$superClass.prototype[x]);
					} else {
						
						t.$super[x] = t._$superClass.prototype[x];
					}
				}
			}			
			
			if (typeof t.$super.$init == "function") a[a.length] = t;
			t = t.$super;
		}
				
		for(var i=a.length-1; i > -1; i--){
			a[i].$super.$init.apply(a[i].$super, arguments);
		}

        if(this.$autoBind) {
            for(var i in this){
                if(/^\_/.test(i) && typeof this[i] == "function") {
                    this[i] = jindo.$Fn(this[i],this).bind();
                }
            }
        }

		if(typeof this.$init == "function") this.$init.apply(this,arguments);
	}
	
	if (oDef.$static !== undefined) {
		var i=0, x;
		for(x in oDef){
			if (oDef.hasOwnProperty(x)) {
				x=="$static"||i++;
			}
		} 
		for(x in oDef.$static){
			if (oDef.$static.hasOwnProperty(x)) {
				typeClass[x] = oDef.$static[x];
			}
		} 

		if (!i) return oDef.$static;
		delete oDef.$static;
	}
	
	typeClass.prototype = oDef;
	typeClass.prototype.constructor = typeClass;
	typeClass.prototype.kindOf = function(oClass){
		return jindo._p_._kindOf(this.constructor.prototype, oClass.prototype);
	};	
	typeClass.extend = jindo.$Class.extend;

	return typeClass;
};
 
/**
{{kindOf}}
 */
jindo._p_._kindOf = function(oThis, oClass){
	if(oThis != oClass){
		if(oThis._$superClass){
			return jindo._p_._kindOf(oThis._$superClass.prototype,oClass);
		} else {
			return false;
		}
	} else {
		return true;
	}
};
 /**
{{extend}}
 */
jindo.$Class.extend = function(superClass) { 
    var oArgs = g_checkVarType(arguments, {
        '4obj' : [ 'oDef:$Class' ]
    },"<static> $Class#extend");
	
	this.prototype._$superClass = superClass;
	
	var superProto = superClass.prototype;
	for(var prop in superProto){
	    if(jindo.$Jindo.isHash(superProto[prop])) jindo.$Jindo._warn(jindo.$Except.CANNOT_SET_OBJ_PROPERTY);
	}
	// inherit static methods of parent
	for(var x in superClass) {
		if (superClass.hasOwnProperty(x)) {
			if (x == "prototype") continue;
			this[x] = superClass[x];
		}
	}
	return this;
};
/**
{{super_}}
*/
//-!jindo.$Class end!-//

/**
{{jindo_info}}
*/
jindo.VERSION = "@version@";
jindo.TYPE = "@type@";