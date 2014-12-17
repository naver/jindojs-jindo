/**
 {{title}}
 */
//-!jindo.$Element._getTransition.hidden start!-//

//-!jindo.$Element._getTransition.hidden end!-//

//-!jindo.$Element.prototype.appear start(jindo.$Element._getTransition,jindo.$Element.prototype.opacity,jindo.$Element.prototype.show)!-//
/**
 {{appear}}
 */
jindo.$Element.prototype.appear = function(duration, callback) {
    //-@@$Element.appear-@@//
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [ ],
        '4num' : [ 'nDuration:Numeric'],
        '4fun' : [ 'nDuration:Numeric' ,'fpCallback:Function+']
    },"$Element#appear");
    
    switch(oArgs+""){
        case "4voi":
            duration = 0.3;
            callback = function(){};
            break;
        case "4num":
            duration = oArgs.nDuration;
            callback = function(){};
            break;
        case "4fun":
            duration = oArgs.nDuration;
            callback = oArgs.fpCallback;
    }

    var self = this;
    
    if(this.visible()) {
        setTimeout(function() {
            callback.call(self,self);
        },16);
        return this; 
    }
    
    var ele = this._element;
    var oTransition = jindo._p_.getStyleIncludeVendorPrefix();
    var name = oTransition.transition;
    var endName = name == "transition" ? "end" : "End";
    
    var bindFunc = function(){
        self.show();
        ele.style[name + 'Property'] = '';
        ele.style[name + 'Duration'] = '';
        ele.style[name + 'TimingFunction'] = '';
        ele.style.opacity = '';
        callback.call(self,self);
        ele.removeEventListener(name+endName, arguments.callee , false );
    };
    if(!this.visible()){
        ele.style.opacity = ele.style.opacity||0;
        self.show();
    }
    ele.addEventListener( name+endName, bindFunc , false );
    ele.style[name + 'Property'] = 'opacity';
    ele.style[name + 'Duration'] = duration+'s';
    ele.style[name + 'TimingFunction'] = 'linear';
    
    jindo._p_.setOpacity(ele,"1");
    
    return this;
};
//-!jindo.$Element.prototype.appear end!-//

//-!jindo.$Element.prototype.disappear start(jindo.$Element._getTransition,jindo.$Element.prototype.opacity)!-//
/**
 {{disappear}}
 */
jindo.$Element.prototype.disappear = function(duration, callback) {
    //-@@$Element.disappear-@@//
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [ ],
        '4num' : [ 'nDuration:Numeric'],
        '4fun' : [ 'nDuration:Numeric' ,'fpCallback:Function+']
    },"$Element#disappear");
    
    switch(oArgs+""){
        case "4voi":
            duration = 0.3;
            callback = function(){};
            break;
        case "4num":
            duration = oArgs.nDuration;
            callback = function(){};
            break;
        case "4fun":
            duration = oArgs.nDuration;
            callback = oArgs.fpCallback;
            
    }
    var self = this;
    
    if(!this.visible()){
        setTimeout(function(){
            callback.call(self,self);
        },16);
        return this; 
    }
    
    var ele = this._element;
    var oTransition = jindo._p_.getStyleIncludeVendorPrefix();
    var name = oTransition.transition;
    var endName = name == "transition" ? "end" : "End";

    var bindFunc = function(){
        self.hide();
        ele.style[name + 'Property'] = '';
        ele.style[name + 'Duration'] = '';
        ele.style[name + 'TimingFunction'] = '';
        ele.style.opacity = '';
        callback.call(self,self);
        ele.removeEventListener(name+endName, arguments.callee , false );
    };

    ele.addEventListener(name+endName, bindFunc , false );
    ele.style[name + 'Property'] = 'opacity';
    ele.style[name + 'Duration'] = duration+'s';
    ele.style[name + 'TimingFunction'] = 'linear';
    /*
     {{disappear_1}}
     */
    jindo._p_.setOpacity(ele,"0");

    return this;
};
//-!jindo.$Element.prototype.disappear end!-//

//-!jindo.$Element.prototype.offset start!-//
/**
 {{offset}}
 */
/**
 {{offset2}}
 */
jindo.$Element.prototype.offset = function(nTop, nLeft) {
    //-@@$Element.offset-@@//
    var oArgs = g_checkVarType(arguments, {
        'g' : [ ],
        's' : [ 'nTop:Numeric', 'nLeft:Numeric']
    },"$Element#offset");
    
    switch(oArgs+""){
        case "g":
            return this.offset_get();
            
        case "s":
            return this.offset_set(oArgs.nTop, oArgs.nLeft);
            
    }
};

jindo.$Element.prototype.offset_set = function(nTop,nLeft){
    var oEl = this._element;
    var oPhantom = null;
    
    if (isNaN(parseFloat(this._getCss(oEl,'top')))) oEl.style.top = "0px";
    if (isNaN(parseFloat(this._getCss(oEl,'left')))) oEl.style.left = "0px";

    var oPos = this.offset_get();
    var oGap = { top : nTop - oPos.top, left : nLeft - oPos.left };

    oEl.style.top = parseFloat(this._getCss(oEl,'top')) + oGap.top + 'px';
    oEl.style.left = parseFloat(this._getCss(oEl,'left')) + oGap.left + 'px';

    return this;
};

jindo.$Element.prototype.offset_get = function(nTop,nLeft) {
    var oEl = this._element,
        oPhantom = null,
        oPos = { left: 0, top: 0 },
        oDoc = oEl.ownerDocument || oEl.document || document,
        oHtml = oDoc.documentElement,
        oBody = oDoc.body;

        if(oEl.getBoundingClientRect) { // has getBoundingClientRect

        if(!oPhantom) {
            var bHasFrameBorder = (window == top);

            if(!bHasFrameBorder) {
                try {
                    bHasFrameBorder = (window.frameElement && window.frameElement.frameBorder == 1);
                } catch(e){}
            }

            oPhantom = { left: 0, top: 0 };
        }

        var box = oEl.getBoundingClientRect();

        if(oEl !== oHtml && oEl !== oBody) {
            oPos.left = box.left - oPhantom.left;
            oPos.top = box.top - oPhantom.top;

            oPos.left += oHtml.scrollLeft || oBody.scrollLeft;
            oPos.top += oHtml.scrollTop || oBody.scrollTop;
        }

    } else if(oDoc.getBoxObjectFor) { // has getBoxObjectFor

        var box = oDoc.getBoxObjectFor(oEl),
            vpBox = oDoc.getBoxObjectFor(oHtml || oBody);

        oPos.left = box.screenX - vpBox.screenX;
        oPos.top = box.screenY - vpBox.screenY;

    } else {
        for(var o = oEl; o; o = o.offsetParent) {
            oPos.left += o.offsetLeft;
            oPos.top += o.offsetTop;
        }

        for(var o = oEl.parentNode; o; o = o.parentNode) {
            if (o.tagName == 'BODY') break;
            if (o.tagName == 'TR') oPos.top += 2;

            oPos.left -= o.scrollLeft;
            oPos.top -= o.scrollTop;
        }
    }

    return oPos;
};
//-!jindo.$Element.prototype.offset end!-//

//-!jindo.$Element.prototype.evalScripts start!-//
/**
 {{evalScripts}}
 */
jindo.$Element.prototype.evalScripts = function(sHTML) {
    //-@@$Element.evalScripts-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str' : [ "sHTML:String+" ]
    },"$Element#evalScripts");
    var aJS = [];
    var leftScript = '<script(\\s[^>]+)*>(.*?)</';
    var rightScript = 'script>';
    sHTML = sHTML.replace(new RegExp(leftScript+rightScript, 'gi'), function(_1, _2, sPart) { aJS.push(sPart); return ''; });
    eval(aJS.join('\n'));
    
    return this;

};
//-!jindo.$Element.prototype.evalScripts end!-//

//-!jindo.$Element.prototype.clone start!-//
/**
 {{clone}}
 */
jindo.$Element.prototype.clone = function(bDeep) {
    var oArgs = g_checkVarType(arguments, {
        'default' : [ ],
        'set' : [ 'bDeep:Boolean' ]
    },"$Element#clone");
    
    if(oArgs+"" == "default"){
        bDeep = true;
    }
    
    return jindo.$Element(this._element.cloneNode(bDeep));
};
//-!jindo.$Element.prototype.clone end!-//


//-!jindo.$Element._common.hidden start!-//
/**
 * @ignore
 */
jindo.$Element._common = function(oElement,sMethod){

    try{
        return jindo.$Element(oElement)._element;
    }catch(e){
        throw TypeError(e.message.replace(/\$Element/g,"$Element#"+sMethod).replace(/Element\.html/g,"Element.html#"+sMethod));
    }
};
//-!jindo.$Element._common.hidden end!-//
//-!jindo.$Element._prepend.hidden start(jindo.$)!-//
/**
 {{sign_prepend}}
 */
jindo.$Element._prepend = function(oParent, oChild){
    var nodes = oParent.childNodes;
    if (nodes.length > 0) {
        oParent.insertBefore(oChild, nodes[0]);
    } else {
        oParent.appendChild(oChild);
    }
};
//-!jindo.$Element._prepend.hidden end!-//

//-!jindo.$Element.prototype.append start(jindo.$Element._common)!-//
/**
 {{append}}
 */
jindo.$Element.prototype.append = function(oElement) {
    //-@@$Element.append-@@//
    this._element.appendChild(jindo.$Element._common(oElement,"append"));
    return this;
};
//-!jindo.$Element.prototype.append end!-//

//-!jindo.$Element.prototype.prepend start(jindo.$Element._prepend)!-//
/** 
 {{prepend}}
 */
jindo.$Element.prototype.prepend = function(oElement) {
    //-@@$Element.prepend-@@//
    jindo.$Element._prepend(this._element, jindo.$Element._common(oElement,"prepend"));
    
    return this;
};
//-!jindo.$Element.prototype.prepend end!-//

//-!jindo.$Element.prototype.replace start(jindo.$Element._common)!-//
/**
 {{replace}}
 */
jindo.$Element.prototype.replace = function(oElement) {
    //-@@$Element.replace-@@//
    oElement = jindo.$Element._common(oElement,"replace");
    if(jindo.cssquery) jindo.cssquery.release();
    var e = this._element;
    var oParentNode = e.parentNode;
    if(oParentNode&&oParentNode.replaceChild){
        oParentNode.replaceChild(oElement,e);
        return this;
    }
    
    var _o = oElement;

    oParentNode.insertBefore(_o, e);
    oParentNode.removeChild(e);

    return this;
};
//-!jindo.$Element.prototype.replace end!-//

//-!jindo.$Element.prototype.appendTo start(jindo.$Element._common)!-//
/**
 {{appendTo}}
 */
jindo.$Element.prototype.appendTo = function(oElement) {
    //-@@$Element.appendTo-@@//
    jindo.$Element._common(oElement,"appendTo").appendChild(this._element);
    return this;
};
//-!jindo.$Element.prototype.appendTo end!-//

//-!jindo.$Element.prototype.prependTo start(jindo.$Element._prepend, jindo.$Element._common)!-//
/**
 {{prependTo}}
 */
jindo.$Element.prototype.prependTo = function(oElement) {
    //-@@$Element.prependTo-@@//
    jindo.$Element._prepend(jindo.$Element._common(oElement,"prependTo"), this._element);
    return this;
};
//-!jindo.$Element.prototype.prependTo end!-//

//-!jindo.$Element.prototype.before start(jindo.$Element._common)!-//
/**
 {{before}}
 */
jindo.$Element.prototype.before = function(oElement) {
    //-@@$Element.before-@@//
    var o = jindo.$Element._common(oElement,"before");

    this._element.parentNode.insertBefore(o, this._element);

    return this;
};
//-!jindo.$Element.prototype.before end!-//

//-!jindo.$Element.prototype.after start(jindo.$Element.prototype.before, jindo.$Element._common)!-//
/**
 {{after}}
 */
jindo.$Element.prototype.after = function(oElement) {
    //-@@$Element.after-@@//
    oElement = jindo.$Element._common(oElement,"after");
    this.before(oElement);
    jindo.$Element(oElement).before(this);

    return this;
};
//-!jindo.$Element.prototype.after end!-//

//-!jindo.$Element.prototype.parent start!-//
/**
 {{parent}}
 */
jindo.$Element.prototype.parent = function(pFunc, limit) {
    //-@@$Element.parent-@@//
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [],
        '4fun' : [ 'fpFunc:Function+' ],
        '4nul' : [ 'fpFunc:Null' ],
        'for_function_number' : [ 'fpFunc:Function+', 'nLimit:Numeric'],
        'for_null_number' : [ 'fpFunc:Null', 'nLimit:Numeric' ]
    },"$Element#parent");
    
    var e = this._element;
    
    switch(oArgs+""){
        case "4voi":
            return e.parentNode?jindo.$Element(e.parentNode):null;
        case "4fun":
        case "4nul":
             limit = -1;
             break;
        case "for_function_number":
        case "for_null_number":
            if(oArgs.nLimit==0)limit = -1; 
    }

    var a = [], p = null;

    while(e.parentNode && limit-- != 0) {
        try {
            p = jindo.$Element(e.parentNode);
        } catch(err) {
            p = null;
        }

        if (e.parentNode == document.documentElement) break;
        if (!pFunc || (pFunc && pFunc.call(this,p))) a[a.length] = p;

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
    //-@@$Element.child-@@//
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [],
        '4fun' : [ 'fpFunc:Function+' ],
        '4nul' : [ 'fpFunc:Null' ],
        'for_function_number' : [ 'fpFunc:Function+', 'nLimit:Numeric'],
        'for_null_number' : [ 'fpFunc:Null', 'nLimit:Numeric' ]
    },"$Element#child");
    var e = this._element;
    var a = [], c = null, f = null;
    
    switch(oArgs+"") {
        case "4voi":
            var child = e.childNodes;
            var filtered = [];

            for(var  i = 0, l = child.length; i < l; i++) {
                if(child[i].nodeType == 1) {
                    try {
                        filtered.push(jindo.$Element(child[i]));
                    } catch(err) {
                        filtered.push(null);
                    }
                }
            }
            return filtered;
        case "4fun":
        case "4nul":
             limit = -1;
             break;
        case "for_function_number":
        case "for_null_number":
            if(oArgs.nLimit==0)limit = -1; 
            
    }

    (f = function(el, lim, context){
        var ch = null, o = null;

        for(var i=0; i < el.childNodes.length; i++) {
            ch = el.childNodes[i];
            if (ch.nodeType != 1) continue;
            try {
                o = jindo.$Element(el.childNodes[i]);
            } catch(e) {
                o = null;
            }

            if (!pFunc || (pFunc && pFunc.call(context,o))) a[a.length] = o;
            if (lim != 0) f(el.childNodes[i], lim-1);
        }
    })(e, limit-1,this);

    return a;
};
//-!jindo.$Element.prototype.child end!-//

//-!jindo.$Element.prototype.prev start!-//
/**
 {{prev}}
 */
jindo.$Element.prototype.prev = function(pFunc) {
    //-@@$Element.prev-@@//
    
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [],
        '4fun' : [ 'fpFunc:Function+' ],
        '4nul' : [ 'fpFunc:Null' ]
    },"$Element#prev");
    
    var e = this._element;
    var a = [];
    
    switch(oArgs+""){
        case "4voi":
            if (!e) return null;
            do {
                
                e = e.previousSibling;
                if (!e || e.nodeType != 1) continue;
                try{
                    if(e==null) return null;
                    return jindo.$Element(e);   
                }catch(e){
                    return null;
                }
            } while(e);
            try{
                if(e==null) return null;
                return jindo.$Element(e);   
            }catch(e){
                return null;
            }
            // 'break' statement was intentionally omitted.
        case "4fun":
        case "4nul":
            if (!e) return a;
            do {
                e = e.previousSibling;
                
                if (!e || e.nodeType != 1) continue;
                if (!pFunc||pFunc.call(this,e)) {
                    
                    try{
                        if(e==null) a[a.length]=null;
                        else a[a.length] = jindo.$Element(e);
                    }catch(e){
                        a[a.length] = null;
                    }
                     
                }
            } while(e);
            try{
                return a;   
            }catch(e){
                return null;
            }
    }
};
//-!jindo.$Element.prototype.prev end!-//

//-!jindo.$Element.prototype.next start!-//
/**
 {{next}}
 */
jindo.$Element.prototype.next = function(pFunc) {
    //-@@$Element.next-@@//
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [],
        '4fun' : [ 'fpFunc:Function+' ],
        '4nul' : [ 'fpFunc:Null' ]
    },"$Element#next");
    var e = this._element;
    var a = [];
    
    switch(oArgs+""){
        case "4voi":
            if (!e) return null;
            do {
                e = e.nextSibling;
                if (!e || e.nodeType != 1) continue;
                try{
                    if(e==null) return null;
                    return jindo.$Element(e);   
                }catch(e){
                    return null;
                }
            } while(e);
            try{
                if(e==null) return null;
                return jindo.$Element(e);   
            }catch(e){
                return null;
            }
            // 'break' statement was intentionally omitted.
        case "4fun":
        case "4nul":
            if (!e) return a;
            do {
                e = e.nextSibling;
                
                if (!e || e.nodeType != 1) continue;
                if (!pFunc||pFunc.call(this,e)) {
                    
                    try{
                        if(e==null) a[a.length] = null;
                        else a[a.length] = jindo.$Element(e);
                    }catch(e){
                        a[a.length] = null;
                    }
                     
                }
            } while(e);
            try{
                return a;   
            }catch(e){
                return null;
            }
            
    }
};
//-!jindo.$Element.prototype.next end!-//

//-!jindo.$Element.prototype.first start!-//
/**
 {{first}}
 */
jindo.$Element.prototype.first = function() {
    //-@@$Element.first-@@//
    var el = this._element.firstElementChild||this._element.firstChild;
    if (!el) return null;
    while(el && el.nodeType != 1) el = el.nextSibling;
    try{
        return el?jindo.$Element(el):null;
    }catch(e){
        return null;
    }
};
//-!jindo.$Element.prototype.first end!-//

//-!jindo.$Element.prototype.last start!-//
/**
 {{last}}
 */
jindo.$Element.prototype.last = function() {
    //-@@$Element.last-@@//
    var el = this._element.lastElementChild||this._element.lastChild;
    if (!el) return null;
    while(el && el.nodeType != 1) el = el.previousSibling;

    try{
        return el?jindo.$Element(el):null;
    }catch(e){
        return null;
    }
};
//-!jindo.$Element.prototype.last end!-//

//-!jindo.$Element._contain.hidden start!-//
/**
 {{sign_contain}}
 */
jindo.$Element._contain = function(eParent,eChild){
    if (document.compareDocumentPosition) {
        return !!(eParent.compareDocumentPosition(eChild)&16);
    }else{
        var e  = eParent;
        var el = eChild;

        while(e && e.parentNode) {
            e = e.parentNode;
            if (e == el) return true;
        }
        return false;
    }
};
//-!jindo.$Element._contain.hidden end!-//

//-!jindo.$Element.prototype.isChildOf start(jindo.$Element._contain)!-//
/**
 {{isChildOf}}
 */
jindo.$Element.prototype.isChildOf = function(element) {
    //-@@$Element.isChildOf-@@//
    try{
        return jindo.$Element._contain(jindo.$Element(element)._element,this._element);
    }catch(e){
        return false;
    }
};
//-!jindo.$Element.prototype.isChildOf end!-//

//-!jindo.$Element.prototype.isParentOf start(jindo.$Element._contain)!-//
/**
 {{isParentOf}}
 */
jindo.$Element.prototype.isParentOf = function(element) {
    //-@@$Element.isParentOf-@@//
    try{
        return jindo.$Element._contain(this._element, jindo.$Element(element)._element);
    }catch(e){
        return false;
    }
};
//-!jindo.$Element.prototype.isParentOf end!-//

//-!jindo.$Element.prototype.isEqual start!-//
/**
 {{isEqual}}
 */
jindo.$Element.prototype.isEqual = function(element) {
    //-@@$Element.isEqual-@@//
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

jindo._p_.fireCustomEvent = function(ele, sEvent,self,bIsNormalType){
    var oInfo = jindo._p_.normalCustomEvent[sEvent];
    var targetEle,oEvent;
    for(var i in oInfo){
        oEvent = oInfo[i];
        targetEle = oEvent.ele;
        var wrap_listener;
        for(var sCssquery in oEvent){
            if(sCssquery==="_NONE_"){
                if(targetEle==ele || self.isChildOf(targetEle)){
                    wrap_listener = oEvent[sCssquery].wrap_listener;
                    for(var k = 0, l = wrap_listener.length; k < l;k++){
                        wrap_listener[k]();
                    }
                }
            }else{
                if(jindo.$Element.eventManager.containsElement(targetEle, ele, sCssquery,false)){
                    wrap_listener = oEvent[sCssquery].wrap_listener;
                    for(var k = 0, l = wrap_listener.length; k < l;k++){
                        wrap_listener[k]();
                    }
                }
            }
        }
    }
};
    
jindo.$Element.prototype.fireEvent = function(sEvent, oProps) {
    //-@@$Element.fireEvent-@@//
    var oArgs = g_checkVarType(arguments, {
            '4str' : [ jindo.$Jindo._F('sEvent:String+') ],
            '4obj' : [ 'sEvent:String+', 'oProps:Hash+' ]
    },"$Element#fireEvent");
    var ele = this._element;
    
    var oldEvent = sEvent;
    sEvent = jindo.$Element.eventManager.revisionEvent("",sEvent,sEvent);
    if(jindo._p_.normalCustomEvent[sEvent]){
        jindo._p_.fireCustomEvent(ele,sEvent,this,!!jindo._p_.normalCustomEvent[sEvent]);
        return this;
    }
    
    var sType = "HTMLEvents";
    sEvent = (sEvent+"").toLowerCase();
    

    if (sEvent == "click" || sEvent.indexOf("mouse") == 0) {
        sType = "MouseEvent";
    } else if(oldEvent.indexOf("wheel") > 0){
       sEvent = "DOMMouseScroll"; 
       sType = jindo._p_._JINDO_IS_FF?"MouseEvent":"MouseWheelEvent";  
    } else if (sEvent.indexOf("key") == 0) {
        sType = "KeyboardEvent";
    } else if (sEvent.indexOf("pointer") > 0) {
        sType = "MouseEvent";
        sEvent = oldEvent;
    }
        
    var evt;
    switch (oArgs+"") {
        case "4obj":
            oProps = oArgs.oProps;
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
        break;
        case "4str":
            evt = document.createEvent(sType);          
            evt.initEvent(sEvent, true, true);
        
    }

    var el = this._element;
        
    // window.dispatchEvent is not exist in iOS 3.0
    if (jindo.$Jindo.isWindow(el) && /(iPhone|iPad|iPod).*OS\s+([0-9\.]+)/.test(jindo._p_._j_ag) && parseFloat(RegExp.$2) < 4) {
        el = el.document;
    }
        
    el.dispatchEvent(evt);

    return this;
};
//-!jindo.$Element.prototype.fireEvent end!-//

//-!jindo.$Element.prototype.empty start(jindo.$Element.prototype.html)!-//
/**
 {{empty_1}}
 */
jindo.$Element.prototype.empty = function() {
    //-@@$Element.empty-@@//
    if(jindo.cssquery) jindo.cssquery.release();
    this.html("");
    return this;
};
//-!jindo.$Element.prototype.empty end!-//

//-!jindo.$Element.prototype.remove start(jindo.$Element.prototype.leave, jindo.$Element._common)!-//
/**
 {{remove}}
 */
jindo.$Element.prototype.remove = function(oChild) {
    //-@@$Element.remove-@@//
    if(jindo.cssquery) jindo.cssquery.release();
    var ___element = jindo.$Element;
    ___element(___element._common(oChild,"remove")).leave();
    return this;
};
//-!jindo.$Element.prototype.remove end!-//

//-!jindo.$Element.prototype.leave start(jindo.$Element.event_etc)!-//
/**
 {{leave}}
 */
jindo.$Element.prototype.leave = function() {
    //-@@$Element.leave-@@//
    var e = this._element;

    if (e.parentNode) {
        if(jindo.cssquery) jindo.cssquery.release();
        e.parentNode.removeChild(e);
    }
    
    /*if(this._element.__jindo__id){
        jindo.$Element.eventManager.cleanUpUsingKey(this._element.__jindo__id,true);
    }

    jindo._p_.releaseEventHandlerForAllChildren(this);*/
    
    return this;
};
//-!jindo.$Element.prototype.leave end!-//

//-!jindo.$Element.prototype.wrap start(jindo.$Element._common)!-//
/**
 {{wrap}}
 */
jindo.$Element.prototype.wrap = function(wrapper) {
    //-@@$Element.wrap-@@//
    var e = this._element;
    wrapper = jindo.$Element._common(wrapper,"wrap");
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
    //-@@$Element.ellipsis-@@//
    
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [ ],
        '4str' : [ 'stringTail:String+' ]
    },"$Element#ellipsis");
    
    stringTail = stringTail || "...";
    var txt   = this.text();
    var len   = txt.length;
    var padding = parseInt(this._getCss(this._element,"paddingTop"),10) + parseInt(this._getCss(this._element,"paddingBottom"),10);
    var cur_h = this._element.offsetHeight - padding;
    var i     = 0;
    var h     = this.text('A')._element.offsetHeight - padding;

    if (cur_h < h * 1.5) {
        this.text(txt);
        return this;
    }

    cur_h = h;
    while(cur_h < h * 1.5) {
        i += Math.max(Math.ceil((len - i)/2), 1);
        cur_h = this.text(txt.substring(0,i)+stringTail)._element.offsetHeight - padding;
    }

    while(cur_h > h * 1.5) {
        i--;
        cur_h = this.text(txt.substring(0,i)+stringTail)._element.offsetHeight - padding;
    }
    return this;
};
//-!jindo.$Element.prototype.ellipsis end!-//

//-!jindo.$Element.prototype.indexOf start!-//
/**
 {{indexOf}}
 */
jindo.$Element.prototype.indexOf = function(element) {
    //-@@$Element.indexOf-@@//
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
    //-@@$Element.queryAll-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str'  : [ 'sSelector:String+']
    },"$Element#queryAll");
    
    var arrEle = jindo.cssquery(sSelector, this._element);
    var returnArr = [];
    for(var i = 0, l = arrEle.length; i < l; i++){
        returnArr.push(jindo.$Element(arrEle[i]));
    }
    return returnArr; 
};
//-!jindo.$Element.prototype.queryAll end!-//

//-!jindo.$Element.prototype.query start(jindo.cssquery)!-//
/**
 {{query}}
 */
jindo.$Element.prototype.query = function(sSelector) { 
    //-@@$Element.query-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str'  : [ 'sSelector:String+']
    },"$Element#query");
    var ele =  jindo.cssquery.getSingle(sSelector, this._element);
    return ele === null? ele : jindo.$Element(ele); 
};
//-!jindo.$Element.prototype.query end!-//

//-!jindo.$Element.prototype.test start(jindo.cssquery)!-//
/**
 {{test}}
 */
jindo.$Element.prototype.test = function(sSelector) {
    //-@@$Element.test-@@// 
    var oArgs = g_checkVarType(arguments, {
        '4str'  : [ 'sSelector:String+']
    },"$Element#test");
    return jindo.cssquery.test(this._element, sSelector); 
};
//-!jindo.$Element.prototype.test end!-//

//-!jindo.$Element.prototype.xpathAll start(jindo.cssquery)!-//
/**
 {{xpathAll}}
 */
jindo.$Element.prototype.xpathAll = function(sXPath) {
    //-@@$Element.xpathAll-@@// 
    var oArgs = g_checkVarType(arguments, {
        '4str'  : [ 'sXPath:String+']
    },"$Element#xpathAll");
    var arrEle = jindo.cssquery.xpath(sXPath, this._element);
    var returnArr = [];
    for(var i = 0, l = arrEle.length; i < l; i++){
        returnArr.push(jindo.$Element(arrEle[i]));
    }
    return returnArr; 
};
//-!jindo.$Element.prototype.xpathAll end!-//

//-!jindo.$Element.prototype.insertAdjacentHTML.hidden start!-//
/**
 {{insertAdjacentHTML}}
 */
jindo.$Element.insertAdjacentHTML = function(ins,html,insertType,type,fn,sType){
    var aArg = [ html ];
    aArg.callee = arguments.callee;
    var oArgs = g_checkVarType(aArg, {
        '4str'  : [ 'sHTML:String+' ]
    },"$Element#"+sType);
    var _ele = ins._element;
    html = html+"";
    if( _ele.insertAdjacentHTML && !(/^<(option|tr|td|th|col)(?:.*?)>/.test(jindo._p_.trim(html).toLowerCase()))){
        _ele.insertAdjacentHTML(insertType, html);
    }else{
        var oDoc = _ele.ownerDocument || _ele.document || document;
        var fragment = oDoc.createDocumentFragment();
        var defaultElement;
        var sTag = jindo._p_.trim(html);
        var oParentTag = {
            "option" : "select",
            "tr" : "tbody",
            "thead" : "table",
            "tbody" : "table",
            "col" : "table",
            "td" : "tr",
            "th" : "tr",
            "div" : "div"
        };
        var aMatch = /^<(option|tr|thead|tbody|td|th|col)(?:.*?)\>/i.exec(sTag);
        var sChild = aMatch === null ? "div" : aMatch[1].toLowerCase();
        var sParent = oParentTag[sChild] ;
        defaultElement = jindo._p_._createEle(sParent,sTag,oDoc,true);
        var scripts = defaultElement.getElementsByTagName("script");
    
        for ( var i = 0, l = scripts.length; i < l; i++ ){
            scripts[i].parentNode.removeChild( scripts[i] );
        }
        
        if(_ele.tagName.toLowerCase() == "table" && !_ele.getElementsByTagName("tbody").length && !sTag.match(/<tbody[^>]*>/i)) {
            var elTbody = oDoc.createElement("tbody"),
                bTheadTfoot = sTag.match(/^<t(head|foot)[^>]*>/i);

            if(!bTheadTfoot) {
                fragment.appendChild(elTbody);
                fragment = elTbody;
            }
        }

        while ( defaultElement[ type ]){
            fragment.appendChild( defaultElement[ type ] );
        }

        bTheadTfoot && fragment.appendChild(elTbody);
        fn(fragment.cloneNode(true));
    }
    return ins;
};

//-!jindo.$Element.prototype.insertAdjacentHTML.hidden end!-//

//-!jindo.$Element.prototype.appendHTML start(jindo.$Element.prototype.insertAdjacentHTML)!-//
/**
 {{appendHTML}}
 */
jindo.$Element.prototype.appendHTML = function(sHTML) {
    //-@@$Element.appendHTML-@@//
    return jindo.$Element.insertAdjacentHTML(this,sHTML,"beforeEnd","firstChild",jindo.$Fn(function(oEle) {
        var ele = this._element;

        if(ele.tagName.toLowerCase() === "table") {
            var nodes = ele.childNodes;

            for(var i=0,l=nodes.length; i < l; i++) {
                if(nodes[i].nodeType==1){
                    ele = nodes[i]; 
                    break;
                }
            }
        }
        ele.appendChild(oEle);
    },this).bind(),"appendHTML");
};
//-!jindo.$Element.prototype.appendHTML end!-//

//-!jindo.$Element.prototype.prependHTML start(jindo.$Element.prototype.insertAdjacentHTML,jindo.$Element._prepend)!-//
/**
 {{prependHTML}}
 */
jindo.$Element.prototype.prependHTML = function(sHTML) {
    //-@@$Element.prependHTML-@@//
    var ___element = jindo.$Element;

    return ___element.insertAdjacentHTML(this,sHTML,"afterBegin","firstChild",jindo.$Fn(function(oEle) {
        var ele = this._element;

        if(ele.tagName.toLowerCase() === "table") {
            var nodes = ele.childNodes;

            for(var i=0,l=nodes.length; i < l; i++) {
                if(nodes[i].nodeType==1) {
                    ele = nodes[i]; 
                    break;
                }
            }
        }
        ___element._prepend(ele,oEle);
    },this).bind(),"prependHTML");
};
//-!jindo.$Element.prototype.prependHTML end!-//

//-!jindo.$Element.prototype.beforeHTML start(jindo.$Element.prototype.insertAdjacentHTML)!-//
/**
 {{beforeHTML}}
 */
jindo.$Element.prototype.beforeHTML = function(sHTML) {
    //-@@$Element.beforeHTML-@@//
    return jindo.$Element.insertAdjacentHTML(this,sHTML,"beforeBegin","firstChild",jindo.$Fn(function(oEle){
        this._element.parentNode.insertBefore(oEle, this._element);
    },this).bind(),"beforeHTML");
};
//-!jindo.$Element.prototype.beforeHTML end!-//

//-!jindo.$Element.prototype.afterHTML start(jindo.$Element.prototype.insertAdjacentHTML)!-//
/**
 {{afterHTML}}
 */
jindo.$Element.prototype.afterHTML = function(sHTML) {
    //-@@$Element.afterHTML-@@//
    return jindo.$Element.insertAdjacentHTML(this,sHTML,"afterEnd","firstChild",jindo.$Fn(function(oEle){
        this._element.parentNode.insertBefore( oEle, this._element.nextSibling );
    },this).bind(),"afterHTML");
};
//-!jindo.$Element.prototype.afterHTML end!-//

//-!jindo.$Element.prototype.hasEventListener start(jindo.$Element.prototype.attach)!-//
/**
{{hasEventListener}}
 */
jindo.$Element.prototype.hasEventListener = function(sEvent){

    var oArgs = g_checkVarType(arguments, {
        '4str' : [ 'sEvent:String+' ]
    },"$Element#hasEventListener"),
        oDoc,
        bHasEvent = false,
        sLowerCaseEvent = oArgs.sEvent.toLowerCase();
    
    if(this._key){
        oDoc = this._element.ownerDocument || this._element.document || document;
        
        if(sLowerCaseEvent == "load" && this._element === oDoc){
            bHasEvent = jindo.$Element(window).hasEventListener(oArgs.sEvent);
        }else if(sLowerCaseEvent == "domready" && jindo.$Jindo.isWindow(this._element)){
            bHasEvent = jindo.$Element(oDoc).hasEventListener(oArgs.sEvent);
        }else{
            var realEvent = jindo.$Element.eventManager.revisionEvent("", sEvent);
            bHasEvent = !!jindo.$Element.eventManager.hasEvent(this._key, realEvent, oArgs.sEvent);
        }
        
        return bHasEvent;
    }
    
    return false;
};
//-!jindo.$Element.prototype.hasEventListener end!-//

//-!jindo.$Element.prototype.preventTapHighlight start(jindo.$Element.prototype.addClass, jindo.$Element.prototype.removeClass)!-//
/**
{{preventTapHighlight}}
 */
jindo.$Element.prototype.preventTapHighlight = function(bFlag){
    if(jindo._p_._JINDO_IS_MO){
        var sClassName = 'no_tap_highlight' + new Date().getTime();
        
        var elStyleTag = document.createElement('style');
        var elHTML = document.getElementsByTagName('html')[0];
        
        elStyleTag.type = "text/css";
        
        elHTML.insertBefore(elStyleTag, elHTML.firstChild);
        var oSheet = elStyleTag.sheet || elStyleTag.styleSheet;


 
        oSheet.insertRule('.' + sClassName + ' { -webkit-tap-highlight-color: rgba(0,0,0,0); }', 0);
        oSheet.insertRule('.' + sClassName + ' * { -webkit-tap-highlight-color: rgba(0,0,0,.25); }', 0);
        
        jindo.$Element.prototype.preventTapHighlight = function(bFlag) {
            return this[bFlag ? 'addClass' : 'removeClass'](sClassName);
        };
    }else{
        jindo.$Element.prototype.preventTapHighlight = function(bFlag) { return this; };
    }
    return this.preventTapHighlight.apply(this,jindo._p_._toArray(arguments));
};
//-!jindo.$Element.prototype.preventTapHighlight end!-//


//-!jindo.$Element.prototype.data start(jindo.$Json._oldToString)!-//
/**
 {{data}}
 */
/**
 {{data2}}
 */
jindo.$Element.prototype.data = function(sKey, vValue) {
    var oType ={ 
        'g'  : ["sKey:String+"],
        's4var' : ["sKey:String+", "vValue:Variant"],
        's4obj' : ["oObj:Hash+"]
    };
    var jindoKey = "_jindo";
    function toCamelCase(name){
        return name.replace(/\-(.)/g,function(_,a){
            return a.toUpperCase();
        });
    }
    function toDash(name){
        return name.replace(/[A-Z]/g,function(a){
            return "-"+a.toLowerCase();
        });
    }
    if(document.body.dataset){
        jindo.$Element.prototype.data = function(sKey, vValue) {
            var sToStr, oArgs = g_checkVarType(arguments, oType ,"$Element#data");
            var  isNull = jindo.$Jindo.isNull;
            
            switch(oArgs+""){
                case "g":
                    sKey = toCamelCase(sKey);
                    var isMakeFromJindo = this._element.dataset[sKey+jindoKey];
                    var sDateSet = this._element.dataset[sKey];
                    if(sDateSet){
                        if(isMakeFromJindo){
                            return window.JSON.parse(sDateSet);
                        }
                        return sDateSet;
                    }
                    return null;
                    // 'break' statement was intentionally omitted.
                case "s4var":
                    var oData;
                    if(isNull(vValue)){
                        sKey = toCamelCase(sKey);
                        delete this._element.dataset[sKey];
                        delete this._element.dataset[sKey+jindoKey];
                        return this;
                    }else{
                        oData = {};
                        oData[sKey] = vValue;
                        sKey = oData;   
                    }
                    // 'break' statement was intentionally omitted.
                case "s4obj":
                    var sChange;
                    for(var i in sKey){
                        sChange = toCamelCase(i);
                        if(isNull(sKey[i])){
                            delete this._element.dataset[sChange];
                            delete this._element.dataset[sChange+jindoKey];
                        }else{
                            sToStr = jindo.$Json._oldToString(sKey[i]);
                            if(sToStr!=null){
                                this._element.dataset[sChange] = sToStr;
                                this._element.dataset[sChange+jindoKey] = "jindo";  
                            }
                        }
                    }
                    return this;
            }
        };
    }else{
        jindo.$Element.prototype.data = function(sKey, vValue) {
            var sToStr, oArgs = g_checkVarType(arguments, oType ,"$Element#data");
            var  isNull = jindo.$Jindo.isNull;
            switch(oArgs+""){
                case "g":
                    sKey = toDash(sKey);
                    var isMakeFromJindo = this._element.getAttribute("data-"+sKey+jindoKey);
                    var sVal = this._element.getAttribute("data-"+sKey);
                    
                    if(isMakeFromJindo){
                        return (sVal!=null)? eval("("+sVal+")") : null;
                    }else{
                        return sVal;
                    }
                    // 'break' statement was intentionally omitted.
                case "s4var":
                    var oData;
                    if(isNull(vValue)){
                        sKey = toDash(sKey);
                        this._element.removeAttribute("data-"+sKey);
                        this._element.removeAttribute("data-"+sKey+jindoKey);
                        return this;
                    }else{
                        oData = {};
                        oData[sKey] = vValue;
                        sKey = oData;   
                    }
                    // 'break' statement was intentionally omitted.
                case "s4obj":
                    var sChange;
                    for(var i in sKey){
                        sChange = toDash(i);
                        if(isNull(sKey[i])){
                            this._element.removeAttribute("data-"+sChange);
                            this._element.removeAttribute("data-"+sChange+jindoKey);
                        }else{
                            sToStr = jindo.$Json._oldToString(sKey[i]);
                            if(sToStr!=null){
                                this._element.setAttribute("data-"+sChange, sToStr);
                                this._element.setAttribute("data-"+sChange+jindoKey, "jindo");
                            }
                        }
                    }
                    return this;
            }
        };
    }
    
    return this.data.apply(this, jindo._p_._toArray(arguments));
};
//-!jindo.$Element.prototype.data end!-//