/**

 * @fileOverview A file to define the extended method of $Ajax
 * @name Ajax.extend.js
	
 */

/**

 * Creates request objects by Ajax request type.
 * @class The base object of an Ajax request object
 * @ignore
    
 */
jindo.$Ajax.RequestBase = jindo.$Class({
	_respHeaderString : "",
	callbackid:"",
	callbackname:"",
	responseXML  : null,
	responseJSON : null,
	responseText : "",
	status : 404,
	readyState : 0,
	$init  : function(fpOption){},
	onload : function(){},
	abort  : function(){},
	open   : function(){},
	send   : function(){},
	setRequestHeader  : function(sName, sValue) {
		this._headers[sName] = sValue;
	},
	getResponseHeader : function(sName) {
		return this._respHeaders[sName] || "";
	},
	getAllResponseHeaders : function() {
		return this._respHeaderString;
	},
	_getCallbackInfo : function() {
		var id = "";
		if(this.option("callbackid")!="") {
			var idx = 0;
			do {
				id = "_" + this.option("callbackid") + "_"+idx;
				idx++;
			} while (window.__jindo2_callback[id]);	
		}else{
			do {
				id = "_" + Math.floor(Math.random() * 10000);
			} while (window.__jindo2_callback[id]);
		}
		
		if(this.option("callbackname") == ""){
			this.option("callbackname","_callback");
		}
			   
		return {callbackname:this.option("callbackname"),id:id,name:"window.__jindo2_callback."+id};
	}
});

/**

 * Creates and returns the $Ajax.JSONPRequest object.
 * @extends $Ajax.RequestBase
 * @class This class creates a request object of which Ajax request type is jsonp. Used when the request object is created in the $Ajax creator.
 * @ignore
    
 */
jindo.$Ajax.JSONPRequest = jindo.$Class({
	_headers : {},
	_respHeaders : {},
	_script : null,
	_onerror : null,
	$init  : function(fpOption){
		this.option = fpOption;
	},
	_callback : function(data) {
		
		if (this._onerror) {
			clearTimeout(this._onerror);
			this._onerror = null;
		}
			
		var self = this;

		this.responseJSON = data;
		this.onload(this);
		setTimeout(function(){ self.abort() }, 10);
	},
	abort : function() {
		if (this._script) {
			try { 
				this._script.parentNode.removeChild(this._script); 
			}catch(e){
			};
		}
	},
	open  : function(method, url) {
		this.responseJSON = null;
		this._url = url;
	},
	send  : function(data) {
		var t    = this;
		var info = this._getCallbackInfo();
		var head = document.getElementsByTagName("head")[0];
		this._script = jindo.$("<script>");
		this._script.type    = "text/javascript";
		this._script.charset = this.option("jsonp_charset");

		if (head) {
			head.appendChild(this._script);
		} else if (document.body) {
			document.body.appendChild(this._script);
		}

		window.__jindo2_callback[info.id] = function(data){
			try {
				t.readyState = 4;
				t.status = 200;
				t._callback(data);
			} finally {
				delete window.__jindo2_callback[info.id];
			}
		};
		
		var agent = jindo.$Agent(navigator); 
		if (agent.navigator().ie || agent.navigator().opera) {
			this._script.onreadystatechange = function(){		
				if (this.readyState == 'loaded'){
					if (!t.responseJSON) {
						t.readyState = 4;
						t.status = 500;
						t._onerror = setTimeout(function(){t._callback(null);}, 200);
					}
					this.onreadystatechange = null;
				}
			};
		} else {
			this._script.onload = function(){
				if (!t.responseJSON) {
					t.readyState = 4;
					t.status = 500;
					t._onerror = setTimeout(function(){t._callback(null);}, 200);
				}
				this.onload = null;
				this.onerror = null;
			};
			this._script.onerror = function(){
				if (!t.responseJSON) {
					t.readyState = 4;
					t.status = 404;
					t._onerror = setTimeout(function(){t._callback(null);}, 200);
				}
				this.onerror = null;
				this.onload = null;
			};
		}
		var delimiter = "&";
		if(this._url.indexOf('?')==-1){
			delimiter = "?";
		}
		if (data) {
			data = "&" + data;
		}else{
			data = "";
		}
		//test url for spec.
		this._test_url = this._url+delimiter+info.callbackname+"="+info.name+data;
		this._script.src = this._url+delimiter+info.callbackname+"="+info.name+data;
		
	}
}).extend(jindo.$Ajax.RequestBase);

/**
 
 * Creates and returns the $Ajax.SWFRequest object.
 * @extends $Ajax.RequestBase
 * @class This class creates a request object of which Ajax request type is flash. Used when the request object is created in the $Ajax creator.
 * @ignore
    
 */
jindo.$Ajax.SWFRequest = jindo.$Class({
	$init  : function(fpOption){
		this.option = fpOption;
	},
	_headers : {},
	_respHeaders : {},
	_getFlashObj : function(){
		var navi = jindo.$Agent(window.navigator).navigator();
		var obj;
		if (navi.ie&&navi.version==9) {
			obj = document.getElementById(jindo.$Ajax.SWFRequest._tmpId);
		}else{
			obj = window.document[jindo.$Ajax.SWFRequest._tmpId];
		}
		return(this._getFlashObj =  function(){
			return obj;
		})();
		
	},
	_callback : function(status, data, headers){
		this.readyState = 4;
        /*
         
 Handles a Boolean value for backward compatibility.
    
         */

		if( (typeof status).toLowerCase() == 'number'){
			this.status = status;
		}else{
			if(status==true) this.status=200;
		}		
		if (this.status==200) {
			if (typeof data == "string") {
				try {
					this.responseText = this.option("decode")?decodeURIComponent(data):data;
					if(!this.responseText || this.responseText=="") {
						this.responseText = data;
					}	
				} catch(e) {
                    /*
                        
 Stores in text without decoding data if the data encoding is not uft-8.
    
                     */

					if(e.name == "URIError"){
						this.responseText = data;
						if(!this.responseText || this.responseText=="") {
							this.responseText = data;
						}
					}
				}
			}
            /*
            
 Inserts the callback code; however, SWF does not yet support response headers.
    
             */
			if(typeof headers == "object"){
				this._respHeaders = headers;				
			}
		}
		
		this.onload(this);
	},
	open : function(method, url) {
		var re  = /https?:\/\/([a-z0-9_\-\.]+)/i;

		this._url    = url;
		this._method = method;
	},
	send : function(data) {
		this.responseXML  = false;
		this.responseText = "";

		var t    = this;
		var dat  = {};
		var info = this._getCallbackInfo();
		var swf  = this._getFlashObj()

		function f(arg) {
			switch(typeof arg){
				case "string":
					return '"'+arg.replace(/\"/g, '\\"')+'"';
					break;
				case "number":
					return arg;
					break;
				case "object":
					var ret = "", arr = [];
					if (arg instanceof Array) {
						for(var i=0; i < arg.length; i++) {
							arr[i] = f(arg[i]);
						}
						ret = "["+arr.join(",")+"]";
					} else {
						for(var x in arg) {
							if(arg.hasOwnProperty(x)){
								arr[arr.length] = f(x)+":"+f(arg[x]);	
							}
						}
						ret = "{"+arr.join(",")+"}";
					}
					return ret;
				default:
					return '""';
			}
		}

		data = (data || "").split("&");

		for(var i=0; i < data.length; i++) {
			pos = data[i].indexOf("=");
			key = data[i].substring(0,pos);
			val = data[i].substring(pos+1);

			dat[key] = decodeURIComponent(val);
		}
		this._current_callback_id = info.id
		window.__jindo2_callback[info.id] = function(success, data){
			try {
				t._callback(success, data);
			} finally {
				delete window.__jindo2_callback[info.id];
			}
		};
		
		var oData = {
			url  : this._url,
			type : this._method,
			data : dat,
			charset  : "UTF-8",
			callback : info.name,
			header_json : this._headers
		};
		
		swf.requestViaFlash(f(oData));
	},
	abort : function(){
		
		if(this._current_callback_id){
			window.__jindo2_callback[this._current_callback_id] = function(){
				delete window.__jindo2_callback[info.id];
			}
		}
	}
}).extend(jindo.$Ajax.RequestBase);

/**

 * If the Ajax request type is flash, it must be executed only once before a request method is invoked.<br>
 * <br>
 * If the request type is flash, all communications are performed through a flash object; the flash object must be initialized before Ajax is invoked.<br>
 * If the $Ajax.SWFRequest.write method is invoked, a flash object to handle communications is inserted in a document.
 *
 * @param {String} [swf_path] The path of Flash file to handle communications. If omitted, the default value is "./ajax.swf."
 *
 * @remark The method must be written within the <body> tags.
 * @remark It must be executed only once. A problem will occur if it is executed more than once.
 *
 * @see $Ajax#request
 * @ignore
    
 */
jindo.$Ajax.SWFRequest.write = function(swf_path) {
	if(typeof swf_path == "undefined") swf_path = "./ajax.swf";
	jindo.$Ajax.SWFRequest._tmpId = 'tmpSwf'+(new Date()).getMilliseconds()+Math.floor(Math.random()*100000);
	var activeCallback = "jindo.$Ajax.SWFRequest.loaded";
	jindo.$Ajax._checkFlashLoad();
	document.write('<div style="position:absolute;top:-1000px;left:-1000px"><object id="'+jindo.$Ajax.SWFRequest._tmpId+'" width="1" height="1" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"><param name="movie" value="'+swf_path+'"><param name = "FlashVars" value = "activeCallback='+activeCallback+'" /><param name = "allowScriptAccess" value = "always" /><embed name="'+jindo.$Ajax.SWFRequest._tmpId+'" src="'+swf_path+'" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" width="1" height="1" allowScriptAccess="always" swLiveConnect="true" FlashVars="activeCallback='+activeCallback+'"></embed></object></div>');
	
};

/**
 * @ignore
 */
jindo.$Ajax._checkFlashLoad = function(){
	jindo.$Ajax._checkFlashKey = setTimeout(function(){
//		throw new Error("Check your flash file!. Unload flash on a page.");
//		alert("Check your flash file!. Unload flash on a page.");
	},5000);
	jindo.$Ajax._checkFlashLoad = function(){}
}
/**

 * A variable to check whether flash is loaded
    
 */
jindo.$Ajax.SWFRequest.activeFlash = false;

/**

 * A function to execute after loading in flash
 * @ignore
    
 */
jindo.$Ajax.SWFRequest.loaded = function(){
	clearTimeout(jindo.$Ajax._checkFlashKey);
	jindo.$Ajax.SWFRequest.activeFlash = true;
}

/**

 * Creates and returns the $Ajax.FrameRequest object.
 * @extends $Ajax.RequestBase
 * @class Creates a request object of which Ajax request type is iframe. Used when the request object is created in the $Ajax creator.
 * @ignore
    
 */
jindo.$Ajax.FrameRequest = jindo.$Class({
	_headers : {},
	_respHeaders : {},
	_frame  : null,
	_domain : "",
	$init  : function(fpOption){
		this.option = fpOption;
	},
	_callback : function(id, data, header) {
		var self = this;

		this.readyState   = 4;
		this.status = 200;
		this.responseText = data;

		this._respHeaderString = header;
		header.replace(/^([\w\-]+)\s*:\s*(.+)$/m, function($0,$1,$2) {
			self._respHeaders[$1] = $2;
		});

		this.onload(this);

		setTimeout(function(){ self.abort() }, 10);
	},
	abort : function() {
		if (this._frame) {
			try {
				this._frame.parentNode.removeChild(this._frame);
			} catch(e) {
			}
		}
	},
	open : function(method, url) {
		var re  = /https?:\/\/([a-z0-9_\-\.]+)/i;
		var dom = document.location.toString().match(re);

		this._method = method;
		this._url    = url;
		this._remote = String(url).match(/(https?:\/\/[a-z0-9_\-\.]+)(:[0-9]+)?/i)[0];
		this._frame = null;
		this._domain = (dom[1] != document.domain)?document.domain:"";
	},
	send : function(data) {
		this.responseXML  = "";
		this.responseText = "";

		var t      = this;
		var re     = /https?:\/\/([a-z0-9_\-\.]+)/i;
		var info   = this._getCallbackInfo();
		var url;
		var _aStr = [];
		_aStr.push(this._remote+"/ajax_remote_callback.html?method="+this._method);
		var header = new Array;

		window.__jindo2_callback[info.id] = function(id, data, header){
			try {
				t._callback(id, data, header);
			} finally {
				delete window.__jindo2_callback[info.id];
			}
		};

		for(var x in this._headers) {
			if(this._headers.hasOwnProperty(x)){
				header[header.length] = "'"+x+"':'"+this._headers[x]+"'";	
			}
			
		}

		header = "{"+header.join(",")+"}";
		
		
		_aStr.push("&id="+info.id);
		_aStr.push("&header="+encodeURIComponent(header));
		_aStr.push("&proxy="+encodeURIComponent(this.option("proxy")));
		_aStr.push("&domain="+this._domain);
		_aStr.push("&url="+encodeURIComponent(this._url.replace(re, "")));
		_aStr.push("#"+encodeURIComponent(data));

		var fr = this._frame = jindo.$("<iframe>");
		fr.style.position = "absolute";
		fr.style.visibility = "hidden";
		fr.style.width = "1px";
		fr.style.height = "1px";

		var body = document.body || document.documentElement;
		if (body.firstChild){ 
			body.insertBefore(fr, body.firstChild);
		}else{ 
			body.appendChild(fr);
		}
		fr.src = _aStr.join("");
	}
}).extend(jindo.$Ajax.RequestBase);


/**

 * Provides a feature to sequentially invoke $Ajax objects.
 * @class Stores Ajax requests in queue and processes them in the order they come.
 * @param {Object} option Defines various information that is used when a request is made from $Ajax.Queue to a server.
	<ul>
		<li>
			async: Sets whether it is a synchronously/asynchronously requests. With asynchronous requests, the value is set to true; the default value is false.
		</li>
		<li>
			useResultAsParam: Sets whether to pass the request result that was previously processed to the next request as a parameter. If the request result is passed, the value is set to true; the default value is false.
		</li>
		<li>
			stopOnFailure: Sets whether to stop the next request when the previous request has failed. If the next request stops, the value is set to true; the default value is false.
		</li>
	</ul>
 * @constructor
 * @since 1.3.7
 *
 * @example
// Creates the $Ajax request queue.
var oAjaxQueue = new $Ajax.Queue({
	useResultAsParam : true
});
    
 */
jindo.$Ajax.Queue = function (option) {
	var cl = arguments.callee;
	if (!(this instanceof cl)){ return new cl(option);}
	
	this._options = {
		async : false,
		useResultAsParam : false,
		stopOnFailure : false
	};

	this.option(option);
	
	this._queue = [];	
}

/**

 * Sets or gets the $Ajax.Queue option.
 * @param {Object} name	An option name
 * @param {Object} [value]	An option value. If you want to set options, you must specify values.
 * @return Returns the value when getting a value of {Value | $Ajax.Queue}, or returns the $Ajax.Queue object when setting options.
 * @example
var oAjaxQueue = new $Ajax.Queue({
	useResultAsParam : true
});

oAjaxQueue.option("useResultAsParam");	// Returns true, the option value of useResultAsParam.
oAjaxQueue.option("async", true);		// Sets the async option to true.
    
 */
jindo.$Ajax.Queue.prototype.option = function(name, value) {
	if (typeof name == "undefined"){ return "";}
	if (typeof name == "string") {
		if (typeof value == "undefined"){ return this._options[name];}
		this._options[name] = value;
		return this;
	}

	try { 
		for(var x in name) {
			if(name.hasOwnProperty(x))
				this._options[x] = name[x] 
		}
	} catch(e) {
	};

	return this;
};

/**

 * Adds requests in the Ajax queue.
 * @param {$Ajax} oAjax The $Ajax object to add
 * @param {Object} oParam A parameter object to send upon request
 *
 * @example
var oAjax1 = new $Ajax('ajax_test.php',{
	onload :  function(res){
		// onload handler
	}
});
var oAjax2 = new $Ajax('ajax_test.php',{
	onload :  function(res){
		// onload handler
	}
});
var oAjax3 = new $Ajax('ajax_test.php',{
	onload :  function(res){
		// onload handler
	}

});

var oAjaxQueue = new $Ajax.Queue({
	async : true,
	useResultAsParam : true,
	stopOnFailure : false
});

// Adds in the Ajax request queue.
oAjaxQueue.add(oAjax1,{seq:1});
oAjaxQueue.add(oAjax2,{seq:2,foo:99});
oAjaxQueue.add(oAjax3,{seq:3});

oAjaxQueue.request();
    
 */
jindo.$Ajax.Queue.prototype.add = function (oAjax, oParam) {
	this._queue.push({obj:oAjax, param:oParam});
}

/**

 * Requests the Ajax Queue.
 *
 * @example
var oAjaxQueue = new $Ajax.Queue({
	useResultAsParam : true
});
oAjaxQueue.add(oAjax1,{seq:1});
oAjaxQueue.add(oAjax2,{seq:2,foo:99});
oAjaxQueue.add(oAjax3,{seq:3});

// Sends the Ajax request to a server.
oAjaxQueue.request();
    
 */
jindo.$Ajax.Queue.prototype.request = function () {
	if(this.option('async')){
		this._requestAsync();
	} else {
		this._requestSync(0);
	}
}

jindo.$Ajax.Queue.prototype._requestSync = function (nIdx, oParam) {
	var t = this;
	if (this._queue.length > nIdx+1) {
		this._queue[nIdx].obj._oncompleted = function(bSuccess, oResult){
			if(!t.option('stopOnFailure') || bSuccess) t._requestSync(nIdx + 1, oResult);
		};
	}
	var _oParam = this._queue[nIdx].param||{};
	if(this.option('useResultAsParam') && oParam){
		try { for(var x in oParam) if(typeof _oParam[x] == 'undefined' && oParam.hasOwnProperty(x)) _oParam[x] = oParam[x] } catch(e) {};		
	}
	this._queue[nIdx].obj.request(_oParam);
}

jindo.$Ajax.Queue.prototype._requestAsync = function () {
	for( var i=0; i<this._queue.length; i++)
		this._queue[i].obj.request(this._queue[i].param);
}