QUnit.config.autostart = false;

module("$Document 객체");
	QUnit.test("$value는 document를 반환한다.",function(){
		equal($Document().$value(),document);
	});
	QUnit.test("queryAll,query,xpath는 정상적으로 반환되어야 한다.",function(){
		equal($Document().queryAll("form").length,4);
		equal($Document().query("form").id,"form");
		equal($Document().xpathAll("form/input").length,4);
	});
	QUnit.test("scrollSize : 문서의 scrollWidth, scrollHeight 을 잘 얻어오는지",function(){
	    var oSize = $Document().scrollSize();

		ok(oSize.width > 0);
		ok(oSize.height > 0);
	});
	QUnit.test("clientSize : 문서의 clientWidth, clientHeight 을 잘 얻어오는지",function(){
		var o = $Document().clientSize();
		ok(o.width>0);
		ok(o.height>0);
		//value_of(o).should_fail('<strong>이 항목은 자동화 된 체크가 불가능합니다</strong><br/>실제로 브라우저 문서 영역의 사이즈를 재서 다음과 같은지 비교해주세요 -> 가로크기 : ' + o.width + ' / 세로크기 : ' + o.height);
	});

    if(!$Agent().navigator().ie || $Agent().navigator().version >= 6) {
        QUnit.test("renderingMode : 문서가 표준모드로 렌더링 되는지 여부를 잘 얻어오는지",function(){
            equal($Document().renderingMode(),'Standards');
        });
	}

	if($Agent().navigator().ie && $Agent().navigator().version < 6) {
        QUnit.test("renderingMode : 문서가 표준모드로 렌더링 되는지 여부를 잘 얻어오는지",function(){
            equal($Document().renderingMode(),'Quirks');
        });
	}