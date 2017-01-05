/**
{{title}}
 */

//-!jindo.$Ajax start(jindo.$Json.prototype.toString)!-//
/**
{{constructor}}
 */
jindo.$Ajax = function (url, option) {
	var cl = arguments.callee;
	if (!(this instanceof cl)) return new cl(url, option);

	function _getXHR() {
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		} else if (ActiveXObject) {
			try { 
				return new ActiveXObject('MSXML2.XMLHTTP'); 
			}catch(e) { 
				return new ActiveXObject('Microsoft.XMLHTTP'); 
			}
			return null;
		}
	}

	var loc    = location.toString();
	var domain = '';
	try { domain = loc.match(/^https?:\/\/([a-z0-9_\-\.]+)/i)[1]; } catch(e) {}
	
	this._status = 0;
	this._url = url;
	this._options  = new Object;
	this._headers  = new Object;
	this._options = {
		type   :"xhr",
		method :"post",
		proxy  :"",
		timeout:0,
		onload :function(req){},
		onerror :null,
		ontimeout:function(req){},
		jsonp_charset : "utf-8",
		callbackid : "",
		callbackname : "",
		sendheader : true,
		async : true,
		decode :true,
		postBody :false
	};
	this.option(option);
	
	/*
	 {{constructor_1}}
	 */
	if(jindo.$Ajax.CONFIG){
		this.option(jindo.$Ajax.CONFIG);
	}	

	var _opt = this._options;

	_opt.type   = _opt.type.toLowerCase();
	_opt.method = _opt.method.toLowerCase();

	if (typeof window.__jindo2_callback == "undefined") {
		window.__jindo2_callback = new Array();
	}

	var t = this;
	switch (_opt.type) {
		case "put":
		case "delete":
		case "get":
		case "post":
			_opt.method = _opt.type;
			_opt.type   = "xhr";
		case "xhr":
			
			this._request = _getXHR();
			break;
		case "flash":
			
			if(!jindo.$Ajax.SWFRequest) throw Error('Require jindo.$Ajax.SWFRequest');
			
			this._request = new jindo.$Ajax.SWFRequest( function(name,value){return t.option.apply(t, [name, value]);} );
			break;
		case "jsonp":
			
			if(!jindo.$Ajax.JSONPRequest) throw Error('Require jindo.$Ajax.JSONPRequest');
			_opt.method = "get";
			this._request = new jindo.$Ajax.JSONPRequest( function(name,value){return t.option.apply(t, [name, value]);} );
			break;
		case "iframe":
			
			if(!jindo.$Ajax.FrameRequest) throw Error('Require jindo.$Ajax.FrameRequest');
			this._request = new jindo.$Ajax.FrameRequest( function(name,value){return t.option.apply(t, [name, value]);} );
			break;
	}
};


/**
 * @ignore
 */
jindo.$Ajax.prototype._onload = (function(isIE) {
	if(isIE){
		return function(){
			var bSuccess = this._request.readyState == 4 && this._request.status == 200;
			var oResult;
			if (this._request.readyState == 4) {
				  try {
						if (this._request.status != 200 && typeof this._options.onerror == 'function'){
							if(!this._request.status == 0){
								this._options.onerror(jindo.$Ajax.Response(this._request));
							}
						}else{
							if(!this._is_abort){
								oResult = this._options.onload(jindo.$Ajax.Response(this._request));	
							}
						} 
				}finally{
					if(typeof this._oncompleted == 'function'){
						this._oncompleted(bSuccess, oResult);
					}
					if (this._options.type == "xhr" ){
						this.abort();
						try { delete this._request.onload; } catch(e) { this._request.onload =undefined;} 
					}
					delete this._request.onreadystatechange;
					
				}
			}
		}
	}else{
		return function(){
			var bSuccess = this._request.readyState == 4 && this._request.status == 200;
			var oResult;
			if (this._request.readyState == 4) {
				  try {
				  		
						if (this._request.status != 200 && typeof this._options.onerror == 'function'){
							this._options.onerror(jindo.$Ajax.Response(this._request));
						}else{
							oResult = this._options.onload(jindo.$Ajax.Response(this._request));
						} 
				}finally{
					this._status--;
					if(typeof this._oncompleted == 'function'){
						this._oncompleted(bSuccess, oResult);
					} 
				}
			}
		}
	}
})(/MSIE/.test(window.navigator.userAgent));

/**
{{request}}
 */
jindo.$Ajax.prototype.request = function(oData) {
	this._status++;
	var t   = this;
	var req = this._request;
	var opt = this._options;
	var data, v,a = [], data = "";
	var _timer = null;
	var url = this._url;
	this._is_abort = false;

	if( opt.postBody && opt.type.toUpperCase()=="XHR" && opt.method.toUpperCase()!="GET"){
		if(typeof oData == 'string'){
			data = oData;
		}else{
			data = jindo.$Json(oData).toString();	
		}	
	}else if (typeof oData == "undefined" || !oData) {
		data = null;
	} else {
		for(var k in oData) {
			if(oData.hasOwnProperty(k)){
				v = oData[k];
				if (typeof v == "function") v = v();
				
				if (v instanceof Array || (jindo.$A && v instanceof jindo.$A)) {
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
	
	/*
	 {{request_1}}
	 */
	if(data && opt.type.toUpperCase()=="XHR" && opt.method.toUpperCase()=="GET"){
		if(url.indexOf('?')==-1){
			url += "?";
		} else {
			url += "&";			
		}
		url += data;
		data = null;
	}
	req.open(opt.method.toUpperCase(), url, opt.async);
	if(opt.type.toUpperCase()=="XHR"&&opt.method.toUpperCase()=="GET"&&/MSIE/.test(window.navigator.userAgent)){
		/*
		 {{request_2}}
		 */
		req.setRequestHeader("If-Modified-Since", "Thu, 1 Jan 1970 00:00:00 GMT");
	} 
	if (opt.sendheader) {
		if(!this._headers["Content-Type"]){
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
		}
		req.setRequestHeader("charset", "utf-8");
		for (var x in this._headers) {
			if(this._headers.hasOwnProperty(x)){
				if (typeof this._headers[x] == "function") 
					continue;
				req.setRequestHeader(x, String(this._headers[x]));
			}
		}
	}
	var navi = navigator.userAgent;
	if(req.addEventListener&&!(navi.indexOf("Opera") > -1)&&!(navi.indexOf("MSIE") > -1)){
		/*
		 {{request_3}}
		 */
		if(this._loadFunc){ req.removeEventListener("load", this._loadFunc, false); }
		this._loadFunc = function(rq){ 
			clearTimeout(_timer);
			_timer = undefined; 
			t._onload(rq); 
		}
		req.addEventListener("load", this._loadFunc, false);
	}else{
		if (typeof req.onload != "undefined") {
			req.onload = function(rq){
				if(req.readyState == 4 && !t._is_abort){
					clearTimeout(_timer); 
					_timer = undefined;
					t._onload(rq);
				}
			};
		} else {
            /*
            {{request_4}}
             */
			if(window.navigator.userAgent.match(/(?:MSIE) ([0-9.]+)/)[1]==6&&opt.async){
				var onreadystatechange = function(rq){
					if(req.readyState == 4 && !t._is_abort){
						if(_timer){
							clearTimeout(_timer);
							_timer = undefined;
						}
						t._onload(rq);
						clearInterval(t._interval);
						t._interval = undefined;
					}
				};
				this._interval = setInterval(onreadystatechange,300);

			}else{
				req.onreadystatechange = function(rq){
					if(req.readyState == 4){
						clearTimeout(_timer); 
						_timer = undefined;
						t._onload(rq);
					}
				};
			}
		}
	}

	if (opt.timeout > 0) {
		
//		if(this._interval)clearInterval(this._interval);
		if(this._timer) clearTimeout(this._timer);
		
		_timer = setTimeout(function(){
			t._is_abort = true;
			if(t._interval){
				clearInterval(t._interval);
				t._interval = undefined;
			}
			try{ req.abort(); }catch(e){};

			opt.ontimeout(req);	
			if(typeof t._oncompleted == 'function') t._oncompleted(false);
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
}

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
{{option}}
 */
jindo.$Ajax.prototype.option = function(name, value) {
	if (typeof name == "undefined") return "";
	if (typeof name == "string") {
		if (typeof value == "undefined") return this._options[name];
		this._options[name] = value;
		return this;
	}

	try { 
		for(var x in name){
			if(name.hasOwnProperty(x))
				this._options[x] = name[x]
		}  
	} catch(e) {};

	return this;
};

/**
{{header}}
 */
jindo.$Ajax.prototype.header = function(name, value) {
	if (typeof name == "undefined") return "";
	if (typeof name == "string") {
		if (typeof value == "undefined") return this._headers[name];
		this._headers[name] = value;
		return this;
	}

	try { 
		for (var x in name) {
			if (name.hasOwnProperty(x)) 
				this._headers[x] = name[x]
		}	
			
			 
	} catch(e) {};

	return this;
};

/**
{{response}}
 */
jindo.$Ajax.Response  = function(req) {
	if (this === jindo.$Ajax) return new jindo.$Ajax.Response(req);
	this._response = req;
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
	return this._response.responseText;
};

/**
{{response_status}}
 */
jindo.$Ajax.Response.prototype.status = function() {
	return this._response.status;
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
			return eval("("+this._response.responseText+")");
		} catch(e) {
			return {};
		}
	}

	return {};
};

/**
{{response_header}}
 */
jindo.$Ajax.Response.prototype.header = function(name) {
	if (typeof name == "string") return this._response.getResponseHeader(name);
	return this._response.getAllResponseHeaders();
};
//-!jindo.$Ajax end!-//
