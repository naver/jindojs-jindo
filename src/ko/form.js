/**
 
 * @fileOverview $Form 생성자 및 메서드를 정의한 파일
 * @name form.js
 * @author Hooriza
  
 */

/**
 
 * @class $Form() 객체는 &lt;form&gt; 요소와 자식 요소를 제어하는 기능을 제공한다.
 * @constructor
 * @description $Form() 객체를 생성한다.
 * @param {Variant} elForm	&lt;form&gt; 요소(Element), 혹은 &lt;form&gt; 요소의 ID(String). 만약 동일한 ID를 사용한 &lt;form&gt; 요소가 둘 이상이면 먼저 나오는 요소를 감싼 $Form() 객체를 반환한다.
  
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
 
 * @description $value() 메서드는 원본 &lt;form&gt; 요소를 반환한다
 * @return {Element} 원본 &lt;form&gt; 요소
 * @example
var el = $('<form>');
var form = $Form(el);

alert(form.$value() === el); // true
  
 */
jindo.$Form.prototype.$value = function() {
	return this._form;
};

/**
 
 * @description serialize() 메서드는 &lt;form&gt; 요소의 특정 또는 전체 입력 요소를 쿼리스트링(Query String) 형태로 반환한다. serialize() 메서드를 사용할 때 파라미터를 입력하지 않으면 &lt;form&gt; 요소의 하위의 모든 입력 요소를 쿼리스트링으로 반환하고 파라미터를 입력하면 지정한 이름과 같은 name 속성을 가지는 입력 요소를 쿼리스트링 형태로 반환한다.
 * @param {String} [sName1] 첫 번째 입력 요소의 이름(name).
 * @param {String} […] …
 * @param {String} [sNameN] N 번째 입력 요소의 이름(name).
 * @return {String} 쿼리스트링 형태로 변환한 문자열.
 * @see <a href="http://en.wikipedia.org/wiki/Querystring">Query String</a> - Wikipedia
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
	// ONE=1&TWO=2&THREE=3_2&FOUR=4_3

	var str = form.serialize('ONE', 'THREE');
	// ONE=1&THREE=3_2'
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
 
 * @description element() 메서드는 특정 또는 전체 입력 요소를 반환한다. 파라미터에 가져올 입력 요소의 이름(name)을 지정할 수 있다. 또한, 파라미터를 생략하면 모든 입력 요소의 값을 가져온다.
 * @param {String} [sKey] 입력 요소의 이름(name).
 * @return {Variant} 입력 요소(Element) 또는 입력 요소를 가진 배열(Array).
  
 */
jindo.$Form.prototype.element = function(sKey) {

	if (arguments.length > 0)
		return this._form[sKey];
	
	return this._form.elements;
	
};

/**
 
 * @description enable() 메서드는 입력 요소의 활성화 여부를 검사하거나 설정한다. 파라미터에 입력 요소의 이름(name)만 입력하면 해당 요소의 활성화 여부를 확인할 수 있다. 입력 요소의 이름과 함께 true 값을 입력하면 해당 요소를 활성화하고 false를 입력하면 비활성화한다. 또한, 한번에 여러 요소의 활성화 상태를 변경하기 위해 객체를 입력할 수도 있다.
 * @param {String} sName 입력 요소의 이름. 이 파라미터로 여러 입력 요소의 활성화 여부를 지정한 객체를 입력할 수 있다. 이와 관련한 내용은 예제를 참고한다.
 * @param {Boolean} [bEnable] 활성화 여부.
 * @return {Variant} 입력 요소의 활성화 여부를 나타내는 Boolean 값 또는 입력 요소의 활성화 여부를 반영한 $Form() 객체.
 * @example

<form id="TEST">
	<input name="ONE" disabled="disabled" type="text" />
	<input name="TWO" type="checkbox" />
</form>

<script type="text/javascript">
	var form = $Form('TEST');

	form.enable('ONE');	// false

	form.enable('TWO', false);
	form.enable('TWO');	// false

	form.enable({
		'ONE' : true,
		'TWO' : false
	});
	
	form.enable('ONE');	// true
	form.enable('TWO');	// false
	
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
 
 * @description value() 메서드는 &lt;form&gt; 요소의 값을 얻거나 설정한다. 파라미터에 입력 요소의 이름(name)만 입력하면 해당 요소의 값을 확인할 수 있다. 입력 요소의 이름과 함께 값을 지정하면 해당 요소의 값을 변경한다. 또한, 한번에 여러 요소의 값을 변경하기 위해 객체를 입력할 수도 있다.
 * @param {String} sName 입력 요소의 이름. 이 파라미터로 여러 입력 요소의 값을 지정한 객체를 입력할 수 있다. 이와 관련한 내용은 예제를 참고한다.
 * @param {String} [vValue] 입력 요소에 지정할 값.
 * @return {Variant} 입력 요소의 값(String) 또는 입력 요소의 값을 반영한 $Form() 객체.
 * @example

<form id="TEST">
	<input name="ONE" value="1" type="text" />
	<input name="TWO" type="checkbox" />
</form>
<script type="text/javascript">
	var form = $Form('TEST');

	form.value('ONE');	// 1
	
	form.value('TWO');	// undefined

	form.value('TWO', 2);
	form.value('TWO');	//2

	form.value({
		'ONE' : '1111',
		'TWO' : '2'
	});
	
	form.value('ONE');	// 1111
	form.value('ONE');	// 2
</script>
  
 */
jindo.$Form.prototype.value = function(sKey) {
	
	if (typeof sKey == 'object') {
		
		var self = this;
		jindo.$H(sKey).forEach(function(bFlag, sKey) { self.value(sKey, bFlag); });
		return this;
		
	}
	
	var aEls = this.element(sKey);
	if (!aEls) throw new Error('엘리먼트는 존재하지 않습니다.');
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
 
 * @description submit() 메서드는 &lt;form&gt; 요소의 데이터를 제출(submit)한다. submit() 메서드에 파라미터를 지정하면 &lt;form&gt; 요소의 target 속성을 무시하고 지정한 전송 대상으로 정보를 전송한다. 이때 기존 &lt;form&gt; 요소의 target 속성을 변경하지 않는다. 또한 파라미터로 함수를 입력할 수 있으며 해당 함수가 true 값을 반환하면 데이터를 제출한다. 이 함수를 사용하여 데이터를 전송하기 전에 검증할 수 있다.
 * @param {String} [sTargetName] 전송 대상. 이 파라미터를 생략하면 &lt;form&gt; 요소의 target 속성에 지정된 대상으로 정보를 전송한다.
 * @param {String} [fValidation] &lt;form&gt; 요소의 데이터를 검증할 함수. 이 함수의 파라미터로 $Form() 객체가 감싸고 있는 원본 &lt;form&gt; 요소가 입력된다.
 * @return {$Form} 데이터를 제출한 $Form() 객체.
 * @example
var form = $Form(el);
form.submit();
form.submit('foo');

* @example
// fValidation 파라미터 사용한 경우
var form = $Form(el);
form.submit("target_name");

form.submit(function(){
	if($("test").value.length > 0) {
		return true; //true를 리턴하면 submit() 수행
	}
	
	return false; //false를 리턴하면 submit() 수행하지 않음
});

form.submit("target_name", function(){
	if($("test").value.length > 0) {
		return true;
	}
	
	return false;
});
  
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
 
 * @description reset() 메서드는 &lt;form&gt; 요소를 초기화(reset)한다. 파라미터로 함수를 입력할 수 있으며 해당 함수가 true 값을 반환하면 &lt;form&gt; 요소를 초기화한다.
 * @param {String} [fValidation] &lt;form&gt; 요소의 데이터를 초기화하기 전에 실행할 함수.
 * @return {$Form} 초기화한 $Form() 객체.
 * @example
var form = $Form(el);
form.reset(); 

 * @example
// fValidation 파라미터 사용한 경우
var form = $Form(el);

form.submit(function(){
	return confirm("초기화하시겠습니까?");
});
  
 */
jindo.$Form.prototype.reset = function(fValidation) {
	
	if(typeof fValidation != 'undefined'){
		if(!fValidation(this._form)) return this;	
	}	
	
	this._form.reset();
	return this;
	
};
