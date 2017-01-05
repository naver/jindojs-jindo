//-!jindo.$Element start!-//
/**
 {{title}}
 */

/**
 {{constructor}}
 */
jindo.$Element = function(el) {
	
	var cl = arguments.callee;
	if (el && el instanceof cl) return el;
	
	if (el===null || typeof el == "undefined"){
		return null;
	}else{
		el = jindo.$(el);
		if (el === null) {
			return null;
		};
	}
	if (!(this instanceof cl)) return new cl(el);
	
	this._element = (typeof el == "string") ? jindo.$(el) : el;
	var tag = this._element.tagName;		
	// tagname
	this.tag = (typeof tag!='undefined')?tag.toLowerCase():''; 

}
/**
 {{etc}}
 **/
var _j_ag = navigator.userAgent;
var IS_IE = _j_ag.indexOf("MSIE") > -1;
var IS_FF = _j_ag.indexOf("Firefox") > -1;
var IS_OP = _j_ag.indexOf("Opera") > -1;
var IS_SF = _j_ag.indexOf("Apple") > -1;
var IS_CH = _j_ag.indexOf("Chrome") > -1;
//-!jindo.$Element end!-//





//-!jindo.$Element.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$Element.prototype.$value = function() {
	
	return this._element;
};
//-!jindo.$Element.prototype.$value end!-//

//-!jindo.$Element.prototype.visible start(jindo.$Element.prototype._getCss,jindo.$Element.prototype.show,jindo.$Element.prototype.hide)!-//
/**
 {{visible}} 
 */
jindo.$Element.prototype.visible = function(bVisible, sDisplay) {
	
	if (typeof bVisible != "undefined") {
		this[bVisible?"show":"hide"](sDisplay);
		return this;
	}

	return (this._getCss(this._element,"display") != "none");
};
//-!jindo.$Element.prototype.visible end!-//

//-!jindo.$Element.prototype.show start!-//
/**
 {{show}}
 */
jindo.$Element.prototype.show = function(sDisplay) {
	
	var s = this._element.style;
	var b = "block";
	var c = { p:b,div:b,form:b,h1:b,h2:b,h3:b,h4:b,ol:b,ul:b,fieldset:b,td:"table-cell",th:"table-cell",
			  li:"list-item",table:"table",thead:"table-header-group",tbody:"table-row-group",tfoot:"table-footer-group",
			  tr:"table-row",col:"table-column",colgroup:"table-column-group",caption:"table-caption",dl:b,dt:b,dd:b};

	try {
		if (sDisplay) {
			s.display = sDisplay;
		}else{
			var type = c[this.tag];
			s.display = type || "inline";
		}
	} catch(e) {
		/*
		 {{show_1}}
		 */
		s.display = "block";
	}

	return this;
};
//-!jindo.$Element.prototype.show end!-//

//-!jindo.$Element.prototype.hide start!-//
/**
 {{hide}}
 */
jindo.$Element.prototype.hide = function() {
	
	this._element.style.display = "none";

	return this;
};

//-!jindo.$Element.prototype.hide end!-//

//-!jindo.$Element.prototype.toggle start(jindo.$Element.prototype._getCss,jindo.$Element.prototype.show,jindo.$Element.prototype.hide)!-//
/**
 {{toggle}}
 */
jindo.$Element.prototype.toggle = function(sDisplay) {
	
	this[this._getCss(this._element,"display")=="none"?"show":"hide"](sDisplay);
	return this;
};
//-!jindo.$Element.prototype.toggle end!-//

//-!jindo.$Element.prototype.opacity start!-//
/**
 {{opacity}}
 */
jindo.$Element.prototype.opacity = function(value) {
	
	var v,e = this._element,b = (this._getCss(e,"display") != "none");	
	value = parseFloat(value);
    /*
     {{opacity_1}}
     */ 
	e.style.zoom = 1;
	if (!isNaN(value)) {
		value = Math.max(Math.min(value,1),0);

		if (typeof e.filters != "undefined") {
			value = Math.ceil(value*100);
			
			if (typeof e.filters != 'unknown' && typeof e.filters.alpha != "undefined") {
				e.filters.alpha.opacity = value;
			} else {
				e.style.filter = (e.style.filter + " alpha(opacity=" + value + ")");
			}		
		} else {
			e.style.opacity = value;
		}

		return value;
	}

	if (typeof e.filters != "undefined") {
		v = (typeof e.filters.alpha == "undefined")?(b?100:0):e.filters.alpha.opacity;
		v = v / 100;
	} else {
		v = parseFloat(e.style.opacity);
		if (isNaN(v)) v = b?1:0;
	}

	return v;
};
//-!jindo.$Element.prototype.opacity end!-//

//-!jindo.$Element.prototype.css start(jindo.$Element.prototype.opacity,jindo.$Element.prototype._getCss,jindo.$Element.prototype._setCss)!-//
/**
 {{css}}
 */
jindo.$Element.prototype.css = function(sName, sValue) {
	
	var e = this._element;
	
	var type_v = (typeof sValue);
	
	if (sName == 'opacity') return  type_v == 'undefined' ? this.opacity() : this.opacity(sValue);
	
	var type_n = (typeof sName);
	if (type_n == "string") {
		var view;

		if (type_v == "string" || type_v == "number") {
			var obj = {};
			obj[sName] = sValue;
			sName = obj;
		} else {
			var _getCss = this._getCss;
			if((IS_FF||IS_OP)&&(sName=="backgroundPositionX"||sName=="backgroundPositionY")){
				var bp = _getCss(e, "backgroundPosition").split(/\s+/);
				return (sName == "backgroundPositionX") ? bp[0] : bp[1];
			}
			if (IS_IE && sName == "backgroundPosition") {
				return _getCss(e, "backgroundPositionX") + " " + _getCss(e, "backgroundPositionY")
			}
			if ((IS_FF||IS_SF||IS_CH) && (sName=="padding"||sName=="margin")) {
				var top		= _getCss(e, sName+"Top");
				var right	= _getCss(e, sName+"Right");
				var bottom	= _getCss(e, sName+"Bottom");
				var left	= _getCss(e, sName+"Left");
				if ((top == right) && (bottom == left)) {
					return top;
				}else if (top == bottom) {
					if (right == left) {
						return top+" "+right;
					}else{
						return top+" "+right+" "+bottom+" "+left;
					}
				}else{
					return top+" "+right+" "+bottom+" "+left;
				}
			}
			return _getCss(e, sName);
		}
	}
	var h = jindo.$H;
	if (typeof h != "undefined" && sName instanceof h) {
		sName = sName._table;
	}
	if (typeof sName == "object") {
		var v, type;

		for(var k in sName) {
			if(sName.hasOwnProperty(k)){
				v    = sName[k];
				type = (typeof v);
				if (type != "string" && type != "number") continue;
				if (k == 'opacity') {
					type == 'undefined' ? this.opacity() : this.opacity(v);
					continue;
				}
				if (k == "cssFloat" && IS_IE) k = "styleFloat";
			
				if((IS_FF||IS_OP)&&( k =="backgroundPositionX" || k == "backgroundPositionY")){
					var bp = this.css("backgroundPosition").split(/\s+/);
					v = k == "backgroundPositionX" ? v+" "+bp[1] : bp[0]+" "+v;
					this._setCss(e, "backgroundPosition", v);
				}else{
					this._setCss(e, k, v);
				}
			}
		}
	}

	return this;
};
//-!jindo.$Element.prototype.css end!-//

//-!jindo.$Element.prototype._getCss.hidden start!-//
/**
 {{sign_getCss}}
 */
jindo.$Element.prototype._getCss = function(e, sName){
	var fpGetCss;
	if (e.currentStyle) {
		
		fpGetCss = function(e, sName){
			try{
				if (sName == "cssFloat") sName = "styleFloat";
				var sStyle = e.style[sName];
				if(sStyle){
					return sStyle;
				}else{
					var oCurrentStyle = e.currentStyle;
					if (oCurrentStyle) {
						return oCurrentStyle[sName];
					}
				}
				return sStyle;
			}catch(ex){
				throw new Error((e.tagName||"document") + "{{sign_getCss_1}}");
			}
		}
	} else if (window.getComputedStyle) {
		fpGetCss = function(e, sName){
			try{
				if (sName == "cssFloat") sName = "float";
				var d = e.ownerDocument || e.document || document;
				var sVal =  (e.style[sName]||d.defaultView.getComputedStyle(e,null).getPropertyValue(sName.replace(/([A-Z])/g,"-$1").toLowerCase()));
				if (sName == "textDecoration") sVal = sVal.replace(",","");
				return sVal;
			}catch(ex){
				throw new Error((e.tagName||"document") + "{{sign_getCss_1}}");
			}
		}
	
	} else {
		fpGetCss = function(e, sName){
			try{
				if (sName == "cssFloat" && IS_IE) sName = "styleFloat";
				return e.style[sName];
			}catch(ex){
				throw new Error((e.tagName||"document") + "{{sign_getCss_1}}");
			}
		}
	}
	jindo.$Element.prototype._getCss = fpGetCss;
	return fpGetCss(e, sName);
	
}
//-!jindo.$Element.prototype._getCss.hidden end!-//

//-!jindo.$Element.prototype._setCss.hidden start!-//
/**
 {{sign_setCss}}
 */
jindo.$Element.prototype._setCss = function(e, k, v){
	if (("#top#left#right#bottom#").indexOf(k+"#") > 0 && (typeof v == "number" ||(/\d$/.test(v)))) {
		e.style[k] = parseInt(v,10)+"px";
	}else{
		e.style[k] = v;
	}
}
//-!jindo.$Element.prototype._setCss.hidden end!-//

//-!jindo.$Element.prototype.attr start!-//
/**
 {{attr}}
 */
jindo.$Element.prototype.attr = function(sName, sValue) {
	
	var e = this._element;

	if (typeof sName == "string") {
		if (typeof sValue != "undefined") {
			var obj = {};
			obj[sName] = sValue;
			sName = obj;
		} else {
			if (sName == "class" || sName == "className"){ 
				return e.className;
			}else if(sName == "style"){
				return e.style.cssText;
			}else if(sName == "checked"||sName == "disabled"){
				return !!e[sName];
			}else if(sName == "value"){
				return e.value;
			}else if(sName == "href"){
				return e.getAttribute(sName,2);
			}
			return e.getAttribute(sName);
		}
	}

	if (typeof jindo.$H != "undefined" && sName instanceof jindo.$H) {
		sName = sName._table;
	}

	if (typeof sName == "object") {
		for(var k in sName) {
			if(sName.hasOwnProperty(k)){
				if (typeof(sValue) != "undefined" && sValue === null) {
					e.removeAttribute(k);
				}else{
					if (k == "class"|| k == "className") { 
						e.className = sName[k];
					}else if(k == "style"){
						e.style.cssText = sName[k];
					}else if(k == "checked"||k == "disabled"){
						e[k] = sName[k];
					}else if(k == "value"){
						e.value = sName[k];
					}else{
						e.setAttribute(k, sName[k]);	
					}
					
				} 
			}
		}
	}

	return this;
};
//-!jindo.$Element.prototype.attr end!-//

//-!jindo.$Element.prototype.width start!-//
/**
 {{width}}
 */
jindo.$Element.prototype.width = function(width) {
	
	if (typeof width == "number") {
		var e = this._element;
		e.style.width = width+"px";
		var off = e.offsetWidth;
		if (off != width && off!==0) {
			var w = (width*2 - off);
			if (w>0)
				e.style.width = w + "px";
		}
		return this;
	}

	return this._element.offsetWidth;
};
//-!jindo.$Element.prototype.width end!-//

//-!jindo.$Element.prototype.height start!-//
/**
 {{height}}
 */
jindo.$Element.prototype.height = function(height) {
	
	if (typeof height == "number") {
		var e = this._element;
		e.style.height = height+"px";
		var off = e.offsetHeight;
		if (off != height && off!==0) {
			var height = (height*2 - off);
			if(height>0)
				e.style.height = height + "px";
		}

		return this;
	}

	return this._element.offsetHeight;
};
//-!jindo.$Element.prototype.height end!-//

//-!jindo.$Element.prototype.className start!-//
/**
 {{className}}
 */
jindo.$Element.prototype.className = function(sClass) {
	
	var e = this._element;

	if (typeof sClass == "undefined") return e.className;
	e.className = sClass;

	return this;
};
//-!jindo.$Element.prototype.className end!-//

//-!jindo.$Element.prototype.hasClass start!-//
/**
 {{hasClass}}
 */
jindo.$Element.prototype.hasClass = function(sClass) {
	
	if(this._element.classList){
		jindo.$Element.prototype.hasClass = function(sClass){
			return this._element.classList.contains(sClass);
		}
	} else {
		jindo.$Element.prototype.hasClass = function(sClass){
			return (" "+this._element.className+" ").indexOf(" "+sClass+" ") > -1;
		}
	}
	return this.hasClass(sClass);
	
};
//-!jindo.$Element.prototype.hasClass end!-//

//-!jindo.$Element.prototype.addClass start!-//
/**
 {{addClass}}
 */
jindo.$Element.prototype.addClass = function(sClass) {
	
	if(this._element.classList){
		jindo.$Element.prototype.addClass = function(sClass){
			var aClass = sClass.split(/\s+/);
			var flistApi = this._element.classList;
			for(var i = aClass.length ; i-- ;){
				flistApi.add(aClass[i]);
			}
			return this;
		}
	} else {
		jindo.$Element.prototype.addClass = function(sClass){
			var e = this._element;
			var aClass = sClass.split(/\s+/);
			var eachClass;
			for (var i = aClass.length - 1; i >= 0 ; i--){
				eachClass = aClass[i];
				if ((" "+e.className+" ").indexOf(" "+eachClass+" ") == -1) { 
					e.className = (e.className+" "+eachClass).replace(/^\s+/, "");
				};
			};
			return this;
		}
	}
	return this.addClass(sClass);

};
//-!jindo.$Element.prototype.addClass end!-//

//-!jindo.$Element.prototype.removeClass start!-//
/**
 {{removeClass}} 
 */
jindo.$Element.prototype.removeClass = function(sClass) {
	
	if(this._element.classList){
		jindo.$Element.prototype.removeClass = function(sClass){
			var flistApi = this._element.classList;
			var aClass = sClass.split(" ");
			for(var i = aClass.length ; i-- ;){
				flistApi.remove(aClass[i]);
			}
			return this;
		}
	} else {
		jindo.$Element.prototype.removeClass = function(sClass){
			var e = this._element;
			var aClass = sClass.split(/\s+/);
			var eachClass;
			for (var i = aClass.length - 1; i >= 0 ; i--){
				eachClass = aClass[i];
				if ((" "+e.className+" ").indexOf(" "+eachClass+" ") > -1) {  
					 e.className = (" "+e.className.replace(/\s+$/, "").replace(/^\s+/, "")+" ").replace(" "+eachClass+" ", " ").replace(/\s+$/, "").replace(/^\s+/, "");
				};
			};
			return this;
		}
	}
	return this.removeClass(sClass);
	
};
//-!jindo.$Element.prototype.removeClass end!-//

//-!jindo.$Element.prototype.toggleClass start(jindo.$Element.prototype.addClass,jindo.$Element.prototype.removeClass,jindo.$Element.prototype.hasClass)!-//
/**
 {{toggleClass}} 
 */
jindo.$Element.prototype.toggleClass = function(sClass, sClass2) {
	
	if(this._element.classList){
		jindo.$Element.prototype.toggleClass = function(sClass, sClass2){
			if (typeof sClass2 == "undefined") {
				this._element.classList.toggle(sClass);
			} else {
				if(this.hasClass(sClass)){
					this.removeClass(sClass);
					this.addClass(sClass2);
				}else{
					this.addClass(sClass);
					this.removeClass(sClass2);
				}
			}
			return this;
		}
	} else {
		jindo.$Element.prototype.toggleClass = function(sClass, sClass2){
			sClass2 = sClass2 || "";
			if (this.hasClass(sClass)) {
				this.removeClass(sClass);
				if (sClass2) this.addClass(sClass2);
			} else {
				this.addClass(sClass);
				if (sClass2) this.removeClass(sClass2);
			}

			return this;
		}
	}
	return this.toggleClass(sClass, sClass2);
};
//-!jindo.$Element.prototype.toggleClass end!-//

//-!jindo.$Element.prototype.text start!-//
/**
 {{text}}
 */
jindo.$Element.prototype.text = function(sText) {
	
	var ele = this._element;
	var tag = this.tag;
	var prop = (typeof ele.innerText != "undefined")?"innerText":"textContent";

	if (tag == "textarea" || tag == "input") prop = "value";
	
	var type =  (typeof sText);
	if (type != "undefined"&&(type == "string" || type == "number" || type == "boolean")) {
		sText += "";
		try {
			/*
			 {{text_1}}
			 */ 
			if (prop!="value") prop = (typeof ele.textContent != "undefined")?"textContent":"innerText";
			ele[prop] = sText; 
		} catch(e) {
			return ele.innerHTML = sText.replace(/&/g, '&amp;').replace(/</g, '&lt;');
		}
		return this;
	}
	return ele[prop];
};
//-!jindo.$Element.prototype.text end!-//

//-!jindo.$Element.prototype.html start!-//
/**
 {{html}}
 */
jindo.$Element.prototype.html = function(sHTML) {
	
	var isIe = IS_IE;
	var isFF = IS_FF;
	if (isIe) {
		jindo.$Element.prototype.html = function(sHTML){
			if (typeof sHTML != "undefined" && arguments.length) {
				sHTML += ""; 
				if(jindo.cssquery) jindo.cssquery.release();
				var oEl = this._element;


				while(oEl.firstChild){
					oEl.removeChild(oEl.firstChild);
				}
				/*
				 {{html_1}}
				 */
				var sId = 'R' + new Date().getTime() + parseInt(Math.random() * 100000,10);
				var oDoc = oEl.ownerDocument || oEl.document || document;

				var oDummy;
				var sTag = oEl.tagName.toLowerCase();

				switch (sTag) {
					case 'select':
					case 'table':
						oDummy = oDoc.createElement("div");
						oDummy.innerHTML = '<' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '>';
						break;
	
					case 'tr':
					case 'thead':
					case 'tbody':
					case 'colgroup':
						oDummy = oDoc.createElement("div");
						oDummy.innerHTML = '<table><' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '></table>';
						break;
	
					default:
						oEl.innerHTML = sHTML;
						break;
				}

				if (oDummy) {

					var oFound;
					for (oFound = oDummy.firstChild; oFound; oFound = oFound.firstChild)
						if (oFound.className == sId) break;

					if (oFound) {
						var notYetSelected = true;
						for (var oChild; oChild = oEl.firstChild;) oChild.removeNode(true); // innerHTML = '';

						for (var oChild = oFound.firstChild; oChild; oChild = oFound.firstChild){
							if(sTag=='select'){
								/*
								 {{html_2}}
								 */
								var cloneNode = oChild.cloneNode(true);
								if (oChild.selected && notYetSelected) {
									notYetSelected = false;
									cloneNode.selected = true;
								}
								oEl.appendChild(cloneNode);
								oChild.removeNode(true);
							}else{
								oEl.appendChild(oChild);
							}

						}
						oDummy.removeNode && oDummy.removeNode(true);

					}

					oDummy = null;

				}

				return this;

			}
			return this._element.innerHTML;
		}
	}else if(isFF){
		jindo.$Element.prototype.html = function(sHTML){
			if (typeof sHTML != "undefined" && arguments.length) {
				sHTML += ""; 
				var oEl = this._element;
				
				if(!oEl.parentNode){
					/*
					 {{html_1}}
					 */
					var sId = 'R' + new Date().getTime() + parseInt(Math.random() * 100000,10);
					var oDoc = oEl.ownerDocument || oEl.document || document;

					var oDummy;
					var sTag = oEl.tagName.toLowerCase();

					switch (sTag) {
					case 'select':
					case 'table':
						oDummy = oDoc.createElement("div");
						oDummy.innerHTML = '<' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '>';
						break;

					case 'tr':
					case 'thead':
					case 'tbody':
					case 'colgroup':
						oDummy = oDoc.createElement("div");
						oDummy.innerHTML = '<table><' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '></table>';
						break;

					default:
						oEl.innerHTML = sHTML;
						break;
					}

					if (oDummy) {
						var oFound;
						for (oFound = oDummy.firstChild; oFound; oFound = oFound.firstChild)
							if (oFound.className == sId) break;

						if (oFound) {
							for (var oChild; oChild = oEl.firstChild;) oChild.removeNode(true); // innerHTML = '';

							for (var oChild = oFound.firstChild; oChild; oChild = oFound.firstChild){
								oEl.appendChild(oChild);
							}

							oDummy.removeNode && oDummy.removeNode(true);

						}

						oDummy = null;

					}
				}else{
					oEl.innerHTML = sHTML;
				}
				

				return this;

			}
			return this._element.innerHTML;
		}
	}else{
		jindo.$Element.prototype.html = function(sHTML){
			if (typeof sHTML != "undefined" && arguments.length) {
				sHTML += ""; 
				var oEl = this._element;
				oEl.innerHTML = sHTML;
				return this;
			}
			return this._element.innerHTML;
		}
	}
	
	return this.html(sHTML);
};
//-!jindo.$Element.prototype.html end!-//

//-!jindo.$Element.prototype.outerHTML start!-//
/**
 {{outerHTML}}
 */
jindo.$Element.prototype.outerHTML = function() {
	
	var e = this._element;
	if (typeof e.outerHTML != "undefined") return e.outerHTML;
	
	var oDoc = e.ownerDocument || e.document || document;
	var div = oDoc.createElement("div");
	var par = e.parentNode;

    /**
      {{outerHTML_1}}
     */
	if(!par) return e.innerHTML;

	par.insertBefore(div, e);
	div.style.display = "none";
	div.appendChild(e);

	var s = div.innerHTML;
	par.insertBefore(e, div);
	par.removeChild(div);

	return s;
};
//-!jindo.$Element.prototype.outerHTML end!-//

//-!jindo.$Element.prototype.toString start(jindo.$Element.prototype.outerHTML)!-//
/**
 {{toString}}
 */
jindo.$Element.prototype.toString = jindo.$Element.prototype.outerHTML;
//-!jindo.$Element.prototype.toString end!-//
