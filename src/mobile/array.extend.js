//-!jindo.$A.prototype.map start(jindo.$A.Break,jindo.$A.Continue)!-//
/**
{{title}}
 */

/**
{{map}}
 */
jindo.$A.prototype.map = function(fCallback, oThis) {
	//-@@$A.map-@@//
	var oArgs = jindo._checkVarType(arguments, jindo.$A.checkVarTypeObj,"$A#map");
	if(oArgs == null){ return this; }
			
	var returnArr	= [];
	var that = this;
	function f(v,i,a) {
		try {
			returnArr.push(fCallback.apply(oThis||this, jindo._p_._toArray(arguments)));
		} catch(e) {
			if (e instanceof that.constructor.Continue){
				returnArr.push(v);
			} else{
				throw e;				
			}
		}
	}
	this.forEach(f);
	return jindo.$A(returnArr);
};
//-!jindo.$A.prototype.map end!-//

//-!jindo.$A.prototype.filter start(jindo.$A.prototype.forEach)!-//
/**
{{filter}}
 */
jindo.$A.prototype.filter = function(fCallback, oThis) {
	//-@@$A.filter-@@//
	var oArgs = jindo._checkVarType(arguments, jindo.$A.checkVarTypeObj,"$A#filter");
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
	try {
		this.forEach(f);
	} catch(e) {
		if(!(e instanceof this.constructor.Break)) throw e;
	}
	return jindo.$A(returnArr);
};

//-!jindo.$A.prototype.filter end!-//

//-!jindo.$A.prototype.every start(jindo.$A.prototype.forEach)!-//
/**
{{every}}
 */
jindo.$A.prototype.every = function(fCallback, oThis) {
	//-@@$A.every-@@//
	jindo._checkVarType(arguments, jindo.$A.checkVarTypeObj,"$A#every");
	return this._array.every(fCallback, oThis||this);
};
//-!jindo.$A.prototype.every end!-//

//-!jindo.$A.prototype.some start(jindo.$A.prototype.forEach)!-//
/**
{{some}}
 */
jindo.$A.prototype.some = function(fCallback, oThis) {
	//-@@$A.some-@@//
	jindo._checkVarType(arguments, jindo.$A.checkVarTypeObj,"$A#some");
	return this._array.some(fCallback, oThis||this);
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