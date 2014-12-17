QUnit.config.autostart = false;

var _isOnerrorExcute = false;

var ___namespace = location.href.match(/jindo=(\w*)/);
var ___jindoName = "jindo";
if(___namespace&&___namespace[1]){
    ___jindoName = ___namespace[1];
}


module("$Ajax 객체");
    QUnit.test("$Ajax 타입",function(){
        // Given
        __mockConsole.init();
        __mockConsole.reset();
        // When
        var oAjax = new $Ajax('../data/ajax_test_json.txt',{
            "type" : "post",
            "async" : true
        });
        // Then
        deepEqual(__mockConsole.get(), null);

        __mockConsole.rescue();
     });
	QUnit.test("$Ajax.CONFIG 설정이 잘 적용되는가?",function(){
		$Ajax.CONFIG = {
			async : false,
			timeout: 5,
			method : "get"
		};

		var oAjax = new $Ajax('../data/ajax_test_json.txt');

			equal(oAjax.option('timeout'),5);
			ok(!oAjax.option('async'));

		$Ajax.CONFIG = null;
		delete $Ajax.CONFIG;
	});

	QUnit.test("$Ajax 동기지원이 잘 되는가?",function(){
		$Ajax.CONFIG = {
			async : false,
			timeout: 5,
			method : "get"
		};
		var oResult = null;
		var oAjax = new $Ajax('../data/ajax_test_json.txt',{
			onload :  function(res){
				oResult = res.json();
			},
			ontimeout : function(res){
				oResult = {};
			}
		});
		oAjax.request();
		notDeepEqual(oResult, null);
		$Ajax.CONFIG = null;
		delete $Ajax.CONFIG;
	});

	QUnit.test("isIdle이 정상적으로 작동해야 한다.",function(){
		var oAjax = new $Ajax('../data/ajax_test_json.txt',{
			async : false,
			onload :  function(res){
			},
			ontimeout : function(res){
			}
		});
		equal(oAjax._status,0);
		oAjax.request();
		equal(oAjax._status,0);

	});
	QUnit.test("request를 여러번 호출해도 정상적인가?",function(){
		$Ajax.CONFIG = {
			async : false,
			timeout: 5,
			method : "get"
		}

		var oResult = null;
		var oAjax = new $Ajax('../data/ajax_test_json.txt',{
			onload :  function(res){
				oResult = res.json();
			},
			ontimeout : function(res){
				oResult = {};
			}
		});
		oAjax.request();
		notDeepEqual(oResult, null);

		oResult = null;
		deepEqual(oResult, null);

		oAjax.request();
		notDeepEqual(oResult, null);

		$Ajax.CONFIG = null;
		delete $Ajax.CONFIG;

	});
	QUnit.test("request 후에 바로 abort하면 onerror이 작동하지 않아야 한다.",function(){

		var bAfterAbort = false;

		_isOnerrorExcute = false;
		//@see http://bts.nhncorp.com/nhnbts/browse/AJAXUI-208
		var oAjax = new $Ajax('../data/ajax_test_json.txt',{
			async : true,
			onload :  function(res){
			},
			onerror : function(res){
				if (bAfterAbort) {
					_isOnerrorExcute = true;
				}
			}
		});
		oAjax.request({});
		oAjax.abort();
		bAfterAbort = true;

		ok(!_isOnerrorExcute);
	});
	QUnit.test("위에 스펙과 연결된 spec",function(){
		ok(!_isOnerrorExcute);
	});
	QUnit.test("get방식일때 url에 null이 들어가면 안된다.",function(){
		var ajax = $Ajax("../data/ajax_test_json.txt",{
			method : "get",
			async : false,
			onload : function(){
			}
		});
		ajax.request();

		equal(ajax._test_url,"../data/ajax_test_json.txt");

	});
	QUnit.test("jsonp에서 url에 파라메터가 있으면 &이 들어가야 한다.",function(){
		var ajax = $Ajax("http://mixed.kr/etc/test.json?a=1",{
			type : "jsonp",
			callbackid : "test",
			onload : function(req){
			}
		});
		ajax.request({"b":1});
		equal(ajax._request._test_url,"http://mixed.kr/etc/test.json?a=1&_callback=window.__"+___jindoName+"_callback._test_0&b=1");
	});
//	QUnit.test("$Ajax는 get일 때 cache되면 안된다.",function(){
//		var beforeRequestString;
//		for(var i = 0; i < 5 ; i++){
//			$Ajax("cache_test.php",{
//				async : false,
//				type:"xhr",
//				method:"get",
//				onload : function(req){
//					ok(!req.json().param == beforeRequestString);
//					beforeRequestString = req.json().param;
//				}
//			}).request({param:0});
//		}
//	});
	QUnit.test("option설정은 정상적으로 되어야 한다.",function(){

		var oJsonp = new $Ajax('../data/ajax_test_json2.txt',{
			type : "jsonp",
			onload : function(){},
			onerror : function(){}
		});
		oJsonp.request();

		equal(oJsonp.option("jsonp_charset"),"utf-8");
		equal(oJsonp._request.option("jsonp_charset"),"utf-8");
		oJsonp.option("jsonp_charset","euc-kr");

		equal(oJsonp.option("jsonp_charset"),"euc-kr");
		equal(oJsonp._request.option("jsonp_charset"),"euc-kr");

		equal(oJsonp.option("callbackid"),"");
		equal(oJsonp._request.option("callbackid"),"");
		oJsonp.option("callbackid","test");
		equal(oJsonp.option("callbackid"),"test");
		equal(oJsonp._request.option("callbackid"),"test");

		equal(oJsonp.option("callbackname"),"_callback");
		equal(oJsonp._request.option("callbackname"),"_callback");
		oJsonp.option("callbackname","test");
		equal(oJsonp.option("callbackname"),"test");
		equal(oJsonp._request.option("callbackname"),"test");

	});
	QUnit.test("option함수를 아무것도 안넣고 호출하면 자신의 객체가 반환되어야 한다.",function(){
		var ajax = $Ajax("teste.json",{});
		var currentError = false;
		try{
			ajax.option();
		}catch(e){
			currentError = true;
		}
		ok(currentError);
	});
	QUnit.test("header 아무것도 안넣고 호출하면 자신의 객체가 반환되어야 한다.",function(){
		var ajax = $Ajax("../data/test.json",{});
		var currentError = false;
		try{
			ajax.header();
		}catch(e){
			currentError = true;
		}
		ok(currentError);
	});
	QUnit.test("바로 abort하면 interval객체는 undefined이 되어야 한다.",function(){
		var ajax = $Ajax("../data/test.json",{
			async : false,
            timeout: 2,
            onload: function() {
            },
            ontimeout: function() {
            }
		});

        ajax.request();
		ajax.abort();
		deepEqual(ajax._interval, undefined);
	}
);

module("$Ajax.Queue 객체", {
	setup: function() {
		$Ajax.CONFIG = {
			async : false,
			timeout: 5,
			method : "get"
		}
	},
	teardown: function() {
		$Ajax.CONFIG = null;
		delete $Ajax.CONFIG;
	}
});

	QUnit.test("$Ajax.Queue sync 호출이 잘 되는가?",function(){

		var result = [];

		var oAjax1 = new $Ajax('../data/ajax_test_json.txt',{
			onload :  function(res){
				result.push(1);
				return {foo:1};
			}
		});
		var oAjax2 = new $Ajax('../data/ajax_test_json.txt',{
			onload :  function(res){
				result.push(2);
				return {foo:2};
			}
		});
		var oAjax3 = new $Ajax('../data/ajax_test_json.txt',{
			onload :  function(res){
				result.push(3);
			}
		});

		var oAjaxQueue = new $Ajax.Queue({
			useResultAsParam : true
		});
		oAjaxQueue.add(oAjax1,{seq:1});
		oAjaxQueue.add(oAjax2,{seq:2,foo:99});
		oAjaxQueue.add(oAjax3,{seq:3});
		oAjaxQueue.request();

		deepEqual(result,[1,2,3]);

	});
//	QUnit.test("$Ajax.Queue sync 호출시 중간에 에러발생하면 잘 멈추는가?",function(){
//
//		var result = [];
//
//		var oAjax1 = new $Ajax('../data/ajax_test_json.txt',{
//			onload :  function(res){
//				result.push(1);
//				return {foo:1};
//			}
//		});
//		var oAjax2 = new $Ajax('../data/ajax_test_json2.txt',{
//			onload :  function(res){
//				result.push(2);
//				return {foo:2};
//			},
//			onerror : function(res){
//				result.push(22);
//			}
//		});
//		var oAjax3 = new $Ajax('../data/ajax_test_json.txt',{
//			onload :  function(res){
//				result.push(3);
//			}
//		});
//
//		var oAjaxQueue = new $Ajax.Queue({
//			useResultAsParam : true,
//			stopOnFailure : true
//		});
//		oAjaxQueue.add(oAjax1);
//		oAjaxQueue.add(oAjax2);
//		oAjaxQueue.add(oAjax3);
//		oAjaxQueue.request();
//
//		equal(result,[1,22]);
//
//	}
//	,
	QUnit.test("$Ajax.Queue async 호출이 잘 되는가?",function(){

		var result = [];

		var oAjax1 = new $Ajax('../data/ajax_test_json.txt',{
			onload :  function(res){
				result.push(1);
			}
		});
		var oAjax2 = new $Ajax('../data/ajax_test_json.txt',{
			onload :  function(res){
				result.push(2);
			}
		});
		var oAjax3 = new $Ajax('../data/ajax_test_json.txt',{
			onload :  function(res){
				result.push(3);
			}
		});

		var oAjaxQueue = new $Ajax.Queue({
			async : true
		});
		oAjaxQueue.add(oAjax1);
		oAjaxQueue.add(oAjax2);
		oAjaxQueue.add(oAjax3);
		oAjaxQueue.request();

		equal(result.length,3);
	});


module("New $Ajax", {
	setup: function() {
		__mockConsole.init();
		__mockConsole.reset();
	},
	teardown: function() {
		__mockConsole.rescue();
	}
});

	QUnit.test("jsonp일 때 get일 아닐경우 에러발생. ",function(){
		//Given
		//When
		jindo.$Ajax._validationOption({"method":"post","type":"jsonp"},"jsonp");
		//Then
		equal(__mockConsole.get(),"{{cannot_use_option}}\n\tjsonp-method=post");

		//Given
		__mockConsole.reset();
		//When
		jindo.$Ajax._validationOption({"method":"get","type":"jsonp"});
		//Then
		deepEqual(__mockConsole.get(), null);
	});

	QUnit.test("postBody옵션은 xhr이면서 get이 아닐 경우 사용할 수 있다.",function(){
		//Given
		//When
		jindo.$Ajax._validationOption({"postBody":true,"type":"xhr","method":"get"},"postBody");
		//Then
		equal(__mockConsole.get(),"{{cannot_use_option}}\n\tget-postBody=true");

		//Given
		__mockConsole.reset();
		//When
		jindo.$Ajax._validationOption({"postBody":true,"type":"xhr","method":"post"});
		//Then
		deepEqual(__mockConsole.get(), null);
	});
	QUnit.test("xhr에서 사용할 수 있는 옵션은 한정적이다.",function(){
		//Given
		var xhrOption = {
			"type":"xhr",
			"onload": function(){},
			"async": true,
			"sendheader": false
		}
		//When
		jindo.$Ajax._validationOption(xhrOption,"xhr");
		//Then
		equal(__mockConsole.get(),"{{cannot_use_option}}\n\txhr-sendheader");

		//Given
		delete xhrOption["sendheader"];
		__mockConsole.reset();
		//When
		jindo.$Ajax._validationOption(xhrOption);
		//Then
		deepEqual(__mockConsole.get(), null);
	});
	QUnit.test("jsonp에서 사용할 수 있는 옵션은 한정적이다.",function(){
		//Given
		var jsonpOption = {
			"type":"jsonp",
			"method":"get",
			"onload": function(){},
			"async": true,
			"jsonp_charset": "utf-8"
		}
		//When
		jindo.$Ajax._validationOption(jsonpOption,"jsonp");
		//Then
		equal(__mockConsole.get(),"{{cannot_use_option}}\n\tjsonp-async");

		//Given
		delete jsonpOption["async"];
		__mockConsole.reset();
		//When
		jindo.$Ajax._validationOption(jsonpOption);
		//Then
		deepEqual(__mockConsole.get(), null);
	});
	QUnit.test("jsonp에서 header메서드는 사용하지 못한다.",function(){
		//Given
		var jsonpOption = {
			"type":"jsonp",
			"method":"get",
			"onload": function(){},
			"jsonp_charset": "utf-8"
		}
		var ajax = jindo.$Ajax("test.html",jsonpOption);
		//When
		ajax.header({"Content-Type":"application/x-www-form-urlencoded; charset=utf-8", "charset":"utf-8"});
		//Then
		equal(__mockConsole.get(),"{{cannot_use_header}}");
	});
	QUnit.test("Should be changeable URL value using url() method",function(){
		//Given
		var ajax = $Ajax("test.json");
		//When
		ajax.url("test2.json");

		//Then
		deepEqual(ajax.url(),"test2.json");
	});

	QUnit.test("If browser doesn't support CORS, then exception should be thrown",function(){
		//Given
		var real = window.XMLHttpRequest,
			real2 = jindo.$Ajax.prototype._checkCORS;

		window.XMLHttpRequest = function(){};
		jindo.$Ajax.prototype._checkCORS = eval("("+ jindo.$Ajax.prototype._checkCORS.toString().replace("window.location.host", "\"test.com\"") +")");

		var occurException = false;

		//When
		try {
			jindo.$Ajax("http://naver.com", { type:"xhr" });
		} catch(e) {
			occurException = true;
		}

		//Then
		ok(occurException);

		window.XMLHttpRequest = real;
		jindo.$Ajax.prototype._checkCORS = real2;
	});

	QUnit.test("If browser support CORS, every test should be ok",function(){
		var real2 = jindo.$Ajax.prototype._checkCORS;
		jindo.$Ajax.prototype._checkCORS = eval("("+ jindo.$Ajax.prototype._checkCORS.toString().replace("window.location.host", "\"test.com\"") +")");

		//Given
		var occurException = false;

		//When
		try{
			var ajax = jindo.$Ajax("http://naver.com",{type:"xhr"});
		}catch(e){
			occurException = true;
		}

		//Then
		ok(!occurException);
		ok(ajax._bCORS);

		jindo.$Ajax.prototype._checkCORS = real2;
    });

    QUnit.test("Check for XHR2 FormData support",function(){
        if(window.FormData) {
			var oAjax = new $Ajax('../data/ajax_test_json.txt',{
			    method: "post",
				data: 123,
				onload :  function(res){}
			});

            deepEqual(__mockConsole.get(),"{{cannot_use_option}}\n\t$Ajax-data=123", "If 'data' option value set to non FormData object, then warning log must shown.");
            __mockConsole.reset();

            oAjax.option("data", new FormData());
		    deepEqual(__mockConsole.get(), null, "If 'data' option value set to FormData object, then any log must shown.");
        }
    });

    QUnit.asyncTest("Get native XHR object", function() {
        var bBlob = false;

        if(window.FormData) {
			var oAjax = new $Ajax('../data/ajax_test_json.txt',{
			    method: "post",
				onload :  function(res){
				    var oRes = res.$value().response;

				    if(bBlob) deepEqual(oRes.constructor, window.Blob, "the response should be Blob type");

                    QUnit.start();
				}
			});

            deepEqual(oAjax.$value().constructor, window.XMLHttpRequest, "should return native XHR object.");

            try {
                oAjax.$value().responseType = "blob";
                bBlob = true;
            } catch(e) {}

            oAjax.request();
        }
    });