/**
 
 * @fileOverview A file to define the constructor and methods of $ElementList
 * @name elementlist.js
  
 */

/**
 
 * Creates and returns the $ElementList object.
 * @class The $ElementList class creates DOM Elements by using an array of IDs or cssquery string.
 * @param {String | Array} els The CSS selector or an id, HTMLElement, and HTMLElement array to find DOM Elements in a document
 * @constructor
 * @borrows $Element#show as this.show
 * @borrows $Element#hide as this.hide
 * @borrows $Element#toggle as this.toggle
 * @borrows $Element#addClass as this.addClass
 * @borrows $Element#removeClass as this.removeClass
 * @borrows $Element#toggleClass as this.toggleClass
 * @borrows $Element#fireEvent as this.fireEvent
 * @borrows $Element#leave as this.leave
 * @borrows $Element#empty as this.empty
 * @borrows $Element#appear as this.appear
 * @borrows $Element#disappear as this.disappear
 * @borrows $Element#className as this.className
 * @borrows $Element#width as this.width
 * @borrows $Element#height as this.height
 * @borrows $Element#text as this.text
 * @borrows $Element#html as this.html
 * @borrows $Element#css as this.css
 * @borrows $Element#attr as this.attr
 * @author Kim, Taegon
  
 */
jindo.$ElementList = function (els) {
	var cl = arguments.callee;
	if (els instanceof cl) return els;
	if (!(this instanceof cl)) return new cl(els);
	
	if (els instanceof Array) {
		els = jindo.$A(els);
	} else if(jindo.$A && els instanceof jindo.$A){
		els = jindo.$A(els.$value());
	} else if (typeof els == "string" && jindo.cssquery) {
		els = jindo.$A(jindo.cssquery(els));
	} else {
		els = jindo.$A();
	}

	this._elements = els.map(function(v,i,a){ return jindo.$Element(v) });
}

/**
 
 * Gets the element that corresponds to an index in $ElementList.
 * @param {Number} idx The element index to get. The index numbers begins with 0.
 * @return {$Element} The element that corresponds to an index
  
*/
jindo.$ElementList.prototype.get = function(idx) {
	return this._elements.$value()[idx];
};

/**
 
 * Gets a first element of $ElementList.
 * @remark The return value of the getFirst method is the same as that of $ElementList.get(0).
 * @return {$Element} The first element
  
*/
jindo.$ElementList.prototype.getFirst = function() {
	return this.get(0);
};

/**
 
 * Uses length of $A (available since 1.4.3).
 * @return 	Number The size of array
 * @param 	{Number} [nLen]	The size of array to return. If nLen is greater than the existing array, the value that initialized by oValue is appended at the end. If nLen is less than the existing array, elements from nLen-th are removed.
 * @param 	{Value} [oValue]	An initial value to use upon creation of a new element
 * @see $A#length
  
*/
jindo.$ElementList.prototype.length = function(nLen, oValue) {
	return this._elements.length(nLen, oValue);
}

/**
 
 * Gets a last elemenet of $ElementList.
 * @return {$Element} The last element
  
*/
jindo.$ElementList.prototype.getLast = function() {
	return this.get(Math.max(this._elements.length()-1,0));
};
/**
 
 * Returns an array element of its own.
 * @return {Array} An array that contains $Element
  
*/
jindo.$ElementList.prototype.$value = function() {
	return this._elements.$value();
};

(function(proto){
	var setters = ['show','hide','toggle','addClass','removeClass','toggleClass','fireEvent','leave',
				   'empty','appear','disappear','className','width','height','text','html','css','attr'];
	
	jindo.$A(setters).forEach(function(name){
		proto[name] = function() {
			var args = jindo.$A(arguments).$value();
			this._elements.forEach(function(el){
				el[name].apply(el, args);
			});
			
			return this;
		}
	});
	
	jindo.$A(['appear','disappear']).forEach(function(name){
		proto[name] = function(duration, callback) {
			var len  = this._elements.length;
			var self = this;
			this._elements.forEach(function(el,idx){
				if(idx == len-1) {
					el[name](duration, function(){callback(self)});
				} else {
					el[name](duration);
				}
			});
			
			return this;
		}
	});
})(jindo.$ElementList.prototype);