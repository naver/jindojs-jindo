QUnit.config.autostart = false;

module("$A 객체");
	QUnit.test("$A : 객체가 만들어지는지?",function(){
		ok($A() instanceof $A);
		ok($A([]) instanceof $A);
		ok($A($A()) instanceof $A);
	});
	QUnit.test("$A 객체가 생성함수에 전달되면 원래 객체가 반환",function(){
		var a = $A();
		ok($A(a) === a);
	});
	QUnit.test("$value : 원래의 객체와 다른 객체를 반환, 단 값은 같아야 한다",function(){
		var a1 = [1,2,3];
		var a2 = [1,2,3];

		ok($A(a1).$value() !== a1);
		ok($A(a1).$value() !== a2);
		deepEqual($A(a1).$value(),a1);
		deepEqual($A(a1).$value(),a2);
	});
	QUnit.test("length : 배열의 크기",function(){
		equal($A().length(),0);
		equal($A([1,2,3]).length(),3);
		deepEqual($A([1,2,3]).length(2).$value(),[1,2]);
	});
	QUnit.test("has : 주어진 원소가 존재하는지 검사",function(){
		ok($A([1,2,3]).has(3));
		ok(!$A([1,2,3]).has(4));
	});
	QUnit.test("indexOf : 주어진 원소가 배열의 몇번째 요소인가",function(){
		equal($A([1,2,3]).indexOf(2),1);
		equal($A([1,2,3]).indexOf(3),2);
		equal($A([1,2,3]).indexOf(0),-1);
	});
	QUnit.test("push : 배열에 원소 추가",function(){
		var a1 = $A([1,2,3]);

		equal(a1.push('a'),4);
		equal(a1.push('b','c'),6);

		deepEqual(a1.$value(),[1,2,3,'a','b','c']);

		var obj = {name:'1',age:1};
		var a2 = [{id:'1',data:[obj]}];
		var a3 = $A(a2[0].data);
		var len = a3.push(obj);
		equal(len,2);
	});
	QUnit.test("pop : 마지막 원소 제거",function(){
		var a = $A([1,2,3,4,5]);

		equal(a.pop(),5);
		deepEqual(a.$value(),[1,2,3,4]);
	});
	QUnit.test("shift : 첫번째 원소 제거 후 각 원소 이동",function(){
		var a = $A([1,2,3,4,5]);

		equal(a.shift(),1);
		deepEqual(a.$value(),[2,3,4,5]);
	});
	QUnit.test("unshift : 배열 앞부분에 원소 삽입",function(){
		var a = $A([4,5]);

		equal(a.unshift('c'),3);
		deepEqual(a.$value(),['c',4,5]);
		equal(a.unshift('a','b'),5);
		deepEqual(a.$value(),['a','b','c',4,5]);
	});
	QUnit.test("forEach : 콜백함수 실행",function(){
		var A = $A([1,2,3,4,5]);
		var a = [];
		var fn = function(v,i,o) {
			a[i] = v;
		};

		ok(A.forEach(fn) === A);
		deepEqual(a,[1,2,3,4,5]);
	});
	QUnit.test("map : 콜백실행 & 반환값 저장",function(){
		var A = $A([1,2,3,4,5]);
		var fn = function(v,i,o) {
			return v+1;
		};

		deepEqual(A.map(fn).$value(),[2,3,4,5,6]);

		var A2 = $A([1,2,3,4,5]);
		var fn2 = function(v,i,o) {
			if (v == 3){
				jindo.$A.Break();
			}
			return v+1;
		};
		deepEqual(A2.map(fn2).$value(),[2,3]);

		var A3 = $A([1,2,3,4,5]);
		var fn3 = function(v,i,o) {
			if (v == 3){
				jindo.$A.Continue();
			}
			return v+1;
		};
		deepEqual(A3.map(fn3).$value(),[2,3,3,5,6]);
	});
	QUnit.test("filter : 필터링",function(){
		var a = $A([1,2,3,4,5]);
		var fn = function(v, i, o) {
			return v > 2;
		};

		ok(a.filter(fn) instanceof $A);
		deepEqual(a.filter(fn).$value(),[3,4,5]);
	});
	QUnit.test("every : 모든 원소가 조건을 만족시키나?",function(){
		var a = $A([1,2,3,4,5]);
		var fn1 = function(v, i, o) {
			return v > 0;
		};
		var fn2 = function(v, i, o) {
			return v > 2;
		};

		ok(a.every(fn1));
		ok(!a.every(fn2));
	});
	QUnit.test("some : 만족시키는 원소가 있나?",function(){
		var a = $A([1,2,3,4,5]);
		var fn1 = function(v, i, o) {
			return v < 0;
		};
		var fn2 = function(v, i, o) {
			return v > 2;
		};

		ok(!a.some(fn1));
		ok(a.some(fn2));
	});
	QUnit.test("refuse : 주어진 원소는 제거",function(){
		var a = $A([1,2,3,4,5]);

		ok(a.refuse(3) instanceof $A);
		ok(a.refuse(3) !== a);
		deepEqual(a.refuse(3).$value(),[1,2,4,5]);
	});
	QUnit.test("slice : 주어진 시작 인덱스와 끝 인덱스까지의 배열 요소로 이루어진 새로운 $A 객체 반환",function(){
		var a = $A([1,2,3,4,5]);

		ok(a.slice(1,3) instanceof $A);
		deepEqual(a.slice(1,3).$value(),[2,3]);
	});
	QUnit.test("splice : 특정 인덱스로부터 주어진 갯수만큼의 배열을 잘라서 반환",function(){
		var a = $A(["angel", "clown", "mandarin", "surgeon"]), removed;

		removed = a.splice(2, 0, "drum");
		ok(removed instanceof $A);
		deepEqual(a.$value(),["angel", "clown", "drum", "mandarin", "surgeon"]);

		removed = a.splice(3, 1);
		ok(removed instanceof $A);
		deepEqual(a.$value(),["angel", "clown", "drum", "surgeon"]);

		removed = a.splice(2, 1, "trumpet");
		ok(removed instanceof $A);
		deepEqual(a.$value(),["angel", "clown", "trumpet", "surgeon"]);

		removed = a.splice(0, 2, "parrot", "anemone", "blue");
		ok(removed instanceof $A);
		deepEqual(a.$value(),["parrot", "anemone", "blue", "trumpet", "surgeon"]);
	});
	QUnit.test("unique : 중복되는 요소를 제거하는가?",function(){
		var a = $A([1,2,3,"first","second","third",3,"first"]);

		deepEqual(a.unique().$value(),[1,2,3,"first","second","third"]);
	});
	QUnit.test("shuffle : 무작위적으로 잘 섞는가?",function(){
		var a = $A([1,2,3,"first","second","third",3,"first"]);

		notDeepEqual(a.shuffle().$value(),[1,2,3,"first","second","third",3,"first"]);
	});
	QUnit.test("reverse : ",function(){
		var a = $A([1,2,3]);

		deepEqual(a.reverse().$value(),[3,2,1]);
	});
	QUnit.test("toString : 원래의 배열처럼 잘 표현되나?",function(){
		var arr = [1,2,3,4,5,"string",new Array, new Object];
		var a   = $A(arr);

		equal(a.toString(),arr.toString());
	});
	QUnit.test("Break : break 동작이 잘 수행되는가?",function(){
		var arr = [3,7,10];
		var r = 0;
		$A(arr).forEach(function(v,i,o) {
			r += v;
			if (i == 1) $A.Break();
			r *= v;
		});
		equal(r,3 * 3 + 7);
	});
	QUnit.test("Continue : continue 동작이 잘 수행되는가?",function(){
		var arr = [3,7,10];
		var r = 0;
		$A(arr).forEach(function(v,i,o) {
			r += v;
			if (i == 1) $A.Continue();
			r *= v;
		});
		equal(r,( 3*3 + 7 + 10)*10);
	});
//	QUnit.test("$A에서 인자로 배열이 아닌 값이 들어 오면 배열로 만들어야 한다.",function(){
		//2.0.0에서는 exception으로 처리.
//		equal($A("123").$value(),[]);
//		equal($A(1).$value(),[]);
//	});
	QUnit.test("get 해당 인덱스의 값이 반환 되는가?",function(){
		equal($A([1,2,3]).get(0),1);
	});
	QUnit.test("null이니 경우에 빈배열이 리턴되어야 한다.",function(){
		deepEqual($A(null).$value(),[]);
	});
	QUnit.test("empty는 빈배열을 반환한다.",function(){
		deepEqual($A([1,2]).empty().$value(),[]);
	});
    QUnit.test("concat는 2개의 합쳐진 새로운 배열을 반환하는가?",function(){
        var arr1 = $A([1,2,3]), arr2 = $A([4,5,6]), arr3 = arr1.concat(arr2);

        equal(arr3.length(),6);
        ok(arr1.$value() !== arr3.$value());
        equal(arr1.concat([4,5,6]).length(),6);
        equal(arr1.concat().length(),3);
        equal(arr1.concat(null).length(),3);
        equal(arr1.concat(arr2, [7,8,9], "test").length(),10);
    }
);

module("$A new api");
	QUnit.test("생성자는 배열, $A, null이거나 없어야 한다.",function(){
		equal($A("asdf"),null);
		equal($A({}),null);
		equal($A(true),null);
		equal($A(1),null);
	});
	QUnit.test("forEach에서 첫 번째 인자가 함수가 아닌 경우 예외상황",function(){
		//Given
		var arr = $A([]);
		var occurException = false;
		//When
		try{
			arr.forEach()
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);
	});
	QUnit.test("map에서 첫 번째 인자가 함수가 아닌 경우 예외상황",function(){
		//Given
		var arr = $A([]);
		var occurException = false;
		//When
		try{
			arr.map()
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);
	});
	QUnit.test("filter에서 첫 번째 인자가 함수가 아닌 경우 예외상황",function(){
		//Given
		var arr = $A([]);
		var occurException = false;
		//When
		try{
			arr.filter();
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);
	});
	QUnit.test("every에서 첫 번째 인자가 함수가 아닌 경우 예외상황",function(){
		//Given
		var arr = $A([]);
		var occurException = false;
		//When
		try{
			arr.every()
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);
	});
	QUnit.test("some에서 첫 번째 인자가 함수가 아닌 경우 예외상황",function(){
		//Given
		var arr = $A([]);
		var occurException = false;
		//When
		try{
			arr.some()
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);
	});
	QUnit.test("forEach, map, filter, every, some메서드에서 함수가 에러발생되면 예외상황이 발생해야 한다.",function(){

		//Given
		var arr = $A([1,2,3]);
		var isError;

		var methods = ["forEach","map","filter","every","some"];

		for(var i = 0, l = methods.length; i < l; i++){
			isError = false;
			try{
				//When
				arr[methods[i]](function(){
					throw new Error("asdf");
				});
			}catch(e){
				//Then
				isError = true;
			}
			ok(isError);
		}
	});
	QUnit.test("forEach메서드에서 $A의 break을 이용하면 그 때까지의 결과값을 반환한다.",function(){
		//Given
		var arr = $A([1,2,3]);
		var i = 0;
		//When
		arr.forEach(function(v){
			i++;
			if(v==2){
				$A.Break();
			}
		});
		//Then
		equal(i,2);
	});
	QUnit.test("map메서드에서 $A의 break을 이용하면 그 때까지의 결과값을 반환한다.",function(){
		//Given
		var arr = $A([1,2,3]);
		var i = 0;
		//When
		var returnVal = arr.map(function(v){
			if(v==3){
				$A.Break();
			}
			return v+1;
		});
		//Then
		deepEqual(returnVal.$value(),[2,3]);
	});
	QUnit.test("filter메서드는 $A의 break을 사용하면 그 때까지의 결과값을 반환한다.",function(){
		//Given
		var arr = $A([1,2,3]);
		//When
		var returnVal = arr.filter(function(v){
			if(v === 3){
				$A.Break();
			}
			return v%2;
		});
		//Then
		deepEqual(returnVal.$value(),[1]);
	});
	QUnit.test("some메서드는 $A의 break을 사용하면 에러를 발생한다.",function(){
		//Given
		var arr = $A([1,2,3]);
		var occurException = false;
		//When
		try{
			arr.some(function(){
				$A.Break();
			});
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);
	});
	QUnit.test("every메서드는 $A의 break을 사용하면 에러를 발생한다.",function(){
				//Given
		var arr = $A([1,2,3]);
		var occurException = false;
		//When
		try{
			arr.every(function(){
				$A.Break();
			});
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);
	});


	QUnit.test("forEach메서드에서 $A의 continue을 이용하면 건너뛴다.",function(){
		//Given
		var arr = $A([1,2,3]);
		var i = 0;
		//When
		arr.forEach(function(v){

			if(v==2){
				$A.Continue();
			}
			i++;
		});
		//Then
		equal(i,2);
	});
	QUnit.test("map메서드에서 $A의 Continue을 이용하면 건너뛴다.",function(){
		//Given
		var arr = $A([1,2,3]);
		var i = 0;
		//When
		var returnVal = arr.map(function(v){
			if(v==3){
				$A.Continue();
			}
			return v+1;
		});
		//Then
		deepEqual(returnVal.$value(),[2,3,3]);
	});
	QUnit.test("filter메서드는 $A의 continue을 사용하면 건너뛴다.",function(){
		//Given
		var arr = $A([1,2,3]);
		//When
		var returnVal = arr.filter(function(v){
			if(v === 3){
				$A.Continue();
			}
			return v%2;
		});
		//Then
		deepEqual(returnVal.$value(),[1]);
	});
	QUnit.test("some메서드는 $A의 Continue을 사용하면 에러를 발생한다.",function(){
		//Given
		var arr = $A([1,2,3]);
		var occurException = false;
		//When
		try{
			arr.some(function(){
				$A.Continue();
			});
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);
	});
	QUnit.test("every메서드는 $A의 Continue을 사용하면 에러를 발생한다.",function(){
		//Given
		var arr = $A([1,2,3]);
		var occurException = false;
		//When
		try{
			arr.every(function(){
				$A.Continue();
			});
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);
	});
	QUnit.test("set 메서드는 키와 값으로 설정이 가능하다",function(){
		//Given
		var array = $A([1,2]);
		//When
		array.set(2,3);
		//Then
		deepEqual(array.$value(),[1,2,3]);

		//Given
		var occurException = false;
		//When
		try{
			array.set(3);
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);



	});
	QUnit.test("sort메서드는 정상적으로 정렬되어야 한다.",function(){
        //Given
        var arr = $A([8,9,3]);
        var expectedArr = [3,8,9];

        //When
        arr.sort();

        //Then
        arr.forEach(function(v,i){
            equal(v,expectedArr[i]);
        });
    });
    QUnit.test("sort메서드는 함수를 인자로 넣어도 정렬되어야 한다.",function(){
        //Given
        var arr = $A([3,9,10]);
        var expectedArr = [10,9,3];

        //When
        arr.sort(function(v,v1){
            return v < v1 ? 1 : -1;
        });

        //Then
        arr.forEach(function(v,i){
            equal(v,expectedArr[i]);
        });
    }
);
module("$A의 callback scope", {
    setup: function() {
		waCallback = $A([1,2,3]);
    }
});

	QUnit.test("every메서드의 scope는 this여야 함.",function(){
		waCallback.every(function(){
			equal(this,waCallback);
		});
	});
	QUnit.test("filter메서드의 scope는 this여야 함.",function(){
		waCallback.filter(function(){
			equal(this,waCallback);
		});
	});
	QUnit.test("forEach메서드의 scope는 this여야 함.",function(){
		waCallback.forEach(function(){
			equal(this,waCallback);
		});
	});
	QUnit.test("map메서드의 scope는 this여야 함.",function(){
		waCallback.map(function(){
			equal(this,waCallback);
		});
	});
	QUnit.test("some메서드의 scope는 this여야 함.",function(){
		waCallback.some(function(){
			equal(this,waCallback);
		});
	});