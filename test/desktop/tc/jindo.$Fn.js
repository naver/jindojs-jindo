QUnit.config.autostart = false;

module("$Fn 의 this context");
	QUnit.test("attach",function(){
		//Given
		var that,i=0;
		var Test = {
			some:function(){
				i++;
				that = this;
			}
		}
		fpFn = $Fn(Test.some);
		fpFn.attach("div1","click");

		//When
		$Element("div1").fireEvent("click");

		//Then
		equal(that,fpFn);
		equal(i,1);

	}
);


module("$Fn 객체");
	QUnit.test("$Fn 객체가 만들어지는가?",function(){
		ok($Fn(function(){}) instanceof $Fn);
	});
	QUnit.test("$value : 원래의 값이 반환되는가?",function(){
		function f() {
		}

		equal($Fn(f).$value(),f);
	});
	QUnit.test("attach : 이벤트 추가시 gc.pool의 크기가 증가하는가?",function(){
		window.fcnt = 0;
		function f(event){ window.fcnt++; };
		var fn  = $Fn(f);

		fn.attach($('container'), 'click');
		equal(jindo.$Element.eventManager.getEventConfig($('container').__jindo__id).event.click.type["_jindo_event_none"].normal.length,1);
		$Element('container').fireEvent('click');
	});
	QUnit.test("attach : 이벤트 핸들러가 잘 수행되는가?",function(){
		equal(window.fcnt,1);
	});

	QUnit.test("delay execution : #1",function(){
		window.somevalue = 1;
		equal(window.somevalue,1);

		$Fn(function(a,b){window.somevalue = a+b;}).delay(0, [3,5]);
		equal(window.somevalue,1);
	});

	QUnit.asyncTest("delay execution : #2",function() {
	    window.somevalue = 0;

	    $Fn(function(a,b){
	        window.somevalue = a+b;
	        equal(window.somevalue,a+b);
		    QUnit.start();
        }).delay(0, [3,5]);

		equal(window.somevalue,0);
	});

	QUnit.test("usecapture은 정상적으로 적용이 되는가?[[!$Agent().navigator().ie]]",function(){
		var fn = $Fn(function(){});
		fn.attach('csscachetest',"click");
		ok(!fn._bUseCapture)

		var fn2 = $Fn(function(){});
		fn2.attach('csscachetest',"click",true);
		ok(fn2._bUseCapture)
	});
//	QUnit.test("firefox와 IE와 정상적이지 않음.setInterval : 반복실행1, 여기서는 실행안되어야 합니다",function(){
//		window.somevalue = 1;
//		equal(window.somevalue,1);
//
//		window.oFn = $Fn(function(a,b){window.somevalue += a+b}).setInterval(0, [3,5]);
//		equal(window.somevalue,1);
//	});
//	QUnit.test("setInterval : 반복실행2, 여기서는 실행됐었어야 합니다",function(){
//		ok(window.somevalue == 9);
//		clearInterval(window.oFn);
//		window.oldvalue = window.somevalue;
//	});
//	QUnit.test("clearInterval : 반복실행3, 여기서는 실행됐었어야 합니다",function(){
//		equal(window.somevalue,window.oldvalue);
//	});
	QUnit.test("$Fn는 string으로도 사용이 가능하다.",function(){
		var _scope = {
			i : 1,
			test : function(){
				return this.i;
			}
		}
		var fn = $Fn("_scope","return _scope.i");

		equal(fn.bind()(_scope),1);
	});
//	QUnit.test("bindForEvent에서 $A를 네이티브 array로 변경해도 정상 작동해야 한다.",function(){
//		function test(){
//			if (!arguments.length) {
//				console.log($A(arguments).$value());
//				equal($A(arguments).$value(),[]);
//				equal(Array.prototype.slice.apply(arguments),[]);
//			}else{
//				console.log($A(arguments).$value());
//				equal($A(arguments).$value(),[1,2]);
//				equal(Array.prototype.slice.apply(arguments),[1,2]);
//			}
//
//		}
//		test();
//		test(1,2);
//	},
//	QUnit.test("ipad나 iphone인 경우는 unload시 돔에 이벤트를 해제 하는 작업을 하면 cache가 안되어 unload이벤트를 할당 하면 안된다. ",function(){
//		var __real_ua = navigator.userAgent;
//		_ua = 'Mozilla/5.0 (iPhone; U; XXXXX like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/241 Safari/419.3';
//		ok(isUnCacheAgent());
//
//		_ua = 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; IPMS/930D0D0A-04A359770A0; TCO_20090615095913; InfoPath.2; .NET CLR 2.0.50727)';
//		ok(!isUnCacheAgent());
//
//		_ua = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.1) Gecko/2008070206 Firefox/3.0.1';
//		ok(!isUnCacheAgent());
//
//		_ua = __real_ua;
//	},
//	QUnit.test("unload 이벤트는 정상적으로 동작해야 한다.[[!$Agent().navigator().ie]]",function(){
//		var isExcuteUnLoad = false;
//		var isExcuteUnLoad2 = false;
//		var fp = $Fn(function(){
//			isExcuteUnLoad = true;
//		});
//		var fp2 = $Fn(function(){
//			isExcuteUnLoad2 = true;
//		});
//		fp.attach(window,"unload");
//		fp2.attach(window,"unload");
//		$Element(window).fireEvent("unload");
//
//		ok(isExcuteUnLoad);
//		ok(isExcuteUnLoad2);
//
//	},
//	QUnit.test("unload 이벤트는 정상적으로 동작해야 한다.[[!$Agent().navigator().ie]]",function(){
//		var isExcuteUnLoad = false;
//		var isExcuteUnLoad2 = false;
//		var fp = $Fn(function(){
//			isExcuteUnLoad = true;
//		});
//		var fp2 = $Fn(function(){
//			isExcuteUnLoad2 = true;
//		});
//		fp.attach(window,"unload");
//		fp2.attach(window,"unload");
//		$Element(window).fireEvent("unload");
//		ok(isExcuteUnLoad);
//		ok(isExcuteUnLoad2);
//
//	},
	QUnit.test("freeElement을 직접 호출할때는 호출되면 안된다.[[!$Agent().navigator().ie]]",function(){
		var isExcuteUnLoad = false;
		var isExcuteUnLoad2 = false;
		var fp = $Fn(function(){
			isExcuteUnLoad = true;
		});
		var fp2 = $Fn(function(){
			isExcuteUnLoad2 = true;
		});
		fp.attach(window,"unload");
		fp2.attach(window,"unload");

		jindo.$Element.eventManager.cleanUpUsingKey(window.__jindo__id,true);
		$Element(window).fireEvent("unload");
		ok(!isExcuteUnLoad);
		ok(!isExcuteUnLoad2);
	});

	QUnit.test("stopDelay는 정상적으로 동작해야 한다.",function(){
		var fpDelay = $Fn(function(){
		    ok(this);
			//value_of(this).should_fail("실행되면 안됨.");
		});
		fpDelay.delay(100,[1]);
		ok((typeof fpDelay._delayKey) != "undefined");


		fpDelay.stopDelay();
		ok((typeof fpDelay._delayKey) == "undefined");
	});

	QUnit.test("stopRepeat는 정상적으로 동작해야 한다.",function(){
		var fpRepeat = $Fn(function(){
			//value_of(this).should_fail("실행되면 안됨.");
			ok(this);
		});
		fpRepeat.repeat(100,[1]);
		ok((typeof fpRepeat._repeatKey) != "undefined");
		fpRepeat.stopRepeat();
		ok((typeof fpRepeat._repeatKey) == "undefined");

	});

	/* $Fn.attach/detach was deprecated.

	QUnit.test("attach을 안하고 detach를 한 경우 에러가 발생하면 안된다.",function(){
	    try {
	        $Fn(function(){}).detach($("multiClass"),"click");
	        ok(true);
	    } catch(e) {
	        ok(false);
	    }
	});
	QUnit.test("attach의 스코프는 정상적이어야 한다.",function(){
		var callCount = 0;
		var test = {
			"key" : "test",
			"scope" : function(){
				callCount++;
				equal(this.key, "test");
			}
		}
		var fn  = $Fn(test.scope,test);
		fn.attach($("scope_test_click"),"click");
		$Element("scope_test_click").fireEvent("click");
		ok(callCount == 1);
		fn.detach($("scope_test_click"),"click");
		$Element("scope_test_click").fireEvent("click");
		ok(callCount == 1);
	});
	*/

module("$Fn 객체 NEW API");
	QUnit.test("$Fn의 생성자는 문자이거나 함수여야 한다.[[(!$Agent().navigator().ie)||$Agent().navigator().version>6]]",function(){
		equal($Fn(true),null);
		equal($Fn({}),null);
	});
	QUnit.test("attach는 첫 번째 인자로 엘리먼트, 두 번째 인자로 문자가 들어가야 한다.",function(){
		//Given
		var occurException = false;
		//When
		try{
			$Fn(function(){}).attach()
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		var occurException = false;
		//When
		try{
			$Fn(function(){}).attach(true)
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		var occurException = false;
		//When
		try{
			$Fn(function(){}).attach({})
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		var occurException = false;
		//When
		try{
			$Fn(function(){}).attach(1)
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		var occurException = false;
		//When
		try{
			$Fn(function(){}).attach(null)
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		occurException = false;
		//When
		try{
			$Fn(function(){}).attach("escapetest",true);
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		occurException = false;
		//When
		try{
			$Fn(function(){}).attach("escapetest",1);
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		occurException = false;
		//When
		try{
			$Fn(function(){}).attach("escapetest",{});
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		occurException = false;
		//When
		try{
			$Fn(function(){}).attach("escapetest",null);
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);


		//첫 번째 인자
		//element,window,document
		//string - id,tag
		//$Element
		//Array
		//$A
		//두 번째 인자
		//string
	});
	QUnit.test("detach는 첫 번째 인자로 엘리먼트, 두 번째 인자로 문자가 들어가야 한다.",function(){
		//Given
		var occurException = false;
		//When
		try{
			$Fn(function(){}).detach()
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		var occurException = false;
		//When
		try{
			$Fn(function(){}).detach(true)
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		var occurException = false;
		//When
		try{
			$Fn(function(){}).detach({})
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		var occurException = false;
		//When
		try{
			$Fn(function(){}).detach(1)
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		var occurException = false;
		//When
		try{
			$Fn(function(){}).detach(null)
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		occurException = false;
		//When
		try{
			$Fn(function(){}).detach("escapetest",true);
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		occurException = false;
		//When
		try{
			$Fn(function(){}).detach("escapetest",1);
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		occurException = false;
		//When
		try{
			$Fn(function(){}).detach("escapetest",{});
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		occurException = false;
		//When
		try{
			$Fn(function(){}).detach("escapetest",null);
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);


		//첫 번째 인자
		//element,window,document
		//string - id,tag
		//$Element
		//Array
		//$A
		//두 번째 인자
		//string
	});
	QUnit.test("setInterval,repeat는 반환값이 인스턴스이다.",function(){
		//Given
		var fp = $Fn(function(){});
		//When
		//Then
		equal(fp.setInterval(10),fp);
		fp.stopRepeat();
	});
	QUnit.test("bind를 네이티브로 변경해도 정상적으로 작동한다.",function(){
	    //Given
	    var Some = {
	        "i" : 100
	    }
	    var val = 0;
	    var bindParam1 = 0;
	    var normalParam1 = 0;
	    var fp = $Fn(function(bindParam, normalParam){
	        val = this.i;
	        bindParam1 = bindParam;
	        normalParam1 = normalParam;
	    },Some);

	    //When
	    fp.bind(100)(100);

	    //Them
	    equal(val,100);
	    equal(bindParam1,100);
	    equal(normalParam1,100);

	}
);