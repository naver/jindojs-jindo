/**
 {{title}}
 */
//-!jindo.$Template start!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$Template = function(str, sEngineName){
	//-@@$Template-@@//
	var obj = null,
		tag = "",
		cl = arguments.callee,
		_sEngineName;

	if(str instanceof cl){
		return str;
	}
	
	if(!(this instanceof cl)){
		try{
			jindo.$Jindo._maxWarn(arguments.length, 2, "$Template");
			
			return new cl(str || "", sEngineName || "default");
		}catch(e){
			if(e instanceof TypeError){
				return null;
			}
			
			throw e;
		}
	}
	
	var oArgs = g_checkVarType(arguments, {
		'4str' : ['str:String+'],
		'4ele' : ['ele:Element+'],
		'4str3' : ['str:String+', 'sEngineName:String+'],
		'4ele3' : ['ele:Element+', 'sEngineName:String+']
	}, "$Template");
	
	if((obj = _getElementById(document, str) || str) && obj.tagName && (tag = obj.tagName.toUpperCase()) && (tag == "TEXTAREA" || (tag == "SCRIPT" && obj.getAttribute("type") == "text/template"))){
		str = (obj.value || obj.innerHTML).replace(/^\s+|\s+$/g, "");
	}
	
	this._str = str + "";
	_sEngineName = "default";
	
	switch(oArgs + ""){
		case "4str3":
		case "4ele3":
			_sEngineName =oArgs.sEngineName; 
			break;
	}
	
	this._compiler = jindo.$Template.getEngine(_sEngineName);
};
jindo.$Template._aEngines = {};
jindo.$Template._cache = {};
jindo.$Template.splitter = /(?!\\)[\{\}]/g;
jindo.$Template.pattern  = /^(?:if (.+)|elseif (.+)|for (?:(.+)\:)?(.+) in (.+)|(else)|\/(if|for)|=(.+)|js (.+)|set (.+)|gset (.+))$/;

/**
 {{addEngine}}
 */
jindo.$Template.addEngine = function(sEngineName, fEngine){
	var oArgs = g_checkVarType(arguments, {
		"4fun" : ["sEngineName:String+", "fEngine:Function+"]
	}, "$Template#addEngine");
	
	jindo.$Template._aEngines[oArgs.sEngineName] = oArgs.fEngine;
};

/**
 {{getEngine}}
 */
jindo.$Template.getEngine = function(sEngineName){
	var oArgs = g_checkVarType(arguments, {
		"4str" : ["sEngineName:String+"]
	}, "$Template#getEngine");
	
	return jindo.$Template._aEngines[oArgs.sEngineName];
};
//-!jindo.$Template end!-//

//-!jindo.$Template.prototype.process start!-//
/**
 {{process}}
 */
jindo.$Template.prototype.process = function(data){
	//-@@$Template.process-@@//
	var oArgs = g_checkVarType(arguments, {
			'4obj' : ['data:Hash+'],
			'4voi' : []
		}, "$Template#process"),
		fProcess;
	
	if(jindo.$Template._cache && jindo.$Template._cache[this._str]){
		fProcess = jindo.$Template._cache[this._str];
		
		return fProcess(oArgs + "" == "for_void" ? "" : oArgs.data);
	}
	
	jindo.$Template._cache[this._str] = fProcess = this._compiler(this._str);
	
	return fProcess(oArgs + "" == "for_void" ? "" : oArgs.data);
};
//-!jindo.$Template.prototype.process end!-//