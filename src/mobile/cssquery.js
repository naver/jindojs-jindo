/**
 {{title}}
 */
//-!jindo.cssquery start!-//
/**
 {{desc}}
 */
/**
 {{cssquery}}
 */
jindo.$$ = jindo.cssquery = (function(){
    var cssquery;
    this._dummyWrap;
    
    function createDummy(){
        var elDummyWrap = cssquery._dummyWrap;
        if(!elDummyWrap){
            cssquery._dummyWrap = elDummyWrap = document.createElement('div');
            elDummyWrap.id = "__jindo_cssquery_mockdiv";
            elDummyWrap.style.cssText = 'display:none !important;';
            elDummyWrap.className = 'This element is for jindo.$$.test';
            document.body.insertBefore(elDummyWrap, document.body.firstChild);
        }
        cssquery._dummyWrap = elDummyWrap;
    }
    
    var UID = 1;
    var validUID = {};
    function _isNonStandardQueryButNotException(sQuery){
        return /\[\s*(?:checked|selected|disabled)/.test(sQuery);
    }
    
    /**
    {{_commaRevise}}
    **/
    function _commaRevise(sQuery, sChange){
        return sQuery.replace(/\,/gi, sChange);
    }
    
    function _startCombinator(sQuery){
        return /^[~>+]/.test(sQuery);
    }
    
    function _getParentElement(oParent){
        if(!oParent) {
            return document;
        }

        var nParentNodeType;
        
        oParent = oParent && oParent.$value ? oParent.$value() : oParent;
        
        if(jindo.$Jindo.isString(oParent)){
            oParent = document.getElementById(oParent);
        }
        
        nParentNodeType = oParent.nodeType;
        
        if(nParentNodeType != 1 && nParentNodeType != 9 && nParentNodeType != 10 && nParentNodeType != 11){
            oParent = oParent.ownerDocument || oParent.document;
        }
        
        return oParent || oParent.ownerDocument || oParent.document;
    }
    function _addQueryId(el, sIdName){
        var sQueryId, sValue;
        
        if(/^\w+$/.test(el.id)){
            sQueryId = "#" + el.id;
        }else{
            sValue = "C" + new Date().getTime() + Math.floor(Math.random() * 1000000);
            el.setAttribute(sIdName, sValue);
            sQueryId = "[" + sIdName + "=" + sValue + "]";
        }
        
        return sQueryId;
    }
    function _getSelectorMethod(sQuery, bDocument) {
        var oRet = { method : null, query : null };
    
        if(/^\s*[a-z]+\s*$/i.test(sQuery)) {
            oRet.method = "getElementsByTagName";
        } else if(/^\s*([#\.])([\w\-]+)\s*$/i.test(sQuery)) {
            oRet.method = RegExp.$1 == "#" ? "getElementById" : "getElementsByClassName";
            oRet.query = RegExp.$2;
        }

        if(!document[oRet.method] || RegExp.$1 == "#" && !bDocument) {
            oRet.method = oRet.query = null;
        }

        return oRet;
    }
    
    function distinct(aList){
        var aDistinct = [],
            oDummy = {},
            nUID,
            oEl,
            i;
        
        for(i = 0; oEl = aList[i]; i++){
            nUID = getUID4HTML(oEl);
            
            if(oDummy[nUID]){
                continue;
            }
            
            aDistinct.push(oEl);
            oDummy[nUID] = true;
        }
        
        return aDistinct;
    }
    
    function getUID4HTML(oEl){
        var nUID = oEl._cssquery_UID;
        
        if(nUID && validUID[nUID] == oEl){
            return nUID;
        }
        
        oEl._cssquery_UID = nUID = UID++;
        validUID[nUID] = oEl;
        
        return nUID;
    }
    
    var _parseTreeReg1 = /(.*?)\s*(![>+~]?)\s*(.*)/;
    var _parseTreeReg2 = /[!>~+\s]/;
    var _parseTreeReg3 = /(.*?)[!>~+\s]/;
    
    function makeQueryParseTree(sQuery){
    
        var returnVal = [];
        var match = sQuery.match(_parseTreeReg1);
        
        if(match){
            if(_parseTreeReg2.test(match[3])){
                var right;
                var recursive = match[3].replace(_parseTreeReg3,function(m,_){
                    right = _;
                    return jindo._p_.trim(m.replace(_,""));
                });
                returnVal.push({
                    "left" : match[1],
                    "com" : match[2],
                    "right" : jindo._p_.trim(right)
                });
                var recursiveObj = makeQueryParseTree(recursive);
                for(var i = 0, l = recursiveObj.length; i < l; i++){
                    returnVal.push(recursiveObj[i]);
                }
            }else{
                returnVal.push({
                    "left" : match[1],
                    "com" : match[2],
                    "right" : match[3]
                });
            }
        }else{
            returnVal.push({
                "left" : sQuery,
                "com" : "",
                "right" : ""
            });
        }
        
        return returnVal;
    }
    
    function exclamationMarkQuery(sQuery, oParent, oOptions){
        var base = oParent;
        if(oParent.nodeType ==1){
            base = oParent.ownerDocument || oParent.document;
        }
        
        var parseTree = makeQueryParseTree(sQuery);
        var result = [base];
        for(var i = 0, l = parseTree.length; i < l; i++){
            result = findElement(parseTree[i],result,oOptions&&oOptions.single&&(i==parseTree.length-1));
        }
        if(!result){
            return [];
        }
        
        return distinct(result);
    }
    
    function findElement(parseTree,baseEle,isBreak){
        var type = parseTree.com;
        
        switch(type){
            case "!":
            case "!>":
                return findTarget("parentNode",parseTree,baseEle,type=="!",isBreak);
            case "!~":
            case "!+":
                return findTarget("previousElementSibling",parseTree,baseEle,type=="!~",isBreak);
            default:
                return findDefault(parseTree,baseEle,isBreak);
            
        }
    }
    
    function findTarget(type,parseTree,baseEle,bRise,isBreak){
        var revision = [];
        var result = [];
        if(parseTree.left){
            for(var i = 0 , l = baseEle.length; i < l; i++){
                revision = revision.concat(cssquery(parseTree.left,baseEle[i]));
            }
        }else{
            revision = baseEle;
        }
        var target;
        var right = parseTree.right;
        for(var i = 0, l = revision.length; i < l; i++){
            target = revision[i][type];
            
            if(bRise){
                while(target){
                    if(cssquery.test(target,right)){
                        result.push(target);
                        if(result.length>0&&isBreak){
                            break;
                        }
                    }
                    target = target[type];
                    // if(parent == document.documentElement) break;
                }
            }else{
                if(target&&cssquery.test(target,right)){
                    result.push(target);
                }
            }
            if(result.length>0&&isBreak){
                break;
            }
        }
        return result;
    }
    function findDefault(parseTree,baseEle,isBreak){
        var result = [];
        for(var i = 0 , l = baseEle.length; i < l; i++){
            result = result.concat(cssquery(parseTree.left,baseEle[i]));
            if(result.length > 0 && isBreak){
                break;
            }
        }
        
        return result;
    }
    
    
    var _div = document.createElement("div");
    
    /**
    {{cssquery_desc}}
     */
    cssquery = function(sQuery, oParent, oOptions){
        var oArgs = jindo.$Jindo.checkVarType(arguments, {
                '4str' : [ 'sQuery:String+'],
                '4var' : [ 'sQuery:String+', 'oParent:Variant' ],
                '4var2' : [ 'sQuery:String+', 'oParent:Variant', 'oOptions:Variant' ]
            }, "cssquery"),
            sTempId, aRet, nParentNodeType, sProperty, oOldParent, queryid, _clone, sTagName, _parent, vSelectorMethod, sQueryAttrName = "queryid";
        
        oParent = _getParentElement(oParent);
        oOptions = oOptions && oOptions.$value ? oOptions.$value() : oOptions;
        /*
        {{cssquery_desc_5}}
        */
        var re = /\[(.*?)=([\w\d]*)\]/g;

        if(re.test(sQuery)) {
            sQuery = sQuery.replace(re, "[$1='$2']");
        }
        
        if(_isNonStandardQueryButNotException(sQuery)){
            throw new jindo.$Error(jindo.$Except.NOT_SUPPORT_SELECTOR, (oOptions&&oOptions.single ? "<static> cssquery.getSingle" : "cssquery"));
        }

        nParentNodeType = oParent.nodeType;
        sTagName = (oParent.tagName || "").toUpperCase();
        
        vSelectorMethod = _getSelectorMethod(sQuery, nParentNodeType == 9);
        
        if(vSelectorMethod.query) {
            sQuery = vSelectorMethod.query;
        }
        
        vSelectorMethod = vSelectorMethod.method;
        
        if(nParentNodeType !== 9 && sTagName != "HTML"){
            if(nParentNodeType === 11){
                /*
                {{cssquery_desc_1}}
                */
                oParent = oParent.cloneNode(true);
                _clone = _div.cloneNode(true);
                _clone.appendChild(oParent);
                oParent = _clone;
                _clone = null;
            }
            
            if(!vSelectorMethod) {
                queryid = _addQueryId(oParent, sQueryAttrName);
                sQuery = _commaRevise(queryid+" "+ sQuery,", "+queryid+" ");
            }
            
            if((_parent = oParent.parentNode)||sTagName === "BODY"||jindo.$Element._contain((oParent.ownerDocument || oParent.document).body,oParent)){
                /*
                {{cssquery_desc_2}}
                */
                if(!vSelectorMethod) {
                    oOldParent = oParent;
                    oParent = _parent;
                }
            } else if(!vSelectorMethod) {
                /*
                {{cssquery_desc_3}}
                */
                _clone = _div.cloneNode(true);
                // id = oParent.id;
                oOldParent = oParent;
                _clone.appendChild(oOldParent);
                oParent = _clone;
            }

        }else{
            oParent = (oParent.ownerDocument || oParent.document || oParent);
            if(_startCombinator(sQuery)){
                return [];
            }
        }
        
        try{
            /*
            {{cssquery_desc_4}}
            */
            if(!/!=/.test(sQuery) && sQuery.indexOf("!") > -1){
                aRet = exclamationMarkQuery(sQuery, oParent, oOptions);
            } else {
                if(oOptions && oOptions.single){
                    if(vSelectorMethod) {
                        aRet = oParent[vSelectorMethod](sQuery);
                        aRet = [ vSelectorMethod == "getElementById" ? aRet : aRet[0] ];
                    } else {
                        aRet = [ oParent.querySelector(sQuery) ];
                    }
                } else {
                    if(vSelectorMethod) {
                        aRet = oParent[vSelectorMethod](sQuery);

                        if(vSelectorMethod == "getElementById") {
                            aRet = aRet ? [aRet] : [];
                        }
                    } else {
                        aRet = oParent.querySelectorAll(sQuery);    
                    }

                    aRet = jindo._p_._toArray(aRet);
                }
            }
        }catch(e){
            throw e;
        }finally{
            if(sProperty){
                oOldParent.removeAttribute(sQueryAttrName);
                _clone = null;
            }
        }
        
        return aRet;
    };
    
    /**
    {{test}}
     */
    cssquery.test = function(oEl, sQuery){
        if(!cssquery._dummyWrap){
            createDummy();
        }
        var bRet = false;
        
        if(oEl.nodeType == 1) {            
            var elDummyClone = oEl.cloneNode(false);

            cssquery._dummyWrap.appendChild(elDummyClone);
            bRet = cssquery.getSingle(sQuery, cssquery._dummyWrap) ? true : false;
            cssquery._dummyWrap.innerHTML = '';
        }
        
        return bRet;
    };
    
    /**
    {{useCache}}
     */
    cssquery.useCache = function(bFlag){
    };
    
    /**
    {{clearCache}}
     */
    cssquery.clearCache = function(){
    };
    /**
    {{release}}
     */
    cssquery.release = function(){
    };
    
    /**
    {{getSingle}}
     */
    cssquery.getSingle = function(sQuery, oParent, oOptions){
        return cssquery(sQuery, oParent, { single : true })[0] || null;
    };
    
    /**
    {{extreme}}
     */
    cssquery.extreme = function(bExtreme){
    };
    
    /**
     *  Test parser
     */
    cssquery._makeQueryParseTree = makeQueryParseTree;

    return cssquery;
})();
//-!jindo.cssquery end!-//
//-!jindo.$$.hidden start(jindo.cssquery)!-//
//-!jindo.$$.hidden end!-//