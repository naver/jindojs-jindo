//////////////////////////////////////////////////////////////////////////////// 
// 
// NHN CORPORATION
// Copyright 2002-2010 NHN Coporation 
// All Rights Reserved. 
// 
// 이 문서는 NHN㈜의 지적 자산이므로 NHN(주)의 승인 없이 이 문서를 다른 용도로 임의 
// 변경하여 사용할 수 없습니다. 
// 
// 파일명 : flashObject.js 
// 
// 작성일 : 2009.02.02 
// 
// 최종 수정일: 2010.09.08
// 
// Version : 1.2.2
// 
////////////////////////////////////////////////////////////////////////////////

/**
 * @author seungkil choi / kgoon@nhncorp.com
 */

 if (typeof nhn == 'undefined') nhn = {};
 
 nhn.FlashObject = (function(){
 	
	var FlashObject = {};
 	
	//-------------------------------------------------------------
	// private properties
	//-------------------------------------------------------------
	var sClassPrefix = 'F' + new Date().getTime() + parseInt(Math.random() * 1000000);
	var bIE = /MSIE/i.test(navigator.userAgent);
	var bFF = /FireFox/i.test(navigator.userAgent);
	var bChrome = /Chrome/i.test(navigator.userAgent);
	var sReservedName = " className style __flashID codebase classid class width height name src align id type object embed movie forwardInstall requireVersion ";
		
	var bWin = (navigator.platform.toLowerCase().indexOf("win") != -1) ? true : false;
	var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;
	

    /**
     *  ActiveX 방식의 플레이어에서 사용하는 버전 디텍션 코드
     *	AC_OETag.js 에서 가져온 함수에서 일부 수정
     *  @param reqMajorVer 이벤트 등록 객체.
	 *
     *  @return Object (major, minor, revision)
     */	
	var controlVersion = function(reqMajorVer)
	{
		var version, axo, e;
		
		if(reqMajorVer == null)
			reqMajorVer = 25;
		
		try
		{
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			version = axo.GetVariable("$version");		

			if(version)
				return versionToObject(version);
		}
		catch(e){}
		
		for(var i = reqMajorVer; i > 0; i--)
		{
			try 
			{
				axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);			
				version = axo.GetVariable("$version");
			} catch (e) {
				continue;
			}	
			
			if(version)
				return versionToObject(version);
		}
		
		return -1;
	}
	
	/**
	 * 	버전을 나타내는 문자열을 Object로 변환해주는 함수
	 * 
	 */
	var versionToObject = function(sVersion)
	{
		var versionArray = sVersion.split(" ")[1].split(",");
		return {major:versionArray[0], minor:versionArray[1], revision:versionArray[2]};
	}
	
	/**
	 * 	플레이어 버전을 디텍팅하는 메인 함수 (Plug-in 방식을 먼저 찾고 없으면 IE 방식 사용
	 * 	AC_OETag.js에서 사용된 코드 사용
	 */
	// JavaScript helper required to detect Flash Player PlugIn version information
	var getSwfVer = function(reqMajorVer)
	{
		// NS/Opera version >= 3 check for Flash plugin in plugin array
		var flashVer = -1;
		
		if (navigator.plugins != null && navigator.plugins.length > 0) {
			if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
				var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
				var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
				var descArray = flashDescription.split(" ");
				var tempArrayMajor = descArray[2].split(".");			
				var versionMajor = tempArrayMajor[0];
				var versionMinor = tempArrayMajor[1];
				var versionRevision = descArray[3];
				if (versionRevision == "") {
					versionRevision = descArray[4];
				}
				if (versionRevision[0] == "d") {
					versionRevision = versionRevision.substring(1);
				} else if (versionRevision[0] == "r") {
					versionRevision = versionRevision.substring(1);
					if (versionRevision.indexOf("d") > 0) {
						versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
					}
				}
				
				flashVer = {major:versionMajor, minor:versionMinor, revision:versionRevision};
			}
		}
		// MSN/WebTV 2.6 supports Flash 4
		else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
		// WebTV 2.5 supports Flash 3
		else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
		// older WebTV supports Flash 2
		else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
		else if ( bIE && bWin && !isOpera ) {
			flashVer = controlVersion(reqMajorVer);
		}	
		return flashVer;
	}
	
	/**
	 * require 버전과 비교해서 적합한지 여부를 반환해주는 함수
	 * 
	 */
	// When called with reqMajorVer, reqMinorVer, reqRevision returns true if that version or greater is available
	FlashObject.detectFlashVer = function(reqMajorVer, reqMinorVer, reqRevision)
	{
		var returnValue;
		
		version = getSwfVer(reqMajorVer);
		if (version == -1 ) {
			returnValue = -1;
		} else if (version != 0) {
			
			returnValue = 0;
        	// is the major.revision >= requested major.revision AND the minor version >= requested minor
			if (version.major > parseFloat(reqMajorVer)) {
				returnValue = 1;
			} else if (version.major == parseFloat(reqMajorVer)) {
				if (version.minor > parseFloat(reqMinorVer))
					returnValue = 1;
				else if (version.minor == parseFloat(reqMinorVer)) {
					if (version.revision >= parseFloat(reqRevision))
						returnValue = 1;
				}
			}
		}
		
		return returnValue;
	}

	var dafaultInstall = function()
	{
		// do nothing
	}
	
	
    /**
     *  이벤트 등록 함수
     *
     *  @param oElement 이벤트 등록 객체.
     *  @param sEvent	등록할 이벤트 Type
     *  @param fHandler	이벤트 핸들러
     *  @return void
     */
	var bind = function(oElement, sEvent, fHandler) 
	{
		
		if (typeof oElement.attachEvent != 'undefined')
			oElement.attachEvent('on' + sEvent, fHandler);
		else
			oElement.addEventListener(sEvent, fHandler, true);
		
	};
	
	
	var objectToString = function(oObj, sSeparator)
	{
		
		var s = "";
		var first = true;
		var name = "";
		var value;

		for (var p in oObj)
		{
			if (first)
				first = false;
			else
				s += sSeparator;

			value = oObj[p];
			
			switch (typeof(value)) {
				case "string":
					s += p + '=' + encodeURIComponent(value);
					break;

				case "number":
					s += p + '=' + encodeURIComponent(value.toString());
					break;

				case "boolean":
					s += p + '=' + (value ? "true" : "false");
					break;

				default:
					// array 이거나 object 일때 변환하지 않는다.
			}
		}

		return s;
	}

    /**
     *  플래시 ExternalInterface 버그 패치
     *  for 'Out of memory line at 56' error
     *
     *  @return void
     */
	var unloadHandler = function() {
		
		obj = document.getElementsByTagName('OBJECT');

		for (var i = 0, theObj; theObj = obj[i]; i++) {

			theObj.style.display = 'none';

			for (var prop in theObj)
				if (typeof(theObj[prop]) == 'function')
					try 
					{ 
						if(theObj.hasOwnProperty(prop))
							theObj[prop] = null;
					} 
					catch(e) {}

		}
		
	};
	
    /**
     *  휠마우스 이벤트 처리 함수
     *  이벤트가 발생한 객체가 플래시인 경우 
     *  delta 값과 마우스 좌표를 플래시에 전달 
     *
     *  @param e		이벤트 객체
     *  @return void
     */
	var wheelHandler = function(e) {
		
		e = e || window.event;
		
		var nDelta = e.wheelDelta / (bChrome ? 360 : 120);
		if (!nDelta) nDelta = -e.detail / 3;
		
		var oEl = e.target || e.srcElement;
		
		// 휠 이벤트가 발생한 오브젝트가 FlashObject가 생산한 플래시가 아니면 중지
		if (!(new RegExp('(^|\b)' + sClassPrefix + '_([a-z0-9_$]+)(\b|$)', 'i').test(oEl.className))) return;
		
		var sMethod = RegExp.$2;

		var nX = 'layerX' in e ? e.layerX : e.offsetX;
		var nY = 'layerY' in e ? e.layerY : e.offsetY;
		
		try {
			
			if (!oEl[sMethod](nDelta, nX, nY)) {

				if (e.preventDefault) e.preventDefault();
				else e.returnValue = false;

			}
			
		} catch(err) {
			// 등록한 핸들러가 없는 경우 
		}
		
	};	

	/**
	 * 넘겨받은 오브젝트의 절대 좌표를 구해주는 함수
	 * 
	 * @param {Object} oEl	오브젝트 참조
	 */
	var getAbsoluteXY = function(oEl) {
		
		var oPhantom = null;
	
		// getter
		var bSafari = /Safari/.test(navigator.userAgent);
		var bIE = /MSIE/.test(navigator.userAgent);
	
		var fpSafari = function(oEl) {
	
			var oPos = { left : 0, top : 0 };
	
			// obj.offsetParent is null in safari, because obj.parentNode is '<object>'.
			if (oEl.parentNode.tagName.toLowerCase() == "object") {
				oEl = oEl.parentNode;
			}
	
			for (var oParent = oEl, oOffsetParent = oParent.offsetParent; oParent = oParent.parentNode; ) {
	
				if (oParent.offsetParent) {
					oPos.left -= oParent.scrollLeft;
					oPos.top -= oParent.scrollTop;
				}
	
				if (oParent == oOffsetParent) {
					oPos.left += oEl.offsetLeft + oParent.clientLeft;
					oPos.top += oEl.offsetTop + oParent.clientTop ;
	
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
	
		var fpOthers = function(oEl) {
	
			var oPos = { left : 0, top : 0 };
	
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
	
			return oPos;
	
		};
	
		return (bSafari ? fpSafari : fpOthers)(oEl);
	}
	
	/**
	 * 현재 스크롤 위치를 알려주는 함수
	 * 
	 */
	var getScroll = function() {
		var bIE = /MSIE/.test(navigator.userAgent);
		
		if (bIE) {
			var sX = document.documentElement.scrollLeft || document.body.scrollLeft;
			var sY = document.documentElement.scrollTop || document.body.scrollTop;
			return {scrollX:sX, scrollY:sY}
		}
		else {
			return {scrollX:window.pageXOffset, scrollY:window.pageYOffset};
		}
	}
	
	/**
	 * 현재 스크린 사이즈를 알려주는 함수
	 * 
	 */
	var getInnerWidthHeight = function() {
		var bIE = /MSIE/.test(navigator.userAgent);
		var obj = {};
		
		if (bIE) {
			obj.nInnerWidth = document.documentElement.clientWidth || document.body.clientWidth;
			obj.nInnerHeight = document.documentElement.clientHeight || document.body.clientHeight;
		}
		else {
			obj.nInnerWidth = window.innerWidth;
			obj.nInnerHeight = window.innerHeight;
		}
		return obj;
	}


	//-------------------------------------------------------------
	// public static function
	//-------------------------------------------------------------

    /**
     *  플래시 오브젝트를 HTML에 임베드하는 함수 
     *
     *  @param div			삽입할 DIV ID
     *  @param sTag			플래시 임베드 테그
     *  		
     *  @return void
     */
	FlashObject.showAt = function(sDiv, sTag){
		document.getElementById(sDiv).innerHTML = sTag;
	}


    /**
     *  플래시 오브젝트를 HTML에 임베드하는 함수 
     *  generateTag 함수와 파라미터 동일
     *
     *  @param sURL			플래시 무비 주소
     *  @param nWidth		플래시 무비 가로크기 (default : 100%)
     *  @param nHeight		플래시 무비 세로크기 (default : 100%)
     *  @param oParam		플래시에 설정할 옵션 파라미터 (default : null)
     *  @param sAlign		플래시 정렬 기준
     *  @param sFPVersion	플레이어 다운로드 목표 버전
     *  		
     *  @return void
     */
	FlashObject.show = function(sURL, sID, nWidth, nHeight, oParam, sAlign, sFPVersion){

		if(oParam && oParam.requireVersion)
		{
			var versions = oParam.requireVersion.split(".");
			var hasRequire = FlashObject.detectFlashVer(versions[0], versions[1], versions[2]);
			
			if(hasRequire < 1)
			{
				if(oParam.forwardInstall)
					oParam.forwardInstall(hasRequire);
				else
					dafaultInstall(hasRequire);
				
				return null;
			}
		}

		document.write(FlashObject.generateTag(sURL, sID, nWidth, nHeight, oParam, sAlign, sFPVersion));
	}


    /**
     *  플래시 오브젝트를 HTML에 임베드할 때 사용할 태그 생성 함수 
     *
     *  @param sURL			플래시 무비 주소
     *  @param nWidth		플래시 무비 가로크기 (default : 100%)
     *  @param nHeight		플래시 무비 세로크기 (default : 100%)
     *  @param oParam		플래시에 설정할 옵션 파라미터 (default : null)
     *  @param sAlign		플래시 정렬 기준
     *  @param sFPVersion	플레이어 다운로드 목표 버전
     *  		
     *  @return String
     */
	FlashObject.generateTag = function(sURL, sID, nWidth, nHeight, oParam, sAlign, sFPVersion) {
		
		nWidth = nWidth || "100%";
		nHeight = nHeight || "100%";
		sFPVersion = sFPVersion || "9,0,0,0";
		sAlign = sAlign || "middle";
		
		var oOptions = FlashObject.getDefaultOption();
		
		var sClsID = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000';
		var sCodeBase = 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + sFPVersion;
		var sStyle = 'position:relative !important;';
		var sClassName = sClassPrefix;

		if (oParam)
		{
			if(oParam.flashVars)
			{
				if(typeof(oParam.flashVars) == "object")
					oParam.flashVars = objectToString(oParam.flashVars, "&");
				
				oParam.flashVars += "&";
			}
			else
			{
				oParam.flashVars = "";
			}

			oParam.flashVars += "__flashID=" + sID;
			
			sStyle = oParam.style || sStyle;
			sClassName = oParam.className || (sClassName + '_' + oParam.wheelHandler); 
			
			for (var key in oParam)
			{
				if((new RegExp('\\b' + key + '\\b', 'i').test(sReservedName))) continue;
				oOptions[key] = oParam[key];
			}
		}

		var objCode = [];
		var embedCode = [];
		
		objCode.push('<object classid="' + sClsID + '" codebase="' + sCodeBase + '" class="' + sClassName + '" style="' + sStyle + '" width="' + nWidth + '" height="' + nHeight + '" id="' + sID + '" align="' + sAlign + '">');
		objCode.push('<param name="movie" value="' + sURL + '" />');

		embedCode.push('<embed width="' + nWidth + '" height="' + nHeight + '" name="' + sID + '" class="' + sClassName + '" style="' + sStyle + '" src="' + sURL + '" align="' + sAlign + '" ');

		if(!bIE)
			embedCode.push('id="' + sID + '" ');
		
		for(var vars in oOptions){
			objCode.push('<param name="'+vars+'" value="' + oOptions[vars] + '" />');
			embedCode.push(vars +'="' + oOptions[vars] + '" ');
		}

		embedCode.push('type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />'); 
		
		objCode.push(embedCode.join(""));
		objCode.push('</object>');
		

		if (bind) {
			bind(window, 'unload', unloadHandler);
			bind(document, !bFF ? 'mousewheel' : 'DOMMouseScroll', wheelHandler);
			bind = null;
		}

		return (bIE)?objCode.join(""):embedCode.join("");

	};


    /**
     *  플래시 옵션 기본 설정값 
     *
     *  @return object
     */
	FlashObject.getDefaultOption = function() {
		return {
					 quality:"high",
					 bgColor:"#FFFFFF", 
					 allowScriptAccess:"always",
					 wmode:"window",
					 menu:"false",
					 allowFullScreen:"true"
				};
	};
	

    /**
     *  플래시 오브젝트를 찾아 반환해주는 함수 
     *
     *  @param objID		찾아야하는 플래시 오브젝트 ID
     *  @param doc			플래시를 갖고 있는 document 객체 / default : null
     *  @return object
     */
	FlashObject.find = function(sID, oDoc) {
		oDoc = oDoc || document;
		try {
			return oDoc[sID] || oDoc.all[sID];
		} catch(e) {
			return null;
		} 
	};

	FlashObject.getPlayerVersion = function()
	{
		return getSwfVer();
	};

    /**
     *  매개변수로 넘겨 받은 아이디의 플래시 오브젝트를 찾아 가로 크기를 변경하는 함수 
     *
     *  @param objID		찾아야하는 플래시 오브젝트 ID
     *  @param value		가로크기로 설정할 값
     *  @return void
     */
	FlashObject.setWidth = function(sID, value) {
		FlashObject.find(sID).width = value;
	};
	
    /**
     *  매개변수로 넘겨 받은 아이디의 플래시 오브젝트를 찾아 세로 크기를 변경하는 함수 
     *
     *  @param objID		찾아야하는 플래시 오브젝트 ID
     *  @param value		세로크기로 설정할 값
     *  @return void
     */
	FlashObject.setHeight = function(sID, value) {
		FlashObject.find(sID).height = value;
	};
	
    /**
     *  매개변수로 넘겨 받은 아이디의 플래시 오브젝트를 찾아 사이즈를 변경하는 함수 
     *
     *  @param objID		찾아야하는 플래시 오브젝트 ID
     *  @param nWidth		가로크기로 설정할 값
     *  @param nHeight		세로크기로 설정할 값
     *  @return void
     */
	FlashObject.setSize = function(sID, nWidth, nHeight) {
		FlashObject.find(sID).height = nHeight;
		FlashObject.find(sID).width = nWidth;
	};
	
	/**
	 *	오브젝트 아이디를 넘겨 받으면 해당 오브젝트의 절대 좌표 및 스크롤을 감안한 상대죄표를
	 *	반환하는 함수
	 * 
	 * 	@param sID			플래시 오브젝트 ID
	 */
	FlashObject.getPositionObj = function(sID){
		var targetObj = FlashObject.find(sID);
		if(targetObj == null)
			return null;
			
		var absPosi = getAbsoluteXY(targetObj);
		var scrollPosi = getScroll();
		
		var obj = {}
		obj.absoluteX = absPosi.left;
		obj.absoluteY = absPosi.top;
		obj.scrolledX = obj.absoluteX - scrollPosi.scrollX;
		obj.scrolledY = obj.absoluteY - scrollPosi.scrollY;
		obj.browserWidth = getInnerWidthHeight().nInnerWidth;
		
		return obj;		
	}
	
	/**
	 *  ssc(검색 로그 구분명)를 사용하고, cc.naver.com으로 로그를 
	 *  전송하는 클릭로그에서 NClicks.as에서 처리할 수 없는 
	 *  파라미터 값을 URL Variables의 형태로 반환해주는 함수
	 *  
	 *  @return string
	 */
	FlashObject.getSSCLogParam = function(){
		var rv = [];
		if (window.g_ssc) rv.push("ssc=" + g_ssc);
		else rv.push("ssc=decide.me");
		
		if (window.g_pid)
			rv.push("&p=" + g_pid);
		
		if (window.g_query)
			rv.push("&q=" + encodeURIComponent(g_query));
		
		if (window.g_sid)
			rv.push("&s=" + g_sid);
		
		return rv.join("");
	}
	
	return FlashObject;
 })()
