QUnit.config.autostart = false;

/************************** $$_fragment_spec **************************/
module("div");
    QUnit.test("fragment에서 콤비네이터을 먼저 사용한 경우",function(){
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
        equal(cssquery("ul",div).length,4);
        equal(cssquery("ul > li",div).length,10);
        equal(cssquery("> ul",div).length,3);
        equal(cssquery("> ul > li",div).length,9);
        equal(cssquery(".parent",div).length,2);
        equal(cssquery(".child",div).length,4);
        equal(cssquery("#test1 .child",div).length,2);
        equal(cssquery("#test1 > div > a",div).length,0);
        equal(cssquery("#test1 li a",div).length,1);
        equal(cssquery("#test1 li > a",div).length,1);
        equal(cssquery("#test2 + ul li",div).length,3);
        equal(cssquery("#test2 li",div).length,4);
        equal(cssquery("#test2 a",div).length,0);
        equal(cssquery("#test2 + ul ~ ul",div).length,0);
    });
    QUnit.test("돔이 붙어 있는 상황에서 콤비네이터을 먼저 사용한 경우-상단에 아이디가 있는 경우.",function(){
        var div = $("com1");
        equal(cssquery("ul",div).length,4);
        equal(cssquery("ul > li",div).length,10);
        equal(cssquery("> ul",div).length,3);
        equal(cssquery("> ul > li",div).length,9);
        equal(cssquery(".parent",div).length,2);
        equal(cssquery(".child",div).length,4);
        equal(cssquery("#com1_test1 .child",div).length,2);
        equal(cssquery("#com1_test1 > div > a",div).length,0);
        equal(cssquery("#com1_test1 li a",div).length,1);
        equal(cssquery("#com1_test1 li > a",div).length,1);
        equal(cssquery("#com1_test2 + ul li",div).length,3);
        equal(cssquery("#com1_test2 li",div).length,4);
        equal(cssquery("#com1_test2 a",div).length,0);
        equal(cssquery("#com1_test2 + ul ~ ul",div).length,0);
        equal(cssquery("+ div",div).length,1);
        equal(cssquery("~ div",div).length,4);
    });
    QUnit.test("돔이 붙어 있는 상황에서 콤비네이터을 먼저 사용한 경우-상단에 아이디가 없는 경우.",function(){
        var div = $$.getSingle("#com1 + div");
        equal(cssquery("ul",div).length,4);
        equal(cssquery("ul > li",div).length,10);
        equal(cssquery("> ul",div).length,3);
        equal(cssquery("> ul > li",div).length,9);
        equal(cssquery(".parent",div).length,2);
        equal(cssquery(".child",div).length,4);
        equal(cssquery("#com2_test1 .child",div).length,2);
        equal(cssquery("#com2_test1 > div > a",div).length,0);
        equal(cssquery("#com2_test1 li a",div).length,1);
        equal(cssquery("#com2_test1 li > a",div).length,1);
        equal(cssquery("#com2_test2 + ul li",div).length,3);
        equal(cssquery("#com2_test2 li",div).length,4);
        equal(cssquery("#com2_test2 a",div).length,0);
        equal(cssquery("#com2_test2 + ul ~ ul",div).length,0);
        equal(cssquery("+ div",div).length,1);
        equal(cssquery("~ div",div).length,3);
    });

module("document");
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
        ul2.innerHTML = "<li>4</li>" +
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
        equal(cssquery("ul",doc).length,4);
        equal(cssquery("ul > li",doc).length,10);
        equal(cssquery("> ul",doc).length,3);
        equal(cssquery("> ul > li",doc).length,9);
        equal(cssquery(".parent",doc).length,2);
        equal(cssquery(".child",doc).length,4);
        equal(cssquery("#test1 .child",doc).length,2);
        equal(cssquery("#test1 > div > a",doc).length,0);
        equal(cssquery("#test1 li a",doc).length,1);
        equal(cssquery("#test1 li > a",doc).length,1);
        equal(cssquery("#test2 + ul li",doc).length,3);
        equal(cssquery("#test2 li",doc).length,4);
        equal(cssquery("#test2 a",doc).length,0);
        equal(cssquery("#test2 + ul ~ ul",doc).length,0);
    });
    QUnit.test("document, body일 때.",function(){
        equal(cssquery("> input").length,0);
        equal(cssquery("> input",document.body).length,11);
    }
);

module("!, !>, !~, !+ 쿼리 파싱");
    QUnit.test("#test ! li",function(){
            //Given
            var fixture = {
                '#test ! li' : "!",
                '#test !> li' : "!>",
                '#test !~ li' : "!~",
                '#test!+li' : "!+",
                '#test!li' : "!",
                '#test!>li' : "!>",
                '#test!~li' : "!~",
                '#test!+li' : "!+"
            }

            //When
            for(var  i in fixture){

                var obj = cssquery._makeQueryParseTree(i);

                var result = [{
                    "left" : "#test",
                    "com" : fixture[i],
                    "right" : "li"
                }];
               //Then
               deepEqual(obj,result);
            }

    });
    QUnit.test("! li",function(){
            //Given
            var fixture = {
                '! li' : "!",
                '!> li' : "!>",
                '!~ li' : "!~",
                '!+li' : "!+",
                '!li' : "!",
                '!>li' : "!>",
                '!~li' : "!~",
                '!+li' : "!+"
            }

            //When
            for(var  i in fixture){

                var obj = cssquery._makeQueryParseTree(i);

                var result = [{
                    "left" : "",
                    "com" : fixture[i],
                    "right" : "li"
                }];
               //Then
               deepEqual(obj,result);
            }

    });
    QUnit.test("#test ! li something",function(){
            //Given
            var fixture = {
                '#test ! li something' : "!",
                '#test !> li something' : "!>",
                '#test !~ li something' : "!~",
                '#test !+ li something' : "!+",
                '#test!li something' : "!",
                '#test!>li something' : "!>",
                '#test!~li something' : "!~",
                '#test!+li something' : "!+"
            }

            //When
            for(var  i in fixture){

                var obj = cssquery._makeQueryParseTree(i);

                var result = [{
                    "left" : "#test",
                    "com" : fixture[i],
                    "right" : "li"
                },{
                    "left" : "something",
                    "com" : "",
                    "right" : ""
                }];
               //Then
               deepEqual(obj,result);
            }

    });
    QUnit.test("! li something",function(){
            //Given
            var fixture = {
                '! li something' : "!",
                '!> li something' : "!>",
                '!~ li something' : "!~",
                '!+ li something' : "!+",
                '!li something' : "!",
                '!>li something' : "!>",
                '!~li something' : "!~",
                '!+li something' : "!+"
            }

            //When
            for(var  i in fixture){

                var obj = cssquery._makeQueryParseTree(i);

                var result = [{
                    "left" : "",
                    "com" : fixture[i],
                    "right" : "li"
                },{
                    "left" : "something",
                    "com" : "",
                    "right" : ""
                }];
               //Then
               deepEqual(obj,result);
            }

    });
    QUnit.test("#test img !> div > span ! span div",function(){
        //Given
        var result = [{
            "left" : "#test img",
            "com" : "!>",
            "right" : "div"
        },{
            "left" : "> span",
            "com" : "!",
            "right" : "span"
        },{
            "left" : "div",
            "com" : "",
            "right" : ""
        }];
        var result2 = [{
            "left" : "#test img",
            "com" : "!>",
            "right" : "div"
        },{
            "left" : ">span",
            "com" : "!",
            "right" : "span"
        },{
            "left" : "div",
            "com" : "",
            "right" : ""
        }];

        //When
        var obj = cssquery._makeQueryParseTree("#test img !> div > span ! span div");
        var obj2 = cssquery._makeQueryParseTree("#test img!>div>span!span div");

        //Then
        deepEqual(obj,result);
        deepEqual(obj2,result2);
    });
    QUnit.test("div ! span",function(){
        deepEqual(cssquery._makeQueryParseTree("div ! span"), [{
            "left" : "div",
            "com" : "!",
            "right" : "span"
        }]);
        deepEqual(cssquery._makeQueryParseTree("div!span"), [{
            "left" : "div",
            "com" : "!",
            "right" : "span"
        }]);
    });
    QUnit.test("div span ! p",function(){
        deepEqual(cssquery._makeQueryParseTree("div span ! p"), [{
            "left" : "div span",
            "com" : "!",
            "right" : "p"
        }]);
        deepEqual(cssquery._makeQueryParseTree("div span!p"), [{
            "left" : "div span",
            "com" : "!",
            "right" : "p"
        }]);
    });
    QUnit.test("div span !> p",function(){
        deepEqual(cssquery._makeQueryParseTree("div span !> p"), [{
            "left" : "div span",
            "com" : "!>",
            "right" : "p"
        }]);
        deepEqual(cssquery._makeQueryParseTree("div span!>p"), [{
            "left" : "div span",
            "com" : "!>",
            "right" : "p"
        }]);
    });
    QUnit.test("span ! div ! span",function(){
        deepEqual(cssquery._makeQueryParseTree("span ! div ! span"), [{
            "left" : "span",
            "com" : "!",
            "right" : "div"
        },{
            "left" : "",
            "com" : "!",
            "right" : "span"
        }]);
        deepEqual(cssquery._makeQueryParseTree("span!div!span"), [{
            "left" : "span",
            "com" : "!",
            "right" : "div"
        },{
            "left" : "",
            "com" : "!",
            "right" : "span"
        }]);
    });
    QUnit.test("span !> div ! span",function(){
        deepEqual(cssquery._makeQueryParseTree("span !> div ! span"),[{
            "left" : "span",
            "com" : "!>",
            "right" : "div"
        },{
            "left" : "",
            "com" : "!",
            "right" : "span"
        }]);
        deepEqual(cssquery._makeQueryParseTree("span!>div!span"),[{
            "left" : "span",
            "com" : "!>",
            "right" : "div"
        },{
            "left" : "",
            "com" : "!",
            "right" : "span"
        }]);
    });
    QUnit.test("img ! div",function(){
        deepEqual(cssquery._makeQueryParseTree("img ! div"),[{
            "left" : "img",
            "com" : "!",
            "right" : "div"
        }]);
        deepEqual(cssquery._makeQueryParseTree("img!div"),[{
            "left" : "img",
            "com" : "!",
            "right" : "div"
        }]);
    });
    QUnit.test("img !> div",function(){
        deepEqual(cssquery._makeQueryParseTree("img !> div"),[{
            "left" : "img",
            "com" : "!>",
            "right" : "div"
        }]);
        deepEqual(cssquery._makeQueryParseTree("img!>div"),[{
            "left" : "img",
            "com" : "!>",
            "right" : "div"
        }]);
    });
    QUnit.test("img ! div span ! span",function(){
        deepEqual(cssquery._makeQueryParseTree("img ! div span ! span"),[{
            "left" : "img",
            "com" : "!",
            "right" : "div"
        },{
            "left" : "span",
            "com" : "!",
            "right" : "span"
        }]);
        deepEqual(cssquery._makeQueryParseTree("img!div span!span"),[{
            "left" : "img",
            "com" : "!",
            "right" : "div"
        },{
            "left" : "span",
            "com" : "!",
            "right" : "span"
        }]);
    });
    QUnit.test("img ! div span ! span div",function(){
        deepEqual(cssquery._makeQueryParseTree("img ! div span ! span div"),[{
            "left" : "img",
            "com" : "!",
            "right" : "div"
        },{
            "left" : "span",
            "com" : "!",
            "right" : "span"
        },{
            "left" : "div",
            "com" : "",
            "right" : ""
        }]);
        deepEqual(cssquery._makeQueryParseTree("img!div span!span div"),[{
            "left" : "img",
            "com" : "!",
            "right" : "div"
        },{
            "left" : "span",
            "com" : "!",
            "right" : "span"
        },{
            "left" : "div",
            "com" : "",
            "right" : ""
        }]);
    });
    QUnit.test("img !> div span ! span div",function(){
        deepEqual(cssquery._makeQueryParseTree("img !> div span ! span div"),[{
            "left" : "img",
            "com" : "!>",
            "right" : "div"
        },{
            "left" : "span",
            "com" : "!",
            "right" : "span"
        },{
            "left" : "div",
            "com" : "",
            "right" : ""
        }]);
        deepEqual(cssquery._makeQueryParseTree("img!>div span!span div"),[{
            "left" : "img",
            "com" : "!>",
            "right" : "div"
        },{
            "left" : "span",
            "com" : "!",
            "right" : "span"
        },{
            "left" : "div",
            "com" : "",
            "right" : ""
        }]);
    });
    QUnit.test("li ! ul",function(){
        deepEqual(cssquery._makeQueryParseTree("li ! ul"),[{
            "left" : "li",
            "com" : "!",
            "right" : "ul"
        }]);
        deepEqual(cssquery._makeQueryParseTree("li!ul"),[{
            "left" : "li",
            "com" : "!",
            "right" : "ul"
        }]);
    });
    QUnit.test("ul li span ! span",function(){
        deepEqual(cssquery._makeQueryParseTree("ul li span ! span"),[{
            "left" : "ul li span",
            "com" : "!",
            "right" : "span"
        }]);
        deepEqual(cssquery._makeQueryParseTree("ul li span!span"),[{
            "left" : "ul li span",
            "com" : "!",
            "right" : "span"
        }]);
    });
    QUnit.test("ul li span ! span span",function(){
        deepEqual(cssquery._makeQueryParseTree("ul li span ! span span"),[{
            "left" : "ul li span",
            "com" : "!",
            "right" : "span"
        },{
            "left" : "span",
            "com" : "",
            "right" : ""
        }]);
        deepEqual(cssquery._makeQueryParseTree("ul li span!span span"),[{
            "left" : "ul li span",
            "com" : "!",
            "right" : "span"
        },{
            "left" : "span",
            "com" : "",
            "right" : ""
        }]);
    });
    QUnit.test("ul li span ! span span ! div",function(){
        deepEqual(cssquery._makeQueryParseTree("ul li span ! span span ! div"),[{
            "left" : "ul li span",
            "com" : "!",
            "right" : "span"
        },{
            "left" : "span",
            "com" : "!",
            "right" : "div"
        }]);
        deepEqual(cssquery._makeQueryParseTree("ul li span!span span!div"),[{
            "left" : "ul li span",
            "com" : "!",
            "right" : "span"
        },{
            "left" : "span",
            "com" : "!",
            "right" : "div"
        }]);
    });
    QUnit.test("div !~ div",function(){
        deepEqual(cssquery._makeQueryParseTree("div !~ div"),[{
            "left" : "div",
            "com" : "!~",
            "right" : "div"
        }]);
        deepEqual(cssquery._makeQueryParseTree("div!~div"),[{
            "left" : "div",
            "com" : "!~",
            "right" : "div"
        }]);
    });
    QUnit.test("div !+ div",function(){
        deepEqual(cssquery._makeQueryParseTree("div !+ div"),[{
            "left" : "div",
            "com" : "!+",
            "right" : "div"
        }]);
        deepEqual(cssquery._makeQueryParseTree("div!+div"),[{
            "left" : "div",
            "com" : "!+",
            "right" : "div"
        }]);
    });
    QUnit.test("div !~ p",function(){
        deepEqual(cssquery._makeQueryParseTree("div !~ p"),[{
            "left" : "div",
            "com" : "!~",
            "right" : "p"
        }]);
        deepEqual(cssquery._makeQueryParseTree("div!~p"),[{
            "left" : "div",
            "com" : "!~",
            "right" : "p"
        }]);
    });
    QUnit.test("div p !~ p span",function(){
        deepEqual(cssquery._makeQueryParseTree("div p !~ p span"),[{
            "left" : "div p",
            "com" : "!~",
            "right" : "p"
        },{
            "left" : "span",
            "com" : "",
            "right" : ""
        }]);
        deepEqual(cssquery._makeQueryParseTree("div p!~p span"),[{
            "left" : "div p",
            "com" : "!~",
            "right" : "p"
        },{
            "left" : "span",
            "com" : "",
            "right" : ""
        }]);
    });
    QUnit.test("p !~ p span !~ span",function(){
        deepEqual(cssquery._makeQueryParseTree("p !~ p span !~ span"),[{
            "left" : "p",
            "com" : "!~",
            "right" : "p"
        },{
            "left" : "span",
            "com" : "!~",
            "right" : "span"
        }]);
        deepEqual(cssquery._makeQueryParseTree("p!~p span!~span"),[{
            "left" : "p",
            "com" : "!~",
            "right" : "p"
        },{
            "left" : "span",
            "com" : "!~",
            "right" : "span"
        }]);
    });
    QUnit.test("span !+ span * ! div",function(){
        deepEqual(cssquery._makeQueryParseTree("span !+ span * ! div"),[{
            "left" : "span",
            "com" : "!+",
            "right" : "span"
        },{
            "left" : "*",
            "com" : "!",
            "right" : "div"
        }]);
        deepEqual(cssquery._makeQueryParseTree("span!+span * !div"),[{
            "left" : "span",
            "com" : "!+",
            "right" : "span"
        },{
            "left" : "*",
            "com" : "!",
            "right" : "div"
        }]);
    }


);
// module("document");
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
        // equal(cssquery("div > li",div).length,10);
    // },
    // QUnit.test("ets",function(){
        // equal($$("div span", $("foo")).length,0);
    // }
// });


/************************** $$_selector_spec **************************/

// var selector_api_and_count = {	"body":1, 'div':52, 'body div':51, 'div p':140, 'div > p':134, 'div + p':22, 'div ~ p':183, 'div[class^=exa][class$=mple]':43, 'div p a':12, 'div, p, a':672,
// 							  	'.note':14, 'div.example':43, 'ul .tocline2':12, 'div.example, div.note':44, '#title':1, 'h1#title':1, 'div #title':1, 'ul.toc li.tocline2':12, 'ul.toc > li.tocline2':12,
// 								'h1#title + div > p':0, 'h1[id]:contains(Selectors)':1, 'a[href][lang][class]':1, 'div[class]':51, 'div[class=example]':43, 'div[class^=exa]':43, 'div[class$=mple]':43,
// 								'div[class*=e]':50, 'div[class|=dialog]':0, 'div[class!=made_up]':51, 'div[class~=example]':43, 'div:not(.example)':9, 'p:contains(selectors)':54, 'p:nth-child(even)':158,
// 								'p:nth-child(2n)':158, 'p:nth-child(odd)':166, 'p:nth-child(2n+1)':166, 'p:nth-child(n)':324, 'p:only-child':3, 'p:last-child':19, 'p:first-child':54};

var selector_api_and_count = 	{'body':1, 'div':47, 'body div':46, 'div p':70, 'div > p':64, 'div + p':12, 'div ~ p':165, 'div[class^=exa][class$=mple]':34, 'div p a':13, 'div, p, a':568,
								'.note':3, 'div.example':34, 'ul .tocline2':12, 'div.example, div.note':37, '#title':0, 'h1#title':0, 'div #title':0, 'ul.toc li.tocline2':12, 'ul.toc > li.tocline2':12,
								'h1#title + div > p':0, 'h1[id]:contains(Selectors)':0, 'a[href][lang][class]':0, 'div[class]':45, 'div[class=example]':34, 'div[class^=exa]':34, 'div[class$=mple]':36,
								'div[class*=e]':44, 'div[class|=dialog]':0, 'div[class!=made_up]':47, 'div[class~=example]':34, 'div:not(.example)':13, 'p:contains(selectors)':49, 'p:nth-child(even)':100,
								'p:nth-child(2n)':100, 'p:nth-child(odd)':133, 'p:nth-child(2n+1)':133, 'p:nth-child(n)':233, 'p:only-child':2, 'p:last-child':14, 'p:first-child':26}

								// {'body':0, 'div':5, 'body div':5, 'div p':70, 'div > p':70, 'div + p':10, 'div ~ p':18, 'div[class^=exa][class$=mple]':9, 'div p a':-1, 'div, p, a':104,
								// '.note':11, 'div.example':9, 'ul .tocline2':0, 'div.example, div.note':7, '#title':1, 'h1#title':1, 'div #title':1, 'ul.toc li.tocline2':0, 'ul.toc > li.tocline2':0,
								// 'h1#title + div > p':0, 'h1[id]:contains(Selectors)':1, 'a[href][lang][class]':1, 'div[class]':6, 'div[class=example]':9, 'div[class^=exa]':9, 'div[class$=mple]':7,
								// 'div[class*=e]':6, 'div[class|=dialog]':0, 'div[class!=made_up]':4, 'div[class~=example]':9, 'div:not(.example)':-4, 'p:contains(selectors)':5, 'p:nth-child(even)':58,
								// 'p:nth-child(2n)':58, 'p:nth-child(odd)':33, 'p:nth-child(2n+1)':33, 'p:nth-child(n)':91, 'p:only-child':1, 'p:last-child':5, 'p:first-child':28}


// http://wiki.nhncorp.com/display/lsuit/cssquery
// :empty
// :nth-last-child
// :nth-of-type
// :nth-last-of-type
// :first-of-type
// :last-of-type
// !
// !>
// !~
// !+
// ,
// cssquery('input[type=checkbox][checked=true]'); // 체크되어 있는 input[type=checkbx] 만 얻기
// http://www.w3.org/TR/css3-selectors/#checked 이걸로 마이그레이션 가능한지 확인.
// :not(:selected) 이렇게 대체 할수 있음.
// cssquery('textarea[disabled=false]'); // 활성화되어 있는 textarea 만 얻기
// cssquery('div[@display=none]'); // display CSS 속성이 none 인 div 만 얻기
var _doc;
// div의 개수를 체크 할때는 firebug을 닫고 할것.
module("$$ 인자 스팩.");

	QUnit.test("documentElment가 들어간 경우 정상적으로 동작해야 함.",function(){
		//Given
		var length;
		//When
		length = $$("div",document.documentElement).length;
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
        _doc = $("selector_test").contentWindow.document;
    }
});

	QUnit.test("대문자 class확인.",function(){
		equal($$('.TEST2',_doc).length,1);
	});
	QUnit.test("p[data-id=test]",function(){
		equal($$('#property-test p[data-id=test]',document).length,1);
		equal($$('p[data-id=test]',document.getElementById("property-test")).length,1);
	});
	QUnit.test(":nth-of-type",function(){
		equal($$('p:nth-of-type(3)',_doc).length,9);
	});
	QUnit.test(":nth-last-of-type",function(){
		equal($$('p:nth-last-of-type(3)',_doc).length,9);
	});
	QUnit.test(":first-of-type",function(){
		equal($$('p:first-of-type',_doc).length,32);
	});
	QUnit.test(":last-of-type",function(){
		equal($$('p:last-of-type',_doc).length,32);
	});
	QUnit.test(":nth-last-child",function(){
		equal($$('div:nth-last-child(1)',_doc).length,0);
	});
	QUnit.test(":empty",function(){
		equal($$('div:empty',_doc).length,2);
	});
	QUnit.test("div[class~=example]",function(){
	    equal($$('div[class~=example]',_doc).length,34);
	});
	QUnit.test("a[href][lang][class]",function(){
	    equal($$('a[href][lang][class]',_doc).length,0);
	});
	QUnit.test("p:first-child",function(){
	    equal($$('p:first-child',_doc).length,26);
	});
	QUnit.test("div.example",function(){
	    equal($$('div.example',_doc).length,34);
	});
	QUnit.test(".note",function(){
	    equal($$('.note',_doc).length,3);
	});
	QUnit.test("div p a",function(){
	    equal($$('div p a',_doc).length,13);
	});
	QUnit.test("div > p",function(){
	    equal($$('div > p',_doc).length,64);
	});
	QUnit.test("body",function(){
	    equal($$('body',_doc).length,1);
	});
	QUnit.test("div[class=example]",function(){
	    equal($$('div[class=example]',_doc).length,34);
	});
	QUnit.test("div[class]",function(){
	    equal($$('div[class]',_doc).length,45);
	});
	QUnit.test("ul.toc > li.tocline2",function(){
	    equal($$('ul.toc > li.tocline2',_doc).length,12);
	});
	QUnit.test("ul.toc li.tocline2",function(){
	    equal($$('ul.toc li.tocline2',_doc).length,12);
	});
	QUnit.test("p:nth-child(2n)",function(){
	    equal($$('p:nth-child(2n)',_doc).length,100);
	});
	QUnit.test("p:nth-child(even)",function(){
	    equal($$('p:nth-child(even)',_doc).length,100);
	});
	QUnit.test("div[class*=e]",function(){
	    equal($$('div[class*=e]',_doc).length,44);
	});
	QUnit.test("div + p",function(){
	    equal($$('div + p',_doc).length,12);
	});
	QUnit.test("div p",function(){
	    equal($$('div p',_doc).length,70);
	});
	QUnit.test("p:last-child",function(){
	    equal($$('p:last-child',_doc).length,14);
	});
	QUnit.test("div:not(.example)",function(){
	    equal($$('div:not(.example)',_doc).length,13);
	});
	QUnit.test("div[class|=dialog]",function(){
	    equal($$('div[class|=dialog]',_doc).length,0);
	});
	QUnit.test("div[class$=mple]",function(){
	    equal($$('div[class$=mple]',_doc).length,36);
	});
	QUnit.test("div, p, a",function(){
		var div_num = _doc.getElementsByTagName('div').length;
		var p_num = _doc.getElementsByTagName('p').length;
		var a_num = _doc.getElementsByTagName('a').length;
	    equal($$('div, p, a',_doc).length,div_num + p_num + a_num);
	});
	QUnit.test("div[class^=exa][class$=mple]",function(){
	    equal($$('div[class^=exa][class$=mple]',_doc).length,34);
	});
	QUnit.test("div",function(){
	    equal($$('div',_doc).length,47);
	});
	QUnit.test("p:nth-child(odd)",function(){
	    equal($$('p:nth-child(odd)',_doc).length,133);
	});
	QUnit.test("div.example, div.note",function(){
	    equal($$('div.example, div.note',_doc).length,37);
	});
	QUnit.test("ul .tocline2",function(){
	    equal($$('ul .tocline2',_doc).length,12);
	});
	QUnit.test("p:nth-child(2n+1)",function(){
	    equal($$('p:nth-child(2n+1)',_doc).length,133);
	});
	QUnit.test("div[class^=exa]",function(){
	    equal($$('div[class^=exa]',_doc).length,34);
	});
	QUnit.test("div #title",function(){
	    equal($$('div #title',_doc).length,0);
	});
	QUnit.test("body div",function(){
	    equal($$('body div',_doc).length,47);
	});
	QUnit.test("p:only-child",function(){
	    equal($$('p:only-child',_doc).length,2);
	});
	QUnit.test("div ~ p",function(){
	    equal($$('div ~ p',_doc).length,165);
	});
	QUnit.test("p:nth-child(n)",function(){
	    equal($$('p:nth-child(n)',_doc).length,233);
	});
	QUnit.test("h1#title + div > p",function(){
	    equal($$('h1#title + div > p',_doc).length,0);
	});
	QUnit.test("h1#title",function(){
	    equal($$('h1#title',_doc).length,0);
	});
	QUnit.test("#title",function(){
	    equal($$('#title',_doc).length,0);
	}
);

module("New Cssquery");
	QUnit.test("html5가 없는 브라우저에서 html5도 찾아야 한다.",function(){
		//Given
		//When
		var btn = $$("#html5tag .btn");
		//Then
		equal(btn.length,1);
		equal(btn[0].tagName.toLowerCase(),"input");
	});
	QUnit.test("cssquery에서 id을 속성으로 변경.",function(){
        //Given
        //When
        var aEle = $$(".property_test ul",$$("div.property_parent")[0]);
        //Then
        equal(aEle.length,1);
        equal(aEle[0].tagName.toLowerCase(),"ul");
    });

    QUnit.test("[key=val]을 찾을 때 val가 숫자이면 ''로 묶어서 처리하여 정상적으로 처리한다.",function(){
        //Given
        //When
        var aEle = $$("ul li[date=1212]");
        //Then
        equal(aEle.length,1);
        equal(aEle[0].tagName.toLowerCase(),"li");
    });
    QUnit.test(",이 스페이스 없으면 정상적으로 쿼리가 안됨",function(){
        //Given
        //When
        var aEle1 = $$("div,span",$("cssquery_903"));
        var aEle2 = $$("div, span",$("cssquery_903"));
        var aEle3 = $$("div , span",$("cssquery_903"));
        //Then
        equal(aEle1.length,4);
        equal(aEle2.length,4);
        equal(aEle3.length,4);

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
    }

);

module("!, !>, !~, !+", {
    setup: function() {
        doc = $("selector_excl").contentWindow.document;
    }
});

	QUnit.test("div ! span",function(){
		equal($$("div ! span", doc).length,5);
	});
	QUnit.test("div span ! p",function(){
		equal($$("div span ! p", doc).length,2);
	});
	QUnit.test("div span !> p",function(){
		equal($$("div span !> p", doc).length,2);
	});
	QUnit.test("span ! div ! span",function(){
		equal($$("span ! div ! span", doc).length,3);
	});
	QUnit.test("span !> div ! span",function(){
		equal($$("span !> div ! span", doc).length,2);
	});
	QUnit.test("img ! div",function(){
		equal($$("img ! div", doc).length,5);
	});
	QUnit.test("img ! div",function(){
		equal($$.getSingle("img ! div", doc),$$("#div5", doc)[0]);
	});
	QUnit.test("img !> div",function(){
		equal($$("img !> div", doc).length,2);
	});
	QUnit.test("img ! div span ! span",function(){
		equal($$("img ! div span ! span", doc).length,2);
	});
	QUnit.test("img ! div span ! span div",function(){
		equal($$("img ! div span ! span div", doc).length,6);
	});
	QUnit.test("img !> div span ! span div",function(){
		equal($$("img !> div span ! span div", doc).length,6);
	});
	QUnit.test("li ! ul",function(){
		equal($$("li ! ul", doc).length,1);
	});
	QUnit.test("ul li span ! span",function(){
		equal($$("ul li span ! span", doc).length,2);
	});
	QUnit.test("ul li span ! span span",function(){
		equal($$("ul li span ! span span", doc).length,5);
	});
	QUnit.test("ul li span ! span span ! div",function(){
		equal($$("ul li span ! span span ! div", doc).length,1);
	});
	QUnit.test("div !~ div",function(){
		equal($$("div !~ div", doc).length,20);
	});
	QUnit.test("div !+ div",function(){
		equal($$("div !+ div", doc).length,13);
	});
	QUnit.test("div !~ p",function(){
		equal($$("div !~ p", doc).length,12);
	});
	QUnit.test("div p !~ p span",function(){
		equal($$("div p !~ p span", doc).length,1);
	});
	QUnit.test("p !~ p span !~ span",function(){
		equal($$("p !~ p span !~ span", doc).length,0);
	});
	QUnit.test("span !+ span * ! div",function(){
		equal($$("span !+ span * ! div", doc).length,2);
	}
);


module("New Cssquery");
    QUnit.test("html5가 없는 브라우저에서 html5도 찾아야 한다.",function(){
        //Given
        //When
        var btn = $$("#html5tag .btn");
        //Then
        equal(btn.length,1);
        equal(btn[0].tagName.toLowerCase(),"input");
    });
    QUnit.test("cssquery에서 id을 속성으로 변경.",function(){
        //Given
        //When
        var aEle = $$(".property_test ul",$$("div.property_parent")[0]);
        //Then
        equal(aEle.length,1);
        equal(aEle[0].tagName.toLowerCase(),"ul");
    });
    QUnit.test("[key=val]을 찾을 때 val가 숫자이면 ''로 묶어서 처리하여 정상적으로 처리한다.",function(){
        //Given
        //When
        var aEle = $$("ul li[date=1212]");
        //Then
        equal(aEle.length,1);
        equal(aEle[0].tagName.toLowerCase(),"li");
    });
    QUnit.test(",이 스페이스 없으면 정상적으로 쿼리가 안됨",function(){
        //Given
        //When
        var aEle1 = $$("div,span",$("cssquery_903"));
        var aEle2 = $$("div, span",$("cssquery_903"));
        var aEle3 = $$("div , span",$("cssquery_903"));
        //Then
        equal(aEle1.length,4);
        equal(aEle2.length,4);
        equal(aEle3.length,4);

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
        equal(ele.length,1);
    }
);