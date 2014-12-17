QUnit.config.autostart = false;

module("$H 객체 this context", {
    setup: function() {
        whHash = $H({"a":1});
    }
});

	QUnit.test("forEach",function(){
		//Given
		var i=0,that;
		//When
		whHash.forEach(function(){
			i++;
			that = this;
		});
		//Then
		equal(i,1);
		equal(that,whHash);
	});
	QUnit.test("filter",function(){
		//Given
		var i=0,that;
		//When
		whHash.filter(function(){
			i++;
			that = this;
		});
		//Then
		equal(i,1);
		equal(that,whHash);
	});
	QUnit.test("map",function(){
		//Given
		var i=0,that;
		//When
		whHash.map(function(){
			i++;
			that = this;
		});
		//Then
		equal(i,1);
		equal(that,whHash);
	}
);


module("$H 객체");
	QUnit.test("$H : hash 객체가 만들어지는지?",function(){
		ok($H() instanceof $H);
		ok($H({a:1,b:2}) instanceof $H);
		ok($H($H()) instanceof $H);
	});
	QUnit.test("$H 객체가 생성함수에 전달되면 원래 객체가 반환",function(){
		var h = $H();
		ok($H(h) === h);
	});
	QUnit.test("$value : 원래의 객체와 다른 객체가 반환, 단 값은 같아야 한다",function(){
		var o1 = { a:1, b:2 };
		var o2 = { a:1, b:2 };

		ok($H(o1).$value() !== o1);
		ok($H(o1).$value() !== o2);
		deepEqual($H(o1).$value(),o1);
		deepEqual($H(o1).$value(),o2);
	});
	QUnit.test("$ : 값을 설정하거나 가져온다",function(){
		var o = { a:1, b:2, c:3 };
		var h = $H(o);

		equal(h.$("a"),1);
		equal(h.$("a", "first"),h);
		equal(h.$("a"),"first");
	});
	QUnit.test("length: 크기를 반환",function(){
		equal($H().length(),0);
		equal($H({a:1,b:2}).length(),2);
	});
	QUnit.test("foreach : 콜백함수 실행",function(){
		var o1 = {a:1, b:2};
		var o2 = {};
		var h1 = $H(o1);
		var fn = function(v, k, o) {
			o2[k] = v;
		};

		ok(h1.forEach(fn) === h1);
		deepEqual(o2,{a:1, b:2});
	});
	QUnit.test("filter : 필터링",function(){
		var o1 = {a:3, b:2, c:1, d:4};
		var h1 = $H(o1);
		var fn = function(v, k, o) {
			return v > 2;
		};

		ok($H(o1).filter(fn) instanceof $H);
		deepEqual($H(o1).filter(fn).$value(),{a:3,d:4});
	});
	QUnit.test("map : 콜백실행 & 반환값 저장",function(){
		var o1 = {a:1, b:2};
		var h1 = $H(o1);
		var fn = function(v, k, o) {
			return v+1;
		};
		var h1 = h1.map(fn);
//		ok( === h1); 2.0.0부터는 $A와 같이 새로 생성한 hash를 반환.
		deepEqual(h1.$value(),{a:2, b:3});
	});
	QUnit.test("add : 키와 값을 추가",function(){
		var o1 = {a:1, b:2};
		var h1 = $H(o1);

		deepEqual(h1.add("c", 3),h1);
		deepEqual(h1.$value(),{a:1, b:2, c:3});
	});
	QUnit.test("remove : 해시 테이블에 존재하는 값 제거",function(){
		var o1 = {a:1, b:2, c:3};
		var h1 = $H(o1);

		equal(h1.remove("c"),3);
		deepEqual(h1.$value(),{a:1, b:2});
	});
	QUnit.test("search : 값 검색 후 해당 키 반환",function(){
		var o1 = {a:1, b:2, c:3};
		var h1 = $H(o1);

		equal(h1.search(3),"c");
		ok(!h1.search(5));
	});
	QUnit.test("hasKey : 키 존재 여부 판별",function(){
		var o1 = {a:1, b:2, c:3};
		var h1 = $H(o1);

		ok(h1.hasKey("a"));
		ok(h1.hasKey("b"));
		ok(!h1.hasKey("d"));
	});
	QUnit.test("hasValue : 값 존재 여부 판별",function(){
		var o1 = {a:1, b:2, c:1, d:3};
		var h1 = $H(o1);

		ok(h1.hasValue(2));
		ok(h1.hasValue(1));
		ok(!h1.hasValue(4));
	});
	QUnit.test("sort : 현재 객체를 값기준 정렬",function(){
		var o1 = {a:3, b:2, c:1, d:4};
		var h1 = $H(o1);

		deepEqual(h1.$value(),{a:3, b:2, c:1, d:4});
		ok(h1.sort() === h1);
		deepEqual(h1.$value(),{c:1, b:2, a:3, d:4});
	});
	QUnit.test("ksort : 현재 객체를 키기준 정렬",function(){
		var o1 = {c:1, a:3, d:4, b:2};
		var h1 = $H(o1);

		deepEqual(h1.$value(),{c:1, a:3, d:4, b:2});
		ok(h1.sort() === h1);
		deepEqual(h1.$value(),{a:3, b:2, c:1, d:4});
	});
	QUnit.test("keys : 키 이름의 배열 반환",function(){
		var o1 = {c:1, a:3, d:4, b:2};
		var h1 = $H(o1);

		deepEqual(h1.keys(),['c','a','d','b']);
	});
	QUnit.test("values : 값의 배열 반환",function(){
		var o1 = {c:1, a:3, d:4, b:2};
		var h1 = $H(o1);

		deepEqual(h1.values(),[1, 3, 4, 2]);
	});
	QUnit.test("toQueryString : 쿼리 형태로 변환",function(){
		// 단순한 것부터
		equal($H({a:1,b:2}).toQueryString(),"a=1&b=2");

		// 조금 더 복잡한 것
		equal($H({a:"abcde",b:"123251"}).toQueryString(),"a=abcde&b=123251");

		// 한글 포함
		equal($H({a:"안녕",b:"123251"}).toQueryString(),"a=%EC%95%88%EB%85%95&b=123251");

		// 배열 포함
		equal($H({a:"안녕",b:"123251",c:[1,2,3]}).toQueryString(),"a=%EC%95%88%EB%85%95&b=123251&c[]=1&c[]=2&c[]=3");
	});
	QUnit.test("$H.Break : 멈추기",function(){
		var h = {a:1, b:5, c:23};
		var r = "";

		$H(h).forEach(function(v,k,o){
			r += k;
			if (k == "b") $H.Break();
			r += ":"+v+",";
		});

		equal(r,"a:1,b");
	});
	QUnit.test("$H.Continue : 계속하기",function(){
		var h = {a:1, b:5, c:23};
		var r = "";

		$H(h).forEach(function(v,k,o){
			r += k;
			if (k == "b") $H.Continue();
			r += ":"+v+",";
		});

		equal(r,"a:1,bc:23,");
	});
	QUnit.test("값에 null이 있는 경우도 정상적으로 호출 되어야 한다.",function(){
		var oObj = {
		   hello : null,
		   world : null,
		   foo : 'bar'
		};

		var richHash = $H(oObj);
		equal(oObj.hello,richHash.$value().hello);
		equal(oObj.world,richHash.$value().world);
		equal(oObj.foo,richHash.$value().foo);
	});
	QUnit.test("empty는 정상적으로 값이 비워져 있어야 한다.",function(){
		var hash = $H({a:1, b:2, c:3});
		deepEqual(hash.empty().$value(),{});
	}
);


module("$H new api");
	QUnit.test("생성자는 배열, $H, null이거나 없어야 한다.",function(){
		var navi = $Agent().navigator();
		if ((!navi.ie) || navi.version > 6) {
			equal($H("asdf"),null);
			equal($H([]),null);
			equal($H(true),null);
			equal($H(1),null);
		}

	});
	QUnit.test("forEach에서 첫 번째 인자가 함수가 아닌 경우 예외상황",function(){
		//Given
		var hash = $H({});
		var occurException = false;
		//When
		try{
			hash.forEach();
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);
	});
	QUnit.test("filter에서 첫 번째 인자가 함수가 아닌 경우 예외상황",function(){
		//Given
		var hash = $H({});
		var occurException = false;
		//When
		try{
			hash.filter()
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);
	});
	QUnit.test("map에서 첫 번째 인자가 함수가 아닌 경우 예외상황",function(){
		//Given
		var hash = $H({});
		var occurException = false;
		//When
		try{
			hash.map()
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);
	});
	QUnit.test("forEach메서드에서 $H의 break을 이용하면 그 때까지의 결과값을 반환한다.",function(){
		//Given
		var hash = $H({a:1,b:2,c:3});
		var i = 0;
		//When
		hash.forEach(function(v){
			i++;
			if(v==2){
				$H.Break();
			}
		});
		//Then
		equal(i,2);
	});
	QUnit.test("map메서드에서 $H의 break을 이용하면 그 때까지의 결과값을 반환한다.",function(){
		//Given
		var hash = $H({a:1,b:2,c:3});
		var i = 0;
		//When
		var returnVal = hash.map(function(v){
			if(v==3){
				$H.Break();
			}
			return v+1;
		});
		//Then
		deepEqual(returnVal.$value(), {
			a: 2,
			b: 3
		});
	});
	QUnit.test("filter메서드는 $H의 break을 사용하면 그 때까지의 결과값을 반환한다.",function(){
		//Given
		var hash = $H({a:1,b:2,c:3});
		//When
		var returnVal = hash.filter(function(v){
			if(v === 3){
				$H.Break();
			}
			return v%2;
		});
		//Then
		deepEqual(returnVal.$value(), {
			a: 1
		});
	});
	QUnit.test("forEach메서드에서 $H의 continue을 이용하면 건너뛴다.",function(){
		//Given
		var hash = $H({a:1,b:2,c:3});
		var i = 0;
		//When
		hash.forEach(function(v){

			if(v==2){
				$H.Continue();
			}
			i++;
		});
		//Then
		equal(i,2);
	});
	QUnit.test("map메서드에서 $H의 continue을 이용하면 건너뛴다.",function(){
		//Given
		var hash = $H({a:1,b:2,c:3});
		var i = 0;
		//When
		var returnVal = hash.map(function(v){
			if(v==3){
				$H.Continue();
			}
			return v+1;
		});
		//Then
		deepEqual(returnVal.$value(),{a:2,b:3,c:3});
	});
	QUnit.test("filter메서드는 $H의 continue을 사용하면 건너뛴다.",function(){
		//Given
		var hash = $H({a:1,b:2,c:3});
		//When
		var returnVal = hash.filter(function(v){
			if(v === 3){
				$H.Continue();
			}
			return v%2;
		});
		//Then
		deepEqual(returnVal.$value(), {
			a: 1
		});
	});
	QUnit.test("sort메서드는 값을 기준으로  순방향으로 정렬되어야 한다.",function(){
	    //Given
	    var h = {"0":"7","a":"1","b":"2","1":"3","2":"4","z":"5","3":"6"};

	    var i = 0;
	    // var key = ["0","1","2","3","a","b","z"];
	    // var val = ["7","3","4","6","1","2","5"];
	    var val = ["1","2","3","4","5","6","7"];
	    var key = ["a","b","1","2","z","3","0"];

	    //When
	    var rh = $H(h).sort();

	    //Then
	    rh.forEach(function(v,k){
	        equal(v,val[i]);
	        equal(k,key[i]);
	        i++;
	    });
	});
	QUnit.test("sort메서드는 값을 기준으로  역방향으로 정렬되어야 한다.",function(){
	    //Given
	    var h = {"0":"7","a":"1","b":"2","1":"3","2":"4","z":"5","3":"6"};

	    var i = 6;
	    var val = ["1","2","3","4","5","6","7"];
	    var key = ["a","b","1","2","z","3","0"];

	    //When
	    var rh = $H(h).sort(function(a,b){
	        return a === b ? 0 : a < b ? 1 : -1;
	    });

	    //Then
	    rh.forEach(function(v,k){
	        equal(v,val[i]);
	        equal(k,key[i]);
	        i--;
	    });
	});
	QUnit.test("ksort메서드는 키를 기준으로 순방향으로 정렬되어야 한다.",function(){
	    //Given
	    var h = {"0":"7","a":"1","b":"2","1":"3","2":"4","z":"5","3":"6"};

	    var i = 0;
	    var key = ["0","1","2","3","a","b","z"];
	    var val = ["7","3","4","6","1","2","5"];

	    //When
	    var rh = $H(h).ksort();

	    //Then
	    rh.forEach(function(v,k){
	        equal(v,val[i]);
	        equal(k,key[i]);
	        i++;
	    });
	});
	QUnit.test("ksort메서드는 키를 기준으로 역방향으로 정렬되어야 한다.",function(){
	    //Given
	    var h = {"0":"7","a":"1","b":"2","1":"3","2":"4","z":"5","3":"6"};

	    var i = 6;
	    var key = ["0","1","2","3","a","b","z"];
	    var val = ["7","3","4","6","1","2","5"];


	    //When
	    var rh = $H(h).ksort(function(a,b){
	        return a === b ? 0 : a < b ? 1 : -1;
	    });

	    //Then
	    rh.forEach(function(v,k){
	        equal(v,val[i]);
	        equal(k,key[i]);
	        i--;
	    });
	});
	QUnit.test("add매서드로 추가하면 __jindo_sorted_index에도 추가되어야 한다.",function(){
	    //Given
	    var h = {"0":"7","a":"1","b":"2","1":"3","2":"4","z":"5","3":"6"};
	    var rh = $H(h);
	    rh.sort();
	    var len = rh["__jindo_sorted_index"].length;

	    //When
	    rh.add("some","aa");

	    //Then
	    equal(rh["__jindo_sorted_index"].length,len+1);
	});
	QUnit.test("remove매서드로 삭제하면 __jindo_sorted_index에서도 삭제되어야 한다.",function(){
	    //Given
	    var h = {"0":"7","a":"1","b":"2","1":"3","2":"4","z":"5","3":"6"};
	    var rh = $H(h);
	    rh.sort();
	    var len = rh["__jindo_sorted_index"].length;

	    //When
	    rh.remove("a");

	    //Then
	    equal(rh["__jindo_sorted_index"].length,len-1);
	});
	QUnit.test("empty매서드로 전부 없에면 __jindo_sorted_index도 삭제되어야 한다.",function(){
	    //Given
	    var h = {"0":"7","a":"1","b":"2","1":"3","2":"4","z":"5","3":"6"};
	    var rh = $H(h);
	    rh.sort();

	    //When
	    rh.empty();

	    //Then
	    deepEqual(rh["__jindo_sorted_index"], undefined);
	}
);