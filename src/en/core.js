/**

 * @fileOverview	A file to define $ and $Class       
  
 */

if (typeof window != "undefined" && typeof window.nhn == "undefined") {
	window.nhn = {};
}

if (typeof window != "undefined") {
	if (typeof window.jindo == "undefined") {
		window.jindo = {};
	}
} else {
	if (!jindo) {
		jindo = {};
	}
}

/**

 * Returns the $Jindo object. The $Jindo object provides framework information and utility functions.
 * @constructor
 * @class The $Jindo object provides framework information and utility functions.
 * @description [Lite]
  
 */
jindo.$Jindo = function() {
	var cl=arguments.callee;
	var cc=cl._cached;
	
	if (cc) return cc;
	if (!(this instanceof cl)) return new cl();
	if (!cc) cl._cached = this;
	
	this.version = "@version@";
}

/** 

 * @function
 * The $ function performs two operations as follows:
 * <ul><li/>Gets HTML Elements by using IDs. If two or more parameters are specified, an array that has HTML Elements is returned.
 * <li>If a string such as "<tagName>" format is entered, an object with tagName is created.</li></ul>
 * @param {String...} sID The IDs of HTML Elements. One or more IDs can be specified (since 1.4.6, document can be specified as a last parameter).
 * @return {Element|Array} Returns an array that has HTML Elements. If no HTML Elements that corresponds to IDs exist, null is returned.
 * @description [Lite]
 * @example
// Returns an object by using ID.
<div id="div1"></div>

var el = $("div1");

// Returns multiple objects by using IDs.
<div id="div1"></div>
<div id="div2"></div>

var els = $("div1","div2"); // Returns a result such as [$("div1"),$("div2")] format.

// Creates an object by using a string such as tagName format.
var el = $("<DIV>");
var els = $("<DIV id='div1'><SPAN>hello</SPAN></DIV>");

//In Internet Explorer, document must be specified to create elements to be added to iframe (available since 1.4.6).
var els = $("<div>" , iframe.contentWindow.document);
// If code is written such like above, div tags are generated based on iframe.contentWindow.document.
  
 */
jindo.$ = function(sID/*, id1, id2*/) {
	var ret = [], arg = arguments, nArgLeng = arg.length, lastArgument = arg[nArgLeng-1],doc = document,el  = null;
	var reg = /^<([a-z]+|h[1-5])>$/i;
	var reg2 = /^<([a-z]+|h[1-5])(\s+[^>]+)?>/i;
	if (nArgLeng > 1 && typeof lastArgument != "string" && lastArgument.body) {
        /*
         
If the last argument is document
  
         */
		arg = Array.prototype.slice.apply(arg,[0,nArgLeng-1]);
		doc = lastArgument;
	}

	for(var i=0; i < nArgLeng; i++) {
		el = arg[i];
		if (typeof el == "string") {
			el = el.replace(/^\s+|\s+$/g, "");
			
			if (el.indexOf("<")>-1) {
				if (reg.test(el)) {
					el = doc.createElement(RegExp.$1);
				}else if (reg2.test(el)) {
					var p = { thead:'table', tbody:'table', tr:'tbody', td:'tr', dt:'dl', dd:'dl', li:'ul', legend:'fieldset',option:"select" };
					var tag = RegExp.$1.toLowerCase();
		 				
					var ele = jindo._createEle(p[tag],el,doc);
					for (var i=0,leng = ele.length; i < leng ; i++) {
						ret.push(ele[i]);
					};
					el = null;
					
				}
			}else {
				el = doc.getElementById(el);
			}
		}
		if (el) ret[ret.length] = el;
	}
	return ret.length>1?ret:(ret[0] || null);
}

jindo._createEle = function(sParentTag,sHTML,oDoc,bWantParent){
	var sId = 'R' + new Date().getTime() + parseInt(Math.random() * 100000,10);

	var oDummy = oDoc.createElement("div");
	switch (sParentTag) {
		case 'select':
		case 'table':
		case 'dl':
		case 'ul':
		case 'fieldset':
			oDummy.innerHTML = '<' + sParentTag + ' class="' + sId + '">' + sHTML + '</' + sParentTag + '>';
			break;
		case 'thead':
		case 'tbody':
		case 'col':
			oDummy.innerHTML = '<table><' + sParentTag + ' class="' + sId + '">' + sHTML + '</' + sParentTag + '></table>';
			break;
		case 'tr':
			oDummy.innerHTML = '<table><tbody><tr class="' + sId + '">' + sHTML + '</tr></tbody></table>';
			break;
		default:
			oDummy.innerHTML = '<div class="' + sId + '">' + sHTML + '</div>';
			break;
	}
	var oFound;
	for (oFound = oDummy.firstChild; oFound; oFound = oFound.firstChild){
		if (oFound.className==sId) break;
	}
	
	return bWantParent? oFound : oFound.childNodes;
}

/**

 * Creates a class object.
 * @extends core
 * @class The $Class class is an object that implements object oriented programming (OOP) in Jindo. The $Class.$init method defines the constructor function for class instances upon creation of classes.
 * @param {Object} oDef The object to define classes. It defines methods, attributes, and constructors.	The $staic keyword is a group of methods that can be used without having to create instances.
 * @return {$Class} The Class object.
 * @description [Lite]
 * @example
var CClass = $Class({
    prop : null,
    $init : function() {
         this.prop = $Ajax();
         ...
    },
	$static : {
		static_method : function(){ return 1;}
	}
});

var c1 = new CClass();
var c2 = new CClass();
// c1 and c2 have a $Ajax object respectively.

CClass.static_method(); -> 1
  
 */


jindo.$Class = function(oDef) {
	function typeClass() {
		var t = this;
		var a = [];
						
		var superFunc = function(m, superClass, func) {

			if(m!='constructor' && func.toString().indexOf("$super")>-1 ){		
				
				var funcArg = func.toString().replace(/function\s*\(([^\)]*)[\w\W]*/g,"$1").split(",");
				// var funcStr = func.toString().replace(/function\s*\(.*\)\s*\{/,"").replace(/this\.\$super/g,"this.$super.$super");
				var funcStr = func.toString().replace(/function[^{]*{/,"").replace(/(\w|\.?)(this\.\$super|this)/g,function(m,m2,m3){
                           if(!m2){
								return m3+".$super"
                           }
                           return m;
                });
				funcStr = funcStr.substr(0,funcStr.length-1);
				func = superClass[m] = eval("false||function("+funcArg.join(",")+"){"+funcStr+"}");
			}
		
			return function() {
				var f = this.$this[m];
				var t = this.$this;
				var r = (t[m] = func).apply(t, arguments);
				t[m] = f;
	
				return r;
			};
		}
		
		while(typeof t._$superClass != "undefined") {
			
			t.$super = new Object;
			t.$super.$this = this;
					
			for(var x in t._$superClass.prototype) {
				
				if (t._$superClass.prototype.hasOwnProperty(x)){
					if (typeof this[x] == "undefined" && x !="$init") this[x] = t._$superClass.prototype[x];
					if (x!='constructor' && x!='_$superClass' && typeof t._$superClass.prototype[x] == "function") {
						t.$super[x] = superFunc(x, t._$superClass, t._$superClass.prototype[x]);
					} else {
						
						t.$super[x] = t._$superClass.prototype[x];
					}
				}
			}			
			
			if (typeof t.$super.$init == "function") a[a.length] = t;
			t = t.$super;
		}
				
		for(var i=a.length-1; i > -1; i--) a[i].$super.$init.apply(a[i].$super, arguments);

		if (typeof this.$init == "function") this.$init.apply(this,arguments);
	}
	
	if (typeof oDef.$static != "undefined") {
		var i=0, x;
		for(x in oDef){
			if (oDef.hasOwnProperty(x)) {
				x=="$static"||i++;
			}
		} 
		for(x in oDef.$static){
			if (oDef.$static.hasOwnProperty(x)) {
				typeClass[x] = oDef.$static[x];
			}
		} 

		if (!i) return oDef.$static;
		delete oDef.$static;
	}
	
	// if (typeof oDef.$destroy == "undefined") {
	// 	oDef.$destroy = function(){
	// 		if(this.$super&&(arguments.callee==this.$super.$destroy)){this.$super.$destroy();}
	// 	}
	// } else {
	// 	oDef.$destroy = eval("false||"+oDef.$destroy.toString().replace(/\}$/,"console.log(this.$super);console.log(arguments.callee!=this.$super.$destroy);if(this.$super&&(arguments.callee==this.$destroy)){this.$super.$destroy();}}"));
	// }
	// 
	typeClass.prototype = oDef;
	typeClass.prototype.constructor = typeClass;
	typeClass.extend = jindo.$Class.extend;

	return typeClass;
 }

/**

 * Inherits a class.
 * A subclass can access its direct superclass through this.$super.method. However, it cannot access its indirect superclasses through this.$super.$super.method.
 * @name $Class#extend 
 * @type $Class
 * @function
 * @param {$Class} superClass The superclass object
 * @return {$Class} The inherited class
 * @description [Lite]
 * @example
var ClassExt = $Class(classDefinition);
ClassExt.extend(superClass);
// ClassExt inherits SuperClass. 
  
 */
jindo.$Class.extend = function(superClass) { 
	// superClass._$has_super = true;
	if (typeof superClass == "undefined" || superClass === null || !superClass.extend) {
		throw new Error("The superclass must be Class upon extension.");
	}
	
	this.prototype._$superClass = superClass;
	

	// inherit static methods of parent
	for(var x in superClass) {
		if (superClass.hasOwnProperty(x)) {
			if (x == "prototype") continue;
			this[x] = superClass[x];
		}
	}
	return this;
};

/**

 Accesses the method of the parent class. Both parent and child class share the same method. If a method is invoked with $super, the child class methods is used.
 @name $Class#$super
 @type $Class
 @example
	var Parent = $Class ({
		a: 100,
		b: 200,
		c: 300,
		sum2: function () {
			var init = this.sum();
			return init;
		},
		sum: function () {
			return this.a + this.b
		}
	});

	var Child = $Class ({
		a: 10,
		b: 20,
		sum2 : function () {
			var init = this.sum();
			return init;
		},
		sum: function () {
			return this.b;
		}
	}).extend (Parent);

	var oChild = new Child();
	var oParent = new Parent();

	oChild.sum();           // 20
	oChild.sum2();          // 20
	oChild.$super.sum();    // 30 -> Adds 10(a) and 20(b) of a child class, not adding 100(a) and 200(b) of a parent class.
	oChild.$super.sum2();   // 20 -> Invokes sum() of a child class, not invoking sum() of a parent class in the sum2 method of the parent class.
  
*/