/**
 {{title}}
 */
//-!jindo.$Form start!-//
/**
 {{desc}}
 */
/**
 {{constructor}}
 */
jindo.$Form = function (el) {
	//-@@$Form-@@//
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	
	if (!(this instanceof cl)){
		try {
			jindo.$Jindo._maxWarn(arguments.length, 1,"$Form");
			return new cl(el);
		} catch(e) {
			if (e instanceof TypeError) { return null; }
			throw e;
		}
	}	
	
	var oArgs = g_checkVarType(arguments, {
		'4str' : ['oForm:String+'],
		'4ele' : [ 'oForm:Element+']
	},"$Form");
	
	switch (oArgs + "") {
		case "4str":
			el = jindo.$(el);
			break;
	}
	
	if (!(el.tagName&&el.tagName.toUpperCase()=="FORM")) {
		throw TypeError("only form");
	}
	this._form = el;
};
//-!jindo.$Form end!-//

//-!jindo.$Form.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$Form.prototype.$value = function() {
	//-@@$Form.$value-@@//
	return this._form;
};
//-!jindo.$Form.prototype.$value end!-//

//-!jindo.$Form.prototype.serialize start(jindo.$H.prototype.toQueryString)!-//
/**
 {{serialize}}
 */
jindo.$Form.prototype.serialize = function() {
	//-@@$Form.serialize-@@//
 	var self = this;
 	var oRet = {};
 	
 	var nLen = arguments.length;
 	var fpInsert = function(eEle,sKey) {
		if(!eEle.disabled){
	 		var sVal = self.value(sKey);
	 		if (sVal !== undefined) oRet[sKey] = sVal;
		}
 	};
 	
 	if (nLen == 0) {
 		var len = this._form.elements.length;
 		for(var i=0; i<len; i++){
 			var o = this._form.elements[i];
 			if(o.name) fpInsert(o,o.name);
 		}		
	}else{
		for (var i = 0; i < nLen; i++) {
			fpInsert(this.element(arguments[i]),arguments[i]);
		}
	}

	return jindo.$H(oRet).toQueryString();	
};
//-!jindo.$Form.prototype.serialize end!-//

//-!jindo.$Form.prototype.element start!-//
/**
 {{element}}
 */
jindo.$Form.prototype.element = function(sKey) {
	//-@@$Form.element-@@//
	
	var oArgs = g_checkVarType(arguments, {
		'4voi' : [],
		'4str' : [jindo.$Jindo._F('sKey:String+')]
	},"$Form#element");
	
	switch(oArgs+""){
		case "4voi":
			return jindo._p_._toArray(this._form.elements);	
		case "4str":
			return this._form.elements[sKey+""];
	}
};
//-!jindo.$Form.prototype.element end!-//

//-!jindo.$Form.prototype.enable start!-//
/**
 {{enable}}
 */
/**
 {{enable2}}
 */
jindo.$Form.prototype.enable = function(sKey) {
	//-@@$Form.enable-@@//
	var oArgs = g_checkVarType(arguments, {
		's4bln' : [ 'sName:String+', 'bEnable:Boolean' ],
		's4obj' : [ 'oObj:Hash+'],
		'g' : [ jindo.$Jindo._F('sName:String+')]
	},"$Form#enable");
	
	switch(oArgs+""){
		case "s4bln":
			var aEls = this._form[sKey];
			if (!aEls) return this;
			aEls = aEls.nodeType == 1 ? [ aEls ] : aEls;
			var sFlag = oArgs.bEnable;
			for(var i=0; i<aEls.length; i++){
				aEls[i].disabled = !sFlag;
			}
			return this;
			
		case "s4obj":
			sKey = oArgs.oObj;
			var self = this;
			for (var k in sKey) {
				if (sKey.hasOwnProperty(k)) {
					self.enable(k, sKey[k]);
				}
			}
			return this;
			
		case "g":
			var aEls = this._form[sKey];
			if (!aEls) return this;
			aEls = aEls.nodeType == 1 ? [ aEls ] : aEls;
			
			var bEnabled = true;
			for(var i=0; i<aEls.length; i++){
				if(aEls[i].disabled){
					bEnabled=false;
					break;
				}
			}
			return bEnabled;
			
	}
};
//-!jindo.$Form.prototype.enable end!-//

//-!jindo.$Form.prototype.value start(jindo.$A.prototype.has)!-//
/**
 {{value}}
 */
/**
 {{value2}}
 */
jindo.$Form.prototype.value = function(sKey) {
	//-@@$Form.value-@@//
	
	var oArgs = g_checkVarType(arguments, {
		's4str' : [ 'sKey:String+', 'vValue:Variant' ],
		's4obj' : [ jindo.$Jindo._F('oObj:Hash+')],
		'g' : [ 'sKey:String+']
	},"$Form#value");
	
	var elOption,
		sValue;
	
	if(oArgs+"" == "s4obj"){
		var self = this;
		sKey = oArgs.oObj;
		for(var k in sKey){
			if (sKey.hasOwnProperty(k)) {
				self.value(k, sKey[k]);
			}
		} 
		return this;	
	}
	
	var aEls = this._form[sKey];
	if (!aEls) throw new jindo.$Error(sKey+jindo.$Except.NONE_ELEMENT,"$Form#value");
	
	aEls = aEls.nodeType == 1 ? [ aEls ] : aEls;
	switch(oArgs+""){
		case "s4str":
			var sVal = oArgs.vValue;
			var nLen = aEls.length;
			for(var i=0; i<nLen; i++){
				var o = aEls[i];
				switch (o.type) {
					case 'radio':
						o.checked = (o.value == sVal);
						break;
					case 'checkbox':
						if(sVal.constructor == Array){
							o.checked = jindo.$A(sVal).has(o.value);
						}else{
							o.checked = (o.value == sVal);
						}
						break;
						
					case 'select-one':
						var nIndex = -1;
						
						for(var i = 0, len = o.options.length; i < len; i++){
							elOption = o.options[i];
							
							if(elOption.value == sVal || elOption.text == sVal){
								nIndex = i;
								continue;
							}
						}
						o.selectedIndex = nIndex;
						
						break;
					
					case 'select-multiple':
						var nIndex = -1;
						
						if(jindo.$Jindo.isArray(sVal)){
							var waVal = jindo.$A(sVal);
							for (var i = 0, len = o.options.length; i < len; i++){
								elOption = o.options[i];
								o.options[i].selected = waVal.has(elOption.value) || waVal.has(elOption.text); 
							}
						}else{
							for(var i = 0, len = o.options.length; i < len; i++){
								elOption = o.options[i];
								
								if(elOption.value == sVal || elOption.text == sVal){
									nIndex = i;
									continue;
								}
							}
							o.selectedIndex = nIndex;
						}
						break;
						
					default:
						o.value = sVal;
						
				}
			}
			
			return this;
			
		case "g":
			var aRet = [];
			var nLen = aEls.length;
			for(var i=0;i<nLen; i++){
				var o = aEls[i];
				switch (o.type) {
				case 'radio':
				case 'checkbox':
					if(o.checked){
						aRet.push(o.value);
					}
					break;
				
				case 'select-one':
					if(o.selectedIndex != -1){
						elOption = o.options[o.selectedIndex];
						sValue = elOption.value == "" ? elOption.text : elOption.value;
						aRet.push(sValue);
					}
					break;
					
				case 'select-multiple':
					if(o.selectedIndex != -1){
						for(var i = 0, len = o.options.length; i < len; i++){
							elOption = o.options[i];
							if(elOption.selected){
								sValue = elOption.value == "" ? elOption.text : elOption.value;
								aRet.push(sValue);
							}
						}
					}
					break;
					
				default:
					aRet.push(o.value);
					
				}
				
			}
			
			return aRet.length > 1 ? aRet : aRet[0];
	}
};
//-!jindo.$Form.prototype.value end!-//

//-!jindo.$Form.prototype.submit start!-//
/**
 {{submit}}
 */
jindo.$Form.prototype.submit = function(sTargetName, fValidation) {
	//-@@$Form.submit-@@//
	var oArgs = g_checkVarType(arguments, {
		'voi' : [],
		'4str' : [ 'sTargetName:String+'],
		'4fun' : [ 'fValidation:Function+'],
		'4fun2' : [ 'sTargetName:String+',"fValidation:Function+"]
	},"$Form#submit");
	
	var sOrgTarget = null;
	switch(oArgs+""){
		case "4str":
			sOrgTarget = this._form.target;
			this._form.target = oArgs.sTargetName;
			break;
		case "4fun":
		case "4fun2":
			if(!oArgs.fValidation.call(this,this._form)) return this;
			if(oArgs+"" == "4fun2"){
				sOrgTarget = this._form.target;
				this._form.target = oArgs.sTargetName;
			}
			
			
	}
	this._form.submit();
	if (!jindo.$Jindo.isNull(sOrgTarget)) this._form.target = sOrgTarget;
	return this;
};
//-!jindo.$Form.prototype.submit end!-//

//-!jindo.$Form.prototype.reset start!-//
/**
 {{reset}}
 */
jindo.$Form.prototype.reset = function(fValidation) {
	//-@@$Form.reset-@@//
	var oArgs = g_checkVarType(arguments, {
		'4voi' : [ ],
		'4fun' : [ 'fValidation:Function+']
	},"$Form#reset");
	
	if(oArgs+"" == "4fun") if(!fValidation.call(this,this._form)) return this;
	
	this._form.reset();
	return this;
	
};
//-!jindo.$Form.prototype.reset end!-//
