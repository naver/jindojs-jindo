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
