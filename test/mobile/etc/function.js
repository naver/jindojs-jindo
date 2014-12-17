/**
 
 * Jindo 1.4.2 custom includes
 
 * core, $$, $A, $A ext, $Agent, $Ajax, $Ajax ext, $Element, $Element ext, $Event, $Fn, $H,
 
 */

if (typeof window != "undefined" && typeof window.nhn == "undefined") {
    window.nhn = new Object;
}
if (typeof window != "undefined") {
    window.jindo = {};
} else {
    jindo = {};
}
jindo.$Jindo = function () {
    var cl = arguments.callee;
    var cc = cl._cached;
    if (cc) return cc;
    if (!(this instanceof cl)) return new cl();
    if (!cc) cl._cached = this;
    this.version = "$$version$$";
}
jindo.$ = function (sID) {
    var ret = new Array;
    var el = null;
    var reg = /^<([a-z]+|h[1-5])>$/i;
    var reg2 = /^<([a-z]+|h[1-5])(\s+[^>]+)?>/i;
    for (var i = 0; i < arguments.length; i++) {
        el = arguments[i];
        if (typeof el == "string") {
            el = el.replace(/^\s+|\s+$/g, "");
            if (reg.test(el)) {
                el = document.createElement(RegExp.$1);
            } else if (reg2.test(el)) {
                var p = {
                    thead: 'table',
                    tbody: 'table',
                    tr: 'tbody',
                    td: 'tr',
                    dt: 'dl',
                    dd: 'dl',
                    li: 'ul',
                    legend: 'fieldset'
                };
                var tag = RegExp.$1.toLowerCase();
                var parents = [];
                for (var j = 0; tag = p[tag]; j++) {
                    var o = document.createElement(tag);
                    if (j) o.appendChild(parents[j - 1]);
                    parents.push(o);
                }
                if (!parents[0]) parents[0] = document.createElement('div');
                var first = parents[0];
                jindo.$Element(first).html(el);
                for (el = first.firstChild; el; el = el.nextSibling) {
                    if (el.nodeType == 1) ret[ret.length] = el;
                }
            } else {
                el = document.getElementById(el);
            }
        }
        if (el) ret[ret.length] = el;
    }
    return ret.length > 1 ? ret : (ret[0] || null);
}
jindo.$Class = function (oDef) {
    function typeClass() {
        var t = this;
        var a = [];
        var superFunc = function (m, superClass, func) {
            if (m != 'constructor' && func.toString().indexOf("$super") > -1) {
                var funcArg = func.toString().replace(/function\s*\(([^\)]*)[\w\W]*/g, "$1").split(",");
                var funcStr = func.toString().replace(/function[^{]*{/, "").replace(/(\w|\.?)(this\.\$super|this)/g, function (m, m2, m3) {
                    if (!m2) {
                        return m3 + ".$super"
                    }
                    return m;
                });
                funcStr = funcStr.substr(0, funcStr.length - 1);
                func = superClass[m] = new Function(funcArg, funcStr);
            }
            return function () {
                var f = this.$this[m];
                var t = this.$this;
                var r = (t[m] = func).apply(t, arguments);
                t[m] = f;
                return r;
            };
        }
        while (typeof t._$superClass != "undefined") {
            t.$super = new Object;
            t.$super.$this = this;
            for (var x in t._$superClass.prototype) {
                if (typeof this[x] == "undefined" && x != "$init") this[x] = t._$superClass.prototype[x];
                if (x != 'constructor' && x != '_$superClass' && typeof t._$superClass.prototype[x] == "function") {
                    t.$super[x] = superFunc(x, t._$superClass, t._$superClass.prototype[x]);
                } else {
                    t.$super[x] = t._$superClass.prototype[x];
                }
            }
            if (typeof t.$super.$init == "function") a[a.length] = t;
            t = t.$super;
        }
        for (var i = a.length - 1; i > -1; i--) a[i].$super.$init.apply(a[i].$super, arguments);
        if (typeof this.$init == "function") this.$init.apply(this, arguments);
    }
    if (typeof oDef.$static != "undefined") {
        var i = 0,
            x;
        for (x in oDef) x == "$static" || i++;
        for (x in oDef.$static) typeClass[x] = oDef.$static[x];
        if (!i) return oDef.$static;
        delete oDef.$static;
    }
    typeClass.prototype = oDef;
    typeClass.prototype.constructor = typeClass;
    typeClass.extend = jindo.$Class.extend;
    return typeClass;
}
jindo.$Class.extend = function (superClass) {
    this.prototype._$superClass = superClass;
    for (var x in superClass) {
        if (x == "prototype") continue;
        this[x] = superClass[x];
    }
    return this;
};
jindo.$$ = jindo.cssquery = (function () {
    var sVersion = '2.3';
    var debugOption = {
        repeat: 1
    };
    var UID = 1;
    var cost = 0;
    var validUID = {};
    var bSupportByClassName = jindo.$('<DIV>').getElementsByClassName ? true : false;
    var safeHTML = false;
    var getUID4HTML = function (oEl) {
        var nUID = safeHTML ? (oEl._cssquery_UID && oEl._cssquery_UID[0]) : oEl._cssquery_UID;
        if (nUID && validUID[nUID] == oEl) return nUID;
        nUID = UID++;
        oEl._cssquery_UID = safeHTML ? [nUID] : nUID;
        validUID[nUID] = oEl;
        return nUID;
    };
    var getUID4XML = function (oEl) {
        var oAttr = oEl.getAttribute('_cssquery_UID');
        var nUID = safeHTML ? (oAttr && oAttr[0]) : oAttr;
        if (!nUID) {
            nUID = UID++;
            oEl.setAttribute('_cssquery_UID', safeHTML ? [nUID] : nUID);
        }
        return nUID;
    };
    var getUID = getUID4HTML;
    var uniqid = function (sPrefix) {
        return (sPrefix || '') + new Date().getTime() + parseInt(Math.random() * 100000000);
    };

    function getElementsByClass(searchClass, node, tag) {
        var classElements = new Array();
        if (node == null) node = document;
        if (tag == null) tag = '*';
        var els = node.getElementsByTagName(tag);
        var elsLen = els.length;
        var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
        for (i = 0, j = 0; i < elsLen; i++) {
            if (pattern.test(els[i].className)) {
                classElements[j] = els[i];
                j++;
            }
        }
        return classElements;
    }
    var getChilds_dontShrink = function (oEl, sTagName, sClassName) {
        if (bSupportByClassName && sClassName) {
            if (oEl.getElementsByClassName) return oEl.getElementsByClassName(sClassName);
            if (oEl.querySelectorAll) return oEl.querySelectorAll(sClassName);
            return getElementsByClass(sClassName, oEl, sTagName);
        } else if (sTagName == '*') {
            return oEl.all || oEl.getElementsByTagName(sTagName);
        }
        return oEl.getElementsByTagName(sTagName);
    };
    var clearKeys = function () {
        backupKeys._keys = {};
    };
    var oDocument_dontShrink = document;
    var bXMLDocument = false;
    var backupKeys = function (sQuery) {
        var oKeys = backupKeys._keys;
        sQuery = sQuery.replace(/'(\\'|[^'])*'/g, function (sAll) {
            var uid = uniqid('QUOT');
            oKeys[uid] = sAll;
            return uid;
        });
        sQuery = sQuery.replace(/"(\\"|[^"])*"/g, function (sAll) {
            var uid = uniqid('QUOT');
            oKeys[uid] = sAll;
            return uid;
        });
        sQuery = sQuery.replace(/\[(.*?)\]/g, function (sAll, sBody) {
            if (sBody.indexOf('ATTR') == 0) return sAll;
            var uid = '[' + uniqid('ATTR') + ']';
            oKeys[uid] = sAll;
            return uid;
        });
        var bChanged;
        do {
            bChanged = false;
            sQuery = sQuery.replace(/\(((\\\)|[^)|^(])*)\)/g, function (sAll, sBody) {
                if (sBody.indexOf('BRCE') == 0) return sAll;
                var uid = '_' + uniqid('BRCE');
                oKeys[uid] = sAll;
                bChanged = true;
                return uid;
            });
        } while (bChanged);
        return sQuery;
    };
    var restoreKeys = function (sQuery, bOnlyAttrBrace) {
        var oKeys = backupKeys._keys;
        var bChanged;
        var rRegex = bOnlyAttrBrace ? /(\[ATTR[0-9]+\])/g : /(QUOT[0-9]+|\[ATTR[0-9]+\])/g;
        do {
            bChanged = false;
            sQuery = sQuery.replace(rRegex, function (sKey) {
                if (oKeys[sKey]) {
                    bChanged = true;
                    return oKeys[sKey];
                }
                return sKey;
            });
        } while (bChanged);
        sQuery = sQuery.replace(/_BRCE[0-9]+/g, function (sKey) {
            return oKeys[sKey] ? oKeys[sKey] : sKey;
        });
        return sQuery;
    };
    var restoreString = function (sKey) {
        var oKeys = backupKeys._keys;
        var sOrg = oKeys[sKey];
        if (!sOrg) return sKey;
        return eval(sOrg);
    };
    var wrapQuot = function (sStr) {
        return '"' + sStr.replace(/"/g, '\\"') + '"';
    };
    var getStyleKey = function (sKey) {
        if (/^@/.test(sKey)) return sKey.substr(1);
        return null;
    };
    var getCSS = function (oEl, sKey) {
        if (oEl.currentStyle) {
            if (sKey == "float") sKey = "styleFloat";
            return oEl.currentStyle[sKey] || oEl.style[sKey];
        } else if (window.getComputedStyle) {
            return oDocument_dontShrink.defaultView.getComputedStyle(oEl, null).getPropertyValue(sKey.replace(/([A-Z])/g, "-$1").toLowerCase()) || oEl.style[sKey];
        }
        if (sKey == "float" && /MSIE/.test(window.navigator.userAgent)) sKey = "styleFloat";
        return oEl.style[sKey];
    };
    var oCamels = {
        'accesskey': 'accessKey',
        'cellspacing': 'cellSpacing',
        'cellpadding': 'cellPadding',
        'class': 'className',
        'colspan': 'colSpan',
        'for': 'htmlFor',
        'maxlength': 'maxLength',
        'readonly': 'readOnly',
        'rowspan': 'rowSpan',
        'tabindex': 'tabIndex',
        'valign': 'vAlign'
    };
    var getDefineCode = function (sKey) {
        var sVal;
        var sStyleKey;
        if (bXMLDocument) {
            sVal = 'oEl.getAttribute("' + sKey + '",2)';
        } else {
            if (sStyleKey = getStyleKey(sKey)) {
                sKey = '$$' + sStyleKey;
                sVal = 'getCSS(oEl, "' + sStyleKey + '")';
            } else {
                switch (sKey) {
                case 'checked':
                    sVal = 'oEl.checked + ""';
                    break;
                case 'disabled':
                    sVal = 'oEl.disabled + ""';
                    break;
                case 'enabled':
                    sVal = '!oEl.disabled + ""';
                    break;
                case 'readonly':
                    sVal = 'oEl.readOnly + ""';
                    break;
                case 'selected':
                    sVal = 'oEl.selected + ""';
                    break;
                default:
                    if (oCamels[sKey]) {
                        sVal = 'oEl.' + oCamels[sKey];
                    } else {
                        sVal = 'oEl.getAttribute("' + sKey + '",2)';
                    }
                }
            }
        }
        return '_' + sKey + ' = ' + sVal;
    };
    var getReturnCode = function (oExpr) {
        var sStyleKey = getStyleKey(oExpr.key);
        var sVar = '_' + (sStyleKey ? '$$' + sStyleKey : oExpr.key);
        var sVal = oExpr.val ? wrapQuot(oExpr.val) : '';
        switch (oExpr.op) {
        case '~=':
            return '(' + sVar + ' && (" " + ' + sVar + ' + " ").indexOf(" " + ' + sVal + ' + " ") > -1)';
        case '^=':
            return '(' + sVar + ' && ' + sVar + '.indexOf(' + sVal + ') == 0)';
        case '$=':
            return '(' + sVar + ' && ' + sVar + '.substr(' + sVar + '.length - ' + oExpr.val.length + ') == ' + sVal + ')';
        case '*=':
            return '(' + sVar + ' && ' + sVar + '.indexOf(' + sVal + ') > -1)';
        case '!=':
            return '(' + sVar + ' != ' + sVal + ')';
        case '=':
            return '(' + sVar + ' == ' + sVal + ')';
        }
        return '(' + sVar + ')';
    };
    var getNodeIndex = function (oEl) {
        var nUID = getUID(oEl);
        var nIndex = oNodeIndexes[nUID] || 0;
        if (nIndex == 0) {
            for (var oSib = (oEl.parentNode || oEl._IE5_parentNode).firstChild; oSib; oSib = oSib.nextSibling) {
                if (oSib.nodeType != 1) continue;
                nIndex++;
                setNodeIndex(oSib, nIndex);
            }
            nIndex = oNodeIndexes[nUID];
        }
        return nIndex;
    };
    var oNodeIndexes = {};
    var setNodeIndex = function (oEl, nIndex) {
        var nUID = getUID(oEl);
        oNodeIndexes[nUID] = nIndex;
    };
    var unsetNodeIndexes = function () {
        setTimeout(function () {
            oNodeIndexes = {};
        }, 0);
    };
    var oPseudoes_dontShrink = {
        'contains': function (oEl, sOption) {
            return (oEl.innerText || oEl.textContent || '').indexOf(sOption) > -1;
        }, 'last-child': function (oEl, sOption) {
            for (oEl = oEl.nextSibling; oEl; oEl = oEl.nextSibling) {
                if (oEl.nodeType == 1) return false;
            }
            return true;
        }, 'first-child': function (oEl, sOption) {
            for (oEl = oEl.previousSibling; oEl; oEl = oEl.previousSibling) {
                if (oEl.nodeType == 1) return false;
            }
            return true;
        }, 'only-child': function (oEl, sOption) {
            var nChild = 0;
            for (var oChild = (oEl.parentNode || oEl._IE5_parentNode).firstChild; oChild; oChild = oChild.nextSibling) {
                if (oChild.nodeType == 1) nChild++;
                if (nChild > 1) return false;
            }
            return nChild ? true : false;
        }, 'empty': function (oEl, _) {
            return oEl.firstChild ? false : true;
        }, 'nth-child': function (oEl, nMul, nAdd) {
            var nIndex = getNodeIndex(oEl);
            return nIndex % nMul == nAdd;
        }, 'nth-last-child': function (oEl, nMul, nAdd) {
            var oLast = (oEl.parentNode || oEl._IE5_parentNode).lastChild;
            for (; oLast; oLast = oLast.previousSibling) {
                if (oLast.nodeType == 1) break;
            }
            var nTotal = getNodeIndex(oLast);
            var nIndex = getNodeIndex(oEl);
            var nLastIndex = nTotal - nIndex + 1;
            return nLastIndex % nMul == nAdd;
        }
    };
    var getExpression = function (sBody) {
        var oRet = {
            defines: '',
            returns: 'true'
        };
        var sBody = restoreKeys(sBody, true);
        var aExprs = [];
        var aDefineCode = [],
            aReturnCode = [];
        var sId, sTagName;
        var sBody = sBody.replace(/:([\w-]+)(\(([^)]*)\))?/g, function (_1, sType, _2, sOption) {
            switch (sType) {
            case 'not':
                var oInner = getExpression(sOption);
                var sFuncDefines = oInner.defines;
                var sFuncReturns = oInner.returnsID + oInner.returnsTAG + oInner.returns;
                aReturnCode.push('!(function() { ' + sFuncDefines + ' return ' + sFuncReturns + ' })()');
                break;
            case 'nth-child':
            case 'nth-last-child':
                sOption = restoreString(sOption);
                if (sOption == 'even') {
                    sOption = '2n';
                } else if (sOption == 'odd') {
                    sOption = '2n+1';
                }
                var nMul, nAdd;
                if (/([0-9]*)n([+-][0-9]+)*/.test(sOption)) {
                    nMul = parseInt(RegExp.$1) || 1;
                    nAdd = parseInt(RegExp.$2) || 0;
                } else {
                    nMul = Infinity;
                    nAdd = parseInt(sOption);
                }
                aReturnCode.push('oPseudoes_dontShrink[' + wrapQuot(sType) + '](oEl, ' + nMul + ', ' + nAdd + ')');
                break;
            case 'first-of-type':
            case 'last-of-type':
                sType = (sType == 'first-of-type' ? 'nth-of-type' : 'nth-last-of-type');
                sOption = 1;
            case 'nth-of-type':
            case 'nth-last-of-type':
                sOption = restoreString(sOption);
                if (sOption == 'even') {
                    sOption = '2n';
                } else if (sOption == 'odd') {
                    sOption = '2n+1';
                }
                var nMul, nAdd;
                if (/([0-9]*)n([+-][0-9]+)*/.test(sOption)) {
                    nMul = parseInt(RegExp.$1) || 1;
                    nAdd = parseInt(RegExp.$2) || 0;
                } else {
                    nMul = Infinity;
                    nAdd = parseInt(sOption);
                }
                oRet.nth = [nMul, nAdd, sType];
                break;
            default:
                sOption = sOption ? restoreString(sOption) : '';
                aReturnCode.push('oPseudoes_dontShrink[' + wrapQuot(sType) + '](oEl, ' + wrapQuot(sOption) + ')');
                break;
            }
            return '';
        });
        var sBody = sBody.replace(/\[(@?[\w-]+)(([!^~$*]?=)([^\]]*))?\]/g, function (_1, sKey, _2, sOp, sVal) {
            sKey = restoreString(sKey);
            sVal = restoreString(sVal);
            if (sKey == 'checked' || sKey == 'disabled' || sKey == 'enabled' || sKey == 'readonly' || sKey == 'selected') {
                if (!sVal) {
                    sOp = '=';
                    sVal = 'true';
                }
            }
            aExprs.push({
                key: sKey,
                op: sOp,
                val: sVal
            });
            return '';
        });
        var sClassName = null;
        var sBody = sBody.replace(/\.([\w-]+)/g, function (_, sClass) {
            aExprs.push({
                key: 'class',
                op: '~=',
                val: sClass
            });
            if (!sClassName) sClassName = sClass;
            return '';
        });
        var sBody = sBody.replace(/#([\w-]+)/g, function (_, sIdValue) {
            if (bXMLDocument) {
                aExprs.push({
                    key: 'id',
                    op: '=',
                    val: sIdValue
                });
            } else {
                sId = sIdValue;
            }
            return '';
        });
        sTagName = sBody == '*' ? '' : sBody;
        var oVars = {};
        for (var i = 0, oExpr; oExpr = aExprs[i]; i++) {
            var sKey = oExpr.key;
            if (!oVars[sKey]) aDefineCode.push(getDefineCode(sKey));
            aReturnCode.unshift(getReturnCode(oExpr));
            oVars[sKey] = true;
        }
        if (aDefineCode.length) oRet.defines = 'var ' + aDefineCode.join(',') + ';';
        if (aReturnCode.length) oRet.returns = aReturnCode.join('&&');
        oRet.quotID = sId ? wrapQuot(sId) : '';
        oRet.quotTAG = sTagName ? wrapQuot(bXMLDocument ? sTagName : sTagName.toUpperCase()) : '';
        if (bSupportByClassName) oRet.quotCLASS = sClassName ? wrapQuot(sClassName) : '';
        oRet.returnsID = sId ? 'oEl.id == ' + oRet.quotID + ' && ' : '';
        oRet.returnsTAG = sTagName && sTagName != '*' ? 'oEl.tagName == ' + oRet.quotTAG + ' && ' : '';
        return oRet;
    };
    var splitToParts = function (sQuery) {
        var aParts = [];
        var sRel = ' ';
        var sBody = sQuery.replace(/(.*?)\s*(!?[+>~ ]|!)\s*/g, function (_, sBody, sRelative) {
            if (sBody) aParts.push({
                rel: sRel,
                body: sBody
            });
            sRel = sRelative.replace(/\s+$/g, '') || ' ';
            return '';
        });
        if (sBody) aParts.push({
            rel: sRel,
            body: sBody
        });
        return aParts;
    };
    var isNth_dontShrink = function (oEl, sTagName, nMul, nAdd, sDirection) {
        var nIndex = 0;
        for (var oSib = oEl; oSib; oSib = oSib[sDirection]) {
            if (oSib.nodeType == 1 && (!sTagName || sTagName == oSib.tagName)) nIndex++;
        }
        return nIndex % nMul == nAdd;
    };
    var compileParts = function (aParts) {
        var aPartExprs = [];
        for (var i = 0, oPart; oPart = aParts[i]; i++)
        aPartExprs.push(getExpression(oPart.body));
        var sFunc = '';
        var sPushCode = 'aRet.push(oEl); if (oOptions.single) { bStop = true; }';
        for (var i = aParts.length - 1, oPart; oPart = aParts[i]; i--) {
            var oExpr = aPartExprs[i];
            var sPush = (debugOption.callback ? 'cost++;' : '') + oExpr.defines;
            var sReturn = 'if (bStop) {' + (i == 0 ? 'return aRet;' : 'return;') + '}';
            if (oExpr.returns == 'true') {
                sPush += (sFunc ? sFunc + '(oEl);' : sPushCode) + sReturn;
            } else {
                sPush += 'if (' + oExpr.returns + ') {' + (sFunc ? sFunc + '(oEl);' : sPushCode) + sReturn + '}';
            }
            var sCheckTag = 'oEl.nodeType != 1';
            if (oExpr.quotTAG) sCheckTag = 'oEl.tagName != ' + oExpr.quotTAG;
            var sTmpFunc = '(function(oBase' + (i == 0 ? ', oOptions) { var bStop = false; var aRet = [];' : ') {');
            if (oExpr.nth) {
                sPush = 'if (isNth_dontShrink(oEl, ' + (oExpr.quotTAG ? oExpr.quotTAG : 'false') + ',' + oExpr.nth[0] + ',' + oExpr.nth[1] + ',' + '"' + (oExpr.nth[2] == 'nth-of-type' ? 'previousSibling' : 'nextSibling') + '")) {' + sPush + '}';
            }
            switch (oPart.rel) {
            case ' ':
                if (oExpr.quotID) {
                    sTmpFunc += 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' + 'var oCandi = oEl;' + 'for (; oCandi; oCandi = (oCandi.parentNode || oCandi._IE5_parentNode)) {' + 'if (oCandi == oBase) break;' + '}' + 'if (!oCandi || ' + sCheckTag + ') return aRet;' + sPush;
                } else {
                    sTmpFunc += 'var aCandi = getChilds_dontShrink(oBase, ' + (oExpr.quotTAG || '"*"') + ', ' + (oExpr.quotCLASS || 'null') + ');' + 'for (var i = 0, oEl; oEl = aCandi[i]; i++) {' + (oExpr.quotCLASS ? 'if (' + sCheckTag + ') continue;' : '') + sPush + '}';
                }
                break;
            case '>':
                if (oExpr.quotID) {
                    sTmpFunc += 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' + 'if ((oEl.parentNode || oEl._IE5_parentNode) != oBase || ' + sCheckTag + ') return aRet;' + sPush;
                } else {
                    sTmpFunc += 'for (var oEl = oBase.firstChild; oEl; oEl = oEl.nextSibling) {' + 'if (' + sCheckTag + ') { continue; }' + sPush + '}';
                }
                break;
            case '+':
                if (oExpr.quotID) {
                    sTmpFunc += 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' + 'var oPrev;' + 'for (oPrev = oEl.previousSibling; oPrev; oPrev = oPrev.previousSibling) { if (oPrev.nodeType == 1) break; }' + 'if (!oPrev || oPrev != oBase || ' + sCheckTag + ') return aRet;' + sPush;
                } else {
                    sTmpFunc += 'for (var oEl = oBase.nextSibling; oEl; oEl = oEl.nextSibling) { if (oEl.nodeType == 1) break; }' + 'if (!oEl || ' + sCheckTag + ') { return aRet; }' + sPush;
                }
                break;
            case '~':
                if (oExpr.quotID) {
                    sTmpFunc += 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' + 'var oCandi = oEl;' + 'for (; oCandi; oCandi = oCandi.previousSibling) { if (oCandi == oBase) break; }' + 'if (!oCandi || ' + sCheckTag + ') return aRet;' + sPush;
                } else {
                    sTmpFunc += 'for (var oEl = oBase.nextSibling; oEl; oEl = oEl.nextSibling) {' + 'if (' + sCheckTag + ') { continue; }' + 'if (!markElement_dontShrink(oEl, ' + i + ')) { break; }' + sPush + '}';
                }
                break;
            case '!':
                if (oExpr.quotID) {
                    sTmpFunc += 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' + 'for (; oBase; oBase = (oBase.parentNode || oBase._IE5_parentNode)) { if (oBase == oEl) break; }' + 'if (!oBase || ' + sCheckTag + ') return aRet;' + sPush;
                } else {
                    sTmpFunc += 'for (var oEl = (oBase.parentNode || oBase._IE5_parentNode); oEl; oEl = (oEl.parentNode || oEl._IE5_parentNode)) {' + 'if (' + sCheckTag + ') { continue; }' + sPush + '}';
                }
                break;
            case '!>':
                if (oExpr.quotID) {
                    sTmpFunc += 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' + 'var oRel = (oBase.parentNode || oBase._IE5_parentNode);' + 'if (!oRel || oEl != oRel || (' + sCheckTag + ')) return aRet;' + sPush;
                } else {
                    sTmpFunc += 'var oEl = (oBase.parentNode || oBase._IE5_parentNode);' + 'if (!oEl || ' + sCheckTag + ') { return aRet; }' + sPush;
                }
                break;
            case '!+':
                if (oExpr.quotID) {
                    sTmpFunc += 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' + 'var oRel;' + 'for (oRel = oBase.previousSibling; oRel; oRel = oRel.previousSibling) { if (oRel.nodeType == 1) break; }' + 'if (!oRel || oEl != oRel || (' + sCheckTag + ')) return aRet;' + sPush;
                } else {
                    sTmpFunc += 'for (oEl = oBase.previousSibling; oEl; oEl = oEl.previousSibling) { if (oEl.nodeType == 1) break; }' + 'if (!oEl || ' + sCheckTag + ') { return aRet; }' + sPush;
                }
                break;
            case '!~':
                if (oExpr.quotID) {
                    sTmpFunc += 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' + 'var oRel;' + 'for (oRel = oBase.previousSibling; oRel; oRel = oRel.previousSibling) { ' + 'if (oRel.nodeType != 1) { continue; }' + 'if (oRel == oEl) { break; }' + '}' + 'if (!oRel || (' + sCheckTag + ')) return aRet;' + sPush;
                } else {
                    sTmpFunc += 'for (oEl = oBase.previousSibling; oEl; oEl = oEl.previousSibling) {' + 'if (' + sCheckTag + ') { continue; }' + 'if (!markElement_dontShrink(oEl, ' + i + ')) { break; }' + sPush + '}';
                }
                break;
            }
            sTmpFunc += (i == 0 ? 'return aRet;' : '') + '})';
            sFunc = sTmpFunc;
        }
        eval('var fpCompiled = ' + sFunc + ';');
        return fpCompiled;
    };
    var parseQuery = function (sQuery) {
        var sCacheKey = sQuery;
        var fpSelf = arguments.callee;
        var fpFunction = fpSelf._cache[sCacheKey];
        if (!fpFunction) {
            sQuery = backupKeys(sQuery);
            var aParts = splitToParts(sQuery);
            fpFunction = fpSelf._cache[sCacheKey] = compileParts(aParts);
            fpFunction.depth = aParts.length;
        }
        return fpFunction;
    };
    parseQuery._cache = {};
    var parseTestQuery = function (sQuery) {
        var fpSelf = arguments.callee;
        var aSplitQuery = backupKeys(sQuery).split(/\s*,\s*/);
        var aResult = [];
        var nLen = aSplitQuery.length;
        var aFunc = [];
        for (var i = 0; i < nLen; i++) {
            aFunc.push((function (sQuery) {
                var sCacheKey = sQuery;
                var fpFunction = fpSelf._cache[sCacheKey];
                if (!fpFunction) {
                    sQuery = backupKeys(sQuery);
                    var oExpr = getExpression(sQuery);
                    eval('fpFunction = function(oEl) { ' + oExpr.defines + 'return (' + oExpr.returnsID + oExpr.returnsTAG + oExpr.returns + '); };');
                }
                return fpFunction;
            })(restoreKeys(aSplitQuery[i])));
        }
        return aFunc;
    };
    parseTestQuery._cache = {};
    var distinct = function (aList) {
        var aDistinct = [];
        var oDummy = {};
        for (var i = 0, oEl; oEl = aList[i]; i++) {
            var nUID = getUID(oEl);
            if (oDummy[nUID]) continue;
            aDistinct.push(oEl);
            oDummy[nUID] = true;
        }
        return aDistinct;
    };
    var markElement_dontShrink = function (oEl, nDepth) {
        var nUID = getUID(oEl);
        if (cssquery._marked[nDepth][nUID]) return false;
        cssquery._marked[nDepth][nUID] = true;
        return true;
    };
    var oResultCache = null;
    var bUseResultCache = false;
    var cssquery = function (sQuery, oParent, oOptions) {
        if (typeof sQuery == 'object') {
            var oResult = {};
            for (var k in sQuery)
            oResult[k] = arguments.callee(sQuery[k], oParent, oOptions);
            return oResult;
        }
        cost = 0;
        var executeTime = new Date().getTime();
        var aRet;
        for (var r = 0, rp = debugOption.repeat; r < rp; r++) {
            aRet = (function (sQuery, oParent, oOptions) {
                if (oOptions) {
                    if (!oOptions.oneTimeOffCache) {
                        oOptions.oneTimeOffCache = false;
                    }
                } else {
                    oOptions = {
                        oneTimeOffCache: false
                    };
                }
                cssquery.safeHTML(oOptions.oneTimeOffCache);
                if (!oParent) oParent = document;
                oDocument_dontShrink = oParent.ownerDocument || oParent.document || oParent;
                if (/\bMSIE\s([0-9]+(\.[0-9]+)*);/.test(navigator.userAgent) && parseFloat(RegExp.$1) < 6) {
                    try {
                        oDocument_dontShrink.location;
                    } catch (e) {
                        oDocument_dontShrink = document;
                    }
                    oDocument_dontShrink.firstChild = oDocument_dontShrink.getElementsByTagName('html')[0];
                    oDocument_dontShrink.firstChild._IE5_parentNode = oDocument_dontShrink;
                }
                bXMLDocument = (typeof XMLDocument != 'undefined') ? (oDocument_dontShrink.constructor === XMLDocument) : (!oDocument_dontShrink.location);
                getUID = bXMLDocument ? getUID4XML : getUID4HTML;
                clearKeys();
                var aSplitQuery = backupKeys(sQuery).split(/\s*,\s*/);
                var aResult = [];
                var nLen = aSplitQuery.length;
                for (var i = 0; i < nLen; i++)
                aSplitQuery[i] = restoreKeys(aSplitQuery[i]);
                for (var i = 0; i < nLen; i++) {
                    var sSingleQuery = aSplitQuery[i];
                    var aSingleQueryResult = null;
                    var sResultCacheKey = sSingleQuery + (oOptions.single ? '_single' : '');
                    var aCache = bUseResultCache ? oResultCache[sResultCacheKey] : null;
                    if (aCache) {
                        for (var j = 0, oCache; oCache = aCache[j]; j++) {
                            if (oCache.parent == oParent) {
                                aSingleQueryResult = oCache.result;
                                break;
                            }
                        }
                    }
                    if (!aSingleQueryResult) {
                        var fpFunction = parseQuery(sSingleQuery);
                        cssquery._marked = [];
                        for (var j = 0, nDepth = fpFunction.depth; j < nDepth; j++)
                        cssquery._marked.push({});
                        aSingleQueryResult = distinct(fpFunction(oParent, oOptions));
                        if (bUseResultCache && !oOptions.oneTimeOffCache) {
                            if (!(oResultCache[sResultCacheKey] instanceof Array)) oResultCache[sResultCacheKey] = [];
                            oResultCache[sResultCacheKey].push({
                                parent: oParent,
                                result: aSingleQueryResult
                            });
                        }
                    }
                    aResult = aResult.concat(aSingleQueryResult);
                }
                unsetNodeIndexes();
                return aResult;
            })(sQuery, oParent, oOptions);
        }
        executeTime = new Date().getTime() - executeTime;
        if (debugOption.callback) debugOption.callback(sQuery, cost, executeTime);
        return aRet;
    };
    cssquery.test = function (oEl, sQuery) {
        clearKeys();
        var aFunc = parseTestQuery(sQuery);
        for (var i = 0, nLen = aFunc.length; i < nLen; i++) {
            if (aFunc[i](oEl)) return true;
        }
        return false;
    };
    cssquery.useCache = function (bFlag) {
        if (typeof bFlag != 'undefined') {
            bUseResultCache = bFlag;
            cssquery.clearCache();
        }
        return bUseResultCache;
    };
    cssquery.clearCache = function () {
        oResultCache = {};
    };
    cssquery.getSingle = function (sQuery, oParent, oOptions) {
        return cssquery(sQuery, oParent, {
            single: true,
            oneTimeOffCache: oOptions ? ( !! oOptions.oneTimeOffCache) : false
        })[0] || null;
    };
    cssquery.xpath = function (sXPath, oParent) {
        var sXPath = sXPath.replace(/\/(\w+)(\[([0-9]+)\])?/g, function (_1, sTag, _2, sTh) {
            sTh = sTh || '1';
            return '>' + sTag + ':nth-of-type(' + sTh + ')';
        });
        return cssquery(sXPath, oParent);
    };
    cssquery.debug = function (fpCallback, nRepeat) {
        debugOption.callback = fpCallback;
        debugOption.repeat = nRepeat || 1;
    };
    cssquery.safeHTML = function (bFlag) {
        var bIE = /MSIE/.test(window.navigator.userAgent);
        if (arguments.length > 0) safeHTML = bFlag && bIE;
        return safeHTML || !bIE;
    };
    cssquery.version = sVersion;
    cssquery.release = function () {
        if (/MSIE/.test(window.navigator.userAgent)) {
            delete validUID;
            validUID = {};
            if (bUseResultCache) {
                cssquery.clearCache();
            }
        }
    };
    cssquery._getCacheInfo = function () {
        return {
            uidCache: validUID,
            eleCache: oResultCache
        }
    }
    cssquery._resetUID = function () {
        UID = 0
    }
    return cssquery;
})();
jindo.$A = function (array) {
    var cl = arguments.callee;
    if (typeof array == "undefined") array = [];
    if (array instanceof cl) return array;
    if (!(this instanceof cl)) return new cl(array);
    this._array = []
    if (array.constructor != String) {
        this._array = [];
        for (var i = 0; i < array.length; i++) {
            this._array[this._array.length] = array[i];
        }
    }
};
jindo.$A.prototype.toString = function () {
    return this._array.toString();
};
jindo.$A.prototype.get = function (nIndex) {
    return this._array[nIndex];
};
jindo.$A.prototype.length = function (nLen, oValue) {
    if (typeof nLen == "number") {
        var l = this._array.length;
        this._array.length = nLen;
        if (typeof oValue != "undefined") {
            for (var i = l; i < nLen; i++) {
                this._array[i] = oValue;
            }
        }
        return this;
    } else {
        return this._array.length;
    }
};
jindo.$A.prototype.has = function (oValue) {
    return (this.indexOf(oValue) > -1);
};
jindo.$A.prototype.indexOf = function (oValue) {
    if (typeof this._array.indexOf != 'undefined') return this._array.indexOf(oValue);
    for (var i = 0; i < this._array.length; i++) {
        if (this._array[i] == oValue) return i;
    }
    return -1;
};
jindo.$A.prototype.$value = function () {
    return this._array;
};
jindo.$A.prototype.push = function (oValue1) {
    return this._array.push.apply(this._array, Array.prototype.slice.apply(arguments));
};
jindo.$A.prototype.pop = function () {
    return this._array.pop();
};
jindo.$A.prototype.shift = function () {
    return this._array.shift();
};
jindo.$A.prototype.unshift = function (oValue1) {
    this._array.unshift.apply(this._array, Array.prototype.slice.apply(arguments));
    return this._array.length;
};
jindo.$A.prototype.forEach = function (fCallback, oThis) {
    var arr = this._array;
    var errBreak = this.constructor.Break;
    var errContinue = this.constructor.Continue;

    function f(v, i, a) {
        try {
            fCallback.call(oThis, v, i, a);
        } catch (e) {
            if (!(e instanceof errContinue)) throw e;
        }
    };
    if (typeof this._array.forEach == "function") {
        try {
            this._array.forEach(f);
        } catch (e) {
            if (!(e instanceof errBreak)) throw e;
        }
        return this;
    }
    for (var i = 0; i < arr.length; i++) {
        try {
            f(arr[i], i, arr);
        } catch (e) {
            if (e instanceof errBreak) break;
            throw e;
        }
    }
    return this;
};
jindo.$A.prototype.slice = function (nStart, nEnd) {
    var a = this._array.slice.call(this._array, nStart, nEnd);
    return jindo.$A(a);
};
jindo.$A.prototype.splice = function (nIndex, nHowMany) {
    var a = this._array.splice.apply(this._array, Array.prototype.slice.apply(arguments));
    return jindo.$A(a);
};
jindo.$A.prototype.shuffle = function () {
    this._array.sort(function (a, b) {
        return Math.random() > Math.random() ? 1 : -1
    });
    return this;
};
jindo.$A.prototype.reverse = function () {
    this._array.reverse();
    return this;
};
jindo.$A.prototype.empty = function () {
    return this.length(0);
};
jindo.$A.Break = function () {
    if (!(this instanceof arguments.callee)) throw new arguments.callee;
};
jindo.$A.Continue = function () {
    if (!(this instanceof arguments.callee)) throw new arguments.callee;
};
jindo.$A.prototype.map = function (fCallback, oThis) {
    var arr = this._array;
    var errBreak = this.constructor.Break;
    var errContinue = this.constructor.Continue;

    function f(v, i, a) {
        try {
            return fCallback.call(oThis, v, i, a);
        } catch (e) {
            if (e instanceof errContinue) {
                return v;
            } else {
                throw e;
            }
        }
    };
    if (typeof this._array.map == "function") {
        try {
            this._array = this._array.map(f);
        } catch (e) {
            if (!(e instanceof errBreak)) throw e;
        }
        return this;
    }
    for (var i = 0; i < this._array.length; i++) {
        try {
            arr[i] = f(arr[i], i, arr);
        } catch (e) {
            if (e instanceof errBreak) break;
            throw e;
        }
    }
    return this;
};
jindo.$A.prototype.filter = function (fCallback, oThis) {
    var ar = new Array;
    this.forEach(function (v, i, a) {
        if (fCallback.call(oThis, v, i, a) === true) {
            ar[ar.length] = v;
        }
    });
    return jindo.$A(ar);
};
jindo.$A.prototype.every = function (fCallback, oThis) {
    if (typeof this._array.every != "undefined") return this._array.every(fCallback, oThis);
    var result = true;
    this.forEach(function (v, i, a) {
        if (fCallback.call(oThis, v, i, a) === false) {
            result = false;
            jindo.$A.Break();
        }
    });
    return result;
};
jindo.$A.prototype.some = function (fCallback, oThis) {
    if (typeof this._array.some != "undefined") return this._array.some(fCallback, oThis);
    var result = false;
    this.forEach(function (v, i, a) {
        if (fCallback.call(oThis, v, i, a) === true) {
            result = true;
            jindo.$A.Break();
        }
    });
    return result;
};
jindo.$A.prototype.refuse = function (oValue1) {
    var a = jindo.$A(Array.prototype.slice.apply(arguments));
    return this.filter(function (v, i) {
        return !a.has(v)
    });
};
jindo.$A.prototype.unique = function () {
    var a = this._array,
        b = [],
        l = a.length;
    var i, j;
    for (i = 0; i < l; i++) {
        for (j = 0; j < b.length; j++) {
            if (a[i] == b[j]) break;
        }
        if (j >= b.length) b[j] = a[i];
    }
    this._array = b;
    return this;
};
jindo.$Agent = function () {
    var cl = arguments.callee;
    var cc = cl._cached;
    if (cc) return cc;
    if (!(this instanceof cl)) return new cl;
    if (!cc) cl._cached = this;
    this._navigator = navigator;
}
jindo.$Agent.prototype.navigator = function () {
    var info = new Object;
    var ver = -1;
    var nativeVersion = -1;
    var u = this._navigator.userAgent;
    var v = this._navigator.vendor || "";

    function f(s, h) {
        return ((h || "").indexOf(s) > -1)
    };
    info.getName = function () {
        var name = "";
        for (x in info) {
            if (typeof info[x] == "boolean" && info[x]) name = x;
        }
        return name;
    }
    info.webkit = f("WebKit", u);
    info.opera = (typeof window.opera != "undefined") || f("Opera", u);
    info.ie = !info.opera && f("MSIE", u);
    info.chrome = info.webkit && f("Chrome", u);
    info.safari = info.webkit && !info.chrome && f("Apple", v);
    info.firefox = f("Firefox", u);
    info.mozilla = f("Gecko", u) && !info.safari && !info.chrome && !info.firefox;
    info.camino = f("Camino", v);
    info.netscape = f("Netscape", u);
    info.omniweb = f("OmniWeb", u);
    info.icab = f("iCab", v);
    info.konqueror = f("KDE", v);
    try {
        if (info.ie) {
            ver = u.match(/(?:MSIE) ([0-9.]+)/)[1];
            if (u.match(/(?:Trident)\/([0-9.]+)/) && u.match(/(?:Trident)\/([0-9.]+)/)[1] == 4) {
                nativeVersion = 8;
            }
        } else if (info.firefox || info.opera || info.omniweb) {
            ver = u.match(/(?:Firefox|Opera|OmniWeb)\/([0-9.]+)/)[1];
        } else if (info.mozilla) {
            ver = u.match(/rv:([0-9.]+)/)[1];
        } else if (info.safari) {
            ver = parseFloat(u.match(/Safari\/([0-9.]+)/)[1]);
            if (ver == 100) {
                ver = 1.1;
            } else {
                ver = [1.0, 1.2, -1, 1.3, 2.0, 3.0][Math.floor(ver / 100)];
            }
        } else if (info.icab) {
            ver = u.match(/iCab[ \/]([0-9.]+)/)[1];
        } else if (info.chrome) {
            ver = u.match(/Chrome[ \/]([0-9.]+)/)[1];
        }
        info.version = parseFloat(ver);
        info.nativeVersion = parseFloat(nativeVersion);
        if (isNaN(info.version)) info.version = -1;
    } catch (e) {
        info.version = -1;
    }
    this.navigator = function () {
        return info;
    };
    return info;
};
jindo.$Agent.prototype.os = function () {
    var info = new Object;
    var u = this._navigator.userAgent;
    var p = this._navigator.platform;
    var f = function (s, h) {
        return (h.indexOf(s) > -1)
    };
    info.getName = function () {
        var name = "";
        for (x in info) {
            if (typeof info[x] == "boolean" && info[x]) name = x;
        }
        return name;
    }
    info.win = f("Win", p)
    info.mac = f("Mac", p);
    info.linux = f("Linux", p);
    info.win2000 = info.win && (f("NT 5.0", u) || f("2000", u));
    info.winxp = info.win && f("NT 5.1", u);
    info.xpsp2 = info.winxp && f("SV1", u);
    info.vista = info.win && f("NT 6.0", u);
    info.win7 = info.win && f("NT 6.1", u);
    this.os = function () {
        return info;
    };
    return info;
};
jindo.$Agent.prototype.flash = function () {
    var info = new Object;
    var p = this._navigator.plugins;
    var m = this._navigator.mimeTypes;
    var f = null;
    info.installed = false;
    info.version = -1;
    if (typeof p != "undefined" && p.length) {
        f = p["Shockwave Flash"];
        if (f) {
            info.installed = true;
            if (f.description) {
                info.version = parseFloat(f.description.match(/[0-9.]+/)[0]);
            }
        }
        if (p["Shockwave Flash 2.0"]) {
            info.installed = true;
            info.version = 2;
        }
    } else if (typeof m != "undefined" && m.length) {
        f = m["application/x-shockwave-flash"];
        info.installed = (f && f.enabledPlugin);
    } else {
        for (var i = 10; i > 1; i--) {
            try {
                f = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
                info.installed = true;
                info.version = i;
                break;
            } catch (e) {}
        }
    }
    this.flash = function () {
        return info;
    };
    this.info = this.flash;
    return info;
};
jindo.$Agent.prototype.silverlight = function () {
    var info = new Object;
    var p = this._navigator.plugins;
    var s = null;
    info.installed = false;
    info.version = -1;
    if (typeof p != "undefined" && p.length) {
        s = p["Silverlight Plug-In"];
        if (s) {
            info.installed = true;
            info.version = parseInt(s.description.split(".")[0]);
            if (s.description == "1.0.30226.2") info.version = 2;
        }
    } else {
        try {
            s = new ActiveXObject("AgControl.AgControl");
            info.installed = true;
            if (s.isVersionSupported("3.0")) {
                info.version = 3;
            } else if (s.isVersionSupported("2.0")) {
                info.version = 2;
            } else if (s.isVersionSupported("1.0")) {
                info.version = 1;
            }
        } catch (e) {}
    }
    this.silverlight = function () {
        return info;
    };
    return info;
};
jindo.$Ajax = function (url, option) {
    var cl = arguments.callee;
    if (!(this instanceof cl)) return new cl(url, option);

    function _getXHR() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else if (ActiveXObject) {
            try {
                return new ActiveXObject('MSXML2.XMLHTTP');
            } catch (e) {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }
            return null;
        }
    }
    var loc = location.toString();
    var domain = '';
    try {
        domain = loc.match(/^https?:\/\/([a-z0-9_\-\.]+)/i)[1];
    } catch (e) {}
    this._status = 0;
    this._url = url;
    this._options = new Object;
    this._headers = new Object;
    this._options = {
        type: "xhr",
        method: "post",
        proxy: "",
        timeout: 0,
        onload: function (req) {}, onerror: null,
        ontimeout: function (req) {}, jsonp_charset: "utf-8",
        callbackid: "",
        callbackname: "",
        sendheader: true,
        async: true,
        decode: true,
        postBody: false
    };
    this.option(option);
    if (jindo.$Ajax.CONFIG) {
        this.option(jindo.$Ajax.CONFIG);
    }
    var _opt = this._options;
    _opt.type = _opt.type.toLowerCase();
    _opt.method = _opt.method.toLowerCase();
    if (typeof window.__jindo2_callback == "undefined") {
        window.__jindo2_callback = new Array();
    }
    switch (_opt.type) {
    case "put":
    case "delete":
    case "get":
    case "post":
        _opt.method = _opt.type;
        _opt.type = "xhr";
    case "xhr":
        this._request = _getXHR();
        break;
    case "flash":
        if (!jindo.$Ajax.SWFRequest) throw Error('Require $Ajax.SWFRequest');
        this._request = new jindo.$Ajax.SWFRequest();
        this._request._decode = _opt.decode;
        break;
    case "jsonp":
        if (!jindo.$Ajax.JSONPRequest) throw Error('Require $Ajax.JSONPRequest');
        _opt.method = "get";
        this._request = new jindo.$Ajax.JSONPRequest();
        this._request.charset = _opt.jsonp_charset;
        this._request.callbackid = _opt.callbackid;
        this._request.callbackname = _opt.callbackname;
        break;
    case "iframe":
        if (!jindo.$Ajax.FrameRequest) throw Error('Require $Ajax.FrameRequest');
        this._request = new jindo.$Ajax.FrameRequest();
        this._request._proxy = _opt.proxy;
        break;
    }
};
jindo.$Ajax.prototype._onload = (function (isIE) {
    if (isIE) {
        return function () {
            var bSuccess = this._request.readyState == 4 && this._request.status == 200;
            var oResult;
            if (this._request.readyState == 4) {
                try {
                    if (this._request.status != 200 && typeof this._options.onerror == 'function') {
                        if (!this._request.status == 0) {
                            this._options.onerror(jindo.$Ajax.Response(this._request));
                        }
                    } else {
                        oResult = this._options.onload(jindo.$Ajax.Response(this._request));
                    }
                } finally {
                    if (typeof this._oncompleted == 'function') {
                        this._oncompleted(bSuccess, oResult);
                    }
                    this.abort();
                    delete this._request.onreadystatechange;
                    try {
                        delete this._request.onload;
                    } catch (e) {
                        this._request.onload = undefined;
                    }
                }
            }
        }
    } else {
        return function () {
            var bSuccess = this._request.readyState == 4 && this._request.status == 200;
            var oResult;
            if (this._request.readyState == 4) {
                try {
                    if (this._request.status != 200 && typeof this._options.onerror == 'function') {
                        this._options.onerror(jindo.$Ajax.Response(this._request));
                    } else {
                        oResult = this._options.onload(jindo.$Ajax.Response(this._request));
                    }
                } finally {
                    this._status--;
                    if (typeof this._oncompleted == 'function') {
                        this._oncompleted(bSuccess, oResult);
                    }
                }
            }
        }
    }
})(/MSIE/.test(window.navigator.userAgent));
jindo.$Ajax.prototype.request = function (oData) {
    this._status++;
    var t = this;
    var req = this._request;
    var opt = this._options;
    var data, v, a = [],
        data = "";
    var _timer = null;
    var url = this._url;
    if (opt.postBody && opt.type.toUpperCase() == "XHR" && opt.method.toUpperCase() != "GET") {
        if (typeof oData == 'string') {
            data = oData;
        } else {
            data = $Json(oData).toString();
        }
    } else if (typeof oData == "undefined" || !oData) {
        data = null;
    } else {
        for (var k in oData) {
            v = oData[k];
            if (typeof v == "function") v = v();
            if (v instanceof Array || v instanceof jindo.$A) {
                jindo.$A(v).forEach(function (value, index, array) {
                    a[a.length] = k + "=" + encodeURIComponent(value);
                });
            } else {
                a[a.length] = k + "=" + encodeURIComponent(v);
            }
        }
        data = a.join("&");
    }
    if (opt.type.toUpperCase() == "XHR" && opt.method.toUpperCase() == "GET") {
        if (url.indexOf('?') == -1) {
            url += "?";
        } else {
            url += "&";
        }
        url += data;
        data = null;
    }
    req.open(opt.method.toUpperCase(), url, opt.async);
    if (opt.sendheader) {
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        req.setRequestHeader("charset", "utf-8");
        for (var x in this._headers) {
            if (typeof this._headers[x] == "function") continue;
            req.setRequestHeader(x, String(this._headers[x]));
        }
    }
    if (req.addEventListener) {
        if (this._loadFunc) {
            req.removeEventListener("load", this._loadFunc, false);
        }
        this._loadFunc = function (rq) {
            clearTimeout(_timer);
            t._onload(rq)
        }
        req.addEventListener("load", this._loadFunc, false);
    } else {
        if (typeof req.onload != "undefined") {
            req.onload = function (rq) {
                clearTimeout(_timer);
                t._onload(rq)
            };
        } else {
            req.onreadystatechange = function (rq) {
                clearTimeout(_timer);
                t._onload(rq)
            };
        }
    }
    if (opt.timeout > 0) {
        _timer = setTimeout(function () {
            try {
                req.abort();
            } catch (e) {};
            opt.ontimeout(req);
            if (typeof this._oncompleted == 'function') this._oncompleted(false);
        }, opt.timeout * 1000);
    }
    req.send(data);
    return this;
};
jindo.$Ajax.prototype.isIdle = function () {
    return this._status == 0;
}
jindo.$Ajax.prototype.abort = function () {
    try {
        this._request.abort();
    } finally {
        this._status--;
    }
    return this;
};
jindo.$Ajax.prototype.option = function (name, value) {
    if (typeof name == "undefined") return "";
    if (typeof name == "string") {
        if (typeof value == "undefined") return this._options[name];
        this._options[name] = value;
        return this;
    }
    try {
        for (var x in name) this._options[x] = name[x]
    } catch (e) {};
    return this;
};
jindo.$Ajax.prototype.header = function (name, value) {
    if (typeof name == "undefined") return "";
    if (typeof name == "string") {
        if (typeof value == "undefined") return this._headers[name];
        this._headers[name] = value;
        return this;
    }
    try {
        for (var x in name) this._headers[x] = name[x]
    } catch (e) {};
    return this;
};
jindo.$Ajax.Response = function (req) {
    if (this === jindo.$Ajax) return new jindo.$Ajax.Response(req);
    this._response = req;
};
jindo.$Ajax.Response.prototype.xml = function () {
    return this._response.responseXML;
};
jindo.$Ajax.Response.prototype.text = function () {
    return this._response.responseText;
};
jindo.$Ajax.Response.prototype.status = function () {
    return this._response.status;
};
jindo.$Ajax.Response.prototype.readyState = function () {
    return this._response.readyState;
};
jindo.$Ajax.Response.prototype.json = function () {
    if (this._response.responseJSON) {
        return this._response.responseJSON;
    } else if (this._response.responseText) {
        try {
            return new Function("return " + this._response.responseText)();
        } catch (e) {
            return {};
        }
    }
    return {};
};
jindo.$Ajax.Response.prototype.header = function (name) {
    if (typeof name == "string") return this._response.getResponseHeader(name);
    return this._response.getAllResponseHeaders();
};
jindo.$Ajax.RequestBase = jindo.$Class({
    _respHeaderString: "",
    callbackid: "",
    callbackname: "",
    responseXML: null,
    responseJSON: null,
    responseText: "",
    status: 404,
    readyState: 0,
    $init: function () {}, onload: function () {}, abort: function () {}, open: function () {}, send: function () {}, setRequestHeader: function (sName, sValue) {
        this._headers[sName] = sValue;
    }, getResponseHeader: function (sName) {
        return this._respHeaders[sName] || "";
    }, getAllResponseHeaders: function () {
        return this._respHeaderString;
    }, _getCallbackInfo: function () {
        var id = "";
        if (this.callbackid != "") {
            var idx = 0;
            do {
                id = "_" + this.callbackid + "_" + idx;
                idx++;
            } while (window.__jindo2_callback[id]);
        } else {
            do {
                id = "_" + Math.floor(Math.random() * 10000);
            } while (window.__jindo2_callback[id]);
        }
        if (this.callbackname == "") {
            this.callbackname = "_callback";
        }
        return {
            callbackname: this.callbackname,
            id: id,
            name: "window.__jindo2_callback." + id
        };
    }
});
jindo.$Ajax.JSONPRequest = jindo.$Class({
    _headers: {}, _respHeaders: {}, charset: "utf-8",
    _script: null,
    _onerror: null,
    _callback: function (data) {
        if (this._onerror) {
            clearTimeout(this._onerror);
            this._onerror = null;
        }
        var self = this;
        this.responseJSON = data;
        this.onload(this);
        setTimeout(function () {
            self.abort()
        }, 10);
    }, abort: function () {
        if (this._script) {
            try {
                this._script.parentNode.removeChild(this._script);
            } catch (e) {};
        }
    }, open: function (method, url) {
        this.responseJSON = null;
        this._url = url;
    }, send: function (data) {
        var t = this;
        var info = this._getCallbackInfo();
        var head = document.getElementsByTagName("head")[0];
        this._script = jindo.$("<script>");
        this._script.type = "text/javascript";
        this._script.charset = this.charset;
        if (head) {
            head.appendChild(this._script);
        } else if (document.body) {
            document.body.appendChild(this._script);
        }
        window.__jindo2_callback[info.id] = function (data) {
            try {
                t.readyState = 4;
                t.status = 200;
                t._callback(data);
            } finally {
                delete window.__jindo2_callback[info.id];
            }
        };
        var agent = jindo.$Agent();
        if (agent.navigator().ie || agent.navigator().opera) {
            this._script.onreadystatechange = function () {
                if (this.readyState == 'loaded') {
                    if (!t.responseJSON) {
                        t.readyState = 4;
                        t.status = 500;
                        t._onerror = setTimeout(function () {
                            t._callback(null);
                        }, 200);
                    }
                    this.onreadystatechange = null;
                }
            };
        } else {
            this._script.onload = function () {
                if (!t.responseJSON) {
                    t.readyState = 4;
                    t.status = 500;
                    t._onerror = setTimeout(function () {
                        t._callback(null);
                    }, 200);
                }
                this.onload = null;
                this.onerror = null;
            };
            this._script.onerror = function () {
                if (!t.responseJSON) {
                    t.readyState = 4;
                    t.status = 404;
                    t._onerror = setTimeout(function () {
                        t._callback(null);
                    }, 200);
                }
                this.onerror = null;
                this.onload = null;
            };
        }
        this._script.src = this._url + "?" + info.callbackname + "=" + info.name + "&" + data;
    }
}).extend(jindo.$Ajax.RequestBase);
jindo.$Ajax.SWFRequest = jindo.$Class({
    _decode: true,
    _headers: {}, _respHeaders: {}, _callback: function (status, data, headers) {
        this.readyState = 4;
        if ((typeof status).toLowerCase() == 'number') {
            this.status = status;
        } else {
            if (status == true) this.status = 200;
        }
        if (this.status == 200) {
            if (typeof data == "string") {
                try {
                    this.responseText = this._decode ? decodeURIComponent(data) : data;
                    if (!this.responseText || this.responseText == "") {
                        this.responseText = data;
                    }
                } catch (e) {
                    if (e.name == "URIError") {
                        this.responseText = data;
                        if (!this.responseText || this.responseText == "") {
                            this.responseText = data;
                        }
                    }
                }
            }
            if (typeof headers == "object") {
                this._respHeaders = headers;
            }
        }
        this.onload(this);
    }, open: function (method, url) {
        var re = /https?:\/\/([a-z0-9_\-\.]+)/i;
        this._url = url;
        this._method = method;
    }, send: function (data) {
        this.responseXML = false;
        this.responseText = "";
        var t = this;
        var dat = {};
        var info = this._getCallbackInfo();
        var swf = window.document[jindo.$Ajax.SWFRequest._tmpId];

        function f(arg) {
            switch (typeof arg) {
            case "string":
                return '"' + arg.replace(/\"/g, '\\"') + '"';
                break;
            case "number":
                return arg;
                break;
            case "object":
                var ret = "",
                    arr = [];
                if (arg instanceof Array) {
                    for (var i = 0; i < arg.length; i++) {
                        arr[i] = f(arg[i]);
                    }
                    ret = "[" + arr.join(",") + "]";
                } else {
                    for (var x in arg) {
                        arr[arr.length] = f(x) + ":" + f(arg[x]);
                    }
                    ret = "{" + arr.join(",") + "}";
                }
                return ret;
            default:
                return '""';
            }
        }
        data = (data || "").split("&");
        for (var i = 0; i < data.length; i++) {
            pos = data[i].indexOf("=");
            key = data[i].substring(0, pos);
            val = data[i].substring(pos + 1);
            dat[key] = decodeURIComponent(val);
        }
        window.__jindo2_callback[info.id] = function (success, data) {
            try {
                t._callback(success, data);
            } finally {
                delete window.__jindo2_callback[info.id];
            }
        };
        var oData = {
            url: this._url,
            type: this._method,
            data: dat,
            charset: "UTF-8",
            callback: info.name,
            header_json: this._headers
        };
        swf.requestViaFlash(f(oData));
    }
}).extend(jindo.$Ajax.RequestBase);
jindo.$Ajax.SWFRequest.write = function (swf_path) {
    if (typeof swf_path == "undefined") swf_path = "./ajax.swf";
    jindo.$Ajax.SWFRequest._tmpId = 'tmpSwf' + (new Date).getMilliseconds() + Math.floor(Math.random() * 100000);
    document.write('<div style="position:absolute;top:-1000px;left:-1000px"><object id="' + jindo.$Ajax.SWFRequest._tmpId + '" width="1" height="1" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"><param name="movie" value="' + swf_path + '"><param name = "allowScriptAccess" value = "always" /><embed name="' + jindo.$Ajax.SWFRequest._tmpId + '" src="' + swf_path + '" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" width="1" height="1" allowScriptAccess="always" swLiveConnect="true"></embed></object></div>');
};
jindo.$Ajax.SWFRequest.activeFlash = false;
jindo.$Ajax.SWFRequest.loaded = function () {
    jindo.$Ajax.SWFRequest.activeFlash = true;
}
jindo.$Ajax.FrameRequest = jindo.$Class({
    _headers: {}, _respHeaders: {}, _frame: null,
    _proxy: "",
    _domain: "",
    _callback: function (id, data, header) {
        var self = this;
        this.readyState = 4;
        this.status = 200;
        this.responseText = data;
        this._respHeaderString = header;
        header.replace(/^([\w\-]+)\s*:\s*(.+)$/m, function ($0, $1, $2) {
            self._respHeaders[$1] = $2;
        });
        this.onload(this);
        setTimeout(function () {
            self.abort()
        }, 10);
    }, abort: function () {
        if (this._frame) {
            try {
                this._frame.parentNode.removeChild(this._frame);
            } catch (e) {}
        }
    }, open: function (method, url) {
        var re = /https?:\/\/([a-z0-9_\-\.]+)/i;
        var dom = document.location.toString().match(re);
        this._method = method;
        this._url = url;
        this._remote = String(url).match(/(https?:\/\/[a-z0-9_\-\.]+)(:[0-9]+)?/i)[0];
        this._frame = null;
        this._domain = (dom[1] != document.domain) ? document.domain : "";
    }, send: function (data) {
        this.responseXML = "";
        this.responseText = "";
        var t = this;
        var re = /https?:\/\/([a-z0-9_\-\.]+)/i;
        var info = this._getCallbackInfo();
        var url;
        var _aStr = [];
        _aStr.push(this._remote + "/ajax_remote_callback.html?method=" + this._method);
        var header = new Array;
        window.__jindo2_callback[info.id] = function (id, data, header) {
            try {
                t._callback(id, data, header);
            } finally {
                delete window.__jindo2_callback[info.id];
            }
        };
        for (var x in this._headers) {
            header[header.length] = "'" + x + "':'" + this._headers[x] + "'";
        }
        header = "{" + header.join(",") + "}";
        _aStr.push("&id=" + info.id);
        _aStr.push("&header=" + encodeURIComponent(header));
        _aStr.push("&proxy=" + encodeURIComponent(this._proxy));
        _aStr.push("&domain=" + this._domain);
        _aStr.push("&url=" + encodeURIComponent(this._url.replace(re, "")));
        _aStr.push("#" + encodeURIComponent(data));
        var fr = this._frame = jindo.$("<iframe>");
        fr.style.position = "absolute";
        fr.style.visibility = "hidden";
        fr.style.width = "1px";
        fr.style.height = "1px";
        var body = document.body || document.documentElement;
        if (body.firstChild) {
            body.insertBefore(fr, body.firstChild);
        } else {
            body.appendChild(fr);
        }
        fr.src = _aStr.join("");
    }
}).extend(jindo.$Ajax.RequestBase);
jindo.$Ajax.Queue = function (option) {
    var cl = arguments.callee;
    if (!(this instanceof cl)) {
        return new cl(option);
    }
    this._options = {
        async: false,
        useResultAsParam: false,
        stopOnFailure: false
    };
    this.option(option);
    this._queue = [];
}
jindo.$Ajax.Queue.prototype.option = function (name, value) {
    if (typeof name == "undefined") {
        return "";
    }
    if (typeof name == "string") {
        if (typeof value == "undefined") {
            return this._options[name];
        }
        this._options[name] = value;
        return this;
    }
    try {
        for (var x in name) {
            this._options[x] = name[x]
        }
    } catch (e) {};
    return this;
};
jindo.$Ajax.Queue.prototype.add = function (oAjax, oParam) {
    this._queue.push({
        obj: oAjax,
        param: oParam
    });
}
jindo.$Ajax.Queue.prototype.request = function () {
    if (this.option('async')) {
        this._requestAsync();
    } else {
        this._requestSync(0);
    }
}
jindo.$Ajax.Queue.prototype._requestSync = function (nIdx, oParam) {
    var t = this;
    if (this._queue.length > nIdx + 1) {
        this._queue[nIdx].obj._oncompleted = function (bSuccess, oResult) {
            if (!t.option('stopOnFailure') || bSuccess) t._requestSync(nIdx + 1, oResult);
        };
    }
    var _oParam = this._queue[nIdx].param || {};
    if (this.option('useResultAsParam') && oParam) {
        try {
            for (var x in oParam) if (typeof _oParam[x] == 'undefined') _oParam[x] = oParam[x]
        } catch (e) {};
    }
    this._queue[nIdx].obj.request(_oParam);
}
jindo.$Ajax.Queue.prototype._requestAsync = function () {
    for (var i = 0; i < this._queue.length; i++)
    this._queue[i].obj.request(this._queue[i].param);
}
jindo.$Element = function (el) {
    var cl = arguments.callee;
    if (el && el instanceof cl) return el;
    if (!jindo.$(el)) return null;
    if (!(this instanceof cl)) return new cl(el);
    this._element = jindo.$(el);
    this.tag = (typeof this._element.tagName != 'undefined') ? this._element.tagName.toLowerCase() : '';
}
var IS_IE = navigator.userAgent.indexOf("MSIE") > -1;
var IS_FF = navigator.userAgent.indexOf("Firefox") > -1;
var IS_OP = navigator.userAgent.indexOf("Opera") > -1;
var IS_SF = navigator.userAgent.indexOf("Apple") > -1;
var IS_CH = navigator.userAgent.indexOf("Chrome") > -1;
jindo.$Element.prototype.$value = function () {
    return this._element;
};
jindo.$Element.prototype.visible = function (bVisible) {
    if (typeof bVisible != "undefined") {
        this[bVisible ? "show" : "hide"]();
        return this;
    }
    return (this.css("display") != "none");
};
jindo.$Element.prototype.show = function () {
    var s = this._element.style;
    var b = "block";
    var c = {
        p: b,
        div: b,
        form: b,
        h1: b,
        h2: b,
        h3: b,
        h4: b,
        ol: b,
        ul: b,
        fieldset: b,
        td: "table-cell",
        th: "table-cell",
        li: "list-item",
        table: "table",
        thead: "table-header-group",
        tbody: "table-row-group",
        tfoot: "table-footer-group",
        tr: "table-row",
        col: "table-column",
        colgroup: "table-column-group",
        caption: "table-caption",
        dl: b,
        dt: b,
        dd: b
    };
    try {
        if (typeof c[this.tag] == "string") {
            s.display = c[this.tag];
        } else {
            s.display = "inline";
        }
    } catch (e) {
        s.display = "block";
    }
    return this;
};
jindo.$Element.prototype.hide = function () {
    this._element.style.display = "none";
    return this;
};
jindo.$Element.prototype.toggle = function () {
    this[this.visible() ? "hide" : "show"]();
    return this;
};
jindo.$Element.prototype.opacity = function (value) {
    var v, e = this._element,
        b = this.visible();
    value = parseFloat(value);
    if (!isNaN(value)) {
        value = Math.max(Math.min(value, 1), 0);
        if (typeof e.filters != "undefined") {
            value = Math.ceil(value * 100);
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
        v = (typeof e.filters.alpha == "undefined") ? (b ? 100 : 0) : e.filters.alpha.opacity;
        v = v / 100;
    } else {
        v = parseFloat(e.style.opacity);
        if (isNaN(v)) v = b ? 1 : 0;
    }
    return v;
};
jindo.$Element.prototype.css = function (sName, sValue) {
    var e = this._element;
    if (sName == 'opacity') return typeof sValue == 'undefined' ? this.opacity() : this.opacity(sValue);
    if (typeof sName == "string") {
        var view;
        if (typeof sValue == "string" || typeof sValue == "number") {
            var obj = new Object;
            obj[sName] = sValue;
            sName = obj;
        } else {
            if ((IS_FF || IS_OP) && (sName == "backgroundPositionX" || sName == "backgroundPositionY")) {
                var bp = this._getCss(e, "backgroundPosition").split(/\s+/);
                return (sName == "backgroundPositionX") ? bp[0] : bp[1];
            }
            if (IS_IE && sName == "backgroundPosition") {
                return this._getCss(e, "backgroundPositionX") + " " + this._getCss(e, "backgroundPositionY")
            }
            if ((IS_FF || IS_SF || IS_CH) && (sName == "padding" || sName == "margin")) {
                var top = this._getCss(e, sName + "Top");
                var right = this._getCss(e, sName + "Right");
                var bottom = this._getCss(e, sName + "Bottom");
                var left = this._getCss(e, sName + "Left");
                if ((top == right) && (bottom == left)) {
                    return top;
                } else if (top == bottom) {
                    if (right == left) {
                        return top + " " + right;
                    } else {
                        return top + " " + right + " " + bottom + " " + left;
                    }
                } else {
                    return top + " " + right + " " + bottom + " " + left;
                }
            }
            return this._getCss(e, sName);
        }
    }
    if (typeof jindo.$H != "undefined" && sName instanceof jindo.$H) {
        sName = sName.$value();
    }
    if (typeof sName == "object") {
        var v, type;
        for (var k in sName) {
            v = sName[k];
            type = (typeof v);
            if (type != "string" && type != "number") continue;
            if (k == 'opacity') {
                type == 'undefined' ? this.opacity() : this.opacity(v);
                continue;
            }
            if (k == "cssFloat" && navigator.userAgent.indexOf("MSIE") > -1) k = "styleFloat";
            if ((IS_FF || IS_OP) && (k == "backgroundPositionX" || k == "backgroundPositionY")) {
                var bp = this.css("backgroundPosition").split(/\s+/);
                v = k == "backgroundPositionX" ? v + " " + bp[1] : bp[0] + " " + v;
                this._setCss(e, "backgroundPosition", v);
            } else {
                this._setCss(e, k, v);
            }
        }
    }
    return this;
};
jindo.$Element.prototype._getCss = function (e, sName) {
    if (e.currentStyle) {
        if (sName == "cssFloat") sName = "styleFloat";
        return e.currentStyle[sName] || e.style[sName];
    } else if (window.getComputedStyle) {
        if (sName == "cssFloat") sName = "float";
        var d = e.ownerDocument || e.document || document;
        return d.defaultView.getComputedStyle(e, null).getPropertyValue(sName.replace(/([A-Z])/g, "-$1").toLowerCase()) || e.style[sName];
    } else {
        if (sName == "cssFloat" && /MSIE/.test(window.navigator.userAgent)) sName = "styleFloat";
        return e.style[sName];
    }
    return null;
}
jindo.$Element.prototype._setCss = function (e, k, v) {
    try {
        e.style[k] = v;
    } catch (err) {
        if (k == "cursor" && v == "pointer") {
            e.style.cursor = "hand";
        } else if (("#top#left#right#bottom#").indexOf(k + "#") > 0 && (type == "number" || !isNaN(parseInt(v)))) {
            e.style[k] = parseInt(v) + "px";
        }
    }
}
jindo.$Element.prototype.attr = function (sName, sValue) {
    var e = this._element;
    if (typeof sName == "string") {
        if (typeof sValue != "undefined") {
            var obj = new Object;
            obj[sName] = sValue;
            sName = obj;
        } else {
            if (sName == "class" || sName == "className") return e.className;
            return e.getAttribute(sName);
        }
    }
    if (typeof jindo.$H != "undefined" && sName instanceof jindo.$H) {
        sName = sName.$value();
    }
    if (typeof sName == "object") {
        for (var k in sName) {
            if (/^on[a-zA-Z]+$/.test(k)) {
                e[k] = sName[k];
                continue;
            }
            if (typeof(sValue) != "undefined" && sValue === null) {
                e.removeAttribute(k);
            } else {
                e.setAttribute(k, sName[k]);
            }
        }
    }
    return this;
};
jindo.$Element.prototype.width = function (width) {
    if (typeof width == "number") {
        var e = this._element;
        e.style.width = width + "px";
        if (e.offsetWidth != width) {
            e.style.width = (width * 2 - e.offsetWidth) + "px";
        }
        return this;
    }
    return this._element.offsetWidth;
};
jindo.$Element.prototype.height = function (height) {
    if (typeof height == "number") {
        var e = this._element;
        e.style.height = height + "px";
        if (e.offsetHeight != height) {
            var height = (height * 2 - e.offsetHeight);
            if (height > 0) e.style.height = height + "px";
        }
        return this;
    }
    return this._element.offsetHeight;
};
jindo.$Element.prototype.className = function (sClass) {
    var e = this._element;
    if (typeof sClass == "undefined") return e.className;
    e.className = sClass;
    return this;
};
jindo.$Element.prototype.hasClass = function (sClass) {
    return (" " + this._element.className + " ").indexOf(" " + sClass + " ") > -1;
};
jindo.$Element.prototype.addClass = function (sClass) {
    var e = this._element;
    if (this.hasClass(sClass)) return this;
    e.className = (e.className + " " + sClass).replace(/^\s+/, "");
    return this;
};
jindo.$Element.prototype.removeClass = function (sClass) {
    var e = this._element;
    e.className = (" " + e.className + " ").replace(" " + sClass + " ", " ").replace(/\s+$/, "").replace(/^\s+/, "");
    return this;
};
jindo.$Element.prototype.toggleClass = function (sClass, sClass2) {
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
jindo.$Element.prototype.text = function (sText) {
    var prop = (typeof this._element.textContent != "undefined") ? "textContent" : "innerText";
    if (this.tag == "textarea" || this.tag == "input") prop = "value";
    if (typeof sText == "string") {
        try {
            this._element[prop] = sText;
        } catch (e) {
            return this.html(sText.replace(/&/g, '&amp;').replace(/</g, '&lt;'));
        }
        return this;
    }
    return this._element[prop];
};
jindo.$Element.prototype.html = function (sHTML) {
    if (arguments.length) {
        sHTML += "";
        jindo.$$.release();
        var oEl = this._element;
        var isIe = (typeof window.opera == "undefined" && navigator.userAgent.indexOf("MSIE") > -1);
        var isFF = (navigator.userAgent.indexOf("Firefox") > -1);
        var bBugAgent = isIe || (isFF && !oEl.parentNode);
        if (bBugAgent) {
            var sId = 'R' + new Date().getTime() + parseInt(Math.random() * 100000);
            var oDoc = oEl.ownerDocument || oEl.document || document;
            var oDummy;
            var sTag = oEl.tagName.toLowerCase();
            switch (sTag) {
            case 'select':
            case 'table':
                oDummy = jindo.$('<div>');
                oDummy.innerHTML = '<' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '>';
                break;
            case 'tr':
            case 'thead':
            case 'tbody':
                oDummy = jindo.$('<div>');
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
                    for (var oChild; oChild = oEl.firstChild;) oChild.removeNode(true);
                    for (var oChild = oFound.firstChild; oChild; oChild = oFound.firstChild) {
                        if (sTag == 'select' && isIe) {
                            var cloneNode = oChild.cloneNode(true);
                            if (oChild.selected && notYetSelected) {
                                notYetSelected = false;
                                cloneNode.selected = true;
                            }
                            oEl.appendChild(cloneNode);
                            oChild.removeNode(true);
                        } else {
                            oEl.appendChild(oChild);
                        }
                    }
                    oDummy.removeNode && oDummy.removeNode(true);
                }
                oDummy = null;
            }
        } else {
            oEl.innerHTML = sHTML;
        }
        return this;
    }
    return this._element.innerHTML;
};
jindo.$Element.prototype.outerHTML = function () {
    var e = this._element;
    if (typeof e.outerHTML != "undefined") return e.outerHTML;
    var div = jindo.$("<div>");
    var par = e.parentNode;
    if (!par) return e.innerHTML;
    par.insertBefore(div, e);
    div.style.display = "none";
    div.appendChild(e);
    var s = div.innerHTML;
    par.insertBefore(e, div);
    par.removeChild(div);
    return s;
};
jindo.$Element.prototype.toString = jindo.$Element.prototype.outerHTML;
jindo.$Element.prototype.appear = function (duration, callback) {
    var self = this;
    var op = this.opacity();
    if (!this.visible()) op = 0;
    if (op == 1) return this;
    try {
        clearTimeout(this._fade_timer);
    } catch (e) {};
    callback = callback || new Function;
    var step = (1 - op) / ((duration || 0.3) * 100);
    var func = function () {
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
};
jindo.$Element.prototype.disappear = function (duration, callback) {
    var self = this;
    var op = this.opacity();
    if (op == 0) return this;
    try {
        clearTimeout(this._fade_timer);
    } catch (e) {};
    callback = callback || new Function;
    var step = op / ((duration || 0.3) * 100);
    var func = function () {
        op -= step;
        self.opacity(op);
        if (op <= 0) {
            self.hide();
            self.opacity(1);
            callback(self);
        } else {
            self._fade_timer = setTimeout(func, 10);
        }
    };
    func();
    return this;
};
jindo.$Element.prototype.offset = function (nTop, nLeft) {
    var oEl = this._element;
    var oPhantom = null;
    if (typeof nTop == 'number' && typeof nLeft == 'number') {
        if (isNaN(parseInt(this.css('top')))) this.css('top', 0);
        if (isNaN(parseInt(this.css('left')))) this.css('left', 0);
        var oPos = this.offset();
        var oGap = {
            top: nTop - oPos.top,
            left: nLeft - oPos.left
        };
        oEl.style.top = parseInt(this.css('top')) + oGap.top + 'px';
        oEl.style.left = parseInt(this.css('left')) + oGap.left + 'px';
        return this;
    }
    var bSafari = /Safari/.test(navigator.userAgent);
    var bIE = /MSIE/.test(navigator.userAgent);
    var nVer = bIE ? navigator.userAgent.match(/(?:MSIE) ([0-9.]+)/)[1] : 0;
    var fpSafari = function (oEl) {
        var oPos = {
            left: 0,
            top: 0
        };
        for (var oParent = oEl, oOffsetParent = oParent.offsetParent; oParent = oParent.parentNode;) {
            if (oParent.offsetParent) {
                oPos.left -= oParent.scrollLeft;
                oPos.top -= oParent.scrollTop;
            }
            if (oParent == oOffsetParent) {
                oPos.left += oEl.offsetLeft + oParent.clientLeft;
                oPos.top += oEl.offsetTop + oParent.clientTop;
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
    var fpOthers = function (oEl) {
        var oPos = {
            left: 0,
            top: 0
        };
        var oDoc = oEl.ownerDocument || oEl.document || document;
        var oHtml = oDoc.documentElement;
        var oBody = oDoc.body;
        if (oEl.getBoundingClientRect) {
            if (!oPhantom) {
                if ((bIE && nVer < 8 && window.external) && (window == top || window.frameElement && window.frameElement.frameBorder == 1)) {
                    oPhantom = {
                        left: 2,
                        top: 2
                    };
                    oBase = null;
                } else {
                    oPhantom = {
                        left: 0,
                        top: 0
                    };
                }
            }
            var box = oEl.getBoundingClientRect();
            if (oEl !== oHtml && oEl !== oBody) {
                oPos.left = box.left - oPhantom.left;
                oPos.top = box.top - oPhantom.top;
                oPos.left += oHtml.scrollLeft || oBody.scrollLeft;
                oPos.top += oHtml.scrollTop || oBody.scrollTop;
            }
        } else if (oDoc.getBoxObjectFor) {
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
jindo.$Element.prototype.evalScripts = function (sHTML) {
    var aJS = [];
    sHTML = sHTML.replace(new RegExp('<script(\\s[^>]+)*>(.*?)</' + 'script>', 'gi'), function (_1, _2, sPart) {
        aJS.push(sPart);
        return '';
    });
    eval(aJS.join('\n'));
    return this;
};
jindo.$Element.prototype.append = function (oElement) {
    var o = jindo.$Element(oElement).$value();
    this._element.appendChild(o);
    return jindo.$Element(o);
};
jindo.$Element.prototype.prepend = function (oElement) {
    var e = this._element;
    var o = jindo.$Element(oElement).$value();
    if (e.childNodes.length > 0) {
        e.insertBefore(o, e.childNodes[0]);
    } else {
        e.appendChild(o);
    }
    return jindo.$Element(o);
};
jindo.$Element.prototype.replace = function (oElement) {
    jindo.$$.release();
    var e = this._element;
    var o = jindo.$Element(oElement).$value();
    e.parentNode.insertBefore(o, e);
    e.parentNode.removeChild(e);
    return jindo.$Element(o);
};
jindo.$Element.prototype.appendTo = function (oElement) {
    var o = jindo.$Element(oElement).$value();
    o.appendChild(this._element);
    return this;
};
jindo.$Element.prototype.prependTo = function (oElement) {
    var o = jindo.$Element(oElement).$value();
    if (o.childNodes.length > 0) {
        o.insertBefore(this._element, o.childNodes[0]);
    } else {
        o.appendChild(this._element);
    }
    return this;
};
jindo.$Element.prototype.before = function (oElement) {
    var o = jindo.$Element(oElement).$value();
    this._element.parentNode.insertBefore(o, this._element);
    return jindo.$Element(o);
};
jindo.$Element.prototype.after = function (oElement) {
    var o = this.before(oElement);
    o.before(this);
    return o;
};
jindo.$Element.prototype.parent = function (pFunc, limit) {
    var e = this._element;
    var a = [],
        p = null;
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
jindo.$Element.prototype.child = function (pFunc, limit) {
    var e = this._element;
    var a = [],
        c = null,
        f = null;
    if (typeof pFunc == "undefined") return jindo.$A(e.childNodes).filter(function (v) {
        return v.nodeType == 1
    }).map(function (v) {
        return jindo.$Element(v)
    }).$value();
    if (typeof limit == "undefined" || limit == 0) limit = -1;
    (f = function (el, lim) {
        var ch = null,
            o = null;
        for (var i = 0; i < el.childNodes.length; i++) {
            ch = el.childNodes[i];
            if (ch.nodeType != 1) continue;
            o = jindo.$Element(el.childNodes[i]);
            if (!pFunc || (pFunc && pFunc(o))) a[a.length] = o;
            if (lim != 0) f(el.childNodes[i], lim - 1);
        }
    })(e, limit - 1);
    return a;
};
jindo.$Element.prototype.prev = function (pFunc) {
    var e = this._element;
    var a = [];
    var b = (typeof pFunc == "undefined");
    if (!e) return b ? jindo.$Element(null) : a;
    do {
        e = e.previousSibling;
        if (!e || e.nodeType != 1) continue;
        if (b) return jindo.$Element(e);
        if (!pFunc || pFunc(e)) a[a.length] = jindo.$Element(e);
    } while (e);
    return b ? jindo.$Element(e) : a;
};
jindo.$Element.prototype.next = function (pFunc) {
    var e = this._element;
    var a = [];
    var b = (typeof pFunc == "undefined");
    if (!e) return b ? jindo.$Element(null) : a;
    do {
        e = e.nextSibling;
        if (!e || e.nodeType != 1) continue;
        if (b) return jindo.$Element(e);
        if (!pFunc || pFunc(e)) a[a.length] = jindo.$Element(e);
    } while (e);
    return b ? jindo.$Element(e) : a;
};
jindo.$Element.prototype.first = function () {
    var el = this._element.firstElementChild || this._element.firstChild;
    if (!el) return null;
    while (el && el.nodeType != 1) el = el.nextSibling;
    return el ? jindo.$Element(el) : null;
}
jindo.$Element.prototype.last = function () {
    var el = this._element.lastElementChild || this._element.lastChild;
    if (!el) return null;
    while (el && el.nodeType != 1) el = el.previousSibling;
    return el ? jindo.$Element(el) : null;
}
jindo.$Element.prototype.isChildOf = function (element) {
    var e = this._element;
    var el = jindo.$Element(element).$value();
    while (e && e.parentNode) {
        e = e.parentNode;
        if (e == el) return true;
    }
    return false;
};
jindo.$Element.prototype.isParentOf = function (element) {
    var el = jindo.$Element(element).$value();
    while (el && el.parentNode) {
        el = el.parentNode;
        if (this._element == el) return true;
    }
    return false;
};
jindo.$Element.prototype.isEqual = function (element) {
    try {
        return (this._element === jindo.$Element(element).$value());
    } catch (e) {
        return false;
    }
};
jindo.$Element.prototype.fireEvent = function (sEvent, oProps) {
    function IE(sEvent, oProps) {
        sEvent = (sEvent + "").toLowerCase();
        var oEvent = document.createEventObject();
        if (oProps) {
            for (k in oProps) oEvent[k] = oProps[k];
            oEvent.button = (oProps.left ? 1 : 0) + (oProps.middle ? 4 : 0) + (oProps.right ? 2 : 0);
            oEvent.relatedTarget = oProps.relatedElement || null;
        }
        this._element.fireEvent("on" + sEvent, oEvent);
        return this;
    };

    function DOM2(sEvent, oProps) {
        var sType = "HTMLEvents";
        sEvent = (sEvent + "").toLowerCase();
        if (sEvent == "click" || sEvent.indexOf("mouse") == 0) {
            sType = "MouseEvent";
            if (sEvent == "mousewheel") sEvent = "dommousescroll";
        } else if (sEvent.indexOf("key") == 0) {
            sType = "KeyboardEvent";
        }
        var evt;
        if (oProps) {
            switch (sType) {
            case 'MouseEvent':
                evt = document.createEvent(sType);
                oProps.button = 0 + (oProps.middle ? 1 : 0) + (oProps.right ? 2 : 0);
                evt.initMouseEvent(sEvent, true, true, null, oProps.detail, oProps.screenX, oProps.screenY, oProps.clientX, oProps.clientY, oProps.ctrl, oProps.alt, oProps.shift, oProps.meta, oProps.button, oProps.relatedElement);
                break;
            case 'KeyboardEvent':
                if (window.KeyEvent) {
                    evt = document.createEvent('KeyEvents');
                    evt.initKeyEvent(sEvent, true, true, window, oProps.ctrl, oProps.alt, oProps.shift, oProps.meta, oProps.keyCode, oProps.keyCode);
                } else {
                    try {
                        evt = document.createEvent("Events");
                    } catch (e) {
                        evt = document.createEvent("UIEvents");
                    } finally {
                        evt.initEvent(sEvent, true, true);
                        evt.ctrlKey = oProps.ctrl;
                        evt.altKey = oProps.alt;
                        evt.shiftKey = oProps.shift;
                        evt.metaKey = oProps.meta;
                        evt.keyCode = oProps.keyCode;
                        evt.which = oProps.keyCode;
                    }
                }
                break;
            default:
                evt = document.createEvent(sType);
                evt.initEvent(sEvent, true, true);
            }
        } else {
            evt = document.createEvent(sType);
            evt.initEvent(sEvent, true, true);
        }
        this._element.dispatchEvent(evt);
        return this;
    };
    jindo.$Element.prototype.fireEvent = (typeof this._element.dispatchEvent != "undefined") ? DOM2 : IE;
    return this.fireEvent(sEvent, oProps);
};
jindo.$Element.prototype.empty = function () {
    jindo.$$.release();
    this.html("");
    return this;
};
jindo.$Element.prototype.remove = function (oChild) {
    jindo.$$.release();
    jindo.$Element(oChild).leave();
    return this;
}
jindo.$Element.prototype.leave = function () {
    var e = this._element;
    if (e.parentNode) {
        jindo.$$.release();
        e.parentNode.removeChild(e);
    }
    jindo.$Fn.freeElement(this._element);
    return this;
};
jindo.$Element.prototype.wrap = function (wrapper) {
    var e = this._element;
    wrapper = jindo.$Element(wrapper).$value();
    if (e.parentNode) {
        e.parentNode.insertBefore(wrapper, e);
    }
    wrapper.appendChild(e);
    return this;
};
jindo.$Element.prototype.ellipsis = function (stringTail) {
    stringTail = stringTail || "...";
    var txt = this.text();
    var len = txt.length;
    var cur_h = this.height();
    var i = 0;
    var h = this.text('A').height();
    if (cur_h < h * 1.5) return this.text(txt);
    cur_h = h;
    while (cur_h < h * 1.5) {
        i += Math.max(Math.ceil((len - i) / 2), 1);
        cur_h = this.text(txt.substring(0, i) + stringTail).height();
    }
    while (cur_h > h * 1.5) {
        i--;
        cur_h = this.text(txt.substring(0, i) + stringTail).height();
    }
};
jindo.$Element.prototype.indexOf = function (element) {
    try {
        var e = jindo.$Element(element).$value();
        var n = this._element.childNodes;
        var c = 0;
        var l = n.length;
        for (var i = 0; i < l; i++) {
            if (n[i].nodeType != 1) continue;
            if (n[i] === e) return c;
            c++;
        }
    } catch (e) {}
    return -1;
};
jindo.$Element.prototype.queryAll = function (sSelector) {
    return jindo.$$(sSelector, this._element);
};
jindo.$Element.prototype.query = function (sSelector) {
    return jindo.$$.getSingle(sSelector, this._element);
};
jindo.$Element.prototype.test = function (sSelector) {
    return jindo.$$.test(this._element, sSelector);
};
jindo.$Element.prototype.xpathAll = function (sXPath) {
    return jindo.$$.xpath(sSelector, this._element);
};
jindo.$Event = function (e) {
    var cl = arguments.callee;
    if (e instanceof cl) return e;
    if (!(this instanceof cl)) return new cl(e);
    if (typeof e == "undefined") e = window.event;
    if (e === window.event && document.createEventObject) e = document.createEventObject(e);
    this._event = e;
    this._globalEvent = window.event;
    this.type = e.type.toLowerCase();
    if (this.type == "dommousescroll") {
        this.type = "mousewheel";
    } else if (this.type == "DOMContentLoaded") {
        this.type = "domready";
    }
    this.canceled = false;
    this.element = e.target || e.srcElement;
    this.currentElement = e.currentTarget;
    this.relatedElement = null;
    if (typeof e.relatedTarget != "undefined") {
        this.relatedElement = e.relatedTarget;
    } else if (e.fromElement && e.toElement) {
        this.relatedElement = e[(this.type == "mouseout") ? "toElement" : "fromElement"];
    }
}
jindo.$Event.prototype.mouse = function () {
    var e = this._event;
    var delta = 0;
    var left = (e.which && e.button == 0) || !! (e.button & 1);
    var mid = (e.which && e.button == 1) || !! (e.button & 4);
    var right = (e.which && e.button == 2) || !! (e.button & 2);
    var ret = {};
    if (e.wheelDelta) {
        delta = e.wheelDelta / 120;
    } else if (e.detail) {
        delta = -e.detail / 3;
    }
    ret = {
        delta: delta,
        left: left,
        middle: mid,
        right: right
    };
    this.mouse = function () {
        return ret
    };
    return ret;
};
jindo.$Event.prototype.key = function () {
    var e = this._event;
    var k = e.keyCode || e.charCode;
    var ret = {
        keyCode: k,
        alt: e.altKey,
        ctrl: e.ctrlKey,
        meta: e.metaKey,
        shift: e.shiftKey,
        up: (k == 38),
        down: (k == 40),
        left: (k == 37),
        right: (k == 39),
        enter: (k == 13),
        esc: (k == 27)
    };
    this.key = function () {
        return ret
    };
    return ret;
};
jindo.$Event.prototype.pos = function (bGetOffset) {
    var e = this._event;
    var b = (this.element.ownerDocument || document).body;
    var de = (this.element.ownerDocument || document).documentElement;
    var pos = [b.scrollLeft || de.scrollLeft, b.scrollTop || de.scrollTop];
    var ret = {
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: 'pageX' in e ? e.pageX : e.clientX + pos[0] - b.clientLeft,
        pageY: 'pageY' in e ? e.pageY : e.clientY + pos[1] - b.clientTop,
        layerX: 'offsetX' in e ? e.offsetX : e.layerX - 1,
        layerY: 'offsetY' in e ? e.offsetY : e.layerY - 1
    };
    if (bGetOffset && jindo.$Element) {
        var offset = jindo.$Element(this.element).offset();
        ret.offsetX = ret.pageX - offset.left;
        ret.offsetY = ret.pageY - offset.top;
    }
    return ret;
};
jindo.$Event.prototype.stop = function (nCancel) {
    nCancel = nCancel || jindo.$Event.CANCEL_ALL;
    var e = (window.event && window.event == this._globalEvent) ? this._globalEvent : this._event;
    var b = !! (nCancel & jindo.$Event.CANCEL_BUBBLE);
    var d = !! (nCancel & jindo.$Event.CANCEL_DEFAULT);
    this.canceled = true;
    if (typeof e.preventDefault != "undefined" && d) e.preventDefault();
    if (typeof e.stopPropagation != "undefined" && b) e.stopPropagation();
    if (d) e.returnValue = false;
    if (b) e.cancelBubble = true;
    return this;
};
jindo.$Event.prototype.stopDefault = function () {
    return this.stop(jindo.$Event.CANCEL_DEFAULT);
}
jindo.$Event.prototype.stopBubble = function () {
    return this.stop(jindo.$Event.CANCEL_BUBBLE);
}
jindo.$Event.prototype.$value = function () {
    return this._event;
};
jindo.$Event.CANCEL_BUBBLE = 1;
jindo.$Event.CANCEL_DEFAULT = 2;
jindo.$Event.CANCEL_ALL = 3;
jindo.$Fn = function (func, thisObject) {
    var cl = arguments.callee;
    if (func instanceof cl) return func;
    if (!(this instanceof cl)) return new cl(func, thisObject);
    this._events = [];
    this._tmpElm = null;
    this._key = null;
    if (typeof func == "function") {
        this._func = func;
        this._this = thisObject;
    } else if (typeof func == "string" && typeof thisObject == "string") {
        this._func = new Function(func, thisObject);
    }
}
jindo.$Fn.prototype.$value = function () {
    return this._func;
};
jindo.$Fn.prototype.bind = function () {
    var a = jindo.$A(arguments).$value();
    var f = this._func;
    var t = this._this;
    var b = function () {
        var args = jindo.$A(arguments).$value();
        if (a.length) args = a.concat(args);
        return f.apply(t, args);
    };
    return b;
};
jindo.$Fn.prototype.bindForEvent = function () {
    var a = arguments;
    var f = this._func;
    var t = this._this;
    var m = this._tmpElm || null;
    var b = function (e) {
        var args = jindo.$A(a);
        if (typeof e == "undefined") e = window.event;
        if (typeof e.currentTarget == "undefined") {
            e.currentTarget = m;
        }
        var oEvent = jindo.$Event(e);
        args.unshift(oEvent);
        var returnValue = f.apply(t, args.$value());
        if (typeof returnValue != "undefined" && oEvent.type == "beforeunload") {
            e.returnValue = returnValue;
        }
        return returnValue;
    };
    return b;
};
jindo.$Fn.prototype.attach = function (oElement, sEvent, bUseCapture) {
    var fn = null,
        l, ev = sEvent,
        el = oElement,
        ua = navigator.userAgent;
    if (typeof bUseCapture == "undefined") {
        bUseCapture = false;
    };
    this._bUseCapture = bUseCapture;
    if ((el instanceof Array) || (jindo.$A && (el instanceof jindo.$A) && (el = el.$value()))) {
        for (var i = 0; i < el.length; i++) this.attach(el[i], ev, bUseCapture);
        return this;
    }
    if (!el || !ev) return this;
    if (typeof el.$value == "function") el = el.$value();
    el = jindo.$(el);
    ev = ev.toLowerCase();
    this._tmpElm = el;
    fn = this.bindForEvent();
    this._tmpElm = null;
    if (typeof el.addEventListener != "undefined") {
        if (ev == "domready") {
            ev = "DOMContentLoaded";
        } else if (ev == "mousewheel" && ua.indexOf("WebKit") < 0 && !/Opera/.test(ua)) {
            ev = "DOMMouseScroll";
        } else if (ev == "mouseenter") {
            ev = "mouseover";
            fn = jindo.$Fn._fireWhenElementBoundary(el, fn);
        } else if (ev == "mouseleave") {
            ev = "mouseout";
            fn = jindo.$Fn._fireWhenElementBoundary(el, fn);
        }
        el.addEventListener(ev, fn, bUseCapture);
    } else if (typeof el.attachEvent != "undefined") {
        if (ev == "domready") {
            jindo.$Fn._domready(el, fn);
            return this;
        } else {
            el.attachEvent("on" + ev, fn);
        }
    }
    if (!this._key) {
        this._key = "$" + jindo.$Fn.gc.count++;
        jindo.$Fn.gc.pool[this._key] = this;
    }
    this._events[this._events.length] = {
        element: el,
        event: sEvent.toLowerCase(),
        func: fn
    };
    return this;
};
jindo.$Fn.prototype.detach = function (oElement, sEvent) {
    var fn = null,
        l, el = oElement,
        ev = sEvent,
        ua = navigator.userAgent;
    if ((el instanceof Array) || (jindo.$A && (el instanceof jindo.$A) && (el = el.$value()))) {
        for (var i = 0; i < el.length; i++) this.detach(el[i], ev);
        return this;
    }
    if (!el || !ev) return this;
    if (jindo.$Element && el instanceof jindo.$Element) el = el.$value();
    el = jindo.$(el);
    ev = ev.toLowerCase();
    var e = this._events;
    for (var i = 0; i < e.length; i++) {
        if (e[i].element !== el || e[i].event !== ev) continue;
        fn = e[i].func;
        this._events = jindo.$A(this._events).refuse(e[i]).$value();
        break;
    }
    if (typeof el.removeEventListener != "undefined") {
        if (ev == "domready") {
            ev = "DOMContentLoaded";
        } else if (ev == "mousewheel" && ua.indexOf("WebKit") < 0) {
            ev = "DOMMouseScroll";
        } else if (ev == "mouseenter") {
            ev = "mouseover";
        } else if (ev == "mouseleave") {
            ev = "mouseout";
        }
        el.removeEventListener(ev, fn, false);
    } else if (typeof el.detachEvent != "undefined") {
        if (ev == "domready") {
            jindo.$Fn._domready.list = jindo.$Fn._domready.list.refuse(fn);
            return this;
        } else {
            el.detachEvent("on" + ev, fn);
        }
    }
    return this;
};
jindo.$Fn.prototype.delay = function (nSec, args) {
    if (typeof args == "undefined") args = [];
    setTimeout(this.bind.apply(this, args), nSec * 1000);
    return this;
};
jindo.$Fn.prototype.setInterval = function (nSec, args) {
    if (typeof args == "undefined") args = [];
    return setInterval(this.bind.apply(this, args), nSec * 1000);
};
jindo.$Fn.prototype.free = function (oElement) {
    var len = this._events.length;
    while (len > 0) {
        var el = this._events[--len].element;
        if (oElement && el != oElement) continue;
        this.detach(el, this._events[len].event);
        delete this._events[len];
    }
    if (this._events.length == 0) try {
        delete jindo.$Fn.gc.pool[this._key];
    } catch (e) {};
};
jindo.$Fn._domready = function (doc, func) {
    if (typeof jindo.$Fn._domready.list == "undefined") {
        var f = null,
            l = jindo.$Fn._domready.list = jindo.$A([func]);
        var done = false,
            execFuncs = function () {
                if (!done) {
                    done = true;
                    var evt = {
                        type: "domready",
                        target: doc,
                        currentTarget: doc
                    };
                    while (f = l.shift()) f(evt);
                }
            };
        (function () {
            try {
                doc.documentElement.doScroll("left");
            } catch (e) {
                setTimeout(arguments.callee, 50);
                return;
            }
            execFuncs();
        })();
        doc.onreadystatechange = function () {
            if (doc.readyState == 'complete') {
                doc.onreadystatechange = null;
                execFuncs();
            }
        };
    } else {
        jindo.$Fn._domready.list.push(func);
    }
};
jindo.$Fn._fireWhenElementBoundary = function (doc, func) {
    return function (evt) {
        var oEvent = jindo.$Event(evt);
        var relatedElement = jindo.$Element(oEvent.relatedElement);
        if (relatedElement && (relatedElement.isEqual(this) || relatedElement.isChildOf(this))) return;
        func.call(this, evt);
    }
};
jindo.$Fn.gc = function () {
    var p = jindo.$Fn.gc.pool;
    for (var key in p) {
        try {
            p[key].free();
        } catch (e) {};
    }
    jindo.$Fn.gc.pool = p = {};
};
jindo.$Fn.freeElement = function (oElement) {
    var p = jindo.$Fn.gc.pool;
    for (var key in p) {
        try {
            p[key].free(oElement);
        } catch (e) {};
    }
}
jindo.$Fn.gc.count = 0;
jindo.$Fn.gc.pool = {};

var ua = navigator.userAgent;
var isIPad = (ua.indexOf("iPad") > -1);
var isAndroid = (ua.indexOf("Android") > -1);
var isMSafari = (!(ua.indexOf("IEMobile") > -1) && (ua.indexOf("Mobile") > -1) )||(isIPad && (ua.indexOf("Safari") > -1));
				// (!f("IEMobile",u) && f("Mobile",u))||(f("iPad",u)&&f("Safari",u));
// alert(!(ua.indexOf("IEMobile") > -1) + " - " + ua.indexOf("Mobile") > -1 + " - " + isIPad + " - " +ua.indexOf("Safari") > -1);
if (typeof window != "undefined" && isMSafari && !isAndroid && !isIPad) {
     jindo.$Fn(jindo.$Fn.gc).attach(window, "unload");
}
jindo.$H = function (hashObject) {
    var cl = arguments.callee;
    if (typeof hashObject == "undefined") hashObject = new Object;
    if (hashObject instanceof cl) return hashObject;
    if (!(this instanceof cl)) return new cl(hashObject);
    this._table = {};
    for (var k in hashObject) {
        if (this._table[k] == hashObject[k]) continue;
        this._table[k] = hashObject[k];
    }
};
jindo.$H.prototype.$value = function () {
    return this._table;
};
jindo.$H.prototype.$ = function (key, value) {
    if (typeof value == "undefined") {
        return this._table[key];
    }
    this._table[key] = value;
    return this;
};
jindo.$H.prototype.length = function () {
    var i = 0;
    for (var k in this._table) {
        if (typeof Object.prototype[k] != "undeifned" && Object.prototype[k] === this._table[k]) continue;
        i++;
    }
    return i;
};
jindo.$H.prototype.forEach = function (callback, thisObject) {
    var t = this._table;
    var h = this.constructor;
    for (var k in t) {
        if (!t.propertyIsEnumerable(k)) continue;
        try {
            callback.call(thisObject, t[k], k, t);
        } catch (e) {
            if (e instanceof h.Break) break;
            if (e instanceof h.Continue) continue;
            throw e;
        }
    }
    return this;
};
jindo.$H.prototype.filter = function (callback, thisObject) {
    var h = jindo.$H();
    this.forEach(function (v, k, o) {
        if (callback.call(thisObject, v, k, o) === true) {
            h.add(k, v);
        }
    });
    return h;
};
jindo.$H.prototype.map = function (callback, thisObject) {
    var t = this._table;
    this.forEach(function (v, k, o) {
        t[k] = callback.call(thisObject, v, k, o);
    });
    return this;
};
jindo.$H.prototype.add = function (key, value) {
    this._table[key] = value;
    return this;
};
jindo.$H.prototype.remove = function (key) {
    if (typeof this._table[key] == "undefined") return null;
    var val = this._table[key];
    delete this._table[key];
    return val;
};
jindo.$H.prototype.search = function (value) {
    var result = false;
    this.forEach(function (v, k, o) {
        if (v === value) {
            result = k;
            jindo.$H.Break();
        }
    });
    return result;
};
jindo.$H.prototype.hasKey = function (key) {
    var result = false;
    return (typeof this._table[key] != "undefined");
};
jindo.$H.prototype.hasValue = function (value) {
    return (this.search(value) !== false);
};
jindo.$H.prototype.sort = function () {
    var o = new Object;
    var a = this.values();
    var k = false;
    a.sort();
    for (var i = 0; i < a.length; i++) {
        k = this.search(a[i]);
        o[k] = a[i];
        delete this._table[k];
    }
    this._table = o;
    return this;
};
jindo.$H.prototype.ksort = function () {
    var o = new Object;
    var a = this.keys();
    a.sort();
    for (var i = 0; i < a.length; i++) {
        o[a[i]] = this._table[a[i]];
    }
    this._table = o;
    return this;
};
jindo.$H.prototype.keys = function () {
    var keys = new Array;
    for (var k in this._table) {
        keys.push(k);
    }
    return keys;
};
jindo.$H.prototype.values = function () {
    var values = [];
    for (var k in this._table) {
        values[values.length] = this._table[k];
    }
    return values;
};
jindo.$H.prototype.toQueryString = function () {
    var buf = [],
        val = null,
        idx = 0;
    for (var k in this._table) {
        if (typeof(val = this._table[k]) == "object" && val.constructor == Array) {
            for (i = 0; i < val.length; i++) {
                buf[buf.length] = encodeURIComponent(k) + "[]=" + encodeURIComponent(val[i] + "");
            }
        } else {
            buf[buf.length] = encodeURIComponent(k) + "=" + encodeURIComponent(this._table[k] + "");
        }
    }
    return buf.join("&");
};
jindo.$H.prototype.empty = function () {
    var keys = this.keys();
    for (var i = 0; i < keys.length; i++) {
        delete this._table[keys[i]];
    }
    return this;
};
jindo.$H.Break = function () {
    if (!(this instanceof arguments.callee)) throw new arguments.callee;
};
jindo.$H.Continue = function () {
    if (!(this instanceof arguments.callee)) throw new arguments.callee;
};
if (typeof window != "undefined") {
    for (prop in jindo) {
        window[prop] = jindo[prop];
    }
}