/**
 {{title}}
 */

//-!jindo.$Date start!-//
/**
 {{constructor}}
 */
jindo.$Date = function(src) {
		
	var a=arguments,t="";
	var cl=arguments.callee;

	if (src && src instanceof cl) return src;
	if (!(this instanceof cl)) return new cl(a[0],a[1],a[2],a[3],a[4],a[5],a[6]);

	if ((t=typeof src) == "string") {
        /*
         {{constructor_1}}
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
			 {{constructor_2}}
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
jindo.$Date.utc = 9;
//-!jindo.$Date end!-//

//-!jindo.$Date.now start!-//
/**
 {{now}}
 */
jindo.$Date.now = function() {
	
	return Date.now();
};
//-!jindo.$Date.now end!-//

//-!jindo.$Date.prototype.name start!-//
/**
 {{name}}
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
//-!jindo.$Date.prototype.name end!-//

//-!jindo.$Date.prototype.parse start!-//
/**
 {{parse}}
 */
jindo.$Date.parse = function(strDate) {
	
	return new Date(Date.parse(strDate));
};
//-!jindo.$Date.prototype.parse end!-//

//-!jindo.$Date.prototype.$value start!-//
/**
 {{value}}
 */
jindo.$Date.prototype.$value = function(){
	
	return this._date;
};
//-!jindo.$Date.prototype.$value end!-//

//-!jindo.$Date.prototype.format start(jindo.$Date.prototype.name,jindo.$Date.prototype.isLeapYear,jindo.$Date.prototype.time)!-//
/**
 {{format}}
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
//-!jindo.$Date.prototype.format end!-//

//-!jindo.$Date.prototype.time start!-//
/**
 {{time}}
 */
jindo.$Date.prototype.time = function(nTime) {
	
	if (typeof nTime == "number") {
		this._date.setTime(nTime);
		return this;
	}

	return this._date.getTime();
};
//-!jindo.$Date.prototype.time end!-//

//-!jindo.$Date.prototype.year start!-//
/**
 {{year}}
 */
jindo.$Date.prototype.year = function(nYear) {
	
	if (typeof nYear == "number") {
		this._date.setFullYear(nYear);
		return this;
	}

	return this._date.getFullYear();
};
//-!jindo.$Date.prototype.year end!-//

//-!jindo.$Date.prototype.month start!-//
/**
 {{month}}
 */
jindo.$Date.prototype.month = function(nMon) {
	
	if (typeof nMon == "number") {
		this._date.setMonth(nMon);
		return this;
	}

	return this._date.getMonth();
};
//-!jindo.$Date.prototype.month end!-//

//-!jindo.$Date.prototype.date start!-//
/**
 {{date}}
 */
jindo.$Date.prototype.date = function(nDate) {
	
	if (typeof nDate == "number") {
		this._date.setDate(nDate);
		return this;
	}

	return this._date.getDate();
};
//-!jindo.$Date.prototype.date end!-//

//-!jindo.$Date.prototype.day start!-//
/**
 {{day}} 
 */
jindo.$Date.prototype.day = function() {
	
	return this._date.getDay();
};
//-!jindo.$Date.prototype.day end!-//

//-!jindo.$Date.prototype.hours start!-//
/**
 {{hours}}
 */
jindo.$Date.prototype.hours = function(nHour) {
	
	if (typeof nHour == "number") {
		this._date.setHours(nHour);
		return this;
	}

	return this._date.getHours();
};
//-!jindo.$Date.prototype.hours end!-//

//-!jindo.$Date.prototype.minutes start!-//
/**
 {{minutes}}
 */
jindo.$Date.prototype.minutes = function(nMin) {
	
	if (typeof nMin == "number") {
		this._date.setMinutes(nMin);
		return this;
	}

	return this._date.getMinutes();
};
//-!jindo.$Date.prototype.minutes end!-//

//-!jindo.$Date.prototype.seconds start!-//
/**
 {{seconds}}
 */
jindo.$Date.prototype.seconds = function(nSec) {
	
	if (typeof nSec == "number") {
		this._date.setSeconds(nSec);
		return this;
	}

	return this._date.getSeconds();
};
//-!jindo.$Date.prototype.seconds end!-//

//-!jindo.$Date.prototype.isLeapYear start!-//
/**
 {{isLeapYear}}
 */
jindo.$Date.prototype.isLeapYear = function() {
	
	var y = this._date.getFullYear();

	return !(y%4)&&!!(y%100)||!(y%400);
};
//-!jindo.$Date.prototype.isLeapYear end!-//