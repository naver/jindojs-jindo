/**
 
 * @fileOverview A file to define the constructor and methods of $Template
 * @name template.js
  
 */

/**
 
 * Creates the $Template object.
 * @class The $Template class interprets a template and dynamically inserts characters into a template string.
 * @constructor
 * @author Kim, Taegon
 *
 * @param {String | HTML Element | $Template} str
 * <br>
 * A string, an HTML Element, or $Template can be specified as a parameter.<br>
 * <br>
 * It a parameter is a string, either of below operations are processed.<br>
 * If a string is the id of an HTML Element, innerHTML of the HTML Elements is used as a template.<br>
 * If it is a string, the string itself is used as a template.<br>
 * <br>
 * If a parameter is an HTML Element, only EXTAREA and SCRIPT can be used.<br>
 * The string of the HTML Element value specified in value is used as a template. If any value is not specified in value, innerHTML of HTML Elements is used as a template.<br>
 * <br>
 * If a parameter is $Template, the passed parameter is returned without any changes. If a parameter is omitted, "" is used as a template.
 * @return {$Template} Returns the created $Template object.
 *
 * @remark If a parameter is SCRIPT, type must be specified as "text/template."
 *
 * @example
// If a parameter is a string
var tpl = $Template("{=service} : {=url}");
 *
 * @example
<textarea id="tpl1">
{=service} : {=url}
&lt;/textarea&gt;

// Uses the same TEXTAREA element as a template.
var template1 = $Template("tpl1");		// If a parameter is the id of an HTML Element.
var template2 = $Template($("tpl1"));	// If a parameter is a TEXTAREA Element.
</script>
 *
 * @example
<script type="text/template" id="tpl2">
{=service} : {=url}
</script>

// Using the same SCRIPT element as a template.
var template1 = $Template("tpl2");		// If a parameter is the id of an HTML Elements.
var template2 = $Template($("tpl2"));	// If a parameter is a SCRIPT element.
  
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
 
 * Creates a new string by interpreting a template and applying the data.<br>
 * <br>
 * When interpreting a template and<br>
 * if patterns exist within a template, the way to interpret a template differs depending on patterns. For how to interpret templates, see the example.<br>
 * if no patterns exist within a template, it is handled by replacing a string.

 * @param {Object} data An object with data that is to be contained in a template.<br>
 * The data area that will be applied to a template can be searched by the property name of an object.
 * @return {String} Returns a new string by interpreting a template and applying the data.
 *
 * @example
// Replaces a string.
// Replaces the value of {=value}.
var tpl  = $Template("Value1 : {=val1}, Value2 : {=val2}")
var data = { val1: "first value", val2: "second value" };

document.write( tpl.process(data) );

// Result
// Value1 : first value, Value2 : second value

 * @example
// if/elseif/else: conditional statement
// Processes conditional statements when interpreting a template.
var tpl= $Template("{if num >= 7} equal to or greater than 7.{elseif num <= 5} equal to or less than 5.{else} else 6?{/if}");
var data = { num: 5 };

document.write( tpl.process(data) );

// Result
// equal to or less than 5

 * @example
// set: Uses a temporary variable.
// If val=1 is set, {=val} is replaced with 1.
var tpl  = $Template("{set val3=val1}Value1 : {=val1}, Value2 : {=val2}, Value3 : {=val3}")
var data = { val1: "first value", val2: "second value" };

document.write( tpl.process(data) );

// Result
// Value1: first value, Value2 : second value, Value3 : first value

 * @example
// js: Uses JavaScript.
// Executes JavaScript when interpreting a template.
var tpl  = $Template("Value1 : {js $S(=val1).bytes()}, Value2 : {=val2}")
var data = { val1: "first value", val2: "second value" };

document.write( tpl.process(data) );

// Result
// Value1: 11, Value2: second value

 * @example
// for in: loop statement (not using indexes)
var tpl  = $Template("<h1>Portal Site</h1>\n<ul>{for site in portals}\n<li><a href='{=site.url}'>{=site.name}</a></li>{/for}\n</ul>");
var data = { portals: [
	{ name: "Naver", url : "http://www.naver.com" },
	{ name: "Daum",  url : "http://www.daum.net" },
	{ name: "Yahoo",  url : "http://www.yahoo.co.kr" }
]};

document.write( tpl.process(data) );

// Result
//<h1>Portal Site</h1>
//<ul>
//<li><a href='http://www.naver.com'>Naver</a></li>
//<li><a href='http://www.daum.net'>Daum</a></li>
//<li><a href='http://www.yahoo.co.kr'>Yahoo</a></li>
//</ul>

 * @example
// for: loop statement (using indexes)
var tpl  = $Template("{for num:word in numbers}{=word}({=num}){/for}");
var data = { numbers: ["zero", "one", "two", "three"] };

document.write( tpl.process(data) );

// Result
// zero(0) one(1) two(2) three(3) 
  
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