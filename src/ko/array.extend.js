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
