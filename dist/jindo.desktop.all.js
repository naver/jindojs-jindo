/**
 * Jindo2 Framework
 * @type desktop
 * @version 1.5.3
 * NAVER_Library:Jindo-1.5.3;JavaScript Framework;
 */
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
	
	this.version = "1.5.3";
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
/**
 
 * @fileOverview CSS 셀렉터를 사용한 엘리먼트 선택 엔진
 * @name cssquery.js
 * @author Hooriza
  
 */

/**
 
 * @class
 * @description $$() 함수(cssquery)는 CSS 선택자(CSS Selector)를 사용하여 객체를 탐색한다. $$() 함수 대신 cssquery() 함수를 사용해도 된다. CSS 선택자로 사용할 수 있는 패턴은 표준 패턴과 비표준 패턴이 있다. 표준 패턴은 CSS Level3 명세서에 있는 패턴을 지원한다. 선택자의 패턴에 대한 설명은 다음 표와 See Also 항목을 참고한다.<br>
<table>
	<caption>요소, ID, 클래스 선택자</caption>
	<thead>
		<tr>
			<th scope="col">패턴</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>*</td>
			<td>모든 요소.
				<textarea name="code" class="js:nocontrols">
				$$("*");
				// 문서의 모든 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>HTML Tagname</td>
			<td>지정된 HTML 태그 요소.
				<textarea name="code" class="js:nocontrols">
				$$("div");
				// 문서의 모든 &lt;div&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>#id</td>
			<td>ID가 지정된 요소.
				<textarea name="code" class="js:nocontrols">
				$$("#application")
				// ID가 application인 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>.classname</td>
			<td>클래스가 지정된 요소.
				<textarea name="code" class="js:nocontrols">
				$$(".img");
				// 클래스가 img인 요소.
				</textarea>
			</td>
		</tr>
	</tbody>
</table>

<table>
	<caption>속성 선택자</caption>
	<thead>
		<tr>
			<th scope="col">패턴</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>[type]</td>
			<td>지정된 속성을 갖고 있는 요소.
				<textarea name="code" class="js:nocontrols">
				$$("input[type]");
				// type 속성을 갖는 &lt;input&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>[type=value]</td>
			<td>속성과 값이 일치하는 요소.
				<textarea name="code" class="js:nocontrols">
				$$("input[type=text]");
				// type 속성 값이 text인 &lt;input&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>[type^=value]</td>
			<td>속성의 값이 특정 값으로 시작하는 요소.
				<textarea name="code" class="js:nocontrols">
				$$("input[type^=hid]");
				//type 속성 값이 hid로 시작하는 &lt;input&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>[type$=value]</td>
			<td>속성의 값이 특정 값으로 끝나는 요소.
				<textarea name="code" class="js:nocontrols">
				$$("input[type$=en]");
				//type 속성 값이 en으로 끝나는 &lt;input&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>[type~=value]</td>
			<td>속성 값에 공백으로 구분된 여러 개의 값이 존재하는 경우, 각각의 값 중 한가지 값을 갖는 요소.
				<textarea name="code" class="js:nocontrols">
				&lt;img src="..." alt="welcome to naver"&gt;
				$$("img[alt~=welcome]");  // 있음.
				$$("img[alt~=naver]");  // 있음.
				$$("img[alt~=wel]");  // 없음.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>[type*=value]</td>
			<td>속성 값 중에 일치하는 값이 있는 요소.
				<textarea name="code" class="js:nocontrols">
				$$("img[alt*=come]");  // 있음.
				$$("img[alt*=nav]");  // 있음.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>[type!=value]</td>
			<td>값이 지정된 값과 일치하지 않는 요소.
				<textarea name="code" class="js:nocontrols">
				$$("input[type!=text]");
				// type 속성 값이 text가 아닌 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>[@type]</td>
			<td>cssquery 전용으로 사용하는 선택자로서 요소의 속성이 아닌 요소의 스타일 속성을 사용한다. CSS 속성 선택자의 특성을 모두 적용해 사용할 수 있다.
				<textarea name="code" class="js:nocontrols">
				$$("div[@display=block]");
				// &lt;div&gt; 요소 중에 display 스타일 속성의 값이 block인 요소.
				</textarea>
			</td>
		</tr>
	</tbody>
</table>

<table>
	<caption>가상 클래스 선택자</caption>
	<thead>
		<tr>
			<th scope="col">패턴</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>:nth-child(n)</td>
			<td>n번째 자식인지 여부로 해당 요소를 선택한다.
				<textarea name="code" class="js:nocontrols">
				$$("div:nth-child(2)");
				// 두 번째 자식 요소인 &lt;div&gt; 요소.
				
				$$("div:nth-child(2n)");
				$$("div:nth-child(even)");
				// 짝수 번째 자식 요소인 모든 &lt;div&gt; 요소.
				
				$$("div:nth-child(2n+1)");
				$$("div:nth-child(odd)");
				// 홀수 번째 자식 요소인 모든 &lt;div&gt; 요소.
				
				$$("div:nth-child(4n)");
				// 4의 배수 번째 자식 요소인 모든 &lt;div&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>:nth-last-child(n)</td>
			<td>nth-child와 동일하나, 뒤에서부터 요소를 선택한다.
				<textarea name="code" class="js:nocontrols">
				$$("div:nth-last-child(2)");
				// 뒤에서 두 번째 자식 요소인 모든 &lt;div&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>:last-child</td>
			<td>마지막 자식인지 여부로 요소를 선택한다.
				<textarea name="code" class="js:nocontrols">
				$$("div:last-child");
				// 마지막 자식 요소인 모든 &lt;div&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>:nth-of-type(n)</td>
			<td>n번째로 발견된 요소를 선택한다.
				<textarea name="code" class="js:nocontrols">
				&lt;div&gt;
					&lt;p&gt;1&lt;/p&gt;
					&lt;span&gt;2&lt;/span&gt;
					&lt;span&gt;3&lt;/span&gt;
				&lt;/div&gt;
				</textarea>
				위와 같은 DOM이 있을 때, $$("span:nth-child(1)")은 &lt;span&gt; 요소가 firstChild인 요소는 없기 때문에 결과 값을 반환하지 않는다 하지만 $$("span:nth-of-type(1)")는 &lt;span&gt; 요소 중에서 첫 번째 &lt;span&gt; 요소인 &lt;span&gt;2&lt;/span&gt;를 얻어오게 된다.<br>nth-child와 마찬가지로 짝수/홀수 등의 수식을 사용할 수 있다.
			</td>
		</tr>
		<tr>
			<td>:first-of-type</td>
			<td>같은 태그 이름을 갖는 형제 요소 중에서 첫 번째 요소를 선택한다.<br>nth-of-type(1)과 같은 결과 값을 반환한다.</td>
		</tr>
		<tr>
			<td>:nth-last-of-type</td>
			<td>nth-of-type과 동일하나, 뒤에서부터 요소를 선택한다.</td>
		</tr>
		<tr>
			<td>:last-of-type</td>
			<td>같은 태그 이름을 갖는 형제 요소 중에서 마지막 요소를 선택한다.<br>nth-last-of-type(1)과 같은 결과 값을 반환한다.</td>
		</tr>
		<tr>
			<td>:contains</td>
			<td>텍스트 노드에 특정 문자열을 포함하고 있는지 여부로 해당 요소를 선택한다.
				<textarea name="code" class="js:nocontrols">
				$$("span:contains(Jindo)");
				// "Jindo" 문자열를 포함하고 있는 &lt;span&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>:only-child</td>
			<td>형제가 없는 요소를 선택한다.
				<textarea name="code" class="js:nocontrols">
				&lt;div&gt;
					&lt;p&gt;1&lt;/p&gt;
					&lt;span&gt;2&lt;/span&gt;
					&lt;span&gt;3&lt;/span&gt;
				&lt;/div&gt;
				</textarea>
				위의 DOM에서 $$("div:only-child")만 반환 값이 있고, $$("p:only-child") 또는 $$("span:only-child")는 반환 값이 없다. 즉, 형제 노드가 없는 &lt;div&gt; 요소만 선택된다.
			</td>
		</tr>
		<tr>
			<td>:empty</td>
			<td>비어있는 요소를 선택한다.
				<textarea name="code" class="js:nocontrols">
				$$("span:empty");
				// 텍스트 노드 또는 하위 노드가 없는 &lt;span&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>:not</td>
			<td>선택자의 조건과 반대인 요소를 선택한다.
				<textarea name="code" class="js:nocontrols">
				$$("div:not(.img)");
				// img 클래스가 없는 &lt;div&gt; 요소.
				</textarea>
			</td>
		</tr>
	</tbody>
</table>

<table>
	<caption>콤비네이터 선택자</caption>
	<thead>
		<tr>
			<th scope="col">패턴</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>공백 (space)</td>
			<td>하위의 모든 요소를 의미한다.
				<textarea name="code" class="js:nocontrols">
				$$("body div");
				// &lt;body&gt; 요소 하위에 속한 모든 &lt;div&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>&gt;</td>
			<td>자식 노드에 속하는 모든 요소를 의미한다.
				<textarea name="code" class="js:nocontrols">
				$$("div &gt; span");
				// &lt;div&gt; 요소의 자식 요소 중 모든 &lt;span&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>+</td>
			<td>지정한 요소의 바로 다음 형제 노드에 속하는 모든 요소를 의미한다.
				<textarea name="code" class="js:nocontrols">
				$$("div + p");
				// &lt;div&gt; 요소의 nextSibling에 해당하는 모든 &lt;p&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>~</td>
			<td>+ 패턴과 동일하나, 바로 다음 형제 노드뿐만 아니라 지정된 노드 이후에 속하는 모든 요소를 의미한다.
				<textarea name="code" class="js:nocontrols">
				$$("div ~ p");
				// &lt;div&gt; 요소 이후의 형제 노드에 속하는 모든 &lt;p&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>!</td>
			<td>cssquery 전용으로, 콤비네이터의 반대 방향으로 탐색을 시작해 요소를 검색한다.
				<textarea name="code" class="js:nocontrols">
				$$("span ! div");
				// &lt;span&gt; 요소의 상위에 있는 모든 &lt;div&gt; 요소.
				</textarea>
			</td>
		</tr>
	</tbody>
</table>
 * @param {String} sSelector CSS 선택자. CSS 선택자로 사용할 수 있는 패턴은 표준 패턴과 비표준 패턴이 있다. 표준 패턴은 CSS Level3 명세서에 있는 패턴을 지원한다.
 * @param {Element} [elBaseElement] 탐색 대상이 되는 DOM 요소. 지정한 요소의 하위 노드에서만 객체를 탐색한다. 생략될 경우 문서를 대상으로 찾는다. 
 * @return {Array} 조건에 해당하는 요소를 배열 형태로 반환한다.
 * @see $Document#queryAll
 * @see <a href="http://www.w3.org/TR/css3-selectors/">CSS Level3 명세서</a> - W3C
 * @example
 // 문서에서 IMG 태그를 찾는다.
 var imgs = $$('IMG');

 // div 요소 하위에서 IMG 태그를 찾는다.
 var imgsInDiv = $$('IMG', $('div'));

 // 문서에서 IMG 태그 중 가장 첫 요소를 찾는다.
 var firstImg = $$.getSingle('IMG');
  
 */
jindo.$$ = jindo.cssquery = (function() {
	/*
	 
querySelector 설정.
  
	 */
	var sVersion = '3.0';
	
	var debugOption = { repeat : 1 };
	
	/*
	 
빠른 처리를 위해 노드마다 유일키 값 셋팅
  
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
	
	/*
	 
따옴표, [] 등 파싱에 문제가 될 수 있는 부분 replace 시켜놓기
  
	 */
	var backupKeys = function(sQuery) {
		
		var oKeys = backupKeys._keys;
		
		/*
		 
작은 따옴표 걷어내기
  
		 */
		sQuery = sQuery.replace(/'(\\'|[^'])*'/g, function(sAll) {
			var uid = uniqid('QUOT');
			oKeys[uid] = sAll;
			return uid;
		});
		
		/*
		 
큰 따옴표 걷어내기
  
		 */
		sQuery = sQuery.replace(/"(\\"|[^"])*"/g, function(sAll) {
			var uid = uniqid('QUOT');
			oKeys[uid] = sAll;
			return uid;
		});
		
		/*
		 
[ ] 형태 걷어내기
  
		 */
		sQuery = sQuery.replace(/\[(.*?)\]/g, function(sAll, sBody) {
			if (sBody.indexOf('ATTR') == 0) return sAll;
			var uid = '[' + uniqid('ATTR') + ']';
			oKeys[uid] = sAll;
			return uid;
		});
	
		/*
		
( ) 형태 걷어내기
  
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
	 
replace 시켜놓은 부분 복구하기
  
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
		
( ) 는 한꺼풀만 벗겨내기
  
		 */
		sQuery = sQuery.replace(/_BRCE[0-9]+/g, function(sKey) {
			return oKeys[sKey] ? oKeys[sKey] : sKey;
		});
		
		return sQuery;
		
	};
	
	/*
	 
replace 시켜놓은 문자열에서 Quot 을 제외하고 리턴
  
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
		
		/*
		 
노드 인덱스를 구할 수 없으면
  
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
	 
몇번째 자식인지 설정하는 부분
  
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
	 
가상 클래스
  
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
	 
단일 part 의 body 에서 expression 뽑아냄
  
	 */
	var getExpression = function(sBody) {

		var oRet = { defines : '', returns : 'true' };
		
		var sBody = restoreKeys(sBody, true);
	
		var aExprs = [];
		var aDefineCode = [], aReturnCode = [];
		var sId, sTagName;
		
		/*
		 
유사클래스 조건 얻어내기
  
		 */
		var sBody = sBody.replace(/:([\w-]+)(\(([^)]*)\))?/g, function(_1, sType, _2, sOption) {
			
			switch (sType) {
			case 'not':
                /*
                 
괄호 안에 있는거 재귀파싱하기
  
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
				break;
			}
			
			return '';
			
		});
		
		/*
		 
[key=value] 형태 조건 얻어내기
  
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
		 
클래스 조건 얻어내기
  
		 */
		var sBody = sBody.replace(/\.([\w-]+)/g, function(_, sClass) { 
			aExprs.push({ key : 'class', op : '~=', val : sClass });
			if (!sClassName) sClassName = sClass;
			return '';
		});
		
		/*
		 
id 조건 얻어내기
  
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
		 
match 함수 코드 만들어 내기
  
		 */
		var oVars = {};
		
		for (var i = 0, oExpr; oExpr = aExprs[i]; i++) {
			
			var sKey = oExpr.key;
			
			if (!oVars[sKey]) aDefineCode.push(getDefineCode(sKey));
            /*
             
유사클래스 조건 검사가 맨 뒤로 가도록 unshift 사용
  
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
	 
쿼리를 연산자 기준으로 잘라냄
  
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
	 
잘라낸 part 를 함수로 컴파일 하기
  
	 */
	var compileParts = function(aParts) {
		
		var aPartExprs = [];
		
		/*
		 
잘라낸 부분들 조건 만들기
  
		 */
		for (var i = 0, oPart; oPart = aParts[i]; i++)
			aPartExprs.push(getExpression(oPart.body));
		
		//////////////////// BEGIN
		
		var sFunc = '';
		var sPushCode = 'aRet.push(oEl); if (oOptions.single) { bStop = true; }';

		for (var i = aParts.length - 1, oPart; oPart = aParts[i]; i--) {
			
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
		
		eval('var fpCompiled = ' + sFunc + ';');
		return fpCompiled;
		
	};
	
	/*
	 
쿼리를 match 함수로 변환
  
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
	 
test 쿼리를 match 함수로 변환
  
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
	
	var oResultCache = null;
	var bUseResultCache = false;
	var bExtremeMode = false;
		
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
					
				/*
				 
ownerDocument 잡아주기
  
				 */
				oDocument_dontShrink = oParent.ownerDocument || oParent.document || oParent;
				
				/*
				 
브라우저 버젼이 IE5.5 이하
  
				 */
				if (/\bMSIE\s([0-9]+(\.[0-9]+)*);/.test(navigator.userAgent) && parseFloat(RegExp.$1) < 6) {
					try { oDocument_dontShrink.location; } catch(e) { oDocument_dontShrink = document; }
					
					oDocument_dontShrink.firstChild = oDocument_dontShrink.getElementsByTagName('html')[0];
					oDocument_dontShrink.firstChild._IE5_parentNode = oDocument_dontShrink;
				}
				
				/*
				 
XMLDocument 인지 체크
  
				 */
				bXMLDocument = (typeof XMLDocument != 'undefined') ? (oDocument_dontShrink.constructor === XMLDocument) : (!oDocument_dontShrink.location);
				getUID = bXMLDocument ? getUID4XML : getUID4HTML;
		
				clearKeys();
				
				/*
				 
쿼리를 쉼표로 나누기
  
				 */
				var aSplitQuery = backupKeys(sQuery).split(/\s*,\s*/);
				var aResult = [];
				
				var nLen = aSplitQuery.length;
				
				for (var i = 0; i < nLen; i++)
					aSplitQuery[i] = restoreKeys(aSplitQuery[i]);
				
				/*
				 
쉼표로 나눠진 쿼리 루프
  
				 */
				for (var i = 0; i < nLen; i++) {
					
					var sSingleQuery = aSplitQuery[i];
					var aSingleQueryResult = null;
					
					var sResultCacheKey = sSingleQuery + (oOptions.single ? '_single' : '');
		
					/*
					 
결과 캐쉬 뒤짐
  
					 */
					var aCache = bUseResultCache ? oResultCache[sResultCacheKey] : null;
					if (aCache) {
						
						/*
						 
캐싱되어 있는게 있으면 parent 가 같은건지 검사한후 aSingleQueryResult 에 대입
  
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
						// alert(fpFunction);
						
						cssquery._marked = [];
						for (var j = 0, nDepth = fpFunction.depth; j < nDepth; j++)
							cssquery._marked.push({});
						
						// console.log(fpFunction.toSource());
						aSingleQueryResult = distinct(fpFunction(oParent, oOptions));
						
						/*
					     
결과 캐쉬를 사용중이면 캐쉬에 저장
  
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
			return /\[\s*(?:checked|selected|disabled)/.test(sQuery)
		}
		function _commaRevise (sQuery,sChange) {
			return sQuery.replace(/\,/gi,sChange);
		}
		
		var protoSlice = Array.prototype.slice;
		
		var _toArray = function(aArray){
			return protoSlice.apply(aArray);
		}
		
		try{
			protoSlice.apply(document.documentElement.childNodes);
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
         
		 */
		cssquery = function(sQuery, oParent, oOptions){
			oParent = oParent || document ;
			try{
				if (_isNonStandardQueryButNotException(sQuery)) {
					throw Error("None Standard Query");
				}else{
					var sReviseQuery = sQuery;
					var oReviseParent = oParent;
					if (oParent.nodeType != 9) {
						if(bExtremeMode){
							if(!oParent.id) oParent.id = "p"+ new Date().getTime() + parseInt(Math.random() * 100000000,10);
						}else{
							throw Error("Parent Element has not ID.or It is not document.or None Extreme Mode.");
						}
						sReviseQuery = _commaRevise("#"+oParent.id+" "+sQuery,", #"+oParent.id);
						oReviseParent = oParent.ownerDocument||oParent.document||document;
					}
					if (oOptions&&oOptions.single) {
						return [oReviseParent.querySelector(sReviseQuery)];
					}else{
						return _toArray(oReviseParent.querySelectorAll(sReviseQuery));
					}
				}
			}catch(e){
				return old_cssquery(sQuery, oParent, oOptions);
			}
		}
	}else{
		cssquery = old_cssquery;
	}
	/**
     
 * @function
 * @name $$.test
 * @description test() 메서드는 특정 요소가 해당 CSS 선택자(CSS Selector)에 부합하는 요소인지 판단하여 Boolean 형태로 반환한다. CSS 선택자에 연결자는 사용할 수 없음에 유의한다. 선택자의 패턴에 대한 설명은 $$() 함수와 See Also 항목을 참고한다.
 * @param {Element} element	검사하고자 하는 요소
 * @param {String} sCSSSelector	CSS 선택자. CSS 선택자로 사용할 수 있는 패턴은 표준 패턴과 비표준 패턴이 있다. 표준 패턴은 CSS Level3 명세서에 있는 패턴을 지원한다.
 * @return {Boolean} 조건에 부합하면 true, 부합하지 않으면 false를 반환한다.
 * @see $$
 * @see <a href="http://www.w3.org/TR/css3-selectors/">CSS Level3 명세서</a> - W3C
 * @example
// oEl 이 div 태그 또는 p 태그, 또는 align 속성이 center로 지정된 요소인지 검사한다.
if (cssquery.test(oEl, 'div, p, [align=center]'))
alert('해당 조건 만족');
  
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
     
 * @function
 * @name $$.useCache
 * @description useCache() 메서드는 $$() 함수(cssquery)를 사용할 때 캐시를 사용할 것인지 설정한다. 캐시를 사용하면 동일한 선택자로 탐색하는 경우 탐색하지 않고 기존 탐색 결과를 반환한다. 따라서 사용자가 변수 캐시를 신경쓰지 않고 편하고 빠르게 사용할 수 있는 장점이 있지만 신뢰성을 위해 DOM 구조가 동적으로 변하지 않을 때만 사용해야 한다.
 * @param {Boolean} [bFlag] 캐시 사용 여부를 지정한다. 이 파라미터를 생략하면 캐시 사용 상태만 반환한다.
 * @return {Boolean} 캐시 사용 상태를 반환한다.
 * @see <a href="#.$$.clearCache">$$.clearCache</a>
  
	 */
	cssquery.useCache = function(bFlag) {
	
		if (typeof bFlag != 'undefined') {
			bUseResultCache = bFlag;
			cssquery.clearCache();
		}
		
		return bUseResultCache;
		
	};
	
	/**
     
 * @function
 * @name $$.clearCache
 * @description clearCache() 메서드는 $$() 함수(cssquery)에서 캐시를 사용할 때 캐시를 비울 때 사용한다. DOM 구조가 동적으로 바껴 기존의 캐시 데이터가 신뢰성이 없을 때 사용한다.
 * @return {void}
 * @see <a href="#.$$.useCache">$$.useCache</a>
  
	 */
	cssquery.clearCache = function() {
		oResultCache = {};
	};
	
	/**
     
 * @function
 * @name $$.getSingle
 * @description getSingle() 메서드는 CSS 선택자를 사용에서 조건을 만족하는 첫 번째 요소를 가져온다. 반환하는 값은 배열이 아닌 객채 또는 null이다. 조건을 만족하는 요소를 찾으면 바로 탐색 작업을 중단하기 때문에 결과가 하나라는 보장이 있을 때 빠른 속도로 결과를 가져올 수 있다.
 $$() 함수(cssquery)에서 캐시를 사용할 때 캐시를 비울 때 사용한다. DOM 구조가 동적으로 바껴 기존의 캐시 데이터가 신뢰성이 없을 때 사용한다.
 * @param {String} sSelector CSS 선택자(CSS Selector). CSS 선택자로 사용할 수 있는 패턴은 표준 패턴과 비표준 패턴이 있다. 표준 패턴은 CSS3 Level3 명세서에 있는 패턴을 지원한다. 선택자의 패턴에 대한 설명은 $$() 함수와 See Also 항목을 참고한다.
 * @param {Element} [oBaseElement] 탐색 대상이 되는 DOM 요소. 지정한 요소의 하위 노드에서만 객체를 탐색한다. 생략될 경우 문서를 대상으로 찾는다. 
 * @param {Object} [oOption] 옵션 객체에 onTimeOffCache 속성을 true로 설정하면 탐색할 때 캐시를 사용하지 않는다.
 * @return {Element} 선택된 요소. 결과가 없으면 null을 반환한다.
 * @see $Document#query	 
 * @see <a href="#.$$.useCache">$$.useCache</a>
 * @see $$
 * @see <a href="http://www.w3.org/TR/css3-selectors/">CSS Level3 명세서</a> - W3C
  
	 */
	cssquery.getSingle = function(sQuery, oParent, oOptions) {

		return cssquery(sQuery, oParent, { single : true ,oneTimeOffCache:oOptions?(!!oOptions.oneTimeOffCache):false})[0] || null;
	};
	
	
	/**
     
 * @function
 * @name $$.xpath
 * @description xpath() 메서드는 XPath 문법을 만족하는 요소를 가져온다. 지원하는 문법이 제한적이므로 특수한 경우에만 사용할 것을 권장한다.
 * @param {String} sXPath XPath 값.
 * @param {Element} [elBaseElement] 탐색 대상이 되는 DOM 요소. 지정한 요소의 하위 노드에서만 객체를 탐색한다. 생략될 경우 문서를 대상으로 찾는다. 
 * @return {Array} XPath 문법을 만족하는 요소를 원소로 하는 배열. 결과가 없으면 null을 반환한다.
 * @see $Document#xpathAll
 * @see <a href="http://www.w3.org/standards/techs/xpath#w3c_all">XPath 문서</a> - W3C
  
	 */
	cssquery.xpath = function(sXPath, oParent) {
		
		var sXPath = sXPath.replace(/\/(\w+)(\[([0-9]+)\])?/g, function(_1, sTag, _2, sTh) {
			sTh = sTh || '1';
			return '>' + sTag + ':nth-of-type(' + sTh + ')';
		});
		
		return old_cssquery(sXPath, oParent);
		
	};
	
	/**
     
 * @function
 * @name $$.debug
 * @description debug() 메서드는 $$() 함수(cssquery)를 사용할 때 성능을 측정하기 위한 기능을 제공하는 함수이다. 파라미터로 입력한 콜백 함수를 사용하여 성능을 측정한다.
 * @param {Function} fCallback 선택자 실행에 소요된 비용과 시간을 점검하는 함수. 이 파라미터에 함수 대신 false를 입력하면 성능 측정 모드(debug)를 사용하지 않는다. 이 콜백 함수는 파라미터로 query, cost, executeTime을 갖는다.<br>
 <ul>
	<li>query는 실행에 사용된 선택자이다.</li>
	<li>index는 탐색에 사용된 비용이다(루프 횟수).</li>
	<li>executeTime 탐색에 소요된 시간이다.</li>
 * @param {Number} [nRepeat] 하나의 선택자를 반복 수행할 횟수. 인위적으로 실행 속도를 늦추기 위해 사용할 수 있다.
 * @return {Void}
 * @example
cssquery.debug(function(sQuery, nCost, nExecuteTime) {
	if (nCost > 5000)
		console.warn('5000이 넘는 비용이? 확인 -> ' + sQuery + '/' + nCost);
	else if (nExecuteTime > 200)
		console.warn('0.2초가 넘게 실행을? 확인 -> ' + sQuery + '/' + nExecuteTime);
}, 20);

....

cssquery.debug(false);
  
	 */
	cssquery.debug = function(fpCallback, nRepeat) {
		
		debugOption.callback = fpCallback;
		debugOption.repeat = nRepeat || 1;
		
	};
	
	/**
     
 * @function
 * @name $$.safeHTML
 * @description safeHTML() 메서드는 인터넷 익스플로러에서 innerHTML 속성을 사용할 때 _cssquery_UID 값이 나오지 않게 하는 함수이다. true로 설정하면 탐색하는 노드의 innerHTML 속성에 _cssquery_UID가 나오지 않게 할 수 있지만 탐색 속도는 느려질 수 있다.
 * @param {Boolean} bFlag _cssquery_UID의 표시 여부를 지정한다. true로 설정하면 _cssquery_UID가 나오지 않는다.
 * @return {Boolean} _cssquery_UID 표시 여부 상태를 반환한다. _cssquery_UID를 표시하는 상태이면 true를 반환하고 그렇지 않으면 false를 반환한다.
  
	 */
	cssquery.safeHTML = function(bFlag) {
		
		var bIE = /MSIE/.test(window.navigator.userAgent);
		
		if (arguments.length > 0)
			safeHTML = bFlag && bIE;
		
		return safeHTML || !bIE;
		
	};
	
	/**
     
 * @field
 * @name $$.version
 * @description version 속성은 cssquery의 버전 정보를 담고 있는 문자열이다.
  
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
	/**
     
	 * querySelector가 있는 브라우져에서 extreme을 실행시키면 querySelector을 사용할수 있는 커버리지가 높아져 전체적으로 속도가 빨리진다.
	 * 하지만 ID가 없는 엘리먼트를 기준 엘리먼트로 넣었을 때 기준 엘리먼트에 임의의 아이디가 들어간다.
	 * @param {Boolean} bExtreme true
  
	 */
	cssquery.extreme = function(bExtreme){
		if(arguments.length == 0){
			bExtreme = true;
		}
		bExtremeMode = bExtreme;
	}

	return cssquery;
	
})();


/**

 * @fileOverview $Agent() 객체의 생성자 및 메서드를 정의한 파일
 * @author Kim, Taegon  
	
 */

/**

 * @class $Agent() 객체는 운영체제, 브라우저를 비롯한 사용자 시스템 정보를 제공한다.
 * @constructor
 * @description $Agent() 객체를 생성한다. $Agent() 객체는 사용자 시스템의 운영 체제 정보와 브라우저 정보를 제공한다.  
	
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

 * @description navigator() 메서드는 사용자 브라우저 정보를 담고 있는 객체를 반환한다. 브라우저 정보를 저장하는 객체는 브라우저 이름과 버전을 속성으로 가진다. 브라우저 이름은 영어 소문자로 표시하며, 사용자의 브라우저와 일치하는 브라우저 속성은 true 값을 가진다. 또한, 사용자의 브라우저 이름을 확인할 수 있도록 메서드를 제공한다. 다음은 사용자 브라우저 정보를 담고 있는 객체의 속성과 메서드를 설명한 표이다.<br>
 <table>
	<caption>브라우저 정보 객체 속성</caption>
	<thead>
		<tr>
			<th scope="col">이름</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>camino</td>
			<td>Boolean</td>
			<td>카미노(Camino) 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>chrome</td>
			<td>Boolean</td>
			<td>구글 크롬(Chrome) 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>firefox</td>
			<td>Boolean</td>
			<td>파이어폭스(Firefox) 브라우저 사용 여부를 불리언 형태로 저장한다. </td>
		</tr>
		<tr>
			<td>icab</td>
			<td>Boolean</td>
			<td>iCab 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>ie</td>
			<td>Boolean</td>
			<td>인터넷 익스플로러(Internet Explorer) 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>konqueror</td>
			<td>Boolean</td>
			<td>Konqueror 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>mie</td>
			<td>Boolean</td>
			<td>인터넷 익스플로러 모바일(Internet Explorer Mobile) 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>mobile</td>
			<td>Boolean</td>
			<td>모바일 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>mozilla</td>
			<td>Boolean</td>
			<td>모질라(Mozilla) 계열의 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>msafari</td>
			<td>Boolean</td>
			<td>Mobile 버전 Safari 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>nativeVersion</td>
			<td>Number</td>
			<td>인터넷 익스플로러 호환 모드의 브라우저를 사용할 경우 실제 브라우저를 저장한다.</td>
		</tr>
		<tr>
			<td>netscape</td>
			<td>Boolean</td>
			<td>넷스케이프(Netscape) 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>omniweb</td>
			<td>Boolean</td>
			<td>OmniWeb 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>opera</td>
			<td>Boolean</td>
			<td>오페라(Opera) 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>safari</td>
			<td>Boolean</td>
			<td>Safari 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>version</td>
			<td>Number</td>
			<td>사용자가 사용하고 있는 브라우저의 버전 정보를 저장한다. 실수(Float) 형태로 버전 정보를 저장하며 버전 정보가 없으면 -1 값을 가진다.</td>
		</tr>
		<tr>
			<td>webkit</td>
			<td>WebKit 계열 부라우저 사용 여부를 불리언 형태로 저장한다. </td>
		</tr>
	</tbody>
</table>
<table>
	<caption>브라우저 정보 객체 메서드</caption>
	<thead>
		<tr>
			<th scope="col">이름</th>
			<th scope="col">반환 타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>getName()</td>
			<td>String</td>
			<td>사용자가 사용하고 있는 브라우저의 이름을 반환한다. 반환하는 브라우저의 이름은 속성 이름과 동일하다.</td>
		</tr>
	</tbody>
 </table>
 * @return {Object}<br>브라우저 정보를 저장하는 객체.
 * @since 1.4.3 버전부터 mobile,msafari,mopera,mie 사용 가능.<br>1.4.5 버전부터 ipad에서 mobile은 false를 반환한다.
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

	info.mobile	   = (f("Mobile",u)||f("Android",u)||f("Nokia",u)||f("webOS",u)||f("Opera Mini",u)||f("BlackBerry",u)||(f("Windows",u)&&f("PPC",u))||f("Smartphone",u)||f("IEMobile",u))&&!f("iPad",u);
	info.msafari   = (!f("IEMobile",u) && f("Mobile",u))||(f("iPad",u)&&f("Safari",u));
	info.mopera    = f("Opera Mini",u);
	info.mie       = f("PPC",u)||f("Smartphone",u)||f("IEMobile",u);

	try {
		
		if (info.ie) {
			ver = u.match(/(?:MSIE) ([0-9.]+)/)[1];
			if (u.match(/(?:Trident)\/([0-9.]+)/)){
				var nTridentNum = parseInt(RegExp.$1,10);
				if(nTridentNum > 3){
					nativeVersion = nTridentNum + 4;	
				}
			}
		} else if (info.safari||info.msafari) {
			
			ver = parseFloat(u.match(/Safari\/([0-9.]+)/)[1]);
			if (ver == 100) {
				ver = 1.1;
			} else {
				if(u.match(/Version\/([0-9.]+)/)){
					ver = RegExp.$1;
				}else{
					ver = [1.0,1.2,-1,1.3,2.0,3.0][Math.floor(ver/100)];	
					
				}
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

 * @description os() 메서드는 사용자 운영체제 정보를 담고 있는 객체를 반환한다. 운영체제 정보를 저장하는 객체는 운영체제 이름을 속성으로 가진다. 운영 체제 속성은 영어 소문자로 표시하며, 사용자의 운영체제와 일치하는 운영체제의 속성은 true 값을 가진다. 또한 사용자의 운영체제 이름을 확인할 수 있도록 메서드를 제공한다.<br> 다음은 사용자 운영체제 정보를 담고 있는 객체의 속성과 메서드를 설명한 표이다.<br>
<table>
	<caption>운영체제 정보 객체 속성</caption>
	<thead>
		<tr>
			<th scope="col">이름</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>android</td>
			<td>Boolean</td>
			<td>Android 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>blackberry</td>
			<td>Boolean</td>
			<td>Blackberry 운영체제 사용 여부를 불리언 형태로 저장한다. </td>
		</tr>
		<tr>
			<td>iphone</td>
			<td>Boolean</td>
			<td>iPhone 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>linux</td>
			<td>Boolean</td>
			<td>Linux운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>mac</td>
			<td>Boolean</td>
			<td>Mac운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>mwin</td>
			<td>Boolean</td>
			<td>Window Mobile 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>nokia</td>
			<td>Boolean</td>
			<td>Nokia 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>vista</td>
			<td>Boolean</td>
			<td>Windows Vista 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>webos</td>
			<td>Boolean</td>
			<td>webOS 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>win</td>
			<td>Boolean</td>
			<td>Windows계열 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>win2000</td>
			<td>Boolean</td>
			<td>Windows 2000운영체제 사용 여부 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>win7</td>
			<td>Boolean</td>
			<td>Windows 7 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>winxp</td>
			<td>Boolean</td>
			<td>Windows XP 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>xpsp2</td>
			<td>Boolean</td>
			<td>Windows XP SP 2 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
	</tbody>
</table>
<table>
	<caption>운영체제 정보 객체 메서드</caption>
	<thead>
		<tr>
			<th scope="col">이름</th>
			<th scope="col">반환 타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>getName()</td>
			<td>String</td>
			<td>사용자가 사용하고 있는 운영체제의 이름을 반환한다. 반환하는 운영체제의 이름은 속성 이름과 동일하다.</td>
		</tr>
	</tbody>
 </table>
 * @return {Object} 운영체제 정보를 저장하는 객체.
 * @since 1.4.3 버전부터 iphone,android,nokia,webos,blackberry,mwin 사용 가능.<br>1.4.5 버전부터 ipad 사용가능.
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

 * @description flash() 메서드는 사용자의 Flash Player 정보를 담고 있는 객체를 반환한다. Flash Player 정보를 저장하는 객체는 Flash Player 설치 여부와 설치된 Flash Player의 버전 정보를 제공한다. 다음은 Flash Player의 정보를 담고 있는 객체의 속성을 설명한 표이다.<br>
 <table>
	<caption>Flash Player 정보 객체 속성</caption>
	<thead>
		<tr>
			<th scope="col">이름</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>installed</td>
			<td>Boolean</td>
			<td>Flash Player 설치 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>version</td>
			<td>Number</td>
			<td>사용자가 사용하고 있는 Flash Player의 버전 정보를 저장한다. 실수(Float) 형태로 버전 정보를 저장하며, Flash Player가 설치되지 않은 경우 -1을 저장한다. </td>
		</tr>
	</tbody>
 </table>
 * @return {Object} Flash Player 정보를 저장하는 객체.
 * @see <a href="http://www.adobe.com/products/flashplayer/">Flash Player 공식 페이지</a>
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
    /*
    
하위호환을 위해 일단 남겨둔다.
  
     */
	this.info = this.flash;

	return info;
};

/**

 * silverlight() 메서드는 사용자의 실버라이트(Silverlight) 정보를 담고 있는 객체를 반환한다. 
 * @description 실버라이트 정보를 저장하는 객체는 실버라이트 설치 여부와 설치된 실버라이트의 버전 정보를 제공한다. 다음은 실버라이트 정보를 담고 있는 객체의 속성을 설명한 표이다.<br>
  <table>
	<caption>실버라이트 정보 객체 속성</caption>
	<thead>
		<tr>
			<th scope="col">이름</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>installed</td>
			<td>Boolean</td>
			<td>실버라이트 설치 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>version</td>
			<td>Number</td>
			<td>사용자가 사용하고 있는 실버라이트의 버전 정보를 저장한다. 실수(Float) 형태로 버전 정보를 저장하며, 실버라이트가 설치되지 않은 경우 -1을 저장한다. </td>
		</tr>
	</tbody>
 </table>
 * @returns {Object} 실버라이트 정보를 저장하는 객체.
 * @see <a href="http://www.microsoft.com/silverlight/">실버라이트 공식 페이지</a>
 * @example
var oSilver = $Agent.silverlight();
oSilver.installed  // Silverlight 플레이어를 설치했다면 true
oSilver.version  // Silverlight 플레이어의 버전. 
  
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

/**

 * @fileOverview $A() 객체의 생성자 및 메서드를 정의한 파일
 * @name array.js
 * @author Kim, Taegon
  
 */

/**

 * @class $A() 객체는 배열(Array)을 좀 더 편리하게 다룰 수 있도록 메서드를 제공한다. $A() 객체를 생성할 때 원본 배열 객체를 래핑(warpping)하여 생성한다. 여기서 래핑이란 자바스크립트의 함수를 감싸 본래 함수의 기능에 새로운 확장 기능을 추가하는 것을 말한다.
 * @extends core
 * @constructor
 * @description $A() 객체를 생성한다.
 * @param {Variant} [vArray]  래핑할 배열(Array) 또는 $A() 객체. 생성자의 파라미터를 생략하면 빈 배열을 가진 새로운 $A() 객체를 반환한다.
 * @example
var zoo = ["zebra", "giraffe", "bear", "monkey"];
var waZoo = $A(zoo); // ["zebra", "giraffe", "bear", "monkey"]를 래핑한 $A 객체를 생성하여 반환
  
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

* @description toString() 메서드는 내부 배열을 문자열로 변환한다. 자바스크립트의 Array.toString() 메서드를 사용한다.
 * @return {String} 내부 배열을 변환한 문자열.
 * @See <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/toString">array.toString()</a> - MDN Docs
 * @example
var zoo = ["zebra", "giraffe", "bear", "monkey"];
$A(zoo).toString();
// 결과 : zebra,giraffe,bear,monkey
  
 */
jindo.$A.prototype.toString = function() {
	return this._array.toString();
};


/**

 * @description get() 메서드는 파라미터로 지정한 인덱스로 내부 배열의 원소 값을 조회한다.
 * @param {Number} nIndex 조회할 원소의 인덱스. 인덱스는 0부터 시작한다.
 * @return {Variant} 배열에서의 해당 인덱스의 원소 값.
 * @since 1.4.2 부터 지원
 * @example
var zoo = ["zebra", "giraffe", "bear", "monkey"];
var waZoo = $A(zoo);

// 원소 값 조회
waZoo.get(1); // 결과 : giraffe
waZoo.get(3); // 결과 : monkey
  
 */
jindo.$A.prototype.get = function(nIndex){
	return this._array[nIndex];
};

/**

 * @description length() 메서드는 내부 배열 크기를 지정하거나 반환한다.
 * @param 	{Number} [nLen] 지정할 배열의 크기. nLen이 기존 배열의 크기보다 크면 추가된 배열의 공간에 vValue 파라미터의 값으로 채운다. nLen 이 기존 배열의 크기보다 작으면 nLen번째 이후의 원소는 제거한다.
 * @param 	{Variant} [vValue] 새로운 원소를 추가할 때 사용할 초기 값.
 * @return 	{Variant} 이 메서드의 파라미터를 모두 생략하면 현재 내부 배열의 크기(Number)를 반환하고, 파라미터를 지정한 경우에는 내부 배열을 변경한 $A() 객체를 반환한다.
 * @example
var zoo = ["zebra", "giraffe", "bear", "monkey"];
var birds = ["parrot", "sparrow", "dove"];

// 배열의 크기 조회
$A(zoo).length(); // 결과 : 4

// 배열의 크기 지정 (원소가 삭제되는 경우)
$A(zoo).length(2);
// 결과 : ["zebra", "giraffe"]

// 배열의 크기 지정 (원소가 추가되는 경우)
$A(zoo).length(6, "(Empty)");
// 결과 : ["zebra", "giraffe", "bear", "monkey", "(Empty)", "(Empty)"]

$A(zoo).length(5, birds);
// 결과 : ["zebra", "giraffe", "bear", "monkey", ["parrot", "sparrow", "dove"]]
  
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

 * @description has() 메서드는 내부 배열에서 특정 값을 갖는 원소의 유무를 Boolean 형태로 반환한다.
 * @param {Variant} vValue 검색할 값.
 * @return {Boolean} 배열에서 매개 변수의 값과 동일한 원소를 찾으면 true를, 찾지 못하면 false를 반환한다.
 * @see $A#indexOf
 * @example
var arr = $A([1,2,3]);

// 값 검색
arr.has(3); // 결과 : true
arr.has(4); // 결과 : false
  
 */
jindo.$A.prototype.has = function(oValue) {
	return (this.indexOf(oValue) > -1);
};

/**

 * @description indexOf() 메서드는 내부 배열에서 특정 값을 갖는 원소를 검색하고 검색된 원소의 인덱스를 반환한다.
 * @param {Variant} vValue 검색할 값.
 * @return {Number} 검색된 원소의 인덱스. 인덱스는 0부터 시작한다. 파라미터와 같은 값을 가진 원소를 찾지 못하면 -1을 반환한다.
 * @see $A#has  
 * @example
var zoo = ["zebra", "giraffe", "bear"];
va  r waZoo = $A(zoo);

  // 값 검색 후 인덱스 리턴
  waZoo.indexOf("giraffe"); // 1
  waZoo.indexOf("monkey"); // -1
  
 */
jindo.$A.prototype.indexOf = function(oValue) {
	if (typeof this._array.indexOf != 'undefined') {
		jindo.$A.prototype.indexOf = function(oValue) {
			return this._array.indexOf(oValue);
		}
	}else{
		jindo.$A.prototype.indexOf = function(oValue) {
			for(var i=0; i < this._array.length; i++) {
				if (this._array[i] == oValue) return i;
			}
			return -1;
		}
	}
	
	return this.indexOf(oValue);
};

/**

 * @description $value() 메서드는 내부 배열을 반환한다.
 * @return {Array} 원본 배열
 * @example
var waNum = $A([1, 2, 3]);
waNum.$value(); // 원래의 배열인 [1, 2, 3]이 반환된다.
  
 */
jindo.$A.prototype.$value = function() {
	return this._array;
};

/**

 * @description push() 메서드는 내부 배열에 하나 이상의 원소를 추가하고 배열의 크기를 반환한다.
 * @param {Variant} vValue1 추가할 첫 번째 원소의 값.
 * @param {Variant} […] …
 * @param {Variant} [vValueN] 추가할 N 번째 원소의 값.
 * @return {Number} 원소를 추가한 후 배열의 크기.
 * @see $A#pop
 * @see $A#shift
 * @see $A#unshift
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/push">array.push()</a> - MDN Docs
 * @example
var arr = $A([1,2,3]);

// 원소 추가
arr.push(4);	// 결과 : 4 반환, 내부 배열은 [1,2,3,4]로 변경 됨
arr.push(5,6);	// 결과 : 6 반환, 내부 배열은 [1,2,3,4,5,6]로 변경 됨
  
 */
jindo.$A.prototype.push = function(oValue1/*, ...*/) {
	return this._array.push.apply(this._array, Array.prototype.slice.apply(arguments));
};

/**

 * @description pop() 메서드는 내부 배열의 마지막 원소를 삭제한다.
 * @return {Variant} 삭제한 원소.
 * @see $A#push  
 * @see $A#shift
 * @see $A#unshift
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/pop">array.pop()</a> - MDN Docs
 * @example
var arr = $A([1,2,3,4,5]);

arr.pop(); // 결과 : 5 반환, 내부 배열은 [1,2,3,4]로 변경 됨
  
 */
jindo.$A.prototype.pop = function() {
	return this._array.pop();
};

/**

 * @description shift() 메서드는 내부 배열의 모든 원소를 앞으로 한 칸씩 이동시킨다. 내부 배열의 첫 번째 원소는 삭제된다.
 * @return {Variant} 삭제한 첫 번째 원소.
 * @see $A#pop
 * @see $A#push
 * @see $A#unshift
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/shift">array.shift()</a> - MDN Docs
 * @example
var arr  = $A(['Melon','Grape','Apple','Kiwi']);

arr.shift(); // 결과 : 'Melon' 반환, 내부 배열은 ["Grape", "Apple", "Kiwi"]로 변경 됨.
  
 */
jindo.$A.prototype.shift = function() {
	return this._array.shift();
};

/**

 * @description unshift() 메서드는 내부 배열의 맨 앞에 하나 이상의 원소를 삽입한다.
 * @param {Variant} vValue1 삽입할 첫 번째 값.
 * @param {Variant} […] …
 * @param {Variant} [vValueN] 삽입할 N 번째 값.
 * @return {Number} 원소를 추가한 후 배열의 크기
 * @see $A#pop
 * @see $A#push
 * @see $A#shift
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/unshift">array.unshift()</a> - MDN Docs
 * @example
var arr = $A([4,5]);

arr.unshift('c');		// 결과 : 3 반환, 내부 배열은 ["c", 4, 5]로 변경 됨.
arr.unshift('a', 'b');	// 결과 : 5 반환, 내부 배열은 ["a", "b", "c", 4, 5]로 변경 됨.
  
 */
jindo.$A.prototype.unshift = function(oValue1/*, ...*/) {
	this._array.unshift.apply(this._array, Array.prototype.slice.apply(arguments));

	return this._array.length;
};

/**

 * @description forEach() 메서드는 내부 배열의 모든 원소를 순회하면서 콜백 함수를 실행한다.
 * @param {Function} fCallback 배열을 순회하면서 실행할 콜백 함수. 콜백 함수는 파라미터로 value, index, array를 갖는다.<br>
 <ul>
 <li>value는 배열이 가진 원소의 값이다.</li>
 <li>index는 해당 원소의 인덱스이다.</li>
 <li>array는 배열 그 자체를 가리킨다.</li>
 </ul>
 * @param {Object} [oThis] 콜백 함수가 객체의 메서드일 때 콜백 함수 내부에서 this 키워드의 실행 문맥(Execution Context)으로 사용할 객체.
 * @return {$A}	$A() 객체.
 * @import core.$A[Break, Continue]
 * @see $A#map
 * @see $A#filter
 * @example
var waZoo = $A(["zebra", "giraffe", "bear", "monkey"]);

waZoo.forEach(function(value, index, array) {
	document.writeln((index+1) + ". " + value);
});

// 결과 :
// 1. zebra
// 2. giraffe
// 3. bear
// 4. monkey

 * @example
var waArray = $A([1, 2, 3]);

waArray.forEach(function(value, index, array) {
	array[index] += 10;
});

document.write(waArray.$value());
// 결과 : 11, 12, 13 (내부 배열에 10씩 더해짐)
  
 */
jindo.$A.prototype.forEach = function(fCallback, oThis) {
	if (typeof this._array.forEach == "function") {
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
			
			try {
				this._array.forEach(f);
			} catch(e) {
				if (!(e instanceof errBreak)) throw e;
			}
			return this;
		}
	}else{
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
			for(var i=0; i < arr.length; i++) {
				try {
					f(arr[i], i, arr);
				} catch(e) {
					if (e instanceof errBreak) break;
					throw e;
				}
			}
			return this;
		}
	}
	return this.forEach(fCallback, oThis);
};

/**

 * @description slice() 메서드는 내부 배열의 일부분을 추출한다.
 * @param {Number} nStart 배열에서 추출할 부분의 시작 원소 인덱스. 인덱스는 0부터 시작한다.
 * @param {Number} nEnd 배열에서 추출할 부분의 마지막 원소 바로 다음 인덱스.
 * @return {$A} 내부 배열의 일부를 추출한 새로운 $A() 객체.<br>nStart 값이 0보다 작거나 nStart 값이 nEnd보다 크거나 같으면 빈 배열을 가진 $A() 객체를 반환한다.
 * @example
var arr = $A([12, 5, 8, 130, 44]);
var newArr = arr.slice(1,3);
// 잘라낸 배열인 [5, 8]를 래핑한 $A 객체를 리턴한다. (원래의 배열은 변화 없음)

 * @example
var arr = $A([12, 5, 8, 130, 44]);
var newArr = arr.slice(3,3);
// []를 래핑한 $A 객체를 리턴한다.
  
 */
jindo.$A.prototype.slice = function(nStart, nEnd) {
	var a = this._array.slice.call(this._array, nStart, nEnd);
	return jindo.$A(a);
};

/**

 * @description splice() 메서드는 내부 배열의 일부분을 삭제한다.
 * @param {Number} nIndex	배열에서 삭제할 부분의 시작 원소 인덱스. 인덱스는 0부터 시작한다.
 * @param {Number} [nHowMany] 시작 원소부터 삭제할 원소의 개수.<br>
 * 이 값과 vValue1, ..., vValueN 파라미터를 생략하면 nIndex 번째 원소부터 배열의 마지막 원소까지 삭제한다.<br>
 * 이 값을 0으로 지정하거나 지정하지 않고 vValue1, ..., vValueN 파라미터에 값을 지정하면 nIndex 번째 위치에 지정한 vValue1, ..., vValueN 값을 추가한다.
 * @param {Variant} [vValue1] 삭제한 배열에 추가할 첫 번째 값. nIndex 인덱스에 지정한 값이 추가된다.
 * @param {Variant} […] …
 * @param {Variant} [vValueN] 삭제한 배열에 추가할 N 번째 값. nIndex + N 인덱스에 지정한 값이 추가된다.
 * @returns {$A} 삭제한 원소를 래핑하는 새로운 $A() 객체.<br>삭제한 원소가 없을 경우 빈 배열을 가진 $A() 객체를 반환한다.
 * @example
var arr = $A(["angel", "clown", "mandarin", "surgeon"]);

var removed = arr.splice(2, 0, "drum");
// arr의 내부 배열은 ["angel", "clown", "drum", "mandarin", "surgeon"]로 인덱스 2에 drum이 추가 됨
// removed의 내부 배열은 []로 삭제된 원소가 없음

removed = arr.splice(3, 1);
// arr의 내부 배열은 ["angel", "clown", "drum", "surgeon"]로 mandarin이 삭제 됨
// removed의 내부 배열은 삭제된 원소 ["mandarin"]를 가짐

removed = arr.splice(2, 1, "trumpet", "parrot");
// arr의 내부 배열은 ["angel", "clown", "trumpet", "parrot", "surgeon"]로 drum이 삭제되고 새로운 원소가 추가 됨
// removed의 내부 배열은 삭제된 원소 ["drum"]을 가짐

removed = arr.splice(3);
// arr의 내부 배열은 ["angel", "clown", "trumpet"]로 인덱스 3부터 마지막 원소가 삭제되었음
// removed의 내부 배열은 삭제된 원소 ["parrot", "surgeon"]을 가짐
  
 */
jindo.$A.prototype.splice = function(nIndex, nHowMany/*, oValue1,...*/) {
	var a = this._array.splice.apply(this._array, Array.prototype.slice.apply(arguments));

	return jindo.$A(a);
};

/**

 * @description shuffle() 메서드는 배열 원소의 순서를 무작위로 섞는다.
 * @return {$A} 배열이 섞여진 $A() 객체
 * @see $A#reverse
 * @example
var dice = $A([1,2,3,4,5,6]);

dice.shuffle();
document.write("You get the number " + dice.get(0));
// 결과 : 1부터 6까지의 숫자 중 랜덤한 숫자
  
 */
jindo.$A.prototype.shuffle = function() {
	this._array.sort(function(a,b){ return Math.random()>Math.random()?1:-1 });
	
	return this;
};

/**

 * @description reverse() 메서드는 배열 원소의 순서를 거꾸로 뒤집는다.
 * @return {$A} 원소 순서를 뒤집은 $A() 객체
 * @see $A#shuffle
 * @example
var arr = $A([1, 2, 3, 4, 5]);

arr.reverse(); // 결과 : [5, 4, 3, 2, 1]
  
 */
jindo.$A.prototype.reverse = function() {
	this._array.reverse();

	return this;
};

/**

 * @description empty() 메서드는 배열의 모든 원소를 제거하고, 빈 배열로 만든다.
 * @return {$A} 배열의 원소가 제거된 $A() 객체
 * @example
var arr = $A([1, 2, 3]);

arr.empty(); // 결과 : []
  
 */
jindo.$A.prototype.empty = function() {
	return this.length(0);
};

/**

 * @description Break() 메서드는 forEach(), filter(), map() 메서드의 루프를 중단한다. 내부적으로는 강제로 예외를 발생시키는 구조이므로, try - catch 영역에서 이 메서드를 실행하면 정상적으로 동작하지 않을 수 있다.
 * @see $A#Continue
 * @see $A#forEach
 * @see $A#filter
 * @see $A#map
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

 * @description Continue() 메서드는 forEach(), filter(), map() 메서드의 루프에서 나머지 명령을 실행하지 않고 다음 루프로 건너뛴다. 내부적으로는 강제로 예외를 발생시키는 구조이므로, try - catch 영역에서 이 메서드를 실행하면 정상적으로 동작하지 않을 수 있다.
 * @see $A#Break
 * @see $A#forEach
 * @see $A#filter
 * @see $A#map
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

 * @fileOverview $A() 객체의 확장 메서드를 정의한 파일
 * @name array.extend.js
  
 */

/**

 * @description map() 메서드는 배열의 모든 원소를 순회하면서 콜백 함수를 실행하고 콜백 함수의 실행 결과를 배열의 원소에 설정한다.
 * @param {Function} fCallback 배열을 순회하면서 실행할 콜백 함수. 콜백 함수에서 반환하는 값을 해당 원소의 값으로 재설정한다. 콜백 함수는 파라미터로 value, index, array를 갖는다.<br>
 <ul>
 <li>value는 배열이 가진 원소의 값이다.</li>
 <li>index는 해당 원소의 인덱스이다.</li>
 <li>array는 배열 그 자체를 가리킨다.</li>
 </ul>
 * @param {Object} [oThis] 콜백 함수가 객체의 메서드일 때 콜백 함수 내부에서 this 키워드의 실행 문맥(Execution Context) 사용할 객체.
 * @return {$A} 콜백 함수의 수행 결과를 반영한 $A() 객체
 * @see $A#forEach
 * @see $A#filter
 * @example
var waZoo = $A(["zebra", "giraffe", "bear", "monkey"]);

waZoo.map(function(value, index, array) {
	return (index+1) + ". " + value;
});
// 결과 : [1. zebra, 2. giraffe, 3. bear, 4. monkey]

 * @example
var waArray = $A([1, 2, 3]);

waArray.map(function(value, index, array) {
	return value + 10;
});

document.write(waArray.$value());
// 결과 : 11, 12, 13 (내부 배열에 10씩 더해짐)
  
 */
jindo.$A.prototype.map = function(fCallback, oThis) {

	
	if (typeof this._array.map == "function") {
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

			try {
				this._array = this._array.map(f);
			} catch(e) {
				if(!(e instanceof errBreak)) throw e;
			}
			return this;
		}
	}else{
		jindo.$A.prototype.map = function(fCallback, oThis) {
			var arr         = this._array;
			var returnArr	= [];
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
			for(var i=0; i < this._array.length; i++) {
				try {
					returnArr[i] = f(arr[i], i, arr);
				} catch(e) {
					if (e instanceof errBreak){
						return this;
					}else{
						throw e;
					}
				}
			}
			this._array = returnArr;
			
			return this;
		}
	}
	return this.map(fCallback, oThis);
};

/**

 * @description filter() 메서드는 배열의 모든 원소를 순회하면서 콜백 함수를 실행하고 콜백 함수가 true 값을 반환하는 원소만 모아 새로운 $A() 객체를 반환한다.
 * @param {Function} fCallback 배열을 순회하면서 실행할 콜백 함수. 콜백 함수는 Boolean 형태로 값을 반환해야 한다. true 값을 반환하는 원소는 새로운 배열의 원소가 된다.<br>
 <ul>
 <li>value는 배열이 가진 원소의 값이다.</li>
 <li>index는 해당 원소의 인덱스이다.</li>
 <li>array는 배열 그 자체를 가리킨다.</li>
 </ul>
 * @param {Object} [oThis] 콜백 함수가 객체의 메서드일 때 콜백 함수 내부에서 this 키워드의 실행 문맥(Execution Context) 사용할 객체.
 * @return {$A}	콜백 함수의 반환 값이 true인 원소로 이루어진 새로운 $A() 객체
 * @see $A#forEach
 * @see $A#map
 * @example
var arr = $A([1,2,3,4,5]);

// 필터링 함수
function filterFunc(value, index, array) {
	if (value > 2) {
		return true;
	} else {
		return false;
	}
}

var newArr = arr.filter(filterFunc);

document.write(arr.$value()); 		// 결과 : [1,2,3,4,5]
document.write(newArr.$value()); 	// 결과 : [3,4,5]
  
 */
jindo.$A.prototype.filter = function(fCallback, oThis) {
	if (typeof this._array.filter != "undefined") {
		jindo.$A.prototype.filter = function(fCallback, oThis) {
			return jindo.$A(this._array.filter(fCallback, oThis));
		}
	}else{
		jindo.$A.prototype.filter = function(fCallback, oThis) {
			var ar = [];

			this.forEach(function(v,i,a) {
				if (fCallback.call(oThis, v, i, a) === true) {
					ar[ar.length] = v;
				}
			});

			return jindo.$A(ar);
		}
	}
	return this.filter(fCallback, oThis);
};

/**

 * @description every() 메서드는 배열을 순회하면서 배열의 모든 원소가 콜백 함수에 설정한 조건을 만족하는지 검사한다. 모든 원소가 콜백 함수에서 true 값을 반환하면 true 값을 반환하고 그렇지 않으면 false 값을 반환한다.  콜백 함수가 수행 도중 한번이라도 false를 반환하면 바로 false 값을 반환한다.
 * @param {Function} fCallback 배열을 순회하면서 실행할 콜백 함수. 콜백 함수는 Boolean 형태로 값을 반환해야 한다.<br>
 <ul>
 <li>value는 배열이 가진 원소의 값이다.</li>
 <li>index는 해당 원소의 인덱스이다.</li>
 <li>array는 배열 그 자체를 가리킨다.</li>
 </ul>
 * @param {Object} [oThis] 콜백 함수가 객체의 메서드일 때 콜백 함수 내부에서 this 키워드의 실행 문맥(Execution Context)으로 사용할 객체.
 * @return {Boolean}	콜백 함수의 반환 값이 모두 true이면 true를 반환하고 그렇지 않으면 false를 반환한다.
 * @see $A#some
 * @example
function isBigEnough(value, index, array) {
		return (value >= 10);
	}

var try1 = $A([12, 5, 8, 130, 44]).every(isBigEnough);		// 결과 : false
var try2 = $A([12, 54, 18, 130, 44]).every(isBigEnough);	// 결과 : true
  
 */
jindo.$A.prototype.every = function(fCallback, oThis) {
	if (typeof this._array.every != "undefined"){
		jindo.$A.prototype.every = function(fCallback, oThis) {
			return this._array.every(fCallback, oThis);
		}
	}else{
		jindo.$A.prototype.every = function(fCallback, oThis) {
			var result = true;

			this.forEach(function(v, i, a) {
				if (fCallback.call(oThis, v, i, a) === false) {
					result = false;
					jindo.$A.Break();
				}
			});

			return result;
		}
	}
	return this.every(fCallback, oThis);
};

/**

 * @description some() 메서드는 배열을 순회하면서 콜백 함수에 설정한 조건을 만족하는 원소가 있는지 검사한다. 조건을 만족하는 원소가 하나라도 있으면 true 값을 반환하고 그렇지 않으면 false 값을 반환한다.  콜백 함수가 수행 도중 한번이라도 true를 반환하면 바로 true 값을 반환한다.
 * @param {Function} fCallback 배열을 순회하면서 실행할 콜백 함수. 콜백 함수는 Boolean 형태로 값을 반환해야 한다.<br>
 <ul>
 <li>value는 배열이 가진 원소의 값이다.</li>
 <li>index는 해당 원소의 인덱스이다.</li>
 <li>array는 배열 그 자체를 가리킨다.</li>
 </ul>
 * @param {Object} [oThis] 콜백 함수가 객체의 메서드일 때 콜백 함수 내부에서 this 키워드의 실행 문맥(Execution Context)으로 사용할 객체.
 * @return {Boolean} 콜백 함수의 반환 값이 모두 false이면 false를 반환하고 그렇지 않으면 true를 반환한다.
 * @see $A#every
 * @example
function twoDigitNumber(value, index, array) {
	return (value >= 10 && value < 100);
}

var try1 = $A([12, 5, 8, 130, 44]).some(twoDigitNumber);	// 결과 : true
var try2 = $A([1, 5, 8, 130, 4]).some(twoDigitNumber);		// 결과 : false
  
 */
jindo.$A.prototype.some = function(fCallback, oThis) {
	if (typeof this._array.some != "undefined"){
		jindo.$A.prototype.some = function(fCallback, oThis) {
			return this._array.some(fCallback, oThis);
		}
	}else{
		jindo.$A.prototype.some = function(fCallback, oThis) {
			var result = false;
			this.forEach(function(v, i, a) {
				if (fCallback.call(oThis, v, i, a) === true) {
					result = true;
					jindo.$A.Break();
				}
			});
			return result;
		}
	}
	return this.some(fCallback, oThis);
};

/**

 * @description refuse() 메서드는 배열에서 입력한 파라미터와 같은 값을 제외하여 새로운 $A() 객체를 생성한다. 제외할 값을 여러 개 지정할 수 있다.
 * @param {Variant} vValue1 배열에서 제거할 첫 번째 값.
 * @param {Variant} […] …
 * @param {Variant} [vValueN] 배열에서 제거할 N 번째 값.
 * @return {$A}	배열에서 특정 값을 제외한 새로운 $A() 객체
 * @example
var arr = $A([12, 5, 8, 130, 44]);

var newArr1 = arr.refuse(12);

document.write(arr);		// 결과 : [12, 5, 8, 130, 44]
document.write(newArr1);	// 결과 : [5, 8, 130, 44]

var newArr2 = newArr1.refuse(8, 44, 130);

document.write(newArr1);	// 결과 : [5, 8, 130, 44]
document.write(newArr2);	// 결과 : [5]
  
 */
jindo.$A.prototype.refuse = function(oValue1/*, ...*/) {
	var a = jindo.$A(Array.prototype.slice.apply(arguments));
	return this.filter(function(v,i) { return !a.has(v) });
};

/**

 * @description unique() 메서드는 배열에서 중복되는 원소를 삭제한다.
 * @return {$A} 중복되는 원소를 제거한 $A() 객체
 * @example
var arr = $A([10, 3, 2, 5, 4, 3, 7, 4, 11]);

arr.unique(); // 결과 : [10, 3, 2, 5, 4, 7, 11]
  
 */
jindo.$A.prototype.unique = function() {
	var a = this._array, b = [], l = a.length;
	var i, j;

	/*
	
  중복되는 원소 제거
  
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

/**

 * @fileOverview $Ajax() 객체의 생성자 및 메서드를 정의한 파일
 * @name Ajax.js
 * @author Kim, Taegon
	
 */

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
 * @param {String} sUrl Ajax 요청을 보낼 서버의 URL.
 * @param {Object} oOption $Ajax()에서 사용하는 콜백 함수, 통신 방식 등과 같은 다양한 정보를 정의한다. oOption 객체의 프로퍼티와 사용법에 대한 설명은 다음 표와 같다.<br>
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
	
	/*
	 
테스트를 위해 우선 적용가능한 설정 객체가 존재하면 적용
	
	 */
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
			this._request = new jindo.$Ajax.SWFRequest(jindo.$Fn(this.option,this).bind());
			break;
		case "jsonp":
			if(!jindo.$Ajax.JSONPRequest) throw Error('Require jindo.$Ajax.JSONPRequest');
			_opt.method = "get";
			this._request = new jindo.$Ajax.JSONPRequest(jindo.$Fn(this.option,this).bind());
			break;
		case "iframe":
			if(!jindo.$Ajax.FrameRequest) throw Error('Require jindo.$Ajax.FrameRequest');
			this._request = new jindo.$Ajax.FrameRequest(jindo.$Fn(this.option,this).bind());
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
							if(!this._is_abort){
								oResult = this._options.onload(jindo.$Ajax.Response(this._request));	
							}
						} 
				}finally{
					if(typeof this._oncompleted == 'function'){
						this._oncompleted(bSuccess, oResult);
					}
					if (this._options.type == "xhr" ){
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

 * @description request() 메서드는 Ajax 요청을 서버에 전송한다. 요청에 사용할 파라미터는 $Ajax() 객체 생성자에서 설정하거나 option() 메서드를 사용하여 변경할 수 있다. 요청 타입(type)이 "flash"면 이 메소드를 실행하기 전에 body 요소에서 {@link $Ajax.SWFRequest.write}() 메서드를 반드시 실행해야 한다.
 * @param {Object} oData 서버로 전송할 데이터.
 * @return {$Ajax} $Ajax() 객체.
 * @see $Ajax#option
 * @see $Ajax.SWFRequest.write
 * @example
var ajax = $Ajax("http://www.remote.com", {
   onload : function(res) {
      // onload 핸들러
   }
});

ajax.request( {key1:"value1", key2:"value2"} );	// 서버에 전송할 데이터를 매개변수로 넘긴다.
	
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
	
	/*
	 
XHR GET 방식 요청인 경우 URL에 파라미터 추가
	
	 */
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
	if(opt.type.toUpperCase()=="XHR"&&opt.method.toUpperCase()=="GET"&&/MSIE/.test(window.navigator.userAgent)){
		/*
		 
xhr인 경우 IE에서는 GET으로 보낼 때 브라우져에서 자체 cache하여 cache을 안되게 수정.
	
		 */
		req.setRequestHeader("If-Modified-Since", "Thu, 1 Jan 1970 00:00:00 GMT");
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
	var navi = navigator.userAgent;
	if(req.addEventListener&&!(navi.indexOf("Opera") > -1)&&!(navi.indexOf("MSIE") > -1)){
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
		if (typeof req.onload != "undefined") {
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
			if(window.navigator.userAgent.match(/(?:MSIE) ([0-9.]+)/)[1]==6&&opt.async){
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
			if(typeof t._oncompleted == 'function') t._oncompleted(false);
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
 * @since 1.3.5 부터 사용 가능
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
}

/**

 * @description abort() 메서드는 서버로 전송한 Ajax 요청을 취소한다. Ajax 요청의 응답 시간이 길거나 강제로 Ajax 요청을 취소할 경우 사용한다.
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

 * @description option() 메서드는 $Ajax() 객체의 옵션 객체(oOption) 속성에 정의된 Ajax 요청 옵션에 대한 정보를 가져오거나 혹은 설정한다. Ajax 요청 옵션을 설정하려면 이름과 값을, 혹은 이름과 값을 원소로 가지는 하나의 객체를 파라미터로 입력한다. 이름과 값을 원소로 가지는 객체를 입력하면 하나 이상의 정보를 한 번에 설정할 수 있다.
 * @param {Variant} vName 옵션 객체의 속성 이름(String) 또는 하나 이상의 속성 값이 정의된 객체(Object).<br>
 <ul>
	<li>문자열을 파라미터로 입력하면 다음과 같이 동작한다.
		<ol>
			<li>sValue 파라미터를 생략하면 이름에 해당하는 $Ajax의 속성 값을 반환한다.</li>
			<li>sVlue 파라미터를 설정하면 이름에 해당하는 $Ajax의 속성 값을 sValue 값으로 설정한다.</li>
		</ol>
	</li>
	<li>객체인 경우에는 속성 이름으로 정보를 찾아 속성의 값으로 설정한다. 객체에 하나 이상의 속성을 지정하면 여러 속성 값을 한 번에 설정할 수 있다.</li>
</ul>
 * @param {Variant} [vValue] 새로 설정할 옵션 속성의 값. vName 파라미터가 문자열인 경우에만 사용된다.
 * @return {Variant} 정보의 값을 가져올 때는 문자열(String)을, 값을 설정할 때는 $Ajax() 객체를 반환한다.
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

 * @description header() 메서드는 Ajax 요청에서 사용할 HTTP 요청 헤더를 가져오거나 설정한다. 헤더를 설정하려면 헤더의 이름과 값을 각각 파라미터로 입력하거나 헤더의 이름과 값을 원소로 가지는 객체를 파라미터로 입력한다. 객체를 파라미터로 입력하면 하나 이상의 헤더를 한 번에 설정할 수 있다. 헤더에서 특정 속성 값을 가져오려면 속성의 이름을 파라미터로 입력한다.
 * @param {Variant} vName 헤더 이름(String) 또는 하나 이상의 헤더 값이 정의된 객체(Object).<br>
 <ul>
	<li>문자열을 파라미터로 입력하면 다음과 같이 동작한다.
		<ol>
			<li>vValue 파라미터를 생략하면 HTTP 요청 헤더에서 문자열과 일치하는 헤더 값을 찾는다.</li>
			<li>vValue 파라미터를 설정하면 HTTP 요청 헤더에서 문자열과 일치하는 헤더 값을 vValue 값으로 설정한다.</li>
		</ol>
	</li>
	<li>객체인 경우에는 헤더 이름으로 정보를 찾아 헤더의 값으로 설정한다. 객체에 하나 이상의 헤더 값을 지정하면 여러 헤더 값을 한 번에 설정할 수 있다.</li>
</ul>
 * @param {Value} [vValue] 설정할 헤더 값. vName 파라미터가 문자열인 경우에만 사용한다.
 * @return {Variant} 정보의 값을 가져올 때는 문자열(String)을, 값을 설정할 때는 $Ajax() 객체를 반환한다.
 * @example
var customheader = ajax.header("myHeader"); 		// HTTP 요청 헤더에서 myHeader 의 값
ajax.header( "myHeader", "someValue" );				// HTTP 요청 헤더의 myHeader 를 someValue 로 설정한다.
ajax.header( { anotherHeader : "someValue2" } );	// HTTP 요청 헤더의 anotherHeader 를 someValue2 로 설정한다.
    
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

 * @class $Ajax.Response 객체를 생성한다. $Ajax.Response 객체는 $Ajax() 객체에서 request() 메서드의 요청 처리 완료한 후 생성된다. $Ajax() 객체를 생성할 때 onload 속성에 설정한 콜백 함수의 파라미터로 $Ajax.Response 객체가 전달된다.
 * @constructor
 * @description Ajax 응답 객체를 래핑하여 응답 데이터를 가져오거나 활용하는데 유용한 기능을 제공한다.
 * @param {Object} oReq 요청 객체
 * @see $Ajax
    
 */
jindo.$Ajax.Response  = function(req) {
	if (this === jindo.$Ajax) return new jindo.$Ajax.Response(req);
	this._response = req;
};

/**

 * @description xml() 메서드는 응답을 XML 객체로 반환한다. XHR의 responseXML 속성과 유사하다.
 * @return {Object} 응답 XML 객체. 
 * @see <a href="https://developer.mozilla.org/en/XMLHttpRequest">XMLHttpRequest</a> - MDN Docs
 * @example
// some.xml
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
	return this._response.responseText;
};

/**

 * @description status() 메서드는 HTTP 응답 코드를 반환한다. HTTP 응답 코드표를 참고한다.
 * @return {Number} 응답 코드. 
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
 * @return {Number}  readyState 값.
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
			return eval("("+this._response.responseText+")");
		} catch(e) {
			return {};
		}
	}

	return {};
};

/**

 * @description header() 메서드는 응답 헤더를 가져온다. 파라미터를 입력하지 않으면 헤더 전체를 반환한다.
 * @param {String} [sName] 가져올 응답 헤더의 이름.
 * @return {Variant} 파라미터를 입력했을 경우 해당하는 헤더 값(String)을, 그렇지 않으면 헤더 전체(Object)를 반환한다.
 * @example
var oAjax = new $Ajax('some.php', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		res.header();					// 응답 헤더 전체를 리턴한다.
		res.header("Content-Length")	// 응답 헤더에서 "Content-Length" 의 값을 리턴한다.
	},
}).request();
    
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

 * @class Ajax 요청 객체의 기본 객체이다.
 * @description Ajax 요청 타입 별로 Ajax 요청 객체를 생성할 때 Ajax 요청 객체를 생성하기 위한 상위 객체로 사용한다.
 * @see $Ajax
    
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
	$init  : function(fpOption){},
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
		if(this.option("callbackid")!="") {
			var idx = 0;
			do {
				id = "_" + this.option("callbackid") + "_"+idx;
				idx++;
			} while (window.__jindo2_callback[id]);	
		}else{
			do {
				id = "_" + Math.floor(Math.random() * 10000);
			} while (window.__jindo2_callback[id]);
		}
		
		if(this.option("callbackname") == ""){
			this.option("callbackname","_callback");
		}
			   
		return {callbackname:this.option("callbackname"),id:id,name:"window.__jindo2_callback."+id};
	}
});

/**

 * @class Ajax 요청 타입이 jsonp인 요청 객체를 생성하며, $Ajax() 객체에서 Ajax 요청 객체를 생성할 때 사용한다.
 * @extends $Ajax.RequestBase
 * @description $Ajax.JSONPRequest 객체를 생성한다. 이때, $Ajax.JSONPRequest 객체는 $Ajax.RequestBase 객체를 상속한다.
 * @see $Ajax
 * @see $Ajax.RequestBase
    
 */
jindo.$Ajax.JSONPRequest = jindo.$Class({
	_headers : {},
	_respHeaders : {},
	_script : null,
	_onerror : null,
	$init  : function(fpOption){
		this.option = fpOption;
	},
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
		this._script.charset = this.option("jsonp_charset");

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
		
		var agent = jindo.$Agent(navigator); 
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
		//test url for spec.
		this._test_url = this._url+delimiter+info.callbackname+"="+info.name+data;
		this._script.src = this._url+delimiter+info.callbackname+"="+info.name+data;
		
	}
}).extend(jindo.$Ajax.RequestBase);

/**
 
 * @class Ajax 요청 타입이 flash인 요청 객체를 생성하며, $Ajax() 객체에서 Ajax 요청 객체를 생성할 때 사용한다.
 * @extends $Ajax.RequestBase
 * @description $Ajax.SWFRequest 객체를 생성한다. 이때, $Ajax.SWFRequest 객체는 $Ajax.RequestBase 객체를 상속한다.
 * @see $Ajax
 * @see $Ajax.RequestBase
    
 */
jindo.$Ajax.SWFRequest = jindo.$Class({
	$init  : function(fpOption){
		this.option = fpOption;
	},
	_headers : {},
	_respHeaders : {},
	_getFlashObj : function(){
		var navi = jindo.$Agent(window.navigator).navigator();
		var obj;
		if (navi.ie&&navi.version==9) {
			obj = document.getElementById(jindo.$Ajax.SWFRequest._tmpId);
		}else{
			obj = window.document[jindo.$Ajax.SWFRequest._tmpId];
		}
		return(this._getFlashObj =  function(){
			return obj;
		})();
		
	},
	_callback : function(status, data, headers){
		this.readyState = 4;
        /*
         
 하위 호환을 위해 status가 boolean 값인 경우도 처리
    
         */

		if( (typeof status).toLowerCase() == 'number'){
			this.status = status;
		}else{
			if(status==true) this.status=200;
		}		
		if (this.status==200) {
			if (typeof data == "string") {
				try {
					this.responseText = this.option("decode")?decodeURIComponent(data):data;
					if(!this.responseText || this.responseText=="") {
						this.responseText = data;
					}	
				} catch(e) {
                    /*
                        
 데이터 안에 utf-8이 아닌 다른 인코딩일때 디코딩을 안하고 바로 text에 저장.
    
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
            
 콜백코드는 넣었지만, 아직 SWF에서 응답헤더 지원 안함
    
             */
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
		var swf  = this._getFlashObj()

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
		this._current_callback_id = info.id
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
	},
	abort : function(){
		
		if(this._current_callback_id){
			window.__jindo2_callback[this._current_callback_id] = function(){
				delete window.__jindo2_callback[info.id];
			}
		}
	}
}).extend(jindo.$Ajax.RequestBase);

/**

 * @description write() 메서드는 플래시 객체를 초기화하는 메서드로서 write() 메서드를 호출하면 통신을 위한 플래시 객체를 문서 내에 추가한다. Ajax 요청 타입이 flash이면 플래시 객체를 통해 통신한다. 따라서 $Ajax() 객체의 request 메서드가 호출되기 전에 write() 메서드를 반드시 한 번 실행해야 하며, <body> 요소에 작성되어야 한다. 두 번 이상 실행해도 문제가 발생한다.
 * @param {String} [sSWFPath] Ajax 통신에 사용할 플래시 파일. 기본 값은 "./ajax.swf" 이다.
 * @see $Ajax#request
 * @example
<body>
    <script type="text/javascript">
        $Ajax.SWFRequest.write("/path/swf/ajax.swf");
    </script>
</body>
    
 */
jindo.$Ajax.SWFRequest.write = function(swf_path) {
	if(typeof swf_path == "undefined") swf_path = "./ajax.swf";
	jindo.$Ajax.SWFRequest._tmpId = 'tmpSwf'+(new Date()).getMilliseconds()+Math.floor(Math.random()*100000);
	var activeCallback = "jindo.$Ajax.SWFRequest.loaded";
	jindo.$Ajax._checkFlashLoad();
	document.write('<div style="position:absolute;top:-1000px;left:-1000px"><object id="'+jindo.$Ajax.SWFRequest._tmpId+'" width="1" height="1" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"><param name="movie" value="'+swf_path+'"><param name = "FlashVars" value = "activeCallback='+activeCallback+'" /><param name = "allowScriptAccess" value = "always" /><embed name="'+jindo.$Ajax.SWFRequest._tmpId+'" src="'+swf_path+'" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" width="1" height="1" allowScriptAccess="always" swLiveConnect="true" FlashVars="activeCallback='+activeCallback+'"></embed></object></div>');
	
};

/**
 * @ignore
 */
jindo.$Ajax._checkFlashLoad = function(){
	jindo.$Ajax._checkFlashKey = setTimeout(function(){
//		throw new Error("Check your flash file!. Unload flash on a page.");
//		alert("Check your flash file!. Unload flash on a page.");
	},5000);
	jindo.$Ajax._checkFlashLoad = function(){}
}
/**

 * @description 플래시 객체 로딩 여부를 저장한 변수. 로딩된 경우 true를 반환하고 로딩되지 않은 경우 false를 반환한다. 플래시 객체가 로딩되었는지 확인할 때 사용할 수 있다.
 * @see $Ajax.SWFRequest.write
    
 */
jindo.$Ajax.SWFRequest.activeFlash = false;

/**

 * flash에서 로딩 후 실행 시키는 함수.
 * @ignore
    
 */
jindo.$Ajax.SWFRequest.loaded = function(){
	clearTimeout(jindo.$Ajax._checkFlashKey);
	jindo.$Ajax.SWFRequest.activeFlash = true;
}

/**

 * @class Ajax 요청 타입이 iframe인 요청 객체를 생성하며, $Ajax() 객체에서 Ajax 요청 객체를 생성할 때 사용한다.
 * @extends $Ajax.RequestBase
 * @description $Ajax.FrameRequest 객체를 생성한다. 이때, $Ajax.FrameRequest 객체는 $Ajax.RequestBase 객체를 상속한다.
 * @see $Ajax
 * @see $Ajax.RequestBase
    
 */
jindo.$Ajax.FrameRequest = jindo.$Class({
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
		_aStr.push("&proxy="+encodeURIComponent(this.option("proxy")));
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

 * @class Ajax 요청을 큐에 담아 큐에 들어온 순서대로 요청을 처리한다.
 * @constructor
 * @description $Ajax() 객체를 순서대로 호출할 수 있도록 기능을 제공한다.
 * @param {Object} oOption $Ajax.Queue 객체가 서버로 통신을 요청할 때 사용하는 정보를 정의한다.
	<ul>
		<li>async : 비동기/동기 요청 방식을 설정한다. 비동기 요청 방식이면 true, 동기 요청 방식이면 false를 설정한다. 기본 값은 false 이다.</li>
		<li>useResultAsParam : 이전 요청 결과를 다음 요청의 파라미터로 전달할지 결정한다. 이전 요청 결과를 파라미터로 전달하려면 true, 그렇게 하지 않을 경우 false를 설정한다. 기본 값은 false 이다.</li>
		<li>stopOnFailure : 이전 요청이 실패할 경우 다음 요청 중단 여부를 설정한다. 다음 요청을 중단하려면 true, 계속 실행하려면 false를 설정한다. 기본 값은 false 이다.</li>
	</ul>
 * @since 1.3.7
 * @see $Ajax
 * @example
// $Ajax 요청 큐를 생성한다.
var oAjaxQueue = new $Ajax.Queue({
	useResultAsParam : true
});
    
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

 * @description option() 메서드는 $Ajax.Queue 객체에 설정한 옵션 값을 확인하거나 지정한 값으로 설정한다. 또한 파라미터로 하나 이상의 옵션을 지정한 객체를 입력할 수 있다.
 * @param {Variant} vName 옵션의 이름(String) 또는 하나 이상의 옵션을 설정한 객체(Object).
 * @param {Variant} [vValue] 설정할 옵션의 값. 설정할 옵션을 vName에 지정한 경우에만 입력한다.
 * @return {Variant} 지정한 옵션의 값(Value)을 반환하거나, 입력한 옵션을 설정한 $Ajax.Queue 객체를 반환한다.
 * @see $Ajax.Queue
 * @example
var oAjaxQueue = new $Ajax.Queue({
	useResultAsParam : true
});

oAjaxQueue.option("useResultAsParam");	// useResultAsParam 옵션 값인 true 를 리턴한다.
oAjaxQueue.option("async", true);		// async 옵션을 true 로 설정한다.
    
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

 * @description add() 메서드는 $Ajax.Queue에 Ajax 요청($Ajax() 객체)을 추가한다.
 * @param {$Ajax} oAjax 추가할 $Ajax() 객체.
 * @param {Object} oParam Ajax 요청 시 전송할 파라미터 객체.
 * @example
var oAjax1 = new $Ajax('ajax_test.php',{
	onload :  function(res){
		// onload 핸들러
	}
});
var oAjax2 = new $Ajax('ajax_test.php',{
	onload :  function(res){
		// onload 핸들러
	}
});
var oAjax3 = new $Ajax('ajax_test.php',{
	onload :  function(res){
		// onload 핸들러
	}

});

var oAjaxQueue = new $Ajax.Queue({
	async : true,
	useResultAsParam : true,
	stopOnFailure : false
});

// Ajax 요청을 큐에 추가한다.
oAjaxQueue.add(oAjax1,{seq:1});
oAjaxQueue.add(oAjax2,{seq:2,foo:99});
oAjaxQueue.add(oAjax3,{seq:3});

oAjaxQueue.request();
    
 */
jindo.$Ajax.Queue.prototype.add = function (oAjax, oParam) {
	this._queue.push({obj:oAjax, param:oParam});
}

/**

 * @description request() 메서드는 $Ajax.Queue에 있는 Ajax 요청을 서버로 보낸다.
 * @example
var oAjaxQueue = new $Ajax.Queue({
	useResultAsParam : true
});
oAjaxQueue.add(oAjax1,{seq:1});
oAjaxQueue.add(oAjax2,{seq:2,foo:99});
oAjaxQueue.add(oAjax3,{seq:3});

// 서버에 Ajax 요청을 보낸다.
oAjaxQueue.request();
    
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
 
 * @fileOverview $H() 객체의 생성자 및 메서드를 정의한 파일
 * @name hash.js
 * @author Kim, Taegon
  
 */
 
/**
 
 * @class $H() 객체는 키(key)와 값(value)을 원소로 가지는 열거형 배열인 해시(Hash)를 구현하고, 해시를 다루기 위한 여러 가지 위한 메서드를 제공한다.
 * @constructor
 * @description $H() 객체를 생성한다.
 * @param {Object} oHashObject 해시로 만들 객체.
 * @example
var h = $H({one:"first", two:"second", three:"third"})
   
 */

jindo.$H = function(hashObject) {
	var cl = arguments.callee;
	if (typeof hashObject == "undefined") hashObject = new Object;
	if (hashObject instanceof cl) return hashObject;
	if (!(this instanceof cl)) return new cl(hashObject);

	this._table = {};
	for(var k in hashObject) {
		if(hashObject.hasOwnProperty(k)){
			this._table[k] = hashObject[k];	
		}
	}
};

/**
 
 * @description $value() 메서드는 해시(Hash)를 객체로 반환한다.
 * @return {Object} 해시가 저장된 객체.
  
 */
jindo.$H.prototype.$value = function() {
	return this._table;
};

/**
 
 * @description $() 메서드는 키(key)와 값(value)을 설정하거나 키에 해당하는 값을 반환한다. 파라미터로 키만 입력한 경우 해당 키의 값을 반환하고 키와 값을 모두 입력한 경우 해당 키의 값을 지정한 값으로 설정한다.
 * @param {String} sKey 해시의 키.
 * @param {Variant} [vValue] 설정할 값.
 * @return {Variant} 키에 해당하는 값 혹은 키에 해당하는 값을 저장한 $H() 객체.
 * @example
var woH = $H({one:"first", two:"second"});

// 값을 설정할 때
woH.$("three", "third");

// woH => {one:"first", two:"second", three:"third"}

// 값을 반환할 때
var three = woH.$("three");
// three = "third"
  
 */
jindo.$H.prototype.$ = function(key, value) {
	if (typeof value == "undefined") {
		return this._table[key];
	} 

	this._table[key] = value;
	return this;
};

/**
 
 * @description length() 메서드는 해시 객체의 크기를 반환한다.
 * @return {Number} 해시의 크기.
 * @example
 var woH = $H({one:"first", two:"second"});
 woH.length();
 // 2
  
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
 
 * @description forEach() 메서드는 해시의 모든 원소를 순회하면서 콜백 함수를 실행한다. 이때 해시 객체의 키와 값 그리고 원본 해시 객체가 콜백 함수의 파라미터로 입력된다. $A() 객체의 forEach() 메서드와 유사하다.
 * @param {Function} fCallback 해시를 순회하면서 실행할 콜백 함수. 콜백 함수는 파라미터로 key, value, object를 갖는다.<br>
 * value는 해당 원소의 값이다.<br>
 * key는 해당 원소의 키이다.<br>
 * object는 해시 그 자체를 가리킨다.
 * @param {Object} [oThis] 콜백 함수가 객체의 메서드일 때 콜백 함수 내부에서 this 키워드의 실행 문맥(Execution Context)으로 사용할 객체.
 * @return {$H}	$H() 객체.
 * @see $H#map
 * @see $H#filter
 * @see $A#forEach
 * @example
function printIt(value, key, object) {
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
 
 * @description filter() 메서드는 해시의 모든 원소를 순회하면서 콜백 함수를 실행하고 콜백 함수가 true 값을 반환하는 원소만 모아 새로운 $H() 객체를 반환한다. $A() 객체의 filter() 메서드와 유사하다.
 * @param {Function} fCallback 해시를 순회하면서 실행할 콜백 함수. 콜백 함수는 Boolean 형태로 값을 반환해야 한다. true 값을 반환하는 원소는 새로운 해시의 원소가 된다. 콜백 함수는 파라미터로 value, key, object를 갖는다.<br>
 * value는 해당 원소의 값이다.<br>
 * key는 해당 원소의 키이다.<br>
 * object는 해시 그 자체를 가리킨다.
 * @param {Object} [oThis] 콜백 함수가 객체의 메서드일 때 콜백 함수 내부에서 this 키워드의 실행 문맥(Execution Context) 사용할 객체.
 * @return {$H}	콜백 함수의 반환 값이 true인 원소로 이루어진 새로운 $H() 객체.
 * @see $H#forEach
 * @see $H#map
 * @see $A#filter
 * @example
var ht=$H({one:"first", two:"second", three:"third"})

ht.filter(function(value, key, object){
	return value.length < 5;
})
// one:"first", three:"third"
  
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
 
 * @description map() 메서드는 해시의 모든 원소를 순회하면서 콜백 함수를 실행하고 콜백 함수의 실행 결과를 배열의 원소에 설정한다. $A() 객체의 map() 메서드와 유사하다.
 * @param {Function} fCallback 해시를 순회하면서 실행할 콜백 함수. 콜백 함수에서 반환하는 값을 해당 원소의 값으로 재설정한다. 콜백 함수는 파라미터로 value, key, object를 갖는다.<br>
 * value는 해당 원소의 값이다.<br>
 * key는 해당 원소의 키이다.<br>
 * object는 해시 그 자체를 가리킨다.
 * @param {Object} [oThis] 콜백 함수가 객체의 메서드일 때 콜백 함수 내부에서 this 키워드의 실행 문맥(Execution Context) 사용할 객체.
 * @return {$H} 콜백 함수의 수행 결과를 반영한 $H() 객체.
 * @see $H#forEach
 * @see $H#filter
 * @see $H#map
 * @example
function callback(value, key, object) {
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
 
 * @description add() 메서드는 해시에 값을 추가한다. 파라미터로 값을 추가할 키를 지정한다. 지정한 키에 이미 값이 있다면 지정한 값으로 변경한다.
 * @param {String} sKey 값을 추가하거나 변경할 키.
 * @param {Variant} vValue 해당 키에 추가할 값.
 * @return {$H} 값을 추가한 해시 객체.
 * @see $H#remove
 * @example
 var woH = $H();
// 키가 'foo'이고 값이 'bar'인 원소를 추가
woH.add('foo', 'bar');

// 키가 'foo'인 원소의 값을 'bar2'로 변경
woH.add('foo', 'bar2');
  
 */
jindo.$H.prototype.add = function(key, value) {
	//if (this.hasKey(key)) return null;
	this._table[key] = value;

	return this;
};

/**
 
 * @description remove() 메서드는 지정한 키의 원소를 제거한다. 해당하는 원소가 없으면 아무 일도 수행하지 않는다.
 * @param {String} sKey 제거할 원소의 키.
 * @return {Variant} 제거한 값.
 * @see $H#add
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
 
 * @description search() 메서드는 해시에서 파라미터로 지정한 값을 가지는 원소의 키를 반환한다.
 * @param {String} sValue 검색할 값.
 * @returns {Variant} 해당 값을 가지고 있는 원소의 키(String). 지정한 값을 가진 원소가 없다면 false를 반환한다.
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
 
 * @description hasKey() 메서드는 해시에 파라미터로 입력한 키가 있는지 확인한다.
 * @param {String} sKey 검색할 키.
 * @return {Boolean} 키의 존재 여부. 존재하면 true 없으면 false를 반환한다.
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
 
 * @description hasValue() 메서드는 해시에 파라미터로로 입력한 값이 있는지 확인한다.
 * @param {Variant} vValue 해시에서 검색할 값.
 * @return {Boolean} 값의 존재 여부. 존재하면 true 없으면 false를 반환한다.
  
 */
jindo.$H.prototype.hasValue = function(value) {
	return (this.search(value) !== false);
};

/**
 
 * @description sort() 메서드는 값을 기준으로 해시의 원소를 오름차순 정렬한다.
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
 
 * @description ksort() 메서드는 키를 기준으로 해시의 원소를 오름차순 정렬한다.
 * @return {$H} 원소를 정렬한 해시 객체.
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
 
 * @description keys() 메서드는 해시의 키를 배열로 반환한다.
 * @return {Array} 해시 키의 배열.
 * @see $H#values
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.keys ();
// ["one", "two", "three"]
  
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
 
 * @description values() 메서드는 해시의 값을 배열로 반환한다.
 * @return {Array} 해시 값의 배열.
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.values();
// ["first", "second", "third"]
  
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
 
 * @description toQueryString은 해시를 쿼리 스트링(Query String) 형태로 만든다.
 * @return {String} 해시를 변환한 쿼리 스트링.
 * @see <a href="http://en.wikipedia.org/wiki/Querystring">Query String</a> - Wikipedia
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
 
 * @description empty() 메서드는 해시를 비운다.
 * @return {$H} 비워진 $H() 객체.
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
 
 * @description Break() 메서드는 forEach(), filter(), map() 메서드의 루프를 중단한다. 내부적으로는 강제로 예외를 발생시키는 구조이므로, try - catch 영역에서 이 메서드를 실행하면 정상적으로 동작하지 않을 수 있다.
 * @see $H.Continue
 * @see $H#forEach
 * @see $H#filter
 * @see $H#map
 * @see $H.Continue
 * @example
$H({a:1, b:2, c:3}).forEach(function(v,k,o) {
   ...
   if (k == "b") $H.Break();
   ...
});
  
 */
jindo.$H.Break = function() {
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};

/**
 
 * @description Continue() 메서드는 forEach(), filter(), map() 메서드의 루프에서 나머지 명령을 실행하지 않고 다음 루프로 건너뛴다. 내부적으로는 강제로 예외를 발생시키는 구조이므로, try - catch 영역에서 이 메서드를 실행하면 정상적으로 동작하지 않을 수 있다.
 * @see $H.Break
 * @see $H#forEach
 * @see $H#filter
 * @see $H#map
 * @see $H.Break
 * @example
$H({a:1, b:2, c:3}).forEach(function(v,k,o) {
   ...
   if (v % 2 == 0) $H.Continue();
   ...
});
  
 */
jindo.$H.Continue = function() {
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};

/**
 
 * @fileOverview $Json의 생성자 및 메서드를 정의한 파일
 * @name json.js
 * @author Kim, Taegon
  
 */

/**
 
 * @class $Json 객체는 JSON(JavaScript Object Notation)을 다루기 위한 다양한 기능을 제공한다. 생성자에 파라미터로 객체나 문자열을 입력한다. XML 형태의 문자열로 $Json() 객체를 생성하려면 fromXML() 메서드를 사용한다.
 * @constructor
 * @description $Json() 객체를 생성한다.
 * @param {Variant} vValue 객체(Object), 혹은 JSON 형식으로 인코딩 가능한 문자열(String).
 * @return {$Json} 인수를 인코딩한 $Json() 객체.
 * @see $Json#fromXML
 * @see <a href="http://www.json.org/json-ko.html">json.org</a>
 * @example
var oStr = $Json ('{ zoo: "myFirstZoo", tiger: 3, zebra: 2}');

var d = {name : 'nhn', location: 'Bundang-gu'}
var oObj = $Json (d);
  
 */
jindo.$Json = function (sObject) {
	var cl = arguments.callee;
	if (typeof sObject == "undefined") sObject = {};
	if (sObject instanceof cl) return sObject;
	if (!(this instanceof cl)) return new cl(sObject);

	if (typeof sObject == "string") {
		this._object = jindo.$Json._oldMakeJSON(sObject);
	}else{
		this._object = sObject;
	}
}
/*

native json의 parse의 성능이 보다 좋지 못해 native json은 사용하지 않음.
  
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
}
*/
jindo.$Json._oldMakeJSON = function(sObject){
	try {
		if(/^(?:\s*)[\{\[]/.test(sObject)){
			sObject = eval("("+sObject+")");
		}else{
			sObject = sObject;
		}

	} catch(e) {
		sObject = {};
	}
	return sObject;
}
		


/**
  
 * @description fromXML() 메서드는 XML 형태의 문자열을 $Json() 객체로 인코딩한다. XML 형식의 문자열에 XML 요소가 속성을 포함하고 있을 경우 해당 요소의 정보에 해당하는 내용을 하위 객체로 표현한다. 이때 요소가 CDATA 값을 가질 경우 $cdata 속성으로 값을 저장한다.
 * @param {String} sXML XML 형태의 문자열.
 * @returns {$Json} $Json() 객체.
 * @example
var j1 = $Json.fromXML('<data>only string</data>');

// 결과 :
// {"data":"only string"}

var j2 = $Json.fromXML('<data><id>Faqh%$</id><str attr="123">string value</str></data>');

// 결과:
// {"data":{"id":"Faqh%$","str":{"attr":"123","$cdata":"string value"}}}
  
  */
jindo.$Json.fromXML = function(sXML) {
	var o  = {};
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
	/*
	  
$0 : 전체
$1 : 태그명
$2 : 속성문자열
$3 : 닫는태그
$4 : CDATA바디값
$5 : 그냥 바디값
  
	 */

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
 
 * @description get() 메서드는 특정 경로(path)에 해당하는 $Json() 객체의 값을 반환한다.
 * @param {String} sPath 경로를 지정한 문자열
 * @return {Array} 지정된 경로에 해당하는 값을 원소로 가지는 배열.
 * @example
var j = $Json.fromXML('<data><id>Faqh%$</id><str attr="123">string value</str></data>');
var r = j.get ("/data/id");

// 결과 :
// [Faqh%$]
  
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
	if (window.JSON&&window.JSON.stringify) {
		jindo.$Json.prototype.toString = function() {
			try{
				return window.JSON.stringify(this._object);
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

jindo.$Json._oldToString = function(oObj){
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

	return func.$(oObj);
}

/**
 
 * @description toXML() 메서드는 $Json() 객체를 XML 형태의 문자열로 반환한다.
 * @return {String} XML 형태의 문자열.
 * @see $Json#toObject
 * @see $Json#toString
 * @example
var json = $Json({foo:1, bar: 31});
json.toXML();

// 결과 :
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
 
 * @description toObject() 메서드는 $Json() 객체를 원래의 데이터 객체로 반환한다.
 * @return {Object} 원본 데이터 객체.
 * @see $Json#toObject
 * @see $Json#toString
 * @see $Json#toXML
 * @example
var json = $Json({foo:1, bar: 31});
json.toObject();

// 결과 :
// {foo: 1, bar: 31}
  
 */
jindo.$Json.prototype.toObject = function() {
	return this._object;
};

/**
 
 * @description compare() 메서드는 Json 객체끼리 값이 같은지 비교한다.
 * @param oData 비교할 Json 포맷 객체.
 * @return {Boolean} 비교 결과. 값이 같으면 true, 다르면 false를 반환한다.
 * @since  1.4.4 버전부터 사용 가능.
 * @example
$Json({foo:1, bar: 31}).compare({foo:1, bar: 31});

// 결과 :
// true

$Json({foo:1, bar: 31}).compare({foo:1, bar: 1});

// 결과 :
// false
  
 */
jindo.$Json.prototype.compare = function(oData){
	return jindo.$Json._oldToString(this._object).toString() == jindo.$Json._oldToString(jindo.$Json(oData).$value()).toString();
}

/**
 
 * @description $value() 메서드는 toObject() 메서드와 같이 원래의 데이터 객체를 반환한다.
 * @return {Object} 원본 데이터 객체.
 * @see $Json#toObject
  
 */
jindo.$Json.prototype.$value = jindo.$Json.prototype.toObject;


/**

 * @fileOverview $Cookie의 생성자 및 메서드를 정의한 파일
 * @name cookie.js
 * @author Kim, Taegon
  
 */

/**

 * @class $Cookie() 객체는 쿠키(Cookie)에 정보를 추가, 수정, 혹은 삭제하거나 쿠키의 값을 가져온다.
 * @constructor
 * @description $Cookie() 객체를 생성한다.
 * @example
var cookie = $Cookie();
    
 */
jindo.$Cookie = function() {
	var cl = arguments.callee;
	var cached = cl._cached;
	
	if (cl._cached) return cl._cached;
	if (!(this instanceof cl)) return new cl;
	if (typeof cl._cached == "undefined") cl._cached = this;
};

/**

 * @description keys() 메서드는 쿠키 키(key)를 원소로 가지는 배열을 리턴한다.
 * @return {Array} 쿠키의 키를 원소로 가지는 배열
 * @see $Cookie#set
 * @example
var cookie = $Cookie();
cookie.set("session_id1", "value1", 1);
cookie.set("session_id2", "value2", 1);
cookie.set("session_id3", "value3", 1);

document.write (cookie.keys ());
// 결과 :
// session_id1, session_id2, session_id3
  
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

 * @description get() 메서드는 쿠키에서 키(key)에 해당하는 값(value)을 가져온다. 값이 존재하지 않는다면 null을 반환한다.
 * @param {String} sName 키 이름.
 * @return {String} 해당 키의 값.
 * @see $Cookie#set
 * @example
var cookie = $Cookie();
cookie.set("session_id1", "value1", 1);
document.write (cookie.get ("session_id1"));
	
// 결과 :
// value1

document.write (cookie.get ("session_id0"));
// 결과 :
// null
  
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

 * @description set() 메서드는 쿠키 값을 설정한다. 쿠키 값을 설정할 때 유효 기간, 유효 도메인, 유효 경로(path)를 함께 설정할 수 있다.
 * @param {String} sName 키의 이름
 * @param {String} sValue 키의 값
 * @param {Number} [nDays] 쿠키 유효 시간. 유효 시간은 일단위로 설정한다. 유효시간을 생략했다면 쿠키는 웹 브라우저가 종료되면 없어진다.
 * @param {String} [sDomain] 쿠키 도메인
 * @param {String} [sPath] 쿠키 경로
 * @return {$Cookie} $Cookie() 객체
 * @see $Cookie#set
 * @example
var cookie = $Cookie();
cookie.set("session_id1", "value1", 1);
cookie.set("session_id2", "value2", 1);
cookie.set("session_id3", "value3", 1);
  
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

 * @description remove() 메서드는 쿠키에 설정된 쿠키 값을 제거한다. 만약 제거하려는 값에 유효 도메인과 유효 경로가 설정되어 있다면 정확히 지정해야 한다.
 * @param {String} sName 키 이름.
 * @param {String} [sDomain] 설정된 유효 도메인.
 * @param {String} [sPath] 설정된 유효 경로.
 * @return {$Cookie} $Cookie() 객체.
 * @see $Cookie#get
 * @see $Cookie#set
 * @example
var cookie = $Cookie();
cookie.set("session_id1", "value1", 1);
document.write (cookie.get ("session_id1"));

// 결과 :
// value1

cookie.remove("session_id1");
document.write (cookie.get ("session_id1"));

// 결과 :
// null
  
 */
jindo.$Cookie.prototype.remove = function(sName, sDomain, sPath) {
	if (this.get(sName) != null) this.set(sName, "", -1, sDomain, sPath);
	
	return this;
};

/**
 
 * @fileOverview $Event() 객체의 생성자 및 메서드를 정의한 파일
 * @name event.js
 * @author Kim, Taegon
  
 */

/**
 
 * @class $Event() 객체는 Event 객체를 래핑하여 이벤트 처리와 관련된 확장 기능을 제공한다. 사용자는 $Event() 객체를 사용하여 발생한 이벤트에 대한 정보를 파악하거나 동작을 지정할 수 있다.
 * @constructor
 * @description Event 객체를 래핑한 $Event() 객체를 생성한다.
 * @param {Event} event Event 객체.
  
 */
jindo.$Event = function(e) {
	var cl = arguments.callee;
	if (e instanceof cl) return e;
	if (!(this instanceof cl)) return new cl(e);

	if (typeof e == "undefined") e = window.event;
	if (e === window.event && document.createEventObject) e = document.createEventObject(e);

	this._event = e;
	this._globalEvent = window.event;

    /**  
     
이벤트의 종류
  
     */
	this.type = e.type.toLowerCase();
	if (this.type == "dommousescroll") {
		this.type = "mousewheel";
	} else if (this.type == "domcontentloaded") {
		this.type = "domready";
	}

	this.canceled = false;

	/**  
     
이벤트가 발생한 엘리먼트
  
     */
	this.element = e.target || e.srcElement;
    /**
     
이벤트가 정의된 엘리먼트
  
     */
	this.currentElement = e.currentTarget;
    /**
     
이벤트의 연관 엘리먼트
  
     */
	this.relatedElement = null;

	if (typeof e.relatedTarget != "undefined") {
		this.relatedElement = e.relatedTarget;
	} else if(e.fromElement && e.toElement) {
		this.relatedElement = e[(this.type=="mouseout")?"toElement":"fromElement"];
	}
}

/**
 
 * @description mouse() 메서드는 마우스 이벤트 정보를 담고 있는 객체를 반환한다. 마우스 이벤트 정보 객체의 속성에 대한 설명은 다음 표와 같다.<br>
 <table>
	<caption>마우스 이벤트 정보 객체 속성</caption>
	<thead>
		<tr>
			<th scope="col">속성</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>delta</td>
			<td>Number</td>
			<td>마우스 휠을 굴린 정도를 정수로 저장한다. 마우스 휠을 위로 굴린 정도는 양수 값으로, 아래로 굴린 정도는 음수 값으로 저장한다.</td>
		</tr>
		<tr>
			<td>left</td>
			<td>Boolean</td>
			<td>마우스 왼쪽 버튼 클릭 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>middle</td>
			<td>Boolean</td>
			<td>마우스 가운데 버튼 클릭 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>right</td>
			<td>Boolean</td>
			<td>마우스 오른쪽 버튼 클릭 여부를 불리언 형태로 저장한다.</td>
		</tr>
	</tbody>
</table>
* @return {Object} 마우스 이벤트 정보를 갖는 객체.
* @example
function eventHandler(evt) {
   var mouse = evt.mouse();

   mouse.delta;   // Number. 휠이 움직인 정도. 휠을 위로 굴리면 양수, 아래로 굴리면 음수.
   mouse.left;    // 마우스 왼쪽 버튼을 입력된 경우 true, 아니면 false
   mouse.middle;  // 마우스 중간 버튼을 입력된 경우 true, 아니면 false
   mouse.right;   // 마우스 오른쪽 버튼을 입력된 경우 true, 아니면 false
}
  
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
 
  * @description key() 메서드는 키보드 이벤트 정보를 담고 있는 객체를 반환한다. 키보드 이벤트 정보 객체의 속성에 대한 설명은 다음 표와 같다.<br>
 <table>
	<caption>키보드 이벤트 정보 객체 속성</caption>
	<thead>
		<tr>
			<th scope="col">속성</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>alt</td>
			<td>Boolean</td>
			<td>ALT 키 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>ctrl</td>
			<td>Boolean</td>
			<td>CTRL 키 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>down</td>
			<td>Boolean</td>
			<td>아래쪽 방향키 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>enter</td>
			<td>Boolean</td>
			<td>엔터(enter)키 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>esc</td>
			<td>Boolean</td>
			<td>ESC 키 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>keyCode</td>
			<td>Boolean</td>
			<td>입력한 키의 코드 값을 정수 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>left</td>
			<td>Boolean</td>
			<td>왼쪽 방향키 입력 여부를 불리언 형태 저장한다.</td>
		</tr>
		<tr>
			<td>meta</td>
			<td>Boolean</td>
			<td>META키(Mac 용 키보드의 Command 키) 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>right</td>
			<td>Boolean</td>
			<td>오른쪽 방향키 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>shift</td>
			<td>Boolean</td>
			<td>Shift키 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>up</td>
			<td>Boolean</td>
			<td>위쪽 방향키 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
	</tbody>
</table>
 * @return {Object} 키보드 이벤트 정보를 갖는 객체.
 * @example
function eventHandler(evt) {
   var key = evt.key();

   key.keyCode; // Number. 키보드의 키코드
   key.alt;     // Alt 키를 입력된 경우 true.
   key.ctrl;    // Ctrl 키를 입력된 경우 true.
   key.meta;    // Meta 키를 입력된 경우 true.
   key.shift;   // Shift 키를 입력된 경우 true.
   key.up;      // 위쪽 화살표 키를 입력된 경우 true.
   key.down;    // 아래쪽 화살표 키를 입력된 경우 true.
   key.left;    // 왼쪽 화살표 키를 입력된 경우 true.
   key.right;   // 오른쪽 화살표 키를 입력된 경우 true.
   key.enter;   // 리턴키를 눌렀으면 true
   key.esc;   // ESC키를 눌렀으면 true
   }
  
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
 
   * @description pos() 메서드는 마우스 커서의 위치 정보를 담고 있는 객체를 반환한다. 키보드 커서 위치 정보 객체의 속성에 대한 설명은 다음 표와 같다.<br>
 <table>
	<caption>마우서 커서 위치 정보 객체 속성</caption>
	<thead>
		<tr>
			<th scope="col">속성</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>clientX</td>
			<td>Number</td>
			<td>화면을 기준으로 마우스 커서의 X좌표를 저장한다.</td>
		</tr>
		<tr>
			<td>clientY</td>
			<td>Number</td>
			<td>화면을 기준으로 마우스 커서의 Y좌표를 저장한다.</td>
		</tr>
		<tr>
			<td>offsetX</td>
			<td>Number</td>
			<td>DOM 요소를 기준으로 마우스 커서의 상대적인 X좌표를 저장한다.</td>
		</tr>
		<tr>
			<td>offsetY</td>
			<td>Number</td>
			<td>DOM 요소를 기준으로 마우스 커서의 상대적인 Y좌표를 저장한다.</td>
		</tr>
		<tr>
			<td>pageX</td>
			<td>Number</td>
			<td>문서를 기준으로 마우스 커서의 X 좌표를 저장한다.</td>
		</tr>
		<tr>
			<td>pageY</td>
			<td>Number</td>
			<td>문서를 기준으로 마우스 커서의 Y좌표를 저장한다.</td>
		</tr>
	</tbody>
</table>
<b>참고</b>
<ul>
	<li>layerX, layerY는 더 이상 지원하지 않는다(deprecated).</li>
	<li>pos() 메서드를 사용하려면 Jindo 프레임워크에 $Element() 객체가 포함되어 있어야 한다.</li>
</ul>
 * @param {Boolean} bGetOffset 이벤트가 발생한 요소에서 마우스 커서의 상대 위치인 offsetX, offsetY 값을 구할 것인지를 결정할 파라미터. bGetOffset 값이 true면 값을 구한다.
 * @return {Object} 마우스 커서의 위치 정보.
 * @example
function eventHandler(evt) {
   var pos = evt.pos();

   pos.clientX;  // 현재 화면에 대한 X 좌표
   pos.clientY;  // 현재 화면에 대한 Y 좌표
   pos.pageX;  // 문서 전체에 대한 X 좌표
   pos.pageY;  // 문서 전체에 대한 Y 좌표
   pos.offsetX; // 이벤트가 발생한 엘리먼트에 대한 마우스 커서의 상대적인 X좌표 (1.2.0 이상)
   pos.offsetY; // 이벤트가 발생한 엘리먼트에 대한 마우스 커서의 상대적인 Y좌표 (1.2.0 이상)
   pos.layerX;  // (deprecated)이벤트가 발생한 엘리먼트로부터의 상대적인 X 좌표
   pos.layerY;  // (deprecated)이벤트가 발생한 엘리먼트로부터의 상대적인 Y 좌표
}
  
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

    /*
     
오프셋을 구하는 메소드의 비용이 크므로, 요청시에만 구하도록 한다.
  
     */
	if (bGetOffset && jindo.$Element) {
		var offset = jindo.$Element(this.element).offset();
		ret.offsetX = ret.pageX - offset.left;
		ret.offsetY = ret.pageY - offset.top;
	}

	return ret;
};

/**
 
 * @description stop() 메서드는 이벤트의 버블링과 기본 동작을 중지시킨다. 버블링은 특정 HTML 엘리먼트에서 이벤트가 발생했을 때 이벤트가 상위 노드로 전파되는 현상이다. 예를 들어, &lt;div&gt; 요소를 클릭할 때 &lt;div&gt; 요소와 함께 상위 요소인 document 요소에도 onclick 이벤트가 발생한다. stop() 메서드는 지정한 객체에서만 이벤트가 발생하도록 버블링을 차단한다.
 * @param {Number} nCancelConstant $Event() 객체의 상수. 지정한 상수에 따라 이벤트의 버블링과 기본 동작을 선택하여 중지시킨다. $Event() 객체의 상수 값으로 CANCEL_ALL, CANCEL_BUBBLE, CANCEL_DEFAULT가 있으며, 기본 값은 CANCEL_ALL이다(1.1.3 버전 이상).
 * @return {$Event} 이벤트 객체.
 * @see $Event.CANCEL_ALL
 * @see $Event.CANCEL_BUBBLE
 * @see $Event.CANCEL_DEFAULT
 * @example
// 기본 동작만 중지시키고 싶을 때 (1.1.3버전 이상)
function stopDefaultOnly(evt) {
	// Here is some code to execute

	// Stop default event only
	evt.stop($Event.CANCEL_DEFAULT);
}
  
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
 
 * @description stopDefault() 메서드는 이벤트의 기본 동작을 중지시킨다. stop() 메서드의 파라미터로 CANCEL_DEFAULT 값을 입력한 것과 같다.
 * @return {$Event} 이벤트 객체.
 * @see $Event#stop
 * @see $Event.CANCEL_DEFAULT
  
 */
jindo.$Event.prototype.stopDefault = function(){
	return this.stop(jindo.$Event.CANCEL_DEFAULT);
}

/**
 
 * @description stopBubble() 메서드는 이벤트의 버블링을 중지시킨다. stop() 메서드의 파라미터로 CANCEL_BUBBLE 값을 입력한 것과 같다.
 * @return {$Event} 이벤트 객체.
 * @see $Event#stop
 * @see $Event.CANCEL_BUBBLE
  
 */
jindo.$Event.prototype.stopBubble = function(){
	return this.stop(jindo.$Event.CANCEL_BUBBLE);
}

/**
 
 * @description $value 메서드는 원본 Event 객체를 리턴한다
 * @return {Event} 원본 Event 객체
 * @example
function eventHandler(evt){
	evt.$value();
}
  
 */
jindo.$Event.prototype.$value = function() {
	return this._event;
};

/**
 
 * @constant
 * @description CANCEL_BUBBLE는 stop() 메서드에서 버블링을 중지시킬 때 사용되는 상수이다.
 * @see $Event#stop
 * @final
  
 */
jindo.$Event.CANCEL_BUBBLE = 1;

/**
 
 * @constant
 * @description CANCEL_DEFAULT는 stop() 메서드에서 기본 동작을 중지시킬 때 사용되는 상수이다.
 * @see $Event#stop
 * @final
  
 */
jindo.$Event.CANCEL_DEFAULT = 2;

/**
 
 * @constant
 * @description CANCEL_ALL는 stop() 메서드에서 버블링과 기본 동작을 모두 중지시킬 때 사용되는 상수이다.
 * @see $Event#stop
 * @final
  
 */
jindo.$Event.CANCEL_ALL = 3;

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

/**
 
 * @fileOverview $Fn() 객체의 생성자 및 메서드를 정의한 파일
 * @name function.js
  
 */

/**
 
 * @class $Fn() 객체는 Function 객체를 래핑(wrapping)하여 함수와 관련된 확장 기능을 제공한다.
 * @extends core
 * @constructor
 * @description $Fn() 객체()를 생성한다. 생성자의 파라미터로 특정 함수를 지정할 수 있다. 이 때, 함수와 함께 this 키워드를 상황에 맞게 사용할 수 있도록 실행 문맥(Execution Context)을 함께 지정할 수 있다. 또한 생성자의 파라미터로 래핑할 함수의 파라미터와 몸체를 각각 입력하여 $Fn() 객체를 생성할 수 있다.
 * @param {Variant} vFunction 함수(Function) 또는 함수의 파라미터를 나타낸 문자열(String).
 * @param {Variant} vExeContext 함수의 실행 문맥이 될 객체(Object) 또는 함수의 몸체(String).
 * @return {$Fn} $Fn() 객체
 * @see $Fn#toFunction
 * @example
func : function() {
       // code here
}

var fn = $Fn(func, this);

 * @example
var someObject = {
    func : function() {
       // code here
   }
}

var fn = $Fn(someObject.func, someObject);

 * @example
var fn = $Fn("a, b", "return a + b;");
var result = fn.$value()(1, 2) // result = 3;

// fn은 함수 리터럴인 function(a, b){ return a + b;}와 동일한 함수를 래핑한다.
  
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
 
 * @description $value() 메서드는 원본 Function 객체를 반환한다.
 * @return {Function} 원본 Function 객체
 * @example
func : function() {
	// code here
}

var fn = $Fn(func, this);
     fn.$value(); // 원래의 함수가 리턴된다.
  
 */
jindo.$Fn.prototype.$value = function() {
	return this._func;
};

/**
 
 * @description bind() 메서드는 생성자가 지정한 객체의 메서드로 동작하도록 묶은 Function 객체를 반환한다. 이때 해당 메서드의 실행 문맥(Execution Context)이 지정한 객체로 설정된다.
 * @param {Variant} [vParameter1] 생성한 함수에 기본적으로 입력할 첫 번째 파라미터.
 * @param {Variant} […] …
 * @param {Variant} [vParameterN] 생성한 함수에 기본적으로 입력할 N 번째 파라미터.
 * @return {Function} 실행 문맥의 메서드로 묶인 Function 객체
 * @see $Fn
 * @see $Class
 * @example
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

 * @example
 // 바인드한 메서드에 인수를 입력할 경우
var b = $Fn(function(one, two, three){
	console.log(one, two, three);
}).bind(true);

b();	// true, undefined, undefined
b(false);	// true, false, undefined
b(false, "1234");	// true, false, "1234"


 * @example
// 함수를 미리 선언하고 나중에 사용할 때 함수에서 참조하는 값은 해당 함수를 
// 생성할 때의 값이 아니라 함수 실행 시점의 값이 사용되므로 이때 bind() 메서드를 이용한다.
for(var i=0; i<2;i++){
	aTmp[i] = function(){alert(i);}
}

for(var n=0; n<2;n++){
	aTmp[n](); // 숫자 2만 두번 alert된다.
}

for(var i=0; i<2;i++){
aTmp[i] = $Fn(function(nTest){alert(nTest);}, this).bind(i);
}

for(var n=0; n<2;n++){
	aTmp[n](); // 숫자 0, 1이 alert된다.
}

 * @example
//클래스를 생성할 때 함수를 파라미터로 사용하면, scope를 맞추기 위해 bind() 메서드를 사용한다.
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
		alert(this);// this는 MyClass 를 의미한다.
	},
	func2 : function(){
		alert(this);// this는 MainClass 를 의미한다.
	}
})
function init(){
	var a = new MainClass();
}
  
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
 
 * @description bindForEvent() 메서드는 객체와 메서드를 묶어 하나의 이벤트 핸들러로 반환한다.
 * @param {Variant} [vParameter1] 생성한 이벤트 핸들러에 기본적으로 입력할 첫 번째 파라미터.
 * @param {Variant} […] …
 * @param {Variant} [vParameterN] 생성한 이벤트 핸들러에 기본적으로 입력할 N 번째 파라미터.
 * @see $Fn#bind
 * @see $Event
 * @example
var name = "김길동";
function getName(event) {
    alert("이벤트 종류:" + event.type +", name 값은 "+ this.name);
}

var person = {
    "name" : "홍길동"
};

// 문서 영역 클릭하면 "이벤트 종류: click, name 값은 홍길동"이 출력된다.
document.body.onclick = $Fn(getName, person).bindForEvent(); 
 * @ignore
  
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
 
 * @description attach() 메서드는 함수를 특정 요소의 이벤트 핸들러로 등록한다. $Fn() 객체에 바인딩하여 사용할 때 함수의 반환 값이 false인 경우, 인터넷 익스플로러에서 기본 기능을 막기 때문에 사용하지 않도록 주의한다. 또한 다음과 같은 제약 사항이 있다.<br>
<ul>
	<li>이벤트 이름에는 on 접두어를 사용하지 않는다.</li>
	<li>마우스 휠 스크롤 이벤트는 mousewheel 로 사용한다.</li>
	<li>기본 이벤트 외에 추가로 사용이 가능한 이벤트로 domready, mouseenter, mouseleave, mousewheel이 있다.</li>
</ul>
 * @param {Variant} vElement 이벤트 핸들러를 할당할 요소(Element) 또는 요소로 이루어진 배열(Array).
 * @param {String} sEvent 이벤트 종류
 * @param {Boolean} [bUseCapture] 캡쳐링(capturing) 사용 여부(1.4.2 버전부터 지원). 사용하면 true 사용하지 않으면 false를 입력한다.
 * @see $Fn#detach
 * @return {$Fn} 생성된 $Fn() 객체.
 * @example
var someObject = {
    func : function() {
		// code here
   }
}

// 단일 요소에 클릭 이벤트 핸들러를 등록할 경우
$Fn(someObject.func, someObject).attach($("test"),"click"); 

// 여러 요소에 클릭 이벤트 핸들러를 등록할 경우
// 아래와 같이 첫 번째 파라미터로 배열이 입력되면 해당 모든 요소에 이벤트 핸들러가 등록된다.
$Fn(someObject.func, someObject).attach($$(".test"),"click");     
  
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
	var bIsIE = ua.indexOf("MSIE") > -1;
	if (typeof el.addEventListener != "undefined") {
		if (ev == "domready") {
			ev = "DOMContentLoaded";	
		}else if (ev == "mousewheel" && ua.indexOf("WebKit") < 0 && !/Opera/.test(ua) && !bIsIE) {
			/*
			 
IE9인 경우도 DOMMouseScroll이 동작하지 않음.
  
			 */
			ev = "DOMMouseScroll";	
		}else if (ev == "mouseenter" && !bIsIE){
			ev = "mouseover";
			fn = jindo.$Fn._fireWhenElementBoundary(el, fn);
		}else if (ev == "mouseleave" && !bIsIE){
			ev = "mouseout";
			fn = jindo.$Fn._fireWhenElementBoundary(el, fn);
		}else if(ev == "transitionend"||ev == "transitionstart"){
			var sPrefix, sPostfix = ev.replace("transition","");
			
			sPostfix = sPostfix.substr(0,1).toUpperCase() + sPostfix.substr(1);
			
			if(typeof document.body.style.WebkitTransition !== "undefined"){
				sPrefix = "webkit";
			}else if(typeof document.body.style.OTransition !== "undefined"){
				sPrefix = "o";
			}else if(typeof document.body.style.MsTransition !== "undefined"){
				sPrefix = "ms";
			}
			ev = (sPrefix?sPrefix+"Transition":"transition")+sPostfix;
			this._for_test_attach = ev;
			this._for_test_detach = "";
		}else if(ev == "animationstart"||ev == "animationend"||ev == "animationiteration"){
			var sPrefix, sPostfix = ev.replace("animation","");
			
			sPostfix = sPostfix.substr(0,1).toUpperCase() + sPostfix.substr(1);
			
			if(typeof document.body.style.WebkitAnimationName !== "undefined"){
				sPrefix = "webkit";
			}else if(typeof document.body.style.OAnimationName !== "undefined"){
				sPrefix = "o";
			}else if(typeof document.body.style.MsTransitionName !== "undefined"){
				sPrefix = "ms";
			}
			ev = (sPrefix?sPrefix+"Animation":"animation")+sPostfix;
			this._for_test_attach = ev;
			this._for_test_detach = "";
		}
		el.addEventListener(ev, fn, bUseCapture);
	} else if (typeof el.attachEvent != "undefined") {
		if (ev == "domready") {
            /*
             
iframe안에서 domready이벤트가 실행되지 않기 때문에 error를 던짐.
  
             */
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
 
 * @description detach() 메서드는 요소에 등록된 이벤트 핸들러를 등록 해제한다.
 * @param {Element} elElement 이벤트 핸들러를 등록 해제할 요소
 * @param {String} sEvent 이벤트 종류. 이벤트 이름에는 on 접두어를 사용하지 않는다.
 * @see $Fn#attach
 * @return {$Fn} 생성된 $Fn() 객체.
 * @example
var someObject = {
    func : function() {
		// code here
   }
}

// 단일 요소에 등록된 클릭 이벤트 핸들러를 등록 해제할 경우
$Fn(someObject.func, someObject).detach($("test"),"click");

// 여러 요소에 등록된 클릭 이벤트 핸들러를 등록 해제할 경우
// 아래와 같이 첫 번째 파라미터로 배열이 입력되면 해당 모든 요소에 이벤트 핸들러가 등록된다.
$Fn(someObject.func, someObject).detach($$(".test"),"click");
  
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
		}else if(ev == "transitionend"||ev == "transitionstart"){
			var sPrefix, sPostfix = ev.replace("transition","");
			
			sPostfix = sPostfix.substr(0,1).toUpperCase() + sPostfix.substr(1);
			
			if(typeof document.body.style.WebkitTransition !== "undefined"){
				sPrefix = "webkit";
			}else if(typeof document.body.style.OTransition !== "undefined"){
				sPrefix = "o";
			}else if(typeof document.body.style.MsTransition !== "undefined"){
				sPrefix = "ms";
			}
			ev = (sPrefix?sPrefix+"Transition":"transition")+sPostfix;
			this._for_test_detach = ev;
			this._for_test_attach = "";
		}else if(ev == "animationstart"||ev == "animationend"||ev == "animationiteration"){
			var sPrefix, sPostfix = ev.replace("animation","");
			
			sPostfix = sPostfix.substr(0,1).toUpperCase() + sPostfix.substr(1);
			
			if(typeof document.body.style.WebkitAnimationName !== "undefined"){
				sPrefix = "webkit";
			}else if(typeof document.body.style.OAnimationName !== "undefined"){
				sPrefix = "o";
			}else if(typeof document.body.style.MsTransitionName !== "undefined"){
				sPrefix = "ms";
			}
			ev = (sPrefix?sPrefix+"Animation":"animation")+sPostfix;
			this._for_test_detach = ev;
			this._for_test_attach = "";
		}
		if (fn) el.removeEventListener(ev, fn, false);
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
 
 * @description delay() 메서드는 래핑한 함수를 지정한 시간 이후에 호출한다.
 * @param {Number} nSec 함수를 호출할 때까지 대기할 시간(초 단위).
 * @param {Array} [aArgs] 함수를 호출할 때 사용할 파라미터를 담은 배열.
 * @see $Fn#bind
 * @see $Fn#setInterval
 * @return {$Fn} 생성된 $Fn() 객체.
 * @example
function func(a, b) {
	alert(a + b);
}

$Fn(func).delay(5, [3, 5]);//5초 이후에 3, 5 값을 매개변수로 하는 함수 func를 호출한다.
  
 */
jindo.$Fn.prototype.delay = function(nSec, args) {
	if (typeof args == "undefined") args = [];
	this._delayKey = setTimeout(this.bind.apply(this, args), nSec*1000);
	return this;
};

/**
 
 * @description setInterval() 메서드는 래핑한 함수를 지정한 시간 간격마다 호출한다.
 * @param {Number} nSec 함수를 호출할 시간 간격(초 단위).
 * @param {Array} [aArgs] 함수를 호출할 때 사용할 파라미터를 담은 배열.
 * @return {Number} 타이머(Interval)의 ID, 함수의 반복 호출을 중지할 때 사용한다.
 * @see $Fn#bind
 * @see $Fn#delay
 * @example
function func(a, b) {
	alert(a + b);
}

$Fn(func).setInterval(5, [3, 5]);//5초 간격으로 3, 5 값을 매개변수로 하는 함수 func를 호출한다.
  
 */
jindo.$Fn.prototype.setInterval = function(nSec, args) {
	if (typeof args == "undefined") args = [];
	this._repeatKey = setInterval(this.bind.apply(this, args), nSec*1000);
	return this._repeatKey;
};

/**
 
 * @function
 * @description repeat 메서드는 setInterval() 메서드와 동일하다.
 * @param {Number} nSec 함수를 호출할 시간 간격(초 단위).
 * @param {Array} [aArgs] 함수를 호출할 때 사용할 파라미터를 담은 배열.
 * @return {Number} 타이머(Interval)의 ID, 함수의 반복 호출을 중지할 때 사용한다.
 * @see $Fn#setInterval
 * @see $Fn#bind
 * @see $Fn#delay
 * @example
function func(a, b) {
	alert(a + b);
}

$Fn(func).repeat(5, [3, 5]);//5초 간격으로 3, 5 값을 매개변수로 하는 함수 func를 호출한다.
  
 */
jindo.$Fn.prototype.repeat = jindo.$Fn.prototype.setInterval;

/**
 
 * @description stopDelay() 메서드는 delay() 메서드로 지정한 함수 호출을 중지할 때 사용한다.
 * @return {$Fn} $Fn() 객체.
 * @see $Fn#delay
 * @example
function func(a, b) {
	alert(a + b);
}

var fpDelay = $Fn(func);
	fpDelay.delay(5, [3, 5]);
	fpDelay.stopDelay();
  
 */
jindo.$Fn.prototype.stopDelay = function(){
	if(typeof this._delayKey != "undefined"){
		window.clearTimeout(this._delayKey);
		delete this._delayKey;
	}
	return this;
}
  

/**
 
 * @description stopRepeat() 메서드는 repeat() 메서드로 지정한 함수 호출을 멈출 때 사용한다.
 * @return {$Fn} $Fn() 객체.
 * @see $Fn#repeat
 * @example
function func(a, b) {
	alert(a + b);
}

var fpDelay = $Fn(func);
	fpDelay.repeat(5, [3, 5]);
	fpDelay.stopRepeat();
  
 */
jindo.$Fn.prototype.stopRepeat = function(){
	if(typeof this._repeatKey != "undefined"){
		window.clearInterval(this._repeatKey);
		delete this._repeatKey;
	}
	return this;
}


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
		var fn = this._events[len].func;
		if (oElement && el!==oElement){
			continue;
		}
		
		this.detach(el, sEvent);
		
        /*
         
unload시에 엘리먼트에 attach한 함수를 detach하는 로직이 있는데 해당 로직으로 인하여 unload이벤트가 실행되지 않아 실행시키는 로직을 만듬. 그리고 해당 로직은  gc에서 호출할때만 호출.
  
         */
		var isGCCall = !oElement;
		
		if (isGCCall && window === el && sEvent == "unload" && _ua.indexOf("MSIE")<1) {
			this._func.call(this._this);
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
 
 * @description gc() 메서드는 문서에서 attach()로 등록한 모든 이벤트 핸들러를 해제한다.
 * @see $Fn#attach
 * @return {void}
 * @example
var someObject = {
   func1 : function() {
		// code here
   },
   func2 : function() {
		// code here
   }
}

$Fn(someObject.func1, someObject).attach($("test1"),"mouseup");
$Fn(someObject.func2, someObject).attach($("test1"),"mousedown");
$Fn(someObject.func1, someObject).attach($("test2"),"mouseup");
$Fn(someObject.func2, someObject).attach($("test2"),"mousedown");
..
..

$Fn.gc();
  
 */
jindo.$Fn.gc = function() {
	var p = jindo.$Fn.gc.pool;
	for(var key in p) {
		if(p.hasOwnProperty(key))
			try { p[key].free(); }catch(e){ };
	}

	/*
	 
레퍼런스를 삭제한다.
  
	 */
	jindo.$Fn.gc.pool = p = {};
};

/**
 
 * @description freeElement() 메서드는 지정한 요소에 할당된 모든 이벤트 핸들러를 해제한다.
 * @param {Element} elElement 이벤트 핸들러를 해제할 요소.
 * @since 1.3.5 버전부터 기능 추가
 * @return {void}
 * @see $Fn#gc
 * @example
var someObject = {
    func : function() {
		// code here
   }
}

$Fn(someObject.func, someObject).attach($("test"),"mouseup");
$Fn(someObject.func, someObject).attach($("test"),"mousedown");

$Fn.freeElement($("test"));
  
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
var _ua = navigator.userAgent;
if (typeof window != "undefined" && !(_ua.indexOf("IEMobile") == -1 && _ua.indexOf("Mobile") > -1 && _ua.indexOf("Safari") > -1)) {
 	jindo.$Fn(jindo.$Fn.gc).attach(window, "unload");
}
/**
 
 * @fileOverview $ElementList의 생성자 및 메서드를 정의한 파일
 * @name elementlist.js
 * @author Kim, Taegon
  
 */

/**
 
 * @class $ElementList() 객체는 여러 개의 DOM 요소를 한 번에 다룰 수 있는 기능을 제공한다. $ElementList 객체는 DOM 요소를 배열 형태로 관리한다.
 * @constructor
 * @description $ElementList() 객체를 생성한다. $ElementList() 객체를 생성할 때 DOM 요소의 ID 또는 ID를 원소로 같은 배열, 혹은 CSS 선택자, $Element() 객체를 원소로 갖는 배열 등을 사용하여 $ElementList() 객체를 생성한다.
 * @param {Variant} vElements 문서에서 DOM 요소를 찾기 위한 CSS 선택자(CSS Selector) 혹은 ID(String), $Element() 객체를 원소로 같는 배열(Array)를 입력한다.
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
 * @example
 // 'foo', 'bar' 요소의 ElementList를 생성한다.
var woElList = $ElementList($('foo','bar'));

// 문서의 모든 'DIV' 요소에 대한 $ElementList를 생성한다. 
var woElList = $ElementList('DIV');

  
 */
jindo.$ElementList = function (els) {
	var cl = arguments.callee;
	if (els instanceof cl) return els;
	if (!(this instanceof cl)) return new cl(els);
	
	if (els instanceof Array) {
		els = jindo.$A(els);
	} else if(jindo.$A && els instanceof jindo.$A){
		els = jindo.$A(els.$value());
	} else if (typeof els == "string" && jindo.cssquery) {
		els = jindo.$A(jindo.cssquery(els));
	} else {
		els = jindo.$A();
	}

	this._elements = els.map(function(v,i,a){ return jindo.$Element(v) });
}

/**
 
 * @description get() 메서드는 $ElementList() 객체의 내부 요소 중에서 지정한 인덱스에 해당하는 요소를 반환한다.
 * @param {Number} nIndex 가져올 요소의 인덱스.<br>인덱스는 0부터 시작한다.
 * @return {$Element} 지정한 인덱스의 요소.
  
*/
jindo.$ElementList.prototype.get = function(idx) {
	return this._elements.$value()[idx];
};

/**
 
 * @description getFirst() 메서드는 $ElementList() 객체의 첫 번째 요소를 반환한다. get() 메서드에 인덱스 값으로 0을 지정한 것과 동일하다.
 * @return {$Element} $ElementList() 객체의 첫 번째 요소.
 * @see $ElementList#get
 * @see $ElementList#getLast
  
*/
jindo.$ElementList.prototype.getFirst = function() {
	return this.get(0);
};

/**
 
 * @description length() 메서드는 $A() 객체의 length() 메서드를 이용하여 $ElementList() 객체의 크기를 반환하거나 조정한다.
 * @param 	{Number} [nLen] 지정할 배열의 크기. nLen이 기존 $ElementList() 객체의 배열 크기보다 크면 추가된 배열의 공간에 oValue 파라미터의 값으로 채운다. nLen이 기존 $ElementList() 객체의 배열 크기보다 작으면 nLen 번째 이후의 원소는 제거한다.
 * @param 	{Variant} [oValue] 새로운 원소를 추가할 때 사용할 초기 값.
 * @return 	{Number} 이 메서드의 파라미터를 모두 생략하면 현재 $ElementList() 객체의 배열 크기(Number)를 반환하고, 파라미터를 지정한 경우에는 내부 배열을 변경한 $ElementList() 객체를 반환한다.
 * @since 1.4.3 버전부터 사용 가능
 * @see $A#length
  
*/
jindo.$ElementList.prototype.length = function(nLen, oValue) {
	return this._elements.length(nLen, oValue);
}

/**
 
 * @description getFirst() 메서드는 $ElementList() 객체의 마지막 요소를 반환한다. get() 메서드에 인덱스 값으로 마지막 인덱스 번호를 지정한 것과 동일하다.
 * @return {$Element} $ElementList() 객체의 마지막 요소.
 * @see $ElementList#get
 * @see $ElementList#getFirst
  
*/
jindo.$ElementList.prototype.getLast = function() {
	return this.get(Math.max(this._elements.length()-1,0));
};
/**
 
 * @description $value() 메서드는 내부 배열을 반환한다.
 * @return {Array} $Element() 객체를 원소로 갖는 배열.
  
*/
jindo.$ElementList.prototype.$value = function() {
	return this._elements.$value();
};

(function(proto){
	var setters = ['show','hide','toggle','addClass','removeClass','toggleClass','fireEvent','leave',
				   'empty','appear','disappear','className','width','height','text','html','css','attr'];
	
	jindo.$A(setters).forEach(function(name){
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
 
 * @fileOverview $S의 생성자 및 메서드를 정의한 파일
 * @name string.js
 * @author Kim, Taegon
  
 */

/**
 
 * @class $S() 객체는 String 객체를 래핑(wrapping)하여 문자열을 처리하기 위한 확장 기능을 제공한다.
 * @constructor
 * @description $S() 객체를 생성한다.
 * @param {String} sStr 래핑할 문자열.
 * @example
var sStr = 'Hello world!';
var oStr = $S(sStr);            // $S() 객체 생성
var oStr2 = new $S(sStr);        // new를 사용한 $S() 객체 생성
 
 */
jindo.$S = function(str) {
	var cl = arguments.callee;

	if (typeof str == "undefined") str = "";
	if (str instanceof cl) return str;
	if (!(this instanceof cl)) return new cl(str);

	this._str = str+"";
}

/**
 
 * @description $value() 메서드는 $S() 객체가 감싸고 있던 원본 문자열(String 객체)을 반환한다. toString() 메서드와 같은 의미이다.
 * @return {String} 원본 String 객체.
 * @see $S#toString
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String">String</a> - MDN Docs
 * @example
var str = $S("Hello world!!");
str.$value();
// 결과 :
// Hello world!!
  
 */
jindo.$S.prototype.$value = function() {
	return this._str;
};

/**
 
 * @function
 * @description toString() 메서드는 $S() 객체가 감싸고 있던 원본 문자열(String 객체)을 반환한다. $value() 메서드와 같은 의미이다.
 * @return {String} 원본 String 객체.
 * @see $S#$value
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String">String</a> - MDN Docs
 * @example
var str = $S("Hello world!!");
str.toString();
// 결과 :
// Hello world!!
  
 */
jindo.$S.prototype.toString = jindo.$S.prototype.$value;

/**
 
 * @description trim() 메서드는 문자열의 양 끝에 있는 공백을 제거한다.
 * @return {$S} 문자열의 양 끝에 있는 공백을 제거한 새로운 $S() 객체
 * @since 1.4.1 버전부터 전각공백도 제거
 * @example
var str = "   I have many spaces.   ";
document.write ( $S(str).trim() );
// 결과 :
// I have many spaces.
  
 */
jindo.$S.prototype.trim = function() {
	if ("".trim) {
		jindo.$S.prototype.trim = function() {
			return jindo.$S(this._str.trim());
		}
	}else{
		jindo.$S.prototype.trim = function() {
			return jindo.$S(this._str.replace(/^(\s|　)+/g, "").replace(/(\s|　)+$/g, ""));
		}
	}
	
	return jindo.$S(this.trim());
	
};

/**
 
 * @description escapeHTML() 메서드는 HTML 특수 문자를 HTML 엔티티(Entities)형식으로 변환한다. 변경하는 문자는 다음 표와 같다.<br>
 <table>
	<caption>HTML Escape 문자 변환</caption>
	<thead>
		<tr>
			<th>변환 대상 문자</th>
			<th>&quot;</th>
			<th>&amp;</th>
			<th>&lt;</th>
			<th>&gt;</th>
			<th>&#39;</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th>변환 결과</th>
			<td>&amp;quot;</td>
			<td>&amp;amp;</td>
			<td>&amp;lt;</td>
			<td>&amp;gt;</td>
			<td>&#39;</td>			
		</tr>
	</tbody>
 </table>
 * @return {$S} HTML 특수 문자를 엔티티 형식으로 변환한 새로운 $S() 객체.
 * @see $S#unescapeHTML
 * @see $S#escape
 * @example
 var str = ">_<;;";
 document.write( $S(str).escapeHTML() );
 
 // 결과 :
 // &amp;gt;_&amp;lt;;;
  
 */
jindo.$S.prototype.escapeHTML = function() {
	var entities = {'"':'quot','&':'amp','<':'lt','>':'gt','\'':'#39'};
	var s = this._str.replace(/[<>&"']/g, function(m0){
		return entities[m0]?'&'+entities[m0]+';':m0;
	});
	return jindo.$S(s);
};

/**
 
 * @description stripTags() 메서드는 문자열에서 XML 혹은 HTML 태그를 제거한다.
 * @return {$S} XML 혹은 HTML 태그를 제거한 새로운 $S() 객체.
 * @example
 var str = "Meeting <b>people</b> is easy.";
 document.write( $S(str).stripTags() );
 
 // 결과 :
 // Meeting people is easy.
  
 */
jindo.$S.prototype.stripTags = function() {
	return jindo.$S(this._str.replace(/<\/?(?:h[1-5]|[a-z]+(?:\:[a-z]+)?)[^>]*>/ig, ''));
};

/**
 
 * @description times() 메서드는 문자열을 파라미터로 지정한 횟수만큼 반복하는 문자열을 생성한다.
 * @param {Number} nTimes 반복할 횟수.
 * @return {$S} 문자열을 지정한 횟수만큼 반복한 새로운 $S() 객체
 * @example
 document.write ( $S("Abc").times(3) );
 
 // 결과 : AbcAbcAbc
  
 */
jindo.$S.prototype.times = function(nTimes) {
	var buf = [];
	for(var i=0; i < nTimes; i++) {
		buf[buf.length] = this._str;
	}

	return jindo.$S(buf.join(''));
};

/**
 
 * @description unescapeHTML() 메서드는 이스케이프(escape)된 문자를 원래의 문자로 변환한다.
 * @return {$S} 이스케이프된 문자를 원래의 문자로 변환한 새로운 $S() 객체
 * @see $S#escapeHTML
 * @example
var str = "&lt;a href=&quot;http://naver.com&quot;&gt;Naver&lt;/a&gt;";
document.write( $S(str).unescapeHTML() );

// 결과 :
// <a href="http://naver.com">Naver</a>
  
 */
jindo.$S.prototype.unescapeHTML = function() {
	var entities = {'quot':'"','amp':'&','lt':'<','gt':'>','#39':'\''};
	var s = this._str.replace(/&([a-z]+|#[0-9]+);/g, function(m0,m1){
		return entities[m1]?entities[m1]:m0;
	});
	return jindo.$S(s);
};

/**
 
 * @description escape() 메서드는 문자열에 포함된 한글을 ASCII 문자열로 인코딩하고 non-ASCII 문자를 이스케이프(escape)한다. 변경하는 문자는 다음 표와 같다.<br>
 <table>
	<caption>Escape 문자 변환</caption>
	<thead>
		<tr>
			<th>변환 대상 문자</th>
			<th>\r</th>
			<th>\n</th>
			<th>\t</th>
			<th>'</th>
			<th>"</th>
			<th>non-ASCII 문자</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th>변환 결과</th>
			<td>\\r</td>
			<td>\\n</td>
			<td>\\t</td>
			<td>\'</td>
			<td>\"</td>	
			<td>\uXXXX</td>	
		</tr>
	</tbody>
 </table>
 * @return {$S} 문자열을 이스케이프한 새로운 $S() 객체
 * @see $S#escapeHTML
 * @example
 var str = '가"\'나\\';
 document.write( $S(str).escape() );
 
 // 결과 :
 // \uAC00\"\'\uB098\\
  
 */
jindo.$S.prototype.escape = function() {
	var s = this._str.replace(/([\u0080-\uFFFF]+)|[\n\r\t"'\\]/g, function(m0,m1,_){
		if(m1) return escape(m1).replace(/%/g,'\\');
		return (_={"\n":"\\n","\r":"\\r","\t":"\\t"})[m0]?_[m0]:"\\"+m0;
	});

	return jindo.$S(s);
};

/**
 
 * @description bytes() 메서드는 문자열의 실제 바이트(byte) 수를 반환하고, 제한하려는 바이트(byte) 수를 지정하면 문자열을 해당 크기에 맞게 잘라낸다. 또한, 지정한 인코딩 방식에 따라 한글을 비롯한 유니코드 문자열의 바이트 수를 계산한다.
 * @param {Variant} [vOption] 파라미터를 바이트 수(Number)로 지정하면 크기에 맞게 문자열을 잘라낸다. 인코딩 방식을 지정하고 제한할 크기를 설정한 객체(Object)를 파라미터로 입력하면 지정한 인코딩 방식에 맞춰 문자열을 크기를 반환하거나 잘라낸다. 파라미터를 생략할 경우 문자열의 크기만 반환한다.
 * @return {Variant} 파라미터에 제한할 바이트 수를 지정하면 해당 크기만큼 문자열을 잘라낸 $S() 객체를 반환하고 이외의 경우 문자열의 크기(Number)를 반환한다.
 * @since 1.4.3 버전부터 인코딩 방식 사용 가능
 * @example
// 문서가 euc-kr 환경임을 가정합니다.
var str = "한글과 English가 섞인 문장...";

document.write( $S(str).bytes() );
// 결과 :
// 37

document.write( $S(str).bytes(20) );
// 결과 :
// 한글과 English가

document.write( $S(str).bytes({charset:'euc-kr',size:20}) );
// 결과 :
// 한글과 English가 섞

document.write( $S(str).bytes({charset:'euc-kr'}) );
// 결과 :
// 29
  
 */
jindo.$S.prototype.bytes = function(vConfig) {
	var code = 0, bytes = 0, i = 0, len = this._str.length;
	var charset = ((document.charset || document.characterSet || document.defaultCharset)+"");
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

/**
 
 * @description parseString() 메서드는 URL 쿼리스트링(Query String)을 객체로 파싱한다. 예제를 확인한다.
 * @return {Object} 쿼리스트링을 파싱한 객체.
 * @see <a href="http://en.wikipedia.org/wiki/Querystring">Query String</a> - Wikipedia
 * @example
var str = "aa=first&bb=second";
var obj = $S(str).parseString();
// 결과 :
// obj => { aa : "first", bb : "second" }
  
 */
jindo.$S.prototype.parseString = function() {
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
			if (typeof buf[key] == "undefined") buf[key] = [];
			buf[key][buf[key].length] = isescape? escape(val) : val;;
		} else {
			buf[key] = isescape? escape(val) : val;
		}
	}

	return buf;
};

/**
 
 * @description escapeRegex() 메서드는 문자열을 정규식에 사용할 수 있도록 이스케이프(escape)한다. 예제를 참고한다.
 * @since 1.2.0 버전에 작성됨.
 * @return {$S} 내부 문자열이 이스케이프된 $S() 객체.
 * @see <a href="http://en.wikipedia.org/wiki/Regexp">Regular Expression</a>
 * @example
var str = "Slash / is very important. Backslash \ is more important. +_+";
document.write( $S(str).escapeRegex() );
 
 // 결과 : \/ is very important\. Backslash \\ is more important\. \+_\+
  
 */
jindo.$S.prototype.escapeRegex = function() {
	var s = this._str;
	var r = /([\?\.\*\+\-\/\(\)\{\}\[\]\:\!\^\$\\\|])/g;

	return jindo.$S(s.replace(r, "\\$1"));
};

/**
 
 * @descritpion format() 메서드는 문자열을 형식 문자열(Format Specifier)에 대입하여 새로운 문자열을 만든다. 형식 문자열은 %로 시작하며, 사용하는 형식 문자열의 종류는 PHP의 sprintf() 함수가 사용하는 것과 동일하다.
 * @param {String} sFormatString 대입할 형식 문자열.
 * @return {String} 문자열을 형식 문자열에 대입하여 만든 새로운 문자열.
 * @see <a href="http://www.php.net/manual/en/function.sprintf.php">sprintf()</a>" - php.net
 * @example
var str = $S("%4d년 %02d월 %02d일").format(2008, 2, 13);
*
* // 결과 :
* // str = "2008년 02월 13일"

var str = $S("패딩 %5s 빈공백").format("값");
*
* // 결과 :
* // str => "패딩     값 빈공백"

var str = $S("%b").format(10);
*
* // 결과 :
* // str => "1010"

var str = $S("%x").format(10);
*
* // 결과 :
* // str => "a"

var str = $S("%X").format(10);
*
* // 결과 :
* // str => "A"
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
/**
 
 * @fileOverview $Form 생성자 및 메서드를 정의한 파일
 * @name form.js
 * @author Hooriza
  
 */

/**
 
 * @class $Form() 객체는 &lt;form&gt; 요소와 자식 요소를 제어하는 기능을 제공한다.
 * @constructor
 * @description $Form() 객체를 생성한다.
 * @param {Variant} elForm	&lt;form&gt; 요소(Element), 혹은 &lt;form&gt; 요소의 ID(String). 만약 동일한 ID를 사용한 &lt;form&gt; 요소가 둘 이상이면 먼저 나오는 요소를 감싼 $Form() 객체를 반환한다.
  
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
 
 * @description $value() 메서드는 원본 &lt;form&gt; 요소를 반환한다
 * @return {Element} 원본 &lt;form&gt; 요소
 * @example
var el = $('<form>');
var form = $Form(el);

alert(form.$value() === el); // true
  
 */
jindo.$Form.prototype.$value = function() {
	return this._form;
};

/**
 
 * @description serialize() 메서드는 &lt;form&gt; 요소의 특정 또는 전체 입력 요소를 쿼리스트링(Query String) 형태로 반환한다. serialize() 메서드를 사용할 때 파라미터를 입력하지 않으면 &lt;form&gt; 요소의 하위의 모든 입력 요소를 쿼리스트링으로 반환하고 파라미터를 입력하면 지정한 이름과 같은 name 속성을 가지는 입력 요소를 쿼리스트링 형태로 반환한다.
 * @param {String} [sName1] 첫 번째 입력 요소의 이름(name).
 * @param {String} […] …
 * @param {String} [sNameN] N 번째 입력 요소의 이름(name).
 * @return {String} 쿼리스트링 형태로 변환한 문자열.
 * @see <a href="http://en.wikipedia.org/wiki/Querystring">Query String</a> - Wikipedia
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
	// ONE=1&TWO=2&THREE=3_2&FOUR=4_3

	var str = form.serialize('ONE', 'THREE');
	// ONE=1&THREE=3_2'
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
 
 * @description element() 메서드는 특정 또는 전체 입력 요소를 반환한다. 파라미터에 가져올 입력 요소의 이름(name)을 지정할 수 있다. 또한, 파라미터를 생략하면 모든 입력 요소의 값을 가져온다.
 * @param {String} [sKey] 입력 요소의 이름(name).
 * @return {Variant} 입력 요소(Element) 또는 입력 요소를 가진 배열(Array).
  
 */
jindo.$Form.prototype.element = function(sKey) {

	if (arguments.length > 0)
		return this._form[sKey];
	
	return this._form.elements;
	
};

/**
 
 * @description enable() 메서드는 입력 요소의 활성화 여부를 검사하거나 설정한다. 파라미터에 입력 요소의 이름(name)만 입력하면 해당 요소의 활성화 여부를 확인할 수 있다. 입력 요소의 이름과 함께 true 값을 입력하면 해당 요소를 활성화하고 false를 입력하면 비활성화한다. 또한, 한번에 여러 요소의 활성화 상태를 변경하기 위해 객체를 입력할 수도 있다.
 * @param {String} sName 입력 요소의 이름. 이 파라미터로 여러 입력 요소의 활성화 여부를 지정한 객체를 입력할 수 있다. 이와 관련한 내용은 예제를 참고한다.
 * @param {Boolean} [bEnable] 활성화 여부.
 * @return {Variant} 입력 요소의 활성화 여부를 나타내는 Boolean 값 또는 입력 요소의 활성화 여부를 반영한 $Form() 객체.
 * @example

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
 
 * @description value() 메서드는 &lt;form&gt; 요소의 값을 얻거나 설정한다. 파라미터에 입력 요소의 이름(name)만 입력하면 해당 요소의 값을 확인할 수 있다. 입력 요소의 이름과 함께 값을 지정하면 해당 요소의 값을 변경한다. 또한, 한번에 여러 요소의 값을 변경하기 위해 객체를 입력할 수도 있다.
 * @param {String} sName 입력 요소의 이름. 이 파라미터로 여러 입력 요소의 값을 지정한 객체를 입력할 수 있다. 이와 관련한 내용은 예제를 참고한다.
 * @param {String} [vValue] 입력 요소에 지정할 값.
 * @return {Variant} 입력 요소의 값(String) 또는 입력 요소의 값을 반영한 $Form() 객체.
 * @example

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
  
 */
jindo.$Form.prototype.value = function(sKey) {
	
	if (typeof sKey == 'object') {
		
		var self = this;
		jindo.$H(sKey).forEach(function(bFlag, sKey) { self.value(sKey, bFlag); });
		return this;
		
	}
	
	var aEls = this.element(sKey);
	if (!aEls) throw new Error('엘리먼트는 존재하지 않습니다.');
	aEls = aEls.nodeType == 1 ? [ aEls ] : aEls;
	
	if (arguments.length > 1) { // setter
		
		var sVal = arguments[1];
		
		jindo.$A(aEls).forEach(function(o) {
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
		case 'select-multiple':
			if (o.selectedIndex != -1){
				for (var i = 0, len = o.options.length; i < len; i++){
					if (o.options[i].selected) aRet.push(o.options[i].value);
				}
			}
			break;
		default:
			aRet.push(o.value);
			break;
		}
		
	});
	
	return aRet.length > 1 ? aRet : aRet[0];
	
};

/**
 
 * @description submit() 메서드는 &lt;form&gt; 요소의 데이터를 제출(submit)한다. submit() 메서드에 파라미터를 지정하면 &lt;form&gt; 요소의 target 속성을 무시하고 지정한 전송 대상으로 정보를 전송한다. 이때 기존 &lt;form&gt; 요소의 target 속성을 변경하지 않는다. 또한 파라미터로 함수를 입력할 수 있으며 해당 함수가 true 값을 반환하면 데이터를 제출한다. 이 함수를 사용하여 데이터를 전송하기 전에 검증할 수 있다.
 * @param {String} [sTargetName] 전송 대상. 이 파라미터를 생략하면 &lt;form&gt; 요소의 target 속성에 지정된 대상으로 정보를 전송한다.
 * @param {String} [fValidation] &lt;form&gt; 요소의 데이터를 검증할 함수. 이 함수의 파라미터로 $Form() 객체가 감싸고 있는 원본 &lt;form&gt; 요소가 입력된다.
 * @return {$Form} 데이터를 제출한 $Form() 객체.
 * @example
var form = $Form(el);
form.submit();
form.submit('foo');

* @example
// fValidation 파라미터 사용한 경우
var form = $Form(el);
form.submit("target_name");

form.submit(function(){
	if($("test").value.length > 0) {
		return true; //true를 리턴하면 submit() 수행
	}
	
	return false; //false를 리턴하면 submit() 수행하지 않음
});

form.submit("target_name", function(){
	if($("test").value.length > 0) {
		return true;
	}
	
	return false;
});
  
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
 
 * @description reset() 메서드는 &lt;form&gt; 요소를 초기화(reset)한다. 파라미터로 함수를 입력할 수 있으며 해당 함수가 true 값을 반환하면 &lt;form&gt; 요소를 초기화한다.
 * @param {String} [fValidation] &lt;form&gt; 요소의 데이터를 초기화하기 전에 실행할 함수.
 * @return {$Form} 초기화한 $Form() 객체.
 * @example
var form = $Form(el);
form.reset(); 

 * @example
// fValidation 파라미터 사용한 경우
var form = $Form(el);

form.submit(function(){
	return confirm("초기화하시겠습니까?");
});
  
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
 * @author Kim, Taegon
  
 */

/**
 
 * @class $Template() 객체를 사용하면 템플릿을 해석하여 템플릿에 동적으로 데이터를 적용할 수 있다.
 * @constructor
 * @description $Template() 객체를 생성한다.$Template() 객체를 생성할 때 생성자의 파라미터로 3가지 종류의 값을 입력할 수 있다. 각 종류에 따라 동작하는 방식은 다음과 같다.<br>
 <ul>
	<li>파라미터가 문자열이면 두 가지 방식으로 동작한다.
		<ul>
			<li>문자열이 HTML 요소의 id라면 HTML 요소의 innerHTML을 템플릿으로 사용한다.</li>
			<li>만약 일반 문자열이라면 문자열 자체를 템플릿으로 사용한다.</li>
		</ul>
	</li>
	<li>파라미터가 HTML 요소이면 TEXTAREA와 SCRIPT 요소만 사용할 수 있다.
		<ul>
			<li>HTML 요소가 SCRIPT 요소인 경우 type 속성은 반드시 "text/template"으로 지정해야 한다.</li>
			<li>HTML 요소의 value 값을 템플릿으로 사용하며, value 값이 없을 경우 HTML 요소의 innerHTML을 템플릿으로 사용한다.</li>
		</ul>
	</li>
	<li>파라미터가 $Template() 객체면 전달된 파라미터를 그대로 반환하며 파라미터를 생략하면 빈 문자열("")을 템플릿으로 사용한다.</li>
</ul>
 * @param {Variant} vTemplate 템플릿으로 사용할 문자열(String), HTML 요소(Element), 혹은 $Template() 객체.
 * @example
// 파라미터가 일반 문자열인 경우
var tpl = $Template("{=service} : {=url}");

 * @example
<textarea id="tpl1">
{=service} : {=url}
&lt;/textarea&gt;

// 같은 TEXTAREA 요소를 템플릿으로 사용한다
var template1 = $Template("tpl1");		// 파라미터가 HTML 요소의 ID
var template2 = $Template($("tpl1"));	// 파라미터가 TEXTAREA 요소인 경우
</script>

 * @example
<script type="text/template" id="tpl2">
{=service} : {=url}
</script>

// 같은 SCRIPT 요소를 템플릿으로 사용한다
var template1 = $Template("tpl2");		// 파라미터가 HTML 요소의 ID
var template2 = $Template($("tpl2"));	// 파라미터가가 SCRIPT 요소인 경우
  
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
					_aStr.push('	if( (p# && isNaN(i#=parseInt(x#,10))) || (!p# && !t#.propertyIsEnumerable(x#)) ) continue;');
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
 
 * @fileOverview $Date() 객체의 생성자 및 메서드를 정의한 파일
 * @name date.js
 * @author Kim, Taegon
  
 */

/**
 
 * @class $Date() 객체는 Date 객체를 래핑(Wrapping)하여 날짜 및 시간을 처리하기 위한 확장 기능을 제공한다.
 * @extends core
 * @constructor
 * @description $Date() 객체를 생성한다. $Date() 객체를 생성할 때 파라미터 없이 생성하거나 ISO Date 포맷 또는 밀리 초 단위의 정수를 생성자의 인수로 입력할 수 있다. ISO Date 포맷 문자를 넣은 경우 $Date.utc 속성을 기반하여 날짜를 계산한다.
 * @param {Variant} [vDate] Date 포맷의 문자열(String)이나 정수 값(Number). 파라미터를 생략할 경우 시간이 설정되지 않은 $Date() 객체를 생성하며 추후 시간을 설정할 수 있다.
 * @see $Date.utc
 * @see $Date#format
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date">Date</a> - MDN Docs
 * @see <a href="http://ko.wikipedia.org/wiki/ISO_8601">ISO 8601</a> - W3C
 * @example
$Date();
$Date(milliseconds);
$Date(dateString);
//1.4.6 이후부터 달까지만 넣어도 $Date사용 가능하여 빈 값은 1로 설정
$Date(year, month, [date, [hours, [minitues, [seconds, [milliseconds]]]]]);
$Date(2010,6);//이러고 하면 $Date(2010,6,1,1,1,1,1); 와 같음.
  
 */
jindo.$Date = function(src) {
	var a=arguments,t="";
	var cl=arguments.callee;

	if (src && src instanceof cl) return src;
	if (!(this instanceof cl)) return new cl(a[0],a[1],a[2],a[3],a[4],a[5],a[6]);

	if ((t=typeof src) == "string") {
        /*
         
iso string일때
  
         */
		if (/(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d)))/.test(src)) {
			try{
				this._date = new Date(src);
				if (!this._date.toISOString) {
					this._date = jindo.$Date.makeISO(src);
				}else if(this._date.toISOString() == "Invalid Date"){
					this._date = jindo.$Date.makeISO(src);
				}
			}catch(e){
				this._date = jindo.$Date.makeISO(src);
			}
		}else{
			this._date = cl.parse(src);
		}
		
	} else if (t == "number") {
		if (typeof a[1] == "undefined") {
			/*
			 
하나의 숫지인 경우는 밀리 세켄드로 계산함.
  
			 */
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

jindo.$Date.makeISO = function(src){
	var match = src.match(/(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d)(?:[T ](\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|(?:([-+])(\d\d)(?::?(\d\d))?)?)?)?)?)?/);
	var hour = parseInt(match[4]||0,10);
	var min = parseInt(match[5]||0,10);
	if (match[8] == "Z") {
		hour += jindo.$Date.utc;
	}else if(match[9] == "+" || match[9] == "-"){
		hour += (jindo.$Date.utc - parseInt(match[9]+match[10],10));
		min  +=  parseInt(match[9] + match[11],10);
	}
	return new Date(match[1]||0,parseInt(match[2]||0,10)-1,match[3]||0,hour ,min ,match[6]||0,match[7]||0);
	
}

/**
 
 * @description names 속성은 $Date() 객체에서 사용하는 달, 요일, 오전/오후를 표시하는 문자열을 저장한다. s_ 를 접두어로 가지는 이름은 약어(abbreviation)이다.<br>
<table>
	<caption>달, 요일, 오전/오후 표시 문자열</caption>
	<thead>
		<tr>
			<th scope="col">구분</th>
			<th scope="col">문자열</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>month</td>
			<td>January, Febrary, March, April, May, June, July, August, September, October, Novermber, December</td>
		</tr>
		<tr>
			<td>s_month</td>
			<td>Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec</td>
		</tr>
		<tr>
			<td>day</td>
			<td>Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday</td>
		</tr>
		<tr>
			<td>s_day</td>
			<td>Sun, Mon, Tue, Wed, Thu, Fri, Sat</td>
		</tr>
		<tr>
			<td>ampm</td>
			<td>AM, PM</td>
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
 
 * @description utc 속성은 협정 세계시와 시차를 저장한다. 기본 값은 한국 시간 기준으로 +9로 저장된다.
 * @see <a href="http://ko.wikipedia.org/wiki/UTC">협정 세계시간</a>
 * @example
$Date.utc = -10; // 하와이 시간을 기준으로 한다.
  
 */
jindo.$Date.utc = 9;

/**
 
 * @description now() 메서드는 현재 시간을 밀리 초(millisecond) 단위의 정수로 리턴한다.
 * @returns {Number} 현재 시간을 밀리 초 단위의 정수로 나타낸 값.
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/now">Date.now()</a> - MDN Docs
 * @example
$Date().now(); //sample : 1304907432081
  
 */
jindo.$Date.now = function() {
	return Date.now();
};
/**
 
 * @description name() 메서드는 names 속성에 정의된 달, 요일, 오전/오후를 표시하는 문자열의 값을 가져오거나 문자열을 새로 설정할 수 있다. 
 * @since 1.4.1 버전부터 추가됨.
 * @param {Object} oNames names 속성에 정의된 내용을 대체할 객체.
 * @see $Date.names
  
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
 
 * @description parse() 메서드는 인수로 지정한 문자열을 파싱하여 $Date() 객체를 생성한다.
 * @param {String} sDate 날짜, 혹은 시간 형식을 가진 문자열
 * @returns {Object} Date 객체.
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date">Date</a> - MDN Docs
  
 */
jindo.$Date.parse = function(strDate) {
	return new Date(Date.parse(strDate));
};

/**
 
 * @description $value() 메서드는 $Date() 객체가 감싸고 있던 원본 Date 객체를 반환한다.
 * @returns {Object} 원본 Date 객체.
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date">Date</a> - MDN Docs
  
 */
jindo.$Date.prototype.$value = function(){
	return this._date;
};

/**
 
 * @description format() 메서드는 $Date() 객체가 저장하고 있는 시간을 파라미터로 지정한 형식 문자열(Format Specifier)에 맞추어 변환한다. 지원하는 형식 문자열은 PHP의 date() 함수와 동일하다.<br>
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
 * @param {String} sFormat  형식 문자열
 * @returns {String} 시간을 형식 문자열에 맞추어 변환한 문자열.
 * @see <a href="http://kr2.php.net/manual/en/function.date.php">date()</a> - php.net
 * @example
	var oDate = $Date("Jun 17 2009 12:02:54");
	oDate.format("Y.m.d(D) A H:i") => "2009.06.17(Wed) PM 12:02"
  
 */
jindo.$Date.prototype.format = function(strFormat){
	var o = {};
	var d = this._date;
	var name = this.name();
	var self = this;
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

/**
 
 * @description time() 메서드는 GMT(1970/01/01 00:00:00)를 기준으로 경과한 시간을 $Date() 객체에 설정하거나 $Date() 객체가 가지고 있는 값을 가져온다. 파라미터를 입력하면 경과한 시간을 설정하고 파라미터를 생략하면 현재 시간을 기준으로 경과한 시간을 가져온다.
 * @param {Number} [nTimeStamp]  밀리 초 단위의 정수 값.
 * @returns {Variant} 파라미터를 지정했다면 GMT를 기준으로 파라미터에 지정한 시간만큼 경과한 시간을 설정한 $Date() 객체. 파라미터를 지정하지 않았다면 GMT를 기준으로 $Date 객체에 지정된 시각까지 경과한 밀리 초 단위의 시간(Number).
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getTime">Date.getTime()</a> - MDN
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setTime">Date.setTime()</a> - MDN
 * @see <a href="http://ko.wikipedia.org/wiki/GMT">GMT</a>
 * @example
var oDate = new $Date(Date.now());
oDate.time(); //sample : 1304908070435
  
 */
jindo.$Date.prototype.time = function(nTime) {
	if (typeof nTime == "number") {
		this._date.setTime(nTime);
		return this;
	}

	return this._date.getTime();
};

/**
 
 * @description year() 메서드는 $Date() 객체가 저장하고 있는 시각의 연도(year)를 가져오거나 지정한 값으로 설정한다. 파라미터를 입력하면 $Date() 객체에 지정한 연도를 설정하고 파라미터를 생략하면 $Date() 객체가 저장하고 있는 연도를 반환한다. 이때 연도 값의 형식은 4자리 정수 값이다.
 * @param {Number} [nYear] $Date() 객체에 설정할 연도(year).
 * @returns {Variant} 파라미터를 입력했을 경우 연도를 새로 설정한 $Date() 객체를 반환하고 파라미터를 지정하지 않았다면 $Date() 객체가 저장하고 있는 시각의 연도(Number)를 반환한다.
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getFullYear">Date.getFullYear()</a> - MDN
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setFullYear">Date.setFullYear()</a> - MDN
 * @example
var oDate = new $Date(Date.now());
oDate.year(); // 2011
oDate.year(1984);
oDate.year(); // 1984
  
 */
jindo.$Date.prototype.year = function(nYear) {
	if (typeof nYear == "number") {
		this._date.setFullYear(nYear);
		return this;
	}

	return this._date.getFullYear();
};

/**
 
 * @description month() 메서드는 $Date() 객체가 저장하고 있는 시각의 달(month)을 가져오거나 지정한 값으로 설정한다. 파라미터를 입력하면 $Date() 객체에 지정한 달을 설정하고 파라미터를 생략하면 $Date() 객체가 저장하고 있는 달을 반환한다. 이때 사용되는 달 값의 범위는 0(1월)에서 11(12월)사이의 정수 값이다.
 * @param {Number} [nMon]  $Date() 객체에 설정할 달(month).
 * @returns {Variant} 파라미터를 입력했을 경우 달을 새로 설정한 $Date() 객체를 반환하고 파라미터를 지정하지 않았다면 $Date() 객체가 저장하고 있는 시각의 달(Number)을 반환한다.
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getMonth">Date.getMonth()</a> - MDN
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setMonth">Date.setMonth()</a> - MDN
 * @example
var oDate = new $Date(Date.now());
oDate.month(); // 4, 5월
oDate.month(1);
oDate.month(); // 3, 4월
  
 */
jindo.$Date.prototype.month = function(nMon) {
	if (typeof nMon == "number") {
		this._date.setMonth(nMon);
		return this;
	}

	return this._date.getMonth();
};

/**
 
 * @description date() 메서드는 $Date() 객체가 저장하고 있는 시각의 날짜(day of the month)를 가져오거나 지정한 값으로 설정한다. 파라미터를 입력하면 $Date() 객체에 지정한 날짜를 설정하고 파라미터를 생략하면 $Date() 객체가 저장하고 있는 날짜를 반환한다. 이때 사용되는 날짜의 범위는 1에서 31 사이의 정수 값이다.
 * @param {Number} [nDate] $Date() 객체에 설정할 날짜(day of the month).
 * @returns {Variant} 파라미터를 입력했을 경우 날짜를 새로 설정한 $Date() 객체를 반환하고 파라미터를 지정하지 않았다면 $Date() 객체가 저장하고 있는 시각의 날짜(Number)를 반환한다.
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getDate">Date.getDate()</a> - MDN
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setDate">Date.setDate()</a> - MDN
 * @example
var oDate = new $Date(Date.now());
oDate.date(); // 9, 9일
oDate.date(15);
oDate.date(); // 14, 14일
  
 */
jindo.$Date.prototype.date = function(nDate) {
	if (typeof nDate == "number") {
		this._date.setDate(nDate);
		return this;
	}

	return this._date.getDate();
};

/**
 
 * @description day() 메서드는 $Date() 객체가 지정하고 있는 시각의 요일(day of the week)를 가져온다. 이때 반환되는 요일의 범위는 0(일요일)에서 6(토요일) 사이의 정수 값이다.
 * @returns {nNumber} $Date() 객체가 저장하고 있는 시각의 요일(0~6)을 반환한다.
 * @see $Date#Date
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getDay">Date.getDay()</a> - MDN
 * @example
var oDate = new $Date(Date.now());
oDate.date(); // 9, 9일
oDate.day(); // 1, 월요일
oDate.date(10);
oDate.day(); // 2, 화요일
   
 */
jindo.$Date.prototype.day = function() {
	return this._date.getDay();
};

/**
 
 * @description hours() 메서드는 $Date() 객체가 저장하고 있는 시각의 시간(hour)을 가져오거나 지정한 값으로 설정한다. 파라미터를 입력하면 $Date() 객체에 지정한 날짜를 설정하고 파라미터를 생략하면 $Date() 객체가 저장하고 있는 시간을 반환한다. 이때 사용되는 시간의 범위는 0에서 23 사이의 정수 값이다.
 * @param {Number} [nHour]  $Date() 객체에 설정할 시간(hour).
 * @returns {Variant} 파라미터를 입력했을 경우 시간을 새로 설정한 $Date() 객체를 반환하고 파라미터를 지정하지 않았다면 $Date() 객체가 저장하고 있는 시각의 시간(Number)을 반환한다.
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getHours">Date.getHours()</a> - MDN
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setHours">Date.setHours()</a> - MDN
 * @example
var oDate = new $Date(Date.now());
oDate.hours(); // 11, 11시
oDate.hours(19);
oDate.hours(); // 19, 19시
  
 */
jindo.$Date.prototype.hours = function(nHour) {
	if (typeof nHour == "number") {
		this._date.setHours(nHour);
		return this;
	}

	return this._date.getHours();
};

/**
 
 * @description minutes() 메서드는 $Date() 객체가 저장하고 있는 시각의 분(minute)을 가져오거나 지정한 값으로 설정한다. 파라미터를 입력하면 $Date() 객체에 지정한 분을 설정하고 파라미터를 생략하면 $Date() 객체가 저장하고 있는 시간을 반환한다. 이때 사용되는 분의 범위는 0에서 59 사이의 정수 값이다.
 * @param {Number} [nMin]  $Date() 객체에 설정할 분(minute).
 * @returns {Variant} 파라미터를 입력했을 경우 분을 새로 설정한 $Date() 객체를 반환하고 파라미터를 지정하지 않았다면 $Date() 객체가 저장하고 있는 시각의 시간(Number)을 반환한다.
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getMinutes">Date.getMinutes()</a> - MDN
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setMinutes">Date.setMinutes()</a> - MDN
 * @example
var oDate = new $Date(Date.now());
oDate.minutes(); // 53, 53분
oDate.minutes(0);
oDate.minutes(); // 0, 0분
  
 */
jindo.$Date.prototype.minutes = function(nMin) {
	if (typeof nMin == "number") {
		this._date.setMinutes(nMin);
		return this;
	}

	return this._date.getMinutes();
};

/**
 
 * @description seconds() 메서드는 $Date() 객체가 저장하고 있는 시각의 초(second)를 가져오거나 지정한 값으로 설정한다. 파라미터를 입력하면 $Date() 객체에 지정한 초를 설정하고 파라미터를 생략하면 $Date() 객체가 저장하고 있는 시간을 반환한다. 이때 사용되는 초의 범위는 0에서 59 사이의 정수 값이다.
 * @param {Number} [nSec]  $Date() 객체에 설정할 초(second).
 * @returns {Variant} 파라미터를 입력했을 경우 초를 새로 설정한 $Date() 객체를 반환하고 파라미터를 지정하지 않았다면 $Date() 객체가 저장하고 있는 시각의 초(Number)를 반환한다. 
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getSeconds">Date.getSeconds()</a> - MDN
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setSeconds">Date.setSeconds()</a> - MDN
 * @example 
var oDate = new $Date(Date.now());
oDate.seconds(); // 23, 23초
oDate.seconds(0);
oDate.seconds(); // 0, 0초
  
 */
jindo.$Date.prototype.seconds = function(nSec) {
	if (typeof nSec == "number") {
		this._date.setSeconds(nSec);
		return this;
	}

	return this._date.getSeconds();
};

/**
 
 * @description isLeapYear() 메서드는 $Date() 객체가 저장하고 있는 시각의 연도가 윤년인지 검사한다. 
 * @returns {Boolean} $Date()가 저장하고 있는 시각의 연도가 윤년이면 true를 반환하고 평년이면 false를 반환한다.
 * @see <a href="http://ko.wikipedia.org/wiki/%EC%9C%A4%EB%85%84">윤년</a> - Wikipedia
 * @example
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
	var y = this._date.getFullYear();

	return !(y%4)&&!!(y%100)||!(y%400);
};
/**
 
 * @fileOverView $Window() 객체의 생성자 및 메서드를 정의한 파일
 * @name window.js
 * @author gony
  
 */

/**
 
 * @class $Window() 객체는 브라우저가 제공하는 window 객체를 래핑하고, 이를 다루기 위한 여러가지 메서드를 제공한다.
 * @Constructor
 * @description $Window() 객체를 생성하고 생성한다.
 * @param {Object} oWindow $Window() 객체로 래핑할 window 객체.
  
 */
jindo.$Window = function(el) {
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);

	this._win = el || window;
}

/**
 
 * @description $value() 메서드는 원본 window 객체를 반환한다.
 * @return {Object} window 객체.
 * @example
     $Window().$value(); // 원래의 window 객체를 반환한다.
  
 */
jindo.$Window.prototype.$value = function() {
	return this._win;
};

/**
 
 * @description resizeTo() 메서드는 창의 크기를 지정한 크기로 변경한다. 지정한 크기는 프레임을 포함한 창 전체의 크기를 의미한다. 따라서 실제로 표현하는 컨텐트 사이즈는 브라우저 종류와 설정에 따라 달라질 수 있다. 브라우저에 따라 보안 문제 때문에, 창 크기가 화면의 가시 영역보다 커지지 못하도록 막는 경우도 있다. 이 경우에는 지정한 크기보다 창이 작아질 수 있다. 단위는 픽셀(px) 단위이다.
 * @param {Number} nWidth 창의 너비.
 * @param {Number} nHeight 창의 높이.
 * @return {$Window} $Window() 객체.
 * @see $Window#resizeBy
 * @example
 // 현재 창의 너비를 400, 높이를 300으로 변경한다.
 $Window.resizeTo(400, 300);
  
 */
jindo.$Window.prototype.resizeTo = function(nWidth, nHeight) {
	this._win.resizeTo(nWidth, nHeight);
	return this;
};

/**
 
 * @description resizeBy() 메서드는 창의 크기를 지정한 크기만큼 늘리거나 줄인다. 창의 크기를 늘릴 때는 양의 정수를 줄일 때는 음의 정수를 입력한다. 단위는 픽셀(px) 단위이다.
 * @param {Number} nWidth 늘이거나 줄일 창의 너비.
 * @param {Number} nHeight 늘어날 줄일 창의 높이
 * @return {$Window} $Window() 객체.
 * @see $Window#resizeTo
 * @example
 // 현재 창의 너비를 100, 높이를 50 만큼 늘린다.
 $Window().resizeBy(100, 50);
  
 */
jindo.$Window.prototype.resizeBy = function(nWidth, nHeight) {
	this._win.resizeBy(nWidth, nHeight);
	return this;
};

/**
 
 * @description moveTo() 메서드는 창을 지정한 위치로 이동시킨다. 좌표는 브라우저 프레임을 포함한 창의 왼쪽 위의 모서리를 기준으로 한다. 단위는 픽셀(px) 단위이다.
 * @param {Number} nLeft 이동할 X 좌표.
 * @param {Number} nTop 이동할 Y좌표.
 * @see $Window#moveBy
 * @return {$Window} $Window() 객체.
 * @example
 *  // 현재 창을 (15, 10) 으로 이동시킨다.
 *  $Window().moveTo(15, 10);
  
 */
jindo.$Window.prototype.moveTo = function(nLeft, nTop) {
	this._win.moveTo(nLeft, nTop);
	return this;
};

/**
 
 * @description moveBy() 메서드는 창을 지정한 위치만큼 이동시킨다. 단위는 픽셀(px) 단위이다.
 * @param {Number} nLeft 창을 좌우로 이동시킬 크기. 양의 정수를 입력하면 오른쪽으로 이동시키고 음의 정수를 입력하면 왼쪽으로 이동한다.
 * @param {Number} nTop 창을 위아래로 이동시킬 크기. 양의 정수를 입력하면 아래로 이동시키고 음의 정수를 입력하면 위로 이동시킨다.
 * @see $Window#moveTo
 * @return {$Window} $Window() 객체.
 * @example
 *  // 현재 창을 좌측으로 15px만큼, 아래로 10px만큼 이동시킨다.
 *  $Window().moveBy(15, 10);
  
 */
 jindo.$Window.prototype.moveBy = function(nLeft, nTop) {
	this._win.moveBy(nLeft, nTop);
	return this;
};

/**
 
 * @description sizeToContent() 메서드는 내부 문서의 콘텐츠 크기에 맞추어 창의 크기를 변경한다. 이때 몇 가지 제약 사항을 가진다.<br>
<ul>
	<li>문서가 완전히 로딩된 다음에 메서드를 실행해야 한다.</li>
	<li>창이 내부 문서보다 큰 경우에는 내부 문서의 크기를 구할 수 없으므로, 반드시 창 크기를 내부 문서보다 작게 만든다.</li>
	<li>반드시 body 요소의 사이즈가 있어야 한다.</li>
	<li>HTML의 DOCTYPE이 Quirks일때 MAC 운영체제 환경에는 Opera 10 버전, Windows 운영체제 환경에서는 인터넷 익스플로러 6버전 이상, Opera 10 버전, Safari 4버전에서 정상 동작하지 않는다.</li>
	<li>가능하면 부모 창에서 실행시켜야 한다. 자식 창이 모니터 화면을 벗어나 가려진 경우, 인터넷 익스플로러에서는 가려진 영역을 콘텐츠가 없는 것으로 판단하여 가려진 영역만큼 줄인다.</li>
</ul>
위와 같은 제약 사항에 걸리는 경우 파라미터로 창의 사이즈를 직접 지정할 수 있다.
 * @param {Number} [nWidth] 창의 너비.
 * @param {Number} [nHeight] 창의 높이.
 * @return {$Window} $Window() 객체.
 * @see $Document#renderingMode
 * @example
 // 새 창을 띄우고 자동으로 창 크기를 컨텐트에 맞게 변경하는 함수
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
