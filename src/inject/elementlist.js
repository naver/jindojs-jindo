//-!jindo.$ElementList start(jindo.$Element)!-//
/**
 {{title}}
 */

/**
 {{constructor}}
 */
jindo.$ElementList = function (els) {
	
	var cl = arguments.callee;
	if (els instanceof cl) return els;
	if (!(this instanceof cl)) return new cl(els);
	
	if (els instanceof Array) {
		els = els;
	} else if(jindo.$A && els instanceof jindo.$A){
		els =els._array;
	} else if (typeof els == "string" && jindo.cssquery) {
		els = jindo.cssquery(els);
	} else {
		els = [];
	}
	this._elements = [];
	for(var i = 0, l = els.length; i < l ;i++){
		this._elements.push(jindo.$Element(els[i]));
	}
}
jindo.$ElementList;
(function(proto){
	var setters = ['show','hide','toggle','addClass','removeClass','toggleClass','fireEvent','leave',
				   'empty','className','width','height','text','html','css','attr'];
				   
	for (var i = 0, l = setters.length; i < l; i++) {
		var name = setters[i];
		if(jindo.$Element.prototype[name]){
			proto[setters[i]] = (function(name) {
				return function(){
					
					var args = [];
					for(var j = 0,m = arguments.length ; j < m ; j++){
						args.push(arguments[j]);
					}
					for(var k = 0,n = this._elements.length ; k < n ; k++){
						this._elements[k][name].apply(this._elements[k], args);
					}
					return this;
				}
	
			})(setters[i]);	
		} 
		
	}
	

	var setters2 = ['appear','disappear'];
	for (var i = 0, l = setters2.length; i < l; i++) {
		if (jindo.$Element.prototype[name]) {
			proto[setters2[i]] = (function(name){
				return function(duration, callback) {
					
					var self = this;
					for (var j = 0, m = this._elements.length; j < m; j++) {
						if(j == m-1) {
							this._elements[j][name](duration, function(){callback(self)});
						} else {
							this._elements[j][name](duration);
						}
					}
					return this;
				}
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
	
	return this._elements[idx];
};
//-!jindo.$ElementList.prototype.get end!-//

//-!jindo.$ElementList.prototype.getFirst start!-//
/**
 {{getFirst}}
*/
jindo.$ElementList.prototype.getFirst = function() {
	
	return this._elements[0];
};
//-!jindo.$ElementList.prototype.getFirst end!-//

//-!jindo.$ElementList.prototype.getLast start!-//
/**
 {{getLast}}
*/
jindo.$ElementList.prototype.getLast = function() {
	
	return this._elements[Math.max(this._elements.length-1,0)];
};
//-!jindo.$ElementList.prototype.getLast end!-//

//-!jindo.$ElementList.prototype.length start(jindo.$A.prototype.length)!-//
/**
 {{length}}
*/
jindo.$ElementList.prototype.length = function(nLen, oValue) {
	
	return jindo.$A(this._elements).length(nLen, oValue);
}
//-!jindo.$ElementList.prototype.length end!-//

//-!jindo.$ElementList.prototype.$value start!-//
/**
 {{sign_value}}
*/
jindo.$ElementList.prototype.$value = function() {
	
	return this._elements;
};
//-!jindo.$ElementList.prototype.$value end!-//

//-!jindo.$ElementList.prototype.show start(jindo.$Element.prototype.show)!-//
//-!jindo.$ElementList.prototype.show end!-//
//-!jindo.$ElementList.prototype.hide start(jindo.$Element.prototype.hide)!-//
//-!jindo.$ElementList.prototype.hide end!-//
//-!jindo.$ElementList.prototype.toggle start(jindo.$Element.prototype.toggle)!-//
//-!jindo.$ElementList.prototype.toggle end!-//
//-!jindo.$ElementList.prototype.addClass start(jindo.$Element.prototype.addClass)!-//
//-!jindo.$ElementList.prototype.addClass end!-//
//-!jindo.$ElementList.prototype.removeClass start(jindo.$Element.prototype.removeClass)!-//
//-!jindo.$ElementList.prototype.removeClass end!-//
//-!jindo.$ElementList.prototype.toggleClass start(jindo.$Element.prototype.toggleClass)!-//
//-!jindo.$ElementList.prototype.toggleClass end!-//
//-!jindo.$ElementList.prototype.fireEvent start(jindo.$Element.prototype.fireEvent)!-//
//-!jindo.$ElementList.prototype.fireEvent end!-//
//-!jindo.$ElementList.prototype.leave start(jindo.$Element.prototype.leave)!-//
//-!jindo.$ElementList.prototype.leave end!-//
//-!jindo.$ElementList.prototype.empty start(jindo.$Element.prototype.empty)!-//
//-!jindo.$ElementList.prototype.empty end!-//
//-!jindo.$ElementList.prototype.className start(jindo.$Element.prototype.className)!-//
//-!jindo.$ElementList.prototype.className end!-//
//-!jindo.$ElementList.prototype.width start(jindo.$Element.prototype.width)!-//
//-!jindo.$ElementList.prototype.width end!-//
//-!jindo.$ElementList.prototype.height start(jindo.$Element.prototype.height)!-//
//-!jindo.$ElementList.prototype.height end!-//
//-!jindo.$ElementList.prototype.text start(jindo.$Element.prototype.text)!-//
//-!jindo.$ElementList.prototype.text end!-//
//-!jindo.$ElementList.prototype.html start(jindo.$Element.prototype.html)!-//
//-!jindo.$ElementList.prototype.html end!-//
//-!jindo.$ElementList.prototype.css start(jindo.$Element.prototype.css)!-//
//-!jindo.$ElementList.prototype.css end!-//
//-!jindo.$ElementList.prototype.attr start(jindo.$Element.prototype.attr)!-//
//-!jindo.$ElementList.prototype.attr end!-//
//-!jindo.$ElementList.prototype.appear start(jindo.$Element.prototype.appear)!-//
//-!jindo.$ElementList.prototype.appear end!-//
//-!jindo.$ElementList.prototype.disappear start(jindo.$Element.prototype.disappear)!-//
//-!jindo.$ElementList.prototype.disappear end!-//

