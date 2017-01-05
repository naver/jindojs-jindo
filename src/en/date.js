/**
 
 * @fileOverview A file to define the constructor and method of $Date
 * @name date.js
  
 */

/**
 
 * Creates and returns the $Date object.
 * When ISO characters are used, it is calculated based on $Date.utc.
 * @extends core
 * @class The $Date class is a Wrapper class of a Date type to process date.
 * @constructor
 * @author Kim, Taegon
 * @example
$Date();
$Date(milliseconds);
$Date(dateString);
//since 1.4.6, $Date can be used as long as values of year and month are set. 1 is automatically specified to the other parameters.
$Date(year, month, [date, [hours, [minutes, [seconds, [milliseconds]]]]]);
$Date(2010,6);// This is the same as $Date (2010,6,1,1,1,1,1);.
  
 */
jindo.$Date = function(src) {
	var a=arguments,t="";
	var cl=arguments.callee;

	if (src && src instanceof cl) return src;
	if (!(this instanceof cl)) return new cl(a[0],a[1],a[2],a[3],a[4],a[5],a[6]);

	if ((t=typeof src) == "string") {
        /*
         
iso string
  
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
			 
Calculates in milliseconds when it consists of one digit number.
  
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
 
 * The names of month, date, and am/pm of $Date are specified in the names attribute as a string. Names with the prefix 's_' represents abbreviations.
  
 */
jindo.$Date.names = {
	month   : ["January","Febrary","March","April","May","June","July","August","September","October","Novermber","December"],
	s_month : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
	day     : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
	s_day   : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
	ampm    : ["AM", "PM"]
};

/**
 
 * UTC is the abbreviation of <a href="http://ko.wikipedia.org/wiki/UTC">Coordinated Universal Time</a>. Korea Standard Time is nine hours ahead of UTC.
 * @example
In case of $Date.utc = -10;, it is calculated based on Hawaiian standard.
  
 */
jindo.$Date.utc = 9;

/**
 
 * Returns the current time in milliseconds as an integer.
 * @return {Number} The current time in milliseconds as an integer
  
 */
jindo.$Date.now = function() {
	return Date.now();
};
/**
 
 * Sets or gets the names attributes (available since 1.4.1).
 * @param {Object} oNames
  
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
 
 * Parses the specified string as a parameter and creates a Date object in the string format.
 * @param {String} strDate The string with the specified date or time format to be parsed
 * @return {Object} The Date object 
  
 */
jindo.$Date.parse = function(strDate) {
	return new Date(Date.parse(strDate));
};

/**
 
 * Returns the original Date object that is enclosed by $Date.
 * @returns {Object} The Date object
  
 */
jindo.$Date.prototype.$value = function(){
	return this._date;
};

/**
 
 * Converts time that the $Date object stores in the string format which is specified as a parameter. The format string is used in the same way as the date function of PHP.
	<table>
		<caption>Date</caption>
		<thead>
			<tr>
				<th scope="col">Characters</th>
				<th scope="col">Description</th>
				<th scope="col">Note</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>d</td>
				<td>Two-digit date</td>
				<td>01 ~ 31</td>
			</tr>
			<tr>
				<td>j</td>
				<td>0-excluded date</td>
				<td>1 ~ 31</td>
			</tr>
			<tr>
				<td>l (lowercase L)</td>
				<td>Full date</td>
				<td>Date specified in $Date.names.day</td>
			</tr>
			<tr>
				<td>D</td>
				<td>Summarized date</td>
				<td>Date specified in $Date.names.s_day</td>
			</tr>
			<tr>
				<td>w</td>
				<td>N-th day of the week</td>
				<td>0 (Sunday) ~ 6 (Saturday)</td>
			</tr>
			<tr>
				<td>N</td>
				<td>N-th day of the ISO-8601 week</td>
				<td>1 (Monday) ~ 7 (Sunday)</td>
			</tr>
			<tr>
				<td>S</td>
				<td>Ordinal types of two characters</td>
				<td>st, nd, rd, th</td>
			</tr>
			<tr>
				<td>z</td>
				<td>N-th day of the year (from 0)</td>
				<td>0 ~ 365</td>
			</tr>
		</tbody>
	</table>
	<table>
		<caption>Month</caption>
		<thead>
			<tr>
				<th scope="col">Characters</th>
				<th scope="col">Description</th>
				<th scope="col">Note</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>m</td>
				<td>Two-digit month</td>
				<td>01 ~ 12</td>
			</tr>
			<tr>
				<td>n</td>
				<td>0-excluded month</td>
				<td>1 ~ 12</td>
			</tr>
		</tbody>
	</table>
	<table>
		<caption>Year</caption>
		<thead>
			<tr>
				<th scope="col">Characters</th>
				<th scope="col">Description</th>
				<th scope="col">Note</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>L</td>
				<td>Leap year</td>
				<td>true, false</td>
			</tr>
			<tr>
				<td>o</td>
				<td>Four-digit year</td>
				<td>2010</td>
			</tr>
			<tr>
				<td>Y</td>
				<td>Same as o</td>
				<td>2010</td>
			</tr>
			<tr>
				<td>y</td>
				<td>Two-digit year</td>
				<td>10</td>
			</tr>
		</tbody>
	</table>
	<table>
		<caption>Minute</caption>
		<thead>
			<tr>
				<th scope="col">Characters</th>
				<th scope="col">Description</th>
				<th scope="col">Note</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>a</td>
				<td>Lowercase am/pm</td>
				<td>am,pm</td>
			</tr>
			<tr>
				<td>A</td>
				<td>Uppercase AM/PM</td>
				<td>AM,PM</td>
			</tr>
			<tr>
				<td>g</td>
				<td>(12-hour clock) 0-excluded two-digit hour</td>
				<td>1~12</td>
			</tr>
			<tr>
				<td>G</td>
				<td>(24-hour clock) 0-excluded two-digit hour</td>
				<td>0~24</td>
			</tr>
			<tr>
				<td>h</td>
				<td>(12-hour clock) 0-included two-digit hour</td>
				<td>01~12</td>
			</tr>
			<tr>
				<td>H</td>
				<td>(24-hour clock) 0-included two-digit hour</td>
				<td>00~24</td>
			</tr>
			<tr>
				<td>i</td>
				<td>0-included two-digit minute</td>
				<td>00~59</td>
			</tr>
			<tr>
				<td>s</td>
				<td>0-included two-digit second</td>
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
		<caption>Note</caption>
		<thead>
			<tr>
				<th scope="col">Characters</th>
				<th scope="col">Description</th>
				<th scope="col">Note</th>
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
 * @param {Date} strFormat  The string format
 * @returns {String} A string to convert date in the string format
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
 
 * Sets or gets the elapsed time based on GMT 1970/01/01 00:00:00.
 * @param {Number} nTime The time value in milliseconds.
 * @return {$Date | Number} Returns the $DAte object that sets the elapsed time between GMT 1970/01/01 00:00:00 and a value specified in the parameter if a parameter is specified. If a parameter is not specified, it returns the elapsed time between GMT 1970/01/01 00:00:00 and time that is stored in a $Date object.
  
 */
jindo.$Date.prototype.time = function(nTime) {
	if (typeof nTime == "number") {
		this._date.setTime(nTime);
		return this;
	}

	return this._date.getTime();
};

/**
 
 * Sets or gets a year value.
 * @param {Number} nYear The year value to set
 * @return {$Date | Number} Returns the $Date object that sets a year value if a parameter is specified. Returns a year value that is specified by the $Date object otherwise.
  
 */
jindo.$Date.prototype.year = function(nYear) {
	if (typeof nYear == "number") {
		this._date.setFullYear(nYear);
		return this;
	}

	return this._date.getFullYear();
};

/**
 
 * Sets or gets a month value.
 * @param {Number} nMon The month value to set
 * @return {$Date | Number} Returns the $Date object that sets a month value if a parameter is specified. Returns a month value that is specified by the $Date object otherwise.
 * @remark The range of return values is from 0 (Jan.) to 11 (Dec.).
  
 */
jindo.$Date.prototype.month = function(nMon) {
	if (typeof nMon == "number") {
		this._date.setMonth(nMon);
		return this;
	}

	return this._date.getMonth();
};

/**
 
 * Sets or gets a date value.
 * @param {nDate} nDate	The date value to set
 * @return {$Date | Number} Returns the $Date object that sets a date value if a parameter is specified. Returns a date value that is specified by the $Date object otherwise.
  
 */
jindo.$Date.prototype.date = function(nDate) {
	if (typeof nDate == "number") {
		this._date.setDate(nDate);
		return this;
	}

	return this._date.getDate();
};

/**
 
 * Gets a day value.
 * @return {Number} The day value. Returns from 0 (Sunday) to 6 (Saturday).
   
 */
jindo.$Date.prototype.day = function() {
	return this._date.getDay();
};

/**
 
 * Sets or gets a hour value.
 * @param {Number} nHour The hour value to set
 * @return {$Date | Number} Returns the $Date object that sets a hour value if a parameter is specified. Returns a hour value that is specified by the $Date object otherwise.
  
 */
jindo.$Date.prototype.hours = function(nHour) {
	if (typeof nHour == "number") {
		this._date.setHours(nHour);
		return this;
	}

	return this._date.getHours();
};

/**
 
 * Sets or gets a minute value.
 * @param {Number} nMin The minute value to set
 * @return {Number} Returns the $Date object that sets a minute value if a parameter is specified. Returns a minute value that is specified by the $Date object otherwise.
  
 */
jindo.$Date.prototype.minutes = function(nMin) {
	if (typeof nMin == "number") {
		this._date.setMinutes(nMin);
		return this;
	}

	return this._date.getMinutes();
};

/**
 
 * Sets or gets a second value.
 * @param {Number} nSec The second value to set
 * @return {Number} Returns the $Date object that sets a second value if a parameter is specified. Returns a second value that is specified by the $Date object otherwise.
  
 */
jindo.$Date.prototype.seconds = function(nSec) {
	if (typeof nSec == "number") {
		this._date.setSeconds(nSec);
		return this;
	}

	return this._date.getSeconds();
};

/**
 
 * Checks whether or not a leap year.
 * @returns {Boolean} Returns true if a value specified by the $Date object is a leap year, false otherwise.
  
 */
jindo.$Date.prototype.isLeapYear = function() {
	var y = this._date.getFullYear();

	return !(y%4)&&!!(y%100)||!(y%400);
};