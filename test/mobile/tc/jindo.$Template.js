QUnit.config.autostart = false;

module("$Template 객체");
	QUnit.test("process : 템플릿 처리 - 변수",function(){
		//equal($Template("template2-1").process({world:"MyWorld"}),"Hello, MyWorld.");
		equal($Template("template2-2").process({hi:"Hello",world:"MyWorld"}),"Hello, MyWorld.");
	});
	QUnit.test("process : 템플릿 처리 - 반복문",function(){
		equal($Template("template3-1").process({numbers:[1,2,3,4,5]}),"1!2!3!4!5!");
		equal($Template("template3-2").process({numbers:{"one":"one","two":"two","three":"three"}}),"one!two!three!");

		// 인덱스를 사용하는 반복문 - 객체
		equal($Template("template3-3").process({numbers:{"one":"1","two":"2","three":"3"}}),"one=1!two=2!three=3!");

		// 인덱스를 사용하는 반복문 - 빈 배열에 length 속성 지정했을 때, 인덱스를 참조할 수 있어야 함.
		equal($Template("template3-4").process({a:new Array(5)}),"01234");
	});
	QUnit.test("process : 템플릿 처리 - 조건문",function(){
		// 조건문
		equal($Template("template4-1").process({num:4}),"5보다 작다.");
		equal($Template("template4-1").process({num:6}),"");

		// 조건문
		equal($Template("template4-2").process({num:4}),"5보다 작다.");
		equal($Template("template4-2").process({num:6}),"5보다 작지 않다.");

		// 조건문
		equal($Template("template4-3").process({num:8}),"7보다 크다.");
		equal($Template("template4-3").process({num:4}),"5보다 작다.");
		equal($Template("template4-3").process({num:6}),"아마 6?");

		// 문자열 비교
		equal($Template("template4-4").process({engine:"Google"}),"구글");
		equal($Template("template4-4").process({engine:"Naver"}),"네이버");
		equal($Template("template4-4").process({engine:"Daum"}),"기타");
	});
	QUnit.test("Script 태그로도 여러가지 처리가 잘 되는가?",function(){
		// 단순 문자열
		equal($Template("template5-1").process(),"Hello, world.");

		// 변수
		equal($Template("template5-2").process({hi:"Hello",world:"MyWorld"}),"Hello, MyWorld.");

		// 반복문
		equal($Template("template5-3").process({numbers:{"one":"one","two":"two","three":"three"}}),"one!two!three!");

		// 인덱스를 사용하는 반복문 - 배열 - 20081216
		equal($Template("template5-5").process({numbers:[1,2,3]}),"0번째=1 1번째=2 2번째=3 ");

		// 조건문
		equal($Template("template5-4").process({engine:"Google"}),"구글");
	});
	QUnit.test("다중 루프 처리",function(){
		var data = [
			{
				title : 'Numbers 1',
				list  : [1,2,3,4]
			},
			{
				title : 'Numbers 2',
				list  : ['first', 'second', 'third']
			}
		];

		equal($Template("template6-1").process({data:data}),"Title:Numbers 1, Data:1 2 3 4 <br>Title:Numbers 2, Data:first second third <br>");
	});
	QUnit.test("배열일 경우 템플릿 인덱스를 숫자로 변환",function(){
		var data = [
			'Internet Explorer',
			'Firefox',
			'Safari',
			'Chrome'
		];

		equal($Template("{for i:browser in data}{=i+1}. {=browser}, {/for}").process({data:data}),"1. Internet Explorer, 2. Firefox, 3. Safari, 4. Chrome, ");
	});
	QUnit.test("for,if,set 등의 조건에서 홀따옴표 사용이 가능한가",function(){
		var data = [
			'Internet Explorer',
			'Firefox',
			'Safari',
			'Chrome'
		];

		equal($Template("{for i:browser in data}{if browser=='Chrome'}{=browser}{else}{=i+1}. {=browser}{/if}, {/for}").process({data:data}),"1. Internet Explorer, 2. Firefox, 3. Safari, Chrome, ");

		equal($Template("{for i:browser in data}{if browser=='Chrome'}{=browser}{elseif browser=='Firefox'}{=browser}{else}{=i+1}. {=browser}{/if}, {/for}").process({data:data}),"1. Internet Explorer, Firefox, 3. Safari, Chrome, ");
	});
	QUnit.test("null처리가 암됨.",function(){
		var tpl = $Template("{for site in potals}{if site.name == null}aaa{/if}{/for}");
		var data = {potals:[
			{ name : "네이버", url : "http://www.naver.com" },
			{ name : "다음", url : "http://www.daum.net" },
			{ name : null, url : "http://www.daum.net" },
			{ name : "야후", url : "http://www.yahoo.co.kr" }
		]};

		equal(tpl.process(data),"aaa");
	});
	QUnit.test("process를 넣은 오브젝트는 변형되면 안된다.",function(){
		var tpl = $Template("{for site in potals}{if site.name == null}aaa{/if}{/for}");
		var data = {potals:[
			{ name : "네이버", url : "http://www.naver.com" },
			{ name : "다음", url : "http://www.daum.net" },
			{ name : "한게임", url : "http://www.hangame.com" },
			{ name : "야후", url : "http://www.yahoo.co.kr" }
		]};
		tpl.process(data);

		deepEqual(data, {potals:[
			{ name : "네이버", url : "http://www.naver.com" },
			{ name : "다음", url : "http://www.daum.net" },
			{ name : "한게임", url : "http://www.hangame.com" },
			{ name : "야후", url : "http://www.yahoo.co.kr" }
		]});
	});
	QUnit.test("치환이 안된경우에도 정상작동해야 한다.",function(){
		var replace_data = $Template('<span class="cbox_nobar"><a href="#" onclick="">신고</a></span>').process({});
		ok(replace_data.constructor == String);
		equal(replace_data,'<span class="cbox_nobar"><a href="#" onclick="">신고</a></span>');
	});
	QUnit.test("키가 한문자 일때도 set은 정상적으로 사용도어야 한다.",function(){
		var tpl = $Template("{set b = (=a)}{=b}");
		equal(tpl.process({"a":1}),"1");
	});
	QUnit.test("http://devcode.nhncorp.com/projects/jindo/issue/3094 이슈 #1",function(){

		var str = "{if temp[0].bool} true {else} false {/if}";
		var data = {temp:[
			{bool:true, aa:"1"},
			{bool:false, aa:"2"}
		]};

		var tpl = $Template(str);
		var output = tpl.process(data);
		equal(output," true ");

	});

	QUnit.test("http://devcode.nhncorp.com/projects/jindo/issue/3094 이슈 #2",function(){

		var str = "{if temp.one.bool} true {else} false {/if}";
		var data = {temp:{
			one:{bool:true, aa:"1"},
			two:{bool:false, aa:"2"}
		}};

		var tpl = $Template(str);
		var output = tpl.process(data);
		equal(output," true ");

	});

	QUnit.test("http://devcode.nhncorp.com/projects/jindo/issue/3094 이슈 #3",function(){

		var str = "{set bb=(=temp[1]).bool}{=bb}";
		var data = {temp:[
			{bool:true, aa:"1"},
			{bool:false, aa:"2"}
		]};

		var tpl = $Template(str);
		var output = tpl.process(data);
		equal(output,"false");

	});

	QUnit.test("http://devcode.nhncorp.com/projects/jindo/issue/3094 이슈 #4",function(){

		var str = "{set bb=(=temp).one.bool}{=bb}";
		var data = {temp:{
			one:{bool:true, aa:"1"},
			two:{bool:false, aa:"2"}
		}};

		var tpl = $Template(str);
		var output = tpl.process(data);
		equal(output,"true");

	}

);

function JSFunction(a){return a+1;}
module("$Template New API");
	QUnit.test("gset메서드는 변수로 할당하여 사용할 수 있다.",function(){
		var tpl = $Template("{gset length=(=books).length}{for num:book in books}{js length}.{=book}\n{/for}").process({"books":[1,2,3]});
		equal(tpl,"3.1\n3.2\n3.3\n");
	});
	QUnit.test("gset 에 여러가지 타입을 할당해서 사용 할 수 있다.",function(){
		var tpl = $Template("{gset length=3}{for num:book in books}{js length}.{=book}\n{/for}").process({"books":[1,2,3]});
		equal(tpl,"3.1\n3.2\n3.3\n");

		var tpl = $Template("{gset str='hello \\n\"world'}{for num:book in books}{js str}.{=book}\n{/for}").process({"books":[1,2,3]});
		equal(tpl,"hello \n\"world.1\nhello \n\"world.2\nhello \n\"world.3\n");
	});
	QUnit.test("빈오브젝트 일때 정상적으로 동작해야함.",function(){

		var str = [];
		str.push("{set valueStr=1}");
		str.push("{js JSFunction(=valueStr)}");
		var tpl = $Template(str.join(""));

		equal(tpl.process(),"2");
	});
	QUnit.test("넘겨받은 값으로 함수 실행 가능해야함.",function(){

		var str = [];
		str.push("{for i:item in list}{js JSFunction(=item)}{/for}");
		var tpl = $Template(str.join(""));

		equal(tpl.process({ list : [ "world" ] }),"world1");
	}
);

module("$Template에 추가된 템플릿 엔진과 개선된 구조 테스트");
	QUnit.test("Micro-Templating 엔진을 사용할 수 있어야 한다.",function(){
		var data = { portals : [
			{ name: "네이버", url : "http://www.naver.com" },
			{ name: "다음",  url : "http://www.daum.net" },
			{ name: "야후",  url : "http://www.yahoo.co.kr" }
		]};
		var tpl = $Template("template7-1", "micro");
		var sResult = tpl.process(data);
		var sExpected = '<h1>MicroTemplate</h1><ul><li><a href="http://www.naver.com">네이버</a></li><li><a href="http://www.daum.net">다음</a></li><li><a href="http://www.yahoo.co.kr">야후</a></li></ul>';

		equal(sResult,sExpected);
	});

	QUnit.test("handlebars 엔진을 사용할 수 있어야 한다.",function(){
		var data = { portals : [
			{ name: "네이버", url : "http://www.naver.com" },
			{ name: "다음",  url : "http://www.daum.net" },
			{ name: "야후",  url : "http://www.yahoo.co.kr" }
		]};
		var tpl = $Template("template7-2", "handlebars");
		var sResult = tpl.process(data);
		var sExpected = '<h1>Handlebars</h1><ul><li><a href="http://www.naver.com">네이버</a></li><li><a href="http://www.daum.net">다음</a></li><li><a href="http://www.yahoo.co.kr">야후</a></li></ul>';

		equal(sResult,sExpected);
	});

	QUnit.test("simple 엔진을 사용할 수 있어야 한다.",function(){
		var data = {
			templateName : "Simple",
			url0 : "http://www.naver.com",
			url1 : "http://www.daum.net",
			url2 : "http://www.yahoo.co.kr",
			name0 : "네이버",
			name1 : "다음",
			name2 : "야후"
		}
		var tpl = $Template("template7-3", "handlebars");
		var sResult = tpl.process(data);
		var sExpected = '<h1>Simple</h1><ul><li><a href="http://www.naver.com">네이버</a></li><li><a href="http://www.daum.net">다음</a></li><li><a href="http://www.yahoo.co.kr">야후</a></li></ul>';

		equal(sResult,sExpected);
	});

	QUnit.test("사용자 정의 컴파일 엔진을 등록할 수 있어야 한다.",function(){
		var bExcept = false;
		try{
			jindo.$Template.addEngine("custom", function(sTemplate){
				return function(htData){
					return sTemplate.replace(/{=([^{}]*)}/g, function(a,b){
						return (typeof htData[b] == "undefined") ? "" : htData[b];
					});
				}
			});
		}catch(e){
			bExcept = true;
		}

		ok(!bExcept);
	});

	QUnit.test("사용자 정의 컴파일 엔진을 등록하고 사용할 수 있어야 한다.",function(){
		jindo.$Template.addEngine("custom", function(sTemplate){
			return function(htData){
				return sTemplate.replace(/{=([^{}]*)}/g, function(a,b){
					return (typeof htData[b] == "undefined") ? "" : htData[b];
				});
			}
		});
		var data = {
			templateName : "Custom",
			url0 : "http://www.naver.com",
			url1 : "http://www.daum.net",
			url2 : "http://www.yahoo.co.kr",
			name0 : "네이버",
			name1 : "다음",
			name2 : "야후"
		}
		var tpl = $Template("template7-4", "custom");
		var sResult = tpl.process(data);
		var sExpected = '<h1>Custom</h1><ul><li><a href="http://www.naver.com">네이버</a></li><li><a href="http://www.daum.net">다음</a></li><li><a href="http://www.yahoo.co.kr">야후</a></li></ul>';

		equal(sResult,sExpected);
	});

	QUnit.test("등록한 사용자 정의 컴파일 엔진을 반환 받을 수 있어야 한다.",function(){
		var fn = function(sTemplate){
			return function(htData){
				return sTemplate.replace(/{=([^{}]*)}/g, function(a,b){
					return (typeof htData[b] == "undefined") ? "" : htData[b];
				});
			}
		}
		jindo.$Template.addEngine("custom", fn);
		var fReturned = jindo.$Template.getEngine("custom");

		equal(fReturned,fn);
	});

	QUnit.test("'을 넣으면 에러남",function(){
	    //Given
	    var occurException = false;
	    //When
	    try{
	       jindo.$Template("'").process();
	    }catch(e){
	        occurException = true;
	    }

	    //Then
	    ok(!occurException)
	});
	QUnit.test("script 태그에 개행이 있어도 정상적으로 동작해야 한다.",function(){
	    //Given
        var occurException = false;
        //When
        try{
    	    $Template("cbox_tpl_comment").process()
        }catch(e){
            occurException = true;
        }
	    //Then
	    ok(!occurException)
	});

	QUnit.test("Output of nested variable should be work.",function(){
        var oTemplate = jindo.$Template("{set sShopListClass = (=htShopListClass[=item.aShop.length])} {=sShopListClass}"),
            oData = {
                htShopListClass: [ "a", "b", "c", "d" ],
                item : {
                    aShop: [1,2,3]
                }
            };


        ok(oTemplate.process(oData));
	});

	QUnit.test("Even contains escaped curly bracket should be work.",function(){
        var oTemplate = jindo.$Template('<button type="button" onclick="(function(el, obj) \{obj.stop();\}(this, obj)"><span>{=name}</span></button>'),
            oData = { name : "data" };


        ok(oTemplate.process(oData));
	});

	QUnit.test("When has a blank space after 'for' statement.",function(){
		//Given
		var oData = {
			"aItems" : [
				{"bHighlight":true,"sStartDay":"1","sStartTime":2,"sDebateTitle":3,"nReplayKind":4,"sLinkUrl":5},
				{"bHighlight":false,"sStartDay":"1","sStartTime":2,"sDebateTitle":3,"nReplayKind":4,"sLinkUrl":5},
				{"bHighlight":true,"sStartDay":"1","sStartTime":2,"sDebateTitle":3,"nReplayKind":4,"sLinkUrl":5},
				{"bHighlight":false,"sStartDay":"1","sStartTime":2,"sDebateTitle":3,"nReplayKind":4,"sLinkUrl":5}
			]
		};
		// When
		var template = "{for index : item in aItems}<span>{=item.sDebateTitle}</span>{/for}";
		var str = jindo.$Template(template).process(oData);
		// Then
		equal(str,"<span>3</span><span>3</span><span>3</span><span>3</span>");
	});

	QUnit.test("When has no character after 'for' statement.",function(){
		//Given
		var oData = {
			"aItems" : [
				{"bHighlight":true,"sStartDay":"1","sStartTime":2,"sDebateTitle":3,"nReplayKind":4,"sLinkUrl":5},
				{"bHighlight":false,"sStartDay":"1","sStartTime":2,"sDebateTitle":3,"nReplayKind":4,"sLinkUrl":5},
				{"bHighlight":true,"sStartDay":"1","sStartTime":2,"sDebateTitle":3,"nReplayKind":4,"sLinkUrl":5},
				{"bHighlight":false,"sStartDay":"1","sStartTime":2,"sDebateTitle":3,"nReplayKind":4,"sLinkUrl":5}
			]
		};
		// When
		var template = "{for index:item in aItems}<span>{=item.sDebateTitle}</span>{/for}";
		var str = jindo.$Template(template).process(oData);
		// Then
		equal(str,"<span>3</span><span>3</span><span>3</span><span>3</span>");
	});