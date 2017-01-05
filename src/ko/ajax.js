/**

 * @fileOverview $Ajax() 객체의 생성자 및 메서드를 정의한 파일
 * @name Ajax.js
 * @author Kim, Taegon
	
 */

/**

 * @class $Ajax() 객체는 다양한 개발 환경에서 Ajax 요청과 응답을 쉽게 구현하기 위한 메서드를 제공한다.<br>
 * @extends core
 * @constructor
 * @description $Ajax() 객체는 서버와 브라우저 사이의 비동기 통신, 즉 Ajax 통신을 지원한다. $Ajax() 객체는 XHR 객체(XMLHTTPRequest)를 사용한 기본적인 방식과 함께 다른 도메인 사이의 통신을 위한 여러 방식을 제공한다. $Ajax() 객체의 기본적인 초기화 방식은 다음과 같다.
 <textarea name="code" class="js:nocontrols">
 var oAjax = new $Ajax('server.php', {
    type : 'xhr',
    method : 'get',     // GET 방식으로 통신
    onload : function(res){ // 요청이 완료되면 실행될 콜백 함수
      $('list').innerHTML = res.text();
    },
    timeout : 3,      // 3초 이내에 요청이 완료되지 않으면 ontimeout 실행 (생략 시 0)
    ontimeout : function(){ // 타임 아웃이 발생하면 실행될 콜백 함수, 생략 시 타임 아웃이 되면 아무 처리도 하지 않음
      alert("Timeout!");
    },
    async : true      // 비동기로 호출하는 경우, 생략하면 true
  });
  oAjax.request();
}
</textarea>
 * @param {String} sUrl Ajax 요청을 보낼 서버의 URL.
 * @param {Object} oOption $Ajax()에서 사용하는 콜백 함수, 통신 방식 등과 같은 다양한 정보를 정의한다. oOption 객체의 프로퍼티와 사용법에 대한 설명은 다음 표와 같다.<br>
<table>
	<caption>oOption 객체의 속성</caption>
	<thead>
		<th>속성</th>
		<th>타입</th>
		<th>설명</th>
	</thead>
	<tbody>
		<tr>
			<td style="font-weight:bold;">type</td>
			<td>String</td>
			<td>
				Ajax 요청 방식. 생략하면 기본 값은 xhr이다.
				<ul>
					<li><strong>xhr</strong><br>
						브라우저에 내장된 XMLHttpRequest 객체를 이용하여 Ajax 요청을 처리한다. text, xml, json 형식의 응답 데이터를 처리할 수 있다. 요청 실패 시 HTTP 응답 코드를 통해 원인 파악이 가능하다. 단, 크로스 도메인(Cross-Domain) 상황에서 사용할 수 없다.
					</li>
					<li><strong>iframe</strong><br>
						iframe 요소를 프록시로 사용하여 Ajax 요청을 처리한다. 크로스 도메인 상황에서 사용할 수 있다. iframe 요청 방식은 다음과 같이 동작한다.
						<ol>
							<li>로컬(요청 하는 쪽)과 원격(요청 받는 쪽)에 모두 프록시용 HTML 파일을 만든다.</li>
							<li>로컬 프록시에서 원격 프록시로 데이터를 요청한다.</li>
							<li>원격 프록시가 원격 도메인에 XHR 방식으로 다시 Ajax 요청한다.</li>
							<li>응답을 받은 원격 프록시에서 로컬 프록시로 데이터를 전달한다.</li>
							<li>로컬 프록시에서 최종적으로 콜백 함수(onload)를 호출하여 처리한다.</li>
						</ol>
						<br>
						로컬 프록시 파일과 원격 프록시 파일은 다음과 같이 작성할 수 있다.
						<ul type="disc">
							<li>원격 프록시 파일 : ajax_remote_callback.html</li>
							<li>로컬 프록시 파일 : ajax_local_callback.html</li>
						</ul>
						※ iframe 요소를 사용한 방식은 인터넷 익스플로러에서 "딱딱"하는 페이지 이동음이 발생할 수 있다(요청당 2회).
					</li>
					<li><strong>jsonp</strong><br>
							JSON 형식과 &lt;script&gt; 태그를 사용하여 사용하여 Ajax 요청을 처리한다. 크로스 도메인 상황에서 사용할 수 있다. jsonp 요청 방식은 다음과 같이 동작한다.<br>
							<ol>
								<li>&lt;script&gt; 태그를 동적으로 생성한다. 이때 요청할 원격 페이지를 src 속성으로 입력하여 GET 방식으로 요청을 전송한다.</li>
								<li>요청 시에 콜백 함수를 매개 변수로 넘기면, 원격 페이지에서 전달받은 콜백 함수명으로 아래와 같이 응답을 보낸다.
									<ul type="disc">
										<li>function_name(...결과 값...)</li>
									</ul>
								</li>
								<li>응답은 콜백 함수(onload)에서 처리된다.</li>
							</ol>
							※ GET 방식만 가능하므로, 전송 데이터의 길이는 URL에서 허용하는 길이로 제한된다.
					</li>
					<li><strong>flash</strong><br>
						플래시 객체를 사용하여 Ajax 요청을 처리한다. 크로스 도메인 상황에에서 사용할 수 있다. 이 방식을 사용할 때 원격 서버의 웹 루트 디렉터리에 crossdomain.xml 파일이 존재해야 하며 해당 파일에 접근 권한이 설정되어 있어야 한다. 모든 통신은 플래시 객체를 통하여 주고 받으며 Ajax 요청을 시도하기 전에 반드시 플래시 객체를 초기화해야 한다. $Ajax.SWFRequest.write() 메서드를 사용하여 플래시 객체를 초기화하며 해당 메서드는 &lt;body&gt; 요소 안에 작성한다.
					</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">method</td>
			<td>String</td>
			<td>
				HTTP 요청 방식으로 post, get, put, delete 방식을 지원한다.
				<ul>
					<li><strong>post</strong><br>
					post 방식으로 http 요청을 전달한다. 기본 값이다.</li>
					<li><strong>get</strong><br>
					get 방식으로 http 요청을 전달한다. type 속성이 "jsonp" 방식으로 지정되면 HTTP 요청 방식은 "get"으로 설정된다.</li>
					<li><strong>put</strong><br>
					put 방식으로 http 요청을 전달한다. 1.4.2 부터 사용 가능하다.</li>
					<li><strong>delete</strong><br>
					delete 방식으로 http 요청을 전달한다. 1.4.2 부터 사용 가능하다.</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">timeout</td>
			<td>Number</td>
			<td>
				요청 타임 아웃 시간(초 단위).<br>
				기본 값은 0으로 타임 아웃을 적용하지 않는다. 타임 아웃 시간 안에 요청이 완료되지 않으면 Ajax 요청을 중지한다. 비동기 호출인 경우에만 사용 가능하다.
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">onload</td>
			<td>Function</td>
			<td>
				요청이 완료되면 실행할 콜백 함수.<br>
				반드시 지정해야 하며 콜백 함수의 파라미터로 응답 객체인 {@link $Ajax.Response} 객체가 전달된다.
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">onerror</td>
			<td>Function</td>
			<td>
				요청이 실패하면 실행할 콜백 함수.<br>
				생략하면 오류가 발생해도 onload 속성에 지정한 콜백 함수를 실행한다.
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">ontimeout</td>
			<td>Function</td>
			<td>
				타임 아웃이 되었을 때 실행할 콜백 함수.<br>
				생략하면 타임 아웃 발생해도 아무런 처리를 하지 않는다.
			</td>
		</tr>
		<tr>
		<td style="font-weight:bold;">proxy</td>
			<td>String</td>
			<td>
				로컬 프록시 파일의 경로.<br>
				type 속성이 "iframe"일 때 사용하며 반드시 지정해야 한다.
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">jsonp_charset</td>
			<td>String</td>
			<td>
				요청 시 사용할 &lt;script&gt; 인코딩 방식.<br>
				type 속성이 "jsonp"일 때 사용한다. 생략하면 "utf-8"이 기본값이다(0.4.2 버전부터 지원).
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">callbackid</td>
			<td>String</td>
			<td>
				콜백 함수 이름에 사용할 ID.<br>
				type 속성이 "jsonp"일 때 사용한다(1.3.0 부터 지원). 생략하면 랜덤한 ID 값이 생성된다.<br>
				jsonp 방식에서 Ajax 요청할 때 콜백 함수 이름에 랜덤한 ID 값을 덧붙여 만든 콜백 함수 이름을 서버로 전달한다. 이때 랜덤한 값을 ID로 사용하여 넘기므로 요청 URL이 매번 새롭게 생성되어 캐쉬 서버가 아닌 서버로 직접 데이터를 요청하게 된다. 따라서 ID 값을 지정하면 랜덤한 아이디 값으로 콜백 함수 이름을 생성하지 않으므로 캐쉬 서버를 사용하여 그에 대한 히트율을 높이고자 할 때 ID를 지정하여 사용할 수 있다.
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">callbackname</td>
			<td>String</td>
			<td>
				콜백 함수 이름.<br>
				type 속성이 "jsonp"일 때 사용하며, 서버에 요청할 콜백 함수의 이름을 지정할 수 있다. 기본 값은 "_callback"이다(1.3.8 부터 지원).
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">sendheader</td>
			<td>Boolean</td>
			<td>
				요청 헤더를 전송할지 여부.<br>
				type 속성이 "flash"일 때 사용하며, 서버에서 접근 권한을 설정하는 crossdomain.xml에 allow-header가 없는 경우에 false 로 설정해야 한다.<br>
				플래시 9에서는 allow-header가 false인 경우 get 방식으로만 ajax 통신이 가능하다.<br>
				플래시 10에서는 allow-header가 false인 경우 get,post 둘다 ajax 통신이 안된다.<br>
				allow-header가 설정되어 있지 않다면 반드시 false로 설정해야 한다. 기본 값은 true 이다(1.3.4부터 지원). 
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">async</td>
			<td>Boolean</td>
			<td>
				비동기 호출 여부.<br>
				type 속성이 "xhr"일 때 이 속성 값이 유효하다. 기본 값은 true 이다(1.3.7부터 지원).
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">decode</td>
			<td>Boolean</td>
			<td>
				type 속성이 "flash"일 때 사용하며, 요청한 데이터 안에 utf-8 이 아닌 다른 인코딩이 되어 있을때 false 로 지정한다. 기본 값은 true 이다(1.4.0부터 지원). 
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">postBody</td>
			<td>Boolean</td>
			<td>
				Ajax 요청 시 서버로 전달할 데이터를 Body 요소에 전달할 지의 여부.<br>
				type 속성이 "xhr"이고 method가 "get"이 아니어야 유효하며 REST 환경에서 사용된다. 기본값은 false 이다(1.4.2부터 지원).
			</td>
		</tr>
	</tbody>
</table>

 * @see $Ajax.Response
 * @see <a href="http://dev.naver.com/projects/jindo/wiki/cross%20domain%20ajax">Cross Domain Ajax 이해</a>
 * @example
// 'Get List' 버튼 클릭 시, 서버에서 데이터를 받아와 리스트를 구성하는 예제
// (1) 서버 페이지와 서비스 페이지가 같은 도메인에 있는 경우 - xhr

// [client.html]
<!DOCTYPE html>
<html>
	<head>
		<title>Ajax Sample</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<script type="text/javascript" language="javascript" src="lib/jindo.all.js"></script>
		<script type="text/javascript" language="javascript">
			function getList() {
				var oAjax = new $Ajax('server.php', {
					type : 'xhr',
					method : 'get',			// GET 방식으로 통신
					onload : function(res){	// 요청이 완료되면 실행될 콜백 함수
						$('list').innerHTML = res.text();
					},
					timeout : 3,			// 3초 이내에 요청이 완료되지 않으면 ontimeout 실행 (생략 시 0)
					ontimeout : function(){	// 타임 아웃이 발생하면 실행될 콜백 함수, 생략 시 타임 아웃이 되면 아무 처리도 하지 않음
						alert("Timeout!");
					},
					async : true			// 비동기로 호출하는 경우, 생략하면 true
				});
				oAjax.request();
			}
		</script>
	</head>
	<body>
		<button onclick="getList(); return false;">Get List</button>

		<ul id="list">

		</ul>
	</body>
</html>

// [server.php]
<?php
	echo "<li>첫번째</li><li>두번째</li><li>세번째</li>";
?>

 * @example
// 'Get List' 버튼 클릭 시, 서버에서 데이터를 받아와 리스트를 구성하는 예제
// (2) 서버 페이지와 서비스 페이지가 같은 도메인에 있는 경우 - iframe

// [http://local.com/some/client.html]
<!DOCTYPE html>
<html>
	<head>
		<title>Ajax Sample</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<script type="text/javascript" language="javascript" src="lib/jindo.all.js"></script>
		<script type="text/javascript" language="javascript">
			function getList() {
				var oAjax = new $Ajax('http://server.com/some/some.php', {
					type : 'iframe',
					method : 'get',			// GET 방식으로 통신
											// POST로 지정하면 원격 프록시 파일에서 some.php 로 요청 시에 POST 방식으로 처리
					onload : function(res){	// 요청이 완료되면 실행될 콜백 함수
						$('list').innerHTML = res.text();
					},
					// 로컬 프록시 파일의 경로.
					// 반드시 정확한 경로를 지정해야 하며, 로컬 도메인의 경로라면 어디에 두어도 상관 없음
					// (※ 원격 프록시 파일은 반드시  원격 도메인 서버의 도메인 루트 상에 두어야 함)
					proxy : 'http://local.naver.com/some/ajax_local_callback.html'
				});
				oAjax.request();
			}

		</script>
	</head>
	<body>
		<button onclick="getList(); return false;">Get List</button>

		<ul id="list">

		</ul>
	</body>
</html>

// [http://server.com/some/some.php]
<?php
	echo "<li>첫번째</li><li>두번째</li><li>세번째</li>";
?>

 * @example
// 'Get List' 버튼 클릭 시, 서버에서 데이터를 받아와 리스트를 구성하는 예제
// (3) 서버 페이지와 서비스 페이지가 같은 도메인에 있는 경우 - jsonp

// [http://local.com/some/client.html]
<!DOCTYPE html>
<html>
	<head>
		<title>Ajax Sample</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<script type="text/javascript" language="javascript" src="lib/jindo.all.js"></script>
		<script type="text/javascript" language="javascript">
			function getList(){
				var oAjax = new $Ajax('http://server.com/some/some.php', {
					type: 'jsonp',
					method: 'get',			// type 이 jsonp 이면 get 으로 지정하지 않아도 자동으로 get 으로 처리함 (생략가능)
					jsonp_charset: 'utf-8',	// 요청 시 사용할 <script> 인코딩 방식 (생략 시 utf-8)
					onload: function(res){	// 요청이 완료되면 실행될 콜백 함수
						var response = res.json();
						var welList = $Element('list').empty();

						for (var i = 0, nLen = response.length; i < nLen; i++) {
							welList.append($("<li>" + response[i] + "</li>"));
						}
					},
					callbackid: '12345',				// 콜백 함수 이름에 사용할 아이디 값 (생략가능)
					callbackname: 'ajax_callback_fn'	// 서버에서 사용할 콜백 함수이름을 가지는 매개 변수 이름 (생략 시 '_callback')
				});
				oAjax.request();
			}
		</script>
	</head>
	<body>
		<button onclick="getList(); return false;">Get List</button>

		<ul id="list">

		</ul>
	</body>
</html>

// [http://server.com/some/some.php]
<?php
	$callbackName = $_GET['ajax_callback_fn'];
	echo $callbackName."(['첫번째','두번째','세번째'])";
?>

 * @example
// 'Get List' 버튼 클릭 시, 서버에서 데이터를 받아와 리스트를 구성하는 예제
// (4) 서버 페이지와 서비스 페이지가 같은 도메인에 있는 경우 - flash

// [http://local.com/some/client.html]
<!DOCTYPE html>
<html>
	<head>
		<title>Ajax Sample</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<script type="text/javascript" language="javascript" src="lib/jindo.all.js"></script>
		<script type="text/javascript" language="javascript">
			function getList(){
				var oAjax = new $Ajax('http://server.com/some/some.php', {
					type : 'flash',
					method : 'get',			// GET 방식으로 통신
					sendheader : false,		// 요청 헤더를 전송할지 여부. (생략 시 true)
					decode : true,			// 요청한 데이터 안에 utf-8 이 아닌 다른 인코딩이 되어 있을때 false. (생략 시 true)
					onload : function(res){	// 요청이 완료되면 실행될 콜백 함수
						$('list').innerHTML = res.text();
					},
				});
				oAjax.request();
			}
		</script>
	</head>
	<body>
		<script type="text/javascript">
			$Ajax.SWFRequest.write("swf/ajax.swf");	// Ajax 호출을 하기 전에 반드시 플래시 객체를 초기화
		</script>
		<button onclick="getList(); return false;">Get List</button>

		<ul id="list">

		</ul>
	</body>
</html>

// [http://server.com/some/some.php]
<?php
	echo "<li>첫번째</li><li>두번째</li><li>세번째</li>";
?>
	
 */
jindo.$Ajax = function (url, option) {
	var cl = arguments.callee;
	if (!(this instanceof cl)) return new cl(url, option);

	function _getXHR() {
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		} else if (ActiveXObject) {
			try { 
				return new ActiveXObject('MSXML2.XMLHTTP'); 
			}catch(e) { 
				return new ActiveXObject('Microsoft.XMLHTTP'); 
			}
			return null;
		}
	}

	var loc    = location.toString();
	var domain = '';
	try { domain = loc.match(/^https?:\/\/([a-z0-9_\-\.]+)/i)[1]; } catch(e) {}
	
	this._status = 0;
	this._url = url;
	this._options  = new Object;
	this._headers  = new Object;
	this._options = {
		type   :"xhr",
		method :"post",
		proxy  :"",
		timeout:0,
		onload :function(req){},
		onerror :null,
		ontimeout:function(req){},
		jsonp_charset : "utf-8",
		callbackid : "",
		callbackname : "",
		sendheader : true,
		async : true,
		decode :true,
		postBody :false
	};
	this.option(option);
	
	/*
	 
테스트를 위해 우선 적용가능한 설정 객체가 존재하면 적용
	
	 */
	if(jindo.$Ajax.CONFIG){
		this.option(jindo.$Ajax.CONFIG);
	}	

	var _opt = this._options;

	_opt.type   = _opt.type.toLowerCase();
	_opt.method = _opt.method.toLowerCase();

	if (typeof window.__jindo2_callback == "undefined") {
		window.__jindo2_callback = new Array();
	}

	switch (_opt.type) {
		case "put":
		case "delete":
		case "get":
		case "post":
			_opt.method = _opt.type;
			_opt.type   = "xhr";
		case "xhr":
				this._request = _getXHR();
				break;
		case "flash":
			if(!jindo.$Ajax.SWFRequest) throw Error('Require jindo.$Ajax.SWFRequest');
			this._request = new jindo.$Ajax.SWFRequest(jindo.$Fn(this.option,this).bind());
			break;
		case "jsonp":
			if(!jindo.$Ajax.JSONPRequest) throw Error('Require jindo.$Ajax.JSONPRequest');
			_opt.method = "get";
			this._request = new jindo.$Ajax.JSONPRequest(jindo.$Fn(this.option,this).bind());
			break;
		case "iframe":
			if(!jindo.$Ajax.FrameRequest) throw Error('Require jindo.$Ajax.FrameRequest');
			this._request = new jindo.$Ajax.FrameRequest(jindo.$Fn(this.option,this).bind());
			break;
	}
};


/**
 * @ignore
 */
jindo.$Ajax.prototype._onload = (function(isIE) {
	if(isIE){
		return function(){
			var bSuccess = this._request.readyState == 4 && this._request.status == 200;
			var oResult;
			if (this._request.readyState == 4) {
				  try {
						if (this._request.status != 200 && typeof this._options.onerror == 'function'){
							if(!this._request.status == 0){
								this._options.onerror(jindo.$Ajax.Response(this._request));
							}
						}else{
							if(!this._is_abort){
								oResult = this._options.onload(jindo.$Ajax.Response(this._request));	
							}
						} 
				}finally{
					if(typeof this._oncompleted == 'function'){
						this._oncompleted(bSuccess, oResult);
					}
					if (this._options.type == "xhr" ){
						this.abort();
						try { delete this._request.onload; } catch(e) { this._request.onload =undefined;} 
					}
					delete this._request.onreadystatechange;
					
				}
			}
		}
	}else{
		return function(){
			var bSuccess = this._request.readyState == 4 && this._request.status == 200;
			var oResult;
			if (this._request.readyState == 4) {
				  try {
				  		
						if (this._request.status != 200 && typeof this._options.onerror == 'function'){
							this._options.onerror(jindo.$Ajax.Response(this._request));
						}else{
							oResult = this._options.onload(jindo.$Ajax.Response(this._request));
						} 
				}finally{
					this._status--;
					if(typeof this._oncompleted == 'function'){
						this._oncompleted(bSuccess, oResult);
					} 
				}
			}
		}
	}
})(/MSIE/.test(window.navigator.userAgent));

/**

 * @description request() 메서드는 Ajax 요청을 서버에 전송한다. 요청에 사용할 파라미터는 $Ajax() 객체 생성자에서 설정하거나 option() 메서드를 사용하여 변경할 수 있다. 요청 타입(type)이 "flash"면 이 메소드를 실행하기 전에 body 요소에서 {@link $Ajax.SWFRequest.write}() 메서드를 반드시 실행해야 한다.
 * @param {Object} oData 서버로 전송할 데이터.
 * @return {$Ajax} $Ajax() 객체.
 * @see $Ajax#option
 * @see $Ajax.SWFRequest.write
 * @example
var ajax = $Ajax("http://www.remote.com", {
   onload : function(res) {
      // onload 핸들러
   }
});

ajax.request( {key1:"value1", key2:"value2"} );	// 서버에 전송할 데이터를 매개변수로 넘긴다.
	
 */
jindo.$Ajax.prototype.request = function(oData) {
	this._status++;
	var t   = this;
	var req = this._request;
	var opt = this._options;
	var data, v,a = [], data = "";
	var _timer = null;
	var url = this._url;
	this._is_abort = false;

	if( opt.postBody && opt.type.toUpperCase()=="XHR" && opt.method.toUpperCase()!="GET"){
		if(typeof oData == 'string'){
			data = oData;
		}else{
			data = jindo.$Json(oData).toString();	
		}	
	}else if (typeof oData == "undefined" || !oData) {
		data = null;
	} else {
		for(var k in oData) {
			if(oData.hasOwnProperty(k)){
				v = oData[k];
				if (typeof v == "function") v = v();
				
				if (v instanceof Array || v instanceof jindo.$A) {
					jindo.$A(v).forEach(function(value,index,array) {
						a[a.length] = k+"="+encodeURIComponent(value);
					});
				} else {
					a[a.length] = k+"="+encodeURIComponent(v);
				}
			}
		}
		data = a.join("&");
	}
	
	/*
	 
XHR GET 방식 요청인 경우 URL에 파라미터 추가
	
	 */
	if(data && opt.type.toUpperCase()=="XHR" && opt.method.toUpperCase()=="GET"){
		if(url.indexOf('?')==-1){
			url += "?";
		} else {
			url += "&";			
		}
		url += data;
		data = null;
	}
	req.open(opt.method.toUpperCase(), url, opt.async);
	if(opt.type.toUpperCase()=="XHR"&&opt.method.toUpperCase()=="GET"&&/MSIE/.test(window.navigator.userAgent)){
		/*
		 
xhr인 경우 IE에서는 GET으로 보낼 때 브라우져에서 자체 cache하여 cache을 안되게 수정.
	
		 */
		req.setRequestHeader("If-Modified-Since", "Thu, 1 Jan 1970 00:00:00 GMT");
	} 
	if (opt.sendheader) {
		if(!this._headers["Content-Type"]){
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
		}
		req.setRequestHeader("charset", "utf-8");
		for (var x in this._headers) {
			if(this._headers.hasOwnProperty(x)){
				if (typeof this._headers[x] == "function") 
					continue;
				req.setRequestHeader(x, String(this._headers[x]));
			}
		}
	}
	var navi = navigator.userAgent;
	if(req.addEventListener&&!(navi.indexOf("Opera") > -1)&&!(navi.indexOf("MSIE") > -1)){
		/*
		 
 * opera 10.60에서 XMLHttpRequest에 addEventListener기 추가되었지만 정상적으로 동작하지 않아 opera는 무조건 dom1방식으로 지원함.
 * IE9에서도 opera와 같은 문제가 있음.
	
		 */
		if(this._loadFunc){ req.removeEventListener("load", this._loadFunc, false); }
		this._loadFunc = function(rq){ 
			clearTimeout(_timer);
			_timer = undefined; 
			t._onload(rq); 
		}
		req.addEventListener("load", this._loadFunc, false);
	}else{
		if (typeof req.onload != "undefined") {
			req.onload = function(rq){
				if(req.readyState == 4 && !t._is_abort){
					clearTimeout(_timer); 
					_timer = undefined;
					t._onload(rq);
				}
			};
		} else {
            /*
            
 * IE6에서는 onreadystatechange가 동기적으로 실행되어 timeout이벤트가 발생안됨.
 * 그래서 interval로 체크하여 timeout이벤트가 정상적으로 발생되도록 수정. 비동기 방식일때만
	
             */
			if(window.navigator.userAgent.match(/(?:MSIE) ([0-9.]+)/)[1]==6&&opt.async){
				var onreadystatechange = function(rq){
					if(req.readyState == 4 && !t._is_abort){
						if(_timer){
							clearTimeout(_timer);
							_timer = undefined;
						}
						t._onload(rq);
						clearInterval(t._interval);
						t._interval = undefined;
					}
				};
				this._interval = setInterval(onreadystatechange,300);

			}else{
				req.onreadystatechange = function(rq){
					if(req.readyState == 4){
						clearTimeout(_timer); 
						_timer = undefined;
						t._onload(rq);
					}
				};
			}
		}
	}

	if (opt.timeout > 0) {
		
//		if(this._interval)clearInterval(this._interval);
		if(this._timer) clearTimeout(this._timer);
		
		_timer = setTimeout(function(){
			t._is_abort = true;
			if(t._interval){
				clearInterval(t._interval);
				t._interval = undefined;
			}
			try{ req.abort(); }catch(e){};

			opt.ontimeout(req);	
			if(typeof t._oncompleted == 'function') t._oncompleted(false);
		}, opt.timeout * 1000 );
		this._timer = _timer;
	}
	/*
	
 * test을 하기 위한 url
	
	 */
	this._test_url = url;
	req.send(data);

	return this;
};

/**

 * @description isIdle() 메서드는 $Ajax() 객체가 현재 요청 대기 상태인지 확인한다.
 * @since 1.3.5 부터 사용 가능
 * @return {Boolean} 현재 대기 중이면 true 를, 그렇지 않으면 false를 리턴한다.
 * @example
 var ajax = $Ajax("http://www.remote.com",{
     onload : function(res){
         // onload 핸들러
     }
});

if(ajax.isIdle()) ajax.request();
    
 */
jindo.$Ajax.prototype.isIdle = function(){
	return this._status==0;
}

/**

 * @description abort() 메서드는 서버로 전송한 Ajax 요청을 취소한다. Ajax 요청의 응답 시간이 길거나 강제로 Ajax 요청을 취소할 경우 사용한다.
 * @return {$Ajax} 전송을 취소한 $Ajax() 객체
 * @example
var ajax = $Ajax("http://www.remote.com", {
	timeout : 3,
	ontimeout : function() {
		stopRequest();
	}
	onload : function(res) {
		// onload 핸들러
	}
}).request( {key1:"value1", key2:"value2"} );

function stopRequest() {
    ajax.abort();
}
    
 */
jindo.$Ajax.prototype.abort = function() {
	try {
		if(this._interval) clearInterval(this._interval);
		if(this._timer) clearTimeout(this._timer);
		this._interval = undefined;
		this._timer = undefined;
		this._is_abort = true;
		this._request.abort();
	}finally{
		this._status--;
	}

	return this;
};


/**

 * @description option() 메서드는 $Ajax() 객체의 옵션 객체(oOption) 속성에 정의된 Ajax 요청 옵션에 대한 정보를 가져오거나 혹은 설정한다. Ajax 요청 옵션을 설정하려면 이름과 값을, 혹은 이름과 값을 원소로 가지는 하나의 객체를 파라미터로 입력한다. 이름과 값을 원소로 가지는 객체를 입력하면 하나 이상의 정보를 한 번에 설정할 수 있다.
 * @param {Variant} vName 옵션 객체의 속성 이름(String) 또는 하나 이상의 속성 값이 정의된 객체(Object).<br>
 <ul>
	<li>문자열을 파라미터로 입력하면 다음과 같이 동작한다.
		<ol>
			<li>sValue 파라미터를 생략하면 이름에 해당하는 $Ajax의 속성 값을 반환한다.</li>
			<li>sVlue 파라미터를 설정하면 이름에 해당하는 $Ajax의 속성 값을 sValue 값으로 설정한다.</li>
		</ol>
	</li>
	<li>객체인 경우에는 속성 이름으로 정보를 찾아 속성의 값으로 설정한다. 객체에 하나 이상의 속성을 지정하면 여러 속성 값을 한 번에 설정할 수 있다.</li>
</ul>
 * @param {Variant} [vValue] 새로 설정할 옵션 속성의 값. vName 파라미터가 문자열인 경우에만 사용된다.
 * @return {Variant} 정보의 값을 가져올 때는 문자열(String)을, 값을 설정할 때는 $Ajax() 객체를 반환한다.
 * @example
var ajax = $Ajax("http://www.remote.com", {
	type : "xhr",
	method : "get",
	onload : function(res) {
		// onload 핸들러
	}
});

var request_type = ajax.option("type");					// type 인 xhr 을 리턴한다.
ajax.option("method", "post");							// method 를 post 로 설정한다.
ajax.option( { timeout : 0, onload : handler_func } );	// timeout 을 으로, onload 를 handler_func 로 설정한다.
    
 */
jindo.$Ajax.prototype.option = function(name, value) {
	if (typeof name == "undefined") return "";
	if (typeof name == "string") {
		if (typeof value == "undefined") return this._options[name];
		this._options[name] = value;
		return this;
	}

	try { 
		for(var x in name){
			if(name.hasOwnProperty(x))
				this._options[x] = name[x]
		}  
	} catch(e) {};

	return this;
};

/**

 * @description header() 메서드는 Ajax 요청에서 사용할 HTTP 요청 헤더를 가져오거나 설정한다. 헤더를 설정하려면 헤더의 이름과 값을 각각 파라미터로 입력하거나 헤더의 이름과 값을 원소로 가지는 객체를 파라미터로 입력한다. 객체를 파라미터로 입력하면 하나 이상의 헤더를 한 번에 설정할 수 있다. 헤더에서 특정 속성 값을 가져오려면 속성의 이름을 파라미터로 입력한다.
 * @param {Variant} vName 헤더 이름(String) 또는 하나 이상의 헤더 값이 정의된 객체(Object).<br>
 <ul>
	<li>문자열을 파라미터로 입력하면 다음과 같이 동작한다.
		<ol>
			<li>vValue 파라미터를 생략하면 HTTP 요청 헤더에서 문자열과 일치하는 헤더 값을 찾는다.</li>
			<li>vValue 파라미터를 설정하면 HTTP 요청 헤더에서 문자열과 일치하는 헤더 값을 vValue 값으로 설정한다.</li>
		</ol>
	</li>
	<li>객체인 경우에는 헤더 이름으로 정보를 찾아 헤더의 값으로 설정한다. 객체에 하나 이상의 헤더 값을 지정하면 여러 헤더 값을 한 번에 설정할 수 있다.</li>
</ul>
 * @param {Value} [vValue] 설정할 헤더 값. vName 파라미터가 문자열인 경우에만 사용한다.
 * @return {Variant} 정보의 값을 가져올 때는 문자열(String)을, 값을 설정할 때는 $Ajax() 객체를 반환한다.
 * @example
var customheader = ajax.header("myHeader"); 		// HTTP 요청 헤더에서 myHeader 의 값
ajax.header( "myHeader", "someValue" );				// HTTP 요청 헤더의 myHeader 를 someValue 로 설정한다.
ajax.header( { anotherHeader : "someValue2" } );	// HTTP 요청 헤더의 anotherHeader 를 someValue2 로 설정한다.
    
 */
jindo.$Ajax.prototype.header = function(name, value) {
	if (typeof name == "undefined") return "";
	if (typeof name == "string") {
		if (typeof value == "undefined") return this._headers[name];
		this._headers[name] = value;
		return this;
	}

	try { 
		for (var x in name) {
			if (name.hasOwnProperty(x)) 
				this._headers[x] = name[x]
		}	
			
			 
	} catch(e) {};

	return this;
};

/**

 * @class $Ajax.Response 객체를 생성한다. $Ajax.Response 객체는 $Ajax() 객체에서 request() 메서드의 요청 처리 완료한 후 생성된다. $Ajax() 객체를 생성할 때 onload 속성에 설정한 콜백 함수의 파라미터로 $Ajax.Response 객체가 전달된다.
 * @constructor
 * @description Ajax 응답 객체를 래핑하여 응답 데이터를 가져오거나 활용하는데 유용한 기능을 제공한다.
 * @param {Object} oReq 요청 객체
 * @see $Ajax
    
 */
jindo.$Ajax.Response  = function(req) {
	if (this === jindo.$Ajax) return new jindo.$Ajax.Response(req);
	this._response = req;
};

/**

 * @description xml() 메서드는 응답을 XML 객체로 반환한다. XHR의 responseXML 속성과 유사하다.
 * @return {Object} 응답 XML 객체. 
 * @see <a href="https://developer.mozilla.org/en/XMLHttpRequest">XMLHttpRequest</a> - MDN Docs
 * @example
// some.xml
<data>
	<li>첫번째</li>
	<li>두번째</li>
	<li>세번째</li>
</data>

// client.html
var oAjax = new $Ajax('some.xml', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		var elData = cssquery.getSingle('data', res.xml());	// 응답을 XML 객체로 리턴한다
		$('list').innerHTML = elData.firstChild.nodeValue;
	},
}).request();
    
 */
jindo.$Ajax.Response.prototype.xml = function() {
	return this._response.responseXML;
};

/**

 * @description text() 메서드는 응답을 문자열(String)로 반환한다. XHR의 responseText 와 유사하다.
 * @return {String} 응답 문자열. 
 * @see <a href="https://developer.mozilla.org/en/XMLHttpRequest">XMLHttpRequest</a> - MDN Docs
 * @example
// some.php
<?php
	echo "<li>첫번째</li><li>두번째</li><li>세번째</li>";
?>

// client.html
var oAjax = new $Ajax('some.xml', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		$('list').innerHTML = res.text();	// 응답을 문자열로 리턴한다
	},
}).request();
    
 */
jindo.$Ajax.Response.prototype.text = function() {
	return this._response.responseText;
};

/**

 * @description status() 메서드는 HTTP 응답 코드를 반환한다. HTTP 응답 코드표를 참고한다.
 * @return {Number} 응답 코드. 
 * @see <a href="http://www.w3.org/Protocols/HTTP/HTRESP.html">HTTP Status codes</a> - W3C
 * @example
var oAjax = new $Ajax('some.php', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		if(res.status() == 200){	// HTTP 응답 코드를 확인한다.
			$('list').innerHTML = res.text();
		}
	},
}).request();
    
 */
jindo.$Ajax.Response.prototype.status = function() {
	return this._response.status;
};

/**

 * @description readyState() 메서드는 응답 상태(readyState)를 반환한다. readyState 속성 값에 대한 설명은 다음 표와 같다.<br>
 <tabel>
	<caption>readyState 속성 설명</caption>
	<thead>
		<tr>
			<th>값</th>
			<th>설명</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>0(UNINITIALIZED)</td>
			<td>요청이 초기화되지 않은 상태.</td>
		</tr>
		<tr>
			<td>1(LOADING)</td>
			<td>요청 옵션을 설정했으나, 요청하지 않은 상태</td>
		</tr>
		<tr>
			<td>2(LOADED)</td>
			<td>요청을 보내고 처리 중인 상태. 이 상태에서 응답 헤더를 얻을 수 있다.</td>
		</tr>
		<tr>
			<td>3(INTERACTIVE)</td>
			<td>요청이 처리 중이며, 부분적인 응답 데이터를 받은 상태.</td>
		</tr>
		<tr>
			<td>4(COMPLETED)</td>
			<td>응답 데이터를 모두 받아 통신을 완료한 상태.</td>
		</tr>
	</tbody>
</table>
 * @return {Number}  readyState 값.
 * @see open
 * @see send
 * @example
var oAjax = new $Ajax('some.php', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		if(res.readyState() == 4){	// 응답의 readyState 를 확인한다.
			$('list').innerHTML = res.text();
		}
	},
}).request();
    
 */
jindo.$Ajax.Response.prototype.readyState = function() {
	return this._response.readyState;
};

/**

 * @description json() 메서드는 응답을 JSON 객체로 반환한다. 응답 문자열을 자동으로 JSON 객체로 변환하여 반환한다. 변환 과정에서 오류가 발생하면 빈 객체를 반환한다.
 * @return {Object} JSON 객체.
 * @example
// some.php
<?php
	echo "['첫번째', '두번째', '세번째']";
?>

// client.html
var oAjax = new $Ajax('some.php', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		var welList = $Element('list').empty();
		var jsonData = res.json();	// 응답을 JSON 객체로 리턴한다

		for(var i = 0, nLen = jsonData.length; i < nLen; i++){
			welList.append($("<li>" + jsonData[i] + "</li>"));
		}
	},
}).request();
    
 */
jindo.$Ajax.Response.prototype.json = function() {
	if (this._response.responseJSON) {
		return this._response.responseJSON;
	} else if (this._response.responseText) {
		try {
			return eval("("+this._response.responseText+")");
		} catch(e) {
			return {};
		}
	}

	return {};
};

/**

 * @description header() 메서드는 응답 헤더를 가져온다. 파라미터를 입력하지 않으면 헤더 전체를 반환한다.
 * @param {String} [sName] 가져올 응답 헤더의 이름.
 * @return {Variant} 파라미터를 입력했을 경우 해당하는 헤더 값(String)을, 그렇지 않으면 헤더 전체(Object)를 반환한다.
 * @example
var oAjax = new $Ajax('some.php', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		res.header();					// 응답 헤더 전체를 리턴한다.
		res.header("Content-Length")	// 응답 헤더에서 "Content-Length" 의 값을 리턴한다.
	},
}).request();
    
 */
jindo.$Ajax.Response.prototype.header = function(name) {
	if (typeof name == "string") return this._response.getResponseHeader(name);
	return this._response.getAllResponseHeaders();
};
