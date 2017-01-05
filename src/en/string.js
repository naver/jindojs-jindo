/**
 
 * @fileOverview A file to define the constructor and methods of $Json
 * @name json.js
  
 */

/**
 
 * Creates the $S object.
 * @class The $S class is a Wrapper class to handle a string.
 * @constructor
  * @param {String} str
 * <br>
 * Specifies a string as a parameter.
 * @author Kim, Taegon
  
 */
jindo.$S = function(str) {
	var cl = arguments.callee;

	if (typeof str == "undefined") str = "";
	if (str instanceof cl) return str;
	if (!(this instanceof cl)) return new cl(str);

	this._str = str+"";
}

/**
 
 * The $value method returns the original string.
 * @return {String} The wrapped origianl string
 * @see $S#toString
 * @example
var str = $S("Hello world!!");
	 str.$value();
 *
 * // Result:
 * // Hello world!!
  
 */
jindo.$S.prototype.$value = function() {
	return this._str;
};

/**
 
 * The toString method returns the original string.
 * @return {String} The wrapped origianl string
 * @remark It is the same as $value.
 * @example
var str = $S("Hello world!!");
	 str.toString();
 *
 * // Result:
 * // Hello world!!
  
 */
jindo.$S.prototype.toString = jindo.$S.prototype.$value;

/**
 
 * The trim method trims a string on both side for any spaces (since 1.4.1, trimming em spaces is also supported).
 * @return {$S} A new $S object in which both side of a string was removed.
 * @example
var str = "   I have many spaces.   ";
document.write ( $S(str).trim() );
 *
 * // Result:
 * // I have many spaces.
  
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
 
 * The escapeHTML method escapes special characters of HTML as HTML Entities.
 * @return {$S} A new $S object in which HTML special characters were converted into Entities.
 * @see $S#unescapeHTML
 * @remark  It replaces ", &, <, > ,' with &quot;, &amp;, &lt;, &gt; &#39; respectively.
 * @example
 var str = ">_<;;";
 document.write( $S(str).escapeHTML() );
 *
 * // Result:
 * // &amp;gt;_&amp;lt;;;
  
 */
jindo.$S.prototype.escapeHTML = function() {
	var entities = {'"':'quot','&':'amp','<':'lt','>':'gt','\'':'#39'};
	var s = this._str.replace(/[<>&"']/g, function(m0){
		return entities[m0]?'&'+entities[m0]+';':m0;
	});
	return jindo.$S(s);
};

/**
 
 * The stripTags method strips the XML or HTML tags from a string.
 * @return {$S} A new $S object in which the XML or HTML tags were stripped
 * @example
 var str = "Meeting <b>people</b> is easy.";
 document.write( $S(str).stripTags() );
 *
 * // Result:
 * // Meeting people is easy.
  
 */
jindo.$S.prototype.stripTags = function() {
	return jindo.$S(this._str.replace(/<\/?(?:h[1-5]|[a-z]+(?:\:[a-z]+)?)[^>]*>/ig, ''));
};

/**
 
 * The times method repeats a string the number of times specified in a parameter.
 * @param {Number} nTimes A number of time to be repeated
 * @return {$S} A new $S object in which a string was repeated as a specified number of times.
 * @example
 document.write ( $S("Abc").times(3) );
 *
 * // Result: AbcAbcAbc
  
 */
jindo.$S.prototype.times = function(nTimes) {
	var buf = [];
	for(var i=0; i < nTimes; i++) {
		buf[buf.length] = this._str;
	}

	return jindo.$S(buf.join(''));
};

/**
 
 * The unescapeHTML method returns an escaped HTML to the original HTML.
 * @return {$S} A new $S object in which an escaped HTML was converted into the original HTML
 * @remark  It replaces &quot;, &amp;, &lt;, &gt; &#39; with ", &, <, >, ' respectively.
 * @see $S#escapeHTML
 * @example
 * var str = "&lt;a href=&quot;http://naver.com&quot;&gt;Naver&lt;/a&gt;";
 * document.write( $S(str).unescapeHTML() );
 *
 * // Result:
 * // <a href="http://naver.com">Naver</a>
  
 */
jindo.$S.prototype.unescapeHTML = function() {
	var entities = {'quot':'"','amp':'&','lt':'<','gt':'>','#39':'\''};
	var s = this._str.replace(/&([a-z]+|#[0-9]+);/g, function(m0,m1){
		return entities[m1]?entities[m1]:m0;
	});
	return jindo.$S(s);
};

/**
 
 * The escape method encodes Korean characters contained in a string to ASCII characters.
 * @remark It escapes \r, \n, \t, ', ", non-ASCII characters.
 * @return {$S} A new $S object in which a string was escaped
 * @see $S#escapeHTML
 * @example
 * var str = '가"\'나\\';
 * document.write( $S(str).escape() );
 *
 * // Result:
 * \uAC00\"\'\uB098\\
  
 */
jindo.$S.prototype.escape = function() {
	var s = this._str.replace(/([\u0080-\uFFFF]+)|[\n\r\t"'\\]/g, function(m0,m1,_){
		if(m1) return escape(m1).replace(/%/g,'\\');
		return (_={"\n":"\\n","\r":"\\r","\t":"\\t"})[m0]?_[m0]:"\\"+m0;
	});

	return jindo.$S(s);
};

/**
 
 * The bytes method returns the number of actual bytes of a string and trims the string as much as the number of bytes specified (charset is available since 1.4.3).
 * @return The number of string types. Note that if a first parameter is specified, it returns its own object ($S).
 * @param {Number|Object} nBytes The number of string bytes to be trimmed. Used when setting the charset.
 * @remark  It interprets the charset of a document and computs the number of bytes of Unicode or Korean characters according to encoding method.
 * @example
// Assumes that the euc-kr encoding is set in a document.
*
var str = "인 문장...";
document.write( $S(str).bytes() );
*
* // Result:
* // 37
*
document.write( $S(str).bytes(20) );
*
* // Result:
* // 한글과 English가
*
document.write( $S(str).bytes({charset:'euc-kr',size:20}) );
*
* // Result:
* //
*
document.write( $S(str).bytes({charset:'euc-kr'}) );
*
* // Result:
* // 29
  
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
		 
The Wikipedia site (http://ko.wikipedia.org/wiki/UTF-8) is referenced to get information on Unicode.
  
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
 
 * The parseString method parses a URL query string to an object.
 * @return {Object} An object in which a string was parsed
 * @example
 * var str = "aa=first&bb=second";
 * var obj = $S(str).parseString();
 *
 * // Result:
 * // obj => { aa : "first", bb : "second" }
  
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
 
 * The escapeRegex method escapes a string to use regular expressions.
 * @since 1.2.0
 * @return {String} The escaped string
 * @example
var str = "Slash / is very important. Backslash \ is more important. +_+";
document.write( $S(str).escapeRegex() );
 *
 * // Result:
 * // Slash \/ is very important\. Backslash \\ is more important\. \+_\+
  
 */
jindo.$S.prototype.escapeRegex = function() {
	var s = this._str;
	var r = /([\?\.\*\+\-\/\(\)\{\}\[\]\:\!\^\$\\\|])/g;

	return jindo.$S(s.replace(r, "\\$1"));
};

/**
 
 * The format method creates a new string by replacing a string with a format string. The format string starts with % and its types are the same as <a href="http://www.php.net/manual/en/function.sprintf.php">PHP</a>.
 * @param {String} formatString The format string
 * @return {String} A new string created by replacing with a format string
 * @example
var str = $S("%4d년 %02d월 %02d일").format(2008, 2, 13);
*
* // Result:
* // str = "2008년 02월 13일"

var str = $S("패딩 %5s 빈공백").format("값");
*
* // Result:
* // str => "패딩     값 빈공백"

var str = $S("%b").format(10);
*
* // Result:
* // str => "1010"

var str = $S("%x").format(10);
*
* // Result:
* // str => "a"

var str = $S("%X").format(10);
*
* // Result:
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
