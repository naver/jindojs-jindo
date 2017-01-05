/**
 * @fileOverview	에러 발생시 명시적인 에러메시지 표시
 */

Debug = {
	objectDepth : 3,
	logCallTrace : false,
	logServer : "http://ajaxui.nhndesign.com/docs/jindo/logCollect.php"
}

// console 객체가 없으면 firebug light 사용
if (typeof console=='undefined') {       
	document.write("<script type='text/javascript' src='http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js'></script>");
}

/**
 * 호출된 파라미터를 찍을때 타입별로 출력될 내용 결정
 * @param {Object} obj
 */
function toObjectString(obj){
	if(!obj){
		return "null";
	}else if (typeof obj == 'string'){
		return "'"+obj+"'";
	}else if (obj.toString && obj.toString() != "[object Object]"){
		return obj.toString();
	}else if (obj==window || obj==document){
		return obj;
	}else if (obj.tagName){
		return jindo.$Element(obj);
	}else{
		return Debug.toString(obj);
	}
	
}

/**
 * 함수를 try~catch 로 감싸고 에러시에 로크를 남기게 한다.
 * @param {Object} c
 * @param {Object} m
 * @param {Object} func
 */
function wrapDebug(c,m,func){
	var preStr = ['var params = "";\n',
						'for(var i=0;i <arguments.length; i++){\n',
						'\tparams+= toObjectString(arguments[i]);\n',
						'\tif(i<arguments.length-1)params+=",";\n',
						'}\n'
						];
	var fn = (' '+func).replace(/\)\s*\{/,') {\n try {');
	fn += 'catch (wraperr) { \n';
	fn += preStr.join("");
	fn += 'var errMsg = "Error Occured at \\"' + c + '.' + m + '("+params+")\\""+(wraperr.lineNumber?(" line "+wraperr.lineNumber):"")+" : \\"["+wraperr.name+"] "+ wraperr.message+"\\"\\n";\n';
	fn += 'var errFrom = "from \\n"+arguments.callee.caller;\n ';
	fn += 'console.log(errMsg+errFrom);\n';
	fn += 'if(Debug.logServer){\n';
	fn += ' errMsg = "Jindo "+jindo.$Jindo().version+" on \\"" +getOsName()+"/"+ getBrowserName()+" "+jindo.$Agent().navigator().version+"\\" "+errMsg;\n';
	fn += '\tvar ajax = jindo.$Ajax(Debug.logServer,{"timeout":1,"type":"jsonp","method":"post"});\n ';
	fn += '\tajax.request({log:encodeURIComponent(errMsg)});\n}\n';
	fn += '\tthrow wraperr;\n}';
	fn += 'finally{if(Debug.logCallTrace) console.log("' + c + '.' + m + '("+params+") called");\n}}';
		
	var f = 'jindo.'+c+'.prototype["'+m+'"] = '+fn+" ;";
		
	try {
		eval(f);
	}catch(e){		
		console.log(f);
	}
}

/**
 * 브라우저명 얻기
 */
function getBrowserName(){
	var info = jindo.$Agent().navigator();
	var name = "";
	for(x in info){
		if(typeof info[x] == "boolean" && info[x] && info.hasOwnProperty(x))
			name = x;			
	}
	return name;		
}

/**
 * OS명 얻기
 */
function getOsName(){	
	var info = jindo.$Agent().os();
	var name = "";
	for(x in info){
		if(typeof info[x] == "boolean" && info[x] && info.hasOwnProperty(x))
			name = x;			
	}
	return name;		
}

/**
 * 순환참조하는 객체를 toString()할때 무한루프 버그 수정된 버전
 */
Debug.toString = function( obj ) {
	var func = {
		$ : function($, parents) {
			if (typeof $ == "undefined") return '""';
			if (typeof $ == "boolean") return $?"true":"false";
			if (typeof $ == "string") return this.s($);
			if (typeof $ == "number") return $;
			if ($ instanceof Array) return this.a($);
			if ($ instanceof Object) return this.o($, parents);
		},
		s : function(s) {
			var e = {'"':'\\"',"\\":"\\\\","\n":"\\n","\r":"\\r","\t":"\\t"};
			var c = function(m){ return (typeof e[m] != "undefined")?e[m]:m };
			return '"'+s.replace(/[\\"'\n\r\t]/g, c)+'"';
		},
		a : function(a) {
			var s = "[",c = "",n=a.length;
			for(var i=0; i < n; i++) {
				if (typeof a[i] == "function") continue;
				s += c+this.$(a[i]);
				if (!c) c = ",";
			}
			return s+"]";
		},
		o : function(o, parent) {
			var parents = parent || [];
			parents[parents.length] = o;
			if(parents.length>Debug.objectDepth) return "{[More Objects...]}";
			var s = "{",c = "";
			for(var x in o) {
				if(o.hasOwnProperty(x)){
					if (typeof o[x] == "function") continue;
					
					if(o[x]==window){
						s+= c+this.s(x)+": [Object window]";
					}else if(o[x]==document){
						s+= c+this.s(x)+": [Object document]";
					}else if(parents.indexOf(o[x])>-1){
						s+= c+this.s(x)+": [Object "+o[x]+"]";
					}else{
						s += c+this.s(x)+":"+this.$(o[x], parents);
					}
						
					if (!c) c = ",";
				}
			}
			return s+"}";
		}
	}
	return func.$(obj);
};

/**
 * jindo 안에 있는 객체들의 함수를 찾아서 try~catch로 감싼다.
 */
for (prop in jindo) {
	if(jindo.hasOwnProperty(prop)){
		var clazz = jindo[prop].prototype;
		for (method in clazz) {
			if(prop=="$ElementList" && !(method in ["get","getFirst","getLast"])) continue;
			//console.log(prop+":"+method+" - "+(typeof clazz[method]));
			if (typeof clazz[method] == 'function') {
				wrapDebug(prop,method,clazz[method]);
			}
		}
	}
}