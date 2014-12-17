QUnit.config.autostart = false;

module("$Document 객체");
	QUnit.test("$value는 document를 반환한다.",function(){
		equal($Document().$value(),document);
	});
	QUnit.test("queryAll,query,xpath는 정상적으로 반환되어야 한다.",function(){
		equal($Document().queryAll("form").length,4);
		equal($Document().query("form").id,"form");
	});
	QUnit.test("clientSize : 문서의 clientWidth, clientHeight 을 잘 얻어오는지",function(){
		var o = $Document().clientSize();
		ok(o.width>0);
		ok(o.height>0);
    });
