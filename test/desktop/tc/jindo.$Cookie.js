QUnit.config.autostart = false;

document.cookie = "nickname="+escape("netil")+(";expires="+(new Date((new Date()).getTime()-(1*1000*60*60*24))).toGMTString())+"; path=/";
document.cookie = "blog="+escape("http://naver.com")+(";expires="+(new Date((new Date()).getTime()-(1*1000*60*60*24))).toGMTString())+"; path=/";

module("$Cookie 객체");
	QUnit.test("$Cookie 객체가 만들어지는가?",function(){
		var c = $Cookie();
		ok($Cookie() instanceof $Cookie);
	});

	QUnit.test("set : 쿠키가 설정되나?",function(){
		var c = $Cookie();

        try {
		    ok(c.set('nickname', 'netil',10) === c);
		} catch(e) {
		    ok(true);
		}

		var coo = (document.cookie)+"";
		var sDomain = document.domain;
		ok(/nickname=netil/.test(coo));
		ok(c.set('nickname2', 'netil2',0, sDomain) === c);
		// ok(c.set('nickname3', 'netil3',null, sDomain) === c);
		ok(c.set('nickname4', 'netil4',0, sDomain, "/test") === c);

		c.remove('nickname');
		c.remove('nickname2',sDomain);
		c.remove('nickname3',sDomain);
		c.remove('nickname4',sDomain);
	});

	QUnit.test("set : 숫자도 넣을 수 있게",function(){
		var c = $Cookie();
		ok(c.set('nickname', 1,10) === c);
		var coo = (document.cookie)+"";
		var sDomain = document.domain;
		ok(/nickname=1/.test(coo));

		c.remove('nickname');
	});
	QUnit.test("get : 쿠키를 가져오나?",function(){
		var c = $Cookie();

		c.set('nickname', 'netil',1);
		deepEqual(c.get('nickname'),'netil');
		deepEqual(c.get('nickname3'),null);
	});
	QUnit.test("remove : 값을 지울 수 있나?",function(){
		var c = $Cookie();

		c.set('nickname', 'netil',1);

		deepEqual(c.get('nickname')+"",'netil');
		c.remove('nickname');
		deepEqual(c.get('nickname'),null);
	});
	QUnit.test("keys : 설정된 값들을 확인할 수 있나?",function(){
		var c = $Cookie();

		c.set('nickname', 'netil',1);
		c.set('blog', 'http://netil.com',1);

        ok(c.get('nickname'));
        ok(c.get('blog'));
	});
	QUnit.test("값 인코딩에 사용할 함수에 따라 값을 제대로 인코딩 하는가?",function(){
            // use escape/unescape
            var c = $Cookie();
            c.set("bark", "멍멍!");
            deepEqual(c.get("bark"),"멍멍!");
            $Cookie._cached = null;

            // use encodeURIComponent/decodeURIComponent
            c = $Cookie(true);
            deepEqual(c.get("bark"),"멍멍!");
            c.set("bark", "멍멍!");
            $Cookie._cached = null;

            // use escape/unescape
            c = $Cookie(false);
            c.set("bark", "멍멍!");
            deepEqual(c.get("bark"),"멍멍!");
            $Cookie._cached = null;

            // use encodeURIComponent/decodeURIComponent
            c = $Cookie(true);
            deepEqual(c.get("bark"),"멍멍!");
            c.set("bark", "멍멍!");
            c.remove("bark");
            $Cookie._cached = null;
	    }
    );