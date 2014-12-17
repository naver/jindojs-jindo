QUnit.config.autostart = false;

module("$Json 객체");
	QUnit.test("toString은 JSON.stringify의 작동과 같아야 한다.",function(){
		//Given
		var input = {
			"string":"1",
			"number":1,
			"object":{"a":1},
			"array" : [1,1],
			"boolean" : true,
			"function" : function(){},
			"null" : null,
			"undefined" : undefined,
			"infinity" :Infinity,
			"regexp" : /^!/,
			"nan" : NaN
		};

		var output = {
			"string":"\"1\"",
			"number":"1",
			"object":"{\"a\":1}",
			"array" : "[1,1]",
			"boolean" : "true",
			"function" : undefined,
			"null" : "null",
			"undefined" : undefined,
			"infinity" :"null",
			"regexp" : "{}",
			"nan" : "null"
		};

		//When
		//Then
		$H(input).forEach(function(v,i){
			equal($Json(v).toString(),output[i]);
		});
	});
	QUnit.test("toString을 할때 Date가 있으면 Date#toString한 결과가 나와야한다.",function(){
        //Given
        var input = {
            "date": new Date(2010,1,1,1,1,1)
        };
        //When
        var result = $Json(input).toString();
        //Then
        equal(result,"{\"date\":"+new Date(2010,1,1,1,1,1)+"}");

    });
	QUnit.test("toObject은 문자열 이면서 오브젝트 형식을 가질때만 오브젝트로 반환하고 아닌 경우는 그냥 반환한다.",function(){

		//Given
		var input = {
			"string":"1",
			"number":1,
			"object":{"a":1},
			"array" : [1,1],
			"boolean" : true,
			"function" : function(){},
			"null" : null,
			"undefined" : undefined,
			"infinity" :Infinity,
			"regexp" : /^!/,
			"string-like-object" : "{\"a\":1}",
			"string-like-array" : "[1,\"2\"]"
		};
		var output = {
			"string":"1",
			"number":1,
			"object":{"a":1},
			"array" : [1,1],
			"boolean" : true,
			"function" : function(){},
			"null" : null,
			"undefined" : undefined,
			"infinity" :Infinity,
			"regexp" : /^!/,
			"string-like-object" : {"a":1},
			"string-like-array" : [1,"2"]
		};
		//When
		//Then
		$H(input).forEach(function(v,i){
		    if(i == "function") {
		        equal($Json(v).toObject().toString(), output[i].toString());
		    } else {
			    deepEqual($Json(v).toObject(), output[i]);
			}
		});
		ok(isNaN($Json(NaN).toObject()));

	});
	QUnit.test("toString : 문자열을 정확히 반환하는가?",function(){
		var json = $Json({a:[1,2,3]});
		var str  = "" + json;

		equal(str,'{"a":[1,2,3]}');
	});
	QUnit.test("get 메소드가 객체를 한번 더 저장하지 않는가? - fixed bug",function(){
		var xml = '<?xml version="1.0"?><codes><code char="a" value="A"><\/code><code char="b" value="B"><\/code><code char="c" value="C"><\/code><\/codes>';
		var json = $Json.fromXML(xml);
		var code = json.get("/codes/code");

		equal(code.length, 3);
	});
	QUnit.test("빈 노드를 빈 문자열로 변환하는가?",function(){
		var xml = '<?xml version="1.0" encoding="UTF-8"?><avatar><url><hangametop><![CDATA[http:\/\/ctrad.hangame.co.jp\/go?loc=ht2007.avatar&ad=AD1183445297474]]><\/hangametop><easytop><\/easytop><\/url><\/avatar>';
		var json = $Json.fromXML(xml);
		var val  = json.get("/avatar/url/easytop");

		equal(typeof val[0],"string");
	});
	QUnit.test("속성값 설정시 홀따옴표로 묶어도 처리가 가능한가?",function(){
		var xml = '<?xml version="1.0"?><codes><code char=\'a\' value=\'A\'  ><\/code><\/codes>';
		var json = $Json.fromXML(xml);
		var val  = json.get("/codes/code/value");

		equal(val,"A");
	});
	QUnit.test("<element/>와 같이 바로 닫은 태그 처리가 가능한가?",function(){
		var xml = '<?xml version="1.0"?><codes><code char="a" value="A"  \/code><\/codes>';
		var json = $Json.fromXML(xml);
		var val  = json.get("/codes/code/value");

		equal(val,"A");
	});
	QUnit.test("속성값에 쌍따옴표나 홀따옴표를 escape해서 넣어도 문제되지 않는가?",function(){
		var xml = '<?xml version="1.0"?><codes><code char="a\\"a" value=\'A\\\'A\' ><\/code><\/codes>';
		var json = $Json.fromXML(xml);
		var val  = json.get("/codes/code/value");

		equal(val,"A'A");
	});
	QUnit.test("바로닫은 태그가 중첩되어도 문제되지 않는가?",function(){
		var xml = ['<local>',
				'<province name="北海道" id="a" code="tdfq861"/>',
				'<province2 name="東北" id="b" code="wccs792">',
				'<region1 name="福島" id="b0" code="ltds226"><tmp>haha</tmp></region1>',
				'<region name="宮城" id="b1" code="fhtf914"/>',
				'<region name="山形" id="b2" code="ssfj728"/>',
				'<region name="岩手" id="b3" code="mwlb807"/>',
				'<region name="秋田" id="b4" code="njxa160"/>',
				'<region name="青森" id="b5" code="zowx148"/>',
				'</province2>',
				'</local>'];
		var json = $Json.fromXML(xml.join(""));
		var val  = json.get("/local/province2/region1/tmp");

		equal(val,"haha");
	});

	QUnit.test("toXML : XML 문자열",function(){
		var json = $Json({bb:{a:[1,2,3]}});
		var xml  = json.toXML();

		equal(xml,"<bb><a>1<\/a><a>2<\/a><a>3<\/a><\/bb>");
	});
	QUnit.test("오브젝트나 배열인 경우는 객체로 반환된다.",function(){
		deepEqual($Json("[1,2,3]").$value(),[1,2,3]);
		deepEqual($Json("{a:1}").toObject(),{a:1});
	});
	QUnit.test("compare는 비교가 정확한가?",function(){
		ok($Json({"a":1,"b":1}).compare({"a":1,"b":1}));
		ok(!$Json({"a":1,"b":1}).compare({"a":1,"b":2}));
		ok($Json({"a":1,"b":1}).compare({"b":1,"a":1}));
		ok($Json({"a":1,"b":1,"c":{"a":1,"b":1}}).compare({"b":1,"a":1,"c":{"b":1,"a":1}}));
		ok($Json([1,2,3,4]).compare([1,2,3,4]));
		ok(!$Json([1,2,3,4]).compare([2,1,3,4]));
	});
	QUnit.test("formXML에서 속성에 빈값이 있는 경우",function(){
	    var oRes = $Json.fromXML('<entry id="12198" cast="">메키 피퍼</entry> ').$value();
	    delete oRes.entry.toString;

		deepEqual(oRes, {entry:{id:"12198", cast:"", $cdata:"\uBA54\uD0A4 \uD53C\uD37C"}});
	});
	QUnit.test("formXML에서 빈공간이 들어가도 정상적인가?",function(){
		deepEqual($Json.fromXML('<tag1>ok</tag1>	<tag2>cancel</tag2>').$value(),{"tag1":"ok", "tag2":"cancel"});
	});
QUnit.test("compare는 비교가 정확한가?",function(){
		ok($Json({"a":1,"b":1}).compare({"a":1,"b":1}));
		ok(!$Json({"a":1,"b":1}).compare({"a":1,"b":2}));
		ok($Json({"a":1,"b":1}).compare({"b":1,"a":1}));
		ok($Json({"a":1,"b":1,"c":{"a":1,"b":1}}).compare({"b":1,"a":1,"c":{"b":1,"a":1}}));
		ok($Json([1,2,3,4]).compare([1,2,3,4]));
		ok(!$Json([1,2,3,4]).compare([2,1,3,4]));
		ok($Json([1]).compare([1]));
		ok(!$Json([1]).compare(['1']));
		ok($Json([/test/]).compare([/test/]));
		ok($Json(["hello"]).compare(["hello"]));
		ok(!$Json(["hello"]).compare(["world"]));
		ok($Json([ 1, 2, 3 ]).compare([ 1, 2, 3 ]));
		ok($Json({ foo : 1, bar : function() {} }).compare({ bar : function() {}, foo : 1 }));
		ok($Json({ foo : true }).compare({ foo : true }));
		ok($Json([null]).compare([null]));
		ok(!$Json([undefined]).compare([null]));
		ok($Json([undefined]).compare([undefined]));
		ok(!$Json([undefined]).compare([Infinity]));
		ok(!$Json([-Infinity]).compare([Infinity]));
		ok($Json([Infinity]).compare([Infinity]));
		ok(!$Json([NaN]).compare([Infinity]));
		ok($Json([NaN]).compare([NaN]));
		ok($Json($A([1, 2])).compare($A([1, 2])));
		ok(!$Json($A([1, 2])).compare($A([1, 2, 3])));
		ok($Json($Fn(function() {})).compare($Fn(function() {})));
		ok(!$Json($Fn(function() { alert(1); })).compare($Fn(function() {})));

		var s = new Date();
		var t = new Date();

		s.setTime(Date.parse('2010/10/11'));
		t.setTime(Date.parse('2010/10/11'));
		ok($Json([s]).compare([t]));

		s.setTime(Date.parse('2010/10/11'));
		t.setTime(Date.parse('1991/03/12'));
		ok(!$Json([s]).compare([t]));

	});
	QUnit.test("값안에 빈공간이 있을때 문제.",function(){
		var xmlSrc = '<?xml version="1.0" encoding="UTF-8" ?><result>   <avatar>   		<avcode>error.avatar.purchase.gift.alert.possess   		</avcode>   		<name>친구가 소유한 아바타인지 확인합니다.         </name>   		<have></have>   </avatar>   <avatar>   		<avcode>SBU0SM   		</avcode>   		<name>여름왕 장핑그리   		</name>   		<have>X   		</have>   </avatar></result>';
		var resultFail = jindo.$Json.fromXML(xmlSrc);
		var result = {"result":{"avatar":[{"avcode":"error.avatar.purchase.gift.alert.possess   \t\t","have":"","name":"친구가 소유한 아바타인지 확인합니다.         "},{"avcode":"SBU0SM   \t\t","have":"X   \t\t","name":"여름왕 장핑그리   \t\t"}]}}
		ok(resultFail.compare(result));

	});
	QUnit.test("인스턴스 생성이 아무것도 넣지 않으면 빈오브젝트가 할당된다.",function(){
		var json = $Json();
		deepEqual(json.$value(),{});
	});
	QUnit.test("json인스턴스를 넣어도 정상적으로 작동되어야 한다.",function(){
		var json = $Json($Json({"a":1}));
		deepEqual(json.$value(),{"a":1});
	});
//	QUnit.test("정상적이 문자가 아니면 빈 오브젝트가 할당된다.",function(){
//		var json = $Json('{"a":}');
//		equal(json.$value(),{});
//	},
	QUnit.test("xml에 솟수나 블린 값이 있어도 정상적으로 작동되어야 한다.",function(){
		deepEqual(jindo.$Json.fromXML("<data><a>1.1</a><b>true</b></data>").$value(),{"data":{"a":1.1,"b":true}});
	});
	QUnit.test("fromXML 커버리지 개선.",function(){
		Object.prototype.test1 = function(){};
		var oRes = jindo.$Json.fromXML("<data><a>1.1</a><a>1.1</a><test1>0</test1></data>").$value();

		equal(JSON.stringify(oRes), JSON.stringify({
		    "data":{
		        "a":[1.1,1.1],
		        "test1":[
                    function(){},
                    0
                ]
            }
        }));

		delete Object.test1;
	});
	QUnit.test("get에서 ..은 잘동작하는지 확인한다.",function(){
		var json = jindo.$Json.fromXML("<data><a><b>1.1</b></a><a>1.1</a></data>");
		deepEqual(json.get("data/a/b/.."),json.get("data/a"));
	});
	QUnit.test("toXML을 이용하는데 값이 undefined나 null일 때",function(){
		var json = $Json({"a":undefined,"b":null});
		equal(json.toXML(),"<a></a><b></b>");
	});
	QUnit.test("toXML을 이용하는데 값이 string일 때",function(){
		var json = $Json({"a":"<adsf>"});
		equal(json.toXML(),"<a><![CDATA[<adsf>]]></a>");
		json = $Json({"a":"adsf"});
		equal(json.toXML(),"<a>adsf</a>");
	});
	QUnit.test("toXML을 이용하는데 값이 boolean일 때",function(){
		var json = $Json({"a":true});
		equal(json.toXML(),"<a>true</a>");
	});
	QUnit.test("fromXML에서 true,false가 정상적으로 표시되어야 한다.",function(){
		var oJson = $Json.fromXML("<data><a>true</a><b>false</b></data>");
		ok(oJson.toObject().data.a);
		ok(!oJson.toObject().data.b);
	}
);

module("$Json 객체 new API");
	QUnit.test("fromXML은 인자로 문자만 받는다.",function(){
		//Given
		var occurException = false;
		//When
		try{
			$Json.fromXML();
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);
	});
	QUnit.test("get은 인자로 문자만 받는다.",function(){
		//Given
		var occurException = false;
		var json = jindo.$Json.fromXML("<data><a><b>1.1</b></a><a>1.1</a></data>");
		//When
		try{
			json.get();
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);
	});
	QUnit.test("키값이 undefined일 경우 속성은 사라져야 한다.",function(){
		//Given
		//When
		//Then
		equal($Json("{a:undefined}").toString(),"\"{a:undefined}\"");

		//Given
		//When
		//Then
		equal($Json({a:undefined}).toString(),"{}");

		//Given
		//When
		//Then
		deepEqual($Json("{a:undefined}").toObject(),{a:undefined});
		//Given
		//When
		//Then
		deepEqual($Json({a:undefined}).toObject(),{a:undefined});
	});

    QUnit.test("인코딩이 정상적으로 되어야 한다",function(){
        //Given
        var doubleQutation  = "\"";
        //When
        //Then
        equal($Json("\"").toString(),'"\\""');

    });
    QUnit.test("숫자로 구성된 굉장히 큰 문자가 들어와도 정상적으로 반환해야 한다.",function(){
        //Given
        var expectedValue = '{"test":"122222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222244124141412412412412412412412412222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222224412414141241241241241241241241222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222441241414124124124124124124124"}';
        var returnValue;

        //When
        returnValue = $Json({"test":"122222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222244124141412412412412412412412412222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222224412414141241241241241241241241222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222441241414124124124124124124124"}).toString();

        //Then
        equal(returnValue,expectedValue);
    });