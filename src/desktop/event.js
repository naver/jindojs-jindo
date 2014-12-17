/**
 {{title}}
 */
//-!jindo.$Event start!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
/**
 {{type}}
 */
/**
 {{element}}
 */
/**
 {{srcElement}}
 */
/**
 {{currentElement}}
 */
/**
 {{relatedElement}}
 */
/**
 {{delegatedElement}}
 */
jindo.$Event = (function(isMobile) {
	if(isMobile){
		return function(e){
			//-@@$Event-@@//
			var cl = arguments.callee;
			if (e instanceof cl) return e;
			if (!(this instanceof cl)) return new cl(e);
		
			this._event = this._posEvent = e;
			this._globalEvent = window.event;
			this.type = e.type.toLowerCase();
			if (this.type == "dommousescroll") {
				this.type = "mousewheel";
			} else if (this.type == "domcontentloaded") {
				this.type = "domready";
			}
			this.realType = this.type;
			
			this.isTouch = false;
			if(this.type.indexOf("touch") > -1){
				this._posEvent = e.changedTouches[0];
				this.isTouch = true;
			}
		
			this.canceled = false;
		
			this.srcElement = this.element = e.target || e.srcElement;
			this.currentElement = e.currentTarget;
			this.relatedElement = null;
			this.delegatedElement = null;
		
			if (!jindo.$Jindo.isUndefined(e.relatedTarget)) {
				this.relatedElement = e.relatedTarget;
			} else if(e.fromElement && e.toElement) {
				this.relatedElement = e[(this.type=="mouseout")?"toElement":"fromElement"];
			}
		};
	}else{
		return function(e){
			//-@@$Event-@@//
			var cl = arguments.callee;
			if (e instanceof cl) return e;
			if (!(this instanceof cl)) return new cl(e);
		
			if (e === undefined) e = window.event;
			if (e === window.event && document.createEventObject) e = document.createEventObject(e);
		
		
			this.isTouch = false;
			this._event = this._posEvent = e;
			this._globalEvent = window.event;
		
			this.type = e.type.toLowerCase();
			if (this.type == "dommousescroll") {
				this.type = "mousewheel";
			} else if (this.type == "domcontentloaded") {
				this.type = "domready";
			}
		    this.realType = this.type;
			this.canceled = false;
		
			this.srcElement = this.element = e.target || e.srcElement;
			this.currentElement = e.currentTarget;
			this.relatedElement = null;
			this.delegatedElement = null;
		  
			if (e.relatedTarget !== undefined) {
				this.relatedElement = e.relatedTarget;
			} else if(e.fromElement && e.toElement) {
				this.relatedElement = e[(this.type=="mouseout")?"toElement":"fromElement"];
			}
		};
	}
})(jindo._p_._JINDO_IS_MO);

//-!jindo.$Event end!-//

/**
 {{hook}}
 {{hook2}}
 */


//-!jindo.$Event.jindo._p_.customEvent start!-//
/**
 {{jindo._p_.customEvent}}
 */

jindo._p_.customEvent = {};
jindo._p_.customEventStore = {};
jindo._p_.normalCustomEvent = {};

jindo._p_.hasCustomEvent = function(sName){
    return !!(jindo._p_.getCustomEvent(sName)||jindo._p_.normalCustomEvent[sName]);
};

jindo._p_.getCustomEvent = function(sName){
    return jindo._p_.customEvent[sName];
};

jindo._p_.addCustomEventListener = function(eEle, sElementId, sEvent, vFilter,oCustomInstance){
    if(!jindo._p_.customEventStore[sElementId]){
        jindo._p_.customEventStore[sElementId] = {};
        jindo._p_.customEventStore[sElementId].ele = eEle;
    }
    if(!jindo._p_.customEventStore[sElementId][sEvent]){
        jindo._p_.customEventStore[sElementId][sEvent] = {};
    }
    if(!jindo._p_.customEventStore[sElementId][sEvent][vFilter]){
        jindo._p_.customEventStore[sElementId][sEvent][vFilter] = {
            "custom" : oCustomInstance
        };
    }
};

jindo._p_.setCustomEventListener = function(sElementId, sEvent, vFilter, aNative, aWrap){
    jindo._p_.customEventStore[sElementId][sEvent][vFilter].real_listener = aNative;
    jindo._p_.customEventStore[sElementId][sEvent][vFilter].wrap_listener = aWrap;
};

jindo._p_.getCustomEventListener = function(sElementId, sEvent, vFilter){
    var store = jindo._p_.customEventStore[sElementId];
    if(store&&store[sEvent]&&store[sEvent][vFilter]){
        return store[sEvent][vFilter];
    }
    return {};
};
 
jindo._p_.getNormalEventListener = function(sElementId, sEvent, vFilter){
    var store = jindo._p_.normalCustomEvent[sEvent];
    if(store&&store[sElementId]&&store[sElementId][vFilter]){
        return store[sElementId][vFilter];
    }
    return {};
};

jindo._p_.hasCustomEventListener = function(sElementId, sEvent, vFilter){
    var store = jindo._p_.customEventStore[sElementId];
    if(store&&store[sEvent]&&store[sEvent][vFilter]){
        return true;
    }
    return false;
};

//-!jindo.$Event.customEvent start!-//
jindo.$Event.customEvent = function(sName, oEvent) {
    var oArgs = g_checkVarType(arguments, {
        's4str' : [ 'sName:String+'],
        's4obj' : [ 'sName:String+', "oEvent:Hash+"]
    },"$Event.customEvent");

    
    switch(oArgs+""){
        case "s4str":
            if(jindo._p_.hasCustomEvent(sName)){
                throw new jindo.$Error("The Custom Event Name have to unique.");
            }else{
                jindo._p_.normalCustomEvent[sName] = {};
            }

            return this;
        case "s4obj":
            if(jindo._p_.hasCustomEvent(sName)){
                throw new jindo.$Error("The Custom Event Name have to unique.");
            }else{
                jindo._p_.normalCustomEvent[sName] = {};
                jindo._p_.customEvent[sName] = function(){
                    this.name = sName;
                    this.real_listener = [];
                    this.wrap_listener = [];
                };
                var _proto = jindo._p_.customEvent[sName].prototype;
                _proto.events = [];
                for(var i in oEvent){
                    _proto[i] = oEvent[i];
                    _proto.events.push(i);
                }

                jindo._p_.customEvent[sName].prototype.fireEvent = function(oCustomEvent){
                    for(var i = 0, l = this.wrap_listener.length; i < l; i ++){
                        this.wrap_listener[i](oCustomEvent);
                    }
                };
            }
            return this;
    }
};
//-!jindo.$Event.customEvent end!-//


//-!jindo.$Event.prototype.mouse start!-//
/**
 {{mouse}}
 */
jindo.$Event.prototype.mouse = function(bIsScrollbar) {
	//-@@$Event.mouse-@@//
	g_checkVarType(arguments,{
		"voi" : [],
		"bol" : ["bIsScrollbar:Boolean"]
	});
	var e    = this._event;
	var ele  = this.srcElement;
	var delta = 0;
	var left = false,mid = false,right = false;

	var left  = e.which ? e.button==0 : !!(e.button&1);
	var mid   = e.which ? e.button==1 : !!(e.button&4);
	var right = e.which ? e.button==2 : !!(e.button&2);
	var ret   = {};

	if (e.wheelDelta) {
		delta = e.wheelDelta / 120;
	} else if (e.detail) {
		delta = -e.detail / 3;
	}
	var scrollbar = false;
	if(bIsScrollbar){
		scrollbar = _event_isScroll(ele,e);
	}
	
				
	ret = {
		delta  : delta,
		left   : left,
		middle : mid,
		right  : right,
		scrollbar : scrollbar
	};
	// replace method
	this.mouse = function(bIsScrollbar){
		if(bIsScrollbar){
			ret.scrollbar = _event_isScroll(this.srcElement,this._event);
			this.mouse = function(){return ret;};
		} 
		return ret;
	};

	return ret;
};
/**
 * @ignore
 */
function _event_getScrollbarSize() {
	
	var oScrollbarSize = { x : 0, y : 0 };
		
	var elDummy = jindo.$([
		'<div style="',
		[
			'overflow:scroll',
			'width:100px',
			'height:100px',
			'position:absolute',
			'left:-1000px',
			'border:0',
			'margin:0',
			'padding:0'
		].join(' !important;'),
		' !important;">'
	].join(''));
	
	document.body.insertBefore(elDummy, document.body.firstChild);
	
	oScrollbarSize = {
		x : elDummy.offsetWidth - elDummy.scrollWidth,
		y : elDummy.offsetHeight - elDummy.scrollHeight
	};
	
	document.body.removeChild(elDummy);
	elDummy = null;
	
	_event_getScrollbarSize = function() {
		return oScrollbarSize;
	};
	
	return oScrollbarSize;
	
}
/**
 * @ignore
 */
function _ie_check_scroll(ele,e) {
    var iePattern = jindo._p_._j_ag.match(/(?:MSIE) ([0-9.]+)/);
    if(document.body.componentFromPoint&&iePattern&& parseInt(iePattern[1],10) == 8){
        _ie_check_scroll = function(ele,e) {
            return !/HTMLGenericElement/.test(ele+"") && 
                    /(scrollbar|outside)/.test(ele.componentFromPoint(e.clientX, e.clientY)) &&
                    ele.clientHeight !== ele.scrollHeight;
        };
    }else{
        _ie_check_scroll = function(ele,e){
            return /(scrollbar|outside)/.test(ele.componentFromPoint(e.clientX, e.clientY));
        };
    }
    return _ie_check_scroll(ele,e);
}


function _event_isScroll(ele,e){
	/**
	 {{_event_isScroll_1}}
	 */
	if (ele.componentFromPoint) {
		return _ie_check_scroll(ele,e);
	}
	
	/**
	 {{_event_isScroll_2}}
	 */
	if (jindo._p_._JINDO_IS_FF) {
		
		try {
			var name = e.originalTarget.localName;
			return (
				name === 'thumb' ||
				name === 'slider' ||
				name === 'scrollcorner' ||
				name === 'scrollbarbutton'
			);
		} catch(ex) {
			return true;
		}
		
	}
	
	var sDisplay = jindo.$Element(ele).css('display');
	if (sDisplay === 'inline') { return false; }
	
	/**
	 {{_event_isScroll_3}}
	 */
	var oPos = {
		x : e.offsetX || 0,
		y : e.offsetY || 0
	};
	
	/**
	 {{_event_isScroll_4}}
	 */
	if (jindo._p_._JINDO_IS_WK) {
		oPos.x -= ele.clientLeft;
		oPos.y -= ele.clientTop;
	}
	
	var oScrollbarSize = _event_getScrollbarSize();
	
	/**
	 {{_event_isScroll_5}}
	 */
	var oScrollPos = {
		x : [ ele.clientWidth, ele.clientWidth + oScrollbarSize.x ],
		y : [ ele.clientHeight, ele.clientHeight + oScrollbarSize.y ]
	};
	
	return (
		(oScrollPos.x[0] <= oPos.x && oPos.x <= oScrollPos.x[1]) ||
		(oScrollPos.y[0] <= oPos.y && oPos.y <= oScrollPos.y[1])
	);
}
//-!jindo.$Event.prototype.mouse end!-//

//-!jindo.$Event.prototype.key start!-//
/**
 {{key}}
 */
jindo.$Event.prototype.key = function() {
	//-@@$Event.key-@@//
	var e     = this._event;
	var k     = e.keyCode || e.charCode;
	var ret   = {
		keyCode : k,
		alt     : e.altKey,
		ctrl    : e.ctrlKey,
		meta    : e.metaKey,
		shift   : e.shiftKey,
		up      : (k == 38),
		down    : (k == 40),
		left    : (k == 37),
		right   : (k == 39),
		enter   : (k == 13),		
		esc   : (k == 27)
	};

	this.key = function(){ return ret; };

	return ret;
};
//-!jindo.$Event.prototype.key end!-//

//-!jindo.$Event.prototype.pos start(jindo.$Element.prototype.offset)!-//
/**
 {{pos}}
 */
jindo.$Event.prototype.pos = function(bGetOffset) {
	//-@@$Event.pos-@@//
	g_checkVarType(arguments,{
		"voi" : [],
		"bol" : ["bGetOffset:Boolean"]
	});

	var e = this._posEvent;
	var doc = (this.srcElement.ownerDocument||document);
	var b = doc.body;
	var de = doc.documentElement;
	var pos = [b.scrollLeft || de.scrollLeft, b.scrollTop || de.scrollTop];
	var ret = {
		clientX: e.clientX,
		clientY: e.clientY,
		pageX: 'pageX' in e ? e.pageX : e.clientX+pos[0]-b.clientLeft,
		pageY: 'pageY' in e ? e.pageY : e.clientY+pos[1]-b.clientTop
	};

    /*
     {{pos_1}}
     */
	if (bGetOffset && jindo.$Element) {
		var offset = jindo.$Element(this.srcElement).offset();
		ret.offsetX = ret.pageX - offset.left;
		ret.offsetY = ret.pageY - offset.top;
	}

	return ret;
};
//-!jindo.$Event.prototype.pos end!-//

//-!jindo.$Event.prototype.stop start!-//
/**
 {{stop}}
 */
jindo.$Event.prototype.stop = function(nCancel) {
	//-@@$Event.stop-@@//
	g_checkVarType(arguments,{
		"voi" : [],
		"num" : ["nCancel:Numeric"]
	});
	nCancel = nCancel || jindo.$Event.CANCEL_ALL;

	var e = (window.event && window.event == this._globalEvent)?this._globalEvent:this._event;
	var b = !!(nCancel & jindo.$Event.CANCEL_BUBBLE); // stop bubbling
	var d = !!(nCancel & jindo.$Event.CANCEL_DEFAULT); // stop default event
	var type = this.realType;
	if(b&&(type==="focusin"||type==="focusout")){
	    jindo.$Jindo._warn("The "+type +" event can't stop bubble.");
	}

	this.canceled = true;
	
	if(d){
	    if(e.preventDefault !== undefined){
	        e.preventDefault();
	    }else{
	        e.returnValue = false;
	    }
	}
	
	if(b){
	    if(e.stopPropagation !== undefined){
	        e.stopPropagation();
	    }else{
	        e.cancelBubble = true;
	    }
	}

	return this;
};

/**
 {{stopDefault}}
 */
jindo.$Event.prototype.stopDefault = function(){
	return this.stop(jindo.$Event.CANCEL_DEFAULT);
};

/**
 {{stopBubble}}
 */
jindo.$Event.prototype.stopBubble = function(){
	return this.stop(jindo.$Event.CANCEL_BUBBLE);
};

/**
 {{cancel_bubble}}
 */
jindo.$Event.CANCEL_BUBBLE = 1;

/**
 {{cancel_default}}
 */
jindo.$Event.CANCEL_DEFAULT = 2;

/**
 {{cancel_all}}
 */
jindo.$Event.CANCEL_ALL = 3;
//-!jindo.$Event.prototype.stop end!-//

//-!jindo.$Event.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$Event.prototype.$value = function() {
	//-@@$Event.$value-@@//
	return this._event;
};
//-!jindo.$Event.prototype.$value end!-//

//-!jindo.$Event.prototype.changedTouch start(jindo.$Event.prototype.targetTouch,jindo.$Event.prototype.touch)!-//
/**
 {{changedTouch}}
 */
(function(aType){
	var sTouches = "Touch", sMethod = "";

	for(var i=0, l=aType.length; i < l; i++) {
        sMethod = aType[i]+sTouches;
        if(!aType[i]) { sMethod = sMethod.toLowerCase(); }

		jindo.$Event.prototype[sMethod] = (function(sType) {
			return function(nIndex) {
				if(this.isTouch) {
					var oRet = [];
					var ev = this._event[sType+"es"];
					var l = ev.length;
					var e;
					for(var i = 0; i < l; i++){
						e = ev[i];
						oRet.push({
							"id" : e.identifier,
							"event" : this,
							"element" : e.target,
							"_posEvent" : e,
							"pos" : jindo.$Event.prototype.pos
						});
					}
					this[sType] = function(nIndex) {
						var oArgs = g_checkVarType(arguments, {
							'void' : [  ],
							'4num' : [ 'nIndex:Numeric' ]
						},"$Event#"+sType);
						if(oArgs+"" == 'void') return oRet;
						
						return oRet[nIndex];
					};
				} else {
					this[sType] = function(nIndex) {
						throw new jindo.$Error(jindo.$Except.NOT_SUPPORT_METHOD,"$Event#"+sType);
					};
				}
				
				return this[sType].apply(this,jindo._p_._toArray(arguments));
			};
		})(sMethod);
	}
})(["changed","target",""]);
//-!jindo.$Event.prototype.changedTouch end!-//

//-!jindo.$Event.prototype.targetTouch start(jindo.$Event.prototype.changedTouch)!-//
/**
 {{targetTouch}}
 */
//-!jindo.$Event.prototype.targetTouch end!-//

//-!jindo.$Event.prototype.touch start(jindo.$Event.prototype.changedTouch)!-//
/**
 {{touch}}
 */
//-!jindo.$Event.prototype.touch end!-//