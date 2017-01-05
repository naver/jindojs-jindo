if(window.addEventListener){
	window.addEventListener("load",_inject_load,false);
}else{
	window.attachEvent("onload",_inject_load);
}
function _inject_load(){
	var div = document.createElement("DIV");
	div.id = "_inject_";
	var style = {
		"width" : "100px",
		"height" : "100px",
		"position" : "absolute",
		"top" : "0px",
		"left" : "0px",
		"zIndex" : "100",
		"backgroundColor" : "red",
		"cursor": "pointer",
		"color":"#FFFFFF",
		"fontWeight":"bold"
		
	};
	div.innerHTML = "클릭하면 서버에 정보가 전송됩니다.";
	for(var i in style){
		div.style[i] = style[i];
	}
	
	document.body.appendChild(div);
	div.onclick = function(){
		_data_send(true);
	}
}
function _data_send(msg){
	msg = !!msg;
	if(!_inject_key){
		alert("_inject_key가 없습니다.\n확인하시길 바랍니다.");
		return;
	}
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	script.type    = "text/javascript";
	script.src = "http://jindo.nhncorp.com/each/jindo.php?key="+_inject_key+"&data="+_oldToString(_inject_data)+"&msg="+msg;
	if (head) {
		head.appendChild(script);
	} else if (document.body) {
		document.body.appendChild(script);
	}
}
var _inject_data = {};
function _inject_(key){
	if(_inject_data[key]){
		_inject_data[key] += 1;
	}else{
		_inject_data[key] = 1;

	}
}


function _oldToString(oObj){
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