/**
{{title}}
 */
//-!jindo.$Ajax start(jindo.$Json.prototype.toString)!-//
/**
{{desc}}
 */
/**
{{constructor}}
 */
jindo.$Ajax = function (url, option) {
	var cl = arguments.callee;

	if (!(this instanceof cl)){
		try {
			jindo.$Jindo._maxWarn(arguments.length, 2,"$Ajax");
			return new cl(url, option||{});
		} catch(e) {
			if (e instanceof TypeError) { return null; }
			throw e;
		}
	}	

    var ___ajax = jindo.$Ajax, ___error = jindo.$Error, ___except = jindo.$Except;
	var oArgs = g_checkVarType(arguments, {
		'4str' : [ 'sURL:String+' ],
		'4obj' : [ 'sURL:String+', 'oOption:Hash+' ]
	},"$Ajax");
		
	if(oArgs+"" == "for_string"){
		oArgs.oOption = {};
	}
	
	function _getXHR() {
		return new XMLHttpRequest();
	}

	var loc = location.toString();
	var domain = '';

	try { domain = loc.match(/^https?:\/\/([a-z0-9_\-\.]+)/i)[1]; } catch(e) {}
	
	this._status = 0;
	this._url = oArgs.sURL;
	this._headers  = {};
	this._options = {
		type: "xhr",
		method: "post",
		proxy: "",
		timeout: 0,
		onload: function(req){},
		onerror: null,
		ontimeout: function(req){},
		jsonp_charset: "utf-8",
		callbackid: "",
		callbackname: "",
		async: true,
		decode: true,
		postBody: false,
		withCredentials: false,
		data: null
	};


	this._options = ___ajax._setProperties(oArgs.oOption,this);
	___ajax._validationOption(this._options,"$Ajax");
	
	/*
	 {{constructor_1}}
	 */
	if(___ajax.CONFIG){
		this.option(___ajax.CONFIG);
	}	

	var _opt = this._options;

	_opt.type   = _opt.type.toLowerCase();
	_opt.method = _opt.method.toLowerCase();
	


	if (window["__"+jindo._p_.jindoName+"_callback"] === undefined) {
		window["__"+jindo._p_.jindoName+"_callback"] = [];
		// JINDOSUS-1412
        window["__"+jindo._p_.jindoName+"2_callback"] = [];
	}

	var t = this;
	switch (_opt.type) {
		case "put":
		case "delete":
		case "get":
		case "post":
			_opt.method = _opt.type;
			// 'break' statement was intentionally omitted.
		case "xhr":
			//-@@$Ajax.xhr-@@//
			this._request = _getXHR();
			break;
		case "jsonp":
			//-@@$Ajax.jsonp-@@//
			if(!___ajax.JSONPRequest) throw new ___error(jindo._p_.jindoName+'.$Ajax.JSONPRequest'+___except.REQUIRE_AJAX, "$Ajax");
			this._request = new ___ajax.JSONPRequest( function(name,value){return t.option.apply(t, arguments);} );
	}

	this._checkCORS(this._url,_opt.type,"");
};

jindo.$Ajax.prototype._checkCORS = function(sUrl,sType,sMethod){
	this._bCORS = false;

	if(/^http/.test(sUrl) && !new RegExp("^https?://"+ window.location.host, "i").test(sUrl) && sType === "xhr") {
		if(!("withCredentials" in this._request)) {
			throw new jindo.$Error(jindo.$Except.NOT_SUPPORT_CORS, "$Ajax"+sMethod);
		}
		this._bCORS = true;
	}
};

jindo.$Ajax._setProperties = function(option,context){
	option = option||{};
	var type;
    if((option.type=="put"||option.type=="delete"||option.type=="get"||option.type=="post")&&!option.method){
        option.method = option.type;
        type = option.type = "xhr";
    }
    
    type = option.type = (option.type||"xhr");
	option.onload = jindo.$Fn(option.onload||function(){},context).bind();
	option.ontimeout = jindo.$Fn(option.ontimeout||function(){},context).bind();
	option.onerror = jindo.$Fn(option.onerror||function(){},context).bind();
	option.method = option.method ||"post";
	if(type == "xhr"){
		option.async = option.async === undefined?true:option.async;
		option.postBody = option.postBody === undefined?false:option.postBody;
		option.withCredentials = option.withCredentials === undefined?false:option.withCredentials;
	}else if(type == "jsonp"){
		option.method = "get";
		option.jsonp_charset = option.jsonp_charset ||"utf-8";
		option.callbackid = option.callbackid ||"";
		option.callbackname = option.callbackname ||"";
	}
	return option;
};

jindo.$Ajax._validationOption = function(oOption,sMethod){
	var ___error = jindo.$Error;
	var ___except = jindo.$Except;
	var sType = oOption.type;
	if(sType === "jsonp"){
		if(oOption["method"] !== "get") jindo.$Jindo._warn(___except.CANNOT_USE_OPTION+"\n\t"+sMethod+"-method="+oOption["method"]);
	}else if(sType === "flash"){
		if(!(oOption["method"] === "get" || oOption["method"] === "post")) jindo.$Jindo._warn(___except.CANNOT_USE_OPTION+"\n\t"+sMethod+"-method="+oOption["method"]);
	}else if(sType === "xhr") {
         if(oOption["data"] && oOption["data"].constructor !== window.FormData) jindo.$Jindo._warn(___except.CANNOT_USE_OPTION+"\n\t"+sMethod+"-data="+oOption["data"]);
    }
	
	if(oOption["postBody"]){
		if(!(sType === "xhr" && (oOption["method"]!=="get"))){
			jindo.$Jindo._warn(___except.CANNOT_USE_OPTION+"\n\t"+oOption["method"]+"-postBody="+oOption["postBody"]);
		}
	}
	
	var oTypeProperty = {
			"xhr": "onload|timeout|ontimeout|onerror|async|method|postBody|type|withCredentials|data",
			"jsonp": "onload|timeout|ontimeout|onerror|jsonp_charset|callbackid|callbackname|method|type"
	}, aName = [], i = 0;
	
    for(var x in oOption) { aName[i++] = x; }
	var sProperty = oTypeProperty[sType]||"";
	
	for(var i = 0 ,l = aName.length; i < l ; i++){
		if(sProperty.indexOf(aName[i]) == -1) jindo.$Jindo._warn(___except.CANNOT_USE_OPTION+"\n\t"+sType+"-"+aName[i]);
	}
};
/**
 * @ignore
 */
jindo.$Ajax.prototype._onload = function(){
	var status = this._request.status;
	var bSuccess = this._request.readyState == 4 && (status == 200||status==0);
	var oResult;
	if (this._request.readyState == 4) {
		try {
			if ((!bSuccess)&& jindo.$Jindo.isFunction(this._options.onerror)){
				this._options.onerror(new jindo.$Ajax.Response(this._request));
			}else{
				oResult = this._options.onload(new jindo.$Ajax.Response(this._request));
			} 
		}finally{
			this._status--;
			if(jindo.$Jindo.isFunction(this._oncompleted)){
				this._oncompleted(bSuccess, oResult);
			} 
		}
	}
};


/**
{{request}}
 */
jindo.$Ajax.prototype.request = function(oData) {
	var cache = jindo.$Jindo;
	var oArgs = cache.checkVarType(arguments, {
		'4voi' : [ ],
		'4obj' : [ cache._F('oData:Hash+') ],
		'4str' : [ 'sData:String+' ]
	},"$Ajax#request");
	
	this._status++;
	var t   = this;
	var req = this._request;
	var opt = this._options;
	var v,a = [], data = "", bFormData = false;
	var _timer = null;
	var url = this._url;
	this._is_abort = false;
	var sUpType = opt.type.toUpperCase();
	var sUpMethod = opt.method.toUpperCase();

	if (opt.postBody && sUpType == "XHR" && sUpMethod != "GET") {
		if(oArgs+"" == "4str"){
			data = oArgs.sData;
		}else if(oArgs+"" == "4obj"){
			data = jindo.$Json(oArgs.oData).toString();	
		}else{
			data = null;
		}
	}else{
		switch(oArgs+""){
			case "4voi" : 
				data = null;
				break;
			case "4obj":
				var oData = oArgs.oData;
				for(var k in oData) {
					if(oData.hasOwnProperty(k)){
						v = oData[k];
						if (cache.isFunction(v)) v = v();
						
						if (cache.isArray(v) || (jindo.$A && v instanceof jindo.$A)) {
							if(v instanceof jindo.$A) v = v._array;
							
							for(var i=0; i < v.length; i++) {
								a[a.length] = k+"="+encodeURIComponent(v[i]);
							}
						} else {
							a[a.length] = k+"="+encodeURIComponent(v);
						}
					}
				}
				data = a.join("&");
		}
	}
	
	/*
	 {{request_1}}
	 */
	if(data && sUpType=="XHR" && sUpMethod=="GET"){
		if(url.indexOf('?')==-1){
			url += "?";
		} else {
			url += "&";			
		}
		url += data;
		data = null;
	}

	if(sUpType=="XHR"){
		req.open(sUpMethod, url, !!opt.async);
	}else{
		req.open(sUpMethod, url);
	}
	
	if(opt.withCredentials){
		req.withCredentials = true;
	}
    if(sUpType=="XHR"&&sUpMethod=="POST"){
        /*
         {{request_1a}}
         */
		if(opt.data && opt.data.constructor === window.FormData) {
	        data = opt.data;
	        bFormData = true;
		}

        req.setRequestHeader("If-Modified-Since", "Thu, 1 Jan 1970 00:00:00 GMT");
    }
	if(sUpType=="XHR"){
		if(!this._headers["Content-Type"] && !bFormData){
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
		}
		if(!this._bCORS&&!this._headers["X-Requested-With"]){
			req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		}
		for (var x in this._headers) {
			if(this._headers.hasOwnProperty(x)){
				if (typeof this._headers[x] == "function") 
					continue;
				req.setRequestHeader(x, String(this._headers[x]));
			}
		}
	}
	if(req.addEventListener){
		/*
		 {{request_3}}
		 */
		if(this._loadFunc){ req.removeEventListener("load", this._loadFunc, false); }
		if(this._errorFun){ req.removeEventListener("error", this._errorFun, false); }
		this._loadFunc = function(rq){ 
			clearTimeout(_timer);
			_timer = undefined; 
			t._onload(); 
		};
		this._errorFun = function(rq){ 
			clearTimeout(_timer);
			_timer = undefined;
			t._options.onerror(new jindo.$Ajax.Response(t._request));
		};
		req.addEventListener("load", this._loadFunc, false);
		req.addEventListener("error", this._errorFun, false);
	}else{
		if (req.onload !== undefined) {
			req.onload = function(rq){
				if(req.readyState == 4 && !t._is_abort){
					clearTimeout(_timer); 
					_timer = undefined;
					t._onload();
				}
			};
		} else {
            /*
            {{request_4}}
             */
			req.onreadystatechange = function(rq){
				if(req.readyState == 4){
					clearTimeout(_timer); 
					_timer = undefined;
					t._onload();
				}
			};
		}
	}
	if (opt.timeout > 0) {
		if(this._timer) clearTimeout(this._timer);
		
		_timer = setTimeout(function(){
			t._is_abort = true;
			if(t._interval){
				clearInterval(t._interval);
				t._interval = undefined;
			}
			try { req.abort(); } catch(e) {}

			opt.ontimeout(req);	
			if(cache.isFunction(t._oncompleted)) t._oncompleted(false);
		}, opt.timeout * 1000 );
		this._timer = _timer;
	}
	/*
	{{request_5}}
	 */
	this._test_url = url;
	req.send(data);

	return this;
};

/**
{{isIdle}}
 */
jindo.$Ajax.prototype.isIdle = function(){
	return this._status==0;
};

/**
{{abort}}
 */
jindo.$Ajax.prototype.abort = function() {
	try {
		if(this._interval) clearInterval(this._interval);
		if(this._timer) clearTimeout(this._timer);
		this._interval = undefined;
		this._timer = undefined;
		this._is_abort = true;
		this._request.abort();
	}finally{
		this._status--;
	}

	return this;
};

/**
{{url}}
 */
/**
{{url2}}
 */
jindo.$Ajax.prototype.url = function(sURL){
	var oArgs = g_checkVarType(arguments, {
		'g' : [ ],
		's' : [ 'sURL:String+' ]
	},"$Ajax#url");
	
	switch(oArgs+"") {
		case 'g':
	    	return this._url;
		case 's':
			this._checkCORS(oArgs.sURL,this._options.type,"#url");
	    	this._url = oArgs.sURL;
			return this;
	}
};

/**
{{option}}
 */
/**
{{option2}}
 */
jindo.$Ajax.prototype.option = function(name, value) {
	var oArgs = g_checkVarType(arguments, {
		's4var' : [ 'sKey:String+', 'vValue:Variant' ],
		's4obj' : [ 'oOption:Hash+'],
		'g' : [ 'sKey:String+']
	},"$Ajax#option");
	switch(oArgs+"") {
		case "s4var":
			oArgs.oOption = {};
			oArgs.oOption[oArgs.sKey] = oArgs.vValue;
			// 'break' statement was intentionally omitted.
		case "s4obj":
			var oOption = oArgs.oOption;
			try {
				for (var x in oOption) {
					if (oOption.hasOwnProperty(x)){
						if(x==="onload"||x==="ontimeout"||x==="onerror"){
							this._options[x] = jindo.$Fn(oOption[x],this).bind(); 
						}else{
							this._options[x] = oOption[x];	
						}		
					} 
				}
			} catch(e) {}
			break;
		case 'g':
			return this._options[oArgs.sKey];
			
	}
	this._checkCORS(this._url,this._options.type,"#option");
	jindo.$Ajax._validationOption(this._options,"$Ajax#option");
	return this;
};

/**
{{header}}
 */
/**
{{header2}}
 */
jindo.$Ajax.prototype.header = function(name, value) {
	if(this._options["type"]==="jsonp"){jindo.$Jindo._warn(jindo.$Except.CANNOT_USE_HEADER);}
	
	var oArgs = g_checkVarType(arguments, {
		's4str' : [ 'sKey:String+', 'sValue:String+' ],
		's4obj' : [ 'oOption:Hash+' ],
		'g' : [ 'sKey:String+' ]
	},"$Ajax#option");
	
	switch(oArgs+"") {
		case 's4str':
			this._headers[oArgs.sKey] = oArgs.sValue;
			break;
		case 's4obj':
			var oOption = oArgs.oOption;
			try {
				for (var x in oOption) {
					if (oOption.hasOwnProperty(x)) 
						this._headers[x] = oOption[x];
				}
			} catch(e){}
			break;
		case 'g':
			return this._headers[oArgs.sKey];
			
	}

	return this;
};

/**
{{value}}
 */
jindo.$Ajax.prototype.$value = function() {
    //-@@$Ajax.$value-@@//
    return this._request;
};

/**
{{response_desc}}
 */
/**
{{response}}
 */
jindo.$Ajax.Response  = function(req) {
	this._response = req;
	this._regSheild = /^for\(;;\);/;
};

/**
{{response_xml}}
 */
jindo.$Ajax.Response.prototype.xml = function() {
	return this._response.responseXML;
};

/**
{{response_text}}
 */
jindo.$Ajax.Response.prototype.text = function() {
	return this._response.responseText.replace(this._regSheild, '');
};

/**
{{response_status}}
 */
jindo.$Ajax.Response.prototype.status = function() {
	var status = this._response.status;
	return status==0?200:status;
};

/**
{{response_readyState}}
 */
jindo.$Ajax.Response.prototype.readyState = function() {
	return this._response.readyState;
};

/**
{{response_json}}
 */
jindo.$Ajax.Response.prototype.json = function() {
	if (this._response.responseJSON) {
		return this._response.responseJSON;
	} else if (this._response.responseText) {
		try {
			return eval("("+this.text()+")");
		} catch(e) {
			throw new jindo.$Error(jindo.$Except.PARSE_ERROR,"$Ajax#json");
		}
	}

	return {};
};

/**
{{response_header}}
 */
jindo.$Ajax.Response.prototype.header = function(name) {
	var oArgs = g_checkVarType(arguments, {
		'4str' : [ 'name:String+' ],
		'4voi' : [ ]
	},"$Ajax.Response#header");
	
	switch (oArgs+"") {
	case '4str':
		return this._response.getResponseHeader(name);
	case '4voi':
		return this._response.getAllResponseHeaders();
	}
};

/**
{{response_value}}
 */
jindo.$Ajax.Response.prototype.$value = function() {
    //-@@$Ajax.Response.$value-@@//
    return this._response;
};
//-!jindo.$Ajax end!-//