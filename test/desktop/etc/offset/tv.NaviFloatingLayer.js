/**
 * @fileOverview 특정 레이어 영역이 브라우저 상단에 고정되어 노출되도록 처리하는 클래스의 생성자 및 메소드를 정의한 파일  
 * @name tv.NaviFloatingLayer.js
 */
if(typeof tv == "undefined"){ tv = {};}

tv.TopFixedLayer = new jindo.$Class({
	/** @lends tv.TopFixedLayer.prototype */
	/**
 	 * tv.TopFixedLayer 클래스의 인스턴스를 생성한다.  
 	 * @constructs
 	 * @class IE6을 제외한 Fixed 속성을 지원하는 브라우저에서 상단고정 처리를 하는 클래스
 	 */
	$init : function(el, htOption) {
		this.option(htOption || {});
		
		this._el = jindo.$(el);
		this._wel = jindo.$Element(el);
		this._welParent = jindo.$Element(this._el.parentNode);
		
		this.updateCssPosition();
	},
	
	/**
	 * 상단고정하기 엘리먼트의 이전 속성을 내부 변수에 할당한다. 
	 */
	updateCssPosition : function(){
		this._cssPos = this._getCssPosition();	//처음 플로팅 객체의 위치
	},
	
	_getCssPosition : function() {
		return {
			position : this._wel.css("position"),
			nY : parseInt(this._wel.css("top"), 10)
		};
	},
	
	/**
	 * 브라우저 스크롤 시 발생되는 이벤트에 대해서 스크롤 위치에 따른 repaint 역할을 하는 이벤트 핸들러 이다.
	 * IE6, 7에서 고정레이어의 위치 설정하거나 부모의 offset() 값이 잘못되고 있어 비동기로 해결 처리함  
	 */
	onScroll : function() {
		var self = this;
//		setTimeout(function(){
			self._paint(); 
//		},0);
	},
	
	_paint : function() {
    	var wel = this._wel;
		var htParam = { 
				nY : this._cssPos.nY
		};
		if(!this.fireEvent('beforeMove', htParam)){ return; }
		
		//TODO : CHECK PARENT'S OFFSET BUG WHEN FULL BROWSER SCREEN BY F11 KEY
		//log(this._welParent.offset().left +"-"+ jQuery(wel.$value()).offset().left);
		wel.css({
			"left" : (this._welParent.offset().left - tv.util.scrollLeft()) + "px", 
			"top"  : htParam.nY + "px"
		});
		
	}
}).extend(jindo.Component);

tv.TopFloatingLayer = new jindo.$Class({
	/** @lends tv.TopFloatingLayer.prototype */
	/**
 	 * tv.TopFloatingLayer 클래스의 인스턴스를 생성한다.
 	 * @extends tv.TopFixedLayer
 	 * @constructs
 	 * @class IE6에서 Absolute 속성을 사용하여 상단고정 처리를 하는 클래스
 	 */
	_getCssPosition : function() {
		return {
			position : this._wel.css("position"),
			nY  : this._wel.offset().top
		};
	},
	
	_paint : function() {
		var wel = this._wel;
		var cssPos = this._cssPos;
		
		var nPosY = wel.offset().top - tv.util.scrollTop(); //현재 플로팅 객체의 위치 - 스크롤 위치( 스크롤 기준 선부터 얼마나 떨어져 있나)
		
		var htParam = { 
				nY : parseInt(wel.css("top"), 10) + (cssPos.nY - nPosY)
		};
		
		if(!this.fireEvent('beforeMove', htParam)){ return; }
		
		wel.css({ top : htParam.nY + "px" });
	}
}).extend(tv.TopFixedLayer);

tv.NaviFloatingLayer = new jindo.$Class({
	/** @lends tv.NaviFloatingLayer.prototype */
	/**
 	 * tv.NaviFloatingLayer 클래스의 인스턴스를 생성한다.  
 	 * @constructs
 	 * @class 타임바 레이어에 브라우저 상단에 Floating 처리할 수 있는 클래스
 	 * @param {jindo.$Element} elLayer 	타임바 레이어 $Element 객체 
 	 * @param {Number} nFloatTop 		Floating 고정을 시작할 위치
 	 * @param {Number} nFloatBottom 	Floating 될 수 있는 최대 높이
 	 * @example
 <xmp>
 <div class="time_layer">
 ...
 </div>
 <script>
 	new tv.NaviFloatingLayer(jindo.$$(".head_layer")[0], 0, 100);
 	new tv.NaviFloatingLayer(jindo.$$(".time_layer")[0], 100, 10000);
 </script>
 </xmp>
 	 */
    $init: function(elLayer, nFloatTop, nFloatBottom){
		elLayer = jindo.$(elLayer);
	
		this.welLayer = jindo.$Element(elLayer);
		this.welDummyLayer = jindo.$Element(this.createPhantomLayer(this.welLayer));

		this.oLayerCss = { 
			top    : (this.welLayer.css("top") === "auto") ? "0px" : this.welLayer.css("top"), //IE6에서는 auto 속성에서 오류가 발생되므로 "0px"로 예외처리 하도록 함
			height : this.welLayer.height() + "px",
			offset : this.welLayer.offset(),
			position : this.welLayer.css("position")
		};
		
		this.oFloatingLayer = tv.util.isIE6() ? new tv.TopFloatingLayer(elLayer) : new tv.TopFixedLayer(elLayer);
		
		this.changeFloatingTopBottom(nFloatTop, nFloatBottom);
		
		var self = this;
		var weFloatingCustomEventHandler = {
			beforeMove : function(oCustomEvent){
				var nDiffTop = self.nFloatBottom - tv.util.scrollTop();
				nDiffTop = (self.nFloatTop > nDiffTop) ? self.nFloatTop - nDiffTop : 0; 
				oCustomEvent.nY -= nDiffTop ;	//브라우저 스크롤 시 아이폰의 리스트 넘김 방식과 같은 처리 제공
			}
		};
		this.oFloatingLayer.attach(weFloatingCustomEventHandler);

		this._wfScrollEventHandler = jindo.$Fn(this.onScrollEventHandler, this).bind();
		this.attachBrowserScrollEvent();
    },
    
    /**
     * Floating할 범위에 있는 OffsetTop과 OffsetBottom값을 변경한다.
     * @param {Number} nFloatTop 		Floating 고정을 시작할 위치
 	 * @param {Number} nFloatBottom 	Floating 될 수 있는 최대 높이
     */
    changeFloatingTopBottom : function(nFloatTop, nFloatBottom){
		this.nFloatTop = nFloatTop || 0;
		this.nFloatBottom = nFloatBottom || jindo.$Document().scrollSize().height;
		
		//상단고정 컴포넌트를 사용하기 위한 스타일로 설정
		this.activateFloatLayer();
		this.welLayer.css("top", this.nFloatTop + "px");
		
		if(tv.util.isIE6()){
			var nOffsetTop = this.welLayer.offset().top;
			var nCssTop = parseInt(this.welLayer.css("top"), 10);
			if(nOffsetTop !== this.nFloatTop){
				nCssTop -= (nOffsetTop - this.nFloatTop);
			}
			this.welLayer.css("top", nCssTop + "px");
		}
		
		this.oFloatingLayer.updateCssPosition();	//변경된 CSS포지션을 각 컴포넌트 내부에 업데이트 처리함
		
		//상단고정을 위한 스타일을 원래 스타일로 복원
		this.deactivateFloatLayer();
    },
    
	/**
 	 * 타임바 레이어의 위치를 대신할 더미 레이어를 생성한다.
 	 * @param {jindo.$Element} welLayer 타임바 레이어 $Element 객체 
 	 * @return {HTMLElement} 더미 레이어 엘리먼트
 	 */
    createPhantomLayer : function(welLayer){
    	//[NEWBROADCAST-761] 상단고정이 브라우저 스크롤 시 깜박임을 최소화 시키기 위해 팬텀레이어를 _ prefix가 설정된 className을 제외하고 동일하게 복사하여 사용하도록 한다.  
    	//var elDummyForFloating = welLayer.$value().cloneNode(false);
    	//elDummyForFloating.className = elDummyForFloating.className.replace(/(\W+)_\w+(\(([^\)]*)\))?/ig,"");
    	var elDummyForFloating = jindo.$("<div style='position:absolute; height:0px;'></div>");
		welLayer.after(elDummyForFloating);
		return elDummyForFloating;
	},
	
	/**
 	 * 타임바 레이어의 위치를 브라우저 스크롤 상태에 따라 브라우저 상단에 붙일건지 원래 위치로 이동시킬 건지 처리함 .
 	 * IE6 버그 - ScrollEvent Detach를 해줬음에도 ScrollEvent 이벤트 핸들러가 실행되는 현상을 해결하기 위해 ATTACH_SCROLL_EVENT_FLAG 플래그를 추가하여 이벤트 핸들러 수행 여부를 제어한다.
 	 * @param {jindo.$Event} weEvent  Event Wrapper
 	 */
	onScrollEventHandler : function(weEvent){
		if(!this.ATTACH_SCROLL_EVENT_FLAG){ return; }

		var nScrollTop = tv.util.scrollTop();
		
		//브라우저 스크롤 위치가 고정 레이어의 원래 OffsetTop 값보다 크고  스크롤 높이값이 고정 될 수 있는 최대 높이값보다 작은 경우에 상단 고정 시킴     
		if(	nScrollTop >= (this.oLayerCss.offset.top - this.nFloatTop) && nScrollTop <= this.nFloatBottom ){
			this.activateFloatLayer();
			this.oFloatingLayer.onScroll();
		}else{
			this.deactivateFloatLayer();
		}
	},
	
	/**
 	 * 브라우저 스크롤이 발생 시 해당 이벤트 핸들러가 실행되도록 이벤트 attach 한다.
 	 * 자동차 캘린더에서의 동작을 참조했다. http://auto.naver.com/cmpr/cmprResult.nhn?carsId=8639,8369
 	 */
    attachBrowserScrollEvent: function(){
		tv.NaviFloatingLayer.addScrollEventHandler(this._wfScrollEventHandler);
    	
    	this.ATTACH_SCROLL_EVENT_FLAG = true;
    },	
    
    /**
 	 * 브라우저 스크롤이 발생 시 해당 이벤트 핸들러가 실행되도록 이벤트 deatch 한다.
 	 */
    detachBrowserScrollEvent: function(){
    	tv.NaviFloatingLayer.removeScrollEventHandler(this._wfScrollEventHandler);
    	
    	this.ATTACH_SCROLL_EVENT_FLAG = false;
    },	
	
	/**
	 * Fixed Position 속성을 지원 못하는 IE6 브라우저에서 브라우저 스크롤 강제 이동 시 고정레이어가 이동하는 잔상효과를 없애기 위해 수동으로 화면에서 숨김/보임처리 한다.
	 * @param {Boolean} bVisibility visibility 속성을 이용하여 화면에 노출 여부  
	 */
	visibilityForNotSupportFixed : function(bVisibility){
		if(tv.util.isIE6()){ 
			this.welLayer.css("visibility", bVisibility ? "" : "hidden");
		}
	},

    /**
     * Layer를 Floating하기 위한 position style을 브라우저에 따라 리턴하도록 한다.  
     */
    getStylePositionForFloating : function(){
    	return tv.util.isIE6() ? "absolute" : "fixed";
    },	
	
	/**
 	 * 타임바 레이어를 브라우저 상단 바로 아래 고정시킨다
 	 * IE6일 경우 fixed position 속성을 사용할 수 없으므로 absolute position 속성을 사용하여 위치를 고정하도록 한다.
 	 * 타임바 레이어의 position 속성이 바뀔경우 레이어의 크기가 변경되므로 더미 레이어를 이용하여 이전 타임바 레이어의 위치를 대신하도록 한다.
 	 * @param {Number} nFloatTop 브라우저 상단에 붙일 의 스크롤 TOP 기준
 	 */
    activateFloatLayer : function(){
    	this.welLayer.css({ position : this.getStylePositionForFloating()});
    	this.welDummyLayer.css({ position : this.oLayerCss.position, height : this.oLayerCss.height});
	},
	
	/**
 	 * 타임바 레이어를 원래 위치로 이동시킨다.
 	 * 더미 레이어에 적용된 높이를 0px으로 초기화한다.
 	 */
	deactivateFloatLayer : function(){
		this.welLayer.css({"position" : this.oLayerCss.position, "top" : this.oLayerCss.top});
		this.welDummyLayer.css({ position : "absolute", height : "0px"});
	}
});

/**
 * NaviFloatingLayer 생성할 때 마다 STATIC한 이벤트 핸들러의 Queue로 등록하여 스크롤 시 상단고정 위치 처리를 빠르게 한다.
 * @function NaviFloatingLayer Class Method For Attach Scroll Event
 */
(function(){
	var _scrollEventQueue = [];
	tv.NaviFloatingLayer._onScrollEvent = function(){
		for(var i = 0, len = _scrollEventQueue.length; i < len ; i++){
			_scrollEventQueue[i]();
		}
	};
	
	tv.NaviFloatingLayer.addScrollEventHandler = function(wfpEventHandler){
		_scrollEventQueue[_scrollEventQueue.length] = wfpEventHandler;
	};
	
	tv.NaviFloatingLayer.removeScrollEventHandler = function(wfpEventHandler){
		for(var i = 0, len = _scrollEventQueue.length; i < len ; i++){
			if( _scrollEventQueue[i] === wfpEventHandler){
				_scrollEventQueue.splice(i,1);
				break;
			}
		}
	};
	//$Element(window).attach("scroll",tv.NaviFloatingLayer._onScrollEvent).attach("resize",tv.NaviFloatingLayer._onScrollEvent)
	jindo.$Fn(tv.NaviFloatingLayer._onScrollEvent).attach(window, 'scroll').attach(window, 'resize');
})();
