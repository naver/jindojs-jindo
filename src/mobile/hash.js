/**
 {{title}}
 */
//-!jindo.$H start!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$H = function(hashObject) {
    //-@@$H-@@//
    var cl = arguments.callee;
    if (hashObject instanceof cl) return hashObject;
    
    if (!(this instanceof cl)){
        try {
            jindo.$Jindo._maxWarn(arguments.length, 1,"$H");
            return new cl(hashObject||{});
        } catch(e) {
            if (e instanceof TypeError) { return null; }
            throw e;
        }
    }
    
    var oArgs = g_checkVarType(arguments, {
        '4obj' : ['oObj:Hash+'],
        '4vod' : []
    },"$H");

    this._table = {};
    for(var k in hashObject) {
        if(hashObject.hasOwnProperty(k)){
            this._table[k] = hashObject[k]; 
        }
    }
};
//-!jindo.$H end!-//

//-!jindo.$H.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$H.prototype.$value = function() {
    //-@@$H.$value-@@//
    return this._table;
};
//-!jindo.$H.prototype.$value end!-//

//-!jindo.$H.prototype.$ start!-//
/**
 {{sign_}}
 */
/**
 {{sign2_}}
 */
jindo.$H.prototype.$ = function(key, value) {
    //-@@$H.$-@@//
    var oArgs = g_checkVarType(arguments, {
        's4var' : [ jindo.$Jindo._F('key:String+'), 'value:Variant' ],
        's4var2' : [ 'key:Numeric', 'value:Variant' ],
        'g4str' : [ 'key:String+' ],
        's4obj' : [ 'oObj:Hash+'],
        'g4num' : [ 'key:Numeric' ]
    },"$H#$");
    
    switch(oArgs+""){
        case "s4var":
        case "s4var2":
            this._table[key] = value;
            return this;
        case "s4obj":
            var obj = oArgs.oObj;
            for(var i in obj){
                if(obj.hasOwnProperty(i)){
                    this._table[i] = obj[i];
                }
            }
            return this;
        default:
            return this._table[key];
    }
    
};
//-!jindo.$H.prototype.$ end!-//

//-!jindo.$H.prototype.length start!-//
/**
 {{length}}
 */
jindo.$H.prototype.length = function() {
    //-@@$H.length-@@//
    var index = 0;
    var sortedIndex = this["__jindo_sorted_index"];
    if(sortedIndex){
        return sortedIndex.length;
    }else{
        for(var k in this._table) {
            if(this._table.hasOwnProperty(k)){
                if (Object.prototype[k] !== undefined && Object.prototype[k] === this._table[k]) continue;
                index++;
            }
        }
    
    }
    return index;
};
//-!jindo.$H.prototype.length end!-//

//-!jindo.$H.prototype.forEach start(jindo.$H.Break,jindo.$H.Continue)!-//
/**
 {{forEach}}
 */
jindo.$H.prototype.forEach = function(callback, scopeObject) {
    //-@@$H.forEach-@@//
    var oArgs = g_checkVarType(arguments, {
        '4fun' : [ 'callback:Function+'],
        '4obj' : [ 'callback:Function+', "thisObject:Variant"]
    },"$H#forEach");
    var t = this._table;
    var h = this.constructor;
    var sortedIndex = this["__jindo_sorted_index"];
    
    if(sortedIndex){
        for(var i = 0, l = sortedIndex.length; i < l ; i++){
            
            try {
                var k = sortedIndex[i];
                callback.call(scopeObject||this, t[k], k, t);
            } catch(e) {
                if (e instanceof h.Break) break;
                if (e instanceof h.Continue) continue;
                throw e;
            }
        }
    }else{
        for(var k in t) {
            if (t.hasOwnProperty(k)) {
                if (!t.propertyIsEnumerable(k)){
                    continue;
                }
                try {
                    callback.call(scopeObject||this, t[k], k, t);
                } catch(e) {
                    if (e instanceof h.Break) break;
                    if (e instanceof h.Continue) continue;
                    throw e;
                }
            }
        }
    }
    
    return this;
};
//-!jindo.$H.prototype.forEach end!-//

//-!jindo.$H.prototype.filter start(jindo.$H.prototype.forEach)!-//
/**
 {{filter}}
 */
jindo.$H.prototype.filter = function(callback, thisObject) {
    //-@@$H.filter-@@//
    var oArgs = g_checkVarType(arguments, {
        '4fun' : [ 'callback:Function+'],
        '4obj' : [ 'callback:Function+', "thisObject:Variant"]
    },"$H#filter");
    var h = jindo.$H();
    var t = this._table;
    var hCon = this.constructor;
    
    for(var k in t) {
        if (t.hasOwnProperty(k)) {
            if (!t.propertyIsEnumerable(k)) continue;
            try {
                if(callback.call(thisObject||this, t[k], k, t)){
                    h.add(k,t[k]);
                }
            } catch(e) {
                if (e instanceof hCon.Break) break;
                if (e instanceof hCon.Continue) continue;
                throw e;
            }
        }
    }
    return h;
};
//-!jindo.$H.prototype.filter end!-//

//-!jindo.$H.prototype.map start(jindo.$H.prototype.forEach)!-//
/**
 {{map}}
 */

jindo.$H.prototype.map = function(callback, thisObject) {
    //-@@$H.map-@@//
    var oArgs = g_checkVarType(arguments, {
        '4fun' : [ 'callback:Function+'],
        '4obj' : [ 'callback:Function+', "thisObject:Variant"]
    },"$H#map");
    var h = jindo.$H();
    var t = this._table;
    var hCon = this.constructor;
    
    for(var k in t) {
        if (t.hasOwnProperty(k)) {
            if (!t.propertyIsEnumerable(k)) continue;
            try {
                h.add(k,callback.call(thisObject||this, t[k], k, t));
            } catch(e) {
                if (e instanceof hCon.Break) break;
                if (e instanceof hCon.Continue){
                    h.add(k,t[k]);
                }else{
                    throw e;
                }
            }
        }
    }
    
    return h;
};
//-!jindo.$H.prototype.map end!-//

//-!jindo.$H.prototype.add start!-//
/**
 {{add}}
 */
jindo.$H.prototype.add = function(key, value) {
    //-@@$H.add-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str' : [ 'key:String+',"value:Variant"],
        '4num' : [ 'key:Numeric',"value:Variant"]
    },"$H#add");
    var sortedIndex = this["__jindo_sorted_index"];
    if(sortedIndex && this._table[key]==undefined ){
        this["__jindo_sorted_index"].push(key);
    }
    this._table[key] = value;

    return this;
};
//-!jindo.$H.prototype.add end!-//

//-!jindo.$H.prototype.remove start!-//
/**
 {{remove}}
 */
jindo.$H.prototype.remove = function(key) {
    //-@@$H.remove-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str' : [ 'key:String+'],
        '4num' : [ 'key:Numeric']
    },"$H#remove");
    
    if (this._table[key] === undefined) return null;
    var val = this._table[key];
    delete this._table[key];
    
    
    var sortedIndex = this["__jindo_sorted_index"];
    if(sortedIndex){
        var newSortedIndex = [];
        for(var i = 0, l = sortedIndex.length ; i < l ; i++){
            if(sortedIndex[i] != key){
                newSortedIndex.push(sortedIndex[i]);
            }
        }
        this["__jindo_sorted_index"] = newSortedIndex;
    }
    return val;
};
//-!jindo.$H.prototype.remove end!-//

//-!jindo.$H.prototype.search start!-//
/**
 {{search}}
 */
jindo.$H.prototype.search = function(value) {
    //-@@$H.search-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str' : [ 'value:Variant']
    },"$H#search");
    var result = false;
    var t = this._table;

    for(var k in t) {
        if (t.hasOwnProperty(k)) {
            if (!t.propertyIsEnumerable(k)) continue;
            var v = t[k];
            if (v === value) {
                result = k;
                break;
            }           
        }
    }
    
    return result;
};
//-!jindo.$H.prototype.search end!-//

//-!jindo.$H.prototype.hasKey start!-//
/**
 {{hasKey}}
 */
jindo.$H.prototype.hasKey = function(key) {
    //-@@$H.hasKey-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str' : [ 'key:String+'],
        '4num' : [ 'key:Numeric']
    },"$H#hasKey");
    return this._table[key] !== undefined;
};
//-!jindo.$H.prototype.hasKey end!-//

//-!jindo.$H.prototype.hasValue start(jindo.$H.prototype.search)!-//
/**
 {{hasValue}}
 */
jindo.$H.prototype.hasValue = function(value) {
    //-@@$H.hasValue-@@//
    var oArgs = g_checkVarType(arguments, {
        '4str' : [ 'value:Variant']
    },"$H#hasValue");
    return (this.search(value) !== false);
};
//-!jindo.$H.prototype.hasValue end!-//



//-!jindo.$H.prototype.sort start(jindo.$H.prototype.search)!-//
jindo._p_.defaultSort = function(oArgs,that,type){
    var aSorted = [];
    var fpSort = oArgs.fpSort;
    for(var k in that._table) {
        if(that._table.hasOwnProperty(k)){
          (function(k,v){
            aSorted.push({
                "key" : k,
                "val" : v
            });
          })(k,that._table[k]);
        }
    }
    
    if(oArgs+"" === "vo"){
        fpSort = function (a,b){
            return a === b ? 0 : a > b ? 1 : -1;
        };
    }
    
    aSorted.sort(function(beforeVal,afterVal){
        return fpSort.call(that, beforeVal[type], afterVal[type]);
    });
    
    var sortedKey = [];
    for(var i = 0, l = aSorted.length; i < l; i++){
        sortedKey.push(aSorted[i].key);
    }
    
    return sortedKey;
};
/**
 {{sort}}
 */

jindo.$H.prototype.sort = function(fpSort) {
    //-@@$H.sort-@@//
    var oArgs = g_checkVarType(arguments, {
        'vo'  : [],
        '4fp' : [ 'fpSort:Function+']
    },"$H#sort");
    
    this["__jindo_sorted_index"] = jindo._p_.defaultSort(oArgs,this,"val"); 
    return this;
};
//-!jindo.$H.prototype.sort end!-//

//-!jindo.$H.prototype.ksort start(jindo.$H.prototype.keys)!-//
/**
 {{ksort}}
 */
jindo.$H.prototype.ksort = function(fpSort) {
    //-@@$H.ksort-@@//
    var oArgs = g_checkVarType(arguments, {
        'vo'  : [],
        '4fp' : [ 'fpSort:Function+']
    },"$H#ksort");
    
    this["__jindo_sorted_index"] = jindo._p_.defaultSort(oArgs,this,"key");
    return this;
};
//-!jindo.$H.prototype.ksort end!-//

//-!jindo.$H.prototype.keys start!-//
/**
 {{keys}}
 */
jindo.$H.prototype.keys = function() {
    //-@@$H.keys-@@//
    var keys = this["__jindo_sorted_index"];
    
    if(!keys){
        if(Object.keys){
            keys = Object.keys(this._table);
        } else {
            keys = [];
            for (var k in this._table) {
                if (this._table.hasOwnProperty(k))
                    keys.push(k);
            }
        }
    }

    return keys;
};
//-!jindo.$H.prototype.keys end!-//

//-!jindo.$H.prototype.values start!-//
/**
 {{values}}
 */
jindo.$H.prototype.values = function() {
    //-@@$H.values-@@//
    var values = [];
    for(var k in this._table) {
        if(this._table.hasOwnProperty(k))
            values[values.length] = this._table[k];
    }

    return values;
};
//-!jindo.$H.prototype.values end!-//

//-!jindo.$H.prototype.toQueryString start!-//
/**
 {{toQueryString}}
 */
jindo.$H.prototype.toQueryString = function() {
    //-@@$H.toQueryString-@@//
    var buf = [], val = null, idx = 0;

    for(var k in this._table) {
        if(this._table.hasOwnProperty(k)) {
            val = this._table[k];

            if(jindo.$Jindo.isArray(val)) {
                for(var i=0; i < val.length; i++) {
                    buf[buf.length] = encodeURIComponent(k)+"[]="+encodeURIComponent(val[i]+"");
                }
            } else {
                buf[buf.length] = encodeURIComponent(k)+"="+encodeURIComponent(this._table[k]+"");
            }
        }
    }
    
    return buf.join("&");
};
//-!jindo.$H.prototype.toQueryString end!-//

//-!jindo.$H.prototype.empty start!-//
/**
 {{empty_1}}
 */
jindo.$H.prototype.empty = function() {
    //-@@$H.empty-@@//
    this._table = {};
    delete this["__jindo_sorted_index"];
    
    return this;
};
//-!jindo.$H.prototype.empty end!-//

//-!jindo.$H.Break start!-//
/**
 {{break}}
 */
jindo.$H.Break = jindo.$Jindo.Break;
//-!jindo.$H.Break end!-//

//-!jindo.$H.Continue start!-//
/**
 {{continue}}
 */
jindo.$H.Continue  = jindo.$Jindo.Continue;
//-!jindo.$H.Continue end!-//
