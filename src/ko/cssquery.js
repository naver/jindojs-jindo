/**
 
 * @fileOverview CSS 셀렉터를 사용한 엘리먼트 선택 엔진
 * @name cssquery.js
 * @author Hooriza
  
 */

/**
 
 * @class
 * @description $$() 함수(cssquery)는 CSS 선택자(CSS Selector)를 사용하여 객체를 탐색한다. $$() 함수 대신 cssquery() 함수를 사용해도 된다. CSS 선택자로 사용할 수 있는 패턴은 표준 패턴과 비표준 패턴이 있다. 표준 패턴은 CSS Level3 명세서에 있는 패턴을 지원한다. 선택자의 패턴에 대한 설명은 다음 표와 See Also 항목을 참고한다.<br>
<table>
	<caption>요소, ID, 클래스 선택자</caption>
	<thead>
		<tr>
			<th scope="col">패턴</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>*</td>
			<td>모든 요소.
				<textarea name="code" class="js:nocontrols">
				$$("*");
				// 문서의 모든 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>HTML Tagname</td>
			<td>지정된 HTML 태그 요소.
				<textarea name="code" class="js:nocontrols">
				$$("div");
				// 문서의 모든 &lt;div&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>#id</td>
			<td>ID가 지정된 요소.
				<textarea name="code" class="js:nocontrols">
				$$("#application")
				// ID가 application인 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>.classname</td>
			<td>클래스가 지정된 요소.
				<textarea name="code" class="js:nocontrols">
				$$(".img");
				// 클래스가 img인 요소.
				</textarea>
			</td>
		</tr>
	</tbody>
</table>

<table>
	<caption>속성 선택자</caption>
	<thead>
		<tr>
			<th scope="col">패턴</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>[type]</td>
			<td>지정된 속성을 갖고 있는 요소.
				<textarea name="code" class="js:nocontrols">
				$$("input[type]");
				// type 속성을 갖는 &lt;input&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>[type=value]</td>
			<td>속성과 값이 일치하는 요소.
				<textarea name="code" class="js:nocontrols">
				$$("input[type=text]");
				// type 속성 값이 text인 &lt;input&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>[type^=value]</td>
			<td>속성의 값이 특정 값으로 시작하는 요소.
				<textarea name="code" class="js:nocontrols">
				$$("input[type^=hid]");
				//type 속성 값이 hid로 시작하는 &lt;input&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>[type$=value]</td>
			<td>속성의 값이 특정 값으로 끝나는 요소.
				<textarea name="code" class="js:nocontrols">
				$$("input[type$=en]");
				//type 속성 값이 en으로 끝나는 &lt;input&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>[type~=value]</td>
			<td>속성 값에 공백으로 구분된 여러 개의 값이 존재하는 경우, 각각의 값 중 한가지 값을 갖는 요소.
				<textarea name="code" class="js:nocontrols">
				&lt;img src="..." alt="welcome to naver"&gt;
				$$("img[alt~=welcome]");  // 있음.
				$$("img[alt~=naver]");  // 있음.
				$$("img[alt~=wel]");  // 없음.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>[type*=value]</td>
			<td>속성 값 중에 일치하는 값이 있는 요소.
				<textarea name="code" class="js:nocontrols">
				$$("img[alt*=come]");  // 있음.
				$$("img[alt*=nav]");  // 있음.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>[type!=value]</td>
			<td>값이 지정된 값과 일치하지 않는 요소.
				<textarea name="code" class="js:nocontrols">
				$$("input[type!=text]");
				// type 속성 값이 text가 아닌 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>[@type]</td>
			<td>cssquery 전용으로 사용하는 선택자로서 요소의 속성이 아닌 요소의 스타일 속성을 사용한다. CSS 속성 선택자의 특성을 모두 적용해 사용할 수 있다.
				<textarea name="code" class="js:nocontrols">
				$$("div[@display=block]");
				// &lt;div&gt; 요소 중에 display 스타일 속성의 값이 block인 요소.
				</textarea>
			</td>
		</tr>
	</tbody>
</table>

<table>
	<caption>가상 클래스 선택자</caption>
	<thead>
		<tr>
			<th scope="col">패턴</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>:nth-child(n)</td>
			<td>n번째 자식인지 여부로 해당 요소를 선택한다.
				<textarea name="code" class="js:nocontrols">
				$$("div:nth-child(2)");
				// 두 번째 자식 요소인 &lt;div&gt; 요소.
				
				$$("div:nth-child(2n)");
				$$("div:nth-child(even)");
				// 짝수 번째 자식 요소인 모든 &lt;div&gt; 요소.
				
				$$("div:nth-child(2n+1)");
				$$("div:nth-child(odd)");
				// 홀수 번째 자식 요소인 모든 &lt;div&gt; 요소.
				
				$$("div:nth-child(4n)");
				// 4의 배수 번째 자식 요소인 모든 &lt;div&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>:nth-last-child(n)</td>
			<td>nth-child와 동일하나, 뒤에서부터 요소를 선택한다.
				<textarea name="code" class="js:nocontrols">
				$$("div:nth-last-child(2)");
				// 뒤에서 두 번째 자식 요소인 모든 &lt;div&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>:last-child</td>
			<td>마지막 자식인지 여부로 요소를 선택한다.
				<textarea name="code" class="js:nocontrols">
				$$("div:last-child");
				// 마지막 자식 요소인 모든 &lt;div&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>:nth-of-type(n)</td>
			<td>n번째로 발견된 요소를 선택한다.
				<textarea name="code" class="js:nocontrols">
				&lt;div&gt;
					&lt;p&gt;1&lt;/p&gt;
					&lt;span&gt;2&lt;/span&gt;
					&lt;span&gt;3&lt;/span&gt;
				&lt;/div&gt;
				</textarea>
				위와 같은 DOM이 있을 때, $$("span:nth-child(1)")은 &lt;span&gt; 요소가 firstChild인 요소는 없기 때문에 결과 값을 반환하지 않는다 하지만 $$("span:nth-of-type(1)")는 &lt;span&gt; 요소 중에서 첫 번째 &lt;span&gt; 요소인 &lt;span&gt;2&lt;/span&gt;를 얻어오게 된다.<br>nth-child와 마찬가지로 짝수/홀수 등의 수식을 사용할 수 있다.
			</td>
		</tr>
		<tr>
			<td>:first-of-type</td>
			<td>같은 태그 이름을 갖는 형제 요소 중에서 첫 번째 요소를 선택한다.<br>nth-of-type(1)과 같은 결과 값을 반환한다.</td>
		</tr>
		<tr>
			<td>:nth-last-of-type</td>
			<td>nth-of-type과 동일하나, 뒤에서부터 요소를 선택한다.</td>
		</tr>
		<tr>
			<td>:last-of-type</td>
			<td>같은 태그 이름을 갖는 형제 요소 중에서 마지막 요소를 선택한다.<br>nth-last-of-type(1)과 같은 결과 값을 반환한다.</td>
		</tr>
		<tr>
			<td>:contains</td>
			<td>텍스트 노드에 특정 문자열을 포함하고 있는지 여부로 해당 요소를 선택한다.
				<textarea name="code" class="js:nocontrols">
				$$("span:contains(Jindo)");
				// "Jindo" 문자열를 포함하고 있는 &lt;span&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>:only-child</td>
			<td>형제가 없는 요소를 선택한다.
				<textarea name="code" class="js:nocontrols">
				&lt;div&gt;
					&lt;p&gt;1&lt;/p&gt;
					&lt;span&gt;2&lt;/span&gt;
					&lt;span&gt;3&lt;/span&gt;
				&lt;/div&gt;
				</textarea>
				위의 DOM에서 $$("div:only-child")만 반환 값이 있고, $$("p:only-child") 또는 $$("span:only-child")는 반환 값이 없다. 즉, 형제 노드가 없는 &lt;div&gt; 요소만 선택된다.
			</td>
		</tr>
		<tr>
			<td>:empty</td>
			<td>비어있는 요소를 선택한다.
				<textarea name="code" class="js:nocontrols">
				$$("span:empty");
				// 텍스트 노드 또는 하위 노드가 없는 &lt;span&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>:not</td>
			<td>선택자의 조건과 반대인 요소를 선택한다.
				<textarea name="code" class="js:nocontrols">
				$$("div:not(.img)");
				// img 클래스가 없는 &lt;div&gt; 요소.
				</textarea>
			</td>
		</tr>
	</tbody>
</table>

<table>
	<caption>콤비네이터 선택자</caption>
	<thead>
		<tr>
			<th scope="col">패턴</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>공백 (space)</td>
			<td>하위의 모든 요소를 의미한다.
				<textarea name="code" class="js:nocontrols">
				$$("body div");
				// &lt;body&gt; 요소 하위에 속한 모든 &lt;div&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>&gt;</td>
			<td>자식 노드에 속하는 모든 요소를 의미한다.
				<textarea name="code" class="js:nocontrols">
				$$("div &gt; span");
				// &lt;div&gt; 요소의 자식 요소 중 모든 &lt;span&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>+</td>
			<td>지정한 요소의 바로 다음 형제 노드에 속하는 모든 요소를 의미한다.
				<textarea name="code" class="js:nocontrols">
				$$("div + p");
				// &lt;div&gt; 요소의 nextSibling에 해당하는 모든 &lt;p&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>~</td>
			<td>+ 패턴과 동일하나, 바로 다음 형제 노드뿐만 아니라 지정된 노드 이후에 속하는 모든 요소를 의미한다.
				<textarea name="code" class="js:nocontrols">
				$$("div ~ p");
				// &lt;div&gt; 요소 이후의 형제 노드에 속하는 모든 &lt;p&gt; 요소.
				</textarea>
			</td>
		</tr>
		<tr>
			<td>!</td>
			<td>cssquery 전용으로, 콤비네이터의 반대 방향으로 탐색을 시작해 요소를 검색한다.
				<textarea name="code" class="js:nocontrols">
				$$("span ! div");
				// &lt;span&gt; 요소의 상위에 있는 모든 &lt;div&gt; 요소.
				</textarea>
			</td>
		</tr>
	</tbody>
</table>
 * @param {String} sSelector CSS 선택자. CSS 선택자로 사용할 수 있는 패턴은 표준 패턴과 비표준 패턴이 있다. 표준 패턴은 CSS Level3 명세서에 있는 패턴을 지원한다.
 * @param {Element} [elBaseElement] 탐색 대상이 되는 DOM 요소. 지정한 요소의 하위 노드에서만 객체를 탐색한다. 생략될 경우 문서를 대상으로 찾는다. 
 * @return {Array} 조건에 해당하는 요소를 배열 형태로 반환한다.
 * @see $Document#queryAll
 * @see <a href="http://www.w3.org/TR/css3-selectors/">CSS Level3 명세서</a> - W3C
 * @example
 // 문서에서 IMG 태그를 찾는다.
 var imgs = $$('IMG');

 // div 요소 하위에서 IMG 태그를 찾는다.
 var imgsInDiv = $$('IMG', $('div'));

 // 문서에서 IMG 태그 중 가장 첫 요소를 찾는다.
 var firstImg = $$.getSingle('IMG');
  
 */
jindo.$$ = jindo.cssquery = (function() {
	/*
	 
querySelector 설정.
  
	 */
	var sVersion = '3.0';
	
	var debugOption = { repeat : 1 };
	
	/*
	 
빠른 처리를 위해 노드마다 유일키 값 셋팅
  
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
	 
따옴표, [] 등 파싱에 문제가 될 수 있는 부분 replace 시켜놓기
  
	 */
	var backupKeys = function(sQuery) {
		
		var oKeys = backupKeys._keys;
		
		/*
		 
작은 따옴표 걷어내기
  
		 */
		sQuery = sQuery.replace(/'(\\'|[^'])*'/g, function(sAll) {
			var uid = uniqid('QUOT');
			oKeys[uid] = sAll;
			return uid;
		});
		
		/*
		 
큰 따옴표 걷어내기
  
		 */
		sQuery = sQuery.replace(/"(\\"|[^"])*"/g, function(sAll) {
			var uid = uniqid('QUOT');
			oKeys[uid] = sAll;
			return uid;
		});
		
		/*
		 
[ ] 형태 걷어내기
  
		 */
		sQuery = sQuery.replace(/\[(.*?)\]/g, function(sAll, sBody) {
			if (sBody.indexOf('ATTR') == 0) return sAll;
			var uid = '[' + uniqid('ATTR') + ']';
			oKeys[uid] = sAll;
			return uid;
		});
	
		/*
		
( ) 형태 걷어내기
  
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
	 
replace 시켜놓은 부분 복구하기
  
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
		
( ) 는 한꺼풀만 벗겨내기
  
		 */
		sQuery = sQuery.replace(/_BRCE[0-9]+/g, function(sKey) {
			return oKeys[sKey] ? oKeys[sKey] : sKey;
		});
		
		return sQuery;
		
	};
	
	/*
	 
replace 시켜놓은 문자열에서 Quot 을 제외하고 리턴
  
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
		 
노드 인덱스를 구할 수 없으면
  
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
	 
몇번째 자식인지 설정하는 부분
  
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
	 
가상 클래스
  
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
	 
단일 part 의 body 에서 expression 뽑아냄
  
	 */
	var getExpression = function(sBody) {

		var oRet = { defines : '', returns : 'true' };
		
		var sBody = restoreKeys(sBody, true);
	
		var aExprs = [];
		var aDefineCode = [], aReturnCode = [];
		var sId, sTagName;
		
		/*
		 
유사클래스 조건 얻어내기
  
		 */
		var sBody = sBody.replace(/:([\w-]+)(\(([^)]*)\))?/g, function(_1, sType, _2, sOption) {
			
			switch (sType) {
			case 'not':
                /*
                 
괄호 안에 있는거 재귀파싱하기
  
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
		 
[key=value] 형태 조건 얻어내기
  
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
		 
클래스 조건 얻어내기
  
		 */
		var sBody = sBody.replace(/\.([\w-]+)/g, function(_, sClass) { 
			aExprs.push({ key : 'class', op : '~=', val : sClass });
			if (!sClassName) sClassName = sClass;
			return '';
		});
		
		/*
		 
id 조건 얻어내기
  
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
		 
match 함수 코드 만들어 내기
  
		 */
		var oVars = {};
		
		for (var i = 0, oExpr; oExpr = aExprs[i]; i++) {
			
			var sKey = oExpr.key;
			
			if (!oVars[sKey]) aDefineCode.push(getDefineCode(sKey));
            /*
             
유사클래스 조건 검사가 맨 뒤로 가도록 unshift 사용
  
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
	 
쿼리를 연산자 기준으로 잘라냄
  
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
	 
잘라낸 part 를 함수로 컴파일 하기
  
	 */
	var compileParts = function(aParts) {
		
		var aPartExprs = [];
		
		/*
		 
잘라낸 부분들 조건 만들기
  
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
	 
쿼리를 match 함수로 변환
  
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
	 
test 쿼리를 match 함수로 변환
  
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
				 
ownerDocument 잡아주기
  
				 */
				oDocument_dontShrink = oParent.ownerDocument || oParent.document || oParent;
				
				/*
				 
브라우저 버젼이 IE5.5 이하
  
				 */
				if (/\bMSIE\s([0-9]+(\.[0-9]+)*);/.test(navigator.userAgent) && parseFloat(RegExp.$1) < 6) {
					try { oDocument_dontShrink.location; } catch(e) { oDocument_dontShrink = document; }
					
					oDocument_dontShrink.firstChild = oDocument_dontShrink.getElementsByTagName('html')[0];
					oDocument_dontShrink.firstChild._IE5_parentNode = oDocument_dontShrink;
				}
				
				/*
				 
XMLDocument 인지 체크
  
				 */
				bXMLDocument = (typeof XMLDocument != 'undefined') ? (oDocument_dontShrink.constructor === XMLDocument) : (!oDocument_dontShrink.location);
				getUID = bXMLDocument ? getUID4XML : getUID4HTML;
		
				clearKeys();
				
				/*
				 
쿼리를 쉼표로 나누기
  
				 */
				var aSplitQuery = backupKeys(sQuery).split(/\s*,\s*/);
				var aResult = [];
				
				var nLen = aSplitQuery.length;
				
				for (var i = 0; i < nLen; i++)
					aSplitQuery[i] = restoreKeys(aSplitQuery[i]);
				
				/*
				 
쉼표로 나눠진 쿼리 루프
  
				 */
				for (var i = 0; i < nLen; i++) {
					
					var sSingleQuery = aSplitQuery[i];
					var aSingleQueryResult = null;
					
					var sResultCacheKey = sSingleQuery + (oOptions.single ? '_single' : '');
		
					/*
					 
결과 캐쉬 뒤짐
  
					 */
					var aCache = bUseResultCache ? oResultCache[sResultCacheKey] : null;
					if (aCache) {
						
						/*
						 
캐싱되어 있는게 있으면 parent 가 같은건지 검사한후 aSingleQueryResult 에 대입
  
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
					     
결과 캐쉬를 사용중이면 캐쉬에 저장
  
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
     
 * @function
 * @name $$.test
 * @description test() 메서드는 특정 요소가 해당 CSS 선택자(CSS Selector)에 부합하는 요소인지 판단하여 Boolean 형태로 반환한다. CSS 선택자에 연결자는 사용할 수 없음에 유의한다. 선택자의 패턴에 대한 설명은 $$() 함수와 See Also 항목을 참고한다.
 * @param {Element} element	검사하고자 하는 요소
 * @param {String} sCSSSelector	CSS 선택자. CSS 선택자로 사용할 수 있는 패턴은 표준 패턴과 비표준 패턴이 있다. 표준 패턴은 CSS Level3 명세서에 있는 패턴을 지원한다.
 * @return {Boolean} 조건에 부합하면 true, 부합하지 않으면 false를 반환한다.
 * @see $$
 * @see <a href="http://www.w3.org/TR/css3-selectors/">CSS Level3 명세서</a> - W3C
 * @example
// oEl 이 div 태그 또는 p 태그, 또는 align 속성이 center로 지정된 요소인지 검사한다.
if (cssquery.test(oEl, 'div, p, [align=center]'))
alert('해당 조건 만족');
  
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
     
 * @function
 * @name $$.useCache
 * @description useCache() 메서드는 $$() 함수(cssquery)를 사용할 때 캐시를 사용할 것인지 설정한다. 캐시를 사용하면 동일한 선택자로 탐색하는 경우 탐색하지 않고 기존 탐색 결과를 반환한다. 따라서 사용자가 변수 캐시를 신경쓰지 않고 편하고 빠르게 사용할 수 있는 장점이 있지만 신뢰성을 위해 DOM 구조가 동적으로 변하지 않을 때만 사용해야 한다.
 * @param {Boolean} [bFlag] 캐시 사용 여부를 지정한다. 이 파라미터를 생략하면 캐시 사용 상태만 반환한다.
 * @return {Boolean} 캐시 사용 상태를 반환한다.
 * @see <a href="#.$$.clearCache">$$.clearCache</a>
  
	 */
	cssquery.useCache = function(bFlag) {
	
		if (typeof bFlag != 'undefined') {
			bUseResultCache = bFlag;
			cssquery.clearCache();
		}
		
		return bUseResultCache;
		
	};
	
	/**
     
 * @function
 * @name $$.clearCache
 * @description clearCache() 메서드는 $$() 함수(cssquery)에서 캐시를 사용할 때 캐시를 비울 때 사용한다. DOM 구조가 동적으로 바껴 기존의 캐시 데이터가 신뢰성이 없을 때 사용한다.
 * @return {void}
 * @see <a href="#.$$.useCache">$$.useCache</a>
  
	 */
	cssquery.clearCache = function() {
		oResultCache = {};
	};
	
	/**
     
 * @function
 * @name $$.getSingle
 * @description getSingle() 메서드는 CSS 선택자를 사용에서 조건을 만족하는 첫 번째 요소를 가져온다. 반환하는 값은 배열이 아닌 객채 또는 null이다. 조건을 만족하는 요소를 찾으면 바로 탐색 작업을 중단하기 때문에 결과가 하나라는 보장이 있을 때 빠른 속도로 결과를 가져올 수 있다.
 $$() 함수(cssquery)에서 캐시를 사용할 때 캐시를 비울 때 사용한다. DOM 구조가 동적으로 바껴 기존의 캐시 데이터가 신뢰성이 없을 때 사용한다.
 * @param {String} sSelector CSS 선택자(CSS Selector). CSS 선택자로 사용할 수 있는 패턴은 표준 패턴과 비표준 패턴이 있다. 표준 패턴은 CSS3 Level3 명세서에 있는 패턴을 지원한다. 선택자의 패턴에 대한 설명은 $$() 함수와 See Also 항목을 참고한다.
 * @param {Element} [oBaseElement] 탐색 대상이 되는 DOM 요소. 지정한 요소의 하위 노드에서만 객체를 탐색한다. 생략될 경우 문서를 대상으로 찾는다. 
 * @param {Object} [oOption] 옵션 객체에 onTimeOffCache 속성을 true로 설정하면 탐색할 때 캐시를 사용하지 않는다.
 * @return {Element} 선택된 요소. 결과가 없으면 null을 반환한다.
 * @see $Document#query	 
 * @see <a href="#.$$.useCache">$$.useCache</a>
 * @see $$
 * @see <a href="http://www.w3.org/TR/css3-selectors/">CSS Level3 명세서</a> - W3C
  
	 */
	cssquery.getSingle = function(sQuery, oParent, oOptions) {

		return cssquery(sQuery, oParent, { single : true ,oneTimeOffCache:oOptions?(!!oOptions.oneTimeOffCache):false})[0] || null;
	};
	
	
	/**
     
 * @function
 * @name $$.xpath
 * @description xpath() 메서드는 XPath 문법을 만족하는 요소를 가져온다. 지원하는 문법이 제한적이므로 특수한 경우에만 사용할 것을 권장한다.
 * @param {String} sXPath XPath 값.
 * @param {Element} [elBaseElement] 탐색 대상이 되는 DOM 요소. 지정한 요소의 하위 노드에서만 객체를 탐색한다. 생략될 경우 문서를 대상으로 찾는다. 
 * @return {Array} XPath 문법을 만족하는 요소를 원소로 하는 배열. 결과가 없으면 null을 반환한다.
 * @see $Document#xpathAll
 * @see <a href="http://www.w3.org/standards/techs/xpath#w3c_all">XPath 문서</a> - W3C
  
	 */
	cssquery.xpath = function(sXPath, oParent) {
		
		var sXPath = sXPath.replace(/\/(\w+)(\[([0-9]+)\])?/g, function(_1, sTag, _2, sTh) {
			sTh = sTh || '1';
			return '>' + sTag + ':nth-of-type(' + sTh + ')';
		});
		
		return old_cssquery(sXPath, oParent);
		
	};
	
	/**
     
 * @function
 * @name $$.debug
 * @description debug() 메서드는 $$() 함수(cssquery)를 사용할 때 성능을 측정하기 위한 기능을 제공하는 함수이다. 파라미터로 입력한 콜백 함수를 사용하여 성능을 측정한다.
 * @param {Function} fCallback 선택자 실행에 소요된 비용과 시간을 점검하는 함수. 이 파라미터에 함수 대신 false를 입력하면 성능 측정 모드(debug)를 사용하지 않는다. 이 콜백 함수는 파라미터로 query, cost, executeTime을 갖는다.<br>
 <ul>
	<li>query는 실행에 사용된 선택자이다.</li>
	<li>index는 탐색에 사용된 비용이다(루프 횟수).</li>
	<li>executeTime 탐색에 소요된 시간이다.</li>
 * @param {Number} [nRepeat] 하나의 선택자를 반복 수행할 횟수. 인위적으로 실행 속도를 늦추기 위해 사용할 수 있다.
 * @return {Void}
 * @example
cssquery.debug(function(sQuery, nCost, nExecuteTime) {
	if (nCost > 5000)
		console.warn('5000이 넘는 비용이? 확인 -> ' + sQuery + '/' + nCost);
	else if (nExecuteTime > 200)
		console.warn('0.2초가 넘게 실행을? 확인 -> ' + sQuery + '/' + nExecuteTime);
}, 20);

....

cssquery.debug(false);
  
	 */
	cssquery.debug = function(fpCallback, nRepeat) {
		
		debugOption.callback = fpCallback;
		debugOption.repeat = nRepeat || 1;
		
	};
	
	/**
     
 * @function
 * @name $$.safeHTML
 * @description safeHTML() 메서드는 인터넷 익스플로러에서 innerHTML 속성을 사용할 때 _cssquery_UID 값이 나오지 않게 하는 함수이다. true로 설정하면 탐색하는 노드의 innerHTML 속성에 _cssquery_UID가 나오지 않게 할 수 있지만 탐색 속도는 느려질 수 있다.
 * @param {Boolean} bFlag _cssquery_UID의 표시 여부를 지정한다. true로 설정하면 _cssquery_UID가 나오지 않는다.
 * @return {Boolean} _cssquery_UID 표시 여부 상태를 반환한다. _cssquery_UID를 표시하는 상태이면 true를 반환하고 그렇지 않으면 false를 반환한다.
  
	 */
	cssquery.safeHTML = function(bFlag) {
		
		var bIE = /MSIE/.test(window.navigator.userAgent);
		
		if (arguments.length > 0)
			safeHTML = bFlag && bIE;
		
		return safeHTML || !bIE;
		
	};
	
	/**
     
 * @field
 * @name $$.version
 * @description version 속성은 cssquery의 버전 정보를 담고 있는 문자열이다.
  
	 */
	cssquery.version = sVersion;
	
	/**
     
	 * IE에서 validUID,cache를 사용했을때 메모리 닉이 발생하여 삭제하는 모듈 추가.
  
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
     
	 * cache가 삭제가 되는지 확인하기 위해 필요한 함수
	 * @ignore
  
	 */
	cssquery._getCacheInfo = function(){
		return {
			uidCache : validUID,
			eleCache : oResultCache 
		}
	}
	/**
     
	 * 테스트를 위해 필요한 함수
	 * @ignore
  
	 */
	cssquery._resetUID = function(){
		UID = 0
	}
	/**
     
	 * querySelector가 있는 브라우져에서 extreme을 실행시키면 querySelector을 사용할수 있는 커버리지가 높아져 전체적으로 속도가 빨리진다.
	 * 하지만 ID가 없는 엘리먼트를 기준 엘리먼트로 넣었을 때 기준 엘리먼트에 임의의 아이디가 들어간다.
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

