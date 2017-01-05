/**
 
 * @fileOverview $Event() 객체의 생성자 및 메서드를 정의한 파일
 * @name event.js
 * @author Kim, Taegon
  
 */

/**
 
 * @class $Event() 객체는 Event 객체를 래핑하여 이벤트 처리와 관련된 확장 기능을 제공한다. 사용자는 $Event() 객체를 사용하여 발생한 이벤트에 대한 정보를 파악하거나 동작을 지정할 수 있다.
 * @constructor
 * @description Event 객체를 래핑한 $Event() 객체를 생성한다.
 * @param {Event} event Event 객체.
  
 */
jindo.$Event = function(e) {
	var cl = arguments.callee;
	if (e instanceof cl) return e;
	if (!(this instanceof cl)) return new cl(e);

	if (typeof e == "undefined") e = window.event;
	if (e === window.event && document.createEventObject) e = document.createEventObject(e);

	this._event = e;
	this._globalEvent = window.event;

    /**  
     
이벤트의 종류
  
     */
	this.type = e.type.toLowerCase();
	if (this.type == "dommousescroll") {
		this.type = "mousewheel";
	} else if (this.type == "domcontentloaded") {
		this.type = "domready";
	}

	this.canceled = false;

	/**  
     
이벤트가 발생한 엘리먼트
  
     */
	this.element = e.target || e.srcElement;
    /**
     
이벤트가 정의된 엘리먼트
  
     */
	this.currentElement = e.currentTarget;
    /**
     
이벤트의 연관 엘리먼트
  
     */
	this.relatedElement = null;

	if (typeof e.relatedTarget != "undefined") {
		this.relatedElement = e.relatedTarget;
	} else if(e.fromElement && e.toElement) {
		this.relatedElement = e[(this.type=="mouseout")?"toElement":"fromElement"];
	}
}

/**
 
 * @description mouse() 메서드는 마우스 이벤트 정보를 담고 있는 객체를 반환한다. 마우스 이벤트 정보 객체의 속성에 대한 설명은 다음 표와 같다.<br>
 <table>
	<caption>마우스 이벤트 정보 객체 속성</caption>
	<thead>
		<tr>
			<th scope="col">속성</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>delta</td>
			<td>Number</td>
			<td>마우스 휠을 굴린 정도를 정수로 저장한다. 마우스 휠을 위로 굴린 정도는 양수 값으로, 아래로 굴린 정도는 음수 값으로 저장한다.</td>
		</tr>
		<tr>
			<td>left</td>
			<td>Boolean</td>
			<td>마우스 왼쪽 버튼 클릭 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>middle</td>
			<td>Boolean</td>
			<td>마우스 가운데 버튼 클릭 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>right</td>
			<td>Boolean</td>
			<td>마우스 오른쪽 버튼 클릭 여부를 불리언 형태로 저장한다.</td>
		</tr>
	</tbody>
</table>
* @return {Object} 마우스 이벤트 정보를 갖는 객체.
* @example
function eventHandler(evt) {
   var mouse = evt.mouse();

   mouse.delta;   // Number. 휠이 움직인 정도. 휠을 위로 굴리면 양수, 아래로 굴리면 음수.
   mouse.left;    // 마우스 왼쪽 버튼을 입력된 경우 true, 아니면 false
   mouse.middle;  // 마우스 중간 버튼을 입력된 경우 true, 아니면 false
   mouse.right;   // 마우스 오른쪽 버튼을 입력된 경우 true, 아니면 false
}
  
 */
jindo.$Event.prototype.mouse = function() {
	var e    = this._event;
	var delta = 0;
	var left = false,mid = false,right = false;

	var left  = e.which ? e.button==0 : !!(e.button&1);
	var mid   = e.which ? e.button==1 : !!(e.button&4);
	var right = e.which ? e.button==2 : !!(e.button&2);
	var ret   = {};

	if (e.wheelDelta) {
		delta = e.wheelDelta / 120;
	} else if (e.detail) {
		delta = -e.detail / 3;
	}

	ret = {
		delta  : delta,
		left   : left,
		middle : mid,
		right  : right
	};
	// replace method
	this.mouse = function(){ return ret };

	return ret;
};

/**
 
  * @description key() 메서드는 키보드 이벤트 정보를 담고 있는 객체를 반환한다. 키보드 이벤트 정보 객체의 속성에 대한 설명은 다음 표와 같다.<br>
 <table>
	<caption>키보드 이벤트 정보 객체 속성</caption>
	<thead>
		<tr>
			<th scope="col">속성</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>alt</td>
			<td>Boolean</td>
			<td>ALT 키 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>ctrl</td>
			<td>Boolean</td>
			<td>CTRL 키 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>down</td>
			<td>Boolean</td>
			<td>아래쪽 방향키 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>enter</td>
			<td>Boolean</td>
			<td>엔터(enter)키 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>esc</td>
			<td>Boolean</td>
			<td>ESC 키 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>keyCode</td>
			<td>Boolean</td>
			<td>입력한 키의 코드 값을 정수 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>left</td>
			<td>Boolean</td>
			<td>왼쪽 방향키 입력 여부를 불리언 형태 저장한다.</td>
		</tr>
		<tr>
			<td>meta</td>
			<td>Boolean</td>
			<td>META키(Mac 용 키보드의 Command 키) 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>right</td>
			<td>Boolean</td>
			<td>오른쪽 방향키 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>shift</td>
			<td>Boolean</td>
			<td>Shift키 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
		<tr>
			<td>up</td>
			<td>Boolean</td>
			<td>위쪽 방향키 입력 여부를 불리언 형태로 저장한다.</td>
		</tr>
	</tbody>
</table>
 * @return {Object} 키보드 이벤트 정보를 갖는 객체.
 * @example
function eventHandler(evt) {
   var key = evt.key();

   key.keyCode; // Number. 키보드의 키코드
   key.alt;     // Alt 키를 입력된 경우 true.
   key.ctrl;    // Ctrl 키를 입력된 경우 true.
   key.meta;    // Meta 키를 입력된 경우 true.
   key.shift;   // Shift 키를 입력된 경우 true.
   key.up;      // 위쪽 화살표 키를 입력된 경우 true.
   key.down;    // 아래쪽 화살표 키를 입력된 경우 true.
   key.left;    // 왼쪽 화살표 키를 입력된 경우 true.
   key.right;   // 오른쪽 화살표 키를 입력된 경우 true.
   key.enter;   // 리턴키를 눌렀으면 true
   key.esc;   // ESC키를 눌렀으면 true
   }
  
 */
jindo.$Event.prototype.key = function() {
	var e     = this._event;
	var k     = e.keyCode || e.charCode;
	var ret   = {
		keyCode : k,
		alt     : e.altKey,
		ctrl    : e.ctrlKey,
		meta    : e.metaKey,
		shift   : e.shiftKey,
		up      : (k == 38),
		down    : (k == 40),
		left    : (k == 37),
		right   : (k == 39),
		enter   : (k == 13),		
		esc   : (k == 27)
	};

	this.key = function(){ return ret };

	return ret;
};

/**
 
   * @description pos() 메서드는 마우스 커서의 위치 정보를 담고 있는 객체를 반환한다. 키보드 커서 위치 정보 객체의 속성에 대한 설명은 다음 표와 같다.<br>
 <table>
	<caption>마우서 커서 위치 정보 객체 속성</caption>
	<thead>
		<tr>
			<th scope="col">속성</th>
			<th scope="col">타입</th>
			<th scope="col">설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>clientX</td>
			<td>Number</td>
			<td>화면을 기준으로 마우스 커서의 X좌표를 저장한다.</td>
		</tr>
		<tr>
			<td>clientY</td>
			<td>Number</td>
			<td>화면을 기준으로 마우스 커서의 Y좌표를 저장한다.</td>
		</tr>
		<tr>
			<td>offsetX</td>
			<td>Number</td>
			<td>DOM 요소를 기준으로 마우스 커서의 상대적인 X좌표를 저장한다.</td>
		</tr>
		<tr>
			<td>offsetY</td>
			<td>Number</td>
			<td>DOM 요소를 기준으로 마우스 커서의 상대적인 Y좌표를 저장한다.</td>
		</tr>
		<tr>
			<td>pageX</td>
			<td>Number</td>
			<td>문서를 기준으로 마우스 커서의 X 좌표를 저장한다.</td>
		</tr>
		<tr>
			<td>pageY</td>
			<td>Number</td>
			<td>문서를 기준으로 마우스 커서의 Y좌표를 저장한다.</td>
		</tr>
	</tbody>
</table>
<b>참고</b>
<ul>
	<li>layerX, layerY는 더 이상 지원하지 않는다(deprecated).</li>
	<li>pos() 메서드를 사용하려면 Jindo 프레임워크에 $Element() 객체가 포함되어 있어야 한다.</li>
</ul>
 * @param {Boolean} bGetOffset 이벤트가 발생한 요소에서 마우스 커서의 상대 위치인 offsetX, offsetY 값을 구할 것인지를 결정할 파라미터. bGetOffset 값이 true면 값을 구한다.
 * @return {Object} 마우스 커서의 위치 정보.
 * @example
function eventHandler(evt) {
   var pos = evt.pos();

   pos.clientX;  // 현재 화면에 대한 X 좌표
   pos.clientY;  // 현재 화면에 대한 Y 좌표
   pos.pageX;  // 문서 전체에 대한 X 좌표
   pos.pageY;  // 문서 전체에 대한 Y 좌표
   pos.offsetX; // 이벤트가 발생한 엘리먼트에 대한 마우스 커서의 상대적인 X좌표 (1.2.0 이상)
   pos.offsetY; // 이벤트가 발생한 엘리먼트에 대한 마우스 커서의 상대적인 Y좌표 (1.2.0 이상)
   pos.layerX;  // (deprecated)이벤트가 발생한 엘리먼트로부터의 상대적인 X 좌표
   pos.layerY;  // (deprecated)이벤트가 발생한 엘리먼트로부터의 상대적인 Y 좌표
}
  
 */
jindo.$Event.prototype.pos = function(bGetOffset) {
	var e   = this._event;
	var b   = (this.element.ownerDocument||document).body;
	var de  = (this.element.ownerDocument||document).documentElement;
	var pos = [b.scrollLeft || de.scrollLeft, b.scrollTop || de.scrollTop];
	var ret = {
		clientX : e.clientX,
		clientY : e.clientY,
		pageX   : 'pageX' in e ? e.pageX : e.clientX+pos[0]-b.clientLeft,
		pageY   : 'pageY' in e ? e.pageY : e.clientY+pos[1]-b.clientTop,
		layerX  : 'offsetX' in e ? e.offsetX : e.layerX - 1,
		layerY  : 'offsetY' in e ? e.offsetY : e.layerY - 1
	};

    /*
     
오프셋을 구하는 메소드의 비용이 크므로, 요청시에만 구하도록 한다.
  
     */
	if (bGetOffset && jindo.$Element) {
		var offset = jindo.$Element(this.element).offset();
		ret.offsetX = ret.pageX - offset.left;
		ret.offsetY = ret.pageY - offset.top;
	}

	return ret;
};

/**
 
 * @description stop() 메서드는 이벤트의 버블링과 기본 동작을 중지시킨다. 버블링은 특정 HTML 엘리먼트에서 이벤트가 발생했을 때 이벤트가 상위 노드로 전파되는 현상이다. 예를 들어, &lt;div&gt; 요소를 클릭할 때 &lt;div&gt; 요소와 함께 상위 요소인 document 요소에도 onclick 이벤트가 발생한다. stop() 메서드는 지정한 객체에서만 이벤트가 발생하도록 버블링을 차단한다.
 * @param {Number} nCancelConstant $Event() 객체의 상수. 지정한 상수에 따라 이벤트의 버블링과 기본 동작을 선택하여 중지시킨다. $Event() 객체의 상수 값으로 CANCEL_ALL, CANCEL_BUBBLE, CANCEL_DEFAULT가 있으며, 기본 값은 CANCEL_ALL이다(1.1.3 버전 이상).
 * @return {$Event} 이벤트 객체.
 * @see $Event.CANCEL_ALL
 * @see $Event.CANCEL_BUBBLE
 * @see $Event.CANCEL_DEFAULT
 * @example
// 기본 동작만 중지시키고 싶을 때 (1.1.3버전 이상)
function stopDefaultOnly(evt) {
	// Here is some code to execute

	// Stop default event only
	evt.stop($Event.CANCEL_DEFAULT);
}
  
 */
jindo.$Event.prototype.stop = function(nCancel) {
	nCancel = nCancel || jindo.$Event.CANCEL_ALL;

	var e = (window.event && window.event == this._globalEvent)?this._globalEvent:this._event;
	var b = !!(nCancel & jindo.$Event.CANCEL_BUBBLE); // stop bubbling
	var d = !!(nCancel & jindo.$Event.CANCEL_DEFAULT); // stop default event

	this.canceled = true;

	if (typeof e.preventDefault != "undefined" && d) e.preventDefault();
	if (typeof e.stopPropagation != "undefined" && b) e.stopPropagation();

	if(d) e.returnValue = false;
	if(b) e.cancelBubble = true;

	return this;
};

/**
 
 * @description stopDefault() 메서드는 이벤트의 기본 동작을 중지시킨다. stop() 메서드의 파라미터로 CANCEL_DEFAULT 값을 입력한 것과 같다.
 * @return {$Event} 이벤트 객체.
 * @see $Event#stop
 * @see $Event.CANCEL_DEFAULT
  
 */
jindo.$Event.prototype.stopDefault = function(){
	return this.stop(jindo.$Event.CANCEL_DEFAULT);
}

/**
 
 * @description stopBubble() 메서드는 이벤트의 버블링을 중지시킨다. stop() 메서드의 파라미터로 CANCEL_BUBBLE 값을 입력한 것과 같다.
 * @return {$Event} 이벤트 객체.
 * @see $Event#stop
 * @see $Event.CANCEL_BUBBLE
  
 */
jindo.$Event.prototype.stopBubble = function(){
	return this.stop(jindo.$Event.CANCEL_BUBBLE);
}

/**
 
 * @description $value 메서드는 원본 Event 객체를 리턴한다
 * @return {Event} 원본 Event 객체
 * @example
function eventHandler(evt){
	evt.$value();
}
  
 */
jindo.$Event.prototype.$value = function() {
	return this._event;
};

/**
 
 * @constant
 * @description CANCEL_BUBBLE는 stop() 메서드에서 버블링을 중지시킬 때 사용되는 상수이다.
 * @see $Event#stop
 * @final
  
 */
jindo.$Event.CANCEL_BUBBLE = 1;

/**
 
 * @constant
 * @description CANCEL_DEFAULT는 stop() 메서드에서 기본 동작을 중지시킬 때 사용되는 상수이다.
 * @see $Event#stop
 * @final
  
 */
jindo.$Event.CANCEL_DEFAULT = 2;

/**
 
 * @constant
 * @description CANCEL_ALL는 stop() 메서드에서 버블링과 기본 동작을 모두 중지시킬 때 사용되는 상수이다.
 * @see $Event#stop
 * @final
  
 */
jindo.$Event.CANCEL_ALL = 3;
