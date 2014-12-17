QUnit.config.autostart = false;

//-- $ --
module("$");
	QUnit.test("엘리먼트 생성",function(){
		var o = $('<div>');
		equal(o.tagName.toUpperCase(),'DIV');

		var o = $('<tr>');
		equal(o.tagName.toUpperCase(),'TR');

		// opera10.53에서는 td에 class를 넣어서 생성하지 못함.td로 쌓여 있거나 class가 없어야 함.
		var o = $('<td class=\"hello\">');
		equal(o.className,'hello');

		var o = $('<td>hello</td><td>world</td>');
		equal(o[0].innerHTML,'hello');
		equal(o[1].innerHTML,'world');

	});
	QUnit.test("$의 마지막 인자로 document 받을수 있게 하기.",function(){
		equal($$(".test",$("getid_insert_test").contentWindow.document).length,1);
		$Element($("getid_insert_test").contentWindow.document.body).append($("<div class='test'></div>",$("getid_insert_test").contentWindow.document));
		equal($$("div",$("getid_insert_test").contentWindow.document).length,2);

		equal($$(".testtest").length,0);

		$Element(document.body).append($("<div class='testtest'></div>"));
		equal($$(".testtest").length,1);
	});
	QUnit.test("빈공간이 있어도 정상적으로 작동해야 한다.",function(){
		equal($(" <div>").tagName.toLowerCase(),"div");
	});
	QUnit.test("colgroup도 정상적으로 셋티되어야 한다.",function(){
		deepEqual($("<COL>").tagName.toLowerCase(),"col")
	});
	QUnit.test("아무것도 넣지 않으면 exception이 발생되어야 한다.",function(){
		var occurException = false;
		try {
			$();
		}catch(e){
			occurException = true;
		}
		ok(occurException)
	});
	QUnit.test("id는 숫자여도 상관없이 작동한다.",function(){
		//Given
		//When
		var ele = $("1234");
		//Then
		ok(jindo.$Jindo.isElement(ele));

	});
	QUnit.test("HTML주석이 있어도 정상적으로 엘리먼트가 반환되어야 한다.",function(){
		var div = $("<!--a--><div></div>");
		var bool = Boolean(div);
		ok(bool);

		div = $("<div></div><!--a-->");
		bool = Boolean(div);
		ok(bool);

		div = $("<div><!--a--></div>");
		bool = Boolean(div);
		ok(bool);

		div = $("<div>\n<!--\nfdafa\t\nfdafdsa\n--></div>");
		bool = Boolean(div);
		ok(bool);

		div = $("<!--a--><div>\n<!--\nfdafa\t\nfdafdsa\n--></div><!--a-->");
		bool = Boolean(div);
		ok(bool);
	});
	QUnit.test("source엘리먼트는 정상적으로 생성되어야 한다.",function(){
        //Given
        //When
        var source = $("<source></source>");
        //Then
        equal(source.tagName.toLowerCase(),"source");
    });


//-- $Jindo --
module("$Jindo");
	QUnit.test("$Jindo : 객체가 만들어지는가?",function(){
		ok($Jindo() instanceof $Jindo);
	});
	QUnit.test("version : 버전 정보를 포함하고 있나?",function(){
		equal(typeof jindo.VERSION,"string");
	});
	QUnit.test("jindo.$Jindo.isObject는 object일때 true을 반환한다.",function(){
		ok($Jindo.isHash({}));
		ok(!$Jindo.isHash([]));
		ok(!$Jindo.isHash(""));
		ok(!$Jindo.isHash(1));
		ok(!$Jindo.isHash(true));
		ok(!$Jindo.isHash(null));
		ok(!$Jindo.isHash());
		ok(!$Jindo.isHash(function(){}));
		ok(!$Jindo.isHash(document));
		ok(!$Jindo.isHash($("escapetest")));
	});
	QUnit.test("jindo.$Jindo.isFunction는 function일때 true을 반환한다.",function(){
		ok($Jindo.isFunction(function(){}));
		ok(!$Jindo.isFunction([]));
		ok(!$Jindo.isFunction({}));
		ok(!$Jindo.isFunction(""));
		ok(!$Jindo.isFunction(1));
		ok(!$Jindo.isFunction(true));
		ok(!$Jindo.isFunction(null));
		ok(!$Jindo.isFunction());
		ok(!$Jindo.isFunction(document));
		ok(!$Jindo.isFunction($("escapetest")));
	});
	QUnit.test("jindo.$Jindo.isArray는 array일때 true을 반환한다.",function(){
		ok($Jindo.isArray([]));
		ok(!$Jindo.isArray({}));
		ok(!$Jindo.isArray(""));
		ok(!$Jindo.isArray(1));
		ok(!$Jindo.isArray(true));
		ok(!$Jindo.isArray(null));
		ok(!$Jindo.isArray());
		ok(!$Jindo.isArray(function(){}));
		ok(!$Jindo.isArray(document));
		ok(!$Jindo.isArray($("escapetest")));
	});
	QUnit.test("jindo.$Jindo.isString는 String일때 true을 반환한다.",function(){
		ok($Jindo.isString(""));
		ok(!$Jindo.isString([]));
		ok(!$Jindo.isString({}));
		ok(!$Jindo.isString(1));
		ok(!$Jindo.isString(true));
		ok(!$Jindo.isString(null));
		ok(!$Jindo.isString());
		ok(!$Jindo.isString(function(){}));
		ok(!$Jindo.isString(document));
		ok(!$Jindo.isString($("escapetest")));
	});
	QUnit.test("jindo.$Jindo.isNumeric는 Number일때 true을 반환한다.",function(){
		ok($Jindo.isNumeric(1));
		ok(!$Jindo.isNumeric(""));
		ok(!$Jindo.isNumeric([]));
		ok(!$Jindo.isNumeric([1]));
		ok(!$Jindo.isNumeric({}));
		ok(!$Jindo.isNumeric(true));
		ok(!$Jindo.isNumeric(null));
		ok(!$Jindo.isNumeric());
		ok(!$Jindo.isNumeric(function(){}));
		ok(!$Jindo.isNumeric(document));
		ok(!$Jindo.isNumeric($("escapetest")));
	});
	QUnit.test("jindo.$Jindo.isBoolean는 Boolean일때 true을 반환한다.",function(){
		ok($Jindo.isBoolean(true));
		ok(!$Jindo.isBoolean(1));
		ok(!$Jindo.isBoolean(""));
		ok(!$Jindo.isBoolean([]));
		ok(!$Jindo.isBoolean({}));
		ok(!$Jindo.isBoolean(null));
		ok(!$Jindo.isBoolean());
		ok(!$Jindo.isBoolean(function(){}));
		ok(!$Jindo.isBoolean(document));
		ok(!$Jindo.isBoolean($("escapetest")));
	});
	QUnit.test("jindo.$Jindo.isNull는 Null일때 true을 반환한다.",function(){
		ok($Jindo.isNull(null));
		ok(!$Jindo.isNull(1));
		ok(!$Jindo.isNull(""));
		ok(!$Jindo.isNull([]));
		ok(!$Jindo.isNull({}));
		ok(!$Jindo.isNull(true));
		ok(!$Jindo.isNull());
		ok(!$Jindo.isNull(function(){}));
		ok(!$Jindo.isNull(document));
		ok(!$Jindo.isNull($("escapetest")));
	});
	QUnit.test("jindo.$Jindo.isUndefined는 Undefiend일때 true을 반환한다.",function(){
		ok($Jindo.isUndefined());
		ok(!$Jindo.isUndefined(1));
		ok(!$Jindo.isUndefined(""));
		ok(!$Jindo.isUndefined([]));
		ok(!$Jindo.isUndefined({}));
		ok(!$Jindo.isUndefined(true));
		ok(!$Jindo.isUndefined(null));
		ok(!$Jindo.isUndefined(function(){}));
		ok(!$Jindo.isUndefined(document));
		ok(!$Jindo.isUndefined($("escapetest")));
	});
	QUnit.test("jindo.$Jindo.isElement는 Element일때 true을 반환한다.",function(){
		ok($Jindo.isElement($("escapetest")));
		ok(!$Jindo.isElement(document));
		ok(!$Jindo.isElement());
		ok(!$Jindo.isElement(1));
		ok(!$Jindo.isElement(""));
		ok(!$Jindo.isElement([]));
		ok(!$Jindo.isElement({}));
		ok(!$Jindo.isElement(true));
		ok(!$Jindo.isElement(null));
		ok(!$Jindo.isElement(function(){}));
	});
	QUnit.test("jindo.$Jindo.isDocument는 Document일때 true을 반환한다.",function(){
		ok($Jindo.isDocument(document));
		ok(!$Jindo.isDocument($("escapetest")));
		ok(!$Jindo.isDocument());
		ok(!$Jindo.isDocument(1));
		ok(!$Jindo.isDocument(""));
		ok(!$Jindo.isDocument([]));
		ok(!$Jindo.isDocument({}));
		ok(!$Jindo.isDocument(true));
		ok(!$Jindo.isDocument(null));
		ok(!$Jindo.isDocument(function(){}));
	});
	QUnit.test("jindo.$Jindo.isDate는 Date일때 true을 반환한다.",function(){
		ok($Jindo.isDate(new Date));
		ok(!$Jindo.isDate($("escapetest")));
		ok(!$Jindo.isDate());
		ok(!$Jindo.isDate(1));
		ok(!$Jindo.isDate(""));
		ok(!$Jindo.isDate([]));
		ok(!$Jindo.isDate({}));
		ok(!$Jindo.isDate(true));
		ok(!$Jindo.isDate(null));
		ok(!$Jindo.isDate(function(){}));
	});
	QUnit.test("jindo.$Jindo.isRegExp는 RegExp일때 true을 반환한다.",function(){
		ok($Jindo.isRegExp(new RegExp));
		ok(!$Jindo.isRegExp($("escapetest")));
		ok(!$Jindo.isRegExp());
		ok(!$Jindo.isRegExp(1));
		ok(!$Jindo.isRegExp(""));
		ok(!$Jindo.isRegExp([]));
		ok(!$Jindo.isRegExp({}));
		ok(!$Jindo.isRegExp(true));
		ok(!$Jindo.isRegExp(null));
		ok(!$Jindo.isRegExp(function(){}));
	});
    QUnit.test("jindo.$Jindo.mixin(A,B)는 A에 B의 속성/메서드가 복사된다. ",function(){
        //Given
        var oDestination = {"foo":"1","test":function(){}};
        var oSource = {"bar":"1","test2":function(){}};

        //When
        var oResult = jindo.$Jindo.mixin(oDestination, oSource);

        //Then
        equal(oResult.foo,"1");
        equal(oResult.bar,"1");
        ok(jindo.$Jindo.isFunction(oResult.test));
        ok(jindo.$Jindo.isFunction(oResult.test2));
    });
    QUnit.test("jindo.$Jindo.mixin(A,B)에서 A와 B는 오브젝트만 가능하다. ",function(){
        //Given
        var occurredException = false;
        try{
        //When
            jindo.$Jindo.mixin({}, 1);
        }catch(e){
            occurredException =  true
        }
        //Then
        ok(occurredException);

        //Given
        occurredException = false;
        try{
        //When
            jindo.$Jindo.mixin({}, true);
        }catch(e){
            occurredException =  true
        }
        //Then
        ok(occurredException);

        //Given
        occurredException = false;
        try{
        //When
            jindo.$Jindo.mixin(1, {});
        }catch(e){
            occurredException =  true
        }
        //Then
        ok(occurredException);

        //Given
        occurredException = false;
        try{
        //When
            jindo.$Jindo.mixin(true, {});
        }catch(e){
            occurredException =  true
        }
        //Then
        ok(occurredException);
    });
    QUnit.test("jindo.$Jindo.mixin(A,B)의 반환 값은 새로운 객체다.",function(){
        //Given
        var oDestination = {"foo":"1","test":function(){}};
        var oSource = {"bar":"1","test2":function(){}};

        //When
        var oResult = jindo.$Jindo.mixin(oDestination, oSource);

        //Then
        notDeepEqual(oDestination,oResult);
    });
    QUnit.test("jindo.$Jindo.mixin(A,B)에서 B의 값중 오브젝트가 있을때 복사하지 않는다.",function(){
        //Given
        var oDestination = {"foo":"1","test":function(){}};
        var oSource = {"bar":"1","test2":function(){},"obj":{}};

        //When
        var oResult = jindo.$Jindo.mixin(oDestination, oSource);

        //Then
        deepEqual(oResult.obj, undefined);
    });
    QUnit.test("각 군의 addExtension메서드는 정상적으로 등록해야 된다",function(){
        //Given
        var aClass = [
            "$Agent","$Ajax","$A","$Cookie","$Date","$Document","$Element","$ElementList",
            "$Event","$Form","$Fn","$H","$Json","$S","$Template"
        ];

        try{
            $A(aClass).forEach(function(v){
               //When
               var type = typeof jindo[v].addExtension;

               //Then
               equal(type,"function");
            });

        }catch(e){
            console.log(e.stack)
        }
    });
    QUnit.test("addExtension에서 메서드를 중복 등록했을 때 경고가 발생해야 한다.",function(){
        //Given
        __mockConsole.init();
        var aClass = [
            "$Agent","$Ajax","$A","$Cookie","$Date","$Document","$Element","$ElementList",
            "$Event","$Form","$Fn","$H","$Json","$S","$Template"
        ];
        $A(aClass).forEach(function(v){
            //When
            jindo[v].addExtension("xCustom",function(){});
            jindo[v].addExtension("xCustom",function(){});
            //Then
            equal(__mockConsole.msg,v+".xCustom was overwrite.");

            __mockConsole.reset();
        });

        __mockConsole.rescue();
    });
    QUnit.test("addExtension에서 메서드가 x접두어를 가지고 있지 않으면 경고가 발생해야 한다.",function(){
        //Given
        __mockConsole.init();
        var aClass = [
            "$Agent","$Ajax","$A","$Cookie","$Date","$Document","$Element","$ElementList",
            "$Event","$Form","$Fn","$H","$Json","$S","$Template"
        ];
        $A(aClass).forEach(function(v){
            //When
            jindo[v].addExtension("custom",function(){});
            //Then
            equal(__mockConsole.msg,"The Extension Method("+v+".custom) must be used with x prefix.");

            __mockConsole.reset();
        });

        __mockConsole.rescue();
    });



//-- $Jindo.checkVarType --
var check_params = function(oArgs) {};

function test_func_1() {
	var oArgs = $Jindo.checkVarType(arguments, {
		'GETTER' : [ 'sKey:String' ],
		'SETTER_STR' : [ 'sKey:String', 'sVal:String' ],
		'SETTER_NUM' : [ 'sKey:String', 'nVal:Numeric' ],
		'SETTER_OBJ' : [ 'oList:Hash' ],
		'VARIANT' : [ 'vFoo:Variant', 'vBar:Variant+', 'vBaz:Variant' ]
	},"test_func_1");
	check_params(oArgs);
}

function test_func_2() {
	var oArgs = $Jindo.checkVarType(arguments, {
		'STRING' : [ '_foo:String+', '_bar:$S+' ],
		'ARRAY' : [ '_foo:Array+', '_bar:$A+' ],
		'ELEMENT' : [ '_foo:Element+', '_bar:$Element+' ],
		'DOCUMENT' : [ '_foo:Document+', '_bar:$Document+' ],
		'FUNCTION' : [ '_foo:Function+', '_bar:$Fn+' ],
		'DATE' : [ '_foo:Date+', '_bar:$Date+' ],
		'ELEMENTLIST' : [ '_foo:$ElementList+' ],
   		'OBJECT' : [ '_foo:Hash+', '_bar:$H+' ]
	},"test_func_2");
	check_params(oArgs);
}

function createErrorMessage(sUsed, aSuggs, sURL) {

	var aMsg = [ '{{invalid_param_message}}', '' ];

	if (sUsed) {
		aMsg.push('{{invalid_param_called}} :');
		aMsg.push('\t' + sUsed);
		aMsg.push('');
	}

	if (aSuggs.length) {
		aMsg.push('{{invalid_param_suggest}} :');
		for (var i = 0, nLen = aSuggs.length; i < nLen; i++) {
			aMsg.push('\t' + aSuggs[i]);
		}
		aMsg.push('');
	}

	if (sURL) {
		aMsg.push('{{invalid_param_manual}} :');
		aMsg.push('\t' + sURL);
		aMsg.push('');
	}

	aMsg.unshift();

	return aMsg.join('\n');

}

var sConsole = '';

if (typeof console == 'undefined') { console = {}; }
var _old_warn = console.warn;

function replaceConsole() {
	console.warn = function(s) { sConsole = s; };
}

function restoreConsole() {
	console.warn = _old_warn;
}

module("$Jindo.checkVarType 기본 테스트", {
    setup: function() {
        replaceConsole();
    },
    teardown: function() {
        restoreConsole();
    }
});

	QUnit.test("$Jindo.checkVarType 함수가 있는가.",function(){
		ok($Jindo.checkVarType instanceof Function);
	});
	QUnit.test("$Jindo.checkVarType 파라미터 확인 실패 테스트",function(){

		var func_sugg = [
			'test_func_1(String)',
			'test_func_1(String, String)',
			'test_func_1(String, Numeric)',
			'test_func_1(Hash)',
			'test_func_1(Variant, Variant+, Variant)'
		];

		try {
			test_func_1();
			equal("이 부분은 실행되면 안됩니다",true);
		} catch(e) {
			ok(e instanceof TypeError);
			equal(e.message,createErrorMessage('test_func_1()', func_sugg));
		}

		try {
			test_func_1('display', {});
			equal("이 부분은 실행되면 안됩니다",true);
		} catch(e) {
			ok(e instanceof TypeError);
			equal(e.message,createErrorMessage('test_func_1(String, Hash)', func_sugg));
		}

		try {
			test_func_1('display', new Date());
			equal("이 부분은 실행되면 안됩니다",true);
		} catch(e) {
			ok(e instanceof TypeError);
			equal(e.message,createErrorMessage('test_func_1(String, Date)', func_sugg));
		}

	});
	QUnit.test("$Jindo.checkVarType 함수명을 지정한 경우 테스트",function(){

		function foo() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'STRING' : [ 'str:String+', 'val:String+' ],
				'NUMBER' : [ 'str:String+', 'val:Numeric' ],
				'BOOLEAN' : [ 'str:String+', 'val:Boolean' ],
				'OBJECT' : [ 'list:Hash+' ]
			}, '$Element#css');
		}

		var func_sugg = [
 			'$Element#css(String+, String+)',
 			'$Element#css(String+, Numeric)',
 			'$Element#css(String+, Boolean)',
 			'$Element#css(Hash+)'
 		];

		try {
			foo('hello');
			equal("이 부분은 실행되면 안됩니다",true);
		} catch(e) {
			ok(e instanceof TypeError);
			equal(e.message,createErrorMessage('$Element#css(String)', func_sugg, '@docurl@%24Element.html#method_css'));
		}

	});
	QUnit.test("$Jindo.checkVarType 파라미터 확인 성공 테스트",function(){

		check_params = function(oArgs) {
			equal(oArgs,'GETTER');
			equal(oArgs.sKey,'display');
		};

		test_func_1('display');
		////////////////////////////////////////////////

		check_params = function(oArgs) {
			equal(oArgs,'SETTER_STR');
			equal(oArgs.sKey,'display');
			equal(oArgs.sVal,'none');
		};

		test_func_1('display', 'none');
		////////////////////////////////////////////////

		check_params = function(oArgs) {
			equal(oArgs,'SETTER_NUM');
			equal(oArgs.sKey,'width');
			equal(oArgs.nVal,300);
		};
		test_func_1('width', 300);

		////////////////////////////////////////////////

		check_params = function(oArgs) {
			equal(oArgs,'SETTER_OBJ');
			equal(oArgs.oList.display,'none');
			equal(oArgs.oList.width,300);
		};

		test_func_1({
			'display' : 'none',
			'width' : 300
		});
		////////////////////////////////////////////////

		check_params = function(oArgs) {
			equal(oArgs,'VARIANT');
			equal(oArgs.vFoo,'none');
			equal(oArgs.vBar,300);
			equal(oArgs.vBaz,true);
		};

		sConsole = ''; test_func_1('none', 300, true); equal(sConsole,'');
		sConsole = ''; test_func_1('none', 300, true, function() {}); notDeepEqual(sConsole,"");
		sConsole = ''; test_func_1('none', 300, true, function() {}, [ ]); notDeepEqual(sConsole,"");
		////////////////////////////////////////////////

	});
	QUnit.test("$Jindo.checkVarType 자동형변환 확인.",function(){

		var type, foo, bar;

		check_params = function(oArgs) {
			equal(oArgs,type);
			equal(oArgs._foo,foo.$value());
			ok(oArgs._bar instanceof foo.constructor);
			deepEqual(oArgs._bar.$value(),bar);
		};

		////////////////////////////////////////////////

		type = 'STRING';
		foo = $S('hello');
		bar = 'world';

		test_func_2(foo, bar);
		////////////////////////////////////////////////

		type = 'ARRAY';
		foo = $A([ 1, 2, 3 ]);
		bar = [ 10, 20, 30 ];

		test_func_2(foo, bar);
		////////////////////////////////////////////////

		type = 'ELEMENT';
		foo = $Element(document.body);
		bar = document.body;

		test_func_2(foo, bar);
		////////////////////////////////////////////////

		type = 'FUNCTION';
		foo = $Fn(function() {});
		bar = function() {};

		test_func_2(foo, bar);
		////////////////////////////////////////////////

		type = 'DOCUMENT';
		foo = $Document(document);
		bar = document;

		test_func_2(foo, bar);
		////////////////////////////////////////////////

		type = 'OBJECT';
		foo = $H({ one : 1 });
		bar = { two : 2 };

		test_func_2(foo, bar);
		////////////////////////////////////////////////

		type = 'DATE';
		foo = $Date(new Date());
		bar = new Date();

		test_func_2(foo, bar);
		////////////////////////////////////////////////

		check_params = function(oArgs) {
			equal(oArgs,type);
			ok(oArgs._foo instanceof $ElementList);
			deepEqual(oArgs._foo.$value(),foo);
		};

		type = 'ELEMENTLIST';
		foo = [ $Element(document.body) ];

		test_func_2(foo);
		////////////////////////////////////////////////

	});
	QUnit.test("$Jindo.varType 사용한 성공/실패 테스트.",function(){

		$Jindo.varType('hello', function(v, bAutoCast) {
			if (v === 'hello') { return v; }
			return jindo.$Jindo.VARTYPE_NOT_MATCHED;
		});

		$Jindo.varType('world', function(v, bAutoCast) {
			if (v === 'world') { return v; }
			if (bAutoCast && v === 'WORLD') { return v.toLowerCase(); }
			return jindo.$Jindo.VARTYPE_NOT_MATCHED;
		});

		var test = function(oArgs) { };

		var func = function() {
			var oArgs = $Jindo.checkVarType(arguments, {
				HELLO : [ 'sKey:hello', 'sVal:world+' ]
			});

			test(oArgs);
		};

		test = function(oArgs) {
			equal(oArgs.sKey,'hello');
			equal(oArgs.sVal,'world');
		};

		func('hello', 'world');
		func('hello', 'WORLD');

		///////////////////////

		try {
			func('HELLO', 'foo');
			equal('실행되면 안되는 구문','실행됨');
		} catch(e) {
			ok(e instanceof TypeError);
			ok(!!'기대대로 예외 발생');
		}

		try {
			func('hello', 'foo');
			equal('실행되면 안되는 구문','실행됨');
		} catch(e) {
			ok(e instanceof TypeError);
			ok(!!'기대대로 예외 발생');
		}

	});
	QUnit.test("$Jindo.varType 존재하지 않는 타입에 대한 테스트.",function(){

		var func = function() {
			var oArgs = $Jindo.checkVarType(arguments, {
				HELLO : [ 'sKey:notexist', 'sVal:notexist+' ]
			});
		};

		try {
			func('HELLO', 'foo');
			equal('실행되면 안되는 구문','실행됨');
		} catch(e) {
			ok(e instanceof Error);
			ok(!!'기대대로 예외 발생');
		}
	});

module("$Jindo.checkVarType 타입별 테스트", {
    setup: function() {
        replaceConsole();
    },
    teardown: function(){
        restoreConsole();
    }
});

	QUnit.test("$Jindo.checkVarType - void 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : []
			});
			equal(oArgs,'rule');
			ok(!('val' in oArgs));
		}

		fpTypeCheck();
		sConsole = ''; fpTypeCheck(undefined); notDeepEqual(sConsole,"");
		sConsole = ''; fpTypeCheck(null); notDeepEqual(sConsole,"");
		sConsole = ''; fpTypeCheck(false); notDeepEqual(sConsole,"");

		sConsole = ''; fpTypeCheck('STR'); notDeepEqual(sConsole,"");
		sConsole = ''; fpTypeCheck({}); notDeepEqual(sConsole,"");
		sConsole = ''; fpTypeCheck([]); notDeepEqual(sConsole,"");
		sConsole = ''; fpTypeCheck(document.body); notDeepEqual(sConsole,"");
		sConsole = ''; fpTypeCheck(window); notDeepEqual(sConsole,"");
		sConsole = ''; fpTypeCheck(document); notDeepEqual(sConsole,"");
		sConsole = ''; fpTypeCheck(function() {}); notDeepEqual(sConsole,"");
		sConsole = ''; fpTypeCheck(new Date()); notDeepEqual(sConsole,"");
		sConsole = ''; fpTypeCheck(/reg/); notDeepEqual(sConsole,"");
		sConsole = ''; fpTypeCheck(0); notDeepEqual(sConsole,"");

		sConsole = ''; fpTypeCheck($S('STR')); notDeepEqual(sConsole,"");
		sConsole = ''; fpTypeCheck($H({})); notDeepEqual(sConsole,"");
		sConsole = ''; fpTypeCheck($A([])); notDeepEqual(sConsole,"");
		sConsole = ''; fpTypeCheck($Element(document.body)); notDeepEqual(sConsole,"");
		sConsole = ''; fpTypeCheck($Document(document)); notDeepEqual(sConsole,"");
		sConsole = ''; fpTypeCheck($Fn(function() {})); notDeepEqual(sConsole,"");
		sConsole = ''; fpTypeCheck($Date(new Date())); notDeepEqual(sConsole,"");

	});
	QUnit.test("$Jindo.checkVarType - Undefined 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:Undefined' ]
			});
			equal(oArgs,'rule');
			ok($Jindo.isUndefined(oArgs.val));
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck(undefined);
		sConsole = ''; fpTypeCheck(undefined, 123); notDeepEqual(sConsole,"");
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - Null 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:Null' ]
			});
			equal(oArgs,'rule');
			ok($Jindo.isNull(oArgs.val));
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck(null);
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - Boolean 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:Boolean' ]
			});
			equal(oArgs,'rule');
			ok($Jindo.isBoolean(oArgs.val));
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck(false);

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - String 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:String' ]
			});
			equal(oArgs,'rule');
			ok($Jindo.isString(oArgs.val));
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		fpTypeCheck('STR');
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - Object 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:Hash' ]
			});
			equal(oArgs,'rule');
			ok($Jindo.isHash(oArgs.val));
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck({});
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		fpTypeCheck($S('STR'));
		fpTypeCheck($H({}));
		fpTypeCheck($A([]));
		fpTypeCheck($Element(document.body));
		fpTypeCheck($Document(document));
		fpTypeCheck($Fn(function() {}));
		fpTypeCheck($Date(new Date()));

	});
	QUnit.test("$Jindo.checkVarType - Array 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:Array' ]
			});
			equal(oArgs,'rule');
			ok($Jindo.isArray(oArgs.val));
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck([]);
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - Element 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:Element' ]
			});
			equal(oArgs,'rule');
			ok($Jindo.isElement(oArgs.val));
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck(document.body);
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - Window 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:Window' ]
			});
			equal(oArgs,'rule');
			ok($Jindo.isWindow(oArgs.val));
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck(window);
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - Document 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:Document' ]
			});
			equal(oArgs,'rule');
			ok($Jindo.isDocument(oArgs.val));
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck(document);
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - Function 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:Function' ]
			});
			equal(oArgs,'rule');
			ok($Jindo.isFunction(oArgs.val));
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck(function() {});
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - Date 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:Date' ]
			});
			equal(oArgs,'rule');
			ok($Jindo.isDate(oArgs.val));
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck(new Date());
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - RegExp 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:RegExp' ]
			});
			equal(oArgs,'rule');
			ok($Jindo.isRegExp(oArgs.val));
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck(/reg/);
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - Numeric 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:Numeric' ]
			});
			equal(oArgs,'rule');
			ok($Jindo.isNumeric(oArgs.val));
			ok(oArgs.val === 123);
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck(123);
		fpTypeCheck("123");

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - $S 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:$S' ]
			});
			equal(oArgs,'rule');
			ok(oArgs.val instanceof $S);
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		fpTypeCheck($S('STR'));
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - $H 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:$H' ]
			});
			equal(oArgs,'rule');
			ok(oArgs.val instanceof $H);
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck($H({}));
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - $A 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:$A' ]
			});
			equal(oArgs,'rule');
			ok(oArgs.val instanceof $A);
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck($A([]));
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - $Element 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:$Element' ]
			});
			equal(oArgs,'rule');
			ok(oArgs.val instanceof $Element);
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck($Element(document.body));
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - $Document 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:$Document' ]
			});
			equal(oArgs,'rule');
			ok(oArgs.val instanceof $Document);
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck($Document(document));
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - $Fn 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:$Fn' ]
			});
			equal(oArgs,'rule');
			ok(oArgs.val instanceof $Fn);
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck($Fn(function() {}));
		try { fpTypeCheck($Date(new Date())); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

	});
	QUnit.test("$Jindo.checkVarType - $Date 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:$Date' ]
			});
			equal(oArgs,'rule');
			ok(oArgs.val instanceof $Date);
		}

		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }

		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		fpTypeCheck($Date(new Date()));

	});
	QUnit.test("$Jindo.checkVarType - ArrayStyle 타입 테스트.",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:ArrayStyle' ]
			});
			equal(oArgs,'rule');
			ok(jindo.$Jindo.isArray(oArgs.val));
		}

//		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//		try { fpTypeCheck(undefined); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//		try { fpTypeCheck(false); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//
//		try { fpTypeCheck('STR'); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//		try { fpTypeCheck({}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//		try { fpTypeCheck([]); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//		try { fpTypeCheck(document.body); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//		try { fpTypeCheck(window); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//		try { fpTypeCheck(document); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//		try { fpTypeCheck(function() {}); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//		try { fpTypeCheck(new Date()); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//		try { fpTypeCheck(/reg/); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//		try { fpTypeCheck(0); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//
//		try { fpTypeCheck($S('STR')); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//		try { fpTypeCheck($H({})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//		try { fpTypeCheck($A([])); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//		try { fpTypeCheck($Element(document.body)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//		try { fpTypeCheck($Document(document)); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
//		try { fpTypeCheck($Fn(function() {})); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		(function(){
			fpTypeCheck(arguments);
		})()

	});

module("$Jindo.checkVarType compatible 모드", {
    setup: function() {
		replaceConsole();
		window._compatible = jindo.$Jindo.compatible;
		jindo.$Jindo.compatible = function() { return true; };
    },
    teardown: function() {
		restoreConsole();
		jindo.$Jindo.compatible = window._compatible;
    }
});

	QUnit.test("인자가 더 많은 경우",function(){

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule' : [ 'val:String' ]
			});
			equal(oArgs,'rule');
			ok(typeof oArgs.val === 'string');
		}

		/*
		try { fpTypeCheck(); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(123); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		try { fpTypeCheck(null); equal(false,true); } catch(e) { ok(e instanceof TypeError); }
		*/
		fpTypeCheck("hello");
		fpTypeCheck("hello", "world");
		fpTypeCheck("hello", 1234);

	});

	QUnit.test("유사도가 제일 높은 #1",function(){

		var sExpected = '';

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule0' : [ ],
				'rule1' : [ 'val:String' ],
				'rule2' : [ 'val:String', 'val:String' ],
				'rule3' : [ 'val:String', 'val:String', 'val:String' ],
				'rule4' : [ 'val:String', 'val:String', 'val:String', 'val:String' ]
			});
			equal(String(oArgs),sExpected);
		}

		sExpected = 'rule0';
		fpTypeCheck();
		fpTypeCheck(123);

		sExpected = 'rule1';
		fpTypeCheck('hello');
		fpTypeCheck('hello', 123);

		sExpected = 'rule2';
		fpTypeCheck('hello', 'world');
		fpTypeCheck('hello', 'world', 123);

		sExpected = 'rule3';
		fpTypeCheck('hello', 'world', 'foo');
		fpTypeCheck('hello', 'world', 'foo', 123);

		sExpected = 'rule4';
		fpTypeCheck('hello', 'world', 'foo', 'bar');
		fpTypeCheck('hello', 'world', 'foo', 'bar', 123);

		sExpected = 'rule4';
		fpTypeCheck('hello', 'world', 'foo', 'bar', 'baz');
		fpTypeCheck('hello', 'world', 'foo', 'bar', 'baz', 123);

	});

	QUnit.test("유사도가 제일 높은 #2",function(){

		var sExpected = '';

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'rule0' : [ 'val:Variant' ],
				'rule2' : [ 'val:Numeric' ],
				'rule1' : [ 'val:String' ]
			});
			equal(String(oArgs),sExpected);
		}

		sExpected = 'rule1';
		fpTypeCheck('hello');

		sExpected = 'rule2';
		fpTypeCheck(123);

		sExpected = 'rule2';
		fpTypeCheck("123");

		sExpected = 'rule0';
		fpTypeCheck(/regexp/);

	});

	QUnit.test("유사도가 제일 높은 #3",function(){

		var fpCallback;

		function fpTypeCheck() {
			var oArgs = $Jindo.checkVarType(arguments, {
				'void' : [],
				'rule1' : [ 'num:Numeric' ],
				'rule0' : [ 'str:String' ],
				'rule2' : [ 'val:Variant' ]
			});
			fpCallback(oArgs);
		}

		fpCallback = function(oArgs) {
			equal(String(oArgs),'rule0');
			equal(oArgs.str,'hello');
		};
		fpTypeCheck('hello');

		fpCallback = function(oArgs) {
			equal(String(oArgs),'rule1');
			equal(oArgs.num === 123,true);
		};
		fpTypeCheck(123);

		fpCallback = function(oArgs) {
			equal(String(oArgs),'rule1');
			equal(oArgs.num === 123,true);
		};
		fpTypeCheck("123");

		fpCallback = function(oArgs) {
			equal(String(oArgs),'void');
			equal('val' in oArgs,false);
		};
		fpTypeCheck();

		fpCallback = function(oArgs) {
			equal(String(oArgs),'rule2');
			equal(oArgs.val instanceof RegExp,true);
		};
		fpTypeCheck(/regexp/);

		fpCallback = function(oArgs) {
			equal(String(oArgs),'rule2');
			equal(oArgs.val === null,true);
		};
		fpTypeCheck(null);

	});