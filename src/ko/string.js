/**
 
 * @fileOverview $S의 생성자 및 메서드를 정의한 파일
 * @name string.js
 * @author Kim, Taegon
  
 */

/**
 
 * @class $S() 객체는 String 객체를 래핑(wrapping)하여 문자열을 처리하기 위한 확장 기능을 제공한다.
 * @constructor
 * @description $S() 객체를 생성한다.
 * @param {String} sStr 래핑할 문자열.
 * @example
var sStr = 'Hello world!';
var oStr = $S(sStr);            // $S() 객체 생성
var oStr2 = new $S(sStr);        // new를 사용한 $S() 객체 생성
 
 */
jindo.$S = function(str) {
	var cl = arguments.callee;

	if (typeof str == "undefined") str = "";
	if (str instanceof cl) return str;
	if (!(this instanceof cl)) return new cl(str);

	this._str = str+"";
}

/**
 
 * @description $value() 메서드는 $S() 객체가 감싸고 있던 원본 문자열(String 객체)을 반환한다. toString() 메서드와 같은 의미이다.
 * @return {String} 원본 String 객체.
 * @see $S#toString
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String">String</a> - MDN Docs
 * @example
var str = $S("Hello world!!");
str.$value();
// 결과 :
// Hello world!!
  
 */
jindo.$S.prototype.$value = function() {
	return this._str;
};

/**
 
 * @function
 * @description toString() 메서드는 $S() 객체가 감싸고 있던 원본 문자열(String 객체)을 반환한다. $value() 메서드와 같은 의미이다.
 * @return {String} 원본 String 객체.
 * @see $S#$value
 * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String">String</a> - MDN Docs
 * @example
var str = $S("Hello world!!");
str.toString();
// 결과 :
// Hello world!!
  
 */
jindo.$S.prototype.toString = jindo.$S.prototype.$value;

/**
 
 * @description trim() 메서드는 문자열의 양 끝에 있는 공백을 제거한다.
 * @return {$S} 문자열의 양 끝에 있는 공백을 제거한 새로운 $S() 객체
 * @since 1.4.1 버전부터 전각공백도 제거
 * @example
var str = "   I have many spaces.   ";
document.write ( $S(str).trim() );
// 결과 :
// I have many spaces.
  
 */
jindo.$S.prototype.trim = function() {
	if ("".trim) {
		jindo.$S.prototype.trim = function() {
			return jindo.$S(this._str.trim());
		}
	}else{
		jindo.$S.prototype.trim = function() {
			return jindo.$S(this._str.replace(/^(\s|　)+/g, "").replace(/(\s|　)+$/g, ""));
		}
	}
	
	return jindo.$S(this.trim());
	
};

/**
 
 * @description escapeHTML() 메서드는 HTML 특수 문자를 HTML 엔티티(Entities)형식으로 변환한다. 변경하는 문자는 다음 표와 같다.<br>
 <table>
	<caption>HTML Escape 문자 변환</caption>
	<thead>
		<tr>
			<th>변환 대상 문자</th>
			<th>&quot;</th>
			<th>&amp;</th>
			<th>&lt;</th>
			<th>&gt;</th>
			<th>&#39;</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th>변환 결과</th>
			<td>&amp;quot;</td>
			<td>&amp;amp;</td>
			<td>&amp;lt;</td>
			<td>&amp;gt;</td>
			<td>&#39;</td>			
		</tr>
	</tbody>
 </table>
 * @return {$S} HTML 특수 문자를 엔티티 형식으로 변환한 새로운 $S() 객체.
 * @see $S#unescapeHTML
 * @see $S#escape
 * @example
 var str = ">_<;;";
 document.write( $S(str).escapeHTML() );
 
 // 결과 :
 // &amp;gt;_&amp;lt;;;
  
 */
jindo.$S.prototype.escapeHTML = function() {
	var entities = {'"':'quot','&':'amp','<':'lt','>':'gt','\'':'#39'};
	var s = this._str.replace(/[<>&"']/g, function(m0){
		return entities[m0]?'&'+entities[m0]+';':m0;
	});
	return jindo.$S(s);
};

/**
 
 * @description stripTags() 메서드는 문자열에서 XML 혹은 HTML 태그를 제거한다.
 * @return {$S} XML 혹은 HTML 태그를 제거한 새로운 $S() 객체.
 * @example
 var str = "Meeting <b>people</b> is easy.";
 document.write( $S(str).stripTags() );
 
 // 결과 :
 // Meeting people is easy.
  
 */
jindo.$S.prototype.stripTags = function() {
	return jindo.$S(this._str.replace(/<\/?(?:h[1-5]|[a-z]+(?:\:[a-z]+)?)[^>]*>/ig, ''));
};

/**
 
 * @description times() 메서드는 문자열을 파라미터로 지정한 횟수만큼 반복하는 문자열을 생성한다.
 * @param {Number} nTimes 반복할 횟수.
 * @return {$S} 문자열을 지정한 횟수만큼 반복한 새로운 $S() 객체
 * @example
 document.write ( $S("Abc").times(3) );
 
 // 결과 : AbcAbcAbc
  
 */
jindo.$S.prototype.times = function(nTimes) {
	var buf = [];
	for(var i=0; i < nTimes; i++) {
		buf[buf.length] = this._str;
	}

	return jindo.$S(buf.join(''));
};

/**
 
 * @description unescapeHTML() 메서드는 이스케이프(escape)된 문자를 원래의 문자로 변환한다.
 * @return {$S} 이스케이프된 문자를 원래의 문자로 변환한 새로운 $S() 객체
 * @see $S#escapeHTML
 * @example
var str = "&lt;a href=&quot;http://naver.com&quot;&gt;Naver&lt;/a&gt;";
document.write( $S(str).unescapeHTML() );

// 결과 :
// <a href="http://naver.com">Naver</a>
  
 */
jindo.$S.prototype.unescapeHTML = function() {
	var entities = {'quot':'"','amp':'&','lt':'<','gt':'>','#39':'\''};
	var s = this._str.replace(/&([a-z]+|#[0-9]+);/g, function(m0,m1){
		return entities[m1]?entities[m1]:m0;
	});
	return jindo.$S(s);
};

/**
 
 * @description escape() 메서드는 문자열에 포함된 한글을 ASCII 문자열로 인코딩하고 non-ASCII 문자를 이스케이프(escape)한다. 변경하는 문자는 다음 표와 같다.<br>
 <table>
	<caption>Escape 문자 변환</caption>
	<thead>
		<tr>
			<th>변환 대상 문자</th>
			<th>\r</th>
			<th>\n</th>
			<th>\t</th>
			<th>'</th>
			<th>"</th>
			<th>non-ASCII 문자</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th>변환 결과</th>
			<td>\\r</td>
			<td>\\n</td>
			<td>\\t</td>
			<td>\'</td>
			<td>\"</td>	
			<td>\uXXXX</td>	
		</tr>
	</tbody>
 </table>
 * @return {$S} 문자열을 이스케이프한 새로운 $S() 객체
 * @see $S#escapeHTML
 * @example
 var str = '가"\'나\\';
 document.write( $S(str).escape() );
 
 // 결과 :
 // \uAC00\"\'\uB098\\
  
 */
jindo.$S.prototype.escape = function() {
	var s = this._str.replace(/([\u0080-\uFFFF]+)|[\n\r\t"'\\]/g, function(m0,m1,_){
		if(m1) return escape(m1).replace(/%/g,'\\');
		return (_={"\n":"\\n","\r":"\\r","\t":"\\t"})[m0]?_[m0]:"\\"+m0;
	});

	return jindo.$S(s);
};

/**
 
 * @description bytes() 메서드는 문자열의 실제 바이트(byte) 수를 반환하고, 제한하려는 바이트(byte) 수를 지정하면 문자열을 해당 크기에 맞게 잘라낸다. 또한, 지정한 인코딩 방식에 따라 한글을 비롯한 유니코드 문자열의 바이트 수를 계산한다.
 * @param {Variant} [vOption] 파라미터를 바이트 수(Number)로 지정하면 크기에 맞게 문자열을 잘라낸다. 인코딩 방식을 지정하고 제한할 크기를 설정한 객체(Object)를 파라미터로 입력하면 지정한 인코딩 방식에 맞춰 문자열을 크기를 반환하거나 잘라낸다. 파라미터를 생략할 경우 문자열의 크기만 반환한다.
 * @return {Variant} 파라미터에 제한할 바이트 수를 지정하면 해당 크기만큼 문자열을 잘라낸 $S() 객체를 반환하고 이외의 경우 문자열의 크기(Number)를 반환한다.
 * @since 1.4.3 버전부터 인코딩 방식 사용 가능
 * @example
// 문서가 euc-kr 환경임을 가정합니다.
var str = "한글과 English가 섞인 문장...";

document.write( $S(str).bytes() );
// 결과 :
// 37

document.write( $S(str).bytes(20) );
// 결과 :
// 한글과 English가

document.write( $S(str).bytes({charset:'euc-kr',size:20}) );
// 결과 :
// 한글과 English가 섞

document.write( $S(str).bytes({charset:'euc-kr'}) );
// 결과 :
// 29
  
 */
jindo.$S.prototype.bytes = function(vConfig) {
	var code = 0, bytes = 0, i = 0, len = this._str.length;
	var charset = ((document.charset || document.characterSet || document.defaultCharset)+"");
	var cut,nBytes;
	if (typeof vConfig == "undefined") {
		cut = false;
	}else if(vConfig.constructor == Number){
		cut = true;
		nBytes = vConfig;
	}else if(vConfig.constructor == Object){
		charset = vConfig.charset||charset;
		nBytes  = vConfig.size||false;
		cut = !!nBytes;
	}else{
		cut = false;
	}
	
	if (charset.toLowerCase() == "utf-8") {
		/*
		 
유니코드 문자열의 바이트 수는 위키피디아를 참고했다(http://ko.wikipedia.org/wiki/UTF-8).
  
		 */
		for(i=0; i < len; i++) {
			code = this._str.charCodeAt(i);
			if (code < 128) {
				bytes += 1;
			}else if (code < 2048){
				bytes += 2;
			}else if (code < 65536){
				bytes += 3;
			}else{
				bytes += 4;
			}
			
			if (cut && bytes > nBytes) {
				this._str = this._str.substr(0,i);
				break;
			}
		}
	} else {
		for(i=0; i < len; i++) {
			bytes += (this._str.charCodeAt(i) > 128)?2:1;
			
			if (cut && bytes > nBytes) {
				this._str = this._str.substr(0,i);
				break;
			}
		}
	}

	return cut?this:bytes;
};

/**
 
 * @description parseString() 메서드는 URL 쿼리스트링(Query String)을 객체로 파싱한다. 예제를 확인한다.
 * @return {Object} 쿼리스트링을 파싱한 객체.
 * @see <a href="http://en.wikipedia.org/wiki/Querystring">Query String</a> - Wikipedia
 * @example
var str = "aa=first&bb=second";
var obj = $S(str).parseString();
// 결과 :
// obj => { aa : "first", bb : "second" }
  
 */
jindo.$S.prototype.parseString = function() {
	if(this._str=="") return {};
	
	var str = this._str.split(/&/g), pos, key, val, buf = {},isescape = false;

	for(var i=0; i < str.length; i++) {
		key = str[i].substring(0, pos=str[i].indexOf("=")), isescape = false;
		try{
			val = decodeURIComponent(str[i].substring(pos+1));
		}catch(e){
			isescape = true;
			val = decodeURIComponent(unescape(str[i].substring(pos+1)));
		}
		

		if (key.substr(key.length-2,2) == "[]") {
			key = key.substring(0, key.length-2);
			if (typeof buf[key] == "undefined") buf[key] = [];
			buf[key][buf[key].length] = isescape? escape(val) : val;;
		} else {
			buf[key] = isescape? escape(val) : val;
		}
	}

	return buf;
};

/**
 
 * @description escapeRegex() 메서드는 문자열을 정규식에 사용할 수 있도록 이스케이프(escape)한다. 예제를 참고한다.
 * @since 1.2.0 버전에 작성됨.
 * @return {$S} 내부 문자열이 이스케이프된 $S() 객체.
 * @see <a href="http://en.wikipedia.org/wiki/Regexp">Regular Expression</a>
 * @example
var str = "Slash / is very important. Backslash \ is more important. +_+";
document.write( $S(str).escapeRegex() );
 
 // 결과 : \/ is very important\. Backslash \\ is more important\. \+_\+
  
 */
jindo.$S.prototype.escapeRegex = function() {
	var s = this._str;
	var r = /([\?\.\*\+\-\/\(\)\{\}\[\]\:\!\^\$\\\|])/g;

	return jindo.$S(s.replace(r, "\\$1"));
};

/**
 
 * @descritpion format() 메서드는 문자열을 형식 문자열(Format Specifier)에 대입하여 새로운 문자열을 만든다. 형식 문자열은 %로 시작하며, 사용하는 형식 문자열의 종류는 PHP의 sprintf() 함수가 사용하는 것과 동일하다.
 * @param {String} sFormatString 대입할 형식 문자열.
 * @return {String} 문자열을 형식 문자열에 대입하여 만든 새로운 문자열.
 * @see <a href="http://www.php.net/manual/en/function.sprintf.php">sprintf()</a>" - php.net
 * @example
var str = $S("%4d년 %02d월 %02d일").format(2008, 2, 13);
*
* // 결과 :
* // str = "2008년 02월 13일"

var str = $S("패딩 %5s 빈공백").format("값");
*
* // 결과 :
* // str => "패딩     값 빈공백"

var str = $S("%b").format(10);
*
* // 결과 :
* // str => "1010"

var str = $S("%x").format(10);
*
* // 결과 :
* // str => "a"

var str = $S("%X").format(10);
*
* // 결과 :
* // str => "A"
 * @see $S#times
  
 */
jindo.$S.prototype.format = function() {
	var args = arguments;
	var idx  = 0;
	var s = this._str.replace(/%([ 0])?(-)?([1-9][0-9]*)?([bcdsoxX])/g, function(m0,m1,m2,m3,m4){
		var a = args[idx++];
		var ret = "", pad = "";

		m3 = m3?+m3:0;

		if (m4 == "s") {
			ret = a+"";
		} else if (" bcdoxX".indexOf(m4) > 0) {
			if (typeof a != "number") return "";
			ret = (m4 == "c")?String.fromCharCode(a):a.toString(({b:2,d:10,o:8,x:16,X:16})[m4]);
			if (" X".indexOf(m4) > 0) ret = ret.toUpperCase();
		}

		if (ret.length < m3) pad = jindo.$S(m1||" ").times(m3 - ret.length).toString();
		(m2 == '-')?(ret+=pad):(ret=pad+ret);

		return ret;
	});

	return jindo.$S(s);
};
