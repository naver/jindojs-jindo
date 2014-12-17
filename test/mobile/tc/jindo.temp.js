QUnit.config.autostart = false;

module("!, !>, !~, !+");
    QUnit.test("delegate된 event에 속성 변경",function(){
        //Given
        var element, srcElement, delegatedElement, relatedElement, currentElement;
        $Element("jindosus_1322").delegate("click","li",function(e){
            element = e.element;
            srcElement = e.srcElement;
            currentElement = e.currentElement;
            relatedElement = e.relatedElement;
            delegatedElement = e.delegatedElement;
        });

        //When
        $Element("jindosus_1322").query("a").fireEvent("click");

        //Then
        equal((element.tagName).toLowerCase(),"li");
        equal((srcElement.tagName).toLowerCase(),"a");
        equal((currentElement.tagName).toLowerCase(),"div");
        deepEqual(relatedElement, null);
        equal((delegatedElement.tagName).toLowerCase(),"li");

    });
    QUnit.test("delegate로 이벤트가 발생했을 때 바인딩한 함수의 이벤트는 서로 다른 $Event객체여야 한다",function(){
        //Given
        var firstEvent, secondEvent;
        $Element("jindosus_1322").delegate("click","li",function(e){
           firstEvent = e;
        });
        $Element("jindosus_1322").delegate("click","li",function(e){
           secondEvent = e;
        });

        //When
        $Element("jindosus_1322").query("a").fireEvent("click");

        //Then
        ok(firstEvent !== secondEvent);
    });
    QUnit.test("일반 event에 속성 변경",function(){
        //Given
        var element, srcElement, delegatedElement, relatedElement, currentElement;
        $Element("jindosus_1322").attach("click",function(e){
            element = e.element;
            srcElement = e.srcElement;
            currentElement = e.currentElement;
            relatedElement = e.relatedElement;
            delegatedElement = e.delegatedElement;
        });

        //When
        $Element("jindosus_1322").query("a").fireEvent("click");

        //Then
        equal((element.tagName).toLowerCase(),"a");
        equal((srcElement.tagName).toLowerCase(),"a");
        equal((currentElement.tagName).toLowerCase(),"div");
        deepEqual(relatedElement, null);
        deepEqual(delegatedElement, null);

    });
    QUnit.test("이벤트가 발생했을 때 바인딩한 함수의 이벤트는 서로 다른 $Event객체여야 한다",function(){
        //Given
        var firstEvent, secondEvent;
        $Element("jindosus_1322").attach("click",function(e){
           firstEvent = e;
        });
        $Element("jindosus_1322").attach("click",function(e){
           secondEvent = e;
        });

        //When
        $Element("jindosus_1322").query("a").fireEvent("click");

        //Then
        ok(firstEvent !== secondEvent);
    });