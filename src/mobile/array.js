/**
{{title}}
 */
//-!jindo.$A start!-//
/**
{{desc}}
 */
/**
{{constructor}}
 */
jindo.$A = function(array) {
	//-@@$A-@@//
	var cl = arguments.callee;
	
	if (array instanceof cl) {
		return array;
	}
	if (!(this instanceof cl)){
		try {
			jindo.$Jindo._maxWarn(arguments.length, 1,"$A");
			return new cl(array);
		} catch(e) {
			if (e instanceof TypeError) { return null; }
			throw e;
		}
	}
	
	var oArgs = g_checkVarType(arguments, {
		'4voi' : [ ],
		'4arr' : ['aPram:Array+'],
		'4nul' : [ 'oNull:Null' ],
		'4und' : [ 'oUndefined:Undefined' ],
		'arrt' : [ 'aPram:ArrayStyle' ]
	},"$A");
	if(oArgs == null) array = [];
	switch(oArgs+"") {
	case 'arrt':
	case '4arr':
		array = oArgs.aPram;
		break;
	case '4nul':
	case '4und':
	case '4voi':
	    array = [];
		
	}



	this._array = [];
	for(var i=0; i < array.length; i++) {
		this._array[this._array.length] = array[i];
	}
};
jindo.$A.checkVarTypeObj ={
	'4fun' : [ 'fCallback:Function+'],
	'4thi' : [ 'fCallback:Function+', 'oThis:Variant']
};
//-!jindo.$A end!-//

//-!jindo.$A.prototype.toString start!-//
/**
{{toString}}
 */
jindo.$A.prototype.toString = function() {
	//-@@$A.toString-@@//
	return this._array.toString();
};
//-!jindo.$A.prototype.toString end!-//

//-!jindo.$A.prototype.get start!-//
/**
{{get}}
 */
jindo.$A.prototype.get = function(nIndex){
	//-@@$A.get-@@//
	 g_checkVarType(arguments, {
		'4num' : [ 'nIndex:Numeric' ]
	},"$A#get");
	return this._array[nIndex];
};
//-!jindo.$A.prototype.get end!-//

//-!jindo.$A.prototype.set start!-//
/**
{{set}}
 */
jindo.$A.prototype.set = function(nIndex,vValue){
	//-@@$A.set-@@//
	g_checkVarType(arguments, {
		'4num' : [ 'nIndex:Numeric' ,'vValue:Variant']
		
	},"$A#set");
	
	this._array[nIndex] = vValue;
	return this;
};
//-!jindo.$A.prototype.set end!-//

//-!jindo.$A.prototype.length start!-//
/**
{{length}}
 */
/**
{{length2}}
 */
jindo.$A.prototype.length = function(nLen, oValue) {
	//-@@$A.length-@@//

	var oArgs = g_checkVarType(arguments, {
		'4num' : [ jindo.$Jindo._F('nLen:Numeric')],
		'sv' : [ 'nLen:Numeric', 'vValue:Variant'],
		'4voi' : [ ]
	},"$A#length");
	
	switch(oArgs+"") {
		case '4num':
			this._array.length = oArgs.nLen;
			return this;
			
		case 'sv':
		    var l = this._array.length;
			this._array.length = oArgs.nLen;
			for(var i=l; i < nLen; i++) {
				this._array[i] = oArgs.vValue;
			}
			return this;
			
		case '4voi':
		    return this._array.length;
			
	}
};
//-!jindo.$A.prototype.length end!-//

//-!jindo.$A.prototype.has start(jindo.$A.prototype.indexOf)!-//
/**
{{has}}
 */
jindo.$A.prototype.has = function(oValue) {
	//-@@$A.has-@@//
	return (this.indexOf(oValue) > -1);
};
//-!jindo.$A.prototype.has end!-//

//-!jindo.$A.prototype.indexOf start!-//
/**
{{indexOf}}
 */
jindo.$A.prototype.indexOf = function(oValue) {
	//-@@$A.indexOf-@@//
	return this._array.indexOf(oValue);
};
//-!jindo.$A.prototype.indexOf end!-//

//-!jindo.$A.prototype.$value start!-//
/**
{{sign_value}}
 */
jindo.$A.prototype.$value = function() {
	//-@@$A.$value-@@//
	return this._array;
};
//-!jindo.$A.prototype.$value end!-//

//-!jindo.$A.prototype.push start!-//
/**
{{push}}
 */
jindo.$A.prototype.push = function(oValue1/*, ...*/) {
	//-@@$A.push-@@//
	return this._array.push.apply(this._array, jindo._p_._toArray(arguments));
};
//-!jindo.$A.prototype.push end!-//

//-!jindo.$A.prototype.pop start!-//
/**
{{pop}}
 */
jindo.$A.prototype.pop = function() {
	//-@@$A.pop-@@//
	return this._array.pop();
};
//-!jindo.$A.prototype.pop end!-//

//-!jindo.$A.prototype.shift start!-//
/**
{{shift}}
 */
jindo.$A.prototype.shift = function() {
	//-@@$A.shift-@@//
	return this._array.shift();
};
//-!jindo.$A.prototype.shift end!-//

//-!jindo.$A.prototype.unshift start!-//
/**
{{unshift}}
 */
jindo.$A.prototype.unshift = function(oValue1/*, ...*/) {
	//-@@$A.unshift-@@//
	this._array.unshift.apply(this._array, jindo._p_._toArray(arguments));

	return this._array.length;
};
//-!jindo.$A.prototype.unshift end!-//

//-!jindo.$A.prototype.forEach start(jindo.$A.Break,jindo.$A.Continue)!-//
/**
{{forEach}}
 */
jindo.$A.prototype.forEach = function(fCallback, oThis) {
	//-@@$A.forEach-@@//
	var oArgs = g_checkVarType(arguments, jindo.$A.checkVarTypeObj,"$A#forEach");
	var that = this;
	function f(v,i,a) {
		try {
			fCallback.apply(oThis||that, jindo._p_._toArray(arguments));
		} catch(e) {
			if (!(e instanceof that.constructor.Continue)) throw e;
		}
	}
	
	try {
		this._array.forEach(f);
	} catch(e) {
		if (!(e instanceof this.constructor.Break)) throw e;
	}
	return this;
};
//-!jindo.$A.prototype.forEach end!-//

//-!jindo.$A.prototype.slice start!-//
/**
{{slice}}
 */
jindo.$A.prototype.slice = function(nStart, nEnd) {
	//-@@$A.slice-@@//
	var a = this._array.slice.call(this._array, nStart, nEnd);
	return jindo.$A(a);
};
//-!jindo.$A.prototype.slice end!-//

//-!jindo.$A.prototype.splice start!-//
/**
{{splice}}
 */
jindo.$A.prototype.splice = function(nIndex, nHowMany/*, oValue1,...*/) {
	//-@@$A.splice-@@//
	var a = this._array.splice.apply(this._array, jindo._p_._toArray(arguments));

	return jindo.$A(a);
};
//-!jindo.$A.prototype.splice end!-//

//-!jindo.$A.prototype.shuffle start!-//
/**
{{shuffle}}
 */
jindo.$A.prototype.shuffle = function() {
	//-@@$A.shuffle-@@//
	this._array.sort(function(a,b){ return Math.random()>Math.random()?1:-1; });
	return this;
};
//-!jindo.$A.prototype.shuffle end!-//

//-!jindo.$A.prototype.reverse start!-//
/**
{{reverse}}
 */
jindo.$A.prototype.reverse = function() {
	//-@@$A.reverse-@@//
	this._array.reverse();

	return this;
};
//-!jindo.$A.prototype.reverse end!-//

//-!jindo.$A.prototype.empty start!-//
/**
{{empty_1}}
 */
jindo.$A.prototype.empty = function() {
	//-@@$A.empty-@@//
	this._array.length = 0;
	return this;
};
//-!jindo.$A.prototype.empty end!-//

//-!jindo.$A.prototype.concat start!-//
/**
{{concat}}
 */
jindo.$A.prototype.concat = function(vValue/*, vValue1,...*/) {
    //-@@$A.concat-@@//
    var aRes = [];

    if(!arguments.length) {
        return this;
    } else {
        aRes = this._array.concat();

        for(var i=0, vVal; vVal = arguments[i]; i++) {
            aRes = aRes.concat(vVal instanceof jindo.$A ? vVal._array : vVal);
        }

        return jindo.$A(aRes);
    }
};
//-!jindo.$A.prototype.concat end!-//

//-!jindo.$A.prototype.sort start!-//
/**
{{sort_1}}
 */
jindo.$A.prototype.sort = function(fpSort) {
    //-@@$A.sort-@@//
    var oArgs = g_checkVarType(arguments, {
        'void' : [],
        '4fp' : [ 'fpSort:Function+']
    },"$A#sort");
    
    if(fpSort){
        this._array.sort(jindo.$Fn(oArgs.fpSort,this).bind());
    }else{
        this._array.sort();
    }
    return this;
};
//-!jindo.$A.prototype.sort end!-//

//-!jindo.$A.Break start!-//
/**
{{break}}
 */
jindo.$A.Break = jindo.$Jindo.Break;
//-!jindo.$A.Break end!-//

//-!jindo.$A.Continue start!-//
/**
{{continue}}
 */
jindo.$A.Continue = jindo.$Jindo.Continue;
//-!jindo.$A.Continue end!-//