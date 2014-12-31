QUnit.config.autostart = false;

//-- $Element.attach --
var _attach_call_count = 0;
var richEle;
function _attach_test(){ _attach_call_count += 1;};
function _attach_test2(){ _attach_call_count += 2;};
function _attach_test3(){ _attach_call_count += 3;};
function _attach_test4(){ _attach_call_count += 4;};

var delegate;

function classTest(){
    $("log").innerHTML = "classTest";
}
function classTest2(){
    $("log").innerHTML = "classTest2";
}
function combinator(){
    $("log").innerHTML = "combinator";
}
function check(ele , fireEvent){
    if(fireEvent.innerHTML == "4"){
        return true;
    }
    return false;
}

function checkTest(e){
    $("log").innerHTML = "checkTest";
}

function logReset(){
    $("log").innerHTML = "";
}

var  ScopeTest = {
    test : function(){
        equal(this,ScopeTest);
    }
}
var NONE_GROUP = "_jindo_event_none";

var checkStr = "";

function customParent(){
    checkStr += "-parent";
}

function customChild(){
    checkStr += "-child";
}


jindo.$Event.customEvent("something");
jindo.$Element("custom_child").attach("something",customChild);
jindo.$Element("custom_parent").attach("something",customParent);

module("$Event#customEvent에서 두 번째 인자가 없어도 ",{
    setup: function() {
        checkStr = "";
    }
});

    QUnit.test("실행시킬 수 있어야 한다.",function(){
        //Given
        //When
        jindo.$Element("custom_parent").fireEvent("something");
        //Then
        equal(checkStr,"-parent");
    });
    QUnit.test("버블링이 되어야 한다.",function(){
        //Given
        //When
        jindo.$Element("custom_child").fireEvent("something");
        //Then
        equal(checkStr,"-child-parent");
    });
    QUnit.test("정상적으로 detach되어야 한다.",function(){
        //Given
        //When
        jindo.$Element("custom_parent").detach("something",customParent);
        jindo.$Element("custom_child").detach("something",customChild);

        jindo.$Element("custom_child").fireEvent("something");
        jindo.$Element("custom_parent").fireEvent("something");
        //Then
        ok(!checkStr);

    });

jindo.$Event.customEvent("somename");
jindo.$Element("custom_parent").attach("somename@li",customParent);

module("$Event#customEvent에서 delegate일때 두 번째 인자가 없어도 ",{
    setup: function(){
        checkStr = "";
    }
});

    QUnit.test("실행시킬 수 있어야 한다.",function(){
        //Given
        //When
        jindo.$Element(jindo.$$.getSingle("#custom_parent li")).fireEvent("somename");
        //Then
        equal(checkStr,"-parent");
    });
    QUnit.test("정상적으로 detach되어야 한다.",function(){
        //Given
        //When
        jindo.$Element("custom_parent").detach("somename@li",customParent);
        jindo.$Element(jindo.$$.getSingle("#custom_parent li")).fireEvent("somename");

        //Then
        ok(!checkStr);

    }
);

jindo.$Event.customEvent("some",{
    "mousedown" : function(we){
        this.decision = true;
    },
    "mouseup" : function(we){
        if(this.decision){
            this.fireEvent(we);
        }
    }
});
jindo.$Element("custom_child").attach("some",customChild);
jindo.$Element("custom_parent").attach("some",customParent);

module("$Event#customEvent에서",{
    setup: function() {
        checkStr = "";
    }
});

    QUnit.test("실행시킬 수 있어야 한다.",function(){
        //Given
        //When
        jindo.$Element("custom_parent").fireEvent("some");
        //Then
        equal(checkStr,"-parent");
    });
    QUnit.test("버블링이 되어야 한다.",function(){
        //Given
        //When
        jindo.$Element("custom_child").fireEvent("some");
        //Then
        equal(checkStr,"-child-parent");
    });
    QUnit.test("정상적으로 detach되어야 한다.",function(){
        //Given
        //When
        jindo.$Element("custom_parent").detach("some",customParent);
        jindo.$Element("custom_child").detach("some",customChild);

        jindo.$Element("custom_child").fireEvent("some");
        jindo.$Element("custom_parent").fireEvent("some");
        //Then
        ok(!checkStr);

    }
);

jindo.$Event.customEvent("sometwo",{
    "mousedown" : function(we){
        this.decision = true;
    },
    "mouseup" : function(we){
        if(this.decision){
            this.fireEvent(we);
        }
    }
});
jindo.$Element("custom_parent").attach("sometwo@li",customParent);

module("$Event#customEvent에서 delegate일때", {
    setup: function(){
        checkStr = "";
    }
});

    QUnit.test("실행시킬 수 있어야 한다.",function(){
        //Given
        //When
        jindo.$Element(jindo.$$.getSingle("#custom_parent li")).fireEvent("sometwo");
        //Then
        equal(checkStr,"-parent");
    });
    QUnit.test("정상적으로 detach되어야 한다.",function(){
        //Given
        //When
        jindo.$Element("custom_parent").detach("sometwo@li",customParent);
        jindo.$Element(jindo.$$.getSingle("#custom_parent li")).fireEvent("sometwo");

        //Then
        ok(!checkStr);

    }
);

module("$Element attach", {
    setup: function(){
        _attach_call_count = 0;
    }
});

    QUnit.test("일반 attach을 하면 eventManager에 NONE_GROUP으로 셋팅되어야 한다.",function(){
        //Given
        var NONE_GROUP = "_jindo_event_none";
        richEle = $Element("new_attach_test");
        //When
        richEle.attach("click",_attach_test);
        //Then
        var oConfig = jindo.$Element.eventManager.getEventConfig(richEle._key);
        equal(oConfig.ele.id,richEle.attr("id"));
        ok(jindo.$Jindo.isFunction(oConfig.event.click.listener));
        equal(oConfig.event.click.type[NONE_GROUP].normal.length,1);
    });
    QUnit.test("이벤트를 fire하면 정상적으로 실행되어야 한다.",function(){
        //Given
        //When
        equal(_attach_call_count,0);
        richEle.fireEvent("click");
        //Then
        equal(_attach_call_count,1);
    });
    // QUnit.test("그룹으로 attach하면 그룹으로 셋팅되어야 한다.",function(){
        // //Given
        // //When
        // richEle.attach("click(test)",_attach_test2);
        // richEle.attach("click(test)",_attach_test3);
        // richEle.attach("click(test)",_attach_test4);
        // //Then
        // var oConfig = jindo.$Element.eventManager.getEventConfig(richEle._key);
        // equal(oConfig.event.click.type["test"].normal.length,3);
    // },
    // QUnit.test("그룹으로 attach해도 fire는 정상적으로 되어야 한다.",function(){
        // //Given
        // //When
        // equal(_attach_call_count,0);
        // richEle.fireEvent("click");
        // //Then
        // equal(_attach_call_count,1+2+3+4);
    // },
    // QUnit.test("그룹으로 detach할 때 정상적으로 되어야 한다.",function(){
        // //Given
        // //When
        // equal(_attach_call_count,0);
        // richEle.detach("click(test)",_attach_test2)
        // richEle.fireEvent("click");
        // //Then
        // equal(_attach_call_count,1+3+4);
    // },
    // QUnit.test("그룹으로 detach할 때 함수을 넣지 않으면 모두 삭제된다.",function(){
        // //Given
        // //When
        // equal(_attach_call_count,0);
        // richEle.detach("click(test)")
        // richEle.fireEvent("click");
        // //Then
        // equal(_attach_call_count,1);
    // },
    QUnit.test("일반 detach는 반드시 함수를 넣어야지만 해제가 된다.",function(){
        //Given
        var occurException =false;
        equal(_attach_call_count,0);
        //When
        try{
            richEle.detach("click");
        }catch(e){
            occurException = true;
        }
        //Then
        ok(occurException);

        //When
        richEle.fireEvent("click");
        //Then
        equal(_attach_call_count,1);

        //Given
        _attach_call_count = 0;
        //When
        richEle.detach("click",_attach_test);
        richEle.fireEvent("click");
        //Then
        equal(_attach_call_count,0);

        var oConfig = jindo.$Element.eventManager.getEventConfig(richEle._key);
        deepEqual(oConfig, undefined);
    });
    QUnit.test("자신의 엘리먼트도 조건문에 대상이 되어야 한다.",function(){
        //Given
        logReset();
        $Element("parent").delegate("click",".ch1",classTest);
        //When
        $Element("parent").fireEvent("click");
        //Then
        equal($("log").innerHTML,"classTest");

    });
    QUnit.test(".ch1인 엘리먼트가 클릭이 되면 이벤트는 발생되어야 한다.",function(){
        //Given
        logReset();
        $Element("parent").undelegate("click",".ch1",classTest);
        $Element("parent").delegate("click",".ch1",classTest);
        //When
        $Element($$.getSingle(".ch1")).fireEvent("click");
        //Then
        equal($("log").innerHTML,"classTest");

        //Given
        var jindo_id = $("parent").__jindo__id;
        //When
        var oInfo = jindo.$Element.eventManager.test();
        //Then
        equal(oInfo[jindo_id].ele,$("parent"));
        ok($Jindo.isFunction(oInfo[jindo_id].event.click.listener));
        equal(oInfo[jindo_id].event.click.type[NONE_GROUP].delegate[".ch1"].callback.length,1);
    });
    QUnit.test(".ch1을 unbind를 하면 해당 이벤트는 발생되지 않는다.",function(){
        //Given
        logReset();
        $Element("parent").undelegate("click",".ch1",classTest);
        //When
        $Element($$.getSingle(".ch1")).fireEvent("click");
        //Then
        equal($("log").innerHTML,"");


        //Given
        var jindo_id = $("parent").__jindo__id;
        //When
        var oInfo = jindo.$Element.eventManager.test();
        //Then
        deepEqual(oInfo[jindo_id], undefined);

    });
    QUnit.test("attach을 이용하여 delegate를 사용할 수 있어야 한다.",function(){
        //Given
        logReset();
        $Element("parent").attach("click@.ch1",classTest);
        //When
        $Element($$.getSingle(".ch1")).fireEvent("click");
        //Then
        equal($("log").innerHTML,"classTest");

        //Given
        var jindo_id = $("parent").__jindo__id;
        //When
        var oInfo = jindo.$Element.eventManager.test();
        //Then
        equal(oInfo[jindo_id].ele,$("parent"));
        ok($Jindo.isFunction(oInfo[jindo_id].event.click.listener));
        equal(oInfo[jindo_id].event.click.type[NONE_GROUP].delegate[".ch1"].callback.length,1);
    });
    QUnit.test("detach을 이용하여 undelegate를 사용할 수 있어야 한다.",function(){
        //Given
        logReset();
        $Element("parent").detach("click@.ch1",classTest);
        //When
        $Element($$.getSingle(".ch1")).fireEvent("click");
        //Then
        equal($("log").innerHTML,"");


        //Given
        var jindo_id = $("parent").__jindo__id;
        //When
        var oInfo = jindo.$Element.eventManager.test();
        //Then
        deepEqual(oInfo[jindo_id], undefined);

    });
    QUnit.test("오브젝트를 파라메터로 attach을 이용하여 delegate를 사용할 수 있어야 한다.",function(){
        //Given
        logReset();
        $Element("parent").attach({
            "click@.ch1":classTest,
            "click@.ch2":classTest2,
        });
        //When
        $Element($$.getSingle(".ch1")).fireEvent("click");
        //Then
        equal($("log").innerHTML,"classTest");

        //When
        $Element($$.getSingle(".ch2")).fireEvent("click");
        //Then
        equal($("log").innerHTML,"classTest2");

        //Given
        var jindo_id = $("parent").__jindo__id;
        //When
        var oInfo = jindo.$Element.eventManager.test();
        //Then
        equal(oInfo[jindo_id].ele,$("parent"));
        ok($Jindo.isFunction(oInfo[jindo_id].event.click.listener));
        equal(oInfo[jindo_id].event.click.type[NONE_GROUP].delegate[".ch1"].callback.length,1);

        //Given
        var jindo_id = $("parent").__jindo__id;
        //When
        var oInfo = jindo.$Element.eventManager.test();
        //Then
        equal(oInfo[jindo_id].ele,$("parent"));
        ok($Jindo.isFunction(oInfo[jindo_id].event.click.listener));
        equal(oInfo[jindo_id].event.click.type[NONE_GROUP].delegate[".ch2"].callback.length,1);
    });
    QUnit.test("오브젝트를 파라메터로 detach을 이용하여 undelegate를 사용할 수 있어야 한다.",function(){
        //Given
        logReset();
        $Element("parent").detach({
            "click@.ch1":classTest,
            "click@.ch2":classTest2,
        });
        //When
        $Element($$.getSingle(".ch1")).fireEvent("click");
        //Then
        equal($("log").innerHTML,"");
        //When
        $Element($$.getSingle(".ch2")).fireEvent("click");
        //Then
        equal($("log").innerHTML,"");


        //Given
        var jindo_id = $("parent").__jindo__id;
        //When
        var oInfo = jindo.$Element.eventManager.test();
        //Then
        deepEqual(oInfo[jindo_id], undefined);

    });
    QUnit.test("check함수에 참일 경우만 이벤트를 발생되어야 한다.",function(){
        logReset();
        $Element("parent").delegate("click",check,checkTest);
        $Element($$(".ch2")[1]).fireEvent("click");
        equal($("log").innerHTML,"checkTest");

        logReset();
        $Element($$.getSingle(".ch3")).fireEvent("click");
        equal($("log").innerHTML,"checkTest");

        logReset();
        $Element($$.getSingle(".ch1")).fireEvent("click");
        equal($("log").innerHTML,"");
    });
    QUnit.test("check함수를 unbind하면 해당 이벤트는 발생하지 않는다.",function(){
        logReset();
        $Element("parent").undelegate("click",check,checkTest);
        $Element($$(".ch2")[1]).fireEvent("click");
        equal($("log").innerHTML,"");

        logReset();
        $Element($$.getSingle(".ch3")).fireEvent("click");
        equal($("log").innerHTML,"");
    });
    QUnit.test("scope를 유지 하기 위해서는 bind를 사용해야 한다.",function(){
        logReset();
        var fp = $Fn(ScopeTest.test,ScopeTest).bind();
        $Element("parent").delegate("click",".ch2", fp);
        $Element($$(".ch2")[1]).fireEvent("click");
        $Element("parent").undelegate("click",".ch2", fp);

    });
    QUnit.test("연속 두개 등록해도 정상 작동하는가?",function(){
        var count = 0;
        function plus1(){
            count +=1 ;
        }
        function plus2(){
            count +=2 ;
        }
        $Element("parent").delegate("click",".ch1",plus1);
        $Element("parent").delegate("click",".ch1",plus2);

        $Element($$(".ch1")[0]).fireEvent("click");
        equal(count,3);

        $Element("parent").delegate("click",".ch2",plus1);
        $Element($$(".ch2")[0]).fireEvent("click");
        equal(count,4);

        $Element("parent").delegate("click",".ch3",plus1);
        $Element($$(".ch3")[0]).fireEvent("click");
        equal(count,5);

        //Given
        var jindo_id = $("parent").__jindo__id;
        //When
        $Element("parent").undelegate("click", ".ch1" ,plus1);
        var oInfo = jindo.$Element.eventManager.test();
        //Then
        equal(oInfo[jindo_id].ele,$("parent"));
        ok($Jindo.isFunction(oInfo[jindo_id].event.click.listener));
        equal(oInfo[jindo_id].event.click.type[NONE_GROUP].delegate[".ch1"].callback.length,1);

        //When
        $Element("parent").undelegate("click", ".ch1" ,plus2);
        var oInfo = jindo.$Element.eventManager.test();
        //Then
        equal(oInfo[jindo_id].ele,$("parent"));
        ok($Jindo.isFunction(oInfo[jindo_id].event.click.listener));
        equal(oInfo[jindo_id].event.click.type[NONE_GROUP].delegate[".ch1"].callback.length,0);


        //When
        $Element("parent").undelegate("click", ".ch2" ,plus1);
        var oInfo = jindo.$Element.eventManager.test();
        //Then
        equal(oInfo[jindo_id].ele,$("parent"));
        ok($Jindo.isFunction(oInfo[jindo_id].event.click.listener));
        equal(oInfo[jindo_id].event.click.type[NONE_GROUP].delegate[".ch2"].callback.length,0);

        //When
        $Element("parent").undelegate("click", ".ch3" ,plus1);
        var oInfo = jindo.$Element.eventManager.test();
        //Then
        deepEqual(oInfo[jindo_id], undefined);

    });
    QUnit.test("delegate에서도 콤비네이터를 사용할 수 있어야 함.",function(){
        //Given
        logReset();
        $Element("delegate_combinator").delegate("click",".open_layer a",combinator);
        //When
        $Element("combinator").fireEvent("click");
        //Then
        equal($("log").innerHTML,"combinator");
    });
    QUnit.test("delegate안에서 사용하는 undelegate에서도 정상적으로 해제되어야 한다.",function(){
        //Given
        logReset();
        $Element("delegate_combinator").delegate("click",".open_layer a",function(){
            combinator();
            this.undelegate("click",".open_layer a");
        });
        //When
        $Element("combinator").fireEvent("click");
        //Then
        equal($("log").innerHTML,"combinator");



        //Given
        logReset();
        //When
        $Element("combinator").fireEvent("click");
        //Then
        equal($("log").innerHTML,"");
    });


//-- $Element --
QUnit.config.autostart = false;

//-- $Element --
var delegate;

function classTest(){
    $("log").innerHTML = "classTest";
}

function check(ele, fireEvent){
    if (fireEvent.innerHTML == "4") {
        return true;
    }
    return false;
}

function checkTest(e){
    $("log").innerHTML = "checkTest";
}

function logReset(){
    $("log").innerHTML = "";
}

var ScopeTest = {
    test: function(){
        equal(this,ScopeTest);
    }
}

var getStyleIncludeVendorPrefix = jindo._p_.getStyleIncludeVendorPrefix;
module("$Element에서 벤더 Prefix랑 자동 prefix변환", {
    teardown: function() {
        jindo._p_.getStyleIncludeVendorPrefix = getStyleIncludeVendorPrefix;
    }
});
    QUnit.test("jindo._p_.getStyleIncludeVendorPrefix이 웹킷에서 정상적으로 동작하는지",function(){
        //Given
        //When
        var result = jindo._p_.getStyleIncludeVendorPrefix({
            "webkitTransition" : true,
            "webkitTransform" : true,
            "webkitAnimation" : true,
            "webkitPerspective" : true
        });

        deepEqual(result, {
            "transition":"webkitTransition",
            "transform":"webkitTransform",
            "animation":"webkitAnimation",
            "perspective":"webkitPerspective"
        });
    });
    QUnit.test("jindo._p_.getStyleIncludeVendorPrefix이 모질라에서 정상적으로 동작하는지",function(){
        //Given
        //When
        var result = jindo._p_.getStyleIncludeVendorPrefix({
            "MozTransition" : true,
            "MozTransform" : true,
            "MozAnimation" : true,
            "MozPerspective" : true
        });

        //Then
        deepEqual(result,{
            "transition":"MozTransition",
            "transform":"MozTransform",
            "animation":"MozAnimation",
            "perspective":"MozPerspective"
        });
    });
    QUnit.test("jindo._p_.getStyleIncludeVendorPrefix이 오페라에서 정상적으로 동작하는지",function(){
        //Given
        //When
        var result = jindo._p_.getStyleIncludeVendorPrefix({
            "OTransition" : true,
            "OTransform" : true,
            "OAnimation" : true,
            "OPerspective" : true
        });

        //Then
        deepEqual(result, {
            "transition":"OTransition",
            "transform":"OTransform",
            "animation":"OAnimation",
            "perspective":"OPerspective"
        });
    });
    QUnit.test("jindo._p_.getStyleIncludeVendorPrefix이 IE에서 정상적으로 동작하는지",function(){
        //Given
        //When
        var result = jindo._p_.getStyleIncludeVendorPrefix({
            "msTransition" : true,
            "msTransform" : true,
            "msAnimation" : true,
            "msPerspective" : true
        });

        //Then
       deepEqual(result,{
            "transition":"msTransition",
            "transform":"msTransform",
            "animation":"msAnimation",
            "perspective":"msPerspective"
        });
    });
    QUnit.test("jindo._p_.getStyleIncludeVendorPrefix이 기본에서 정상적으로 동작하는지",function(){
        //Given
        //When
        var result = jindo._p_.getStyleIncludeVendorPrefix({
            "transition" : true,
            "transform" : true,
            "animation" : true,
            "perspective" : true
        });

        //Then
        deepEqual(result, {
            "transition":"transition",
            "transform":"transform",
            "animation":"animation",
            "perspective":"perspective"
        });
    });
    QUnit.test("jindo._p_.getStyleIncludeVendorPrefix이 지원하지 않는 브라우저",function(){
        //Given
        //When
        var result = jindo._p_.getStyleIncludeVendorPrefix({
        });

        //Then
        deepEqual(result, {
            "transition":false,
            "transform":false,
            "animation":false,
            "perspective":false
        });
    });
    QUnit.test("jindo._p_.getStyleIncludeVendorPrefix에서 스타일이 겹쳐져 있는 경우 IE을 제외하고는 기본으로 나와야 한다.",function(){
        //Given
        //When
        var result = jindo._p_.getStyleIncludeVendorPrefix({
            "webkitTransition" : true,
            "webkitTransform" : true,
            "webkitAnimation" : true,
            "webkitPerspective" : true,
            "transition" : true,
            "transform" : true,
            "animation" : true,
            "perspective" : true
        });

        //Then
        deepEqual(result, {
            "transition":"webkitTransition",
            "transform":"webkitTransform",
            "animation":"webkitAnimation",
            "perspective":"webkitPerspective"
        });

        //Given
        //When
        result = jindo._p_.getStyleIncludeVendorPrefix({
            "msTransition" : true,
            "msTransform" : true,
            "msAnimation" : true,
            "msPerspective" : true,
            "transition" : true,
            "transform" : true,
            "animation" : true,
            "perspective" : true
        });

        //Then
        deepEqual(result, {
            "transition":"transition",
            "transform":"transform",
            "animation":"animation",
            "perspective":"perspective"
        });

        //Given
        //When
        result = jindo._p_.getStyleIncludeVendorPrefix({
            "MozTransition" : true,
            "MozTransform" : true,
            "MozAnimation" : true,
            "MozPerspective" : true,
            "transition" : true,
            "transform" : true,
            "animation" : true,
            "perspective" : true
        });

        //Then
        deepEqual(result, {
            "transition":"transition",
            "transform":"transform",
            "animation":"animation",
            "perspective":"perspective"
        });

        //Given
        //When
        result = jindo._p_.getStyleIncludeVendorPrefix({
            "OTransition" : true,
            "OTransform" : true,
            "OAnimation" : true,
            "OPerspective" : true,
            "transition" : true,
            "transform" : true,
            "animation" : true,
            "perspective" : true
        });

        //Then
        deepEqual(result, {
            "transition":"transition",
            "transform":"transform",
            "animation":"animation",
            "perspective":"perspective"
        });
    });
    QUnit.test("jindo._p_._revisionCSSAttr은 정상적으로 스타일을 반환한다.-webkit",function(){
        //Given
        var styles = [
        "animation",
        "animation-name",
        "animation-duration",
        "animation-timing-function",
        "animation-delay",
        "animation-iteration-count",
        "animation-direction",
        "animation-play-state",
        "perspective",
        "perspective-origin",
        "transform",
        "transform-origin",
        "transform-style",
        "transition",
        "transition-property",
        "transition-duration",
        "transition-timing-function",
        "transition-delay"];

        var styles2 = [
        "Animation",
        "AnimationName",
        "AnimationDuration",
        "AnimationTimingFunction",
        "AnimationDelay",
        "AnimationIterationCount",
        "AnimationDirection",
        "AnimationPlayState",
        "Perspective",
        "PerspectiveOrigin",
        "Transform",
        "TransformOrigin",
        "TransformStyle",
        "Transition",
        "TransitionProperty",
        "TransitionDuration",
        "TransitionTimingFunction",
        "TransitionDelay"];

        var webkitStyles = [
        "webkitAnimation",
        "webkitAnimationName",
        "webkitAnimationDuration",
        "webkitAnimationTimingFunction",
        "webkitAnimationDelay",
        "webkitAnimationIterationCount",
        "webkitAnimationDirection",
        "webkitAnimationPlayState",
        "webkitPerspective",
        "webkitPerspectiveOrigin",
        "webkitTransform",
        "webkitTransformOrigin",
        "webkitTransformStyle",
        "webkitTransition",
        "webkitTransitionProperty",
        "webkitTransitionDuration",
        "webkitTransitionTimingFunction",
        "webkitTransitionDelay"];

        var vendorPrefix = jindo._p_.getStyleIncludeVendorPrefix({
            "webkitTransition" : true,
            "webkitTransform" : true,
            "webkitAnimation" : true,
            "webkitPerspective" : true,
            "transition" : true,
            "transform" : true,
            "animation" : true,
            "perspective" : true});

        var style = "";
        for(var i = 0, l = styles.length; i < l; i++){
            //When
            style = jindo._p_._revisionCSSAttr(styles[i],vendorPrefix);
            //Then
            equal(style,webkitStyles[i]);
        }
        for(var i = 0, l = styles2.length; i < l; i++){
            //When
            style = jindo._p_._revisionCSSAttr(styles2[i],vendorPrefix);
            //Then
            equal(style,webkitStyles[i]);
        }
    });
    QUnit.test("jindo._p_._revisionCSSAttr은 정상적으로 스타일을 반환한다.-ms",function(){
        //Given
        var styles = [
        "animation",
        "animation-name",
        "animation-duration",
        "animation-timing-function",
        "animation-delay",
        "animation-iteration-count",
        "animation-direction",
        "animation-play-state",
        "perspective",
        "perspective-origin",
        "transform",
        "transform-origin",
        "transform-style",
        "transition",
        "transition-property",
        "transition-duration",
        "transition-timing-function",
        "transition-delay"];

        var styles2 = [
        "Animation",
        "AnimationName",
        "AnimationDuration",
        "AnimationTimingFunction",
        "AnimationDelay",
        "AnimationIterationCount",
        "AnimationDirection",
        "AnimationPlayState",
        "Perspective",
        "PerspectiveOrigin",
        "Transform",
        "TransformOrigin",
        "TransformStyle",
        "Transition",
        "TransitionProperty",
        "TransitionDuration",
        "TransitionTimingFunction",
        "TransitionDelay"];

        var msStyles = [
        "animation",
        "animationName",
        "animationDuration",
        "animationTimingFunction",
        "animationDelay",
        "animationIterationCount",
        "animationDirection",
        "animationPlayState",
        "perspective",
        "perspectiveOrigin",
        "transform",
        "transformOrigin",
        "transformStyle",
        "transition",
        "transitionProperty",
        "transitionDuration",
        "transitionTimingFunction",
        "transitionDelay"];

        var vendorPrefix = jindo._p_.getStyleIncludeVendorPrefix({
            "msTransition" : true,
            "msTransform" : true,
            "msAnimation" : true,
            "msPerspective" : true,
            "transition" : true,
            "transform" : true,
            "animation" : true,
            "perspective" : true});

        var style = "";
        for(var i = 0, l = styles.length; i < l; i++){
            //When
            style = jindo._p_._revisionCSSAttr(styles[i],vendorPrefix);
            //Then
            equal(style,msStyles[i]);
        }
        for(var i = 0, l = styles2.length; i < l; i++){
            //When
            style = jindo._p_._revisionCSSAttr(styles2[i],vendorPrefix);
            //Then
            equal(style,msStyles[i]);
        }
    });
    QUnit.test("jindo._p_._revisionCSSAttr은 정상적으로 스타일을 반환한다.-moz",function(){
        //Given
        var styles = [
        "animation",
        "animation-name",
        "animation-duration",
        "animation-timing-function",
        "animation-delay",
        "animation-iteration-count",
        "animation-direction",
        "animation-play-state",
        "perspective",
        "perspective-origin",
        "transform",
        "transform-origin",
        "transform-style",
        "transition",
        "transition-property",
        "transition-duration",
        "transition-timing-function",
        "transition-delay"];

        var styles2 = [
        "Animation",
        "AnimationName",
        "AnimationDuration",
        "AnimationTimingFunction",
        "AnimationDelay",
        "AnimationIterationCount",
        "AnimationDirection",
        "AnimationPlayState",
        "Perspective",
        "PerspectiveOrigin",
        "Transform",
        "TransformOrigin",
        "TransformStyle",
        "Transition",
        "TransitionProperty",
        "TransitionDuration",
        "TransitionTimingFunction",
        "TransitionDelay"];

        var mozStyles = [
        "animation",
        "animationName",
        "animationDuration",
        "animationTimingFunction",
        "animationDelay",
        "animationIterationCount",
        "animationDirection",
        "animationPlayState",
        "perspective",
        "perspectiveOrigin",
        "MozTransform",
        "MozTransformOrigin",
        "MozTransformStyle",
        "MozTransition",
        "MozTransitionProperty",
        "MozTransitionDuration",
        "MozTransitionTimingFunction",
        "MozTransitionDelay"];

        var vendorPrefix = jindo._p_.getStyleIncludeVendorPrefix({
            "MozTransition" : true,
            "MozTransform" : true,
            "MozAnimation" : true,
            "MozPerspective" : true,
            // "transition" : false,
            // "transform" : false,
            "animation" : true,
            "perspective" : true});

        var style = "";
        for(var i = 0, l = styles.length; i < l; i++){
            //When
            style = jindo._p_._revisionCSSAttr(styles[i],vendorPrefix);
            //Then
            equal(style,mozStyles[i]);
        }
        for(var i = 0, l = styles2.length; i < l; i++){
            //When
            style = jindo._p_._revisionCSSAttr(styles2[i],vendorPrefix);
            //Then
            equal(style,mozStyles[i]);
        }
    });
    QUnit.test("jindo._p_._revisionCSSAttr은 정상적으로 스타일을 반환한다.-o",function(){
        //Given
        var styles = [
        "animation",
        "animation-name",
        "animation-duration",
        "animation-timing-function",
        "animation-delay",
        "animation-iteration-count",
        "animation-direction",
        "animation-play-state",
        "perspective",
        "perspective-origin",
        "transform",
        "transform-origin",
        "transform-style",
        "transition",
        "transition-property",
        "transition-duration",
        "transition-timing-function",
        "transition-delay"];

        var styles2 = [
        "Animation",
        "AnimationName",
        "AnimationDuration",
        "AnimationTimingFunction",
        "AnimationDelay",
        "AnimationIterationCount",
        "AnimationDirection",
        "AnimationPlayState",
        "Perspective",
        "PerspectiveOrigin",
        "Transform",
        "TransformOrigin",
        "TransformStyle",
        "Transition",
        "TransitionProperty",
        "TransitionDuration",
        "TransitionTimingFunction",
        "TransitionDelay"];

        var oStyles = [
        "animation",
        "animationName",
        "animationDuration",
        "animationTimingFunction",
        "animationDelay",
        "animationIterationCount",
        "animationDirection",
        "animationPlayState",
        "perspective",
        "perspectiveOrigin",
        "OTransform",
        "OTransformOrigin",
        "OTransformStyle",
        "OTransition",
        "OTransitionProperty",
        "OTransitionDuration",
        "OTransitionTimingFunction",
        "OTransitionDelay"];

        var vendorPrefix = jindo._p_.getStyleIncludeVendorPrefix({
            "OTransition" : true,
            "OTransform" : true,
            "OAnimation" : true,
            "OPerspective" : true,
            // "transition" : false,
            // "transform" : false,
            "animation" : true,
            "perspective" : true});

        var style = "";
        for(var i = 0, l = styles.length; i < l; i++){
            //When
            style = jindo._p_._revisionCSSAttr(styles[i],vendorPrefix);
            //Then
            equal(style,oStyles[i]);
        }
        for(var i = 0, l = styles2.length; i < l; i++){
            //When
            style = jindo._p_._revisionCSSAttr(styles2[i],vendorPrefix);
            //Then
            equal(style,oStyles[i]);
        }
    });
    QUnit.test("jindo._p_._revisionCSSAttr은 이미 prefix가 있는 경우는 변경하지 않는다.",function(){
        //Given

        var vendorPrefix = jindo._p_.getStyleIncludeVendorPrefix({
            "OTransition" : true,
            "OTransform" : true,
            "OAnimation" : true,
            "OPerspective" : true,
            // "transition" : false,
            // "transform" : false,
            "animation" : true,
            "perspective" : true});

        //When
        style = jindo._p_._revisionCSSAttr("webkitAnimation",vendorPrefix);
        //Then
        equal(style,"webkitAnimation");

        //When
        style = jindo._p_._revisionCSSAttr("-webkit-animation",vendorPrefix);
        //Then
        equal(style,"webkitAnimation");

    });
    QUnit.test("jindo._p_.getTransformStringForValue는 적절하게 스타일을 반환되어야 한다.-webkit",function(){

        //Given
        var data = {
            "webkitTransition" : true,
            "webkitTransform" : true,
            "webkitAnimation" : true,
            "webkitPerspective" : true,
            "transition" : true,
            "transform" : true,
            "animation" : true,
            "perspective" : true
       };

       //When
       var transform = jindo._p_.getTransformStringForValue(data);

       //Then
       equal(transform,"-webkit-transform");

    });
    QUnit.test("jindo._p_.getTransformStringForValue는 적절하게 스타일을 반환되어야 한다.-moz",function(){

        //Given
        var data = {
            "MozTransition" : true,
            "MozTransform" : true,
            "MozAnimation" : true,
            "MozPerspective" : true
       };

       //When
       var transform = jindo._p_.getTransformStringForValue(data);

       //Then
       equal(transform,"-moz-transform");

    });
    QUnit.test("jindo._p_.getTransformStringForValue는 적절하게 스타일을 반환되어야 한다.-ms",function(){

        //Given
        var data = {
            "msTransition" : true,
            "msTransform" : true,
            "msAnimation" : true,
            "msPerspective" : true
       };

       //When
       var transform = jindo._p_.getTransformStringForValue(data);

       //Then
       equal(transform,"-ms-transform");

    });
    QUnit.test("jindo._p_.getTransformStringForValue는 적절하게 스타일을 반환되어야 한다.-o",function(){

        //Given
        var data = {
            "OTransition" : true,
            "OTransform" : true,
            "OAnimation" : true,
            "OPerspective" : true
       };

       //When
       var transform = jindo._p_.getTransformStringForValue(data);

       //Then
       equal(transform,"-o-transform");

    });
    QUnit.test("jindo._p_.getTransformStringForValue는 적절하게 스타일을 반환되어야 한다.-none",function(){

        //Given
        var data = {
            "transform" : true
       };

       //When
       var transform = jindo._p_.getTransformStringForValue(data);

       //Then
       equal(transform,"transform");

    });
    QUnit.test("jindo._p_.changeTransformValue는 value가 transform일 경우 정상적으로 설정해야 한다.-webkit",function(){

        //Given
       var data = {
            "webkitTransition" : true,
            "webkitTransform" : true,
            "webkitAnimation" : true,
            "webkitPerspective" : true,
            "transition" : true,
            "transform" : true,
            "animation" : true,
            "perspective" : true
       };

       //When
       var transform = jindo._p_.changeTransformValue("width 2s, height 2s, transform 2s",data);

       //Then
       equal(transform,"width 2s, height 2s, -webkit-transform 2s");

       //Given
       //When
       var transform = jindo._p_.changeTransformValue("width 2s, height 2s, color 2s",data);

       //Then
       equal(transform,"width 2s, height 2s, color 2s");

    });
    QUnit.test("jindo._p_.changeTransformValue는 value가 transform일 경우 정상적으로 설정해야 한다.-moz",function(){

        //Given
       var data = {
            "MozTransition" : true,
            "MozTransform" : true,
            "MozAnimation" : true,
            "MozPerspective" : true
       };

       //When
       var transform = jindo._p_.changeTransformValue("width 2s, height 2s, transform 2s",data);

       //Then
       equal(transform,"width 2s, height 2s, -moz-transform 2s");

       //Given
       //When
       var transform = jindo._p_.changeTransformValue("width 2s, height 2s, color 2s",data);

       //Then
       equal(transform,"width 2s, height 2s, color 2s");

    });
    QUnit.test("jindo._p_.changeTransformValue는 value가 transform일 경우 정상적으로 설정해야 한다.-o",function(){

        //Given
       var data = {
            "OTransition" : true,
            "OTransform" : true,
            "OAnimation" : true,
            "OPerspective" : true
       };

       //When
       var transform = jindo._p_.changeTransformValue("width 2s, height 2s, transform 2s",data);

       //Then
       equal(transform,"width 2s, height 2s, -o-transform 2s");

       //Given
       //When
       var transform = jindo._p_.changeTransformValue("width 2s, height 2s, color 2s",data);

       //Then
       equal(transform,"width 2s, height 2s, color 2s");

    });

    QUnit.test("jindo._p_.changeTransformValue는 value가 transform일 경우 정상적으로 설정해야 한다.-ms",function(){

        //Given
       var data = {
            "msTransition" : true,
            "msTransform" : true,
            "msAnimation" : true,
            "msPerspective" : true
       };

       //When
       var transform = jindo._p_.changeTransformValue("width 2s, height 2s, transform 2s",data);

       //Then
       equal(transform,"width 2s, height 2s, -ms-transform 2s");

       //Given
       //When
       var transform = jindo._p_.changeTransformValue("width 2s, height 2s, color 2s",data);

       //Then
       equal(transform,"width 2s, height 2s, color 2s");

    });
    QUnit.test("jindo._p_.changeTransformValue는 value가 transform일 경우 정상적으로 설정해야 한다.-none",function(){

        //Given
       var data = {
            "transform" : true
       };

       //When
       var transform = jindo._p_.changeTransformValue("width 2s, height 2s, transform 2s",data);

       //Then
       equal(transform,"width 2s, height 2s, transform 2s");

       //Given
       //When
       var transform = jindo._p_.changeTransformValue("width 2s, height 2s, color 2s",data);

       //Then
       equal(transform,"width 2s, height 2s, color 2s");

    });
    QUnit.test("jindo._p_.changeTransformValue는 값에 prefix가 이미 있는 경우라면 변경하지 않는다.",function(){

        //Given
       var data = {
            "transform" : true
       };

       //When
       var transform = jindo._p_.changeTransformValue("width 2s, height 2s, -ms-transform 2s",data);

       //Then
       equal(transform,"width 2s, height 2s, -ms-transform 2s");

    }

);
module("$Element 메서드 중 this 컨텍스트", {
    setup: function() {
        weThisTest = $Element("this_test");
    }
});
	// QUnit.test("appearQUnit.test(",function(){
		// appeartest.html에서 코드로 작성함.appear",function(){
	// },

	QUnit.test("attach",function(){
		//Given
		var i=0,that;
		weThisTest.attach("click",function(){
			i++;
			that = this;
		});
		//When
		weThisTest.fireEvent("click");
		//Then
		equal(i,1);
		deepEqual(that,weThisTest);

	});
	QUnit.test("delegate",function(){
		//Given
		var i=0,that;
		weThisTest.delegate("click","span",function(){
			i++;
			that = this;
		});
		//When
		$Element("delegate_span_test").fireEvent("click");
		//Then
		equal(i,1);
		deepEqual(that,weThisTest);
	});
	QUnit.test("child",function(){
		//Given
		var i=0,that;
		//When
		weThisTest.child(function(){
			i++;
			that = this;
		});
		//Then
		equal(i,1);
		deepEqual(that,weThisTest);

	});
	QUnit.test("parent",function(){
		//Given
		var i=0,that;
		//When
		weThisTest.parent(function(){
			i++;
			that = this;
		});
		//Then
		equal(i,1);
		deepEqual(that,weThisTest);

	});
	QUnit.test("next",function(){
		//Given
		var i=0,that;
		//When
		weThisTest.next(function(){
			i++;
			that = this;
		});
		//Then
		ok(i>1);
		deepEqual(that,weThisTest);
	});
	QUnit.test("prev",function(){
		//Given
		var i=0,that;
		//When
		weThisTest.prev(function(){
			i++;
			that = this;
		});
		//Then
		ok(i>1);
		deepEqual(that,weThisTest);
	}
);
module("$Element 객체");
    QUnit.test("$Element 객체가 잘 생성되나?",function(){
        ok($Element('abs') instanceof $Element);
        ok($Element($('abs')) instanceof $Element);
        equal($Element(),null);

        occurException = false;
        try {
            $Element(null);
        }
        catch (e) {
            occurException = true;
        }
        ok(!occurException);
        occurException = false;
        try {
            $Element("asfasdfasd");
        }
        catch (e) {
            occurException = true;
        }
        ok(!occurException);


    });
    QUnit.test("$Element 객체를 넣으면 다시 그대로 반환되나?",function(){
        var el = $Element('abs');
        equal($Element(el),el);
    });
    QUnit.test("$value : 원래의 DOM 객체가 반환되는가?",function(){
        var div = $('abs');
        equal($Element(div).$value(),div);
        equal($Element('abs').$value(),div);
    });
    QUnit.test("html을 인자가 없은 상태에서 처음 사용시 반환 값은 html string이여아 한다",function(){
        equal($Element("html_Test").html().toUpperCase(),"<span>1</span>".toUpperCase());
    });
    QUnit.test("html : 엘리먼트의 HTML 잘 셋팅하는지?",function(){
        var el = $Element('tr_test');
        el.html('<td>바껴라</td><td>후후후</td>');
        equal(el.text(),'바껴라후후후');

        var el2 = $Element('<tr>');
        el2.html('<td>바껴라</td><td>후후후</td>');
        equal(el2.html(),el.html());

        var el3 = $Element('txt');
        el3.evalScripts('<scr' + 'ipt type="text/javascript"> jindo2_html_1 = 1; </scr' + 'ipt><span>C</span><scr' + 'ipt type="text/javascript"> jindo2_html_2 = 2; </scr' + 'ipt>');
        equal(jindo2_html_1,1);
        equal(jindo2_html_2,2);

    });
    QUnit.test("text : HTML 코드상의 줄바꿈, 탭, 공백 문자까지 반환하는가?",function(){
    	var wel = $Element("element_text_test_div");
    	deepEqual(wel.text(),"\n\tjohn\n\tdoe\n");
    });
    QUnit.test("text : 텍스트 노드의 값은 잘 가져오고 설정하는지?",function(){
        var el = $Element('txt');
        equal(el.text(),'C');
        el.text('B');
        equal(el.$value().innerHTML,'B');
    });
    QUnit.test("offset : 위치값을 잘 설정합니까?",function(){
        $Element("container").show();

        var rel = $Element("rel");
        var abs = $Element("abs");

        var rel_pos = rel.offset();
        rel.offset(rel_pos.top + 10, rel_pos.left + 30);
        deepEqual(rel.offset(),{
            top: rel_pos.top + 10,
            left: rel_pos.left + 30
        });

        var abs_pos = abs.offset();
        abs.offset(abs_pos.top + 10, abs_pos.left - 5);
        deepEqual(abs.offset(), {
            top: abs_pos.top + 10,
            left: abs_pos.left - 5
        });

        $Element("container").hide();
    });
    // QUnit.test("offset은 IE7에서 iframe에 border가 있어도 offset은 정성이어야 한다.",function(){
    // 		var normal = $("normal_iframe").contentWindow.getOffset();
    // 		var border = $("border_iframe").contentWindow.getOffset();
    //
    // 		equal({"left":normal.left,"top":normal.top},{"left":100 , "top":100});
    // 		equal({"left":border.left,"top":border.top},{"left":100 , "top":100});
    // },
    QUnit.test("parent : 부모 객체를 잘 가져오는가?",function(){
        var el = $Element('rel');

        function onlyDiv(el){
            return (el.tag == "div");
        };

        equal(el.parent().$value(),$('abs'));

        // 여러개를 가져올 때
        equal(el.parent(null).length,4);
        equal(el.parent(null, 0).length,4);
        equal(el.parent(null, 2).length,2);
        equal(el.parent(null)[0].$value(),$('abs'));
        equal(el.parent(onlyDiv).length,3);
        equal(el.parent(onlyDiv, 2).length,2);

    });
    QUnit.test("child : 자식 객체 가져오기",function(){
        var el = $Element("container");

        equal(el.child().length,4);
        equal(el.child(null).length,9);
    });
    QUnit.test("isChildOf : 자식 객체인가?",function(){
        var el_1 = $Element('abs');
        var el_2 = $Element('rel');

        equal(el_1.isChildOf(el_2),false);
        equal(el_2.isChildOf(el_1),true);
        equal(el_2.isChildOf(el_2),false);
    });
    QUnit.test("isParentOf : 부모 객체인가?",function(){
        var el_1 = $Element('abs');
        var el_2 = $Element('rel');
        var el_3 = $Element('div1');

        equal(el_1.isParentOf(el_2),true);
        equal(el_2.isParentOf(el_1),false);
        equal(el_2.isParentOf(el_2),false);
        equal(el_3.isParentOf(el_1),false);
    });
    QUnit.test("fireEvent : 이벤트가 발생하는가?",function(){
        var el = $Element('txt');
        el.text('D');

        // 원래값 확인
        equal(el.text(),'D');

        // 이벤트 발생후 값 확인
        el.fireEvent('click');
        equal(el.text(),'B');
    });
    QUnit.test("ellipsis : 말 줄임은 잘 되나?",function(){
        var el = $Element('longtxt');
        var box = $Element('for_ellipsis');
        var before_h, after_h;

        box.show();
        before_h = el.height();
        el.ellipsis('...more');
        after_h = el.height();
        box.hide();

        equal(before_h > after_h,true);
    });
    QUnit.test("isEqual : 두 개의 $Element 객체가 서로 같은 HTMLElement를 참조하는지 체크",function(){
        var el1 = $Element("abs");
        var el2 = $Element("txt");
        var el3 = $Element("abs");

        equal(el1.isEqual(el2),false);
        equal(el1.isEqual(el3),true);
    });
    QUnit.test("indexOf : 주어진 자식 객체의 인덱스 번호 반환",function(){
        var container = $Element("container");
        equal(container.indexOf($Element("para_a")),0);
        equal(container.indexOf($Element("para_b")),-1);
        equal(container.indexOf($Element("para_c")),3);
    });
    QUnit.test("prev : 이전 형제 엘리먼트 가져오기",function(){
        var el = $Element("node1_3");
        var first = $Element("node1_1");

        // 바로 앞 형제 엘리먼트
        equal(el.prev().$value(),$("node1_2"));

        // 앞 형제 엘리먼트 모음
        equal(el.prev(null).length,2);

        // 앞 엘리먼트가 없을 때
        equal(first.prev(),null);

        // 조건에 맞는 요소 탐색
        var bElPass = false;
        var aEl = $Element("node1_4").prev(function(el){
            if (typeof el != "object") {
                bElPass = false;
                return false;
            }

            if (el.id.substring(el.id.length - 1) - 0 < 3) { // expect node1_2, node1_1
                return true;
            }
            else {
                return false;
            }
        });
        equal(aEl.length,2);
        equal(aEl[0].$value(),$("node1_2"));
        equal(aEl[1].$value(),$("node1_1"));
    });
    QUnit.test("next : 다음 형제 엘리먼트 가져오기",function(){
        var el = $Element("node1_2");
        var last = $Element("node1_4");

        // 바로 다음 형제 엘리먼트
        equal(el.next().$value(),$("node1_3"));

        // 다음 형제 엘리먼트 모음
        equal(el.next(null).length,2);

        // 다음 엘리먼트가 없을 때
        equal(last.next(),null);

        // 조건에 맞는 요소 탐색
        var bElPass = false;
        var aEl = $Element("node1_1").next(function(el){
            if (typeof el != "object") {
                bElPass = false;
                return false;
            }

            if (el.id.substring(el.id.length - 1) - 0 < 4) { // expect node1_1, node1_2
                return true;
            }
            else {
                return false;
            }
        });
        equal(aEl.length,2);
        equal(aEl[0].$value(),$("node1_2"));
        equal(aEl[1].$value(),$("node1_3"));
    });
    QUnit.test("first : 첫번째 자식 엘리먼트 가져오기",function(){
        var container = $Element("container");
        equal(container.first().isEqual($Element("para_a")),true);
    });
    QUnit.test("last : 마지막 자식 엘리먼트 가져오기",function(){
        var container = $Element("container");
        equal(container.last().isEqual($Element("para_c")),true);
    });
    // QUnit.test("leave : 요소 삭제시 이벤트 핸들러가 해제되는가?",function(){
        // function f(event){
        // };
        // function f2(event){
        // };
//
        // var fn = $Fn(f);
        // var fn2 = $Fn(f2);
//
//
        // var oTemp = $Element('<DIV id="asdf1234asdf">');
        // document.body.appendChild(oTemp.$value());
        // fn2.attach(oTemp, 'click');
        // fn.attach(oTemp, 'click');
        // equal(jindo.$Element.eventManager.getEventConfig(oTemp.$value().__jindo__id).event.click.type["_jindo_event_none"].normal.length,2);
        // oTemp.leave();
        // deepEqual(jindo.$Element.eventManager.getEventConfig(oTemp.$value().__jindo__id), undefined);
    // },
    QUnit.test("attr에서 value를 가져올때 firefox인 경우 못 가져오는 현상 수정",function(){
        equal($Element("attrtest").attr("value"),"attr");
        equal($Element("attrtest2").attr("value"),"");
    });
    QUnit.test("attr에서 value를 가져올때 빈값인 경우 IE8에서 null로 반환되는 문제",function(){
        equal($Element("empty_input").attr("value"),"");
    });
    QUnit.test("html에는 숫자,불린값들이 정상적으로 셋팅되어야 한다.",function(){
        //@see http://bts.nhncorp.com/nhnbts/browse/AJAXUI-230
        equal($Element("element_html").html(),"test");

        $Element("element_html").html(11);
        equal($Element("element_html").html(),"11");

        $Element("element_html").html(true);
        equal($Element("element_html").html(),"true");
    });
    QUnit.test("empty는 정상적으로 반영되어야 한다.",function(){
        equal($Element("element_html2").html(),"test");
        $Element("element_html2").empty();
        equal($Element("element_html2").html(),"");
    });
    QUnit.test("background position 속성은 모든 브라우져에서 일관 되게 값을 반환하고 셋팅 되어야 한다.",function(){
        equal($Element("element_auto_test").css("backgroundPosition"),"2px 2px");
        equal($Element("element_auto_test").css("backgroundPositionX"),"2px");
        equal($Element("element_auto_test").css("backgroundPositionY"),"2px");

        $Element("element_auto_test").css("backgroundPosition", "3px 3px");
        equal($Element("element_auto_test").css("backgroundPositionX"),"3px");
        equal($Element("element_auto_test").css("backgroundPositionY"),"3px");

        $Element("element_auto_test").css("backgroundPositionX", "4px");
        equal($Element("element_auto_test").css("backgroundPositionX"),"4px");

        $Element("element_auto_test").css("backgroundPositionY", "4px");
        equal($Element("element_auto_test").css("backgroundPositionY"),"4px");

    });
    QUnit.test("margin 속성은 모든 브라우져에서 일관 되게 값을 반환하고 셋팅 되어야 한다.",function(){
        equal($Element("element_auto_test").css("margin"),"2px 1px");
        equal($Element("element_auto_test").css("marginTop"),"2px");
        equal($Element("element_auto_test").css("marginBottom"),"2px");
        equal($Element("element_auto_test").css("marginLeft"),"1px");
        equal($Element("element_auto_test").css("marginRight"),"1px");

        $Element("element_auto_test").css("margin", "3px");
        equal($Element("element_auto_test").css("margin"),"3px");
        equal($Element("element_auto_test").css("marginTop"),"3px");
        equal($Element("element_auto_test").css("marginBottom"),"3px");
        equal($Element("element_auto_test").css("marginLeft"),"3px");
        equal($Element("element_auto_test").css("marginRight"),"3px");

        $Element("element_auto_test").css("margin", "4px 5px");
        equal($Element("element_auto_test").css("margin"),"4px 5px");
        equal($Element("element_auto_test").css("marginTop"),"4px");
        equal($Element("element_auto_test").css("marginBottom"),"4px");
        equal($Element("element_auto_test").css("marginLeft"),"5px");
        equal($Element("element_auto_test").css("marginRight"),"5px");

        $Element("element_auto_test").css("margin", "6px 7px 8px 9px");
        equal($Element("element_auto_test").css("margin"),"6px 7px 8px 9px");
        equal($Element("element_auto_test").css("marginTop"),"6px");
        equal($Element("element_auto_test").css("marginBottom"),"8px");
        equal($Element("element_auto_test").css("marginLeft"),"9px");
        equal($Element("element_auto_test").css("marginRight"),"7px");

        $Element("element_auto_test").css("marginTop", "10px");
        $Element("element_auto_test").css("marginBottom", "11px");
        $Element("element_auto_test").css("marginLeft", "12px");
        $Element("element_auto_test").css("marginRight", "13px");

        equal($Element("element_auto_test").css("margin"),"10px 13px 11px 12px");
        equal($Element("element_auto_test").css("marginTop"),"10px");
        equal($Element("element_auto_test").css("marginBottom"),"11px");
        equal($Element("element_auto_test").css("marginLeft"),"12px");
        equal($Element("element_auto_test").css("marginRight"),"13px");

        $Element("element_auto_test").css("marginTop", "14px");
        $Element("element_auto_test").css("marginBottom", "14px");
        $Element("element_auto_test").css("marginLeft", "15px");
        $Element("element_auto_test").css("marginRight", "15px");

        equal($Element("element_auto_test").css("margin"),"14px 15px");
        equal($Element("element_auto_test").css("marginTop"),"14px");
        equal($Element("element_auto_test").css("marginBottom"),"14px");
        equal($Element("element_auto_test").css("marginLeft"),"15px");
        equal($Element("element_auto_test").css("marginRight"),"15px");

        $Element("element_auto_test").css("marginTop", "16px");
        $Element("element_auto_test").css("marginBottom", "16px");
        $Element("element_auto_test").css("marginLeft", "16px");
        $Element("element_auto_test").css("marginRight", "16px");

        equal($Element("element_auto_test").css("margin"),"16px");
        equal($Element("element_auto_test").css("marginTop"),"16px");
        equal($Element("element_auto_test").css("marginBottom"),"16px");
        equal($Element("element_auto_test").css("marginLeft"),"16px");
        equal($Element("element_auto_test").css("marginRight"),"16px");



    });
    QUnit.test("padding 속성은 모든 브라우져에서 일관 되게 값을 반환하고 셋팅 되어야 한다.",function(){
        equal($Element("element_auto_test").css("padding"),"2px 1px");
        equal($Element("element_auto_test").css("paddingTop"),"2px");
        equal($Element("element_auto_test").css("paddingBottom"),"2px");
        equal($Element("element_auto_test").css("paddingLeft"),"1px");
        equal($Element("element_auto_test").css("paddingRight"),"1px");

        $Element("element_auto_test").css("padding", "3px");
        equal($Element("element_auto_test").css("padding"),"3px");
        equal($Element("element_auto_test").css("paddingTop"),"3px");
        equal($Element("element_auto_test").css("paddingBottom"),"3px");
        equal($Element("element_auto_test").css("paddingLeft"),"3px");
        equal($Element("element_auto_test").css("paddingRight"),"3px");

        $Element("element_auto_test").css("padding", "4px 5px");
        equal($Element("element_auto_test").css("padding"),"4px 5px");
        equal($Element("element_auto_test").css("paddingTop"),"4px");
        equal($Element("element_auto_test").css("paddingBottom"),"4px");
        equal($Element("element_auto_test").css("paddingLeft"),"5px");
        equal($Element("element_auto_test").css("paddingRight"),"5px");

        $Element("element_auto_test").css("padding", "6px 7px 8px 9px");
        equal($Element("element_auto_test").css("padding"),"6px 7px 8px 9px");
        equal($Element("element_auto_test").css("paddingTop"),"6px");
        equal($Element("element_auto_test").css("paddingBottom"),"8px");
        equal($Element("element_auto_test").css("paddingLeft"),"9px");
        equal($Element("element_auto_test").css("paddingRight"),"7px");

        $Element("element_auto_test").css("paddingTop", "10px");
        $Element("element_auto_test").css("paddingBottom", "11px");
        $Element("element_auto_test").css("paddingLeft", "12px");
        $Element("element_auto_test").css("paddingRight", "13px");

        equal($Element("element_auto_test").css("padding"),"10px 13px 11px 12px");
        equal($Element("element_auto_test").css("paddingTop"),"10px");
        equal($Element("element_auto_test").css("paddingBottom"),"11px");
        equal($Element("element_auto_test").css("paddingLeft"),"12px");
        equal($Element("element_auto_test").css("paddingRight"),"13px");

        $Element("element_auto_test").css("paddingTop", "14px");
        $Element("element_auto_test").css("paddingBottom", "14px");
        $Element("element_auto_test").css("paddingLeft", "15px");
        $Element("element_auto_test").css("paddingRight", "15px");

        equal($Element("element_auto_test").css("padding"),"14px 15px");
        equal($Element("element_auto_test").css("paddingTop"),"14px");
        equal($Element("element_auto_test").css("paddingBottom"),"14px");
        equal($Element("element_auto_test").css("paddingLeft"),"15px");
        equal($Element("element_auto_test").css("paddingRight"),"15px");

        $Element("element_auto_test").css("paddingTop", "16px");
        $Element("element_auto_test").css("paddingBottom", "16px");
        $Element("element_auto_test").css("paddingLeft", "16px");
        $Element("element_auto_test").css("paddingRight", "16px");

        equal($Element("element_auto_test").css("padding"),"16px");
        equal($Element("element_auto_test").css("paddingTop"),"16px");
        equal($Element("element_auto_test").css("paddingBottom"),"16px");
        equal($Element("element_auto_test").css("paddingLeft"),"16px");
        equal($Element("element_auto_test").css("paddingRight"),"16px");

    });
    QUnit.test("hasClass는 class를 정확히 확인이 가능해야 한다.",function(){
        ok($Element("class_api_test").hasClass("foo"));
        ok(!$Element("class_api_test").hasClass("bar"));
    });
    QUnit.test("addClass는 class를 추가 해야 한다.",function(){
        ok($Element("class_api_test").addClass("bar").hasClass("bar"));
    });
    QUnit.test("removeClass는 class를 추가 해야 한다.",function(){
        ok(!$Element("class_api_test").removeClass("bar").hasClass("bar"));
    });
    QUnit.test("toggleClass는 class를 추가 해야 한다.",function(){
		var ele = $Element("class_api_test");
        ok(ele.toggleClass("bar").hasClass("bar"));
        ok(!ele.toggleClass("bar").hasClass("bar"));

        ok(ele.toggleClass("foo", "bar").hasClass("bar"));
        ok(!ele.toggleClass("foo", "bar").hasClass("bar"));

		ele.addClass("test");
        ok(ele.hasClass("test"));
		ele.toggleClass("test","");
        ok(!ele.hasClass("test"));
    });
    QUnit.test("$Element에 document가 들어가면 css에서 에러나야함.",function(){
        var occurException = false;
        try {
            $Element(document).css("width");
        }
        catch (e) {
            occurException = true;
        }
        ok(occurException);
    });
    QUnit.test("text에 숫자를 넣어도 삽입되어야 한다.",function(){
        var ele = $Element("ele_text");
        ele.text(1);
        equal(ele.text(),1);
        ele.text(true);
        equal(ele.text(),"true");
    });
    QUnit.test("IE에서는 도메인이 틀린 경우 에러가 발생하면 안된다.",function(){
        throws(
            $Element(document.body).append($("<iframe id=\"differece_doman_iframe\" frameborder=\"1\" src=\"http://test.naver.com/~mixed/jindo_dev/trunk/Sources/TestCase/differece_doman_iframe.html\"></iframe>"))
        );
    });
    QUnit.test("css는 정상적으로 작동해야 한다.",function(){
        $Element("element_css_test").css("top", 20);
        equal($Element("element_css_test").css("top"),"20px");

        $Element("element_css_test").css("top", "30");
        equal($Element("element_css_test").css("top"),"30px");

        $Element("element_css_test").css("top", "30%");
        ok($Element("element_css_test").css("top") != "30px");

    });
    QUnit.test("ie에서 html하면 textnode가 없어지는 문제",function(){
        var o = $('<span>hello world</span>');
        var p = $('<div>');
        $Element(p).append(o);
        document.body.appendChild(p);
        $Element(p).html("");
        equal($Element(o).html(),"hello world");

    });
    QUnit.test("show,visible에서 파라메터로 받을수 있게 수정.",function(){
        equal($Element("show_display").css("display"),"inline");
        $Element("show_display").hide();
        equal($Element("show_display").css("display"),"none");
        $Element("show_display").show("inline");
        equal($Element("show_display").css("display"),"inline");

        $Element("show_display").visible(false);
        equal($Element("show_display").css("display"),"none");
        $Element("show_display").visible(true, "inline");
        equal($Element("show_display").css("display"),"inline");

        $Element("show_display").toggle();
        equal($Element("show_display").css("display"),"none");
        $Element("show_display").toggle("inline");
        equal($Element("show_display").css("display"),"inline");

    });
    QUnit.test("webkit에서 keycode가 설정 되어야 한다.",function(){
        $("fire_test").value = "";
        equal($("fire_test").value,"");
        $Fn(function(e){
            $("fire_test").value = e.key().keyCode;
        }).attach($("element_fire_test"), "keydown")
        $Element("element_fire_test").fireEvent("keydown", {
            keyCode: 13,
            alt: true,
            shift: false,
            meta: false,
            ctrl: true
        });
        equal($("fire_test").value,"13");
    });
    QUnit.test("opera 10.51에서 click이 실행 안됨.",function(){
        var isclick = false;
        var isleft = false;
        $Fn(function(e){
            isclick = true;
            isleft = true;
        }).attach($("opera_click"), "click");

        $Element("opera_click").fireEvent("click", {
            left: true
        });

        ok(isclick);
        ok(isleft);

        var iskeydown = false;
        var keycode = "";
        $Fn(function(e){
            iskeydown = true;
            keycode = e.key().keyCode;
        }).attach($("opera_click"), "keydown");

        $Element("opera_click").fireEvent("keydown", {
            keyCode: 123
        });

        ok(iskeydown);
        equal(keycode,123);
    });
    QUnit.test("addClass , removeClass, hasClass에서 여러개의 class를 적용할수 있게 수정.",function(){
        $Element("class_api_update").addClass("test test2");

        equal($("class_api_update").className.split(" ").sort().join(" "),"test test2");

        $Element("class_api_update").removeClass("test test2");
        equal($("class_api_update").className,"");
    });
    QUnit.test("textdecoration 값을 못 가지고 오는 경우.",function(){

        $Element("class_api_update").css("textDecoration", "underline line-through");
        equal($Element("class_api_update").css("textDecoration"),"underline line-through");
    });
    QUnit.test("rgb는 정상적으로 반환하는가?",function(){
        $Element("class_api_update").css("backgroundColor", "#ffffff");
        equal($Element("class_api_update").css("backgroundColor"),"rgb(255, 255, 255)");
    });
    QUnit.test("cursor은 정상적으로 셋팅 되어야 한다.",function(){
        $Element("class_api_update").css({
            cursor: "pointer"
        });
        equal($Element("class_api_update").css("cursor"),"pointer");
    });
    QUnit.test("CSS rule로 설정된 $Element의 opacity는 정상적으로 반환 되어야 한다.",function(){
        equal($Element("ele_opacity").opacity(),0);
    });
    QUnit.test("$Element의 opacity는 정상적으로 셋팅이 되어야 한다.",function(){
        $Element("ele_opacity").opacity(0.5);
        equal($Element("ele_opacity").opacity(),0.5);
        $Element("ele_opacity").opacity(-1);
        equal($Element("ele_opacity").opacity(),0);
        $Element("ele_opacity").opacity(2);
        equal($Element("ele_opacity").opacity(),1);
    });
    QUnit.test("$Element의 opacity에 문자가 들어간  경우는 parseFloat한 결과가 적용된다.",function(){
        $Element("ele_opacity").opacity(1);

        $Element("ele_opacity").opacity("0.5");
        equal($Element("ele_opacity").opacity(),0.5);

        $Element("ele_opacity").opacity("0.6px");
        equal($Element("ele_opacity").opacity(),0.5);
    });
    QUnit.test("$Element의 opacity에 문자가 들어간  경우는 parseFloat한 결과가 숫자가 아닌 경우 기존 값을 유지한다.",function(){
        $Element("ele_opacity").opacity(1);

        $Element("ele_opacity").opacity("asdf");
        equal($Element("ele_opacity").opacity(),1);
    });
    QUnit.test("$Element에 css는 opacity값을 넣었을 때 정상적으로 작동되어야 한다.",function(){
        $Element("ele_opacity").opacity(1);
        equal($Element("ele_opacity").css("opacity"),1);
        $Element("ele_opacity").css("opacity", 0.5);
        equal($Element("ele_opacity").css("opacity"),0.5);
    });
    QUnit.test("$Element의 css에 첫번째 인자는 문자나 오브젝트가 아닌 경우는 exception이 발생한다.",function(){
        var occurException = false;
        try {
            $Element("ele_opacity").css();
        }
        catch (e) {
            occurException = true;
        }
        ok(occurException);
    });
    QUnit.test("$Element의 css에 padding이나 margin값이 right와 left값이 틀린 경우. ",function(){
        equal($Element("ele_padding_etc").css("padding"),"1px 2px 1px 3px");
        equal($Element("ele_padding_etc").css("padding"),"1px 2px 1px 3px");
    });
    QUnit.test("$Element의 css에 첫번째 인자가 $H인 경우.",function(){
        $Element("ele_padding_etc").css($H({
            "display": "none"
        }));
        equal($Element("ele_padding_etc").css("display"),"none");
    });
    QUnit.test("$Element의 css에 여러가지 테스트.",function(){
        var ele = $Element("ele_padding_etc");
        var occurException = false;
        try {
            ele.css(1);
        }
        catch (e) {
            occurException = true;
        }
        ok(occurException);

        occurException = false;
        try {
            ele.css();
        }
        catch (e) {
            occurException = true;
        }
        ok(occurException);

        occurException = false;
        try {
            ele.css(null);
        }
        catch (e) {
            occurException = true;
        }
        ok(occurException);

        occurException = false;
        try {
            ele.css(true);
        }
        catch (e) {
            occurException = true;
        }
        ok(occurException);

    });
    QUnit.test("$Element의 css에 여러가지 테스트.",function(){
        var ele = $Element("ele_padding_etc");
        var occurException = false;
        try {
            ele.css(true);
        }
        catch (e) {
            occurException = true;
        }
        ok(occurException);

        ele.css({
            "display": true
        });
        equal(ele.css("display"),"none");
        $Element("ele_padding_etc").show();
    });
    QUnit.test("$Element의 attr의 여러가지 테스트",function(){
        var ele = $Element("ele_padding_etc");
        var occurException = false;
        try {
            ele.attr(1);
        }
        catch (e) {
            occurException = true;
        }
        ok(occurException);

        occurException = false;
        try {
            ele.attr();
        }
        catch (e) {
            occurException = true;
        }
        ok(occurException);

        occurException = false;
        try {
            ele.attr(null);
        }
        catch (e) {
            occurException = true;
        }
        ok(occurException);

        occurException = false;
        try {
            ele.attr(true);
        }
        catch (e) {
            occurException = true;
        }
        ok(occurException);
    });
    QUnit.test("$Element의 attr테스트",function(){
        var ele = $Element("ele_padding_etc");
        var occurException = false;
        try {
            ele.css(true);
        }
        catch (e) {
            occurException = true;
        }
        ok(occurException);

        ele.attr("class", "test2");
        equal(ele.className(),"test2");
        equal(ele.attr("class"),"test2");
        equal(ele.attr("className"),"test2");

        ele.attr({
            "class": "test3"
        });
        equal(ele.className(),"test3");
        equal(ele.attr("class"),"test3");
        equal(ele.attr("className"),"test3");


        ele.attr($H({
            "a": 1,
            "b": 2
        }));
        equal(ele.attr("a"),1);
        equal(ele.attr("b"),2);

        ele.attr({
            "onclick": "alert(1);"
        });
        equal(ele.attr("onclick"),"alert(1);");
    });
    QUnit.test("<select> 엘리먼트를 감싼 $Element의 attr 테스트",function(){
    	// select-one test
    	var wel = $Element("select_for_attr");
    	equal(wel.attr("value"),"사과");

    	wel.attr("value", "오렌지");
    	equal(wel.attr("value"),"오렌지");

    	wel.attr("value", "레몬");
    	equal(wel.attr("value"),null);

    	wel.attr("value", "Banana");
    	equal(wel.attr("value"),"Banana");

    	wel.attr("value", null);
    	equal(wel.attr("value"),null);

    	// select-multiple test
    	var wel2 = $Element("select_for_attr2");
    	equal(wel2.attr("value"),null);

    	wel2.attr("value", "Pineapple");
    	equal(wel2.attr("value"),"Pineapple");

    	wel2.attr("value", ["사과", "오렌지"]);
    	deepEqual(wel2.attr("value"),["사과", "오렌지"]);

    	wel2.attr("value", ["Apple", "Orange"]);
    	deepEqual(wel2.attr("value"),["사과", "오렌지"]);

    	wel2.attr("value", ["오렌지", "Banana"]);
    	deepEqual(wel2.attr("value"),["오렌지", "Banana"]);

    	wel2.attr("value", null);
    	equal(wel2.attr("value"),null);

    	wel2.attr("value", ["Pineapple", "Banana"]);
    	deepEqual(wel2.attr("value"),["Pineapple", "Banana"]);

    	wel2.attr("value", ["키위", "레몬"]);
    	equal(wel2.attr("value"),null);

    	wel2.attr("value", ["Orange", "Apple", "Banana", "Pineapple"]);
    	deepEqual(wel2.attr("value"),["사과", "오렌지", "Pineapple", "Banana"]);

    	wel2.attr("value", []);
    	equal(wel2.attr("value"),null);
    });
	QUnit.test("attr에서 null을 넣으면 삭제되어야 한다.",function(){
		//Given
		var ele = $Element("ele_padding_etc");
		//When
		ele.attr("foooo","test");
		//Then
		equal(ele.attr("foooo"),"test");

		//When
		ele.attr("foooo",null);
		//Then
		deepEqual(ele.attr("foooo"), null);
	});
    QUnit.test("width는 정상 작동해야 한다.",function(){
        $Element("ele_padding_etc").css("padding", "0px");
        $Element("ele_padding_etc").css("margin", "0px");
        $Element("ele_padding_etc").width(100);
        equal($Element("ele_padding_etc").width(),100);
        $Element("ele_padding_etc").css("padding", "1px");
        equal($Element("ele_padding_etc").width(),102);
        $Element("ele_padding_etc").css("padding", "0px");
        $Element("ele_padding_etc").css("margin", "0px");
    });
    QUnit.test("height는 정상 작동해야 한다.",function(){
        $Element("ele_padding_etc").css("padding", "0px");
        $Element("ele_padding_etc").css("margin", "0px");
        $Element("ele_padding_etc").height(90);
        equal($Element("ele_padding_etc").height(),90);
        $Element("ele_padding_etc").css("padding", "1px");
        equal($Element("ele_padding_etc").height(),92);
        $Element("ele_padding_etc").css("padding", "0px");
        $Element("ele_padding_etc").css("margin", "0px");
    });
    QUnit.test("classname은 정상 작동해야한다.",function(){
        $Element("ele_padding_etc").className("");
        $Element("ele_padding_etc").className("aaa");
        equal($Element("ele_padding_etc").className(),"aaa");
    });
    QUnit.test("text는 정상 작동해야 한다.",function(){
        $Element("text_test").text("");
        $Element("text_test2").text("");
        $Element("text_test").text("1234");
        $Element("text_test2").text("1234");

        equal($Element("text_test").text(),"1234");
        equal($Element("text_test2").text(),"1234");
    });
    QUnit.test("outerHTML은 정상적으로 작동해야 한다.",function(){
        var compare_str;
        compare_str = "<div id=\"outer_html\"><span>1</span></div>".toUpperCase();
        deepEqual($Element("outer_html").outerHTML().toUpperCase().replace(/(\s__jindo__id=\"(?:.*?)\")/i, function(){
            return "";
        }), compare_str);
    });
    QUnit.test("outerHTML은 document일 때 documentElement로 동작하고 outerHTML이 동작하지 않으면 [object $Element]로 동작한다.",function(){
       //Given
       //When
       var docToString = $Element(document).toString();
       var docOuterHtml = $Element(document).outerHTML();
       var winToString = $Element(window).toString();
       var winOuterHtml = $Element(window).outerHTML();

       //Then
       equal(docToString.constructor,String);
       equal(docOuterHtml.constructor,String);
       equal(winToString,"[object $Element]");
       equal(winOuterHtml,undefined);
    });
    QUnit.test("appendHTML",function(){
       var appendInner = $Element("appendInnerHTML").appendHTML("<div><span>3</span></div><div><span>4</span></div>");
        ok(appendInner instanceof $Element);
        equal(appendInner.$value(),$("appendInnerHTML"));

        $("admock").innerHTML = "<div><span>1</span></div><div><span>2</span></div><div><span>3</span></div><div><span>4</span></div>";
        equal($("appendInnerHTML").innerHTML,$("admock").innerHTML);


        $Element("appendSelect").appendHTML("<option>2</option><option>3</option>");
        $Element("mock_select").html("<option>1</option><option >2</option><option>3</option>");
        var options = $("mock_select").options;
        for (var i = 0; i < options.length; i++) {
            if (options[i].selected) {
                $("appendSelect").options[i].selected = true;
            }
        }
        equal($("appendSelect").innerHTML,$("mock_select").innerHTML);

        $Element("appendTable-1").appendHTML("<tr><td>1</td></tr><tr><td>2</td></tr>");
        $Element("mock_table").html("<tr><th>Header</th></tr><tr><td>Data</td></tr><tr><td>1</td></tr><tr><td>2</td></tr>");
        equal($("appendTable-1").innerHTML,$("mock_table").innerHTML);
        $Element("mock_table").empty();

        $Element("appendTable-2").appendHTML("<tr><td>1</td></tr><tr><td>2</td></tr>");
        $Element("mock_table").html("<tr><th>Header</th></tr><tr><td>Data</td></tr><tr><td>1</td></tr><tr><td>2</td></tr>");
        equal($("appendTable-2").innerHTML,$("mock_table").innerHTML);
        $Element("mock_table").empty();

        $Element("appendTable-3").appendHTML("<tr><td>1</td></tr><tr><td>2</td></tr>");
        $Element("mock_table").html("<tr><th>Header</th></tr><tr><td>Data</td></tr><tr><td>1</td></tr><tr><td>2</td></tr>");
        equal($("appendTable-3").innerHTML,$("mock_table").firstChild.innerHTML);
        $Element("mock_table").empty();


        $Element("appendTable2").appendHTML("<th>1</th><th>2</th>");
        $Element("mock_table2").html("<th>Header</th><th>1</th><th>2</th>");
        equal($("appendTable2").innerHTML,$("mock_table2").innerHTML);

        $Element("appendTable3").appendHTML("<td>1</td><td>2</td>");
        $Element("mock_table3").html("<td>Data</td><td>1</td><td>2</td>");
        equal($("appendTable3").innerHTML,$("mock_table3").innerHTML);

    });
    QUnit.test("prependHTML",function(){
        var prependInnerHTML = $Element("prependInnerHTML").prependHTML("<div><span>3</span></div><div><span>4</span></div>");
        ok(prependInnerHTML instanceof $Element);
        equal(prependInnerHTML.$value(),$("prependInnerHTML"));
        $("admock").innerHTML = "<div><span>3</span></div><div><span>4</span></div><div><span>1</span></div><div><span>2</span></div>";
        equal($("prependInnerHTML").innerHTML,$("admock").innerHTML);

        $Element("prependSelect").prependHTML("<option>2</option><option>3</option>");
        $Element("mock_prepend_select").html("<option>2</option><option>3</option><option>1</option>");
        var options = $("mock_prepend_select").options;
        for (var i = 0; i < options.length; i++) {
            if (options[i].selected) {
                $("prependSelect").options[i].selected = true;
            }
        }
        equal($("prependSelect").innerHTML,$("mock_prepend_select").innerHTML);

        $Element("prependTable-1").prependHTML("<tr><td>1</td></tr><tr><td>2</td></tr>");
        $Element("mock_prepend_table").html("<tr><td>1</td></tr><tr><td>2</td></tr><tr><th>Header</th></tr><tr><td>Data</td></tr>");
        equal($("prependTable-1").innerHTML,$("mock_prepend_table").innerHTML);
        $Element("mock_prepend_table").empty();

        $Element("prependTable-2").prependHTML("<tr><td>1</td></tr><tr><td>2</td></tr>");
        $Element("mock_prepend_table").html("<tr><td>1</td></tr><tr><td>2</td></tr><tr><th>Header</th></tr><tr><td>Data</td></tr>");
        equal($("prependTable-2").innerHTML,$("mock_prepend_table").innerHTML);
        $Element("mock_prepend_table").empty();

        $Element("prependTable-3").prependHTML("<tr><td>1</td></tr><tr><td>2</td></tr>");
        $Element("mock_prepend_table").html("<tr><td>1</td></tr><tr><td>2</td></tr><tr><th>Header</th></tr><tr><td>Data</td></tr>");
        equal($("prependTable-3").innerHTML,$("mock_prepend_table").firstChild.innerHTML);
        $Element("mock_prepend_table").empty();

        $Element("prependTable2").prependHTML("<th>1</th><th>2</th>");
        $Element("mock_prepend_table2").html("<th>1</th><th>2</th><th>Header</th>");
        equal($("prependTable2").innerHTML,$("mock_prepend_table2").innerHTML);
        //
        $Element("prependTable3").prependHTML("<td>1</td><td>2</td>");
        $Element("mock_prepend_table3").html("<td>1</td><td>2</td><td>Data</td>");
        equal($("prependTable3").innerHTML,$("mock_prepend_table3").innerHTML);
    });
    QUnit.test("beforeHTML",function(){
        var beforeInnerHTML = $Element("beforeInnerHTML").beforeHTML("<div><span>3</span></div><div><span>4</span></div>");
        ok(beforeInnerHTML instanceof $Element);
        equal(beforeInnerHTML.$value(),$("beforeInnerHTML"));

        $("admock").innerHTML = "<div><span>1</span></div><div><span>3</span></div><div><span>4</span></div><div id='beforeInnerHTML'><span>2</span></div>";
        deepEqual($("beforeInnerHTML1").innerHTML.replace(/(\s__jindo__id=\"(?:.*?)\")/i, function(){
            return "";
        }), $("admock").innerHTML);
    });
    QUnit.test("afterHTML",function(){
        var afterInnerHTML = $Element("afterInnerHTML").afterHTML("<div><span>3</span></div><div><span>4</span></div>");

        ok(afterInnerHTML instanceof $Element);
        equal(afterInnerHTML.$value(),$("afterInnerHTML"));
        $("admock").innerHTML = "<div><span>1</span></div><div id='afterInnerHTML'><span>2</span></div><div><span>3</span></div><div><span>4</span></div>";
        deepEqual($("afterInnerHTML2").innerHTML.replace(/(\s\_\_jindo\_\_id=\"(?:.*?)\")/i, function(){
            return "";
        }), $("admock").innerHTML);
    });
    //	QUnit.test(".ch1인 엘리먼트가 클릭이 되면 이벤트는 발생되어야 한다.",function(){
    //		logReset();
    //		$Element("parent").delegate("click",".ch1",classTest);
    //		$Element($$.getSingle(".ch1")).fireEvent("click");
    //		equal($("log").innerHTML,"classTest");
    //
    //		equal($("parent")["_delegate_events"],["click"]);
    //		ok($("parent")["_delegate_click"][".ch1"].constructor == Object);
    //		ok($("parent")["_delegate_click_func"].constructor == Function);
    //	}
    //		,
    //	QUnit.test(".ch1을 unbind를 하면 해당 이벤트는 발생되지 않는다.",function(){
    //		logReset();
    //		$Element("parent").undelegate("click",".ch1",classTest);
    //		$Element($$.getSingle(".ch1")).fireEvent("click");
    //		equal($("log").innerHTML,"");
    //		ok(typeof $("parent")["_delegate_events"] == "undefined" || $("parent")["_delegate_events"] == null);
    //		ok(typeof $("parent")["_delegate_click"] == "undefined"  || $("parent")["_delegate_click"] == null);
    //		ok(typeof $("parent")["_delegate_click_func"] == "undefined"  || $("parent")["_delegate_click_func"] == null);
    //	}
    //	,
    //	QUnit.test("check함수에 참일 경우만 이벤트를 발생되어야 한다.",function(){
    //		logReset();
    //		$Element("parent").delegate("click",check,checkTest);
    //		$Element($$(".ch2")[1]).fireEvent("click");
    //		equal($("log").innerHTML,"checkTest");
    //
    //		logReset();
    //		$Element($$.getSingle(".ch3")).fireEvent("click");
    //		equal($("log").innerHTML,"checkTest");
    //
    //		logReset();
    //		$Element($$.getSingle(".ch1")).fireEvent("click");
    //		equal($("log").innerHTML,"");
    //	},
    //	QUnit.test("check함수를 unbind하면 해당 이벤트는 발생하지 않는다.",function(){
    //		logReset();
    //		$Element("parent").undelegate("click",check,checkTest);
    //		$Element($$(".ch2")[1]).fireEvent("click");
    //		equal($("log").innerHTML,"");
    //
    //		logReset();
    //		$Element($$.getSingle(".ch3")).fireEvent("click");
    //		equal($("log").innerHTML,"");
    //	},
    //	QUnit.test("scope를 유지 하기 위해서는 bind를 사용해야 한다.",function(){
    //		logReset();
    //		$Element("parent").delegate("click",".ch2",$Fn(ScopeTest.test,ScopeTest).bind());
    //		$Element($$(".ch2")[1]).fireEvent("click");
    //		$Element("parent").undelegate();
    //
    //		ok(typeof $("parent")["_delegate_events"] == "undefined" || $("parent")["_delegate_events"] == null);
    //		ok(typeof $("parent")["_delegate_click"] == "undefined" || $("parent")["_delegate_click"] == null);
    //		ok(typeof $("parent")["_delegate_click_func"] == "undefined" || $("parent")["_delegate_click_func"] == null);
    //	},
    //	QUnit.test("연속 두개 등록해도 정상 작동하는가?",function(){
    //		var count = 0;
    //		function plus1(){
    //			count +=1 ;
    //		}
    //		function plus2(){
    //			count +=2 ;
    //		}
    //		$Element("parent").delegate("click",".ch1",plus1);
    //		$Element("parent").delegate("click",".ch1",plus2);
    //
    //		$Element($$(".ch1")[0]).fireEvent("click");
    //		equal(count,3);
    //
    //		$Element("parent").delegate("click",".ch2",plus1);
    //		$Element($$(".ch2")[0]).fireEvent("click");
    //		equal(count,4);
    //
    //		$Element("parent").delegate("click",".ch3",plus1);
    //		$Element($$(".ch3")[0]).fireEvent("click");
    //		equal(count,5);
    //
    //		$Element("parent").undelegate("click", ".ch1" ,plus1);
    //		equal($("parent")["_delegate_events"],["click"]);
    //		ok($("parent")["_delegate_click"][".ch1"].func.length == 1);
    //
    //		$Element("parent").undelegate("click", ".ch1" ,plus2);
    //		equal($("parent")["_delegate_events"],["click"]);
    //		ok(typeof $("parent")["_delegate_click"][".ch1"] == "undefined" || $("parent")["_delegate_click"][".ch1"] == null);
    //
    //		$Element("parent").undelegate("click", ".ch2" ,plus1);
    //		equal($("parent")["_delegate_events"],["click"]);
    //		ok(typeof $("parent")["_delegate_click"][".ch2"] == "undefined" || $("parent")["_delegate_click"][".ch2"] == null);
    //
    //		$Element("parent").undelegate("click", ".ch3" ,plus1);
    //		ok(typeof $("parent")["_delegate_events"] == "undefined"  || $("parent")["_delegate_events"] == null);
    //		ok(typeof $("parent")["_delegate_click"] == "undefined"  || $("parent")["_delegate_click"] == null);
    //		ok(typeof $("parent")["_delegate_click_func"] == "undefined"  || $("parent")["_delegate_click_func"] == null);
    //
    //	},
    QUnit.test("attr 의 style 테스트",function(){
        equal($Element("csstest").attr("style"),$("csstest2").style.cssText);

        $Element("csstest").attr("style", "border: 1px; padding: 2px;");
        $("csstest2").style.cssText = "border: 1px; padding: 2px;";
        equal($Element("csstest").attr("style"),$("csstest2").style.cssText);

        $Element("csstest").attr({
            "style": "border: 2px; padding: 1px; margin: 1px;"
        });
        $("csstest2").style.cssText = "border: 2px; padding: 1px; margin: 1px;";
        equal($Element("csstest").attr("style"),$("csstest2").style.cssText);
    });
    QUnit.test("checked 모두 attr에 작동되어야 한다.",function(){
        ok(!$Element("radio_test").attr("checked"));
        $Element("radio_test").attr("checked", true);
        ok($Element("radio_test").attr("checked"));
        $Element("radio_test").attr({
            "checked": false
        });
        ok(!$Element("radio_test").attr("checked"));

        ok(!$Element("check_test").attr("checked"));
        $Element("check_test").attr("checked", true);
        ok($Element("check_test").attr("checked"));
        $Element("check_test").attr({
            "checked": false
        });
        ok(!$Element("check_test").attr("checked"));

    });
    // QUnit.test("selected 모두 attr에 작동되어야 한다.",function(){
    // 	equal($Element("select_test").attr("selected"),"option1");
    // 	$Element("select_test").attr("selected","option2");
    // 	equal($Element("select_test").attr("selected"),"option2");
    // 	$Element("select_test").attr({"selected":"option1"});
    // 	equal($Element("select_test").attr("selected"),"option1");
    //
    // },
    QUnit.test("disabled 모두 attr에 작동되어야 한다.",function(){
        ok(!$Element("radio_test").attr("disabled"));
        $Element("radio_test").attr("disabled", true);
        ok($Element("radio_test").attr("disabled"));
        $Element("radio_test").attr({
            "disabled": false
        });
        ok(!$Element("radio_test").attr("disabled"));

        ok(!$Element("check_test").attr("disabled"));
        $Element("check_test").attr("disabled", true);
        ok($Element("check_test").attr("disabled"));
        $Element("check_test").attr({
            "disabled": false
        });
        ok(!$Element("check_test").attr("disabled"));

        ok(!$Element("select_test").attr("disabled"));
        $Element("select_test").attr("disabled", true);
        ok($Element("select_test").attr("disabled"));
        $Element("select_test").attr({
            "disabled": false
        });
        ok(!$Element("select_test").attr("disabled"));

    });

    QUnit.test("append는 정상적으로 동작해야 한다.",function(){
        var li = $("<li>1</li>");
        var ele = $Element("append_test");
        equal(ele.append(li),ele);
        equal($$("#append_test li").length,1);
    });
    QUnit.test("prepend는 정상적으로 동작해야 한다.",function(){
        var li = $("<li>1</li>");
        var ele = $Element("prepand_test");
		equal(ele.prepend(li),ele);
        equal($$("#prepand_test li").length,1);
    });
    QUnit.test("replace는 정상적으로 동작해야 한다.",function(){
        var ele =$Element("replace_test")
		equal(ele.replace($("<p id='p_test_s'>test</p>")),ele);
        ok($("replace_test") == null);
        equal($("p_test_s").tagName.toUpperCase(),"P");
    });
    QUnit.test("appendTo는 정상적으로 동작해야 한다.",function(){
        equal($$("#appendTo_test2 li").length,0);
        var ele = $Element("appendTo_test1");
		equal(ele.appendTo("appendTo_test2"),ele);
        jindo.$$.release();
        equal($$("#appendTo_test2 li").length,1);
    });
    QUnit.test("prependTo는 정상적으로 동작해야 한다.",function(){
        equal($$("#appendTo_test2 ul").length,0);
        var ele = $Element("appendTo_test");
		equal(ele.prependTo("appendTo_test2"),ele);
        jindo.$$.release();
        equal($$("#appendTo_test2 ul").length,1);
    });
    QUnit.test("before는 정상적으로 동작해야 한다.",function(){
        var ele = $Element("default_li");
		equal(ele.before($("<li id='before_li'></li>")),ele);
        equal($$("#after_before li")[0].id,"before_li");
        jindo.$$.release();
    });
    QUnit.test("after는 정상적으로 동작해야 한다.",function(){
        var ele = $Element("default_li");
		equal(ele.after($("<li id='after_li'></li>")),ele);
        jindo.$$.release();
        equal($$("#after_before li")[2].id,"after_li");
    });
    QUnit.test("child에서 limit가 없을때",function(){
        equal($Element("after_before").child(null)[0].attr("id"),"before_li");
    });
    QUnit.test("wrap는 정상적으로 동작해야 한다.",function(){
        equal($$("#wrap_test_li ul").length,0);
        jindo.$$.release();
        $Element("wrap_test").wrap("wrap_test_li");
        equal($$("#wrap_test_li ul").length,1);
    });
    //	QUnit.test("queryAll는 정상적으로 동작해야 한다.",function(){
    //		var occurException = false;
    //		try{
    //			$Element(document).queryAll("#ele_query_test li").length;
    //		}catch(e){
    //			occurException = true;
    //		}
    //		ok(occurException);
    //	},
    //	QUnit.test("query는 정상적으로 동작해야 한다.",function(){
    //		var occurException = false;
    //		try{
    //			$Element(document).query("#ele_query_test li");
    //		}catch(e){
    //			occurException = true;
    //		}
    //		ok(occurException);
    //	},
    QUnit.test("test는 정상적으로 동작해야 한다.",function(){
        ok($Element($("ele_query_test")).test("#ele_query_test"));
    });
/*    QUnit.test("IE에서 DOM에 append하기 전에 opacity을 설정했을 때 생기는 문제.",function(){
        throws(function() {
            try {
                $Element("<div>").opacity(0);
            }
            catch(e) {}
        });
    });*/
    QUnit.test("ellipsis는 paddding이 들어있어도 정상적으로 잘려야 한다.",function(){
        var wel = $Element("ellipsis_padding"),
            sOrigText = $Element("ellipsis_padding").text();

        wel.ellipsis();
        var text = $S(wel.text()).trim();
        ok(sOrigText.length > text.$value().length);
    });

    QUnit.test("addClass는 여러개의 클래스를 사용해도 지원한다.",function(){
        var rEle = $Element("multiClass");
        rEle.addClass("add1");
        rEle.addClass("add1 add2");
        equal(rEle.$value().className,"add1 add2");
        rEle.addClass("add2 add1");
        equal(rEle.$value().className,"add1 add2");
        rEle.addClass("add3 add4");
        equal(rEle.$value().className,"add1 add2 add4 add3");//역으로 class을 적용하여 4,3의 위치가 변경.
    });
    QUnit.test("removeClass는 여러개의 클래스를 사용해도 지원한다.",function(){
        var rEle = $Element("multiClass");
        rEle.removeClass("add1");
        equal(rEle.$value().className,"add2 add4 add3");
        rEle.removeClass("add3 add2");
        equal(rEle.$value().className,"add4");
        rEle.removeClass("add4 add1");
        equal(rEle.$value().className,"");
        rEle.removeClass("add4");
        equal(rEle.$value().className,"");
    });
    QUnit.test("removeClass에서 한단어가 아닌 같은 글씨가 있을 경우 짤리면 안된다.",function(){
        equal($Element("class_remove_test").removeClass("on").className(),"selected_on");
        equal($Element("class_remove_test2").removeClass("on").className(),"selected_on");
        equal($Element("class_remove_test3").removeClass("on").className(),"selected_on");
    });
    QUnit.test("~가 들어간 경우.",function(){
		var occurException = false;
		try {
			$Element("~");
		}
		catch (e) {
			occurException = true;
		}
		ok(!occurException);
    });
    QUnit.test("width가 없는 상태에서 border만 있는 경우 0으로 셋팅 할때 에러가 발생하면 안된다.",function(){
        var occurException = false;

        try {
            $Element("width_test").width(0);
        }
        catch (e) {
            occurException = true;
        }

        ok(!occurException);
    });
    QUnit.test("delegate에서 이벤트가 전파되어야 한다.",function(){
        var isClicked = false;
        var clickedEle = "";
        $Element("delegate_test").delegate("click", "a", function(e){
            isClicked = true;
            clickedEle = e.element;
        });
        $Element($$.getSingle("#delegate_test img")).fireEvent("click");
        deepEqual(clickedEle,$$.getSingle("#a_a"))
    });
    QUnit.test("이벤트가 전파될때 가까운쪽의 엘리먼트를 먼저 탄다.",function(){
        var isClicked = false;
        var clickedEle = "";
        $Element("delegate_test2").delegate("click", "a", function(e){
            isClicked = true;
            clickedEle = e.element;
        });
        $Element($$.getSingle("#delegate_test2 img")).fireEvent("click");
        equal(clickedEle,$$.getSingle("#a_a2"));
        ok(isClicked);
    });
    QUnit.test("filter가 function일때도 정상적으로 동작해야 한다.",function(){
        var isClicked = false;
        var clickedEle = "";
        $Element("delegate_test3").delegate("click", function(ele, targetEle){
            return targetEle.tagName.toUpperCase() == "A";
        }, function(e){
            isClicked = true;
            clickedEle = e.element;
        });
        $Element($$.getSingle("#delegate_test3 img")).fireEvent("click");
        deepEqual(clickedEle,$$.getSingle("#a_a3"))
    });
    QUnit.test("colgroup이 정상적으로 생성되는가?",function(){

        deepEqual($$.getSingle("#core_colgroup col"), null);
        $Element("core_colgroup").html("<col></col>");
        equal($$.getSingle("#core_colgroup col").tagName.toLowerCase(),"col");

        deepEqual($$.getSingle("#core_colgroup2 col"), null);
        $Element("core_colgroup2").prependHTML(" <COL bgcolor=\"gold\" align=\"center\">");
        equal($$.getSingle("#core_colgroup col").tagName.toLowerCase(),"col");

    });
    QUnit.test("태그 안에 속성이 들어가도 정상적으로 돔이 생성된다.",function(){
        equal($$("#set_tr_id").length,0);
        equal($$("#set_td_id").length,0);
        $Element("ele_attr_test").appendHTML("<tr id=\"set_tr_id\"><td id=\"set_td_id\">asdfasdf</td></tr> ");
        equal($$("#set_tr_id").length,1);
        equal($$("#set_td_id").length,1);

    });
	QUnit.test("addClass, removeClass는 빈문자가 들어와도 정상적으로 작동해야 한다.",function(){
        //Given
        var ele = $Element("abs");
		var sClassName = ele.className();
        //When
        ele.addClass("");
        //Then
        equal(ele.className(),sClassName);

        //Given
        var ele = $Element("abs");
		var sClassName = ele.className();
        //When
        ele.addClass(" ");
        //Then
        equal(ele.className(),sClassName);

        //Given
        var ele = $Element("abs");
		var sClassName = ele.className();
        //When
        ele.removeClass("");
        //Then
        equal(ele.className(),sClassName);

        //Given
        var ele = $Element("abs");
		var sClassName = ele.className();
        //When
        ele.removeClass(" ");
        //Then
        equal(ele.className(),sClassName);
	});
	QUnit.test("document에 'load' 이벤트를 attach 하는 경우, window에 'load' 이벤트를 attach 한다.",function(){
		var welDoc = $Element(document);
		welDoc.attach("load", loadHandler);

		var bHasEvent = $Element(window).hasEventListener("load");
		ok(bHasEvent);
		welDoc.detach("load", loadHandler);

		function loadHandler(){
			//alert("로드 핸들러");
		}
	});
	QUnit.test("document에 'load' 이벤트를 detach 하는 경우, window에 'load' 이벤트를 detach 한다.",function(){
		var welDoc = $Element(document);
		welDoc.attach("load", loadHandler);
		welDoc.detach("load", loadHandler);

		var bHasEvent = $Element(window).hasEventListener("load");
		ok(!bHasEvent);

		function loadHandler(){
			//alert("로드 핸들러2");
		}
	});
	QUnit.test("document에 'load'이벤트를 attach 하고, window에서 detach를 해도 정상작동해야 한다.",function(){
		var welDoc = $Element(document);
		welDoc.attach("load", loadHandler);
		$Element(window).detach("load", loadHandler);

		var bHasEvent = welDoc.hasEventListener("load");
		ok(!bHasEvent);

		function loadHandler(){
			//alert("로드 핸들러");
		}
	});
	QUnit.test("document에 'load'이벤트를 attach 하고, window에서 detach를 해도 정상작동해야 한다.",function(){
		var bool = $Element(document).attach("load", function(){}).hasEventListener("load")
		ok(bool);
	});
	QUnit.test("window에 'domready' 이벤트를 attach 하는 경우, document에 'domready' 이벤트를 attach 한다.",function(){
		var welWin = $Element(window);
		welWin.attach("domready", domreadyHandler);

		var bHasEvent = $Element(document).hasEventListener("domready");
		ok(bHasEvent);

		welWin.detach("domready", domreadyHandler);

		function domreadyHandler(){
			//alert("돔레디 핸들러");
		}
	});
	QUnit.test("window에 'domready' 이벤트를 detach 하는 경우, document에 'domready' 이벤트를 detach 한다.",function(){
		var welWin = $Element(window);
		welWin.attach("domready", domreadyHandler);
		welWin.detach("domready", domreadyHandler);

		var bHasEvent = $Element(document).hasEventListener("domready");
		ok(!bHasEvent);

		function domreadyHandler(){
			//alert("돔레디 핸들러");
		}
	});
	QUnit.test("window에 'domready'이벤트를 attach 한 후, document 에서 detach를 해도 정상작동해야 한다.",function(){
		var welWin = $Element(window);
		welWin.attach("domready", domreadyHandler);
		$Element(document).detach("domready", domreadyHandler);

		var bHasEvent = welWin.hasEventListener("domready");
		ok(!bHasEvent);

		function domreadyHandler(){
			//alert("돔레디 핸들러2");
		}
	});
	QUnit.test("window에 'domready' 이벤트를 attach 한 후, hasEventListener()를 호출하면 true를 반환해야 한다.",function(){
		var bool = $Element(window).attach("domready", function(){}).hasEventListener("domready");
		ok(bool);
	}
);


module("cache 문제");

    if(!document.querySelectorAll) {
        QUnit.test("html을 이용했을떼 css cache가 비워져 있는가?[[!document.querySelectorAll]]",function(){
            cssquery.useCache(true);
            cssquery._resetUID();
            cssquery.release();
            var currentInfo = cssquery._getCacheInfo();
            equal(currentInfo["uidCache"],{});
            equal(currentInfo["eleCache"],{});

            $Element("cssqueryrealse").query("a");

            currentInfo = cssquery._getCacheInfo();
            ok(!!currentInfo["uidCache"][0]);
            ok(!!currentInfo["eleCache"]["a_single"]);

            $Element("cssqueryrealse").html("1");
            currentInfo = cssquery._getCacheInfo();
            equal(currentInfo["uidCache"],{});
            equal(currentInfo["eleCache"],{});
        });
        QUnit.test("replace을 이용했을떼 css cache가 비워져 있는가?[[!document.querySelectorAll]]",function(){
            $Element("cssqueryrealse").html("<a href='1'>aaa</a>");
            cssquery.useCache(true);
            cssquery._resetUID();
            cssquery.release();
            var currentInfo = cssquery._getCacheInfo();
            equal(currentInfo["uidCache"],{});
            equal(currentInfo["eleCache"],{});

            $Element("cssqueryrealse").query("a");

            currentInfo = cssquery._getCacheInfo();
            ok(!!currentInfo["uidCache"][0]);
            ok(!!currentInfo["eleCache"]["a_single"]);

            $Element("cssqueryrealse").replace($("<span id='cssqueryrealse'><a href='#1'>aa</a></span>"));

            currentInfo = cssquery._getCacheInfo();
            equal(currentInfo["uidCache"],{});
            equal(currentInfo["eleCache"],{});
        });
        QUnit.test("empty을 이용했을떼 css cache가 비워져 있는가?[[!document.querySelectorAll]]",function(){
            $Element("cssqueryrealse").html("<a href='1'>aaa</a>");
            cssquery.useCache(true);
            cssquery._resetUID();
            cssquery.release();
            var currentInfo = cssquery._getCacheInfo();
            equal(currentInfo["uidCache"],{});
            equal(currentInfo["eleCache"],{});

            $Element("cssqueryrealse").query("a");

            currentInfo = cssquery._getCacheInfo();
            ok(!!currentInfo["uidCache"][0]);
            ok(!!currentInfo["eleCache"]["a_single"]);

            $Element("cssqueryrealse").empty();

            currentInfo = cssquery._getCacheInfo();
            equal(currentInfo["uidCache"],{});
            equal(currentInfo["eleCache"],{});
        });
        QUnit.test("remove을 이용했을떼 css cache가 비워져 있는가?[[!document.querySelectorAll]]",function(){
            $Element("cssqueryrealse").html("<a href='1'>aaa</a>");
            cssquery.useCache(true);
            cssquery._resetUID();
            cssquery.release();
            var currentInfo = cssquery._getCacheInfo();
            equal(currentInfo["uidCache"],{});
            equal(currentInfo["eleCache"],{});

            $Element("cssqueryrealse").query("a");

            currentInfo = cssquery._getCacheInfo();
            ok(!!currentInfo["uidCache"][0]);
            ok(!!currentInfo["eleCache"]["a_single"]);

            $Element("cssqueryrealse").remove($Element("cssqueryrealse").query("a"));

            currentInfo = cssquery._getCacheInfo();
            equal(currentInfo["uidCache"],{});
            equal(currentInfo["eleCache"],{});
        });
        QUnit.test("leave을 이용했을떼 css cache가 비워져 있는가?[[!document.querySelectorAll]]",function(){
            $Element("cssqueryrealse").html("<a href='1'>aaa</a>");
            cssquery.useCache(true);
            cssquery._resetUID();
            cssquery.release();
            var currentInfo = cssquery._getCacheInfo();
            equal(currentInfo["uidCache"],{});
            equal(currentInfo["eleCache"],{});

            $Element("cssqueryrealse").query("a");

            currentInfo = cssquery._getCacheInfo();
            ok(!!currentInfo["uidCache"][0]);
            ok(!!currentInfo["eleCache"]["a_single"]);

            $Element("cssqueryrealse").leave();

            currentInfo = cssquery._getCacheInfo();
            equal(currentInfo["uidCache"],{});
            equal(currentInfo["eleCache"],{});
        });
    }

    QUnit.test("href는 값이 정상적으로 해시만 들어와야 한다.",function(){
        equal($Element("href_test1").attr("href"),"#test");
        equal($Element("href_test2").attr("href"),"http://naver.com#test");
        equal($Element("href_test3").attr("href"),"http://naver.com?test=1#test");
    });
    QUnit.test("body에 붙이기 전에 width와 height가 2배로 나오는 현상.",function(){
        var box = $Element("<div></div>").width(50).height(50).css("backgroundColor", "#f00");
        equal(box.width(),0);
        equal(box.height(),0);
        document.body.appendChild(box.$value());
        equal(box.width(),50);
        equal(box.height(),50);
    });
	QUnit.test("IE에서 radio나 checkbox인 경우 fireEvent을 할 때 선택이 되어야 한다.",function(){
		//Given
		var ele1 = $Element("fireEventTest1");
		var ele2 = $Element("fireEventTest2");
		ele1.attr("checked",false);
		ele2.attr("checked",false);
		//When
		ele1.fireEvent("click");
		ele2.fireEvent("click");
		//Then
		ok(ele1.attr("checked"));
		ok(ele2.attr("checked"));
	}

);

module("$Element New API");
    QUnit.test("width의 파라메터을 parseFloat한 결과가 isNan이면 exception을 발생해야 한다.",function(){
        //Given
        var occcurException = false;
        var richEle = $Element("ele_padding_etc");

        //When
        try {
            richEle.width(null);
        }
        catch (e) {
            occcurException = true;
        }
        //Then
        ok(occcurException);

        //Given
        occcurException = false;
        //When
        try {
            richEle.width("asdf");
        }
        catch (e) {
            occcurException = true;
        }
        //Then
        ok(occcurException);

        //Given
        occcurException = false;
        //When
        try {
            richEle.width(true);
        }
        catch (e) {
            occcurException = true;
        }
        //Then
        ok(occcurException);
    });
    QUnit.test("width의 파라메터을 parseFloat한 결과 정상적이면 적용되어야 한다.",function(){
        //Given
        var occcurException = false;
        var richEle = $Element("ele_padding_etc");

        //When
        richEle.width("20");

        //Then
        equal(richEle.width(),20);
    });
    QUnit.test("height의 파라메터을 parseFloat한 결과가 isNan이면 exception을 발생해야 한다.",function(){
        //Given
        var occcurException = false;
        var richEle = $Element("ele_padding_etc");

        //When
        try {
            richEle.height(null);
        }
        catch (e) {
            occcurException = true;
        }
        //Then
        ok(occcurException);

        //Given
        occcurException = false;
        //When
        try {
            richEle.height("asdf");
        }
        catch (e) {
            occcurException = true;
        }
        //Then
        ok(occcurException);

        //Given
        occcurException = false;
        //When
        try {
            richEle.height(true);
        }
        catch (e) {
            occcurException = true;
        }
        //Then
        ok(occcurException);
    });
    QUnit.test("height의 파라메터을 parseFloat한 결과 정상적이면 적용되어야 한다.",function(){
        //Given
        var occcurException = false;
        var richEle = $Element("ele_padding_etc");

        //When
        richEle.height("20");

        //Then
        equal(richEle.height(),20);
    });
    QUnit.test("toggleClass는 파라메터가 없으면 exception이 발생한다.",function(){
        //Given
        var richEle = $Element("ele_opacity");
        //When
        var occurException = false;
        try {
            richEle.toggleClass();
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);
    });
    QUnit.test("Offset은 파라메터가 있는 경우 모두 숫자여야 한다.",function(){
        //Given
        var richEle = $Element("ele_opacity");
        richEle.css({
            "position": "absolute",
            "left": "0px",
            "top": "0px"
        });
        var occurException = false;
        //When
        try {
            richEle.offset("asdf");
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            richEle.offset(null);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            richEle.offset(1);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);
    });
    QUnit.test("append는 파라메터로 문자, 엘리먼트, $Element가 들어올 수 있다.",function(){
        //Given
        var richEle = $Element("ele_opacity");
        var occurException = false;
        //When
        try {
            richEle.append(1);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            richEle.append(true);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            richEle.append();
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

    });
    QUnit.test("prepend는 파라메터로 문자, 엘리먼트, $Element가 들어올 수 있다.",function(){
        //Given
        var richEle = $Element("ele_opacity");
        var occurException = false;
        //When
        try {
            richEle.prepend(1);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            richEle.prepend(true);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            richEle.prepend();
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

    });
    QUnit.test("replace는 파라메터로 문자, 엘리먼트, $Element가 들어올 수 있다.",function(){
        //Given
        var richEle = $Element("ele_opacity");
        var occurException = false;
        //When
        try {
            richEle.replace(1);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            richEle.replace(true);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            richEle.replace();
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

    });
    QUnit.test("appendTo는 파라메터로 문자, 엘리먼트, $Element가 들어올 수 있다.",function(){
        //Given
        var richEle = $Element("ele_opacity");
        var occurException = false;
        //When
        try {
            richEle.appendTo(1);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            richEle.appendTo(true);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            richEle.appendTo();
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

    });
    QUnit.test("preprendTo는 파라메터로 문자, 엘리먼트, $Element가 들어올 수 있다.",function(){
        //Given
        var richEle = $Element("ele_opacity");
        var occurException = false;
        //When
        try {
            richEle.preprendTo(1);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            richEle.preprendTo(true);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            richEle.preprendTo();
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

    });
    QUnit.test("before는 파라메터로 문자, 엘리먼트, $Element가 들어올 수 있다.",function(){
        //Given
        var richEle = $Element("ele_opacity");
        var occurException = false;
        //When
        try {
            richEle.before(1);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            richEle.before(true);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            richEle.before();
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

    });
    QUnit.test("after는 파라메터로 문자, 엘리먼트, $Element가 들어올 수 있다.",function(){
        //Given
        var richEle = $Element("ele_opacity");
        var occurException = false;
        //When
        try {
            richEle.after(1);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            richEle.after(true);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            richEle.after();
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

    });
    QUnit.test("parent의 첫 번째 인자로 함수가 아닌 경우 예외상황이 발생한다.",function(){
        //Given
        var el = $Element('rel');
        function onlyDiv(el){
            return (el.tag == "div");
        };
        var occurException = false;
        //When
        try {
            el.parent(true);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.parent(1);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.parent("asdf");
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

    });
    QUnit.test("parent의 두 번째 인자로 숫자가 아닌 경우 예외상황이 발생한다.",function(){
        //Given
        var el = $Element('rel');
        function onlyDiv(el){
            return (el.tag == "div");
        };
        var occurException = false;
        //When
        try {
            el.parent(null, null);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.parent(null, true);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.parent(null, "asdf");
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.parent(null, {});
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);
    });
    QUnit.test("child의 첫 번째 인자로 함수가 아닌 경우 예외상황이 발생한다.",function(){
        //Given
        var el = $Element('rel');
        function onlyDiv(el){
            return (el.tag == "div");
        };
        var occurException = false;
        //When
        try {
            el.child(true);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.child(1);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.child("asdf");
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

    });
    QUnit.test("child의 두 번째 인자로 숫자가 아닌 경우 예외상황이 발생한다.",function(){
        //Given
        var el = $Element('rel');
        function onlyDiv(el){
            return (el.tag == "div");
        };
        var occurException = false;
        //When
        try {
            el.child(null, null);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.child(null, true);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.child(null, "asdf");
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.child(null, {});
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);
    });
    QUnit.test("prev는 인자가 없거나 함수여야 한다.",function(){
        //Given
        var el = $Element('rel');
        var occurException = false;
        //When Then
        equal(el.prev(null)[0].$value(),$("txt"));

        //Given
        occurException = false;
        //When
        try {
            el.prev(1);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.prev("asdf");
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.prev({});
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);
    });
    QUnit.test("next는 인자가 없거나 함수여야 한다.",function(){
        //Given
        var el = $Element('txt');
        //When Then
        equal(el.next(null)[0].$value(),$("rel"));


        //Given
        occurException = false;
        //When
        try {
            el.next(1);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.next("asdf");
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.next({});
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);
    });
    QUnit.test("fireEvent는 첫번재 인자로 문자를 받을 수 있다.",function(){
        //Given
        var el = $Element('rel');
        var occurException = false;
        //When
        try {
            el.fireEvent();
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.fireEvent(1);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.fireEvent(null);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.fireEvent(true);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);
    });
    QUnit.test("fireEvent는 두번째 인자는 오브젝트만 받을 수 있다.",function(){
        //Given
        var el = $Element('rel');
        var occurException = false;
        //When
        try {
            el.fireEvent("click", 1);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.fireEvent("click", null);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.fireEvent("click", true);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);
    });
    QUnit.test("delegate는 첫번째 인자는 문자, 두번째 인자는 문자거나 함수, 세 번째 인자는 함수여야 한다.",function(){
        //Given
        var el = $Element('rel');
        var occurException = false;
        //When
        try {
            el.delegate(1, ".aa", function(){
            });
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);


        //Given
        occurException = false;
        //When
        try {
            el.delegate("click", 1, function(){
            });
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.delegate("click", ".aa", 1);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);
    });
    QUnit.test("undelegate는 첫번째 인자는 문자, 두번째 인자는 문자거나 함수, 세 번째 인자는 함수여야 한다.",function(){
        //Given
        var el = $Element('rel');
        el.delegate("click", ".aa", function(){
        });
        var occurException = false;

        //When
        try {
            el.undelegate(1, ".aa", function(){
            });
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);


        //Given
        occurException = false;
        //When
        try {
            el.undelegate("click", 1, function(){
            });
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);

        //Given
        occurException = false;
        //When
        try {
            el.undelegate("click", ".aa", 1);
        }
        catch (e) {
            occurException = true;
        }
        //Then
        ok(occurException);
    });
    QUnit.test("opacity에 값을 할당한 경우 this를 반환한다.",function(){
        //Given
        var el = $Element('rel');
        //When
        //Then
        equal(el.opacity(1),el);
    });
    QUnit.test("ellipsis는 인스턴스를 반환한다.",function(){
        //Given
        var el = $Element("rel");
        //When
        //Then
        equal(el.ellipsis(),el);
    });
    QUnit.test("query는 없으면 null있으면 인스턴스를 반환한다.",function(){
        //Given
        var ele = $Element("abs");
        //When
        //Then
        ok(ele.queryAll("p")[0] instanceof jindo.$Element);
    });
    QUnit.test("cssClass는 클래스를 불린값으로 설정이 가능하다.",function(){
        //Given
        var ele = $Element("abs");
        //When
        var eReturn = ele.cssClass("test",true);
        //Then
        ok(ele.hasClass("test"));
        equal(eReturn,ele);

        //Given
        //When
        var eReturn = ele.cssClass("test",false);
        //Then
        ok(!ele.hasClass("test"));
		equal(eReturn,ele);

        //Given
        //When
        //Then
        ok(!ele.cssClass("test"));

        //Given
        //When
        var eReturn = ele.cssClass("test",true);
        //Then
        ok(ele.cssClass("test"));
		equal(eReturn,ele);

        //Given
        //When
        var eReturn = ele.cssClass({
			"test" : false,
			"test2" : true,
			"test3" : false
		});
        //Then
        ok(!ele.cssClass("test"));
        ok(ele.cssClass("test2"));
        ok(!ele.cssClass("test3"));
		equal(eReturn,ele);

        //Given
        //When
        var eReturn = ele.cssClass($H({
			"test" : true,
			"test2" : false,
			"test3" : true
		}));
        //Then
        ok(ele.cssClass("test"));
        ok(!ele.cssClass("test2"));
        ok(ele.cssClass("test3"));
		equal(eReturn,ele);
    });
	QUnit.test("hasEventListener는 해당이벤트가 할당이 되었는지 확인한다.",function(){
		var hasEventListener = $Element("<div id='haseventlistener'/>");
		hasEventListener.appendTo(document.body);
		ok(!hasEventListener.hasEventListener("click"));

		hasEventListener.attach("click",function(){});
		ok(hasEventListener.hasEventListener("click"));
	});
	QUnit.test("fireEvent로 실행하면 currentElement는 있어야 한다.",function(){
		//Given
		var ele = $Element("currentElement_test");
		var isExcuted = false;
		function callback(e){
			equal(e.currentElement.id,"currentElement_test");
			isExcuted = true;
		}
		ele.attach("click",callback);
		//When
		ele.fireEvent("click");
		ele.detach("click",callback);
		//Then
		ok(isExcuted);
	});
	QUnit.test("delegate가 발생해도 정상적으로 currentElement가 있는가?.",function(){
		//Given
		var ele = $Element("currentElement_test");
		var isExcuted = false;
		function callback(e){
			equal(e.currentElement.id,"currentElement_test");
			isExcuted = true;
		}
		ele.attach("click",callback);
		//When
		$Element("currentElement_test2").fireEvent("click");
		ele.detach("click",callback);
		//Then
		ok(isExcuted);
	});
	QUnit.test("attr에서 value는 정상적으로 반환되어야 한다.",function(){
		//Given
		var ele = $Element("attr_ie_bug_test");
		//When
		var attr = ele.attr('value');
		//Then
		equal(attr,"val1");
	});
	QUnit.test("value값이 변해도 attr로 value는 정상적으로 반환해야 한다.",function(){
		//Given
		var weAttr = $Element("attr_text");
		//When
		weAttr.attr("value","change");
		//Then
		equal(weAttr.attr("value"),"change");

	});
	QUnit.test("같은 이름의 클래스가 2개일 때 같이 삭제되어야 한다.",function(){
		//Given
		var ele = $Element("double_class");
		//When
		ele.removeClass("foo");
		//Then
		ok(!ele.hasClass("foo"));
	});
    QUnit.test("Metacharacter가 포함된 클래스도 올바로 제거 되어야 한다.",function(){
        var ele = $Element("double_class"),
            aClass = [ "[abc]", "^abc:", "[abc]a" ];

        ele.addClass(aClass.join(" "));

        // metacharacter가 포함된 일부만 제거 시도하는 경우, 제거되지 않아야 한다.
        ele.removeClass("bc]a");
        ok(ele.hasClass("[abc]a"));

        for(var i=0, sClass; sClass = aClass[i]; i++) {
            ele.removeClass(sClass);
            ok(!ele.hasClass(sClass));
        }
    });
	QUnit.test("append, prepend, appendTo, prependTo, replace, before, after은 반환값이 본인 인스턴스이다.",function(){
		var wEle  = jindo.$Element("asdf1_return");
		var wEle2 = jindo.$Element("asdf2_return");
		var wEle3 = jindo.$Element("asdf3_return");
		equal(wEle.after("<span>"),wEle);
		equal(wEle.before("<span>"),wEle);
		equal(wEle.append("<span>"),wEle);
		equal(wEle.appendTo("<span>"),wEle);
		equal(wEle2.prepend("<span>"),wEle2);
		equal(wEle2.prependTo("<span>"),wEle2);
		equal(wEle3.replace("<span>"),wEle3);
	});
	QUnit.test("preventTapHighlight 메서드는 반환값이 인스턴스 이다.",function(){
		var el = jindo.$Element(document.body);
		equal(el.preventTapHighlight(),el);
	});
	QUnit.test("compare",function(){
		ok(jindo.$Element._contain(document,document.body));
		ok(!jindo.$Element._contain(document,document));
		var fragmentDIV = document.createElement("div");
		var fragmentDIV2 = document.createElement("div");
		fragmentDIV2.innerHTML = "<ul><li></li></ul>"
		ok(!jindo.$Element._contain(document,fragmentDIV));
		ok(jindo.$Element._contain(fragmentDIV2,fragmentDIV2.firstChild));
//
		var fragment = document.createDocumentFragment();
		var fragmentDIV3 = document.createElement("div");
		fragment.appendChild(fragmentDIV3);
		ok(jindo.$Element._contain(fragment,fragmentDIV3));
		ok(!jindo.$Element._contain(document,fragment));
	});
	QUnit.test("data메서드는 기본 기능은 정상적으로 동작해야 한다.",function(){
		//Given
		//When
		$Element("datatest").data("test","test");
		//Then
		equal($Element("datatest").data("test"),"test");

		//Given
		//When
		$Element("datatest").data({
			"test1" : "1",
			"test2" : "2"
		});
		//Then
		equal($Element("datatest").data("test1"),"1");
		equal($Element("datatest").data("test2"),"2");
	});
	QUnit.test("돔에 이미 data값이 들어있어도 정상적으로 동작한다.",function(){
        //Given
        //When
        var type = $Element("datatest2").data("type");
        //Then
        equal(type,"test");

        //Given
        //When
        $Element("datatest2").data({
            "test1" : "1",
            "test2" : "2"
        });
        //Then
        equal($Element("datatest2").data("test1"),"1");
        equal($Element("datatest2").data("test2"),"2");
    });
	QUnit.test("data메서드는 문자만 설정하고 가져올 수 있다.",function(){
	  	//Given
		//When
		$Element("datatest").data("string","test");
		$Element("datatest").data("number",1);
		$Element("datatest").data("zero",0);
		$Element("datatest").data("boolean",true);
		$Element("datatest").data("object",{"a":1,"b":2});
		$Element("datatest").data("array",[1,2]);
		// $Element("datatest").data("null",null);//delete
		$Element("datatest").data("function",function(){alert(1);});
		$Element("datatest").data("undefined",undefined);

		//Then
		equal($Element("datatest").data("string"),"test");
		equal($Element("datatest").data("number"),1);
		equal($Element("datatest").data("zero"),0);
		equal($Element("datatest").data("boolean"),true);
		deepEqual($Element("datatest").data("object"),{"a":1,"b":2});
		deepEqual($Element("datatest").data("array"),[1,2]);
		equal($Element("datatest").data("function"),null);
		// equal($Element("datatest").data("undefined"),null);
	});
    QUnit.test("data메서드는 대소문자를 구분한다.",function(){
        //Given
        //When
        var value = $Element("dataHello").data("hello");
        var value2 = $Element("dataHello").data("HELLO");
        //Then
        equal(value,"world");
        deepEqual(value2, null);
    });
    QUnit.test("data메서드는 dash와 camelCase모두 set할 수 있다.",function(){
        //Given
        $Element("dataHello").data("hello-world","change");
        //When
        var value = $Element("dataHello").data("hello-world");
        //Then
        equal(value,"change");

        //Given
        $Element("dataHello").data("helloWorld","change2");
        //When
        var value = $Element("dataHello").data("helloWorld");
        //Then
        equal(value,"change2");
    });
    QUnit.test("null을 넣으면 삭제된다.",function(){
        //Given
        //When
        $Element("datatest").data("del",1);
        //Then
        equal($Element("datatest").data("del"),"1");

        //When
        $Element("datatest").data("del",null);
        //Then
        deepEqual($Element("datatest").data("del"), null);
    });
	QUnit.test("null을 넣으면 삭제된다.",function(){
	  	//Given
		//When
		$Element("datatest").data("del",1);
		//Then
		equal($Element("datatest").data("del"),"1");

		//When
		$Element("datatest").data("del",null);
		//Then
		deepEqual($Element("datatest").data("del"), null);
	});

//
	// QUnit.test("leave() 메서드 호출시, 모든 하위 요소의 모든 이벤트가 제거되어야 한다.",function(){
	    // //Given
		// var welChild0 = $Element("a0-1-0");
		// var welChild1 = $Element("a1-0");
//
		// welChild0.attach("click", function(){
            // alert(this._element.id);
        // }).attach("mouseover", function(){
            // this._element.style.cssText = "font-size:20px;font-weight:bold;";
        // }).attach("mouseout", function(){
            // this._element.style.cssText = "font-size:14px;font-weight:normal;";
        // });
		// welChild1.attach("click", function(){
            // alert(this._element.id);
        // }).attach("mouseover", function(){
            // this._element.style.cssText = "font-size:20px;font-weight:bold;color:#FF0000;";
        // }).attach("mouseout", function(){
            // this._element.style.cssText = "font-size:14px;font-weight:normal;color:#000000;";
        // });
//
        // //When
        // var wel = $Element("div4releaseAllChildEventHandler").leave();
//
        // //Then
        // ok(!welChild0.hasEventListener("click"));
        // ok(!welChild0.hasEventListener("mouseover"));
        // ok(!welChild0.hasEventListener("mouseout"));
//
        // ok(!welChild1.hasEventListener("click"));
        // ok(!welChild1.hasEventListener("mouseover"));
        // ok(!welChild1.hasEventListener("mouseout"));
//
        // $Element(document.body).append(wel);
	// },
	// QUnit.test("remove() 메서드 호출시, 모든 하위 요소의 모든 이벤트가 제거되어야 한다.",function(){
		// var welChild0 = $Element("a0-1-0");
		// var welChild1 = $Element("a1-0");
//
		// welChild0.attach("click", function(){
            // alert(this._element.id);
        // }).attach("mouseover", function(){
            // this._element.style.cssText = "font-size:20px;font-weight:bold;";
        // }).attach("mouseout", function(){
            // this._element.style.cssText = "font-size:14px;font-weight:normal;";
        // });
		// welChild1.attach("click", function(){
            // alert(this._element.id);
        // }).attach("mouseover", function(){
            // this._element.style.cssText = "font-size:20px;font-weight:bold;color:#FF0000;";
        // }).attach("mouseout", function(){
            // this._element.style.cssText = "font-size:14px;font-weight:normal;color:#000000;";
        // });
//
        // var wel = $Element("div4releaseAllChildEventHandler");
        // wel.parent().remove("div4releaseAllChildEventHandler");
//
        // ok(!welChild0.hasEventListener("click"));
        // ok(!welChild0.hasEventListener("mouseover"));
        // ok(!welChild0.hasEventListener("mouseout"));
//
        // ok(!welChild1.hasEventListener("click"));
        // ok(!welChild1.hasEventListener("mouseover"));
        // ok(!welChild1.hasEventListener("mouseout"));
//
        // $Element(document.body).append(wel);
	// },
	// QUnit.test("html() 메서드에 인자값을 넣어 호출시, 모든 하위 요소의 모든 이벤트가 제거되어야 한다.",function(){
		// var welChild0 = $Element("a0-1-0");
		// var welChild1 = $Element("a1-0");
//
		// welChild0.attach("click", function(){
            // alert(this._element.id);
        // }).attach("mouseover", function(){
            // this._element.style.cssText = "font-size:20px;font-weight:bold;";
        // }).attach("mouseout", function(){
            // this._element.style.cssText = "font-size:14px;font-weight:normal;";
        // });
		// welChild1.attach("click", function(){
            // alert(this._element.id);
        // }).attach("mouseover", function(){
            // this._element.style.cssText = "font-size:20px;font-weight:bold;color:#FF0000;";
        // }).attach("mouseout", function(){
            // this._element.style.cssText = "font-size:14px;font-weight:normal;color:#000000;";
        // });
//
        // var wel = $Element("div4releaseAllChildEventHandler");
        // var html = wel.html();
        // wel.html("");
//
        // ok(!welChild0.hasEventListener("click"));
        // ok(!welChild0.hasEventListener("mouseover"));
        // ok(!welChild0.hasEventListener("mouseout"));
//
        // ok(!welChild1.hasEventListener("click"));
        // ok(!welChild1.hasEventListener("mouseover"));
        // ok(!welChild1.hasEventListener("mouseout"));
//
        // wel.html(html);
	// },
	// QUnit.test("empty() 메서드 호출시, 모든 하위 요소의 모든 이벤트가 제거되어야 한다.",function(){
		// var welChild0 = $Element("a0-1-0");
		// var welChild1 = $Element("a1-0");
//
		// welChild0.attach("click", function(){
            // alert(this._element.id);
        // }).attach("mouseover", function(){
            // this._element.style.cssText = "font-size:20px;font-weight:bold;";
        // }).attach("mouseout", function(){
            // this._element.style.cssText = "font-size:14px;font-weight:normal;";
        // });
		// welChild1.attach("click", function(){
            // alert(this._element.id);
        // }).attach("mouseover", function(){
            // this._element.style.cssText = "font-size:20px;font-weight:bold;color:#FF0000;";
        // }).attach("mouseout", function(){
            // this._element.style.cssText = "font-size:14px;font-weight:normal;color:#000000;";
        // });
//
        // $Element("div4releaseAllChildEventHandler").empty();
//
        // ok(!welChild0.hasEventListener("click"));
        // ok(!welChild0.hasEventListener("mouseover"));
        // ok(!welChild0.hasEventListener("mouseout"));
//
        // ok(!welChild1.hasEventListener("click"));
        // ok(!welChild1.hasEventListener("mouseover"));
        // ok(!welChild1.hasEventListener("mouseout"));
	// },
	// QUnit.test("empty() 메서드 호출시, 모든 하위 요소의 모든 이벤트가 제거되어야 한다.",function(){
		// var welChild0 = $Element("a0-1-0");
		// var welChild1 = $Element("a1-0");
//
		// welChild0.attach("click", function(){
            // alert(this._element.id);
        // }).attach("mouseover", function(){
            // this._element.style.cssText = "font-size:20px;font-weight:bold;";
        // }).attach("mouseout", function(){
            // this._element.style.cssText = "font-size:14px;font-weight:normal;";
        // });
		// welChild1.attach("click", function(){
            // alert(this._element.id);
        // }).attach("mouseover", function(){
            // this._element.style.cssText = "font-size:20px;font-weight:bold;color:#FF0000;";
        // }).attach("mouseout", function(){
            // this._element.style.cssText = "font-size:14px;font-weight:normal;color:#000000;";
        // });
//
        // $Element("div4releaseAllChildEventHandler").empty();
//
        // ok(!welChild0.hasEventListener("click"));
        // ok(!welChild0.hasEventListener("mouseover"));
        // ok(!welChild0.hasEventListener("mouseout"));
//
        // ok(!welChild1.hasEventListener("click"));
        // ok(!welChild1.hasEventListener("mouseover"));
        // ok(!welChild1.hasEventListener("mouseout"));
	// },

	QUnit.test("$Element에 textnode가 들어가도 에러가 발생하면 안된다.",function(){
		//Given
		 var raiseError = false;

		//Then
		try{
		    var  ele = $Element(document.createTextNode("\n"));
		}catch(e){
		    raiseError = true;
		}

		//When
		ok(!raiseError);
	});
	QUnit.test("$Element#queryAll에서 반환값이 없어도 Array가 반환되어야 함",function(){
	    //Given
	    var  noSuchElement = $Element(document);
	    var count ;

	    //Then
	    count = noSuchElement.queryAll(".asdfasdfasdfasdfasdfasdfasdfasdfadsasdf");

	    //When
	    equal(count.length,0);
	    equal([].constructor,Array);

	});
	QUnit.test("$Element#offset이 오프라인에 돔일 때 에러가 발생하면 안된다.",function(){
        //Given
        var div = $Element("<div>");
        var raiseError = false;
        //Then
        try{
            div.offset(10,10);
        }catch(e){
            raiseError = true;
        }
        var offset = div.offset();
        //When
        ok(!raiseError);
        equal(offset.left,0);
        equal(offset.top,0);
    });
    QUnit.test("$Element#css에 -(dash)가 들어가도 정상적으로 동작해야 한다.",function(){
        //Given
        var div = $Element("<div>");
        //Then
        div.css("font-style","italic");
        //When
        equal(div.css("font-style"),"italic");
    });
     QUnit.test("svg에서 classList을 사용할 수 없다면 jindo._p_.canUseClassList는 false여야 한다.",function(){

       if("classList" in document.body){
            var matches = navigator.userAgent.match(/(?:MSIE) ([0-9.]+)/);
            if(matches&&parseInt(matches[1],10) == 10){
                ok(!jindo._p_.canUseClassList());
            }else{
                if("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g")){
                    ok(jindo._p_.canUseClassList());
                }else{
                    ok(!jindo._p_.canUseClassList());
                }
            }
        }else{
            ok(!jindo._p_.canUseClassList());
        }
    });
    QUnit.test("이 들어가면 정상적으로 나와야 한다.",function(){
        //Given
        //When
        var type = $Element("datatest3").data("type");
        //Then
        equal(type,"asdf");

        //Given
        $Element("datatest3").data("type3",{"asdf":"asdf"});
        //When
        type = $Element("datatest3").data("type3");
        //Then
        deepEqual(type,{"asdf":"asdf"});

        //Given
        //When
        type = $Element("datatest3").data("some");
        //Then
        equal(type,"\"asdf\"");

    });
    QUnit.test("clone은 정상적으로 복제된다.",function(){
        //Given
        var cloneNode;
        var deepCloneNode;

        //When
        cloneNode = jindo.$Element("clone_test").clone(false);
        deepCloneNode = jindo.$Element("clone_test").clone();


        //Then
        ok(cloneNode instanceof jindo.$Element);
        ok(deepCloneNode instanceof jindo.$Element);

        equal(cloneNode.$value().id,cloneNode.$value().id);
        equal(deepCloneNode.$value().id,deepCloneNode.$value().id);

        equal(cloneNode.queryAll("div").length,0);
        equal(deepCloneNode.queryAll("div").length,1);

    });
    QUnit.test("transiton값을 넣지 않아도 기본 값을 정상적으로 값이 반환되어야 한다.",function(){
        //Give
        var val;
        var vendorPrefixObj = {
            "-moz" : "Moz",
            "-ms" : "ms",
            "-o" : "O",
            "-webkit" : "webkit"
        };
        var defaultVal = "transition";
        var javascriptVal;
        var cssVal;
        var expectedVal = "all 0s ease 0s";

        var type;
        for(var x in vendorPrefixObj){
            if(document.body.style[vendorPrefixObj[x]+"Transition"] != undefined){
                javascriptVal = vendorPrefixObj[x]+"Transition";
                cssVal = x+"-transition";
                type = x;
            }
        }

        if(!type){
            javascriptVal = "transition";
            cssVal = "transition";
            type = "";
        }
        var isWebkit = $Agent().navigator().webkit;
        var isChrome = $Agent().navigator().chrome;
        var isIE = $Agent().navigator().ie;
        var version = $Agent().navigator().version;

        if(isIE && version < 9){
            expectedVal = undefined;
        }else if(type === "-moz" || type === "" || isWebkit){
            expectedVal = "";
            if(isWebkit&&version >= 7){
                expectedVal = "all 0s ease 0s";
            }
        }else if(type === "-o"){
            expectedVal = "all 0s 0s cubic-bezier(0.25, 0.1, 0.25, 1)";
        } else if(isChrome){
            //When
            val = jindo.$Element(document.body).css("WebkitTransition");
            //Then
            deepEqual(val,expectedVal);
        }

        //When
        val = jindo.$Element(document.body).css(defaultVal);
        //Then
        deepEqual(val,expectedVal);

        // When
        val = jindo.$Element(document.body).css(javascriptVal);
        //Then
        deepEqual(val,expectedVal);

        //When
        val = jindo.$Element(document.body).css(cssVal);
        //Then
        deepEqual(val,expectedVal);
    });
    QUnit.test("모든 브라우저에서 이벤트 명이 변경되도 정상적으로 할당되어야 한다.",function(){
        //Given
        var hello = $Element("dataHello");
        function domreadyHandler(){}
        function domreadyHandler2(){}

        //When
        hello.attach("mousedown", domreadyHandler);
        hello.attach("mousedown", domreadyHandler2);
        var eventName = jindo.$Element.eventManager.revisionEvent("", "mousedown");
        var result = jindo.$Element.eventManager.test()[hello.$value()["__jindo__id"]]["event"][eventName].type["_jindo_event_none"].normal.length;

        //Then
        equal(result,2);

        //When
        hello.detach("mousedown", domreadyHandler);
        hello.detach("mousedown", domreadyHandler2);

        //Then
        var result = jindo.$Element.eventManager.test()[hello.$value()["__jindo__id"]];
        deepEqual(result, undefined);
    });
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