/**
{{title}}
 */

//-!jindo.$Agent start!-//
/**
{{constructor}}
 */
jindo.$Agent = function() {
	
	var cl = arguments.callee;
	var cc = cl._cached;

	if (cc) return cc;
	if (!(this instanceof cl)) return new cl;
	if (!cc) cl._cached = this;

	this._navigator = navigator;
}
//-!jindo.$Agent end!-//

//-!jindo.$Agent.prototype.navigator start!-//
/**
{{navigator}}
 */
jindo.$Agent.prototype.navigator = function() {
	
	var info = new Object;
	var ver  = -1;
	var nativeVersion = -1;
	var u    = this._navigator.userAgent;
	var v    = this._navigator.vendor || "";

	function f(s,h){ return ((h||"").indexOf(s) > -1) };

	info.getName = function(){
		var name = "";
		for(x in info){
			if(typeof info[x] == "boolean" && info[x]&&info.hasOwnProperty(x))
				name = x;
		}
		return name;
	}

	info.webkit		= f("WebKit",u);
	info.opera     = (typeof window.opera != "undefined") || f("Opera",u);
	info.ie        = !info.opera && f("MSIE",u);
	info.chrome    = info.webkit && f("Chrome",u);
	info.safari    = info.webkit && !info.chrome && f("Apple",v);
	info.firefox   = f("Firefox",u);
	info.mozilla   = f("Gecko",u) && !info.safari && !info.chrome && !info.firefox;
	info.camino    = f("Camino",v);
	info.netscape  = f("Netscape",u);
	info.omniweb   = f("OmniWeb",u);
	info.icab      = f("iCab",v);
	info.konqueror = f("KDE",v);

	info.mobile	   = (f("Mobile",u)||f("Android",u)||f("Nokia",u)||f("webOS",u)||f("Opera Mini",u)||f("BlackBerry",u)||(f("Windows",u)&&f("PPC",u))||f("Smartphone",u)||f("IEMobile",u))&&!f("iPad",u);
	info.msafari   = (!f("IEMobile",u) && f("Mobile",u))||(f("iPad",u)&&f("Safari",u));
	info.mopera    = f("Opera Mini",u);
	info.mie       = f("PPC",u)||f("Smartphone",u)||f("IEMobile",u);

	try {
		
		if (info.ie) {
			ver = u.match(/(?:MSIE) ([0-9.]+)/)[1];
			if (u.match(/(?:Trident)\/([0-9.]+)/)){
				var nTridentNum = parseInt(RegExp.$1,10);
				if(nTridentNum > 3){
					nativeVersion = nTridentNum + 4;	
				}
			}
		} else if (info.safari||info.msafari) {
			
			ver = parseFloat(u.match(/Safari\/([0-9.]+)/)[1]);
			if (ver == 100) {
				ver = 1.1;
			} else {
				if(u.match(/Version\/([0-9.]+)/)){
					ver = RegExp.$1;
				}else{
					ver = [1.0,1.2,-1,1.3,2.0,3.0][Math.floor(ver/100)];	
					
				}
			}
		} else if(info.mopera){
			ver = u.match(/(?:Opera\sMini)\/([0-9.]+)/)[1];
		} else if (info.firefox||info.opera||info.omniweb) {
			ver = u.match(/(?:Firefox|Opera|OmniWeb)\/([0-9.]+)/)[1];
		} else if (info.mozilla) {
			ver = u.match(/rv:([0-9.]+)/)[1];
		} else if (info.icab) {
			ver = u.match(/iCab[ \/]([0-9.]+)/)[1];
		} else if (info.chrome) {
			ver = u.match(/Chrome[ \/]([0-9.]+)/)[1];
		}

		info.version = parseFloat(ver);
		info.nativeVersion = parseFloat(nativeVersion);
		if (isNaN(info.version)) info.version = -1;
	} catch(e) {
		info.version = -1;
	}

	this.navigator = function() {
		return info;
	};

	return info;
};
//-!jindo.$Agent.prototype.navigator end!-//

//-!jindo.$Agent.prototype.os start!-//
/**
{{os}}
 */
jindo.$Agent.prototype.os = function() {
	
	var info = new Object;
	var u    = this._navigator.userAgent;
	var p    = this._navigator.platform;
	var f    = function(s,h){ return (h.indexOf(s) > -1) };

	info.getName = function(){
		var name = "";
		for(x in info){

			if(typeof info[x] == "boolean" && info[x]&&info.hasOwnProperty(x))
				name = x;
		}
		return name;
	}

	info.win     = f("Win",p)
	info.mac     = f("Mac",p);
	info.linux   = f("Linux",p);
	info.win2000 = info.win && (f("NT 5.0",u) || f("2000",u));
	info.winxp   = info.win && f("NT 5.1",u);
	info.xpsp2   = info.winxp && f("SV1",u);
	info.vista   = info.win && f("NT 6.0",u);
	info.win7  = info.win && f("NT 6.1",u);
	info.ipad = f("iPad",u);
	info.iphone = f("iPhone",u) && !info.ipad;
	info.android = f("Android",u);
	info.nokia =  f("Nokia",u);
	info.webos = f("webOS",u);
	info.blackberry = f("BlackBerry",u);
	info.mwin = f("PPC",u)||f("Smartphone",u)||f("IEMobile",u);


	this.os = function() {
		return info;
	};

	return info;
};
//-!jindo.$Agent.prototype.os end!-//

//-!jindo.$Agent.prototype.flash start!-//
/**
{{flash}}
 */
jindo.$Agent.prototype.flash = function() {
	
	var info = new Object;
	var p    = this._navigator.plugins;
	var m    = this._navigator.mimeTypes;
	var f    = null;

	info.installed = false;
	info.version   = -1;

	if (typeof p != "undefined" && p.length) {
		f = p["Shockwave Flash"];
		if (f) {
			info.installed = true;
			if (f.description) {
				info.version = parseFloat(f.description.match(/[0-9.]+/)[0]);
			}
		}

		if (p["Shockwave Flash 2.0"]) {
			info.installed = true;
			info.version   = 2;
		}
	} else if (typeof m != "undefined" && m.length) {
		f = m["application/x-shockwave-flash"];
		info.installed = (f && f.enabledPlugin);
	} else {
		for(var i=10; i > 1; i--) {
			try {
				f = new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+i);
				info.installed = true;
				info.version   = i;
				break;
			} catch(e) {}
		}
	}

	this.flash = function() {
		return info;
	};
    /*
    {{flash_1}}
     */
	this.info = this.flash;

	return info;
};
//-!jindo.$Agent.prototype.flash end!-//

//-!jindo.$Agent.prototype.silverlight start!-//
/**
{{silverlight}}
 */
jindo.$Agent.prototype.silverlight = function() {
	
	var info = new Object;
	var p    = this._navigator.plugins;
	var s    = null;

	info.installed = false;
	info.version   = -1;

	if (typeof p != "undefined" && p.length) {
		s = p["Silverlight Plug-In"];
		if (s) {
			info.installed = true;
			info.version = parseInt(s.description.split(".")[0],10);
			if (s.description == "1.0.30226.2") info.version = 2;
		}
	} else {
		try {
			s = new ActiveXObject("AgControl.AgControl");
			info.installed = true;
			if(s.isVersionSupported("3.0")){
				info.version = 3;
			}else if (s.isVersionSupported("2.0")) {
				info.version = 2;
			} else if (s.isVersionSupported("1.0")) {
				info.version = 1;
			}
		} catch(e) {}
	}

	this.silverlight = function() {
		return info;
	};

	return info;
};
//-!jindo.$Agent.prototype.silverlight end!-//
