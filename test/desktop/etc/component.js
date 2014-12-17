/**
 * Core_Component (0.3.3)
 * Core_UIComponent (0.1.2)
 * Core_HTMLComponent (0.2.3)
 * Formatter (0.4.4)
 * Dialog (0.2.1)
 * Rolling (0.4.1)
 * ScrollBar (0.2.4)
 * Tree (0.6.1)
 * TextRange (0.4.5)
 * WatchInput (0.5.5)
 * Timer (0.4.1)
 * LayerPosition (0.2.4)
 * Foggy (0.4.2)
 * Effect (0.4)
 * Transition (0.5.4)
 * DragArea (0.5.5)
 * RolloverArea (0.5.1)
 * LayerManager (0.5.7)
 * RolloverClick (0.1.3)
 * Calendar (0.4.1)
 * Slider (0.4.1)
 * NumberFormatter (0.4.3)
 * BrowseButton (0.4)
 * FileUploader (0.2.3)
 * Clipboard (0.5.3)
 * DataBridge (0.1)
 * AjaxHistory (0.1)
 * Cache (0.1)
 * ModalDialog (0.2)
 * DropArea (0.5.3)
 * LazyLoading (0.1.1)
 * MouseGesture (0.1)
 * CircularRolling (0.4.1)
 * MultipleAjaxRequest (0.2.1)
 * CheckBox (0.5.2)
 * SelectBox (0.2.5)
 * Accordion (0.4)
 * DatePicker (0.6.3)
 * DefaultTextValue (0.2.2)
 * FloatingLayer (0.1.1)
 * NumericStepper (0.1)
 * Pagination (0.4.3)
 * RollingChart (0.2.1)
 * ScrollBox (0.2.1)
 * StarRating (0.3.1)
 * TabControl (0.4.5)
 * DynamicTree (0.2)
 */

/**
 * @fileOverview 컴포넌트에 상속되어 사용되는 Component Core 
 * @author gony, hooriza, senxation
 * @see http://wiki.nhncorp.com/display/lsuit/nhn.Component
 * @version 0.3.3
 */

jindo.Component = jindo.$Class({
	/** @lends jindo.Component.prototype */

	_htEventHandler : null,
	_htOption : null,

	/**
	 * 모든 진도 컴포넌트는 jindo.Component를 상속받아 구현한다.
	 * @class 다른 컴포넌트가 상속해 사용하는 Jindo Component의 Core
	 * @constructs  
	 */
	$init : function() {
		var aInstance = this.constructor.getInstance();
		aInstance.push(this);
		this._htEventHandler = {};
		this._htOption = {};
		this._htOption._htSetter = {};
	},
	
	/**
	 * 옵션값을 설정하거나 가져온다.
	 * attach() 메소드를 사용하지 않고 커스텀이벤트핸들러를 등록할 수 있다.
	 * @param {String} sName 옵션의 이름
	 * @param {String} sValue 옵션의 값
	 * @return {this} 컴포넌트 객체 자신
	 * @example
var MyComponent = $Class({
	method : function() {
		alert(this._option.foo);
	}
}).extend(jindo.Component);

var oInst = new MyComponent();
oInst.option('foo', 123); // 또는 oInst.option({ foo : 123 });
oInst.method(); // 결과 123
	 * @example
//커스텀이벤트핸들러를 등록예제
oInst.option("htCustomEventHandler", {
	test : function(oCustomEvent) {
	
	}
});

//이미 "htCustomEventHandler" 옵션이 설정되어있는 경우에는 무시된다.
oInst.option("htCustomEventHandler", {
	change : function(oCustomEvent) {
	
	}
}); 
	 */
	option : function(sName, vValue) {
		switch (typeof sName) {
			case "undefined" :
				return this._htOption;
			case "string" : 
				if (typeof vValue != "undefined") {
					if (sName == "htCustomEventHandler") {
						if (typeof this._htOption[sName] == "undefined") {
							this.attach(vValue);
						} else {
							return this;
						}
					}
					
					this._htOption[sName] = vValue;
					if (typeof this._htOption._htSetter[sName] == "function") {
						this._htOption._htSetter[sName](vValue);	
					}
				} else {
					return this._htOption[sName];
				}
				break;
			case "object" :
				for(var sKey in sName) {
					if (sKey == "htCustomEventHandler") {
						if (typeof this._htOption[sKey] == "undefined") {
							this.attach(sName[sKey]);
						} else {
							continue;
						}
					}
					
					this._htOption[sKey] = sName[sKey];
					if (typeof this._htOption._htSetter[sKey] == "function") {
						this._htOption._htSetter[sKey](sName[sKey]);	
					}
				}
				break;
		}
		return this;
	},
	
	/**
	 * 옵션의 setter 함수를 설정하거나 가져온다. 
	 * @param {String} sName setter의 이름
	 * @param {Function} fSetter setter 함수
	 * @return {this} 컴포넌트 객체 자신
	 */
	optionSetter : function(sName, fSetter) {
		switch (typeof sName) {
			case "undefined" :
				return this._htOption._htSetter;
			case "string" : 
				if (typeof fSetter != "undefined") {
					this._htOption._htSetter[sName] = jindo.$Fn(fSetter, this).bind();
				} else {
					return this._htOption._htSetter[sName];
				}
				break;
			case "object" :
				for(var sKey in sName) {
					this._htOption._htSetter[sKey] = jindo.$Fn(sName[sKey], this).bind();
				}
				break;
		}
		return this;
	},
	
	/**
	 * 이벤트를 발생시킨다.
	 * @param {Object} sEvent 커스텀이벤트명
	 * @param {Object} oEvent 커스텀이벤트 핸들러에 전달되는 객체.
	 * @return {Boolean} 핸들러의 커스텀이벤트객체에서 stop메소드가 수행되면 false를 리턴
	 * @example
//커스텀 이벤트를 발생시키는 예제
var MyComponent = $Class({
	method : function() {
		this.fireEvent('happened', {
			sHello : 'world',
			sAbc : '123'
		});
	}
}).extend(jindo.Component);

var oInst = new MyComponent().attach({
	happened : function(oCustomEvent) {
		alert(eCustomEvent.sHello + '/' + oCustomEvent.nAbc); // 결과 : world/123
	}
};

<button onclick="oInst.method(event);">Click me</button> 
	 */
	fireEvent : function(sEvent, oEvent) {
		oEvent = oEvent || {};
		var fInlineHandler = this['on' + sEvent],
			aHandlerList = this._htEventHandler[sEvent] || [],
			bHasInlineHandler = typeof fInlineHandler == "function",
			bHasHandlerList = aHandlerList.length > 0;
			
		if (!bHasInlineHandler && !bHasHandlerList) {
			return true;
		}
		aHandlerList = aHandlerList.concat(); //fireEvent수행시 핸들러 내부에서 detach되어도 최초수행시의 핸들러리스트는 모두 수행
		
		oEvent.sType = sEvent;
		if (typeof oEvent._aExtend == 'undefined') {
			oEvent._aExtend = [];
			oEvent.stop = function(){
				if (oEvent._aExtend.length > 0) {
					oEvent._aExtend[oEvent._aExtend.length - 1].bCanceled = true;
				}
			};
		}
		oEvent._aExtend.push({
			sType: sEvent,
			bCanceled: false
		});
		
		var aArg = [oEvent], 
			i, nLen;
			
		for (i = 2, nLen = arguments.length; i < nLen; i++){
			aArg.push(arguments[i]);
		}
		
		if (bHasInlineHandler) {
			fInlineHandler.apply(this, aArg);
		}
	
		if (bHasHandlerList) {
			var fHandler;
			for (i = 0, fHandler; (fHandler = aHandlerList[i]); i++) {
				fHandler.apply(this, aArg);
			}
		}
		
		return !oEvent._aExtend.pop().bCanceled;
	},

	/**
	 * 커스텀 이벤트 핸들러를 등록한다.
	 * @param {Object} sEvent
	 * @param {Object} fHandlerToAttach
	 * @return {this} 컴포넌트 객체 자신
	 * @example
//이벤트 등록 방법 예제
//아래처럼 등록하면 appear 라는 사용자 이벤트 핸들러는 총 3개가 등록되어 해당 이벤트를 발생시키면 각각의 핸들러 함수가 모두 실행됨.
//attach 을 통해 등록할때는 이벤트명에 'on' 이 빠지는 것에 유의.
function fpHandler1(oEvent) { .... };
function fpHandler2(oEvent) { .... };

var oInst = new MyComponent();
oInst.onappear = fpHandler1; // 직접 등록
oInst.attach('appear', fpHandler1); // attach 함수를 통해 등록
oInst.attach({
	appear : fpHandler1,
	more : fpHandler2
});
	 */
	attach : function(sEvent, fHandlerToAttach) {
		if (arguments.length == 1) {

			jindo.$H(arguments[0]).forEach(jindo.$Fn(function(fHandler, sEvent) {
				this.attach(sEvent, fHandler);
			}, this).bind());
		
			return this;
		}

		var aHandler = this._htEventHandler[sEvent];

		if (typeof aHandler == 'undefined'){
			aHandler = this._htEventHandler[sEvent] = [];
		}

		aHandler.push(fHandlerToAttach);

		return this;
	},
	
	/**
	 * 커스텀 이벤트 핸들러를 해제한다.
	 * @param {Object} sEvent
	 * @param {Object} fHandlerToDetach
	 * @return {this} 컴포넌트 객체 자신
	 * @example
//이벤트 해제 예제
oInst.onappear = null; // 직접 해제
oInst.detach('appear', fpHandler1); // detach 함수를 통해 해제
oInst.detach({
	appear : fpHandler1,
	more : fpHandler2
});
	 */
	detach : function(sEvent, fHandlerToDetach) {
		if (arguments.length == 1) {
			jindo.$H(arguments[0]).forEach(jindo.$Fn(function(fHandler, sEvent) {
				this.detach(sEvent, fHandler);
			}, this).bind());
		
			return this;
		}

		var aHandler = this._htEventHandler[sEvent];
		if (aHandler) {
			for (var i = 0, fHandler; (fHandler = aHandler[i]); i++) {
				if (fHandler === fHandlerToDetach) {
					aHandler = aHandler.splice(i, 1);
					break;
				}
			}
		}

		return this;
	},
	
	/**
	 * 등록된 모든 커스텀 이벤트 핸들러를 해제한다.
	 * @param {Object} sEvent
	 * @return {this} 컴포넌트 객체 자신
	 */
	detachAll : function(sEvent) {
		var aHandler = this._htEventHandler;
		
		if (arguments.length) {
			
			if (typeof aHandler[sEvent] == 'undefined') {
				return this;
			}
	
			delete aHandler[sEvent];
	
			return this;
		}	
		
		for (var o in aHandler) {
			delete aHandler[o];
		}
		return this;				
	}
});

/**
 * 다수의 컴포넌트를 일괄 생성하는 Static Method
 * @param {Object} aObject
 * @param {Object} oOption
 * @return {Array} 생성된 컴포넌트 객체 배열
 * @example
var Instance = jindo.Component.factory(
	cssquery('li'),
	{
		foo : 123,
		bar : 456
	}
);
 */
jindo.Component.factory = function(aObject, oOption) {
	var aReturn = [],
		oInstance;

	if (typeof oOption == "undefined") {
		oOption = {};
	}
	
	for(var i = 0, el; (el = aObject[i]); i++) {
		oInstance = new this(el, oOption);
		aReturn[aReturn.length] = oInstance;
	}

	return aReturn;
};

/**
 * 컴포넌트의 생성된 인스턴스를 리턴한다.
 * @return {Array} 생성된 인스턴스에 배열
 */
jindo.Component.getInstance = function(){
	if (typeof this._aInstance == "undefined") {
		this._aInstance = [];
	}
	return this._aInstance;
};
/**
 * @fileOverview UI Component에 상속되어 사용되는 Jindo Component의 Core
 * @author senxation
 * @version 0.1.2
 */

jindo.UIComponent = jindo.$Class({
	/** @lends jindo.UIComponent.prototype */
		
	/**
	 * UI 컴포넌트를 생성한다.
	 * @constructs
	 * @class UI Component에 상속되어 사용되는 Jindo Component의 Core
	 * @extends jindo.Component
	 */
	$init : function() {
		this._bIsActivating = false; //컴포넌트의 활성화 여부
	},

	/**
	 * 컴포넌트의 활성여부를 가져온다.
	 * @return {Boolean}
	 */
	isActivating : function() {
		return this._bIsActivating;
	},

	/**
	 * 컴포넌트를 활성화한다.
	 * _onActivate 메소드를 수행한다.
	 * @return {this}
	 * @remark 반드시 상속받는 클래스에 _onActivate 메소드가 정의되어야 한다.
	 */
	activate : function() {
		if (this.isActivating()) {
			return this;
		}
		this._bIsActivating = true;
		
		if (arguments.length > 0) {
			this._onActivate.apply(this, arguments);
		} else {
			this._onActivate();
		}
				
		return this;
	},
	
	/**
	 * 컴포넌트를 비활성화한다.
	 * _onDeactivate 메소드를 수행한다.
	 * @return {this}
	 * @remark 반드시 상속받는 클래스에 _onDeactivate 메소드가 정의되어야 한다.
	 */
	deactivate : function() {
		if (!this.isActivating()) {
			return this;
		}
		this._bIsActivating = false;
		
		if (arguments.length > 0) {
			this._onDeactivate.apply(this, arguments);
		} else {
			this._onDeactivate();
		}
		
		return this;
	}
}).extend(jindo.Component);	
/**
 * @fileOverview HTML 컴포넌트에 상속되어 사용되는 jindo.UIComponent.js
 * @author gony, hooriza, senxation
 * @version 0.2.3
 */

jindo.HTMLComponent = jindo.$Class({
	/** @lends jindo.HTMLComponent.prototype */
	sTagName : "",
	
	/**
	 * HTML 컴포넌트를 생성한다.
	 * @constructs
	 * @class HTML 컴포넌트에 상속되어 사용되는 jindo.UIComponent.js
	 * @extends jindo.UIComponent
	 */
	$init : function() {
	},
	
	/**
	 * 컴포넌트를 새로 그려준다.
	 * @remark 상속받는 클래스는 반드시 _onPaint() 메소드가 정의되어야 한다.
	 * @return {this}
	 */
	paint : function() {
		this._onPaint();
		return this;
	}
}).extend(jindo.UIComponent);

/**
 * 다수의 컴포넌트의 paint 메소드를 일괄 수행하는 Static Method
 */
jindo.HTMLComponent.paint = function() {
	var aInstance = this.getInstance();
	for (var i = 0, oInstance; (oInstance = aInstance[i]); i++) {
		oInstance.paint();
	}
};
/**
 * @fileOverview Text Input의 값을 특정한 형식으로 변환하는 컴포넌트
 * @author hooriza, modified by senxation
 * @version 0.4.4
 */
jindo.Formatter = jindo.$Class({
	/** @lends jindo.Formatter.prototype */
	
	_aMarks : [ '\u0000', '\uFFFF' ],
	
	_sPrevValue : null,
	_oTextRange : null,
	_bFakeFocus : false,
	
	/**
	 * Formatter 컴포넌트를 생성한다.
	 * Formatter 컴포넌트는 입력 컨트롤 (input[type=text], textarea)의 값을 특정한 형식으로 변환한다.
	 * @constructs
	 * @class Text Input의 값을 특정한 형식으로 변환하는 컴포넌트
	 * @extends jindo.UIComponent
	 * @requires jindo.TextRange
	 * @requires jindo.WatchInput
	 * @param {HTMLElement} el
	 * @param {HashTable} htOption 옵션 객체
	 * @example 
var oFormatter = new jindo.Formatter(jindo.$('foo'), {
	bPaintOnload : true, //로드시에 paint() 수행여부
	bActivateOnload : true, //로드시에 activate() 수행여부
	WatchInput : { //WatchInput에 적용될 옵션
		nInterval : 100, //Check할 간격 (Except IE)
		bPermanent : true, //focus/blur와 상관없이 항상 동작하도록 설정
		bActivateOnload : false //로드시에 activate() 수행여부. 시작 시점은 직접 지정
	} 
}).attach({
	focus : function(oCustomEvent) {
		//입력 컨트롤에 focus되었을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elInput : (HTMLElement) 입력 컨트롤 엘리먼트
		//}
	},
	beforeChange : function(oCustomEvent) {
		//입력된 값이 정해진 형식으로 변경되기 전에 발생 
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elInput : (HTMLElement) 입력 컨트롤 엘리먼트
		//	sText : (String) 입력 컨트롤의 값
		//	sStartMark : (String) 캐럿의 시작위치를 계산하기 위한 임시 문자  
		//	sEndMark : (String) 캐럿의 마지막위치를 계산하기 위한 임시 문자
		//} 
	},
	change : function(oCustomEvent) {
		//입력된 값이 정해진 형식으로 변경된 후 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elInput : (HTMLElement) 입력 컨트롤 엘리먼트
		//}
	},
	blur : function(oCustomEvent) {
		//입력 컨트롤이 blur되었을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elInput : (HTMLElement) 입력 컨트롤 엘리먼트
		//}
	}
});
	 */
	$init : function(el, htOption) {
		this._el = jindo.$(el);
		this.option({
			bPaintOnload : true, //로드시에 paint() 수행여부
			bActivateOnload : true, //로드시에 activate() 수행여부
			WatchInput : { //WatchInput에 적용될 옵션
				nInterval : 100, //Check할 간격 (Except IE)
				bPermanent : true, //focus/blur와 상관없이 항상 동작하도록 설정
				bActivateOnload : false //로드시에 activate() 수행여부. 시작 시점은 직접 지정
			} 
		});
		this.option(htOption || {});
		
		var self = this;
		this._wfRealBlur = jindo.$Fn(this._realBlur, this);
		this._wfRealFocus = jindo.$Fn(this._realFocus, this);
		this._oTextRange = new jindo.TextRange(el);
		this._oWatchInput = new jindo.WatchInput(el, this.option("WatchInput")).attach({
			change : function(oCustomEvent) {
				//change이벤트 발생후에는 항상 setCompareValue가 실행되므로 setTimeout으로 우회
				setTimeout(function() { 
					self.paint(); 
				}, 1);
			}
		});
		
		if (this.option("bPaintOnload")) {
			setTimeout(function() { 
				self.paint(); 
			}, 1);
		}
		if (this.option("bActivateOnload")) {
			this.activate();		
		}
	},
	
	/**
	 * 사용된 jindo.WatchInput 컴포넌트의 인스턴스를 리턴한다.
	 * return {jindo.WatchInput}
	 */
	getWatchInput : function() {
		return this._oWatchInput;
	},
	
	_splice : function(sStr, nIndex, nHowMany, sInsert) {
		return sStr.slice(0, nIndex) + sInsert + sStr.slice(nIndex + nHowMany);
	},
	
	/**
	 * Text Input의 값을 설정한다.
	 * 값이 설정된 후 paint()가 수행되며 정해진 형식으로 변환된다.
	 * @param {String} s
	 * @return {this}
	 */
	setValue : function(s) {
		this._el.value = s;
		this.paint();
		return this;
	},
	
	/**
	 * Formatter 컴포넌트를 수행한다.
	 * Text Input에 입력이 있는 경우 beforeChange 이벤트 발생. 값이 바뀌었을때 change 이벤트가 발생한다.
	 * @return {this} 
	 */
	paint : function() {
		var el = this._el,
			oTextRange = this._oTextRange,
			aMark = this._aMarks,
			sText = el.value.toString(),
			bFocus = oTextRange.hasFocus(),
			aSel,
			htParam;
		
		if (bFocus) {
			aSel = [ -1, -1 ];
			try { 
				aSel = oTextRange.getSelection();
			} catch(e) { }
			
			sText = this._splice(this._splice(sText, aSel[1], 0, aMark[1]), aSel[0], 0, aMark[0]);
		}
		
		htParam = { 
			elInput : el, 
			sText : sText, 
			sStartMark : aMark[0], 
			sEndMark : aMark[1] 
		};
		
		if (this.fireEvent('beforeChange', htParam)) {
			var sOutput = htParam.sText;
			
			if (bFocus) {
				var nPos = sOutput.indexOf(aMark[0]);
				if (nPos > -1) {
					sOutput = this._splice(sOutput, nPos, 1, '');
				}
				
				aSel = [nPos];
				aSel[1] = sOutput.indexOf(aMark[1]);
				if (aSel[1] > -1) {
					sOutput = this._splice(sOutput, aSel[1], 1, '');
				}

				var self = this;				
				setTimeout(function(){
					self._bFakeFocus = true;
					el.blur(); //opera 10.10의 경우 blur() focus()를 수행해도 focus 먼저 발생하기때문에 순서대로 수행되도록 수정
				}, 1);
				
				setTimeout(function(){
					self._oWatchInput.setInputValue(sOutput);
					el.focus();
					try {
						oTextRange.setSelection(aSel[0], aSel[1]);
					} catch(e) {}
					self.fireEvent('change', {
						elInput: el
					});
				}, 2);
				
				setTimeout(function(){					
					self._bFakeFocus = false;
				}, 20);
			} else {
				this._oWatchInput.setInputValue(sOutput);
				this.fireEvent('change', {
					elInput: el
				});
			}
		}
		
		return this;
	},
	
	_realBlur : function() {
		if (!this._bFakeFocus) {
			this.getWatchInput().stop();
			this.fireEvent("blur", {
				elInput : this._el
			});
		}
	},
	
	_realFocus : function() {
		if (!this._bFakeFocus) {
			this.getWatchInput().start(true);
			this.fireEvent("focus", {
				elInput : this._el
			});
		}
	},
	
	_onActivate : function() {
		this._wfRealBlur.attach(this._el, "blur");
		this._wfRealFocus.attach(this._el, "focus");
	},
	
	_onDeactivate : function() {
		this._wfRealBlur.detach(this._el, "blur");
		this._wfRealFocus.detach(this._el, "focus");
	}
}).extend(jindo.UIComponent);
/**
 * @fileOverview 다이얼로그 레이어
 * @author senxation
 * @version 0.2.1
 */

jindo.Dialog = jindo.$Class({
	/** @lends jindo.Dialog.prototype */
		
	/**
	 * Dialog 컴포넌트를 생성한다.
	 * @constructs
	 * @class 사용자 대화창을 생성하는 컴포넌트
	 * @param {HashTable} htOption 옵션 해시테이블
	 * @requires jindo.LayerPosition
	 * @extends jindo.Component
	 * @example
var oDialog = new jindo.Dialog({
	sClassPrefix : 'dialog-', //Default Class Prefix
	LayerPosition : { //LayerPosition에 적용될 옵션
		sPosition : "inside-center",
		bAuto : true
	}
}).attach({
	beforeShow : function(oCustomEvent) {
		//다이얼로그 레이어가 보여지기 전에 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elLayer (HTMLElement) 다이얼로그 레이어
		//}
		//oCustomEvent.stop(); 수행시 보여지지 않음
	},
	show : function(oCustomEvent) {
		//다이얼로그 레이어가 보여진 후 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elLayer (HTMLElement) 다이얼로그 레이어
		//}
	},
	beforeHide : function(oCustomEvent) {
		//다이얼로그 레이어가 숨겨지기 전에 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elLayer (HTMLElement) 다이얼로그 레이어
		//}
		//oCustomEvent.stop(); 수행시 숨겨지지 않음
	},
	hide : function(oCustomEvent) {
		//다이얼로그 레이어가 숨겨진 후 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elLayer (HTMLElement) 다이얼로그 레이어
		//}
	}
});
	 */
	$init : function(htOption) {
		//옵션 초기화
		var htDefaultOption = {
			sClassPrefix : 'dialog-', //Default Class Prefix
			LayerPosition : {
				sPosition : "inside-center",
				bAuto : true
			}
		};
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		this._bIsEventAttached = false;
		this._bIsShown = false;
		
		//컴포넌트에서 사용되는 HTMLElement들을 선언하는 메소드
		this._assignHTMLElements();
		this._initLayerPosition();
	},
	
	/**
	 * HTMLElement들을 선언한다.
	 * @ignore
	 */
	_assignHTMLElements : function() {
		this._elLayer = jindo.$('<div class="' + this.option("sClassPrefix") + 'layer"></div>');
		this._welLayer = jindo.$Element(this._elLayer);
		this._wfClick = jindo.$Fn(this._onClick, this);
	},
	
	/**
	 * LayerPosition 컴포넌트를 초기화한다.
	 */
	_initLayerPosition : function() {
		this._oLayerPosition = new jindo.LayerPosition(document.body, this._elLayer, this.option("LayerPosition"));
	},
	
	/**
	 * 다이얼로그 레이어 엘리먼트를 가져온다.
	 * @return {HTMLElement}
	 */
	getLayer : function() {
		return this._elLayer;
	},
	
	/**
	 * 생성된 LayerPosition 컴포넌트의 인스턴스를 가져온다.
	 * @return {jindo.LayerPosition}
	 */
	getLayerPosition : function() {
		return this._oLayerPosition;
	},
	
	/**
	 * 다이얼로그 레이어에 대한 템플릿을 설정한다.
	 * 다이얼로그 레이어의 내용을 동적으로 설정하기 위해 템플릿 형태로 설정한다.
	 * @remark Jindo의 jindo.$Template 참고
	 * @param {String} sTemplate
	 * @example
oDialog.setLayerTemplate('<div><a href="#" class="dialog-close"><img width="15" height="14" alt="레이어닫기" src="http://static.naver.com/common/btn/btn_close2.gif"/></a></div><div style="position:absolute;top:30px;left:10px;">{=text}</div><div style="position:absolute;bottom:10px;right:10px;"><button type="button" class="dialog-confirm">확인</button><button type="button" class="dialog-cancel">취소</button></div></div>');
	 */
	setLayerTemplate : function(sTemplate) {
		this._sTemplate = sTemplate;
		this._template = jindo.$Template(this._sTemplate);
	},
	
	/**
	 * 설정된 다이얼로그 레이어의 템플릿을 가져온다.
	 * @return {String} 설정된 템플릿
	 */
	getLayerTemplate : function() {
		return this._sTemplate;
	},
	
	/**
	 * 다이얼로그 레이어를 보여준다.
	 * @remark 다이얼로그 레이어는 설정된 레이어의 템플릿으로부터 만들어져 document.body에 append된다.
	 * @param {Object} htTemplateProcess 템플릿에 대체하기 위한 데이터를 가지는 Hash Table
	 * @param {Object} htEventHandler 다이얼로그 내부에서 발생하는 이벤트를 처리하는 핸들러들
	 * @example
//다이얼로그 레이어에 닫기, 취소, 확인 버튼이 모두 존재하는경우 각각의 버튼에 대한 핸들러를 함께 등록한다. 
var oDialog = new jindo.Dialog();

oDialog.setLayerTemplate('<div><a href="#" class="dialog-close"><img width="15" height="14" alt="레이어닫기" src="http://static.naver.com/common/btn/btn_close2.gif"/></a></div><div style="position:absolute;top:30px;left:10px;">{=text}</div><div style="position:absolute;bottom:10px;right:10px;"><button type="button" class="dialog-confirm">확인</button><button type="button" class="dialog-cancel">취소</button></div></div>');

oDialog.show({ text : "<strong>확인하시겠습니까?</strong>" }, {
	close : function(oCustomEvent) {
		jindo.$Element("status").text("oDialog의 레이어에서 닫기 버튼이 클릭되었습니다.");
		//oCustomEvent.stop() 수행시 레이어가 닫히지 않는다.
	},
	cancel : function(oCustomEvent) {
		jindo.$Element("status").text("oDialog의 레이어에서 취소 버튼이 클릭되었습니다.");
		//oCustomEvent.stop() 수행시 레이어가 닫히지 않는다.
	},
	confirm : function(oCustomEvent) {
		jindo.$Element("status").text("oDialog의 레이어에서 확인 버튼이 클릭되었습니다.");
		//oCustomEvent.stop() 수행시 레이어가 닫히지 않는다.
	}
});	
	 */
	show : function(htTemplateProcess, htEventHandler) {
		if (!this.isShown()) {
			this.attach(htEventHandler);
			
			document.body.appendChild(this._elLayer);
			this._welLayer.html(this._template.process(htTemplateProcess));
			
			var htCustomEvent = {
				"elLayer": this._elLayer
			};
			
			if (this.fireEvent("beforeShow", htCustomEvent)) {
				this._welLayer.show();
				this._attachEvents();
				this.getLayerPosition().setPosition();
				this._bIsShown = true;
				this.fireEvent("show", htCustomEvent);
			}
		}
	},
	
	/**
	 * 다이얼로그 레이어를 숨긴다.
	 * @remark 다이얼로그 레이어가 숨겨지는 동시에 모든 이벤트가 제거되고 document.body에서 제거된다.
	 */
	hide : function() {
		if (this.isShown()) {
			var htCustomEvent = {"elLayer" : this._elLayer }; 
			
			if (this.fireEvent("beforeHide", htCustomEvent)) {
				this.detachAll("close").detachAll("confirm").detachAll("cancel");
				this._detachEvents();
				this._welLayer.hide();
				this._welLayer.leave();
				this._bIsShown = false;
				this.fireEvent("hide", htCustomEvent); 
			} 
		}
	},
	
	/**
	 * 다이얼로그 레이어가 보여지고 있는지 가져온다.
	 * @return {Boolean} 다이얼로그 레이어의 노출여부
	 */
	isShown : function() {
		return this._bIsShown;
	},
	
	/**
	 * 이벤트 등록 여부를 가져온다.
	 * @return {Boolean}
	 * @ignore
	 */
	_isEventAttached : function() {
		return this._bIsEventAttached;
	},

	/**
	 * 이벤트를 등록한다.
	 * @return {this}
	 * @ignore
	 */
	_attachEvents : function() {
		if (!this._isEventAttached()) {
			//활성화 로직 ex)event binding
			this._wfClick.attach(this._elLayer, "click");
			this._bIsEventAttached = true;
		}
		return this;
	},
	
	/**
	 * 이벤트를 해제한다.
	 * @return {this}
	 * @ignore
	 */
	_detachEvents : function() {
		if (this._isEventAttached()) {
			//비활성화 로직 ex)event unbinding
			this._wfClick.detach(this._elLayer, "click");
			this._bIsEventAttached = false;
		}
		return this;
	},
	
	/**
	 * 다이얼로그 레이어 내부에서 닫기, 확인, 취소 버튼을 처리하기 위한 핸들러
	 * @param {jindo.$Event} we
	 * @ignore
	 */
	_onClick : function(we) {
		var sClassPrefix = this.option("sClassPrefix");
		var elClosestClose, elClosestConfirm, elClosestCancel;
		if ((elClosestClose = this._getClosest(("." + sClassPrefix + "close"), we.element))) {
			if(this.fireEvent("close")) {
				this.hide();
			} 
		} else if ((elClosestConfirm = this._getClosest(("." + sClassPrefix + "confirm"), we.element))) {
			if(this.fireEvent("confirm")) {
				this.hide();
			}
		} else if ((elClosestCancel = this._getClosest(("." + sClassPrefix + "cancel"), we.element))) {
			if (this.fireEvent("cancel")) {
				this.hide();
			}
		}
	},
	
	/**
	 * 자신을 포함하여 부모노드중에 셀렉터에 해당하는 가장 가까운 엘리먼트를 구함
	 * @param {String} sSelector CSS셀렉터
	 * @param {HTMLElement} elBaseElement 기준이 되는 엘리먼트
	 * @return {HTMLElement} 구해진 HTMLElement
	 * @ignore
	 */
	_getClosest : function(sSelector, elBaseElement) {
		if (jindo.$$.test(elBaseElement, sSelector)) {
			return elBaseElement;
		}
		return jindo.$$.getSingle("! " + sSelector, elBaseElement);
	}
}).extend(jindo.Component);	
/**
 * @fileOverview 리스트의 아이템들을 부드러운 움직임으로 이동시켜 볼 수 있도록하는 컴포넌트 
 * @author hooriza, modified by senxation
 * @version 0.4.1
 */

jindo.Rolling = jindo.$Class({
	/** @lends jindo.Rolling.prototype */
	
	_oTransition : null,

	/**
	 * Rolling 컴포넌트를 생성한다.
	 * @constructs
	 * @class 리스트의 아이템들을 부드러운 움직임으로 이동시켜 볼 수 있도록하는 컴포넌트
	 * @extends jindo.Component
	 * @requires jindo.Effect
	 * @requires jindo.Transition
	 * @param {String | HTMLElement} el 리스트를 감싸고 있는 엘리먼트의 id 혹은 엘리먼트 자체  
	 * @param {HashTable} htOption 옵션객체
	 * @example

<xmp>
<div id="horz_wrap">
	<ul>
		<li>첫번째</li>
		<li>두번째</li>
		<li>세번째</li>
		<li>네번째</li>
		<li>다섯번째</li>
		<li>여섯번째</li>
		<li>일곱번째</li>
		<li>여덟번째</li>
		<li>아홉번째</li>
		<li>마지막</li>
	</ul>

</div>
<script>
	new jindo.Rolling(jindo.$('horz_wrap'), {
		nFPS : 50, // (Number) 초당 롤링 이동을 표현할 프레임수
		nDuration : 400, // (ms) jindo.Effect, jindo.Transtition 참고
		sDirection : 'horizontal', // || 'vertical'
		fEffect : jindo.Effect.linear, //jindo.Effect 참고
	}).attach({
		beforeMove : function(oCustomEvent) {
			//oCustomEvent.element 어느 엘리먼트의 scrollLeft 가 바뀌는지
			//oCustomEvent.nIndex 몇번째 항목으로 이동하는지
			//oCustomEvent.nScroll 이동할 포지션
			//oCustomEvent.stop()시 이동하지 않음
		},
		afterMove : function(oCustomEvent) {
			//oCustomEvent.nIndex 몇번째 항목으로 이동하였는지
		}
	});
</script>
</xmp>
	 */
	$init : function(el, htOption) {
		this._el = jindo.$(el);
		this._elList = jindo.$$.test(this._el, 'ul, ol') ? this._el : jindo.$$.getSingle('> ul, > ol', el);
		
		this.option({
			nFPS : 50,
			nDuration : 800,
			sDirection : "horizontal",
			fEffect : jindo.Effect.linear
		});
		
		this.option(htOption || {});
		
		this._oKeys = this.option('sDirection') == 'horizontal' ? {
			offsetWidth : 'offsetWidth',
			marginLeft : 'marginLeft',
			marginRight : 'marginRight',
			clientWidth : 'clientWidth',
			scrollLeft : 'scrollLeft'
		} : {
			offsetWidth : 'offsetHeight',
			marginLeft : 'marginTop',
			marginRight : 'marginBottom',
			clientWidth : 'clientHeight',
			scrollLeft : 'scrollTop'
		};

		this._initTransition();
	},
	
	_initTransition: function(){
		var self = this;
		this._oTransition = new jindo.Transition().fps(this.option("nFPS")).attach({
			end : function(oCustomEvent) {
				self.fireEvent("afterMove", { nIndex : self.getIndex() });
			}
		});
	},
	
	/**
	 * jindo.Transition 컴포넌트의 인스턴스를 가져온다.
	 * @return {jindo.Transition}
	 */
	getTransition : function() {
		return this._oTransition;
	},
	
	/**
	 * 리스트 엘리먼트를 구한다
	 * @return {HTMLElement} 리스트 엘리먼트 ul 또는 ol
	 */
	getList : function() {
		return this._elList;
	},
	
	/**
	 * 리스트의 아이템(LI, 즉 자식 엘리먼트)들을 구한다.
	 * @return {Array} LI 엘리먼트들의 배열
	 */
	getItems : function() {
		return jindo.$$('> li', this._elList);
	},
	
	_offsetSize : function(el) {
		var eEl = jindo.$Element(el),
			oKeys = this._oKeys,
			nMarginLeft = parseInt(eEl.css(oKeys.marginLeft), 10) || 0,
			nMarginRight = parseInt(eEl.css(oKeys.marginRight), 10) || 0;
		return el[oKeys.offsetWidth] + nMarginLeft + nMarginRight;
	},
	
	/**
	 * 현재 표시되고있는 LI의 인덱스를 구한다.
	 * @return {Number} 현재 표시되고있는 LI의 인덱스
	 */
	getIndex : function() {
		if (this.isMoving()) {
			return this._nMoveTo;
		}
		
		var el = this._el,
			oKeys = this._oKeys,
			nScroll = el[oKeys.scrollLeft],
			aItems = this.getItems(),
			nSize = 0,
			n = 0,
			nMinDistance = 99999999;

		for (var i = 0; i < aItems.length; i++) {
			var nDistance = Math.abs(nScroll - nSize);
			
			if (nDistance < nMinDistance) {
				nMinDistance = nDistance;
				n = i;
			}
			
			nSize += this._offsetSize(aItems[i]);
		}
		
		return n;
	},
	
	_getPosition : function (n) {
		var el = this._el,
			oKeys = this._oKeys,
			aItems = this.getItems(),
			nPos = 0, nSize = this._getSize(), i;
		
		for (i = 0; i < n; i++) {
			nPos += this._offsetSize(aItems[i]);
		}
		
		if (nPos + el[oKeys.clientWidth] > nSize) {
			nPos = nSize - el[oKeys.clientWidth];
		}
		
		return nPos;
	},
	
	_getSize : function() {
		var aItems = this.getItems(),
			nSize = 0;
			
		for (i = 0; i < aItems.length; i++) {
			nSize += this._offsetSize(aItems[i]);
		}
		
		return this._nSize = nSize;
	},
	
	_move : function(n) {
		var el = this._el,
			oKeys = this._oKeys,
			aItems = this.getItems(),
			nPos = this._getPosition(n);
			nSize = this._getSize();

		var htParam = {
			element : el, // 어느 엘리먼트의 scrollLeft 가 바뀌는지
			nIndex : n, // 몇번째 항목으로 이동하는지
			nScroll : nPos
		};

		if (this.fireEvent('beforeMove', htParam) && el[oKeys.scrollLeft] != htParam.nScroll) {
			 
			var htDest = {};
			htDest[oKeys.scrollLeft] = this.option('fEffect')(htParam.nScroll);
			this._nMoveTo = n;
			
			this.getTransition().abort().start(this.option('nDuration'), htParam.element, htDest);
			return true;
		}
		return false;
	},
	
	/**
	 * n번째 아이템으로 이동한다.
	 * @param {Number} n
	 * @return {Boolean} 실제로 이동했는지 여부 
	 */
	moveTo : function(n) {
		n = Math.max(n, 0);
		n = Math.min(n, this.getItems().length - 1);
		return this._move(n);
	},

	/**
	 * 뒤에서부터 n번째 아이템으로 이동한다.
	 * @param {Number} n
	 * @return {Boolean} 실제로 이동했는지 여부
	 */
	moveLastTo : function(n) {
		return this.moveTo(this.getItems().length - 1 - n);
	},

	/**
	 * 현재 위치와 n만큼 떨어진 아이템으로 이동한다.
	 * @param {Number} n
	 * @return {Boolean} 실제로 이동했는지 여부
	 */
	moveBy : function(n) {
		return this.moveTo(this.getIndex() + n);
	},
	
	/**
	 * 롤링이 진행중인지 여부를 가져온다.
	 * @return {Boolean}
	 */
	isMoving : function() {
		return this._oTransition.isPlaying();
	},
	
	/**
	 * 리스트의 아이템들이 가려있는지 여부를 가져온다.
	 * @return {Boolean} 리스트의 아이템들이 가려있는지 여부
	 */
	isOverflowed : function() {
		return this._getSize() > this._el[this._oKeys.clientWidth];
	},
	
	/**
	 * 한번에 보여지는 아이템의 개수를 가져온다.
	 * @return {Number}
	 */
	getDisplayedItemCount : function() {
		var nDisplayed = 0,
			aItems = this.getItems(),
			nPos = 0;
		
		for (var i = 0; i < aItems.length; i++) {
			nPos += this._offsetSize(aItems[i]);
			if (nPos <= this._el[this._oKeys.clientWidth]) {
				nDisplayed++; 
			} else {
				break;
			}
		}
		
		return nDisplayed;
	}

}).extend(jindo.Component);
/**
 * @fileOverview 이미지 스크롤바 컴포넌트
 * @author senxation
 * @version 0.2.4
 */
jindo.ScrollBar = new jindo.$Class({
	/** @lends jindo.ScrollBar.prototype */

	_bMouseEnter : false,
	_bIsEventAttachedForCommon : false,
	_bIsEventAttachedForVertical : false,
	_bIsEventAttachedForHorizontal : false,
	
	/**
	 * ScrollBar 컴포넌트는 정해진 크기의 박스내의 내용을 스크롤바를 이용해 이동하여 볼 수 있게합니다.
	 * 스크롤바의 위치와 크기는 마크업의 정의에 따라 커스터마이징할 수 있습니다.
	 * 박스내 내용이 고정되어있고 변하지 않는 경우에 사용합니다.
	 * @constructs
	 * @class 이미지 스크롤바 컴포넌트
	 * @extends jindo.UIComponent
	 * @requires jindo.Slider
	 * @requires jindo.RolloverArea
	 * @requires jindo.Transition
	 * @param {HTMLElement} el
	 * @param {Object} oOption
	 * @example
var oScrollBar = new jindo.ScrollBar("scroll", {
	sClassPrefix : "scrollbar-", // (String) Class Prefix
	nDelta : 16, // (Number) 스크롤 속도
	sClassNameForRollover : "rollover", // (String) Rollover에 반응할 class 명
	bActivateOnload : true
}).attach({
	scroll : function(oCustomEvent) {
		//스크롤위치가 바뀔 때 마다 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	sDirection : (String) "left" 또는 "top"
		//	nPosition : (Number) 스크롤된 위치
		//}
	}
});
	 */	
	$init : function(el, oOption) {
		
		this.option({
			sClassPrefix : "scrollbar-",
			nDelta : 16, //스크롤 속도
			sClassNameForRollover : "rollover", // (String) Rollover에 반응할 class 명
			bActivateOnload : true
		});
		
		this.option(oOption || {});
		
		this._el = jindo.$(el);
		
		this._oTimer = new jindo.Timer();
		this._oTransition = new jindo.Transition().fps(30);
		
		this._wfOnMouseEnter = jindo.$Fn(this._onMouseEnter, this);
		this._wfOnMouseLeave = jindo.$Fn(this._onMouseLeave, this);
		
		this._wfOnWheel = jindo.$Fn(this._onWheel, this);
		this._wfOnMouseUp = jindo.$Fn(this._onMouseUp, this);

		this._assignHTMLElements();
		
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	_assignHTMLElements : function(){
		var el = this._el,
			sClassPrefix = this.option("sClassPrefix");

		this._elBox = jindo.$$.getSingle("."+sClassPrefix+"box", el);
		this._elContent = jindo.$$.getSingle("."+sClassPrefix+"content", el);
		
		var welBox = jindo.$Element(this._elBox),
			welContent = jindo.$Element(this._elContent);
			
		this._oBoxSize = {
			nWidth: welBox.width(),
			nHeight: welBox.height()
		};
		
		this._oContentSize = {
			nWidth: welContent.width(),
			nHeight: welContent.height()
		};

		this._oHorizontal = {
			elScrollBar : jindo.$$.getSingle("."+sClassPrefix+"h", el)
		};
		
		var oH = this._oHorizontal;
		if (oH.elScrollBar) {
			oH.elTrack = jindo.$$.getSingle("." + sClassPrefix + "track", oH.elScrollBar);
			oH.elThumb = jindo.$$.getSingle("." + sClassPrefix + "thumb", oH.elTrack);
			oH.elThumbHead = jindo.$$.getSingle("."+sClassPrefix+"thumb-head", oH.elThumb);
			oH.elThumbBody = jindo.$$.getSingle("."+sClassPrefix+"thumb-body", oH.elThumb);
			oH.elThumbFoot = jindo.$$.getSingle("."+sClassPrefix+"thumb-foot", oH.elThumb);			
			oH.elButtonLeft = jindo.$$.getSingle("." + sClassPrefix + "button-left", oH.elScrollBar);
			oH.elButtonRight = jindo.$$.getSingle("." + sClassPrefix + "button-right", oH.elScrollBar);
		}
		
		this._oVertical = {
			elScrollBar : jindo.$$.getSingle("."+sClassPrefix+"v", el)
		};
		var oV = this._oVertical;
		if (oV.elScrollBar) {
			oV.elTrack = jindo.$$.getSingle("." + sClassPrefix + "track", oV.elScrollBar);
			oV.elThumb = jindo.$$.getSingle("." + sClassPrefix + "thumb", oV.elTrack);
			oV.elThumbHead = jindo.$$.getSingle("."+sClassPrefix+"thumb-head", oV.elThumb);
			oV.elThumbBody = jindo.$$.getSingle("."+sClassPrefix+"thumb-body", oV.elThumb);
			oV.elThumbFoot = jindo.$$.getSingle("."+sClassPrefix+"thumb-foot", oV.elThumb);
			oV.elButtonUp = jindo.$$.getSingle("." + sClassPrefix + "button-up", oV.elScrollBar);
			oV.elButtonDown = jindo.$$.getSingle("." + sClassPrefix + "button-down", oV.elScrollBar);
		}
	},
	
	/**
	 * box 엘리먼트를 가져온다.
	 * @return {HTMLElement}
	 */
	getBox : function() {
		return this._elBox;
	},
	
	/**
	 * content 엘리먼트를 가져온다
	 * @return {HTMLElement}
	 */
	getContent : function() {
		return this._elContent;
	},
	
	/**
	 * 초기 로딩시 정해진 박스의 크기를 가져온다.
	 * @return {Object}
	 * @example
var oSize = {
	nWidth : (Number), 
	nHeight : (Number)
}
	 */
	getDefaultBoxSize : function() {
		return this._oBoxSize;
	},
	
	/**
	 * 초기 로딩시 정해진 박스의 크기를 가져온다.
	 * @return {Object}
	 * @example
var oSize = {
	nWidth : (Number), 
	nHeight : (Number)
}
	 */
	getDefaultContentSize : function() {
		return this._oContentSize;
	},
	
	/**
	 * 가로 스크롤바에 해당하는 HTMLElement 객체들을 가져온다.
	 * @return {Object}
	 * @example
var oScrollBarHorizontal = {
	elScrollBar : (HTMLElement),
	elTrack : (HTMLElement),
	elThumb : (HTMLElement),
	elThumbHead : (HTMLElement),
	elThumbBody : (HTMLElement),
	elThumbFoot : (HTMLElement),	
	elButtonLeft : (HTMLElement), 
	elButtonRight : (HTMLElement)
}
	 */
	getScrollBarHorizontal : function() {
		return this._oHorizontal;
	},
	
	/**
	 * 세로 스크롤바에 해당하는 HTMLElement 객체들을 가져온다.
	 * @return {Object}
	 * @example
var oScrollBarVertical = {
	elScrollBar : (HTMLElement),
	elTrack : (HTMLElement),
	elThumb : (HTMLElement),
	elThumbHead : (HTMLElement),
	elThumbBody : (HTMLElement),
	elThumbFoot : (HTMLElement),	
	elButtonUp : (HTMLElement), 
	elButtonDown : (HTMLElement)
}
	 */
	getScrollBarVertical : function() {
		return this._oVertical;
	},
	
	/**
	 * 가로 스크롤에 해당하는 슬라이더 객체를 가져온다.
	 * @return {jindo.Slider}
	 */
	getSliderHorizontal : function() {
		return this._oSliderHorizontal || null;
	},
	
	/**
	 * 세로 스크롤에 해당하는 슬라이더 객체를 가져온다.
	 * @return {jindo.Slider}
	 */
	getSliderVertical : function() {
		return this._oSliderVertical || null;
	},
	
	/**
	 * RolloverArea 객체를 가져온다.
	 * @return {jindo.RolloverArea}
	 */
	getRolloverArea : function() {
		return this._oRolloverArea;
	},
	
	_attachEvent : function(sDirection) {
		var sClassPrefix = this.option("sClassPrefix"),
			self = this,
			oH = this.getScrollBarHorizontal(),
			oV = this.getScrollBarVertical();	
		
		function attach(o) {
			if (o.elScrollBar) {
				var sClassNameForRollover = self.option("sClassNameForRollover");
				jindo.$Element(o.elTrack).addClass(sClassNameForRollover);
				jindo.$Element(o.elThumb).addClass(sClassNameForRollover);
				if (o.elButtonLeft) {
					jindo.$Element(o.elButtonLeft).addClass(sClassNameForRollover);	
				}
				if (o.elButtonRight) {
					jindo.$Element(o.elButtonRight).addClass(sClassNameForRollover);
				}
				if (o.elButtonUp) {
					jindo.$Element(o.elButtonUp).addClass(sClassNameForRollover);
				}
				if (o.elButtonDown) {
					jindo.$Element(o.elButtonDown).addClass(sClassNameForRollover);
				}
			}
		}
		
		function attachH() {
			if (!self._bIsEventAttachedForHorizontal) {
				attach(oH);
			}
			self._bIsEventAttachedForHorizontal = true;
		}
		
		function attachV() {
			if (!self._bIsEventAttachedForVertical) {
				attach(oV);
			}
			self._bIsEventAttachedForVertical = true;
		}
		
		//공통 이벤트
		if(!this._bIsEventAttachedForCommon) {
			this._initSliders();
			this._initRolloverArea();
			
			this._wfOnMouseEnter.attach(this._el, "mouseenter");
			this._wfOnMouseLeave.attach(this._el, "mouseleave");
			this._wfOnWheel.attach(document, "mousewheel");
			this._wfOnMouseUp.attach(document, "mouseup");
			this._bIsEventAttachedForCommon = true;
			jindo.$Element(this._el).removeClass(sClassPrefix + "noscript");
		}

		//방향이 없으면 전부
		if (!sDirection) {
			attachH();
			attachV();
		}
		if (sDirection == "horizontal") {
			attachH();
		}
		if (sDirection == "vertical") {
			attachV();
		}
	},
	
	_detachEvent : function(sDirection) {
		var sClassPrefix = this.option("sClassPrefix"),
			self = this,
			oH = this.getScrollBarHorizontal(),
			oV = this.getScrollBarVertical();	
		
		function detach(o) {
			if (o.elScrollBar) {
				var sClassNameForRollover = self.option("sClassNameForRollover");
				jindo.$Element(o.elTrack).removeClass(sClassNameForRollover);
				jindo.$Element(o.elThumb).removeClass(sClassNameForRollover);
				if (o.elButtonLeft) {
					jindo.$Element(o.elButtonLeft).removeClass(sClassNameForRollover);	
				}
				if (o.elButtonRight) {
					jindo.$Element(o.elButtonRight).removeClass(sClassNameForRollover);
				}
				if (o.elButtonUp) {
					jindo.$Element(o.elButtonUp).removeClass(sClassNameForRollover);
				}
				if (o.elButtonDown) {
					jindo.$Element(o.elButtonDown).removeClass(sClassNameForRollover);
				}
			}
		}
		
		function detachH() {
			if (self._bIsEventAttachedForHorizontal) {
				detach(oH);
			}
			self._bIsEventAttachedForHorizontal = false;
		}
		
		function detachV() {
			if (self._bIsEventAttachedForVertical) {
				detach(oV);
			}
			self._bIsEventAttachedForVertical = false;
		}

		//방향이 없으면 전부
		if (!sDirection) {
			detachH();
			detachV();
		}
		else if (sDirection == "horizontal") {
			detachH();
		}
		else if (sDirection == "vertical") {
			detachV();
		}

		//공통 이벤트
		if(this._bIsEventAttachedForCommon && !this._bIsEventAttachedForHorizontal && !this._bIsEventAttachedForVertical) {
			this._wfOnMouseEnter.detach(this._el, "mouseenter");
			this._wfOnMouseLeave.detach(this._el, "mouseleave");
			this._wfOnWheel.detach(document, "mousewheel");
			this._wfOnMouseUp.detach(document, "mouseup");
			this._bMouseEnter = false;
			this._bIsEventAttachedForCommon = false;
			this.getRolloverArea().deactivate();
			jindo.$Element(this._el).addClass(sClassPrefix + "noscript");	
		}
	},
	
	_activateH : function() {
		var oSliderH = this.getSliderHorizontal();
		if (oSliderH) {
			oSliderH.activate();
			this.getBox().scrollLeft = 0;
			this.setScrollLeft(0);
		}
	},
	
	_activateV : function() {
		var oSliderV = this.getSliderVertical();
		if (oSliderV) {
			oSliderV.activate();
			this.getBox().scrollTop = 0;
			this.setScrollTop(0);
		}
	},
	
	/**
	 * 스크롤바의 동작을 활성화한다.
	 * @param {String} sDirection "vertical" || "horizontal" || null
	 */
	_onActivate : function(sDirection) {
		this._attachEvent(sDirection || null);
		
		if(!sDirection) {
			this._activateH();
			this._activateV();
			jindo.$Element(this._el).removeClass(this.option("sClassPrefix") + "noscript");
			return;
		}
		if(sDirection == "horizontal") {
			this._activateH();
			return;
		}
		if(sDirection == "vertical") {
			this._activateV();
			return;
		}
	},
	
	_deactivateH : function() {
		var oSliderH = this.getSliderHorizontal();
		if (oSliderH) {
			oSliderH.deactivate();
			this.getContent().style.left = "0px";
			this.getBox().scrollLeft = 0;
		}
	},
	
	_deactivateV : function() {
		var oSliderV = this.getSliderVertical();
		if (oSliderV) {
			oSliderV.deactivate();
			this.getContent().style.top = "0px";
			this.getBox().scrollTop = 0;
		}
	},
	
	/**
	 * 스크롤바의 동작을 비활성화한다.
	 * @param {String} sDirection "vertical" || "horizontal" || null
	 */
	_onDeactivate : function(sDirection) {
		this._detachEvent(sDirection || null);
		
		if(!sDirection) {
			this._deactivateH();
			this._deactivateV();
			jindo.$Element(this._el).addClass(this.option("sClassPrefix") + "noscript");
			return;
		}
		if(sDirection == "horizontal") {
			this._deactivateH();
			return;
		}
		if(sDirection == "vertical") {
			this._deactivateV();
			return;
		}
	},
	
	_initSliders : function() {
		var self = this,
			sClassPrefix = this.option("sClassPrefix"),
			oH = this.getScrollBarHorizontal(),
			oV = this.getScrollBarVertical();		
		
		if (oH.elScrollBar) {

			this._nScrollWidth = jindo.$Element(this._elContent).width() - jindo.$Element(this._elBox).width();
			
			this._oSliderHorizontal = new jindo.Slider(oH.elTrack, {
				sClassPrefix: sClassPrefix,
				bVertical: false,
				nMinValue: 0,
				nMaxValue: this._nScrollWidth
			});
			this._oSliderHorizontal._oTransition = new jindo.Transition().fps(30);
			
			this._oSliderHorizontal.attach({
				beforeChange: function(oCustomEvent){
					var nTrackWidth = jindo.$Element(this.getTrack()).width(),
						nThumbWidth = jindo.$Element(this.getThumb(oCustomEvent.nIndex)).width(),
						nAvailWidth = nTrackWidth - nThumbWidth;
					
					oCustomEvent.nPos = Math.min(oCustomEvent.nPos, nAvailWidth); 
					oCustomEvent.nPos = Math.max(oCustomEvent.nPos, 0);

					if (oCustomEvent.bJump) {
						oCustomEvent.stop();
						
						this._oTransition.abort().start(200, this.getThumb(oCustomEvent.nIndex), {
							"@left" : jindo.Effect.easeOut(oCustomEvent.nPos + 'px') 
						}).attach({
							playing : function(oCustomEvent2) {
								self.setScrollLeft(self._oSliderHorizontal._getValue(0, parseInt(oCustomEvent2.sValue, 10)));
							}
						});
					} else {
						self.setScrollLeft(this._getValue(0, oCustomEvent.nPos));
					}
				}
			});
			
		}
		
		if (oV.elScrollBar) {
			this._nScrollHeight = jindo.$Element(this._elContent).height() - jindo.$Element(this._elBox).height();

			this._oSliderVertical = new jindo.Slider(oV.elTrack, {
				sClassPrefix: sClassPrefix,
				bVertical: true,
				nMinValue: 0,
				nMaxValue: this._nScrollHeight
			});
			this._oSliderVertical._oTransition = new jindo.Transition().fps(30);
			
			this._oSliderVertical.attach({
				beforeChange: function(oCustomEvent){
					var nTrackHeight = jindo.$Element(this.getTrack()).height(),
						nThumbHeight = jindo.$Element(this.getThumb(oCustomEvent.nIndex)).height(),
						nAvailHeight = nTrackHeight - nThumbHeight;
					
					oCustomEvent.nPos = Math.min(oCustomEvent.nPos, nAvailHeight); 
					oCustomEvent.nPos = Math.max(oCustomEvent.nPos, 0);

					if (oCustomEvent.bJump) {
						oCustomEvent.stop();
						this._oTransition.abort().start(200, this.getThumb(oCustomEvent.nIndex), {
							"@top" : jindo.Effect.easeOut(oCustomEvent.nPos + 'px') 
						}).attach({
							playing : function(oCustomEvent2) {
								self.setScrollTop(self._oSliderVertical.values(0));
							}
						});
					} else {
						self.setScrollTop(this._getValue(0, oCustomEvent.nPos));
					}
				}
			});
			
		}		
		
	},

	_initRolloverArea : function(){
		var self = this,
			sClassPrefix = this.option("sClassPrefix"),
			sClassNameForRollover = this.option("sClassNameForRollover");
			
		this._oRolloverArea = new jindo.RolloverArea(this._el, {
			sClassName : sClassNameForRollover, // (String) 컴포넌트가 적용될 엘리먼트의 class 명. 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트에 Rollover 컴포넌트가 적용된다.
			sClassPrefix : sClassPrefix // (String) 컴포넌트가 적용될 엘리먼트에 붙게될 class명의 prefix. (prefix+"over|down")
		}).attach({
			over: function(oCustomEvent){
				oCustomEvent.stop();
				self._onRollover("over", oCustomEvent.element);
			},
			down: function(oCustomEvent){
				oCustomEvent.stop();
				self._onMouseDown(oCustomEvent.element);
				self._onRollover("down", oCustomEvent.element);
			},
			up: function(oCustomEvent){
				oCustomEvent.stop();
				self._onMouseUp(oCustomEvent.element);
				self._onRollover("up", oCustomEvent.element);
			},
			out: function(oCustomEvent){
				oCustomEvent.stop();
				self._onRollover("out", oCustomEvent.element);
			}
		});
	},
	
	/**
	 * content의 내용의 크기가 달라졌을때 스크롤바의 이동 값을 재설정해준다. 
	 */	
	reset : function() {
		var oSliderH = this.getSliderHorizontal(),
			oSliderV = this.getSliderVertical();
		
		if (oSliderH) {
			this._nScrollWidth = jindo.$Element(this._elContent).width() - jindo.$Element(this._elBox).width();
			oSliderH.option("nMaxValue", this._nScrollWidth);
			this.setScrollLeft(0);
		}
		if (oSliderV) {
			this._nScrollHeight = jindo.$Element(this._elContent).height() - jindo.$Element(this._elBox).height();
			oSliderV.option("nMaxValue", this._nScrollHeight);
			this.setScrollTop(0);			
		}
		
		this._elBox.scrollLeft = 0;
		this._elBox.scrollTop = 0;		
	},
	
	/**
	 * 가로 스크롤이 화면에 표시되었는지 여부를 가져온다.
	 * @return {Boolean} 
	 */
	hasScrollBarHorizontal : function() {
		var sClassPrefix = this.option("sClassPrefix"),
			o = this.getScrollBarHorizontal();
		
		if (o.elScrollBar) {
			var welScrollBar = jindo.$Element(o.elScrollBar);
			return welScrollBar.visible() || welScrollBar.hasClass(sClassPrefix + "show");	
		}
		return false;
		
	},
	
	/**
	 * 세로 스크롤이 화면에 표시되었는지 여부를 가져온다.
	 * @return {Boolean} 
	 */
	hasScrollBarVertical : function() {
		var sClassPrefix = this.option("sClassPrefix"),
			o = this.getScrollBarVertical();
		
		if (o.elScrollBar) {
			var welScrollBar = jindo.$Element(o.elScrollBar);
			return welScrollBar.visible() || welScrollBar.hasClass(sClassPrefix + "show");
		}
		return false;
	},
	
	/**
	 * 세로 스크롤바의 포지션을 설정한다.
	 * @param {Number} n
	 * @remark 0.1.2 버전부터 slider 0.3.2버전 필요
	 */
	setScrollTop : function(n) {
		n = Math.min(n, this._nScrollHeight);
		n = Math.max(n, 0);
		n = Math.round(n);
		
		var htParam = {
			sDirection : "top",
			nPosition : n
		};
		
		jindo.$Element(this._elContent).css("top", (htParam.nPosition * -1) + "px");
		var oSliderV = this.getSliderVertical();
		if (oSliderV) {
			oSliderV.values(0, htParam.nPosition, false); //커스텀이벤트를 발생하지 않으면서 이동
		}
		
		this._fireScrollEvent(htParam);
	},

	/**
	 * 가로 스크롤바의 포지션을 설정한다.
	 * @param {Number} n
	 * @remark 0.1.2 버전부터 slider 0.3.2버전 필요
	 */
	setScrollLeft : function(n) {
		n = Math.min(n, this._nScrollWidth);
		n = Math.max(n, 0);
		n = Math.round(n);
		
		var htParam = {
			sDirection : "left",
			nPosition : n
		};
		
		jindo.$Element(this._elContent).css("left", (htParam.nPosition * -1) +"px");
		var oSliderH = this.getSliderHorizontal();
		if (oSliderH) {
			oSliderH.values(0, htParam.nPosition, false); //커스텀이벤트를 발생하지 않으면서 이동
		}
		
		this._fireScrollEvent(htParam);
	},
	
	/**
	 * 세로 스크롤바의 포지션을 상대값으로 설정한다.
	 * @param {Number} n
	 */
	setScrollTopBy : function(n) {
		this.setScrollTop(this.getScrollTop()+n);		
	},

	/**
	 * 가로 스크롤바의 포지션을 상대값으로 설정한다.
	 * @param {Number} n
	 */
	setScrollLeftBy : function(n) {
		this.setScrollLeft(this.getScrollLeft()+n);		
	},

	/**
	 * 컨텐트 영역의 상/하 위치를 구한다.
	 * @param {Number} n
	 */
	getScrollTop : function(n) {
		return parseInt(jindo.$Element(this._elContent).css("top"), 10) * -1;
	},
	
	/**
	 * 컨텐트 영역의 좌/우 위치를 구한다.
	 * @param {Object} n
	 */
	getScrollLeft : function(n) {
		return parseInt(jindo.$Element(this._elContent).css("left"), 10) * -1;
	},
	
	_getElementType : function(wel) {
		var sClassPrefix = this.option("sClassPrefix");
		
		if (wel.hasClass(sClassPrefix+"track")) {
			return "track";
		}
		else if (wel.hasClass(sClassPrefix+"thumb")) {
			return "thumb";
		}
		else if (wel.hasClass(sClassPrefix+"button-up")) {
			return "button-up";
		}
		else if (wel.hasClass(sClassPrefix+"button-up")) {
			return "button-up";
		}
		else if (wel.hasClass(sClassPrefix+"button-down")) {
			return "button-down";
		}
		else if (wel.hasClass(sClassPrefix+"button-left")) {
			return "button-left";
		}
		else if (wel.hasClass(sClassPrefix+"button-right")) {
			return "button-right";
		}
		else {
			return false;
		}
	},
	
	_fireScrollEvent : function(htParam) {
		this.fireEvent("scroll", htParam);
	},
	
	_onWheel : function(we) {
		if (!this._bMouseEnter) {
			return;
		}
		we.stop(jindo.$Event.CANCEL_DEFAULT);
		
		var nDelta = we.mouse().delta,
			nDirection  = nDelta / Math.abs(nDelta) * -1,
			n = Math.ceil(Math.abs(nDelta)) * nDirection * this.option("nDelta"),
			bH = this.hasScrollBarHorizontal(),
			bV = this.hasScrollBarVertical();
			
		if (!bH && !bV) {
			return;
		}
		
		if (this.hasScrollBarVertical() && this._bIsEventAttachedForVertical) {
			this.setScrollTop(this.getScrollTop()+n);
			return;
		}
		
		this.setScrollLeft(this.getScrollLeft()+n);
	},
	
	_onMouseDown : function(el) {
		var wel = jindo.$Element(el),
			self = this,
			setScrollBy,
			sElementType = this._getElementType(wel);
		
		switch (sElementType) {
			case "button-up" :
				setScrollBy = function (n){
					self.setScrollTopBy(~~(n * -1));
				};
			break;
			case "button-down" :
				setScrollBy = function (n){
					self.setScrollTopBy(n);
				};
			break;
			case "button-left" :
				setScrollBy = function (n){
					self.setScrollLeftBy(~~(n * -1));
				};
			break;
			case "button-right" :
				setScrollBy = function (n){
					self.setScrollLeftBy(n);
				};
			break;
			default :
			return;
		}
		
		this._oTimer.start(function(){
			setScrollBy(16);
			return true;
		}, 100);
		
	},
	
	_onMouseUp : function(el) {
		this._oTimer.abort();
	},
	
	_onMouseEnter : function(we) {
		this._bMouseEnter = true;
	},
	
	_onMouseLeave : function(we) {
		this._bMouseEnter = false;
	},
	
	_onRollover : function(sType, el) {
		var wel = jindo.$Element(el),
			sClassPrefix = this.option("sClassPrefix"),
			sElementType = this._getElementType(wel);
		
		switch (sType) {
			case "over" :
				wel.addClass(sClassPrefix + sElementType + "-over");		
			break;
			case "down" :
				wel.addClass(sClassPrefix + sElementType + "-hold");
			break;
			case "up" :
				wel.removeClass(sClassPrefix + sElementType + "-hold");
			break;
			case "out" :
				wel.removeClass(sClassPrefix + sElementType + "-over");
			break;
		}
		
	}
	
}).extend(jindo.UIComponent);
/**
 * @fileOverview 트리구조를 표현하는 컴포넌트
 * @author hooriza, modified by senxation
 * @version 0.6.1
 */
jindo.Tree = jindo.$Class({
	/** @lends jindo.Tree.prototype */
	
	_bIsActivating : false, //컴포넌트의 활성화 여부
	_sTemplate : null,
	_htNodeData : null,
	_el : null,
	_elSelectedNode : null,
	
	/**
	 * Tree 컴포넌트를 생성한다.
	 * @constructs
	 * @class 트리구조를 표현하는 컴포넌트
	 * @param {HTMLElement} el 적용할 트리 엘리먼트 
	 * @param {HashTable} htOption 옵션객체
	 * @extends jindo.UIComponent
	 * @example
tree = new jindo.Tree(jindo.$('tree'), { 
	sClassPrefix : 'tree-', //Class Prefix
	sEventSelect : "click", //노드 선택을 위한 이벤트명
	sEventExpand : "dblclick", //자식노드를 펼치거나 접을 이벤트명
	bExpandOnSelect : true, //레이블을 클릭하여 선택했을때도 노드를 펼칠지 여부
	bActivateOnload : true //로드시 activate() 수행여부
}).attach({
	click : function(oCustomEvent) { //sEventExpand값이 "click" 일 경우
		//자식노드를 펼치거나 접기위해 sEventSelect 옵션으로 지정된 이벤트가 발생할 때
		//전달되는 이벤트객체 oCustomEvent = {
		//	element : (HTMLElement) 선택된 노드
		//	weEvent : (jindo.$Event) 클릭 이벤트 객체
		//}
		//oCustomEvent.stop(); 수행시 노드를 선택하지 않음
	},
	beforeSelect : function(oCustomEvent) {
		//노드가 선택되기 전 발생
		//전달되는 이벤트객체 oCustomEvent = {
		//	element : (HTMLElement) 선택된 노드
		//}
		//oCustomEvent.stop() 수행시 뒤이어 일어나는 select 이벤트는 발생하지 않는다.
	},
	select : function(oCustomEvent) {
		//노드가 선택되었을 때 발생
		//전달되는 이벤트객체 oCustomEvent = {
		//	element : (HTMLElement) 선택된 노드
		//}
	},
	dblclick : function(oCustomEvent) { //sEventExpand값이 "dblclick" 일 경우
		//자식노드를 펼치거나 접기위해 sEventExpand 옵션으로 지정된 이벤트가 발생할 때
		//전달되는 이벤트객체 oCustomEvent = {
		//	element : (HTMLElement) 이벤트가 발생한 노드
		//	weEvent : (jindo.$Event) 더블클릭 이벤트 객체
		//}
		//oCustomEvent.stop(); 수행시 자식노드를 펼치거나 접지 않음
	},
	beforeExpand : function(oCustomEvent) {
		//노드가 펼쳐지기 전에 발생
		//전달되는 이벤트객체 oCustomEvent = {
		//	element : (HTMLElement) 선택된 노드
		//}
		//oCustomEvent.stop() 수행시 뒤이어 일어나는 select 이벤트는 발생하지 않는다.
	},
	expand : function(oCustomEvent) {
		//노드가 펼쳐진 후 발생
		//전달되는 이벤트객체 oCustomEvent = {
		//	element : (HTMLElement) 선택된 노드
		//}
	},
	beforeCollapse : function(oCustomEvent) {
		//노드가 접혀지기 전에 발생
		//전달되는 이벤트객체 oCustomEvent = {
		//	element : (HTMLElement) 선택된 노드
		//}
		//oCustomEvent.stop() 수행시 뒤이어 일어나는 collapse 이벤트는 발생하지 않는다.
	},
	collapse : function(oCustomEvent) {
		//노드가 접혀진 후 발생
		//전달되는 이벤트객체 oCustomEvent = {
		//	element : (HTMLElement) 선택된 노드
		//}
	},
	beforeProcessData : function(oCustomEvent) {
		//노드를 생성할 때 (createNode) 발생한다.
		//sTemplate에 data를 파싱해 넣는 동작을 커스터마이징 할 수 있다.  
		//전달되는 이벤트객체 oCustomEvent = {
		//	sTemplate : (String) '<li class="{=nodeClass}{if lastNode} {=lastNodeClass}{/if}"><div{if hasChild} class="{=hasChildClass}"{/if}><button class="{=buttonClass}">+</button><span class="{=labelClass}" unselectable="on">{=text}</span></div></li>';
		//	htData : (HashTable) 처리중인 데이터 객체
		//}		
	}
});
	 */	
	$init : function(el, htOption) {
		this.option({ 
			sClassPrefix : 'tree-', //Default Class Prefix
			sEventSelect : "click", //노드 선택을 위한 이벤트명
			sEventExpand : "dblclick", //자식노드를 펼치거나 접을 이벤트명
			bExpandOnSelect : true, //레이블을 클릭하여 선택했을때도 노드를 펼칠지 여부
			bActivateOnload : true //로드시 activate() 수행여부
		});
		this.option(htOption || {});
		
		var sPrefix = this.option('sClassPrefix');
		
		//클래스명들
		this.htClassName = {
			sNode : sPrefix + "node",
			sLastNode : sPrefix + "last-node",
			sHasChild : sPrefix + "has-child",
			sButton : sPrefix + "button",
			sLabel : sPrefix + "label",
			sSelected : sPrefix + "selected",
			sCollapsed : sPrefix + "collapsed"
		};
		
		this.setNodeTemplate('<li class="{=sNodeClass}{if bLastNode} {=sLastNodeClass}{/if}"><div{if bHasChild} class="{=sHasChildClass}"{/if}><button class="{=sButtonClass}">+</button><span class="{=sLabelClass}" unselectable="on">{=sText}</span></div></li>');
		this._htNodeData = {};
		
		el = jindo.$(el);
		this._setRootList(el);
		
 		this._wfSelectHandler = jindo.$Fn(this._onSelectEvent, this);
		this._wfExpandHandler = jindo.$Fn(this._onExpandEvent, this);
		
		this._makeNodeDataKeyFromHTML(); //data를 마크업으로부터 nodedata를 생성하고 데이터를 기반으로 paint
		this.paintAllNodes();
		
		var elDefaultSelectedNode = jindo.$$.getSingle('.' + this.htClassName.sNode + ' > .' + this.htClassName.sSelected, this.getRootList());
		if (elDefaultSelectedNode) {
			this._setSelectedNode(this.getNode(elDefaultSelectedNode));
		}
		
		if(this.option("bActivateOnload")) {
			this.activate(); //컴포넌트를 활성화한다.	
		}
	},
	
	/**
	 * 컴포넌트를 활성화한다.
	 * @return {this}
	 */
	_onActivate : function() {
		var el = this.getRootList();
		this._wfSelectHandler.attach(el, this.option("sEventSelect"));
		this._wfExpandHandler.attach(el, this.option("sEventExpand"));
	},
	
	/**
	 * 컴포넌트를 비활성화한다.
	 * @return {this}
	 */
	_onDeactivate : function() {
		var el = this.getRootList();
		this._wfSelectHandler.detach(el, this.option("sEventSelect"));
		this._wfExpandHandler.detach(el, this.option("sEventExpand"));
	},
	
	_onSelectEvent : function(we) {
		var el = we.element;
		var elNode = this.getNode(el);
		if (!elNode) {
			return;
		}
		
		var elButton = jindo.$$.test(el, '.' + this.htClassName.sButton) ? el : jindo.$$.getSingle('! .' + this.htClassName.sButton, el);
		if (elButton) {
			if (this.isCollapsed(elNode)) {
				this.expandNode(elNode);
			} else {
				this.collapseNode(elNode);
			}
			return;
		}
		
		var elLabel = jindo.$$.test(el, '.' + this.htClassName.sLabel) ? el : jindo.$$.getSingle('! .' + this.htClassName.sLabel, el);
		if (elLabel) {
			var htPart = this.getPartsOfNode(elNode);
			if (htPart.elItem) {
				if (this.fireEvent(we.type, { element : elNode, weEvent : we })) {
					this.selectNode(elNode);
				}
			}
		} 
	},
	
	_onExpandEvent : function(we) {
		var el = we.element;
		var elNode = this.getNode(el);
		if (!elNode || !this.hasChild(elNode)) {
			return;
		}
		
		var elLabel = jindo.$$.test(el, '.' + this.htClassName.sLabel) ? el : jindo.$$.getSingle('! .' + this.htClassName.sLabel, el);
		if (elLabel) {
			var htParam = { element : elNode, weEvent : we };
			var htPart = this.getPartsOfNode(elNode);
			if (htPart.elItem && jindo.$Element(htPart.elItem).visible()) {
				if (this.isCollapsed(elNode)) {
					if (this.fireEvent(we.type, htParam)) {
						this.expandNode(elNode);
					}
				} else {
					if (!this._bExpandOnSelect) {
						if (this.fireEvent(we.type, htParam)) {
							this.collapseNode(elNode);
						}
					}
				}
			}
		}
	},
	
	//paint관련
	/**
	 * 노드를 새로 그린다.
	 * @param {HTMLElement} elNode
	 * @param {Boolean} bPaintChild 자식노드도 새로 그릴지 여부 (Default : true)
	 * @return {this}
	 */
	paintNode : function(elNode, bPaintChild) {
		if (typeof bPaintChild == "undefined") {
			bPaintChild = true;	
		}
		
		this._paintNode(elNode);

		if (bPaintChild) {
			var aNodes = this.getChildNodes(elNode);
			for (var i = 0; i < aNodes.length; i++) {
				this.paintNode(aNodes[i]);
			}
		}
		
		return this;		
	},
	
	/**
	 * 모든 노드를 새로 그린다.
	 * @param {HTMLElement} elNode 새로 그릴 기준 노드 (생략가능)
	 * @return {this}
	 */	
	paintAllNodes : function(elNode) {
		this.paintNode(elNode || this.getRootNode());
		return this;
	},
	
	/**
	 * 노드를 새로 그린다. (자식노드가 있거나 마지막 노드일경우 클래스명 처리)
	 * @ignore
	 * @param {HTMLElement} elNode
	 */
	_paintNode : function(elNode) {
		var htPart = this.getPartsOfNode(elNode);
		var aChildNodes = this.getChildNodes(elNode);
		var htNodeData = this.getNodeData(elNode);
		var welNode = jindo.$Element(elNode); 
		var welItem = jindo.$Element(htPart.elItem);

		delete htNodeData["_aChildren"]; //자식이 없으면 _aChildren 제거
		
		//자식이 있는지 여부		
		if (aChildNodes.length > 0) {
			welItem.addClass(this.htClassName.sHasChild);
			htNodeData["_aChildren"] = [];
			
			var self = this;
			jindo.$A(aChildNodes).forEach(function(elNode, i){
				htNodeData["_aChildren"].push(self.getNodeData(elNode));
			});
		} else {
			welItem.removeClass(this.htClassName.sHasChild);
			if (htPart.elChild) {
				htPart.elChild.parentNode.removeChild(htPart.elChild);	
			}
		}
		
		//마지막 노드인지
		htNodeData["bLastNode"] = jindo.$$.getSingle('~ .' + this.htClassName.sNode, elNode) ? false : true;
		if (htNodeData["bLastNode"]) {
			welNode.addClass(this.htClassName.sLastNode);
		} else {
			welNode.removeClass(this.htClassName.sLastNode);
		}
		elNode.parentNode.style.zoom = 1; //ie 렌더링 버그 수정!!
	},
	
	/**
	 * 노드에 적용될 템플릿을 가져온다.
	 * @return {String}
	 * @example
oTree.getNodeTemplate();
기본값 -> '<li class="{=sNodeClass}{if bLastNode} {=sLastNodeClass}{/if}"><div{if bHasChild} class="{=sHasChildClass}"{/if}><button class="{=sButtonClass}">+</button><span class="{=sLabelClass}">{=sText}</span></div></li>'

//템플릿에 process될 값들의 Hash Table
var htProcess = {
	sNodeClass : 노드의 클래스명
	bLastNode : 노드가 마지막인지 여부 
	sLastNodeClass : 마지막 노드의  클래스명
	bHasChild : 노드가 자식을 가지는 지 여부
	sHasChildClass : 자식을 가지는 경우의 클래스명
	sCollapsedClass : 접혀진 노드의 클래스명
	sButtonClass : 접기/펼치기 버튼의 클래스명
	sLabelClass : 레이블의 클래스명
	sText : 노드의 이름 (텍스트)
};
	 */
	getNodeTemplate : function() {
		return this._sTemplate;
	},
	/**
	 * 노드 생성시 노드에 적용될 템플릿을 설정한다.
	 * @param {String} s
	 * @return {this}
	 * @example
//자식노드가 모두 접혀진 채 생성하는 예제
oTree.setNodeTemplate('<li class="{=sNodeClass}{if bLastNode} {=sLastNodeClass}{/if} {=sCollapsedClass}"><div{if bHasChild} class="{=sHasChildClass}"{/if}><button class="{=sButtonClass}">+</button><span class="{=sLabelClass}">{=sText}</span></div></li>');
	 */
	setNodeTemplate : function(s) {
		this._sTemplate = s;
		return this;
	},
	
	//List 관련
	/**
	 * 노드의 트리리스트(ul 엘리먼트)를 가져온다.
	 * @param {HTMLElement} elNode
	 * @return {HTMLElement} ul 엘리먼트
	 */
	getChildListOfNode : function(elNode) {
		return jindo.$$.getSingle("ul", elNode);		
	},
	/**
	 * 트리컴포넌트그 최상위 루트 트리리스트(ul 엘리먼트)를 가져온다.
	 * @return {HTMLElement}
	 */
	getRootList : function() {
		return this._el;
	},
	_setRootList : function(el) {
		this._el = el;
	},
	
	//Node 관련
	/**
	 * 특정 엘리먼트가 속해있는 노드를 구한다.
	 * @param {HTMLElement} el 노드 자체, 노드의 버튼, 레이블 같이 노드의 li태그 자식 엘리먼트로부터 노드를 구할 수 있다.  
	 * @return {HTMLElement} 노드 (LI Element)
	 */
	getNode : function(el) {
		var elNode = jindo.$$.test(el, '.' + this.htClassName.sNode) ? el : jindo.$$.getSingle('! .' + this.htClassName.sNode, el);
		return elNode && jindo.$Element(elNode).isChildOf(this.getRootList()) ? elNode : null;
	},
	
	/**
	 * 노드를 구성하는 요소를 구한다.
	 * @param {HTMLElement} elNode
	 * @return {HashTable}
	 * @example
리턴하는 HashTable = { 
	elItem : (HTMLElement), 
	elChild : (HTMLElement) 
}
	 */
	getPartsOfNode : function(elNode) {
		var aParts = jindo.$$('> *', elNode);
		return { elItem : aParts[0], elChild : aParts[1] };
	},
	
	/**
	 * 노드의 타입을 구한다.
	 * @param {HTMLElement} elNode
	 * @return {String} "root" || "internal" || "leaf"
	 */	
	getNodeType : function(elNode) {
		if (elNode === this.getRootNode()) {
			return "root";
		} else if (this.getChildNodes(elNode).length > 0) {
			return "internal";
		} else {
			return "leaf";
		}
	},
	
	/**
	 * 루트노드를 구한다.
	 * @return {HTMLElement}
	 */
	getRootNode : function() {
		if (this._elRootNode) {
			return this._elRootNode;
		}
		this._elRootNode = jindo.$$.getSingle('.' + this.htClassName.sNode, this.getRootList());
		return this._elRootNode;
	},
	
	/**
	 * 모든 노드를 가져온다.
	 * @return {Array}
	 */
	getAllNodes : function() {
		return jindo.$$('.' + this.htClassName.sNode, this.getRootList());
	},
	
	/**
	 * 자식 노드들을 가져온다.
	 * @param {HTMLElement} elNode 노드
	 * @return {Array} 자식 노드들의 배열
	 */
	getChildNodes : function(elNode) {
		var elChildList = this.getChildListOfNode(elNode);
		return elChildList ? jindo.$$('> .' + this.htClassName.sNode, elChildList) : [];
	},
	
	/**
	 * 노드가 자식을 가지고 있는지 여부를 가져온다.
	 * @param {HTMLElement} elNode 노드
	 * @return {Boolean}
	 */
	hasChild : function(elNode) {
		var htPart = this.getPartsOfNode(elNode);
		return htPart.elChild && htPart.elChild.getElementsByTagName('li')[0] ? true : false;
	},
	
	/**
	 * 부모 노드를 가져온다.
	 * @param {HTMLElement} elNode 노드
	 * @return {HTMLElement} 부모 노드
	 */
	getParentNode : function(elNode) {
		var elRootNode = this.getRootNode();
		if (elNode === elRootNode) {
			return null;
		}
		return this.getNode(elNode.parentNode);
	},
	
	/**
	 * 이전 노드를 가져온다.
	 * @param {HTMLElement} elNode 노드
	 * @return {HTMLElement} 이전 노드
	 */
	getPreviousNode : function(elNode) {
		var elReturn = jindo.$$.getSingle('!~ .' + this.htClassName.sNode, elNode);
		return elReturn ? this.getNode(elReturn) : null;
	},
	
	/**
	 * 다음 노드를 가져온다.
	 * @param {HTMLElement} elNode 노드
	 * @return {HTMLElement} 다음 노드
	 */
	getNextNode : function(elNode) {
		var elReturn = jindo.$$.getSingle('~ .' + this.htClassName.sNode, elNode);
		return elReturn ? this.getNode(elReturn) : null;
	},
	
	/**
	 * 선택된 엘리먼트를 가져온다.
	 * @return {HTMLElement}
	 */
	getSelectedNode : function() {
		return this._elSelectedNode;
	},
	_setSelectedNode : function(el) {
		this._elSelectedNode = el;
	},
	
	/**
	 * 노드가 접혀있는지 여부를 구함
	 * @param {HTMLElement} elNode
	 * @return {Boolean} 노드가 접혀있는지 여부
	 */
	isCollapsed : function(elNode) {
		return jindo.$Element(elNode).hasClass(this.htClassName.sCollapsed);
	},
	
	/**
	 * 노드의 depth를 구한다.
	 * @param {HTMLElement} elNode
	 * @return {Number} 노드의 depth 
	 */
	getNodeDepth : function(elNode) {
		var nDepth = -1;
		
		for (; elNode; elNode = elNode.parentNode) {
			if (elNode == this.getRootList()) {
				break;
			}
			if (jindo.$$.test(elNode, '.' + this.htClassName.sNode)) {
				nDepth++;
			}
		}
		
		return nDepth;
	},
	
	/**
	 * 노드에 Data를 설정한다.
	 * @param {HTMLElement} elNode
	 * @return {this}
	 * @example
oTree.setNodeData(elNode, {
	nType : 1,
	nDepth : 3
});

oTree.getNodeData(elNode);
-->  
{
	bLabel : (String) 노드의 레이블 텍스트명,
	_aChildren : (Array) 자식노드데이터의 배열
	nType : 1,
	nDepth : 3,
}
	 */
	setNodeData : function(elNode, htNodeData) {
		var sKey = this._getNodeDataKey(elNode);
		delete htNodeData["_aChildren"]; //고정 정보는 설정할 수 없도록 
		delete htNodeData["sLabel"]; //label은 setNodeLabel 메소드로 설정가능
		for (var vProp in htNodeData) {
			this._htNodeData[sKey][vProp] = htNodeData[vProp];	
		}
		return this;
	},
	
	/**
	 * 노드의 label에 해당하는 엘리먼트를 가져온다.
	 * @param {HTMLElement} elNode
	 * @return {HTMLElement} 클래스명 "label"을 가지는 엘리먼트
	 */
	getNodeLabelElement : function(elNode) {
		return jindo.$$.getSingle("." + this.htClassName.sLabel, elNode);
	},
	
	/**
	 * 노드의 label을 가져온다.
	 * @param {HTMLElement} elNode
	 * @return {String} label의 innerHTML
	 */
	getNodeLabel : function(elNode) {
		return jindo.$Element(this.getNodeLabelElement(elNode)).html();
	},
	
	/**
	 * 노드의 label을 변경한다.
	 * @param {HTMLElement} elNode
	 * @param {String} sLabel label의 innerHTML
	 * @return {this}
	 */
	setNodeLabel : function(elNode, sLabel) {
		var sKey = this._getNodeDataKey(elNode);
		this._htNodeData[sKey]["sLabel"] = sLabel;
		jindo.$Element(this.getNodeLabelElement(elNode)).html(sLabel);
		return this;	
	},
	
	/**
	 * 모든 노드에 키를 생성하여 설정한다.
	 * @ignore
	 */
	_makeNodeDataKeyFromHTML : function() {
		var aNodes = this.getAllNodes();
		
		//루프
		for (var i = 0; i < aNodes.length; i++) {
			var elNode = aNodes[i];
			this._makeNodeDataKey(elNode);
			this._makeNodeData(elNode);
		}
	},
	
	/**
	 * 노드의 data를 가져오기위한 키를 생성하여 설정한다.
	 * @ignore
	 * @param {HTMLElement} elNode
	 */
	_makeNodeDataKey : function(elNode) {
		var welNode = jindo.$Element(elNode);
		var sNodeDataKey = this._getNodeDataKey(elNode);
		if (sNodeDataKey) {
			return false;
		}
		
		var sPrefix = this.option('sClassPrefix');
		var sUnique = ('data-' + new Date().getTime() + parseInt(Math.random() * 10000000, 10)).toString(); //ie8 버그수정. toString 이 없으면 나중에 sUnique값이 바뀜
		var sUniqueClass = sPrefix + sUnique;
		welNode.addClass(sUniqueClass);
		
		var sKey = this._getNodeDataKey(elNode);
		this._htNodeData[sKey] = {}; //Data Object 초기화
		
		return sKey;		
	},
	
	/**
	 * 노드의 기본 data를 설정한다.
	 * @param {HTMLElement} elNode
	 */
	_makeNodeData : function(elNode) {
		var htNodeData = this.getNodeData(elNode);
		htNodeData["element"] = elNode;
		htNodeData["sLabel"] = jindo.$Element(this.getNodeLabelElement(elNode)).text();
		htNodeData["bLastNode"] = jindo.$$.getSingle('~ .' + this.htClassName.sNode, elNode) ? false : true;
	},
	
	/**
	 * 노드의 data를 가져오기위한 키를 구한다.
	 * @ignore
	 * @param {HTMLElement} elNode
	 */
	_getNodeDataKey : function(elNode) {
		var sClassName = elNode.className;
		var sPrefix = this.option('sClassPrefix');
		
		var rKey = new RegExp('('+ sPrefix + 'data-[0-9]+)');
		if (rKey.test(sClassName)) {
			return RegExp.$1;
		}
		
		return null;
	},
	
	/**
	 * 노드에 설정된 data를 구한다.
	 * @param {HTMLElement} elNode 생략될 경우 전체 데이터셋을 리턴한다.
	 * @return {HashTable} 노드의 data
	 * @example 
노드 data의 기본 구조
{ 
	sLabel : (String) 노드명, 
	_aChildren : (Array) 자식노드 배열 
}
	 */
	getNodeData : function(elNode) {
		return (elNode) ? this._htNodeData[this._getNodeDataKey(elNode)] : this._htNodeData;
	},
	
	/**
	 * 노드의 데이터를 제거한다.
	 * 부모의 children에서도 제거한다.
	 * @param {HTMLElement} elNode
	 */
	_clearNodeData : function(elNode) {
		//todo
		var elParentNode = this.getParentNode(elNode);
		var htNodeData = this.getNodeData(elNode);
		var sKey = this._getNodeDataKey(elNode);
		
		if (elParentNode) {
			var htParentNodeData = this.getNodeData(elParentNode);
			if(htParentNodeData) {
				var nIndex = jindo.$A(htParentNodeData["_aChildren"]).indexOf(htNodeData);
				htParentNodeData["_aChildren"].splice(nIndex, 1);	
			}
		}

		//자식의 모든 노드 데이터도 재귀로 제거한다.
		var self = this;
		if (this.hasChild(elNode)) {
			jindo.$A(this.getChildNodes(elNode)).forEach(function(elNode){
				self._clearNodeData(elNode);
			});
		}

		delete this._htNodeData[sKey];
	},
	
	/**
	 * 노드를 펼친다
	 * @param {HTMLElement} elNode 펼칠 노드
	 * @param {Boolean} bChildAll 노드의 자식도 모두 펼칠지 여부
	 * @return {this}
	 */
	expandNode : function(elNode, bChildAll) {
		if (!this.fireEvent('beforeExpand', { element : elNode })) {
			return;
		}
		
		var htPart = this.getPartsOfNode(elNode);
		var aChildren = [];

		if (jindo.$$.test(htPart.elItem, '.' + this.htClassName.sHasChild)) {
			aChildren.push(elNode);
		}
		
		if (bChildAll) {
			aChildren = aChildren.concat(jindo.$$('.' + this.htClassName.sHasChild, elNode));	
		}

		for (var i = 0, elChild; (elChild = aChildren[i]); i++) {
			var elChildNode = this.getNode(elChild);
			jindo.$Element(elChildNode).removeClass(this.htClassName.sCollapsed);
			this.fireEvent('expand', { element : elChildNode });
		}
		
		return this;
	},
	
	/**
	 * 노드를 접는다
	 * @param {HTMLElement} elNode 접을 노드
	 * @param {Boolean} bChildAll 노드의 자식도 모두 펼칠지 여부
	 * @return {this}
	 */
	collapseNode : function(elNode, bChildAll) {
		if (!this.fireEvent('beforeCollapse', { element : elNode })) {
			return;
		}

		var htPart = this.getPartsOfNode(elNode);
		var aChildren = [];

		if (jindo.$$.test(htPart.elItem, '.' + this.htClassName.sHasChild)) {
			aChildren.push(elNode);
		}

		if (bChildAll) {
			aChildren = aChildren.concat(jindo.$$('.' + this.htClassName.sHasChild, elNode));
		}

		for (var i = 0, elChild; (elChild = aChildren[i]); i++) {
			var elChildNode = this.getNode(elChild);
			jindo.$Element(elChildNode).addClass(this.htClassName.sCollapsed);
			this.fireEvent('collapse', { element : elChildNode });
		}
		
		return this;
	},
	
	/**
	 * 노드를 선택한다.
	 * @param {HTMLElement} elNode 선택할 노드
	 * @return {Boolean} 선택여부
	 */
	selectNode : function(elNode) {
		var htPart = this.getPartsOfNode(elNode);
		var elSelectedNode = this.getSelectedNode();
		
		var elItem = htPart.elItem;

		if (!this.fireEvent('beforeSelect', { element : elNode })) {
			return false;
		}
		
		if (elSelectedNode != elNode) {
			this.deselectNode();
			jindo.$Element(elItem).addClass(this.htClassName.sSelected);
			
			this._setSelectedNode(elNode);
		} 
				
				
		this.fireEvent('select', { element : elNode });
		if (this.option("bExpandOnSelect") && elSelectedNode != elNode && this.isCollapsed(elNode)) {
			var self = this;
			this._bExpandOnSelect = true;
			setTimeout(function(){
				self._bExpandOnSelect = false;
			}, 500);
			this.expandNode(elNode);
		} 
		return true;
	},
	
	/**
	 * 선택된 노드를 선택해제한다.
	 * @return {this}
	 */
	deselectNode : function() {
		var elSelectedNode = this.getSelectedNode();
		if (elSelectedNode) {
			jindo.$Element(this.getPartsOfNode(elSelectedNode).elItem).removeClass(this.htClassName.sSelected);
		}
		this._setSelectedNode(null);
		return this;
	},
	
	_createChild : function(elNode) {
		var elChild = this.getChildListOfNode(elNode);
		if (!elChild) {
			elChild = jindo.$('<ul>');
			elNode.appendChild(elChild);
		}

		try {
			return elChild;
		} finally {
			elChild = null;
		}
	},
	
	/**
	 * 노드를 삭제한다.
	 * @param {HTMLElement} elNode 삭제할 노드
	 * @return {this}
	 */
	removeNode : function(elNode) {
		//루트노드틑 삭제할 수 없음
		if (!elNode || elNode === this.getRootNode()) {
			this.clearNode(elNode);
			return this;
		}
		
		var elParentNode = this.getParentNode(elNode);
		this._clearNodeData(elNode);
		elNode.parentNode.removeChild(elNode);
		
		this.selectNode(elParentNode);
		this._paintNode(elParentNode);
		return this;
	},
	
	/**
	 * 자식 노드를 모두 삭제한다.
	 * @param {HTMLElement} elNode 삭제할 노드들의 부모노드
	 * @return {Boolean} 삭제여부
	 */
	clearNode : function(elNode) {
		var elChild = this.getChildListOfNode(elNode);
		if (elChild) {
			var aChildLi = elChild.getElementsByTagName('li');
			for (var i = 0, elChildLi; (elChildLi = aChildLi[i]); i++) {
				this._clearNodeData(elChildLi);
			}
			
			elChild.parentNode.removeChild(elChild);
			this._paintNode(elNode);
			return true;
		} 
		return false;
	},
	
	/**
	 * 루트를 제외한 모든 노드를 제거한다.
	 * @return {this} 
	 */
	clearTree : function() {
		this.clearNode(this.getRootNode());
		return this;
	},
	
	_moveNodes : function(elTargetNode, aNodes, fCallback) {
		for (var i = 0, elNode; (elNode = aNodes[i]); i++) {
			fCallback(elNode);
		}
	},
	
	/**
	 * 특정 노드에 새 자식노드를 삽입한다. 
	 * @param {HTMLElement} elTargetNode 삽입할 노드의 부모가 될 노드
	 * @param {Array} aNodes 삽입할 노드의 배열
	 * @return {this}
	 */
	appendNode : function(elTargetNode, aNodes) {
		if (!(aNodes instanceof Array)) {
			return arguments.callee.call(this, elTargetNode, [aNodes]);
		}
		
		var self = this;
		var elChild = this._createChild(elTargetNode);
		this._moveNodes(elTargetNode, aNodes, function(elNode) {
			var elParentNode = null;
			elParentNode = self.getParentNode(elNode);
			
			elChild.appendChild(elNode);
			
			//원래의 부모와 그 부모의 자식
			if (elParentNode) {
				self.paintNode(elParentNode, false);
				jindo.$A(self.getChildNodes(elParentNode)).forEach(function(elChildNode){
					self.paintNode(elChildNode, false);	
				});
			}
		});
		
		//타겟
		this.paintNode(elTargetNode, false);
		
		//타겟의 자식 (자기 자신과 자신의 형제)
		jindo.$A(this.getChildNodes(elTargetNode)).forEach(function(elChildNode){
			self.paintNode(elChildNode, false);	
		});
		
		return this;
	},
	
	/**
	 * 특정 노드 앞 새 노드를 삽입한다. 
	 * @param {HTMLElement} elTargetNode 기준 노드 (루트노드가 될 수 없다)
	 * @param {Array} aNodes 삽입할 노드의 배열
	 * @return {this}
	 */
	insertNodeBefore : function(elTargetNode, aNodes) {
		if(elTargetNode == this.getRootNode()) {
			return;
		}
		
		if (!(aNodes instanceof Array)) {
			return arguments.callee.call(this, elTargetNode, [ aNodes ]);
		}

		var self = this;
		var elChildList = elTargetNode.parentNode;
		this._moveNodes(elTargetNode, aNodes, function(elNode) {
			
			var elParentNode = null;
			elParentNode = self.getNode(elChildList);
			
			elChildList.insertBefore(elNode, elTargetNode);
			
			//그 부모의 자식
			if (elParentNode) {
				jindo.$A(self.getChildNodes(elParentNode)).forEach(function(elChildNode){
					self.paintNode(elChildNode, false);	
				});
			}
		});
		
		return this;
	},
	
	/**
	 * 특정 노드 다음에 새 노드를 삽입힌다.
	 * @param {HTMLElement} elTargetNode 기준 노드 (루트노드가 될 수 없다)
	 * @param {Array} aNodes 삽입할 노드의 배열
	 * @return {this}
	 */
	insertNodeAfter : function(elTargetNode, aNodes) {
		if(elTargetNode == this.getRootNode()) {
			return;
		}
		
		if (!(aNodes instanceof Array)) {
			return arguments.callee.call(this, elTargetNode, [ aNodes ]);
		}
		
		var self = this;
		var elChildList = elTargetNode.parentNode;
		var elNextNode = elTargetNode;
		this._moveNodes(elTargetNode, aNodes, function(elNode) {
			
			var elParentNode = null;
			elParentNode = self.getNode(elChildList);
			 
			elChildList.insertBefore(elNode, elNextNode.nextSibling); 
			elNextNode = elNode;
			
			//그 부모의 자식
			if (elParentNode) {
				jindo.$A(self.getChildNodes(elParentNode)).forEach(function(elChildNode){
					self.paintNode(elChildNode, false);	
				});
			}
		});
		
		return this;
	},
	
	_getCode : function(aData) {
		if (aData instanceof Array) {
			var aCodes = [];
			var sTemplate = this.getNodeTemplate();
		
			for (var i = 0; i < aData.length; i++) {
				var htData = aData[i];
				var htParam = { sTemplate : sTemplate, htData : htData };
				this.fireEvent('beforeProcessData', htParam);
				
				var htProcess = {
					sNodeClass : this.htClassName.sNode,
					bLastNode : (i == aData.length - 1) ? true : false, 
					sLastNodeClass : this.htClassName.sLastNode,
					bHasChild : (typeof htData._aChildren != "undefined" && htData._aChildren.length > 0) ? true : false,
					sHasChildClass : this.htClassName.sHasChild,
					sCollapsedClass : this.htClassName.sCollapsed,
					sButtonClass : this.htClassName.sButton,
					sLabelClass : this.htClassName.sLabel,
					sText : htData.sLabel
				};
				
				var sCode = jindo.$Template(htParam.sTemplate).process(htProcess);
				sCode = this._getChildCode(htData._aChildren, sCode);
				aCodes.push(sCode);					 
			}
			return aCodes.join('\n');
		}
	},

	_getChildCode : function(elChild, sCode) {
		var sChild = elChild ? this._getCode(elChild) : '';
		if (sChild) {
			var bChanged = false;
			sCode = sCode.replace(/(<ul(\s[^>]*)*>)(<\/ul>)/i, function(_, sBegin, __, sClose) {
				bChanged = true;
				return sBegin + sChild + sClose;
			});
			if (!bChanged) {
				sCode = sCode.replace(/<\/li>/i, function(_) { return '\n<ul>' + sChild + '</ul>\n' + _; });
			}
		}
		return sCode;
	},	
	
	_setData : function(elChildListOfParentNode, aDatas) {
		var aNodes = jindo.$$("> ." + this.htClassName.sNode, elChildListOfParentNode);
		
		for (var i = 0; i < aNodes.length; i++) {
			var elNode = aNodes[i];
			var htNodeData = aDatas[i];
			
			var sKey = this._makeNodeDataKey(elNode);
			this._htNodeData[sKey] = aDatas[i];
			
			if (typeof htNodeData._aChildren != "undefined") {
				this._setData(this.getChildListOfNode(elNode), htNodeData._aChildren);
			}
		}
	},
	
	/**
	 * 노드를 생성한다.
	 * @param {Array} aDatas 생성할 노드의 정보
	 * @return {Array} 생성된 노드들의 배열
	 * @remark 노드를 생성하기 위해 하나의 노드는 label 스트링이 반드시 필요하고, 자식 노드는 _children 배열로 선언한다.
	 * @example 
//기본적인 데이터만을 포함하여 노드를 생성하는 예제
var aNewNodes = tree.createNode([
	{
		sLabel : '포유류',
		_aChildren : [
			{ sLabel : '고래' },
			{ sLabel : '토끼' },
			{ sLabel : '다람쥐' },
			{
				sLabel : '맹수',
				_aChildren : [
					{ sLabel : '호랑이' },
					{ sLabel : '표범' },
					{ sLabel : '사자' },
					{ sLabel : '재규어' }
				]
			}
		
		]
	},
	
	{ sLabel : '조류' }
]);
	 * @example
//노드별로 원하는 형태의 데이터를 설정하여 생성하는 예제
var aNodes = tree.createNode([
	{
		sLabel : '포유류',
		nType : 1,
		nValue : 15
	},
	{
		sLabel : '조류',
		nType : 2,
		nValue : 20
	}
]);
	 */
	createNode : function(aDatas) {
		var elDummy = jindo.$('<ul>');
		elDummy.innerHTML = this._getCode(aDatas);
		var aNodes = jindo.$$("> ." + this.htClassName.sNode, elDummy);
		this._setData(elDummy, aDatas);
		
		return aNodes;
	},
	
	/**
	 * 노드를 생성할 때 적용된 노드의 원시 데이터를 가져온다.
	 * @deprecated getNodeData
	 * @return {HashTable}
	 */
	getNodeRawData : function(elNode) {
		return this.getNodeData(elNode);
	},
	/**
	 * 노드가 연속으로 선택된 횟수를 가져온다.
	 * @return {Number}
	 * @deprecated
	 */
	getSelectCount : function() {
		return this;
	}
	
}).extend(jindo.UIComponent);

/**
 * @fileOverview Text Input의 Caret에 대한 제어를 가능하게 하는 컴포넌트
 * @version 0.4.5
 * @author hooriza, modified by senxation
 */
jindo.TextRange = jindo.$Class({
	/** @lends jindo.TextRange.prototype */
	/**
	 * TextRange 컴포넌트를 생성한다.
	 * TextRange 컴포넌트는 Text Input에서 Caret에 대한 control을 가능하게 한다.
	 * @constructs
	 * @class Text Input의 Caret에 대한 제어를 가능하게 하는 컴포넌트
	 * @extends jindo.UIComponent
	 * @see jindo.Formatter
	 * @see jindo.NumberFormatter
	 * @param {HTMLElement} el 대상 TextInput 엘리먼트
	 * @param {HashTable} htOption 옵션 해시테이블
	 * @example
var oTextRange = new jindo.TextRange(jindo.$("foo"), {
	bActivateOnload : true //인스턴스화이후 activate수행 여부
});
	 */	
	$init : function(el, htOption) {
		this.option({
			bActivateOnload : true
		});
		this.option(htOption || {});
		this._el = jindo.$(el);
		this._bFocused = false;
		
		this._wfFocus = jindo.$Fn(function() { this._bFocused = true; }, this);
		this._wfBlur = jindo.$Fn(function() { this._bFocused = false; }, this);
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	_onActivate : function() {
		this._wfFocus.attach(this._el, 'focus').attach(this._el, 'keydown');
		this._wfBlur.attach(this._el, 'blur');
	},
	
	_onDeactivate : function() {
		this._wfFocus.detach(this._el, 'focus').detach(this._el, 'keydown');
		this._wfBlur.detach(this._el, 'blur');
	},
	
	/**
	 * TextInput에 focus 되어있는지 여부를 가져온다.
	 * @return {Boolean} TextInput에 focus 되어있는지 여부
	 */
	hasFocus : function() {
		return this._bFocused;
	},
	
	/**
	 * Caret이 선택된 영역을 가져온다.
	 * @return {Array} Caret의 시작위치와 끝위치
	 */
	getSelection : function() {
		var el = this._el;

		if (!this._bFocused) {
			this._el.focus();
		}
			
		var aSelection = [ -1, -1 ];
		
		if (isNaN(this._el.selectionStart)) { //IE
			var oRange = document.selection.createRange().duplicate(),
				nLength = el.value.length,
				nRangeLength = oRange.text.length;
			
			for (var i = 0; i < nLength; i++) {
				if (oRange.parentElement() !== el) {
					break;					
				}
				oRange.moveStart('character', -1);
			}
			aSelection[1] = oRange.text.length;
			aSelection[0] = aSelection[1] - nRangeLength;
		} else {
			aSelection[0] = el.selectionStart;
			aSelection[1] = el.selectionEnd;
		}
		
		this.setSelection(aSelection[0], aSelection[1]);
		return aSelection;
	},
	
	/**
	 * Caret의 선택영역을 설정한다.
	 * @remark nStart, nEnd를 동일하게 지정하거나 nEnd 생략시 nStart로 지정된 위치로 캐럿을 이동한다. 
	 * @param {Number} nStart 시작지점
	 * @param {Number} nEnd 끝지점 (생략가능)
	 */
	setSelection : function(nStart, nEnd) {
		var el = this._el;
		if (typeof nEnd == 'undefined') {
			nEnd = nStart;
		}
		
		if (el.setSelectionRange) {
			el.setSelectionRange(nStart, nEnd);
		} else if (el.createTextRange) { //IE
			var oRange = el.createTextRange();
			oRange.collapse(true);
			oRange.moveStart("character", nStart);
			oRange.moveEnd("character", nEnd - nStart);
			oRange.select();
		}
	},
	
	/**
	 * 선택된 selection의 문자열을 가져옴
	 * @return {String} 선택된 selection의 문자열
	 */
	copy : function() {
		if (!this._bFocused) {
			this._el.focus();
		}
		var aSelection = this.getSelection();
		return this._el.value.substring(aSelection[0], aSelection[1]);
	},

	/**
	 * 선택된 selection에 문자열을 붙여넣음
	 * @param {String} sStr 붙여넣을 문자열
	 */
	paste : function(sStr) {
		if (!this._bFocused) {
			this._el.focus();
		}
		
		var el = this._el,
			aSelection = this.getSelection(),
			sValue = el.value,
			sPre = sValue.substr(0, aSelection[0]),
			sPost = sValue.substr(aSelection[1]);
	
		sValue = sPre + sStr + sPost;
		el.value = sValue;
	
		this.setSelection(aSelection[0] + sStr.length);
	},
	
	/**
	 * 선택된 selection의 문자열을 잘라냄
	 * @return {String} 선택된 selection의 문자열
	 */
	cut : function() {
		var s = this.copy();
		this.paste("");
	
		return s;
	}
}).extend(jindo.UIComponent);

/**
 * @fileOverview input[type=text] 또는 textarea와 같은 입력 컨트롤에 입력여부를 감지하는 컴포넌트
 * @author senxation
 * @version 0.5.5
 */
jindo.WatchInput = jindo.$Class({
	/** @lends jindo.WatchInput.prototype */
	
	_bTimerRunning : false,
	_bFocused : false,
	_sPrevValue : "",
	
	/**
	 * WatchInput 컴포넌트를 생성한다.
	 * IE에서는 "keyup" 이벤트를 감지하고, 그외의 브라우저에서는 focus되었을때 이전값에서의 변화를 비교하는 타이머가 시작되고 blur되었을때 타이머가 종료된다. 
	 * @constructs
	 * @class input[type=text] 또는 textarea와 같은 입력 컨트롤에 입력여부를 감지하는 컴포넌트
	 * @param {String | HTMLElement} sInputId 적용할 입력 컨트롤의 id혹은 엘리먼트 자체
	 * @param {HashTable} htOption 옵션 객체
	 * @extends jindo.UIComponent
	 * @requires jindo.Timer
	 * @example
var oWatchInput = new jindo.WatchInput("input", {
	nInterval : 100, //Check할 간격 (IE제외)
	bUseTimerOnIE : false, //IE에서 키보드 이벤트를 사용해서 감지할 경우 false로 지정. 다른 브라우저처럼 타이머로 체크하고자하는 경우 true로 설정
	sKeyEvent : "keyup", //attach할 키보드 이벤트 (IE만 해당)
	bPermanent : false, //입력창의 focus/blur에 상관없이 항상 타이머가 동작할지 여부. 중단을 위해서 반드시 stop()이나 deactivate()메소드 호출 필요.(IE제외) 
	bActivateOnload : true //로드시 activate() 수행여부
}).attach({
	start : function(oCustomEvent) {
		//감지를 시작했을 때 발생
	},
	stop : function(oCustomEvent) {
		//감지를 중단했을 때 발생
	},
	focus : function(oCustomEvent) {
		//입력 컨트롤에 focus되었을 때 발생
	},
	blur : function(oCustomEvent) {
		//입력 컨트롤에 blur(포커스 해제)되었을 때 발생
	},
	timerStart : function(oCustomEvent) {
		//IE를 제외한 브라우저에서는 한글입력시 KeyEvent이벤트가 발생하지 않으므로 timer를 이용해 감지한다
		//timer가 시작됬을 때 발생
	},
	change : function(oCustomEvent) {
		//입력 컨트롤 값이 변경 되었을 경우 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elInput : (HTMLElement) 입력 컨트롤
		//	sText : (String) 변화된 input의 값
		//}
	},
	timerStop : function(oCustomEvent) {
		//IE를 제외한 브라우저에서는 한글입력시 KeyEvent이벤트가 발생하지 않으므로 timer를 이용해 감지한다
		//timer가 중지됬을 때 발생
	}
});
	 */
	$init : function(sInputId, htOption) {
		var htDefaultOption = {
			nInterval : 100, //Check할 간격 (IE제외)
			bUseTimerOnIE : false, //IE에서 키보드 이벤트를 사용해서 감지할 경우 false로 지정. 다른 브라우저처럼 타이머로 체크하고자하는 경우 true로 설정
			sKeyEvent : "keyup", //attach할 키보드 이벤트 (IE만 해당)
			bPermanent : false, //입력창의 focus/blur에 상관없이 항상 타이머가 동작할지 여부. 중단을 위해서 반드시 stop()이나 deactivate()메소드 호출 필요.(IE제외) 
			bActivateOnload : true //로드시 activate() 수행여부
		};
		
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		this._elInput = jindo.$(sInputId);
		this._oTimer = new jindo.Timer();
		
		this._bIE = jindo.$Agent().navigator().ie;
		this._wfFocus = jindo.$Fn(this._onFocus, this);
		this._wfBlur = jindo.$Fn(this._onBlur, this);
		this._wfKeyEvent = jindo.$Fn(this._onKeyEvent, this);
		this._wfStartTimer = jindo.$Fn(this._startTimer, this);
		this._wfStopTimer = jindo.$Fn(this._stopTimer, this);
		
		if (this.option("bActivateOnload")) {
			this.activate(true);
		}
	},
	
	/**
	 * WatchInput이 적용된 Input 엘리먼트를 가져온다.
	 * @return {HTMLElement}
	 */
	getInput : function() {
		return this._elInput;
	},
	
	/**
	 * WatchInput이 적용된 Input 엘리먼트의 value를 설정한다.
	 * @remark WatchInput이 적용된 Input 엘리먼트의 값을 키입력 외에 임의로 변경할 때에는 이 메소드를 사용하는 것을 권장한다.
	 * @return {this}
	 * @see setCompareValue
	 * @example
//input값을 변경할 경우
oWatchInput.setInputValue("테스트");
//또는 아래와 같이 사용한다.
oWatchInput.getInput().value = "테스트";
oWatchInput.setCompareValue("테스트"); //input의 value와 같은 값으로 설정한다.
	 */
	setInputValue : function(s) {
		this.getInput().value = s;
		this.setCompareValue(s);
		return this;
	},	
	
	/**
	 * 현재의 input value와 비교될 이전 Input의 value를 구한다.
	 * @return {String} 
	 */
	getCompareValue : function() {
		return this._sPrevValue;
	},
	
	/**
	 * 현재의 input value와 비교할 값을 설정한다.
	 * @remark IE의 keydown이 발생하지 않거나 FF의 timer가 동작하지 않는 상황에서 input의 value를 변경하면 예기치 않은 change이벤트가 발생하기 때문에 변경된 값과 동일하게 비교할 값을 설정하여 예외처리한다.
	 * @param {String} s
	 * @return {this}
	 * @example
oWatchInput.getInput().value = "테스트";
oWatchInput.setCompareValue("테스트"); //input의 value와 같은 값으로 설정한다. 
	 */
	setCompareValue : function(s) {
		this._sPrevValue = s;
		return this;
	},
	
	/**
	 * 이전 값과의 비교없이 강제로 change 이벤트를 발생시킨다.
	 * @return {this}
	 */
	fireChangeEvent : function() {
		var elInput = this.getInput(),
			sValue = elInput.value;
		this.setCompareValue(sValue);
		this.fireEvent("change", {
			elInput : elInput, 
			sText : sValue
		});
		return this;
	},
	
	/**
	 * 감지를 시작한다.
	 * 감지의 중단은 인터벌 시간 이후에 일어난다.
	 * IE에서는 KeyEvent 이벤트를 감지한다.
	 * 그외의 브라우저에서는 input에 focus되면 Timer를 사용해 주기적인 비교가 시작되고 blur시 중단된다.
	 * @param {Boolean} bCompareOnce
	 * @deprecated activate
	 */
	start : function(bCompareOnce) {
		return this.activate(bCompareOnce || false);
	},
	
	/**
	 * 감지를 중단한다.
	 * @deprecated deactivate
	 */
	stop : function() {
		return this.deactivate();
	},
	
	/**
	 * 컴포넌트를 활성화한다.
	 * @param {Boolean} bCompareOnce 초기화이후 IE의 키보드 이벤트와 그외 브라우저의 Focus이후 Timer동작과 상관없이 최초 1회 비교할지 여부
	 * @return {this}
	 */
	_onActivate : function(bCompareOnce) {
		this.setCompareValue("");
		var elInput = this.getInput();
		
		this._wfFocus.attach(elInput, "focus");
		if(this._bIE && !this.option("bUseTimerOnIE")) {
			this.fireEvent("start");
			this._wfKeyEvent.attach(elInput, this.option("sKeyEvent"));	
		} else {
			if (this._isTimerRunning()) {
				return;
			}
			
			this.fireEvent("start");
			if (this.option("bPermanent")) {
				this._startTimer();
			} else {
				this._wfStartTimer.attach(elInput, "focus");
				this._wfStopTimer.attach(elInput, "blur");
			}
		}
		
		this._wfBlur.attach(elInput, "blur");
		
		if (bCompareOnce || false) {
			this.compare();
		}
	},

	_onDeactivate : function() {
		var elInput = this.getInput();
		this._wfFocus.detach(elInput, "focus");
		this._wfKeyEvent.detach(elInput, this.option("sKeyEvent"));
		this._stopTimer();
		this._wfStartTimer.detach(elInput, "focus");
		this._wfStopTimer.detach(elInput, "blur");
		this._wfBlur.detach(elInput, "blur");
		this.fireEvent("stop");
	},
	
	/**
	 * 값을 비교할 시간 간격을 가져온다.
	 * @return {Number} ms 단위의 시간 
	 */
	getInterval : function() {
		return this.option("nInterval");
	},
	
	/**
	 * 값을 비교할 시간 간격을 설정한다.
	 * @remark IE제외
	 * @param {Number} n
	 * @return {this}
	 */
	setInterval : function(n) {
		this.option("nInterval", n);
		return this;
	},
	
	_isTimerRunning : function() {
		return this._bTimerRunning;
	},
	
	_startTimer : function() {
		if(this._isTimerRunning()) {
			return;
		}
		
		this._bTimerRunning = true;
		this.fireEvent("timerStart");
		this.compare();
		
		var self = this;
		this._oTimer.start(function(){
			self.compare();
			return true;
		}, this.getInterval());
	},
	
	_stopTimer : function() {
		if (this._isTimerRunning()) {
			this._oTimer.abort();
			this._bTimerRunning = false;
			this.compare(); //타이머를 중지하고 비교 1회수행
			this.fireEvent("timerStop");
		}
	},
	
	_onKeyEvent : function() {
		this.compare();
	},	
	
	_onFocus : function() {
		this._bFocused = true;
		this.fireEvent("focus");
	},
	
	_onBlur : function() {
		this._bFocused = false;
		this.fireEvent("blur");
	},
	
	/**
	 * 이전의 비교값과 현재 설정된 값을 강제 비교한다.
	 * @remark IE에서의 key이벤트나, 기타 브라우저의 timer 동작과 관계없이 즉시 비교를 수행한다. (즉, Text Input에 focus될 필요가 없다.) 수행후 값이 바뀐경우 change 커스텀이벤트를 발생한다.
	 * @return {this}
	 */
	compare : function(){
		if (this.getInput().value != this.getCompareValue()) {
			this.fireChangeEvent();						
		}
		return this;
	}
}).extend(jindo.UIComponent);
/**
 * @fileOverview 타이머의 사용을 편리하게 해주는 컴포넌트. 함수를 지정한 시간이 지난 후에 실행한다.
 * @author hooriza, modified by senxation
 * @version 0.4.1
 */

jindo.Timer = jindo.$Class({
	/** @lends jindo.Timer */

	/**
	 * Timer 컴포넌트를 생성한다.
	 * @constructs
	 * @class 타이머의 사용을 편리하게 해주는 컴포넌트
	 * @extends jindo.Component
	 * @example
var oTimer = new jindo.Timer().attach({
	wait : function(oCustomEvent) {
		//Timer의 수행을 기다리기 시작한 시점에 발생
	},
	abort : function(oCustomEvent) {
		//Timer의 수행을 강제로 종료되었을 때 발생
	},
	run : function(oCustomEvent) {
		//Timer의 동작이 수행될 때 발생
	},
	end : function(oCustomEvent) {
		//Timer의 동작이 종료될 때 발생
	}
});
	 * @example
이벤트 목록
wait : 함수가 실행될 때까지 지정한 시간만큼 기다리기 전에 발생한다
abort : 인스턴스 외부에서 abort() 함수를 호출해 강제로 타이머를 종료시켰을때 발생한다
run : 함수가 실행되기 직전에 발생한다
end : 함수가 false 를 리턴해서 내부적으로 종료시켰을 때 발생한다
 	 */
	$init : function() { 
		this._nTimer = null;
		this._nLatest = null;
		this._nRemained = 0;
		this._nDelay = null;
		this._fRun = null;
		this._bIsRunning = false;
	},
	
	/**
	 * 함수를 지정한 시간이 지난 후에 실행한다. 실행 함수가 true 를 리턴하면 setInterval 을 사용한 것처럼 계속 반복해서 수행된다.
	 * @param {Function} fCallback	지정된 지연 시간 이후에 실행 될 함수
	 * @param {Number} nDelay	msec 단위의 지연 시간
	 * @return {Boolean} 항상 true
	 * @example
var o = new jindo.Timer();
o.start(function() {
	// ...
	return true;
}, 100);
	 */
 	start : function(fRun, nDelay) {
		this.abort();
		
		this._nRemained = 0;
		this._nDelay = nDelay;
		this._fRun = fRun;
		
		this._bIsRunning = true;
		this._nLatest = this._getTime();
		this.fireEvent('wait');
		this._excute(this._nDelay, false);
		
		return true;
	},
	
	/**
	 * 타이머의 동작 여부를 가져온다.
	 * @return {Boolean} 동작중이면 true, 그렇지 않으면 false
	 */
	isRunning : function() {
		return this._bIsRunning;
	},
	
	_getTime : function() {
		return new Date().getTime();
	},
	
	_clearTimer : function() {
		var bFlag = false;
		
		if (this._nTimer) {
			clearInterval(this._nTimer);
			this._bIsRunning = false;
			bFlag = true;
		}
		
		this._nTimer = null;
		return bFlag;
	},
	
	/**
	 * 현재 대기상태에 있는 타이머를 중단시킨다.
	 * @return {Boolean} 이미 멈춰있었으면 false, 그렇지 않으면 true
	 */
	abort : function() {
		var bReturn = this._clearTimer();
		if (bReturn) {
			this.fireEvent('abort');
			this._fRun = null;
		}
		return bReturn;
	},
	
	/**
	 * 현재 동작하고 있는 타이머를 일시정지 시킨다.
	 * @return {Boolean} 이미 멈춰있었으면 false, 그렇지 않으면 true
	 */
	pause : function() {
		var nPassed = this._getTime() - this._nLatest;
		this._nRemained = Math.max(this._nDelay - nPassed, 0);
		
		return this._clearTimer();
	},
	
	_excute : function(nDelay, bResetDelay) {
		var self = this;
		this._clearTimer();
	
		this._bIsRunning = true;
		this._nTimer = setInterval(function() {
			if (self._nTimer) { //self._nTimer가 null일때도 간헐적으로 수행되는 버그가 있어 추가
				self.fireEvent('run');
				
				var r = self._fRun();
				self._nLatest = self._getTime();
				
				if (!r) {
					clearInterval(self._nTimer);
					self._nTimer = null;
					self._bIsRunning = false;
					self.fireEvent('end');
					return;
				}
				
				self.fireEvent('wait');
				if (bResetDelay) {
					self._excute(self._nDelay, false);
				}
			}							   
		}, nDelay);
	},
	
	/**
	 * 일시정지 상태인 타이머를 재개시킨다.
	 * @return {Boolean} 재개에 성공했으면 true, 그렇지 않으면 false
	 */
	resume : function() {
		if (!this._fRun || this.isRunning()) {
			return false;
		}
		
		this._bIsRunning = true;
		this.fireEvent('wait');
		this._excute(this._nRemained, true);
		this._nRemained = 0;
		return true;
	}
}).extend(jindo.Component);

/**
 * @fileOverview 특정 엘리먼트로부터 상대적인 레이어의 위치를 구한다. 
 * @author senxation
 * @version 0.2.4
 */

jindo.LayerPosition = jindo.$Class({
	/** @lends jindo.LayerPosition.prototype */

	/**
	 * 컴포넌트를 생성한다.
	 * 위치를 설정할 레이어 엘리먼트는 document.body의 바로 아래에 존재해야야 한다.
	 * 그렇지 않을 경우 강제로 document.body로 이동된다.
	 * @constructs
	 * @class 레이어를 지정된 엘리먼트에 상대적으로 위치시켜주는 컴포넌트 
	 * @param {HTMLElement} el 기준이 되는 엘리먼트, document.body도 가능하다
	 * @param {HTMLElement} elLayer 위치를 설정할 레이어 엘리먼트
	 * @param {HashTable} htOption 옵션 객체
	 * @extends jindo.Component
	 * @example
var oLayerPosition = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer26"), { 
	sPosition: "outside-bottom", //레이어를 띄울 위치. 총 17가지의 위치를 가질 수 있다.
	sAlign: "left", //레이어의 위치가 top/bottom일 때 좌우 정렬 값 "left" || "center" || "middle" 
	sValign: "", //레이어의 위치가 left/right일 때 상하 정렬 값 "top" || "middle" || "bottom"
	nTop: 0, //기준 레이어와의 y좌표의 차이
	nLeft: 0, //기준 레이어와의 x좌표의 차이
	bAuto: false //자동정렬 여부. 스크롤과 브라우저창의 크기가 변경될 때 레이어 위치를 다시 조정한다.
}).attach({
	beforeAdjust : function(oCustomEvent){
		//bAuto 옵션에 의해 자동으로 위치가 조정되기 전에 발생
		//이벤트 객체 oCustomEvent = {
		//	elLayer : {HTMLElement} 레이어 엘리먼트
		//	htCurrentPosition : {HashTable} 현재 위치
		//	htAdjustedPosition : {HashTable} 이동될 위치
		//}
		//oCustomEvent.stop(); 수행시 조정되지 않음
	},
	adjust : function(oCustomEvent){
		//bAuto 옵션에 의해 자동으로 위치가 조정된 이후에 발생
		//이벤트 객체 oCustomEvent = {
		//	elLayer : {HTMLElement} 레이어 엘리먼트
		//	htCurrentPosition : {HashTable} 조정된 현재 위치
		//}
	}
});
     * @example
htOption.sPosition = "outside-top-left" || "outside-top" || "outside-top-right" || "outside-right" || "outside-bottom-right" || "outside-bottom" || "outside-bottom-left" || "outside-left" || "inside-top-left" || "inside-top" || "inside-top-right" || "inside-right" || "inside-bottom-right" || "inside-bottom" || "inside-bottom-left" || "inside-left" || "inside-center" 
	 */
	$init: function(el, elLayer, htOption){
		this.option({
			sPosition: "outside-bottom",
			sAlign: "left",
			sValign: "",
			nTop: 0,
			nLeft: 0,
			bAuto: false
		});
		this.option(htOption || {});
		this.setElement(el);
		if (elLayer) {
			this.setLayer(elLayer);
		}
		if (el && elLayer) {
			this.setPosition();	
		}
		
		this._wfSetPosition = jindo.$Fn(function(){
			var el = this._elLayer;
			if (el && this._welLayer.visible()){
				if (this.fireEvent("beforeAdjust", {
						elLayer : el,
						htCurrentPosition : this.getCurrentPosition(),
						htAdjustedPosition : this._adjustPosition(this.getCurrentPosition())					
					})) {
					this.setPosition();
					this.fireEvent("adjust", {
						elLayer : el,
						htCurrentPosition : this.getCurrentPosition()
					});
				}
			}
		}, this);
		
		if (this.option("bAuto")) {
			this._wfSetPosition.attach(window, "scroll").attach(window, "resize");				
		}
	},
	
	/**
	 * 기준 엘리먼트를 구한다.
	 * @return {HTMLElement}
	 */
	getElement : function() {
		return this._el;
	},
	
	/**
	 * 기준 엘리먼트를 설정한다.
	 * @param {HTMLElement}
	 * @return {this} 인스턴스 자신
	 */
	setElement : function(el) {
		this._el = jindo.$(el);
		this._wel = jindo.$Element(el);
		return this;
	},
	
	/**
	 * 레이어 엘리먼트를 구한다.
	 * @return {HTMLElement}
	 */
	getLayer : function() {
		return this._elLayer;
	},
	
	/**
	 * 레이어 엘리먼트를 설정한다. 설정된 엘리먼트는 document.body에 append된다.
	 * @param {HTMLElement}
	 * @return {this} 인스턴스 자신
	 */
	setLayer : function(elLayer) {
		this._elLayer = jindo.$(elLayer);
		this._welLayer = jindo.$Element(elLayer);
		document.body.appendChild(elLayer);
		return this;
	},
	
	_isPosition : function(htOption, sWord) {
		if (htOption.sPosition.indexOf(sWord) > -1) {
			return true;
		}
		return false;
	},
	
	_setLeftRight : function (htOption, htPosition){
		var el = this.getElement(),
			elLayer = this.getLayer(),
			nWidth = el.offsetWidth,// + parseInt(wel.css('marginLeft')) + parseInt(wel.css('marginRight'));
			nLayerWidth = elLayer.offsetWidth;
			
		if (el == document.body) {
			nWidth = jindo.$Document().clientSize().width;
		}
		
		var bLeft = this._isPosition(htOption, "left"),
			bRight = this._isPosition(htOption, "right"),
			bInside = this._isPosition(htOption, "inside");
		
		
		if (bLeft) {
			if (bInside) {
				htPosition.nLeft += htOption.nLeft;
			} else {
				htPosition.nLeft -= nLayerWidth;
				htPosition.nLeft -= htOption.nLeft;					
			}
		} else if (bRight) {
			htPosition.nLeft += nWidth;
			if (bInside) {
				htPosition.nLeft -= nLayerWidth;
				htPosition.nLeft -= htOption.nLeft;
			} else {
				htPosition.nLeft += htOption.nLeft;
			}
		} else {
			if (htOption.sAlign == "left") {
				htPosition.nLeft += htOption.nLeft;	
			}
			
			if (htOption.sAlign == "center") {
				htPosition.nLeft += (nWidth - nLayerWidth) / 2;
			}
				
			if (htOption.sAlign == "right") {
				htPosition.nLeft += nWidth - nLayerWidth;
				htPosition.nLeft -= htOption.nLeft;	
			}
		}
		return htPosition;
	},
	
	_setVerticalAlign : function (htOption, htPosition) {
		var el = this.getElement(),
			elLayer = this.getLayer(),
			nHeight = el.offsetHeight,// + parseInt(wel.css('marginTop')) + parseInt(wel.css('marginBottom'));
			nLayerHeight = elLayer.offsetHeight;
			
		if (el == document.body) {
			nHeight = jindo.$Document().clientSize().height;
		}
		
		switch (htOption.sValign) {
			case "top" :
				htPosition.nTop += htOption.nTop;	
			break;
			case "middle" :
				htPosition.nTop += (nHeight - nLayerHeight) / 2;
			break;
			case "bottom" :
				htPosition.nTop += nHeight - nLayerHeight - htOption.nTop;
			break;
		}
		
		return htPosition;
	},
	
	_adjustScrollPosition : function(htPosition) {
		/* 기준 엘리먼트가 body인 경우 scroll 포지션에 따른 보정 */
		if (this.getElement() == document.body) {
			var htScrollPosition = jindo.$Document().scrollPosition();
			htPosition.nTop += htScrollPosition.top;	
			htPosition.nLeft += htScrollPosition.left;
		}
		return htPosition;
	},
	
	/**
	 * 옵션에 해당하는 레이어의 위치를 구한다.
	 * @param {HashTable} htOption
	 * @return {HashTable} htPosition
	 * @example
oLayerPosition.getPosition({
	sPosition: "outside-bottom",
	sAlign: "left",
	sValign: "",
	nTop: 10, //지정되지 않으면 0으로 설정된다.
	nLeft: 10 //지정되지 않으면 0으로 설정된다.
}); 

(return value) htPosition = {
	nTop : (Number) 문서상의 y좌표
	nLeft : (Number) 문서상의 x좌표
} 
	 */
	getPosition : function(htOption) {
		if (typeof htOption != "object") {
			htOption = this.option();
		} 
		if (typeof htOption.nTop == "undefined") {
			htOption.nTop = 0;
		}
		if (typeof htOption.nLeft == "undefined") {
			htOption.nLeft = 0;
		}
		
		var sArea,
			bCenter = this._isPosition(htOption, "center"),
			bInside = this._isPosition(htOption, "inside"),
			
			bTop = this._isPosition(htOption, "top"),
			bBottom = this._isPosition(htOption, "bottom"),
			bLeft = this._isPosition(htOption, "left"),
			bRight = this._isPosition(htOption, "right");
		
		if (bLeft) {
			sArea = "left";
		}
		if (bRight) {
			sArea = "right";
		}
		if (bTop) {
			sArea = "top";
		}
		if (bBottom) {
			sArea = "bottom";
		}
		if (bCenter){
			sArea = "center";
		}
		
		var el = this.getElement(),
			wel = jindo.$Element(el),
			elLayer = this.getLayer(),
			welLayer = jindo.$Element(elLayer),
			htElementPosition = wel.offset(),
			nWidth = el.offsetWidth,// + parseInt(wel.css('marginLeft')) + parseInt(wel.css('marginRight'));
			nHeight = el.offsetHeight,// + parseInt(wel.css('marginTop')) + parseInt(wel.css('marginBottom'));
			oClientSize,
			nLayerWidth = elLayer.offsetWidth,
			nLayerHeight = elLayer.offsetHeight,
			htPosition = {
				nTop: htElementPosition.top,
				nLeft: htElementPosition.left
			};
			
		if (el == document.body) {
			oClientSize = jindo.$Document().clientSize();
			nWidth = oClientSize.width;
			nHeight = oClientSize.height;
		}
		
		//Layer에 마진이 있는경우 렌더링 보정.
		nLayerWidth += parseInt(welLayer.css('marginLeft')) + parseInt(welLayer.css('marginRight')) || 0;
		nLayerHeight += parseInt(welLayer.css('marginTop')) + parseInt(welLayer.css('marginBottom')) || 0;
		
		switch (sArea) {
			case "center" :
				htPosition.nTop += (nHeight - nLayerHeight) / 2;
				htPosition.nTop += htOption.nTop;
				htPosition.nLeft += (nWidth - nLayerWidth) / 2;
				htPosition.nLeft += htOption.nLeft;
			break;
			case "top" :
				if (bInside) {
					htPosition.nTop += htOption.nTop;	
				} else {
					htPosition.nTop -= htOption.nTop + nLayerHeight;
				}
				htPosition = this._setLeftRight(htOption, htPosition);
			break;
			case "bottom" :
				htPosition.nTop += nHeight;
				if (bInside) {
					htPosition.nTop -= htOption.nTop + nLayerHeight;
				} else {
					htPosition.nTop += htOption.nTop;
				}
				htPosition = this._setLeftRight(htOption, htPosition);
			break;
			case "left" :
				if (bInside) {
					htPosition.nLeft += htOption.nLeft;
				} else {
					htPosition.nLeft -= htOption.nLeft + nLayerWidth;
				}
				htPosition = this._setVerticalAlign(htOption, htPosition);
			break;
			case "right" :
				htPosition.nLeft += nWidth;
				if (bInside) {
					htPosition.nLeft -= htOption.nLeft + nLayerWidth;
				} else {
					htPosition.nLeft += htOption.nLeft;
				}
				htPosition = this._setVerticalAlign(htOption, htPosition);
			break;
		}
		
		htPosition = this._adjustScrollPosition(htPosition);
		return htPosition;
	},
	
	/**
	 * 레이어를 지정된 옵션에 맞게 위치시킨다.
	 * @param {HashTable} htPosition 위치에 대한 객체 (생략시, 설정된 옵션에 따라 자동으로 계산된다)
	 * @return {this} 인스턴스 자신
	 * @remark css의 top, left 속성으로 위치를 설정한다. 
	 * @example
oLayerPosition.setPosition({ nTop : 100, nLeft : 100 }); 
	 */
	setPosition : function(htPosition){
		var welLayer = jindo.$Element(this.getLayer());
		welLayer.css("left", "-9999px").css("top", "0px");
		
		if (typeof htPosition == "undefined") {
			htPosition = this.getPosition();
		}
		if (this.option("bAuto")) {
			htPosition = this._adjustPosition(htPosition);
		}
		welLayer.css("left", htPosition.nLeft + "px").css("top", htPosition.nTop + "px"); //offset으로 설정할경우 간혹 수치가 맞지 않음
		return this;
	},
	
	/**
	 * 현재 레이어의 위치를 구한다.
	 * @return {HashTable}
	 * @remark 설정된 css의 top, left 속성값을 숫자값으로 리턴한다.
	 * @example
(return value) htPosition = {
	nTop : (Number) 문서상의 y좌표
	nLeft : (Number) 문서상의 x좌표
} 
	 */
	getCurrentPosition : function() {
		var welLayer = jindo.$Element(this.getLayer());
			
		return {
			nTop : parseInt(welLayer.css("top")),
			nLeft : parseInt(welLayer.css("left"))
		};
	},
	
	/**
	 * 레이어 전체가 화면에 보이는지 여부를 가져온다.
	 * @param {HashTable} htPosition
	 * @return {Boolean}
	 * @ignore
	 */
	_isFullyVisible : function(htPosition){
		var elLayer = this.getLayer(),
			welLayer = jindo.$Element(elLayer),
			oScrollPosition = jindo.$Document().scrollPosition(),
			nScrollTop = oScrollPosition.top, 	//top
			nScrollLeft = oScrollPosition.left,	//left
			oClientSize = jindo.$Document().clientSize(),
			nLayerWidth = elLayer.offsetWidth + (parseInt(welLayer.css('marginLeft')) + parseInt(welLayer.css('marginRight')) || 0),
			nLayerHeight = elLayer.offsetHeight + (parseInt(welLayer.css('marginTop')) + parseInt(welLayer.css('marginBottom')) || 0);
		
		if (htPosition.nLeft >= 0 && 
			htPosition.nTop >= 0 && 
			oClientSize.width >= htPosition.nLeft - nScrollLeft + nLayerWidth && 
			oClientSize.height >= htPosition.nTop - nScrollTop + nLayerHeight) {
			return true;
		}
		return false;
	},
	
	/**
	 * 가로방향으로 반전되어 배치되도록 변환된 옵션 객체를 가져온다.
	 * @param {HashTable} htOption
	 * @return {HashTable} htOption
	 * @ignore
	 */
	_mirrorHorizontal : function(htOption) {
		if (htOption.sAlign == "center" || htOption.sPosition == "inside-center") {
			return htOption;
		}
		
		var htConvertedOption = {};
		for (var i in htOption) {
			htConvertedOption[i] = htOption[i];
		}
		
		if (this._isPosition(htConvertedOption, "right")) {
			htConvertedOption.sPosition = htConvertedOption.sPosition.replace(/right/, "left");
		} else if (this._isPosition(htConvertedOption, "left")) {
			htConvertedOption.sPosition = htConvertedOption.sPosition.replace(/left/, "right");
		} else if (htConvertedOption.sAlign == "right") {
			htConvertedOption.sAlign = "left";
		} else if (htConvertedOption.sAlign == "left") {
			htConvertedOption.sAlign = "right";
		}
		
		return htConvertedOption;
	},
	
	/**
	 * 세로방향으로 반전되어 배치되도록 변환된 옵션 객체를 가져온다.
	 * @param {HashTable} htOption
	 * @return {HashTable} htOption
	 * @ignore
	 */
	_mirrorVertical : function(htOption) {
		if (htOption.sValign == "middle" || htOption.sPosition == "inside-center") {
			return htOption;
		}
		
		var htConvertedOption = {};
		for (var i in htOption) {
			htConvertedOption[i] = htOption[i];
		}
		
		if (this._isPosition(htConvertedOption, "top")) {
			htConvertedOption.sPosition = htConvertedOption.sPosition.replace(/top/, "bottom");
		} else if (this._isPosition(htConvertedOption, "bottom")) {
			htConvertedOption.sPosition = htConvertedOption.sPosition.replace(/bottom/, "top");
		} else if (htConvertedOption.sValign == "top") {
			htConvertedOption.sValign = "bottom";
		} else if (htConvertedOption.sValign == "bottom") {
			htConvertedOption.sValign = "top";
		}
		
		return htConvertedOption;
	},
	
	/**
	 * 레이어가 항상 보이도록 위치를 자동 조절한다.
	 * 우선순위는 가로 반전, 세로반전, 가로세로반전 순이다.
	 * 모든 경우에도 레이어 전체가 보이지 않을 경우 원위치시킨다.
	 * @param {HashTable} htPosition
	 * @return {HashTable} htOption
	 * @ignore
	 */
	_adjustPosition: function(htPosition){
		var htOption = this.option(),
			aCandidatePosition = [];
		
		aCandidatePosition.push(htPosition);
		aCandidatePosition.push(this.getPosition(this._mirrorHorizontal(htOption)));
		aCandidatePosition.push(this.getPosition(this._mirrorVertical(htOption)));
		aCandidatePosition.push(this.getPosition(this._mirrorVertical(this._mirrorHorizontal(htOption))));
		
		for (var i = 0, htCandidatePosition; htCandidatePosition = aCandidatePosition[i]; i++) {
			if (this._isFullyVisible(htCandidatePosition)) {
				htPosition = htCandidatePosition;
				break;
			}
		}
		return htPosition;
	}
}).extend(jindo.Component);
/**
 * @fileOverview 특정영역을 강조하기 위해 이외의 부분전체를 안개처럼 뿌옇게 가려주는 컴포넌트
 * @author hooriza, modified by senxation
 * @version 0.4.2
 */
jindo.Foggy = jindo.$Class({
	/** @lends jindo.Foggy.prototype */
	
	_elFog : null,
	_bFogAppended : false,
	_oExcept : null,
	_bFogVisible : false,
	_oTransition : null,
	/**
	 * Foggy 컴포넌트를 생성한다.
	 * Foggy 컴포넌트는 특정영역을 highlighting하기 위해 이외의 부분을 안개처럼 뿌옇게 가려주는 기능을 한다.
	 * @constructs 
	 * @class 특정영역을 강조하기 위해 이외의 부분전체를 안개처럼 뿌옇게 가려주는 컴포넌트
	 * @extends jindo.Component
	 * @requires jindo.Effect
	 * @requires jindo.Transition
	 * @param {HashTable} htOption 옵션 객체
	 * @example
var foggy = new jindo.Foggy({
	sClassName : "fog", //(String) fog 레이어에 지정될 클래스명
	nShowDuration : 200, //(Number) fog 레이어가 완전히 나타나기까지의 시간 (ms)
	nShowOpacity : 0.5, //(Number) fog 레이어가 모두 보여졌을 때의 투명도 (0~1사이의 값)    
	nHideDuration : 200, //(Number) fog 레이어가 완전히 사라지기까지의 시간 (ms)
	nHideOpacity : 0, //(Number) fog 레이어를 숨기기위해 적용할 투명도 (0~1사이의 값)
	fShowEffect : jindo.Effect.linear, // (jindo.Effect) fog 레이어를 보여줄 때 적용할 효과
	fHideEffect : jindo.Effect.linear, // (jindo.Effect) fog 레이어를 숨길 때 적용할 효과
	nFPS : 15 //(Number) 효과가 재생될 초당 frame rate
}).attach({
	beforeShow : function(oCustomEvent) {
		//oCustomEvent.stop(); 수행시 fog레이어를 보여주지 않음.
	},
	show : function() {
		//fog 레이어가 화면에 보여지고나서 발생
	},
	beforeHide : function(oCustomEvent) {
		//oCustomEvent.stop(); 수행시 fog레이어를 숨기지 않음.
	},
	hide : function() {
		//fog 레이어가 화면에서 숨겨지고나서 발생
	}
});

//컴포넌트에 의해 생성된 fog레이어에 대한 설정
foggy.getFog().className = 'fog'; 
foggy.getFog().onclick = function() { foggy.hide(); };
	 */
	$init : function(htOption) {
		this.option({
			sClassName : "fog",
			nShowDuration : 200,
			nShowOpacity : 0.5,
			nHideDuration : 200,
			nHideOpacity : 0,
			fShowEffect : jindo.Effect.linear,
			fHideEffect : jindo.Effect.linear,
			nFPS : 15
		});
		this.option(htOption || {});
		
		this._elFog = jindo.$('<div class="' + this.option("sClassName") + '">');
		this._welFog = jindo.$Element(this._elFog);
		document.body.insertBefore(this._elFog, document.body.firstChild);
		this._welFog.opacity(this.option('nHideOpacity'));
		this._welFog.hide();
		
		this._oExcept = {};
		
		this._oTransition = new jindo.Transition().fps(this.option("nFPS"));
		
		this._fOnResize = jindo.$Fn(this._fitFogToDocument, this);
		this._fOnScroll = jindo.$Fn(this._fitFogToDocumentScrollSize, this);
	},
	
	_getScroll : function(wDocument) {
		return {
			top : window.pageYOffset || document[wDocument._docKey].scrollTop,
			left : window.pageXOffset || document[wDocument._docKey].scrollLeft
		};
	},
	
	_fitFogToDocument : function() {
		var wDocument = jindo.$Document(); 

		this._elFog.style.left = this._getScroll(wDocument).left + 'px';		 
		this._elFog.style.width = wDocument.clientSize().width + 'px';
		
		var self = this;
		clearTimeout(this._nTimer);
		this._nTimer = null;

		//가로스크롤이 생겼다 사라지는경우의 버그를 수정하기위한 setTimeout		
		this._nTimer = setTimeout(function(){
		
			var oSize = wDocument.clientSize();
			 
			self._elFog.style.top = self._getScroll(wDocument).top + 'px';
			self._elFog.style.height = oSize.height + 'px';
			
			self._elFog.style.left = self._getScroll(wDocument).left + 'px';		 
			self._elFog.style.width = wDocument.clientSize().width + 'px';
			
		}, 100);
	},
	
	_fitFogToDocumentScrollSize : function() {
		var oSize = jindo.$Document().scrollSize();
		this._elFog.style.left = "0";
		this._elFog.style.top = "0";
		this._elFog.style.width = oSize.width + 'px';
		this._elFog.style.height = oSize.height + 'px';
	},
	
	/**
	 * 생성된 fog 레이어 엘리먼트를 가져온다.
	 * @return {HTMLElement} fog 레이어 엘리먼트
	 */
	getFog : function() {
		return this._elFog;
	},
	
	/**
	 * fog 레이어가 보여졌는지 여부를 가져온다.
	 * @return {Boolean} 
	 */
	isShown : function() {
		return this._bFogVisible;
	},
	
	/**
	 * fog 레이어를 보여준다. (elExcept는 가리지 않는다.)
	 * @param {HTMLElement} elExcept
	 */
	show : function(elExcept) {
		if (!this._bFogVisible) {
			if (this.fireEvent('beforeShow')) {
				if (elExcept) {
					this._oExcept.element = elExcept;
					var sPosition = jindo.$Element(elExcept).css('position');
					if (sPosition == 'static') {
						elExcept.style.position = 'relative';
					}
		
					this._oExcept.position = elExcept.style.position;
					this._oExcept.zIndex = elExcept.style.zIndex;
					elExcept.style.zIndex = 32001;
				}
				
				this._elFog.style.zIndex = 32000;
				this._elFog.style.display = 'none';
				
				this._fitFogToDocument();
				this._fOnResize.attach(window, "resize");
				this._fOnScroll.attach(window, "scroll");
				
				this._elFog.style.display = 'block';
				
				var self = this;
				this._oTransition.abort().start(this.option('nShowDuration'),
					this._elFog, { '@opacity' : this.option("fShowEffect")(this.option('nShowOpacity')) }
				).start(function() {
					self._bFogVisible = true;
					self.fireEvent('show');
				});
			}
		}
	},
	
	/**
	 * fog 레이어를 숨긴다.
	 */
	hide : function() {
		if (this._bFogVisible) {
			if (this.fireEvent('beforeHide')) {
				var self = this;
				
				this._oTransition.abort().start(this.option('nHideDuration'),
					this._elFog, { '@opacity' : this.option("fHideEffect")(this.option('nHideOpacity')) }
				).start(function() {
					self._elFog.style.display = 'none';
					
					var elExcept = self._oExcept.element;
					if (elExcept) {
						elExcept.style.position = self._oExcept.position;
						elExcept.style.zIndex = self._oExcept.zIndex;
					}
					self._oExcept = {};
					self._fOnResize.detach(window, "resize");
					self._fOnScroll.detach(window, "scroll");
					
					self._bFogVisible = false;
					
					self.fireEvent('hide');
				});
			}
		}
	}
}).extend(jindo.Component);

/**
 * @fileOverview 수치의 중간값을 쉽게 얻을 수 있게 하는 static 컴포넌트
 * @author hooriza, modified by senxation
 * @version 0.4
 */
 
/**
 * 새로운 이펙트 생성 함수를 생성한다.
 * @namespace
 * @class 수치의 중간값을 쉽게 얻을 수 있게 하는 static 컴포넌트
 * @param {Function} f	0~1 사이의 숫자를 인자로 받아 정해진 공식에 따라 0~1 사이의 값을 리턴하는 함수
 * @return {Function} 이펙트 생성 함수. 이 함수는 시작값과 종료값을 입력하여 특정 시점에 해당하는 값을 구하는 함수를 생성한다.
 */
jindo.Effect = function(fEffect) {
	if (this instanceof arguments.callee) {
		throw new Error("You can't create a instance of this");
	}
	
	var rxNumber = /^(\-?[0-9\.]+)(%|px|pt|em)?$/;
	var rxRGB = /^rgb\(([0-9]+)\s?,\s?([0-9]+)\s?,\s?([0-9]+)\)$/i;
	var rxHex = /^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;
	var rx3to6 = /^#([0-9A-F])([0-9A-F])([0-9A-F])$/i;
	
	var getUnitAndValue = function(v) {
		var nValue = v, sUnit;
		
		if (rxNumber.test(v)) {
			nValue = parseFloat(v); 
			sUnit = RegExp.$2;
		} else if (rxRGB.test(v)) {
			nValue = [parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10), parseInt(RegExp.$3, 10)];
			sUnit = 'color';
		} else if (rxHex.test(v = v.replace(rx3to6, '#$1$1$2$2$3$3'))) {
			nValue = [parseInt(RegExp.$1, 16), parseInt(RegExp.$2, 16), parseInt(RegExp.$3, 16)];
			sUnit = 'color';
		} 
				
		return { 
			nValue : nValue, 
			sUnit : sUnit 
		};
	};
	
	return function(nStart, nEnd) {
		var sUnit;
		if (arguments.length > 1) {
			nStart = getUnitAndValue(nStart);
			nEnd = getUnitAndValue(nEnd);
			sUnit = nEnd.sUnit;
		} else {
			nEnd = getUnitAndValue(nStart);
			nStart = null;
			sUnit = nEnd.sUnit;
		} 
		
		// 두개의 단위가 다르면
		if (nStart && nEnd && nStart.sUnit != nEnd.sUnit) {
			throw new Error('unit error');
		}
		
		nStart = nStart && nStart.nValue;
		nEnd = nEnd && nEnd.nValue;
		
		var fReturn = function(p) {
			var nValue = fEffect(p);
			var getResult = function(s, d) { 
				return (d - s) * nValue + s + sUnit; 
			};
			
			if (sUnit == 'color') {
				var r = parseInt(getResult(nStart[0], nEnd[0]), 10) << 16;
				r |= parseInt(getResult(nStart[1], nEnd[1]), 10) << 8;
				r |= parseInt(getResult(nStart[2], nEnd[2]), 10);
				
				r = r.toString(16).toUpperCase();
				for (var i = 0; 6 - r.length; i++) {
					r = '0' + r;
				}
					
				return '#' + r;
			}
			return getResult(nStart, nEnd);
		};
		
		if (nStart === null) {
			fReturn.setStart = function(s) {
				s = getUnitAndValue(s);
				
				if (s.sUnit != sUnit) {
					throw new Error('unit eror');
				}
				nStart = s.nValue;
			};
		}
		return fReturn;
	};
};

/**
 * 일정한 속도로 변화하는 형태의 이펙트 함수를 생성한다.
 * @param {String | Number} nStart 시작 수치값
 * @param {String | Number} nEnd 종료 수치값
 * @return {Function} 해당이펙트의 특정 시점에 해당하는 값을 구하는 함수
 * @remark 시작 수치값과 종료 수치값으로는 다음과 같이 여러가지 단위와 표현을 사용할 수 있다
 * <dl>
 *	<dt>그냥 숫자</dt>
 *	<dd>예) 100</dd>
 *	<dt>px 단위</dt>
 *	<dd>예) '200px'</dd>
 *	<dt>% 단위</dt>
 *	<dd>예) '50%'</dd>
 *	<dt>em 단위</dt>
 *	<dd>예) '2em'</dd>
 *	<dt>색상 단위</dt>
 *	<dd>
 *		<dl>
 *			<dt>rgb 표현</dt>
 *			<dd>예) 'rgb(255, 127, 0)'</dd>
 *			<dt>#RRGGBB 표현</dt>
 *			<dd>예) '#FF7F00'</dd>
 *			<dt>#RGB 표현</dt>
 *			<dd>예) '#FA0'</dd>
 *		</dl>
 *	</dd>
 * </dl>
 * @remark 시작 수치값과 종료 수치값의 단위가 다르면 에러를 발생시킨다.
 * @return {Function} 해당이펙트의 특정 시점에 해당하는 값을 구하는 함수
 * @example
// 100 과 200 사이를 일정하게 증가하는 중간값을 알려주는 함수를 리턴
var f = jindo.Effect.linear(100, 200);

// 리턴된 함수를 사용하여 중간값을 얻음
console.log( f(0) ); // 결과 100
console.log( f(0.5) ); // 결과 150
console.log( f(1) ); // 결과 200
 * @example
//시작 값을 따로 지정하는 예제
var f = jindo.Effect.linear(200);
f.setStart(100);
	
console.log( f(0.5) ); // 결과 150
 */
jindo.Effect.linear = jindo.Effect(function(s) {
	return s;
});

/**
 * 점점 빨라지는 식으로 변화하는 형태의 이펙트 함수를 생성한다.
 * @param {String | Number} nStart 시작 수치값
 * @param {String | Number} nEnd 종료 수치값
 * @return {Function} 해당이펙트의 특정 시점에 해당하는 값을 구하는 함수
 */
jindo.Effect.easeIn = jindo.Effect(function(s) {
	return (1 - Math.sqrt(1 - (s * s)));
});

/**
 * 점점 느려지는 식으로 변화하는 형태의 이펙트 함수를 생성한다.
 * @param {String | Number} nStart 시작 수치값
 * @param {String | Number} nEnd 종료 수치값
 * @return {Function} 해당이펙트의 특정 시점에 해당하는 값을 구하는 함수
 */
jindo.Effect.easeOut = jindo.Effect(function(s) {
	return Math.sqrt((2 - s) * s);
});

/**
 * 튀기는 효과로 변화하는 형태의 이펙트 함수를 생성한다.
 * @remark Script.aculo.us 의 코드 사용
 * @param {String | Number} nStart 시작 수치값
 * @param {String | Number} nEnd 종료 수치값
 * @return {Function} 해당이펙트의 특정 시점에 해당하는 값을 구하는 함수
 */
jindo.Effect.bounce = jindo.Effect(function(s) {
	if (s < (1 / 2.75)) {
		return (7.5625 * s * s);
	} else if (s < (2 / 2.75)) {
		return (7.5625 * (s -= (1.5 / 2.75)) * s + 0.75);
	} else if (s < (2.5 / 2.75)) {
		return (7.5625 * (s -= (2.25 / 2.75)) * s + 0.9375);
	} else {
		return (7.5625 * (s -= (2.625 / 2.75)) * s + 0.984375);
	} 
});

/**
 * Cubic-Bezier curve
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @remark http://www.netzgesta.de/dev/cubic-bezier-timing-function.html
 */
jindo.Effect._cubicBezier = function(x1, y1, x2, y2){
	return function(s){
		var cx = 3.0 * x1, 
			bx = 3.0 * (x2 - x1) - cx, 
			ax = 1.0 - cx - bx, 
			cy = 3.0 * y1, 
			by = 3.0 * (y2 - y1) - cy, 
			ay = 1.0 - cy - by;
		
		function sampleCurveX(s){
			return ((ax * s + bx) * s + cx) * s;
		}
		function sampleCurveY(s){
			return ((ay * s + by) * s + cy) * s;
		}
		function solveCurveX(x, epsilon){
			var t0 = 0.0, t1 = 1.0, t2 = x, x2, d2;
			for (var i = 0; i < 8; i++) {
				x2 = sampleCurveX(t2) - x;
				if (Math.abs(x2) < epsilon) {
					return t2;
				}
				d2 = (3.0 * ax * t2 + 2.0 * bx) * t2 + cx;
				if (Math.abs(d2) < 1e-6) {
					break;
				}
				t2 = t2 - x2 / d2;
			}
			if (t2 < t0) {
				return t0;
			}
			if (t2 > t1) {
				return t1;
			}
			while (t0 < t1) {
				x2 = sampleCurveX(t2);
				if (Math.abs(x2 - x) < epsilon) {
					return t2;
				}
				if (x > x2) {
					t0 = t2;
				} else {
					t1 = t2;
				}
				t2 = (t1 - t0) * 0.5 + t0;
			}
			return t2; // Failure.
		}
		
		return sampleCurveY(solveCurveX(s, (1 / 1000)));
	};
};

/**
 * Cubic-Bezier 함수를 생성한다.
 * @see http://en.wikipedia.org/wiki/B%C3%A9zier_curve
 * @param {Number} x1 control point 1의 x좌표
 * @param {Number} y1 control point 1의 y좌표
 * @param {Number} x2 control point 2의 x좌표
 * @param {Number} y2 control point 2의 y좌표
 * @return {jindo.Effect} 생성된 jindo.Effect 함수
 */
jindo.Effect.cubicBezier = function(x1, y1, x2, y2){
	return jindo.Effect(jindo.Effect._cubicBezier(x1, y1, x2, y2));
};

/**
 * 조금 넘어가는 식으로 변화하는 형태의 이펙트 함수를 생성한다.
 * @param {String | Number} nStart 시작 수치값
 * @param {String | Number} nEnd 종료 수치값
 * @return {Function} 해당이펙트의 특정 시점에 해당하는 값을 구하는 함수
 */
jindo.Effect.overphase = jindo.Effect.cubicBezier(0.25, 0.75, 0.8, 1.3);

/**
 * @param {String | Number} nStart 시작 수치값
 * @param {String | Number} nEnd 종료 수치값
 * @return {Function} 해당이펙트의 특정 시점에 해당하는 값을 구하는 함수
 */
jindo.Effect.easeInOut = jindo.Effect.cubicBezier(0.75, 0.0, 0.25, 1.0);

/**
 * @param {String | Number} nStart 시작 수치값
 * @param {String | Number} nEnd 종료 수치값
 * @return {Function} 해당이펙트의 특정 시점에 해당하는 값을 구하는 함수
 */
jindo.Effect.easeOutIn = jindo.Effect.cubicBezier(0.25, 0.75, 0.75, 0.25);

/**
 * CSS3 Transition Timing Function과 동일한 ease 함수를 생성한다.
 * @param {String | Number} nStart 시작 수치값
 * @param {String | Number} nEnd 종료 수치값
 * @return {Function} 해당이펙트의 특정 시점에 해당하는 값을 구하는 함수
 * @remark jindo.Effect.cubicBezier(0.25, 0.1, 0.25, 1);
 * @see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
 */
jindo.Effect.cubicEase = jindo.Effect.cubicBezier(0.25, 0.1, 0.25, 1);

/**
 * CSS3 Transition Timing Function과 동일한 easeIn 함수를 생성한다.
 * @param {String | Number} nStart 시작 수치값
 * @param {String | Number} nEnd 종료 수치값
 * @return {Function} 해당이펙트의 특정 시점에 해당하는 값을 구하는 함수
 * @remark jindo.Effect.cubicBezier(0.42, 0, 1, 1);
 * @see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
 */
jindo.Effect.cubicEaseIn = jindo.Effect.cubicBezier(0.42, 0, 1, 1);

/**
 * CSS3 Transition Timing Function과 동일한 easeOut 함수를 생성한다.
 * @param {String | Number} nStart 시작 수치값
 * @param {String | Number} nEnd 종료 수치값
 * @return {Function} 해당이펙트의 특정 시점에 해당하는 값을 구하는 함수
 * @remark jindo.Effect.cubicBezier(0, 0, 0.58, 1);
 * @see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
 */
jindo.Effect.cubicEaseOut = jindo.Effect.cubicBezier(0, 0, 0.58, 1);

/**
 * CSS3 Transition Timing Function과 동일한 easeInOut 함수를 생성한다.
 * @param {String | Number} nStart 시작 수치값
 * @param {String | Number} nEnd 종료 수치값
 * @return {Function} 해당이펙트의 특정 시점에 해당하는 값을 구하는 함수
 * @remark jindo.Effect.cubicBezier(0.42, 0, 0.58, 1);
 * @see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
 */
jindo.Effect.cubicEaseInOut = jindo.Effect.cubicBezier(0.42, 0, 0.58, 1);

/**
 * Cubic-Bezier 커브를 이용해 easeOutIn 함수를 구한다.
 * @param {String | Number} nStart 시작 수치값
 * @param {String | Number} nEnd 종료 수치값
 * @return {Function} 해당이펙트의 특정 시점에 해당하는 값을 구하는 함수
 * @remark jindo.Effect.cubicBezier(0, 0.42, 1, 0.58);
 */
jindo.Effect.cubicEaseOutIn = jindo.Effect.cubicBezier(0, 0.42, 1, 0.58);

/**
 * nPulse의 진동수를 가지는 cos 함수를 구한다.
 * @param {Number} nPulse 진동수
 * @return {jindo.Effect} 생성된 jindo.Effect 함수
 * @example
var f = jindo.Effect.pulse(3); //진동수 3을 가지는 함수를 리턴
//시작 수치값과 종료 수치값을 설정해 jindo.Effect 함수를 생성
var fEffect = f(0, 100);
fEffect(0); => 0
fEffect(1); => 100
 */
jindo.Effect.pulse = function(nPulse) {
    return jindo.Effect(function(s){
		return (-Math.cos((s * (nPulse - 0.5) * 2) * Math.PI) / 2) + 0.5;	
	});
};
/**
 * @fileOverview 엘리먼트의 css style의 변화를 주어 움직이는 효과를 주는 컴포넌트
 * @author hooriza, modified by senxation
 * @version 0.5.4
 */

jindo.Transition = jindo.$Class({
	/** @lends jindo.Transition.prototype */
	_nFPS : 30,
	
	_aTaskQueue : null,
	_oTimer : null,
	
	_bIsWaiting : true, // 큐의 다음 동작을 하길 기다리는 상태
	_bIsPlaying : false, // 재생되고 있는 상태
	
	/**
	 * Transition 컴포넌트를 생성한다.
	 * @constructs
	 * @class 엘리먼트의 css style의 변화를 주어 움직이는 효과를 주는 컴포넌트
	 * @param {HashTable} htOption 옵션 객체
	 * @extends jindo.Component
	 * @requires jindo.Effect
	 * @requires jindo.Timer
	 * @example 
var oTransition = new jindo.Transition({
	fEffect : jindo.Effect.linear, //디폴트 효과 
	bCorrection : false //소수점에 의해 어긋나는 사이즈를 보정할지 여부
}).fps(30).attach({
	start : function() {
		//Transition이 시작될 때 발생
	},
	playing : function(oCustomEvent) {
		//Transition이 진행되는 매 단계에 발생
		//이벤트 객체 oCustomEvent = { 
		//	element : 변화되고있는 객체
		//	sKey : 변화할 대상
		//	sValue : 변화할 값
		//	nStep : 현재의 Transition의 단계
		//	nTotalStep : Transition이 완료되기까지 playing 커스텀이벤트가 발생할 횟수
		//}
	},
	end : function() {
		//Transition이 끝났을 때 발생
	},
	abort : function() {
		//Transition이 중단되었을 때 발생
	},
	pause : function() {
		//Transition이 일시정지되었을 때 발생
	},
	resume : function() {
		//Transition이 재시작될 때 발생
	},
	sleep : function(oCustomEvent) {
		//Transition이 휴면상태일 때 발생
		//이벤트 객체 oCustomEvent = { 
		//	nDuration : 휴면 시간
		//}
	},
	awake : function() {
		//Transition이 휴면상태에서 깨어났을 때 발생
	},
});
	 */
	$init : function(htOption) {
		this._aTaskQueue = [];
		this._oTimer = new jindo.Timer();
		
		this.option({ 
			fEffect : jindo.Effect.linear, 
			bCorrection : false 
		});
		this.option(htOption || {});
	},

	/**
	 * 효과가 재생될 초당 frame rate를 설정하거나 가져온다.
	 * @param {Number} nFPS (생략시 현재 frame rate 리턴)
	 * @return {Number | this} 
	 */
	fps : function(nFPS) {
		if (arguments.length > 0) {
			this._nFPS = nFPS;
			return this;
		}
		
		return this._nFPS;
	},
	
	/**
	 * 트랜지션이 진행중인지 여부를 가져온다.
	 * @return {Boolean}
	 */
	isPlaying : function() {
		return this._bIsPlaying;
	},
	
	/**
	 * 진행되고 있는 Transition을 중지시킨다.
	 * @return {this}
	 */
	abort : function() {
		this._aTaskQueue = [];
		this._oTimer.abort();
		
		if (this._bIsPlaying) {
			this.fireEvent("abort");
		}

		this._bIsWaiting = true;
		this._bIsPlaying = false;
		
		this._htTaskToDo = null;
		return this;
	},
	
	/**
	 * Transition을 수행한다.
	 * 파라메터를 지정(queue 메소드와 동일)하였을 경우에는 해당 동작을 바로 실행시키고, 파라메터가 생략되었을 때에는 지금까지 queue()로 지정된 동작들을 시작시킨다.
	 * 파라메터는 function타입으로 지정하여 콜백을 수행할수 있다. (예제 참고)
	 * @param {Number} nDuration Transition이 진행될 시간
	 * @param {Array} aCommand 적용할 명령셋
	 * @return {this}
	 * @see jindo.Transition#queue
	 * @example
oTransition.start(1000, 
	jindo.$("foo"), {
		'@left' : '200px'
	}
));
	 * @example
oTransition.start(1000, [
	[jindo.$("foo"), {
		'@left' : '200px'
	}],
	
	[jindo.$("bar"), {
		'@top' : '200px'
	}]
]));
	 * @example
oTransition.queue(1000,
	jindo.$("foo"), {
		'@left' : '200px'
	}
));
oTransition.start();
	 */
	start : function(nDuration, elTarget, htInfo) {
		if (arguments.length > 0) {
			this.queue.apply(this, arguments);
		}
		
		this._prepareNextTask();
		return this;
	},
	
	/**
	 * Transition을 큐에 담는다.
	 * 여러 단계의 Transition을 담아두고 순차적으로 실행시킬때 사용한다. start() 메소드가 호출되기 전까지 수행되지 않는다.
	 * @param {Number} nDuration Transition이 진행될 시간
	 * @param {Array} aCommand 적용할 명령셋
	 * @return {this}
	 * @remark 파라메터 aCommand는 [(HTMLElement)엘리먼트, (HashTable)Transition정보]로 구성되어야 하고, 여러명령을 동시에 적용할 수 있다.
	 * @remark 파라메터로 function을 지정하여 콜백을 등록할 수 있다.
	 * @see jindo.Transition#start
	 * @example 하나의 엘리먼트에 여러개의 명령을 지정하는 예제
oTransition.queue(1000,
	jindo.$("foo"), {
		'@left' : '200px',
		'@top' : '50px',
		'@width' : '200px',
		'@height' : '200px',
		'@backgroundColor' : [ '#07f', 'rgb(255, 127, 127)' ]
	}
); 
	 * @example 여러개의 엘리먼트에 명령을 지정하는 예 1
oTransition.queue(1000,
	jindo.$("foo"), {
		"@left" : jindo.Effect.linear("200px")
	},
	jindo.$("bar"), {
		"@top" : jindo.Effect.linear("200px")
	}
);
	 * @example 여러개의 엘리먼트에 명령을 지정하는 예 2
oTransition.queue(1000, [
	[jindo.$("foo"), {
		"@left" : jindo.Effect.linear("200px")
	}],
	[jindo.$("bar"), {
		"@top" : jindo.Effect.linear("200px")
	}]
]);  
	 * @example 엘리먼트를 getter / setter 함수로 지정하는 예  
oTransition.queue(1000, [
	[{
		getter : function(sKey) {
			return jindo.$Element("foo")[sKey]();
		},
		
		setter : function(sKey, sValue) {
			jindo.$Element("foo")[sKey](parseFloat(sValue));
		}
	}, {
		'height' : jindo.Effect.easeIn(100)
	}]
]);  
	 * @example 파라메터로 function을 지정하여 콜백을 수행하는 예제
oTransition.start(function(){
	alert("end")
});
	 */
	queue : function(nDuration, aCommand) {
		var htTask;
		if (typeof arguments[0] == 'function') {
			htTask = {
				sType : "function",
				fTask : arguments[0]
			};
		} else {
			var a = [];
			var nLength = arguments.length;
			if (arguments[1] instanceof Array) {
				a = arguments[1];
			} else {
				var aInner = [];
				$A(arguments).forEach(function(v, i){
					if (i > 0) {
						aInner.push(v);
						if (i % 2 == 0) {
							a.push(aInner.concat());
							aInner = [];
						} 
					}
				});
			}
			
			htTask = {
				sType : "task",
				nDuration : nDuration, 
				aList : []
			};
			
			for (var i = 0; i < a.length; i ++) {
				var aValue = [];
				var htArg = a[i][1];
				var sEnd;
				for (var sKey in htArg) {
					sEnd = htArg[sKey];
					if (/^(@|style\.)(\w+)/i.test(sKey)) {
						aValue.push([ "style", RegExp.$2, sEnd ]);
					} else {
						aValue.push([ "attr", sKey, sEnd ]);
					}
				}
				
				htTask.aList.push({
					elTarget : a[i][0],
					aValue : aValue
				});
			}
		}
		this._queueTask(htTask);
		
		return this;
	},
	
	/**
	 * 진행되고 있는 Transition을 일시중지시킨다.
	 * Transition이 진행중일때만 가능하다. (sleep 상태일 때에는 불가능)
	 * @return {this}
	 */
	pause : function() {
		if (this._oTimer.abort()) {
			this.fireEvent("pause");
		}
		return this;
	},
	
	/**
	 * 일시중지된 Transition을 재시작시킨다.
	 * @return {this}
	 */
	resume : function() {
		if (this._htTaskToDo) {
			if (this._bIsWaiting === false && this._bIsPlaying === true) {
				this.fireEvent("resume");
			}
			
			this._doTask();
			
			this._bIsWaiting = false;
			this._bIsPlaying = true;
		
			var self = this;
			this._oTimer.start(function() {
				var bEnd = !self._doTask();
				if (bEnd) {
					self._bIsWaiting = true;
					setTimeout(function() { 
						self._prepareNextTask(); 
					}, 0);
				}
				
				return !bEnd;
			}, this._htTaskToDo.nInterval);
		}
		return this;
	},
	
	/**
	 * 지정된 Transition이 종료된 이후에 또 다른 Transition 을 수행한다.
	 * @return {this}
	 * @remark start() 메소드는 더이상 현재 진행중인 Transition을 abort시키지 않는다.
	 * @deprecated start();
	 */
	precede : function(nDuration, elTarget, htInfo) {
		this.start.apply(this, arguments);
		return this;
	},
	
	/**
	 * 현재의 Transition 종료 후 다음 Transition 진행하기전에 지정된 시간만큼 동작을 지연한다.
	 * @param {Number} nDuration 지연할 시간
	 * @param {Function} fCallback 지연이 시작될때 수행될 콜백함수 (생략가능)
	 * @return {this}
	 * @example
oTransition.start(1000, jindo.$("foo"), {
	"@left" : jindo.Effect[sEffect](oPos.pageX + "px")
}).sleep(500).start(1000, jindo.$("bar"), {
	"@top" : jindo.Effect[sEffect](oPos.pageY + "px")
});
	 */
	sleep : function(nDuration, fCallback) {
		if (typeof fCallback == "undefined") {
			fCallback = function(){};
		}
		this._queueTask({
			sType : "sleep",
			nDuration : nDuration,
			fCallback : fCallback 
		});
		this._prepareNextTask();
		return this;
	},
	
	_queueTask : function(v) {
		this._aTaskQueue.push(v);
	},
	
	_dequeueTask : function() {
		var htTask = this._aTaskQueue.shift();
		if (htTask) {
			if (htTask.sType == "task") {
				var aList = htTask.aList;
				
				for (var i = 0, nLength = aList.length; i < nLength; i++) {
					var elTarget = aList[i].elTarget;
					
					for (var j = 0, aValue = aList[i].aValue, nJLen = aValue.length; j < nJLen; j++) {
						var sType = aValue[j][0];
						var fFunc = aValue[j][2];
						
						if (typeof fFunc != "function") {
							if (fFunc instanceof Array) {
								fFunc = this.option("fEffect")(fFunc[0], fFunc[1]);
							} else {
								fFunc = this.option("fEffect")(fFunc);
							}
						}
						
						if (fFunc.setStart) {
							if (this._isHTMLElement(elTarget)) {
								var welTarget = jindo.$Element(elTarget);
								switch (sType) {
									case "style":
										fFunc.setStart(welTarget.css(aValue[j][1]));
										break;
										
									case "attr":
										fFunc.setStart(welTarget.$value()[aValue[j][1]]);
										break;
								}
							} else {
								fFunc.setStart(elTarget.getter(aValue[j][1]));
							}
						}
						aValue[j][2] = fFunc;
					}
				}
			}
			return htTask;
		} else {
			return null;
		}
	},
	
	_prepareNextTask : function() {
		if (this._bIsWaiting) {
			var htTask = this._dequeueTask();
			if (htTask) {
				switch (htTask.sType) {
					case "task":
						if (!this._bIsPlaying) {
							this.fireEvent("start");
						}
						var nInterval = 1000 / this._nFPS;
						var nGap = nInterval / htTask.nDuration;
						this._htTaskToDo = {
							aList: htTask.aList,
							nRatio: 0,
							nInterval: nInterval,
							nGap: nGap,
							nStep: 0,
							nTotalStep: Math.ceil(htTask.nDuration / nInterval)
						};
						
						this.resume();
						break;
					case "function":
						if (!this._bIsPlaying) {
							this.fireEvent("start");
						}
						htTask.fTask();
						this._prepareNextTask();
						break;
					case "sleep":
						if (this._bIsPlaying) {
							this.fireEvent("sleep", {
								nDuration: htTask.nDuration
							});
							htTask.fCallback();
						}
						var self = this;
						setTimeout(function(){
							self.fireEvent("awake");
							self._prepareNextTask();
						}, htTask.nDuration);
						break;
				}
			} else {
				if (this._bIsPlaying) {
					this._bIsPlaying = false;
					this.abort();
					this.fireEvent("end");
				}
			}
		}
	},
	
	_isHTMLElement : function(el) {
		return ("tagName" in el);
	},
	
	_doTask : function() {
		var htTaskToDo = this._htTaskToDo,
			nRatio = parseFloat(htTaskToDo.nRatio.toFixed(5), 1),
			nStep = htTaskToDo.nStep,
			nTotalStep = htTaskToDo.nTotalStep,
			aList = htTaskToDo.aList,
			htCorrection = {};
		
		var bCorrection = this.option("bCorrection");
		for (var i = 0, nLength = aList.length; i < nLength; i++) {
			var elTarget = aList[i].elTarget;
			for (var j = 0, aValue = aList[i].aValue, nJLen = aValue.length; j < nJLen; j++) {
				var sType = aValue[j][0],
					sKey = aValue[j][1],
					sValue = aValue[j][2](nRatio);
				
				if (this._isHTMLElement(elTarget)) {
					var welTarget = jindo.$Element(elTarget);
						
					if (bCorrection) {
						var sUnit = /^[0-9]*([^0-9]*)$/.test(sValue) && RegExp.$1 || "";
						if (sUnit) {
							var nValue = parseFloat(sValue);
							var nFloor;
							nValue += htCorrection[sKey] || 0;
							nValue = parseFloat(nValue.toFixed(5));
							if (i == nLength - 1) {
								sValue = Math.round(nValue) + sUnit;
							} else {
								nFloor = parseFloat(/(\.[0-9]+)$/.test(nValue) && RegExp.$1 || 0);
								sValue = parseInt(nValue, 10) + sUnit;
	
								htCorrection[sKey] = nFloor;
							}
						}
					}
				
					switch (sType) {
						case "style":
							welTarget.css(sKey, sValue);
							break;
							
						case "attr":
							welTarget.$value()[sKey] = sValue;
							break;
					}
				} else {
					elTarget.setter(sKey, sValue);
				}
				
				if (this._bIsPlaying) {
					this.fireEvent("playing", {
						element : elTarget,
						sKey : sKey,
						sValue : sValue,
						nStep : nStep,
						nTotalStep : nTotalStep
					});
				}
			}
		}
		htTaskToDo.nRatio = Math.min(htTaskToDo.nRatio + htTaskToDo.nGap, 1);
		htTaskToDo.nStep += 1;
		return nRatio != 1;
	}
}).extend(jindo.Component);

// jindo.$Element.prototype.css 패치
(function() {
	var b = jindo.$Element.prototype.css;
	jindo.$Element.prototype.css = function(k, v) {
		if (k == "opacity") {
			return typeof v != "undefined" ? this.opacity(parseFloat(v)) : this.opacity();
		} else {
			return v != "undefined" ? b.call(this, k, v) : b.call(this, k);
		}
	};
})();
/**
 * @fileOverview HTML Element를 Drag할 수 있게 해주는 컴포넌트
 * @author hooriza, modified by senxation
 * @version 0.5.5
 */

jindo.DragArea = jindo.$Class({
	/** @lends jindo.DragArea.prototype */
	
	/**
	 * DragArea 컴포넌트를 생성한다.
	 * DragArea 컴포넌트는 상위 기준 엘리먼트의 자식들 중 특정 클래스명을 가진 모든 엘리먼트를 Drag 가능하게 하는 기능을 한다.
	 * @constructs
	 * @class HTML Element를 Drag할 수 있게 해주는 컴포넌트
	 * @extends jindo.UIComponent
	 * @param {HTMLElement} el Drag될 엘리먼트들의 상위 기준 엘리먼트. 컴포넌트가 적용되는 영역(Area)이 된다.
	 * @param {HashTable} htOption 옵션 객체
	 * @example
var oDragArea = new jindo.DragArea(document, {
	"sClassName" : 'dragable', // (String) 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트는 Drag 가능하게 된다. 
	"bFlowOut" : true, // (Boolean) 드래그될 엘리먼트가 상위 기준 엘리먼트의 영역을 벗어날 수 있는지의 여부. 상위 엘리먼트의 크기가 드래그되는 객체보다 크거나 같아야지만 동작하도록 수정. 작은 경우 document사이즈로 제한한다.
	"bSetCapture" : true, //ie에서 setCapture 사용여부
	"nThreshold" : 0 // (Number) 드래그가 시작되기 위한 최소 역치값(px) 
}).attach({
	handleDown : function(oCustomEvent) {
		//드래그될 handle 에 마우스가 클릭되었을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트 (핸들을 드래그하여 레이어 전체를 드래그되도록 하고 싶으면 이 값을 설정한다. 아래 예제코드 참고)
		//	weEvent : (jindo.$Event) mousedown시 발생되는 jindo.$Event 객체
		//};
		//oCustomEvent.stop(); 이 수행되면 dragStart 이벤트가 발생하지 않고 중단된다.
	},
	dragStart : function(oCustomEvent) {
		//드래그가 시작될 때 발생 (마우스 클릭 후 첫 움직일 때 한 번)
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elArea : (HTMLElement) 기준 엘리먼트
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트 (핸들을 드래그하여 레이어 전체를 드래그되도록 하고 싶으면 이 값을 설정한다. 아래 예제코드 참고)
		//	htDiff : (HashTable) handledown된 좌표와 dragstart된 좌표의 차이 htDiff.nPageX, htDiff.nPageY
		//	weEvent : (jindo.$Event) 마우스 이동 중 (mousemove) 발생되는 jindo.$Event 객체
		//};
		//oCustomEvent.stop(); 이 수행되면 뒤따르는 beforedrag 이벤트가 발생하지 않고 중단된다.
	},
	beforeDrag : function(oCustomEvent) {
		//드래그가 시작되고 엘리먼트가 이동되기 직전에 발생 (이동중 beforedrag, drag 순으로 연속적으로 발생)
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elArea : (HTMLElement) 기준 엘리먼트
		//	elFlowOut : (HTMLElement) bFlowOut 옵션이 적용될 상위 기준 엘리먼트 (변경가능)
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트
		//	weEvent : (jindo.$Event) 마우스 이동 중 (mousemove) 발생되는 jindo.$Event 객체
		//	nX : (Number) 드래그 될 x좌표. 이 좌표로 엘리먼트가 이동 된다.
		//	nY : (Number) 드래그 될 y좌표. 이 좌표로 엘리먼트가 이동 된다.
		//	nGapX : (Number) 드래그가 시작된 x좌표와의 차이
		//	nGapY : (Number) 드래그가 시작된 y좌표와의 차이
		//};
		//oCustomEvent.stop(); 이 수행되면 뒤따르는 drag 이벤트가 발생하지 않고 중단된다.
		//oCustomEvent.nX = null; // 가로로는 안 움직이게
		//oCustomEvent.nX = Math.round(oCustomEvent.nX / 20) * 20;
		//oCustomEvent.nY = Math.round(oCustomEvent.nY / 20) * 20;
		//if (oCustomEvent.nX < 0) oCustomEvent.nX = 0;
		//if (oCustomEvent.nY < 0) oCustomEvent.nY = 0;
	},
	drag : function(oCustomEvent) {
		//드래그 엘리먼트가 이동하는 중에 발생 (이동중 beforedrag, drag 순으로 연속적으로 발생)
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elArea : (HTMLElement) 기준 엘리먼트
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트
		//	weEvent : (jindo.$Event) 마우스 이동 중 (mousemove) 발생되는 jindo.$Event 객체
		//	nX : (Number) 드래그 된 x좌표. 이 좌표로 엘리먼트가 이동 된다.
		//	nY : (Number) 드래그 된 y좌표. 이 좌표로 엘리먼트가 이동 된다.
		//	nGapX : (Number) 드래그가 시작된 x좌표와의 차이
		//	nGapY : (Number) 드래그가 시작된 y좌표와의 차이
		//};
	},
	dragEnd : function(oCustomEvent) {
		//드래그(엘리먼트 이동)가 완료된 후에 발생 (mouseup시 1회 발생. 뒤이어 handleup 발생)
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elArea : (HTMLElement) 기준 엘리먼트
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 된 엘리먼트
		//	bInterupted : (Boolean) 드래그중 stopDragging() 호출로 강제적으로 드래그가 종료되었는지의 여부
		//	nX : (Number) 드래그 된 x좌표.
		//	nY : (Number) 드래그 된 y좌표.
		//}
	},
	handleUp : function(oCustomEvent) {
		//드래그된 handle에 마우스 클릭이 해제됬을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 된 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 된 엘리먼트
		//	weEvent : (jindo.$Event) mouseup시 발생되는 jindo.$Event 객체 
		//};
	}
});
	 */
	$init : function(el, htOption) {
		this.option({
			sClassName : 'draggable',
			bFlowOut : true,
			bSetCapture : true, //ie에서 bSetCapture 사용여부
			nThreshold : 0
		});
		
		this.option(htOption || {});
		
		this._el = el;
		
		this._bIE = jindo.$Agent().navigator().ie;
		
		this._htDragInfo = {
			"bPrepare" : false //mousedown이 되었을때 true, 이동중엔 false
		};
		this._bHandleDown = false;
		this._bIsDragging = false;

		this._wfOnMouseDown = jindo.$Fn(this._onMouseDown, this);
		this._wfOnMouseMove = jindo.$Fn(this._onMouseMove, this);
		this._wfOnMouseUp = jindo.$Fn(this._onMouseUp, this);
		
		this._wfOnDragStart = jindo.$Fn(this._onDragStart, this);
		this._wfOnSelectStart = jindo.$Fn(this._onSelectStart, this);
		
		this.activate();
	},
	
	_findDraggableElement : function(el) {
		if (jindo.$$.test(el, "input[type=text], textarea, select")){
			return null;
		} 
		
		var self = this;
		var sClass = '.' + this.option('sClassName');
		
		var isChildOfDragArea = function(el) {
			if (el === null) {
				return false;
			}
			if (self._el === document || self._el === el) {
				return true;
			} 
			return jindo.$Element(self._el).isParentOf(el);
		};
		
		var elReturn = jindo.$$.test(el, sClass) ? el : jindo.$$.getSingle('! ' + sClass, el);
		if (!isChildOfDragArea(elReturn)) {
			elReturn = null;
		}
		return elReturn;
	},
	
	/**
	 * 레이어가 현재 드래그 되고 있는지 여부를 가져온다
	 * @return {Boolean} 레이어가 현재 드래그 되고 있는지 여부
	 */
	isDragging : function() {
		return this._bIsDragging && !this._htDragInfo.bPrepare;
	},
	
	/**
	 * 드래그를 강제 종료시킨다.
	 * @return this;
	 */
	stopDragging : function() {
		this._stopDragging(true);
		return this;
	},
	
	_stopDragging : function(bInterupted) {
		this._wfOnMouseMove.detach(document, 'mousemove');
		this._wfOnMouseUp.detach(document, 'mouseup');

		var htInfo = this._htDragInfo;
		
		if (this.isDragging()) {
			var welDrag = jindo.$Element(htInfo.elDrag);
			
			this.fireEvent('dragEnd', {
				"elArea" : this._el,
				"elHandle" : htInfo.elHandle,
				"elDrag" : htInfo.elDrag,
				"nX" : parseInt(welDrag.css("left"), 10) || 0,
				"nY" : parseInt(welDrag.css("top"), 10) || 0,
				"bInterupted" : bInterupted
			});
		}
		this._bIsDragging = false;
		htInfo.bPrepare = false;
		
		if(this._bIE && this._elSetCapture) {
			this._elSetCapture.releaseCapture();
			this._elSetCapture = null;
		}
	},
	
	/**
	 * DragArea 동작을 위한 mousedown, dragstart, selectstart 이벤트를 attach 한다. 
	 */
	_onActivate : function() {
		this._wfOnMouseDown.attach(this._el, 'mousedown');
		this._wfOnDragStart.attach(this._el, 'dragstart'); // for IE
		this._wfOnSelectStart.attach(this._el, 'selectstart'); // for IE	
	},
	
	/**
	 * DragArea 동작을 위한 mousedown, dragstart, selectstart 이벤트를 detach 한다. 
	 */
	_onDeactivate : function() {
		this._wfOnMouseDown.detach(this._el, 'mousedown');
		this._wfOnDragStart.detach(this._el, 'dragstart'); // for IE
		this._wfOnSelectStart.detach(this._el, 'selectstart'); // for IE
	},
	
	/**
	 * 이벤트를 attach한다.
	 * @deprecated activate
	 */
	attachEvent : function() {
		this.activate();
	},
	
	/**
	 * 이벤트를 detach한다.
	 * @deprecated deactivate
	 */
	detachEvent : function() {
		this.deactivate();
	},
	
	/**
	 * 이벤트의 attach 여부를 가져온다.
	 * @deprecated isActivating
	 */
	isEventAttached : function() {
		return this.isActivating();
	},
	
	_onMouseDown : function(we) {
		/*
		if (this._bIsDragging || this._htDragInfo.bPrepare) {
			return;
		}
		*/
		/* IE에서 네이버 툴바의 마우스제스처 기능 사용시 우클릭하면 e.mouse().right가 false로 들어오므로 left값으로만 처리하도록 수정 */
		if (!we.mouse().left || we.mouse().right) {
			this._stopDragging(true);
			return;
		}
		
		// 드래그 할 객체 찾기
		var el = this._findDraggableElement(we.element);
		if (el) {
			var oPos = we.pos();
			this._htDragInfo = {
				bPrepare : true,
				nButton : we._event.button,
				elHandle : el,
				elDrag : el,
				nPageX : oPos.pageX,
				nPageY : oPos.pageY
			};
			
			this._bHandleDown = true;
			if (this.fireEvent('handleDown', { 
				elHandle : el, 
				elDrag : el, 
				weEvent : we 
			})) {
				this._wfOnMouseMove.attach(document, 'mousemove');
			} 
			this._wfOnMouseUp.attach(document, 'mouseup');
	
			we.stop(jindo.$Event.CANCEL_DEFAULT);			
		}
	},
	
	_onMouseMove : function(we) {
		this._bIsDragging = true;
		var htInfo = this._htDragInfo,
			htParam, htRect,
			oPos = we.pos();

		if (htInfo.bPrepare) {
			var nThreshold = this.option('nThreshold');
			var htDiff = {};
			
			if (nThreshold) {
				htDiff.nPageX = oPos.pageX - htInfo.nPageX;
				htDiff.nPageY = oPos.pageY - htInfo.nPageY;
				var nDistance = Math.sqrt(htDiff.nPageX * htDiff.nPageX + htDiff.nPageY * htDiff.nPageY);
				if (nThreshold > nDistance){
					return;
				} 
			}

			if(this._bIE && this.option("bSetCapture")) {
				this._elSetCapture = (this._el === document) ? document.body : this._findDraggableElement(we.element);
				if (this._elSetCapture) {
					this._elSetCapture.setCapture(false);
				}
			}
			 
			htParam = {
				elArea : this._el,
				elHandle : htInfo.elHandle,
				elDrag : htInfo.elDrag,
				htDiff : htDiff, //nThreshold가 있는경우 htDiff필요
				weEvent : we //jindo.$Event
			};
			
			if (this.fireEvent('dragStart', htParam)) {
				var welDrag = jindo.$Element(htParam.elDrag);
				htInfo.bPrepare = false;
				htInfo.elHandle = htParam.elHandle;
				htInfo.elDrag = htParam.elDrag;
				htInfo.nX = parseInt(welDrag.css('left'), 10) || 0;
				htInfo.nY = parseInt(welDrag.css('top'), 10) || 0;
			} else {
				this._bIsDragging = false;
				return;
			}
		} 
				
		var htGap = {
			"nX" : oPos.pageX - htInfo.nPageX,
			"nY" : oPos.pageY - htInfo.nPageY
		};
		
		htParam = {
			"elArea" : this._el,
			"elFlowOut" : htInfo.elDrag.parentNode, 
			"elHandle" : htInfo.elHandle,
			"elDrag" : htInfo.elDrag,
			"weEvent" : we, 		 //jindo.$Event
			"nX" : htInfo.nX + htGap.nX,
			"nY" : htInfo.nY + htGap.nY,
			"nGapX" : htGap.nX,
			"nGapY" : htGap.nY
		};
		
		if (this.fireEvent('beforeDrag', htParam)) {
			var elDrag = htInfo.elDrag;
			if (this.option('bFlowOut') === false) {
				var elParent = htParam.elFlowOut,
					aSize = [ elDrag.offsetWidth, elDrag.offsetHeight ],
					nScrollLeft = 0, nScrollTop = 0;
					
				if (elParent == document.body) {
					elParent = null;
				}
				
				if (elParent && aSize[0] <= elParent.scrollWidth && aSize[1] <= elParent.scrollHeight) {
					htRect = { 
						nWidth : elParent.clientWidth, 
						nHeight : elParent.clientHeight
					};	
					nScrollLeft = elParent.scrollLeft;
					nScrollTop = elParent.scrollTop;
				} else {
					var	htClientSize = jindo.$Document().clientSize();
						
					htRect = {
						nWidth : htClientSize.width, 
						nHeight : htClientSize.height
					};
				}
	
				if (htParam.nX !== null) {
					htParam.nX = Math.max(htParam.nX, nScrollLeft);
					htParam.nX = Math.min(htParam.nX, htRect.nWidth - aSize[0] + nScrollLeft);
				}
				
				if (htParam.nY !== null) {
					htParam.nY = Math.max(htParam.nY, nScrollTop);
					htParam.nY = Math.min(htParam.nY, htRect.nHeight - aSize[1] + nScrollTop);
				}
			}
			if (htParam.nX !== null) {
				elDrag.style.left = htParam.nX + 'px';
			}
			if (htParam.nY !== null) {
				elDrag.style.top = htParam.nY + 'px';
			}
			this.fireEvent('drag', htParam);
		} 
	},
	
	_onMouseUp : function(we) {
		this._stopDragging(false);
		
		var htInfo = this._htDragInfo;
		if (this._bHandleDown) {
			this._bHandleDown = false;
			
			this.fireEvent("handleUp", {
				weEvent : we,
				elHandle : htInfo.elHandle,
				elDrag : htInfo.elDrag 
			});
		}
	},
	
	_onDragStart : function(we) {
		if (this._findDraggableElement(we.element)) { 
			we.stop(jindo.$Event.CANCEL_DEFAULT); 
		}
	},
	
	_onSelectStart : function(we) {
		if (this._bIsDragging || this._findDraggableElement(we.element)) {
			we.stop(jindo.$Event.CANCEL_DEFAULT);	
		}
	}
	
}).extend(jindo.UIComponent);
/**
 * @fileOverview 마우스 이벤트에 따라 롤오버효과를 쉽게 처리할 수 있게 도와주는 컴포넌트
 * @author hooriza, modified by senxation
 * @version 0.5.1
 */
jindo.RolloverArea = jindo.$Class({
	/** @lends jindo.RolloverArea */
	  
	/**
	 * RolloverArea 컴포넌트를 생성한다.
	 * RolloverArea 컴포넌트는 기준 엘리먼트의 자식들 중 특정 클래스명을 가진 엘리먼트에 마우스액션이 있을 경우 클래스명을 변경하는 이벤트를 발생시킨다.
	 * @constructs 
	 * @class 마우스 이벤트에 따라 롤오버효과를 쉽게 처리할 수 있게 도와주는 컴포넌트
	 * @extends jindo.UIComponent
	 * @param {HTMLElement} el 상위 기준 엘리먼트. 컴포넌트가 적용되는 영역(Area)이 된다.
	 * @param {HashTable} htOption 옵션 객체
	 * @example
var oRolloverArea = new jindo.RolloverArea(document.body, {
	sClassName : "rollover", // (String) 컴포넌트가 적용될 엘리먼트의 class 명. 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트에 Rollover 컴포넌트가 적용된다.
	sClassPrefix : "rollover-", // (String) 컴포넌트가 적용될 엘리먼트에 붙게될 class명의 prefix. (prefix+"over|down")
	bCheckMouseDown : true, // (Boolean) mousedown과 mouseup이벤트 핸들링여부 선언
	bActivateOnload : true, // (Boolean) 컴포넌트가 로드된 후 activate 여부
	htStatus : {
		sOver : "over", // (String) mouseover시 추가될 클래스명
		sDown : "down" // (String) mousedown시 추가될 클래스명
	}  
}).attach({
	over : function(oCustomEvent) {
		//컴포넌트가 적용된 엘리먼트에 마우스 커서가 올라갔을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	element : (HTMLElement) 적용된 엘리먼트
		//	htStatus : {
		//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
		//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
		//	},
		//	weEvent : ($Event) mousedown 이벤트에 대한 $Event 객체  
		//}
		//oCustomEvent.stop(); 수행시 클래스명을 추가하지 않음
	},
	down : function(oCustomEvent) {
		//컴포넌트가 적용된 엘리먼트에 마우스 버튼을 눌렀을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	element : (HTMLElement) 적용된 엘리먼트
		//	htStatus : {
		//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
		//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
		//	},
		//	weEvent : ($Event) mousedown 이벤트에 대한 $Event 객체
		//}
		//oCustomEvent.stop(); 수행시 클래스명을 추가하지 않음
	},
	up : function(oCustomEvent) {
		//컴포넌트가 적용된 엘리먼트에 마우스 버튼을 눌렀다 뗏을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	element : (HTMLElement), 적용된 엘리먼트
		//	htStatus : {
		//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
		//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
		//	},
		//	weEvent : ($Event) mouseup 이벤트에 대한 $Event 객체  
		//}
		//oCustomEvent.stop(); 수행시 클래스명을 제거하지 않음
	},
	out : function(oCustomEvent) {
		//컴포넌트가 적용된 엘리먼트에 마우스 커서가 벗어났을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	element : (HTMLElement) 적용된 엘리먼트
		//	htStatus : {
		//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
		//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
		//	},
		//	weEvent : ($Event) mouseout 이벤트에 대한 $Event 객체  
		//}
		//oCustomEvent.stop(); 수행시 클래스명을 제거하지 않음
	}
});
	 */				  
	$init : function(el, htOption) {
		this.option({ 
			sClassName : "rollover", 
			sClassPrefix : "rollover-",
			bCheckMouseDown : true,
			bActivateOnload : true,
			htStatus : {
				sOver : "over",
				sDown : "down"
			} 
		});
		this.option(htOption || {});
		
		this._elArea = jindo.$(el);
		this._aOveredElements = [];
		this._aDownedElements = [];
		this._wfMouseOver = jindo.$Fn(this._onMouseOver, this);
		this._wfMouseOut = jindo.$Fn(this._onMouseOut, this);
		this._wfMouseDown = jindo.$Fn(this._onMouseDown, this);
		this._wfMouseUp = jindo.$Fn(this._onMouseUp, this);
		
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	_addOvered : function(el) {
		this._aOveredElements.push(el);
	},
	
	_removeOvered : function(el) {
		this._aOveredElements.splice(jindo.$A(this._aOveredElements).indexOf(el), 1);
	},
	
	_addStatus : function(el, sStatus) {
		jindo.$Element(el).addClass(this.option('sClassPrefix') + sStatus);
	},
	
	_removeStatus : function(el, sStatus) {
		jindo.$Element(el).removeClass(this.option('sClassPrefix') + sStatus);
	},
	
	_isInnerElement : function(elParent, elChild) {
		return elParent === elChild ? true : jindo.$Element(elParent).isParentOf(elChild);
	},
	
	/**
	 * RolloverArea를 활성화시킨다.
	 * @return {this}
	 */
	_onActivate : function() {
		this._wfMouseOver.attach(this._elArea, 'mouseover');
		this._wfMouseOut.attach(this._elArea, 'mouseout');
		if (this.option("bCheckMouseDown")) {
			this._wfMouseDown.attach(this._elArea, 'mousedown');
			this._wfMouseUp.attach(document, 'mouseup');
		}
	},
	
	/**
	 * RolloverArea를 비활성화시킨다.
	 * @return {this}
	 */
	_onDeactivate : function() {
		this._wfMouseOver.detach(this._elArea, 'mouseover');
		this._wfMouseOut.detach(this._elArea, 'mouseout');
		this._wfMouseDown.detach(this._elArea, 'mousedown');
		this._wfMouseUp.detach(document, 'mouseup');
		
		this._aOveredElements.length = 0;
		this._aDownedElements.length = 0;
	},
	
	_findRollover : function(el) {
		var sClassName = this.option('sClassName');
		return jindo.$$.test(el, '.' + sClassName) ? el : jindo.$$.getSingle('! .' + sClassName, el);
	},
	
	_onMouseOver : function(we) {
		var el = we.element,
			elRelated = we.relatedElement,
			htParam;
		
		for (; el = this._findRollover(el); el = el.parentNode) {
			if (elRelated && this._isInnerElement(el, elRelated)) {
				continue;
			}
			
			this._addOvered(el);
				
			htParam = { 
				element : el,
				htStatus : this.option("htStatus"),
				weEvent : we
			};
			
			if (this.fireEvent('over', htParam)) {
				this._addStatus(htParam.element, htParam.htStatus.sOver);
			} 
		}
	},
	
	_onMouseOut : function(we) {
		var el = we.element,
			elRelated = we.relatedElement,
			htParam;
		
		for (; el = this._findRollover(el); el = el.parentNode) {
			if (elRelated && this._isInnerElement(el, elRelated)) {
				continue;
			} 
			
			this._removeOvered(el);
				
			htParam = { 
				element : el,
				htStatus : this.option("htStatus"),
				weEvent : we
			};
			if (this.fireEvent('out', htParam)) {
				this._removeStatus(htParam.element, htParam.htStatus.sOver);
			} 
		}
	},
	
	_onMouseDown : function(we) {
		var el = we.element,
			htParam;
			
		while (el = this._findRollover(el)) {
			htParam = { 
				element : el,
				htStatus : this.option("htStatus"),
				weEvent : we
			};
			this._aDownedElements.push(el);
			if (this.fireEvent('down', htParam)) {
				this._addStatus(htParam.element, htParam.htStatus.sDown);
			}
			
			el = el.parentNode;
		}
	},
	
	_onMouseUp : function(we) {
		var el = we.element,
			aTargetElementDatas = [],		
			aDownedElements = this._aDownedElements,
			htParam,
			elMouseDown,
			i;
		
		for (i = 0; elMouseDown = aDownedElements[i]; i++) {
			aTargetElementDatas.push({ 
				element : elMouseDown,
				htStatus : this.option("htStatus"),
				weEvent : we
			});
		}
		
		for (; el = this._findRollover(el); el = el.parentNode) {
			if (jindo.$A(aDownedElements).indexOf(el) > -1) {
				continue;
			}
			
			aTargetElementDatas.push({ 
				element : el,
				htStatus : this.option("htStatus"),
				weEvent : we
			});
		}
		
		for (i = 0; htParam = aTargetElementDatas[i]; i++) {
			if (this.fireEvent('up', htParam)) {
				this._removeStatus(htParam.element, htParam.htStatus.sDown);
			}		
		}
		
		this._aDownedElements = [];
	}
}).extend(jindo.UIComponent);

/**
 * @fileOverview 특정 엘리먼트와 지정한 엘리먼트 그룹에서 발생한 이벤트에 따라 레이어를 보여주고 숨겨주는 컴포넌트
 * @author hooriza, modified by senxation
 * @version 0.5.7
 */

jindo.LayerManager = jindo.$Class({
	/** @lends jindo.LayerManager.prototype */
	
	_bIsActivating  : false,
	_bIsLayerVisible : false,
	_bIsHiding : false, //hide() 메소드가 Timer로 수행되고 있는지의 여부
	_bIsShowing : false,
	_aLink : null,
	
	/**
	 * 새로운 jindo.LayerManager 객체를 생성한다
	 * @constructs
	 * @class 특정 엘리먼트와 지정한 엘리먼트 그룹에서 발생한 이벤트에 따라 레이어를 보여주고 숨겨주는 컴포넌트
	 * @param {HTMLElement | String} el 숨기고자하는 레이어 엘리먼트 (혹은 id)
	 * @param {HashTable} htOption 추가 옵션 (생략가능)
	 * @extends jindo.UIComponent
	 * @requires jindo.Timer
	 * @requires jindo.Transition
	 * @example
var o = new jindo.LayerManager("layer", {
	sCheckEvent : 'click', // {String} 어떤 이벤트가 발생했을 때 레이어를 닫아야 하는지 설정
	nCheckDelay : 100, //{Number} sCheckEvent 발생시 지정된 시간 후에 레이어를 닫음. 이 시간 내에 다시 링크된 엘리먼트에 mouseover되는 경우 레이어가 숨기지 않도록 지정
	nShowDelay : 0, //{Number} 보여주도록 명령을 한 뒤 얼마 이후에 실제로 보여질지 지연시간 지정 (ms)
	nHideDelay : 100, //{Number} 숨기도록 명령을 한 뒤 얼마 이후에 실제로 숨겨지게 할지 지연시간 지정 (ms)
	sMethod : "show", //{String} "fade", "slide" 보이고 숨길 방법 설정 (Transition 컴포넌트 사용)
	nDuration : 200, //{Number} Transition이 진행될 시간,
	Transition : { //jindo.Transition에 적용될 옵션들
		fFadeIn : jindo.Effect.cubicEaseOut, //fadeIn()시 적용될 jindo.Effect
		fFadeOut : jindo.Effect.cubicEaseIn, //fadeOut()시 적용될 jindo.Effect
		fSlideDown : jindo.Effect.cubicEaseOut, //slideDown()시 적용될 jindo.Effect
		fSlideUp : jindo.Effect.cubicEaseIn //slideUp()시 적용될 jindo.Effect
	}
}).attach({
	'beforeShow' : function(oCustomEvent) {
		//레이어를 보여주기 전 발생
		//oCustomEvent.stop()을 수행시 레이어를 보여주지 않는다.
	},
	'appear' : function(oCustomEvent) {
		//화면에 나타나기 시작한 시점에 발생.
		//"fade", "slide"같은 트랜지션효과인 경우 appear와 show가 발생하는 시점이 다를 수 있다. 
	},
	'show' : function(oCustomEvent) {
		//레이어를 보여준 후 발생
	},
	'ignore' : function(oCustomEvent) {
		//이벤트가 발생했으나 레이어를 숨기지 않도록 무시된 경우 발생 
		//oCustomEvent.sCheckEvent (String) 무시된 이벤트 타입
	},
	'beforeHide' : function(oCustomEvent) {
		//레이어를 숨기기 전 발생
		//oCustomEvent.stop()을 수행시 레이어를 숨기지 않는다.
	},
	'hide' : function(oCustomEvent) {
		//레이어를 숨긴 후 발생
	}
}).link(elLayer).link(elBtn);
	 */
	$init: function(el, htOption){
		this.option({
			sCheckEvent: "click",
			nCheckDelay: 100,
			nShowDelay: 0,
			nHideDelay: 100,
			sMethod : "show", // "fade", "slide"
			nDuration : 200,
			Transition : {
				fFadeIn : jindo.Effect.cubicEaseOut,
				fFadeOut : jindo.Effect.cubicEaseIn,
				fSlideDown : jindo.Effect.cubicEaseOut,
				fSlideUp : jindo.Effect.cubicEaseIn
			}
		});
		
		this.option(htOption || {});
		this.setLayer(el);
		
		this._aLink = [];
		this._oShowTimer = new jindo.Timer();
		this._oHideTimer = new jindo.Timer();
		this._oEventTimer = new jindo.Timer();
		this._wfOnEvent = jindo.$Fn(this._onEvent, this);
		this.getVisible();
		this.activate();
	},
	
	/**
	 * 컴포넌트를 활성화한다.
	 */
	_onActivate : function() {
		this._wfOnEvent.attach(document, this.option("sCheckEvent"));
	},
	
	/**
	 * 컴포넌트를 비활성화한다.
	 */
	_onDeactivate : function() {
		this._wfOnEvent.detach(document, this.option("sCheckEvent"));
	},
	
	/**
	 * Layer가 보여지고 있는지 여부를 가져온다.
	 * @return {Boolean}
	 */
	getVisible: function(){
		return this._bIsLayerVisible = (this._wel.visible() && this._wel.opacity() > 0);
	},
	
	_check: function(el){
		var wel = jindo.$Element(el);
		for (var i = 0, elLink; elLink = this._aLink[i]; i++) {
			elLink = jindo.$Element(elLink).$value();
			if (elLink && (el == elLink || wel.isChildOf(elLink))) {
				return true;
			} 
		}
		return false;
	},
	
	_find: function(el){
		for (var i = 0, elLink; (elLink = this._aLink[i]); i++) {
			if (elLink == el) {
				return i;
			} 
		}
		return -1;
	},
	
	/**
	 * 보여주고 숨겨줄 레이어 객체를 가져온다.
	 * @return {HTMLElement} 
	 */
	getLayer : function() {
		return this._el;
	},
	
	/**
	 * 보여주고 숨겨줄 레이어 객체를 설정한다.
	 * @return {this} 
	 */
	setLayer : function(el) {
		this._el = jindo.$(el);
		this._wel = jindo.$Element(el);
		
		var elToMeasure = this._el.cloneNode(true);
		var welToMeasure = jindo.$Element(elToMeasure);
		welToMeasure.css({
			position : "absolute",
			left : "-5000px"
		}).appendTo(this._el.parentNode);
		
		welToMeasure.show();
		this._nLayerHeight = welToMeasure.height();
		welToMeasure.height(this._nLayerHeight);
		this._sLayerCSSHeight = welToMeasure.css("height");
		this._sLayerCSSOverflowX = this._wel.css("overflowX");
		this._sLayerCSSOverflowY = this._wel.css("overflowY");
		welToMeasure.css("overflow", "hidden").height(0);
		this._nSlideMinHeight = welToMeasure.height() + 1; 
		welToMeasure.leave();
			
		return this;
	},
	
	_transform : function(){
		this._wel.css({
			"overflowX": "hidden",
			"overflowY": "hidden"
		});
	},
	
	_restore : function() {
		this._wel.css({
			"overflowX": this._sLayerCSSOverflowX,
			"overflowY": this._sLayerCSSOverflowY
		});
	},
	
	/**
	 * link된 엘리먼트 배열을 가져온다.
	 * @return {Array}
	 */
	getLinks : function() {
		return this._aLink;
	},
	
	/**
	 * link할 엘리먼트 배열을 설정한다.
	 * @param {Array}
	 * @return {this} 인스턴스 자신
	 */
	setLinks : function(a) {
		this._aLink = jindo.$A(a).unique().$value();
		return this;
	},
	
	/**
	 * 생성자의 옵션으로 지정한 이벤트가 발생해도 레이어를 닫지 않게 할 엘리먼트를 지정한다
	 * @param {vElement} vElement 이벤트를 무시할 엘리먼트 또는 엘리먼트의 ID (인자를 여러개 주어서 다수 지정 가능)
	 * @return {this} 인스턴스 자신
	 * @example
	 *	o.link(jindo.$("one"), "two", oEl);
	 */
	link: function(vElement){
		if (arguments.length > 1) {
			for (var i = 0, len = arguments.length; i < len; i++) {
				this.link(arguments[i]);
			}
			return this;
		}
		
		if (this._find(vElement) != -1) {
			return this;
		} 
		
		this._aLink.push(vElement);
		return this;
	},
	
	/**
	 * 생성자의 옵션으로 지정한 이벤트가 발생해도 레이어를 닫지 않게 할 엘리먼트 지정한 것을 제거한다
	 * @param {vElement} vElement 이벤트가 무시된 엘리먼트 또는 엘리먼트의 ID (인자를 여러개 주어서 다수 지정 가능)
	 * @return {this} 인스턴스 자신
	 * @example
	 *	o.unlink(jindo.$("one"), "two", oEl);
	 */
	unlink: function(vElement){
		if (arguments.length > 1) {
			for (var i = 0, len = arguments.length; i < len; i++) {
				this.unlink(arguments[i]);
			}
			return this;
		}
		
		var nIndex = this._find(vElement);
		if (nIndex > -1) {
			this._aLink.splice(nIndex, 1);
		}
		
		return this;
	},
	
	_fireEventBeforeShow : function() {
		this._transform();
		return this.fireEvent("beforeShow", {
			elLayer : this.getLayer(),
			aLinkedElement : this.getLinks(),
			sMethod : this.option("sMethod")
		});
	},
	
	_fireEventAppear : function() {
		this.fireEvent("appear", {
			elLayer : this.getLayer(),
			aLinkedElement : this.getLinks(),
			sMethod : this.option("sMethod")
		});
	},
	
	_fireEventShow : function() {
		this._bIsShowing = false;
		this._restore();
		this.fireEvent("show", {
			elLayer : this.getLayer(),
			aLinkedElement : this.getLinks(),
			sMethod : this.option("sMethod")
		});
	},
	
	
	_fireEventBeforeHide : function() {
		this._transform();
		return this.fireEvent("beforeHide", {
			elLayer : this.getLayer(),
			aLinkedElement : this.getLinks(),
			sMethod : this.option("sMethod")
		});
	},
	
	_fireEventHide : function() {
		this._bIsHiding = false;
		this._restore();
		this.fireEvent("hide", {
			elLayer : this.getLayer(),
			aLinkedElement : this.getLinks(),
			sMethod : this.option("sMethod")
		});
	},
	
	_show: function(fShow, nDelay){
		this._oEventTimer.abort();
		this._bIsShowing = true;
		this._bIsHiding = false;
		if (nDelay > 0) {
			this._oShowTimer.start(fShow, nDelay);
		} else {
			this._oHideTimer.abort();
			fShow();
		}
	},
	
	_hide: function(fHide, nDelay){
		this._bIsShowing = false;
		this._bIsHiding = true;
		if (nDelay > 0) {
			this._oHideTimer.start(fHide, nDelay);
		} else {
			this._oShowTimer.abort();
			fHide();
		}
	},
	
	_getShowMethod : function() {
		switch (this.option("sMethod")) {
			case "show" :
				return "showIn";
			case "fade" :
				return "fadeIn";
			case "slide" :
				return "slideDown";
		}
	},
	
	_getHideMethod : function() {
		switch (this.option("sMethod")) {
			case "show" :
				return "hideOut";
			case "fade" :
				return "fadeOut";
			case "slide" :
				return "slideUp";
		}
	},
	
	/**
	 * 레이어를 보여준다.
	 * 레이어를 보여주는 방식은 sMethod 옵션에 따른다.
	 * @param {Number} nDelay
	 * @return {this}
	 */
	show : function(nDelay) {
		if (typeof nDelay == "undefined") {
			nDelay = this.option("nShowDelay");
		}
		this[this._getShowMethod()](nDelay);
		return this;
	},
	
	/**
	 * 레이어를 숨긴다.
	 * 레이어를 숨기는 방식은 sMethod 옵션에 따른다.
	 * @param {Number} nDelay
	 * @return {this}
	 */
	hide : function(nDelay) {
		if (typeof nDelay == "undefined") {
			nDelay = this.option("nHideDelay");
		}
		this[this._getHideMethod()](nDelay);
		return this;
	},
	
	/**
	 * 레이어를 보여주도록 요청한다
	 * @param {Number} nDelay 레이어를 보여줄 때의 지연시간을 지정 (생략시 옵션으로 지정한 nShowDelay 값을 따른다)
	 * @return {this} 인스턴스 자신
	 */
	showIn: function(nDelay){
		if (typeof nDelay == "undefined") {
			nDelay = this.option("nShowDelay");
		}
		
		var self = this;
		this._show(function(){
			self._sAppliedMethod = "show";
			if (!self.getVisible()) {
				if (self._fireEventBeforeShow()) {
					self._wel.show();
					self._fireEventAppear();
					self._fireEventShow();
				}
			}
		}, nDelay);
		
		return this;
	},
	
	/**
	 * 레이어를 숨기도록 요청한다
	 * @param {Number} nDelay 레이어를 숨길 때의 지연시간을 지정 (생략시 옵션으로 지정한 nHideDelay 값을 따른다)
	 * @return {this} 인스턴스 자신
	 */
	hideOut: function(nDelay){
		if (typeof nDelay == "undefined") {
			nDelay = this.option("nHideDelay");
		}
		var self = this;
		this._hide(function(){
			self._sAppliedMethod = "show";
			if (self.getVisible()) {
				if (self._fireEventBeforeHide()) {
					self._wel.hide();
					self._fireEventHide();
				}
			}
		}, nDelay);
		return this;
	},
	
	/**
	 * fade, slide를 위한 transition 객체를 가져온다.
	 */
	_getTransition : function() {
		if (this._oTransition) {
			return this._oTransition;	
		} else {
			return (this._oTransition = new jindo.Transition().fps(30));
		}
	},
	
	/**
	 * 레이어를 보여주도록 요청한다
	 * @param {Number} nDelay 레이어를 보여줄 때의 지연시간을 지정 (생략시 옵션으로 지정한 nShowDelay 값을 따른다)
	 * @return {this} 인스턴스 자신
	 */
	fadeIn : function(nDelay){
		var oTransition = this._getTransition();
		oTransition.detachAll().abort();
		
		if (typeof nDelay == "undefined") {
			nDelay = this.option("nShowDelay");
		}
		var nDuration = this.option("nDuration");
		
		var self = this;
		this._show(function(){
			self._sAppliedMethod = "fade";
			var elLayer = self.getLayer();
			
			if (!self._wel.visible() || self._wel.opacity() != 1) {
				//show
				if (self._fireEventBeforeShow()) {
					if (!self._wel.visible()) {
						self._wel.opacity(0);
						self._wel.show();
					}
					nDuration *= (1 - self._wel.opacity());
					oTransition.attach({
						playing: function(oCustomEvent){
							if (oCustomEvent.nStep === 1) {
								this.detach("playing", arguments.callee);
								self._fireEventAppear();
							}
						},
						end: function(oCustomEvent){
							this.detach("end", arguments.callee);
							self._fireEventShow();
						}
					}).start(nDuration, elLayer, {
						"@opacity": self.option("Transition").fFadeIn.apply(null, [1])
					});
				}
			}
		}, nDelay);
		
		return this;
	},
	
	/**
	 * 레이어를 숨기도록 요청한다
	 * @param {Number} nDelay 레이어를 숨길 때의 지연시간을 지정 (생략시 옵션으로 지정한 nHideDelay 값을 따른다)
	 * @return {this} 인스턴스 자신
	 */
	fadeOut: function(nDelay){
		var oTransition = this._getTransition();
		oTransition.detachAll().abort();
		
		if (typeof nDelay == "undefined") {
			nDelay = this.option("nHideDelay");
		}
		var nDuration = this.option("nDuration");
		
		var self = this;
		this._hide(function(){
			self._sAppliedMethod = "fade";
			
			if (self.getVisible()) {
				var elLayer = self.getLayer();
				if (self._fireEventBeforeHide()) {
				
					nDuration *= self._wel.opacity();
					
					oTransition.attach({
						end: function(e){
							this.detach("end", arguments.callee);
							self._wel.hide();
							self._wel.opacity(1);
							self._fireEventHide();
						}
					}).start(nDuration, elLayer, {
						"@opacity": self.option("Transition").fFadeOut.apply(null, [0])
					});
				}
			}
		}, nDelay);
		return this;
	},
	
	/**
	 * 레이어를 보여주도록 요청한다
	 * @param {Number} nDelay 레이어를 보여줄 때의 지연시간을 지정 (생략시 옵션으로 지정한 nShowDelay 값을 따른다)
	 * @return {this} 인스턴스 자신
	 */
	slideDown : function(nDelay){
		var oTransition = this._getTransition();
		oTransition.detachAll().abort();
		
		if (typeof nDelay == "undefined") {
			nDelay = this.option("nShowDelay");
		}
		var nDuration = this.option("nDuration");
		
		var self = this;
		
		this._show(function(){
			self._sAppliedMethod = "slide";
			var elLayer = self.getLayer();
			
			if (Math.ceil(self._wel.height()) < self._nLayerHeight) {
				//show
				if (self._fireEventBeforeShow()) {
					if (!self.getVisible()) {
						self._wel.height(0).show();
					} else {
						nDuration = Math.ceil(nDuration * ((self._nLayerHeight - self._wel.height()) / (self._nLayerHeight - self._nSlideMinHeight)));
					}
					oTransition.attach({
						playing: function(oCustomEvent){
							if (oCustomEvent.nStep === 1) {
								this.detach("playing", arguments.callee);
								self._fireEventAppear();
							}
						},
						end: function(oCustomEvent){
							this.detach("end", arguments.callee);
							self._fireEventShow();
						}
					}).start(nDuration, {
						getter: function(sKey){
							return jindo.$Element(elLayer)[sKey]() + 1;
						},
						
						setter: function(sKey, nValue){
							jindo.$Element(elLayer)[sKey](parseFloat(nValue));
						}
					}, {
						height: self.option("Transition").fSlideDown.apply(null, [self._nLayerHeight])
					});
				}
			}
		}, nDelay);
		
		return this;
	},
	
	/**
	 * 레이어를 숨기도록 요청한다
	 * @param {Number} nDelay 레이어를 숨길 때의 지연시간을 지정 (생략시 옵션으로 지정한 nHideDelay 값을 따른다)
	 * @return {this} 인스턴스 자신
	 */
	slideUp: function(nDelay){
		var oTransition = this._getTransition();
		oTransition.detachAll().abort();
		
		if (typeof nDelay == "undefined") {
			nDelay = this.option("nHideDelay");
		}
		var nDuration = this.option("nDuration");
		
		var self = this;
		this._hide(function(){
			self._sAppliedMethod = "slide";
			var elLayer = self.getLayer();
			
			if (self.getVisible()) {
				if (self._fireEventBeforeHide()) {
					nDuration = Math.ceil(nDuration * (self._wel.height() / self._nLayerHeight));
					oTransition.attach({
						end: function(e){
							self._wel.hide().css({
								"height": self._sLayerCSSHeight
							});
							this.detach("end", arguments.callee);
							
							self._fireEventHide();
						}
					}).start(nDuration, {
						getter: function(sKey){
							return jindo.$Element(elLayer)[sKey]();
						},
						setter: function(sKey, nValue){
							jindo.$Element(elLayer)[sKey](Math.ceil(nValue));
						}
					}, {
						height: self.option("Transition").fSlideUp.apply(null, [self._nSlideMinHeight])
					});
				}
			}
		}, nDelay);
		
		return this;
	},
	
	/**
	 * 레이어를 보여주거나 숨기도록 요청한다
	 * @param {Number} nDelay 레이어를 보여주거나 숨길 때의 지연시간을 지정 (생략시 옵션으로 지정한 showDelay/hideDelay 값을 따른다)
	 * @return {this} 인스턴스 자신
	 */
	toggle: function(nDelay){
		if (!this.getVisible() || this._bIsHiding) {
			this.show(nDelay || this.option("nShowDelay"));
		} else {
			this.hide(nDelay || this.option("nHideDelay"));
		}
		return this;
	},
	
	_onEvent : function(we){
		var el = we.element,
			self = this;
		
		this._oEventTimer.start(function() {
			if (!self._bIsHiding && self.getVisible()) {
				if (self._check(el)) { // hide()수행중이 아니고 links 객체들 안에서 발생한거면 무시
					if (!self._bIsShowing) {
						self.fireEvent("ignore", {
							sCheckEvent : self.option("sCheckEvent")
						});
						self._oHideTimer.abort();
						self._bIsHiding = false;
					}
				} else { //이벤트에 의해 hide()
					//mousedown시 disabled된 input일 경우 el이 제대로 리턴되지 않는 IE버그 수정
					if (typeof el.tagName != "undefined") {
						self.hide();
					}
				}
			}
		}, this.option("nCheckDelay"));	//link된 레이어 내를 클릭해서 레이어를 닫으려하는 경우 처리
	}
	
}).extend(jindo.UIComponent);
/**
 * @fileOverview RolloverArea와 달리 mousedown/mouseup이 아닌 click이벤트를 체크하는 컴포넌트
 * @author senxation
 * @version 0.1.3
 */
jindo.RolloverClick = jindo.$Class({
	/** @lends jindo.RolloverClick.prototype */
	  
	/**
	 * RolloverClick 컴포넌트를 생성한다.
	 * RolloverClick 컴포넌트는 기준 엘리먼트의 자식들 중 특정 클래스명을 가진 엘리먼트에 마우스액션이 있을 경우 클래스명을 변경하는 이벤트를 발생시킨다.
	 * @constructs 
	 * @class RolloverArea와 달리 mousedown/mouseup이 아닌 click이벤트를 체크하는 컴포넌트
	 * @extends jindo.UIComponent
	 * @requires jindo.RolloverArea
	 * @param {HTMLElement} el RolloverArea에 적용될 상위 기준 엘리먼트. 컴포넌트가 적용되는 영역(Area)이 된다.
	 * @param {HashTable} htOption 옵션 객체
	 * @see jindo.RolloverArea
	 * @example
var oRolloverClick = new jindo.RolloverClick(document.body, {
	bActivateOnload : true, // (Boolean) 컴포넌트가 로드된 후 activate 여부
	sCheckEvent : "click", // (String) 클릭이벤트를 체크하기 위한 이벤트명. "click", "mousedown", "mouseup"이 사용될 수 있다. 해당 이벤트가 발생하면 click 커스텀이벤트가 발생한다.
	bCheckDblClick : false, // (Boolean) 더블클릭이벤트를 체크할 지 여부
	RolloverArea : { //RolloverArea에 적용될 옵션 객체
		sClassName : "rollover", // (String) 컴포넌트가 적용될 엘리먼트의 class 명. 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트에 Rollover 컴포넌트가 적용된다.
		sClassPrefix : "rollover-", // (String) 컴포넌트가 적용될 엘리먼트에 붙게될 class명의 prefix. (prefix+"over|down")
		htStatus : {
			sOver : "over", // (String) mouseover시 추가될 클래스명
			sDown : "down" // (String) mousedown시 추가될 클래스명
		}  
	}
}).attach({
	over : function(oCustomEvent) {
		//컴포넌트가 적용된 엘리먼트에 마우스 커서가 올라갔을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	element : (HTMLElement) 적용된 엘리먼트
		//	htStatus : {
		//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
		//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
		//	},
		//	weEvent : ($Event) mousedown 이벤트에 대한 $Event 객체  
		//}
		//oCustomEvent.stop(); 수행시 클래스명을 추가하지 않음
	},
	out : function(oCustomEvent) {
		//컴포넌트가 적용된 엘리먼트에 마우스 커서가 벗어났을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	element : (HTMLElement) 적용된 엘리먼트
		//	htStatus : {
		//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
		//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
		//	},
		//	weEvent : ($Event) mouseout 이벤트에 대한 $Event 객체  
		//}
		//oCustomEvent.stop(); 수행시 클래스명을 제거하지 않음
	},
	click : function(oCustomEvent) {
		//컴포넌트가 적용된 엘리먼트에 마우스 버튼을 클릭했을 때 발생 (sCheckEvent 이벤트가 발생했을때)
		//전달되는 이벤트 객체 oCustomEvent = {
		//	element : (HTMLElement) 적용된 엘리먼트
		//	htStatus : {
		//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
		//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
		//	},
		//	weEvent : ($Event) click 이벤트에 대한 $Event 객체  
		//}
	},
	dblclick : function(oCustomEvent) {
		//컴포넌트가 적용된 엘리먼트에 마우스 더블버튼을 클릭했을 때 발생. bCheckDblClick 옵션이 true때만 발생한다. 
		//전달되는 이벤트 객체 oCustomEvent = {
		//	element : (HTMLElement) 적용된 엘리먼트
		//	htStatus : {
		//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
		//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
		//	},
		//	weEvent : ($Event) click 이벤트에 대한 $Event 객체  
		//}
	}
});
	 */				  
	$init : function(el, htOption) {
		this.option({ 
			bActivateOnload : true,
			sCheckEvent : "click",
			bCheckDblClick : false, // (Boolean) 더블클릭이벤트를 체크할 지 여부
			RolloverArea : { //RolloverArea에 적용될 옵션 객체
				sClassName : "rollover", // (String) 컴포넌트가 적용될 엘리먼트의 class 명. 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트에 Rollover 컴포넌트가 적용된다.
				sClassPrefix : "rollover-", // (String) 컴포넌트가 적용될 엘리먼트에 붙게될 class명의 prefix. (prefix+"over|down")
				bCheckMouseDown : false,
				bActivateOnload : false,
				htStatus : {
					sOver : "over", // (String) mouseover시 추가될 클래스명
					sDown : "down" // (String) mousedown시 추가될 클래스명
				}  
			}
		});
		this.option(htOption || {});
		
		var self = this;
		this._oRolloverArea = new jindo.RolloverArea(el, this.option("RolloverArea")).attach({
			over : function(oCustomEvent) {
				if (!self.fireEvent("over", oCustomEvent)) {
					oCustomEvent.stop();
				}
			},
			out : function(oCustomEvent) {
				if (!self.fireEvent("out", oCustomEvent)) {
					oCustomEvent.stop();
				}
			}
		});
		this._wfClick = jindo.$Fn(this._onClick, this);
		this._wfDblClick = jindo.$Fn(this._onClick, this);
		
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	_onClick : function(we) {
		var elRollover = we.element,
			sType = "click";
			
		if (we.type == "dblclick") {
			sType = we.type;
		}
		
		while (elRollover = this._oRolloverArea._findRollover(elRollover)) {
			this.fireEvent(sType, { 
				element : elRollover,
				htStatus : this._oRolloverArea.option("htStatus"),
				weEvent : we
			});
			
			elRollover = elRollover.parentNode;
		}
	},
	
	/**
	 * RolloverClick를 활성화시킨다.
	 * @return {this}
	 */
	_onActivate : function() {
		this._wfClick.attach(this._oRolloverArea._elArea, this.option("sCheckEvent"));
		if (this.option("bCheckDblClick")) {
			this._wfDblClick.attach(this._oRolloverArea._elArea, 'dblclick');
		}
		this._oRolloverArea.activate();
	},
	
	/**
	 * RolloverClick를 비활성화시킨다.
	 * @return {this}
	 */
	_onDeactivate : function() {
		this._wfClick.detach(this._oRolloverArea._elArea, this.option("sCheckEvent"));
		this._wfDblClick.detach(this._oRolloverArea._elArea, 'dblclick');
		this._oRolloverArea.deactivate();
	}
}).extend(jindo.UIComponent);
/**
 * @fileOverview 특정 연/월의 달력 출력을 위한 컴포넌트
 * @author senxation
 * @version 0.4.1
 */

jindo.Calendar = jindo.$Class({
	/** @lends jindo.Calendar.prototype */
	/**
	 * Calendar 컴포넌트를 생성한다.
	 * 달력이 출력 될때 토요일, 일요일은 각각 해당 셀에 sat, sun로 className을 설정한다. 
	 * 이전달의 마지막주의 날짜 셀은 prev-mon, 다음달의 첫주의 날짜 셀은 next_mon로 className을 설정한다.
	 * 공휴일 정보는 draw 커스텀 이벤트에서 클래스명 정의를 통해 작성해야한다.
	 * @constructs
	 * @class 특정 연/월의 달력 출력을 위한 컴포넌트
	 * @extends jindo.UIComponent
	 * @param {String | HTMLElement} sLayerId 달력을 출력할 레이어의 id 혹은 레이어 자체.
	 * @param {HashTable} htOption 초기화 옵션 설정을 위한 객체.
	 * @example
var oCalendar = new jindo.Calendar("calendar_layer", {
	sClassPrefix : "calendar-",
	nYear : 1983,
	nMonth : 5,
	nDate : 12,
	sTitleFormat : "yyyy-mm", //설정될 title의 형식
	sYearTitleFormat : "yyyy", //설정될 연 title의 형식
	sMonthTitleFormat : "m", //설정될 월 title의 형식
	aMonthTitle : ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"], //월의 이름을 설정 "title" 세팅시 적용
	bDrawOnload : true //로딩과 동시에 바로 그릴것인지 여부
}).attach({
	beforeDraw : function(oCustomEvent) {
		//달력을 새로 그리기 전 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	nYear : (Number) 연 (ex. 2009) 
		//	nMonth : (Number) 월 (ex. 5)
		//}
		//oCustomEvent.stop()을 실행하면 draw 커스텀 이벤트가 발생하지 않는다. 
	},
	draw : function(oCustomEvent) {
		//달력을 새로 그리는 중 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elDate : (HTMLElement) 날짜가 쓰여질 목표 엘리먼트
		//  elDateContainer : (HTMLElement) week의 child 엘리먼트로 날짜가 쓰여질 목표 엘리먼트를 감싸고 있는 상위 엘리먼트. (element와 같을 수도 있음) 
		//	nYear : (Number) 연 (ex. 2009) 
		//	nMonth : (Number) 월 (ex. 5)
		//	nDate : (Number) 일 (ex. 12)
		//	bPrevMonth : (Boolean) 그려질 날이 이전달의 날인지 여부
		//	bNextMonth : (Boolean) 그려질 날이 다음달의 날인지 여부
		//}
	},
	afterDraw : function(oCustomEvent) {
		//달력을 그린 이후 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	nYear : (Number) 연 (ex. 2009) 
		//	nMonth : (Number) 월 (ex. 5)
		//}
	}
});
	 * @example 
옵션의 sTitleFormat은 날짜의 형식으로 title 엘리먼트에 표현될 형식을 지정한다. 
다음의 형식을 조합하여 사용할 수 있다.
ex) "yyyy.m", "yyyy년 m월", "yy/m" ...
연도 : yyyy(4자리 숫자, ex "2001"), yy(2자리 숫자, ex "01")
월 : mm(2자리 숫자, ex "01"), m(1자리 숫자, ex "1"), M(aMonthTitle에 설정된 값으로 보여줌 ex "JAN")
	 */
	$init : function(sLayerId, htOption) {
		this._htToday = this.constructor.getDateHashTable(new Date());
		this._elLayer = jindo.$(sLayerId);
		this.htDefaultOption = {
			sClassPrefix : "calendar-",
			nYear : this._htToday.nYear,
			nMonth : this._htToday.nMonth,
			nDate : this._htToday.nDate,
					
			sTitleFormat : "yyyy-mm",
			sYearTitleFormat : "yyyy",
			sMonthTitleFormat : "m",
			
			aMonthTitle : ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
			bDrawOnload : true
		};
		
		this.option(this.htDefaultOption);
		this.option(htOption || {});
		
		this._assignHTMLElements();
		this.activate();
		this.setDate(this.option("nYear"), this.option("nMonth"), this.option("nDate"));
		if (this.option("bDrawOnload")) {
			this.draw();
		}
	},
	
	/**
	 * 기준 엘리먼트(달력 레이어 엘리먼트)를 가져온다.
	 * @return {HTMLElement} 달력 레이어
	 */
	getBaseElement : function() {
		return this._elLayer;
	},
	
	/**
	 * 현재 설정된 날짜를 가져온다.
	 * @return {HashTable} 
	 * @example 
oCalendar.getDate() -> { nYear : 2000, nMonth : 1, nDate : 31 } 
	 */
	getDate : function() {
		return this._htDate;
	},
	
	/**
	 * 그려진 달력의 날짜엘리먼트로 해당하는 날짜를 구한다.
	 * @param {HTMLElement} el week엘리먼트의 자식노드로 존재하는 7개의 엘리먼트중 하나
	 * @return {HashTable}
	 * @example 
oCalendar.getDateOfElement(el) -> { nYear : 2000, nMonth : 1, nDate : 31 }
	 */
	getDateOfElement : function(el) {
		var nDateIndex = jindo.$A(this._aDateContainerElement).indexOf(el);
		if (nDateIndex > -1) {
			return this._aMetaData[nDateIndex];
		}
		return null;
	},
	
	/**
	 * 오늘의 정보를 가지는 Hash Table을 가져온다.
	 * @return {HashTable}
	 * @example 
oCalendar.getToday() -> { nYear : 2000, nMonth : 1, nDate : 31 }
	 */
	getToday : function() {
		return this._htToday;
	},

	/**
	 * 현재 달력의 날짜를 설정한다.
	 * @param {Number} nYear 연도 값 (ex. 2008)
	 * @param {Number} nMonth 월 값 (1 ~ 12)
	 * @param {Number} nDate 일 값 (1 ~ 31)
	 */
	setDate : function(nYear, nMonth, nDate) {
		this._htDate = {
			nYear : nYear,
			nMonth : (nMonth * 1),
			nDate : (nDate * 1)
		};
	},
	
	/**
	 * 현재 표시된 달력의 날짜를 가져온다.
	 * @remark 기본으로 설정된 날짜 또는 setDate로 설정된 날짜와 다른 경우, nDate 값은 1이다.
	 * @return {HashTable} 
	 * @example 
oCalendar.getShownDate() -> { nYear : 2000, nMonth : 1, nDate : 1 }
	 */
	getShownDate : function() {
		return this._getShownDate();
	},
	
	_getShownDate : function() {
		return this.htShownDate || this.getDate();
	},

	_setShownDate : function(nYear, nMonth) {
		this.htShownDate = {
			nYear : nYear,
			nMonth : (nMonth * 1),
			nDate : 1
		};
	},

	_assignHTMLElements : function() {
		var sClassPrefix = this.option("sClassPrefix"),
			elLayer = this.getBaseElement();
	
		if ((this.elBtnPrevYear = jindo.$$.getSingle(("." + sClassPrefix + "btn-prev-year"), elLayer))) {
			this.wfPrevYear = jindo.$Fn(function(oEvent){
				oEvent.stop(jindo.$Event.CANCEL_DEFAULT);
				this.draw(-1, 0, true);
			}, this);
		}
		if ((this.elBtnPrevMonth = jindo.$$.getSingle(("." + sClassPrefix + "btn-prev-mon"), elLayer))) {
			this.wfPrevMonth = jindo.$Fn(function(oEvent){
				oEvent.stop(jindo.$Event.CANCEL_DEFAULT);
				this.draw(0, -1, true);
			}, this);	
		}
		if ((this.elBtnNextMonth = jindo.$$.getSingle(("." + sClassPrefix + "btn-next-mon"), elLayer))) {
			this.wfNextMonth = jindo.$Fn(function(oEvent){
				oEvent.stop(jindo.$Event.CANCEL_DEFAULT);
				this.draw(0, 1, true);
			}, this);
		}
		if ((this.elBtnNextYear = jindo.$$.getSingle(("." + sClassPrefix + "btn-next-year"), elLayer))) {
			this.wfNextYear = jindo.$Fn(function(oEvent){
				oEvent.stop(jindo.$Event.CANCEL_DEFAULT);
				this.draw(1, 0, true);
			}, this);
		}
		
		this.elTitle = jindo.$$.getSingle(("." + sClassPrefix + "title"), elLayer);
		this.elTitleYear = jindo.$$.getSingle(("." + sClassPrefix + "title-year"), elLayer);
		this.elTitleMonth = jindo.$$.getSingle(("." + sClassPrefix + "title-month"), elLayer);
		var elWeekTemplate = jindo.$$.getSingle("." + sClassPrefix + "week", elLayer);
		this.elWeekTemplate = elWeekTemplate.cloneNode(true);
		this.elWeekAppendTarget = elWeekTemplate.parentNode;
	},
	
	_setCalendarTitle : function(nYear, nMonth, sType) {
		if (nMonth < 10) {
			nMonth = ("0" + (nMonth * 1)).toString();
		} 
		
		var elTitle = this.elTitle,
			sTitleFormat = this.option("sTitleFormat"),
			sTitle;
		
		if (typeof sType != "undefined") {
			switch (sType) {
				case "year" :
					elTitle = this.elTitleYear;
					sTitleFormat = this.option("sYearTitleFormat");
					sTitle = sTitleFormat.replace(/yyyy/g, nYear).replace(/y/g, (nYear).toString().substr(2,2));
				break;
				case "month" :
					elTitle = this.elTitleMonth;
					sTitleFormat = this.option("sMonthTitleFormat");
					sTitle = sTitleFormat.replace(/mm/g, nMonth).replace(/m/g, (nMonth * 1)).replace(/M/g, this.option("aMonthTitle")[nMonth-1]); 
				break;
			}
		} else {
			sTitle = sTitleFormat.replace(/yyyy/g, nYear).replace(/y/g, (nYear).toString().substr(2,2)).replace(/mm/g, nMonth).replace(/m/g, (nMonth * 1)).replace(/M/g, this.option("aMonthTitle")[nMonth-1] );
		}  
		
		jindo.$Element(elTitle).text(sTitle);
	},
	
	/**
	 * Calendar를 그린다.
	 * @function
	 * @param {Number} nYear 연도 값 (ex. 2008)
	 * @param {Number} nMonth 월 값 (1 ~ 12)
	 * @param {Boolean} bRelative 연도와 월 값이 상대값인지 여부, 생략 가능
	 * @example
oCalendar.draw(); //현재 설정된 날짜의 달력을 그린다.
oCalendar.draw(2008,12); //2008년 12월 달력을 그린다.
oCalendar.draw(null,12); //현재 표시된 달력의 12월을 그린다.
oCalendar.draw(2010,null); //2010년 현재 표시된 달력의 월을 그린다.
oCalendar.draw(0,1,true); //현재 표시된 달력의 다음 달을 그린다.
oCalendar.draw(-1,null,true); //현재 표시된 달력의 이전 연도를 그린다.
	 */
	draw : function(nYear, nMonth, bRelative) {
		var sClassPrefix = this.option("sClassPrefix"),
			htDate = this.getDate(),
			oShownDate = this._getShownDate();
			
		if (oShownDate && typeof bRelative != "undefined" && bRelative) {
			var htRelativeDate = this.constructor.getRelativeDate(nYear, nMonth, 0, oShownDate);
			nYear = htRelativeDate.nYear;
			nMonth = htRelativeDate.nMonth;
		} else if (typeof nYear == "undefined" && typeof nMonth == "undefined" && typeof bRelative == "undefined") {
			nYear = htDate.nYear;
			nMonth = htDate.nMonth;
		} else {
			nYear = nYear || oShownDate.nYear;
			nMonth = nMonth || oShownDate.nMonth; 
		}
		
		if (this.fireEvent("beforeDraw", {
			nYear: nYear,
			nMonth: nMonth
		})) {
			if (this.elTitle) {
				this._setCalendarTitle(nYear, nMonth);
			}
			if (this.elTitleYear) {
				this._setCalendarTitle(nYear, nMonth, "year");
			}
			if (this.elTitleMonth) {
				this._setCalendarTitle(nYear, nMonth, "month");
			}
			
			this._clear(jindo.Calendar.getWeeks(nYear, nMonth));
			this._setShownDate(nYear, nMonth);
			
			var htToday = this.getToday(),		
				nFirstDay = this.constructor.getFirstDay(nYear, nMonth),
				nLastDay = this.constructor.getLastDay(nYear, nMonth),
				nLastDate = this.constructor.getLastDate(nYear, nMonth),
				nDay = 0,
				htDatePrevMonth = this.constructor.getRelativeDate(0, -1, 0, {nYear:nYear, nMonth:nMonth, nDate:1}),
				htDateNextMonth = this.constructor.getRelativeDate(0, 1, 0, {nYear:nYear, nMonth:nMonth, nDate:1}),
				nPrevMonthLastDate = this.constructor.getLastDate(htDatePrevMonth.nYear, htDatePrevMonth.nMonth),	
				aDate = [],
				bPrevMonth,
				bNextMonth,
				welDateContainer,
				nTempYear,
				nTempMonth,
				oParam,
				nIndexOfLastDate,
				elWeek,
				i;
				
			var nWeeks = this.constructor.getWeeks(nYear, nMonth);
		
			for (i = 0; i < nWeeks; i++) {
				elWeek = this.elWeekTemplate.cloneNode(true);
				jindo.$Element(elWeek).appendTo(this.elWeekAppendTarget);
				this._aWeekElement.push(elWeek);
			}
			this._aDateElement = jindo.$$("." + sClassPrefix + "date", this.elWeekAppendTarget);
			this._aDateContainerElement = jindo.$$("." + sClassPrefix + "week > *", this.elWeekAppendTarget);
				
			if (nFirstDay > 0) {
				for (i = nPrevMonthLastDate - nFirstDay; i < nPrevMonthLastDate; i++) {
					aDate.push(i + 1);
				}
			}
			for (i = 1; i < nLastDate + 1; i++) {
				aDate.push(i);	
			}
			nIndexOfLastDate = aDate.length - 1;
			
			for (i = 1; i < 7 - nLastDay; i++) {
				aDate.push(i);	
			}
			
			for (i = 0; i < aDate.length; i++) {
				bPrevMonth = false;
				bNextMonth = false;
				welDateContainer = jindo.$Element(this._aDateContainerElement[i]);
				nTempYear = nYear;
				nTempMonth = nMonth;
				
				if (i < nFirstDay) {
					bPrevMonth = true;
					welDateContainer.addClass(sClassPrefix + "prev-mon");
					nTempYear = htDatePrevMonth.nYear;
					nTempMonth = htDatePrevMonth.nMonth;
				} else if (i > nIndexOfLastDate) {
					bNextMonth = true;
					welDateContainer.addClass(sClassPrefix + "next-mon");				
					nTempYear = htDateNextMonth.nYear;
					nTempMonth = htDateNextMonth.nMonth;
				} else {
					nTempYear = nYear;
					nTempMonth = nMonth;
				}
				
				if (nDay === 0) {
					welDateContainer.addClass(sClassPrefix + "sun");
				}
				if (nDay == 6) {
					welDateContainer.addClass(sClassPrefix + "sat");
				}
				if (nTempYear == htToday.nYear && (nTempMonth * 1) == htToday.nMonth && aDate[i] == htToday.nDate) {
					welDateContainer.addClass(sClassPrefix + "today");
				}
				
				oParam = {
					elDate : this._aDateElement[i],
					elDateContainer : welDateContainer.$value(),
					nYear : nTempYear, 
					nMonth : nTempMonth, 
					nDate : aDate[i],
					bPrevMonth : bPrevMonth,
					bNextMonth : bNextMonth,
					sHTML : aDate[i]
				};
				jindo.$Element(oParam.elDate).html(oParam.sHTML.toString());
				
				this._aMetaData.push({
					nYear : nTempYear, 
					nMonth : nTempMonth, 
					nDate : aDate[i]
				});
				
				nDay = (nDay + 1) % 7;
				
				this.fireEvent("draw", oParam);
			}
			this.fireEvent("afterDraw", {
				nYear : nYear, 
				nMonth : nMonth
			});
		}
	},
	
	_clear : function(nWeek) {
		this._aMetaData = [];
		this._aWeekElement = [];
		jindo.$Element(this.elWeekAppendTarget).empty();
	},
	
	/**
	 * @deprecated activate()
	 */
	attachEvent : function() {
		this.activate();
	},
	
	/**
	 * @deprecated deactivate()
	 */
	detachEvent : function() {
		this.deactivate();
	},
	
	_onActivate : function() {
		if (this.elBtnPrevYear) {
			this.wfPrevYear.attach(this.elBtnPrevYear, "click");
		}
		if (this.elBtnPrevMonth) {
			this.wfPrevMonth.attach(this.elBtnPrevMonth, "click");
			
		}
		if (this.elBtnNextMonth) {
			this.wfNextMonth.attach(this.elBtnNextMonth, "click");			
		}
		if (this.elBtnNextYear) {
			this.wfNextYear.attach(this.elBtnNextYear, "click");
		}
	},
	
	_onDeactivate : function() {
		if (this.elBtnPrevYear) {
			this.wfPrevYear.detach(this.elBtnPrevYear, "click");
		}
		if (this.elBtnPrevMonth) {
			this.wfPrevMonth.detach(this.elBtnPrevMonth, "click");
		}
		if (this.elBtnNextMonth) {
			this.wfNextMonth.detach(this.elBtnNextMonth, "click");			
		}
		if (this.elBtnNextYear) {
			this.wfNextYear.detach(this.elBtnNextYear, "click");
		}
	}
	
}).extend(jindo.UIComponent);

/**
 * Date 객체를 구한다.
 * @example
jindo.Calendar.getDateObject({nYear:2010, nMonth:5, nDate:12});
jindo.Calendar.getDateObject(2010, 5, 12); //연,월,일
 * @param {HashTable} htDate 날짜 객체
 * @return {Date} 
 */
jindo.Calendar.getDateObject = function(htDate) {
	if (arguments.length == 3) {
		return new Date(arguments[0], arguments[1] - 1, arguments[2]);
	}
	return new Date(htDate.nYear, htDate.nMonth - 1, htDate.nDate);
};

/**
 * 연월일을 포함한 HashTable 객체를 구한다.
 * @example
jindo.Calendar.getDateHashTable(2010, 5, 12); 
=> {nYear:2010, nMonth:5, nDate:12}
jindo.Calendar.getDateHashTable();
=> {nYear:2010, nMonth:5, nDate:12}
jindo.Calendar.getDateHashTable(new Date(2009,1,2));
=> {nYear:2009, nMonth:2, nDate:1}
 * @param {Date} Date 날짜 객체 
 * @return
 */
jindo.Calendar.getDateHashTable = function(oDate) {
	if (arguments.length == 3) {
		return {
			nYear : arguments[0],
			nMonth : arguments[1],
			nDate : arguments[2]
		};
	} 
	if (arguments.length <= 1) {
		oDate = oDate || new Date();
	}
	return {
		nYear : oDate.getFullYear(),
		nMonth : oDate.getMonth() + 1,
		nDate : oDate.getDate()
	};
};

/**
 * 연월일을 포함한 HashTable로부터 유닉스타임을 구한다.
 * @param {HashTable} htDate
 * @example
jindo.Calendar.getTime({nYear:2010, nMonth:5, nDate:12}); => 1273590000000
 * @return {Number}
 */
jindo.Calendar.getTime = function(htDate) {
	return this.getDateObject(htDate).getTime();
};

/**
 * 해당 연월의 첫번째 날짜의 요일을 구한다.
 * @param {Number} nYear
 * @param {Number} nMonth
 * @return {Number} 요일 (0~6)
 */
jindo.Calendar.getFirstDay = function(nYear, nMonth) {
	return new Date(nYear, nMonth - 1, 1).getDay();
};

/**
 * 해당 연월의 마지막 날짜의 요일을 구한다.
 * @param {Number} nYear
 * @param {Number} nMonth
 * @return {Number} 요일 (0~6)
 */
jindo.Calendar.getLastDay = function(nYear, nMonth) {
	return new Date(nYear, nMonth, 0).getDay();
};

/**
 * 해당 연월의 마지막 날짜를 구한다.
 * @param {Number} nYear
 * @param {Number} nMonth
 * @return {Number} 날짜 (1~31)
 */
jindo.Calendar.getLastDate = function(nYear, nMonth) {
	return new Date(nYear, nMonth, 0).getDate();
};

/**
 * 해당 연월의 주의 수를 구한다.
 * @param {Number} nYear
 * @param {Number} nMonth
 * @return {Number} 주 (4~6)
 */
jindo.Calendar.getWeeks = function(nYear, nMonth) {
	var nFirstDay = this.getFirstDay(nYear, nMonth),
		nLastDate = this.getLastDate(nYear, nMonth);
		
	return Math.ceil((nFirstDay + nLastDate) / 7);	
};

/**
 * 연월일을 포함한 HashTable로부터 상대적인 날짜의 HashTable을 구한다.
 * @param {Number} nYear 상대적인 연도 (+/-로 정의) 
 * @param {Number} nMonth 상대적인 월 (+/-로 정의)
 * @param {Number} nDate 상대적인 일 (+/-로 정의)
 * @param {HashTable} 연월일 HashTable  
 * @return {HashTable}
 * @example
jindo.Calendar.getRelativeDate(1, 0, 0, {nYear:2000, nMonth:1, nDate:1}); => {nYear:2001, nMonth:1, nDate:1}
jindo.Calendar.getRelativeDate(0, 0, -1, {nYear:2010, nMonth:1, nDate:1}); => {nYear:2009, nMonth:12, nDate:31}
 */
jindo.Calendar.getRelativeDate = function(nYear, nMonth, nDate, htDate) {
	return this.getDateHashTable(new Date(htDate.nYear + nYear, htDate.nMonth + nMonth - 1, htDate.nDate + nDate));		
};

/**
 * 연월일을 포함한 HashTable이 비교대상 HashTable보다 과거인지 확인한다.
 * @param {HashTable} htDate 비교를 원하는 날
 * @param {HashTable} htComparisonDate 비교할 기준
 * @return {Boolean}
 */
jindo.Calendar.isPast = function(htDate, htComparisonDate) {
	if (this.getTime(htDate) < this.getTime(htComparisonDate)) {
		return true;
	} 
	return false;
};

/**
 * 연월일을 포함한 HashTable이 비교대상 HashTable보다 미래인지 확인한다.
 * @param {HashTable} htDate 비교를 원하는 날
 * @param {HashTable} htComparisonDate 비교할 기준
 * @return {Boolean}
 */
jindo.Calendar.isFuture = function(htDate, htComparisonDate) {
	if (this.getTime(htDate) > this.getTime(htComparisonDate)) {
		return true;
	} 
	return false;
};

/**
 * 연월일을 포함한 HashTable이 비교대상 HashTable과 같은 날인지 확인한다.
 * @param {HashTable} htDate 비교를 원하는 날
 * @param {HashTable} htComparisonDate 비교할 기준
 * @return {Boolean}
 */
jindo.Calendar.isSameDate = function(htDate, htComparisonDate) {
	if (this.getTime(htDate) == this.getTime(htComparisonDate)) {
		return true;
	} 
	return false;
};

/**
 * 연월일을 포함한 HashTable이 특정 두 날 사이에 존재하는지 확인한다..
 * @param {HashTable} htDate 비교를 원하는 날
 * @param {HashTable} htFrom 시작 날짜
 * @param {HashTable} htTo 끝 날짜
 * @return {Boolean}
 * @example
jindo.Calendar.isBetween({nYear:2010, nMonth:5, nDate:12}, {nYear:2010, nMonth:1, nDate:1}, {nYear:2010, nMonth:12, nDate:31}); => true 
 */
jindo.Calendar.isBetween = function(htDate, htFrom, htTo) {
	if (this.isFuture(htDate, htTo) || this.isPast(htDate, htFrom)) {
		return false;
	} else {
		return true;
	}
};
/**
 * @fileOverview 영역내의 값을 마우스 클릭 또는 드래그로 선택하는 슬라이더 컴포넌트
 * @author hooriza, modified by senxation
 * @version 0.4.1
 */

jindo.Slider = jindo.$Class({
	/** @lends jindo.Slider.prototype */				
	_elTrack : null,

	_oDragArea : null,
					
	_aThumbs : null,
	
	_aPoses : null,
	_htSwap : null,
	
	/**
	 * Slider 컴포넌트를 생성한다.
	 * @constructs
	 * @class 영역내의 값을 마우스 클릭 또는 드래그로 선택하는 슬라이더 컴포넌트
	 * @param {String | HTMLElement} el Thumb이 움직이는 바탕이 되는 Track Element (id 혹은 엘리먼트 자체)
	 * @param {Object} oOptions 옵션 객체
	 * @extends jindo.UIComponent
	 * @requires jindo.DragArea
	 * @example
var alpha = new jindo.Slider($('alpha'), {
	 bVertical : false, //슬라이더 세로 여부
	 bJump : true, 
	 sClassPrefix : 'slider-',
	 nMinValue : 0, 
	 nMaxValue : 1,
	 fAdjustValue : ,(Function) 값을 조절하기 위한 함수
	 bActivateOnload : true //(Boolean) 컴포넌트 로드시 activate 여부
}).attach({
	beforeChange : function(oCustomEvent) {
		//Thumb이 움직이기 전에 발생
		//oCustomEvent.stop()을 실행하면 change 이벤트가 발생하지 않고 중단된다.
	},
	change : function(oCustomEvent) {
		//Thumb을 Drop한 이후 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	nIndex : (Number)
		//	nPos : (Number)
		//	nValue : (Number)
		//}
	}
});
	 */
	
	$init : function(el, oOptions) {
		
		this.option({
			bVertical : false,
			bJump : true,
			sClassPrefix : 'slider-',
			fAdjustValue : null,
			nMinValue : 0,
			nMaxValue : 1,
			bActivateOnload : true
		});
		
		this.option(oOptions || {});
		
		if (!this.option('bVertical')) {
			this._htSwap = {
				y : 'nY',
				x : 'nX',
				clientX : 'clientX',
				pageX : 'pageX',
				offsetWidth : 'offsetWidth',
				left : 'left'
			};
		} else {
			this._htSwap = {
				y : 'nX',
				x : 'nY',
				clientX : 'clientY',
				pageX : 'pageY',
				offsetWidth : 'offsetHeight',
				left : 'top'
			};
		}
		
		this._sRand = 'S' + parseInt(Math.random() * 100000000);

		this._elTrack = jindo.$(el);
		// Thumbs 들과 각각의 값을 저장할 공간 만들기
		this._aThumbs = jindo.$$('.' + this.option('sClassPrefix') + 'thumb', this._elTrack);
		var thumbs = jindo.$ElementList(this._aThumbs);
		thumbs.addClass(this._sRand);

		this._aPoses = [];
		
		this._onTrackMouseDownFn = jindo.$Fn(this._onTrackMouseDown, this);
		
		this._initDragArea();
		
		if (this.option("bActivateOnload")){
			this.activate();		
			this._detectChange();
		}
	},
	
	/**
	 * Track 엘리먼트를 구한다.
	 * @return {HTMLElement} 
	 */
	getTrack : function() {
		return this._elTrack;
	},
	
	/**
	 * n번째 Thumb 엘리먼트를 구한다.
	 * @param {Number} nIndex
	 * @return {HTMLElement} 
	 */
	getThumb : function(nIndex) {
		return this._aThumbs[nIndex];
	},
	
	_initDragArea : function() {
		var self = this;
		var htSwap = this._htSwap;
		
		// 컴퍼넌트 내부에서 사용하는 다른 컴퍼넌트 초기화
		this._oDragArea = new jindo.DragArea(this._elTrack, { 
			sClassName : this._sRand, 
			bFlowOut : false 
		}).attach({
																								   
			'beforeDrag' : function(oCustomEvent) {
				var nIndex = self._getThumbIndex(oCustomEvent.elHandle)
				
				//var nAfterPos = 
				var htParam = { 
					nIndex : nIndex,
					nPos : oCustomEvent[htSwap.x],
					bJump : false
				};
				if (!self.fireEvent('beforeChange', htParam)) {
					oCustomEvent.stop();
					return false;
				};
				var nAfterPos = self._getAdjustedPos(nIndex, htParam.nPos);
				if (nAfterPos === false) return e.stop();
				
				oCustomEvent[htSwap.x] = nAfterPos;
				
				oCustomEvent[htSwap.y] = null;
			},
			
			'drag' : function(oCustomEvent) {
											  
				var nIndex = self._getThumbIndex(oCustomEvent.elHandle);
				self._fireChangeEvent(nIndex);
				
			}
		});
	},
	
	/**
	 * 적용된 DragArea 객체를 가져온다.
	 * @return {jindo.DragArea}
	 */
	getDragArea : function() {
		return this._oDragArea; 
	},
	
	_fireChangeEvent : function(nIndex) {
		var sAdjustBy = this.option('adjustBy');
		
		if (!this._detectChange()) return;
		
		var nPos = this._aPoses[nIndex];
		
		var htParam = {
			nIndex : nIndex,
			nPos : nPos,
			nValue : this._getValue(nIndex, nPos)
		};

		this.fireEvent('change', htParam);
	},

	/**
	 * 컴포넌트를 활성화시킨다.
	 */
	_onActivate : function() {
		this.getDragArea().activate();
		this._onTrackMouseDownFn.attach(this._elTrack, 'mousedown');
	},
	
	/**
	 * 컴포넌트를 비활성화시킨다.
	 */
	_onDeactivate : function() {
		this.getDragArea().deactivate();
		this._onTrackMouseDownFn.detach(this._elTrack, 'mousedown');
	},
	
	_onTrackMouseDown : function(e) {
		var self = this;
		if (!this.option('bJump')) return;
		
		// Thumb 이 하나일때만 동작
		//if (this._aThumbs.length != 1) return;
		
		var nIndex = 0;
		var htSwap = this._htSwap;

		var el = e.element;
		var sClass = '.' + this.option('sClassPrefix') + 'thumb';
		var bThumb = jindo.$$.test(el, sClass) || jindo.$$.getSingle('! ' + sClass, el);

		if (bThumb) return;

		var nPos = e.pos()[htSwap.pageX]; // 클릭한 위치
		nPos -= jindo.$Element(this._elTrack).offset()[htSwap.left];
		
		var nMaxDistance = 9999999;;
		
		// 가장 가까운 Thumb 찾기
		for (var i = 0, oThumb; oThumb = this._aThumbs[i]; i++) {
			
			var nThumbPos = parseInt(jindo.$Element(oThumb).css(htSwap.left)) || 0;
			nThumbPos += parseInt(oThumb[htSwap.offsetWidth] / 2);
			
			var nDistance  = Math.abs(nPos - nThumbPos);
			
			if (nDistance < nMaxDistance) {
				nMaxDistance = nDistance;
				nIndex = i;
			}
		}

		var oThumb = this._aThumbs[nIndex];
		nPos -= parseInt(oThumb[htSwap.offsetWidth] / 2);
		
		e.stop(jindo.$Event.CANCEL_DEFAULT);
		this.positions(nIndex, nPos);
	},
	
	_getTrackInfo : function(nIndex) {
		var htSwap = this._htSwap;
		var oThumb = this._aThumbs[nIndex];
		
		var nThumbSize = oThumb[htSwap.offsetWidth];
		var nTrackSize = this._elTrack[htSwap.offsetWidth];
		
		var nMaxPos = nTrackSize - nThumbSize;

		var nMax = this.option('nMaxValue');
		var nMin = this.option('nMinValue');
		
		return {
			maxPos : nMaxPos,
			max : nMax,
			min : nMin
		};
	},
	
	/**
	 * 옵션의 fAdjustValue가 적용된 value를 구한다.
	 * @param {Object} nIndex
	 * @param {Object} nPos
	 * @ignore
	 */
	_getValue : function(nIndex, nPos) {
		if (typeof nPos == 'undefined') {
			nPos = this._aPoses[nIndex];
		}

		var oInfo = this._getTrackInfo(nIndex);
		var nValue = Math.min(Math.max(nPos * (oInfo.max - oInfo.min) / oInfo.maxPos + oInfo.min, oInfo.min), oInfo.max);

		var fAdjust;
		if (fAdjust = this.option('fAdjustValue'))
			nValue = fAdjust.call(this, nValue);
		
		return nValue;
	},
	
	/**
	 * 옵션의 fAdjustValue가 적용된 포지션을 구한다.
	 * @param {Object} nIndex
	 * @param {Object} nPos
	 * @ignore
	 */
	_getAdjustedPos : function(nIndex, nPos) {
		var nAdjustedPos = nPos;
		var oInfo = this._getTrackInfo(nIndex);

		var fAdjust;
		if (fAdjust = this.option('fAdjustValue')) {
			
			var nValue = Math.min(Math.max(nAdjustedPos * (oInfo.max - oInfo.min) / oInfo.maxPos + oInfo.min, oInfo.min), oInfo.max);
			var nAfterValue = fAdjust.call(this, nValue);
			
			if (nValue != nAfterValue) {
				nAdjustedPos = oInfo.maxPos * (nAfterValue - oInfo.min) / (oInfo.max - oInfo.min);
			}
			
		}
		
		nAdjustedPos = Math.max(nAdjustedPos, 0);
		nAdjustedPos = Math.min(nAdjustedPos, oInfo.maxPos);
		
		return nAdjustedPos;		
	},
	
	_detectChange : function() {
		var aPoses = this.positions();
		var bDiff = false;
		
		for (var i = 0, len = aPoses.length; i < len; i++)
			if (aPoses[i] !== this._aPoses[i]) bDiff = true;
		
		this._aPoses = aPoses;
		return bDiff;
	},
	
	_getThumbIndex : function(oThumb) {
		for (var i = 0, len = this._aThumbs.length; i < len; i++)
			if (this._aThumbs[i] == oThumb) return i;
			
		return -1;
	},
	/**
	 * pixel단위로 Thumb의 위치값을 가져오거나 설정한다.
	 * @param {Number} nIndex 위치값을 가져올 Thumb의 index (생략시 모든 Thumb의 위치값 배열을 리턴)
	 * @param {Number} nPos 설정할 위치값(pixel단위)
	 * @param {Boolean} bFireEvent 커스텀이벤트를 발생할지의 여부
	 * @return {Number | Array | this} 설정시에는 객체 자체를 리턴
	 * @example 
	 * oSlider.positions(0);
	 * oSlider.positions();
	 * oSlider.positions(0, 100);
	 */
	positions : function(nIndex, nPos, bFireEvent) {
		if (typeof bFireEvent == "undefined") {
			bFireEvent = true;	
		}
		var htSwap = this._htSwap;

		switch (arguments.length) {
		case 0:
			var aPoses = [];
	
			for (var i = 0, len = this._aThumbs.length; i < len; i++)
				aPoses[i] = this.positions(i);
			
			return aPoses;
			
		case 1:
			return parseInt(jindo.$Element(this._aThumbs[nIndex]).css(htSwap.left));
			
		default:
			if (bFireEvent) {
				
				var htParam = { 
					nIndex : nIndex,
					nPos : nPos,
					bJump : true
				};
				if (!this.fireEvent('beforeChange', htParam)) {
					return false;
				};
				var nAfterPos = this._getAdjustedPos(nIndex, htParam.nPos);
				if (nAfterPos === false) return this;
				
			    jindo.$Element(this._aThumbs[nIndex]).css(htSwap.left, nAfterPos + 'px');
			    this._fireChangeEvent(nIndex);
			    return this;	
			}
		
			var nAfterPos = this._getAdjustedPos(nIndex, nPos);
		    jindo.$Element(this._aThumbs[nIndex]).css(htSwap.left, nAfterPos + 'px');
		    return this;
		} 
	},
	/**
	 * 옵션으로 설정한 nMinValue, nMaxValue에 대한 상대값으로 해당 Thumb의 위치값을 가져오거나 설정한다.
	 * @param {Number} nIndex Value를 가져올 Thumb의 index (생략시 모든 Thumb의 위치값 배열을 리턴)
	 * @param {Number} nValue 설정할 위치값
	 * @param {Boolean} bFireEvent 커스텀이벤트를 발생할지의 여부
	 * @return {Number | Array | this} 설정시에는 객체 자체를 리턴
	 * @example 
	 * oSlider.values(0);
	 * oSlider.values();
	 * oSlider.values(0, 0.5);
	 */
	values : function(nIndex, nValue, bFireEvent) {
		if (typeof bFireEvent == "undefined") {
			bFireEvent = true;	
		}
		
		switch (arguments.length) {
		case 0:
			var aValues = [];
			
			for (var i = 0, len = this._aThumbs.length; i < len; i++)
				aValues[i] = this._getValue(i);
				
			return aValues;
			
		case 1:
			return this._getValue(nIndex, this.positions(nIndex)); //수정

		default:
			var oInfo = this._getTrackInfo(nIndex);
			this.positions(nIndex, (nValue - oInfo.min) * oInfo.maxPos / (oInfo.max - oInfo.min), bFireEvent);
			return this;
		}
	}
}).extend(jindo.UIComponent);
/**
 * @fileOverview Text Input에 입력중인 값을 세자리마다 콤마(,)가 찍힌 숫자형식으로 변환하는 컴포넌트
 * @author hooriza, modified by senxation
 * @version 0.4.3
 */
jindo.NumberFormatter = jindo.$Class({
	/** @lends jindo.NumberFormatter.prototype */
	/**
	 * NumberFormatter 컴포넌트를 생성한다.
	 * NumberFormatter 컴포넌트는 Text Input에 입력중인 값을 세자리마다 콤마(,)가 찍힌 숫자형식으로 변환한다.
	 * @constructs
	 * @class Text Input에 입력중인 값을 세자리마다 콤마(,)가 찍힌 숫자형식으로 변환하는 컴포넌트
	 * @extends jindo.Formatter
	 * @param {HTMLElement} el
	 * @param {Object} htOption 옵션 객체
	 * @requires jindo.TextRange
	 * @requires jindo.Timer
	 * @example 
var oNumberFormatter = new jindo.NumberFormatter(jindo.$('foo'), { 
	nDecimalPoint : 2, //(Number) 소수점 몇째자리까지 표시할 것인지
}).attach({
	beforeChange : function(oCustomEvent) { 
		//전달되는 이벤트 객체 e = {
		//	elInput : (HTMLElement) Text Input 엘리먼트
		//	sText : (String) Text Input 의 값
		//	sStartMark : (String)
		//	sEndMark : (String)
		//} 
	},
	change : function(oCustomEvent) {
		//전달되는 이벤트 객체 e = {
		//	elInput : (HTMLElement) Text Input 엘리먼트
		//}
	}
});
	 */	
	$init : function(el, htOption) {
		this.option({
			nDecimalPoint : 0 //(Number) 소수점 몇째자리까지 표시할 것인지
		});
		this.option(htOption || {});
	
		this.attach('beforeChange', function(oCustomEvent) {
			var sText = oCustomEvent.sText;
			var sOutput = '';
			var nDecimalPoint = this.option("nDecimalPoint");
			
			if (nDecimalPoint === 0) {
				// 숫자랑 마크빼고 전부 삭제
				sText = sText.replace(new RegExp('[^0-9' + oCustomEvent.sStartMark + oCustomEvent.sEndMark + ']', 'g'), '');
				// 맨 앞에 있는 숫자 0 없애기			
				sText = sText.replace(/^0+/, '');
				sText = sText.replace(new RegExp('^0*' + oCustomEvent.sStartMark + '0*' + oCustomEvent.sEndMark + '0*'), oCustomEvent.startMark + oCustomEvent.endMark);	
			} else {
				// 숫자랑 . 마크빼고 전부 삭제
				sText = sText.replace(new RegExp('[^0-9' + oCustomEvent.sStartMark + oCustomEvent.sEndMark + '\.]', 'g'), '');
				sText = sText.replace(/\.{2,}/g, ".");
				// 맨 앞에 있는 . 없애기			
				sText = sText.replace(/^\.+/, '');
				// 소수점 2개가 없도록
				sText = sText.replace(/(\.[^.]*?)(\.)/g, function(){
					return arguments[1];
				});
				// 맨 앞에 있는 숫자 0 없애기			
				sText = sText.replace(/^0+/, '');
				sText = sText.replace(new RegExp('^0*' + oCustomEvent.sStartMark + '0*' + oCustomEvent.sEndMark + '0*'), oCustomEvent.startMark + oCustomEvent.endMark);
				sText = sText.replace(new RegExp("^0([^\."+ oCustomEvent.sStartMark + oCustomEvent.sEndMark +"]+?)", "g"), function(){
					return arguments[1];
				});
			}

			sOutput = this._convertCurrency(sText);
			if (nDecimalPoint > 0) {
				sOutput = this._limitDecimalPoint(sOutput, nDecimalPoint);
			}
			
			oCustomEvent.sText = sOutput;
		});
	},
	
	/**
	 * Text Input의 설정된 값을 가져온다.
	 * @return {String}
	 * @example
"12,345,678.12"
oNumberFormatter.getValue(); -> "12345678.12"
	 */
	getValue : function() {
		return this._el.value.replace(new RegExp("[,"+ this._aMarks[0] + this._aMarks[1] + "]+?", "g"), "");
	},

	_convertCurrency : function(sText) {
		var nDot = 0,
			sReturn = "",
			nDotPosition = sText.indexOf("."),
			nLastPosition = sText.length;
			
		if (nDotPosition > -1) {
			nLastPosition = nDotPosition - 1;
		}
		
		//세자리마다 ,찍어 통화형식으로 만들기
		for (var i = sText.length; i >= 0; i--) {
			var sChar = sText.charAt(i);
			if (i > nLastPosition) {
				sReturn = sChar + sReturn;
				continue;
			}
			if (/[0-9]/.test(sChar)) {
				if (nDot >= 3) {
					sReturn = ',' + sReturn;
					nDot = 0;
				}
				nDot++;
				sReturn = sChar + sReturn;
			} else if (sChar == this._aMarks[0] || sChar == this._aMarks[1]) {
				sReturn = sChar + sReturn;
			}
		}
		
		return sReturn;
	},
	
	_limitDecimalPoint : function(sText, nDecimalPoint) {
		var sReturn = "",
			nDotPosition = sText.indexOf("."),
			nLastPosition = sText.length;
			
		if (nDotPosition > -1) {
			nLastPosition = nDotPosition - 1;
		}
		
		//소수점 이하 자리수 제한
		nDotPosition = sText.indexOf(".");
		if (nDotPosition > -1 && nDecimalPoint > 0) {
			var nDecimalCount = 0;
			for (var i = 0; i < sText.length; i++) {
				var sChar = sText.charAt(i),
					bIsNumber = /[0-9]/.test(sChar);
				
				if (bIsNumber) {
					if (nDecimalCount == nDecimalPoint) {
						continue;
					}
					if (i > nDotPosition) {
						nDecimalCount++;
					}
				}
				sReturn += sChar;
			}	
		} else {
			sReturn = sText;
		}
		
		return sReturn;
	}
}).extend(jindo.Formatter);
/**
 * @fileOverview FileSelect (input[type=file])의 찾아보기(browse) 버튼의 디자인을 대체 적용하는 컴포넌트
 * @author hooriza, modified by senxation
 * @version 0.4
 */
jindo.BrowseButton = jindo.$Class({
	 /** @lends jindo.BrowseButton */						
	_elBox : null, //마우스 포지션에 따라다니게될 input[type=file]을 포함한 레이어

	_oOrgPos : null,

	/**
	 * BrowseButton 컴포넌트를 생성한다.
	 * BrowseButton은 FileSelect (input[type=file])의 찾아보기(browse) 버튼을 대체 적용한다.
	 * 적용된 FileSelect는 구현상 임시의 플로트 레이어로 이동된다.  
	 * @constructs
	 * @class FileSelect (input[type=file])의 찾아보기(browse) 버튼의 디자인을 대체 적용하는 컴포넌트
	 * @extends jindo.Component
	 * @param {HTMLElement} el 기준 엘리먼트
	 * @param {HashTable} htOption 옵션 객체
	 * @example
new jindo.BrowseButton($('file'), jindo.$('button'), { 
	sClassPrefix : 'button-' 
	//컴포넌트가 적용되면 대체 버튼 엘리먼트에 클래스명 sClassPrefix+"applied" 가 추가됨
	//대체 버튼 엘리먼트에 마우스 오버시 sClassPrefix+"over" 가 추가됨
}).attach({
	'over' : function() {
		//찾아보기 버튼에 커서가 over 되었을 때 발생 
	},
	'out' : function() {
		//찾아보기 버튼에서 커서가 out 되었을 때 발생
	},
	'sourceChange' : function() {
		//선택된 파일의 값이 바뀌었을때 발생
		jindo.$("input").value = this.getFileSelect().value;
	}
});
	 */
	$init : function(el, htOption) {
		
		this.option({
			sClassPrefix : 'browse-'
		});
		
		this.option(htOption || {});
		
		this._el = jindo.$(el);

		this._assignHTMLElement();		
		this._attachEvents();
		
	},
	
	_assignHTMLElement : function() {
		var sClassPrefix = this.option('sClassPrefix');
		
		this._elBox = jindo.$$.getSingle("." + sClassPrefix + "box", this._el);
		this._elFileSelect = jindo.$$.getSingle("." + sClassPrefix + "file-input", this._el);
		this._elBrowseButton = jindo.$$.getSingle("." + sClassPrefix + "button", this._el);
		
		var elBox = this.getBox();
		var elFileSelect = this.getFileSelect();
		var elBrowseButton = this.getBrowseButton();
		
		this._oOrgPos = {
			form : jindo.$$.getSingle('! form', elFileSelect),
			parent : elFileSelect.parentNode,
			sibling : elFileSelect.nextSibling,
			cssText : elFileSelect.style.cssText
		};

		elFileSelect.style.cssText =
			'top:-.5em !important;' +
			'height:500px !important;';

		
		jindo.$Element(elBrowseButton).addClass(sClassPrefix + 'applied');
	},
	
	_adjustFileSelectPos : function(nX) {
		
		var elBox = this.getBox();
		var nPitch = (jindo.$Element(elBox).offset().left + document.documentElement.scrollLeft) - nX;
		this.getFileSelect().style.right = nPitch + 30 + 'px';
		
	},
	
	_attachEvents : function() {
		
		var self = this;
		var elBrowseButton = this.getBrowseButton();
		var welBrowseButton = jindo.$Element(elBrowseButton);
		var elBox = this.getBox();
		var elFileSelect = this.getFileSelect();
		
		
		var wfHoverOnBrowseButton = jindo.$Fn(function(we) {
			welBrowseButton.addClass(this.option('sClassPrefix') + 'over');
			this.fireEvent('over');			
			this._adjustFileSelectPos(we.pos().pageX);
		}, this);
		
		var wfRestore = jindo.$Fn(function(we) {
			welBrowseButton.removeClass(this.option('sClassPrefix') + 'over');
			elFileSelect.style.right = "0px";
			this.fireEvent('out');
		}, this);
		
		var wfMouseMoveOnFloat = jindo.$Fn(function(we) {
			this._adjustFileSelectPos(we.pos().pageX);
		}, this);
		
		jindo.$Fn(function(we) {
			this.fireEvent('sourceChange');
		}, this).attach(this.getFileSelect(), 'change');

		wfHoverOnBrowseButton.attach(elBox, 'mouseover');
		wfMouseMoveOnFloat.attach(elBox, 'mousemove');
		wfRestore.attach(elBox, 'mouseout');
	},
	
	/**
	 * File Input을 감싸고 있는 Box 엘리먼트를 가져온다.
	 * @return {HTMLElement}
	 */
	getBox : function() {
		return this._elBox;
	},
	
	/**
	 * 적용된 File Input (input[type=file])을 가져온다.
	 * @return {HTMLElement}
	 */
	getFileSelect : function() {
		return this._elFileSelect;
	},
	
	/**
	 * 대체될 찾아보기 버튼을 가져온다.
	 * @return {HTMLElement} 
	 */
	getBrowseButton : function() {
		return this._elBrowseButton;
	}
}).extend(jindo.Component);

/**
 * @fileOverview iframe에 Form을 Submit하여 리프레시없이 파일을 업로드하는 컴포넌트
 * @author senxation
 * @version 0.2.3
 */

jindo.FileUploader = jindo.$Class({
	/** @lends jindo.FileUploader.prototype */
		
	_bIsActivating : false, //컴포넌트의 활성화 여부
	_aHiddenInput : [],

	/**
	 * 컴포넌트를 생성한다.
	 * @constructs
	 * @class iframe에 Form을 Submit하여 리프레시없이 파일을 업로드하는 컴포넌트
	 * @param {HTMLElement} elFileSelect File Select. 베이스(기준) 엘리먼트
	 * @param {Object} oOption 옵션 객체
	 * @extends jindo.UIComponent
	 * @example 
var oFileUploader = new jindo.FileUploader(jindo.$("file_select"),{
    sUrl  : 'http://ajaxui.jindodesign.com/docs/components/samples/response/FileUpload.php', //업로드할 서버의 url (Form 전송의 대상)
    sCallback : 'http://ajaxui.jindodesign.com/svnview/Jindo_Component/FileUploader/trunk/Spec/callback.html', //업로드 이후에 iframe이 redirect될 콜백페이지의 주소
    htData : {}, //post할 데이터 셋 예 { blogId : "testid" }
    sFiletype : "*.*", //허용할 파일의 형식. ex) "*.jpg"
    sMsgNotAllowedExt : '업로드가 허용되지 않는 파일형식입니다', //허용할 파일의 형식이 아닌경우에 띄워주는 경고창의 문구
	bAutoUpload : false //파일이 선택됨과 동시에 자동으로 업로드를 수행할지 여부 (upload 메소드 수행)
}).attach({
	select : function(oCustomEvent) {
		//파일 선택이 완료되었을 때 발생
		//이벤트 객체 oCustomEvent = {
		//	sValue (String) 선택된 File Input의 값
		//	bAllowed (Boolean) 선택된 파일의 형식이 허용되는 형식인지 여부
		//	sMsgNotAllowedExt (String) 허용되지 않는 파일 형식인 경우 띄워줄 경고메세지
		//}
		//bAllowed 값이 false인 경우 경고문구와 함께 alert 수행 
		//oCustomEvent.stop(); 수행시 bAllowed 가 false이더라도 alert이 수행되지 않음
	},
	success : function(oCustomEvent) {
		//업로드가 성공적으로 완료되었을 때 발생
		//이벤트 객체 oCustomEvent = {
		//	htResult (Object) 서버에서 전달해주는 결과 객체 (서버 설정에 따라 유동적으로 선택가능)
		//}
	},
	error : function(oCustomEvent) {
		//업로드가 실패했을 때 발생
		//이벤트 객체 oCustomEvent = {
		//	htResult : { (Object) 서버에서 전달해주는 결과 객체. 에러발생시 errstr 프로퍼티를 반드시 포함하도록 서버 응답을 설정하여야한다.
		//		errstr : (String) 에러메시지
		// 	}
		//}
	}
});
	 */
	$init : function(elFileSelect, htOption) {
		
		//옵션 초기화
		var htDefaultOption = {
			sUrl: '', // upload url
			sCallback: '', // callback url
			htData : {},
            sFiletype: '*.*',
            sMsgNotAllowedExt: '업로드가 허용되지 않는 파일형식입니다',
            bAutoUpload: false,
			bActivateOnload : true //로드시 컴포넌트 활성화여부
		};
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		//Base 엘리먼트 설정
		this._el = jindo.$(elFileSelect);
		this._wel = jindo.$Element(this._el);
		this._assignHTMLElements();
		
		this.constructor._oCallback = {};
		this._wfChange = jindo.$Fn(this._onFileSelectChange, this);
		
		//활성화
		if(this.option("bActivateOnload")) {
			this.activate(); //컴포넌트를 활성화한다.	
		}
	},
	
	_assignHTMLElements : function() {
		
		this._elForm = this._el.form;
		
		//Iframe 설정
        var sIframeName = 'tmpFrame_' + this._makeUniqueId();
        this._elIframe = jindo.$('<iframe name="' + sIframeName + '" src="' + this.option("sCallback") + '?blank">');
        var welIframe = jindo.$Element(this._elIframe);
		welIframe.css({
			position : 'absolute',
        	width : '1px',
        	height : '1px',
        	left : '-100px',
        	top : '-100px'
		});
        document.body.appendChild(this._elIframe);
	},
	
	/**
	 * 컴포넌트의 베이스 엘리먼트를 가져온다.
	 * @deprecated getFileSelect
	 * @return {HTMLElement}
	 */
	getBaseElement : function() {
		return this.getFileSelect();
	},
	
	/**
	 * File Select 엘리먼트를 가져온다.
	 * @return {HTMLElement}
	 */
	getFileSelect : function() {
		return this._el;
	},
	
	/**
	 * File Select의 해당 Form 엘리먼트를 가져온다.
	 * @return {HTMLElement} 
	 */
	getFormElement : function() {
		return this._elForm;
	},
	
	/**
	 * IFrame으로 업로드를 수행한다.
	 */
	upload : function(){
		var elForm = this.getFormElement();
		var welForm = jindo.$Element(elForm);
		
		var sIframeName = this._elIframe.name;
		var sFunctionName = sIframeName + '_func';
		
		//Form 설정		
		var sAction = this.option("sUrl");
		welForm.attr({
			target : sIframeName,
			action : sAction
		});
		
		this._aHiddenInput.push(this._createElement('input', {
            'type': 'hidden',
            'name': 'callback',
            'value': this.option("sCallback")
        }));
        this._aHiddenInput.push(this._createElement('input', {
            'type': 'hidden',
            'name': 'callback_func',
            'value': sFunctionName
        }));
        for (var k in this.option("htData")) {
            this._aHiddenInput.push(this._createElement('input', {
                'type': 'hidden',
                'name': k,
                'value': this.option("htData")[k]
            }));
        }
		
		for (var i = 0; i < this._aHiddenInput.length; i++) {
			elForm.appendChild(this._aHiddenInput[i]);	
		}
        
		//callback 함수 정의
        this.constructor._oCallback[sFunctionName + '_success'] = jindo.$Fn(function(oParameter){
            this.fireEvent("success", { htResult : oParameter });
			delete this.constructor._oCallback[oParameter.callback_func + '_success'];
			delete this.constructor._oCallback[oParameter.callback_func + '_error'];
			for (var i = 0; i < this._aHiddenInput.length; i++) {
				jindo.$Element(this._aHiddenInput[i]).leave();	
			}
			this._aHiddenInput.length = 0;
        }, this).bind();
        
        // temporary function - on error
        this.constructor._oCallback[sFunctionName + '_error'] = jindo.$Fn(function(oParameter){
			this.fireEvent("error", { htResult : oParameter });
			delete this.constructor._oCallback[oParameter.callback_func + '_success'];
			delete this.constructor._oCallback[oParameter.callback_func + '_error'];
			for (var i = 0; i < this._aHiddenInput.length; i++) {
				jindo.$Element(this._aHiddenInput[i]).leave();	
			}
			this._aHiddenInput.length = 0;
        }, this).bind();
		
        // form submit and reset
        elForm.submit();
    },
	
	/**
	 * 컴포넌트를 활성화한다.
	 * @return {this}
	 */
	_onActivate : function() {
		this._wfChange.attach(this.getFileSelect(), "change");
	},
	
	/**
	 * 컴포넌트를 비활성화한다.
	 * @return {this}
	 */
	_onDeactivate : function() {
		this._wfChange.detach(this.getFileSelect(), "change");
	},
	
	/**
	 * 유일한 id를 랜덤하게 생성한다.
	 * @ignore
	 */
    _makeUniqueId: function(){
        return new Date().getMilliseconds() + Math.floor(Math.random() * 100000);
    },
	
	/**
	 * element를 생성한다.
	 * @param {Object} name
	 * @param {Object} attributes
	 * @ignore
	 */
    _createElement: function(name, attributes){
        var el = jindo.$("<" + name + ">");
		var wel = jindo.$Element(el);
        for (var k in attributes) {
            wel.attr(k, attributes[k]);
        }
        return el;
    },
	
	/**
	 * 파일의 확장자를 검사한다.
	 * @param {String} sFile
	 * @ignore
	 */
    _checkExtension: function(sFile){
        var aType = this.option("sFiletype").split(';');
        for (var i = 0; i < aType.length; i++) {
            aType[i] = aType[i].replace(/^\s+|\s+$/, '');
            aType[i] = aType[i].replace(/\./g, '\\.');
            aType[i] = aType[i].replace(/\*/g, '[^\\\/]+');
            if ((new RegExp(aType[i] + '$', 'gi')).test(sFile)) {
                return true;
			} 
        }
        return false;
    },
	
	/**
	 * 선택된 파일이 바뀌었을경우 처리
	 * @param {jindo.$Event} we
	 * @ignore
	 */
	_onFileSelectChange : function(we) {
		var sValue = we.element.value,
			bAllowed = this._checkExtension(sValue),
			htParam = {
				sValue : sValue,
				bAllowed : bAllowed,
				sMsgNotAllowedExt : this.option("sMsgNotAllowedExt") 
			};
		
		if (this.fireEvent("select", htParam)) {
			if (!bAllowed) {
	            alert(htParam.sMsgNotAllowedExt);
	            return false;
        	}
		}
		
        if (this.option("bAutoUpload")) {
			this.upload();
		}
	}
	
}).extend(jindo.UIComponent);
/**
 * @fileOverview 클립보드를 컨트롤하는 컴포넌트
 * @author hooriza, modified by senxation
 * @version 0.5.3
 */

jindo.Clipboard = jindo.$Class({
	/** @lends jindo.Clipboard.prototype */
	_aElement : null,
	_aData : null,
	_elOvered : null,
	_bFailed : true,
	
	/**
	 * Clipboard 컴포넌트를 생성한다. 플래시로드를 위해 flashObject.js 파일을 사용한다.
	 * @constructs
	 * @class 플래시 객체를 사용하여 시스템 클립보드에 값을 설정하는 컴포넌트
	 * @extends jindo.Component
	 * @see <a href="http://devcafe.nhncorp.com/?vid=flashdev&mid=board_6&document_srl=60932" target="_blank">flashObject</a> 
	 * @see <a href="http://flashdev.naver.com/js_standard/reference.html" target="_blank">flashObject API</a>
	 * @param {String} sFlashURL 클립보드를 제어할 플래시파일 주소
	 * @example

<span id="foo">클립보드에 "http://naver.com/" 복사하기</span>
<script>
	oClipboard = new jindo.Clipboard('../Sources/clipboard.swf').attach({
		load : function(oCustomEvent) {
			//클립보드 제어를 위한 Flash 파일이 로드 완료된 이후에 발생
			this.setData(jindo.$('foo'), 'http://naver.com/');
			this.setData(jindo.$('bar'), 'http://daum.net/');
		},
		copy: function(oCustomEvent){
			//마우스 클릭시 성공적으로 클립보드가 설정된 경우 발생
			alert(e.element + ' 를 눌러서 ' + e.data + ' 가 클립보드에 저장되었습니다');
		},
		failure: function(oCustomEvent){
			//마우스 클릭시 클립보드 설정에 실패한 경우 발생
			alert('실패 : ' + e.element + ' 를 눌렀지만 ' + e.data + ' 를 클립보드에 저장하지 못했습니다');
		},
		over : function(oCustomEvent) {
		},
		out : function(oCustomEvent) {
		},
		down : function(oCustomEvent) {
		},
		up : function(oCustomEvent) {
		}
	});
</script>
	 */
	$init : function(sFlashURL) {
		this._sFlashURL = sFlashURL;
		var oStatic = jindo.Clipboard; //구버전 진도 (0.3.5 이하) jindo.$Class에는 constructor프로퍼티가 존재하지 않음
		var sFlashUID = this._sUnique = 'S' + new Date().getTime() + parseInt(Math.random() * 1000000000);
		
		if (typeof oStatic._callbacks == "undefined") {
			oStatic._callbacks = {};
		}
		oStatic._callbacks[this._sUnique] = {
			click : jindo.$Fn(this._onFlashClick, this).bind(),
			mouseover : jindo.$Fn(this._onFlashMouseOver, this).bind(),
			mouseout : jindo.$Fn(this._onFlashMouseOut, this).bind(),
			mousedown : jindo.$Fn(this._onFlashMouseDown, this).bind(),
			mouseup : jindo.$Fn(this._onFlashMouseUp, this).bind(),
			load : jindo.$Fn(this._onFlashLoad, this).bind()
		};
		
		this._aElement = [];
		this._aData = [];
		
		this._initFlash();
		
		this._wfHandler = jindo.$Fn(function(we) {
			this._initFlash();
			var el = we.element;
			var htPosition = jindo.$Element(el).offset();
			this._setFlashPosSize(htPosition.left, htPosition.top, el.offsetWidth, el.offsetHeight);
			this._setClipboard(el, this._getData(el));
			this._elOvered = el;
		}, this);
		
	},
	
	_initFlash : function() {
		if (this._elDummy) {
			return;
		}
		var elDummy = this._elDummy = jindo.$('<div>');
		var sFlashUID = this._sUnique;
		
		elDummy.style.cssText = 'position:absolute !important; border:0 !important; padding:0 !important; margin:0 !important; overflow:visible !important; z-index:32000 !important;';
		document.body.insertBefore(elDummy, document.body.firstChild);
		
		var sFlashHtml = nhn.FlashObject.generateTag(this._sFlashURL + '?' + new Date().getTime(), 'CLIPBOARD' + sFlashUID, 1, 1, {flashVars : { sUniq : sFlashUID }, wmode : 'transparent'}); //Flashvars로 sUniq 전달
		sFlashHtml = sFlashHtml.replace(/style="position:relative !important;"/gi, 'style="position:absolute !important; left:0 !important; top:0 !important; border:0 !important; padding:0 !important; margin:0 !important; overflow:visible !important;"');
		elDummy.innerHTML = sFlashHtml;
		jindo.$Fn(this._checkFailed, this).attach(elDummy, 'click');
	},
	
	_getFlash : function() {
		return nhn.FlashObject.find('CLIPBOARD' + this._sUnique);
	},
	
	_setFlashPosSize : function(nLeft, nTop, nWidth, nHeight) {
		var elDummy = this._elDummy;
		elDummy.style.left = nLeft + 'px';
		elDummy.style.top = nTop + 'px';
		
		var oFlash = this._getFlash();
		oFlash.width = nWidth;
		oFlash.height = nHeight;
		oFlash.style.width = nWidth + 'px';
		oFlash.style.height = nHeight + 'px';
	},
	
	/**
	 * 특정 엘리먼트를 클릭하면 지정된 값을 클립보드에 저장하도록 설정한다.
	 * @remark setData메소드는 반드시 Flash 객체의 로드가 완료된 이후에 수행되어야한다. load 커스텀이벤트핸들러 내에서 수행하는 것을 권장한다.
	 * @example
oClipboard.attach({
	load : function(e) {
		//클립보드 제어를 위한 Flash 파일이 로드 완료된 이후에 발생
		this.setData(jindo.$('foo'), 'http://naver.com/');
		this.setData(jindo.$('bar'), 'http://daum.net/');
	}
});
	 * @param {HTMLElement | String} el 지정할 엘리먼트 혹은 id
	 * @param {String} sData 저장할 값. 빈 값(null 또는 "" 또는 false)이면 설정된 값을 해제한다.
	 */
	setData : function(el, sData) {
		var el = jindo.$(el);
		
		var nIndex = jindo.$A(this._aElement).indexOf(el);
		var bExist = nIndex != -1;
		
		if (bExist && (!sData || typeof sData == 'undefined') ) { // 지워야 하는 상황이면
			this._wfHandler.detach(el, 'mousemove');
			
			this._aElement.splice(nIndex, 1);
			this._aData.splice(nIndex, 1);

			this._setFlashPosSize(0, 0, 1, 1);
			return;
		}

		if (!bExist) { 
			// 새로 만들어야 하는 상황
			this._wfHandler.attach(el, 'mousemove');
			this._aElement.push(el);
			this._aData.push(sData);
		} else {
			// 바꿔야 하는 상황
			this._aData[nIndex] = sData;
		}
		this._setClipboard(el, sData);
	},
	
	_getData : function(el) {
		var nIndex = jindo.$A(this._aElement).indexOf(el);
		return this._aData[nIndex];
	},
	
	_setClipboard : function(el, sData) {
		var oFlash = this._getFlash();
		var sCursor = (jindo.$Element(el).css('cursor') || '').toUpperCase();
		var bHandCursor = sCursor == 'POINTER' || sCursor == 'HAND';
		
		try {
			oFlash.setClipboardData(sData);
			oFlash.setClipboardOptions({ cursor : bHandCursor ? 'pointer' : 'default' });
			
			this._sAppliedData = sData;
			this._bFailed = false;
		} catch(e) {
			this._bFailed = true;
		}
	},
	
	_checkFailed : function() {
		if (this._bFailed) {
			// 예전에 externalInterface 쓸때 실패했으면
			this.fireEvent('failure', {
				element: this._elOvered,
				data: this._lastestData
			});
		}
	},
	
	_onFlashClick : function(sData) { 
		this.fireEvent('copy', { element : this._elOvered, data : sData }); 
	},
	_onFlashMouseOver : function() { 
		this.fireEvent('over', { element : this._elOvered }); 
	},
	_onFlashMouseOut : function() { 
		this.fireEvent('out', { element : this._elOvered }); 
	},
	_onFlashMouseDown : function() { 
		this.fireEvent('down', { element : this._elOvered }); 
	},
	_onFlashMouseUp : function() { 
		this.fireEvent('up', { element : this._elOvered }); 
	},
	_onFlashLoad : function() { 
		this.fireEvent('load'); 
	}
}).extend(jindo.Component);

/**
 * @fileOverview Data Bridge Component
 * @author TarauS
 * @version 0.1
 */
jindo.DataBridge = jindo.$Class({
	/** @lends jindo.DataBridge.prototype */
	/**
	 * 이벤트 핸들러 저장 객체
	 * @type {HashTable}
	 */
	_htEvent : {},
	
	/**
	 * 스태틱 메소드 저장 객체
	 * @private 
	 */
	$static : {
		/**
		 * 플래시에서 처리 상황을 로깅하기 위한 콜백함수
		 * @function
		 * @name log
		 * @member jindo.DataBridge
		 * @param {String} sFlashId 메시지를 전달할 플래시 객체의 아이디
		 * @param {String} sMessage 로깅 메시지
		 */
		log : function(sFlashId, sMessage){
			if(sFlashId && sMessage){
				this.getComponentInstance(sFlashId)._onLog(sMessage);
			}else{
				alert("Parameter is wrong!!");
			}
		},
		
		/**
		 * 다른 클라이언트에서 온 데이터를 수신하기 위한 콜백함수
		 * @function
		 * @name onReceive
		 * @member jindo.DataBridge
		 * @param {String} sFlashId 데이터를 전달할 플래시 객체의 아이디
		 * @param {String} sSenderId 데이터를 송신한 클라이언트의 아이디
		 * @param {Variant} vData 다른 클라이언트에서 온 데이터
		 */
		onReceive : function(sFlashId, sSenderId, vData){
			if(sFlashId && sSenderId && vData){
				this.getComponentInstance(sFlashId)._onReceiveData(sSenderId, vData);
			}else{
				alert("Parameter is wrong!!");
			}
		},
		
		/**
		 * sFlashId에 해당하는 인스턴스를 찾아서 리턴함
		 * @function
		 * @name getComponentInstance
		 * @member jindo.DataBridge
		 * @param {String} sFlashId 문서에 삽입된 플래시 객체의 아이디
		 * @return {jindo.DataBridge} DataBridge Component의 instance
		 */
		getComponentInstance : function(sFlashId){
			var aInstanceList = this.getInstance();
			for(var i=0; i<aInstanceList.length; i++){
				if(sFlashId == aInstanceList[i].getFlashObjectId()){
					return aInstanceList[i];
				}
			}
		}
	},
	
	/**
	 * 초기화 함수
	 * @constructs
	 * @class DataBridge
	 * @param {HashTable} htOption 초기화 옵션 객체
	 * @example
	 * var oDataBridge = new jindo.DataBridge({
	 * 		"sServiceId" : "deskhome",
	 * 		"nRetryCount" : 3
	 * });
	 * 
	 * oDataBridge.attach("receive", function(oCustomEvent){
	 * 		console.log(oCustomEvent.vData);
	 * });
	 * @extends jindo.Component
	 */
	$init : function(htOption){
		this.option({
			"sSwfPath" : "data_bridge.swf",
			"nRetryLimit" : 3
		});
		this.option(htOption);
		this._attachEvent();
		this._createFlashObject();
	},
	
	/**
	 * 이벤트 핸들러 등록
	 */
	_attachEvent : function(){
		this._htEvent["beforeunload"] = jindo.$Fn(this.destroy, this).attach(window, "beforeunload");
	},
	
	/**
	 * 클라이언트들과 통신을 담당할 플래시 객체를 동적으로 생성
	 */
	_createFlashObject : function(){
		this._sFlashId = 'data_bridge_'+(new Date()).getMilliseconds()+Math.floor(Math.random()*100000);
		var welFlashContainer = jindo.$Element('<div style="position:absolute;top:-1000px;left:0px">');
		var sFlashVars = "serviceId="+this.option("sServiceId")+"&logHandler=jindo.DataBridge.log&onReceiveHandler=jindo.DataBridge.onReceive&flashId="+this._sFlashId+"&retryLimit="+this.option("nRetryLimit");
		welFlashContainer.appendTo(document.body).html('<object id="'+this._sFlashId+'" width="1" height="1" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"><param name="flashvars" value="'+sFlashVars+'"><param name="movie" value="'+this.option("sSwfPath")+'"><param name = "allowScriptAccess" value = "always" /><embed name="'+this._sFlashId+'" src="'+this.option("sSwfPath")+'" flashvars="'+sFlashVars+'" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" width="1" height="1" allowScriptAccess="always" swLiveConnect="true"></embed></object>');
	},
	
	/**
	 * 클라이언트들과 통신을 담당하기 위해 문서에 삽입된 플래시 객체를 리턴
	 * 
	 * @return {Element} 플래시 객체
	 */
	_getFlashObject : function(){
		return document[this._sFlashId] || jindo.$(this._sFlashId);
	},
	
	/**
	 * 클라이언트들과 통신을 담당할 플래시 객체의 엘리먼트 아이디를 리턴
	 * 
	 * @return {String} 플래시 객체의 엘리먼트 아이디
	 */
	getFlashObjectId : function(){
		return this._sFlashId;
	},
	
	/**
	 * 클라이언트 아이디를 리턴한다.
	 * @return {String} 클라이언트 아이디
	 */
	getClientId : function(){
		return this.option("sServiceId")+"_"+this._sFlashId;
	},
	
	/**
	 * 다른 클라이언트들에게 vData를 전달
	 * - 클래스 인스턴스 생성 후, 플래시 객체가 문서에 삽입되기까지 시간이 걸리기에, send 메소드는 특정 시간 이후에 사용해야 함
	 * 
	 * @param {Variant} 전달할 데이터
	 * @return {this}
	 */
	send : function(vData){
		if(vData){
			try{
				this._getFlashObject().send(vData);
			}catch(e){
				alert("Flash object is not ready!!");
			}
		}else{
			alert("vData parameter is null!!");	
		}
		return this;
	},
	
	/**
	 * 다른 클라이언트로부터 데이터를 수신했을 때, 수행될 콜백 함수
	 * - 데이터 수신 후, receive라는 사용자 이벤트를 발생 시킴
	 * 
	 * @param {String} sSenderId 데이터를 송신한 클라이언트의 아이디
	 * @param {Variant} vData 전달받은 데이터
	 */
	_onReceiveData : function(sSenderId, vData){
		this.fireEvent("receive", {
			"sSenderId" : sSenderId,
			"vData" : vData
		});
	},
	
	/**
	 * 플래시 내에서의 처리 상황을 로깅하기 위한 콜백 함수
	 * 
	 * @param {String} sMessage 로깅 메시지
	 */
	_onLog : function(sMessage){
		this.fireEvent("log", {
			"sMessage" : sMessage
		});
	},
	
	/**
	 * 다른 클라이언트들과의 로컬 연결을 해제 함
	 */
	_close : function(){
		this._getFlashObject().close();
	},
	
	/**
	 * 이벤트 핸들러 해제
	 */
	_detachEvent : function(){
		this._htEvent["beforeunload"].detach(window, "beforeunload");
	},
	
	getLocalData : function(){
		
	},
	
	setLocalData : function(){
		
	},
	
	resetLocalData : function(){
		
	},
	
	/**
	 * 모듈 소멸자
	 */
	destroy : function(){
		this._close();
		this._detachEvent();
		this._htEvent = {};
		jindo.$Element(this._getFlashObject()).leave();
	}
}).extend(jindo.Component);
/**
 * @fileOverview Ajax History  
 * @author AjaxUI-1 <TarauS>
 * @version 0.1
 */
jindo.AjaxHistory = jindo.$Class({
	/** @lends jindo.AjaxHistory.prototype */

	/**
	 * 이벤트 핸들러 저장 객체
	 * @type {HashTable}
	 */
	_htEventHandler : {},
	/**
	 * 히스토리 데이터 저장 객체
	 * @type {HashTable}
	 */
	_htHistoryData : {},
	/**
	 * 에이전트 정보 저장 객체
	 * @type {Object}
	 */
	_oAgent : null,
	/**
	 * IE 7이하에서 사용할 아이프레임 객체
	 * @type {WrappingElement}
	 */
	_welIFrame : null,
	/**
	 * setInterval()의 리턴 값
	 * @type {Number}
	 */
	_nIntervalId : 0,
	/**
	 * 로케이션 변경 체크 방법
	 * @type {String}
	 */
	_sCheckType : "",
	/**
	 * 컴포넌트 인스턴스의 고유 아이디 값
	 * @type {String}
	 */
	_sComponentId : "",

	/**
	 * 스태틱 메소드
	 * @private
	 */
	$static : {
		/**
		 * IE7 이하의 브라우저에서 로케이션 변경을 체크하기 위한 함수
		 * Hidden IFrame의 history.html이 로딩될 때마다 이 함수를 호출 함
		 * @function 
		 * @name checkIFrameChange
		 * @member jindo.AjaxHistory
		 */
		checkIFrameChange : function(oLocation){
			var htQueryString = jindo.$S(oLocation.search.substring(1)).parseString();
			this.getInstance()[0]._checkLocationChange(encodeURIComponent(htQueryString.hash));
			/*
			for(var i=0; i<aInstanceList.length; i++){
				if(htQueryString.componentId == aInstanceList[i].getComponentId()){
				alert("iframe callback : "+htQueryString.hash);
					aInstanceList[i]._checkLocationChange(encodeURIComponent(htQueryString.hash));
					break;
				}
			}
			*/
		}
	},
	
	/**
	 * @constructs
	 * @class Ajax History
	 * @param {HashTable} [htOption] 초기화 옵션 객체
	 * @extends jindo.Component 
	 * @example
	 * 
	 * var oAjaxHistoryInstance = new jindo.AjaxHistory({
	 *     // IE7 이하의 브라우저에서 로케이션 변경을 체크하기 위해 로딩하는 웹문서의 위치
	 *     "sIFrameUrl" : "history.html",
	 *     // attach() 함수를 사용하지 않고, 초기화 시에 이벤트 핸들러를 연결하기 위해 사용
	 *     // 기존과 같이 attach() 함수를 사용할 경우, 초기화 후에 이벤트 핸들러를 등록하고
	 *     // oAjaxHistoryInstance.initialize() 함수를 호출해야 함
	 *     "htCustomEvent" : {
	 *         "load" : function(){
	 *             alert("load event");
	 *         },
	 *         "change" : function(oChangeEvent){
	 *             alert("change event");
	 *         }
	 *     },
	 *     // setInterval()을 이용하여 로케이션 변경을 체크 시, 체크 주기
	 *     "nCheckInterval" : 100
	 * });
	 *
	 * oAjaxHistoryInstance.addHistory({
	 *     "sPageType" : "layer",
	 *     "aParameter" : [
	 *         "1", "2", "3"
	 *     ]
	 * });
	 */
	$init : function(htOption){
		this._oAgent = jindo.$Agent().navigator();
		this._sComponentId = "AjaxHistory"+(new Date()).getTime();
		this.option({
			sIFrameUrl : "history.html",
			nCheckInterval : 100
		});
		this.option(htOption || {});
	},

	/**
	 * 컴포넌트 초기화 후에, 로케이션 변경 체크 및 초기 이벤트 발생을 위한 초기화 함수
	 * @return {this}
	 */
	initialize : function(){
		var sHash = this._getLocationHash();

		// onHashChange 이벤트를 지원하는 경우
		if((this._oAgent.ie && this._oAgent.version >= 8 && jindo.$Document().renderingMode() == "Standards") || (this._oAgent.firefox && this._oAgent.version >= 3.6) || (this._oAgent.chrome && this._oAgent.version > 3)){
			this._htEventHandler["hashchange"] = jindo.$Fn(this._checkLocationChange, this).attach(window, "hashchange");
			this._sCheckType = "hashchangeevent";
		// IE 7 이하인 경우
		}else if(this._oAgent.ie){
			this._welIFrame = jindo.$Element("<IFRAME>");
			this._welIFrame.hide();
			this._welIFrame.appendTo(document.body);
			this._sCheckType = "iframe";
		// setInterval() 함수를 이용하여 체크해야 하는 경우
		}else{
			this._nIntervalId = setInterval(jindo.$Fn(this._checkLocationChange, this).bind(), this.option("nCheckInterval"));
			this._sCheckType = "setinterval";
		}

		if(sHash){
			if(this._sCheckType == "iframe"){
				this._welIFrame.$value().src = this.option("sIFrameUrl") + "?hash=" + sHash;
			}else{
				this._htHistoryData = this._getDecodedData(sHash);
				this.fireEvent("change", this._getDecodedData(sHash));
			}
		}else{
			this.fireEvent("load");
		}
		
		return this;
	},

	/**
	 * 컴포넌트의 고유 아이디를 리턴
	 *
	 * @return {String} 컴포넌트 고유 아이디
	 */
	getComponentId : function(){
		return this._sComponentId;
	},

	/**
	 * 현재 설정되어 있는 Hash String을 리턴
	 *
	 * @return {String} 현재 설정된 Hash String
	 */
	_getLocationHash : function(){
		return this._oAgent.firefox ? encodeURIComponent(location.hash.substring(1)) : location.hash.substring(1);
	},

	/**
	 * location.hash 설정 함수
	 *
	 * @param {String} sHash location.hash를 sHash로 변경
	 */
	_setLocationHash : function(sHash){
		location.hash = sHash;
	},

	/**
	 * htHistoryData를 브라우저의 히스토리에 추가
	 *
	 * @param {HashTable} htHistoryData 추가할 히스토리 데이터 객체
	 * @return {Boolean} 히스토리 추가 결과
	 */
	addHistory : function(htHistoryData){
		if(htHistoryData && typeof(htHistoryData) == "object"){
			this._htHistoryData = htHistoryData;
			var sHash = this._getEncodedData(htHistoryData);

			// 현재 설정된 데이터와 추가하려는 데이터가 같지 않을 경우에만 히스토리에 추가
			if(this._getLocationHash() != sHash){
				this._setLocationHash(sHash);
				if(this._sCheckType == "iframe"){
					this._welIFrame.$value().src = this.option("sIFrameUrl") + "?hash=" + sHash;
				}
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	},

	/**
	 * 히스토리 변경을 체크하여 change 이벤트를 발생시키는 함수
	 * 
	 * @param {String} [sHash] 로케이션 변경 체크 시, 사용할 히스토리 데이터 문자열
	 */
	_checkLocationChange : function(sHash){
		sHash = (sHash && typeof(sHash) == "string") ? sHash : this._getLocationHash();
		var htCurrentHistoryData = this._getDecodedData(sHash);
		if(!this._compareData(this._htHistoryData, htCurrentHistoryData)){
			this._htHistoryData = htCurrentHistoryData;
			if(this._sCheckType == "iframe"){
				this._setLocationHash(sHash);
			}
			// change 이벤트 발생
			this.fireEvent("change", this._getDecodedData(sHash));
		}
	},

	/**
	 * htHistoryData 객체를 Json 문자열로 변환 후, 인코딩하여 리턴
	 * - JSON.stringify() 함수를 브라우저에서 지원할 경우, 해당 함수 사용
	 * - 위의 함수를 지원하지 않을 경우, jindo.$Json().toString() 함수 사용
	 *
	 * @param {HashTable} htHistoryData 히스토리 데이터 객체
	 * @return {String} Json 문자열로 변환 후, 인코딩한 문자열
	 */
	_getEncodedData : function(htHistoryData){
		if(htHistoryData){
			// JSON.stringify() 함수를 지원하는 경우
			if(typeof(JSON) == "object" && typeof(JSON.stringify) == "function"){
				return encodeURIComponent(JSON.stringify(htHistoryData));
			}else{
				return encodeURIComponent(jindo.$Json(htHistoryData).toString());
			}
		}else{
			return "";
		}
	},
	
	/**
	 * 인코딩된 히스토리 데이터를 HashTable 객체로 변환 후, 리턴
	 * - JSON.parse() 함수를 브라우저에서 지원할 경우, 해당 함수 사용
	 * - 위의 함수를 지원하지 않을 경우, jindo.$Json().toObject() 함수 사용
	 *
	 * @param {String} sEncodedHash 인코딩된 히스토리 데이터
	 * @return {HashTable} 디코딩 후, HashTable로 변환한 객체
	 */
	_getDecodedData : function(sEncodedHash){
		if(sEncodedHash){
			var sHashString = decodeURIComponent(sEncodedHash);
			// JSON.parse() 함수를 지원하는 경우
			if(typeof(JSON) == "object" && typeof(JSON.parse) == "function"){
				return JSON.parse(sHashString);
			}else{
				return jindo.$Json(sHashString).toObject();
			}
		}else{
			return {};
		}
	},

	/**
	 * 두 데이터 객체를 비교하여 결과를 리턴
	 * - 하위 데이터가 Object나 Array일 경우, 재귀적으로 비교
	 *
	 * @param {HashTable} htBase 비교 기준 객체
	 * @param {HashTable} htComparison 비교 객체
	 * @param {Boolean} 비교 결과
	 */
	_compareData : function(htBase, htComparison){
		if(htBase && htComparison){
			if(jindo.$H(htBase).length() == jindo.$H(htComparison).length()){
				for(var x in htBase){
					if(typeof(htBase[x]) == "object"){
						if(!arguments.callee(htBase[x], htComparison[x])){
							return false;
						}
					}else{
						if(htBase[x] != htComparison[x]){
							return false;
						}
					}
				}
				
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	},

	/**
	 * 컴포넌트 소멸자
	 */
	destroy : function(){
		// 설정된 로케이션 체크 방법을 해제
		if(this._sCheckType == "hashchangeevent"){
			this._htEventHandler["hashchange"].detach(window, "hashchange");
		}else if(this._sCheckType == "iframe"){
			this._welIFrame.leave();
		}else{
			clearInterval(this._nIntervalId);
		}
		// 프로퍼티 초기화
		this._htEventHandler = null;
		this._htHistoryData = null;
		this._oAgent = null;
		this._welIFrame = null;
		this._nIntervalId = null;
		this._sCheckType = null;
		this._sComponentId = null;
	}
}).extend(jindo.Component);
/**
 * @fileOverview Data Cache  
 * @author AjaxUI-1 <TarauS>
 * @version 0.1
 */
jindo.Cache = jindo.$Class({
	/**
	 * @lends jindo.Cache.prototype
	 */

	/**
	 * @constructs
	 * @class Data Cache
	 * @param {HashTable} [htOption] 초기화 옵션
	 * {
	 *     "nCacheLimit" : 100,  // 캐쉬의 최대 저장 개수
	 *     "nExpireTime" : 600   // 캐쉬의 기본 유효 시간 (600초이며, 데이터가 추가된 지, 60분 후에는 유효하지 않음)
	 * }
	 * @extends jindo.Component
	 * @example
	 * var oCache = new jindo.Cache({'nCacheLimit' : 15});
	 * oCache.add('key1', 'value1', 5 * 60);
	 * oCache.add('key2', 'value2');
	 * oCache.add({'key1':true, 'key2':false}, {'value1':10, 'value2':20});
	 *
	 * // vResult is 'value1'
	 * var vResult = oCache.get('key1');
	 *
	 * // vResult is {'value1':10, 'value2':20}
	 * var vResult = oCache.get({'key1':true, 'key2':false}); 
	 *
	 * oCache.remove('key1');
	 * oCache.clear();
	 */
	$init : function(htOption){
		this._htCacheData = {};
		this._htExpireTime = {};
		this._waKeyList = jindo.$A();
		
		this.option({
			nCacheLimit : 50,
			nExpireTime : 0
		});
		this.option(htOption);
	},

	/**
	 * 데이터를 캐쉬함
	 * 
	 * @param {Variant} vKey 저장할 데이터를 구분할 키값 (String 타입과 Object 타입 모두 가능)
	 * @param {Variant} vValue 저장할 데이터
	 * @param {Number} [nExpireTime] 캐쉬 데이터가 폐기될 시간 (nExpireTime 이후에 폐기되며, 초로 입력)
	 * @example
	 * // 문자열 키를 이용하여 데이터 캐싱
	 * oCache.add("string_key", [0, 1, 2]);
	 *
	 * // HashTable 형태의 객체 키를 이용하여 데이터 캐싱
	 * oCache.add({"key1" : "a", "key2" : "b"}, [0, 1, 2]);
	 *
	 * // 데이터 캐싱 시에, 해당 데이터의 유효 시간을 설정
	 * // (120초 후에는 컴포넌트 내부에서 데이터 삭제)
	 * oCache.add({"key1" : "a", "key2" : "b"}, [0, 1, 2], 120);
	 */
	add : function(vKey, vValue, nExpireTime){
		if(vKey && vValue){
			this._checkCacheExpire();
			this._checkCacheLimit();
			
			var sKey = this._makeKey(vKey);
			this._htCacheData[sKey] = vValue;
			this._htExpireTime[sKey] = this._getExpireTime(nExpireTime);
			this._waKeyList.push(sKey);
			return true;
		}else{
			return false;
		}
	},
	
	/**
	 * 캐쉬된 데이터를 삭제함
	 * 
	 * @param {Varinat} vKey 캐쉬 데이터의 키값
	 * @param {Boolean} 삭제 여부
	 * @example
	 * // 데이터 추가
	 * oCache.add({"key1" : "a", "key2" : "b"}, [0, 1, 2]);
	 * 
	 * // 데이터를 추가할 때 전달했던 키를 동일하게 전달하여 내부 데이터 삭제
	 * oCache.remoe({"key1" : "a", "key2" : "b"});
	 */
	remove : function(vKey){
		if(vKey){
			var sKey = this._makeKey(vKey);
			if(this._htCacheData[vKey]){
				this._waKeyList = this._waKeyList.refuse(sKey);
				delete this._htExpireTime[sKey];
				delete this._htCacheData[sKey];
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	},
	
	/**
	 * 캐쉬된 데이터 모두를 삭제 함
	 *
	 * @example
	 * // 데이터 추가
	 * oCache.add({"key1" : "a", "key2" : "b"}, [0, 1, 2]);
	 * oCache.add({"key1" : "1", "key2" : "2"}, [0, 0, 0]);
	 * 
	 * // clear() 메소드를 호출하여, 추가된 모든 데이터를 삭제 함
	 * oCache.clear();
	 */
	clear : function(){
		this._htCacheData = {};
		this._htExpireTime = {};
		this._waKeyList = jindo.$A();
	},
	
	/**
	 * vKey에 해당하는 캐쉬된 데이터를 리턴함
	 * 
	 * @param {Variant} vKey 캐쉬 데이터의 키값
	 * @return {Variant} 캐쉬된 데이터
	 * @example
	 * // 데이터 추가
	 * oCache.add({"key1" : "a", "key2" : "b"}, [0, 1, 2]);
	 * 
	 * // 데이터를 추가할 때 전달했던 키를 동일하게 전달
	 * // vResult is [0, 1, 2]
	 * var vResult = oCache.get({"key1" : "a", "key2" : "b"});
	 */
	get : function(vKey){
		if(vKey){
			var sKey = this._makeKey(vKey);
			if(this.check(vKey)){
				return this._htCacheData[sKey];
			}else{
				return null;
			}
		}else{
			return null;
		}
	},
	
	/**
	 * vKey에 해당하는 캐쉬 데이터의 유효성을 검사하여 리턴
	 * 
	 * @param {Variant} vKey 캐쉬 데이터의 키값
	 * @return {Boolean} 캐쉬 데이터의 유효성
	 * @example
	 * // 데이터 추가
	 * oCache.add({"key1" : "a", "key2" : "b"}, [0, 1, 2]);
	 * 
	 * // 데이터를 추가할 때 전달했던 키를 동일하게 전달
	 * // bResult is true, bResult2 is false
	 * var bResult = oCache.check({"key1" : "a", "key2" : "b"});
	 * var bResult2 = oCache.check({"key1" : 1, "key2" : 2});
	 */
	check : function(vKey){
		if(vKey){
			var sKey = this._makeKey(vKey);
			if(this._htCacheData[sKey] && this._checkCacheExpire(sKey)){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	},

	/**
	 * 저장되어 있는 캐쉬의 개수를 체크하여, 옵션의 캐시 최대 값보다 클 경우, 가장 먼저 저장된 항목을 삭제 함
	 */
	_checkCacheLimit : function(){
		if(this._waKeyList.length() == this.option("nCacheLimit")){
			this.remove(this._waKeyList.get(0));
		}
	},
	
	/**
	 * sKey에 해당하는 캐쉬 데이터가 유효한지 검사
	 * 
	 * @param {String} sKey 문자열로 변환된 캐쉬 데이터의 키값
	 * @return {Boolean} 유효 여부
	 */
	_checkCacheExpire : function(sKey){
		if(sKey){
			var nTime = this._getTime();
			if(this._htExpireTime[sKey] === 0 || nTime < this._htExpireTime[sKey]){
				return true;
			}else{
				this.remove(jindo.$S(sKey).parseString());
				return false;
			}
		}else{
			for(var i=0, n=this._waKeyList.length(); i<n; i++){
				return this._checkCacheExpire(this._waKeyList.get(i));
			}
		}
	},
	
	/**
	 * nExpireTime을 기준으로 캐쉬의 만료 시간을 계산하여 리턴 함
	 *
	 * @param {Number} [nExpireTime] 캐쉬 만료 시간 (생략할 경우 옵션에 설정된 값을 기준으로 계산)
	 * @return {Number} 계산된 캐쉬 만료 시간
	 */
	_getExpireTime : function(nExpireTime){
		if(nExpireTime){
			return this._getTime() + (nExpireTime * 1000);
		}else if(this.option("nExpireTime")){
			return this._getTime() + (this.option("nExpireTime") * 1000);
		}else{
			return 0;
		}
	},
	
	/**
	 * vKey가 HashTable인 경우 문자열 키로 변경하여 리턴
	 * 
	 * @param {Variant} vKey 캐쉬 데이터의 키값
	 * @return {String} 문자열로 변환된 캐쉬 데이터의 키값
	 */
	_makeKey : function(vKey){
		if(vKey){
			if(typeof(vKey) == "string"){
				return vKey;
			}else{
				return jindo.$H(vKey).toQueryString();
			}
		}else{
			return "";
		}
	},
	
	/**
	 * 현재 시간을 리턴한다.
	 * 
	 * @return {Number} 현재 시간 (유닉스 타임스탬프 값)
	 */
	_getTime : function(){
		return +new Date();
	},
	
	/**
	 * 컴포넌트 소멸자
	 */
	destroy : function(){
		this._waKeyList = null;
		this._htCacheData = null;
		this._htExpireTime = null;
	}
}).extend(jindo.Component);
/**
 * @fileOverview 외부의 모든 문서를 가리는 사용자 대화창을 생성하는 컴포넌트
 * @author senxation
 * @version 0.2
 */

jindo.ModalDialog = jindo.$Class({
	/** @lends jindo.ModalDialog */

	/**
	 * Modal Dialog 컴포넌트를 생성한다.
	 * @constructs
	 * @class 외부의 모든 문서를 가리는 사용자 대화창을 생성하는 컴포넌트
	 * @param {HashTable} htOption 옵션 해시테이블
	 * @extends jindo.Dialog
	 * @requires jindo.Foggy 
	 * @example
var oModalDialog = new jindo.ModalDialog({
	Foggy : { //Foggy 컴포넌트를 위한 옵션 (jindo.Foggy 참고)
		nShowDuration : 150, //(Number) fog 레이어가 완전히 나타나기까지의 시간 (ms)  
		nShowOpacity : 0.8, //(Number) fog 레이어가 보여질 때의 transition 효과와 투명도 (0~1사이의 값)      
		nHideDuration : 150, //(Number) fog 레이어가 완전히 사라지기까지의 시간 (ms)  
		nHideOpacity : 0, //(Number) fog 레이어가 숨겨질 때의 transition 효과와 투명도 (0~1사이의 값)
		sEffect : "linear", // (String) jindo.Effect의 종류
		nFPS : 30 //(Number) 효과가 재생될 초당 frame rate  
	}
}).attach({
	beforeShow : function(e) {
		//다이얼로그 레이어가 보여지기 전에 발생
		//전달되는 이벤트 객체 e = {
		//	elLayer (HTMLElement) 다이얼로그 레이어
		//}
		//e.stop(); 수행시 보여지지 않음
	},
	show : function(e) {
		//다이얼로그 레이어가 보여진 후 발생
		//전달되는 이벤트 객체 e = {
		//	elLayer (HTMLElement) 다이얼로그 레이어
		//}
	},
	beforeHide : function(e) {
		//다이얼로그 레이어가 숨겨지기 전에 발생
		//전달되는 이벤트 객체 e = {
		//	elLayer (HTMLElement) 다이얼로그 레이어
		//}
		//e.stop(); 수행시 숨겨지지 않음
	},
	hide : function(e) {
		//다이얼로그 레이어가 숨겨진 후 발생
		//전달되는 이벤트 객체 e = {
		//	elLayer (HTMLElement) 다이얼로그 레이어
		//}
	}
});
	 */
	$init : function(htOption) {
		var htDefaultOption = {
			Foggy : { //Foggy 컴포넌트를 위한 옵션 (jindo.Foggy 참고)
				nShowDuration : 150, //(Number) fog 레이어가 완전히 나타나기까지의 시간 (ms)  
				nShowOpacity : 0.8, //(Number) fog 레이어가 보여질 때의 transition 효과와 투명도 (0~1사이의 값)      
				nHideDuration : 150, //(Number) fog 레이어가 완전히 사라지기까지의 시간 (ms)  
				nHideOpacity : 0, //(Number) fog 레이어가 숨겨질 때의 transition 효과와 투명도 (0~1사이의 값)
				sEffect : "linear", // (String) jindo.Effect의 종류
				nFPS : 30 //(Number) 효과가 재생될 초당 frame rate  
			}
		};
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		this._initFoggy();
	},
	
	/**
	 * Foggy 컴포넌트를 초기화한다.
	 * @ignore
	 */
	_initFoggy : function() {
		var self = this;
		this._oFoggy = new jindo.Foggy(this.option("Foggy")).attach({
			show : function(e) {
				self.fireEvent("show", { elLayer : self._elLayer });
			},
			hide : function() {
				self.detachAll("close").detachAll("confirm").detachAll("cancel");
				self._detachEvents();
				self._welLayer.hide();
				self._welLayer.leave();
				self._bIsShown = false;
				self.fireEvent("hide", { elLayer : self._elLayer });
			}
		});
		
		//컴포넌트에 의해 생성된 fog레이어에 대한 설정
		this._oFoggy.getFog().className = this.option("sClassPrefix") + 'fog'; 
	},
	
	/**
	 * 생성된 Foggy 컴포넌트의 인스턴스를 가져온다.
	 * @return {jindo.Foggy}
	 */
	getFoggy : function() {
		return this._oFoggy;
	},
	
	/**
	 * 다이얼로그 레이어를 보여준다.
	 * @remark 다이얼로그 레이어는 설정된 레이어의 템플릿으로부터 만들어져 document.body에 append된다.
	 * @param {Object} htTemplateProcess 템플릿에 대체하기 위한 데이터를 가지는 Hash Table
	 * @param {Object} htEventHandler 다이얼로그 내부에서 발생하는 이벤트를 처리하는 핸들러들
	 * @example
//다이얼로그 레이어에 닫기, 취소, 확인 버튼이 모두 존재하는경우 각각의 버튼에 대한 핸들러를 함께 등록한다. 
var oModalDialog = new jindo.ModalDialog();

oModalDialog.setLayerTemplate('<div><a href="#" class="dialog-close"><img width="15" height="14" alt="레이어닫기" src="http://static.naver.com/common/btn/btn_close2.gif"/></a></div><div style="position:absolute;top:30px;left:10px;">{=text}</div><div style="position:absolute;bottom:10px;right:10px;"><button type="button" class="dialog-confirm">확인</button><button type="button" class="dialog-cancel">취소</button></div></div>');

oModalDialog.show({ text : "<strong>확인하시겠습니까?</strong>" }, {
	close : function(e) {
		$Element("status").text("oDialog의 레이어에서 닫기 버튼이 클릭되었습니다.");
		//e.stop() 수행시 레이어가 닫히지 않는다.
	},
	cancel : function(e) {
		$Element("status").text("oDialog의 레이어에서 취소 버튼이 클릭되었습니다.");
		//e.stop() 수행시 레이어가 닫히지 않는다.
	},
	confirm : function(e) {
		$Element("status").text("oDialog의 레이어에서 확인 버튼이 클릭되었습니다.");
		//e.stop() 수행시 레이어가 닫히지 않는다.
	}
});	
	 */
	show : function(htTemplateProcess, htEventHandler) {
		if (this.isShown()) {
			return;
		}
		
		this.attach(htEventHandler);
		
		document.body.appendChild(this._elLayer);
		this._welLayer.html(this._template.process(htTemplateProcess));
		
		var htCustomEvent = { elLayer : this._elLayer }; 
		
		if (this.fireEvent("beforeShow", htCustomEvent)) {
			this._welLayer.show();
			this._attachEvents();
			this.getLayerPosition().setPosition();
			this._bIsShown = true;
			this._oFoggy.show(this._elLayer);
		} else {
			return;
		}
	},
	
	/**
	 * 다이얼로그 레이어를 숨긴다.
	 * @remark 다이얼로그 레이어가 숨겨지는 동시에 모든 이벤트가 제거되고 document.body에서 제거된다.
	 */
	hide : function() {
		if (this.fireEvent("beforeHide", { elLayer : this._elLayer })) {
			this._oFoggy.hide();
		} 
	}
}).extend(jindo.Dialog);	
/**
 * @fileOverview HTMLElement를 Drop할 수 있게 해주는 컴포넌트
 * @author hooriza, modified by senxation
 * @version 0.5.3
 */
jindo.DropArea = jindo.$Class({
	/** @lends jindo.DropArea.prototype */
	
	/**
	 * DropArea 컴포넌트를 생성한다.
	 * DragArea 컴포넌트는 상위 기준 엘리먼트의 자식들 중 특정 클래스명을 가진 모든 엘리먼트에 Drag된 엘리먼트를 Drop 가능하게 한다.
	 * @constructs
	 * @class HTMLElement를 Drop할 수 있게 해주는 컴포넌트
	 * @extends jindo.Component
	 * @requires jindo.DragArea
	 * @param {HTMLElement || document} el Drop될 엘리먼트들의 상위 기준 엘리먼트. 컴포넌트가 적용되는 영역(Area)이 된다.
	 * @param {HashTable} htOption 옵션 객체
	 * @example
var oDropArea = new jindo.DropArea(document, { 
	sClassName : 'dropable', // (String) 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트는 Drop 가능하게 된다. 
	oDragInstance : oDragArea // (jindo.DragArea) Drop이 될 대상인 DragArea 컴포넌트의 인스턴스
}).attach({
	dragStart : function(oCustomEvent) {
		//oDragInstance의 dragStart 이벤트에 연이어 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elArea : (HTMLElement) 기준 엘리먼트
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트 (핸들을 드래그하여 레이어 전체를 드래그되도록 하고 싶으면 이 값을 설정한다. 아래 예제코드 참고)
		//	htDiff : (HashTable) handledown된 좌표와 dragstart된 좌표의 차이 htDiff.nPageX, htDiff.nPageY
		//	weEvent : (jindo.$Event) 마우스 이동 중 발생되는 jindo.$Event 객체
		//};
	},
	over : function(oCustomEvent) {
		//Drag된 채 Drop 가능한 엘리먼트에 마우스 커서가 올라갈 경우 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elHandle : (HTMLElement) Drag하기위한 이벤트를 받은 핸들 엘리먼트
		//	elDrag : (HTMLElement) 실제 Drag 된 엘리먼트 
		//	elDrop : (HTMLElement) Drop 될 대상 엘리먼트
		//}
	},
	move : function(oCustomEvent) {
		//Drag된 채 Drop 가능한 엘리먼트위에서 마우스 커서가 움직일 경우 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	weEvent : (jindo.$Event) 마우스 이동시 발생하는 jindo의 jindo.$Event 객체
		//	elHandle : (HTMLElement) Drag하기위한 이벤트를 받은 핸들 엘리먼트
		//	elDrag : (HTMLElement) 실제 Drag 된 엘리먼트 
		//	elDrop : (HTMLElement) Drop 될 대상 엘리먼트
		//	nRatioX : (Number) 드랍될 엘리먼트 내부의 좌우비율
		//	nRatioY : (Number) 드랍될 엘리먼트 내부의 상하비율
		//}
	},
	out : function(oCustomEvent) {
		//Drag된 채 Drop 가능한 엘리먼트에서 마우스 커서가 벗어날 경우 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elHandle : (HTMLElement) Drag하기위한 이벤트를 받은 핸들 엘리먼트
		//	elDrag : (HTMLElement) 실제 Drag 된 엘리먼트 
		//	elDrop : (HTMLElement) Drop 될 엘리먼트
		//}
	}, 
	drop : function(oCustomEvent) {
		//Drop 가능한 엘리먼트에 성공적으로 드랍 될 경우 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elHandle : (HTMLElement) Drag하기위한 이벤트를 받은 핸들 엘리먼트
		//	elDrag : (HTMLElement) 실제 Drag 된 엘리먼트 
		//	elDrop : (HTMLElement) Drop 될 대상 엘리먼트
		//	weEvent : (jindo.$Event) mouseup시 발생되는 jindo.$Event 객체 
		//}
	},
	dragEnd : function(oCustomEvent) {
		//oDragInstance의 dragEnd 이벤트에 연이어 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elArea : (HTMLElement) 기준 엘리먼트
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 된 엘리먼트
		//  aDrop : (Array) Drop 될 대상 엘리먼트의 배열
		//	nX : (Number) 드래그 된 x좌표.
		//	nY : (Number) 드래그 된 y좌표.
		//}
	}
});
	 */
	$init : function(el, htOption) {
		this._el = jindo.$(el);
		this._wel = jindo.$Element(this._el);
		
		this.option({ 
			sClassName : 'droppable', 
			oDragInstance : null 
		});
		this.option(htOption || {});
		
		this._waOveredDroppableElement = jindo.$A([]);
		
		this._elHandle = null;
		this._elDragging = null;
		
		this._wfMouseMove = jindo.$Fn(this._onMouseMove, this);
		this._wfMouseOver = jindo.$Fn(this._onMouseOver, this);
		this._wfMouseOut = jindo.$Fn(this._onMouseOut, this);
		var oDrag = this.option('oDragInstance');
		if (oDrag) {
			var self = this;
			oDrag.attach({
				handleDown : function(oCustomEvent) {
					self._elHandle = oCustomEvent.elHandle;
					self._waOveredDroppableElement.empty(); 
				},
				dragStart : function(oCustomEvent) {
					self._reCalculate();
					self.fireEvent(oCustomEvent.sType, oCustomEvent); //dragStart
					
					self._wfMouseMove.attach(document, 'mousemove'); //move
					self._wfMouseOver.attach(self._el, 'mouseover'); //over
					self._wfMouseOut.attach(self._el, 'mouseout');  //out
				},
				beforeDrag : function(oCustomEvent) {
					self._elDragging = oCustomEvent.elDrag; 
				},
				dragEnd : function(oCustomEvent) {
					var o = {};
					for (var sKey in oCustomEvent) {
						o[sKey] = oCustomEvent[sKey];
					}
					o.aDrop = self.getOveredLists().concat();
					
					self._clearOveredDroppableElement(oCustomEvent.weEvent, oCustomEvent.bInterupted); //drop
					self.fireEvent(oCustomEvent.sType, o); //dragEnd
					
					self._wfMouseMove.detach(document, 'mousemove');
					self._wfMouseOver.detach(self._el, 'mouseover');
					self._wfMouseOut.detach(self._el, 'mouseout'); 
				},
				handleUp : function(oCustomEvent) {
					self._elDragging = null;
					self._elHandle = null;
				}
			});
		} 
	},
	
	_addOveredDroppableElement : function(elDroppable) {
		if (this._waOveredDroppableElement.indexOf(elDroppable) == -1) {
			this._waOveredDroppableElement.push(elDroppable);
			this.fireEvent('over', { 
				elHandle : this._elHandle,
				elDrag : this._elDragging, 
				elDrop : elDroppable  
			});
		}
	},
	
	_fireMoveEvent : function(elDroppable, oRect, oPos, we) {
		var nRatioX = (oPos.pageX - oRect.nLeft) / (oRect.nRight - oRect.nLeft);
		var nRatioY = (oPos.pageY - oRect.nTop) / (oRect.nBottom - oRect.nTop);
		
		this.fireEvent('move', {
			weEvent : we,
			elHandle : this._elHandle,
			elDrag : this._elDragging, 
			elDrop : elDroppable, 
			nRatioX : nRatioX,
			nRatioY : nRatioY
		});
	},

	_removeOveredDroppableElement : function(elDroppable) {
		var nIndex = this._waOveredDroppableElement.indexOf(elDroppable);
		if (nIndex != -1) {
			this._waOveredDroppableElement.splice(nIndex, 1);
			this.fireEvent('out', { 
				elHandle : this._elHandle,
				elDrag : this._elDragging, 
				elDrop : elDroppable  
			});
		}
	},
	
	_clearOveredDroppableElement : function(weEvent, bInterupted) {
		if (bInterupted) {
			this._waOveredDroppableElement.empty();
			return;
		}
		for (var elDroppable; (elDroppable = this._waOveredDroppableElement.$value()[0]); ) {
			this._waOveredDroppableElement.splice(0, 1);
			this.fireEvent('drop', {
				weEvent : weEvent,
				elHandle : this._elHandle,
				elDrag : this._elDragging, 
				elDrop : elDroppable 
			});
		}
	},
	
	/**
	 * Drag되고 있는 채, 마우스가 올라간 엘리먼트의 리스트를 구함
	 * @return {Array} 겹쳐진 엘리먼트 
	 */
	getOveredLists : function() {
		return this._waOveredDroppableElement ? this._waOveredDroppableElement.$value() : [];
	},
	
	_isChildOfDropArea : function(el) {
		if (this._el === document || this._el === el){
			return true;
		} 
		return this._wel.isParentOf(el);
	},
	
	_findDroppableElement : function(el) {
		var sClass = '.' + this.option('sClassName');
		var elDroppable = jindo.$$.test(el, sClass) ? el : jindo.$$.getSingle('! ' + sClass, el);
		if (!this._isChildOfDropArea(el)) { //기준 엘리먼트가 document인 경우 Magnetic일때 문서밖으로 커서이동시 event 발생!
			elDroppable = null;
		}
		return elDroppable;
	},
	
	_onMouseMove : function(we) {
		var oDrag = this.option('oDragInstance');
		if (oDrag && oDrag.isDragging()){
			var oPos = we.pos();
			if (we.element == this._elDragging) { //Magnetic
				var aItem = this._aItem;
				var aItemRect = this._aItemRect;
				
				for (var i = 0, htRect, el; ((htRect = aItemRect[i]) && (el = aItem[i])); i++) {
					if ( htRect.nLeft <= oPos.pageX && oPos.pageX <= htRect.nRight && htRect.nTop <= oPos.pageY && oPos.pageY <= htRect.nBottom ) {
						this._addOveredDroppableElement(el);
						this._fireMoveEvent(el, htRect, oPos, we);
					} else {
						this._removeOveredDroppableElement(el);
					}
				}
			} else { //Pointing
				var elDroppable = this._findDroppableElement(we.element);
				if (!elDroppable) {
					return;
				} 
			
				this._addOveredDroppableElement(elDroppable);
			
				var htOffset = jindo.$Element(elDroppable).offset();
				var htArea = {
					"nLeft" : htOffset.left,
					"nTop" : htOffset.top,
					"nRight" : htOffset.left + elDroppable.offsetWidth,
					"nBottom" : htOffset.top + elDroppable.offsetHeight
				};
		
				if ( htArea.nLeft <= oPos.pageX && oPos.pageX <= htArea.nRight && htArea.nTop <= oPos.pageY && oPos.pageY <= htArea.nBottom ) {
					this._fireMoveEvent(elDroppable, htArea, oPos, we);
				}
			}
		}
	},
	
	_onMouseOver : function(we) {
		var elDroppable = this._findDroppableElement(we.element);
		if (elDroppable) {
			this._addOveredDroppableElement(elDroppable);
		}
	},
	
	_onMouseOut : function(we) {
		var elDroppable = this._findDroppableElement(we.element);
		if (elDroppable && we.relatedElement && !jindo.$Element(we.relatedElement).isChildOf(we.element)) {
			this._removeOveredDroppableElement(elDroppable);
		}
	},
	
	_getRectInfo : function(el) {
		var htOffset = jindo.$Element(el).offset();	
		return {
			nLeft : htOffset.left,
			nTop : htOffset.top,
			nRight : htOffset.left + el.offsetWidth,
			nBottom : htOffset.top + el.offsetHeight
		};
	},
	
	_reCalculate : function() {
		var aItem = jindo.$$('.' + this.option('sClassName'), this._el);
			
		if (this._el.tagName && jindo.$$.test(this._el, '.' + this.option('sClassName'))) {
			aItem.push(this._el);
		}
		
		this._aItem = aItem;
		this._aItemRect = [];
		
		for (var i = 0, el; (el = aItem[i]); i++) {
			this._aItemRect.push(this._getRectInfo(el));
		}
	}
}).extend(jindo.Component);

/**
 * @fileOverview js파일을 동적으로 로드하는 컴포넌트
 * @author senxation
 * @version 0.1.1
 */

/**
 * @namespace
 */
jindo.LazyLoading = {
	_aUrl : []
};

/**
 * js파일을 동적으로 로드한다.
 * @param {String} sUrl 로드할 js파일의 경로
 * @param {Function} fCallback js파일 로드 완료후 실행할 콜백함수
 * @param {String} sCharset 문자셋 (default "utf-8", 생략가능)
 * @remark 이미 로드된 파일은 다시 로드하지 않지만, 콜백함수(fCallback)는 이미 로드되어 있더라도 수행된다.   
 */
jindo.LazyLoading.load = function(sUrl, fCallback, sCharset) {
	if (typeof fCallback != "function") {
		fCallback = function(){};
	}
	if (this._checkAlreadyLoaded(sUrl)) {
		fCallback();
		return;
	}
	
	var self = this;
	var elHead = document.getElementsByTagName("head")[0]; 
	var elScript = document.createElement("script");
	elScript.type = "text/javascript";
	elScript.charset = sCharset || "utf-8";
	elScript.src = sUrl;
	if (jindo.$Agent().navigator().ie) {
		elScript.onreadystatechange = function() {
		    if(this.readyState == "complete" || this.readyState == "loaded") {
				self._aUrl.push(sUrl);
				fCallback();
				this.onreadystatechange = null;
		    }
		};		
	} else {
		elScript.onload = function() {
			self._aUrl.push(sUrl);
			fCallback();
		};
	}
	elHead.appendChild(elScript);
};

jindo.LazyLoading._checkAlreadyLoaded = function(sUrl) {
	return jindo.$A(this._aUrl).has(sUrl);
};

/**
 * 로드된 js파일 URL의 배열을 가져온다.
 * @return {Array} URL의 배열
 */
jindo.LazyLoading.getLoaded = function() {
	return this._aUrl;
};
/**
 * 마우스 제스쳐 컴포넌트
 *
 * @name jindo.MouseGesture
 * @author TarauS
 * @version 0.1
 */
jindo.MouseGesture = jindo.$Class({
	/**
	 * @lends jindo.MouseGesture.prototype
	 */

	/**
	 * 라인이 그려질 캔버스 객체
	 * @type {Element}
	 */
	_elCanvas : null,
	/**
	 * Canvas Element의 Drawing Context
	 * @type {Object}
	 */
	_oDC : null,
	/**
	 * 이벤트 핸들러 저장 객체
	 * @type {HashTable}
	 */
	_htEventHandler : {},
	/**
	 * 사용자의 마우스가 움직인 점의 목록
	 * @type {Array}
	 */
	_aPointList : [],
	/**
	 * 저장된 점의 개수
	 * @type {Number}
	 */
	_nPointCount : 0,
	/**
	 * 라인을 그리는 방법 (vml, canvas)
	 * @type {String}
	 */
	_sDrawingType : "",
	/**
	 * 모바일 사파리인지를 저장하는 변수
	 * @type {Boolean}
	 */
	_bMobileSafari : false,

	/**
	 * @constructs
	 * @class Mouse Gesture
	 * @param {HashTable} [htOption] 초기화 옵션 객체
	 * @extends jindo.Component
	 * @example
	 * var oMouseGestureInstance = new jindo.MouseGesture({
	 *     "sLineColor" : "#FF0000",   // 라인 컬러
	 *     "nLineThickness" : 5,       // 라인 두께
	 *     "nFilteringDistance" : 10,  // 유효 분석 거리 (두 점 사이의 간격이, 이 값 이상일 때만 분석 데이터로 사용)
	 *     "elTargetWindow" : window   // 라인이 그려질 윈도우 객체
	 * });
	 *
	 * oMouseGestureInstance.attach("gesture", function(oGestureEvent){
	 *     console.log(oGestureEvent.sCode, oGestureEvent.aCodeList);
	 *     for(var i=0; i<eGesture.aCodeList.length; i++){
	 *         switch(eGesture.aCodeList[i]){
	 *         case 1: sCode += "↗";break;
	 *         case 2: sCode += "→";break;
	 *         case 3: sCode += "↘";break;
	 *         case 4: sCode += "↓";break;
	 *         case 5: sCode += "↙";break;
	 *         case 6: sCode += "←";break;
	 *         case 7: sCode += "↖";break;
	 *         case 8: sCode += "↑";break;
	 *         }
	 *     }
	 *     console.log("result" : sCode);
	 * }
	 */
	$init : function(htOption){
		// 기본 옵션 설정
		this.option({
			"sLineColor" : "#FF0000",
			"nLineThickness" : 5,
			"nFilteringDistance" : 10,
			"elTargetWindow" : window
		});
		// 사용자 옵션 설정
		this.option(htOption);

		// 마우스 다운 이벤트 핸들러 등록 (모바일 사파리는 터치 이벤트 등록)
		var sUserAgent = window.navigator.userAgent.toLowerCase();
		this._bMobileSafari = (/mobile/.test(sUserAgent) && /safari/.test(sUserAgent)) || /iphone/.test(sUserAgent);
		this._htEventHandler["mouse_down"] = jindo.$Fn(this._onMouseDown, this).attach(this.option("elTargetWindow").document, this._bMobileSafari ? "touchstart" : "mousedown", true);

		// 캔버스 생성
		this._createCanvas();
	},

	/**
	 * 캔버스 생성 함수
	 * - IE의 경우에는 VML을 위한 네임 스페이스를 정의하고, VML Element들을 위치시킬 DIV Element를 생성
	 * - IE 외의 CanvasAPI를 지원하는 경우에는, Canvas Element를 생성
	 */
	_createCanvas : function(){
		if(jindo.$Agent().navigator().ie){
			// 네임 스페이스 생성
			if(!this.option("elTargetWindow").document.namespaces["vml_nhn"]){
				this.option("elTargetWindow").document.namespaces.add("vml_nhn", "urn:schemas-microsoft-com:vml");
			}
			// VML을 위한 스타일 정의
			var elStyle = this.option("elTargetWindow").document.createStyleSheet();
			elStyle.cssText = "vml_nhn\\:shape, vml_nhn\\:stroke {behavior:url(#default#VML); display:inline-block; position:absolute;width:1px;height:1px;};";
			this._elCanvas = jindo.$("<div>");
			this._sDrawingType = "vml";
		}else{
			// Canvas Element 생성
			this._elCanvas = jindo.$("<canvas>");
			this._oDC = this._elCanvas.getContext("2d");
			this._sDrawingType = "canvas";
			this._oDC.globalCompositeOperation = "destination-over";
		}
		jindo.$Element(this._elCanvas).css({"position":"absolute", "top" : "0px", "left" : "0px"}).hide().appendTo(this.option("elTargetWindow").document.body);
	},

	/**
	 * 생성된 캔버스 엘리먼트를 화면에 표시하는 함수
	 */
	_showCanvas : function(){
		var htDocumentSize = jindo.$Document(this.option("elTargetWindow").document).clientSize();
		var htScrollPosition = jindo.$Document(this.option("elTargetWindow").document).scrollPosition();
		
		if(this._sDrawingType == "canvas"){
			this._elCanvas.width = htDocumentSize.width;
			this._elCanvas.height = htDocumentSize.height;
		}

		// 캔버스의 크기를 브라우저의 크기게 맞게 조정
		jindo.$Element(this._elCanvas).css({"top" : htScrollPosition.top +"px", "width" : htDocumentSize.width+"px", "height" : htDocumentSize.height+"px", "zIndex" : 999999}).show();
	},

	// 화면에 표시된 캔버스 엘리먼트를 감추고, 그려진 내용을 초기화하는 함수
	_hideCanvas : function(){
		if(this._elCanvas){
			if(this._sDrawingType == "vml"){
				this._elCanvas.innerHTML = "";
			}else if(this._sDrawingType == "canvas"){
				this._oDC.beginPath();
				this._oDC.clearRect(0, 0, this._elCanvas.offsetWidth, this._elCanvas.offsetHeight);
				this._oDC.closePath();
			}
			jindo.$Element(this._elCanvas).hide();
		}
	},

	/**
	 * 캔버스 엘리먼트에 두 점의 좌표를 이용하여 라인을 그리는 함수
	 *
	 * @param {HashTable} htStartPosition 시작 점의 좌표 정보를 가진 객체 ({nX : 123, nY:123})
	 * @param {HashTable} htEndPosition 끝 점의 좌표 정보를 가진 객체 ({nX : 456, nY:456})
	 */
	_drawLine : function(htStartPosition, htEndPosition){
		// VML을 이용하여 라인을 그림
		if(this._sDrawingType == "vml"){
			var sPath = " m "+(htStartPosition.nX*1-5)+","+(htStartPosition.nY*1-5)+" l "+(htEndPosition.nX*1-5)+","+(htEndPosition.nY*1-5);
			var sHTML = '<vml_nhn:shape coordsize="1 1" strokeweight="'+this.option("nLineThickness")+'pt" strokecolor="'+this.option("sLineColor")+'" path="'+sPath+'"><vml_nhn:stroke endcap="round" /></vml_nhn:shape>';
			this._elCanvas.insertAdjacentHTML("BeforeEnd",sHTML);
		// 캔버스 API를 이용하여 라인을 그림
		}else if(this._sDrawingType == "canvas"){
			this._oDC.save();
			this._oDC.beginPath();
			this._oDC.lineCap = "round";
			this._oDC.lineWidth = this.option("nLineThickness") + 2;
			this._oDC.strokeStyle = this.option("sLineColor");
			this._oDC.moveTo(htStartPosition.nX,htStartPosition.nY);
			this._oDC.lineTo(htEndPosition.nX,htEndPosition.nY);
			this._oDC.stroke();
			this._oDC.closePath();
			this._oDC.restore();
		}
	},

	/**
	 * 이벤트 객체로부터 이벤트가 발생한 좌표 정보를 계산하여, 좌표 목록 배열에 저장하고, 계산된 좌표를 리턴하는 함수
	 * - 모바일 버전의 사파리의 경우에는, 터치 이벤트에 대한 좌표 정보를 계산
	 * - 위의 경우가 아닌 경우에는 pos() 함수를 이용하여 계산
	 *
	 * @param {WrappingEvent} weTarget 좌표를 계산할 이벤트 객체
	 * @return {HashTable} 좌표 정보를 저장하고 있는 객체
	 */
	_addPointList : function(weTarget){
		// 좌표 정보를 계산
		var htPosition;
		if(this._bMobileSafari){
			htPosition = {
				"pageX": weTarget._event.targetTouches[0].clientX,
				"pageY": weTarget._event.targetTouches[0].clientY
			};
		}else{
			htPosition = weTarget.pos();
		}

		// 결과 객체 생성
		var htResult = {
			"nX": htPosition.clientX,
			"nY": htPosition.clientY
		};

		// 좌표 정보 저장 배열에 추가
		this._aPointList.push(htResult);
		this._nPointCount++;

		return htResult;
	},

	/**
	 * MouseDown 이벤트 핸들러
	 * - MouseMove 및 MouseUp 이벤트 핸들러 등록
	 * - MouseDown 이벤트가 발생한 좌표 저장
	 *
	 * @param {WrappingEvent} weMouseDown 마우스 다운 이벤트 객체
	 */
	_onMouseDown : function(weMouseDown){
		if(weMouseDown.mouse().right || this._bMobileSafari){
			weMouseDown.stop();
			// 이벤트가 발생한 좌표 정보를 저장
			this._addPointList(weMouseDown);
			// 이벤트 핸들러 등록
			this._htEventHandler["mouse_move"] = jindo.$Fn(this._onMouseMove, this).attach(this.option("elTargetWindow").document, this._bMobileSafari ? "touchmove" : "mousemove");
			this._htEventHandler["mouse_up"] = jindo.$Fn(this._onMouseUp, this).attach(this.option("elTargetWindow").document, this._bMobileSafari ? "touchend" : "mouseup");
			// setCapture() 수행 (IE에서 로딩된 플래시 객체 위에서 이벤트 처리를 하기 위한 목적)
			if(this._sDrawingType == "vml"){
				this.option("elTargetWindow").document.body.setCapture();
			}
		}
	},

	/**
	 * MouseMove 이벤트 핸들러
	 * - 첫 이동일 경우, 감춰진 캔버스를 보여지도록 설정
	 * - MouseMove 이벤트가 발생한 좌표와, 바로 전에 저장된 좌표를 이용하여 라인을 그림
	 *
	 * @param {WrappingEvent} weMouseMove 마우스 무브 이벤트 겍체
	 */
	_onMouseMove : function(weMouseMove){
		// 이벤트가 발생한 좌표 정보를 저장
		var htPosition = this._addPointList(weMouseMove);

		if(this._nPointCount === 2){
			this._showCanvas();
		}

		// 두 점을 이용하여 라인을 그림
		if(this._nPointCount % 2){ // VML로 그릴 때, 느려지는 현상이 있어 2번에 1번 꼴로 라인을 그리도록 함
			this._drawLine({
				"nX": this._aPointList[this._nPointCount - 3]["nX"],
				"nY": this._aPointList[this._nPointCount - 3]["nY"]
			}, htPosition);
		}
	},

	/**
	 * 저장된 좌표 정보를 바탕으로 사용자의 마우스 이동 방향을 계산하여 리턴하는 함수
	 * - 두 점의 거리가 옵션의 nFilteringDistance보다 작은 경우에는 계산에서 제외 시킴
	 * - 두 점의 기울기를 바탕으로 방향을 결정
	 * - 중복된 방향 값을 제거
	 *
	 * @return {HashTable} 최종 계산된 방향 정보 객체
	 */
	_recognitionGesture : function(){
		var nX, nY, nBeforeX, nBeforeY, nGradient, nAbsGradient, nResult, nDistance;
		var aFilteredList = [], aResult = [];
		var nBaseGradient1 = Math.tan(22.5 * Math.PI / 180);
		var nBaseGradient2 = Math.tan(67.5 * Math.PI / 180);

		// 저장된 좌표들을 루프를 돔
		for(var i=1; i<this._aPointList.length; i++){
			nX = this._aPointList[i]["nX"];
			nY = this._aPointList[i]["nY"];
			nBeforeX = this._aPointList[i-1]["nX"];
			nBeforeY = this._aPointList[i-1]["nY"];
			nDistance = Math.sqrt(Math.pow(nY - nBeforeY, 2) + Math.pow(nX - nBeforeX, 2));

			// 두 점의 거리(nDistance)가 옵션에 정의된 nFilteringDistance 보다 큰 경우에만 기울기를 계산
			if(nDistance > this.option("nFilteringDistance")){// || aResultList[aResultList.length-1] != nResult){
				// 두 점의 기본 기울기를 계산
				nGradient = -(nY - nBeforeY) / (nX - nBeforeX);
				nAbsGradient = Math.abs(nGradient);

				// 두 점의 기울기와 좌표 정보를 이용하여, 두 점의 방향을 계산 함
				if(nAbsGradient >= nBaseGradient2){
					if(nY < nBeforeY){
						nResult = 8;
					}else{
						nResult = 4;
					}
				}else if(nAbsGradient < nBaseGradient1){
					if(nX < nBeforeX){
						nResult = 6;
					}else{
						nResult = 2;
					}
				}else if(nAbsGradient >= nBaseGradient1 && nAbsGradient < nBaseGradient2){
					if(nGradient > 0){
						nResult = 1;
					}else{
						nResult = 3;
					}
					if(nX < nBeforeX){
						nResult += 4;
					}
				}
				aFilteredList.push(nResult);
			}
		}
		
		// 필터링 및 기본 방향 계산이 끝난 데이터를 루프를 돌며, 중복된 값을 제거
		for(i=1; i<aFilteredList.length; i++){
			if(aResult.length === 0){
				aResult.push(aFilteredList[i]);
			}else{
				if(aResult[aResult.length-1] != aFilteredList[i]){
					aResult.push(aFilteredList[i]);
				}
			}
		}
		
		// 최종 계산된 결과를 리턴
		return {
			"aCodeList" : aResult,
			"sCode" : aResult.join("")
		};
	},

	/**
	 * MouseUp 이벤트 핸들러
	 * - 등록된 이벤트 핸들러 해제
	 * - 켄텍스트 메뉴에 대한 이벤트 핸들러 복원
	 * - 저장된 좌표 정보를 바탕으로, 점들의 방향값들을 구하여, gesture 이벤트 발생
	 * - 변수 초기화 및 캔버스 감추기
	 *
	 * @param {WrappingEvent} weMouseUp 마우스 업 이벤트 객체
	 */
	_onMouseUp : function(weEvent){
		if(weEvent.mouse().right || this._bMobileSafari){
			weEvent.stop();

			// 등록된 이벤트 핸들러 해제
			if(this._htEventHandler["mouse_move"]){
				this._htEventHandler["mouse_move"].detach(this.option("elTargetWindow").document, this._bMobileSafari ? "touchmove" : "mousemove");
			}
			
			if(this._htEventHandler["mouse_up"]){
				this._htEventHandler["mouse_up"].detach(this.option("elTargetWindow").document, this._bMobileSafari ? "touchend" : "mouseup");
			}
			
			// 컨텍스트 메뉴에 대한 이벤트 핸들러 복원
			if(this._aPointList.length && !this._bMobileSafari){
				this._htEventHandler["setted_context_menu"] = this.option("elTargetWindow").document.oncontextmenu;
				this.option("elTargetWindow").document.oncontextmenu = function(){return false;};
				setTimeout(jindo.$Fn(function(){this.option("elTargetWindow").document.oncontextmenu = this._htEventHandler["setted_context_menu"];}, this).bind(), 1);
			}
			
			// releaseCapture() 수행
			if(this._sDrawingType == "vml"){
				this.option("elTargetWindow").document.body.releaseCapture();
			}
			
			// 저장된 좌표 정보를 바탕으로 방향값을 계산하여 커스텀 이벤트 발생
			var htResult = this._recognitionGesture();
			if(htResult.sCode){
				this.fireEvent("gesture", htResult);
			}
	
			// 초기화
			this._nPointCount = 0;
			this._aPointList = [];
			this._hideCanvas();
		}
	},

	/**
	 * 컴포넌트 소멸자
	 */
	destroy : function(){
		jindo.$Element(this._elCanvas).leave();
		this._elCanvas = null;
		this._oDC = null;
		this._htEventHandler = null;
		this._nPointcount = null;
		this._aPointList = null;
		this._sDrawingType = null;
		this._bMobileSafari = null;
	}
}).extend(jindo.Component);
/**
 * @fileOverview 목록을 순환이동하는 롤링 컴포넌트
 * @author hooriza, modified by senxation
 * @version 0.4.1
 */
jindo.CircularRolling = jindo.$Class({
	/** @lends jindo.CircularRolling.prototype */
	/**
	 * 컴포넌트를 생성한다.
	 * 순환 롤링 컴포넌트는 moveBy 메소드만을 이용해서 롤링하여야한다.
	 * @remark 순환 롤링 컴포넌트는 리스트내의 아이템을 복제하여 무한의 리스트처럼 보이게 동작하므로 상속한 jindo.Rolling의 모든 메소드들을 동일하게 사용할 수 없고 이동을 위해서 moveBy 메소드를 사용해야 한다.
	 * @constructs
	 * @class 목록을 순환이동하는 롤링 컴포넌트
	 * @extends jindo.Rolling
	 * @see jindo.Rolling
	 */			 
	$init : function() {
		this._nItemCount = this.getItems().length;
		this._nDisplayedCount = this.getDisplayedItemCount();
		
		var welList = jindo.$Element(this._elList);
		jindo.$A(jindo.$$('> li', this._duplicate())).forEach(function(elItem){
			welList.append(elItem);
		});
		jindo.$A(jindo.$$('> li', this._duplicate())).forEach(function(elItem){
			welList.append(elItem);
		});
	},
	
	_duplicate : function() {
		var elDuplicatedList = jindo.$('<ul>');
		elDuplicatedList.innerHTML = this._elList.innerHTML;		
		return elDuplicatedList;
	},
	
	_setStartPosition : function(n, nTo) {
		var oKeys = this._oKeys;
		var nNewPosition = n % (this._nItemCount);
		if (0 > nTo) {
			nNewPosition += this._nItemCount * 2;
		}
		
		this._el[oKeys.scrollLeft] = this._getPosition(nNewPosition);
	},
	
	/**
	 * 현재 위치와 n만큼 떨어진 아이템으로 이동한다.
	 * 롤링이 진행중일때에는 이동되지 않고 false를 리턴한다.
	 * @param {Number} n
	 * @return {Boolean} 성공여부
	 */
	moveBy : function(n) {
		if (this.isMoving()) {
			return false;
		}
		
		if (Math.abs(n) > this._nDisplayedCount) {
			if (n > 0) {
				n = this._nDisplayedCount;
			} else {
				n = -this._nDisplayedCount;
			}
		}
		
		this._setStartPosition(this.getIndex(), n);
		
		var nTarget = this.getIndex() + n;
		if (!this._move(nTarget)) {
			return false;
		}
		return true;
	}

}).extend(jindo.Rolling);

/**
 * @fileOverview 다수의 Ajax 요청을 병렬 또는 직렬방식으로 요청하고 응답을 처리하는 컴포넌트 
 * @author senxation
 * @version 0.2.1
 */

jindo.MultipleAjaxRequest = jindo.$Class({
	/** @lends jindo.MultipleAjaxRequest.prototype */
	
	_bIsRequesting : false,
	
	/**
	 * 컴포넌트를 생성한다.
	 * @constructs
	 * @class 다수의 Ajax 요청을 병렬 또는 직렬방식으로 요청하고 응답을 처리하는 컴포넌트
	 * @param {HashTable} htOption 옵션 Hash Table
	 * @extends jindo.Component
	 * @example
var oMultipleAjaxRequest = new jindo.MultipleAjaxRequest({ 
	sMode : "parallel" //요청 방식. 기본은 병렬로 요청. "serial"일 경우 직렬로 요청
}).attach({
	start: function(oCustomEvent) {
		//요청이 시작될 때 발생
		//전달되는 커스텀이벤트 객체 oCustomEvent = {
		//	aAjax : (Array) request() 메소드에 전달되었던 aAjax 배열 
		//	htMetaData : (HashTable) request() 메소드에 전달되었던 htMetaData
		//}
	},
	beforeEachRequest: function(oCustomEvent){
		//각각의 요청 이전에 발생
		//전달되는 커스텀이벤트 객체 oCustomEvent = {
		//	oAjax : (jindo.$Ajax) 해당 요청의 jindo.$Ajax 객체 
		//	nIndex : (Number) 요청 순서
		//}
	},
	afterEachResponse: function(oCustomEvent){
		//각각의 응답 이후에 발생
		//전달되는 커스텀이벤트 객체 oCustomEvent = {
		//	oAjax : (jindo.$Ajax) 해당 요청의 jindo.$Ajax 객체 
		//	nIndex : (Number) 요청 순서
		//}
	},
	complete: function(oCustomEvent){
		//모든 응답이 완료된 이후에 발생
		//전달되는 커스텀이벤트 객체 oCustomEvent = {
		//	aResponse : (Array) 모든 요청의 jindo.$Ajax.Response 객체의 배열
		//	htMetaData : (HashTable) request메소드에서 선언한 Hash Table 
		//}
		
	}
});
	 */
	$init : function(htOption){
		var htDefaultOption = {
			sMode : "parallel" //기본은 병렬로 요청. "serial"일 경우 직렬로 요청
		};
		this.option(htDefaultOption);
		this.option(htOption);
	},
	
	/**
	 * 요청이 진행중인지 여부를 가져온다.
	 * @return {Boolean} 요청 진행 여부
	 */
	isRequesting : function() {
		return this._bIsRequesting;
	},
	
	/**
	 * 요청을 수행한다.
	 * @param {Array} aAjax 요청을 위한 정보를 담은 Hash Table의 배열
	 * @param {HashTable} complete 커스텀이벤트에 전달될 Hash Table
	 * @return {Boolean} 요청이 성공적으로 시작되었는지 여부
	 * @example
var oAjax1 = {
	sUrl : "1.js", //요청할 URL
	htOption : { //jindo.$Ajax의 option객체 (jindo.$Ajax 참고)
		type : "xhr",
		method : "get"
	},
	htParameter : null //jindo.$Ajax.request를 수행시 전달할 파라메터 Hash Table 객체
};

var htAjax2 = {
	sUrl : "22.js",
	htOption : {
		type : "xhr",
		method : "get"
	},
	htParameter : null
};

var htAjax3 = {
	sUrl : "3.js",
	htOption : {
		type : "xhr",
		method : "get"
	},
	htParameter : null
};

oMultipleAjaxRequest.request([htAjax1, htAjax2, htAjaxhtAjax sRequestName : "요청이름" });
	 */
	request : function(aAjax, htMetaData) {
		if (this.isRequesting()) { //요청이 진행중이면 중단한다.
			return false;
		}
		if (!(aAjax instanceof Array)) {
			aAjax = [aAjax];
		}
		if (typeof htMetaData == "undefined") {
			htMetaData = {};
		}
		this._htMetaData = htMetaData;
		
		switch (this.option("sMode")) {
			case "parallel" :
				this._parallelRequest(aAjax);
				break;	
			case "serial" :
				this._serialRequest(aAjax);
				break;
			default :
				return false;
		}
		return true;
	},
	
	_fireEventStart : function() {
		this._bIsRequesting = true;
		
		if (this.fireEvent("start", {
			aAjax : this._aAjax,
			htMetaData : this._htMetaData
		})) {
			return true;
		} else {
			this.abort();
			return false;
		}
	},
	
	_fireEventBeforeEachRequest : function(nIndex) {
		if (this.fireEvent("beforeEachRequest", {
			oAjax: this._aAjax[nIndex],
			nIndex : nIndex
		})) {
			return true;
		} else {
			this.abort();
			return false;
		}
	},
	
	_fireEventAfterEachResponse : function(nIndex) {
		if (this.fireEvent("afterEachResponse", {
			oAjax: this._aAjax[nIndex],
			nIndex : nIndex
		})) {
			return true;
		} else {
			this.abort();
			return false;
		}
	},
	
	/**
	 * 병렬 요청
	 * @param {Array} aAjax
	 * @ignore
	 */
	_parallelRequest : function(aAjax) {
		this._aAjaxData = aAjax;
		
		this._aAjax = []; //Ajax 객체의 배열
		this._aStatus = []; //요청을 보냈는지 여부
		this._aStatus.length = aAjax.length;
		this._aResponse = []; //응답객체
		
		if (this._fireEventStart()) {
			var self = this;
			jindo.$A(this._aAjaxData).forEach(function(htAjax, i){
				var fParallelResponseHandler = function(oResponse){
					oResponse._constructor = self._aAjax[i];
					var nIndex = self._findAjaxObjectIndexOfResponse(oResponse._constructor);
					self._aResponse[nIndex] = oResponse;
					self._aStatus[nIndex] = true;
					
					if (self._fireEventAfterEachResponse(nIndex)) {
						if (self._hasCompletedGotResponsesOfParallelResponses()) {
							self._complete();
						}	
					}
				};
				self._aAjax.push(jindo.$Ajax(htAjax.sUrl, htAjax.htOption));
				htAjax.htOption.onload = fParallelResponseHandler;
				htAjax.htOption.onerror = fParallelResponseHandler;
				htAjax.htOption.ontimeout = fParallelResponseHandler;
				self._aAjax[i].option(htAjax.htOption);
				
				if (self._fireEventBeforeEachRequest(i)){
					self._aAjax[i].request(htAjax.htParameter);	
				} else {
					jindo.$A.Break();
				}
			});
		}
		
	},
	
	/**
	 * 병렬 요청시 응답이 몇번째 Ajax 요청에 대한 응답인지 찾는다.
	 * @param {Object} oAjax
	 * @return {Number}
	 */
	_findAjaxObjectIndexOfResponse : function(oAjax) {
		return jindo.$A(this._aAjax).indexOf(oAjax);
	},
	
	/**
	 * 병렬 요청의 응답이 모두 완료되었는지 확인한다.
	 */
	_hasCompletedGotResponsesOfParallelResponses : function() {
		var bResult = true;
		jindo.$A(this._aStatus).forEach(function(bStatus){
			if (!bStatus) {
				bResult = false;
				jindo.$A.Break();
			} 
		});
		return bResult;
	},
	
	/**
	 * 직렬 요청
	 * @param {Array} aAjax
	 * @ignore
	 */
	_serialRequest : function(aAjax) {
		this._aAjaxData = aAjax;
		
		this._aAjax = []; //Ajax 객체의 배열
		this._aStatus = []; //요청을 보냈는지 여부
		this._aStatus.length = aAjax.length;
		this._aResponse = []; //응답객체
		
		var self = this;
		jindo.$A(this._aAjaxData).forEach(function(htAjax, i){
			var fSerialRequestHandler = function(e){
				e._constructor = self._aAjax[i];
				self._aResponse.push(e);
				self._serialRequestNext();
			};
			self._aAjax.push(jindo.$Ajax(htAjax.sUrl, htAjax.htOption));
			htAjax.htOption.onload = fSerialRequestHandler;
			htAjax.htOption.onerror = fSerialRequestHandler;
			htAjax.htOption.ontimeout = fSerialRequestHandler;
			self._aAjax[i].option(htAjax.htOption);
		});
		
		if (this._fireEventStart()) {
			if (this._fireEventBeforeEachRequest(0)) {
				this._aAjax[0].request(this._aAjaxData[0].htParameter);
				this._aStatus[0] = true;
			}
		}
	},
	
	/**
	 * 직렬 요청시 다음 요청을 수행하거나 응답 완료
	 * @param {Array} aAjax
	 * @ignore
	 */
	_serialRequestNext : function() {
		var nIndex = -1;
		for (var i = 0; i < this._aStatus.length; i++) {
			if(!this._aStatus[i]) {
				this._aStatus[i] = true;
				nIndex = i;
				break;
			}
		}
		
		if (nIndex > 0) {
			if (this._fireEventAfterEachResponse(nIndex - 1)) {
				if (this._fireEventBeforeEachRequest(nIndex)) {
					this._aAjax[nIndex].request(this._aAjaxData[nIndex].htParameter);
				}
			}
		} else if (nIndex == -1) {
			if (this._fireEventAfterEachResponse(this._aStatus.length - 1)) {
				this._complete();
			}
		}
	},
	
	/**
	 * 요청정보들을 초기화한다.
	 * @ignore
	 */
	_reset : function() {
		this._aAjaxData.length = 0;
		this._aAjax.length = 0;
		this._aStatus.length = 0;
		this._aResponse.length = 0;
		this._htMetaData = null;
		
		delete this._aAjaxData;
		delete this._aAjax;
		delete this._aStatus;
		delete this._aResponse;
		delete this._htMetaData;
		
		this._bIsRequesting = false;
	},
	
	/**
	 * 요청을 중단한다.
	 * @remark 다수의 요청중에 현재까지의 모든 요청이 중단되고, 수행되지 않은 요청은 더 이상 진행되지 않는다.
	 */
	abort : function() {
		jindo.$A(this._aAjax).forEach(function(oAjax){
			oAjax.abort();
		});
		this._reset();
	},
	
	/**
	 * 응답이 완료되었을때 수행되어 완료 이벤트(complete)를 발생
	 * @ignore
	 */
	_complete : function() {
		var aResponse = this._aResponse.concat(),
			htMetaData = {},
			sProp;
		for (sProp in this._htMetaData) {
			htMetaData[sProp] = this._htMetaData[sProp];
		}
		
		this._reset();
		
		this.fireEvent("complete", {
			aResponse : aResponse,
			htMetaData : htMetaData
		});	
	}

}).extend(jindo.Component);	
/**
 * @fileOverview 체크박스나 라디오버튼의 디자인을 대체하기 위한 HTML Component 
 * @author hooriza, modified by senxation
 * @version 0.5.2
 */

jindo.CheckBox = jindo.$Class({
	/** @lends jindo.CheckBox */
	sTagName : 'input[type=checkbox]', //'input[type=radio]'
	
	/**
	 * CheckBox 컴포넌트를 생성한다.
	 * @constructs
	 * @class 체크박스나 라디오버튼의 디자인을 대체하기 위한 HTML Component 
	 * @extends jindo.HTMLComponent
	 * @param {String | HTMLElement} el input[type=checkbox] 또는 input[type=radio]를 감싸고 있는 엘리먼트 혹은 그 id
	 * @param {HashTable} htOption 옵션 객체
	 * @example

<span id="ajax_checkbox">
	<span class="ajax_checkbox_mark"></span><input type="checkbox" name="c" id="c1" />
</span> 
<label for="c1">첫번째</label>

<script type="text/javascript" language="javascript">
	var oCheckBox = jindo.CheckBox(jindo.$('ajax_checkbox'), { sClassPrefix : 'checkbox-' }).attach({
		beforeChange : function(oCustomEvent) {
			//전달되는 이벤트객체 oCustomEvent = {
			//	bChecked : (Boolean) 체크 여부
			//}
			//oCustomEvent.stop(); 수행시 체크/해제 되지 않음
		},
		change : function(oCustomEvent) {
			//전달되는 이벤트객체 oCustomEvent = {
			//	bChecked : (Boolean) 체크 여부
			//}
		}
	});
</script>
	 * @remark input[type=checkbox], input[type=radio]에 이벤트를 직접 바인딩해서 사용할 경우 제대로 동작하지 않음
	 */
	
	$init : function(el, htOption) {
		this.option({
			sClassPrefix : 'checkbox-'
		});
		
		this.option(htOption || {});

		this._elWrapper = jindo.$(el);
		this._welWrapper = jindo.$Element(el);
		this._assignHTMLElements();
		
		this.wfOnClickInput = jindo.$Fn(this._onClickInput, this);
		this.wfOnClickWrapper = jindo.$Fn(this._onClickWrapper, this);
		this.wfOnFocusInput = jindo.$Fn(this._onFocusInput, this);
		this.wfOnBlurInput = jindo.$Fn(this._onBlurInput, this);
		
		this.activate();
		this.paint();
	},
	
	_assignHTMLElements : function() {
		var elWrapper = this._elWrapper;
		/**
		 * 해당 input[type=checkbox] 엘리먼트
		 * @ignore
		 */
		this._elInput = jindo.$$.getSingle('input', elWrapper);
		/**
		 * 해당 input[type=checkbox] 엘리먼트를 대체할 엘리먼트
		 * @ignore
		 */
		if (this._elInput.type == "radio") {
			this.sTagName = "input[type=radio]";
			this.option("sClassPrefix", "radio-");
		}
		var sPrefix = this.option('sClassPrefix');
		this._elSubstitute = jindo.$$.getSingle("." + sPrefix + "mark", elWrapper);
		this._welSubstitute = jindo.$Element(this._elSubstitute);
	},
	
	/**
	 * Input 엘리먼트를 구한다.
	 * @return {HTMLElement}
	 */
	getInput : function() {
		return this._elInput;
	},
	
	/**
	 * Check 여부를 가져온다.
	 * @return {Boolean}
	 */
	getChecked : function() {
		return this.getInput().checked;
	},
	
	/**
	 * Check 여부를 설정한다.
	 * @param {Boolean}
	 * @return {this}
	 */
	setChecked : function(b) {
		this.getInput().checked = b;
		this.paint();
		return this;
	},
	
	/**
	 * CheckBox를 enable 시킨다.
	 * @return {this}
	 */
	enable : function() {
		this.getInput().disabled = false;
		this.paint();
		return this;
	},
	
	/**
	 * CheckBox를 disable 시킨다.
	 * @return {this}
	 */
	disable : function() {
		this.getInput().disabled = true;
		this.paint();
		return this;
	},
	
	_onClickInput : function(we) {
		we.stop(jindo.$Event.CANCEL_DEFAULT);
		
		var self = this;
		setTimeout(function(){ //Scope 안에서 input[type=checkbox]의 checked가 이상함!
			self._welWrapper.fireEvent("click");	
		}, 1);
	},
	
	_onClickWrapper : function(we) {
		var elInput = this._elInput;
		if (elInput.disabled || we.element === elInput) { /* Diabled거나 Label을 클릭했거나 키보드 스페이스로 직접 선택했을 때 */
			return;
		}
		elInput.focus();

		if (this.fireEvent("beforeChange", { bChecked : elInput.checked })) {
			switch (elInput.type) {
				case "checkbox" :
					elInput.checked = !elInput.checked;
					this.paint();
				break;
				case "radio" :
					elInput.checked = true;
		
					var self = this;
					//name이 같은 input만 다시 그림
					jindo.$A(this.constructor.getInstance()).forEach(function(oRadioButton){
						if (oRadioButton.getInput().name == self.getInput().name) {
							oRadioButton.paint();
						} 
					});
				break;
			}
		}
	},
	
	_onFocusInput : function(we) {
		this._welWrapper.addClass(this.option('sClassPrefix') + 'focused'); 
	},
	
	_onBlurInput : function(we) {
		this._welWrapper.removeClass(this.option('sClassPrefix') + 'focused');
	},
	
	/**
	 * 컴포넌트를 활성화한다.
	 */
	_onActivate : function() {
		this._welWrapper.addClass(this.option('sClassPrefix') + 'applied');
		
		this.wfOnClickInput.attach(this._elInput, 'click');
		this.wfOnClickWrapper.attach(this._elWrapper, 'click');
		this.wfOnFocusInput.attach(this._elInput, 'focus');
		this.wfOnBlurInput.attach(this._elInput, 'blur');
	},
	
	/**
	 * 컴포넌트를 비활성화한다.
	 */
	_onDeactivate : function() {
		this._welWrapper.removeClass(this.option('sClassPrefix') + 'applied');
		
		this.wfOnClickInput.detach(this._elInput, 'click');
		this.wfOnClickWrapper.detach(this._elWrapper, 'click');
		this.wfOnFocusInput.detach(this._elInput, 'focus');
		this.wfOnBlurInput.detach(this._elInput, 'blur');
	},
	
	/**
	 * 컴포넌트를 새로 그려준다. (HTMLComponent 공통메소드)
	 */
	_onPaint : function() {
		var sPrefix = this.option('sClassPrefix');
		
		if (this._elInput.disabled){
			this._welWrapper.addClass(sPrefix + 'disabled');	
		} else {
			this._welWrapper.removeClass(sPrefix + 'disabled');
		}
		
		if (this._elInput.checked){
			this._welSubstitute.addClass(sPrefix + 'checked');	
		} else {
			this._welSubstitute.removeClass(sPrefix + 'checked');
		}
		
		this.fireEvent("change", {
			bChecked : this._elInput.checked
		});
	}
	
}).extend(jindo.HTMLComponent);
/**
 * @fileOverview HTML Select 엘리먼트를 대체하여 디자인을 적용하는 컴포넌트
 * @author senxation
 * @version 0.2.5
 */

jindo.SelectBox = jindo.$Class({
	/** @lends jindo.SelectBox.prototype */
	sTagName : 'select',
	
	_bDisabled : false, 
	_sPrevValue : null, //select의 이전 값
	_nSelectedIndex : 0, //선택된 index
	_bRealFocused : false, //탭키 이동으로 실제로 포커스되었는지의 여부
	
	/**
	 * SelectBox 컴포넌트를 생성한다.
	 * @constructs
	 * @class HTML Select 엘리먼트를 대체하여 디자인을 적용하는 컴포넌트
	 * @extends jindo.HTMLComponent
	 * @requires jindo.Timer
	 * @requires jindo.LayerManager
	 * @requires jindo.LayerPosition
	 * @requires jindo.RolloverClick
	 * @param {HTMLElement} el
	 * @param {HashTable} htOption
	 * @example
oSelectBox = new jindo.SelectBox(jindo.$("s"), {
	sClassPrefix : 'selectbox-', //Default Class Prefix
	nWidth : null, //가로 사이즈, null시 자동
	nHeight : null, //목록의 최대 높이. 그 이상시 스크롤 생김, null시 자동.
	bUseLayerPosition : true, //LayerPosition 컴포넌트로 위치 설정할지 여부.
	aOptionHTML : [], //목록에서 option 내부에 html을 적용하고 싶을 경우 option 엘리먼트의 개수에 맞게 값을 설정한다.
	aOptionLabel : [], //aOptionHTML이 설정된 option이 선택된 경우에 레이블영역에 보여질 html내용. 생략할 경우 aOptionHTML과 동일하게 표현된다. 
	LayerPosition : {
		sPosition : "outside-bottom", //목록의 위치. LayerPosition 컴포넌트에서 사용할 옵션
		sAlign : "left", //목록의 정렬. LayerPosition 컴포넌트에서 사용할 옵션
		nTop : 0, //선택박스와 목록의 상하 간격. LayerPosition 컴포넌트에서 사용할 옵션
		nLeft : 0 //선택박스와 목록의 좌우 간격. LayerPosition 컴포넌트에서 사용할 옵션
	},
	LayerManager :{
		sCheckEvent : "mousedown", // {String} 어떤 이벤트가 발생했을 때 레이어를 닫아야 하는지 설정
		nShowDelay : 20, //{Number} 보여주도록 명령을 한 뒤 얼마 이후에 실제로 보여질지 지연시간 지정 (ms)
		nHideDelay : 0, //{Number} 숨기도록 명령을 한 뒤 얼마 이후에 실제로 숨겨지게 할지 지연시간 지정 (ms)
		sMethod : "show" //{String} "fade", "slide" 보이고 숨길 방법 설정 (Transition 컴포넌트 사용)
	}
}).attach({
	change : function(oCustomEvent) {//선택한 아이템이 바뀌었을때 발생
		//전달되는 이벤트객체 oCustomEvent = {
		//	nIndex : (Number) 선택된 옵션의 인덱스, nLastIndex : nLastSelectedIndex
		//	nLastIndex : (Number) 선택되기 전의 옵션의 인덱스
		//}
	},
	open : function(oCustomEvent) {//레이어가 열리기 직전 발생
		//oCustomEvent.stop(); 수행시 레이어가 열리지 않음
	},
	close : function(oCustomEvent) {//레이어가 닫히기 직전 발생
		//oCustomEvent.stop(); 수행시 레이어가 닫히지 않음					
	},
	focus : function(oCustomEvent) {//셀렉트박스가 포커스를 얻으면 발생
		//oCustomEvent.stop(); 수행시 포커스 할 수 없음
	},
	blur : function(oCustomEvent) {//셀렉트박스가 포커스를 잃으면 발생
	}
});
	 */
	$init : function(el, htOption) {
		this._aItemData = [];
		this._aListItem = [];
		this._aOptions = [];
		
		this.option({
			sClassPrefix : 'selectbox-', //Default Class Prefix
			nWidth : null,
			nHeight : null,
			bUseLayerPosition : true, //LayerPosition 컴포넌트로 위치 설정할지 여부
			aOptionHTML : [],
			aOptionLabel : [],
			LayerPosition : { //LayerPosition 컴포넌트에서 사용할 옵션
				sPosition : "outside-bottom", //목록의 위치. LayerPosition 컴포넌트에서 사용할 옵션
				sAlign : "left", //목록의 정렬. LayerPosition 컴포넌트에서 사용할 옵션
				nTop : 0, //선택박스와 목록의 상하 간격. LayerPosition 컴포넌트에서 사용할 옵션
				nLeft : 0 //선택박스와 목록의 좌우 간격. LayerPosition 컴포넌트에서 사용할 옵션
			},
			LayerManager : {
				sCheckEvent : "mousedown", // {String} 어떤 이벤트가 발생했을 때 레이어를 닫아야 하는지 설정
				nShowDelay : 20, //{Number} 보여주도록 명령을 한 뒤 얼마 이후에 실제로 보여질지 지연시간 지정 (ms)
				nHideDelay : 0, //{Number} 숨기도록 명령을 한 뒤 얼마 이후에 실제로 숨겨지게 할지 지연시간 지정 (ms)
				sMethod : "show" //{String} "fade", "show" 보이고 숨길 방법 설정 (Transition 컴포넌트 사용)
			}
		});
		this.option(htOption || {});

		this._el = jindo.$(el);
		this._assignHTMLElements(); //컴포넌트에서 사용되는 HTMLElement들을 선언하는 메소드
		if(this.option("bUseLayerPosition")) {
			this._initLayerPosition();
		}
		this._initLayerManager();
		this._initRolloverClick();
		this._oTimer = new jindo.Timer();
		this._wfOnFocusSelect = jindo.$Fn(this._onFocusSelect, this);
		this._wfOnBlurSelect = jindo.$Fn(this._onBlurSelect, this);
		this._wfOnMouseDownBox = jindo.$Fn(this._onMouseDownBox, this);
		this._wfOnMouseDownList = jindo.$Fn(this._onMouseDownList, this);
		
		this._wfOnKeyDown = jindo.$Fn(this._onKeyDown, this);
		this._wfOnMouseWheel = jindo.$Fn(function(e){
			e.stop(jindo.$Event.CANCEL_DEFAULT);
		}); //ie6 에서 셀렉트박스에서 스크롤할 경우 선택값이 바뀌는 것을 방지
		
		this._oAgent = jindo.$Agent(); 
		this.activate(); //컴포넌트를 활성화한다.
	},

	/**
	 * 컴포넌트에서 사용되는 HTMLElement들을 선언하는 메소드
	 */
	_assignHTMLElements : function() {
		var sPrefix = this.option("sClassPrefix"),
			el = this._el;
			
		this._wel = jindo.$Element(el);
		this._elSelect	= jindo.$$.getSingle('select.' + sPrefix + 'source', el);
		this._sSelectInnerHTML = this._elSelect.innerHTML; //초기의 innerHtml을 구함
		this._elOptionDefault = jindo.$$.getSingle('option.' + sPrefix + 'default', el);
		this._elSelectOptionGroup	= jindo.$$.getSingle('select.' + sPrefix + 'source-option-group', el);
		this._elBox		= jindo.$$.getSingle('.' + sPrefix + 'box', el);
		this._elLabel	= jindo.$$.getSingle('.' + sPrefix + 'label', el);
		this._elLayer	= jindo.$$.getSingle('.' + sPrefix + 'layer', el);
		this._elList	= jindo.$$.getSingle('.' + sPrefix + 'list', el);
		this._elList.innerHTML = "";
		this._elSelectList	= jindo.$('<ul>');
		this._elList.insertBefore(this._elSelectList, this._elList.firstChild);
	},
	
	/**
	 * select 엘리먼트를 가져온다.
	 * @return {HTMLElement} 
	 */
	getSelectElement : function() {
		return this._elSelect;
	},
	
	/**
	 * box 엘리먼트(클래스명 "box")를 가져온다.
	 * @return {HTMLElement} 
	 */
	getBoxElement : function() {
		return this._elBox;
	},
	
	/**
	 * label 엘리먼트(클래스명 "label")를 가져온다.
	 * @return {HTMLElement} 
	 */
	getLabelElement : function() {
		return this._elLabel;
	},
	
	/**
	 * layer 엘리먼트(클래스명 "layer")를 가져온다.
	 * @return {HTMLElement} 
	 */
	getLayerElement : function() {
		return this._elLayer;
	},
	
	/**
	 * list 엘리먼트(클래스명 "list")를 가져온다.
	 * @return {HTMLElement} 
	 */
	getListElement : function() {
		return this._elList;
	},
	
	/**
	 * list 엘리먼트 내부의 실제 목록 ul 엘리먼트를 가져온다.
	 * @return {HTMLElement} 
	 */
	getSelectListElement : function() {
		return this._elSelectList;
	},
	
	_limitWidth : function() {
		var nWidth = this.option("nWidth");
		this.getLayerManager()._sLayerCSSOverflowX = "hidden";
		if (nWidth) {
			jindo.$Element(this.getBoxElement()).css({
				"width": nWidth + "px",
				"overflowX": "hidden"
			});
			jindo.$Element(this.getLayerElement()).css({
				"width": nWidth + "px",
				"overflowX": "hidden"
			});
		}
	},
	
	_initLayerManager : function() {
		var self = this,
			sPrefix = this.option("sClassPrefix"),
			elSelect = this.getSelectElement();
			
		this._oLayerManager = new jindo.LayerManager(this.getLayerElement(), this.option("LayerManager")).attach({
			beforeShow : function(oCustomEvent) {
				/* LayerPosition이 사용되는 경우 레이어가 document.body로 이동되었으므로 사이즈를 다시 측정 */
				if (self.option("bUseLayerPosition") && !this._bMeasureFinished) {
					this.setLayer(oCustomEvent.elLayer);
				}
				
				self._limitWidth();
				
				var nHeight = self.option("nHeight");
				if (nHeight) { //높이값 제한
					var welLayer = jindo.$Element(this.getLayer());
					if (this._nLayerHeight >= nHeight) {
						this._sLayerCSSOverflowY = "auto"; //_restore할 css값
						welLayer.css("overflowY", "hidden");
						if (oCustomEvent.sMethod != "slide") {
							welLayer.css("height", nHeight + "px");
						}
						this._nLayerHeight = nHeight;
					}
				}
				
				if(self.fireEvent("open")) {
					setTimeout(function(){ //focus때문에 delay
						elSelect.focus();
					}, 10);
					self._wel.addClass(sPrefix + 'open');
				} else {
					oCustomEvent.stop();
				}
			},
			appear : function(oCustomEvent) {
				if (self.option("bUseLayerPosition")) {
					self.getLayerPosition().setPosition(); //레이어가 항상보이도록 포지셔닝을 LayerPosition에 위임
					this._bMeasureFinished = true;
				}
			},
			show : function(oCustomEvent) {
				self._paintSelected();
			},
			beforeHide : function(oCustomEvent) {
				if(self.fireEvent("close")) {
					self._wel.removeClass(sPrefix + 'open').removeClass(sPrefix + 'focused');
					setTimeout(function(){ //focus때문에 delay
						self.getSelectElement().blur();
					}, 10);
				} else {
					oCustomEvent.stop();
					setTimeout(function(){ //focus때문에 delay
						elSelect.focus();
					}, 10);
				}
			},
			hide : function(oCustomEvent) {
				jindo.$Element(oCustomEvent.elLayer).css("height", this._sLayerCSSHeight);
			}
		}).link(this.getBoxElement()).link(this.getLayerElement());
	},
	
	/**
	 * LayerManager 객체를 가져온다.
	 * @return {jindo.LayerManager}
	 */
	getLayerManager : function() {
		return this._oLayerManager;
	},
	
	_initRolloverClick : function() {
		var self = this,
			sPrefix = this.option("sClassPrefix");
		
		this._oRolloverClick = new jindo.RolloverClick(this.getSelectListElement(), {
			sCheckEvent : "mouseup",
			RolloverArea : {
				sClassName : sPrefix + "item",
				sClassPrefix : sPrefix + "item-"  
			}
		}).attach({
			over : function(oCustomEvent) {
				if (self._welOvered) {
					self._welOvered.removeClass(sPrefix + "item-over");	
				}
				var wel = jindo.$Element(oCustomEvent.element);
				wel.addClass(sPrefix + "item-over");
				self._welOvered = wel;
			},
			out : function(oCustomEvent) {
				oCustomEvent.stop();
			},
			click : function(oCustomEvent) {
				var nSelectedIndex = self._nSelectedIndex;
				jindo.$A(self._aItemData).forEach(function(htData){
					if (htData.elItem === oCustomEvent.element) {
						self.setValue(htData.sValue);
						jindo.$A.Break();
					}
				});
				
				var nLastSelectedIndex = self.getSelectedIndex();
				
				if (nSelectedIndex != nLastSelectedIndex) {
					jindo.$Element(self.getSelectElement()).fireEvent("change"); //이미 선언된 select의 onchange핸들러 수행을 위해 이벤트 트리거링
					self.fireEvent("change", { 
						nIndex : nSelectedIndex, 
						nLastIndex : nLastSelectedIndex 
					});	
				}
				
				if (!jindo.$Element(oCustomEvent.element).hasClass(sPrefix + "notclose")) {
					self.getLayerManager().hide(); //선택이 제대로 이뤄졌을 경우에 hide
				} 
			}
		});
	},
	
	/**
	 * RolloverClick 객체를 가져온다.
	 * @return {jindo.RolloverClick}
	 */
	getRolloverClick : function() {
		return this._oRolloverClick;
	},
	
	_initLayerPosition : function() {
		this._oLayerPosition = new jindo.LayerPosition(this.getBoxElement(), this.getLayerElement(), this.option("LayerPosition"));
	},
	
	/**
	 * LayerPosition 객체를 가져온다.
	 * @return {jindo.LayerPosition}
	 */
	getLayerPosition : function() {
		return this._oLayerPosition;
	},

	/**
	 * 컴포넌트를 활성화한다.
	 */
	_onActivate : function() {
		var sPrefix = this.option("sClassPrefix"),
			elSelect = this.getSelectElement();
		
		this._limitWidth();	
		this._wel.removeClass(sPrefix + "noscript");
		this._wfOnFocusSelect.attach(elSelect, "focus");
		this._wfOnBlurSelect.attach(elSelect, "blur");
		this._wfOnMouseDownBox.attach(this.getBoxElement(), "mousedown");
		this._wfOnMouseDownList.attach(this.getListElement(), "mousedown");
		this._wfOnKeyDown.attach(elSelect, "keydown");
		this._wfOnMouseWheel.attach(elSelect, "mousewheel"); 
		
		this.paint();
		this._sPrevValue = this.getValue();
	},
	
	/**
	 * 컴포넌트를 비활성화한다.
	 */
	_onDeactivate : function() {
		this.getLayerManager().hide();
		var sPrefix = this.option("sClassPrefix"),
			elSelect = this.getSelectElement();
			
		this._wel.addClass(sPrefix + "noscript");
		this._wfOnFocusSelect.detach(elSelect, "focus");
		this._wfOnBlurSelect.detach(elSelect, "blur");
		this._wfOnMouseDownBox.detach(this.getBoxElement(), "mousedown");
		this._wfOnMouseDownList.detach(this.getListElement(), "mousedown");
		this._wfOnKeyDown.detach(elSelect, "keydown");
		this._wfOnMouseWheel.detach(elSelect, "mousewheel");
	},
	
	/**
	 * text값에 대한 option의 value를 가져온다.
	 * @param {String} sText
	 * @return {String}
	 */
	getValueOf : function (sText) {
		for (var i = 0, oItemData; (oItemData = this._aItemData[i]); i++) {
			if (oItemData.sText == sText) {
				return oItemData.sValue;
			}
		}
		return null;
	},
	
	/**
	 * Select의 value를 가져온다.
	 * @return {String}
	 */
	getValue : function() {
		return this.getSelectElement().value;
	},
	
	/**
	 * Select의 text를 가져온다.
	 * @return {String}
	 */
	getText : function() {
		return this._aItemData[this._nSelectedIndex].sText;
	},
	
	/**
	 * Select의 html를 가져온다.
	 * @remark 옵션의 aOptionHTML을 설정한 경우에 리턴값을 가진다.
	 * @return {String}
	 */
	getHTML : function() {
		return this.getLabelElement().innerHTML;
	},
	
	/**
	 * SelectBox의 value를 설정한다.
	 * @param {String} sValue 
	 */
	setValue : function(sValue) {
		this.getSelectElement().value = sValue;
		this._sPrevValue = this.getValue();
		this._paint();
	},

	/**
	 * 선택된 index를 가져온다.
	 * @param {Number} nIndex
	 */
	getSelectedIndex : function(nIndex) {
		return this.getSelectElement().selectedIndex;		
	},

	/**
	 * nIndex번째 옵션을 선택한다.
	 * disabled 된것에 대해 처리한다.
	 * @param {Object} nIndex
	 */
	setSelectedIndex : function(nIndex, bFireEvent) {
		if (typeof bFireEvent == "undefined") {
			bFireEvent = true;
		}
		
		if (this._isSelectable(nIndex)) {
			var nLastSelectedIndex = this.getSelectedIndex();
			this._setSelectedIndex(nIndex);
			this._paint();
			
			if (bFireEvent && nLastSelectedIndex != nIndex) {
				this.fireEvent("change", { nIndex : nIndex, nLastIndex : nLastSelectedIndex });	
			}
			return true;
		}
		return false;
	},
	
	_setSelectedIndex : function(nIndex) {
		this.getSelectElement().selectedIndex = nIndex; //선택된 index는 이메소드를 그릴때 정의
	},
	
	_isSelectable : function(nIndex) {
		var htItem = this._aItemData[nIndex];
		if (!htItem || htItem.bDisabled || htItem.bDefault) {
			return false;
		} else {
			return true;
		}
	},

	/**
	 * Select의 option 엘리먼트들을 가져온다.
	 * @return {Array}
	 */
	getOptions : function() {
		return this._aOptions;
	},
	
	/**
	 * List내의 아이템 엘리먼트(li)들을 가져온다.
	 * @return {Array}
	 */
	getListItems : function() {
		return this._aListItem;
	},
	
	/**
	 * 셀렉트박스가 disabled 되었는지 여부를 가져온다.
	 */
	getDisabled : function() {
		return this._bDisabled;
	},
	
	/**
	 * 보여질 옵션 그룹을 설정한다.
	 * source 엘리먼트 내에 <option class="selectbox-default"> 엘리먼트가 선언되어있어야한다.
	 * 옵션 그룹을 설정하기 위해 기본으로 설정된 source-option-group 셀렉트 엘리먼트가 선언되어있어야한다. 
	 * option 중 지정된 옵션 그룹명(option-group-그룹명)을 가진 엘리먼트만 보여진다.
	 * @param {String} sName 옵션 그룹 명
	 * @return {Boolean} 설정 완료 여부
	 * @example
<!-- 수행 전 구조 -->
<div>
	<select class="selectbox-source">
   		<option value="0" class="selectbox-default">팀을 선택하세요</option>
   	</select>
	<select class="selectbox-source-option-group"> <!--옵션 그룹을 설정하기 위한 보이지 않는 select-->
   		<option value="1" class="selectbox-option-group-1">Ajax UI1팀</option>
   		<option value="2" class="selectbox-option-group-1">Ajax UI2팀</option>
		<option value="3" class="selectbox-option-group-1">Ajax UI3팀</option>
		<option value="4" class="selectbox-option-group-1">Ajax UI4팀</option>
		<option disabled="disabled" class="selectbox-option-group-1">----------------------</option>
		<option value="5" class="selectbox-option-group-1">SPSUI TF</option>
		<option value="6" class="selectbox-option-group-2">플래시UI1팀</option>	
   		<option value="7" class="selectbox-option-group-2">플래시UI2팀</option>
		<option disabled="disabled" class="selectbox-option-group-2">----------------------</option>
		<option value="8" class="selectbox-option-group-2">RIA기술팀</option>
		<option value="9" class="selectbox-option-group-3">UI기술기획팀</option>
		<option value="10" class="selectbox-option-group-3">웹표준화팀</option>
		<option value="11" class="selectbox-option-group-3">오픈UI기술팀</option>
		<option value="12" class="selectbox-option-group-3">인터널서비스</option>
   	</select>
	<div class="selectbox-box">
		<div class="selectbox-label">팀을 선택하세요</div>
	</div>
	<div class="selectbox-layer">
		<div class="selectbox-list"><ul style="height: auto;"/></div>
	</div>

</div>

setOptionGroup("1")

<!-- 수행 후 구조 -->
<div>
	<select class="selectbox-source">
   		<option value="0" class="selectbox-default">팀을 선택하세요</option>
   		<option value="1" class="selectbox-option-group-1">Ajax UI1팀</option>
   		<option value="2" class="selectbox-option-group-1">Ajax UI2팀</option>
		<option value="3" class="selectbox-option-group-1">Ajax UI3팀</option>
		<option value="4" class="selectbox-option-group-1">Ajax UI4팀</option>
		<option disabled="disabled" class="selectbox-option-group-1">----------------------</option>
		<option value="5" class="selectbox-option-group-1">SPSUI TF</option>
	</select>
	<select class="selectbox-source-option-group"> <!--옵션 그룹을 설정하기 위한 보이지 않는 select-->
   		<option value="1" class="selectbox-option-group-1">Ajax UI1팀</option>
   		<option value="2" class="selectbox-option-group-1">Ajax UI2팀</option>
		<option value="3" class="selectbox-option-group-1">Ajax UI3팀</option>
		<option value="4" class="selectbox-option-group-1">Ajax UI4팀</option>
		<option disabled="disabled" class="selectbox-option-group-1">----------------------</option>
		<option value="5" class="selectbox-option-group-1">SPSUI TF</option>
		<option value="6" class="selectbox-option-group-2">플래시UI1팀</option>	
   		<option value="7" class="selectbox-option-group-2">플래시UI2팀</option>
		<option disabled="disabled" class="selectbox-option-group-2">----------------------</option>
		<option value="8" class="selectbox-option-group-2">RIA기술팀</option>
		<option value="9" class="selectbox-option-group-3">UI기술기획팀</option>
		<option value="10" class="selectbox-option-group-3">웹표준화팀</option>
		<option value="11" class="selectbox-option-group-3">오픈UI기술팀</option>
		<option value="12" class="selectbox-option-group-3">인터널서비스</option>
   	</select>
	<div class="selectbox-box">
		<div class="selectbox-label">팀을 선택하세요</div>
	</div>
	<div class="selectbox-layer">
		<div class="selectbox-list">
			<ul>
				<li class="selectbox-item">Ajax UI1팀</li>
				<li class="selectbox-item">Ajax UI2팀</li>
				<li class="selectbox-item">Ajax UI3팀</li>
				<li class="selectbox-item">Ajax UI4팀</li>
				<li class="selectbox-item-disabled">----------------------</li>
				<li class="selectbox-item">SPSUI TF</li>
			</ul>
		</div>
	</div>

</div>
	 */
	setOptionGroup : function(sName) {
		if (!this._elSelectOptionGroup || !this._elOptionDefault) {
			return false;
		}
		
		var elSelect = this.getSelectElement(),
			sPrefix = this.option('sClassPrefix'),
			aGroupOption = jindo.$$("." + sPrefix + "option-group-" + sName, this._elSelectOptionGroup),
			elOptionDefault = this._elOptionDefault = this._elOptionDefault.cloneNode(true);
		
		elSelect.innerHTML = "";
		elSelect.appendChild(elOptionDefault);
		this._nSelectedIndex = 0; 
		for (var i = 0; i < aGroupOption.length; i++) {
			elSelect.appendChild(aGroupOption[i].cloneNode(true));
		}
		this._sPrevValue = this.getValue();
		
		this.paint();
		return true;
	},
	
	/**
	 * 선택된 값이 있는지 여부를 가져온다.
	 * Default 옵션이 선택된 경우에 false를 리턴한다.
	 */
	isSelected : function() {
		return !this._aItemData[this.getSelectedIndex()].bDefault;
	},
	
	/**
	 * 선택된 값을 초기화하여 default값으로 되돌린다.
	 */
	setDefault : function() {
		var nDefaultOption = -1;
			
		jindo.$A(this._aItemData).forEach(function(o, i) {
			if (o.bDefault || o.bSelected) {
				nDefaultOption = i;	
			}
		});
		
		if (nDefaultOption < 0) { //default나 selected="selected" 된거 없으면 첫번째 옵션이 default 
			nDefaultOption = 0;
		} 
		
		this._nSelectedIndex = nDefaultOption;
		this._setSelectedIndex(nDefaultOption);
		this._sPrevValue = this.getValue();
		
		this._paint();
	},
	
	/**
	 * 셀렉트박스를 다시 그린다.
	 */
	paint : function() {
		this._paintList();
		this._paintSelected();
		this._paintLabel();
		this.getLayerManager().setLayer(this.getLayerElement());
	},
	
	/**
	 * 타이머로 체크하여 계속 다시 그림
	 * @ignore
	 */
	_paint : function() {
		this._paintSelected();
		this._paintLabel();
	},
	
	/**
	 * 현재 설정된 값을 box의 label에 그린다.
	 * @ignore
	 */
	_paintLabel : function() {
		var welLabel = jindo.$Element(this.getLabelElement()),
			sHTML = this.option("aOptionHTML")[this._nSelectedIndex] || "",
			sLabel = this.option("aOptionLabel")[this._nSelectedIndex] || "",
			sText = this.getText();
			
		if (sHTML) {
			if (sLabel) {
				welLabel.html(sLabel);
			} else {
				welLabel.html(sHTML);
			}
		} else {
			welLabel.text(sText);
		}
		welLabel.attr("unselectable", "on");
	},
	
	/**
	 * 현재 설정된 값을 list에 그린다.
	 * @ignore
	 */
	_paintList : function() {
		var sPrefix = this.option('sClassPrefix');
		this._aOptions = jindo.$$('option', this.getSelectElement());
		var aOptions = this._aOptions;
		this._aItemData = [];
		this._aListItem = [];
		
		this._nSelectedIndex = 0; 
		var elList = this.getSelectListElement();
		elList.innerHTML = "";
		if (this.option("nHeight")) { /* 높이값 되돌리기 */
			jindo.$Element(this.getLayerElement()).css("height", "auto");
			//this.getLayerManager()._restore();
			//.css("overflowX", "").css("overflowY", "");
		}
		
		for (var i = 0, elOption; (elOption = aOptions[i]); i++) {
			var welOption = jindo.$Element(elOption),
				bDefault = welOption.hasClass(sPrefix + 'default'),
				bSelected = welOption.attr("selected") == "selected",
				bDisabled = bDefault || elOption.disabled,
				sHTML = this.option("aOptionHTML")[i] || "",
				sText = welOption.text() || "",
				sValue = welOption.attr("value");
				
			if (!sValue) {
				welOption.attr("value", sText);
				sValue = sText;
			}
			
			this._aItemData[i] = {
				elOption : elOption,
				elItem : null,
				sHTML : sHTML,
				sText : sText,
				sValue : sValue,
				
				bDisabled : bDisabled,
				bSelected : bSelected,
				bDefault : bDefault
			};
			
			// <li> 태그 만들기
			var elItem = null,
				htItem = this._aItemData[i];
				
			if (!htItem.bDefault) {
				elItem = jindo.$('<li>');
				// <option> 에 적용된 스타일 그대로 적용하기
				elItem.style.cssText = htItem.elOption.style.cssText;
				elItem.className = htItem.elOption.className;
				var welItem = jindo.$Element(elItem);
				if (htItem.sHTML) {
					welItem.html(htItem.sHTML);
				} else {
					welItem.text(htItem.sText);
				}
				welItem.attr("unselectable", "on");
				
				if (htItem.bDisabled) {
					welItem.addClass(sPrefix + 'item-disabled');
				}
				else {
					welItem.addClass(sPrefix + 'item'); //구분선이 아닐경우만
				}
				
				elList.appendChild(elItem);
				this._aListItem.push(elItem);
				this._aItemData[i].elItem = elItem;
			}
			
		}
		if (this._aListItem.length === 0) {
			this.disable();
			return;
		}
		this.enable();
	},
	
	/**
	 * 레이어가 열리면, 현재 선택된 아이템을 하이라이팅하고 scrollTop을 보정
	 * @ignore
	 */
	_paintSelected : function() {
		var sPrefix = this.option('sClassPrefix'),
			n = this.getSelectedIndex(),
			htItem,
			nPrevSelectedIndex = this._nSelectedIndex;
			
		this._nSelectedIndex = n; //선택된 index는 이메소드를 그릴때 정의
		htItem = this._aItemData[n];
		if (htItem.elItem) {
			var elSelected = htItem.elItem,
				welSelected = jindo.$Element(elSelected);
				
			if (this._welSelected) {
				this._welSelected.removeClass(sPrefix + "item-selected");	
			}
			if (this._welOvered) {
				this._welOvered.removeClass(sPrefix + "item-over");	
			}
			this._welSelected = this._welOvered = welSelected;
			welSelected.addClass(sPrefix + "item-selected").addClass(sPrefix + "item-over");	
			
			if (this.isLayerOpened()) {
				var elLayerElement = this.getLayerElement();
				//scroll포지션 세팅
				if (!this.option("nHeight") || this.getLayerManager().option("sMethod") == "slide") {
				//	elLayerElement.scrollTop = 0;
				//	return;
				}
				var nHeight = parseInt(jindo.$Element(elLayerElement).css("height"), 10),
					nOffsetTop = elSelected.offsetTop,
					nOffsetHeight = elSelected.offsetHeight,
					nScrollTop = elLayerElement.scrollTop,
					bDown;
				
				if (nPrevSelectedIndex < n) {
					bDown = true;
				} else {
					bDown = false;
				}
				if (nOffsetTop < nScrollTop || nOffsetTop > nScrollTop + nHeight) {
					elLayerElement.scrollTop = nOffsetTop;
				}
				if (bDown) {
					if (nOffsetTop + nOffsetHeight > nHeight + nScrollTop) {
						elLayerElement.scrollTop = (nOffsetTop + nOffsetHeight - nHeight);
					}
				} else {
					if (nOffsetTop < nScrollTop) {
						elLayerElement.scrollTop = nOffsetTop;
					}
				}
			}
		}
	},
	
	/**
	 * Select 레이어가 열려있는지 여부를 가져온다.
	 * @return {Boolean}
	 */
	isLayerOpened : function() {
		return this.getLayerManager().getVisible();	
	},
	
	/**
	 * SelectBox를 disable 시킨다.
	 * 마우스로 클릭하더라도 목록 레이어가 펼쳐지지 않는다.
	 */
	disable : function() {
		this.getLayerManager().hide();
		var sPrefix = this.option("sClassPrefix");
		this._wel.addClass(sPrefix + 'disabled');
		this.getSelectElement().disabled = true;
		this._bDisabled = true;
	},
	
	/**
	 * SelectBox를 enable 시킨다.
	 */
	enable : function() {
		var sPrefix = this.option("sClassPrefix");
		this._wel.removeClass(sPrefix + 'disabled');
		this.getSelectElement().disabled = false;
		this._bDisabled = false;
	},
	
	/**
	 * 레이어를 연다.
	 * @return {this}
	 */
	open : function() {
		if (!this._bDisabled) {
			this.getLayerManager().show();
		}
		return this;
	},
	
	/**
	 * 레이어를 닫는다.
	 * @return {this}
	 */
	close : function() {
		this.getLayerManager().hide();
		return this;
	},
	
	_onMouseDownBox : function(we){
		we.stop(jindo.$Event.CANCEL_DEFAULT);
		if (!this._bDisabled) {
			this.getLayerManager().toggle();
		}
	},
	
	_onMouseDownList : function(we){
		if (!jindo.$$.getSingle("! ." + this.option("sClassPrefix") + "notclose", we.element)) {
			we.stop(jindo.$Event.CANCEL_DEFAULT);
		}
	},
	
	/**
	 * 현재 index로부터 선택가능한 다음 index를 구한다.
	 * @param {Number} nIndex
	 * @param {Number} nTarget
	 * @ignore
	 */
	_getSelectableIndex : function(nIndex, nDirection, nTargetIndex) {
		var nFirst = -1,
			nLast = this._aItemData.length - 1,
			i;
		
		for (i = 0; i < this._aItemData.length; i++) {
			if (this._isSelectable(i)) {
				if (nFirst < 0) {
					nFirst = i;	
				}
				else {
					nLast = i;
				}
			}
		}
		
		switch (nDirection) {
			case -1 :
				if (nIndex == nFirst) {
					return nIndex;
				}
				for (i = nIndex - 1; i > nFirst; i--) {
					if (this._isSelectable(i)) {
						return i;
					}					
				}
				return nFirst;
			
			case 1 :
				if (nIndex == nLast) {
					return nIndex;
				}
				for (i = nIndex + 1; i < nLast; i++) {
					if (this._isSelectable(i)) {
						return i;
					}					
				}
				return nLast;
			
			case Infinity :
				return nLast;
			
			case -Infinity :
				return nFirst;
		}
	},
	
	_onKeyDown : function(we){
		var htKey = we.key();
		
		if (this._oAgent.os().mac && this._oAgent.navigator().safari) {
			var nKeyCode = htKey.keyCode;
			if (nKeyCode != 9) {
				//mac용 사파리에서는 select에서의 keydown을 중단. tab 제외
				we.stop(jindo.$Event.CANCEL_DEFAULT);
			}
			var nSelectedIndex = this.getSelectedIndex(),
				nTargetIndex = nSelectedIndex;
				
			// 콤보박스에서 발생한 이벤트도 처리하는 경우
			switch (nKeyCode) {
				case 37: // LEFT:
					nTargetIndex = this._getSelectableIndex(nSelectedIndex, -1);
					break;
					
				case 38: // UP:
					nTargetIndex = this._getSelectableIndex(nSelectedIndex, -1);
					break;
				
				case 39: // RIGHT
					nTargetIndex = this._getSelectableIndex(nSelectedIndex, 1);
					break;
					
				case 40: // DOWN
					nTargetIndex = this._getSelectableIndex(nSelectedIndex, 1);
					break;
					
				case 33: // PGUP
					nTargetIndex = this._getSelectableIndex(nSelectedIndex, -Infinity);
					break;
					
				case 34: // PGDN
					nTargetIndex = this._getSelectableIndex(nSelectedIndex, Infinity);
					break;
				case 13: // ENTER
					this.getLayerManager().hide();
					break;
			}
			
			var oParam = {
				nIndex: nTargetIndex,
				nLastIndex: parseInt(this._nSelectedIndex, 10)
			};
			
			this._setSelectedIndex(nTargetIndex);
			this._paint();
			if (oParam.nIndex != oParam.nLastIndex) {
				this.fireEvent("change", oParam);	
			}
		} else {
			if(this.isLayerOpened() && (htKey.enter || htKey.keyCode == 9)) {
				this.getLayerManager().hide();
			}
		}
	},
	
	_onFocusSelect : function(we){
		var sPrefix = this.option('sClassPrefix'),
			wel = this._wel;
			 
		if(!this.isLayerOpened()) {
			if (this.fireEvent("focus")) {
				this._bRealFocused = true;	
			} else {
				this.getSelectElement().blur();
				return;
			}
		}
		wel.addClass(sPrefix + 'focused');	
		
		//mac용 사파리에서는 타이머 돌지 않음
		if (!(this._oAgent.os().mac && this._oAgent.navigator().safari)) {
			var self = this;
			this._oTimer.start(function(){
			
				var sValue = self.getValue();
				if (!!self._sPrevValue && self._sPrevValue != sValue) {
					var nSelectedIndex = self.getSelectElement().selectedIndex;
					//Disable default는 다시 선택되지 않도록. ie는 선택이되네..
					if (!self._isSelectable(nSelectedIndex)) {
						var nDiff = -(self._nSelectedIndex - nSelectedIndex);
						nDiff = (nDiff > 0) ? 1 : -1;
						self._setSelectedIndex(self._getSelectableIndex(self._nSelectedIndex, nDiff, nSelectedIndex));
						return true;
					}
					
					var oParam = {
						nIndex: nSelectedIndex,
						nLastIndex: parseInt(self._nSelectedIndex, 10)
					};
					
					self._paint();
					if (oParam.nIndex != oParam.nLastIndex) {
						self.fireEvent("change", oParam);	
					}
					
					self._sPrevValue = sValue;
				}
				
				return true;
			}, 10);
		}
	},
	
	_onBlurSelect : function(we){
		var self = this,
			sPrefix = this.option('sClassPrefix');
			
		if (this._bRealFocused) { //레이어가 오픈되지 않고 focus되었던 경우에만 blur 발생
			this.fireEvent("blur");
			this._wel.removeClass(sPrefix + 'focused');
			this._bRealFocused = false;
		}
		setTimeout(function(){
			self._oTimer.abort();	
		}, 10); //마우스로 선택된것도 체크되도록
	}
}).extend(jindo.HTMLComponent);	
/**
 * @fileOverview 메뉴의 펼침/닫힘을 이용한 네비게이션을 구현한 아코디언 컴포넌트
 * @author senxation
 * @version 0.4
 */
jindo.Accordion = jindo.$Class({
	/** @lends jindo.Accordion */
	/**
	 * Accordian 컴포넌트를 생성한다.
	 * @constructs
	 * @class 메뉴의 펼침/닫힘을 이용한 네비게이션을 구현한 아코디언 컴포넌트
	 * @param {String | HTMLElement} el Accordian 컴포넌트를 적용할 레이어의 id 혹은 레이어 자체 
	 * @param {Object} oOption 초기화 옵션 설정을 위한 객체.
	 * @extends jindo.UIComponent
	 * @requires jindo.Timer
	 * @requires jindo.Transition
	 * @example
var oAccordion = new jindo.Accordion("panel", {
	sDirection : "vertical" // (String) 방향값, 세로("vertical") or 가로("horizontal") 
	nDuration : 300, // (Number) Transition이 적용될 시간 (ms)
	nFPS : 30, // (Number) Transition이 적용될 frame per second
	sEffect : "linear", // (String) Transition 효과의 종류
	nExpandDelay : 0 // (String) 펼칠 때의 딜레이 시간 (ms)
	nContractDelay : 0 // (String) 전체 축소시 딜레이 시간 (ms)
}).attach({
	click : function(oCustomEvent) {
		//handler를 클릭 하였을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	nIndex : (Number) 클릭된 handler의 인덱스
		//	element : (HTMLElement) handler
		//}
		if(this.getExpanded() == oCustomEvent.nIndex) this.contractAll();
		else this.expand(oCustomEvent.nIndex);
	},
	mouseover : function(oCustomEvent) {
		//handler에 마우스 커서를 올렸을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	nIndex : (Number) 클릭된 handler의 인덱스
		//	element : (HTMLElement) handler
		//	weEvent : (jindo.$Event) jindo $Event 객체
		//}
	},
	mouseout : function(oCustomEvent) {
		//layer에서 마우스 커서가 벗어났을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	nIndex : (Number) 클릭된 handler의 인덱스
		//	element : (HTMLElement) handler
		//}
	}
});
	 */
	$init : function(el, htOption) {
		/**
		 * Accordian 컴포너트가 적용될 레이어
		 * @type {HTMLElement}
		 */
		this._el = jindo.$(el);
		this.option({
			classPrefix : "accordion-",
			sDirection : "vertical",
			nDuration : 300,
			nFPS : 30,
			sEffect : "linear",
			nExpandDelay : 0,
			nContractDelay : 0,
			bActivateOnload : true
		});
		this.option(htOption || {});
		
		var sClassPrefix = this.option("classPrefix");
		
		/**
		 * 레이어의 자식 엘리먼트들. 편의상 block으로 명명한다.
		 * @type {HTMLElement}
		 * @remark 반드시 class명을 block으로 정의한다.
		 */
		this._aBlock = jindo.$$("." + sClassPrefix + "block", this._el);

		/**
		 * Timer 객체
		 * @type {jindo.Timer}
		 * @see jindo.Timber
		 */		
		this._oTimer = new jindo.Timer();
				
		/**
		 * Transition 객체
		 * @type {jindo.Transition}
		 * @see jindo.Transition
		 */
		this._oTransition = new jindo.Transition({ bCorrection : true }).fps(this.option("nFPS"));
		
		this._wfOnMouseOverClick = jindo.$Fn(this._onMouseOverClick, this);
		this._wfOnMouseOut = jindo.$Fn(this._onMouseOut, this);
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	_onActivate : function() {
		this._wfOnMouseOverClick.attach(this._el, "click");
		this._wfOnMouseOverClick.attach(this._el, "mouseover");
		this._wfOnMouseOut.attach(this._el, "mouseout");
	},
	
	_onDeactivate : function() {
		this._wfOnMouseOverClick.detach(this._el, "click");
		this._wfOnMouseOverClick.detach(this._el, "mouseover");
		this._wfOnMouseOut.detach(this._el, "mouseout");
	},
	
	_onMouseOverClick : function(we) {
		var el = we.element;
		if (el == this._el) {
			return;
		}
		
		var sClassPrefix = this.option("classPrefix");
		var elBlock = (jindo.$Element(el).hasClass(sClassPrefix + "block")) ? el : jindo.$$.getSingle("! ." + sClassPrefix + "block", el);
		var nIndex = null;
		jindo.$A(this._aBlock).forEach(function(o, i) { 
			if (o === elBlock) {
				nIndex = i;
			} 
		});
		
		if (typeof nIndex == "number") {
			var elHandler = this.getHandler(nIndex);
			if (elHandler === elBlock || el === elHandler) {
				this.fireEvent(we.type, {
					element: el,
					nIndex: nIndex,
					weEvent : we
				});
			}
		}
	},
	
	_onMouseOut : function(we) {
		var el = we.element;
		if (el == this._el) {
			return;
		}
		var sClassPrefix = this.option("classPrefix");
		var elBlock = (jindo.$Element(el).hasClass(sClassPrefix + "block")) ? el : jindo.$$.getSingle("! ." + sClassPrefix + "block", el);
		var nIndexOfBlock = null;
		jindo.$A(this._aBlock).forEach(function(o, i) { 
			if (o === elBlock) {
				nIndexOfBlock = i;
			} 
		});

		var self = this;
		var bMouseOutFromLayer = true;
		jindo.$A(jindo.$$("! *", we.relatedElement)).forEach(function(o){
			if (o == self._el) {
				bMouseOutFromLayer = false;
				jindo.$A.Break();
			}
		});
		if(elBlock && bMouseOutFromLayer && typeof nIndexOfBlock == "number") {
			this.fireEvent(we.type, {
				element: elBlock,
				nIndex: nIndexOfBlock
			});
		}
	},
	
	/**
	 * 
	 * @param {Object} n
	 * @ignore
	 */
	_getHeadSize : function(n) {
		var el = this.getHead(n);
		el.style.zoom = 1; //ie rendering bug
		return { width : jindo.$Element(el).width(), height : jindo.$Element(el).height() };			
	},
	
	/**
	 * 
	 * @param {Object} n
	 * @ignore
	 */
	_getBodySize : function(n) {
		var el = this.getBody(n);
		el.style.zoom = 1; //ie rendering bug
		return { width : jindo.$Element(el).width(), height : jindo.$Element(el).height() };			
	},
	
	getTransition : function() {
		return this._oTransition;
	},
	
	/**
	 * n번째 블럭을 확장한다.
	 * @param {Number} n 
	 */
	expand : function(n) {
		var self = this;
		this._oTimer.abort();
		
		if (this.getExpanded() == n) {
			return;
		}
		
		var aArgs = new Array();
		aArgs.push(this.option("nDuration"));
		jindo.$A(this._aBlock).forEach(function(o,i){
			
			var aHeadSize = self._getHeadSize(i);
			var aBodySize = self._getBodySize(i);
			
			aArgs.push(self._aBlock[i]);
			
			switch (self.option("sDirection")) {
				case "vertical" :
					if (i == n) aArgs.push({ '@height' : jindo.Effect[self.option("sEffect")](aBodySize.height + aHeadSize.height + "px") });
					else aArgs.push({ '@height' : jindo.Effect[self.option("sEffect")](aHeadSize.height + "px") });
					break;
				case "horizontal" :
					if (i == n) aArgs.push({'@width': jindo.Effect[self.option("sEffect")](aBodySize.width + aHeadSize.width + "px")});
					else aArgs.push({ '@width': jindo.Effect[self.option("sEffect")](aHeadSize.width + "px")});
					break;
			}
		});
		this._oTimer.start(function(){
			self._oTransition.start.apply(self._oTransition, aArgs);
			self._setExpanded(n);	
		}, this.option("nExpandDelay"));
	},
	
	/**
	 * 모든 블럭을 확장한다.
	 */
	expandAll : function() {
		var self = this;
		this._oTimer.abort();
		
		var aArgs = new Array();
		aArgs.push(this.option("nDuration"));
		jindo.$A(this._aBlock).forEach(function(o,i){
			
			var aHeadSize = self._getHeadSize(i);
			var aBodySize = self._getBodySize(i);
			
			aArgs.push(self._aBlock[i]);
			switch (self.option("sDirection")) {
				case "vertical" :
					aArgs.push({ '@height' : jindo.Effect[self.option("sEffect")](aBodySize.height + aHeadSize.height + "px") });
					break;
				case "horizontal" :
					aArgs.push({'@width': jindo.Effect[self.option("sEffect")](aBodySize.width + aHeadSize.width + "px")});
					break;
			}
		});
		this._oTimer.start(function(){
			self._oTransition.start.apply(self._oTransition, aArgs);
			self._setExpanded("all");	
		}, this.option("nExpandDelay"));
		
	},

	/**
	 * 모든 블럭을 축소한다.
	 * @param n 지연시간 (ms)
	 */
	contractAll : function() {
		var self = this;
		var aArgs = new Array();
		aArgs.push(this.option("nDuration"));
		jindo.$A(this._aBlock).forEach(function(o,i){
			aArgs.push(self._aBlock[i]);
			var aHeadSize = self._getHeadSize(i);
			switch (self.option("sDirection")) {
				case "vertical" :
					aArgs.push({ '@height' : jindo.Effect[self.option("sEffect")](aHeadSize.height + "px") });
					break;
				case "horizontal" :
					aArgs.push({ '@width': jindo.Effect[self.option("sEffect")](aHeadSize.width + "px")});
					break;
			}
		});
		this._oTimer.start(function(){
			self._oTransition.start.apply(self._oTransition, aArgs);
			self._setExpanded(null);
		}, this.option("nContractDelay"));
	},
	
	_setExpanded : function(n) {
		this.nExpanded = n;
	},
	
	/**
	 * 몇 번째 블럭이 확장되었는지 가져온다.
	 * @return {Number} 전체확장일 경우 "all", 전체 축소일경우 null  
	 */
	getExpanded : function() {
		return this.nExpanded;
	},
	
	/**
	 * Block을 가져온다.
	 * @param {Object} n
	 */
	getBlock : function(n) {
		return this._aBlock[n];
	},
	
	/**
	 * 모든 Block을 가져온다.
	 * @return {Array}
	 */
	getAllBlocks : function() {
		return this._aBlock;
	},
	
	/**
	 * Block의 Head를 가져온다.
	 * Head는 Block이 축소되었을때도 항상 노출되는 제목 부분이다.
	 * @param {Object} n
	 */
	getHead : function(n) {
		var elBlock = this.getBlock(n);
		return jindo.$$.getSingle("dt", elBlock);
	},
	
	/**
	 * Block의 Body를 가져온다.
	 * Body는 Block이 확장되었을때만 노출되는 내용 부분이다.
	 * @param {Object} n
	 */
	getBody : function(n) {
		var elBlock = this.getBlock(n);
		return jindo.$$.getSingle("dd", elBlock);
	},
	
	/**
	 * 이벤트를 처리할 핸들러 엘리먼트를 가져온다.
	 * 해당 block내에 클래스명 "handler" 를 가진 엘리먼트를 리턴하고
	 * 없을 경우 해당 block을 리턴한다.
	 * @return {HTMLElemenr}
	 */
	getHandler : function(n) {
		var sClassPrefix = this.option("classPrefix");
		var elBlock = this.getBlock(n);
		return jindo.$$.getSingle("."+sClassPrefix+"handler", elBlock) || this.getBlock(n);
	}
	
}).extend(jindo.UIComponent);

/**
 * @fileOverview 달력을 통해 Input Form에 날짜를 입력하기 위한 날짜선택 컴포넌트
 * @name DatePicker.js
 * @author senxation
 * @version 0.6.3
 */

jindo.DatePicker = jindo.$Class({
	/** @lends jindo.DatePicker.prototype */
	
	_aDatePickerSet : [],
	_htSelectedDatePickerSet : null, //클릭된 엘리먼트에 대한 DatePickerSet
	
	/**
	 * DatePicker 컴포넌트를 생성한다.
	 * Calendar 컴포넌트를 통해 출력된 달력의 날짜 선택으로 Input의 값을 입력한다.
	 * @constructs
	 * @class 달력을 통해 Input Form에 날짜를 입력하기 위한 날짜선택 컴포넌트
	 * @extends jindo.UIComponent
	 * @requires jindo.Calendar
	 * @requires jindo.LayerManager
	 * @requires jindo.LayerPosition
	 * @param {HTMLElement} elCalendarLayer 달력을 출력할 레이어 엘리먼트 혹은 id 
	 * @param {htOption} htOption 초기화 옵션 설정을 위한 객체.
     * @example 
var oDatePicker = new jindo.DatePicker("calendar_layer", {
	bUseLayerPosition : true, //LayerPosition을 사용해서 포지셔닝을 할지의 여부
	
	Calendar : { //Calendar를 위한 옵션
		sClassPrefix : "calendar-", //Default Class Prefix
		nYear : oDate.getFullYear(),
		nMonth : oDate.getMonth() + 1,
		nDate : oDate.getDate(),			
		sTitleFormat : "yyyy-mm", //달력의 제목부분에 표시될 형식
		aMonthTitle : ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] //월 이름
	},
	
	LayerManager : { //LayerManager를 위한 옵션
		sCheckEvent : "click",
		nShowDelay : 0, 
		nHideDelay : 0
	},
	
	LayerPosition : { //LayerPosition을 위한 옵션
		sPosition: "outside-bottom",
		sAlign: "left",
		nTop: 0,
		nLeft: 0,
		bAuto: false
	}
}).attach({
	focus : function() {
		//Input에 포커스 되었을 때 발생 
	},
	click : function(oCustomEvent) {
		//Input에 마우스를 클릭 하였을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	element : (HTMLElement) 클릭된 엘리먼트
		//}
	},
	beforeDraw : function(oCustomEvent) {
		//달력을 새로 그리기 전 발생
		//전달되는 이벤트 객체 e = {
		//	nYear : (Number) 연 (ex. 2009) 
		//	nMonth : (Number) 월 (ex. 5)
		//}
		//oCustomEvent.stop()을 실행하면 draw 커스텀 이벤트가 발생하지 않는다. 
	},
	draw : function(oCustomEvent) {
		//달력을 새로 그리는 중 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	element : (HTMLElement) 날짜가 쓰여질 목표 엘리먼트
		//	nYear : (Number) 연 (ex. 2009) 
		//	nMonth : (Number) 월 (ex. 5)
		//	nDate : (Number) 일 (ex. 12)
		//}
	},
	afterDraw : function(oCustomEvent) {
		//달력을 그린 이후 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	nYear : (Number) 연 (ex. 2009) 
		//	nMonth : (Number) 월 (ex. 5)
		//}
	},
	beforeSelect : function(oCustomEvent) {
		//달력레이어에서 날짜를 선택하고 Text Input에 값이 설정되기 직전에 실행
		//전달되는 이벤트 객체 oCustomEvent = {
		//	sText : (String) Text Input에 설정될 값
		//	nYear : (Number) 연 (ex. 2009) 
		//	nMonth : (Number) 월 (ex. 5)
		//	nDate : (Number) 일
		//}
		//oCustomEvent.stop()을 실행하면 select 이벤트가 발생되기전에 수행을 중단한다.
	},
	select : function(oCustomEvent) {
		//달력레이어에서 날짜를 선택하고 Text Input에 값이 설정된 이후 실행
		//전달되는 이벤트 객체 oCustomEvent = {
		//	nYear : (Number) 연 (ex. 2009) 
		//	nMonth : (Number) 월 (ex. 5)
		//	nDate : (Number) 일
		//}
	}
});
	 * @example 
옵션의 dateFormat은 날짜의 형식으로 다음의 형식을 조합하여 사용할 수 있다.
ex) "yyyy.m.d", "yyyy년 m월 d일", "yy m/d" ...
연도 : yyyy(4자리 숫자, ex "2001"), yy(2자리 숫자, ex "01")
월 : mm(2자리 숫자, ex "01"), m(1자리 숫자, ex "1"), M(monthTitle에 설정된 값으로 보여줌 ex "JAN")
일 : dd(2자리 숫자, ex "01"), d(1자리 숫자, ex "1")
	 * @example 
옵션의 titleFormat은 날짜의 형식으로 다음의 형식을 조합하여 사용할 수 있다.
ex) "yyyy.m", "yyyy년 m월", "yy/m" ...
연도 : yyyy(4자리 숫자, ex "2001"), yy(2자리 숫자, ex "01")
월 : mm(2자리 숫자, ex "01"), m(1자리 숫자, ex "1"), M(monthTitle에 설정된 값으로 보여줌 ex "JAN")
	 */	
	$init : function(elCalendarLayer, htOption) {
		var oDate = new Date();
		this.htDefaultOption = {
			bUseLayerPosition : true, //LayerPosition을 사용해서 포지셔닝을 할지의 여부
			
			Calendar : { //Calendar를 위한 옵션
				sClassPrefix : "calendar-", //Default Class Prefix
				nYear : oDate.getFullYear(),
				nMonth : oDate.getMonth() + 1,
				nDate : oDate.getDate(),			
				sTitleFormat : "yyyy-mm", //달력의 제목부분에 표시될 형식
				aMonthTitle : ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] //월 이름
			},
			
			LayerManager : { //LayerManager를 위한 옵션
				sCheckEvent : "click",
				nShowDelay : 0, 
				nHideDelay : 0
			},
			
			LayerPosition : { //LayerPosition을 위한 옵션
				sPosition: "outside-bottom",
				sAlign: "left",
				nTop: 0,
				nLeft: 0,
				bAuto: false
			}
		};
		this.option(this.htDefaultOption);
		this.option(htOption);
		
		this._elCalendarLayer = jindo.$(elCalendarLayer);
		this._initCalendar();
		this._initLayerManager();
		this._initLayerPosition();	
		
		this._wfFocusInput = jindo.$Fn(this._onFocusInput, this);
		this._wfClickLinkedElement = jindo.$Fn(this._onClickLinkedElement, this);
		this._wfMouseOverOutDate = jindo.$Fn(this._onMouseOverOutDate, this);
		this._wfClickDate = jindo.$Fn(this._onClickDate, this);
		
		this.activate(); //컴포넌트를 활성화한다.
	},
	
	/**
	 * DatePicker를 적용할 셋을 추가한다.
	 * @param {HashTabel} ht
	 * @return {this} this
	 * @example
oDatePicker.addDatePickerSet({
	elInput : jindo.$("input"), //날짜가 입력될 input 엘리먼트
	elButton : jindo.$("button"), //input외에도 달력을 보이게 할 엘리먼트
	elLayerPosition : jindo.$("input"), //LayerPosition 컴포넌트로 자동으로 위치 조절시 기준이 되는 엘리먼트 (생략시 elInput이 디폴트)
	htOption : {
		nYear : 1983, //기본으로 설정될 연도
		nMonth : 5, //기본으로 설정될 월
		nDate : 12, //기본으로 설정될 일
		
		bDefaultSet : true, //true이면 기본 Input 값을 설정한다. false이면 설정하지 않는다.
		bReadOnly : true, //true이면 input에 직접 값을 입력하지 못한다.
		sDateFormat : "yyyy-mm-dd", //input에 입력될 날짜의 형식
		htSelectableDateFrom : { //선택가능한 첫 날짜
			nYear : 1900,
			nMonth : 1,
			nDate : 1				
		},
		htSelectableDateTo : { //선택가능한 마지막 날짜
			nYear : 2100,
			nMonth : 12,
			nDate : 31
		}
	}
});
	 */
	addDatePickerSet : function(ht) {
		var htOption = this.option(),
			htCalendarOption = this.getCalendar().option(),
			htDefaultOption = {
				nYear : htCalendarOption.nYear,
				nMonth : htCalendarOption.nMonth,
				nDate : htCalendarOption.nDate,
				bDefaultSet : true,
				bReadOnly : true, //true이면 input에 직접 값을 입력하지 못한다.
				sDateFormat : "yyyy-mm-dd", //input에 입력될 날짜의 형식
				htSelectableDateFrom : { //선택가능한 첫 날짜
					nYear : 1900,
					nMonth : 1,
					nDate : 1				
				},
				htSelectableDateTo : { //선택가능한 마지막 날짜
					nYear : 2100,
					nMonth : 12,
					nDate : 31
				}
			};
			
		if (typeof ht.htOption != "undefined") {
			//빈 값은 기본값으로 셋팅해줌.
			for (var value in ht.htOption) {
				if (typeof htDefaultOption[value] != "undefined") {
					htDefaultOption[value] = ht.htOption[value]; 
				}
			}
		} 	
		ht.htOption = htDefaultOption;
		
		this._aDatePickerSet.push(ht);
		
		var oLayerManager = this.getLayerManager();
		if (typeof ht.elInput != "undefined") {
			oLayerManager.link(ht.elInput);
			if (ht.htOption.bReadOnly) {
				ht.elInput.readOnly = true;
			}
			this._wfFocusInput.attach(ht.elInput, "focus");
			this._wfClickLinkedElement.attach(ht.elInput, "click");
		}
		
		if (typeof ht.elButton != "undefined") {
			oLayerManager.link(ht.elButton);
			this._wfClickLinkedElement.attach(ht.elButton, "click");
		}
		
		if (ht.htOption.bDefaultSet) {
			this._setDate(ht, ht.htOption);
		}
		return this;	
	},
	
	/**
	 * DatePicker를 적용할 셋을 제거한다.
	 * @param {HashTable} ht
	 * @return {this} this
	 * @example
oDatePicker.removeDatePickerSet({
	elInput : jindo.$("input"), //날짜가 입력될 input 엘리먼트
	elButton : jindo.$("button") //input외에도 달력을 보이게 할 엘리먼트 (생략가능)
})
	 */
	removeDatePickerSet : function(ht) {
		var nIndex = -1;
		for (var i = 0, len = this._aDatePickerSet.length ; i < len; i++) {
			if (this._aDatePickerSet[i].elInput == ht.elInput || this._aDatePickerSet[i].elButton == ht.elButton) {
				nIndex = i;
				break;				
			}
		}
		
		var htDatePickerSet = this._aDatePickerSet[nIndex];
		var oLayerManager = this.getLayerManager();
		if (typeof htDatePickerSet.elButton != "undefined") {
			oLayerManager.unlink(htDatePickerSet.elButton);
			this._wfClickLinkedElement.detach(htDatePickerSet.elButton, "click");
		}
		
		if (typeof htDatePickerSet.elInput != "undefined") {
			this._wfFocusInput.detach(htDatePickerSet.elInput, "focus");
			this._wfClickLinkedElement.detach(htDatePickerSet.elInput, "click");
			htDatePickerSet.elInput.readOnly = false;
		}
		if (htDatePickerSet == this._htSelectedDatePickerSet) {
			this._htSelectedDatePickerSet = null;
		}		
		this._aDatePickerSet.splice(i, 1);
		
		return this;
	},
	
	/**
	 * 추가된 DatePickerSet의 배열을 가져온다.
	 * 파라메터로 엘리먼트가 전달될 경우 해당 엘리먼트가 속하는 DatePickerSet를 리턴한다. 
	 * @param {HTMLElement} el
	 * @return {Array | Object}
	 */
	getDatePickerSet : function(el) {
		if(typeof el == "undefined") {
			return this._aDatePickerSet;
		}
		
		for (var i = 0, len = this._aDatePickerSet.length; i < len; i++) {
			if (this._aDatePickerSet[i].elInput == el || this._aDatePickerSet[i].elButton == el) {
				return this._aDatePickerSet[i];				
			}
		}
		return false;
	},
	
	/**
	 * 달력레이어를 가져온다.
	 * @return {HTMLElement}
	 */
	getCalendarLayer : function() {
		return this._elCalendarLayer;
	},
	
	_initCalendar : function() {
		/**
		 * 달력 오브젝트
		 * @type Object jindo.Calendar 컴포넌트 
		 * @see jindo.Calendar
		 */
		var self = this;
		this._oCalendar = new jindo.Calendar(this.getCalendarLayer(), this.option("Calendar")).attach({
			beforeDraw : function(oCustomEvent) {
				if(!self.fireEvent("beforeDraw", oCustomEvent)) {
					oCustomEvent.stop();
				}
			},
			draw : function(oCustomEvent) {
				//선택한 날짜 class명 부여
				var sClassPrefix = this.option("sClassPrefix");
				var oShowDatePickerSet = self._htSelectedDatePickerSet;
				
				if (self.isSelectable(oShowDatePickerSet, oCustomEvent)) {
					oCustomEvent.bSelectable = true;
					if (jindo.Calendar.isSameDate(oCustomEvent, oShowDatePickerSet)) {
						jindo.$Element(oCustomEvent.elDateContainer).addClass(sClassPrefix + "selected");
					}
				} else {
					oCustomEvent.bSelectable = false;
					jindo.$Element(oCustomEvent.elDateContainer).addClass(this.option("sClassPrefix") + "unselectable");
				}
				
				if(!self.fireEvent("draw", oCustomEvent)) {
					oCustomEvent.stop();
				}
			},
			afterDraw : function(oCustomEvent) {
				self.fireEvent("afterDraw", oCustomEvent);
			}
		});
	},
	
	/**
	 * Calendar 객체를 가져온다.
	 * @return {jindo.Calendar}
	 * @see jindo.Calendar
	 */
	getCalendar : function() {
		return this._oCalendar;
	},
	
	_initLayerManager : function() {
		var self = this;
		var elCalendarLayer = this.getCalendarLayer();
		this._oLayerManager = new jindo.LayerManager(elCalendarLayer, this.option("LayerManager")).attach({
			hide : function(oCustomEvent) {
				self._htSelectedDatePickerSet = null;
			}
		}).link(elCalendarLayer);
	},

	/**
	 * LayerManager 객체를 가져온다.
	 * @return {jindo.LayerManager}
	 */	
	getLayerManager : function() {
		return this._oLayerManager;
	},
	
	_initLayerPosition : function() {
		if (this.option("bUseLayerPosition")) {
			this._oLayerPosition = new jindo.LayerPosition(null, this.getCalendarLayer(), this.option("LayerPosition"));
		}
	},
	
	/**
	 * LayerPosition 객체를 가져온다.
	 * @return {jindo.LayerPosition}
	 */
	getLayerPosition : function() {
		return this._oLayerPosition;
	},
	
	/**
	 * DatePickerSet에 해당하는 elInput 엘리먼트를 가져온다.
	 * 값이 없는 경우 null을 리턴한다.
	 * @param {HashTable} htDatePickerSet
	 * @return {HTMLElement}  
	 */
	getInput : function(htDatePickerSet) {
		return htDatePickerSet.elInput || null;
	},
	
	/**
	 * elInput에 형식에 맞는 날짜값을 설정한다.
	 * @param {HashTable} htDatePickerSet
	 * @param {HashTable} htDate
	 * @deprecated 
	 */
	setInput : function(htDatePickerSet, htDate) {
		this._setDate(htDatePickerSet, htDate);
	},
	
	/**
	 * 선택된 날짜를 가져온다.
	 * @param {HashTable} htDatePickerSet
	 * @return {HashTable} 
	 */
	getDate : function(htDatePickerSet) {
		return {
			nYear : htDatePickerSet.nYear,
			nMonth : htDatePickerSet.nMonth,
			nDate : htDatePickerSet.nDate 
		};
	},
	
	_setDate : function(htDatePickerSet, htDate) {
		htDatePickerSet.nYear = htDate.nYear * 1;
		htDatePickerSet.nMonth = htDate.nMonth * 1;
		htDatePickerSet.nDate = htDate.nDate * 1;
		if (typeof htDatePickerSet.elInput != "undefined") {
			htDatePickerSet.elInput.value = this._getDateFormat(htDatePickerSet, htDate);
		}
	},
	
	/**
	 * 선택가능한 날짜인지 확인한다.
	 * @param {HashTable} htDatePickerSet
	 * @param {HashTable} htDate
	 */
	isSelectable : function(htDatePickerSet, htDate) {
		return jindo.Calendar.isBetween(htDate, htDatePickerSet.htOption["htSelectableDateFrom"], htDatePickerSet.htOption["htSelectableDateTo"]);
	},
	
	/**
	 * 날짜를 선택한다.
	 * DatePickerSet에 elInput이 있는 경우 형식에 맞는 날짜값을 설정한다.
	 * @param {HashTable} htDatePickerSet
	 * @param {HashTable} htDate
	 */
	setDate : function(htDatePickerSet, htDate) {
		if (this.isSelectable(htDatePickerSet, htDate)) {
			var sDateFormat = this._getDateFormat(htDatePickerSet, htDate);
			var htParam = {
				"sText": sDateFormat,
				"nYear": htDate.nYear,
				"nMonth": htDate.nMonth,
				"nDate": htDate.nDate
			};
			if (this.fireEvent("beforeSelect", htParam)) {
				this._setDate(htDatePickerSet, htDate);
				if (this.fireEvent("select", htParam)) {
					this.getLayerManager().hide();
				}
			}
			return true;
		}
		return false;
	},
	
	/**
	 * option("sDateFormat")에 맞는 형식의 문자열을 구한다.
	 * @param {HashTable} htDatePickerSet	 
	 * @param {HashTable} htDate  
	 * @return {String} sDateFormat
	 * @ingore
	 */
	_getDateFormat : function(htDatePickerSet, htDate) {
		var nYear = htDate.nYear;
		var nMonth = htDate.nMonth;
		var nDate = htDate.nDate;
		
		if (nMonth < 10) {
			nMonth = ("0" + (nMonth * 1)).toString();
		}
        if (nDate < 10) {
            nDate = ("0" + (nDate * 1)).toString();
		} 
		
		var sDateFormat = htDatePickerSet.htOption.sDateFormat;
		sDateFormat = sDateFormat.replace(/yyyy/g, nYear).replace(/y/g, (nYear).toString().substr(2,2)).replace(/mm/g, nMonth).replace(/m/g, (nMonth * 1)).replace(/M/g, this.getCalendar().option("aMonthTitle")[nMonth-1] ).replace(/dd/g, nDate).replace(/d/g, (nDate * 1));	
		return sDateFormat;
	},
	
	_linkOnly : function (htDatePickerSet) {
		var oLayerManager = this.getLayerManager();
		oLayerManager.setLinks([this.getCalendarLayer()]);
		if (typeof htDatePickerSet.elInput != "undefined") {
			oLayerManager.link(htDatePickerSet.elInput);
		}
		if (typeof htDatePickerSet.elButton != "undefined") {
			oLayerManager.link(htDatePickerSet.elButton);	
		}
	},
	
	/**
	 * 컴포넌트를 활성화한다.
	 */
	_onActivate : function() {
		var elCalendarLayer = this.getCalendarLayer();
		this._wfMouseOverOutDate.attach(elCalendarLayer, "mouseover").attach(elCalendarLayer, "mouseout");
		this._wfClickDate.attach(elCalendarLayer, "click");
		this.getLayerManager().activate();
		this.getCalendar().activate();
	},
	
	/**
	 * 컴포넌트를 비활성화한다.
	 */
	_onDeactivate : function() {
		var elCalendarLayer = this.getCalendarLayer();
		this._wfMouseOverOutDate.detach(elCalendarLayer, "mouseover").detach(elCalendarLayer, "mouseout");
		this._wfClickDate.detach(elCalendarLayer, "click").detach(elCalendarLayer, "mouseover").detach(elCalendarLayer, "mouseout");
		this.getLayerManager().deactivate();
		this.getCalendar().deactivate();
	},
	/**
	 * @deprecated
	 */
	attachEvent : function() {
		return this.activate();
	},
	/**
	 * @deprecated
	 */
	detachEvent : function() {
		return this.deactivate();		
	},
	/**
	 * @deprecated
	 */
	addButton : function() {
		return this;
	},
	
	_onFocusInput : function(we){
		this.fireEvent("focus");
	},
	
	_onClickLinkedElement : function(we){
		we.stop(jindo.$Event.CANCEL_DEFAULT);
		if (this.fireEvent("click", {
			element: we.element
		})) {
			var htDatePickerSet = this.getDatePickerSet(we.currentElement);
			if (htDatePickerSet) {
	            this._htSelectedDatePickerSet = htDatePickerSet;
	            this._linkOnly(htDatePickerSet);
	            if (!htDatePickerSet.nYear) {
	                htDatePickerSet.nYear = htDatePickerSet.htOption.nYear;
	            }
	            if (!htDatePickerSet.nMonth) {
	                htDatePickerSet.nMonth = htDatePickerSet.htOption.nMonth;
	            }
	            if (!htDatePickerSet.nDate) {
	                htDatePickerSet.nDate = htDatePickerSet.htOption.nDate;
	            }
	            var nYear = htDatePickerSet.nYear;
	            var nMonth = htDatePickerSet.nMonth;
	            this.getCalendar().draw(nYear, nMonth);
	            this.getLayerManager().show();
	            if (this.option("bUseLayerPosition")) {
	                if (typeof htDatePickerSet.elLayerPosition != "undefined") {
	                    this.getLayerPosition().setElement(htDatePickerSet.elLayerPosition).setPosition();
	                } else {
	                    this.getLayerPosition().setElement(htDatePickerSet.elInput).setPosition();
	                }
	            }
			}
		}
	},
	
	_getTargetDateElement : function(el) {
		var sClassPrefix = this.getCalendar().option("sClassPrefix");
		var elDate = (jindo.$Element(el).hasClass(sClassPrefix + "date")) ? el : jindo.$$.getSingle("."+ sClassPrefix + "date", el);
		if (elDate && (elDate == el || elDate.length == 1)) {
			return elDate;
		}
		return null;
	},
	
	_getTargetDateContainerElement : function(el) {
		var sClassPrefix = this.getCalendar().option("sClassPrefix");
		var elWeek = jindo.$$.getSingle("! ." + sClassPrefix + "week", el);
		if (elWeek) {
			var elReturn = el;
			while(!jindo.$Element(elReturn.parentNode).hasClass(sClassPrefix + "week")) {
				elReturn = elReturn.parentNode;
			}
			if (jindo.$Element(elReturn).hasClass(sClassPrefix + "unselectable")) {
				return null;
			}
			return elReturn;
		} else {
			return null;
		}
	},
	
	_onMouseOverOutDate : function(we) {
		we.stop(jindo.$Event.CANCEL_DEFAULT);
		var sClassPrefix = this.getCalendar().option("sClassPrefix");
		var el = we.element;
		var elDateContainer = this._getTargetDateContainerElement(el);
		if (elDateContainer) {
			var htDate = this.getCalendar().getDateOfElement(elDateContainer);
			if (this._htSelectedDatePickerSet && this.isSelectable(this._htSelectedDatePickerSet, htDate)) {
				if (we.type == "mouseover") {
					if (!this._elSelected) {
						this._elSelected = jindo.$$.getSingle("." + sClassPrefix + "selected", this.elWeekAppendTarget);
						if (this._elSelected) {
							jindo.$Element(this._elSelected).removeClass(sClassPrefix + "selected");
						}
					}
					jindo.$Element(elDateContainer).addClass(sClassPrefix + "over");
					return;
				}
				
				if (we.type == "mouseout") {
					jindo.$Element(elDateContainer).removeClass(sClassPrefix + "over");
					return;
				}
			} else {
				if (this._elSelected) {
					jindo.$Element(this._elSelected).addClass(sClassPrefix + "selected");
					this._elSelected = null;
				}
			}
		} else {
			if (this._elSelected) {
				jindo.$Element(this._elSelected).addClass(sClassPrefix + "selected");
				this._elSelected = null;
			}
		}
	},
	
	_onClickDate : function(we){
		we.stop(jindo.$Event.CANCEL_DEFAULT);
		var el = we.element;
		
		var elDate = this._getTargetDateElement(el);
		if (elDate) {
			var elDateContainer = this._getTargetDateContainerElement(elDate);
			if (elDateContainer) {
				var htDate = this.getCalendar().getDateOfElement(elDateContainer);
				if (this.isSelectable(this._htSelectedDatePickerSet, htDate)) {
					this.setDate(this._htSelectedDatePickerSet, htDate);
				}
			}
		} 
	}
}).extend(jindo.UIComponent);

/**
 * @fileOverview Text Input에 입력값이 없을 경우 "입력해주세요"와 같이 기본 안내 문구를 등록한다
 * @author senxation
 * @version 0.2.2
 */

jindo.DefaultTextValue = jindo.$Class({
	/** @lends jindo.DefaultTextValue.prototype */
		
	/**
	 * 컴포넌트를 생성한다.
	 * input[type=text] 나 textarea에 적용될 수 있다.
	 * @constructs
	 * @class Text Input에 기본 안내 문구를 설정하는 컴포넌트
	 * @param {HTMLElement} el 베이스(기준) 엘리먼트
	 * @param {HashTable} htOption 옵션 객체
	 * @extends jindo.UIComponent
	 */
	$init : function(el, htOption) {
		this.option({
			sValue : "", //입력창에 기본으로 보여줄 값
			bActivateOnload : true //로드시 컴포넌트 활성화여부
		});
		this.option(htOption || {});
		
		//Base 엘리먼트 설정
		this._elBaseTarget = jindo.$(el);
		this._wfOnFocusAndBlur = jindo.$Fn(this._onFocusAndBlur, this);

		//활성화
		if(this.option("bActivateOnload")) {
			this.activate(); //컴포넌트를 활성화한다.	
		}
	},

	/**
	 * 컴포넌트의 베이스 엘리먼트를 가져온다.
	 * @return {HTMLElement}
	 */
	getBaseElement : function() {
		return this._elBaseTarget;
	},
	
	/**
	 * input의 value를 디폴트 값으로 설정한다.
	 * @return {this}
	 */
	setDefault : function() {
		this.getBaseElement().value = this.option("sValue");
		return this;
	},
	
	/**
	 * 입력창에 기본으로 보여줄 값을 설정한다.
	 * @param {String} sValue
	 * @return {this}
	 */
	setDefaultValue : function(sValue) {
		var sOldValue = this.option("sValue");
		this.option("sValue", sValue);
		if (this.getBaseElement().value == sOldValue) {
			this.setDefault();
		}
		return this;
	},
	
	/**
	 * 입력창에 기본으로 보여줄 값을 가져온다.
	 */
	getDefaultValue : function() {
		return this.option("sValue");
	},
	
	/**
	 * 입력창의 값을 확인하여 디폴트 값이면 빈값으로, 빈값이면 디폴트 값으로 변경한다.
	 * @return {this}
	 */
	paint : function() {
		var el = this._elBaseTarget;
		var sDefaultValue = this.getDefaultValue();
		var sValue = el.value;
		if (sValue == sDefaultValue) {
			el.value = "";
			el.select(); //IE에서 커서가 사라지는 문제가 있어 추가
		} else if (jindo.$S(sValue).trim().$value() == "") {
			this.setDefault();
		}
		return this;
	},
	
	_onActivate : function() {
		//초기화시 Input의 값이 없을 경우에만 Default Text로 변경
		var elInput = this.getBaseElement();
		if (elInput.value == "") {
			this.setDefault();
		}
		this._wfOnFocusAndBlur.attach(elInput, "focus").attach(elInput, "blur");
	},
	
	_onDeactivate : function() {
		var elInput = this.getBaseElement();
		this._wfOnFocusAndBlur.detach(elInput, "focus").detach(elInput, "blur");
	},
	
	_onFocusAndBlur : function() {
		this.paint();
	}
}).extend(jindo.UIComponent);	
/**
 * @fileOverview 브라우저가 스크롤되어도 항상 레이어가 따라오도록 위치를 고정시키는 컴포넌트 
 * @author hooriza, modified by senxation
 * @version 0.1.1
 */
 
jindo.FloatingLayer = jindo.$Class({
	/** @lends jindo.FloatingLayer.prototype */ 

	/**
	 * FloatingLayer 컴포넌트를 생성한다.
	 * @constructs
	 * @class 브라우저가 스크롤되어도 항상 레이어가 따라오도록 위치를 고정시키는 컴포넌트
	 * @param {String | HTMLElement} el 고정시킬 레이어 엘리먼트 (또는 id)
	 * @param {HashTable} htOption 옵션 객체
	 * @extends jindo.UIComponent
	 * @requires jindo.Effect
	 * @requires jindo.Timer
	 * @requires jindo.Transition
	 * @example
new jindo.FloatingLayer($('LU_layer'), {
	nDelay : 0, // (Number) 스크롤시 nDelay(ms) 이후에 이동
	nDuration : 500, // (Number) Transition이 수행될 시간
	sEffect : jindo.Effect.easeOut, // (Function) 레이어 이동에 적용될 jindo.Effect 함수
	bActivateOnload : true //(Boolean) 로드와 동시에 activate 할지 여부
}).attach({
	beforeMove : function(oCustomEvent) {
		//레이어가 이동하기 전에 발생
		//oCustomEvent.nX : 레이어가 이동될 x좌표 (number)
		//oCustomEvent.nY : 레이어가 이동될 y좌표 (number)
	},
	move : function() {
		//레이어 이동후 발생
	}
});
	 */
	$init : function(el, htOption) {
		this._el = jindo.$(el);
		this._wel = jindo.$Element(el);
		
		this.option({
			nDelay : 0,
			nDuration : 500,
			fEffect : jindo.Effect.easeOut,
			bActivateOnload : true
		});
		
		this.option(htOption || {});
		this._htPos = this._getPosition();
		this._oTransition = new jindo.Transition().fps(60);
		this._oTimer = new jindo.Timer();
		this._wfScroll = jindo.$Fn(this._onScroll, this);
		
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	/**
	 * 사용된 jindo.Transition 컴포넌트의 인스턴스를 리턴한다.
	 * @return {jindo.Transition}
	 */
	getTransition : function() {
		return this._oTransition;
	},
	
	/**
	 * 사용된 jindo.Timer 컴포넌트의 인스턴스를 리턴한다.
	 * @return {jindo.Timer}
	 */
	getTimer : function() {
		return this._oTimer;
	},
	
	_onActivate : function() {
		var self = this;
		setTimeout(function() { 
			self._onScroll(); 
		}, 0);
		
		this._wfScroll.attach(window, 'scroll').attach(window, 'resize');
	},
	
	_onDeactivate : function() {
		this._wfScroll.detach(window, 'scroll').detach(window, 'resize');
	},
	
	_getPosition : function() {
		var el = this._el;
		var wel = this._wel;

		var sLeft = el.style.left;
		var sRight = el.style.right;
		var sTop = el.style.top;
		var sBottom = el.style.bottom;
		
		var htPos = {
			sAlignX : sLeft ? 'left' : (sRight ? 'right' : null),
			sAlignY : sTop ? 'top' : (sBottom ? 'bottom' : null)
		};
		
		var htOffset = wel.offset();
		var htClientSize = jindo.$Document().clientSize();
		
		switch (htPos.sAlignX) {
			case "left" :
				htPos.nX = htOffset.left;
			break;
			case "right" :
				htPos.nX = Math.max(htClientSize.width - htOffset.left - wel.width(), parseFloat(sRight));
			break;
		}

		switch (htPos.sAlignY) {
			case "top" :
				htPos.nY = htOffset.top;
			break;
			case "bottom" :
				htPos.nY = Math.max(htClientSize.height - htOffset.top - wel.height(), parseFloat(sBottom));
			break;
		}
		
		return htPos;
	},
	
	_onScroll : function() {
		var self = this;
		
		this._oTimer.start(function() {
			self._paint();
		}, this.option('nDelay'));
	},
	
	_paint : function() {
		var oDoc = document.documentElement || document;
		var elBody = document.body;

		var el = this._el;
		var wel = this._wel;
		
		var htPos = this._htPos;
		var htScrollPos = {};

		var htOffset = jindo.$Element(el).offset(); // 플로팅 객체의 위치
		var nPosX, nPosY;
		
		var htParam = { nX : null, nY : null };

		if (htPos.sAlignX) {
			switch (htPos.sAlignX) {
			case 'left':
				htScrollPos.x = oDoc.scrollLeft || elBody.scrollLeft;
				nPosX = htOffset.left - htScrollPos.x; // 스크롤 기준 선부터 얼마나 떨어져 있나
				break;
			
			case 'right':
				htScrollPos.x = (oDoc.scrollLeft || elBody.scrollLeft) + jindo.$Document().clientSize().width;
				nPosX = htScrollPos.x - (htOffset.left + wel.width());
				break;
			}
			
			htParam.nX = parseFloat(wel.css(htPos.sAlignX)) + (htPos.nX - nPosX);
		}
		
		if (htPos.sAlignY) {
			switch (htPos.sAlignY) {
			case 'top':
				htScrollPos.y = oDoc.scrollTop || elBody.scrollTop;
				nPosY = htOffset.top - htScrollPos.y; // 스크롤 기준 선부터 얼마나 떨어져 있나
				break;
			
			case 'bottom':
				htScrollPos.y = (oDoc.scrollTop || elBody.scrollTop) + jindo.$Document().clientSize().height;
				nPosY = htScrollPos.y - (htOffset.top + wel.height());
				break;
			}
			
			htParam.nY = parseFloat(wel.css(htPos.sAlignY)) + (htPos.nY - nPosY);
		}

		this.fireEvent('beforeMove', htParam);
		
		var htTransition = {};
		var fEffect = this.option("fEffect");

		if (htParam.nX !== null) {
			htTransition['@' + htPos.sAlignX] = fEffect(htParam.nX + 'px');
		}
		if (htParam.nY !== null) {
			htTransition['@' + htPos.sAlignY] = fEffect(htParam.nY + 'px');
		}
		
		var self = this;
		this._oTransition.abort().start(this.option('nDuration'), el, htTransition).start(function() {
			self.fireEvent('move');
		});
	}
}).extend(jindo.UIComponent);

/**
 * @fileOverview Text Input의 숫자값을 +/- 버튼 클릭이나 마우스 휠동작으로 증감시킬 수 있는 컴포넌트
 * @author cielo modified by senxation
 * @version 0.1
 */

jindo.NumericStepper = jindo.$Class({
	/** @lends jindo.NumericStepper */
		
	_bIsOnFocus : false, // Input Box에 focus 여부
	/**
	 * NumericStepper 컴포넌트를 생성한다.
	 * @constructs
	 * @param {HTMLElement} el 베이스(기준) 엘리먼트
	 * @param {HashTable} htOption 옵션 객체
	 * @extends jindo.UIComponent
	 * @example
var oNumericStepper = new jindo.NumericStepper(jindo.$("number_stepper"), {
	sClassPrefix : 'ns-', 	// Default Class Prefix
	bActivateOnload : true, // 로드시 컴포넌트 활성화여부
	bUseMouseWheel : false,	// 마우스 휠 사용 여부
	nStep : 1,				// (Number) 가감(+/-)이  일어나는 단위
	nDecimalPoint : 0,		// (Number) 소수점 몇째자리까지 표현할 것인지 지정
	nMin : -Infinity,		// (Number) 최소값	
	nMax : Infinity,		// (Number) 최대값
	nDefaultValue : 0, 		// (Number) Input Element의 default Value
	bInputReadOnly : true	// Input element가 직접입력 불가능하도록 지정
}).attach({
	beforeChange : function(oCustomEvent) {
		//값이 바뀌기 직전에 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	nValue = 변경하려한 값
		//	nMin = 옵션에서 정의한 최소값
		//	nMax = 옵션에서 정의한 최대값
		//}}
		//oCustomEvent.stop() 수행시 값이 바뀌지 않음
	},
	change : function(oCustomEvent) {
		//값이 바뀌고 난 뒤 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	nValue = 변경하려한 값
		//	nMin = 옵션에서 정의한 최소값
		//	nMax = 옵션에서 정의한 최대값
		//}
	},
	overLimit : function(oCustomEvent) {
		//전달되는 이벤트 객체 oCustomEvent = {
		//	nValue = 변경하려한 값
		//	nMin = 옵션에서 정의한 최소값
		//	nMax = 옵션에서 정의한 최대값
		//}
	}
});
	 */
	$init : function(el, htOption) {
		this._el = jindo.$(el); //Base 엘리먼트 설정
		
		this.option({
			sClassPrefix : 'ns-', 	// Default Class Prefix
			bActivateOnload : true, // 로드시 컴포넌트 활성화여부
			bUseMouseWheel : false,	// 마우스 휠 사용 여부
			nStep : 1,				// (Number) 가감(+/-)이  일어나는 단위
			nDecimalPoint : 0,		// (Number) 소수점 몇째자리까지 표현할 것인지 지정
			nMin : -Infinity,		// (Number) 최소값	
			nMax : Infinity,		// (Number) 최대값
			nDefaultValue : 0, 		// (Number) Input Element의 default Value
			bInputReadOnly : true	// Input element가 직접입력 불가능하도록 지정
		});
		this.option(htOption || {});
		
		this._assignHTMLElements(); //컴포넌트에서 사용되는 HTMLElement들을 선언하는 메소드
		this._initEventHandlers(); //컴포넌트에서 사용되는 이벤트 핸들러들을 초기화한다.
		
		if(this.option("bActivateOnload")) { //활성화
			this.activate(); //컴포넌트를 활성화한다.	
		}
	},

	/**
	 * 컴포넌트에서 사용되는 HTMLElement들을 선언하는 메소드
	 * @ignore
	 */
	_assignHTMLElements : function() {
		var sPrefix = this.option("sClassPrefix");
		this._elInput = jindo.$$.getSingle("." + sPrefix + "input",this._el);
		this._elPlusButton = jindo.$$.getSingle("." + sPrefix + "plus",this._el);
		this._elMinusButton = jindo.$$.getSingle("." + sPrefix + "minus",this._el);
	},
	
	/**
	 * 이벤트 핸들러들을 초기화한다.
	 * @ignore
	 */
	_initEventHandlers : function() {
		this._wfPlusClick = jindo.$Fn(this._onPlusClick, this);
		this._wfMinusClick = jindo.$Fn(this._onMinusClick, this);
		this._wfWheel = jindo.$Fn(this._onWheel, this);
		this._wfFocus = jindo.$Fn(this._onFocus, this);
		this._wfBlur = jindo.$Fn(this._onBlur, this);
	},

	/**
	 * 입력창의 값을 디폴트 값으로 리셋 시킨다.
	 */
	reset : function() {
		this._elInput.value = this.option("nDefaultValue").toFixed(this.option("nDecimalPoint"));
	},
	
	/**
	 * 지정된 숫자 값을 가져온다.
	 * @return {Number} 
	 */
	getValue : function() {
		return parseFloat(this._elInput.value);
	},
	
	/**
	 * 숫자 값을 설정한다.
	 */
	setValue : function(n) {
		n = n.toFixed(this.option("nDecimalPoint"));
		var nMin = this.option("nMin"),
			nMax = this.option("nMax"),
			htParam = {
				"nValue" : n,
				"nMin" : nMin, 
				"nMax" : nMax
			};
		
		if (n > nMax || n < nMin){
			this.fireEvent("overLimit", htParam);
			return;
		}
		
		if(!this.fireEvent("beforeChange", htParam)){
			return;
		}
		
		this._elInput.value = htParam.nValue;
		
		this.fireEvent("change", htParam);
	},
	
	/**
	 * 컴포넌트의 베이스 엘리먼트를 가져온다.
	 * @return {HTMLElement}
	 */
	getBaseElement : function() {
		return this._el;
	},
	
	/**
	 * 컴포넌트의 Input 엘리먼트를 가져온다.
	 * @return {HTMLElement}
	 */
	getInputElement : function() {
		return this._elInput;
	},
	
	/**
	 * 컴포넌트의 Plus 버튼 엘리먼트를 가져온다.
	 * @return {HTMLElement}
	 */
	getPlusElement : function() {
		return this._elPlusButton;
	},
	
	/**
	 * 컴포넌트의 Minus 버튼 엘리먼트를 가져온다.
	 * @return {HTMLElement}
	 */
	getMinusElement : function() {
		return this._elMinusButton;
	},
	
	/**
	 * input box의 focus
	 */
	isFocused : function() {
		return this._bIsOnFocus;
	},
	
	_onActivate : function() {
		var elInput = this.getInputElement();
		this._wfPlusClick.attach(this.getPlusElement(), "click");
		this._wfMinusClick.attach(this.getMinusElement(), "click");
		this._wfFocus.attach(elInput, "focus");
		this._wfBlur.attach(elInput, "blur");
		
		if (this.option("bUseMouseWheel")) {
			this._wfWheel.attach(elInput, "mousewheel");
		}
		
		this._elInput.readOnly = this.option("bInputReadOnly");
		this.reset();
	},
	
	_onDeactivate : function() {
		var elInput = this.getInputElement();
		this._wfPlusClick.detach(this.getPlusElement(), "click");
		this._wfMinusClick.detach(this.getMinusElement(), "click");
		this._wfInputClick.detach(elInput, "click");
		this._wfFocus.detach(elInput, "focus");
		this._wfBlur.detach(elInput, "blur");
		this._wfWheel.detach(elInput, "mousewheel");	
	},

	_onMinusClick : function(we) {
		this.setValue(this.getValue() - this.option("nStep"));
	},
	
	_onPlusClick : function(we) {
		this.setValue(this.getValue() + this.option("nStep"));
	},
	
	_onWheel : function(we) {
		if(this.isFocused()){
			we.stop(jindo.$Event.CANCEL_DEFAULT);
			if( we.mouse().delta > 0) {
				this._onPlusClick();
			} else {
				this._onMinusClick();
			}
		}
	},
	
	_onFocus : function(we) {
		this._bIsOnFocus = true;
	},
	
	_onBlur : function(we) {
		this._bIsOnFocus = false;
		this.setValue(this.getValue());
		this._elInput.readOnly = this.option("bInputReadOnly");
	}
}).extend(jindo.UIComponent);	
/**
 * @fileOverview 리스트에 페이지 목록 매기고 페이지에 따른 네비게이션을 구현한 컴포넌트
 * @author senxation
 * @version 0.4.3
 */
jindo.Pagination = jindo.$Class({
	/** @lends jindo.Pagination.prototype */
	
	/**
	 * 리스트에 페이지 목록 매기고 페이지에 따른 네비게이션을 구현한 컴포넌트.
	 * 기본 목록은 마크업에 static하게 정의되어있고, 페이지 이동을위해 클릭시마다 보여줄 아이템 목록을 Ajax Call을 통해 받아온다.
	 * 페이지 컴포넌트가 로드되면 .loaded 클래스명이 추가된다.
	 * @constructs
	 * @class 리스트에 페이지 목록 매기고 페이지에 따른 네비게이션을 구현한 컴포넌트
	 * @param {String | HTMLElement} sId 페이지목록을 생성할 엘리먼트 id 혹은 엘리먼트 자체
	 * @param {HashTable} htOption 옵션 객체
	 * @extends jindo.UIComponent
	 * @example 
var oPagination = new jindo.Pagination("paginate", {
	nItem : 1000, //(Number) 전체 아이템 개수
	nItemPerPage : 10, //(Number) 한 페이지에 표시될 아이템 개수
	nPagePerPageList : 10, //(Number) 페이지목록에 표시될 페이지 개수
	nPage : 1, //(Number) 초기 페이지
	sMoveUnit : "pagelist", //(String) 페이지목록 이동시 이동 단위 "page" || "pagelist"
	bAlignCenter : false, //(Boolean) 현재페이지가 항상 가운데 위치하도록 정렬. sMoveUnit이 "page"일 때만 사용
	sInsertTextNode : "", //(String) 페이지리스트 생성시에 각각의 페이지 노드를 한줄로 붙여쓰지 않게 하기 위해서는 "\n" 또는 " "를 설정한다. 이 옵션에 따라 렌더링이 달라질 수 있다.
	sClassFirst : "first-child", //(String) 첫번째 페이지리스트에 추가될 클래스명
	sClassLast : "last-child", //(String) 마지막 페이지리스트에 추가될 클래스명
	sPageTemplate : "<a href='#'>{=page}</a>", //(String) 페이지에 대한 템플릿. {=page}부분이 페이지 번호로 대치된다. 
	sCurrentPageTemplate : "<strong>{=page}</strong>", //(String) 현재페이지에 대한 템플릿. {=page}부분이 페이지 번호로 대치된다.
	elFirstPageLinkOn : (HTMLElement) '처음' 링크엘리먼트. 기본 값은 기준 엘리먼트 아래 pre_end 클래스명을 가지는 a 엘리먼트이다.
	elPrevPageLinkOn : (HTMLElement) '이전' 링크엘리먼트. 기본 값은 기준 엘리먼트 아래 pre 클래스명을 가지는 a 엘리먼트이다.
	elNextPageLinkOn : (HTMLElement) '다음' 링크엘리먼트. 기본 값은 기준 엘리먼트 아래 next 클래스명을 가지는 a 엘리먼트이다.
	elLastPageLinkOn : (HTMLElement) '마지막' 링크엘리먼트. 기본 값은 기준 엘리먼트 아래 next_end 클래스명을 가지는 a 엘리먼트이다.
	elFirstPageLinkOff : (HTMLElement) '처음' 엘리먼트. 기본 값은 기준 엘리먼트 아래 pre_end 클래스명을 가지는 span 엘리먼트이다.
	elPrevPageLinkOff : (HTMLElement) '이전' 엘리먼트. 기본 값은 기준 엘리먼트 아래 pre 클래스명을 가지는 span 엘리먼트이다.
	elNextPageLinkOff : (HTMLElement) '다음' 엘리먼트. 기본 값은 기준 엘리먼트 아래 next 클래스명을 가지는 span 엘리먼트이다.
	elLastPageLinkOff : (HTMLElement) '마지막' 엘리먼트. 기본 값은 기준 엘리먼트 아래 next_end 클래스명을 가지는 span 엘리먼트이다.
}).attach({
	beforeMove : function(oCustomEvent) {
		//페이지 이동을 위해 클릭했을때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	nPage : (Number) 클릭된 페이지
		//}
		//oCustomEvent.stop()을 수행하면 페이지 이동(move 이벤트)이 일어나지 않는다.
	},
	move : function(oCustomEvent) {
		//페이지 이동이 완료된 이후 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	nPage : (Number) 현재 페이지
		//}
	}
});
	 */
	$init : function(sId, htOption){
		this._elPageList = jindo.$(sId);
		this._welPageList = jindo.$Element(this._elPageList);
		this._waPage = jindo.$A([]);
		
		this._fClickPage = jindo.$Fn(this._onClickPageList, this);
		
		this.option({
			bActivateOnload : true,
			nItem : 10,
			nItemPerPage : 10,
			nPagePerPageList : 10,
			nPage : 1,
			sMoveUnit : "pagelist",
			bAlignCenter : false,
			sInsertTextNode : "",
			sClassFirst : "first-child",
			sClassLast : "last-child",
			sPageTemplate : "<a href='#'>{=page}</a>",
			sCurrentPageTemplate : "<strong>{=page}</strong>",
			elFirstPageLinkOn : jindo.$$.getSingle("a.pre_end", this._elPageList),
			elPrevPageLinkOn : jindo.$$.getSingle("a.pre", this._elPageList),
			elNextPageLinkOn : jindo.$$.getSingle("a.next", this._elPageList),
			elLastPageLinkOn : jindo.$$.getSingle("a.next_end", this._elPageList),
			elFirstPageLinkOff : jindo.$$.getSingle("span.pre_end", this._elPageList),
			elPrevPageLinkOff : jindo.$$.getSingle("span.pre", this._elPageList),
			elNextPageLinkOff : jindo.$$.getSingle("span.next", this._elPageList),
			elLastPageLinkOff : jindo.$$.getSingle("span.next_end", this._elPageList)
		});
		this.option(htOption || {});
		
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	/**
	 * 기준 엘리먼트를 구한다.
	 * @return {HTMLElement}
	 */
	getBaseElement : function() {
		return this._elPageList;
	},
	
	/**
	 * 전체 아이템의 개수를 리턴한다.
	 * @return {Number} 아이템 개수
	 */
	getItemCount : function() {
		return this.option("nItem");
	},
	
	/**
	 * 전체 아이템의 개수를 설정한다.
	 * @param {Number} n 아이템 개수
	 */
	setItemCount : function(n) {
		this.option({"nItem" : n});
	},
	
	/**
	 * 한 페이지에 보여줄 아이템의 개수를 구한다.
	 * @return {Number} 한 페이지에 보여줄 아이템의 개수
	 */
	getItemPerPage : function() {
		return this.option("nItemPerPage");
	},
	
	/**
	 * 한 페이지에 보여줄 아이템의 개수를 설정한다.
	 * @param {Object} n 아이템 개수
	 */
	setItemPerPage : function(n) {
		this.option("nItemPerPage", n);
	},
	
	/**
	 * 현재 페이지를 리턴한다.
	 * @return {Number} 현재 페이지
	 */
	getCurrentPage : function() {
		return this._nCurrentPage;
	},
	
	/**
	 * 해당 페이지의 첫번째 아이템이 전체 중 몇 번째 아이템인지 구한다.
	 * @param {Number} n 페이지 번호
	 * @return {Number} 
	 */
	getFirstItemOfPage : function(n) {
		return this.getItemPerPage() * (n - 1) + 1;
	},
	
	/**
	 * 아이템의 인덱스로부터 몇번째 페이지인지를 구한다.
	 * @param {Object} n
	 * @return {Number} 
	 */
	getPageOfItem : function(n) {
		return Math.ceil(n / this.getItemPerPage());	
	},
	
	_getLastPage : function() {
		return Math.ceil(this.getItemCount() / this.getItemPerPage());
	},

	_getRelativePage : function(sRelative) {
		var nPage = null;

		if (this.option("sMoveUnit") == "page") {
			switch (sRelative) {
				case "pre" :
					nPage = this.getCurrentPage() - 1;
				break;
				case "next" :
					nPage = this.getCurrentPage() + 1;
				break;
			}
		} else {
			var nThisPageList = this._getPageList(this.getCurrentPage());
			switch (sRelative) {
				case "pre_end" :
					nPage = 1;
				break;
				case "pre" :
					var nLastPageOfPrePageList = (nThisPageList - 1) * this.option("nPagePerPageList");
					nPage = nLastPageOfPrePageList;
				break;
				case "next" :
					var nFirstPageOfNextPageList = (nThisPageList) * this.option("nPagePerPageList") + 1;
					nPage = nFirstPageOfNextPageList;
				break;
				case "next_end" :
					nPage = this._getLastPage();
				break;
			}
		}
		
		return nPage;
	},
	
	/**
	 * 몇번째 페이지 리스트인지 구함
	 * @param {Number} nThisPage
	 */
	_getPageList : function(nThisPage) {
		if (this.option("bAlignCenter")) {
			var nLeft = Math.floor(this.option("nPagePerPageList") / 2);
			var nPageList = nThisPage - nLeft;
			nPageList = Math.max(nPageList, 1);
			nPageList = Math.min(nPageList, this._getLastPage()); 
			return nPageList;
		}
		return Math.ceil(nThisPage / this.option("nPagePerPageList"));
	},
	
	_isIn : function(el, elParent) {
		if (!elParent) {
			return false;
		}
		return (el === elParent) ? true : jindo.$Element(el).isChildOf(elParent); 
	},
	
	_getPageElement : function(el) {
		for (var i = 0, nLength = this._waPage.$value().length; i < nLength; i++) {
			var elPage = this._waPage.get(i);
			if (this._isIn(el, elPage)) {
				return elPage;
			}
		}
		return null;
	},
	
	_onClickPageList : function(we) {
		we.stop(jindo.$Event.CANCEL_DEFAULT);
		
		var nPage = null,
			htOption = this.option(),
			el = we.element;
			
		if (this._isIn(el, htOption.elFirstPageLinkOn)) {
			nPage = this._getRelativePage("pre_end");
		} else if (this._isIn(el, htOption.elPrevPageLinkOn)) {
			nPage = this._getRelativePage("pre");
		} else if (this._isIn(el, htOption.elNextPageLinkOn)) {
			nPage = this._getRelativePage("next");
		} else if (this._isIn(el, htOption.elLastPageLinkOn)) {
			nPage = this._getRelativePage("next_end");				
		} else {
			var elPage = this._getPageElement(el);
			if (elPage) {
				nPage = parseInt(jindo.$Element(elPage).text(), 10);
			} else {
				return;
			}
		}	
		
		this.movePageTo(nPage);
	},
	
	_convertToAvailPage : function(nPage) {
		var nLastPage = this._getLastPage();
		nPage = Math.max(nPage, 1);
		nPage = Math.min(nPage, nLastPage); 
		return nPage;
	},
	
	/**
	 * 지정한 페이지로 이동하고 페이지 목록을 다시 그린다.
	 * 이동하기전 beforeMove, 이동후에 move 커스텀이벤트를 발생한다.
	 * @param {Number} nPage 이동할 페이지
	 * @param {Boolean} bFireEvent 커스텀이벤트의 발생 여부 (디폴트 true)
	 */
	movePageTo : function(nPage, bFireEvent){
		if (typeof bFireEvent == "undefined") {
			bFireEvent = true;
		}
		
		nPage = this._convertToAvailPage(nPage);
		this._nCurrentPage = nPage;
		
		if (bFireEvent) {
			if (!this.fireEvent("beforeMove", {
				nPage: nPage
			})) {
				return;
			}
		}
		
		this._paginate(nPage);
		
		if (bFireEvent) {
			this.fireEvent("move", {
				nPage: nPage
			});
		}
	},
	
	/**
	 * 페이징을 다시 그린다.
	 * @param {Number} nItemCount 아이템의 개수가 바뀌었을 경우 설정해준다.
	 */
	reset : function(nItemCount) {
		if (typeof nItemCount == "undefined") {
			nItemCount = this.option("nItem");
		}  
		
		this.setItemCount(nItemCount);
		this.movePageTo(1, false);
	},
	
	_onActivate : function() {
		this._fClickPage.attach(this._elPageList, "click");
		this.setItemCount(this.option("nItem"));
		this.movePageTo(this.option("nPage"), false);
		this._welPageList.addClass("loaded");	
	},
	
	_onDeactivate : function() {
		this._fClickPage.detach(this._elPageList, "click");
		this._welPageList.removeClass("loaded");	
	},
	
	_addTextNode : function() {
		var sTextNode = this.option("sInsertTextNode");
		this._elPageList.appendChild(document.createTextNode(sTextNode));		
	},
	
	_paginate : function(nPage){
		this._empty();
		this._addTextNode();
		
		var htOption = this.option(),
			elFirstPageLinkOn = htOption.elFirstPageLinkOn, 
			elPrevPageLinkOn = htOption.elPrevPageLinkOn,
			elNextPageLinkOn = htOption.elNextPageLinkOn,
			elLastPageLinkOn = htOption.elLastPageLinkOn,
			elFirstPageLinkOff = htOption.elFirstPageLinkOff,
			elPrevPageLinkOff = htOption.elPrevPageLinkOff, 
			elNextPageLinkOff = htOption.elNextPageLinkOff, 
			elLastPageLinkOff = htOption.elLastPageLinkOff,
			nLastPage = this._getLastPage(),
			nThisPageList = this._getPageList(nPage),
			nLastPageList = this._getPageList(nLastPage);
		
		if (nLastPage === 0) {
			this._welPageList.addClass("no-result");
		} else if (nLastPage == 1) {
			this._welPageList.addClass("only-one");
		} else {
			this._welPageList.removeClass("only-one").removeClass("no-result");
		}
		
		var nFirstPageOfThisPageList, nLastPageOfThisPageList;
		if (htOption.bAlignCenter) {
			var nLeft = Math.floor(htOption.nPagePerPageList / 2);
			nFirstPageOfThisPageList = nPage - nLeft;
			nFirstPageOfThisPageList = Math.max(nFirstPageOfThisPageList, 1);
			nLastPageOfThisPageList = nFirstPageOfThisPageList + htOption.nPagePerPageList - 1;
			if (nLastPageOfThisPageList > nLastPage) {
				nFirstPageOfThisPageList = nLastPage - htOption.nPagePerPageList + 1;
				nFirstPageOfThisPageList = Math.max(nFirstPageOfThisPageList, 1);
				nLastPageOfThisPageList = nLastPage;
			}
		} else {
			nFirstPageOfThisPageList = (nThisPageList - 1) * htOption.nPagePerPageList + 1;
			nLastPageOfThisPageList = (nThisPageList) * htOption.nPagePerPageList;
			nLastPageOfThisPageList = Math.min(nLastPageOfThisPageList, nLastPage);
		}
		
		if (htOption.sMoveUnit == "page") {
			nThisPageList = nPage;
			nLastPageList = nLastPage;
		}

		//first
		if (nPage > 1) {
			if (elFirstPageLinkOn) {
				this._welPageList.append(elFirstPageLinkOn);
				this._addTextNode();
			}
		} else {
			if (elFirstPageLinkOff) {
				this._welPageList.append(elFirstPageLinkOff);
				this._addTextNode();
			}
		}

		//prev
		if (nThisPageList > 1) {
			if (elPrevPageLinkOn) {
				this._welPageList.append(elPrevPageLinkOn);
				this._addTextNode();
			}
		} else {
			if (elPrevPageLinkOff) {
				this._welPageList.append(elPrevPageLinkOff);
				this._addTextNode();
			}	
		}		

		var el, wel;
		for (var i = nFirstPageOfThisPageList; i <= nLastPageOfThisPageList ; i++) {
			if (i == nPage) {
				el = jindo.$(jindo.$Template(htOption.sCurrentPageTemplate).process({ page : i.toString() }));
			} else {
				el = jindo.$(jindo.$Template(htOption.sPageTemplate).process({ page : i.toString() }));
				this._waPage.push(el);
			}
				
			wel = jindo.$Element(el);
			if (i == nFirstPageOfThisPageList) {
				wel.addClass(this.option("sClassFirst"));
			}
			if (i == nLastPageOfThisPageList) {
				wel.addClass(this.option("sClassLast"));
			}
			this._welPageList.append(el);
			
			this._addTextNode();
		}

		//next
		if (nThisPageList < nLastPageList) {
			if (elNextPageLinkOn) {
				this._welPageList.append(elNextPageLinkOn);
				this._addTextNode();
			}
		} else {
			if (elNextPageLinkOff) {
				this._welPageList.append(elNextPageLinkOff);
				this._addTextNode();
			}
		}
		
		//last
		if (nPage < nLastPage) {
			if (elLastPageLinkOn) {
				this._welPageList.append(elLastPageLinkOn);
				this._addTextNode();
			}
		} else {
			if (elLastPageLinkOff) {
				this._welPageList.append(elLastPageLinkOff);
				this._addTextNode();
			}
		}
	},
	
	_empty : function(){
		var htOption = this.option(),
			elFirstPageLinkOn = htOption.elFirstPageLinkOn, 
			elPrevPageLinkOn = htOption.elPrevPageLinkOn,
			elNextPageLinkOn = htOption.elNextPageLinkOn,
			elLastPageLinkOn = htOption.elLastPageLinkOn,
			elFirstPageLinkOff = htOption.elFirstPageLinkOff,
			elPrevPageLinkOff = htOption.elPrevPageLinkOff, 
			elNextPageLinkOff = htOption.elNextPageLinkOff, 
			elLastPageLinkOff = htOption.elLastPageLinkOff;
			
		elFirstPageLinkOn = this._clone(elFirstPageLinkOn);
		elPrevPageLinkOn = this._clone(elPrevPageLinkOn);
		elLastPageLinkOn = this._clone(elLastPageLinkOn);
		elNextPageLinkOn = this._clone(elNextPageLinkOn);
		elFirstPageLinkOff = this._clone(elFirstPageLinkOff);
		elPrevPageLinkOff = this._clone(elPrevPageLinkOff);
		elLastPageLinkOff = this._clone(elLastPageLinkOff);
		elNextPageLinkOff = this._clone(elNextPageLinkOff);
		this._waPage.empty();
		this._welPageList.empty();
	},
	
	_clone : function(el) {
		if (el && typeof el.cloneNode == "function") {
			return el.cloneNode(true);
		}
		return el;
	}
}).extend(jindo.UIComponent);

/**
 * @fileOverview 실시간 순위 변화를 보여주는 롤링 차트 컴포넌트
 * @author senxation
 * @version 0.2.1
 */

jindo.RollingChart = jindo.$Class({
	/** @lends jindo.RollingChart.prototype */
		
	_nIndexOfRolling : 0, //현재 롤링되고있는 아이템의 인덱스
	_bIsRolling : false, //롤링 중인지 여부

	/**
	 * 롤링차트 컴포넌트를 생성한다.
	 * @constructs
	 * @class 실시간 순위 변화를 보여주는 롤링 차트 컴포넌트
	 * @extends jindo.UIComponent
	 * @requires jindo.Rolling
	 * @param {HTMLElement} el 기준 엘리먼트
	 * @param {HashTable} htOption 옵션 객체
	 * @example
var oRollingChart = new jindo.RollingChart(jindo.$('rolling_chart'), {
	sDirection : 'down', //롤링될 방향 "down" || "up"
	nFPS : 50, //롤링을 그려줄 초당 프레임수
	nDuration : 300, //롤링될 시간
	nRollingInterval : 50, //각 롤링간의 시간간격
	sUrl : "test.php", //요청 url
	sRequestType : "jsonp", //요청타입
	sRequestMethod : "get", //요청방식
	htRequestParameter : { p : 11 }, //요청 파라메터
	nRequestInterval : 5000, //새로운 목록을 가져올 시간 간격 (ms)
	bActivateOnload : true //(Boolean) 초기화시 activate 여부
}).attach({
	request : function(oCustomEvent) {
		//롤링될 새로운 목록을 요청하기 전에 발생
		//oCustomEvent.stop(); 수행시 요청하지 않음
	},
	response : function(oCustomEvent) {
		//목록을 성공적으로 받아온 이후에 발생
		//이벤트 객체 oCustomEvent = {
		//	htResponseJSON : (HashTable) 응답의 JSON 객체
		//}
		//oCustomEvent.stop(); 수행시 새로 받아온 목록을 업데이트 하지 않음
	},
	beforeUpdate : function(oCustomEvent) {
		//새 목록을 받아온 후 기존 목록에 적용하기 이전에 발생 
		//oCustomEvent.stop(); 수행시 새로 받아온 목록을 업데이트 하지 않음
	},
	beforeRolling : function(oCustomEvent) {
		//새 목록이 추가되고 각각의 롤링이 시작되기전 발생.
		//이벤트 객체 oCustomEvent = {
		//	nIndex : (Number) 현재 롤링될 목록의 번호
		//}
	},
	afterRolling : function(oCustomEvent) {
		//새 목록이 추가되고 각각의 롤링이 종료된 후 발생.
		//이벤트 객체 oCustomEvent = {
		//	nIndex : (Number) 현재 롤링된 목록의 번호
		//}
	},
	afterUpdate : function(oCustomEvent) {
		//모든 롤링이 끝난 이후에 발생
	}
});
	 */
	$init : function(el, htOption) {
		
		var htDefaultOption = {
			sClassPrefix : 'rollingchart-', //Default Class Prefix
			sDirection : 'down', //롤링될 방향 "down" || "up"
			nFPS : 50, //롤링을 그려줄 초당 프레임수 
			nDuration : 300, //롤링될 시간
			nRollingInterval : 100, //각 롤링간의 시간간격
			sUrl : "", //요청 url
			sRequestType : "jsonp", //요청타입
			sRequestMethod : "get", //요청방식
			htRequestParameter : null, //(Object) 파라메터
			nRequestInterval : 10000, //새로운 목록을 가져올 시간 간격 (ms)
			bActivateOnload : true //(Boolean) 초기화시 activate 여부
		}
		
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		this._el = jindo.$(el);

		this._assignHTMLElements(); //컴포넌트에서 사용되는 HTMLElement들을 선언하는 메소드
		this._initTimer();
		this._initRolling();
		
		if (this.option("bActivateOnload")) {
			this.activate(); //컴포넌트를 활성화한다.
		}
	},

	/**
	 * 컴포넌트에서 사용되는 HTMLElement들을 선언하는 메소드
	 */
	_assignHTMLElements : function() {
		this._elList = jindo.$$.getSingle("ol", this._el);
		this._aItems = jindo.$$("> li", this._elList);
	},
	
	/**
	 * 챠트의 리스트 엘리먼트를 가져온다.
	 * @return {HTMLElement}
	 */
	getList : function() {
		return this._elList;
	},
	
	/**
	 * 챠트 리스트의 아이템 엘리먼트를 가져온다.
	 * @return {HTMLElement}
	 */
	getItems : function() {
		return this._aItems;
	},
	
	/**
	 * 각 챠트 리스트 아이템에 롤링을 위한 리스트를 가져온다.
	 * @param {HTMLElement} elItem
	 */
	getListOfItem : function(elItem) {
		return jindo.$$.getSingle("ul", elItem);
	},
	
	/**
	 * 챠트가 롤링중인지 여부를 가져온다.
	 * @return {Boolean}
	 */
	isRolling : function() {
		return this._bIsRolling;	
	},
	
	_initTimer : function() {
		this._oRequestTimer = new jindo.Timer();
	},
	
	/**
	 * 일정 간격으로 Ajax 요청을 위한 Timer 객체를 가져온다.
	 * @return {jindo.Timer}
	 */
	getTimer : function() {
		return this._oRequestTimer;
	},
	
	_initRolling : function() {
		var self = this;
		this._oRollingEventHandler = {
			"end" : function(){
				setTimeout(function(){
					self.fireEvent("afterRolling", { nIndex : self._nIndexOfRolling });
					self._roll(self._nIndexOfRolling + 1);	
				}, self.option("nRollingInterval"));
			}
		};
		this._oRolling = new jindo.Rolling(this._el, {
			nFPS : this.option("nFPS"),
			nDuration : this.option("nDuration"),
			sDirection : 'vertical',
			fEffect : jindo.Effect.linear
		});
	},
	
	/**
	 * 롤링 컴포넌트의 인스턴스를 가져온다.
	 * @return {jindo.Rolling}
	 */
	getRolling : function() {
		return this._oRolling;
	},
	
	/**
	 * Rolling이 적용될 아이템을 번호로 정한다. ////////////// 
	 * @param {Number} n
	 * @ignore
	 */
	_setItemIndexToRolling : function(n) {
		var elList = this.getListOfItem(this.getItems()[n]);
		var oRolling = this.getRolling();
		oRolling._el = elList;
		oRolling._elList = elList;
	},

	/**
	 * 컴포넌트를 활성화한다.
	 * @return {this}
	 */
	_onActivate : function() {
		var self = this;

		this.getTimer().start(function(){
			self._stopRequest();
			self._request();
			return true;
		}, this.option("nRequestInterval"));
	},
	
	/**
	 * 컴포넌트를 비활성화한다.
	 * @return {this}
	 */
	_onDeactivate : function() {
		this.getTimer().abort();
	},
	
	/**
     * @ignore
     * @param {String} sQuery 쿼리. 생략시 현재 입력된 input의 값
     */
    _request: function(sQuery){
		if (this.isRolling()) {
			return;
		}
		
        var htOption = this.option();
        var sUrl = htOption.sUrl;
        var htParameter = htOption.htRequestParameter;
		var self = this;        
        this._oAjax = jindo.$Ajax(sUrl, {
            type: htOption.sRequestType,
            method: htOption.sRequestMethod,
            onload: function(oResponse){
                try {
					var htParam = { htResponseJSON : oResponse.json() };
					if(!self.fireEvent("response", htParam)) {
						return;
					}
					
					if(!self.fireEvent("beforeUpdate")) {
						return;
					}
										
					var oChart = htParam.htResponseJSON;
					self._addItemToRolling(oChart);
					self.getRolling().getTransition().attach(self._oRollingEventHandler);
					self._roll(0);
                } 
                catch (e) {
                }
            }
        });
		if (!self.fireEvent("request")) {
			return;
		}
		this._oAjax.request(htParameter);
    },
	
	_stopRequest: function(){
        try {
            this._oAjax.abort();
            this._oAjax = null;
        } 
        catch (e) {
        }
	},
	
	_addItemToRolling : function(oChart) {
		var self = this;
		var sDirection = this.option("sDirection");
		
		jindo.$A(this.getItems()).forEach(function(el, i){
			var wel = jindo.$Element(jindo.$("<li>"));
			wel.html(oChart.items[i]);
			var elList = self.getListOfItem(el);
			if(sDirection == "down") {
				elList.insertBefore(wel.$value(), elList.firstChild);
				elList.scrollTop = 9999;
			}
			else {
				jindo.$Element(elList).append(wel.$value());
				elList.scrollTop = 0;	
			}
		})
	},
	
	_removeItemRolled : function() {
		var self = this;
		var sDirection = this.option("sDirection");
		
		jindo.$A(this.getItems()).forEach(function(el, i){
			if(sDirection == "down") {
				jindo.$Element(jindo.$$("li", self.getListOfItem(el))[1]).leave();
			}
			else {
				var elList = self.getListOfItem(el);
				jindo.$Element(jindo.$$.getSingle("li", elList)).leave();
				elList.scrollTop = 0;	
			}
			
		})
		this._nIndexOfRolling = 0;
	},

	_roll : function(n) {
		this._bIsRolling = true;
		this._nIndexOfRolling = n;
		this.fireEvent("beforeRolling", { nIndex : n });
		var nIndex = n;
		if (nIndex == this.getItems().length) {
			this._removeItemRolled();
			this._nIndexOfRolling = 0;
			this.getRolling().getTransition().detach(this._oRollingEventHandler);
			this._bIsRolling = false;
			this.fireEvent("afterUpdate");
			return;
		}
			
		this._setItemIndexToRolling(nIndex);
		
		var n = 1;
		if (this.option("sDirection") == "down") {
			n = -1;
		}
		this.getRolling().moveBy(n);
	}
}).extend(jindo.UIComponent);	
/**
 * @fileOverview 정해진 크기의 박스내의 내용에 따라 자동으로 스크롤바를 생성하는 스크롤박스 컴포넌트
 * @author senxation
 * @version 0.2.1
 */
jindo.ScrollBox = new jindo.$Class({
	/** @lends jindo.ScrollBox.prototype */

	/**
	 * ScrollBox 컴포넌트는 정해진 크기의 박스내의 내용을 스크롤바를 이용해 이동하여 볼 수 있게 한다.
	 * ScrollBar 컴포넌트와 다르게 박스내의 내용이 유동적으로 변할 때 스크롤이 나타나거나 사라지고 막대의 길이도 자동으로 구해진다.
	 * @constructs
	 * @class 정해진 크기의 박스내의 내용에 따라 자동으로 스크롤바를 생성하는 스크롤박스 컴포넌트
	 * @extends jindo.ScrollBar
	 * @param {HTMLElement} el
	 * @param {HashTable} htOption
	 * @example
var oScrollBox = new jindo.ScrollBox("scroll", {
	sClassPrefix : "scrollbar-", // (String) Class Prefix
	sOverflowX : "auto", // (String) 가로스크롤을 보여주는 방법 "auto"(자동) || "scroll" (항상)|| "hidden" (보이지않음) 
	sOverflowY : "auto", // (String) 세로스크롤을 보여주는 방법 "auto"(자동) || "scroll" (항상)|| "hidden" (보이지않음)
	bAdjustThumbSize : true, // (Boolean) Thumb의 크기가 Content의 크기에따라 자동으로 변할지 여부
	nMinThumbSize : 50, // (Number) bAdjustThumbSize가 true일경우 크기가 변해도 최소로 유지될 크기
	nDelta : 16 // (Number) 스크롤 속도
});
	 */	
	$init : function(el, htOption) {
		
		this.option({
			sClassPrefix : "scrollbar-",
			bActivateOnload : true,
			sOverflowX : "auto",
			sOverflowY : "auto",
				bAdjustThumbSize : true,
			nMinThumbSize : 50,
			nDelta : 16 //스크롤 속도
		});
		
		this.option(htOption || {});
		
		this._el = jindo.$(el);
		
		if (this.option("bActivateOnload")) {
			this.activate();
			this.reset();
		}
	},
	
	/**
	 * 스크롤바의 보임/숨김 여부를 자동으로 설정한다.
	 */	
	reset : function() {
		this._autoToggleScrollBar();
		
		//보정을 위한 상태설정		
		var oStatusH = this.hasScrollBarHorizontal();
		var oStatusV = this.hasScrollBarVertical();
		
		this._adjustBoxSize();
		this._adjustContentSize();
		
		//보정
		this._autoToggleScrollBar();
		if (oStatusH != this.hasScrollBarHorizontal() || oStatusV != this.hasScrollBarVertical()) {
			this._adjustBoxSize();
			this._adjustContentSize();
		}
		
		this._autoToggleAvailability();
		this._adjustTrackSize();
		this._adjustThumbSize();
		this.$super.reset();
	},

	/**
	 * 컴포넌트를 활성화한다.
	 */
	_onActivate : function() {
		//활성화 로직 ex)event binding
		this.$super._onActivate();
		this.reset();
	},
	
	/**
	 * 컴포넌트를 비활성화한다.
	 */
	_onDeactivate : function() {
		this.$super._onDeactivate();
		this._adjustBoxSize();
	},

	/**
	 * 스크롤 박스의 크기를 설정한다.
	 * @param {Number} nWidth (optional)
	 * @param {Number} nHeight (optional)
	 */
	setSize : function(nWidth, nHeight) {
		if (nWidth) {
			//jindo.$Element(this._el).width(nWidth);
			jindo.$Element(this._el).css("width", nWidth + "px");
		}
		if (nHeight) {
			//jindo.$Element(this._el).height(nHeight);
			jindo.$Element(this._el).css("height", nHeight + "px");
		}

		this.setBoxSize(nWidth, nHeight);

		this._oBoxSize = {
			nWidth : jindo.$Element(this._elBox).width(),
			nHeight : jindo.$Element(this._elBox).height()
		};
		this.reset(); 
	},

	/**
	 * 컨텐트 엘리먼트의 크기를 구한다.
	 * @return {HashTable}
	 * @example
var oSize = {
	nWidth : (Number),
	nHeight : (Number)
}
	 */
	getContentSize : function() {
		var welContent = jindo.$Element(this._elContent);
		
		return {
			nWidth : parseInt(welContent.width(), 10),
			nHeight : parseInt(welContent.height(), 10)
		};
	},

	/**
	 * 컨텐트 엘리먼트의 크기를 설정한다.
	 * @param {Number} nWidth
	 * @param {Number} nHeight
	 */	
	setContentSize : function(nWidth, nHeight) {
		var welContent = jindo.$Element(this._elContent);
		
		if (nWidth) {
			if (nWidth == Infinity) {
				welContent.css("width", "");
			}
			else {
				welContent.css("width", nWidth + "px");	
			}
			
		}

		if (nHeight) {
			if (nHeight == Infinity) {
				welContent.css("height", "auto");
			}
			else {
				welContent.css("height", nHeight + "px");	
			}
		}
		this.$super.reset();
	},
	
	/**
	 * 박스 엘리먼트의 크기를 구한다.
	 * @example
var oSize = {
	nWidth : (Number),
	nHeight : (Number)
}
	 */
	getBoxSize : function() {
		var welBox = jindo.$Element(this._elBox);
		return {
			nWidth : parseInt(welBox.width(), 10),
			nHeight : parseInt(welBox.height(), 10)
		};
	},
	
	/**
	 * 박스 엘리먼트의 크기를 설정한다.
	 * @param {Number} nWidth
	 * @param {Number} nHeight
	 */
	setBoxSize : function(nWidth, nHeight) {
		var welBox = jindo.$Element(this._elBox);
		if (nWidth) {
			//jindo.$Element(this._elBox).width(nWidth);
			welBox.css("width", nWidth + "px");
		}
		if (nHeight) {
			//jindo.$Element(this._elBox).height(nHeight);
			welBox.css("height", nHeight + "px");
		}
		this.$super.reset();
	},

	/**
	 * 트랙 엘리먼트의 크기를 구한다.
	 * @param {HashTable} 
	 * @return {HashTable}
	 * @example
var oSize = {
	nWidth : (Number),
	nHeight : (Number)
}
	 */
	getTrackSize : function(ht) {
		if (!ht.elScrollBar) {
			return {
				nWidth : 0,
				nHeight : 0
			};	
		}
		var welTrack = jindo.$Element(ht.elTrack);
		return {
			nWidth : parseInt(welTrack.width(), 10),
			nHeight : parseInt(welTrack.height(), 10)
		};
	},
	
	/**
	 * 트랙 엘리먼트의 크기를 설정한다.
	 * @param {Number} nWidth
	 * @param {Number} nHeight
	 */
	setTrackSize : function(o, nWidth, nHeight) {
		var welTrack = jindo.$Element(o.elTrack);
		if (nWidth) {
			//jindo.$Element(o.elTrack).width(nWidth);
			welTrack.css("width", nWidth + "px");
		}
		if (nHeight) {
			//jindo.$Element(o.elTrack).height(nHeight);
			welTrack.css("height", nHeight + "px");
		}
	},
	
	/**
	 * 가로스크롤이 생겨야하는 상황인지 판단한다.
	 * @return {Boolean}
	 */
	isNeededScrollBarHorizontal : function() {
		
		if(this.option("sOverflowX") == "scroll") {
			return true;
		}
		
		var oContentSize = this.getContentSize();
		var oBoxSize = this.getDefaultBoxSize();
		
		if (this.getScrollBarHorizontal().elScrollBar && this.option("sOverflowX") != "hidden") {
			if(this.hasScrollBarVertical()) {
				if(oContentSize.nWidth > oBoxSize.nWidth - jindo.$Element(this.getScrollBarVertical().elScrollBar).width()) {
					return true;	
				}
			}
			if (oContentSize.nWidth > oBoxSize.nWidth){
				return true;	
			}
		}
		return false;
	},
	
	/**
	 * 세로스크롤이 생겨야하는 상황인지 판단한다.
	 * @return {Boolean}
	 */
	isNeededScrollBarVertical : function() {
		
		if(this.option("sOverflowY") == "scroll") {
			return true;
		}
		
		var oContentSize = this.getContentSize();
		var oBoxSize = this.getDefaultBoxSize();

		if (this.getScrollBarVertical().elScrollBar && this.option("sOverflowY") != "hidden") {
			if(this.hasScrollBarHorizontal()) {
				if(oContentSize.nHeight > oBoxSize.nHeight - jindo.$Element(this.getScrollBarHorizontal().elScrollBar).height()) {
					return true;	
				}
			}
			if(oContentSize.nHeight > oBoxSize.nHeight) {
				return true;	
			}
		}
		return false;
	},
	
	_autoToggleScrollBar : function() {
		
		if (!this.isActivating()) {
			return;
		}
		
		var sClassPrefix = this.option("sClassPrefix");
		
		var oH = this.getScrollBarHorizontal();
		var oV = this.getScrollBarVertical();
		var welScrollBar; 
		var bAjustThumbSize = this.option("bAdjustThumbSize");
		
		var bV = this.isNeededScrollBarVertical();
		if (oV.elScrollBar) {
			welScrollBar = jindo.$Element(oV.elScrollBar);
			if (bV) {
				welScrollBar.addClass(sClassPrefix + "show");
			} else {
				welScrollBar.removeClass(sClassPrefix + "show");
			}
			if (oV.elThumb && bAjustThumbSize) {
				jindo.$Element(oV.elThumb).css("height", "0px"); //ie6에서 문제때문에 스크롤바를 보여준 직후에 (trackSize를 조절해주기 이전) Thumb사이즈를 0로 만들어준다.
			}
		}
		var bH = this.isNeededScrollBarHorizontal();
		if (oH.elScrollBar) {
			welScrollBar = jindo.$Element(oH.elScrollBar);
			if (bH) {
				welScrollBar.addClass(sClassPrefix + "show");	
			} else {
				welScrollBar.removeClass(sClassPrefix + "show");
			}
			if (oH.elThumb && bAjustThumbSize) {
				jindo.$Element(oH.elThumb).css("width", "0px");
			}
		}

		//세로스크롤 안생기고, 가로스크롤생긴후에 세로스크롤이 필요해지는 경우!		
		if (oV.elScrollBar) {
			welScrollBar = jindo.$Element(oV.elScrollBar);
			if (this.isNeededScrollBarVertical()) {
				welScrollBar.addClass(sClassPrefix + "show"); 
			} else {
				welScrollBar.removeClass(sClassPrefix + "show");
			}
			if (oV.elThumb && bAjustThumbSize) {
				jindo.$Element(oV.elThumb).css("height", "0px");
			}	
		}
	},
	
	/**
	 * Track의 길이를 자동 조절한다.
	 */
	_adjustTrackSize : function() {
		if (!this.isActivating()) {
			return;
		}
		var oBoxSize = this.getDefaultBoxSize();
		
		var oH = this.getScrollBarHorizontal();
		var oV = this.getScrollBarVertical();
		
		var bH = this.isNeededScrollBarHorizontal();
		//가로 스크롤
		if (bH && oH.elScrollBar) {
			var nTrackWidth = oBoxSize.nWidth;

			var wel = jindo.$Element(oH.elScrollBar);
			wel.css("top", oBoxSize.nHeight - wel.height() + "px");
		
			//세로 스크롤도 있는경우
			var nVerticalWidth = 0;
			if (this.hasScrollBarVertical() && oV.elScrollBar) {
				nVerticalWidth = parseInt(jindo.$Element(oV.elScrollBar).width(), 10);
				nTrackWidth -= nVerticalWidth;
			}	
			wel.width(nTrackWidth); //가로스크롤의 크기 조절
			
			var nButtonLeftWidth = 0;
			if (oH.elButtonLeft) {
				nButtonLeftWidth = parseInt(jindo.$Element(oH.elButtonLeft).width(), 10);
				nTrackWidth -= nButtonLeftWidth;
			}
			if (oH.elButtonRight) {
				nTrackWidth -= parseInt(jindo.$Element(oH.elButtonRight).width(), 10);
			}

			jindo.$Element(oH.elTrack).css("left", nButtonLeftWidth + "px"); //가로스크롤의 위치 조절
			
			this.setTrackSize(oH, nTrackWidth, null);
		}

		var bV = this.isNeededScrollBarVertical();		
		//세로 스크롤
		if (bV && oV.elScrollBar) {
			var nTrackHeight = oBoxSize.nHeight;
			
			//가로 스크롤도 있는경우
			var nHorizontalHeight = 0;
			if (this.hasScrollBarHorizontal() && oH.elScrollBar) {
				nHorizontalHeight = parseInt(jindo.$Element(oH.elScrollBar).height(), 10);
				nTrackHeight -= nHorizontalHeight;
			}
			
			if (oV.elButtonUp) {
				nTrackHeight -= parseInt(jindo.$Element(oV.elButtonUp).height(), 10);
			}
			if (oV.elButtonDown) {
				nTrackHeight -= parseInt(jindo.$Element(oV.elButtonDown).height(), 10);
				//jindo.$Element(oV.elButtonDown).css("bottom", nHorizontalHeight +"px");
			}
			
			this.setTrackSize(oV, null, nTrackHeight);
		}
		
	},
	
	/**
	 * ScrollBar 가 생성되었을 경우의 Box 사이즈를 설정해준다.
	 */
	_adjustBoxSize : function() {
		var oBoxSize = this.getDefaultBoxSize();
		var oH = this.getScrollBarHorizontal();
		var oV = this.getScrollBarVertical();
		var bV = this.hasScrollBarVertical();
		var bH = this.hasScrollBarHorizontal();
		
		this.setBoxSize(oBoxSize.nWidth, oBoxSize.nHeight);
		
		if (this.isActivating()) {
			//가로 스크롤
			if (bH && oH.elScrollBar) {
				var nHeight = oBoxSize.nHeight;
				nHeight -= parseInt(jindo.$Element(oH.elScrollBar).height(), 10);
				this.setBoxSize(null, nHeight);
			}
			//세로 스크롤
			if (bV && oV.elScrollBar) {
				var nWidth = oBoxSize.nWidth;
				nWidth -= parseInt(jindo.$Element(oV.elScrollBar).width(), 10);
				this.setBoxSize(nWidth, null);
			}
	
			//가로, 세로스크롤 모두 없는 경우에 Box와 Content사이즈가 같게 설정
	//		//if (!bH && !bV) {
	//			//this.setBoxSize(oBoxSize.nWidth, oBoxSize.nHeight);
	//		//}
		}
	},
	
	_adjustContentSize : function() {
		if (!this.isActivating()) {
			return;
		}
		
		var oBoxSize = this.getBoxSize();
		var bV = this.option("sOverflowY") != "hidden";
		var bH = this.option("sOverflowX") != "hidden";	
		var nWidth, nHeight;
		//가로, 세로스크롤 중 하나만 존재하는 경우에는 Content사이즈를 조절해 줌
		//세로 스크롤
		if (bV && !bH) {
			nWidth = oBoxSize.nWidth;
		}
		//가로 스크롤
		if (bH && !bV) {
			nHeight = oBoxSize.nHeight;
		}
		
		this.setContentSize(nWidth || Infinity, nHeight || Infinity);
	},

	_adjustThumbSize : function() {
		if (!this.isActivating()) {
			return;
		}
		
		if (!this.option("bAdjustThumbSize")) {
			return;
		}
		
		var nMinThumbSize = this.option("nMinThumbSize");
		var oContentSize = this.getContentSize();
		var oBoxSize = this.getBoxSize(); //현재 그려진 box 사이즈
		var nGap;

		var oH = this.getScrollBarHorizontal();
		var oV = this.getScrollBarVertical();
		if (oV.elScrollBar) {
					
			var oTrackSizeV = this.getTrackSize(oV);
			var nThumbHeight = Math.floor(parseInt(oTrackSizeV.nHeight * oBoxSize.nHeight / oContentSize.nHeight, 10));
			if (nThumbHeight < nMinThumbSize) {
				nThumbHeight = nMinThumbSize;
			}
			if (nThumbHeight >= oTrackSizeV.nHeight) {
				nThumbHeight = oTrackSizeV.nHeight;
			}
			jindo.$Element(oV.elThumb).height(nThumbHeight);
			
			///////thumb-body 크기 조절
			nGap = 0;
			if(oV.elThumbHead) {
				nGap += jindo.$Element(oV.elThumbHead).height();
			}
			if(oV.elThumbFoot) {
				nGap += jindo.$Element(oV.elThumbFoot).height();
			}
			if(oV.elThumbBody) {
				jindo.$Element(oV.elThumbBody).height(nThumbHeight - nGap);
			}
		}
		
		if (oH.elScrollBar) {
			var oTrackSizeH = this.getTrackSize(oH);
			var nThumbWidth = Math.floor(parseInt(oTrackSizeH.nWidth * oBoxSize.nWidth / oContentSize.nWidth, 10));
			if (nThumbWidth < nMinThumbSize) {
				nThumbWidth = nMinThumbSize;
			}
			//max값과 같은 경우
			if (nThumbWidth >= oTrackSizeH.nWidth) {
				nThumbWidth = oTrackSizeH.nWidth;
			}
			jindo.$Element(oH.elThumb).width(nThumbWidth);
			
			///////thumb-body 크기 조절
			nGap = 0;
			if(oH.elThumbHead) {
				nGap += jindo.$Element(oH.elThumbHead).width();
			}
			if(oH.elThumbFoot) {
				nGap += jindo.$Element(oH.elThumbFoot).width();
			}
			if(oH.elThumbBody) {
				jindo.$Element(oH.elThumbBody).width(nThumbWidth - nGap);	
			}
		}
	},
	
	_autoToggleAvailability : function(){
		var sClassPrefix = this.option("sClassPrefix");
		var oContentSize = this.getContentSize();
		var oBoxSize = this.getBoxSize(); //현재 그려진 box 사이즈
		var oH = this.getScrollBarHorizontal();
		var oV = this.getScrollBarVertical();
		
		if (oH.elScrollBar) {
			//deactivate
			if (this.option("sOverflowX") == "scroll" && oBoxSize.nWidth >= oContentSize.nWidth) {
				jindo.$Element(oH.elScrollBar).addClass(sClassPrefix + "disabled");
				this.$super._onDeactivate("horizontal");
				if (this.isActivating()) { //활성화일경우에만 scrollbar에서 삽입된 noscript 클래스명을 다시 제거
					jindo.$Element(this._el).removeClass(sClassPrefix + "noscript");
				}	
			} else {
				jindo.$Element(oH.elScrollBar).removeClass(sClassPrefix + "disabled");
				
				if (this.isActivating()) { //활성화일경우에만 scrollbar도 활성화
					this.$super._onActivate("horizontal");
				}
			}	
		}
		
		if (oV.elScrollBar) {
			if (this.option("sOverflowY") == "scroll" && oBoxSize.nHeight >= oContentSize.nHeight) {
				jindo.$Element(oV.elScrollBar).addClass(sClassPrefix + "disabled");
				this.$super._onDeactivate("vertical");
				if (this.isActivating()) { //활성화일경우에만 scrollbar에서 삽입된 noscript 클래스명을 다시 제거
					jindo.$Element(this._el).removeClass(sClassPrefix + "noscript");
				}
			} else {
				jindo.$Element(oV.elScrollBar).removeClass(sClassPrefix + "disabled");
				if (this.isActivating()) { //활성화일경우에만 scrollbar도 활성화
					this.$super._onActivate("vertical");
				}
			}
		}
	}
}).extend(jindo.ScrollBar);
/**
 * @fileOverview 별점 입력 컴포넌트
 * @author senxation
 * @version 0.3.1
 */

jindo.StarRating = jindo.$Class({
	/** @lends jindo.StarRating.prototype */
		
	/**
	 * 컴포넌트를 생성한다.
	 * @constructs
	 * @class 별점 입력 컴포넌트
	 * @param {HTMLElement} el 베이스(기준) 엘리먼트
	 * @param {HashTable} htOption 옵션 객체
	 * @extends jindo.UIComponent
	 * @example
oStarRating = new jindo.StarRating(jindo.$("star_rating"), {
	nStep : 1, //설정가능한 값의 단계 ex) 1, 0.5, 0.25
	nMaxValue : 10, //최대 값
	nDefaultValue : 0, //로드시 기본으로 설정할 값
	bSnap : false, //MouseMove시 step별로 스냅시킬지 여부
	bActivateOnload : true //로드시 컴포넌트 활성화여부
}).attach({
	move : function(oCustomEvent) {
		//마우스가 별점 위에서 이동될 때 발생
		//이벤트 객체 oCustomEvent = {
		//	nValue : (Number) 마우스이동에 따른 값 (변환되기 전 값)
		//	nValueToBeSet : (Number) 실제 적용될 값 (nStep 옵션에 따라 변환된 값)
		//}
	},
	out : function(oCustomEvent) {
		//마우스가 별점 위에서 벗어났을 때 발생
	},
	set : function(oCustomEvent) {
		//값이 설정되었을 때 발생
		//이벤트 객체 oCustomEvent = {
		//	nValue : (Number) 설정된 값
		//}
	}
});
	 */
	$init : function(el, htOption) {
		//옵션 초기화
		var htDefaultOption = {
			nStep : 1, //설정가능한 값의 단계 ex) 1, 0.5, 0.25
			nMaxValue : 10, //최대 값
			nDefaultValue : 0, //로드시 기본으로 설정할 값
			bSnap : false, //MouseMove시 step별로 스냅시킬지 여부
			bActivateOnload : true //로드시 컴포넌트 활성화여부
		};
		this.option(htDefaultOption);
		this.option(htOption || {});
		//Base 엘리먼트 설정
		this._el = jindo.$(el);
		this._wel = jindo.$Element(el);

		//컴포넌트에서 사용되는 HTMLElement들을 선언하는 메소드
		this._assignHTMLElements();
		
		this._wfMouseMove = jindo.$Fn(this._onMouseMove, this);
		this._wfMouseLeave = jindo.$Fn(this._onMouseLeave, this);
		this._wfClick = jindo.$Fn(this._onClick, this);
		
		//활성화
		if(this.option("bActivateOnload")) {
			this.activate(); //컴포넌트를 활성화한다.	
		}
	},

	/**
	 * 컴포넌트에서 사용되는 HTMLElement들을 선언하는 메소드
	 */
	_assignHTMLElements : function() {
		this._elRatingElement = jindo.$$.getSingle("span", this.getBaseElement());
		this._welRatingElement = jindo.$Element(this._elRatingElement);
	},
	
	/**
	 * 컴포넌트의 베이스 엘리먼트를 가져온다.
	 * @return {HTMLElement}
	 */
	getBaseElement : function() {
		return this._el;
	},

	/**
	 * 별점의 점수를 표시할 엘리먼트를 구한다.
	 * @return {HTMLElement}
	 */
	getRatingElement : function() {
		return this._elRatingElement;
	},
	
	/**
	 * 설정된 값을 구한다. 
	 * @return {Number} 0과 option의 maxValue 사이의 값
	 */
	getValue : function() {
		return this._nValue;	
	},
	
	/**
	 * 활성화된 RatingElement의 가로 길이로부터 설정된 값을 구한다. 
	 * @return {Number} 0과 option의 maxValue 사이의 값
	 */
	getValueByWidth : function() {
		return this._welRatingElement.width() / this._nBaseWidth * this.option("nMaxValue");	
	},
	
	/**
	 * 실제로 설정될 값을 가져온다.
	 * @param {Number} nValue 
	 * @return {Number} nStep 옵션에 따라 변환된 값.
	 * @example
//nStep옵션이 1인 경우
oStarRating.getValueToBeSet(3.15) -> 3
	 */
	getValueToBeSet : function(nValue) {
		nValue = this._round(nValue, this.option("nStep"));
		nValue = Math.min(nValue, this.option("nMaxValue"));
		nValue = Math.max(nValue, 0);
		return nValue;
	},
	
	/**
	 * 값을 설정한다.
	 * @param {Number} nValue 0과 option의 maxValue 사이의 값
	 * @param {Boolean} bFireEvent "set" 커스텀이벤트를 발생할지 여부
	 * @return {this}
	 */
	setValue : function(nValue, bFireEvent) {
		if (typeof bFireEvent == "undefined") {
			bFireEvent = true;	
		}

		var nMaxValue = this.option("nMaxValue");
		nValue = this.getValueToBeSet(nValue);
		
		var nWidth = this._nBaseWidth * nValue / nMaxValue;
		nWidth = Math.min(nWidth, this._nBaseWidth);
		
		this._welRatingElement.width(nWidth);
		this._nValue = nValue;
		
		if (bFireEvent) {
			this.fireEvent("set", { nValue : this._nValue });	
		}
		
		return this;
	},
	
	/**
	 * 값을 초기화한다.
	 * @return {this}
	 */
	reset : function() {
		var nValue = this.option("nDefaultValue") || 0;
		this.setValue(nValue, false);
		return this;
	},
	
	/**
	 * 소수점단위로도 반올림
	 * @ignore
	 * @param {Number} nValue 반올림할 값
	 * @param {Number} nStep 반올림 단위 (ex 0.5)
	 */
	_round : function(nValue, nStep) { //9.9,  0.5
		var nResult = nValue,
			nFloor = Math.floor(nValue), //9
			nMaxCandidate = nFloor + 1,
			nCompare = 1,
			nTempCompare,
			nCandidate,
			nFixed;
		
		for (nCandidate = nFloor; nCandidate <= nMaxCandidate; nCandidate += nStep) {
			nTempCompare = Math.abs(nValue - nCandidate);
			if (nTempCompare <= nCompare) {
				nCompare = nTempCompare;
				nResult = nCandidate;
			} 
		}
		
		return nResult.toFixed(Math.max((nStep.toString().length - 2), 0));
	},
	
	/**
	 * 컴포넌트를 활성화한다.
	 * @return {this}
	 */
	_onActivate : function() {
		var el = this.getBaseElement();
		this._wfMouseMove.attach(el, "mousemove");
		this._wfMouseLeave.attach(el, "mouseleave");
		this._wfClick.attach(el, "click");
		
		this._nBaseWidth = this._wel.width();
		this.reset();
	},
	
	/**
	 * 컴포넌트를 비활성화한다.
	 * @return {this}
	 */
	_onDeactivate : function() {
		var el = this.getBaseElement();
		this._wfMouseMove.detach(el, "mousemove");
		this._wfMouseLeave.detach(el, "mouseleave");
		this._wfClick.detach(el, "click");
	},
	
	_onMouseMove : function(we) {
		var nOffsetX = we.pos(true).offsetX + 1,
			nWidth = (nOffsetX > this._nBaseWidth) ? this._nBaseWidth : nOffsetX,
			nValue;
		
		if (this.option("bSnap")) {
			nValue = nOffsetX / this._nBaseWidth * this.option("nMaxValue");
			nWidth = this._round(nValue, this.option("nStep")) * this._nBaseWidth / this.option("nMaxValue");
			nWidth = Math.min(nWidth, this._nBaseWidth);
		}
		this._welRatingElement.css("width", nWidth + "px");		
		
		nValue = this.getValueByWidth();		
		this.fireEvent("move", {
			nValue : nValue,
			nValueToBeSet : this.getValueToBeSet(nValue)
		});
	},
	
	_onMouseLeave : function(we) {
		this.setValue(this._nValue, false);
		this.fireEvent("out");
	},
	
	_onClick : function(we) {
		this.setValue(this.getValueByWidth());
	}
}).extend(jindo.UIComponent);	
/**
 * @fileOverview 탭이동을 구현한 컴포넌트
 * @author hooriza, modified by senxation
 * @version 0.4.5
 */
jindo.TabControl = jindo.$Class({
	/** @lends jindo.TabControl.prototype */

	_bIsActivating : false, //컴포넌트의 활성화 여부

	_nCurrentIndex : null, //현재 선택된 탭의 인덱스
	_welSelectedTab : null,
	_welSelectedPanel : null,
	
	/**
	 * TabControl 컴포넌트를 생성한다.
	 * @constructs
	 * @class 탭이동을 구현한 컴포넌트
	 * @param {HTMLElement} el TabControl을 적용한 기준 엘리먼트.
	 * @param {HashTable} htOption 옵션 객체
	 * @extends jindo.UIComponent
	 * @example

<!--
	기준 엘리먼트는 반드시 같은 수의 classPrefix+"tab", classPrefix+"panel" 쌍을 가져야하고 각 쌍은 특정 엘리먼트로 감싸져있어야한다.
	아래 예 참고.
-->
<div id="tab">
	<ul>
		<li class="tc-tab">첫번째</li> <!-- tab의 클래스명은 옵션의 classPrefix+"tab"으로 정해야한다. -->
		<li class="tc-tab tc-selected">두번째</li> <!-- default로 선택될 탭을 지정할 경우 tab의 클래스명은 옵션의 classPrefix+"selected"으로 정한다. (탭이 선택되었을 때 해당 탭과 매칭되는 패널은 classPrefix+"selected"의 클래스명을 갖게 된다.) -->
		<li class="tc-tab">세번째</li>
	</ul>
	<div>
		<div class="tc-panel">SUB SUB #1</li> <!-- tab이 선택되었을때 보여지는 panel의 클래스명은 옵션의 classPrefix+"panel"으로 정해야한다. -->
		<div class="tc-panel tc-selected">SUB SUB #2</li> <!-- default로 선택될 탭을 지정할 경우 panel의 클래스명은 옵션의 classPrefix+"selected"으로 정한다. -->
		<div class="tc-panel">SUB SUB #3</li>
	</div>

</div>
	 * @example
var oTab = new jindo.TabControl(jindo.$('tab'), { 
	sClassPrefix : "tc-" // (String) 클래스명 앞에 붙게되는 prefix 선언
	sCheckEvent : "click", //탭에 적용될 이벤트 ("mouseover", "mousedown", "click")
	bActivateOnload : true //로드시 컴포넌트 활성화여부
}).attach({
	beforeSelect : function(oCustomEvent) {
		//탭이 선택되기 전에 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		// 	nIndex : (Number) 선택된 탭의 인덱스
		// 	elTab : (HTMLElement) 선택된 탭
		// 	elPanel : (HTMLElement) 선택된 패널
		//}
		//oCustomEvent.stop()시 해당 탭이 선택되지 않음.
	}
	select : function(oCustomEvent) {
		//탭이 선택되었을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		// 	nIndex : (Number) 선택된 탭의 인덱스
		// 	elTab : (HTMLElement) 선택된 탭
		// 	elPanel : (HTMLElement) 선택된 패널
		//}
	}
});
	 */
	$init : function(el, htOption) {
		
		//옵션 초기화
		var htDefaultOption = {
			sClassPrefix : 'tc-', //Default Class Prefix
			sCheckEvent : "click", //탭에 적용될 이벤트 ("mouseover", "mousedown", "click")
			bActivateOnload : true //로드시 컴포넌트 활성화여부
		};
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		//Base 엘리먼트 설정
		this._el = jindo.$(el);
		
		this._wfEventTab = jindo.$Fn(this._onEventTab, this);

		//컴포넌트에서 사용되는 HTMLElement들을 선언하는 메소드
		this._assignHTMLElements();
		
		//활성화
		if(this.option("bActivateOnload")) {
			this._selectTab(this._elSelectedTab);
			this.activate(); //컴포넌트를 활성화한다.	
		}
	},
	
	/**
	 * 컴포넌트에서 사용되는 HTMLElement들을 선언하는 메소드
	 */
	_assignHTMLElements : function() {
		var sPrefix = this.option('sClassPrefix'),
			el = this._el;
		
		this._aTab = jindo.$$('.' + sPrefix + 'tab', el);
		this._aPanel = jindo.$$('.' + sPrefix + 'panel', el);
		this._elSelectedTab = jindo.$$.getSingle('.' + sPrefix + 'tab.' + sPrefix + 'selected', el) || this.getTab(0);
		this._waTab = jindo.$A(this._aTab);
	},
	
	/**
	 * n번째 탭 엘리먼트를 구한다
	 * @return {HTMLElement}
	 */
	getTab : function(n) {
		return this.getTabs()[n];
	},

	/**
	 * 탭 엘리먼트 목록을 구한다
	 * @return {Array}
	 */
	getTabs : function() {
		return this._aTab;
	},

	/**
	 * n번째 패널 엘리먼트를 구한다
	 * @return {HTMLElement}
	 */
	getPanel : function(n) {
		return this.getPanels()[n];
	},

	/**
	 * 패널 엘리먼트 목록을 구한다
	 * @return {Array}
	 */
	getPanels : function() {
		return this._aPanel;
	},

	/**
	 * n번째 Tab을 선택한다.
	 * @param {Number} n
	 * @param {bFireEvent} 선택시 사용자 이벤트를 발생할 지 여부
	 */
	selectTab : function(n, bFireEvent) {
		if (typeof bFireEvent == "undefined") {
			bFireEvent = true;	
		}
		
		this._selectTab(this.getTab(n), bFireEvent);
	},

	/**
	 * 몇 번째 탭인지 구한다
	 * @param {HTMLElement} elTab
	 * @return {Number} 
	 */	
	getIndex : function(elTab) {
		return this._waTab.indexOf(elTab);
	},
	
	/**
	 * 현재 몇번째 탭이 보여지고 있는지 구한다.
	 * @return {Number}
	 */
	getCurrentIndex : function() {
		return this._nCurrentIndex;
	},
	
	_selectTab : function(elTab, bFireEvent) {
		if (typeof bFireEvent == "undefined") {
			bFireEvent = true;	
		}
		
		var sPrefix = this.option('sClassPrefix'),
			nIndex = this.getIndex(elTab),
			elPanel = this.getPanel(nIndex);
		
		if (bFireEvent) {
			if (!this.fireEvent("beforeSelect", {
				nIndex : nIndex,
				elTab : elTab,
				elPanel : elPanel
			})) {
				return;
			}
		}
		
		var welTab = jindo.$Element(elTab);
		if (this._welSelectedTab) {
			this._welSelectedTab.removeClass(sPrefix + 'selected');
		}
		this._welSelectedTab = welTab;
		welTab.addClass(sPrefix + 'selected');
		
		var welPanel = jindo.$Element(elPanel);
		if (this._welSelectedPanel) {
			this._welSelectedPanel.removeClass(sPrefix + 'selected');
		}
		this._welSelectedPanel = welPanel;
		welPanel.addClass(sPrefix + 'selected');
		
		this._nCurrentIndex = nIndex;
		
		if (bFireEvent) {
			this.fireEvent("select", {
				nIndex : nIndex,
				elTab : elTab,
				elPanel : elPanel
			});
		}
	},
	
	/**
	 * 컴포넌트의 베이스 엘리먼트를 가져온다.
	 * @return {HTMLElement}
	 */
	getBaseElement : function() {
		return this._el;
	},
	
	/**
	 * 컴포넌트를 활성화한다.
	 * @return {this}
	 */
	_onActivate : function() {
		this._wfEventTab.attach(this._el, this.option("sCheckEvent"));
	},
	
	/**
	 * 컴포넌트를 비활성화한다.
	 * @return {this}
	 */
	_onDeactivate : function() {
		this._wfEventTab.detach(this._el, this.option("sCheckEvent"));
	},
	
	_onEventTab : function(we) {
		if (this.fireEvent(we.type, { weEvent : we })) {
			var sPrefix = this.option('sClassPrefix'),
				el = we.element,
				elTab = jindo.$$.test(el, '.' + sPrefix + 'tab') ? el : jindo.$$.getSingle('! .' + sPrefix + 'tab', el);
				
			if (elTab) {
				this._selectTab(elTab);	
				we.stopDefault();
			}
		}
	}
}).extend(jindo.UIComponent);
/**
 * @fileOverview 자식 노드를 Ajax요청으로 실시간으로 가져오는 동적트리
 * @author senxation
 * @version 0.2
 */
jindo.DynamicTree = jindo.$Class({
	/** @lends jindo.DynamicTree */
	
	/**
	 * DynamicTree 컴포넌트를 생성한다.
	 * @constructs
	 * @class 자식 노드를 Ajax요청으로 실시간으로 가져오는 동적트리 컴포넌트
	 * @extends jindo.Tree
	 * @param {HTMLElement} el 컴포넌트를 적용할 Base (기준) 엘리먼트
	 * @param {HashTable} htOption 옵션객체
	 * @example
var oDanamicTree = new jindo.DynamicTree(jindo.$('tree'), {
	sClassPrefix: 'tree-',
	sUrl : "http://ajaxui.jindodesign.com/docs/components/samples/response/DynamicTree.php"
}).attach({
	request : function(oCustomEvent) {
		//자식노드의 데이터를 가져오기위해 Ajax 요청을 보내기 직전에 발생
		//이벤트 객체 oCustomEvent = {
		//	element : (HTMLElement) 선택된 노드, 
		//	htRequestParameter : { //(Object) Ajax 요청을 보낼 파라메터 객체
		//		sKey : (String) 선택된 노드의 유일한 key값
		// 	}
		//}
		//oCustomEvent.stop() 수행시 Ajax 요청 보내지 않음
	},
	response : function(oCustomEvent) {
		//응답을 받은 후 자식노드를 트리에 추가하기 전에 발생
		//이벤트 객체 e = {
		//	htResponseJSON : (HashTable) Ajax 응답의 JSON 객체
		//}
		//oCustomEvent.stop() 수행시 응답에 대한 자식노드를 추가하지 않음
	}
});
	 * @example
응답 예제
{
	sKey : 'tree-data-12452282036211399187', //부모 노드의 키
	htChildren : [
		{
			sLabel : 'node', //첫번째 자식 노드의 레이블   
			bHasChild : false //노드가 자식을 가지는지의 여부 
		},
		{
			sLabel : 'internal-node', 
			bHasChild : true
		}
	]
}
	 */
	$init : function(el, htOption) {
		
		var htDefaultOption = {
			sUrl : "", //요청 url
			sRequestType : "jsonp", //요청타입
			sRequestMethod : "get", //요청방식
			htRequestParameter : {} //(Object) 파라메터
		}
		
		this.option(htDefaultOption);
		this.option(htOption || {});

		this._attachEvents();		
		this._initAjax();
	},
	
	_attachEvents : function() {
		var self = this;
		
		this.attach("beforeExpand", function(oCustomEvent){
			
			var el = oCustomEvent.element;
			
			var self = this;
			//받아온 데이터가 있는지확인
			if(self.getNodeData(el).hasOwnProperty("_aChildren")) {
				return;
			};
	
			var htRequestParameter = self.option("htRequestParameter");
			htRequestParameter.key = self._getNodeDataKey(el);
			var htParam = {
				element : el,
				htRequestParameter : htRequestParameter 
			}
			
			if (self.fireEvent("request", htParam)) {
				//데이터를 받아옴
				self._request(htParam.htRequestParameter);
			}
			else {
				oCustomEvent.stop();				
			}
		});
	},
	
	_initAjax : function() {
		var htOption = this.option();
		var sPrefix = this.option("sClassPrefix");
        var sUrl = htOption.sUrl;
		var self = this;     
		this._oAjax = jindo.$Ajax(sUrl, {
            type: htOption.sRequestType,
            method: htOption.sRequestMethod,
            onload: function(oResponse){
                try {
					var htParam = {
						htResponseJSON : oResponse.json() 
					}
					
					if (!self.fireEvent("response", htParam)) {
						return;
					}
					
					var elNode = self.createNode(htParam.htResponseJSON["aChildren"]);
					var elTargetNode = jindo.$$.getSingle("." + htParam.htResponseJSON["sKey"], self.getRootList());
					if(self.getChildListOfNode(elTargetNode)) {
						return;
					}
					self.appendNode(elTargetNode, elNode);
					
					//자식이 있는경우 닫힌상태로 append
					jindo.$A(elNode).forEach(function(el){
						if (jindo.$$.getSingle("." + sPrefix + "has-child", el)) {
							jindo.$Element(el).addClass(sPrefix + "collapsed");	
						}
					});
                } 
                catch (e) {
                }
            }
        });
	},
	
	/**
     * @ignore
     */
    _request: function(htRequestParameter){
		this._oAjax.abort();
		this._oAjax.request(htRequestParameter);	
    },
		
	/**
	 * 노드가 자식을 가지고 있는지 여부를 가져온다. (overriding)
	 * @param {Object} elNode
	 * @return {Boolean}
	 */
	hasChild : function(elNode) {
		return this._htNodeData[this._getNodeDataKey(elNode)]["bHasChild"];
	},
	
	/**
	 * 노드를 새로 그린다. (자식노드가 있거나 마지막 노드일경우 클래스명 처리)
	 * @ignore
	 * @param {HTMLElement} elNode
	 */
	_paintNode : function(elNode) {
		if (!elNode) {
			return;
		}
		var htPart = this.getPartsOfNode(elNode);
		var aChildNodes = this.getChildNodes(elNode);
		
		var oNodeData = this.getNodeData(elNode);
		
		var welNode = jindo.$Element(elNode); 
		var welItem = jindo.$Element(htPart.elItem);

		delete oNodeData["_aChildren"]; //자식이 없으면 _aChildren 제거
		
		//자식이 있는지 여부		
		if (this.hasChild(elNode)) {
			welItem.addClass(this.htClassName.sHasChild);
			if (aChildNodes.length > 0) { //Ajax로 받아오기전에는 length == 0;
				oNodeData["bHasChild"] = true;
				oNodeData["_aChildren"] = [];
			}
			
			var self = this;
			jindo.$A(aChildNodes).forEach(function(elNode, i){
				oNodeData["_aChildren"].push(self.getNodeData(elNode));
			})
		}
		else {
			welItem.removeClass(this.htClassName.sHasChild);
			if (htPart.elChild) {
				htPart.elChild.parentNode.removeChild(htPart.elChild);	
			}
		}
		
		//마지막 노드인지
		oNodeData["lastNode"] = jindo.$$.getSingle('~ .' + this.htClassName.sNode, elNode) ? false : true;
		(oNodeData["lastNode"]) ? welNode.addClass(this.htClassName.sLastNode) : welNode.removeClass(this.htClassName.sLastNode);
		elNode.parentNode.style.zoom = 1; //ie 렌더링 버그 수정!!
	},
	
	/**
	 * (overriding)
	 * @ignore
	 */
	_makeNodeData : function(elNode) {
		var oNodeData = this.getNodeData(elNode);
		oNodeData["bHasChild"] = false;
		if (jindo.$Element(this.getPartsOfNode(elNode).elItem).hasClass(this.option('sClassPrefix') + 'has-child')) {
			oNodeData["bHasChild"] = true;				
		}	
		this.$super._makeNodeData(elNode);
	}
	
}).extend(jindo.Tree);

