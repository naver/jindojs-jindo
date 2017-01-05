/**
 
 * @fileOverview A file to define the constructor and methods of $Form
 * @name form.js
  
 */

/**
 
 * Creates and returns the $Form object.
 * @class The $Form class controls form elements and their child elements.
 * @param {Element | String} el	A form element or the id of a form element. Returns the element that comes first if the same id is used in two or more elements.
 * @constructor
 * @author Hooriza
  
 */
jindo.$Form = function (el) {
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);
	
	el = jindo.$(el);
	
	if (!el.tagName || el.tagName.toUpperCase() != 'FORM') throw new Error('The element should be a FORM element');
	this._form = el;
}

/**
 
 * The $value method returns the original form element that wrapped.
 * @return {HTMLElement} A form element.
 * @example

var el = $('<form>');
var form = $Form(el);

alert(form.$value() === el); // true
  
 */
jindo.$Form.prototype.$value = function() {
	return this._form;
};

/**
 
 * The serialize method returns a specific input element or all input elements of an element as a string.
 * @param {Mixed} The Mixed parameter can be omitted, or one or more parameters can be set.
 * <ol>
 *	<li>Returns all the values of the form elements and its child elements as a query-type string if the parameters are not specified.</li>
 *	<li>Searches and returns an element that have a name attribute that matches with the given string if a string is specified as a parameter.</li>
 *	<li>Searches all elements that have a name attribute that matches with the given string and returns the values as a query string if two or more strings are specified as a parameter.</li>
 * </ol>
 * @return {String} The element and its value that were converted into a query string.
 * @example

<form id="TEST">
	<input name="ONE" value="1" type="text" />
	<input name="TWO" value="2" checked="checked" type="checkbox" />
	<input name="THREE" value="3_1" type="radio" />
	<input name="THREE" value="3_2" checked="checked" type="radio" />
	<input name="THREE" value="3_3" type="radio" />
	<select name="FOUR">
		<option value="4_1">..</option>
		<option value="4_2">..</option>
		<option value="4_3" selected="selected">..</option>
	</select>
</form>
<script type="text/javascript">
	var form = $Form('TEST');

	var allstr = form.serialize();
	alert(allstr == 'ONE=1&TWO=2&THREE=3_2&FOUR=4_3'); // true

	var str = form.serialize('ONE', 'THREE');
	alert(str == 'ONE=1&THREE=3_2'); // true
</script>
  
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
		jindo.$A(this.element()).forEach(function(o) { if (o.name) fpInsert(o.name); });
	}else{
		for (var i = 0; i < nLen; i++) {
			fpInsert(arguments[i]);
		}
	}
 		
	return jindo.$H(oRet).toQueryString();
	
};

/**
 
 * The element method returns a specific input element or all input elements.
 * @param {String} sKey The name string of a desired input element; all input elements are returned in an array if omitted.
 * @return {HTMLElement | Array} An input element
  
 */
jindo.$Form.prototype.element = function(sKey) {

	if (arguments.length > 0)
		return this._form[sKey];
	
	return this._form.elements;
	
};

/**
 
 * The enable method gets or sets the active status of an input element.
 * @param {Mixed} mixed The enable method works in a different manner depending on the number and type of the parameters. For details, see information described below:
 * <ol>
 * <li>Searches elements that have a name attribute that matches with the given string if a string is specified as a parameter. It returns whether it is active of the element if it was founded.</li>
 * <li>Searches elements that have a name attribute that matches with the given string if a string and a Boolean value are specified as a parameter. Then, it sets whether it is active.</li>
 * <li>An object can be used as a parameter. The object searches elements in which the attribute value matches with a name. Then, it sets whether it is active depending on the value.</li>
 * </ol>
 * @return {Boolean|$Form} Returns the $Form object that gets or sets whether it is active.
 * @example

<form id="TEST">
	<input name="ONE" disabled="disabled" type="text" />
	<input name="TWO" type="checkbox" />
</form>
<script type="text/javascript">
	var form = $Form('TEST');

	var one_enabled = form.enable('ONE');
	alert(one_enabled === false); // true

	form.enable('TWO', false);

	form.enable({
		'ONE' : true,
		'TWO' : false
	});
</script>
  
 */
jindo.$Form.prototype.enable = function() {
	
	var sKey = arguments[0];

	if (typeof sKey == 'object') {
		
		var self = this;
		jindo.$H(sKey).forEach(function(bFlag, sKey) { self.enable(sKey, bFlag); });
		return this;
		
	}
	
	var aEls = this.element(sKey);
	if (!aEls) return this;
	aEls = aEls.nodeType == 1 ? [ aEls ] : aEls;
	
	if (arguments.length < 2) {
		
		var bEnabled = true;
		jindo.$A(aEls).forEach(function(o) { if (o.disabled) {
			bEnabled = false;
			jindo.$A.Break();
		}});
		return bEnabled;
		
	} else { // setter
		
		var sFlag = arguments[1];
		jindo.$A(aEls).forEach(function(o) { o.disabled = !sFlag; });
		
		return this;
		
	}
	
};

/**
 
 * The value method gets or sets the value of a form element.
 * @param {Mixed} Mixed The specific parameter information is as follows:
 * <ol>
 *  <li>Searches elements that have the same name attribute. Then, it returns the values if a string is specified as a parameter.</li>
 *	<li>If two strings are specified as parameters, it searches an element of which name attribute matches with the first parameter. The searched element value is specified as a second parameter value.</br>checkbox, radio, and selectbox select or deselect elements.</li>
 *	<li>Sets an object that has elements with the 'element name : element value' format as a parameter to specify two or more element values at once.</li>
 * </ol>
 * @return {String|$Form} Returns the specified element value if only element is specified as a parameter. Returns the $Form object if both format element and its value are specified as a parameter.
 * @example

<form id="TEST">
	<input name="ONE" value="1" type="text" />
	<input name="TWO" value="2" type="checkbox" />
</form>
<script type="text/javascript">
	var form = $Form('TEST');

	var one_value = form.value('ONE');
	alert(one_value === '1'); // true

	var two_value = form.value('TWO');
	alert(two_value === undefined); // true

	form.value('TWO', 2);
	alert(two_value === '2'); // true

	form.value({
		'ONE' : '1111',
		'TWO' : '2'
	});
	// form.value('ONE') -> 1111
	// form.value('ONE') -> 2
</script>
  
 */
jindo.$Form.prototype.value = function(sKey) {
	
	if (typeof sKey == 'object') {
		
		var self = this;
		jindo.$H(sKey).forEach(function(bFlag, sKey) { self.value(sKey, bFlag); });
		return this;
		
	}
	
	var aEls = this.element(sKey);
	if (!aEls) throw new Error('The element is not exist.');
	aEls = aEls.nodeType == 1 ? [ aEls ] : aEls;
	
	if (arguments.length > 1) { // setter
		
		var sVal = arguments[1];
		
		jindo.$A(aEls).forEach(function(o) {
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
			
		});
		
		return this;
	}

	// getter
	
	var aRet = [];
	
	jindo.$A(aEls).forEach(function(o) {
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
		
	});
	
	return aRet.length > 1 ? aRet : aRet[0];
	
};

/**
 
 * The submit method submits form data to web.
 * @param {String} sTargetName The name of a window that has a form to submit. If sTargetName is omitted, it is set to a default target.
 * @param {String} fValidation The validation function of a form to submit. The form element is given as a parameter.
 * @return {$Form} The $Form object that submits data
 * @example
var form = $Form(el);
form.submit();
form.submit('foo');
  
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

/**
 
 * The reset method resets a form.
 * @param {String} fValidation The validation function of a form to submit. The form element is given as a parameter.
 * @return {$Form} An initialized $Form object
 * @example
var form = $Form(el);
form.reset(); 
  
 */
jindo.$Form.prototype.reset = function(fValidation) {
	
	if(typeof fValidation != 'undefined'){
		if(!fValidation(this._form)) return this;	
	}	
	
	this._form.reset();
	return this;
	
};
