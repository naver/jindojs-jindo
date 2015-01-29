//-!jindo.$Template.addEngine.default start(jindo.$Template)!-//
/**
 {{addEngine_default}}
 */
jindo.$Template.addEngine("default", function(str){

	var code = [];
	var parsed = false;
	
	function stripString(s) {
		return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
	}
	
	code.push('var $RET$ = [];');

	code.push('var $SCOPE$ = $ARG$ && typeof $ARG$ === "object" ? $ARG$ : {};');
	code.push('with ($SCOPE$) {');
	
	var key_num = 0;
	
	do {
		parsed = false;
	
		str = str.replace(/^[^{]+/, function(_) {
			parsed = code.push('$RET$.push("' + stripString(_) + '");');
			return '';
		});
		
		str = str.replace(/^{=([^}]+)}/, function(_, varname) {
			parsed = code.push('typeof '+ varname +' != "undefined" && $RET$.push(' + varname + ');');
			return '';
		});
		
		str = str.replace(/^{js\s+([^}]+)}/, function(_, syntax) {
			syntax = syntax.replace(/(=(?:[a-zA-Z_][\w\.]*)+)/g, function(m) {
				return m.replace('=', '');
			});

			parsed = code.push('$RET$.push(' + syntax + ');');
			return '';
		});
		
		str = str.replace(/^{(g)?set\s+([^=]+)=([^}]+)}/, function(_, at_g, key, val) {
			parsed = code.push((at_g ? 'var ' : '$SCOPE$.') +key+ '=' + val.replace(/\(=/g, '(') + ';');
			return '';
		});
		
		str = str.replace(/^{for\s+([^:}]+)(:([^\s]+))?\s+in\s+([^}]+)}/, function(_, key, _, val, obj) {
			
			if (!val) { val = key; key = '$NULL$' + key_num; }
			var key_str = '$I$' + key_num;
			var callback = '$CB$' + key_num;

			key_num++;

			code.push('(function(' + callback + ') {');

				code.push('if (jindo.$Jindo.isArray(' +obj+ ')) {');
					code.push('for (var ' +key_str+ ' = 0; ' +key_str+ ' < ' +obj+ '.length; ' +key_str+ '++) {');
						code.push(callback + '(' +key_str+ ', ' +obj+ '[' +key_str+ ']);');
					code.push('}');
				code.push('} else {');
					code.push('for (var ' +key_str+ ' in ' +obj+ ') if (' +obj+ '.hasOwnProperty(' +key_str+ ')) { ');
						code.push(callback + '(' +key_str+ ', ' +obj+ '[' +key_str+ ']);');
					code.push('}');
				code.push('}');

			code.push('})(function(' + key + ', ' + val + ') {');
			
			parsed = true;
			return '';
			
		});
		
		str = str.replace(/^{\/for}/, function(_) {
			parsed = code.push('});');
			return '';
		});
		
		str = str.replace(/^{(else)?if\s+([^}]+)}/, function(_, iselse, expr) {
			parsed = code.push((iselse ? '} else ' : '') + 'if (' + expr + ') {');
			return '';
		});
		
		str = str.replace(/^{else}/, function(_) {
			parsed = code.push('} else {');
			return '';
		});
		
		str = str.replace(/^{\/if}/, function(_) {
			parsed = code.push('}');
			return '';
		});
		
	} while(parsed);
	
	code.push('}');
	code.push('return $RET$.join("");');

	var r = new Function('$ARG$', code.join('\n').replace(/\r/g,''));
	return r;
});
//-!jindo.$Template.addEngine.default end!-//

//-!jindo.$Template.addEngine.micro start(jindo.$Template)!-//
/**
 {{addEngine_micro}}
 */
jindo.$Template.addEngine("micro", function(sTemplate){
	return new Function("obj",
		"var p=[],print=function(){p.push.apply(p,arguments);};" +
		"with(obj){p.push('" +
		sTemplate
			.replace(/[\r\t\n]/g, " ")
			.split("<%").join("\t")
			.replace(/((^|%>)[^\t]*)'/g, "$1\r")
			.replace(/\t=(.*?)%>/g, "',$1,'")
			.split("\t").join("');")
			.split("%>").join("p.push('")
			.split("\r").join("\\'") +
		"');}return p.join('');"
	);
});
//-!jindo.$Template.addEngine.micro end!-//

//-!jindo.$Template.addEngine.handlebars start(jindo.$Template)!-//
/**
 {{addEngine_handlebars}}
 */
jindo.$Template.addEngine("handlebars", function(sTemplate){
	if(typeof Handlebars == "undefined"){
		// The reason why '$Template#process' for second parameter, is because occur exception when process() method is called.
		throw new jindo.$Error(jindo.$Except.NOT_FOUND_HANDLEBARS, "$Template#process");
	}
	return Handlebars.compile(sTemplate);
});
//-!jindo.$Template.addEngine.handlebars end!-//

//-!jindo.$Template.addEngine.simple start(jindo.$Template)!-//
/**
 {{addEngine_simple}}
 */
jindo.$Template.addEngine("simple", function(sTemplate){
	return function(oData){
		return sTemplate.replace(/\{\{([^{}]*)\}\}/g, function(sMatchA, sMatchB){
			return (typeof oData[sMatchB] == "undefined") ? "" : oData[sMatchB];
		});
	};
});
//-!jindo.$Template.addEngine.simple end!-//