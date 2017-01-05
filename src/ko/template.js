/**
 
 * @fileOverview $Template의 생성자 및 메서드를 정의한 파일
 * @name template.js
 * @author Kim, Taegon
  
 */

/**
 
 * @class $Template() 객체를 사용하면 템플릿을 해석하여 템플릿에 동적으로 데이터를 적용할 수 있다.
 * @constructor
 * @description $Template() 객체를 생성한다.$Template() 객체를 생성할 때 생성자의 파라미터로 3가지 종류의 값을 입력할 수 있다. 각 종류에 따라 동작하는 방식은 다음과 같다.<br>
 <ul>
	<li>파라미터가 문자열이면 두 가지 방식으로 동작한다.
		<ul>
			<li>문자열이 HTML 요소의 id라면 HTML 요소의 innerHTML을 템플릿으로 사용한다.</li>
			<li>만약 일반 문자열이라면 문자열 자체를 템플릿으로 사용한다.</li>
		</ul>
	</li>
	<li>파라미터가 HTML 요소이면 TEXTAREA와 SCRIPT 요소만 사용할 수 있다.
		<ul>
			<li>HTML 요소가 SCRIPT 요소인 경우 type 속성은 반드시 "text/template"으로 지정해야 한다.</li>
			<li>HTML 요소의 value 값을 템플릿으로 사용하며, value 값이 없을 경우 HTML 요소의 innerHTML을 템플릿으로 사용한다.</li>
		</ul>
	</li>
	<li>파라미터가 $Template() 객체면 전달된 파라미터를 그대로 반환하며 파라미터를 생략하면 빈 문자열("")을 템플릿으로 사용한다.</li>
</ul>
 * @param {Variant} vTemplate 템플릿으로 사용할 문자열(String), HTML 요소(Element), 혹은 $Template() 객체.
 * @example
// 파라미터가 일반 문자열인 경우
var tpl = $Template("{=service} : {=url}");

 * @example
<textarea id="tpl1">
{=service} : {=url}
&lt;/textarea&gt;

// 같은 TEXTAREA 요소를 템플릿으로 사용한다
var template1 = $Template("tpl1");		// 파라미터가 HTML 요소의 ID
var template2 = $Template($("tpl1"));	// 파라미터가 TEXTAREA 요소인 경우
</script>

 * @example
<script type="text/template" id="tpl2">
{=service} : {=url}
</script>

// 같은 SCRIPT 요소를 템플릿으로 사용한다
var template1 = $Template("tpl2");		// 파라미터가 HTML 요소의 ID
var template2 = $Template($("tpl2"));	// 파라미터가가 SCRIPT 요소인 경우
  
 */
jindo.$Template = function(str) {
    var obj = null, tag = "";
    var cl  = arguments.callee;

    if (str instanceof cl) return str;
    if (!(this instanceof cl)) return new cl(str);

    if(typeof str == "undefined") {
		str = "";
	}else if( (obj=document.getElementById(str)||str) && obj.tagName && (tag=obj.tagName.toUpperCase()) && (tag == "TEXTAREA" || (tag == "SCRIPT" && obj.getAttribute("type") == "text/template")) ) {
        str = (obj.value||obj.innerHTML).replace(/^\s+|\s+$/g,"");
    }

    this._str = str+"";
}
jindo.$Template.splitter = /(?!\\)[\{\}]/g;
jindo.$Template.pattern  = /^(?:if (.+)|elseif (.+)|for (?:(.+)\:)?(.+) in (.+)|(else)|\/(if|for)|=(.+)|js (.+)|set (.+))$/;

 /**

  
 */
jindo.$Template.prototype.process = function(data) {
	var key = "\x01";
	var leftBrace = "\x02";
	var rightBrace = "\x03";
    var tpl = (" "+this._str+" ").replace(/\\{/g,leftBrace).replace(/\\}/g,rightBrace).replace(/(?!\\)\}\{/g, "}"+key+"{").split(jindo.$Template.splitter), i = tpl.length;
	
    var map = {'"':'\\"','\\':'\\\\','\n':'\\n','\r':'\\r','\t':'\\t','\f':'\\f'};
    var reg = [/(["'](?:(?:\\.)+|[^\\["']+)*["']|[a-zA-Z_][\w\.]*)/g, /[\n\r\t\f"\\]/g, /^\s+/, /\s+$/, /#/g];
    var cb  = [function(m){ return (m.substring(0,1)=='"' || m.substring(0,1)=='\''||m=='null')?m:"d."+m; }, function(m){return map[m]||m}, "", ""];
    var stm = [];
	var lev = 0;

	// remove " "
	tpl[0] = tpl[0].substr(1);
	tpl[i-1] = tpl[i-1].substr(0, tpl[i-1].length-1);

    // no pattern
    if(i<2) return tpl[0];
	
	tpl = jindo.$A(tpl).reverse().$value();
	var delete_info;
    while(i--) {
        if(i%2) {
            tpl[i] = tpl[i].replace(jindo.$Template.pattern, function(){
                var m = arguments;

				// set
				if (m[10]) {
					return m[10].replace(/(\w+)(?:\s*)=(?:\s*)(?:([a-zA-Z0-9_]+)|(.+))$/g, function(){
										var mm = arguments;
										var str = "d."+mm[1]+"=";
										if(mm[2]){
											str+="d."+mm[2];
										}else {
											str += mm[3].replace(   /(=(?:[a-zA-Z_][\w\.]*)+)/g,
                				                                           function(m){ return (m.substring(0,1)=='=')?"d."+m.replace('=','') : m; }
                                				                        );
										}
										return str;
								}) +	";"; 
								
				}
				// js 
				if(m[9]) {
					return 's[i++]=' + m[9].replace(   /(=(?:[a-zA-Z_][\w\.]*)+)/g,
                				                                           function(m){ return (m.substring(0,1)=='=')?"d."+m.replace('=','') : m; }
                                				                        )+';';
				}
                // variables
                if(m[8]) return 's[i++]= d.'+m[8]+';';

                // if
                if(m[1]) {
                    return 'if('+m[1].replace(reg[0],cb[0]).replace(/d\.(typeof) /,'$1 ').replace(/ d\.(instanceof) d\./,' $1 ')+'){';
                }

                // else if
                if(m[2]) return '}else if('+m[2].replace(reg[0],cb[0]).replace(/d\.(typeof) /,'$1 ').replace(/ d\.(instanceof) d\./,' $1 ')+'){';

                // for loop
                if(m[5]) {
					delete_info = m[4];
					var _aStr = [];
					_aStr.push('var t#=d.'+m[5]+'||{},p#=isArray(t#),i#=0;');
					_aStr.push('for(var x# in t#){');
					
					_aStr.push('if(!t#.hasOwnProperty(x#)){continue;}');
					_aStr.push('	if( (p# && isNaN(i#=parseInt(x#,10))) || (!p# && !t#.propertyIsEnumerable(x#)) ) continue;');
					_aStr.push('	d.'+m[4]+'=t#[x#];');
					_aStr.push(m[3]?'d.'+m[3]+'=p#?i#:x#;':'');
					return _aStr.join("").replace(reg[4], lev++ );
                }

                // else
                if(m[6]) return '}else{';

                // end if, end for
                if(m[7]) {
					if(m[7]=="for"){
						return "delete d."+delete_info+"; };";
					}else{
						return '};';	
					}
                    
                }

                return m[0];
            });
        }else if(tpl[i] == key) {
			tpl[i] = "";
        }else if(tpl[i]){
            tpl[i] = 's[i++]="'+tpl[i].replace(reg[1],cb[1])+'";';
        }
    }
	
	tpl = jindo.$A(tpl).reverse().$value().join('').replace(new RegExp(leftBrace,'g'),"{").replace(new RegExp(rightBrace,'g'),"}");
		
	var _aStr = [];
	_aStr.push('var s=[],i=0;');
	_aStr.push('function isArray(o){ return Object.prototype.toString.call(o) == "[object Array]" };');
	_aStr.push(tpl);
	_aStr.push('return s.join("");');
    tpl = eval("false||function(d){"+_aStr.join("")+"}");
	tpl = tpl(data); 
	//(new Function("d",_aStr.join("")))(data);
	
    return tpl;
};