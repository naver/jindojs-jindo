/**
 
 * @fileOverview $ElementList의 생성자 및 메서드를 정의한 파일
 * @name elementlist.js
 * @author Kim, Taegon
  
 */

/**
 
 * @class $ElementList() 객체는 여러 개의 DOM 요소를 한 번에 다룰 수 있는 기능을 제공한다. $ElementList 객체는 DOM 요소를 배열 형태로 관리한다.
 * @constructor
 * @description $ElementList() 객체를 생성한다. $ElementList() 객체를 생성할 때 DOM 요소의 ID 또는 ID를 원소로 같은 배열, 혹은 CSS 선택자, $Element() 객체를 원소로 갖는 배열 등을 사용하여 $ElementList() 객체를 생성한다.
 * @param {Variant} vElements 문서에서 DOM 요소를 찾기 위한 CSS 선택자(CSS Selector) 혹은 ID(String), $Element() 객체를 원소로 같는 배열(Array)를 입력한다.
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
 * @example
 // 'foo', 'bar' 요소의 ElementList를 생성한다.
var woElList = $ElementList($('foo','bar'));

// 문서의 모든 'DIV' 요소에 대한 $ElementList를 생성한다. 
var woElList = $ElementList('DIV');

  
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
 
 * @description get() 메서드는 $ElementList() 객체의 내부 요소 중에서 지정한 인덱스에 해당하는 요소를 반환한다.
 * @param {Number} nIndex 가져올 요소의 인덱스.<br>인덱스는 0부터 시작한다.
 * @return {$Element} 지정한 인덱스의 요소.
  
*/
jindo.$ElementList.prototype.get = function(idx) {
	return this._elements.$value()[idx];
};

/**
 
 * @description getFirst() 메서드는 $ElementList() 객체의 첫 번째 요소를 반환한다. get() 메서드에 인덱스 값으로 0을 지정한 것과 동일하다.
 * @return {$Element} $ElementList() 객체의 첫 번째 요소.
 * @see $ElementList#get
 * @see $ElementList#getLast
  
*/
jindo.$ElementList.prototype.getFirst = function() {
	return this.get(0);
};

/**
 
 * @description length() 메서드는 $A() 객체의 length() 메서드를 이용하여 $ElementList() 객체의 크기를 반환하거나 조정한다.
 * @param 	{Number} [nLen] 지정할 배열의 크기. nLen이 기존 $ElementList() 객체의 배열 크기보다 크면 추가된 배열의 공간에 oValue 파라미터의 값으로 채운다. nLen이 기존 $ElementList() 객체의 배열 크기보다 작으면 nLen 번째 이후의 원소는 제거한다.
 * @param 	{Variant} [oValue] 새로운 원소를 추가할 때 사용할 초기 값.
 * @return 	{Number} 이 메서드의 파라미터를 모두 생략하면 현재 $ElementList() 객체의 배열 크기(Number)를 반환하고, 파라미터를 지정한 경우에는 내부 배열을 변경한 $ElementList() 객체를 반환한다.
 * @since 1.4.3 버전부터 사용 가능
 * @see $A#length
  
*/
jindo.$ElementList.prototype.length = function(nLen, oValue) {
	return this._elements.length(nLen, oValue);
}

/**
 
 * @description getFirst() 메서드는 $ElementList() 객체의 마지막 요소를 반환한다. get() 메서드에 인덱스 값으로 마지막 인덱스 번호를 지정한 것과 동일하다.
 * @return {$Element} $ElementList() 객체의 마지막 요소.
 * @see $ElementList#get
 * @see $ElementList#getFirst
  
*/
jindo.$ElementList.prototype.getLast = function() {
	return this.get(Math.max(this._elements.length()-1,0));
};
/**
 
 * @description $value() 메서드는 내부 배열을 반환한다.
 * @return {Array} $Element() 객체를 원소로 갖는 배열.
  
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