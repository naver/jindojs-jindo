//-!jindo.cssquery start!-//
/**
 {{title}}
 */

/**
 {{constructor}}
 */
jindo.$$ = jindo.cssquery = (function() {
	var bExtremeMode = true;
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
         {{cssquery_desc}}
		 */
		cssquery = function(sQuery, oParent, oOptions){
			_inject_('ca1');
			oParent = oParent || document ;
			try{
				if (_isNonStandardQueryButNotException(sQuery)) {
					throw Error(sQuery+"는 모바일에서 지원하지 않는 selector입니다. 다른 방법을 이용하시거나 일반 cssquery을 이용하세요.");
				}else{
					var sReviseQuery = sQuery;
					var oReviseParent = oParent;
					if (oParent.nodeType != 9) {
						if(bExtremeMode){
							if(!oParent.id) oParent.id = "p"+ new Date().getTime() + parseInt(Math.random() * 100000000,10);
						}else{
							throw Error("Extreme Mode가 아닌 경우는 일반 cssquery을 이용하세요.");
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
				throw Error(sQuery+"는 모바일에서 지원하지 않는 selector입니다.");
			}
		}
	}else{
		throw Error("해당 브라우져에서는 모바일 cssquery가 아닌 일반 cssquery을 사용하시길 바랍니다");
	}
	/**
     {{test}}
	 */
	cssquery.test = function(oEl, sQuery) {
		throw Error("모바일 cssquery 아직 test함수를 지원하지 않습니다.");
	};

	/**
     {{userCache}}
	 */
	cssquery.useCache = function(bFlag) {
	};
	
	/**
     {{clearCache}}
	 */
	cssquery.clearCache = function() {
	};
	cssquery.release = function() {
	};
	
	/**
     {{getSingle}}
	 */
	cssquery.getSingle = function(sQuery, oParent, oOptions) {
		return cssquery(sQuery, oParent, { single : true ,oneTimeOffCache:oOptions?(!!oOptions.oneTimeOffCache):false})[0] || null;
	};
	
	/**
     {{extreme}}
	 */
	cssquery.extreme = function(bExtreme){
		if(arguments.length == 0){
			bExtreme = true;
		}
		bExtremeMode = bExtreme;
	}

	return cssquery;
	
})();
//-!jindo.cssquery end!-//
