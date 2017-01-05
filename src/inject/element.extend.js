//-!jindo.$Element._getTransition.hidden start!-//
/**
 {{title}}
 */

/**
 {{sign_getTransition}}
 */
jindo.$Element._getTransition = function(){
	var hasTransition = false , sTransitionName = "";
	
	if (typeof document.body.style.trasition != "undefined") {
		hasTransition = true;
		sTransitionName = "trasition";
	}
	/*
	 {{sign_getTransition_1}}
	 */
	// else if(typeof document.body.style.MozTransition !== "undefined"){ 
	// 	hasTransition = true;
	// 	sTransitionName = "MozTransition";
	// }
	else if(typeof document.body.style.webkitTransition !== "undefined"){
		hasTransition = true;
		sTransitionName = "webkitTransition";
	}else if(typeof document.body.style.OTransition !== "undefined"){
		hasTransition = true;
		sTransitionName = "OTransition";
	}
	return (jindo.$Element._getTransition = function(){
		return {
			"hasTransition" : hasTransition,
			"name" : sTransitionName
		};
	})();
}
//-!jindo.$Element._getTransition.hidden end!-//

//-!jindo.$Element.prototype.appear start(jindo.$Element._getTransition,jindo.$Element.prototype.opacity,jindo.$Element.prototype.show)!-//
/**
 {{appear}}
 */
jindo.$Element.prototype.appear = function(duration, callback) {
	
	var oTransition = jindo.$Element._getTransition();
	if (oTransition.hasTransition) {
		
		jindo.$Element.prototype.appear = function(duration, callback) {
			duration = duration||0.3;
			callback = callback || function(){};
			var bindFunc = function(){
				callback();
				this.show();
				this.removeEventListener(oTransition.name+"End", arguments.callee , false );
			};
			var ele = this._element;
			var self = this;
			if(!this.visible()){
				ele.style.opacity = ele.style.opacity||0;
				self.show();
			}
			ele.addEventListener( oTransition.name+"End", bindFunc , false );
			ele.style[oTransition.name + 'Property'] = 'opacity';
			ele.style[oTransition.name + 'Duration'] = duration+'s';
			ele.style[oTransition.name + 'TimingFunction'] = 'linear';
			
			setTimeout(function(){
				ele.style.opacity = '1';
			},1);
			
			return this;
		}
	}else{
		jindo.$Element.prototype.appear = function(duration, callback) {
			var self = this;
			var op   = this.opacity();
			if(this._getCss("display")=="none") op = 0;
			
			if (op == 1) return this;
			try { clearTimeout(this._fade_timer); } catch(e){};

			callback = callback || function(){};

			var step = (1-op) / ((duration||0.3)*100);
			var func = function(){
				op += step;
				self.opacity(op);

				if (op >= 1) {
					callback(self);
				} else {
					self._fade_timer = setTimeout(func, 10);
				}
			};

			this.show();
			func();
			return this;
		}
	}
	return this.appear(duration, callback);
	
};
//-!jindo.$Element.prototype.appear end!-//

//-!jindo.$Element.prototype.disappear start(jindo.$Element._getTransition,jindo.$Element.prototype.opacity)!-//
/**
 {{disappear}}
 */
jindo.$Element.prototype.disappear = function(duration, callback) {
	
	var oTransition = jindo.$Element._getTransition();
	if (oTransition.hasTransition) {
		jindo.$Element.prototype.disappear = function(duration, callback) {
			duration = duration||0.3
			var self = this;
			callback = callback || function(){};
			var bindFunc = function(){
				callback();
				this.removeEventListener(oTransition.name+"End", arguments.callee , false );
				self._element.style.display = "none";
			};
			var ele = this._element;
			ele.addEventListener( oTransition.name+"End", bindFunc , false );
		
		
			ele.style[oTransition.name + 'Property'] = 'opacity';
			ele.style[oTransition.name + 'Duration'] = duration+'s';
			ele.style[oTransition.name + 'TimingFunction'] = 'linear';
			/*
			 {{disappear_1}}
			 */
			setTimeout(function(){
				ele.style.opacity = '0';
			},1);
		
			return this;
		}
	}else{
		jindo.$Element.prototype.disappear = function(duration, callback) {
			var self = this;
			var op   = this.opacity();
	
			if (op == 0) return this;
			try { clearTimeout(this._fade_timer); } catch(e){};

			callback = callback || function(){};

			var step = op / ((duration||0.3)*100);
			var func = function(){
				op -= step;
				self.opacity(op);

				if (op <= 0) {
					self._element.style.display = "none";
					self.opacity(1);
					callback(self);
				} else {
					self._fade_timer = setTimeout(func, 10);
				}
			};

			func();

			return this;
		}
	}
	return this.disappear(duration, callback);
};
//-!jindo.$Element.prototype.disappear end!-//

//-!jindo.$Element.prototype.offset start!-//
/**
 {{offset}}
 */
jindo.$Element.prototype.offset = function(nTop, nLeft) {
	
	var oEl = this._element;
	var oPhantom = null;

	// setter
	if (typeof nTop == 'number' && typeof nLeft == 'number') {
		if (isNaN(parseInt(this._getCss(oEl,'top'),10))) oEl.style.top = "0px";
		if (isNaN(parseInt(this._getCss(oEl,'left'),10))) oEl.style.left = "0px";

		var oPos = this.offset();
		var oGap = { top : nTop - oPos.top, left : nLeft - oPos.left };

		oEl.style.top = parseInt(this._getCss(oEl,'top'),10) + oGap.top + 'px';
		oEl.style.left = parseInt(this._getCss(oEl,'left'),10) + oGap.left + 'px';

		return this;

	}

	// getter
	var bSafari = /Safari/.test(navigator.userAgent);
	var bIE = /MSIE/.test(navigator.userAgent);
	var nVer = bIE?navigator.userAgent.match(/(?:MSIE) ([0-9.]+)/)[1]:0;
	
	var fpSafari = function(oEl) {

		var oPos = { left : 0, top : 0 };

		for (var oParent = oEl, oOffsetParent = oParent.offsetParent; oParent = oParent.parentNode; ) {

			if (oParent.offsetParent) {

				oPos.left -= oParent.scrollLeft;
				oPos.top -= oParent.scrollTop;

			}

			if (oParent == oOffsetParent) {

				oPos.left += oEl.offsetLeft + oParent.clientLeft;
				oPos.top += oEl.offsetTop + oParent.clientTop ;

				if (!oParent.offsetParent) {

					oPos.left += oParent.offsetLeft;
					oPos.top += oParent.offsetTop;

				}

				oOffsetParent = oParent.offsetParent;
				oEl = oParent;
			}
		}

		return oPos;

	};

	var fpOthers = function(oEl) {
		var oPos = { left : 0, top : 0 };

		var oDoc = oEl.ownerDocument || oEl.document || document;
		var oHtml = oDoc.documentElement;
		var oBody = oDoc.body;

		if (oEl.getBoundingClientRect) { // has getBoundingClientRect

			if (!oPhantom) {
				var bHasFrameBorder = (window == top); 
				if(!bHasFrameBorder){ 
					try{ 
						bHasFrameBorder = (window.frameElement && window.frameElement.frameBorder == 1); 
					}catch(e){} 
				}
				if ((bIE && nVer < 8 && window.external) && bHasFrameBorder) {
					oPhantom = { left : 2, top : 2 };
					oBase = null;

				} else {

					oPhantom = { left : 0, top : 0 };

				}

			}

			var box = oEl.getBoundingClientRect();
			if (oEl !== oHtml && oEl !== oBody) {

				oPos.left = box.left - oPhantom.left;
				oPos.top = box.top - oPhantom.top;

				oPos.left += oHtml.scrollLeft || oBody.scrollLeft;
				oPos.top += oHtml.scrollTop || oBody.scrollTop;

			}

		} else if (oDoc.getBoxObjectFor) { // has getBoxObjectFor

			var box = oDoc.getBoxObjectFor(oEl);
			var vpBox = oDoc.getBoxObjectFor(oHtml || oBody);

			oPos.left = box.screenX - vpBox.screenX;
			oPos.top = box.screenY - vpBox.screenY;

		} else {

			for (var o = oEl; o; o = o.offsetParent) {

				oPos.left += o.offsetLeft;
				oPos.top += o.offsetTop;

			}

			for (var o = oEl.parentNode; o; o = o.parentNode) {

				if (o.tagName == 'BODY') break;
				if (o.tagName == 'TR') oPos.top += 2;

				oPos.left -= o.scrollLeft;
				oPos.top -= o.scrollTop;

			}

		}

		return oPos;

	};
	
	return (bSafari ? fpSafari : fpOthers)(oEl);
};
//-!jindo.$Element.prototype.offset end!-//

//-!jindo.$Element.prototype.evalScripts start!-//
/**
 {{evalScripts}}
 */
jindo.$Element.prototype.evalScripts = function(sHTML) {
	
	var aJS = [];
    sHTML = sHTML.replace(new RegExp('<script(\\s[^>]+)*>(.*?)</'+'script>', 'gi'), function(_1, _2, sPart) { aJS.push(sPart); return ''; });
    eval(aJS.join('\n'));
    
    return this;

};
//-!jindo.$Element.prototype.evalScripts end!-//

//-!jindo.$Element._append.hidden start(jindo.$)!-//
/**
 {{sign_append}}
 */
jindo.$Element._append = function(oParent, oChild){
	
	if (typeof oChild == "string") {
		oChild = jindo.$(oChild);
	}else if(oChild instanceof jindo.$Element){
		oChild = oChild._element;
	}
	oParent._element.appendChild(oChild);
	

	return oParent;
}
//-!jindo.$Element._append.hidden end!-//

//-!jindo.$Element._prepend.hidden start(jindo.$)!-//
/**
 {{sign_prepend}}
 */
jindo.$Element._prepend = function(oParent, oChild){
	if (typeof oParent == "string") {
		oParent = jindo.$(oParent);
	}else if(oParent instanceof jindo.$Element){
		oParent = oParent._element;
	}
	var nodes = oParent.childNodes;
	if (nodes.length > 0) {
		oParent.insertBefore(oChild._element, nodes[0]);
	} else {
		oParent.appendChild(oChild._element);
	}

	return oChild;
}
//-!jindo.$Element._prepend.hidden end!-//

//-!jindo.$Element.prototype.append start(jindo.$Element._append)!-//
/**
 {{append}}
 */
jindo.$Element.prototype.append = function(oElement) {
	
	return jindo.$Element._append(this,oElement);
};
//-!jindo.$Element.prototype.append end!-//

//-!jindo.$Element.prototype.prepend start(jindo.$Element._prepend)!-//
/** 
 {{prepend}}
 */
jindo.$Element.prototype.prepend = function(oElement) {
	
	return jindo.$Element._prepend(this._element, jindo.$Element(oElement));
};
//-!jindo.$Element.prototype.prepend end!-//

//-!jindo.$Element.prototype.replace start!-//
/**
 {{replace}}
 */
jindo.$Element.prototype.replace = function(oElement) {
	
	if(jindo.cssquery) jindo.cssquery.release();
	var e = this._element;
	var oParentNode = e.parentNode;
	var o = jindo.$Element(oElement);
	if(oParentNode&&oParentNode.replaceChild){
		oParentNode.replaceChild(o._element,e);
		return o;
	}
	
	var o = o._element;

	oParentNode.insertBefore(o, e);
	oParentNode.removeChild(e);

	return o;
};
//-!jindo.$Element.prototype.replace end!-//

//-!jindo.$Element.prototype.appendTo start(jindo.$Element._append)!-//
/**
 {{appendTo}}
 */
jindo.$Element.prototype.appendTo = function(oElement) {
	
	var ele = jindo.$Element(oElement);
	jindo.$Element._append(ele, this._element);
	return ele;
};
//-!jindo.$Element.prototype.appendTo end!-//

//-!jindo.$Element.prototype.prependTo start(jindo.$Element._prepend)!-//
/**
 {{prependTo}}
 */
jindo.$Element.prototype.prependTo = function(oElement) {
	
	jindo.$Element._prepend(oElement, this);
	return jindo.$Element(oElement);
};
//-!jindo.$Element.prototype.prependTo end!-//

//-!jindo.$Element.prototype.before start!-//
/**
 {{before}}
 */
jindo.$Element.prototype.before = function(oElement) {
	
	var oRich = jindo.$Element(oElement);
	var o = oRich._element;

	this._element.parentNode.insertBefore(o, this._element);

	return oRich;
};
//-!jindo.$Element.prototype.before end!-//

//-!jindo.$Element.prototype.after start(jindo.$Element.prototype.before)!-//
/**
 {{after}}
 */
jindo.$Element.prototype.after = function(oElement) {
	
	var o = this.before(oElement);
	o.before(this);

	return o;
};
//-!jindo.$Element.prototype.after end!-//

//-!jindo.$Element.prototype.parent start!-//
/**
 {{parent}}
 */
jindo.$Element.prototype.parent = function(pFunc, limit) {
	
	var e = this._element;
	var a = [], p = null;

	if (typeof pFunc == "undefined") return jindo.$Element(e.parentNode);
	if (typeof limit == "undefined" || limit == 0) limit = -1;

	while (e.parentNode && limit-- != 0) {
		p = jindo.$Element(e.parentNode);
		if (e.parentNode == document.documentElement) break;
		if (!pFunc || (pFunc && pFunc(p))) a[a.length] = p;

		e = e.parentNode;
	}

	return a;
};
//-!jindo.$Element.prototype.parent end!-//

//-!jindo.$Element.prototype.child start!-//
/**
 {{child}}
 */
jindo.$Element.prototype.child = function(pFunc, limit) {
	
	var e = this._element;
	var a = [], c = null, f = null;

	if (typeof pFunc == "undefined"){
		var child = e.childNodes;
		var filtered = [];
		for(var  i = 0, l = child.length ; i < l ; i++){
			if(child[i].nodeType == 1) filtered.push(jindo.$Element(child[i]));
		}
		return filtered;
	}
	if (typeof limit == "undefined" || limit == 0) limit = -1;

	(f = function(el, lim){
		var ch = null, o = null;

		for(var i=0; i < el.childNodes.length; i++) {
			ch = el.childNodes[i];
			if (ch.nodeType != 1) continue;
			
			o = jindo.$Element(el.childNodes[i]);
			if (!pFunc || (pFunc && pFunc(o))) a[a.length] = o;
			if (lim != 0) f(el.childNodes[i], lim-1);
		}
	})(e, limit-1);

	return a;
};
//-!jindo.$Element.prototype.child end!-//

//-!jindo.$Element.prototype.prev start!-//
/**
 {{prev}}
 */
jindo.$Element.prototype.prev = function(pFunc) {
	
	var e = this._element;
	var a = [];
	var b = (typeof pFunc == "undefined");

	if (!e) return b?jindo.$Element(null):a;
	
	do {
		e = e.previousSibling;
		
		if (!e || e.nodeType != 1) continue;
		if (b) return jindo.$Element(e);
		if (!pFunc || pFunc(e)) a[a.length] = jindo.$Element(e);
	} while(e);

	return b?jindo.$Element(e):a;
};
//-!jindo.$Element.prototype.prev end!-//

//-!jindo.$Element.prototype.next start!-//
/**
 {{next}}
 */
jindo.$Element.prototype.next = function(pFunc) {
	
	var e = this._element;
	var a = [];
	var b = (typeof pFunc == "undefined");

	if (!e) return b?jindo.$Element(null):a;
	
	do {
		e = e.nextSibling;
		
		if (!e || e.nodeType != 1) continue;
		if (b) return jindo.$Element(e);
		if (!pFunc || pFunc(e)) a[a.length] = jindo.$Element(e);
	} while(e);

	return b?jindo.$Element(e):a;
};
//-!jindo.$Element.prototype.next end!-//

//-!jindo.$Element.prototype.first start!-//
/**
 {{first}}
 */
jindo.$Element.prototype.first = function() {
	
	var el = this._element.firstElementChild||this._element.firstChild;
	if (!el) return null;
	while(el && el.nodeType != 1) el = el.nextSibling;

	return el?jindo.$Element(el):null;
}
//-!jindo.$Element.prototype.first end!-//

//-!jindo.$Element.prototype.last start!-//
/**
 {{last}}
 */
jindo.$Element.prototype.last = function() {
	
	var el = this._element.lastElementChild||this._element.lastChild;
	if (!el) return null;
	while(el && el.nodeType != 1) el = el.previousSibling;

	return el?jindo.$Element(el):null;
}
//-!jindo.$Element.prototype.last end!-//

//-!jindo.$Element._contain.hidden start!-//
/**
 {{sign_contain}}
 */
jindo.$Element._contain = function(eParent,eChild){
	if (document.compareDocumentPosition) {
		jindo.$Element._contain = function(eParent,eChild){
			return !!(eParent.compareDocumentPosition(eChild)&16);
		}
	}else if(document.body.contains){
		jindo.$Element._contain = function(eParent,eChild){
			return (eParent !== eChild)&&(eParent.contains ? eParent.contains(eChild) : true);
		}
	}else{
		jindo.$Element._contain = function(eParent,eChild){
			var e  = eParent;
			var el = eChild;

			while(e && e.parentNode) {
				e = e.parentNode;
				if (e == el) return true;
			}
			return false;
		}
	}
	return jindo.$Element._contain(eParent,eChild);
}
//-!jindo.$Element._contain.hidden end!-//

//-!jindo.$Element.prototype.isChildOf start(jindo.$Element._contain)!-//
/**
 {{isChildOf}}
 */
jindo.$Element.prototype.isChildOf = function(element) {
	
	return jindo.$Element._contain(jindo.$Element(element)._element,this._element);
};
//-!jindo.$Element.prototype.isChildOf end!-//

//-!jindo.$Element.prototype.isParentOf start(jindo.$Element._contain)!-//
/**
 {{isParentOf}}
 */
jindo.$Element.prototype.isParentOf = function(element) {
	
	return jindo.$Element._contain(this._element, jindo.$Element(element)._element);
};
//-!jindo.$Element.prototype.isParentOf end!-//

//-!jindo.$Element.prototype.isEqual start!-//
/**
 {{isEqual}}
 */
jindo.$Element.prototype.isEqual = function(element) {
	
	try {
		return (this._element === jindo.$Element(element)._element);
	} catch(e) {
		return false;
	}
};
//-!jindo.$Element.prototype.isEqual end!-//

//-!jindo.$Element.prototype.fireEvent start!-//
/**
 {{fireEvent}}
 */
jindo.$Element.prototype.fireEvent = function(sEvent, oProps) {
	
	function IE(sEvent, oProps) {
		sEvent = (sEvent+"").toLowerCase();
		var oEvent = document.createEventObject();
		if(oProps){
			for (k in oProps){
				if(oProps.hasOwnProperty(k))
					oEvent[k] = oProps[k];
			} 
			oEvent.button = (oProps.left?1:0)+(oProps.middle?4:0)+(oProps.right?2:0);
			oEvent.relatedTarget = oProps.relatedElement||null;
		}
		this._element.fireEvent("on"+sEvent, oEvent);
		return this;
	};

	function DOM2(sEvent, oProps) {
		var sType = "HTMLEvents";
		sEvent = (sEvent+"").toLowerCase();

		if (sEvent == "click" || sEvent.indexOf("mouse") == 0) {
			sType = "MouseEvent";
			if (sEvent == "mousewheel") sEvent = "dommousescroll";
		} else if (sEvent.indexOf("key") == 0) {
			sType = "KeyboardEvent";
		}
		var evt;
		if (oProps) {
			oProps.button = 0 + (oProps.middle?1:0) + (oProps.right?2:0);
			oProps.ctrl = oProps.ctrl||false;
			oProps.alt = oProps.alt||false;
			oProps.shift = oProps.shift||false;
			oProps.meta = oProps.meta||false;
			switch (sType) {
				case 'MouseEvent':
					evt = document.createEvent(sType);

					evt.initMouseEvent( sEvent, true, true, null, oProps.detail||0, oProps.screenX||0, oProps.screenY||0, oProps.clientX||0, oProps.clientY||0, 
										oProps.ctrl, oProps.alt, oProps.shift, oProps.meta, oProps.button, oProps.relatedElement||null);
					break;
				case 'KeyboardEvent':
					if (window.KeyEvent) {
				        evt = document.createEvent('KeyEvents');
				        evt.initKeyEvent(sEvent, true, true, window,  oProps.ctrl, oProps.alt, oProps.shift, oProps.meta, oProps.keyCode, oProps.keyCode);
				    } else {
						try {
				            evt = document.createEvent("Events");
				        } catch (e){
				            evt = document.createEvent("UIEvents");
				        } finally {
							evt.initEvent(sEvent, true, true);
							evt.ctrlKey  = oProps.ctrl;
					        evt.altKey   = oProps.alt;
					        evt.shiftKey = oProps.shift;
					        evt.metaKey  = oProps.meta;
					        evt.keyCode = oProps.keyCode;
					        evt.which = oProps.keyCode;
				        }          
				    }
					break;
				default:
					evt = document.createEvent(sType);
					evt.initEvent(sEvent, true, true);				
			}
		}else{
			evt = document.createEvent(sType);			
			evt.initEvent(sEvent, true, true);
		}
		this._element.dispatchEvent(evt);
		return this;
	};

	jindo.$Element.prototype.fireEvent = (typeof this._element.dispatchEvent != "undefined")?DOM2:IE;

	return this.fireEvent(sEvent, oProps);
};
//-!jindo.$Element.prototype.fireEvent end!-//

//-!jindo.$Element.prototype.empty start(jindo.$Element.prototype.html)!-//
/**
 {{empty_1}}
 */
jindo.$Element.prototype.empty = function() {
	
	if(jindo.cssquery) jindo.cssquery.release();
	this.html("");
	return this;
};
//-!jindo.$Element.prototype.empty end!-//

//-!jindo.$Element.prototype.remove start(jindo.$Element.prototype.leave)!-//
/**
 {{remove}}
 */
jindo.$Element.prototype.remove = function(oChild) {
	
	if(jindo.cssquery) jindo.cssquery.release();
	jindo.$Element(oChild).leave();
	return this;
}
//-!jindo.$Element.prototype.remove end!-//

//-!jindo.$Element.prototype.leave start!-//
/**
 {{leave}}
 */
jindo.$Element.prototype.leave = function() {
	
	var e = this._element;

	if (e.parentNode) {
		if(jindo.cssquery) jindo.cssquery.release();
		e.parentNode.removeChild(e);
	}
	
	if(jindo.$Fn.freeElement)
		jindo.$Fn.freeElement(this._element);

	return this;
};
//-!jindo.$Element.prototype.leave end!-//

//-!jindo.$Element.prototype.wrap start!-//
/**
 {{wrap}}
 */
jindo.$Element.prototype.wrap = function(wrapper) {
	
	var e = this._element;

	wrapper = jindo.$Element(wrapper)._element;
	if (e.parentNode) {
		e.parentNode.insertBefore(wrapper, e);
	}
	wrapper.appendChild(e);

	return this;
};
//-!jindo.$Element.prototype.wrap end!-//

//-!jindo.$Element.prototype.ellipsis start(jindo.$Element.prototype._getCss,jindo.$Element.prototype.text)!-//
/**
 {{ellipsis}} 
 */
jindo.$Element.prototype.ellipsis = function(stringTail) {
	
	stringTail = stringTail || "...";
	var txt   = this.text();
	var len   = txt.length;
	var padding = parseInt(this._getCss(this._element,"paddingTop"),10) + parseInt(this._getCss(this._element,"paddingBottom"),10);
	var cur_h = this._element.offsetHeight - padding;
	var i     = 0;
	var h     = this.text('A')._element.offsetHeight - padding;

	if (cur_h < h * 1.5) return this.text(txt);

	cur_h = h;
	while(cur_h < h * 1.5) {
		i += Math.max(Math.ceil((len - i)/2), 1);
		cur_h = this.text(txt.substring(0,i)+stringTail)._element.offsetHeight - padding;
	}

	while(cur_h > h * 1.5) {
		i--;
		cur_h = this.text(txt.substring(0,i)+stringTail)._element.offsetHeight - padding;
	}
};
//-!jindo.$Element.prototype.ellipsis end!-//

//-!jindo.$Element.prototype.indexOf start!-//
/**
 {{indexOf}}
 */
jindo.$Element.prototype.indexOf = function(element) {
	
	try {
		var e = jindo.$Element(element)._element;
		var n = this._element.childNodes;
		var c = 0;
		var l = n.length;

		for (var i=0; i < l; i++) {
			if (n[i].nodeType != 1) continue;

			if (n[i] === e) return c;
			c++;
		}
	}catch(e){}

	return -1;
};
//-!jindo.$Element.prototype.indexOf end!-//

//-!jindo.$Element.prototype.queryAll start(jindo.cssquery)!-//
/**
 {{queryAll}}
 */
jindo.$Element.prototype.queryAll = function(sSelector) { 
	
	return jindo.cssquery(sSelector, this._element); 
};
//-!jindo.$Element.prototype.queryAll end!-//

//-!jindo.$Element.prototype.query start(jindo.cssquery)!-//
/**
 {{query}}
 */
jindo.$Element.prototype.query = function(sSelector) { 
	
	return jindo.cssquery.getSingle(sSelector, this._element); 
};
//-!jindo.$Element.prototype.query end!-//

//-!jindo.$Element.prototype.test start(jindo.cssquery)!-//
/**
 {{test}}
 */
jindo.$Element.prototype.test = function(sSelector) {
	 
	return jindo.cssquery.test(this._element, sSelector); 
};
//-!jindo.$Element.prototype.test end!-//

//-!jindo.$Element.prototype.xpathAll start(jindo.cssquery)!-//
/**
 {{xpathAll}}
 */
jindo.$Element.prototype.xpathAll = function(sXPath) {
	 
	return jindo.cssquery.xpath(sXPath, this._element); 
};
//-!jindo.$Element.prototype.xpathAll end!-//

//-!jindo.$Element.prototype.insertAdjacentHTML.hidden start(jindo._createEle)!-//
/**
 {{insertAdjacentHTML}}
 */
jindo.$Element.insertAdjacentHTML = function(ins,html,insertType,type,fn){
	var _ele = ins._element;
	if( _ele.insertAdjacentHTML && !(/^<(option|tr|td|th|col)(?:.*?)>/.test(html.replace(/^(\s|　)+|(\s|　)+$/g, "").toLowerCase()))){
		_ele.insertAdjacentHTML(insertType, html);
	}else{
		var oDoc = _ele.ownerDocument || _ele.document || document;
		var fragment = oDoc.createDocumentFragment();
		var defaultElement;
		var sTag = html.replace(/^(\s|　)+|(\s|　)+$/g, "");
		var oParentTag = {
			"option" : "select",
			"tr" : "tbody",
			"thead" : "table",
			"tbody" : "table",
			"col" : "table",
			"td" : "tr",
			"th" : "tr",
			"div" : "div"
		}
		var aMatch = /^\<(option|tr|thead|tbody|td|th|col)(?:.*?)\>/i.exec(sTag);
		var sChild = aMatch === null ? "div" : aMatch[1].toLowerCase();
		var sParent = oParentTag[sChild] ;
		defaultElement = jindo._createEle(sParent,sTag,oDoc,true);
		var scripts = defaultElement.getElementsByTagName("script");
	
		for ( var i = 0, l = scripts.length; i < l; i++ ){
			scripts[i].parentNode.removeChild( scripts[i] );
		}
			
		while ( defaultElement[ type ]){
			fragment.appendChild( defaultElement[ type ] );
		}
		
		fn(fragment.cloneNode(true));

	}
	return ins;
}
//-!jindo.$Element.prototype.insertAdjacentHTML.hidden end!-//

//-!jindo.$Element.prototype.appendHTML start(jindo.$Element.prototype.insertAdjacentHTML)!-//
/**
 {{appendHTML}}
 */
jindo.$Element.prototype.appendHTML = function(sHTML) {
	
	return jindo.$Element.insertAdjacentHTML(this,sHTML,"beforeEnd","firstChild",jindo.$Fn(function(oEle){
		this._element.appendChild(oEle);
	},this).bind());
};
//-!jindo.$Element.prototype.appendHTML end!-//

//-!jindo.$Element.prototype.prependHTML start(jindo.$Element.prototype.insertAdjacentHTML,jindo.$Element._prepend)!-//
/**
 {{prependHTML}}
 */
jindo.$Element.prototype.prependHTML = function(sHTML) {
	
	return jindo.$Element.insertAdjacentHTML(this,sHTML,"afterBegin","lastChild",jindo.$Fn(function(oEle){
		jindo.$Element._prepend(this._element,{"_element":oEle});
	},this).bind());
};
//-!jindo.$Element.prototype.prependHTML end!-//

//-!jindo.$Element.prototype.beforeHTML start(jindo.$Element.prototype.insertAdjacentHTML)!-//
/**
 {{beforeHTML}}
 */
jindo.$Element.prototype.beforeHTML = function(sHTML) {
	
	return jindo.$Element.insertAdjacentHTML(this,sHTML,"beforeBegin","firstChild",jindo.$Fn(function(oEle){
		this._element.parentNode.insertBefore(oEle, this._element);
	},this).bind());
};
//-!jindo.$Element.prototype.beforeHTML end!-//

//-!jindo.$Element.prototype.afterHTML start(jindo.$Element.prototype.insertAdjacentHTML)!-//
/**
 {{afterHTML}}
 */
jindo.$Element.prototype.afterHTML = function(sHTML) {
	
	return jindo.$Element.insertAdjacentHTML(this,sHTML,"afterEnd","lastChild",jindo.$Fn(function(oEle){
		this._element.parentNode.insertBefore( oEle, this._element.nextSibling );
	},this).bind());
};
//-!jindo.$Element.prototype.afterHTML end!-//


//-!jindo.$Element.prototype.delegate start(jindo.$Event,jindo.$Fn.prototype.bind,jindo.cssquery)!-//
/**
 {{delegate}}
 */
jindo.$Element.prototype.delegate = function(sEvent , vFilter , fpCallback){
	
	if(!this._element["_delegate_"+sEvent]){
		this._element["_delegate_"+sEvent] = {};
		
		var fAroundFunc = jindo.$Fn(function(sEvent,wEvent){
			wEvent = wEvent || window.event;
			if (typeof wEvent.currentTarget == "undefined") {
				wEvent.currentTarget = this._element;
			}
			
			var oEle = wEvent.target || wEvent.srcElement;
			var aData = this._element["_delegate_"+sEvent];
			

			var data,func,event,resultFilter; 
			for(var i in aData){
				data = aData[i];
				resultFilter = data.checker(oEle);
				if(resultFilter[0]){
					func = data.func;
					event = jindo.$Event(wEvent);
					event.element = resultFilter[1];
					for(var j = 0, l = func.length ; j < l ;j++){
						func[j](event);
					}
				}
			}
		},this).bind(sEvent);
		
		jindo.$Element._eventBind(this._element,sEvent,fAroundFunc);
		var oEle = this._element;
		oEle["_delegate_"+sEvent+"_func"] = fAroundFunc;
		if (this._element["_delegate_events"]) {
			this._element["_delegate_events"].push(sEvent);
		}else{
			this._element["_delegate_events"] = [sEvent];
		}
		
		oEle = null;
	}
	
	this._bind(sEvent,vFilter,fpCallback);
	
	return this;
	
}

/**
 {{sign_eventBind}}
 */
jindo.$Element._eventBind = function(oEle,sEvent,fAroundFunc){
	if(oEle.addEventListener){
		jindo.$Element._eventBind = function(oEle,sEvent,fAroundFunc){
			oEle.addEventListener(sEvent,fAroundFunc,false);
		}
	}else{
		jindo.$Element._eventBind = function(oEle,sEvent,fAroundFunc){
			oEle.attachEvent("on"+sEvent,fAroundFunc);
		}
	}
	jindo.$Element._eventBind(oEle,sEvent,fAroundFunc);
}

/**
 {{sign_bind}}
 */
jindo.$Element.prototype._bind = function(sEvent,vFilter,fpCallback){
	var _aDataOfEvent = this._element["_delegate_"+sEvent];
	if(_aDataOfEvent){
		var fpCheck;
		if(typeof vFilter == "string"){
			fpCheck = jindo.$Fn(function(sCssquery,oEle){
				var eIncludeEle = oEle;
				var isIncludeEle = jindo.cssquery.test(oEle, sCssquery);
				if(!isIncludeEle){
					var aPropagationElements = this._getParent(oEle);
					for(var i = 0, leng = aPropagationElements.length ; i < leng ; i++){
						eIncludeEle = aPropagationElements[i];
						if(jindo.cssquery.test(eIncludeEle, sCssquery)){
							isIncludeEle = true;
							break;
						}
					}
				}
				return [isIncludeEle,eIncludeEle];
			},this).bind(vFilter);
		}else if(typeof vFilter == "function"){
			fpCheck = jindo.$Fn(function(fpFilter,oEle){
				var eIncludeEle = oEle;
				var isIncludeEle = fpFilter(this._element,oEle);
				if(!isIncludeEle){
					var aPropagationElements = this._getParent(oEle);
					for(var i = 0, leng = aPropagationElements.length ; i < leng ; i++){
						eIncludeEle = aPropagationElements[i];
						if(fpFilter(this._element,eIncludeEle)){
							isIncludeEle = true;
							break;
						}
					}
				}
				return [isIncludeEle,eIncludeEle];
			},this).bind(vFilter);
		}
		
		this._element["_delegate_"+sEvent] = jindo.$Element._addBind(_aDataOfEvent,vFilter,fpCallback,fpCheck);
		
	}else{
		alert("check your delegate event.");
	}
}
/**
 {{sign_getParent}}
 */
jindo.$Element.prototype._getParent = function(oEle) {
	var e = this._element;
	var a = [], p = null;

	while (oEle.parentNode && p != e) {
		p = oEle.parentNode;
		if (p == document.documentElement) break;
		a[a.length] = p;
		oEle = p;
	}

	return a;
};
/**
 {{sign_addBind}}
 */
jindo.$Element._addBind = function(aDataOfEvent,vFilter,fpCallback,fpCheck){
	var aEvent = aDataOfEvent[vFilter];
	if(aEvent){
		var fpFuncs = aEvent.func;
		fpFuncs.push(fpCallback);
		aEvent.func = fpFuncs;
		
	}else{
		aEvent = {
			checker : fpCheck,
			func : [fpCallback]
		};
	}
	aDataOfEvent[vFilter] = aEvent
	return aDataOfEvent;
}


/**
 {{sign_unbind}}
 */
jindo.$Element.prototype._unbind = function(sEvent, vFilter,fpCallback){
	var oEle = this._element;
	if (sEvent&&vFilter&&fpCallback) {
		var oEventInfo = oEle["_delegate_"+sEvent];
		if(oEventInfo&&oEventInfo[vFilter]){
			var fpFuncs = oEventInfo[vFilter].func;
			var aRefuse = [];
			for(var i = 0 , l = fpFuncs.length; i < l ; i++){
				if(fpFuncs[i]!=fpCallback){
					aRefuse.push(fpFuncs[i]);
				}
			}
			fpFuncs = oEventInfo[vFilter].func = aRefuse;
			if (!fpFuncs.length) {
				jindo.$Element._deleteFilter(oEle,sEvent,vFilter);
			}
		}
	}else if (sEvent&&vFilter) {
		jindo.$Element._deleteFilter(oEle,sEvent,vFilter);
	}else if (sEvent) {
		jindo.$Element._deleteEvent(oEle,sEvent,vFilter);
	}else{
		var aEvents = oEle['_delegate_events'];
		var sEachEvent;
		for(var i = 0 , l = aEvents.length ; i < l ; i++){
			sEachEvent = aEvents[i];
			jindo.$Element._unEventBind(oEle,sEachEvent,oEle["_delegate_"+sEachEvent+"_func"]);
			jindo.$Element._delDelegateInfo(oEle,"_delegate_"+sEachEvent);
			jindo.$Element._delDelegateInfo(oEle,"_delegate_"+sEachEvent+"_func");
		}
		jindo.$Element._delDelegateInfo(oEle,"_delegate_events");
	}
	
	return this;
	
}

/**
 {{sign_delDelegateInfo}}
 */

jindo.$Element._delDelegateInfo = function(oObj , sType){
	try{
		oObj[sType] = null;
		delete oObj[sType];
	}catch(e){}
	return oObj
}

/**
 {{sign_deleteFilter}}
 */

jindo.$Element._deleteFilter = function(oEle,sEvent,vFilter){
	var oEventInfo = oEle["_delegate_"+sEvent];
	if(oEventInfo&&oEventInfo[vFilter]){
		var nCount = 0;
		for(var i in oEventInfo){
			nCount++;
			if(nCount>1){
				break;
			}
		}
		if (nCount == 1) {
			jindo.$Element._deleteEvent(oEle,sEvent,vFilter);
		}else{
			jindo.$Element._delDelegateInfo(oEventInfo,vFilter);
		}
	}
}

/**
 {{sign_deleteEvent}}
 */

jindo.$Element._deleteEvent = function(oEle,sEvent,vFilter){
	var aEvents = oEle['_delegate_events'];
	jindo.$Element._unEventBind(oEle,sEvent,oEle["_delegate_"+sEvent+"_func"]);
	jindo.$Element._delDelegateInfo(oEle,"_delegate_"+sEvent);
	jindo.$Element._delDelegateInfo(oEle,"_delegate_"+sEvent+"_func");
	var aRefuse = [];
	for(var i = 0 , l = aEvents.length; i < l ; i++){
		if(aEvents[i]!=sEvent){
			aRefuse.push(aEvents[i]);
		}
	}
	aEvents = aRefuse;
	if (!aEvents.length) {
		jindo.$Element._delDelegateInfo(oEle,"_delegate_events");
	}else{
		oEle['_delegate_events'] = aEvents;
	}
}

/**
 {{sign_unEventBind}}
 */
jindo.$Element._unEventBind = function(oEle,sType,fAroundFunc){
	if(oEle.removeEventListener){
		jindo.$Element._unEventBind = function(oEle,sType,fAroundFunc){
			oEle.removeEventListener(sType,fAroundFunc,false);
		}
	}else{
		jindo.$Element._unEventBind = function(oEle,sType,fAroundFunc){
			oEle.detachEvent("on"+sType,fAroundFunc);
		}
	}
	jindo.$Element._unEventBind(oEle,sType,fAroundFunc);
}
//-!jindo.$Element.prototype.delegate end!-//

//-!jindo.$Element.prototype.undelegate start(jindo.$Element.prototype.delegate)!-//
/**
 {{undelegate}}
 */
jindo.$Element.prototype.undelegate = function(sEvent, vFilter, fpCallback){
	
	this._unbind(sEvent,vFilter,fpCallback);
	return this;
}
//-!jindo.$Element.prototype.undelegate end!-//