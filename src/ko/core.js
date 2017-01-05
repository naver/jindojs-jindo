/**

 * @fileOverview	$() 함수, $Jindo() 객체, $Class() 객체를 정의한 파일.          
  
 */

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
	var cl=arguments.callee;
	var cc=cl._cached;
	
	if (cc) return cc;
	if (!(this instanceof cl)) return new cl();
	if (!cc) cl._cached = this;
	
	this.version = "@version@";
}

/** 

 * @function
 * @description $() 함수는 DOM 에서 특정 요소를 조작할 수 있게 가져오거나, 요소를 생성한다.
 * <ul>
 * 	<li>ID를 사용하여 DOM 요소(Element)를 가져온다. 파라미터를 두 개 이상 지정하면 DOM 요소를 원소로하는 배열을 반환한다.</li>
 *  <li>또한 "&lt;tagName&gt;" 과 같은 형식의 문자열을 입력하면 tagName 요소를 가지는 객체를 생성한다.</li>
 * </ul>
 * @param {String} sID1 가져올 첫 번째 DOM 요소의 ID 또는 생성할 DOM 요소
 * @param {String} […] …
 * @param {String} [sIDN] 가져올 N 번째 DOM 요소의 ID(Jindo 1.4.6 버전부터 마지막 파라미터에 document 요소을 지정할 수 있다.).
 * @return {Variant} ID 값으로 지정한 DOM 요소(Element) 혹은 DOM 요소를 원소로 가지는 배열(Array)을 반환한다. 만약 ID에 해당하는 요소가가 없으면 null 값을 반환한다. 요소를 생성한 경우는 객체(Object) 형태로 반환한다.
 * @example
// ID를 이용하여 객체를 리턴한다.
<div id="div1"></div>

var el = $("div1");

// ID를 이용하여 여러개의 객체를 리턴한다.
<div id="div1"></div>
<div id="div2"></div>

var els = $("div1","div2"); // [$("div1"),$("div2")]와 같은 결과를 리턴한다.

// tagName과 같은 형식의 문자열을 이용하여 객체를 생성한다.
var el = $("<DIV>");
var els = $("<DIV id='div1'><SPAN>hello</SPAN></DIV>");

//IE는 iframe에 추가할 엘리먼트를 생성하려고 할 때는 document를 반드시 지정해야 한다.(1.4.6 부터 지원)
var els = $("<div>" , iframe.contentWindow.document);
//위와 같을 경우 div태그가 iframe.contentWindow.document기준으로 생김.
  
 */
jindo.$ = function(sID/*, id1, id2*/) {
	var ret = [], arg = arguments, nArgLeng = arg.length, lastArgument = arg[nArgLeng-1],doc = document,el  = null;
	var reg = /^<([a-z]+|h[1-5])>$/i;
	var reg2 = /^<([a-z]+|h[1-5])(\s+[^>]+)?>/i;
	if (nArgLeng > 1 && typeof lastArgument != "string" && lastArgument.body) {
        /*
         
마지막 인자가 document일때.
  
         */
		arg = Array.prototype.slice.apply(arg,[0,nArgLeng-1]);
		doc = lastArgument;
	}

	for(var i=0; i < nArgLeng; i++) {
		el = arg[i];
		if (typeof el == "string") {
			el = el.replace(/^\s+|\s+$/g, "");
			
			if (el.indexOf("<")>-1) {
				if (reg.test(el)) {
					el = doc.createElement(RegExp.$1);
				}else if (reg2.test(el)) {
					var p = { thead:'table', tbody:'table', tr:'tbody', td:'tr', dt:'dl', dd:'dl', li:'ul', legend:'fieldset',option:"select" };
					var tag = RegExp.$1.toLowerCase();
		 				
					var ele = jindo._createEle(p[tag],el,doc);
					for (var i=0,leng = ele.length; i < leng ; i++) {
						ret.push(ele[i]);
					};
					el = null;
					
				}
			}else {
				el = doc.getElementById(el);
			}
		}
		if (el) ret[ret.length] = el;
	}
	return ret.length>1?ret:(ret[0] || null);
}

jindo._createEle = function(sParentTag,sHTML,oDoc,bWantParent){
	var sId = 'R' + new Date().getTime() + parseInt(Math.random() * 100000,10);

	var oDummy = oDoc.createElement("div");
	switch (sParentTag) {
		case 'select':
		case 'table':
		case 'dl':
		case 'ul':
		case 'fieldset':
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
			break;
	}
	var oFound;
	for (oFound = oDummy.firstChild; oFound; oFound = oFound.firstChild){
		if (oFound.className==sId) break;
	}
	
	return bWantParent? oFound : oFound.childNodes;
}

/**

 * @class $Class() 객체는 Jindo 프레임워크를 사용하여 객체 지향 프로그래밍 방식으로 애플리케이션을 구현할 수 있도록 지원한다.
 * @extends core
 * @description 클래스($Class() 객체)를 생성한다. 파라미터로 클래스화할 객체를 입력한다. 해당 객체에 $init 이름으로 메서드를 등록하면 클래스 인스턴스를 생성하는 생성자 함수를 정의할 수 있다. 또한 $static 키워드를 사용하면 인스턴스를 생성하지 않아도 사용할 수 있는 메서드를 등록할 수 있다.
 * @param {Object} oDef 클래스를 정의하는 객체. 클래스의 생성자, 속성, 메서드 등을 정의한다.
 * @return {$Class} 생성된 클래스($Class() 객체).
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

CClass.static_method(); // 1
  
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

 * @description extend() 메서드는 특정 클래스($Class() 객체)를 상속한다. 상속할 부모 클래스(Super Class)를 지정한다.
 * @name $Class#extend
 * @type $Class
 * @function
 * @param {$Class} superClass 상속할 부모 클래스($Class() 객체).
 * @return {$Class} 상속된 클래스($Class() 객체).
 * @example
var ClassExt = $Class(classDefinition);
ClassExt.extend(superClass);
// ClassExt는 SuperClass를 상속받는다.
  
 */
jindo.$Class.extend = function(superClass) { 
	// superClass._$has_super = true;
	if (typeof superClass == "undefined" || superClass === null || !superClass.extend) {
		throw new Error("extend시 슈퍼 클래스는 Class여야 합니다.");
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

/**

  @description $super 속성은 부모 클래스의 메서드에 접근할 때 사용한다. 하위 클래스는 this.$super.method 로 상위 클래스의 메서드에 접근할 수 있으나, this.$super.$super.method 와 같이 한 단계 이상의 상위 클래스는 접근할 수 없다. 또한 부모 클래스와 자식 클래스가 같은 이름의 메서드를 가지고 있고 $super로 그 메서드를 호출하면, 자식 클래스의 메서드를 사용한다. 
 @name $Class#$super
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
	oChild.$super.sum();    // 30 -> 부모 클래스의 100(a)과 200(b)대신 자식 클래스의 10(a)과 20(b)을 더한다.
	oChild.$super.sum2();   // 20 -> 부모 클래스의 sum2 메서드에서 부모 클래스의 sum()이 아닌 자식 클래스의 sum()을 호출한다.
  
*/