QUnit.config.autostart = false;

module('$Agent 객체');

	QUnit.test("$Agent : Firefox 디텍트가 잘 되는가?",function() {
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.1) Gecko/2008070206 Firefox/3.0.1';
		_navigator.vendor = '';
		window.opera = undefined;
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var oInfo = oAgent.navigator();
		deepEqual(oInfo.getName(), 'firefox');
		ok(oInfo.firefox);
		ok(!oInfo.webkit);
		ok(!oInfo.chrome);
		ok(!oInfo.opera);
		ok(!oInfo.ie);
		ok(!oInfo.safari);
		ok(!oInfo.mozilla);
		ok(!oInfo.camino);
		ok(!oInfo.netscape);
		ok(!oInfo.omniweb);
		ok(!oInfo.icab);
		ok(!oInfo.konqueror);
		$Agent._cached = null;
	});
QUnit.test("$Agent : Chrome 디텍트가 잘 되는가?",function() {
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/531.0 (KHTML, like Gecko) Chrome/3.0.190.1 Safari/531.0';
		_navigator.vendor = 'Google Inc.';
		window.opera = undefined;
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var oInfo = oAgent.navigator();
		deepEqual(oInfo.getName(), 'chrome');
		ok(!oInfo.firefox);
		ok(oInfo.webkit);
		ok(oInfo.chrome);
		ok(!oInfo.opera);
		ok(!oInfo.ie);
		ok(!oInfo.safari);
		ok(!oInfo.mozilla);
		ok(!oInfo.camino);
		ok(!oInfo.netscape);
		ok(!oInfo.omniweb);
		ok(!oInfo.icab);
		ok(!oInfo.konqueror);	
		$Agent._cached = null;
	});
QUnit.test("$Agent : 모바일 Chrome 디텍트가 잘 되는가?",function() {
        var _navigator = {};
        _navigator.userAgent = 'Mozilla/5.0 (Linux; Android 4.2.2; SHV-E300S Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36';
        _navigator.vendor = 'Google Inc.';
        window.opera = undefined;
        $Agent._cached = null;
        var oAgent = $Agent(_navigator);
        oAgent._navigator = _navigator;
        oAgent._dm = -1;
        var oInfo = oAgent.navigator();
        deepEqual(oInfo.getName(), 'chrome');
        ok(oInfo.webkit);
        ok(oInfo.chrome);
        ok(!oInfo.opera);
        deepEqual(oInfo.version, 31);
        $Agent._cached = null;
    });
QUnit.test("$Agent : IE 디텍트가 잘 되는가?",function() {
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; IPMS/930D0D0A-04A359770A0; TCO_20090615095913; InfoPath.2; .NET CLR 2.0.50727)';
		_navigator.vendor = '';
		window.opera = undefined;
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var oInfo = oAgent.navigator();
		deepEqual(oInfo.getName(), 'ie');
		ok(!oInfo.firefox);
		ok(!oInfo.webkit);
		ok(!oInfo.chrome);
		ok(!oInfo.opera);
		ok(oInfo.ie);
		ok(!oInfo.safari);
		ok(!oInfo.mozilla);
		ok(!oInfo.camino);
		ok(!oInfo.netscape);
		ok(!oInfo.omniweb);
		ok(!oInfo.icab);
		ok(!oInfo.konqueror);	
		$Agent._cached = null;
	});
QUnit.test("$Agent : Safari 디텍트가 잘 되는가?",function() {
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_3; en-us) AppleWebKit/XX (KHTML, like Gecko) Version/3.0.5 Safari/3.0.5';
		_navigator.vendor = 'Apple Computer, Inc.';
		window.opera = undefined;
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var oInfo = oAgent.navigator();
		deepEqual(oInfo.getName(), 'safari');
		ok(!oInfo.firefox);
		ok(oInfo.webkit);
		ok(!oInfo.chrome);
		ok(!oInfo.opera);
		ok(!oInfo.ie);
		ok(oInfo.safari);
		ok(!oInfo.mozilla);
		ok(!oInfo.camino);
		ok(!oInfo.netscape);
		ok(!oInfo.omniweb);
		ok(!oInfo.icab);
		ok(!oInfo.konqueror);	
		$Agent._cached = null;
	});
QUnit.test("$Agent : Opera 디텍트가 잘 되는가?",function() {
		var _navigator = {};
		_navigator.userAgent = 'Opera 9.7 (Windows NT 5.2; U; en)';
		_navigator.vendor = '';
		window.opera = {};
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var oInfo = oAgent.navigator();
		deepEqual(oInfo.getName(), 'opera');
		ok(!oInfo.firefox);
		ok(!oInfo.webkit);
		ok(!oInfo.chrome);
		ok(oInfo.opera);
		ok(!oInfo.ie);
		ok(!oInfo.safari);
		ok(!oInfo.mozilla);
		ok(!oInfo.camino);
		ok(!oInfo.netscape);
		ok(!oInfo.omniweb);
		ok(!oInfo.icab);
		ok(!oInfo.konqueror);	
		window.opera = undefined;
		$Agent._cached = null;
	});
QUnit.test("$Agent : Linux 디텍트가 잘 되는가?",function() {
		var _navigator = {};
		_navigator.userAgent = 'Opera/9.64 (X11; Linux i686; U; tr) Presto/2.1.1';
		_navigator.platform = 'Linux';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var oInfo = oAgent.os();
		deepEqual(oInfo.getName(), 'linux');
		ok(!oInfo.win);
		ok(!oInfo.mac);
		ok(oInfo.linux);
		$Agent._cached = null;
	});
QUnit.test("$Agent : Mac 디텍트가 잘 되는가?",function() {
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en) AppleWebKit/XX (KHTML, like Gecko) Safari/3.05';
		_navigator.platform = 'Mac OS X';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var oInfo = oAgent.os();
		deepEqual(oInfo.getName(), 'mac');
		ok(!oInfo.win);
		ok(oInfo.mac);
		ok(!oInfo.linux);
		$Agent._cached = null;
	});
QUnit.test("$Agent : Windows XP 디텍트가 잘 되는가?",function() {
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 1.0.3705; Media Center PC 3.1)';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var oInfo = oAgent.os();
		deepEqual(oInfo.getName(), 'xpsp2');
		ok(oInfo.win);
		ok(oInfo.winxp);
		ok(!oInfo.win2000);
		ok(oInfo.xpsp2);
		ok(!oInfo.vista);
		ok(!oInfo.win7);
		ok(!oInfo.mac);
		ok(!oInfo.linux);
		$Agent._cached = null;
	});
QUnit.test("$Agent : Windows 2000 디텍트가 잘 되는가?",function() {
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/4.0 (compatible; MSIE 6.0; Windows 2000)';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._dm = -1;
		oAgent._navigator = _navigator;
		var oInfo = oAgent.os();
		deepEqual(oInfo.getName(), 'win2000');
		ok(oInfo.win);
		ok(!oInfo.winxp);
		ok(oInfo.win2000);
		ok(!oInfo.xpsp2);
		ok(!oInfo.vista);
		ok(!oInfo.win7);
		ok(!oInfo.mac);
		ok(!oInfo.linux);
		$Agent._cached = null;
	});
QUnit.test("$Agent : Windows 2000키워드가 아닌 2000만 있으면 window2000이 되면 안된다.",function() {
        var _navigator = {};
        _navigator.userAgent = 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 1.0.37052000; Media Center PC 3.1)';
        _navigator.platform = 'Win32';
        $Agent._cached = null;
        var oAgent = $Agent(_navigator);
        oAgent._navigator = _navigator;
        oAgent._dm = -1;
        var oInfo = oAgent.os();
        deepEqual(oInfo.getName(), 'xpsp2');
        ok(oInfo.win);
        ok(oInfo.winxp);
        ok(!oInfo.win2000);
        ok(oInfo.xpsp2);
        ok(!oInfo.vista);
        ok(!oInfo.win7);
        ok(!oInfo.mac);
        ok(!oInfo.linux);
        $Agent._cached = null;
	});
QUnit.test("$Agent : Windows Vista 디텍트가 잘 되는가?",function() {
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/5.3 (compatible; MSIE 6.2; Windows NT 6.0)';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var oInfo = oAgent.os();
		deepEqual(oInfo.getName(), 'vista');
		ok(oInfo.win);
		ok(!oInfo.winxp);
		ok(!oInfo.win2000);
		ok(!oInfo.xpsp2);
		ok(oInfo.vista);
		ok(!oInfo.win7);
		ok(!oInfo.mac);
		ok(!oInfo.linux);
		$Agent._cached = null;
	});
QUnit.test("$Agent : Windows 7 디텍트가 잘 되는가?",function() {
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var oInfo = oAgent.os();
		deepEqual(oInfo.getName(), 'win7');
		ok(oInfo.win);
		ok(!oInfo.winxp);
		ok(!oInfo.win2000);
		ok(!oInfo.xpsp2);
		ok(!oInfo.vista);
		ok(oInfo.win7);
		ok(!oInfo.mac);
		ok(!oInfo.linux);
		$Agent._cached = null;
	});
QUnit.test("$Agent : IE8에서 IE7모드",function() {
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; IPMS/DE240D0A-14B4E9316A6-00000032300C; TCO_20100114140812; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30; InfoPath.2; .NET CLR 3.0.04506.648; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; OfficeLiveConnector.1.3; OfficeLivePatch.0.0)';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = 8;
		var oInfo = oAgent.navigator();
		ok(oInfo.ie);
		deepEqual(oInfo.version, 8);
		deepEqual(oInfo.nativeVersion, 8);
		$Agent._cached = null;
	});
QUnit.test("$Agent : IE8에서 호환모드",function() {
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; IPMS/DE240D0A-14B4E9316A6-00000032300C; TCO_20100114140812; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30; InfoPath.2; .NET CLR 3.0.04506.648; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; OfficeLiveConnector.1.3; OfficeLivePatch.0.0)';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = 9;
		var oInfo = oAgent.navigator();
		ok(oInfo.ie);
		deepEqual(oInfo.version, 9);
		deepEqual(oInfo.nativeVersion, 8);
		$Agent._cached = null;
	});
QUnit.test("$Agent : IE9에서 호환 모드",function(){
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C)';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = 7;
		var oInfo = oAgent.navigator();
		ok(oInfo.ie);
		deepEqual(oInfo.version, 7);
		deepEqual(oInfo.nativeVersion, 9);
		$Agent._cached = null;
		 
	});
QUnit.test("$Agent : IE11",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; Touch; .NET4.0E; .NET4.0C; Tablet PC 2.0; rv:11.0) like Gecko";
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = 11;
		var oInfo = oAgent.navigator();
		ok(oInfo.ie);
		deepEqual(oInfo.version, 11);
		deepEqual(oInfo.nativeVersion, 11);
		$Agent._cached = null;
		 
	});
QUnit.test("$Agent : IE11 호환성",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; Touch; .NET4.0E; .NET4.0C; Tablet PC 2.0; rv:11.0) like Gecko";
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = 7;
		var oInfo = oAgent.navigator();
		ok(oInfo.ie);
		deepEqual(oInfo.version, 7);
		deepEqual(oInfo.nativeVersion, 11);
		$Agent._cached = null;
		 
	});
QUnit.test("$Agent : Edge 12",function(){
	var _navigator = {};
	_navigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
	_navigator.vendor = '';
	window.opera = undefined;
	$Agent._cached = null;
	var oAgent = $Agent(_navigator);
	oAgent._navigator = _navigator;
	oAgent._dm = -1;
	var oInfo = oAgent.navigator();
	deepEqual(oInfo.getName(), 'edge');
	ok(oInfo.edge);
	ok(!oInfo.firefox);
	ok(!oInfo.webkit);
	ok(!oInfo.chrome);
	ok(!oInfo.opera);
	ok(!oInfo.ie);
	ok(!oInfo.safari);
	ok(!oInfo.mozilla);
	ok(!oInfo.camino);
	ok(!oInfo.netscape);
	ok(!oInfo.omniweb);
	ok(!oInfo.icab);
	ok(!oInfo.konqueror);
	deepEqual(oInfo.version, 12);
	$Agent._cached = null;
});
QUnit.test("safari 버전이 정확히 확인되어야 한다.",function(){
		var oSafariInfo = {
			"1"   : ['Mozilla/5.0 (Macintosh; U; PPC Mac OS X; sv-se) AppleWebKit/85.7 (KHTML, like Gecko) Safari/85.5'],
			"1.2" : [ 'Mozilla/5.0 (Macintosh; U; PPC Mac OS X; it-it) AppleWebKit/124 (KHTML, like Gecko) Safari/125.1',
					  'Mozilla/5.0 (Macintosh; U; PPC Mac OS X; es-es) AppleWebKit/125.2 (KHTML, like Gecko) Safari/125.8',
					  'Mozilla/5.0 (Macintosh; U; PPC Mac OS X; ja-jp) AppleWebKit/125.4 (KHTML, like Gecko) Safari/125.9',
					  'Mozilla/5.0 (Macintosh; U; PPC Mac OS X; fr-fr) AppleWebKit/125.5.6 (KHTML, like Gecko) Safari/125.12'],
			"1.3" : [ 'Mozilla/5.0 (Macintosh; U; PPC Mac OS X; it-it) AppleWebKit/312.1 (KHTML, like Gecko) Safari/312',
					  'Mozilla/5.0 (Macintosh; U; PPC Mac OS X; sv-se) AppleWebKit/312.5.2 (KHTML, like Gecko) Safari/312.3.3',
					  'Mozilla/5.0 (Macintosh; U; PPC Mac OS X; sv-se) AppleWebKit/312.8 (KHTML, like Gecko) Safari/312.5'],
			"2.0" : [ 'Mozilla/5.0 (Macintosh; U; PPC Mac OS; pl-pl) AppleWebKit/412 (KHTML, like Gecko) Safari/412',
					  'Mozilla/5.0 (Macintosh; U; PPC Mac OS X; ja-jp) AppleWebKit/412.7 (KHTML, like Gecko) Safari/412.5',
					  'Mozilla/5.0 (Macintosh; U; PPC Mac OS X; nl-nl) AppleWebKit/416.12 (KHTML, like Gecko) Safari/416.13',
					  'Mozilla/5.0 (Macintosh; U; PPC Mac OS X; tr-tr) AppleWebKit/418 (KHTML, like Gecko) Safari/417.9.3',
					  'Mozilla/5.0 (Macintosh; U; PPC Mac OS X; sv-se) AppleWebKit/419 (KHTML, like Gecko) Safari/419.3'],
			"3.0" : [ 'Mozilla/5.0 (Windows; U; Windows NT 6.0; sv-SE) AppleWebKit/523.13 (KHTML, like Gecko) Version/3.0 Safari/523.13',
					  'Mozilla/5.0 (Windows; U; Windows NT 6.0; fi) AppleWebKit/522.12.1 (KHTML, like Gecko) Version/3.0.1 Safari/522.12.2',
					  'Mozilla/5.0 (Windows; U; Windows NT 6.0; nl) AppleWebKit/522.13.1 (KHTML, like Gecko) Version/3.0.2 Safari/522.13.1',
					  'Mozilla/5.0 (Windows; U; Windows NT 6.0; en) AppleWebKit/522.15.5 (KHTML, like Gecko) Version/3.0.3 Safari/522.15.5',
					  'Mozilla/5.0 (Windows; U; Windows NT 6.0; en) AppleWebKit/525+ (KHTML, like Gecko) Version/3.0.4 Safari/523.11'],
			"3.1" : [ 'Mozilla/5.0 (Windows; U; Windows NT 5.2; ru-RU) AppleWebKit/525.13 (KHTML, like Gecko) Version/3.1 Safari/525.13.3',
					  'Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.1 Safari/525.17',
					  'Mozilla/5.0 (Windows; U; Windows NT 6.0; pl-PL) AppleWebKit/525.19 (KHTML, like Gecko) Version/3.1.2 Safari/525.21'],
			"3.2" : [ 'Mozilla/5.0 (Windows; U; Windows NT 6.0; hu-HU) AppleWebKit/525.26.2 (KHTML, like Gecko) Version/3.2 Safari/525.26.13',
					  'Mozilla/5.0 (Windows; U; Windows NT 6.0; sv-SE) AppleWebKit/525.27.1 (KHTML, like Gecko) Version/3.2.1 Safari/525.27.1',
					  'Mozilla/5.0 (Windows; U; Windows NT 6.1; de-DE) AppleWebKit/525.28 (KHTML, like Gecko) Version/3.2.2 Safari/525.28.1',
					  'Mozilla/5.0 (Windows; U; Windows NT 5.1; cs-CZ) AppleWebKit/525.28.3 (KHTML, like Gecko) Version/3.2.3 Safari/525.29'],
			"4.0" : [ 'Mozilla/5.0 (Windows; U; Windows NT 6.0; ru-RU) AppleWebKit/528.16 (KHTML, like Gecko) Version/4.0 Safari/528.16',
					  'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_7; en-us) AppleWebKit/531.2+ (KHTML, like Gecko) Version/4.0.1 Safari/530.18',
					  'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/532+ (KHTML, like Gecko) Version/4.0.2 Safari/530.19.1',
					  'Mozilla/5.0 (Windows; U; Windows NT 6.0; en-us) AppleWebKit/531.9 (KHTML, like Gecko) Version/4.0.3 Safari/531.9',
					  'Mozilla/5.0 (Windows; U; Windows NT 6.1; zh-TW) AppleWebKit/531.21.8 (KHTML, like Gecko) Version/4.0.4 Safari/531.21.10',
					  'Mozilla/5.0 (Windows; U; Windows NT 6.1; es-ES) AppleWebKit/531.22.7 (KHTML, like Gecko) Version/4.0.5 Safari/531.22.7',
					  'Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_4_11; tr) AppleWebKit/528.4+ (KHTML, like Gecko) Version/4.0dp1 Safari/526.11.2'],
			"4.1" : [ 'Mozilla/5.0 (Windows; U; Windows NT 5.0; en-en) AppleWebKit/533.16 (KHTML, like Gecko) Version/4.1 Safari/533.16' ],
			"5.0" : [ 'Mozilla/5.0 (X11; U; Linux x86_64; en-us) AppleWebKit/531.2+ (KHTML, like Gecko) Version/5.0 Safari/531.2+',
					  'Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US) AppleWebKit/533.17.8 (KHTML, like Gecko) Version/5.0.1 Safari/533.17.8',
					  'Mozilla/5.0 (Windows; U; Windows NT 6.1; zh-HK) AppleWebKit/533.18.1 (KHTML, like Gecko) Version/5.0.2 Safari/533.18.5',
					  'Mozilla/5.0 (Windows; U; Windows NT 6.1; sv-SE) AppleWebKit/533.19.4 (KHTML, like Gecko) Version/5.0.3 Safari/533.19.4',
					  'Mozilla/5.0 (Windows; U; Windows NT 6.1; tr-TR) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27']
		};
		for(var i in oSafariInfo){

			for(var j = 0, l = oSafariInfo[i+""].length ; j < l ; j++ ){
				var _navigator = {};
				_navigator.userAgent = oSafariInfo[i][j];
				_navigator.platform = 'Win32';
				_navigator.vendor = 'Apple';
				$Agent._cached = null;
				var oAgent = $Agent(_navigator);
				oAgent._navigator = _navigator;
				oAgent._dm = -1;
				var oInfo = oAgent.navigator();
				deepEqual(oInfo.version, parseFloat(i));
				$Agent._cached = null;	
			}
			
		}		
	});

	QUnit.test("mobile agent: mobile",function(){
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/5.0 (iPhone; U; XXXXX like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/241 Safari/419.3';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		ok(oAgent.navigator().mobile);
		
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/5.0 (Linux; U; Android 1.0; en-us; dream) AppleWebKit/525.10+ (KHTML, like Gecko) Version/3.0.4 Mobile Safari/523.12.2';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		ok(oAgent.navigator().mobile);
		
		var _navigator = {};
		_navigator.userAgent = 'N90: NokiaN90-1/3.0545.5.1 Series60/2.8 Profile/MIDP-2.0 Configuration/CLDC-1.1';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		ok(oAgent.navigator().mobile);
		
		var _navigator = {};
		_navigator.userAgent = 'Opera Mini 5 Beta: Opera/9.80 (J2ME/MIDP; Opera Mini/5.0.15650/756; U; en) Presto/2.2.0';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		ok(oAgent.navigator().mobile);
		
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/5.0 (webOS/1.0; U; en-US) AppleWebKit/525.27.1 (KHTML, like Gecko) Version/1.0 Safari/525.27.1 Pre/1.0';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		ok(oAgent.navigator().mobile);
		
		var _navigator = {};
		_navigator.userAgent = 'BlackBerry9700/5.0.0.351 Profile/MIDP-2.1 Configuration/CLDC-1.1 VendorID/123';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		ok(oAgent.navigator().mobile);
		
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; PPC; 240x320)';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		ok(oAgent.navigator().mobile);
		
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en) AppleWebKit/125.2 (KHTML, like Gecko) Safari/125.8';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		ok(!oAgent.navigator().mobile);
		
		
		
	});
QUnit.test("mobile safari : iphone ",function(){
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/5.0 (iPhone; U; XXXXX like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/241 Safari/419.3';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var navi = oAgent.navigator();
		
		ok(navi.msafari);
		deepEqual(navi.version, 3);
		ok(oAgent.os().iphone);
	});
QUnit.test("mobile safari : android ",function(){
		var _navigator = {};
		_navigator.userAgent = 'HTC Magic Mozilla/5.0 (Linux; U; Android 1.5; en-ca; Build/CUPCAKE) AppleWebKit/528.5+ (KHTML, like Gecko) Version/3.1.2 Mobile Safari/525.20.1';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var navi = oAgent.navigator();
		ok(navi.msafari);
		deepEqual(navi.version, 3.1);
		ok(oAgent.os().android);
	});
QUnit.test("mobile : nokia ",function(){
		var _navigator = {};
		_navigator.userAgent = 'NokiaN90-1/3.0545.5.1 Series60/2.8 Profile/MIDP-2.0 Configuration/CLDC-1.1';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var navi = oAgent.navigator();
		ok(oAgent.os().nokia);
	});
QUnit.test("mobile : opera ",function(){
		var _navigator = {};
		_navigator.userAgent = 'Opera Mini 5 Beta: Opera/9.80 (J2ME/MIDP; Opera Mini/5.0.15650/756; U; en) Presto/2.2.0';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var navi = oAgent.navigator();
		ok(navi.mopera);
		deepEqual(navi.version, 5);
	});
QUnit.test("mobile : BlackBerry ",function(){
		var _navigator = {};
		_navigator.userAgent = 'BlackBerry9700/5.0.0.351 Profile/MIDP-2.1 Configuration/CLDC-1.1 VendorID/123';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var navi = oAgent.navigator();
		ok(oAgent.os().blackberry);
	});
QUnit.test("mobile : mobie window ",function(){
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; PPC; 240x320)';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var navi = oAgent.navigator();
		ok(navi.mie);
		deepEqual(navi.version, 4.01);
		ok(oAgent.os().mwin);
		
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; Smartphone; 176x220)';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var navi = oAgent.navigator();
		ok(navi.mie);
		deepEqual(navi.version, 4.01);
		ok(oAgent.os().mwin);
		
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile m.n)';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var navi = oAgent.navigator();
		ok(navi.mie);
		deepEqual(navi.version, 6.0);
		ok(oAgent.os().mwin);
		
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; SAMSUNG; SGH-T899M';
		_navigator.platform = 'Win32';
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var navi = oAgent.navigator();
		ok(navi.mie);
		deepEqual(navi.version, 10);
		deepEqual(navi.nativeVersion, 10);
		ok(oAgent.os().mwin);
	});
QUnit.test("나눔 글꼴 개발에서 linux검증이 안되는 문제.",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.1.8) Gecko/20100401 Gentoo Firefox/3.5.8";
		_navigator.platform = "Linux i686";
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var oInfo = oAgent.os();
		deepEqual(oInfo.getName(), 'linux');
		ok(!oInfo.win);
		ok(!oInfo.mac);
		ok(!oInfo.winxp);
		ok(!oInfo.vista);
		ok(!oInfo.win7);
		ok(oInfo.linux);
		$Agent._cached = null;
		
	});
QUnit.test("ipad agent추가.",function(){
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10';
		_navigator.platform = 'iPad';
		$Agent._cached = null;
		var oAgent = $Agent();
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var oInfo = oAgent.navigator();

		ok(!oInfo.mobile);
		ok(oInfo.msafari);
		var oInfo2 = oAgent.os();
		ok(oInfo2.ipad);
		ok(!oInfo2.iphone);
	});
QUnit.test("Windows 7 버전 확인",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/5.0 (compatible; MSIE 10.6; Windows NT 6.1; Trident/5.0; InfoPath.2; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727) 3gpp-gba UNTRUSTED/1.0";
		_navigator.platform = "Win32";
		$Agent._cached = null;
		
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		
		var oOS = oAgent.os();
		deepEqual(oOS.version, "6.1");
		ok(oOS.win7);
		ok(oOS.win);
		deepEqual(oOS.getName(), "win7");
		
		ok(!oOS.mac);
		ok(!oOS.linux);
		ok(!oOS.win2000);
		ok(!oOS.winxp);
		ok(!oOS.xpsp2);
		ok(!oOS.vista);
		ok(!oOS.win8);
		ok(!oOS.ipad);
		ok(!oOS.iphone);
		ok(!oOS.android);
		ok(!oOS.nokia);
		ok(!oOS.webos);
		ok(!oOS.blackberry);
		ok(!oOS.mwin);
		ok(!oOS.ios);
		ok(!oOS.symbianos);
	});
QUnit.test("Windows 8.1 버전 확인",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; Touch; .NET4.0E; .NET4.0C; Tablet PC 2.0; rv:11.0) like Gecko";
		_navigator.platform = "Win32";
		$Agent._cached = null;
		
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		
		var oOS = oAgent.os();
		deepEqual(oOS.version, "6.3");
		ok(oOS.win);
		deepEqual(oOS.getName(), "win");
		
		ok(!oOS.win7);
		ok(!oOS.mac);
		ok(!oOS.linux);
		ok(!oOS.win2000);
		ok(!oOS.winxp);
		ok(!oOS.xpsp2);
		ok(!oOS.vista);
		ok(!oOS.win8);
		ok(!oOS.ipad);
		ok(!oOS.iphone);
		ok(!oOS.android);
		ok(!oOS.nokia);
		ok(!oOS.webos);
		ok(!oOS.blackberry);
		ok(!oOS.mwin);
		ok(!oOS.ios);
		ok(!oOS.symbianos);
	});
QUnit.test("Windows VISTA 버전 확인",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; InfoPath.1; SV1; .NET CLR 3.8.36217; WOW64; en-US)";
		_navigator.platform = "Win32";
		$Agent._cached = null;
		
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		
		var oOS = oAgent.os();
		deepEqual(oOS.version, "6.0");
		ok(oOS.vista);
		ok(oOS.win);
		deepEqual(oOS.getName(), "vista");
		
		ok(!oOS.mac);
		ok(!oOS.linux);
		ok(!oOS.win2000);
		ok(!oOS.winxp);
		ok(!oOS.xpsp2);
		ok(!oOS.win7);
		ok(!oOS.win8);
		ok(!oOS.ipad);
		ok(!oOS.iphone);
		ok(!oOS.android);
		ok(!oOS.nokia);
		ok(!oOS.webos);
		ok(!oOS.blackberry);
		ok(!oOS.mwin);
		ok(!oOS.ios);
		ok(!oOS.symbianos);
	});
QUnit.test("Windows XP 버전 확인",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; InfoPath.2; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727)";
		_navigator.platform = "Win32";
		$Agent._cached = null;
		
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		
		var oOS = oAgent.os();
		deepEqual(oOS.version, "5.1");
		ok(oOS.winxp);
		ok(oOS.win);
		deepEqual(oOS.getName(), "winxp");
		
		ok(!oOS.mac);
		ok(!oOS.linux);
		ok(!oOS.win2000);
		ok(!oOS.vista);
		ok(!oOS.xpsp2);
		ok(!oOS.win7);
		ok(!oOS.win8);
		ok(!oOS.ipad);
		ok(!oOS.iphone);
		ok(!oOS.android);
		ok(!oOS.nokia);
		ok(!oOS.webos);
		ok(!oOS.blackberry);
		ok(!oOS.mwin);
		ok(!oOS.ios);
		ok(!oOS.symbianos);
	});
QUnit.test("Windows 2000 버전 확인",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 5.0; Trident/4.0; FBSMTWB; .NET CLR 2.0.34861; .NET CLR 3.0.3746.3218; .NET CLR 3.5.33652; msn OptimizedIE8;ENUS)";
		_navigator.platform = "Win32";
		$Agent._cached = null;
		
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		
		var oOS = oAgent.os();
		deepEqual(oOS.version, "5.0");
		ok(oOS.win2000);
		ok(oOS.win);
		deepEqual(oOS.getName(), "win2000");
		
		ok(!oOS.mac);
		ok(!oOS.linux);
		ok(!oOS.winxp);
		ok(!oOS.vista);
		ok(!oOS.xpsp2);
		ok(!oOS.win7);
		ok(!oOS.win8);
		ok(!oOS.ipad);
		ok(!oOS.iphone);
		ok(!oOS.android);
		ok(!oOS.nokia);
		ok(!oOS.webos);
		ok(!oOS.blackberry);
		ok(!oOS.mwin);
		ok(!oOS.ios);
		ok(!oOS.symbianos);
	});
QUnit.test("Mac OS X 버전 확인",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/534.55.3 (KHTML, like Gecko) Version/5.1.3 Safari/534.53.10";
		_navigator.platform = "Mac OS X";
		$Agent._cached = null;
		
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		
		var oOS = oAgent.os();
		deepEqual(oOS.version, "10.7.3");
		ok(oOS.mac);
		deepEqual(oOS.getName(), "mac");
		
		ok(!oOS.win2000);
		ok(!oOS.win);
		ok(!oOS.linux);
		ok(!oOS.winxp);
		ok(!oOS.vista);
		ok(!oOS.xpsp2);
		ok(!oOS.win7);
		ok(!oOS.win8);
		ok(!oOS.ipad);
		ok(!oOS.iphone);
		ok(!oOS.android);
		ok(!oOS.nokia);
		ok(!oOS.webos);
		ok(!oOS.blackberry);
		ok(!oOS.mwin);
		ok(!oOS.ios);
		ok(!oOS.symbianos);
	});
QUnit.test("Android 버전 확인",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30";
		_navigator.platform = "";
		$Agent._cached = null;
		
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		
		var oOS = oAgent.os();
		deepEqual(oOS.version, "4.0.3");
		ok(oOS.android);
		deepEqual(oOS.getName(), "android");
		
		ok(!oOS.mac);
		ok(!oOS.win2000);
		ok(!oOS.win);
		ok(!oOS.linux);
		ok(!oOS.winxp);
		ok(!oOS.vista);
		ok(!oOS.xpsp2);
		ok(!oOS.win7);
		ok(!oOS.win8);
		ok(!oOS.ipad);
		ok(!oOS.iphone);
		ok(!oOS.nokia);
		ok(!oOS.webos);
		ok(!oOS.blackberry);
		ok(!oOS.mwin);
		ok(!oOS.ios);
		ok(!oOS.symbianos);
	});
QUnit.test("iOS 버전 확인(iPhone)",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; ru-ru) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5";
		_navigator.platform = "";
		$Agent._cached = null;
		
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		
		var oOS = oAgent.os();
		deepEqual(oOS.version, "4.2.1");
		ok(oOS.ios);
		ok(oOS.iphone);
		deepEqual(oOS.getName(), "ios");
		
		ok(!oOS.android);
		ok(!oOS.mac);
		ok(!oOS.win2000);
		ok(!oOS.win);
		ok(!oOS.linux);
		ok(!oOS.winxp);
		ok(!oOS.vista);
		ok(!oOS.xpsp2);
		ok(!oOS.win7);
		ok(!oOS.win8);
		ok(!oOS.ipad);
		ok(!oOS.nokia);
		ok(!oOS.webos);
		ok(!oOS.blackberry);
		ok(!oOS.mwin);
		ok(!oOS.symbianos);
	});
QUnit.test("iOS 버전 확인(iPad)",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10gin_lib.cc";
		_navigator.platform = "";
		$Agent._cached = null;
		
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		
		var oOS = oAgent.os();
		deepEqual(oOS.version, "3.2");
		ok(oOS.ios);
		ok(oOS.ipad);
		deepEqual(oOS.getName(), "ios");
		
		ok(!oOS.android);
		ok(!oOS.mac);
		ok(!oOS.win2000);
		ok(!oOS.win);
		ok(!oOS.linux);
		ok(!oOS.winxp);
		ok(!oOS.vista);
		ok(!oOS.xpsp2);
		ok(!oOS.win7);
		ok(!oOS.win8);
		ok(!oOS.iphone);
		ok(!oOS.nokia);
		ok(!oOS.webos);
		ok(!oOS.blackberry);
		ok(!oOS.mwin);
		ok(!oOS.symbianos);
	});
QUnit.test("iOS 버전 확인(iPod)",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_3 like Mac OS X; ja-jp) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5";
		_navigator.platform = "";
		$Agent._cached = null;
		
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		
		var oOS = oAgent.os();
		deepEqual(oOS.version, "4.3.3");
		ok(oOS.ios);
		ok(oOS.iphone);
		deepEqual(oOS.getName(), "ios");
		
		ok(!oOS.android);
		ok(!oOS.mac);
		ok(!oOS.win2000);
		ok(!oOS.win);
		ok(!oOS.linux);
		ok(!oOS.winxp);
		ok(!oOS.vista);
		ok(!oOS.xpsp2);
		ok(!oOS.win7);
		ok(!oOS.win8);
		ok(!oOS.ipad);
		ok(!oOS.nokia);
		ok(!oOS.webos);
		ok(!oOS.blackberry);
		ok(!oOS.mwin);
		ok(!oOS.symbianos);
	});
QUnit.test("BlackBerry 버전 확인",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+";
		_navigator.platform = "";
		$Agent._cached = null;
		
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		
		var oOS = oAgent.os();
		deepEqual(oOS.version, "7.1.0.346");
		ok(oOS.blackberry);
		deepEqual(oOS.getName(), "blackberry");
		
		ok(!oOS.ios);
		ok(!oOS.android);
		ok(!oOS.mac);
		ok(!oOS.win2000);
		ok(!oOS.win);
		ok(!oOS.linux);
		ok(!oOS.winxp);
		ok(!oOS.vista);
		ok(!oOS.xpsp2);
		ok(!oOS.win7);
		ok(!oOS.win8);
		ok(!oOS.iphone);
		ok(!oOS.ipad);
		ok(!oOS.nokia);
		ok(!oOS.webos);
		ok(!oOS.mwin);
		ok(!oOS.symbianos);
	});
QUnit.test("SymbianOS 버전 확인",function(){
		var _navigator = {};
		_navigator.userAgent = "Nokia6600/1.0 (5.27.0) SymbianOS/7.0s Series60/2.0 Profile/MIDP-2.0 Configuration/CLDC-1";
		_navigator.platform = "";
		$Agent._cached = null;
		
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		
		var oOS = oAgent.os();
		deepEqual(oOS.version, "7.0s");
		ok(oOS.nokia);
		ok(oOS.symbianos);
		deepEqual(oOS.getName(), "symbianos");
		
		ok(!oOS.ios);
		ok(!oOS.android);
		ok(!oOS.mac);
		ok(!oOS.win2000);
		ok(!oOS.win);
		ok(!oOS.linux);
		ok(!oOS.winxp);
		ok(!oOS.vista);
		ok(!oOS.xpsp2);
		ok(!oOS.win7);
		ok(!oOS.win8);
		ok(!oOS.iphone);
		ok(!oOS.ipad);
		ok(!oOS.blackberry);
		ok(!oOS.webos);
		ok(!oOS.mwin);
	});
QUnit.test("webOS 버전 확인",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/5.0 (webOS/1.0; U; en-US) AppleWebKit/525.27.1 (KHTML, like Gecko) Version/1.0 Safari/525.27.1 Pre/1.0";
		_navigator.platform = "";
		$Agent._cached = null;
		
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		
		var oOS = oAgent.os();
		deepEqual(oOS.version, "1.0");
		ok(oOS.webos);
		deepEqual(oOS.getName(), "webos");
		
		ok(!oOS.ios);
		ok(!oOS.android);
		ok(!oOS.mac);
		ok(!oOS.win2000);
		ok(!oOS.win);
		ok(!oOS.linux);
		ok(!oOS.winxp);
		ok(!oOS.vista);
		ok(!oOS.xpsp2);
		ok(!oOS.win7);
		ok(!oOS.win8);
		ok(!oOS.iphone);
		ok(!oOS.ipad);
		ok(!oOS.blackberry);
		ok(!oOS.nokia);
		ok(!oOS.symbianos);
		ok(!oOS.mwin);
	});
QUnit.test("Windows CE 버전 확인",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile m.n)";
		_navigator.platform = "";
		$Agent._cached = null;
		
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		
		var oOS = oAgent.os();
		deepEqual(oOS.version, null);
		ok(oOS.mwin);
		deepEqual(oOS.getName(), "mwin");
		
		ok(!oOS.ios);
		ok(!oOS.android);
		ok(!oOS.mac);
		ok(!oOS.win2000);
		ok(!oOS.win);
		ok(!oOS.linux);
		ok(!oOS.winxp);
		ok(!oOS.vista);
		ok(!oOS.xpsp2);
		ok(!oOS.win7);
		ok(!oOS.win8);
		ok(!oOS.iphone);
		ok(!oOS.ipad);
		ok(!oOS.blackberry);
		ok(!oOS.nokia);
		ok(!oOS.symbianos);
		ok(!oOS.webos);
	});
QUnit.test("Windows Phone 8 버전 확인",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; SAMSUNG; SGH-T899M";
		_navigator.platform = "";
		$Agent._cached = null;
		
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		
		var oOS = oAgent.os();
		deepEqual(oOS.version, "8.0");
		ok(oOS.mwin);
		deepEqual(oOS.getName(), "mwin");
		
		ok(!oOS.ios);
		ok(!oOS.android);
		ok(!oOS.mac);
		ok(!oOS.win2000);
		ok(!oOS.win);
		ok(!oOS.linux);
		ok(!oOS.winxp);
		ok(!oOS.vista);
		ok(!oOS.xpsp2);
		ok(!oOS.win7);
		ok(!oOS.win8);
		ok(!oOS.iphone);
		ok(!oOS.ipad);
		ok(!oOS.blackberry);
		ok(!oOS.nokia);
		ok(!oOS.symbianos);
		ok(!oOS.webos);
	});

module("flash관련 정보를 확인한다.");

	QUnit.test("plugins이 있는 경우",function(){
		var _navigator = {"plugins":{
			"length":9,
			"Shockwave Flash" : {"description":"Shockwave Flash 10.1 r102"}
		}};
		$Agent._cached = null;
		var oAgent = $Agent();
		oAgent._navigator = _navigator;
		oAgent._dm = -1;

		var oInfo = oAgent.flash();
		deepEqual(oInfo, {"installed":true,"version":10.1});

		var _navigator = {"plugins":{
			"length":9,
			"Shockwave Flash 2.0" : true
		}};
		$Agent._cached = null;
		var oAgent = $Agent();
		oAgent._navigator = _navigator;
		var oInfo = oAgent.flash();
		deepEqual(oInfo, {"installed":true,"version":2});
		$Agent._cached = null;
	});
QUnit.test("mimeTypes이 있는 경우",function(){
		var _navigator = {"mimeTypes":{
			"length":9,
			"application/x-shockwave-flash" : {"enabledPlugin":true}
		}};
		$Agent._cached = null;
		var oAgent = $Agent();
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var oInfo = oAgent.flash();
		deepEqual(oInfo, {"installed":true,"version":-1});
		$Agent._cached = null;
	});
QUnit.test("둘다 없는 경우",function(){
		var _navigator = {};
		$Agent._cached = null;
		var oAgent = $Agent();
		oAgent._navigator = {};
		oAgent._dm = -1;
		var oInfo = oAgent.flash();
		deepEqual(oInfo, {"installed":false, "version":-1});
		$Agent._cached = null;
	});


module("silverlight관련 정보를 확인한다.");

QUnit.test("plugins이 있는 경우",function(){
    var _navigator = {"plugins":{
        "length":9,
        "Silverlight Plug-In" : {"description":"4.0.50917.0"}
    }};
    $Agent._cached = null;
    var oAgent = $Agent();
    oAgent._navigator = _navigator;
    oAgent._dm = -1;
    var oInfo = oAgent.silverlight();
    deepEqual(oInfo, {"installed":true,"version":4});

    var _navigator = {"plugins":{
        "length":9
    }};
    $Agent._cached = null;
    var oAgent = $Agent();
    oAgent._navigator = _navigator;
    oAgent._dm = -1;
    var oInfo = oAgent.silverlight();
    deepEqual(oInfo, {"installed":false,"version":-1});
    $Agent._cached = null;
});

QUnit.test("plugins이 없는 경우",function(){
    var _navigator = {};
    $Agent._cached = null;
    var oAgent = $Agent();
    oAgent._navigator = {};
    oAgent._dm = -1;
    var oInfo = oAgent.silverlight();

    deepEqual(oInfo, {"installed":true,"version":3});
    $Agent._cached = null;
});

var oldActiveXObject = ActiveXObject;
var ActiveXObject = function (a){
	if(a=="AgControl.AgControl"){
		return {
			"isVersionSupported" : function(){return true}
		}
	} else if(/ShockwaveFlash/.test(a)){
		return "";
	}else{
		return new oldActiveXObject(a);
	}
}

// | Mozilla/5.0 (iPhone; U; XXXXX like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/241 Safari/419.3 |
// | Mozilla/5.0 (iPhone; U; XXXXX like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A477c Safari/419.3 |
// | Mozilla/5.0 (iPhone; U; XXXXX like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A477d Safari/419.3 |
// | Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A498b Safari/419.3 |
// | Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A535b Safari/419.3 |
// | Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A538b Safari/419.3 |
// | Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543a Safari/419.3 |
// | Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Kevin) Version/3.0 Mobile/1A543a Safari/419.3 |
// | Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A566a Safari/419.3 |
// | Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1C9 Safari/419.3 |
// | Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1C10 Safari/419.3 |
// | Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A522a Safari/419.3 |
// | Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1C6 Safari/419.3 |
// | Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A537a Safari/419.3 |
// Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25
// Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10gin_lib.cc
// Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_3 like Mac OS X; ja-jp) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5
// Mozilla/5.0 (iPod; U; CPU iPhone OS 2_2_1 like Mac OS X; en-us) AppleWebKit/525.18.1 (KHTML, like Gecko) Mobile/5H11a
// Mozilla/5.0 (iPhone; U; fr; CPU iPhone OS 4_2_1 like Mac OS X; fr) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148a Safari/6533.18.5

// Mozilla/5.0 (Linux; U; Android 1.0; en-us; dream) AppleWebKit/525.10+ (KHTML, like Gecko) Version/3.0.4 Mobile Safari/523.12.2  
// HTC Magic Mozilla/5.0 (Linux; U; Android 1.5; en-ca; Build/CUPCAKE) AppleWebKit/528.5+ (KHTML, like Gecko) Version/3.1.2 Mobile Safari/525.20.1
// HTC_Dream Mozilla/5.0 (Linux; U; Android 1.5; en-ca; Build/CUPCAKE) AppleWebKit/528.5+ (KHTML, like Gecko) Version/3.1.2 Mobile Safari/525.20.1
// Mozilla/5.0 (Linux; U; Android 0.5; en-us) AppleWebKit/522+ (KHTML, like Gecko) Safari/419.3
// Mozilla/5.0 (Linux; U; Android 0.6; en-us; generic) AppleWebKit/525.10+ (KHTML, like Gecko) Version/3.0.4 Mobile Safari/523.12.2

// N90: NokiaN90-1/3.0545.5.1 Series60/2.8 Profile/MIDP-2.0 Configuration/CLDC-1.1
// 3200: Nokia3200/1.0 (5.29) Profile/MIDP-1.0 Configuration/CLDC-1.0 UP.Link/6.3.1.13.0
// N80: NokiaN80-3/1.0552.0.7Series60/3.0Profile/MIDP-2.0Configuration/CLDC-1.1
// 7610: Nokia7610/2.0 (5.0509.0) SymbianOS/7.0s Series60/2.1 Profile/MIDP-2.0 Configuration/CLDC-1.0
// 6600: Nokia6600/1.0 (5.27.0) SymbianOS/7.0s Series60/2.0 Profile/MIDP-2.0 Configuration/CLDC-1
// 6680: Nokia6680/1.0 (4.04.07) SymbianOS/8.0 Series60/2.6 Profile/MIDP-2.0 Configuration/CLDC-1.1
// 6230: Nokia6230/2.0+(04.43)+Profile/MIDP-2.0+Configuration/CLDC-1.1+UP.Link/6.3.0.0.0
// 6630: Nokia6630/1.0 (2.3.129) SymbianOS/8.0 Series60/2.6 Profile/MIDP-2.0 Configuration/CLDC-1.1
// 7600: Nokia7600/2.0 (03.01) Profile/MIDP-1.0 Configuration/CLDC-1.0 (Google WAP Proxy/1.0)
// N-GAGE: NokiaN-Gage/1.0 SymbianOS/6.1 Series60/1.2 Profile/MIDP-1.0 Configuration/CLDC-1.0
// 5140: Nokia5140/2.0 (3.10) Profile/MIDP-2.0 Configuration/CLDC-1.1
// 3519i: Nokia3510i/1.0 (04.44) Profile/MIDP-1.0 Configuration/CLDC-1.0
// 7250i: Nokia7250i/1.0 (3.22) Profile/MIDP-1.0 Configuration/CLDC-1.0
// 7250: Nokia7250/1.0 (3.14) Profile/MIDP-1.0 Configuration/CLDC-1.0
// 6800: Nokia6800/2.0 (4.17) Profile/MIDP-1.0 Configuration/CLDC-1.0 UP.Link/5.1.2.9
// 3650: Nokia3650/1.0 SymbianOS/6.1 Series60/1.2 Profile/MIDP-1.0 Configuration/CLDC-1.0
// 8310: Nokia8310/1.0 (05.11) UP.Link/6.5.0.0.06.5.0.0.06.5.0.0.06.5.0.0.0

// # Opera Mini 5 Beta: Opera/9.80 (J2ME/MIDP; Opera Mini/5.0.15650/756; U; en) Presto/2.2.0
// # Opera Mini 8: Opera/8.01 (J2ME/MIDP; Opera Mini/3.0.6306/1528; en; U; ssr)

// Mozilla/5.0 (webOS/1.0; U; en-US) AppleWebKit/525.27.1 (KHTML, like Gecko) Version/1.0 Safari/525.27.1 Pre/1.0 

// BlackBerry9700/5.0.0.351 Profile/MIDP-2.1 Configuration/CLDC-1.1 VendorID/123
// BlackBerry9630/4.7.1.40 Profile/MIDP-2.0 Configuration/CLDC-1.1 VendorID/105
// BlackBerry9000/4.6.0.167 Profile/MIDP-2.0 Configuration/CLDC-1.1 VendorID/102
// BlackBerry8330/4.3.0 Profile/MIDP-2.0 Configuration/CLDC-1.1 VendorID/105
// BlackBerry8830/4.2.2 Profile/MIDP-2.0 Configuration/CLOC-1.1 VendorID/105
// Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+
// Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; zh-TW) AppleWebKit/534.8+ (KHTML, like Gecko) Version/6.0.0.448 Mobile Safari/534.8+
// Mozilla/5.0 (BlackBerry; U; BlackBerry 9700; pt) AppleWebKit/534.8+ (KHTML, like Gecko) Version/6.0.0.546 Mobile Safari/534.8+

// Mozilla/2.0 (compatible;MSIE 3.02;Windows CE; Smartphone; 176x220) // Smartphone 2002
// Mozilla/2.0 (compatible; MSIE 3.02; Windows CE; PPC; 240x320) // Pocket PC 2002
// Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; PPC; 240x320) // Windows Mobile 5.0 User Agent
// Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; Smartphone; 176x220)
// Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile m.n)
// Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 6.12) // Windows Mobile 6 User Agent
// Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 7.11) // Windows Mobile 6.1 User Agent, 참고 - http://msdn.microsoft.com/en-us/library/cc546461.aspx
// HTC_Touch_3G Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 7.11)
// Mozilla/4.0 (PDA; Windows CE/1.0.1) NetFront/3.0
// Mozilla/5.0 (Windows; Windows; U; Windows NT 5.1; Windows CE 5.2; rv:1.8.1.4pre) Gecko/20070327 Minimo/0.020
// Mozilla/5.0 (Windows; U; Windows CE 4.20; rv:1.8) Gecko/20060215 Minimo/0.013
// Mozilla/4.0 (compatible; MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0; Nokia;N70)
// Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)
// Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; SAMSUNG; SGH-T899M // Windows Phone 8