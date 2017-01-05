/**
 
 * @fileOverview $Json의 생성자 및 메서드를 정의한 파일
 * @name json.js
 * @author Kim, Taegon
  
 */

/**
 
 * @class $Json 객체는 JSON(JavaScript Object Notation)을 다루기 위한 다양한 기능을 제공한다. 생성자에 파라미터로 객체나 문자열을 입력한다. XML 형태의 문자열로 $Json() 객체를 생성하려면 fromXML() 메서드를 사용한다.
 * @constructor
 * @description $Json() 객체를 생성한다.
 * @param {Variant} vValue 객체(Object), 혹은 JSON 형식으로 인코딩 가능한 문자열(String).
 * @return {$Json} 인수를 인코딩한 $Json() 객체.
 * @see $Json#fromXML
 * @see <a href="http://www.json.org/json-ko.html">json.org</a>
 * @example
var oStr = $Json ('{ zoo: "myFirstZoo", tiger: 3, zebra: 2}');

var d = {name : 'nhn', location: 'Bundang-gu'}
var oObj = $Json (d);
  
 */
jindo.$Json = function (sObject) {
	var cl = arguments.callee;
	if (typeof sObject == "undefined") sObject = {};
	if (sObject instanceof cl) return sObject;
	if (!(this instanceof cl)) return new cl(sObject);

	if (typeof sObject == "string") {
		this._object = jindo.$Json._oldMakeJSON(sObject);
	}else{
		this._object = sObject;
	}
}
/*

native json의 parse의 성능이 보다 좋지 못해 native json은 사용하지 않음.
  
jindo.$Json._makeJson = function(sObject){
	if (window.JSON&&window.JSON.parse) {
		jindo.$Json._makeJson = function(sObject){
			if (typeof sObject == "string") {
				try{
					return JSON.parse(sObject);
				}catch(e){
					return jindo.$Json._oldMakeJSON(sObject);
				}
			}
			return sObject;
		}
	}else{
		jindo.$Json._makeJson = function(sObject){
			if (typeof sObject == "string") {
				return jindo.$Json._oldMakeJSON(sObject);
			}
			return sObject;
		}
	}
	return jindo.$Json._makeJson(sObject);
}
*/
jindo.$Json._oldMakeJSON = function(sObject){
	try {
		if(/^(?:\s*)[\{\[]/.test(sObject)){
			sObject = eval("("+sObject+")");
		}else{
			sObject = sObject;
		}

	} catch(e) {
		sObject = {};
	}
	return sObject;
}
		


/**
  
 * @description fromXML() 메서드는 XML 형태의 문자열을 $Json() 객체로 인코딩한다. XML 형식의 문자열에 XML 요소가 속성을 포함하고 있을 경우 해당 요소의 정보에 해당하는 내용을 하위 객체로 표현한다. 이때 요소가 CDATA 값을 가질 경우 $cdata 속성으로 값을 저장한다.
 * @param {String} sXML XML 형태의 문자열.
 * @returns {$Json} $Json() 객체.
 * @example
var j1 = $Json.fromXML('<data>only string</data>');

// 결과 :
// {"data":"only string"}

var j2 = $Json.fromXML('<data><id>Faqh%$</id><str attr="123">string value</str></data>');

// 결과:
// {"data":{"id":"Faqh%$","str":{"attr":"123","$cdata":"string value"}}}
  
  */
jindo.$Json.fromXML = function(sXML) {
	var o  = {};
	var re = /\s*<(\/?[\w:\-]+)((?:\s+[\w:\-]+\s*=\s*(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'))*)\s*((?:\/>)|(?:><\/\1>|\s*))|\s*<!\[CDATA\[([\w\W]*?)\]\]>\s*|\s*>?([^<]*)/ig;
	var re2= /^[0-9]+(?:\.[0-9]+)?$/;
	var ec = {"&amp;":"&","&nbsp;":" ","&quot;":"\"","&lt;":"<","&gt;":">"};
	var fg = {tags:["/"],stack:[o]};
	var es = function(s){ 
		if (typeof s == "undefined") return "";
		return  s.replace(/&[a-z]+;/g, function(m){ return (typeof ec[m] == "string")?ec[m]:m; })
	};
	var at = function(s,c){s.replace(/([\w\:\-]+)\s*=\s*(?:"((?:\\"|[^"])*)"|'((?:\\'|[^'])*)')/g, function($0,$1,$2,$3){c[$1] = es(($2?$2.replace(/\\"/g,'"'):undefined)||($3?$3.replace(/\\'/g,"'"):undefined));}) };
	var em = function(o){
		for(var x in o){
			if (o.hasOwnProperty(x)) {
				if(Object.prototype[x])
					continue;
					return false;
			}
		};
		return true
	};
	/*
	  
$0 : 전체
$1 : 태그명
$2 : 속성문자열
$3 : 닫는태그
$4 : CDATA바디값
$5 : 그냥 바디값
  
	 */

	var cb = function($0,$1,$2,$3,$4,$5) {
		var cur, cdata = "";
		var idx = fg.stack.length - 1;
		
		if (typeof $1 == "string" && $1) {
			if ($1.substr(0,1) != "/") {
				var has_attr = (typeof $2 == "string" && $2);
				var closed   = (typeof $3 == "string" && $3);
				var newobj   = (!has_attr && closed)?"":{};

				cur = fg.stack[idx];
				
				if (typeof cur[$1] == "undefined") {
					cur[$1] = newobj; 
					cur = fg.stack[idx+1] = cur[$1];
				} else if (cur[$1] instanceof Array) {
					var len = cur[$1].length;
					cur[$1][len] = newobj;
					cur = fg.stack[idx+1] = cur[$1][len];  
				} else {
					cur[$1] = [cur[$1], newobj];
					cur = fg.stack[idx+1] = cur[$1][1];
				}
				
				if (has_attr) at($2,cur);

				fg.tags[idx+1] = $1;

				if (closed) {
					fg.tags.length--;
					fg.stack.length--;
				}
			} else {
				fg.tags.length--;
				fg.stack.length--;
			}
		} else if (typeof $4 == "string" && $4) {
			cdata = $4;
		} else if (typeof $5 == "string" && $5) {
			cdata = es($5);
		}
		
		if (cdata.replace(/^\s+/g, "").length > 0) {
			var par = fg.stack[idx-1];
			var tag = fg.tags[idx];

			if (re2.test(cdata)) {
				cdata = parseFloat(cdata);
			}else if (cdata == "true"){
				cdata = true;
			}else if(cdata == "false"){
				cdata = false;
			}
			
			if(typeof par =='undefined') return;
			
			if (par[tag] instanceof Array) {
				var o = par[tag];
				if (typeof o[o.length-1] == "object" && !em(o[o.length-1])) {
					o[o.length-1].$cdata = cdata;
					o[o.length-1].toString = function(){ return cdata; }
				} else {
					o[o.length-1] = cdata;
				}
			} else {
				if (typeof par[tag] == "object" && !em(par[tag])) {
					par[tag].$cdata = cdata;
					par[tag].toString = function(){ return cdata; }
				} else {
					par[tag] = cdata;
				}
			}
		}
	};
	
	sXML = sXML.replace(/<(\?|\!-)[^>]*>/g, "");
	sXML.replace(re, cb);
	
	return jindo.$Json(o);
};

/**
 
 * @description get() 메서드는 특정 경로(path)에 해당하는 $Json() 객체의 값을 반환한다.
 * @param {String} sPath 경로를 지정한 문자열
 * @return {Array} 지정된 경로에 해당하는 값을 원소로 가지는 배열.
 * @example
var j = $Json.fromXML('<data><id>Faqh%$</id><str attr="123">string value</str></data>');
var r = j.get ("/data/id");

// 결과 :
// [Faqh%$]
  
 */
jindo.$Json.prototype.get = function(sPath) {
	var o = this._object;
	var p = sPath.split("/");
	var re = /^([\w:\-]+)\[([0-9]+)\]$/;
	var stack = [[o]], cur = stack[0];
	var len = p.length, c_len, idx, buf, j, e;
	
	for(var i=0; i < len; i++) {
		if (p[i] == "." || p[i] == "") continue;
		if (p[i] == "..") {
			stack.length--;
		} else {
			buf = [];
			idx = -1;
			c_len = cur.length;
			
			if (c_len == 0) return [];
			if (re.test(p[i])) idx = +RegExp.$2;
			
			for(j=0; j < c_len; j++) {
				e = cur[j][p[i]];
				if (typeof e == "undefined") continue;
				if (e instanceof Array) {
					if (idx > -1) {
						if (idx < e.length) buf[buf.length] = e[idx];
					} else {
						buf = buf.concat(e);
					}
				} else if (idx == -1) {
					buf[buf.length] = e;
				}
			}
			
			stack[stack.length] = buf;
		}
		
		cur = stack[stack.length-1];
	}

	return cur;
};

/**
 
 * @function
 * @description toString() 메서드는 $Json() 객체를 JSON 문자열 형태로 반환한다.
 * @return {String} JSON 문자열.
 * @see $Json#toObject
 * @see $Json#toXML
 * @see <a href="http://www.json.org/json-ko.html">json.org</a>
 * @example
var j = $Json({foo:1, bar: 31});
document.write (j.toString());
document.write (j);

// 결과 :
// {"bar":31,"foo":1}{"bar":31,"foo":1}
   
 */
jindo.$Json.prototype.toString = function() {
	if (window.JSON&&window.JSON.stringify) {
		jindo.$Json.prototype.toString = function() {
			try{
				return window.JSON.stringify(this._object);
			}catch(e){
				return jindo.$Json._oldToString(this._object);
			}
		}
	}else{
		jindo.$Json.prototype.toString = function() {
			return jindo.$Json._oldToString(this._object);
		}
	}
	return this.toString();
};

jindo.$Json._oldToString = function(oObj){
	var func = {
		$ : function($) {
			if (typeof $ == "object" && $ == null) return 'null';
			if (typeof $ == "undefined") return '""';
			if (typeof $ == "boolean") return $?"true":"false";
			if (typeof $ == "string") return this.s($);
			if (typeof $ == "number") return $;
			if ($ instanceof Array) return this.a($);
			if ($ instanceof Object) return this.o($);
		},
		s : function(s) {
			var e = {'"':'\\"',"\\":"\\\\","\n":"\\n","\r":"\\r","\t":"\\t"};
			var c = function(m){ return (typeof e[m] != "undefined")?e[m]:m };
			return '"'+s.replace(/[\\"'\n\r\t]/g, c)+'"';
		},
		a : function(a) {
			// a = a.sort();
			var s = "[",c = "",n=a.length;
			for(var i=0; i < n; i++) {
				if (typeof a[i] == "function") continue;
				s += c+this.$(a[i]);
				if (!c) c = ",";
			}
			return s+"]";
		},
		o : function(o) {
			o = jindo.$H(o).ksort().$value();
			var s = "{",c = "";
			for(var x in o) {
				if (o.hasOwnProperty(x)) {
					if (typeof o[x] == "function") continue;
					s += c+this.s(x)+":"+this.$(o[x]);
					if (!c) c = ",";
				}
			}
			return s+"}";
		}
	}

	return func.$(oObj);
}

/**
 
 * @description toXML() 메서드는 $Json() 객체를 XML 형태의 문자열로 반환한다.
 * @return {String} XML 형태의 문자열.
 * @see $Json#toObject
 * @see $Json#toString
 * @example
var json = $Json({foo:1, bar: 31});
json.toXML();

// 결과 :
// <foo>1</foo><bar>31</bar>
  
 */
jindo.$Json.prototype.toXML = function() {
	var f = function($,tag) {
		var t = function(s,at) { return "<"+tag+(at||"")+">"+s+"</"+tag+">" };
		
		switch (typeof $) {
			case "undefined":
			case "null":
				return t("");
			case "number":
				return t($);
			case "string":
				if ($.indexOf("<") < 0){
					 return t($.replace(/&/g,"&amp;"));
				}else{
					return t("<![CDATA["+$+"]]>");
				}
			case "boolean":
				return t(String($));
			case "object":
				var ret = "";
				if ($ instanceof Array) {
					var len = $.length;
					for(var i=0; i < len; i++) { ret += f($[i],tag); };
				} else {
					var at = "";

					for(var x in $) {
						if ($.hasOwnProperty(x)) {
							if (x == "$cdata" || typeof $[x] == "function") continue;
							ret += f($[x], x);
						}
					}

					if (tag) ret = t(ret, at);
				}
				return ret;
		}
	};
	
	return f(this._object, "");
};

/**
 
 * @description toObject() 메서드는 $Json() 객체를 원래의 데이터 객체로 반환한다.
 * @return {Object} 원본 데이터 객체.
 * @see $Json#toObject
 * @see $Json#toString
 * @see $Json#toXML
 * @example
var json = $Json({foo:1, bar: 31});
json.toObject();

// 결과 :
// {foo: 1, bar: 31}
  
 */
jindo.$Json.prototype.toObject = function() {
	return this._object;
};

/**
 
 * @description compare() 메서드는 Json 객체끼리 값이 같은지 비교한다.
 * @param oData 비교할 Json 포맷 객체.
 * @return {Boolean} 비교 결과. 값이 같으면 true, 다르면 false를 반환한다.
 * @since  1.4.4 버전부터 사용 가능.
 * @example
$Json({foo:1, bar: 31}).compare({foo:1, bar: 31});

// 결과 :
// true

$Json({foo:1, bar: 31}).compare({foo:1, bar: 1});

// 결과 :
// false
  
 */
jindo.$Json.prototype.compare = function(oData){
	return jindo.$Json._oldToString(this._object).toString() == jindo.$Json._oldToString(jindo.$Json(oData).$value()).toString();
}

/**
 
 * @description $value() 메서드는 toObject() 메서드와 같이 원래의 데이터 객체를 반환한다.
 * @return {Object} 원본 데이터 객체.
 * @see $Json#toObject
  
 */
jindo.$Json.prototype.$value = jindo.$Json.prototype.toObject;

