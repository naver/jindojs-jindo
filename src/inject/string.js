/**
 {{title}}
 */

//-!jindo.$S start!-//
/**
 {{constructor}}
 */
jindo.$S = function(str) {
	
	var cl = arguments.callee;

	if (typeof str == "undefined") str = "";
	if (str instanceof cl) return str;
	if (!(this instanceof cl)) return new cl(str);

	this._str = str+"";
}
//-!jindo.$S end!-//

//-!jindo.$S.prototype.$value start!-//
/**
 {{sign_value}}
 */
jindo.$S.prototype.$value = function() {
	
	return this._str;
};
//-!jindo.$S.prototype.$value end!-//

//-!jindo.$S.prototype.toString start!-//
/**
 {{toString}}
 */
jindo.$S.prototype.toString = jindo.$S.prototype.$value;
//-!jindo.$S.prototype.toString end!-//

//-!jindo.$S.prototype.trim start!-//
/**
 {{trim}}
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
//-!jindo.$S.prototype.trim end!-//

//-!jindo.$S.prototype.escapeHTML start!-//
/**
 {{escapeHTML}}
 */
jindo.$S.prototype.escapeHTML = function() {
	
	var entities = {'"':'quot','&':'amp','<':'lt','>':'gt','\'':'#39'};
	var s = this._str.replace(/[<>&"']/g, function(m0){
		return entities[m0]?'&'+entities[m0]+';':m0;
	});
	return jindo.$S(s);
};
//-!jindo.$S.prototype.escapeHTML end!-//

//-!jindo.$S.prototype.stripTags start!-//
/**
 {{stripTags}}
 */
jindo.$S.prototype.stripTags = function() {
	
	return jindo.$S(this._str.replace(/<\/?(?:h[1-5]|[a-z]+(?:\:[a-z]+)?)[^>]*>/ig, ''));
};
//-!jindo.$S.prototype.stripTags end!-//

//-!jindo.$S.prototype.times start!-//
/**
 {{times}}
 */
jindo.$S.prototype.times = function(nTimes) {
	
	var buf = [];
	for(var i=0; i < nTimes; i++) {
		buf[buf.length] = this._str;
	}

	return jindo.$S(buf.join(''));
};
//-!jindo.$S.prototype.times end!-//

//-!jindo.$S.prototype.unescapeHTML start!-//
/**
 {{unescapeHTML}}
 */
jindo.$S.prototype.unescapeHTML = function() {
	
	var entities = {'quot':'"','amp':'&','lt':'<','gt':'>','#39':'\''};
	var s = this._str.replace(/&([a-z]+|#[0-9]+);/g, function(m0,m1){
		return entities[m1]?entities[m1]:m0;
	});
	return jindo.$S(s);
};
//-!jindo.$S.prototype.unescapeHTML end!-//

//-!jindo.$S.prototype.escape start!-//
/**
 {{escape}}
 */
jindo.$S.prototype.escape = function() {
	
	var s = this._str.replace(/([\u0080-\uFFFF]+)|[\n\r\t"'\\]/g, function(m0,m1,_){
		if(m1) return escape(m1).replace(/%/g,'\\');
		return (_={"\n":"\\n","\r":"\\r","\t":"\\t"})[m0]?_[m0]:"\\"+m0;
	});

	return jindo.$S(s);
};
//-!jindo.$S.prototype.escape end!-//

//-!jindo.$S.prototype.bytes start!-//
/**
 {{bytes}}
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
		 {{bytes_1}}
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
//-!jindo.$S.prototype.bytes end!-//

//-!jindo.$S.prototype.parseString start!-//
/**
 {{parseString}}
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
//-!jindo.$S.prototype.parseString end!-//

//-!jindo.$S.prototype.escapeRegex start!-//
/**
 {{escapeRegex}}
 */
jindo.$S.prototype.escapeRegex = function() {
	
	var s = this._str;
	var r = /([\?\.\*\+\-\/\(\)\{\}\[\]\:\!\^\$\\\|])/g;

	return jindo.$S(s.replace(r, "\\$1"));
};
//-!jindo.$S.prototype.escapeRegex end!-//

//-!jindo.$S.prototype.format start(jindo.$S.prototype.times)!-//
/**
 {{format}}
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

		if (ret.length < m3) pad = jindo.$S(m1||" ").times(m3 - ret.length)._str;
		(m2 == '-')?(ret+=pad):(ret=pad+ret);

		return ret;
	});

	return jindo.$S(s);
};
//-!jindo.$S.prototype.format end!-//
