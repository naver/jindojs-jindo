/**

 * @fileOverview $Ajax의 확장 메서드를 정의한 파일
 * @name Ajax.extend.js
	
 */

/**

 * @class Ajax 요청 객체의 기본 객체이다.
 * @description Ajax 요청 타입 별로 Ajax 요청 객체를 생성할 때 Ajax 요청 객체를 생성하기 위한 상위 객체로 사용한다.
 * @see $Ajax
    
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

 * @class Ajax 요청 타입이 jsonp인 요청 객체를 생성하며, $Ajax() 객체에서 Ajax 요청 객체를 생성할 때 사용한다.
 * @extends $Ajax.RequestBase
 * @description $Ajax.JSONPRequest 객체를 생성한다. 이때, $Ajax.JSONPRequest 객체는 $Ajax.RequestBase 객체를 상속한다.
 * @see $Ajax
 * @see $Ajax.RequestBase
    
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
 
 * @class Ajax 요청 타입이 flash인 요청 객체를 생성하며, $Ajax() 객체에서 Ajax 요청 객체를 생성할 때 사용한다.
 * @extends $Ajax.RequestBase
 * @description $Ajax.SWFRequest 객체를 생성한다. 이때, $Ajax.SWFRequest 객체는 $Ajax.RequestBase 객체를 상속한다.
 * @see $Ajax
 * @see $Ajax.RequestBase
    
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
         
 하위 호환을 위해 status가 boolean 값인 경우도 처리
    
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
                        
 데이터 안에 utf-8이 아닌 다른 인코딩일때 디코딩을 안하고 바로 text에 저장.
    
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
            
 콜백코드는 넣었지만, 아직 SWF에서 응답헤더 지원 안함
    
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

 * @description write() 메서드는 플래시 객체를 초기화하는 메서드로서 write() 메서드를 호출하면 통신을 위한 플래시 객체를 문서 내에 추가한다. Ajax 요청 타입이 flash이면 플래시 객체를 통해 통신한다. 따라서 $Ajax() 객체의 request 메서드가 호출되기 전에 write() 메서드를 반드시 한 번 실행해야 하며, <body> 요소에 작성되어야 한다. 두 번 이상 실행해도 문제가 발생한다.
 * @param {String} [sSWFPath] Ajax 통신에 사용할 플래시 파일. 기본 값은 "./ajax.swf" 이다.
 * @see $Ajax#request
 * @example
<body>
    <script type="text/javascript">
        $Ajax.SWFRequest.write("/path/swf/ajax.swf");
    </script>
</body>
    
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

 * @description 플래시 객체 로딩 여부를 저장한 변수. 로딩된 경우 true를 반환하고 로딩되지 않은 경우 false를 반환한다. 플래시 객체가 로딩되었는지 확인할 때 사용할 수 있다.
 * @see $Ajax.SWFRequest.write
    
 */
jindo.$Ajax.SWFRequest.activeFlash = false;

/**

 * flash에서 로딩 후 실행 시키는 함수.
 * @ignore
    
 */
jindo.$Ajax.SWFRequest.loaded = function(){
	clearTimeout(jindo.$Ajax._checkFlashKey);
	jindo.$Ajax.SWFRequest.activeFlash = true;
}

/**

 * @class Ajax 요청 타입이 iframe인 요청 객체를 생성하며, $Ajax() 객체에서 Ajax 요청 객체를 생성할 때 사용한다.
 * @extends $Ajax.RequestBase
 * @description $Ajax.FrameRequest 객체를 생성한다. 이때, $Ajax.FrameRequest 객체는 $Ajax.RequestBase 객체를 상속한다.
 * @see $Ajax
 * @see $Ajax.RequestBase
    
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

 * @class Ajax 요청을 큐에 담아 큐에 들어온 순서대로 요청을 처리한다.
 * @constructor
 * @description $Ajax() 객체를 순서대로 호출할 수 있도록 기능을 제공한다.
 * @param {Object} oOption $Ajax.Queue 객체가 서버로 통신을 요청할 때 사용하는 정보를 정의한다.
	<ul>
		<li>async : 비동기/동기 요청 방식을 설정한다. 비동기 요청 방식이면 true, 동기 요청 방식이면 false를 설정한다. 기본 값은 false 이다.</li>
		<li>useResultAsParam : 이전 요청 결과를 다음 요청의 파라미터로 전달할지 결정한다. 이전 요청 결과를 파라미터로 전달하려면 true, 그렇게 하지 않을 경우 false를 설정한다. 기본 값은 false 이다.</li>
		<li>stopOnFailure : 이전 요청이 실패할 경우 다음 요청 중단 여부를 설정한다. 다음 요청을 중단하려면 true, 계속 실행하려면 false를 설정한다. 기본 값은 false 이다.</li>
	</ul>
 * @since 1.3.7
 * @see $Ajax
 * @example
// $Ajax 요청 큐를 생성한다.
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

 * @description option() 메서드는 $Ajax.Queue 객체에 설정한 옵션 값을 확인하거나 지정한 값으로 설정한다. 또한 파라미터로 하나 이상의 옵션을 지정한 객체를 입력할 수 있다.
 * @param {Variant} vName 옵션의 이름(String) 또는 하나 이상의 옵션을 설정한 객체(Object).
 * @param {Variant} [vValue] 설정할 옵션의 값. 설정할 옵션을 vName에 지정한 경우에만 입력한다.
 * @return {Variant} 지정한 옵션의 값(Value)을 반환하거나, 입력한 옵션을 설정한 $Ajax.Queue 객체를 반환한다.
 * @see $Ajax.Queue
 * @example
var oAjaxQueue = new $Ajax.Queue({
	useResultAsParam : true
});

oAjaxQueue.option("useResultAsParam");	// useResultAsParam 옵션 값인 true 를 리턴한다.
oAjaxQueue.option("async", true);		// async 옵션을 true 로 설정한다.
    
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

 * @description add() 메서드는 $Ajax.Queue에 Ajax 요청($Ajax() 객체)을 추가한다.
 * @param {$Ajax} oAjax 추가할 $Ajax() 객체.
 * @param {Object} oParam Ajax 요청 시 전송할 파라미터 객체.
 * @example
var oAjax1 = new $Ajax('ajax_test.php',{
	onload :  function(res){
		// onload 핸들러
	}
});
var oAjax2 = new $Ajax('ajax_test.php',{
	onload :  function(res){
		// onload 핸들러
	}
});
var oAjax3 = new $Ajax('ajax_test.php',{
	onload :  function(res){
		// onload 핸들러
	}

});

var oAjaxQueue = new $Ajax.Queue({
	async : true,
	useResultAsParam : true,
	stopOnFailure : false
});

// Ajax 요청을 큐에 추가한다.
oAjaxQueue.add(oAjax1,{seq:1});
oAjaxQueue.add(oAjax2,{seq:2,foo:99});
oAjaxQueue.add(oAjax3,{seq:3});

oAjaxQueue.request();
    
 */
jindo.$Ajax.Queue.prototype.add = function (oAjax, oParam) {
	this._queue.push({obj:oAjax, param:oParam});
}

/**

 * @description request() 메서드는 $Ajax.Queue에 있는 Ajax 요청을 서버로 보낸다.
 * @example
var oAjaxQueue = new $Ajax.Queue({
	useResultAsParam : true
});
oAjaxQueue.add(oAjax1,{seq:1});
oAjaxQueue.add(oAjax2,{seq:2,foo:99});
oAjaxQueue.add(oAjax3,{seq:3});

// 서버에 Ajax 요청을 보낸다.
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