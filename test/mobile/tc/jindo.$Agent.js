QUnit.config.autostart = false;

module("$Agent 객체");
	QUnit.test("$Agent : Chrome 디텍트가 잘 되는가?",function(){
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/531.0 (KHTML, like Gecko) Chrome/3.0.190.1 Safari/531.0';
		_navigator.vendor = 'Google Inc.';
		window.opera = undefined;
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var oInfo = oAgent.navigator();
		equal(oInfo.getName(),'chrome');
		ok(oInfo.webkit);
		ok(oInfo.chrome);
		ok(!oInfo.opera);
		$Agent._cached = null;
	});
	QUnit.test("$Agent : 모바일 Chrome 디텍트가 잘 되는가?",function(){
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/5.0 (Linux; Android 4.2.2; SHV-E300S Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36';
		_navigator.vendor = 'Google Inc.';
		window.opera = undefined;
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var oInfo = oAgent.navigator();
		equal(oInfo.getName(),'chrome');
		ok(oInfo.webkit);
		ok(oInfo.chrome);
		ok(!oInfo.opera);
		equal(oInfo.version,31);
		$Agent._cached = null;
	});
	QUnit.test("$Agent : Webkit 디텍트가 잘 되는가?",function(){
		var _navigator = {};
		_navigator.userAgent = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_3; en-us) AppleWebKit/XX (KHTML, like Gecko) Version/3.0.5 Safari/3.0.5';
		_navigator.vendor = 'Apple Computer, Inc.';
		window.opera = undefined;
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var oInfo = oAgent.navigator();
		equal(oInfo.getName(),'webkit');
		ok(oInfo.webkit);
		ok(!oInfo.chrome);
		ok(!oInfo.opera);
		$Agent._cached = null;
	});

	QUnit.test("$Agent : Opera 디텍트가 잘 되는가?",function(){
		var _navigator = {};
		_navigator.userAgent = 'Opera 9.7 (Windows NT 5.2; U; en)';
		_navigator.vendor = '';
		window.opera = {};
		$Agent._cached = null;
		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;
		var oInfo = oAgent.navigator();
		equal(oInfo.getName(),'opera');
		ok(!oInfo.webkit);
		ok(!oInfo.chrome);
		ok(oInfo.opera);
		window.opera = undefined;
		$Agent._cached = null;
	});

	QUnit.test("safari 버전이 정확히 확인되어야 한다.",function(){
		var oSafariInfo = {
            "4.0.4" : [
                'Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10gin_lib.cc',
                'Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10',
                'Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/123',
                'Mozilla/5.0 (iPhone; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10'
            ],
            "4.0.5" : [
                'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_1 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8B117 Safari/6531.22.7',
                'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_1 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8B5097d Safari/6531.22.7'
            ],
            "5.0.2" : [
                'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; nb-no) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148a Safari/6533.18.5',
                'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; ru-ru) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5',
                'Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_1 like Mac OS X; zh-cn) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8G4 Safari/6533.18.5',
                'Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_3 like Mac OS X; ja-jp) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5'
            ],
            "8" : [ 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_1_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B435 Safari/600.1.4' ]
		};

		for(var i in oSafariInfo){
			for(var j = 0, l = oSafariInfo[i+""].length ; j < l ; j++ ){
				var _navigator = {};
				_navigator.userAgent = oSafariInfo[i][j];
				_navigator.platform = 'iPhone';
				_navigator.vendor = 'Apple Computer, Inc.';
				$Agent._cached = null;
				var oAgent = $Agent(_navigator);
				oAgent._navigator = _navigator;
				oAgent._dm = -1;
				var oInfo = oAgent.navigator();
				if (oInfo.version === -1) {
					console.log(_navigator.userAgent, oInfo.version);
				}

				equal(oInfo.version,parseFloat(i));
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
		equal(navi.version,3);
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
		equal(navi.version,3.1);
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
		equal(navi.version,5);
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
		equal(navi.version,4.01);
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
		equal(navi.version,4.01);
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
		equal(navi.version,6.0);
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
		equal(navi.version,10);
		equal(navi.nativeVersion,10);
		ok(oAgent.os().mwin);
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
	QUnit.test("Android 버전 확인",function(){
		var _navigator = {};
		_navigator.userAgent = "Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30";
		_navigator.platform = "";
		$Agent._cached = null;

		var oAgent = $Agent(_navigator);
		oAgent._navigator = _navigator;
		oAgent._dm = -1;

		var oOS = oAgent.os();
		equal(oOS.version,"4.0.3");
		ok(oOS.android);
		equal(oOS.getName(),"android");

		ok(!oOS.ipad);
		ok(!oOS.iphone);
		ok(!oOS.nokia);
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
		equal(oOS.version,"4.2.1");
		ok(oOS.ios);
		ok(oOS.iphone);
		equal(oOS.getName(),"ios");

		ok(!oOS.android);
		ok(!oOS.ipad);
		ok(!oOS.nokia);
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
		equal(oOS.version,"3.2");
		ok(oOS.ios);
		ok(oOS.ipad);
		equal(oOS.getName(),"ios");

		ok(!oOS.android);
		ok(!oOS.iphone);
		ok(!oOS.nokia);
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
		equal(oOS.version,"4.3.3");
		ok(oOS.ios);
		ok(oOS.iphone);
		equal(oOS.getName(),"ios");

		ok(!oOS.android);
		ok(!oOS.ipad);
		ok(!oOS.nokia);
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
		equal(oOS.version,"7.1.0.346");
		ok(oOS.blackberry);
		equal(oOS.getName(),"blackberry");

		ok(!oOS.ios);
		ok(!oOS.android);
		ok(!oOS.iphone);
		ok(!oOS.ipad);
		ok(!oOS.nokia);
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
		equal(oOS.version,"7.0s");
		ok(oOS.nokia);
		ok(oOS.symbianos);
		equal(oOS.getName(),"symbianos");

		ok(!oOS.ios);
		ok(!oOS.android);
		ok(!oOS.iphone);
		ok(!oOS.ipad);
		ok(!oOS.blackberry);
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
		equal(oOS.version,null);
		ok(oOS.mwin);
		equal(oOS.getName(),"mwin");

		ok(!oOS.ios);
		ok(!oOS.android);
		ok(!oOS.iphone);
		ok(!oOS.ipad);
		ok(!oOS.blackberry);
		ok(!oOS.symbianos);
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
		equal(oOS.version,"8.0");
		ok(oOS.mwin);
		equal(oOS.getName(),"mwin");

		ok(!oOS.ios);
		ok(!oOS.android);
		ok(!oOS.iphone);
		ok(!oOS.ipad);
		ok(!oOS.blackberry);
		ok(!oOS.nokia);
		ok(!oOS.symbianos);
	});

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

// Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; PPC; 240x320)
// Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; Smartphone; 176x220)
// Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile m.n)