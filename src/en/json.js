/**
 
 * @fileOverview A file to define the constructor and methods of $Json
 * @name json.js
  
 */

/**
 
 * Returns the $Json object.
 * @class The $Json object provides a variety of methods to handle the JavaScript Object Notation (JSON).
 * @param {Object | String} sObject An object or a string that can be encoded by JSON
 * @return {$Json} Returns the $Json object in which parameters were encoded.
 * @remark XML  To create the $Json object by using a string in XML format, use the $Json#fromXML method.
 * @example
var oStr = $Json ('{ zoo: "myFirstZoo", tiger: 3, zebra: 2}');

var d = {name : 'nhn', location: 'Bundang-gu'}
var oObj = $Json (d);

 * @constructor
 * @author Kim, Taegon       
  
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

native json is not used as its parsing performance is inadequate.    
  
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
  
 * The fromXML method encodes an XML string as the $Json object.
 * @param {String} sXML The XML format string to be encoded by the $Json object
 * @returns {$Json} Returns the $Json object.
 * @remark Tags that have attributes and CDATA are encoded as the attributes and values of '$cdata.'
 * @example
var j1 = $Json.fromXML('<data>only string</data>');

// Result:
// {"data":"only string"}

var j2 = $Json.fromXML('<data><id>Faqh%$</id><str attr="123">string value</str></data>');

// Result:
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
	  
$0: All
$1: Tag Name
$2: Attribute String
$3: Closed Tag
$4: CDATA Body Value
$5: Other Body Values 
  
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
 
 *  The get method returns the value of the $Json object corresponding to a path.
 * @param {String} sPath A path string
 * @return {Array} Returns an array in which elements has values corresponding to a specified path.
 * @example
var j = $Json.fromXML('<data><id>Faqh%$</id><str attr="123">string value</str></data>');
var r = j.get ("/data/id");

// Result:
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
 
 * The toString method returns the $Json object as a JSON string.
 * @return {String} Returns a JSON string.
 * @example
var j = $Json({foo:1, bar: 31});
document.write (j.toString());
document.write (j);

// Result:
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
 
 * The toXML method returns the $Json object in an XML format string.
 * @return {String} Returns an XML format string.
 * @example
var json = $Json({foo:1, bar: 31});
json.toXML();

// Result:
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
 
 * The toObject method returns the original JSON data object of the $Json object.
 * @return {Object} Returns the original data object.
 * @example
var json = $Json({foo:1, bar: 31});
json.toObject();

// Result:
// {foo: 1, bar: 31}
  
 */
jindo.$Json.prototype.toObject = function() {
	return this._object;
};

/**
 
 * The compare method compares the values of the Json object (available since verions 1.4.4).
 * @return {Boolean} Returns a Boolean value.
 * @example
$Json({foo:1, bar: 31}).compare({foo:1, bar: 31});

// Result:
// true

$Json({foo:1, bar: 31}).compare({foo:1, bar: 1});

// Result:
// false
  
 */
jindo.$Json.prototype.compare = function(oData){
	return jindo.$Json._oldToString(this._object).toString() == jindo.$Json._oldToString(jindo.$Json(oData).$value()).toString();
}

/**
 
 * The $value method is an Alias of $Json.toObject.
 * @return {Object} Returns the original data object.
  
 */
jindo.$Json.prototype.$value = jindo.$Json.prototype.toObject;

