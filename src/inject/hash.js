/**
 {{title}}
 */
 
//-!jindo.$H start!-//
/**
 {{constructor}}
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
//-!jindo.$H end!-//

//-!jindo.$H.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$H.prototype.$value = function() {
	
	return this._table;
};
//-!jindo.$H.prototype.$value end!-//

//-!jindo.$H.prototype.$ start!-//
/**
 {{sign_}}
 */
jindo.$H.prototype.$ = function(key, value) {
	
	if (typeof value == "undefined") {
		return this._table[key];
	} 

	this._table[key] = value;
	return this;
};
//-!jindo.$H.prototype.$ end!-//

//-!jindo.$H.prototype.length start!-//
/**
 {{length}}
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
//-!jindo.$H.prototype.length end!-//

//-!jindo.$H.prototype.forEach start(jindo.$H.Break,jindo.$H.Continue)!-//
/**
 {{forEach}}
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
//-!jindo.$H.prototype.forEach end!-//

//-!jindo.$H.prototype.filter start(jindo.$H.prototype.forEach)!-//
/**
 {{filter}}
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
//-!jindo.$H.prototype.filter end!-//

//-!jindo.$H.prototype.map start(jindo.$H.prototype.forEach)!-//
/**
 {{map}}
 */

jindo.$H.prototype.map = function(callback, thisObject) {
	
	var t = this._table;
	this.forEach(function(v,k,o) {
		t[k] = callback.call(thisObject, v, k, o);
	});
	return this;
};
//-!jindo.$H.prototype.map end!-//

//-!jindo.$H.prototype.add start!-//
/**
 {{add}}
 */
jindo.$H.prototype.add = function(key, value) {
	
	//if (this.hasKey(key)) return null;
	this._table[key] = value;

	return this;
};
//-!jindo.$H.prototype.add end!-//

//-!jindo.$H.prototype.remove start!-//
/**
 {{remove}}
 */
jindo.$H.prototype.remove = function(key) {
	
	if (typeof this._table[key] == "undefined") return null;
	var val = this._table[key];
	delete this._table[key];
	
	return val;
};
//-!jindo.$H.prototype.remove end!-//

//-!jindo.$H.prototype.search start!-//
/**
 {{search}}
 */
jindo.$H.prototype.search = function(value) {
	
	var result = false;
	var t = this._table;

	for(var k in t) {
		if (t.hasOwnProperty(k)) {
			if (!t.propertyIsEnumerable(k)) continue;
			var v = t[k];
			if (v === value) {
				result = k;
				break;
			}			
		}
	}
	
	return result;
};
//-!jindo.$H.prototype.search end!-//

//-!jindo.$H.prototype.hasKey start!-//
/**
 {{hasKey}}
 */
jindo.$H.prototype.hasKey = function(key) {
	
	return (typeof this._table[key] != "undefined");
};
//-!jindo.$H.prototype.hasKey end!-//

//-!jindo.$H.prototype.hasValue start(jindo.$H.prototype.search)!-//
/**
 {{hasValue}}
 */
jindo.$H.prototype.hasValue = function(value) {
	
	return (this.search(value) !== false);
};
//-!jindo.$H.prototype.hasValue end!-//

//-!jindo.$H.prototype.sort start(jindo.$H.prototype.search)!-//
/**
 {{sort}}
 */
jindo.$H.prototype.sort = function() {
	
	var o = new Object;
	var a = [];
	for(var k in this._table) {
		if(this._table.hasOwnProperty(k))
			a[a.length] = this._table[k];
	}
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
//-!jindo.$H.prototype.sort end!-//

//-!jindo.$H.prototype.ksort start(jindo.$H.prototype.keys)!-//
/**
 {{ksort}}
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
//-!jindo.$H.prototype.ksort end!-//

//-!jindo.$H.prototype.keys start!-//
/**
 {{keys}}
 */
jindo.$H.prototype.keys = function() {
	
	var keys = new Array;
	for(var k in this._table) {
		if(this._table.hasOwnProperty(k))
			keys.push(k);
	}

	return keys;
};
//-!jindo.$H.prototype.keys end!-//

//-!jindo.$H.prototype.values start!-//
/**
 {{values}}
 */
jindo.$H.prototype.values = function() {
	
	var values = [];
	for(var k in this._table) {
		if(this._table.hasOwnProperty(k))
			values[values.length] = this._table[k];
	}

	return values;
};
//-!jindo.$H.prototype.values end!-//

//-!jindo.$H.prototype.toQueryString start!-//
/**
 {{toQueryString}}
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
//-!jindo.$H.prototype.toQueryString end!-//

//-!jindo.$H.prototype.empty start!-//
/**
 {{empty_1}}
 */
jindo.$H.prototype.empty = function() {
	
	this._table = {};
	
	return this;
};
//-!jindo.$H.prototype.empty end!-//

//-!jindo.$H.Break start!-//
/**
 {{break}}
 */
jindo.$H.Break = function() {
	
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};
//-!jindo.$H.Break end!-//

//-!jindo.$H.Continue start!-//
/**
 {{continue}}
 */
jindo.$H.Continue = function() {
	
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};
//-!jindo.$H.Continue end!-//
