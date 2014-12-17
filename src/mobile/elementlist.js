/**
 {{title}}
 */
//-!jindo.$ElementList start(jindo.$Element)!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$ElementList = function (els) {
	//-@@$ElementList-@@//
	var cl = arguments.callee;
	if (els instanceof cl) return els;
	
	if (!(this instanceof cl)){
		try {
			return new cl(els);
		} catch(e) {
			if (e instanceof TypeError) { return null; }
			throw e;
		}
	}	
	
	var oArgs = g_checkVarType(arguments, {
		'4arr' : [ 'aEle:Array+' ],
		'4str' : [ 'sCssQuery:String+' ],
		'4nul' : [ 'oEle:Null' ],
		'4und' : [ 'oEle:Undefined' ]
	},"$ElementList");
	
	switch(oArgs+""){
		case "4arr":
			els = oArgs.aEle;
			break;
		case "4str":
			els = jindo.cssquery(oArgs.sCssQuery);
			break;
		case "4nul":
		case "4und":
			els = [];
	}

	this._elements = [];
	for(var i = 0, l = els.length; i < l ;i++){
		this._elements.push(jindo.$Element(els[i]));
	}
};
//-@@$ElementList.meta_program_config-@@//
(function(proto){
	var setters = ['show','hide','toggle','addClass','removeClass','toggleClass','fireEvent','leave',
				   'empty','className','width','height','text','html','css','attr'];
				   
	for (var i = 0, l = setters.length; i < l; i++) {
		var name = setters[i];
		if(jindo.$Element.prototype[name]){
			proto[setters[i]] = (function(name) {
				return function(){
					//-@@$ElementList.meta_program-@@//
					try{
						var args = [];
						for(var j = 0,m = arguments.length ; j < m ; j++){
							args.push(arguments[j]);
						}
						for(var k = 0,n = this._elements.length ; k < n ; k++){
							this._elements[k][name].apply(this._elements[k], args);
						}
						return this;
					}catch(e){
						throw TypeError(e.message.replace(/\$Element/g,"$Elementlist#"+name).replace(/Element\.html/g,"Elementlist.html#"+name));
					}
				};
	
			})(setters[i]);	
		} 
		
	}
	

	var setters2 = ['appear','disappear'];
	for (var i = 0, l = setters2.length; i < l; i++) {
		if (jindo.$Element.prototype[name]) {
			proto[setters2[i]] = (function(name){
				return function(duration, callback) {
					//-@@$ElementList.meta_program-@@//
					try{
						var self = this;
						for (var j = 0, m = this._elements.length; j < m; j++) {
							if(j == m-1) {
								this._elements[j][name](duration, function(){ callback&&callback(self); });
							} else {
								this._elements[j][name](duration);
							}
						}
						return this;
					}catch(e){
						throw TypeError(e.message.replace(/\$Element/g,"$Elementlist#"+name).replace(/Element\.html/g,"Elementlist.html#"+name));
					}
				};
			})(setters2[i]);
		}
	}	
	
})(jindo.$ElementList.prototype);
//-!jindo.$ElementList end!-//

//-!jindo.$ElementList.prototype.get start!-//
/**
 {{get}}
*/
jindo.$ElementList.prototype.get = function(idx) {
	//-@@$ElementList.get-@@//
	var oArgs = g_checkVarType(arguments, {
		'4num' : [ 'nIdx:Numeric' ]
	},"$ElementList#get");
	return this._elements[idx];
};
//-!jindo.$ElementList.prototype.get end!-//

//-!jindo.$ElementList.prototype.getFirst start!-//
/**
 {{getFirst}}
*/
jindo.$ElementList.prototype.getFirst = function() {
	//-@@$ElementList.getFirst-@@//
	return this._elements[0];
};
//-!jindo.$ElementList.prototype.getFirst end!-//

//-!jindo.$ElementList.prototype.getLast start!-//
/**
 {{getLast}}
*/
jindo.$ElementList.prototype.getLast = function() {
	//-@@$ElementList.getLast-@@//
	return this._elements[Math.max(this._elements.length-1,0)];
};
//-!jindo.$ElementList.prototype.getLast end!-//

//-!jindo.$ElementList.prototype.length start(jindo.$A.prototype.length)!-//
/**
 {{length}}
*/
/**
 {{length2}}
*/
jindo.$ElementList.prototype.length = function(nLen, oValue) {
	//-@@$ElementList.length-@@//
	var oArgs = g_checkVarType(arguments, {
		'4voi' : [],
		'4num' : [ jindo.$Jindo._F("nLen:Numeric")],
		'4var' : [ "nLen:Numeric", "oValue:Variant"]
	},"$ElementList#length");
	
	var waEle = jindo.$A(this._elements);
	try{
		return waEle.length.apply(waEle, jindo._p_._toArray(arguments));
	}catch(e){
		throw TypeError(e.message.replace(/\$A/g,"$Elementlist#length").replace(/A\.html/g,"Elementlist.html#length"));
	}
};
//-!jindo.$ElementList.prototype.length end!-//

//-!jindo.$ElementList.prototype.$value start!-//
/**
 {{sign_value}}
*/
jindo.$ElementList.prototype.$value = function() {
	//-@@$ElementList.$value-@@//
	return this._elements;
};
//-!jindo.$ElementList.prototype.$value end!-//

//-!jindo.$ElementList.prototype.show start(jindo.$Element.prototype.show)!-//
/**
 {{show}}
*/
/**
 {{show_1}}
*/
//-!jindo.$ElementList.prototype.show end!-//
//-!jindo.$ElementList.prototype.hide start(jindo.$Element.prototype.hide)!-//
/**
 {{hide}}
*/
//-!jindo.$ElementList.prototype.hide end!-//
//-!jindo.$ElementList.prototype.toggle start(jindo.$Element.prototype.toggle)!-//
/**
 {{toggle}}
*/
//-!jindo.$ElementList.prototype.toggle end!-//
//-!jindo.$ElementList.prototype.addClass start(jindo.$Element.prototype.addClass)!-//
/**
 {{addClass}}
*/
//-!jindo.$ElementList.prototype.addClass end!-//
//-!jindo.$ElementList.prototype.removeClass start(jindo.$Element.prototype.removeClass)!-//
/**
 {{removeClass}}
*/
//-!jindo.$ElementList.prototype.removeClass end!-//
//-!jindo.$ElementList.prototype.toggleClass start(jindo.$Element.prototype.toggleClass)!-//
/**
 {{toggleClass}}
*/
//-!jindo.$ElementList.prototype.toggleClass end!-//
//-!jindo.$ElementList.prototype.fireEvent start(jindo.$Element.prototype.fireEvent)!-//
/**
 {{fireEvent}}
*/
//-!jindo.$ElementList.prototype.fireEvent end!-//
//-!jindo.$ElementList.prototype.leave start(jindo.$Element.prototype.leave)!-//
/**
 {{leave}}
*/
//-!jindo.$ElementList.prototype.leave end!-//
//-!jindo.$ElementList.prototype.empty start(jindo.$Element.prototype.empty)!-//
/**
 {{empty_1}}
*/
//-!jindo.$ElementList.prototype.empty end!-//
//-!jindo.$ElementList.prototype.appear start(jindo.$Element.prototype.appear)!-//
/**
 {{appear}}
*/
//-!jindo.$ElementList.prototype.appear end!-//
//-!jindo.$ElementList.prototype.disappear start(jindo.$Element.prototype.disappear)!-//
/**
 {{disappear}}
*/
/**
 {{disappear_1}}
*/
//-!jindo.$ElementList.prototype.disappear end!-//

//-!jindo.$ElementList.prototype.className start(jindo.$Element.prototype.className)!-//
/**
 {{className}}
*/
//-!jindo.$ElementList.prototype.className end!-//
//-!jindo.$ElementList.prototype.width start(jindo.$Element.prototype.width)!-//
/**
 {{width}}
*/
//-!jindo.$ElementList.prototype.width end!-//
//-!jindo.$ElementList.prototype.height start(jindo.$Element.prototype.height)!-//
/**
 {{height}}
*/
//-!jindo.$ElementList.prototype.height end!-//
//-!jindo.$ElementList.prototype.text start(jindo.$Element.prototype.text)!-//
/**
 {{text}}
*/
//-!jindo.$ElementList.prototype.text end!-//
//-!jindo.$ElementList.prototype.html start(jindo.$Element.prototype.html)!-//
/**
 {{html}}
*/
/**
 {{html_1}}
*/
/**
 {{html_2}}
*/
//-!jindo.$ElementList.prototype.html end!-//
//-!jindo.$ElementList.prototype.css start(jindo.$Element.prototype.css)!-//
/**
 {{css}}
*/
//-!jindo.$ElementList.prototype.css end!-//
//-!jindo.$ElementList.prototype.attr start(jindo.$Element.prototype.attr)!-//
/**
 {{attr}}
*/
//-!jindo.$ElementList.prototype.attr end!-//