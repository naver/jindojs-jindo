// @author hooriza
var LOG = (function() {
	
	var welParent = null;
	
	return function(vData) {
		
		var MAGIC_TAB = '{TAB' + Date.now() + '}';
		
		if (!welParent) {
			welParent = $Element('<ul>').css({
				fontFamily : 'Consolas, Monaco, Menlo, "DejaVu Sans Mono", 나눔고딕코딩, 나눔고딕, "맑은 고딕"',
				fontSize : '14px',
				listStyle : 'none',
				margin : 0,
				padding : '.5em',
				border : '1px solid #ddd',
				borderRadius : '5px',
				backgroundColor : '#f4f4f4'
			});
			$Element(document.body).prepend(welParent);
		}
		
		var indent = 0;
		var getIndent = function() {
			return Array(indent + 1).join(MAGIC_TAB);
		};
		
		var toString = function(v, no) {

			if ($Jindo.isHash(v) && !(v instanceof jindo.$Element)) {
				
				var ret = [ '{' ];

				indent++;
				for (var k in v) if (v.hasOwnProperty(k)) {
					ret.push(getIndent(no) + toString(k) + ' : ' + toString(v[k], true));
				}
				indent--;
				
				ret.push(getIndent(no) + '}');
				return ret.join('\n');
				
			} else if ($Jindo.isArray(v)) {
				
				var ret = [ '[' ];
				
				var body = [];
				var body_len = 0;
				
				indent++;
				for (var i = 0, len = v.length; i < len; i++) {
					var content = toString(v[i]) + (i < len - 1 ? ',' : '');
					body_len += content.length;
					body.push(getIndent(no) + content);
				}
				indent--;
				
				var has_long_body = body_len > 30;
				
				if (has_long_body) {
					ret = ret.concat(body);
					ret.push(getIndent(no) + ']');
				} else {
					ret.push(body.join(' ').replace(new RegExp(MAGIC_TAB, 'g'), ''));
					ret.push(']');
				}
				
				return ret.join(has_long_body ? '\n' : ' ').replace(new RegExp(MAGIC_TAB, 'g'), '    ');
				
			} else if ($Jindo.isString(v)) {
				return '"' + v.replace(/"/g, '\\"') + '"';
			} else {
				return String(v);
			}
			
		};
		
		//console.log(toString([ null, undefined, /abc/, 1,2 ,3, [ 333, 444, { hello : 'world', foo : [1,258347589347593475890347903479507345,5854489]}], document, document.body,
		//function() { return a + b; }]));
		
		/*
		var sStr;
		
		console.log(vData);
		
		if ($Jindo.isHash(vData) || $Jindo.isArray(vData) || $Jindo.isString(vData)) {
			sStr = $Json(vData).toString();
		} else {
			sStr = String(vData);	
		}
		*/
		
		var welNode = $Element('<li style="border-left:3px solid #ccc; padding-left:5px; margin:5px;">').text(toString(vData));
		welParent.append(welNode);
		
	};
	
})();