QUnit.config.autostart = false;

module("$Class");
	QUnit.test("클래스 인스턴스 생성 테스트",function(){
		Klass1 = $Class({
			one : null,
			$init : function() { this.one = 1; }
		});

		var o = new Klass1();
		equal(o.one,1);
	});

	QUnit.test("상속 클래스 인스턴스 생성 테스트",function(){
		Klass2 = $Class({
			two : null,
			$init : function() { this.two = 2; }
		}).extend(Klass1);

		var o = new Klass2();
		equal(o.two,2);
		equal(o.one,1);
	});

	QUnit.test("2중 상속 클래스 인스턴스 생성 테스트",function(){
		Klass3 = $Class({
			three : null,
			$init : function() { this.three = 3; }
		}).extend(Klass2);

		var o = new Klass3();

		equal(o.three,3);
		equal(o.two,2);
		equal(o.one,1);
	});
	QUnit.test("다중 상속에서 중간계층의 생성자가 생략되어있을 경우",function(){
		Klass4 = $Class({
			four : null
		}).extend(Klass1);
		Klass5 = $Class({
			five : null,
			$init : function() {
				this.five = 5;
			}
		}).extend(Klass4);

		var o = new Klass5();
		equal(o.five,5);
		equal(o.four,null);
		equal(o.one,1);
	});
	QUnit.test("다중 상속에서 생성자의 실행 순서는 올바른가?",function(){
		var s = "";

		Klass1 = $Class({
			$init : function() {
				s += 1;
			}
		});

		Klass2 = $Class({
			$init : function() {
				s += 2;
			}
		}).extend(Klass1);

		Klass3 = $Class({
			$init : function() {
				s += 3;
			}
		}).extend(Klass2);

		Klass4 = $Class({
			$init : function() {
				s += 4;
			}
		}).extend(Klass3);

		new Klass4();

		equal(s, "1234" );
	});
	QUnit.test("정적 클래스가 만들어지는가?",function(){
		Klass1 = $Class({
			$static : {
				prop : 1,
				method1 : function(){},
				method2 : function(){}
			}
		});

		equal(Klass1 instanceof Function,false);
		equal(Klass1.constructor,Object);
		equal(typeof Klass1.method1,"function");
	});
	QUnit.test("정적 메소드가 만들어지는가?",function(){
		Klass2 = $Class({
			str : "abcde",
			$init : function(){ },
			$static : {
				prop : 1,
				method1 : function(){},
				method2 : function(){}
			}
		});

		var obj = new Klass2;

		equal(typeof Klass2.method1,"function");
		equal(typeof Klass2.$static,"undefined");
	});
	QUnit.test("$super가 정상적으로 호출되는가?",function(){
		var SuperTest1 = $Class({
			$init : function() {

			},
			test:function(){
				return 1;
			}
		});

		var SuperTest2 = $Class({
			$init : function() {

			},
			test:function(a,b){
				return this.$super.test() + 1 + a + b;
			}
		}).extend(SuperTest1);

		var SuperTest3 = $Class({
			$init : function() {

			},
			test:function(){
				return this.$super.test(1,1) + 1;
			}
		}).extend(SuperTest2);

		equal(new SuperTest3().test(),5);
	});
	QUnit.test("super class는 반드시  $Class여야 한다.",function(){

		try{
			$Class({
				$init : function() {

				}
			}).extend({});
		}catch(e){
			ok(e instanceof TypeError);
		}

		try{
			$Class({
				$init : function() {

				}
			}).extend();
		}catch (e){
			ok(e instanceof TypeError);
		}

		try{
			$Class({
				$init : function() {

				}
			}).extend(null);
		}catch (e){
			ok(e instanceof TypeError);
		}
		var isExcept = false;
		try{
			var AAA = $Class({
				$init : function() {

				}
			});
			$Class({}).extend(AAA);
		}catch (e){
			isExcept = true;
		}
		ok(!isExcept);
	});
	QUnit.test("object가 아닌 인자가 들어온경우",function(){
		var occurException = false;
		try{
			$Class();
		}catch(e){
			occurException = true;
		}
		ok(occurException);
		occurException = false;
		try{
			$Class(null);
		}catch(e){
			occurException = true;
		}
		ok(occurException);

		occurException = false;
		try{
			$Class(undefined);
		}catch(e){
			occurException = true;
		}
		ok(occurException);

		occurException = false;
		try{
			$Class(1);
		}catch(e){
			occurException = true;
		}
		ok(occurException);

		occurException = false;
		try{
			$Class("");
		}catch(e){
			occurException = true;
		}
		ok(occurException);

	}
);

module("New API $Class", {
    setup: function() {
        __mockConsole.init();
        __mockConsole.reset();
    },
    teardown: function() {
        __mockConsole.rescue();
    }
});

	QUnit.test("kindOf 메서드는 같은 종류인지 확인할 수 있다.",function(){
		var A = $Class({"a":function(){}});
		var B = $Class({"a":function(){}});
		var a = new A();
		var A_child = $Class({"a_1":function(){}}).extend(A);
		var a_child = new A_child();
		var A_child_child = $Class({"a_1_1":function(){}}).extend(A_child);
		var a_child_child = new A_child_child();
		ok(a_child_child.kindOf(A));
		ok(a_child_child.kindOf(A_child));
		ok(a_child_child.kindOf(A_child_child));
		ok(!a_child_child.kindOf(B));
	});
	QUnit.test("$autoBind을 등록하면 자동으로 bind된 함수를 사용할 수 있다.",function(){
		//Given
		var OnScope = $Class({
			$autoBind : true,
			num : 1,
			each : function(){
				$A([1,1]).forEach(this._check);
			},
			_check : function(v){
				//Then
				equal(v,this.num);
			}
		});
		//When
		new OnScope().each();

		//Given
		var NoneScope = $Class({
			num : 1,
			each : function(){
				arr = $A([2,2]);
				arr.num = 2;
				arr.forEach(this._check);
			},
			_check : function(v){
				//Then
				equal(v,this.num);
			}
		});
		//When
		new NoneScope().each();

	});
	 QUnit.test("extend할 때 속성에 object가 있으면 경고메세지를 보냄.",function(){
        //Given
        var HasObjectProperty = $Class({"obj":{}});
        __mockConsole.reset();

        //Then
        var Klass = $Class({"test":function(){}}).extend(HasObjectProperty);

        //when
        equal(__mockConsole.get(),jindo.$Except.CANNOT_SET_OBJ_PROPERTY);
    });