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
