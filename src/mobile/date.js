/**
 {{title}}
 */
//-!jindo.$Date start!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$Date = function(src) {
	//-@@$Date-@@//	
	var a=arguments,t="";
	var cl=arguments.callee;

	if (src && src instanceof cl) return src;
	if (!(this instanceof cl)){
		var str="";
		for(var i = 0, l = a.length; i < l; i++){
			str += "a["+i+"],";
		}
		var init = new Function('cl','a','return new cl('+str.replace(/,$/,"")+');');
		
		try {
			jindo.$Jindo._maxWarn(arguments.length, 7,"$Date");
			return init(cl,a);
		} catch(e) {
			if (e instanceof TypeError) { return null; }
			throw e;
		}
		
	}
	
	var oArgs = g_checkVarType(arguments, {
		'4voi'  : [ ],
		'4str'  : [ 'src:String+' ],
		'4num'  : [ 'src:Numeric'],
		'4dat' 	: [ 'src:Date+'],
		'4num2' : [ 'src:Numeric', 'src:Numeric'],
		'4num3' : [ 'src:Numeric', 'src:Numeric', 'src:Numeric'],
		'4num4' : [ 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric'],
		'4num5' : [ 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric'],
		'4num6' : [ 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric'],
		'4num7' : [ 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric', 'src:Numeric']
	},"$Date");

	switch(oArgs+""){
		case '4voi' : 
			this._date = new Date;
			break;
		case '4num' : 
			this._date = new Date(src*1);
			break;
		case '4str' :
			if (/(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d)))/.test(src)) {
				this._date = jindo.$Date._makeISO(src);
			}else{
				this._date = cl.parse(src);
			}
			break;
		case '4dat' :
			(this._date = new Date).setTime(src.getTime());
			this._date.setMilliseconds(src.getMilliseconds());
			break;
		case '4num2':
		case '4num3':
		case '4num4':
		case '4num5':
		case '4num6':
		case '4num7':
			for(var i = 0 ; i < 7 ; i++){
				if(!jindo.$Jindo.isNumeric(a[i])){
					a[i] = i == 2 ? 1 : 0;
				}
			}
			this._date = new Date(a[0],a[1],a[2],a[3],a[4],a[5],a[6]);
	}
	this._names = {};
	for(var i in jindo.$Date.names){
		if(jindo.$Date.names.hasOwnProperty(i))
			this._names[i] = jindo.$Date.names[i];	
	}
};
/**
 * @ignore
 */
jindo.$Date._makeISO = function(src){
	var match = src.match(/(\d{4})(?:-?(\d\d)(?:-?(\d\d)(?:[T ](\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|(?:([-+])(\d\d)(?::?(\d\d))?)?)?)?)?)?/);
	var hour = parseInt(match[4]||0,10);
	var min = parseInt(match[5]||0,10);
	if (match[8] == "Z") {
		hour += jindo.$Date.utc;
	}else if(match[9] == "+" || match[9] == "-"){
		hour += (jindo.$Date.utc - parseInt(match[9]+match[10],10));
		min  +=  parseInt(match[9] + match[11],10);
	}
	return new Date(match[1]||0,parseInt(match[2]||0,10)-1,match[3]||0,hour ,min ,match[6]||0,match[7]||0);
	
};
/**
 * @ignore
 */
jindo.$Date._paramCheck = function(aPram, sType){
	return g_checkVarType(aPram, {
		's' : [ 'nParm:Numeric'],
		'g' : []
	},"$Date#"+sType);
};
/**
 {{names}}
 */
jindo.$Date.names = {
	month   : ["January","Febrary","March","April","May","June","July","August","September","October","Novermber","December"],
	s_month : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
	day     : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
	s_day   : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
	ampm    : ["AM", "PM"]
};

/**
 {{utc}}
 */
jindo.$Date.utc = (new Date().getTimezoneOffset() / 60) * -1;
//-!jindo.$Date end!-//

//-!jindo.$Date.now start!-//
/**
 {{now}}
 */
jindo.$Date.now = function() {
	//-@@$Date.now-@@//
	
  if(Date.now){
	/**
	 * @ignore
	 */  	
  	this.now = function() {
		return Date.now();
	};
  } else {
	/**
	 * @ignore
	 */
  	this.now = function() {
		return +new Date();
	};
  }
  return this.now();
};
//-!jindo.$Date.now end!-//

//-!jindo.$Date.prototype.name start!-//
/**
 {{name}}
 */
/**
 {{name2}}
 */
jindo.$Date.prototype.name = function(vName,aValue){
	//-@@$Date.name-@@//
	var oArgs = g_checkVarType(arguments, {
		's4str' : [ 'sKey:String+', 'aValue:Array+' ],
		's4obj' : [ 'oObject:Hash+' ],
		'g' : [ 'sKey:String+' ]
	},"$Date#name");
	
	switch(oArgs+"") {
		case 's4str':
			this._names[vName] = aValue;
			break;
		case 's4obj':
			vName = oArgs.oObject;
			for(var i in vName){
				if(vName.hasOwnProperty(i)){
					this._names[i] = vName[i];
				}
			}
			break;
		case 'g':
			return this._names[vName]; 
	}
	
	return this;
};
//-!jindo.$Date.prototype.name end!-//

//-!jindo.$Date.prototype.parse start!-//
/**
 {{parse}}
 */
jindo.$Date.parse = function(strDate) {
	//-@@$Date.parse-@@//
	var oArgs = g_checkVarType(arguments, {
		'4str' : [ 'sKey:String+']
	},"$Date#parse");
	
	var date = new Date(Date.parse(strDate));
	if(isNaN(date)||date == "Invalid Date"){
		throw new jindo.$Error(jindo.$Except.INVALID_DATE, "$Date#parse");
	}
	return date;
};
//-!jindo.$Date.prototype.parse end!-//

//-!jindo.$Date.prototype.$value start!-//
/**
 {{value}}
 */
jindo.$Date.prototype.$value = function(){
	//-@@$Date.$value-@@//
	return this._date;
};
//-!jindo.$Date.prototype.$value end!-//

//-!jindo.$Date.prototype.format start(jindo.$Date.prototype.name,jindo.$Date.prototype.isLeapYear,jindo.$Date.prototype.time)!-//
/**
 {{format}}
 */
jindo.$Date.prototype.format = function(strFormat){
	//-@@$Date.format-@@//
	var oArgs = g_checkVarType(arguments, {
		'4str' : [ 'sFormat:String+']
	},"$Date#format");
	strFormat = oArgs.sFormat;
	
	var o = {};
	var d = this._date;
	var name = this._names;
	var self = this;
	return (strFormat||"").replace(/[a-z]/ig, function callback(m){
		if (o[m] !== undefined) return o[m];

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
            case"F":
            case"M":
                o[m] = name[ m == "F"? "month" : "s_month" ][d.getMonth()];
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
//-!jindo.$Date.prototype.format end!-//

//-!jindo.$Date.prototype.time start!-//
/**
 {{time}}
 */
/**
 {{time2}}
 */
jindo.$Date.prototype.time = function(nTime) {
	//-@@$Date.time-@@//
	var oArgs = jindo.$Date._paramCheck(arguments,"time");
	nTime = oArgs.nParm;
	
	switch(oArgs+""){
		case 's':
			this._date.setTime(nTime);
			return this;
		case 'g':
			return this._date.getTime();
	}
};
//-!jindo.$Date.prototype.time end!-//

//-!jindo.$Date.prototype.year start!-//
/**
 {{year}}
 */
/**
 {{year2}}
 */
jindo.$Date.prototype.year = function(nYear) {
	//-@@$Date.year-@@//
	var oArgs = jindo.$Date._paramCheck(arguments,"year");
	nYear = oArgs.nParm;
	
	switch(oArgs+""){
		case 's':
			this._date.setFullYear(nYear);
			return this;
			
		case 'g':
			return this._date.getFullYear();
			
	}
};
//-!jindo.$Date.prototype.year end!-//

//-!jindo.$Date.prototype.month start!-//
/**
 {{month}}
 */
/**
 {{month2}}
 */
jindo.$Date.prototype.month = function(nMon) {
	//-@@$Date.month-@@//
	var oArgs = jindo.$Date._paramCheck(arguments,"month");
	nMon = oArgs.nParm;
	
	switch(oArgs+""){
		case 's':
			this._date.setMonth(nMon);
			return this;
			
		case 'g':
			return this._date.getMonth();
			
	}

};
//-!jindo.$Date.prototype.month end!-//

//-!jindo.$Date.prototype.date start!-//
/**
 {{date}}
 */
/**
 {{date2}}
 */
jindo.$Date.prototype.date = function(nDate) {
	//-@@$Date.date-@@//
	var oArgs = jindo.$Date._paramCheck(arguments,"date");
	nDate = oArgs.nParm;
	
	switch(oArgs+""){
		case 's':
			this._date.setDate(nDate);
			return this;
			
		case 'g':
			return this._date.getDate();
			
	}
};
//-!jindo.$Date.prototype.date end!-//

//-!jindo.$Date.prototype.day start!-//
/**
 {{day}} 
 */
jindo.$Date.prototype.day = function() {
	//-@@$Date.day-@@//
	return this._date.getDay();
};
//-!jindo.$Date.prototype.day end!-//

//-!jindo.$Date.prototype.hours start!-//
/**
 {{hours}}
 */
/**
 {{hours2}}
 */
jindo.$Date.prototype.hours = function(nHour) {
	//-@@$Date.hours-@@//
	var oArgs = jindo.$Date._paramCheck(arguments,"hours");
	nHour = oArgs.nParm;
	
	switch(oArgs+""){
		case 's':
			this._date.setHours(nHour);
			return this;
			
		case 'g':
			return this._date.getHours();
			
	}

};
//-!jindo.$Date.prototype.hours end!-//

//-!jindo.$Date.prototype.minutes start!-//
/**
 {{minutes}}
 */
/**
 {{minutes2}}
 */
jindo.$Date.prototype.minutes = function(nMin) {
	//-@@$Date.minutes-@@//
	var oArgs = jindo.$Date._paramCheck(arguments,"minutes");
	nMin = oArgs.nParm;
	
	switch(oArgs+""){
		case 's':
			this._date.setMinutes(nMin);
			return this;
			
		case 'g':
			return this._date.getMinutes();
			
	}
};
//-!jindo.$Date.prototype.minutes end!-//

//-!jindo.$Date.prototype.seconds start!-//
/**
 {{seconds}}
 */
/**
 {{seconds2}}
 */
jindo.$Date.prototype.seconds = function(nSec) {
	//-@@$Date.seconds-@@//
	var oArgs = jindo.$Date._paramCheck(arguments,"seconds");
	nSec = oArgs.nParm;
	
	switch(oArgs+""){
		case 's':
			this._date.setSeconds(nSec);
			return this;
			
		case 'g':
			return this._date.getSeconds();
			
	}
};
//-!jindo.$Date.prototype.seconds end!-//

//-!jindo.$Date.prototype.isLeapYear start!-//
/**
 {{isLeapYear}}
 */
jindo.$Date.prototype.isLeapYear = function() {
	//-@@$Date.isLeapYear-@@//
	var y = this._date.getFullYear();

	return !(y%4)&&!!(y%100)||!(y%400);
};
//-!jindo.$Date.prototype.isLeapYear end!-//

//-!jindo.$Date.prototype.compare start!-//
/**
 {{compare}}
 */
jindo.$Date.prototype.compare = function(oDate, sType) {
	//-@@$Date.compare-@@//
	var oArgs = g_checkVarType(arguments, {
		'4dat' : [ 'oDate:Date+'],
		'4str' : [ 'oDate:Date+','sType:String+']
	},"$Date#compare");
	oDate = oArgs.oDate;
	sType = oArgs.sType;

	if(!sType){
		return oDate - this._date;
	}else if(sType === "s"){
		return Math.floor(oDate / 1000) - Math.floor(this._date / 1000);
	}else if(sType === "i"){
		return Math.floor(Math.floor(oDate / 1000)/60) - Math.floor(Math.floor(this._date / 1000)/60);
	}else if(sType === "h"){
		return Math.floor(Math.floor(Math.floor(oDate / 1000)/60)/60) - Math.floor(Math.floor(Math.floor(this._date / 1000)/60)/60);
	}else if(sType === "d"){
		return Math.floor(Math.floor(Math.floor(Math.floor(oDate / 1000)/60)/60)/24) - Math.floor(Math.floor(Math.floor(Math.floor(this._date / 1000)/60)/60)/24);
	}else if(sType === "m"){
		return oDate.getMonth() - this._date.getMonth();
	}else if(sType === "y"){
		return oDate.getFullYear() - this._date.getFullYear();
	}
	
};
//-!jindo.$Date.prototype.compare end!-//