QUnit.config.autostart = false;

module("$S 객체");
	QUnit.test("잘 만들어집니까?",function(){
		ok($S() instanceof $S);
//		ok($S({a:1,b:2}) instanceof $S);
		ok($S($S()) instanceof $S);
	});
	QUnit.test("잘 만들어집니까?2",function(){
		ok($S(null) instanceof $S);
		equal($S(null).$value(),"");
		ok($S(undefined) instanceof $S);
		equal($S(undefined).$value(),"");
		ok($S(1) instanceof $S);
		equal($S(1).$value(),"1");
		ok($S("2") instanceof $S);
		equal($S("2").$value(),"2");
		ok($S(true) instanceof $S);
		equal($S(true).$value(),"true");
		ok($S({}) instanceof $S);
		equal($S({}).$value(),"[object Object]");
	});
	QUnit.test("toString : 문자열은 잘 반환하는지?",function(){
		equal($S("AAA")+"","AAA");
	});
	QUnit.test("escapeHTML : HTML 문자열로 변환",function(){
		equal($S('<a href="http://naver.com">Naver<\/a>').escapeHTML(),'&lt;a href=&quot;http://naver.com&quot;&gt;Naver&lt;/a&gt;');
		equal($S('<a href="http://hangame.com">\'Hangame\'<\/a>').escapeHTML(),'&lt;a href=&quot;http://hangame.com&quot;&gt;&#39;Hangame&#39;&lt;/a&gt;');
	});
	QUnit.test("unescapeHTML : HTML 엔티티를 일반 문자로 변환",function(){
		equal($S('&lt;a href=&quot;http://naver.com&quot;&gt;Naver&lt;/a&gt;').unescapeHTML(),'<a href="http://naver.com">Naver</a>');
		equal($S('&lt;a href=&quot;http://hangame.com&quot;&gt;&#39;Hangame&#39;&lt;/a&gt;').unescapeHTML(),'<a href="http://hangame.com">\'Hangame\'<\/a>');
	});
	QUnit.test("stripTags : 태그 제거",function(){
		equal($S('<a href="http://naver.com">Naver<\/a>').stripTags(),'Naver');
	});
	QUnit.test("times : 문자열 반복",function(){
		equal($S("a").times(5).toString(),"aaaaa");
		equal($S("Abc").times(3).toString(),"AbcAbcAbc");
	});
	QUnit.test("escape : 문자열 이스케이프 처리",function(){
		equal($S("가\"'나\\").escape(),"\\uAC00\\\"\\'\\uB098\\\\");
	});
	QUnit.test("bytes : 바이트 수",function(){
		equal($S("한글입니다.").bytes(),16);
		equal($S("fantastic하고 elegance한 즈으인도~").bytes(),41);

		// 2바이트 유니코드(그리스어) 포함해서 바이트 수 계산
		equal($S("διακριτικός 그리스어다!").bytes(),39); // 그리스어 11*2, 한국어 3*5, ASCII 1*2

		// 바이트 수로 문자열 자르기
		equal($S("한글입니다.").bytes(15).toString(),"한글입니다");
		equal($S("한글입니다.").bytes(16).toString(),"한글입니다.");
		equal($S("한글입니다.").bytes(17).toString(),"한글입니다.");

		// 바이트 수로 문자열 자르기(2바이트 유니코드 - 그리스어 - 포함)
		equal($S("διακριτικός 그리스어다!").bytes(29).toString(),"διακριτικός 그리");
		equal($S("διακριτικός 그리스어다!").bytes(30).toString(),"διακριτικός 그리");
		equal($S("διακριτικός 그리스어다!").bytes(31).toString(),"διακριτικός 그리");
		equal($S("διακριτικός 그리스어다!").bytes(32).toString(),"διακριτικός 그리스");
	});
	QUnit.test("bytes : 바이트 수(파라메터로 object가 있을때)",function(){
		equal($S("한글입니다.").bytes(),16);
		equal($S("한글입니다.").bytes({charset:"euc-kr"}),11);
		equal($S("fantastic하고 elegance한 즈으인도~").bytes(),41);
		equal($S("fantastic하고 elegance한 즈으인도~").bytes({charset:"euc-kr"}),34);

		equal($S("διακριτικός 그리스어다!").bytes(),39); // 그리스어 11*2, 한국어 3*5, ASCII 1*2
		equal($S("διακριτικός 그리스어다!").bytes({charset:"euc-kr"}),34); // 그리스어,한국어 2*16, ASCII 1*2

		equal($S("한글입니다.").bytes(15).toString(),"한글입니다");
		equal($S("한글입니다.").bytes(16).toString(),"한글입니다.");
		equal($S("한글입니다.").bytes(17).toString(),"한글입니다.");
		equal($S("한글입니다.").bytes({charset:"euc-kr",size:10}).toString(),"한글입니다");
		equal($S("한글입니다.").bytes({charset:"euc-kr",size:11}).toString(),"한글입니다.");
		equal($S("한글입니다.").bytes({charset:"euc-kr",size:12}).toString(),"한글입니다.");

		equal($S("διακριτικός 그리스어다!").bytes(29).toString(),"διακριτικός 그리");
		equal($S("διακριτικός 그리스어다!").bytes(30).toString(),"διακριτικός 그리");
		equal($S("διακριτικός 그리스어다!").bytes(31).toString(),"διακριτικός 그리");
		equal($S("διακριτικός 그리스어다!").bytes(32).toString(),"διακριτικός 그리스");

		equal($S("διακριτικός 그리스어다!").bytes({charset:"euc-kr",size:27}).toString(),"διακριτικός 그리");
		equal($S("διακριτικός 그리스어다!").bytes({charset:"euc-kr",size:28}).toString(),"διακριτικός 그리");
		equal($S("διακριτικός 그리스어다!").bytes({charset:"euc-kr",size:29}).toString(),"διακριτικός 그리스");

	});
	QUnit.test("format : 형식 문자열 반환",function(){
		equal($S("%4d년 %02d월 %02d일").format(2008, 2, 13).toString(),"2008년 02월 13일");
		// 오른쪽 정렬
		equal($S("패딩 %5s 빈공백").format("값").toString(),"패딩     값 빈공백");
		// 왼쪽 정렬
		equal($S("패딩 % -5s 빈공백").format("값").toString(),"패딩 값     빈공백");
		// 2진수
		equal($S("%b").format(10).toString(),"1010");
		// 8진수
		equal($S("%o").format(10).toString(),"12");
		// 16진수 소문자
		equal($S("%x").format(10).toString(),"a");
		// 16진수 대문자
		equal($S("%X").format(10).toString(),"A");
	});
	QUnit.test("parseString : URL 쿼리 문자열을 해석",function(){
		var str = "aa=first&bb=second"

		deepEqual($S(str).parseString(),{aa:"first",bb:"second"});
		deepEqual($S("").parseString(),{});
		deepEqual($S().parseString(),{});

	});
	QUnit.test("escapeRegex : 정규식에 대해 이스케이프",function(){
		var str = "{abc}\n[Ajax]|!^";
		equal($S(str).escapeRegex().toString(),"\\{abc\\}\n\\[Ajax\\]\\|\\!\\^");
	});
	QUnit.test("parseString : URL 쿼리 문자열을 해석 escape문자도 정상 작동해야 한다.",function(){
		var str = "aa=first&bb=%uC804"
		deepEqual($S(str).parseString(),{aa:"first",bb:"%uC804"});
	});
	QUnit.test("byte에 대소문자를 가리지 않는다.",function(){
		equal($S("διακριτικός 그리스어다!").bytes({charset:"UTF-8",size:32}).toString(),"διακριτικός 그리스");
		equal($S("διακριτικός 그리스어다!").bytes({charset:"UTF-8",size:29}).toString(),"διακριτικός 그리");
		equal($S("διακριτικός 그리스어다!").bytes({charset:"utf-8",size:32}).toString(),"διακριτικός 그리스");
		equal($S("διακριτικός 그리스어다!").bytes({charset:"utf-8",size:29}).toString(),"διακριτικός 그리");
	});
	QUnit.test("전각 공백도 제거되어야 한다.　",function(){
		deepEqual($S(" 　　trim　　 ").trim().$value(),"trim")
	});
	QUnit.test("|이 있어도 제거 되면 안된다.",function(){
		deepEqual($S(" 　　||||　　 ").trim().$value(),"||||")
	});
	QUnit.test("trim : 양쪽 공백은 잘 없애는지?",function(){
		equal($S("A AA ").trim().toString(),"A AA");
		equal($S("  A AA").trim().toString(),"A AA");
		equal($S(" A b c     ").trim().toString(),"A b c");
	});