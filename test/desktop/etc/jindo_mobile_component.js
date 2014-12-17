/**
 * Jindo Mobile Component
 * @version 1.1.0
 * NHN_Library:Jindo_Mobile_Component-1.1.0;JavaScript Mobile Components for Jindo;
 * 
 * jindo.m.ScrollEnd
 */

/**
 * Jindo Component
 * @version 1.0.1
 * NHN_Library:Jindo_Component-1.0.1;JavaScript Components for Jindo;
 * 
 * jindo.Component
 */

jindo.Component = jindo.$Class({
	/** @lends jindo.Component.prototype */

	_htEventHandler : null,
	_htOption : null,

	/**
	 * jindo.Component를 초기화한다.
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
	 * htCustomEventHandler 옵션을 선언해서 attach() 메소드를 사용하지 않고 커스텀 이벤트핸들러를 등록할 수 있다.
	 * @param {String} sName 옵션의 이름
	 * @param {String} sValue 옵션의 값
	 * @return {this} 컴포넌트 객체 자신
	 * @example
var MyComponent = jindo.$Class({
	method : function() {
		alert(this.option("foo"));
	}
}).extend(jindo.Component);

var oInst = new MyComponent();
oInst.option("foo", 123); // 또는 oInst.option({ foo : 123 });
oInst.method(); // 결과 123
	 * @example
//커스텀이벤트핸들러 등록예제
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
	 * 옵션의 setter 함수는 지정된 옵션이 변경되면 수행되는 함수이다.
	 * @param {String} sName setter의 이름
	 * @param {Function} fSetter setter 함수
	 * @return {this} 컴포넌트 객체 자신
	 * @example
oInst.option("sMsg", "test");
oInst.optionSetter("sMsg", function(){
	alert("sMsg 옵션값이 변경되었습니다.");
});
oInst.option("sMsg", "change"); -> alert발생
	 * @example
//HashTable 형태로 설정가능
oInst.optionSetter({
	"sMsg" : function(){
	},
	"nNum" : function(){
	}
});
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
var MyComponent = jindo.$Class({
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
	 * @param {String} sEvent 이벤트명. 생략시 모든 등록된 커스텀 이벤트 핸들러를 해제한다. 
	 * @return {this} 컴포넌트 객체 자신
	 * @example
//"show" 커스텀이벤트 핸들러 모두 해제
oInst.detachAll("show");

//모든 커스텀이벤트 핸들러 해제
oInst.detachAll();
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
 * @param {Array} aObject 기준엘리먼트의 배열
 * @param {HashTable} htOption 옵션객체의 배열
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
jindo.Component.factory = function(aObject, htOption) {
	var aReturn = [],
		oInstance;

	if (typeof htOption == "undefined") {
		htOption = {};
	}
	
	for(var i = 0, el; (el = aObject[i]); i++) {
		oInstance = new this(el, htOption);
		aReturn[aReturn.length] = oInstance;
	}

	return aReturn;
};

/**
 * 컴포넌트의 생성된 인스턴스를 리턴한다.
 * @return {Array} 생성된 인스턴스의 배열
 */
jindo.Component.getInstance = function(){
	if (typeof this._aInstance == "undefined") {
		this._aInstance = [];
	}
	return this._aInstance;
};

/**
 * @author nhn
 */
if(typeof jindo.m == "undefined" && typeof Node != "undefined") {
    /**
     * @description addEventListener된 객체를 알기위한 함수
     * A태그에 click 이벤트가 bind될 경우에만 적용
     * @date 2011. 11. 16
     * @author sculove
     */
    var ___Old__addEventListener___ = Node.prototype.addEventListener;
    Node.prototype.addEventListener = function(type, listener, useCapture){ 
            var callee = arguments.callee;
            if(callee && type === "click" && this.tagName === "A"){
                (this.___listeners___ || (this.___listeners___=[]) ).push({
                    listener : listener,
                    useCapture : useCapture
                });
            }   
            return ___Old__addEventListener___.apply(this, arguments);  
    };
    
    /**
     * @description removeEventListener된 객체를 알기위한 함수
     * A태그에 click 이벤트가 unbind될 경우에만 적용
     * @date 2011. 11. 16
     * @author sculove   
     */
    var ___Old__removeEventListener___ = Node.prototype.removeEventListener;
    Node.prototype.removeEventListener = function(type, listener, useCapture){ 
            var callee = arguments.callee;
            if(callee && type === "click" && this.tagName === "A"){
                if(this.___listeners___) {
                    this.___listeners___.pop();
                }
            }   
            return ___Old__removeEventListener___.apply(this, arguments);   
    };
}

/** 
 * <1.0.0 이후 수정사항>
 * http://devcode.nhncorp.com/news/detail.php?news_id=325
 * 
 * <1.1.0 이후 수정사항>
 * jindo.m.js 중복 지정시 '무한루프' 문제 수정 (http://devcode.nhncorp.com/projects/jindo-mobile-ui/issue/3156)
 * 
 */
jindo.m = (function() {
    // 내부 변수 m
    var __M__ = jindo.$Class({
        /** @lends jindo.m.prototype */
        /**
         * @description 초기화 함수
         * @constructs
         * @static 
         * @extends jindo.Component
         */     
        $init : function() {
            this._initVar();
            this._initDeviceInfo();
            this._attachEvent();
        },
        
        /**
         * @description 초기화
         */
        _initVar : function() {
            /** MOVE 타입 */
            this.MOVETYPE = {
                0 : 'hScroll',
                1 : 'vScroll',
                2 : 'dScroll',
                3 : 'tap',
                4 : 'longTap',
                5 : 'doubleTap'
            };
            this._isVertical = null;
            this._nPreWidth = -1;
            this._nRotateTimer = null;
            this._htHandler = {};
            this._htDeviceInfo = {};
        },
        
        /**
         * @description resize 이벤트 정제해서 리턴.
         * @return {String} 이벤트명
         * @date 2011. 11. 11
         * @author sculove
         */
        _getOrientationChangeEvt : function(){
            var bEvtName = 'onorientationchange' in window ? 'orientationchange' : 'resize';    
            var htInfo = this.getDeviceInfo();
            /** 
             * andorid 버그
             * 2.3에서는 orientationchange 이벤트가 존재하나, orientationchange를 적용할 경우, width와 height가 바꿔서 나옴 (setTimeout 500ms 필요)
             *  : 삼성안드로이드 2.3에서는 방향전환을 resize 이벤트를 이용하여 확인할 경우,
             *    만약, 사용자가 window에 resize이벤트를 bind할 경우 브라우저가 죽는 버그가 있음
             * 2.2에서는 orientationchange 이벤트가 2번 발생함. (처음에는 width,height가 바뀌고, 두번째는 정상적으로 나옴)
             * 그 이하는 resize로 처리
             * 갤럭시탭2인 경우 orientationchange 버그가 존재함
             *
             * in-app 버그
             * in-app인 경우 orientationChange발생시, width,height값이 바꿔서 나옴 (setTimeout 200ms 필요)
             */
            if( (htInfo.android && htInfo.version === "2.1") || htInfo.galaxyTab2) {
                bEvtName = 'resize';
            }
            return bEvtName;
        },
        
        /**
         * @description 디바이스 기기의 가로,세로 여부를 판단함.
         * @date 2011. 11. 11
         * @author sculove
         */
        _getVertical : function() {
            var bVertical = null, 
                sEventType = this._getOrientationChangeEvt();
            if(sEventType === "resize") {
                var screenWidth = document.documentElement.clientWidth;
                if (screenWidth < this._nPreWidth) {
                    bVertical = true;
                } else if (screenWidth == this._nPreWidth) {
                    bVertical = this._isVertical;
                } else {
                    bVertical = false;
                }
                this._nPreWidth = screenWidth;
                // console.log("getVertical : resize로 판별 -> " + bVertical);
            } else {
                var windowOrientation = window.orientation;
                if (windowOrientation === 0 || windowOrientation == 180) {
                    bVertical = true;
                } else if (windowOrientation == 90 || windowOrientation == -90) {
                    bVertical = false;
                }
                // console.log("getVertical : orientationChange로 판별 -> " + bVertical);           
            }
            return bVertical;
        },
        
        /**
         * @description jindo.m. 공통 이벤트 attach
         * @date 2011. 11. 11
         * @author sculove       
         */
        _attachEvent : function() {
            this._rotateEvent = jindo.$Fn(this._onOrientationChange, this).attach(window, this._getOrientationChangeEvt()).attach(window, "load");      
            this._pageShowEvent = jindo.$Fn(this._onPageshow, this).attach(window, "pageshow");     
        },
        
        /**
         * @description 브라우저 정보와 버전 정보를 갖는 this._htDeviceInfo를 초기화한다
         * @date 2011. 11. 11
         * @modify 2012.03.05 bInapp 추가 
         * @author oyang2, sculove           
         */
        _initDeviceInfo : function() {
            var sName = navigator.userAgent;
            var ar = null;
            function f(s,h) {
                return ((h||"").indexOf(s) > -1); 
            }
            this._htDeviceInfo.iphone = f('iPhone', sName);
            this._htDeviceInfo.ipad = f('iPad', sName);
            this._htDeviceInfo.android = f('Android', sName);
            this._htDeviceInfo.galaxyTab = f('SHW-M180S', sName) || f('SHW-M180K', sName) || f('SHW-M180L', sName);
            this._htDeviceInfo.galaxyTab2 = f('SHW-M380S', sName) || f('SHW-M380K', sName);
            this._htDeviceInfo.galaxyK = f('SHW-M130K',sName);
            this._htDeviceInfo.galaxyU = f('SHW-M130L',sName);          
            this._htDeviceInfo.galaxyS = f('SHW-M110S',sName) ||  f('SHW-M110K',sName) ||  f('SHW-M110L',sName);
            this._htDeviceInfo.galaxyS2 = f('SHW-M250S',sName) || f('SHW-M250K',sName) || f('SHW-M250L',sName);
            this._htDeviceInfo.version = '';
            this._htDeviceInfo.bChrome = this._htDeviceInfo.android && f('CrMo',sName);
            this._htDeviceInfo.bInapp = false;
            
            if(this._htDeviceInfo.iphone || this._htDeviceInfo.ipad){
                ar = sName.match(/OS\s([\d|\_]+\s)/i);              
                if(ar !== null&& ar.length > 1){
                    this._htDeviceInfo.version = ar[1];         
                }       
            } else if(this._htDeviceInfo.android){
                ar = sName.match(/Android\s(\d\.\d)/i);
                if(ar !== null&& ar.length > 1){
                    this._htDeviceInfo.version = ar[1];
                }   
            }
            this._htDeviceInfo.version = this._htDeviceInfo.version.replace(/\_/g,'.');
                          	            
            // device name 설정
            for(var x in this._htDeviceInfo){
                if (typeof this._htDeviceInfo[x] == "boolean" && this._htDeviceInfo[x] && this._htDeviceInfo.hasOwnProperty(x)) {
                    this._htDeviceInfo.name = x;
                }
            }
          //inapp여부 추가.true 일경우는 확실한 inapp이며,false - 웹브라우저 혹은 알수없는 경우    
        	if(this._htDeviceInfo.iphone || this._htDeviceInfo.ipad){        		
        		 if(!f('Safari', sName)){
        			 this._htDeviceInfo.bInapp = true;
        		 }
        	}else if(this._htDeviceInfo.android){
        		sName =sName.toLowerCase();
        		if( f('inapp', sName) || f('app', sName.replace('applewebkit',''))){
        			this._htDeviceInfo.bInapp = true;
        		}
        	}        
        },
        
        /**
         * @description 가로,세로 변경 여부 확인
         * @date 2011. 11. 11
         * @author sculove
         */
        _onOrientationChange : function(we) {
            var self = this;
            if(we.type === "load") {
            	this._nPreWidth = document.documentElement.clientWidth;
                /**
                 * 웹 ios에서는 사이즈가 아닌 orientationChange로 확인
                 * 왜? iphone인 경우, '개발자콘솔'이 설정된 경우 초기 처음 오동작
                 */
                if(!this._htDeviceInfo.bInapp && ( this._htDeviceInfo.iphone || this._htDeviceInfo.ipad )) {    // 웹ios인 경우
                    this._isVertical = this._getVertical();
                } else {
                    if(this._nPreWidth > document.documentElement.clientHeight) {
                        this._isVertical = false;
                    } else {
                        this._isVertical = true;
                    }
                }
                // console.log("Rotate init isVertical : " + this._isVertical);
				return;
            }
            if (this._getOrientationChangeEvt() === "resize") { // android 2.1 이하...
                // console.log("Rotate Event is resize");
                setTimeout(function(){
                    self._orientationChange(we);
                }, 0);
            } else {    
                //console.log("Rotate Event is orientationChange");
                var nTime = 200;
                if(this.getDeviceInfo().android) {  // android 2.2이상
                    nTime = 500;                            
                }
                clearTimeout(this._nRotateTimer);
                    this._nRotateTimer = setTimeout(function() {
                        self._orientationChange(we);                        
                },nTime);
            }
        },

        /**
         * @description 현재 폰의 위치가 가로인지 세로인지 확인
         * @date 2011. 11. 11
         * @author sculove
         */
        _orientationChange : function(we) {
            var nPreVertical = this._isVertical;
            this._isVertical = this._getVertical();
            //console.log("회전 : " + nPreVertical + " -> " + this._isVertical);
            if (jindo.$Agent().navigator().mobile || jindo.$Agent().os().ipad) {
                if (nPreVertical !== this._isVertical) {
                    this.fireEvent("mobilerotate", {
                        isVertical: this._isVertical
                    });
                }
            } else {    // PC일 경우, 무조건 호출
                this.fireEvent("mobilerotate", {
                    isVertical: this._isVertical
                });
            }
        },
        
        /**
         * @description 모바일 기기 회전시, 적용할 함수를 bind 함
         * @date 2011. 11. 11
         * @example
         * var f = jindo.$Fn(this.setSize, this).bind();
         * // bind함
         * jindo.m.bindRotate(f);
         * 
         * // unbind함
         * jindo.m.unbindRotate(f);
         * @param {Object} fHandlerToBind
         * @author sculove
         */
        bindRotate : function(fHandlerToBind) {
            var aHandler = this._htHandler["mobilerotate"];
            if (typeof aHandler == 'undefined'){
                aHandler = this._htHandler["mobilerotate"] = [];
            }
            aHandler.push(fHandlerToBind);
            this.attach("mobilerotate", fHandlerToBind);
        },
        
        /**
         * @description 모바일 기기 회전시, 적용할 함수를 unbind 함
         * @date 2011. 11. 11
         * @example
         * var f = jindo.$Fn(this.setSize, this).bind();
         * // bind함
         * jindo.m.bindRotate(f);
         * 
         * // unbind함
         * jindo.m.unbindRotate(f);
         * @param {Object} fHandlerToUnbind
         * @author sculove
         */
        unbindRotate : function(fHandlerToUnbind) {
            var aHandler = this._htHandler["mobilerotate"];
            if (aHandler) {
                for (var i = 0, fHandler; (fHandler = aHandler[i]); i++) {
                    if (fHandler === fHandlerToUnbind) {
                        aHandler.splice(i, 1);
                        this.detach("mobilerotate", fHandlerToUnbind);
                        break;
                    }
                }
            }           
        },

        /**
         * @description pageShow 이벤트
         * @date 2011. 11. 11
         * @author sculove
         */
        _onPageshow : function(we) {
            var self = this;
            setTimeout(function() {
                self.fireEvent("mobilePageshow", {
                }); 
            },300);
        },
        
        /**
         * @description pageshow호출, 함수 bind
         * @date 2011. 11. 11
         * @example
         * var f = jindo.$Fn(this.setSize, this).bind();
         * // bind함
         * jindo.m.bindPageshow(f);
         * 
         * // unbind함
         * jindo.m.unbindPageshow(f);
         * @param {Object} fHandlerToBind
         * @author sculove
         */     
        bindPageshow : function(fHandlerToBind) {
            var aHandler = this._htHandler["mobilePageshow"];
            if (typeof aHandler == 'undefined'){
                aHandler = this._htHandler["mobilePageshow"] = [];
            }
            aHandler.push(fHandlerToBind);
            this.attach("mobilePageshow", fHandlerToBind);
        },
        
        /**
         * @description pageshow호출, 함수 unbind
         * @date 2011. 11. 11
         * @example
         * var f = jindo.$Fn(this.setSize, this).bind();
         * // bind함
         * jindo.m.bindPageshow(f);
         * 
         * // unbind함
         * jindo.m.unbindPageshow(f);
         * @param {Object} fHandlerToBind
         * @author sculove
         */             
        unbindPageshow : function(fHandlerToUnbind) {
            var aHandler = this._htHandler["mobilePageshow"];
            if (aHandler) {
                for (var i = 0, fHandler; (fHandler = aHandler[i]); i++) {
                    if (fHandler === fHandlerToUnbind) {
                        aHandler.splice(i, 1);
                        this.detach("mobilePageshow", fHandlerToUnbind);
                        break;
                    }
                }
            }           
        },      

        /**
         * @description 브라우저 정보와 버전 정보를 제공한다.
         * @date 2011. 11. 11
         * @example 
         *  jindo.m.getDeviceInfo().android     //안드로이드 여부
         *  jindo.m.getDeviceInfo().iphone      //아이폰 여부
         *  jindo.m.getDeviceInfo().ipad        //아이패드 여부
         *  jindo.m.getDeviceInfo().galaxyTab   //갤럭시탭 여부
         *  jindo.m.getDeviceInfo().galaxyTab2  //갤럭시탭2 여부
         *  jindo.m.getDeviceInfo().galaxyK     //갤럭시K 여부
         *  jindo.m.getDeviceInfo().galaxyU     //갤럭시U 여부
         *  jindo.m.getDeviceInfo().galaxyS     //갤럭시S 여부
         *  jindo.m.getDeviceInfo().galaxyS2    //갤럭시S2 여부
         *  jindo.m.getDeviceInfo().version     //안드로이드, 아이폰시 버젼정보 제공
         *  jindo.m.getDeviceInfo().bChrome     //크롬 브라우저 여부
         *  jindo.m.getDeviceInfo().bInapp      //인앱여부, true- 인앱, false - 웹브라우저 혹은 알수없는 경우
         *  jindo.m.name                        //현재 단말기기 정보제공
         * 
         * @return {HashTable}
         * @author oyang2, sculove        
         */
        getDeviceInfo : function(){
            return this._htDeviceInfo;
        }, 
        
        /**
         * @description 현재 모바일기기의 가로,세로 여부를 반환한다.
         * @date 2011. 11. 11
         * @example
         * jindo.m.isVertical; // 수직여부 반환
         * @author sculove
         */
        isVertical : function() {
            return this._isVertical;
        },
        
        /**
         * @description TextNode를 제외한 상위노드를 반환한다.
         * @date 2011. 11. 11
         * @example
         * var elParent=jindo.m.getNodeElement(el); // TextNode를 제외한 상위노드를 반환한다.
         * @return {HTMLElement} el
         * @author oyang2
         */
        getNodeElement : function(el){
            while(el.nodeType != 1){
                el = el.parentNode;
            }
            return el;
        },
        
        /**
         * @description 현재 스크롤 Element의 offet을 구한다.
         * @date 2011. 11. 11
         * @example
         * var oObject=jindo.m.getCssOffset(el); // CSSOffset을 반환한다.
         * @param {HTMLElement} element  ComputedStyle 값을 이용하여 offset을 얻는 함수
         * @return {HashTable} {top,left} 
         * @author sculove       
         */
        getCssOffset : function(element){
            var htOffset;
            /** Andorid 3.0대에서는 WebKitCSSMatrix가 있지만, 안됨. 버그 */
           if(jindo.m.getDeviceInfo().android && parseInt(jindo.m.getDeviceInfo().version,10) === 3) {
               htOffset = jindo.m._getCssOffsetFromStyle(element);
           } else {
               if('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()){
                  htOffset = jindo.m._getCssOffsetFromCSSMatrix(element);
               } else {
                  htOffset = jindo.m._getCssOffsetFromStyle(element); 
               } 
           }
           return htOffset;
        },
        
        /**
         * @description transform에서 translate,translate3d의 left와 top 값을 추출
         * @return {HashTable} top,left
         */
        _getCssOffsetFromStyle : function(element) {
            var nTop = nLeft = 0, 
            s = element.style[jindo.m.getCssPrefix() + "Transform"];
            if(!!s && s.length >0){
                aTemp = s.match(/translate.{0,2}\((.*)\)/);
                if(!!aTemp && aTemp.length >1){
                    var a = aTemp[1].split(',');
                    if(!!a && a.length >1){
                        nTop = parseInt(a[1],10);
                        nLeft = parseInt(a[0],10);
                    }
                }
            }
            return {
                top : nTop,
                left : nLeft
            };
        },
        
        /**
         * @description WebKitCSSMatrix를 이용하여 left, top 값을 추출
         * @return {HashTable} top, left 
         */
        _getCssOffsetFromCSSMatrix : function(element) {
            var curTransform  = new WebKitCSSMatrix(window.getComputedStyle(element).webkitTransform);
            return {
                top : curTransform.m42,
                left : curTransform.m41
             };
        },
        
        /**
         * @description TransitionEnd 이벤트 bind
         * @date 2011. 11. 11
         * @param {HTMLElement} element attach할 엘리먼트
         * @param {Function} fHandlerToBind attach할 함수
         * @example
         *  jindo.m.attachTransitionEnd(el, function() { alert("attach"); }); // el에 transitionEnd 이벤트를 attach한다.
         *  jindo.m.detachTransitionEnd(el, function() { alert("detach"); }); // el에 transitionEnd 이벤트를 detach한다.
         * @author sculove       
         */
        attachTransitionEnd : function(element,fHandlerToBind) {
            var nVersion = + jindo.$Jindo().version.replace(/[a-z.]/gi,"");
            // console.log(nVersion);
            /* 진도 1.5.1에서 정상 동작. 그 이하버젼은 버그 */
            if(nVersion >= 151) {   // jindo
                element._jindo_fn_ = jindo.$Fn(fHandlerToBind,this).attach(element, "transitionend");
            } else {
                element.addEventListener('webkitTransitionEnd', fHandlerToBind, false); 
            }
        },
        
        /**
         * @description TransitionEnd 이벤트 unbind
         * @date 2011. 11. 11
         *  @example
         *  jindo.m.attachTransitionEnd(el, function() { alert("attach"); }); // el에 transitionEnd 이벤트를 attach한다.
         *  jindo.m.detachTransitionEnd(el, function() { alert("detach"); }); // el에 transitionEnd 이벤트를 detach한다.
         * @param {HTMLElement} element dettach할 엘리먼트
         * @param {Function} fHandlerToUnbind dettach할 함수
         * @author sculove       
         */
        detachTransitionEnd : function(element, fHandlerToUnbind) {
            var nVersion = + jindo.$Jindo().version.replace(/[a-z.]/gi,"");
            // console.log(nVersion);
            /* 진도 1.5.1에서 정상 동작. 그 이하버젼은 버그 */
            if(nVersion >= 151) {   // jindo
                if(element._jindo_fn_) {
                    element._jindo_fn_.detach(element, "transitionend");
                    delete element._jindo_fn_;
                }
            } else {
                element.removeEventListener('webkitTransitionEnd', fHandlerToUnbind, false);    
            }
        },
        
        /**
         * @description 브라우저 CssPrefix를 얻는 함수
         * @date 2011. 11. 11
         * @example
         * jindo.m.getCssPrefix(); // 브라우저별 prefix를 반환한다.
         * @return {String} return cssPrefix를 반환. webkit, Moz, O,...
         * @author sculove       
         */
        getCssPrefix : function() {
            var sCssPrefix = "";
            if(typeof document.body.style.MozTransition !== "undefined") {
                sCssPrefix = "Moz";
            } else if(typeof document.body.style.webkitTransition !== "undefined") {
                sCssPrefix = "webkit";
            } else if(typeof document.body.style.OTransition !== "undefined") {
                sCssPrefix = "O";
            }
            return sCssPrefix;
        },
              
        /**
	     * @description 자신을 포함하여 부모노드중에 셀렉터에 해당하는 가장 가까운 엘리먼트를 구함
	     * @date 2012. 02. 20
         * @example
         *  jindo.m.getClosest("cssName", elParent);   // elParent하위에 cssName 클래스명이 아닌 첫번째 Element를 반환한다.
	     * @param {String} sSelector CSS클래스명 또는 태그명
	     * @param {HTMLElement} elBaseElement 기준이 되는 엘리먼트
	     * @return {HTMLElement} 구해진 HTMLElement
	     * @author sculove       
         */
	    getClosest : function(sSelector, elBaseElement) {
	        //console.log("[_getClosest]", sSelector, elBaseElement)
	        var elClosest;
	        var welBaseElement = jindo.$Element(elBaseElement);
	        
	        var reg = /<\/?(?:h[1-5]|[a-z]+(?:\:[a-z]+)?)[^>]*>/ig;
	        if (reg.test(sSelector)) {
	            // 태그 일경우
	             if("<" + elBaseElement.tagName.toUpperCase() + ">" == sSelector.toUpperCase()) {
	                 elClosest = elBaseElement;
	             } else {
	                 elClosest = welBaseElement.parent(function(v){
	                     if("<" + v.$value().tagName.toUpperCase() + ">" == sSelector.toUpperCase()) {
	                        //console.log("v", v)
	                        return v;
	                    }
	                });
	                elClosest = elClosest.length ? elClosest[0].$value() : false; 
	             }
	        } else { 
	        	//클래스명일 경우
	        	 if(sSelector.indexOf('.') == 0){sSelector = sSelector.substring(1,sSelector.length)}
	             if(welBaseElement.hasClass(sSelector)) {
	                elClosest = elBaseElement;
	             } else {
	                elClosest = welBaseElement.parent(function(v){
	                    if(v.hasClass(sSelector)) {
	                        //console.log("v", v)
	                        return v;
	                    }
	                });
	                elClosest = elClosest.length ? elClosest[0].$value() : false; 
	            }
	        }
	        //console.log("elClosest", elClosest)
	        return elClosest;
	    }
    }).extend(jindo.Component);
    
    return new __M__();
})();
/**
* @(#)jindo.m.CoreScroll.js 2011. 12. 05.
*
* Copyright NHN Corp. All rights Reserved.
* NHN PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
*/
/**
* @author sculove
* @since 2011. 12. 05.
* 
* @description
* 
* <1.0.0 이후 변경 사항>
* 1. Android 3.x, 4.x 대응 
*  : 연속적인 scroll 이벤트 후 touchend는 발생하지 않음 
*/
jindo.m.ScrollEnd = jindo.$Class({
	/** @lends jindo.m.ScrollEnd.prototype */
	/**
	 * @description 초기화 함수
	 * @constructs
	 * @class 
	 * @extends jindo.Component
     */	
	$init : function(el,htUserOption) {
		this._initVar();
		this._setWrapperElement(el);
		this._attachEvent();
	},	
	
	/**
	 * @description 변수 초기화
	 */
	_initVar : function() {
		// Type 0: iOS, 1: Android (2.x), 2: Android (3.x이상 )
		if(jindo.m.getDeviceInfo().android) {
            if(parseInt(jindo.m.getDeviceInfo().version,10) >= 3) {
                this._nType = 2;    
                this._nScrollTimer = -1;
            } else {
                this._nType = 1;
            }
		} else {
		  this._nType = 0;
		}
		this._isTouched = false;
		this._isMoved = false;
		this._nObserver = null;
		this._nScrollEndTimer = null;
		this._nPreLeft = null;
		this._nPreTop = null;
		this._isTop = false;
	},
	
	/**
	 * @description 객체 초기화
	 */
	_setWrapperElement : function(el) {
		this._htElement = {};
		this._htElement["body"] = document.body;
	},
	
	/**
	 * @description 이벤트 활성화
	 */
	_attachEvent : function() {
		this._htEvent = {};
		this._htEvent["event_scroll"] = {
			ref : jindo.$Fn(this._onScroll, this).attach(document, "scroll"),
			el : document
		};
		
		if(this._nType == 1) {
			this._htEvent["event_touchstart"] = {
				ref : jindo.$Fn(this._onStartForAndroid, this).attach(this._htElement["body"], "touchstart"),
				el : this._htElement["body"]
			};
			this._htEvent["event_touchmove"] = {
				ref : jindo.$Fn(this._onMoveForAndroid, this).attach(this._htElement["body"], "touchmove"),
				el : this._htElement["body"]
			};
			this._htEvent["event_touchend"] = {
				ref : jindo.$Fn(this._onEndForAndroid, this).attach(this._htElement["body"], "touchend"),
				el : this._htElement["body"]
			};
		}
	},
	
	/**
	 * @description 이벤트 비활성화
	 */
	_detachEvent : function() {
		for(var p in this._htEvent) {
			var ht = this._htEvent[p];
			ht.ref.detach(ht.el, p.substring(p.lastIndexOf("_")));
		}
	},
	
	/**
	 * @description 이벤트 감시자 시작
	 */
	_startObserver : function() {
		var self = this;
		this._stopObserver();
		this._nObserver = setInterval(function() {
			self._observe();
		},100); 
	},
	
	/**
	 * @description 이벤트 감시
	 */
	_observe : function() {
		if(this._isTouched || (this._nPreTop !== window.pageYOffset || this._nPreLeft !== window.pageXOffset) ) {
			this._nPreTop = window.pageYOffset;	
			this._nPreLeft = window.pageXOffset;	
		} else {
			this._stopObserver();
			//console.log("옵저버끝 " + window.pageYOffset);
			this._fireEventScrollEnd();
		}
	},
	
	/**
	 * @description 이벤트 감시자 중지
	 */
	_stopObserver : function() {
		clearInterval(this._nObserver);
		this._nObserver = null;	
	},
	
	/**
	 * @description scroll 이벤트  핸들러
	 */
	_onScroll : function(we) {
		// ios에서 scroll은 무조선 scrollEnd
		switch(this._nType) {
		    case 0 : this._fireEventScrollEnd(); break;
		    case 1 : this._startObserver(); break;
		    case 2 : var self = this;
                  clearTimeout(this._nScrollTimer);
                  this._nScrollTimer = setTimeout(function() {
                      self._fireEventScrollEnd();
                  },350);
                  break;
		}
	},
	
	/**
	 * @description touchstart 이벤트  핸들러
	 */
	_onStartForAndroid : function(we) {
		this._stopObserver();
		this._isTouched = true;
		this._isMoved = false;
		
		this._nPreTop = null;
		this._nPreLeft = null;
		
		if(window.pageYOffset === 0) {
			this._isTop = true;	
		} else {
			this._isTop = false;
		}
	},

	/**
	 * @description touchstart 이벤트  핸들러
	 */
	_onMoveForAndroid : function(we) {
		this._isMoved = true;
	},

	/**
	 * @description touchend 이벤트  핸들러
	 */
	_onEndForAndroid : function(we) {
		this._isTouched = false;
		/*
		 * android인 경우, 주소창이 보이면 scroll이벤트가 발생하지 않음.  
		 * 주소창이 보여서 스크롤이 발생하여도 window.pageYOffset 0이므로,
		 * touchstart시점이 0 에서 시작할 경우, 움직임이 있고, 
		 * 200ms이후, window.pageYOffset 위치가 0일 경우, 스크롤 End를 호출한다.
		 */ 
		
		//addConsole("[touchend] isTop : " + this._isTop + ", isMoved : " + this._isMoved);
		if(this._isTop && this._isMoved) {
			this._startObserver();
		}
	},
	
	
	/**
	 * @description scrollEnd 사용자 이벤트 호출
	 */
	_fireEventScrollEnd : function() {
		this.fireEvent("scrollEnd", {
			nTop : window.pageYOffset,
			nLeft : window.pageXOffset
		});
	},
	
	_fireEventScrollEndForAndroid : function() {
		var self = this;
		clearTimeout(this._nScrollEndTimer);
		this._nScrollEndTimer = setTimeout(function() {
			self._fireEventScrollEnd();			
		},500);
	},
		
	/**
	 * @description 객체 초기화
	 */
	destroy: function() {
	 	this._detachEvent();
	 	this._nType = -1;
		this._isTouched = null;
		this._isMoved = null;
		this._nObserver = null;
		this._nPreLeft = null;
		this._nPreTop = null;
	}	
}).extend(jindo.Component);

