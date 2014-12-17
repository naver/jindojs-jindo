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
jindo.$Event = function(e){
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
//-!jindo.$Event end!-//

/**
 {{hook}}
 {{hook2}}
 */


//-!jindo.$Event.customEvent start!-//
/**
 {{customEvent}}
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
jindo.$Event.customEvent = function(sName, oEvent){
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
jindo.$Event.prototype.mouse = function() {
	//-@@$Event.mouse-@@//
	var e    = this._event;
	var ele  = this.srcElement;
	var delta = 0;
	var ret   = {};

	if (e.wheelDelta) {
		delta = e.wheelDelta / 120;
	} else if (e.detail) {
		delta = -e.detail / 3;
	}
				
	ret = {
		delta  : delta
	};
	// replace method
	this.mouse = function(){
		return ret;
	};

	return ret;
};
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

	var e   = this._posEvent;
	var doc = (this.srcElement.ownerDocument||document);
	var b   = doc.body;
	var de  = doc.documentElement;
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
        }
    }
    
    if(b){
        if(e.stopPropagation !== undefined){
            e.stopPropagation();
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