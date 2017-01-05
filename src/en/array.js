/**

 * @fileOverview A file to define the constructor and method of $A
 * @name array.js
  
 */

/**

 * Creates and returns the $A object.
 * @extends core
 * @class	The $A class provides various methods to handle an array by wrapping it.<br>
 * Wrapping means adding newly extended attributes to the features by wrapping JavaScript functions.
 * @param 	{Array|$A} array An array. Returns a new $A object with an empty array if omitted.
 * @constructor
 * @description [Lite]
 * @author Kim, Taegon
 *
 * @example
var zoo = ["zebra", "giraffe", "bear", "monkey"];
var waZoo = $A(zoo); // Creates and returns the $A object that wraps ["zebra", "giraffe", "bear", "monkey"].
  
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

 * The toString method converts an internal array into a string. The Array.toString in JavaScript is used.
 * @return {String} A string to convert an internal array
 * @description [Lite]
 *
 * @example
var zoo = ["zebra", "giraffe", "bear", "monkey"];
$A(zoo).toString();
// Result: zebra,giraffe,bear,monkey
  
 */
jindo.$A.prototype.toString = function() {
	return this._array.toString();
};


/**

 * Searches the element value of an array by index.
 * @param {Number} nIndex The index to search an array. The index numbers begins with 0.
 * @return {Value} The element value of an index in an array
 * @description [Lite]
 * @since Available since 1.4.2
 *
 * @example
var zoo = ["zebra", "giraffe", "bear", "monkey"];
var waZoo = $A(zoo);

// Searches element values.
waZoo.get(1); // Result: giraffe
waZoo.get(3); // Result: monkey
  
 */
jindo.$A.prototype.get = function(nIndex){
	return this._array[nIndex];
};

/**

 * Specifies or returns the size of an internal array.
 * @param 	{Number} [nLen]	The size of an arry.<br>
 * nLen If it is greater than the existing array, the value of an oValue parameter is appended at the end.<br>
 * nLen If it is less than the existing array, elements from nLen-th are removed.
 * @param 	{Value} [oValue] An initial value to use upon creation of a new element
 * @return 	{Number|$A} Returns the size of current internal value if no parameter is specified,<br>
 * and returns a $A object in which the internal value was changed if any parameter is specified.
 *
 * @example
var zoo = ["zebra", "giraffe", "bear", "monkey"];
var birds = ["parrot", "sparrow", "dove"];

// Get the size of an array.
$A(zoo).length(); // Result: 4

// Specifies the size of an array (for deleting an element).
$A(zoo).length(2);
// Result: ["zebra", "giraffe"]

// Specifies the size of an array (for adding an element)
$A(zoo).length(6, "(Empty)");
// Result: ["zebra", "giraffe", "bear", "monkey", "(Empty)", "(Empty)"]

$A(zoo).length(5, birds);
// Result: ["zebra", "giraffe", "bear", "monkey", ["parrot", "sparrow", "dove"]]
  
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

 * Searches a specific value in an array.
 * @param {Value} oValue A value to search
 * @return {Boolean} Returns true if the same element as the parameter value is found, false otherwise.
 * @see $A#indexOf
 * @description [Lite]
 *
 * @example
var arr = $A([1,2,3]);

// Searches a value.
arr.has(3); // Results: true
arr.has(4); // Results: false
  
 */
jindo.$A.prototype.has = function(oValue) {
	return (this.indexOf(oValue) > -1);
};

/**

 * Searches a specific value in an array and returns the index of the found element.
 * @param {Value} oValue A value to search
 * @return {Number} The index of the found element. The index numbers begins with 0. -1 is returned if no element is equal to a parameter.
 * @see $A#has
 * @description [Lite]
 *
 * @example
var zoo = ["zebra", "giraffe", "bear"];
var waZoo = $A(zoo);

// Returns indexes after searching values.
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

 * Returns the original array.
 * @return {Array} An Array
 * @description [Lite]
 *
 * @example
var waNum = $A([1, 2, 3]);
waNum.$value(); // Returns [1, 2, 3], the original array.  
  
 */
jindo.$A.prototype.$value = function() {
	return this._array;
};

/**

 * Adds one or more elements inside an array.
 * @param {oValue1, ..., oValueN} oValueN The number of N values to add
 * @return {Number} The size of an internal array in which one or more elements were added
 * @description [Lite]
 *
 * @example
var arr = $A([1,2,3]);

// Adds elements.
arr.push(4);	// Result: 4 is returned. The internal array is changed to [1,2,3,4].
arr.push(5,6);	// Result: 6 is returned. The internal array is changed to [1,2,3,4,5,6].
  
 */
jindo.$A.prototype.push = function(oValue1/*, ...*/) {
	return this._array.push.apply(this._array, Array.prototype.slice.apply(arguments));
};

/**

 * Deletes the last element of an internal array.
 * @return {Value} The deleted element
 * @description [Lite]
 *
 * @example
var arr = $A([1,2,3,4,5]);

arr.pop(); // Result: 5 is returned. The internal array is changed to [1,2,3,4].
  
 */
jindo.$A.prototype.pop = function() {
	return this._array.pop();
};

/**

 * Moves every element of an interanl array forward one space. The first element in the internal array is deleted.
 * @return {Value} The first element deleted
 * @see $A#pop
 * @see $A#unshift
 * @description [Lite]
 * @example
var arr  = $A(['Melon','Grape','Apple','Kiwi']);

arr.shift(); // Result: 'Melon' is returned. The internal array is changed to ["Grape", "Apple", "Kiwi"].
  
 */
jindo.$A.prototype.shift = function() {
	return this._array.shift();
};

/**

 * Adds one or more elements at the front of the internal array.
 * @param {oValue1, ..., oValueN} oValueN One or more elements to add
 * @return {Number} The size of an array after elements are added
 * @description [Lite]
 * @example
var arr = $A([4,5]);

arr.unshift('c');		// Result: 3 is returned. The internal array is changed to ["c", 4, 5].
arr.unshift('a', 'b');	// Result: 5 is returned. The internal array is changed to ["a", "b", "c", 4, 5].
  
 */
jindo.$A.prototype.unshift = function(oValue1/*, ...*/) {
	this._array.unshift.apply(this._array, Array.prototype.slice.apply(arguments));

	return this._array.length;
};

/**

 * Executes a callback function by traversing all elements through an array.
 *
 * @param {Function}	fCallback	The callback function to execute by traversing elements<br>
 * <br>
 * The callback function must have the following format: fCallback (value, index, array) <br>
 * value indicates a value of the element that an array has,<br>
 * index indicates the index of the element index,<br>
 * and array indicates the array itself.
 * @param {Object}	[oThis]	this to use within the callback function when a callback function is a method
 * @return {$A}	The $A object
 * @import core.$A[Break, Continue]
 * @see $A#map
 * @see $A#filter
 * @description [Lite]
 *
 * @example
var waZoo = $A(["zebra", "giraffe", "bear", "monkey"]);

waZoo.forEach(function(value, index, array) {
	document.writeln((index+1) + ". " + value);
});

// Result:
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
// Result: 11, 12, 13 (Increments by 10 within an internal array)
  
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

 * Extracts part of an array.
 * @param {Number} nStart The start index to extract. The index numbers begins with 0.
 * @param {Number} nEnd The index position right after the position of to-be extracted index
 * @return {$A} A new $A object to extract part of an internal array.<br>
 * If the value of nStart is less than 0 or the value of nStart is equal to or greater than nEnd, the $A object is returned with an empty array.
 * @description [Lite]
 *
 * @example
var arr = $A([12, 5, 8, 130, 44]);
var newArr = arr.slice(1,3);
// Returns the $A object that wrap [5, 8], the extracted array (no changes made to the original array).

 * @example
var arr = $A([12, 5, 8, 130, 44]);
var newArr = arr.slice(3,3);
// Returns the $A object that wraps [].
  
 */
jindo.$A.prototype.slice = function(nStart, nEnd) {
	var a = this._array.slice.call(this._array, nStart, nEnd);
	return jindo.$A(a);
};

/**

 * Deletes part of an array.
 * @param {Number} nIndex	The start index to delete. The index numbers begins with 0.
 * @param {Number} [nHowMany]	The number of elements to delete<br>
 * If this value and oValueN are omitted, the elements from the nIndex-th to the last element are deleted.<br>
 * If you specify a value in oValueN instead of specifying 0 or none, the oValueN value is added in the n-th position from nIndex.
 * @param {Value1, ...,ValueN} [oValueN] One or more values to add to the deleted array. It begins with the value from an nIndex-th position.
 * @returns {$A} A new $A object that wraps the deleted elements
 * @description [Lite]
 *
 * @example
var arr = $A(["angel", "clown", "mandarin", "surgeon"]);

var removed = arr.splice(2, 0, "drum");
// The internal array of arr is ["angel", "clown", "drum", "mandarin", "surgeon"]; drum is added to the index 2.
// The internal array of removed is []; no element deleted.

removed = arr.splice(3, 1);
// The internal array of arr is ["angel", "clown", "drum", "surgeon"]; mandarin is deleted.
// The internal array of removed has a deleted element, ["mandarin"].

removed = arr.splice(2, 1, "trumpet", "parrot");
// The internal array of arr is ["angel", "clown", "trumpet", "parrot", "surgeon"]; drum is deleted and a new element is added.
// The internal array of removed has a deleted element, ["drum"].

removed = arr.splice(3);
// The internal array of arr is ["angel", "clown", "trumpet"]; the elements from the index 3 to the last are deleted.
// The internal array of removed has deleted elements ["parrot", "surgeon"].
  
 */
jindo.$A.prototype.splice = function(nIndex, nHowMany/*, oValue1,...*/) {
	var a = this._array.splice.apply(this._array, Array.prototype.slice.apply(arguments));

	return jindo.$A(a);
};

/**

 * Randomly mixes the elements of an array.
 * @return {$A} The $A object in which the array was mixed
 * @description [Lite]
 *
 * @example
var dice = $A([1,2,3,4,5,6]);

dice.shuffle();
document.write("You get the number " + dice.get(0));
// Result: A random number from the range of 1-6 
  
 */
jindo.$A.prototype.shuffle = function() {
	this._array.sort(function(a,b){ return Math.random()>Math.random()?1:-1 });
	
	return this;
};

/**

 * Reverses the element order of an array.
 * @return {$A} The $A object in which the elements was reversed
 * @description [Lite]
 *
 * @example
var arr = $A([1, 2, 3, 4, 5]);

arr.reverse(); // Result: [5, 4, 3, 2, 1]
  
 */
jindo.$A.prototype.reverse = function() {
	this._array.reverse();

	return this;
};

/**

 * Creates an empty array by deleting all elements in an array.
 * @return {$A} The $A object in which the elemetns of an array were deleted
 * @description [Lite]
 *
 * @example
var arr = $A([1, 2, 3]);

arr.empty(); // Result: []
  
 */
jindo.$A.prototype.empty = function() {
	return this.length(0);
};

/**

 * The Break method stops the traverse loop of forEach, filter, and map methods.
 * @remark It is designed to throw an exception internally by force. Thus, if this method is executed in the try ~ catch section, it may not be executed normally.
 *
 * @description [Lite]
 * @see $A.Continue
 * @see $A#forEach
 * @see $A#filter
 * @see $A#map
 * @example
$A([1,2,3,4,5]).forEach(function(value,index,array) {
   // Stops if a value is greater than 4.
  if (value > 4) $A.Break();
   ...
});
  
 */
jindo.$A.Break = function() {
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};

/**

 * The Continue method skips to the next loop without executing the rest of commands in the transverse loop of forEach, filter, and map methods.
 * @remark It is designed to throw an exception internally by force. Thus, if this method is executed in the try ~ catch section, it may not be executed normally.
 *
 * @description [Lite]
 * @see $A.Break
 * @see $A#forEach
 * @see $A#filter
 * @see $A#map
 * @example
$A([1,2,3,4,5]).forEach(function(value,index,array) {
   // Does not process if a value is even.
  if (value%2 == 0) $A.Continue();
   ...
});
  
 */
jindo.$A.Continue = function() {
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};
