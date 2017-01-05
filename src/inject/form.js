/**
 {{title}}
 */

//-!jindo.$Form start!-//
/**
 {{constructor}}
 */
jindo.$Form = function (el) {
	
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);
	
	el = jindo.$(el);
	
	if (!el.tagName || el.tagName.toUpperCase() != 'FORM') throw new Error('The element should be a FORM element');
	this._form = el;
}
//-!jindo.$Form end!-//

//-!jindo.$Form.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$Form.prototype.$value = function() {
	
	return this._form;
};
//-!jindo.$Form.prototype.$value end!-//

//-!jindo.$Form.prototype.serialize start(jindo.$H.prototype.toQueryString)!-//
/**
 {{serialize}}
 */
jindo.$Form.prototype.serialize = function() {
	
 	var self = this;
 	var oRet = {};
 	
 	var nLen = arguments.length;
 	var fpInsert = function(sKey) {
 		var sVal = self.value(sKey);
 		if (typeof sVal != 'undefined') oRet[sKey] = sVal;
 	};
 	
 	if (nLen == 0) {
 		var len = this._form.elements.length;
 		for(var i=0; i<len; i++){
 			var o = this._form.elements[i];
 			if(o.name) fpInsert(o.name);
 		}		
	}else{
		for (var i = 0; i < nLen; i++) {
			fpInsert(arguments[i]);
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
	
	if (arguments.length > 0)
		return this._form[sKey];
	
	return this._form.elements;
	
};
//-!jindo.$Form.prototype.element end!-//

//-!jindo.$Form.prototype.enable start!-//
/**
 {{enable}}
 */
jindo.$Form.prototype.enable = function() {
	
	var sKey = arguments[0];

	if (typeof sKey == 'object') {
		
		var self = this;
		for(var k in sKey)self.enable(k, sKey[k]);
		return this;
		
	}
	
	var aEls = this._form[sKey];
	if (!aEls) return this;
	aEls = aEls.nodeType == 1 ? [ aEls ] : aEls;
	
	if (arguments.length < 2) {
		
		var bEnabled = true;
		for(var i=0; i<aEls.length; i++){
			if(aEls[i].disabled){
				bEnabled=false;
				break;
			}
		}
		return bEnabled;
		
	} else { // setter
		
		var sFlag = arguments[1];
		for(var i=0; i<aEls.length; i++){
			aEls[i].disabled = !sFlag;
		}
		
		return this;
		
	}
	
};
//-!jindo.$Form.prototype.enable end!-//

//-!jindo.$Form.prototype.value start(jindo.$A.prototype.has)!-//
/**
 {{value}}
 */
jindo.$Form.prototype.value = function(sKey) {
	
	if (typeof sKey == 'object') {		
		var self = this;
		for(var k in sKey) self.value(k, sKey[k]);
		return this;		
	}
	
	var aEls = this._form[sKey];
	if (!aEls) throw new Error('{{value_1}}');
	aEls = aEls.nodeType == 1 ? [ aEls ] : aEls;
	
	if (arguments.length > 1) { // setter
		
		var sVal = arguments[1];
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
					for (var i = 0, len = o.options.length; i < len; i++){
						if (o.options[i].value == sVal) nIndex = i;
					}
					o.selectedIndex = nIndex;
	
					break;
				
				case 'select-multiple':
					var nIndex = -1;
					if(sVal.constructor == Array){
						var waVal = jindo.$A(sVal);
						for (var i = 0, len = o.options.length; i < len; i++){
							o.options[i].selected = waVal.has(o.options[i].value); 
						}
					}else{
						for (var i = 0, len = o.options.length; i < len; i++){
							if (o.options[i].value == sVal) nIndex = i;
						}
						o.selectedIndex = nIndex;
					}
					break;
					
				default:
					o.value = sVal;
					break;
			}
		}
		
		return this;
	}

	// getter
	
	var aRet = [];
	var nLen = aEls.length;
	for(var i=0;i<nLen; i++){
		var o = aEls[i];
		switch (o.type) {
		case 'radio':
		case 'checkbox':
			if (o.checked) aRet.push(o.value);
			break;
		
		case 'select-one':
			if (o.selectedIndex != -1) aRet.push(o.options[o.selectedIndex].value);
			break;
		case 'select-multiple':
			if (o.selectedIndex != -1){
				for (var i = 0, len = o.options.length; i < len; i++){
					if (o.options[i].selected) aRet.push(o.options[i].value);
				}
			}
			break;
		default:
			aRet.push(o.value);
			break;
		}
		
	}
	
	return aRet.length > 1 ? aRet : aRet[0];
	
};
//-!jindo.$Form.prototype.value end!-//

//-!jindo.$Form.prototype.submit start!-//
/**
 {{submit}}
 */
jindo.$Form.prototype.submit = function(sTargetName, fValidation) {
	
	var sOrgTarget = null;
	
	if (typeof sTargetName == 'string') {
		sOrgTarget = this._form.target;
		this._form.target = sTargetName;
	}
	
	if(typeof sTargetName == 'function') fValidation = sTargetName;
	
	if(typeof fValidation != 'undefined'){
		if(!fValidation(this._form)) return this;	
	}	
	
	this._form.submit();
	
	if (sOrgTarget !== null)
		this._form.target = sOrgTarget;
	
	return this;
	
};
//-!jindo.$Form.prototype.submit end!-//

//-!jindo.$Form.prototype.reset start!-//
/**
 {{reset}}
 */
jindo.$Form.prototype.reset = function(fValidation) {
	
	if(typeof fValidation != 'undefined'){
		if(!fValidation(this._form)) return this;	
	}	
	
	this._form.reset();
	return this;
	
};
//-!jindo.$Form.prototype.reset end!-//
