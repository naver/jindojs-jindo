/**
 
 * @fileOverView $Window() 객체의 생성자 및 메서드를 정의한 파일
 * @name window.js
 * @author gony
  
 */

/**
 
 * @class $Window() 객체는 브라우저가 제공하는 window 객체를 래핑하고, 이를 다루기 위한 여러가지 메서드를 제공한다.
 * @Constructor
 * @description $Window() 객체를 생성하고 생성한다.
 * @param {Object} oWindow $Window() 객체로 래핑할 window 객체.
  
 */
jindo.$Window = function(el) {
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);

	this._win = el || window;
}

/**
 
 * @description $value() 메서드는 원본 window 객체를 반환한다.
 * @return {Object} window 객체.
 * @example
     $Window().$value(); // 원래의 window 객체를 반환한다.
  
 */
jindo.$Window.prototype.$value = function() {
	return this._win;
};

/**
 
 * @description resizeTo() 메서드는 창의 크기를 지정한 크기로 변경한다. 지정한 크기는 프레임을 포함한 창 전체의 크기를 의미한다. 따라서 실제로 표현하는 컨텐트 사이즈는 브라우저 종류와 설정에 따라 달라질 수 있다. 브라우저에 따라 보안 문제 때문에, 창 크기가 화면의 가시 영역보다 커지지 못하도록 막는 경우도 있다. 이 경우에는 지정한 크기보다 창이 작아질 수 있다. 단위는 픽셀(px) 단위이다.
 * @param {Number} nWidth 창의 너비.
 * @param {Number} nHeight 창의 높이.
 * @return {$Window} $Window() 객체.
 * @see $Window#resizeBy
 * @example
 // 현재 창의 너비를 400, 높이를 300으로 변경한다.
 $Window.resizeTo(400, 300);
  
 */
jindo.$Window.prototype.resizeTo = function(nWidth, nHeight) {
	this._win.resizeTo(nWidth, nHeight);
	return this;
};

/**
 
 * @description resizeBy() 메서드는 창의 크기를 지정한 크기만큼 늘리거나 줄인다. 창의 크기를 늘릴 때는 양의 정수를 줄일 때는 음의 정수를 입력한다. 단위는 픽셀(px) 단위이다.
 * @param {Number} nWidth 늘이거나 줄일 창의 너비.
 * @param {Number} nHeight 늘어날 줄일 창의 높이
 * @return {$Window} $Window() 객체.
 * @see $Window#resizeTo
 * @example
 // 현재 창의 너비를 100, 높이를 50 만큼 늘린다.
 $Window().resizeBy(100, 50);
  
 */
jindo.$Window.prototype.resizeBy = function(nWidth, nHeight) {
	this._win.resizeBy(nWidth, nHeight);
	return this;
};

/**
 
 * @description moveTo() 메서드는 창을 지정한 위치로 이동시킨다. 좌표는 브라우저 프레임을 포함한 창의 왼쪽 위의 모서리를 기준으로 한다. 단위는 픽셀(px) 단위이다.
 * @param {Number} nLeft 이동할 X 좌표.
 * @param {Number} nTop 이동할 Y좌표.
 * @see $Window#moveBy
 * @return {$Window} $Window() 객체.
 * @example
 *  // 현재 창을 (15, 10) 으로 이동시킨다.
 *  $Window().moveTo(15, 10);
  
 */
jindo.$Window.prototype.moveTo = function(nLeft, nTop) {
	this._win.moveTo(nLeft, nTop);
	return this;
};

/**
 
 * @description moveBy() 메서드는 창을 지정한 위치만큼 이동시킨다. 단위는 픽셀(px) 단위이다.
 * @param {Number} nLeft 창을 좌우로 이동시킬 크기. 양의 정수를 입력하면 오른쪽으로 이동시키고 음의 정수를 입력하면 왼쪽으로 이동한다.
 * @param {Number} nTop 창을 위아래로 이동시킬 크기. 양의 정수를 입력하면 아래로 이동시키고 음의 정수를 입력하면 위로 이동시킨다.
 * @see $Window#moveTo
 * @return {$Window} $Window() 객체.
 * @example
 *  // 현재 창을 좌측으로 15px만큼, 아래로 10px만큼 이동시킨다.
 *  $Window().moveBy(15, 10);
  
 */
 jindo.$Window.prototype.moveBy = function(nLeft, nTop) {
	this._win.moveBy(nLeft, nTop);
	return this;
};

/**
 
 * @description sizeToContent() 메서드는 내부 문서의 콘텐츠 크기에 맞추어 창의 크기를 변경한다. 이때 몇 가지 제약 사항을 가진다.<br>
<ul>
	<li>문서가 완전히 로딩된 다음에 메서드를 실행해야 한다.</li>
	<li>창이 내부 문서보다 큰 경우에는 내부 문서의 크기를 구할 수 없으므로, 반드시 창 크기를 내부 문서보다 작게 만든다.</li>
	<li>반드시 body 요소의 사이즈가 있어야 한다.</li>
	<li>HTML의 DOCTYPE이 Quirks일때 MAC 운영체제 환경에는 Opera 10 버전, Windows 운영체제 환경에서는 인터넷 익스플로러 6버전 이상, Opera 10 버전, Safari 4버전에서 정상 동작하지 않는다.</li>
	<li>가능하면 부모 창에서 실행시켜야 한다. 자식 창이 모니터 화면을 벗어나 가려진 경우, 인터넷 익스플로러에서는 가려진 영역을 콘텐츠가 없는 것으로 판단하여 가려진 영역만큼 줄인다.</li>
</ul>
위와 같은 제약 사항에 걸리는 경우 파라미터로 창의 사이즈를 직접 지정할 수 있다.
 * @param {Number} [nWidth] 창의 너비.
 * @param {Number} [nHeight] 창의 높이.
 * @return {$Window} $Window() 객체.
 * @see $Document#renderingMode
 * @example
 // 새 창을 띄우고 자동으로 창 크기를 컨텐트에 맞게 변경하는 함수
 function winopen(url) {
	try {
		win = window.open(url, "", "toolbar=0,location=0,status=0,menubar=0,scrollbars=0,resizable=0,width=250,height=300");
		win.moveTo(200, 100);
		win.focus();
	} catch(e){}
 
	setTimeout(function() {
		$Window(win).sizeToContent();
	}, 1000);
}

winopen('/samples/popup.html');
  
 */
	
jindo.$Window.prototype.sizeToContent = function(nWidth, nHeight) {
	if (typeof this._win.sizeToContent == "function") {
		this._win.sizeToContent();
	} else {
		if(arguments.length != 2){
			// use trick by Peter-Paul Koch
			// http://www.quirksmode.org/
			var innerX,innerY;
			var self = this._win;
			var doc = this._win.document;
			if (self.innerHeight) {
				// all except Explorer
				innerX = self.innerWidth;
				innerY = self.innerHeight;
			} else if (doc.documentElement && doc.documentElement.clientHeight) {
				// Explorer 6 Strict Mode
				innerX = doc.documentElement.clientWidth;
				innerY = doc.documentElement.clientHeight;
			} else if (doc.body) {
				// other Explorers
				innerX = doc.body.clientWidth;
				innerY = doc.body.clientHeight;
			}

			var pageX,pageY;
			var test1 = doc.body.scrollHeight;
			var test2 = doc.body.offsetHeight;

			if (test1 > test2) {
				// all but Explorer Mac
				pageX = doc.body.scrollWidth;
				pageY = doc.body.scrollHeight;
			} else {
				// Explorer Mac;
				//would also work in Explorer 6 Strict, Mozilla and Safari
				pageX = doc.body.offsetWidth;
				pageY = doc.body.offsetHeight;
			}
			nWidth  = pageX - innerX;
			nHeight = pageY - innerY;
		}
		this.resizeBy(nWidth, nHeight);
	}

	return this;
};