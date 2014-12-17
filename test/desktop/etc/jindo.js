/**
 * Jindo2 Framework
 * @version 1.4.6
 */
/**
 * @fileOverview	$와 $Class를 정의한 파일
 */

// Core object start
if (typeof window != "undefined" && typeof window.nhn == "undefined") {
	window.nhn = {};
}

if (typeof window != "undefined") {
	if (typeof window.jindo == "undefined") {
		window.jindo = {};
	}
} else {
	if (!jindo) {
		jindo = {};
	}
}
// Core object end

/**
 * $Jindo 객체를 반환한다. $Jindo 객체는 프레임웍에 대한 정보와 유틸리티 함수를 제공한다.
 * @constructor
 * @class $Jindo 객체는 프레임웍에 대한 정보와 유틸리티 함수를 제공한다.
 * @description [Lite]
 */
jindo.$Jindo = function() {
	var cl=arguments.callee;
	var cc=cl._cached;
	
	if (cc) return cc;
	if (!(this instanceof cl)) return new cl();
	if (!cc) cl._cached = this;
	
	// information
	this.version = "$$version$$";
}

/** 
 * @function
 * $ 함수는 다음의 두 가지 역할을 한다. 
 * <ul><li/>ID를 사용하여 DOM 엘리먼트를 가져온다. 인수를 두 개 이상 지정하면 각각의 DOM 엘리먼트를 배열로 리턴한다. 
 * <li>또한 "<tagName>" 과 같은 형식의 문자열을 입력하면 tagName을 가지는 객체를 생성한다.</li></ul>
 * @param {String...} sID 찾을 DOM 엘리먼트의 ID. ID는 하나 이상 지정할 수 있다. (1.4.6부터는 마지막 파라메터에 document을 지정할수 있다.)
 * @return {Element|Array} DOM 엘리먼트를 리턴한다. 만약 ID에 해당하는 DOM 엘리먼트가 없다면 null을 리턴한다.
 * @description [Lite]
 * @example
// ID를 이용하여 객체 반환
var div1 = $("div1");

// 여러개의 객체를 반환
var divs = $("div1","div2"); // [$("div1"),$("div2")] 와 같은 결과를 반환

// 객체 생성
var div = $("<DIV>");
var div = $("<DIV id='div1'><SPAN>hello</SPAN></DIV>");

//엘리먼트 생성시 document지정 가능.(1.4.6 부터 지원.)
var div = $("<div>" , iframe.contentWindow.document);
//위와 같을 경우 div테그가 iframe.contentWindow.document기준으로 생김.
 */
jindo.$ = function(sID/*, id1, id2*/) {
	var ret = [];
	var arg = arguments;
	var lastArgument = arg[arg.length-1];
	var doc = document;
	var el  = null;
	var reg = /^<([a-z]+|h[1-5])>$/i;
	var reg2 = /^<([a-z]+|h[1-5])(\s+[^>]+)?>/i;
	if (arg.length > 1 && typeof lastArgument != "string" && lastArgument.body) { //마지막 인자가 document일때.
		arg = Array.prototype.slice.apply(arg,[0,arg.length-1]);
		doc = lastArgument;
	}
	
	for(var i=0; i < arg.length; i++) {
		el = arg[i];
		if (typeof el == "string") {
			el = el.replace(/^\s+|\s+$/g, "");
			if (reg.test(el)) {
				el = doc.createElement(RegExp.$1);
			} else if (reg2.test(el)) {
				var p = { thead:'table', tbody:'table', tr:'tbody', td:'tr', dt:'dl', dd:'dl', li:'ul', legend:'fieldset' };
				var tag = RegExp.$1.toLowerCase();
				
				var parents = [];

 				for (var j = 0; tag = p[tag]; j++) {
 				
 					var o = doc.createElement(tag);
 					if (j) o.appendChild(parents[j - 1]);
 					
 					parents.push(o);
 					
 				}
 				
 				if (!parents[0]) parents[0] = doc.createElement('div');
 				
 				var first = parents[0];
				jindo.$Element(first).html(el);
				for (el = first.firstChild; el; el = el.nextSibling){
					if (el.nodeType == 1) ret[ret.length] = el;		
				}
								
				
			} else {
				el = doc.getElementById(el);
			}
		}
		if (el) ret[ret.length] = el;
	}
	
	return ret.length>1?ret:(ret[0] || null);
}

/**
 * 클래스 타입을 정의한다. 
 * @extends core
 * @class $Class는 Jindo에서 객체 지향 프로그래밍(OOP)를 구현하는 객체이다. #Class의 생성자는 $init 으로 정의한다. 모든 인스턴스는 같은 속성을 공유한다. 각 인스턴스가 독립적인 속성값을 가지려면 해당 속성을 $init에서 초기화한다. 자세한 것은 예제 코드를 참조한다.
 * @param {Object} oDef 클래스를 정의하는 객체. 메서드, 프로퍼티와 생성자를 정의한다. 	$staic 키워드는 인스턴스를 생성 하지 않아도 사용할 메소드의 집합이다.
 * @return {$Class} 클래스 객체
 * @description [Lite]
 * @example
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
// c1과 c2는 서로 다른 $Ajax 객체를 각각 가진다.

CClass.static_method(); -> 1

 */
jindo.$Class = function(oDef) {
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
		
		while(typeof t._$superClass != "undefined") {
			
			t.$super = new Object;
			t.$super.$this = this;
					
			for(var x in t._$superClass.prototype) {
				
				if (t._$superClass.prototype.hasOwnProperty(x)){
					if (typeof this[x] == "undefined" && x !="$init") this[x] = t._$superClass.prototype[x];
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
				
		for(var i=a.length-1; i > -1; i--) a[i].$super.$init.apply(a[i].$super, arguments);

		if (typeof this.$init == "function") this.$init.apply(this,arguments);
	}
	
	if (typeof oDef.$static != "undefined") {
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
	
	// if (typeof oDef.$destroy == "undefined") {
	// 	oDef.$destroy = function(){
	// 		if(this.$super&&(arguments.callee==this.$super.$destroy)){this.$super.$destroy();}
	// 	}
	// } else {
	// 	oDef.$destroy = eval("false||"+oDef.$destroy.toString().replace(/\}$/,"console.log(this.$super);console.log(arguments.callee!=this.$super.$destroy);if(this.$super&&(arguments.callee==this.$destroy)){this.$super.$destroy();}}"));
	// }
	// 
	typeClass.prototype = oDef;
	typeClass.prototype.constructor = typeClass;
	typeClass.extend = jindo.$Class.extend;

	return typeClass;
 }

/**
 * 클래스를 상속한다.
 * 하위 클래스는 this.$super.method 로 상위 클래스의 메서드에 접근할 수 있으나, this.$super.$super.method 와 같이 한 단계 이상의 상위 클래스는 접근할 수 없다.
 * @function
 * @param {$Class} superClass 수퍼 클래스 객체
 * @return {$Class} 확장된 클래스
 * @description [Lite]
 * @example
var ClassExt = $Class(classDefinition);
ClassExt.extend(superClass);	
// ClassExt는 SuperClass를 상속받는다. 

 */
jindo.$Class.extend = function(superClass) { 
 	/**
	* 부모 클래스의 메서드에 접근할 때 사용한다.   
	* @memberOf $Class
	* @name $super 
	* @remark $super를 사용하여 부모 클래스의 메서드에 접근할 때 부모 클래스의 매서드가 자식 클래스와 동일한 이름의 속성을 사용하면 자식 클래스의 속성을 사용한다. 
	* @example
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
oChild.$super.sum();    // 30 -> 부모 클래스의 100과 200대신 자식 클래스의 10과 20을 더한다. 
oChild.$super.sum2();   // 20 -> 부모 클래스의 sum()대신 자식 클래스의 sum()을 호출한다. 
	*/
	// superClass._$has_super = true;
	if (typeof superClass == "undefined" || superClass === null || !superClass.extend) {
		throw new Error("extend시 슈퍼 클래스는 Class여야 합니디.");
	}
	
	this.prototype._$superClass = superClass;
	

	// inherit static methods of parent
	for(var x in superClass) {
		if (superClass.hasOwnProperty(x)) {
			if (x == "prototype") continue;
			this[x] = superClass[x];
		}
	}
	return this;
};
/////

/**
 * @fileOverview CSS 셀렉터를 사용한 엘리먼트 선택 엔진
 * @name cssquery.js
 * @author Hooriza
 */

/**
 * CSS 셀렉터를 사용하여 객체를 탐색한다.
 *
 * @function CSS 셀렉터를 사용하여 객체를 탐색한다.
 * @param {String} CSS셀렉터
 * @param {Element} 탐색 대상이 되는 요소, 요소의 하위 노드에서만 탐색한다.  
 * @return {Array} 조건에 해당하는 요소의 배열을 반환한다.
 * @description [Lite] 
 * @example
 // 문서에서 IMG 태그를 찾는다.
 var imgs = $$('IMG');
 
 // div 요소 하위에서 IMG 태그를 찾는다.
 var imgsInDiv = $$('IMG', $('div'));
 
 // 문서에서 IMG 태그 중 가장 첫 요소를 찾는다.
 var firstImg = $$.getSingle('IMG');
 */
jindo.$$ = jindo.cssquery = (function() {
	// querySelector 설정.
	var sVersion = '3.0';
	
	var debugOption = { repeat : 1 };
	
	// 빠른 처리를 위해 노드마다 유일키 값 셋팅
	var UID = 1;
	
	var cost = 0;
	var validUID = {};
	
	var bSupportByClassName = jindo.$('<DIV>').getElementsByClassName ? true : false;
	var safeHTML = false;
	
	var getUID4HTML = function(oEl) {
		
		var nUID = safeHTML ? (oEl._cssquery_UID && oEl._cssquery_UID[0]) : oEl._cssquery_UID;
		if (nUID && validUID[nUID] == oEl) return nUID;
		
		nUID = UID++;
		oEl._cssquery_UID = safeHTML ? [ nUID ] : nUID;
		
		validUID[nUID] = oEl;
		return nUID;

	};
	
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
		return (sPrefix || '') + new Date().getTime() + parseInt(Math.random() * 100000000);
	};
	
	function getElementsByClass(searchClass,node,tag) {
        var classElements = new Array();
        if ( node == null )
                node = document;
        if ( tag == null )
                tag = '*';
        var els = node.getElementsByTagName(tag);
        var elsLen = els.length;
        var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
        for (i = 0, j = 0; i < elsLen; i++) {
                if ( pattern.test(els[i].className) ) {
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
	
	// 따옴표, [] 등 파싱에 문제가 될 수 있는 부분 replace 시켜놓기
	var backupKeys = function(sQuery) {
		
		var oKeys = backupKeys._keys;
		
		// 작은 따옴표 걷어내기
		sQuery = sQuery.replace(/'(\\'|[^'])*'/g, function(sAll) {
			var uid = uniqid('QUOT');
			oKeys[uid] = sAll;
			return uid;
		});
		
		// 큰 따옴표 걷어내기
		sQuery = sQuery.replace(/"(\\"|[^"])*"/g, function(sAll) {
			var uid = uniqid('QUOT');
			oKeys[uid] = sAll;
			return uid;
		});
		
		// [ ] 형태 걷어내기
		sQuery = sQuery.replace(/\[(.*?)\]/g, function(sAll, sBody) {
			if (sBody.indexOf('ATTR') == 0) return sAll;
			var uid = '[' + uniqid('ATTR') + ']';
			oKeys[uid] = sAll;
			return uid;
		});
	
		// ( ) 형태 걷어내기
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
	
	// replace 시켜놓은 부분 복구하기
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
		
		// ( ) 는 한꺼풀만 벗겨내기
		sQuery = sQuery.replace(/_BRCE[0-9]+/g, function(sKey) {
			return oKeys[sKey] ? oKeys[sKey] : sKey;
		});
		
		return sQuery;
		
	};
	
	// replace 시켜놓은 문자열에서 Quot 을 제외하고 리턴
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

		if (sKey == "float" && /MSIE/.test(window.navigator.userAgent)) sKey = "styleFloat";
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
			
		return '_' + sKey + ' = ' + sVal;
	};
	
	var getReturnCode = function(oExpr) {
		
		var sStyleKey = getStyleKey(oExpr.key);
		
		var sVar = '_' + (sStyleKey ? '$$' + sStyleKey : oExpr.key);
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
		
		// 노드 인덱스를 구할 수 없으면
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
	
	// 몇번째 자식인지 설정하는 부분
	var oNodeIndexes = {};

	var setNodeIndex = function(oEl, nIndex) {
		var nUID = getUID(oEl);
		oNodeIndexes[nUID] = nIndex;
	};
	
	var unsetNodeIndexes = function() {
		setTimeout(function() { oNodeIndexes = {}; }, 0);
	};
	
	// 가상 클래스
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
			// console.log(oEl.id,nIndex, nMul, nAdd, nIndex % nMul == nAdd);
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
	
	// 단일 part 의 body 에서 expression 뽑아냄
	var getExpression = function(sBody) {

		var oRet = { defines : '', returns : 'true' };
		
		var sBody = restoreKeys(sBody, true);
	
		var aExprs = [];
		var aDefineCode = [], aReturnCode = [];
		var sId, sTagName;
		
		// 유사클래스 조건 얻어내기
		var sBody = sBody.replace(/:([\w-]+)(\(([^)]*)\))?/g, function(_1, sType, _2, sOption) {
			
			switch (sType) {
			case 'not':
				var oInner = getExpression(sOption); // 괄호 안에 있는거 재귀파싱하기
				
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
					nAdd = parseInt(sOption);
				}
				aReturnCode.push('oPseudoes_dontShrink[' + wrapQuot(sType) + '](oEl, ' + nMul + ', ' + nAdd + ')');
				break;
				
			case 'first-of-type':
			case 'last-of-type':
				sType = (sType == 'first-of-type' ? 'nth-of-type' : 'nth-last-of-type');
				sOption = 1;
				
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
					nMul = parseInt(RegExp.$1) || 1;
					nAdd = parseInt(RegExp.$2) || 0;
				} else {
					nMul = Infinity;
					nAdd = parseInt(sOption);
				}
				
				oRet.nth = [ nMul, nAdd, sType ];
				break;
				
			default:
				sOption = sOption ? restoreString(sOption) : '';
				aReturnCode.push('oPseudoes_dontShrink[' + wrapQuot(sType) + '](oEl, ' + wrapQuot(sOption) + ')');
				break;
			}
			
			return '';
			
		});
		
		// [key=value] 형태 조건 얻어내기
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
	
		// 클래스 조건 얻어내기
		var sBody = sBody.replace(/\.([\w-]+)/g, function(_, sClass) { 
			aExprs.push({ key : 'class', op : '~=', val : sClass });
			if (!sClassName) sClassName = sClass;
			return '';
		});
		
		// id 조건 얻어내기
		var sBody = sBody.replace(/#([\w-]+)/g, function(_, sIdValue) {
			if (bXMLDocument) {
				aExprs.push({ key : 'id', op : '=', val : sIdValue });
			}else{
				sId = sIdValue;
			}
			return '';
		});
		
		sTagName = sBody == '*' ? '' : sBody;
	
		// match 함수 코드 만들어 내기
		var oVars = {};
		
		for (var i = 0, oExpr; oExpr = aExprs[i]; i++) {
			
			var sKey = oExpr.key;
			
			if (!oVars[sKey]) aDefineCode.push(getDefineCode(sKey));
			aReturnCode.unshift(getReturnCode(oExpr)); // 유사클래스 조건 검사가 맨 뒤로 가도록 unshift 사용
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
	
	// 쿼리를 연산자 기준으로 잘라냄
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
	
	// 잘라낸 part 를 함수로 컴파일 하기
	var compileParts = function(aParts) {
		
		var aPartExprs = [];
		
		// 잘라낸 부분들 조건 만들기
		for (var i = 0, oPart; oPart = aParts[i]; i++)
			aPartExprs.push(getExpression(oPart.body));
		
		//////////////////// BEGIN
		
		var sFunc = '';
		var sPushCode = 'aRet.push(oEl); if (oOptions.single) { bStop = true; }';

		for (var i = aParts.length - 1, oPart; oPart = aParts[i]; i--) {
			
			var oExpr = aPartExprs[i];
			var sPush = (debugOption.callback ? 'cost++;' : '') + oExpr.defines;
			
			// console.log(oExpr);

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
						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
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
						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
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
						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
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
						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
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
						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
						'for (; oBase; oBase = (oBase.parentNode || oBase._IE5_parentNode)) { if (oBase == oEl) break; }' +
						'if (!oBase || ' + sCheckTag + ') return aRet;' +
						sPush;
						
				} else {
					
					sTmpFunc +=
						'for (var oEl = (oBase.parentNode || oBase._IE5_parentNode); oEl; oEl = (oEl.parentNode || oEl._IE5_parentNode)) {'+
							'if (' + sCheckTag + ') { continue; }' +
							sPush +
						'}';
					
				}
				
				break;
	
			case '!>' :
			
				if (oExpr.quotID) {
	
					sTmpFunc +=
						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
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
						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
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
						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
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
				
				break;
			}
	
			sTmpFunc +=
				(i == 0 ? 'return aRet;' : '') +
			'})';
			
			sFunc = sTmpFunc;
			
		}
		
		// alert(sFunc);
		//console.log(sFunc);
		eval('var fpCompiled = ' + sFunc + ';');
		//alert(fpCompiled);
		return fpCompiled;
		
	};
	
	// 쿼리를 match 함수로 변환
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
	
	// test 쿼리를 match 함수로 변환
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
	
	var oResultCache = null;
	var bUseResultCache = false;
		
	var old_cssquery = function(sQuery, oParent, oOptions) {
		
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
					
				// ownerDocument 잡아주기
				oDocument_dontShrink = oParent.ownerDocument || oParent.document || oParent;
				
				// 브라우저 버젼이 IE5.5 이하
				if (/\bMSIE\s([0-9]+(\.[0-9]+)*);/.test(navigator.userAgent) && parseFloat(RegExp.$1) < 6) {
					try { oDocument_dontShrink.location; } catch(e) { oDocument_dontShrink = document; }
					
					oDocument_dontShrink.firstChild = oDocument_dontShrink.getElementsByTagName('html')[0];
					oDocument_dontShrink.firstChild._IE5_parentNode = oDocument_dontShrink;
				}
				
				// XMLDocument 인지 체크
				bXMLDocument = (typeof XMLDocument != 'undefined') ? (oDocument_dontShrink.constructor === XMLDocument) : (!oDocument_dontShrink.location);
				getUID = bXMLDocument ? getUID4XML : getUID4HTML;
		
				clearKeys();
				
				// 쿼리를 쉼표로 나누기
				var aSplitQuery = backupKeys(sQuery).split(/\s*,\s*/);
				var aResult = [];
				
				var nLen = aSplitQuery.length;
				
				for (var i = 0; i < nLen; i++)
					aSplitQuery[i] = restoreKeys(aSplitQuery[i]);
				
				// 쉼표로 나눠진 쿼리 루프
				for (var i = 0; i < nLen; i++) {
					
					var sSingleQuery = aSplitQuery[i];
					var aSingleQueryResult = null;
					
					var sResultCacheKey = sSingleQuery + (oOptions.single ? '_single' : '');
		
					// 결과 캐쉬 뒤짐
					var aCache = bUseResultCache ? oResultCache[sResultCacheKey] : null;
					if (aCache) {
						
						// 캐싱되어 있는게 있으면 parent 가 같은건지 검사한후 aSingleQueryResult 에 대입
						for (var j = 0, oCache; oCache = aCache[j]; j++) {
							if (oCache.parent == oParent) {
								aSingleQueryResult = oCache.result;
								break;
							}
						}
						
					}
					
					if (!aSingleQueryResult) {
						
						var fpFunction = parseQuery(sSingleQuery);
						// alert(fpFunction);
						
						cssquery._marked = [];
						for (var j = 0, nDepth = fpFunction.depth; j < nDepth; j++)
							cssquery._marked.push({});
						
						// console.log(fpFunction.toSource());
						aSingleQueryResult = distinct(fpFunction(oParent, oOptions));
						
						// 결과 캐쉬를 사용중이면 캐쉬에 저장
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
			return /\[\s*(?:checked|selected|disabled)/.test(sQuery)
		}
		/**
		 * CSS 셀렉터를 사용하여 엘리먼트 목록을 얻어온다
		 * @param {String} selector	CSS 셀렉터
		 * @param {Document | Element} el	탐색을 진행하는 기준이 되는 엘리먼트 또는 문서 (생략시 현재 문서의 document 객체)
		 * @param {Object} 오브젝트에 onTimeOffCache를 true로 하면 해당 쿼리는 cache를 사용하지 않는다.
		 * @remark el 로는 XMLDocument 또는 XMLElement 도 지정할 수 있다.
		 * @return {Array} 선택된 엘리먼트 목록의 배열
		 */
		cssquery = function(sQuery, oParent, oOptions){
			oParent = oParent || document ;
			try{
				if (_isNonStandardQueryButNotException(sQuery)) {
					throw Error("Non Standard Query");
				}else if (oOptions&&oOptions.single) {
					return [oParent.querySelector(sQuery)];
				}else{
					return Array.prototype.slice.apply(oParent.querySelectorAll(sQuery));
				}
			}catch(e){
				return old_cssquery(sQuery, oParent, oOptions);
			}
		}
	}else{
		cssquery = old_cssquery;
	}
	/**
	 * 특정 엘리먼트가 해당 CSS 셀렉터에 부합하는 엘리먼트인지 판단한다
	 * @remark CSS 셀렉터에 연결자는 사용할 수 없음에 유의한다.
	 * @param {Element} element	검사하고자 하는 엘리먼트
	 * @param {String} selector	CSS 셀렉터
	 * @return {Boolean} 셀렉터 조건에 부합하면 true, 부합하지 않으면 false
	 * @example

// oEl 이 div 태그 또는 p 태그, 또는 align=center 인 엘리먼트인지
if (cssquery.test(oEl, 'div, p, [align=center]')) alert('해당 조건 만족');// oEl 이 div 태그 또는 p 태그, 또는 align=center 인 엘리먼트인지
if (cssquery.test(oEl, 'div, p, [align=center]')) alert('해당 조건 만족');

	 */
	cssquery.test = function(oEl, sQuery) {

		clearKeys();
		
		var aFunc = parseTestQuery(sQuery);
		for (var i = 0, nLen = aFunc.length; i < nLen; i++){
			if (aFunc[i](oEl)) return true;
		}
			
			
		return false;
		
	};

	/**
	 * cssquery 에 결과 캐쉬를 사용할 것인지 지정하거나 확인한다.
	 * @remark 결과 캐쉬를 사용하면 동일한 셀렉터를 사용했을 경우 새로 탐색을 하지 않고 기존 탐색 결과를 그대로 반환하기 때문에 사용자가 변수 캐쉬에 신경쓰지 않고 편하고 빠르게 쓸 수 있는 장점이 있지만 결과의 신뢰성을 위해 DOM 에 변화가 없다는 것이 확실할때만 사용해야 한다.
	 * @param {Boolean} flag	사용할 것 인지 여부 (생략시 사용 여부만 반환)
	 * @return {Boolean} 결과 캐쉬를 사용하는지 여부
	 */
	cssquery.useCache = function(bFlag) {
	
		if (typeof bFlag != 'undefined') {
			bUseResultCache = bFlag;
			cssquery.clearCache();
		}
		
		return bUseResultCache;
		
	};
	
	/**
	 * 결과 캐쉬를 사용 중에 DOM 의 변화가 생기는 등의 이유로 캐쉬를 모두 비워주고 싶을때 사용한다.
	 * @return {Void} 반환값 없음
	 */
	cssquery.clearCache = function() {
		oResultCache = {};
	};
	
	/**
	 * CSS 셀렉터를 사용하여 DOM 에서 원하는 엘리먼트를 하나만 얻어낸다. 반환하는 값은 배열이 아닌 객체 또는 null 이다.
	 * @remark 결과를 하나만 얻어내면 이후의 모든 탐색 작업을 중단하기 때문에 결과가 하나라는 보장이 있을때 빠른 속도로 결과를 얻어올 수 있다.
	 * @param {String} selector	CSS 셀렉터
	 * @param {Document | Element} el	탐색을 진행하는 기준이 되는 엘리먼트 또는 문서 (생략시 현재 문서의 document 객체)
	 * @param {Object} 오브젝트에 onTimeOffCache를 true로 하면 해당 쿼리는 cache를 사용하지 않는다.
	 * @return {Element} 선택된 엘리먼트
	 */
	cssquery.getSingle = function(sQuery, oParent, oOptions) {

		return cssquery(sQuery, oParent, { single : true ,oneTimeOffCache:oOptions?(!!oOptions.oneTimeOffCache):false})[0] || null;
	};
	
	
	/**
	 * XPath 문법을 사용하여 엘리먼트를 얻어온다.
	 * @remark 지원하는 문법이 무척 제한적으로 특수한 경우에서만 사용하는 것을 권장한다.
	 * @param {String} xpath	XPath
	 * @param {Document | Element} el	탐색을 진행하는 기준이 되는 엘리먼트 또는 문서 (생략시 현재 문서의 document 객체)
	 * @return {Array} 선택된 엘리먼트 목록의 배열
	 */
	cssquery.xpath = function(sXPath, oParent) {
		
		var sXPath = sXPath.replace(/\/(\w+)(\[([0-9]+)\])?/g, function(_1, sTag, _2, sTh) {
			sTh = sTh || '1';
			return '>' + sTag + ':nth-of-type(' + sTh + ')';
		});
		
		return old_cssquery(sXPath, oParent);
		
	};
	
	/**
	 * cssquery 를 사용할 때의 성능을 측정하기 위한 방법을 제공하는 함수이다.
	 * @param {Function} callback	셀렉터 실행에 소요된 비용과 시간을 받아들이는 함수 (false 인 경우 debug 옵션을 끔)
	 * @param {Number} repeat	하나의 셀렉터를 반복하여 수행하도록 해서 인위적으로 실행 속도를 늦춤
	 * @remark callback 함수의 형태는 아래와 같습니다.
	 * callback : function({String}query, {Number}cost, {Number}executeTime)
	 * <dl>
	 *	<dt>query</dt>
	 *	<dd>실행에 사용된 셀렉터</dd>
	 *	<dt>cost</dt>
	 *	<dd>탐색에 사용된 비용 (루프 횟수)</dd>
	 *	<dt>executeTime</dt>
	 *	<dd>탐색에 소요된 시간</dd>
	 * </dl>
	 * @return {Void} 반환값 없음
	 * @example

cssquery.debug(function(sQuery, nCost, nExecuteTime) {
	if (nCost > 5000) 
		console.warn('5000 이 넘는 비용이?! 체크해보자 -> ' + sQuery + '/' + nCost);
	else if (nExecuteTime > 200)
		console.warn('0.2초가 넘게 실행을?! 체크해보자 -> ' + sQuery + '/' + nExecuteTime);
}, 20);

....

cssquery.debug(false);

	 */
	cssquery.debug = function(fpCallback, nRepeat) {
		
		debugOption.callback = fpCallback;
		debugOption.repeat = nRepeat || 1;
		
	};
	
	/**
	 * IE 에서 innerHTML 을 쓸때 _cssquery_UID 나오지 않도록 하는 함수이다.
	 * true 로 설정하면 그때부터 탐색하는 노드에 대해서는 innerHTML 에 _cssquery_UID 가 나오지 않도록 하지만 탐색속도는 다소 느려질 수 있다.
	 * @param {Boolean} flag	true 로 셋팅하면 _cssquery_UID 가 나오지 않음
	 * @return {Boolean}	_cssquery_UID 가 나오지 않는 상태이면 true 반환
	 */
	cssquery.safeHTML = function(bFlag) {
		
		var bIE = /MSIE/.test(window.navigator.userAgent);
		
		if (arguments.length > 0)
			safeHTML = bFlag && bIE;
		
		return safeHTML || !bIE;
		
	};
	
	/**
	 * cssquery 의 버젼정보를 담고 있는 문자열이다.
	 */
	cssquery.version = sVersion;
	
	/**
	 * IE에서 validUID,cache를 사용했을때 메모리 닉이 발생하여 삭제하는 모듈 추가.
	 */
	cssquery.release = function() {
		if(/MSIE/.test(window.navigator.userAgent)){
			
			delete validUID;
			validUID = {};
			
			if(bUseResultCache){
				cssquery.clearCache();
			}
		}
	};
	/**
	 * cache가 삭제가 되는지 확인하기 위해 필요한 함수
	 * @ignore
	 */
	cssquery._getCacheInfo = function(){
		return {
			uidCache : validUID,
			eleCache : oResultCache 
		}
	}
	/**
	 * 테스트를 위해 필요한 함수
	 * @ignore
	 */
	cssquery._resetUID = function(){
		UID = 0
	}

	return cssquery;
	
})();


/**
 * @fileOverview $Agent의 생성자 및 메서드를 정의한 파일
 */

/**
 * Agent 객체를 반환한다. Agent 객체는 브라우저와 OS에 대한 정보를 알 수 있도록 한다.
 * @class Agent 객체는 운영체제, 브라우저를 비롯한 사용자 시스템의 정보를 가져온다. 
 * @constructor
 * @author Kim, Taegon  
 */
jindo.$Agent = function() {
	var cl = arguments.callee;
	var cc = cl._cached;
		
	if (cc) return cc;
	if (!(this instanceof cl)) return new cl;	
	if (!cc) cl._cached = this;
	
	this._navigator = navigator;	
}

/**
 * navigator 메서드는 웹 브라우저의 정보 객체를 리턴한다. 
 * @return {Object} 웹 브라우저 정보를 저장하는 객체. 
 * object는 브라우저 이름과 버전을 속성으로 가진다. 브라우저 이름은 영어 소문자로 표시하며, 사용자의 브라우저와 일치하는 브라우저 이름은 true를 가진다. 
 * @since 1.4.3 부터 mobile,msafari,mopera,mie 사용 가능.
 * @since 1.4.5 부터 ipad일떼 mobile는 false를 반환 한다.
 * @example
oAgent = $Agent().navigator(); // 사용자가 파이어폭스 3를 사용한다고 가정한다. 
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
oAgent.nativeVersion //-1 (1.4.2부터 사용 가능, IE8에서 호환 모드 사용시 nativeVersion은 8로 나옴.)
oAgent.getName() // firefox
*/
 
jindo.$Agent.prototype.navigator = function() {
	var info = new Object;
	var ver  = -1;
	var nativeVersion = -1;
	var u    = this._navigator.userAgent;
	var v    = this._navigator.vendor || "";
	
	function f(s,h){ return ((h||"").indexOf(s) > -1) };

	info.getName = function(){
		var name = "";
		for(x in info){
			if(typeof info[x] == "boolean" && info[x]&&info.hasOwnProperty(x))
				name = x;			
		}
		return name;	
	}
		
	info.webkit		= f("WebKit",u);
	info.opera     = (typeof window.opera != "undefined") || f("Opera",u);
	info.ie        = !info.opera && f("MSIE",u);
	info.chrome    = info.webkit && f("Chrome",u);	
	info.safari    = info.webkit && !info.chrome && f("Apple",v);
	info.firefox   = f("Firefox",u);
	info.mozilla   = f("Gecko",u) && !info.safari && !info.chrome && !info.firefox;
	info.camino    = f("Camino",v);
	info.netscape  = f("Netscape",u);
	info.omniweb   = f("OmniWeb",u);
	info.icab      = f("iCab",v);
	info.konqueror = f("KDE",v);
	
	info.mobile	   = (f("Mobile",u)||f("Android",u)||f("Nokia",u)||f("webOS",u)||f("Opera Mini",u)||f("BlackBerry",u)||f("PPC",u)||f("Smartphone",u)||f("IEMobile",u))&&!f("iPad",u);
	info.msafari   = (!f("IEMobile",u) && f("Mobile",u))||(f("iPad",u)&&f("Safari",u));
	info.mopera    = f("Opera Mini",u);
	info.mie       = f("PPC",u)||f("Smartphone",u)||f("IEMobile",u);

	try {
		if (info.ie) {
			ver = u.match(/(?:MSIE) ([0-9.]+)/)[1];
			if (u.match(/(?:Trident)\/([0-9.]+)/)&&u.match(/(?:Trident)\/([0-9.]+)/)[1]==4){
				nativeVersion = 8;
			}
		} else if (info.safari||info.msafari) {
			ver = parseFloat(u.match(/Safari\/([0-9.]+)/)[1]);
			if (ver == 100) {
				ver = 1.1;
			} else {
				ver = [1.0,1.2,-1,1.3,2.0,3.0][Math.floor(ver/100)];
			}
		} else if(info.mopera){
			ver = u.match(/(?:Opera\sMini)\/([0-9.]+)/)[1];
		} else if (info.firefox||info.opera||info.omniweb) {
			ver = u.match(/(?:Firefox|Opera|OmniWeb)\/([0-9.]+)/)[1];
		} else if (info.mozilla) {
			ver = u.match(/rv:([0-9.]+)/)[1];
		} else if (info.icab) {
			ver = u.match(/iCab[ \/]([0-9.]+)/)[1];
		} else if (info.chrome) {
			ver = u.match(/Chrome[ \/]([0-9.]+)/)[1];
		}

		info.version = parseFloat(ver);
		info.nativeVersion = parseFloat(nativeVersion);
		if (isNaN(info.version)) info.version = -1;
	} catch(e) {
		info.version = -1;
	}
	
	this.navigator = function() {
		return info;
	};
	
	return info;
};

/**
 * os 메서드는 운영체제에 대한 정보 객체를 리턴한다.
 * @return {Object} 운영체제 정보 객체. 운영체제의 영문 이름을 속성으로 가지며, 사용자가 사용하는 운영체제와 동일한 이름의 속성은 true를 가진다.
 * @since 1.4.3 부터 iphone,android,nokia,webos,blackberry,mwin 사용 가능.
 * @since 1.4.5 부터 ipad 사용가능.
 * @example
oOS = $Agent().os();  // 사용자의 운영체제가 Windows XP라고 가정한다.
oOS.linux  // false
oOS.mac  // false
oOS.vista  // false
oOS.win  // true
oOS.win2000  // false
oOS.winxp  // true
oOS.xpsp2  // false
oOS.win7  // false
oOS.getName() // winxp
 */
jindo.$Agent.prototype.os = function() {
	var info = new Object;
	var u    = this._navigator.userAgent;
	var p    = this._navigator.platform;
	var f    = function(s,h){ return (h.indexOf(s) > -1) };

	info.getName = function(){
		var name = "";
		for(x in info){
			
			if(typeof info[x] == "boolean" && info[x]&&info.hasOwnProperty(x))
				name = x;			
		}
		return name;	
	}
	
	info.win     = f("Win",p)
	info.mac     = f("Mac",p);
	info.linux   = f("Linux",p);
	info.win2000 = info.win && (f("NT 5.0",u) || f("2000",u));
	info.winxp   = info.win && f("NT 5.1",u);
	info.xpsp2   = info.winxp && f("SV1",u);
	info.vista   = info.win && f("NT 6.0",u);
	info.win7  = info.win && f("NT 6.1",u);
	info.ipad = f("iPad",u);
	info.iphone = f("iPhone",u) && !info.ipad;
	info.android = f("Android",u);
	info.nokia =  f("Nokia",u);
	info.webos = f("webOS",u);
	info.blackberry = f("BlackBerry",u);
	info.mwin = f("PPC",u)||f("Smartphone",u)||f("IEMobile",u);
	

	this.os = function() {
		return info;
	};

	return info;
};

/**
 * flash 메서드는 플래시에 대한 정보 객체를 리턴한다.
 * @return {Object} Flash 정보 객체. object.installed는 플래시 플레이어 설치 여부를 boolean 값으로 가지고 object.version은 플래시 플레이어의 버전을 가진다. 플래시 버전을 탐지하지 못하면 flash.version은 -1의 값을 가진다.
 * @example
var oFlash = $Agent.flash();
oFlash.installed  // 플래시 플레이어를 설치했다면 true
oFlash.version  // 플래시 플레이어의 버전. 
 */
jindo.$Agent.prototype.flash = function() {
	var info = new Object;
	var p    = this._navigator.plugins;
	var m    = this._navigator.mimeTypes;
	var f    = null;

	info.installed = false;
	info.version   = -1;

	if (typeof p != "undefined" && p.length) {
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
	} else if (typeof m != "undefined" && m.length) {
		f = m["application/x-shockwave-flash"];
		info.installed = (f && f.enabledPlugin);
	} else {
		for(var i=10; i > 1; i--) {
			try {
				f = new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+i);

				info.installed = true;
				info.version   = i;
				break;
			} catch(e) {}
		}
	}

	this.flash = function() {
		return info;
	};
	// 하위호환을 위해 일단 남겨둔다.
	this.info = this.flash;

	return info;
};

/**
 * silverlight 메서드는 실버라이트(SilverLight)에 대한 정보 객체를 리턴한다.
 * @returns {Object} Silverlight 정보 객체. object.installed은 실버라이트 플레이어 설치 여부를 boolean 값으로 가지고 object.version은 실버라이트 플레이어의 버전을 가진다. 플레이어의 버전을 탐지하지 못하면 object.version의 값은 -1이 된다.
 * @example 
var oSilver = $Agent.silverlight();
oSilver.installed  // SilverLight 플레이어를 설치했다면 true
oSilver.version  // SilverLight 플레이어의 버전. 
 */
jindo.$Agent.prototype.silverlight = function() {
	var info = new Object;
	var p    = this._navigator.plugins;
	var s    = null;

	info.installed = false;
	info.version   = -1;

	if (typeof p != "undefined" && p.length) {
		s = p["Silverlight Plug-In"];
		if (s) {
			info.installed = true;
			info.version = parseInt(s.description.split(".")[0]);
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

/**
 * @fileOverview $A의 생성자 및 메서드를 정의한 파일
 * @name array.js
 */

/**
 * 배열, 혹은 컬랙션을 내부 배열로 변환하거나 새로운 $A 객체를 생성한다.
 *
 * @extends core
 * @class	$A는 배열이나 배열과 비슷한 컬렉션(Collection)을 배열로 변환한다. 
 * @param 	{Array} array 배열 혹은 배열과 비슷한 컬렉션. 만약 array를 생략하면 빈 배열을 가진 새로운 $A 객체를 리턴한다. 
 * @constructor
 * @description [Lite]
 * @author Kim, Taegon
 */
jindo.$A = function(array) {
	var cl = arguments.callee;
	
	if (typeof array == "undefined" || array == null) array = [];
	if (array instanceof cl) return array;
	if (!(this instanceof cl)) return new cl(array);
	
	this._array = []
	if (array.constructor != String) {
		this._array = [];
		for(var i=0; i < array.length; i++) {
			this._array[this._array.length] = array[i];
		}
	}
	
};

/**
 * toString 매서드는 내부 배열을 문자열로 리턴한다. 자바스크립트의 Array.toString을 사용한다.
 * @return {String} 내부 배열을 변환한 문자열.
 * @description [Lite]
 */
jindo.$A.prototype.toString = function() {
	return this._array.toString();
};


/**
 * get 매서드는 해당 인덱스의 값을 리턴한다.(1.4.2 부터 지원.)
 * @param {Number} [nIndex] 배열의 인덱스.
 * @return {Value} 해당 인덱스에 값.
 * @description [Lite]
 */
jindo.$A.prototype.get = function(nIndex){
	return this._array[nIndex];
};

/**
 * length 매서드는 내부 배열의 크기를 지정하거나 반환한다.
 * 
 * @return 	Number 배열의 크기
 * @param 	{Number} [nLen]	새로 리턴할 배열의 크기. nLen이 기존의 배열보다 크면 oValue으로 초기화한 원소를 마지막에 덧붙인다. nLen이 기존 배열보다 작으면 nLen번째 이후의 원소는 제거한다.
 * @param 	{Value} [oValue]	새로운 원소를 추가할 때 사용할 초기값
 * @example
var zoo = ["zebra", "giraffe", "bear", "monkey"];
var birds = [];

$A(zoo).length();
// 4

$A(zoo).length(2);				
// zoo.$value = ["zebra", "giraffe"] 

$A(zoo).length(6, "(Empty)");	
//  zoo.$value = ["zebra", "giraffe", "bear", "monkey", "(Empty)", "(Empty)"]

$A(zoo).length(5, birds);
//  zoo.$value = ["zebra", "giraffe", "bear", "monkey", []]
 */
jindo.$A.prototype.length = function(nLen, oValue) {
	if (typeof nLen == "number") {
		var l = this._array.length;
		this._array.length = nLen;
		
		if (typeof oValue != "undefined") {
			for(var i=l; i < nLen; i++) {
				this._array[i] = oValue;
			}
		}

		return this;
	} else {
		return this._array.length;
	}
};

/**
 * has 메서드는 주어진 원소가 배열에 존재하는지 검색한다.
 * @return {Boolean} 배열의 원소중 인수 값과 동일한 원소를 검색했다면 true를, 그렇지 않으면 false를 리턴한다. 
 * @param {Value} oValue 검색할 값
 * @see $A.indexOf
 * @description [Lite]
 * @example
var arr = $A([1,2,3]);

arr.has(3); // true
arr.has(4); // false
 */
jindo.$A.prototype.has = function(oValue) {
	return (this.indexOf(oValue) > -1);
};

/**
 * indexOf 메서드는 내부 배열의 원소를 검색하고, 찾은 원소의 인덱스를 리턴한다.  
 * @param {Value} oValue 검색할 값
 * @return {Number} 찾은 원소의 인덱스. 원소의 인덱스는 0부터 시작한다. 인수와 동일한 원소를 찾지 못하면 -1 을 리턴한다.
 * @description [Lite]
 * @example
var zoo = ["zebra", "giraffe", "bear"];

$A(zoo).indexOf("giraffe");
// return 1 
 * @see $A.has
 */
jindo.$A.prototype.indexOf = function(oValue) {
	if (typeof this._array.indexOf != 'undefined') return this._array.indexOf(oValue);

	for(var i=0; i < this._array.length; i++) {
		if (this._array[i] == oValue) return i;
	}
	return -1;
};

/**
 * $value 메서드는 원본 배열을 리턴한다.
 * @return {Array} 배열.
 * @description [Lite]
 */
jindo.$A.prototype.$value = function() {
	return this._array;
};

/**
 * push 메서드는 내부 배열에 하나 이상의 원소를 추가한다. 
 * @param {oValue1, ..., oValueN} oValueN 추가할 N 개의 값 
 * @return {Number} 하나 이상의 원소를 추가한 내부 배열의 크기.
 * @description [Lite]
 * @example
var arr = $A([1,2,3]);

arr.push(4); // arr => [1,2,3,4]
arr.push(5,6); // arr => [1,2,3,4,5,6]
 */
jindo.$A.prototype.push = function(oValue1/*, ...*/) {
	return this._array.push.apply(this._array, Array.prototype.slice.apply(arguments));
};

/**
 * pop 메서드는 내부 배열의 마지막 원소를 삭제한다.
 * @return {Value} 삭제한 원소
 * @description [Lite]
 * @example
var arr = $A([1,2,3,4,5]);
var elem = arr.pop(); 

document.write(elem); // 5
document.write(arr); // [1,2,3,4]
 */
jindo.$A.prototype.pop = function() {
	return this._array.pop();
};

/**
 * shift 메서드는 내부 배열의 모든 원소를 한 칸씩 앞으로 이동한다. 내부 배열의 첫 원소는 삭제된다.
 * @return {Value} 삭제한 첫 원소.
 * @see $A#pop
 * @see $A#unshift
 * @description [Lite]
 * @example
var arr  = $A(['Melon','Grape','Apple','Kiwi']);
var elem = arr.shift();

document.write(elem); // Melon
document.write(arr);  // [Grape, Apple, Kiwi]
 */
jindo.$A.prototype.shift = function() {
	return this._array.shift();
};

/**
 * unshift 메서드는 내부 배열 맨 앞에 하나 이상의 원소를 삽입한다.
 * @param {oValue1, ..., oValueN} oValueN 추가할 하나 이상의 값
 * @return {Number} 엘리먼트를 추가한 후의 배열 객체 크기
 * @description [Lite]
 * @example
var arr = $A([4,5]);

arr.unshift('c');
document.write(arr); // [c, 4, 5]

arr.unshift('a', 'b');
document.write(arr); // [a, b, c, 4, 5]
 */
jindo.$A.prototype.unshift = function(oValue1/*, ...*/) {
	this._array.unshift.apply(this._array, Array.prototype.slice.apply(arguments));

	return this._array.length;
};

/**
 * forEach 메서드는 내부 배열의 모든 원소를 순회하면서 콜백 함수를 실행한다. 
 * @param {Function}	fCallback	순회 실행할 콜백 함수. 콜백 함수는 fCallback(value, index, array)의 형식을 가진다. 
 * @param {Object}	[oThis]	콜백 함수가 메서드일 때 콜백 함수의 this
 * @return {Object}	$A 객체 
 * @import core.$A[Break, Continue]
 * @see $A#map
 * @description [Lite]
 * @example
$A(["zebra", "giraffe", "bear", "monkey"]).forEach(function(v,i,o) {
	document.writeln((i+1)+". " + v);
});
// 결과 : (줄 앞의 주석표시 //는 제외)
// 1. zebra
// 2. giraffe
// 3. bear
// 4. monkey
 */
jindo.$A.prototype.forEach = function(fCallback, oThis) {
	var arr         = this._array;
	var errBreak    = this.constructor.Break;
	var errContinue = this.constructor.Continue;
	
	function f(v,i,a) {
		try {
			fCallback.call(oThis, v, i, a);
		} catch(e) {
			if (!(e instanceof errContinue)) throw e;
		}
	};

	if (typeof this._array.forEach == "function") {
		try {
			this._array.forEach(f);
		} catch(e) {
			if (!(e instanceof errBreak)) throw e;
		}
		return this;
	}

	for(var i=0; i < arr.length; i++) {
		try {
			f(arr[i], i, arr);
		} catch(e) {
			if (e instanceof errBreak) break;
			throw e;
			
		}
	}

	return this;
};

/**
 * slice 메서드는 내부 배열의 일부를 추출한다.
 * @param {Number} nStart 잘라낼 부분의 시작 인덱스
 * @param {Number} nEnd 잘라낼 부분의 바로 뒤 인덱스
 * @returns {$A} 내부 배열의 일부를 추출한 새로운 $A 객체. start가 end보다 작거나 같을 경우, 혹은 start가 0보다 작을 경우는 빈 배열을 가지는 $A를 리턴한다.
 * @description [Lite]
 * @example
var arr = $A([12, 5, 8, 130, 44]);
var newArr = arr.slice(1,3);

document.write(arr); // [12, 5, 8, 130, 44]
document.write(newArr); // [5, 8]
 */
jindo.$A.prototype.slice = function(nStart, nEnd) {
	var a = this._array.slice.call(this._array, nStart, nEnd);
	return jindo.$A(a);
};

/**
 * splice 메서드는 내부 배열의 일부를 삭제한다.  
 * @param {Number} nIndex	삭제할 원소의 시작 인덱스
 * @param {Number} nHowMany	삭제할 원소의 갯수. 이 값을 생략하면 index 번째 원소부터 마지막 원소까지 삭제한다. ??
 * @param {Value1, ...,ValueN} oValueN 삭제한 배열에 추가할 하나 이상의 값. 삽입은 nIndex로 지정한 시작 인덱스에서 부터 시작한다. ??
 * @returns {$A} 삭제한 원소를 포함하는 새로운 $A 객체.
 * @description [Lite]
 * @example
var arr = $A(["angel", "clown", "mandarin", "surgeon"]);
var removed = arr.splice(2, 0, "drum");

document.write(arr); // [angel, clown, drum, mandarin, surgeon]
document.write(removed); // []

removed = arr.splice(3, 1);

document.write(arr); // [angel, clown, drum, surgeon]
document.write(removed); // [mandarin]

removed = a.splice(2, 1, "trumpet", "parrot");

document.write(arr); // [angel, clown, trumpet, parrot, surgeon]
document.write(removed); // [drum]
 */
jindo.$A.prototype.splice = function(nIndex, nHowMany/*, oValue1,...*/) {
	var a = this._array.splice.apply(this._array, Array.prototype.slice.apply(arguments));

	return jindo.$A(a);
};

/**
 * shuffle 메서드는 내부 배열의 원소를 무작위로 섞는다.
 * @returns {$A} 정렬한 $A 객체.
 * @description [Lite]
 * @example
var dice = $A([1,2,3,4,5,6]);

dice.shuffle();

document.write("You get the number " + dice[0]);
// 결과 : 1부터 6까지의 숫자 중 랜덤한 숫자
 */
jindo.$A.prototype.shuffle = function() {
	this._array.sort(function(a,b){ return Math.random()>Math.random()?1:-1 });
	
	return this;
};

/**
 * reverse 메서드는 내부 배열의 원소 순서를 거꾸로 뒤집는다.
 * @returns {$A} 원소 순서를 뒤집은 $A 객체.
 * @description [Lite]
 * @example
var arr = $A([1, 2, 3, 4, 5]);

arr.reverse();
document.write(arr); // [5, 4, 3, 2, 1]
 */
jindo.$A.prototype.reverse = function() {
	this._array.reverse();

	return this;
};

/**
 * empty 메서드는 배열의 모든 원소를 제거하고, 빈 배열로 만든다.
 * @returns {$A} 빈 배열 $A 객체
 * @description [Lite]
 * @example
var arr = $A([1, 2, 3]);

arr.empty();
document.write(arr); // []
 */
jindo.$A.prototype.empty = function() {
	return this.length(0);
};

/**
 * Break 메서드는 each, filter, map 메서드의 순회 루프를 중단한다.
 * @description [Lite]
 * @example
$A([1,2,3,4,5]).forEach(function(value,index,array) {
   // 값이 4보다 크면 종료
  if (value > 4) $A.Break();
   ...
});
 */
jindo.$A.Break = function() {
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};

/**
 * Continue 메서드는 each, filter, map 메서드의 순회 루프에서 나머지 명령을 실행하지 않고 다음 루프로 건너뛴다.
 * 내부적으로는 강제로 exception을 발생시키는 구조이므로, try ~ catch 영역에서 이 메소드를 실행하면 정상적으로 동작하지 않을 수 있다.
 * 
 * @description [Lite]
 * @example
$A([1,2,3,4,5]).forEach(function(value,index,array) {
   // 값이 짝수면 처리를 하지 않음
  if (value%2 == 0) $A.Continue();
   ...
});
 */
jindo.$A.Continue = function() {
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};

/**
 * @fileOverview $A의 확장 메서드를 정의한 파일
 * @name array.extend.js
 */

/**
 * map 메서드는 내부 배열의 모든 원소를 순회하면서 콜백 함수를 실행한다.
 * @param {Function} fCallback	순회 실행할 콜백 함수. 콜백 함수는 fCallback(value, index, array)의 형식을 가진다. 
 * @param {Object} [oThis]	콜백 함수가 메서드일 때 콜백 함수의 this		
 * @return {$A} 콜백 함수 수행 결과를 반영한 $A 객체
 * @see $A#forEach
 * @example
var animalList = $A(["zebra", "giraffe", "bear", "monkey"]).map(function(v,i,o) {
	return (i+1)+". " + v;
});
	
document.write (animalList.$value());
// 결과 : [1. zebra, 2. giraffe, 3. bear, 4. moneky]
 */
jindo.$A.prototype.map = function(fCallback, oThis) {
	var arr         = this._array;
	var errBreak    = this.constructor.Break;
	var errContinue = this.constructor.Continue;
	
	function f(v,i,a) {
		try {
			return fCallback.call(oThis, v, i, a);
		} catch(e) {
			if (e instanceof errContinue){
				return v;
			} else{
				throw e;				
			}
		}
	};

	if (typeof this._array.map == "function") {
		try {
			this._array = this._array.map(f);
		} catch(e) {
			if(!(e instanceof errBreak)) throw e;
		}
		return this;
	}

	for(var i=0; i < this._array.length; i++) {
		try {
			arr[i] = f(arr[i], i, arr);
		} catch(e) {
			if (e instanceof errBreak) break;
			throw e;
		}
	}

	return this;
};

/**
 * filter 메서드는 내부 배열의 모든 원소를 순회하면서 콜백 함수를 실행한다. 콜백 함수를 만족하는 원소는 새로운 $A 객체의 내부 배열에 추가된다. 
 * @param {Function} fCallback	순회 실행할 콜백 함수. 콜백 함수는 Boolean 값을 리턴해야 한다.
 * @param {Object} oThis	콜백 함수가 메서드일 경우 콜백 함수의 this
 * @returns {$A}	콜백 함수를 만족하는 원소만 포함하는 $A 객체.
 * @example
var arr = $A([1,2,3,4,5]);

// 필터링 함수
function filterFunc(element, index, array) {
	if (element > 2) {
		return true;
	} else {
		return false;
	}
}

var newArr = arr.filter(filterFunc);

document.write(arr); // [1,2,3,4,5]
document.write(newArr); // [3,4,5]
 */
jindo.$A.prototype.filter = function(fCallback, oThis) {
	var ar = new Array;

	this.forEach(function(v,i,a) {
		if (fCallback.call(oThis, v, i, a) === true) {
			ar[ar.length] = v;
		}
	});

	return jindo.$A(ar);
};

/**
 * every 메서드는 내부 배열의 모든 원소가 콜백 함수를 만족하는지 검사한다.
 * @param {Function} fCallback	순회 실행할 콜백 함수. 콜백 함수는 반드시 boolean 값을 리턴해야 한다. 
 * @param {Object} oThis	콜백 함수가 메서드일 경우 콜백 함수의 this
 * @returns {Boolean} 내부 배열의 모든 원소가 콜백 함수를 만족하면 true, 그렇지 않으면 false를 리턴한다.
 * @example
function isBigEnough(element, index, array) {
		return (element >= 10);
	}

var try1 = $A([12, 5, 8, 130, 44]).every(isBigEnough);
// false

var try2 = $A([12, 54, 18, 130, 44]).every(isBigEnough);
// true
 */
jindo.$A.prototype.every = function(fCallback, oThis) {
	if (typeof this._array.every != "undefined") return this._array.every(fCallback, oThis);

	var result = true;
	
	this.forEach(function(v, i, a) {
		if (fCallback.call(oThis, v, i, a) === false) {
			result = false;
			jindo.$A.Break();
		}
	});
	
	return result;
};

/**
 * some 메서드는 내부 배열에 콜백 함수를 만족시키는 원소가 있는지 검사한다. 
 * @param {Function} fCallback	순회 실행할 콜백 함수. 콜백 함수는 반드시 Boolean 값을 리턴해야 한다. 
 * @param {Object} oThis	콜백 함수가 메서드일 경우 콜백 함수의 this
 * @returns {Boolean} 내부 배열에 콜백 함수를 만족시키는 원소가 있으면 true, 콜백 함수를 만족시키는 원소가 하나도 없다면 false를 리턴한다.
 * @example
function twoDigitNumber(element, index, array) {
	return (element >= 10 && element < 100);
}

var try1 = $A([12, 5, 8, 130, 44]).some(twoDigitNumber);
// true

var try2 = $A([1, 5, 8, 130, 4]).some(twoDigitNumber);
// false
 */
jindo.$A.prototype.some = function(fCallback, oThis) {
	if (typeof this._array.some != "undefined") return this._array.some(fCallback, oThis);

	var result = false;
	this.forEach(function(v, i, a) {
		if (fCallback.call(oThis, v, i, a) === true) {
			result = true;
			jindo.$A.Break();
		}
	});
	return result;
};

/**
 * refuse 메서드는 특정 값을 제외한 새로운 $A 객체를 리턴한다.
 * @param {Value, ..., ValueN} oValueN 내부 배열에서 제외할 값
 * @returns {$A} 내부 배열에서 특정 값을 제외한 새로운 $A 객체
 * @example
var arr = $A([12, 5, 8, 130, 44]);

var newArr1 = arr.refuse(12);

document.write(arr); // [12, 5, 8, 130, 44]
document.write(newArr1); // [5, 8, 130, 44]

var newArr2 = newArr1.refuse(8, 44, 130);

document.write(newArr1); // [5, 8, 130, 44]
document.write(newArr2); // [5]
 */
jindo.$A.prototype.refuse = function(oValue1/*, ...*/) {
	var a = jindo.$A(Array.prototype.slice.apply(arguments));
	return this.filter(function(v,i) { return !a.has(v) });
};

/**
 * unique 메서드는 내부 배열에서 중복되는 원소를 삭제한다.
 * @returns {$A} 중복되는 원소를 제거한 $A 객체. 
 * @example
var arr = $A([10, 3, 76, 5, 4, 3]);

arr.unique();
document.write(arr); // [10, 3, 76, 5, 4]
 */
jindo.$A.prototype.unique = function() {
	var a = this._array, b = [], l = a.length;
	var i, j;

	// 중복되는 원소 제거
	for(i = 0; i < l; i++) {
		for(j = 0; j < b.length; j++) {
			if (a[i] == b[j]) break;
		}
		
		if (j >= b.length) b[j] = a[i];
	}
	
	this._array = b;
	
	return this;
};

/**
 * @fileOverview $Ajax의 생성자 및 메서드를 정의한 파일
 * @name Ajax.js
 */

/**
 * $Ajax 객체를 생성 및 리턴한다.
 * @extends core
 * @class $Ajax는 ajax 요청과 응답을 처리한다.
 * @param {String}   url			  서버측 URL. URL이 "http://" 혹은 "https://로 시작하면 자동으로 Cross-domain ajax를 호출한다. Cross-domain ajax에 대한 자세한 정보는 http://wiki.nhncorp.com/display/lsuit/Jindo2+Cross-domain+Ajax 를 참조한다.
 * @param {Object}   option		      HTTP 요청에 사용할 매개변수.
 * @param {String}   option.type	  요청 타입. "xhr", "iframe", "jsonp", "flash" 중에 선택할 수 있다. 하위 호환성을 위해 "post" 혹은 "get"을 지원하며, "post", "get"으로 선택하면 type은 자동적으로 "xhr"이 된다. 기본값은 "xhr"이다.
 * @param {String}   option.method	  HTTP 요청에 사용할 방식. "post", "get", "put", "delete"을 이용한다. 단, 특정 type에서 요청 방식이 강제되는 경우가 있다. 예를 들어 type을 jsonp으로 설정했다면 method는 강제적으로 get이 된다. 기본값은 "post"이다.(1.4.2부터 put,delete 사용 가능.)
 * @param {Number}   option.timeout   요청이 일정시간 동안 요청이 완료되지 않으면 중지시킨다. 단위는 초이다.
 * @param {Function} option.onload	  요청이 완료되면 실행할 콜백 함수
 * @param {Function} option.onerror	  요청이 실패하면 실행할 콜백 함수. 지정하지 않았을 경우에는 에러가 발생해도 onload를 실행한다.
 * @param {Function} option.ontimeout 타임아웃이 되었을 때 실행할 콜백 함수
 * @param {String} option.proxy		  Ajax를 실행하는 현재 문서와 동일한 도메인에 존재하는 proxy 파일의 위치. Jindo와 함께 배포하는 ajax_local_callback.html을 사용한다. type을 iframe으로 설정했다면 반드시 proxy를 설정해야 한다.
 * @param {String} option.jsonp_charset	type을 jsonp로 설정했을 때 요청에 사용할 인코딩 방식. 보내는 문자셋은 항상 UTF-8이다(0.4.2 부터 지원).
 * @param {String} option.callbackid	type을 jsonp로 설정했을 때, callback함수 이름에 사용할 id를 직접 지정.(1.3.0 부터 지원).
 * @param {String} option.callbackname	type을 jsonp로 설정했을 때, 서버에 전달하는 파라메터를 변경할수 있다.기본값은 _callback임,(1.3.8 부터 지원).
 * @param {Boolean} option.sendheader  요청헤더를 전송할지 여부. Flash 방식으로 호출시 crossdomain.xml에 allow-header 없는 경우 false설정. 디폴트는 true(1.3.4부터 지원) 
 * @param {Boolean} option.async  비동기 호출 여부. XHR방식에서만 유효. 디폴트는 true(1.3.7부터 지원) 
 * @param {Boolean} option.decode flash에서만 사용되며 요청한 데이터 안에 utf-8아닌 다른 인코딩이 되어 있을때 false 사용.기본값 true(1.4.0부터 지원)  
 * @param {Boolean} option.postBody request 요청시 넘어가는 파라미터를 postBody로 사용할지 여부. XHR의 POST/PUT/DELETE 에서만 유효함. 기본값 false(1.4.2부터 지원.)
 * @constructor
 * @description [Lite]
 * @author Kim, Taegon
 */
jindo.$Ajax = function (url, option) {
	var cl = arguments.callee;
	if (!(this instanceof cl)) return new cl(url, option);

	function _getXHR() {
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		} else if (ActiveXObject) {
			try { 
				return new ActiveXObject('MSXML2.XMLHTTP'); 
			}catch(e) { 
				return new ActiveXObject('Microsoft.XMLHTTP'); 
			}
			return null;
		}
	}

	var loc    = location.toString();
	var domain = '';
	try { domain = loc.match(/^https?:\/\/([a-z0-9_\-\.]+)/i)[1]; } catch(e) {}
	
	this._status = 0;
	this._url = url;
	this._options  = new Object;
	this._headers  = new Object;
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
	this.option(option);
	
	// 테스트를 위해 우선 적용가능한 설정 객체가 존재하면 적용
	if(jindo.$Ajax.CONFIG){
		this.option(jindo.$Ajax.CONFIG);
	}	

	var _opt = this._options;

	_opt.type   = _opt.type.toLowerCase();
	_opt.method = _opt.method.toLowerCase();

	if (typeof window.__jindo2_callback == "undefined") {
		window.__jindo2_callback = new Array();
	}

	switch (_opt.type) {
		case "put":
		case "delete":
		case "get":
		case "post":
			_opt.method = _opt.type;
			_opt.type   = "xhr";
		case "xhr":
			this._request = _getXHR();
			break;
		case "flash":
			if(!jindo.$Ajax.SWFRequest) throw Error('Require jindo.$Ajax.SWFRequest');
			this._request = new jindo.$Ajax.SWFRequest();
			this._request._decode = _opt.decode;
			break;
		case "jsonp":
			if(!jindo.$Ajax.JSONPRequest) throw Error('Require jindo.$Ajax.JSONPRequest');
			_opt.method = "get";
			this._request = new jindo.$Ajax.JSONPRequest();
			this._request.charset = _opt.jsonp_charset;
			this._request.callbackid = _opt.callbackid;
			this._request.callbackname = _opt.callbackname;
			break;
		case "iframe":
			if(!jindo.$Ajax.FrameRequest) throw Error('Require jindo.$Ajax.FrameRequest');
			this._request = new jindo.$Ajax.FrameRequest();
			this._request._proxy = _opt.proxy;
			break;
	}
};

/**
 * @ignore
 */
jindo.$Ajax.prototype._onload = (function(isIE) {
	if(isIE){
		return function(){
			var bSuccess = this._request.readyState == 4 && this._request.status == 200;
			var oResult;
			if (this._request.readyState == 4) {
				  try {
						if (this._request.status != 200 && typeof this._options.onerror == 'function'){
							if(!this._request.status == 0){
								this._options.onerror(jindo.$Ajax.Response(this._request));
							}
						}else{
							oResult = this._options.onload(jindo.$Ajax.Response(this._request));
						} 
				}finally{
					if(typeof this._oncompleted == 'function'){
						this._oncompleted(bSuccess, oResult);
					}
					if (this._options.type != "jsonp"){
						this.abort();
						try { delete this._request.onload; } catch(e) { this._request.onload =undefined;} 
					}
					delete this._request.onreadystatechange;
					
				}
			}
		}
	}else{
		return function(){
			var bSuccess = this._request.readyState == 4 && this._request.status == 200;
			var oResult;
			if (this._request.readyState == 4) {
				  try {
						if (this._request.status != 200 && typeof this._options.onerror == 'function'){
							this._options.onerror(jindo.$Ajax.Response(this._request));
						}else{
							oResult = this._options.onload(jindo.$Ajax.Response(this._request));
						} 
				}finally{
					this._status--;
					if(typeof this._oncompleted == 'function'){
						this._oncompleted(bSuccess, oResult);
					} 
				}
			}
		}
	}
})(/MSIE/.test(window.navigator.userAgent));

/**
 * request 메서드는 ajax 요청을 전송한다. ajax 요청에 사용할 매개변수는 생성자에서 설정하거나 option 메서드에서 변경할 수 있다.  요청 타입이 'flash'이면 이 메소드를 실행하기 전에 body 태그 내부에서 $Ajax.SWFRequest.write() 명령어를 반드시 실행해야 한다.
 * @param {Object} oData 서버로 전송할 데이터.
 * @description [Lite]
 * @example
var ajax = $Ajax("http://www.remote.com", {
   onload : function(res) {
      // onload 핸들러
   }
});

ajax.request( {key1:"value1", key2:"value2"} );
 */
jindo.$Ajax.prototype.request = function(oData) {
	this._status++;
	var t   = this;
	var req = this._request;
	var opt = this._options;
	var data, v,a = [], data = "";
	var _timer = null;
	var url = this._url;
	this._is_abort = false;

	if( opt.postBody && opt.type.toUpperCase()=="XHR" && opt.method.toUpperCase()!="GET"){
		if(typeof oData == 'string'){
			data = oData;
		}else{
			data = jindo.$Json(oData).toString();	
		}	
	}else if (typeof oData == "undefined" || !oData) {
		data = null;
	} else {
		for(var k in oData) {
			if(oData.hasOwnProperty(k)){
				v = oData[k];
				if (typeof v == "function") v = v();
				
				if (v instanceof Array || v instanceof jindo.$A) {
					jindo.$A(v).forEach(function(value,index,array) {
						a[a.length] = k+"="+encodeURIComponent(value);
					});
				} else {
					a[a.length] = k+"="+encodeURIComponent(v);
				}
			}
		}
		data = a.join("&");
	}
	
	// XHR GET 방식 요청인 경우 URL에 파라미터 추가
	if(data && opt.type.toUpperCase()=="XHR" && opt.method.toUpperCase()=="GET"){
		if(url.indexOf('?')==-1){
			url += "?";
		} else {
			url += "&";			
		}
		url += data;
		data = null;
	}
	req.open(opt.method.toUpperCase(), url, opt.async);
	
	if (opt.sendheader) {
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
		req.setRequestHeader("charset", "utf-8");
		for (var x in this._headers) {
			if(this._headers.hasOwnProperty(x)){
				if (typeof this._headers[x] == "function") 
					continue;
				req.setRequestHeader(x, String(this._headers[x]));
			}
		}
	}
	
	if(req.addEventListener&&!(navigator.userAgent.indexOf("Opera") > -1)){
		// opera 10.60에서 XMLHttpRequest에 addEventListener기 추가되었지만 정상적으로 동작하지 않아 opera는 무조건 dom1방식으로 지원함.
		if(this._loadFunc){ req.removeEventListener("load", this._loadFunc, false); }
		this._loadFunc = function(rq){ clearTimeout(_timer); t._onload(rq) }
		req.addEventListener("load", this._loadFunc, false);
	}else{
		if (typeof req.onload != "undefined") {
			req.onload = function(rq){
				if(req.readyState == 4 && !t._is_abort){
					clearTimeout(_timer); 
					t._onload(rq);
				}
			};
		} else {
	//			IE6에서는 onreadystatechange가 동기적으로 실행되어 timeout이벤트가 발생안됨.
	//			그래서 interval로 체크하여 timeout이벤트가 정상적으로 발생되도록 수정. 비동기 방식일때만
			if(window.navigator.userAgent.match(/(?:MSIE) ([0-9.]+)/)[1]==6&&opt.async){
				var onreadystatechange = function(rq){

					if(req.readyState == 4 && !t._is_abort){
						if(_timer){
							clearTimeout(_timer);
						}
						t._onload(rq);
						clearInterval(t._interval);
					}
				};
				this._interval = setInterval(onreadystatechange,300);

			}else{
				req.onreadystatechange = function(rq){
					if(req.readyState == 4){
						clearTimeout(_timer); 
						t._onload(rq);
					}
				};
			}
		}
	}

	if (opt.timeout > 0) {
		_timer = setTimeout(function(){
			t._is_abort = true;
			if(t._interval){
				clearInterval(t._interval);
			}
			// req.onreadystatechange = null;
			try{ req.abort(); }catch(e){};

			opt.ontimeout(req);	
			if(typeof t._oncompleted == 'function') t._oncompleted(false);
		}, opt.timeout * 1000 );
	}
	// test을 하기 위한 url
	this._test_url = url;
	req.send(data);

	return this;
};

/**
 * isIdle 메서드는 ajax 객체가 현재 요청 대기 상태인지 반환한다.    
 * @return 현재 대기상태 여부 반환
 * @since 1.3.5
 * @description [Lite]
 * @example
 var ajax = $Ajax("http://www.remote.com",{
     onload : function(res){
         // onload 핸들러
     }
});

if(ajax.isIdle) ajax.request(); 
 
 */
jindo.$Ajax.prototype.isIdle = function(){
	return this._status==0;
}

/**
 * abort 메서드는 서버로 전송한 ajax 요청을 취소한다. abort 메서드를 사용하면 네트워크 연결을 닫으며 대기중이던 요청은 취소된다. ajax 요청의 응답이 너무 오래 걸려서 취소하고 싶을 경우 abort 메서드를 사용할 수 있다.
 * @return 전송을 취소한 $Ajax 객체
 * @description [Lite]
 * @example
var ajax = $Ajax("http://www.remote.com", {
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
		this._is_abort = true;
		this._request.abort();
	}finally{
		this._status--;
	}

	return this;
};


/**
 * option 메서드는 ajax 요청에서 사용할 매개변수를 가져오거나 설정한다.
 * 매개변수를 설정하려면 매개 변수의 이름과 값, 혹은 매개변수의 이름과 값을 원소로 가지는 하나의 객체를 인수로 사용한다.
 * 만약 여러 개의 원소를 가진 객체를 사용하면 두 개 이상의 매개변수를 한 번에 설정할 수 있다.
 * @param {string|object} name 매개변수로 설정할 객체, 혹은 가지고 올 매개변수의 이름
 * @param {String}  [value] 새로 설정할 매개변수의 값
 * @return {String|$Ajax}  매개변수 값을 가져올 때는 문자열을, 매개변수 값을 설정할 때는 $Ajax 객체를 리턴한다.
 * @description [Lite]
 * @example
var request_type = ajax.option("type");
// ajax의 type 매개변수 값을 리턴한다.

ajax.option("method", "post");
// ajax의 method 매개변수를 post로 초기화한다.

ajax.option( { timeout : 0, onload : handler_func } );
// ajax의 timeout, onload 매개변수를 각각 0와 handler_func로 초기화한다.
 */
jindo.$Ajax.prototype.option = function(name, value) {
	if (typeof name == "undefined") return "";
	if (typeof name == "string") {
		if (typeof value == "undefined") return this._options[name];
		this._options[name] = value;
		return this;
	}

	try { 
		for(var x in name){
			if(name.hasOwnProperty(x))
				this._options[x] = name[x]
		}  
	} catch(e) {};

	return this;
};

/**
 * header 메서드는 ajax 요청에서 사용할 HTTP 요청 헤더를 가져오거나 설정한다.
 * 헤더를 설정하려면 헤더의 이름과 값, 혹은 헤더의 이름과 값을 원소로 가지는 하나의 객체를 인수로 사용한다.
 * 만약 여러 개의 원소를 가진 객체를 사용하면 두 개 이상의 헤더를 한 번에 설정할 수 있다.
 * 매개 변수의 값을 가져오려면 단순히 가지고 올 매개변수의 이름을 지정한다.
 * @param {String} name 가지고 오거나 설정할 헤더 이름
 * @param {Value} [value] 값을 설정할 헤더 값
 * @return {String|$Ajax} 설정된 헤더값 혹은 $Ajax 객체
 * @description [Lite]
 * @example
var customheader = ajax.header("myHeader");
// HTTP 요청 헤더에서 myHeader의 값

ajax.header( "myHeader", "someValue" );
// HTTP 요청 헤더의 myHeader = someValue

ajax.header( { anotherHeader : "someValue2" } );
// HTTP 요청 헤더의 anotherHeader = someValue2
 */
jindo.$Ajax.prototype.header = function(name, value) {
	if (typeof name == "undefined") return "";
	if (typeof name == "string") {
		if (typeof value == "undefined") return this._headers[name];
		this._headers[name] = value;
		return this;
	}

	try { 
		for (var x in name) {
			if (name.hasOwnProperty(x)) 
				this._headers[x] = name[x]
		}	
			
			 
	} catch(e) {};

	return this;
};

/**
 * Ajax 응답 객체
 * @class
 * @constructor
 * @param {Object} req 요청 객체
 * @description [Lite]
 */
jindo.$Ajax.Response  = function(req) {
	if (this === jindo.$Ajax) return new jindo.$Ajax.Response(req);
	this._response = req;
};

/**
 * 응답을 XML 객체로 반환한다.
 * @return {Object} 응답 XML 객체. XHR의 responseXML과 유사하다.
 * @description [Lite]
 */
jindo.$Ajax.Response.prototype.xml = function() {
	return this._response.responseXML;
};

/**
 * 응답을 문자열로 반환한다.
 * @return {String} 응답 문자열. XHR의 responseText와 유사하다.
 * @description [Lite]
 */
jindo.$Ajax.Response.prototype.text = function() {
	return this._response.responseText;
};

/**
 * 응답코드를 반환한다.
 * @return {int} 응답 코드. http응답코드표 참고.
 * @description [Lite]
 */
jindo.$Ajax.Response.prototype.status = function() {
	return this._response.status;
};

/**
 * readyState를 반환한다.
 * @return {int}  readyState. 
 * @description [Lite]
 */
jindo.$Ajax.Response.prototype.readyState = function() {
	return this._response.readyState;
};

/**
 * 응답을 Json객체로 반환한다.
 * @return {Object} 응답 JSON 객체. 응답 문자열을 자동으로 JSON 객체로 변환 후 반환한다. 변환 과정에서 오류가 발생하면 빈 객체를 반환한다.
 * @description [Lite]
 */
jindo.$Ajax.Response.prototype.json = function() {
	if (this._response.responseJSON) {
		return this._response.responseJSON;
	} else if (this._response.responseText) {
		try {
			return eval("("+this._response.responseText+")");
		} catch(e) {
			return {};
		}
	}

	return {};
};

/**
 * 응답헤더를 가져온다. 인자를 전달하지 않으면 모든 헤더를 반환한다.
 * @param {String} name 가져올 응답헤더의 이름
 * @return {String|Object} 인자가 있을 때는 해당하는 헤더 값을, 그렇지 않으면 전체 헤더를 반환한다.
 * @description [Lite]
 */
jindo.$Ajax.Response.prototype.header = function(name) {
	if (typeof name == "string") return this._response.getResponseHeader(name);
	return this._response.getAllResponseHeaders();
};

/**
 * @fileOverview $Ajax의 확장 메서드를 정의한 파일
 * @name Ajax.extend.js
 */

/**
 * @class
 */
jindo.$Ajax.RequestBase = jindo.$Class({
	_respHeaderString : "",
	callbackid:"",
	callbackname:"",
	responseXML  : null,
	responseJSON : null,
	responseText : "",
	status : 404,
	readyState : 0,
	$init  : function(){},
	onload : function(){},
	abort  : function(){},
	open   : function(){},
	send   : function(){},
	setRequestHeader  : function(sName, sValue) {
		this._headers[sName] = sValue;
	},
	getResponseHeader : function(sName) {
		return this._respHeaders[sName] || "";
	},
	getAllResponseHeaders : function() {
		return this._respHeaderString;
	},
	_getCallbackInfo : function() {
		var id = "";

		if(this.callbackid!="") {
			var idx = 0;
			do {
				id = "_" + this.callbackid + "_"+idx;
				idx++;
			} while (window.__jindo2_callback[id]);	
		}else{
			do {
				id = "_" + Math.floor(Math.random() * 10000);
			} while (window.__jindo2_callback[id]);
		}
		if(this.callbackname == ""){
			this.callbackname = "_callback";
		}
			   
		return {callbackname:this.callbackname,id:id,name:"window.__jindo2_callback."+id};
	}
});

/**
 * @class
 */
jindo.$Ajax.JSONPRequest = jindo.$Class({
	_headers : {},
	_respHeaders : {},
	charset : "utf-8",
	_script : null,
	_onerror : null,
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
		this.responseJSON = null;
		this._url = url;
	},
	send  : function(data) {
		var t    = this;
		var info = this._getCallbackInfo();
		var head = document.getElementsByTagName("head")[0];
		this._script = jindo.$("<script>");
		this._script.type    = "text/javascript";
		this._script.charset = this.charset;

		if (head) {
			head.appendChild(this._script);
		} else if (document.body) {
			document.body.appendChild(this._script);
		}

		window.__jindo2_callback[info.id] = function(data){
			try {
				t.readyState = 4;
				t.status = 200;
				t._callback(data);
			} finally {
				delete window.__jindo2_callback[info.id];
			}
		};
		
		var agent = jindo.$Agent(); 
		if (agent.navigator().ie || agent.navigator().opera) {
			this._script.onreadystatechange = function(){			
				if (this.readyState == 'loaded'){
					if (!t.responseJSON) {
						t.readyState = 4;
						t.status = 500;
						t._onerror = setTimeout(function(){t._callback(null);}, 200);
					}
					this.onreadystatechange = null;
				}
			};
		} else {
			this._script.onload = function(){
				if (!t.responseJSON) {
					t.readyState = 4;
					t.status = 500;
					t._onerror = setTimeout(function(){t._callback(null);}, 200);
				}
				this.onload = null;
				this.onerror = null;
			};
			this._script.onerror = function(){
				if (!t.responseJSON) {
					t.readyState = 4;
					t.status = 404;
					t._onerror = setTimeout(function(){t._callback(null);}, 200);
				}
				this.onerror = null;
				this.onload = null;
			};
		}
		var delimiter = "&";
		if(this._url.indexOf('?')==-1){
			delimiter = "?";
		}
		if (data) {
			data = "&" + data;
		}else{
			data = "";
		}
		// test url for spec.
		this._test_url = this._url+delimiter+info.callbackname+"="+info.name+data;
		this._script.src = this._url+delimiter+info.callbackname+"="+info.name+data;
		
	}
}).extend(jindo.$Ajax.RequestBase);

/**
 * @class
 */
jindo.$Ajax.SWFRequest = jindo.$Class({
	_decode : true,
	_headers : {},
	_respHeaders : {},
	_callback : function(status, data, headers){
		this.readyState = 4;
		// 하위 호환을 위해 status가 boolean 값인 경우도 처리
		if( (typeof status).toLowerCase() == 'number'){
			this.status = status;
		}else{
			if(status==true) this.status=200;
		}		
		if (this.status==200) {
			if (typeof data == "string") {
				try {
					this.responseText = this._decode?decodeURIComponent(data):data;
					if(!this.responseText || this.responseText=="") {
						this.responseText = data;
					}	
				} catch(e) {
					//데이터 안에 utf-8이 아닌 다른 인코딩일때 디코딩을 안하고 바로 text에 저장.
					if(e.name == "URIError"){
						this.responseText = data;
						if(!this.responseText || this.responseText=="") {
							this.responseText = data;
						}
					}
				}
			}
			// 콜백코드는 넣었지만, 아직 SWF에서 응답헤더 지원 안함
			if(typeof headers == "object"){
				this._respHeaders = headers;				
			}
		}
		
		this.onload(this);
	},
	open : function(method, url) {
		var re  = /https?:\/\/([a-z0-9_\-\.]+)/i;

		this._url    = url;
		this._method = method;
	},
	send : function(data) {
		this.responseXML  = false;
		this.responseText = "";

		var t    = this;
		var dat  = {};
		var info = this._getCallbackInfo();
		var swf  = window.document[jindo.$Ajax.SWFRequest._tmpId];

		function f(arg) {
			switch(typeof arg){
				case "string":
					return '"'+arg.replace(/\"/g, '\\"')+'"';
					break;
				case "number":
					return arg;
					break;
				case "object":
					var ret = "", arr = [];
					if (arg instanceof Array) {
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

		data = (data || "").split("&");

		for(var i=0; i < data.length; i++) {
			pos = data[i].indexOf("=");
			key = data[i].substring(0,pos);
			val = data[i].substring(pos+1);

			dat[key] = decodeURIComponent(val);
		}

		window.__jindo2_callback[info.id] = function(success, data){
			try {
				t._callback(success, data);
			} finally {
				delete window.__jindo2_callback[info.id];
			}
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
	}
}).extend(jindo.$Ajax.RequestBase);

/**
 * $Ajax.SWFRequest.write는 요청 타입이 flash일 때, request 메소드가 호출되기 전 반드시 한 번 실행해야 한다(두 번 이상 실행해도 문제가 발생한다). 이 명령어가 호출되면 통신을 위한 swf 객체를 문서 내에 추가된다.
 * @param {String} [swf_path] 통신을 담당할 swf 파일의 경로. 기본값은 "./ajax.swf" 이다.
 */
jindo.$Ajax.SWFRequest.write = function(swf_path) {
	if(typeof swf_path == "undefined") swf_path = "./ajax.swf";
	jindo.$Ajax.SWFRequest._tmpId = 'tmpSwf'+(new Date).getMilliseconds()+Math.floor(Math.random()*100000);

	document.write('<div style="position:absolute;top:-1000px;left:-1000px"><object id="'+jindo.$Ajax.SWFRequest._tmpId+'" width="1" height="1" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"><param name="movie" value="'+swf_path+'"><param name = "allowScriptAccess" value = "always" /><embed name="'+jindo.$Ajax.SWFRequest._tmpId+'" src="'+swf_path+'" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" width="1" height="1" allowScriptAccess="always" swLiveConnect="true"></embed></object></div>');
};

/**
 * flash가 로딩 되었는지 확인 하는 변수.
 */
jindo.$Ajax.SWFRequest.activeFlash = false;

/**
 * flash에서 로딩 후 실행 시키는 함수.
 * @ignore
 */
jindo.$Ajax.SWFRequest.loaded = function(){
	jindo.$Ajax.SWFRequest.activeFlash = true;
}

/**
 * @class
 */
jindo.$Ajax.FrameRequest = jindo.$Class({
	_headers : {},
	_respHeaders : {},
	_frame  : null,
	_proxy  : "",
	_domain : "",
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

		setTimeout(function(){ self.abort() }, 10);
	},
	abort : function() {
		if (this._frame) {
			try {
				this._frame.parentNode.removeChild(this._frame);
			} catch(e) {
			}
		}
	},
	open : function(method, url) {
		var re  = /https?:\/\/([a-z0-9_\-\.]+)/i;
		var dom = document.location.toString().match(re);

		this._method = method;
		this._url    = url;
		this._remote = String(url).match(/(https?:\/\/[a-z0-9_\-\.]+)(:[0-9]+)?/i)[0];
		this._frame = null;
		this._domain = (dom[1] != document.domain)?document.domain:"";
	},
	send : function(data) {
		this.responseXML  = "";
		this.responseText = "";

		var t      = this;
		var re     = /https?:\/\/([a-z0-9_\-\.]+)/i;
		var info   = this._getCallbackInfo();
		var url;
		var _aStr = [];
		_aStr.push(this._remote+"/ajax_remote_callback.html?method="+this._method);
		var header = new Array;

		window.__jindo2_callback[info.id] = function(id, data, header){
			try {
				t._callback(id, data, header);
			} finally {
				delete window.__jindo2_callback[info.id];
			}
		};

		for(var x in this._headers) {
			if(this._headers.hasOwnProperty(x)){
				header[header.length] = "'"+x+"':'"+this._headers[x]+"'";	
			}
			
		}

		header = "{"+header.join(",")+"}";
		
		
		_aStr.push("&id="+info.id);
		_aStr.push("&header="+encodeURIComponent(header));
		_aStr.push("&proxy="+encodeURIComponent(this._proxy));
		_aStr.push("&domain="+this._domain);
		_aStr.push("&url="+encodeURIComponent(this._url.replace(re, "")));
		_aStr.push("#"+encodeURIComponent(data));

		var fr = this._frame = jindo.$("<iframe>");
		fr.style.position = "absolute";
		fr.style.visibility = "hidden";
		fr.style.width = "1px";
		fr.style.height = "1px";

		var body = document.body || document.documentElement;
		if (body.firstChild){ 
			body.insertBefore(fr, body.firstChild);
		}else{ 
			body.appendChild(fr);
		}
		fr.src = _aStr.join("");
	}
}).extend(jindo.$Ajax.RequestBase);


/**
 * $Ajax 객체를 순서대로 호출할 수 있는 기능을 제공한다.
 * @class $Ajax.Queue는 ajax 요청을 순서대로 처리할 수 있게 지원한다.
 * @since 1.3.7 
 * @constructor
 */
jindo.$Ajax.Queue = function (option) {
	var cl = arguments.callee;
	if (!(this instanceof cl)){ return new cl(option);}
	
	this._options = {
		async : false,
		useResultAsParam : false,
		stopOnFailure : false
	};

	this.option(option);
	
	this._queue = [];	
}

/**
 * $Ajax.Queue 의 옵션을 설정한다.
 * @param {Object} name
 * @param {Object} value
 */
jindo.$Ajax.Queue.prototype.option = function(name, value) {
	if (typeof name == "undefined"){ return "";}
	if (typeof name == "string") {
		if (typeof value == "undefined"){ return this._options[name];}
		this._options[name] = value;
		return this;
	}

	try { 
		for(var x in name) {
			if(name.hasOwnProperty(x))
				this._options[x] = name[x] 
		}
	} catch(e) {
	};

	return this;
};

/**
 * Ajax Queue에 요청을 추가한다.
 * @param {$Ajax} 추가할 Ajax객체
 * @param {Object} 요청시 전송할 파라미터 객체
 */
jindo.$Ajax.Queue.prototype.add = function (oAjax, oParam) {
	this._queue.push({obj:oAjax, param:oParam});
}

/**
 * Ajax Queue를 요청한다.
 */
jindo.$Ajax.Queue.prototype.request = function () {
	if(this.option('async')){
		this._requestAsync();
	} else {
		this._requestSync(0);
	}
}

jindo.$Ajax.Queue.prototype._requestSync = function (nIdx, oParam) {
	var t = this;
	if (this._queue.length > nIdx+1) {
		this._queue[nIdx].obj._oncompleted = function(bSuccess, oResult){
			if(!t.option('stopOnFailure') || bSuccess) t._requestSync(nIdx + 1, oResult);
		};
	}
	var _oParam = this._queue[nIdx].param||{};
	if(this.option('useResultAsParam') && oParam){
		try { for(var x in oParam) if(typeof _oParam[x] == 'undefined' && oParam.hasOwnProperty(x)) _oParam[x] = oParam[x] } catch(e) {};		
	}
	this._queue[nIdx].obj.request(_oParam);
}

jindo.$Ajax.Queue.prototype._requestAsync = function () {
	for( var i=0; i<this._queue.length; i++)
		this._queue[i].obj.request(this._queue[i].param);
}
/**
 * @fileOverview $H의 생성자 및 메서드를 정의한 파일
 * @name hash.js
 */
 
/**
 * $H 해시 객체를 리턴한다
 * @class $H 클래스는 키와 값을 원소로 가지는 열거형 배열인 해시를 구현하고, 해시를 다루기 위한 여러 가지 위한 메서드를 제공한다.  
 * @param {Object} hashObject 해시로 만들 객체.
 * @return {$H} 해시 객체
 * @constructor
 * @example
var h = $H({one:"first", two:"second", three:"third"})
 * @author Kim, Taegon
 */
jindo.$H = function(hashObject) {
	var cl = arguments.callee;
	if (typeof hashObject == "undefined") hashObject = new Object;
	if (hashObject instanceof cl) return hashObject;
	if (!(this instanceof cl)) return new cl(hashObject);

	this._table = {};
	for(var k in hashObject) {
		if(hashObject.hasOwnProperty(k)){
			if (this._table[k] == hashObject[k]) continue;
			this._table[k] = hashObject[k];	
		}
	}
};

/**
 * $value 메서드는 해싱 대상인 객체를 반환한다.
 * @return {Object} 해싱 대상 객체
 */
jindo.$H.prototype.$value = function() {
	return this._table;
};

/**
 * $ 메서드는 키와 값을 설정하거나 키에 해당하는 값을 반환한다.
 * @param {String} key 키
 * @param {void} [value] 값
 * @return {void|$H} 키에 해당하는 값 혹은 $H 객체
 * @example
 * var hash = $H({one:"first", two:"second"});
 *
 * // 값을 설정할 때
 * hash.$("three", "third");
 * 
 * // hash => {one:"first", two:"second", three:"third"}
 *
 * // 값을 반환할 때
 * var three = hash.$("three");
 *
 * // three => "third"
 */
jindo.$H.prototype.$ = function(key, value) {
	if (typeof value == "undefined") {
		return this._table[key];
	} 

	this._table[key] = value;
	return this;
};

/**
 * length 메서드는 해시 객체의 크기를 반환한다.
 * @return {Number} 해시의 크기
 */
jindo.$H.prototype.length = function() {
	var i = 0;
	for(var k in this._table) {
		if(this._table.hasOwnProperty(k)){
			if (typeof Object.prototype[k] != "undeifned" && Object.prototype[k] === this._table[k]) continue;
			i++;
		}
	}

	return i;
};

/**
 * forEach 메서드는 해시 객체의 키와 값을 인수로 지정한 콜백 함수를 실행한다.
 * @param {Function} callback 실행할 콜백 함수 
 * @param {Object} thisObject 콜백 함수의 this
 * @example
function printIt(value, key) {
   document.write(key+" => "+value+" <br>");
}
$H({one:"first", two:"second", three:"third"}).forEach(printIt);
 */
jindo.$H.prototype.forEach = function(callback, thisObject) {
	var t = this._table;
	var h = this.constructor;
	
	for(var k in t) {
		if (t.hasOwnProperty(k)) {
			if (!t.propertyIsEnumerable(k)) continue;
			try {
				callback.call(thisObject, t[k], k, t);
			} catch(e) {
				if (e instanceof h.Break) break;
				if (e instanceof h.Continue) continue;
				throw e;
			}
		}
	}
	return this;
};

/**
 * filter 메서드는 해시 객체에서 필터 콜백 함수를 만족하는 원소를 수집한다. 수집한 원소는 새로운 $H 객체의 원소가 된다.
 * 콜백함수는 Boolean 값을 반환해야 한다.
 * @param {Function} callback 필터 콜백 함수 
 * @param {Object} thisObject 콜백 함수의 this
 * @return {$H} 수집한 원소로 새로 만든 해시 객체
 * @remark 필터 콜백 함수의 결과가 true인 원소만 수집한다. 콜백 함수는 형식은 예제를 참고한다.
 * @example
function callback(value, key, object) {
   // value    해시의 값 
   // key      해시의 고유한 키 혹은 이름
   // object   JavaScript Core Object 객체
}
 */
jindo.$H.prototype.filter = function(callback, thisObject) {
	var h = jindo.$H();
	this.forEach(function(v,k,o) {
		if(callback.call(thisObject, v, k, o) === true) {
			h.add(k,v);
		}
	});
	return h;
};

/**
 * map 메서드는 해시 객체의 원소를 인수로 콜백 함수를 실행하고, 함수의 리턴 값을 해당 원소의 값으로 지정한다.
 * @param {Function} callback 콜백 함수
 * @param {Object} thisObject 콜백 함수의 this
 * @return {$H} 값을 변경한 해시 객체
 * @remark 콜백 함수는 형식은 예제를 참고한다.
 * @example
function callback(value, key, object ) {
   // value    해시의 값 
   // key      해시의 고유한 키 혹은 이름
   // object   JavaScript Core Object 객체
 
   var r = key+"_"+value;
   document.writeln (r + "<br />"); 
   return r;
}
$H({one:"first", two:"second", three:"third"}).map(callback);
 */
jindo.$H.prototype.map = function(callback, thisObject) {
	var t = this._table;
	this.forEach(function(v,k,o) {
		t[k] = callback.call(thisObject, v, k, o);
	});
	return this;
};

/**
 * 해시 테이블에 값을 추가한다.
 * @param {String} key 추가한 값을 위한 키 
 * @param {String} value 해시 테이블에 추가할 값
 * @return {$H} 값을 추가한 해시 객체
 */
jindo.$H.prototype.add = function(key, value) {
	//if (this.hasKey(key)) return null;
	this._table[key] = value;

	return this;
};

/**
 * remove 메서드는 해시 테이블의 원소를 제거한다.
 * @param {String} key 제거할 원소의 키
 * @return {void} 제거한 키 값
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.remove ("two");
// h의 해시 테이블은 {one:"first", three:"third"}
 */
jindo.$H.prototype.remove = function(key) {
	if (typeof this._table[key] == "undefined") return null;
	var val = this._table[key];
	delete this._table[key];
	
	return val;
};

/**
 * search 메서드는 해시 테이블에서 인수로 지정한 값을 찾는다.
 * @param {String} value 검색할 값
 * @returns {String | Boolean} 값을 찾았다면 값에 대한 키. 값을 찾지 못했다면 false. 
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.search ("second");
// two

h.search ("fist");
// false
 */
jindo.$H.prototype.search = function(value) {
	var result = false;
	this.forEach(function(v,k,o) {
		if (v === value) {
			result = k;
			jindo.$H.Break();
		}
	});
	return result;
};

/**
 * hasKey 메서드는 해시 테이블에 인수로 지정한 키가 있는지 찾는다.
 * @param {String} key 해시 테이블에서 검색할 키
 * @return {Boolean} 키의 존재 여부
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.hasKey("four"); // false
h.hasKey("one"); // true
 */
jindo.$H.prototype.hasKey = function(key) {
	var result = false;
	
	return (typeof this._table[key] != "undefined");
};

/**
 * hasValue 메서드는 해시 테이블에 인수로 지정한 값이 있는지 확인한다.
 * @param {String} value 해시 테이블에서 검색할 값
 * @return {Boolean} 값의 존재 여부
 */
jindo.$H.prototype.hasValue = function(value) {
	return (this.search(value) !== false);
};

/**
 * sort 메서드는 값을 기준으로 원소를 오름차순 정렬한다.
 * @return {$H} 원소를 정렬한 해시 객체.
 * @see $H#ksort
 * @example
var h = $H({one:"하나", two:"둘", three:"셋"});
h.sort ();
// {two:"둘", three:"셋", one:"하나"}
 */
jindo.$H.prototype.sort = function() {
	var o = new Object;
	var a = this.values();
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

/**
 * ksort 메서드는 키를 기준으로 원소를 오름차순 정렬한다. 
 * @return {$H} 원소를 정렬한 해시 객체
 * @see $H#sort
 * @example
var h = $H({one:"하나", two:"둘", three:"셋"});
h.sort ();
// h => {one:"하나", three:"셋", two:"둘"}
 */
jindo.$H.prototype.ksort = function() {
	var o = new Object;
	var a = this.keys();

	a.sort();

	for(var i=0; i < a.length; i++) {
		o[a[i]] = this._table[a[i]];
	}

	this._table = o;

	return this;
};

/**
 * keys 메서드는 해시 키의 배열을 반환한다.
 * @return {Array} 해시 키의 배열
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.keys ();
// ["one", "two", "three"]
 * @see $H#values
 */
jindo.$H.prototype.keys = function() {
	var keys = new Array;
	for(var k in this._table) {
		if(this._table.hasOwnProperty(k))
			keys.push(k);
	}

	return keys;
};

/**
 * values 메서드는 해시 값의 배열을 반환한다.
 * @return {Array} 해시 값의 배열
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.values();
// ["first", "second", "third"]
 * @see $H#keys
 */
jindo.$H.prototype.values = function() {
	var values = [];
	for(var k in this._table) {
		if(this._table.hasOwnProperty(k))
			values[values.length] = this._table[k];
	}

	return values;
};

/**
 * toQueryString은 해시 객체를 쿼리 스트링 형태로 만든다.
 * @return {String} 
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.toQueryString();
// "one=first&two=second&three=third"
 */
jindo.$H.prototype.toQueryString = function() {
	var buf = [], val = null, idx = 0;
	for(var k in this._table) {
		if (this._table.hasOwnProperty(k)) {
			if (typeof(val = this._table[k]) == "object" && val.constructor == Array) {
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

/**
 * empty는 해시 객체를 빈 객체로 만든다.
 * @return {$H} 비워진 해시 객체
 * @example
var hash = $H({a:1, b:2, c:3});
// hash => {a:1, b:2, c:3}

hash.empty();
// hash => {}
 */
jindo.$H.prototype.empty = function() {
	var keys = this.keys();

	for(var i=0; i < keys.length; i++) {
		delete this._table[keys[i]];
	}

	return this;
};

/**
 * Break 메서드는 반복문의 실행을 중단할 때 사용한다.
 * @remark forEach, filter, map와 같은 루프를 중단한다. 강제로 exception을 발생시키므로 try ~ catch 영역에서 이 메소드를 실행하면 정상적으로 동작하지 않을 수 있다.
 * @example
$H({a:1, b:2, c:3}).forEach(function(v,k,o) {
   ...
   if (k == "b") $H.Break();
   ...
});
 * @see $H.Continue
 */
jindo.$H.Break = function() {
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};

/**
 * Continue 메서드는 루프를 실행하다 다음 단계로 넘어갈 때 사용한다. 
 * @remark forEach, filter, map와 같은 루프 실행 도중에 현재 루프를 중단하고 다음으로 넘어간다. 강제로 exception을 발생시키므로 try ~ catch 영역에서 이 메소드를 실행하면 정상적으로 동작하지 않을 수 있다.
 * @example
$H({a:1, b:2, c:3}).forEach(function(v,k,o) {
   ...
   if (v % 2 == 0) $H.Continue();
   ...
});
 * @see $H.Break
 */
jindo.$H.Continue = function() {
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};

/**
 * @fileOverview $Json의 생성자 및 메서드를 정의한 파일
 * @name json.js
 */

/**
 * $Json 객체를 반환한다.
 * @class $Json 객체는 Javascipt에서 JSON(JavaScript Object Notation)을 다루기 위한 다양한 메서드를 제공한다.
 * @param {Object | String} sObject 객체, 혹은 JSON으로 인코딩 가능한 문자열.
 * @return {$Json} 인수를 인코딩한 $Json 객체.
 * @remark XML 문자를 사용하여 $Json 객체를 생성하려면 $Json#fromXML 메서드를 사용한다.
 * @example 
var oStr = $Json ('{ zoo: "myFirstZoo", tiger: 3, zebra: 2}');

var d = {name : 'nhn', location: 'Bundang-gu'}
var oObj = $Json (d);

 * @constructor
 * @author Kim, Taegon
 */
jindo.$Json = function (sObject) {
	var cl = arguments.callee;
	if (typeof sObject == "undefined") sObject = new Object;
	if (sObject instanceof cl) return sObject;
	if (!(this instanceof cl)) return new cl(sObject);
	
	if (typeof sObject == "string") {
			try {
			//sObject = new Function("return "+sObject)();
			if(/^(?:\s*)[\{\[]/.test(sObject)){
				sObject = eval("("+sObject+")");
			}else{
				sObject = sObject;
			}
			
		} catch(e) {
			sObject = new Object;
		}
	}

	this._object = sObject;
}

/**
 * fromXML 메서드는 XML 문자열을 $Json 객체로 인코딩한다.
 * @param {String} sXML $Json  객체로 인코딩할 XML 문자열 
 * @returns {Object} $Json 객체
 * @remark 속성과 CDATA를 가지는 태그는 CDATA를 '$cdata' 속성과 값으로 인코딩한다.  
 * @example
var j1 = $Json.fromXML('<data>only string</data>');
// {"data":"only string"}

var j2 = $Json.fromXML('<data><id>Faqh%$</id><str attr="123">string value</str></data>');
{"data":{"id":"Faqh%$","str":{"attr":"123","$cdata":"string value"}}} 
  */
jindo.$Json.fromXML = function(sXML) {
	var o  = new Object;
	var re = /\s*<(\/?[\w:\-]+)((?:\s+[\w:\-]+\s*=\s*(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'))*)\s*((?:\/>)|(?:><\/\1>|\s*))|\s*<!\[CDATA\[([\w\W]*?)\]\]>\s*|\s*>?([^<]*)/ig;
	var re2= /^[0-9]+(?:\.[0-9]+)?$/;
	var ec = {"&amp;":"&","&nbsp;":" ","&quot;":"\"","&lt;":"<","&gt;":">"};
	var fg = {tags:["/"],stack:[o]};
	var es = function(s){ 
		if (typeof s == "undefined") return "";
		return  s.replace(/&[a-z]+;/g, function(m){ return (typeof ec[m] == "string")?ec[m]:m; })
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
	
	// $0 : 전체 
	// $1 : 태그명
	// $2 : 속성문자열
	// $3 : 닫는태그
	// $4 : CDATA바디값
	// $5 : 그냥 바디값 
	var cb = function($0,$1,$2,$3,$4,$5) {
		var cur, cdata = "";
		var idx = fg.stack.length - 1;
		
		if (typeof $1 == "string" && $1) {
			if ($1.substr(0,1) != "/") {
				var has_attr = (typeof $2 == "string" && $2);
				var closed   = (typeof $3 == "string" && $3);
				var newobj   = (!has_attr && closed)?"":{};

				cur = fg.stack[idx];
				
				if (typeof cur[$1] == "undefined") {
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
		} else if (typeof $4 == "string" && $4) {
			cdata = $4;
		} else if (typeof $5 == "string" && $5) {
			cdata = es($5);
		}
		
		if (cdata.length > 0) {
			var par = fg.stack[idx-1];
			var tag = fg.tags[idx];

			if (re2.test(cdata)) {
				cdata = parseFloat(cdata);
			}else if (cdata == "true" || cdata == "false"){
				cdata = new Boolean(cdata);
			}

			if(typeof par =='undefined') return;
			
			if (par[tag] instanceof Array) {
				var o = par[tag];
				if (typeof o[o.length-1] == "object" && !em(o[o.length-1])) {
					o[o.length-1].$cdata = cdata;
					o[o.length-1].toString = function(){ return cdata; }
				} else {
					o[o.length-1] = cdata;
				}
			} else {
				if (typeof par[tag] == "object" && !em(par[tag])) {
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

/**
 * get 메서드는 $Json 객체의 값을 path 형태로 리턴한다.
 * @param {String} sPath path 문자열
 * @return {Array} 객체의 배열
 * @example
var j = $Json.fromXML('<data><id>Faqh%$</id><str attr="123">string value</str></data>');
var r = j.get ("/data/id");
// Faqh%$

 */
jindo.$Json.prototype.get = function(sPath) {
	var o = this._object;
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
				if (typeof e == "undefined") continue;
				if (e instanceof Array) {
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

/**
 * toString 메서드는 $Json 객체를 JSON 문자열로 변환한다.
 * @return {String} JSON 문자열
 * @example
var j = $Json({foo:1, bar: 31});
document.write (j.toString());
document.write (j);

 */
jindo.$Json.prototype.toString = function() {
	var func = {
		$ : function($) {
			if (typeof $ == "object" && $ == null) return 'null';
			if (typeof $ == "undefined") return '""';
			if (typeof $ == "boolean") return $?"true":"false";
			if (typeof $ == "string") return this.s($);
			if (typeof $ == "number") return $;
			if ($ instanceof Array) return this.a($);
			if ($ instanceof Object) return this.o($);
		},
		s : function(s) {
			var e = {'"':'\\"',"\\":"\\\\","\n":"\\n","\r":"\\r","\t":"\\t"};
			var c = function(m){ return (typeof e[m] != "undefined")?e[m]:m };
			return '"'+s.replace(/[\\"'\n\r\t]/g, c)+'"';
		},
		a : function(a) {
			// a = a.sort();
			var s = "[",c = "",n=a.length;
			for(var i=0; i < n; i++) {
				if (typeof a[i] == "function") continue;
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
					if (typeof o[x] == "function") continue;
					s += c+this.s(x)+":"+this.$(o[x]);
					if (!c) c = ",";
				}
			}
			return s+"}";
		}
	}

	return func.$(this._object);
};

/**
 * toXML 메서드는 $Json 객체를 XML 문자열로 변환한다.
 * @return {String} XML 문자열
 * @example
var json = $Json({foo:1, bar: 31});
json.toXML();
// <foo>1</foo><bar>31</bar>
 */
jindo.$Json.prototype.toXML = function() {
	var f = function($,tag) {
		var t = function(s,at) { return "<"+tag+(at||"")+">"+s+"</"+tag+">" };
		
		switch (typeof $) {
			case "undefined":
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
	
	return f(this._object, "");
};

/**
 * toObject 메서드는 $Json 객체 내부의 JSON 데이터 객체를 반환한다.
 * @return {Object} 데이터 객체
 * @example
var json = $Json({foo:1, bar: 31});
json.toObject();
// {foo: 1, bar: 31}
 */
jindo.$Json.prototype.toObject = function() {
	return this._object;
};

/**
 * compare 메서드는 json객체 끼리 값이 같은지 비교를 한다. (1.4.4부터 사용가능.)
 * @return {Boolean} 불린값.
 * @example
$Json({foo:1, bar: 31}).compare({foo:1, bar: 31});
-> true
$Json({foo:1, bar: 31}).compare({foo:1, bar: 1});
-> false
 */
jindo.$Json.prototype.compare = function(oData){
	return this.toString() == jindo.$Json(oData).toString();
}

/**
 * $value 메서드는 $Json.toObject의 별칭(Alias)이다. 
 * @return {Object} 데이터 객체
 */
jindo.$Json.prototype.$value = jindo.$Json.prototype.toObject;


/**
 * @fileOverview $Cookie의 생성자 및 메서드를 정의한 파일
 * @name cookie.js
 */

/**
 * $Cookie 객체를 생성한다.
 * @class $Cookie 클래스는 쿠키(Cookie)를 추가, 수정, 혹은 삭제하거나 쿠키의 값을 가져온다.
 * @constructor
 * @author Kim, Taegon
 * @example 
var cookie = $Cookie();
cookie.set("session_id", "eac312d1d51ab", 1);

document.write (cookie.keys());
 */
jindo.$Cookie = function() {
	var cl = arguments.callee;
	var cached = cl._cached;
	
	if (cl._cached) return cl._cached;
	if (!(this instanceof cl)) return new cl;
	if (typeof cl._cached == "undefined") cl._cached = this;
};

/**
 * 쿠키 이름의 배열을 반환한다.
 * @return {Array} 쿠키 이름의 배열
 */
jindo.$Cookie.prototype.keys = function() {
	var ca = document.cookie.split(";");
	var re = /^\s+|\s+$/g;
	var a  = new Array;
	
	for(var i=0; i < ca.length; i++) {
		a[a.length] = ca[i].substr(0,ca[i].indexOf("=")).replace(re, "");
	}
	
	return a;
};

/**
 * 이름에 해당하는 쿠키 값을 가져온다. 값이 존재하지 않는다면 null을 반환한다.
 * @param {String} sName 쿠키 이름
 * @return {String} 쿠키 값
 * @example 
var cookie = $Cookie();
cookie.set("session_id", "eac312d1d51ab", 1);

// ...

document.write (cookie.get ("session_id"));
 */
jindo.$Cookie.prototype.get = function(sName) {
	var ca = document.cookie.split(/\s*;\s*/);
	var re = new RegExp("^(\\s*"+sName+"\\s*=)");
	
	for(var i=0; i < ca.length; i++) {
		if (re.test(ca[i])) return unescape(ca[i].substr(RegExp.$1.length));
	}
	
	return null;
};

/**
 * 이름에 해당하는 쿠키 값을 설정한다.
 * @param {String} sName 쿠키 이름.
 * @param {String} sValue 쿠키 값.
 * @param {Number} [nDays] 쿠키 유효 시간. 유효 시간은 일단위로 설정한다. 유효시간을 생략했다면 쿠키는 웹 브라우저가 종료되면서 없어진다.
 * @param {String} [sDomain] 쿠키 도메인.
 * @param {String} [sPath] 쿠키 패스.
 * @return {$Cookie} $Cookie 객체
 */
jindo.$Cookie.prototype.set = function(sName, sValue, nDays, sDomain, sPath) {
	var sExpire = "";
	
	if (typeof nDays == "number") {
		sExpire = ";expires="+(new Date((new Date()).getTime()+nDays*1000*60*60*24)).toGMTString();
	}
	if (typeof sDomain == "undefined") sDomain = "";
	if (typeof sPath == "undefined") sPath = "/";
	
	document.cookie = sName+"="+escape(sValue)+sExpire+"; path="+sPath+(sDomain?"; domain="+sDomain:"");
	
	return this;
};

/**
 * 이름에 해당하는 쿠키 값을 제거한다.
 * @param {String} sName 쿠키 이름
 * @return {$Cookie} $Cookie 객체
 */
jindo.$Cookie.prototype.remove = function(sName, sDomain, sPath) {
	if (this.get(sName) != null) this.set(sName, "", -1, sDomain, sPath);
	
	return this;
};

/**
 * @fileOverview $Element의 생성자 및 메서드를 정의한 파일
 * @name element.js
 */

/**
 * $Element 객체를 생성 및 리턴한다.
 * @class $Element 클래스는 DOM 엘리먼트를 다루기 위한 여러 가지 메서드를 제공한다.
 * @param {Element | String} el	$Element를 사용할 DOM 엘리먼트, 혹은 DOM 엘리먼트의 고유한 id. 만약 고유하지 않은 id를 지정하면 가장 먼저 나오는 엘리먼트를 반환한다.
 * @constructor
 * @description [Lite]
 * @author Kim, Taegon
 */
jindo.$Element = function(el) {
	var cl = arguments.callee;
	if (el && el instanceof cl) return el;
	if (el===null || typeof el == "undefined" || !jindo.$(el)) return null;
	if (!(this instanceof cl)) return new cl(el);
	
	this._element = (typeof el == "string") ? jindo.$(el) : el;
	var tag = this._element.tagName;		
	// tagname
	this.tag = (typeof tag!='undefined')?tag.toLowerCase():''; 

}
/**
 *	agent의 dependency를 없에기 위해 별로도 설정.
 *	@ignore
 **/
var _j_ag = navigator.userAgent;
var IS_IE = _j_ag.indexOf("MSIE") > -1;
var IS_FF = _j_ag.indexOf("Firefox") > -1;
var IS_OP = _j_ag.indexOf("Opera") > -1;
var IS_SF = _j_ag.indexOf("Apple") > -1;
var IS_CH = _j_ag.indexOf("Chrome") > -1;

/**
 * $value 메서드는 래핑된 원래의 DOM 엘리먼트를 리턴한다.
 * @return {HTMLElement} DOM 엘리먼트
 * @description [Lite]
 */
jindo.$Element.prototype.$value = function() {
	return this._element;
};

/**
 * visible 메서드는 DOM 엘리먼트의 CSS의 display 속성을 조사해서 엘리먼트가 보이는 상태인지 확인한다.
 * @param {Boolean} bVisible 엘리먼트를 보이거나 안 보이게 설정한다. true면 show() 메서드를, false면 hide() 메서드를 실행하는 것과 동일한 결과를 얻는다.
 * @param {String} sDisplay display타입
 * @return {Boolean|$Element} display 속성이 none이면 false 를, 그 외의 값이면 true를 리턴한다. 설정하게 되면 현재의 this 객체를 반환한다.
 * @description [Lite]
 * @since 설정 기능은 1.1.2부터
 * @since 1.4.5부터 visible에  true 파라메터 가질 경우 두번재 인자로 display 셋팅 할 값을 설정할 수 있다.
 */
jindo.$Element.prototype.visible = function(bVisible, sDisplay) {
	if (typeof bVisible != "undefined") {
		this[bVisible?"show":"hide"](sDisplay);
		return this;
	}

	return (this.css("display") != "none");
};

/**
 * show 메서드는 DOM 엘리먼트가 화면에 보이도록 CSS의 display 속성을 변경한다.
 * @param {String} sDisplay display타입 
 * @return {$Element} display 속성을 변경한 $Element 객체.
 * @description [Lite]
 * @see $Element#hide
 * @since 1.4.5부터 show할때 show타입을 지정할수 있음. 일반적으로 각 테그에 받는 display속성을 넣지만 일반적이지 않는 경우에는 직접 값을 지정할 수 있다.
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
		// IE에서 sDisplay값이 비정상적일때 block로 셋팅한다.
		s.display = "block";
	}

	return this;
};

/**
 * hide 메서드는 DOM 엘리먼트가 화면에 보이지 않도록 CSS의 display 속성을 none으로 변경한다.
 * @returns {Object} this	display 속성을 변경한 $Element 객체.
 * @see $Element#show
 * @description [Lite]
 */
jindo.$Element.prototype.hide = function() {
	this._element.style.display = "none";

	return this;
};

/**
 * toggle 메서드는 CSS의 Display 속성을 변경하여 DOM 엘리먼트를 화면에 보이거나 보이지 않게 한다.
 * @param {String} sDisplay display타입 
 * @returns {Object} this display 속성을 변경한 $Element 객체.
 * @see $Element#show
 * @see $Element#hide
 * @description [Lite]
 * @since 1.4.5부터 toggle시에 show인 경우 파라메터에 값을 넣으면 display에 셋팅이 가능하다.
 * @example

var isOpen 	= e.toggle().visible();
var bullet	= (isOpen) ? '-' : '+';

 */
jindo.$Element.prototype.toggle = function(sDisplay) {
	this[this.visible()?"hide":"show"](sDisplay);

	return this;
};

/**
 * opacity 메서드는 DOM 엘리먼트의 투명도 값을 리턴하거나 설정한다.
 * @param {Number} value	설정할 투명도 값. 투명도 값은 0 ~ 1 사이의 실수값으로 정한다. 값이 0보다 작으면 0을, 1보다 크면 1을 설정한다.
 * @return {Number} DOM 엘리먼트의 투명도 값.
 * @description [Lite]
 */
jindo.$Element.prototype.opacity = function(value) {

	var v,e = this._element,b= (this._getCss(e,"display") != "none");
	
	value = parseFloat(value);
	var filter = e.filters;
	if (!isNaN(value)) {
		value = Math.max(Math.min(value,1),0);
		
		if (typeof filter != "undefined") {
			value = Math.ceil(value*100);
			
			if (typeof filter != 'unknown' && typeof filter.alpha != "undefined") {
				filter.alpha.opacity = value;
			} else {
				e.style.filter = (e.style.filter + " alpha(opacity=" + value + ")");
			}		
		} else {
			e.style.opacity = value;
		}

		return value;
	}

	if (typeof filter != "undefined") {
		v = (typeof filter.alpha == "undefined")?(b?100:0):filter.alpha.opacity;
		v = v / 100;
	} else {
		v = parseFloat(e.style.opacity);
		if (isNaN(v)) v = b?1:0;
	}

	return v;
};

/**
 * css 메서드는 DOM 엘리먼트의 CSS 속성값을 가져오거나 설정한다. 속성값의
 * 인수 하나를 사용하면 CSSS에서 String에 해당하는 CSS 속성의 값을 가져온다.
 * 인수 두 개를 사용하면 첫번째 인수에 해당하는 CSS 속성을 두번째 인수의 값으로 설정한다.
 * Object 혹은 $Hash 타입의 객체를 사용하면 두 개 이상의 CSS 속성을 한꺼번에 정의할 수 있다.
 * @remark CSS 속성은 Camel 표기법을 사용한다. 따라서 border-width-bottom은 borderWidthBottom으로 정의한다.
 * @remark float 속성은 Javascript의 예약어로 사용하므로 css 메서드에서는 float 대신 cssFloat를 사용한다. (Internet Explorer에서는 styleFloat를, 그 외의 브라우저에서는 cssFloat를 사용한다.)
 * @param {String | Object | $H} sName CSS 속성 | 하나 이상의 CSS 속성과 값을 가지는 객체.
 * @param {String | Number} [sValue] CSS 속성에 설정할 값. 단위가 필요한 값은 Number, 혹은 단위를 포함하는 String으로 정의한다.
 * @return {String | $Element} 값을 가져올 때는 String 설정값을, 값을 설정할 때는 값을 설정한 현재의 $Element를 리턴한다. 값을 설정할 때 CSS 속성이 존제하지 않으면 null을 리턴한다.
 * @description [Lite]
 * @example

<style>
	#btn {
		width: 120px;
		height: 30px;
		background-color: blue;
	}
</style>

...

<script type="text/javascript" charset="utf-8">
	window.onload = function () {
		$Element('btn').css('backgroundColor');
		// rgb (0, 0, 256)

		$Element('btn').css('backgroundColor', 'red');
		// $Element('btn').css('backgroundColor') -> reb (255, 0, 0)

		$Element('btn').css({
			width: "200px",
			height: "80px"
		});
		// $Element('btn').css('width') -> "200px"
		// $Element('btn').css('height') -> "80px"
 	}
</script>
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
				return e.style[sName]||e.currentStyle[sName];
			}catch(e){
				throw new Error(e.tagName||"document" + "는 css를 사용 할수 없습니다.");
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
			}catch(e){
				throw new Error(e.tagName||"document" + "는 css를 사용 할수 없습니다.");
			}
		}
	
	} else {
		fpGetCss = function(e, sName){
			try{
				if (sName == "cssFloat" && IS_IE) sName = "styleFloat";
				return e.style[sName];
			}catch(e){
				throw new Error(e.tagName||"document" + "는 css를 사용 할수 없습니다.");
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
 * @param {String} v
 */
jindo.$Element.prototype._setCss = function(e, k, v){
	if (("#top#left#right#bottom#").indexOf(k+"#") > 0 && (typeof v == "number" ||(/\d$/.test(v)))) {
		e.style[k] = parseInt(v)+"px";
	}else{
		e.style[k] = v;
	}
}

/**
 * attr 메서드는 DOM 엘리먼트의 HTML 속성을 가져오거나 설정한다.
 * 하나의 인수만 사용하면 해당 HTML 속성의 속성값을 가져온다.
 * 두 개의 인수를 사용하면 첫번째 인수에 해당하는 HTML 속성의 속성값을 설정한다.
 * Object 혹은 $Hash 타입의 객체를 사용하면 두 개 이상의 HTML 속성을 한꺼번에 정의할 수 있다.
 * @param {String | Object | $H} sName HTML 속성 이름 혹은 설정값 객체
 * @param {String | Number} [sValue] 설정값. 설정값을 null로 지정하면 HTML 속성을 지운다.
 * @return {String | $Element} 값을 가져올 때는 String 설정값을, 값을 설정할 때는 값을 설정한 현재의 $Element를 리턴한다.
 * @description [Lite]
 */

jindo.$Element.prototype.attr = function(sName, sValue) {
	var e = this._element;

	if (typeof sName == "string") {
		if (typeof sValue != "undefined") {
			var obj = new Object;
			obj[sName] = sValue;
			sName = obj;
		} else {
			if (sName == "class" || sName == "className") return e.className;
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
					e.setAttribute(k, sName[k]);
				} 
			}
		}
	}

	return this;
};

/**
 * width 메서드는 DOM 엘리먼트의 너비를 가져오거나 설정한다.
 * @remark width 메서드는 엘리먼트의 실제 너비를 가져온다. 브라우저마다 Box 모델의 크기 계산 방법이 다르므로 CSS의 width 속성값과 width 메서드의 리턴 값은 서로 다를 수 있다.
 * @param {Number} [width]	설정할 너비. 단위는 px. (1.4.1부터 ie한하여 auto값 설정 가능.)
 * @return {Number|$Element} DOM 엘리먼트의 실제 너비. 너비를 설정하면 this를 반환한다.
 * @description [Lite]
 */
jindo.$Element.prototype.width = function(width) {
	
	if (typeof width == "number") {
		var e = this._element;
		e.style.width = width+"px";
		var off = e.offsetWidth;
		if (off != width) {
			e.style.width = (width*2 - off) + "px";
		}
		return this;
	}

	return this._element.offsetWidth;
};

/**
 * height 메서드는 DOM 엘리먼트의 높이를 가져오거나 설정한다.
 * @remark height 메서드는 엘리먼트의 실제 높이를 가져온다. 브라우저마다 Box 모델의 크기 계산 방법이 다르므로 CSS의 height 속성값과 height 메서드의 리턴 값은 서로 다를 수 있다.
 * @param {Number} height	설정할 높이. 단위는 px.(1.4.1부터 ie한하여 auto값 설정 가능.)
 * @return {Number|$Element} DOM 엘리먼트의 실제 높이. 높이를 설정하면 this를 반환한다.
 * @description [Lite]
 */
jindo.$Element.prototype.height = function(height) {
	if (typeof height == "number") {
		var e = this._element;
		e.style.height = height+"px";
		var off = e.offsetHeight;
		if (off != height) {
			var height = (height*2 - off);
			if(height>0)
				e.style.height = height + "px";
		}

		return this;
	}

	return this._element.offsetHeight;
};

/**
 * className 메서드는 DOM 엘리먼트에 클래스 이름을 설정하거나 반환한다.
 * @param {String} sClass 	클래스 이름. 두 개 이상의 클래스를 설정했다면 공백을 포함한 문자열을 반환한다.
 * @description [Lite]
 * @example

<div id="zoo" class="animal rest">

..

<script type="text/javascript">

var el = $Element("zoo");
el.className();
// "animal rest"

el.className("entertainment");
el.className();
// "entertainment"

</script>
 */
jindo.$Element.prototype.className = function(sClass) {
	var e = this._element;

	if (typeof sClass == "undefined") return e.className;
	e.className = sClass;

	return this;
};

/**
 * hasClass 메서드는 DOM 엘리먼트에서 특정한 클래스를 사용하고 있는지 확인한다.
 * @param {String} sClass 확인할 클래스 셀랙터
 * @return {Boolean} 클래스의 사용 여부.
 * @description [Lite]
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
 * addClass 메서드는 DOM 엘리먼트에 클래스를 추가한다.
 * @param {String} sClass 추가할 클래스 셀랙터
 * @return {$Element} 현재의 DOM 엘리먼트
 * @description [Lite]
 */
jindo.$Element.prototype.addClass = function(sClass) {
	if(this._element.classList){
		jindo.$Element.prototype.addClass = function(sClass){
			var aClass = sClass.split(" ");
			var flistApi = this._element.classList;
			for(var i = aClass.length ; i-- ;){
				flistApi.add(aClass[i]);
			}
			return this;
		}
	} else {
		jindo.$Element.prototype.addClass = function(sClass){
			var e = this._element;
			if (this.hasClass(sClass)) return this;
			e.className = (e.className+" "+sClass).replace(/^\s+/, "");
			return this;
		}
	}
	return this.addClass(sClass);

};


/**
 * removeClass 메서드는 DOM 엘리먼트에서 특정 클래스를 제거한다.
 * @param {String} sClass 제거할 클래스 이름
 * @return {$Element} 현재의 DOM 엘리먼트
 * @description [Lite]
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
			e.className = (" "+e.className+" ").replace(" "+sClass+" ", " ").replace(/\s+$/, "").replace(/^\s+/, "");
			return this;
		}
	}
	return this.removeClass(sClass);
	
};


/**
 * toggle 메서드는 클래스 셀렉터을 토글한다. 하나의 클래스 셀렉터를 인수로 사용하면 해당 클래스만 토글하고, 두 개의 셀렉터를 인수로 사용하면 사용하고 있는 셀렉터는 지우고, 나머지 셀렉터를 추가한다.
 * @param {Object} sClass	클래스 셀렉터 이름. 하나의 클래스 셀렉터만 인수로 사용하면, DOM 엘리먼트에서 해당 클래스 셀렉터를 사용하는지 확인한다. 만약 셀렉터를 사용하고 있다면 해당 셀렉터를 지운다. 사용하고 있지 않다면 해당 셀렉터를 추가한다.
 * @param {Object} [sClass2]	클래스 셀렉터 이름.  두 개의 클래스 셀렉터를 인수로 사용하면, 두 셀렉터 중 사용하고 있는 셀랙터를 지우고 나머지 셀렉터를 추가한다.
 * @import core.$Element[hasClass,addClass,removeClass]
 * @description [Lite]
 * @example

<div id="naver" class="search highlight active">Naver</div>

<script>
var r = $Element("naver")
r.toggleClass("highlight");
// <div id="naver" class="search active">Naver</div>

r.toggleClass("highlight");
// <div id="naver" class="search highlight active">Naver</div>

r.toggleClass("active", "deactive");
// <div id="naver" class="search highlight deactive">Naver</div>

r.toggleClass("active", "deactive");
// <div id="naver" class="search highlight active">Naver</div>
</script>

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
 * text 메서드는 DOM 엘리먼트의 텍스트 노드값을 가져오거나 설정한다. String 타입의 인수를 지정하면 인수의 값으로 텍스트 노드를 변경하고 변경한 결과를 리턴한다.
 * @param {String} sText 설정할 텍스트
 * @returns {String} 설정한 텍스트 값
 * @description [Lite]
 */
jindo.$Element.prototype.text = function(sText) {
	var ele = this._element;
	var tag = this.tag;
	var prop = (typeof ele.textContent != "undefined")?"textContent":"innerText";

	if (tag == "textarea" || tag == "input") prop = "value";
	
	var type =  (typeof sText);
	if (type != "undefined"&&(type == "string" || type == "number" || type == "boolean")) {
		sText += "";
		try { 
			ele[prop] = sText; 
		} catch(e) {
			return this.html(sText.replace(/&/g, '&amp;').replace(/</g, '&lt;'));
		}
		return this;
	}

	return ele[prop];
};

/**
 * html 메서드는 DOM 엘리먼트의 내부 HTML(innerHTML)을 가져오거나 설정한다. String 타입의 인수를 지정하면 인수의 값으로 내부 HTML을 변경하고 변경한 결과를 리턴한다.
 * @param {String} sHTML 설정할 HTML 문자열
 * @return {String} 내부 HTML
 * @description [Lite]
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
				var sId = 'R' + new Date().getTime() + parseInt(Math.random() * 100000);
				var oDoc = oEl.ownerDocument || oEl.document || document;

				var oDummy;
				var sTag = oEl.tagName.toLowerCase();

				switch (sTag) {
				case 'select':
				case 'table':
					oDummy = document.createElement("div");
					oDummy.innerHTML = '<' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '>';
					break;

				case 'tr':
				case 'thead':
				case 'tbody':
					oDummy = document.createElement("div");
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
				jindo.$$.release();
				var oEl = this._element;
				
				if(!oEl.parentNode){
					/*
						IE 나 FireFox 의 일부 상황에서 SELECT 태그나 TABLE, TR, THEAD, TBODY 태그에 innerHTML 을 셋팅해도
						문제가 생기지 않도록 보완 - hooriza
					*/
					var sId = 'R' + new Date().getTime() + parseInt(Math.random() * 100000);
					var oDoc = oEl.ownerDocument || oEl.document || document;

					var oDummy;
					var sTag = oEl.tagName.toLowerCase();

					switch (sTag) {
					case 'select':
					case 'table':
						oDummy = document.createElement("div");
						oDummy.innerHTML = '<' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '>';
						break;

					case 'tr':
					case 'thead':
					case 'tbody':
						oDummy = document.createElement("div");
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
				jindo.$$.release();
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
 * outerHTML 메서드는 DOM 엘리먼트의 외부 HTML(outerHTML)을 반환한다.
 * @return {String} 외부 HTML
 * @description [Lite]
 */
jindo.$Element.prototype.outerHTML = function() {
	var e = this._element;
	if (typeof e.outerHTML != "undefined") return e.outerHTML;

	var div = document.createElement("div");
	var par = e.parentNode;
	
	// 상위노드가 없으면 innerHTML반환
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
 * toString 메서드는 DOM 엘리먼트를 HTML 문자열로 변환하여 리턴한다. 리턴값은 outerHTML과 동일하다.
 * @return {String} 외부 HTML
 */
jindo.$Element.prototype.toString = jindo.$Element.prototype.outerHTML;

/**
 * @fileOverview $Element의 확장 메서드를 정의한 파일
 * @name element.extend.js
 */

/**
 * appear 메서드는 DOM 엘리먼트를 서서히 나타나게 한다. (Fade-in 효과)
 * @param {Number} duration DOM 엘리먼트의 투명도가 현재의 값에서 시작해서 1이 될때 까지 걸리는 시간. 단위는 초를 사용한다.
 * @param {Function} callback DOM 엘리먼트가 완전히 나타난 후, 즉 투명도가 1이 된 후에 실행할 콜백 함수.
 * @returns {Object} $Element 객체
 * @see $Element#show
 * @see $Element#disappear
 */
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
};

/**
 * disappear 메서드는 DOM 엘리먼트를 서서히 사라지게 한다. (Fade-out 효과) DOM 엘리먼트가 완전히 사라지면 엘리먼트의 CSS 중 display 속성은 none으로 변한다.
 * @param {Number} duration DOM 엘리먼트의 투명도가 현재의 값에서 0이 될 때까지 걸리는 시간. 단위는 초를 사용한다.
 * @param {Function} callback DOM 엘리먼트가 완전히 사라지고 난 후, 즉 투명도가 0이 된 후에 실행할 콜백 함수
 * @returns {Object} $Element 객체
 * @see $Element#hide
 * @see $Element#appear
 */
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
};

/**
 * offset 메서드는 DOM 엘리먼트의 위치를 가져오거나 설정한다. 기준점은 브라우저 문서의 왼쪽 상단이다. offset 메서드의 인수로 top, left 값을 지정하면 DOM 엘리먼트의 위치를 설정한다.
 * @remark 일부 브라우저와 일부 상황에서 inline 엘리먼트에 대한 위치가 올바르게 얻어지지 않는 문제가 있으며 이 경우 해당 엘리먼트를 position:relative; 로 바꿔주는 식으로 해결할 수 있다.
 * @author Hooriza
 * @param {Number} [nTop] 문서의 맨 위에서 부터 엘리먼트 맨 위까지의 거리. 단위는 px.
 * @param {Number} [nLeft] 문서의 왼쪽 가장자리에서 엘리먼트의 왼쪽 가장자리까지의 거리. 단위는 px.
 * @return {$Element | Object} 엘리먼트의 위치를 설정하면 기존 엘리먼트를, 엘리먼트의 위치를 가져오면 엘리먼트의 x, y 좌표를 속성으로 가지는 객체.
 */
jindo.$Element.prototype.offset = function(nTop, nLeft) {

	var oEl = this._element;
	var oPhantom = null;

	// setter
	if (typeof nTop == 'number' && typeof nLeft == 'number') {

		if (isNaN(parseInt(this.css('top')))) this.css('top', 0);
		if (isNaN(parseInt(this.css('left')))) this.css('left', 0);

		var oPos = this.offset();
		var oGap = { top : nTop - oPos.top, left : nLeft - oPos.left };

		oEl.style.top = parseInt(this.css('top')) + oGap.top + 'px';
		oEl.style.left = parseInt(this.css('left')) + oGap.left + 'px';

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
 * evalScripts 메서드는 인자로 들어온 문자열 중에서 &lt;script&gt; 태그 안에 있는 내용을 파싱해서 eval 로 수행한다.
 * @param {String} sHTML &lt;script&gt; 태그가 포함된 HTML 문자열
 * @return {$Element} 현재의 DOM 엘리먼트
 */
jindo.$Element.prototype.evalScripts = function(sHTML) {
	
	var aJS = [];
    sHTML = sHTML.replace(new RegExp('<script(\\s[^>]+)*>(.*?)</'+'script>', 'gi'), function(_1, _2, sPart) { aJS.push(sPart); return ''; });
    eval(aJS.join('\n'));
    
    return this;

};

/**
 * append 메서드는 인수로 지정한 DOM 엘리먼트를 $Element 객체의 마지막 자식 노드로 추가한다.
 * @param {$Element | HTMLElement | String} oElement	추가할 DOM 엘리먼트
 * @returns {Object} 새로운 자식노드를 추가한 $Element 객체
 */
jindo.$Element.prototype.append = function(oElement) {
	var o = jindo.$Element(oElement).$value();

	this._element.appendChild(o);

	return jindo.$Element(o);
};

/**
 * prepend 메서드는 인수로 지정한 DOM 엘리먼트를 $Element 객체의 첫번째 자식 노드로 추가한다.
 * @param {$Element | HTMLElement | String} oElement	추가할 DOM 엘리먼트, 혹은 엘리먼트의 id
 * @returns {$Element} 새로운 자식 노드를 추가한 $Element 객체
 */
jindo.$Element.prototype.prepend = function(oElement) {
	var e = this._element;
	var o = jindo.$Element(oElement).$value();

	if (e.childNodes.length > 0) {
		e.insertBefore(o, e.childNodes[0]);
	} else {
		e.appendChild(o);
	}

	return jindo.$Element(o);
};

/**
 * replace 메서드는 $Element 객체의 노드를 인수로 지정한 DOM 엘리먼트로 대체한다.
 * @param {$Element | HTMLElement | String} oElement	대체할 DOM 엘리먼트, 혹은 엘리먼트의 id
 * @returns {$Element} DOM 엘리먼트가 대체된 $Element 객체
 */
jindo.$Element.prototype.replace = function(oElement) {
	jindo.$$.release();
	var e = this._element;
	var o = jindo.$Element(oElement).$value();

	e.parentNode.insertBefore(o, e);
	e.parentNode.removeChild(e);

	return jindo.$Element(o);
};

/**
 * appendTo 메서드는 $Element 객체를 인수로 지정한 DOM 엘리먼트의 마지막 자식 노드로 추가한다.
 * @param {$Element | HTMLElement | String} oElement 추가할 DOM 엘리먼트, 혹은 엘리먼트의 id
 * @returns {$Element} 자식 노드를 추가한 $Element 객체
 */
jindo.$Element.prototype.appendTo = function(oElement) {
	var o = jindo.$Element(oElement).$value();

	o.appendChild(this._element);

	return this;
};

/**
 * prependTo 메서드는 인수로 지정한 $Element 객체의 첫번째 자식 노드로 추가한다.
 * @param {$Element | HTMLElement | String} oElement 추가할 DOM 엘리먼트, 혹은 엘리먼트의 id
 * @returns {$Element} 자식 노드를 추가한 $Element 객체
 */
jindo.$Element.prototype.prependTo = function(oElement) {
	var o = jindo.$Element(oElement).$value();

	if (o.childNodes.length > 0) {
		o.insertBefore(this._element, o.childNodes[0]);
	} else {
		o.appendChild(this._element);
	}

	return this;
};

/**
 * before 메서드는 인수로 지정한 엘리먼트를 $Element 객체 바로 앞에 삽입한다.
 * @param {$Element | HTMLElement | String} oElement 삽입할 DOM 엘리먼트, 혹은 엘리먼트의 id
 * @returns {Object} 삽입한 DOM 엘리먼트
 */
jindo.$Element.prototype.before = function(oElement) {
	var o = jindo.$Element(oElement).$value();

	this._element.parentNode.insertBefore(o, this._element);

	return jindo.$Element(o);
};

/**
 * after 메서드는 인수로 지정한 엘리먼트를 $Element 객체의 바로 뒤에 지정한 DOM 엘리먼트를 삽입한다.
 * @param {$Element | HTMLElement | String} oElement 삽입할 DOM 엘리먼트, 혹은 엘리먼트의 id
 * @returns {Object} 삽입한 DOM 엘리먼트
 */
jindo.$Element.prototype.after = function(oElement) {
	var o = this.before(oElement);
	o.before(this);

	return o;
};

/**
 * parent 메서드는 특정 노드의 부모 노드 (컨테이너 노드)를 검색한다.
 * @param {String} [pFunc] 상위 노드의 검색 조건을 지정한 콜백 함수. 여러 상위 노드를 조건 없이 검색하려면 pFunc를 null로 설정하고 limit에 상위 노드의 개수를 설정한다.
 * @param {Number} [limit] 탐색할 상위 노드의 개수.
 * @returns {$Element | Array} 부모 노드, 혹은 상위 노드의 배열. 부모 노드만 리턴할 경우 $Element 타입을, 상위 노드의 배열을 리턴할 경우 $Element의 배열을 리턴한다.
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
 * child 메서드는 자식 노드를 검색한다.
 * @param {Function} [pFunc]  자식 노드의 검색 조건을 지정한 콜백 함수. 여러 하위 노드를 조건 없이 검색하려면 pFunc를 null로 설정하고 limit에 하위 노드의 개수를 설정한다.
 * @param {Number} [limit] 탐색할 하위 노드 개수
 * @returns {$Element | Array} 자식 노드, 혹은 조건에 맞는 자식 노드의 배열. 자식 노드 하나만 리턴할 경우 $Element 타입을, 자식 노드의 배열을 리턴할 경우 $Element의 배열을 리턴한다.
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
 * prev 메서드는 특정 노드의 이전에 나오는 형제 노드를 검색한다.
 * @param {String} [pFunc] 이전 형제 노드의 검색 조건을 지정한 콜백 함수. pFunc를 생략하면 바로 전의 형제 노드를 리턴한다.
 * @returns {$Element | Array} pFunc의 조건에 맞는 형제 $Element의 배열, 혹은 바로 전의 형제 노드를 가리키는 $Element.
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
 * next 메서드는 특정 노드의 다음에 나오는 형제 노드를 검색한다.
 * @param {String} pFunc 다음 형제 노드의 검색 조건을 지정한 콜백 함수. pFunc를 생략하면 바로 다음의 형제 노드를 가리키는 $Element를 리턴한다.
 * @returns {$Element | Array} pFunc의 조건에 맞는 형제 $Element의 배열, 혹은 바로 다음의 형제 노드를 가리키는 $Element.
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
 * first 메소드는 현재 노드의 처음 자식 노드를 반환한다. 엘리먼트 노드에 대해서만 적용된다.
 * @since 1.2.0
 * @returns {$Element} 마지막 자식 노드
 */
jindo.$Element.prototype.first = function() {
	var el = this._element.firstElementChild||this._element.firstChild;
	if (!el) return null;
	while(el && el.nodeType != 1) el = el.nextSibling;

	return el?jindo.$Element(el):null;
}

/**
 * last 메소드는 현재 노드의 마지막 자식 노드를 반환한다. 엘리먼트 노드에 대해서만 적용된다.
 * @since 1.2.0
 * @returns {$Element} 마지막 자식 노드
 */
jindo.$Element.prototype.last = function() {
	var el = this._element.lastElementChild||this._element.lastChild;
	if (!el) return null;
	while(el && el.nodeType != 1) el = el.previousSibling;

	return el?jindo.$Element(el):null;
}

/**
 * isChildOf 메서드는 현재 노드가 지정한 노드의 자식 노드인지 확인한다.
 * @param {HTMLElement | String | $Element} element 부모 노드인지 확인할 DOM 엘리먼트, 혹은 DOM 엘리먼트의 고유한 id
 * @returns {Boolean} 현재 노드가 인수로 지정한 노드의 자식 노드이면 true, 그렇지 않으면 false를 리턴한다.
 */
jindo.$Element.prototype.isChildOf = function(element) {
	var e  = this._element;
	var el = jindo.$Element(element).$value();

	while(e && e.parentNode) {
		e = e.parentNode;
		if (e == el) return true;
	}
	return false;
};

/**
 * isParentOf 메서드는 현재 노드가 지정한 노드의 부모인지 확인한다.
 * @param {HTMLElement,$Element} element	자식 노드인지 확인할 DOM 엘리먼트, 혹은 DOM 엘리먼트의 고유한 id.
 * @returns {Boolean} 현재 노드가 인수로 지정한 노드의 부모이면 true, 그렇지 않으면 false
 */
jindo.$Element.prototype.isParentOf = function(element) {
	var el = jindo.$Element(element).$value();

	while(el && el.parentNode) {
		el = el.parentNode;
		if (this._element == el) return true;
	}
	return false;
};

/**
 * isEqual 메서드는 현재 객체와 인자로 주어진 객체가 같은 엘리먼트인지 확인한다.
 * @param {HTMLElement, $Element} element 비교할 엘리먼트 객체
 * @returns {Boolean} 같은 노드이면 true, 그렇지 않으면 false
 */
jindo.$Element.prototype.isEqual = function(element) {
	try {
		return (this._element === jindo.$Element(element).$value());
	} catch(e) {
		return false;
	}
};

/**
 * fireEvent 메서드는 DOM 엘리먼트에 이벤트를 발생시킨다.
 * event객체의 속성을 설정할 수 있다.  
 * (주의: WebKit계열에서는 이벤트객체의 keyCode 가 read-only인 관계로 key이벤트를 fire할 경우 keyCode값이 설정되지 않는다.) - 1.4.1 부터 사용가능.
 * @param {String} sEvent 실행할 이벤트 이름. on 접두사는 생략한다.
 * @param {Event} oEvent 이벤트 실행시 사용할 event객체.
 * @return {$Element} 이벤트를 발생시킨 DOM 엘리먼트
 * @example
 	$Element("div").fireEvent("click",{left:true,middle:false,right:false});
 	 	
 	$Element("div").fireEvent("mouseover",{screenX:50,screenY:50,clientX:50,clientY:50});
 	
 	$Element("div").fireEvent("keydown",{keyCode:13,alt:true,shift:false,meta:false,ctrl:true});
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
 * empty 메서드는 현재 노드의 자식 노드를 모두 제거한다.
 * @return {$Element} 자식 노드를 모두 제거한 현재 노드
 */
jindo.$Element.prototype.empty = function() {
	jindo.$$.release();
	this.html("");
	return this;
};

/**
 * remove 메서드는 현태 노드의 자식 노드를 제거한다.
 * 제거되는 자식 노드에 attach된 이벤트 핸들러는 모두 detach 시킨다.
 */
jindo.$Element.prototype.remove = function(oChild) {
	jindo.$$.release();
	jindo.$Element(oChild).leave();
	return this;
}

/**
 * leave 메서드는 현재 노드를 부모 노드에서 제거한다.
 * 제거되는 노드에 attach된 이벤트 핸들러는 모두 detach 시킨다.
 * @return {$Element} 부모 노드에서 제거한 $Element 개체
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
 * wrap 메서드는 인수로 지정한 노드로 현재 노드를 감싼다.
 * @param {String | HTMLElement} wrapper 감쌀 노드 혹은 노드의 고유한 id 값
 * @return {$Element} 새로운 노드로 감싸진 $Element 개체
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
 * ellipsis 메서드는 DOM 엘리먼트의 텍스트 노드가 브라우저에 한 줄로 보이도록 길이를 조절한다. 길이를 조절한다면 stringTail에서 지정한 문자열을 텍스트 노드의 맨 끝에 붙인다.
 * @remark 이 메서드는 엘리먼트가 텍스트 노드만 포함한다고 가정한다. 따라서, 이외의 상황에서의 동작은 보장하지 않는다.
 * @remark 브라우저에서의 엘리먼트 너비를 측정하고 그 너비를 기준으로 텍스트 노드의 길이를 정하므로 엘리먼트는 반드시 보이는 상태이어야 한다.
 * @remark 화면에 전체 텍스트 노드가 보였다가 줄어드는 경우가 있다. 따라서, 엘리먼트에서 overflow:hidden 속성을 활용하면 이런 현상을 줄일 수 있다. ??
 * @param {String} stringTail 말줄임 표시자. 생락하면 말줄임표('...')를 사용한다.
 */
jindo.$Element.prototype.ellipsis = function(stringTail) {
	stringTail = stringTail || "...";

	var txt   = this.text();
	var len   = txt.length;
	var cur_h = this.height();
	var i     = 0;
	var h     = this.text('A').height();

	if (cur_h < h * 1.5) return this.text(txt);

	cur_h = h;
	while(cur_h < h * 1.5) {
		i += Math.max(Math.ceil((len - i)/2), 1);
		cur_h = this.text(txt.substring(0,i)+stringTail).height();
	}

	while(cur_h > h * 1.5) {
		i--;
		cur_h = this.text(txt.substring(0,i)+stringTail).height();
	}
};

/**
 * indexOf 메소드는 주어진 엘리먼트가 이 객체의 몇 번째 자식노드인지 반환한다. 인덱스는 0부터 시작하므로 첫번째 자식 노드를 인자로 전달하면 0을 반환한다. 주어진 엘리먼트가 이 객체의 자식이 아니라면, 다시 말해, 주어진 엘리먼트를 자식 노드에서 찾지 못했다면 -1을 반환한다.
 * @param {HTMLElement, $Element} element 검색할 엘리먼트
 * @since 1.2.0
 * @return {Number} 검색 결과
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
 * 요소의 하위 노드에서 주어진 selector를 만족시키는 요소의 배열을 반환한다. 만족하는 요소가 존재하지 않으면 빈 배열을 반환한다.
 * @param {String} sSelector
 * @return {Array} 조건을 만족하는 요소의 배열
 */
jindo.$Element.prototype.queryAll = function(sSelector) { 
	return jindo.$$(sSelector, this._element); 
};

/**
 * 요소의 하위 노드에서 주어진 selector를 만족시키는 요소중 첫 번째 요소를 반환한다. 만족하는 요소가 존재하지 않으면 null을 반환한다.
 * @param {String} sSelector
 * @return {Element} 조건을 만족하는 요소중 첫번째 요소
 */
jindo.$Element.prototype.query = function(sSelector) { 
	return jindo.$$.getSingle(sSelector, this._element); 
};

/**
 * 요소가 주어진 selector를 만족시키는 요소인지 여부를 반환한다.
 * @param {String} sSelector
 * @return {Boolean} 조건을 만족하지 여부
 */
jindo.$Element.prototype.test = function(sSelector) { 
	return jindo.$$.test(this._element, sSelector); 
};

/**
 * 요소를 기준으로  XPath 문법을 사용하여 엘리먼트를 얻어온다.
 * @remark 지원하는 문법이 무척 제한적으로 특수한 경우에서만 사용하는 것을 권장한다.
 * @param {String} sXPath
 * @return {Array} path에 해당하는 요소
 */
jindo.$Element.prototype.xpathAll = function(sXPath) { 
	return jindo.$$.xpath(sSelector, this._element); 
};

/**
 * insertAdjacentHTML 함수. 직접사용하지 못함.
 * @ignore
 */
jindo.$Element.insertAdjacentHTML = function(_ele,html,insertType,type,fn){
	if( _ele.insertAdjacentHTML && !(/^<(option|tr|td|th)>/.test(html.replace(/^(\s|　)+|(\s|　)+$/g, "").toLowerCase()))){
		_ele.insertAdjacentHTML(insertType, html);
	}else{
		var fragment = document.createDocumentFragment();
		var defaultElement;
		
		if(/^<(option)>/.test(html.replace(/^(\s|　)+|(\s|　)+$/g, "").toLowerCase())){
			defaultElement = document.createElement("select");
			jindo.$Element(defaultElement).html(html);
		} else if(/^<(tr)>/.test(html.replace(/^(\s|　)+|(\s|　)+$/g, "").toLowerCase())){
			var sId = 'R' + new Date().getTime() + parseInt(Math.random() * 100000);
			defaultElement = jindo.$("<table><tbody class='"+sId+"'></tbody></table>");
			for (defaultElement = defaultElement.firstChild; defaultElement; defaultElement = defaultElement.firstChild){
				if (defaultElement.className == sId) break;
			}
			jindo.$Element(defaultElement).html(html);
		} else if(/^<(td|th)>/.test(html.replace(/^(\s|　)+|(\s|　)+$/g, "").toLowerCase())){
			defaultElement = document.createElement("tr");
			jindo.$Element(defaultElement).html(html);
		}else {
			defaultElement = document.createElement("div");
			defaultElement.innerHTML = html;
		}
		
		var scripts = defaultElement.getElementsByTagName("script");
	
		for ( var i = 0, l = scripts.length; i < l; i++ ){
			scripts[i].parentNode.removeChild( scripts[i] );
		}
			
		while ( defaultElement[ type ]){
			
			fragment.appendChild( defaultElement[ type ] );
		}
		
		fn(fragment.cloneNode(true));

	}
	return this;
}

/**
 * html 문자를 append할때 사용한다.
 * @param {String} sHTML html문자. 
 * @returns {$Element} $Element 인스턴스.
 * @since 1.4.6부터 사용가능.
 * @see $Element#prependHTML
 * @see $Element#beforeHTML
 * @see $Element#afterHTML
 * @example

<ul id="ultag">
	<li>1</li>
	<li>2</li>
</ul>

$Element("ultag").appendHTML("<li>3</li><li>4</li>");
-> 결과.
<ul id="ultag">
	<li>1</li>
	<li>2</li>
	<li>3</li>
	<li>4</li>
</ul>
 */
jindo.$Element.prototype.appendHTML = function(sHTML) {
	return jindo.$Element.insertAdjacentHTML(this._element,sHTML,"beforeEnd","firstChild",jindo.$Fn(function(oEle){
		this.append(oEle);
	},this).bind());
};
/**
 * html 문자를 prepend할때 사용한다.
 * @param {String} sHTML html문자. 
 * @returns {$Element} $Element 인스턴스.
 * @since 1.4.6부터 사용가능.
 * @see $Element#appendHTML
 * @see $Element#beforeHTML
 * @see $Element#afterHTML
 * @example
 
<ul id="ultag">
	<li>1</li>
	<li>2</li>
</ul>

$Element("ultag").prependHTML("<li>3</li><li>4</li>");
-> 결과.
<ul id="ultag">
	<li>3</li>
	<li>4</li>
	<li>1</li>
	<li>2</li>
</ul>
 */
jindo.$Element.prototype.prependHTML = function(sHTML) {
	return jindo.$Element.insertAdjacentHTML(this._element,sHTML,"afterBegin","lastChild",jindo.$Fn(function(oEle){
		this.prepend(oEle);
	},this).bind());
};
/**
 * html 문자를 엘리먼트 앞에 넣을때 사용한다.
 * @param {String} sHTML html문자. 
 * @returns {$Element} $Element 인스턴스.
 * @since 1.4.6부터 사용가능.
 * @see $Element#appendHTML
 * @see $Element#prependHTML
 * @see $Element#afterHTML
 * @example

<ul id="ultag">
	<li>1</li>
	<li>2</li>
</ul>

$Element("ultag").beforeHTML("<ul><li>3</li><li>4</li></ul>");
-> 결과.
<ul>
	<li>3</li>
	<li>4</li>
</ul>
<ul id="ultag">
	<li>1</li>
	<li>2</li>
</ul>
 */
jindo.$Element.prototype.beforeHTML = function(sHTML) {
	return jindo.$Element.insertAdjacentHTML(this._element,sHTML,"beforeBegin","firstChild",jindo.$Fn(function(oEle){
		this.before(oEle);
	},this).bind());
};
/**
 * html 문자를 엘리먼트 뒤에 넣을때 사용한다.
 * @param {String} sHTML html문자. 
 * @returns {$Element} $Element 인스턴스.
 * @since 1.4.6부터 사용가능.
 * @see $Element#appendHTML
 * @see $Element#prependHTML
 * @see $Element#beforeHTML
 * @example

<ul id="ultag">
	<li>1</li>
	<li>2</li>
</ul>

$Element("ultag").afterHTML("<ul><li>3</li><li>4</li></ul>");
-> 결과.
<ul id="ultag">
	<li>1</li>
	<li>2</li>
</ul>
<ul>
	<li>3</li>
	<li>4</li>
</ul>
 */
jindo.$Element.prototype.afterHTML = function(sHTML) {
	return jindo.$Element.insertAdjacentHTML(this._element,sHTML,"afterEnd","lastChild",jindo.$Fn(function(oEle){
		this._element.parentNode.insertBefore( oEle, this._element.nextSibling );
	},this).bind());
};

/**
 * 이벤트 딜리게이션 사용하기.
 * @param {String} sEvent 이벤트 타입.(ex.click,mouseover...) (domready,mousewheel,mouseenter,mouseleave 은 지원안함.)
 * @param {String|Function} vFilter cssquery(String),function(boolean을 리턴하는 함수.) 이렇게 2가지 타입이 들어옴. 함수를 할당한 경우에는 첫번째 인자로 자신의 엘리먼트, 두번째 인자로 이벤트가 발생한 엘리먼트가 들어온다.
 * @param {Function} fpCallback 해당 cChecker에 들어오는 함수가 맞을때 실행되는 함수.
 * @returns {$Element} $Element 인스턴스.
 * @since 1.4.6부터 사용가능.
 * @see $Element#undelegate
 * @see  <a href="http://devcode.nhncorp.com/projects/jindo/wiki/EventDelegate">event delegation</a>
 * @example 
 * 
	// css selector기준으로 설정할때.
	$Element("parent").delegate("click",".odd",function(eEvent){
		alert("odd 클래스를 가진 li가 클릭 될때 실행됨.");
	});
	<ul id="parent">
		<li class="odd">1</li>
		<li>2</li>
		<li class="odd">3</li>
		<li>4</li>
	</ul>
	
	// 직접 필터 할때.
	$Element("parent").delegate("click",function(oEle,oClickEle){ return oClickEle.innerHTML == "2"},function(eEvent){
		alert("클릭한 엘리먼트의 innerHTML이 2인 경우에 실행.");
	});
	<ul id="parent">
		<li class="odd">1</li>
		<li>2</li>
		<li class="odd">3</li>
		<li>4</li>
	</ul>
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
			

			var data,func,event; 
			for(var i in aData){
				data = aData[i];
				if(data.checker(oEle)){
					func = data.func;
					event = jindo.$Event(wEvent);
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
 * 해당 엘리먼트에 이벤트를 해제하는 함수.
 * @param {String} sEvent 이벤트 타입.(ex.click,mouseover...)
 * @param {String||Function} vFilter cssquery(String),function(boolean을 리턴하는 함수.) 이렇게 2가지 타입이 들어옴.
 * @param {Function} fpCallback 해당 cChecker에 들어오는 함수가 맞을때 실행되는 함수.
 * @returns {$Element} $Element 인스턴스.
 * @since 1.4.6부터 사용가능.
 * @see $Element#delegate
 * @example 
 * 
	function oddClass(){
		alert("odd 클래스를 가진 li가 클릭 될때 실행됨.");
	}
	// delegate 사용.
	$Element("parent").delegate("click",".odd",oddClass);
	// undelegate 사용.
	$Element("parent").undelegate("click",".odd",oddClass);
	
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
 * @returns {$Element} $Element 인스턴스.
 * @since 1.4.6부터 사용가능.
 * @ignore
 */
jindo.$Element.prototype._bind = function(sEvent,vFilter,fpCallback){
	var _aDataOfEvent = this._element["_delegate_"+sEvent];
	if(_aDataOfEvent){
		var fpCheck;
		if(typeof vFilter == "string"){
			fpCheck = jindo.$Fn(function(sCssquery,oEle){
				return jindo.$$.test(oEle, sCssquery);
			},this).bind(vFilter);
		}else if(typeof vFilter == "function"){
			fpCheck = jindo.$Fn(function(fpFilter,oEle){
				return fpFilter(this._element,oEle);
			},this).bind(vFilter);
		}
		
		this._element["_delegate_"+sEvent] = jindo.$Element._addBind(_aDataOfEvent,vFilter,fpCallback,fpCheck);
		
	}else{
		alert("check your delegate event.");
	}
}

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
 * @returns {$Element} $Element 인스턴스.
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

/**
 * @fileOverview $Fn의 생성자 및 메서드를 정의한 파일
 * @name function.js
 */

/**
 * 함수 객체를 리턴한다.
 * @name $Fn
 * @extends core
 * @class $Fn 클래스는 Javascript 함수의 레퍼 클래스이다.  ??
 * @constructor
 * @param {Function | String} func 함수 객체 혹은 함수의 인자를 지정한 문자열
 * @param {Object | String} thisObject 함수 객체가 다른 객체의 메서드일 때, 해당 객체도 같이 전달한다. 혹은 함수 몸체를 지정하는 문자열.
 * @return {$Fn} $Fn 객체
 * @see $Fn#toFunction
 * @description [Lite]
 * @example
var someObject = {
    func : function() {
       // code here
   }
}

var fn = $Fn(someObject.func, someObject);
 * @author Kim, Taegon
 */
jindo.$Fn = function(func, thisObject) {
	var cl = arguments.callee;
	if (func instanceof cl) return func;
	if (!(this instanceof cl)) return new cl(func, thisObject);

	this._events = [];
	this._tmpElm = null;
	this._key    = null;

	if (typeof func == "function") {
		this._func = func;
		this._this = thisObject;
	} else if (typeof func == "string" && typeof thisObject == "string") {
		//this._func = new Function(func, thisObject);
		this._func = eval("false||function("+func+"){"+thisObject+"}")
	}
}
/**
 * userAgent cache
 * @ignore
 */
var _ua = navigator.userAgent;
/**
 * $value 메서드는 원래의 Function 객체를 반환한다.
 * @return {Function} 함수 객체
 * @description [Lite]
 */
jindo.$Fn.prototype.$value = function() {
	return this._func;
};

/**
 * bind 메서드는 객체와 메서드를 묶어 하나의 Function으로 반환한다.
 * @return {Function} 메소드로 묶인 Funciton 객체
 * @see $Fn#bindForEvent
 * @description [Lite]
 */
jindo.$Fn.prototype.bind = function() {
	var a = jindo.$A(arguments).$value();
	var f = this._func;
	var t = this._this;

	var b = function() {
		var args = jindo.$A(arguments).$value();

		// fix opera concat bug
		if (a.length) args = a.concat(args);

		return f.apply(t, args);
	};

	return b;
};

/**
 * bingForEvent는 객체와 메서드를 묶어 하나의 이벤트 핸들러 Function으로 반환한다.
 * @param {Element, ...} [elementN] 이벤트 객체와 함께 전달할 값
 * @see $Fn#bind
 * @see $Event
 * @description [Lite]
 */
jindo.$Fn.prototype.bindForEvent = function() {
	var a = arguments;
	var f = this._func;
	var t = this._this;
	var m = this._tmpElm || null;

	var b = function(e) {
		var args = Array.prototype.slice.apply(a);
		if (typeof e == "undefined") e = window.event;

		if (typeof e.currentTarget == "undefined") {
			e.currentTarget = m;
		}
		var oEvent = jindo.$Event(e);
		args.unshift(oEvent);

		var returnValue = f.apply(t, args);
		if(typeof returnValue != "undefined" && oEvent.type=="beforeunload"){
			e.returnValue =  returnValue;
		}
		return returnValue;
	};

	return b;
};

/**
 * attach 메서드는 함수를 특정 엘리먼트의 이벤트 헨들러로 등록한다.
<ul>
	<li>이벤트 이름은 on 접두어를 사용하지 않는다.</li>
	<li>마우스 휠 스크롤 이벤트는 mousewheel 로 사용한다.</li>
	<li>일반적인 이벤트와 별로로 추가적인 이벤트로는 domready, mouseenter, mouseleave, mousewheel이 있다.</li>
</ul>
 * @param {Element|Array} oElement 이벤트를 추가할 엘리먼트(엘리먼트가 들어간 배열도 가능.)
 * @param {String} sEvent 추가할 이벤트의 종류
 * @param {Boolean} bUseCapture capturing 을 사용할 때. (1.4.2 부터 지원.)
 * @see $Fn#detach
 * @description [Lite]
 * @example
var someObject = {
    func : function() {
       // code here
   }
}

$Fn(someObject.func, someObject).attach($("test"),"click"); // 단일 엘리먼트에 클릭을 할당한 경우.
$Fn(someObject.func, someObject).attach($$(".test"),"click"); // 여러 엘리먼트에 클릭을 할당한 경우,
//attach에 첫번째 인자로 엘리먼트 배열이 들어오면 해당 모든 엘리먼트에 이벤트가 바인딩 됨.
 */
jindo.$Fn.prototype.attach = function(oElement, sEvent, bUseCapture) {
	var fn = null, l, ev = sEvent, el = oElement, ua = _ua;
	
	if (typeof bUseCapture == "undefined") {
		bUseCapture = false;
	};
	
	this._bUseCapture = bUseCapture;

	if ((el instanceof Array) || (jindo.$A && (el instanceof jindo.$A) && (el=el.$value()))) {
		for(var i=0; i < el.length; i++) this.attach(el[i], ev, bUseCapture);
		return this;
	}

	if (!el || !ev) return this;
	if (typeof el.$value == "function") el = el.$value();

	el = jindo.$(el);
	ev = ev.toLowerCase();
	
	this._tmpElm = el;
	fn = this.bindForEvent();
	this._tmpElm = null;

	if (typeof el.addEventListener != "undefined") {
		if (ev == "domready") {
			ev = "DOMContentLoaded";	
		}else if (ev == "mousewheel" && ua.indexOf("WebKit") < 0 && !/Opera/.test(ua)) {
			ev = "DOMMouseScroll";	
		}else if (ev == "mouseenter"){
			ev = "mouseover";
			fn = jindo.$Fn._fireWhenElementBoundary(el, fn);
		}else if (ev == "mouseleave"){
			ev = "mouseout";
			fn = jindo.$Fn._fireWhenElementBoundary(el, fn);
		} 
		el.addEventListener(ev, fn, bUseCapture);
	} else if (typeof el.attachEvent != "undefined") {
		if (ev == "domready") {
			//iframe안에서 domready이벤트가 실행되지 않기 때문에 error를 던짐.
			if(window.top != window) throw new Error("Domready Event doesn't work in the iframe.");
			jindo.$Fn._domready(el, fn);
			return this;
		} else {
			el.attachEvent("on"+ev, fn);
		}
	}
	
	if (!this._key) {
		this._key = "$"+jindo.$Fn.gc.count++;
		jindo.$Fn.gc.pool[this._key] = this;
	}

	this._events[this._events.length] = {element:el, event:sEvent.toLowerCase(), func:fn};

	return this;
};

/**
 * detach 메서드는 함수를 특정 엘리먼트의 이벤트에서 제거한다.
 * @remark 이벤트 이름은 on 접두어를 사용하지 않는다.
 * @remark 마우스 휠 스크롤 이벤트는 mousewheel 로 사용한다.
 * @param {Element} oElement 이벤트를 제거할 엘리먼트
 * @param {String} sEvent 제거할 이벤트의 이름
 * @see $Fn#attach
 * @description [Lite]
 */
jindo.$Fn.prototype.detach = function(oElement, sEvent) {
	var fn = null, l, el = oElement, ev = sEvent, ua = _ua;
	
	if ((el instanceof Array) || (jindo.$A && (el instanceof jindo.$A) && (el=el.$value()))) {
		for(var i=0; i < el.length; i++) this.detach(el[i], ev);
		return this;
	}

	if (!el || !ev) return this;
	if (jindo.$Element && el instanceof jindo.$Element) el = el.$value();

	el = jindo.$(el);
	ev = ev.toLowerCase();

	var e = this._events;
	for(var i=0; i < e.length; i++) {
		if (e[i].element !== el || e[i].event !== ev) continue;
		
		fn = e[i].func;
		this._events = jindo.$A(this._events).refuse(e[i]).$value();
		break;
	}

	if (typeof el.removeEventListener != "undefined") {
		
		if (ev == "domready") {
			ev = "DOMContentLoaded";
		}else if (ev == "mousewheel" && ua.indexOf("WebKit") < 0) {
			ev = "DOMMouseScroll";
		}else if (ev == "mouseenter"){
			ev = "mouseover";
		}else if (ev == "mouseleave"){
			ev = "mouseout";
		}
		
		el.removeEventListener(ev, fn, false);
	} else if (typeof el.detachEvent != "undefined") {
		if (ev == "domready") {
			jindo.$Fn._domready.list = jindo.$Fn._domready.list.refuse(fn);
			return this;
		} else {
			el.detachEvent("on"+ev, fn);
		}
	}

	return this;
};

/**
 * delay 메서드는 지정한 시간 이후에 지정한 인수로 함수를 호출한다.
 * @param {Number} nSec 함수를 호출할 때까지 기다릴 시간.
 * @param {Array} args 함수를 호출할 때 사용할 인수. 여러 개의 인수를 전달해기 위해 배열을 사용한다.
 * @see $Fn#bind
 * @see $Fn#setInterval
 * @description [Lite]
 * @example
function popup_sum(a, b) {
    alert(a + b);
}

$Fn(popup_sum).delay(5, [3, 5]);
 */
jindo.$Fn.prototype.delay = function(nSec, args) {
	if (typeof args == "undefined") args = [];
	setTimeout(this.bind.apply(this, args), nSec*1000);

	return this;
};

/**
 * setInterval 메서드는 지정한 시간 간격마다 지정한 인수로 함수를 호출한다.
 * @param {Number} nSec 함수를 호출간 간격.
 * @param {Array} args 함수를 호출할 때 사용할 인수. 여러 개의 인수를 전달해기 위해 배열을 사용한다.
 * @return {Object} setInterval로 생성된 객체
 * @see $Fn#bind
 * @see $Fn#delay 
 * @description [Lite]
 * @example
function popup_sum(a, b) {
    alert(a + b);
}

$Fn(popup_sum).setInterval(5, [3, 5]);
 */
jindo.$Fn.prototype.setInterval = function(nSec, args) {
	if (typeof args == "undefined") args = [];
	return setInterval(this.bind.apply(this, args), nSec*1000);
};

/**
 * repeat 메서드는 setInterval와 같다.
 * @param {Number} nSec 함수를 호출간 간격.
 * @param {Array} args 함수를 호출할 때 사용할 인수. 여러 개의 인수를 전달해기 위해 배열을 사용한다.
 * @return {Object} setInterval로 생성된 객체
 * @see $Fn#bind
 * @see $Fn#delay 
 * @description [Lite]
 * @example
function popup_sum(a, b) {
    alert(a + b);
}

$Fn(popup_sum).repeat(5, [3, 5]);
 */
jindo.$Fn.prototype.repeat = jindo.$Fn.prototype.setInterval;

/**
 * 메모리에서 이 객체를 사용한 참조를 모두 해제한다(직접 호출 금지).
 * @param {Element} 해당 요소의 이벤트 핸들러만 해제.
 * @ignore
 */
jindo.$Fn.prototype.free = function(oElement) {
	var len = this._events.length;
	
	while(len > 0) {
		var el = this._events[--len].element;
		var sEvent = this._events[len].event;
		if (oElement && el!==oElement){
			continue;
		}
		
		this.detach(el, sEvent);
		
		//unload시에 엘리먼트에 attach한 함수를 detach하는 로직이 있는데 해당 로직으로 인하여 unload이벤트가 실행되지 않아 실행시키는 로직을 만듬. 그리고 해당 로직은  gc에서 호출할때만 호출.
		var isGCCall = !oElement;
		if (isGCCall && window === el && sEvent == "unload") {
			this.$value()();
		}
		delete this._events[len];
	}
	
	if(this._events.length==0)	
		try { delete jindo.$Fn.gc.pool[this._key]; }catch(e){};
};

/**
 * IE에서 domready(=DOMContentLoaded) 이벤트를 에뮬레이션한다.
 * @ignore
 */
jindo.$Fn._domready = function(doc, func) {
	if (typeof jindo.$Fn._domready.list == "undefined") {
		var f = null, l  = jindo.$Fn._domready.list = jindo.$A([func]);
		
		// use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		var done = false, execFuncs = function(){
			if(!done) {
				done = true;
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
		jindo.$Fn._domready.list.push(func);
	}
};

/**
 * 비 IE에서 mouseenter/mouseleave 이벤트를 에뮬레이션하기 위한 요소 영역을 벗어나는 경우에만 실행하는 함수 필터
 * @ignore
 */
jindo.$Fn._fireWhenElementBoundary = function(doc, func) {
	return function(evt){
		var oEvent = jindo.$Event(evt);
		var relatedElement = jindo.$Element(oEvent.relatedElement);
		if(relatedElement && (relatedElement.isEqual(this) || relatedElement.isChildOf(this))) return;
		
		func.call(this,evt);
	}
};

/**
 * gc 메서드는 Window에서 벗어날 때, DOM Element에 할당된 이벤트 핸들러를 제거한다. ??
 * @see $Fn#free
 */
jindo.$Fn.gc = function() {
	var p = jindo.$Fn.gc.pool;
	for(var key in p) {
		if(p.hasOwnProperty(key))
			try { p[key].free(); }catch(e){ };
	}

	// delete all missing references
	jindo.$Fn.gc.pool = p = {};
};

/**
 * 특정 요소에 할당된 이벤트를 모두 제거한다.
 * @since 1.3.5
 * @see $Fn#gc 
 */
jindo.$Fn.freeElement = function(oElement){
	var p = jindo.$Fn.gc.pool;
	for(var key in p) {
		if(p.hasOwnProperty(key)){
			try { 
				p[key].free(oElement); 
			}catch(e){ };
		}
			
	}	
}

jindo.$Fn.gc.count = 0;

jindo.$Fn.gc.pool = {};

function isUnCacheAgent(){
	var isIPad = (_ua.indexOf("iPad") > -1);
	var isAndroid = (_ua.indexOf("Android") > -1);
	var isMSafari = (!(_ua.indexOf("IEMobile") > -1) && (_ua.indexOf("Mobile") > -1) )||(isIPad && (_ua.indexOf("Safari") > -1));
	
	return isMSafari && !isIPad && !isAndroid;
}


if (typeof window != "undefined" && !isUnCacheAgent()) {
	jindo.$Fn(jindo.$Fn.gc).attach(window, "unload");
}
/**
 * @fileOverview $Event의 생성자 및 메서드를 정의한 파일
 * @name event.js
 */

/**
 * $Event 클래스는 Event 객체의 레퍼(Wrapper) 클래스이다.
 * 사용자는 $Event.element 메서드를 사용하여 이벤트가 실행된 객체를 알 수 있다.
 * @class JavaScript Core 이벤트 객체로부터 $Event 객체를 생성한다.
 * @param {Event} e	DOM Event 객체
 * @constructor
 * @description [Lite]
 * @author Kim, Taegon
 */
jindo.$Event = function(e) {
	var cl = arguments.callee;
	if (e instanceof cl) return e;
	if (!(this instanceof cl)) return new cl(e);

	if (typeof e == "undefined") e = window.event;
	if (e === window.event && document.createEventObject) e = document.createEventObject(e);

	this._event = e;
	this._globalEvent = window.event;

	/** 이벤트의 종류 */
	this.type = e.type.toLowerCase();
	if (this.type == "dommousescroll") {
		this.type = "mousewheel";
	} else if (this.type == "DOMContentLoaded") {
		this.type = "domready";
	}

	this.canceled = false;

	/** 이벤트가 발생한 엘리먼트 */
	this.element = e.target || e.srcElement;
	/** 이벤트가 정의된 엘리먼트 */
	this.currentElement = e.currentTarget;
	/** 이벤트의 연관 엘리먼트 */
	this.relatedElement = null;

	if (typeof e.relatedTarget != "undefined") {
		this.relatedElement = e.relatedTarget;
	} else if(e.fromElement && e.toElement) {
		this.relatedElement = e[(this.type=="mouseout")?"toElement":"fromElement"];
	}
}

/**
 * 마우스 이벤트의 버튼, 휠 정보를 리턴한다.
 * @description [Lite]
 * @example
function eventHandler(evt) {
   var mouse = evt.mouse();

   mouse.delta;   // Number. 휠이 움직인 정도. 휠을 위로 굴리면 양수, 아래로 굴리면 음수.
   mouse.left;    // Boolean. 마우스 왼쪽 버튼을 눌렸으면 true, 아니면 false
   mouse.middle;  // Boolean. 마우스 중간 버튼을 눌렸으면 true, 아니면 false
   mouse.right;   // Boolean. 마우스 오른쪽 버튼을 눌렸으면 true, 아니면 false
}
 * @return {Object} 마우스 정보를 가지는 객체. 리턴한 객체의 속성은 예제를 참조한다.
 */
jindo.$Event.prototype.mouse = function() {
	var e    = this._event;
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

	ret = {
		delta  : delta,
		left   : left,
		middle : mid,
		right  : right
	};
	// replace method
	this.mouse = function(){ return ret };

	return ret;
};

/**
 * 키보드 이벤트 정보를 리턴한다.
 * @description [Lite]
 * @example
function eventHandler(evt) {
   var key = evt.key();

   key.keyCode; // Number. 눌린 키보드의 키코드
   key.alt;     // Boolean. Alt 키를 눌렸으면 true.
   key.ctrl;    // Boolean. Ctrl 키를 눌렸으면 true.
   key.meta;    // Boolean. Meta 키를 눌렸으면 true. Meta키는 맥의 커맨드키를 검출할 때 사용합니다.
   key.shift;   // Boolean. Shift 키를 눌렸으면 true.
   key.up;      // Boolean. 위쪽 화살표 키를 눌렸으면 true.
   key.down;    // Boolean. 아래쪽 화살표 키를 눌렸으면 true.
   key.left;    // Boolean. 왼쪽 화살표 키를 눌렸으면 true.
   key.right;   // Boolean. 오른쪽 화살표 키를 눌렸으면 true.
   key.enter;   // Boolean. 리턴키를 눌렀으면 true
   key.esc;   // Boolean. ESC키를 눌렀으면 true
   }
}
 * @return {Object} 키보드 이벤트의 눌린 키값. 객체의 속성은 예제를 참조한다.
 */
jindo.$Event.prototype.key = function() {
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

/**
 * 마우스 커서의 위치 정보를 리턴한다.
 * @param {Boolean} bGetOffset 현재 엘리먼트에 대한 마우스 커서의 상대위치인 offsetX, offsetY를 구할 것인지의 여부. true면 값을 구한다(offsetX, offsetY는 1.2.0버전부터 추가). $Element 가 포함되어 있어야 한다.
 * @description [Lite]
 * @example
function eventHandler(evt) {
   var pos = evt.pos();

   pos.clientX;  // Number. 현재 화면에 대한 X 좌표
   pos.clientY;  // Number. 현재 화면에 대한 Y 좌표
   pos.pageX;    // Number. 문서 전체에 대한 X 좌표
   pos.pageY;    // Number. 문서 전체에 대한 Y 좌표
   pos.layerX;   // Number. <b>deprecated.</b> 이벤트가 발생한 객체로부터의 상대적인 X 좌표
   pos.layerY;   // Number. <b>deprecated.</b> 이벤트가 발생한 객체로부터의 상대적인 Y 좌표
   pos.offsetX;  // Number. 현재 엘리먼트에 대한 마우스 커서의 상대적인 X좌표 (1.2.0 이상)
   pos.offsetY;  // Number. 현재 엘리먼트에 대한 마우스 커서의 상대적인 Y좌표 (1.2.0 이상)

}
 * @return {Object} 마우스 커서의 위치 정보. 객체의 속성은 예제를 참조한다.
 * @remark layerX, layerY는 차후 지원하지 않을(deprecated) 예정입니다.
 */
jindo.$Event.prototype.pos = function(bGetOffset) {
	var e   = this._event;
	var b   = (this.element.ownerDocument||document).body;
	var de  = (this.element.ownerDocument||document).documentElement;
	var pos = [b.scrollLeft || de.scrollLeft, b.scrollTop || de.scrollTop];
	var ret = {
		clientX : e.clientX,
		clientY : e.clientY,
		pageX   : 'pageX' in e ? e.pageX : e.clientX+pos[0]-b.clientLeft,
		pageY   : 'pageY' in e ? e.pageY : e.clientY+pos[1]-b.clientTop,
		layerX  : 'offsetX' in e ? e.offsetX : e.layerX - 1,
		layerY  : 'offsetY' in e ? e.offsetY : e.layerY - 1
	};

	// 오프셋을 구하는 메소드의 비용이 크므로, 요청시에만 구하도록 한다.
	if (bGetOffset && jindo.$Element) {
		var offset = jindo.$Element(this.element).offset();
		ret.offsetX = ret.pageX - offset.left;
		ret.offsetY = ret.pageY - offset.top;
	}

	return ret;
};

/**
 * 이벤트를 종료한다.
 * @remark 버블링은 특정 DOM 엘리먼트에서 이벤트가 발생했을 때 이벤트가 상위 노드로 전파되는 현상이다. 예를 들어, div 객체를 클릭할 때 div와 함께 상위 엘리먼트인 document에도 onclick 이벤트가 발생한다. stop() 메소드는 지정한 객체에서만 이벤트가 발생하도록 버블링을 차단한다.
 * @description [Lite]
 * @example
function eventHandler(evt) {
   someCode();
   evt.stop();
}
 * @example
// 디폴트 이벤트만 중지시키고 싶을 때 (1.1.3버전 이상)
function stopDefaultOnly(evt) {
	// Here is some code to execute

	// Stop default event only
	evt.stop($Event.CANCEL_DEFAULT);
}
 * @return {$Event} 이벤트 객체.
 * @param {Number} nCancel 이벤트를 정지할 때 버블링, 디폴트 액션 중 정지시킬 값을 지정한다. 기본값은 $Event.CANCEL_ALL 이다(1.1.3 버전 이상).
 */
jindo.$Event.prototype.stop = function(nCancel) {
	nCancel = nCancel || jindo.$Event.CANCEL_ALL;

	var e = (window.event && window.event == this._globalEvent)?this._globalEvent:this._event;
	var b = !!(nCancel & jindo.$Event.CANCEL_BUBBLE); // stop bubbling
	var d = !!(nCancel & jindo.$Event.CANCEL_DEFAULT); // stop default event

	this.canceled = true;

	if (typeof e.preventDefault != "undefined" && d) e.preventDefault();
	if (typeof e.stopPropagation != "undefined" && b) e.stopPropagation();

	if(d) e.returnValue = false;
	if(b) e.cancelBubble = true;

	return this;
};

/**
 * default 이벤트를 종료한다.
 * @return {$Event} 이벤트 객체.
 * @see $Event#stop
 * @description [Lite]
 */
jindo.$Event.prototype.stopDefault = function(){
	return this.stop(jindo.$Event.CANCEL_DEFAULT);
}

/**
 * bubble 이벤트를 종료한다.
 * @return {$Event} 이벤트 객체.
 * @see $Event#stop
 * @description [Lite]
 */
jindo.$Event.prototype.stopBubble = function(){
	return this.stop(jindo.$Event.CANCEL_BUBBLE);
}

/**
 *  $value 메서드는 원래 <Event>를 리턴한다
 * @return {Event} Event
 */
jindo.$Event.prototype.$value = function() {
	return this._event;
};

/**
 * $Event#stop 메서드에서 버블링을 중지시킨다.
 * @final
 */
jindo.$Event.CANCEL_BUBBLE = 1;

/**
 * $Event#stop 메서드에서 디폴트 액션을 중지시킨다.
 * @final
 */
jindo.$Event.CANCEL_DEFAULT = 2;

/**
 * $Event#stop 메서드에서 버블리과 디폴트 액션 모두 중지시킨다.
 * @final
 */
jindo.$Event.CANCEL_ALL = 3;

/**
 * @fileOverview $ElementList의 생성자 및 메서드를 정의한 파일
 * @name elementlist.js
 */

/**
 * $ElementList 객체를 생성 및 리턴한다.
 * @class $ElementList 클래스는 id 배열, 혹은 CSS 쿼리 등을 사용하여 DOM 엘리먼트의 배열을 만든다. 
 * @param {String | Array} els 문서에서 DOM 엘리먼트를 찾기 위한 CSS 선택자 혹은 id, HTMLElement, $Element의 배열
 * @constructor
 * @borrows $Element#show as this.show
 * @borrows $Element#hide as this.hide
 * @borrows $Element#toggle as this.toggle
 * @borrows $Element#addClass as this.addClass
 * @borrows $Element#removeClass as this.removeClass
 * @borrows $Element#toggleClass as this.toggleClass
 * @borrows $Element#fireEvent as this.fireEvent
 * @borrows $Element#leave as this.leave
 * @borrows $Element#empty as this.empty
 * @borrows $Element#appear as this.appear
 * @borrows $Element#disappear as this.disappear
 * @borrows $Element#className as this.className
 * @borrows $Element#width as this.width
 * @borrows $Element#height as this.height
 * @borrows $Element#text as this.text
 * @borrows $Element#html as this.html
 * @borrows $Element#css as this.css
 * @borrows $Element#attr as this.attr
 * @author Kim, Taegon
 */
jindo.$ElementList = function (els) {
	var cl = arguments.callee;
	if (els instanceof cl) return els;
	if (!(this instanceof cl)) return new cl(els);
	
	if (els instanceof Array || (jindo.$A && els instanceof jindo.$A)) {
		els = jindo.$A(els);
	} else if (typeof els == "string" && jindo.cssquery) {
		els = jindo.$A(jindo.cssquery(els));
	} else {
		els = jindo.$A();
	}

	this._elements = els.map(function(v,i,a){ return jindo.$Element(v) });
}

/**
 * get 메서드는 $ElementList에서 인덱스에 해당하는 엘리먼트를 가져온다. 
 * @param {Number} idx 가져올 엘리먼트의 인덱스. 인덱스는 0에서 부터 시작한다.
 * @return {$Element} 인덱스에 해당하는 엘리먼트
*/
jindo.$ElementList.prototype.get = function(idx) {
	return this._elements.$value()[idx];
};

/**
 * getFirst 메서드는 $ElementList의 첫번째 엘리먼트를 가져온다.
 * @remark getFirst 메서드의 리턴값은 $ElementList.get(0)의 리턴값과 동일하다.
 * @return {$Element} 첫번째 엘리먼트
*/
jindo.$ElementList.prototype.getFirst = function() {
	return this.get(0);
};

/**
 * length메소드는 $A의 length를 이용한다.(1.4.3 부터 사용 가능.)
 * @return 	Number 배열의 크기
 * @param 	{Number} [nLen]	새로 리턴할 배열의 크기. nLen이 기존의 배열보다 크면 oValue으로 초기화한 원소를 마지막에 덧붙인다. nLen이 기존 배열보다 작으면 nLen번째 이후의 원소는 제거한다.
 * @param 	{Value} [oValue]	새로운 원소를 추가할 때 사용할 초기값
 * @see $A#length
*/
jindo.$ElementList.prototype.length = function(nLen, oValue) {
	return this._elements.length(nLen, oValue);
}

/**
 * getLast 메서드는 $ElementList의 마지막 엘리먼트를 가져온다.
 * @return {$Element} 마지막 엘리먼트
*/
jindo.$ElementList.prototype.getLast = function() {
	return this.get(Math.Max(this._elements.length-1,0));
};
/**
 * $value 메소드는 자신의 배열 엘리먼트을 반환 한다.
 * @return {Array} $Element가 들어 있는 배열.
*/
jindo.$ElementList.prototype.$value = function() {
	return this._elements.$value();
};

(function(proto){
	var setters = 'show,hide,toggle,addClass,removeClass,toggleClass,fireEvent,leave,';
	setters += 'empty,appear,disappear,className,width,height,text,html,css,attr';
	
	jindo.$A(setters.split(',')).forEach(function(name){
		proto[name] = function() {
			var args = jindo.$A(arguments).$value();
			this._elements.forEach(function(el){
				el[name].apply(el, args);
			});
			
			return this;
		}
	});
	
	jindo.$A(['appear','disappear']).forEach(function(name){
		proto[name] = function(duration, callback) {
			var len  = this._elements.length;
			var self = this;
			this._elements.forEach(function(el,idx){
				if(idx == len-1) {
					el[name](duration, function(){callback(self)});
				} else {
					el[name](duration);
				}
			});
			
			return this;
		}
	});
})(jindo.$ElementList.prototype);
/**
 * @fileOverview $Json의 생성자 및 메서드를 정의한 파일
 * @name json.js
 */

/**
 * 인수로 지정한 문자열을 사용하여 $S 클래스를 생성한다.
 * @class $S 클래스는문자열을 처리하기 위한 레퍼(Wrapper) 클래스이다.
 * @constructor
 * @author Kim, Taegon
 */
jindo.$S = function(str) {
	var cl = arguments.callee;

	if (typeof str == "undefined") str = "";
	if (str instanceof cl) return str;
	if (!(this instanceof cl)) return new cl(str);

	this._str = str+"";
}

/**
 * $value 메서드는 문자열을 리턴한다.
 * @return {String} $S의 내부 문자열
 * @see $S#toString
 */
jindo.$S.prototype.$value = function() {
	return this._str;
};

/**
 * toString 메서드는 문자열을 리턴한다.
 * @return {String} $S의 내부 문자열
 * @remark 내부적으로 $value를 사용한다.
 */
jindo.$S.prototype.toString = jindo.$S.prototype.$value;

/**
 * trim 메서드는 문자열의 양 끝 공백을 제거한다.(1.4.1 부터 전각공백도 제거)
 * @return {$S} 문자열의 양 끝을 제거한 새로운 $S 객체
 * @example
 * var str = "   I have many spaces.   ";
 * document.write ( $S(str).trim() );
 *
 * // 결과 :
 * // I have many spaces.
 */
jindo.$S.prototype.trim = function() {
	return jindo.$S(this._str.replace(/^(\s|　)+|(\s|　)+$/g, ""));
};

/**
 * escapeHTML 메서드는 HTML 특수 문자를 HTML 엔티티 형식으로 변환한다.
 * @return {$S} HTML 특수 문자를 엔티티 형식으로 변환한 새로운 $S 객체
 * @see $S#unescapeHTML
 * @remark  ", &, <, > ,' 를 각각 &quot;, &amp;, &lt;, &gt; &#39;로 변경한다.
 * @example
 * var str = ">_<;;";
 * document.write( $S(str).escapeHTML() );
 *
 * // 결과 :
 * // &amp;gt;_&amp;lt;;;
 */
jindo.$S.prototype.escapeHTML = function() {
	var entities = {'"':'quot','&':'amp','<':'lt','>':'gt','\'':'#39'};
	var s = this._str.replace(/[<>&"']/g, function(m0){
		return entities[m0]?'&'+entities[m0]+';':m0;
	});
	return jindo.$S(s);
};

/**
 * stripTags 메서드는 문자열에서 XML 혹은 HTML 태그를 제거한다.
 * @return {$S} XML 혹은 HTML 태그를 제거한 새로운 $S 객체
 * @example
 * var str = "Meeting <b>people</b> is easy.";
 * document.write( $S(str).stripTags() );
 *
 * // 결과 :
 * // Meeting people is easy.
 */
jindo.$S.prototype.stripTags = function() {
	return jindo.$S(this._str.replace(/<\/?(?:h[1-5]|[a-z]+(?:\:[a-z]+)?)[^>]*>/ig, ''));
};

/**
 * times 메서드는 문자열을 인수로 지정한 숫자만큼 반복한다.
 * @param {Number} nTimes 반복할 횟수
 * @return {$S} 문자열을 지정한 숫자만큼 반복한 새로운 $S 객체
 * @example
 * document.write ( $S("Abc").times(3) );
 *
 * // 결과 : AbcAbcAbc
 */
jindo.$S.prototype.times = function(nTimes) {
	var buf = [];
	for(var i=0; i < nTimes; i++) {
		buf[buf.length] = this._str;
	}

	return jindo.$S(buf.join(''));
};

/**
 * unescapeHTML 메서드는 이스케이프된 HTML을 원래의 HTML로 변환한다.
 * @return {$S} 이스케이프된 HTML을 원래의 HTML로 변환한 새로운 $S 객체
 * @remark  &quot;, &amp;, &lt;, &gt; &#39;를 각각 ", &, <, >, ' 으로 변경한다.
 * @see $S#escapeHTML
 * @example
 * var str = "&lt;a href=&quot;http://naver.com&quot;&gt;Naver&lt;/a&gt;";
 * document.write( $S(str).unescapeHTML() );
 *
 * // 결과 :
 * // <a href="http://naver.com">Naver</a>
 */
jindo.$S.prototype.unescapeHTML = function() {
	var entities = {'quot':'"','amp':'&','lt':'<','gt':'>','#39':'\''};
	var s = this._str.replace(/&([a-z]+|#[0-9]+);/g, function(m0,m1){
		return entities[m1]?entities[m1]:m0;
	});
	return jindo.$S(s);
};

/**
 * escape 메서드는 문자열을 겹따옴표에 포함될 수 있는 ASCI 문자열로 이스케이프 처리한다.
 * @remark \r, \n, \t, ', ", non-ASCII 문자를 이스케이프 처리한다.
 * @return {$S} 문자열을 이스케이프 처리한 새로운 $S 객체
 * @see $S#escapeHTML
 * @example
 * var str = '가"\'나\\';
 * document.write( $S(str).escape() );
 *
 * // 결과 :
 * \uAC00\"\'\uB098\\
 */
jindo.$S.prototype.escape = function() {
	var s = this._str.replace(/([\u0080-\uFFFF]+)|[\n\r\t"'\\]/g, function(m0,m1,_){
		if(m1) return escape(m1).replace(/%/g,'\\');
		return (_={"\n":"\\n","\r":"\\r","\t":"\\t"})[m0]?_[m0]:"\\"+m0;
	});

	return jindo.$S(s);
};

/**
 * bytes 메서드는 문자열의 실제 바이트(byte) 수를 반환한다.(1.4.3 부터 charset사용 가능.)
 * @return 문자열의 바이트 수. 단, 첫번째 파라미터를 설정하면 자기 객체를 반환한다.
 * @param {Number|Object} nBytes 맞출 글자 수 | charset을 지정할쌔 사용(sample참고.)
 * @remark 문서의 charset을 해석해서 인코딩 방식에 따라 한글을 비롯한 유니코드 문자열의 바이트 수를 가변적으로 계산한다. 유니코드 문서가 아니라면, 유니코드 문자열은 항상 2byte로 계산한다.
 * @example
 * // 문서가 euc-kr 환경임을 가정합니다.
 * var str = "한글과 English가 섞인 문장...";
 * document.write( $S(str).bytes() );
 * document.write( $S(str).bytes(20) );
 * document.write( $S(str).bytes({charset:'euc-kr',size:20}) );
 * document.write( $S(str).bytes({charset:'euc-kr'}) );
 * document.write( $S(str).bytes({charset:'euc-kr',size:20}) );
 * // 결과 : 29
 */
jindo.$S.prototype.bytes = function(vConfig) {
	var code = 0, bytes = 0, i = 0, len = this._str.length;
	var charset = ((document.charset || document.characterSet || document.defaultCharset)+"").toLowerCase();
	var cut,nBytes;
	if (typeof vConfig == "undefined") {
		cut = false;
	}else if(vConfig.constructor == Number){
		cut = true;
		nBytes = vConfig;
	}else if(vConfig.constructor == Object){
		charset = vConfig.charset||charset;
		nBytes  = vConfig.size||false;
		cut = !!nBytes;
	}else{
		cut = false;
	}
	
	if (charset == "utf-8") {
		// 유니코드 문자열의 바이트 수는 위키피디아를 참고했다(http://ko.wikipedia.org/wiki/UTF-8).
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

/**
 * parseString 메서드는 URL 쿼리 스트링을 객체로 파싱한다.
 * @return {Object} 문자열을 파싱한 객체
 * @example
 * var str = "aa=first&bb=second";
 * var obj = $S(str).parseString();
 *
 * // obj => { aa : "first", bb : "second" }
 */
jindo.$S.prototype.parseString = function() {
	var str = this._str.split(/&/g), pos, key, val, buf = {},isescape = false;

	for(var i=0; i < str.length; i++) {
		key = str[i].substring(0, pos=str[i].indexOf("=")), isescape = false;
		try{
			val = decodeURIComponent(str[i].substring(pos+1));
		}catch(e){
			isescape = true
			val = decodeURIComponent(unescape(str[i].substring(pos+1)));
		}
		

		if (key.substr(key.length-2,2) == "[]") {
			key = key.substring(0, key.length-2);
			if (typeof buf[key] == "undefined") buf[key] = [];
			buf[key][buf[key].length] = isescape? escape(val) : val;;
		} else {
			buf[key] = isescape? escape(val) : val;
		}
	}

	return buf;
};

/**
 * 정규식에 사용할 수 있도록 문자열을 이스케이프 한다.
 * @since 1.2.0
 * @return {String} 이스케이프된 문자열
 * @example
 * var str = "Slash / is very important. Backslash \ is more important. +_+";
 * document.write( $S(str).escapeRegex() );
 * 
 * // 결과 :
 * // Slash \/ is very important\. Backslash \\ is more important\. \+_\+
 */
jindo.$S.prototype.escapeRegex = function() {
	var s = this._str;
	var r = /([\?\.\*\+\-\/\(\)\{\}\[\]\:\!\^\$\\\|])/g;

	return jindo.$S(s.replace(r, "\\$1"));
};

/**
 * format 메서드는 문자열을 형식 문자열에 대입한 새로운 문자열을 만든다. 형식 문자열은 %로 시작하며, 형식 문자열의 종류는 <a href="http://www.php.net/manual/en/function.sprintf.php">PHP</a>와 동일하다.
 * @param {String} formatString 형식 문자열
 * @return {String} 문자열을 형식 문자열에 대입하여 만든 새로운 문자열.
 * @example
var str = $S("%4d년 %02d월 %02d일").format(2008, 2, 13);
// str == "2008년 02월 13일"

var str = $S("패딩 %5s 빈공백").format("값");
// str == "패딩     값 빈공백"

var str = $S("%b").format(10);
// str == "1010"

var str = $S("%x").format(10);
// str == "a"

var str = $S("%X").format(10);
// str == "A"
 * @see $S#times
 */
jindo.$S.prototype.format = function() {
	var args = arguments;
	var idx  = 0;
	var s = this._str.replace(/%([ 0])?(-)?([1-9][0-9]*)?([bcdsoxX])/g, function(m0,m1,m2,m3,m4){
		var a = args[idx++];
		var ret = "", pad = "";

		m3 = m3?+m3:0;

		if (m4 == "s") {
			ret = a+"";
		} else if (" bcdoxX".indexOf(m4) > 0) {
			if (typeof a != "number") return "";
			ret = (m4 == "c")?String.fromCharCode(a):a.toString(({b:2,d:10,o:8,x:16,X:16})[m4]);
			if (" X".indexOf(m4) > 0) ret = ret.toUpperCase();
		}

		if (ret.length < m3) pad = jindo.$S(m1||" ").times(m3 - ret.length).toString();
		(m2 == '-')?(ret+=pad):(ret=pad+ret);

		return ret;
	});

	return jindo.$S(s);
};

/**
 * @fileOverview $Document 생성자 및 메서드를 정의한 파일
 * @name document.js
 */

/**
 * $Document 객체를 생성 및 리턴한다.
 * @class $Document 클래스는 문서와 관련된 여러가지 기능의 메서드를 제공한다 
 * @param {Document} doc	기능에 사용된 document 객체, 지정하지 않으면 기본적으로 현재 문서의 document 가 지정된다.
 * @constructor
 * @author Hooriza
 */
jindo.$Document = function (el) {
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);
	
	this._doc = el || document;
	
	this._docKey = this.renderingMode() == 'Standards' ? 'documentElement' : 'body';	
};

/**
 * $value 메서드는 래핑된 원래의 document 객체를 리턴한다.
 * @return {HTMLDocument} document 객체
 */
jindo.$Document.prototype.$value = function() {
	return this._doc;
};

/**
 * scrollSize 메서드는 문서의 실제 가로, 세로 크기를 구한다
 * @return {Object} 가로크기는 width, 세로크기는 height 라는 키값으로 리턴된다.
 * @example
var size = $Document().scrollSize();
alert('가로 : ' + size.width + ' / 세로 : ' + size.height); 
 */
jindo.$Document.prototype.scrollSize = function() {

	// webkit 계열에서는 Standard 모드라도 body를 사용해야 정상적인 scroll Size를 얻어온다.
	var isWebkit = navigator.userAgent.indexOf("WebKit")>-1;
	var oDoc = this._doc[isWebkit?'body':this._docKey];
	
	return {
		width : Math.max(oDoc.scrollWidth, oDoc.clientWidth),
		height : Math.max(oDoc.scrollHeight, oDoc.clientHeight)
	};

};

/**
 * scrollPosition 메서드는 문서의 스크롤바 위치를 구한다
 * @return {Object} 가로 위치는 left, 세로위치는 top 라는 키값으로 리턴된다.
 * @example
var size = $Document().scrollPosition();
alert('가로 : ' + size.left + ' / 세로 : ' + size.top); 
* @since 1.3.5
 */
jindo.$Document.prototype.scrollPosition = function() {

	// webkit 계열에서는 Standard 모드라도 body를 사용해야 정상적인 scroll Size를 얻어온다.
	var isWebkit = navigator.userAgent.indexOf("WebKit")>-1;
	var oDoc = this._doc[isWebkit?'body':this._docKey];
	return {
		left : oDoc.scrollLeft||window.pageXOffset||window.scrollX||0,
		top : oDoc.scrollTop||window.pageYOffset||window.scrollY||0
	};

};

/**
 * clientSize 메서드는 스크롤바로 인해 가려진 부분을 제외한 문서 중 보이는 부분의 가로, 세로 크기를 구한다
 * @return {Object} 가로크기는 width, 세로크기는 height 라는 키값으로 리턴된다
 * @example
var size = $Document(document).clientSize();
alert('가로 : ' + size.width + ' / 세로 : ' + size.height); 
 */
jindo.$Document.prototype.clientSize = function() {
	
	var oDoc = this._doc[this._docKey];
	
	var isSafari = navigator.userAgent.indexOf("WebKit")>-1 && navigator.userAgent.indexOf("Chrome")==-1;

	// 사파리의 경우 윈도우 리사이즈시에 clientWidth,clientHeight값이 정상적으로 나오지 않아서 window.innerWidth,innerHeight로 대체
	return (isSafari)?{
					width : window.innerWidth,
					height : window.innerHeight
				}:{
					width : oDoc.clientWidth,
					height : oDoc.clientHeight
				};
};

/**
 * renderingMode 메서드는 문서의 렌더링 방식을 얻는다
 * @return {String} 렌더링 모드
 * <dl>
 *	<dt>Standards</dt>
 *	<dd>표준 렌더링 모드</dd>
 *	<dt>Almost</dt>
 *	<dd>유사 표준 렌더링 모드 (IE 외의 브라우저에서 DTD 을 올바르게 지정하지 않았을때 리턴)</dd>
 *	<dt>Quirks</dt>
 *	<dd>비표준 렌더링 모드</dd>
 * </dl>
 * @example
var mode = $Document().renderingMode();
alert('렌더링 방식 : ' + mode);
 */
jindo.$Document.prototype.renderingMode = function() {

	var isIe = (typeof window.opera=="undefined" && navigator.userAgent.indexOf("MSIE")>-1);
	var isSafari = (navigator.userAgent.indexOf("WebKit")>-1 && navigator.userAgent.indexOf("Chrome")<0 && navigator.vendor.indexOf("Apple")>-1);
	var sRet;

	if ('compatMode' in this._doc){
		sRet = this._doc.compatMode == 'CSS1Compat' ? 'Standards' : (isIe ? 'Quirks' : 'Almost');
	}else{
		sRet = isSafari ? 'Standards' : 'Quirks';
	}

	return sRet;

};

/**
 * 문서에서 주어진 selector를 만족시키는 요소의 배열을 반환한다. 만족하는 요소가 존재하지 않으면 빈 배열을 반환한다.
 * @param {String} sSelector
 * @return {Array} 조건을 만족하는 요소의 배열
 */
jindo.$Document.prototype.queryAll = function(sSelector) { 
	return jindo.$$(sSelector, this._doc); 
};

/**
 * 문서에서 주어진 selector를 만족시키는 요소중 첫 번째 요소를 반환한다. 만족하는 요소가 존재하지 않으면 null을 반환한다.
 * @param {String} sSelector
 * @return {Element} 조건을 만족하는 요소중 첫번째 요소
 */
jindo.$Document.prototype.query = function(sSelector) { 
	return jindo.$$.getSingle(sSelector, this._doc); 
};

/**
 * 문서에서  XPath 문법을 사용하여 엘리먼트를 얻어온다.
 * @remark 지원하는 문법이 무척 제한적으로 특수한 경우에서만 사용하는 것을 권장한다.
 * @param {String} sXPath
 * @return {Array} path에 해당하는 요소
 */
jindo.$Document.prototype.xpathAll = function(sXPath) { 
	return jindo.$$.xpath(sSelector, this._doc); 
};
/**
 * @fileOverview $Form 생성자 및 메서드를 정의한 파일
 * @name form.js
 */

/**
 * $Form 객체를 생성 및 리턴한다.
 * @class $Form 클래스는 <form> 엘리먼트와 하위 입력요소들을 다루기 위한 여러 가지 메서드를 제공한다. 
 * @param {Element | String} el	$Form를 사용할 <form> 엘리먼트, 혹은 <form> 엘리먼트의 고유한 id. 만약 고유하지 않은 id를 지정하면 가장 먼저 나오는 엘리먼트를 반환한다.
 * @constructor
 * @author Hooriza
 */
jindo.$Form = function (el) {
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);
	
	el = jindo.$(el);
	
	if (!el.tagName || el.tagName.toUpperCase() != 'FORM') throw new Error('The element should be a FORM element');
	this._form = el;
}

/**
 * $value 메서드는 랩핑된 원래 <form> 엘리먼트를 리턴한다
 * @return {HTMLElement} <form> 엘리먼트
 * @example

var el = $('<form>');
var form = $Form(el);

alert(form.$value() === el); // true
 
 */
jindo.$Form.prototype.$value = function() {
	return this._form;
};

/**
 * serialize 메서드는 특정 또는 전체 엘리멘트  입력요소를 문자열 형태로 리턴한다.
 * @param {Mixed} Mixed 인수를 지정하지 않거나 인수를 하나 이상 설정할 수 있다. 
 * <dl>
 *	<dt>인수를 지정하지 않을 경우</dt>
 *	<dd>인수를 지정하지 않으면 쿼리 형태의 문자열을 리턴한다.</dd>
 *	<dt>{String} one_element_name</dt>
 *	<dd>인수로 하나의 문자열만 지정하면 문자열과 동일한 name 속성을 가지는 엘리먼트와 그 값을 리턴한다.</dd>
 *	<dt>{String, String... } element_names</dt>
 *	<dd>두 개 이상의 엘리먼트와 그 값을 리턴한다. </dd>
 * </dl>
 * @return {String} 쿼리 문자열 형태로 변환한 엘리먼트와 그 값.
 * @example

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
	alert(allstr == 'ONE=1&TWO=2&THREE=3_2&FOUR=4_3'); // true

	var str = form.serialize('ONE', 'THREE');
	alert(str == 'ONE=1&THREE=3_2'); // true
</script>

 */
jindo.$Form.prototype.serialize = function() {

 	var self = this;
 	var oRet = {};
 	
 	var nLen = arguments.length;
 	var fpInsert = function(sKey) {
 		var sVal = self.value(sKey);
 		if (typeof sVal != 'undefined') oRet[sKey] = sVal;
 	};
 	
 	if (nLen == 0) {
		jindo.$A(this.element()).forEach(function(o) { if (o.name) fpInsert(o.name); });
	}else{
		for (var i = 0; i < nLen; i++) {
			fpInsert(arguments[i]);
		}
	}
 		
 	
	return jindo.$H(oRet).toQueryString();
	
};

/**
 * element 메서드는 특정 또는 전체 입력요소를 리턴한다.
 * @param {String} sKey 얻고자 하는 입력요소 엘리먼트의 name 문자열, 생략시에는 모든 입력요소들을 배열로 리턴한다.
 * @return {HTMLElement | Array} 입력 요소 엘리먼트
 */
jindo.$Form.prototype.element = function(sKey) {

	if (arguments.length > 0)
		return this._form[sKey];
	
	return this._form.elements;
	
};

/**
 * enable 메서드는 입력 요소의 활성화 여부를 얻거나 설정한다.
 * @param {Mixed} mixed 정확한 인수는 다음과 같다. 
 * <dl>
 *	<dt>{String}fieldName</dt>
 *	<dd>인수로 입력요소의 이름만 넣어주면 해당 입력요소의 활성화 여부를 true, false 로 반환한다</dd>
 *	<dt>{String}fieldName, {Boolean}flag</dt>
 *	<dd>입력요소와 Boolean 형의 상태값을 함께 넣어주면 해당 입력요소를 지정한 상태로 활성화 여부를 변경한다</dd>
 *	<dt>{Object}objectProperties</dt>
 *	<dd>동시에 여러개의 입력요소에 대해 활성화 여부를 지정하고 싶을때 사용한다</dd>
 * </dl>
 * @return {Boolean|$Form} 엘리먼트의 활성화 여부를 가져오거나 엘리먼트의 활성화 여부를 설정한 $Form 객체. 
 * @example

<form id="TEST">
	<input name="ONE" disabled="disabled" type="text" />
	<input name="TWO" type="checkbox" />
</form>
<script type="text/javascript">
	var form = $Form('TEST');

	var one_enabled = form.enable('ONE');
	alert(one_enabled === false); // true

	form.enable('TWO', false);

	form.enable({
		'ONE' : true,
		'TWO' : false
	});
</script>

 */
jindo.$Form.prototype.enable = function() {
	
	var sKey = arguments[0];

	if (typeof sKey == 'object') {
		
		var self = this;
		jindo.$H(sKey).forEach(function(bFlag, sKey) { self.enable(sKey, bFlag); });
		return this;
		
	}
	
	var aEls = this.element(sKey);
	if (!aEls) return this;
	aEls = aEls.nodeType == 1 ? [ aEls ] : aEls;
	
	if (arguments.length < 2) {
		
		var bEnabled = true;
		jindo.$A(aEls).forEach(function(o) { if (o.disabled) {
			bEnabled = false;
			jindo.$A.Break();
		}});
		return bEnabled;
		
	} else { // setter
		
		var sFlag = arguments[1];
		jindo.$A(aEls).forEach(function(o) { o.disabled = !sFlag; });
		
		return this;
		
	}
	
};

/**
 * value 메서드는 폼 엘리먼트의 값을 얻거나 설정한다.
 * @param {Mixed} Mixed 정확안 인수 정보는 다음과 같다. 
 * <dl>
 *	<dt>{String}fieldName</dt>
 *	<dd>인수로 엘리먼트의 이름만 지정하면 엘리먼트의 값을 리턴한다</dd>
 *	<dt>{String}fieldName, {String}value</dt>
 *	<dd>엘리먼트의 이름과 엘리먼트에 설정할 값을 함께 지정하면 엘리먼트의 값을 지정한 값으로 바꾼다.하지만 </br> checkbox, radio, selectbox는 해당 값에 많는 엘리먼트를 checked 하거나 selected한다.</dd>
 *	<dt>{Object}objectProperties</dt>
 *	<dd>두 개 이상의 엘리먼트 값을 동시에 지정하고 싶으면 '엘리먼트 이름 : 엘리먼트 값'을 원소로 가지는 객체를 지정한다. </dd>
 * </dl>
 * @return {String|$Form} 인수로 엘리먼트만 지정했다면 지정한 엘리먼트의 값을, 인수로 폼 엘리먼와 엘리먼트의 값을 지정했다면 $Form 객체를 리턴한다.    
 * @example

<form id="TEST">
	<input name="ONE" value="1" type="text" />
	<input name="TWO" value="2" type="checkbox" />
</form>
<script type="text/javascript">
	var form = $Form('TEST');

	var one_value = form.value('ONE');
	alert(one_value === '1'); // true

	var two_value = form.value('TWO');
	alert(two_value === undefined); // true

	form.value('TWO', 2);
	alert(two_value === '2'); // true

	form.value({
		'ONE' : '1111',
		'TWO' : '2'
	});	
	// form.value('ONE') -> 1111
	// form.value('ONE') -> 2
</script>

 */
jindo.$Form.prototype.value = function(sKey) {
	
	if (typeof sKey == 'object') {
		
		var self = this;
		jindo.$H(sKey).forEach(function(bFlag, sKey) { self.value(sKey, bFlag); });
		return this;
		
	}
	
	var aEls = this.element(sKey);
	if (!aEls) throw new Error('The element is not exist');
	aEls = aEls.nodeType == 1 ? [ aEls ] : aEls;
	
	if (arguments.length > 1) { // setter
		
		var sVal = arguments[1];
		
		jindo.$A(aEls).forEach(function(o) {
			
			switch (o.type) {
				case 'radio':
				case 'checkbox':
					o.checked = (o.value == sVal);
					break;
					
				case 'select-one':
					var nIndex = -1;
					for (var i = 0, len = o.options.length; i < len; i++){
						if (o.options[i].value == sVal) nIndex = i;
					}
					o.selectedIndex = nIndex;
	
					break;
					
				default:
					o.value = sVal;
					break;
			}
			
		});
		
		return this;
	}

	// getter
	
	var aRet = [];
	
	jindo.$A(aEls).forEach(function(o) {
		
		switch (o.type) {
		case 'radio':
		case 'checkbox':
			if (o.checked) aRet.push(o.value);
			break;
		
		case 'select-one':
			if (o.selectedIndex != -1) aRet.push(o.options[o.selectedIndex].value);
			break;
			
		default:
			aRet.push(o.value);
			break;
		}
		
	});
	
	return aRet.length > 1 ? aRet : aRet[0];
	
};

/**
 * submit 메서드는 폼의 데이터를 웹으로 제출(submit) 한다.
 * @param {String} sTargetName 제출할 폼이 있는 윈도우의 이름. sTargetName을 생략하면 기본 타겟
 * @param {String} fValidation 제출할 폼의 밸리데이션 함수. form 요소를 인자로 받는다.
 * @return {$Form} 데이터를 제출한 $Form 객체. 
 * @example
var form = $Form(el);
form.submit();
form.submit('foo');
 */
jindo.$Form.prototype.submit = function(sTargetName, fValidation) {
	
	var sOrgTarget = null;
	
	if (typeof sTargetName == 'string') {
		sOrgTarget = this._form.target;
		this._form.target = sTargetName;
	}
	
	if(typeof sTargetName == 'function') fValidation = sTargetName;
	
	if(typeof fValidation != 'undefined'){
		if(!fValidation(this._form)) return this;	
	}	
	
	this._form.submit();
	
	if (sOrgTarget !== null)
		this._form.target = sOrgTarget;
	
	return this;
	
};

/**
 * reset 메서드는 폼을 초기화(reset)한다.
 * @param {String} fValidation 제출할 폼의 밸리데이션 함수. form 요소를 인자로 받는다.
 * @return {$Form} 초기화한 $Form 객체.
 * @example
var form = $Form(el);
form.reset(); 
 */
jindo.$Form.prototype.reset = function(fValidation) {
	
	if(typeof fValidation != 'undefined'){
		if(!fValidation(this._form)) return this;	
	}	
	
	this._form.reset();
	return this;
	
};

/**
 * @fileOverview $Template의 생성자 및 메서드를 정의한 파일
 * @name template.js
 */

/**
 * 템플릿을 실행한다. 첫번째 인수로 템플릿 문자열 또는 문자열을 포함한 HTML 엘리먼트 혹은 엘리먼트의 아이디를 전달할 수 있다.
 * 엘리먼트는 &lt;textarea&gt; 또는 &lt;script type="text/template"&gt; 이 가능하다(&lt;script&gt; 태그를 사용하려면 반드시 type 속성을 지정해주어야 한다).
 * @class $Template 클래스는 템플릿 문자열에 동적으로 문자열을 삽입한다.
 * @constructor
 * @author Kim, Taegon
 * @example
 * <script type="text/javascript">
 * // Template 문자열을 전달하는 경우
 * var tpl = $Template("Value : {=test}");
 * </script>
 * @example
 * <textarea id="tpl1">
 * Value : {=test}
 * </textarea>
 *
 * <script type="text/template" id="tpl2">
 Value : {=test}
 * </script>
 *
 * <script type="text/javascript">
 * // Textarea 엘리먼트를 사용하는 경우
 * var template1 = $Template("tpl1");
 *
 * // Script 엘리먼트를 사용하는 경우
 * var template2 = $Template("tpl2");
 * </script>
 */
jindo.$Template = function(str) {
    var obj = null, tag = "";
    var cl  = arguments.callee;

    if (str instanceof cl) return str;
    if (!(this instanceof cl)) return new cl(str);

    if(typeof str == "undefined") {
		str = "";
	}else if( (obj=document.getElementById(str)||str) && obj.tagName && (tag=obj.tagName.toUpperCase()) && (tag == "TEXTAREA" || (tag == "SCRIPT" && obj.getAttribute("type") == "text/template")) ) {
        str = (obj.value||obj.innerHTML).replace(/^\s+|\s+$/g,"");
    }

    this._str = str+"";
}
jindo.$Template.splitter = /(?!\\)[\{\}]/g;
jindo.$Template.pattern  = /^(?:if (.+)|elseif (.+)|for (?:(.+)\:)?(.+) in (.+)|(else)|\/(if|for)|=(.+)|js (.+)|set (.+))$/;

 /**
 * process 메서드는 템플릿을 해석하고 해석된 결과 문자열을 반환한다.
 * @param {Object} data 변수 및 함수 데이터
 * @return {String} 해석을 마친 새로운 문자열
 * @example
 * // 단순 문자열 치환
 * var tpl  = $Template("Value1 : {=val1}, Value2 : {=val2}")
 * var data = {val1:"first value", val2:"second value"};
 * document.write( tpl.process(data) );
 *
 * // 결과 :
 * // Value1 : first value, Value2 : second value
 *
 * @example
 * // 조건문
 * var tpl= $Template("{if num >= 7}7보다 크거나 같다.{elseif num =< 5}5보다 작거나 같다.{else}아마 6?{/if}");
 * var data = { num:5 };
 * document.write( tpl.process(data) );
 *
 * // 결과 :
 * 5보다 작거나 같다.
 *
 * @example
 * // 반복문 - 인덱스 사용안함
 * var tpl  = $Template("<h1>포탈 사이트</h1>\n<ul> {for site in potals}\n<li><a href="{=site.url}">{=site.name}</a></li>{/for} \n</ul>");
 * var data = {portals:[
 *		{ name : "네이버", url : "http://www.naver.com"  },
 *		{ name : "다음",  url : "http://www.daum.net"  },
 *		{ name : "야후",  url : "http://www.yahoo.co.kr"  }
 * ]};
 *
 * // 결과:
 * <h1>포탈 사이트 목록</h1> <ul> <li>네이버</li><li>다음</li><li>야후</li>
 * <ul>
 * <li><a href="http://www.naver.com">네이버</a></li>
 * <li><a href="http://www.daum.net">다음</a></li>
 * <li><a href="http://www.yahoo.co.kr">야후</a></li>
 * </ul>
 * 
 * @example
 * // 반복문 - 인덱스 사용
 * var tpl  = $Template("{for num:word in numbers}{=word}({=num}) {/for}");
 * var data = { numbers : ["zero", "one", "two", "three"] };
 * document.write( tpl.process(data) );
 *
 * // 결과
 * zero(0) one(1) two(2) three(3) 
 * 
 * @example
 * // 임시변수사용. 
 * var tpl  = $Template("{set val3=val1}Value1 : {=val1}, Value2 : {=val2}, Value3 : {=val3}")
 * var data = {val1:"first value", val2:"second value"};
 * document.write( tpl.process(data) );
 *
 * // 결과 :
 * // Value1 : first value, Value2 : second value, Value3 : first value
 * 
 * @example
 * // javascript사용. 
 * var tpl  = $Template("Value1 : {js $S(=val1).bytes()}, Value2 : {=val2}")
 * var data = {val1:"first value", val2:"second value"};
 * document.write( tpl.process(data) );
 *
 * // 결과 :
 * // Value1 : 11, Value2 : second value
 */
jindo.$Template.prototype.process = function(data) {
	var key = "\x01";
	var leftBrace = "\x02";
	var rightBrace = "\x03";
    var tpl = (" "+this._str+" ").replace(/\\{/g,leftBrace).replace(/\\}/g,rightBrace).replace(/(?!\\)\}\{/g, "}"+key+"{").split(jindo.$Template.splitter), i = tpl.length;
	
    var map = {'"':'\\"','\\':'\\\\','\n':'\\n','\r':'\\r','\t':'\\t','\f':'\\f'};
    var reg = [/(["'](?:(?:\\.)+|[^\\["']+)*["']|[a-zA-Z_][\w\.]*)/g, /[\n\r\t\f"\\]/g, /^\s+/, /\s+$/, /#/g];
    var cb  = [function(m){ return (m.substring(0,1)=='"' || m.substring(0,1)=='\''||m=='null')?m:"d."+m; }, function(m){return map[m]||m}, "", ""];
    var stm = [];
	var lev = 0;

	// remove " "
	tpl[0] = tpl[0].substr(1);
	tpl[i-1] = tpl[i-1].substr(0, tpl[i-1].length-1);

    // no pattern
    if(i<2) return tpl[0];
	
	tpl = jindo.$A(tpl).reverse().$value();
	var delete_info;
    while(i--) {
        if(i%2) {
            tpl[i] = tpl[i].replace(jindo.$Template.pattern, function(){
                var m = arguments;

				// set
				if (m[10]) {
					return m[10].replace(/(\w+)(?:\s*)=(?:\s*)(?:([a-zA-Z0-9_]+)|(.+))$/g, function(){
										var mm = arguments;
										var str = "d."+mm[1]+"=";
										if(mm[2]){
											str+="d."+mm[2];
										}else {
											str += mm[3].replace(   /(=(?:[a-zA-Z_][\w\.]*)+)/g,
                				                                           function(m){ return (m.substring(0,1)=='=')?"d."+m.replace('=','') : m; }
                                				                        );
										}
										return str;
								}) +	";"; 
								
				}
				// js 
				if(m[9]) {
					return 's[i++]=' + m[9].replace(   /(=(?:[a-zA-Z_][\w\.]*)+)/g,
                				                                           function(m){ return (m.substring(0,1)=='=')?"d."+m.replace('=','') : m; }
                                				                        )+';';
				}
                // variables
                if(m[8]) return 's[i++]= d.'+m[8]+';';

                // if
                if(m[1]) {
                    return 'if('+m[1].replace(reg[0],cb[0]).replace(/d\.(typeof) /,'$1 ').replace(/ d\.(instanceof) d\./,' $1 ')+'){';
                }

                // else if
                if(m[2]) return '}else if('+m[2].replace(reg[0],cb[0]).replace(/d\.(typeof) /,'$1 ').replace(/ d\.(instanceof) d\./,' $1 ')+'){';

                // for loop
                if(m[5]) {
					delete_info = m[4];
					var _aStr = [];
					_aStr.push('var t#=d.'+m[5]+'||{},p#=isArray(t#),i#=0;');
					_aStr.push('for(var x# in t#){');
					
					_aStr.push('if(!t#.hasOwnProperty(x#)){continue;}');
					_aStr.push('	if( (p# && isNaN(i#=parseInt(x#))) || (!p# && !t#.propertyIsEnumerable(x#)) ) continue;');
					_aStr.push('	d.'+m[4]+'=t#[x#];');
					_aStr.push(m[3]?'d.'+m[3]+'=p#?i#:x#;':'');
					return _aStr.join("").replace(reg[4], lev++ );
                }

                // else
                if(m[6]) return '}else{';

                // end if, end for
                if(m[7]) {
					if(m[7]=="for"){
						return "delete d."+delete_info+"; };";
					}else{
						return '};';	
					}
                    
                }

                return m[0];
            });
        }else if(tpl[i] == key) {
			tpl[i] = "";
        }else if(tpl[i]){
            tpl[i] = 's[i++]="'+tpl[i].replace(reg[1],cb[1])+'";';
        }
    }
	
	tpl = jindo.$A(tpl).reverse().$value().join('').replace(new RegExp(leftBrace,'g'),"{").replace(new RegExp(rightBrace,'g'),"}");
		
	var _aStr = [];
	_aStr.push('var s=[],i=0;');
	_aStr.push('function isArray(o){ return Object.prototype.toString.call(o) == "[object Array]" };');
	_aStr.push(tpl);
	_aStr.push('return s.join("");');
    tpl = eval("false||function(d){"+_aStr.join("")+"}");
	tpl = tpl(data); 
	//(new Function("d",_aStr.join("")))(data);
	
    return tpl;
};

/**
 * @fileOverview $Date의 생성자 및 메서드를 정의한 파일
 * @name date.js
 */

/**
 * $Date 객체를 생성하고 리턴한다.
 * @extends core
 * @class $Date 클래스는 날짜를 처리하기 위한 Date 타입의 레퍼(Wrapper) 클래스이다. 
 * @constructor
 * @author Kim, Taegon
 * @example
$Date();
$Date(milliseconds);
$Date(dateString);
//1.4.6 이후 부터 달까지만 넣어도 $Date사용 가능하여 빈 값은 1로 셋팅.
$Date(year, month, [date, [hours, [minitues, [seconds, [milliseconds]]]]]);
$Date(2010,6);//이러고 하면 $Date(2010,6,1,1,1,1,1); 와 같음.
 */
jindo.$Date = function(src) {
	var a=arguments,t="";
	var cl=arguments.callee;

	if (src && src instanceof cl) return src;
	if (!(this instanceof cl)) return new cl(a[0],a[1],a[2],a[3],a[4],a[5],a[6]);

	if ((t=typeof src) == "string") {
		if (/(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d)))/.test(src)) {//iso string일때
			var match = src.match(/(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d)(?:[T ](\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(?:Z|(?:([-+])(\d\d)(?::?(\d\d))?)?)?)?)?)?/);
			this._date = new Date(match[1]||0,parseInt(match[2]||0)-1,match[3]||0,match[4]||0,match[5]||0,match[6]||0,match[7]||0);
		}else{
			this._date = cl.parse(src);
		}
		
	} else if (t == "number") {
		if (typeof a[1] == "undefined") {
			//하나의 숫지인 경우는 밀리 세켄드로 계산함.
			this._date = new Date(src);
		}else{
			for(var i = 0 ; i < 7 ; i++){
				if(typeof a[i] != "number"){
					a[i] = 1;
				}
			}
			this._date = new Date(a[0],a[1],a[2],a[3],a[4],a[5],a[6]);
		}
	} else if (t == "object" && src.constructor == Date) {
		(this._date = new Date).setTime(src.getTime());
		this._date.setMilliseconds(src.getMilliseconds());
	} else {
		this._date = new Date;
	}
	this._names = {};
	for(var i in jindo.$Date.names){
		if(jindo.$Date.names.hasOwnProperty(i))
			this._names[i] = jindo.$Date.names[i];	
	}
}

/**
 * names 속성은 $Date에서 사용할 달, 요일, 오전/오후의 이름을 저장한 문자열이다. s_ 를 접두어로 가지는 이름들은 약어(abbreviation)이다.
 */
jindo.$Date.names = {
	month   : ["January","Febrary","March","April","May","June","July","August","September","October","Novermber","December"],
	s_month : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
	day     : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
	s_day   : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
	ampm    : ["AM", "PM"]
};

/**
 * now 메서드는 현재 시간을 밀리초 단위의 정수로 리턴한다.
 * @return {Number} 밀리초 단위의 정수인 현재 시간
 */
jindo.$Date.now = function() {
	return Date.now();
};
/**
 * names속성을 셋팅 혹은 가져 온다.(1.4.1 추가)
 * @param {Object} oNames
 */
jindo.$Date.prototype.name = function(oNames){
	if(arguments.length){
		for(var i in oNames){
			if(oNames.hasOwnProperty(i))
				this._names[i] = oNames[i];
		}
	}else{
		return this._names;
	}
}

/**
 * parse 메서드는 인수로 지정한 문자열을 파싱하여 문자열의 형식에 맞는 Date 객체를 생성한다. 
 * @param {String} strDate 날짜, 혹은 시간 형식을 지정한 파싱 대상 문자열
 * @return {Object} Date 객체. 
 */
jindo.$Date.parse = function(strDate) {
	return new Date(Date.parse(strDate));
};

/**
 * $value 메서드는 $Date가 감싸고 있던 원본 Date 객체를 반환한다.
 * @returns {Object} Date 객체
 */
jindo.$Date.prototype.$value = function(){
	return this._date;
};

/**
 * format 메서드는 $Date 객체가 저장하고 있는 시간을 인수로 지정한 형식 문자열에 맞추어 변환한다. 형식 문자열은 PHP의 date 함수와 동일하게 사용한다.
	<table>
		<caption>날짜</caption>
		<thead>
			<tr>
				<th scope="col">문자</th>
				<th scope="col">설명</th>
				<th scope="col">기타</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>d</td>
				<td>두자리 날짜</td>
				<td>01 ~ 31</td>
			</tr>
			<tr>
				<td>j</td>
				<td>0 없는 날짜</td>
				<td>1 ~ 31</td>
			</tr>
			<tr>
				<td>l (소문자L)</td>
				<td>주의 전체 날짜</td>
				<td>$Date.names.day에 지정되는 날짜</td>
			</tr>
			<tr>
				<td>D</td>
				<td>요약된 날짜</td>
				<td>$Date.names.s_day에 지정된 날짜</td>
			</tr>
			<tr>
				<td>w</td>
				<td>그 주의 몇번째 일</td>
				<td>0(일) ~ 6(토)</td>
			</tr>
			<tr>
				<td>N</td>
				<td>ISO-8601 주의 몇번째 일</td>
				<td>1(월) ~ 7(일)</td>
			</tr>
			<tr>
				<td>S</td>
				<td>2글자, 서수형식의 표현(1st, 2nd)</td>
				<td>st, nd, rd, th</td>
			</tr>
			<tr>
				<td>z</td>
				<td>해당 년도의 몇번째 일(0부터)</td>
				<td>0 ~ 365</td>
			</tr>
		</tbody>
	</table>
	<table>
		<caption>월</caption>
		<thead>
			<tr>
				<th scope="col">문자</th>
				<th scope="col">설명</th>
				<th scope="col">기타</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>m</td>
				<td>두자리 고정으로 월</td>
				<td>01 ~ 12</td>
			</tr>
			<tr>
				<td>n</td>
				<td>앞에 0제외 월</td>
				<td>1 ~ 12</td>
			</tr>
		</tbody>
	</table>
	<table>
		<caption>년</caption>
		<thead>
			<tr>
				<th scope="col">문자</th>
				<th scope="col">설명</th>
				<th scope="col">기타</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>L</td>
				<td>윤년 여부</td>
				<td>true, false</td>
			</tr>
			<tr>
				<td>o</td>
				<td>4자리 연도</td>
				<td>2010</td>
			</tr>
			<tr>
				<td>Y</td>
				<td>o와 같음.</td>
				<td>2010</td>
			</tr>
			<tr>
				<td>y</td>
				<td>2자리 연도</td>
				<td>10</td>
			</tr>
		</tbody>
	</table>
	<table>
		<caption>시</caption>
		<thead>
			<tr>
				<th scope="col">문자</th>
				<th scope="col">설명</th>
				<th scope="col">기타</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>a</td>
				<td>소문자 오전, 오후</td>
				<td>am,pm</td>
			</tr>
			<tr>
				<td>A</td>
				<td>대문자 오전,오후</td>
				<td>AM,PM</td>
			</tr>
			<tr>
				<td>g</td>
				<td>(12시간 주기)0없는 두자리 시간.</td>
				<td>1~12</td>
			</tr>
			<tr>
				<td>G</td>
				<td>(24시간 주기)0없는 두자리 시간.</td>
				<td>0~24</td>
			</tr>
			<tr>
				<td>h</td>
				<td>(12시간 주기)0있는 두자리 시간.</td>
				<td>01~12</td>
			</tr>
			<tr>
				<td>H</td>
				<td>(24시간 주기)0있는 두자리 시간.</td>
				<td>00~24</td>
			</tr>
			<tr>
				<td>i</td>
				<td>0포함 2자리 분.</td>
				<td>00~59</td>
			</tr>
			<tr>
				<td>s</td>
				<td>0포함 2자리 초</td>
				<td>00~59</td>
			</tr>
			<tr>
				<td>u</td>
				<td>microseconds</td>
				<td>654321</td>
			</tr>
		</tbody>
	</table>
	<table>
		<caption>기타</caption>
		<thead>
			<tr>
				<th scope="col">문자</th>
				<th scope="col">설명</th>
				<th scope="col">기타</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>U</td>
				<td>Unix Time(1970 00:00:00 GMT) </td>
				<td></td>
			</tr>
		</tbody>
	</table>
 * @param {Date} strFormat  형식 문자열
 * @returns {String} 시간을 형식 문자열에 맞추어 변환한 문자열.
 * @example
	var oDate = $Date("Jun 17 2009 12:02:54");
	oDate.format("Y.m.d(D) A H:i") => "2009.06.17(Wed) PM 12:02"
 */
jindo.$Date.prototype.format = function(strFormat){
	var o = {};
	var d = this._date;
	var name = this.name();
	return (strFormat||"").replace(/[a-z]/ig, function callback(m){
		if (typeof o[m] != "undefined") return o[m];

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
				o.L = this.isLeapYear();
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
				o.U = this.time();
				return o.U;
			default:
				return m;
		}
	});
};

/**
 * time 메서드는 GMT 1970/01/01 00:00:00을 기준으로 경과한 시간을 설정하거나 가져온다.
 * @param {Number} nTime 밀리 초 단위의 시간 값. 
 * @return {$Date | Number} 인수를 지정했다면 GMT 1970/01/01 00:00:00 에서 부터 인수만큼 지난 시간을 설정한 $DAte 객체. 인수를 지정하지 않았다면 GMT 1970/01/01 00:00:00에서 부터 $Date 객체에 지정된 시각까지 경과한 시간(밀리 초).
 */
jindo.$Date.prototype.time = function(nTime) {
	if (typeof nTime == "number") {
		this._date.setTime(nTime);
		return this;
	}

	return this._date.getTime();
};

/**
 * year 메서드는 년도를 설정하거나 가져온다.
 * @param {Number} nYear 설정할 년도값
 * @return {$Date | Number} 인수를 지정하였다면 새로 년도 값을 설정한 $Date 객체. 인수를 지정하지 않았다면 $Date 객체가 지정하고 있는 시각의 년도를 리턴한다.
 */
jindo.$Date.prototype.year = function(nYear) {
	if (typeof nYear == "number") {
		this._date.setFullYear(nYear);
		return this;
	}

	return this._date.getFullYear();
};

/**
 * month 메서드는 달을 설정하거나 가져온다.
 * @param {Number} nMon 설정할 달의 값
 * @return {$Date | Number} 인수를 지정하였다면 새로 달을 설정한 $Date 객체. 인수를 지정하지 않았다면 $Date 객체가 지정하고 있는 시각의 달을 리턴한다.
 * @remark 리턴 값의 범위는 0(1월)에서 11(12월)이다.
 */
jindo.$Date.prototype.month = function(nMon) {
	if (typeof nMon == "number") {
		this._date.setMonth(nMon);
		return this;
	}

	return this._date.getMonth();
};

/**
 * date 메서드는 날짜를 설정하거나 가져온다.
 * @param {nDate} nDate	설정할 날짜 값
 * @return {$Date | Number} 인수를 지정하였다면 새로 날짜를 설정한 $Date 객체. 인수를 지정하지 않았다면 $Date 객체가 지정하고 있는 시각의 날짜를 리턴한다.
 */
jindo.$Date.prototype.date = function(nDate) {
	if (typeof nDate == "number") {
		this._date.setDate(nDate);
		return this;
	}

	return this._date.getDate();
};

/**
 * day 메서드는 요일을 가져온다. 
 * @return {Number} 요일 값. 0(일요일)에서 6(토요일)을 리턴한다. 
 */
jindo.$Date.prototype.day = function() {
	return this._date.getDay();
};

/**
 * hours 메서드는 시(時)를 설정하거나 가져온다.
 * @param {Number} nHour 설정할 시 값
 * @return {$Date | Number} 인수를 지정하였다면 새로 시 값을 설정한 $Date 객체. 인수를 지정하지 않았다면 $Date 객체가 지정하고 있는 시각의 시 값.
 */
jindo.$Date.prototype.hours = function(nHour) {
	if (typeof nHour == "number") {
		this._date.setHours(nHour);
		return this;
	}

	return this._date.getHours();
};

/**
 * minutes 메서드는 분을 설정하거나 가져온다.
 * @param {Number} nMin 설정할 분 값
 * @return {Number} 인수를 지정하였다면 새로 분 값을 설정한 $Date 객체. 인수를 지정하지 않았다면 $Date 객체가 지정하고 있는 시각의 분 값.
 */
jindo.$Date.prototype.minutes = function(nMin) {
	if (typeof nMin == "number") {
		this._date.setMinutes(nMin);
		return this;
	}

	return this._date.getMinutes();
};

/**
 * seconds 메서드는 초을 설정하거나 가져온다.
 * @param {Number} nSec 설정할 초 값
 * @return {Number} 인수를 지정하였다면 새로 초 값을 설정한 $Date 객체. 인수를 지정하지 않았다면 $Date 객체가 지정하고 있는 시각의 초 값.
 */
jindo.$Date.prototype.seconds = function(nSec) {
	if (typeof nSec == "number") {
		this._date.setSeconds(nSec);
		return this;
	}

	return this._date.getSeconds();
};

/**
 * isLeapYear 메서드는 시각의 윤년 여부를 확인한다.
 * @returns {Boolean} $Date가 가리키고 있는 시각이 윤년이면 True, 그렇지 않다면 False
 */
jindo.$Date.prototype.isLeapYear = function() {
	var y = this._date.getFullYear();

	return !(y%4)&&!!(y%100)||!(y%400);
};
/**
 * @fileOverView $Window의 생성자 및 메서드를 정의한 파일
 * @name window.js
 */

/**
 * $Window 객체를 생성하고 생성한 객체를 반환한다.
 * @class $Window 객체는 자바스크립트 네이티브 객체인 window 객체를 래핑하고, 이를 다루기 위한 여러가지 메서드를 제공한다.
 * @param {HTMLWidnow} el $Window로 감쌀 window 엘리먼트.
 * @author gony
 */
jindo.$Window = function(el) {
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);

	this._win = el || window;
}

/**
 * $value 메서드는 $Window 객체로 감싼 원래의 window 객체를 반환한다.
 * @return {HTMLWindow} window 엘리먼트
 */
jindo.$Window.prototype.$value = function() {
	return this._win;
};

/**
 * resizeTo 메서드는 window 객체의 크기를 주어진 크기로 변경한다.
 * 이 크기는 프레임을 포함한 창 전체의 크기를 나타내므로 실제로 표현하는 컨텐트 사이즈는
 * 브라우저 종류와 설정에 따라 달라질 수 있다.
 * 브라우저에 따라 보안 문제 때문에, 창 크기가 화면의 가시 영역을 벗어나서 커지지 못하도록 막는 경우도 있다. 이 경우에는 지정한 크기보다 작게 창이 커진다.
 * @param {Number} nWidth 창의 너비
 * @param {Number} nHeight 창의 높이
 * @return {$Window} 창 크기가 변경된 $Window 객체 this
 * @see $Window#resizeBy
 * @example
 * 	// 현재 창의 너비를 400, 높이를 300으로 변경한다.
 *  $Window.resizeTo(400, 300);
 */
jindo.$Window.prototype.resizeTo = function(nWidth, nHeight) {
	this._win.resizeTo(nWidth, nHeight);
	return this;
};

/**
 * resizeBy 메서드는 window 객체의 크기를 주어진 크기만큼 변경한다.
 * @param {Number} nWidth 늘어날 창의 너비
 * @param {Number} nHeight 늘어날 창의 높이
 * @see $Window#resizeTo
 * @example
 *   // 현재 창의 너비를 100, 높이를 50 만큼 늘린다.
 *   $Window().resize(100, 50);
 */
jindo.$Window.prototype.resizeBy = function(nWidth, nHeight) {
	this._win.resizeBy(nWidth, nHeight);
	return this;
};

/**
 * moveTo 메서드는 창을 주어진 위치로 이동시킨다. 좌표는 프레임을 포함 윈도우의 좌측 상단을 기준으로 한다.
 * @param {Number} nLeft 이동할 x좌표 (pixel 단위)
 * @param {Number} nTop 이동할 y좌표 (pixel 단위)
 * @see $Window#moveBy
 * @example
 *  // 현재 창을 (15, 10) 으로 이동시킨다.
 *  $Window().moveTo(15, 10);
 */
jindo.$Window.prototype.moveTo = function(nLeft, nTop) {
	this._win.moveTo(nLeft, nTop);
	return this;
};

/**
 * moveTo 메서드는 창을 주어진 위치만큼 이동시킨다.
 * @param {Number} nLeft x좌표로 이동할 양 (pixel 단위)
 * @param {Number} nTop y좌표 이동할 양 (pixel 단위)
 * @see $Window#moveTo
 * @example
 *  // 현재 창을 좌측으로 15px, 아래로 10px만큼 이동시킨다.
 *  $Window().moveBy(15, 10);
 */
 jindo.$Window.prototype.moveBy = function(nLeft, nTop) {
	this._win.moveBy(nLeft, nTop);
	return this;
};

/**
 * sizeToContent 메서드는 내부 문서 크기에 맞추어 객체의 크기를 변경한다.remark에 있는 제액사항에 걸리는 경우 파라메터를 윈도우의 사이지를 지정할수 있다.
해당 메소드는 몇가지 제약 사항을 가진다. 
<ul>
	<li>메서드의 특성상 내부 문서가 완전히 로딩된 다음에 실행되어야 한다. </li>
	<li>창이 내부 문서보다 큰 경우에는 내부 문서를 구할 수 없으므로, 반드시 창 크기를 내부 문서보다 작게 만든다.</li>
	<li>반드시 body에 사이즈가 있어야 한다.</li>
	<li>html의 DOCTYPE이 Quirks일때 맥에서는 opera(10), 윈도우에서는 IE6+, opera(10), safari(4)에서 정상적으로 작동하지 않음.</li>
</ul>
 * @param {Number} nWidth  width의 값.
 * @param {Number} nHeight height의 값.
 * @example
 * // 새 창을 띄우고 자동으로 창 크기를 컨텐트에 맞게 변경하는 함수
 * function winopen(url) {	
 *		try {
 *			win = window.open(url, "", "toolbar=0,location=0,status=0,menubar=0,scrollbars=0,resizable=0,width=250,height=300");
 *			win.moveTo(200, 100);
 *			win.focus();
 *		} catch(e){}
 *
 *		setTimeout(function() {
 *			$Window(win).sizeToContent();
 *		}, 1000);
 *		
 *	}
 *
 * winopen('/samples/popup.html');
 */


	
jindo.$Window.prototype.sizeToContent = function(nWidth, nHeight) {
	if (typeof this._win.sizeToContent == "function") {
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
		this.resizeBy(nWidth, nHeight);
	}

	return this;
};
/**
 * @fileOverview	다른 프레임웍 없이 jindo만 사용할 경우 편의성을 위해 jindo 객체를 window에 붙임
 */
// copy jindo objects to window
if (typeof window != "undefined") {
	for (prop in jindo) {
		if (jindo.hasOwnProperty(prop)) {
			window[prop] = jindo[prop];
		}
	}
}
