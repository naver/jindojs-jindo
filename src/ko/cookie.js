/**

 * @fileOverview $Cookie의 생성자 및 메서드를 정의한 파일
 * @name cookie.js
 * @author Kim, Taegon
  
 */

/**

 * @class $Cookie() 객체는 쿠키(Cookie)에 정보를 추가, 수정, 혹은 삭제하거나 쿠키의 값을 가져온다.
 * @constructor
 * @description $Cookie() 객체를 생성한다.
 * @example
var cookie = $Cookie();
    
 */
jindo.$Cookie = function() {
	var cl = arguments.callee;
	var cached = cl._cached;
	
	if (cl._cached) return cl._cached;
	if (!(this instanceof cl)) return new cl;
	if (typeof cl._cached == "undefined") cl._cached = this;
};

/**

 * @description keys() 메서드는 쿠키 키(key)를 원소로 가지는 배열을 리턴한다.
 * @return {Array} 쿠키의 키를 원소로 가지는 배열
 * @see $Cookie#set
 * @example
var cookie = $Cookie();
cookie.set("session_id1", "value1", 1);
cookie.set("session_id2", "value2", 1);
cookie.set("session_id3", "value3", 1);

document.write (cookie.keys ());
// 결과 :
// session_id1, session_id2, session_id3
  
 */
jindo.$Cookie.prototype.keys = function() {
	var ca = document.cookie.split(";");
	var re = /^\s+|\s+$/g;
	var a  = new Array;
	
	for(var i=0; i < ca.length; i++) {
		a[a.length] = ca[i].substr(0,ca[i].indexOf("=")).replace(re, "");
	}
	
	return a;
};

/**

 * @description get() 메서드는 쿠키에서 키(key)에 해당하는 값(value)을 가져온다. 값이 존재하지 않는다면 null을 반환한다.
 * @param {String} sName 키 이름.
 * @return {String} 해당 키의 값.
 * @see $Cookie#set
 * @example
var cookie = $Cookie();
cookie.set("session_id1", "value1", 1);
document.write (cookie.get ("session_id1"));
	
// 결과 :
// value1

document.write (cookie.get ("session_id0"));
// 결과 :
// null
  
 */
jindo.$Cookie.prototype.get = function(sName) {
	var ca = document.cookie.split(/\s*;\s*/);
	var re = new RegExp("^(\\s*"+sName+"\\s*=)");
	
	for(var i=0; i < ca.length; i++) {
		if (re.test(ca[i])) return unescape(ca[i].substr(RegExp.$1.length));
	}
	
	return null;
};

/**

 * @description set() 메서드는 쿠키 값을 설정한다. 쿠키 값을 설정할 때 유효 기간, 유효 도메인, 유효 경로(path)를 함께 설정할 수 있다.
 * @param {String} sName 키의 이름
 * @param {String} sValue 키의 값
 * @param {Number} [nDays] 쿠키 유효 시간. 유효 시간은 일단위로 설정한다. 유효시간을 생략했다면 쿠키는 웹 브라우저가 종료되면 없어진다.
 * @param {String} [sDomain] 쿠키 도메인
 * @param {String} [sPath] 쿠키 경로
 * @return {$Cookie} $Cookie() 객체
 * @see $Cookie#set
 * @example
var cookie = $Cookie();
cookie.set("session_id1", "value1", 1);
cookie.set("session_id2", "value2", 1);
cookie.set("session_id3", "value3", 1);
  
 */
jindo.$Cookie.prototype.set = function(sName, sValue, nDays, sDomain, sPath) {
	var sExpire = "";
	
	if (typeof nDays == "number") {
		sExpire = ";expires="+(new Date((new Date()).getTime()+nDays*1000*60*60*24)).toGMTString();
	}
	if (typeof sDomain == "undefined") sDomain = "";
	if (typeof sPath == "undefined") sPath = "/";
	
	document.cookie = sName+"="+escape(sValue)+sExpire+"; path="+sPath+(sDomain?"; domain="+sDomain:"");
	
	return this;
};

/**

 * @description remove() 메서드는 쿠키에 설정된 쿠키 값을 제거한다. 만약 제거하려는 값에 유효 도메인과 유효 경로가 설정되어 있다면 정확히 지정해야 한다.
 * @param {String} sName 키 이름.
 * @param {String} [sDomain] 설정된 유효 도메인.
 * @param {String} [sPath] 설정된 유효 경로.
 * @return {$Cookie} $Cookie() 객체.
 * @see $Cookie#get
 * @see $Cookie#set
 * @example
var cookie = $Cookie();
cookie.set("session_id1", "value1", 1);
document.write (cookie.get ("session_id1"));

// 결과 :
// value1

cookie.remove("session_id1");
document.write (cookie.get ("session_id1"));

// 결과 :
// null
  
 */
jindo.$Cookie.prototype.remove = function(sName, sDomain, sPath) {
	if (this.get(sName) != null) this.set(sName, "", -1, sDomain, sPath);
	
	return this;
};
