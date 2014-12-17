/**
{{title}}
 */

//-!jindo.$Cookie start!-//
/**
{{desc}}
 */
/**
{{constructor}}
 */
jindo.$Cookie = function() {
	//-@@$Cookie-@@//
	var cl = arguments.callee;
	var cached = cl._cached;
	
	if (cl._cached) return cl._cached;
	if(!(this instanceof cl)){
		try{
			jindo.$Jindo._maxWarn(arguments.length, 1,"$Cookie");
			return (arguments.length > 0) ? new cl(arguments[0]) : new cl;
		}catch(e){
			if (e instanceof TypeError) { return null; }
			throw e;
		}
	}
	if (typeof jindo.$Jindo.isUndefined(cl._cached)) cl._cached = this;
	
	var oArgs = g_checkVarType(arguments, {
		"4voi" : [],
		"4bln" : ["bURIComponent:Boolean"]
	}, "$Cookie");
	
	switch(oArgs + ""){
		case "4voi" :
			this._bURIComponent = false;
			break;
		case "4bln" :
			this._bURIComponent = oArgs.bURIComponent;
			break;
	}
};
//-!jindo.$Cookie end!-//

//-!jindo.$Cookie.prototype.keys start!-//
/**
{{keys}}
 */
jindo.$Cookie.prototype.keys = function() {
	//-@@$Cookie.keys-@@//
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
	//-@@$Cookie.get-@@//
	var oArgs = g_checkVarType(arguments, {
		'4str' : [ 'sName:String+']
	},"$Cookie#get");
	var ca = document.cookie.split(/\s*;\s*/);
	var re = new RegExp("^(\\s*"+sName+"\\s*=)");
	var sEncoded;
	var sDecoded;
	
	for(var i=0; i < ca.length; i++) {
		if(re.test(ca[i])){
			sEncoded = ca[i].substr(RegExp.$1.length);
			if(this._bURIComponent && jindo.$Jindo.isNull(sEncoded.match(/%u\w{4}/))){
				sDecoded = decodeURIComponent(sEncoded);
			}else{
				sDecoded = unescape(sEncoded);
			}
			return sDecoded;
		}
	}
	
	return null;
};
//-!jindo.$Cookie.prototype.get end!-//

//-!jindo.$Cookie.prototype.set start!-//
/**
{{set}}
 */
jindo.$Cookie.prototype.set = function(sName, sValue, nDays, sDomain, sPath) {
	//-@@$Cookie.set-@@//
	var cache = jindo.$Jindo;
	var oArgs = cache.checkVarType(arguments, {
		'4str' : [ 'sName:String+',"sValue:String+"],
		'day_for_string' : [ 'sName:String+',"sValue:String+","nDays:Numeric"],
		'domain_for_string' : [ 'sName:String+',"sValue:String+","nDays:Numeric","sDomain:String+"],
		'path_for_string' : [ 'sName:String+',"sValue:String+","nDays:Numeric","sDomain:String+","sPath:String+"],
		'4num' : [ 'sName:String+',"sValue:Numeric"],
		'day_for_num' : [ 'sName:String+',"sValue:Numeric","nDays:Numeric"],
		'domain_for_num' : [ 'sName:String+',"sValue:Numeric","nDays:Numeric","sDomain:String+"],
		'path_for_num' : [ 'sName:String+',"sValue:Numeric","nDays:Numeric","sDomain:String+","sPath:String+"]
	},"$Cookie#set");
	
	var sExpire = "";
	var sEncoded;
	
	if(oArgs+"" !== "4str" && nDays !== 0) {
		sExpire = ";expires="+(new Date((new Date()).getTime()+nDays*1000*60*60*24)).toGMTString();
	}
	if (cache.isUndefined(sDomain)) sDomain = "";
	if (cache.isUndefined(sPath)) sPath = "/";
	
	if(this._bURIComponent){
		sEncoded = encodeURIComponent(sValue);
	}else{
		sEncoded = escape(sValue);
	}
	
	document.cookie = sName + "=" + sEncoded + sExpire + "; path=" + sPath + (sDomain ? "; domain=" + sDomain : "");
	
	return this;
};
//-!jindo.$Cookie.prototype.set end!-//

//-!jindo.$Cookie.prototype.remove start(jindo.$Cookie.prototype.get,jindo.$Cookie.prototype.set)!-//
/**
{{remove}}
 */
jindo.$Cookie.prototype.remove = function(sName, sDomain, sPath) {
	//-@@$Cookie.remove-@@//
	var cache = jindo.$Jindo;
	var oArgs = cache.checkVarType(arguments, {
		'4str' : [ 'sName:String+'],
		'domain_for_string' : [ 'sName:String+',"sDomain:String+"],
		'path_for_string' : [ 'sName:String+',"sDomain:String+","sPath:String+"]
	},"$Cookie#remove");
	var aArg = jindo._p_._toArray(arguments);
	var aPram = [];
	for(var i = 0, l = aArg.length ; i < l ; i++){
		aPram.push(aArg[i]);
		if(i == 0){
			aPram.push("");	
			aPram.push(-1);	
		}
	}
	if (!cache.isNull(this.get(sName))) this.set.apply(this,aPram);
	
	return this;
};
//-!jindo.$Cookie.prototype.remove end!-//
