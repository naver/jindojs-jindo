QUnit.config.autostart = false;

var ___namespace = location.href.match(/jindo=(\w*)/);
var ___jindoName = "jindo";
if(___namespace&&___namespace[1]){
    ___jindoName = ___namespace[1];
}

$Ajax.SWFRequest.prototype.send = function(data) {
	this.responseXML  = false;
	this.responseText = "";

	var t    = this;
	var dat  = {};
	var info = this._getCallbackInfo();
	var swf  = this._getFlashObj()

	function f(arg) {
		switch(typeof arg){
			case "string":
				return '"'+arg.replace(/\\/g, '\\\\').replace(/\"/g, '\\"')+'"';
				break;
			case "number":
				return arg;
				break;
			case "object":
				var ret = "", arr = [];
				if (jindo.$Jindo.isArray(arg)) {
					for(var i=0; i < arg.length; i++) {
						arr[i] = f(arg[i]);
					}
					ret = "["+arr.join(",")+"]";
				} else {
					for(var x in arg) {
						if(arg.hasOwnProperty(x)){
							arr[arr.length] = f(x)+":"+f(arg[x]);
						}
					}
					ret = "{"+arr.join(",")+"}";
				}
				return ret;
			default:
				return '""';
		}
	}

	data = (data || "").split("&");

	for(var i=0; i < data.length; i++) {
		pos = data[i].indexOf("=");
		key = data[i].substring(0,pos);
		val = decodeURIComponent(data[i].substring(pos+1));

		if(key in dat) {
			if(dat[key].constructor === Array) {
				dat[key].push(val);
			} else {
				dat[key] = [ dat[key], val ];
			}
		} else {
			dat[key] = val;
		}
	}
	this._current_callback_id = info.id
	window["__"+___jindoName+"_callback"][info.id] = function(success, data){
		try {
			t._callback(success, data);
		} finally {
			delete window["__"+___jindoName+"_callback"][info.id];
		}
	};

	var oData = {
		url  : this._url,
		type : this._method,
		data : dat,
		charset  : "UTF-8",
		callback : info.name,
		header_json : this._headers
	};

	f(oData);

	window.__f = f;
	window.__oData = oData;
}


var _isOnerrorExcute = false;


module("$Ajax Object");

		QUnit.test("Check for basic $Ajax options setting",function(){
		    // Given
            __mockConsole.init();
            __mockConsole.reset();
            // When
			var oAjax = new $Ajax('ajax_test_json.txt',{
			    "type" : "post",
			    "async" : true
			});
			// Then
			deepEqual(__mockConsole.get(), null);
			__mockConsole.rescue();
		});

		QUnit.test("Setting up $Ajax.CONFIG value is applied without any problem?",function(){
			$Ajax.CONFIG = {
				async : false,
				timeout: 5,
				method : "get"
			}

			var oAjax = new $Ajax('../data/ajax_test_json.txt');

				deepEqual(oAjax.option('timeout'),5);
				ok(!oAjax.option('async'));

			$Ajax.CONFIG = null;
			delete $Ajax.CONFIG;
		});

		QUnit.test("$Ajax 동기지원이 잘 되는가?",function(){
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
			deepEqual(oAjax._status,0);
			oAjax.request();
			deepEqual(oAjax._status,0);

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
		QUnit.test("ajax의 오브젝트 끼리 _headers,_respHeaders이 공유 되지 말아야한다.",function(){
			//@see http://devcode.nhncorp.com/projects/jindo/issue?func=detail&aid=1337&group_id=243&atid=453&brow=all&start=0

			var oFlash = new $Ajax('http://localhost/devcode_jindo/trunk/Sources/TestCase/ajax_test_json.txt',{
				type : "flash",
				sendheader : true,
				onload : function(){},
				onerror : function(){}
			});
			oFlash.request();

			deepEqual(oFlash._request._headers,{"Content-Type":"application/x-www-form-urlencoded; charset=utf-8", "charset":"utf-8", "X-Requested-With":"XMLHttpRequest"});
			deepEqual(oFlash._request._respHeaders,{});

			deepEqual(__f("\\\"").replace(/^\"|\"$/g,"").split(""), ["\\", "\\", "\\", "\"" ], "Escaped string values have to return as escaped.");

			var oJsonp = new $Ajax('../data/ajax_test_json2.txt',{
				type : "jsonp",
				jsonp_charset : "UTF-8",
				onload : function(){},
				onerror : function(){}
			});

			oJsonp.request();

			deepEqual(oJsonp._request._headers,{});
			deepEqual(oJsonp._request._respHeaders,{});

			deepEqual(oFlash._request._headers,{"Content-Type":"application/x-www-form-urlencoded; charset=utf-8", "charset":"utf-8", "X-Requested-With":"XMLHttpRequest"});
			deepEqual(oFlash._request._respHeaders,{});


		});
		QUnit.test("get방식일때 url에 null이 들어가면 안된다.",function(){
			var ajax = $Ajax("../data/ajax_test_json.txt",{
				method : "get",
				async : false,
				onload : function(){
				}
			});
			ajax.request();
				deepEqual(ajax._test_url,"../data/ajax_test_json.txt");

		});
	QUnit.test("jsonp에서 url에 파라메터가 있으면 &이 들어가야 한다.",function(){
		var ajax = $Ajax("http://mixed.kr/etc/test.json?a=1",{
			type : "jsonp",
			callbackid : "test",
			onload : function(req){
			}
		});
		ajax.request({"b":1});
		deepEqual(ajax._request._test_url,"http://mixed.kr/etc/test.json?a=1&_callback=window.__"+___jindoName+"_callback._test_0&b=1");
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
		var oFlash = new $Ajax('http://localhost/devcode_jindo/trunk/Sources/TestCase/ajax_test_json.txt',{
			type : "flash",
			sendheader : false,
			onload : function(){},
			onerror : function(){}
		});
		ok(oFlash.option("decode"));
		oFlash.option("decode",false);
		ok(!oFlash.option("decode"));
		ok(!oFlash._request.option("decode"));

		oFlash.option("decode",true);
		ok(oFlash.option("decode"));
		ok(oFlash._request.option("decode"));




		var oJsonp = new $Ajax('../data/ajax_test_json2.txt',{
			type : "jsonp",
			onload : function(){},
			onerror : function(){}
		});
		oJsonp.request();

		deepEqual(oJsonp.option("jsonp_charset"),"utf-8");
		deepEqual(oJsonp._request.option("jsonp_charset"),"utf-8");
		oJsonp.option("jsonp_charset","euc-kr");

		deepEqual(oJsonp.option("jsonp_charset"),"euc-kr");
		deepEqual(oJsonp._request.option("jsonp_charset"),"euc-kr");

		deepEqual(oJsonp.option("callbackid"),"");
		deepEqual(oJsonp._request.option("callbackid"),"");
		oJsonp.option("callbackid","test");
		deepEqual(oJsonp.option("callbackid"),"test");
		deepEqual(oJsonp._request.option("callbackid"),"test");

		deepEqual(oJsonp.option("callbackname"),"_callback");
		deepEqual(oJsonp._request.option("callbackname"),"_callback");
		oJsonp.option("callbackname","test");
		deepEqual(oJsonp.option("callbackname"),"test");
		deepEqual(oJsonp._request.option("callbackname"),"test");


		var oIFrame = new $Ajax('ajax_test_json2.txt',{
			type : "iframe",
			onload : function(){}
		});

		deepEqual(oIFrame.option("proxy"),"");
		deepEqual(oIFrame._request.option("proxy"),"");
		oIFrame.option("proxy","a.html");
		deepEqual(oIFrame.option("proxy"),"a.html");
		deepEqual(oIFrame._request.option("proxy"),"a.html");
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
	});


module("$Ajax.Queue 객체", {
    setup: function(){
        $Ajax.CONFIG = {
            async : false,
            timeout: 5,
            method : "get"
        }
    },
    teardown: function(){
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
//		var oAjax1 = new $Ajax('ajax_test_json.txt',{
//			onload :  function(res){
//				result.push(1);
//				return {foo:1};
//			}
//		});
//		var oAjax2 = new $Ajax('ajax_test_json2.txt',{
//			onload :  function(res){
//				result.push(2);
//				return {foo:2};
//			},
//			onerror : function(res){
//				result.push(22);
//			}
//		});
//		var oAjax3 = new $Ajax('ajax_test_json.txt',{
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
//		deepEqual(result,[1,22]);
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

			deepEqual(result.length,3);
		});



module("New $Ajax", {
	setup: function(){
		__mockConsole.init();
		__mockConsole.reset();
    },
    teardown: function(){
		__mockConsole.rescue();
	}
});

	QUnit.test("jsonp일 때 get일 아닐경우 에러발생. ",function(){
		//Given
		//When
		jindo.$Ajax._validationOption({"method":"post","type":"jsonp"},"jsonp");
		//Then
		deepEqual(__mockConsole.get(),"{{cannot_use_option}}\n\tjsonp-method=post");

		//Given
		__mockConsole.reset();
		//When
		jindo.$Ajax._validationOption({"method":"get","type":"jsonp"});
		//Then
		deepEqual(__mockConsole.get(), null);
	});
	QUnit.test("flash일 때 get이나 post가 아닐경우 에러발생. ",function(){
		//Given
		//When
		jindo.$Ajax._validationOption({"method":"delete","type":"flash"},"flash");
		//Then
		deepEqual(__mockConsole.get(),"{{cannot_use_option}}\n\tflash-method=delete");

		//Given
		__mockConsole.reset();
		//When
		jindo.$Ajax._validationOption({"method":"get","type":"flash"});
		//Then
		deepEqual(__mockConsole.get(), null);
	});
	QUnit.test("postBody옵션은 xhr이면서 get이 아닐 경우 사용할 수 있다.",function(){
		//Given
		//When
		jindo.$Ajax._validationOption({"postBody":true,"type":"xhr","method":"get"},"postBody");
		//Then
		deepEqual(__mockConsole.get(),"{{cannot_use_option}}\n\tget-postBody=true");

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
		deepEqual(__mockConsole.get(),"{{cannot_use_option}}\n\txhr-sendheader");

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
		deepEqual(__mockConsole.get(),"{{cannot_use_option}}\n\tjsonp-async");

		//Given
		delete jsonpOption["async"];
		__mockConsole.reset();
		//When
		jindo.$Ajax._validationOption(jsonpOption);
		//Then
		deepEqual(__mockConsole.get(), null);
	});
	QUnit.test("flash에서 사용할 수 있는 옵션은 한정적이다.",function(){
		//Given
		var flashOption = {
			"type":"flash",
			"method":"get",
			"onload": function(){},
			"async": true,
			"sendheader": true
		}
		//When
		jindo.$Ajax._validationOption(flashOption,"flash");
		//Then
		deepEqual(__mockConsole.get(),"{{cannot_use_option}}\n\tflash-async");

		//Given
		delete flashOption["async"];
		__mockConsole.reset();
		//When
		jindo.$Ajax._validationOption(flashOption);
		//Then
		deepEqual(__mockConsole.get(), null);
	});
	QUnit.test("iframe에서 사용할 수 있는 옵션은 한정적이다.",function(){
		//Given
		var iframeOption = {
			"type":"iframe",
			"method":"get",
			"onload": function(){},
			"async": true
		}
		//When
		jindo.$Ajax._validationOption(iframeOption,"iframe");
		//Then
		deepEqual(__mockConsole.get(),"{{cannot_use_option}}\n\tiframe-async");

		//Given
		delete iframeOption["async"];
		__mockConsole.reset();
		//When
		jindo.$Ajax._validationOption(iframeOption);
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
		deepEqual(__mockConsole.get(),"{{cannot_use_header}}");
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
			real2 = jindo.$Ajax.prototype._checkCORSUrl;

		window.XMLHttpRequest = function(){};
		jindo.$Ajax.prototype._checkCORSUrl = function(sUrl) { return true; }

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
		jindo.$Ajax.prototype._checkCORSUrl = real2;
   	});

    QUnit.test("If browser support CORS, every test should be ok",function(){
        //Given
        var occurException = false;
        var real2 = jindo.$Ajax.prototype._checkCORSUrl;
        jindo.$Ajax.prototype._checkCORSUrl = function(sUrl) { return true; }


        //When
        try{
            var ajax = jindo.$Ajax("http://naver.com",{ type:"xhr" });
        }catch(e){
            occurException = true;
        }

        //Then
        ok(!occurException);
        ok(ajax._bCORS);

        jindo.$Ajax.prototype._checkCORSUrl = real2;
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

	QUnit.test("", function() {
		var paramData = {
			imageListPathList: ["some1.png", "some2.png", "some3.png" ]
		};

		new $Ajax('../data/ajax_test_json.txt',{
			type : 'flash',
			method : 'get',
			onload : function(res){}
		}).request(paramData);

		deepEqual(paramData, window.__oData.data, "Should have array value.");
	});