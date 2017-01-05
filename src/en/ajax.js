/**

 * @fileOverview A file to define the constructor and method of $Ajax
 * @name Ajax.js
	
 */

/**

 * $Ajax supports asynchronous communication between a server and a browser, namely Ajax communication. $Ajax provides various methods of communicating with other hosts as well as the default method using XHR (XMLHTTPRequest).
 * The default method of initializing the $Ajax object is as follows:
 * <textarea name="code" class="js:nocontrols">
 * var oAjax = new $Ajax('server.php', {
    type : 'xhr',
    method : 'get',     // Communication using GET method
    onload : function(res){ // A callback function to execute upon completion
      $('list').innerHTML = res.text();
    },
    timeout : 3,      // Executes ontimeout if the request has not been completed within 3 seconds (0 if omitted).
    ontimeout : function(){ // A callback function to execute upon timeout; nothing will be processed if timeout occurs upon omittance.
      alert("Timeout!");
    },
    async : true      // An asynchronous call, true if omitted.
  });
  oAjax.request();
}
 * </textarea>
 *
 * @extends core
 * @class The $Ajax class provides methods that enable easy implementation of Ajax requests and responses under various development environments.<br>
 *
 * The parameters to be used when initializing $Ajax are as follows:
 *
 * @param {String}   url			  A server-side URL to which Ajax requests are sent<br>
 * @param {Object}   option		  Defines various information that is used in $Ajax such as a callback function and communication method.<br>
 * <br>
 * The properties and usage of option objects are described below:<br>
<table>
	<thead style="background-color:#D2E0E6;">
		<th>Property Name</th>
		<th>Type</th>
		<th>Description</th>
	</thead>
	<tbody>
		<tr>
			<td style="font-weight:bold;">type</td>
			<td>String</td>
			<td>
				A method to implement Ajax. The default value is "xhr."
				<ul>
					<li><strong>xhr</strong>
							Processes Ajax requests by using the XMLHttpRequest object embedded in a browser.<br>
							The response may be in text, xml, or json format. The cause of a request failure can be interpreted by using HTTP response code.<br>
							Note that this method cannot be used in Cross-Domain.
					</li>
					<li><strong>iframe</strong>
							Handles Ajax requests by using iframe as a proxy. It is used in Cross-Domain.<br>
							If you create an HTML file for proxy in both local (requester) and remote (requestee)<br>
							and make request to a remote proxy in iframe, the remote proxy makes an Ajax request to the remote domain page by using XHR.<br>
							When the remote proxy that received a response transfers it to the local proxy, the local proxy finally invokes a callback function (onload).<br>
							<ul type="disc">
								<li>Remote proxy file: ajax_remote_callback.html</li>
								<li>Local proxy file: ajax_local_callback.html</li>
							</ul>
							※ If you're using Internet Explorer, you may hear the 'click click' sound that the browser makes while navigating pages (twice per request).
					</li>
					<li><strong>jsonp</strong>
							Handles Ajax requests by using JSON and &lt;script&gt; tags. It is used in Cross-Domain.<br>
							Dynamically creates &lt;script&gt; tags, inserts the pages to be requested to a script, and transfers the request with GET method.<br>
							When the callback function is passed as a parameter upon request, the following response will be sent as the name of the callback function that was received from remote pages:<br>
							<ul type="disc"><li>function_name(...result value...)</li></ul>
							The response is handled by the callback function (onload).<br>
							※ As it is available only in GET method, the length of transmission data is limited to the length allowed by the URL.
					</li>
					<li><strong>flash</strong>
						Handles Ajax requests by using a flash object. It is used in Cross-Domain.<br>
						To use it, crossdomain.xml must exist in the domain root of a server. And you must have permission to access.<br>
						All communications are performed through a flash object. For this reason, the flash object must be initialized before Ajax is invoked.<br>
						Use the $Ajax.SWFRequest.write method to initialize. And the method must be written within &lt;body&gt; tags.
					</li>
					<li><strong>get/post/put/delete</strong>: Internally handles with xhr.</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">method</td>
			<td>String</td>
			<td>
				HTTP communications
				<ul>
					<li><strong>post</strong>: The default value is used if omitted.</li>
					<li><strong>get</strong>: If type is jsonp, it is set to "get."</li>
					<li><strong>put</strong>: Available since 1.4.2</li>
					<li><strong>delete</strong>: Available since 1.4.2</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">timeout</td>
			<td>Number</td>
			<td>
				The timeout for requests. It is set to 0 if omitted (in seconds).<br>
				Stops request execution if it is not completed until timeout.<br>
				Available only for an asynchronous call.
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">onload</td>
			<td>Function</td>
			<td>
				A callback function to execute upon request completion; a value must be specified.<br>
				The $Ajax.Response object, the response object, is passed as a parameter.
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">onerror</td>
			<td>Function</td>
			<td>
				A callback function to execute upon request failure.<br>
				If omitted, onload is executed even if an error occurs.
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">ontimeout</td>
			<td>Function</td>
			<td>
				A callback function to execute upon timeout.<br>
				If omitted, nothing will be processed after timeout.
			</td>
		</tr>
		<tr>
		<td style="font-weight:bold;">proxy</td>
			<td>String</td>
			<td>
				The path of a local proxy file (ajax_local_callback.html).<br>
				It can be used when the type is "iframe"; a value must be specified.
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">jsonp_charset</td>
			<td>String</td>
			<td>
				A &lt;script&gt; encoding method to use upon request.<br>
				It can be used when the type is jsonp. If omitted, it is set to the default value, utf-8 (available since 0.4.2).
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">callbackid</td>
			<td>String</td>
			<td>
				An ID value to use for a callback function.<br>
				It can be used when the type is jsonp (available since 1.3.0).<br>
				If omitted, a random ID value is generated.
				<br>
				Transfers the name of a callback function with a random ID value appended to a server upon Ajax requests in jsonp method.<br>
				As the random value is passed as an ID at this time, a new request URL is generated for each request. Thus, data is directly sent to a server without going through cache.<br>
				If an ID value is specified, a callback function name is not generated with an random ID value. <br>
				Thus, it is a good way to specify an ID when you want to increase hit rate by using a cache server.
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">callbackname</td>
			<td>String</td>
			<td>
				The parameter name that contains a callback function name.<br>
				It can be used when the type is "jsonp." The default value is "_callback" (available since 1.3.8).
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">sendheader</td>
			<td>Boolean</td>
			<td>
				Whether to transmit request headers.<br>
				It can be used when the type is "flash." Set to false if allow-header does not exist in crossdomain.xml<br>
				where information on server permissions is stored.<br>
				The default value is true (available since 1.3.4).
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">async</td>
			<td>Boolean</td>
			<td>
				Whether or not an asynchronous call.<br>
				It can be used when the type is "xhr." The default is true (available since 1.3.7).
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">decode</td>
			<td>Boolean</td>
			<td>
				It can be used when the type is "flash." Set to false if encoding in the requested data is not uft-8.<br>
				The default value is true (available since 1.4.0).
			</td>
		</tr>
		<tr>
			<td style="font-weight:bold;">postBody</td>
			<td>Boolean</td>
			<td>
				Whether to send data, that is supposed to be sent a server, to a Body area upon request.
				It can be used when the type is "xhr" and the method is other than "get." Used in REST environment.<br>
				The default value is false (available since 1.4.2).
			</td>
		</tr>
	</tbody>
</table>

 * @constructor
 * @description [Lite]
 * @see <a href="http://dev.naver.com/projects/jindo/wiki/cross%20domain%20ajax">Understanding Cross Domain Ajax</a>
 * @author Kim, Taegon
 *
 * @example
// An example that sets a list by getting data from a server upon clicking the 'Get List' button.
// (1) If server pages exist in the same domain as service pages - xhr

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
					method : 'get',			// Communication using GET method
					onload : function(res){	// A callback function to execute upon request completion
						$('list').innerHTML = res.text();
					},
					timeout : 3,			// Executes ontimeout if the request has not been completed within 3 seconds (0 if omitted).
					ontimeout : function(){	// A callback function to execute upon timeout; nothing will be processed if timeout occurs upon omittance.
						alert("Timeout!");
					},
					async : true			// An asynchronous call, true if omitted.
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
	echo "<li>First</li><li>Second</li><li>Third</li>";
?>

 * @example
// An example that sets a list by getting data from a server upon clicking the 'Get List' button.
// (2) If server pages exist in the same domain as service pages - iframe

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
					method : 'get',			// Communication using GET method
											// If POST is specified, it is processed using POST method when a request is made from a remote proxy file to some.php.
					onload : function(res){	// A callback function to execute upon request completion
						$('list').innerHTML = res.text();
					},
					// The path of a local proxy file.
					// The path must be correctly specified. Any location is acceptable as long as it is a local domain path.
					// (※ A remote proxy file must be in the root directory of a remote domain server.)
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
	echo "<li>First</li><li>Second</li><li>Third</li>";
?>

 * @example
// An example that sets a list by getting data from a server upon clicking the 'Get List' button.
// (3) If server pages exist in the same domain as service pages - jsonp

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
					method: 'get',			// If the type is jsonp, it is automatically processed as get (omittable).
					jsonp_charset: 'utf-8',	// The <script> encoding method to use upon request (utf-8 if omitted)
					onload: function(res){	// A callback function to execute upon request completion
						var response = res.json();
						var welList = $Element('list').empty();

						for (var i = 0, nLen = response.length; i < nLen; i++) {
							welList.append($("<li>" + response[i] + "</li>"));
						}
					},
					callbackid: '12345',				// An ID value to use for a callback function (omittable)
					callbackname: 'ajax_callback_fn'	// The parameter name that contains the callback function name to use in a server (if omitted, '_callback' is used)
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
	echo $callbackName."(['First','Second','Third'])";
?>

 * @example
// An example that sets a list by getting data from a server upon clicking the 'Get List' button.
// (4) If server pages exist in the same domain as service pages - flash

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
					method : 'get',			// Communication using GET method
					sendheader : false,		// Whether to transmit request headers (true if omitted)
					decode : true,			// It is set to false if the encoding in the requested data is not utf-8 (true if omitted).
					onload : function(res){	// A callback function to execute upon request completion
						$('list').innerHTML = res.text();
					},
				});
				oAjax.request();
			}
		</script>
	</head>
	<body>
		<script type="text/javascript">
			$Ajax.SWFRequest.write("swf/ajax.swf");	// Initializes the flash object before invoking Ajax.
		</script>
		<button onclick="getList(); return false;">Get List</button>

		<ul id="list">

		</ul>
	</body>
</html>

// [http://server.com/some/some.php]
<?php
	echo "<li>First</li><li>Second</li><li>Third</li>";
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
	 
Applies if setting objects exist for testing purpose.
	
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

 * The request method transfers Ajax requests to a server.<br>
 * A parameter to use for requests can be set in the $Ajax creator or changed in the option method.<br>
 *
 * @remark If the request type is "flash," the $Ajax.SWFRequest.write() command must be executed within <body> tags before this method is executed.
 *
 * @param {Object} oData Data to send to a server
 * @return {$Ajax} The $Ajax object
 * @description [Lite]
 * @example
 *
 *
var ajax = $Ajax("http://www.remote.com", {
   onload : function(res) {
      // onload handler
   }
});

ajax.request( {key1:"value1", key2:"value2"} );	// Passes data to send a server as a parameter.
	
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
	 
Adds parameters to URL if the request type is XHR GET method.
	
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
		 
For xhr, a browser is cached by itself so that caching is disabled when sending to GET in Internet Explorer.
	
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
		 
 * Although addEventListener is added to XMLHttpRequest in Opera version 10.60, it does not work as intended. Thus, Opera is supported only in dom1 method.
 * Internet Explorer 9 has the same issue as Opera.
	
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
            
 * As onreadystatechange is synchronously executed in Internet Explorer 6, the timeout event does not occur.
 * Thus, code is modified so that the timeout event can normally occur by checking inverval only when it is working asynchronously.
	
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
	
A url for testing
	
	 */
	this._test_url = url;
	req.send(data);

	return this;
};

/**

 * The isIdle method checks whether the request of an Ajax object is currently waiting.
 * @return {Boolean} Returns true if it is waiting, false otherwise.
 * @since Available since 1.3.5
 * @description [Lite]
 * @example
 var ajax = $Ajax("http://www.remote.com",{
     onload : function(res){
         // onload handler
     }
});

if(ajax.isIdle()) ajax.request();
    
 */
jindo.$Ajax.prototype.isIdle = function(){
	return this._status==0;
}

/**

 * The abort method cancels Ajax requests that were sent to a server. This method can be used when response takes long time or Ajax requests are forcibly cancelled.
 * @return {$Ajax} The $Ajax object to be cancelled
 * @description [Lite]
 * @example
var ajax = $Ajax("http://www.remote.com", {
	timeout : 3,
	ontimeout : function() {
		stopRequest();
	}
	onload : function(res) {
		// onload handler
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

 * The option method gets or sets information that is used in Ajax requests.<br>
 * To set information, you should use a name and value or one object that has a name and value as a parameter.<br>
 * You can set two or more pieces of information at once by using an object that has a name and value.
 *
 * @param {String | Object} name <br>
 * A string or an object can be used as the parameter type.<br>
 * <br>
 * If a string is used as a parameter, it is processed as either of the followings:<br>
 * 1. If a value parameter is omitted, the $Ajax's attribute value that corresponds to a name is returned.<br>
 * 2. If a value parameter is set, value is specified to $Ajax attribute corresponding to a name.<br>
 * <br>
 * If an object is used as a parameter, it searches information by the attribute name and sets it to the attribute value. If an object has two or more attributes, the values of two or more attributes can be set at once.
 * @param {String}  [value] Information value to be set. Used only if a name parameter is a string.
 * @return {String|$Ajax}  Returns a string in case of getting information value; returns the $Ajax object in case of setting a value.
 * @description [Lite]
 * @example
var ajax = $Ajax("http://www.remote.com", {
	type : "xhr",
	method : "get",
	onload : function(res) {
		// onload handler
	}
});

var request_type = ajax.option("type");					// Returns xhr, the type.
ajax.option("method", "post");							// Sets a method to post.
ajax.option( { timeout : 0, onload : handler_func } );	// Sets timeout to 0 and onload to handler_func.
    
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

 * The header method gets or sets an HTTP request header to use in Ajax requests.<br>
 * To set the header, you should use a header name and value or an object that has a header name and value as a parameters. If an object has two or more attributes, the value of two or more headers can be set at once.<br>
 * To get the value of a specific attribute from headers, use the attribute name as a parameter.
 *
 * @param {String|Object} name <br>
 * A string or an object can be used as the parameter type.<br>
 * <br>
 * If a string is used as a parameter, it is processed as either of the followings: <br>
 * 1. If a value parameter is omitted, an attribute value that matches with a string is searched in an HTTP request header.<br>
 * 2. If a value parameter is set, value is specified to the attribute that matches with a string in an HTTP request header.<br>
 * <br>
 * If an object is used as a parameter, it searches information by the attribute name and sets it to the attribute value. If an object has two or more attributes, the values of two or more attributes can be set at once.
 * @param {Value} [value] The header value to set. A string can be used as the parameter type.
 * @return {String|$Ajax} Returns a string in case of getting information value; returns the $Ajax object in case of setting a value.
 * @description [Lite]
 * @example
var customheader = ajax.header("myHeader"); 		// The value of myHeader in an HTTP request header
ajax.header( "myHeader", "someValue" );				// Sets the myHeader of an HTTP request header to someValue.
ajax.header( { anotherHeader : "someValue2" } );	// Sets the anotherHeader of an HTTP request header to someValue2.
    
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

 * Provides useful methods to get response by wrapping the Ajax response object.
 * @class Creates and returns the $Ajax.Response object.<br>
 * It is created after the request is completely processed in the $Ajax object, and transferred as a parameter of the onload callback function that was set upon $Ajax creation.
 * @constructor
 * @param {Object} req A request object
 * @description [Lite]
    
 */
jindo.$Ajax.Response  = function(req) {
	if (this === jindo.$Ajax) return new jindo.$Ajax.Response(req);
	this._response = req;
};

/**

 * Returns response as an XML object.
 * @return {Object} The response XML object. It is similar to responseXML of XHR.
 * @description [Lite]
 *
 * @example
// some.xml
?<?xml version="1.0" encoding="utf-8"?>
<data>
	<li>First</li>
	<li>Second</li>
	<li>Third</li>
</data>

// client.html
var oAjax = new $Ajax('some.xml', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		var elData = cssquery.getSingle('data', res.xml());	// Returns response as an XML object.
		$('list').innerHTML = elData.firstChild.nodeValue;
	},
}).request();
    
 */
jindo.$Ajax.Response.prototype.xml = function() {
	return this._response.responseXML;
};

/**

 * Returns response as a string.
 * @return {String} A response string. It is similar to responseText of XHR.
 * @description [Lite]
 *
 * @example
// some.php
<?php
	echo "<li>First</li><li>Second</li><li>Third</li>";
?>

// client.html
var oAjax = new $Ajax('some.xml', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		$('list').innerHTML = res.text();	// Returns response as a string.
	},
}).request();
    
 */
jindo.$Ajax.Response.prototype.text = function() {
	return this._response.responseText;
};

/**

 * Returns HTTP response code.
 * @return {Number} A response code. See the table of HTTP response code.
 * @description [Lite]
 *
 * @example
var oAjax = new $Ajax('some.php', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		if(res.status() == 200){	// Checks HTTP response code.
			$('list').innerHTML = res.text();
		}
	},
}).request();
    
 */
jindo.$Ajax.Response.prototype.status = function() {
	return this._response.status;
};

/**

 * Returns readyState of response.
 * @return {Number}  readyState.
 * @description [Lite]
 *
 * @example
var oAjax = new $Ajax('some.php', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		if(res.readyState() == 4){	// Checks readyState of response.
			$('list').innerHTML = res.text();
		}
	},
}).request();
    
 */
jindo.$Ajax.Response.prototype.readyState = function() {
	return this._response.readyState;
};

/**

 * Returns response in the JSON object.
 * @return {Object} The response JSON object. <br>
 * A response string is automatically converted into the JSON object and then returned. If an error occurs during conversion, an empty object is returned.
 * @description [Lite]
 *
 * @example
// some.php
<?php
	echo "['First', 'Second', 'Third']";
?>

// client.html
var oAjax = new $Ajax('some.php', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		var welList = $Element('list').empty();
		var jsonData = res.json();	// Returns response in the JSON object.

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

 * Gets response headers. If a parameter is not passed, full headers are returned.
 * @param {String} name A name of response header to get
 * @return {String|Object} Returns a specific header value if a parameter exists, a full header otherwise.
 * @description [Lite]
 *
 * @example
var oAjax = new $Ajax('some.php', {
	type : 'xhr',
	method : 'get',
	onload : function(res){
		res.header();					// Returns full response headers.
		res.header("Content-Length")	// Returns the Content-Length value in response header.
	},
}).request();
    
 */
jindo.$Ajax.Response.prototype.header = function(name) {
	if (typeof name == "string") return this._response.getResponseHeader(name);
	return this._response.getAllResponseHeaders();
};
