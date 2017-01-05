/**
 {{title}}
 */

//-!jindo.$Json start(jindo.$Json._oldMakeJSON)!-//
/**
 {{constructor}}
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
//-!jindo.$Json end!-//
/*
{{sign_oldMakeJSON}}
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
//-!jindo.$Json._oldMakeJSON.hidden start!-//
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
//-!jindo.$Json._oldMakeJSON.hidden end!-//

//-!jindo.$Json.fromXML start!-//
/**
  {{fromXML}}
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
	  {{fromXML_1}}
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
//-!jindo.$Json.fromXML end!-//

//-!jindo.$Json.prototype.get start!-//
/**
 {{get}}
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
//-!jindo.$Json.prototype.get end!-//

//-!jindo.$Json.prototype.toString start(jindo.$Json._oldToString)!-//
/**
 {{toString}} 
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
//-!jindo.$Json.prototype.toString end!-//

//-!jindo.$Json._oldToString.hidden start!-//
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
//-!jindo.$Json._oldToString.hidden end!-//

//-!jindo.$Json.prototype.toXML start!-//
/**
 {{toXML}}
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
//-!jindo.$Json.prototype.toXML end!-//

//-!jindo.$Json.prototype.toObject start!-//
/**
 {{toObject}}
 */
jindo.$Json.prototype.toObject = function() {
	
	return this._object;
};
//-!jindo.$Json.prototype.toObject end!-//

//-!jindo.$Json.prototype.compare start(jindo.$Json._oldToString,jindo.$Json.prototype.toObject,jindo.$Json.prototype.toString)!-//
/**
 {{compare}}
 */
jindo.$Json.prototype.compare = function(oData){
	
	return jindo.$Json._oldToString(this._object).toString() == jindo.$Json._oldToString(jindo.$Json(oData).toObject()).toString();
}
//-!jindo.$Json.prototype.compare end!-//

//-!jindo.$Json.prototype.$value start(jindo.$Json.prototype.toObject)!-//
/**
 {{sign_value}}
 */
jindo.$Json.prototype.$value = jindo.$Json.prototype.toObject;
//-!jindo.$Json.prototype.$value end!-//

