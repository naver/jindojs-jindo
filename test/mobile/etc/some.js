var jindoName = "jindo";
var jindo = {};
if(window[jindoName]){
    var __old_jindo = window[jindoName];
    for(var i in __old_jindo){
        jindo[i] = __old_jindo[i];
    }
}
window[jindoName] = jindo;
    //하단에 스크립트 삽입됨.
    
//-!namespace.default start!-//
/**
{{title}}
 */
// if (typeof window != 'undefined' && window.nhn === undefined) {
    // window.nhn = {};
// }
// 
// if (typeof window != 'undefined') {
    // if (window.jindo === undefined) {
        // window.jindo = {};
    // }
// } else {
    // if (!jindo) {
        // var jindo = {};
    // }
// }

/**
 {{etc}}
 **/
var _j_ag = navigator.userAgent;
var _JINDO_IS_FF = _j_ag.indexOf("Firefox") > -1;
var _JINDO_IS_OP = _j_ag.indexOf("Opera") > -1;
var _JINDO_IS_SP = _j_ag.indexOf("Safari") > -1;
var _JINDO_IS_SF = _j_ag.indexOf("Apple") > -1;
var _JINDO_IS_CH = _j_ag.indexOf("Chrome") > -1;
var _JINDO_IS_WK = _j_ag.indexOf("WebKit") > -1;
var _JINDO_IS_MO = /(iPad|Mobile|Android|Nokia|webOS|BlackBerry|Opera Mini)/.test(_j_ag);
var tNumeric = "Numeric+";
var tElement = "Element+";
var tDocument = "Document+";
var tFunction = "Function+";
var tArray = "Array+";
var tString = "String+";
var tBoolean = "Boolean+";
var tDate = "Date+";
var tRegExp = "RegExp+";
var tNode = "Node+";
var tHash = "Hash+";
var tNull = "Null+";
var tUndefined = "Undefined+";
var tWindow = "Window+";
var t$Class = "$Class";
var tArrayStyle = "ArrayStyle+";
var tForm = "Form+";
var tVariant = "Variant";
function trim(str){
    return str.replace(/^(\s|　)+/g, "").replace(/(\s|　)+$/g, "");
}
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
    
    this.version = "@version@";
};
jindo.$Jindo.VERSION = "@version@";

function addExtension(sClass,sMethod,fpFunction){
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
    // }else{
        // throw jindo.$Error("addExtension","Not found "+sClass+"class");
    // }
}
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
       'obj' : [ 'oDestination:'+tHash, 'oSource:'+tHash ]
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
    return _objToString.call(oObj) == "[object Object]"&&oObj !== null&&oObj !== undefined&&!!!oObj.nodeType&&!jindo.$Jindo.isWindow(oObj);
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
}

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
    aPrependCode.push('var $Jindo = '+jindoName+'.$Jindo;');
    
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
                aBodyIfCode.push(vVar + ' !== '+jindoName+'.$Jindo.VARTYPE_NOT_MATCHED');
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
                
                aBodyIfCode.push('(aArgs[' + i + '] instanceof '+jindoName+'.' + sVarType + sOR + ')');
                aBodyThenCode.push('oRet["' + sVarName + '"] = '+jindoName+'.' + sVarType + '(aArgs[' + i + ']);');
                
            // 기타 Native 타입이면
            } else if (jindo.$Jindo['is' + sVarType]) {

                var sOR = '';
                var sWrapedVarType;
                
                if (bAutoCast) {
                    sWrapedVarType = ({ 'Function' : '$Fn', 'String' : '$S', 'Array' : '$A', 'Hash' : '$H' })[sVarType] || '$' + sVarType;
                    if (jindo[sWrapedVarType]) {
                        sOR = ' || aArgs[' + i + '] instanceof '+jindoName+'.' + sWrapedVarType;
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
            aBodyThenCode.push('    nMaxMatchScore = nMatchScore;');
            aBodyThenCode.push('    oFinalRet = oRet;');
            aBodyThenCode.push('}');
        } else {
            aBodyThenCode.push('return oRet;');
        }
        
        aBodyCode.push(aBodyPrependCode.join('\n'));
        
        if (aBodyIfCode.length) { aBodyCode.push('if (' + aBodyIfCode.join(' && ') + ') {'); }
        aBodyCode.push(aBodyThenCode.join('\n'));
        if (aBodyIfCode.length) { aBodyCode.push('}'); }
        
    }
    
    aPrependCode.push(' $Jindo._maxWarn(nArgsLen,'+nMaxRuleLen+',"'+sFuncName+'");');
    
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
    
//     
    // if (/(\$\w+)(#\w+)?/.test(sFuncName)) {
        // sURL = '@docurl@' + encodeURIComponent(RegExp.$1) + '.html' + RegExp.$2;
    // }
    
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
        's4str' : [ 'sTypeName:'+tString, 'fpFunc:'+tFunction ],
        's4obj' : [ 'oTypeLists:'+tHash ],
        'g' : [ 'sTypeName:'+tString ]
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
{{var_type_not_matched}}
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
//  ___jindo.varType("FormId",function(val, bAutoCast){
//      if(___jindo.isString(val)){
//          val = jindo.$(val);
//          if (val.tagName&&val.tagName.toUpperCase()=="FORM") {
//              return val;
//          }
//      }
//      return ___notMatched;
//  });
    
//  ___jindo.varType("PrimativeStyle",function(val, bAutoCast){
//      if(
//      ___jindo.isNumeric(val) ||
//      ___jindo.isString(val) ||
//      ___jindo.isBoolean(val)
//      ){
//          return val;
//      }
//      return ___notMatched;
//      
//  });
    
})();

function _createEle(sParentTag,sHTML,oDoc,bWantParent){
    //-@@_createEle.hidden-@@//
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
                if (reg.test(el)) {
                    el = doc.createElement(RegExp.$1);
                }else if (reg2.test(el)) {
                    var p = { thead:'table', tbody:'table', tr:'tbody', td:'tr', dt:'dl', dd:'dl', li:'ul', legend:'fieldset',option:"select" ,source:"audio"};
                    var tag = RegExp.$1.toLowerCase();
                        
                    var ele = _createEle(p[tag],el,doc);
                    for (var i=0,leng = ele.length; i < leng ; i++) {
                        ret.push(ele[i]);
                    };
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
        '4obj' : [ 'oDef:'+tHash ]
    },""+t$Class);
    
    function typeClass() {
        var t = this;
        var a = [];
                        
        var superFunc = function(m, superClass, func) {
    
            if(m!='constructor' && func.toString().indexOf("$super")>-1 ){      
                
                var funcArg = func.toString().replace(/function\s*\(([^\)]*)[\w\W]*/g,"$1").split(",");
                // var funcStr = func.toString().replace(/function\s*\(.*\)\s*\{/,"").replace(/this\.\$super/g,"this.$super.$super");
                var funcStr = func.toString().replace(/function[^{]*{/,"").replace(/(\w|\.?)(this\.\$super|this)/g,function(m,m2,m3){
                           if(!m2){
                                return m3+".$super"
                           }
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
        }
        
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
        if(this.$autoBind){
            for(var i in this){
                if(/^\_/.test(i)){
                    this[i] = jindo.$Fn(this[i],this).bind();
                }
            }
        }

        if (typeof this.$init == "function") this.$init.apply(this,arguments);
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
    
    // if (typeof oDef.$destroy == 'undefined') {
    //  oDef.$destroy = function(){
    //      if(this.$super&&(arguments.callee==this.$super.$destroy)){this.$super.$destroy();}
    //  }
    // } else {
    //  oDef.$destroy = eval("false||"+oDef.$destroy.toString().replace(/\}$/,"console.log(this.$super);console.log(arguments.callee!=this.$super.$destroy);if(this.$super&&(arguments.callee==this.$destroy)){this.$super.$destroy();}}"));
    // }
    // 
    typeClass.prototype = oDef;
    typeClass.prototype.constructor = typeClass;
    typeClass.prototype.kindOf = function(oClass){
        return _kindOf(this.constructor.prototype, oClass.prototype);
    };  
    typeClass.extend = jindo.$Class.extend;

    return typeClass;
};
 
/**
{{kindOf}}
 */
function _kindOf(oThis, oClass){
    if(oThis != oClass){
        if(oThis._$superClass){
            return _kindOf(oThis._$superClass.prototype,oClass);
        }else{
            return false;
        }
    }else{
        return true;
    }
}
 /**
{{extend}}
 */
jindo.$Class.extend = function(superClass) { 
    var oArgs = g_checkVarType(arguments, {
        '4obj' : [ 'oDef:'+t$Class ]
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
 {{title}}
 */
//-!jindo.cssquery start!-//
/**
 {{desc}}
 */
/**
 {{cssquery}}
 */
jindo.$$ = jindo.cssquery = (function(){
    var cssquery;
    this._dummyWrap;
    
    function createDummy(){
        var elDummyWrap = cssquery._dummyWrap;
        if(!elDummyWrap){
            cssquery._dummyWrap = elDummyWrap = document.createElement('div');
            elDummyWrap.id = "__jindo_cssquery_mockdiv";
            elDummyWrap.style.cssText = 'display:none !important;';
            elDummyWrap.className = 'This element is for jindo.$$.test';
            document.body.insertBefore(elDummyWrap, document.body.firstChild);
        }
        cssquery._dummyWrap = elDummyWrap;
    }
    
//  function isSupported(oDoc,sType){
//      if(!cssquery._dummyWrap){
//          createDummy();
//      }
//      cssquery._dummyWrap.innerHTML = "<input type='checkbox' checked='checked'/>"+
////        "<select><option selected='selected'>option1</option></select>"+
//      "<input type='hidden' value='a'/>"+
//      "<input type='hidden' value='a' disabled='true'/>",
//      "<div>jindo</div>";
//      var returnVal =  {}
//      returnVal[":checked"] = !!oDoc.querySelectorAll("#__jindo_cssquery_mockdiv input:checked").length;
////        returnVal["selected"] = !!oDoc.querySelectorAll("#__jindo_cssquery_mockdiv option:selected").length;
//      returnVal[":enabled"] = !!oDoc.querySelectorAll("#__jindo_cssquery_mockdiv input:enabled").length;
//      returnVal[":disabled"] = !!oDoc.querySelectorAll("#__jindo_cssquery_mockdiv input:disabled").length;
////        returnVal["contains"] = !!oDoc.querySelectorAll("#__jindo_cssquery_mockdiv div:contains(jindo)").length;
//      isSupported = function(oDoc,sType){
//          return returnVal[sType];
//      }
//      return returnVal[sType];
//      
//  }

    function _isNonStandardQueryButNotException(sQuery){
        return /\[\s*(?:checked|selected|disabled)/.test(sQuery);
    }
    
    /**
    {{_commaRevise}}
    **/
    function _commaRevise(sQuery, sChange){
        return sQuery.replace(/\,/gi, sChange);
    }
    
    function _startCombinator(sQuery){
        return /^[~>+]/.test(sQuery);
    }
    
    /**
    {{_trim}}
    **/
    function _trim(str){
        return str.replace(/^\s+|\s+$/g, "");
    }
    
    /**
    {{_getParentElement}}
    **/
    function _getParentElement(oParent){
        var nParentNodeType;
        
        oParent = oParent && oParent.$value ? oParent.$value() : oParent;
        
        if(jindo.$Jindo.isString(oParent)){
            oParent = document.getElementById(oParent);
        }
        
        if(!oParent){
            oParent = document;
        }
        
        nParentNodeType = oParent.nodeType;
        
        if(nParentNodeType != 1 && nParentNodeType != 9 && nParentNodeType != 10 && nParentNodeType != 11){
            oParent = oParent.ownerDocument || oParent.document;
        }
        
        return oParent || oParent.ownerDocument || oParent.document;
    }
    
    /**
        {{_cssquery4Excl}}
    **/
    function _cssquery4Excl(sQuery, elParent, oOptions){
        sQuery = _trim(sQuery);
        
        var aResult = [],
            aQuery = sQuery.split(/,[ ]*/g),
            nLength = aQuery.length,
            i;
        
        for(i = 0; i < nLength; i++){
            aResult = aResult.concat(_processSingleQuery(aQuery[i], elParent, oOptions));
        }
        
        return distinct(aResult);
        //return aResult;
    }
    
    /**
    {{_processSingleQuery}}
    **/
    function _processSingleQuery(sQuery, elParent, oOptions){
        var aResult = [],
            aQuery = _splitQueryToObject(sQuery),
            nLength = aQuery.length,
            i;
        
        for(i = 0; i < nLength; i++){
            aResult = _getMatchedElement(aQuery[i], elParent, oOptions, aResult);
        }
        
        return aResult;
    }
    
    /**
    {{_splitQueryToObject}}
    **/
    function _splitQueryToObject(sQuery){
        var aQuery = [],
            count = 0,
            sRightSelector;
        
        sQuery = sQuery.replace(/(.*?)\s*(![>+~]?)\s*/g, function(sWhole, sLeftQuery, sCombinator){
            var oPrev = aQuery[count - 1];
            aQuery[count] = {
                sLeftQuery : sLeftQuery,
                sRightSelector : null,
                sCombinator : sCombinator
            }
            
            if(oPrev){
                oPrev.sRightSelector = _getFirstSelector(sLeftQuery);
            }
            
            count++;
            
            return "";
        });
        aQuery[count - 1].sRightSelector = sRightSelector = _getFirstSelector(sQuery);
        
        /*
        {{_splitQueryToObject_1}}
        */
        if(sRightSelector != sQuery){
            aQuery[count] = {
                sLeftQuery : sQuery,
                sRightSelector : null,
                sCombinator : null
            }
        }
        
        return aQuery;
    }
    
    /**
    {{_getFirstSelector}}
    **/
    function _getFirstSelector(sQuery){
        return sQuery.split(/\s*[+>~ ]\s*/)[0];
    }
    
    /**
    {{_removeFirstSelector}}
    **/
    function _removeFirstSelector(sQuery){
        return sQuery.replace(/(.*?)\s*([+>~ ])\s*/, function(sWhole, sSelector, sCombinator){
            return sCombinator + " ";
        });
    }
    
    /**
    {{_getMatchedElement}}
    **/
    function _getMatchedElement(oQuery, elParent, oOptions, aResult){
        var sCombinator = oQuery.sCombinator,
            bIsParentSearch = sCombinator == "!" || sCombinator == "!>",
            aThisResult,
            aRightEl,
            aLeftEl;
        
        aLeftEl = _getLeftElementForExcl(oQuery, elParent, aResult);
        
        /*
        {{_getMatchedElement_1}}
        */
        if(aResult && aResult.length > 0 && oQuery.sRightSelector == null){
            return aLeftEl;
        }
        
        if(bIsParentSearch){
            aThisResult = _getParentElementIncludesChildForExcl(aLeftEl, oQuery, oOptions, elParent);
        }else{
            aThisResult = _getPreviousSiblingElementForExcl(aLeftEl, oQuery, oOptions, elParent);
        }
        
        return aThisResult;
    }
    
    /**
    {{_getPreviousSiblingElementForExcl}}
    **/
    function _getPreviousSiblingElementForExcl(aLeftEl, oQuery, oOptions, elBaseParent){
        var i,
            j,
            elLeft,
            elSibling,
            elPreviousSibling,
            elParent,
            elAncestor,
            nLeftElLength = aLeftEl.length,
            bIsDirectPreviousSibling = oQuery.sCombinator == "!+",
            bIsBreak = false,
            sQuery = "",
            sSearchSelectorId = "searchid",
            aParent = [],
            aMatched = [],
            nMatchedLength,
            aSibling = [],
            nSiblingLength,
            aThisResult = [];
        
        for(i = 0; i < nLeftElLength; i++){
            elLeft = aLeftEl[i];
            elParent = elLeft.parentNode;
            elPreviousSibling = elLeft.previousElementSibling;
            
            if(!elParent || !(elAncestor = elParent.parentNode) || !elPreviousSibling){
                continue;
            }
            
            aParent.push(elParent);
            
            sQuery += _addQueryId(elParent, sSearchSelectorId) + " > " + oQuery.sRightSelector + ", ";
            
            while(elPreviousSibling){
                aSibling.push(elPreviousSibling);
                
                if(bIsDirectPreviousSibling){
                    break;
                }
                
                elPreviousSibling = elPreviousSibling.previousElementSibling;
            }
        }
        
        if(sQuery != ""){
            sQuery = sQuery.substr(0, sQuery.length - 2);
            aMatched = _toArray(elBaseParent.querySelectorAll(sQuery));
            _removeQueryIdToArray(aParent, sSearchSelectorId);
        }
        
        nSiblingLength = aSibling.length;
        nMatchedLength = aMatched.length;
        
        if(nMatchedLength > -1){
            
            for(i = 0 ; i < nSiblingLength; i++){
                elSibling = aSibling[i];
                
                for(j = 0; j < nMatchedLength; j++){
                    
                    if(elSibling == aMatched[j]){
                        aThisResult.push(elSibling);
                        aMatched.splice(j, 1);
                        nMatchedLength = aMatched.length;
                        
                        if(oOptions && oOptions.single){
                            bIsBreak = true;
                        }
                        
                        break;
                    }
                }
                
                if(bIsBreak){
                    break;
                }
            }
        }
        
        return aThisResult;
    }
    
    /**
    {{_getParentElementIncludesChildForExcl}}
    **/
    function _getParentElementIncludesChildForExcl(aChild, oQuery, oOptions, elBaseParent){
        var i,
            j,
            aParent = _toArray(elBaseParent.querySelectorAll(oQuery.sRightSelector)),
            nParentLength = aParent.length,
            nChildLength = aChild.length,
            nLength,
            elParent,
            elChild,
            bIsDirectParent = oQuery.sCombinator == "!>",
            bIsBreak = false,
            aOneDepthResult,
            aThisResult = [],
            aFinalResult = [];
        
        for(i = 0 ; i < nChildLength; i++){
            elChild = aChild[i];
            
            for(j = 0; j < nParentLength; j++){
                elParent = aParent[j];
                
                /*
                {{_getParentElementIncludesChildForExcl_1}}
                */
                if(elParent.contains(elChild) && elParent != elChild){
                    
                    if(bIsDirectParent){
                        /*
                        {{_getParentElementIncludesChildForExcl_2}}
                        */
                        if(elParent == elChild.parentNode){
                            aOneDepthResult = aOneDepthResult || [];
                            aOneDepthResult.push(elParent);
                            
                            aParent.splice(j, 1);
                            nParentLength = aParent.length;
                            
                            if(oOptions && oOptions.single){
                                bIsBreak = true;
                            }
                            
                            break;
                        }
                    }else{
                        aOneDepthResult = aOneDepthResult || [];
                        aOneDepthResult.push(elParent);
                        
                        /*
                        {{_getParentElementIncludesChildForExcl_3}}
                        */
                    }
                }
            }
            
            if(aOneDepthResult){
                aThisResult.push(aOneDepthResult);
                /*
                {{_getParentElementIncludesChildForExcl_5}}
                */
                if(oOptions && oOptions.single){
                    break;
                }
            }
            
            aOneDepthResult = null;
        }
        
        nLength = aThisResult.length;
        for(i = 0; i < nLength; i++){
            /*
            {{_getParentElementIncludesChildForExcl_4}}
            */
            aFinalResult = aFinalResult.concat(jindo.$A(aThisResult[i]).reverse().$value());
        }
        
        return aFinalResult;
    }
    
    /**
    {{_getLeftElementForExcl}}
    **/
    function _getLeftElementForExcl(oQuery, elBaseParent, aPrevResult){
        var aResult;
        
        
        if(aPrevResult && aPrevResult.length > 0){
            /*
            {{_getLeftElementForExcl_1}}
            */
            if(oQuery.sLeftQuery == _getFirstSelector(oQuery.sLeftQuery)){
                return aPrevResult;
            }
            
            var nResultLength = aPrevResult.length,
                sResultQueryIdName = "resultid",
                sQuery = "",
                sRestQuery = _trim(_removeFirstSelector(oQuery.sLeftQuery)),
                i;
            
            for(i = 0; i < nResultLength; i++){
                sQuery += _addQueryId(aPrevResult[i], sResultQueryIdName) + " " + sRestQuery + ", ";
            }
            sQuery = sQuery.substr(0, sQuery.length - 2);
            aResult = _toArray(elBaseParent.querySelectorAll(sQuery));
            _removeQueryIdToArray(aPrevResult, sResultQueryIdName);
        }else{
            aResult = _toArray(elBaseParent.querySelectorAll(oQuery.sLeftQuery));
        }
        
        return aResult;
    }
    
    /**
    {{_addQueryId}}
    **/
    function _addQueryId(el, sIdName){
        var sQueryId, sValue;
        
        if(el.id){
            sQueryId = "#" + el.id;
        }else{
            sValue = "C" + new Date().getTime() + Math.floor(Math.random() * 1000000);
            el.setAttribute(sIdName, sValue);
            sQueryId = "[" + sIdName + "=" + sValue + "]";
        }
        
        return sQueryId;
    }
    
    /**
    {{_removeQueryId}}
    **/
    function _removeQueryId(el, sIdName){
        el.removeAttribute(sIdName);
    }
    
    /**
    {{_removeQueryIdToArray}}
    **/
    function _removeQueryIdToArray(aEl, sIdName){
        var length = aEl.length,
            i;
        
        for(i = 0; i < length; i++){
            _removeQueryId(aEl[i], sIdName);
        }
    }
    
    var UID = 1;
    var validUID = {};
    
    function distinct(aList){
        var aDistinct = [],
            oDummy = {},
            nUID,
            oEl,
            i;
        
        for(i = 0; oEl = aList[i]; i++){
            nUID = getUID4HTML(oEl);
            
            if(oDummy[nUID]){
                continue;
            }
            
            aDistinct.push(oEl);
            oDummy[nUID] = true;
        }
        
        return aDistinct;
    }
    
    function getUID4HTML(oEl){
        var nUID = oEl._cssquery_UID;
        
        if(nUID && validUID[nUID] == oEl){
            return nUID;
        }
        
        oEl._cssquery_UID = nUID = UID++;
        validUID[nUID] = oEl;
        
        return nUID;
    }
    
    var _div = document.createElement("div");
    
    /**
    {{cssquery_desc}}
     */
    cssquery = function(sQuery, oParent, oOptions){
        var oArgs = jindo.$Jindo.checkVarType(arguments, {
                '4str' : [ 'sQuery:' + tString],
                '4var' : [ 'sQuery:' + tString, 'oParent:' + tVariant ],
                '4var2' : [ 'sQuery:' + tString, 'oParent:' + tVariant, 'oOptions:' + tVariant ]
            }, "cssquery"),
            sTempId, aRet, nParentNodeType, sProperty, oOldParent, queryid, _clone, sTagName, _parent;
        
        oParent = _getParentElement(oParent);
        oOptions = oOptions && oOptions.$value ? oOptions.$value() : oOptions;
        /*
        {{cssquery_desc_5}}
        */
        sQuery = sQuery.replace(/\[(.*?)\=(\d*)\]/g,function(_, key, value){
            return "[" + key + "='" + value + "']";
        });
        
        if(_isNonStandardQueryButNotException(sQuery)){
            throw new jindo.$Error(jindo.$Except.NOT_SUPPORT_SELECTOR, (oOptions&&oOptions.single ? "<static> cssquery.getSingle" : "cssquery"));
        }
        
        nParentNodeType = oParent.nodeType;
        sTagName = (oParent.tagName || "").toUpperCase();
        
        if(nParentNodeType !== 9 && sTagName != "HTML"){
            if(nParentNodeType === 11){
                /*
                {{cssquery_desc_1}}
                */
                oParent = oParent.cloneNode(true);
                _clone = _div.cloneNode(true);
                _clone.appendChild(oParent);
                oParent = _clone;
                _clone = null;
            }
            
            queryid = _addQueryId(oParent, "queryid");
            
            if((_parent = oParent.parentNode)||sTagName === "BODY"||jindo.$Element._contain((oParent.ownerDocument || oParent.document).body,oParent)){
            // if(oParent.tagName.toUpperCase() === "BODY" || jindo.$Element._contain((oParent.ownerDocument || oParent.document).body,oParent)){
                /*
                {{cssquery_desc_2}}
                */
                // id = oParent.id;
                // _parent = oParent.parentNode;
                oOldParent = oParent;
                oParent = _parent;
            }else{
                /*
                {{cssquery_desc_3}}
                */
                _clone = _div.cloneNode(true);
                // id = oParent.id;
                oOldParent = oParent;
                _clone.appendChild(oOldParent);
                oParent = _clone;
            }
            
            sQuery = _commaRevise(queryid + " " + sQuery, ", " + queryid+" ");
            // sQuery = _commaRevise(queryid + " " + sQuery, ", " + queryid+" ");
        }else{
            oParent = (oParent.ownerDocument || oParent.document || oParent);
            if(_startCombinator(sQuery)){
                return [];
            }
        }
        
        try{
            /*
            {{cssquery_desc_4}}
            */
            if(!/!=/.test(sQuery) && sQuery.indexOf("!") > -1){
                aRet = _cssquery4Excl(sQuery, oParent, oOptions);
            }else{
                if(oOptions && oOptions.single){
                    aRet = [oParent.querySelector(sQuery)];
                }else{
                    aRet = _toArray(oParent.querySelectorAll(sQuery));
                }
            }
        }catch(e){
            throw e;
        }finally{
            if(sProperty){
                oOldParent.removeAttribute("queryid");
                _clone = null;
            }
        }
        
        return aRet;
    };
    
    /**
    {{test}}
     */
    cssquery.test = function(oEl, sQuery){
        if(!cssquery._dummyWrap){
            createDummy();
        }
        
        var elDummyClone = oEl.cloneNode(false);
        cssquery._dummyWrap.appendChild(elDummyClone);
        
        var bRet = cssquery.getSingle(sQuery, cssquery._dummyWrap) ? true : false;
        cssquery._dummyWrap.innerHTML = '';
        
        return bRet;
    };
    
    /**
    {{useCache}}
     */
    cssquery.useCache = function(bFlag){
    };
    
    /**
    {{clearCache}}
     */
    cssquery.clearCache = function(){
    };
    /**
    {{release}}
     */
    cssquery.release = function(){
    };
    
    /**
    {{getSingle}}
     */
    cssquery.getSingle = function(sQuery, oParent, oOptions){
        return cssquery(sQuery, oParent, { single : true })[0] || null;
    };
    
    /**
    {{extreme}}
     */
    cssquery.extreme = function(bExtreme){
    };

    return cssquery;
})();
//-!jindo.cssquery end!-//
//-!jindo.$$.hidden start(jindo.cssquery)!-//
//-!jindo.$$.hidden end!-//

/**
{{title}}
 */
//-!jindo.$Agent start!-//
/**
{{desc}}
 */
/**
{{constructor}}
 */
jindo.$Agent = function() {
    //-@@$Agent-@@//
    var cl = arguments.callee;
    var cc = cl._cached;

    if (cc) return cc;
    if (!(this instanceof cl)) return new cl;
    if (!cc) cl._cached = this;

    this._navigator = navigator;
    this._dm = document.documentMode;
}
//-!jindo.$Agent end!-//

//-!jindo.$Agent.prototype.navigator start!-//
/**
{{navigator}}
 */
jindo.$Agent.prototype.navigator = function(){
    //-@@$Agent.navigator-@@//
    var info = {};
        ver = -1,
        nativeVersion = -1,
        u = this._navigator.userAgent,
        v = this._navigator.vendor || "",
        dm = this._dm;

    function f(s,h){
        return ((h || "").indexOf(s) > -1)
    };

    info.getName = function(){
        var name = "";
        for(x in info){
            if(typeof info[x] == "boolean" && info[x] && info.hasOwnProperty(x))
                name = x;
        }
        
        return name;
    }
    
    info.webkit = f("WebKit", u);
    info.opera = (window.opera !== undefined) || f("Opera", u);
    info.chrome = info.webkit && f("Chrome", u);
    info.mobile = (f("Mobile", u) || f("Android", u) || f("Nokia", u) || f("webOS", u) || f("Opera Mini", u) || f("BlackBerry", u) || (f("Windows", u) && f("PPC", u)) || f("Smartphone", u) || f("IEMobile", u)) && !f("iPad", u);
    info.msafari = (!f("IEMobile", u) && f("Mobile", u)) || (f("iPad", u) && f("Safari", u));
    info.mopera = f("Opera Mini", u);
    info.mie = f("PPC", u) || f("Smartphone", u) || f("IEMobile", u);
    
    try{
        if(info.mie){
            if(dm > 0){
                ver = dm;
                if(u.match(/(?:Trident)\/([0-9.]+)/)){
                    var nTridentNum = parseInt(RegExp.$1, 10);
                    
                    if(nTridentNum > 3){
                        nativeVersion = nTridentNum + 4;
                    }
                }else{
                    nativeVersion = ver;
                }
            }else{
                nativeVersion = ver = u.match(/(?:MSIE) ([0-9.]+)/)[1];
            }
        }else if(info.msafari){
            ver = parseFloat(u.match(/Safari\/([0-9.]+)/)[1]);
            
            if(ver == 100){
                ver = 1.1;
            }else{
                if(u.match(/Version\/([0-9.]+)/)){
                    ver = RegExp.$1;
                }else{
                    ver = [1.0, 1.2, -1, 1.3, 2.0, 3.0][Math.floor(ver / 100)];
                }
            }
        }else if(info.mopera){
            ver = u.match(/(?:Opera\sMini)\/([0-9.]+)/)[1];
        }else if(info.opera){
            ver = u.match(/(?:Opera)\/([0-9.]+)/)[1];
        }else if(info.chrome){
            ver = u.match(/Chrome[ \/]([0-9.]+)/)[1];
        }
        
        info.version = parseFloat(ver);
        info.nativeVersion = parseFloat(nativeVersion);
        
        if(isNaN(info.version)){
            info.version = -1;
        }
    }catch(e){
        info.version = -1;
    }
    
    this.navigator = function(){
        return info;
    };
    
    return info;
};
//-!jindo.$Agent.prototype.navigator end!-//

//-!jindo.$Agent.prototype.os start!-//
/**
{{os}}
 */
jindo.$Agent.prototype.os = function() {
    //-@@$Agent.os-@@//
    var info = {},
        u = this._navigator.userAgent,
        p = this._navigator.platform,
        f = function(s, h){
            return (h.indexOf(s) > -1);
        },
        aMatchResult = null;
    
    info.getName = function(){
        var name = "";
        for(x in info){
            if(info[x] === true&&info.hasOwnProperty(x)){
                name = x;
            }
        }
        return name;
    }
    
    info.ipad = f("iPad", u);
    info.iphone = f("iPhone", u) && !info.ipad;
    info.android = f("Android", u);
    info.nokia =  f("Nokia", u);
    info.blackberry = f("BlackBerry", u);
    info.mwin = f("PPC", u) || f("Smartphone", u) || f("IEMobile", u) || f("Windows Phone", u);
    info.ios = info.ipad || info.iphone;
    info.symbianos = f("SymbianOS", u);
    info.version = null;
    
    if(info.android){
        aMatchResult = u.match(/Android ([\d|\.]+)/);
        if(aMatchResult != null && aMatchResult[1] != undefined){
            info.version = aMatchResult[1];
        }
    }else if(info.ios){
        aMatchResult = u.match(/(iPhone )?OS ([\d|_]+)/);
        if(aMatchResult != null && aMatchResult[2] != undefined){
            info.version = String(aMatchResult[2]).split("_").join(".");
        }
    }else if(info.blackberry){
        aMatchResult = u.match(/Version\/([\d|\.]+)/); // 6 or 7
        if(aMatchResult == null){
            aMatchResult = u.match(/BlackBerry\s?\d{4}\/([\d|\.]+)/); // 4.2 to 5.0
        }
        if(aMatchResult != null && aMatchResult[1] != undefined){
            info.version = aMatchResult[1];
        }
    }else if(info.symbianos){
        aMatchResult = u.match(/SymbianOS\/(\d+.\w+)/); // exist 7.0s
        if(aMatchResult != null && aMatchResult[1] != undefined){
            info.version = aMatchResult[1];
        }
    }else if(info.mwin){
        aMatchResult = u.match(/Windows CE ([\d|\.]+)/);
        if(aMatchResult != null && aMatchResult[1] != undefined){
            info.version = aMatchResult[1];
        }
        if(!info.version && (aMatchResult = u.match(/Windows Phone (OS )?([\d|\.]+)/))){
            info.version = aMatchResult[2];
        }
    }
    
    this.os = function() {
        return info;
    };

    return info;
};
//-!jindo.$Agent.prototype.os end!-//


/**
{{title}}
 */
//-!jindo.$A start!-//
/**
{{desc}}
 */
/**
{{constructor}}
 */
jindo.$A = function(array) {
    //-@@$A-@@//
    var cl = arguments.callee;
    
    if (array instanceof cl) {
        return array;
    }
    if (!(this instanceof cl)){
        try {
            jindo.$Jindo._maxWarn(arguments.length, 1,"$A");
            return new cl(array);
        } catch(e) {
            if (e instanceof TypeError) { return null; }
            throw e;
        }
    }
    
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [ ],
        '4arr' : ['aPram:'+tArray],
        '4nul' : [ 'oNull:'+tNull ],
        '4und' : [ 'oUndefined:'+tUndefined ],
        'arrt' : [ 'aPram:'+tArrayStyle ]
    },"$A");
    if(oArgs == null) array = [];
    switch(oArgs+"") {
    case 'arrt':
    case '4arr':
        array = oArgs.aPram;
        break;
    case '4nul':
    case '4und':
    case '4voi':
        array = [];
        
    }



    this._array = [];
    for(var i=0; i < array.length; i++) {
        this._array[this._array.length] = array[i];
    }
};
jindo.$A.checkVarTypeObj ={
    '4fun' : [ 'fCallback:'+tFunction],
    '4thi' : [ 'fCallback:'+tFunction, 'oThis:'+tVariant]
};
//-!jindo.$A end!-//

//-!jindo.$A.prototype.toString start!-//
/**
{{toString}}
 */
jindo.$A.prototype.toString = function() {
    //-@@$A.toString-@@//
    return this._array.toString();
};
//-!jindo.$A.prototype.toString end!-//

//-!jindo.$A.prototype.get start!-//
/**
{{get}}
 */
jindo.$A.prototype.get = function(nIndex){
    //-@@$A.get-@@//
     g_checkVarType(arguments, {
        '4num' : [ 'nIndex:'+tNumeric ]
    },"$A#get");
    return this._array[nIndex];
};
//-!jindo.$A.prototype.get end!-//

//-!jindo.$A.prototype.set start!-//
/**
{{set}}
 */
jindo.$A.prototype.set = function(nIndex,vValue){
    //-@@$A.set-@@//
    g_checkVarType(arguments, {
        '4num' : [ 'nIndex:'+tNumeric ,'vValue:'+tVariant]
        
    },"$A#set");
    
    this._array[nIndex] = vValue;
    return this;
};
//-!jindo.$A.prototype.set end!-//

//-!jindo.$A.prototype.length start!-//
/**
{{length}}
 */
/**
{{length2}}
 */
jindo.$A.prototype.length = function(nLen, oValue) {
    //-@@$A.length-@@//

    var oArgs = g_checkVarType(arguments, {
        '4num' : [ jindo.$Jindo._F('nLen:'+tNumeric)],
        'sv' : [ 'nLen:'+tNumeric, 'vValue:'+tVariant],
        '4voi' : [ ]
    },"$A#length");
    
    switch(oArgs+"") {
        case '4num':
            this._array.length = oArgs.nLen;
            return this;
            
        case 'sv':
            var l = this._array.length;
            this._array.length = oArgs.nLen;
            for(var i=l; i < nLen; i++) {
                this._array[i] = oArgs.vValue;
            }
            return this;
            
        case '4voi':
            return this._array.length;
            
    }
};
//-!jindo.$A.prototype.length end!-//

//-!jindo.$A.prototype.has start(jindo.$A.prototype.indexOf)!-//
/**
{{has}}
 */
jindo.$A.prototype.has = function(oValue) {
    //-@@$A.has-@@//
    return (this.indexOf(oValue) > -1);
};
//-!jindo.$A.prototype.has end!-//

//-!jindo.$A.prototype.indexOf start!-//
/**
{{indexOf}}
 */
jindo.$A.prototype.indexOf = function(oValue) {
    //-@@$A.indexOf-@@//
    return this._array.indexOf(oValue);
};
//-!jindo.$A.prototype.indexOf end!-//

//-!jindo.$A.prototype.$value start!-//
/**
{{sign_value}}
 */
jindo.$A.prototype.$value = function() {
    //-@@$A.$value-@@//
    return this._array;
};
//-!jindo.$A.prototype.$value end!-//

//-!jindo.$A.prototype.push start!-//
/**
{{push}}
 */
jindo.$A.prototype.push = function(oValue1/*, ...*/) {
    //-@@$A.push-@@//
    return this._array.push.apply(this._array, _toArray(arguments));
};
//-!jindo.$A.prototype.push end!-//

//-!jindo.$A.prototype.pop start!-//
/**
{{pop}}
 */
jindo.$A.prototype.pop = function() {
    //-@@$A.pop-@@//
    return this._array.pop();
};
//-!jindo.$A.prototype.pop end!-//

//-!jindo.$A.prototype.shift start!-//
/**
{{shift}}
 */
jindo.$A.prototype.shift = function() {
    //-@@$A.shift-@@//
    return this._array.shift();
};
//-!jindo.$A.prototype.shift end!-//

//-!jindo.$A.prototype.unshift start!-//
/**
{{unshift}}
 */
jindo.$A.prototype.unshift = function(oValue1/*, ...*/) {
    //-@@$A.unshift-@@//
    this._array.unshift.apply(this._array, _toArray(arguments));

    return this._array.length;
};
//-!jindo.$A.prototype.unshift end!-//

//-!jindo.$A.prototype.forEach start(jindo.$A.Break,jindo.$A.Continue)!-//
/**
{{forEach}}
 */
jindo.$A.prototype.forEach = function(fCallback, oThis) {
    //-@@$A.forEach-@@//
    var oArgs = g_checkVarType(arguments, jindo.$A.checkVarTypeObj,"$A#forEach");
    var that = this;
    function f(v,i,a) {
        try {
            fCallback.apply(oThis||that, _slice.call(arguments));
        } catch(e) {
            if (!(e instanceof that.constructor.Continue)) throw e;
        }
    };
    
    try {
        this._array.forEach(f);
    } catch(e) {
        if (!(e instanceof this.constructor.Break)) throw e;
    }
    return this;
};
//-!jindo.$A.prototype.forEach end!-//

//-!jindo.$A.prototype.slice start!-//
/**
{{slice}}
 */
jindo.$A.prototype.slice = function(nStart, nEnd) {
    //-@@$A.slice-@@//
    var a = this._array.slice.call(this._array, nStart, nEnd);
    return jindo.$A(a);
};
//-!jindo.$A.prototype.slice end!-//

//-!jindo.$A.prototype.splice start!-//
/**
{{splice}}
 */
jindo.$A.prototype.splice = function(nIndex, nHowMany/*, oValue1,...*/) {
    //-@@$A.splice-@@//
    var a = this._array.splice.apply(this._array, _toArray(arguments));

    return jindo.$A(a);
};
//-!jindo.$A.prototype.splice end!-//

//-!jindo.$A.prototype.shuffle start!-//
/**
{{shuffle}}
 */
jindo.$A.prototype.shuffle = function() {
    //-@@$A.shuffle-@@//
    this._array.sort(function(a,b){ return Math.random()>Math.random()?1:-1 });
    
    return this;
};
//-!jindo.$A.prototype.shuffle end!-//

//-!jindo.$A.prototype.reverse start!-//
/**
{{reverse}}
 */
jindo.$A.prototype.reverse = function() {
    //-@@$A.reverse-@@//
    this._array.reverse();

    return this;
};
//-!jindo.$A.prototype.reverse end!-//

//-!jindo.$A.prototype.empty start!-//
/**
{{empty_1}}
 */
jindo.$A.prototype.empty = function() {
    //-@@$A.empty-@@//
    this._array.length = 0;
    return this;
};
//-!jindo.$A.prototype.empty end!-//

//-!jindo.$A.Break start!-//
/**
{{break}}
 */
jindo.$A.Break = jindo.$Jindo.Break;
//-!jindo.$A.Break end!-//

//-!jindo.$A.Continue start!-//
/**
{{continue}}
 */
jindo.$A.Continue = jindo.$Jindo.Continue;
//-!jindo.$A.Continue end!-//

//-!jindo.$A.prototype.map start(jindo.$A.Break,jindo.$A.Continue)!-//
/**
{{title}}
 */

/**
{{map}}
 */
jindo.$A.prototype.map = function(fCallback, oThis) {
    //-@@$A.map-@@//
    var oArgs = g_checkVarType(arguments, jindo.$A.checkVarTypeObj,"$A#map");
    if(oArgs == null){ return this; }
            
    var returnArr   = [];
    var that = this;
    function f(v,i,a) {
        try {
            returnArr.push(fCallback.apply(oThis||this, _toArray(arguments)));
        } catch(e) {
            if (e instanceof that.constructor.Continue){
                returnArr.push(v);
            } else{
                throw e;                
            }
        }
    };
    this.forEach(f);
    return jindo.$A(returnArr);
};
//-!jindo.$A.prototype.map end!-//

//-!jindo.$A.prototype.filter start(jindo.$A.prototype.forEach)!-//
/**
{{filter}}
 */
jindo.$A.prototype.filter = function(fCallback, oThis) {
    //-@@$A.filter-@@//
    var oArgs = g_checkVarType(arguments, jindo.$A.checkVarTypeObj,"$A#filter");
    if(oArgs == null){ return this; }
    
    var returnArr   = [];
    var that = this;
    function f(v,i,a) {
        try {
            if(fCallback.apply(oThis||that, _toArray(arguments))) returnArr.push(v);
        } catch(e) {
            if (!(e instanceof that.constructor.Continue)){
                throw e;                
            }
        }
    };
    try {
        this.forEach(f);
    } catch(e) {
        if(!(e instanceof this.constructor.Break)) throw e;
    }
    return jindo.$A(returnArr);
};

//-!jindo.$A.prototype.filter end!-//

//-!jindo.$A.prototype.every start(jindo.$A.prototype.forEach)!-//
/**
{{every}}
 */
jindo.$A.prototype.every = function(fCallback, oThis) {
    //-@@$A.every-@@//
    g_checkVarType(arguments, jindo.$A.checkVarTypeObj,"$A#every");
    return this._array.every(fCallback, oThis||this);
};
//-!jindo.$A.prototype.every end!-//

//-!jindo.$A.prototype.some start(jindo.$A.prototype.forEach)!-//
/**
{{some}}
 */
jindo.$A.prototype.some = function(fCallback, oThis) {
    //-@@$A.some-@@//
    g_checkVarType(arguments, jindo.$A.checkVarTypeObj,"$A#some");
    return this._array.some(fCallback, oThis||this);
};
//-!jindo.$A.prototype.some end!-//

//-!jindo.$A.prototype.refuse start(jindo.$A.prototype.filter, jindo.$A.prototype.indexOf)!-//
/**
{{refuse}}
 */
jindo.$A.prototype.refuse = function(oValue1/*, ...*/) {
    //-@@$A.refuse-@@//
    var a = jindo.$A(_slice.apply(arguments));
    return this.filter(function(v,i) {return !(a.indexOf(v) > -1) });
};
//-!jindo.$A.prototype.refuse end!-//
//-!jindo.$A.prototype.unique start!-//
/**
{{unique}}
 */
jindo.$A.prototype.unique = function() {
    //-@@$A.unique-@@//
    var a = this._array, b = [], l = a.length;
    var i, j;

    /*
    {{unique_1}}
     */
    for(i = 0; i < l; i++) {
        for(j = 0; j < b.length; j++) {
            if (a[i] == b[j]) break;
        }
        
        if (j >= b.length) b[j] = a[i];
    }
    
    this._array = b;
    
    return this;
};
//-!jindo.$A.prototype.unique end!-//

/**
 {{title}}
 */
//-!jindo.$H start!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$H = function(hashObject) {
    //-@@$H-@@//
    var cl = arguments.callee;
    if (hashObject instanceof cl) return hashObject;
    
    if (!(this instanceof cl)){
        try {
            jindo.$Jindo._maxWarn(arguments.length, 1,"$H");
            return new cl(hashObject||{});
        } catch(e) {
            if (e instanceof TypeError) { return null; }
            throw e;
        }
    }
    
    var oArgs = g_checkVarType(arguments, {
        '4obj' : ['oObj:'+tHash],
        '4vod' : []
    },"$H");

    this._table = {};
    for(var k in hashObject) {
        if(hashObject.hasOwnProperty(k)){
            this._table[k] = hashObject[k]; 
        }
    }
};
//-!jindo.$H end!-//

//-!jindo.$H.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$H.prototype.$value = function() {
    //-@@$H.$value-@@//
    return this._table;
};
//-!jindo.$H.prototype.$value end!-//

//-!jindo.$H.prototype.$ start!-//
/**
 {{sign_}}
 */
/**
 {{sign2_}}
 */
jindo.$H.prototype.$ = function(key, value) {
    //-@@$H.$-@@//
    var oArgs = g_checkVarType(arguments, {
        's4var' : [ jindo.$Jindo._F('key:'+tString), 'value:'+tVariant ],
        's4var2' : [ 'key:'+tNumeric, 'value:'+tVariant ],
        'g4str' : [ 'key:'+tString ],
        's4obj' : [ 'oObj:'+tHash],
        'g4num' : [ 'key:'+tNumeric ]
    },"$H#$");
    
    switch(oArgs+""){
        case "s4var":
        case "s4var2":
            this._table[key] = value;
            return this;
        case "s4obj":
            var obj = oArgs.oObj;
            for(var i in obj){
                this._table[i] = obj[i];
            }
            return this;
        default:
            return this._table[key];
    }
    
};
//-!jindo.$H.prototype.$ end!-//

//-!jindo.$H.prototype.length start!-//
/**
 {{length}}
 */
jindo.$H.prototype.length = function() {
    //-@@$H.length-@@//
    var i = 0;
    for(var k in this._table) {
        if(this._table.hasOwnProperty(k)){
            if (Object.prototype[k] !== undefined && Object.prototype[k] === this._table[k]) continue;
            i++;
        }
    }

    return i;
};
//-!jindo.$H.prototype.length end!-//

//-!jindo.$H.prototype.forEach start(jindo.$H.Break,jindo.$H.Continue)!-//
/**
 {{forEach}}
 */
jindo.$H.prototype.forEach = function(callback, thisObject) {
    //-@@$H.forEach-@@//
    var oArgs = g_checkVarType(arguments, {
        '4fun' : [ 'callback:'+tFunction],
        '4obj' : [ 'callback:'+tFunction, "thisObject:"+tVariant]
    },"$H#forEach");
    var t = this._table;
    var h = this.constructor;
    
    for(var k in t) {
        if (t.hasOwnProperty(k)) {
            if (!t.propertyIsEnumerable(k)) continue;
            try {
                callback.call(thisObject||this, t[k], k, t);
            } catch(e) {
                if (e instanceof h.Break) break;
                if (e instanceof h.Continue) continue;
                throw e;
            }
        }
    }
    return this;
};
//-!jindo.$H.prototype.forEach end!-//

//-!jindo.$H.prototype.filter start(jindo.$H.prototype.forEach)!-//
/**
 {{filter}}
 */
jindo.$H.prototype.filter = function(callback, thisObject) {
    //-@@$H.filter-@@//
    var oArgs = g_checkVarType(arguments, {
        '4fun' : [ 'callback:'+tFunction],
        '4obj' : [ 'callback:'+tFunction, "thisObject:"+tVariant]
    },"$H#filter");
    var h = jindo.$H();
    var t = this._table;
    var hCon = this.constructor;
    
    for(var k in t) {
        if (t.hasOwnProperty(k)) {
            if (!t.propertyIsEnumerable(k)) continue;
            try {
                if(callback.call(thisObject||this, t[k], k, t)){
                    h.add(k,t[k]);
                }
            } catch(e) {
                if (e instanceof hCon.Break) break;
                if (e instanceof hCon.Continue) continue;
                throw e;
            }
        }
    }
    return h;
};
//-!jindo.$H.prototype.filter end!-//

//-!jindo.$H.prototype.map start(jindo.$H.prototype.forEach)!-//
/**
 {{map}}
 */

jindo.$H.prototype.map = function(callback, thisObject) {
    //-@@$H.map-@@//
    var oArgs = g_checkVarType(arguments, {
        '4fun' : [ 'callback:'+tFunction],
        '4obj' : [ 'callback:'+tFunction, "thisObject:"+tVariant]
    },"$H#map");
    var h = jindo.$H();
    var t = this._table;
    var hCon = this.constructor;
    
    for(var k in t) {
        if (t.hasOwnProperty(k)) {
            if (!t.propertyIsEnumerable(k)) continue;
            try {
                h.add(k,callback.call(thisObject||this, t[k], k, t));
            } catch(e) {
                if (e instanceof hCon.Break) break;
                if (e instanceof hCon.Continue){
                    h.add(k,t[k]);
                }else{
                    throw e;
                }
            }
        }
    }
    
    return h;
};
//-!jindo.$H.prototype.map end!-//

//-!jindo.$H.prototype.add start!-//
/**
 {{add}}
 */
jindo.$H.prototype.add = function(key, value) {
    //-@@$H.add-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str' : [ 'key:'+tString,"value:"+tVariant],
        '4num' : [ 'key:'+tNumeric,"value:"+tVariant]
    },"$H#add");
    this._table[key] = value;

    return this;
};
//-!jindo.$H.prototype.add end!-//

//-!jindo.$H.prototype.remove start!-//
/**
 {{remove}}
 */
jindo.$H.prototype.remove = function(key) {
    //-@@$H.remove-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str' : [ 'key:'+tString],
        '4num' : [ 'key:'+tNumeric]
    },"$H#remove");
    
    if (this._table[key] === undefined) return null;
    var val = this._table[key];
    delete this._table[key];
    
    return val;
};
//-!jindo.$H.prototype.remove end!-//

//-!jindo.$H.prototype.search start!-//
/**
 {{search}}
 */
jindo.$H.prototype.search = function(value) {
    //-@@$H.search-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str' : [ 'value:'+tVariant]
    },"$H#search");
    var result = false;
    var t = this._table;

    for(var k in t) {
        if (t.hasOwnProperty(k)) {
            if (!t.propertyIsEnumerable(k)) continue;
            var v = t[k];
            if (v === value) {
                result = k;
                break;
            }           
        }
    }
    
    return result;
};
//-!jindo.$H.prototype.search end!-//

//-!jindo.$H.prototype.hasKey start!-//
/**
 {{hasKey}}
 */
jindo.$H.prototype.hasKey = function(key) {
    //-@@$H.hasKey-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str' : [ 'key:'+tString],
        '4num' : [ 'key:'+tNumeric]
    },"$H#hasKey");
    return this._table[key] !== undefined;
};
//-!jindo.$H.prototype.hasKey end!-//

//-!jindo.$H.prototype.hasValue start(jindo.$H.prototype.search)!-//
/**
 {{hasValue}}
 */
jindo.$H.prototype.hasValue = function(value) {
    //-@@$H.hasValue-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str' : [ 'value:'+tVariant]
    },"$H#hasValue");
    return (this.search(value) !== false);
};
//-!jindo.$H.prototype.hasValue end!-//

//-!jindo.$H.prototype.sort start(jindo.$H.prototype.search)!-//
/**
 {{sort}}
 */
jindo.$H.prototype.sort = function() {
    //-@@$H.sort-@@//
    var o = new Object;
    var a = [];
    for(var k in this._table) {
        if(this._table.hasOwnProperty(k))
            a[a.length] = this._table[k];
    }
    var k = false;

    a.sort();

    for(var i=0; i < a.length; i++) {
        k = this.search(a[i]);

        o[k] = a[i];
        delete this._table[k];
    }
    
    this._table = o;
    
    return this;
};
//-!jindo.$H.prototype.sort end!-//

//-!jindo.$H.prototype.ksort start(jindo.$H.prototype.keys)!-//
/**
 {{ksort}}
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
//-!jindo.$H.prototype.ksort end!-//

//-!jindo.$H.prototype.keys start!-//
/**
 {{keys}}
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
//-!jindo.$H.prototype.keys end!-//

//-!jindo.$H.prototype.values start!-//
/**
 {{values}}
 */
jindo.$H.prototype.values = function() {
    //-@@$H.values-@@//
    var values = [];
    for(var k in this._table) {
        if(this._table.hasOwnProperty(k))
            values[values.length] = this._table[k];
    }

    return values;
};
//-!jindo.$H.prototype.values end!-//

//-!jindo.$H.prototype.toQueryString start!-//
/**
 {{toQueryString}}
 */
jindo.$H.prototype.toQueryString = function() {
    //-@@$H.toQueryString-@@//
    var buf = [], val = null, idx = 0;
    for(var k in this._table) {
        if (this._table.hasOwnProperty(k)) {
            val = this._table[k];
            if (jindo.$Jindo.isArray(val)) {
                for(i=0; i < val.length; i++) {
                    buf[buf.length] = encodeURIComponent(k)+"[]="+encodeURIComponent(val[i]+"");
                }
            } else {
                buf[buf.length] = encodeURIComponent(k)+"="+encodeURIComponent(this._table[k]+"");
            }
        }
    }
    
    return buf.join("&");
};
//-!jindo.$H.prototype.toQueryString end!-//

//-!jindo.$H.prototype.empty start!-//
/**
 {{empty_1}}
 */
jindo.$H.prototype.empty = function() {
    //-@@$H.empty-@@//
    this._table = {};
    
    return this;
};
//-!jindo.$H.prototype.empty end!-//

//-!jindo.$H.Break start!-//
/**
 {{break}}
 */
jindo.$H.Break = jindo.$Jindo.Break;
//-!jindo.$H.Break end!-//

//-!jindo.$H.Continue start!-//
/**
 {{continue}}
 */
jindo.$H.Continue  = jindo.$Jindo.Continue;
//-!jindo.$H.Continue end!-//


/**
 {{title}}
 */
//-!jindo.$Fn start(jindo.$Fn.prototype.attach)!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$Fn = function(func, thisObject) {
    //-@@$Fn-@@//
    var cl = arguments.callee;
    if (func instanceof cl) return func;

    if (!(this instanceof cl)){
        try {
            jindo.$Jindo._maxWarn(arguments.length, 2,"$Fn");
            return new cl(func, thisObject);
        } catch(e) {
            if (e instanceof TypeError) { return null; }
            throw e;
        }
    }   

    var oArgs = g_checkVarType(arguments, {
        '4fun' : ['func:'+tFunction],
        '4fun2' : ['func:'+tFunction, "thisObject:"+tVariant],
        '4str' : ['func:'+tString, "thisObject:"+tString]
    },"$Fn");

    this._tmpElm = null;
    this._key    = null;
    
    switch(oArgs+""){
        case "4str":
            this._func = eval("false||function("+func+"){"+thisObject+"}");
            break;
        case "4fun":
        case "4fun2":
            this._func = func;
            this._this = thisObject;
            
    }

};

/**
 * @ignore 
 */
jindo.$Fn._commonPram = function(oPram,sMethod){
    return g_checkVarType(oPram, {
        '4ele' : ['eElement:'+tElement,"sEvent:"+tString],
        '4ele2' : ['eElement:'+tElement,"sEvent:"+tString,"bUseCapture:"+tBoolean],
        '4str' : ['eElement:'+tString,"sEvent:"+tString],
        '4str2' : ['eElement:'+tString,"sEvent:"+tString,"bUseCapture:"+tBoolean],
        '4arr' : ['aElement:'+tArray,"sEvent:"+tString],
        '4arr2' : ['aElement:'+tArray,"sEvent:"+tString,"bUseCapture:"+tBoolean],
        '4doc' : ['eElement:'+tDocument,"sEvent:"+tString],
        '4win' : ['eElement:'+tWindow,"sEvent:"+tString],
        '4doc2' : ['eElement:'+tDocument,"sEvent:"+tString,"bUseCapture:"+tBoolean],
        '4win2' : ['eElement:'+tWindow,"sEvent:"+tString,"bUseCapture:"+tBoolean]
    },sMethod);
};
//-!jindo.$Fn end!-//

//-!jindo.$Fn.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$Fn.prototype.$value = function() {
    //-@@$Fn.$value-@@//
    return this._func;
};
//-!jindo.$Fn.prototype.$value end!-//

//-!jindo.$Fn.prototype.bind start!-//
/**
 {{bind}}
*/
jindo.$Fn.prototype.bind = function() {
    //-@@$Fn.bind-@@//
    var a = _slice.call( arguments, 0);
    var f = this._func;
    var t = this._this||this;
    var b;
    if(f.bind){
        a.unshift(t);
        b = Function.prototype.bind.apply(f,a);
    }else{
        
        b = function() {
            var args = _slice.call( arguments, 0);
            // fix opera concat bug
            if (a.length) args = a.concat(args);
    
            return f.apply(t, args);
        };
    }
    return b;
};
//-!jindo.$Fn.prototype.bind end!-//

//-!jindo.$Fn.prototype.attach start(jindo.$Fn.prototype.bind, jindo.$Element.prototype.attach, jindo.$Element.prototype.detach)!-//
/**
 {{attach}}
 */
jindo.$Fn.prototype.attach = function(oElement, sEvent, bUseCapture) {
    //-@@$Fn.attach-@@//
    var oArgs = jindo.$Fn._commonPram(arguments,"$Fn#attach");
    var fn = null, l, ev = sEvent, el = oElement, ua = _j_ag;
    
    if (bUseCapture !== true) {
        bUseCapture = false;
    };
    
    this._bUseCapture = bUseCapture;

    switch(oArgs+""){
        case "4arr":
        case "4arr2":
            var el = oArgs.aElement;
            var ev = oArgs.sEvent;
            for(var i=0, l= el.length; i < l; i++) this.attach(el[i], ev, !!bUseCapture);
            return this;
    }
    fn = this._bind = this._bind?this._bind:this.bind();
    jindo.$Element(el).attach(ev,fn);

    return this;
};


/**
 {{detach}}
 */
jindo.$Fn.prototype.detach = function(oElement, sEvent, bUseCapture) {
    //-@@$Fn.detach-@@//
    var oArgs = jindo.$Fn._commonPram(arguments,"$Fn#detach");
    
    var fn = null, l, el = oElement, ev = sEvent, ua = _j_ag;
    
    switch(oArgs+""){
        case "4arr":
        case "4arr2":
            var el = oArgs.aElement;
            var ev = oArgs.sEvent;
            for(var i=0, l= el.length; i < l; i++) this.detach(el[i], ev, !!bUseCapture);
            return this;
        
    }
    fn = this._bind = this._bind?this._bind:this.bind();
    jindo.$Element(oArgs.eElement).detach(oArgs.sEvent, fn);

    return this;
};
//-!jindo.$Fn.prototype.attach end!-//

//-!jindo.$Fn.prototype.detach start!-//
//-!jindo.$Fn.prototype.detach end!-//

//-!jindo.$Fn.prototype.delay start(jindo.$Fn.prototype.bind)!-//
/**
 {{delay}}
 */
jindo.$Fn.prototype.delay = function(nSec, args) {
    //-@@$Fn.delay-@@//
    var oArgs = g_checkVarType(arguments, {
        '4num' : ['nSec:'+tNumeric],
        '4arr' : ['nSec:'+tNumeric,'args:'+tArray]
    },"$Fn#delay");
    switch(oArgs+""){
        case "4num":
            args = args || [];
            break;
        case "4arr":
            args = oArgs.args;
            
    }
    this._delayKey = setTimeout(this.bind.apply(this, args), nSec*1000);
    return this;
};
//-!jindo.$Fn.prototype.delay end!-//

//-!jindo.$Fn.prototype.setInterval start(jindo.$Fn.prototype.bind)!-//
/**
 {{setInterval}}
 */
jindo.$Fn.prototype.setInterval = function(nSec, args) {
    //-@@$Fn.setInterval-@@//
    //-@@$Fn.repeat-@@//
    var oArgs = g_checkVarType(arguments, {
        '4num' : ['nSec:'+tNumeric],
        '4arr' : ['nSec:'+tNumeric,'args:'+tArray]
    },"$Fn#setInterval");
    switch(oArgs+""){
        case "4num":
            args = args || [];
            break;
        case "4arr":
            args = oArgs.args;
            
    }
    this._repeatKey = setInterval(this.bind.apply(this, args), nSec*1000);
    return this;
};
//-!jindo.$Fn.prototype.setInterval end!-//

//-!jindo.$Fn.prototype.repeat start(jindo.$Fn.prototype.setInterval)!-//
/**
 {{repeat}}
 */
jindo.$Fn.prototype.repeat = jindo.$Fn.prototype.setInterval;
//-!jindo.$Fn.prototype.repeat end!-//

//-!jindo.$Fn.prototype.stopDelay start!-//
/**
 {{stopDelay}}
 */
jindo.$Fn.prototype.stopDelay = function(){
    //-@@$Fn.stopDelay-@@//
    if(this._delayKey !== undefined){
        window.clearTimeout(this._delayKey);
        delete this._delayKey;
    }
    return this;
};
//-!jindo.$Fn.prototype.stopDelay end!-//

//-!jindo.$Fn.prototype.stopRepeat start!-//
/**
 {{stopRepeat}}
 */
jindo.$Fn.prototype.stopRepeat = function(){
    //-@@$Fn.stopRepeat-@@//
    if(this._repeatKey !== undefined){
        window.clearInterval(this._repeatKey);
        delete this._repeatKey;
    }
    return this;
};
//-!jindo.$Fn.prototype.stopRepeat end!-//

/**
 {{title}}
 */
//-!jindo.$Event start!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$Event = function(e){
    //-@@$Event-@@//
    var cl = arguments.callee;
    if (e instanceof cl) return e;
    if (!(this instanceof cl)) return new cl(e);

    this._event = this._posEvent = e;
    this._globalEvent = window.event;
    this.type = e.type.toLowerCase();
    if (this.type == "dommousescroll") {
        this.type = "mousewheel";
    } else if (this.type == "domcontentloaded") {
        this.type = "domready";
    }
    
    this.isTouch = false;
    if(this.type.indexOf("touch") > -1){
        this._posEvent = e.changedTouches[0];
        this.isTouch = true;
    }

    this.canceled = false;

    this.element = e.target || e.srcElement;
    this.currentElement = e.currentTarget;
    this.relatedElement = null;

    if (!jindo.$Jindo.isUndefined(e.relatedTarget)) {
        this.relatedElement = e.relatedTarget;
    } else if(e.fromElement && e.toElement) {
        this.relatedElement = e[(this.type=="mouseout")?"toElement":"fromElement"];
    }
};
//-!jindo.$Event end!-//

/**
 {{hook}}
 {{hook2}}
 */


//-!jindo.$Event.customEvent start!-//
/**
 {{customEvent}}
 */

var customEvent = {};
window.customEventStore = {};
window.normalCustomEvent = {};

function hasCustomEvent(sName){
    return !!(getCustomEvent(sName)||normalCustomEvent[sName]);
}
function getCustomEvent(sName){
    return customEvent[sName];
}

function addCustomEventListener(eEle, sElementId, sEvent, vFilter,oCustomInstance){
    if(!customEventStore[sElementId]){
        customEventStore[sElementId] = {};
        customEventStore[sElementId].ele = eEle;
    }
    if(!customEventStore[sElementId][sEvent]){
        customEventStore[sElementId][sEvent] = {};
    }
    if(!customEventStore[sElementId][sEvent][vFilter]){
        customEventStore[sElementId][sEvent][vFilter] = {
            "custom" : oCustomInstance
        };
    }
} 
function setCustomEventListener(sElementId, sEvent, vFilter, aNative, aWrap){
    customEventStore[sElementId][sEvent][vFilter].real_listener = aNative;
    customEventStore[sElementId][sEvent][vFilter].wrap_listener = aWrap;
} 

function getCustomEventListener(sElementId, sEvent, vFilter){
    var store = customEventStore[sElementId];
    if(store&&store[sEvent]&&store[sEvent][vFilter]){
        return store[sEvent][vFilter];
    }
    return {};
    
}
 
function getNormalEventListener(sElementId, sEvent, vFilter){
    var store = normalCustomEvent[sEvent];
    if(store&&store[sElementId]&&store[sElementId][vFilter]){
        return store[sElementId][vFilter];
    }
    return {};
    
} 

function hasCustomEventListener(sElementId, sEvent, vFilter){
    var store = customEventStore[sElementId];
    if(store&&store[sEvent]&&store[sEvent][vFilter]){
        return true;
    }
    return false;
    
} 


jindo.$Event.customEvent = function(sName, oEvent){
    
    var oArgs = g_checkVarType(arguments, {
        's4str' : [ 'sName:'+tString],
        's4obj' : [ 'sName:'+tString, "oEvent:"+tHash]
    },"$Event.customEvent");

    
    switch(oArgs+""){
        case "s4str":
            if(hasCustomEvent(sName)){
                throw new jindo.$Error("The Custom Event Name have to unique.");
            }else{
                normalCustomEvent[sName] = {};
            }
            
            
            return this;
        case "s4obj":
            if(hasCustomEvent(sName)){
                throw new jindo.$Error("The Custom Event Name have to unique.");
            }else{
                normalCustomEvent[sName] = {};
                customEvent[sName] = function(){
                    this.name = sName;
                    this.real_listener = [];
                    this.wrap_listener = [];
                };
                var _proto = customEvent[sName].prototype;
                _proto.events = [];
                for(var i in oEvent){
                    _proto[i] = oEvent[i];
                    _proto.events.push(i);
                }
                // customEvent[sName].prototype.isStop = false;
                customEvent[sName].prototype.fireEvent = function(oCustomEvent){
                    for(var i = 0, l = this.wrap_listener.length; i < l; i ++){
                        this.wrap_listener[i](oCustomEvent);
                    }
                }
            }
            return this;
    }
    
    
}

// jindo.$Event.prototype.stopCustomBubble = function(){
    // // return this.stop(jindo.$Event.CANCEL_BUBBLE);
// };

//-!jindo.$Event.customEvent start!-//
//-!jindo.$Event.prototype.mouse start!-//
/**
 {{mouse}}
 */
jindo.$Event.prototype.mouse = function() {
    //-@@$Event.mouse-@@//
    var e    = this._event;
    var ele  = this.element;
    var delta = 0;
    var ret   = {};

    if (e.wheelDelta) {
        delta = e.wheelDelta / 120;
    } else if (e.detail) {
        delta = -e.detail / 3;
    }
                
    ret = {
        delta  : delta
    };
    // replace method
    this.mouse = function(){
        return ret;
    };

    return ret;
};
//-!jindo.$Event.prototype.mouse end!-//

//-!jindo.$Event.prototype.key start!-//
/**
 {{key}}
 */
jindo.$Event.prototype.key = function() {
    //-@@$Event.key-@@//
    var e     = this._event;
    var k     = e.keyCode || e.charCode;
    var ret   = {
        keyCode : k,
        alt     : e.altKey,
        ctrl    : e.ctrlKey,
        meta    : e.metaKey,
        shift   : e.shiftKey,
        up      : (k == 38),
        down    : (k == 40),
        left    : (k == 37),
        right   : (k == 39),
        enter   : (k == 13),        
        esc   : (k == 27)
    };

    this.key = function(){ return ret };

    return ret;
};
//-!jindo.$Event.prototype.key end!-//

//-!jindo.$Event.prototype.pos start(jindo.$Element.prototype.offset)!-//
/**
 {{pos}}
 */
jindo.$Event.prototype.pos = function(bGetOffset) {
    //-@@$Event.pos-@@//
    g_checkVarType(arguments,{
        "voi" : [],
        "bol" : ["bGetOffset:"+tBoolean]
    });
    var e   = this._posEvent;

    var doc = (this.element.ownerDocument||document);
    var b   = doc.body;
    var de  = doc.documentElement;
    var pos = [b.scrollLeft || de.scrollLeft, b.scrollTop || de.scrollTop];
    var ret = {
        clientX : e.clientX,
        clientY : e.clientY,
        pageX   : 'pageX' in e ? e.pageX : e.clientX+pos[0]-b.clientLeft,
        pageY   : 'pageY' in e ? e.pageY : e.clientY+pos[1]-b.clientTop,
        layerX  : 'offsetX' in e ? e.offsetX : e.layerX - 1,
        layerY  : 'offsetY' in e ? e.offsetY : e.layerY - 1
    };

    /*
     {{pos_1}}
     */
    if (bGetOffset && jindo.$Element) {
        var offset = jindo.$Element(this.element).offset();
        ret.offsetX = ret.pageX - offset.left;
        ret.offsetY = ret.pageY - offset.top;
    }

    return ret;
};
//-!jindo.$Event.prototype.pos end!-//

//-!jindo.$Event.prototype.stop start!-//
/**
 {{stop}}
 */
jindo.$Event.prototype.stop = function(nCancel) {
    //-@@$Event.stop-@@//
    g_checkVarType(arguments,{
        "voi" : [],
        "num" : ["nCancel:"+tNumeric]
    });
    nCancel = nCancel || jindo.$Event.CANCEL_ALL;

    var e = (window.event && window.event == this._globalEvent)?this._globalEvent:this._event;
    var b = !!(nCancel & jindo.$Event.CANCEL_BUBBLE); // stop bubbling
    var d = !!(nCancel & jindo.$Event.CANCEL_DEFAULT); // stop default event
    var type = this.realType;
    if(b&&(type==="focusin"||type==="focusout")){
        jindo.$Jindo._warn("The "+type +" event can't stop bubble.");
    }

    this.canceled = true;

    if (e.preventDefault !== undefined && d) e.preventDefault();
    if (e.stopPropagation !== undefined && b) e.stopPropagation();

    return this;
};

/**
 {{stopDefault}}
 */
jindo.$Event.prototype.stopDefault = function(){
    return this.stop(jindo.$Event.CANCEL_DEFAULT);
};

/**
 {{stopBubble}}
 */
jindo.$Event.prototype.stopBubble = function(){
    return this.stop(jindo.$Event.CANCEL_BUBBLE);
};

/**
 {{cancel_bubble}}
 */
jindo.$Event.CANCEL_BUBBLE = 1;

/**
 {{cancel_default}}
 */
jindo.$Event.CANCEL_DEFAULT = 2;

/**
 {{cancel_all}}
 */
jindo.$Event.CANCEL_ALL = 3;
//-!jindo.$Event.prototype.stop end!-//

//-!jindo.$Event.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$Event.prototype.$value = function() {
    //-@@$Event.$value-@@//
    return this._event;
};
//-!jindo.$Event.prototype.$value end!-//

//-!jindo.$Event.prototype.changedTouch start(jindo.$Event.prototype.targetTouch)!-//
/**
 {{changedTouch}}
 */
(function(aType){
    var sTouches = "Touch";
    for(var i = 0, l = aType.length; i < l; i++){
        jindo.$Event.prototype[aType[i]+sTouches] = (function(sType){
            return function(nIndex){
                if(this.isTouch){
                    var oRet = [];
                    var ev = this._event[sType+"es"];
                    var l = ev.length;
                    var e;
                    for(var i = 0; i < l; i++){
                        e = ev[i];
                        oRet.push({
                            "id" : e.identifier,
                            "event" : this,
                            "element" : e.target,
                            "_posEvent" : e,
                            "pos" : jindo.$Event.prototype.pos
                        });
                    }
                    this[sType] = function(nIndex){
                        var oArgs = g_checkVarType(arguments, {
                            'void' : [  ],
                            '4num' : [ 'nIndex:'+tNumeric ]
                        },"$Event#"+sType);
                        if(oArgs+"" == 'void') return oRet;
                        
                        return oRet[nIndex];
                    }
                }else{
                    this[sType] = function(nIndex){
                        throw new jindo.$Error(jindo.$Except.NOT_SUPPORT_METHOD,"$Event#"+sType);
                    }
                }
                
                return this[sType].apply(this,_toArray(arguments));
            };
        })(aType[0]+sTouches);
    }
    
})(["changed","target"]);
//-!jindo.$Event.prototype.changedTouch end!-//

//-!jindo.$Event.prototype.targetTouch start(jindo.$Event.prototype.changedTouch)!-//
/**
 {{targetTouch}}
 */
//-!jindo.$Event.prototype.targetTouch end!-//

/**
 {{title}}
 */
//-!jindo.$Element start(jindo.$)!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$Element = function(el) {
    //-@@$Element-@@//
    var cl = arguments.callee;
    if (el && el instanceof cl) return el;  
    
    if (!(this instanceof cl)){
        try {
            jindo.$Jindo._maxWarn(arguments.length, 1,"$"+tElement);
            return new cl(el);
        } catch(e) {
            if (e instanceof TypeError) { return null; }
            throw e;
        }
    }   
    var ___jindo = jindo.$Jindo;
    var oArgs = ___jindo.checkVarType(arguments, {
        '4str' : [ 'sID:'+tString ],
        '4nod' : [ 'oEle:'+tNode ],
        '4doc' : [ 'oEle:'+tDocument ],
        '4win' : [ 'oEle:'+tWindow ]
    },"$"+tElement);
    switch(oArgs + ""){
        case "4str":
            el = jindo.$(el);
            break;
        default:
            el = oArgs.oEle;
    }
    
    this._element = el;
    if(this._element != null){
        if(this._element.__jindo__id){
            this._key = this._element.__jindo__id; 
        }else{
            this._element.__jindo__id = this._key = _makeRandom();
        }
        // tagname
        this.tag = (this._element.tagName||'').toLowerCase(); 
    }else{
        throw new TypeError("{not_found_element}");
    }

};
var NONE_GROUP = "_jindo_event_none";
function splitEventSelector(sEvent){
    var matches = sEvent.match(/^([a-z]*)(.*)/);
    var eventName = trim(matches[1]);
    var selector = trim(matches[2].replace("@",""));
    
    return {
        "type"      : selector?"delegate":"normal",
        "event"     : eventName,
        "selector"  : selector
    };
}
function _makeRandom(){
    return "e"+ new Date().getTime() + parseInt(Math.random() * 100000000,10);
}

function releaseEventHandlerForAllChildren(wel){
    var children = wel._element.all || wel._element.getElementsByTagName("*"),
        nChildLength = children.length,
        elChild = null,
        i;
    
    for(i = 0; i < nChildLength; i++){
        elChild = children[i];
        
        if(elChild.nodeType == 1 && elChild.__jindo__id){
            jindo.$Element.eventManager.cleanUpUsingKey(elChild.__jindo__id, true);
        }
    }
    
    children = elChild = null;
}
function canUseClassList(){
    canUseClassList = function(){
        return "classList" in document.body&&"classList" in document.createElementNS("http://www.w3.org/2000/svg", "g");    
    }
    return canUseClassList();
}

var vendorPrefixObj = {
    "-moz" : "Moz",
    "-ms" : "ms",
    "-o" : "O",
    "-webkit" : "webkit"
};

function cssNameToJavaScriptName(sName){
    if(/^(\-(?:moz|ms|o|webkit))/.test(sName)){
        var vandorPerfix = RegExp.$1;
        sName = sName.replace(vandorPerfix,vendorPrefixObj[vandorPerfix]);
    }
    
    return sName.replace(/(:?-(\w))/g,function(_,_,m){
       return m.toUpperCase();
    });
}

function getStyleIncludeVendorPrefix(_test){
    var styles = ["Transition","Transform","Animation","Perspective"];
    var vendors = ["webkit","-","Moz","O","ms"];
    //"-"는 벤더 prefix가 없는 경우,"-" 뒤에 있는 것 들은 벤더 prefix있는것과 없는 것들이 있을때 prefix있는걸 가져감.
    var style  = "";
    var vendor = "";
    var vendorStyle = "";
    var result = {};
    
    var styleObj = _test||document.body.style;
    for(var i = 0, l = styles.length; i < l; i++){
        style = styles[i];
        
        for(var j = 0, m = vendors.length; j < m; j++ ){
            vendor = vendors[j];
            vendorStyle = vendor!="-"?(vendor+style):style.toLowerCase(); 
            if(typeof styleObj[vendorStyle] !== "undefined"){
                result[style.toLowerCase()] = vendorStyle;
                break;
            }
            result[style.toLowerCase()] = false;
        }    
    }
    
    if(_test){
        return result;
    }
    
    getStyleIncludeVendorPrefix = function(){
        return result;
    }
    
    return getStyleIncludeVendorPrefix();
    
}

function getTransformStringForValue(_test){
    var info = getStyleIncludeVendorPrefix(_test);
    var transform = info.transform ;
    if(info.transform === "MozTransform"){
        transform = "-moz-transform";
    }else if(info.transform === "webkitTransform"){
        transform = "-webkit-transform";
    }else if(info.transform === "OTransform"){
        transform = "-o-transform";
    }else if(info.transform === "msTransform"){
        transform = "-ms-transform";
    }
    
    if(_test){
        return transform;
    }
    
    getTransformStringForValue = function(){
        return transform
    }
    
    return getTransformStringForValue();
    
}
/*
 {{disappear_1}}
 */
//안드로이드 4.0.4 갤S2 LTE에서 깜박이기 때문에 웹킷이 아닌 경우만 setTimout씀.
function setOpacity(ele,val){
    if(typeof document.body.style.webkitTransition !== "undefined"){
        setOpacity = function(ele,val){
            ele.style.opacity = val;
        }
    }else{
        setOpacity = function(ele,val){
            setTimeout(function(){
                ele.style.opacity = val;
            },50);
        }
    }
    setOpacity(ele,val);
}

/**
 {{sign_eventBind}}
 */
jindo.$Element._eventBind = function(oEle,sEvent,fAroundFunc,bUseCapture){
    oEle.addEventListener(sEvent, fAroundFunc, !!bUseCapture);
};

/**
 {{sign_unEventBind}}
 */
jindo.$Element._unEventBind = function(oEle,sType,fAroundFunc){
    oEle.removeEventListener(sType,fAroundFunc,false);
};
//-!jindo.$Element end!-//





//-!jindo.$Element.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$Element.prototype.$value = function() {
    //-@@$Element.$value-@@//
    return this._element;
};
//-!jindo.$Element.prototype.$value end!-//

//-!jindo.$Element.prototype.visible start(jindo.$Element.prototype._getCss,jindo.$Element.prototype.show,jindo.$Element.prototype.hide)!-//
/**
 {{visible}}
 */
/**
 {{visible2}}
 */
jindo.$Element.prototype.visible = function(bVisible, sDisplay) {
    //-@@$Element.visible-@@//
    var oArgs = g_checkVarType(arguments, {
        'g' : [  ],
        's4bln' : [ jindo.$Jindo._F('bVisible:'+tBoolean) ],
        's4str' : [ 'bVisible:'+tBoolean, "sDisplay:"+tString]
    },"$Element#visible");
    switch(oArgs+""){
        case "g":
            return (this._getCss(this._element,"display") != "none");
            
        case "s4bln":
            this[bVisible?"show":"hide"]();
            return this;
            
        case "s4str":
            this[bVisible?"show":"hide"](sDisplay);
            return this;
                    
    }
};
//-!jindo.$Element.prototype.visible end!-//

//-!jindo.$Element.prototype.show start!-//
/**
 {{show}}
 */
jindo.$Element.prototype.show = function(sDisplay) {
    //-@@$Element.show-@@//
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [  ],
        '4str' : ["sDisplay:"+tString]
    },"$Element#show");
    
    
    var s = this._element.style;
    var b = "block";
    var c = { p:b,div:b,form:b,h1:b,h2:b,h3:b,h4:b,ol:b,ul:b,fieldset:b,td:"table-cell",th:"table-cell",
              li:"list-item",table:"table",thead:"table-header-group",tbody:"table-row-group",tfoot:"table-footer-group",
              tr:"table-row",col:"table-column",colgroup:"table-column-group",caption:"table-caption",dl:b,dt:b,dd:b};
    try {
        switch(oArgs+""){
            case "4voi":
                var type = c[this.tag];
                s.display = type || "inline";
                break;
            case "4str":
                s.display = sDisplay;
                
        }
    } catch(e) {
        /*
         {{show_1}}
         */
        s.display = "block";
    }

    return this;
};
//-!jindo.$Element.prototype.show end!-//

//-!jindo.$Element.prototype.hide start!-//
/**
 {{hide}}
 */
jindo.$Element.prototype.hide = function() {
    //-@@$Element.hide-@@//
    this._element.style.display = "none";

    return this;
};

//-!jindo.$Element.prototype.hide end!-//

//-!jindo.$Element.prototype.toggle start(jindo.$Element.prototype._getCss,jindo.$Element.prototype.show,jindo.$Element.prototype.hide)!-//
/**
 {{toggle}}
 */
jindo.$Element.prototype.toggle = function(sDisplay) {
    //-@@$Element.toggle-@@//
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [  ],
        '4str' : ["sDisplay:"+tString]
    },"$Element#toggle");
    
    this[this._getCss(this._element,"display")=="none"?"show":"hide"].apply(this,arguments);
    return this;
};
//-!jindo.$Element.prototype.toggle end!-//

//-!jindo.$Element.prototype.opacity start!-//
/**
 {{opacity}}
 */
/**
 {{opacity2}}
 */
jindo.$Element.prototype.opacity = function(value) {
    //-@@$Element.opacity-@@//
    var oArgs = g_checkVarType(arguments, {
        'g' : [  ],
        's' : ["nOpacity:"+tNumeric]
    },"$Element#opacity");
    
    var v,e = this._element,b;
    switch(oArgs+""){
        case "g":
            b = (this._getCss(e,"display") != "none");
            v = parseFloat(e.style.opacity);
            if (isNaN(v)) v = b?1:0;
            return v;   
            
        case "s":
             /*
             {{opacity_1}}
             */
            b = (this._getCss(e,"display") != "none");
            value = oArgs.nOpacity;
            e.style.zoom = 1;
            value = Math.max(Math.min(value,1),0);
            e.style.opacity = value;
            return this;
            
    }
    
};


//-!jindo.$Element.prototype.opacity end!-//

//-!jindo.$Element.prototype.css start(jindo.$Element.prototype.opacity,jindo.$Element.prototype._getCss,jindo.$Element.prototype._setCss)!-//
/**
 {{css}}
 */
/**
 {{css2}}
 */
function _revisionCSSAttr(name,vendorPrefix){
    var custumName = jindo.$Element.hook(name);
    if(custumName){
        name = custumName;
    }else{
        name = cssNameToJavaScriptName(name).replace(/^(animation|perspective|transform|transition)/i,function(_1){
            return vendorPrefix[_1.toLowerCase()];
        });
    }
    return name;
}

function changeTransformValue(name,_test){
    return  name.replace(/([\s|-]*)(?:transform)/,function(_,m1){ 
        return trim(m1).length > 0 ? _ : m1+getTransformStringForValue(_test);
    });
}


jindo.$Element.prototype.css = function(sName, sValue) {
    //-@@$Element.css-@@//
    
    var oArgs = g_checkVarType(arguments, {
        'g'     : [ 'sName:'+tString],
        's4str' : [ jindo.$Jindo._F('sName:'+tString), jindo.$Jindo._F('vValue:'+tString) ],
        's4num' : [ 'sName:'+tString, 'vValue:'+tNumeric ],
        's4obj' : [ 'oObj:'+tHash]
    },"$Element#css");
    
    var e = this._element;
    switch(oArgs+"") {
        case 's4str':
        case 's4num':
            var obj = {};
            sName = _revisionCSSAttr(sName,getStyleIncludeVendorPrefix());
            obj[sName] = sValue;
            sName = obj;
            break;
        case 's4obj':
            sName = oArgs.oObj;
            var obj = {};
            var vendorPrefix = getStyleIncludeVendorPrefix();
            for (i in sName) if (sName.hasOwnProperty(i)){
                obj[_revisionCSSAttr(i,vendorPrefix)] = sName[i]; 
            }
            sName = obj;
            break;
        case 'g':
            var vendorPrefix = getStyleIncludeVendorPrefix();
            sName = _revisionCSSAttr(sName,vendorPrefix);
            var _getCss = this._getCss;
            if(sName == "opacity"){
                return this.opacity();
            }
            if (sName=="padding"||sName=="margin") {
                var top     = _getCss(e, sName+"Top");
                var right   = _getCss(e, sName+"Right");
                var bottom  = _getCss(e, sName+"Bottom");
                var left    = _getCss(e, sName+"Left");
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
    var v, type;

    for(var k in sName) {
        if(sName.hasOwnProperty(k)){
            v    = sName[k];
            if (!(jindo.$Jindo.isString(v)||jindo.$Jindo.isNumeric(v))) continue;
            if (k == 'opacity') {
                this.opacity(v);
                continue;
            }
            if( k =="backgroundPositionX" || k == "backgroundPositionY"){
                var bp = this.css("backgroundPosition").split(/\s+/);
                v = k == "backgroundPositionX" ? v+" "+bp[1] : bp[0]+" "+v;
                this._setCss(e, "backgroundPosition", v);
            }else{
                this._setCss(e, k, /transition/i.test(k) ? changeTransformValue(v):v);
            }
        }
    }
    
    return this;
};
//-!jindo.$Element.prototype.css end!-//

//-!jindo.$Element.prototype._getCss.hidden start!-//
/**
 {{sign_getCss}}
 */
jindo.$Element.prototype._getCss = function(e, sName){
    try{
        if (sName == "cssFloat") sName = "float";
        var d = e.ownerDocument || e.document || document;
        var sVal =  (e.style[sName]||d.defaultView.getComputedStyle(e,null).getPropertyValue(sName.replace(/([A-Z])/g,"-$1").toLowerCase()));
        if (sName == "textDecoration") sVal = sVal.replace(",","");
        return sVal;
    }catch(ex){
        throw new jindo.$Error((e.tagName||"document") + jindo.$Except.NOT_USE_CSS,"$Element#css");
    }
    
};
//-!jindo.$Element.prototype._getCss.hidden end!-//

//-!jindo.$Element.prototype._setCss.hidden start!-//
/**
 {{sign_setCss}}
 */
jindo.$Element.prototype._setCss = function(e, k, v){
    if (("#top#left#right#bottom#").indexOf(k+"#") > 0 && (typeof v == "number" ||(/\d$/.test(v)))) {
        e.style[k] = parseInt(v,10)+"px";
    }else{
        e.style[k] = v;
    }
};
//-!jindo.$Element.prototype._setCss.hidden end!-//

//-!jindo.$Element.prototype.attr start!-//
/**
 {{attr}}
 */
/**
 {{attr2}}
 */
jindo.$Element.prototype.attr = function(sName, sValue) {
    //-@@$Element.attr-@@//
    var oArgs = g_checkVarType(arguments, {
        'g'     : [ 'sName:'+tString],
        's4str' : [ 'sName:'+tString, 'vValue:'+tString ],
        's4num' : [ 'sName:'+tString, 'vValue:'+tNumeric ],
        's4nul' : [ 'sName:'+tString, 'vValue:'+tNull ],
        's4bln' : [ 'sName:'+tString, 'vValue:'+tBoolean ],
        's4arr' : [ 'sName:'+tString, 'vValue:'+tArray ],
        's4obj' : [ jindo.$Jindo._F('oObj:'+tHash)]
    },"$Element#attr");
    
    var e = this._element,
        aValue = null,
        i,
        length,
        nIndex,
        fGetIndex,
        elOption,
        wa;
    
    switch(oArgs+""){
        case "s4str":
        case "s4nul":
        case "s4num":
        case "s4bln":
        case "s4arr":
            var obj = {};
            obj[sName] = sValue;
            sName = obj;
            break;
        case "s4obj":
            sName = oArgs.oObj;
            break;
        case "g":
            if (sName == "class" || sName == "className"){ 
                return e.className;
            }else if(sName == "style"){
                return e.style.cssText;
            }else if(sName == "checked"||sName == "disabled"){
                return !!e[sName];
            }else if(sName == "value"){
                if(this.tag == "button"){
                    return e.getAttributeNode('value').value;
                }else if(this.tag == "select"){
                    if(e.multiple){
                        for(i = 0, length = e.options.length; i < length; i++){
                            elOption = e.options[i];
                            
                            if(elOption.selected){
                                if(!aValue){
                                    aValue = [];
                                }
                                
                                sValue = elOption.value;
                                
                                if(sValue == ""){
                                    sValue = elOption.text;
                                }
                                
                                aValue.push(sValue);
                            }
                        }
                        return aValue;
                    }else{
                        if(e.selectedIndex < 0){
                            return null;
                        }
                        
                        sValue = e.options[e.selectedIndex].value;
                        return (sValue == "") ? e.options[e.selectedIndex].text : sValue;
                    }
                }else{
                    return e.value;
                }
            }else if(sName == "href"){
                return e.getAttribute(sName,2);
            }
            return e.getAttribute(sName);
            
    }
    
    fGetIndex = function(oOPtions, vValue){
        var nIndex = -1,
            i,
            length,
            elOption;
        
        for(i = 0, length = oOPtions.length; i < length; i++){
            elOption = oOPtions[i];
            if(elOption.value === vValue || elOption.text === vValue){
                nIndex = i;
                break;
            }
        }
        
        return nIndex;
    }
    
    for(var k in sName) {
        if(sName.hasOwnProperty(k)){
            var v = sName[k];
            if (jindo.$Jindo.isNull(v)) {
                if(this.tag == "select"){
                    if(e.multiple){
                        for(i = 0, length = e.options.length; i < length; i++){
                            e.options[i].selected = false;
                        }
                    }else{
                        e.selectedIndex = -1;
                    }
                }else{
                    e.removeAttribute(k);
                }
            }else{
                if (k == "class"|| k == "className") { 
                    e.className = v;
                }else if(k == "style"){
                    e.style.cssText = v;
                }else if(k == "checked"||k == "disabled"){
                    e[k] = v;
                }else if(k == "value"){
                    if(this.tag == "select"){
                        if(e.multiple){
                            if(jindo.$Jindo.isArray(v)){
                                wa = jindo.$A(v);
                                for(i = 0, length = e.options.length; i < length; i++){
                                    elOption = e.options[i];
                                    elOption.selected = wa.has(elOption.value) || wa.has(elOption.text);
                                }
                            }else{
                                e.selectedIndex = fGetIndex(e.options, v);
                            }
                        }else{
                            e.selectedIndex = fGetIndex(e.options, v);
                        }
                    }else{
                        e.value = v;
                    }
                }else{
                    e.setAttribute(k, v);
                }
            } 
        }
    }

    return this;
};
//-!jindo.$Element.prototype.attr end!-//

//-!jindo.$Element.prototype.width start!-//
/**
 {{width}}
 */
/**
 {{width2}}
 */
jindo.$Element.prototype.width = function(width) {
    //-@@$Element.width-@@//
    var oArgs = g_checkVarType(arguments, {
        'g' : [  ],
        's' : ["nWidth:"+tNumeric]
    },"$Element#width");
    
    switch(oArgs+""){
        case "g" :
            
            return this._element.offsetWidth;
            
        case "s" :
            
            width = oArgs.nWidth;
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

};
//-!jindo.$Element.prototype.width end!-//

//-!jindo.$Element.prototype.height start!-//
/**
 {{height}}
 */
/**
 {{height2}}
 */
jindo.$Element.prototype.height = function(height) {
    //-@@$Element.height-@@//
    var oArgs = g_checkVarType(arguments, {
        'g' : [  ],
        's' : ["nHeight:"+tNumeric]
    },"$Element#height");
    
    switch(oArgs+""){
        case "g" :
            return this._element.offsetHeight;
            
        case "s" :
            height = oArgs.nHeight;
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
};
//-!jindo.$Element.prototype.height end!-//

//-!jindo.$Element.prototype.className start!-//
/**
 {{className}}
 */
/**
 {{className2}}
 */
jindo.$Element.prototype.className = function(sClass) {
    //-@@$Element.className-@@//
    var oArgs = g_checkVarType(arguments, {
        'g' : [  ],
        's' : [jindo.$Jindo._F("sClass:"+tString)]
    },"$Element#className");
    var e = this._element;
    switch(oArgs+"") {
        case "g":
            return e.className;
        case "s":
            e.className = sClass;
            return this;
            
    }

};
//-!jindo.$Element.prototype.className end!-//

//-!jindo.$Element.prototype.hasClass start!-//
/**
 {{hasClass}}
 */
jindo.$Element.prototype.hasClass = function(sClass) {
    //-@@$Element.hasClass-@@//
    var ___checkVarType = g_checkVarType;
    if(canUseClassList()){
        jindo.$Element.prototype.hasClass = function(sClass){
            var oArgs = ___checkVarType(arguments, {
                '4str' : ["sClass:"+tString]
            },"$Element#hasClass");
            return this._element.classList.contains(sClass);
        }
    } else {
        jindo.$Element.prototype.hasClass = function(sClass){
            var oArgs = ___checkVarType(arguments, {
                '4str' : ["sClass:"+tString]
            },"$Element#hasClass");
            return (" "+this._element.className+" ").indexOf(" "+sClass+" ") > -1;
        }
    }
    return this.hasClass.apply(this,arguments);
    
};
//-!jindo.$Element.prototype.hasClass end!-//

//-!jindo.$Element.prototype.addClass start!-//
/**
 {{addClass}}
 */
//jindo.$Element.prototype.addClass = function(sClass) {
//  //-@@$Element.addClass-@@//
//  if(this._element.classList){
//      jindo.$Element.prototype.addClass = function(sClass){
//          if(this._element==null) return this;
//          var oArgs = g_checkVarType(arguments, {
//              '4str' : ["sClass:"+tString]
//          },"$Element#addClass");
//          
//          var aClass = (sClass+"").split(/\s+/);
//          var flistApi = this._element.classList;
//          for(var i = aClass.length ; i-- ;){
//              aClass[i]!=""&&flistApi.add(aClass[i]);
//          }
//          return this;
//      }
//  } else {
        jindo.$Element.prototype.addClass = function(sClass){
            var oArgs = g_checkVarType(arguments, {
                '4str' : ["sClass:"+tString]
            },"$Element#addClass");
            var e = this._element;
            var sClassName = e.className;
            var aClass = (sClass+"").split(" ");
            var sEachClass;
            for (var i = aClass.length - 1; i >= 0 ; i--){
                sEachClass = aClass[i];
                if ((" "+sClassName+" ").indexOf(" "+sEachClass+" ") == -1) {
                    sClassName = sClassName+" "+sEachClass;
                }
            }
            e.className = sClassName.replace(/\s+$/, "").replace(/^\s+/, "");
            return this;
        };
//  }
//  return this.addClass.apply(this,arguments);
//
//};
//-!jindo.$Element.prototype.addClass end!-//

//-!jindo.$Element.prototype.removeClass start!-//
/**
 {{removeClass}} 
 */
//jindo.$Element.prototype.removeClass = function(sClass) {
//  //-@@$Element.removeClass-@@//
//  if(!this._element.classList){
//      jindo.$Element.prototype.removeClass = function(sClass){
//          var oArgs = g_checkVarType(arguments, {
//              '4str' : ["sClass:"+tString]
//          },"$Element#removeClass");
//          if(this._element==null) return this;
//          var flistApi = this._element.classList;
//          var aClass = (sClass+"").split(" ");
//          for(var i = aClass.length ; i-- ;){
//              aClass[i]!=""&&flistApi.remove(aClass[i]);
//          }
//          return this;
//      }
//  } else {

        jindo.$Element.prototype.removeClass = function(sClass){
            var oArgs = g_checkVarType(arguments, {
                '4str' : ["sClass:"+tString]
            },"$Element#removeClass");
            var e = this._element;
            var sClassName = e.className;
            var aClass = (sClass+"").split(" ");
            var sEachClass;
            
            for (var i = aClass.length - 1; i >= 0 ; i--){
                sClassName = (" "+sClassName+" ").replace(new RegExp("\\b"+aClass[i]+"\\s+","g")," ");
            }
            
            e.className = sClassName.replace(/\s+$/, "").replace(/^\s+/, "");

            return this;
        };
//  }
//  return this.removeClass.apply(this,arguments);
//  
//};
//-!jindo.$Element.prototype.removeClass end!-//

//-!jindo.$Element.prototype.toggleClass start(jindo.$Element.prototype.addClass,jindo.$Element.prototype.removeClass,jindo.$Element.prototype.hasClass)!-//
/**
 {{toggleClass}} 
 */
jindo.$Element.prototype.toggleClass = function(sClass, sClass2) {
    //-@@$Element.toggleClass-@@//
    var ___checkVarType = g_checkVarType;
    if(canUseClassList()){
        jindo.$Element.prototype.toggleClass = function(sClass, sClass2){
            var oArgs = ___checkVarType(arguments, {
                '4str'  : ["sClass:"+tString],
                '4str2' : ["sClass:"+tString, "sClass2:"+tString]
            },"$Element#toggleClass");
            
            switch(oArgs+"") {
                case '4str':
                    this._element.classList.toggle(sClass+"");
                    break;
                case '4str2':
                    sClass = sClass+"";
                    sClass2 = sClass2+"";
                    if(this.hasClass(sClass)){
                        this.removeClass(sClass);
                        this.addClass(sClass2);
                    }else{
                        this.addClass(sClass);
                        this.removeClass(sClass2);
                    }
                    
            }
            return this;
        };
    } else {
        jindo.$Element.prototype.toggleClass = function(sClass, sClass2){
            var oArgs = ___checkVarType(arguments, {
                '4str'  : ["sClass:"+tString],
                '4str2' : ["sClass:"+tString, "sClass2:"+tString]
            },"$Element#toggleClass");
            
            sClass2 = sClass2 || "";
            if (this.hasClass(sClass)) {
                this.removeClass(sClass);
                if (sClass2) this.addClass(sClass2);
            } else {
                this.addClass(sClass);
                if (sClass2) this.removeClass(sClass2);
            }

            return this;
        };
    }
    return this.toggleClass.apply(this,arguments);
};
//-!jindo.$Element.prototype.toggleClass end!-//

//-!jindo.$Element.prototype.cssClass start(jindo.$Element.prototype.addClass,jindo.$Element.prototype.removeClass,jindo.$Element.prototype.hasClass)!-//
/**
 {{cssClass}}
 */
/**
 {{cssClass2}}
 */
jindo.$Element.prototype.cssClass = function(vClass, bCondition){
    var oArgs = g_checkVarType(arguments, {
        'g'  : ["sClass:"+tString],
        's4bln' : ["sClass:"+tString, "bCondition:"+tBoolean],
        's4obj' : ["oObj:"+tHash]
    },"$Element#cssClass");
            
    switch(oArgs+""){
        case "g":
            return this.hasClass(oArgs.sClass);
            
        case "s4bln":
            if(oArgs.bCondition){
                this.addClass(oArgs.sClass);
            }else{
                this.removeClass(oArgs.sClass);
            }
            return this;
            
        case "s4obj":
            var e = this._element;
            vClass = oArgs.oObj;
            var sClassName = e.className;
            for(var sEachClass in vClass){
                if (vClass.hasOwnProperty(sEachClass)) {
                    if(vClass[sEachClass]){
                        if ((" " + sClassName + " ").indexOf(" " + sEachClass + " ") == -1) {
                            sClassName = (sClassName+" "+sEachClass).replace(/^\s+/, "");
                        }
                    }else{
                        if ((" " + sClassName + " ").indexOf(" " + sEachClass + " ") > -1) {
                            sClassName = (" "+sClassName+" ").replace(" "+sEachClass+" ", " ").replace(/\s+$/, "").replace(/^\s+/, "");
                        }
                    }
                }
            }
            e.className = sClassName;
            return this;
            
    }


};  
    
//-!jindo.$Element.prototype.cssClass end!-//
//-!jindo.$Element.prototype.text start!-//
/**
 {{text}}
 */
/**
 {{text2}}
 */
jindo.$Element.prototype.text = function(sText) {
    //-@@$Element.text-@@//
    var oArgs = g_checkVarType(arguments, {
        'g'  : [],
        's4str' : ["sText:"+tString],
        's4num' : [jindo.$Jindo._F("sText:"+tNumeric)],
        's4bln' : ["sText:"+tBoolean]
    },"$Element#text"),
        ele = this._element,
        tag = this.tag,
        prop,
        oDoc;
    
    switch(oArgs+""){
        case "g":
            prop = (ele.textContent !== undefined) ? "textContent" : "innerText";
            
            if(tag == "textarea" || tag == "input"){
                prop = "value";
            }
            
            return ele[prop];
        case "s4str":
        case "s4num":
        case "s4bln":
            try{
                /*
                {{text_1}}
                 */ 
                if(tag == "textarea" || tag == "input"){
                    ele.value = sText + "";
                }else{
                    var oDoc = ele.ownerDocument || ele.document || document;
                    this.empty();
                    ele.appendChild(oDoc.createTextNode(sText));
                }
            }catch(e){
                return ele.innerHTML = (sText+"").replace(/&/g, '&amp;').replace(/</g, '&lt;');
            }
            
            return this;
    }
};
//-!jindo.$Element.prototype.text end!-//

//-!jindo.$Element.prototype.html start!-//
/**
 {{html}}
 */
/**
 {{html2}}
 */
jindo.$Element.prototype.html = function(sHTML) {
    //-@@$Element.html-@@//
    var oArgs = g_checkVarType(arguments,{
        'g'  : [],
        's4str' : [jindo.$Jindo._F("sText:"+tString)],
        's4num' : ["sText:"+tNumeric],
        's4bln' : ["sText:"+tBoolean]
    },"$Element#html");
    switch(oArgs+""){
        case "g":
            return this._element.innerHTML;
            
        case "s4str":
        case "s4num":
        case "s4bln":
            // releaseEventHandlerForAllChildren(this);
            
            sHTML += ""; 
            var oEl = this._element;
            oEl.innerHTML = sHTML;
            return this;
            
    }
};
//-!jindo.$Element.prototype.html end!-//

//-!jindo.$Element.prototype.outerHTML start!-//
/**
 {{outerHTML}}
 */
jindo.$Element.prototype.outerHTML = function() {
    //-@@$Element.outerHTML-@@//
    var e = this._element;
    if (!jindo.$Jindo.isUndefined( e.outerHTML)) return e.outerHTML;
    
    var oDoc = e.ownerDocument || e.document || document;
    var div = oDoc.createElement("div");
    var par = e.parentNode;

    /**
      {{outerHTML_1}}
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
//-!jindo.$Element.prototype.outerHTML end!-//

//-!jindo.$Element.prototype.toString start(jindo.$Element.prototype.outerHTML)!-//
/**
 {{toString}}
 */
jindo.$Element.prototype.toString = jindo.$Element.prototype.outerHTML;
//-!jindo.$Element.prototype.toString end!-//

//-!jindo.$Element.prototype.attach start(jindo.$Element.prototype.isEqual,jindo.$Element.prototype.isChildOf,jindo.$Element.prototype.detach, jindo.$Element.event_etc, jindo.$Element.unload, jindo.$Event)!-//
/**
 {{attach}}
 */   
jindo.$Element.prototype.attach = function(sEvent, fpCallback){
    var oArgs = g_checkVarType(arguments, {
        '4str'  : ["sEvent:"+tString, "fpCallback:"+tFunction],
        '4obj'  : ["hListener:"+tHash]
    },"$Element#attach");
    var oSpilt, hListener;
   
    switch(oArgs+""){
       case "4str":
            oSpilt = splitEventSelector(oArgs.sEvent);
            this._add(oSpilt.type,oSpilt.event,oSpilt.selector,fpCallback);
            break;
       case "4obj":
            hListener = oArgs.hListener;
            for(var i in hListener){
                this.attach(i,hListener[i]);
            }
            break;
    }
    return this;
};
//-!jindo.$Element.prototype.attach end!-//

//-!jindo.$Element.prototype.detach start(jindo.$Element.prototype.attach)!-//
/**
 {{detach}}
 */
jindo.$Element.prototype.detach = function(sEvent, fpCallback){
    var oArgs = g_checkVarType(arguments, {
        // 'group_for_string'  : ["sEvent:"+tString],
        '4str'  : ["sEvent:"+tString, "fpCallback:"+tFunction],
        '4obj'  : ["hListener:"+tHash]
    },"$Element#detach");
    var oSpilt, hListener;
   
    switch(oArgs+""){
       case "4str":
            oSpilt = splitEventSelector(oArgs.sEvent);
            this._del(oSpilt.type,oSpilt.event,oSpilt.selector,fpCallback);
            break;
       case "4obj":
            hListener = oArgs.hListener;
            for(var i in hListener){
                this.detach(i,hListener[i]);
            }
            break;
    }
    return this;
};
//-!jindo.$Element.prototype.detach end!-//

//-!jindo.$Element.prototype.delegate start(jindo.$Element.prototype.undelegate, jindo.$Element.event_etc, jindo.$Element.unload, jindo.$Event)!-//
/**
{{delegate}}
*/
jindo.$Element.prototype.delegate = function(sEvent , vFilter , fpCallback){
    var oArgs = g_checkVarType(arguments, {
        '4str'  : ["sEvent:"+tString, "vFilter:"+tString, "fpCallback:"+tFunction],
        '4fun'  : ["sEvent:"+tString, "vFilter:"+tFunction, "fpCallback:"+tFunction]
    },"$Element#delegate");
    return this._add("delegate",sEvent,vFilter,fpCallback);
};
//-!jindo.$Element.prototype.delegate end!-//

//-!jindo.$Element.prototype.undelegate start(jindo.$Element.prototype.delegate)!-//
/**
{{undelegate}}
 */
jindo.$Element.prototype.undelegate = function(sEvent , vFilter , fpCallback){
    var oArgs = g_checkVarType(arguments, {
        '4str'  : ["sEvent:"+tString, "vFilter:"+tString, "fpCallback:"+tFunction],
        '4fun'  : ["sEvent:"+tString, "vFilter:"+tFunction, "fpCallback:"+tFunction],
        'group_for_string'  : ["sEvent:"+tString, "vFilter:"+tString],
        'group_for_function'  : ["sEvent:"+tString, "vFilter:"+tFunction]
    },"$Element#undelegate");
    return this._del("delegate",sEvent,vFilter,fpCallback);
};
//-!jindo.$Element.prototype.undelegate end!-//

//-!jindo.$Element.event_etc.hidden start!-//

function customEventAttach(sType,sEvent,vFilter,fpCallback,fpCallbackBind,eEle,fpAdd){
    if(!hasCustomEventListener(eEle.__jindo__id,sEvent,vFilter)){
        var CustomEvent = getCustomEvent(sEvent);
        var customInstance = new CustomEvent();
        var events = customInstance.events;
        
        customInstance.real_listener.push(fpCallback);
        customInstance.wrap_listener.push(fpCallbackBind);
        
        for(var i = 0, l = events.length ; i < l ; i++){
            customInstance["_fp"+events[i]] = jindo.$Fn(customInstance[events[i]],customInstance).bind();
            fpAdd(  
                        sType,
                        events[i],
                        vFilter,
                        customInstance["_fp"+events[i]]
            );
        }
        addCustomEventListener(eEle,eEle.__jindo__id,sEvent,vFilter,customInstance);
    }else{
        var customInstance = getCustomEventListener(eEle.__jindo__id, sEvent, vFilter).custom;
        if(customInstance.real_listener){
            customInstance.real_listener.push(fpCallback);
            customInstance.wrap_listener.push(fpCallbackBind);
        }
    }
}


function normalCustomEventAttach(ele,sEvent,jindo_id,vFilter,fpCallback,fpCallbackBind){
    if(!normalCustomEvent[sEvent][jindo_id]){
        normalCustomEvent[sEvent][jindo_id] = {};
        normalCustomEvent[sEvent][jindo_id].ele = ele;
        normalCustomEvent[sEvent][jindo_id][vFilter] = {};
        normalCustomEvent[sEvent][jindo_id][vFilter].real_listener = [];
        normalCustomEvent[sEvent][jindo_id][vFilter].wrap_listener = [];
    }
    normalCustomEvent[sEvent][jindo_id][vFilter].real_listener.push(fpCallback);
    normalCustomEvent[sEvent][jindo_id][vFilter].wrap_listener.push(fpCallbackBind);
}

/**
{{_add}}
 */
jindo.$Element.prototype._add = function(sType, sEvent , vFilter , fpCallback){
    var oManager = jindo.$Element.eventManager;
    var realEvent = sEvent;
    sEvent = sEvent.toLowerCase();
    var oEvent = oManager.splitGroup(sEvent);
    sEvent = oEvent.event;
    var sGroup = oEvent.group;
    var ele = this._element;
    var jindo_id = ele.__jindo__id;
    var oDoc = ele.ownerDocument || ele.document || document;
    
    if(hasCustomEvent(sEvent)){
        vFilter = vFilter||"_NONE_";
        var fpCallbackBind = jindo.$Fn(fpCallback,this).bind();
        normalCustomEventAttach(ele,sEvent,jindo_id,vFilter,fpCallback,fpCallbackBind);
        if(getCustomEvent(sEvent)){
            customEventAttach(sType, sEvent,vFilter,fpCallback,fpCallbackBind,ele,jindo.$Fn(this._add,this).bind());
        }
    }else{
    
        if(sEvent == "domready" && jindo.$Jindo.isWindow(ele)){
            jindo.$Element(oDoc).attach(sEvent, fpCallback);
            return this;
        }
        
        if(sEvent == "load" && ele === oDoc){
            jindo.$Element(window).attach(sEvent, fpCallback);
            return this;
        }
        
        sEvent = oManager.revisionEvent(sType, sEvent,realEvent);
        fpCallback = oManager.revisionCallback(sType, sEvent, realEvent, fpCallback);
        
        if(!oManager.isInit(this._key)){
            oManager.init(this._key, ele);
        }
        
        if(!oManager.hasEvent(this._key, sEvent,realEvent)){
            oManager.initEvent(this, sEvent,realEvent,sGroup);
        }
        
        if(!oManager.hasGroup(this._key, sEvent, sGroup)){
            oManager.initGroup(this._key, sEvent, sGroup);
        }
        oManager.addEventListener(this._key, sEvent, sGroup, sType, vFilter, fpCallback);
    }

    return this;
};

function customEventDetach(sType,sEvent,vFilter,fpCallback,eEle,fpDel){
    
    var customObj = getCustomEventListener(eEle.__jindo__id, sEvent, vFilter);
    var customInstance = customObj.custom;
    var events = customInstance.events;
    for(var i = 0, l = events.length ; i < l ; i++){
        fpDel(  
                    sType,
                    events[i],
                    vFilter,
                    customInstance["_fp"+events[i]]
            );
    }
}

/**
{{_del}}
 */
jindo.$Element.prototype._del = function(sType, sEvent, vFilter, fpCallback){
    var oManager = jindo.$Element.eventManager;
    var realEvent = sEvent;
    sEvent = sEvent.toLowerCase();
    var oEvent = oManager.splitGroup(sEvent);
    sEvent = oEvent.event;
    var sGroup = oEvent.group;
    var oDoc = this._element.ownerDocument || this._element.document || document;
    if(hasCustomEvent(sEvent)){
        var jindo_id = this._element.__jindo__id;
        vFilter = vFilter||"_NONE_";
        
        var oNormal = getNormalEventListener(jindo_id, sEvent, vFilter);
        
        
        
        var aWrap = oNormal.wrap_listener;
        var aReal = oNormal.real_listener;
        var aNewWrap = [];
        var aNewReal = [];
        
        for(var i = 0, l = aReal.length; i < l; i++){
            if(aReal[i]!=fpCallback){
                aNewWrap.push(aWrap[i]);
                aNewReal.push(aReal[i]);
            }
        }
        
        if(aNewReal.length==0){
            var oNormalJindo = normalCustomEvent[sEvent][jindo_id];
            var count = 0;
            for(var i in oNormalJindo){
                if(i!=="ele"){
                    count++;
                    break;
                }
            }
            if(count === 0){
                delete normalCustomEvent[sEvent][jindo_id];
            }else{
                delete normalCustomEvent[sEvent][jindo_id][vFilter];
            }
        }
        
        if(customEvent[sEvent]){
            // var customInstance = getCustomEventListener(jindo__id, sEvent, vFilter).custom;
//             
            // var aWrap = customInstance.wrap_listener;
            // var aReal = customInstance.real_listener;
            // var aNewWrap = [];
            // var aNewReal = [];
//             
            // for(var i = 0, l = aReal.length; i < l; i++){
                // if(aReal[i]!=fpCallback){
                    // aNewWrap.push(aWrap[i]);
                    // aNewReal.push(aReal[i]);
                // }
            // }
            setCustomEventListener(jindo_id, sEvent, vFilter, aNewReal, aNewWrap);
            if(aNewReal.length==0){
                customEventDetach(sType, sEvent,vFilter,fpCallback,this._element,jindo.$Fn(this._del,this).bind());
                delete customEventStore[jindo_id][sEvent][vFilter];
            }
        }
        
    }else{
    
        if(sEvent == "domready" && jindo.$Jindo.isWindow(this._element)){
            jindo.$Element(oDoc).detach(sEvent, fpCallback);
            return this;
        }
        
        if(sEvent == "load" && this._element === oDoc){
            jindo.$Element(window).detach(sEvent, fpCallback);
            return this;
        }
        
        sEvent = oManager.revisionEvent(sType, sEvent,realEvent);
        
        var NONE_GROUP = "_jindo_event_none";
        // if(sGroup === NONE_GROUP && !jindo.$Jindo.isFunction(fpCallback)){
        if(sGroup === NONE_GROUP && !jindo.$Jindo.isFunction(fpCallback)&&!vFilter){        
            throw new jindo.$Error(jindo.$Except.HAS_FUNCTION_FOR_GROUP,"$Element#"+(sType=="normal"?"detach":"delegate"));
        }
        
        oManager.removeEventListener(this._key, sEvent, sGroup, sType, vFilter, fpCallback);
    }
    return this;
};

/**
{{eventManager}}
 */

var mouseTouchPointerEvent = function (sEvent){
    var eventMap = {};
    if(window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0){
        eventMap = {
            "mousedown":"MSPointerDown",
            "mouseup":"MSPointerUp",
            "mousemove":"MSPointerMove",
            "mouseover":"MSPointerOver",
            "mouseout":"MSPointerOut",
            "touchstart":"MSPointerDown",
            "touchend":"MSPointerUp",
            "touchmove":"MSPointerMove",
            "pointerdown":"MSPointerDown",
            "pointerup":"MSPointerUp",
            "pointermove":"MSPointerMove",
            "pointerover":"MSPointerOver",
            "pointerout":"MSPointerOut",
            "pointercancel":"MSPointerCancel"
        };
    
    }else if(_JINDO_IS_MO){
        
        eventMap = {
            "mousedown":"touchstart",
            "mouseup":"touchend",
            "mousemove":"touchmove",
            "pointerdown":"touchstart",
            "pointerup":"touchend",
            "pointermove":"touchmove"
        }
    }
    mouseTouchPointerEvent = function(sEvent){
        return eventMap[sEvent]?eventMap[sEvent]:sEvent;    
    }
    
    return mouseTouchPointerEvent(sEvent);
}
jindo.$Element.eventManager = (function(){
    var eventStore = {};
    var NONE_GROUP = "_jindo_event_none";
    function bind(fpFunc, oScope, aPram){
        return function() {
            var args = _slice.call( arguments, 0);
            if (aPram.length) args = aPram.concat(args);
            return fpFunc.apply(oScope, args);
        };
    }
    var touch = {
         "mousedown":"mousedown",
         "mousemove":"mousemove",
         "mouseup":"mouseup"
    };
    return {
        /**
        {{revisionCallback}}
         */
        revisionCallback : function(sType, sEvent, realEvent, fpCallback){
            if(realEvent=="mouseenter"||realEvent=="mouseleave"){
                var fpWrapCallback = jindo.$Element.eventManager._fireWhenElementBoundary(sType, fpCallback);
                fpWrapCallback._origin_ = fpCallback;
                fpCallback = fpWrapCallback;
            }
            return fpCallback;
        },
        /**
        {{_fireWhenElementBoundary}}
         */
        _fireWhenElementBoundary : function(sType, fpCallback){
            return function(oEvent){
                var woRelatedElement = oEvent.relatedElement?jindo.$Element(oEvent.relatedElement):null;
                var eElement = oEvent.currentElement;
                if(sType == "delegate"){
                    eElement = oEvent.element;
                }
                if(woRelatedElement && (woRelatedElement.isEqual(eElement) || woRelatedElement.isChildOf(eElement))) return;
                
                fpCallback(oEvent);
            }
        },
        /**
        {{revisionEvent}}
         */
        revisionEvent : function(sType, sEvent,realEvent){
           if(/^ms/i.test(realEvent)){
                return realEvent;
            }
            var customEvent = jindo.$Event.hook(sEvent);
            if(customEvent){
                if(jindo.$Jindo.isFunction(customEvent)){
                    return customEvent(); 
                }else{
                    return customEvent;
                }
            }
            sEvent = sEvent.toLowerCase();
            if (sEvent == "domready" || sEvent == "domcontentloaded") {
                sEvent = "DOMContentLoaded";
            }else if (sEvent == "mousewheel" && !_JINDO_IS_WK && !_JINDO_IS_OP) {
                /*
                 {{revisionEvent_1}}
                 */
                sEvent = "DOMMouseScroll";  
            }else if (sEvent == "mouseenter"){
                sEvent = "mouseover";
            }else if (sEvent == "mouseleave"){
                sEvent = "mouseout";
            }else if(sEvent == "transitionend"||sEvent == "transitionstart"){
                var sPostfix = sEvent.replace("transition","");
                var info = getStyleIncludeVendorPrefix();
                if(info.transition != "transition"){
                    sPostfix = sPostfix.substr(0,1).toUpperCase() + sPostfix.substr(1);
                }
                sEvent = info.transition + sPostfix;
            }else if(sEvent == "animationstart"||sEvent == "animationend"||sEvent == "animationiteration"){
                var sPostfix = sEvent.replace("animation","");
                var info = getStyleIncludeVendorPrefix();
                if(info.animation != "animation"){
                    sPostfix = sPostfix.substr(0,1).toUpperCase() + sPostfix.substr(1);
                }
                sEvent = info.animation + sPostfix;
            }else if(sEvent === "focusin"||sEvent === "focusout"){
                sEvent = sEvent === "focusin" ? "focus":"blur";
            }      
            return mouseTouchPointerEvent(sEvent);
        },
        /**
        {{test}}
         */
        test : function(){
            return eventStore;
        },
        /**
        {{isInit}}
         */
        isInit : function(sKey){
            return !!eventStore[sKey];
        },
        /**
        {{init}}
         */
        init : function(sKey, eEle){
            eventStore[sKey] = {
                "ele" : eEle,
                "event" : {}
            }
        },
        /**
        {{getEventConfig}}
         */
        getEventConfig : function(sKey){
            return eventStore[sKey];
        },
        /**
        {{hasEvent}}
         */
        hasEvent : function(sKey, sEvent,realEvent){
            sEvent = jindo.$Element.eventManager.revisionEvent("", sEvent,realEvent);
            
            try{
                return !!eventStore[sKey]["event"][sEvent];
            }catch(e){
                return false;
            }
        },
        /**
        {{hasGroup}}
         */
        hasGroup : function(sKey, sEvent, sGroup){
            return !!eventStore[sKey]["event"][sEvent]["type"][sGroup];
        },
        /**
        {{initEvent}}
         */
        initEvent : function(oThis, sEvent, realEvent, sGroup){
            var sKey = oThis._key;
            var oEvent = eventStore[sKey]["event"];
            
            var fAroundFunc = bind(function(sEvent,realEvent,wEvent){
                    
                wEvent = wEvent || window.event;
                if (wEvent.currentTarget === undefined) {
                    wEvent.currentTarget = this._element;
                }
                var weEvent = jindo.$Event(wEvent);
                if(!weEvent.currentElement){
                    weEvent.currentElement = this._element;
                }
                weEvent.realType = realEvent;
                var oEle = weEvent.element;
                var oManager = jindo.$Element.eventManager;
                var oConfig = oManager.getEventConfig(weEvent.currentElement.__jindo__id);
                
                var oType = oConfig["event"][sEvent].type;
                for(var i in oType){
                    if(oType.hasOwnProperty(i)){
                        var aNormal = oType[i].normal;
                        for(var j = 0, l = aNormal.length; j < l; j++){
                            aNormal[j].call(this, weEvent);
                        }
                        var oDelegate = oType[i].delegate;
                        var aResultFilter;
                        var afpFilterCallback;
                        for(var k in oDelegate){
                            if(oDelegate.hasOwnProperty(k)){
                                aResultFilter = oDelegate[k].checker(oEle);
                                if(aResultFilter[0]){
                                    afpFilterCallback = oDelegate[k].callback;
                                    weEvent.element = aResultFilter[1];
                                    for(var m = 0, leng = afpFilterCallback.length; m < leng ; m++){
                                        afpFilterCallback[m].call(this, weEvent);
                                    }
                                }
                            }
                        }
                    }
                    
                }
            },oThis,[sEvent,realEvent]);
            
            oEvent[sEvent] = {
                "listener" : fAroundFunc,
                "type" :{}
            }           
            jindo.$Element._eventBind(oThis._element,sEvent,fAroundFunc,(realEvent==="focusin" || realEvent==="focusout"));
            
        },
        /**
        {{initGroup}}
         */
        initGroup : function(sKey, sEvent, sGroup){
            var oType = eventStore[sKey]["event"][sEvent]["type"];
            oType[sGroup] = {
                "normal" : [],
                "delegate" :{}
            }
        },
        /**
        {{addEventListener}}
         */
        addEventListener : function(sKey, sEvent, sGroup, sType, vFilter, fpCallback){
            var oEventInfo = eventStore[sKey]["event"][sEvent]["type"][sGroup];
            
            if(sType === "normal"){
                oEventInfo.normal.push(fpCallback);
            }else if(sType === "delegate"){
                if(!this.hasDelegate(oEventInfo,vFilter)){
                    this.initDelegate(eventStore[sKey].ele,oEventInfo,vFilter);
                }
                this.addDelegate(oEventInfo,vFilter,fpCallback);
            }
            
        },
        /**
         {{hasDelegate}}
         */
        hasDelegate : function(oEventInfo,vFilter){
            return !!oEventInfo.delegate[vFilter];
        },
        containsElement : function(eOwnEle, eTarget, sCssquery){
            var aSelectElement = jindo.$$(sCssquery,eOwnEle);
            for(var i = 0, l = aSelectElement.length; i < l; i++){
                if(aSelectElement[i] == eTarget){
                    return true;
                }
            }  
            return false;
        },
        /**
        {{initDelegate}}
         */
        initDelegate : function(eOwnEle,oEventInfo,vFilter){
            var fpCheck;
            if(jindo.$Jindo.isString(vFilter)){
                fpCheck = bind(function(eOwnEle,sCssquery,oEle){
                    var eIncludeEle = oEle;
                    var isIncludeEle = this.containsElement(eOwnEle, oEle, sCssquery);
                    if(!isIncludeEle){
                        var aPropagationElements = this._getParent(eOwnEle,oEle);
                        for(var i = 0, leng = aPropagationElements.length ; i < leng ; i++){
                            eIncludeEle = aPropagationElements[i];
                            if(this.containsElement(eOwnEle, eIncludeEle, sCssquery)){
                                isIncludeEle = true;
                                break;
                            }
                        }
                    }
                    return [isIncludeEle,eIncludeEle];
                },this,[eOwnEle,vFilter]);
            }else{
                fpCheck = bind(function(eOwnEle,fpFilter,oEle){
                    var eIncludeEle = oEle;
                    var isIncludeEle = fpFilter(eOwnEle,oEle);
                    if(!isIncludeEle){
                        var aPropagationElements = this._getParent(eOwnEle,oEle);
                        for(var i = 0, leng = aPropagationElements.length ; i < leng ; i++){
                            eIncludeEle = aPropagationElements[i];
                            if(fpFilter(eOwnEle,eIncludeEle)){
                                isIncludeEle = true;
                                break;
                            }
                        }
                    }
                    return [isIncludeEle,eIncludeEle];
                },this,[eOwnEle,vFilter]);
            }
            oEventInfo.delegate[vFilter] = {
                "checker" : fpCheck,
                "callback" : []
            }
        },
        /**
        {{addDelegate}}
         */
        addDelegate : function(oEventInfo,vFilter,fpCallback){
            oEventInfo.delegate[vFilter].callback.push(fpCallback);
        },
        /**
        {{removeEventListener}}
         */
        removeEventListener : function(sKey, sEvent, sGroup, sType, vFilter, fpCallback){
            var oEventInfo;
            try{
                oEventInfo = eventStore[sKey]["event"][sEvent]["type"][sGroup];
            }catch(e){
                return;
            }
            var aNewCallback = [];
            var aOldCallback;
            if(sType === "normal"){
                aOldCallback = oEventInfo.normal;
            }else{
                aOldCallback  = oEventInfo.delegate[vFilter].callback;
            }
            if (sEvent == NONE_GROUP || jindo.$Jindo.isFunction(fpCallback)) {
                for(var i = 0, l = aOldCallback.length; i < l; i++){
                    if((aOldCallback[i]._origin_||aOldCallback[i]) != fpCallback){
                        aNewCallback.push(aOldCallback[i]);
                    }
                }
            }
            if(sType === "normal"){
                delete oEventInfo.normal;
                oEventInfo.normal = aNewCallback;
            }else if(sType === "delegate"){
                delete oEventInfo.delegate[vFilter].callback;
                oEventInfo.delegate[vFilter].callback = aNewCallback;
            }
            this.cleanUp(sKey, sEvent);
        },
        /**
        {{cleanUpAll}}
         */
        cleanUpAll : function(){
            var oEvent;
            for(var sKey in eventStore){
                if (eventStore.hasOwnProperty(sKey)) {
                    this.cleanUpUsingKey(sKey, true);
                }
            }
        },
        /**
        {{cleanUpUsingKey}}
         */
        cleanUpUsingKey : function(sKey, bForce){
            var oEvent;
            
            if(!eventStore[sKey] || !eventStore[sKey].event){
                return;
            }
            
            oEvent = eventStore[sKey].event;
            
            for(var sEvent in oEvent){
                if (oEvent.hasOwnProperty(sEvent)) {
                    this.cleanUp(sKey, sEvent, bForce);
                }
            }
        },
        /**
        {{cleanUp}}
         */
        cleanUp : function(sKey, sEvent, bForce){
            var oTypeInfo; 
            try{
                oTypeInfo = eventStore[sKey]["event"][sEvent]["type"];
            }catch(e){
                return;
            }
            var oEventInfo;
            var bHasEvent = false;
            if(!bForce){
                for(var i in oTypeInfo){
                    if (oTypeInfo.hasOwnProperty(i)) {
                        oEventInfo = oTypeInfo[i];
                        if(oEventInfo.normal.length){
                            bHasEvent = true;
                            break;
                        }
                        var oDele = oEventInfo.delegate;
                        for(var j in oDele){ 
                            if (oDele.hasOwnProperty(j)) {
                                if(oDele[j].callback.length){
                                    bHasEvent = true;
                                    break;
                                }
                            }
                        }
                        if(bHasEvent) break;
                        
                    }
                }
            }
            if(!bHasEvent){
                jindo.$Element._unEventBind(eventStore[sKey].ele, sEvent, eventStore[sKey]["event"][sEvent]["listener"]);
                delete eventStore[sKey]["event"][sEvent];
                var bAllDetach = true;
                var oEvent = eventStore[sKey]["event"];
                for(var k in oEvent){
                    if (oEvent.hasOwnProperty(k)) {
                        bAllDetach = false;
                        break;
                    }
                }
                if(bAllDetach){
                    delete eventStore[sKey];
                }
            }
        },
        /**
        {{splitGroup}}
         */
        splitGroup : function(sEvent){
            var aMatch = /\s*(.+?)\s*\(\s*(.*?)\s*\)/.exec(sEvent);
            if(aMatch){
                return {
                    "event" : aMatch[1].toLowerCase(),
                    "group" : aMatch[2].toLowerCase()
                }
            }else{
                return {
                    "event" : sEvent.toLowerCase(),
                    "group" : NONE_GROUP
                }
            }
        },
        /**
        {{_getParent}}
         */
        _getParent : function(oOwnEle, oEle){
            var e = oOwnEle;
            var a = [], p = null;
            var oDoc = oEle.ownerDocument || oEle.document || document;
            while (oEle.parentNode && p != e) {
                p = oEle.parentNode;
                if (p == oDoc.documentElement) break;
                a[a.length] = p;
                oEle = p;
            }
        
            return a;
        }
    };
})();
/*
{{element_attach_data}}
 */
//-!jindo.$Element.event_etc.hidden end!-//

//-!jindo.$Element.unload.hidden start!-//
/*
{{element_unload}}
 */

//-!jindo.$Element.unload.hidden end!-//


/**
 {{title}}
 */
//-!jindo.$Element._getTransition.hidden start!-//

//-!jindo.$Element._getTransition.hidden end!-//

//-!jindo.$Element.prototype.appear start(jindo.$Element._getTransition,jindo.$Element.prototype.opacity,jindo.$Element.prototype.show)!-//
/**
 {{appear}}
 */
jindo.$Element.prototype.appear = function(duration, callback) {
    //-@@$Element.appear-@@//
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [ ],
        '4num' : [ 'nDuration:'+tNumeric],
        '4fun' : [ 'nDuration:'+tNumeric ,'fpCallback:'+tFunction]
    },"$Element#appear");
    
    switch(oArgs+""){
        case "4voi":
            duration = 0.3;
            callback = function(){};
            break;
        case "4num":
            duration = oArgs.nDuration;
            callback = function(){};
            break;
        case "4fun":
            duration = oArgs.nDuration;
            callback = oArgs.fpCallback;
            
    }
    var self = this;
    var ele = this._element;
    
    var oTransition = getStyleIncludeVendorPrefix();
    var name = oTransition.transition;
    var endName;
    if(name == "transition"){
        endName = "end";
    }else{
        endName = "End";
    }
    
    var bindFunc = function(){
        self.show();
        ele.style[name + 'Property'] = '';
        ele.style[name + 'Duration'] = '';
        ele.style[name + 'TimingFunction'] = '';
        ele.style.opacity = '';
        callback.call(self,self);
        ele.removeEventListener(name+endName, arguments.callee , false );
    };
    if(!this.visible()){
        ele.style.opacity = ele.style.opacity||0;
        self.show();
    }
    ele.addEventListener( name+endName, bindFunc , false );
    ele.style[name + 'Property'] = 'opacity';
    ele.style[name + 'Duration'] = duration+'s';
    ele.style[name + 'TimingFunction'] = 'linear';
    
    setOpacity(ele,"1");
    
    return this;
};
//-!jindo.$Element.prototype.appear end!-//

//-!jindo.$Element.prototype.disappear start(jindo.$Element._getTransition,jindo.$Element.prototype.opacity)!-//
/**
 {{disappear}}
 */
jindo.$Element.prototype.disappear = function(duration, callback) {
    //-@@$Element.disappear-@@//
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [ ],
        '4num' : [ 'nDuration:'+tNumeric],
        '4fun' : [ 'nDuration:'+tNumeric ,'fpCallback:'+tFunction]
    },"$Element#disappear");
    
    switch(oArgs+""){
        case "4voi":
            duration = 0.3;
            callback = function(){};
            break;
        case "4num":
            duration = oArgs.nDuration;
            callback = function(){};
            break;
        case "4fun":
            duration = oArgs.nDuration;
            callback = oArgs.fpCallback;
            
    }
    var self = this;
    var ele = this._element;
    
    var oTransition = getStyleIncludeVendorPrefix();
    // var oTransition = jindo.$Element._getTransition();
    var name = oTransition.transition;
    var endName;
    if(name == "transition"){
        endName = "end";
    }else{
        endName = "End";
    }
    
    var bindFunc = function(){
        self.hide();
        ele.style[name + 'Property'] = '';
        ele.style[name + 'Duration'] = '';
        ele.style[name + 'TimingFunction'] = '';
        ele.style.opacity = '';
        callback.call(self,self);
        ele.removeEventListener(name+endName, arguments.callee , false );
    };
    ele.addEventListener(endName, bindFunc , false );


    ele.style[name + 'Property'] = 'opacity';
    ele.style[name + 'Duration'] = duration+'s';
    ele.style[name + 'TimingFunction'] = 'linear';
    /*
     {{disappear_1}}
     */
    setOpacity(ele,"0");

    return this;
};
//-!jindo.$Element.prototype.disappear end!-//

//-!jindo.$Element.prototype.offset start!-//
/**
 {{offset}}
 */
/**
 {{offset2}}
 */
jindo.$Element.prototype.offset = function(nTop, nLeft) {
    //-@@$Element.offset-@@//
    var oArgs = g_checkVarType(arguments, {
        'g' : [ ],
        's' : [ 'nTop:'+tNumeric, 'nLeft:'+tNumeric]
    },"$Element#offset");
    
    switch(oArgs+""){
        case "g":
            return this.offset_get();
            
        case "s":
            return this.offset_set(oArgs.nTop, oArgs.nLeft);
            
    }
};

jindo.$Element.prototype.offset_set = function(nTop,nLeft){
    var oEl = this._element;
    var oPhantom = null;
    
    if (isNaN(parseFloat(this._getCss(oEl,'top')))) oEl.style.top = "0px";
    if (isNaN(parseFloat(this._getCss(oEl,'left')))) oEl.style.left = "0px";

    var oPos = this.offset_get();
    var oGap = { top : nTop - oPos.top, left : nLeft - oPos.left };

    oEl.style.top = parseFloat(this._getCss(oEl,'top')) + oGap.top + 'px';
    oEl.style.left = parseFloat(this._getCss(oEl,'left')) + oGap.left + 'px';

    return this;
};

jindo.$Element.prototype.offset_get = function(nTop,nLeft){
    var oEl = this._element;
    var oPhantom = null;
    
    var bOnlySafari = _JINDO_IS_SP&&!_JINDO_IS_CH;
    var nVer = 0;
    
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
                oPhantom = { left : 0, top : 0 };

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
    
    return (bOnlySafari ? fpSafari : fpOthers)(oEl);
};
//-!jindo.$Element.prototype.offset end!-//

//-!jindo.$Element.prototype.evalScripts start!-//
/**
 {{evalScripts}}
 */
jindo.$Element.prototype.evalScripts = function(sHTML) {
    //-@@$Element.evalScripts-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str' : [ "sHTML:"+tString ]
    },"$Element#evalScripts");
    var aJS = [];
    sHTML = sHTML.replace(new RegExp('<script(\\s[^>]+)*>(.*?)</'+'script>', 'gi'), function(_1, _2, sPart) { aJS.push(sPart); return ''; });
    eval(aJS.join('\n'));
    
    return this;

};
//-!jindo.$Element.prototype.evalScripts end!-//

//-!jindo.$Element._common.hidden start!-//
/**
 * @ignore
 */
jindo.$Element._common = function(oElement,sMethod){

    try{
        return jindo.$Element(oElement)._element;
    }catch(e){
        throw TypeError(e.message.replace(/\$Element/g,"$Element#"+sMethod).replace(/Element\.html/g,"Element.html#"+sMethod));
    }
};
//-!jindo.$Element._common.hidden end!-//
//-!jindo.$Element._prepend.hidden start(jindo.$)!-//
/**
 {{sign_prepend}}
 */
jindo.$Element._prepend = function(oParent, oChild){
    var nodes = oParent.childNodes;
    if (nodes.length > 0) {
        oParent.insertBefore(oChild, nodes[0]);
    } else {
        oParent.appendChild(oChild);
    }
};
//-!jindo.$Element._prepend.hidden end!-//

//-!jindo.$Element.prototype.append start(jindo.$Element._common)!-//
/**
 {{append}}
 */
jindo.$Element.prototype.append = function(oElement) {
    //-@@$Element.append-@@//
    this._element.appendChild(jindo.$Element._common(oElement,"append"));
    return this;
};
//-!jindo.$Element.prototype.append end!-//

//-!jindo.$Element.prototype.prepend start(jindo.$Element._prepend)!-//
/** 
 {{prepend}}
 */
jindo.$Element.prototype.prepend = function(oElement) {
    //-@@$Element.prepend-@@//
    jindo.$Element._prepend(this._element, jindo.$Element._common(oElement,"prepend"));
    
    return this;
};
//-!jindo.$Element.prototype.prepend end!-//

//-!jindo.$Element.prototype.replace start(jindo.$Element._common)!-//
/**
 {{replace}}
 */
jindo.$Element.prototype.replace = function(oElement) {
    //-@@$Element.replace-@@//
    oElement = jindo.$Element._common(oElement,"replace");
    if(jindo.cssquery) jindo.cssquery.release();
    var e = this._element;
    var oParentNode = e.parentNode;
    if(oParentNode&&oParentNode.replaceChild){
        oParentNode.replaceChild(oElement,e);
        return this;
    }
    
    var _o = oElement;

    oParentNode.insertBefore(_o, e);
    oParentNode.removeChild(e);

    return this;
};
//-!jindo.$Element.prototype.replace end!-//

//-!jindo.$Element.prototype.appendTo start(jindo.$Element._common)!-//
/**
 {{appendTo}}
 */
jindo.$Element.prototype.appendTo = function(oElement) {
    //-@@$Element.appendTo-@@//
    jindo.$Element._common(oElement,"appendTo").appendChild(this._element);
    return this;
};
//-!jindo.$Element.prototype.appendTo end!-//

//-!jindo.$Element.prototype.prependTo start(jindo.$Element._prepend, jindo.$Element._common)!-//
/**
 {{prependTo}}
 */
jindo.$Element.prototype.prependTo = function(oElement) {
    //-@@$Element.prependTo-@@//
    jindo.$Element._prepend(jindo.$Element._common(oElement,"prependTo"), this._element);
    return this;
};
//-!jindo.$Element.prototype.prependTo end!-//

//-!jindo.$Element.prototype.before start(jindo.$Element._common)!-//
/**
 {{before}}
 */
jindo.$Element.prototype.before = function(oElement) {
    //-@@$Element.before-@@//
    var o = jindo.$Element._common(oElement,"before");

    this._element.parentNode.insertBefore(o, this._element);

    return this;
};
//-!jindo.$Element.prototype.before end!-//

//-!jindo.$Element.prototype.after start(jindo.$Element.prototype.before, jindo.$Element._common)!-//
/**
 {{after}}
 */
jindo.$Element.prototype.after = function(oElement) {
    //-@@$Element.after-@@//
    oElement = jindo.$Element._common(oElement,"after");
    this.before(oElement);
    jindo.$Element(oElement).before(this);

    return this;
};
//-!jindo.$Element.prototype.after end!-//

//-!jindo.$Element.prototype.parent start!-//
/**
 {{parent}}
 */
jindo.$Element.prototype.parent = function(pFunc, limit) {
    //-@@$Element.parent-@@//
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [],
        '4fun' : [ 'fpFunc:'+tFunction ],
        '4nul' : [ 'fpFunc:'+tNull ],
        'for_function_number' : [ 'fpFunc:'+tFunction, 'nLimit:'+tNumeric],
        'for_null_number' : [ 'fpFunc:'+tNull, 'nLimit:'+tNumeric ]
    },"$Element#parent");
    
    var e = this._element;
    
    switch(oArgs+""){
        case "4voi":
            return e.parentNode?jindo.$Element(e.parentNode):null;
        case "4fun":
        case "4nul":
             limit = -1;
             break;
        case "for_function_number":
        case "for_null_number":
            if(oArgs.nLimit==0)limit = -1; 
            
    }
    
    
    var a = [], p = null;

    while (e.parentNode && limit-- != 0) {
        try{
            p = jindo.$Element(e.parentNode);
        }catch(e){
            p = null;
        }
        if (e.parentNode == document.documentElement) break;
        if (!pFunc || (pFunc && pFunc.call(this,p))) a[a.length] = p;

        e = e.parentNode;
    }
    return a;
};
//-!jindo.$Element.prototype.parent end!-//

//-!jindo.$Element.prototype.child start!-//
/**
 {{child}}
 */
jindo.$Element.prototype.child = function(pFunc, limit) {
    //-@@$Element.child-@@//
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [],
        '4fun' : [ 'fpFunc:'+tFunction ],
        '4nul' : [ 'fpFunc:'+tNull ],
        'for_function_number' : [ 'fpFunc:'+tFunction, 'nLimit:'+tNumeric],
        'for_null_number' : [ 'fpFunc:'+tNull, 'nLimit:'+tNumeric ]
    },"$Element#child");
    var e = this._element;
    var a = [], c = null, f = null;
    
    switch(oArgs+""){
        case "4voi":
            var child = e.childNodes;
            var filtered = [];
            for(var  i = 0, l = child.length ; i < l ; i++){
                if(child[i].nodeType == 1){
                    try{
                        filtered.push(jindo.$Element(child[i]));
                    }catch(e){
                        filtered.push(null);
                    }
                }
            }
            return filtered;
        case "4fun":
        case "4nul":
             limit = -1;
             break;
        case "for_function_number":
        case "for_null_number":
            if(oArgs.nLimit==0)limit = -1; 
            
    }

    (f = function(el, lim, context){
        var ch = null, o = null;

        for(var i=0; i < el.childNodes.length; i++) {
            ch = el.childNodes[i];
            if (ch.nodeType != 1) continue;
            try{
                o = jindo.$Element(el.childNodes[i]);
            }catch(e){
                o = null;
            }
            if (!pFunc || (pFunc && pFunc.call(context,o))) a[a.length] = o;
            if (lim != 0) f(el.childNodes[i], lim-1);
        }
    })(e, limit-1,this);

    return a;
};
//-!jindo.$Element.prototype.child end!-//

//-!jindo.$Element.prototype.prev start!-//
/**
 {{prev}}
 */
jindo.$Element.prototype.prev = function(pFunc) {
    //-@@$Element.prev-@@//
    
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [],
        '4fun' : [ 'fpFunc:'+tFunction ],
        '4nul' : [ 'fpFunc:'+tNull ]
    },"$Element#prev");
    
    var e = this._element;
    var a = [];
    
    switch(oArgs+""){
        case "4voi":
            if (!e) return null;
            do {
                
                e = e.previousSibling;
                if (!e || e.nodeType != 1) continue;
                try{
                    if(e==null) return null;
                    return jindo.$Element(e);   
                }catch(e){
                    return null;
                }
            } while(e);
            try{
                if(e==null) return null;
                return jindo.$Element(e);   
            }catch(e){
                return null;
            }
        case "4fun":
        case "4nul":
            if (!e) return a;
            do {
                e = e.previousSibling;
                
                if (!e || e.nodeType != 1) continue;
                if (!pFunc||pFunc.call(this,e)) {
                    
                    try{
                        if(e==null) a[a.length]=null;
                        else a[a.length] = jindo.$Element(e);
                    }catch(e){
                        a[a.length] = null;
                    }
                     
                }
            } while(e);
            try{
                return a;   
            }catch(e){
                return null;
            }
    }
};
//-!jindo.$Element.prototype.prev end!-//

//-!jindo.$Element.prototype.next start!-//
/**
 {{next}}
 */
jindo.$Element.prototype.next = function(pFunc) {
    //-@@$Element.next-@@//
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [],
        '4fun' : [ 'fpFunc:'+tFunction ],
        '4nul' : [ 'fpFunc:'+tNull ]
    },"$Element#next");
    var e = this._element;
    var a = [];
    
    switch(oArgs+""){
        case "4voi":
            if (!e) return null;
            do {
                e = e.nextSibling;
                if (!e || e.nodeType != 1) continue;
                try{
                    if(e==null) return null;
                    return jindo.$Element(e);   
                }catch(e){
                    return null;
                }
            } while(e);
            try{
                if(e==null) return null;
                return jindo.$Element(e);   
            }catch(e){
                return null;
            }
            
        case "4fun":
        case "4nul":
            if (!e) return a;
            do {
                e = e.nextSibling;
                
                if (!e || e.nodeType != 1) continue;
                if (!pFunc||pFunc.call(this,e)) {
                    
                    try{
                        if(e==null) a[a.length] = null;
                        else a[a.length] = jindo.$Element(e);
                    }catch(e){
                        a[a.length] = null;
                    }
                     
                }
            } while(e);
            try{
                return a;   
            }catch(e){
                return null;
            }
            
    }
};
//-!jindo.$Element.prototype.next end!-//

//-!jindo.$Element.prototype.first start!-//
/**
 {{first}}
 */
jindo.$Element.prototype.first = function() {
    //-@@$Element.first-@@//
    var el = this._element.firstElementChild||this._element.firstChild;
    if (!el) return null;
    while(el && el.nodeType != 1) el = el.nextSibling;
    try{
        return el?jindo.$Element(el):null;
    }catch(e){
        return null;
    }
};
//-!jindo.$Element.prototype.first end!-//

//-!jindo.$Element.prototype.last start!-//
/**
 {{last}}
 */
jindo.$Element.prototype.last = function() {
    //-@@$Element.last-@@//
    var el = this._element.lastElementChild||this._element.lastChild;
    if (!el) return null;
    while(el && el.nodeType != 1) el = el.previousSibling;

    try{
        return el?jindo.$Element(el):null;
    }catch(e){
        return null;
    }
};
//-!jindo.$Element.prototype.last end!-//

//-!jindo.$Element._contain.hidden start!-//
/**
 {{sign_contain}}
 */
jindo.$Element._contain = function(eParent,eChild){
    if (document.compareDocumentPosition) {
        return !!(eParent.compareDocumentPosition(eChild)&16);
    }else{
        var e  = eParent;
        var el = eChild;

        while(e && e.parentNode) {
            e = e.parentNode;
            if (e == el) return true;
        }
        return false;
    }
};
//-!jindo.$Element._contain.hidden end!-//

//-!jindo.$Element.prototype.isChildOf start(jindo.$Element._contain)!-//
/**
 {{isChildOf}}
 */
jindo.$Element.prototype.isChildOf = function(element) {
    //-@@$Element.isChildOf-@@//
    try{
        return jindo.$Element._contain(jindo.$Element(element)._element,this._element);
    }catch(e){
        return false;
    }
};
//-!jindo.$Element.prototype.isChildOf end!-//

//-!jindo.$Element.prototype.isParentOf start(jindo.$Element._contain)!-//
/**
 {{isParentOf}}
 */
jindo.$Element.prototype.isParentOf = function(element) {
    //-@@$Element.isParentOf-@@//
    try{
        return jindo.$Element._contain(this._element, jindo.$Element(element)._element);
    }catch(e){
        return false;
    }
};
//-!jindo.$Element.prototype.isParentOf end!-//

//-!jindo.$Element.prototype.isEqual start!-//
/**
 {{isEqual}}
 */
jindo.$Element.prototype.isEqual = function(element) {
    //-@@$Element.isEqual-@@//
    try {
        return (this._element === jindo.$Element(element)._element);
    } catch(e) {
        return false;
    }
};
//-!jindo.$Element.prototype.isEqual end!-//

//-!jindo.$Element.prototype.fireEvent start!-//
/**
 {{fireEvent}}
 */

function fireCustomEvent(ele, sEvent,self,bIsNormalType){
    var oInfo = normalCustomEvent[sEvent];
    var targetEle,oEvent;
    for(var i in oInfo){
        oEvent = oInfo[i];
        targetEle = oEvent.ele;
        var wrap_listener;
        for(var sCssquery in oEvent){
            if(sCssquery==="_NONE_"){
                if(targetEle==ele || self.isChildOf(targetEle)){
                    wrap_listener = oEvent[sCssquery].wrap_listener;
                    for(var k = 0, l = wrap_listener.length; k < l;k++){
                        wrap_listener[k]();
                    }
                }
            }else{
                if(jindo.$Element.eventManager.containsElement(targetEle, ele, sCssquery)){
                    wrap_listener = oEvent[sCssquery].wrap_listener;
                    for(var k = 0, l = wrap_listener.length; k < l;k++){
                        wrap_listener[k]();
                    }
                }
            }
        }
    }
    
}
    
jindo.$Element.prototype.fireEvent = function(sEvent, oProps) {
    //-@@$Element.fireEvent-@@//
    var oArgs = g_checkVarType(arguments, {
            '4str' : [ jindo.$Jindo._F('sEvent:'+tString) ],
            '4obj' : [ 'sEvent:'+tString, 'oProps:'+tHash ]
    },"$Element#fireEvent");
    
    var ele = this._element;
    if(normalCustomEvent[sEvent]){
        fireCustomEvent(ele,sEvent,this,!!normalCustomEvent[sEvent]);
        return this;
    }
        
    var sType = "HTMLEvents";
    sEvent = (sEvent+"").toLowerCase();
    
    if (sEvent == "click" || sEvent.indexOf("mouse") == 0) {
        sType = "MouseEvent";
        if (sEvent == "mousewheel") sEvent = "dommousescroll";
    } else if (sEvent.indexOf("key") == 0) {
        sType = "KeyboardEvent";
    }
    var evt;
    switch (oArgs+"") {
        case "4obj":
            oProps = oArgs.oProps;
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
        break;
        case "4str":
            evt = document.createEvent(sType);          
            evt.initEvent(sEvent, true, true);
        
    }

    var el = this._element;
        
    // window.dispatchEvent is not exist in iOS 3.0
    if (jindo.$Jindo.isWindow(el) && /(iPhone|iPad|iPod).*OS\s+([0-9\.]+)/.test(navigator.userAgent) && parseFloat(RegExp.$2) < 4) {
        el = el.document;
    }
        
    el.dispatchEvent(evt);

    return this;
}
//-!jindo.$Element.prototype.fireEvent end!-//

//-!jindo.$Element.prototype.empty start(jindo.$Element.prototype.html)!-//
/**
 {{empty_1}}
 */
jindo.$Element.prototype.empty = function() {
    //-@@$Element.empty-@@//
    if(jindo.cssquery) jindo.cssquery.release();
    this.html("");
    return this;
};
//-!jindo.$Element.prototype.empty end!-//

//-!jindo.$Element.prototype.remove start(jindo.$Element.prototype.leave, jindo.$Element._common)!-//
/**
 {{remove}}
 */
jindo.$Element.prototype.remove = function(oChild) {
    //-@@$Element.remove-@@//
    if(jindo.cssquery) jindo.cssquery.release();
    var ___element = jindo.$Element;
    ___element(___element._common(oChild,"remove")).leave();
    return this;
};
//-!jindo.$Element.prototype.remove end!-//

//-!jindo.$Element.prototype.leave start(jindo.$Element.event_etc)!-//
/**
 {{leave}}
 */
jindo.$Element.prototype.leave = function() {
    //-@@$Element.leave-@@//
    var e = this._element;

    if (e.parentNode) {
        if(jindo.cssquery) jindo.cssquery.release();
        e.parentNode.removeChild(e);
    }
    
    if(this._element.__jindo__id){
        jindo.$Element.eventManager.cleanUpUsingKey(this._element.__jindo__id,true);
    }
    
    // releaseEventHandlerForAllChildren(this);
    
    return this;
};
//-!jindo.$Element.prototype.leave end!-//

//-!jindo.$Element.prototype.wrap start(jindo.$Element._common)!-//
/**
 {{wrap}}
 */
jindo.$Element.prototype.wrap = function(wrapper) {
    //-@@$Element.wrap-@@//
    var e = this._element;
    wrapper = jindo.$Element._common(wrapper,"wrap");
    if (e.parentNode) {
        e.parentNode.insertBefore(wrapper, e);
    }
    wrapper.appendChild(e);

    return this;
};
//-!jindo.$Element.prototype.wrap end!-//

//-!jindo.$Element.prototype.ellipsis start(jindo.$Element.prototype._getCss,jindo.$Element.prototype.text)!-//
/**
 {{ellipsis}} 
 */
jindo.$Element.prototype.ellipsis = function(stringTail) {
    //-@@$Element.ellipsis-@@//
    
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [ ],
        '4str' : [ 'stringTail:'+tString ]
    },"$Element#ellipsis");
    
    stringTail = stringTail || "...";
    var txt   = this.text();
    var len   = txt.length;
    var padding = parseInt(this._getCss(this._element,"paddingTop"),10) + parseInt(this._getCss(this._element,"paddingBottom"),10);
    var cur_h = this._element.offsetHeight - padding;
    var i     = 0;
    var h     = this.text('A')._element.offsetHeight - padding;

    if (cur_h < h * 1.5) {
        this.text(txt);
        return this;
    }

    cur_h = h;
    while(cur_h < h * 1.5) {
        i += Math.max(Math.ceil((len - i)/2), 1);
        cur_h = this.text(txt.substring(0,i)+stringTail)._element.offsetHeight - padding;
    }

    while(cur_h > h * 1.5) {
        i--;
        cur_h = this.text(txt.substring(0,i)+stringTail)._element.offsetHeight - padding;
    }
    return this;
};
//-!jindo.$Element.prototype.ellipsis end!-//

//-!jindo.$Element.prototype.indexOf start!-//
/**
 {{indexOf}}
 */
jindo.$Element.prototype.indexOf = function(element) {
    //-@@$Element.indexOf-@@//
    try {
        var e = jindo.$Element(element)._element;
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
//-!jindo.$Element.prototype.indexOf end!-//

//-!jindo.$Element.prototype.queryAll start(jindo.cssquery)!-//
/**
 {{queryAll}}
 */
jindo.$Element.prototype.queryAll = function(sSelector) { 
    //-@@$Element.queryAll-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str'  : [ 'sSelector:'+tString]
    },"$Element#queryAll");
    
    var arrEle = jindo.cssquery(sSelector, this._element);
    var returnArr = [];
    for(var i = 0, l = arrEle.length; i < l; i++){
        returnArr.push(jindo.$Element(arrEle[i]));
    }
    return returnArr; 
};
//-!jindo.$Element.prototype.queryAll end!-//

//-!jindo.$Element.prototype.query start(jindo.cssquery)!-//
/**
 {{query}}
 */
jindo.$Element.prototype.query = function(sSelector) { 
    //-@@$Element.query-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str'  : [ 'sSelector:'+tString]
    },"$Element#query");
    var ele =  jindo.cssquery.getSingle(sSelector, this._element);
    return ele === null? ele : jindo.$Element(ele); 
};
//-!jindo.$Element.prototype.query end!-//

//-!jindo.$Element.prototype.test start(jindo.cssquery)!-//
/**
 {{test}}
 */
jindo.$Element.prototype.test = function(sSelector) {
    //-@@$Element.test-@@// 
    var oArgs = g_checkVarType(arguments, {
        '4str'  : [ 'sSelector:'+tString]
    },"$Element#test");
    return jindo.cssquery.test(this._element, sSelector); 
};
//-!jindo.$Element.prototype.test end!-//

//-!jindo.$Element.prototype.xpathAll start(jindo.cssquery)!-//
/**
 {{xpathAll}}
 */
jindo.$Element.prototype.xpathAll = function(sXPath) {
    //-@@$Element.xpathAll-@@// 
    var oArgs = g_checkVarType(arguments, {
        '4str'  : [ 'sXPath:'+tString]
    },"$Element#xpathAll");
    var arrEle = jindo.cssquery.xpath(sXPath, this._element);
    var returnArr = [];
    for(var i = 0, l = arrEle.length; i < l; i++){
        returnArr.push(jindo.$Element(arrEle[i]));
    }
    return returnArr; 
};
//-!jindo.$Element.prototype.xpathAll end!-//

//-!jindo.$Element.prototype.insertAdjacentHTML.hidden start!-//
/**
 {{insertAdjacentHTML}}
 */
jindo.$Element.insertAdjacentHTML = function(ins,html,insertType,type,fn,sType){
    var aArg = [ html ];
    aArg.callee = arguments.callee;
    var oArgs = g_checkVarType(aArg, {
        '4str'  : [ 'sHTML:'+tString ]
    },"$Element#"+sType);
    var _ele = ins._element;
    html = html+"";
    if( _ele.insertAdjacentHTML && !(/^<(option|tr|td|th|col)(?:.*?)>/.test(html.replace(/^(\s|　)+|(\s|　)+$/g, "").toLowerCase()))){
        _ele.insertAdjacentHTML(insertType, html);
    }else{
        var oDoc = _ele.ownerDocument || _ele.document || document;
        var fragment = oDoc.createDocumentFragment();
        var defaultElement;
        var sTag = html.replace(/^(\s|\t)+|(\s|\t)+$/g, "");
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
        defaultElement = _createEle(sParent,sTag,oDoc,true);
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
};

//-!jindo.$Element.prototype.insertAdjacentHTML.hidden end!-//

//-!jindo.$Element.prototype.appendHTML start(jindo.$Element.prototype.insertAdjacentHTML)!-//
/**
 {{appendHTML}}
 */
jindo.$Element.prototype.appendHTML = function(sHTML) {
    //-@@$Element.appendHTML-@@//
    return jindo.$Element.insertAdjacentHTML(this,sHTML,"beforeEnd","firstChild",jindo.$Fn(function(oEle){
        var ele = this._element;
        if(ele.tagName.toLowerCase() === "table"){
            var nodes = ele.childNodes;
            for(var i=0,l=nodes.length; i < l; i++){
                if(nodes[i].nodeType==1){
                    ele = nodes[i]; 
                    break;
                }
                
            }
        };
        ele.appendChild(oEle);
    },this).bind(),"appendHTML");
};
//-!jindo.$Element.prototype.appendHTML end!-//

//-!jindo.$Element.prototype.prependHTML start(jindo.$Element.prototype.insertAdjacentHTML,jindo.$Element._prepend)!-//
/**
 {{prependHTML}}
 */
jindo.$Element.prototype.prependHTML = function(sHTML) {
    //-@@$Element.prependHTML-@@//
    var ___element = jindo.$Element
    return ___element.insertAdjacentHTML(this,sHTML,"afterBegin","firstChild",jindo.$Fn(function(oEle){
        var ele = this._element;
        if(ele.tagName.toLowerCase() === "table"){
            var nodes = ele.childNodes;
            for(var i=0,l=nodes.length; i < l; i++){
                if(nodes[i].nodeType==1){
                    ele = nodes[i]; 
                    break;
                }
                
            }
        };
        ___element._prepend(ele,oEle);
    },this).bind(),"prependHTML");
};
//-!jindo.$Element.prototype.prependHTML end!-//

//-!jindo.$Element.prototype.beforeHTML start(jindo.$Element.prototype.insertAdjacentHTML)!-//
/**
 {{beforeHTML}}
 */
jindo.$Element.prototype.beforeHTML = function(sHTML) {
    //-@@$Element.beforeHTML-@@//
    return jindo.$Element.insertAdjacentHTML(this,sHTML,"beforeBegin","firstChild",jindo.$Fn(function(oEle){
        this._element.parentNode.insertBefore(oEle, this._element);
    },this).bind(),"beforeHTML");
};
//-!jindo.$Element.prototype.beforeHTML end!-//

//-!jindo.$Element.prototype.afterHTML start(jindo.$Element.prototype.insertAdjacentHTML)!-//
/**
 {{afterHTML}}
 */
jindo.$Element.prototype.afterHTML = function(sHTML) {
    //-@@$Element.afterHTML-@@//
    return jindo.$Element.insertAdjacentHTML(this,sHTML,"afterEnd","firstChild",jindo.$Fn(function(oEle){
        this._element.parentNode.insertBefore( oEle, this._element.nextSibling );
    },this).bind(),"afterHTML");
};
//-!jindo.$Element.prototype.afterHTML end!-//

//-!jindo.$Element.prototype.hasEventListener start(jindo.$Element.prototype.attach)!-//
/**
{{hasEventListener}}
 */
jindo.$Element.prototype.hasEventListener = function(sEvent){

    var oArgs = g_checkVarType(arguments, {
        '4str' : [ 'sEvent:'+tString ]
    },"$Element#hasEventListener"),
        oDoc,
        bHasEvent = false,
        sLowerCaseEvent = oArgs.sEvent.toLowerCase();
    
    if(this._key){
        oDoc = this._element.ownerDocument || this._element.document || document;
        
        if(sLowerCaseEvent == "load" && this._element === oDoc){
            bHasEvent = jindo.$Element(window).hasEventListener(oArgs.sEvent);
        }else if(sLowerCaseEvent == "domready" && jindo.$Jindo.isWindow(this._element)){
            bHasEvent = jindo.$Element(oDoc).hasEventListener(oArgs.sEvent);
        }else{
            bHasEvent = !!jindo.$Element.eventManager.hasEvent(this._key, oArgs.sEvent);
        }
        
        return bHasEvent;
    }
    
    return false;
};
//-!jindo.$Element.prototype.hasEventListener end!-//

//-!jindo.$Element.prototype.preventTapHighlight start(jindo.$Element.prototype.addClass, jindo.$Element.prototype.removeClass)!-//
/**
{{preventTapHighlight}}
 */
jindo.$Element.prototype.preventTapHighlight = function(bFlag){
    if(_JINDO_IS_MO){
        var sClassName = 'no_tap_highlight' + new Date().getTime();
        
        var elStyleTag = document.createElement('style');
        var elHTML = document.getElementsByTagName('html')[0];
        
        elStyleTag.type = "text/css";
        
        elHTML.insertBefore(elStyleTag, elHTML.firstChild);
        var oSheet = elStyleTag.sheet || elStyleTag.styleSheet;


 
        oSheet.insertRule('.' + sClassName + ' { -webkit-tap-highlight-color: rgba(0,0,0,0); }', 0);
        oSheet.insertRule('.' + sClassName + ' * { -webkit-tap-highlight-color: rgba(0,0,0,.25); }', 0);
        
        jindo.$Element.prototype.preventTapHighlight = function(bFlag) {
            return this[bFlag ? 'addClass' : 'removeClass'](sClassName);
        };
    }else{
        jindo.$Element.prototype.preventTapHighlight = function(bFlag) { return this; };
    }
    return this.preventTapHighlight.apply(this,_toArray(arguments));
};
//-!jindo.$Element.prototype.preventTapHighlight end!-//


//-!jindo.$Element.prototype.data start(jindo.$Json._oldToString)!-//
/**
 {{data}}
 */
/**
 {{data2}}
 */
jindo.$Element.prototype.data = function(sKey, vValue) {
    var jindoKey = "_jindo";
    var sToStr, oArgs = g_checkVarType(arguments, { 
        'g'  : ["sKey:"+tString],
        's4var' : ["sKey:"+tString, "vValue:"+tVariant],
        's4obj' : ["oObj:"+tHash]
    },"$Element#data");
    var  isNull = jindo.$Jindo.isNull;
    function toCamelCase(name){
        return name.replace(/\-(.)/g,function(_,a){
            return a.toUpperCase();
        });
    }
    switch(oArgs+""){
        case "g":
            sKey = toCamelCase(sKey);
            var isMakeFromJindo = this._element.dataset[sKey+jindoKey];
            var sDateSet = this._element.dataset[sKey];
            if(sDateSet){
                if(isMakeFromJindo){
                    return window.JSON.parse(sDateSet);
                }
                return sDateSet;
            }
            return null;
        case "s4var":
            var oData;
            if(isNull(vValue)){
                sKey = toCamelCase(sKey);
                delete this._element.dataset[sKey];
                delete this._element.dataset[sKey+jindoKey];
                return this;
            }else{
                oData = {};
                oData[sKey] = vValue;
                sKey = oData;   
            }
        case "s4obj":
            var sChange;
            for(var i in sKey){
                sChange = toCamelCase(i);
                if(isNull(sKey[i])){
                    delete this._element.dataset[sChange];
                    delete this._element.dataset[sChange+jindoKey];
                }else{
                    sToStr = jindo.$Json._oldToString(sKey[i]);
                    if(sToStr!=null){
                        this._element.dataset[sChange] = sToStr;
                        this._element.dataset[sChange+jindoKey] = "jindo";  
                    }
                }
            }
            return this;
    }
}   
//-!jindo.$Element.prototype.data end!-//

/**
 {{title}}
 */
//-!jindo.$ElementList start(jindo.$Element)!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$ElementList = function (els) {
    //-@@$ElementList-@@//
    var cl = arguments.callee;
    if (els instanceof cl) return els;
    
    if (!(this instanceof cl)){
        try {
            return new cl(els);
        } catch(e) {
            if (e instanceof TypeError) { return null; }
            throw e;
        }
    }   
    
    var oArgs = g_checkVarType(arguments, {
        '4arr' : [ 'aEle:'+tArray ],
        '4str' : [ 'sCssQuery:'+tString ],
        '4nul' : [ 'oEle:'+tNull ],
        '4und' : [ 'oEle:'+tUndefined ]
    },"$ElementList");
    
    switch(oArgs+""){
        case "4arr":
            els = oArgs.aEle;
            break;
        case "4str":
            els = jindo.cssquery(oArgs.sCssQuery);
            break;
        case "4nul":
        case "4und":
            els = [];
    }

    this._elements = [];
    for(var i = 0, l = els.length; i < l ;i++){
        this._elements.push(jindo.$Element(els[i]));
    }
};
//-@@$ElementList.meta_program_config-@@//
(function(proto){
    var setters = ['show','hide','toggle','addClass','removeClass','toggleClass','fireEvent','leave',
                   'empty','className','width','height','text','html','css','attr'];
                   
    for (var i = 0, l = setters.length; i < l; i++) {
        var name = setters[i];
        if(jindo.$Element.prototype[name]){
            proto[setters[i]] = (function(name) {
                return function(){
                    //-@@$ElementList.meta_program-@@//
                    try{
                        var args = [];
                        for(var j = 0,m = arguments.length ; j < m ; j++){
                            args.push(arguments[j]);
                        }
                        for(var k = 0,n = this._elements.length ; k < n ; k++){
                            this._elements[k][name].apply(this._elements[k], args);
                        }
                        return this;
                    }catch(e){
                        throw TypeError(e.message.replace(/\$Element/g,"$Elementlist#"+name).replace(/Element\.html/g,"Elementlist.html#"+name));
                    }
                }
    
            })(setters[i]); 
        } 
        
    }
    

    var setters2 = ['appear','disappear'];
    for (var i = 0, l = setters2.length; i < l; i++) {
        if (jindo.$Element.prototype[name]) {
            proto[setters2[i]] = (function(name){
                return function(duration, callback) {
                    //-@@$ElementList.meta_program-@@//
                    try{
                        var self = this;
                        for (var j = 0, m = this._elements.length; j < m; j++) {
                            if(j == m-1) {
                                this._elements[j][name](duration, function(){callback&&callback(self)});
                            } else {
                                this._elements[j][name](duration);
                            }
                        }
                        return this;
                    }catch(e){
                        throw TypeError(e.message.replace(/\$Element/g,"$Elementlist#"+name).replace(/Element\.html/g,"Elementlist.html#"+name));
                    }
                }
            })(setters2[i]);
        }
    }   
    
})(jindo.$ElementList.prototype);
//-!jindo.$ElementList end!-//

//-!jindo.$ElementList.prototype.get start!-//
/**
 {{get}}
*/
jindo.$ElementList.prototype.get = function(idx) {
    //-@@$ElementList.get-@@//
    var oArgs = g_checkVarType(arguments, {
        '4num' : [ 'nIdx:'+tNumeric ]
    },"$ElementList#get");
    return this._elements[idx];
};
//-!jindo.$ElementList.prototype.get end!-//

//-!jindo.$ElementList.prototype.getFirst start!-//
/**
 {{getFirst}}
*/
jindo.$ElementList.prototype.getFirst = function() {
    //-@@$ElementList.getFirst-@@//
    return this._elements[0];
};
//-!jindo.$ElementList.prototype.getFirst end!-//

//-!jindo.$ElementList.prototype.getLast start!-//
/**
 {{getLast}}
*/
jindo.$ElementList.prototype.getLast = function() {
    //-@@$ElementList.getLast-@@//
    return this._elements[Math.max(this._elements.length-1,0)];
};
//-!jindo.$ElementList.prototype.getLast end!-//

//-!jindo.$ElementList.prototype.length start(jindo.$A.prototype.length)!-//
/**
 {{length}}
*/
/**
 {{length2}}
*/
jindo.$ElementList.prototype.length = function(nLen, oValue) {
    //-@@$ElementList.length-@@//
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [],
        '4num' : [ jindo.$Jindo._F("nLen:"+tNumeric)],
        '4var' : [ "nLen:"+tNumeric, "oValue:"+tVariant]
    },"$ElementList#length");
    
    var waEle = jindo.$A(this._elements);
    try{
        return waEle.length.apply(waEle, _toArray(arguments));
    }catch(e){
        throw TypeError(e.message.replace(/\$A/g,"$Elementlist#length").replace(/A\.html/g,"Elementlist.html#length"));
    }
};
//-!jindo.$ElementList.prototype.length end!-//

//-!jindo.$ElementList.prototype.$value start!-//
/**
 {{sign_value}}
*/
jindo.$ElementList.prototype.$value = function() {
    //-@@$ElementList.$value-@@//
    return this._elements;
};
//-!jindo.$ElementList.prototype.$value end!-//

//-!jindo.$ElementList.prototype.show start(jindo.$Element.prototype.show)!-//
/**
 {{show}}
*/
/**
 {{show_1}}
*/
//-!jindo.$ElementList.prototype.show end!-//
//-!jindo.$ElementList.prototype.hide start(jindo.$Element.prototype.hide)!-//
/**
 {{hide}}
*/
//-!jindo.$ElementList.prototype.hide end!-//
//-!jindo.$ElementList.prototype.toggle start(jindo.$Element.prototype.toggle)!-//
/**
 {{toggle}}
*/
//-!jindo.$ElementList.prototype.toggle end!-//
//-!jindo.$ElementList.prototype.addClass start(jindo.$Element.prototype.addClass)!-//
/**
 {{addClass}}
*/
//-!jindo.$ElementList.prototype.addClass end!-//
//-!jindo.$ElementList.prototype.removeClass start(jindo.$Element.prototype.removeClass)!-//
/**
 {{removeClass}}
*/
//-!jindo.$ElementList.prototype.removeClass end!-//
//-!jindo.$ElementList.prototype.toggleClass start(jindo.$Element.prototype.toggleClass)!-//
/**
 {{toggleClass}}
*/
//-!jindo.$ElementList.prototype.toggleClass end!-//
//-!jindo.$ElementList.prototype.fireEvent start(jindo.$Element.prototype.fireEvent)!-//
/**
 {{fireEvent}}
*/
//-!jindo.$ElementList.prototype.fireEvent end!-//
//-!jindo.$ElementList.prototype.leave start(jindo.$Element.prototype.leave)!-//
/**
 {{leave}}
*/
//-!jindo.$ElementList.prototype.leave end!-//
//-!jindo.$ElementList.prototype.empty start(jindo.$Element.prototype.empty)!-//
/**
 {{empty_1}}
*/
//-!jindo.$ElementList.prototype.empty end!-//
//-!jindo.$ElementList.prototype.appear start(jindo.$Element.prototype.appear)!-//
/**
 {{appear}}
*/
//-!jindo.$ElementList.prototype.appear end!-//
//-!jindo.$ElementList.prototype.disappear start(jindo.$Element.prototype.disappear)!-//
/**
 {{disappear}}
*/
/**
 {{disappear_1}}
*/
//-!jindo.$ElementList.prototype.disappear end!-//

//-!jindo.$ElementList.prototype.className start(jindo.$Element.prototype.className)!-//
/**
 {{className}}
*/
//-!jindo.$ElementList.prototype.className end!-//
//-!jindo.$ElementList.prototype.width start(jindo.$Element.prototype.width)!-//
/**
 {{width}}
*/
//-!jindo.$ElementList.prototype.width end!-//
//-!jindo.$ElementList.prototype.height start(jindo.$Element.prototype.height)!-//
/**
 {{height}}
*/
//-!jindo.$ElementList.prototype.height end!-//
//-!jindo.$ElementList.prototype.text start(jindo.$Element.prototype.text)!-//
/**
 {{text}}
*/
//-!jindo.$ElementList.prototype.text end!-//
//-!jindo.$ElementList.prototype.html start(jindo.$Element.prototype.html)!-//
/**
 {{html}}
*/
/**
 {{html_1}}
*/
/**
 {{html_2}}
*/
//-!jindo.$ElementList.prototype.html end!-//
//-!jindo.$ElementList.prototype.css start(jindo.$Element.prototype.css)!-//
/**
 {{css}}
*/
//-!jindo.$ElementList.prototype.css end!-//
//-!jindo.$ElementList.prototype.attr start(jindo.$Element.prototype.attr)!-//
/**
 {{attr}}
*/
//-!jindo.$ElementList.prototype.attr end!-//

/**
 {{title}}
 */
//-!jindo.$Form start!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$Form = function (el) {
    //-@@$Form-@@//
    var cl = arguments.callee;
    if (el instanceof cl) return el;
    
    if (!(this instanceof cl)){
        try {
            jindo.$Jindo._maxWarn(arguments.length, 1,"$"+tForm);
            return new cl(el);
        } catch(e) {
            if (e instanceof TypeError) { return null; }
            throw e;
        }
    }   
    
    var oArgs = g_checkVarType(arguments, {
        '4str' : ['oForm:'+tString],
        '4ele' : [ 'oForm:'+tElement]
    },"$"+tForm);
    
    switch (oArgs + "") {
        case "4str":
            el = jindo.$(el);
            break;
    }
    
    if (!(el.tagName&&el.tagName.toUpperCase()=="FORM")) {
        throw TypeError("only form");
    }
    this._form = el;
};
//-!jindo.$Form end!-//

//-!jindo.$Form.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$Form.prototype.$value = function() {
    //-@@$Form.$value-@@//
    return this._form;
};
//-!jindo.$Form.prototype.$value end!-//

//-!jindo.$Form.prototype.serialize start(jindo.$H.prototype.toQueryString)!-//
/**
 {{serialize}}
 */
jindo.$Form.prototype.serialize = function() {
    //-@@$Form.serialize-@@//
    var self = this;
    var oRet = {};
    
    var nLen = arguments.length;
    var fpInsert = function(eEle,sKey) {
        if(!eEle.disabled){
            var sVal = self.value(sKey);
            if (sVal !== undefined) oRet[sKey] = sVal;
        }
    };
    
    if (nLen == 0) {
        var len = this._form.elements.length;
        for(var i=0; i<len; i++){
            var o = this._form.elements[i];
            if(o.name) fpInsert(o,o.name);
        }       
    }else{
        for (var i = 0; i < nLen; i++) {
            fpInsert(this.element(arguments[i]),arguments[i]);
        }
    }

    return jindo.$H(oRet).toQueryString();  
};
//-!jindo.$Form.prototype.serialize end!-//

//-!jindo.$Form.prototype.element start!-//
/**
 {{element}}
 */
jindo.$Form.prototype.element = function(sKey) {
    //-@@$Form.element-@@//
    
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [],
        '4str' : [jindo.$Jindo._F('sKey:'+tString)]
    },"$Form#element");
    
    switch(oArgs+""){
        case "4voi":
            return _toArray(this._form.elements);   
        case "4str":
            return this._form.elements[sKey+""];
        
    }
};
//-!jindo.$Form.prototype.element end!-//

//-!jindo.$Form.prototype.enable start!-//
/**
 {{enable}}
 */
/**
 {{enable2}}
 */
jindo.$Form.prototype.enable = function(sKey) {
    //-@@$Form.enable-@@//
    var oArgs = g_checkVarType(arguments, {
        's4bln' : [ 'sName:'+tString, 'bEnable:'+tBoolean ],
        's4obj' : [ 'oObj:'+tHash],
        'g' : [ jindo.$Jindo._F('sName:'+tString)]
    },"$Form#enable");
    
    switch(oArgs+""){
        case "s4bln":
            var aEls = this._form[sKey];
            if (!aEls) return this;
            aEls = aEls.nodeType == 1 ? [ aEls ] : aEls;
            var sFlag = oArgs.bEnable;
            for(var i=0; i<aEls.length; i++){
                aEls[i].disabled = !sFlag;
            }
            return this;
            
        case "s4obj":
            sKey = oArgs.oObj;
            var self = this;
            for (var k in sKey) {
                if (sKey.hasOwnProperty(k)) {
                    self.enable(k, sKey[k]);
                }
            }
            return this;
            
        case "g":
            var aEls = this._form[sKey];
            if (!aEls) return this;
            aEls = aEls.nodeType == 1 ? [ aEls ] : aEls;
            
            var bEnabled = true;
            for(var i=0; i<aEls.length; i++){
                if(aEls[i].disabled){
                    bEnabled=false;
                    break;
                }
            }
            return bEnabled;
            
    }
};
//-!jindo.$Form.prototype.enable end!-//

//-!jindo.$Form.prototype.value start(jindo.$A.prototype.has)!-//
/**
 {{value}}
 */
/**
 {{value2}}
 */
jindo.$Form.prototype.value = function(sKey) {
    //-@@$Form.value-@@//
    
    var oArgs = g_checkVarType(arguments, {
        's4str' : [ 'sKey:'+tString, 'vValue:'+tVariant ],
        's4obj' : [ jindo.$Jindo._F('oObj:'+tHash)],
        'g' : [ 'sKey:'+tString]
    },"$Form#value");
    
    if(oArgs+"" == "s4obj"){
        var self = this;
        sKey = oArgs.oObj;
        for(var k in sKey){
            if (sKey.hasOwnProperty(k)) {
                self.value(k, sKey[k]);
            }
        } 
        return this;    
    }
    
    var aEls = this._form[sKey];
    if (!aEls) throw new jindo.$Error(sKey+jindo.$Except.NONE_ELEMENT,"$Form#value");
    
    aEls = aEls.nodeType == 1 ? [ aEls ] : aEls;
    switch(oArgs+""){
        case "s4str":
            var sVal = oArgs.vValue;
            var nLen = aEls.length;
            for(var i=0; i<nLen; i++){
                var o = aEls[i];
                switch (o.type) {
                    case 'radio':
                        o.checked = (o.value == sVal);
                        break;
                    case 'checkbox':
                        if(sVal.constructor == Array){
                            o.checked = jindo.$A(sVal).has(o.value);
                        }else{
                            o.checked = (o.value == sVal);
                        }
                        break;
                        
                    case 'select-one':
                        var nIndex = -1;
                        for (var i = 0, len = o.options.length; i < len; i++){
                            if (o.options[i].value == sVal) nIndex = i;
                        }
                        o.selectedIndex = nIndex;
        
                        break;
                    
                    case 'select-multiple':
                        var nIndex = -1;
                        if(sVal.constructor == Array){
                            var waVal = jindo.$A(sVal);
                            for (var i = 0, len = o.options.length; i < len; i++){
                                o.options[i].selected = waVal.has(o.options[i].value); 
                            }
                        }else{
                            for (var i = 0, len = o.options.length; i < len; i++){
                                if (o.options[i].value == sVal) nIndex = i;
                            }
                            o.selectedIndex = nIndex;
                        }
                        break;
                        
                    default:
                        o.value = sVal;
                        
                }
            }
            
            return this;
            
        case "g":
            var aRet = [];
            var nLen = aEls.length;
            for(var i=0;i<nLen; i++){
                var o = aEls[i];
                switch (o.type) {
                case 'radio':
                case 'checkbox':
                    if (o.checked) aRet.push(o.value);
                    break;
                
                case 'select-one':
                    if (o.selectedIndex != -1) aRet.push(o.options[o.selectedIndex].value);
                    break;
                case 'select-multiple':
                    if (o.selectedIndex != -1){
                        for (var i = 0, len = o.options.length; i < len; i++){
                            if (o.options[i].selected) aRet.push(o.options[i].value);
                        }
                    }
                    break;
                default:
                    aRet.push(o.value);
                    
                }
                
            }
            
            return aRet.length > 1 ? aRet : aRet[0];
            
    }
    
    

    
};
//-!jindo.$Form.prototype.value end!-//

//-!jindo.$Form.prototype.submit start!-//
/**
 {{submit}}
 */
jindo.$Form.prototype.submit = function(sTargetName, fValidation) {
    //-@@$Form.submit-@@//
    var oArgs = g_checkVarType(arguments, {
        'voi' : [],
        '4str' : [ 'sTargetName:'+tString],
        '4fun' : [ 'fValidation:'+tFunction],
        '4fun2' : [ 'sTargetName:'+tString,"fValidation:"+tFunction]
    },"$Form#submit");
    
    var sOrgTarget = null;
    switch(oArgs+""){
        case "4str":
            sOrgTarget = this._form.target;
            this._form.target = oArgs.sTargetName;
            break;
        case "4fun":
        case "4fun2":
            if(!oArgs.fValidation.call(this,this._form)) return this;
            if(oArgs+"" == "4fun2"){
                sOrgTarget = this._form.target;
                this._form.target = oArgs.sTargetName;
            }
            
            
    }
    this._form.submit();
    if (!jindo.$Jindo.isNull(sOrgTarget)) this._form.target = sOrgTarget;
    return this;
};
//-!jindo.$Form.prototype.submit end!-//

//-!jindo.$Form.prototype.reset start!-//
/**
 {{reset}}
 */
jindo.$Form.prototype.reset = function(fValidation) {
    //-@@$Form.reset-@@//
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [ ],
        '4fun' : [ 'fValidation:'+tFunction]
    },"$Form#reset");
    
    if(oArgs+"" == "4fun") if(!fValidation.call(this,this._form)) return this;
    
    this._form.reset();
    return this;
    
};
//-!jindo.$Form.prototype.reset end!-//


/**
 {{title}}
 */
//-!jindo.$Document start(jindo.cssquery)!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$Document = function (el) {
    //-@@$Document-@@//
    var cl = arguments.callee;
    if (el instanceof cl) return el;

    if (!(this instanceof cl)){
        try {
            jindo.$Jindo._maxWarn(arguments.length, 1,"$Document");
            return new cl(el||document);
        } catch(e) {
            if (e instanceof TypeError) { return null; }
            throw e;
        }
    }   
    
    var oArgs = g_checkVarType(arguments, {
        '4doc'  : [ 'oDocument:'+tDocument]
    },"$Document");
    if(oArgs==null){this._doc = document;}
    else{this._doc = el;}
    
    this._docKey = 'documentElement';   
};
(function(){
    var qu = jindo.cssquery;
    var type = {
        "query" : qu.getSingle,
        "queryAll" : qu,
        "xpathAll" : qu.xpath
    };
    for(var i in type){
        jindo.$Document.prototype[i] = (function(sMethod,fp){
            return function(sQuery){
                var oArgs = g_checkVarType(arguments, {
                    '4str'  : [ 'sQuery:'+tString]
                },"$Document#"+sMethod);
                return fp(sQuery,this._doc);
            }
        })(i, type[i])
    }
    
})();
//-!jindo.$Document end!-//

//-!jindo.$Document.prototype.$value start!-//
/**
 {{value}}
 */
jindo.$Document.prototype.$value = function() {
    //-@@$Document.$value-@@//
    return this._doc;
};
//-!jindo.$Document.prototype.$value end!-//

//-!jindo.$Document.prototype.scrollSize start!-//
/**
 {{scrollSize}} 
 */
jindo.$Document.prototype.scrollSize = function() {
    //-@@$Document.scrollSize-@@//
    /*
      {{scrollSize_1}}
     */
    var oDoc = this._doc[_JINDO_IS_WK?'body':this._docKey];
    
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
    //-@@$Document.scrollPosition-@@//
    /*
     {{scrollPosition_1}}
     */
    var oDoc = this._doc[_JINDO_IS_WK?'body':this._docKey];
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
    //-@@$Document.clientSize-@@//
    var oDoc = this._doc[this._docKey];
    
    var isSafari = _JINDO_IS_SP && !_JINDO_IS_CH;

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

//-!jindo.$Document.prototype.queryAll start(jindo.cssquery)!-//
/**
 {{queryAll}}
 */
//-!jindo.$Document.prototype.queryAll end!-//

//-!jindo.$Document.prototype.query start(jindo.cssquery)!-//
/**
 {{query}}
 */
//-!jindo.$Document.prototype.query end!-//

//-!jindo.$Document.prototype.xpathAll start(jindo.cssquery)!-//
/**
 {{xpathAll}}
 */
//-!jindo.$Document.prototype.xpathAll end!-//


/**
 {{title}}
 */
//-!jindo.$Window start!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$Window = function(el) {
    //-@@$Window-@@//
    var cl = arguments.callee;
    if (el instanceof cl) return el;
    
    if (!(this instanceof cl)){
        try {
            jindo.$Jindo._maxWarn(arguments.length, 1,"$"+tWindow);
            return new cl(el||window);
        } catch(e) {
            if (e instanceof TypeError) { return null; }
            throw e;
        }
    }   
    
    var oArgs = g_checkVarType(arguments, {
        '4win' : ['el:'+tWindow]
    },"$"+tWindow);
    
    this._win = el;
};
//-!jindo.$Window end!-//

//-!jindo.$Window.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$Window.prototype.$value = function() {
    //-@@$Window.$value-@@//
    return this._win;
};
//-!jindo.$Window.prototype.$value end!-//

//-!jindo.$Window.prototype.matchMedia start(jindo.$Window.mediaQueryManager)!-//
/**
{{matchMedia}}
 */ 
 jindo.$Window.prototype.matchMedia = function(sQuery){
    var oArgs = g_checkVarType(arguments, {
        "4str" : ["sQuery:" + tString]
    }, "$Window#matchMedia"),
        bMatches;
    
    try{
        bMatches = jindo.$Window.mediaQueryManager.getMatchResult(oArgs.sQuery).matches;
    }catch(e){
        throw new jindo.$Error(e.message, "$Window#matchMedia");
    }
    
    if(window.matchMedia){
        bMatches = window.matchMedia(sQuery).matches;
    }
    
    return bMatches;
};
//-!jindo.$Window.prototype.matchMedia end!-//

//-!jindo.$Window.prototype.addMediaListener start(jindo.$Window.mediaQueryManager)!-//
/**
{{addMediaListener}}
 */
jindo.$Window.prototype.addMediaListener = function(sQuery, fCallback){
    var oArgs = g_checkVarType(arguments, {
        "4str" : ["sQuery:" + tString, "fCallback:" + tFunction]
    }, "$Window#addMediaListener"),
        oResult,
        oManager = jindo.$Window.mediaQueryManager;
    
    try{
        oResult = oManager.getMatchResult(oArgs.sQuery);
    }catch(e){
        throw new jindo.$Error(e.message, "$Window#addMediaListener");
    }
    
    oManager.addListener(sQuery, fCallback, oResult);
    
    return this;
}
//-!jindo.$Window.prototype.addMediaListener end!-//

//-!jindo.$Window.prototype.removeMediaListener start(jindo.$Window.mediaQueryManager)!-//
/**
{{removeMediaListener}}
 */
jindo.$Window.prototype.removeMediaListener = function(sQuery, fCallback){
    var oArgs = g_checkVarType(arguments, {
        "4str" : ["sQuery:" + tString, "fCallback:" + tFunction]
    }, "$Window#removeMediaListener");
    
    jindo.$Window.mediaQueryManager.removeListener(sQuery, fCallback);
    
    return this;
}
//-!jindo.$Window.prototype.removeMediaListener end!-//

//-!jindo.$Window.mediaQueryManager start(jindo.$Document.prototype.clientSize, jindo.$Element.prototype.attach, jindo.$Element.prototype.detach)!-//
/*
{{mediaQueryManager}}
 */
jindo.$Window.mediaQueryManager = (function(){
    var oQueryStore = {},
        bIsAddedWindowResizeHandler = false,
        fWindowResizeHandler,
        oMockClientSize,
        oMockScreenSize;
    
    /**
    {{mediaQueryManager_0}}
     */
    var trim = function(sQuery){
        sQuery = sQuery.replace(/^\s+|\s+$/g, "");
        sQuery = sQuery.toLowerCase();
        
        if(!/^\(.*\)$/.test(sQuery) ||
            /*
            {{mediaQueryManager_1}}
             */
            !/^(\(((min\-)|(max\-))?[\-a-z\s]+:[\/a-z\d\s]+\)((\s*and\s+)|(\s*,\s*))){0,}\(((min\-)|(max\-))?[\-a-z\s]+:[\/a-z\d\s]+\)$/.test(sQuery)
            ){
            throw new Error(jindo.$Except.INVALID_MEDIA_QUERY);
        }
        
        return sQuery.replace(/\s+/g, function(sBlank, sIndex){
            return "";
        });
    }
    
    /**
    {{mediaQueryManager_2}}
     */
    var isMatchWholeQuery = function(aWholeQuery){
        for(var i = 0, nQueryEa = aWholeQuery.length; i < nQueryEa; i++){
            /*
            {{mediaQueryManager_3}}
             */
            if(isMatchSingleQuery(aWholeQuery[i])){
                return true;
            }
        }
        
        return false;
    }
    
    /**
    {{mediaQueryManager_4}}
     */
    var parseWholeQuery = function(sQuery){
        var aQuery = sQuery.split(","),
            nLength = aQuery.length,
            aParsedQuery,
            aResult = [],
            i;
        
        for(i = 0; i < nLength; i++){
            aParsedQuery = parseSingleQuery(aQuery[i]);
            
            if(!isSupportedFeature(aParsedQuery)){
                throw new Error(jindo.$Except.INVALID_MEDIA_QUERY);
            }
            
            aResult.push(aParsedQuery);
        }
        
        return aResult;
    }
    
    /**
    {{mediaQueryManager_5}}
     */
    var parseSingleQuery = function(sQuery){
        var aResult = [];
        sQuery.replace(/\((.+?):(.+?)\)/g, function(sWhole, sFeature, sValue){
            aResult.push({
                feature : sFeature,
                value : sValue
            });
            
            return sWhole;
        });
        
        return aResult;
    }
    
    /**
    {{mediaQueryManager_6}}
     */
    var isSupportedFeature = function(aParsedQuery){
        var oParsedFeature,
            sFeature,
            sValue,
            bSupported = false,
            rxFeatureType0 = /^((min\-)|(max\-))?((width$)|(height$)|(device-width$)|(device-height$))/;
            rxFeatureType1 = /^((min\-)|(max\-))?((aspect-ratio$)|(device-aspect-ratio$))/;
            rxFeatureType2 = /^orientation$/;
            rxValueType0 = /^\d+px$/,
            rxValueType1 = /^\d+\/\d+$/,
            rxValueType2 = /(^landscape$)|(^portrait$)/,
            nLength = aParsedQuery.length,
            i;
        
        for(i = 0; i < nLength; i++){
            oParsedFeature = aParsedQuery[i];
            sFeature = oParsedFeature.feature;
            sValue = oParsedFeature.value;
            
            if(rxFeatureType0.test(sFeature) && rxValueType0.test(sValue) ||
                rxFeatureType1.test(sFeature) && rxValueType1.test(sValue) ||
                rxFeatureType2.test(sFeature) && rxValueType2.test(sValue)){
                bSupported = true;
            }else{
                return false;
            }
        }
        
        return bSupported;
    }
    
    /**
    {{mediaQueryManager_7}}
     */
    var isMatchSingleQuery = function(aParsedQuery){
        for(var i = 0, length = aParsedQuery.length; i < length; i++){
            /*
            {{mediaQueryManager_8}}
             */
            if(!isMatchSingleFeature(aParsedQuery[i])){
                return false;
            }
        }
        
        return true;
    }
    
    /**
    {{mediaQueryManager_9}}
     */
    var isMatchSingleFeature = function(oParsedFeature){
        var sFeature = oParsedFeature.feature,
            sValue = oParsedFeature.value,
            oClientSize = oMockClientSize || jindo.$Document().clientSize(),
            nClientWidth = oClientSize.width,
            nClientHeight = oClientSize.height,
            getRatio = function(sValue){
                var aArr = sValue.split("/");
                return parseInt(aArr[0]) / parseInt(aArr[1]);
            };
        
        switch(sFeature){
            case "width":
                return parseInt(sValue) == nClientWidth;
            case "min-width":
                return parseInt(sValue) <= nClientWidth;
            case "max-width":
                return parseInt(sValue) >= nClientWidth;
            case "height":
                return parseInt(sValue) == nClientHeight;
            case "min-height":
                return parseInt(sValue) <= nClientHeight;
            case "max-height":
                return parseInt(sValue) >= nClientHeight;
            case "aspect-ratio":
                return getRatio(sValue) == nClientWidth / nClientHeight;
            case "min-aspect-ratio":
                return getRatio(sValue) <= nClientWidth / nClientHeight;
            case "max-aspect-ratio":
                return getRatio(sValue) >= nClientWidth / nClientHeight;
            case "orientation":
                return (sValue == "landscape" && nClientWidth / nClientHeight >= 1) || (sValue == "portrait" && nClientWidth / nClientHeight <= 1);
            default:
                return false;
        }
    }
    
    /**
    {{mediaQueryManager_10}}
     */
    var getFormattedQuery = function(aWholeQuery){
        var i,
            nCommaLength = aWholeQuery.length,
            j,
            nAndLength,
            aParsedQuery,
            oParsedFeature,
            sStr = "";
        
        for(i = 0; i < nCommaLength; i++){
            aParsedQuery = aWholeQuery[i];
            nAndLength = aParsedQuery.length;
            
            for(j = 0; j < nAndLength; j++){
                oParsedFeature = aParsedQuery[j];
                sStr += "(" + oParsedFeature.feature + ": " + oParsedFeature.value + ")";
                sStr += (j < nAndLength - 1) ? " and " : "";
            }
            
            sStr += (i < nCommaLength - 1) ? ", " : "";
        }
        
        return sStr;
    }
    
    /*
    {{mediaQueryManager_12}}
     */
    var oNotSupport = {
        /**
        {{mediaQueryManager_13}}
         */
        getMatchResult : function(sQuery){
            var aWholeQuery,
                nQueryEa,
                bMatches = false,
                sMedia,
                i;
            
            sQuery = trim(sQuery);
            aWholeQuery = parseWholeQuery(sQuery);
            bMatches = isMatchWholeQuery(aWholeQuery);
            
            return {
                matches : bMatches,
                media : getFormattedQuery(aWholeQuery),
                parsedWholeQuery : aWholeQuery
            }
        },
        
        /**
        {{mediaQueryManager_14}}
         */
        addListener : function(sQuery, fCallback, oResult, o$Window){
            var oQuery = oQueryStore[sQuery];
            
            if(!bIsAddedWindowResizeHandler){
                bIsAddedWindowResizeHandler = true;
                /**
                {{mediaQueryManager_11}}
                 */
                fWindowResizeHandler = function(we){
                    var oQuery,
                        i,
                        j,
                        aCallback,
                        nLength;
                    
                    for(i in oQueryStore){
                        oQuery = oQueryStore[i];
                        oQuery.thisMatches = isMatchWholeQuery(oQuery.parsedWholeQuery);
                        
                        if(oQuery.matches != oQuery.thisMatches){
                            oQuery.matches = oQuery.thisMatches;
                            aCallback = oQuery.callbacks;
                            nLength = aCallback.length;
                            
                            for(j = 0; j < nLength; j++){
                                aCallback[j].call(o$Window, {
                                    matches : oQuery.matches,
                                    media : oQuery.media
                                });
                            }
                        }
                    }
                }
                jindo.$Element(window).attach("resize", fWindowResizeHandler);
            }
            
            if(!oQuery){
                oQuery = {
                    matches : false,
                    thisMatches : false,
                    media : oResult.media,
                    parsedWholeQuery : oResult.parsedWholeQuery,
                    callbacks : []
                }
                oQueryStore[sQuery] = oQuery;
            }
            
            oQuery.matches = oResult.matches;
            oQuery.callbacks.push(fCallback);
        },
        
        /**
        {{mediaQueryManager_15}}
         */
        removeListener : function(sQuery, fCallback){
            var oQuery = oQueryStore[sQuery],
                aCallback,
                length,
                i,
                nQueryCount = 0;
            
            if(oQuery){
                aCallback = oQuery.callbacks;
                length = aCallback.length;
                
                for(i = length - 1; i > -1; i--){
                    if(aCallback[i] == fCallback){
                        aCallback.splice(i, 1);
                    }
                }
                
                if(aCallback.length == 0){
                    delete oQueryStore[sQuery];
                }
            }
            
            if(bIsAddedWindowResizeHandler){
                for(i in oQueryStore){
                    nQueryCount++;
                }
                
                if(nQueryCount == 0){
                    bIsAddedWindowResizeHandler = false;
                    jindo.$Element(window).detach("resize", fWindowResizeHandler);
                }
            }
        },
        
        _test_setClientSize : function(nWidth, nHeight){
            if(!oMockClientSize){
                oMockClientSize = {};
            }
            oMockClientSize.width = nWidth;
            oMockClientSize.height = nHeight;
        },
        
        _test_setScreenSize : function(nWidth, nHeight){
            if(!oMockScreenSize){
                oMockScreenSize = {};
            }
            oMockScreenSize.width = nWidth;
            oMockScreenSize.height = nHeight;
        }
    };
    
    /*
    {{mediaQueryManager_16}}
     */
    var oSupport = {
        /*
        {{mediaQueryManager_17}}
         */
        getMatchResult : oNotSupport.getMatchResult,
        
        /**
        {{mediaQueryManager_18}}
         */
        addListener : function(sQuery, fCallback, oResult, o$Window){
            var oQuery = oQueryStore[sQuery];
            
            if(!oQuery){
                oQuery = {
                    mediaQueryList : null,
                    nativeListener : null,
                    callbacks : []
                };
                oQueryStore[sQuery] = oQuery;
            }
            
            if(!oQuery.mediaQueryList || !oQuery.nativeListener){
                oQuery.nativeListener = function(oMediaQueryList){
                    var i,
                        aCallbacks = oQuery.callbacks,
                        nLength = aCallbacks.length;
                    
                    for(var i = 0; i < nLength; i++){
                        aCallbacks[i].call(o$Window, {
                            matches : oMediaQueryList.matches,
                            media : oMediaQueryList.media
                        })
                    }
                };
                oQuery.mediaQueryList = window.matchMedia(sQuery);
                oQuery.mediaQueryList.addListener(oQuery.nativeListener);
            }
            oQuery.callbacks.push(fCallback);
        },
        
        /**
        {{mediaQueryManager_19}}
         */
        removeListener : function(sQuery, fCallback){
            var oQuery = oQueryStore[sQuery],
                i,
                aCallbacks,
                nLength;
            
            if(oQuery){
                aCallbacks = oQuery.callbacks,
                nLength = aCallbacks.length;
                
                for(i = nLength - 1; i > -1; i--){
                    if(aCallbacks[i] == fCallback){
                        aCallbacks.splice(i, 1);
                    }
                }
                
                if(aCallbacks.length == 0){
                    oQuery.mediaQueryList.removeListener(oQuery.nativeListener);
                    delete oQuery;
                }
            }
        },
        
        _test_setClientSize : function(){},
        
        _test_setScreenSize : function(){}
    };
    
    /*
    {{mediaQueryManager_20}}
     */
    return (_JINDO_IS_SP && !_JINDO_IS_CH || !window.matchMedia) ? oNotSupport : oSupport;
})();
//-!jindo.$Window.mediaQueryManager end!-//

/**
 {{title}}
 */
//-!jindo.$S start!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$S = function(str) {
    //-@@$S-@@//
    var cl = arguments.callee;

    if (str instanceof cl) return str;
    
    if (!(this instanceof cl)){
        try {
            jindo.$Jindo._maxWarn(arguments.length, 1,"$Json");
            return new cl(str||"");
        } catch(e) {
            if (e instanceof TypeError) { return null; }
            throw e;
        }
    }   
        
    var oArgs = g_checkVarType(arguments, {
        '4str' : ['str:'+tString]
    },"$S");

    this._str = str + '';
};
//-!jindo.$S end!-//

//-!jindo.$S.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$S.prototype.$value = function() {
    //-@@$S.$value-@@//
    //-@@$S.toString-@@//
    return this._str;
};
//-!jindo.$S.prototype.$value end!-//

//-!jindo.$S.prototype.toString start!-//
/**
 {{toString}}
 */
jindo.$S.prototype.toString = jindo.$S.prototype.$value;
//-!jindo.$S.prototype.toString end!-//

//-!jindo.$S.prototype.trim start!-//
/**
 {{trim}}
 */
jindo.$S.prototype.trim = function() {
    //-@@$S.trim-@@//
    if ("".trim) {
        jindo.$S.prototype.trim = function() {
            return jindo.$S(this._str.trim());
        }
    }else{
        jindo.$S.prototype.trim = function() {
            return trim(this._str);
        }
    }
    
    return jindo.$S(this.trim());
    
};
//-!jindo.$S.prototype.trim end!-//

//-!jindo.$S.prototype.escapeHTML start!-//
/**
 {{escapeHTML}}
 */
jindo.$S.prototype.escapeHTML = function() {
    //-@@$S.escapeHTML-@@//
    var entities = {'"':'quot','&':'amp','<':'lt','>':'gt','\'':'#39'};
    var s = this._str.replace(/[<>&"']/g, function(m0){
        return entities[m0]?'&'+entities[m0]+';':m0;
    });
    return jindo.$S(s);
};
//-!jindo.$S.prototype.escapeHTML end!-//

//-!jindo.$S.prototype.stripTags start!-//
/**
 {{stripTags}}
 */
jindo.$S.prototype.stripTags = function() {
    //-@@$S.stripTags-@@//
    return jindo.$S(this._str.replace(/<\/?(?:h[1-5]|[a-z]+(?:\:[a-z]+)?)[^>]*>/ig, ''));
};
//-!jindo.$S.prototype.stripTags end!-//

//-!jindo.$S.prototype.times start!-//
/**
 {{times}}
 */
jindo.$S.prototype.times = function(nTimes) {
    //-@@$S.times-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str' : ['nTimes:'+tNumeric]
    },"$S#times");
    if (!oArgs) { return this; }
    return jindo.$S(Array(oArgs.nTimes+1).join(this._str));
};
//-!jindo.$S.prototype.times end!-//

//-!jindo.$S.prototype.unescapeHTML start!-//
/**
 {{unescapeHTML}}
 */
jindo.$S.prototype.unescapeHTML = function() {
    //-@@$S.unescapeHTML-@@//
    var entities = {'quot':'"','amp':'&','lt':'<','gt':'>','#39':'\''};
    var s = this._str.replace(/&([a-z]+|#[0-9]+);/g, function(m0,m1){
        return entities[m1]?entities[m1]:m0;
    });
    return jindo.$S(s);
};
//-!jindo.$S.prototype.unescapeHTML end!-//

//-!jindo.$S.prototype.escape start!-//
/**
 {{escape}}
 */
jindo.$S.prototype.escape = function() {
    //-@@$S.escape-@@//
    var s = this._str.replace(/([\u0080-\uFFFF]+)|[\n\r\t"'\\]/g, function(m0,m1,_){
        if(m1) return escape(m1).replace(/%/g,'\\');
        return (_={"\n":"\\n","\r":"\\r","\t":"\\t"})[m0]?_[m0]:"\\"+m0;
    });

    return jindo.$S(s);
};
//-!jindo.$S.prototype.escape end!-//

//-!jindo.$S.prototype.bytes start!-//
/**
 {{bytes}}
 */
/**
 {{bytes2}}
 */
/**
 {{bytes3}}
 */
jindo.$S.prototype.bytes = function(vConfig) {
    //-@@$S.bytes-@@//
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [],
        '4num' : ["nConfig:"+tNumeric],
        '4obj' : ["nConfig:"+tHash]
    },"$S#bytes");
    var code = 0, bytes = 0, i = 0, len = this._str.length;
    var charset = ((document.charset || document.characterSet || document.defaultCharset)+"");
    var cut,nBytes;
    switch(oArgs+""){
        case "4voi":
            cut = false;
            break;
        case "4num":
            cut = true;
            nBytes = vConfig;
            break;
        case "4obj":
            charset = vConfig.charset||charset;
            nBytes  = vConfig.size||false;
            cut = !!nBytes;
            break;
        
    }

    if (charset.toLowerCase() == "utf-8") {
        /*
         {{bytes_1}}
         */
        for(i=0; i < len; i++) {
            code = this._str.charCodeAt(i);
            if (code < 128) {
                bytes += 1;
            }else if (code < 2048){
                bytes += 2;
            }else if (code < 65536){
                bytes += 3;
            }else{
                bytes += 4;
            }
            
            if (cut && bytes > nBytes) {
                this._str = this._str.substr(0,i);
                break;
            }
        }
    } else {
        for(i=0; i < len; i++) {
            bytes += (this._str.charCodeAt(i) > 128)?2:1;
            
            if (cut && bytes > nBytes) {
                this._str = this._str.substr(0,i);
                break;
            }
        }
    }

    return cut?this:bytes;
};
//-!jindo.$S.prototype.bytes end!-//

//-!jindo.$S.prototype.parseString start!-//
/**
 {{parseString}}
 */
jindo.$S.prototype.parseString = function() {
    //-@@$S.parseString-@@//
    if(this._str=="") return {};
    
    var str = this._str.split(/&/g), pos, key, val, buf = {},isescape = false;

    for(var i=0; i < str.length; i++) {
        key = str[i].substring(0, pos=str[i].indexOf("=")), isescape = false;
        try{
            val = decodeURIComponent(str[i].substring(pos+1));
        }catch(e){
            isescape = true;
            val = decodeURIComponent(unescape(str[i].substring(pos+1)));
        }
        

        if (key.substr(key.length-2,2) == "[]") {
            key = key.substring(0, key.length-2);
            if (jindo.$Jindo.isUndefined(buf[key])) buf[key] = [];
            buf[key][buf[key].length] = isescape? escape(val) : val;;
        } else {
            buf[key] = isescape? escape(val) : val;
        }
    }

    return buf;
};
//-!jindo.$S.prototype.parseString end!-//

//-!jindo.$S.prototype.escapeRegex start!-//
/**
 {{escapeRegex}}
 */
jindo.$S.prototype.escapeRegex = function() {
    //-@@$S.escapeRegex-@@//
    var s = this._str;
    var r = /([\?\.\*\+\-\/\(\)\{\}\[\]\:\!\^\$\\\|])/g;

    return jindo.$S(s.replace(r, "\\$1"));
};
//-!jindo.$S.prototype.escapeRegex end!-//

//-!jindo.$S.prototype.format start(jindo.$S.prototype.times)!-//
/**
 {{format}}
 */
jindo.$S.prototype.format = function() {
    //-@@$S.format-@@//
    var args = arguments;
    var idx  = 0;
    var s = this._str.replace(/%([ 0])?(-)?([1-9][0-9]*)?([bcdsoxX])/g, function(m0,m1,m2,m3,m4){
        var a = args[idx++];
        var ret = "", pad = "";

        m3 = m3?+m3:0;

        if (m4 == "s") {
            ret = a+"";
        } else if (" bcdoxX".indexOf(m4) > 0) {
            if (!jindo.$Jindo.isNumeric(a)) return "";
            ret = (m4 == "c")?String.fromCharCode(a):a.toString(({b:2,d:10,o:8,x:16,X:16})[m4]);
            if (" X".indexOf(m4) > 0) ret = ret.toUpperCase();
        }

        if (ret.length < m3) pad = jindo.$S(m1||" ").times(m3 - ret.length)._str;
        (m2 == '-')?(ret+=pad):(ret=pad+ret);

        return ret;
    });

    return jindo.$S(s);
};
//-!jindo.$S.prototype.format end!-//


/**
 {{title}}
 */

//-!jindo.$Json start(jindo.$Json._oldMakeJSON)!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$Json = function (sObject) {
    //-@@$Json-@@//
    var cl = arguments.callee;
    if (sObject instanceof cl) return sObject;
    
    if (!(this instanceof cl)){
        try {
            jindo.$Jindo._maxWarn(arguments.length, 1,"$Json");
            return new cl(arguments.length?sObject:{});
        } catch(e) {
            if (e instanceof TypeError) { return null; }
            throw e;
        }
    }   
        
    g_checkVarType(arguments, {
        '4var' : ['oObject:'+tVariant]
    },"$Json");
    this._object = sObject;
};
//-!jindo.$Json end!-//
/*
{{sign_oldMakeJSON}}
jindo.$Json._makeJson = function(sObject){
    if (window.JSON&&window.JSON.parse) {
        jindo.$Json._makeJson = function(sObject){
            if (typeof sObject == "string") {
                try{
                    return JSON.parse(sObject);
                }catch(e){
                    return jindo.$Json._oldMakeJSON(sObject);
                }
            }
            return sObject;
        }
    }else{
        jindo.$Json._makeJson = function(sObject){
            if (typeof sObject == "string") {
                return jindo.$Json._oldMakeJSON(sObject);
            }
            return sObject;
        }
    }
    return jindo.$Json._makeJson(sObject);
};
*/
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
//-!jindo.$Json._oldMakeJSON.hidden end!-//

//-!jindo.$Json.fromXML start!-//
/**
  {{fromXML}}
  */
jindo.$Json.fromXML = function(sXML) {
    //-@@$Json.fromXML-@@//
    var ___jindo = jindo.$Jindo;
    var oArgs = ___jindo.checkVarType(arguments, {
        '4str' : ['sXML:'+tString]
    },"<static> $Json#fromXML");
    var o  = {};
    var re = /\s*<(\/?[\w:\-]+)((?:\s+[\w:\-]+\s*=\s*(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'))*)\s*((?:\/>)|(?:><\/\1>|\s*))|\s*<!\[CDATA\[([\w\W]*?)\]\]>\s*|\s*>?([^<]*)/ig;
    var re2= /^[0-9]+(?:\.[0-9]+)?$/;
    var ec = {"&amp;":"&","&nbsp;":" ","&quot;":"\"","&lt;":"<","&gt;":">"};
    var fg = {tags:["/"],stack:[o]};
    var es = function(s){ 
        if (___jindo.isUndefined(s)) return "";
        return  s.replace(/&[a-z]+;/g, function(m){ return (___jindo.isString(ec[m]))?ec[m]:m; })
    };
    var at = function(s,c){s.replace(/([\w\:\-]+)\s*=\s*(?:"((?:\\"|[^"])*)"|'((?:\\'|[^'])*)')/g, function($0,$1,$2,$3){c[$1] = es(($2?$2.replace(/\\"/g,'"'):undefined)||($3?$3.replace(/\\'/g,"'"):undefined));}) };
    var em = function(o){
        for(var x in o){
            if (o.hasOwnProperty(x)) {
                if(Object.prototype[x])
                    continue;
                    return false;
            }
        };
        return true
    };
    /*
      {{fromXML_1}}
     */

    var cb = function($0,$1,$2,$3,$4,$5) {
        var cur, cdata = "";
        var idx = fg.stack.length - 1;
        
        if (___jindo.isString($1)&& $1) {
            if ($1.substr(0,1) != "/") {
                var has_attr = (typeof $2 == "string" && $2);
                var closed   = (typeof $3 == "string" && $3);
                var newobj   = (!has_attr && closed)?"":{};

                cur = fg.stack[idx];
                
                if (___jindo.isUndefined(cur[$1])) {
                    cur[$1] = newobj; 
                    cur = fg.stack[idx+1] = cur[$1];
                } else if (cur[$1] instanceof Array) {
                    var len = cur[$1].length;
                    cur[$1][len] = newobj;
                    cur = fg.stack[idx+1] = cur[$1][len];  
                } else {
                    cur[$1] = [cur[$1], newobj];
                    cur = fg.stack[idx+1] = cur[$1][1];
                }
                
                if (has_attr) at($2,cur);

                fg.tags[idx+1] = $1;

                if (closed) {
                    fg.tags.length--;
                    fg.stack.length--;
                }
            } else {
                fg.tags.length--;
                fg.stack.length--;
            }
        } else if (___jindo.isString($4) && $4) {
            cdata = $4;
        } else if (___jindo.isString($5) && $5) {
            cdata = es($5);
        }
        
        if (cdata.replace(/^\s+/g, "").length > 0) {
            var par = fg.stack[idx-1];
            var tag = fg.tags[idx];

            if (re2.test(cdata)) {
                cdata = parseFloat(cdata);
            }else if (cdata == "true"){
                cdata = true;
            }else if(cdata == "false"){
                cdata = false;
            }
            
            if(___jindo.isUndefined(par)) return;
            
            if (par[tag] instanceof Array) {
                var o = par[tag];
                if (___jindo.isHash(o[o.length-1]) && !em(o[o.length-1])) {
                    o[o.length-1].$cdata = cdata;
                    o[o.length-1].toString = function(){ return cdata; }
                } else {
                    o[o.length-1] = cdata;
                }
            } else {
                if (___jindo.isHash(par[tag])&& !em(par[tag])) {
                    par[tag].$cdata = cdata;
                    par[tag].toString = function(){ return cdata; }
                } else {
                    par[tag] = cdata;
                }
            }
        }
    };
    
    sXML = sXML.replace(/<(\?|\!-)[^>]*>/g, "");
    sXML.replace(re, cb);
    
    return jindo.$Json(o);
};
//-!jindo.$Json.fromXML end!-//

//-!jindo.$Json.prototype.get start!-//
/**
 {{get}}
 */
jindo.$Json.prototype.get = function(sPath) {
    //-@@$Json.get-@@//
    var ___jindo = jindo.$Jindo;
    var oArgs = ___jindo.checkVarType(arguments, {
        '4str' : ['sPath:'+tString]
    },"$Json#get");
    var o = jindo.$Json._oldMakeJSON(this._object,"$Json#get");
    if(!(___jindo.isHash(o)||___jindo.isArray(o))){
        throw new jindo.$Error(jindo.$Except.JSON_MUST_HAVE_ARRAY_HASH,"$Json#get");
    }
    var p = sPath.split("/");
    var re = /^([\w:\-]+)\[([0-9]+)\]$/;
    var stack = [[o]], cur = stack[0];
    var len = p.length, c_len, idx, buf, j, e;
    
    for(var i=0; i < len; i++) {
        if (p[i] == "." || p[i] == "") continue;
        if (p[i] == "..") {
            stack.length--;
        } else {
            buf = [];
            idx = -1;
            c_len = cur.length;
            
            if (c_len == 0) return [];
            if (re.test(p[i])) idx = +RegExp.$2;
            
            for(j=0; j < c_len; j++) {
                e = cur[j][p[i]];
                if (___jindo.isUndefined(e)) continue;
                if (___jindo.isArray(e)) {
                    if (idx > -1) {
                        if (idx < e.length) buf[buf.length] = e[idx];
                    } else {
                        buf = buf.concat(e);
                    }
                } else if (idx == -1) {
                    buf[buf.length] = e;
                }
            }
            
            stack[stack.length] = buf;
        }
        
        cur = stack[stack.length-1];
    }

    return cur;
};
//-!jindo.$Json.prototype.get end!-//

//-!jindo.$Json.prototype.toString start(jindo.$Json._oldToString)!-//
/**
 {{toString}} 
 */
jindo.$Json.prototype.toString = function() {
    //-@@$Json.toString-@@//
    // if (window.JSON&&window.JSON.stringify&&window.JSON.stringify(/!/)) {
        // jindo.$Json.prototype.toString = function() {
            // try{
                // return (window.JSON.stringify(this._object)).substr(0);
            // }catch(e){
                // return jindo.$Json._oldToString(this._object);
            // }
        // }
    // }else{
        // jindo.$Json.prototype.toString = function() {
            return jindo.$Json._oldToString(this._object);
        // }
    // }
//  
    // return this.toString();
};
//-!jindo.$Json.prototype.toString end!-//

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
            if (___jindo.isDate($)) return $+"";
            if (typeof $ == "object"||___jindo.isRegExp($)) return "{}";
            if (isNaN($)) return "null";
        },
        s : function(s) {
            // var e = {'"':'\\\\"',"\\\\":"\\\\\\\\","\n":"\\\\n","\r":"\\\\r","\t":"\\\\t"};
            // var c = function(m){ return (e[m] !== undefined)?e[m]:m };
            // return '"'+s.replace(/[\\\\"'\\n\\r\\t]/g, c)+'"';
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
//-!jindo.$Json._oldToString.hidden end!-//

//-!jindo.$Json.prototype.toXML start!-//
/**
 {{toXML}}
 */
jindo.$Json.prototype.toXML = function() {
    //-@@$Json.toXML-@@//
    var f = function($,tag) {
        var t = function(s,at) { return "<"+tag+(at||"")+">"+s+"</"+tag+">" };
        
        switch (typeof $) {
            case 'undefined':
            case "null":
                return t("");
            case "number":
                return t($);
            case "string":
                if ($.indexOf("<") < 0){
                     return t($.replace(/&/g,"&amp;"));
                }else{
                    return t("<![CDATA["+$+"]]>");
                }
            case "boolean":
                return t(String($));
            case "object":
                var ret = "";
                if ($ instanceof Array) {
                    var len = $.length;
                    for(var i=0; i < len; i++) { ret += f($[i],tag); };
                } else {
                    var at = "";

                    for(var x in $) {
                        if ($.hasOwnProperty(x)) {
                            if (x == "$cdata" || typeof $[x] == "function") continue;
                            ret += f($[x], x);
                        }
                    }

                    if (tag) ret = t(ret, at);
                }
                return ret;
        }
    };
    
    return f(jindo.$Json._oldMakeJSON(this._object,"$Json#toXML"), "");
};
//-!jindo.$Json.prototype.toXML end!-//

//-!jindo.$Json.prototype.toObject start!-//
/**
 {{toObject}}
 */
jindo.$Json.prototype.toObject = function() {
    //-@@$Json.toObject-@@//
    //-@@$Json.$value-@@//
    return jindo.$Json._oldMakeJSON(this._object,"$Json#toObject");
};
//-!jindo.$Json.prototype.toObject end!-//

//-!jindo.$Json.prototype.compare start(jindo.$Json._oldToString,jindo.$Json.prototype.toObject,jindo.$Json.prototype.toString)!-//
/**
 {{compare}}
 */
jindo.$Json.prototype.compare = function(oObj){
    //-@@$Json.compare-@@//
    var ___jindo = jindo.$Jindo;
    var oArgs = ___jindo.checkVarType(arguments, {
        '4obj' : ['oData:'+tHash],
        '4arr' : ['oData:'+tArray]
    },"$Json#compare");
    function compare(vSrc, vTar) {
        if (___jindo.isArray(vSrc)) {
            if (vSrc.length !== vTar.length) { return false; }
            for (var i = 0, nLen = vSrc.length; i < nLen; i++) {
                if (!arguments.callee(vSrc[i], vTar[i])) { return false; }
            }
            return true;
        } else if (___jindo.isRegExp(vSrc) || ___jindo.isFunction(vSrc) || ___jindo.isDate(vSrc)) { // toString 으로 비교할 것들
            return String(vSrc) === String(vTar);
        } else if (typeof vSrc === "number" && isNaN(vSrc)) {
            return isNaN(vTar);
        } else if (___jindo.isHash(vSrc)) {
            var nLen = 0;
            for (var k in vSrc) {nLen++; }
            for (var k in vTar) { nLen--; }
            if (nLen !== 0) { return false; }

            for (var k in vSrc) {
                if (k in vTar === false || !arguments.callee(vSrc[k], vTar[k])) { return false; }
            }

            return true
        }
        
        // === 로 비교할 것들
        return vSrc === vTar;
        
    }
    try{
        return compare(jindo.$Json._oldMakeJSON(this._object,"$Json#compare"), oObj);
    }catch(e){
        return false;
    }


//  return jindo.$Json._oldToString(this._object).toString() == jindo.$Json._oldToString(jindo.$Json(oData).toObject()).toString();
};
//-!jindo.$Json.prototype.compare end!-//

//-!jindo.$Json.prototype.$value start(jindo.$Json.prototype.toObject)!-//
/**
 {{sign_value}}
 */
jindo.$Json.prototype.$value = jindo.$Json.prototype.toObject;
//-!jindo.$Json.prototype.$value end!-//



/**
{{title}}
 */
//-!jindo.$Ajax start(jindo.$Json.prototype.toString)!-//
/**
{{desc}}
 */
/**
{{constructor}}
 */
jindo.$Ajax = function (url, option) {
    var cl = arguments.callee;

    if (!(this instanceof cl)){
        try {
            jindo.$Jindo._maxWarn(arguments.length, 2,"$Ajax");
            return new cl(url, option||{});
        } catch(e) {
            if (e instanceof TypeError) { return null; }
            throw e;
        }
    }   
    var ___ajax = jindo.$Ajax;
    var oArgs = g_checkVarType(arguments, {
        '4str' : [ 'sURL:'+tString ],
        '4obj' : [ 'sURL:'+tString, 'oOption:'+tHash ]
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
        async : true,
        decode :true,
        postBody :false,
        withCredentials:false
    };


    this._options = ___ajax._setProperties(oArgs.oOption,this);
    
    if(this._options.type =="xhr"){
        this._url = oArgs.sURL.replace(new RegExp("^"+window.location.protocol+"//"+window.location.host),function(){return "";});
    }
    ___ajax._validationOption(this._options,"$Ajax");
    
    /*
     {{constructor_1}}
     */
    if(___ajax.CONFIG){
        this.option(___ajax.CONFIG);
    }   

    var _opt = this._options;

    _opt.type   = _opt.type.toLowerCase();
    _opt.method = _opt.method.toLowerCase();
    


    if (window["__"+jindoName+"_callback"] === undefined) {
        window["__"+jindoName+"_callback"] = [];
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
            if(!___ajax.JSONPRequest) throw new ___error(jindoName+'.$Ajax.JSONPRequest'+___except.REQUIRE_AJAX, "$Ajax");
            this._request = new ___ajax.JSONPRequest( function(name,value){return t.option.apply(t, arguments);} );
            
    }   
    this._checkCORS(this._url,_opt.type,"");
};

jindo.$Ajax.prototype._checkCORS = function(sUrl,sType,sMethod){
    this._bCORS = false;
    if(/^http/.test(sUrl)&&sType==="xhr"){
        if(!("withCredentials" in this._request)){
            throw new jindo.$Error(jindo.$Except.NOT_SUPPORT_CORS, "$Ajax"+sMethod);
        }
        this._bCORS = true;
    }   
}

jindo.$Ajax._setProperties = function(option,context){
    option = option||{};
    var type;
    type = option.type = option.type||"xhr";
    option.onload = jindo.$Fn(option.onload||function(){},context).bind();
    option.ontimeout = jindo.$Fn(option.ontimeout||function(){},context).bind();
    option.onerror = jindo.$Fn(option.onerror||function(){},context).bind();
    option.method = option.method ||"post";
    if(type == "xhr"){
        option.async = option.async === undefined?true:option.async;
        option.postBody = option.postBody === undefined?false:option.postBody;
        option.withCredentials = option.withCredentials === undefined?false:option.withCredentials;
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
        if(oOption["method"] !== "get") jindo.$Jindo._warn(___except.CANNOT_USE_OPTION+"\n\t"+sMethod+"-method="+oOption["method"]);
    }else if(sType === "flash"){
        if(!(oOption["method"] === "get" || oOption["method"] === "post")) jindo.$Jindo._warn(___except.CANNOT_USE_OPTION+"\n\t"+sMethod+"-method="+oOption["method"]);
    }
    
    if(oOption["postBody"]){
        if(!(sType === "xhr" && (oOption["method"]!=="get"))){
            jindo.$Jindo._warn(___except.CANNOT_USE_OPTION+"\n\t"+oOption["method"]+"-postBody="+oOption["postBody"]);
        }
    }
    
    var oTypeProperty = {
            "xhr": "onload|timeout|ontimeout|onerror|async|method|postBody|type|withCredentials" , 
            "jsonp": "onload|timeout|ontimeout|onerror|jsonp_charset|callbackid|callbackname|method|type"
    }
    var aName = [];
    var i = 0;
    for(aName[i++] in oOption){}
    var sProperty = oTypeProperty[sType];
    
    for(var i = 0 ,l = aName.length; i < l ; i++){
        if(sProperty.indexOf(aName[i]) == -1) jindo.$Jindo._warn(___except.CANNOT_USE_OPTION+"\n\t"+sType+"-"+aName[i]);
    }
};
/**
 * @ignore
 */
jindo.$Ajax.prototype._onload = function(){
    var status = this._request.status;
    var bSuccess = this._request.readyState == 4 && (status == 200||status==0);
    var oResult;
    if (this._request.readyState == 4) {
        try {
            if ((!bSuccess)&& jindo.$Jindo.isFunction(this._options.onerror)){
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
{{request}}
 */
jindo.$Ajax.prototype.request = function(oData) {
    var ___jindo = jindo.$Jindo;
    var oArgs = ___jindo.checkVarType(arguments, {
        '4voi' : [ ],
        '4obj' : [ ___jindo._F('oData:'+tHash) ],
        '4str' : [ 'sData:'+tString ]
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
     {{request_1}}
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

    if(sUpType=="XHR"){
        req.open(sUpMethod, url, !!opt.async);
    }else{
        req.open(sUpMethod, url);
    }
    
    if(opt.withCredentials){
        req.withCredentials = true;
    }
    if(sUpType=="XHR"&&sUpMethod=="POST"){
        req.setRequestHeader("If-Modified-Since", "Thu, 1 Jan 1970 00:00:00 GMT");
    }
    if(sUpType=="XHR"){
        if(!this._headers["Content-Type"]){
            req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        }
        if(!this._bCORS&&!this._headers["X-Requested-With"]){
            req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        }
        for (var x in this._headers) {
            if(this._headers.hasOwnProperty(x)){
                if (typeof this._headers[x] == "function") 
                    continue;
                req.setRequestHeader(x, String(this._headers[x]));
            }
        }
    }
    if(req.addEventListener){
        /*
         {{request_3}}
         */
        if(this._loadFunc){ req.removeEventListener("load", this._loadFunc, false); }
        if(this._errorFun){ req.removeEventListener("error", this._errorFun, false); }
        this._loadFunc = function(rq){ 
            clearTimeout(_timer);
            _timer = undefined; 
            t._onload(); 
        }
        this._errorFun = function(rq){ 
            clearTimeout(_timer);
            _timer = undefined;
            t._options.onerror(new jindo.$Ajax.Response(t._request));
        }
        req.addEventListener("load", this._loadFunc, false);
        req.addEventListener("error", this._errorFun, false);
    }else{
        if (req.onload !== undefined) {
            req.onload = function(rq){
                if(req.readyState == 4 && !t._is_abort){
                    clearTimeout(_timer); 
                    _timer = undefined;
                    t._onload();
                }
            };
        } else {
            /*
            {{request_4}}
             */
            req.onreadystatechange = function(rq){
                if(req.readyState == 4){
                    clearTimeout(_timer); 
                    _timer = undefined;
                    t._onload();
                }
            };
        }
    }
    if (opt.timeout > 0) {
        
//      if(this._interval)clearInterval(this._interval);
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
    {{request_5}}
     */
    this._test_url = url;
    req.send(data);

    return this;
};

/**
{{isIdle}}
 */
jindo.$Ajax.prototype.isIdle = function(){
    return this._status==0;
};

/**
{{abort}}
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
{{url}}
 */
/**
{{url2}}
 */
jindo.$Ajax.prototype.url = function(sURL){
    var oArgs = g_checkVarType(arguments, {
        'g' : [ ],
        's' : [ 'sURL:'+tString ]
    },"$Ajax#url");
    
    switch(oArgs+"") {
        case 'g':
            return this._url;
        case 's':
            this._checkCORS(oArgs.sURL,this._options.type,"#url");
            this._url = oArgs.sURL;
            return this;
    }
};

/**
{{option}}
 */
/**
{{option2}}
 */
jindo.$Ajax.prototype.option = function(name, value) {
    var oArgs = g_checkVarType(arguments, {
        's4var' : [ 'sKey:'+tString, 'vValue:'+tVariant ],
        's4obj' : [ 'oOption:'+tHash],
        'g' : [ 'sKey:'+tString]
    },"$Ajax#option");
    switch(oArgs+"") {
        case "s4var":
            oArgs.oOption = {};
            oArgs.oOption[oArgs.sKey] = oArgs.vValue;
        case "s4obj":
            var oOption = oArgs.oOption;
            try {
                for (var x in oOption) {
                    if (oOption.hasOwnProperty(x)){
                        if(x==="onload"||x==="ontimeout"||x==="onerror"){
                            this._options[x] = jindo.$Fn(oOption[x],this).bind(); 
                        }else{
                            this._options[x] = oOption[x];  
                        }       
                    } 
                }
            }catch (e) {};
            break;
        case 'g':
            return this._options[oArgs.sKey];
            
    }
    this._checkCORS(this._url,this._options.type,"#option");
    jindo.$Ajax._validationOption(this._options,"$Ajax#option");
    return this;
};

/**
{{header}}
 */
/**
{{header2}}
 */
jindo.$Ajax.prototype.header = function(name, value) {
    if(this._options["type"]==="jsonp"){jindo.$Jindo._warn("{{cannot_use_header}}");} 
    
    var oArgs = g_checkVarType(arguments, {
        's4str' : [ 'sKey:'+tString, 'sValue:'+tString ],
        's4obj' : [ 'oOption:'+tHash ],
        'g' : [ 'sKey:'+tString ]
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
{{response_desc}}
 */
/**
{{response}}
 */
jindo.$Ajax.Response  = function(req) {
    this._response = req;
    this._regSheild = /^for\(;;\);/;
};

/**
{{response_xml}}
 */
jindo.$Ajax.Response.prototype.xml = function() {
    return this._response.responseXML;
};

/**
{{response_text}}
 */
jindo.$Ajax.Response.prototype.text = function() {
    return this._response.responseText.replace(this._regSheild, '');
};

/**
{{response_status}}
 */
jindo.$Ajax.Response.prototype.status = function() {
    var status = this._response.status;
    return status==0?200:status;
};

/**
{{response_readyState}}
 */
jindo.$Ajax.Response.prototype.readyState = function() {
    return this._response.readyState;
};

/**
{{response_json}}
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
{{response_header}}
 */
jindo.$Ajax.Response.prototype.header = function(name) {
    var oArgs = g_checkVarType(arguments, {
        '4str' : [ 'name:'+tString ],
        '4voi' : [ ]
    },"$Ajax.Response#header");
    
    switch (oArgs+"") {
    case '4str':
        return this._response.getResponseHeader(name);
    case '4voi':
        return this._response.getAllResponseHeaders();
    }
};
//-!jindo.$Ajax end!-//


/**
{{title}}
 */
//-!jindo.$Ajax.RequestBase start(jindo.$Class,jindo.$Ajax)!-//
/**
{{requestBase_desc}}
 */
/**
{{requestBase}}
 */
var klass = jindo.$Class;
jindo.$Ajax.RequestBase = klass({
    _respHeaderString : "",
    callbackid:"",
    callbackname:"",
    responseXML  : null,
    responseJSON : null,
    responseText : "",
    status : 404,
    readyState : 0,
    $init  : function(fpOption){},
    onload : function(){},
    abort  : function(){},
    open   : function(){},
    send   : function(){},
    setRequestHeader  : function(sName, sValue) {
        g_checkVarType(arguments, {
            '4str' : [ 'sName:'+tString, 'sValue:'+tString ]
        },"$Ajax.RequestBase#setRequestHeader");
        this._headers[sName] = sValue;
    },
    getResponseHeader : function(sName) {
        g_checkVarType(arguments, {
            '4str' : [ 'sName:'+tString]
        },"$Ajax.RequestBase#getResponseHeader");
        return this._respHeaders[sName] || "";
    },
    getAllResponseHeaders : function() {
        return this._respHeaderString;
    },
    _getCallbackInfo : function() {
        var id = "";
        if(this.option("callbackid")!="") {
            var idx = 0;
            do {
                id = "_" + this.option("callbackid") + "_"+idx;
                idx++;
            } while (window["__"+jindoName+"_callback"][id]);   
        }else{
            do {
                id = "_" + Math.floor(Math.random() * 10000);
            } while (window["__"+jindoName+"_callback"][id]);
        }
        
        if(this.option("callbackname") == ""){
            this.option("callbackname","_callback");
        }
        return {callbackname:this.option("callbackname"),id:id,name:"window.__"+jindoName+"_callback."+id};
    }
});
//-!jindo.$Ajax.RequestBase end!-//

//-!jindo.$Ajax.JSONPRequest start(jindo.$Class,jindo.$Ajax,jindo.$Ajax.RequestBase)!-//
/**
{{jSONPRequest_desc}}
 */
/**
{{jSONPRequest}}
 */
jindo.$Ajax.JSONPRequest = klass({
    _headers : {},
    _respHeaders : {},
    _script : null,
    _onerror : null,
    $init  : function(fpOption){
        this.option = fpOption;
    },
    /**
     * @ignore 
     */
    _callback : function(data) {
        
        if (this._onerror) {
            clearTimeout(this._onerror);
            this._onerror = null;
        }
            
        var self = this;

        this.responseJSON = data;
        this.onload(this);
        setTimeout(function(){ self.abort() }, 10);
    },
    abort : function() {
        if (this._script) {
            try { 
                this._script.parentNode.removeChild(this._script); 
            }catch(e){
            };
        }
    },
    open  : function(method, url) {
        g_checkVarType(arguments, {
            '4str' : [ 'method:'+tString,'url:'+tString]
        },"$Ajax.JSONPRequest#open");
        this.responseJSON = null;
        this._url = url;
    },
    send  : function(data) {
        var oArgs = g_checkVarType(arguments, {
            '4voi' : [],
            '4nul' : ["data:"+tNull],
            '4str' : ["data:"+tString]
        },"$Ajax.JSONPRequest#send");
        var t    = this;
        var info = this._getCallbackInfo();
        var head = document.getElementsByTagName("head")[0];
        this._script = document.createElement("script");
        this._script.type    = "text/javascript";
        this._script.charset = this.option("jsonp_charset");

        if (head) {
            head.appendChild(this._script);
        } else if (document.body) {
            document.body.appendChild(this._script);
        }
        window["__"+jindoName+"_callback"][info.id] = function(data){
            try {
                t.readyState = 4;
                t.status = 200;
                t._callback(data);
            } finally {
                delete window["__"+jindoName+"_callback"][info.id];
            }
        };
        
        var _loadCallback = function(){
            if (!t.responseJSON) {
                t.readyState = 4;
                t.status = 500;
                t._onerror = setTimeout(function(){t._callback(null);}, 200);
            }
        };
        this._script.onload = 
        this._script.onerror = function(){
            _loadCallback();
            this.onerror = null;
            this.onload = null;
        };
        var delimiter = "&";
        if(this._url.indexOf('?')==-1){
            delimiter = "?";
        }
        switch(oArgs+""){
            case "4voi":
            case "4nul":
                data = "";
                break;
            case "4str":
                data = "&" + data;
            
        }
        //test url for spec.
        this._test_url = this._script.src = this._url+delimiter+info.callbackname+"="+info.name+data;
        
    }
}).extend(jindo.$Ajax.RequestBase);
//-!jindo.$Ajax.JSONPRequest end!-//

//-!jindo.$Ajax.Queue start(jindo.$Ajax)!-//
/**
{{queue_desc}}
 */
/**
{{queue}}
 */
jindo.$Ajax.Queue = function (option) {
    //-@@$Ajax.Queue-@@//
    var cl = arguments.callee;
    if (!(this instanceof cl)){ return new cl(option||{});}
    
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [],
        '4obj' : ["option:"+tHash]
    },"$Ajax.Queue");
    option = oArgs.option;
    this._options = {
        async : false,
        useResultAsParam : false,
        stopOnFailure : false
    };

    this.option(option);
    
    this._queue = [];   
};

/**
{{queue_option1}}
 */
/**
{{queue_option2}}
 */
jindo.$Ajax.Queue.prototype.option = function(name, value) {
    
    var oArgs = g_checkVarType(arguments, {
        's4str' : [ 'sKey:'+tString, 'sValue:'+tVariant ],
        's4obj' : [ 'oOption:'+tHash ],
        'g' : [ 'sKey:'+tString ]
    },"$Ajax.Queue#option");
    
    switch(oArgs+"") {
        case 's4str':
            this._options[oArgs.sKey] = oArgs.sValue;
            break;
        case 's4obj':
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

    return this;
};

/**
{{queue_add}}
 */
jindo.$Ajax.Queue.prototype.add = function (oAjax, oParam) {
    var oArgs = g_checkVarType(arguments, {
        '4obj' : ['oAjax:'+tHash],
        '4obj2' : ['oAjax:'+tHash,'oPram:'+tHash]
    },"$Ajax.Queue");
    switch(oArgs+""){
        case "4obj2":
            oParam = oArgs.oPram;
    }
    
    this._queue.push({obj:oAjax, param:oParam});
    return this;
};

/**
{{queue_request}}
 */
jindo.$Ajax.Queue.prototype.request = function () {
    this._requestAsync.apply(this,this.option('async')?[]:[0]);
    return this;
};

jindo.$Ajax.Queue.prototype._requestSync = function (nIdx, oParam) {
    var t = this;
    var queue = this._queue;
    if (queue.length > nIdx+1) {
        queue[nIdx].obj._oncompleted = function(bSuccess, oResult){
            if(!t.option('stopOnFailure') || bSuccess) t._requestSync(nIdx + 1, oResult);
        };
    }
    var _oParam = queue[nIdx].param||{};
    if(this.option('useResultAsParam') && oParam){
        try { for(var x in oParam) if(_oParam[x] === undefined && oParam.hasOwnProperty(x)) _oParam[x] = oParam[x] } catch(e) {};       
    }
    queue[nIdx].obj.request(_oParam);
};

jindo.$Ajax.Queue.prototype._requestAsync = function () {
    for( var i=0; i<this._queue.length; i++)
        this._queue[i].obj.request(this._queue[i].param||{});
};
//-!jindo.$Ajax.Queue end!-//

/**
 {{title}}
 */
//-!jindo.$Date start!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$Date = function(src) {
    //-@@$Date-@@// 
    var a=arguments,t="";
    var cl=arguments.callee;

    if (src && src instanceof cl) return src;
    if (!(this instanceof cl)){
        var str="";
        for(var i = 0, l = a.length; i < l; i++){
            str += "a["+i+"],";
        }
        var init = new Function('cl','a','return new cl('+str.replace(/,$/,"")+');');
        
        try {
            jindo.$Jindo._maxWarn(arguments.length, 7,"$"+tDate);
            return init(cl,a);
        } catch(e) {
            if (e instanceof TypeError) { return null; }
            throw e;
        }
        
    }
    
    var oArgs = g_checkVarType(arguments, {
        '4voi'  : [ ],
        '4str'  : [ 'src:'+tString ],
        '4num'  : [ 'src:'+tNumeric],
        '4dat'  : [ 'src:'+tDate],
        '4num2' : [ 'src:'+tNumeric, 'src:'+tNumeric],
        '4num3' : [ 'src:'+tNumeric, 'src:'+tNumeric, 'src:'+tNumeric],
        '4num4' : [ 'src:'+tNumeric, 'src:'+tNumeric, 'src:'+tNumeric, 'src:'+tNumeric],
        '4num5' : [ 'src:'+tNumeric, 'src:'+tNumeric, 'src:'+tNumeric, 'src:'+tNumeric, 'src:'+tNumeric],
        '4num6' : [ 'src:'+tNumeric, 'src:'+tNumeric, 'src:'+tNumeric, 'src:'+tNumeric, 'src:'+tNumeric, 'src:'+tNumeric],
        '4num7' : [ 'src:'+tNumeric, 'src:'+tNumeric, 'src:'+tNumeric, 'src:'+tNumeric, 'src:'+tNumeric, 'src:'+tNumeric, 'src:'+tNumeric]
    },"$"+tDate);

    switch(oArgs+""){
        case '4voi' : 
            this._date = new Date;
            break;
        case '4num' : 
            this._date = new Date(src*1);
            break;
        case '4str' :
            if (/(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d)))/.test(src)) {
                this._date = jindo.$Date._makeISO(src);
            }else{
                this._date = cl.parse(src);
            }
            break;
        case '4dat' :
            (this._date = new Date).setTime(src.getTime());
            this._date.setMilliseconds(src.getMilliseconds());
            break;
        case '4num2':
        case '4num3':
        case '4num4':
        case '4num5':
        case '4num6':
        case '4num7':
            for(var i = 0 ; i < 7 ; i++){
                if(!jindo.$Jindo.isNumeric(a[i])){
                    a[i] = 1;
                }
            }
            this._date = new Date(a[0],a[1],a[2],a[3],a[4],a[5],a[6]);
    }
    this._names = {};
    for(var i in jindo.$Date.names){
        if(jindo.$Date.names.hasOwnProperty(i))
            this._names[i] = jindo.$Date.names[i];  
    }
};
/**
 * @ignore
 */
jindo.$Date._makeISO = function(src){
    var match = src.match(/(\d{4})(?:-?(\d\d)(?:-?(\d\d)(?:[T ](\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|(?:([-+])(\d\d)(?::?(\d\d))?)?)?)?)?)?/);
    var hour = parseInt(match[4]||0,10);
    var min = parseInt(match[5]||0,10);
    if (match[8] == "Z") {
        hour += jindo.$Date.utc;
    }else if(match[9] == "+" || match[9] == "-"){
        hour += (jindo.$Date.utc - parseInt(match[9]+match[10],10));
        min  +=  parseInt(match[9] + match[11],10);
    }
    return new Date(match[1]||0,parseInt(match[2]||0,10)-1,match[3]||0,hour ,min ,match[6]||0,match[7]||0);
    
};
/**
 * @ignore
 */
jindo.$Date._paramCheck = function(aPram, sType){
    return g_checkVarType(aPram, {
        's' : [ 'nParm:'+tNumeric],
        'g' : []
    },"$Date#"+sType);
};
/**
 {{names}}
 */
jindo.$Date.names = {
    month   : ["January","Febrary","March","April","May","June","July","August","September","October","Novermber","December"],
    s_month : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    day     : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    s_day   : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
    ampm    : ["AM", "PM"]
};

/**
 {{utc}}
 */
jindo.$Date.utc = 9;
//-!jindo.$Date end!-//

//-!jindo.$Date.now start!-//
/**
 {{now}}
 */
jindo.$Date.now = function() {
    //-@@$Date.now-@@//
    
  if(Date.now){
    /**
     * @ignore
     */     
    this.now = function(){
        return Date.now();
    }
  }else{
    /**
     * @ignore
     */
    this.now = function(){
        return +new Date();
    }
  }
  return this.now();
};
//-!jindo.$Date.now end!-//

//-!jindo.$Date.prototype.name start!-//
/**
 {{name}}
 */
/**
 {{name2}}
 */
jindo.$Date.prototype.name = function(vName,aValue){
    //-@@$Date.name-@@//
    var oArgs = g_checkVarType(arguments, {
        's4str' : [ 'sKey:'+tString, 'aValue:'+tArray ],
        's4obj' : [ 'oObject:'+tHash ],
        'g' : [ 'sKey:'+tString ]
    },"$Date#name");
    
    switch(oArgs+"") {
        case 's4str':
            this._names[vName] = aValue;
            break;
        case 's4obj':
            vName = oArgs.oObject;
            for(var i in vName){
                if(vName.hasOwnProperty(i)){
                    this._names[i] = vName[i];
                }
            }
            break;
        case 'g':
            return this._names[vName]; 
    }
    
    return this;
};
//-!jindo.$Date.prototype.name end!-//

//-!jindo.$Date.prototype.parse start!-//
/**
 {{parse}}
 */
jindo.$Date.parse = function(strDate) {
    //-@@$Date.parse-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str' : [ 'sKey:'+tString]
    },"$Date#parse");
    
    var date = new Date(Date.parse(strDate));
    if(isNaN(date)||date == "Invalid "+tDate){
        throw new jindo.$Error(jindo.$Except.INVALID_DATE, "$Date#parse");
    }
    return date;
};
//-!jindo.$Date.prototype.parse end!-//

//-!jindo.$Date.prototype.$value start!-//
/**
 {{value}}
 */
jindo.$Date.prototype.$value = function(){
    //-@@$Date.$value-@@//
    return this._date;
};
//-!jindo.$Date.prototype.$value end!-//

//-!jindo.$Date.prototype.format start(jindo.$Date.prototype.name,jindo.$Date.prototype.isLeapYear,jindo.$Date.prototype.time)!-//
/**
 {{format}}
 */
jindo.$Date.prototype.format = function(strFormat){
    //-@@$Date.format-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str' : [ 'sFormat:'+tString]
    },"$Date#format");
    strFormat = oArgs.sFormat;
    
    var o = {};
    var d = this._date;
    var name = this._names;
    var self = this;
    return (strFormat||"").replace(/[a-z]/ig, function callback(m){
        if (o[m] !== undefined) return o[m];

        switch(m) {
            case"d":
            case"j":
                o.j = d.getDate();
                o.d = (o.j>9?"":"0")+o.j;
                return o[m];
            case"l":
            case"D":
            case"w":
            case"N":
                o.w = d.getDay();
                o.N = o.w?o.w:7;
                o.D = name.s_day[o.w];
                o.l = name.day[o.w];
                return o[m];
            case"S":
                return (!!(o.S=["st","nd","rd"][d.getDate()]))?o.S:(o.S="th");
            case"z":
                o.z = Math.floor((d.getTime() - (new Date(d.getFullYear(),0,1)).getTime())/(3600*24*1000));
                return o.z;
            case"m":
            case"n":
                o.n = d.getMonth()+1;
                o.m = (o.n>9?"":"0")+o.n;
                return o[m];
            case"L":
                o.L = self.isLeapYear();
                return o.L;
            case"o":
            case"Y":
            case"y":
                o.o = o.Y = d.getFullYear();
                o.y = (o.o+"").substr(2);
                return o[m];
            case"a":
            case"A":
            case"g":
            case"G":
            case"h":
            case"H":
                o.G = d.getHours();
                o.g = (o.g=o.G%12)?o.g:12;
                o.A = o.G<12?name.ampm[0]:name.ampm[1];
                o.a = o.A.toLowerCase();
                o.H = (o.G>9?"":"0")+o.G;
                o.h = (o.g>9?"":"0")+o.g;
                return o[m];
            case"i":
                o.i = (((o.i=d.getMinutes())>9)?"":"0")+o.i;
                return o.i;
            case"s":
                o.s = (((o.s=d.getSeconds())>9)?"":"0")+o.s;
                return o.s;
            case"u":
                o.u = d.getMilliseconds();
                return o.u;
            case"U":
                o.U = self.time();
                return o.U;
            default:
                return m;
        }
    });
};
//-!jindo.$Date.prototype.format end!-//

//-!jindo.$Date.prototype.time start!-//
/**
 {{time}}
 */
/**
 {{time2}}
 */
jindo.$Date.prototype.time = function(nTime) {
    //-@@$Date.time-@@//
    var oArgs = jindo.$Date._paramCheck(arguments,"time");
    nTime = oArgs.nParm;
    
    switch(oArgs+""){
        case 's':
            this._date.setTime(nTime);
            return this;
        case 'g':
            return this._date.getTime();
    }
};
//-!jindo.$Date.prototype.time end!-//

//-!jindo.$Date.prototype.year start!-//
/**
 {{year}}
 */
/**
 {{year2}}
 */
jindo.$Date.prototype.year = function(nYear) {
    //-@@$Date.year-@@//
    var oArgs = jindo.$Date._paramCheck(arguments,"year");
    nYear = oArgs.nParm;
    
    switch(oArgs+""){
        case 's':
            this._date.setFullYear(nYear);
            return this;
            
        case 'g':
            return this._date.getFullYear();
            
    }
};
//-!jindo.$Date.prototype.year end!-//

//-!jindo.$Date.prototype.month start!-//
/**
 {{month}}
 */
/**
 {{month2}}
 */
jindo.$Date.prototype.month = function(nMon) {
    //-@@$Date.month-@@//
    var oArgs = jindo.$Date._paramCheck(arguments,"month");
    nMon = oArgs.nParm;
    
    switch(oArgs+""){
        case 's':
            this._date.setMonth(nMon);
            return this;
            
        case 'g':
            return this._date.getMonth();
            
    }

};
//-!jindo.$Date.prototype.month end!-//

//-!jindo.$Date.prototype.date start!-//
/**
 {{date}}
 */
/**
 {{date2}}
 */
jindo.$Date.prototype.date = function(nDate) {
    //-@@$Date.date-@@//
    var oArgs = jindo.$Date._paramCheck(arguments,"date");
    nDate = oArgs.nParm;
    
    switch(oArgs+""){
        case 's':
            this._date.setDate(nDate);
            return this;
            
        case 'g':
            return this._date.getDate();
            
    }
};
//-!jindo.$Date.prototype.date end!-//

//-!jindo.$Date.prototype.day start!-//
/**
 {{day}} 
 */
jindo.$Date.prototype.day = function() {
    //-@@$Date.day-@@//
    return this._date.getDay();
};
//-!jindo.$Date.prototype.day end!-//

//-!jindo.$Date.prototype.hours start!-//
/**
 {{hours}}
 */
/**
 {{hours2}}
 */
jindo.$Date.prototype.hours = function(nHour) {
    //-@@$Date.hours-@@//
    var oArgs = jindo.$Date._paramCheck(arguments,"hours");
    nHour = oArgs.nParm;
    
    switch(oArgs+""){
        case 's':
            this._date.setHours(nHour);
            return this;
            
        case 'g':
            return this._date.getHours();
            
    }

};
//-!jindo.$Date.prototype.hours end!-//

//-!jindo.$Date.prototype.minutes start!-//
/**
 {{minutes}}
 */
/**
 {{minutes2}}
 */
jindo.$Date.prototype.minutes = function(nMin) {
    //-@@$Date.minutes-@@//
    var oArgs = jindo.$Date._paramCheck(arguments,"minutes");
    nMin = oArgs.nParm;
    
    switch(oArgs+""){
        case 's':
            this._date.setMinutes(nMin);
            return this;
            
        case 'g':
            return this._date.getMinutes();
            
    }
};
//-!jindo.$Date.prototype.minutes end!-//

//-!jindo.$Date.prototype.seconds start!-//
/**
 {{seconds}}
 */
/**
 {{seconds2}}
 */
jindo.$Date.prototype.seconds = function(nSec) {
    //-@@$Date.seconds-@@//
    var oArgs = jindo.$Date._paramCheck(arguments,"seconds");
    nSec = oArgs.nParm;
    
    switch(oArgs+""){
        case 's':
            this._date.setSeconds(nSec);
            return this;
            
        case 'g':
            return this._date.getSeconds();
            
    }
};
//-!jindo.$Date.prototype.seconds end!-//

//-!jindo.$Date.prototype.isLeapYear start!-//
/**
 {{isLeapYear}}
 */
jindo.$Date.prototype.isLeapYear = function() {
    //-@@$Date.isLeapYear-@@//
    var y = this._date.getFullYear();

    return !(y%4)&&!!(y%100)||!(y%400);
};
//-!jindo.$Date.prototype.isLeapYear end!-//

//-!jindo.$Date.prototype.compare start!-//
/**
 {{compare}}
 */
jindo.$Date.prototype.compare = function(oDate, sType) {
    //-@@$Date.compare-@@//
    var oArgs = g_checkVarType(arguments, {
        '4dat' : [ 'oDate:'+tDate],
        '4str' : [ 'oDate:'+tDate,'sType:'+tString]
    },"$Date#compare");
    oDate = oArgs.oDate;
    sType = oArgs.sType;

    if(!sType){
        return oDate - this._date;
    }else if(sType === "s"){
        return Math.floor(oDate / 1000) - Math.floor(this._date / 1000);
    }else if(sType === "i"){
        return Math.floor(Math.floor(oDate / 1000)/60) - Math.floor(Math.floor(this._date / 1000)/60);
    }else if(sType === "h"){
        return Math.floor(Math.floor(Math.floor(oDate / 1000)/60)/60) - Math.floor(Math.floor(Math.floor(this._date / 1000)/60)/60);
    }else if(sType === "d"){
        return Math.floor(Math.floor(Math.floor(Math.floor(oDate / 1000)/60)/60)/24) - Math.floor(Math.floor(Math.floor(Math.floor(this._date / 1000)/60)/60)/24);
    }else if(sType === "m"){
        return oDate.getMonth() - this._date.getMonth();
    }else if(sType === "y"){
        return oDate.getFullYear() - this._date.getFullYear();
    }
    
};
//-!jindo.$Date.prototype.compare end!-//

/**
{{title}}
 */
//-!jindo.$Cookie start!-//
/**
{{desc}}
 */
/**
{{constructor}}
 */
jindo.$Cookie = function() {
    //-@@$Cookie-@@//
    var cl = arguments.callee;
    var cached = cl._cached;
    
    if (cl._cached) return cl._cached;
    if(!(this instanceof cl)){
        try{
            jindo.$Jindo._maxWarn(arguments.length, 1,"$Cookie");
            return (arguments.length > 0) ? new cl(arguments[0]) : new cl;
        }catch(e){
            if (e instanceof TypeError) { return null; }
            throw e;
        }
    }
    if (!(this instanceof cl)) return new cl;
    if (typeof jindo.$Jindo.isUndefined(cl._cached)) cl._cached = this;
    
    var oArgs = jindo.$Jindo.checkVarType(arguments, {
        "4voi" : [],
        "4bln" : ["bURIComponent:"+tBoolean]
    }, "$Cookie");
    
    switch(oArgs + ""){
        case "4voi" :
            this._bURIComponent = false;
            break;
        case "4bln" :
            this._bURIComponent = oArgs.bURIComponent;
            break;
    }
};
//-!jindo.$Cookie end!-//

//-!jindo.$Cookie.prototype.keys start!-//
/**
{{keys}}
 */
jindo.$Cookie.prototype.keys = function() {
    //-@@$Cookie.keys-@@//
    var ca = document.cookie.split(";");
    var re = /^\s+|\s+$/g;
    var a  = new Array;
    
    for(var i=0; i < ca.length; i++) {
        a[a.length] = ca[i].substr(0,ca[i].indexOf("=")).replace(re, "");
    }
    
    return a;
};
//-!jindo.$Cookie.prototype.keys end!-//

//-!jindo.$Cookie.prototype.get start!-//
/**
{{get}}
 */
jindo.$Cookie.prototype.get = function(sName) {
    //-@@$Cookie.get-@@//
    var oArgs = jindo.$Jindo.checkVarType(arguments, {
        '4str' : [ 'sName:'+tString]
    },"$Cookie#get");
    var ca = document.cookie.split(/\s*;\s*/);
    var re = new RegExp("^(\\s*"+sName+"\\s*=)");
    var sEncoded;
    var sDecoded;
    
    for(var i=0; i < ca.length; i++) {
        if(re.test(ca[i])){
            sEncoded = ca[i].substr(RegExp.$1.length);
            if(this._bURIComponent && jindo.$Jindo.isNull(sEncoded.match(/%u\w{4}/))){
                sDecoded = decodeURIComponent(sEncoded);
            }else{
                sDecoded = unescape(sEncoded);
            }
            return sDecoded;
        }
    }
    
    return null;
};
//-!jindo.$Cookie.prototype.get end!-//

//-!jindo.$Cookie.prototype.set start!-//
/**
{{set}}
 */
jindo.$Cookie.prototype.set = function(sName, sValue, nDays, sDomain, sPath) {
    //-@@$Cookie.set-@@//
    var ___jindo = jindo.$Jindo;
    var oArgs = ___jindo.checkVarType(arguments, {
        '4str' : [ 'sName:'+tString,"sValue:"+tString],
        'day_for_string' : [ 'sName:'+tString,"sValue:"+tString,"nDays:"+tNumeric],
        'domain_for_string' : [ 'sName:'+tString,"sValue:"+tString,"nDays:"+tNumeric,"sDomain:"+tString],
        'path_for_string' : [ 'sName:'+tString,"sValue:"+tString,"nDays:"+tNumeric,"sDomain:"+tString,"sPath:"+tString]
    },"$Cookie#set");
    
    var sExpire = "";
    var sEncoded;
    
    if(oArgs+"" !== "4str" && nDays !== 0) {
        sExpire = ";expires="+(new Date((new Date()).getTime()+nDays*1000*60*60*24)).toGMTString();
    }
    if (___jindo.isUndefined(sDomain)) sDomain = "";
    if (___jindo.isUndefined(sPath)) sPath = "/";
    
    if(this._bURIComponent){
        sEncoded = encodeURIComponent(sValue);
    }else{
        sEncoded = escape(sValue);
    }
    
    document.cookie = sName + "=" + sEncoded + sExpire + "; path=" + sPath + (sDomain ? "; domain=" + sDomain : "");
    
    return this;
};
//-!jindo.$Cookie.prototype.set end!-//

//-!jindo.$Cookie.prototype.remove start(jindo.$Cookie.prototype.get,jindo.$Cookie.prototype.set)!-//
/**
{{remove}}
 */
jindo.$Cookie.prototype.remove = function(sName, sDomain, sPath) {
    //-@@$Cookie.remove-@@//
    var ___jindo = jindo.$Jindo;
    var oArgs = ___jindo.checkVarType(arguments, {
        '4str' : [ 'sName:'+tString],
        'domain_for_string' : [ 'sName:'+tString,"sDomain:"+tString],
        'path_for_string' : [ 'sName:'+tString,"sDomain:"+tString,"sPath:"+tString]
    },"$Cookie#remove");
    var aArg = _toArray(arguments);
    var aPram = [];
    for(var i = 0, l = aArg.length ; i < l ; i++){
        aPram.push(aArg[i]);
        if(i == 0){
            aPram.push(""); 
            aPram.push(-1); 
        }
    }
    if (!___jindo.isNull(this.get(sName))) this.set.apply(this,aPram);
    
    return this;
};
//-!jindo.$Cookie.prototype.remove end!-//


/**
 {{title}}
 */

//-!jindo.$Template start!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$Template = function(str, sEngineName){
    //-@@$Template-@@//
    var obj = null,
        tag = "",
        cl = arguments.callee,
        _sEngineName;

    if(str instanceof cl){
        return str;
    }
    
    if(!(this instanceof cl)){
        try{
            jindo.$Jindo._maxWarn(arguments.length, 2, "$Template");
            
            return new cl(str || "", sEngineName || "default");
        }catch(e){
            if(e instanceof TypeError){
                return null;
            }
            
            throw e;
        }
    }
    
    var oArgs = g_checkVarType(arguments, {
        '4str' : ['str:'+tString],
        '4ele' : ['ele:'+tElement],
        '4str3' : ['str:'+tString, 'sEngineName:'+tString],
        '4ele3' : ['ele:'+tElement, 'sEngineName:'+tString]
    }, "$Template");
    
    if((obj = document.getElementById(str) || str) && obj.tagName && (tag = obj.tagName.toUpperCase()) && (tag == "TEXTAREA" || (tag == "SCRIPT" && obj.getAttribute("type") == "text/template"))){
        str = (obj.value || obj.innerHTML).replace(/^\s+|\s+$/g, "");
    }
    
    this._str = str + "";
    _sEngineName = "default";
    
    switch(oArgs + ""){
        case "4str3":
        case "4ele3":
            _sEngineName =oArgs.sEngineName; 
            break;
    }
    
    this._compiler = jindo.$Template.getEngine(_sEngineName);
};
jindo.$Template._aEngines = {};
jindo.$Template._cache = {};
jindo.$Template.splitter = /(?!\\)[\{\}]/g;
jindo.$Template.pattern  = /^(?:if (.+)|elseif (.+)|for (?:(.+)\:)?(.+) in (.+)|(else)|\/(if|for)|=(.+)|js (.+)|set (.+)|gset (.+))$/;

/**
 {{addEngine}}
 */
jindo.$Template.addEngine = function(sEngineName, fEngine){
    var oArgs = g_checkVarType(arguments, {
        "4fun" : ["sEngineName:"+tString, "fEngine:"+tFunction]
    }, "$Template#addEngine");
    
    jindo.$Template._aEngines[oArgs.sEngineName] = oArgs.fEngine;
}

/**
 {{getEngine}}
 */
jindo.$Template.getEngine = function(sEngineName){
    var oArgs = g_checkVarType(arguments, {
        "4str" : ["sEngineName:"+tString]
    }, "$Template#getEngine");
    
    return jindo.$Template._aEngines[oArgs.sEngineName];
}
//-!jindo.$Template end!-//

//-!jindo.$Template.prototype.process start!-//
/**
 {{process}}
 */
jindo.$Template.prototype.process = function(data){
    //-@@$Template.process-@@//
    var oArgs = g_checkVarType(arguments, {
            '4obj' : ['data:'+tHash],
            '4voi' : []
        }, "$Template#process"),
        fProcess;
    
    if(jindo.$Template._cache && jindo.$Template._cache[this._str]){
        fProcess = jindo.$Template._cache[this._str];
        
        return fProcess(oArgs + "" == "for_void" ? "" : oArgs.data);
    }
    
    jindo.$Template._cache[this._str] = fProcess = this._compiler(this._str);
    
    return fProcess(oArgs + "" == "for_void" ? "" : oArgs.data);
};
//-!jindo.$Template.prototype.process end!-//

//-!jindo.$Template.addEngine.default start(jindo.$Template)!-//
/**
 {{addEngine_default}}
 */
jindo.$Template.addEngine("default", function(sTemplate){
    var key = "\x01",  
        leftBrace = "\x02",
        rightBrace = "\x03",
        tpl = (" " + sTemplate + " ").replace(/\\{/g, leftBrace).replace(/\\}/g, rightBrace).replace(/(?!\\)\}\{/g, "}" + key + "{").split(jindo.$Template.splitter), i = tpl.length,
        map = { '"' : '\\"', '\\' : '\\\\', '\n' : '\\n', '\r' : '\\r', '\t' : '\\t', '\f' : '\\f' },
        reg = [/(["'](?:(?:\\.)+|[^\\["']+)*["']|[a-zA-Z_](?:[\w\.]|\[(?:.*?)\])*)/g, /[\n\r\t\f"\\]/g, /^\s+/, /\s+$/, /#/g],
        cb = [function(m){ return (m.substring(0, 1) == '"' || m.substring(0, 1) == '\'' || m == 'null' || m == "false" || m == "true") ? m : "d." + m; }, function(m){return map[m] || m}, "", ""],
        stm = [],
        lev = 0,
        delete_info;
    
    // remove " "
    tpl[0] = tpl[0].substr(1);
    tpl[i - 1] = tpl[i - 1].substr(0, tpl[i - 1].length - 1);
    
    // no pattern
    if(i < 2){
        return (function(noPattern){return function(){return noPattern}})(tpl[0]);
    }
    
    tpl = tpl.reverse();
    
    while(i--){
        if(i % 2){
            tpl[i] = tpl[i].replace(jindo.$Template.pattern, function(){
                var m = arguments;
                
                // gset
                if(m[11]){
                    return m[11].replace(/(\w+)(?:\s*)=(?:\s*)(?:([a-zA-Z0-9_]+)|(.+))$/g, function(){
                        var mm = arguments;
                        var str = "var " + mm[1] + "=";
                        if(mm[2]){
                            str += mm[2];
                        }else {
                            str += mm[3].replace(/(=(?:[a-zA-Z_][\w\.]*)+)/g, function(m){
                                return (m.substring(0, 1) == '=') ? "d." + m.replace('=', '') : m;
                            });
                        }
                        return str;
                    }) + ";"; 
                }
                // set
                if(m[10]){
                    return m[10].replace(/(\w+)(?:\s*)=(?:\s*)(?:([a-zA-Z0-9_]+)|(.+))$/g, function(){
                        var mm = arguments;
                        var str = "d." + mm[1] + "=";
                        
                        if(mm[2]){
                            str += "d." + mm[2];
                        }else{
                            str += mm[3].replace(/(=(?:[a-zA-Z_][\w\.]*)+)/g, function(m){
                                return (m.substring(0, 1) == '=') ? "d." + m.replace('=', '') : m;
                            });
                        }
                        
                        return str;
                    }) + ";"; 
                    /*var a =  m[10].replace(/(\w+)(?:\s*)=(?:\s*)(?:([a-zA-Z0-9_]+)|(.+))$/g, function(){
                        var mm = arguments;
                        var str = "d." + mm[1] + "=";
                        if(mm[2]){
                            str += "d." + mm[2];
                        }else{
                            str += mm[3].replace(/((?:[a-zA-Z_](?:[\w\.]|\[(?:.*?)\])*)+)/g, function(m){ 
                                return "d."+m; 
                            });
                        }
                        
                        return str;
                    }) + ";";
                    
                    return a;*/
                }
                // js 
                if(m[9]){
                    return 's[i++] = ' + m[9].replace(/(=(?:[a-zA-Z_][\w\.]*)+)/g, function(m){
                        return (m.substring(0, 1) == '=') ? "d." + m.replace('=', '') : m;
                    }) + ';';
                }
                // variables
                if(m[8]){
                    return 's[i++] = d.' + m[8] + ';';
                }
                // if
                if(m[1]){
                    return 'if(' + m[1].replace(reg[0], cb[0]).replace(/d\.(typeof) /, '$1 ').replace(/ d\.(instanceof) d\./, ' $1 ') + '){';
                }
                // else if
                if(m[2]){
                    return '}else if(' + m[2].replace(reg[0], cb[0]).replace(/d\.(typeof) /, '$1 ').replace(/ d\.(instanceof) d\./, ' $1 ') + '){';
                }
                // for loop
                if(m[5]){
                    delete_info = m[4];
                    var _aStr = [];
                    _aStr.push('var t# = d.' + m[5] + ' || {},');
                    _aStr.push('p# = '+jindoName+'.$Jindo.isArray(t#),');
                    _aStr.push('i# = 0,');
                    _aStr.push('j#,');
                    _aStr.push('leng#,');
                    _aStr.push('aProp# = [],');
                    _aStr.push('sProp#;');
                    _aStr.push('if(p#){');
                    _aStr.push('    leng# = t#.length;');
                    _aStr.push('    for(j# = 0; j# < leng#; j#++){aProp#.push(j#);}');
                    _aStr.push('}else{');
                    _aStr.push('    for(j# in t#){aProp#.push(j#);}');
                    _aStr.push('}');
                    _aStr.push('leng# = aProp#.length;');
                    _aStr.push('for(var x# = 0; x# < leng#; x#++){');
                    _aStr.push('    sProp# = aProp#[x#];');
                    _aStr.push('    if(!p# && !t#.hasOwnProperty(sProp#)){');
                    _aStr.push('        continue;');
                    _aStr.push('    }');
                    _aStr.push('    if((p# && isNaN(i# = parseInt(sProp#, 10))) || (!p# && !t#.propertyIsEnumerable(sProp#))){');
                    _aStr.push('        continue;');
                    _aStr.push('    }');
                    _aStr.push('    d.' + m[4] + ' = t#[sProp#];');
                    _aStr.push(m[3] ? 'd.' + m[3] + ' = sProp#;' : '');
                    
                    return  _aStr.join("").replace(reg[4], lev++);
                }
                // else
                if(m[6]){
                    return '}else{';
                }
                // end if, end for
                if(m[7]){
                    if(m[7] == "for"){
                        return "delete d." + delete_info + "; };";
                    }else{
                        return '};';
                    }
                }
                
                return m[0];
            });
        }else if(tpl[i] == key){
            tpl[i] = "";
        }else if(tpl[i]){
            tpl[i] = 's[i++] = "' + tpl[i].replace(reg[1], cb[1]) + '";';
        }
    }
    
    tpl = tpl.reverse().join('').replace(new RegExp(leftBrace, 'g'), "{").replace(new RegExp(rightBrace, 'g'), "}");
    
    var _aStr = [];
    _aStr.push('d = d || {};');
    _aStr.push('var s = [], i = 0;');
    _aStr.push(tpl);
    _aStr.push('return s.join("");');
    tpl = new Function("d", '' + _aStr.join(""));
    
    return tpl;
});
//-!jindo.$Template.addEngine.default end!-//

//-!jindo.$Template.addEngine.micro start(jindo.$Template)!-//
/**
 {{addEngine_micro}}
 */
jindo.$Template.addEngine("micro", function(sTemplate){
    return new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        "with(obj){p.push('" +
        sTemplate
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'") +
        "');}return p.join('');"
    );
});
//-!jindo.$Template.addEngine.micro end!-//

//-!jindo.$Template.addEngine.handlebars start(jindo.$Template)!-//
/**
 {{addEngine_handlebars}}
 */
jindo.$Template.addEngine("handlebars", function(sTemplate){
    if(typeof Handlebars == "undefined"){
        // 두번째 인자로 '$Template#process'를 지정한 이유는, process()호출시 예외가 발생하기 때문이다.
        throw new jindo.$Error(jindo.$Except.NOT_FOUND_HANDLEBARS, "$Template#process");
    }
    return Handlebars.compile(sTemplate);
});
//-!jindo.$Template.addEngine.handlebars end!-//

//-!jindo.$Template.addEngine.simple start(jindo.$Template)!-//
/**
 {{addEngine_simple}}
 */
jindo.$Template.addEngine("simple", function(sTemplate){
    return function(oData){
        return sTemplate.replace(/\{\{([^{}]*)\}\}/g, function(sMatchA, sMatchB){
            return (typeof oData[sMatchB] == "undefined") ? "" : oData[sMatchB];
        });
    }
});
//-!jindo.$Template.addEngine.simple end!-//

/**
 {{title}}
 */
// copy jindo objects to window





var aClass = [
    "$Agent","$Ajax","$A","$Cookie","$Date","$Document","$Element","$ElementList",
    "$Event","$Form","$Fn","$H","$Json","$S","$Template","$Window"
];
var sClass,oClass;
for(var i = 0, l = aClass.length; i < l; i++){
    sClass = aClass[i];
    oClass = jindo[sClass];
    if(oClass){
        oClass.addExtension = (function(sClass){
            return function(sMethod,fpFunc){
                addExtension(sClass,sMethod,fpFunc);
                return this;    
            }
            
        })(sClass);
    }
}

//$Element, $Event에 hook메서드 추가.
var hooks = ["$Element","$Event"];
for(var i = 0, l = hooks.length; i < l ; i++){
    var _className = hooks[i];
    if(jindo[_className]){
        
        jindo[_className].hook = (function(className){
            var __hook = {};
            return function(sName, vRevisionKey){
        
                var oArgs = g_checkVarType(arguments,{ 
                    'g'  : ["sName:"+tString],
                    's4var' : ["sName:"+tString, "vRevisionKey:"+tVariant],
                    's4obj' : ["oObj:"+tHash]
                },"jindo."+className+".hook");
                
                switch(oArgs+""){
                    case "g":
                        return __hook[oArgs.sName.toLowerCase()];
                    case "s4var":
                        if(vRevisionKey == null){
                            delete __hook[oArgs.sName.toLowerCase()]; 
                        }else{
                            __hook[oArgs.sName.toLowerCase()] = vRevisionKey;
                        }
                        return this;
                    case "s4obj":
                        var oObj = oArgs.oObj;
                        for(var i in oObj){
                            __hook[i.toLowerCase()] = oObj[i];
                        }
                        return this;
                }
            }
        })(_className);
    }
}
//-!jindo.$Element.unload.hidden start!-//
/*
{{element_unload}}
 */
if (!jindo.$Jindo.isUndefined(window)&& !(_j_ag.indexOf("IEMobile") == -1 && _j_ag.indexOf("Mobile") > -1 && _JINDO_IS_SP)) {
    (new jindo.$Element(window)).attach("unload",function(e){
        jindo.$Element.eventManager.cleanUpAll();
    });
}
//-!jindo.$Element.unload.hidden end!-//


if (typeof window != 'undefined') {
    for (prop in jindo) {
        if (jindo.hasOwnProperty(prop)) {
            window[prop] = jindo[prop];
        }
    }
}
