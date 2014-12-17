/**
 {{title}}
 */
//-!jindo.$Element start(jindo.$)!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$Element = function(el) {
    //-@@$Element-@@//
    var cl = arguments.callee;
    if (el && el instanceof cl) return el;  
    
    if (!(this instanceof cl)){
        try {
            jindo.$Jindo._maxWarn(arguments.length, 1,"$Element");
            return new cl(el);
        } catch(e) {
            if (e instanceof TypeError) { return null; }
            throw e;
        }
    }   
    var cache = jindo.$Jindo;
    var oArgs = cache.checkVarType(arguments, {
        '4str' : [ 'sID:String+' ],
        '4nod' : [ 'oEle:Node' ],
        '4doc' : [ 'oEle:Document+' ],
        '4win' : [ 'oEle:Window+' ]
    },"$Element");
    switch(oArgs + ""){
        case "4str":
            el = jindo.$(el);
            break;
        default:
            el = oArgs.oEle;
    }
    
    this._element = el;
    if(this._element != null){
        if(this._element.__jindo__id){
            this._key = this._element.__jindo__id; 
        }else{
            this._element.__jindo__id = this._key = jindo._p_._makeRandom();
        }
        // tagname
        this.tag = (this._element.tagName||'').toLowerCase(); 
    }else{
        throw new TypeError("{not_found_element}");
    }

};

jindo._p_.NONE_GROUP = "_jindo_event_none";
jindo._p_.splitEventSelector = function(sEvent){
    var matches = sEvent.match(/^([a-z_]*)(.*)/i);
    var eventName = jindo._p_.trim(matches[1]);
    var selector = jindo._p_.trim(matches[2].replace("@",""));
    
    return {
        "type"      : selector?"delegate":"normal",
        "event"     : eventName,
        "selector"  : selector
    };
};

jindo._p_._makeRandom = function(){
    return "e"+ new Date().getTime() + parseInt(Math.random() * 100000000,10);
};

jindo._p_.releaseEventHandlerForAllChildren= function (wel){
    var children = wel._element.all || wel._element.getElementsByTagName("*"),
        nChildLength = children.length,
        elChild = null,
        i;
    
    for(i = 0; i < nChildLength; i++){
        elChild = children[i];
        
        if(elChild.nodeType == 1 && elChild.__jindo__id){
            jindo.$Element.eventManager.cleanUpUsingKey(elChild.__jindo__id, true);
        }
    }
    
    children = elChild = null;
};

jindo._p_.canUseClassList = function(){
    jindo._p_.canUseClassList = function(){
        return "classList" in document.body&&"classList" in document.createElementNS("http://www.w3.org/2000/svg", "g");    
    };
    return jindo._p_.canUseClassList();
};

jindo._p_.vendorPrefixObj = {
    "-moz" : "Moz",
    "-ms" : "ms",
    "-o" : "O",
    "-webkit" : "webkit"
};

jindo._p_.cssNameToJavaScriptName= function(sName){
    if(/^(\-(?:moz|ms|o|webkit))/.test(sName)){
        var vandorPerfix = RegExp.$1;
        sName = sName.replace(vandorPerfix,jindo._p_.vendorPrefixObj[vandorPerfix]);
    }
    
    return sName.replace(/(:?-(\w))/g,function(_,_,m){
       return m.toUpperCase();
    });
};

jindo._p_.getStyleIncludeVendorPrefix = function(_test){
    var styles = ["Transition","Transform","Animation","Perspective"];
    var vendors = ["webkit","-","Moz","O","ms"];

    // when vender prefix is not present,  the value will be taken from  prefix
    var style  = "";
    var vendor = "";
    var vendorStyle = "";
    var result = {};
    
    var styleObj = _test||document.body.style;
    for(var i = 0, l = styles.length; i < l; i++){
        style = styles[i];
        
        for(var j = 0, m = vendors.length; j < m; j++ ){
            vendor = vendors[j];
            vendorStyle = vendor!="-"?(vendor+style):style.toLowerCase(); 
            if(typeof styleObj[vendorStyle] !== "undefined"){
                result[style.toLowerCase()] = vendorStyle;
                break;
            }
            result[style.toLowerCase()] = false;
        }    
    }
    
    if(_test){
        return result;
    }
    
    jindo._p_.getStyleIncludeVendorPrefix = function(){
        return result;
    };
    
    return jindo._p_.getStyleIncludeVendorPrefix();
};

jindo._p_.getTransformStringForValue = function(_test){
    var info = jindo._p_.getStyleIncludeVendorPrefix(_test);
    var transform = info.transform ;
    if(info.transform === "MozTransform"){
        transform = "-moz-transform";
    }else if(info.transform === "webkitTransform"){
        transform = "-webkit-transform";
    }else if(info.transform === "OTransform"){
        transform = "-o-transform";
    }else if(info.transform === "msTransform"){
        transform = "-ms-transform";
    }
    
    if(_test){
        return transform;
    }
    
    jindo._p_.getTransformStringForValue = function(){
        return transform;
    };
    
    return jindo._p_.getTransformStringForValue();
};
/*
 {{disappear_1}}
 */
// To prevent blink issue on Android 4.0.4 Samsung Galaxy 2 LTE model, calculate offsetHeight first
jindo._p_.setOpacity = function(ele,val){
    ele.offsetHeight;
    ele.style.opacity = val;
};
/**
 {{sign_eventBind}}
 */
jindo.$Element._eventBind = function(oEle,sEvent,fAroundFunc,bUseCapture){
    oEle.addEventListener(sEvent, fAroundFunc, !!bUseCapture);
};

/**
 {{sign_unEventBind}}
 */
jindo.$Element._unEventBind = function(oEle,sType,fAroundFunc) {
    oEle.removeEventListener(sType,fAroundFunc,false);
};
//-!jindo.$Element end!-//

//-!jindo.$Element.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$Element.prototype.$value = function() {
    //-@@$Element.$value-@@//
    return this._element;
};
//-!jindo.$Element.prototype.$value end!-//

//-!jindo.$Element.prototype.visible start(jindo.$Element.prototype._getCss,jindo.$Element.prototype.show,jindo.$Element.prototype.hide)!-//
/**
 {{visible}}
 */
/**
 {{visible2}}
 */
jindo.$Element.prototype.visible = function(bVisible, sDisplay) {
    //-@@$Element.visible-@@//
    var oArgs = g_checkVarType(arguments, {
        'g' : [  ],
        's4bln' : [ jindo.$Jindo._F('bVisible:Boolean') ],
        's4str' : [ 'bVisible:Boolean', "sDisplay:String+"]
    },"$Element#visible");
    switch(oArgs+""){
        case "g":
            return (this._getCss(this._element,"display") != "none");
            
        case "s4bln":
            this[bVisible?"show":"hide"]();
            return this;
            
        case "s4str":
            this[bVisible?"show":"hide"](sDisplay);
            return this;
    }
};
//-!jindo.$Element.prototype.visible end!-//

//-!jindo.$Element.prototype.show start!-//
/**
 {{show}}
 */
jindo.$Element.prototype.show = function(sDisplay) {
    //-@@$Element.show-@@//
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [  ],
        '4str' : ["sDisplay:String+"]
    },"$Element#show");
    
    var s = this._element.style;
    var b = "block";
    var c = { p:b,div:b,form:b,h1:b,h2:b,h3:b,h4:b,ol:b,ul:b,fieldset:b,td:"table-cell",th:"table-cell",
              li:"list-item",table:"table",thead:"table-header-group",tbody:"table-row-group",tfoot:"table-footer-group",
              tr:"table-row",col:"table-column",colgroup:"table-column-group",caption:"table-caption",dl:b,dt:b,dd:b};
    try {
        switch(oArgs+""){
            case "4voi":
                var type = c[this.tag];
                s.display = type || "inline";
                break;
            case "4str":
                s.display = sDisplay;
                
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
    //-@@$Element.hide-@@//
    this._element.style.display = "none";

    return this;
};

//-!jindo.$Element.prototype.hide end!-//

//-!jindo.$Element.prototype.toggle start(jindo.$Element.prototype._getCss,jindo.$Element.prototype.show,jindo.$Element.prototype.hide)!-//
/**
 {{toggle}}
 */
jindo.$Element.prototype.toggle = function(sDisplay) {
    //-@@$Element.toggle-@@//
    var oArgs = g_checkVarType(arguments, {
        '4voi' : [  ],
        '4str' : ["sDisplay:String+"]
    },"$Element#toggle");
    
    this[this._getCss(this._element,"display")=="none"?"show":"hide"].apply(this,arguments);
    return this;
};
//-!jindo.$Element.prototype.toggle end!-//

//-!jindo.$Element.prototype.opacity start!-//
/**
 {{opacity}}
 */
/**
 {{opacity2}}
 */
jindo.$Element.prototype.opacity = function(value) {
    //-@@$Element.opacity-@@//
    var oArgs = g_checkVarType(arguments, {
                'g' : [  ],
                's' : ["nOpacity:Numeric"],
                'str' : ['sOpacity:String']
            },"$Element#opacity"),
        e = this._element,
        b = (this._getCss(e,"display") != "none"), v;

    switch(oArgs+""){
        case "g":
            b = (this._getCss(e,"display") != "none");
            (v = e.style.opacity).length || (v = this._getCss(e,"opacity"));
            v = parseFloat(v);
            if (isNaN(v)) v = b?1:0;
            return v;   
            
        case "s":
             /*
             {{opacity_1}}
             */
            value = oArgs.nOpacity;
            e.style.zoom = 1;
            value = Math.max(Math.min(value,1),0);
            e.style.opacity = value;
            return this;

        case "str":
             /*
             {{opacity_2}}
             */
            if(value === "") {
                e.style.zoom = e.style.opacity = "";
            }
            return this;
    }
    
};


//-!jindo.$Element.prototype.opacity end!-//

//-!jindo.$Element.prototype.css start(jindo.$Element.prototype.opacity,jindo.$Element.prototype._getCss,jindo.$Element.prototype._setCss)!-//
/**
 {{css}}
 */

/**
 {{css2}}
 */

/**
 {{hook}}
 */

/**
 {{hook2}}
 */
jindo._p_._revisionCSSAttr = function(name,vendorPrefix){
    var custumName = jindo.$Element.hook(name);
    if(custumName){
        name = custumName;
    }else{
        name = jindo._p_.cssNameToJavaScriptName(name).replace(/^(animation|perspective|transform|transition)/i,function(_1){
            return vendorPrefix[_1.toLowerCase()];
        });
    }
    return name;
};

jindo._p_.changeTransformValue = function(name,_test){
    return  (name+"").replace(/([\s|-]*)(?:transform)/,function(_,m1){ 
        return jindo._p_.trim(m1).length > 0 ? _ : m1+jindo._p_.getTransformStringForValue(_test);
    });
};


jindo.$Element.prototype.css = function(sName, sValue) {
    //-@@$Element.css-@@//
    
    var oArgs = g_checkVarType(arguments, {
        'g'     : [ 'sName:String+'],
        's4str' : [ jindo.$Jindo._F('sName:String+'), jindo.$Jindo._F('vValue:String+') ],
        's4num' : [ 'sName:String+', 'vValue:Numeric' ],
        's4obj' : [ 'oObj:Hash+']
    },"$Element#css");
    
    var e = this._element;
    switch(oArgs+"") {
        case 's4str':
        case 's4num':
            var obj = {};
            sName = jindo._p_._revisionCSSAttr(sName,jindo._p_.getStyleIncludeVendorPrefix());
            obj[sName] = sValue;
            sName = obj;
            break;
        case 's4obj':
            sName = oArgs.oObj;
            var obj = {};
            var vendorPrefix = jindo._p_.getStyleIncludeVendorPrefix();
            for (var i in sName) if (sName.hasOwnProperty(i)){
                obj[jindo._p_._revisionCSSAttr(i,vendorPrefix)] = sName[i]; 
            }
            sName = obj;
            break;
        case 'g':
            var vendorPrefix = jindo._p_.getStyleIncludeVendorPrefix();
            sName = jindo._p_._revisionCSSAttr(sName,vendorPrefix);
            var _getCss = this._getCss;
            if(sName == "opacity"){
                return this.opacity();
            }
            if (sName=="padding"||sName=="margin") {
                var top     = _getCss(e, sName+"Top");
                var right   = _getCss(e, sName+"Right");
                var bottom  = _getCss(e, sName+"Bottom");
                var left    = _getCss(e, sName+"Left");
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
    var v, type;

    for(var k in sName) {
        if(sName.hasOwnProperty(k)){
            v    = sName[k];
            if (!(jindo.$Jindo.isString(v)||jindo.$Jindo.isNumeric(v))) continue;
            if (k == 'opacity') {
                this.opacity(v);
                continue;
            }
            if( k =="backgroundPositionX" || k == "backgroundPositionY"){
                var bp = this.css("backgroundPosition").split(/\s+/);
                v = k == "backgroundPositionX" ? v+" "+bp[1] : bp[0]+" "+v;
                this._setCss(e, "backgroundPosition", v);
            }else{
                this._setCss(e, k, /transition/i.test(k) ? jindo._p_.changeTransformValue(v):v);
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
    try{
        if (sName == "cssFloat") sName = "float";
        var d = e.ownerDocument || e.document || document;
        var sVal = e.style[sName];
        if(!e.style[sName]){
            var computedStyle = d.defaultView.getComputedStyle(e,null);
            sName = sName.replace(/([A-Z])/g,"-$1").replace(/^(webkit|ms)/g,"-$1").toLowerCase();
            sVal =  computedStyle.getPropertyValue(sName);
            sVal =  sVal===undefined?computedStyle[sName]:sVal;
        }
        if (sName == "textDecoration") sVal = sVal.replace(",","");
        return sVal;
    }catch(ex){
        throw new jindo.$Error((e.tagName||"document") + jindo.$Except.NOT_USE_CSS,"$Element#css");
    }
    
};
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
};
//-!jindo.$Element.prototype._setCss.hidden end!-//

//-!jindo.$Element.prototype.attr start!-//
/**
 {{attr}}
 */
/**
 {{attr2}}
 */
jindo.$Element.prototype.attr = function(sName, sValue) {
    //-@@$Element.attr-@@//
    var oArgs = g_checkVarType(arguments, {
        'g'     : [ 'sName:String+'],
        's4str' : [ 'sName:String+', 'vValue:String+' ],
        's4num' : [ 'sName:String+', 'vValue:Numeric' ],
        's4nul' : [ 'sName:String+', 'vValue:Null' ],
        's4bln' : [ 'sName:String+', 'vValue:Boolean' ],
        's4arr' : [ 'sName:String+', 'vValue:Array+' ],
        's4obj' : [ jindo.$Jindo._F('oObj:Hash+')]
    },"$Element#attr");
    
    var e = this._element,
        aValue = null,
        i,
        length,
        nIndex,
        fGetIndex,
        elOption,
        wa;
    
    switch(oArgs+""){
        case "s4str":
        case "s4nul":
        case "s4num":
        case "s4bln":
        case "s4arr":
            var obj = {};
            obj[sName] = sValue;
            sName = obj;
            break;
        case "s4obj":
            sName = oArgs.oObj;
            break;
        case "g":
            if (sName == "class" || sName == "className"){ 
                return e.className;
            }else if(sName == "style"){
                return e.style.cssText;
            }else if(sName == "checked"||sName == "disabled"){
                return !!e[sName];
            }else if(sName == "value"){
                if(this.tag == "button"){
                    return e.getAttributeNode('value').value;
                }else if(this.tag == "select"){
                    if(e.multiple){
                        for(i = 0, length = e.options.length; i < length; i++){
                            elOption = e.options[i];
                            
                            if(elOption.selected){
                                if(!aValue){
                                    aValue = [];
                                }
                                
                                sValue = elOption.value;
                                
                                if(sValue == ""){
                                    sValue = elOption.text;
                                }
                                
                                aValue.push(sValue);
                            }
                        }
                        return aValue;
                    }else{
                        if(e.selectedIndex < 0){
                            return null;
                        }
                        
                        sValue = e.options[e.selectedIndex].value;
                        return (sValue == "") ? e.options[e.selectedIndex].text : sValue;
                    }
                }else{
                    return e.value;
                }
            }else if(sName == "href"){
                return e.getAttribute(sName,2);
            }
            return e.getAttribute(sName);
            
    }
    
    fGetIndex = function(oOPtions, vValue){
        var nIndex = -1,
            i,
            length,
            elOption;
        
        for(i = 0, length = oOPtions.length; i < length; i++){
            elOption = oOPtions[i];
            if(elOption.value === vValue || elOption.text === vValue){
                nIndex = i;
                break;
            }
        }
        
        return nIndex;
    };
    
    for(var k in sName) {
        if(sName.hasOwnProperty(k)){
            var v = sName[k];
            if (jindo.$Jindo.isNull(v)) {
                if(this.tag == "select"){
                    if(e.multiple){
                        for(i = 0, length = e.options.length; i < length; i++){
                            e.options[i].selected = false;
                        }
                    }else{
                        e.selectedIndex = -1;
                    }
                }else{
                    e.removeAttribute(k);
                }
            }else{
                if (k == "class"|| k == "className") { 
                    e.className = v;
                }else if(k == "style"){
                    e.style.cssText = v;
                }else if(k == "checked"||k == "disabled"){
                    e[k] = v;
                }else if(k == "value"){
                    if(this.tag == "select"){
                        if(e.multiple){
                            if(jindo.$Jindo.isArray(v)){
                                wa = jindo.$A(v);
                                for(i = 0, length = e.options.length; i < length; i++){
                                    elOption = e.options[i];
                                    elOption.selected = wa.has(elOption.value) || wa.has(elOption.text);
                                }
                            }else{
                                e.selectedIndex = fGetIndex(e.options, v);
                            }
                        }else{
                            e.selectedIndex = fGetIndex(e.options, v);
                        }
                    }else{
                        e.value = v;
                    }
                }else{
                    e.setAttribute(k, v);
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
/**
 {{width2}}
 */
jindo.$Element.prototype.width = function(width) {
    //-@@$Element.width-@@//
    var oArgs = g_checkVarType(arguments, {
        'g' : [  ],
        's' : ["nWidth:Numeric"]
    },"$Element#width");
    
    switch(oArgs+""){
        case "g" :
            
            return this._element.offsetWidth;
            
        case "s" :
            
            width = oArgs.nWidth;
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

};
//-!jindo.$Element.prototype.width end!-//

//-!jindo.$Element.prototype.height start!-//
/**
 {{height}}
 */
/**
 {{height2}}
 */
jindo.$Element.prototype.height = function(height) {
    //-@@$Element.height-@@//
    var oArgs = g_checkVarType(arguments, {
        'g' : [  ],
        's' : ["nHeight:Numeric"]
    },"$Element#height");
    
    switch(oArgs+""){
        case "g" :
            return this._element.offsetHeight;
            
        case "s" :
            height = oArgs.nHeight;
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
};
//-!jindo.$Element.prototype.height end!-//

//-!jindo.$Element.prototype.className start!-//
/**
 {{className}}
 */
/**
 {{className2}}
 */
jindo.$Element.prototype.className = function(sClass) {
    //-@@$Element.className-@@//
    var oArgs = g_checkVarType(arguments, {
        'g' : [  ],
        's' : [jindo.$Jindo._F("sClass:String+")]
    },"$Element#className");
    var e = this._element;
    switch(oArgs+"") {
        case "g":
            return e.className;
        case "s":
            e.className = sClass;
            return this;
            
    }

};
//-!jindo.$Element.prototype.className end!-//

//-!jindo.$Element.prototype.hasClass start!-//
/**
 {{hasClass}}
 */
jindo.$Element.prototype.hasClass = function(sClass) {
    //-@@$Element.hasClass-@@//
    var ___checkVarType = g_checkVarType;

    if(jindo._p_.canUseClassList()){
        jindo.$Element.prototype.hasClass = function(sClass){
            var oArgs = ___checkVarType(arguments, {
                '4str' : ["sClass:String+"]
            },"$Element#hasClass");
            return this._element.classList.contains(sClass);
        };
    } else {
        jindo.$Element.prototype.hasClass = function(sClass){
            var oArgs = ___checkVarType(arguments, {
                '4str' : ["sClass:String+"]
            },"$Element#hasClass");
            return (" "+this._element.className+" ").indexOf(" "+sClass+" ") > -1;
        };
    }
    return this.hasClass.apply(this,arguments);
};
//-!jindo.$Element.prototype.hasClass end!-//

//-!jindo.$Element.prototype.addClass start!-//
/**
 {{addClass}}
 */
jindo.$Element.prototype.addClass = function(sClass) {
    //-@@$Element.addClass-@@//
    if(this._element.classList) {
        jindo.$Element.prototype.addClass = function(sClass) {
            if(this._element==null) return this;
            var oArgs = g_checkVarType(arguments, {
                '4str' : ["sClass:String+"]
            },"$Element#addClass");
         
            var aClass = (sClass+"").split(/\s+/);
            var flistApi = this._element.classList;
            for(var i = aClass.length ; i-- ;) {
                aClass[i]!=""&&flistApi.add(aClass[i]);
            }
            return this;
        };
    } else {
        jindo.$Element.prototype.addClass = function(sClass) {
            var oArgs = g_checkVarType(arguments, {
                '4str' : ["sClass:String+"]
            },"$Element#addClass");
            var e = this._element;
            var sClassName = e.className;
            var aClass = (sClass+"").split(" ");
            var sEachClass;
            for (var i = aClass.length - 1; i >= 0 ; i--) {
                sEachClass = aClass[i];
                if ((" "+sClassName+" ").indexOf(" "+sEachClass+" ") == -1) {
                    sClassName = sClassName+" "+sEachClass;
                }
            }
            e.className = sClassName.replace(/\s+$/, "").replace(/^\s+/, "");
            return this;
        };
    }
    return this.addClass.apply(this,arguments);
};
//-!jindo.$Element.prototype.addClass end!-//

//-!jindo.$Element.prototype.removeClass start!-//
/**
 {{removeClass}} 
 */
jindo.$Element.prototype.removeClass = function(sClass) {
 //-@@$Element.removeClass-@@//
    if(this._element.classList) {
        jindo.$Element.prototype.removeClass = function(sClass){
            var oArgs = g_checkVarType(arguments, {
             '4str' : ["sClass:String+"]
            },"$Element#removeClass");
            if(this._element==null) return this;
            var flistApi = this._element.classList;
            var aClass = (sClass+"").split(" ");
            for(var i = aClass.length ; i-- ;){
                aClass[i]!=""&&flistApi.remove(aClass[i]);
            }
            return this;
        };
    } else {
        jindo.$Element.prototype.removeClass = function(sClass) {
            var oArgs = g_checkVarType(arguments, {
                '4str' : ["sClass:String+"]
            },"$Element#removeClass");
            var e = this._element;
            var sClassName = e.className;
            var aClass = (sClass+"").split(" ");
            var sEachClass;

            for (var i = aClass.length - 1; i >= 0; i--){
                if(/\W/g.test(aClass[i])) {
                    aClass[i] = aClass[i].replace(/(\W)/g,"\\$1");
                }

                sClassName = (" "+sClassName+" ").replace(new RegExp("\\s+"+ aClass[i] +"(?=\\s+)","g")," ");
            }
            
            e.className = sClassName.replace(/\s+$/, "").replace(/^\s+/, "");

            return this;
        };
    }
    return this.removeClass.apply(this,arguments);
};
//-!jindo.$Element.prototype.removeClass end!-//

//-!jindo.$Element.prototype.toggleClass start(jindo.$Element.prototype.addClass,jindo.$Element.prototype.removeClass,jindo.$Element.prototype.hasClass)!-//
/**
 {{toggleClass}} 
 */
jindo.$Element.prototype.toggleClass = function(sClass, sClass2) {
    //-@@$Element.toggleClass-@@//
    var ___checkVarType = g_checkVarType;
    if(jindo._p_.canUseClassList()){
        jindo.$Element.prototype.toggleClass = function(sClass, sClass2){
            var oArgs = ___checkVarType(arguments, {
                '4str'  : ["sClass:String+"],
                '4str2' : ["sClass:String+", "sClass2:String+"]
            },"$Element#toggleClass");
            
            switch(oArgs+"") {
                case '4str':
                    this._element.classList.toggle(sClass+"");
                    break;
                case '4str2':
                    sClass = sClass+"";
                    sClass2 = sClass2+"";
                    if(this.hasClass(sClass)){
                        this.removeClass(sClass);
                        this.addClass(sClass2);
                    }else{
                        this.addClass(sClass);
                        this.removeClass(sClass2);
                    }
                    
            }
            return this;
        };
    } else {
        jindo.$Element.prototype.toggleClass = function(sClass, sClass2){
            var oArgs = ___checkVarType(arguments, {
                '4str'  : ["sClass:String+"],
                '4str2' : ["sClass:String+", "sClass2:String+"]
            },"$Element#toggleClass");
            
            sClass2 = sClass2 || "";
            if (this.hasClass(sClass)) {
                this.removeClass(sClass);
                if (sClass2) this.addClass(sClass2);
            } else {
                this.addClass(sClass);
                if (sClass2) this.removeClass(sClass2);
            }

            return this;
        };
    }
    return this.toggleClass.apply(this,arguments);
};
//-!jindo.$Element.prototype.toggleClass end!-//

//-!jindo.$Element.prototype.cssClass start(jindo.$Element.prototype.addClass,jindo.$Element.prototype.removeClass,jindo.$Element.prototype.hasClass)!-//
/**
 {{cssClass}}
 */
/**
 {{cssClass2}}
 */
jindo.$Element.prototype.cssClass = function(vClass, bCondition){
    var oArgs = g_checkVarType(arguments, {
        'g'  : ["sClass:String+"],
        's4bln' : ["sClass:String+", "bCondition:Boolean"],
        's4obj' : ["oObj:Hash+"]
    },"$Element#cssClass");
            
    switch(oArgs+""){
        case "g":
            return this.hasClass(oArgs.sClass);
            
        case "s4bln":
            if(oArgs.bCondition){
                this.addClass(oArgs.sClass);
            }else{
                this.removeClass(oArgs.sClass);
            }
            return this;
            
        case "s4obj":
            var e = this._element;
            vClass = oArgs.oObj;
            var sClassName = e.className;
            for(var sEachClass in vClass){
                if (vClass.hasOwnProperty(sEachClass)) {
                    if(vClass[sEachClass]){
                        if ((" " + sClassName + " ").indexOf(" " + sEachClass + " ") == -1) {
                            sClassName = (sClassName+" "+sEachClass).replace(/^\s+/, "");
                        }
                    }else{
                        if ((" " + sClassName + " ").indexOf(" " + sEachClass + " ") > -1) {
                            sClassName = (" "+sClassName+" ").replace(" "+sEachClass+" ", " ").replace(/\s+$/, "").replace(/^\s+/, "");
                        }
                    }
                }
            }
            e.className = sClassName;
            return this;
            
    }


};  
    
//-!jindo.$Element.prototype.cssClass end!-//
//-!jindo.$Element.prototype.text start!-//
/**
 {{text}}
 */
/**
 {{text2}}
 */
jindo.$Element.prototype.text = function(sText) {
    //-@@$Element.text-@@//
    var oArgs = g_checkVarType(arguments, {
        'g'  : [],
        's4str' : ["sText:String+"],
        's4num' : [jindo.$Jindo._F("sText:Numeric")],
        's4bln' : ["sText:Boolean"]
    },"$Element#text"),
        ele = this._element,
        tag = this.tag,
        prop,
        oDoc;
    
    switch(oArgs+""){
        case "g":
            prop = (ele.textContent !== undefined) ? "textContent" : "innerText";
            
            if(tag == "textarea" || tag == "input"){
                prop = "value";
            }
            
            return ele[prop];
        case "s4str":
        case "s4num":
        case "s4bln":
            try{
                /*
                {{text_1}}
                 */ 
                if(tag == "textarea" || tag == "input"){
                    ele.value = sText + "";
                }else{
                    var oDoc = ele.ownerDocument || ele.document || document;
                    this.empty();
                    ele.appendChild(oDoc.createTextNode(sText));
                }
            }catch(e){
                return ele.innerHTML = (sText+"").replace(/&/g, '&amp;').replace(/</g, '&lt;');
            }
            
            return this;
    }
};
//-!jindo.$Element.prototype.text end!-//

//-!jindo.$Element.prototype.html start!-//
/**
 {{html}}
 */
/**
 {{html2}}
 */
jindo.$Element.prototype.html = function(sHTML) {
    //-@@$Element.html-@@//
    var oArgs = g_checkVarType(arguments,{
        'g'  : [],
        's4str' : [jindo.$Jindo._F("sText:String+")],
        's4num' : ["sText:Numeric"],
        's4bln' : ["sText:Boolean"]
    },"$Element#html");

    switch(oArgs+""){
        case "g":
            return this._element.innerHTML;
        case "s4str":
        case "s4num":
        case "s4bln":
            sHTML += "";
            var oEl = this._element, _oEl;

            if(this._element.tagName.toLowerCase() == "table" && !sHTML.match(/<tbody[^>]*>/i) && sHTML.match(/<(thead|tfoot|caption|colgroup|col|th|tr|td)[^>]*>(?:.*?)(<\/\1>)?/i)) {
                var oDoc = oEl.ownerDocument || oEl.document || document;
                oDoc.createDocumentFragment().appendChild(_oEl = oEl.cloneNode(1));
                _oEl.innerHTML = sHTML;

                if(!_oEl.getElementsByTagName("tbody").length) {
                    sHTML = _oEl.innerHTML = ["<tbody>", "</tbody>"].join(_oEl.innerHTML);
                }
                oDoc = null;
            }

            oEl.innerHTML = sHTML;
            return this;
    }
};
//-!jindo.$Element.prototype.html end!-//

//-!jindo.$Element.prototype.outerHTML start!-//
/**
 {{outerHTML}}
 */
jindo.$Element.prototype.outerHTML = function() {
    //-@@$Element.outerHTML-@@//
    var e = this._element;
    e = jindo.$Jindo.isDocument(e)?e.documentElement:e;
    if (e.outerHTML !== undefined) return e.outerHTML;
    
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
jindo.$Element.prototype.toString = function(){
    return this.outerHTML()||"[object $Element]";
};
//-!jindo.$Element.prototype.toString end!-//

//-!jindo.$Element.prototype.attach start(jindo.$Element.prototype.isEqual,jindo.$Element.prototype.isChildOf,jindo.$Element.prototype.detach, jindo.$Element.event_etc, jindo.$Element.unload, jindo.$Event)!-//
/**
 {{attach}}
 */   
jindo.$Element.prototype.attach = function(sEvent, fpCallback){
    var oArgs = g_checkVarType(arguments, {
        '4str'  : ["sEvent:String+", "fpCallback:Function+"],
        '4obj'  : ["hListener:Hash+"]
    },"$Element#attach"), oSplit, hListener;
   
    switch(oArgs+""){
       case "4str":
            oSplit = jindo._p_.splitEventSelector(oArgs.sEvent);
            this._add(oSplit.type,oSplit.event,oSplit.selector,fpCallback);
            break;
       case "4obj":
            hListener = oArgs.hListener;
            for(var i in hListener){
                this.attach(i,hListener[i]);
            }
            break;
    }
    return this;
};
//-!jindo.$Element.prototype.attach end!-//

//-!jindo.$Element.prototype.detach start(jindo.$Element.prototype.attach)!-//
/**
 {{detach}}
 */
jindo.$Element.prototype.detach = function(sEvent, fpCallback){
    var oArgs = g_checkVarType(arguments, {
        // 'group_for_string'  : ["sEvent:String+"],
        '4str'  : ["sEvent:String+", "fpCallback:Function+"],
        '4obj'  : ["hListener:Hash+"]
    },"$Element#detach"), oSplit, hListener;
   
    switch(oArgs+""){
       case "4str":
            oSplit = jindo._p_.splitEventSelector(oArgs.sEvent);
            this._del(oSplit.type,oSplit.event,oSplit.selector,fpCallback);
            break;
       case "4obj":
            hListener = oArgs.hListener;
            for(var i in hListener){
                this.detach(i,hListener[i]);
            }
            break;
    }
    return this;
};
//-!jindo.$Element.prototype.detach end!-//

//-!jindo.$Element.prototype.delegate start(jindo.$Element.prototype.undelegate, jindo.$Element.event_etc, jindo.$Element.unload, jindo.$Event)!-//
/**
{{delegate}}
*/
jindo.$Element.prototype.delegate = function(sEvent , vFilter , fpCallback){
    var oArgs = g_checkVarType(arguments, {
        '4str'  : ["sEvent:String+", "vFilter:String+", "fpCallback:Function+"],
        '4fun'  : ["sEvent:String+", "vFilter:Function+", "fpCallback:Function+"]
    },"$Element#delegate");
    return this._add("delegate",sEvent,vFilter,fpCallback);
};
//-!jindo.$Element.prototype.delegate end!-//

//-!jindo.$Element.prototype.undelegate start(jindo.$Element.prototype.delegate)!-//
/**
{{undelegate}}
 */
jindo.$Element.prototype.undelegate = function(sEvent , vFilter , fpCallback){
    var oArgs = g_checkVarType(arguments, {
        '4str'  : ["sEvent:String+", "vFilter:String+", "fpCallback:Function+"],
        '4fun'  : ["sEvent:String+", "vFilter:Function+", "fpCallback:Function+"],
        'group_for_string'  : ["sEvent:String+", "vFilter:String+"],
        'group_for_function'  : ["sEvent:String+", "vFilter:Function+"]
    },"$Element#undelegate");
    return this._del("delegate",sEvent,vFilter,fpCallback);
};
//-!jindo.$Element.prototype.undelegate end!-//

//-!jindo.$Element.event_etc.hidden start!-//

jindo._p_.customEventAttach = function(sType,sEvent,vFilter,fpCallback,fpCallbackBind,eEle,fpAdd){
    if(!jindo._p_.hasCustomEventListener(eEle.__jindo__id,sEvent,vFilter)){
        var CustomEvent = jindo._p_.getCustomEvent(sEvent);
        var customInstance = new CustomEvent();
        var events = customInstance.events;
        
        customInstance.real_listener.push(fpCallback);
        customInstance.wrap_listener.push(fpCallbackBind);
        
        for(var i = 0, l = events.length ; i < l ; i++){
            customInstance["_fp"+events[i]] = jindo.$Fn(customInstance[events[i]],customInstance).bind();
            fpAdd(sType, events[i], vFilter, customInstance["_fp"+events[i]]);
        }
        jindo._p_.addCustomEventListener(eEle,eEle.__jindo__id,sEvent,vFilter,customInstance);
    } else {
        var customInstance = jindo._p_.getCustomEventListener(eEle.__jindo__id, sEvent, vFilter).custom;
        if(customInstance.real_listener){
            customInstance.real_listener.push(fpCallback);
            customInstance.wrap_listener.push(fpCallbackBind);
        }
    }
};

jindo._p_.normalCustomEventAttach  = function(ele,sEvent,jindo_id,vFilter,fpCallback,fpCallbackBind){
    if(!jindo._p_.normalCustomEvent[sEvent][jindo_id]){
        jindo._p_.normalCustomEvent[sEvent][jindo_id] = {};
        jindo._p_.normalCustomEvent[sEvent][jindo_id].ele = ele;
        jindo._p_.normalCustomEvent[sEvent][jindo_id][vFilter] = {};
        jindo._p_.normalCustomEvent[sEvent][jindo_id][vFilter].real_listener = [];
        jindo._p_.normalCustomEvent[sEvent][jindo_id][vFilter].wrap_listener = [];
    }
    jindo._p_.normalCustomEvent[sEvent][jindo_id][vFilter].real_listener.push(fpCallback);
    jindo._p_.normalCustomEvent[sEvent][jindo_id][vFilter].wrap_listener.push(fpCallbackBind);
};

/**
{{_add}}
 */
jindo.$Element.prototype._add = function(sType, sEvent , vFilter , fpCallback){
    var oManager = jindo.$Element.eventManager;
    var realEvent = sEvent;
    sEvent = sEvent.toLowerCase();
    var oEvent = oManager.splitGroup(sEvent);
    sEvent = oEvent.event;
    var sGroup = oEvent.group;
    var ele = this._element;
    var jindo_id = ele.__jindo__id;
    var oDoc = ele.ownerDocument || ele.document || document;
    
    if(jindo._p_.hasCustomEvent(sEvent)){
        vFilter = vFilter||"_NONE_";
        var fpCallbackBind = jindo.$Fn(fpCallback,this).bind();
        jindo._p_.normalCustomEventAttach(ele,sEvent,jindo_id,vFilter,fpCallback,fpCallbackBind);
        if(jindo._p_.getCustomEvent(sEvent)){
            jindo._p_.customEventAttach(sType, sEvent,vFilter,fpCallback,fpCallbackBind,ele,jindo.$Fn(this._add,this).bind());
        }
    }else{
    
        if(sEvent == "domready" && jindo.$Jindo.isWindow(ele)){
            jindo.$Element(oDoc).attach(sEvent, fpCallback);
            return this;
        }
        
        if(sEvent == "load" && ele === oDoc){
            jindo.$Element(window).attach(sEvent, fpCallback);
            return this;
        }
        
        sEvent = oManager.revisionEvent(sType, sEvent,realEvent);
        fpCallback = oManager.revisionCallback(sType, sEvent, realEvent, fpCallback);
        
        if(!oManager.isInit(this._key)){
            oManager.init(this._key, ele);
        }
        
        if(!oManager.hasEvent(this._key, sEvent,realEvent)){
            oManager.initEvent(this, sEvent,realEvent,sGroup);
        }
        
        if(!oManager.hasGroup(this._key, sEvent, sGroup)){
            oManager.initGroup(this._key, sEvent, sGroup);
        }
        oManager.addEventListener(this._key, sEvent, sGroup, sType, vFilter, fpCallback);
    }

    return this;
};

jindo._p_.customEventDetach = function(sType,sEvent,vFilter,fpCallback,eEle,fpDel) {
    var customObj = jindo._p_.getCustomEventListener(eEle.__jindo__id, sEvent, vFilter);
    var customInstance = customObj.custom;
    var events = customInstance.events;

    for(var i = 0, l = events.length; i < l; i++) {
        fpDel(sType, events[i], vFilter, customInstance["_fp"+events[i]]);
    }
};

/**
{{_del}}
 */
jindo.$Element.prototype._del = function(sType, sEvent, vFilter, fpCallback){
    var oManager = jindo.$Element.eventManager;
    var realEvent = sEvent;
    sEvent = sEvent.toLowerCase();
    var oEvent = oManager.splitGroup(sEvent);
    sEvent = oEvent.event;
    var sGroup = oEvent.group;
    var oDoc = this._element.ownerDocument || this._element.document || document;
    if(jindo._p_.hasCustomEvent(sEvent)){
        var jindo_id = this._element.__jindo__id;
        vFilter = vFilter||"_NONE_";
        
        var oNormal = jindo._p_.getNormalEventListener(jindo_id, sEvent, vFilter);
        
        
        
        var aWrap = oNormal.wrap_listener;
        var aReal = oNormal.real_listener;
        var aNewWrap = [];
        var aNewReal = [];
        
        for(var i = 0, l = aReal.length; i < l; i++){
            if(aReal[i]!=fpCallback){
                aNewWrap.push(aWrap[i]);
                aNewReal.push(aReal[i]);
            }
        }
        
        if(aNewReal.length==0){
            var oNormalJindo = jindo._p_.normalCustomEvent[sEvent][jindo_id];
            var count = 0;
            for(var i in oNormalJindo){
                if(i!=="ele"){
                    count++;
                    break;
                }
            }
            if(count === 0){
                delete jindo._p_.normalCustomEvent[sEvent][jindo_id];
            }else{
                delete jindo._p_.normalCustomEvent[sEvent][jindo_id][vFilter];
            }
        }
        
        if(jindo._p_.customEvent[sEvent]){
            // var customInstance = jindo._p_.getCustomEventListener(jindo__id, sEvent, vFilter).custom;
//             
            // var aWrap = customInstance.wrap_listener;
            // var aReal = customInstance.real_listener;
            // var aNewWrap = [];
            // var aNewReal = [];
//             
            // for(var i = 0, l = aReal.length; i < l; i++){
                // if(aReal[i]!=fpCallback){
                    // aNewWrap.push(aWrap[i]);
                    // aNewReal.push(aReal[i]);
                // }
            // }
            jindo._p_.setCustomEventListener(jindo_id, sEvent, vFilter, aNewReal, aNewWrap);
            if(aNewReal.length==0){
                jindo._p_.customEventDetach(sType, sEvent,vFilter,fpCallback,this._element,jindo.$Fn(this._del,this).bind());
                delete jindo._p_.customEventStore[jindo_id][sEvent][vFilter];
            }
        }
        
    }else{
    
        if(sEvent == "domready" && jindo.$Jindo.isWindow(this._element)){
            jindo.$Element(oDoc).detach(sEvent, fpCallback);
            return this;
        }
        
        if(sEvent == "load" && this._element === oDoc){
            jindo.$Element(window).detach(sEvent, fpCallback);
            return this;
        }
        
        sEvent = oManager.revisionEvent(sType, sEvent,realEvent);
        
        // if(sGroup === jindo._p_.NONE_GROUP && !jindo.$Jindo.isFunction(fpCallback)){
        if(sGroup === jindo._p_.NONE_GROUP && !jindo.$Jindo.isFunction(fpCallback)&&!vFilter){        
            throw new jindo.$Error(jindo.$Except.HAS_FUNCTION_FOR_GROUP,"$Element#"+(sType=="normal"?"detach":"delegate"));
        }
        
        oManager.removeEventListener(this._key, sEvent, sGroup, sType, vFilter, fpCallback);
    }
    return this;
};

/**
{{eventManager}}
 */

jindo._p_.mouseTouchPointerEvent = function (sEvent){
    var eventMap = {};

    if(window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0) {
        eventMap = {
            "mousedown":"MSPointerDown",
            "mouseup":"MSPointerUp",
            "mousemove":"MSPointerMove",
            "mouseover":"MSPointerOver",
            "mouseout":"MSPointerOut",
            "touchstart":"MSPointerDown",
            "touchend":"MSPointerUp",
            "touchmove":"MSPointerMove",
            "pointerdown":"MSPointerDown",
            "pointerup":"MSPointerUp",
            "pointermove":"MSPointerMove",
            "pointerover":"MSPointerOver",
            "pointerout":"MSPointerOut",
            "pointercancel":"MSPointerCancel"
        };
    } else if(jindo._p_._JINDO_IS_MO) {
        eventMap = {
            "mousedown":"touchstart",
            "mouseup":"touchend",
            "mousemove":"touchmove",
            "pointerdown":"touchstart",
            "pointerup":"touchend",
            "pointermove":"touchmove"
        };
    }

    jindo._p_.mouseTouchPointerEvent = function(sEvent){
        return eventMap[sEvent]?eventMap[sEvent]:sEvent;    
    };
    
    return jindo._p_.mouseTouchPointerEvent(sEvent);
};
jindo.$Element.eventManager = (function(){
    var eventStore = {};

    function bind(fpFunc, oScope, aPram) {
        return function() {
            var args = jindo._p_._toArray( arguments );
            if (aPram.length) args = aPram.concat(args);
            return fpFunc.apply(oScope, args);
        };
    }

    var touch = {
         "mousedown":"mousedown",
         "mousemove":"mousemove",
         "mouseup":"mouseup"
    };

    return {
        /**
        {{revisionCallback}}
         */
        revisionCallback : function(sType, sEvent, realEvent, fpCallback){
            if(realEvent=="mouseenter"||realEvent=="mouseleave"){
                var fpWrapCallback = jindo.$Element.eventManager._fireWhenElementBoundary(sType, fpCallback);
                fpWrapCallback._origin_ = fpCallback;
                fpCallback = fpWrapCallback;
            }
            return fpCallback;
        },
        /**
        {{_fireWhenElementBoundary}}
         */
        _fireWhenElementBoundary : function(sType, fpCallback){
            return function(oEvent){
                var woRelatedElement = oEvent.relatedElement?jindo.$Element(oEvent.relatedElement):null;
                var eElement = oEvent.currentElement;
                if(sType == "delegate"){
                    eElement = oEvent.element;
                }
                if(woRelatedElement && (woRelatedElement.isEqual(eElement) || woRelatedElement.isChildOf(eElement))) return;
                
                fpCallback(oEvent);
            };
        },
        /**
        {{revisionEvent}}
         */
        revisionEvent : function(sType, sEvent,realEvent) {
           if(/^ms/i.test(realEvent)){
                return realEvent;
            }
            var customEvent = jindo.$Event.hook(sEvent);
            if(customEvent){
                if(jindo.$Jindo.isFunction(customEvent)){
                    return jindo._p_.customEvent(); 
                }else{
                    return customEvent;
                }
            }
            sEvent = sEvent.toLowerCase();
            if (sEvent == "domready" || sEvent == "domcontentloaded") {
                sEvent = "DOMContentLoaded";
            }else if (sEvent == "mousewheel" && !jindo._p_._JINDO_IS_WK && !jindo._p_._JINDO_IS_OP) {
                /*
                 {{revisionEvent_1}}
                 */
                sEvent = "DOMMouseScroll";  
            }else if (sEvent == "mouseenter"){
                sEvent = "mouseover";
            }else if (sEvent == "mouseleave"){
                sEvent = "mouseout";
            }else if(sEvent == "transitionend"||sEvent == "transitionstart"){
                var sPostfix = sEvent.replace("transition","");
                var info = jindo._p_.getStyleIncludeVendorPrefix();
                if(info.transition != "transition"){
                    sPostfix = sPostfix.substr(0,1).toUpperCase() + sPostfix.substr(1);
                }
                sEvent = info.transition + sPostfix;
            }else if(sEvent == "animationstart"||sEvent == "animationend"||sEvent == "animationiteration"){
                var sPostfix = sEvent.replace("animation","");
                var info = jindo._p_.getStyleIncludeVendorPrefix();
                if(info.animation != "animation"){
                    sPostfix = sPostfix.substr(0,1).toUpperCase() + sPostfix.substr(1);
                }
                sEvent = info.animation + sPostfix;
            }else if(sEvent === "focusin"||sEvent === "focusout"){
                sEvent = sEvent === "focusin" ? "focus":"blur";
            }      
            return jindo._p_.mouseTouchPointerEvent(sEvent);
        },
        /**
        {{test}}
         */
        test : function(){
            return eventStore;
        },
        /**
        {{isInit}}
         */
        isInit : function(sKey){
            return !!eventStore[sKey];
        },
        /**
        {{init}}
         */
        init : function(sKey, eEle){
            eventStore[sKey] = {
                "ele" : eEle,
                "event" : {}
            };
        },
        /**
        {{getEventConfig}}
         */
        getEventConfig : function(sKey){
            return eventStore[sKey];
        },
        /**
        {{hasEvent}}
         */
        hasEvent : function(sKey, sEvent,realEvent){
            try{
                return !!eventStore[sKey]["event"][sEvent];
            }catch(e){
                return false;
            }
        },
        /**
        {{hasGroup}}
         */
        hasGroup : function(sKey, sEvent, sGroup){
            return !!eventStore[sKey]["event"][sEvent]["type"][sGroup];
        },
        createEvent : function(wEvent,realEvent,element,delegatedElement){
            // wEvent = wEvent || window.event;
            if (wEvent.currentTarget === undefined) {
                wEvent.currentTarget = element;
            }
            var weEvent = jindo.$Event(wEvent);
            if(!weEvent.currentElement){
                weEvent.currentElement = element;
            }
            weEvent.realType = realEvent;
            weEvent.delegatedElement = delegatedElement;
            return weEvent;
        },
        /**
        {{initEvent}}
         */
        initEvent : function(oThis, sEvent, realEvent, sGroup){
            var sKey = oThis._key;
            var oEvent = eventStore[sKey]["event"];
            var that = this;
            
            var fAroundFunc = bind(function(sEvent,realEvent,scope,wEvent){
                wEvent = wEvent || window.event;
                var oEle = wEvent.target || wEvent.srcElement;
                var oManager = jindo.$Element.eventManager;
                var oConfig = oManager.getEventConfig((wEvent.currentTarget||this._element).__jindo__id);
                
                var oType = oConfig["event"][sEvent].type;
                for(var i in oType){
                    if(oType.hasOwnProperty(i)){
                        var aNormal = oType[i].normal;
                        for(var j = 0, l = aNormal.length; j < l; j++){
                            aNormal[j].call(this,scope.createEvent(wEvent,realEvent,this._element,null));
                        }
                        var oDelegate = oType[i].delegate;
                        var aResultFilter;
                        var afpFilterCallback;
                        for(var k in oDelegate){
                            if(oDelegate.hasOwnProperty(k)){
                                aResultFilter = oDelegate[k].checker(oEle);
                                if(aResultFilter[0]){
                                    afpFilterCallback = oDelegate[k].callback;
                                    var weEvent;//.element = aResultFilter[1];
                                    for(var m = 0, leng = afpFilterCallback.length; m < leng ; m++){
                                        weEvent = scope.createEvent(wEvent,realEvent,this._element,aResultFilter[1]);
                                        weEvent.element = aResultFilter[1];
                                        afpFilterCallback[m].call(this, weEvent);
                                    }
                                }
                            }
                        }
                    }
                    
                }
            },oThis,[sEvent,realEvent,this]);
            
            oEvent[sEvent] = {
                "listener" : fAroundFunc,
                "type" :{}
            };
            
            jindo.$Element._eventBind(oThis._element,sEvent,fAroundFunc,(realEvent==="focusin" || realEvent==="focusout"));
            
        },
        /**
        {{initGroup}}
         */
        initGroup : function(sKey, sEvent, sGroup){
            var oType = eventStore[sKey]["event"][sEvent]["type"];
            oType[sGroup] = {
                "normal" : [],
                "delegate" :{}
            };
        },
        /**
        {{addEventListener}}
         */
        addEventListener : function(sKey, sEvent, sGroup, sType, vFilter, fpCallback){
            var oEventInfo = eventStore[sKey]["event"][sEvent]["type"][sGroup];
            
            if(sType === "normal"){
                oEventInfo.normal.push(fpCallback);
            }else if(sType === "delegate"){
                if(!this.hasDelegate(oEventInfo,vFilter)){
                    this.initDelegate(eventStore[sKey].ele,oEventInfo,vFilter);
                }
                this.addDelegate(oEventInfo,vFilter,fpCallback);
            }
            
        },
        /**
         {{hasDelegate}}
         */
        hasDelegate : function(oEventInfo,vFilter){
            return !!oEventInfo.delegate[vFilter];
        },
        containsElement : function(eOwnEle, eTarget, sCssquery, bContainOwn){
            if(eOwnEle == eTarget&&bContainOwn){
                return jindo.$$.test(eTarget,sCssquery);
            }
            var aSelectElement = jindo.$$(sCssquery,eOwnEle);
            for(var i = 0, l = aSelectElement.length; i < l; i++){
                if(aSelectElement[i] == eTarget){
                    return true;
                }
            }  
            return false;
            
        },
        /**
        {{initDelegate}}
         */
        initDelegate : function(eOwnEle,oEventInfo,vFilter){
            var fpCheck;
            if(jindo.$Jindo.isString(vFilter)){
                fpCheck = bind(function(eOwnEle,sCssquery,oEle){
                    var eIncludeEle = oEle;
                    var isIncludeEle = this.containsElement(eOwnEle, oEle, sCssquery,true);
                    if(!isIncludeEle){
                        var aPropagationElements = this._getParent(eOwnEle,oEle);
                        for(var i = 0, leng = aPropagationElements.length ; i < leng ; i++){
                            eIncludeEle = aPropagationElements[i];
                            if(this.containsElement(eOwnEle, eIncludeEle, sCssquery)){
                                isIncludeEle = true;
                                break;
                            }
                        }
                    }
                    return [isIncludeEle,eIncludeEle];
                },this,[eOwnEle,vFilter]);
            }else{
                fpCheck = bind(function(eOwnEle,fpFilter,oEle){
                    var eIncludeEle = oEle;
                    var isIncludeEle = fpFilter(eOwnEle,oEle);
                    if(!isIncludeEle){
                        var aPropagationElements = this._getParent(eOwnEle,oEle);
                        for(var i = 0, leng = aPropagationElements.length ; i < leng ; i++){
                            eIncludeEle = aPropagationElements[i];
                            if(fpFilter(eOwnEle,eIncludeEle)){
                                isIncludeEle = true;
                                break;
                            }
                        }
                    }
                    return [isIncludeEle,eIncludeEle];
                },this,[eOwnEle,vFilter]);
            }
            oEventInfo.delegate[vFilter] = {
                "checker" : fpCheck,
                "callback" : []
            };
        },
        /**
        {{addDelegate}}
         */
        addDelegate : function(oEventInfo,vFilter,fpCallback){
            oEventInfo.delegate[vFilter].callback.push(fpCallback);
        },
        /**
        {{removeEventListener}}
         */
        removeEventListener : function(sKey, sEvent, sGroup, sType, vFilter, fpCallback){
            var oEventInfo;
            try{
                oEventInfo = eventStore[sKey]["event"][sEvent]["type"][sGroup];
            }catch(e){
                return;
            }
            var aNewCallback = [];
            var aOldCallback;
            if(sType === "normal"){
                aOldCallback = oEventInfo.normal;
            }else{
                aOldCallback  = oEventInfo.delegate[vFilter].callback;
            }
            if (sEvent == jindo._p_.NONE_GROUP || jindo.$Jindo.isFunction(fpCallback)) {
                for(var i = 0, l = aOldCallback.length; i < l; i++){
                    if((aOldCallback[i]._origin_||aOldCallback[i]) != fpCallback){
                        aNewCallback.push(aOldCallback[i]);
                    }
                }
            }
            if(sType === "normal"){
                delete oEventInfo.normal;
                oEventInfo.normal = aNewCallback;
            }else if(sType === "delegate"){
                delete oEventInfo.delegate[vFilter].callback;
                oEventInfo.delegate[vFilter].callback = aNewCallback;
            }
            this.cleanUp(sKey, sEvent);
        },
        /**
        {{cleanUpAll}}
         */
        cleanUpAll : function(){
            var oEvent;
            for(var sKey in eventStore){
                if (eventStore.hasOwnProperty(sKey)) {
                    this.cleanUpUsingKey(sKey, true);
                }
            }
        },
        /**
        {{cleanUpUsingKey}}
         */
        cleanUpUsingKey : function(sKey, bForce){
            var oEvent;
            
            if(!eventStore[sKey] || !eventStore[sKey].event){
                return;
            }
            
            oEvent = eventStore[sKey].event;
            
            for(var sEvent in oEvent){
                if (oEvent.hasOwnProperty(sEvent)) {
                    this.cleanUp(sKey, sEvent, bForce);
                }
            }
        },
        /**
        {{cleanUp}}
         */
        cleanUp : function(sKey, sEvent, bForce){
            var oTypeInfo; 
            try{
                oTypeInfo = eventStore[sKey]["event"][sEvent]["type"];
            }catch(e){
                return;
            }
            var oEventInfo;
            var bHasEvent = false;
            if(!bForce){
                for(var i in oTypeInfo){
                    if (oTypeInfo.hasOwnProperty(i)) {
                        oEventInfo = oTypeInfo[i];
                        if(oEventInfo.normal.length){
                            bHasEvent = true;
                            break;
                        }
                        var oDele = oEventInfo.delegate;
                        for(var j in oDele){ 
                            if (oDele.hasOwnProperty(j)) {
                                if(oDele[j].callback.length){
                                    bHasEvent = true;
                                    break;
                                }
                            }
                        }
                        if(bHasEvent) break;
                        
                    }
                }
            }
            if(!bHasEvent){
                jindo.$Element._unEventBind(eventStore[sKey].ele, sEvent, eventStore[sKey]["event"][sEvent]["listener"]);
                delete eventStore[sKey]["event"][sEvent];
                var bAllDetach = true;
                var oEvent = eventStore[sKey]["event"];
                for(var k in oEvent){
                    if (oEvent.hasOwnProperty(k)) {
                        bAllDetach = false;
                        break;
                    }
                }
                if(bAllDetach){
                    delete eventStore[sKey];
                }
            }
        },
        /**
        {{splitGroup}}
         */
        splitGroup : function(sEvent){
            var aMatch = /\s*(.+?)\s*\(\s*(.*?)\s*\)/.exec(sEvent);
            if(aMatch){
                return {
                    "event" : aMatch[1].toLowerCase(),
                    "group" : aMatch[2].toLowerCase()
                };
            }else{
                return {
                    "event" : sEvent.toLowerCase(),
                    "group" : jindo._p_.NONE_GROUP
                };
            }
        },
        /**
        {{_getParent}}
         */
        _getParent : function(oOwnEle, oEle){
            var e = oOwnEle;
            var a = [], p = null;
            var oDoc = oEle.ownerDocument || oEle.document || document;
            while (oEle.parentNode && p != e) {
                p = oEle.parentNode;
                if (p == oDoc.documentElement) break;
                a[a.length] = p;
                oEle = p;
            }
        
            return a;
        }
    };
})();
/*
{{element_attach_data}}
 */
//-!jindo.$Element.event_etc.hidden end!-//

//-!jindo.$Element.unload.hidden start!-//
/*
{{element_unload}}
 */

//-!jindo.$Element.unload.hidden end!-//
