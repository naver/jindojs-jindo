/**
{{title}}
 */
//-!jindo.$Ajax.RequestBase start(jindo.$Class,jindo.$Ajax)!-//
/**
{{requestBase_desc}}
 */
/**
{{requestBase}}
 */
var klass = jindo.$Class;
jindo.$Ajax.RequestBase = klass({
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
		jindo._checkVarType(arguments, {
			'4str' : [ 'sName:String+', 'sValue:String+' ]
		},"$Ajax.RequestBase#setRequestHeader");
		this._headers[sName] = sValue;
	},
	getResponseHeader : function(sName) {
		jindo._checkVarType(arguments, {
			'4str' : [ 'sName:String+']
		},"$Ajax.RequestBase#getResponseHeader");
		return this._respHeaders[sName] || "";
	},
	getAllResponseHeaders : function() {
		return this._respHeaderString;
	},
	_getCallbackInfo : function() {
		var id = "";
		if(this.option("callbackid") && this.option("callbackid")!="") {
			var idx = 0;
			do {
				id = "_" + this.option("callbackid") + "_"+idx;
				idx++;
			} while (window["__"+jindo._p_.jindoName+"_callback"][id]);	
		}else{
			do {
				id = "_" + Math.floor(Math.random() * 10000);
			} while (window["__"+jindo._p_.jindoName+"_callback"][id]);
		}
		
		if(this.option("callbackname") == ""){
			this.option("callbackname","_callback");
		}
		return {callbackname:this.option("callbackname"),id:id,name:"window.__"+jindo._p_.jindoName+"_callback."+id};
	}
});
//-!jindo.$Ajax.RequestBase end!-//

//-!jindo.$Ajax.JSONPRequest start(jindo.$Class,jindo.$Ajax,jindo.$Ajax.RequestBase)!-//
/**
{{jSONPRequest_desc}}
 */
/**
{{jSONPRequest}}
 */
jindo.$Ajax.JSONPRequest = klass({
	_headers : {},
	_respHeaders : {},
	_script : null,
	_onerror : null,
	$init  : function(fpOption){
		this.option = fpOption;
	},
	/**
	 * @ignore 
	 */
	_callback : function(data) {
		
		if (this._onerror) {
			clearTimeout(this._onerror);
			this._onerror = null;
		}
			
		var self = this;

		this.responseJSON = data;
		this.onload(this);
		setTimeout(function(){ self.abort(); }, 10);
	},
	abort : function() {
		if (this._script) {
			try {
				this._script.parentNode.removeChild(this._script); 
			}catch(e){}
		}
	},
	open  : function(method, url) {
		jindo._checkVarType(arguments, {
			'4str' : [ 'method:String+','url:String+']
		},"$Ajax.JSONPRequest#open");
		this.responseJSON = null;
		this._url = url;
	},
	send  : function(data) {
		var oArgs = jindo._checkVarType(arguments, {
			'4voi' : [],
			'4nul' : ["data:Null"],
			'4str' : ["data:String+"]
		},"$Ajax.JSONPRequest#send");
		var t    = this;
		var info = this._getCallbackInfo();
		var head = document.getElementsByTagName("head")[0];
		this._script = document.createElement("script");
		this._script.type    = "text/javascript";
		this._script.charset = this.option("jsonp_charset");

		if (head) {
			head.appendChild(this._script);
		} else if (document.body) {
			document.body.appendChild(this._script);
		}
		window["__"+jindo._p_.jindoName+"_callback"][info.id] = function(data){
			try {
				t.readyState = 4;
				t.status = 200;
				t._callback(data);
			} finally {
				delete window["__"+jindo._p_.jindoName+"_callback"][info.id];
				delete window["__"+jindo._p_.jindoName+"2_callback"][info.id];
			}
		};
		window["__"+jindo._p_.jindoName+"2_callback"][info.id] = function(data){
            window["__"+jindo._p_.jindoName+"_callback"][info.id](data);
        };
		
		var _loadCallback = function(){
			if (!t.responseJSON) {
				t.readyState = 4;
				t.status = 500;
				t._onerror = setTimeout(function(){t._callback(null);}, 200);
			}
		};
		this._script.onload = 
		this._script.onerror = function(){
			_loadCallback();
			this.onerror = null;
			this.onload = null;
		};
		var delimiter = "&";
		if(this._url.indexOf('?')==-1){
			delimiter = "?";
		}
		switch(oArgs+""){
			case "4voi":
			case "4nul":
				data = "";
				break;
			case "4str":
				data = "&" + data;
			
		}
		//test url for spec.
		this._test_url = this._script.src = this._url+delimiter+info.callbackname+"="+info.name+data;
		
	}
}).extend(jindo.$Ajax.RequestBase);
//-!jindo.$Ajax.JSONPRequest end!-//

//-!jindo.$Ajax.Queue start(jindo.$Ajax)!-//
/**
{{queue_desc}}
 */
/**
{{queue}}
 */
jindo.$Ajax.Queue = function (option) {
	//-@@$Ajax.Queue-@@//
	var cl = arguments.callee;
	if (!(this instanceof cl)){ return new cl(option||{});}
	
	var oArgs = jindo._checkVarType(arguments, {
		'4voi' : [],
		'4obj' : ["option:Hash+"]
	},"$Ajax.Queue");
	option = oArgs.option;
	this._options = {
		async : false,
		useResultAsParam : false,
		stopOnFailure : false
	};

	this.option(option);
	
	this._queue = [];	
};

/**
{{queue_option1}}
 */
/**
{{queue_option2}}
 */
jindo.$Ajax.Queue.prototype.option = function(name, value) {
	var oArgs = jindo._checkVarType(arguments, {
		's4str' : [ 'sKey:String+', 'sValue:Variant' ],
		's4obj' : [ 'oOption:Hash+' ],
		'g' : [ 'sKey:String+' ]
	},"$Ajax.Queue#option");
	
	switch(oArgs+"") {
		case 's4str':
			this._options[oArgs.sKey] = oArgs.sValue;
			break;
		case 's4obj':
			var oOption = oArgs.oOption;
			try {
				for (var x in oOption) {
					if (oOption.hasOwnProperty(x)) 
						this._options[x] = oOption[x];
				}
			}catch(e) {}
			break;
		case 'g':
			return this._options[oArgs.sKey];
	}

	return this;
};

/**
{{queue_add}}
 */
jindo.$Ajax.Queue.prototype.add = function (oAjax, oParam) {
	var oArgs = jindo._checkVarType(arguments, {
		'4obj' : ['oAjax:Hash+'],
		'4obj2' : ['oAjax:Hash+','oPram:Hash+']
	},"$Ajax.Queue");
	switch(oArgs+""){
		case "4obj2":
			oParam = oArgs.oPram;
	}
	
	this._queue.push({obj:oAjax, param:oParam});
	return this;
};

/**
{{queue_request}}
 */
jindo.$Ajax.Queue.prototype.request = function () {
	this._requestAsync.apply(this,this.option('async')?[]:[0]);
	return this;
};

jindo.$Ajax.Queue.prototype._requestSync = function (nIdx, oParam) {
	var t = this;
	var queue = this._queue;
	if (queue.length > nIdx+1) {
		queue[nIdx].obj._oncompleted = function(bSuccess, oResult){
			if(!t.option('stopOnFailure') || bSuccess) t._requestSync(nIdx + 1, oResult);
		};
	}
	var _oParam = queue[nIdx].param||{};
	if(this.option('useResultAsParam') && oParam){
		try { for(var x in oParam) if(_oParam[x] === undefined && oParam.hasOwnProperty(x)) _oParam[x] = oParam[x]; } catch(e) {}
	}
	queue[nIdx].obj.request(_oParam);
};

jindo.$Ajax.Queue.prototype._requestAsync = function () {
	for( var i=0; i<this._queue.length; i++)
		this._queue[i].obj.request(this._queue[i].param||{});
};
//-!jindo.$Ajax.Queue end!-//