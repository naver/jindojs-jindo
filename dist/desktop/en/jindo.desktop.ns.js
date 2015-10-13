/**
* Jindo
* @type desktop
* @version 2.12.2
* 
* NAVER Corp; JindoJS JavaScript Framework
* http://jindo.dev.naver.com/
* 
* Released under the LGPL v2 license
* http://www.gnu.org/licenses/old-licenses/lgpl-2.0.html
*/

var jindo = window.jindo||{};

jindo._p_ = {};
jindo._p_.jindoName = "jindo";

!function() {
    if(window[jindo._p_.jindoName]) {
        var __old_j = window[jindo._p_.jindoName];
        for(var x in __old_j) {
            jindo[x] = __old_j[x];
        }
    }
}();


/**
	@fileOverview polyfill file
	@name polyfill.js
	@author NAVER Ajax Platform
*/
function _settingPolyfill(target,objectName,methodName,polyfillMethod,force){
    if(force||!target[objectName].prototype[methodName]){
        target[objectName].prototype[methodName] = polyfillMethod;
    }
}

function polyfillArray(global){
    function checkCallback(callback){
        if (typeof callback !== 'function') {
            throw new TypeError("callback is not a function.");
        }
    }
    _settingPolyfill(global,"Array","forEach",function(callback, ctx){
        checkCallback(callback);
        var thisArg = arguments.length >= 2 ? ctx : void 0;
        for(var i = 0, l = this.length; i < l; i++){
            callback.call(thisArg, this[i], i, this);
        }
    });
    _settingPolyfill(global,"Array","every",function(callback, ctx){
        checkCallback(callback);
        var thisArg = arguments.length >= 2 ? ctx : void 0;
        for(var i = 0, l = this.length; i < l; i++){
            if(!callback.call(thisArg, this[i], i, this)) return false;
        }
        return true;
    });
}

if(!window.__isPolyfillTestMode){
    polyfillArray(window);
}

//  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
    Function.prototype.bind = function (target) {
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        
        var arg = Array.prototype.slice.call(arguments, 1), 
        bind = this, 
        nop = function () {},
        wrap = function () {
            return bind.apply(
                nop.prototype && this instanceof nop && target ? this : target,
                arg.concat(Array.prototype.slice.call(arguments))
            );
        };
        
        nop.prototype = this.prototype;
        wrap.prototype = new nop();
        return wrap;
    };
}

function polyfillTimer(global){
    var agent = global.navigator.userAgent, isIOS = /i(Pad|Phone|Pod)/.test(agent), iOSVersion;
    
    if(isIOS){
        var matchVersion =  agent.match(/OS\s(\d)/);
        if(matchVersion){
            iOSVersion = parseInt(matchVersion[1],10);
        }
    }
    
    var raf = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame|| global.msRequestAnimationFrame,
        caf = global.cancelAnimationFrame || global.webkitCancelAnimationFrame|| global.mozCancelAnimationFrame|| global.msCancelAnimationFrame;
    
    if(raf&&!caf){
        var keyInfo = {}, oldraf = raf;

        raf = function(callback){
            function wrapCallback(){
                if(keyInfo[key]){
                    callback();
                }
            }
            var key = oldraf(wrapCallback);
            keyInfo[key] = true;
            return key;
        };

        caf = function(key){
            delete keyInfo[key];
        };
        
    } else if(!(raf&&caf)) {
        raf = function(callback) { return global.setTimeout(callback, 16); };
        caf = global.clearTimeout;
    }
    
    global.requestAnimationFrame = raf;
    global.cancelAnimationFrame = caf;
    
    
    // Workaround for iOS6+ devices : requestAnimationFrame not working with scroll event
    if(iOSVersion >= 6){
        global.requestAnimationFrame(function(){});
    }
    
    // for iOS6 - reference to https://gist.github.com/ronkorving/3755461
    if(iOSVersion == 6){
        var timerInfo = {},
            SET_TIMEOUT = "setTimeout",
            CLEAR_TIMEOUT = "clearTimeout",
            SET_INTERVAL = "setInterval",
            CLEAR_INTERVAL = "clearInterval",
            orignal = {
                "setTimeout" : global.setTimeout.bind(global),
                "clearTimeout" : global.clearTimeout.bind(global),
                "setInterval" : global.setInterval.bind(global),
                "clearInterval" : global.clearInterval.bind(global)
            };
        
        [[SET_TIMEOUT,CLEAR_TIMEOUT],[SET_INTERVAL,CLEAR_INTERVAL]].forEach(function(v){
            global[v[0]] = (function(timerName,clearTimerName){
                return function(callback,time){
                    var timer = {
                        "key" : "",
                        "isCall" : false,
                        "timerType" : timerName,
                        "clearType" : clearTimerName,
                        "realCallback" : callback,
                        "callback" : function(){
                            var callback = this.realCallback;
                            callback();
                            if(this.timerType === SET_TIMEOUT){
                                this.isCall = true;
                                 delete timerInfo[this.key];
                            }
                        },
                        "delay" : time,
                        "createdTime" : global.Date.now()
                    };
                    timer.key = orignal[timerName](timer.callback.bind(timer),time);
                    timerInfo[timer.key] = timer;
            
                    return timer.key;
                };
            })(v[0],v[1]);
            
            global[v[1]] = (function(clearTimerName){
                return function(key){
                    if(key&&timerInfo[key]){
                        orignal[clearTimerName](timerInfo[key].key);
                        delete timerInfo[key];
                    }
                };
            })(v[1]);
            
        });
        
        function restoreTimer(){
            var currentTime = global.Date.now();
            var newTimerInfo = {},gap;
            for(var  i in timerInfo){
                var timer = timerInfo[i];
                orignal[timer.clearType](timerInfo[i].key);
                delete timerInfo[i];
                
                if(timer.timerType == SET_TIMEOUT){
                    gap = currentTime - timer.createdTime;
                    timer.delay = (gap >= timer.delay)?0:timer.delay-gap;
                }
                
                if(!timer.isCall){
                    timer.key = orignal[timer.timerType](timer.callback.bind(timer),timer.delay);
                    newTimerInfo[i] = timer;
                }
                
                
            }
            timerInfo = newTimerInfo;
            newTimerInfo = null;
        }
        
        global.addEventListener("scroll",function(e){
            restoreTimer();
        });
    }

    return global;
}

if(!window.__isPolyfillTestMode){
    polyfillTimer(window);
}

//-!namespace.default start!-//
/**
	@fileOverview A file to define the $() function, jindo.$Jindo() object, and jindo.$Class() object
	@name core.js
	@author NAVER Ajax Platform
 */
/**
 	This has been specified separately in order to eliminate agent dependency.
	
	@ignore
 **/
jindo._p_._j_ag = navigator.userAgent;
jindo._p_._JINDO_IS_IE = /(MSIE|Trident)/.test(jindo._p_._j_ag);  // IE
jindo._p_._JINDO_IS_FF = jindo._p_._j_ag.indexOf("Firefox") > -1;  // Firefox
jindo._p_._JINDO_IS_OP = jindo._p_._j_ag.indexOf("Opera") > -1;  // Presto engine Opera
jindo._p_._JINDO_IS_SP = /Version\/[\d\.]+\s(Mobile\/[\d\w]+\s)?(?=Safari)/.test(jindo._p_._j_ag);  // Safari
jindo._p_._JINDO_IS_CH = /(Chrome|CriOS)\/[\d\.]+\s(Mobile(\/[\w\d]+)?\s)?Safari\/[\d\.]+(\s\([\w\d-]+\))?$/.test(jindo._p_._j_ag);  // Chrome
jindo._p_._JINDO_IS_WK = jindo._p_._j_ag.indexOf("WebKit") > -1;
jindo._p_._JINDO_IS_MO = /(iPhone|iPod|Mobile|Tizen|Android|Nokia|webOS|BlackBerry|Opera Mobi|Opera Mini)/.test(jindo._p_._j_ag);

jindo._p_.trim = function(str){
	if(String.prototype.trim) {
		return str.trim();
	} else {
		// removes white space, '\u00A0' no-break space and '\uFEFF' zero width no-break
		var sBlank = "\\s\\uFEFF\\u00A0", re = RegExp(["^[", "]+|[", "]+$"].join(sBlank), "g");
		return str.replace(re, "");
	}
};
//-!namespace.default end!-//

//-!jindo.$Jindo.default start!-//
/**
	The jindo.$Jindo() object provides the information of the framework and utility functions.

	@class jindo.$Jindo
	@keyword core, $Jindo
 */
/**
	Creates a jindo.$Jindo() object. The jindo.$Jindo() object provides the information of the framework and utility functions.
	
	@constructor
	@remark The following table describes the attributes of objects that contain the Jindo framework information.<br>
		<h5>Attributes of the object containing the information of Jindo framework</h5>
		<table class="tbl_board">
			<caption class="hide">Attributes of the object containing the information of Jindo framework</caption>
			<thead>
				<tr>
					<th scope="col" style="width:15%">Name</th>
					<th scope="col" style="width:15%">Type</th>
					<th scope="col">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">version</td>
					<td>Number</td>
					<td class="txt">Stores version information about the Jindo framework.</td>
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
	A function that sets and returns compatible mode
	
	@method compatible
	@ignore
	@param {Boolean} bType
	@return {Boolean} [true | false]
 */
jindo.$Jindo.compatible = function(){
    return false;
};

/**
	Used when mixin object (Object on source property, pass through)

	@method mixin
	@static
	@param {Hash} oDestination
	@param {Hash} oSource
	@return {Hash} oNewObject
	@since 2.2.0
	@example
		var oDestination = {
			"foo" :1,
			"test" : function(){}
		};
		var oSource = {
			"bar" :1,
			"obj" : {},
			"test2" : function(){}
		};
		
		var  oNewObject = jindo.$Jindo.mixin(oDestination,oSource);
		
		oNewObject == oDestination //false
		
		// oNewObject => {
		// "foo" :1,
		// "test" : function(){},
		//     
		// "bar" :1,
		// "obj" : {},
		// "test2" : function(){}
		// };
 */
jindo.$Jindo.mixin = function(oDestination, oSource){
    jindo._checkVarType(arguments, {
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
    CANNOT_USE_OPTION:"The option is not allowed.",
    CANNOT_USE_HEADER:"If when type is jsonp or CORS request using XDomainRequest(IE8,9) on desktop environment, you cannot use header method.",
    PARSE_ERROR:"An error occurs while parsing.",
    NOT_FOUND_ARGUMENT:"No parameter exists.",
    NOT_STANDARD_QUERY:"Abnormal CSS selector",
    INVALID_DATE:"Invalid date foramt",
    REQUIRE_AJAX:" does not exist.",
    NOT_FOUND_ELEMENT:"No element exists.",
    HAS_FUNCTION_FOR_GROUP:"A function to detach is required unless it is deleted as a group.",
    NONE_ELEMENT:" does not have corresponding element.",
    NOT_SUPPORT_SELECTOR:" is not supported.",
	NOT_SUPPORT_CORS:"This browser not support CORS.",
    NOT_SUPPORT_METHOD:"The method is not supported on the desktop.",
    JSON_MUST_HAVE_ARRAY_HASH:"The get method is available only if json type is hash or array",
    MUST_APPEND_DOM : "A base element must be appended to document.",
    NOT_USE_CSS : " does not use css.",
    NOT_WORK_DOMREADY : "domready event can't be used inside of iframe.",
    CANNOT_SET_OBJ_PROPERTY : " property type is Object.\nIf class property is object then All instance is share it. so danger.",
    NOT_FOUND_HANDLEBARS : "{{not_found_handlebars}}",
    INVALID_MEDIA_QUERY : "{{invalid_media_query}}"
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
	A function to check if a parameter is Function or not.
	
	@method isFunction
	@static
	@param {Variant} oObj
	@return {Boolean} [true | false]
	@since 2.0.0
 */

/**
	A function to check if a parameter is Array or not.
	
	@method isArray
	@static
	@param {Variant} oObj
	@return {Boolean} [true | false]
	@since 2.0.0
 */

/**
	A function to check if a parameter is String or not.
	
	@method isString
	@static
	@param {Variant} oObj
	@return {Boolean} [true | false]
	@since 2.0.0
 */

/**
	A function to check if a parameter is Numeric or not.
	
	@method isNumeric
	@static
	@param {Variant} oObj
	@return {Boolean} [true | false]
	@since 2.0.0
 */
jindo.$Jindo.isNumeric = function(nNum){
    return !isNaN(parseFloat(nNum)) && !jindo.$Jindo.isArray(nNum) &&isFinite( nNum );
};
/**
	A function to check if a parameter is Boolean or not.
	
	@method isBoolean
	@static
	@param {Variant} oObj
	@return {Boolean} [true | false]
	@since 2.0.0
 */
/**
	A function to check if a parameter is Date or not.
	
	@method isDate
	@static
	@param {Variant} oObj
	@return {Boolean} [true | false]
	@since 2.0.0
 */
/**
	A function to check if a parameter is Regexp or not.
	
	@method isRegexp
	@static
	@param {Variant} oObj
	@return {Boolean} [true | false]
	@since 2.0.0
 */
/**
	A function to check if a parameter is Element or not.
	
	@method isElement
	@static
	@param {Variant} oObj
	@return {Boolean} [true | false]
	@since 2.0.0
 */
/**
	A function to check if a parameter is Document or not.
	
	@method isDocument
	@static
	@param {Variant} oObj
	@return {Boolean} [true | false]
	@since 2.0.0
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
	A function to check if a parameter is Node or not.
	
	@method isNode
	@static
	@param {Variant} oObj
	@return {Boolean} [true | false]
	@since 2.0.0
 */
jindo.$Jindo.isNode = function(eEle){
    try{
        return !!(eEle&&eEle.nodeType);
    }catch(e){
        return false;
    }
};

/**
	A function to check if a parameter is Hash or not.
	
	@method isHash
	@static
	@param {Variant} oObj
	@return {Boolean} [true | false]
	@since 2.0.0
 */
jindo.$Jindo.isHash = function(oObj){
    return jindo._p_._objToString.call(oObj) == "[object Object]"&&oObj !== null&&oObj !== undefined&&!!!oObj.nodeType&&!jindo.$Jindo.isWindow(oObj);
};

/**
	A function to check if a parameter is Null or not.
	
	@method isNull
	@static
	@param {Variant} oObj
	@return {Boolean} [true | false]
	@since 2.0.0
 */
jindo.$Jindo.isNull = function(oObj){
    return oObj === null;
};
/**
	A function to check if a parameter is Undefined or not.
	
	@method isUndefined
	@static
	@param {Variant} oObj
	@return {Boolean} [true | false]
	@since 2.0.0
 */
jindo.$Jindo.isUndefined = function(oObj){
    return oObj === undefined;
};

/**
	A function to check if a parameter is Window or not.
	
	@method isWindow
	@static
	@param {Variant} oObj
	@return {Boolean} [true | false]
	@since 2.0.0
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
	Checks whether the function parameter complies to the desired rule.
	
	@method checkVarType
	@ignore
	@param {Array} aArgs Parameter list
	@param {Hash} oRules Rule list
	@param {String} sFuncName The function name to be used to show an error message
	@return {Object}
 */
jindo.$Jindo._F = function(sKeyType) {
    return sKeyType;
};

jindo.$Jindo._warn = function(sMessage){
    window.console && ( (console.warn && console.warn(sMessage), true) || (console.log && console.log(sMessage), true) );
};

jindo.$Jindo._maxWarn = function(nCurrentLength, nMaxLength, sMessage) {
    if(nCurrentLength > nMaxLength) {
        jindo.$Jindo._warn('Additional parameter exists. : '+sMessage);
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

    if(bCompat) {
        aPrependCode.push('var nMatchScore;');
        aPrependCode.push('var nMaxMatchScore = -1;');
        aPrependCode.push('var oFinalRet = null;');
    }

    var aBodyCode = [];
    var nMaxRuleLen = 0;

    for(var sType in oRules) if (oRules.hasOwnProperty(sType)) {
        nMaxRuleLen = Math.max(oRules[sType].length, nMaxRuleLen);
    }

    for(var sType in oRules) if (oRules.hasOwnProperty(sType)) {
        var aRule = oRules[sType];
        var nRuleLen = aRule.length;

        var aBodyPrependCode = [];
        var aBodyIfCode = [];
        var aBodyThenCode = [];

        if(!bCompat) {
            if (nRuleLen < nMaxRuleLen) { aBodyIfCode.push('nArgsLen === ' + nRuleLen); }
            else { aBodyIfCode.push('nArgsLen >= ' + nRuleLen); }
        }

        aBodyThenCode.push('var oRet = new $Jindo._varTypeRetObj();');

        var nTypeCount = nRuleLen;

        for (var i = 0; i < nRuleLen; ++i) {
           var aRegExpResult = /^([^:]+):([^\+]*)(\+?)$/.exec(aRule[i]),
           	   sVarName = aRegExpResult[1],
               sVarType = aRegExpResult[2],
               bAutoCast = !!aRegExpResult[3];

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

jindo._checkVarType = jindo.$Jindo.checkVarType;

// type check return type object
jindo.$Jindo._varTypeRetObj = function() {};
jindo.$Jindo._varTypeRetObj.prototype.toString = function(){ return this.__type; };

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

        var aMsg = [ 'Invalid parameter', '' ];

        if (sUsed) {
            aMsg.push('Call type :');
            aMsg.push('\t' + sUsed);
            aMsg.push('');
        }

        if (aSuggs.length) {
            aMsg.push('Available type :');
            for (var i = 0, nLen = aSuggs.length; i < nLen; i++) {
                aMsg.push('\t' + aSuggs[i]);
            }
            aMsg.push('');
        }

        if (sURL) {
            aMsg.push('Manual page :');
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
        sURL = 'http://jindo.dev.naver.com/docs/jindo/2.12.2/desktop/en/classes/jindo.' + encodeURIComponent(RegExp.$1) + '.html' + "#method_"+RegExp.$2;
    }

    throw new TypeError(fpErrorMessage(sUsed, aSuggs, sURL));

};

var _getElementById = function(doc,id){
    // Modified because on IE6/7 can be selected elements using getElementById by name
    var docEle = doc.documentElement;
    var sCheckId = "jindo"+ (new Date()).getTime();
    var eDiv = doc.createElement("div");
    eDiv.style.display =  "none";
    if(typeof MSApp != "undefined"){
        MSApp.execUnsafeLocalFunction(function(){
            eDiv.innerHTML = "<input type='hidden' name='"+sCheckId+"'/>";
        });
    }else{
        eDiv.innerHTML = "<input type='hidden' name='"+sCheckId+"'/>";
    }
    docEle.insertBefore( eDiv, docEle.firstChild );
    if(doc.getElementById(sCheckId)){
        _getElementById = function(doc,id){
            var eId = doc.getElementById(id);
            if(eId == null) return eId;
            if(eId.attributes['id'] && eId.attributes['id'].value == id){
                return eId;
            }
            var aEl = doc.all[id];
            for(var i=1; i<aEl.length; i++){
                if(aEl[i].attributes['id'] && aEl[i].attributes['id'].value == id){
                    return aEl[i];
                }
            }
        };
    }else{
        _getElementById = function(doc,id){
            return doc.getElementById(id);
        };
    }

    docEle.removeChild(eDiv);
    return _getElementById(doc,id);
};
/**
	Gets the type that is used while executing checkVarType.
	
	@method varType
	@ignore
	@param {String+} sTypeName Type name
	@return {Function} The function that implements the rules to check types
 */
/**
	Sets the type to be used to execute checkVarType.
	
	@method varType
	@ignore
	@syntax sTypeName, fpFunc
	@syntax oTypeLists
	@param {String+} sTypeName Type name
	@param {Function+} fpFunc The function that implements the rules to check types
	@param {Hash+} oTypeLists The object that contains the type rules, 이 옵션을 사용하면 checkVarType 를 수행할때 사용할 여러개의 타입들을 한번에 설정할 수 있다.
	@return {this} instance of itself
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
	Used by the function, which is registered to varType and checks the type, to notify that the type does not match.
	
	@constant VARTYPE_NOT_MATCHED
	@static
	@ignore
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

/**
	Built-In Namespace _global_
	
	@class jindo
	@static
 */
//-!jindo.$ start!-//
/**
	The $() function creates an element from DOM. It creates an object with the tagName object when the character string is entered in the form of "&lt;tagName&gt;."
	
	@method $
	@param {String+} elDomElement The DOM element to be created.
	@return {Variant} If any element has been created, returns it as an object.
	@throws {jindo.$Except.NOT_FOUND_ARGUMENT} The exception occurs when no parameters exist.
	@remark The document element can be specified in the last parameter in version 1.4.6 or higher of Jindo.
	@example
		// Creates an object by using a string such as tagName format.
		var el = $("<DIV>");
		var els = $("<DIV id='div1'><SPAN>hello</SPAN></DIV>");
		
		// In Internet Explorer, document must be specified to create elements to be added to iframe (available in version 1.4.6 and higher).
		var els = $("<div>" , iframe.contentWindow.document);
		// If code is written such like above, div tags are generated based on iframe.contentWindow.document.
 */
/**
	The $() function retrieves a specific element to be manipulated from DOM. Retrieves the DOM element by using the ID. When two or more parameters are specified, returns the array which has the DOM elements.
	
	@method $
	@param {String+} sID* The ID of the 1st~Nth DOM element to be retrieved
	@return {Variant} Returns the DOM element specified with the ID value or the array which has the DOM elements. If no element corresponding to the ID exists, returns null.
	@throws {jindo.$Except.NOT_FOUND_ARGUMENT} The exception occurs when no parameters exist.
	@remark The document element can be specified in the last parameter in version 1.4.6 or higher of Jindo.
	@example
		// Returns an object by using ID.
		<div id="div1"></div>
		
		var el = $("div1");
		
		// Returns multiple objects by using IDs.
		<div id="div1"></div>
		<div id="div2"></div>
		
		var els = $("div1","div2"); // Returns a result such as [$("div1"),$("div2")] format.
 */
jindo.$ = function(sID/*, id1, id2*/) {
    //-@@$-@@//

    if(!arguments.length) throw new jindo.$Error(jindo.$Except.NOT_FOUND_ARGUMENT,"$");

    var ret = [], arg = arguments, nArgLeng = arg.length, lastArgument = arg[nArgLeng-1],doc = document,el  = null;
    var reg = /^<([a-z]+|h[1-5])>$/i;
    var reg2 = /^<([a-z]+|h[1-5])(\s+[^>]+)?>/i;
    if (nArgLeng > 1 && typeof lastArgument != "string" && lastArgument.body) {
        /*
         If the last argument is document
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

                    for(var i=0,leng = ele.length; i < leng ; i++) {
                        ret.push(ele[i]);
                    }

                    el = null;
                }
            }else {
                el = _getElementById(doc,el);
            }
        }
        if (el&&el.nodeType) ret[ret.length] = el;
    }
    return ret.length>1?ret:(ret[0] || null);
};

//-!jindo.$ end!-//


//-!jindo.$Class start!-//
/**
	The jindo.$Class() object uses the Jindo framework to implement the application using object-oriented programming.
	
	@class jindo.$Class
	@keyword class
 */
/**
	Creates a class (the jindo.$Class() object). Enter the object to become a class as a parameter. To define the constructor function that is used to create class instances, register a method to the object and name it $init. In addition, the $static keyword allows you to register a method that can be used even when no instance is created.
	
	@constructor
	@param {Hash+} oDef The object that defines the class. Defines the class constructor, attributes, and methods.
	@return {jindo.$Class} Returns the created class (the jindo.$Class() object).
	@example
		var CClass = $Class({
		    prop : null,
		    $init : function() {
		         this.prop = $Ajax();
		         ...
		    },
			$static : {
				static_method : function(){ return 1;}
			}
		});
		
		var c1 = new CClass();
		var c2 = new CClass();
		
		// c1 and c2 have different jindo.$Ajax() objects.
		CClass.static_method(); // 1
 */
/**
	If $autoBind set true, methods name which has '_'(underscore) character, will automatically bound.
	
	@property $autoBind
	@type boolean
	@example
		// $autoBind sample
		var OnAutoBind = $Class({
			$autoBind : true,
			num : 1,
			each : function(){
				$A([1,1]).forEach(this._check);	
			},
			_check : function(v){
				// this === OnScope instance
				value_of(v).should_be(this.num);
			}
		});
		
		new OnScope().each();
	@filter desktop
 */
/**
	Method registered as $static, can be used without creating class instance.
	
	@property $static
	@type Object
	@example
		// $static example
		var Static = $Class({
			$static : {
				"do" : function(){
					console.log("static method");
				}
				
			}
		});
		
		Static.do();
		//static method
	@filter desktop
 */
jindo.$Class = function(oDef) {
    //-@@$Class-@@//
    var oArgs = jindo._checkVarType(arguments, {
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
                if (t._$superClass.prototype.hasOwnProperty(x)) {
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
	The kindOf() method which checks its class type
	
	@method kindOf
	@param {jindo.$Class} oClass The class(the jindo.$Class() object) to be checked.
	@return {Boolean} true | false
	@since 2.0.0
	@example
		var Parent = $Class ({});
		var Parent2 = $Class ({});
		var Child = $Class ({}).extend(Parent);
		
		var child = new Child();
		child.kindOf(Parent);// true
		child.kindOf(Parent2);// false
 */
jindo._p_._kindOf = function(oThis, oClass){
    if(oThis != oClass){
        if(oThis._$superClass) {
            return jindo._p_._kindOf(oThis._$superClass.prototype,oClass);
        } else {
            return false;
        }
    } else {
        return true;
    }
};
 /**
	The extend() method extends a specific class (the jindo.$Class() object) and speficies the superclass to inherit.
	
	@method extend
	@param {jindo.$Class} superClass The superclass (the jindo.$Class() object) to inherit
	@return {this} Inherited instance of itself.
	@example
		var ClassExt = $Class(classDefinition);
		ClassExt.extend(superClass);
		// ClassExt extends SuperClass.
 */
jindo.$Class.extend = function(superClass) {
    var oArgs = jindo._checkVarType(arguments, {
        '4obj' : [ 'oDef:$Class' ]
    },"<static> $Class#extend");

    this.prototype._$superClass = superClass;


    // inherit static methods of parent
    var superProto = superClass.prototype;
    for(var prop in superProto){
        if(jindo.$Jindo.isHash(superProto[prop])) jindo.$Jindo._warn(jindo.$Except.CANNOT_SET_OBJ_PROPERTY);
    }
    for(var x in superClass) {
        if (superClass.hasOwnProperty(x)) {
            if (x == "prototype") continue;

            if(this[x] === undefined) {
	            this[x] = superClass[x];
	        }
        }
    }
    return this;
};
/**
	The $super attribute is used to access the methods of a parent class. Subclasses can access their immediate superclasses through this.$super.method. However, they cannot access superclasses that are two or more tiers higher than themselves, even if this.$super.$super.method is used. In addition, when the superclass and the subclass have the method with the identical name and the subclass calls the method with the name by using $super, the method of the superclass is called.
	
	@property $super
	@type $Class
	@example
		var Parent = $Class ({
			a: 100,
			b: 200,
			c: 300,
			sum2: function () {
				var init = this.sum();
				return init;
			},
			sum: function () {
				return this.a + this.b
			}
		});
	
		var Child = $Class ({
			a: 10,
			b: 20,
			sum2 : function () {
				var init = this.sum();
				return init;
			},
			sum: function () {
				return this.b;
			}
		}).extend (Parent);
	
		var oChild = new Child();
		var oParent = new Parent();
	
		oChild.sum();           // 20
		oChild.sum2();          // 20
		oChild.$super.sum();    // 30 -> Adds 10(a) and 20(b) of a child class instead of adding 100(a) and 200(b) of a parent class.
		oChild.$super.sum2();   // 20 -> Invokes sum() of a child class, not sum() of a parent class in the sum2 method of the parent class.
*/
//-!jindo.$Class end!-//

/**
    jindo version and type property

    jindo.VERSION; // Version string - ex. "2.9.2"
    jindo.TYPE;    // Version type string (desktop|mobile) - ex. "desktop"
*/
jindo.VERSION = "2.12.2";
jindo.TYPE = "desktop";

/**
 	@fileOverview An optional engine that uses a CSS selector.
	@name cssquery.js
	@author  AjaxUI lab
 */
//-!jindo.cssquery start(jindo.$Element)!-//
/**
 	Built-In Namespace _global_
	
	@class jindo
	@static
 */
/**
 	The $$() function (cssquery) uses the CSS selector to search for objects. cssquery() can be used instead of $$().
	
	@method $$
	@syntax sSelector, elBaseElement
	@syntax sSelector, sBaseElement
	@param {String+} sSelector CSS selector.
	@param {Element+} [elBaseElement] The DOM element to search for. Searches for the object from the subnodes of the specified element.
	@param {String+} sBaseElement The ID character string of the DOM element to search for. Searches for the object from the subnodes of the specified element.
	@return {Array} Returns the element that matches the condition in the array format.
	@remark There are two patterns that can be used as a CSS selector: standard and non-standard. The standard pattern supports the patterns in the CSS Level3 specification. The standard pattern supports the patterns in the CSS Level3 specification. For the description on the pattern of the selector, see the following table and the See Also section.<br>
		<h5>The element, ID, class, and selector</h5>
		<table class="tbl_board">
			<caption class="hide">The element, ID, class, and selector</caption>
			<thead>
				<tr>
					<th scope="col" style="width:20%">Pattern</th>
					<th scope="col">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">*</td>
					<td class="txt">Every element
<pre class="code "><code class="prettyprint linenums">
	$$("*");
	// Every element in a document
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">HTML Tagname</td>
					<td class="txt">Specified HTML tags
<pre class="code "><code class="prettyprint linenums">
	$$("div");
	// Every &lt;div&gt; element in a document
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">#id</td>
					<td class="txt">Element of which the ID is specified
<pre class="code "><code class="prettyprint linenums">
	$$("#application")
	// Element of which the ID is application
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">.classname</td>
					<td class="txt">Element of which the class is specified
<pre class="code "><code class="prettyprint linenums">
	$$(".img");
	// Element of which the class is img
</code></pre>
					</td>
				</tr>
			</tbody>
		</table>
		<h5>The attribute selector</h5>
		<table class="tbl_board">
			<caption class="hide">The attribute selector</caption>
			<thead>
				<tr>
					<th scope="col" style="width:20%">Pattern</th>
					<th scope="col">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">[type]</td>
					<td class="txt">Element that has a specified attribute
<pre class="code "><code class="prettyprint linenums">
	$$("input[type]");
	// The &lt;input&gt; elelment that has the type attribute
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">[type=value]</td>
					<td class="txt">Element of which the attribute is identical to value
<pre class="code "><code class="prettyprint linenums">
	$$("input[type=text]");
	// The &lt;input&gt; element of which value of the type attribute is text
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">[type^=value]</td>
					<td class="txt">Element of which the attribute value begins with a specific value
<pre class="code "><code class="prettyprint linenums">
	$$("input[type^=hid]");
	//The &lt;input&gt; element of which value of the type attribute begins with hid
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">[type$=value]</td>
					<td class="txt">Element of which the attribute value ends with a specific value
<pre class="code "><code class="prettyprint linenums">
	$$("input[type$=en]");
	//The &lt;input&gt; element of which value of the type attribute ends with en
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">[type~=value]</td>
					<td class="txt">Element that has only one value when multiple values separated by space exist
<pre class="code "><code class="prettyprint linenums">
	&lt;img src="..." alt="welcome to naver"&gt;
	$$("img[alt~=welcome]"); // Yes
	$$("img[alt~=naver]"); // Yes
	$$("img[alt~=wel]"); // No
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">[type*=value]</td>
					<td class="txt">Element that has value identical to one of its attributes
<pre class="code "><code class="prettyprint linenums">
	$$("img[alt*=come]"); // Yes
	$$("img[alt*=nav]"); // Yes
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">[type!=value]</td>
					<td class="txt">Element of which value is not identical to specified value
<pre class="code "><code class="prettyprint linenums">
	$$("input[type!=text]");
	// Value of the type attribute is not text
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">[@type]</td>
					<td class="txt">As a selector exclusively used for cssquery, it uses the style attribute of the element instead of the attribute of the element. All the characteristics of the CSS attribute selector can be used.
<pre class="code "><code class="prettyprint linenums">
	$$("div[@display=block]");
	//  Element of which the display style attribute value is block
</code></pre>
					</td>
				</tr>
			</tbody>
		</table>
		<h5>The virtual class selector</h5>
		<table class="tbl_board">
			<caption class="hide">The virtual class selector</caption>
			<thead>
				<tr>
					<th scope="col" style="width:20%">Pattern</th>
					<th scope="col">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">:nth-child(n)</td>
					<td class="txt">Selects the element based on the nth-child.
<pre class="code "><code class="prettyprint linenums">
	$$("div:nth-child(2)");
	// The &lt;div&gt; element, the second child element
	
	$$("div:nth-child(2n)");
	$$("div:nth-child(even)");
	// All &lt;div&gt; elements, every even-numbered child elements
	
	$$("div:nth-child(2n+1)");
	$$("div:nth-child(odd)");
	// All &lt;div&gt; elements, every odd-numbered child elements
	
	$$("div:nth-child(4n)");
	// All &lt;div&gt; elements, every multiple of 4 for child elements
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">:nth-last-child(n)</td>
					<td class="txt">It is the same as the nth-child but selects backword from the end of the elements.
<pre class="code "><code class="prettyprint linenums">
	$$("div:nth-last-child(2)");
	// All &lt;div&gt; elements, second position from the end of the child elements
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">:last-child</td>
					<td class="txt">Selects the element based on the last child .
<pre class="code "><code class="prettyprint linenums">
	$$("div:last-child");
	// All the &lt;div&gt; elements, the last child elements
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">:nth-of-type(n)</td>
					<td class="txt">Selects the element detected as nth.
<pre class="code "><code class="prettyprint linenums">
	&lt;div&gt;
		&lt;p&gt;1&lt;/p&gt;
		&lt;span&gt;2&lt;/span&gt;
		&lt;span&gt;3&lt;/span&gt;
	&lt;/div&gt;
</code></pre>
						If the DOM shown above exists, $$("span:nth-child(1)") does not return the result value because no element of which &lt;span&gt; is firstChild exists. However, $$("span:nth-of-type(1)") gets &lt;span&gt;2&lt;/span&gt;, the first &lt;span&gt; element among &lt;span&gt; elements.<br>Like the nth-child, the odd/even expressions can be used.
					</td>
				</tr>
				<tr>
					<td class="txt bold">:first-of-type</td>
					<td class="txt">Selects the first element among the sibling elements with the same tag name.<br>The result value returned is the same with the nth-of-type(1).</td>
				</tr>
				<tr>
					<td class="txt bold">:nth-last-of-type</td>
					<td class="txt">Identical with nth-of-type, but it selects the elements from the last.</td>
				</tr>
				<tr>
					<td class="txt bold">:last-of-type</td>
					<td class="txt">Selects the last element among the sibling elements with the same tag name.<br>The result value returned is the same with the nth-last-of-type(1).</td>
				</tr>
				<tr>
					<td class="txt bold">:contains</td>
					<td class="txt">Selects the element based on whether it includes a specific character string in the text node.
<pre class="code "><code class="prettyprint linenums">
	$$("span:contains(Jindo)");
	// The &lt;span&gt; element that includes the "Jindo" character string
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">:only-child</td>
					<td class="txt">Selects elements with no sibling elements.
<pre class="code "><code class="prettyprint linenums">
	&lt;div&gt;
		&lt;p&gt;1&lt;/p&gt;
		&lt;span&gt;2&lt;/span&gt;
		&lt;span&gt;3&lt;/span&gt;
	&lt;/div&gt;
</code></pre>
						In the above DOM, $$("div:only-child") has a return value. But neither $$("p:only-child") nor $$("span:only-child") has a return value. This means that only the &lt;div&gt; element without sibling elements will be selected.
					</td>
				</tr>
				<tr>
					<td class="txt bold">:empty</td>
					<td class="txt">Selects the empty element.
<pre class="code "><code class="prettyprint linenums">
	$$("span:empty");
	// The &lt;span&gt; element without a text node or a subnode.
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">:not</td>
					<td class="txt">Selects the elememt of which the condition is opposite to that of the selector.
<pre class="code "><code class="prettyprint linenums">
	$$("div:not(.img)");
	// The &lt;div&gt; element without an img class.
</code></pre>
					</td>
				</tr>
			</tbody>
		</table>
		<h5>The combinator selector</h5>
		<table class="tbl_board">
			<caption class="hide">The combinator selector</caption>
			<thead>
				<tr>
					<th scope="col" style="width:20%">Pattern</th>
					<th scope="col">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">Space</td>
					<td class="txt">It means all the sub elements.
<pre class="code "><code class="prettyprint linenums">
	$$("body div");
	// All the &lt;div&gt; sub elements of the &lt;body&gt; element
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">&gt;</td>
					<td class="txt">It means all the elements that belong to the child node.
<pre class="code "><code class="prettyprint linenums">
	$$("div &gt; span");
	// All the &lt;span&gt; elements among the child elements of the &lt;div&gt; element
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">+</td>
					<td class="txt">It means all elements that belong to the next sibling element of the specified element.
<pre class="code "><code class="prettyprint linenums">
	$$("div + p");
	// All the &lt;p&gt; elements that belong to the nextSibling of the &lt;div&gt; element.
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">~</td>
					<td class="txt">Identical with the + pattern, but it means all the elements that come after the specified node, as well as the next sibling element.
<pre class="code "><code class="prettyprint linenums">
	$$("div ~ p");
	// All the &lt;p&gt; element that belong to the sibling element that occurs after the &lt;div&gt; element
</code></pre>
					</td>
				</tr>
				<tr>
					<td class="txt bold">!</td>
					<td class="txt">Exclusive for cssquery, it starts searching from the opposite direction of the combinator to search for the element.
<pre class="code "><code class="prettyprint linenums">
	$$("span ! div");
	// All the &lt;div&gt; super elements of the &lt;span&gt; element
</code></pre>
					</td>
				</tr>
			</tbody>
		</table>
	@see jindo.$Document#queryAll
	@see http://www.w3.org/TR/css3-selectors/ CSS Level3 Specification - W3C
	@history 2.4.0 Support mobile버전 JindoJS에서 ! 콤비네이터 지원(!, !>, !~, !+)
	@example
		// Searches IMG tags in a document.
		var imgs = $$('IMG');
		
		// Searches IMG tags under div section.
		var imgsInDiv = $$('IMG', $('div'));
		
		// Searches the first element of IMG tags in a document.
		var firstImg = $$.getSingle('IMG');
 */
jindo.$$ = jindo.cssquery = (function() {
    /*
     Configures querySelector.
     */
    var sVersion = '3.0';
    
    var debugOption = { repeat : 1 };
    
    /*
     Configures a unique key value for quick processing.
     */
    var UID = 1;
    
    var cost = 0;
    var validUID = {};
    
    var bSupportByClassName = document.getElementsByClassName ? true : false;
    var safeHTML = false;
    
    var getUID4HTML = function(oEl) {
        
        var nUID = safeHTML ? (oEl._cssquery_UID && oEl._cssquery_UID[0]) : oEl._cssquery_UID;
        if (nUID && validUID[nUID] == oEl) return nUID;
        
        nUID = UID++;
        oEl._cssquery_UID = safeHTML ? [ nUID ] : nUID;
        
        validUID[nUID] = oEl;
        return nUID;

    };
    function GEBID(oBase,sId,oDoc) {
        if(oBase.nodeType === 9 || oBase.parentNode && oBase.parentNode.tagName) {
            return _getElementById(oDoc,sId);
        } else {
            var aEle = oBase.getElementsByTagName("*");

            for(var i = 0,l = aEle.length; i < l; i++){
                if(aEle[i].id === sId) {
                    return aEle[i];
                }
            }
        }
    }
    var getUID4XML = function(oEl) {
        var oAttr = oEl.getAttribute('_cssquery_UID');
        var nUID = safeHTML ? (oAttr && oAttr[0]) : oAttr;
        
        if (!nUID) {
            nUID = UID++;
            oEl.setAttribute('_cssquery_UID', safeHTML ? [ nUID ] : nUID);
        }
        
        return nUID;
        
    };
    
    var getUID = getUID4HTML;
    
    var uniqid = function(sPrefix) {
        return (sPrefix || '') + new Date().getTime() + parseInt(Math.random() * 100000000,10);
    };
    
    function getElementsByClass(searchClass,node,tag) {
        var classElements = [];

        if(node == null) node = document;
        if(tag == null) tag = '*';

        var els = node.getElementsByTagName(tag);
        var elsLen = els.length;
        var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");

        for(var i=0,j=0; i < elsLen; i++) {
            if(pattern.test(els[i].className)) {
                classElements[j] = els[i];
                j++;
            }
        }
        return classElements;
    }

    var getChilds_dontShrink = function(oEl, sTagName, sClassName) {
        if (bSupportByClassName && sClassName) {
            if(oEl.getElementsByClassName)
                return oEl.getElementsByClassName(sClassName);
            if(oEl.querySelectorAll)
                return oEl.querySelectorAll(sClassName);
            return getElementsByClass(sClassName, oEl, sTagName);
        }else if (sTagName == '*') {
            return oEl.all || oEl.getElementsByTagName(sTagName);
        }
        return oEl.getElementsByTagName(sTagName);
    };

    var clearKeys = function() {
         backupKeys._keys = {};
    };
    
    var oDocument_dontShrink = document;
    
    var bXMLDocument = false;
    
    /*
     Replaces strings that may cause problems while parsing such as double quotes, [], and so on.
     */
    var backupKeys = function(sQuery) {
        
        var oKeys = backupKeys._keys;
        
        /*
         Replaces single quotations.
         */
        sQuery = sQuery.replace(/'(\\'|[^'])*'/g, function(sAll) {
            var uid = uniqid('QUOT');
            oKeys[uid] = sAll;
            return uid;
        });
        
        /*
         Replaces double quotations.
         */
        sQuery = sQuery.replace(/"(\\"|[^"])*"/g, function(sAll) {
            var uid = uniqid('QUOT');
            oKeys[uid] = sAll;
            return uid;
        });
        
        /*
         Replaces [].
         */
        sQuery = sQuery.replace(/\[(.*?)\]/g, function(sAll, sBody) {
            if (sBody.indexOf('ATTR') == 0) return sAll;
            var uid = '[' + uniqid('ATTR') + ']';
            oKeys[uid] = sAll;
            return uid;
        });
    
        /*
        Replaces ().
         */
        var bChanged;
        
        do {
            
            bChanged = false;
        
            sQuery = sQuery.replace(/\(((\\\)|[^)|^(])*)\)/g, function(sAll, sBody) {
                if (sBody.indexOf('BRCE') == 0) return sAll;
                var uid = '_' + uniqid('BRCE');
                oKeys[uid] = sAll;
                bChanged = true;
                return uid;
            });
        
        } while(bChanged);
    
        return sQuery;
        
    };
    
    /*
     Restores the replaced strings.
     */
    var restoreKeys = function(sQuery, bOnlyAttrBrace) {
        
        var oKeys = backupKeys._keys;
    
        var bChanged;
        var rRegex = bOnlyAttrBrace ? /(\[ATTR[0-9]+\])/g : /(QUOT[0-9]+|\[ATTR[0-9]+\])/g;
        
        do {
            
            bChanged = false;
    
            sQuery = sQuery.replace(rRegex, function(sKey) {
                
                if (oKeys[sKey]) {
                    bChanged = true;
                    return oKeys[sKey];
                }
                
                return sKey;
    
            });
        
        } while(bChanged);
        
        /*
        Removes ( ).
         */
        sQuery = sQuery.replace(/_BRCE[0-9]+/g, function(sKey) {
            return oKeys[sKey] ? oKeys[sKey] : sKey;
        });
        
        return sQuery;
        
    };
    
    /*
     Returns all strings except Quot in the replaced strings.
     */
    var restoreString = function(sKey) {
        
        var oKeys = backupKeys._keys;
        var sOrg = oKeys[sKey];
        
        if (!sOrg) return sKey;
        return eval(sOrg);
        
    };
    
    var wrapQuot = function(sStr) {
        return '"' + sStr.replace(/"/g, '\\"') + '"';
    };
    
    var getStyleKey = function(sKey) {

        if (/^@/.test(sKey)) return sKey.substr(1);
        return null;
        
    };
    
    var getCSS = function(oEl, sKey) {
        
        if (oEl.currentStyle) {
            
            if (sKey == "float") sKey = "styleFloat";
            return oEl.currentStyle[sKey] || oEl.style[sKey];
            
        } else if (window.getComputedStyle) {
            
            return oDocument_dontShrink.defaultView.getComputedStyle(oEl, null).getPropertyValue(sKey.replace(/([A-Z])/g,"-$1").toLowerCase()) || oEl.style[sKey];
            
        }

        if (sKey == "float" && jindo._p_._JINDO_IS_IE) sKey = "styleFloat";
        return oEl.style[sKey];
        
    };

    var oCamels = {
        'accesskey' : 'accessKey',
        'cellspacing' : 'cellSpacing',
        'cellpadding' : 'cellPadding',
        'class' : 'className',
        'colspan' : 'colSpan',
        'for' : 'htmlFor',
        'maxlength' : 'maxLength',
        'readonly' : 'readOnly',
        'rowspan' : 'rowSpan',
        'tabindex' : 'tabIndex',
        'valign' : 'vAlign'
    };

    var getDefineCode = function(sKey) {
        var sVal;
        var sStyleKey;

        if (bXMLDocument) {
            
            sVal = 'oEl.getAttribute("' + sKey + '",2)';
        
        } else {
        
            if (sStyleKey = getStyleKey(sKey)) {
                
                sKey = '$$' + sStyleKey;
                sVal = 'getCSS(oEl, "' + sStyleKey + '")';
                
            } else {
                
                switch (sKey) {
                case 'checked':
                    sVal = 'oEl.checked + ""';
                    break;
                    
                case 'disabled':
                    sVal = 'oEl.disabled + ""';
                    break;
                    
                case 'enabled':
                    sVal = '!oEl.disabled + ""';
                    break;
                    
                case 'readonly':
                    sVal = 'oEl.readOnly + ""';
                    break;
                    
                case 'selected':
                    sVal = 'oEl.selected + ""';
                    break;
                    
                default:
                    if (oCamels[sKey]) {
                        sVal = 'oEl.' + oCamels[sKey];
                    } else {
                        sVal = 'oEl.getAttribute("' + sKey + '",2)';
                    } 
                }
                
            }
            
        }
            
        return '_' + sKey.replace(/\-/g,"_") + ' = ' + sVal;
    };
    
    var getReturnCode = function(oExpr) {
        
        var sStyleKey = getStyleKey(oExpr.key);
        
        var sVar = '_' + (sStyleKey ? '$$' + sStyleKey : oExpr.key);
        sVar = sVar.replace(/\-/g,"_");
        var sVal = oExpr.val ? wrapQuot(oExpr.val) : '';
        
        switch (oExpr.op) {
        case '~=':
            return '(' + sVar + ' && (" " + ' + sVar + ' + " ").indexOf(" " + ' + sVal + ' + " ") > -1)';
        case '^=':
            return '(' + sVar + ' && ' + sVar + '.indexOf(' + sVal + ') == 0)';
        case '$=':
            return '(' + sVar + ' && ' + sVar + '.substr(' + sVar + '.length - ' + oExpr.val.length + ') == ' + sVal + ')';
        case '*=':
            return '(' + sVar + ' && ' + sVar + '.indexOf(' + sVal + ') > -1)';
        case '!=':
            return '(' + sVar + ' != ' + sVal + ')';
        case '=':
            return '(' + sVar + ' == ' + sVal + ')';
        }
    
        return '(' + sVar + ')';
        
    };
    
    var getNodeIndex = function(oEl) {
        var nUID = getUID(oEl);
        var nIndex = oNodeIndexes[nUID] || 0;
        
        /*
         If node indexes are not obtained
         */
        if (nIndex == 0) {

            for (var oSib = (oEl.parentNode || oEl._IE5_parentNode).firstChild; oSib; oSib = oSib.nextSibling) {
                
                if (oSib.nodeType != 1){ 
                    continue;
                }
                nIndex++;

                setNodeIndex(oSib, nIndex);
                
            }
                        
            nIndex = oNodeIndexes[nUID];
            
        }
                
        return nIndex;
                
    };
    
    /*
     The below describes how to configure the child node.
     */
    var oNodeIndexes = {};

    var setNodeIndex = function(oEl, nIndex) {
        var nUID = getUID(oEl);
        oNodeIndexes[nUID] = nIndex;
    };
    
    var unsetNodeIndexes = function() {
        setTimeout(function() { oNodeIndexes = {}; }, 0);
    };
    
    /*
     A virtual class
     */
    var oPseudoes_dontShrink = {
    
        'contains' : function(oEl, sOption) {
            return (oEl.innerText || oEl.textContent || '').indexOf(sOption) > -1;
        },
        
        'last-child' : function(oEl, sOption) {
            for (oEl = oEl.nextSibling; oEl; oEl = oEl.nextSibling){
                if (oEl.nodeType == 1)
                    return false;
            }
                
            
            return true;
        },
        
        'first-child' : function(oEl, sOption) {
            for (oEl = oEl.previousSibling; oEl; oEl = oEl.previousSibling){
                if (oEl.nodeType == 1)
                    return false;
            }
                
                    
            return true;
        },
        
        'only-child' : function(oEl, sOption) {
            var nChild = 0;
            
            for (var oChild = (oEl.parentNode || oEl._IE5_parentNode).firstChild; oChild; oChild = oChild.nextSibling) {
                if (oChild.nodeType == 1) nChild++;
                if (nChild > 1) return false;
            }
            
            return nChild ? true : false;
        },

        'empty' : function(oEl, _) {
            return oEl.firstChild ? false : true;
        },
        
        'nth-child' : function(oEl, nMul, nAdd) {
            var nIndex = getNodeIndex(oEl);
            return nIndex % nMul == nAdd;
        },
        
        'nth-last-child' : function(oEl, nMul, nAdd) {
            var oLast = (oEl.parentNode || oEl._IE5_parentNode).lastChild;
            for (; oLast; oLast = oLast.previousSibling){
                if (oLast.nodeType == 1) break;
            }
                
                
            var nTotal = getNodeIndex(oLast);
            var nIndex = getNodeIndex(oEl);
            
            var nLastIndex = nTotal - nIndex + 1;
            return nLastIndex % nMul == nAdd;
        },
        'checked' : function(oEl){
            return !!oEl.checked;
        },
        'selected' : function(oEl){
            return !!oEl.selected;
        },
        'enabled' : function(oEl){
            return !oEl.disabled;
        },
        'disabled' : function(oEl){
            return !!oEl.disabled;
        }
    };
    
    /*
     Gets an expression from the body of a single part.
     */
    var getExpression = function(sBody) {

        var oRet = { defines : '', returns : 'true' };
        
        var sBody = restoreKeys(sBody, true);
    
        var aExprs = [];
        var aDefineCode = [], aReturnCode = [];
        var sId, sTagName;
        
        /*
         Gets the conditions of pseudo classes.
         */
        var sBody = sBody.replace(/:([\w-]+)(\(([^)]*)\))?/g, function(_1, sType, _2, sOption) {
            switch (sType) {
                case 'not':
                    /*
                     Parses the value in parentheses recursively.
                     */
                    var oInner = getExpression(sOption);

                    var sFuncDefines = oInner.defines;
                    var sFuncReturns = oInner.returnsID + oInner.returnsTAG + oInner.returns;

                    aReturnCode.push('!(function() { ' + sFuncDefines + ' return ' + sFuncReturns + ' })()');
                    break;

                case 'nth-child':
                case 'nth-last-child':
                    sOption =  restoreString(sOption);

                    if (sOption == 'even'){
                        sOption = '2n';
                    }else if (sOption == 'odd') {
                        sOption = '2n+1';
                    }

                    var nMul, nAdd;
                    var matchstr = sOption.match(/([0-9]*)n([+-][0-9]+)*/);
                    if (matchstr) {
                        nMul = matchstr[1] || 1;
                        nAdd = matchstr[2] || 0;
                    } else {
                        nMul = Infinity;
                        nAdd = parseInt(sOption,10);
                    }
                    aReturnCode.push('oPseudoes_dontShrink[' + wrapQuot(sType) + '](oEl, ' + nMul + ', ' + nAdd + ')');
                    break;

                case 'first-of-type':
                case 'last-of-type':
                    sType = (sType == 'first-of-type' ? 'nth-of-type' : 'nth-last-of-type');
                    sOption = 1;
                    // 'break' statement was intentionally omitted.
                case 'nth-of-type':
                case 'nth-last-of-type':
                    sOption =  restoreString(sOption);

                    if (sOption == 'even') {
                        sOption = '2n';
                    }else if (sOption == 'odd'){
                        sOption = '2n+1';
                    }

                    var nMul, nAdd;

                    if (/([0-9]*)n([+-][0-9]+)*/.test(sOption)) {
                        nMul = parseInt(RegExp.$1,10) || 1;
                        nAdd = parseInt(RegExp.$2,20) || 0;
                    } else {
                        nMul = Infinity;
                        nAdd = parseInt(sOption,10);
                    }

                    oRet.nth = [ nMul, nAdd, sType ];
                    break;

                default:
                    sOption = sOption ? restoreString(sOption) : '';
                    aReturnCode.push('oPseudoes_dontShrink[' + wrapQuot(sType) + '](oEl, ' + wrapQuot(sOption) + ')');
            }
            
            return '';
        });
        
        /*
         Gets [key=value] pattern.
         */
        var sBody = sBody.replace(/\[(@?[\w-]+)(([!^~$*]?=)([^\]]*))?\]/g, function(_1, sKey, _2, sOp, sVal) {
            sKey = restoreString(sKey);
            sVal = restoreString(sVal);
            
            if (sKey == 'checked' || sKey == 'disabled' || sKey == 'enabled' || sKey == 'readonly' || sKey == 'selected') {
                
                if (!sVal) {
                    sOp = '=';
                    sVal = 'true';
                }
                
            }
            aExprs.push({ key : sKey, op : sOp, val : sVal });
            return '';
    
        });
        
        var sClassName = null;
    
        /*
         Gets class conditions.
         */
        var sBody = sBody.replace(/\.([\w-]+)/g, function(_, sClass) { 
            aExprs.push({ key : 'class', op : '~=', val : sClass });
            if (!sClassName) sClassName = sClass;
            return '';
        });
        
        /*
         Gets id conditions.
         */
        var sBody = sBody.replace(/#([\w-]+)/g, function(_, sIdValue) {
            if (bXMLDocument) {
                aExprs.push({ key : 'id', op : '=', val : sIdValue });
            }else{
                sId = sIdValue;
            }
            return '';
        });
        
        sTagName = sBody == '*' ? '' : sBody;
    
        /*
         Creates the code of a match function.
         */
        var oVars = {};
        
        for (var i = 0, oExpr; oExpr = aExprs[i]; i++) {
            
            var sKey = oExpr.key;
            
            if (!oVars[sKey]) aDefineCode.push(getDefineCode(sKey));
            /*
             Uses unshift so that the pseudo-class condition check can move to the end.
             */
            aReturnCode.unshift(getReturnCode(oExpr));
            oVars[sKey] = true;
            
        }
        
        if (aDefineCode.length) oRet.defines = 'var ' + aDefineCode.join(',') + ';';
        if (aReturnCode.length) oRet.returns = aReturnCode.join('&&');
        
        oRet.quotID = sId ? wrapQuot(sId) : '';
        oRet.quotTAG = sTagName ? wrapQuot(bXMLDocument ? sTagName : sTagName.toUpperCase()) : '';
        
        if (bSupportByClassName) oRet.quotCLASS = sClassName ? wrapQuot(sClassName) : '';
        
        oRet.returnsID = sId ? 'oEl.id == ' + oRet.quotID + ' && ' : '';
        oRet.returnsTAG = sTagName && sTagName != '*' ? 'oEl.tagName == ' + oRet.quotTAG + ' && ' : '';
        
        return oRet;
        
    };
    
    /*
     Truncates queries by operator.
     */
    var splitToParts = function(sQuery) {
        
        var aParts = [];
        var sRel = ' ';
        
        var sBody = sQuery.replace(/(.*?)\s*(!?[+>~ ]|!)\s*/g, function(_, sBody, sRelative) {
            
            if (sBody) aParts.push({ rel : sRel, body : sBody });
    
            sRel = sRelative.replace(/\s+$/g, '') || ' ';
            return '';
            
        });
    
        if (sBody) aParts.push({ rel : sRel, body : sBody });
        
        return aParts;
        
    };
    
    var isNth_dontShrink = function(oEl, sTagName, nMul, nAdd, sDirection) {
        
        var nIndex = 0;
        for (var oSib = oEl; oSib; oSib = oSib[sDirection]){
            if (oSib.nodeType == 1 && (!sTagName || sTagName == oSib.tagName))
                    nIndex++;
        }
            

        return nIndex % nMul == nAdd;

    };
    
    /*
     Compiles the truncated part by function.
     */
    var compileParts = function(aParts) {
        var aPartExprs = [];
        /*
         Creates conditions for the truncates part.
         */
        for (var i=0,oPart; oPart = aParts[i]; i++)
            aPartExprs.push(getExpression(oPart.body));
        
        //////////////////// BEGIN
        
        var sFunc = '';
        var sPushCode = 'aRet.push(oEl); if (oOptions.single) { bStop = true; }';

        for(var i=aParts.length-1, oPart; oPart = aParts[i]; i--) {
            
            var oExpr = aPartExprs[i];
            var sPush = (debugOption.callback ? 'cost++;' : '') + oExpr.defines;
            

            var sReturn = 'if (bStop) {' + (i == 0 ? 'return aRet;' : 'return;') + '}';
            
            if (oExpr.returns == 'true') {
                sPush += (sFunc ? sFunc + '(oEl);' : sPushCode) + sReturn;
            }else{
                sPush += 'if (' + oExpr.returns + ') {' + (sFunc ? sFunc + '(oEl);' : sPushCode ) + sReturn + '}';
            }
            
            var sCheckTag = 'oEl.nodeType != 1';
            if (oExpr.quotTAG) sCheckTag = 'oEl.tagName != ' + oExpr.quotTAG;
            
            var sTmpFunc =
                '(function(oBase' +
                    (i == 0 ? ', oOptions) { var bStop = false; var aRet = [];' : ') {');

            if (oExpr.nth) {
                sPush =
                    'if (isNth_dontShrink(oEl, ' +
                    (oExpr.quotTAG ? oExpr.quotTAG : 'false') + ',' +
                    oExpr.nth[0] + ',' +
                    oExpr.nth[1] + ',' +
                    '"' + (oExpr.nth[2] == 'nth-of-type' ? 'previousSibling' : 'nextSibling') + '")) {' + sPush + '}';
            }
            
            switch (oPart.rel) {
            case ' ':
                if (oExpr.quotID) {
                    
                    sTmpFunc +=
                        // 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
                        'var oEl = GEBID(oBase,' + oExpr.quotID + ',oDocument_dontShrink);' +
                        'var oCandi = oEl;' +
                        'for (; oCandi; oCandi = (oCandi.parentNode || oCandi._IE5_parentNode)) {' +
                            'if (oCandi == oBase) break;' +
                        '}' +
                        'if (!oCandi || ' + sCheckTag + ') return aRet;' +
                        sPush;
                    
                } else {
                    
                    sTmpFunc +=
                        'var aCandi = getChilds_dontShrink(oBase, ' + (oExpr.quotTAG || '"*"') + ', ' + (oExpr.quotCLASS || 'null') + ');' +
                        'for (var i = 0, oEl; oEl = aCandi[i]; i++) {' +
                            (oExpr.quotCLASS ? 'if (' + sCheckTag + ') continue;' : '') +
                            sPush +
                        '}';
                    
                }
            
                break;
                
            case '>':
                if (oExpr.quotID) {
    
                    sTmpFunc +=
                        // 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
                        'var oEl = GEBID(oBase,' + oExpr.quotID + ',oDocument_dontShrink);' +
                        'if ((oEl.parentNode || oEl._IE5_parentNode) != oBase || ' + sCheckTag + ') return aRet;' +
                        sPush;
                    
                } else {
    
                    sTmpFunc +=
                        'for (var oEl = oBase.firstChild; oEl; oEl = oEl.nextSibling) {' +
                            'if (' + sCheckTag + ') { continue; }' +
                            sPush +
                        '}';
                    
                }
                
                break;
                
            case '+':
                if (oExpr.quotID) {
    
                    sTmpFunc +=
                        // 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
                        'var oEl = GEBID(oBase,' + oExpr.quotID + ',oDocument_dontShrink);' +
                        'var oPrev;' +
                        'for (oPrev = oEl.previousSibling; oPrev; oPrev = oPrev.previousSibling) { if (oPrev.nodeType == 1) break; }' +
                        'if (!oPrev || oPrev != oBase || ' + sCheckTag + ') return aRet;' +
                        sPush;
                    
                } else {
    
                    sTmpFunc +=
                        'for (var oEl = oBase.nextSibling; oEl; oEl = oEl.nextSibling) { if (oEl.nodeType == 1) break; }' +
                        'if (!oEl || ' + sCheckTag + ') { return aRet; }' +
                        sPush;
                    
                }
                
                break;
            
            case '~':
    
                if (oExpr.quotID) {
    
                    sTmpFunc +=
                        // 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
                        'var oEl = GEBID(oBase,' + oExpr.quotID + ',oDocument_dontShrink);' +
                        'var oCandi = oEl;' +
                        'for (; oCandi; oCandi = oCandi.previousSibling) { if (oCandi == oBase) break; }' +
                        'if (!oCandi || ' + sCheckTag + ') return aRet;' +
                        sPush;
                    
                } else {
    
                    sTmpFunc +=
                        'for (var oEl = oBase.nextSibling; oEl; oEl = oEl.nextSibling) {' +
                            'if (' + sCheckTag + ') { continue; }' +
                            'if (!markElement_dontShrink(oEl, ' + i + ')) { break; }' +
                            sPush +
                        '}';
    
                }
                
                break;
                
            case '!' :
            
                if (oExpr.quotID) {
                    
                    sTmpFunc +=
                        // 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
                        'var oEl = GEBID(oBase,' + oExpr.quotID + ',oDocument_dontShrink);' +
                        'for (; oBase; oBase = (oBase.parentNode || oBase._IE5_parentNode)) { if (oBase == oEl) break; }' +
                        'if (!oBase || ' + sCheckTag + ') return aRet;' +
                        sPush;
                        
                } else {
                    
                    sTmpFunc +=
                        'for (var oEl = (oBase.parentNode || oBase._IE5_parentNode); oEl; oEl = oEl && (oEl.parentNode || oEl._IE5_parentNode)) {'+
                            'if (' + sCheckTag + ') { continue; }' +
                            sPush +
                        '}';
                    
                }
                
                break;
    
            case '!>' :
            
                if (oExpr.quotID) {
    
                    sTmpFunc +=
                        // 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
                        'var oEl = GEBID(oBase,' + oExpr.quotID + ',oDocument_dontShrink);' +
                        'var oRel = (oBase.parentNode || oBase._IE5_parentNode);' +
                        'if (!oRel || oEl != oRel || (' + sCheckTag + ')) return aRet;' +
                        sPush;
                    
                } else {
    
                    sTmpFunc +=
                        'var oEl = (oBase.parentNode || oBase._IE5_parentNode);' +
                        'if (!oEl || ' + sCheckTag + ') { return aRet; }' +
                        sPush;
                    
                }
                
                break;
                
            case '!+' :
                
                if (oExpr.quotID) {
    
                    sTmpFunc +=
                        // 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
                        'var oEl = GEBID(oBase,' + oExpr.quotID + ',oDocument_dontShrink);' +
                        'var oRel;' +
                        'for (oRel = oBase.previousSibling; oRel; oRel = oRel.previousSibling) { if (oRel.nodeType == 1) break; }' +
                        'if (!oRel || oEl != oRel || (' + sCheckTag + ')) return aRet;' +
                        sPush;
                    
                } else {
    
                    sTmpFunc +=
                        'for (oEl = oBase.previousSibling; oEl; oEl = oEl.previousSibling) { if (oEl.nodeType == 1) break; }' +
                        'if (!oEl || ' + sCheckTag + ') { return aRet; }' +
                        sPush;
                    
                }
                
                break;
    
            case '!~' :
                
                if (oExpr.quotID) {
                    
                    sTmpFunc +=
                        // 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
                        'var oEl = GEBID(oBase,' + oExpr.quotID + ',oDocument_dontShrink);' +
                        'var oRel;' +
                        'for (oRel = oBase.previousSibling; oRel; oRel = oRel.previousSibling) { ' +
                            'if (oRel.nodeType != 1) { continue; }' +
                            'if (oRel == oEl) { break; }' +
                        '}' +
                        'if (!oRel || (' + sCheckTag + ')) return aRet;' +
                        sPush;
                    
                } else {
    
                    sTmpFunc +=
                        'for (oEl = oBase.previousSibling; oEl; oEl = oEl.previousSibling) {' +
                            'if (' + sCheckTag + ') { continue; }' +
                            'if (!markElement_dontShrink(oEl, ' + i + ')) { break; }' +
                            sPush +
                        '}';
                    
                }
                
            }
    
            sTmpFunc +=
                (i == 0 ? 'return aRet;' : '') +
            '})';
            
            sFunc = sTmpFunc;
            
        }

        var fpCompiled;
        eval('fpCompiled=' + sFunc + ';');
        return fpCompiled;
        
    };
    
    /*
     Converts queries to a match function.
     */
    var parseQuery = function(sQuery) {
        var sCacheKey = sQuery;
        
        var fpSelf = arguments.callee;
        var fpFunction = fpSelf._cache[sCacheKey];
        
        if (!fpFunction) {
            
            sQuery = backupKeys(sQuery);
            
            var aParts = splitToParts(sQuery);
            
            fpFunction = fpSelf._cache[sCacheKey] = compileParts(aParts);
            fpFunction.depth = aParts.length;
            
        }
        
        return fpFunction;
        
    };
    
    parseQuery._cache = {};
    
    /*
     Converts test queries to a match function.
     */
    var parseTestQuery = function(sQuery) {
        
        var fpSelf = arguments.callee;
        
        var aSplitQuery = backupKeys(sQuery).split(/\s*,\s*/);
        var aResult = [];
        
        var nLen = aSplitQuery.length;
        var aFunc = [];
        
        for (var i = 0; i < nLen; i++) {

            aFunc.push((function(sQuery) {
                
                var sCacheKey = sQuery;
                var fpFunction = fpSelf._cache[sCacheKey];
                
                if (!fpFunction) {
                    
                    sQuery = backupKeys(sQuery);
                    var oExpr = getExpression(sQuery);
                    
                    eval('fpFunction = function(oEl) { ' + oExpr.defines + 'return (' + oExpr.returnsID + oExpr.returnsTAG + oExpr.returns + '); };');
                    
                }
                
                return fpFunction;
                
            })(restoreKeys(aSplitQuery[i])));
            
        }
        return aFunc;
        
    };
    
    parseTestQuery._cache = {};
    
    var distinct = function(aList) {
    
        var aDistinct = [];
        var oDummy = {};
        
        for (var i = 0, oEl; oEl = aList[i]; i++) {
            
            var nUID = getUID(oEl);
            if (oDummy[nUID]) continue;
            
            aDistinct.push(oEl);
            oDummy[nUID] = true;
        }
    
        return aDistinct;
    
    };
    
    var markElement_dontShrink = function(oEl, nDepth) {
        
        var nUID = getUID(oEl);
        if (cssquery._marked[nDepth][nUID]) return false;
        
        cssquery._marked[nDepth][nUID] = true;
        return true;

    };
    
    var getParentElement = function(oParent){
        if(!oParent) {
            return document;
        }
        
        var nParentNodeType;
        
        oParent = oParent.$value ? oParent.$value() : oParent;
        
        //-@@cssquery-@@//
        if(jindo.$Jindo.isString(oParent)){
            try{
                oParent = document.getElementById(oParent);
            }catch(e){
                oParent = document;
            }
        }
        
        nParentNodeType = oParent.nodeType;
        
        if(nParentNodeType != 1 && nParentNodeType != 9 && nParentNodeType != 10 && nParentNodeType != 11){
            oParent = oParent.ownerDocument || oParent.document;
        }
        
        return oParent || oParent.ownerDocument || oParent.document;
    };
    
    var oResultCache = null;
    var bUseResultCache = false;
    var bExtremeMode = false;
        
    var old_cssquery = function(sQuery, oParent, oOptions) {
        var oArgs = jindo._checkVarType(arguments, {
            '4str'   : [ 'sQuery:String+'],
            '4var'  : [ 'sQuery:String+', 'oParent:Variant' ],
            '4var2' : [ 'sQuery:String+', 'oParent:Variant', 'oOptions:Variant' ]
        },"cssquery");
        
        oParent = getParentElement(oParent);
        oOptions = oOptions && oOptions.$value ? oOptions.$value() : oOptions;
        
        if (typeof sQuery == 'object') {
            
            var oResult = {};
            
            for (var k in sQuery){
                if(sQuery.hasOwnProperty(k))
                    oResult[k] = arguments.callee(sQuery[k], oParent, oOptions);
            }
            
            return oResult;
        }
        
        cost = 0;
        
        var executeTime = new Date().getTime();
        var aRet;
        
        for (var r = 0, rp = debugOption.repeat; r < rp; r++) {
            
            aRet = (function(sQuery, oParent, oOptions) {
                
                if(oOptions){
                    if(!oOptions.oneTimeOffCache){
                        oOptions.oneTimeOffCache = false;
                    }
                }else{
                    oOptions = {oneTimeOffCache:false};
                }
                cssquery.safeHTML(oOptions.oneTimeOffCache);
                
                if (!oParent) oParent = document;
                    
                /*
                 Finds ownerDocument.
                 */
                oDocument_dontShrink = oParent.ownerDocument || oParent.document || oParent;
                
                /*
                 Internet Explorer 5.5 or earlier
                 */
                if (/\bMSIE\s([0-9]+(\.[0-9]+)*);/.test(jindo._p_._j_ag) && parseFloat(RegExp.$1) < 6) {
                    try { oDocument_dontShrink.location; } catch(e) { oDocument_dontShrink = document; }
                    
                    oDocument_dontShrink.firstChild = oDocument_dontShrink.getElementsByTagName('html')[0];
                    oDocument_dontShrink.firstChild._IE5_parentNode = oDocument_dontShrink;
                }
                
                /*
                 Checks whether it is XMLDocument.
                 */
                bXMLDocument = (typeof XMLDocument !== 'undefined') ? (oDocument_dontShrink.constructor === XMLDocument) : (!oDocument_dontShrink.location);
                getUID = bXMLDocument ? getUID4XML : getUID4HTML;
        
                clearKeys();
                /*
                 Separates queries by a comma.
                 */
                var aSplitQuery = backupKeys(sQuery).split(/\s*,\s*/);
                var aResult = [];
                
                var nLen = aSplitQuery.length;
                
                for (var i = 0; i < nLen; i++)
                    aSplitQuery[i] = restoreKeys(aSplitQuery[i]);
                
                /*
                 Separates query loop by a comma.
                 */
                for (var i = 0; i < nLen; i++) {
                    
                    var sSingleQuery = aSplitQuery[i];
                    var aSingleQueryResult = null;
                    
                    var sResultCacheKey = sSingleQuery + (oOptions.single ? '_single' : '');
        
                    /*
                     Searches a result cache.
                     */
                    var aCache = bUseResultCache ? oResultCache[sResultCacheKey] : null;
                    if (aCache) {
                        
                        /*
                         Checks whether the parents of cached items are the same, and if so, substitutes them for aSingleQueryResult.
                         */
                        for (var j = 0, oCache; oCache = aCache[j]; j++) {
                            if (oCache.parent == oParent) {
                                aSingleQueryResult = oCache.result;
                                break;
                            }
                        }
                        
                    }
                    
                    if (!aSingleQueryResult) {
                        
                        var fpFunction = parseQuery(sSingleQuery);
                        
                        cssquery._marked = [];
                        for (var j = 0, nDepth = fpFunction.depth; j < nDepth; j++)
                            cssquery._marked.push({});
                        
                        aSingleQueryResult = distinct(fpFunction(oParent, oOptions));
                        
                        /*
                         Stores in cache if a result cache is being used.
                         */
                        if (bUseResultCache&&!oOptions.oneTimeOffCache) {
                            if (!(oResultCache[sResultCacheKey] instanceof Array)) oResultCache[sResultCacheKey] = [];
                            oResultCache[sResultCacheKey].push({ parent : oParent, result : aSingleQueryResult });
                        }
                        
                    }
                    
                    aResult = aResult.concat(aSingleQueryResult);
                    
                }
                unsetNodeIndexes();
        
                return aResult;
                
            })(sQuery, oParent, oOptions);
            
        }
        
        executeTime = new Date().getTime() - executeTime;

        if (debugOption.callback) debugOption.callback(sQuery, cost, executeTime);
        
        return aRet;
        
    };
    var cssquery;
    if (document.querySelectorAll) {
        function _isNonStandardQueryButNotException(sQuery){
            return /\[\s*(?:checked|selected|disabled)/.test(sQuery);
        }
        function _commaRevise (sQuery,sChange) {
            return sQuery.replace(/\,/gi,sChange);
        }
        function _startCombinator (sQuery) {
            return /^[~>+]/.test(sQuery);
        }
        function _addQueryId(el, sIdName){
            var sQueryId, sValue;
        
            if(/^\w+$/.test(el.id)){
                sQueryId = "#" + el.id;
            }else{
                sValue = "C" + new Date().getTime() + Math.floor(Math.random() * 1000000);
                el.setAttribute(sIdName, sValue);
                sQueryId = "[" + sIdName + "=" + sValue + "]";
            }
            
            return sQueryId;
        }
        function _getSelectorMethod(sQuery, bDocument) {
            var oRet = { method : null, query : null };

            if(/^\s*[a-z]+\s*$/i.test(sQuery)) {
                oRet.method = "getElementsByTagName";
            } else if(/^\s*([#\.])([\w\-]+)\s*$/i.test(sQuery)) {
                oRet.method = RegExp.$1 == "#" ? "getElementById" : "getElementsByClassName";
                oRet.query = RegExp.$2;
            }
            
            if(!document[oRet.method] || RegExp.$1 == "#" && !bDocument) {
                oRet.method = oRet.query = null;
            }

            return oRet;
        }
        
        var _div = document.createElement("div");

        /**
          @lends $$
         */
        cssquery = function(sQuery, oParent, oOptions){
            var oArgs = jindo._checkVarType(arguments, {
                '4str'   : [ 'sQuery:String+'],
                '4var'  : [ 'sQuery:String+', 'oParent:Variant' ],
                '4var2' : [ 'sQuery:String+', 'oParent:Variant', 'oOptions:Variant' ]
            },"cssquery"),
            sTempId, aRet, nParentNodeType, bUseQueryId, oOldParent, queryid, _clone, sTagName, _parent, vSelectorMethod, sQueryAttrName = "queryid";
            
            oParent = getParentElement(oParent);
            oOptions = oOptions && oOptions.$value ? oOptions.$value() : oOptions;
            
            /*
            {{cssquery_desc_5}}
            */
            var re = /\[(.*?)=([\w\d]*)\]/g;

            if(re.test(sQuery)) {
                sQuery = sQuery.replace(re, "[$1='$2']");
            }
            
            nParentNodeType = oParent.nodeType;
            
            try{
                if(_isNonStandardQueryButNotException(sQuery)){
                    return old_cssquery(sQuery, oParent, oOptions);
                }
                sTagName = (oParent.tagName||"").toUpperCase();
                
                vSelectorMethod = _getSelectorMethod(sQuery, nParentNodeType == 9);

                if(vSelectorMethod.query) {
                    sQuery = vSelectorMethod.query;
                }
                
                vSelectorMethod = vSelectorMethod.method;

                if(nParentNodeType!==9&&sTagName!="HTML"){
                    if(nParentNodeType === 11){
                        /*
                        	documentFragment일 때 는 복사해서 찾음.
                        */
                        oParent = oParent.cloneNode(true);
                        _clone = _div.cloneNode(true);
                        _clone.appendChild(oParent);
                        oParent = _clone;
                        _clone = null;
                    }
                    
                    if(!vSelectorMethod) {                      
                        bUseQueryId = true;
                        queryid = _addQueryId(oParent, sQueryAttrName);
                        sQuery = _commaRevise(queryid+" "+ sQuery,", "+queryid+" ");
                    }

                    if((_parent = oParent.parentNode) || sTagName === "BODY" || jindo.$Element._contain((oParent.ownerDocument || oParent.document).body,oParent)) {
                        /*
                        	돔이 붙은 경우는 상위 엘리먼트를 기준으로
                        */
                        if(!vSelectorMethod) {
                            oOldParent = oParent;
                            oParent = _parent;
                        }
                        
                    } else if(!vSelectorMethod) {
                        /*
                        	돔이 떨어진 경우에는 상위 엘리먼트를 만들어서 탐색.
                        */
                        _clone = _div.cloneNode(true);
                        // id = oParent.id;
                        oOldParent = oParent;
                        _clone.appendChild(oOldParent);
                        oParent = _clone;
                    }

                } else {
                    oParent = (oParent.ownerDocument || oParent.document||oParent);
                    if(_startCombinator(sQuery)) return [];
                }

                if(oOptions&&oOptions.single) {
                    if(vSelectorMethod) {
                        aRet = oParent[vSelectorMethod](sQuery);
                        aRet = [ vSelectorMethod == "getElementById" ? aRet : aRet[0] ];
                    } else {
                        aRet = [ oParent.querySelector(sQuery) ];
                    }

                } else {
                    if(vSelectorMethod) {
                        aRet = oParent[vSelectorMethod](sQuery);

                        if(vSelectorMethod == "getElementById") {
                            aRet = aRet ? [aRet] : [];
                        }
                    } else {
                        aRet = oParent.querySelectorAll(sQuery);    
                    }
                    
                    aRet = jindo._p_._toArray(aRet);
                }
                
            } catch(e) {
                aRet =  old_cssquery(sQuery, oParent, oOptions);
            }

            if(bUseQueryId){
                oOldParent.removeAttribute(sQueryAttrName);
                _clone = null;
            }
            return aRet;
        };
    }else{
        cssquery = old_cssquery;
    }
    /**
     	The test() method determines whether a specific element complies to the CSS selector and returns it as a Boolean value.
	
	@method $$.test
	@static
	@param {Element+} element Elements to be examined
	@param {String+} sCSSSelector CSS selector. There are two patterns that can be used as a CSS selector: standard and non-standard. The standard pattern supports the patterns in the CSS Level3 specification.
	@return {Boolean} Returns true if the condition is met, false, if not.
	@remark 
		<ul class="disc">
			<li>Please note that connectors cannot be used with CSS selector.</li>
			<li>For the description on the pattern of the selector, see the $$() function and the See Also section.</li>
		</ul>
	@see jindo.$$
	@see http://www.w3.org/TR/css3-selectors/ CSS Level3 Specification - W3C
	@example
		// Checks whether oEl is an element in which the div tag, p tag, or align attribute is specified as center.
		if (cssquery.test(oEl, 'div, p, [align=center]'))
		alert('satisfies the condition');
     */
    cssquery.test = function(oEl, sQuery) {
        clearKeys();
        try{
            var oArgs = jindo._checkVarType(arguments, {
                '4ele' : [ 'oEl:Element+', 'sQuery:String+' ],
                '4doc' : [ 'oEl:Document+', 'sQuery:String+' ]
            },"<static> cssquery#test");
            oEl = oArgs.oEl;
            sQuery = oArgs.sQuery;
        }catch(e){
            return false;
        }

        var aFunc = parseTestQuery(sQuery);

        for (var i = 0, nLen = aFunc.length; i < nLen; i++){
            if (aFunc[i](oEl)) return true;
        }

        return false;
    };

    /**
     	The useCache() method determines whether cache is used when using the $$() function (cssquery). If an identical selector is used to search when using cache, no search is made and the existing search result is returned. Therefore, the user can easily and quickly use it regardless of the variable cache. However, it should be used only when the DOM structure does not dynamically change for reliability concerns.
	
	@method $$.useCache
	@static
	@param {Boolean} [bFlag] Specifies whether cache is used. If it is omitted, returns the cache usage state only.
	@return {Boolean} Returns the cache usage state.
	@see jindo.$$.clearCache
     */
    cssquery.useCache = function(bFlag) {
    
        if (bFlag !== undefined) {
            bUseResultCache = bFlag;
            cssquery.clearCache();
        }
        
        return bUseResultCache;
        
    };
    
    /**
     	The clearCache() method empties caches when using caches in the $$() function. It can be used when no credibility is guaranteed for the existing cache data because the DOM structure dynamically changes.
	
	@method $$.clearCache
	@static
	@see jindo.$$.useCache
     */
    cssquery.clearCache = function() {
        oResultCache = {};
    };
    
    /**
     	The getSingle() method retrieves the first element that satisfies the condition by using CSS selector. The return value is not an array but an object or null. When an element that satisfies the condition is found, the search stops immediately. Therefore, the result can be quickly achieved if it is certain that only one result exists.
	
	@method $$.getSingle
	@static
	@syntax sSelector, oBaseElement, oOption
	@syntax sSelector, sBaseElement, oOption
	@param {String+} sSelector CSS selector. There are two patterns that can be used as a CSS selector: standard and non-standard. The standard pattern supports the patterns in the CSS3 Level3 specification. For the description on the pattern of the selector, see the $$() function and the See Also section.
	@param {Element+} [oBaseElement] The DOM element to search for. Searches for the object from the subnodes of the specified element. If it is omitted, searches from the documents.
	@param {Hash+} [oOption] If the oneTimeOffCache attribute of the option object is set to true, cache is not used when searching.
	@param {String+} [sBaseElement] The ID of the DOM element to search for. Searches for the object from the subnodes of the specified element. If it is omitted, searches from the documents. It can contain id.
	@return {Element | Boolean} Returns null if no result is found.
	@see jindo.$Document#query	 
	@see jindo.$$.useCache
	@see jindo.$$
	@see http://www.w3.org/TR/css3-selectors/ CSS Level3 Specification - W3C
     */
    cssquery.getSingle = function(sQuery, oParent, oOptions) {

        oOptions = oOptions && oOptions.$value ? oOptions.$value() : oOptions; 

        return cssquery(sQuery, oParent, {
            single : true ,
            oneTimeOffCache:oOptions?(!!oOptions.oneTimeOffCache):false
        })[0] || null;
    };
    
    
    /**
     	The xpath() method retrieves the element that satisfies the XPath syntax. It is recommended to use it only for specific cases because it supports limited syntax.
	
	@method $$.xpath
	@static
	@param {String+} sXPath The XPath value
	@param {Element} [elBaseElement] The DOM element to search for. Searches for the object from the subnodes of the specified element. 
	@return {Array | Boolean} XPath The array which has the elements that satisfy the XPath syntax. Returns null if no result is found.
	@filter desktop
	@see jindo.$Document#xpathAll
	@see http://www.w3.org/standards/techs/xpath#w3c_all XPath Document - W3C
     */
    cssquery.xpath = function(sXPath, oParent) {
        sXPath = sXPath && sXPath.$value ? sXPath.$value() : sXPath; 
        
        sXPath = sXPath.replace(/\/(\w+)(\[([0-9]+)\])?/g, function(_1, sTag, _2, sTh) {
            sTh = sTh || '1';
            return '>' + sTag + ':nth-of-type(' + sTh + ')';
        });
        
        return old_cssquery(sXPath, oParent);
    };
    
    /**
     	The debug() method provides functionalities of measuring the performance of the $$() function (cssquery). Measures the performance by using the callback function entered as a parameter.
	
	@method $$.debug
	@static
	@param {Function} fCallback A function that checks the cost and time taken to executing the selector. If false is entered, instead of function, to the parameter, performance measurement mode (debug) is not used.
	@param {Numeric} [nRepeat] The number of times to execute a single selector. It can be used to purposefully slow down the execution speed.
	@filter desktop
	@remark The fCallback callback function has query, cost, and executeTime as its parameters.<br>
		<ul class="disc">
			<li>query is the selector used for execution.</li>
			<li>index is the cost used for search (the number of loops).</li>
			<li>executeTime is the time spent searching.</li>
		</ul>
	@example
		cssquery.debug(function(sQuery, nCost, nExecuteTime) {
			if (nCost > 5000)
				console.warn('the cost is over 5000?! let's check -> ' + sQuery + '/' + nCost);
			else if (nExecuteTime > 200)
				console.warn('taking more than 0.2 seconds?! let's check -> ' + sQuery + '/' + nExecuteTime);
		}, 20);
		
		....
		
		cssquery.debug(false);
     */
    cssquery.debug = function(fpCallback, nRepeat) {
        
        var oArgs = jindo._checkVarType(arguments, {
            '4fun'   : [ 'fpCallback:Function+'],
            '4fun2'  : [ 'fpCallback:Function+', 'nRepeat:Numeric' ]
        },"<static> cssquery#debug");

        debugOption.callback = oArgs.fpCallback;
        debugOption.repeat = oArgs.nRepeat || 1;
        
    };
    
    /**
     	The safeHTML() method prevents the _cssquery_UID value from being displayed when the innerHTML attribute is used by the Internet Explorer. When it is set to true, the innerHTML attribute has no _cssquery_UID. However, the search speed will slow down.
	
	@method $$.safeHTML
	@static
	@param {Boolean} bFlag Determines whether _cssquery_UID is displayed. When it is set to true, _cssquery_UID is not displayed.
	@return {Boolean} Returns the _cssquery_UID display state. Returns true when _cssquery_UID is displayed, otherwise, false.
	@filter desktop
     */
    cssquery.safeHTML = function(bFlag) {
        
        if (arguments.length > 0)
            safeHTML = bFlag && jindo._p_._JINDO_IS_IE;
        
        return safeHTML || !jindo._p_._JINDO_IS_IE;
        
    };
    
    /**
     	The version attribute is a character string that includes the version information of cssquery.
	
	@property $$.version
	@type String
	@field
	@static
	@filter desktop
     */
    cssquery.version = sVersion;
    
    /**
     	Adds a module to handle the memory leak caused by using validUID or cache in IE.
     */
    cssquery.release = function() {
        if(jindo._p_._JINDO_IS_IE) {
            delete validUID;
            validUID = {};
            
            if(bUseResultCache){
                cssquery.clearCache();
            }
        }
    };
    /**
     	A function that checks whether cache can be deleted
	
	@method $$._getCacheInfo
	@filter desktop
	@ignore
     */
    cssquery._getCacheInfo = function(){
        return {
            uidCache : validUID,
            eleCache : oResultCache 
        };
    };
    /**
     	A function for testing
	
	@method $$._resetUID
	@filter desktop
	@ignore
     */
    cssquery._resetUID = function(){
        UID = 0;
    };
    /**
     	If extreme is executed in a browser with querySelector, the querySelector coverage increases, which is resulting in speedup.
	However, if elements without IDs are used as base element, IDs are randomly assigned to base elements.
	
	@method $$.extreme
	@static
	@ignore
	@param {Boolean} bExtreme true
     */
    cssquery.extreme = function(bExtreme){
        if(arguments.length == 0){
            bExtreme = true;
        }
        bExtremeMode = bExtreme;
    };

    return cssquery;
    
})();
//-!jindo.cssquery end!-//
//-!jindo.$$.hidden start(jindo.cssquery)!-//
//-!jindo.$$.hidden end!-//

/**
 * 
	@fileOverview A file to define the constructors and methods of the jindo.$Agent() object
	@name core.js
	@author NAVER Ajax Platform
 */

//-!jindo.$Agent start!-//
/**
	The jindo.$Agent() object provides information about operating systems and browsers that users are using.
	
	@class jindo.$Agent
	@keyword agent
 */
/**
	Creates the jindo.$Agent() object. The jindo.$Agent() object provides information about operating systems and browsers that users are using.
	
	@constructor
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
};
//-!jindo.$Agent end!-//

//-!jindo.$Agent.prototype.navigator start!-//
/**
	The navigator() method returns an object that contains information about user browsers.
	
	@method navigator
	@return {Object} Returns the object in which browser information is stored.
	@remark 
		<ul class="disc">
			<li>mobile, msafari, mopera, and mie are available in version 1.4.3 and higher.</li>
			<li>In version 1.4.5 and higher, mobile in ipad returns false.</li>
		</ul><br>
		An object in which browser information is stored has names and versions of browsers as its attributes. Names must be written in lower-case letters and browser attributes matching with user browsers have a true value. 
		It also provides a method to check the names of user browsers. The following table describes the attributes and methods of an object that contains information about user browsers.<br>
		<h5>Object attributes of browser information</h5>
		<table class="tbl_board">
			<caption class="hide">Object attributes of browser information</caption>
			<thead>
				<tr>
					<th scope="col" style="width:15%">Name</th>
					<th scope="col" style="width:15%">Type</th>
					<th scope="col">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">camino</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Camino browser is used as Boolean.</td>
				</tr>
				<tr>
					<td class="txt bold">chrome</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Google Chrome browser is used as Boolean.</td>
				</tr>
				<tr>
					<td class="txt bold">firefox</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Firefox browser is used as Boolean.</td>
				</tr>
				<tr>
					<td class="txt bold">icab</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the iCab browser is used as Boolean.</td>
				</tr>
				<tr>
					<td class="txt bold">ie</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Internet Explorer browser is used as Boolean.</td>
				</tr>
				<tr>
					<td class="txt bold">konqueror</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Konqueror browser is used as Boolean.</td>
				</tr>
				<tr>
					<td class="txt bold">mie</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Internet Explorer Mobile browser is used as Boolean.</td>
				</tr>
				<tr>
					<td class="txt bold">mobile</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the mobile browser is used as Boolean.</td>
				</tr>
				<tr>
					<td class="txt bold">mozilla</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Mozilla series browser is used as Boolean.</td>
				</tr>
				<tr>
					<td class="txt bold">msafari</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the mobile Safari browser is used as Boolean.</td>
				</tr>
				<tr>
					<td class="txt bold">nativeVersion</td>
					<td>Number</td>
					<td class="txt">Stores an actual browser when using it in Internet Explorer compatibility mode.</td>
				</tr>
				<tr>
					<td class="txt bold">netscape</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Netscape browser is used as Boolean.</td>
				</tr>
				<tr>
					<td class="txt bold">omniweb</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the OmniWeb browser is used as Boolean.</td>
				</tr>
				<tr>
					<td class="txt bold">opera</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Opera browser is used as Boolean.</td>
				</tr>
				<tr>
					<td class="txt bold">safari</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Safari browser is used as Boolean.</td>
				</tr>
				<tr>
					<td class="txt bold">webkit</td>
					<td>Number</td>
					<td class="txt">Stores whether the WebKit series browser is used as Boolean.</td>
				</tr>
				<tr>
					<td class="txt bold">version</td>
					<td>Number</td>
					<td class="txt">Stores version information of browsers that users are using. The version information is stored in a float data type; if no information exists, the value is -1.</td>
				</tr>
			</tbody>
		</table>
		<h5>Object methods of browser information</h5>
		<table class="tbl_board">
			<caption class="hide">Object methods of browser information</caption>
			<thead>
				<tr>
					<th scope="col" style="width:15%">Name</th>
					<th scope="col" style="width:15%">Return type</th>
					<th scope="col">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">getName()</td>
					<td>String</td>
					<td class="txt">Returns names of browsers that users are using. The names of browsers to return are the same as those of attributes.</td>
				</tr>
			</tbody>
		</table>
	@example
		oAgent = $Agent().navigator(); // Assumes that users are using Firefox version 3.
		
		oAgent.camino  // false
		oAgent.firefox  // true
		oAgent.konqueror // false
		oAgent.mozilla  //true
		oAgent.netscape  // false
		oAgent.omniweb  //false
		oAgent.opera  //false
		oAgent.webkit  /false
		oAgent.safari  //false
		oAgent.ie  //false
		oAgent.chrome  //false
		oAgent.icab  //false
		oAgent.version  //3
		oAgent.nativeVersion // -1 (available in version 1.4.2 and higher. nativeVersion is 8 when using Internet Explorer 8 in compatibility mode.)
		
		oAgent.getName() // firefox
 */
jindo.$Agent.prototype.navigator = function() {
	//-@@$Agent.navigator-@@//
	var info = {},
		ver = -1,
		nativeVersion = -1,
		u = this._navigator.userAgent,
		v = this._navigator.vendor || "",
		dm = this._dm;

	function f(s,h){
		return ((h || "").indexOf(s) > -1);
	}

	info.getName = function(){
		var name = "";
		for(var x in info){
			if(x !=="mobile" && typeof info[x] == "boolean" && info[x] && info.hasOwnProperty(x))
				name = x;
		}
		return name;
	};
	info.edge = f("Edge", u);
	info.webkit = !info.edge&&f("WebKit", u);
	info.opera = (window.opera !== undefined) || f("Opera", u) || f("OPR", u);
	info.ie = !info.opera && (f("MSIE", u)||f("Trident", u));
	info.chrome = !info.edge&&info.webkit && !info.opera && f("Chrome", u) || f("CriOS", u);
	info.safari = !info.edge&&info.webkit && !info.chrome && !info.opera && f("Apple", v);
	info.firefox = f("Firefox", u);
	info.mozilla = !info.edge&&f("Gecko", u) && !info.safari && !info.chrome && !info.firefox && !info.ie;
	info.camino = f("Camino", v);
	info.netscape = f("Netscape", u);
	info.omniweb = f("OmniWeb", u);
	info.icab = f("iCab", v);
	info.konqueror = f("KDE", v);
	info.mobile = !info.edge&&(f("Mobile", u) || f("Android", u) || f("Nokia", u) || f("webOS", u) || f("Opera Mini", u) || f("Opera Mobile", u) || f("BlackBerry", u) || (f("Windows", u) && f("PPC", u)) || f("Smartphone", u) || f("IEMobile", u)) && !(f("iPad", u) || f("Tablet", u));
	info.msafari = !info.edge&&((!f("IEMobile", u) && f("Mobile", u)) || (f("iPad", u) && f("Safari", u))) && !info.chrome && !info.opera && !info.firefox;
	info.mopera = f("Opera Mini", u);
	info.mie = f("PPC", u) || f("Smartphone", u) || f("IEMobile", u);

	try{
		if(info.ie){
			if(dm > 0){
				ver = dm;
				if(u.match(/(?:Trident)\/([\d.]+)/)){
					var nTridentNum = parseFloat(RegExp.$1, 10);
					
					if(nTridentNum > 3){
						nativeVersion = nTridentNum + 4;
					}
				}else{
					nativeVersion = ver;
				}
			}else{
				nativeVersion = ver = u.match(/(?:MSIE) ([\d.]+)/)[1];
			}
		} else if(info.edge) {
            ver = u.match(/(?:Edge)\/([\d.]+)/)[1];
        } else if(info.safari || info.msafari){
			ver = parseFloat(u.match(/Safari\/([\d.]+)/)[1]);

			if(ver == 100){
				ver = 1.1;
			}else{
				if(u.match(/Version\/([\d.]+)/)){
					ver = RegExp.$1;
				}else{
					ver = [1.0, 1.2, -1, 1.3, 2.0, 3.0][Math.floor(ver / 100)];
				}
			}
        } else if(info.mopera) {
            ver = u.match(/(?:Opera\sMini)\/([\d.]+)/)[1];
        } else if(info.opera) {
            ver = u.match(/(?:Version|OPR|Opera)[\/\s]?([\d.]+)(?!.*Version)/)[1];
		}else if(info.firefox||info.omniweb){
			ver = u.match(/(?:Firefox|OmniWeb)\/([\d.]+)/)[1];
		}else if(info.mozilla){
			ver = u.match(/rv:([\d.]+)/)[1];
		}else if(info.icab){
			ver = u.match(/iCab[ \/]([\d.]+)/)[1];
		}else if(info.chrome){
			ver = u.match(/(?:Chrome|CriOS)[ \/]([\d.]+)/)[1];
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
	An os() method returns an object that contains information about user operating systems.
	
	@method os
	@return {Object} Returns the object in which information about operating systems is stored.
	@remark
		<ul class="disc">
			<li>iphone, android, nokia, webos, blackberry, and mwin are available in version 1.4.3 and higher.</li>
			<li>ipad is available in version 1.4.5 and higher.</li>
			<li>ios, symbianos, version, win8 is available in version 2.3.0 and higher.</li>
		</ul><br>
		An object in which browser information is stored has names and versions of operating systems as its attributes. Names must be written in lower-case letters and operating system attributes matching with user operating systems have a true value.<br>
		It also provides a method to check the names of user operating systems. The following table describes the attributes and methods of an object that contains information about user operating systems.<br>
		<h5>Object attributes</h5>
		<table class="tbl_board">
			<caption class="hide">Object attributes</caption>
			<thead>
				<tr>
					<th scope="col" style="width:15%">Name</th>
					<th scope="col" style="width:15%">Type</th>
					<th scope="col">Description</th>
					<th scope="col" style="width:25%">Note</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">android</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Android operating system is used as Boolean.</td>
					<td class="txt">Available in version 1.4.3 and higher</td>
				</tr>
				<tr>
					<td class="txt bold">blackberry</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Blackberry operating system is used as Boolean.</td>
					<td class="txt">Available in version 1.4.3 and higher</td>
				</tr>
				<tr>
					<td class="txt bold">ios</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the iOS operating system is used as Boolean.</td>
					<td class="txt">Available in version 2.3.0 and higher</td>
				</tr>
				<tr>
					<td class="txt bold">ipad</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the iPad device is used as Boolean.</td>
					<td class="txt">Available in version 1.4.5 and higher / Deprecated</td>
				</tr>
				<tr>
					<td class="txt bold">iphone</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the iPhone device is used as Boolean.</td>
					<td class="txt">Available in version 1.4.3 and higher / Deprecated</td>
				</tr>
				<tr>
					<td class="txt bold">linux</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Linux operating system is used as Boolean.</td>
					<td class="txt"></td>
				</tr>
				<tr>
					<td class="txt bold">mac</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Mackintosh operating system is used as Boolean.</td>
					<td class="txt"></td>
				</tr>
				<tr>
					<td class="txt bold">mwin</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Window Mobile operating system is used as Boolean.</td>
					<td class="txt">Available in version 1.4.3 and higher</td>
				</tr>
				<tr>
					<td class="txt bold">nokia</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Nokia operating system is used as Boolean.</td>
					<td class="txt">Available in version 1.4.3 and higher / Deprecated</td>
				</tr>
				<tr>
					<td class="txt bold">symbianos</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the SymbianOS operating system is used as Boolean.</td>
					<td class="txt">Available in version 2.3.0 and higher</td>
				</tr>
				<tr>
					<td class="txt bold">vista</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Windows Vista operating system is used as Boolean.</td>
					<td class="txt">Deprecated</td>
				</tr>
				<tr>
					<td class="txt bold">webos</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the webOS operating system is used as Boolean.</td>
					<td class="txt">Available in version 1.4.3 and higher</td>
				</tr>
				<tr>
					<td class="txt bold">win</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Windows series operating system is used as Boolean.</td>
					<td class="txt"></td>
				</tr>
				<tr>
					<td class="txt bold">win2000</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Windows 2000 operating system is used as Boolean.</td>
					<td class="txt">Deprecated</td>
				</tr>
				<tr>
					<td class="txt bold">win7</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Windows 7 operating system is used as Boolean.</td>
					<td class="txt">Deprecated</td>
				</tr>
				<tr>
					<td class="txt bold">win8</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Windows 8 operating system is used as Boolean.</td>
					<td class="txt">Deprecated</td>
				</tr>
				<tr>
					<td class="txt bold">winxp</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Windows XP operating system is used as Boolean.</td>
					<td class="txt">Deprecated</td>
				</tr>
				<tr>
					<td class="txt bold">xpsp2</td>
					<td>Boolean</td>
					<td class="txt">Stores whether the Windows XP SP 2 operating system is used as Boolean.</td>
					<td class="txt">Deprecated</td>
				</tr>
				<tr>
					<td class="txt bold">version</td>
					<td>String</td>
					<td class="txt">운영체제의 버전 문자열. 버전을 찾지 못한 경우 null이 지정된다.</td>
					<td class="txt">Available in version 2.3.0 and higher</td>
				</tr>
			</tbody>
		</table>
		<h5>Object methods of operating systems</h5>
		<table class="tbl_board">
			<caption class="hide">Object methods of operating systems</caption>
			<thead>
				<tr>
					<th scope="col" style="width:15%">Name</th>
					<th scope="col" style="width:15%">Return type</th>
					<th scope="col">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">getName()</td>
					<td>String</td>
					<td class="txt">Returns names of operating systems that users are using. The names of operating systems is the same as those of attributes.</td>
				</tr>
			</tbody>
		</table>
		<h5>운영체제별 버전 정보</h5>
		<table class="tbl_board">
			<caption class="hide">운영체제별 버전 정보</caption>
			<thead>
				<tr>
					<th scope="col" style="width:60%">운영체제 이름</th>
					<th scope="col">버전 값</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">Windows 2000</td>
					<td>5.0</td>
				</tr>
				<tr>
					<td class="txt bold">Windows XP</td>
					<td>5.1</td>
				</tr>
				<tr>
					<td class="txt bold">Windows VISTA</td>
					<td>6.0</td>
				</tr>
				<tr>
					<td class="txt bold">Windows 7</td>
					<td>6.1</td>
				</tr>
				<tr>
					<td class="txt bold">Windows 8</td>
					<td>6.2</td>
				</tr>
				<tr>
					<td class="txt bold">Windows 8.1</td>
					<td>6.3</td>
				</tr>
				<tr>
					<td class="txt bold">OS X Tiger</td>
					<td>10.4</td>
				</tr>
				<tr>
					<td class="txt bold">OS X Leopard</td>
					<td>10.5</td>
				</tr>
				<tr>
					<td class="txt bold">OS X Snow Leopard</td>
					<td>10.6</td>
				</tr>
				<tr>
					<td class="txt bold">OS X Lion</td>
					<td>10.7</td>
				</tr>
				<tr>
					<td class="txt bold">OS X Mountain Lion</td>
					<td>10.8</td>
				</tr>
			</tbody>
		</table>
	@example
		var oOS = $Agent().os();  // Assumes that users are using Windows XP.
		oOS.linux  // false
		oOS.mac  // false
		oOS.vista  // false
		oOS.win  // true
		oOS.win2000  // false
		oOS.winxp  // true
		oOS.xpsp2  // false
		oOS.win7  // false
		oOS.getName() // winxp
	@example
		var oOS = $Agent().os();  // 단말기가 iPad이고 버전이 5.0 이라고 가정한다.
		info.ipad; // true
		info.ios; // true
		info.version; // "5.0"
		
		info.win; // false
		info.mac; // false
		info.linux; // false
		info.win2000; // false
		info.winxp; // false
		info.xpsp2; // false
		info.vista; // false
		info.win7; // false
		info.win8; // false
		info.iphone; // false
		info.android; // false
		info.nokia; // false
		info.webos; // false
		info.blackberry; // false
		info.mwin; // false
		info.symbianos; // false
 */
jindo.$Agent.prototype.os = function() {
	//-@@$Agent.os-@@//
	var info = {},
		u = this._navigator.userAgent,
		p = this._navigator.platform,
		f = function(s, h) {
			return (h.indexOf(s) > -1);
		},
		aMatchResult = null;
	
	info.getName = function(){
		var name = "";
		
		for(var x in info){
			if(info[x] === true && info.hasOwnProperty(x)){
				name = x;
			}
		}
		
		return name;
	};

	info.win = f("Win", p);
	info.mac = f("Mac", p);
	info.linux = f("Linux", p);
	info.win2000 = info.win && (f("NT 5.0", u) || f("Windows 2000", u));
	info.winxp = info.win && f("NT 5.1", u);
	info.xpsp2 = info.winxp && f("SV1", u);
	info.vista = info.win && f("NT 6.0", u);
	info.win7 = info.win && f("NT 6.1", u);
	info.win8 = info.win && f("NT 6.2", u);
	info.ipad = f("iPad", u);
	info.iphone = f("iPhone", u) && !info.ipad;
	info.android = f("Android", u);
	info.nokia =  f("Nokia", u);
	info.webos = f("webOS", u);
	info.blackberry = f("BlackBerry", u);
	info.mwin = f("PPC", u) || f("Smartphone", u) || f("IEMobile", u) || f("Windows Phone", u);
	info.ios = info.ipad || info.iphone;
	info.symbianos = f("SymbianOS", u);
	info.version = null;
	
	if(info.win){
		aMatchResult = u.match(/Windows NT ([\d|\.]+)/);
		if(aMatchResult != null && aMatchResult[1] != undefined){
			info.version = aMatchResult[1];
		}
	}else if(info.mac){
		aMatchResult = u.match(/Mac OS X ([\d|_]+)/);
		if(aMatchResult != null && aMatchResult[1] != undefined){
			info.version = String(aMatchResult[1]).split("_").join(".");
		}

	}else if(info.android){
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
	}else if(info.webos){
		aMatchResult = u.match(/webOS\/([\d|\.]+)/);
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

//-!jindo.$Agent.prototype.flash start!-//
/**
	The flash() method returns an object that contains the Flash Player information of users.
	
	@method flash
	@return {Object} Returns the object in which the Flash Player information is stored
	@filter desktop
	@remark The object containing the Flash Player information provides whether Flash Player is installed and its version information (if it is installed). The following table describes the attributes of an object containing the Flash Player information.<br>	
		<h5>Object attributes of Flash Player information</h5>
		<table class="tbl_board">
			<caption class="hide">Object attributes of Flash Player information</caption>
			<thead>
				<tr>
					<th scope="col" style="width:15%">Name</th>
					<th scope="col" style="width:15%">Type</th>
					<th scope="col">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">installed</td>
					<td>Boolean</td>
					<td class="txt">Stores whether Flash Player is installed as Boolean.</td>
				</tr>
				<tr>
					<td class="txt bold">version</td>
					<td>Number</td>
					<td class="txt">Stores version information of Flash Player that users are using. The version information is stored in a float data type; if Flash Player is not installed, the value is -1.</td>
				</tr>
			</tbody>
		</table>
	@see http://www.adobe.com/products/flashplayer/ Official site of Adobe Flash Player
	@example
		var oFlash = $Agent().flash();
		oFlash.installed  // true if the Flash Player is installed.
		oFlash.version  // Flash Player version
 */
jindo.$Agent.prototype.flash = function() {
	//-@@$Agent.flash-@@//
	var info = {};
	var p    = this._navigator.plugins;
	var m    = this._navigator.mimeTypes;
	var f    = null;

	info.installed = false;
	info.version   = -1;
	
	if (!jindo.$Jindo.isUndefined(p)&& p.length) {
		f = p["Shockwave Flash"];
		if (f) {
			info.installed = true;
			if (f.description) {
				info.version = parseFloat(f.description.match(/[0-9.]+/)[0]);
			}
		}

		if (p["Shockwave Flash 2.0"]) {
			info.installed = true;
			info.version   = 2;
		}
	} else if (!jindo.$Jindo.isUndefined(m) && m.length) {
		f = m["application/x-shockwave-flash"];
		info.installed = (f && f.enabledPlugin);
	} else {
		try {
			info.version   = parseFloat(new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').match(/(.\d?),/)[1]);
			info.installed = true;
		} catch(e) {}
	}

	this.flash = function() {
		return info;
	};
    /*
    Leaves it for backward compatibility for the time being.
     */
	this.info = this.flash;

	return info;
};
//-!jindo.$Agent.prototype.flash end!-//

//-!jindo.$Agent.prototype.silverlight start!-//
/**
	The silverlight() method returns an object that contains the Silverlight information of users.
	
	@method silverlight
	@return {Object} Returns the object in which the Silverlight information is stored.
	@filter desktop
	@remark The object containing the Silverlight information provides whether Silverlight is installed and its version information (if it is installed). The following table describes the attributes of an object containing the Silverlight information.<br>
		<h5>Object attributes of Silverlight information</h5>
		<table class="tbl_board">
			<caption class="hide">Object attributes of Silverlight information</caption>
			<thead>
				<tr>
					<th scope="col" style="width:15%">Name</th>
					<th scope="col" style="width:15%">Type</th>
					<th scope="col">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">installed</td>
					<td>Boolean</td>
					<td class="txt">Stores whether Silverlight is installed as Boolean.</td>
				</tr>
				<tr>
					<td class="txt bold">version</td>
					<td>Number</td>
					<td class="txt">Stores version information of Silverlight that users are using. The version information is stored in a float data type; if Silverlight is not installed, the value is -1.</td>
				</tr>
			</tbody>
		</table>
	@see http://www.microsoft.com/silverlight Official site of Silverlight
	@example
		var oSilver = $Agent.silverlight();
		oSilver.installed  // true if the SilverLight Player is installed.
		oSilver.version  // SilverLight Player version
 */
jindo.$Agent.prototype.silverlight = function() {
	//-@@$Agent.silverlight-@@//
	var info = new Object;
	var p    = this._navigator.plugins;
	var s    = null;

	info.installed = false;
	info.version   = -1;

	if (!jindo.$Jindo.isUndefined(p) && p.length) {
		s = p["Silverlight Plug-In"];
		if (s) {
			info.installed = true;
			info.version = parseInt(s.description.split(".")[0],10);
			if (s.description == "1.0.30226.2") info.version = 2;
		}
	} else {
		try {
			s = new ActiveXObject("AgControl.AgControl");
			info.installed = true;
			if(s.isVersionSupported("3.0")){
				info.version = 3;
			}else if (s.isVersionSupported("2.0")) {
				info.version = 2;
			} else if (s.isVersionSupported("1.0")) {
				info.version = 1;
			}
		} catch(e) {}
	}

	this.silverlight = function() {
		return info;
	};

	return info;
};
//-!jindo.$Agent.prototype.silverlight end!-//

/**
	@fileOverview A file to define the constructor and method of a jindo.$A() object
	@name array.js
	@author NAVER Ajax Platform
 */
//-!jindo.$A start!-//
/**
	The jindo.$A() object provides methods to handle arrays in an easy way. It wraps the original array object upon creating an object. In this context, wrapping means adding a new extended functionality to the original function by wrapping the JavaScript functions.
	
	@class jindo.$A
	@keyword array
 */
/**
	Creates a jindo.$A() object.
	
	@constructor
	@param {Null | Undefined | Array+ | ArrayStyle} [vArray] An empty array is allocated if it is Void, Null, or Undefined.
	@return {jindo.$A} The jindo.$A() object
	@example
		var zoo = ["zebra", "giraffe", "bear", "monkey"];
		var waZoo = $A(zoo); // Creates and returns a jindo.$A() object that wraps ["zebra", "giraffe", "bear", "monkey"].
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
	
	var oArgs = jindo._checkVarType(arguments, {
		'4voi' : [ ],
		'4arr' : ['aPram:Array+'],
		'4nul' : [ 'oNull:Null' ],
		'4und' : [ 'oUndefined:Undefined' ],
		'arrt' : [ 'aPram:ArrayStyle' ]
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
	'4fun' : [ 'fCallback:Function+'],
	'4thi' : [ 'fCallback:Function+', 'oThis:Variant']
};
//-!jindo.$A end!-//

//-!jindo.$A.prototype.toString start!-//
/**
	The toString() method converts an internal array into a string. The Array.toString() method in JavaScript is used.
	
	@method toString
	@return {String} A string to convert an internal array
	@See https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/toString array.toString() - MDN Docs
	@example
		var zoo = ["zebra", "giraffe", "bear", "monkey"];
		$A(zoo).toString();
		// Result : zebra,giraffe,bear,monkey
 */
jindo.$A.prototype.toString = function() {
	//-@@$A.toString-@@//
	return this._array.toString();
};
//-!jindo.$A.prototype.toString end!-//

//-!jindo.$A.prototype.get start!-//
/**
	The get() method searches the element value of an array by index.
	
	@method get
	@param {Numeric} nIndex The index of an element to search for. The index numbers begin with 0.
	@return {Variant} The element value of the corresponding index in an array
	@since 1.4.2
	@example
		var zoo = ["zebra", "giraffe", "bear", "monkey"];
		var waZoo = $A(zoo);
		
		// Searches element values.
		waZoo.get(1); // Result : giraffe
		waZoo.get(3); // Result : monkey
 */
jindo.$A.prototype.get = function(nIndex){
	//-@@$A.get-@@//
	 jindo._checkVarType(arguments, {
		'4num' : [ 'nIndex:Numeric' ]
	},"$A#get");
	return this._array[nIndex];
};
//-!jindo.$A.prototype.get end!-//

//-!jindo.$A.prototype.set start!-//
/**
	The set() method adds a value to a array.
	
	@method set
	@param {Numeric} nIndex Index
	@param {Variant} vValue Various values
	@return {this} 해당 인덱스의 값을 지정한 인스턴스 자신
	@since 2.0.0
	@example
		var zoo = ["zebra", "giraffe", "bear", "monkey"];
		var waZoo = $A(zoo);
		
		// Configures a value
		waZoo.set(1,"pig"); // Result : $A(["zebra", "pig", "bear", "monkey"]);
 */
jindo.$A.prototype.set = function(nIndex,vValue){
	//-@@$A.set-@@//
	jindo._checkVarType(arguments, {
		'4num' : [ 'nIndex:Numeric' ,'vValue:Variant']
		
	},"$A#set");
	
	this._array[nIndex] = vValue;
	return this;
};
//-!jindo.$A.prototype.set end!-//

//-!jindo.$A.prototype.length start!-//
/**
	The length() method searches the size of an internal array like length attribute.
	
	@method length
	@return {Number} Returns the size of an internal array.
	@example
		var zoo = ["zebra", "giraffe", "bear", "monkey"];
		
		// Search the size of an array
		$A(zoo).length(); // Result : 4
 */
/**
	The length() method specifies the size of an internal array like length attribute.
	
	@method length
	@syntax nLen
	@syntax nLen2, vValue
	@param {Numeric} nLen The size of an array. If it is less than the size of an existing array, elements after nLen-th position are removed; if it is greater than the size of an existing array, it is not applicable.
	@param {Numeric} nLen2 The size of an array. If it is less than the size of an existing array, elements after nLen2-th position are removed; if it is greater than the size of an existing array, the expanded space is filled with the vValue parameter value.
	@param {Variant} vValue An initial value to be used when adding a new element
	@return {this} 내부 배열의 크기를 변경한 인스턴스 자신
	@example
		var zoo = ["zebra", "giraffe", "bear", "monkey"];
		
		// Specifies the size of an array (if an element is deleted)
		$A(zoo).length(2);
		// Result : ["zebra", "giraffe"]
	@example
		// // Specified the size of an array (if an element is added)
		$A(zoo).length(6, "(Empty)");
		// Result : ["zebra", "giraffe", "bear", "monkey", "(Empty)", "(Empty)"]
		
		$A(zoo).length(5, birds);
		// Result : ["zebra", "giraffe", "bear", "monkey", ["parrot", "sparrow", "dove"]]
 */
jindo.$A.prototype.length = function(nLen, oValue) {
	//-@@$A.length-@@//

	var oArgs = jindo._checkVarType(arguments, {
		'4num' : [ jindo.$Jindo._F('nLen:Numeric')],
		'sv' : [ 'nLen:Numeric', 'vValue:Variant'],
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
	The has() method returns the existence of an element that has a specific value in an internal array in Boolean format.
	
	@method has
	@param {Variant} vValue A value to search for
	@return {Boolean} Returns true if the same element as a parameter value is found in an array; otherwise, retunrs false.
	@see jindo.$A#indexOf
	@example
		var arr = $A([1,2,3]);
		
		// Searches a value.
		arr.has(3); // Results : true
		arr.has(4); // Results : false
 */
jindo.$A.prototype.has = function(oValue) {
	//-@@$A.has-@@//
	return (this.indexOf(oValue) > -1);
};
//-!jindo.$A.prototype.has end!-//

//-!jindo.$A.prototype.indexOf start!-//
/**
	The indexOf() method searches an element that has a specific value in an array and returns the index of an element found.
	
	@method indexOf
	@param {Variant} vValue A value to search for
	@return {Numeric} The index of an element found. The index numbers begins with 0. Returns -1 if no element is found.
	@see jindo.$A#has
	@example
		var zoo = ["zebra", "giraffe", "bear"];
		va  r waZoo = $A(zoo);
		
		// Returns an index after searching a value.
		waZoo.indexOf("giraffe"); // 1
		waZoo.indexOf("monkey"); // -1
 */
jindo.$A.prototype.indexOf = function(oValue) {
	//-@@$A.indexOf-@@//
	if (this._array.indexOf) {
		jindo.$A.prototype.indexOf = function(oValue) {
			return this._array.indexOf(oValue);
		};
	}else{
		jindo.$A.prototype.indexOf = function(oValue) {
			for(var i=0; i < this._array.length; i++) {
				if (this._array[i] == oValue) return i;
			}
			return -1;
		};
	}
	
	return this.indexOf(oValue);
};
//-!jindo.$A.prototype.indexOf end!-//

//-!jindo.$A.prototype.$value start!-//
/**
	The $value() method returns an internal array.
	
	@method $value
	@return {Array} The original array
	@example
		var waNum = $A([1, 2, 3]);
		waNum.$value(); // Returns [1, 2, 3], the original array.
 */
jindo.$A.prototype.$value = function() {
	//-@@$A.$value-@@//
	return this._array;
};
//-!jindo.$A.prototype.$value end!-//

//-!jindo.$A.prototype.push start!-//
/**
	The push() method adds one or more elements inside an array and returns array size.
	
	@method push
	@param {Variant} vValue* A value of the 1st~Nth element to be added
	@return {Numeric} The array size after an element is added in the array
	@see jindo.$A#pop
	@see jindo.$A#shift
	@see jindo.$A#unshift
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/push array.push() - MDN Docs
	@example
		var arr = $A([1,2,3]);
		
		// Adds elements.
		arr.push(4);	// Result : 4 is returned. The internal array is changed to [1,2,3,4].
		arr.push(5,6);	// Result : 6 is returned. The internal array is changed to [1,2,3,4,5,6].
 */
jindo.$A.prototype.push = function(oValue1/*, ...*/) {
	//-@@$A.push-@@//
	return this._array.push.apply(this._array, jindo._p_._toArray(arguments));
};
//-!jindo.$A.prototype.push end!-//

//-!jindo.$A.prototype.pop start!-//
/**
	The pop() method deletes the last element of an internal array.
	
	@method pop
	@return {Variant} A deleted element
	@see jindo.$A#push
	@see jindo.$A#shift
	@see jindo.$A#unshift
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/pop array.pop() - MDN Docs
	@example
		var arr = $A([1,2,3,4,5]);
		
		arr.pop(); // Result : 5 is returned. The internal array is changed to [1,2,3,4].
 */
jindo.$A.prototype.pop = function() {
	//-@@$A.pop-@@//
	return this._array.pop();
};
//-!jindo.$A.prototype.pop end!-//

//-!jindo.$A.prototype.shift start!-//
/**
	The shift() method moves every element of an internal array forward one space. The first element in the internal array is deleted.
	
	@method shift
	@return {Variant} The first element deleted
	@see jindo.$A#pop
	@see jindo.$A#push
	@see jindo.$A#unshift
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/shift array.shift() - MDN Docs
	@example
		var arr  = $A(['Melon','Grape','Apple','Kiwi']);
		
		arr.shift(); // Result : 'Melon' is returned. The internal array is changed to ["Grape", "Apple", "Kiwi"].
 */
jindo.$A.prototype.shift = function() {
	//-@@$A.shift-@@//
	return this._array.shift();
};
//-!jindo.$A.prototype.shift end!-//

//-!jindo.$A.prototype.unshift start!-//
/**
	The unshift() method inserts one or more leading elements in an internal array.
	
	@method unshift
	@param {Variant} vValue* A 1st~Nth value to be inserted
	@return {Numeric} The array size in which an element is added
	@see jindo.$A#pop
	@see jindo.$A#push
	@see jindo.$A#shift
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/unshift array.unshift() - MDN Docs
	@example
		var arr = $A([4,5]);
		
		arr.unshift('c');		// Result : 3 is returned. The internal array is changed to ["c", 4, 5].
		arr.unshift('a', 'b');	// Result : 5 is returned. The internal array is changed to ["a", "b", "c", 4, 5].
 */
jindo.$A.prototype.unshift = function(oValue1/*, ...*/) {
	//-@@$A.unshift-@@//
	this._array.unshift.apply(this._array, jindo._p_._toArray(arguments));

	return this._array.length;
};
//-!jindo.$A.prototype.unshift end!-//

//-!jindo.$A.prototype.forEach start(jindo.$A.Break,jindo.$A.Continue)!-//
/**
	The forEach() method executes the callback function while traversing all elements of hash.
	
	@method forEach
	@param {Function+} fCallback A callback function to be executed while traversing an array. The callback function has value, index, and array as its parameter. $A.Break() and $A.Continue() can be used.<br>
		<ul class="disc">
			<li>The value represents the value of an element that array has.</li>
			<li>The index represents the index of an element.</li>
			<li>The array represents an array itself.</li>
		</ul>
	@param {Variant} [oThis] An object that will be used as the execution context of the this keyword in the callback function when the callback function is the method of the object
	@return {this} 인스턴스 자신
	@import core.$A[Break, Continue]
	@see jindo.$A#map
	@see jindo.$A#filter
	@example
		var waZoo = $A(["zebra", "giraffe", "bear", "monkey"]);
		
		waZoo.forEach(function(value, index, array) {
			document.writeln((index+1) + ". " + value);
		});
		
		// Result :
		// 1. zebra
		// 2. giraffe
		// 3. bear
		// 4. monkey
	@example
		var waArray = $A([1, 2, 3]);
		
		waArray.forEach(function(value, index, array) {
			array[index] += 10;
		});
		
		document.write(waArray.$value());
		// Result : 11, 12, 13 (Increments by 10 within an internal array)
 */
jindo.$A.prototype.forEach = function(fCallback, oThis) {
	//-@@$A.forEach-@@//
	function forEachBody(fpEach){
		return function(fCallback, oThis){
			var oArgs = jindo._checkVarType(arguments, jindo.$A.checkVarTypeObj,"$A#forEach");
			var that = this;
			function f(v,i,a) {
				try {
					fCallback.apply(oThis||that, jindo._p_._toArray(arguments));
				} catch(e) {
					if (!(e instanceof that.constructor.Continue)) throw e;
				}
			}
			
			fpEach(this, f);
			return this;
		};
	}
	if (this._array.forEach) {
		jindo.$A.prototype.forEach = forEachBody(function(scope, fp){
			try {
				scope._array.forEach(fp);
			} catch(e) {
				if (!(e instanceof scope.constructor.Break)) throw e;
			}
		});
	}else{
		jindo.$A.prototype.forEach = forEachBody(function(scope, fp){
			var arr = scope._array;
			for(var i=0,l=arr.length; i < l; i++) {
				try {
					fp(arr[i], i, arr);
				} catch(e) {
					if (e instanceof scope.constructor.Break) break;
					throw e;
				}
			}
		});
	}
	return this.forEach.apply(this,jindo._p_._toArray(arguments));
};
//-!jindo.$A.prototype.forEach end!-//

//-!jindo.$A.prototype.slice start!-//
/**
	The slice() method extracts the part of an array.
	
	@method slice
	@param {Numeric} nStart The start index to extract. The index numbers begin with 0.
	@param {Numeric} nEnd The index after last element of a string to extract from an array
	@return {jindo.$A} A new jindo.$A() object in which part of an internal array is extracted.<br>If a value of nStart is less than 0 or equal to or greater than a value of nEnd, the jindo.$A() object is returned with an empty array.
	@example
		var arr = $A([12, 5, 8, 130, 44]);
		var newArr = arr.slice(1,3);
		// Returns a jindo.$A() object that wraps [5, 8], the truncated array (no changes made to the original array).
	@example
		var arr = $A([12, 5, 8, 130, 44]);
		var newArr = arr.slice(3,3);
		// Returns a jindo.$A() object that wraps [].
 */
jindo.$A.prototype.slice = function(nStart, nEnd) {
	//-@@$A.slice-@@//
	var a = this._array.slice.call(this._array, nStart, nEnd);
	return jindo.$A(a);
};
//-!jindo.$A.prototype.slice end!-//

//-!jindo.$A.prototype.splice start!-//
/**
	The splice() method deletes the part of an internal array.
	
	@method splice
	@param {Numeric} nIndex	The start index to delete. The index numbers begin with 0.
	@param {Numeric} [nHowMany] The number of elements from which the first element will be deleted.<br>
	If this value and the vValue* parameters are omitted, deletes elements from nth nIndex to the end of the array.<br>
	If a value is specified in the vValue* parameters while this value is specified as 0 or it is not specified as any number, the specified vValue* values are added at the position of nIndex.
	@param {Variant} [vValue*] The 1st~Nth value to be added to the deleted array. The specified value is added to the position of nIndex~(nIndex + N).
	@return {jindo.$A} A new jindo.$A() object wrapping the deleted element.<br>If no element is deleted, returns the jindo.$A() object with an empty array.
	@example
		var arr = $A(["angel", "clown", "mandarin", "surgeon"]);
		
		var removed = arr.splice(2, 0, "drum");
		// An internal array of the arr comprises ["angel", "clown", "drum", "mandarin", "surgeon"] and the drum is added to index 2.
		// An internal array of the removed is [] and no element is deleted.
		
		removed = arr.splice(3, 1);
		// An internal array of the arr comprises ["angel", "clown", "drum", "surgeon"] and the mandarin is deleted.
		// An internal array of the removed has ["mandarin"], the deleted element.
		
		removed = arr.splice(2, 1, "trumpet", "parrot");
		// An internal array of the array comprises ["angel", "clown", "trumpet", "parrot", "surgeon"] and the drum is deleted and a new element is added.
		// An internal array of the removed has ["drum"], the deleted element.
		
		removed = arr.splice(3);
		// An internal array of the arr comprises ["angel", "clown", "trumpet"] and elements from 3 to the end are deleted.
		// An internal array of the removed has ["parrot", "surgeon"], the deleted elements.
 */
jindo.$A.prototype.splice = function(nIndex, nHowMany/*, oValue1,...*/) {
	//-@@$A.splice-@@//
	var a = this._array.splice.apply(this._array, jindo._p_._toArray(arguments));

	return jindo.$A(a);
};
//-!jindo.$A.prototype.splice end!-//

//-!jindo.$A.prototype.shuffle start!-//
/**
	The shuffle() method randomly shuffles the order of the elements in an array.
	
	@method shuffle
	@return {this} 원소의 순서를 섞은 인스턴스 자신
	@see jindo.$A#reverse
	@example
		var dice = $A([1,2,3,4,5,6]);
		
		dice.shuffle();
		document.write("You get the number " + dice.get(0));
		// Result : A random number in the range of 1 to 6
 */
jindo.$A.prototype.shuffle = function() {
	//-@@$A.shuffle-@@//
	this._array.sort(function(a,b){ return Math.random()>Math.random()?1:-1; });
	return this;
};
//-!jindo.$A.prototype.shuffle end!-//

//-!jindo.$A.prototype.reverse start!-//
/**
	The reverse() method reverses the order of the element in an array.
	
	@method reverse
	@return {this} 원소의 순서를 뒤집은 인스턴스 자신
	@see jindo.$A#shuffle
	@example
		var arr = $A([1, 2, 3, 4, 5]);
		
		arr.reverse(); // Result : [5, 4, 3, 2, 1]
 */
jindo.$A.prototype.reverse = function() {
	//-@@$A.reverse-@@//
	this._array.reverse();

	return this;
};
//-!jindo.$A.prototype.reverse end!-//

//-!jindo.$A.prototype.empty start!-//
/**
	The empty() method removes all elements in an array.
	
	@method empty
	@return {this} 모든 원소를 제거한 인스턴스 자신
	@example
		var arr = $A([1, 2, 3]);
		
		arr.empty(); // Result : []
 */
jindo.$A.prototype.empty = function() {
	//-@@$A.empty-@@//
	this._array.length = 0;
	return this;
};
//-!jindo.$A.prototype.empty end!-//

//-!jindo.$A.prototype.concat start!-//
/**
	concat() method returns a new array comprised of this array joined with other array(s) and/or value(s).
	
	@method concat
	@param {Variant} vValue* Array tobe joined 1~N value(s).
	@return {this} new $A instance array comprised.
	@see jindo.$A#concat
	@example
		var arr1 = $A([1, 2, 3]);
		var arr2 = $A([4, 5, 6]);
		
		arr1.concat(arr2); // Result : [1, 2, 3, 4, 5, 6]
		arr1.concat(arr2, [7, 8], "JindoJS");  // Result : [1, 2, 3, 4, 5, 6, 7, 8, "JindoJS"]
 */
jindo.$A.prototype.concat = function(vValue/*, vValue1,...*/) {
    //-@@$A.concat-@@//
    var aRes = [];

    if(!arguments.length) {
        return this;
    } else {
        aRes = this._array.concat();

        for(var i=0, vVal; vVal = arguments[i]; i++) {
            aRes = aRes.concat(vVal instanceof jindo.$A ? vVal._array : vVal);
        }

        return jindo.$A(aRes);
    }
};
//-!jindo.$A.prototype.concat end!-//

//-!jindo.$A.prototype.sort start!-//
/**
	sort() 메서드는 배열 오름차순으로 정렬한다.
	파라메터를 통해 원하는 방법으로 정렬할 수 있다.
	
	@method sort
	@param {Function} [sortFunc] 직접 정렬할 수 있도록 함수를 넣을 수 있다.
		@param {Variant} [sortFunc.preVal] 앞의 값
		@param {Variant} [sortFunc.foreVal] 뒤의 값
	@return {this} 정렬된 $A
	@example
		var arr = $A([2, 3, 1]);
		
		arr.sort(); // 결과 : [1,2,3]
		
	@example
		var arr = $A([2, 3, 1]);
		
		arr.sort(function(v,v1){
			return v < v1
		}); // 결과 : [3,2,1]
 */
jindo.$A.prototype.sort = function(fpSort) {
	//-@@$A.sort-@@//
	var oArgs = jindo._checkVarType(arguments, {
        'void' : [],
        '4fp' : [ 'fpSort:Function+']
    },"$A#sort");
    
    if(fpSort){
        this._array.sort(jindo.$Fn(oArgs.fpSort,this).bind());
    }else{
        this._array.sort();
    }
	return this;
};
//-!jindo.$A.prototype.sort end!-//

//-!jindo.$A.Break start!-//
/**
	The Break() method stops the loop of forEach(), filter() and map() methods. This structure generates an exception internally by force, and thus it may not be operated normally if this method is executed in the "try - catch" area.
	
	@method Break
	@static
	@see jindo.$A#Continue
	@see jindo.$A#forEach
	@see jindo.$A#filter
	@see jindo.$A#map
	@example
		$A([1,2,3,4,5]).forEach(function(value,index,array) {
		   // Exits if the value is greater than 4.
		  if (value > 4) $A.Break();
		   ...
		});
 */
jindo.$A.Break = jindo.$Jindo.Break;
//-!jindo.$A.Break end!-//

//-!jindo.$A.Continue start!-//
/**
	The Continue() method does not execute the rest of the commands in the loop of forEach(), filter(), and map() methods, and skips to the next loop. This structure generates an exception internally by force, and thus it may not be operated normally if this method is executed in the "try - catch" area.
	
	@method Continue
	@static
	@see jindo.$A#Break
	@see jindo.$A#forEach
	@see jindo.$A#filter
	@see jindo.$A#map
	@example
		$A([1,2,3,4,5]).forEach(function(value,index,array) {
		   // Does not process if the value is even number.
		  if (value%2 == 0) $A.Continue();
		   ...
		});
 */
jindo.$A.Continue = jindo.$Jindo.Continue;
//-!jindo.$A.Continue end!-//

//-!jindo.$A.prototype.map start(jindo.$A.Break,jindo.$A.Continue)!-//
/**
	@fileOverview A file to define the extended method of a jindo.$A() object
	@name array.extend.js
	@author NAVER Ajax Platform
 */

/**
	The map() method executes the callback function while traversing all elements of the hash and configures the result of executing the callback function to the elements of the array.
	
	@method map
	@param {Function+} fCallback The callback function to be executed while traversing elements. It reconfigures the value returned by the callback function as the corresponding to the element. The callback function has value, index, and array as its parameter. $A.Break() and $A.Continue() can be used.<br>
		<ul class="disc">
			<li>The value represents the value of an element that array has.</li>
			<li>The index represents the index of an element.</li>
			<li>The array represents an array itself.</li>
		</ul>
	@param {Variant} [oThis] An object that will be used as the execution context of the this keyword in the callback function when the callback function is the method of the object
	@return {jindo.$A} The jindo.$A() object that reflects the execution result of a callback function
	@import core.$A[Break, Continue]
	@see jindo.$A#forEach
	@see jindo.$A#filter
	@example
		var waZoo = $A(["zebra", "giraffe", "bear", "monkey"]);
		
		waZoo.map(function(value, index, array) {
			return (index+1) + ". " + value;
		});
		// Result : [1. zebra, 2. giraffe, 3. bear, 4. monkey]
	@example
		var waArray = $A([1, 2, 3]);
		
		waArray.map(function(value, index, array) {
			return value + 10;
		});
	@example
		var waArray = $A([1, 2, 3]);
		var Callback = {
			"key" : 1,
			"test" : function(value, index, array){
				return this.value + this.key;
			}
		}
		
		waArray.map(Callback.test, Callback);
		
		document.write(waArray.$value());
		// Result : 1, 2, 3 (If this object is specified)
 */
jindo.$A.prototype.map = function(fCallback, oThis) {
	//-@@$A.map-@@//
	function mapBody(fpEach){
		return function(fCallback, oThis) {
			var oArgs = jindo._checkVarType(arguments, jindo.$A.checkVarTypeObj,"$A#map");
			if(oArgs == null){ return this; }
			
			var returnArr	= [];
			var that = this;
			function f(v,i,a) {
				try {
					returnArr.push(fCallback.apply(oThis||that, jindo._p_._toArray(arguments)));
				} catch(e) {
					if (e instanceof that.constructor.Continue){
						returnArr.push(v);
					} else{
						throw e;				
					}
				}
			}
			fpEach(this, f);
			return jindo.$A(returnArr);
		};
	}
	if (this._array.map) {
		jindo.$A.prototype.map = mapBody(function(scope,fp){
			scope.forEach(fp);
		});
	}else{
		jindo.$A.prototype.map = mapBody(function(scope,fp){
			var arr = scope._array;
			for(var i=0,l=scope._array.length; i < l; i++) {
				try {
					fp(arr[i], i, arr);
				} catch(e) {
					if (e instanceof scope.constructor.Break){
						break;
					}else{
						throw e;
					}
				}
			}
		});
	}
	return this.map.apply(this,jindo._p_._toArray(arguments));
};
//-!jindo.$A.prototype.map end!-//

//-!jindo.$A.prototype.filter start(jindo.$A.prototype.forEach)!-//
/**
	The filter() method executes the callback function while traversing all elements of the hash, collects the elements for which the callback function returns true, and returns a new jindo.$A() object.
	
	@method filter
	@param {Function+} fCallback The callback function to be executed while traversing an array. The callback function must return a Boolean value. A element that returns true will belong to a new array. $A.Break() and $A.Continue() can be used.<br>
		<ul class="disc">
			<li>The value represents the value of an element that array has.</li>
			<li>The index represents the index of an element.</li>
			<li>The array represents an array itself.</li>
		</ul>
	@param {Variant} [oThis] An object that will be used as the execution context of the this keyword in the callback function when the callback function is the method of the object
	@return {jindo.$A} A new jindo.$A() object that consists of elements for which the return value of the callback function is true
	@import core.$A[Break, Continue]
	@see jindo.$A#forEach
	@see jindo.$A#map
	@example
		var arr = $A([1,2,3,4,5]);
		
		// Filtering function
		function filterFunc(value, index, array) {
			if (value > 2) {
				return true;
			} else {
				return false;
			}
		}
		
		var newArr = arr.filter(filterFunc);
		
		document.write(arr.$value()); 		// Result: [1,2,3,4,5]
		document.write(newArr.$value()); 	// Result: [3,4,5]
	@example
		var waArray = $A([1, 2, 3]);
		var Callback = {
			"key" : 1,
			"test" : function(value, index, array){
				return this.value > this.key;
			}
		}
		
		waArray.filter(Callback.test, Callback);
		
		document.write(waArray.$value());
		// Result:  2, 3 (if this object is specified)
 */
jindo.$A.prototype.filter = function(fCallback, oThis) {
	//-@@$A.filter-@@//
	function filterBody(fpEach){
		return function(fCallback, oThis) {
			var oArgs = jindo._checkVarType(arguments, jindo.$A.checkVarTypeObj,"$A#filter");
			if(oArgs == null){ return this; }
			
			var returnArr	= [];
			var that = this;
			function f(v,i,a) {
				try {
					if(fCallback.apply(oThis||that, jindo._p_._toArray(arguments))) returnArr.push(v);
				} catch(e) {
					if (!(e instanceof that.constructor.Continue)){
						throw e;				
					}
				}
			}
			fpEach(this, f);
			return jindo.$A(returnArr);
		};
	}
	if (this._array.filter) {
		jindo.$A.prototype.filter = filterBody(function(scope,fp){
			try {
				scope.forEach(fp);
			} catch(e) {
				if(!(e instanceof scope.constructor.Break)) throw e;
			}
		});
	}else{
		jindo.$A.prototype.filter = filterBody(function(scope,fp){
			var arr = scope._array;
			for(var i=0,l=scope._array.length; i < l; i++) {
				try {
					fp(arr[i], i, arr);
				} catch(e) {
					if (e instanceof scope.constructor.Break){
						break;
					}else{
						throw e;
					}
				}
			}
		});
	}
	return this.filter.apply(this,jindo._p_._toArray(arguments));
};

//-!jindo.$A.prototype.filter end!-//

//-!jindo.$A.prototype.every start(jindo.$A.prototype.forEach)!-//
/**
	The every() method checks whether every element of an array satisfies the conditions configured in a callback function while traversing an array. If every element returns true in the callback function, returns true; otherwise, returns false. If a callback function returns false even once during execution, it immediately returns false.
	
	@method every
	@param {Function+} fCallback The callback function to be executed while traversing an array. The callback function must return a Boolean value. $A.Break() and $A.Continue() cannot be used; you can exit a loop with a return value.<br>
		<ul class="disc">
			<li>The value represents the value of an element that array has.</li>
			<li>The index represents the index of an element.</li>
			<li>The array represents an array itself.</li>
		</ul>
	@param {Variant} [oThis] An object that will be used as the execution context of the this keyword in the callback function when the callback function is the method of the object
	@return {Boolean}	Returns true if every return value of a callback function is true; otherwise, returns false.
	@see jindo.$A#some
	@example
		function isBigEnough(value, index, array) {
			return (value >= 10);
		}
		
		var try1 = $A([12, 5, 8, 130, 44]).every(isBigEnough);		// Result : false
		var try2 = $A([12, 54, 18, 130, 44]).every(isBigEnough);	// Result : true
	@example
		var waArray = $A([1, 2, 3]);
		var Callback = {
			"key" : 1,
			"test" : function(value, index, array){
				return this.value > this.key;
			}
		}
		
		waArray.every(Callback.test, Callback);
		// Result :  false (if this object is specified)
 */
jindo.$A.prototype.every = function(fCallback, oThis) {
	//-@@$A.every-@@//
	var ___checkVarType = jindo._checkVarType;
	var ___checkObj = jindo.$A.checkVarTypeObj;
	if (this._array.every) {
		jindo.$A.prototype.every = function(fCallback, oThis) {
			___checkVarType(arguments, ___checkObj,"$A#every");
			return this._array.every(fCallback, oThis||this);
		};
	}else{
		jindo.$A.prototype.every = function(fCallback, oThis) {
			___checkVarType(arguments, ___checkObj,"$A#every");
			
			var result = true;
			var arr = this._array;
			
			for(var i=0,l=arr.length; i < l; i++) {
				if(fCallback.call(oThis||this,arr[i], i, arr) === false){
					result = false;
					break;
				}
			}

			return result;
		};
	}
	return this.every.apply(this,jindo._p_._toArray(arguments));
};
//-!jindo.$A.prototype.every end!-//

//-!jindo.$A.prototype.some start(jindo.$A.prototype.forEach)!-//
/**
	The some() method checks whether any elements of an array satisfies the conditions configured in a callback function while traversing an array. If any element satisfies a condition, returns true; otherwise, returns false. If a callback function returns true even once during execution, it immediately returns true.
	
	@method some
	@param {Function+} fCallback The callback function to be executed while traversing an array. The callback function must return a Boolean value. $A.Break() and $A.Continue() cannot be used; you can exit a loop with a return value.<br>
		<ul class="disc">
			<li>The value represents the value of an element that array has.</li>
			<li>The index represents the index of an element.</li>
			<li>The array represents an array itself.</li>
		</ul>
	@param {Variant} [oThis] An object that will be used as the execution context of the this keyword in the callback function when the callback function is the method of the object
	@return {Boolean} Returns false if every return value of a callback function is false; otherwise, returns true.
	@see jindo.$A#every
	@example
		function twoDigitNumber(value, index, array) {
			return (value >= 10 && value < 100);
		}
		
		var try1 = $A([12, 5, 8, 130, 44]).some(twoDigitNumber);	// Result : true
		var try2 = $A([1, 5, 8, 130, 4]).some(twoDigitNumber);		// Result : false
	@example
		var waArray = $A([1, 2, 3]);
		var Callback = {
			"key" : 1,
			"test" : function(value, index, array){
				return this.value > this.key;
			}
		}
		
		waArray.some(Callback.test, Callback);
		// Result :  true (if this object is specified)
 */
jindo.$A.prototype.some = function(fCallback, oThis) {
	//-@@$A.some-@@//
	var ___checkVarType = jindo._checkVarType;
	var ___checkObj = jindo.$A.checkVarTypeObj;
	if (this._array.some) {
		jindo.$A.prototype.some = function(fCallback, oThis) {
			___checkVarType(arguments, ___checkObj,"$A#some");
			return this._array.some(fCallback, oThis||this);
		};
	}else{
		jindo.$A.prototype.some = function(fCallback, oThis) {
			___checkVarType(arguments, ___checkObj,"$A#some");
			var result = false;
			var arr = this._array;
			
			for(var i=0,l=arr.length; i < l; i++) {
				if(fCallback.call(oThis||this,arr[i], i, arr) === true){
					result = true;
					break;
				}
			}
			
			return result;
		};
	}
	return this.some.apply(this,jindo._p_._toArray(arguments));
};
//-!jindo.$A.prototype.some end!-//

//-!jindo.$A.prototype.refuse start(jindo.$A.prototype.filter, jindo.$A.prototype.indexOf)!-//
/**
	The refuse() method creates the jindo.$A() object by excluding values such as input parameters from an array. Multiple values are allowed.
	
	@method refuse
	@param {Variant} vValue* The 1st~Nth value to be excluded from an array
	@return {jindo.$A} A new jindo.$A() object in which specific values are excluded from an array
	@example
		var arr = $A([12, 5, 8, 130, 44]);
		
		var newArr1 = arr.refuse(12);
		
		document.write(arr);		// Result : [12, 5, 8, 130, 44]
		document.write(newArr1);	// Result : [5, 8, 130, 44]
		
		var newArr2 = newArr1.refuse(8, 44, 130);
		
		document.write(newArr1);	// Result : [5, 8, 130, 44]
		document.write(newArr2);	// Result : [5]
 */
jindo.$A.prototype.refuse = function(oValue1/*, ...*/) {
	//-@@$A.refuse-@@//
	var a = jindo.$A(jindo._p_._toArray(arguments));
	return this.filter(function(v,i) { return !(a.indexOf(v) > -1); });
};
//-!jindo.$A.prototype.refuse end!-//
//-!jindo.$A.prototype.unique start!-//
/**
	The unique() method deletes duplicate elements from an array.
	
	@method unique
	@return {this} 중복되는 원소를 제거한 인스턴스 자신
	@example
		var arr = $A([10, 3, 2, 5, 4, 3, 7, 4, 11]);
		
		arr.unique(); // Result : [10, 3, 2, 5, 4, 7, 11]
 */
jindo.$A.prototype.unique = function() {
	//-@@$A.unique-@@//
	var a = this._array, b = [], l = a.length;
	var i, j;

	/*
	  Deletes duplicate elements.
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
	@fileOverview A file to define the constructor and method of the jindo.$Ajax() object
	@name Ajax.js
	@author NAVER Ajax Platform
 */

//-!jindo.$Ajax start(jindo.$Json.prototype.toString,jindo.$Fn.prototype.bind)!-//
/**
	$Ajax The jindo.$Ajax() object provides a method for easily implementing Ajax requests and responses in a variety of development environments.
	
	@class jindo.$Ajax
	@keyword ajax
 */
/**
	The jindo.$Ajax() object supports asynchronous communication between a server and a browser, namely the Ajax communication. The jindo.$Ajax() object provides many different methods of communicating with other domains as well as the default method using the XHR object (XMLHTTPRequest).
	
	@constructor
	@param {String+} sUrl URL value for Ajax request.
	@param {Hash+} oOption Set options for $Ajax() object. (ex. callbacks, Ajax types, etc.)
		@param {String} [oOption.type="xhr"] Ajax request type.
			@param {String} [oOption.type."xhr"] Use browser's native XMLHttpRequest object to proceed Ajax call.
					<ul>
						<li>text, xml, json 형식의 응답 데이터를 처리할 수 있다. </li>
						<li>요청 실패 시 HTTP 응답 코드를 통해 원인 파악이 가능하다.</li>
						<li>2.1.0 버전 이상에서는 크로스 도메인이 아닌 xhr의 경우 헤더에 "X-Requested-With" : "XMLHttpRequest"을 포함함. </li>
						<li>단, 크로스 도메인(Cross-Domain) 상황에서 사용할 수 없다.</li>
						<li>2.1.0 버전 이상은 모바일에서 가능. 반드시 서버설정이 필요. (자세한 사용법은 <auidoc:see content="http://devcafe.nhncorp.com/ajaxui/board_5/574863">devcafe</auidoc:see>를 참고)</li>
					</ul>
			@param {String} oOption.type."iframe" iframe 요소를 프록시로 사용하여 Ajax 요청을 처리한다.
					<ul>
						<li>크로스 도메인 상황에서 사용할 수 있다.</li>
						<li>iframe 요청 방식은 다음과 같이 동작한다.
							<ol class="decimal">
								<li>로컬(요청 하는 쪽)과 원격(요청 받는 쪽)에 모두 프록시용 HTML 파일을 만든다.</li>
								<li>로컬 프록시에서 원격 프록시로 데이터를 요청한다.</li>
								<li>원격 프록시가 원격 도메인에 XHR 방식으로 다시 Ajax 요청한다.</li>
								<li>응답을 받은 원격 프록시에서 로컬 프록시로 데이터를 전달한다.</li>
								<li>로컬 프록시에서 최종적으로 콜백 함수(onload)를 호출하여 처리한다.</li>
							</ol>
						</li>
						<li>로컬 프록시 파일과 원격 프록시 파일은 다음과 같이 작성할 수 있다.
							<ul>
								<li>원격 프록시 파일 : ajax_remote_callback.html</li>
								<li>로컬 프록시 파일 : ajax_local_callback.html</li>
							</ul>
						</li>
						<li>iframe 요소를 사용한 방식은 인터넷 익스플로러에서 "딱딱"하는 페이지 이동음이 발생할 수 있다. (요청당 2회)</li>
					</ul>
			@param {String} oOption.type."jsonp" JSON 형식과 &lt;script&gt; 태그를 사용하여 사용하여 Ajax 요청을 처리한다.
					<ul>
						<li>크로스 도메인 상황에서 사용할 수 있다.</li>
						<li>jsonp 요청 방식은 다음과 같이 동작한다.
							<ol class="decimal">
								<li>&lt;script&gt; 태그를 동적으로 생성한다. 이때 요청할 원격 페이지를 src 속성으로 입력하여 GET 방식으로 요청을 전송한다.</li>
								<li>요청 시에 콜백 함수를 매개 변수로 넘기면, 원격 페이지에서 전달받은 콜백 함수명으로 아래와 같이 응답을 보낸다.
									<ul>
										<li>function_name(...결과 값...)</li>
									</ul>
								</li>
								<li>응답은 콜백 함수(onload)에서 처리된다.</li>
							</ol>
						</li>
						<li>GET 방식만 가능하므로, 전송 데이터의 길이는 URL에서 허용하는 길이로 제한된다.</li>
					</ul>
			@param {String} oOption.type."flash" 플래시 객체를 사용하여 Ajax 요청을 처리한다.
					<ul>
						<li>크로스 도메인 상황에서 사용할 수 있다.</li>
						<li>이 방식을 사용할 때 원격 서버의 웹 루트 디렉터리에 crossdomain.xml 파일이 존재해야 하며 해당 파일에 접근 권한이 설정되어 있어야 한다.</li>
						<li>모든 통신은 플래시 객체를 통하여 주고 받으며 Ajax 요청을 시도하기 전에 반드시 플래시 객체를 초기화해야 한다.</li>
						<li>$Ajax.SWFRequest.write() 메서드를 사용하여 플래시 객체를 초기화하며 해당 메서드는 &lt;body&gt; 요소 안에 작성한다.</li>
						<li>만약 https에서 https 쪽으로 호출할 경우 &lt;allow-access-from domain="*" secure="true" /&gt; 처럼 secure을 true로 설정해야 하며 그 이외에는 false로 설정한다.</li>
					</ul>
		@param {String} [oOption.method="post"] HTTP 요청 방식으로 post, get, put, delete 방식을 지원한다.
			@param {String} [oOption.method."post"] post 방식으로 http 요청을 전달한다.
			@param {String} oOption.method."get" get 방식으로 http 요청을 전달한다. type 속성이 "jsonp" 방식으로 지정되면 HTTP 요청 방식은 "get"으로 설정된다.
			@param {String} oOption.method."put" put 방식으로 http 요청을 전달한다. (1.4.2 버전부터 지원).
			@param {String} oOption.method."delete" delete 방식으로 http 요청을 전달한다. (1.4.2 버전부터 지원).
		@param {Number} [oOption.timeout=0] 요청 타임 아웃 시간.  (단위 초)
				<ul>
					<li>비동기 호출인 경우에만 사용 가능하다.</li>
					<li>타임 아웃 시간 안에 요청이 완료되지 않으면 Ajax 요청을 중지한다.</li>
					<li>생략하거나 기본값(0)을 지정한 경우 타임 아웃을 적용하지 않는다. </li>
				</ul>
		@param {Boolean} [oOption.withCredentials=false] when need to send cookies for crossdomain xhr request.
				<ul>
					<li>If set true, the server response must include "Access-Control-Allow-Credentials: true" header.</li>
				</ul>
		@param {Object} [oOption.data=null] Set this option when need to send FormData object data
				<ul>
				    <li><b><u>When set data value, consider :</u></b></li>
					<li>Don't set 'Content-Type' header value manually</li>
                    <li>Only available on 'POST' request, and the data parameter set in $Ajax.request() method is ignored</li>
				</ul>
		@param {Function} oOption.onload 요청이 완료되면 실행할 콜백 함수. 콜백 함수의 파라미터로 응답 객체인 <auidoc:see content="jindo.$Ajax.Response"/> 객체가 전달된다.
		@param {Function} [oOption.onerror="onload 속성에 지정한 콜백 함수"] 요청이 실패하면 실행할 콜백 함수. 생략하면 오류가 발생해도 onload 속성에 지정한 콜백 함수를 실행한다.
		@param {Function} [oOption.ontimeout=function(){}] 타임 아웃이 되었을 때 실행할 콜백 함수. 생략하면 타임 아웃 발생해도 아무런 처리를 하지 않는다.
		@param {String} oOption.proxy 로컬 프록시 파일의 경로. type 속성이 "iframe"일 때 사용.
		@param {String} [oOption.jsonp_charset="utf-8"] 요청 시 사용할 &lt;script&gt; 인코딩 방식. type 속성이 "jsonp"일 때 사용한다. (0.4.2 버전부터 지원).
		@param {String} [oOption.callbackid="랜덤한 ID"] 콜백 함수 이름에 사용할 ID.
				<ul>
					<li>type 속성이 "jsonp"일 때 사용한다. (1.3.0 버전부터 지원)</li>
					<li>jsonp 방식에서 Ajax 요청할 때 콜백 함수 이름에 랜덤한 ID 값을 덧붙여 만든 콜백 함수 이름을 서버로 전달한다. 이때 랜덤한 값을 ID로 사용하여 넘기므로 요청 URL이 매번 새롭게 생성되어 캐시 서버가 아닌 서버로 직접 데이터를 요청하게 된다. 따라서 ID 값을 지정하면 랜덤한 아이디 값으로 콜백 함수 이름을 생성하지 않으므로 캐시 서버를 사용하여 그에 대한 히트율을 높이고자 할 때 ID를 지정하여 사용할 수 있다.</li>
				</ul>
		@param {String} [oOption.callbackname="_callback"] 콜백 함수 이름. type 속성이 "jsonp"일 때 사용하며, 서버에 요청할 콜백 함수의 이름을 지정할 수 있다. (1.3.8 버전부터 지원).
		@param {Boolean} [oOption.sendheader=true] 요청 헤더를 전송할지 여부.<br>type 속성이 "flash"일 때 사용하며, 서버에서 접근 권한을 설정하는 crossdomain.xml에 allow-header가 설정되어 있지 않다면 반드시 false 로 설정해야 한다. (1.3.4 버전부터 지원).<br>
				<ul>
					<li>플래시 9에서는 allow-header가 false인 경우 get 방식으로만 ajax 통신이 가능하다.</li>
					<li>플래시 10에서는 allow-header가 false인 경우 get,post 둘다 ajax 통신이 안된다.</li>
					<li>allow-header가 설정되어 있지 않다면 반드시 false로 설정해야 한다.</li>
				</ul>
		@param {Boolean} [oOption.async=true] 비동기 호출 여부. type 속성이 "xhr"일 때 이 속성 값이 유효하다. (1.3.7 버전부터 지원).
		@param {Boolean} [oOption.decode=true] type 속성이 "flash"일 때 사용하며, 요청한 데이터 안에 utf-8 이 아닌 다른 인코딩이 되어 있을때 false 로 지정한다. (1.4.0 버전부터 지원). 
		@param {Boolean} [oOption.postBody=false] Ajax 요청 시 서버로 전달할 데이터를 Body 요소에 전달할 지의 여부.<br>
				type 속성이 "xhr"이고 method가 "get"이 아니어야 유효하며 REST 환경에서 사용된다. (1.4.2 버전부터 지원).
	@throws {jindo.$Except.REQUIRE_AJAX} The exception occurs when no ajax exists.
	@throws {jindo.$Except.CANNOT_USE_OPTION} The exception occurs when using unavailable options.
	@remark The basic initialization of the jindo.$Ajax() object is as follows:
<pre class="code "><code class="prettyprint linenums">
	// When URL is not same of current page value, will call as CORS method. XHR2 or in case of IE8,9 XDomainRequest object is used.
	var oAjax = new $Ajax('server.php', {
	    type : 'xhr',
	    method : 'get',     // GET method
	    onload : function(res){ // A callback function to be executed when request is complete
	      $('list').innerHTML = res.text();
	    },
	    timeout : 3,      // Executes ontimeout if request has not been complete in 3 seconds (0 if omitted).
	    ontimeout : function(){ // A callback function to be executed upon timeout; if 0 is specified, nothing will be processed when timeout occurs.
	      alert("Timeout!");
	    },
	    async : true      // An asynchronous call, true if omitted.
	});
	oAjax.request();
</code></pre><br>
	oOption 객체의 프로퍼티와 사용법에 대한 설명은 다음 표와 같다.<br>
		<h5>The availability of options based on types</h5>
		<table class="tbl_board">
			<caption class="hide">The availability of options based on types</caption>
			<thead>
				<th scope="col">option</th>
				<th scope="col">xhr</th>
				<th scope="col">jsonp</th>
				<th scope="col">flash</th>
				<th scope="col">iframe</th>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">method(get, post, put, delete)</td>
					<td>O</td>
					<td>get</td>
					<td>get, post</td>
					<td>iframe</td>
				</tr>
				<tr>
					<td class="txt bold">onload</td>
					<td>O</td>
					<td>O</td>
					<td>O</td>
					<td>O</td>
				</tr>
				<tr>
					<td class="txt bold">timeout</td>
					<td>O</td>
					<td>O</td>
					<td>O</td>
					<td>X</td>
				</tr>
				<tr>
					<td class="txt bold">ontimeout</td>
					<td>O</td>
					<td>O</td>
					<td>O</td>
					<td>X</td>
				</tr>
				<tr>
					<td class="txt bold">onerror</td>
					<td>O</td>
					<td>O</td>
					<td>O</td>
					<td>X</td>
				</tr>
				<tr>
					<td class="txt bold">async</td>
					<td>O</td>
					<td>X</td>
					<td>X</td>
					<td>X</td>
				</tr>
				<tr>
					<td class="txt bold">postBody</td>
					<td>Available only post, put, and delete methods</td>
					<td>X</td>
					<td>X</td>
					<td>X</td>
				</tr>
				<tr>
					<td class="txt bold">jsonp_charset</td>
					<td>X</td>
					<td>O</td>
					<td>X</td>
					<td>X</td>
				</tr>
				<tr>
					<td class="txt bold">callbackid</td>
					<td>X</td>
					<td>O</td>
					<td>X</td>
					<td>X</td>
				</tr>
				<tr>
					<td class="txt bold">callbackname</td>
					<td>X</td>
					<td>O</td>
					<td>X</td>
					<td>X</td>
				</tr>
				<tr>
					<td class="txt bold">setheader</td>
					<td>O</td>
					<td>X</td>
					<td>O</td>
					<td>X</td>
				</tr>
				<tr>
					<td class="txt bold">decode</td>
					<td>X</td>
					<td>X</td>
					<td>O</td>
					<td>X</td>
				</tr>
				<tr>
					<td class="txt bold">proxy</td>
					<td>X</td>
					<td>X</td>
					<td>X</td>
					<td>O</td>
				</tr>
				<tr>
					<td class="txt bold">withCredentials</td>
					<td>O</td>
					<td>X</td>
					<td>X</td>
					<td>X</td>
				</tr>
				<tr>
					<td class="txt bold">data</td>
					<td>O</td>
					<td>X</td>
					<td>X</td>
					<td>X</td>
				</tr>
			</tbody>
		</table>
		<h5>The availability of methods based on types</h5>
		<table class="tbl_board">
			<caption class="hide">The availability of methods based on types</caption>
			<thead>
				<th scope="col">Method</th>
				<th scope="col">xhr</th>
				<th scope="col">jsonp</th>
				<th scope="col">flash</th>
				<th scope="col">iframe</th>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">abort</td>
					<td>O</td>
					<td>O</td>
					<td>O</td>
					<td>O</td>
				</tr>
				<tr>
					<td class="txt bold">isIdle</td>
					<td>O</td>
					<td>O</td>
					<td>O</td>
					<td>O</td>
				</tr>
				<tr>
					<td class="txt bold">option</td>
					<td>O</td>
					<td>O</td>
					<td>O</td>
					<td>O</td>
				</tr>
				<tr>
					<td class="txt bold">request</td>
					<td>O</td>
					<td>O</td>
					<td>O</td>
					<td>O</td>
				</tr>
				<tr>
					<td class="txt bold">header</td>
					<td>O</td>
					<td>X</td>
					<td>O</td>
					<td>O</td>
				</tr>
			</tbody>
		</table>
	@see jindo.$Ajax.Response
	@see http://dev.naver.com/projects/jindo/wiki/cross%20domain%20ajax Cross Domain Ajax 이해
	@example
		// An example that configures a list by getting data from a server upon click of the 'Get List' button
		// (1) If server pages exist in the same domain as service pages - xhr
		
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
							method : 'get',			// GET method
							onload : function(res){	// A callback function to be executed when request is complete
								$('list').innerHTML = res.text();
							},
							timeout : 3,			// Executes ontimeout if request has not been complete in 3 seconds (0 if omitted).
							ontimeout : function(){	// A callback function to be executed upon timeout; if 0 is specified, nothing will be processed when timeout occurs.
								alert("Timeout!");
							},
							async : true			// An asynchronous call, true if omitted.
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
			echo "<li>First</li><li>Second</li><li>Third</li>";
		?>
	
	@example
		// 'Get List' 버튼 클릭 시, 서버에서 데이터를 받아와 리스트를 구성하는 예제
		// (1-1) 서버 페이지와 서비스 페이지가 다른 도메인에 있는 경우 - xhr
		
		// [http://jindo.com/client.html]
		<!DOCTYPE html>
		<html>
			<head>
				<title>Ajax Sample</title>
				<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
				<script type="text/javascript" language="javascript" src="lib/jindo.all.js"></script>
				<script type="text/javascript" language="javascript">
					function getList() {
						var oAjax = new $Ajax('http://server.com/some/server.php', {
							type : 'xhr',
							method : 'get',			// GET 방식으로 통신
							withCredentials : true, // 쿠키를 포함하여 설정
							onload : function(res){	// 요청이 완료되면 실행될 콜백 함수
								$('list').innerHTML = res.text();
							}
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
		 <?
		 	header("Access-Control-Allow-Origin: http://jindo.com"); // 크로스도메인으로 호출이 가능한 곳을 등록.
			header("Access-Control-Allow-Credentials: true"); // 쿠키를 허용할 경우.
			
			echo "<li>First</li><li>Second</li><li>Third</li>";
		?>
	
	@example
		// An example that configures a list by getting data from a server upon click of the 'Get List' button
		// (2) If server pages exist in the same domain as service pages - iframe
		
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
							method : 'get',			// GET method
													// If POST is specified, it is processed using POST method when a request is made from a remote proxy file to some.php.
							onload : function(res){	// A callback function to be executed when request is complete
								$('list').innerHTML = res.text();
							},
							// The path of a local proxy file
							// The path must be correctly specified. Any location is acceptable as long as it is a local domain path.
							// (※ A remote proxy file must be in the root directory of a remote domain server.)
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
			echo "<li>First</li><li>Second</li><li>Third</li>";
		?>
	
	@example
		// An example that configures a list by getting data from a server upon click of the 'Get List' button.
		// (3) If server pages exist in the same domain as service pages - jsonp
		
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
							method: 'get',			// If the type is jsonp, it is automatically processed as get (omittable).
							jsonp_charset: 'utf-8',	// The <script> encoding method to use upon request (utf-8 if omitted)
							onload: function(res){	// A callback function to be executed when request is complete
								var response = res.json();
								var welList = $Element('list').empty();
		
								for (var i = 0, nLen = response.length; i < nLen; i++) {
									welList.append($("<li>" + response[i] + "</li>"));
								}
							},
							callbackid: '12345',				// An ID value to use for a callback function (omittable)
							callbackname: 'ajax_callback_fn'	// The parameter name that contains a callback function name to be used in a server ('_callback' if omitted)
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
			echo $callbackName."(['First','Second','Third'])";
		?>
	
	@example
		// An example that configures a list by getting data from a server upon click of the 'Get List' button.
		// (4) If server pages exist in the same domain as service pages - flash
		
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
							method : 'get',			// GET method
							sendheader : false,		// Whether the request headers is transmitted (true if omitted)
							decode : true,			// It is set to false if the encoding in the requested data is not utf-8 (true if omitted).
							onload : function(res){	// A callback function to be executed when request is complete
								$('list').innerHTML = res.text();
							},
						});
						oAjax.request();
					}
				</script>
			</head>
			<body>
				<script type="text/javascript">
					$Ajax.SWFRequest.write("swf/ajax.swf");	// Initializes the flash object before invoking Ajax.
				</script>
				<button onclick="getList(); return false;">Get List</button>
		
				<ul id="list">
		
				</ul>
			</body>
		</html>
		
		// [http://server.com/some/some.php]
		<?php
			echo "<li>First</li><li>Second</li><li>Third</li>";
		?>


	@example
		// (5) XMLHttpRequest Level2 usage example
		// https://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html

		<!DOCTYPE html>
		<html>
			<head>
				<title>Ajax Sample</title>
				<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
				<script type="text/javascript" language="javascript" src="lib/jindo.all.js"></script>
				<script type="text/javascript" language="javascript">
					function getData(){
                        var formData = new FormData();          // create FormData
                        formData.append('username', 'John Doe');
                        formData.append('phone', 123456);

                        var oAjax = new jindo.$Ajax('attach.jpg', {
                            type : 'xhr',
                            method : 'post',                    // POST method
                            data : formData,                    // setting up FormData value(in 'data' option, only FormData value can be used)
                            onload : function(res) {
                                var oResponse = res.$value();   // get native XHR response object
                                var blob = new Blob([oResponse.response], { type: 'image/jpeg' });
                                console.log(blob);
                            }
                        });

                        oAjax.$value().repsonseType = "blob";   // set XHR's responseType to "blob"
                        oAjax.request();  // if FormData value setted on 'data' option, it can't be set parameter value in request() method
					}
				</script>
			</head>
			<body>
                ...
			</body>
		</html>
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

	var ___ajax = jindo.$Ajax, ___error = jindo.$Error, ___except = jindo.$Except;
	var oArgs = jindo._checkVarType(arguments, {
		'4str' : [ 'sURL:String+' ],
		'4obj' : [ 'sURL:String+', 'oOption:Hash+' ]
	},"$Ajax");
		
	if(oArgs+"" == "for_string"){
		oArgs.oOption = {};
	}
	
	function _getXHR(sUrl) {
        var xhr = window.XMLHttpRequest && new XMLHttpRequest();

        if(this._checkCORSUrl(this._url)) {
            if(xhr && "withCredentials" in xhr) {
                return xhr;

            // for IE8 and 9 CORS call can be used right through 'XDomainRequest' object - http://msdn.microsoft.com/en-us/library/ie/cc288060(v=vs.85).aspx
            // Limitations - http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
            } else if(window.XDomainRequest) {
                this._bXDomainRequest = true;
                return new XDomainRequest();
            }
        } else {
            if(xhr) {
                return xhr;
            } else if(window.ActiveXObject) {
                try {
                    return new ActiveXObject('MSXML2.XMLHTTP');
                }catch(e) {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                }
            }
        }

        return null;
	}

	var loc = location.toString();
	var domain = '';
	try { domain = loc.match(/^https?:\/\/([a-z0-9_\-\.]+)/i)[1]; } catch(e) {}
	
	this._status = 0;
	this._url = oArgs.sURL;
	this._headers  = {};
	this._options = {
		type: "xhr",
		method: "post",
		proxy: "",
		timeout: 0,
		onload: function(req){},
		onerror: null,
		ontimeout: function(req){},
		jsonp_charset: "utf-8",
		callbackid: "",
		callbackname: "",
		sendheader: true,
		async: true,
		decode: true,
		postBody: false,
        withCredentials: false,
        data: null
	};

	this._options = ___ajax._setProperties(oArgs.oOption,this);
	___ajax._validationOption(this._options,"$Ajax");
	
	/*
	 If possible, use easily applicable configuration objects for testing purposes.
	 */
	if(___ajax.CONFIG){
		this.option(___ajax.CONFIG);
	}

	var _opt = this._options;
	
	_opt.type   = _opt.type.toLowerCase();
	_opt.method = _opt.method.toLowerCase();

	if (window["__"+jindo._p_.jindoName+"_callback"] === undefined) {
		window["__"+jindo._p_.jindoName+"_callback"] = [];
		// JINDOSUS-1412
		window["__"+jindo._p_.jindoName+"2_callback"] = [];
	}

	var t = this;
	switch (_opt.type) {
		case "put":
		case "delete":
		case "get":
		case "post":
			_opt.method = _opt.type;
            // 'break' statement was intentionally omitted.
		case "xhr":
			//-@@$Ajax.xhr-@@//
			this._request = _getXHR.call(this);
        	this._checkCORS(this._url,_opt.type,"");
			break;
		case "flash":
			//-@@$Ajax.flash-@@//
			if(!___ajax.SWFRequest) throw new ___error(jindo._p_.jindoName+'.$Ajax.SWFRequest'+___except.REQUIRE_AJAX, "$Ajax");
			
			this._request = new ___ajax.SWFRequest( function(name,value){return t.option.apply(t, arguments);} );
			break;
		case "jsonp":
			//-@@$Ajax.jsonp-@@//
			if(!___ajax.JSONPRequest) throw new ___error(jindo._p_.jindoName+'.$Ajax.JSONPRequest'+___except.REQUIRE_AJAX, "$Ajax");
			this._request = new ___ajax.JSONPRequest( function(name,value){return t.option.apply(t, arguments);} );
			break;
		case "iframe":
			//-@@$Ajax.iframe-@@//
			if(!___ajax.FrameRequest) throw new ___error(jindo._p_.jindoName+'.$Ajax.FrameRequest'+___except.REQUIRE_AJAX, "$Ajax");
			this._request = new ___ajax.FrameRequest( function(name,value){return t.option.apply(t, arguments);} );
	}
};

jindo.$Ajax.prototype._checkCORSUrl = function (sUrl) {
    return /^http/.test(sUrl) && !new RegExp("^https?://"+ window.location.host, "i").test(sUrl);
};

jindo.$Ajax.prototype._checkCORS = function(sUrl,sType,sMethod){
	this._bCORS = false;

	if(this._checkCORSUrl(sUrl) && sType === "xhr") {
		if(this._request && (this._bXDomainRequest || "withCredentials" in this._request)) {
		    this._bCORS = true;
		} else {
			throw new jindo.$Error(jindo.$Except.NOT_SUPPORT_CORS, "$Ajax"+sMethod);
		}
	}
};

jindo.$Ajax._setProperties = function (option, context){
	option = option||{};
	var type;
	if((option.type=="put"||option.type=="delete"||option.type=="get"||option.type=="post")&&!option.method){
	    option.method = option.type;
	    type = option.type = "xhr";
	}
	
	type = option.type = (option.type||"xhr");
	option.onload = jindo.$Fn(option.onload||function(){},context).bind();
	option.method = option.method ||"post";
	if(type != "iframe"){
		option.timeout = option.timeout||0;
		option.ontimeout = jindo.$Fn(option.ontimeout||function(){},context).bind();
		option.onerror = jindo.$Fn(option.onerror||function(){},context).bind();
	}
	if(type == "xhr"){
		option.async = option.async === undefined?true:option.async;
		option.postBody = option.postBody === undefined?false:option.postBody;
        option.withCredentials = option.withCredentials === undefined?false:option.withCredentials;
	}else if(type == "jsonp"){
		option.method = "get";
		option.jsonp_charset = option.jsonp_charset ||"utf-8";
		option.callbackid = option.callbackid ||"";
		option.callbackname = option.callbackname ||"";
	}else if(type == "flash"){
		option.sendheader =  option.sendheader === undefined ? true : option.sendheader;
		option.decode =  option.decode === undefined ? true : option.decode;
	}else if(type == "iframe"){
		option.proxy = option.proxy||"";
	}
	return option;
};

jindo.$Ajax._validationOption = function(oOption,sMethod){
	var ___except = jindo.$Except;
	var sType = oOption.type;
	if(sType === "jsonp"){
		if(oOption["method"] !== "get") jindo.$Jindo._warn(___except.CANNOT_USE_OPTION+"\n\t"+sMethod+"-method="+oOption["method"]);
	}else if(sType === "flash"){
		if(!(oOption["method"] === "get" || oOption["method"] === "post")) jindo.$Jindo._warn(___except.CANNOT_USE_OPTION+"\n\t"+sMethod+"-method="+oOption["method"]);
	}else if(sType === "xhr") {
         if(oOption["data"] && oOption["data"].constructor !== window.FormData) jindo.$Jindo._warn(___except.CANNOT_USE_OPTION+"\n\t"+sMethod+"-data="+oOption["data"]);
	}
	
	if(oOption["postBody"]){
		if(!(sType === "xhr" && (oOption["method"]!=="get"))){
			jindo.$Jindo._warn(___except.CANNOT_USE_OPTION+"\n\t"+oOption["method"]+"-postBody="+oOption["postBody"]);
		}
	}

	var oTypeProperty = {
			"xhr": "onload|timeout|ontimeout|onerror|async|method|postBody|type|withCredentials|data",
			"jsonp": "onload|timeout|ontimeout|onerror|jsonp_charset|callbackid|callbackname|method|type",
			"flash": "onload|timeout|ontimeout|onerror|sendheader|decode|method|type",
			"iframe": "onload|proxy|method|type"
	}, aName = [], i = 0;

    for(var x in oOption) { aName[i++] = x; }
	var sProperty = oTypeProperty[sType] || "";
	
	for(var i = 0 ,l = aName.length; i < l ; i++){
		if(sProperty.indexOf(aName[i]) == -1) jindo.$Jindo._warn(___except.CANNOT_USE_OPTION+"\n\t"+sType+"-"+aName[i]);
	}
};
/**
 * @ignore
 */
jindo.$Ajax.prototype._onload = (function(isIE) {
	var ___ajax = jindo.$Ajax;
	var cache = jindo.$Jindo;

	if(isIE){
		return function() {
			var status = this._request.status;
			var bSuccess = this._request.readyState == 4 &&  (status == 200||status == 0) || (this._bXDomainRequest && !!this._request.responseText);
			var oResult;
			if (this._request.readyState == 4 || this._bXDomainRequest) {
				try {
						if ((!bSuccess) && cache.isFunction(this._options.onerror)){
							this._options.onerror(new ___ajax.Response(this._request));
						}else{
							if(!this._is_abort){
								oResult = this._options.onload(new ___ajax.Response(this._request));	
							}
						} 
				}catch(e){
					throw e;
				}finally{
					if(cache.isFunction(this._oncompleted)){
						this._oncompleted(bSuccess, oResult);
					}
					if (this._options.type == "xhr" ){
						this.abort();
						try { delete this._request.onload; } catch(e) { this._request.onload =undefined;} 
					}
					this._request.onreadystatechange && delete this._request.onreadystatechange;
					
				}
			}
		};
	}else{
		return function() {
			var status = this._request.status;
			var bSuccess = this._request.readyState == 4 &&  (status == 200||status == 0);
			var oResult;
			if (this._request.readyState == 4) {
				try {
				  		
						if ((!bSuccess) && cache.isFunction(this._options.onerror)){
							this._options.onerror(new ___ajax.Response(this._request));
						}else{
							oResult = this._options.onload(new ___ajax.Response(this._request));
						} 
				}catch(e){
					throw e;
				}finally{
					this._status--;
					if(cache.isFunction(this._oncompleted)){
						this._oncompleted(bSuccess, oResult);
					} 
				}
			}
		};
	}
})(jindo._p_._JINDO_IS_IE);


/**
	The request() method transfers Ajax requests to a server. The parameter to be used for making a request can be set in the jindo.$Ajax() object constructor or by using the option() method. 
	If request type is "flash," the <auidoc:see content="jindo.$Ajax.SWFRequest#write"/>() method must be executed in the body element before this method is executed.
	
	@method request
	@syntax oData
	@syntax oData2
	@param {String+} [oData] Data to be sent to the server (available only when the postbody is not "true," the type is not "xhr", the method is not "get" and when not using 'data' option for FormData request)
	@param {Hash+} oData2 Data to be sent to the server
	@return {this} 인스턴스 자신
	@see jindo.$Ajax#option
	@see jindo.$Ajax.SWFRequest#write
	@example
		var ajax = $Ajax("http://www.remote.com", {
		   onload : function(res) {
		      // onload handler
		   }
		});
		
		ajax.request( {key1:"value1", key2:"value2"} );	// Passes the data to be sent to a server in a parameter.
		ajax.request( );
	
	@example
		var ajax2 = $Ajax("http://www.remote.com", {
		   type : "xhr",
		   method : "post",
		   postBody : true
		});
		
		ajax2.request({key1:"value1", key2:"value2"});
		ajax2.request("{key1:\"value1\", key2:\"value2\"}");
 */
jindo.$Ajax.prototype.request = function(oData) {
	var cache = jindo.$Jindo;
	var oArgs = cache.checkVarType(arguments, {
		'4voi' : [ ],
		'4obj' : [ cache._F('oData:Hash+') ],
		'4str' : [ 'sData:String+' ]
	},"$Ajax#request");
	
	this._status++;
	var t   = this;
	var req = this._request;
	var opt = this._options;
	var v,a = [], data = "", bFormData = false;
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
						if (cache.isFunction(v)) v = v();
						
						if (cache.isArray(v) || (jindo.$A && v instanceof jindo.$A)) {
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
	 For the request of the XHR GET method, adds parameters to URL.
	 */
	if(data && sUpType=="XHR" && sUpMethod=="GET") {
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

	if(sUpType=="XHR"&&sUpMethod=="POST") {
        /*
         If it used FormData object as value of data option, then set data value using FormData object.
         */
		if(opt.data && opt.data.constructor === window.FormData) {
	        data = opt.data;
	        bFormData = true;
    	}

	    if(req.setRequestHeader){
            /*
             For xhr, IE conducts cache by itself in a browser when sending to GET to disable cache modification.
             */
            req.setRequestHeader("If-Modified-Since", "Thu, 1 Jan 1970 00:00:00 GMT");
		}
	}

	if ((sUpType=="XHR"||sUpType=="IFRAME"||(sUpType=="FLASH"&&opt.sendheader)) && req.setRequestHeader) {
		if(!this._headers["Content-Type"] && !bFormData){
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
		}
		req.setRequestHeader("charset", "utf-8");
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
	if(req.addEventListener&&!jindo._p_._JINDO_IS_OP&&!jindo._p_._JINDO_IS_IE){
		/*
		  * Although addEventListener has been implemented in XMLHttpRequest in Opera version 10.60, it does not function as expected. As a result, only dom1 is supported in Opera.
 * IE 9 also has the same problem as opera.
		 */
		if(this._loadFunc){ req.removeEventListener("load", this._loadFunc, false); }
		this._loadFunc = function(rq){ 
			clearTimeout(_timer);
			_timer = undefined; 
			t._onload(rq); 
		};
		req.addEventListener("load", this._loadFunc, false);
	}else{
		if (req.onload !== undefined) {
			req.onload = function(rq){
				if((req.readyState == 4 || t._bXDomainRequest) && !t._is_abort){
					clearTimeout(_timer); 
					_timer = undefined;
					t._onload(rq);
				}
			};
		} else {
            /*
             * The timeout event does not occur in IE 6 because of onreadystatechange being synchronously executed.
 * Therefore, it should be modified to check intervals so that timeout events would normally occur. When and only when it is asynchronous:
             */
            var iePattern = jindo._p_._j_ag.match(/(?:MSIE) ([0-9.]+)/);
			if(iePattern&&iePattern[1]==6&&opt.async){
				var onreadystatechange = function(rq){
					if(req.readyState == 4 && !t._is_abort){
						if(_timer){
							clearTimeout(_timer);
							_timer = undefined;
						}
						t._onload(rq);
						clearInterval(t._interval);
						t._interval = undefined;
					}
				};
				this._interval = setInterval(onreadystatechange,300);

			}else{
				req.onreadystatechange = function(rq){
					if(req.readyState == 4){
						clearTimeout(_timer); 
						_timer = undefined;
						t._onload(rq);
					}
				};
			}
		}
	}

	if (opt.timeout > 0) {
		if(this._timer) clearTimeout(this._timer);
		
		_timer = setTimeout(function(){
			t._is_abort = true;
			if(t._interval){
				clearInterval(t._interval);
				t._interval = undefined;
			}
			try { req.abort(); } catch(e){}

			opt.ontimeout(req);	
			if(cache.isFunction(t._oncompleted)) t._oncompleted(false);
		}, opt.timeout * 1000 );

		this._timer = _timer;
	}
	/*
	 * A url for testing
	 */
	this._test_url = url;
	req.send(data);

	return this;
};

/**
	The isIdle() method checks whether an jindo.$Ajax() object request is currently idle.
	
	@method isIdle
	@return {Boolean} eturns true if it is idle; others returns false.
	@since 1.3.5
	@example
		var ajax = $Ajax("http://www.remote.com",{
		     onload : function(res){
		         // onload handler
		     }
		});
		
		if(ajax.isIdle()) ajax.request();
 */
jindo.$Ajax.prototype.isIdle = function(){
	return this._status==0;
};

/**
	The abort() method cancels an Ajax request that has been sent to a server. It is used when the response time of an Ajax request is prolonged, or when an Ajax request must be forcibly cancelled.
	
	@method abort
	@remark If the @caution type is "jsonp," the request is not stopped even when the abort is used.
	@return {this} 전송을 취소한 인스턴스 자신
	@example
		var ajax = $Ajax("http://www.remote.com", {
			timeout : 3,
			ontimeout : function() {
				stopRequest();
			}
			onload : function(res) {
				// onload handler
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
	The url() method returns the url.
	
	@method url
	@return {String} The URL value
	@since 2.0.0
 */
/**
	The url() method changes the url.
	
	@method url
	@param {String+} url
	@return {this} 인스턴스 자신
	@since 2.0.0
 */
jindo.$Ajax.prototype.url = function(sURL){
	var oArgs = jindo._checkVarType(arguments, {
		'g' : [ ],
		's' : [ 'sURL:String+' ]
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
	The option() method getsthe information about the Ajax request options defined in the option object (oOption) attribute of the jindo.$Ajax() object.
	
	@method option
	@param {String+} sName The name of the attribute of the option object
	@return {Variant} The value corresponding to the option
	@throws {jindo.$Except.CANNOT_USE_OPTION} The exception occurs when given option is inappropriate for the type.
 */
/**
	The option() method sets the information about the Ajax request options defined in the option object (oOption) attribute of the jindo.$Ajax() object. To configure the Ajax request option, enter the name and the value directly or enter an object which has the name and value as an element as a parameter. One or more pieces of information can be configured simultaneously when entering an object that has a name and a value as elements.
	
	@method option
	@syntax sName, vValue
	@syntax oOption
	@param {String+} sName The name of the attribute of the option object
	@param {Variant} vValue The new value of the option attribute to be set
	@param {Hash+} oOption The object of which attribute value is defined
	@return {this} 인스턴스 자신
	@throws {jindo.$Except.CANNOT_USE_OPTION} The exception occurs when given option is inappropriate for the type.
	@example
		var ajax = $Ajax("http://www.remote.com", {
			type : "xhr",
			method : "get",
			onload : function(res) {
				// onload handler
			}
		});
		
		var request_type = ajax.option("type");					// Returns xhr, a type.
		ajax.option("method", "post");							// Configures method to post.
		ajax.option( { timeout : 0, onload : handler_func } );	// Configures timeout to 0 and onload to handler_func.
 */
jindo.$Ajax.prototype.option = function(name, value) {
	var oArgs = jindo._checkVarType(arguments, {
		's4var' : [ 'sKey:String+', 'vValue:Variant' ],
		's4obj' : [ 'oOption:Hash+'],
		'g' : [ 'sKey:String+']
	},"$Ajax#option");
	
	switch(oArgs+"") {
		case "s4var":
			oArgs.oOption = {};
			oArgs.oOption[oArgs.sKey] = oArgs.vValue;
			// 'break' statement was intentionally omitted.
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
			}catch (e) {}
			break;
		case 'g':
			return this._options[oArgs.sKey];
			
	}
	this._checkCORS(this._url,this._options.type,"#option");
	jindo.$Ajax._validationOption(this._options,"$Ajax#option");

	return this;
};

/**
	header() 메서드는 Ajax 요청에서 사용할 HTTP 요청 헤더를 가져온다. 헤더에서 특정 속성 값을 가져오려면 속성의 이름을 파라미터로 입력한다.
	
	@method header
	@param {String+} vName Header name
	@return {String} Returns a string.
	@example
		var customheader = ajax.header("myHeader"); 		// The value of myHeader in the HTTP request header
 */
/**
	header() 메서드는 Ajax 요청에서 사용할 HTTP 요청 헤더를 설정한다. 헤더를 설정하려면 헤더의 이름과 값을 각각 파라미터로 입력하거나 헤더의 이름과 값을 원소로 가지는 객체를 파라미터로 입력한다. 객체를 파라미터로 입력하면 하나 이상의 헤더를 한 번에 설정할 수 있다.<br>
    (* On IE8, 9 CORS request using XDomainRequest object can not be used this method due to XDomainRequest object does not have any method to set request header value.)
	
	@method header
	@syntax sName, sValue
	@syntax oHeader
	@param {String+} sName Header name
	@param {String+} sValue The header value to be set
	@param {Hash+} oHeader The object in which one or more header values are defined
	@return {this} The instance its self, which header value is setted up
	@throws {jindo.$Except.CANNOT_USE_OPTION} exception occurs when using the header method for jsonp type.
	@example
		ajax.header( "myHeader", "someValue" );				// Sets the myHeader of the HTTP request header to someValue.
		ajax.header( { anotherHeader : "someValue2" } );	// Sets the anotherHeader of the HTTP request header to someValue2.
 */
jindo.$Ajax.prototype.header = function(name, value) {
	if(this._options["type"]==="jsonp" || this._bXDomainRequest){jindo.$Jindo._warn(jindo.$Except.CANNOT_USE_HEADER);}
	
	var oArgs = jindo._checkVarType(arguments, {
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
			} catch(e) {}
			break;
		case 'g':
			return this._headers[oArgs.sKey];
			
	}

	return this;
};

/**
	$value() return native XHR object

	@method $value
	@return {Object} Native XHR object wrapped by jindo.$Ajax()
	@see jindo.$Ajax
	@example
		var oAjax = new $Ajax("http://www.some.com/api.json");
		oAjax.$value(); // Native XHR object
 */
jindo.$Ajax.prototype.$value = function() {
    //-@@$Ajax.$value-@@//
    return this._request;
};

/**
	Creates the jindo.$Ajax.Response() object. The jindo.$Ajax.Response() object is created after the jindo.$Ajax() object has completed handling the request of the request() method. When the jindo.$Ajax() object is created, the jindo.$Ajax.Response() object is sent as a parameter of the callback function set in the onload attribute.

	@class jindo.$Ajax.Response
	@keyword ajaxresponse, ajax, response
 */
/**
	Provides useful functionalities to get or use the response data by wrapping the Ajax response object.
	
	@constructor
	@param {Hash+} oReq Request object
	@see jindo.$Ajax
 */
jindo.$Ajax.Response  = function(req) {
	this._response = req;
	this._regSheild = /^for\(;;\);/;
};

/**
{{response_desc}}
 */
/**
/**
	xml() method returns the response in an XML object. It is similar to the responseXML attribute of XHR.xml().
	
	@method xml
	@return {Object} A response XML object 
	@see https://developer.mozilla.org/en/XMLHttpRequest XMLHttpRequest - MDN Docs
	@example
		// some.xml
		<data>
			<li>First</li>
			<li>Second</li>
			<li>Third</li>
		</data>
		
		// client.html
		var oAjax = new $Ajax('some.xml', {
			type : 'xhr',
			method : 'get',
			onload : function(res){
				var elData = cssquery.getSingle('data', res.xml());	// Returns the response in an XML object.
				$('list').innerHTML = elData.firstChild.nodeValue;
			},
		}).request();
 */
jindo.$Ajax.Response.prototype.xml = function() {
	return this._response.responseXML;
};

/**
	The text() method returns a response in a string It is similar to the responseText of XHR.
	
	@method text
	@return {String} A response character string
	@see https://developer.mozilla.org/en/XMLHttpRequest XMLHttpRequest - MDN Docs
	@example
		// some.php
		<?php
			echo "<li>First</li><li>Second</li><li>Third</li>";
		?>
		
		// client.html
		var oAjax = new $Ajax('some.xml', {
			type : 'xhr',
			method : 'get',
			onload : function(res){
				$('list').innerHTML = res.text();	// Returns the response in a character string.
			},
		}).request();
 */
jindo.$Ajax.Response.prototype.text = function() {
	return this._response.responseText.replace(this._regSheild, '');
};

/**
	The status() method returns the HTTP response code. Refer to the HTTP response code table.
	
	@method status
	@return {Numeric} A response code
	@see http://www.w3.org/Protocols/HTTP/HTRESP.html HTTP Status codes - W3C
	@example
		var oAjax = new $Ajax('some.php', {
			type : 'xhr',
			method : 'get',
			onload : function(res){
				if(res.status() == 200){	// Checks HTTP response code.
					$('list').innerHTML = res.text();
				}
			},
		}).request();
 */
jindo.$Ajax.Response.prototype.status = function() {
	var status = this._response.status;
	return status==0?200:status;
};

/**
	The readyState() method returns the response state (readyState).
	
	@method readyState
	@return {Numeric} The readyState value
		@return .0 When the request has not been initialized. (UNINITIALIZED)
		@return .1 No request has been made even though the request option has been set. (LOADING)
		@return .2 A request has been sent and being handled. The response header can be acquired in this state. (LOADED)
		@return .3 The response is being processed and partial response data is acquired. (INTERACTIVE)
		@return .4 All of the response data have been received and the communication has been completed. (COMPLETED)
	@example
		var oAjax = new $Ajax('some.php', {
			type : 'xhr',
			method : 'get',
			onload : function(res){
				if(res.readyState() == 4){	// Checks the readyState of a response.
					$('list').innerHTML = res.text();
				}
			},
		}).request();
 */
jindo.$Ajax.Response.prototype.readyState = function() {
	return this._response.readyState;
};

/**
	The json() method returns the response in a JSON object. Automatically converts the response character string into a JSON object and returns it. Returns an empty object if an error occurs during the conversion.
	
	@method json
	@return {Object} The JSON object
	@throws {jindo.$Except.PARSE_ERROR} The exception occurs when an error occurs while parsing json.
	@example
		// some.php
		<?php
			echo "['First', 'Second', 'Third']";
		?>
		
		// client.html
		var oAjax = new $Ajax('some.php', {
			type : 'xhr',
			method : 'get',
			onload : function(res){
				var welList = $Element('list').empty();
				var jsonData = res.json();	// Returns the response in a JSON object.
		
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
	The header() method retrieves the response header.
	
	@method header
	@syntax sName
	@param {String+} [sName] The name of the response header to be retrieved. Returns the entire header if no parameter is entered.
	@return {String | Object} Returns the corresponding header value (String) or the entire header (Object)

	@example
		var oAjax = new $Ajax('some.php', {
			type : 'xhr',
			method : 'get',
			onload : function(res){
				res.header("Content-Length")	// Returns the value of "Content-Length" from the response header.
			},
		}).request();
 */
jindo.$Ajax.Response.prototype.header = function(name) {
	var oArgs = jindo._checkVarType(arguments, {
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

/**
	$value() return native XHR response object.

	@method $value
	@return {Object} XHR response object which is wrapped by jindo.$Ajax.Response()
	@see jindo.$Ajax
	@example
		var oAjax = new $Ajax("http://www.some.com/api.json", {
		    onload: function(res) {
                res.$value(); // return native XHR response object
		    }).request();
 */
jindo.$Ajax.Response.prototype.$value = function() {
    //-@@$Ajax.Response.$value-@@//
    return this._response;
};
//-!jindo.$Ajax end!-//

/**
	@fileOverview A file to define the extended methods of the jindo.$Ajax() object
	@name Ajax.extend.js
	@author NAVER Ajax Platform
 */

//-!jindo.$Ajax.RequestBase start(jindo.$Class,jindo.$Ajax)!-//
/**
	A base object of an Ajax request object

	@class jindo.$Ajax.RequestBase
	@ignore
 */
/**
	It is used to create an Ajax request object as a parent object when creating an Ajax request object for each request type.
	
	@constructor
	@ignore
	@see jindo.$Ajax
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
		jindo._checkVarType(arguments, {
			'4str' : [ 'sName:String+', 'sValue:String+' ]
		},"$Ajax.RequestBase#setRequestHeader");
		this._headers[sName] = sValue;
	},
	getResponseHeader : function(sName) {
		jindo._checkVarType(arguments, {
			'4str' : [ 'sName:String+']
		},"$Ajax.RequestBase#getResponseHeader");
		return this._respHeaders[sName] || "";
	},
	getAllResponseHeaders : function() {
		return this._respHeaderString;
	},
	_getCallbackInfo : function() {
		var id = "";
		if(this.option("callbackid") && this.option("callbackid")!="") {
			var idx = 0;
			do {
				id = "_" + this.option("callbackid") + "_"+idx;
				idx++;
			} while (window["__"+jindo._p_.jindoName+"_callback"][id]);	
		}else{
			do {
				id = "_" + Math.floor(Math.random() * 10000);
			} while (window["__"+jindo._p_.jindoName+"_callback"][id]);
		}
		
		if(this.option("callbackname") == ""){
			this.option("callbackname","_callback");
		}
		return {callbackname:this.option("callbackname"),id:id,name:"window.__"+jindo._p_.jindoName+"_callback."+id};
	}
});
//-!jindo.$Ajax.RequestBase end!-//

//-!jindo.$Ajax.JSONPRequest start(jindo.$Class,jindo.$Ajax,jindo.$Agent.prototype.navigator,jindo.$Ajax.RequestBase)!-//
/**
	This class creates a request object of which Ajax request type is jsonp and used when creating the Ajax request object in the jindo.$Ajax() object.
	
	@class jindo.$Ajax.JSONPRequest
	@extends jindo.$Ajax.RequestBase
	@ignore
 */
/**
	Creates the jindo.$Ajax.JSONPRequest() object. The jindo.$Ajax.JSONPRequest() object extends the jindo.$Ajax.RequestBase() object.
	
	@constructor
	@ignore
	@see jindo.$Ajax
	@see jindo.$Ajax.RequestBase
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
		setTimeout(function(){ self.abort(); }, 10);
	},
	abort : function() {
		if (this._script) {
			try { 
				this._script.parentNode.removeChild(this._script); 
			}catch(e){}
		}
	},
	open  : function(method, url) {
		jindo._checkVarType(arguments, {
			'4str' : [ 'method:String+','url:String+']
		},"$Ajax.JSONPRequest#open");
		this.responseJSON = null;
		this._url = url;
	},
	send  : function(data) {
		var oArgs = jindo._checkVarType(arguments, {
			'4voi' : [],
			'4nul' : ["data:Null"],
			'4str' : ["data:String+"]
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
		window["__"+jindo._p_.jindoName+"_callback"][info.id] = function(data){
			try {
				t.readyState = 4;
				t.status = 200;
				t._callback(data);
			} finally {
				delete window["__"+jindo._p_.jindoName+"_callback"][info.id];
				delete window["__"+jindo._p_.jindoName+"2_callback"][info.id];
			}
		};
		window["__"+jindo._p_.jindoName+"2_callback"][info.id] = function(data){
		    window["__"+jindo._p_.jindoName+"_callback"][info.id](data);
		};
		
		var agent = jindo.$Agent(navigator); 
		var _loadCallback = function(){
			if (!t.responseJSON) {
				t.readyState = 4;

				// when has no response code
				t.status = 500;
				t._onerror = setTimeout(function(){t._callback(null);}, 200);
			}
		};

        // On IE11 'script.onreadystatechange' and 'script.readyState' was removed and should be replaced to 'script.onload'.
        // http://msdn.microsoft.com/en-us/library/ie/bg182625%28v=vs.85%29.aspx
		if (agent.navigator().ie && this._script.readyState) {
			this._script.onreadystatechange = function(){		
				if (this.readyState == 'loaded'){
					_loadCallback();
					this.onreadystatechange = null;
				}
			};
		} else {
			this._script.onload = 
			this._script.onerror = function(){
				_loadCallback();
				this.onerror = null;
				this.onload = null;
			};
		}
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

//-!jindo.$Ajax.SWFRequest start(jindo.$Class,jindo.$Ajax,jindo.$Agent.prototype.navigator,jindo.$Ajax.RequestBase)!-//
/**
 	This class creates a request object of which Ajax request type is flash and used when creating the Ajax request object in the jindo.$Ajax() object.
	
	@class jindo.$Ajax.SWFRequest
	@extends jindo.$Ajax.RequestBase
	@filter desktop
 */
/**
 	Creates the jindo.$Ajax.SWFRequest() object. The jindo.$Ajax.SWFRequest() object extends the jindo.$Ajax.RequestBase() object.
	
	@constructor
	@filter desktop
	@see jindo.$Ajax
	@see jindo.$Ajax.RequestBase
 */
jindo.$Ajax.SWFRequest = klass({
	$init  : function(fpOption){
		this.option = fpOption;
	},
	_headers : {},
	_respHeaders : {},
	_getFlashObj : function(){
		var _tmpId = jindo.$Ajax.SWFRequest._tmpId;
		var navi = jindo.$Agent(window.navigator).navigator();
		var obj;
		if (navi.ie&&navi.version==9) {
			obj = _getElementById(document,_tmpId);
		}else{
			obj = window.document[_tmpId];
		}
		return(this._getFlashObj = function(){
			return obj;
		})();
		
	},
	_callback : function(status, data, headers){
		this.readyState = 4;
        /*
          Handles that status is a Boolean value for backward compatibility.
         */

		if( jindo.$Jindo.isNumeric(status)){
			this.status = status;
		}else{
			if(status==true) this.status=200;
		}		
		if (this.status==200) {
			if (jindo.$Jindo.isString(data)) {
				try {
					this.responseText = this.option("decode")?decodeURIComponent(data):data;
					if(!this.responseText || this.responseText=="") {
						this.responseText = data;
					}	
				} catch(e) {
                    /*
                         Stores in text without decoding data if the data encoding is not uft-8.
                     */

					if(e.name == "URIError"){
						this.responseText = data;
						if(!this.responseText || this.responseText=="") {
							this.responseText = data;
						}
					}
				}
			}
            /*
             A callback code is inserted but a response header has not yet been supported in SWF.
             */
			if(jindo.$Jindo.isHash(headers)){
				this._respHeaders = headers;				
			}
		}
		
		this.onload(this);
	},
	open : function(method, url) {
		jindo._checkVarType(arguments, {
			'4str' : [ 'method:String+','url:String+']
		},"$Ajax.SWFRequest#open");
		var re  = /https?:\/\/([a-z0-9_\-\.]+)/i;

		this._url    = url;
		this._method = method;
	},
	send : function(data) {
		var cache = jindo.$Jindo;
		var oArgs = cache.checkVarType(arguments, {
			'4voi' : [],
			'4nul' : ["data:Null"],
			'4str' : ["data:String+"]
		},"$Ajax.SWFRequest#send");
		this.responseXML  = false;
		this.responseText = "";

		var t = this;
		var dat = {};
		var info = this._getCallbackInfo();
		var swf = this._getFlashObj();

		function f(arg) {
			switch(typeof arg){
				case "string":
					return '"'+arg.replace(/\\/g, '\\\\').replace(/\"/g, '\\"')+'"';
					
				case "number":
					return arg;
					
				case "object":
					var ret = "", arr = [];
					if (cache.isArray(arg)) {
						for(var i=0; i < arg.length; i++) {
							arr[i] = f(arg[i]);
						}
						ret = "["+arr.join(",")+"]";
					} else {
						for(var x in arg) {
							if(arg.hasOwnProperty(x)){
								arr[arr.length] = f(x)+":"+f(arg[x]);	
							}
						}
						ret = "{"+arr.join(",")+"}";
					}
					return ret;
				default:
					return '""';
			}
		}
		data = data?data.split("&"):[];

		var oEach, pos, key, val;
		for(var i=0; i < data.length; i++) {
			oEach = data[i]; 
			pos = oEach.indexOf("=");
			key = oEach.substring(0,pos);
			val = oEach.substring(pos+1);

			dat[key] = decodeURIComponent(val);
		}
		this._current_callback_id = info.id;
		window["__"+jindo._p_.jindoName+"_callback"][info.id] = function(success, data){
			try {
				t._callback(success, data);
			} finally {
				delete window["__"+jindo._p_.jindoName+"_callback"][info.id];
			}
		};
		
		window["__"+jindo._p_.jindoName+"2_callback"][info.id] = function(data){
            window["__"+jindo._p_.jindoName+"_callback"][info.id](data);
        };
		
		var oData = {
			url  : this._url,
			type : this._method,
			data : dat,
			charset  : "UTF-8",
			callback : info.name,
			header_json : this._headers
		};
		
		swf.requestViaFlash(f(oData));
	},
	abort : function(){
	    var info = this._getCallbackInfo();

		if(this._current_callback_id){
			window["__"+jindo._p_.jindoName+"_callback"][this._current_callback_id] = function() {
				delete window["__"+jindo._p_.jindoName+"_callback"][info.id];
				delete window["__"+jindo._p_.jindoName+"2_callback"][info.id];
			};

			window["__"+jindo._p_.jindoName+"2_callback"][this._current_callback_id] = function(data){
                window["__"+jindo._p_.jindoName+"_callback"][this._current_callback_id](data);
            };
		}
	}
}).extend(jindo.$Ajax.RequestBase);

/**
	The write() method initializes a flash object. It inserts a flash object to communicate in a document when it is called. If the request type is flash, communication is made through a flash object. Thus, the write() method must be executed once before the request method of a jindo.$Ajax() object is called and it must be written in the body element; a problem will occur if it is executed more than once.
	
	@method write
	@param {String+} [sSWFPath="./ajax.swf"] A flash file to be used in Ajax communication
	@filter desktop
	@see jindo.$Ajax#request
	@example
		<body>
		    <script type="text/javascript">
		        $Ajax.SWFRequest.write("/path/swf/ajax.swf");
		    </script>
		</body>
 */
jindo.$Ajax.SWFRequest.write = function(swf_path) {
    var oArgs = jindo.$Jindo.checkVarType(arguments, {
        '4voi' : [],
        '4str' : ["data:String+"]
    },"<static> $Ajax.SWFRequest#write");
    switch(oArgs+""){
        case "4voi":
            swf_path = "./ajax.swf";
        
    }
    var ajax = jindo.$Ajax; 
    ajax.SWFRequest._tmpId = 'tmpSwf'+(new Date()).getMilliseconds()+Math.floor(Math.random()*100000);
    var activeCallback = "jindo.$Ajax.SWFRequest.loaded";
    var protocol = (location.protocol == "https:")?"https:":"http:";
    var classid = (jindo._p_._JINDO_IS_IE?'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"':'');
    ajax._checkFlashLoad();
    
    var body = document.body;
    var nodes = body.childNodes;
    var swf = jindo.$("<div style='position:absolute;top:-1000px;left:-1000px' tabindex='-1'>/<div>");
    swf.innerHTML = '<object tabindex="-1" id="'+ajax.SWFRequest._tmpId+'" width="1" height="1" '+classid+' codebase="'+protocol+'//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"><param name="movie" value="'+swf_path+'"><param name = "FlashVars" value = "activeCallback='+activeCallback+'" /><param name = "allowScriptAccess" value = "always" /><embed tabindex="-1" name="'+ajax.SWFRequest._tmpId+'" src="'+swf_path+'" type="application/x-shockwave-flash" pluginspage="'+protocol+'://www.macromedia.com/go/getflashplayer" width="1" height="1" allowScriptAccess="always" swLiveConnect="true" FlashVars="activeCallback='+activeCallback+'"></embed></object>'; 

    if (nodes.length > 0) {
        body.insertBefore(swf, nodes[0]);
    } else {
        body.appendChild(swf);
    }    
};

/**
 * @ignore
 */
jindo.$Ajax._checkFlashLoad = function(){
	jindo.$Ajax._checkFlashKey = setTimeout(function(){
		jindo.$Ajax.SWFRequest.onerror();
	},5000);
	jindo.$Ajax._checkFlashLoad = function(){};
};
/**
	A variable to store information on whether the flash object has been loaded. Returns true if it is loaded; otherwise, returns false. It is used to check whether a flash object has been loaded.
	
	@method activeFlash
	@filter desktop
	@see jindo.$Ajax.SWFRequest#write
 */
jindo.$Ajax.SWFRequest.activeFlash = false;

/**
 * 	A function to be executed when loading flash is complete
	
	@method onload
	@filter desktop
	@since 2.0.0
	@see jindo.$Ajax.SWFRequest#onerror
	@example
		var oSWFAjax = $Ajax("http://naver.com/api/test.json",{
			"type" : "flash"
		});
	    $Ajax.SWFRequest.onload = function(){
			oSWFAjax.request();	
		}
 */
jindo.$Ajax.SWFRequest.onload = function(){
};

/**
 * 	A function to be executed when loading flash fails
	
	@method onerror
	@filter desktop
	@see jindo.$Ajax.SWFRequest#onerror
	@since 2.0.0
	@example
		var oSWFAjax = $Ajax("http://naver.com/api/test.json",{
			"type" : "flash"
		});
        $Ajax.SWFRequest.onerror = function(){
			alert("Loadinf flash fails. Please try again.");
		}
 */
jindo.$Ajax.SWFRequest.onerror = function(){
};

/**
	A function to be executed after loading in flash
	
	@method loaded
	@filter desktop
	@ignore
 */
jindo.$Ajax.SWFRequest.loaded = function(){
	clearTimeout(jindo.$Ajax._checkFlashKey);
	jindo.$Ajax.SWFRequest.activeFlash = true;
	jindo.$Ajax.SWFRequest.onload();
};
//-!jindo.$Ajax.SWFRequest end!-//

//-!jindo.$Ajax.FrameRequest start(jindo.$Class,jindo.$Ajax,jindo.$Ajax.RequestBase)!-//
/**
	Creates a request type of which Ajax request type is iframe and used when creating the Ajax request object in the jindo.$Ajax() object.
	
	@class jindo.$Ajax.FrameRequest
	@extends jindo.$Ajax.RequestBase
	@filter desktop
	@ignore
 */
/**
	Create a jindo.$Ajax.FrameRequest() object. The jindo.$Ajax.FrameRequest() object extends the jindo.$Ajax.RequestBase() object.
	
	@constructor
	@filter desktop
	@ignore
	@see jindo.$Ajax
	@see jindo.$Ajax.RequestBase
 */
jindo.$Ajax.FrameRequest = klass({
	_headers : {},
	_respHeaders : {},
	_frame  : null,
	_domain : "",
	$init  : function(fpOption){
		this.option = fpOption;
	},
	_callback : function(id, data, header) {
		var self = this;

		this.readyState   = 4;
		this.status = 200;
		this.responseText = data;

		this._respHeaderString = header;
		header.replace(/^([\w\-]+)\s*:\s*(.+)$/m, function($0,$1,$2) {
			self._respHeaders[$1] = $2;
		});

		this.onload(this);

		setTimeout(function(){ self.abort(); }, 10);
	},
	abort : function() {
		if (this._frame) {
			try {
				this._frame.parentNode.removeChild(this._frame);
			} catch(e) {}
		}
	},
	open : function(method, url) {
		jindo._checkVarType(arguments, {
			'4str' : [ 'method:String+','url:String+']
		},"$Ajax.FrameRequest#open");
		
		var re  = /https?:\/\/([a-z0-9_\-\.]+)/i;
		var dom = document.location.toString().match(re);
		
		this._method = method;
		this._url    = url;
		this._remote = String(url).match(/(https?:\/\/[a-z0-9_\-\.]+)(:[0-9]+)?/i)[0];
		this._frame = null;
		this._domain = (dom != null && dom[1] != document.domain)?document.domain:"";
	},
	send : function(data) {
		var oArgs = jindo._checkVarType(arguments, {
			'4voi' : [],
			'4nul' : ["data:Null"],
			'4str' : ["data:String+"]
		},"$Ajax.FrameRequest#send");
		
		this.responseXML  = "";
		this.responseText = "";

		var t      = this;
		var re     = /https?:\/\/([a-z0-9_\-\.]+)/i;
		var info   = this._getCallbackInfo();
		var url;
		var _aStr = [];
		_aStr.push(this._remote+"/ajax_remote_callback.html?method="+this._method);
		var header = [];

		window["__"+jindo._p_.jindoName+"_callback"][info.id] = function(id, data, header){
			try {
				t._callback(id, data, header);
			} finally {
				delete window["__"+jindo._p_.jindoName+"_callback"][info.id];
				delete window["__"+jindo._p_.jindoName+"2_callback"][info.id];
			}
		};
		
		window["__"+jindo._p_.jindoName+"2_callback"][info.id] = function(id, data, header){
            window["__"+jindo._p_.jindoName+"_callback"][info.id](id, data, header);
        };

		for(var x in this._headers) {
			if(this._headers.hasOwnProperty(x)){
				header[header.length] = "'"+x+"':'"+this._headers[x]+"'";	
			}
			
		}

		header = "{"+header.join(",")+"}";
		
		_aStr.push("&id="+info.id);
		_aStr.push("&header="+encodeURIComponent(header));
		_aStr.push("&proxy="+encodeURIComponent(this.option("proxy")));
		_aStr.push("&domain="+this._domain);
		_aStr.push("&url="+encodeURIComponent(this._url.replace(re, "")));
		_aStr.push("#"+encodeURIComponent(data));

		var fr = this._frame = document.createElement("iframe");
		var style = fr.style;
		style.position = "absolute";
		style.visibility = "hidden";
		style.width = "1px";
		style.height = "1px";

		var body = document.body || document.documentElement;
		if (body.firstChild){ 
			body.insertBefore(fr, body.firstChild);
		}else{ 
			body.appendChild(fr);
		}
		if(typeof MSApp != "undefined"){
			MSApp.addPublicLocalApplicationUri(this.option("proxy"));
		}
		
		fr.src = _aStr.join("");
	}
}).extend(jindo.$Ajax.RequestBase);
//-!jindo.$Ajax.FrameRequest end!-//

//-!jindo.$Ajax.Queue start(jindo.$Ajax)!-//
/**
	Ajax Processes requests that are in the queue sequentially.
	
	@class jindo.$Ajax.Queue
	@keyword ajaxqueue, queue, ajax
 */
/**
	Provides a functionality that enables the jindo.$Ajax() objects to be sequentially called.
	
	@constructor
	@param {Hash+} oOption Defines information about communications being requested by the $Ajax.Queue object to a server.
		@param {Boolean} [oOption.async=false] Sets whether it is a synchronously/asynchronously requests. With asynchronous requests, the value is set to true.
		@param {Boolean} [oOption.useResultAsParam=false] Sets whether the request result previously processed to the next request as a parameter has been passed. If the request result is passed, the value is set to true.
		@param {Boolean} [oOption.stopOnFailure=false] Sets whether the next request when the previous request failed has stopped. If the next request stops, the value is set to true.
	@since 1.3.7
	@see jindo.$Ajax
	@example
		// Creates a $Ajax request queue.
		var oAjaxQueue = new $Ajax.Queue({
			useResultAsParam : true
		});
 */
jindo.$Ajax.Queue = function (option) {
	//-@@$Ajax.Queue-@@//
	var cl = arguments.callee;
	if (!(this instanceof cl)){ return new cl(option||{});}
	
	var oArgs = jindo._checkVarType(arguments, {
		'4voi' : [],
		'4obj' : ["option:Hash+"]
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
	option() 메서드는 $Ajax.Queue 객체에 설정한 옵션 값을 반환한다.
	
	@method option
	@param {String+} vName Option name
	@return {Variant} Returns the specified option.
	@see jindo.$Ajax.Queue
	@example
		oAjaxQueue.option("useResultAsParam");	// Returns true, the option value of useResultAsParam.
 */
/**
	option() 메서드는 $Ajax.Queue 객체에 지정한 옵션 값을 키와 값으로 설정한다.
	
	@method option
	@syntax sName, vValue
	@syntax oOption
	@param {String+} sName Option name (String)
	@param {Variant} [vValue] Option value. This value is allowed only if an option to be set is specified in vName.
	@param {Hash+} oOption oOption Option name (String) or an object in which one or more options are specified.
	@return {this} 지정한 옵션을 설정한 인스턴스 자신
	@see jindo.$Ajax.Queue
	@example
		var oAjaxQueue = new $Ajax.Queue({
			useResultAsParam : true
		});
		
		oAjaxQueue.option("async", true);		// Specifies the async option as true.
 */
jindo.$Ajax.Queue.prototype.option = function(name, value) {
	var oArgs = jindo._checkVarType(arguments, {
		's4str' : [ 'sKey:String+', 'sValue:Variant' ],
		's4obj' : [ 'oOption:Hash+' ],
		'g' : [ 'sKey:String+' ]
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
			}catch(e) {}
			break;
		case 'g':
			return this._options[oArgs.sKey];
	}

	return this;
};

/**
	The add() method adds the jindo.$Ajax() object to $Ajax.Queue.
	
	@method add
	@syntax oAjax, oParam
	@param {jindo.$Ajax} oAjax The jindo.$Ajax() object to be added
	@param {Hash+} [oParam] A parameter object to be sent upon Ajax request
	@return {this} 인스턴스 자신 
	@example
		var oAjax1 = new $Ajax('ajax_test.php',{
			onload :  function(res){
				// onload handler
			}
		});
		var oAjax2 = new $Ajax('ajax_test.php',{
			onload :  function(res){
				// onload handler
			}
		});
		var oAjax3 = new $Ajax('ajax_test.php',{
			onload :  function(res){
				// onload handler
			}
		
		});
		
		var oAjaxQueue = new $Ajax.Queue({
			async : true,
			useResultAsParam : true,
			stopOnFailure : false
		});
		
		// Adds the Ajax request to queue.
		oAjaxQueue.add(oAjax1);
		
		// Adds the Ajax request to queue.
		oAjaxQueue.add(oAjax1,{seq:1});
		oAjaxQueue.add(oAjax2,{seq:2,foo:99});
		oAjaxQueue.add(oAjax3,{seq:3});
		
		oAjaxQueue.request();
 */
jindo.$Ajax.Queue.prototype.add = function (oAjax, oParam) {
	var oArgs = jindo._checkVarType(arguments, {
		'4obj' : ['oAjax:Hash+'],
		'4obj2' : ['oAjax:Hash+','oPram:Hash+']
	},"$Ajax.Queue");
	switch(oArgs+""){
		case "4obj2":
			oParam = oArgs.oPram;
	}
	
	this._queue.push({obj:oAjax, param:oParam});
	return this;
};

/**
	The request() method sends the Ajax request in $Ajax.Queue to a server.
	
	@method request
	@return {this} 인스턴스 자신 
	@example
		var oAjaxQueue = new $Ajax.Queue({
			useResultAsParam : true
		});
		oAjaxQueue.add(oAjax1,{seq:1});
		oAjaxQueue.add(oAjax2,{seq:2,foo:99});
		oAjaxQueue.add(oAjax3,{seq:3});
		
		// Sends the Ajax request to a server.
		oAjaxQueue.request();
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
		try { for(var x in oParam) if(_oParam[x] === undefined && oParam.hasOwnProperty(x)) _oParam[x] = oParam[x]; } catch(e) {}
	}
	queue[nIdx].obj.request(_oParam);
};

jindo.$Ajax.Queue.prototype._requestAsync = function () {
	for( var i=0; i<this._queue.length; i++)
		this._queue[i].obj.request(this._queue[i].param||{});
};
//-!jindo.$Ajax.Queue end!-//

/**
 	@fileOverview A file to define the constructor and methods of the jindo.$H() object
	@name hash.js
	@author NAVER Ajax Platform
 */
//-!jindo.$H start!-//
/**
 	The jindo.$H() object implements hashes, enumerated arrays of keys and values, and provides various methods to handle Hash.
	
	@class jindo.$H
	@keyword hash
 */
/**
 	Creates the jindo.$H() object.
	
	@constructor
	@param {Hash+} oHashObject An object to be created as Hash
	@example
		var h = $H({one:"first", two:"second", three:"third"});
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
	
	var oArgs = jindo._checkVarType(arguments, {
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
//-!jindo.$H end!-//

//-!jindo.$H.prototype.$value start!-//
/**
 	The $value() method returns a hash as an object.
	
	@method $value
	@return {Object} An object in which a hash is stored
 */
jindo.$H.prototype.$value = function() {
	//-@@$H.$value-@@//
	return this._table;
};
//-!jindo.$H.prototype.$value end!-//

//-!jindo.$H.prototype.$ start!-//
/**
 	@description The $() method returns a value corresponding to a key.
	
	@method $
	@param {String+|Numeric} sKey Hash key
	@return {Variant} A value corresponding to a key
	@example
		var woH = $H({one:"first", two:"second", three:"third"});
		
		// In the event of returning a value
		var three = woH.$("three");
		// Result : three = "third"
 */
/**
 	The $() method sets the value of the key with the specified value.
	
	@method $
	@syntax sKey, vValue
	@syntax oKeyAndValue
	@param {String+ | Numeric} sKey Hash key
	@param {Variant} vValue A value to set
	@param {Hash+} oKeyAndValue An object consisting of key and value
	@return {this} 인스턴스 자신
	@example
		var woH = $H({one:"first", two:"second"});
		
		// In the event of setting a value
		woH.$("three", "third");
		// Result : woH => {one:"first", two:"second", three:"third"}
 */
jindo.$H.prototype.$ = function(key, value) {
	//-@@$H.$-@@//
	var oArgs = jindo._checkVarType(arguments, {
		's4var' : [ jindo.$Jindo._F('key:String+'), 'value:Variant' ],
		's4var2' : [ 'key:Numeric', 'value:Variant' ],
		'g4str' : [ 'key:String+' ],
		's4obj' : [ 'oObj:Hash+'],
		'g4num' : [ 'key:Numeric' ]
	},"$H#$");
	
	switch(oArgs+""){
		case "s4var":
		case "s4var2":
			this._table[key] = value;
			return this;
		case "s4obj":
			var obj = oArgs.oObj;
			for(var i in obj){
			    if(obj.hasOwnProperty(i)){
    				this._table[i] = obj[i];
			    }
			}
			return this;
		default:
			return this._table[key];
	}
	
};
//-!jindo.$H.prototype.$ end!-//

//-!jindo.$H.prototype.length start!-//
/**
 	The length() method returns the size of the hash object.
	
	@method length
	@return {Numeric} Hash size
	@example
		var woH = $H({one:"first", two:"second"});
		woH.length(); // Result : 2
 */
jindo.$H.prototype.length = function() {
	//-@@$H.length-@@//
	var index = 0;
	var sortedIndex = this["__jindo_sorted_index"];
	if(sortedIndex){
	    return sortedIndex.length;
	}else{
    	for(var k in this._table) {
    		if(this._table.hasOwnProperty(k)){
    			if (Object.prototype[k] !== undefined && Object.prototype[k] === this._table[k]) continue;
    			index++;
    		}
    	}
    
	}
	return index;
};
//-!jindo.$H.prototype.length end!-//

//-!jindo.$H.prototype.forEach start(jindo.$H.Break,jindo.$H.Continue)!-//
/**
 	The forEach() method executes the callback function while traversing all the elements of hash. At this time, the key and value of the hash object and the original hash object are entered as parameters of the callback function. Its behavior is similar to that of the forEach() method of the jindo.$A() object. $H.Break() and $H.Continue() are available.
	
	@method forEach
	@param {Function+} fCallback The callback function to be executed while traversing the hash. The callback function has key, value, and object as its parameters.<br>
		<ul class="disc">
			<li>The value represents the value of an element.</li>
			<li>The key represents the key of an element.</li>
			<li>The object represents the hash itself.</li>
		</ul>
	@param {Variant} [oThis] An object that will be used as the execution context of the this keyword in the callback function when the callback function is the method of the object
	@return {this} 인스턴스 자신
	@see jindo.$H#map
	@see jindo.$H#filter
	@see jindo.$A#forEach
	@example
		function printIt(value, key, object) {
		   document.write(key+" => "+value+" <br>");
		}
		$H({one:"first", two:"second", three:"third"}).forEach(printIt);
 */
jindo.$H.prototype.forEach = function(callback, scopeObject) {
	//-@@$H.forEach-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4fun' : [ 'callback:Function+'],
		'4obj' : [ 'callback:Function+', "thisObject:Variant"]
	},"$H#forEach");
	var t = this._table;
	var h = this.constructor;
	var sortedIndex = this["__jindo_sorted_index"];
	
	if(sortedIndex){
	    for(var i = 0, l = sortedIndex.length; i < l ; i++){
	        
	        try {
	            var k = sortedIndex[i];
                callback.call(scopeObject||this, t[k], k, t);
            } catch(e) {
                if (e instanceof h.Break) break;
                if (e instanceof h.Continue) continue;
                throw e;
            }
	    }
	}else{
    	for(var k in t) {
    		if (t.hasOwnProperty(k)) {
    			if (!t.propertyIsEnumerable(k)){
    			    continue;
    			}
    			try {
                    callback.call(scopeObject||this, t[k], k, t);
                } catch(e) {
                    if (e instanceof h.Break) break;
                    if (e instanceof h.Continue) continue;
                    throw e;
                }
    		}
    	}
	}
	
	return this;
};
//-!jindo.$H.prototype.forEach end!-//

//-!jindo.$H.prototype.filter start(jindo.$H.prototype.forEach)!-//
/**
 	The filter() method executes the callback function while traversing all elements of the hash, collects the elements for which the callback function returns true, and returns a new jindo.$H() object. Its behavior is similar to that of the filter() method of the jindo.$A() object. $H.Break() and $H.Continue() are available.
	
	@method filter
	@param {Function+} fCallback The callback function to be executed while traversing the hash. The callback function must return a Boolean value. The element that returns true and will becomes an element of new hash. The callback function has key, value and object as its parameters.<br>
		<ul class="disc">
			<li>The value represents the value of an element.</li>
			<li>The key represents the key of an element.</li>
			<li>The object represents the hash itself.</li>
		</ul>
	@param {Variant} [oThis] An object that will be used as the execution context of the this keyword in the callback function when the callback function is the method of the object
	@return {jindo.$H} A new jindo.$H() object that consists of elements for which the return value of the callback function is true
	@see jindo.$H#forEach
	@see jindo.$H#map
	@see jindo.$A#filter
	@example
		var ht=$H({one:"first", two:"second", three:"third"})
		
		ht.filter(function(value, key, object){
			return value.length < 5;
		})
		
		// Result
		// one:"first", three:"third"
 */
jindo.$H.prototype.filter = function(callback, thisObject) {
	//-@@$H.filter-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4fun' : [ 'callback:Function+'],
		'4obj' : [ 'callback:Function+', "thisObject:Variant"]
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
 	The map() method executes the callback function while traversing all elements of the hash and configures the result of executing the callback function to the elements of the array. Its behavior is similar to that of the map() method of the jindo.$A() object. $H.Break() and $H.Continue() are available.
	
	@method map
	@param {Function+} fCallback The callback function to be executed while traversing the hash. Resets the value that has been returned from the callback function as the value of the element. The callback function has key, value and object as its parameters.<br>
		<ul class="disc">
			<li>The value represents the value of an element.</li>
			<li>The key represents the key of an element.</li>
			<li>The object represents the hash itself.</li>
		</ul>
	@param {Variant} [oThis] An object that will be used as the execution context of the this keyword in the callback function when the callback function is the method of the object
	@return {jindo.$H} A new jindo.$H() object to which the result of executing the callback function has been applied
	@see jindo.$H#forEach
	@see jindo.$H#filter
	@see jindo.$H#map
	@example
		function callback(value, key, object) {
		   var r = key+"_"+value;
		   document.writeln (r + "<br />");
		   return r;
		}
		
		$H({one:"first", two:"second", three:"third"}).map(callback);
 */

jindo.$H.prototype.map = function(callback, thisObject) {
	//-@@$H.map-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4fun' : [ 'callback:Function+'],
		'4obj' : [ 'callback:Function+', "thisObject:Variant"]
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
 	The add() method adds a value to hash. It specifies the key to which the value will be added as a parameter. If the specified key already has a value, it changes that value to the specified one.
	
	@method add
	@param {String+ | Numeric} sKey A key to which a value will be added or changed
	@param {Variant} vValue A value to be added to the key
	@return {this} 값을 추가한 인스턴스 자신
	@see jindo.$H#remove
	@example
		var woH = $H();
		// Adds an element of which the key is 'foo' and the value is 'bar.'
		woH.add('foo', 'bar');
		
		// Changes the value of the element with the 'foo' key to 'bar2.'
		woH.add('foo', 'bar2');
 */
jindo.$H.prototype.add = function(key, value) {
	//-@@$H.add-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4str' : [ 'key:String+',"value:Variant"],
		'4num' : [ 'key:Numeric',"value:Variant"]
	},"$H#add");
	var sortedIndex = this["__jindo_sorted_index"];
    if(sortedIndex && this._table[key]==undefined ){
        this["__jindo_sorted_index"].push(key);
    }
	this._table[key] = value;

	return this;
};
//-!jindo.$H.prototype.add end!-//

//-!jindo.$H.prototype.remove start!-//
/**
 	The remove() method removes the element of the specified key. If no corresponding element exists, no execution is made.
	
	@method remove
	@param {String+ | Numeric} sKey sKey The key of the element to be removed
	@return {Variant} Removed value
	@see jindo.$H#add
	@example
		var h = $H({one:"first", two:"second", three:"third"});
		h.remove ("two");
		// A Hash table for h {one:"first", three:"third"}
 */
jindo.$H.prototype.remove = function(key) {
	//-@@$H.remove-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4str' : [ 'key:String+'],
		'4num' : [ 'key:Numeric']
	},"$H#remove");
	
	if (this._table[key] === undefined) return null;
	var val = this._table[key];
	delete this._table[key];
	
	
	var sortedIndex = this["__jindo_sorted_index"];
	if(sortedIndex){
    	var newSortedIndex = [];
    	for(var i = 0, l = sortedIndex.length ; i < l ; i++){
    	    if(sortedIndex[i] != key){
    	        newSortedIndex.push(sortedIndex[i]);
    	    }
    	}
    	this["__jindo_sorted_index"] = newSortedIndex;
	}
	return val;
};
//-!jindo.$H.prototype.remove end!-//

//-!jindo.$H.prototype.search start!-//
/**
 	The search() method returns the key of the element which has the value specified as a parameter in the hash.
	
	@method search
	@param {Variant} sValue The value to search for
	@return {Variant} The key (String) of the element that has the value. Returns false if no elements that have the specified value exist.
	@example
		var h = $H({one:"first", two:"second", three:"third"});
		h.search ("second"); // two
		h.search ("fist"); // false
 */
jindo.$H.prototype.search = function(value) {
	//-@@$H.search-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4str' : [ 'value:Variant']
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
 	The hasKey() method checks whether hash has any given key.
	
	@method hasKey
	@param {String+ | Numeric} sKey The key to search for
	@return {Boolean} Returns whether the key exists. If it exists, returns true; otherwise, returns false.
	@example
		var h = $H({one:"first", two:"second", three:"third"});
		h.hasKey("four"); // false
		h.hasKey("one"); // true
 */
jindo.$H.prototype.hasKey = function(key) {
	//-@@$H.hasKey-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4str' : [ 'key:String+'],
		'4num' : [ 'key:Numeric']
	},"$H#hasKey");
	return this._table[key] !== undefined;
};
//-!jindo.$H.prototype.hasKey end!-//

//-!jindo.$H.prototype.hasValue start(jindo.$H.prototype.search)!-//
/**
 	The hasValue() method checks whether hash has any given value.
	
	@method hasValue
	@param {Variant} vValue A value to search for the hash
	@return {Boolean} Returns whether the value exists. If it exists, returns true; otherwise, returns false.
 */
jindo.$H.prototype.hasValue = function(value) {
	//-@@$H.hasValue-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4str' : [ 'value:Variant']
	},"$H#hasValue");
	return (this.search(value) !== false);
};
//-!jindo.$H.prototype.hasValue end!-//



//-!jindo.$H.prototype.sort start(jindo.$H.prototype.search)!-//
jindo._p_.defaultSort = function(oArgs,that,type){
    var aSorted = [];
    var fpSort = oArgs.fpSort;
    for(var k in that._table) {
        if(that._table.hasOwnProperty(k)){
          (function(k,v){
            aSorted.push({
                "key" : k,
                "val" : v
            });
          })(k,that._table[k]);
        }
    }
    
    if(oArgs+"" === "vo"){
        fpSort = function (a,b){
            return a === b ? 0 : a > b ? 1 : -1;
        };
    }
    
    aSorted.sort(function(beforeVal,afterVal){
        return fpSort.call(that, beforeVal[type], afterVal[type]);
    });
    
    var sortedKey = [];
    for(var i = 0, l = aSorted.length; i < l; i++){
        sortedKey.push(aSorted[i].key);
    }
    
    return sortedKey;
};
/**
 	sort() 메서드는 값을 기준으로 해시의 원소를 오름차순 정렬한다.
	다만, 실제 값이 변경되는 것이 아니라 $H#forEach을 사용해야지만
	정렬된 결과를 사용할 수 있다.
	
	@method sort
	@param {Function} [sortFunc] 직접 정렬할 수 있도록 함수를 넣을 수 있다.
		@param {Variant} [sortFunc.preVal] 앞의 값
		@param {Variant} [sortFunc.foreVal] 뒤의 값
		
	@return {this} 원소를 정렬한 인스턴스 자신
	@see jindo.$H#ksort
	@see jindo.$H#forEach
	@example
		var h = $H({one:"하나", two:"둘", three:"셋"});
		h.sort ();
		h.forEach(function(v){
			//둘
			//셋
			//하나
		});
	@example
		var h = $H({one:"하나", two:"둘", three:"셋"});
		h.sort(function(val, val2){
			return val === val2 ? 0 : val < val2 ? 1 : -1;
		});
		h.forEach(function(v){
			//하나
			//셋
			//둘
		});
 */

jindo.$H.prototype.sort = function(fpSort) {
	//-@@$H.sort-@@//
	var oArgs = jindo._checkVarType(arguments, {
	    'vo'  : [],
        '4fp' : [ 'fpSort:Function+']
    },"$H#sort");
    
	this["__jindo_sorted_index"] = jindo._p_.defaultSort(oArgs,this,"val"); 
	return this;
};
//-!jindo.$H.prototype.sort end!-//

//-!jindo.$H.prototype.ksort start(jindo.$H.prototype.keys)!-//
/**
 	ksort() 메서드는 키를 기준으로 해시의 원소를 오름차순 정렬한다.
	다만, 실제 값이 변경되는 것이 아니라 $H#forEach을 사용해야지만
	정렬된 결과를 사용할 수 있다.
	
	@method ksort
	@param {Function} [sortFunc] 직접 정렬할 수 있도록 함수를 넣을 수 있다.
		@param {Variant} [sortFunc.preKey] 앞의 키
		@param {Variant} [sortFunc.foreKey] 뒤의 키
	@return {this} 원소를 정렬한 인스턴스 자신
	@see jindo.$H#sort
	@see jindo.$H#forEach
	@example
		var h = $H({one:"하나", two:"둘", three:"셋"});
		h.ksort ();
		h.forEach(function(v){
			//하나
			//셋
			//둘
		});
	@example
		var h = $H({one:"하나", two:"둘", three:"셋"});
		h.ksort (function(key, key2){
			return key === key2 ? 0 : key < key2 ? 1 : -1;
		});
		h.forEach(function(v){
			//둘
			//셋
			//하나
		});
 */
jindo.$H.prototype.ksort = function(fpSort) {
	//-@@$H.ksort-@@//
	var oArgs = jindo._checkVarType(arguments, {
        'vo'  : [],
        '4fp' : [ 'fpSort:Function+']
    },"$H#ksort");
    
    this["__jindo_sorted_index"] = jindo._p_.defaultSort(oArgs,this,"key");
	return this;
};
//-!jindo.$H.prototype.ksort end!-//

//-!jindo.$H.prototype.keys start!-//
/**
 	The keys() method returns an array of a hash key.
	
	@method keys
	@return {Array} An array of a hash key
	@see jindo.$H#values
	@example
		var h = $H({one:"first", two:"second", three:"third"});
		h.keys ();
		// ["one", "two", "three"]
 */
jindo.$H.prototype.keys = function() {
	//-@@$H.keys-@@//
	var keys = this["__jindo_sorted_index"];
	
	if(!keys) {
		if(Object.keys) {
			keys = Object.keys(this._table);
		} else {
			keys = [];

			for(var k in this._table) {
				if(this._table.hasOwnProperty(k))
					keys.push(k);
			}
		}
	}

	return keys;
};
//-!jindo.$H.prototype.keys end!-//

//-!jindo.$H.prototype.values start!-//
/**
 	The values() method returns an array of a hash value.
	
	@method values
	@return {Array} An array of a hash value
	@example
		var h = $H({one:"first", two:"second", three:"third"});
		h.values();
		// ["first", "second", "third"]
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
 	The toQueryString() method converts hash in the query string format.
	
	@method toQueryString
	@return {String} A query string that converts hash
	@see http://en.wikipedia.org/wiki/Querystring Query String - Wikipedia
	@example
		var h = $H({one:"first", two:"second", three:"third"});
		h.toQueryString();
		// "one=first&two=second&three=third"
 */
jindo.$H.prototype.toQueryString = function() {
	//-@@$H.toQueryString-@@//
	var buf = [], val = null, idx = 0;

	for(var k in this._table) {
		if(this._table.hasOwnProperty(k)) {
			val = this._table[k];

			if(jindo.$Jindo.isArray(val)) {
				for(var i=0; i < val.length; i++) {
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
 	The empty() method empties hash.
	
	@method empty
	@return {this} 비워진 인스턴스 자신
	@example
		var hash = $H({a:1, b:2, c:3});
		// hash => {a:1, b:2, c:3}
		
		hash.empty();
		// hash => {}
 */
jindo.$H.prototype.empty = function() {
	//-@@$H.empty-@@//
	this._table = {};
	delete this["__jindo_sorted_index"];
	
	return this;
};
//-!jindo.$H.prototype.empty end!-//

//-!jindo.$H.Break start!-//
/**
 	The Break() method stops the loop of forEach(), filter() and map() methods. This structure generates an exception internally by force, and thus it may not be operated normally if this method is executed in the "try - catch" area.
	
	@method Break
	@static
	@see jindo.$H#Continue
	@see jindo.$H#forEach
	@see jindo.$H#filter
	@see jindo.$H#map
	@example
		$H({a:1, b:2, c:3}).forEach(function(v,k,o) {
		  ...
		  if (k == "b") $H.Break();
		   ...
		});
 */
jindo.$H.Break = jindo.$Jindo.Break;
//-!jindo.$H.Break end!-//

//-!jindo.$H.Continue start!-//
/**
 	The Continue() method does not execute the rest of the commands in the loop of forEach(), filter(), and map() methods, and skips to the next loop. This structure generates an exception internally by force, and thus it may not be operated normally if this method is executed in the "try - catch" area.
	
	@method Continue
	@static
	@see jindo.$H#Break
	@see jindo.$H#forEach
	@see jindo.$H#filter
	@see jindo.$H#map
	@example
		$H({a:1, b:2, c:3}).forEach(function(v,k,o) {
		   ...
		   if (v % 2 == 0) $H.Continue();
		   ...
		});
 */
jindo.$H.Continue  = jindo.$Jindo.Continue;
//-!jindo.$H.Continue end!-//


/**
 	@fileOverview A file to define the constructor and methods of jindo.$Json() object
	@name json.js
	@author NAVER Ajax Platform
 */

//-!jindo.$Json start(jindo.$Json._oldMakeJSON)!-//
/**
 	The jindo.$Json() object provides various functionalities to handle the JavaScript Object Notation (JSON). An object or string is specified as parameters in a creator. To create the jindo.$Json() object in XML format, use the fromXML() method.
	
	@class jindo.$Json
	@keyword json
 */
/**
 	Creates the jindo.$Json() object.
	
	@constructor
	@param {Varaint} Various types
	@return {jindo.$Json} The jindo.$Json() object that encodes arguments
	@see jindo.$Json#fromXML
	@see http://www.json.org/json-en.html json.org
	@example
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
			jindo.$Jindo._maxWarn(arguments.length, 1,"$Json");
			return new cl(arguments.length?sObject:{});
		} catch(e) {
			if (e instanceof TypeError) { return null; }
			throw e;
		}
	}	
		
	jindo._checkVarType(arguments, {
		'4var' : ['oObject:Variant']
	},"$Json");
	this._object = sObject;
};
//-!jindo.$Json end!-//

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
  	The fromXML() method encodes a XML-formatted string into a jindo.$Json() object. If the XML elements contain attributes in the XML-formatted string, the content corresponding to element information is represented as subelements. At this time, if the elements contain the CDATA values, values are stored as the $cdata attribute.
	
	@static
	@method fromXML
	@param {String+} sXML The XML-formatted string
	@return {jindo.$Json} The jindo.$Json() object
	@throws {jindo.$Except.PARSE_ERROR} The exception occurs when an error occurs while parsing the json object
	@example
		var j1 = $Json.fromXML('<data>only string</data>');
		
		// Result :
		// {"data":"only string"}
		
		var j2 = $Json.fromXML('<data><id>Faqh%$</id><str attr="123">string value</str></data>');
		
		// Result :
		// {"data":{"id":"Faqh%$","str":{"attr":"123","$cdata":"string value"}}}
  */
jindo.$Json.fromXML = function(sXML) {
	//-@@$Json.fromXML-@@//
	var cache = jindo.$Jindo;
	var oArgs = cache.checkVarType(arguments, {
		'4str' : ['sXML:String+']
	},"<static> $Json#fromXML");
	var o  = {};
	var re = /\s*<(\/?[\w:\-]+)((?:\s+[\w:\-]+\s*=\s*(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'))*)\s*((?:\/>)|(?:><\/\1>|\s*))|\s*<!\[CDATA\[([\w\W]*?)\]\]>\s*|\s*>?([^<]*)/ig;
	var re2= /^[0-9]+(?:\.[0-9]+)?$/;
	var ec = {"&amp;":"&","&nbsp;":" ","&quot;":"\"","&lt;":"<","&gt;":">"};
	var fg = {tags:["/"],stack:[o]};
	var es = function(s){ 
		if (cache.isUndefined(s)) return "";
		return  s.replace(/&[a-z]+;/g, function(m){ return (cache.isString(ec[m]))?ec[m]:m; });
	};
	var at = function(s,c){s.replace(/([\w\:\-]+)\s*=\s*(?:"((?:\\"|[^"])*)"|'((?:\\'|[^'])*)')/g, function($0,$1,$2,$3){c[$1] = es(($2?$2.replace(/\\"/g,'"'):undefined)||($3?$3.replace(/\\'/g,"'"):undefined));}); };
	var em = function(o){
		for(var x in o){
			if (o.hasOwnProperty(x)) {
				if(Object.prototype[x])
					continue;
					return false;
			}
		}
		return true;
	};
	/*
	  $0: All
$1: Tag Name
$2: Attribute string
$3: Close tag
$4: CDATA body value
$5: Other body values
	 */

	var cb = function($0,$1,$2,$3,$4,$5) {
		var cur, cdata = "";
		var idx = fg.stack.length - 1;
		
		if (cache.isString($1)&& $1) {
			if ($1.substr(0,1) != "/") {
				var has_attr = (typeof $2 == "string" && $2);
				var closed   = (typeof $3 == "string" && $3);
				var newobj   = (!has_attr && closed)?"":{};

				cur = fg.stack[idx];
				
				if (cache.isUndefined(cur[$1])) {
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
		} else if (cache.isString($4) && $4) {
			cdata = $4;
		} else if (cache.isString($5) && $5) {
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
			
			if(cache.isUndefined(par)) return;
			
			if (par[tag] instanceof Array) {
				var o = par[tag];
				if (cache.isHash(o[o.length-1]) && !em(o[o.length-1])) {
					o[o.length-1].$cdata = cdata;
					o[o.length-1].toString = function(){ return cdata; };
				} else {
					o[o.length-1] = cdata;
				}
			} else {
				if (cache.isHash(par[tag])&& !em(par[tag])) {
					par[tag].$cdata = cdata;
					par[tag].toString = function(){ return cdata; };
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
 	The get() method returns the jindo.$Json() object's value corresponding to a specific path.
	
	@method get
	@param {String+} sPath A string to specify a path
	@return {Array} An array that has a value corresponding to a specified path as its element
	@throws {jindo.$Except.PARSE_ERROR} The exception occurs when an error occurs while parsing the json object
	@example
		var j = $Json.fromXML('<data><id>Faqh%$</id><str attr="123">string value</str></data>');
		var r = j.get ("/data/id");
		
		// Result :
		// [Faqh%$]
 */
jindo.$Json.prototype.get = function(sPath) {
	//-@@$Json.get-@@//
	var cache = jindo.$Jindo;
	var oArgs = cache.checkVarType(arguments, {
		'4str' : ['sPath:String+']
	},"$Json#get");
	var o = jindo.$Json._oldMakeJSON(this._object,"$Json#get");
	if(!(cache.isHash(o)||cache.isArray(o))){
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
				if (cache.isUndefined(e)) continue;
				if (cache.isArray(e)) {
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
 	The toString() method returns the jindo.$Json() object as a JSON string.
	
	@method toString
	@return {String} A JSON string
	@see jindo.$Json#toObject
	@see jindo.$Json#toXML
	@see http://www.json.org/json-en.html json.org
	@example
		var j = $Json({foo:1, bar: 31});
		document.write (j.toString());
		document.write (j);
		
		// Result :
		// {"bar":31,"foo":1}{"bar":31,"foo":1} 
 */
jindo.$Json.prototype.toString = function() {
	//-@@$Json.toString-@@//
    return jindo.$Json._oldToString(this._object);

};
//-!jindo.$Json.prototype.toString end!-//

//-!jindo.$Json._oldToString.hidden start(jindo.$H.prototype.ksort)!-//
jindo.$Json._oldToString = function(oObj){
	var cache = jindo.$Jindo;
	var func = {
		$ : function($) {
			if (cache.isNull($)||!cache.isString($)&&$==Infinity) return "null";
			if (cache.isFunction($)) return undefined;
			if (cache.isUndefined($)) return undefined;
			if (cache.isBoolean($)) return $?"true":"false";
			if (cache.isString($)) return this.s($);
			if (cache.isNumeric($)) return $;
			if (cache.isArray($)) return this.a($);
			if (cache.isHash($)) return this.o($);
			if (cache.isDate($)) return $+"";
			if (typeof $ == "object"||cache.isRegExp($)) return "{}";
			if (isNaN($)) return "null";
		},
		s : function(s) {
			var e = {'"':'\\"',"\\":"\\\\","\n":"\\n","\r":"\\r","\t":"\\t"};
            var c = function(m){ return (e[m] !== undefined)?e[m]:m; };
            return '"'+s.replace(/[\\"'\n\r\t]/g, c)+'"';
		},
		a : function(a) {
			var s = "[",c = "",n=a.length;
			for(var i=0; i < n; i++) {
				if (cache.isFunction(a[i])) continue;
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
					if (cache.isUndefined(o[x])||cache.isFunction(o[x])) continue;
					s += c+this.s(x)+":"+this.$(o[x]);
					if (!c) c = ",";
				}
			}
			return s+"}";
		}
	};

	return func.$(oObj);
};
//-!jindo.$Json._oldToString.hidden end!-//

//-!jindo.$Json.prototype.toXML start!-//
/**
 	The toXML method returns the jindo.$Json() object in an XML format string.
	
	@method toXML
	@return {String} An XML format string
	@throws {jindo.$Except.PARSE_ERROR} The exception occurs when an error occurs while parsing the json object
	@see jindo.$Json#toObject
	@see jindo.$Json#toString
	@example
		var json = $Json({foo:1, bar: 31});
		json.toXML();
		
		// Result :
		// <foo>1</foo><bar>31</bar>
 */
jindo.$Json.prototype.toXML = function() {
	//-@@$Json.toXML-@@//
	var f = function($,tag) {
		var t = function(s,at) { return "<"+tag+(at||"")+">"+s+"</"+tag+">"; };
		
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
				// 'break' statement was intentionally omitted.
			case "boolean":
				return t(String($));
			case "object":
				var ret = "";
				if ($ instanceof Array) {
					var len = $.length;
					for(var i=0; i < len; i++) { ret += f($[i],tag); }
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
 	The toObject() method returns the jindo.$Json() object as the original data object.
	
	@method toObject
	@return {Object} The original data object
	@throws {jindo.$Except.PARSE_ERROR} The exception occurs when an error occurs while parsing the json object
	@see jindo.$Json#toObject
	@see jindo.$Json#toString
	@see jindo.$Json#toXML
	@example
		var json = $Json({foo:1, bar: 31});
		json.toObject();
		
		// Result :
		// {foo: 1, bar: 31}
 */
jindo.$Json.prototype.toObject = function() {
	//-@@$Json.toObject-@@//
	//-@@$Json.$value-@@//
	return jindo.$Json._oldMakeJSON(this._object,"$Json#toObject");
};
//-!jindo.$Json.prototype.toObject end!-//

//-!jindo.$Json.prototype.compare start(jindo.$Json._oldToString,jindo.$Json.prototype.toObject,jindo.$Json.prototype.toString)!-//
/**
 	The compare() method compares values in two Json objects against each other.
	
	@method compare
	@param {Varaint} oData Json formatted object to be compared
	@return {Boolean} Result. Returns true if two values are equal; otherwise, returns false.
	@throws {jindo.$Except.PARSE_ERROR} The exception occurs when an error occurs while parsing the json object
	@since  1.4.4
	@example
		$Json({foo:1, bar: 31}).compare({foo:1, bar: 31});
		
		// Result :
		// true
		
		$Json({foo:1, bar: 31}).compare({foo:1, bar: 1});
		
		// Result :
		// false
 */
jindo.$Json.prototype.compare = function(oObj){
	//-@@$Json.compare-@@//
	var cache = jindo.$Jindo;
	var oArgs = cache.checkVarType(arguments, {
		'4obj' : ['oData:Hash+'],
		'4arr' : ['oData:Array+']
	},"$Json#compare");
	function compare(vSrc, vTar) {
		if (cache.isArray(vSrc)) {
			if (vSrc.length !== vTar.length) { return false; }
			for (var i = 0, nLen = vSrc.length; i < nLen; i++) {
				if (!arguments.callee(vSrc[i], vTar[i])) { return false; }
			}
			return true;
		} else if (cache.isRegExp(vSrc) || cache.isFunction(vSrc) || cache.isDate(vSrc)) {  // which compare using toString
			return String(vSrc) === String(vTar);
		} else if (typeof vSrc === "number" && isNaN(vSrc)) {
			return isNaN(vTar);
		} else if (cache.isHash(vSrc)) {
			var nLen = 0;
			for (var k in vSrc) {nLen++; }
			for (var k in vTar) { nLen--; }
			if (nLen !== 0) { return false; }

			for (var k in vSrc) {
				if (k in vTar === false || !arguments.callee(vSrc[k], vTar[k])) { return false; }
			}

			return true;
		}
		
		// which comare using ===
		return vSrc === vTar;
		
	}
	try{
		return compare(jindo.$Json._oldMakeJSON(this._object,"$Json#compare"), oObj);
	}catch(e){
		return false;
	}
};
//-!jindo.$Json.prototype.compare end!-//

//-!jindo.$Json.prototype.$value start(jindo.$Json.prototype.toObject)!-//
/**
 	The $value() method returns the original data object as the toObject() method does.
	
	@method $value
	@return {Object} The original data object
	@see jindo.$Json#toObject
 */
jindo.$Json.prototype.$value = jindo.$Json.prototype.toObject;
//-!jindo.$Json.prototype.$value end!-//

/**
	@fileOverview A file to define the constructor and method of the jindo.$Cookie() object.
	@name cookie.js
	@author NAVER Ajax Platform
 */

//-!jindo.$Cookie start!-//
/**
	jindo.$Cookie() 객체는 쿠키(Cookie)에 정보를 추가, 수정, 혹은 삭제하거나 쿠키의 값을 가져온다.
	
	@class jindo.$Cookie
	@keyword cookie
 */
/**
	Creates a jindo.$Cookie() object.
	
	@constructor
	@param {Boolean} [bURIComponent=false] 값 인코드/디코드시 encodeURIComponent()/decodeURIComponent() 함수를 사용할지 여부.
		@param {Boolean} [bURIComponent.false] escape()/unescape() 함수를 사용
		@param {Boolean} bURIComponent.true encodeURIComponent()/decodeURIComponent() 함수를 사용
	@remark bURIComponent is available in version 2.3.0 and higher.
	@example
		var cookie = $Cookie();
		var cookie = $Cookie(true);
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
	if (typeof jindo.$Jindo.isUndefined(cl._cached)) cl._cached = this;
	
	var oArgs = jindo._checkVarType(arguments, {
		"4voi" : [],
		"4bln" : ["bURIComponent:Boolean"]
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
	The keys() method returns an array that has the cookie key as its element.
	
	@method keys
 	@return {Array} An array that has the cookie key as its element
	@see jindo.$Cookie#set
	@example
		var cookie = $Cookie();
		cookie.set("session_id1", "value1", 1);
		cookie.set("session_id2", "value2", 1);
		cookie.set("session_id3", "value3", 1);
		
		document.write (cookie.keys ());
		// Result: :
		// session_id1, session_id2, session_id3
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
	The get() method gets a value corresponding to the cookie key. null is returns if no value exists.
	
	@method get
	@param {String+} sName Key name
	@return {String} Cookie value
	@see jindo.$Cookie#set
	@example
		var cookie = $Cookie();
		cookie.set("session_id1", "value1", 1);
		document.write (cookie.get ("session_id1"));
			
		// Result: :
		// value1
		
		document.write (cookie.get ("session_id0"));
		// Result: :
		// null
 */
jindo.$Cookie.prototype.get = function(sName) {
	//-@@$Cookie.get-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4str' : [ 'sName:String+']
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
	The set() method configures a cookie value. An expiration period, valid domain, and path can also be configured.

	@method set
	@param {String+} sName Key name
	@param {String+} sValue Key value
	@param {Numeric} [nDays=0] Expiration period. The expiration period is specified by day. If this value is not specified or 0, cookies are automatically deleted when closing web browsers.
	@param {String+} [sDomain] Cookie domain
	@param {String+} [sPath] Cookie path
	@return {this} 값을 설정한 인스턴스 자신
	@see jindo.$Cookie#set
	@example
		var cookie = $Cookie();
		cookie.set("session_id1", "value1", 1);
		cookie.set("session_id2", "value2", 1);
		cookie.set("session_id3", "value3", 1);
 */
jindo.$Cookie.prototype.set = function(sName, sValue, nDays, sDomain, sPath) {
	//-@@$Cookie.set-@@//
	var cache = jindo.$Jindo;
	var oArgs = cache.checkVarType(arguments, {
		'4str' : [ 'sName:String+',"sValue:String+"],
		'day_for_string' : [ 'sName:String+',"sValue:String+","nDays:Numeric"],
		'domain_for_string' : [ 'sName:String+',"sValue:String+","nDays:Numeric","sDomain:String+"],
		'path_for_string' : [ 'sName:String+',"sValue:String+","nDays:Numeric","sDomain:String+","sPath:String+"],
		'4num' : [ 'sName:String+',"sValue:Numeric"],
		'day_for_num' : [ 'sName:String+',"sValue:Numeric","nDays:Numeric"],
		'domain_for_num' : [ 'sName:String+',"sValue:Numeric","nDays:Numeric","sDomain:String+"],
		'path_for_num' : [ 'sName:String+',"sValue:Numeric","nDays:Numeric","sDomain:String+","sPath:String+"]
	},"$Cookie#set");
	
	var sExpire = "";
	var sEncoded;
	
	if(oArgs+"" !== "4str" && nDays !== 0) {
		sExpire = ";expires="+(new Date((new Date()).getTime()+nDays*1000*60*60*24)).toGMTString();
	}
	if (cache.isUndefined(sDomain)) sDomain = "";
	if (cache.isUndefined(sPath)) sPath = "/";
	
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
	The remove() method removes cookie values configured in the cookie. If the valid domain and path are specified in a value to remove, correct value must be specified.
	
	@method remove
	@param {String+} sName Key name
	@param {String+} [sDomain] The valid domain specified
	@param {String+} [sPath] The valid path specified
	@return {this} 값을 제거한 인스턴스 자신
	@see jindo.$Cookie#get
	@see jindo.$Cookie#set
	@example
		var cookie = $Cookie();
		cookie.set("session_id1", "value1", 1);
		document.write (cookie.get ("session_id1"));
		
		// Result :
		// value1
		
		cookie.remove("session_id1");
		document.write (cookie.get ("session_id1"));
		
		// Result :
		// null
 */
jindo.$Cookie.prototype.remove = function(sName, sDomain, sPath) {
	//-@@$Cookie.remove-@@//
	var cache = jindo.$Jindo;
	var oArgs = cache.checkVarType(arguments, {
		'4str' : [ 'sName:String+'],
		'domain_for_string' : [ 'sName:String+',"sDomain:String+"],
		'path_for_string' : [ 'sName:String+',"sDomain:String+","sPath:String+"]
	},"$Cookie#remove");
	var aArg = jindo._p_._toArray(arguments);
	var aPram = [];
	for(var i = 0, l = aArg.length ; i < l ; i++){
		aPram.push(aArg[i]);
		if(i == 0){
			aPram.push("");	
			aPram.push(-1);	
		}
	}
	if (!cache.isNull(this.get(sName))) this.set.apply(this,aPram);
	
	return this;
};
//-!jindo.$Cookie.prototype.remove end!-//


/**
 	@fileOverview A file to define the constructor and methods of the jindo.$Event() object
	@name event.js
	@author NAVER Ajax Platform
 */
//-!jindo.$Event start!-//
/**
 	The $Event() element provides extended features related to event handling by wrapping the event object. The jindo.$Event() object can be used to obtain the information of or specify the action for the event that has occurred.
	
	@class jindo.$Event
	@keyword event
 */
/**
 	Creates the jindo.$Event() object by wrapping the event object.
	
	@constructor
	@param {Event} event Event object
 */
/**
 	Event types
	
	@property type
	@type String
	@filter desktop
 */
/**
 {{element}}
 */
/**
 	The element in which an event occurred
	
	@property srcElement
	@type Element
	@filter desktop
 */
/**
 	The element in which an event has defined
	
	@property currentElement
	@type Element
	@filter desktop
 */
/**
 	The associative element of an event
	
	@property relatedElement
	@type Element
	@filter desktop
 */
/**
 	delegate를 사용할 경우 delegate된 엘리먼트
	
	@property delegatedElement
	@type Element
	@filter desktop
	@example
		<div id="sample">
			<ul>
					<li><a href="#">1</a></li>
					<li>2</li>
			</ul>
		</div>
		$Element("sample").delegate("click","li",function(e){
			//li 밑에 a를 클릭한 경우.
			e.srcElement -> a
			e.currentElement -> div#sample
			e.delegatedElement -> li
		});
 */
jindo.$Event = (function(isMobile) {
	if(isMobile){
		return function(e){
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
			this.realType = this.type;
			
			this.isTouch = false;
			if(this.type.indexOf("touch") > -1){
				this._posEvent = e.changedTouches[0];
				this.isTouch = true;
			}
		
			this.canceled = false;
		
			this.srcElement = this.element = e.target || e.srcElement;
			this.currentElement = e.currentTarget;
			this.relatedElement = null;
			this.delegatedElement = null;
		
			if (!jindo.$Jindo.isUndefined(e.relatedTarget)) {
				this.relatedElement = e.relatedTarget;
			} else if(e.fromElement && e.toElement) {
				this.relatedElement = e[(this.type=="mouseout")?"toElement":"fromElement"];
			}
		};
	}else{
		return function(e){
			//-@@$Event-@@//
			var cl = arguments.callee;
			if (e instanceof cl) return e;
			if (!(this instanceof cl)) return new cl(e);
		
			if (e === undefined) e = window.event;
			if (e === window.event && document.createEventObject) e = document.createEventObject(e);
		
		
			this.isTouch = false;
			this._event = this._posEvent = e;
			this._globalEvent = window.event;
		
			this.type = e.type.toLowerCase();
			if (this.type == "dommousescroll") {
				this.type = "mousewheel";
			} else if (this.type == "domcontentloaded") {
				this.type = "domready";
			}
		    this.realType = this.type;
			this.canceled = false;
		
			this.srcElement = this.element = e.target || e.srcElement;
			this.currentElement = e.currentTarget;
			this.relatedElement = null;
			this.delegatedElement = null;
		  
			if (e.relatedTarget !== undefined) {
				this.relatedElement = e.relatedTarget;
			} else if(e.fromElement && e.toElement) {
				this.relatedElement = e[(this.type=="mouseout")?"toElement":"fromElement"];
			}
		};
	}
})(jindo._p_._JINDO_IS_MO);

//-!jindo.$Event end!-//

/**
 	hook() 메서드는 이벤트 명을 조회한다.
	@method hook
	@syntax vName
	@static
	@param {String+} vName 이벤트명(String)
	@remark 2.5.0부터 사용가능하다.
	@return {Variant} 이벤트를 나타내는 값 혹은 함수.
	@example
		$Event.hook("pointerDown");
		//MsPointerDown
 	hook() 메서드는 개발자가 이벤트를 만들면 진도에서 해당 이벤트가 들어왔을 때 변경하여 사용한다.
	@method hook
	@syntax vName, vValue
	@syntax oList
	@static
	@param {String+} vName 이벤트명(String)
	@param {Variant} vValue 변경할 이벤트명(String|Function)
	@param {Hash+} oList 하나 이상의 이벤트 명과 값을 가지는 객체(Object) 또는 해시 객체(jindo.$H() 객체).
	@remark 2.5.0부터 사용가능하다.
	@return {$Event} $Event
	
	
	@example
		$Event.hook("pointerDown","MsPointerDown");
		
		$Element("some").attach("pointerDown",function(){});
		//개발자가 hook으로 등록하면 진도는 이벤트를 할당할 때 이름을 변경한다.
		//pointerDown -> MsPointerDown
	@example
		//함수도 할당할 수 있다.
		$Event.hook("pointerDown",function(){
			if(isWindow8&&isIE){
				return "MsPointerDown";
			}else if(isMobile){
				return "touchdown";
			}else{
				return "mousedown";
			}
		});
		
		$Element("some").attach("pointerDown",function(){});
		//윈도우8이고 IE10인 경우는 MsPointerDown	
		//모바일인 경우는 touchdown	
		//기타는 mousedown
 */


//-!jindo.$Event.jindo._p_.customEvent start!-//
/**
 {{jindo._p_.customEvent}}
 */

jindo._p_.customEvent = {};
jindo._p_.customEventStore = {};
jindo._p_.normalCustomEvent = {};

jindo._p_.hasCustomEvent = function(sName){
    return !!(jindo._p_.getCustomEvent(sName)||jindo._p_.normalCustomEvent[sName]);
};

jindo._p_.getCustomEvent = function(sName){
    return jindo._p_.customEvent[sName];
};

jindo._p_.addCustomEventListener = function(eEle, sElementId, sEvent, vFilter,oCustomInstance){
    if(!jindo._p_.customEventStore[sElementId]){
        jindo._p_.customEventStore[sElementId] = {};
        jindo._p_.customEventStore[sElementId].ele = eEle;
    }
    if(!jindo._p_.customEventStore[sElementId][sEvent]){
        jindo._p_.customEventStore[sElementId][sEvent] = {};
    }
    if(!jindo._p_.customEventStore[sElementId][sEvent][vFilter]){
        jindo._p_.customEventStore[sElementId][sEvent][vFilter] = {
            "custom" : oCustomInstance
        };
    }
};

jindo._p_.setCustomEventListener = function(sElementId, sEvent, vFilter, aNative, aWrap){
    jindo._p_.customEventStore[sElementId][sEvent][vFilter].real_listener = aNative;
    jindo._p_.customEventStore[sElementId][sEvent][vFilter].wrap_listener = aWrap;
};

jindo._p_.getCustomEventListener = function(sElementId, sEvent, vFilter){
    var store = jindo._p_.customEventStore[sElementId];
    if(store&&store[sEvent]&&store[sEvent][vFilter]){
        return store[sEvent][vFilter];
    }
    return {};
};
 
jindo._p_.getNormalEventListener = function(sElementId, sEvent, vFilter){
    var store = jindo._p_.normalCustomEvent[sEvent];
    if(store&&store[sElementId]&&store[sElementId][vFilter]){
        return store[sElementId][vFilter];
    }
    return {};
};

jindo._p_.hasCustomEventListener = function(sElementId, sEvent, vFilter){
    var store = jindo._p_.customEventStore[sElementId];
    if(store&&store[sEvent]&&store[sEvent][vFilter]){
        return true;
    }
    return false;
};

//-!jindo.$Event.customEvent start!-//
jindo.$Event.customEvent = function(sName, oEvent) {
    var oArgs = jindo._checkVarType(arguments, {
        's4str' : [ 'sName:String+'],
        's4obj' : [ 'sName:String+', "oEvent:Hash+"]
    },"$Event.customEvent");

    
    switch(oArgs+""){
        case "s4str":
            if(jindo._p_.hasCustomEvent(sName)){
                throw new jindo.$Error("The Custom Event Name have to unique.");
            }else{
                jindo._p_.normalCustomEvent[sName] = {};
            }

            return this;
        case "s4obj":
            if(jindo._p_.hasCustomEvent(sName)){
                throw new jindo.$Error("The Custom Event Name have to unique.");
            }else{
                jindo._p_.normalCustomEvent[sName] = {};
                jindo._p_.customEvent[sName] = function(){
                    this.name = sName;
                    this.real_listener = [];
                    this.wrap_listener = [];
                };
                var _proto = jindo._p_.customEvent[sName].prototype;
                _proto.events = [];
                for(var i in oEvent){
                    _proto[i] = oEvent[i];
                    _proto.events.push(i);
                }

                jindo._p_.customEvent[sName].prototype.fireEvent = function(oCustomEvent){
                    for(var i = 0, l = this.wrap_listener.length; i < l; i ++){
                        this.wrap_listener[i](oCustomEvent);
                    }
                };
            }
            return this;
    }
};
//-!jindo.$Event.customEvent end!-//


//-!jindo.$Event.prototype.mouse start!-//
/**
 	The mouse() method returns the object that contains the information of the mouse event.
	
	@method mouse
	@param {Boolean} [bIsScrollbar=false] If this value is true, the scroll attributes are provided. (2.0.0 버전부터 지원).
	@return {Object} An object that contains the mouse event information.
		@return {Number} .delta Stores the amount of mouse wheel movement as an integer. A positive number is stored if the wheel has been scrolled upward, and a negative number is stored if the wheel has been scrolled downward.
		@return {Boolean} .left Stores whether the left mouse button has been clicked on as Boolean.
		@return {Boolean} .middle Stores whether the middle mouse button has been clicked on as Boolean.
		@return {Boolean} .right Stores whether the right mouse button has been clicked on as Boolean.
		@return {Boolean} .scrollbar Able to identify whether the event has occurred during the scroll action.
	@filter desktop
	@example
		function eventHandler(evt) {
		   var mouse = evt.mouse();
		
		   mouse.delta;     // Number. The degree of wheel movement. Returns positive numbers if the wheel is scrolled upward, or negative numbers if the wheel is scrolled downward.
		   mouse.left;      // true if the left mouse button is held down, false otherwise.
		   mouse.middle;    // true if the middle mouse button is held down, false otherwise.
		   mouse.right;     // true if the right mouse button is held down, false otherwise.
		   mouse.scrollbar; // true if the event fired during scroll action, false otherwise.
		}
 */
jindo.$Event.prototype.mouse = function(bIsScrollbar) {
	//-@@$Event.mouse-@@//
	jindo._checkVarType(arguments,{
		"voi" : [],
		"bol" : ["bIsScrollbar:Boolean"]
	});
	var e    = this._event;
	var ele  = this.srcElement;
	var delta = 0;
	var left = false,mid = false,right = false;

	var left  = e.which ? e.button==0 : !!(e.button&1);
	var mid   = e.which ? e.button==1 : !!(e.button&4);
	var right = e.which ? e.button==2 : !!(e.button&2);
	var ret   = {};

	if (e.wheelDelta) {
		delta = e.wheelDelta / 120;
	} else if (e.detail) {
		delta = -e.detail / 3;
	}
	var scrollbar = false;
	if(bIsScrollbar){
		scrollbar = _event_isScroll(ele,e);
	}
	
				
	ret = {
		delta  : delta,
		left   : left,
		middle : mid,
		right  : right,
		scrollbar : scrollbar
	};
	// replace method
	this.mouse = function(bIsScrollbar){
		if(bIsScrollbar){
			ret.scrollbar = _event_isScroll(this.srcElement,this._event);
			this.mouse = function(){return ret;};
		} 
		return ret;
	};

	return ret;
};
/**
 * @ignore
 */
function _event_getScrollbarSize() {
	
	var oScrollbarSize = { x : 0, y : 0 };
		
	var elDummy = jindo.$([
		'<div style="',
		[
			'overflow:scroll',
			'width:100px',
			'height:100px',
			'position:absolute',
			'left:-1000px',
			'border:0',
			'margin:0',
			'padding:0'
		].join(' !important;'),
		' !important;">'
	].join(''));
	
	document.body.insertBefore(elDummy, document.body.firstChild);
	
	oScrollbarSize = {
		x : elDummy.offsetWidth - elDummy.scrollWidth,
		y : elDummy.offsetHeight - elDummy.scrollHeight
	};
	
	document.body.removeChild(elDummy);
	elDummy = null;
	
	_event_getScrollbarSize = function() {
		return oScrollbarSize;
	};
	
	return oScrollbarSize;
	
}
/**
 * @ignore
 */
function _ie_check_scroll(ele,e) {
    var iePattern = jindo._p_._j_ag.match(/(?:MSIE) ([0-9.]+)/);
    if(document.body.componentFromPoint&&iePattern&& parseInt(iePattern[1],10) == 8){
        _ie_check_scroll = function(ele,e) {
            return !/HTMLGenericElement/.test(ele+"") && 
                    /(scrollbar|outside)/.test(ele.componentFromPoint(e.clientX, e.clientY)) &&
                    ele.clientHeight !== ele.scrollHeight;
        };
    }else{
        _ie_check_scroll = function(ele,e){
            return /(scrollbar|outside)/.test(ele.componentFromPoint(e.clientX, e.clientY));
        };
    }
    return _ie_check_scroll(ele,e);
}


function _event_isScroll(ele,e){
	/**
	 	// IE 의 경우 componentFromPoint 메서드를 제공하므로 이걸 활용
	 */
	if (ele.componentFromPoint) {
		return _ie_check_scroll(ele,e);
	}
	
	/**
	 	// 파이어폭스는 스크롤바 클릭시 XUL 객체로 지정
	 */
	if (jindo._p_._JINDO_IS_FF) {
		
		try {
			var name = e.originalTarget.localName;
			return (
				name === 'thumb' ||
				name === 'slider' ||
				name === 'scrollcorner' ||
				name === 'scrollbarbutton'
			);
		} catch(ex) {
			return true;
		}
		
	}
	
	var sDisplay = jindo.$Element(ele).css('display');
	if (sDisplay === 'inline') { return false; }
	
	/**
	 	// 엘리먼트 내에서 클릭된 위치 얻기
	 */
	var oPos = {
		x : e.offsetX || 0,
		y : e.offsetY || 0
	};
	
	/**
	 	// Webkit 의 경우 border 의 사이즈가 더해져서 나옴
	 */
	if (jindo._p_._JINDO_IS_WK) {
		oPos.x -= ele.clientLeft;
		oPos.y -= ele.clientTop;
	}
	
	var oScrollbarSize = _event_getScrollbarSize();
	
	/**
	 	// 스크롤바가 있는 영역
	 */
	var oScrollPos = {
		x : [ ele.clientWidth, ele.clientWidth + oScrollbarSize.x ],
		y : [ ele.clientHeight, ele.clientHeight + oScrollbarSize.y ]
	};
	
	return (
		(oScrollPos.x[0] <= oPos.x && oPos.x <= oScrollPos.x[1]) ||
		(oScrollPos.y[0] <= oPos.y && oPos.y <= oScrollPos.y[1])
	);
}
//-!jindo.$Event.prototype.mouse end!-//

//-!jindo.$Event.prototype.key start!-//
/**
 	The key() method returns the object that contains the keyboard event information.
	
	@method key
	@return {Object} An object that contains the keyboard event information
		@return {Boolean} .alt Stores whether the ALT key has been pressed as Boolean.
		@return {Boolean} .ctrl Stores whether the CTRL key has been pressed as Boolean.
		@return {Boolean} .down Stores whether the Down Arrow key has been pressed as Boolean.
		@return {Boolean} .enter Stores whether the Enter key has been pressed as Boolean.
		@return {Boolean} .esc Stores whether the ESC key has been pressed as Boolean.
		@return {Boolean} .keyCode Stores the code value of the entered key as integers.
		@return {Boolean} .left Stores whether the Left Arrow key has been pressed as Boolean.
		@return {Boolean} .meta Stores whether the META key (the command key of the keyboard for Mac) has been pressed as Boolean.
		@return {Boolean} .right Stores whether the Right Arrow key has been pressed as Boolean.
		@return {Boolean} .shift Stores whether the Shift key has been pressed as Boolean.
		@return {Boolean} .up Stores whether the Up Arrow key has been pressed as Boolean.
	@example
		function eventHandler(evt) {
		   var key = evt.key();
		
		   key.keyCode; // Number. The key code of a keyboard
		   key.alt;     // true if the Alt key is held down.
		   key.ctrl;    // true if the Ctrl key is held down.
		   key.meta;    // true if the Meta key is held down.
		   key.shift;   // true if the Shift key is held down.
		   key.up;      // true if the up arrow key is held down.
		   key.down;    // true if the down arrow key is held down.
		   key.left;    // true if the left arrow key is held down.
		   key.right;   // true if the right arrow key is held down.
		   key.enter;   // true if the return key is held down.
		   key.esc;   // true if the ESC key is held down.
		}
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

	this.key = function(){ return ret; };

	return ret;
};
//-!jindo.$Event.prototype.key end!-//

//-!jindo.$Event.prototype.pos start(jindo.$Element.prototype.offset)!-//
/**
 	The pos() method returns the object that contains the information of the position of the mouse cursor.
	
	@method pos
	@param {Boolean} [bGetOffset]  The parameter that determines whether to calculate the offsetX and the offsetY values, the relative position of the mouse cursor on the element where the event has occurred. If the bGetOffset value is true, the offsetX and the offsetY values are calculated.
	@return {Object} The mouse cursor position information.
		@return {Number} .clientX Stores the X-coordinate of the mouse cursor based on the screen.
		@return {Number} .clientY Stores the Y-coordinate of the mouse cursor based on the screen.
		@return {Number} .offsetX Stores the X-coordinate of the mouse cursor based on the DOM element.
		@return {Number} .offsetY Stores the Y-coordinate of the mouse cursor based on the DOM element.
		@return {Number} .pageX Stores the X-coordinate of the mouse cursor based on the document.
		@return {Number} .pageY Stores the Y-coordinate of the mouse cursor based on the document.
	@remark 
		<ul class="disc">
			<li>To use the pos() method, the Jindo framework must include the jindo.$Element() object.</li>
		</ul>
	@example
		function eventHandler(evt) {
		   var pos = evt.pos();
		
		   pos.clientX;  // X coordinate of the current page
		   pos.clientY;  // Y coordinate of the current page
		   pos.offsetX; // The relative X coordinate of a mouse cursor to the element in which the event occurred (available in version 1.2.0 and higher)
		   pos.offsetY; // The relative Y coordinate of a mouse cursor to the element in which the event occurred (available in version 1.2.0 and higher)
		   pos.pageX;  // X coordinate of the entire document
		   pos.pageY;  // Y coordinate of the entire document
		}
 */
jindo.$Event.prototype.pos = function(bGetOffset) {
	//-@@$Event.pos-@@//
	jindo._checkVarType(arguments,{
		"voi" : [],
		"bol" : ["bGetOffset:Boolean"]
	});

	var e = this._posEvent;
	var doc = (this.srcElement.ownerDocument||document);
	var b = doc.body;
	var de = doc.documentElement;
	var pos = [b.scrollLeft || de.scrollLeft, b.scrollTop || de.scrollTop];
	var ret = {
		clientX: e.clientX,
		clientY: e.clientY,
		pageX: 'pageX' in e ? e.pageX : e.clientX+pos[0]-b.clientLeft,
		pageY: 'pageY' in e ? e.pageY : e.clientY+pos[1]-b.clientTop
	};

    /*
     As the method used for calculating offsets is CPU-intensive, use it only when necessary.
     */
	if (bGetOffset && jindo.$Element) {
		var offset = jindo.$Element(this.srcElement).offset();
		ret.offsetX = ret.pageX - offset.left;
		ret.offsetY = ret.pageY - offset.top;
	}

	return ret;
};
//-!jindo.$Event.prototype.pos end!-//

//-!jindo.$Event.prototype.stop start!-//
/**
 	stop() method stops the bubbling and basic actions of an event. Bubbling is a phenomenon in which an event that has occurred in a subnode is spreading through its supernodes, in specific HTML elements. For example, when the &lt;div&gt; element is clicked, an onclick event occurs in the document element, the parent element, as well as the &lt;div&gt; element. The stop() method blocks bubbling so as to allow the event to occur only in a specified object.
	
	@method stop
	@param {Numeric} [nCancelConstant=$Event.CANCEL_ALL] The constant of the jindo.$Event() object. Selectively stops the bubbling or basic action of an event according to the specified constant. (1.1.3 버전부터 지원).
		@param {Numeric} [nCancelConstant.$Event.CANCEL_ALL] 버블링과 기본 동작을 모두 중지
		@param {Numeric} nCancelConstant.$Event.CANCEL_BUBBLE 버블링을 중지
		@param {Numeric} nCancelConstant.$Event.CANCEL_DEFAULT 기본 동작을 중지
	@return {this} 창의 버블링과 기본 동작을 중지한 인스턴스 자신
	@see jindo.$Event.CANCEL_ALL
	@see jindo.$Event.CANCEL_BUBBLE
	@see jindo.$Event.CANCEL_DEFAULT
	@example
		// To stop only basic operations (available in version 1.1.3 and higher)
		function stopDefaultOnly(evt) {
			// Here is some code to execute
		
			// Stop default event only
			evt.stop($Event.CANCEL_DEFAULT);
		}
 */
jindo.$Event.prototype.stop = function(nCancel) {
	//-@@$Event.stop-@@//
	jindo._checkVarType(arguments,{
		"voi" : [],
		"num" : ["nCancel:Numeric"]
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
	
	if(d){
	    if(e.preventDefault !== undefined){
	        e.preventDefault();
	    }else{
	        e.returnValue = false;
	    }
	}
	
	if(b){
	    if(e.stopPropagation !== undefined){
	        e.stopPropagation();
	    }else{
	        e.cancelBubble = true;
	    }
	}

	return this;
};

/**
 	The stopDefault() method stops the basic actions of an event. It behaves the same with entering the CANCEL_DEFAULT value as the parameter of the stop() method.
	
	@method stopDefault
	@return {this} 이벤트의 기본 동작을 중지한 인스턴스 자신
	@see jindo.$Event#stop
	@see jindo.$Event.CANCEL_DEFAULT
 */
jindo.$Event.prototype.stopDefault = function(){
	return this.stop(jindo.$Event.CANCEL_DEFAULT);
};

/**
 	The stopBubble() method stops the bubbling of an event. It behaves the same with entering the CANCEL_BUBBLE value as the parameter of the stop() method.
	
	@method stopBubble
	@return {this} 이벤트의 버블링을 중지한 인스턴스 자신
	@see jindo.$Event#stop
	@see jindo.$Event.CANCEL_BUBBLE
 */
jindo.$Event.prototype.stopBubble = function(){
	return this.stop(jindo.$Event.CANCEL_BUBBLE);
};

/**
 	The CANCEL_BUBBLE is a constant used by the stop() method to stop bubbling.
	
	@property CANCEL_BUBBLE
	@static
	@constant
	@type Number
	@default 1
	@see jindo.$Event#stop
	@final
 */
jindo.$Event.CANCEL_BUBBLE = 1;

/**
 	The CANCEL_DEFAULT is a constant used by the stop() method to stop basic actions.
	
	@property CANCEL_DEFAULT
	@static
	@constant
	@type Number
	@default 2
	@see jindo.$Event#stop
	@final
 */
jindo.$Event.CANCEL_DEFAULT = 2;

/**
 	The CANCEL_ALL is a constant used by the stop() method to stop both bubbling and basic actions.
	
	@property CANCEL_ALL
	@static
	@constant
	@type Number
	@default 3
	@see jindo.$Event#stop
	@final
 */
jindo.$Event.CANCEL_ALL = 3;
//-!jindo.$Event.prototype.stop end!-//

//-!jindo.$Event.prototype.$value start!-//
/**
 	The $value method returns the original Event object.
	
	@method $value
	@return {Event} The original Event object
	@example
		function eventHandler(evt){
			evt.$value();
		}
 */
jindo.$Event.prototype.$value = function() {
	//-@@$Event.$value-@@//
	return this._event;
};
//-!jindo.$Event.prototype.$value end!-//

//-!jindo.$Event.prototype.changedTouch start(jindo.$Event.prototype.targetTouch,jindo.$Event.prototype.touch)!-//
/**
 	It makes the use of the changeTouches object easier when using touch-related events on mobile devices.
	
	@method changedTouch
	@param {Numeric} [nIndex] Index number. If don't indicate this option then return data array.
	@return {Array | Hash} An array that contains a variety of information data or Various information data
	@throws {$Except.NOT_SUPPORT_METHOD} The exception occurs when using on the desktop computer.
	@filter mobile
	@since 2.0.0 
	@see jindo.$Event#targetTouch
	@see jindo.$Event#pos
	@example
		$Element("only_mobile").attach("touchstart",function(e){
			e.changedTouch(0);
			{
			   "id" : "123123",// identifier
			   "event" : $Event,// $Event
			   "element" : element, // The corresponding element
			   "pos" : function(){}//  Method (same as the Pos method)
			}
			
		 	e.changedTouch();
			[
				{
				   "id" : "123123",
				   "event" : $Event,
				   "element" : element,
				   "pos" : function(){}
				},
				{
				   "id" : "123123",
				   "event" : $Event,
				   "element" : element,
				   "pos" : function(){}
				}
			]
		 });
 */
(function(aType){
	var sTouches = "Touch", sMethod = "";

	for(var i=0, l=aType.length; i < l; i++) {
        sMethod = aType[i]+sTouches;
        if(!aType[i]) { sMethod = sMethod.toLowerCase(); }

		jindo.$Event.prototype[sMethod] = (function(sType) {
			return function(nIndex) {
				if(this.isTouch) {
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
					this[sType] = function(nIndex) {
						var oArgs = jindo._checkVarType(arguments, {
							'void' : [  ],
							'4num' : [ 'nIndex:Numeric' ]
						},"$Event#"+sType);
						if(oArgs+"" == 'void') return oRet;
						
						return oRet[nIndex];
					};
				} else {
					this[sType] = function(nIndex) {
						throw new jindo.$Error(jindo.$Except.NOT_SUPPORT_METHOD,"$Event#"+sType);
					};
				}
				
				return this[sType].apply(this,jindo._p_._toArray(arguments));
			};
		})(sMethod);
	}
})(["changed","target",""]);
//-!jindo.$Event.prototype.changedTouch end!-//

//-!jindo.$Event.prototype.targetTouch start(jindo.$Event.prototype.changedTouch)!-//
/**
 	It makes the use of the targetTouches object easier when using touch-related events on mobile devices.
	
	@method targetTouch
	@param {Numeric} [nIndex] Index number. If don't indicate this option then return data array.
	@return {Array | Hash} An array that contains a variety of information data or Various information data
	@throws {$Except.NOT_SUPPORT_METHOD} The exception occurs when using on the desktop computer.
	@filter mobile
	@since 2.0.0
	@see jindo.$Event#changedTouch
	@see jindo.$Event#pos
	@example
		$Element("only_mobile").attach("touchstart",function(e){
			e.targetTouch(0);
			{
			   "id" : "123123",// identifier
			   "event" : $Event,// $Event
			   "element" : element, // The corresponding element
			   "pos" : function(){}//  Method (same as the Pos method)
			}
			
			e.targetTouch();
			[
				{
				   "id" : "123123",
				   "event" : $Event,
				   "element" : element,
				   "pos" : function(){}
				},
				{
				   "id" : "123123",
				   "event" : $Event,
				   "element" : element,
				   "pos" : function(){}
				}
			]
		 });
 */
//-!jindo.$Event.prototype.targetTouch end!-//

//-!jindo.$Event.prototype.touch start(jindo.$Event.prototype.changedTouch)!-//
/**
 	It makes the use of the touches object easier when using touch-related events on mobile devices.

	@method touch
	@param {Numeric} [nIndex] Index number. If don't indicate this option then return data array.
	@return {Array | Hash} An array that contains a variety of information data or Various information data
	@throws {$Except.NOT_SUPPORT_METHOD} The exception occurs when using on the desktop computer.
	@filter mobile
	@since 2.0.0
	@see jindo.$Event#changedTouch
	@see jindo.$Event#pos
	@example
		$Element("only_mobile").attach("touchstart",function(e){
			e.touch(0);
			{
			   "id" : "123123",// identifier
			   "event" : $Event,// $Event
			   "element" : element, // The corresponding element
			   "pos" : function(){}//  Method (same as the Pos method)
			}

			e.touch();
			[
				{
				   "id" : "123123",
				   "event" : $Event,
				   "element" : element,
				   "pos" : function(){}
				},
				{
				   "id" : "123123",
				   "event" : $Event,
				   "element" : element,
				   "pos" : function(){}
				}
			]
		 });
 */
//-!jindo.$Event.prototype.touch end!-//

/**
 	@fileOverview A file to define the constructor and method of the jindo.$Element() object
	@name element.js
	@author NAVER Ajax Platform
 */
//-!jindo.$Element start(jindo.$)!-//
/**
 	The jindo.$Element() object performs a wrapping of HTML elements and provides a function to handle the elements easily.
	
	@class jindo.$Element
	@keyword element
 */
/**
 	Create a jindo.$Element() object.
	 
	@constructor
	@param {Variant} vElement A string, HTML element (Element+|Node|Document+|Window+), or the jindo.$Element() object can be specified as a parameter of the jindo.$Element() object creator.<br>
		<ul class="disc">
			<li>The two characteristics of a parameter that takes a character string are described below:
				<ul class="disc">
					<li>If the string type is "&lt;tagName&gt;", it creates an object with tagName.</li>
					<li>In other cases, it creates the jindo.$Element() object by using HTML elements which have the specified string as its ID.</li>
				</ul>
			</li>
			<li>If the parameter is the HTML element, the element is wrapped to create the $Element().</li>
			<li>If the parameter is the $Element(), the passed parameter is returned as it is.</li>
			<li>If the parameter of the creator is either undefined or null, null is returned.</li>
		</ul>
	@return {jindo.$Element} The created jindo.$Element() object
	@example
		var element = $Element($("box")); // Specifies the HTML element as a parameter.
		var element = $Element("box"); // Specifies the id of the HTML element as a parameter.
		var element = $Element("<div>"); // Specifies a tag as a parameter. Wraps by creating DIV elements.
 */
jindo.$Element = function(el) {
    //-@@$Element-@@//
    var cl = arguments.callee;
    if (el && el instanceof cl) return el;  
    
    if (!(this instanceof cl)){
        try {
            jindo.$Jindo._maxWarn(arguments.length, 1,"$Element");
            return new cl(el);
        } catch(e) {
            if (e instanceof TypeError) { return null; }
            throw e;
        }
    }   
    var cache = jindo.$Jindo;
    var oArgs = cache.checkVarType(arguments, {
        '4str' : [ 'sID:String+' ],
        '4nod' : [ 'oEle:Node' ],
        '4doc' : [ 'oEle:Document+' ],
        '4win' : [ 'oEle:Window+' ]
    },"$Element");
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
            try{
                this._element.__jindo__id = this._key = jindo._p_._makeRandom();
            }catch(e){}
        }
        // tagname
        this.tag = (this._element.tagName||'').toLowerCase();
    }else{
        throw new TypeError("{not_found_element}");
    }

};
jindo._p_.NONE_GROUP = "_jindo_event_none";
jindo._p_.splitEventSelector = function(sEvent){
    var matches = sEvent.match(/^([a-z_]*)(.*)/i);
    var eventName = jindo._p_.trim(matches[1]);
    var selector = jindo._p_.trim(matches[2].replace("@",""));
    return {
        "type"      : selector?"delegate":"normal",
        "event"     : eventName,
        "selector"  : selector
    };
};
jindo._p_._makeRandom = function(){
    return "e"+ new Date().getTime() + parseInt(Math.random() * 100000000,10);
};

jindo._p_.releaseEventHandlerForAllChildren = function(wel){
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
};

jindo._p_.canUseClassList = function(){
    var result = "classList" in document.body&&"classList" in document.createElementNS("http://www.w3.org/2000/svg", "g");
    jindo._p_.canUseClassList = function(){
        return result;
    };
    return jindo._p_.canUseClassList();
};

jindo._p_.vendorPrefixObj = {
    "-moz" : "Moz",
    "-ms" : "ms",
    "-o" : "O",
    "-webkit" : "webkit"
};

jindo._p_.cssNameToJavaScriptName = function(sName){
    if(/^(\-(?:moz|ms|o|webkit))/.test(sName)){
        var vandorPerfix = RegExp.$1;
        sName = sName.replace(vandorPerfix,jindo._p_.vendorPrefixObj[vandorPerfix]);
    }
    
    return sName.replace(/(:?-(\w))/g,function(_,_,m){
       return m.toUpperCase();
    });
};

//-!jindo.$Element._getTransition.hidden start!-//
/**
 {{sign_getTransition}}
 */

jindo._p_.getStyleIncludeVendorPrefix = function(_test){
    var styles = ["Transition","Transform","Animation","Perspective"];
    var vendors = ["webkit","-","Moz","O","ms"];

    // when vender prefix is not present,  the value will be taken from  prefix
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
    
    jindo._p_.getStyleIncludeVendorPrefix = function(){
        return result;
    };
    
    return jindo._p_.getStyleIncludeVendorPrefix();
};

jindo._p_.getTransformStringForValue = function(_test){
    var info = jindo._p_.getStyleIncludeVendorPrefix(_test);
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
    
    jindo._p_.getTransformStringForValue = function(){
        return transform;
    };
    
    return jindo._p_.getTransformStringForValue();
};
/*
 {{disappear_1}}
 */
// To prevent blink issue on Android 4.0.4 Samsung Galaxy 2 LTE model, calculate offsetHeight first
jindo._p_.setOpacity = function(ele,val){
    ele.offsetHeight;
    ele.style.opacity = val;
};
//-!jindo.$Element._getTransition.hidden end!-//

/**
 	@method _eventBind
	@ignore
 */
jindo.$Element._eventBind = function(oEle,sEvent,fAroundFunc,bUseCapture){
    if(oEle.addEventListener){
        if(document.documentMode == 9){
            jindo.$Element._eventBind = function(oEle,sEvent,fAroundFunc,bUseCapture){
                if(/resize/.test(sEvent) ){
                    oEle.attachEvent("on"+sEvent,fAroundFunc);
                }else{
                    oEle.addEventListener(sEvent, fAroundFunc, !!bUseCapture);
                }
            };
        }else{
            jindo.$Element._eventBind = function(oEle,sEvent,fAroundFunc,bUseCapture){
                oEle.addEventListener(sEvent, fAroundFunc, !!bUseCapture);
            };
        }
    }else{
        jindo.$Element._eventBind = function(oEle,sEvent,fAroundFunc){
            oEle.attachEvent("on"+sEvent,fAroundFunc);
        };
    }
    jindo.$Element._eventBind(oEle,sEvent,fAroundFunc,bUseCapture);
};

/**
 	@method _unEventBind
	@ignore
 */
jindo.$Element._unEventBind = function(oEle,sEvent,fAroundFunc){
    if(oEle.removeEventListener){
        if(document.documentMode == 9){
            jindo.$Element._unEventBind = function(oEle,sEvent,fAroundFunc){
                if(/resize/.test(sEvent) ){
                    oEle.detachEvent("on"+sEvent,fAroundFunc);
                }else{
                    oEle.removeEventListener(sEvent,fAroundFunc,false);
                }
            };
        }else{
            jindo.$Element._unEventBind = function(oEle,sEvent,fAroundFunc){
                oEle.removeEventListener(sEvent,fAroundFunc,false);
            };
        }
    }else{
        jindo.$Element._unEventBind = function(oEle,sEvent,fAroundFunc){
            oEle.detachEvent("on"+sEvent,fAroundFunc);
        };
    }
    jindo.$Element._unEventBind(oEle,sEvent,fAroundFunc);
};
//-!jindo.$Element end!-//


//-!jindo.$Element.prototype.$value start!-//
/**
 	The $value() method returns the original HTML elements.
	
	@method $value
	@return {Element} The original element wrapped by the jindo.$Element() object
	@see jindo.$Element
	@example
		var element = $Element("sample_div");
		element.$value(); // Returns the original HTML elements.
 */
jindo.$Element.prototype.$value = function() {
    //-@@$Element.$value-@@//
    return this._element;
};
//-!jindo.$Element.prototype.$value end!-//

//-!jindo.$Element.prototype.visible start(jindo.$Element.prototype._getCss,jindo.$Element.prototype.show,jindo.$Element.prototype.hide)!-//
/**
 	The visible() method checks the display attributes of HTML elements.
	
	@method visible
	@return {Boolean} Returns whether the element is displayed.
	@example
		<div id="sample_div" style="display:none">Hello world</div>
		
		// Searches
		$Element("sample_div").visible(); // false 
 */
/**
 	The visible() method configures the display attributes of HTML elements.
	
	@method visible
	@param {Boolean} bVisible Whether to display the element.<br>If the parameter is true, the display attribute is set. If false, the display attribute is changed to none. When the value is in Boolean, the result of ToBoolean is used for comparison.
	@param {String+} sDisplay The display attribute value of the element.<br>When the value of bVisible parameter is true, the sDisplay attribute value is set to the display attribute.
	@return {this} display 속성을 변경한 인스턴스 자신
	@remark 
		<ul class="disc">
			<li>The bVisible parameter is available in version 1.1.2 and higher.</li>
			<li>The sDisplay parameter is available in version 1.4.5 and higher.</li>
		</ul>
	@see http://www.w3.org/TR/2008/REC-CSS2-20080411/visuren.html#display-prop display Attributes - W3C CSS2 Specification
	@see jindo.$Element#show
	@see jindo.$Element#hide
	@see jindo.$Element#toggle
	@example
		// Makes it visible on the screen.
		$Element("sample_div").visible(true, 'block');
		
		//Before
		<div id="sample_div" style="display:none">Hello world</div>
		
		//After
		<div id="sample_div" style="display:block">Hello world</div>
 */
jindo.$Element.prototype.visible = function(bVisible, sDisplay) {
    //-@@$Element.visible-@@//
    var oArgs = jindo._checkVarType(arguments, {
        'g' : [  ],
        's4bln' : [ jindo.$Jindo._F('bVisible:Boolean') ],
        's4str' : [ 'bVisible:Boolean', "sDisplay:String+"]
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
 	The show() method changes the display attribute in order to display HTML elements on the screen.
	
	@method show
	@param {String+} [sDisplay] The value to be set as the display attribute.<br>If the parameter is not specified, it is set to its default value. It is set to "inline" if no pre-defind value exists; set to block if an error occurs.
	@return {this} display 속성을 변경한 인스턴스 자신
	@remark The sDisplay parameter is available in version 1.4.5 and higher.
	@see http://www.w3.org/TR/2008/REC-CSS2-20080411/visuren.html#display-prop display Attributes - W3C CSS2 Specification
	@see jindo.$Element#hide
	@see jindo.$Element#toggle
	@see jindo.$Element#visible
	@example
		// Makes it visible on the screen.
		$Element("sample_div").show();
		
		//Before
		<div id="sample_div" style="display:none">Hello world</div>
		
		//After
		<div id="sample_div" style="display:block">Hello world</div>
 */
jindo.$Element.prototype.show = function(sDisplay) {
    //-@@$Element.show-@@//
    var oArgs = jindo._checkVarType(arguments, {
        '4voi' : [  ],
        '4str' : ["sDisplay:String+"]
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
         When the value of sDisplay is abnormal in Internet Explorer, it is set to block.
         */
        s.display = "block";
    }

    return this;
};
//-!jindo.$Element.prototype.show end!-//

//-!jindo.$Element.prototype.hide start!-//
/**
 	The hide() method changes the display attribute to none to make the HTML elements invisible.
	
	@method hide
	@return {this} display 속성을 none으로 변경한 인스턴스 자신
	@see http://www.w3.org/TR/2008/REC-CSS2-20080411/visuren.html#display-prop display Attributes - W3C CSS2 Specification
	@see jindo.$Element#show
	@see jindo.$Element#toggle
	@see jindo.$Element#visible
	@example
		// Makes it invisible on the screen.
		$Element("sample_div").hide();
		
		//Before
		<div id="sample_div" style="display:block">Hello world</div>
		
		//After
		<div id="sample_div" style="display:none">Hello world</div>
 */
jindo.$Element.prototype.hide = function() {
    //-@@$Element.hide-@@//
    this._element.style.display = "none";

    return this;
};
//-!jindo.$Element.prototype.hide end!-//

//-!jindo.$Element.prototype.toggle start(jindo.$Element.prototype._getCss,jindo.$Element.prototype.show,jindo.$Element.prototype.hide)!-//
/**
 	The toggle() method changes the display attributes of HTML elements in order to display or hide the element on the screen. This method can toggle the displayability of the element.
	
	@method toggle
	@param {String+} [sDisplay] The value which will be set as the display attribute in order to display an element.<br>If the parameter is not specified, it is set to its default value. It is set to "inline" if no pre-defind value exists.
	@return {this} display 속성을 변경한 인스턴스 자신
	@remark In version 1.4.5 and higher, it is possible to configure the value of sDisplay attribute as the value of the display attribute to display the element.
	@see http://www.w3.org/TR/2008/REC-CSS2-20080411/visuren.html#display-prop display Attributes< - W3C CSS2 Specification
	@see jindo.$Element#show
	@see jindo.$Element#hide
	@see jindo.$Element#visible
	@example
		// Makes it visiable or invisible on the screen.
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
    //-@@$Element.toggle-@@//
    var oArgs = jindo._checkVarType(arguments, {
        '4voi' : [  ],
        '4str' : ["sDisplay:String+"]
    },"$Element#toggle");
    
    this[this._getCss(this._element,"display")=="none"?"show":"hide"].apply(this,arguments);
    return this;
};
//-!jindo.$Element.prototype.toggle end!-//

//-!jindo.$Element.prototype.opacity start!-//
/**
 	The opacity() method retrieves the transparency (the opacity attribute) of HTML elements.
	
	@method opacity
	@return {Numeric} Return the opacity value.
	@example
		<div id="sample" style="background-color:#2B81AF; width:20px; height:20px;"></div>
		
		// Searches
		$Element("sample").opacity();	// 1
 */
/**
 	The opacity() method configures the transparency (the opacity attribute) of HTML elements.
	
	@method opacity
	@param {Variant} vValue The transparency value to be set(String|Numeric).<br>Specify the value as a real number between 0 and 1. The value will be set to 0 if the value of the parameter is less than 0, and set to 1 if the value of the parameter is greater than 1. If empty string is given, then remove opacity property from the element.
	@return {this} Opacity value changed instance of itself.
	@example
		// Configures the opacity value.
		$Element("sample").opacity(0.4);
		
		//Before
		<div style="background-color: rgb(43, 129, 175); width: 20px; height: 20px;" id="sample"></div>
		
		//After
		<div style="background-color: rgb(43, 129, 175); width: 20px; height: 20px; opacity: 0.4;" id="sample"></div>
 */
jindo.$Element.prototype.opacity = function(value) {
    //-@@$Element.opacity-@@//
    var oArgs = jindo._checkVarType(arguments, {
                'g' : [  ],
                's' : ["nOpacity:Numeric"],
                'str' : ['sOpacity:String']
            },"$Element#opacity"),
        e = this._element,
        b = (this._getCss(e,"display") != "none"), v;

    switch(oArgs+""){
        case "g":
            if(typeof e.style.opacity != 'undefined' && (v = e.style.opacity).length || (v = this._getCss(e,"opacity"))) {
                v = parseFloat(v);
                if (isNaN(v)) v = b?1:0;
            } else {
                v = typeof e.filters.alpha == 'undefined'?(b?100:0):e.filters.alpha.opacity;
                v = v / 100;
            }
            return v;   
            
        case "s":
             /*
             If IE does not have layout, opacity is not applied.
             */
            value = oArgs.nOpacity;
            e.style.zoom = 1;
            value = Math.max(Math.min(value,1),0);
            
            if (typeof e.style.opacity != 'undefined') {
                e.style.opacity = value;
            } else {
                value = Math.ceil(value*100);
                
                if (typeof e.filters != 'unknown' && typeof e.filters.alpha != 'undefined') {
                    e.filters.alpha.opacity = value;
                } else {
                    e.style.filter = (e.style.filter + " alpha(opacity=" + value + ")");
                }       
            }
            return this;

        case "str":
             /*
             If parameter value is empty string, then remove opacity property from the element.
             */
            if(value === "") {
                e.style.zoom = e.style.opacity = "";
            }
            return this;
    }
    
};
//-!jindo.$Element.prototype.opacity end!-//

//-!jindo.$Element.prototype.css start(jindo.$Element.prototype.opacity,jindo.$Element.prototype._getCss,jindo.$Element.prototype._setCss)!-//
/**
 	The css() method retrieves the CSS attributes of HTML elements.
	
	@method css
	@param {String+} vName The name (String) of the CSS attribute
	@return {String} Returns the value of the CSS attribute.
	@throws {jindo.$Except.NOT_USE_CSS} The exception occurs when the element cannot use css.
	@remark 
		<ul class="disc">
			<li>To execute the method, the CSS attribute uses Camel Notation. For example, the border-width-bottom attribute can be specified with borderWidthBottom.</li>
			<li>2.6.0 이상에서는 일반적은 스타일 문법과 카멜 표기번 모두 사용가능하다.예를 들면 border-width-bottom, borderWidthBottom 모두 가능하다.</li>
			<li>The css method uses cssFloat instead of float, because the float attribute is a reserved word in JavaScript. The method uses styleFloat in IE, and cssFloat in all other browsers.</li>
		</ul>
	@see jindo.$Element#attr
	@example
		<style type="text/css">
			#btn {
				width: 120px;
				height: 30px;
				background-color: blue;
			}
		</style>
		
		<span id="btn"></span>
		
		// Searches the value of the CSS attribute.
		$Element('btn').css('backgroundColor');		// rgb (0, 0, 255)
 */
/**
 	The css() method configures the CSS attributes of HTML elements.
	
	@method css
	@syntax vName, vValue
	@syntax oList
	@param {String+} vName The name (String) of the CSS attribute
	@param {String+ | Numeric} vValue The value to be configured in the CSS attribute.<br>Uses either numbers or character strings that include the unit.
	@param {Hash+} oList An object or hash object (jindo.$H() object) that has one or more CSS attributes and values.
	@return {this} CSS 속성 값을 반영한 인스턴스 자신
	@throws {jindo.$Except.NOT_USE_CSS} The exception occurs when the element cannot use css.
	@remark 
		<ul class="disc">
			<li>To execute the method, the CSS attribute uses Camel Notation. For example, the border-width-bottom attribute can be specified with borderWidthBottom.</li>
			<li>2.6.0 이상에서는 일반적은 스타일 문법과 카멜 표기번 모두 사용가능하다.예를 들면 border-width-bottom, borderWidthBottom 모두 가능하다.</li>
			<li>The css method uses cssFloat instead of float, because the float attribute is a reserved word in JavaScript. The method uses styleFloat in IE, and cssFloat in all other browsers.</li>
		</ul>
	@see jindo.$Element#attr
	@example
		// Configures the value of the CSS attribute.
		$Element('btn').css('backgroundColor', 'red');
		
		//Before
		<span id="btn"></span>
		
		//After
		<span id="btn" style="background-color: red;"></span>
	@example
		// Configures multiple CSS attribute values.
		$Element('btn').css({
			width: "200px",		// 200
			height: "80px"  	// The result would be same if it is set to 80.
		});
		
		//Before
		<span id="btn" style="background-color: red;"></span>
		
		//After
		<span id="btn" style="background-color: red; width: 200px; height: 80px;"></span>
 */

/**
 	hook() 메서드는 CSS명을 조회한다.
	@method hook
	@syntax vName
	@static
	@param {String+} vName CSS property name(String)
	@remark 2.7.0부터 사용가능하다.
	@return {Variant} CSS를 나타내는 값 혹은 함수.
	@example
		$Element.hook("textShadow");
		//webkitTextShadow
 */

/**
 	hook() 메서드는 개발자가 CSS를 만들면 진도에서 해당 CSS가 들어왔을 때 변경하여 사용한다.
	@method hook
	@syntax vName, vValue
	@syntax oList
	@static
	@param {String+} vName CSS명(String)
	@param {Variant} vValue 변경할 CSS명(String|Function)
	@param {Hash+} oList 하나 이상의 CSS 명과 값을 가지는 객체(Object) 또는 해시 객체(jindo.$H() 객체).
	@remark 2.7.0부터 사용가능하다.
	@return {$Element} $Element
	
	
	@example
		$Element.hook("textShadow","webkitTextShadow");
		
		$Element("some").css("textShadow");
		//이렇게 하면 진도에서는 webkitTextShadow의 값을 반환.
	@example
		//함수도 할당할 수 있다.
		$Element.hook("textShadow",function(){
			if(isIE&&version>10){
				return "MsTextShadow";
			}else if(isSafari){
				return "webkitTextShadow";
			}else{
				return "textShadow";
			}
		});
		
		$Element("some").css("textShadow");
		///IE이고 버전이 10이상인 경우는 MsTextShadow값을 가져옴
		//Safari인 경우 webkitTextShadow값으로 가져옴
 */

jindo._p_._revisionCSSAttr = function(name,vendorPrefix){
    var custumName = jindo.$Element.hook(name);
    if(custumName){
        name = custumName;
    }else{
        name = jindo._p_.cssNameToJavaScriptName(name).replace(/^(animation|perspective|transform|transition)/i,function(_1){
            return vendorPrefix[_1.toLowerCase()];
        });
    }
    return name;
};

jindo._p_.changeTransformValue = function(name,_test){
    return  (name+"").replace(/([\s|-]*)(?:transform)/,function(_,m1){ 
        return jindo._p_.trim(m1).length > 0 ? _ : m1+jindo._p_.getTransformStringForValue(_test);
    });
};

jindo.$Element.prototype.css = function(sName, sValue) {
    //-@@$Element.css-@@//
    var oArgs = jindo._checkVarType(arguments, {
        'g'     : [ 'sName:String+'],
        's4str' : [ jindo.$Jindo._F('sName:String+'), jindo.$Jindo._F('vValue:String+') ],
        's4num' : [ 'sName:String+', 'vValue:Numeric' ],
        's4obj' : [ 'oObj:Hash+']
    },"$Element#css");
    
    var e = this._element;

    switch(oArgs+"") {
        case 's4str':
        case 's4num':
            var obj = {};
            sName = jindo._p_._revisionCSSAttr(sName,jindo._p_.getStyleIncludeVendorPrefix());
            obj[sName] = sValue;
            sName = obj;
            break;
        case 's4obj':
            sName = oArgs.oObj;
            var obj = {};
            var vendorPrefix = jindo._p_.getStyleIncludeVendorPrefix();
            for (var i in sName) if (sName.hasOwnProperty(i)){
                obj[jindo._p_._revisionCSSAttr(i,vendorPrefix)] = sName[i]; 
            }
            sName = obj;
            break;
        case 'g':
            var vendorPrefix = jindo._p_.getStyleIncludeVendorPrefix();
            sName = jindo._p_._revisionCSSAttr(sName,vendorPrefix);
            var _getCss = this._getCss;

            if(sName == "opacity"){
                return this.opacity();
            }
            if((jindo._p_._JINDO_IS_FF||jindo._p_._JINDO_IS_OP)&&(sName=="backgroundPositionX"||sName=="backgroundPositionY")){
                var bp = _getCss(e, "backgroundPosition").split(/\s+/);
                return (sName == "backgroundPositionX") ? bp[0] : bp[1];
            }
            if ((!window.getComputedStyle) && sName == "backgroundPosition") {
                return _getCss(e, "backgroundPositionX") + " " + _getCss(e, "backgroundPositionY");
            }
            if ((!jindo._p_._JINDO_IS_OP && window.getComputedStyle) && (sName=="padding"||sName=="margin")) {
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
            if (k == "cssFloat" && jindo._p_._JINDO_IS_IE) k = "styleFloat";
        
            if((jindo._p_._JINDO_IS_FF||jindo._p_._JINDO_IS_OP)&&( k =="backgroundPositionX" || k == "backgroundPositionY")){
                var bp = this.css("backgroundPosition").split(/\s+/);
                v = k == "backgroundPositionX" ? v+" "+bp[1] : bp[0]+" "+v;
                this._setCss(e, "backgroundPosition", v);
            }else{
                this._setCss(e, k, /transition/i.test(k) ? jindo._p_.changeTransformValue(v):v);
            }
        }
    }
    
    return this;
};
//-!jindo.$Element.prototype.css end!-//

//-!jindo.$Element.prototype._getCss.hidden start!-//
/**
 	A function to use in css
	
	@method _getCss
	@ignore
	@param {Element} e
	@param {String} sName
 */
jindo.$Element.prototype._getCss = function(e, sName){
    var fpGetCss;
    if (window.getComputedStyle) {
        fpGetCss = function(e, sName){
            try{
                if (sName == "cssFloat") sName = "float";
                var d = e.ownerDocument || e.document || document;
                var sVal = e.style[sName];
                if(!e.style[sName]){
                    var computedStyle = d.defaultView.getComputedStyle(e,null);
                    sName = sName.replace(/([A-Z])/g,"-$1").replace(/^(webkit|ms)/g,"-$1").toLowerCase();
                    sVal =  computedStyle.getPropertyValue(sName);
                    sVal =  sVal===undefined?computedStyle[sName]:sVal;
                }
                if (sName == "textDecoration") sVal = sVal.replace(",","");
                return sVal;
            }catch(ex){
                throw new jindo.$Error((e.tagName||"document") + jindo.$Except.NOT_USE_CSS,"$Element#css");
            }
        };
    
    }else if (e.currentStyle) {
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
                throw new jindo.$Error((e.tagName||"document") + jindo.$Except.NOT_USE_CSS,"$Element#css");
            }
        };
    } else {
        fpGetCss = function(e, sName){
            try{
                if (sName == "cssFloat" && jindo._p_._JINDO_IS_IE) sName = "styleFloat";
                return e.style[sName];
            }catch(ex){
                throw new jindo.$Error((e.tagName||"document") + jindo.$Except.NOT_USE_CSS,"$Element#css");
            }
        };
    }
    jindo.$Element.prototype._getCss = fpGetCss;
    return fpGetCss(e, sName);
    
};
//-!jindo.$Element.prototype._getCss.hidden end!-//

//-!jindo.$Element.prototype._setCss.hidden start!-//
/**
 	A function to configure css in css
	
	@method _setCss
	@ignore
	@param {Element} e
	@param {String} k
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
 	The attr() method retrieves the attribute of HTML elements. If only one parameter is used, returns the value of the specified attribute; returns null if corresponding attribute exists.
	
	@method attr
	@param {String+} sName The name of the attribute (String)
	@return {String+} Returns the attribute value.
	@remark 2.2.0 버전 부터 &lt;select&gt; 엘리먼트에 사용시, 옵션값을 가져올 수 있다.
	@example
		<a href="http://www.naver.com" id="sample_a" target="_blank">Naver</a>
		
		$Element("sample_a").attr("href"); // http://www.naver.com
 */
/**
 	The attr() method configures the attribute of HTML elements.
	
	@method attr
	@syntax sName, vValue
	@syntax oList
	@param {String+} sName The name of the attribute (String)
	@param {Variant} vValue The value to be configured in the attribute. Uses either numbers or character strings that include the unit. If the configuration value is set to null, it deletes the HTML attribute.
	@param {Hash+} oList An object or hash object (jindo.$H() object) that has one or more attributes and values.
	@return {this} 속성 값을 반영한 인스턴스 자신
	@throws {jindo.$Except.NOT_USE_CSS} The exception occurs when sName is not characters, object, or $Hash.
	@remark 2.2.0 버전 부터 &lt;select&gt; 엘리먼트에 사용시, 옵션값을 설정할 수 있다.
	@see jindo.$Element#css
	@example
		$Element("sample_a").attr("href", "http://www.hangame.com/");
		
		//Before
		<a href="http://www.naver.com" id="sample_a" target="_blank">Naver</a>
		
		//After
		<a href="http://www.hangame.com" id="sample_a" target="_blank">Naver</a>
	@example
		$Element("sample_a").attr({
		    "href" : "http://www.hangame.com",
		    "target" : "_self"
		})
		
		//Before
		<a href="http://www.naver.com" id="sample_a" target="_blank">Naver</a>
		
		//After
		<a href="http://www.hangame.com" id="sample_a" target="_self">Naver</a>
	@example
		<select id="select">
			<option value="naver">naver</option>
			<option value="hangame">hangame</option>
			<option>juniornaver</option>
		</select>
		<script type="text/javascript">
			var wel = $Element("select");
			wel.attr("value"); // "naver"
			wel.attr("value", null).attr("value"); // null
			wel.attr("value", "hangame").attr("value"); // "hangame"
			wel.attr("value", "juniornaver").attr("value"); // "juniornaver"
			wel.attr("value", "naver").attr("value"); // "naver"
			wel.attr("value", ["hangame"]).attr("value"); // null
		</script>
	@example
		<select id="select" multiple="true">
			<option value="naver">naver</option>
			<option value="hangame">hangame</option>
			<option>juniornaver</option>
		</select>
		<script type="text/javascript">
			var wel = $Element("select");
			wel.attr("value"); // null
			wel.attr("value", "naver").attr("value"); // ["naver"]
			wel.attr("value", null).attr("value"); // null
			wel.attr("value", ["hangame"]).attr("value"); // ["hangame"]
			wel.attr("value", []).attr("value"); // null
			wel.attr("value", ["naver", "hangame"]).attr("value"); // ["naver", "hangame"]
			wel.attr("value", ["juniornaver", "me2day"]).attr("value"); // ["juniornaver"]
			wel.attr("value", ["naver", "happybean"]).attr("value"); // ["naver"]
		</script>
 */
jindo.$Element.prototype.attr = function(sName, sValue) {
    //-@@$Element.attr-@@//
    var oArgs = jindo._checkVarType(arguments, {
        'g'     : [ 'sName:String+'],
        's4str' : [ 'sName:String+', 'vValue:String+' ],
        's4num' : [ 'sName:String+', 'vValue:Numeric' ],
        's4nul' : [ 'sName:String+', 'vValue:Null' ],
        's4bln' : [ 'sName:String+', 'vValue:Boolean' ],
        's4arr' : [ 'sName:String+', 'vValue:Array+' ],
        's4obj' : [ jindo.$Jindo._F('oObj:Hash+')]
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
    };

    for(var k in sName){
        if(sName.hasOwnProperty(k)){
            var v = sName[k];
            // when remove property
            if(jindo.$Jindo.isNull(v)){
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
                if(k == "class"|| k == "className"){
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
 	The width() method retrieves the width of HTML elements.
	
	@method width
	@return {Number} Returns the real width (number) of HTML elements.
	@remark Each browser calculates the size of the Box model in a different manner. For this reason, the value of the width attribute of CSS may be different from the value returned by the width() method.
	@see jindo.$Element#height
	@example
		<style type="text/css">
			div { width:70px; height:50px; padding:5px; margin:5px; background:red; }
		</style>
		
		<div id="sample_div"></div>
		
		// Searches
		$Element("sample_div").width();	// 80
 */
/**
 	The width() method configures the width of HTML elements.
	
	@method width
	@param {Numeric} nWidth	The width value to be set in pixels.<br>The value of the parameter is numerics.
	@return {this} width 속성 값을 반영한 인스턴스 자신
	@remark Each browser calculates the size of the Box model in a different manner. For this reason, the value of the width attribute of CSS may be different from the value returned by the width() method.
	@see jindo.$Element#height
	@example
		// Configures the width value in HTML Elements described above.
		$Element("sample_div").width(200);
		
		//Before
		<style type="text/css">
			div { width:70px; height:50px; padding:5px; margin:5px; background:red; }
		</style>
		
		<div id="sample_div"></div>
		
		//After
		<div id="sample_div" style="width: 190px"></div>
 */
jindo.$Element.prototype.width = function(width) {
    //-@@$Element.width-@@//
    var oArgs = jindo._checkVarType(arguments, {
        'g' : [  ],
        's' : ["nWidth:Numeric"]
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
 	The height() method retrieves the real height of HTML elements.
	
	@method height
	@return {Number} Returns the real height (number) of HTML elements.
	@remark Each browser calculates the size of the Box model in a different manner. For this reason, the value of the height attribute of CSS may be different from the value returned by the height method.
	@see jindo.$Element#width
	@example
		<style type="text/css">
			div { width:70px; height:50px; padding:5px; margin:5px; background:red; }
		</style>
		
		<div id="sample_div"></div>
		
		// Searches
		$Element("sample_div").height(); // 60
 */
/**
 	The height() method configures the real height of HTML elements.
	
	@method height
	@param {Number} nHeight The height value to be set in pixels.<br>The value of the parameter is numerics. If the parameter is omitted, returns the height value.
	@return {this} height 속성 값을 반영한 인스턴스 자신
	@remark Each browser calculates the size of the Box model in a different manner. For this reason, the value of the height attribute of CSS may be different from the value returned by the height method.
	@see jindo.$Element#width
	@example
		// Configures the height value of HTML Elements described above.
		$Element("sample_div").height(100);
		
		//Before
		<style type="text/css">
			div { width:70px; height:50px; padding:5px; margin:5px; background:red; }
		</style>
		
		<div id="sample_div"></div>
		
		//After
		<div id="sample_div" style="height: 90px"></div>
 */
jindo.$Element.prototype.height = function(height) {
    //-@@$Element.height-@@//
    var oArgs = jindo._checkVarType(arguments, {
        'g' : [  ],
        's' : ["nHeight:Numeric"]
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
 	The className() retrieves the name of a class in HTML elements.
	
	@method className
	@return {String} Returns the Class name. When one or more classes have been specified, a character string that is separated with space is returned.
	@see jindo.$Element#hasClass
	@see jindo.$Element#addClass
	@see jindo.$Element#removeClass
	@see jindo.$Element#toggleClass
	@example
		<style type="text/css">
		p { margin: 8px; font-size:16px; }
		.selected { color:#0077FF; }
		.highlight { background:#C6E746; }
		</style>
		
		<p>Hello and <span id="sample_span" class="selected">Goodbye</span></p>
		
		// Searches a class name.
		$Element("sample_span").className(); // selected
 */
/**
 	The className() configures the name of a class in HTML elements.
	
	@method className
	@param {String+} sClass The class name to be specified. To specify one or more classes, list the class names by separating them with a single space.
	@return {this} 지정한 클래스를 반영한 인스턴스 자신
	@throws {jindo.$Except.NOT_FOUND_ARGUMENT} The exception occurs when no parameters exist.
	@see jindo.$Element#hasClass
	@see jindo.$Element#addClass
	@see jindo.$Element#removeClass
	@see jindo.$Element#toggleClass
	@example
		// Configures class names in HTML elements described above.
		$Element("sample_span").className("highlight");
		
		//Before
		<style type="text/css">
		p { margin: 8px; font-size:16px; }
		.selected { color:#0077FF; }
		.highlight { background:#C6E746; }
		</style>
		
		<p>Hello and <span id="sample_span" class="selected">Goodbye</span></p>
		
		//After
		<p>Hello and <span id="sample_span" class="highlight">Goodbye</span></p>
 */
jindo.$Element.prototype.className = function(sClass) {
    //-@@$Element.className-@@//
    var oArgs = jindo._checkVarType(arguments, {
        'g' : [  ],
        's' : [jindo.$Jindo._F("sClass:String+")]
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
 	The hasClass() method checks whether a specific class in HTML elements is used.
	
	@method hasClass
	@param {String+} sClass Class name to be checked
	@return {Boolean} Returns whether the class is used.
	@see jindo.$Element#className
	@see jindo.$Element#addClass
	@see jindo.$Element#removeClass
	@see jindo.$Element#toggleClass
	@example
		<style type="text/css">
			p { margin: 8px; font-size:16px; }
			.selected { color:#0077FF; }
			.highlight { background:#C6E746; }
		</style>
		
		<p>Hello and <span id="sample_span" class="selected highlight">Goodbye</span></p>
		
		// Checks whether to use a class.
		var welSample = $Element("sample_span");
		welSample.hasClass("selected"); 			// true
		welSample.hasClass("highlight"); 			// true
 */
jindo.$Element.prototype.hasClass = function(sClass) {
    //-@@$Element.hasClass-@@//
    var ___checkVarType = jindo._checkVarType;

    if(jindo._p_.canUseClassList()){
        jindo.$Element.prototype.hasClass = function(sClass){
            var oArgs = ___checkVarType(arguments, {
                '4str' : ["sClass:String+"]
            },"$Element#hasClass");
            return this._element.classList.contains(sClass);
        };
    } else {
        jindo.$Element.prototype.hasClass = function(sClass){
            var oArgs = ___checkVarType(arguments, {
                '4str' : ["sClass:String+"]
            },"$Element#hasClass");
            return (" "+this._element.className+" ").indexOf(" "+sClass+" ") > -1;
        };
    }
    return this.hasClass.apply(this,arguments);
};
//-!jindo.$Element.prototype.hasClass end!-//

//-!jindo.$Element.prototype.addClass start!-//
/**
 	The addClass() method adds classes in HTML elements.
	
	@method addClass
	@param {String+} sClass Class name to be added. A space is used to add multiple class names.
	@return {this} 지정한 클래스를 추가한 인스턴스 자신
	@see jindo.$Element#className
	@see jindo.$Element#hasClass
	@see jindo.$Element#removeClass
	@see jindo.$Element#toggleClass
	@example
		// Adds a class.
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
    //-@@$Element.addClass-@@//
    if(this._element.classList){
        jindo.$Element.prototype.addClass = function(sClass) {
            if(this._element==null) return this;
            var oArgs = jindo._checkVarType(arguments, {
                '4str' : ["sClass:String+"]
            },"$Element#addClass");
         
            var aClass = (sClass+"").split(/\s+/);
            var flistApi = this._element.classList;
            for(var i = aClass.length ; i-- ;) {
                aClass[i]!=""&&flistApi.add(aClass[i]);
            }
            return this;
        };
    } else {
        jindo.$Element.prototype.addClass = function(sClass) {
            var oArgs = jindo._checkVarType(arguments, {
                '4str' : ["sClass:String+"]
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
    }
    return this.addClass.apply(this,arguments);
};
//-!jindo.$Element.prototype.addClass end!-//

//-!jindo.$Element.prototype.removeClass start!-//
/**
 	The removeClass() method removes specific classes from HTML elements.
	
	@method removeClass
	@param {String+} sClass Class name to be removed. A space is used to remove multiple class names.
	@return {this} 지정한 클래스를 제거한 인스턴스 자신
	@see jindo.$Element#className
	@see jindo.$Element#hasClass
	@see jindo.$Element#addClass
	@see jindo.$Element#toggleClass
	@example
		// Removing a class.
		$Element("sample_span").removeClass("selected");
		
		//Before
		<p>Hello and <span id="sample_span" class="selected highlight">Goodbye</span></p>
		
		//After
		<p>Hello and <span id="sample_span" class="highlight">Goodbye</span></p>
	@example
		// Removes multiple classes.
		$Element("sample_span").removeClass("selected highlight");
		$Element("sample_span").removeClass("highlight selected");
		
		//Before
		<p>Hello and <span id="sample_span" class="selected highlight">Goodbye</span></p>
		
		//After
		<p>Hello and <span id="sample_span" class="">Goodbye</span></p> 
 */
jindo.$Element.prototype.removeClass = function(sClass) {
    //-@@$Element.removeClass-@@//
 	if(this._element.classList) {
        jindo.$Element.prototype.removeClass = function(sClass){
            var oArgs = jindo._checkVarType(arguments, {
                '4str' : ["sClass:String+"]
            },"$Element#removeClass");
            if(this._element==null) return this;
            var flistApi = this._element.classList;
            var aClass = (sClass+"").split(" ");
            for(var i = aClass.length ; i-- ;){
                aClass[i]!=""&&flistApi.remove(aClass[i]);
            }
            return this;
        };
 	} else {
        jindo.$Element.prototype.removeClass = function(sClass) {
            var oArgs = jindo._checkVarType(arguments, {
                '4str' : ["sClass:String+"]
            },"$Element#removeClass");
            var e = this._element;
            var sClassName = e.className;
            var aClass = (sClass+"").split(" ");
            var sEachClass;

            for (var i = aClass.length - 1; i >= 0; i--){
                if(/\W/g.test(aClass[i])) {
                     aClass[i] = aClass[i].replace(/(\W)/g,"\\$1");
                }

                sClassName = (" "+sClassName+" ").replace(new RegExp("\\s+"+ aClass[i] +"(?=\\s+)","g")," ");
            }
            
            e.className = sClassName.replace(/\s+$/, "").replace(/^\s+/, "");

            return this;
        };
 	}
	return this.removeClass.apply(this,arguments);
};
//-!jindo.$Element.prototype.removeClass end!-//

//-!jindo.$Element.prototype.toggleClass start(jindo.$Element.prototype.addClass,jindo.$Element.prototype.removeClass,jindo.$Element.prototype.hasClass)!-//
/**
 	The toggleClass() method removes a class if that class has already been applied to the HTML element, or adds a class if none are.<br>
	When only one parameter is entered, removes the class specified as a parameter if the class is being used. If the class is not used, adds the class. If two parameters are entered, removes the class that is being used and adds the other.
	
	@method toggleClass
	@param {String+} sClass Class name to be added or removed
	@param {String+} [sClass2] Class name to be added or removed
	@return {this} 지정한 클래스를 추가 혹은 제거한 인스턴스 자신
	@import core.$Element[hasClass,addClass,removeClass]
	@see jindo.$Element#className
	@see jindo.$Element#hasClass
	@see jindo.$Element#addClass
	@see jindo.$Element#removeClass
	@example
		// If one parameter exists
		$Element("sample_span1").toggleClass("highlight");
		$Element("sample_span2").toggleClass("highlight");
		
		//Before
		<p>Hello and <span id="sample_span1" class="selected highlight">Goodbye</span></p>
		<p>Hello and <span id="sample_span2" class="selected">Goodbye</span></p>
		
		//After
		<p>Hello and <span id="sample_span1" class="selected">Goodbye</span></p>
		<p>Hello and <span id="sample_span2" class="selected highlight">Goodbye</span></p>
	@example
		// If there are two parameters
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
    //-@@$Element.toggleClass-@@//
    var ___checkVarType = jindo._checkVarType;
    if(jindo._p_.canUseClassList()){
        jindo.$Element.prototype.toggleClass = function(sClass, sClass2){
            var oArgs = ___checkVarType(arguments, {
                '4str'  : ["sClass:String+"],
                '4str2' : ["sClass:String+", "sClass2:String+"]
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
                '4str'  : ["sClass:String+"],
                '4str2' : ["sClass:String+", "sClass2:String+"]
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
 	cssClass는 클래스의 유무를 확인한다.
	
	@method cssClass
	@param {String+} sName Class name
	@return {Boolean} Returns the Boolean value displaying the existence of the class.
	@since 2.0.0
	@see jindo.$Element#addClass
	@see jindo.$Element#removeClass
	@example
		// When only the first parameter has been entered
		<div id="sample_span1"/>
		$Element("sample_span1").cssClass("highlight");// false
 */
/**
 	The cssClass can add, remove a class.
	
	@method cssClass
	@syntax sName, bClassType
	@syntax oList
	@param {String+} sName Class name
	@param {Boolean} bClassType If the value is true, adds a class. If false, removes the class.
	@param {Hash+} oList An object or hash object (jindo.$H() object) that has one or more attributes and Boolean values.
	@return {this} 지정한 클래스를 추가/삭제한 인스턴스 자신
	@since 2.0.0
	@see jindo.$Element#addClass
	@see jindo.$Element#removeClass
	@example
		// When the second parameter has also been entered
		$Element("sample_span1").cssClass("highlight",true);
		-> <div id="sample_span1" class="highlight"/>
		
		$Element("sample_span1").cssClass("highlight",false);
		-> <div id="sample_span1" class=""/>
	@example
		// When the first parameter has been entered as an object.
		<div id="sample_span1" class="bar"/>
		
		$Element("sample_span1").cssClass({
			"foo": true,
			"bar" : false
		});
		-> <div id="sample_span1" class="foo"/>
 */
jindo.$Element.prototype.cssClass = function(vClass, bCondition){
    var oArgs = jindo._checkVarType(arguments, {
        'g'  : ["sClass:String+"],
        's4bln' : ["sClass:String+", "bCondition:Boolean"],
        's4obj' : ["oObj:Hash+"]
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
 	The text() method retrieves the text node value of HTML elements.
	
	@method text
	@return {String} Returns the text node (string) of HTML elements.
	@example
		<ul id="sample_ul">
			<li>One</li>
			<li>Two</li>
			<li>Three</li>
			<li>Four</li>
		</ul>
		
		// Searches the text node value.
		$Element("sample_ul").text();
		// Results
		//	One
		//	Two
		//	Three
		//	Four
 */
/**
 	The text() method configures the text node value of HTML elements.
	
	@method text
	@param {String+} sText Text to be specified
	@return {this} 지정한 값을 설정한 인스턴스 자신
	@example
		// Configures the text node value
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
		// Configures the text node value.
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
    //-@@$Element.text-@@//
    var oArgs = jindo._checkVarType(arguments, {
        'g'  : [],
        's4str' : ["sText:String+"],
        's4num' : [jindo.$Jindo._F("sText:Numeric")],
        's4bln' : ["sText:Boolean"]
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
                  * Does not operates normally when the textContext is Get in Opera version 11.01. For this reason, when it is set to get, innerText is used. When it is set to set, textContent is used (http:devcafe.nhncorp.com/ajaxui/295768).
                 */ 
                if (tag == "textarea" || tag == "input"){
                    ele.value = sText + "";
                }else{
                    var oDoc = ele.ownerDocument || ele.document || document;
                    this.empty();
                    ele.appendChild(oDoc.createTextNode(sText));
                }
            }catch(e){
                return ele.innerHTML = (sText + "").replace(/&/g, '&amp;').replace(/</g, '&lt;');
            }
            
            return this;
    }
};
//-!jindo.$Element.prototype.text end!-//

//-!jindo.$Element.prototype.html start!-//
/**
 	The html() method retrieves the inner HTML code of HTML elements.
	
	@method html
	@return {String} Returns the inner HTML (string).
	@see https://developer.mozilla.org/en/DOM/element.innerHTML element.innerHTML - MDN Docs
	@see jindo.$Element#outerHTML
	@example
		<div id="sample_container">
			<p><em>Old</em> content</p>
		</div>
		
		// Searches inner HTML values.
		$Element("sample_container").html(); // <p><em>Old</em> content</p>
 */
/**
 	The html() method configures the inner HTML code of HTML elements. 이때 모든 하위 요소의 모든 이벤트 핸들러를 제거한다.
	
	@method html
	@param {String+} sHTML The HTML character string to be set as the inner HTML code.
	@return {this} 지정한 값을 설정한 인스턴스 자신
	@remark When modifying the col of colgroup in Internet Explorer 8, delete and recreate the colgroup and then add col. 
	@see https://developer.mozilla.org/en/DOM/element.innerHTML element.innerHTML - MDN Docs
	@see jindo.$Element#outerHTML
	@example
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
    //-@@$Element.html-@@//
    var isIe = jindo._p_._JINDO_IS_IE;
    var isFF = jindo._p_._JINDO_IS_FF;
    var _param = {
                'g'  : [],
                's4str' : [jindo.$Jindo._F("sText:String+")],
                's4num' : ["sText:Numeric"],
                's4bln' : ["sText:Boolean"]
    };
    var ___checkVarType = jindo._checkVarType;
    
    if (isIe) {
        jindo.$Element.prototype.html = function(sHTML){
            var oArgs = ___checkVarType(arguments,_param,"$Element#html");
            switch(oArgs+""){
                case "g":
                    return this._element.innerHTML;
                case "s4str":
                case "s4num":
                case "s4bln":
                    sHTML += "";
                    if(jindo.cssquery) jindo.cssquery.release();
                    var oEl = this._element;
    
                    while(oEl.firstChild){
                        oEl.removeChild(oEl.firstChild);
                    }
                    /*
                      * Fixes it so as to ensure that no problem exists even if setting innerHTML in Select tag or TABLE, TR, THEAD
 * and TBODY tag in some situations of IE or FireFox - hooriza
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
                                     * For the select tag in IE, if there is a selected option among the options,
* the options before it are all set to true if selected is in the middle;
* to solve this, use cloneNode and change selected after copying the option. - mixed
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
        };
    }else if(isFF){
        jindo.$Element.prototype.html = function(sHTML){
            var oArgs = ___checkVarType(arguments,_param,"$Element#html");
            
            switch(oArgs+""){
                case "g":
                    return this._element.innerHTML;
                    
                case "s4str":
                case "s4num":
                case "s4bln":
                	// jindo._p_.releaseEventHandlerForAllChildren(this);
                	
                    sHTML += ""; 
                    var oEl = this._element;
                    
                    if(!oEl.parentNode){
                        /*
                         {{html_1}}
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
        };
    }else{
        jindo.$Element.prototype.html = function(sHTML){
            var oArgs = ___checkVarType(arguments,_param,"$Element#html");
            
            switch(oArgs+""){
                case "g":
                    return this._element.innerHTML;
                    
                case "s4str":
                case "s4num":
                case "s4bln":
                	// jindo._p_.releaseEventHandlerForAllChildren(this);
                	
                    sHTML += ""; 
                    var oEl = this._element;
                    oEl.innerHTML = sHTML;
                    return this;
                    
            }
            
        };
    }
    
    return this.html.apply(this,arguments);
};
//-!jindo.$Element.prototype.html end!-//

//-!jindo.$Element.prototype.outerHTML start!-//
/**
 	The outerHTML() method returns the HTML code including the inner HTML code of the HTML element and its tag.
	
	@method outerHTML
	@return {String} HTML code.
	@see jindo.$Element#html
	@example
		<h2 id="sample0">Today is...</h2>
		
		<div id="sample1">
		  	<p><span id="sample2">Sample</span> content</p>
		</div>
		
		// Searches outer HTML values.
		$Element("sample0").outerHTML(); // <h2 id="sample0">Today is...</h2>
		$Element("sample1").outerHTML(); // <div id="sample1">  <p><span id="sample2">Sample</span> content</p>  </div>
		$Element("sample2").outerHTML(); // <span id="sample2">Sample</span>
 */
jindo.$Element.prototype.outerHTML = function() {
    //-@@$Element.outerHTML-@@//
    var e = this._element;
    e = jindo.$Jindo.isDocument(e)?e.documentElement:e;
    if (e.outerHTML !== undefined) return e.outerHTML;
    
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
//-!jindo.$Element.prototype.outerHTML end!-//

//-!jindo.$Element.prototype.toString start(jindo.$Element.prototype.outerHTML)!-//
/**
 	The toString() method converts the code of the element to a string and returns it (same with the outerHTML method).
	
	@method toString
	@return {String} HTML codes.
	@see jindo.$Element#outerHTML
 */
jindo.$Element.prototype.toString = function(){
    return this.outerHTML()||"[object $Element]";
};
//-!jindo.$Element.prototype.toString end!-//

//-!jindo.$Element.prototype.attach start(jindo.$Element.prototype.isEqual,jindo.$Element.prototype.isChildOf,jindo.$Element.prototype.detach, jindo.$Element.event_etc, jindo.$Element.domready, jindo.$Element.unload, jindo.$Event)!-//
/**
 	The attach() method  assigns an event to the element.
	@syntax sEvent, fpCallback
	@syntax oList
	@method attach
	@param {String+} sEvent Event name
		<ul class="disc">
			<li>The "on" prefix must not be used as part of an event name.</li>
			<li>Use "mousewheel" to handle mouse wheel scroll events.</li>
			<li>The domready, mouseenter, mouseleave, and mousewheel events can be used in addition to the basic events.</li>
			<li>delegate의 기능이 추가됨 (@을 구분자로 selector을 같이 사용할 수 있다.)</li>
		</ul>
	@param {Function+} fpCallback The callback function to be executed when an event occurs.
	@param {Hash+} oList 하나 이상의 이벤트명과 함수를 가지는 객체(Object) 또는 해시 객체(jindo.$H() 객체).
	@return {this} 이벤트를 할당한 인스턴스 자신
	@throws {jindo.$Except.NOT_WORK_DOMREADY} The exception occurs when the domready function is used within the frame in Internet Explorer.
	@since 2.0.0
	@remark 2.2.0 버전부터, load와 domready이벤트는 각각 Window와 Document에서 발생하는 이벤트이지만 서로를 교차해서 등록하여도 이벤트가 올바르게 발생한다.
	@remark 2.5.0 버전부터 @을 구분자로 delegate처럼 사용할 수 있다.
	@see jindo.$Element#detach
	@see jindo.$Element#delegate
	@see jindo.$Element#undelegate
	@example
		function normalEvent(e){
			alert("click");
		}
		function groupEvent(e){
			alert("group click");
		}
		
		//Allocates general events.
		$Element("some_id").attach("click",normalEvent);
	@example
		function normalEvent(e){
			alert("click");
		}
		
		//delegate처럼 사용하기 위해서는 @을 구분자로 사용가능.
		$Element("some_id").attach("click@.selected",normalEvent);
		
		
		$Element("some_id").attach({
			"click@.selected":normalEvent,
			"click@.checked":normalEvent2,
			"click@.something":normalEvent3
		});
	@example
		function loadHandler(e){
			// empty
		}
		function domreadyHandler(e){
			// empty
		}
		var welDoc = $Element(document);
		var welWin = $Element(window);
		
		// document에 load 이벤트 핸들러 등록
		welDoc.attach("load", loadHandler);
		welDoc.hasEventListener("load"); // true
		welWin.hasEventListener("load"); // true
		
		// detach는 document, window 어느것에서 해도 상관없다.
		welDoc.detach("load", loadHandler);
		welDoc.hasEventListener("load"); // false
		welWin.hasEventListener("load"); // false
		
		// window에 domready 이벤트 핸들러 등록
		welWin.attach("domready", domreadyHandler);
		welWin.hasEventListener("domready"); // true
		welDoc.hasEventListener("domready"); // true
		
		// detach는 document, window 어느것에서 해도 상관없다.
		welWin.detach("domready", domreadyHandler);
		welWin.hasEventListener("domready"); // false
		welDoc.hasEventListener("domready"); // false
 */   
jindo.$Element.prototype.attach = function(sEvent, fpCallback){
    var oArgs = jindo._checkVarType(arguments, {
        '4str'  : ["sEvent:String+", "fpCallback:Function+"],
        '4obj'  : ["hListener:Hash+"]
    },"$Element#attach"), oSplit, hListener;
   
    switch(oArgs+""){
       case "4str":
            oSplit = jindo._p_.splitEventSelector(oArgs.sEvent);
            this._add(oSplit.type,oSplit.event,oSplit.selector,fpCallback);
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
 	The detach() method unregisters the event handler that has been registered to the element.
	@syntax sEvent, fpCallback
	@syntax oList
	@method detach
	@param {String+} sEvent Event nane
	@param {Function+} fpCallback The callback function to be executed when an event occurs.
	@param {Hash+} oList 하나 이상의 이벤트명과 함수를 가지는 객체(Object) 또는 해시 객체(jindo.$H() 객체).
	@return {this} 이벤트 핸들러를 등록 해제한 인스턴스 자신
	@remark 2.2.0 버전부터, load와 domready이벤트는 각각 Window와 Document에서 발생하는 이벤트이지만 서로를 교차해서 등록하여도 이벤트가 올바르게 발생한다.
	@remark 2.5.0 버전부터 @을 구분자로 delegate처럼 사용할 수 있다.
	@see jindo.$Element#detach
	@see jindo.$Element#delegate
	@see jindo.$Element#undelegate
	@since 2.0.0
	@example
		function normalEvent(e){
			alert("click");
		}
		function groupEvent(e){
			alert("group click");
		}
		function groupEvent2(e){
			alert("group2 click");
		}
		function groupEvent3(e){
			alert("group3 click");
		}
		
		//Allocates general events.
		$Element("some_id").attach("click",normalEvent);
		
		//General event deallocation. General events must have a function for it to be deallocated.
		$Element("some_id").detach("click",normalEvent);
   @example
		function normalEvent(e){
			alert("click");
		}
		
		//undelegate처럼 사용하기 위해서는 @을 구분자로 사용가능.
		$Element("some_id").attach("click@.selected",normalEvent);
		$Element("some_id").detach("click@.selected",normalEvent);
 */
jindo.$Element.prototype.detach = function(sEvent, fpCallback){
    var oArgs = jindo._checkVarType(arguments, {
        // 'group_for_string'  : ["sEvent:String+"],
        '4str'  : ["sEvent:String+", "fpCallback:Function+"],
        '4obj'  : ["hListener:Hash+"]
    },"$Element#detach"), oSplit, hListener;
   
    switch(oArgs+""){
       case "4str":
            oSplit = jindo._p_.splitEventSelector(oArgs.sEvent);
            this._del(oSplit.type,oSplit.event,oSplit.selector,fpCallback);
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

//-!jindo.$Element.prototype.delegate start(jindo.$Element.prototype.undelegate, jindo.$Element.event_etc, jindo.$Element.domready, jindo.$Element.unload, jindo.$Event)!-//
/**
	The delegate() method handles events through event delegation.<br>
	The event delegation is an efficient way to manage events, by delegating event management to the upper element with event bubbling
	
	@method delegate
	@param {String+} sEvent The event name.<br>The "on" prefix must be omitted.
	@param {Variant} vFilter A filter that is used to execute the event handler for specific HTML elements only.<br>
	The filter can be specified by using the CSS selector (string) and a function.
		<ul class="disc">
			<li>When the string is entered, the element to execute the event handler can be configured by using the CSS selector.</li>
			<li>The function that returns the Boolean value can be entered as a parameter. If this function is used, the callback function (fCallback) that will be executed when the function returns true must be specified as an additional parameter.</li>
		</ul>
	@param {Function+} [fCallback] The callback function to be executed when the function specified in the vFilter returns true.
	@return {this} 이벤트 위임을 적용한 인스턴스 자신
	@remark The domready, mousewheel, mouseleave, and mouseenter events are available in version 2.0.0 and higher.
	@since 1.4.6
	@see jindo.$Element#attach
	@see jindo.$Element#detach
	@see jindo.$Element#undelegate
	@example
		<ul id="parent">
			<li class="odd">1</li>
			<li>2</li>
			<li class="odd">3</li>
			<li>4</li>
		</ul>
	
		// When using a CSS selector as a filter
		$Element("parent").delegate("click",
			".odd", 			// Filter
			function(eEvent){	// Callback function
				alert("Executes it when li that has the odd class is clicked");
			});
	@example
		<ul id="parent">
			<li class="odd">1</li>
			<li>2</li>
			<li class="odd">3</li>
			<li>4</li>
		</ul>
	
		// When using a function as a filter
		$Element("parent").delegate("click",
			function(oEle,oClickEle){	// Filter
				return oClickEle.innerHTML == "2"
			},
			function(eEvent){			// Callback function
				alert("Executes it if the innerHTML of the clicked element is 2");
			});
*/
jindo.$Element.prototype.delegate = function(sEvent , vFilter , fpCallback){
    var oArgs = jindo._checkVarType(arguments, {
        '4str'  : ["sEvent:String+", "vFilter:String+", "fpCallback:Function+"],
        '4fun'  : ["sEvent:String+", "vFilter:Function+", "fpCallback:Function+"]
    },"$Element#delegate");
    return this._add("delegate",sEvent,vFilter,fpCallback);
};
//-!jindo.$Element.prototype.delegate end!-//

//-!jindo.$Element.prototype.undelegate start(jindo.$Element.prototype.delegate)!-//
/**
	The undelegate() method undelegates the event delegation made by using the delegate() method.
	
	@method undelegate
	@param {String+} sEvent The event name that is used to register event delegation.<br>The "on" prefix must be omitted. 
	@param {Variant} [vFilter] The filter specified while registering event delegation. If this filter is not entered, all conditions of a specific event among events allocated as delegate will be removed.
	@param {Function+} [fCallback] The callback function specified while registering event delegation.
	@return {this} 이벤트 위임을 해제한 인스턴스 자신
	@since 1.4.6
	@see jindo.$Element#attach
	@see jindo.$Element#detach
	@see jindo.$Element#delegate
	@example
		<ul id="parent">
			<li class="odd">1</li>
			<li>2</li>
			<li class="odd">3</li>
			<li>4</li>
		</ul>
		
		// Callback function
		function fnOddClass(eEvent){
			alert("Executes it when li that has the odd class is clicked");
		};
		function fnOddClass2(eEvent){
			alert("Executes it when li that has the odd class is clicked2");
		};
		function fnOddClass3(eEvent){
			alert("Executes it when li that has the odd class is clicked3");
		};
		
		// Uses event delegation
		$Element("parent").delegate("click", ".odd", fnOddClass);
		
		// Releases the event with fnOddClass only
		$Element("parent").undelegate("click", ".odd", fnOddClass);
 */
jindo.$Element.prototype.undelegate = function(sEvent , vFilter , fpCallback){
    var oArgs = jindo._checkVarType(arguments, {
        '4str'  : ["sEvent:String+", "vFilter:String+", "fpCallback:Function+"],
        '4fun'  : ["sEvent:String+", "vFilter:Function+", "fpCallback:Function+"],
        'group_for_string'  : ["sEvent:String+", "vFilter:String+"],
        'group_for_function'  : ["sEvent:String+", "vFilter:Function+"]
    },"$Element#undelegate");
    return this._del("delegate",sEvent,vFilter,fpCallback);
};
//-!jindo.$Element.prototype.undelegate end!-//

//-!jindo.$Element.event_etc.hidden start!-//
jindo._p_.customEventAttach = function(sType,sEvent,vFilter,fpCallback,fpCallbackBind,eEle,fpAdd){
    if(!jindo._p_.hasCustomEventListener(eEle.__jindo__id,sEvent,vFilter)) {
        var CustomEvent = jindo._p_.getCustomEvent(sEvent);
        var customInstance = new CustomEvent();
        var events = customInstance.events;
        
        customInstance.real_listener.push(fpCallback);
        customInstance.wrap_listener.push(fpCallbackBind);
        
        for(var i = 0, l = events.length ; i < l ; i++){
            customInstance["_fp"+events[i]] = jindo.$Fn(customInstance[events[i]],customInstance).bind();
            fpAdd(sType, events[i], vFilter, customInstance["_fp"+events[i]]);
        }
        jindo._p_.addCustomEventListener(eEle,eEle.__jindo__id,sEvent,vFilter,customInstance);
    } else {
        var customInstance = jindo._p_.getCustomEventListener(eEle.__jindo__id, sEvent, vFilter).custom;
        if(customInstance.real_listener){
            customInstance.real_listener.push(fpCallback);
            customInstance.wrap_listener.push(fpCallbackBind);
        }
    }
};

jindo._p_.normalCustomEventAttach = function(ele,sEvent,jindo_id,vFilter,fpCallback,fpCallbackBind){
    if(!jindo._p_.normalCustomEvent[sEvent][jindo_id]){
        jindo._p_.normalCustomEvent[sEvent][jindo_id] = {};
        jindo._p_.normalCustomEvent[sEvent][jindo_id].ele = ele;
        jindo._p_.normalCustomEvent[sEvent][jindo_id][vFilter] = {};
        jindo._p_.normalCustomEvent[sEvent][jindo_id][vFilter].real_listener = [];
        jindo._p_.normalCustomEvent[sEvent][jindo_id][vFilter].wrap_listener = [];
    }
    jindo._p_.normalCustomEvent[sEvent][jindo_id][vFilter].real_listener.push(fpCallback);
    jindo._p_.normalCustomEvent[sEvent][jindo_id][vFilter].wrap_listener.push(fpCallbackBind);
};

/**
	Internal function that adds events
	
	@method _add
	@ignore
	@param {String} sType Checks whether the event is delegate or general.
	@param {String} sEvent Event name
	@param {String | Function} vFilter Filter function
	@param {Function} fpCallback Event callback function
	@return {this} 인스턴스 자신
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
    
    if(jindo._p_.hasCustomEvent(sEvent)){
        vFilter = vFilter||"_NONE_";
        var fpCallbackBind = jindo.$Fn(fpCallback,this).bind();
        jindo._p_.normalCustomEventAttach(ele,sEvent,jindo_id,vFilter,fpCallback,fpCallbackBind);
        if(jindo._p_.getCustomEvent(sEvent)){
            jindo._p_.customEventAttach(sType, sEvent,vFilter,fpCallback,fpCallbackBind,ele,jindo.$Fn(this._add,this).bind());
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
        
        if((!document.addEventListener)&&("domready"==sEvent)){
            if(window.top != window) throw  jindo.$Error(jindo.$Except.NOT_WORK_DOMREADY,"$Element#attach");
            jindo.$Element._domready(ele, fpCallback);
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

jindo._p_.customEventDetach = function(sType,sEvent,vFilter,fpCallback,eEle,fpDel) {
    var customObj = jindo._p_.getCustomEventListener(eEle.__jindo__id, sEvent, vFilter);
    var customInstance = customObj.custom;
    var events = customInstance.events;

    for(var i = 0, l = events.length; i < l; i++) {
        fpDel(sType, events[i], vFilter, customInstance["_fp"+events[i]]);
    }
};

/**
	The internal function used to delete events
	
	@method _del
	@ignore
	@param {String} sType Checks whether the event is delegate or general.
	@param {String} sEvent sType Checks whether the event is delegate or general.
	@param {String|Function} vFilter Filter function
	@param {Function} fpCallback Event callback function
	@return {this} 인스턴스 자신
 */
jindo.$Element.prototype._del = function(sType, sEvent, vFilter, fpCallback){
    var oManager = jindo.$Element.eventManager;
    var realEvent = sEvent;
    sEvent = sEvent.toLowerCase();
    var oEvent = oManager.splitGroup(sEvent);
    sEvent = oEvent.event;
    var sGroup = oEvent.group;
    var oDoc = this._element.ownerDocument || this._element.document || document;
    if(jindo._p_.hasCustomEvent(sEvent)){
        var jindo_id = this._element.__jindo__id;
        vFilter = vFilter||"_NONE_";
        
        var oNormal = jindo._p_.getNormalEventListener(jindo_id, sEvent, vFilter);
        
        
        
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
            var oNormalJindo = jindo._p_.normalCustomEvent[sEvent][jindo_id];
            var count = 0;
            for(var i in oNormalJindo){
                if(i!=="ele"){
                    count++;
                    break;
                }
            }
            if(count === 0){
                delete jindo._p_.normalCustomEvent[sEvent][jindo_id];
            }else{
                delete jindo._p_.normalCustomEvent[sEvent][jindo_id][vFilter];
            }
        }
        
        if(jindo._p_.customEvent[sEvent]){
            // var customInstance = jindo._p_.getCustomEventListener(jindo__id, sEvent, vFilter).custom;
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
            jindo._p_.setCustomEventListener(jindo_id, sEvent, vFilter, aNewReal, aNewWrap);
            if(aNewReal.length==0){
                jindo._p_.customEventDetach(sType, sEvent,vFilter,fpCallback,this._element,jindo.$Fn(this._del,this).bind());
                delete jindo._p_.customEventStore[jindo_id][sEvent][vFilter];
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
        
        if((!document.addEventListener)&&("domready"==sEvent)){
            var aNewDomReady = [];
            var list = jindo.$Element._domready.list;
            for(var i=0,l=list.length; i < l ;i++){
                if(list[i]!=fpCallback){
                    aNewDomReady.push(list[i]);
                }   
            }
            jindo.$Element._domready.list = aNewDomReady;
            return this;
        }
        // if(sGroup === jindo._p_.NONE_GROUP && !jindo.$Jindo.isFunction(fpCallback)){
        if(sGroup === jindo._p_.NONE_GROUP && !jindo.$Jindo.isFunction(fpCallback)&&!vFilter){
            throw new jindo.$Error(jindo.$Except.HAS_FUNCTION_FOR_GROUP,"$Element#"+(sType=="normal"?"detach":"delegate"));
        }
    
        oManager.removeEventListener(this._key, sEvent, sGroup, sType, vFilter, fpCallback);
    }
    
    return this;
};

/**
	The object that manages the events of $Element.
	
	@ignore
 */
jindo._p_.mouseTouchPointerEvent = function (sEvent){
    var eventMap = {};

    if(window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0) {
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
    } else if(jindo._p_._JINDO_IS_MO) {
        eventMap = {
            "mousedown":"touchstart",
            "mouseup":"touchend",
            "mousemove":"touchmove",
            "pointerdown":"touchstart",
            "pointerup":"touchend",
            "pointermove":"touchmove"
        };
    }

    jindo._p_.mouseTouchPointerEvent = function(sEvent) {
        return eventMap[sEvent]?eventMap[sEvent]:sEvent;    
    };
    
    return jindo._p_.mouseTouchPointerEvent(sEvent);
};

jindo.$Element.eventManager = (function() {
    var eventStore = {};

    function bind(fpFunc, oScope, aPram) {
        return function() {
            var args = jindo._p_._toArray( arguments, 0);
            if (aPram.length) args = aPram.concat(args);
            return fpFunc.apply(oScope, args);
        };
    }

    return {
        /**
        	A function that adjusts the callback function to be operated when an event is allocated to the browser where the mouseenter or mouseleave event does not exist.
	Used when mouseenter or mouseleave is used for delegate in Internet Explorer. 
	
	@method revisionCallback
	@ignore
	@param {String} sType Checks whether the event is delegate or general.
	@param {String} sEvent Event name
	@param {Function} fpCallback Event callback function
         */
        revisionCallback : function(sType, sEvent, realEvent, fpCallback){
            if((document.addEventListener||jindo._p_._JINDO_IS_IE&&(sType=="delegate"))&&(realEvent=="mouseenter"||realEvent=="mouseleave")) 
            // ||(jindo._p_._JINDO_IS_IE&&(sType=="delegate")&&(realEvent=="mouseenter"||realEvent=="mouseleave")))
               {
                var fpWrapCallback = jindo.$Element.eventManager._fireWhenElementBoundary(sType, fpCallback);
                fpWrapCallback._origin_ = fpCallback;
                fpCallback = fpWrapCallback;
            }
            return fpCallback;
        },
        /**
        	The function that emulates a browser that does not have mouseenter or mouseleave events
	
	@method _fireWhenElementBoundary
	@ignore
	@param {String} sType Checks whether the event is delegate or general.
	@param {Function} fpCallback Event callback function
         */
        _fireWhenElementBoundary : function(sType, fpCallback){
            return function(oEvent) {
                var woRelatedElement = oEvent.relatedElement?jindo.$Element(oEvent.relatedElement):null;
                var eElement = oEvent.currentElement;
                if(sType == "delegate"){
                    eElement = oEvent.element;
                }
                if(woRelatedElement && (woRelatedElement.isEqual(eElement) || woRelatedElement.isChildOf(eElement))) return;
                
                fpCallback(oEvent);
            };
        },
        /**
        	The function that is used to adjust the event names, for they are different by browser.
	
	@method revisionEvent
	@ignore
	@param {String} sType Checks whether the event is delegate or general.
	@param {String} sEvent Event name
         */
        revisionEvent : function(sType, sEvent, realEvent){
            if (document.addEventListener !== undefined) {
                this.revisionEvent = function(sType, sEvent, realEvent){

                    // In IE distinguish upper and lower case and if prefix is 'ms' return as well.
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
                    }else if (sEvent == "mousewheel" && !jindo._p_._JINDO_IS_WK && !jindo._p_._JINDO_IS_OP && !jindo._p_._JINDO_IS_IE) {
                        /*
                          * DOMMouseScroll does not work as well in IE 9.
                         */
                        sEvent = "DOMMouseScroll";  
                    }else if (sEvent == "mouseenter" && (!jindo._p_._JINDO_IS_IE||sType=="delegate")){
                        sEvent = "mouseover";
                    }else if (sEvent == "mouseleave" && (!jindo._p_._JINDO_IS_IE||sType=="delegate")){
                        sEvent = "mouseout";
                    }else if(sEvent == "transitionend"||sEvent == "transitionstart"){
                        var sPostfix = sEvent.replace("transition","");
                        var info = jindo._p_.getStyleIncludeVendorPrefix();

                        if(info.transition != "transition"){
                            sPostfix = sPostfix.substr(0,1).toUpperCase() + sPostfix.substr(1);
                        }

                        sEvent = info.transition + sPostfix;
                    }else if(sEvent == "animationstart"||sEvent == "animationend"||sEvent == "animationiteration"){
                        var sPostfix = sEvent.replace("animation","");
                        var info = jindo._p_.getStyleIncludeVendorPrefix();

                        if(info.animation != "animation"){
                            sPostfix = sPostfix.substr(0,1).toUpperCase() + sPostfix.substr(1);
                        }

                        sEvent = info.animation + sPostfix;
                    }else if(sEvent === "focusin"||sEvent === "focusout"){
                        sEvent = sEvent === "focusin" ? "focus":"blur";

                    /*
                     * On IE9 and above version need to implement 'oninput' event fallback.
    Since IE9 support oninput event, but IE9 has buggy implementation. When delete contents(ex. using backspace key) on input element it doesn't apply changes correctly.
    So, on IE9 use 'keyup', and the above versions use 'propertychange' instead of using 'oninput' event.
                     */
                    } else if(sEvent == "input" && jindo._p_._JINDO_IS_IE && document.documentMode <= 9) {
                        sEvent = "keyup";
                    }
                    return jindo._p_.mouseTouchPointerEvent(sEvent);
                };
            }else{
                this.revisionEvent = function(sType, sEvent,realEvent){
                    // In IE distinguish upper and lower case and if prefix is 'ms' return as well.
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
                    /*
                     * When the mouseenter or mouseleave is used for delegate in Internet Explorer, it must be modified so that emulation is done by using mouseover or mouseleave.
                     */
                    if(sType=="delegate"&&sEvent == "mouseenter") {
                        sEvent = "mouseover";
                    }else if(sType=="delegate"&&sEvent == "mouseleave") {
                        sEvent = "mouseout";
                    } else if(sEvent == "input") {
                        sEvent = "keyup";
                    }

                    return jindo._p_.mouseTouchPointerEvent(sEvent);
                };
            }
            return this.revisionEvent(sType, sEvent,realEvent);
        },
        /**
        			A function for testing
			
			@method test
			@ignore
         */
        test : function(){
            return eventStore;
        },
        /**
        			A function to check whether the function that corresponds to the key has been initialized
			
			@method isInit
			@ignore
			@param {String} sKey Element key value
         */
        isInit : function(sKey){
            return !!eventStore[sKey];
        },
        /**
        			A function to initialize
			
			@method init
			@ignore
			@param {String} sKey Element key value
			@param {Element} eEle Element
         */
        init : function(sKey, eEle){
            eventStore[sKey] = {
                "ele" : eEle,
                "event" : {}
            };
        },
        /**
        			Returns the information of the key value.
			
			@method getEventConfig
			@ignore
			@param {String} sKey Element key value
         */
        getEventConfig : function(sKey){
            return eventStore[sKey];
        },
        /**
        			A function to check whether the key has an event. 
			
			@method  hasEvent
			@ignore
			@param {String} sKey Element key value
			@param {String} sEvent Event name
         */
        hasEvent : function(sKey, sEvent,realEvent){
            if(!document.addEventListener && sEvent.toLowerCase() == "domready"){
                if(jindo.$Element._domready.list){
                    return jindo.$Element._domready.list.length > 0 ? true : false;
                }else{
                    return false;
                }
            }
            
            // sEvent = jindo.$Element.eventManager.revisionEvent("", sEvent,realEvent);
            
            try{
                return !!eventStore[sKey]["event"][sEvent];
            }catch(e){
                return false;
            }
        },
        /**
        			A function to check whether a group exists
			
			@method hasGroup
			@ignore
			@param {String} sKey Element key value 
			@param {String} sEvent Event name
			@param {String} sEvent Group name
         */
        hasGroup : function(sKey, sEvent, sGroup){
            return !!eventStore[sKey]["event"][sEvent]["type"][sGroup];
        },
        createEvent : function(wEvent,realEvent,element,delegatedElement){
            // wEvent = wEvent || window.event;
            if (wEvent.currentTarget === undefined) {
                wEvent.currentTarget = element;
            }
            var weEvent = jindo.$Event(wEvent);
            if(!weEvent.currentElement){
                weEvent.currentElement = element;
            }
            weEvent.realType = realEvent;
            weEvent.delegatedElement = delegatedElement;
            return weEvent;
        },
        /**
        			A function that initializes events
			
			@method initEvent
			@ignore
			@param {Hash+} oThis this object
			@param {String} sEvent Event name
			@param {String} sEvent Group name
         */
        initEvent : function(oThis, sEvent, realEvent, sGroup){
            var sKey = oThis._key;
            var oEvent = eventStore[sKey]["event"];
            var that = this;
            
            var fAroundFunc = bind(function(sEvent,realEvent,scope,wEvent){
                wEvent = wEvent || window.event;
                var oEle = wEvent.target || wEvent.srcElement;
                var oManager = jindo.$Element.eventManager;
                var oConfig = oManager.getEventConfig((wEvent.currentTarget||this._element).__jindo__id);
                
                var oType = oConfig["event"][sEvent].type;
                for(var i in oType){
                    if(oType.hasOwnProperty(i)){
                        var aNormal = oType[i].normal;
                        for(var j = 0, l = aNormal.length; j < l; j++){
                            aNormal[j].call(this,scope.createEvent(wEvent,realEvent,this._element,null));
                        }
                        var oDelegate = oType[i].delegate;
                        var aResultFilter;
                        var afpFilterCallback;
                        for(var k in oDelegate){
                            if(oDelegate.hasOwnProperty(k)){
                                aResultFilter = oDelegate[k].checker(oEle);
                                if(aResultFilter[0]){
                                    afpFilterCallback = oDelegate[k].callback;
                                    var weEvent;//.element = aResultFilter[1];
                                    for(var m = 0, leng = afpFilterCallback.length; m < leng ; m++){
                                        weEvent = scope.createEvent(wEvent,realEvent,this._element,aResultFilter[1]);
                                        weEvent.element = aResultFilter[1];
                                        afpFilterCallback[m].call(this, weEvent);
                                    }
                                }
                            }
                        }
                    }
                    
                }
            },oThis,[sEvent,realEvent,this]);
            
            oEvent[sEvent] = {
                "listener" : fAroundFunc,
                "type" :{}
            }   ;
            
            jindo.$Element._eventBind(oThis._element,sEvent,fAroundFunc,(realEvent==="focusin" || realEvent==="focusout"));
            
        },
        /**
        			A function that initializes groups
			
			@method initGroup
			@ignore
			@param {String} sKey Element key value
			@param {String} sEvent Event name
			@param {String} sEvent Group name
         */
        initGroup : function(sKey, sEvent, sGroup){
            var oType = eventStore[sKey]["event"][sEvent]["type"];
            oType[sGroup] = {
                "normal" : [],
                "delegate" :{}
            };
        },
        /**
        			A function that adds an event
			
			@method addEventListener
			@ignore
			@param {String} ssKey Element key value
			@param {String} sEvent Event name
			@param {String} sGroup Group name
			@param {String} sType Checks whether the event is delegate or general.
			@param {Function} vFilter A CSS selector to filter or a filter function
			@param {Function} fpCallback Callback function
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
         			A function to check whether delegate exists
			
			@method hasDelegate
			@ignore
			@param {Hash+} oEventInfo Event information object
			@param {Function} vFilter A CSS selector or filter function for filtering
         */
        hasDelegate : function(oEventInfo,vFilter){
            return !!oEventInfo.delegate[vFilter];
        },
        containsElement : function(eOwnEle, eTarget, sCssquery,bContainOwn){
            if(eOwnEle == eTarget&&bContainOwn){
                return jindo.$$.test(eTarget,sCssquery);
            }
            var aSelectElement = jindo.$$(sCssquery,eOwnEle);
            for(var i = 0, l = aSelectElement.length; i < l; i++){
                if(aSelectElement[i] == eTarget){
                    return true;
                }
            }  
            return false;
        },
        /**
        			A function to initialize delegate
			
			@method initDelegate
			@ignore
			@param {Hash+} eOwnEle
			@param {Hash+} oEventInfo Event information object
			@param {Function} vFilter A CSS selector or filter function for filtering
         */
        initDelegate : function(eOwnEle,oEventInfo,vFilter){
            var fpCheck;
            if(jindo.$Jindo.isString(vFilter)){
                fpCheck = bind(function(eOwnEle,sCssquery,oEle){
                    var eIncludeEle = oEle;
                    var isIncludeEle = this.containsElement(eOwnEle, oEle, sCssquery,true);
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
            };
        },
        /**
        			A function to add delegate
			
			@method addDelegate
			@ignore
			@param {Hash+} oEventInfo Event information object
			@param {Function} vFilter A CSS selector to filter or a filter function
			@param {Function} fpCallback Callback function
         */
        addDelegate : function(oEventInfo,vFilter,fpCallback){
            oEventInfo.delegate[vFilter].callback.push(fpCallback);
        },
        /**
        			A function that releases an event
			
			@method removeEventListener
			@ignore
			@param {String} ssKey Element key value
			@param {String} sEvent Event name
			@param {String} sGroup Group name
			@param {String} sType Checks whether the event is delegate or general.
			@param {Function} vFilter A CSS selector to filter or a filter function
			@param {Function} fpCallback Callback function
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
                // console.log(oEventInfo.delegate,oEventInfo.delegate[vFilter],vFilter);
                aOldCallback  = oEventInfo.delegate[vFilter].callback;
            }
            if (sEvent == jindo._p_.NONE_GROUP || jindo.$Jindo.isFunction(fpCallback)) {
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
        			A function that releases all events (Do not use this function).
			
			@method cleanUpAll
			@ignore
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
        			Used to delete all events by using the element key.
			
			@method cleanUpUsingKey
			@ignore
			@param {String} sKey
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
        			A function that releases all events corresponding to the key (Do not use this function)
			
			@method cleanUp
			@ignore
			@param {String} ssKey Element key value
			@param {String} sEvent Event name
			@param {Boolean} bForce Whether to release them forcibly
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
        			A function that separates the event name from the group
			
			@method splitGroup
			@ignore
			@param {String} sEvent Event name
         */
        splitGroup : function(sEvent){
            var aMatch = /\s*(.+?)\s*\(\s*(.*?)\s*\)/.exec(sEvent);
            if(aMatch){
                return {
                    "event" : aMatch[1].toLowerCase(),
                    "group" : aMatch[2].toLowerCase()
                };
            }else{
                return {
                    "event" : sEvent.toLowerCase(),
                    "group" : jindo._p_.NONE_GROUP
                };
            }
        },
        /**
        			A function that searches for the parent from delegate
			
			@method _getParent
			@ignore
			@param {Element} oOwnEle Its own element
			@param {Element} oEle Element for comparison
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
// The storage structure of $Element.
//
// {
//	"key" : {
//		"ele" : ele,
//		"event" : {
//			"click":{
//				"listener" : function(){},
//				"type":{
//					"-none-" : {
//						"normal" : [],
//						"delegate" :{
//							"vFilter" :{
//								"checker" : function(){},
//								"callback" : [function(){}]
//							}
//							
//						}
//					}
//				}
//			}
//		}
//	}
//}
 */
//-!jindo.$Element.event_etc.hidden end!-//

//-!jindo.$Element.domready.hidden start!-//
/**
	Emulates the domready (=DOMContentLoaded) event in Internet Explorer.
	
	@method _domready
	@filter desktop
	@ignore
*/
jindo.$Element._domready = function(doc, func) {
    if (jindo.$Element._domready.list === undefined) {
        var f = null;
        
        jindo.$Element._domready.list = [func];
        
        // use the trick by Diego Perini
        // http://javascript.nwbox.com/IEContentLoaded/
        var done = false, execFuncs = function(){
            if(!done) {
                done = true;
                var l = jindo.$Element._domready.list.concat();
                var evt = {
                    type : "domready",
                    target : doc,
                    currentTarget : doc
                };

                while(f = l.shift()) f(evt);
            }
        };
        
        (function (){
            try {
                doc.documentElement.doScroll("left");
            } catch(e) {
                setTimeout(arguments.callee, 50);
                return;
            }
            execFuncs();
        })();

        // trying to always fire before onload
        doc.onreadystatechange = function() {
            if (doc.readyState == 'complete') {
                doc.onreadystatechange = null;
                execFuncs();
            }
        };

    } else {
        jindo.$Element._domready.list.push(func);
    }
};

//-!jindo.$Element.domready.hidden end!-//



/**
 	@fileOverview A file to define the extended method of the jindo.$Element() object
	@name element.extend.js
	@author NAVER Ajax Platform
 */

//-!jindo.$Element.prototype.appear start(jindo.$Element.prototype.opacity,jindo.$Element.prototype.show)!-//
/**
 	The appear() method makes HTML elements slowly appear (fade-in effect).
	
	@method appear
	@param {Numeric} [nDuration] The time it takes for HTML elements to appear completely in seconds.
	@param {Function} [fCallback] The callback function to be executed after the HTML element have completely appeared
	@return {this} Fade-in 효과를 적용한 인스턴스 자신
	@remark
		<ul class="disc">
			<li>As filter is used in Internet Explorer 6, the elements disappear if they have the position attribute. In this case, the HTML element must have no position attribute.</li>
			<li>For Webkit-based browsers (Safari version 5 or higher, Mobile Safari, Chrome, Mobile Webkit) and Opera version 10.60 and higher, the CSS3 transition attribute is used. Use java scripts in all other browsers.</li>
		</ul>
	@see http://www.w3.org/TR/css3-transitions/ CSS Transitions - W3C
	@see jindo.$Element#show
	@see jindo.$Element#disappear
	@example
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
    //-@@$Element.appear-@@//
    var oTransition = jindo._p_.getStyleIncludeVendorPrefix();
    var name = oTransition.transition;
    var endName = name == "transition" ? "end" : "End";

    function appear() {
        var oArgs = jindo._checkVarType(arguments, {
            '4voi' : [ ],
            '4num' : [ 'nDuration:Numeric'],
            '4fun' : [ 'nDuration:Numeric' ,'fpCallback:Function+']
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
        return [duration, callback];
    }

    if(oTransition.transition) {
        jindo.$Element.prototype.appear = function(duration, callback) {
            var aOption = appear.apply(this,jindo._p_._toArray(arguments));
            duration = aOption[0];
            callback = aOption[1];
            var self = this;
            
            if(this.visible()){
                
                setTimeout(function(){
                    callback.call(self,self);
                },16);
                
                return this; 
            }
            
            
            var ele = this._element;
            var name = oTransition.transition;
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

            jindo._p_.setOpacity(ele,"1");
            return this;
        };
    } else {
        jindo.$Element.prototype.appear = function(duration, callback) {
            var aOption = appear.apply(this,jindo._p_._toArray(arguments));
            duration = aOption[0];
            callback = aOption[1];
            var self = this;
            var op   = this.opacity();
            if(this._getCss(this._element,"display")=="none") op = 0;
            
            if (op == 1) return this;
            try { clearTimeout(this._fade_timer); } catch(e){}

            var step = (1-op) / ((duration||0.3)*100);
            var func = function(){
                op += step;
                self.opacity(op);

                if (op >= 1) {
                    self._element.style.filter="";
                    callback.call(self,self);
                } else {
                    self._fade_timer = setTimeout(func, 10);
                }
            };

            this.show();
            func();
            return this;
        };
    }
    return this.appear.apply(this,arguments);
    
};
//-!jindo.$Element.prototype.appear end!-//

//-!jindo.$Element.prototype.disappear start(jindo.$Element.prototype.opacity)!-//
/**
 	The disappear() method makes HTML elements slowly disappear (fade-out effect).
	
	@method disappear
	@param {Numeric} [nDuration] The time it takes for HTML elements to disappear completely in seconds.
	@param {Function} [fCallback] The callback function to be executed after the HTML element have completely disappeared.
	@return {this} Fade-out 효과를 적용한 인스턴스 자신
	@remark
		<ul class="disc">
			<li>If the HTML element has completely disappeared, the attribute of the element changes to "none."</li>
			<li>For Webkit-based browsers (Safari version 5 or higher, Mobile Safari, Chrome, Mobile Webkit) and Opera version 10.6 and higher, the CSS3 transition attribute is used. Use java scripts in all other browsers.</li>
		</ul>
	@see http://www.w3.org/TR/css3-transitions/ CSS Transitions - W3C
	@see jindo.$Element#hide
	@see jindo.$Element#appear
	@example
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
    //-@@$Element.disappear-@@//
    var oTransition = jindo._p_.getStyleIncludeVendorPrefix();
    var name = oTransition.transition;
    var endName = name == "transition" ? "end" : "End";

    function disappear(){
        var oArgs = jindo._checkVarType(arguments, {
            '4voi' : [ ],
            '4num' : [ 'nDuration:Numeric'],
            '4fun' : [ 'nDuration:Numeric' ,'fpCallback:Function+']
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
        return [duration, callback];
    }
    if (oTransition.transition) {
        jindo.$Element.prototype.disappear = function(duration, callback) {
            var aOption = disappear.apply(this,jindo._p_._toArray(arguments));
            duration = aOption[0];
            callback = aOption[1];
            
            var self = this;
            
            if(!this.visible()){
                
                setTimeout(function(){
                    callback.call(self,self);
                },16);
                
                return this; 
            }
            
            // endName = "End";
            // var name = "MozTransition";
            var name = oTransition.transition;
            var ele = this._element;
            var bindFunc = function(){
                self.hide();
                ele.style[name + 'Property'] = '';
                ele.style[name + 'Duration'] = '';
                ele.style[name + 'TimingFunction'] = '';
                ele.style.opacity = '';
                callback.call(self,self);
                ele.removeEventListener(name+endName, arguments.callee , false );
            };

            ele.addEventListener( name+endName, bindFunc , false );
            ele.style[name + 'Property'] = 'opacity';
            ele.style[name + 'Duration'] = duration+'s';
            ele.style[name + 'TimingFunction'] = 'linear';
            
            jindo._p_.setOpacity(ele,'0');
            return this;
        };
    }else{
        jindo.$Element.prototype.disappear = function(duration, callback) {
            var aOption = disappear.apply(this,jindo._p_._toArray(arguments));
            duration = aOption[0];
            callback = aOption[1];
            
            var self = this;
            var op   = this.opacity();
    
            if (op == 0) return this;
            try { clearTimeout(this._fade_timer); } catch(e){}

            var step = op / ((duration||0.3)*100);
            var func = function(){
                op -= step;
                self.opacity(op);

                if (op <= 0) {
                    self._element.style.display = "none";
                    self.opacity(1);
                    callback.call(self,self);
                } else {
                    self._fade_timer = setTimeout(func, 10);
                }
            };

            func();
            return this;
        };
    }
    return this.disappear.apply(this,arguments);
};
//-!jindo.$Element.prototype.disappear end!-//

//-!jindo.$Element.prototype.offset start!-//
/**
 	The offset() method retrieves the position of HTML elements.
	
	@method offset
	@return {Object} Returns the position value of the HTML element as an object.
		@return {Number} .top 문서의 맨 위에서 HTML 요소의 윗 부분까지의 거리
		@return {Number} .left 문서의 왼쪽 가장자리에서 HTML 요소의 왼쪽 가장자리까지의 거리
	@remark
		<ul class="disc">
			<li>The offset used to determine the position is the corner of the left upper side of the page of the browser.</li>
			<li>It must be applied while the HTML elements are displayed. If elements are not displayed on the screen, the operation may not be normal.</li>
			<li>For some browsers in some situations, the position of the inline element cannot be correctly implemented. In this case, change the position attribute of the element to a relative value.</li>
		</ul>
	@example
		<style type="text/css">
			div { background-color:#2B81AF; width:20px; height:20px; float:left; left:100px; top:50px; position:absolute;}
		</style>
		
		<div id="sample"></div>
		
		// Searches the value of a position.
		$Element("sample").offset(); // { left=100, top=50 }
 */
/**
 	The offset() method sets the position of HTML elements.
	
	@method offset
	@param {Numeric} nTop The distance from the top of a document to the top of the HTML element in pixels.
	@param {Numeric} nLeft The distance from the left edge of a document to the left edge of HTML elements in pixels.
	@return {this} 위치 값을 반영한 인스턴스 자신
	@remark
		<ul class="disc">
			<li>The offset used to determine the position is the corner of the left upper side of the page of the browser.</li>
			<li>It must be applied while the HTML elements are displayed. If elements are not displayed on the screen, the operation may not be normal.</li>
			<li>For some browsers in some situations, the position of the inline element cannot be correctly implemented. In this case, change the position attribute of the element to a relative value.</li>
		</ul>
	@example
		<style type="text/css">
			div { background-color:#2B81AF; width:20px; height:20px; float:left; left:100px; top:50px; position:absolute;}
		</style>
		
		<div id="sample"></div>
		
		// Configures the value of a position.
		$Element("sample").offset(40, 30);
		
		//Before
		<div id="sample"></div>
		
		//After
		<div id="sample" style="top: 40px; left: 30px;"></div>
 */
jindo.$Element.prototype.offset = function(nTop, nLeft) {
    //-@@$Element.offset-@@//
    var oArgs = jindo._checkVarType(arguments, {
        'g' : [ ],
        's' : [ 'nTop:Numeric', 'nLeft:Numeric']
    },"$Element#offset");
    
    switch(oArgs+""){
        case "g":
            return this.offset_get();
            
        case "s":
            return this.offset_set(oArgs.nTop, oArgs.nLeft);
            
    }
};

jindo.$Element.prototype.offset_set = function(nTop,nLeft) {
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

jindo.$Element.prototype.offset_get = function(nTop,nLeft) {
    var oEl = this._element,
        oPhantom = null,
        bIE = jindo._p_._JINDO_IS_IE,
        nVer = 0;

    if(bIE) {
        nVer = document.documentMode || jindo.$Agent().navigator().version;
    }

    var oPos = { left : 0, top : 0 },
        oDoc = oEl.ownerDocument || oEl.document || document,
        oHtml = oDoc.documentElement,
        oBody = oDoc.body;

    if(oEl.getBoundingClientRect) { // has getBoundingClientRect
        if(!oPhantom) {
            var bHasFrameBorder = (window == top);

            if(!bHasFrameBorder) {
                try {
                    bHasFrameBorder = (window.frameElement && window.frameElement.frameBorder == 1);
                } catch(e){}
            }

            if((bIE && nVer < 8 && window.external) && bHasFrameBorder&&document.body.contains(oEl)) {
                oPhantom = { left: 2, top: 2 };
            } else {
                oPhantom = { left: 0, top: 0 };
            }
        }

        var box;

        try {
            box = oEl.getBoundingClientRect();
        } catch(e) {
            box = { left: 0, top: 0};
        }

        if (oEl !== oHtml && oEl !== oBody) {
            oPos.left = box.left - oPhantom.left;
            oPos.top = box.top - oPhantom.top;
            oPos.left += oHtml.scrollLeft || oBody.scrollLeft;
            oPos.top += oHtml.scrollTop || oBody.scrollTop;

        }

    } else if (oDoc.getBoxObjectFor) { // has getBoxObjectFor
        var box = oDoc.getBoxObjectFor(oEl),
            vpBox = oDoc.getBoxObjectFor(oHtml || oBody);

        oPos.left = box.screenX - vpBox.screenX;
        oPos.top = box.screenY - vpBox.screenY;

    } else {
        for(var o = oEl; o; o = o.offsetParent) {
            oPos.left += o.offsetLeft;
            oPos.top += o.offsetTop;
        }

        for(var o = oEl.parentNode; o; o = o.parentNode) {
            if (o.tagName == 'BODY') break;
            if (o.tagName == 'TR') oPos.top += 2;

            oPos.left -= o.scrollLeft;
            oPos.top -= o.scrollTop;
        }
    }

    return oPos;
};
//-!jindo.$Element.prototype.offset end!-//

//-!jindo.$Element.prototype.evalScripts start!-//
/**
 	The evalScripts() method executes the JavaScript code included in the character string.<br>
	If the character string that contains the &lt;script&gt; tag is specified as a parameter, the content in the &lt;script&gt; is parsed and the eval() method is executed.
	
	@method evalScripts
	@param {String+} sHTML The HTML character string that contains the &lt;script&gt; element
	@return {this} 인스턴스 자신
	@example
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
    //-@@$Element.evalScripts-@@//
    var oArgs = jindo._checkVarType(arguments, {
        '4str' : [ "sHTML:String+" ]
    },"$Element#evalScripts");
    var aJS = [];
    var leftScript = '<script(\\s[^>]+)*>(.*?)</';
    var rightScript = 'script>';
    sHTML = sHTML.replace(new RegExp(leftScript+rightScript, 'gi'), function(_1, _2, sPart) { aJS.push(sPart); return ''; });
    eval(aJS.join('\n'));
    
    return this;

};
//-!jindo.$Element.prototype.evalScripts end!-//

//-!jindo.$Element.prototype.clone start!-//
/**
   	Returns a duplicate of the node on which this method was called. same cloneNode method.
  	@method clone
  	@since 2.8.0
	@param {Boolean} [bDeep=true] true if the children of the node should also be cloned, or false to clone only the specified node.
	@return {jindo.$Element} cloned $Element
	@example

		<div id="sample">
		    <div>Hello</div>
		</div>
		
		//children node cloned
		$Element("sample").clone(); 
		-> 
		$Element(
			<div id="sample">
	    		<div>Hello</div>
			</div>
		);
		
		//specified node cloned
		$Element("sample").clone(false); 
		-> 
		$Element(
			<div id="sample">
			</div>
		);
 */
jindo.$Element.prototype.clone = function(bDeep) {
    var oArgs = jindo._checkVarType(arguments, {
        'default' : [ ],
        'set' : [ 'bDeep:Boolean' ]
    },"$Element#clone");
    
    if(oArgs+"" == "default") {
        bDeep = true;
    }
    
    return jindo.$Element(this._element.cloneNode(bDeep));
};
//-!jindo.$Element.prototype.clone end!-//

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
 	A function to prepend an element at the front
	
	@method _prepend
	@param {Element} elBase A base element
	@param {Element} elAppend The element to be prepended
	@return {jindo.$Element} The element of a second parameter
	@ignore
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
 	The append() method assigns the HTML element, specified as a parameter, as the last child node of the element included in the jindo.$Element() object.
	
	@method append
	@syntax sId
	@syntax vElement
	@param {String+} sId The ID of the HTML element to be assigned as the last child node
	@param {Element+ | Node} vElement The HTML element to be assigned as the last child node or the jindo.$Element() object can be specified as a parameter.
	@return {this} 인스턴스 자신
	@see jindo.$Element#prepend
	@see jindo.$Element#before
	@see jindo.$Element#after
	@see jindo.$Element#appendTo
	@see jindo.$Element#prependTo
	@see jindo.$Element#wrap
	@example
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
	@example
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
    //-@@$Element.append-@@//
    this._element.appendChild(jindo.$Element._common(oElement,"append"));
    return this;
};
//-!jindo.$Element.prototype.append end!-//

//-!jindo.$Element.prototype.prepend start(jindo.$Element._prepend)!-//
/** 
 	The prepend() method assigns the HTML element, specified as a parameter, as the first child node of the element included in the jindo.$Element() object.
	
	@method prepend
	@syntax sId
	@syntax vElement
	@param {String+} sId The ID of the HTML element to be assigned as the first child node
	@param {Element+ | Node} vElement The HTML element to be assigned as the first child node or the jindo.$Element() object can be specified as a parameter.
	@return {this} 인스턴스 자신
	@see jindo.$Element#append
	@see jindo.$Element#before
	@see jindo.$Element#after
	@see jindo.$Element#appendTo
	@see jindo.$Element#prependTo
	@see jindo.$Element#wrap
	@example
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
	@example
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
    //-@@$Element.prepend-@@//
    jindo.$Element._prepend(this._element, jindo.$Element._common(oElement,"prepend"));
    
    return this;
};
//-!jindo.$Element.prototype.prepend end!-//

//-!jindo.$Element.prototype.replace start(jindo.$Element._common)!-//
/**
 	The replace() method replaces the HTML element in the jindo.$Element() object with the element of the specified parameter.
	
	@method replace
	@syntax sId
	@syntax vElement
	@param {String+} sId The ID of the HTML element to be replaced
	@param {Element+ | Node} vElement The HTML element to be replaced or the jindo.$Element() object can be specified as a parameter.
	@return {this} 인스턴스 자신
	@example
		// Replaces it with HTML elements that have an id with sample2
		// with the HTML element that has an id with sample1.
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
	@example
		// Replaces with a new DIV element.
		$Element("btn").replace($("<div>Sample</div>"));
		
		//Before
		<button id="btn">Sample</button>
		
		//After
		<div>Sample</div>
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
 	The appendTo() method assigns the element included in the jindo.$Element() object as the last child element of the element specified as a parameter.
	
	@method appendTo
	@syntax sId
	@syntax vElement
	@param {String+} sId The ID of the HTML element to which the last child node is to be assigned
	@param {Element+ | Node} vElement The HTML element to be assigned as the last child node or the jindo.$Element() object can be specified as a parameter.
	@return {this} 인스턴스 자신
	@see jindo.$Element#append
	@see jindo.$Element#prepend
	@see jindo.$Element#before
	@see jindo.$Element#after
	@see jindo.$Element#prependTo
	@see jindo.$Element#wrap
	@example
		// Adds the HTML element that has an id with sample1
		// to the HTML element that has an id with sample2.
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
    //-@@$Element.appendTo-@@//
    jindo.$Element._common(oElement,"appendTo").appendChild(this._element);
    return this;
};
//-!jindo.$Element.prototype.appendTo end!-//

//-!jindo.$Element.prototype.prependTo start(jindo.$Element._prepend, jindo.$Element._common)!-//
/**
 	The prependTo() method assigns the element included in the jindo.$Element() object as the first child node of the element specified as a parameter.
	
	@method prependTo
	@syntax sId
	@syntax vElement
	@param {String+} sId The ID of the HTML element to which the first child node is to be assigned
	@param {Element+ | Node} vElement The HTML element where the first child node will be assigned or the jindo.$Element() object can be specified as a parameter.
	@return {this} 인스턴스 자신
	@see jindo.$Element#append
	@see jindo.$Element#prepend
	@see jindo.$Element#before
	@see jindo.$Element#after
	@see jindo.$Element#appendTo
	@see jindo.$Element#wrap
	@example
		// Adds the HTML element that has an id with sample1
		// to the HTML element that has an id with sample2.
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
    //-@@$Element.prependTo-@@//
    jindo.$Element._prepend(jindo.$Element._common(oElement,"prependTo"), this._element);
    return this;
};
//-!jindo.$Element.prototype.prependTo end!-//

//-!jindo.$Element.prototype.before start(jindo.$Element._common)!-//
/**
 	The before() method assigns the element, specified as a parameter, as the previous sibling node (previousSibling) of the element included in the jindo.$Element() object.
	
	@method before
	@syntax sId
	@syntax vElement
	@param {String+} sId The ID of the HTML element to be assigned as the previous sibling node
	@param {Element+ | Node} vElement The HTML element to be assigned as the previous sibling node or the jindo.$Element() object can be specified as a parameter.
	@return {this} 인스턴스 자신
	@see jindo.$Element#append
	@see jindo.$Element#prepend
	@see jindo.$Element#after
	@see jindo.$Element#appendTo
	@see jindo.$Element#prependTo
	@see jindo.$Element#wrap
	@example
		// Adds the HTML element that has an id with sample1
		// right before the HTML element that has an id with sample2.
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
	@example
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
    //-@@$Element.before-@@//
    var o = jindo.$Element._common(oElement,"before");

    this._element.parentNode.insertBefore(o, this._element);

    return this;
};
//-!jindo.$Element.prototype.before end!-//

//-!jindo.$Element.prototype.after start(jindo.$Element.prototype.before, jindo.$Element._common)!-//
/**
 	The after() method assigns the element, specified as a parameter, as the next sibling node (nextSibling) of the element included in the jindo.$Element() object.
	
	@method after
	@syntax sId
	@syntax vElement
	@param {String+} sId The ID of the HTML element to be assigned as the next sibling node
	@param {Element+ | Node} vElement The HTML element to be assigned as the next sibling node or the jindo.$Element() object can be specified as a parameter.
	@return {this} 인스턴스 자신
	@see jindo.$Element#append
	@see jindo.$Element#prepend
	@see jindo.$Element#before
	@see jindo.$Element#appendTo
	@see jindo.$Element#prependTo
	@see jindo.$Element#wrap
	@example
		// Adds the HTML element that has an id with sample2
		// right after the HTML element that has an id with sample1.
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
	@example
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
    //-@@$Element.after-@@//
    oElement = jindo.$Element._common(oElement,"after");
    this.before(oElement);
    jindo.$Element(oElement).before(this);

    return this;
};
//-!jindo.$Element.prototype.after end!-//

//-!jindo.$Element.prototype.parent start!-//
/**
 	The parent() method searches for the element corresponding to the parent node of HTML elements.
	
	@method parent
	@param {Function+} [fCallback] The callback function that specifies the conditions to search for the parent element. If the parameter is omitted, returns the parent element; if the callback function is specified as a parameter, returns the parent element that returns true. At this time, the callback function returns the result as an array. The jindo.$Element() object of the parent element being searched is entered as the parameter of the callback function.
	@param {Numeric} [nLimit] The level of the parent element to search for. If the parameter is omitted, searches for all parent elements; if the parameter is set to null, searches for the parent element with the limited level without any condition.
	@return {Variant} The array of the parent element that satisfies the condition or the jindo.$Element() object that includes the parent element. If the parent element is returned omitting the parameter, returns the jindo.$Element() object; otherwise, returns the array that has jindo.$Element() object as an element.
	@see jindo.$Element#child
	@see jindo.$Element#prev
	@see jindo.$Element#next
	@see jindo.$Element#first
	@see jindo.$Element#last
	@see jindo.$Element#indexOf
	@example
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
			// Returns $Element wrapping the DIV whose id div3.
		
			parent = welTarget.parent(function(v){
			        return v.hasClass("sample");
			    });
			// Returns an array that consists of $Elements that have wrapped the DIV in which the id is div3
			// and the array that includes the child element.
		
			parent = welTarget.parent(function(v){
			        return v.hasClass("sample");
			    }, 1);
			// Returns an array that has the jindo.$Element() object as an element.
		</script>
 */
jindo.$Element.prototype.parent = function(pFunc, limit) {
    //-@@$Element.parent-@@//
    var oArgs = jindo._checkVarType(arguments, {
        '4voi' : [],
        '4fun' : [ 'fpFunc:Function+' ],
        '4nul' : [ 'fpFunc:Null' ],
        'for_function_number' : [ 'fpFunc:Function+', 'nLimit:Numeric'],
        'for_null_number' : [ 'fpFunc:Null', 'nLimit:Numeric' ]
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

    while(e.parentNode && limit-- != 0) {
        try {
            p = jindo.$Element(e.parentNode);
        } catch(err) {
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
 	The child() method searches for element corresponding to subnodes of HTML elements.
	
	@method child
	@param {Function+} [fCallback] The callback function that specifies the conditions to search for the child element.<br>If the parameter is omitted, returns the child element; if the callback function is specified as a parameter, returns the child element that returns true. At this time, the callback function returns the result as an array. The jindo.$Element() object of the child element being searched is entered as the parameter of the callback function.
	@param {Numeric} [nLimit] The level of the child element to search for. If the parameter is omitted, searches for all child elements; if the parameter is set to null, searches for the child element with the limited level without any condition.
	@return {Variant} An array that includes a child element or an array of the child element that satisfies the condition. If one child element is returned, the jindo.$Element() object is returned; otherwise, the array that has the jindo.$Element() object as an element is returned.
	@see jindo.$Element#parent
	@see jindo.$Element#prev
	@see jindo.$Element#next
	@see jindo.$Element#first
	@see jindo.$Element#last
	@see jindo.$Element#indexOf
	@example
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
			// Returns the $Element that has wrapped the DIV in which the id is div1
			// and Returns an array that consists of $Elements that have wrapped the DIV in which the id is div7.
		
			child = welTarget.child(function(v){
			        return v.hasClass("sample");
			    });
			// Returns the $Element that has wrapped the DIV in which the id is div2,
			// the $Element that has wrapped the DIV in which the id is div5,
			// the $Element that has wrapped the DIV in which the id is div6,
			// and an array that consists of $Elements that have wrapped the DIV in which the id is div7.
		
			child = welTarget.child(function(v){
			        return v.hasClass("sample");
			    }, 1);
			//  Returns an array that consists of $Elements that have wrapped the DIV in which the id is div7.
		
			child = welTarget.child(function(v){
			        return v.hasClass("sample");
			    }, 2);
			// Returns the $Element that has wrapped the DIV in which the id is div2
			// and an array that consists of $Elements that have wrapped the DIV in which the id is div7.
		</script>
 */
jindo.$Element.prototype.child = function(pFunc, limit) {
    //-@@$Element.child-@@//
    var oArgs = jindo._checkVarType(arguments, {
        '4voi' : [],
        '4fun' : [ 'fpFunc:Function+' ],
        '4nul' : [ 'fpFunc:Null' ],
        'for_function_number' : [ 'fpFunc:Function+', 'nLimit:Numeric'],
        'for_null_number' : [ 'fpFunc:Null', 'nLimit:Numeric' ]
    },"$Element#child");
    var e = this._element;
    var a = [], c = null, f = null;
    
    switch(oArgs+""){
        case "4voi":
            var child = e.childNodes;
            var filtered = [];

            for(var  i = 0, l = child.length; i < l; i++){
                if(child[i].nodeType == 1){
                    try {
                        filtered.push(jindo.$Element(child[i]));
                    } catch(err) {
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

    (f = function(el, lim, context) {
        var ch = null, o = null;

        for(var i=0; i < el.childNodes.length; i++) {
            ch = el.childNodes[i];
            if (ch.nodeType != 1) continue;
            try {
                o = jindo.$Element(el.childNodes[i]);
            } catch(e) {
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
 	The prev() method searches for the element corresponding to the previous sibling node of HTML elements.
	
	@method prev
	@param {Function+} [fCallback] A callback function in which the search conditions of the previous sibling element are specified. If the callback function is specified as a parameter, returns the previous sibling element which returns true as the result of executing the callback. At this time, the callback function returns the result as an array. The jindo.$Element() object of the previous sibling element being searched is entered as the parameter of the callback function.
	@return {Variant} 조건을 만족하는 이전 형제 요소(jindo.$Element() object)를 원소로 갖는 배열(Array).<br>fCallback이 null인 경우 모든 이전 형제 요소의 배열(Array)을 반환한다. 파라미터를 생략하면 바로 이전 형제 요소가 담긴 jindo.$Element() object. 만약 엘리먼트가 없으면 null을 반환한다.
	@see jindo.$Element#parent
	@see jindo.$Element#child
	@see jindo.$Element#next
	@see jindo.$Element#first
	@see jindo.$Element#last
	@see jindo.$Element#indexOf
	@example
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
			// Returns the $Element that has wrapped the DIV in which the id is sample_div5
		
			sibling = $Element("sample_div").prev(function(v){
			    return $Element(v).hasClass("sample");
			});
			// Returns the $Element that has wrapped the DIV in which the id is ample_div5
			// and an array that consists of $Elements that have wrapped the DIV in which the id is ample_div3.
		</script>
 */
jindo.$Element.prototype.prev = function(pFunc) {
    //-@@$Element.prev-@@//
    
    var oArgs = jindo._checkVarType(arguments, {
        '4voi' : [],
        '4fun' : [ 'fpFunc:Function+' ],
        '4nul' : [ 'fpFunc:Null' ]
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
            // 'break' statement was intentionally omitted.
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
 	The next() method searches for the element corresponding to the next sibling node of HTML elements.
	
	@method next
	@param {Function+} [fCallback] A callback function in which the search conditions of the next sibling element are specified. If the callback function is specified as a parameter, returns the next sibling element which returns true as the result of executing the callback. At this time, the callback function returns the result as an array. The jindo.$Element() object of the next sibling element being searched is entered as the parameter of the callback function.
	@return {Variant} 조건을 만족하는 다음 형제 요소(jindo.$Element() object)를 원소로 갖는 배열(Array).<br>fCallback이 null인 경우 모든 다음 형제 요소의 배열(Array)을 반환한다. 파라미터를 생략하면 바로 다음 형제 요소가 담긴 jindo.$Element() object. 만약 엘리먼트가 없으면 null을 반환한다.
	@see jindo.$Element#parent
	@see jindo.$Element#child
	@see jindo.$Element#prev
	@see jindo.$Element#first
	@see jindo.$Element#last
	@see jindo.$Element#indexOf
	@example
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
			// Returns $Element wrapping DIV whose id is sample_div7.
		
			sibling = $Element("sample_div").next(function(v){
			    return $Element(v).hasClass("sample");
			});
			// Returns an array that has $Element wrapping DIV whose id is sample_div8.
		</script>
 */
jindo.$Element.prototype.next = function(pFunc) {
    //-@@$Element.next-@@//
    var oArgs = jindo._checkVarType(arguments, {
        '4voi' : [],
        '4fun' : [ 'fpFunc:Function+' ],
        '4nul' : [ 'fpFunc:Null' ]
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
            // 'break' statement was intentionally omitted.
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
 	The first() method returns the first child node of the HTML element.
	
	@method first
	@return {jindo.$Element} The element corresponding to the first child node. Returns null if no element exists.
	@since 1.2.0
	@see jindo.$Element#parent
	@see jindo.$Element#child
	@see jindo.$Element#prev
	@see jindo.$Element#next
	@see jindo.$Element#last
	@see jindo.$Element#indexOf
	@example
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
			// Returns $Element wrapping DIV whose id is sample_div3.
		</script>
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
 	The last() method returns the first last node of the HTML element.
	
	@method last
	@return {jindo.$Element} The element corresponding to the last child node. Returns null if no element exists.
	@since 1.2.0
	@see jindo.$Element#parent
	@see jindo.$Element#child
	@see jindo.$Element#prev
	@see jindo.$Element#next
	@see jindo.$Element#first
	@see jindo.$Element#indexOf
	@example
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
			// Returns $Element wrapping DIV whose id is sample_div5.
		</script>
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
 	The reference API for ChildOf and isParentOf (For IE, use "contains," and for other browsers, use "compareDocumentPosition." If both are unavailable, use the legacy API.).
	
	@method _contain
	@param {HTMLElement} eParent	Parent node
	@param {HTMLElement} eChild	Child node
	@ignore
 */
jindo.$Element._contain = function(eParent,eChild){
    if (document.compareDocumentPosition) {
        return !!(eParent.compareDocumentPosition(eChild)&16);
    }else if(eParent.contains){
        return (eParent !== eChild)&&(eParent.contains ? eParent.contains(eChild) : true);
    }else if(document.body.contains){
        if(eParent===(eChild.ownerDocument || eChild.document)&&eChild.tagName&&eChild.tagName.toUpperCase()==="BODY"){ return true;}  // when find body in document
        if(eParent.nodeType === 9&&eParent!==eChild){
            eParent = eParent.body; 
        }
        try{
            return (eParent !== eChild)&&(eParent.contains ? eParent.contains(eChild) : true);
        }catch(e){
            return false;
        }
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
 	The isChildOf() method checks whether the element specified as a parameter is the parent node of the HTML element.
	
	@method isChildOf
	@syntax sElement
	@syntax elElement
	@param {String+} sElement ID of the HTML element to check whether the element is the parent node
	@param {Element+} elElement The HTML element of which parent node will be checked
	@return {Boolean} If the specified element is the parent element, returns true; otherwise, returns false.
	@see jindo.$Element#isParentOf
	@example
		<div id="parent">
			<div id="child">
				<div id="grandchild"></div>
			</div>
		</div>
		<div id="others"></div>
		
		// Checks parent/child.
		$Element("child").isChildOf("parent");		// Result: true
		$Element("others").isChildOf("parent");		// Result: false
		$Element("grandchild").isChildOf("parent");	// Result: true
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
 	The isParentOf() method checks whether the element specified as a parameter is the child node of the HTML elements.
	
	@method isParentOf
	@syntax sElement
	@syntax elElement
	@param {String+} sElement ID of the HTML element to check whether the element is the child node
	@param {Element+} elElement The HTML element of which child node will be checked
	@return {Boolean} If the specified element is the child element, returns true; otherwise, returns false.
	@see jindo.$Element#isChildOf
	@example
		<div id="parent">
			<div id="child"></div>
		</div>
		<div id="others"></div>
		
		// Checks parent/child.
		$Element("parent").isParentOf("child");		// Result: true
		$Element("others").isParentOf("child");		// Result: false
		$Element("parent").isParentOf("grandchild");// Result: true
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
   	The isEqual() method checks whether the element specified as a parameter is the equal node of the HTML elements.
	
	@method isEqual
	@syntax sElement
	@syntax vElement
	@param {String+} sElement ID of the HTML element to be compared
	@param {Element+} vElement HTML element to be compared
	@return {Boolean} If the specified element is equal to the element, returns true; otherwise, returns false.
	@remark 
		<ul class="disc">
			<li>Among the API in the DOM Level 3 specification, it is equal to the isSameNode function. It checks the reference.</li>
			<li>Be careful to use it because it is different from the isEqualNode() method.</li>
		</ul>
	@see http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-isSameNode isSameNode - W3C DOM Level 3 Specification
	@see jindo.$Element#isEqualnode
	@example
		<div id="sample1"><span>Sample</span></div>
		<div id="sample2"><span>Sample</span></div>
		
		// Checks whether it is the same HTML element.
		var welSpan1 = $Element("sample1").first();	// <span>Sample</span>
		var welSpan2 = $Element("sample2").first();	// <span>Sample</span>
		
		welSpan1.isEqual(welSpan2); // Result: false
		welSpan1.isEqual(welSpan1); // Result: true
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
 	The fireEvent() method generates an event to the HTML element. The type of the event to be generated and the attributes of the event object can be specified as a parameter.
	
	@method fireEvent
	@param {String+} sEvent Name of the event to generate. Omit on prefix.
	@param {Hash+} [oProps] Object where the attribute of the event object is specified. Attribute of the event to be generated can be set.
	@return {jindo.$Element} The jindo.$Element() object of the HTML element of which event has been generated
	@remark 
		<ul class="disc">
			<li>In version 1.4.1 and higher, the value of keyCode is configurable.</li>
			<li>For WebKit family browsers, the value of keyCode cannot be specified when generating a key event because the keyCode of an event object is read-only.</li>
		</ul>
	@example
		// Occurs a click event.
		$Element("div").fireEvent("click", {left : true, middle : false, right : false});
		
		// Occurs a mouseover event.
		$Element("div").fireEvent("mouseover", {screenX : 50, screenY : 50, clientX : 50, clientY : 50});
		
		// Occurs a keydown event.
		$Element("div").fireEvent("keydown", {keyCode : 13, alt : true, shift : false ,meta : false, ctrl : true});
 */
jindo.$Element.prototype.fireEvent = function(sEvent, oProps) {
    //-@@$Element.fireEvent-@@//
    var _oParam = {
            '4str' : [ jindo.$Jindo._F('sEvent:String+') ],
            '4obj' : [ 'sEvent:String+', 'oProps:Hash+' ]
    };
    
    jindo._p_.fireCustomEvent = function (ele, sEvent,self,bIsNormalType){
        var oInfo = jindo._p_.normalCustomEvent[sEvent];
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
                    if(jindo.$Element.eventManager.containsElement(targetEle, ele, sCssquery,false)){
                        wrap_listener = oEvent[sCssquery].wrap_listener;
                        for(var k = 0, l = wrap_listener.length; k < l;k++){
                            wrap_listener[k]();
                        }
                    }
                }
            }
        }
        
    };

    function IE(sEvent, oProps) {
        var oArgs = jindo._checkVarType(arguments, _oParam,"$Element#fireEvent");
        var ele = this._element;
        
        if(jindo._p_.normalCustomEvent[sEvent]){
            jindo._p_.fireCustomEvent(ele,sEvent,this,!!jindo._p_.normalCustomEvent[sEvent]);
            return this;
        }
    
        sEvent = (sEvent+"").toLowerCase();
        var oEvent = document.createEventObject();
        
        switch(oArgs+""){
            case "4obj":
                oProps = oArgs.oProps;
                for (var k in oProps){
                    if(oProps.hasOwnProperty(k))
                        oEvent[k] = oProps[k];
                } 
                oEvent.button = (oProps.left?1:0)+(oProps.middle?4:0)+(oProps.right?2:0);
                oEvent.relatedTarget = oProps.relatedElement||null;
                
        }

        if(this.tag == "input" && sEvent == "click"){ 
            if(ele.type=="checkbox"){ 
                ele.checked = (!ele.checked); 
            }else if(ele.type=="radio"){ 
                ele.checked = true; 
            } 
        } 
                
        this._element.fireEvent("on"+sEvent, oEvent);
        return this;
    }

    function DOM2(sEvent, oProps) {
        var oArgs = jindo._checkVarType(arguments, _oParam,"$Element#fireEvent");
        var ele = this._element;
        
        var oldEvent = sEvent;
        sEvent = jindo.$Element.eventManager.revisionEvent("",sEvent,sEvent);
        if(jindo._p_.normalCustomEvent[sEvent]){
            jindo._p_.fireCustomEvent(ele,sEvent,this,!!jindo._p_.normalCustomEvent[sEvent]);
            return this;
        }
        
        var sType = "HTMLEvents";
        sEvent = (sEvent+"").toLowerCase();
        

        if (sEvent == "click" || sEvent.indexOf("mouse") == 0) {
            sType = "MouseEvent";
        } else if(oldEvent.indexOf("wheel") > 0){
           sEvent = "DOMMouseScroll"; 
           sType = jindo._p_._JINDO_IS_FF?"MouseEvent":"MouseWheelEvent";  
        } else if (sEvent.indexOf("key") == 0) {
            sType = "KeyboardEvent";
        } else if (sEvent.indexOf("pointer") > 0) {
            sType = "MouseEvent";
            sEvent = oldEvent;
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
        ele.dispatchEvent(evt);
        return this;
    }
    jindo.$Element.prototype.fireEvent =  (document.dispatchEvent !== undefined)?DOM2:IE;
    return this.fireEvent.apply(this,jindo._p_._toArray(arguments));
};
//-!jindo.$Element.prototype.fireEvent end!-//

//-!jindo.$Element.prototype.empty start(jindo.$Element.prototype.html)!-//
/**
 	empty() 메서드는 HTML 요소의 자식 요소와 그 자식 요소들에 등록된 모든 이벤트 핸들러까지 제거한다.
	
	@method empty
	@return {this} 자식 노드를 모두 제거한 인스턴스 자신
	@see jindo.$Element#leave
	@see jindo.$Element#remove
	@example
		// Removes all child nodes.
		$Element("sample").empty();
		
		//Before
		<div id="sample"><span>Node</span> <span>Delete All</span></div>
		
		//After
		<div id="sample"></div>
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
 	remove() 메서드는 HTML 요소의 특정 자식 노드를 제거한다. 파라미터로 지정한 자식 요소를 제거하며 제거되는 자식 요소의 이벤트 핸들러와 그 자식 요소의 모든 하위 요소의 모든 이벤트 핸들러도 제거한다.
	
	@method remove
	@syntax sElement
	@syntax vElement
	@param {String+} sElement ID of the HTML element of which child element will be removed
	@param {Element+} vElement The HTML element of which child element will be removed
	@return {this} 지정한 자식 노드를 제거한 인스턴스 자신
	@see jindo.$Element#empty
	@see jindo.$Element#leave
	@example
		// Removes a specific child node.
		$Element("sample").remove("child2");
		
		//Before
		<div id="sample"><span id="child1">Node</span> <span id="child2">Delete</span></div>
		
		//After
		<div id="sample"><span id="child1">Node</span> </div>
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
 	leave() 메서드는 HTML 요소를 자신의 부모 요소에서 제거한다. HTML 요소에 등록된 이벤트 핸들러, 그리고 그 요소의 모든 자식요소의 모든 이벤트 핸들러도 제거한다.
	
	@method leave
	@return {this} 부모 요소에서 제거된 인스턴스 자신
	@see jindo.$Element#empty
	@see jindo.$Element#remove
	@example
		// Removes from a parent element node.
		$Element("sample").leave();
		
		//Before
		<div>
			<div id="sample"><span>Node</span> <span>Delete All</span> </div>
		</div>
		
		//After : Returns $ElementList wripping <div id="sample"><span>Note</span> <span>Delete All</span></div>.
		<div>
		
		</div>
 */
jindo.$Element.prototype.leave = function() {
    //-@@$Element.leave-@@//
    var e = this._element;
    
    if(e.parentNode){
        if(jindo.cssquery) jindo.cssquery.release();
        e.parentNode.removeChild(e);
    }
    
    /*if(this._element.__jindo__id){
        jindo.$Element.eventManager.cleanUpUsingKey(this._element.__jindo__id, true);
    }

    jindo._p_.releaseEventHandlerForAllChildren(this);*/
    
    return this;
};
//-!jindo.$Element.prototype.leave end!-//

//-!jindo.$Element.prototype.wrap start(jindo.$Element._common)!-//
/**
 	The wrap() method wraps the HTML element with the specified element. The HTML element will be the last child element of the specified element.
	
	@method wrap
	@syntax sElement
	@syntax vElement
	@param {String+} sElement ID of the HTML element to be a parent
	@param {Element+ | Node} vElement The HTML element to be a parent
	@return {jindo.$Element} The jindo.$Element() object wrapped with the specified element
	@example
		$Element("sample1").wrap("sample2");
		
		//Before
		<div id="sample1"><span>Sample</span></div>
		<div id="sample2"><span>Sample</span></div>
		
		//After
		<div id="sample2"><span>Sample</span><div id="sample1"><span>Sample</span></div></div>
	@example
		$Element("box").wrap($('<DIV>'));
		
		//Before
		<span id="box"></span>
		
		//After
		<div><span id="box"></span></div>
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
 	The ellipsis() method controls text length so that the text node of the HTML element is displayed in a single line in a browser.
	
	@method ellipsis
	@param {String+} [sTail="..."] An ellipse indicator. Appends the character string specified in the parameter to a text node, and adjusts the length of that text node.
	@return {this} 인스턴스 자신
	@remark 
		<ul class="disc">
			<li>This method operates as assuming that the HTML element includes only text node. Therefore, do not use in other cases except the above.</li>
			<li>The browser determines the length of the text node based on the width of the HTML element. Therefore, the HTML element must be displayed. The size of a text node that has been fit to the screen may shrink afterwards. To solve this problem, specify the value of the overflow attribute of the HTML element to hidden.</li>
		</ul>
	@example
		$Element("sample_span").ellipsis();
		
		//Before
		<div style="width:300px; border:1px solid #ccc; padding:10px">
			<span id="sample_span">NHN is leading the digital life by continuously introducing innovative and convenient online services, its search engines and games being the company's two main pillars.</span>
		</div>
		
		//After
		<div style="width:300px; border:1px solid #ccc; padding:10px">
			<span id="sample_span">NHN is leading the digital life by continuously introducing...</span>
		</div> 
 */
jindo.$Element.prototype.ellipsis = function(stringTail) {
    //-@@$Element.ellipsis-@@//
    
    var oArgs = jindo._checkVarType(arguments, {
        '4voi' : [ ],
        '4str' : [ 'stringTail:String+' ]
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
 	The indexOf() method checks the degree of the child element node, which is the parameter, in HTML elements, and returns the index.
	
	@method indexOf
	@syntax sElement
	@syntax vElement
	@param {String+} sElement ID of the element of which degree of the child element wil be checked
	@param {Element+} vElement The element of which nth child will be checked
	@return {Numeric} The index of a search result. An index starts from 0, and returns -1 if no indexes are found.
	@since 1.2.0
	@see jindo.$Element#parent
	@see jindo.$Element#child
	@see jindo.$Element#prev
	@see jindo.$Element#next
	@see jindo.$Element#first
	@see jindo.$Element#last
	@example
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
 	The queryAll() method searches for the HTML elements, child element nodes that satisfy a specific CSS selector.
	
	@method queryAll
	@param {String+} sSelector CSS selector. There are two patterns that can be used as a CSS selector: standard pattern and non-standard pattern. For the standard pattern, the patterns described in the CSS Level3 specification are supported.
	@return {Array} Returns an array of the HTML elements(the jindo.$Element() objects) that satisfy the CSS selector condition. Returns an empty array if there are no satisfying elements.
	@see jindo.$Element#query
	@see jindo.$Element#queryAll
	@see http://www.w3.org/TR/css3-selectors/ CSS Level3 Specification - W3C
	@example
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
    //-@@$Element.queryAll-@@//
    var oArgs = jindo._checkVarType(arguments, {
        '4str'  : [ 'sSelector:String+']
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
 	The query() method returns the first child element of the HTML element that satisfy a specific CSS selector.
	
	@method query
	@param {String+} sSelector CSS selector. There are two patterns that can be used as a CSS selector: standard pattern and non-standard pattern. For the standard pattern, the patterns described in the CSS Level3 specification are supported.
	@return {jindo.$Element} The $Element instance of the first HTML element that satisfies the CSS selector condition. 만족하는 HTML 요소가 존재하지 않으면 null을 반환한다.
	@see jindo.$Element#test
	@see jindo.$Element#queryAll
	@see http://www.w3.org/TR/css3-selectors/ CSS Level3 Specification - W3C
	@example
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
    //-@@$Element.query-@@//
    var oArgs = jindo._checkVarType(arguments, {
        '4str'  : [ 'sSelector:String+']
    },"$Element#query");
    var ele =  jindo.cssquery.getSingle(sSelector, this._element);
    return ele === null? ele : jindo.$Element(ele); 
};
//-!jindo.$Element.prototype.query end!-//

//-!jindo.$Element.prototype.test start(jindo.cssquery)!-//
/**
 	The test() method checks whether the HTML element satisfies a specific CSS selector.
	
	@method test
	@param {String+} sSelector CSS selector. There are two patterns that can be used as a CSS selector: standard pattern and non-standard pattern. For the standard pattern, the patterns described in the CSS Level3 specification are supported.
	@return {Boolean} If the conditions of the CSS selector are satisfied, returns true; otherwise, returns false.
	@see jindo.$Element#query
	@see jindo.$Element#queryAll
	@see http://www.w3.org/TR/css3-selectors/ CSS Level3 Specification - W3C
	@example
		<div id="sample" class="blue"></div>
		
		<script type="text/javascript">
			$Element("sample").test(".blue");	// Result: true
			$Element("sample").test(".red");	// Result: false
		</script>
 */
jindo.$Element.prototype.test = function(sSelector) {
    //-@@$Element.test-@@// 
    var oArgs = jindo._checkVarType(arguments, {
        '4str'  : [ 'sSelector:String+']
    },"$Element#test");
    return jindo.cssquery.test(this._element, sSelector); 
};
//-!jindo.$Element.prototype.test end!-//

//-!jindo.$Element.prototype.xpathAll start(jindo.cssquery)!-//
/**
 	The xpath() method gets the element that satisfies the XPath grammar, based on the HTML element.
	
	@method xpathAll
	@param {String+} sXPath The XPath value
	@return {Array} Array which has the element(the jindo.$Element() object) that satisfies the XPath grammar as the element
	@remark The supported grammar is limited, therefore, it is recommended to use it only for the specific case.
	@see jindo.$$
	@example
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
			// Returns an array that has the <div>5</div> element.
		</script>
 */
jindo.$Element.prototype.xpathAll = function(sXPath) {
    //-@@$Element.xpathAll-@@// 
    var oArgs = jindo._checkVarType(arguments, {
        '4str'  : [ 'sXPath:String+']
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
 	insertAdjacentHTML function. It cannot be used directly.
	
	@method insertAdjacentHTML
	@ignore
 */
jindo.$Element.insertAdjacentHTML = function(ins,html,insertType,type,fn,sType){
    var aArg = [ html ];
    aArg.callee = arguments.callee;
    var oArgs = jindo._checkVarType(aArg, {
        '4str'  : [ 'sHTML:String+' ]
    },"$Element#"+sType);
    var _ele = ins._element;
    html = html+"";
    if( _ele.insertAdjacentHTML && !(/^<(option|tr|td|th|col)(?:.*?)>/.test(jindo._p_.trim(html).toLowerCase()))){
        _ele.insertAdjacentHTML(insertType, html);
    }else{
        var oDoc = _ele.ownerDocument || _ele.document || document;
        var fragment = oDoc.createDocumentFragment();
        var defaultElement;
        var sTag = jindo._p_.trim(html);
        var oParentTag = {
            "option" : "select",
            "tr" : "tbody",
            "thead" : "table",
            "tbody" : "table",
            "col" : "table",
            "td" : "tr",
            "th" : "tr",
            "div" : "div"
        };
        var aMatch = /^<(option|tr|thead|tbody|td|th|col)(?:.*?)\>/i.exec(sTag);
        var sChild = aMatch === null ? "div" : aMatch[1].toLowerCase();
        var sParent = oParentTag[sChild] ;
        defaultElement = jindo._p_._createEle(sParent,sTag,oDoc,true);
        var scripts = defaultElement.getElementsByTagName("script");
    
        for ( var i = 0, l = scripts.length; i < l; i++ ){
            scripts[i].parentNode.removeChild( scripts[i] );
        }

        if(_ele.tagName.toLowerCase() == "table" && !_ele.getElementsByTagName("tbody").length && !sTag.match(/<tbody[^>]*>/i)) {
            var elTbody = oDoc.createElement("tbody"),
                bTheadTfoot = sTag.match(/^<t(head|foot)[^>]*>/i);

            if(!bTheadTfoot) {
                fragment.appendChild(elTbody);
                fragment = elTbody;
            }
        }

        while ( defaultElement[ type ]){
            fragment.appendChild( defaultElement[ type ] );
        }
        
        bTheadTfoot && fragment.appendChild(elTbody);
        fn(fragment.cloneNode(true));
    }
    return ins;
};

//-!jindo.$Element.prototype.insertAdjacentHTML.hidden end!-//

//-!jindo.$Element.prototype.appendHTML start(jindo.$Element.prototype.insertAdjacentHTML)!-//
/**
 	The appendHTML() method appends HTML code specified as a parameter to the inside HTML code (innerHTML).
	
	@method appendHTML
	@param {String+} sHTML The HTML string to be appended
	@return {this} 내부 HTML 코드를 변경한 인스턴스 자신
	@remark Returns the jindo.$Element() object in version 1.4.8 and higher.
	@since 1.4.6
	@see jindo.$Element#prependHTML
	@see jindo.$Element#beforeHTML
	@see jindo.$Element#afterHTML
	@example
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
    //-@@$Element.appendHTML-@@//
    return jindo.$Element.insertAdjacentHTML(this,sHTML,"beforeEnd","firstChild",jindo.$Fn(function(oEle) {
        var ele = this._element;

        if(ele.tagName.toLowerCase() === "table") {
            var nodes = ele.childNodes;

            for(var i=0,l=nodes.length; i < l; i++) {
                if(nodes[i].nodeType==1){
                    ele = nodes[i]; 
                    break;
                }
            }
        }
        ele.appendChild(oEle);
    },this).bind(),"appendHTML");
};
//-!jindo.$Element.prototype.appendHTML end!-//

//-!jindo.$Element.prototype.prependHTML start(jindo.$Element.prototype.insertAdjacentHTML,jindo.$Element._prepend)!-//
/**
 	The prependHTML() method prepends HTML code specified as a parameter to the inside HTML code (innerHTML).
	
	@method prependHTML
	@param {String+} sHTML HTML character string to be prepended
	@return {this} 인스턴스 자신
	@remark Returns the jindo.$Element() object in version 1.4.8 and higher.
	@since 1.4.6
	@see jindo.$Element#appendHTML
	@see jindo.$Element#beforeHTML
	@see jindo.$Element#afterHTML
	@example
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
    //-@@$Element.prependHTML-@@//
    var ___element = jindo.$Element;

    return ___element.insertAdjacentHTML(this,sHTML,"afterBegin","firstChild",jindo.$Fn(function(oEle) {
        var ele = this._element;
        if(ele.tagName.toLowerCase() === "table") {
            var nodes = ele.childNodes;
            for(var i=0,l=nodes.length; i < l; i++) {
                if(nodes[i].nodeType==1) {
                    ele = nodes[i]; 
                    break;
                }
            }
        }
        ___element._prepend(ele,oEle);
    },this).bind(),"prependHTML");
};
//-!jindo.$Element.prototype.prependHTML end!-//

//-!jindo.$Element.prototype.beforeHTML start(jindo.$Element.prototype.insertAdjacentHTML)!-//
/**
 	The beforeHTML() method adds HTML code specified as a parameter to the head of the HTML code (outerHTML).
	
	@method beforeHTML
	@param {String+} sHTML HTML character string to be added
	@return {this} 인스턴스 자신
	@remark Returns the jindo.$Element() object in version and 1.4.8 and higher.
	@since 1.4.6
	@see jindo.$Element#appendHTML
	@see jindo.$Element#prependHTML
	@see jindo.$Element#afterHTML
	@example
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
    //-@@$Element.beforeHTML-@@//
    return jindo.$Element.insertAdjacentHTML(this,sHTML,"beforeBegin","firstChild",jindo.$Fn(function(oEle){
        this._element.parentNode.insertBefore(oEle, this._element);
    },this).bind(),"beforeHTML");
};
//-!jindo.$Element.prototype.beforeHTML end!-//

//-!jindo.$Element.prototype.afterHTML start(jindo.$Element.prototype.insertAdjacentHTML)!-//
/**
 	The afterHTML() method adds HTML code specified as a parameter to the end of the HTML code (outerHTML).
	
	@method afterHTML
	@param {String+} sHTML HTML character string to be added
	@return {this} 내부 HTML 코드를 변경한 인스턴스 자신
	@since Returns the jindo.$Element() object in version 1.4.8 and higher.
	@since 1.4.6
	@see jindo.$Element#appendHTML
	@see jindo.$Element#prependHTML
	@see jindo.$Element#beforeHTML
	@example
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
    //-@@$Element.afterHTML-@@//
    return jindo.$Element.insertAdjacentHTML(this,sHTML,"afterEnd","firstChild",jindo.$Fn(function(oEle){
        this._element.parentNode.insertBefore( oEle, this._element.nextSibling );
    },this).bind(),"afterHTML");
};
//-!jindo.$Element.prototype.afterHTML end!-//

//-!jindo.$Element.prototype.hasEventListener start(jindo.$Element.prototype.attach)!-//
/**
	Checks whether the event has been assigned to the element.
	
	@method hasEventListener
	@param {String+} sEvent An event name
	@return {Boolean} Whether an event is assigned
	@remark 2.2.0 버전부터, load와 domready이벤트는 각각 Window와 Document에서 발생하는 이벤트이지만 서로를 교차해서 등록하여도 이벤트가 올바르게 발생한다.
	@since 2.0.0
	@example
		$Element("test").attach("click",function(){});
		
		$Element("test").hasEventListener("click"); //true
		$Element("test").hasEventListener("mousemove"); //false
 */
jindo.$Element.prototype.hasEventListener = function(sEvent){

    var oArgs = jindo._checkVarType(arguments, {
        '4str' : [ 'sEvent:String+' ]
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
            var realEvent = jindo.$Element.eventManager.revisionEvent("", sEvent);
            bHasEvent = !!jindo.$Element.eventManager.hasEvent(this._key, realEvent, oArgs.sEvent);
        }
        
        return bHasEvent;
    }
    
    return false;
};
//-!jindo.$Element.prototype.hasEventListener end!-//

//-!jindo.$Element.prototype.preventTapHighlight start(jindo.$Element.prototype.addClass, jindo.$Element.prototype.removeClass)!-//
/**
	It prevents the parent element from be highlighted when using the event delegate on the mobile.
	
	@method preventTapHighlight
	@param {Boolean} bType Whether to enable or disable highlight
	@return {this} 인스턴스 자신
	@since 2.0.0
	@example
		<ul id="test">
			<li><a href="#nhn">nhn</a></li>
			<li><a href="#naver">naver</a></li>
			<li><a href="#hangame">hangame</a></li>
		</ul>
		
		$Element("test").preventTapHighlight(true);//It prevents test from being highlighted on mobile.
		$Element("test").delegate("click","a",function(e){});
 */
jindo.$Element.prototype.preventTapHighlight = function(bFlag){
    if(jindo._p_._JINDO_IS_MO){
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
    return this.preventTapHighlight.apply(this,jindo._p_._toArray(arguments));
};
//-!jindo.$Element.prototype.preventTapHighlight end!-//


//-!jindo.$Element.prototype.data start(jindo.$Json._oldToString)!-//
/**
 	The data() method retrieves the dataset of HTML elements.
	
	@method data
	@param {String+} sName The name of the dataset.
	@return {Variant} Returns the dataset value. set할 때 넣은 타입으로 반환하고, 해당 속성이 없다면 null을 반환한다. 단, JSON.stringfly의 반환 값이 undefined인 경우는 설정되지 않는다.
	@see jindo.$Element#attr
 */
/**
 	The data() method configures the dataset of HTML elements.
	
	@method data
	@syntax sName, vValue
	@syntax oList
	@param {String+} sName The name of the dataset.
	@param {Variant} vValue The value to be configured in the dataset. If the configuration value is set to null, it deletes the HTML dataset.
	@param {Hash+} oList An object or hash object (jindo.$H() object) that has one or more dataset.
	@return {this} dataset의 속성을 설정한 인스턴스 자신
	@see jindo.$Element#attr
	@example
		//Set
		//Before
		<ul id="maillist">
			<li id="folder">Read</li>
		</ul>
		
		//Do
		$Element("folder").data("count",123);
		$Element("folder").data("info",{
			"some1" : 1,
			"some2" : 2
		});
		
		//After
		<li id="folder" data-count="123" data-info="{\"some1\":1,\"some2\":2}">Read</li>
	@example
		//Get
		//Before
		<li id="folder" data-count="123" data-info="{\"some1\":1,\"some2\":2}">Read</li>
		
		//Do
		$Element("folder").data("count"); -> 123//Number
		$Element("folder").data("info"); -> {"some1":1, "some2":2} //Object
	@example
		//Delete
		//Before
		<li id="folder" data-count="123" data-info="{\"some1\":1,\"some2\":2}">Read</li>
		
		//Do
		$Element("folder").data("count",null);
		$Element("folder").data("info",null);
		
		//After
		<li id="folder">Read</li>
 */
jindo.$Element.prototype.data = function(sKey, vValue) {
    var oType ={ 
        'g'  : ["sKey:String+"],
        's4var' : ["sKey:String+", "vValue:Variant"],
        's4obj' : ["oObj:Hash+"]
    };
    var jindoKey = "_jindo";
    function toCamelCase(name){
        return name.replace(/\-(.)/g,function(_,a){
            return a.toUpperCase();
        });
    }
    function toDash(name){
        return name.replace(/[A-Z]/g,function(a){
            return "-"+a.toLowerCase();
        });
    }
    if(document.body.dataset){
        jindo.$Element.prototype.data = function(sKey, vValue) {
            var sToStr, oArgs = jindo._checkVarType(arguments, oType ,"$Element#data");
            var  isNull = jindo.$Jindo.isNull;
            
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
                    // 'break' statement was intentionally omitted.
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
                    // 'break' statement was intentionally omitted.
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
        };
    }else{
        jindo.$Element.prototype.data = function(sKey, vValue) {
            var sToStr, oArgs = jindo._checkVarType(arguments, oType ,"$Element#data");
            var  isNull = jindo.$Jindo.isNull;
            switch(oArgs+""){
                case "g":
                    sKey = toDash(sKey);
                    var isMakeFromJindo = this._element.getAttribute("data-"+sKey+jindoKey);
                    var sVal = this._element.getAttribute("data-"+sKey);
                    
                    if(isMakeFromJindo){
                        return (sVal!=null)? eval("("+sVal+")") : null;
                    }else{
                        return sVal;
                    }
                    // 'break' statement was intentionally omitted.
                case "s4var":
                    var oData;
                    if(isNull(vValue)){
                        sKey = toDash(sKey);
                        this._element.removeAttribute("data-"+sKey);
                        this._element.removeAttribute("data-"+sKey+jindoKey);
                        return this;
                    }else{
                        oData = {};
                        oData[sKey] = vValue;
                        sKey = oData;   
                    }
                    // 'break' statement was intentionally omitted.
                case "s4obj":
                    var sChange;
                    for(var i in sKey){
                        sChange = toDash(i);
                        if(isNull(sKey[i])){
                            this._element.removeAttribute("data-"+sChange);
                            this._element.removeAttribute("data-"+sChange+jindoKey);
                        }else{
                            sToStr = jindo.$Json._oldToString(sKey[i]);
                            if(sToStr!=null){
                                this._element.setAttribute("data-"+sChange, sToStr);
                                this._element.setAttribute("data-"+sChange+jindoKey, "jindo");
                            }
                        }
                    }
                    return this;
            }
        };
    }
    
    return this.data.apply(this, jindo._p_._toArray(arguments));
};
//-!jindo.$Element.prototype.data end!-//

/**
 	@fileOverview A file to define the constructor and methods of the jindo.$Fn() object
	@name function.js 
	@author NAVER Ajax Platform
 */
//-!jindo.$Fn start!-//
/**
 	The jindo.$Fn() object provides the extended functionality for functions by wrapping the Function object.
	
	@class jindo.$Fn
	@keyword function
 */
/**
 	Creates the jindo.$Fn() object. A specific function can be specified as the parameter of the constructor. At this time, the execution context can be specified in order to use the 'this' keyword according to the situation. In addition, the jindo.$Fn() object can be created by entering the parameter and the body of the function to be wrapped as the parameter of the creator.
	
	@constructor
	@syntax fpFunction, vExeContext
	@syntax sFuncArgs, sFuncBody
	@param {Function+} fpFunction A function to wrap
	@param {Variant} [vExeContext] An object which will become the execution context of the function
	@param {String} sFuncArgs A string that represents the parameter of the function
	@param {String} sFuncBody A string that represents the body of the function
	@return {jindo.$Fn} The jindo.$Fn() object
	@see jindo.$Fn#toFunction
	@example
		func : function() {
		       // code here
		}
		
		var fn = $Fn(func, this);
	@example
		var someObject = {
		    func : function() {
		       // code here
		   }
		}
		
		var fn = $Fn(someObject.func, someObject);
	@example
		var fn = $Fn("a, b", "return a + b;");
		var result = fn.$value()(1, 2) // result = 3;
		
		// fn wraps the same function as function(a, b){ return a + b;}, a function literal.
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

	var oArgs = jindo._checkVarType(arguments, {
		'4fun' : ['func:Function+'],
		'4fun2' : ['func:Function+', "thisObject:Variant"],
		'4str' : ['func:String+', "thisObject:String+"]
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
	return jindo._checkVarType(oPram, {
		'4ele' : ['eElement:Element+',"sEvent:String+"],
		'4ele2' : ['eElement:Element+',"sEvent:String+","bUseCapture:Boolean"],
		'4str' : ['eElement:String+',"sEvent:String+"],
		'4str2' : ['eElement:String+',"sEvent:String+","bUseCapture:Boolean"],
		'4arr' : ['aElement:Array+',"sEvent:String+"],
		'4arr2' : ['aElement:Array+',"sEvent:String+","bUseCapture:Boolean"],
		'4doc' : ['eElement:Document+',"sEvent:String+"],
		'4win' : ['eElement:Window+',"sEvent:String+"],
		'4doc2' : ['eElement:Document+',"sEvent:String+","bUseCapture:Boolean"],
		'4win2' : ['eElement:Window+',"sEvent:String+","bUseCapture:Boolean"]
	},sMethod);
};
//-!jindo.$Fn end!-//

//-!jindo.$Fn.prototype.$value start!-//
/**
 	The $value() method returns the original Function object.
	
	@method $value
	@return {Function} The original Function object
	@example
		func : function() {
			// code here
		}
		
		var fn = $Fn(func, this);
		fn.$value(); // Returns the original function.
 */
jindo.$Fn.prototype.$value = function() {
	//-@@$Fn.$value-@@//
	return this._func;
};
//-!jindo.$Fn.prototype.$value end!-//

//-!jindo.$Fn.prototype.bind start!-//
/**
 	The bind() method returns the function object bound as a method of the object specified by the constructor. At this time, the execution context of the method is set to the specified object.
	
	@method bind
	@param {Variant} [vParameter*] The 1st~Nth default parameter to be entered for the created function
	@return {Function} The function object bound by the method of the execution context
	@see jindo.$Fn
	@see jindo.$Class
	@example
		var sName = "OUT";
		var oThis = {
		    sName : "IN"
		};
		
		function getName() {
		    return this.sName;
		}
		
		oThis.getName = $Fn(getName, oThis).bind();
		
		alert( getName() );       	  //  OUT
		alert( oThis.getName() ); //   IN
	@example
		 // When a factor is entered to the bound method
		var b = $Fn(function(one, two, three){
			console.log(one, two, three);
		}).bind(true);
		
		b();	// true, undefined, undefined
		b(false);	// true, false, undefined
		b(false, "1234");	// true, false, "1234"
	@example
		// When defining functions first and then using them later, use the bind() method,
		// as such functions refer to values that are valid at the time of their call, not the values assigned at the time of their creation.
		for(var i=0; i<2;i++){
			aTmp[i] = function(){alert(i);}
		}
		
		for(var n=0; n<2;n++){
			aTmp[n](); // Alerts only number 2 twice.
		}
		
		for(var i=0; i<2;i++){
		aTmp[i] = $Fn(function(nTest){alert(nTest);}, this).bind(i);
		}
		
		for(var n=0; n<2;n++){
			aTmp[n](); // Alerts numbers 0 and 1.
		}
	@example
		// The bind() method is used to keep scope if a function is used as a parameter when creating a class.
		var MyClass = $Class({
			fFunc : null,
			$init : function(func){
				this.fFunc = func;
		
				this.testFunc();
			},
			testFunc : function(){
				this.fFunc();
			}
		})
		var MainClass = $Class({
			$init : function(){
				var oMyClass1 = new MyClass(this.func1);
				var oMyClass2 = new MyClass($Fn(this.func2, this).bind());
			},
			func1 : function(){
				alert(this);// this represents MyClass.
			},
			func2 : function(){
				alert(this);// this represents MainClass.
			}
		})
		function init(){
			var a = new MainClass();
		}
*/
jindo.$Fn.prototype.bind = function() {
	//-@@$Fn.bind-@@//
	var a = jindo._p_._toArray(arguments);
	var f = this._func;
	var t = this._this||this;
	var b;
	if(f.bind){
	    a.unshift(t);
	    b = Function.prototype.bind.apply(f,a);
	}else{
	    
    	b = function() {
    		var args = jindo._p_._toArray(arguments);
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
 	The attach() method registers a function as the event handler of a specific element.

	@method attach
	@syntax elElement, sEvent, bUseCapture
	@syntax vElement, sEvent, bUseCapture
	@syntax sElement, sEvent, bUseCapture
	@remark If it is bound to the jindo.$Fn() object and the return value is false, the Internet Explorer blocks the basic function. Therefore, do not use it.<br>
		There are other limitations as follows:<br>
		<ul class="disc">
			<li>Do not use the prefix on for event names.</li>
			<li>Use the mouse wheel scroll event with mousewheel.</li>
			<li>Additionally, the domready, mouseenter, mouseleave, and mousewheel events can be used.</li>
		</ul>
	@param {Element} elElement An element that is to allocate the event handler
	@param {Array | $A} vElement An array consisting of elements to which the event handler will be allocated
	@param {String} sElement id of an element that allocates the event handler
	@param {String} sEvent Event type
	@param {Boolean} [bUseCapture=false] Whether to use capturing (1.4.2~2.0.0 버전까지  지원). Enter true to use capturing.
	@return {jindo.$Fn} The created jindo.$Fn() object
	@deprecated In version 2.0.0, it has been changed to $Element#attach.
	@see jindo.$Fn#detach
	@example
		var someObject = {
		    func : function() {
				// code here
		   }
		}

		// In the event of attaching a click event handler to one single element
		$Fn(someObject.func, someObject).attach($("test"),"click");

		// When registering a click event handler to multiple elements
		// When the array is entered as the first parameter as shown below, the event handler is registered to all the elements.
		$Fn(someObject.func, someObject).attach($$(".test"),"click");
 */
jindo.$Fn.prototype.attach = function(oElement, sEvent, bUseCapture) {
	//-@@$Fn.attach-@@//
	var oArgs = jindo.$Fn._commonPram(arguments,"$Fn#attach");
	var fn = null, l, ev = sEvent, el = oElement, ua = jindo._p_._j_ag;

	if (bUseCapture !== true) {
		bUseCapture = false;
	}

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
//-!jindo.$Fn.prototype.attach end!-//

//-!jindo.$Fn.prototype.detach start!-//
/**
 	The detach() method detaches the event handlers from elements.

	@method detach
	@param {Element} elElement An element that will unregister the event element
	@param {String} sEvent Event type. The "on" prefix must not be used as part of an event name.
	@param {Boolean} [bUseCapture=false] Whether to use capturing (1.4.2~2.0.0 버전까지  지원). Enter true to use capturing.
	@return {jindo.$Fn} The created jindo.$Fn() object
	@see jindo.$Fn#attach
	@deprecated In version 2.0.0, it has been changed to $Element#detach.
	@example
		var someObject = {
		    func : function() {
				// code here
		   }
		}

		var fpFn = $Fn(someObject.func, someObject);
		fpFn.attach($("test"),"click");
		// In the event of detaching a click event handler from one single element
		// The detach function can be used within the same $Fn instance in which the attach function was executed.
		fpFn.detach($("test"),"click");

		var fpFn = $Fn(someObject.func, someObject);
		fpFn.attach($$(".test"),"click");
		// In the event of detaching a click event from multiple elements.
		// If an array is given as a first parameter as you see below, an event handler is attached to every corresponding element.
		// The detach function can be used within the same $Fn instance in which the attach function was executed.
		fpFn.detach($$(".test"),"click");
 */
jindo.$Fn.prototype.detach = function(oElement, sEvent, bUseCapture) {
	//-@@$Fn.detach-@@//
	var oArgs = jindo.$Fn._commonPram(arguments,"$Fn#detach");

	var fn = null, l, el = oElement, ev = sEvent, ua = jindo._p_._j_ag;

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
//-!jindo.$Fn.prototype.detach end!-//

//-!jindo.$Fn.prototype.delay start(jindo.$Fn.prototype.bind)!-//
/**
 	The delay() method invokes a wrapped function after a specified period of time has elapsed.
	
	@method delay
	@param {Numeric} nSec Elapsed time until a function is invoked (in seconds)
	@param {Array+} [aArgs] An array contains parameters to be used when invoking a function
	@return {jindo.$Fn} Created jindo.$Fn() object
	@see jindo.$Fn#bind
	@see jindo.$Fn#setInterval
	@example
		function func(a, b) {
			alert(a + b);
		}
		
		$Fn(func).delay(5, [3, 5]); // Invokes the func function that has the values of 3 and 5 as parameters after 5 seconds.
 */
jindo.$Fn.prototype.delay = function(nSec, args) {
	//-@@$Fn.delay-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4num' : ['nSec:Numeric'],
		'4arr' : ['nSec:Numeric','args:Array+']
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
 	The setInterval() method invokes a wrapped function at a specified interval.
	
	@method setInterval
	@param {Numeric} nSec Elapsed time until a function is invoked (in seconds)
	@param {Array+} [aArgs] An array contains parameters to be used when invoking a function
	@return {jindo.$Fn} Created jindo.$Fn() object
	@see jindo.$Fn#bind
	@see jindo.$Fn#delay
	@example
		function func(a, b) {
			alert(a + b);
		}
		
		$Fn(func).setInterval(5, [3, 5]); // Invokes the func function that has the values of 3 and 5 as parameters every 5 seconds.
 */
jindo.$Fn.prototype.setInterval = function(nSec, args) {
	//-@@$Fn.setInterval-@@//
	//-@@$Fn.repeat-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4num' : ['nSec:Numeric'],
		'4arr' : ['nSec:Numeric','args:Array+']
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
 	The repeat() method is the same as the setInterval() method.
	
	@method repeat
	@param {Numeric} nSec Elapsed time until a function is invoked (in seconds)
	@param {Array+} [aArgs] An array contains parameters to be used when invoking a function
	@return {jindo.$Fn} Created jindo.$Fn() object
	@see jindo.$Fn#setInterval
	@see jindo.$Fn#bind
	@see jindo.$Fn#delay
	@example
		function func(a, b) {
			alert(a + b);
		}
		
		$Fn(func).repeat(5, [3, 5]); // Calls the func function that uses the values 3 and 5 as parameters every 5 seconds.
 */
jindo.$Fn.prototype.repeat = jindo.$Fn.prototype.setInterval;
//-!jindo.$Fn.prototype.repeat end!-//

//-!jindo.$Fn.prototype.stopDelay start!-//
/**
 	The stopDelay() method stops the function call that has been specified by the delay() method.
	
	@method stopDelay
	@return {this} 인스턴스 자신
	@see jindo.$Fn#delay
	@example
		function func(a, b) {
			alert(a + b);
		}
		
		var fpDelay = $Fn(func);
		fpDelay.delay(5, [3, 5]);
		fpDelay.stopDelay();
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
 	The stopRepeat() stops invocation of a function that is specified by the repeat() method.
	
	@method stopRepeat
	@return {this} 인스턴스 자신
	@see jindo.$Fn#repeat
	@example
		function func(a, b) {
			alert(a + b);
		}
		
		var fpDelay = $Fn(func);
		fpDelay.repeat(5, [3, 5]);
		fpDelay.stopRepeat();
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
 	@fileOverview A file to define the constructors and methods of the jindo.$ElementList() object
	@name elementlist.js
	@author NAVER Ajax Platform
 */
//-!jindo.$ElementList start(jindo.$Element)!-//
/**
 	The jindo.$ElementList() object provides features that can handle multiple DOM elements simultaneously. The jindo.$ElementList() object manages DOM elements as an array.
	
	@class jindo.$ElementList
	@keyword elementlist, element, list
 */
/**
   	Creates the jindo.$ElementList() object. The followings are used when the jindo.$ElementList() object is created: the ID of DOM elements or the array that has the ID as an element, the CSS selector or the array that has the jindo.$Element() object as an element.
	
	@constructor
	@syntax
	@syntax  sIDorSelector
	@syntax  aList
	@param {String+} sIDorSelector The CSS selector or ID to search for the DOM element in a document.
	@param {Array+} aList The array that has the ID, element or jindo.$Element() object of the DOM element in a document.
	@example
		// Creates the ElementList of 'foo' and 'bar' elements.
		var woElList = $ElementList($('foo','bar'));
		
		// Creates $ElementList for all 'DIV' elements in the document.
		var woElList = $ElementList('DIV');
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
	
	var oArgs = jindo._checkVarType(arguments, {
		'4arr' : [ 'aEle:Array+' ],
		'4str' : [ 'sCssQuery:String+' ],
		'4nul' : [ 'oEle:Null' ],
		'4und' : [ 'oEle:Undefined' ]
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
				};
	
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
								this._elements[j][name](duration, function(){ callback&&callback(self); });
							} else {
								this._elements[j][name](duration);
							}
						}
						return this;
					}catch(e){
						throw TypeError(e.message.replace(/\$Element/g,"$Elementlist#"+name).replace(/Element\.html/g,"Elementlist.html#"+name));
					}
				};
			})(setters2[i]);
		}
	}	
	
})(jindo.$ElementList.prototype);
//-!jindo.$ElementList end!-//

//-!jindo.$ElementList.prototype.get start!-//
/**
 	The get() method returns the element corresponding to the index specified among the internal element of the jindo.$ElementList() object.
	
	@method get
	@param {Numeric} nIndex The index of the element to be retrieved.<br>The index starts from 0.
	@return {jindo.$Element} The element of the specified index
*/
jindo.$ElementList.prototype.get = function(idx) {
	//-@@$ElementList.get-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4num' : [ 'nIdx:Numeric' ]
	},"$ElementList#get");
	return this._elements[idx];
};
//-!jindo.$ElementList.prototype.get end!-//

//-!jindo.$ElementList.prototype.getFirst start!-//
/**
 	The getFirst() method returns the first element of the jindo.$ElementList() object. It behaves the same with the get() method that has 0 as its index value.
	
	@method getFirst
	@return {jindo.$Element} The first element of the jindo.$ElementList() object
	@see jindo.$ElementList#get
	@see jindo.$ElementList#getLast
*/
jindo.$ElementList.prototype.getFirst = function() {
	//-@@$ElementList.getFirst-@@//
	return this._elements[0];
};
//-!jindo.$ElementList.prototype.getFirst end!-//

//-!jindo.$ElementList.prototype.getLast start!-//
/**
 	The getFirst() method returns the last element of the jindo.$ElementList() object. It behaves the same with the get() method that has the last index number as its index value.
	
	@method getLast
	@return {jindo.$Element} The last element of the jindo.$ElementList() object
	@see jindo.$ElementList#get
	@see jindo.$ElementList#getFirst
*/
jindo.$ElementList.prototype.getLast = function() {
	//-@@$ElementList.getLast-@@//
	return this._elements[Math.max(this._elements.length-1,0)];
};
//-!jindo.$ElementList.prototype.getLast end!-//

//-!jindo.$ElementList.prototype.length start(jindo.$A.prototype.length)!-//
/**
 	The length() method returns the size of jindo.$ElementList() object by using the length() method of the jindo.$A() object.
	
	@method length
	@return {Number} Returns the array size (number) of the current jindo.$ElementList() object.
	
	@since 1.4.3
	@see jindo.$A#length
*/
/**
 	The length() method adjusts the size of jindo.$ElementList() object by using the length() method of the jindo.$A() object.
	
	@method length
	@syntax nLen
	@param {Numeric} nLen The size of an array to be specified. When nLen is smaller than the array size of the existing jindo.$ElementList() object, remove the element after the nLen.
	
	@syntax nLen2, oValue
	@param {Numeric} nLen2 The size of an array to be specified. When nLen is larger than the array size of the existing jindo.$ElementList() object, fill the space of the added array with the oValue parameter value. When nLen is smaller than the array size of the existing jindo.$ElementList() object, remove the element after the nLen.
	@param {Variant} oValue An initial value to be used when adding new elements.
	
	@return {this} Internal array changed instance of itself.
	@since 1.4.3
	@see jindo.$A#length
*/
jindo.$ElementList.prototype.length = function(nLen, oValue) {
	//-@@$ElementList.length-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4voi' : [],
		'4num' : [ jindo.$Jindo._F("nLen:Numeric")],
		'4var' : [ "nLen:Numeric", "oValue:Variant"]
	},"$ElementList#length");
	
	var waEle = jindo.$A(this._elements);
	try{
		return waEle.length.apply(waEle, jindo._p_._toArray(arguments));
	}catch(e){
		throw TypeError(e.message.replace(/\$A/g,"$Elementlist#length").replace(/A\.html/g,"Elementlist.html#length"));
	}
};
//-!jindo.$ElementList.prototype.length end!-//

//-!jindo.$ElementList.prototype.$value start!-//
/**
 	The $value() method returns the internal array.
	
	@method $value
	@return {Array} An array that has the jindo.$Element() object as an element
*/
jindo.$ElementList.prototype.$value = function() {
	//-@@$ElementList.$value-@@//
	return this._elements;
};
//-!jindo.$ElementList.prototype.$value end!-//

//-!jindo.$ElementList.prototype.show start(jindo.$Element.prototype.show)!-//
/**
 	The show() method changes the display attribute in order to display HTML elements on the screen.
	
	@method show
	@param {String+} [sDisplay] The value to be set as the display attribute.<br>If the parameter is not specified, it is set to its default value. It is set to "inline" if no pre-defind value exists; set to block if an error occurs.
	@return {this} Display property value applied instance of itself.
	@remark The sDisplay parameter is available in version 1.4.5 and higher.
	@see http://www.w3.org/TR/2008/REC-CSS2-20080411/visuren.html#display-prop display Attributes - W3C CSS2 Specification
	@see jindo.$Element#show
	@see jindo.$Element#hide
	@see jindo.$ElementList#hide
	@example
		// Makes it visible on the screen.
		$ElementList("div").show();
		
		//Before
		<div style="display:none">Hello</div>
		<div style="display:none">Good Bye</div>
		
		//After
		<div style="display:block">Hello</div>
		<div style="display:block">Good Bye</div>
*/
/**
 When the value of sDisplay is abnormal in Internet Explorer, it is set to block.
*/
//-!jindo.$ElementList.prototype.show end!-//
//-!jindo.$ElementList.prototype.hide start(jindo.$Element.prototype.hide)!-//
/**
 	The hide() method changes the display attribute to none to make the HTML elements invisible.
	
	@method hide
	@return {this} Display property changed to 'none' instance of itself.
	@see http://www.w3.org/TR/2008/REC-CSS2-20080411/visuren.html#display-prop display Attributes - W3C CSS2 Specification
	@see jindo.$Element#show
	@see jindo.$ElementList#show
	@see jindo.$Element#hide
	@example
		// Makes it invisible on the screen.
		$ElementList("div").hide();
		
		//Before
		<div style="display:block">Hello</div>
		<div style="display:block">Good Bye</div>
		
		//After
		<div style="display:none">Hello</div>
		<div style="display:none">Good Bye</div>
*/
//-!jindo.$ElementList.prototype.hide end!-//
//-!jindo.$ElementList.prototype.toggle start(jindo.$Element.prototype.toggle)!-//
/**
 	The toggle() method changes the display attributes of HTML elements in order to display or hide the element on the screen. This method can toggle the displayability of the element.
	
	@method toggle
	@param {String+} [sDisplay] The value which will be set as the display attribute in order to display an element.<br>If the parameter is not specified, it is set to its default value. It is set to "inline" if no pre-defind value exists.
	@return {this} display 속성을 변경한 인스턴스 자신
	@remark In version 1.4.5 and higher, it is possible to configure the value of sDisplay attribute as the value of the display attribute to display the element.
	@see http://www.w3.org/TR/2008/REC-CSS2-20080411/visuren.html#display-prop display Attributes< - W3C CSS2 Specification
	@see jindo.$ElementList#show
	@see jindo.$ElementList#hide
	@see jindo.$Element#visible
	@example
		// Makes it visiable or invisible on the screen.
		$ElementList("div").toggle();
		
		//Before
		<div style="display:block">Hello</div>
		<div style="display:none">Good Bye</div>
		
		//After
		<div style="display:none">Hello</div>
		<div style="display:block">Good Bye</div>
*/
//-!jindo.$ElementList.prototype.toggle end!-//
//-!jindo.$ElementList.prototype.addClass start(jindo.$Element.prototype.addClass)!-//
/**
 	The addClass() method adds classes in HTML elements.
	
	@method addClass
	@param {String+} sClass Class name to be added. A space is used to add multiple class names.
	@return {this} 지정한 클래스를 추가한 인스턴스 자신
	@see jindo.$Element#className
	@see jindo.$ElementList#className
	@see jindo.$Element#hasClass
	@see jindo.$Element#removeClass
	@see jindo.$ElementList#removeClass
	@see jindo.$Element#toggleClass
	@see jindo.$ElementList#toggleClass
	@example
		// Adds a class.
		$ElementList(".sample li.off").addClass("deselected");
		$ElementList(".sample li.on").addClass("selected highlight");
		
		//Before
		<ul class="sample">
			<li class="on">Example1</li>
			<li class="off">Example2</li>
			<li class="off">Example3</li>
			<li class="on">Example4</li>
		</ul>
		
		//After
		<ul class="sample">
			<li class="on selected highlight">Example1</li>
			<li class="off deselected">Example2</li>
			<li class="off deselected">Example3</li>
			<li class="on selected highlight">Example4</li>
		</ul>
*/
//-!jindo.$ElementList.prototype.addClass end!-//
//-!jindo.$ElementList.prototype.removeClass start(jindo.$Element.prototype.removeClass)!-//
/**
 	The removeClass() method removes specific classes from HTML elements.
	
	@method removeClass
	@param {String+} sClass Class name to be removed. A space is used to remove multiple class names.
	@return {this} 지정한 클래스를 제거한 인스턴스 자신
	@see jindo.$Element#className
	@see jindo.$ElementList#className
	@see jindo.$Element#hasClass
	@see jindo.$Element#addClass
	@see jindo.$ElementList#addClass
	@see jindo.$Element#toggleClass
	@see jindo.$ElementList#toggleClass
	@example
		// Removing a class.
		$ElementList(".sample li").removeClass("selected");
		
		//Before
		<ul class="sample">
			<li class="on selected">Example1</li>
			<li class="off">Example2</li>
			<li class="off">Example3</li>
			<li class="on selected">Example4</li>
		</ul>
		
		//After
		<ul class="sample">
			<li class="on">Example1</li>
			<li class="off">Example2</li>
			<li class="off">Example3</li>
			<li class="on">Example4</li>
		</ul>
	@example
		// Removes multiple classes.
		$ElementList(".sample li").removeClass("selected highlight deselected");
		
		//Before
		<ul class="sample">
			<li class="on selected highlight">Example1</li>
			<li class="off deselected">Example2</li>
			<li class="off deselected">Example3</li>
			<li class="on selected highlight">Example4</li>
		</ul>
		
		//After
		<ul class="sample">
			<li class="on">Example1</li>
			<li class="off">Example2</li>
			<li class="off">Example3</li>
			<li class="on">Example4</li>
		</ul>
*/
//-!jindo.$ElementList.prototype.removeClass end!-//
//-!jindo.$ElementList.prototype.toggleClass start(jindo.$Element.prototype.toggleClass)!-//
/**
 	The toggleClass() method removes a class if that class has already been applied to the HTML element, or adds a class if none are.<br>
	When only one parameter is entered, removes the class specified as a parameter if the class is being used. If the class is not used, adds the class. If two parameters are entered, removes the class that is being used and adds the other.
	
	@method toggleClass
	@param {String+} sClass Class name to be added or removed
	@param {String+} [sClass2] Class name to be added or removed
	@return {this} 지정한 클래스를 추가 혹은 제거한 인스턴스 자신
	@import core.$Element[hasClass,addClass,removeClass]
	@see jindo.$Element#className
	@see jindo.$ElementList#className
	@see jindo.$Element#hasClass
	@see jindo.$Element#addClass
	@see jindo.$ElementList#addClass
	@see jindo.$Element#removeClass
	@see jindo.$ElementList#removeClass
	@example
		// If one parameter exists
		$ElementList(".sample li").toggleClass("on");
		
		//Before
		<ul class="sample">
			<li>Example1</li>
			<li class="even on">Example2</li>
			<li>Example3</li>
			<li class="even on">Example4</li>
		</ul>
		
		//After
		<ul class="sample">
			<li class="on">Example1</li>
			<li class="even">Example2</li>
			<li class="on">Example3</li>
			<li class="even">Example4</li>
		</ul>
	@example
		// If there are two parameters
		$ElementList(".sample li").toggleClass("on", "off");
		
		//Before
		<ul class="sample">
			<li class="on">Example1</li>
			<li class="even off">Example2</li>
			<li class="on">Example3</li>
			<li class="even off">Example4</li>
		</ul>
		
		//After
		<ul class="sample">
			<li class="off">Example1</li>
			<li class="even on">Example2</li>
			<li class="off">Example3</li>
			<li class="even on">Example4</li>
		</ul>
*/
//-!jindo.$ElementList.prototype.toggleClass end!-//
//-!jindo.$ElementList.prototype.fireEvent start(jindo.$Element.prototype.fireEvent)!-//
/**
 	The fireEvent() method generates an event to the HTML element. The type of the event to be generated and the attributes of the event object can be specified as a parameter.
	
	@method fireEvent
	@param {String+} sEvent Name of the event to generate. Omit on prefix.
	@param {Hash+} [oProps] Object where the attribute of the event object is specified. Attribute of the event to be generated can be set.
	@return {jindo.$ElementList} The jindo.$ElementList() object of the HTML element of which event has been generated
	@remark 
		<ul class="disc">
			<li>In version 1.4.1 and higher, the value of keyCode is configurable.</li>
			<li>For WebKit family browsers, the value of keyCode cannot be specified when generating a key event because the keyCode of an event object is read-only.</li>
		</ul>
	@example
		// Occurs a click event.
		$ElementList("div").fireEvent("click", {left : true, middle : false, right : false});
		
		// Occurs a mouseover event.
		$ElementList("div").fireEvent("mouseover", {screenX : 50, screenY : 50, clientX : 50, clientY : 50});
		
		// Occurs a keydown event.
		$ElementList("div").fireEvent("keydown", {keyCode : 13, alt : true, shift : false ,meta : false, ctrl : true});
*/
//-!jindo.$ElementList.prototype.fireEvent end!-//
//-!jindo.$ElementList.prototype.leave start(jindo.$Element.prototype.leave)!-//
/**
 	leave() 메서드는 HTML 요소를 자신의 부모 요소에서 제거한다. HTML 요소에 등록된 이벤트 핸들러, 그리고 그 요소의 모든 자식요소의 모든 이벤트 핸들러도 제거한다.
	
	@method leave
	@return {this} 부모 요소에서 제거된 인스턴스 자신
	@see jindo.$Element#empty
	@see jindo.$ElementList#empty
	@see jindo.$Element#remove
	@example
		// Removes from a parent element node.
		$ElementList(".sample li").leave();
		
		//Before
		<ul class="sample">
			<li>Example1</li>
			<li>Example2</li>
		</ul>
		
		//After : <li>Example1</li><li>Example2</li>를 래핑한 $ElementList가 반환된다
		<ul class="sample">
		
		</ul>
*/
//-!jindo.$ElementList.prototype.leave end!-//
//-!jindo.$ElementList.prototype.empty start(jindo.$Element.prototype.empty)!-//
/**
 	empty() 메서드는 HTML 요소의 자식 요소와 그 자식 요소들에 등록된 모든 이벤트 핸들러까지 제거한다.
	
	@method empty
	@return {this} 자식 노드를 모두 제거한 인스턴스 자신
	@see jindo.$Element#leave
	@see jindo.$ElementList#leave
	@see jindo.$Element#remove
	@example
		// Removes all child nodes.
		$ElementList(".sample li").empty();
		
		//Before
		<ul class="sample">
			<li>Example1 <span>Child Node</span></li>
			<li>Example1 <span>Child Node</span></li>
		</ul>
		
		//After
		<ul class="sample">
			<li></li>
			<li></li>
		</ul>
*/
//-!jindo.$ElementList.prototype.empty end!-//
//-!jindo.$ElementList.prototype.appear start(jindo.$Element.prototype.appear)!-//
/**
 	The appear() method makes HTML elements slowly appear (fade-in effect).
	
	@method appear
	@param {Numeric} [nDuration] The time it takes for HTML elements to appear completely in seconds.
	@param {Function} [fCallback] The callback function to be executed after the HTML element have completely appeared
	@return {this} Fade-in 효과를 적용한 인스턴스 자신
	@remark
		<ul class="disc">
			<li>As filter is used in Internet Explorer 6, the elements disappear if they have the position attribute. In this case, the HTML element must have no position attribute.</li>
			<li>For Webkit-based browsers (Safari version 5 or higher, Mobile Safari, Chrome, Mobile Webkit) and Opera version 10.60 and higher, the CSS3 transition attribute is used. Use java scripts in all other browsers.</li>
		</ul>
	@see http://www.w3.org/TR/css3-transitions/ CSS Transitions - W3C
	@see jindo.$Element#show
	@see jindo.$ElementList#show
	@see jindo.$Element#disappear
	@see jindo.$ElementList#disappear
	@example
		$Element("sample1").appear(5, function(){
			$ElementList(".sample2 li").appear(3);
		});
		
		//Before
		<div id="sample1" style="display: none;">
			<ul class="sample2">
				<li style="display: none;">Example1</li>
				<li style="display: none;">Example2</li>
			</ul>
		</div>
		
		//After(1): sample1 element appears.
		<div id="sample1" style="display: block;opacity: 1;">
			<ul class="sample2">
				<li class="selected" style="display: none;">Example1</li>
				<li class="selected" style="display: none;">Example2</li>
			</ul>
		</div>
		
		//After(2): elements of the  sample2 appear.
		<div id="sample1" style="display: block;opacity: 1;">
			<ul class="sample2">
				<li class="selected" style="display: block;opacity: 1;">Example1</li>
				<li class="selected" style="display: block;opacity: 1;">Example2</li>
			</ul>
		</div>
*/
//-!jindo.$ElementList.prototype.appear end!-//
//-!jindo.$ElementList.prototype.disappear start(jindo.$Element.prototype.disappear)!-//
/**
 	The disappear() method makes HTML elements slowly disappear (fade-out effect).
	
	@method disappear
	@param {Numeric} [nDuration] The time it takes for HTML elements to disappear completely in seconds.
	@param {Function} [fCallback] The callback function to be executed after the HTML element have completely disappeared.
	@return {this} Fade-out 효과를 적용한 인스턴스 자신
	@remark
		<ul class="disc">
			<li>If the HTML element has completely disappeared, the attribute of the element changes to "none."</li>
			<li>For Webkit-based browsers (Safari version 5 or higher, Mobile Safari, Chrome, Mobile Webkit) and Opera version 10.6 and higher, the CSS3 transition attribute is used. Use java scripts in all other browsers.</li>
		</ul>
	@see http://www.w3.org/TR/css3-transitions/ CSS Transitions - W3C
	@see jindo.$Element#hide
	@see jindo.$ElementList#hide
	@see jindo.$Element#appear
	@see jindo.$ElementList#appear
	@example
		$ElementList(".sample2 li").disappear(5, function(){
			$Element("sample1").disappear(3);
		});
		
		//Before
		<div id="sample1" style="display: none;">
			<ul class="sample2">
				<li style="display: none;">Example1</li>
				<li style="display: none;">Example2</li>
			</ul>
		</div>
		
		//After(1): elements of the sample2 disappear.
		<div id="sample1" style="display: block;opacity: 1;">
			<ul class="sample2">
				<li class="selected" style="display: none;opacity: 0;">Example1</li>
				<li class="selected" style="display: none;opacity: 0;">Example2</li>
			</ul>
		</div>
		
		//After(2): sample1 element disappears.
		<div id="sample1" style="display: none;opacity: 0;">
			<ul class="sample2">
				<li class="selected" style="display: none;opacity: 0;">Example1</li>
				<li class="selected" style="display: none;opacity: 0;">Example2</li>
			</ul>
		</div>
*/
/**
 Handled as below due to an Opera bug.
*/
//-!jindo.$ElementList.prototype.disappear end!-//

//-!jindo.$ElementList.prototype.className start(jindo.$Element.prototype.className)!-//
/**
 	The className() configures the name of a class in HTML elements.
	
	@method className
	@param {String+} sClass The class name to be specified. To specify one or more classes, list the class names by separating them with a single space.
	@return {this} 지정한 클래스를 반영한 인스턴스 자신
	@throws {jindo.$Except.NOT_FOUND_ARGUMENT} The exception occurs when no parameters exist.
	@see jindo.$Element#hasClass
	@see jindo.$Element#addClass
	@see jindo.$ElementList#addClass
	@see jindo.$Element#removeClass
	@see jindo.$ElementList#removeClass
	@see jindo.$Element#toggleClass
	@see jindo.$ElementList#toggleClass
	@example
		// Configures class names in HTML elements described above.
		$ElementList(".sample li").className("highlight");
		
		//Before
		<style type="text/css">
		.sample .selected { color:#0077FF; }
		.sample .highlight { background:#C6E746; }
		</style>
		
		<ul class="sample">
			<li class="selected">Example1</li>
			<li class="selected">Example2</li>
		</ul>
		
		//After
		<ul class="sample">
			<li class="highlight">Example1</li>
			<li class="highlight">Example2</li>
		</ul>
	@example
		// HTML 요소에 여러개의 클래스 이름 설정
		$ElementList(".sample li").className("highlight selected");
		
		//Before
		<style type="text/css">
		.sample .selected { color:#0077FF; }
		.sample .highlight { background:#C6E746; }
		</style>
		
		<ul class="sample">
			<li class="list">Example1</li>
			<li class="list">Example2</li>
		</ul>
		
		//After
		<ul class="sample">
			<li class="highlight selected">Example1</li>
			<li class="highlight selected">Example2</li>
		</ul>
*/
//-!jindo.$ElementList.prototype.className end!-//
//-!jindo.$ElementList.prototype.width start(jindo.$Element.prototype.width)!-//
/**
 	The width() method configures the width of HTML elements.
	
	@method width
	@param {Numeric} nWidth	The width value to be set in pixels.<br>The value of the parameter is numerics.
	@return {this} width 속성 값을 반영한 인스턴스 자신
	@remark Each browser calculates the size of the Box model in a different manner. For this reason, the value of the width attribute of CSS may be different from the value returned by the width() method.
	@see jindo.$Element#height
	@see jindo.$ElementList#height
	@example
		// Configures the width value in HTML Elements described above.
		$ElementList(".sample li").width(200);
		
		//Before
		<style type="text/css">
			.sample li { width:70px; padding:5px; margin:5px; background:red; }
		</style>
		
		<ul class="sample">
			<li class="list">Example1</li>
			<li class="list">Example2</li>
		</ul>
		
		//After
		<ul class="sample">
			<li class="list" style="width: 190px">Example1</li>
			<li class="list" style="width: 190px">Example2</li>
		</ul>
*/
//-!jindo.$ElementList.prototype.width end!-//
//-!jindo.$ElementList.prototype.height start(jindo.$Element.prototype.height)!-//
/**
 	The height() method configures the real height of HTML elements.
	
	@method height
	@param {Number} nHeight The height value to be set in pixels.<br>The value of the parameter is numerics. If the parameter is omitted, returns the height value.
	@return {this} height 속성 값을 반영한 인스턴스 자신
	@remark Each browser calculates the size of the Box model in a different manner. For this reason, the value of the height attribute of CSS may be different from the value returned by the height method.
	@see jindo.$Element#width
	@see jindo.$ElementList#width
	@example
		// Configures the height value of HTML Elements described above.
		$ElementList("sample_div").height(100);
		
		//Before
		<style type="text/css">
			div { width:70px; height:50px; padding:5px; margin:5px; background:red; }
		</style>
		
		<ul class="sample">
			<li class="list">Example1</li>
			<li class="list">Example2</li>
		</ul>
		
		//After
		<ul class="sample">
			<li class="list" style="height: 90px">Example1</li>
			<li class="list" style="height: 90px">Example2</li>
		</ul>
*/
//-!jindo.$ElementList.prototype.height end!-//
//-!jindo.$ElementList.prototype.text start(jindo.$Element.prototype.text)!-//
/**
 	The text() method configures the text node value of HTML elements.
	
	@method text
	@param {String+} sText Text to be specified
	@return {this} 지정한 값을 설정한 인스턴스 자신
	@example
		// Configures the text node value
		$ElementList(".sample li").text("New Example");
		
		//Before
		<ul class="sample">
			<li><span>Old Example1</span></li>
			<li><span>Old Example2</span></li>
		</ul>
		
		//After
		<ul class="sample">
			<li>New Example</li>
			<li>New Example</li>
		</ul>
*/
//-!jindo.$ElementList.prototype.text end!-//
//-!jindo.$ElementList.prototype.html start(jindo.$Element.prototype.html)!-//
/**
 	The html() method configures the inner HTML code of HTML elements. 이때 모든 하위 요소의 모든 이벤트 핸들러를 제거한다.
	
	@method html
	@param {String+} sHTML The HTML character string to be set as the inner HTML code.
	@return {this} 지정한 값을 설정한 인스턴스 자신
	@remark When modifying the col of colgroup in Internet Explorer 8, delete and recreate the colgroup and then add col. 
	@see https://developer.mozilla.org/en/DOM/element.innerHTML element.innerHTML - MDN Docs
	@see jindo.$Element#outerHTML
	@example
		// Searches inner HTML values.
		$ElementList(".sample li").html("<p><em>New</em> Example</p>");
		
		//Before
		<ul class="sample">
			<li><em>Old</em> Example1</li>
			<li><em>Old</em> Example2</li>
		</ul>
		
		//After
		<ul class="sample">
			<li><p><em>New</em> Example</p></li>
			<li><p><em>New</em> Example</p></li>
		</ul>
*/
/**
  * Fixes it so as to ensure that no problem exists even if setting innerHTML in Select tag or TABLE, TR, THEAD
 * and TBODY tag in some situations of IE or FireFox - hooriza
*/
/**
 * For the select tag in IE, if there is a selected option among the options,
* the options before it are all set to true if selected is in the middle;
* to solve this, use cloneNode and change selected after copying the option. - mixed
*/
//-!jindo.$ElementList.prototype.html end!-//
//-!jindo.$ElementList.prototype.css start(jindo.$Element.prototype.css)!-//
/**
 	The css() method configures the CSS attributes of HTML elements.
	
	@method css
	@syntax vName, vValue
	@syntax oList
	@param {String+} vName The name (String) of the CSS attribute
	@param {String+ | Numeric} vValue The value to be configured in the CSS attribute.<br>Uses either numbers or character strings that include the unit.
	@param {Hash+} oList An object or hash object (jindo.$H() object) that has one or more CSS attributes and values.
	@return {this} CSS 속성 값을 반영한 인스턴스 자신
	@throws {jindo.$Except.NOT_USE_CSS} The exception occurs when the element cannot use css.
	@remark 
		<ul class="disc">
			<li>To execute the method, the CSS attribute uses Camel Notation. For example, the border-width-bottom attribute can be specified with borderWidthBottom.</li>
			<li>The css method uses cssFloat instead of float, because the float attribute is a reserved word in JavaScript. The method uses styleFloat in IE, and cssFloat in all other browsers.</li>
		</ul>
	@see jindo.$Element#attr
	@see jindo.$ElementList#attr
	@example
		// Configures the value of the CSS attribute.
		$ElementList('.sample li').css('backgroundColor', 'red');
		
		//Before
		<ul class="sample">
			<li class="highlight">Example1</li>
			<li class="highlight">Example2</li>
		</ul>
		
		//After
		<ul class="sample">
			<li class="highlight" style="background-color: red;">Example1</li>
			<li class="highlight" style="background-color: red;">Example2</li>
		</ul>
	@example
		// Configures multiple CSS attribute values.
		$ElementList('.sample li').css({
			width: "200px",		// 200
			height: "80px"  	// 80 으로 설정하여도 결과는 같음
		});
		
		//Before
		<ul class="sample">
			<li class="highlight" style="background-color: red;">Example1</li>
			<li class="highlight" style="background-color: red;">Example2</li>
		</ul>
		
		//After
		<ul class="sample">
			<li class="highlight" style="background-color: red; width: 200px; height: 80px;">Example1</li>
			<li class="highlight" style="background-color: red; width: 200px; height: 80px;">Example2</li>
		</ul>
*/
//-!jindo.$ElementList.prototype.css end!-//
//-!jindo.$ElementList.prototype.attr start(jindo.$Element.prototype.attr)!-//
/**
 	The attr() method configures the attribute of HTML elements.
	
	@method attr
	@syntax sName, vValue
	@syntax oList
	@param {String+} sName The name of the attribute (String)
	@param {Variant} vValue The value to be configured in the attribute. Uses either numbers or character strings that include the unit. If the configuration value is set to null, it deletes the HTML attribute.
	@param {Hash+} oList An object or hash object (jindo.$H() object) that has one or more attributes and values.
	@return {this} Property value applied instance of itself.
	@throws {jindo.$Except.NOT_USE_CSS} The exception occurs when sName is not characters, object, or $Hash.
	@remark 2.2.0 버전 부터 &lt;select&gt; 엘리먼트에 사용시, 옵션값을 설정할 수 있다.
	@see jindo.$Element#css
	@see jindo.$ElementList#css
	@example
		$ElementList(".sample a").attr("href", "http://www.hangame.com");
		
		//Before
		<div class="sample">
			<a href="http://www.naver.com" target="_blank">네이버</a>
			<a href="#">한게임</a>
		</div>
		
		//After
		<ul class="sample">
			<a href="http://www.hangame.com" target="_blank">네이버</a>
			<a href="http://www.hangame.com" target="_blank">한게임</a>
		</ul>
	@example
		$ElementList(".sample a").attr({
		    "href" : "http://www.hangame.com",
		    "target" : "_blank"
		});
		
		//Before
		<div class="sample">
			<a href="http://www.naver.com" target="_self">네이버</a>
			<a href="#">한게임</a>
		</div>
		
		//After
		<div class="sample">
			<a href="http://www.hangame.com" target="_blank">네이버</a>
			<a href="http://www.hangame.com" target="_blank">한게임</a>
		</div>
	@example
		<select class="sample">
			<option value="naver">네이버</option>
			<option value="hangame">한게임</option>
			<option>쥬니버</option>
		</select>
		<select class="sample">
			<option value="naver">네이버</option>
			<option value="hangame">한게임</option>
			<option>해피빈</option>
		</select>
		<script type="text/javascript">
			var wel = $ElementList(".sample");
			wel.attr("value", null); // null
			
			// 해당 셀렉트리스트에서 "hangame" 옵션 선택함
			wel.attr("value", "한게임");
			
			// 해당 셀렉트리스트에서 "쥬니버" 옵션 선택함
			// 해당 옵션이 없으면 선택한 옵션 없음(null)
			wel.attr("value", "쥬니버");
			
			// 해당 셀렉트리스트에서 "naver" 옵션 선택함
			wel.attr("value", "naver");
			
			// 해당 셀렉트리스트에서 "해피빈" 옵션 선택함
			// 해당 옵션이 없으면 선택한 옵션 없음(null)
			wel.attr("value", "해피빈");
			
			// multiple이 아닐 때 파라미터를 배열로 입력시 선택한 옵션 없음(null)
			wel.attr("value", ["hangame"]);
		</script>
	@example
		<select class="sample" multiple="true">
			<option value="naver">네이버</option>
			<option value="hangame">한게임</option>
			<option>쥬니버</option>
		</select>
		<select class="sample" multiple="true">
			<option value="naver">네이버</option>
			<option value="hangame">한게임</option>
			<option>해피빈</option>
		</select>
		<script type="text/javascript">
			var wel = $ElementList(".sample");
			
			// 해당 셀렉트리스트에서 각각 ["naver"], ["naver"] 옵션 선택함
			wel.attr("value", "naver");
			
			// 선택한 옵션 없음(null, null)
			wel.attr("value", null);
			
			// 해당 셀렉트리스트에서 ["hangame"], ["hangame"] 옵션 선택함
			wel.attr("value", ["한게임"]);
			
			// 선택한 옵션 없음(null, null)
			wel.attr("value", []);
			
			// 해당 셀렉트리스트에서 ["naver", "hangame"], ["naver", "hangame"] 옵션 선택함
			wel.attr("value", ["네이버", "hangame"]);
			
			// 해당 셀렉트리스트에서 ["쥬니버"], ["쥬니버"] 옵션 선택함
			wel.attr("value", ["쥬니버", "me2day"]);
			
			// 해당 셀렉트리스트에서 ["naver"], ["naver", "해피빈"] 옵션 선택함
			wel.attr("value", ["naver", "해피빈"]);
		</script>
*/
//-!jindo.$ElementList.prototype.attr end!-//

/**
 	@fileOverview A file to define the constructor and methods of the jindo.$S() object
	@name string.js
	@author NAVER Ajax Platform
 */
//-!jindo.$S start!-//
/**
 	The jindo.$S() object provides functionality to handle a string by wrapping the String object.
	
	@class jindo.$S
	@keyword string
 */
/**
 	Creates the jindo.$S() object.
	
	@constructor
	@param {String+} sStr A string to wrap
	@example
		var sStr = 'Hello world!';
		var oStr = $S(sStr);            // Creates the jindo.$S() object
		var oStr2 = new $S(sStr);        // Creates the jindo.$S() object using new
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
		
	var oArgs = jindo._checkVarType(arguments, {
	    'nul' : ['nul:Null'],
	    'unde' : ['unde:Undefined'],
		'4var' : ['str:Variant']
	},"$S");
	
	switch(oArgs+""){
        case "nul":
        case "unde":
            this._str = "";
            break; 
        case "4var":
            this._str = (oArgs.str).toString();
            break;
    }
};
//-!jindo.$S end!-//

//-!jindo.$S.prototype.$value start!-//
/**
 	The $value() method returns the original string (String object) wrapped by the jindo.$S() object. It works like the toString() method.
	
	@method $value
	@return {String} The original String object
	@see jindo.$S#toString
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String String - MDN Docs
	@example
		var str = $S("Hello world!!");
		str.$value();
		
		// Result :
		// Hello world!!
 */
jindo.$S.prototype.$value = function() {
	//-@@$S.$value-@@//
	//-@@$S.toString-@@//
	return this._str;
};
//-!jindo.$S.prototype.$value end!-//

//-!jindo.$S.prototype.toString start!-//
/**
 	The toString() method returns the original string (String object) wrapped by the jindo.$S() object. It works like the $value() method.
	
	@method toString
	@return {String} The original String object
	@see jindo.$S#$value
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String String - MDN Docs
	@example
		var str = $S("Hello world!!");
		str.toString();
		
		// 결과 :
		// Hello world!!
 */
jindo.$S.prototype.toString = jindo.$S.prototype.$value;
//-!jindo.$S.prototype.toString end!-//

//-!jindo.$S.prototype.trim start!-//
/**
 	The trim() method removes spaces on both sides of a string.
	
	@method trim
	@return {jindo.$S} A new jindo.$S() object in which spaces on both sides of a string are removed.
	@remark The functionality to remove leading spaces is available in version 1.4.1 and higher.
	@example
		var str = "   I have many spaces.   ";
		document.write ( $S(str).trim() );
		
		// Result :
		// I have many spaces.
 */
jindo.$S.prototype.trim = function() {
	//-@@$S.trim-@@//
	if ("a".trim) {
		jindo.$S.prototype.trim = function() {
			return jindo.$S(this._str.trim());
		};
	}else{
		jindo.$S.prototype.trim = function() {
			return jindo.$S(jindo._p_.trim(this._str));
		};
	}
	
	return this.trim();
	
};
//-!jindo.$S.prototype.trim end!-//

//-!jindo.$S.prototype.escapeHTML start!-//
/**
 	The escapeHTML() method converts special characters in HTML to HTML entities.
	
	@method escapeHTML
	@return {jindo.$S} A new jindo.$S() object in which special characters are converted into entities.
	@remark The following table describes the characters to be converted.<br>
		<table class="tbl_board">
			<caption class="hide">HTML escape character conversion</caption>
			<thead>
				<tr>
					<th scope="col">Characters to be Converted</th>
					<th scope="col">&quot;</th>
					<th scope="col">&amp;</th>
					<th scope="col">&lt;</th>
					<th scope="col">&gt;</th>
					<th scope="col">&#39;</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">변환 결과</td>
					<td>&amp;quot;</td>
					<td>&amp;amp;</td>
					<td>&amp;lt;</td>
					<td>&amp;gt;</td>
					<td>&#39;</td>
				</tr>
			</tbody>
		</table>
	@see jindo.$S#unescapeHTML
	@see jindo.$S#escape
	@example
		var str = ">_<;;";
		document.write( $S(str).escapeHTML() );
		
		// Result :
		// &amp;gt;_&amp;lt;;;
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
 	The stripTags() method removes the XML or HTML tags from a string.
	
	@method stripTags
	@return {jindo.$S} A new jindo.$S() object from which XML or HTML tags are removed.
	@example
		var str = "Meeting <b>people</b> is easy.";
		document.write( $S(str).stripTags() );
		
		// Result :
		// Meeting people is easy.
 */
jindo.$S.prototype.stripTags = function() {
	//-@@$S.stripTags-@@//
	return jindo.$S(this._str.replace(/<\/?(?:h[1-5]|[a-z]+(?:\:[a-z]+)?)[^>]*>/ig, ''));
};
//-!jindo.$S.prototype.stripTags end!-//

//-!jindo.$S.prototype.times start!-//
/**
 	The times() method creates a string that repeats it the specified number of times in a parameter.
	
	@method times
	@param {Numeric} [nTimes=1] The number of times to repeat
	@return {jindo.$S} A new jindo.$S() object that repeats a string the specified number of times
	@example
		document.write ( $S("Abc").times(3) );
		
		// Result : AbcAbcAbc
 */
jindo.$S.prototype.times = function(nTimes) {
	//-@@$S.times-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4str' : ['nTimes:Numeric']
	},"$S#times");
	if (!oArgs) { return this; }
	return jindo.$S(Array(oArgs.nTimes+1).join(this._str));
};
//-!jindo.$S.prototype.times end!-//

//-!jindo.$S.prototype.unescapeHTML start!-//
/**
 	The unescapeHTML() method converts a escaped character to the original one.
	
	@method unescapeHTML
	@return {jindo.$S} A new jindo.$S() object that converts a escaped character to the original one.
	@see jindo.$S#escapeHTML
	@example
		var str = "&lt;a href=&quot;http://naver.com&quot;&gt;Naver&lt;/a&gt;";
		document.write( $S(str).unescapeHTML() );
		
		// Result :
		// <a href="http://naver.com">Naver</a>
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
 	The escape() method encodes the Korean characters included in a string to ASCII characters and escapes non-ASCII characters.
	
	@method escape
	@return {jindo.$S} A new jindo.$S() object in which a string is escaped
	@remark The following table describes the characters to be converted.<br>
		<table class="tbl_board">
			<caption class="hide">Escape character conversion</caption>
			<thead>
				<tr>
					<th scope="col">Characters to be Converted</th>
					<th scope="col">\r</th>
					<th scope="col">\n</th>
					<th scope="col">\t</th>
					<th scope="col">'</th>
					<th scope="col">"</th>
					<th scope="col">non-ASCII characters</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">Conversion Results</td>
					<td>\\r</td>
					<td>\\n</td>
					<td>\\t</td>
					<td>\'</td>
					<td>\"</td>	
					<td>\uXXXX</td>	
				</tr>
			</tbody>
		</table>
	@see jindo.$S#escapeHTML
	@example
		var str = '가"\'나\\';
		document.write( $S(str).escape() );
		
		// Result :
		// \uAC00\"\'\uB098\\
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
 	The bytes() method returns the actual number of bytes of a string.
	
	@method bytes
	@return {Number} Returns the number of bytes in a string.
	@example
		// Assumes that the document is encoded in EUC-KR.
		var str = "한글과 English가 섞인 문장...";
		
		document.write( $S(str).bytes() );
		
		// Result :
		// 37
 */
/**
 	The bytes() method trims the string as much as the size specified if the number of bytes is limited.
	
	@method bytes
	@param {Numeric} nLength The number of bytes to trim
	@return {jindo.$S} The jindo.$S() object of which string is trimmed as much as the size specified.
	@example
		// Assumes that the document is encoded in EUC-KR.
		var str = "한글과 English가 섞인 문장...";
		
		document.write( $S(str).bytes(20) );
		
		// Result :
		// 한글과 English가
 */
/**
 	bytes() 메서드는 지정한 인코딩 방식에 따라 한글을 비롯한 유니코드 문자열의 바이트 수를 계산한다.
	
	@method bytes
	@param {Hash+} oOptions 인코딩 방식과 제한할 크기를 설정한 객체.
		@param {String} oOptions.charset 인코딩 방식
		@param {String} [oOptions.size]  제한할 바이트 수 (이 옵션을 지정하면 해당 크기만큼 문자열을 잘라낸 $S() 객체를 반환, 이외의 경우 문자열의 크기(Number)를 반환)
	
	@return {Variant} oOptions 의 size 값의 유무에 따라 다른 값을 반환한다.
	@remark An encoding method is available in version 1.4.3 and higher.
	@example
		// 문서가 euc-kr 환경임을 가정합니다.
		var str = "한글과 English가 섞인 문장...";
		
		document.write( $S(str).bytes({charset:'euc-kr',size:20}) );
		
		// Result :
		// 한글과 English가 섞
		
		document.write( $S(str).bytes({charset:'euc-kr'}) );
		
		// Result :
		// 29
 */
jindo.$S.prototype.bytes = function(vConfig) {
	//-@@$S.bytes-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4voi' : [],
		'4num' : ["nConfig:Numeric"],
		'4obj' : ["nConfig:Hash+"]
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
		 유니코드 문자열의 바이트 수는 위키피디아를 참고했다(http://ko.wikipedia.org/wiki/UTF-8).
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
 	The parseString() method parses a URL query string to an object. See the example.
	
	@method parseString
	@return {Object} An object in which a string is parsed
	@see http://en.wikipedia.org/wiki/Querystring Query String - Wikipedia
	@example
		var str = "aa=first&bb=second";
		var obj = $S(str).parseString();
		
		// Result :
		// obj => { aa : "first", bb : "second" }
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
			buf[key][buf[key].length] = isescape? escape(val) : val;
		} else {
			buf[key] = isescape? escape(val) : val;
		}
	}

	return buf;
};
//-!jindo.$S.prototype.parseString end!-//

//-!jindo.$S.prototype.escapeRegex start!-//
/**
 	escapeRegex() 메서드는 문자열을 정규식에 사용할 수 있도록 이스케이프(escape)한다. 예제를 참고한다.
	
	@method escapeRegex
	@return {jindo.$S} The jindo.$S() object of which internal string is escaped
	@since 1.2.0
	@see http://en.wikipedia.org/wiki/Regexp Regular Expression
	@example
		var str = "Slash / is very important. Backslash \ is more important. +_+";
		document.write( $S(str).escapeRegex() );
		
		// Result : Slash \/ is very important\. Backslash is more important\. \+_\+
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
 	The format() method creates a new string by replacing a string with a format string. The format string starts with % and its types are the same as those are used in the sprinft() function in PHP.
	
	@method format
	@param {String} sFormatString The format string to be replaced
	@return {String} A new string created by replacing a string with a format string
	@see http://www.php.net/manual/en/function.sprintf.php sprintf() - php.net
	@see jindo.$S#times
	@example
		var str = $S("%4d년 %02d월 %02d일").format(2008, 2, 13);
		
		// Result :
		// str = "2008년 02월 13일"
		
		var str = $S("패딩 %5s 빈공백").format("값");
		
		// Result :
		// str => "패딩     값 빈공백"
		
		var str = $S("%b").format(10);
		
		// Result :
		// str => "1010"
		
		var str = $S("%x").format(10);
		
		// Result :
		// str => "a"
		
		var str = $S("%X").format(10);
		
		// Result :
		// str => "A"
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
 	@fileOverview A file to define the constructor and method of $Document
	@name document.js
	@author NAVER Ajax Platform
 */
//-!jindo.$Document start(jindo.$Document.prototype.renderingMode,jindo.cssquery)!-//
/**
 	The jindo.$Document() object provides document-related information.
	
	@class jindo.$Document
	@keyword document
 */
/**
 	Creates the jindo.$Document() object. If any parameter is not specified, the document element of a current document is specified by default.
	
	@constructor
	@syntax elDocument
	@param {Element} [elDocument] Document elements
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
	
	var oArgs = jindo._checkVarType(arguments, {
		'4doc'  : [ 'oDocument:Document+']
	},"$Document");
	if(oArgs==null){this._doc = document;}
	else{this._doc = el;}
	
	this._docKey = this.renderingMode() == 'Standards' ? 'documentElement' : 'body';	
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
			return function(sQuery) {
				var oArgs = jindo._checkVarType(arguments, {
					'4str'  : [ 'sQuery:String+']
				},"$Document#"+sMethod);
				return fp(sQuery,this._doc);
			};
		})(i, type[i]);
	}
	
})();
//-!jindo.$Document end!-//

//-!jindo.$Document.prototype.$value start!-//
/**
 	The $value() method returns the original document elements.
	
	@method $value
	@return {Element} A document element
 */
jindo.$Document.prototype.$value = function() {
	//-@@$Document.$value-@@//
	return this._doc;
};
//-!jindo.$Document.prototype.$value end!-//

//-!jindo.$Document.prototype.scrollSize start!-//
/**
 	The scrollSize() method returns an object that contains information about document width and height.
	
	@method scrollSize
	@return {Object} An object that contains information about document width and height
		@return {Number} .width Document width information. (unit: pixels)
		@return {Number} .top Document height information. (unit: pixels)
	@see jindo.$Document#clientSize
	@example
		var size = $Document().scrollSize();
		alert('width : ' + size.width + ' / height : ' + size.height); 
 */
jindo.$Document.prototype.scrollSize = function() {
	//-@@$Document.scrollSize-@@//
	/*
	  body must be used to get the normal scroll size even in Standard mode for webkit.
	 */
	var oDoc = this._doc[jindo._p_._JINDO_IS_WK?'body':this._docKey];
	
	return {
		width : Math.max(oDoc.scrollWidth, oDoc.clientWidth),
		height : Math.max(oDoc.scrollHeight, oDoc.clientHeight)
	};

};
//-!jindo.$Document.prototype.scrollSize end!-//

//-!jindo.$Document.prototype.scrollPosition start!-//
/**
 	The scrollPosition() method gets the current scroll position of the document.
	
	@method scrollPosition
	@return {Object} Returns left representing horizontal position and top representing vertical position as key values.
		@return {Number} .left Horizontal scroll position. (unit: pixels)
		@return {Number} .height Vertical scroll position. (unit: pixels)
	@since 1.3.5
	@example
		var size = $Document().scrollPosition();
		alert('horizontal : ' + size.left + ' / vertical : ' + size.top);
 */
jindo.$Document.prototype.scrollPosition = function() {
	//-@@$Document.scrollPosition-@@//
	/*
	 body must be used to get the normal scroll Size even in Standard mode for webkit.
	 */
	var oDoc = this._doc[jindo._p_._JINDO_IS_WK?'body':this._docKey];
	return {
		left : oDoc.scrollLeft||window.pageXOffset||window.scrollX||0,
		top : oDoc.scrollTop||window.pageYOffset||window.scrollY||0
	};

};
//-!jindo.$Document.prototype.scrollPosition end!-//

//-!jindo.$Document.prototype.clientSize start!-//
/**
 	The clientSize() method returns an object that contains inner width and height values of the document.
	(*to get viewport's size, use 'window.innerWidth/innerHeight' native properties values instead of using this method.)
	
	@method clientSize
	@return {Object} An object which contains width and height values.
		@return {Number} document's inner width. (unit: pixels)
		@return {Number} document's inner height. (unit: pixels)
	@see jindo.$Document#scrollSize
	@example
		var size = $Document(document).clientSize();
		alert('width : ' + size.width + ' / height : ' + size.height); 
 */
jindo.$Document.prototype.clientSize = function() {
	//-@@$Document.clientSize-@@//
	var oDoc = this._doc[this._docKey];

    return {
        width : oDoc.clientWidth,
        height : oDoc.clientHeight
    };
};
//-!jindo.$Document.prototype.clientSize end!-//

//-!jindo.$Document.prototype.renderingMode start!-//
/**
 	The renderingMode() method returns the document rendering.
	
	@method renderingMode
	@return {String} Rendering mode.
		@return {String} ."Standards" Standard mode
		@return {String} ."Almost" Almost standard mode. Returned on every web browser except Internet Explorer when the Document Type Declaration (DTD) is not properly specified.
		@return {String} ."Quirks" Quirks mode
	@filter desktop
	@see http://hsivonen.iki.fi/doctype/ Differences of rendering according to browser and DTD are described.
	@example
		var mode = $Document().renderingMode();
		alert('rendering mode : ' + mode);
 */
jindo.$Document.prototype.renderingMode = function() {
	//-@@$Document.renderingMode-@@//
	var agent = jindo._p_._j_ag;
	var isIe = jindo._p_._JINDO_IS_IE;
	var isSafari = (jindo._p_._JINDO_IS_WK && !jindo._p_._JINDO_IS_CH && navigator.vendor.indexOf("Apple")>-1);
	var sRet;

	if ('compatMode' in this._doc){
		sRet = this._doc.compatMode == 'CSS1Compat' ? 'Standards' : (isIe ? 'Quirks' : 'Almost');
	}else{
		sRet = isSafari ? 'Standards' : 'Quirks';
	}

	return sRet;

};
//-!jindo.$Document.prototype.renderingMode end!-//

//-!jindo.$Document.prototype.queryAll start(jindo.cssquery)!-//
/**
 	Returns array elements that satisfy the specified document selectors. An empty array is returned if any element satisfying the given selector does not exist. Specifying document as an elBaseElement parameter in the $$() function is the same way to use this.
	
	@method queryAll
	@param {String+} sSelector CSS selectors. There are two types of patterns that can be used as CSS selectors: standard and non-standard patterns. The standard pattern is supported by the CSS Level 3 specification. For more information about pattern of given selector, see the $$() function and See Also section.
	@return {Array} The array elements that satisfy conditions of given selector
	@see _global_.html#$$
	@see http://www.w3.org/TR/css3-selectors/ CSS Level 3 Specification - W3C
	@example
		$Document().queryAll("span");  // Selects every <span> element in a document.
 */
//-!jindo.$Document.prototype.queryAll end!-//

//-!jindo.$Document.prototype.query start(jindo.cssquery)!-//
/**
 	Returns a first element that satisfies the given selector in a document. null is returned if any element satisfying the given selector does not exist. Specifying document as an elBaseElement parameter in the $$.getSingle function is the same way to use this.
	
	@method query
	@param {String+} sSelector CSS selectors. There are two types of patterns that can be used as CSS selectors: standard and non-standard patterns. The standard pattern is supported by the CSS Level 3 specification. For more information about pattern of given selector, see the $$() function and See Also section.
	@return {Element} A first element that satisfies conditions of given selector
	@see _global_.html#.$$.getSingle
	@see _global_.html#$$
	@see http://www.w3.org/TR/css3-selectors/ CSS Level3 Specification - W3C
	@example
		$Document().query("body");  // Select the <body> element.
 */
//-!jindo.$Document.prototype.query end!-//

//-!jindo.$Document.prototype.xpathAll start(jindo.cssquery)!-//
/**
 	Gets elements that satisfy the XPath syntax in a document. It is recommended to use only in certain circumstances because supported syntaxes are limited. Specifying document as an elBaseElement parameter in the $$.xpath() function is the same way to use this.
	
	@method xpathAll
	@param {String+} sXPath The XPath value
	@return {Array} The array that has elements satisfying the XPath syntax as its components
	@see _global_.html#.$$.xpath
	@see http://www.w3.org/standards/techs/xpath#w3c_all XPath Document - W3C
	@example
		var oDocument = $Document();
		alert (oDocument.xpathAll("body/div/div").length);
 */
//-!jindo.$Document.prototype.xpathAll end!-//


/**
 	@fileOverview A file to define the constructor and methods of the jindo.$Form() object
	@name form.js
	@author NAVER Ajax Platform
 */
//-!jindo.$Form start!-//
/**
 	The jindo.$Form() object provides functions to handle &lt;form&gt; and its child elements.
	
	@class jindo.$Form
	@keyword form
 */
/**
 	Creates the jindo.$Form() object.
	
	@constructor
	@syntax elForm
	@syntax sId
	@param {Element} elForm The &lt;form&gt; element
	@param {String} sId The ID (String) of the &lt;form&gt; element. If there are two or more &lt;form&gt; elements with identical IDs, returns the jindo.$Form() object that wraps the first element.
	@return {Element} The original &lt;form&gt; element
 */
jindo.$Form = function (el) {
	//-@@$Form-@@//
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	
	if (!(this instanceof cl)){
		try {
			jindo.$Jindo._maxWarn(arguments.length, 1,"$Form");
			return new cl(el);
		} catch(e) {
			if (e instanceof TypeError) { return null; }
			throw e;
		}
	}	
	
	var oArgs = jindo._checkVarType(arguments, {
		'4str' : ['oForm:String+'],
		'4ele' : [ 'oForm:Element+']
	},"$Form");
	
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
 	The $value method returns the original form elements.

	@method $value
	@return {Element} The original &lt;form&gt; element
	@example
		var el = $('<form>');
		var form = $Form(el);
		
		alert(form.$value() === el); // true
 */
jindo.$Form.prototype.$value = function() {
	//-@@$Form.$value-@@//
	return this._form;
};
//-!jindo.$Form.prototype.$value end!-//

//-!jindo.$Form.prototype.serialize start(jindo.$H.prototype.toQueryString)!-//
/**
 	The serialize() method returns a specific input element or all input elements of an element in the query string format.
	
	@method serialize
	@param {String} [sName*] The name of the 1st~Nth input element. If no parameter is entered when the serialize() method is used, returns all input elements under the &lt;form&gt; element in the query string format. If a parameter is entered, returns the input element with the name attribute identical with the specified name in the query string format.
	@return {String} A string converted in the query string format
	@see http://en.wikipedia.org/wiki/Querystring Query String - Wikipedia
	@example
		<form id="TEST">
			<input name="ONE" value="1" type="text" />
			<input name="TWO" value="2" checked="checked" type="checkbox" />
			<input name="THREE" value="3_1" type="radio" />
			<input name="THREE" value="3_2" checked="checked" type="radio" />
			<input name="THREE" value="3_3" type="radio" />
			<select name="FOUR">
				<option value="4_1">..</option>
				<option value="4_2">..</option>
				<option value="4_3" selected="selected">..</option>
			</select>
		</form>
		
		<script type="text/javascript">
			var form = $Form('TEST');
		
			var allstr = form.serialize();
			// ONE=1&TWO=2&THREE=3_2&FOUR=4_3
		
			var str = form.serialize('ONE', 'THREE');
			// ONE=1&THREE=3_2'
		</script>
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
 	The element() method returns a specific input element or all input elements. Able to specify the name of the input element that is to be passed to the parameter.
	
	@method element
	@param {String+} [sKey] The name of an input element. If the parameter is omitted, retrieves the values of all input elements.
	@return {Array | Element} An array that has an input element or Input element.
 */
jindo.$Form.prototype.element = function(sKey) {
	//-@@$Form.element-@@//
	
	var oArgs = jindo._checkVarType(arguments, {
		'4voi' : [],
		'4str' : [jindo.$Jindo._F('sKey:String+')]
	},"$Form#element");
	
	switch(oArgs+""){
		case "4voi":
			return jindo._p_._toArray(this._form.elements);	
		case "4str":
			return this._form.elements[sKey+""];
	}
};
//-!jindo.$Form.prototype.element end!-//

//-!jindo.$Form.prototype.enable start!-//
/**
 	enable() method checks the availability of an input element. To check the availability of the element, enter the name of the input element to the parameter.
	
	@method enable
	@param {String+} sName The name of an input element
	@return {Boolean} The Boolean value that specifies whether an input element is enabled
 */
/**
 	enable() method configures the availability of an input element. If true is entered with the name of the input element, the element is enabled. If false, the element is disabled. In addition, an object may be entered to change the availability of multiple elements simultaneously.
	
	@method enable
	@syntax sName, bEnable
	@syntax oList
	@param {String+} sName The name of an input element
	@param {Boolean} bEnable Whether to enable it
	@param {Hash+} oList The object and $H that specifies whether multiple input elements are enabled
	@return {this} 입력 요소의 활성화 여부를 반영한 인스턴스 자신
	@example
		<form id="TEST">
			<input name="ONE" disabled="disabled" type="text" />
			<input name="TWO" type="checkbox" />
		</form>
		
		<script type="text/javascript">
			var form = $Form('TEST');
		
			form.enable('ONE');	// false
		
			form.enable('TWO', false);
			form.enable('TWO');	// false
		
			form.enable({
				'ONE' : true,
				'TWO' : false
			});
			
			form.enable('ONE');	// true
			form.enable('TWO');	// false
		</script>
 */
jindo.$Form.prototype.enable = function(sKey) {
	//-@@$Form.enable-@@//
	var oArgs = jindo._checkVarType(arguments, {
		's4bln' : [ 'sName:String+', 'bEnable:Boolean' ],
		's4obj' : [ 'oObj:Hash+'],
		'g' : [ jindo.$Jindo._F('sName:String+')]
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
 	The value() method retrieves the value of the &lt;form&gt; element. To check the value of the element, enter the name of the input element to the parameter.
	
	@method value
	@param {String+} sName The name of an input element
	@return {String} The value of an input element
	@throws {jindo.$Except.NOT_FOUND_ELEMENT} The exception occurs when no elements exist.
 */
/**
 	The value() method configures the value of the &lt;form&gt; element. If the value is specified with the name of the input element, it changes the value of the element. In addition, an object may be entered to change the values of multiple elements simultaneously.

	@method value
	@syntax sName, sValue
	@syntax oList
	@param {String+} sName The name of an input element
	@param {Variant} sValue A value to be specified in an input element
	@param {Hash+} oList 하나 이상의 입력 요소 이름과 값을 지정한 객체(Object) 또는 해시 객체(jindo.$H() object)
	@return {this} 입력 요소의 값을 반영한 인스턴스 자신
	@remark 2.2.0 버전부터, &lt;select&gt;엘리먼트의 옵션값 지정에 &lt;option&gt;의 value속성뿐만 아니라 text속성도 사용 가능하다.
	@throws {jindo.$Except.NOT_FOUND_ELEMENT} The exception occurs when no elements exist.
	@example
		<form id="TEST">
			<input name="ONE" value="1" type="text" />
			<input name="TWO" type="checkbox" />
		</form>
		<script type="text/javascript">
			var form = $Form('TEST');
		
			form.value('ONE');	// 1
			
			form.value('TWO');	// undefined
		
			form.value('TWO', 2);
			form.value('TWO');	//2
		
			form.value({
				'ONE' : '1111',
				'TWO' : '2'
			});
			
			form.value('ONE');	// 1111
			form.value('ONE');	// 2
		</script>
	@example
		<form id="test">
			<select name="one">
				<option value="Apple">Apple</option>
				<option value="Orange">Orange</option>
				<option>Pineapple</option>
				<option>Banana</option>
			</select>
			<select name="multi" multiple="true">
				<option value="naver">naver</option>
				<option value="hangame">hangame</option>
				<option>me2day</option>
				<option>happybean</option>
			</select>
		</form>
		<script type="text/javascript">
			var welForm = $Form("test");
			welForm.value("one"); // "Apple"
			welForm.value("one", null).value("one"); // undefined
			welForm.value("one", "Orange").value("one"); // "Orange"
			welForm.value("one", "").value("one"); // undefined
			welForm.value("one", "Orange").value("one"); // "Orange"
			welForm.value("one", undefined).value("one"); // undefined
			welForm.value("one", "Banana").value("one"); // "Banana"
			welForm.value("one", []).value("one"); // undefined
			
			welForm.value("multi"); // undefined
			welForm.value("multi", "naver").value("multi"); // "naver"
			welForm.value("multi", []).value("multi"); // undefined
			welForm.value("multi", ["naver", "hangame", "me2day"]).value("multi"); // ["naver", "hangame", "me2day"]
			welForm.value("multi", null).value("multi"); // undefined
			welForm.value("multi", ["happybean", "hangame"]).value("multi"); // ["hangame", "happybean"]
			welForm.value("multi", ["happybean", "juniornaver"]).value("multi"); // undefined
			welForm.value("multi", ["happybean"]).value("multi"); // "happybean"
			welForm.value("multi", undefined).value("multi"); // undefined
		</script>
 */
jindo.$Form.prototype.value = function(sKey) {
	//-@@$Form.value-@@//
	
	var oArgs = jindo._checkVarType(arguments, {
		's4str' : [ 'sKey:String+', 'vValue:Variant' ],
		's4obj' : [ jindo.$Jindo._F('oObj:Hash+')],
		'g' : [ 'sKey:String+']
	},"$Form#value");
	
	var elOption,
		sValue;
	
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
						
						for(var i = 0, len = o.options.length; i < len; i++){
							elOption = o.options[i];
							
							if(elOption.value == sVal || elOption.text == sVal){
								nIndex = i;
								continue;
							}
						}
						o.selectedIndex = nIndex;
						
						break;
					
					case 'select-multiple':
						var nIndex = -1;
						
						if(jindo.$Jindo.isArray(sVal)){
							var waVal = jindo.$A(sVal);
							for (var i = 0, len = o.options.length; i < len; i++){
								elOption = o.options[i];
								o.options[i].selected = waVal.has(elOption.value) || waVal.has(elOption.text); 
							}
						}else{
							for(var i = 0, len = o.options.length; i < len; i++){
								elOption = o.options[i];
								
								if(elOption.value == sVal || elOption.text == sVal){
									nIndex = i;
									continue;
								}
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
					if(o.checked){
						aRet.push(o.value);
					}
					break;
				
				case 'select-one':
					if(o.selectedIndex != -1){
						elOption = o.options[o.selectedIndex];
						sValue = elOption.value == "" ? elOption.text : elOption.value;
						aRet.push(sValue);
					}
					break;
					
				case 'select-multiple':
					if(o.selectedIndex != -1){
						for(var i = 0, len = o.options.length; i < len; i++){
							elOption = o.options[i];
							if(elOption.selected){
								sValue = elOption.value == "" ? elOption.text : elOption.value;
								aRet.push(sValue);
							}
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
 	The submit() method submits the data of the &lt;form&gt; element. When a parameter is specified in the submit() method, the target attribute of the &lt;form&gt; element is ignored and the information is sent to the specified target. At this time, the target attribute of the existing &lt;form&gt; element is not changed. A function can be entered as a parameter. When the function returns true, submits the data. By using this function, the user can validate the data before it is transmitted.	
	
	@method submit
	@syntax
	@syntax sTargetName
	@syntax fValidation
	@syntax sTargetName, fValidation
	@param {String+} sTargetName Transmit target
	@param {Function+} fValidation A function that is used to validate the data of the &lt;form&gt; element. The parameter of the function allows the original &lt;form&gt; element that is wrapped by the jindo.$Form() object to be entered.
	@return {this} 데이터를 제출한 인스턴스 자신
	@example
		var form = $Form(el);
		form.submit();
		form.submit('foo');
	@example
		// When the fValidation parameter has been used
		var form = $Form(el);
		form.submit("target_name");
		
		form.submit(function(){
			if($("test").value.length > 0) {
				return true; // return true; if true is returned, the submit() method is executed.
			}
			
			return false; // return false; if false is returned, the submit() method is not executed.
		});
		
		form.submit("target_name", function(){
			if($("test").value.length > 0) {
				return true;
			}
			
			return false;
		});
 */
jindo.$Form.prototype.submit = function(sTargetName, fValidation) {
	//-@@$Form.submit-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'voi' : [],
		'4str' : [ 'sTargetName:String+'],
		'4fun' : [ 'fValidation:Function+'],
		'4fun2' : [ 'sTargetName:String+',"fValidation:Function+"]
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
 	The reset() method initializes the &lt;form&gt; element. In addition, a function can be entered as a parameter. If the function returns true, it initializes the &lt;form&gt; element.
	
	@method reset
	@param {Function+} [fValidation] A function to be executed before initializing data of the &lt;form&gt; element
	@return {this} 데이터를 초기화한 인스턴스 자신
	@example
		var form = $Form(el);
		form.reset();
	@example
		// If the fValidation parameter has been used
		var form = $Form(el);
		
		form.submit(function(){
			return confirm("Do you want to initialize it?");
		});
 */
jindo.$Form.prototype.reset = function(fValidation) {
	//-@@$Form.reset-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4voi' : [ ],
		'4fun' : [ 'fValidation:Function+']
	},"$Form#reset");
	
	if(oArgs+"" == "4fun") if(!fValidation.call(this,this._form)) return this;
	
	this._form.reset();
	return this;
	
};
//-!jindo.$Form.prototype.reset end!-//


/**
 	@fileOverview A file to define the constructor and methods of the jindo.$Template() object
	@name template.js
	@author NAVER Ajax Platform
 */
//-!jindo.$Template start!-//
/**
   	The jindo.$Template() object interprets a template and applies data in a template dynamically.
	
	@class jindo.$Template
	@keyword template
 */
/**
 	Creates the jindo.$Template() object.

	@constructor
	@syntax sTemplate, sEngineName
	@syntax elTemplate, sEngineName
	@param {String+} sTemplate A string to be used as a template or the id of HTML elements.<br />
		If a parameter is string, it operates in two ways.
		<ul class="disc">
			<li>If a string is the id of HTML elements, innerHTML of the HTML elements is used as a template.</li>
			<li>If it is a string, the string itself is used as a template.</li>
		</ul>
	@param {Element+} elTemplate HTML elements as a template. If a parameter is the HTML element, only EXTAREA and SCRIPT can be used.
		<ul class="disc">
			<li>If HTML elements are part of the SCRIPT element, the type attribute must be specified as "text/template."</li>
			<li>If value of HTML elements is used as a template. If value does not exist, innerHTML of the HTML elements is used as a template.</li>
		</ul>
	@param {String+} [sEngineName="default"] 사용할 컴파일 엔진의 이름. 정적 메서드 jindo.$Template.addEngine()를 사용하여 사용자가 원하는 엔진을 등록하여 사용할 수 있다. 각 엔진별로 그에 상응하는 문법의 템플릿을 사용해야 한다.
		@param {String+} [sEngineName."default"] 기존 $Template 엔진. sEngineName 파라미터 생략시 "default" 엔진을 사용한다.
		@param {String+} sEngineName."micro" John Resig의 <auidoc:see content="http://ejohn.org/blog/javascript-micro-templating/">Micro-Templating 엔진</auidoc:see>.
		@param {String+} sEngineName."handlebars" <auidoc:see content="http://handlebarsjs.com/">handlebars 엔진</auidoc:see>.<br />
				handlebars 엔진을 사용하기 위해서는 별도로 해당 js 파일을 삽입해야 한다. 삽입하지 않고 handlebars 엔진으로 인스턴스 생성 후, $Template#process 메서드를 호출 하면 jindo.$Except.NOT_FOUND_HANDLEBARS 오류가 발생한다.
		@param {String+} sEngineName."simple" 2.4.0 버전에 새롭게 추가된, 단순 문자열 치환 엔진.<br />
				simple 엔진의 템플릿 문법은 치환하고자 하는 문자열을 중괄호 2개로 감싸주면 된다. if 문이나 for 문등은 지원하지 않는다. ex) {{replaced}}
	@see jindo.$Template.addEngine
	@history 2.4.0 Update 기존 컴파일 엔진 외에 John Resig의 Micro-Templating 엔진, handlebars 엔진, simple 엔진을 지원한다. 템플릿 문자열을 파싱한 함수를 내부적으로 캐시하므로 성능이 향상되었다.
	@example
		// If a parameter is a string,
		var tpl = $Template("{=service} : {=url}");
	@example
		<textarea id="tpl1">
			{=service} : {=url}
		</textarea>
		
		// the same TEXTAREA element is used as a template.
		var template1 = $Template("tpl1");		// If a parameter is the id of the HTML element
		var template2 = $Template($("tpl1"));	// If a parameter is a TEXTAREA element
	@example
		<script type="text/template" id="tpl2">
			{=service} : {=url}
		</script>
		
		// the same SCRIPT element is used as a template.
		var template1 = $Template("tpl2");		// If a parameter is the id of the HTML element
		var template2 = $Template($("tpl2"));	// If a parameter is a SCRIPT element
	@example
		<script type="text/template" id="tpl3">
			<%=service%> : <%=url%>
		</script>
		
		// Micro-Templating 엔진을 사용하는 인스턴스로 생성.
		var template = $Template("tpl3", "micro");
	@example
		<script type="text/template" id="tpl4">
			{{service}} : {{url}}
		</script>
		
		// handlebars 엔진을 사용하는 인스턴스로 생성.
		var template = $Template("tpl4", "handlebars");
	@example
		<script type="text/template" id="tpl5">
			{{service}} : {{url}}
		</script>
		
		// simple 엔진을 사용하는 인스턴스로 생성.
		var template = $Template("tpl5", "simple");
	@example
		<script type="text/template" id="tpl6">
			{=service} : {=url}
		</script>
		
		// 사용자 정의 커스텀 엔진을 사용하는 인스턴스로 생성.
		jindo.$Template.addEngine("custom", function(sTemplate){
			return function(htData){
				return sTemplate.replace(/{=([^{}]*)}/g, function(a,b){
					return (typeof htData[b] == "undefined") ? "" : htData[b];
				});
			}
		});
		var template = $Template("tpl6", "custom");
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
	
	var oArgs = jindo._checkVarType(arguments, {
		'4str' : ['str:String+'],
		'4ele' : ['ele:Element+'],
		'4str3' : ['str:String+', 'sEngineName:String+'],
		'4ele3' : ['ele:Element+', 'sEngineName:String+']
	}, "$Template");
	
	if((obj = _getElementById(document, str) || str) && obj.tagName && (tag = obj.tagName.toUpperCase()) && (tag == "TEXTAREA" || (tag == "SCRIPT" && obj.getAttribute("type") == "text/template"))){
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
 	템플릿 문자열을 해석할 컴파일 엔진을 등록한다.
	
	@method addEngine
	@static
	@param {String+} sEngineName 등록하려는 컴파일 엔진의 이름 문자열
	@param {Function+} fnEngine 컴파일러 함수를 반환하는 함수
	@example
		// 사용자 정의 커스텀 엔진 등록
		jindo.$Template.addEngine("custom", function(sTemplate){
			return function(htData){
				return sTemplate.replace(/{=([^{}]*)}/g, function(a,b){
					return (typeof htData[b] == "undefined") ? "" : htData[b];
				});
			}
		});
 */
jindo.$Template.addEngine = function(sEngineName, fEngine){
	var oArgs = jindo._checkVarType(arguments, {
		"4fun" : ["sEngineName:String+", "fEngine:Function+"]
	}, "$Template#addEngine");
	
	jindo.$Template._aEngines[oArgs.sEngineName] = oArgs.fEngine;
};

/**
 	$Template.addEngine 에서 등록한 컴파일 엔진을 반환한다.
	
	@method getEngine
	@static
	@param {String+} sEngineName 반환받고자하는 컴파일 엔진의 이름 문자열
	@return {Function} 등록된 컴파일 엔진
	@example
		// 등록한 사용자 정의 커스텀 엔진을 반환받음
		var fComplier = jindo.$Template.getEngine("custom");
 */
jindo.$Template.getEngine = function(sEngineName){
	var oArgs = jindo._checkVarType(arguments, {
		"4str" : ["sEngineName:String+"]
	}, "$Template#getEngine");
	
	return jindo.$Template._aEngines[oArgs.sEngineName];
};
//-!jindo.$Template end!-//

//-!jindo.$Template.prototype.process start!-//
/**
 	The process() method interprets a template and create a new string by applying data.
	
	@method process
	@param {Hash+} [oDdata] An object that has data to be applied to a template. Part that data is applied to can be found by the name of object attribute.
	@return {String} A string that interprets and applies data
	@remark Processes string replacement if no syntax exists in the template. If syntax is used in a template when the template is interpreted, template interpretation varies depending on the syntax. See the table below to get syntax interpretation.<br>
		<h5>Template syntax</h5>
		<table class="tbl_board">
			<caption class="hide">Template syntax</caption>
			<thead>
				<tr>
					<th scope="col" style="width:30%">Category</th>
					<th scope="col">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">{=variable}</td>
					<td class="txt">Displays the attribute value that has the same name as the variable in the data object which is specified as a parameter.</td>
				</tr>
				<tr>
					<td class="txt bold">{if condition}<br>{elseif condition}<br>{else}<br>{/if}</td>
					<td class="txt">Selects a template's content to be displayed based on conditions.</td>
				</tr>
				<tr>
					<td class="txt bold">{for [index:]variable in array}<br>{/for}</td>
					<td class="txt">Displays a template's content in the for statement repeatedly.</td>
				</tr>
				<tr>
					<td class="txt bold">{set variable = value}</td>
					<td class="txt">Allocates a value to the temporary variable to be used in a template.</td>
				</tr>
				<tr>
					<td class="txt bold">{gset variable = value}</td>
					<td class="txt">It can be used in {js} by allocating it for local variables unlike set(available in version 2.0.0 and higher).</td>
				</tr>
				<tr>
					<td class="txt bold">{js function}</td>
					<td class="txt">Calls a specific function in a template.</td>
				</tr>
			</tbody>
		</table>
	@example
		// Replaces a string.
		// Replaces a value of {=value}.
		var tpl  = $Template("Value1 : {=val1}, Value2 : {=val2}");
		var data = { val1: "first value", val2: "second value" };
		
		document.write( tpl.process(data) );
		
		// Result
		// Value1 : first value, Value2 : second value
	@example
		// if/elseif/else: Conditional statement
		// Processes conditional statements when interpreting a template.
		var tpl= $Template("{if num >= 7} equal to or greater than 7.{elseif num <= 5} equal to or less than 5.{else} else 6?{/if}");
		var data = { num: 5 };
		
		document.write( tpl.process(data) );
		
		// Result
		// equal to or less than 5
	@example
		// set: Uses a temporary variable.
		// If it is set to val=1, {=val} is replaced with 1.
		var tpl  = $Template("{set val3=val1}Value1 : {=val1}, Value2 : {=val2}, Value3 : {=val3}");
		var data = { val1: "first value", val2: "second value" };
		
		document.write( tpl.process(data) );
		
		// Result
		// Value1 : first value, Value2 : second value, Value3 : first value
	@example
		// gset : Assigns as a local variable.
		// gset If it is set to val=1, it is possible to access by using {js}.
		var tpl  = $Template("{gset length=(=books).length}{for num:book in books}{js length}.{=book}\n{/for}");
		var data = {"books":[1,2,3]};
		
		document.write( tpl.process(data) );
		
		// Result
		// 3.1
		// 3.2
		// 3.3
	@example
		// js: Uses JavaScript.
		// Executes JavaScript when interpreting a template.
		var tpl  = $Template("Value1 : {js $S(=val1).bytes()}, Value2 : {=val2}")
		var data = { val1: "first value", val2: "second value" };
		
		document.write( tpl.process(data) );
		
		// Result
		// Value1: 11, Value2: second value
	@example
		// for in: loop statement (in the event of not using indexes)
		var tpl  = $Template("<h1>Portal Site</h1>\n<ul>{for site in portals}\n<li><a href='{=site.url}'>{=site.name}</a></li>{/for}\n</ul>");
		var data = { portals: [
			{ name: "Naver", url : "http://www.naver.com" },
			{ name: "Daum",  url : "http://www.daum.net" },
			{ name: "Yahoo",  url : "http://www.yahoo.co.kr" }
		]};
		
		document.write( tpl.process(data) );
		
		// Result
		//<h1>Portal Site</h1>
		//<ul>
		//<li><a href='http://www.naver.com'>Naver</a></li>
		//<li><a href='http://www.daum.net'>Daum</a></li>
		//<li><a href='http://www.yahoo.co.kr'>Yahoo</a></li>
		//</ul>
	@example
		// for: loop statement (in the event of using indexes)
		var tpl  = $Template("{for num:word in numbers}{=word}({=num}){/for}");
		var data = { numbers: ["zero", "one", "two", "three"] };
		
		document.write( tpl.process(data) );
		
		// Result
		// zero(0) one(1) two(2) three(3)
	@example
		// Micro-Templating 엔진을 사용하여 for 반복문을 사용하는 예제
		var str = '<h1>포탈 사이트</h1><ul><% for ( var i = 0; i < portals.length; i++ ) { %><li><a href="<%=portals[i].url%>"><%=portals[i].name%></a></li><% } %></ul>';
		var tpl = $Template(str, "micro");
		var data = { portals: [
			{ name: "네이버", url : "http://www.naver.com" },
			{ name: "다음",  url : "http://www.daum.net" },
			{ name: "야후",  url : "http://www.yahoo.co.kr" }
		]};
		
		document.write(tpl.process(data));
		
		// 결과
		//<h1>포탈 사이트</h1>
		//<ul>
		//<li><a href='http://www.naver.com'>네이버</a></li>
		//<li><a href='http://www.daum.net'>다음</a></li>
		//<li><a href='http://www.yahoo.co.kr'>야후</a></li>
		//</ul>
	@example
		// handlebars 엔진을 사용하여 for 반복문을 사용하는 예제
		var str = '<h1>포탈 사이트</h1><ul>{{#each portals}}<li><a href="{{url}}">{{name}}</a></li>{{/each}}</ul>';
		var tpl = $Template(str, "handlebars");
		var data = { portals: [
			{ name: "네이버", url : "http://www.naver.com" },
			{ name: "다음",  url : "http://www.daum.net" },
			{ name: "야후",  url : "http://www.yahoo.co.kr" }
		]};
		
		document.write(tpl.process(data));
		
		// 결과
		//<h1>포탈 사이트</h1>
		//<ul>
		//<li><a href='http://www.naver.com'>네이버</a></li>
		//<li><a href='http://www.daum.net'>다음</a></li>
		//<li><a href='http://www.yahoo.co.kr'>야후</a></li>
		//</ul>
	@example
		// simple 엔진을 사용하는 예제
		var str = '<h1>포탈 사이트</h1><ul><li><a href="{{url0}}">{{name0}}</a></li><li><a href="{{url1}}">{{name1}}</a></li><li><a href="{{url2}}">{{name2}}</a></li></ul>';
		var tpl = $Template(str, "simple");
		var data = {
			url0 : "http://www.naver.com",
			url1 : "http://www.daum.net",
			url2 : "http://www.yahoo.co.kr",
			name0 : "네이버",
			name1 : "다음",
			name2 : "야후"
		}
		
		document.write(tpl.process(data));
		
		// 결과
		//<h1>포탈 사이트</h1>
		//<ul>
		//<li><a href='http://www.naver.com'>네이버</a></li>
		//<li><a href='http://www.daum.net'>다음</a></li>
		//<li><a href='http://www.yahoo.co.kr'>야후</a></li>
		//</ul>
 */
jindo.$Template.prototype.process = function(data){
	//-@@$Template.process-@@//
	var oArgs = jindo._checkVarType(arguments, {
			'4obj' : ['data:Hash+'],
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
 	기존 $Template 에서 사용하던 컴파일 엔진을 등록한다.
 */
jindo.$Template.addEngine("default", function(str){
    str = str.replace(/\\{/g, "#LEFT_CURLY_BRACKET#").replace(/\\}/g, "#RIGHT_CURLY_BRACKET#");

	var code = [];
	var parsed = false;
	
	function stripString(s) {
		return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
	}
	
	code.push('var $RET$ = [];');

	code.push('var $SCOPE$ = $ARG$ && typeof $ARG$ === "object" ? $ARG$ : {};');
	code.push('with ($SCOPE$) {');
	
	var key_num = 0;
	
	do {
		parsed = false;

		str = str.replace(/^[^{]+/, function(_) {
			parsed = code.push('$RET$.push("' + stripString(_) + '");');
			return '';
		});

		str = str.replace(/^{=([^}]+)}/, function(_, varname) {
			parsed = code.push('typeof '+ varname +' != "undefined" && $RET$.push(' + varname + ');');
			return '';
		});

		str = str.replace(/^{js\s+([^}]+)}/, function(_, syntax) {
			syntax = syntax.replace(/(=(?:[a-zA-Z_][\w\.]*)+)/g, function(m) {
				return m.replace('=', '');
			});

			parsed = code.push('$RET$.push(' + syntax + ');');
			return '';
		});

		str = str.replace(/^{(g)?set\s+([^=]+)=([^}]+)}/, function(_, at_g, key, val) {
			parsed = code.push((at_g ? 'var ' : '$SCOPE$.') +key+ '=' + val.replace(/(\s|\(|\[)=/g, '$1') + ';');
			return '';
		});

		str = str.replace(/^{for\s+([^:}]+)(?:\s*)(:(.+))?\s+in\s+([^}]+)}/, function(_, key, _, val, obj) {
			
			if (!val) { val = key; key = '$NULL$' + key_num; }
			var key_str = '$I$' + key_num;
			var callback = '$CB$' + key_num;

			key_num++;

			code.push('(function(' + callback + ') {');

				code.push('if (jindo.$Jindo.isArray(' +obj+ ')) {');
					code.push('for (var ' +key_str+ ' = 0; ' +key_str+ ' < ' +obj+ '.length; ' +key_str+ '++) {');
						code.push(callback + '(' +key_str+ ', ' +obj+ '[' +key_str+ ']);');
					code.push('}');
				code.push('} else {');
					code.push('for (var ' +key_str+ ' in ' +obj+ ') if (' +obj+ '.hasOwnProperty(' +key_str+ ')) { ');
						code.push(callback + '(' +key_str+ ', ' +obj+ '[' +key_str+ ']);');
					code.push('}');
				code.push('}');

			code.push('})(function(' + key + ', ' + val + ') {');
			
			parsed = true;
			return '';
			
		});
		
		str = str.replace(/^{\/for}/, function(_) {
			parsed = code.push('});');
			return '';
		});
		
		str = str.replace(/^{(else)?if\s+([^}]+)}/, function(_, iselse, expr) {
			var variable = (expr.match(/(\w+)\.?/) || [,])[1], isFuncArg;

			variable && (isFuncArg = RegExp("function\\([$\\w]*,?[\\s]*"+ variable +"[^)]*\\)").test(code.join("")));
			variable = !variable || isFuncArg ? '' : '$SCOPE$.'+ variable +' && ';

			parsed = code.push((iselse ? '} else ' : '') + 'if ('+ variable + expr +' ) {');
			return '';
		});
		
		str = str.replace(/^{else}/, function(_) {
			parsed = code.push('} else {');
			return '';
		});
		
		str = str.replace(/^{\/if}/, function(_) {
			parsed = code.push('}');
			return '';
		});
		
	} while(parsed);
	
	code.push('}');
	code.push('return $RET$.join("");');

	var r = new Function('$ARG$', code.join('\n').replace(/\r/g,'').replace(/#LEFT_CURLY_BRACKET#/g, "{").replace(/#RIGHT_CURLY_BRACKET#/g, "}"));
	return r;
});
//-!jindo.$Template.addEngine.default end!-//

//-!jindo.$Template.addEngine.micro start(jindo.$Template)!-//
/**
 	John Resig의 Micro-Templating 컴파일 엔진을 등록한다. (참고 - http://ejohn.org/blog/javascript-micro-templating/)
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
 	handlebars 컴파일 엔진을 등록한다. (참고 - http://handlebarsjs.com/)
 */
jindo.$Template.addEngine("handlebars", function(sTemplate){
	if(typeof Handlebars == "undefined"){
		// The reason why '$Template#process' for second parameter, is because occur exception when process() method is called.
		throw new jindo.$Error(jindo.$Except.NOT_FOUND_HANDLEBARS, "$Template#process");
	}
	return Handlebars.compile(sTemplate);
});
//-!jindo.$Template.addEngine.handlebars end!-//

//-!jindo.$Template.addEngine.simple start(jindo.$Template)!-//
/**
 	단순 문자열 치환을 위한 컴파일 엔진을 등록한다.
 */
jindo.$Template.addEngine("simple", function(sTemplate){
	return function(oData){
		return sTemplate.replace(/\{\{([^{}]*)\}\}/g, function(sMatchA, sMatchB){
			return (typeof oData[sMatchB] == "undefined") ? "" : oData[sMatchB];
		});
	};
});
//-!jindo.$Template.addEngine.simple end!-//

/**
 	@fileOverview A file to define the constructor and method of the jindo.$Date() object
	@name date.js
	@author NAVER Ajax Platform
 */
//-!jindo.$Date start!-//
/**
 	The jindo.$Date() object provides an expanded function to wrap the Date object and process the date and time.
	
	@class jindo.$Date
	@keyword date
 */
/**
 	Creates a jindo.$Date() object. The jindo.$Date() object can be created without any parameters, or with the ISO Date format or an integer in millisecond as the parameters of the constructor. If the ISO Date format character has been entered, the date is calculated based on the $Date.utc attribute.
	
	@constructor
	@syntax
	@syntax sDate
	@syntax nDate
	@syntax oDate
	@param {String+} sDate Date String in date format
	@param {Number} nDate TimeStamp as integers in milliseconds
	@param {Date+} oDate Date or the jindo.$Date() object
	@syntax nYear, nMonth, nDate, nHour, nMinute, nSecond, nMiliSec
	@param {Numeric} nYear Year as integers (Number)
	@param {Numeric} nMonth nMonth Month as integers (Number)
	@param {Numeric} [nDate=1] nDate Day as integers (Number) 
	@param {Numeric} [nHour=1] nHour Hour as integers (Number) 
	@param {Numeric} [nMinute=1] nMinute Minute as integers (Number) 
	@param {Numeric} [nSecond=1] nSecond Second as integers (Number)
	@param {Numeric} [nMiliSec=1] nMiliSec Millisecond as integers (Number)
	@remark $Date can be used without date in version 1.4.6 and higher. It will be set to 1 if no value is provided.
	@see jindo.$Date.utc
	@see jindo.$Date#format
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date Date - MDN Docs
	@see http://ko.wikipedia.org/wiki/ISO_8601 ISO 8601 - W3C
	@example
		$Date();
		$Date(milliseconds);
		$Date(dateString);
		
		// It can be used in version 1.4.6 and higher
		$Date(2010,6);// This is the same as $Date (2010,6,1,1,1,1,1);.
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
			jindo.$Jindo._maxWarn(arguments.length, 7,"$Date");
			return init(cl,a);
		} catch(e) {
			if (e instanceof TypeError) { return null; }
			throw e;
		}
		
	}
	
	var oArgs = jindo._checkVarType(arguments, {
		'4voi'  : [ ],
		'4str'  : [ 'src:String+' ],
		'4num'  : [ 'src:Numeric'],
		'4dat' 	: [ 'src:Date+'],
		'4num2' : [ 'src:Numeric', 'src:Numeric'],
		'4num3' : [ 'src:Numeric', 'src:Numeric', 'src:Numeric'],
		'4num4' : [ 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric'],
		'4num5' : [ 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric'],
		'4num6' : [ 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric'],
		'4num7' : [ 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric']
	},"$Date");

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
					a[i] = i == 2 ? 1 : 0;
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
	return jindo._checkVarType(aPram, {
		's' : [ 'nParm:Numeric'],
		'g' : []
	},"$Date#"+sType);
};
/**
 	The names attribute stores the strings that is used to display the month, date, and AM/PM used in the jindo.$Date() object. Names with the prefix 's_' are abbreviations.
	
	@property names
	@type Object
	@static
	@remark  <h5>Month, Date, AM/PM representation string</h5>
		<table class="tbl_board">
			<caption class="hide">Month, Date, AM/PM representation string</caption>
			<thead>
				<tr>
					<th scope="col" style="width:20%">Category</th>
					<th scope="col">String</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">month</td>
					<td class="txt">January, Febrary, March, April, May, June, July, August, September, October, Novermber, December</td>
				</tr>
				<tr>
					<td class="txt bold">s_month</td>
					<td class="txt">Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec</td>
				</tr>
				<tr>
					<td class="txt bold">day</td>
					<td class="txt">Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday</td>
				</tr>
				<tr>
					<td class="txt bold">s_day</td>
					<td class="txt">Sun, Mon, Tue, Wed, Thu, Fri, Sat</td>
				</tr>
				<tr>
					<td class="txt bold">ampm</td>
					<td class="txt">AM, PM</td>
				</tr>
			</tbody>
		</table>
 */
jindo.$Date.names = {
	month   : ["January","Febrary","March","April","May","June","July","August","September","October","Novermber","December"],
	s_month : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
	day     : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
	s_day   : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
	ampm    : ["AM", "PM"]
};

/**
 	The utc attribute stores the coordinated universal time and the time difference. The default value is based on client's locale time.
	
	@property utc
	@type Number
	@static
	@see http://ko.wikipedia.org/wiki/UTC Coordinated Universal Time
	@example
		$Date.utc = -10; // It is calculated based on Hawaiian standard.
 */
jindo.$Date.utc = (new Date().getTimezoneOffset() / 60) * -1;
//-!jindo.$Date end!-//

//-!jindo.$Date.now start!-//
/**
 	The now() method returns the current time as an integer in milliseconds.
	
	@method now
	@static
	@return {Numeric} The current time as an integer in milliseconds
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/now Date.now() - MDN Docs
	@example
		$Date().now(); //sample : 1304907432081
 */
jindo.$Date.now = function() {
	//-@@$Date.now-@@//
  if(Date.now){
	/**
	 * @ignore
	 */
  	this.now = function() {
		return Date.now();
	};
  }else{
	/**
	 * @ignore
	 */
  	this.now = function() {
		return +new Date();
	};
  }
  return this.now();
};
//-!jindo.$Date.now end!-//

//-!jindo.$Date.prototype.name start!-//
/**
 	name() method return date names values defined in names property.
	
	@method name
	@param {String+} vName Name of the names attribute (String)
	@return {Variant} Returns the value of the names attribute.
	@since 1.4.1
	@see jindo.$Date.names
	@example
	    $Date().name("ampm | day | month | s_day | s_month");
 */
/**
 	name() 메서드는 names 속성에 정의된 달, 요일, 오전/오후를 표시하는 문자열의 값을 설정한다.
	
	@method name
	@syntax vName, aValue
	@syntax oNames
	@param {String+} vName The name of the names attribute (String)
	@param {Array+} aValue A value to be set in the names attribute
	@param {Hash+} oNames An object or the jindo.$H() object that has one or more names attributes and values
	@return {this} 값을 반영한 인스턴스 자신
	@since 1.4.1
	@see jindo.$Date.names
 */
jindo.$Date.prototype.name = function(vName,aValue){
	//-@@$Date.name-@@//
	var oArgs = jindo._checkVarType(arguments, {
		's4str' : [ 'sKey:String+', 'aValue:Array+' ],
		's4obj' : [ 'oObject:Hash+' ],
		'g' : [ 'sKey:String+' ]
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
 	The parse() method parses the specified character string in a parameter and creates a jindo.$Date() object.
	
	@method parse
	@static
	@param {String+} sDate A string in date or time format
	@return {Object} The Date object
	@throws {jindo.$Except.INVALID_DATE} The exception occurs when date format is inappropriate.
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date Date - MDN Docs
 */
jindo.$Date.parse = function(strDate) {
	//-@@$Date.parse-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4str' : [ 'sKey:String+']
	},"$Date#parse");
	
	var date = new Date(Date.parse(strDate));
	if(isNaN(date)||date == "Invalid Date"){
		throw new jindo.$Error(jindo.$Except.INVALID_DATE, "$Date#parse");
	}
	return date;
};
//-!jindo.$Date.prototype.parse end!-//

//-!jindo.$Date.prototype.$value start!-//
/**
 	The $value() method returns the original Date object, which was enclosed by the $Date() object.
	
	@method $value
	@return {Object} The original Date object
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date Date - MDN Docs
 */
jindo.$Date.prototype.$value = function(){
	//-@@$Date.$value-@@//
	return this._date;
};
//-!jindo.$Date.prototype.$value end!-//

//-!jindo.$Date.prototype.format start(jindo.$Date.prototype.name,jindo.$Date.prototype.isLeapYear,jindo.$Date.prototype.time)!-//
/**
 	The format() method converts the time stored in the jindo.$Date() object according to the format specifier that specifies the time stored in the object as a parameter.
	
	@method format
	@param {String+} sFormat  Format Specifier
	@return {String} A character string that has been converted according to the format specifier
	@remark The supported format string is the same as the date() function of PHP.<br>
		<h5>Date</h5>
		<table class="tbl_board">
			<caption class="hide">Date</caption>
			<thead>
				<tr>
					<th scope="col" style="width:20%">Characters</th>
					<th scope="col" style="width:40%">Description</th>
					<th scope="col">Note</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">d</td>
					<td class="txt">Two-digit date</td>
					<td class="txt">01 ~ 31</td>
				</tr>
				<tr>
					<td class="txt bold">j</td>
					<td class="txt">0-excluded date</td>
					<td class="txt">1 ~ 31</td>
				</tr>
				<tr>
					<td class="txt bold">l (lowercase L)</td>
					<td class="txt">Full date</td>
					<td class="txt">Date specified in $Date.names.day</td>
				</tr>
				<tr>
					<td class="txt bold">D</td>
					<td class="txt">Summarized date</td>
					<td class="txt">Date specified in $Date.names.s_day</td>
				</tr>
				<tr>
					<td class="txt bold">w</td>
					<td class="txt">The nth day of the week</td>
					<td class="txt">0 (Sunday) ~ 6 (Saturday)</td>
				</tr>
				<tr>
					<td class="txt bold">N</td>
					<td class="txt">The nth day of the ISO-8601 week</td>
					<td class="txt">1 (Monday) ~ 7 (Sunday)</td>
				</tr>
				<tr>
					<td class="txt bold">S</td>
					<td class="txt">Ordinal types of two characters</td>
					<td class="txt">st, nd, rd, th</td>
				</tr>
				<tr>
					<td class="txt bold">z</td>
					<td class="txt">The nth day of the year (from 0)</td>
					<td class="txt">0 ~ 365</td>
				</tr>
			</tbody>
		</table>
		<h5>Month</h5>
		<table class="tbl_board">
			<caption class="hide">Month</caption>
			<thead>
				<tr>
					<th scope="col" style="width:20%">Characters</th>
					<th scope="col" style="width:40%">Description</th>
					<th scope="col">Note</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">m</td>
					<td class="txt">Two-digit month format</td>
					<td class="txt">01 ~ 12</td>
				</tr>
				<tr>
					<td class="txt bold">n</td>
					<td class="txt">Month in which the leading zero is removed</td>
					<td class="txt">1 ~ 12</td>
				</tr>
				<tr>
					<td class="txt bold">F</td>
					<td class="txt">The full name of the month.</td>
					<td class="txt">January ~ December</td>
				</tr>
				<tr>
					<td class="txt bold">M</td>
					<td class="txt">The abbreviated name of the month.</td>
					<td class="txt">Jan ~ Dec</td>
				</tr>
			</tbody>
		</table>
		<h5>Year</h5>
		<table class="tbl_board">
			<caption class="hide">Year</caption>
			<thead>
				<tr>
					<th scope="col" style="width:20%">Characters</th>
					<th scope="col" style="width:40%">Description</th>
					<th scope="col">Note</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">L</td>
					<td class="txt">Leap year</td>
					<td class="txt">true, false</td>
				</tr>
				<tr>
					<td class="txt bold">o</td>
					<td class="txt">Four-digit year format</td>
					<td class="txt">2010</td>
				</tr>
				<tr>
					<td class="txt bold">Y</td>
					<td class="txt">Same as o</td>
					<td class="txt">2010</td>
				</tr>
				<tr>
					<td class="txt bold">y</td>
					<td class="txt">Two-digit year format</td>
					<td class="txt">10</td>
				</tr>
			</tbody>
		</table>
		<h5>Minute</h5>
		<table class="tbl_board">
			<caption class="hide">Minute</caption>
			<thead>
				<tr>
					<th scope="col" style="width:20%">Characters</th>
					<th scope="col" style="width:40%">Description</th>
					<th scope="col">Note</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">a</td>
					<td class="txt">Lowercase am/pm</td>
					<td class="txt">am,pm</td>
				</tr>
				<tr>
					<td class="txt bold">A</td>
					<td class="txt">Uppercase AM/PM</td>
					<td class="txt">AM,PM</td>
				</tr>
				<tr>
					<td class="txt bold">g</td>
					<td class="txt">(12-hour clock) 0-excluded two-digit hour format</td>
					<td class="txt">1~12</td>
				</tr>
				<tr>
					<td class="txt bold">G</td>
					<td class="txt">(24-hour clock) 0-excluded two-digit hour format</td>
					<td class="txt">0~24</td>
				</tr>
				<tr>
					<td class="txt bold">h</td>
					<td class="txt">(12-hour clock) 0-included two-digit hour format</td>
					<td class="txt">01~12</td>
				</tr>
				<tr>
					<td class="txt bold">H</td>
					<td class="txt">(24-hour clock) 0-included two-digit hour format</td>
					<td class="txt">00~24</td>
				</tr>
				<tr>
					<td class="txt bold">i</td>
					<td class="txt">0-included two-digit minute format</td>
					<td class="txt">00~59</td>
				</tr>
				<tr>
					<td class="txt bold">s</td>
					<td class="txt">0-included two-digit second format</td>
					<td class="txt">00~59</td>
				</tr>
				<tr>
					<td class="txt bold">u</td>
					<td class="txt">microseconds</td>
					<td class="txt">654321</td>
				</tr>
			</tbody>
		</table>
		<h5>Note</h5>
		<table class="tbl_board">
			<caption class="hide">Note</caption>
			<thead>
				<tr>
					<th scope="col" style="width:20%">Characters</th>
					<th scope="col" style="width:40%">Description</th>
					<th scope="col">Note</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="txt bold">U</td>
					<td class="txt">Unix Time(1970 00:00:00 GMT) </td>
					<td class="txt"></td>
				</tr>
			</tbody>
		</table>
	@see http://kr2.php.net/manual/en/function.date.php date() - php.net
	@example
		var oDate = $Date("Jun 17 2009 12:02:54");
		oDate.format("Y.m.d(D) A H:i"); => "2009.06.17(Wed) PM 12:02"
 */
jindo.$Date.prototype.format = function(strFormat){
	//-@@$Date.format-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4str' : [ 'sFormat:String+']
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
            case"F":
            case"M":
                o[m] = name[ m == "F"? "month" : "s_month" ][d.getMonth()];
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
 	time() 메서드는 jindo.$Date() 객체가 가지고 있는 GMT(1970/01/01 00:00:00)를 기준으로 현재 시간까지 경과한 시간 값을 가져온다.
	
	@method time
	@return {Number} Returns the timeStamp value of the jindo.$Date() object in milliseconds.
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getTime Date.getTime() - MDN
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setTime Date.setTime() - MDN
	@see http://ko.wikipedia.org/wiki/GMT GMT
	@example
		var oDate = new $Date(Date.now());
		oDate.time(); // sample : 1304908070435
 */
/**
 	time() 메서드는 GMT(1970/01/01 00:00:00)를 기준으로 경과한 시간을 jindo.$Date() 객체에 설정한다.
	
	@method time
	@param {Numeric} nTimeStamp Integers in milliseconds
	@return {this} GMT를 기준으로 파라미터에 지정한 시간만큼 경과한 시간을 설정한 인스턴스 자신
	@throws {jindo.$Except.INVALID_DATE} The exception occurs when it is not a parameter or number.
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getTime Date.getTime() - MDN
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setTime Date.setTime() - MDN
	@see http://ko.wikipedia.org/wiki/GMT GMT
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
 	year() 메서드는 jindo.$Date() 객체가 저장하고 있는 시각의 연도(year)를 가져온다.
	
	@method year
	@return {Number} Returns the year of the jindo.$Date() object. The year format is a four-digit integer.
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getFullYear Date.getFullYear() - MDN
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setFullYear Date.setFullYear() - MDN
	@example
		var oDate = new $Date(Date.now());
		oDate.year(); // sample : 2011
 */
/**
 	year() 메서드는 jindo.$Date() 객체의 연도(year)를 지정한 값으로 설정한다.
	
	@method year
	@param {Numeric} nYear The year to be set in the jindo.$Date() object. The year format is a four-digit integer.
	@return {this} 연도를 새로 설정한 인스턴스 자신
	@throws {jindo.$Except.INVALID_DATE} The exception occurs when it is not a parameter or number.
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getFullYear Date.getFullYear() - MDN
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setFullYear Date.setFullYear() - MDN
	@example
		var oDate = new $Date(Date.now());
		oDate.year(1984);
		oDate.year(); // 1984
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
 	month() 메서드는 jindo.$Date() 객체가 저장하고 있는 시각의 달(month)을 가져온다.
	
	@method month
	@return {Number} Returns the month of the jindo.$Date() object. The range of month value is an integer from 0 (Jan.) to 11 (Dec.).
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getMonth Date.getMonth() - MDN
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setMonth Date.setMonth() - MDN
	@example
		var oDate = new $Date(Date.now());
		oDate.month(); // sample : 4 (May)
 */
/**
 	month() 메서드는 jindo.$Date() 객체의 달(month)을 지정한 값으로 설정한다.
	
	@method month
	@param {Numeric} nMon The month to be set in the jindo.$Date() object. The range of month value is an integer from 0 (Jan.) to 11 (Dec.).
	@return {this} 달을 새로 설정한 인스턴스 자신
	@throws {jindo.$Except.INVALID_DATE} The exception occurs when it is not a parameter or number.
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getMonth Date.getMonth() - MDN
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setMonth Date.setMonth() - MDN
	@example
		var oDate = new $Date(Date.now());
		oDate.month(1);
		oDate.month(); // 3 (April)
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
 	date() 메서드는 jindo.$Date() 객체가 저장하고 있는 시각의 날짜(day of the month)를 가져온다.
	
	@method date
	@return {Number} Returns the day of the jindo.$Date() object. The range of day of the month value is an integer from 1 to 31.
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getDate Date.getDate() - MDN
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setDate Date.setDate() - MDN
	@example
		var oDate = new $Date(Date.now());
		oDate.date(); // sample : 9 (9th day)
 */
/**
 	date() 메서드는 jindo.$Date() 객체의 날짜(day of the month)를 지정한 값으로 설정한다.
	
	@method date
	@param {Numeric} nDate The day of the month to be set in the jindo.$Date() object. The range of day of the month value is an integer from 1 to 31.
	@return {this} 날짜를 새로 설정한 인스턴스 자신
	@throws {jindo.$Except.INVALID_DATE} The exception occurs when it is not a parameter or number.
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getDate Date.getDate() - MDN
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setDate Date.setDate() - MDN
	@example
		var oDate = new $Date(Date.now());
		oDate.date(15);
		oDate.date(); // 15 (15th day)
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
 	The day() method retrieves the day of the week specified in the jindo.$Date() object.
	
	@method day
	@return {Number} Returns the day of the week (0~6) of the jindo.$Date() object. The range of the day of the week is an integer from 0 (Sunday) to 6 (Saturday).
	@throws {jindo.$Except.INVALID_DATE} The exception occurs when it is not a parameter or number.
	@see jindo.$Date#Date
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getDay Date.getDay() - MDN
	@example
		var oDate = new $Date(Date.now());
		oDate.date(); // sample : 9 (9th day)
		oDate.day(); // sample : 1 (Monday)
		oDate.date(10);
		oDate.day(); // 2 (Tuesday) 
 */
jindo.$Date.prototype.day = function() {
	//-@@$Date.day-@@//
	return this._date.getDay();
};
//-!jindo.$Date.prototype.day end!-//

//-!jindo.$Date.prototype.hours start!-//
/**
 	The hours() method retrieves the hour stored in the jindo.$Date() object or sets it to the specified value. When a parameter is entered, it sets the hour specified in the jindo.$Date() object. If it is omitted, returns the hour stored in the jindo.$Date() object.
	
	@method hours
	@return {Number} Returns the time of the jindo.$Date() object. The range of hour value is an integer from 0 to 23.
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getHours Date.getHours() - MDN
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setHours Date.setHours() - MDN
	@example
		var oDate = new $Date(Date.now());
		oDate.hours(); // sample : 11 (11 o'clock)
 */
/**
 	hours() 메서드는 jindo.$Date() 객체의 시간(hour)을 지정한 값으로 설정한다.
	
	@method hours
	@param {Numeric} nHour  The hour to be set in the jindo.$Date() object. The range of hour value is an integer from 0 to 23.
	@return {this} 시간을 새로 설정한 인스턴스 자신
	@throws {jindo.$Except.INVALID_DATE} The exception occurs when it is not a parameter or number.
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getHours Date.getHours() - MDN
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setHours Date.setHours() - MDN
	@example
		var oDate = new $Date(Date.now());
		oDate.hours(19);
		oDate.hours(); // 19 (19 o'clock)
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
 	minutes() 메서드는 jindo.$Date() 객체가 저장하고 있는 시각의 분(minute)을 가져온다.
	
	@method minutes
	@return {Number} Returns the minute of the jindo.$Date() object. The range of minute value is an integer from 0 to 59.
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getMinutes Date.getMinutes() - MDN
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setMinutes Date.setMinutes() - MDN
	@example
		var oDate = new $Date(Date.now());
		oDate.minutes(); // sample : 53 (53 minutes)
 */
/**
 	minutes() 메서드는 jindo.$Date() 객체의 분(minute)을 지정한 값으로 설정한다. 
	
	@method minutes
	@param {Numeric} nMin The minute to be set in the jindo.$Date() object. The range of minute value is an integer from 0 to 59.
	@return {this} 분을 새로 설정한 인스턴스 자신
	@throws {jindo.$Except.INVALID_DATE} The exception occurs when it is not a parameter or number.
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getMinutes Date.getMinutes() - MDN
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setMinutes Date.setMinutes() - MDN
	@example
		var oDate = new $Date(Date.now());
		oDate.minutes(0);
		oDate.minutes(); // 0 (0 minutes)
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
 	seconds() 메서드는 jindo.$Date() 객체가 저장하고 있는 시각의 초(second)를 가져온다.
	
	@method seconds
	@return {Number} Returns the second of the jindo.$Date() object. The range of second value is an integer from 0 to 59.
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getSeconds Date.getSeconds() - MDN
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setSeconds Date.setSeconds() - MDN
	@example 
		var oDate = new $Date(Date.now());
		oDate.seconds(); // sample : 23 (23 seconds)
 */
/**
 	seconds() 메서드는 jindo.$Date() 객체의 초(second)를 지정한 값으로 설정한다.
	
	@method seconds
	@param {Numeric} nSec The second to be set in the jindo.$Date() object. The range of second value is an integer from 0 to 59.
	@return {this} 초를 새로 설정한 인스턴스 자신
	@throws {jindo.$Except.INVALID_DATE} The exception occurs when it is not a parameter or number. 
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getSeconds Date.getSeconds() - MDN
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setSeconds Date.setSeconds() - MDN
	@example 
		var oDate = new $Date(Date.now());
		oDate.seconds(0);
		oDate.seconds(); // 0 (0 seconds)
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
 	The isLeapYear() method checks whether the year of the time stored in the jindo.$Date() object is a leap year.
	
	@method isLeapYear
	@return {Boolean} If the year stored in the $Date() is a leap year, returns true, otherwise, returns false.
	@see http://en.wikipedia.org/wiki/Leap_year - Wikipedia
	@example
		var oDate = new $Date(Date.now());
		
		oDate.year(); // 2011
		oDate.isLeapYear(); // false
		
		oDate.year(1984);
		oDate.isLeapYear(); // true
		
		oDate.year(1900);
		oDate.isLeapYear(); // false
		
		oDate.year(2000);
		oDate.isLeapYear(); // true
 */
jindo.$Date.prototype.isLeapYear = function() {
	//-@@$Date.isLeapYear-@@//
	var y = this._date.getFullYear();

	return !(y%4)&&!!(y%100)||!(y%400);
};
//-!jindo.$Date.prototype.isLeapYear end!-//

//-!jindo.$Date.prototype.compare start!-//
/**
 	The compare() method calculates the difference the given parameter value from current time value and returns the number value.
	
	@method compare
	@param {Date+} oDate The date to be compared
	@param {String+} [sOption=천 분의 1초까지 비교] Specifies the unit to be used when comparing the time.
		@param {String+} sOption."y" year
		@param {String+} sOption."m" month
		@param {String+} sOption."d" day
		@param {String+} sOption."h" hour
		@param {String+} sOption."i" minute
		@param {String+} sOption."s" second
	@return {Number} Returns the difference as a number in comparison unit.
	@since 2.0.0
	@example
		var oDate = new $Date(new Date());
		oDate.compare(oDate);-> 0//same
		var oCurrentDate = new Date();
		oDate.compare(oCurrnetDate); -> 3 // 3ms later
		$Date(oCurrnetDate).compare(oDate); -> -3 // 3ms before
		oDate.compare(oCurrnetDate,"h"); -> 0 //0 because time is the same
 */
jindo.$Date.prototype.compare = function(oDate, sType) {
	//-@@$Date.compare-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4dat' : [ 'oDate:Date+'],
		'4str' : [ 'oDate:Date+','sType:String+']
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
 	@fileOverview A file to define the constructor and methods of the jindo.$Window() object
	@name window.js
	@author NAVER Ajax Platform
 */
//-!jindo.$Window start!-//
/**
 	The $Window() object wraps a window object provided by a browser and provides various methods to handle it.
	
	@class jindo.$Window
	@keyword window
	@filter desktop
 */
/**
 	Creates the $Window() object.
	
	@constructor
	@param {Hash+} oWindow The window object wrapped by the $Window() object
 */
jindo.$Window = function(el) {
	//-@@$Window-@@//
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	
	if (!(this instanceof cl)){
		try {
			jindo.$Jindo._maxWarn(arguments.length, 1,"$Window");
			return new cl(el||window);
		} catch(e) {
			if (e instanceof TypeError) { return null; }
			throw e;
		}
	}	
	
	var oArgs = jindo._checkVarType(arguments, {
		'4win' : ['el:Window+']
	},"$Window");
	
	this._win = el;
};
//-!jindo.$Window end!-//

//-!jindo.$Window.prototype.$value start!-//
/**
 	The $value() method returns the original window object.
	
	@method $value
	@return {jindo.$Window} The window object
	@example
		$Window().$value(); // Returns the original window object.
 */
jindo.$Window.prototype.$value = function() {
	//-@@$Window.$value-@@//
	return this._win;
};
//-!jindo.$Window.prototype.$value end!-//

//-!jindo.$Window.prototype.resizeTo start!-//
/**
 	The resizeTo() method resizes the size of a window as much as the size specified. The specified size means full size window including frame. Therefore, actual size of content to be shown could be different depending on browsers and settings. The security settings of some browsers may prevent the window from being resized beyond the current resolution of the screen. In this case, the window size can be smaller than the value specified (unit: pixels).
	
	@method resizeTo
	@param {Numeric} nWidth Width of a window
	@param {Numeric} nHeight Height of a window.
	@return {this} 창의 크기를 변경한 인스턴스 자신
	@see jindo.$Window#resizeBy
	@example
		// Resizes the current width to 400 and height to 300.
		$Window.resizeTo(400, 300);
 */
jindo.$Window.prototype.resizeTo = function(nWidth, nHeight) {
	//-@@$Window.resizeTo-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4num' : ['nWidth:Numeric','nHeight:Numeric']
	},"$Window#resizeTo");
	this._win.resizeTo(nWidth, nHeight);
	return this;
};
//-!jindo.$Window.prototype.resizeTo end!-//

//-!jindo.$Window.prototype.resizeBy start!-//
/**
 	The resizeBy() method resizes the size of a window as specified. To increase window size, enter a positive integer; to decrease, enter a negative integer (unit: pixels).
	
	@method resizeBy
	@param {Numeric} nWidth The width of a window to increase or decrease
	@param {Numeric} nHeight The height of a window to increase or decrease
	@return {this} 창의 크기를 변경한 인스턴스 자신
	@see jindo.$Window#resizeTo
	@example
		// Increases the width as much as 100 and height as much as 50.
		$Window().resizeBy(100, 50);
 */
jindo.$Window.prototype.resizeBy = function(nWidth, nHeight) {
	//-@@$Window.resizeBy-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4num' : ['nWidth:Numeric','nHeight:Numeric']
	},"$Window#resizeBy");
	this._win.resizeBy(nWidth, nHeight);
	return this;
};
//-!jindo.$Window.prototype.resizeBy end!-//

//-!jindo.$Window.prototype.moveTo start!-//
/**
 	The moveTo() method moves a window to a specified position. Coordinates are based on the upper-left corner of a window including frame (unit: pixels).
	
	@method moveTo
	@param {Numeric} nLeft The x coordinate of a window to move 
	@param {Numeric} nTop The y coordinate of a window to move 
	@return {this} 창의 위치를 변경한 인스턴스 자신
	@see jindo.$Window#moveBy
	@example
		// Moves the current window to (15, 10).
		$Window().moveTo(15, 10);
 */
jindo.$Window.prototype.moveTo = function(nLeft, nTop) {
	//-@@$Window.moveTo-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4num' : ['nLeft:Numeric','nTop:Numeric']
	},"$Window#moveTo");
	this._win.moveTo(nLeft, nTop);
	return this;
};
//-!jindo.$Window.prototype.moveTo end!-//

//-!jindo.$Window.prototype.moveBy start!-//
/**
 	The moveBy() method moves a window by a specified number of pixels in a certain direction (unit: pixels).
	
	@method moveBy
	@param {Numeric} nLeft The number of pixels of a window to move horizontally. The window moves to right with a positive integer and left with a negative integer.
	@param {Numeric} nTop The number of pixels of a window to move vertically. The window moves to down with a positive integer and up with a negative integer.
	@return {this} 창의 위치를 변경한 인스턴스 자신
	@see jindo.$Window#moveTo
	@example
		// Moves the current window to left by 15 pixels and down by 10 pixels.
		$Window().moveBy(15, 10);
 */
 jindo.$Window.prototype.moveBy = function(nLeft, nTop) {
 	//-@@$Window.moveBy-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4num' : ['nLeft:Numeric','nTop:Numeric']
	},"$Window#moveBy");
	this._win.moveBy(nLeft, nTop);
	return this;
};
//-!jindo.$Window.prototype.moveBy end!-//

//-!jindo.$Window.prototype.sizeToContent start!-//
/**
 	The sizeToContent() method resizes the size of a window to fit the content size in a document.
	
	@method sizeToContent
	@param {Numeric} nWidth Width of a window
	@param {Numeric} nHeight Height of a window
	@return {this} 창의 크기를 변경한 인스턴스 자신
	@see jindo.$Document#renderingMode
	@remark There are several restrictions.<br>
		<ul class="disc">
			<li>This method must be executed after the document is completely loaded.
			<li>The size of a window must be smaller than that of a document; otherwise, the size of a document cannot be measured.</li>
			<li>The body size must be specified.</li>
			<li>This method does not work as intended in Opera version 10 for the Mackintosh environment and Internet Explorer version 6 and higher, Opera version 10, and Safari version 4 for Windows when the DOCTYPE of an HTML is Quirks.</li>
			<li>It should be executed in the parent window if possible. If a part of the child window is hidden because display is out of range, it is regarded as content not being exist in Internet Explorer. For this reason, the area decreases as much as the size of the hidden content.</li>
		</ul><br>
		You can fix the issues described above by specify parameters yourself.
	@example
		// A function to open a new window and automatically resize the size of the window to fit its content.
		function winopen(url) {
			try {
				win = window.open(url, "", "toolbar=0,location=0,status=0,menubar=0,scrollbars=0,resizable=0,width=250,height=300");
				win.moveTo(200, 100);
				win.focus();
			} catch(e){}
		
			setTimeout(function() {
				$Window(win).sizeToContent();
			}, 1000);
		}
		winopen('/samples/popup.html');
 */	
jindo.$Window.prototype.sizeToContent = function(nWidth, nHeight) {
	//-@@$Window.sizeToContent-@@//
	var oArgs = jindo._checkVarType(arguments, {
		'4num' : ['nWidth:Numeric','nHeight:Numeric'],
		'4voi' : []
	},"$Window#sizeToContent");
	if (this._win.sizeToContent) {
		this._win.sizeToContent();
	} else {
		if(arguments.length != 2){
			// use trick by Peter-Paul Koch
			// http://www.quirksmode.org/
			var innerX,innerY;
			var self = this._win;
			var doc = this._win.document;
			if (self.innerHeight) {
				// all except Explorer
				innerX = self.innerWidth;
				innerY = self.innerHeight;
			} else if (doc.documentElement && doc.documentElement.clientHeight) {
				// Explorer 6 Strict Mode
				innerX = doc.documentElement.clientWidth;
				innerY = doc.documentElement.clientHeight;
			} else if (doc.body) {
				// other Explorers
				innerX = doc.body.clientWidth;
				innerY = doc.body.clientHeight;
			}

			var pageX,pageY;
			var test1 = doc.body.scrollHeight;
			var test2 = doc.body.offsetHeight;

			if (test1 > test2) {
				// all but Explorer Mac
				pageX = doc.body.scrollWidth;
				pageY = doc.body.scrollHeight;
			} else {
				// Explorer Mac;
				//would also work in Explorer 6 Strict, Mozilla and Safari
				pageX = doc.body.offsetWidth;
				pageY = doc.body.offsetHeight;
			}
			nWidth  = pageX - innerX;
			nHeight = pageY - innerY;
		}
		this._win.resizeBy(nWidth, nHeight);
	}

	return this;
};
//-!jindo.$Window.prototype.sizeToContent end!-//


!function() {
    // Add jindo._p_.addExtension method to each class.
    var aClass = [ "$Agent","$Ajax","$A","$Cookie","$Date","$Document","$Element","$ElementList","$Event","$Form","$Fn","$H","$Json","$S","$Template","$Window" ],
        sClass, oClass;

    for(var i=0, l=aClass.length; i<l; i++) {
        sClass = aClass[i];
        oClass = jindo[sClass];

        if(oClass) {
            oClass.addExtension = (function(sClass) {
                return function(sMethod,fpFunc){
                    jindo._p_.addExtension(sClass,sMethod,fpFunc);
                    return this;
                };
            })(sClass);
        }
    }

    // Add hook method to $Element and $Event
    var hooks = ["$Element","$Event"];

    for(var i=0, l=hooks.length; i<l; i++) {
        var _className = hooks[i];
        if(jindo[_className]) {
            jindo[_className].hook = (function(className) {
                var __hook = {};
                return function(sName, vRevisionKey) {

                    var oArgs = jindo.$Jindo.checkVarType(arguments, {
                        'g'  : ["sName:String+"],
                        's4var' : ["sName:String+", "vRevisionKey:Variant"],
                        's4obj' : ["oObj:Hash+"]
                    },"jindo."+className+".hook");

                    switch(oArgs+"") {
                        case "g":
                            return __hook[oArgs.sName.toLowerCase()];
                        case "s4var":
                            if(vRevisionKey == null){
                                delete __hook[oArgs.sName.toLowerCase()];
                            } else {
                                __hook[oArgs.sName.toLowerCase()] = vRevisionKey;
                            }

                            return this;
                        case "s4obj":
                            var oObj = oArgs.oObj;
                            for(var i in oObj) {
                                __hook[i.toLowerCase()] = oObj[i];
                            }

                            return this;
                    }
                };
            })(_className);
        }
    }

    //-!jindo.$Element.unload.hidden start!-//
    if(!jindo.$Jindo.isUndefined(window)&& !(jindo._p_._j_ag.indexOf("IEMobile") == -1 && jindo._p_._j_ag.indexOf("Mobile") > -1 && jindo._p_._JINDO_IS_SP)) {
        (new jindo.$Element(window)).attach("unload",function(e) {
            jindo.$Element.eventManager.cleanUpAll();
        });
    }
    //-!jindo.$Element.unload.hidden end!-//

    // Register as a named AMD module
    if(typeof define === "function" && define.amd) {
        define("jindo", [], function() { return jindo; });
    }
}();