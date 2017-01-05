/**

 * @fileOverview A file to define the constructor and method of $Cookie
 * @name cookie.js
  
 */

/**

 * Creates the $Cookie object.
 * @class The $Cookie class adds, modifies, or deletes Cookie or gets a Cookie value.
 * @constructor
 * @return {$Cookie} The created $Cookie object
 * @author Kim, Taegon
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

 * The key method returns an array that has Cookie names as its elements.
 * @return {Array} An array that has Cookie names as its elements
 * @example
var cookie = $Cookie();
	cookie.set("session_id1", "value1", 1);
	cookie.set("session_id2", "value2", 1);
	cookie.set("session_id3", "value3", 1);

	document.write (cookie.keys ());
 *
 * // Result:
 * // session_id1, session_id2, session_id3
  
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

 * The get method gets the Cookie value that corresponds to the Cookie name. null is returns if no value exists.
 * @param {String} sName The Cookie name
 * @return {String} The Cookie value
 * @example
var cookie = $Cookie();
	cookie.set("session_id1", "value1", 1);
	document.write (cookie.get ("session_id1"));
 *
 * // Result:
 * // value1
 *
 	document.write (cookie.get ("session_id0"));
 *
 * // Result:
 * // null
  
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

 * The set method sets Cookie values.
 * @param {String} sName The Cookie name
 * @param {String} sValue The Cookie value
 * @param {Number} [nDays] Valid time. Set valid time by day. If time is omitted, Cookie is automatically deleted when a web browser is closed.
 * @param {String} [sDomain] The Cookie domain
 * @param {String} [sPath] The Cookie path
 * @return {$Cookie} The $Cookie object
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

 * Removes a Cookie value specified in a cookie name.
 * @param {String} sName The Cookie name
 * @param {String} sDomain The Cookie domain
 * @param {String} sPath The Cookie path
 * @return {$Cookie} The $Cookie object
 * @example
var cookie = $Cookie();
	cookie.set("session_id1", "value1", 1);
	document.write (cookie.get ("session_id1"));
 *
 * // Result:
 * // value1
 *
	cookie.remove("session_id1");
	document.write (cookie.get ("session_id1"));
 *
 * // Result:
 * // null
  
 */
jindo.$Cookie.prototype.remove = function(sName, sDomain, sPath) {
	if (this.get(sName) != null) this.set(sName, "", -1, sDomain, sPath);
	
	return this;
};
