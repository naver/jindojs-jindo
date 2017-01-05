/**
 
 * @fileOverview An optional engine that uses a CSS selector.
 * @name cssquery.js
 * @author Hooriza
  
 */

/**
 
 * Searches objects by using a CSS selector.
 *
 * @function Searches objects by using a CSS selector.
 * @param {String} CSS selector
 * @param {Element} An element to to be searched. The target to be searched is limited to its sub nodes.
 * @return {Array} Returns an array of elements satisfying conditions.
 * @description [Lite]
 * @example
 // Searches IMG tags in a document.
 var imgs = $$('IMG');

 // Searches IMG tags under div section.
 var imgsInDiv = $$('IMG', $('div'));

 // Searches the first element of IMG tags in a document.
 var firstImg = $$.getSingle('IMG');
  
 */
jindo.$$ = jindo.cssquery = (function() {
	/*
	 
Sets querySelector.
  
	 */
	var sVersion = '3.0';
	
	var debugOption = { repeat : 1 };
	
	/*
	 
Sets a unique key value for quick processing.
  
	 */
	var UID = 1;
	
	var cost = 0;
	var validUID = {};
	
	var bSupportByClassName = document.getElementsByClassName ? true : false;
	var safeHTML = false;
	
	var getUID4HTML = function(oEl) {
		
		var nUID = safeHTML ? (oEl._cssquery_UID && oEl._cssquery_UID[0]) : oEl._cssquery_UID;
		if (nUID && validUID[nUID] == oEl) return nUID;
		
		nUID = UID++;
		oEl._cssquery_UID = safeHTML ? [ nUID ] : nUID;
		
		validUID[nUID] = oEl;
		return nUID;

	};
	
	var getUID4XML = function(oEl) {
		
		var oAttr = oEl.getAttribute('_cssquery_UID');
		var nUID = safeHTML ? (oAttr && oAttr[0]) : oAttr;
		
		if (!nUID) {
			nUID = UID++;
			oEl.setAttribute('_cssquery_UID', safeHTML ? [ nUID ] : nUID);
		}
		
		return nUID;
		
	};
	
	var getUID = getUID4HTML;
	
	var uniqid = function(sPrefix) {
		return (sPrefix || '') + new Date().getTime() + parseInt(Math.random() * 100000000,10);
	};
	
	function getElementsByClass(searchClass,node,tag) {
        var classElements = new Array();
        if ( node == null )
                node = document;
        if ( tag == null )
                tag = '*';
        var els = node.getElementsByTagName(tag);
        var elsLen = els.length;
        var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
        for (i = 0, j = 0; i < elsLen; i++) {
                if ( pattern.test(els[i].className) ) {
                        classElements[j] = els[i];
                        j++;
                }
        }
        return classElements;
	}

	var getChilds_dontShrink = function(oEl, sTagName, sClassName) {
		if (bSupportByClassName && sClassName) {
			if(oEl.getElementsByClassName)
				return oEl.getElementsByClassName(sClassName);
			if(oEl.querySelectorAll)
				return oEl.querySelectorAll(sClassName);
			return getElementsByClass(sClassName, oEl, sTagName);
		}else if (sTagName == '*') {
			return oEl.all || oEl.getElementsByTagName(sTagName);
		}
		return oEl.getElementsByTagName(sTagName);
	};

	var clearKeys = function() {
		 backupKeys._keys = {};
	};
	
	var oDocument_dontShrink = document;
	
	var bXMLDocument = false;
	
	/*
	 
Replaces strings that may cause problems while parsing such as double quotes, [], and so on.
  
	 */
	var backupKeys = function(sQuery) {
		
		var oKeys = backupKeys._keys;
		
		/*
		 
Replaces single quotations.
  
		 */
		sQuery = sQuery.replace(/'(\\'|[^'])*'/g, function(sAll) {
			var uid = uniqid('QUOT');
			oKeys[uid] = sAll;
			return uid;
		});
		
		/*
		 
Replaces double quotations.
  
		 */
		sQuery = sQuery.replace(/"(\\"|[^"])*"/g, function(sAll) {
			var uid = uniqid('QUOT');
			oKeys[uid] = sAll;
			return uid;
		});
		
		/*
		 
Replaces [].
  
		 */
		sQuery = sQuery.replace(/\[(.*?)\]/g, function(sAll, sBody) {
			if (sBody.indexOf('ATTR') == 0) return sAll;
			var uid = '[' + uniqid('ATTR') + ']';
			oKeys[uid] = sAll;
			return uid;
		});
	
		/*
		
Replaces ().
  
		 */
		var bChanged;
		
		do {
			
			bChanged = false;
		
			sQuery = sQuery.replace(/\(((\\\)|[^)|^(])*)\)/g, function(sAll, sBody) {
				if (sBody.indexOf('BRCE') == 0) return sAll;
				var uid = '_' + uniqid('BRCE');
				oKeys[uid] = sAll;
				bChanged = true;
				return uid;
			});
		
		} while(bChanged);
	
		return sQuery;
		
	};
	
	/*
	 
Restores the replaced strings.
  
	 */
	var restoreKeys = function(sQuery, bOnlyAttrBrace) {
		
		var oKeys = backupKeys._keys;
	
		var bChanged;
		var rRegex = bOnlyAttrBrace ? /(\[ATTR[0-9]+\])/g : /(QUOT[0-9]+|\[ATTR[0-9]+\])/g;
		
		do {
			
			bChanged = false;
	
			sQuery = sQuery.replace(rRegex, function(sKey) {
				
				if (oKeys[sKey]) {
					bChanged = true;
					return oKeys[sKey];
				}
				
				return sKey;
	
			});
		
		} while(bChanged);
		
		/*
		
Removes ( ). 
  
		 */
		sQuery = sQuery.replace(/_BRCE[0-9]+/g, function(sKey) {
			return oKeys[sKey] ? oKeys[sKey] : sKey;
		});
		
		return sQuery;
		
	};
	
	/*
	 
Returns all strings except Quot in the replaced strings.
  
	 */
	var restoreString = function(sKey) {
		
		var oKeys = backupKeys._keys;
		var sOrg = oKeys[sKey];
		
		if (!sOrg) return sKey;
		return eval(sOrg);
		
	};
	
	var wrapQuot = function(sStr) {
		return '"' + sStr.replace(/"/g, '\\"') + '"';
	};
	
	var getStyleKey = function(sKey) {

		if (/^@/.test(sKey)) return sKey.substr(1);
		return null;
		
	};
	
	var getCSS = function(oEl, sKey) {
		
		if (oEl.currentStyle) {
			
			if (sKey == "float") sKey = "styleFloat";
			return oEl.currentStyle[sKey] || oEl.style[sKey];
			
		} else if (window.getComputedStyle) {
			
			return oDocument_dontShrink.defaultView.getComputedStyle(oEl, null).getPropertyValue(sKey.replace(/([A-Z])/g,"-$1").toLowerCase()) || oEl.style[sKey];
			
		}

		if (sKey == "float" && /MSIE/.test(window.navigator.userAgent)) sKey = "styleFloat";
		return oEl.style[sKey];
		
	};

	var oCamels = {
		'accesskey' : 'accessKey',
		'cellspacing' : 'cellSpacing',
		'cellpadding' : 'cellPadding',
		'class' : 'className',
		'colspan' : 'colSpan',
		'for' : 'htmlFor',
		'maxlength' : 'maxLength',
		'readonly' : 'readOnly',
		'rowspan' : 'rowSpan',
		'tabindex' : 'tabIndex',
		'valign' : 'vAlign'
	};

	var getDefineCode = function(sKey) {
		
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
	
	var getReturnCode = function(oExpr) {
		
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
	
	var getNodeIndex = function(oEl) {
		var nUID = getUID(oEl);
		var nIndex = oNodeIndexes[nUID] || 0;
		
		/*
		 
If node indexes are not obtained
  
		 */
		if (nIndex == 0) {

			for (var oSib = (oEl.parentNode || oEl._IE5_parentNode).firstChild; oSib; oSib = oSib.nextSibling) {
				
				if (oSib.nodeType != 1){ 
					continue;
				}
				nIndex++;

				setNodeIndex(oSib, nIndex);
				
			}
						
			nIndex = oNodeIndexes[nUID];
			
		}
				
		return nIndex;
				
	};
	
	/*
	 
The below describes how to set the child node.
  
	 */
	var oNodeIndexes = {};

	var setNodeIndex = function(oEl, nIndex) {
		var nUID = getUID(oEl);
		oNodeIndexes[nUID] = nIndex;
	};
	
	var unsetNodeIndexes = function() {
		setTimeout(function() { oNodeIndexes = {}; }, 0);
	};
	
	/*
	 
A virtual class
  
	 */
	var oPseudoes_dontShrink = {
	
		'contains' : function(oEl, sOption) {
			return (oEl.innerText || oEl.textContent || '').indexOf(sOption) > -1;
		},
		
		'last-child' : function(oEl, sOption) {
			for (oEl = oEl.nextSibling; oEl; oEl = oEl.nextSibling){
				if (oEl.nodeType == 1)
					return false;
			}
				
			
			return true;
		},
		
		'first-child' : function(oEl, sOption) {
			for (oEl = oEl.previousSibling; oEl; oEl = oEl.previousSibling){
				if (oEl.nodeType == 1)
					return false;
			}
				
					
			return true;
		},
		
		'only-child' : function(oEl, sOption) {
			var nChild = 0;
			
			for (var oChild = (oEl.parentNode || oEl._IE5_parentNode).firstChild; oChild; oChild = oChild.nextSibling) {
				if (oChild.nodeType == 1) nChild++;
				if (nChild > 1) return false;
			}
			
			return nChild ? true : false;
		},

		'empty' : function(oEl, _) {
			return oEl.firstChild ? false : true;
		},
		
		'nth-child' : function(oEl, nMul, nAdd) {
			var nIndex = getNodeIndex(oEl);
			return nIndex % nMul == nAdd;
		},
		
		'nth-last-child' : function(oEl, nMul, nAdd) {
			var oLast = (oEl.parentNode || oEl._IE5_parentNode).lastChild;
			for (; oLast; oLast = oLast.previousSibling){
				if (oLast.nodeType == 1) break;
			}
				
				
			var nTotal = getNodeIndex(oLast);
			var nIndex = getNodeIndex(oEl);
			
			var nLastIndex = nTotal - nIndex + 1;
			return nLastIndex % nMul == nAdd;
		},
		'checked' : function(oEl){
			return !!oEl.checked;
		},
		'selected' : function(oEl){
			return !!oEl.selected;
		},
		'enabled' : function(oEl){
			return !oEl.disabled;
		},
		'disabled' : function(oEl){
			return !!oEl.disabled;
		}
	};
	
	/*
	 
Gets an expression from the body of a single part.
  
	 */
	var getExpression = function(sBody) {

		var oRet = { defines : '', returns : 'true' };
		
		var sBody = restoreKeys(sBody, true);
	
		var aExprs = [];
		var aDefineCode = [], aReturnCode = [];
		var sId, sTagName;
		
		/*
		 
Gets the conditions of pseudo classes.
  
		 */
		var sBody = sBody.replace(/:([\w-]+)(\(([^)]*)\))?/g, function(_1, sType, _2, sOption) {
			
			switch (sType) {
			case 'not':
                /*
                 
Parses the value in parentheses recursively.
  
                 */
				var oInner = getExpression(sOption);
				
				var sFuncDefines = oInner.defines;
				var sFuncReturns = oInner.returnsID + oInner.returnsTAG + oInner.returns;
				
				aReturnCode.push('!(function() { ' + sFuncDefines + ' return ' + sFuncReturns + ' })()');
				break;
				
			case 'nth-child':
			case 'nth-last-child':
				sOption =  restoreString(sOption);
				
				if (sOption == 'even'){
					sOption = '2n';
				}else if (sOption == 'odd') {
					sOption = '2n+1';
				}

				var nMul, nAdd;
				var matchstr = sOption.match(/([0-9]*)n([+-][0-9]+)*/);
				if (matchstr) {
					nMul = matchstr[1] || 1;
					nAdd = matchstr[2] || 0;
				} else {
					nMul = Infinity;
					nAdd = parseInt(sOption,10);
				}
				aReturnCode.push('oPseudoes_dontShrink[' + wrapQuot(sType) + '](oEl, ' + nMul + ', ' + nAdd + ')');
				break;
				
			case 'first-of-type':
			case 'last-of-type':
				sType = (sType == 'first-of-type' ? 'nth-of-type' : 'nth-last-of-type');
				sOption = 1;
				
			case 'nth-of-type':
			case 'nth-last-of-type':
				sOption =  restoreString(sOption);
				
				if (sOption == 'even') {
					sOption = '2n';
				}else if (sOption == 'odd'){
					sOption = '2n+1';
				}

				var nMul, nAdd;
				
				if (/([0-9]*)n([+-][0-9]+)*/.test(sOption)) {
					nMul = parseInt(RegExp.$1,10) || 1;
					nAdd = parseInt(RegExp.$2,20) || 0;
				} else {
					nMul = Infinity;
					nAdd = parseInt(sOption,10);
				}
				
				oRet.nth = [ nMul, nAdd, sType ];
				break;
				
			default:
				sOption = sOption ? restoreString(sOption) : '';
				aReturnCode.push('oPseudoes_dontShrink[' + wrapQuot(sType) + '](oEl, ' + wrapQuot(sOption) + ')');
				break;
			}
			
			return '';
			
		});
		
		/*
		 
Gets [key=value] pattern.
  
		 */
		var sBody = sBody.replace(/\[(@?[\w-]+)(([!^~$*]?=)([^\]]*))?\]/g, function(_1, sKey, _2, sOp, sVal) {
			
			sKey = restoreString(sKey);
			sVal = restoreString(sVal);
			
			if (sKey == 'checked' || sKey == 'disabled' || sKey == 'enabled' || sKey == 'readonly' || sKey == 'selected') {
				
				if (!sVal) {
					sOp = '=';
					sVal = 'true';
				}
				
			}
			
			aExprs.push({ key : sKey, op : sOp, val : sVal });
			return '';
	
		});
		
		var sClassName = null;
	
		/*
		 
Gets class conditions.
  
		 */
		var sBody = sBody.replace(/\.([\w-]+)/g, function(_, sClass) { 
			aExprs.push({ key : 'class', op : '~=', val : sClass });
			if (!sClassName) sClassName = sClass;
			return '';
		});
		
		/*
		 
Gets id conditions.
  
		 */
		var sBody = sBody.replace(/#([\w-]+)/g, function(_, sIdValue) {
			if (bXMLDocument) {
				aExprs.push({ key : 'id', op : '=', val : sIdValue });
			}else{
				sId = sIdValue;
			}
			return '';
		});
		
		sTagName = sBody == '*' ? '' : sBody;
	
		/*
		 
Creates the code of a match function.
  
		 */
		var oVars = {};
		
		for (var i = 0, oExpr; oExpr = aExprs[i]; i++) {
			
			var sKey = oExpr.key;
			
			if (!oVars[sKey]) aDefineCode.push(getDefineCode(sKey));
            /*
             
Uses unshift so that checking the pseudo-class on a specific condition can move to the end.
  
             */
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
	
	/*
	 
Splits queries by operator.
  
	 */
	var splitToParts = function(sQuery) {
		
		var aParts = [];
		var sRel = ' ';
		
		var sBody = sQuery.replace(/(.*?)\s*(!?[+>~ ]|!)\s*/g, function(_, sBody, sRelative) {
			
			if (sBody) aParts.push({ rel : sRel, body : sBody });
	
			sRel = sRelative.replace(/\s+$/g, '') || ' ';
			return '';
			
		});
	
		if (sBody) aParts.push({ rel : sRel, body : sBody });
		
		return aParts;
		
	};
	
	var isNth_dontShrink = function(oEl, sTagName, nMul, nAdd, sDirection) {
		
		var nIndex = 0;
		for (var oSib = oEl; oSib; oSib = oSib[sDirection]){
			if (oSib.nodeType == 1 && (!sTagName || sTagName == oSib.tagName))
					nIndex++;
		}
			

		return nIndex % nMul == nAdd;

	};
	
	/*
	 
Compiles the splitted parts by function.
  
	 */
	var compileParts = function(aParts) {
		
		var aPartExprs = [];
		
		/*
		 
Creates conditions for the splitted parts.
  
		 */
		for (var i = 0, oPart; oPart = aParts[i]; i++)
			aPartExprs.push(getExpression(oPart.body));
		
		//////////////////// BEGIN
		
		var sFunc = '';
		var sPushCode = 'aRet.push(oEl); if (oOptions.single) { bStop = true; }';

		for (var i = aParts.length - 1, oPart; oPart = aParts[i]; i--) {
			
			var oExpr = aPartExprs[i];
			var sPush = (debugOption.callback ? 'cost++;' : '') + oExpr.defines;
			

			var sReturn = 'if (bStop) {' + (i == 0 ? 'return aRet;' : 'return;') + '}';
			
			if (oExpr.returns == 'true') {
				sPush += (sFunc ? sFunc + '(oEl);' : sPushCode) + sReturn;
			}else{
				sPush += 'if (' + oExpr.returns + ') {' + (sFunc ? sFunc + '(oEl);' : sPushCode ) + sReturn + '}';
			}
			
			var sCheckTag = 'oEl.nodeType != 1';
			if (oExpr.quotTAG) sCheckTag = 'oEl.tagName != ' + oExpr.quotTAG;
			
			var sTmpFunc =
				'(function(oBase' +
					(i == 0 ? ', oOptions) { var bStop = false; var aRet = [];' : ') {');

			if (oExpr.nth) {
				sPush =
					'if (isNth_dontShrink(oEl, ' +
					(oExpr.quotTAG ? oExpr.quotTAG : 'false') + ',' +
					oExpr.nth[0] + ',' +
					oExpr.nth[1] + ',' +
					'"' + (oExpr.nth[2] == 'nth-of-type' ? 'previousSibling' : 'nextSibling') + '")) {' + sPush + '}';
			}
			
			switch (oPart.rel) {
			case ' ':
				if (oExpr.quotID) {
					
					sTmpFunc +=
						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
						'var oCandi = oEl;' +
						'for (; oCandi; oCandi = (oCandi.parentNode || oCandi._IE5_parentNode)) {' +
							'if (oCandi == oBase) break;' +
						'}' +
						'if (!oCandi || ' + sCheckTag + ') return aRet;' +
						sPush;
					
				} else {
					
					sTmpFunc +=
						'var aCandi = getChilds_dontShrink(oBase, ' + (oExpr.quotTAG || '"*"') + ', ' + (oExpr.quotCLASS || 'null') + ');' +
						'for (var i = 0, oEl; oEl = aCandi[i]; i++) {' +
							(oExpr.quotCLASS ? 'if (' + sCheckTag + ') continue;' : '') +
							sPush +
						'}';
					
				}
			
				break;
				
			case '>':
				if (oExpr.quotID) {
	
					sTmpFunc +=
						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
						'if ((oEl.parentNode || oEl._IE5_parentNode) != oBase || ' + sCheckTag + ') return aRet;' +
						sPush;
					
				} else {
	
					sTmpFunc +=
						'for (var oEl = oBase.firstChild; oEl; oEl = oEl.nextSibling) {' +
							'if (' + sCheckTag + ') { continue; }' +
							sPush +
						'}';
					
				}
				
				break;
				
			case '+':
				if (oExpr.quotID) {
	
					sTmpFunc +=
						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
						'var oPrev;' +
						'for (oPrev = oEl.previousSibling; oPrev; oPrev = oPrev.previousSibling) { if (oPrev.nodeType == 1) break; }' +
						'if (!oPrev || oPrev != oBase || ' + sCheckTag + ') return aRet;' +
						sPush;
					
				} else {
	
					sTmpFunc +=
						'for (var oEl = oBase.nextSibling; oEl; oEl = oEl.nextSibling) { if (oEl.nodeType == 1) break; }' +
						'if (!oEl || ' + sCheckTag + ') { return aRet; }' +
						sPush;
					
				}
				
				break;
			
			case '~':
	
				if (oExpr.quotID) {
	
					sTmpFunc +=
						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
						'var oCandi = oEl;' +
						'for (; oCandi; oCandi = oCandi.previousSibling) { if (oCandi == oBase) break; }' +
						'if (!oCandi || ' + sCheckTag + ') return aRet;' +
						sPush;
					
				} else {
	
					sTmpFunc +=
						'for (var oEl = oBase.nextSibling; oEl; oEl = oEl.nextSibling) {' +
							'if (' + sCheckTag + ') { continue; }' +
							'if (!markElement_dontShrink(oEl, ' + i + ')) { break; }' +
							sPush +
						'}';
	
				}
				
				break;
				
			case '!' :
			
				if (oExpr.quotID) {
					
					sTmpFunc +=
						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
						'for (; oBase; oBase = (oBase.parentNode || oBase._IE5_parentNode)) { if (oBase == oEl) break; }' +
						'if (!oBase || ' + sCheckTag + ') return aRet;' +
						sPush;
						
				} else {
					
					sTmpFunc +=
						'for (var oEl = (oBase.parentNode || oBase._IE5_parentNode); oEl; oEl = (oEl.parentNode || oEl._IE5_parentNode)) {'+
							'if (' + sCheckTag + ') { continue; }' +
							sPush +
						'}';
					
				}
				
				break;
	
			case '!>' :
			
				if (oExpr.quotID) {
	
					sTmpFunc +=
						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
						'var oRel = (oBase.parentNode || oBase._IE5_parentNode);' +
						'if (!oRel || oEl != oRel || (' + sCheckTag + ')) return aRet;' +
						sPush;
					
				} else {
	
					sTmpFunc +=
						'var oEl = (oBase.parentNode || oBase._IE5_parentNode);' +
						'if (!oEl || ' + sCheckTag + ') { return aRet; }' +
						sPush;
					
				}
				
				break;
				
			case '!+' :
				
				if (oExpr.quotID) {
	
					sTmpFunc +=
						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
						'var oRel;' +
						'for (oRel = oBase.previousSibling; oRel; oRel = oRel.previousSibling) { if (oRel.nodeType == 1) break; }' +
						'if (!oRel || oEl != oRel || (' + sCheckTag + ')) return aRet;' +
						sPush;
					
				} else {
	
					sTmpFunc +=
						'for (oEl = oBase.previousSibling; oEl; oEl = oEl.previousSibling) { if (oEl.nodeType == 1) break; }' +
						'if (!oEl || ' + sCheckTag + ') { return aRet; }' +
						sPush;
					
				}
				
				break;
	
			case '!~' :
				
				if (oExpr.quotID) {
					
					sTmpFunc +=
						'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
						'var oRel;' +
						'for (oRel = oBase.previousSibling; oRel; oRel = oRel.previousSibling) { ' +
							'if (oRel.nodeType != 1) { continue; }' +
							'if (oRel == oEl) { break; }' +
						'}' +
						'if (!oRel || (' + sCheckTag + ')) return aRet;' +
						sPush;
					
				} else {
	
					sTmpFunc +=
						'for (oEl = oBase.previousSibling; oEl; oEl = oEl.previousSibling) {' +
							'if (' + sCheckTag + ') { continue; }' +
							'if (!markElement_dontShrink(oEl, ' + i + ')) { break; }' +
							sPush +
						'}';
					
				}
				
				break;
			}
	
			sTmpFunc +=
				(i == 0 ? 'return aRet;' : '') +
			'})';
			
			sFunc = sTmpFunc;
			
		}
		
		eval('var fpCompiled = ' + sFunc + ';');
		return fpCompiled;
		
	};
	
	/*
	 
Converts queries to a match function.
  
	 */
	var parseQuery = function(sQuery) {
		
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
	
	/*
	 
Converts test queries to a match function.
  
	 */
	var parseTestQuery = function(sQuery) {
		
		var fpSelf = arguments.callee;
		
		var aSplitQuery = backupKeys(sQuery).split(/\s*,\s*/);
		var aResult = [];
		
		var nLen = aSplitQuery.length;
		var aFunc = [];
		
		for (var i = 0; i < nLen; i++) {

			aFunc.push((function(sQuery) {
				
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
	
	var distinct = function(aList) {
	
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
	
	var markElement_dontShrink = function(oEl, nDepth) {
		
		var nUID = getUID(oEl);
		if (cssquery._marked[nDepth][nUID]) return false;
		
		cssquery._marked[nDepth][nUID] = true;
		return true;

	};
	
	var oResultCache = null;
	var bUseResultCache = false;
	var bExtremeMode = false;
		
	var old_cssquery = function(sQuery, oParent, oOptions) {
		
		if (typeof sQuery == 'object') {
			
			var oResult = {};
			
			for (var k in sQuery){
				if(sQuery.hasOwnProperty(k))
					oResult[k] = arguments.callee(sQuery[k], oParent, oOptions);
			}
			
			return oResult;
		}
		
		cost = 0;
		
		var executeTime = new Date().getTime();
		var aRet;
		
		for (var r = 0, rp = debugOption.repeat; r < rp; r++) {
			
			aRet = (function(sQuery, oParent, oOptions) {
				
				if(oOptions){
					if(!oOptions.oneTimeOffCache){
						oOptions.oneTimeOffCache = false;
					}
				}else{
					oOptions = {oneTimeOffCache:false};
				}
				cssquery.safeHTML(oOptions.oneTimeOffCache);
				
				if (!oParent) oParent = document;
					
				/*
				 
Finds ownerDocument.
  
				 */
				oDocument_dontShrink = oParent.ownerDocument || oParent.document || oParent;
				
				/*
				 
Internet Explorer 5.5 or earlier
  
				 */
				if (/\bMSIE\s([0-9]+(\.[0-9]+)*);/.test(navigator.userAgent) && parseFloat(RegExp.$1) < 6) {
					try { oDocument_dontShrink.location; } catch(e) { oDocument_dontShrink = document; }
					
					oDocument_dontShrink.firstChild = oDocument_dontShrink.getElementsByTagName('html')[0];
					oDocument_dontShrink.firstChild._IE5_parentNode = oDocument_dontShrink;
				}
				
				/*
				 
Checks whether or not XMLDocument
  
				 */
				bXMLDocument = (typeof XMLDocument != 'undefined') ? (oDocument_dontShrink.constructor === XMLDocument) : (!oDocument_dontShrink.location);
				getUID = bXMLDocument ? getUID4XML : getUID4HTML;
		
				clearKeys();
				
				/*
				 
Queries separated by commas
  
				 */
				var aSplitQuery = backupKeys(sQuery).split(/\s*,\s*/);
				var aResult = [];
				
				var nLen = aSplitQuery.length;
				
				for (var i = 0; i < nLen; i++)
					aSplitQuery[i] = restoreKeys(aSplitQuery[i]);
				
				/*
				 
Query loops separated by commas
  
				 */
				for (var i = 0; i < nLen; i++) {
					
					var sSingleQuery = aSplitQuery[i];
					var aSingleQueryResult = null;
					
					var sResultCacheKey = sSingleQuery + (oOptions.single ? '_single' : '');
		
					/*
					 
Searches a result cache.
  
					 */
					var aCache = bUseResultCache ? oResultCache[sResultCacheKey] : null;
					if (aCache) {
						
						/*
						 
Checks whether a search result is founded by specifying the same query strings and parent elements. If the same result is founded, the result of aSingleQueryResult is stored.
  
						 */
						for (var j = 0, oCache; oCache = aCache[j]; j++) {
							if (oCache.parent == oParent) {
								aSingleQueryResult = oCache.result;
								break;
							}
						}
						
					}
					
					if (!aSingleQueryResult) {
						
						var fpFunction = parseQuery(sSingleQuery);
						// alert(fpFunction);
						
						cssquery._marked = [];
						for (var j = 0, nDepth = fpFunction.depth; j < nDepth; j++)
							cssquery._marked.push({});
						
						// console.log(fpFunction.toSource());
						aSingleQueryResult = distinct(fpFunction(oParent, oOptions));
						
						/*
					     
Stores in cache if a result cache is being used.
  
						 */
						if (bUseResultCache&&!oOptions.oneTimeOffCache) {
							if (!(oResultCache[sResultCacheKey] instanceof Array)) oResultCache[sResultCacheKey] = [];
							oResultCache[sResultCacheKey].push({ parent : oParent, result : aSingleQueryResult });
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
	var cssquery;
	if (document.querySelectorAll) {
		function _isNonStandardQueryButNotException(sQuery){
			return /\[\s*(?:checked|selected|disabled)/.test(sQuery)
		}
		function _commaRevise (sQuery,sChange) {
			return sQuery.replace(/\,/gi,sChange);
		}
		
		var protoSlice = Array.prototype.slice;
		
		var _toArray = function(aArray){
			return protoSlice.apply(aArray);
		}
		
		try{
			protoSlice.apply(document.documentElement.childNodes);
		}catch(e){
			_toArray = function(aArray){
				var returnArray = [];
				var leng = aArray.length;
				for ( var i = 0; i < leng; i++ ) {
					returnArray.push( aArray[i] );
				}
				return returnArray;
			}
		}
		/**
         
		 */
		cssquery = function(sQuery, oParent, oOptions){
			oParent = oParent || document ;
			try{
				if (_isNonStandardQueryButNotException(sQuery)) {
					throw Error("None Standard Query");
				}else{
					var sReviseQuery = sQuery;
					var oReviseParent = oParent;
					if (oParent.nodeType != 9) {
						if(bExtremeMode){
							if(!oParent.id) oParent.id = "p"+ new Date().getTime() + parseInt(Math.random() * 100000000,10);
						}else{
							throw Error("Parent Element has not ID.or It is not document.or None Extreme Mode.");
						}
						sReviseQuery = _commaRevise("#"+oParent.id+" "+sQuery,", #"+oParent.id);
						oReviseParent = oParent.ownerDocument||oParent.document||document;
					}
					if (oOptions&&oOptions.single) {
						return [oReviseParent.querySelector(sReviseQuery)];
					}else{
						return _toArray(oReviseParent.querySelectorAll(sReviseQuery));
					}
				}
			}catch(e){
				return old_cssquery(sQuery, oParent, oOptions);
			}
		}
	}else{
		cssquery = old_cssquery;
	}
	/**
     
	 * Specifies whether a specific element satisfies the conditions of a CSS selector.
	 * @remark A connector cannot be used in a CSS selector.
	 * @param {Element} element	An element to check
	 * @param {String} selector	The CSS selector
	 * @return {Boolean} Returns true if it satisfies the conditions of a CSS selector, false otherwise.
	 * @example

// Whether oEl is a div tag, a p tag, or an element of align=center
if (cssquery.test(oEl, 'div, p, [align=center]')) alert('satisfying the conditions');// Whether oEl is a div tag, a p tag, or an element of align=center
if (cssquery.test(oEl, 'div, p, [align=center]')) alert('satisfying the conditions');
  
	 */
	cssquery.test = function(oEl, sQuery) {

		clearKeys();
		
		var aFunc = parseTestQuery(sQuery);
		for (var i = 0, nLen = aFunc.length; i < nLen; i++){
			if (aFunc[i](oEl)) return true;
		}
			
			
		return false;
		
	};

	/**
     
	 * Specifies whether to use a result cache in cssquery.
	 * @remark If result cache is used, the existing search result is returned without performing a new search. Thus, it has advantage that developers can use it more quickly and easily without having to consider variable cache. However, it must be used only when DOM is not changeable to get a reliable result.
	 * @param {Boolean} Whether to use flag (returning the result of the decision if omitted)
	 * @return {Boolean} Whether to use a result cache.
  
	 */
	cssquery.useCache = function(bFlag) {
	
		if (typeof bFlag != 'undefined') {
			bUseResultCache = bFlag;
			cssquery.clearCache();
		}
		
		return bUseResultCache;
		
	};
	
	/**
     
	 * Uses it if you want to clear a cache due to DOM changes while a result cache is being used.
	 * @return {Void} No return value
  
	 */
	cssquery.clearCache = function() {
		oResultCache = {};
	};
	
	/**
     
	 * Gets only a single element from DOM by using a CSS selector. The return value is an object or null, not an array.
	 * @remark Searching a result will stop after getting a single element. Thus, finding a result can be processed more quickly once it ensures that only one result exists.
	 * @param {String} selector	The CSS selector
	 * @param {Document | Element} el	An element or a document to be searched (if omitted, a document object in the current document is searched)
	 * @param {Object} If onTimeOffCache is set to true in an object, the query does not use cache.
	 * @return {Element} The selected element
  
	 */
	cssquery.getSingle = function(sQuery, oParent, oOptions) {

		return cssquery(sQuery, oParent, { single : true ,oneTimeOffCache:oOptions?(!!oOptions.oneTimeOffCache):false})[0] || null;
	};
	
	
	/**
     
	 * Gets elements by using the XPath syntax.
	 * @remark It is recommended to use this method only in certain circumstances as supported syntaxes are extremely limited.
	 * @param {String} xpath	XPath
	 * @param {Document | Element} el	An element or a document to be searched (if omitted, a document object in the current document is searched)
	 * @return {Array} An array of a list of select elements
  
	 */
	cssquery.xpath = function(sXPath, oParent) {
		
		var sXPath = sXPath.replace(/\/(\w+)(\[([0-9]+)\])?/g, function(_1, sTag, _2, sTh) {
			sTh = sTh || '1';
			return '>' + sTag + ':nth-of-type(' + sTh + ')';
		});
		
		return old_cssquery(sXPath, oParent);
		
	};
	
	/**
     
	 * Provides a way to measure performance when using cssquery.
	 * @param {Function} A function to calculate cost and time used for executing a selector (if false, the debug option is disabled).
	 * @param {Number} repeat	Specifies the number of execution when you want to execute cssquery more than once.
	 * @remark The callback function must have the following format:
	 * callback : function({String}query, {Number}cost, {Number}executeTime)
	 * <dl>
	 *	<dt>query</dt>
	 *	<dd>Selector used in execution</dd>
	 *	<dt>cost</dt>
	 *	<dd>Cost incurred by search (the number of loops)</dd>
	 *	<dt>executeTime</dt>
	 *	<dd>Time elapsed for search</dd>
	 * </dl>
	 * @return {Void} No return value
	 * @example

cssquery.debug(function(sQuery, nCost, nExecuteTime) {
	if (nCost > 5000)
		console.warn('the cost is over 5000?! let's check -> ' + sQuery + '/' + nCost);
	else if (nExecuteTime > 200)
		console.warn('taking more than 0.2 seconds?! let's check -> ' + sQuery + '/' + nExecuteTime);
}, 20);

....

cssquery.debug(false);
  
	 */
	cssquery.debug = function(fpCallback, nRepeat) {
		
		debugOption.callback = fpCallback;
		debugOption.repeat = nRepeat || 1;
		
	};
	
	/**
     
	 * Makes _cssquery_UID appear when using innerHTML in Internet Explorer.
	 * If it is set to true, it makes _cssquery_UID appear in innerHTML. However, it may slow down in search performance.
	 * @param {Boolean} flag	If it is set to true, _cssquery_UID does not appear.
	 * @return {Boolean}	Returns true if _cssquery_UID does not appear.
  
	 */
	cssquery.safeHTML = function(bFlag) {
		
		var bIE = /MSIE/.test(window.navigator.userAgent);
		
		if (arguments.length > 0)
			safeHTML = bFlag && bIE;
		
		return safeHTML || !bIE;
		
	};
	
	/**
     
	 * Contains the version information of cssquery.
  
	 */
	cssquery.version = sVersion;
	
	/**
     
	 * When using validUID and cache in Internet Explorer, a memory leak will occur. Thus, it adds the module to be deleted.듈 추가.
  
	 */
	cssquery.release = function() {
		if(/MSIE/.test(window.navigator.userAgent)){
			
			delete validUID;
			validUID = {};
			
			if(bUseResultCache){
				cssquery.clearCache();
			}
		}
	};
	/**
     
	 * A function that checks whether cache can be deleted
	 * @ignore
  
	 */
	cssquery._getCacheInfo = function(){
		return {
			uidCache : validUID,
			eleCache : oResultCache 
		}
	}
	/**
     
	 * A function for testing
	 * @ignore
  
	 */
	cssquery._resetUID = function(){
		UID = 0
	}
	/**
     
	 * If extreme is executed in a browser with querySelector, the querySelector coverage increases, which is resulting in speedup.
	 * However, if elements without IDs are used as base element, IDs are randomly assigned to base elements.
	 * @param {Boolean} bExtreme true
  
	 */
	cssquery.extreme = function(bExtreme){
		if(arguments.length == 0){
			bExtreme = true;
		}
		bExtremeMode = bExtreme;
	}

	return cssquery;
	
})();

