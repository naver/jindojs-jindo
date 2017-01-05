/**

 * @fileOverview A file to define the extended method of $A
 * @name array.extend.js
  
 */

/**

 * Executes a callback function by traversing all elements through an array.<br>
 * Sets the execution result of a callback function to the element of an array.
 *
 * @param {Function}	fCallback	The callback function to execute by traversing elements<br>
 * <br>
 * The callback function must have the following format: fCallback (value, index, array). <br>
 * value indicates a value of the element that an array has,<br>
 * index indicates the index of the element,<br>
 * and array indicates the array itself.<br>
 * <br>
 * Sets the return value of a callback function as an element value.
 *
 * @param {Object} [oThis]	this to use within the callback function when a callback function is a method
 * @return {$A} The $A object to apply the execution result of a callback function
 * @see $A#forEach
 * @see $A#filter
 *
 * @example
var waZoo = $A(["zebra", "giraffe", "bear", "monkey"]);

waZoo.map(function(value, index, array) {
	return (index+1) + ". " + value;
});
// Result: [1. zebra, 2. giraffe, 3. bear, 4. moneky]

 * @example
var waArray = $A([1, 2, 3]);

waArray.map(function(value, index, array) {
	return value + 10;
});

document.write(waArray.$value());
// Result: 11, 12, 13 (Increments by 10 in an internal array)
  
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

 * Executes a callback function by traversing all elements through an array. Returns a new $A object that consists of elements satisfying the callback function after execution is finished.
 * @param {Function} fCallback	The callback function to execute by traversing elements<br>
 * <br>
 * The callback function must have the following format: fCallback (value, index, array).
 * value indicates a value of the element that an array has value, index indicates the index of the element, and array indicates the original array.<br>
 * <br>
 * The callback function must return a Boolean value. If true is returned, the element will belong to an new array.
 *
 * @param {Object} oThis	this to use within the callback function when a callback function is a method
 * @return {$A}	A new $A object that consists of elements of which the return value is true
 * @see $A#forEach
 * @see $A#map
 *
 * @example
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

 * Executes a callback function by traversing all elements through an array. At the same time, checks whether all elements of an array satisfy the callback function (in other words, the callback function returns true). <br>
 * If all elements satisfy the callback function, the every method returns true.
 *
 * @param {Function} fCallback	The callback function to execute by traversing all elements<br>
 * <br>
 * The callback function must have the following format: fCallback (value, index, array).
 * value indicates a value of the element that an array has, index indicates the index of the element, and array indicates the original array.<br>
 * <br>
 * The callback function must return a Boolean value.<br>
 *
 * @param {Object} oThis	this to use within the callback function when a callback function is a method
 * @return {Boolean} Returns true if every return value of the callback function is true, false otherwise.
 * @see $A#some
 *
 * @example
function isBigEnough(value, index, array) {
		return (value >= 10);
	}

var try1 = $A([12, 5, 8, 130, 44]).every(isBigEnough);		// Result: false
var try2 = $A([12, 54, 18, 130, 44]).every(isBigEnough);	// Result: true
  
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

 * Executes a callback function by traversing all elements through an array.<br>
 * Checks whether any element satisfies the callback function.
 *
 * @param {Function} fCallback	The callback function to execute by traversing elements<br>
 * <br>
 * The callback function must have the following format: fCallback(value, index, array).
 * value indicates a value of the element that an array has, index indicates the index of the element, and array indicates the original array.<br>
 * <br>
 * The callback function must return a Boolean value.<br>
 *
 * @param {Object} oThis	this to use within the callback function when a callback function is a method
 * @return {Boolean} Returns true if any return value of the callback function is true, false otherwise.
 * @see $A#every
 *
 * @example
function twoDigitNumber(value, index, array) {
	return (value >= 10 && value < 100);
}

var try1 = $A([12, 5, 8, 130, 44]).some(twoDigitNumber);	// Result: true
var try2 = $A([1, 5, 8, 130, 4]).some(twoDigitNumber);		// Result: false
  
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

 * Creates a new $A object by excluding values such as parameters from an array.
 *
 * @param {Value, ..., ValueN} oValueN A value to exclude from an array
 * @return {$A} A new $A object in which specific values are excluded from an array
 *
 * @example
var arr = $A([12, 5, 8, 130, 44]);

var newArr1 = arr.refuse(12);

document.write(arr);		// Result: [12, 5, 8, 130, 44]
document.write(newArr1);	// Result: [5, 8, 130, 44]

var newArr2 = newArr1.refuse(8, 44, 130);

document.write(newArr1);	// Result: [5, 8, 130, 44]
document.write(newArr2);	// Result: [5]
  
 */
jindo.$A.prototype.refuse = function(oValue1/*, ...*/) {
	var a = jindo.$A(Array.prototype.slice.apply(arguments));
	return this.filter(function(v,i) { return !a.has(v) });
};

/**

 * Deletes duplicate elements from an array.
 *
 * @return {$A} The $A object in which duplicate elements are deleted
 *
 * @example
var arr = $A([10, 3, 76, 5, 4, 3]);

arr.unique(); // Result: [10, 3, 76, 5, 4]
  
 */
jindo.$A.prototype.unique = function() {
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
