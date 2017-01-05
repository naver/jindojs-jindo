//-!jindo.$A start!-//
/**
{{title}}
 */

/**
{{constructor}}
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
//-!jindo.$A end!-//

//-!jindo.$A.prototype.toString start!-//
/**
{{toString}}
 */
jindo.$A.prototype.toString = function() {
	
	return this._array.toString();
};
//-!jindo.$A.prototype.toString end!-//

//-!jindo.$A.prototype.get start!-//
/**
{{get}}
 */
jindo.$A.prototype.get = function(nIndex){
	
	return this._array[nIndex];
};
//-!jindo.$A.prototype.get end!-//

//-!jindo.$A.prototype.length start!-//
/**
{{length}}
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
//-!jindo.$A.prototype.length end!-//

//-!jindo.$A.prototype.has start(jindo.$A.prototype.indexOf)!-//
/**
{{has}}
 */
jindo.$A.prototype.has = function(oValue) {
	
	return (this.indexOf(oValue) > -1);
};
//-!jindo.$A.prototype.has end!-//

//-!jindo.$A.prototype.indexOf start!-//
/**
{{indexOf}}
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
//-!jindo.$A.prototype.indexOf end!-//

//-!jindo.$A.prototype.$value start!-//
/**
{{sign_value}}
 */
jindo.$A.prototype.$value = function() {
	
	return this._array;
};
//-!jindo.$A.prototype.$value end!-//

//-!jindo.$A.prototype.push start!-//
/**
{{push}}
 */
jindo.$A.prototype.push = function(oValue1/*, ...*/) {
	
	return this._array.push.apply(this._array, Array.prototype.slice.apply(arguments));
};
//-!jindo.$A.prototype.push end!-//

//-!jindo.$A.prototype.pop start!-//
/**
{{pop}}
 */
jindo.$A.prototype.pop = function() {
	
	return this._array.pop();
};
//-!jindo.$A.prototype.pop end!-//

//-!jindo.$A.prototype.shift start!-//
/**
{{shift}}
 */
jindo.$A.prototype.shift = function() {
	
	return this._array.shift();
};
//-!jindo.$A.prototype.shift end!-//

//-!jindo.$A.prototype.unshift start!-//
/**
{{unshift}}
 */
jindo.$A.prototype.unshift = function(oValue1/*, ...*/) {
	
	this._array.unshift.apply(this._array, Array.prototype.slice.apply(arguments));

	return this._array.length;
};
//-!jindo.$A.prototype.unshift end!-//

//-!jindo.$A.prototype.forEach start(jindo.$A.Break,jindo.$A.Continue)!-//
/**
{{forEach}}
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
//-!jindo.$A.prototype.forEach end!-//

//-!jindo.$A.prototype.slice start!-//
/**
{{slice}}
 */
jindo.$A.prototype.slice = function(nStart, nEnd) {
	
	var a = this._array.slice.call(this._array, nStart, nEnd);
	return jindo.$A(a);
};
//-!jindo.$A.prototype.slice end!-//

//-!jindo.$A.prototype.splice start!-//
/**
{{splice}}
 */
jindo.$A.prototype.splice = function(nIndex, nHowMany/*, oValue1,...*/) {
	
	var a = this._array.splice.apply(this._array, Array.prototype.slice.apply(arguments));

	return jindo.$A(a);
};
//-!jindo.$A.prototype.splice end!-//

//-!jindo.$A.prototype.shuffle start!-//
/**
{{shuffle}}
 */
jindo.$A.prototype.shuffle = function() {
	
	this._array.sort(function(a,b){ return Math.random()>Math.random()?1:-1 });
	
	return this;
};
//-!jindo.$A.prototype.shuffle end!-//

//-!jindo.$A.prototype.reverse start!-//
/**
{{reverse}}
 */
jindo.$A.prototype.reverse = function() {
	
	this._array.reverse();

	return this;
};
//-!jindo.$A.prototype.reverse end!-//

//-!jindo.$A.prototype.empty start!-//
/**
{{empty_1}}
 */
jindo.$A.prototype.empty = function() {
	
	this._array.length = 0;
	return this;
};
//-!jindo.$A.prototype.empty end!-//

//-!jindo.$A.Break start!-//
/**
{{break}}
 */
jindo.$A.Break = function() {
	
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};
//-!jindo.$A.Break end!-//

//-!jindo.$A.Continue start!-//
/**
{{continue}}
 */
jindo.$A.Continue = function() {
	
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};
//-!jindo.$A.Continue end!-//