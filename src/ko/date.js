/**
 
 * @fileOverview $Date() 객체의 생성자 및 메서드를 정의한 파일
 * @name date.js
 * @author Kim, Taegon
  
 */

/**
 
 * @class $Date() 객체는 Date 객체를 래핑(Wrapping)하여 날짜 및 시간을 처리하기 위한 확장 기능을 제공한다.
 * @extends core
 * @constructor
 * @description $Date() 객체를 생성한다. $Date() 객체를 생성할 때 파라미터 없이 생성하거나 ISO Date 포맷 또는 밀리 초 단위의 정수를 생성자의 인수로 입력할 수 있다. ISO Date 포맷 문자를 넣은 경우 $Date.utc 속성을 기반하여 날짜를 계산한다.
 * @param {Variant} [vDate] Date 포맷의 문자열(String)이나 정수 값(Number). 파라미터를 생략할 경우 시간이 설정되지 않은 $Date() 객체를 생성하며 추후 시간을 설정할 수 있다.
 * @see $Date.utc
 * @see $Date#format
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date">Date</a> - MDN Docs
 * @see <a href="http://ko.wikipedia.org/wiki/ISO_8601">ISO 8601</a> - W3C
 * @example
$Date();
$Date(milliseconds);
$Date(dateString);
//1.4.6 이후부터 달까지만 넣어도 $Date사용 가능하여 빈 값은 1로 설정
$Date(year, month, [date, [hours, [minitues, [seconds, [milliseconds]]]]]);
$Date(2010,6);//이러고 하면 $Date(2010,6,1,1,1,1,1); 와 같음.
  
 */
jindo.$Date = function(src) {
	var a=arguments,t="";
	var cl=arguments.callee;

	if (src && src instanceof cl) return src;
	if (!(this instanceof cl)) return new cl(a[0],a[1],a[2],a[3],a[4],a[5],a[6]);

	if ((t=typeof src) == "string") {
        /*
         
iso string일때
  
         */
		if (/(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d)))/.test(src)) {
			try{
				this._date = new Date(src);
				if (!this._date.toISOString) {
					this._date = jindo.$Date.makeISO(src);
				}else if(this._date.toISOString() == "Invalid Date"){
					this._date = jindo.$Date.makeISO(src);
				}
			}catch(e){
				this._date = jindo.$Date.makeISO(src);
			}
		}else{
			this._date = cl.parse(src);
		}
		
	} else if (t == "number") {
		if (typeof a[1] == "undefined") {
			/*
			 
하나의 숫지인 경우는 밀리 세켄드로 계산함.
  
			 */
			this._date = new Date(src);
		}else{
			for(var i = 0 ; i < 7 ; i++){
				if(typeof a[i] != "number"){
					a[i] = 1;
				}
			}
			this._date = new Date(a[0],a[1],a[2],a[3],a[4],a[5],a[6]);
		}
	} else if (t == "object" && src.constructor == Date) {
		(this._date = new Date).setTime(src.getTime());
		this._date.setMilliseconds(src.getMilliseconds());
	} else {
		this._date = new Date;
	}
	this._names = {};
	for(var i in jindo.$Date.names){
		if(jindo.$Date.names.hasOwnProperty(i))
			this._names[i] = jindo.$Date.names[i];	
	}
}

jindo.$Date.makeISO = function(src){
	var match = src.match(/(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d)(?:[T ](\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|(?:([-+])(\d\d)(?::?(\d\d))?)?)?)?)?)?/);
	var hour = parseInt(match[4]||0,10);
	var min = parseInt(match[5]||0,10);
	if (match[8] == "Z") {
		hour += jindo.$Date.utc;
	}else if(match[9] == "+" || match[9] == "-"){
		hour += (jindo.$Date.utc - parseInt(match[9]+match[10],10));
		min  +=  parseInt(match[9] + match[11],10);
	}
	return new Date(match[1]||0,parseInt(match[2]||0,10)-1,match[3]||0,hour ,min ,match[6]||0,match[7]||0);
	
}

/**
 
 * @description names 속성은 $Date() 객체에서 사용하는 달, 요일, 오전/오후를 표시하는 문자열을 저장한다. s_ 를 접두어로 가지는 이름은 약어(abbreviation)이다.<br>
<table>
	<caption>달, 요일, 오전/오후 표시 문자열</caption>
	<thead>
		<tr>
			<th scope="col">구분</th>
			<th scope="col">문자열</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>month</td>
			<td>January, Febrary, March, April, May, June, July, August, September, October, Novermber, December</td>
		</tr>
		<tr>
			<td>s_month</td>
			<td>Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec</td>
		</tr>
		<tr>
			<td>day</td>
			<td>Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday</td>
		</tr>
		<tr>
			<td>s_day</td>
			<td>Sun, Mon, Tue, Wed, Thu, Fri, Sat</td>
		</tr>
		<tr>
			<td>ampm</td>
			<td>AM, PM</td>
		</tr>
	</tbody>
</table>
  
 */
jindo.$Date.names = {
	month   : ["January","Febrary","March","April","May","June","July","August","September","October","Novermber","December"],
	s_month : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
	day     : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
	s_day   : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
	ampm    : ["AM", "PM"]
};

/**
 
 * @description utc 속성은 협정 세계시와 시차를 저장한다. 기본 값은 한국 시간 기준으로 +9로 저장된다.
 * @see <a href="http://ko.wikipedia.org/wiki/UTC">협정 세계시간</a>
 * @example
$Date.utc = -10; // 하와이 시간을 기준으로 한다.
  
 */
jindo.$Date.utc = 9;

/**
 
 * @description now() 메서드는 현재 시간을 밀리 초(millisecond) 단위의 정수로 리턴한다.
 * @returns {Number} 현재 시간을 밀리 초 단위의 정수로 나타낸 값.
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/now">Date.now()</a> - MDN Docs
 * @example
$Date().now(); //sample : 1304907432081
  
 */
jindo.$Date.now = function() {
	return Date.now();
};
/**
 
 * @description name() 메서드는 names 속성에 정의된 달, 요일, 오전/오후를 표시하는 문자열의 값을 가져오거나 문자열을 새로 설정할 수 있다. 
 * @since 1.4.1 버전부터 추가됨.
 * @param {Object} oNames names 속성에 정의된 내용을 대체할 객체.
 * @see $Date.names
  
 */
jindo.$Date.prototype.name = function(oNames){
	if(arguments.length){
		for(var i in oNames){
			if(oNames.hasOwnProperty(i))
				this._names[i] = oNames[i];
		}
	}else{
		return this._names;
	}
}

/**
 
 * @description parse() 메서드는 인수로 지정한 문자열을 파싱하여 $Date() 객체를 생성한다.
 * @param {String} sDate 날짜, 혹은 시간 형식을 가진 문자열
 * @returns {Object} Date 객체.
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date">Date</a> - MDN Docs
  
 */
jindo.$Date.parse = function(strDate) {
	return new Date(Date.parse(strDate));
};

/**
 
 * @description $value() 메서드는 $Date() 객체가 감싸고 있던 원본 Date 객체를 반환한다.
 * @returns {Object} 원본 Date 객체.
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date">Date</a> - MDN Docs
  
 */
jindo.$Date.prototype.$value = function(){
	return this._date;
};

/**
 
 * @description format() 메서드는 $Date() 객체가 저장하고 있는 시간을 파라미터로 지정한 형식 문자열(Format Specifier)에 맞추어 변환한다. 지원하는 형식 문자열은 PHP의 date() 함수와 동일하다.<br>
	<table>
		<caption>날짜</caption>
		<thead>
			<tr>
				<th scope="col">문자</th>
				<th scope="col">설명</th>
				<th scope="col">기타</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>d</td>
				<td>두자리 날짜</td>
				<td>01 ~ 31</td>
			</tr>
			<tr>
				<td>j</td>
				<td>0 없는 날짜</td>
				<td>1 ~ 31</td>
			</tr>
			<tr>
				<td>l (소문자L)</td>
				<td>주의 전체 날짜</td>
				<td>$Date.names.day에 지정되는 날짜</td>
			</tr>
			<tr>
				<td>D</td>
				<td>요약된 날짜</td>
				<td>$Date.names.s_day에 지정된 날짜</td>
			</tr>
			<tr>
				<td>w</td>
				<td>그 주의 몇번째 일</td>
				<td>0(일) ~ 6(토)</td>
			</tr>
			<tr>
				<td>N</td>
				<td>ISO-8601 주의 몇번째 일</td>
				<td>1(월) ~ 7(일)</td>
			</tr>
			<tr>
				<td>S</td>
				<td>2글자, 서수형식의 표현(1st, 2nd)</td>
				<td>st, nd, rd, th</td>
			</tr>
			<tr>
				<td>z</td>
				<td>해당 년도의 몇번째 일(0부터)</td>
				<td>0 ~ 365</td>
			</tr>
		</tbody>
	</table>
	<table>
		<caption>월</caption>
		<thead>
			<tr>
				<th scope="col">문자</th>
				<th scope="col">설명</th>
				<th scope="col">기타</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>m</td>
				<td>두자리 고정으로 월</td>
				<td>01 ~ 12</td>
			</tr>
			<tr>
				<td>n</td>
				<td>앞에 0제외 월</td>
				<td>1 ~ 12</td>
			</tr>
		</tbody>
	</table>
	<table>
		<caption>년</caption>
		<thead>
			<tr>
				<th scope="col">문자</th>
				<th scope="col">설명</th>
				<th scope="col">기타</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>L</td>
				<td>윤년 여부</td>
				<td>true, false</td>
			</tr>
			<tr>
				<td>o</td>
				<td>4자리 연도</td>
				<td>2010</td>
			</tr>
			<tr>
				<td>Y</td>
				<td>o와 같음.</td>
				<td>2010</td>
			</tr>
			<tr>
				<td>y</td>
				<td>2자리 연도</td>
				<td>10</td>
			</tr>
		</tbody>
	</table>
	<table>
		<caption>시</caption>
		<thead>
			<tr>
				<th scope="col">문자</th>
				<th scope="col">설명</th>
				<th scope="col">기타</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>a</td>
				<td>소문자 오전, 오후</td>
				<td>am,pm</td>
			</tr>
			<tr>
				<td>A</td>
				<td>대문자 오전,오후</td>
				<td>AM,PM</td>
			</tr>
			<tr>
				<td>g</td>
				<td>(12시간 주기)0없는 두자리 시간.</td>
				<td>1~12</td>
			</tr>
			<tr>
				<td>G</td>
				<td>(24시간 주기)0없는 두자리 시간.</td>
				<td>0~24</td>
			</tr>
			<tr>
				<td>h</td>
				<td>(12시간 주기)0있는 두자리 시간.</td>
				<td>01~12</td>
			</tr>
			<tr>
				<td>H</td>
				<td>(24시간 주기)0있는 두자리 시간.</td>
				<td>00~24</td>
			</tr>
			<tr>
				<td>i</td>
				<td>0포함 2자리 분.</td>
				<td>00~59</td>
			</tr>
			<tr>
				<td>s</td>
				<td>0포함 2자리 초</td>
				<td>00~59</td>
			</tr>
			<tr>
				<td>u</td>
				<td>microseconds</td>
				<td>654321</td>
			</tr>
		</tbody>
	</table>
	<table>
		<caption>기타</caption>
		<thead>
			<tr>
				<th scope="col">문자</th>
				<th scope="col">설명</th>
				<th scope="col">기타</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>U</td>
				<td>Unix Time(1970 00:00:00 GMT) </td>
				<td></td>
			</tr>
		</tbody>
	</table>
 * @param {String} sFormat  형식 문자열
 * @returns {String} 시간을 형식 문자열에 맞추어 변환한 문자열.
 * @see <a href="http://kr2.php.net/manual/en/function.date.php">date()</a> - php.net
 * @example
	var oDate = $Date("Jun 17 2009 12:02:54");
	oDate.format("Y.m.d(D) A H:i") => "2009.06.17(Wed) PM 12:02"
  
 */
jindo.$Date.prototype.format = function(strFormat){
	var o = {};
	var d = this._date;
	var name = this.name();
	var self = this;
	return (strFormat||"").replace(/[a-z]/ig, function callback(m){
		if (typeof o[m] != "undefined") return o[m];

		switch(m) {
			case"d":
			case"j":
				o.j = d.getDate();
				o.d = (o.j>9?"":"0")+o.j;
				return o[m];
			case"l":
			case"D":
			case"w":
			case"N":
				o.w = d.getDay();
				o.N = o.w?o.w:7;
				o.D = name.s_day[o.w];
				o.l = name.day[o.w];
				return o[m];
			case"S":
				return (!!(o.S=["st","nd","rd"][d.getDate()]))?o.S:(o.S="th");
			case"z":
				o.z = Math.floor((d.getTime() - (new Date(d.getFullYear(),0,1)).getTime())/(3600*24*1000));
				return o.z;
			case"m":
			case"n":
				o.n = d.getMonth()+1;
				o.m = (o.n>9?"":"0")+o.n;
				return o[m];
			case"L":
				o.L = self.isLeapYear();
				return o.L;
			case"o":
			case"Y":
			case"y":
				o.o = o.Y = d.getFullYear();
				o.y = (o.o+"").substr(2);
				return o[m];
			case"a":
			case"A":
			case"g":
			case"G":
			case"h":
			case"H":
				o.G = d.getHours();
				o.g = (o.g=o.G%12)?o.g:12;
				o.A = o.G<12?name.ampm[0]:name.ampm[1];
				o.a = o.A.toLowerCase();
				o.H = (o.G>9?"":"0")+o.G;
				o.h = (o.g>9?"":"0")+o.g;
				return o[m];
			case"i":
				o.i = (((o.i=d.getMinutes())>9)?"":"0")+o.i;
				return o.i;
			case"s":
				o.s = (((o.s=d.getSeconds())>9)?"":"0")+o.s;
				return o.s;
			case"u":
				o.u = d.getMilliseconds();
				return o.u;
			case"U":
				o.U = self.time();
				return o.U;
			default:
				return m;
		}
	});
};

/**
 
 * @description time() 메서드는 GMT(1970/01/01 00:00:00)를 기준으로 경과한 시간을 $Date() 객체에 설정하거나 $Date() 객체가 가지고 있는 값을 가져온다. 파라미터를 입력하면 경과한 시간을 설정하고 파라미터를 생략하면 현재 시간을 기준으로 경과한 시간을 가져온다.
 * @param {Number} [nTimeStamp]  밀리 초 단위의 정수 값.
 * @returns {Variant} 파라미터를 지정했다면 GMT를 기준으로 파라미터에 지정한 시간만큼 경과한 시간을 설정한 $Date() 객체. 파라미터를 지정하지 않았다면 GMT를 기준으로 $Date 객체에 지정된 시각까지 경과한 밀리 초 단위의 시간(Number).
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getTime">Date.getTime()</a> - MDN
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setTime">Date.setTime()</a> - MDN
 * @see <a href="http://ko.wikipedia.org/wiki/GMT">GMT</a>
 * @example
var oDate = new $Date(Date.now());
oDate.time(); //sample : 1304908070435
  
 */
jindo.$Date.prototype.time = function(nTime) {
	if (typeof nTime == "number") {
		this._date.setTime(nTime);
		return this;
	}

	return this._date.getTime();
};

/**
 
 * @description year() 메서드는 $Date() 객체가 저장하고 있는 시각의 연도(year)를 가져오거나 지정한 값으로 설정한다. 파라미터를 입력하면 $Date() 객체에 지정한 연도를 설정하고 파라미터를 생략하면 $Date() 객체가 저장하고 있는 연도를 반환한다. 이때 연도 값의 형식은 4자리 정수 값이다.
 * @param {Number} [nYear] $Date() 객체에 설정할 연도(year).
 * @returns {Variant} 파라미터를 입력했을 경우 연도를 새로 설정한 $Date() 객체를 반환하고 파라미터를 지정하지 않았다면 $Date() 객체가 저장하고 있는 시각의 연도(Number)를 반환한다.
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getFullYear">Date.getFullYear()</a> - MDN
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setFullYear">Date.setFullYear()</a> - MDN
 * @example
var oDate = new $Date(Date.now());
oDate.year(); // 2011
oDate.year(1984);
oDate.year(); // 1984
  
 */
jindo.$Date.prototype.year = function(nYear) {
	if (typeof nYear == "number") {
		this._date.setFullYear(nYear);
		return this;
	}

	return this._date.getFullYear();
};

/**
 
 * @description month() 메서드는 $Date() 객체가 저장하고 있는 시각의 달(month)을 가져오거나 지정한 값으로 설정한다. 파라미터를 입력하면 $Date() 객체에 지정한 달을 설정하고 파라미터를 생략하면 $Date() 객체가 저장하고 있는 달을 반환한다. 이때 사용되는 달 값의 범위는 0(1월)에서 11(12월)사이의 정수 값이다.
 * @param {Number} [nMon]  $Date() 객체에 설정할 달(month).
 * @returns {Variant} 파라미터를 입력했을 경우 달을 새로 설정한 $Date() 객체를 반환하고 파라미터를 지정하지 않았다면 $Date() 객체가 저장하고 있는 시각의 달(Number)을 반환한다.
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getMonth">Date.getMonth()</a> - MDN
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setMonth">Date.setMonth()</a> - MDN
 * @example
var oDate = new $Date(Date.now());
oDate.month(); // 4, 5월
oDate.month(1);
oDate.month(); // 3, 4월
  
 */
jindo.$Date.prototype.month = function(nMon) {
	if (typeof nMon == "number") {
		this._date.setMonth(nMon);
		return this;
	}

	return this._date.getMonth();
};

/**
 
 * @description date() 메서드는 $Date() 객체가 저장하고 있는 시각의 날짜(day of the month)를 가져오거나 지정한 값으로 설정한다. 파라미터를 입력하면 $Date() 객체에 지정한 날짜를 설정하고 파라미터를 생략하면 $Date() 객체가 저장하고 있는 날짜를 반환한다. 이때 사용되는 날짜의 범위는 1에서 31 사이의 정수 값이다.
 * @param {Number} [nDate] $Date() 객체에 설정할 날짜(day of the month).
 * @returns {Variant} 파라미터를 입력했을 경우 날짜를 새로 설정한 $Date() 객체를 반환하고 파라미터를 지정하지 않았다면 $Date() 객체가 저장하고 있는 시각의 날짜(Number)를 반환한다.
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getDate">Date.getDate()</a> - MDN
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setDate">Date.setDate()</a> - MDN
 * @example
var oDate = new $Date(Date.now());
oDate.date(); // 9, 9일
oDate.date(15);
oDate.date(); // 14, 14일
  
 */
jindo.$Date.prototype.date = function(nDate) {
	if (typeof nDate == "number") {
		this._date.setDate(nDate);
		return this;
	}

	return this._date.getDate();
};

/**
 
 * @description day() 메서드는 $Date() 객체가 지정하고 있는 시각의 요일(day of the week)를 가져온다. 이때 반환되는 요일의 범위는 0(일요일)에서 6(토요일) 사이의 정수 값이다.
 * @returns {nNumber} $Date() 객체가 저장하고 있는 시각의 요일(0~6)을 반환한다.
 * @see $Date#Date
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getDay">Date.getDay()</a> - MDN
 * @example
var oDate = new $Date(Date.now());
oDate.date(); // 9, 9일
oDate.day(); // 1, 월요일
oDate.date(10);
oDate.day(); // 2, 화요일
   
 */
jindo.$Date.prototype.day = function() {
	return this._date.getDay();
};

/**
 
 * @description hours() 메서드는 $Date() 객체가 저장하고 있는 시각의 시간(hour)을 가져오거나 지정한 값으로 설정한다. 파라미터를 입력하면 $Date() 객체에 지정한 날짜를 설정하고 파라미터를 생략하면 $Date() 객체가 저장하고 있는 시간을 반환한다. 이때 사용되는 시간의 범위는 0에서 23 사이의 정수 값이다.
 * @param {Number} [nHour]  $Date() 객체에 설정할 시간(hour).
 * @returns {Variant} 파라미터를 입력했을 경우 시간을 새로 설정한 $Date() 객체를 반환하고 파라미터를 지정하지 않았다면 $Date() 객체가 저장하고 있는 시각의 시간(Number)을 반환한다.
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getHours">Date.getHours()</a> - MDN
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setHours">Date.setHours()</a> - MDN
 * @example
var oDate = new $Date(Date.now());
oDate.hours(); // 11, 11시
oDate.hours(19);
oDate.hours(); // 19, 19시
  
 */
jindo.$Date.prototype.hours = function(nHour) {
	if (typeof nHour == "number") {
		this._date.setHours(nHour);
		return this;
	}

	return this._date.getHours();
};

/**
 
 * @description minutes() 메서드는 $Date() 객체가 저장하고 있는 시각의 분(minute)을 가져오거나 지정한 값으로 설정한다. 파라미터를 입력하면 $Date() 객체에 지정한 분을 설정하고 파라미터를 생략하면 $Date() 객체가 저장하고 있는 시간을 반환한다. 이때 사용되는 분의 범위는 0에서 59 사이의 정수 값이다.
 * @param {Number} [nMin]  $Date() 객체에 설정할 분(minute).
 * @returns {Variant} 파라미터를 입력했을 경우 분을 새로 설정한 $Date() 객체를 반환하고 파라미터를 지정하지 않았다면 $Date() 객체가 저장하고 있는 시각의 시간(Number)을 반환한다.
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getMinutes">Date.getMinutes()</a> - MDN
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setMinutes">Date.setMinutes()</a> - MDN
 * @example
var oDate = new $Date(Date.now());
oDate.minutes(); // 53, 53분
oDate.minutes(0);
oDate.minutes(); // 0, 0분
  
 */
jindo.$Date.prototype.minutes = function(nMin) {
	if (typeof nMin == "number") {
		this._date.setMinutes(nMin);
		return this;
	}

	return this._date.getMinutes();
};

/**
 
 * @description seconds() 메서드는 $Date() 객체가 저장하고 있는 시각의 초(second)를 가져오거나 지정한 값으로 설정한다. 파라미터를 입력하면 $Date() 객체에 지정한 초를 설정하고 파라미터를 생략하면 $Date() 객체가 저장하고 있는 시간을 반환한다. 이때 사용되는 초의 범위는 0에서 59 사이의 정수 값이다.
 * @param {Number} [nSec]  $Date() 객체에 설정할 초(second).
 * @returns {Variant} 파라미터를 입력했을 경우 초를 새로 설정한 $Date() 객체를 반환하고 파라미터를 지정하지 않았다면 $Date() 객체가 저장하고 있는 시각의 초(Number)를 반환한다. 
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getSeconds">Date.getSeconds()</a> - MDN
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/setSeconds">Date.setSeconds()</a> - MDN
 * @example 
var oDate = new $Date(Date.now());
oDate.seconds(); // 23, 23초
oDate.seconds(0);
oDate.seconds(); // 0, 0초
  
 */
jindo.$Date.prototype.seconds = function(nSec) {
	if (typeof nSec == "number") {
		this._date.setSeconds(nSec);
		return this;
	}

	return this._date.getSeconds();
};

/**
 
 * @description isLeapYear() 메서드는 $Date() 객체가 저장하고 있는 시각의 연도가 윤년인지 검사한다. 
 * @returns {Boolean} $Date()가 저장하고 있는 시각의 연도가 윤년이면 true를 반환하고 평년이면 false를 반환한다.
 * @see <a href="http://ko.wikipedia.org/wiki/%EC%9C%A4%EB%85%84">윤년</a> - Wikipedia
 * @example
 var oDate = new $Date(Date.now());

oDate.year(); // 2011
oDate.isLeapYear(); // false

oDate.year(1984);
oDate.isLeapYear(); // true

oDate.year(1900);
oDate.isLeapYear(); // false

oDate.year(2000);
oDate.isLeapYear(); // true
  
 */
jindo.$Date.prototype.isLeapYear = function() {
	var y = this._date.getFullYear();

	return !(y%4)&&!!(y%100)||!(y%400);
};