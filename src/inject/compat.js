/**
{{title}}
 */
(function(){
	var defined = function(arg){ return typeof arg != "undefined" };

	if(!defined(jindo.$.call)) {
		Function.prototype.call = function(thisObject) {
			var a = new Array;

			for(var i=0; i < arguments.length-1; i++){a[i] = arguments[i+1]};

			return this.apply(thisObject, a);
		};
	}

	if (!defined(jindo.$.apply)) {
		Function.prototype.apply = function(thisObject, args) {
			var r, n = "__nhn_tmp_apply__", s = "";

			if (!defined(thisObject) || !thisObject) thisObject = window;
			if (!defined(args) || !(args instanceof Array)) args = new Array;

			thisObject[n] = this;

			switch(args.length) {
				case 0: r = thisObject[n](); break;
				case 1: r = thisObject[n](args[0]); break;
				case 2: r = thisObject[n](args[0], args[1]); break;
				case 3: r = thisObject[n](args[0], args[1], args[2]); break;
				default:
					for(var i=1; i < args.length; i++){s += ",args["+i+"]"};
					r = eval("thisObject."+n+"(args[0]"+s+")");
			}

			delete thisObject[n];

			return r;
		};
	}

	if (!defined(jindo.$A)) return;

	jindo.$A.prototype.pop = function() {
		var r,a = this._array;
		if (defined(a.pop)) return a.pop();
		if (a.length < 2) {
			r = a[0];
			this._array = new Array;
			return r;
		}

		var na = new Array;
		r  = a[a.length-1];
		for(var i=0; i < a.length-1; i++){na[i] = a[i]};
		this._array = na;

		return r;
	};

	jindo.$A.prototype.push = function() {
		var a = this._array;
		var args = jindo.$A(arguments).toArray();

		if (defined(a.push)) return a.push.apply(a, args);

		for(var i=0; i < args; i++){a[a.length] = args[i]};

		return a.length;
	};

	jindo.$A.prototype.shift = function() {
		var r,a = this._array;

		if (defined(a.shift)) return a.shift();
		if (a.length < 2) {
			r = a[0];
			this._array = new Array;
			return r;
		}

		var na = new Array;
		r = a[a.length - 1];
		for(var i=1; i < a.length; i++){na[i-1] = a[i]};
		this._array = na;

		return r;
	};

	jindo.$A.prototype.splice = function(index, howMany) {
		var a = this._array;
		var args = jindo.$A(arguments);

		if (defined(a.splice)) return jindo.$A(a.splice.apply(a, args.toArray()));
		args.shift(); args.shift(); args = args.toArray();

		var head = a.slice(0,index);
		var tail = a.slice(index+howMany);

		this._array = head.concat(args).concat(tail);

		return this;
	};
})();

/**
{{title}}
 */
(function(){
	var defined = function(arg){ return typeof arg != "undefined" };

	if (defined(jindo.$A) && defined(jindo.$A.prototype.unshift)) {
		jindo.$A.prototype.unshift = function() {
			var a  = this._array;
			var args = jindo.$A(arguments).$value();

			if (defined(a.unshift)) return a.unshift.apply(a, args);

			this._array = na.concat(args);

			return this;
		}
	}
})();