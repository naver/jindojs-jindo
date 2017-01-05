//-!jindo.$A.prototype.map start(jindo.$A.Break,jindo.$A.Continue)!-//
/**
{{title}}
 */

/**
{{map}}
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
//-!jindo.$A.prototype.map end!-//

//-!jindo.$A.prototype.filter start(jindo.$A.prototype.forEach)!-//
/**
{{filter}}
 */
jindo.$A.prototype.filter = function(fCallback, oThis) {
	
	if (typeof this._array.filter == "function") {
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
//-!jindo.$A.prototype.filter end!-//

//-!jindo.$A.prototype.every start(jindo.$A.prototype.forEach)!-//
/**
{{every}}
 */
jindo.$A.prototype.every = function(fCallback, oThis) {
	
	if (typeof this._array.every == "function") {
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
//-!jindo.$A.prototype.every end!-//

//-!jindo.$A.prototype.some start(jindo.$A.prototype.forEach)!-//
/**
{{some}}
 */
jindo.$A.prototype.some = function(fCallback, oThis) {
	
	if (typeof this._array.some == "function") {
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
//-!jindo.$A.prototype.some end!-//

//-!jindo.$A.prototype.refuse start(jindo.$A.prototype.filter, jindo.$A.prototype.indexOf)!-//
/**
{{refuse}}
 */
jindo.$A.prototype.refuse = function(oValue1/*, ...*/) {
	
	var a = jindo.$A(Array.prototype.slice.apply(arguments));
	return this.filter(function(v,i) {return !(a.indexOf(v) > -1) });
};
//-!jindo.$A.prototype.refuse end!-//
//-!jindo.$A.prototype.unique start!-//
/**
{{unique}}
 */
jindo.$A.prototype.unique = function() {
	
	var a = this._array, b = [], l = a.length;
	var i, j;

	/*
	{{unique_1}}
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
//-!jindo.$A.prototype.unique end!-//