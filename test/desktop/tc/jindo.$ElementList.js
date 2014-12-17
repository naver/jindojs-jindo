QUnit.config.autostart = false;

module("$ElementList 객체");
	QUnit.test("$ElementList 객체가 만들어지는가?",function(){
		var emlist = $ElementList(['para_a','para_b','para_c']);
		equal(emlist.constructor,$ElementList);
		var emlist2 = $ElementList(emlist);
		equal(emlist,emlist2);
	});
	QUnit.test("생성자에는 배열,문자,$A,undefined,null만 들어갈 수 있다.[[(!$Agent().navigator().ie)||($Agent().navigator().version>6)]]",function(){
		equal($ElementList({}),null);
		equal($ElementList($("para_a")),null);
		equal($ElementList(123),null);
		equal($ElementList(true),null);
		equal($ElementList(function(){}),null);
	});
/*	QUnit.test("$init : cssquery 문자열을 잘 받아들이는지?",function(){
	});*/
	QUnit.test("get, getFirst, getLast : 엘리먼트는 잘 반환하십니까?",function(){
		var emlist = $ElementList(['el_test1','el_test2','el_test3','el_test4']);
		equal(emlist.get(1).$value(),$("el_test2"));
		equal(emlist.getFirst().$value(),$("el_test1"));
		equal(emlist.getLast().$value(),$("el_test4"));
	});
	QUnit.test("show : 화면에 나타나도록 한다",function(){
		var emlist = $ElementList(['el_test1','el_test2','el_test3','el_test4']);
		emlist.show();
		for(var i=0; i<emlist._elements.length; i++)
		{
			equal(emlist.get(i).visible(),true);
		}
	});
	QUnit.test("hide : 화면에서 사라지도록 한다",function(){
		var emlist = $ElementList(['el_test1','el_test2','el_test3','el_test4']);
		emlist.hide();
		for(var i=0; i<emlist._elements.length; i++)
		{
			equal(emlist.get(i).visible(),false);
		}
	});
	QUnit.test("toggle : 표시하거나 사라지도록 한다",function(){
		var emlist = $ElementList(['el_test1','el_test2','el_test3','el_test4']);
		emlist.toggle();
		for(var i=0; i<emlist._elements.length; i++)
		{
			equal(emlist.get(i).visible(),true);
		}
	});
/*	QUnit.test("appear : 자연스럽게 나타낸다",function(){
	});
	QUnit.test("disappear : 자연스럽게 사라지게 한다",function(){
	});*/
	QUnit.test("attr : 속성값을 가져오거나 설정하거나 제거한다",function(){
		var elm = $Element("attrTest1");

		// get attribute
		equal(elm.attr("custom"),"value");

		// set attribute
		elm.attr("custom", "newvalue");
		equal(elm.attr("custom"),"newvalue");

		// remove attribute
		elm.attr("custom", null);
		equal(elm.attr("custom"),null);
	});
/*	QUnit.test("css : CSS값을 설정한다",function(){
	});
	QUnit.test("offset : 문서 최상단으로부터의 위치를 설정한다",function(){
	});
	QUnit.test("width : px 단위의 실제 너비를 설정한다.",function(){
	});
	QUnit.test("height : px 단위의 실제 높이를 설정한다.",function(){
	});
	QUnit.test("text : 객체의 내부 text 문자열을 설정한다.",function(){
	});
	QUnit.test("html : 객체의 내부 html 문자열을 설정한다",function(){
	});
	QUnit.test("className : 클래스 이름을 설정한다.",function(){
	});*/
	QUnit.test("addClass : 클래스 이름을 추가한다.",function(){
		var emlist = $ElementList(['el_test1','el_test2','el_test3','el_test4']);
		emlist.addClass("test");
		for(var i=0; i<emlist._elements.length; i++)
		{
			equal(emlist.get(i).hasClass("test"),true);
		}
	});
	QUnit.test("removeClass : 클래스 이름을 제거한다.",function(){
		var emlist = $ElementList(['el_test1','el_test2','el_test3','el_test4']);
		emlist.addClass("test");
		emlist.removeClass("test");
		for(var i=0; i<emlist._elements.length; i++)
		{
			equal(emlist.get(i).hasClass("test"),false);
		}
	});
/*	QUnit.test("toggleClass : 클래스를 토글한다. 제거한다.",function(){
	});
	QUnit.test("fireEvent : 주어진 이벤트를 실행한다.",function(){
	});
	QUnit.test("leave : 현재 객체들을 부모 노드로부터 제거한다.",function(){
	});*/
	QUnit.test("length는 $A의 length를 이용한다.",function(){
		var emlist = $ElementList(['el_test1','el_test2','el_test3','el_test4']);
		equal(emlist.length(),4);
		// equal(emlist.length(2).length(),$A([$Element("el_test1"),$Element("el_test1")]).length());
	});
	QUnit.test("$value는 $Element가 들어있는 배열을 확인한다.",function(){
		var cssquery_test = $ElementList("#element_list_value_test .test").$value();
		equal(cssquery_test.length,3);
		ok(cssquery_test.constructor == Array);

		var cssquery_test = $ElementList($$("#element_list_value_test .test")).$value();
		equal(cssquery_test.length,3);
		ok(cssquery_test.constructor == Array);

		var cssquery_test = $ElementList().$value();
		equal(cssquery_test.length,0);
		ok(cssquery_test.constructor == Array);
	});
	QUnit.test("$ElementList을 하면 밖에 엘리먼트는 변경되지 않아야 한다.",function(){
		var array = $A(["escapetest","escapetest"]);
		var wrapArray = $ElementList(array);
		deepEqual(array.$value(),["escapetest","escapetest"]);

	}
);