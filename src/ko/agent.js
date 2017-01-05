/**

 * @fileOverview $Agent() 객체의 생성자 및 메서드를 정의한 파일
 * @author Kim, Taegon  
	
 */

/**

 * @class $Agent() 객체는 운영체제, 브라우저를 비롯한 사용자 시스템 정보를 제공한다.
 * @constructor
 * @description $Agent() 객체를 생성한다. $Agent() 객체는 사용자 시스템의 운영 체제 정보와 브라우저 정보를 제공한다.  
	
 */
jindo.$Agent = function() {
	var cl = arguments.callee;
	var cc = cl._cached;

	if (cc) return cc;
	if (!(this instanceof cl)) return new cl;
	if (!cc) cl._cached = this;

	this._navigator = navigator;
}

/**

 * @description navigator() 메서드는 사용자 브라우저 정보를 담고 있는 객체를 반환한다. 브라우저 정보를 저장하는 객체는 브라우저 이름과 버전을 속성으로 가진다. 브라우저 이름은 영어 소문자로 표시하며, 사용자의 브라우저와 일치하는 브라우저 속성은 true 값을 가진다. 또한, 사용자의 브라우저 이름을 확인할 수 있도록 메서드를 제공한다. 다음은 사용자 브라우저 정보를 담고 있는 객체의 속성과 메서드를 설명한 표이다.<br>
 <table>
	<caption>브라우저 정보 객체 속성</caption>
	<thead>
		<tr>
			<th scope="col">이름</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>camino</td>
			<td>Boolean</td>
			<td>카미노(Camino) 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>chrome</td>
			<td>Boolean</td>
			<td>구글 크롬(Chrome) 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>firefox</td>
			<td>Boolean</td>
			<td>파이어폭스(Firefox) 브라우저 사용 여부를 불리언 형태로 저장한다. </td>
		</tr>
		<tr>
			<td>icab</td>
			<td>Boolean</td>
			<td>iCab 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>ie</td>
			<td>Boolean</td>
			<td>인터넷 익스플로러(Internet Explorer) 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>konqueror</td>
			<td>Boolean</td>
			<td>Konqueror 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>mie</td>
			<td>Boolean</td>
			<td>인터넷 익스플로러 모바일(Internet Explorer Mobile) 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>mobile</td>
			<td>Boolean</td>
			<td>모바일 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>mozilla</td>
			<td>Boolean</td>
			<td>모질라(Mozilla) 계열의 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>msafari</td>
			<td>Boolean</td>
			<td>Mobile 버전 Safari 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>nativeVersion</td>
			<td>Number</td>
			<td>인터넷 익스플로러 호환 모드의 브라우저를 사용할 경우 실제 브라우저를 저장한다.</td>
		</tr>
		<tr>
			<td>netscape</td>
			<td>Boolean</td>
			<td>넷스케이프(Netscape) 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>omniweb</td>
			<td>Boolean</td>
			<td>OmniWeb 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>opera</td>
			<td>Boolean</td>
			<td>오페라(Opera) 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>safari</td>
			<td>Boolean</td>
			<td>Safari 브라우저 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>version</td>
			<td>Number</td>
			<td>사용자가 사용하고 있는 브라우저의 버전 정보를 저장한다. 실수(Float) 형태로 버전 정보를 저장하며 버전 정보가 없으면 -1 값을 가진다.</td>
		</tr>
		<tr>
			<td>webkit</td>
			<td>WebKit 계열 부라우저 사용 여부를 불리언 형태로 저장한다. </td>
		</tr>
	</tbody>
</table>
<table>
	<caption>브라우저 정보 객체 메서드</caption>
	<thead>
		<tr>
			<th scope="col">이름</th>
			<th scope="col">반환 타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>getName()</td>
			<td>String</td>
			<td>사용자가 사용하고 있는 브라우저의 이름을 반환한다. 반환하는 브라우저의 이름은 속성 이름과 동일하다.</td>
		</tr>
	</tbody>
 </table>
 * @return {Object}<br>브라우저 정보를 저장하는 객체.
 * @since 1.4.3 버전부터 mobile,msafari,mopera,mie 사용 가능.<br>1.4.5 버전부터 ipad에서 mobile은 false를 반환한다.
 * @example
oAgent = $Agent().navigator(); // 사용자가 파이어폭스 3를 사용한다고 가정한다.

oAgent.camino  // false
oAgent.firefox  // true
oAgent.konqueror // false
oAgent.mozilla  //true
oAgent.netscape  // false
oAgent.omniweb  //false
oAgent.opera  //false
oAgent.webkit  /false
oAgent.safari  //false
oAgent.ie  //false
oAgent.chrome  //false
oAgent.icab  //false
oAgent.version  //3
oAgent.nativeVersion //-1 (1.4.2부터 사용 가능, IE8에서 호환 모드 사용시 nativeVersion은 8로 나옴.)

oAgent.getName() // firefox
	
 */

jindo.$Agent.prototype.navigator = function() {
	var info = new Object;
	var ver  = -1;
	var nativeVersion = -1;
	var u    = this._navigator.userAgent;
	var v    = this._navigator.vendor || "";

	function f(s,h){ return ((h||"").indexOf(s) > -1) };

	info.getName = function(){
		var name = "";
		for(x in info){
			if(typeof info[x] == "boolean" && info[x]&&info.hasOwnProperty(x))
				name = x;
		}
		return name;
	}

	info.webkit		= f("WebKit",u);
	info.opera     = (typeof window.opera != "undefined") || f("Opera",u);
	info.ie        = !info.opera && f("MSIE",u);
	info.chrome    = info.webkit && f("Chrome",u);
	info.safari    = info.webkit && !info.chrome && f("Apple",v);
	info.firefox   = f("Firefox",u);
	info.mozilla   = f("Gecko",u) && !info.safari && !info.chrome && !info.firefox;
	info.camino    = f("Camino",v);
	info.netscape  = f("Netscape",u);
	info.omniweb   = f("OmniWeb",u);
	info.icab      = f("iCab",v);
	info.konqueror = f("KDE",v);

	info.mobile	   = (f("Mobile",u)||f("Android",u)||f("Nokia",u)||f("webOS",u)||f("Opera Mini",u)||f("BlackBerry",u)||(f("Windows",u)&&f("PPC",u))||f("Smartphone",u)||f("IEMobile",u))&&!f("iPad",u);
	info.msafari   = (!f("IEMobile",u) && f("Mobile",u))||(f("iPad",u)&&f("Safari",u));
	info.mopera    = f("Opera Mini",u);
	info.mie       = f("PPC",u)||f("Smartphone",u)||f("IEMobile",u);

	try {
		
		if (info.ie) {
			ver = u.match(/(?:MSIE) ([0-9.]+)/)[1];
			if (u.match(/(?:Trident)\/([0-9.]+)/)){
				var nTridentNum = parseInt(RegExp.$1,10);
				if(nTridentNum > 3){
					nativeVersion = nTridentNum + 4;	
				}
			}
		} else if (info.safari||info.msafari) {
			
			ver = parseFloat(u.match(/Safari\/([0-9.]+)/)[1]);
			if (ver == 100) {
				ver = 1.1;
			} else {
				if(u.match(/Version\/([0-9.]+)/)){
					ver = RegExp.$1;
				}else{
					ver = [1.0,1.2,-1,1.3,2.0,3.0][Math.floor(ver/100)];	
					
				}
			}
		} else if(info.mopera){
			ver = u.match(/(?:Opera\sMini)\/([0-9.]+)/)[1];
		} else if (info.firefox||info.opera||info.omniweb) {
			ver = u.match(/(?:Firefox|Opera|OmniWeb)\/([0-9.]+)/)[1];
		} else if (info.mozilla) {
			ver = u.match(/rv:([0-9.]+)/)[1];
		} else if (info.icab) {
			ver = u.match(/iCab[ \/]([0-9.]+)/)[1];
		} else if (info.chrome) {
			ver = u.match(/Chrome[ \/]([0-9.]+)/)[1];
		}

		info.version = parseFloat(ver);
		info.nativeVersion = parseFloat(nativeVersion);
		if (isNaN(info.version)) info.version = -1;
	} catch(e) {
		info.version = -1;
	}

	this.navigator = function() {
		return info;
	};

	return info;
};

/**

 * @description os() 메서드는 사용자 운영체제 정보를 담고 있는 객체를 반환한다. 운영체제 정보를 저장하는 객체는 운영체제 이름을 속성으로 가진다. 운영 체제 속성은 영어 소문자로 표시하며, 사용자의 운영체제와 일치하는 운영체제의 속성은 true 값을 가진다. 또한 사용자의 운영체제 이름을 확인할 수 있도록 메서드를 제공한다.<br> 다음은 사용자 운영체제 정보를 담고 있는 객체의 속성과 메서드를 설명한 표이다.<br>
<table>
	<caption>운영체제 정보 객체 속성</caption>
	<thead>
		<tr>
			<th scope="col">이름</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>android</td>
			<td>Boolean</td>
			<td>Android 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>blackberry</td>
			<td>Boolean</td>
			<td>Blackberry 운영체제 사용 여부를 불리언 형태로 저장한다. </td>
		</tr>
		<tr>
			<td>iphone</td>
			<td>Boolean</td>
			<td>iPhone 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>linux</td>
			<td>Boolean</td>
			<td>Linux운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>mac</td>
			<td>Boolean</td>
			<td>Mac운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>mwin</td>
			<td>Boolean</td>
			<td>Window Mobile 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>nokia</td>
			<td>Boolean</td>
			<td>Nokia 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>vista</td>
			<td>Boolean</td>
			<td>Windows Vista 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>webos</td>
			<td>Boolean</td>
			<td>webOS 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>win</td>
			<td>Boolean</td>
			<td>Windows계열 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>win2000</td>
			<td>Boolean</td>
			<td>Windows 2000운영체제 사용 여부 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>win7</td>
			<td>Boolean</td>
			<td>Windows 7 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>winxp</td>
			<td>Boolean</td>
			<td>Windows XP 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>xpsp2</td>
			<td>Boolean</td>
			<td>Windows XP SP 2 운영체제 사용 여부를 불리언 형태로 저장한다.</td>
		</tr>
	</tbody>
</table>
<table>
	<caption>운영체제 정보 객체 메서드</caption>
	<thead>
		<tr>
			<th scope="col">이름</th>
			<th scope="col">반환 타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>getName()</td>
			<td>String</td>
			<td>사용자가 사용하고 있는 운영체제의 이름을 반환한다. 반환하는 운영체제의 이름은 속성 이름과 동일하다.</td>
		</tr>
	</tbody>
 </table>
 * @return {Object} 운영체제 정보를 저장하는 객체.
 * @since 1.4.3 버전부터 iphone,android,nokia,webos,blackberry,mwin 사용 가능.<br>1.4.5 버전부터 ipad 사용가능.
 * @example
oOS = $Agent().os();  // 사용자의 운영체제가 Windows XP라고 가정한다.
oOS.linux  // false
oOS.mac  // false
oOS.vista  // false
oOS.win  // true
oOS.win2000  // false
oOS.winxp  // true
oOS.xpsp2  // false
oOS.win7  // false
oOS.getName() // winxp
  
 */
jindo.$Agent.prototype.os = function() {
	var info = new Object;
	var u    = this._navigator.userAgent;
	var p    = this._navigator.platform;
	var f    = function(s,h){ return (h.indexOf(s) > -1) };

	info.getName = function(){
		var name = "";
		for(x in info){

			if(typeof info[x] == "boolean" && info[x]&&info.hasOwnProperty(x))
				name = x;
		}
		return name;
	}

	info.win     = f("Win",p)
	info.mac     = f("Mac",p);
	info.linux   = f("Linux",p);
	info.win2000 = info.win && (f("NT 5.0",u) || f("2000",u));
	info.winxp   = info.win && f("NT 5.1",u);
	info.xpsp2   = info.winxp && f("SV1",u);
	info.vista   = info.win && f("NT 6.0",u);
	info.win7  = info.win && f("NT 6.1",u);
	info.ipad = f("iPad",u);
	info.iphone = f("iPhone",u) && !info.ipad;
	info.android = f("Android",u);
	info.nokia =  f("Nokia",u);
	info.webos = f("webOS",u);
	info.blackberry = f("BlackBerry",u);
	info.mwin = f("PPC",u)||f("Smartphone",u)||f("IEMobile",u);


	this.os = function() {
		return info;
	};

	return info;
};

/**

 * @description flash() 메서드는 사용자의 Flash Player 정보를 담고 있는 객체를 반환한다. Flash Player 정보를 저장하는 객체는 Flash Player 설치 여부와 설치된 Flash Player의 버전 정보를 제공한다. 다음은 Flash Player의 정보를 담고 있는 객체의 속성을 설명한 표이다.<br>
 <table>
	<caption>Flash Player 정보 객체 속성</caption>
	<thead>
		<tr>
			<th scope="col">이름</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>installed</td>
			<td>Boolean</td>
			<td>Flash Player 설치 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>version</td>
			<td>Number</td>
			<td>사용자가 사용하고 있는 Flash Player의 버전 정보를 저장한다. 실수(Float) 형태로 버전 정보를 저장하며, Flash Player가 설치되지 않은 경우 -1을 저장한다. </td>
		</tr>
	</tbody>
 </table>
 * @return {Object} Flash Player 정보를 저장하는 객체.
 * @see <a href="http://www.adobe.com/products/flashplayer/">Flash Player 공식 페이지</a>
 * @example
var oFlash = $Agent.flash();
oFlash.installed  // 플래시 플레이어를 설치했다면 true
oFlash.version  // 플래시 플레이어의 버전. 
  
 */
jindo.$Agent.prototype.flash = function() {
	var info = new Object;
	var p    = this._navigator.plugins;
	var m    = this._navigator.mimeTypes;
	var f    = null;

	info.installed = false;
	info.version   = -1;

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
			info.version   = 2;
		}
	} else if (typeof m != "undefined" && m.length) {
		f = m["application/x-shockwave-flash"];
		info.installed = (f && f.enabledPlugin);
	} else {
		for(var i=10; i > 1; i--) {
			try {
				f = new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+i);
				info.installed = true;
				info.version   = i;
				break;
			} catch(e) {}
		}
	}

	this.flash = function() {
		return info;
	};
    /*
    
하위호환을 위해 일단 남겨둔다.
  
     */
	this.info = this.flash;

	return info;
};

/**

 * silverlight() 메서드는 사용자의 실버라이트(Silverlight) 정보를 담고 있는 객체를 반환한다. 
 * @description 실버라이트 정보를 저장하는 객체는 실버라이트 설치 여부와 설치된 실버라이트의 버전 정보를 제공한다. 다음은 실버라이트 정보를 담고 있는 객체의 속성을 설명한 표이다.<br>
  <table>
	<caption>실버라이트 정보 객체 속성</caption>
	<thead>
		<tr>
			<th scope="col">이름</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>installed</td>
			<td>Boolean</td>
			<td>실버라이트 설치 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>version</td>
			<td>Number</td>
			<td>사용자가 사용하고 있는 실버라이트의 버전 정보를 저장한다. 실수(Float) 형태로 버전 정보를 저장하며, 실버라이트가 설치되지 않은 경우 -1을 저장한다. </td>
		</tr>
	</tbody>
 </table>
 * @returns {Object} 실버라이트 정보를 저장하는 객체.
 * @see <a href="http://www.microsoft.com/silverlight/">실버라이트 공식 페이지</a>
 * @example
var oSilver = $Agent.silverlight();
oSilver.installed  // Silverlight 플레이어를 설치했다면 true
oSilver.version  // Silverlight 플레이어의 버전. 
  
 */
jindo.$Agent.prototype.silverlight = function() {
	var info = new Object;
	var p    = this._navigator.plugins;
	var s    = null;

	info.installed = false;
	info.version   = -1;

	if (typeof p != "undefined" && p.length) {
		s = p["Silverlight Plug-In"];
		if (s) {
			info.installed = true;
			info.version = parseInt(s.description.split(".")[0],10);
			if (s.description == "1.0.30226.2") info.version = 2;
		}
	} else {
		try {
			s = new ActiveXObject("AgControl.AgControl");
			info.installed = true;
			if(s.isVersionSupported("3.0")){
				info.version = 3;
			}else if (s.isVersionSupported("2.0")) {
				info.version = 2;
			} else if (s.isVersionSupported("1.0")) {
				info.version = 1;
			}
		} catch(e) {}
	}

	this.silverlight = function() {
		return info;
	};

	return info;
};
