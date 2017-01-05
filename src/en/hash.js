/**
 
 * @fileOverview A file to define the constructor and methods of $H
 * @name hash.js
  
 */
 
/**
 
 * Returns the $H hash object.
 * @class The $H class implements hashes, enumerated arrays of keys and values, and provides a variety of methods to handle hashes.
 * @param {Object} hashObject An object to be created as a hash
 * @return {$H} A hash object
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
			this._table[k] = hashObject[k];	
		}
	}
};

/**
 
 * The $value method returns an object to be hashed.
 * @return {Object} An object to be hashed.
  
 */
jindo.$H.prototype.$value = function() {
	return this._table;
};

/**
 
 * The $ method sets a key and value or returns a value that corresponds to a key.
 * @param {String} A key
 * @param {void} [value] A value
 * @return {void|$H} A value that corresponds to a key or the $H object
 * @example
 * var hash = $H({one:"first", two:"second"});
 *
 * // Sets a value
 * hash.$("three", "third");
 *
 * // hash => {one:"first", two:"second", three:"third"}
 *
 * // Returns a value
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
 
 * The length method returns the size of an hash object.
 * @return {Number} The size of hash
  
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
 
 * The forEach method executes a callback function that has the key and value of a hash object as parameters.
 * @param {Function} callback The callback function to execute
 * @param {Object} thisObject this of a callback function
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
 
 * The filter method collects elements that satisfy the filter callback function from a hash object. The collected elements become the elements of a new $H object.
 * The callback function must return a Boolean value.
 * @param {Function} callback The filter callback function
 * @param {Object} thisObject this of a callback function
 * @return {$H} Returns a new hash object that was created with collected elements.
 * @remark Collects elements only for which the result of the filter callback function is true. See the example below for the type of a callback function.
 * @example
function callback(value, key, object) {
   // value    A hash value
   // key      A unique key or name of a hash
   // object   The JavaScript Core Object object
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
 
 * The map method executes the callback function with an element of a hash object as a parameter, and sets the return value of a function to the value of the element.
 * @param {Function} callback The callback function
 * @param {Object} thisObject this of a callback function
 * @return {$H} Returns the object in which a value was changed.
 * @remark See the example below for the type of a callback function.
 * @example
function callback(value, key, object ) {
   // value    A hash value
   // key      A unique key or name of a hash
   // object   The JavaScript Core Object object

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
 
 * Adds a value to a hash table.
 * @param {String} key A key for added value
 * @param {String} value A value to be added to a hash table
 * @return {$H} A hash object to add a value
  
 */
jindo.$H.prototype.add = function(key, value) {
	//if (this.hasKey(key)) return null;
	this._table[key] = value;

	return this;
};

/**
 
 * The remove method removes elements of a hash table.
 * @param {String} key An element value to remove
 * @return {void} Returns a removed value.
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.remove ("two");
// The hash table for h {one:"first", three:"third"}
  
 */
jindo.$H.prototype.remove = function(key) {
	if (typeof this._table[key] == "undefined") return null;
	var val = this._table[key];
	delete this._table[key];
	
	return val;
};

/**
 
 * The search method searches a value specified in a hash table as a parameter.
 * @param {String} value A value to search.
 * @returns {String | Boolean} Returns a key that corresponds to a value if a value is found, false otherwise.
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
 
 *  The hasKey method searches a key that was specified in a hash table as a parameter.
 * @param {String} key A key to search in a hash table
 * @return {Boolean} Returns whether a key exists.
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
 
 * The hasValue method searches a value that was specified in a hash table as a parameter.
 * @param {String} value A value to search in a hash table.
 * @return {Boolean} Returns whether a key exists.
  
 */
jindo.$H.prototype.hasValue = function(value) {
	return (this.search(value) !== false);
};

/**
 
 * The sort method sorts elements in an ascending order based on values.
 * @return {$H} A hash object to sort its elements
 * @see $H#ksort
 * @example
var h = $H({one:"one", two:"two", three:"third"});
h.sort ();
// {two:"two", three:"third", one:"one"}
  
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
 
 * The ksort method sorts elements in an ascending order based on keys.
 * @return {$H} A hash object to sort its elements
 * @see $H#sort
 * @example
var h = $H({one:"one", two:"two", three:"three"});
h.sort ();
// h => {one:"one", three:"three", two:"two"}
  
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
 
 * The keys method returns an array of a hash key.
 * @return {Array} An array of a hash key
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
 
 * The values method returns an array of a hash value.
 * @return {Array} An array of a hash value
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
 
 * The toQueryString method converts a hash object to a query-type string.
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
 
 * The empty method makes a hash object empty.
 * @return {$H} An empty hash object
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
 
 * The Break method stops the execution of a loop.
 * @remark Stops a loop such as forEach, filter, or map. This method forcibly throws an exception. Thus, it may not work as intended when it is invoked in the try ~ catch section.
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
 
 * The Continue method gets out of a loop in order to proceed to the next step.
 * @remark Stops a loop such as forEach, filter, or map during its execution and moves to the next step. This method forcibly throws an exception. Thus, it may not work as intended when it is invoked in the try ~ catch section.
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
