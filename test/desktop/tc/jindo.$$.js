QUnit.config.autostart = false;

/************************** $$_fragment_spec **************************/
module('div');

	QUnit.test("fragment에서 콤비네이터를 먼저 사용한 경우",function(){
		var div = document.createElement("div");
		div.innerHTML = "" +
			"<ul id='test1' class='parent'>" +
				"<li class='child'>1</li>" +
				"<li>2</li>" +
				"<li class='child'>3<a>a</a></li>" +
			"</ul>" +
			"<ul id='test2'>" +
				"<li>4</li>" +
				"<li class='child'>5</li>" +
				"<li>6<ul><li>6-1</li></ul></li>" +
			"</ul>" +
			"<ul class='parent'>" +
				"<li>7</li>" +
				"<li>8</li>" +
				"<li class='child'>9</li>" +
			"</ul>";
		deepEqual(cssquery("ul",div).length, 4);
		deepEqual(cssquery("ul > li",div).length, 10);
		deepEqual(cssquery("> ul",div).length, 3);
		deepEqual(cssquery("> ul > li",div).length, 9);
		deepEqual(cssquery(".parent",div).length, 2);
		deepEqual(cssquery(".child",div).length, 4);
		deepEqual(cssquery("#test1 .child",div).length, 2);
		deepEqual(cssquery("#test1 > div > a",div).length, 0);
		deepEqual(cssquery("#test1 li a",div).length, 1);
		deepEqual(cssquery("#test1 li > a",div).length, 1);
		deepEqual(cssquery("#test2 + ul li",div).length, 3);
		deepEqual(cssquery("#test2 li",div).length, 4);
		deepEqual(cssquery("#test2 a",div).length, 0);
		deepEqual(cssquery("#test2 + ul ~ ul",div).length, 0);
	});

	QUnit.test("돔이 붙어 있는 상황에서 콤비네이터을 먼저 사용한 경우-상단에 아이디가 있는 경우.",function(){
		var div = $("com1");
		deepEqual(cssquery("ul",div).length, 4);
		deepEqual(cssquery("ul > li",div).length, 10);
		deepEqual(cssquery("> ul",div).length, 3);
		deepEqual(cssquery("> ul > li",div).length, 9);
		deepEqual(cssquery(".parent",div).length, 2);
		deepEqual(cssquery(".child",div).length, 4);
		deepEqual(cssquery("#com1_test1 .child",div).length, 2);
		deepEqual(cssquery("#com1_test1 > div > a",div).length, 0);
		deepEqual(cssquery("#com1_test1 li a",div).length, 1);
		deepEqual(cssquery("#com1_test1 li > a",div).length, 1);
		deepEqual(cssquery("#com1_test2 + ul li",div).length, 3);
		deepEqual(cssquery("#com1_test2 li",div).length, 4);
		deepEqual(cssquery("#com1_test2 a",div).length, 0);
		deepEqual(cssquery("#com1_test2 + ul ~ ul",div).length, 0);
		deepEqual(cssquery("+ div",div).length, 1);
		deepEqual(cssquery("~ div",div).length, 2);
	});

	QUnit.test("돔이 붙어 있는 상황에서 콤비네이터을 먼저 사용한 경우-상단에 아이디가 없는 경우.",function(){
		var div = $$.getSingle("#com1 + div");
		deepEqual(cssquery("ul",div).length, 4);
		deepEqual(cssquery("ul > li",div).length, 10);
		deepEqual(cssquery("> ul",div).length, 3);
		deepEqual(cssquery("> ul > li",div).length, 9);
		deepEqual(cssquery(".parent",div).length, 2);
		deepEqual(cssquery(".child",div).length, 4);
		deepEqual(cssquery("#com2_test1 .child",div).length, 2);
		deepEqual(cssquery("#com2_test1 > div > a",div).length, 0);
		deepEqual(cssquery("#com2_test1 li a",div).length, 1);
		deepEqual(cssquery("#com2_test1 li > a",div).length, 1);
		deepEqual(cssquery("#com2_test2 + ul li",div).length, 3);
		deepEqual(cssquery("#com2_test2 li",div).length, 4);
		deepEqual(cssquery("#com2_test2 a",div).length, 0);
		deepEqual(cssquery("#com2_test2 + ul ~ ul",div).length, 0);
		deepEqual(cssquery("+ div",div).length, 1);
		deepEqual(cssquery("~ div",div).length, 1);
});

/************************** $$_selector_spec **************************/
var selector_api_and_count = 	{'body':1, 'div':47, 'body div':46, 'div p':70, 'div > p':64, 'div + p':12, 'div ~ p':165, 'div[class^=exa][class$=mple]':34, 'div p a':13, 'div, p, a':568,
								'.note':3, 'div.example':34, 'ul .tocline2':12, 'div.example, div.note':37, '#title':0, 'h1#title':0, 'div #title':0, 'ul.toc li.tocline2':12, 'ul.toc > li.tocline2':12,
								'h1#title + div > p':0, 'h1[id]:contains(Selectors)':0, 'a[href][lang][class]':0, 'div[class]':45, 'div[class=example]':34, 'div[class^=exa]':34, 'div[class$=mple]':36,
								'div[class*=e]':44, 'div[class|=dialog]':0, 'div[class!=made_up]':47, 'div[class~=example]':34, 'div:not(.example)':13, 'p:contains(selectors)':49, 'p:nth-child(even)':100,
								'p:nth-child(2n)':100, 'p:nth-child(odd)':133, 'p:nth-child(2n+1)':133, 'p:nth-child(n)':233, 'p:only-child':2, 'p:last-child':14, 'p:first-child':26}

var _doc;
// div의 개수를 체크 할때는 firebug을 닫고 할것.
module("$$ 인자 스팩.", {
    // clean up after each test
    teardown: function() {
        cssquery.safeHTML(true);
    }
});

QUnit.test("documentElment가 들어간 경우 정상적으로 동작해야 함.",function(){
		//Given
		var length;

		//When
		length = $$("div",document.documentElement,{oneTimeOffCache:true}).length;

		//Then
		ok(length>0);
	});
QUnit.test("문자가 아닌 경우는 에러나 발생해야 한다.-cssquery",function(){
		var excuteExcept = false;
		try{
			jindo.$$();
		}catch(e){
			excuteExcept = true;
		}
		ok(excuteExcept);
		excuteExcept = false;
		try{
			jindo.$$(null);
		}catch(e){
			excuteExcept = true;
		}
		ok(excuteExcept);
		excuteExcept = false;
		try{
			jindo.$$(undefined);
		}catch(e){
			excuteExcept = true;
		}
		ok(excuteExcept);
		excuteExcept = false;
		try{
			jindo.$$(1);
		}catch(e){
			excuteExcept = true;
		}
		ok(excuteExcept);
		excuteExcept = false;
		try{
			jindo.$$({});
		}catch(e){
			excuteExcept = true;
		}
		ok(excuteExcept);
	});
QUnit.test("문자가 아닌 경우는 에러나 발생해야 한다.-cssquery.getSingle",function(){
		var excuteExcept = false;
		try{
			jindo.$$.getSingle();
		}catch(e){
			excuteExcept = true;
		}
		ok(excuteExcept);
		excuteExcept = false;
		try{
			jindo.$$.getSingle(null);
		}catch(e){
			excuteExcept = true;
		}
		ok(excuteExcept);
		excuteExcept = false;
		try{
			jindo.$$.getSingle(undefined);
		}catch(e){
			excuteExcept = true;
		}
		ok(excuteExcept);
		excuteExcept = false;
		try{
			jindo.$$.getSingle(1);
		}catch(e){
			excuteExcept = true;
		}
		ok(excuteExcept);
		excuteExcept = false;
		try{
			jindo.$$.getSingle({});
		}catch(e){
			excuteExcept = true;
		}
		ok(excuteExcept);
	});
QUnit.test("기준 엘리먼트가 textnode등 정상 엘리먼트가 아닌 경우 에러가 발생하지 않아야 한다.",function(){
		var isError = false;
		var tn = document.createTextNode("This is text node.");
		document.body.appendChild(tn);

		try{
			$$(".class", tn);
		}catch(e){
			isError = true;
		}

		ok(!isError);
	});

module("$$ selector Spec", {
  setup: function() {
    // prepare something for all following tests
    _doc = $("selector_test").contentWindow.document;
  }
});

QUnit.test("대문자 class확인.",function(){
		deepEqual($$('.TEST2',_doc).length, 1);
	});
QUnit.test(":selected",function(){
		deepEqual($$('option:selected',_doc).length, 1);
		deepEqual($$('option:not(:selected)',_doc).length, 2);
		deepEqual($$('option[selected=true]',_doc).length, 1);
		deepEqual($$('option[selected=false]',_doc).length, 2);
	});
QUnit.test("p[data-id=test]",function(){
		equal($$('#property-test p[data-id=test]',document).length, 1);
		equal($$('p[data-id=test]',document.getElementById("property-test")).length, 1);
		equal($$('p[data-id=test]',document.getElementsByClassName("head")[0]).length, 1);
	});

	QUnit.test(":checked",function(){
		deepEqual($$('input:checked',_doc).length, 1);
		deepEqual($$('input:not(:checked)',_doc).length, 3);
		deepEqual($$('input[checked=true]',_doc).length, 1);
		deepEqual($$('input[checked=false]',_doc).length, 3);
	});

QUnit.test(":enabled",function(){
		deepEqual($$('input:enabled',_doc).length, 3);
		deepEqual($$('input[disabled=false]',_doc).length, 3);
	});
QUnit.test(":disabled",function(){
		deepEqual($$('input:disabled',_doc).length, 1);
		deepEqual($$('input[disabled=true]',_doc).length, 1);
	});
QUnit.test(":nth-of-type",function(){
		deepEqual($$('p:nth-of-type(3)',_doc).length, 9);
	});
QUnit.test(":nth-last-of-type",function(){
		deepEqual($$('p:nth-last-of-type(3)',_doc).length, 9);
	});
QUnit.test(":first-of-type",function(){
		deepEqual($$('p:first-of-type',_doc).length, 32);
	});
QUnit.test(":last-of-type",function(){
		deepEqual($$('p:last-of-type',_doc).length, 32);
	});
QUnit.test(":nth-last-child",function(){
		deepEqual($$('div:nth-last-child(1)',_doc).length, 0);
	});
QUnit.test(":empty",function(){
		deepEqual($$('div:empty',_doc).length, 2);
	});
QUnit.test("div[class~=example]",function(){
	    deepEqual($$('div[class~=example]',_doc).length, 34);
	});
QUnit.test("a[href][lang][class]",function(){
	    deepEqual($$('a[href][lang][class]',_doc).length, 0);
	});
QUnit.test("p:first-child",function(){
	    deepEqual($$('p:first-child',_doc).length, 26);
	});
QUnit.test("div.example",function(){
	    deepEqual($$('div.example',_doc).length, 34);
	});
QUnit.test(".note",function(){
	    deepEqual($$('.note',_doc).length, 3);
	});
QUnit.test("div p a",function(){
	    deepEqual($$('div p a',_doc).length, 13);
	});
QUnit.test("div > p",function(){
	    deepEqual($$('div > p',_doc).length, 64);
	});
QUnit.test("body",function(){
	    deepEqual($$('body',_doc).length, 1);
	});
QUnit.test("div[class!=made_up]",function(){
	    deepEqual($$('div[class!=made_up]',_doc).length, 47);
	});
QUnit.test("div[class=example]",function(){
	    deepEqual($$('div[class=example]',_doc).length, 34);
	});
QUnit.test("div[class]",function(){
	    deepEqual($$('div[class]',_doc).length, 45);
	});
QUnit.test("h1[id]:contains(Selectors)",function(){
	    deepEqual($$('h1[id]:contains(Selectors)',_doc).length, 0);
	});
QUnit.test("ul.toc > li.tocline2",function(){
	    deepEqual($$('ul.toc > li.tocline2',_doc).length, 12);
	});
QUnit.test("ul.toc li.tocline2",function(){
	    deepEqual($$('ul.toc li.tocline2',_doc).length, 12);
	});
QUnit.test("p:nth-child(2n)",function(){
	    deepEqual($$('p:nth-child(2n)',_doc).length, 100);
	});
QUnit.test("p:nth-child(even)",function(){
	    deepEqual($$('p:nth-child(even)',_doc).length, 100);
	});
QUnit.test("div[class*=e]",function(){
	    deepEqual($$('div[class*=e]',_doc).length, 44);
	});
QUnit.test("div + p",function(){
	    deepEqual($$('div + p',_doc).length, 12);
	});
QUnit.test("div p",function(){
	    deepEqual($$('div p',_doc).length, 70);
	});
QUnit.test("p:last-child",function(){
	    deepEqual($$('p:last-child',_doc).length, 14);
	});
QUnit.test("div:not(.example)",function(){
	    deepEqual($$('div:not(.example)',_doc).length, 13);
	});
QUnit.test("div[class|=dialog]",function(){
	    deepEqual($$('div[class|=dialog]',_doc).length, 0);
	});
QUnit.test("div[class$=mple]",function(){
	    deepEqual($$('div[class$=mple]',_doc).length, 36);
	});
QUnit.test("div, p, a",function(){
		var div_num = _doc.getElementsByTagName('div').length;
		var p_num = _doc.getElementsByTagName('p').length;
		var a_num = _doc.getElementsByTagName('a').length;
	    deepEqual($$('div, p, a',_doc).length, div_num + p_num + a_num);
	});
QUnit.test("div[class^=exa][class$=mple]",function(){
	    deepEqual($$('div[class^=exa][class$=mple]',_doc).length, 34);
	});
QUnit.test("div",function(){
	    deepEqual($$('div',_doc).length, 47);
	});
QUnit.test("p:nth-child(odd)",function(){
	    deepEqual($$('p:nth-child(odd)',_doc).length, 133);
	});
QUnit.test("p:contains(selectors)",function(){
	    deepEqual($$('p:contains(selectors)',_doc).length, 49);
	});
QUnit.test("div.example, div.note",function(){
	    deepEqual($$('div.example, div.note',_doc).length, 37);
	});
QUnit.test("ul .tocline2",function(){
	    deepEqual($$('ul .tocline2',_doc).length, 12);
	});
QUnit.test("p:nth-child(2n+1)",function(){
	    deepEqual($$('p:nth-child(2n+1)',_doc).length, 133);
	});
QUnit.test("div[class^=exa]",function(){
	    deepEqual($$('div[class^=exa]',_doc).length, 34);
	});
QUnit.test("div #title",function(){
	    deepEqual($$('div #title',_doc).length, 0);
	});
QUnit.test("body div",function(){
	    deepEqual($$('body div',_doc).length, 47);
	});
QUnit.test("p:only-child",function(){
	    deepEqual($$('p:only-child',_doc).length, 2);
	});
QUnit.test("div ~ p",function(){
	    deepEqual($$('div ~ p',_doc).length, 165);
	});
QUnit.test("p:nth-child(n)",function(){
	    deepEqual($$('p:nth-child(n)',_doc).length, 233);
	});
QUnit.test("h1#title + div > p",function(){
	    deepEqual($$('h1#title + div > p',_doc).length, 0);
	});
QUnit.test("h1#title",function(){
	    deepEqual($$('h1#title',_doc).length, 0);
	});
QUnit.test("#title",function(){
	    deepEqual($$('#title',_doc).length, 0);
	});
QUnit.test("div !~ p * ! p !~ *",function() {
        deepEqual($$("div !~ p * ! p !~ *").length, 7);
    });

module("New Cssquery");


	QUnit.test("html5가 없는 브라우저에서 html5도 찾아야 한다.",function(){
		//Given
		//When
		var btn = $$("#html5tag .btn");
		//Then
		deepEqual(btn.length, 1);
		deepEqual(btn[0].tagName.toLowerCase(), "input");
	});
QUnit.test("cssquery에서 id을 속성으로 변경.",function() {
        //Given
        //When
        var aEle = $$(".property_test ul",$$("div.property_parent")[0]);
        //Then
        deepEqual(aEle.length, 1);
        deepEqual(aEle[0].tagName.toLowerCase(), "ul");
    });
QUnit.test("[key=val]을 찾을 때 val가 숫자이면 ''로 묶어서 처리하여 정상적으로 처리한다.",function(){
        //Given
        //When
        var aEle = $$("ul li[date=1212]");
        //Then
        deepEqual(aEle.length, 1);
        deepEqual(aEle[0].tagName.toLowerCase(), "li");
    });
QUnit.test(",이 스페이스 없으면 정상적으로 쿼리가 안됨",function(){
        //Given
        //When
        var aEle1 = $$("div,span",$("cssquery_903"));
        var aEle2 = $$("div, span",$("cssquery_903"));
        var aEle3 = $$("div , span",$("cssquery_903"));
        //Then
        deepEqual(aEle1.length, 4);
        deepEqual(aEle2.length, 4);
        deepEqual(aEle3.length, 4);

    });
QUnit.test("offline돔에서 사용해도 정상적으로 동작해야 한다.",function(){
            //Given
            var str = '<div class="cbox_select_area"><div id="s2" class="selectbox-noscript"><select name="" class="selectbox-source"><option class="selectbox-default">평점선택</option><option value="10">10점</option><option value="9">9점</option><option value="8">8점</option><option value="7">7점</option><option value="6">6점</option><option value="5">5점</option><option value="4">4점</option><option value="3">3점</option><option value="2">2점</option><option value="1">1점</option></select><div class="selectbox-box"><div class="selectbox-label">평점선택</div></div><div class="selectbox-layer"><div class="selectbox-list"></div></div></div></div>';
            var ele = $Element(str);
            var a = ele.query(".selectbox-noscript");
            //Then
            var select = $$.getSingle("select.selectbox-source",a.$value());
            var option = $$.getSingle("option",select);
            //Whend
            ok(!$S(ele.html()).trim().$value()=="");//여기서 없어짐
    });

QUnit.test("id가 문자와 숫자, _, -으로만 되어 있지 않아도 정상적으로 찾아야 한다.",function(){
        //Given
        var f = document.createElement('div');
        f.innerHTML = '<ul><li id="foo|bar"><div></div></li></ul>';
        var g = f.getElementsByTagName('li')[0];

        //When
        var ele = $$('div', g);

        //Then
        deepEqual(ele.length, 1);
});


/************************** $$_spec **************************/
module('document');

	QUnit.test("fragment에서 콤비네이터을 먼저 사용한 경우",function(){
		var doc = document.createDocumentFragment();
		var ul1 = document.createElement("ul");
		ul1.id = "test1";
		ul1.className = "parent";
		ul1.innerHTML = "<li class='child'>1</li>" +
				"<li>2</li>" +
				"<li class='child'>3<a>a</a></li>";
		var ul2 = document.createElement("ul");
		ul2.id = "test2";
		ul2.innerHTML =	"<li>4</li>" +
				"<li class='child'>5</li>" +
				"<li>6<ul><li>6-1</li></ul></li>";
		var ul3 = document.createElement("ul");
		ul3.className = "parent"
		ul3.innerHTML = "<li>7</li>" +
				"<li>8</li>" +
				"<li class='child'>9</li>";
		doc.appendChild(ul1);
		doc.appendChild(ul2);
		doc.appendChild(ul3);
		deepEqual(cssquery("ul",doc).length, 4);
		deepEqual(cssquery("ul > li",doc).length, 10);
		deepEqual(cssquery("> ul",doc).length, 3);
		deepEqual(cssquery("> ul > li",doc).length, 9);
		deepEqual(cssquery(".parent",doc).length, 2);
		deepEqual(cssquery(".child",doc).length, 4);
		deepEqual(cssquery("#test1 .child",doc).length, 2);
		deepEqual(cssquery("#test1 > div > a",doc).length, 0);
		deepEqual(cssquery("#test1 li a",doc).length, 1);
		deepEqual(cssquery("#test1 li > a",doc).length, 1);
		deepEqual(cssquery("#test2 + ul li",doc).length, 3);
		deepEqual(cssquery("#test2 li",doc).length, 4);
		deepEqual(cssquery("#test2 a",doc).length, 0);
		deepEqual(cssquery("#test2 + ul ~ ul",doc).length, 0);
	});

	QUnit.test("document, body일 때.",function(){
		deepEqual(cssquery("> input").length, 0);
		deepEqual(cssquery("> input",document.body).length, 11);
	});


// module('document');


	// QUnit.test("fragment에서 콤비네이터을 먼저 사용한 경우",function(){
		// var div = document.createElement("div");
		// div.innerHTML = "" +
			// "<ul id='test1' class='parent'>" +
				// "<li class='child'>1</li>" +
				// "<li>2</li>" +
				// "<li class='child'>3<a>a</a></li>" +
			// "</ul>" +
			// "<ul id='test2'>" +
				// "<li>4</li>" +
				// "<li class='child'>5</li>" +
				// "<li>6<ul><li>6-1</li></ul></li>" +
			// "</ul>" +
			// "<ul class='parent'>" +
				// "<li>7</li>" +
				// "<li>8</li>" +
				// "<li class='child'>9</li>" +
			// "</ul>";
		// deepEqual(cssquery("div > li",div).length, 10);
	// });
    //QUnit.test("ets",function(){
		// deepEqual($$("div span", $("foo")).length, 0);
	// }
// });


function getArray(obj){
	var returnVal = [];
	
	for(var i in obj){
		returnVal.push(obj[i]);
	}
	
	return returnVal;
}

module('$$');


/*	QUnit.test("ie에서 release를 호출하면 모든 cache가 비워져야 한다.[[!document.querySelectorAll]]",function(){
		$$.release();
		cssquery.useCache(true);
		var p_list = $$('div > p',$("container"));
		
		var currentInfo = cssquery._getCacheInfo();
		console.log("-->", getArray(currentInfo["uidCache"]), p_list)


		deepEqual(getArray(currentInfo["uidCache"]), p_list);
		deepEqual(currentInfo["eleCache"]['div > p'][0]['parent'], $("container"));
		deepEqual(currentInfo["eleCache"]['div > p'][0]['result'], p_list);
		
		$$.release();
		
		currentInfo = cssquery._getCacheInfo();
		deepEqual(currentInfo["uidCache"], {});
		deepEqual(currentInfo["eleCache"], {});
	});*/


QUnit.test("selector를 이용하여 요소 탐색",function() {
		var aElements = $$('div > p');
		deepEqual(aElements.length, 34);
	});
QUnit.test("selector를 이용하여 요소 한개 탐색",function() {
		var oElements = $$.getSingle('div > p');
		deepEqual(oElements, $('_test_2'));
	});
QUnit.test("프로퍼티 검색할 경우 href로 검색이 안되는 경우.",function() {
//		@see http://bts.nhncorp.com/nhnbts/browse/AJAXUI-215
		deepEqual(jindo.$$("#cssquerytest a[href=#test]").length, 1);
	});
/*QUnit.test("oneTimeOffCache를 설정하면 cache가 설정이 되어 있어도 cache를 적용하면 안된다.[[!document.querySelectorAll]]",function(){
//		@see http://bts.nhncorp.com/nhnbts/browse/AJAXUI-237
		cssquery.useCache(true);
		$$.release();
		var currentInfo = cssquery._getCacheInfo();
		
		
		deepEqual(currentInfo["uidCache"], {});
		deepEqual(currentInfo["eleCache"], {});
		
		var p_list = $$('div > p',$("container"));
		
		var currentInfo = cssquery._getCacheInfo();
			
		deepEqual(getArray(currentInfo["uidCache"]), p_list);


		deepEqual(currentInfo["eleCache"]['div > p'][0]['parent'], $("container"));
		deepEqual(currentInfo["eleCache"]['div > p'][0]['result'], p_list);
		
		$$.release();
		currentInfo = cssquery._getCacheInfo();
		deepEqual(currentInfo["uidCache"], {});
		deepEqual(currentInfo["eleCache"], {});
		
		var p_list2 = $$('a[href=#asdf]',$("csscachetest"),{oneTimeOffCache: true});
		deepEqual(p_list2[0].outerHTML, "<A href=\"#asdf\">test</A>");
		
		
		var currentInfo2 = cssquery._getCacheInfo();
		
		deepEqual(currentInfo["eleCache"], {});
		
	});*/
QUnit.test("native selector bug",function(){
		deepEqual($$("div span", $("foo")).length, 0);
	});
QUnit.test("두번째 파라메터에 id를 넣은 경우 정상적으로 동작해야한다.",function(){
		deepEqual($$("span","cssquery_id_test").length, 1);
	});
QUnit.test("두번째 파라메터에서 에러가 발생하면 document로 설정된다.",function(){
		deepEqual($$("section").length, 1);//값은 변경될 수 있음.
	});
QUnit.test("아이디가 없는 경우 아이디를 생성하고 삭제한다.",function(){
		var div = $$.getSingle("#cssquery_id_delete_test div");
		deepEqual(div.id, "");
		var span = $$("span",div);
		deepEqual(span.length, 1);
		deepEqual(div.id, "");
	});
QUnit.test("기준 엘리먼트에 아이디가 없는 경우 속성을 할당하고 삭제한다.",function(){
	    //Given
	    var head = jindo.$$.getSingle(".head");
	    //When
		jindo.$$.getSingle("p",head);
		//Then
		deepEqual(head.getAttribute("queryid"), null);
});