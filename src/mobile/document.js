/**
 {{title}}
 */
//-!jindo.$Document start(jindo.cssquery)!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$Document = function (el) {
	//-@@$Document-@@//
	var cl = arguments.callee;
	if (el instanceof cl) return el;

	if (!(this instanceof cl)){
		try {
			jindo.$Jindo._maxWarn(arguments.length, 1,"$Document");
			return new cl(el||document);
		} catch(e) {
			if (e instanceof TypeError) { return null; }
			throw e;
		}
	}	
	
	var oArgs = g_checkVarType(arguments, {
		'4doc'  : [ 'oDocument:Document+']
	},"$Document");
	if(oArgs==null){this._doc = document;}
	else{this._doc = el;}
	
	this._docKey = 'documentElement';	
};
(function(){
	var qu = jindo.cssquery;
	var type = {
		"query" : qu.getSingle,
		"queryAll" : qu,
		"xpathAll" : qu.xpath
	};
	for(var i in type){
		jindo.$Document.prototype[i] = (function(sMethod,fp){
			return function(sQuery){
				var oArgs = g_checkVarType(arguments, {
					'4str'  : [ 'sQuery:String+']
				},"$Document#"+sMethod);
				return fp(sQuery,this._doc);
			};
		})(i, type[i]);
	}
	
})();
//-!jindo.$Document end!-//

//-!jindo.$Document.prototype.$value start!-//
/**
 {{value}}
 */
jindo.$Document.prototype.$value = function() {
	//-@@$Document.$value-@@//
	return this._doc;
};
//-!jindo.$Document.prototype.$value end!-//

//-!jindo.$Document.prototype.scrollSize start!-//
/**
 {{scrollSize}} 
 */
jindo.$Document.prototype.scrollSize = function() {
	//-@@$Document.scrollSize-@@//
	/*
	  {{scrollSize_1}}
	 */
	var oDoc = this._doc[jindo._p_._JINDO_IS_WK?'body':this._docKey];
	
	return {
		width : Math.max(oDoc.scrollWidth, oDoc.clientWidth),
		height : Math.max(oDoc.scrollHeight, oDoc.clientHeight)
	};

};
//-!jindo.$Document.prototype.scrollSize end!-//

//-!jindo.$Document.prototype.scrollPosition start!-//
/**
 {{scrollPosition}}
 */
jindo.$Document.prototype.scrollPosition = function() {
	//-@@$Document.scrollPosition-@@//
	/*
	 {{scrollPosition_1}}
	 */
	var oDoc = this._doc[jindo._p_._JINDO_IS_WK?'body':this._docKey];
	return {
		left : oDoc.scrollLeft||window.pageXOffset||window.scrollX||0,
		top : oDoc.scrollTop||window.pageYOffset||window.scrollY||0
	};

};
//-!jindo.$Document.prototype.scrollPosition end!-//

//-!jindo.$Document.prototype.clientSize start!-//
/**
 {{clientSize}} 
 */
jindo.$Document.prototype.clientSize = function() {
	//-@@$Document.clientSize-@@//
	var oDoc = this._doc[this._docKey];

    return {
        width : oDoc.clientWidth,
        height : oDoc.clientHeight
    };
};
//-!jindo.$Document.prototype.clientSize end!-//

//-!jindo.$Document.prototype.queryAll start(jindo.cssquery)!-//
/**
 {{queryAll}}
 */
//-!jindo.$Document.prototype.queryAll end!-//

//-!jindo.$Document.prototype.query start(jindo.cssquery)!-//
/**
 {{query}}
 */
//-!jindo.$Document.prototype.query end!-//

//-!jindo.$Document.prototype.xpathAll start(jindo.cssquery)!-//
/**
 {{xpathAll}}
 */
//-!jindo.$Document.prototype.xpathAll end!-//
