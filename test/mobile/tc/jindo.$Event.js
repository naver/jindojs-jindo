QUnit.config.autostart = false;

module("$Event");
	QUnit.test("$value는 원래 자신의 event를 반환한다.",function(){
		var realEle;
		$Fn(function(e){
			realEle = e;
		}).attach($("eventtest"),"click");

		$Element("eventtest").fireEvent("click");
		equal(realEle._event,realEle.$value());
	});
	QUnit.test("dommousescroll, DOMContentLoaded을 할당하면 mousewheel, domready로 할당되어야 한다.",function(){
		var wEvent1 = $Event({
			"type" : "dommousescroll",
			"target" : document,
			"currentTarget" : document
		});
		equal(wEvent1.type,"mousewheel");

		var wEvent2 = $Event({
			"type" : "DOMContentLoaded",
			"target" : document,
			"currentTarget" : document
		});
		equal(wEvent2.type,"domready");

	});
	QUnit.test("mouse메소스 확인",function(){
		//firefox에서 왼쪽 클릭.
		var wEvent1 = $Event({
			"type" : "dommousescroll",
			"target" : document,
			"currentTarget" : document,
			"which" : 1,
			"button" : 0,
			"detail" : 1
		});

		deepEqual({ delta : -1/3 }, wEvent1.mouse());
	});
	QUnit.test("pos는 정상적으로 작동해야 한다.",function(){
		var wEvent1 = $Event({
			"type" : "dommousescroll",
			"target" : document,
			"currentTarget" : document,
			"which" : 1,
			"button" : 0,
			"detail" : 1,
			"clientX" : 10,
			"clientY" : 10,
			"pageX" : 10,
			"pageY" : 10,
			"offsetX" : 10,
			"offsetY" : 10
		});

		deepEqual(wEvent1.pos(), {
			"clientX" : 10,
			"clientY" : 10,
			"pageX" : 10,
			"pageY" : 10
        });
	});
	QUnit.test("stop은 정상적으로 작동하는가?",function(){
		var checkPreventDefault = false;
		var checkStopPropagation = false;
		var wEvent1 = $Event({
			"type" : "dommousescroll",
			"target" : $("spec_0"),
			"currentTarget" : $("spec_0"),
			"which" : 1,
			"button" : 0,
			"detail" : 1,
			"clientX" : 10,
			"clientY" : 10,
			"pageX" : 10,
			"pageY" : 10,
			"offsetX" : 10,
			"offsetY" : 10,
			"preventDefault" : function(){
				checkPreventDefault = true;
			},
			"stopPropagation" : function(){
				checkStopPropagation = true;
			},
			"returnValue" : true,
			"cancelBubble" : false
		});
		wEvent1.stop();
		ok(checkPreventDefault);
		ok(checkStopPropagation);
	});
	QUnit.test("stopDefault은 잘동작하는가?",function(){
		var checkPreventDefault = false;
		var checkStopPropagation = false;
		var wEvent1 = $Event({
			"type" : "dommousescroll",
			"target" : $("spec_0"),
			"currentTarget" : $("spec_0"),
			"which" : 1,
			"button" : 0,
			"detail" : 1,
			"clientX" : 10,
			"clientY" : 10,
			"pageX" : 10,
			"pageY" : 10,
			"offsetX" : 10,
			"offsetY" : 10,
			"preventDefault" : function(){
				checkPreventDefault = true;
			},
			"stopPropagation" : function(){
				checkStopPropagation = true;
			},
			"returnValue" : true,
			"cancelBubble" : false
		});
		wEvent1.stopDefault();
		ok(checkPreventDefault);
		ok(!checkStopPropagation);
	});
	QUnit.test("stopBubble은 잘동작하는가?",function(){
		var checkPreventDefault = false;
		var checkStopPropagation = false;
		var wEvent1 = $Event({
			"type" : "dommousescroll",
			"target" : $("spec_0"),
			"currentTarget" : $("spec_0"),
			"which" : 1,
			"button" : 0,
			"detail" : 1,
			"clientX" : 10,
			"clientY" : 10,
			"pageX" : 10,
			"pageY" : 10,
			"offsetX" : 10,
			"offsetY" : 10,
			"preventDefault" : function(){
				checkPreventDefault = true;
			},
			"stopPropagation" : function(){
				checkStopPropagation = true;
			},
			"returnValue" : true,
			"cancelBubble" : false
		});
		wEvent1.stopBubble();
		ok(!checkPreventDefault);
		ok(checkStopPropagation);
	});
	QUnit.test("changedTouch, targetTouch을 실행하면 에러가 발생하면 안된다.",function(){
		var wEvent1 = $Event({
			"type" : "touchstart",
			"target" : $("spec_0"),
			"currentTarget" : $("spec_0"),
			"changedTouches" : []
		});

		var occurException = false;
		try{
			wEvent1.changedTouch();
		}catch(e){
			occurException = true;
		}
		ok(!occurException);
	});
	QUnit.test("hook은 정상적으로 셋팅/반환한다.",function(){
        //Given
        //When
        jindo.$Event.hook("test","Test");

        //Then
        equal(jindo.$Event.hook("test"),"Test");

        //Given
        //When
        jindo.$Event.hook("test",function(){return "Test"});

        //Then
        equal(jindo.$Event.hook("test")(),"Test");

        //Given
        //When
        jindo.$Event.hook({
            "test1":function(){
                return "Test1";
             },
            "test2":"Test2"
        });

        //Then
        equal(jindo.$Event.hook("test1")(),"Test1");
        equal(jindo.$Event.hook("test2"),"Test2");

    });
    QUnit.test("hook은 정상적으로 삭제한다.",function(){
        //Given
        //When
        jindo.$Event.hook("test",null);
        jindo.$Event.hook("test1",null);
        jindo.$Event.hook("test2",null);

        //Then
        ok(!jindo.$Event.hook("test"));
        ok(!jindo.$Event.hook("test1"));
        ok(!jindo.$Event.hook("test2"));
    });