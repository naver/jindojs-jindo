/**
{{title}}
 */

//-!jindo.$Cookie start!-//
/**
{{constructor}}
 */
jindo.$Cookie = function() {
	
	var cl = arguments.callee;
	var cached = cl._cached;
	
	if (cl._cached) return cl._cached;
	if (!(this instanceof cl)) return new cl;
	if (typeof cl._cached == "undefined") cl._cached = this;
};
//-!jindo.$Cookie end!-//

//-!jindo.$Cookie.prototype.keys start!-//
/**
{{keys}}
 */
jindo.$Cookie.prototype.keys = function() {
	
	var ca = document.cookie.split(";");
	var re = /^\s+|\s+$/g;
	var a  = new Array;
	
	for(var i=0; i < ca.length; i++) {
		a[a.length] = ca[i].substr(0,ca[i].indexOf("=")).replace(re, "");
	}
	
	return a;
};
//-!jindo.$Cookie.prototype.keys end!-//

//-!jindo.$Cookie.prototype.get start!-//
/**
{{get}}
 */
jindo.$Cookie.prototype.get = function(sName) {
	
	var ca = document.cookie.split(/\s*;\s*/);
	var re = new RegExp("^(\\s*"+sName+"\\s*=)");
	
	for(var i=0; i < ca.length; i++) {
		if (re.test(ca[i])) return unescape(ca[i].substr(RegExp.$1.length));
	}
	
	return null;
};
//-!jindo.$Cookie.prototype.get end!-//

//-!jindo.$Cookie.prototype.set start!-//
/**
{{set}}
 */
jindo.$Cookie.prototype.set = function(sName, sValue, nDays, sDomain, sPath) {
	
	var sExpire = "";
	
	if (typeof nDays == "number") {
		sExpire = ";expires="+(new Date((new Date()).getTime()+nDays*1000*60*60*24)).toGMTString();
	}
	if (typeof sDomain == "undefined") sDomain = "";
	if (typeof sPath == "undefined") sPath = "/";
	
	document.cookie = sName+"="+escape(sValue)+sExpire+"; path="+sPath+(sDomain?"; domain="+sDomain:"");
	
	return this;
};
//-!jindo.$Cookie.prototype.set end!-//

//-!jindo.$Cookie.prototype.remove start(jindo.$Cookie.prototype.get,jindo.$Cookie.prototype.set)!-//
/**
{{remove}}
 */
jindo.$Cookie.prototype.remove = function(sName, sDomain, sPath) {
	
	if (this.get(sName) != null) this.set(sName, "", -1, sDomain, sPath);
	
	return this;
};
//-!jindo.$Cookie.prototype.remove end!-//
