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