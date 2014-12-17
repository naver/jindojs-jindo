//-!jindo.$A.prototype.map start(jindo.$A.Break,jindo.$A.Continue)!-//
/**
{{title}}
 */

/**
{{map}}
 */
jindo.$A.prototype.map = function(fCallback, oThis) {
	//-@@$A.map-@@//
	function mapBody(fpEach){
		return function(fCallback, oThis) {
			var oArgs = g_checkVarType(arguments, jindo.$A.checkVarTypeObj,"$A#map");
			if(oArgs == null){ return this; }
			
			var returnArr	= [];
			var that = this;
			function f(v,i,a) {
				try {
					returnArr.push(fCallback.apply(oThis||that, jindo._p_._toArray(arguments)));
				} catch(e) {
					if (e instanceof that.constructor.Continue){
						returnArr.push(v);
					} else{
						throw e;				
					}
				}
			}
			fpEach(this, f);
			return jindo.$A(returnArr);
		};
	}
	if (this._array.map) {
		jindo.$A.prototype.map = mapBody(function(scope,fp){
			scope.forEach(fp);
		});
	}else{
		jindo.$A.prototype.map = mapBody(function(scope,fp){
			var arr = scope._array;
			for(var i=0,l=scope._array.length; i < l; i++) {
				try {
					fp(arr[i], i, arr);
				} catch(e) {
					if (e instanceof scope.constructor.Break){
						break;
					}else{
						throw e;
					}
				}
			}
		});
	}
	return this.map.apply(this,jindo._p_._toArray(arguments));
};
//-!jindo.$A.prototype.map end!-//

//-!jindo.$A.prototype.filter start(jindo.$A.prototype.forEach)!-//
/**
{{filter}}
 */
jindo.$A.prototype.filter = function(fCallback, oThis) {
	//-@@$A.filter-@@//
	function filterBody(fpEach){
		return function(fCallback, oThis) {
			var oArgs = g_checkVarType(arguments, jindo.$A.checkVarTypeObj,"$A#filter");
			if(oArgs == null){ return this; }
			
			var returnArr	= [];
			var that = this;
			function f(v,i,a) {
				try {
					if(fCallback.apply(oThis||that, jindo._p_._toArray(arguments))) returnArr.push(v);
				} catch(e) {
					if (!(e instanceof that.constructor.Continue)){
						throw e;				
					}
				}
			}
			fpEach(this, f);
			return jindo.$A(returnArr);
		};
	}
	if (this._array.filter) {
		jindo.$A.prototype.filter = filterBody(function(scope,fp){
			try {
				scope.forEach(fp);
			} catch(e) {
				if(!(e instanceof scope.constructor.Break)) throw e;
			}
		});
	}else{
		jindo.$A.prototype.filter = filterBody(function(scope,fp){
			var arr = scope._array;
			for(var i=0,l=scope._array.length; i < l; i++) {
				try {
					fp(arr[i], i, arr);
				} catch(e) {
					if (e instanceof scope.constructor.Break){
						break;
					}else{
						throw e;
					}
				}
			}
		});
	}
	return this.filter.apply(this,jindo._p_._toArray(arguments));
};

//-!jindo.$A.prototype.filter end!-//

//-!jindo.$A.prototype.every start(jindo.$A.prototype.forEach)!-//
/**
{{every}}
 */
jindo.$A.prototype.every = function(fCallback, oThis) {
	//-@@$A.every-@@//
	var ___checkVarType = g_checkVarType;
	var ___checkObj = jindo.$A.checkVarTypeObj;
	if (this._array.every) {
		jindo.$A.prototype.every = function(fCallback, oThis) {
			___checkVarType(arguments, ___checkObj,"$A#every");
			return this._array.every(fCallback, oThis||this);
		};
	}else{
		jindo.$A.prototype.every = function(fCallback, oThis) {
			___checkVarType(arguments, ___checkObj,"$A#every");
			
			var result = true;
			var arr = this._array;
			
			for(var i=0,l=arr.length; i < l; i++) {
				if(fCallback.call(oThis||this,arr[i], i, arr) === false){
					result = false;
					break;
				}
			}

			return result;
		};
	}
	return this.every.apply(this,jindo._p_._toArray(arguments));
};
//-!jindo.$A.prototype.every end!-//

//-!jindo.$A.prototype.some start(jindo.$A.prototype.forEach)!-//
/**
{{some}}
 */
jindo.$A.prototype.some = function(fCallback, oThis) {
	//-@@$A.some-@@//
	var ___checkVarType = g_checkVarType;
	var ___checkObj = jindo.$A.checkVarTypeObj;
	if (this._array.some) {
		jindo.$A.prototype.some = function(fCallback, oThis) {
			___checkVarType(arguments, ___checkObj,"$A#some");
			return this._array.some(fCallback, oThis||this);
		};
	}else{
		jindo.$A.prototype.some = function(fCallback, oThis) {
			___checkVarType(arguments, ___checkObj,"$A#some");
			var result = false;
			var arr = this._array;
			
			for(var i=0,l=arr.length; i < l; i++) {
				if(fCallback.call(oThis||this,arr[i], i, arr) === true){
					result = true;
					break;
				}
			}
			
			return result;
		};
	}
	return this.some.apply(this,jindo._p_._toArray(arguments));
};
//-!jindo.$A.prototype.some end!-//

//-!jindo.$A.prototype.refuse start(jindo.$A.prototype.filter, jindo.$A.prototype.indexOf)!-//
/**
{{refuse}}
 */
jindo.$A.prototype.refuse = function(oValue1/*, ...*/) {
	//-@@$A.refuse-@@//
	var a = jindo.$A(jindo._p_._toArray(arguments));
	return this.filter(function(v,i) { return !(a.indexOf(v) > -1); });
};
//-!jindo.$A.prototype.refuse end!-//
//-!jindo.$A.prototype.unique start!-//
/**
{{unique}}
 */
jindo.$A.prototype.unique = function() {
	//-@@$A.unique-@@//
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