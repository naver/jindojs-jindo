QUnit.config.autostart = false;

module("$Date 객체");
	QUnit.test("$Date 객체가 만들어지는가?",function(){
		ok($Date() instanceof $Date);
	});
	QUnit.test("$value : $Date 값을 주어 만들었을 때 같은 값이 확실한가?",function(){
		function equal(a,b) { // 값을 비교하는 함수를 만든다.
			return (a.getTime() == b.getTime());
		}

		var d = null;
		while(true) {
			if ((d=new Date).getTime() > date.getTime()) break;
		}

		// equal 부터 테스트
		ok(!equal(date, d));
		ok(equal(d, d));

		// 통과했으면 써먹어 봅시다.
		ok( equal($Date(d.getTime()).$value(), d) );
		ok( equal($Date(d).$value(), d) );
		ok( equal($Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()).$value(), d) );
	});
	QUnit.test("날짜 문자열을 주어 $Date 객체가 만들어지는가?",function(){
		var oDate = $Date("Jun 17 2009 12:02:54");
		equal(oDate.year(),2009);
		equal(oDate.month(),5);
		equal(oDate.date(),17);
		equal(oDate.hours(),12);
		equal(oDate.minutes(),2);
		equal(oDate.seconds(),54);
	});
	QUnit.test("format을 쓸때 name을 지정할수 있어야한다.",function(){
		var oDate = $Date("Jun 17 2009 12:02:54");
		equal(oDate.format("Y.m.d(D) A H:i"),"2009.06.17(Wed) PM 12:02");
		oDate.name({
				s_day   : ["Sun","Mon","Tue","수","Thu","Fri","Sat"],
				ampm    : ["AM", "오후"]
		});
		equal(oDate.format("Y.m.d(D) A H:i"),"2009.06.17(수) 오후 12:02");

		equal($Date("Jun 17 2009 12:02:54").format("Y.m.d(D) A H:i"),"2009.06.17(Wed) PM 12:02");
	});
	QUnit.test("$Date에서 h값이 0을 넣을때 0이 나와야 한다.",function(){
		var oDate = $Date(2009,1,1,0,0,0,0);
		equal(oDate.format("g"),"12");
	});
	QUnit.test("iso string도 정상적으로 파싱되어야 한다.",function(){
		var oDate = $Date('1997-07-16T19:20:15');
		equal(oDate.format("Y.m.d G:i:s"),"1997.07.16 19:20:15");
		oDate = $Date('1997-07-16T19:20:30+01:00');
		equal(oDate.format("Y.m.d G:i:s"),"1997.07.17 3:20:30");
		oDate = $Date('1985-04-12T23:20:50Z');
		equal(oDate.format("Y.m.d G:i:s"),"1985.04.13 8:20:50");
	});
	QUnit.test("$Date의 파라메터는 일까지만 넣으면 정상적으로 들어가야 한다.",function(){
		var date = $Date(2010,6);
		equal(date.year(),2010);
		equal(date.month(),6);
		equal(date.date(),1);
		equal(date.hours(),1);
		equal(date.minutes(),1);
		equal(date.seconds(),1);

		date = $Date(2010,6,2);
		equal(date.year(),2010);
		equal(date.month(),6);
		equal(date.date(),2);
		equal(date.hours(),1);
		equal(date.minutes(),1);
		equal(date.seconds(),1);


		date = $Date(2010,6,2,2);
		equal(date.year(),2010);
		equal(date.month(),6);
		equal(date.date(),2);
		equal(date.hours(),2);
		equal(date.minutes(),1);
		equal(date.seconds(),1);


		date = $Date(2010,6,2,2,2);
		equal(date.year(),2010);
		equal(date.month(),6);
		equal(date.date(),2);
		equal(date.hours(),2);
		equal(date.minutes(),2);
		equal(date.seconds(),1);


		date = $Date(2010,6,2,2,2,2);
		equal(date.year(),2010);
		equal(date.month(),6);
		equal(date.date(),2);
		equal(date.hours(),2);
		equal(date.minutes(),2);
		equal(date.seconds(),2);

	});
	QUnit.test("format 사용하기.",function(){
		var date = $Date(2010,6,2,2,2,2);
		equal(date.format("l S z L o a u U q"),"Friday rd 182 false 2010 am 1 1278003722001 q");
	});
	QUnit.test("time 사용하기.",function(){
		var date = $Date(2010,6,2,2,2,2);
		equal(date.time(),1278003722001);
		date.time(1000*60*60);
		equal(date.hours(),10);
	});
	QUnit.test("year 사용하기.",function(){
		var date = $Date(2010,6,2,2,2,2);
		equal(date.year(),2010);
		date.year(2011);
		equal(date.year(),2011);
	});
	QUnit.test("month 사용하기.",function(){
		var date = $Date(2010,6,2,2,2,2);
		equal(date.month(),6);
		date.month(7);
		equal(date.month(),7);
	});
	QUnit.test("date 사용하기.",function(){
		var date = $Date(2010,6,2,2,2,2);
		equal(date.date(),2);
		date.date(3);
		equal(date.date(),3);
	});
	QUnit.test("day 사용하기.",function(){
		var date = $Date(2010,6,2,2,2,2);
		equal(date.day(),5);

	});
	QUnit.test("hours 사용하기.",function(){
		var date = $Date(2010,6,2,2,2,2);
		equal(date.hours(),2);
		date.hours(3);
		equal(date.hours(),3);
	});
	QUnit.test("minutes 사용하기.",function(){
		var date = $Date(2010,6,2,2,2,2);
		equal(date.minutes(),2);
		date.minutes(3);
		equal(date.minutes(),3);
	});
	QUnit.test("seconds 사용하기.",function(){
		var date = $Date(2010,6,2,2,2,2);
		equal(date.seconds(),2);
		date.seconds(3);
		equal(date.seconds(),3);
	});
	QUnit.test("isLeapYear 사용하기.",function(){
		var date = $Date(2010,6,2,2,2,2);
		ok(!date.isLeapYear());
		date = $Date(2000,6,2,2,2,2);
		ok(date.isLeapYear());
	});
	QUnit.test("parseInt 버그 수정.",function(){
		var oDate = $Date('2011-02-16 09:33:07');
		equal(oDate.format("m-d H:i"),'02-16 09:33');
	});
//	QUnit.test("now메서드는 정상적으로 동작해야 한다.",function(){
//		//Given
//		var date, date2;
//		//When
//		date = $Date.now();
//		date2 = +new Date();
//		//Then
//		equal(date,date2);
//	});
	QUnit.test("파싱 버그",function(){
		//Given
		var oDate = $Date("20100826");
		//When
		//Then
		equal(oDate.format("Y.m.d"),'2010.08.26');
	}
);

module("$Date New API");
	QUnit.test("parse에서 Date가 아닌 경우 예외상황.",function(){
		//Given
		var occurException = false;
		//When
		try{
			$Date.parse(20010101);
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

	});

	QUnit.test('"time","year","month","date","hours","minutes","seconds" 는 Numeric가 아닌 경우 예외상황', function(){
		//Given
		var date = $Date(2010,6,2,2,2,2);
		var occurException = false;
		//When
		try{
			date.time("1a");
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		occurException = false;
		//When
		try{
			date.year("1A");
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		occurException = false;
		//When
		try{
			date.month("A1");
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		occurException = false;
		//When
		try{
			date.date("1A");
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		occurException = false;
		//When
		try{
			date.hours("1A");
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		occurException = false;
		//When
		try{
			date.minutes("A1");
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		occurException = false;
		//When
		try{
			date.seconds("1A");
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);
	});
	QUnit.test("name메서드에 인자로 key(String)이 있으면 값을 반환한다.",function(){
		//Given
		var date = $Date(2010,1,1);
		//When
		var keyArguments = date.name("month");
		//Then
		deepEqual(keyArguments,["January","Febrary","March","April","May","June","July","August","September","October","Novermber","December"]);
	});
	QUnit.test("name메서드에 인자로 key,value이 있으면 값을 저장하고 인스턴스를 반환한다.",function(){
		//Given
		var date = $Date(2010,1,1);
		var setVal = ["1월","2월","3월"];
		//When
		var setArguments = date.name("month",setVal);
		//Then
		equal(setArguments,date);
	});
	QUnit.test("name메서드에 인자로 object가 들어간 경우 값을 저장하고 인스턴스를 반환한다.",function(){
		//Given
		var date = $Date(2010,1,1);
		var setVal = {
				month   : ["1월","Febrary","March","April","May","June","July","August","September","October","Novermber","December"],
				s_month : ["1월","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
		};
		//When
		var setArguments = date.name(setVal);
		//Then
		equal(setArguments,date);
		equal(date._names.month,setVal.month);
		equal(date._names.s_month,setVal.s_month);
	});
	QUnit.test("name메서드에 인자로 $H가 들어간 경우 값을 저장하고 인스턴스를 반환한다.",function(){
		//Given
		var date = $Date(2010,1,1);
		var setVal = $H({
				month   : ["1월","Febrary","March","April","May","June","July","August","September","October","Novermber","December"],
				s_month : ["1월","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
		});
		//When
		var setArguments = date.name(setVal);
		//Then
		equal(setArguments,date);
		equal(date._names.month,setVal.$("month"));
		equal(date._names.s_month,setVal.$("s_month"));
	});
	QUnit.test("compare 지난 날짜가 정상적으로 계산되어야 한다.",function(){
		//Given
		var oDate =   $Date(2010,1,1,1,1,1,1);
		var oMSDate = $Date(2010,1,1,1,1,1,3);
		var oSDate =  $Date(2010,1,1,1,1,3,3);
		var oIDate =  $Date(2010,1,1,1,3,3,3);
		var oHDate =  $Date(2010,1,1,3,3,3,3);
		var oDDate =  $Date(2010,1,3,3,3,3,3);
		var oMDate =  $Date(2010,3,3,3,3,3,3);
		var oYDate =  $Date(2012,3,3,3,3,3,3);
		//When
		//Then
		equal(oDate.compare(oMSDate.$value()),2);
		equal(oDate.compare(oMSDate),2);
		equal(oMSDate.compare(oDate),-2);

		equal(oDate.compare(oSDate,"s"),2);
		equal(oDate.compare(oMSDate,"s"),0);
		equal(oSDate.compare(oDate,"s"),-2);

		equal(oDate.compare(oIDate,"i"),2);
		equal(oDate.compare(oSDate,"i"),0);
		equal(oIDate.compare(oDate,"i"),-2);

		equal(oDate.compare(oHDate,"h"),2);
		equal(oDate.compare(oIDate,"h"),0);
		equal(oHDate.compare(oDate,"h"),-2);

		equal(oDate.compare(oDDate,"d"),2);
		equal(oDate.compare(oHDate,"d"),0);
		equal(oDDate.compare(oDate,"d"),-2);

		equal(oDate.compare(oMDate,"m"),2);
		equal(oDate.compare(oDDate,"m"),0);
		equal(oMDate.compare(oDate,"m"),-2);

		equal(oDate.compare(oYDate,"y"),2);
		equal(oDate.compare(oMDate,"y"),0);
		equal(oYDate.compare(oDate,"y"),-2);

	}
);