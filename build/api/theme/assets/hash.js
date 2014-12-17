/**
 * @author hooriza
 *
 * Hash History
 */
jindo.Hash = jindo.$Class({
	
	$init : function(oOptions) {
		
		var self = this;
		var oAgent = jindo.$Agent().navigator();
		
		this._sAgent = 'etc';
		
		if (oAgent.ie) {
			this._sAgent = (oAgent.version < 8 || ('documentMode' in document && document.documentMode < 8)) ? 'ie8less' : 'ie8';
		} else if (oAgent.firefox) {
			this._sAgent = 'firefox';
		}
		
		this.option({ 'frameSrc' : 'hash.html' });
		
		this.option(oOptions || {});
		this.constructor._object = this;
		
		var bSupportHashChange = 'onhashchange' in window;
		
		if (this._sAgent == 'ie8less') {
			bSupportHashChange = false;
		}
		
		if (bSupportHashChange) {
			
			jindo.$Fn(this._onChangeHash, this).attach(window, 'hashchange');
			
		} else {
			
			if (this._sAgent == 'ie8less') {
				
				this._first = true;
				
				this._iframe = jindo.$('<iframe>');
				this._iframe.frameBorder = 0;
				this._iframe.src = this.option('frameSrc') + '?' + encodeURIComponent(this._getHash()) + this._getIFrameSrcPostfix();
				this._iframe.style.cssText = 'display:none'; // position:absolute; left:100px; top:0; width:800px; height:30px; z-index:999;';
				
				(function() {
					try{ document.body.insertBefore(self._iframe, document.body.firstChild); }
					catch(e) { setTimeout(arguments.callee, 100); }
				})();

				setInterval(function() {

					if (self._isWaitIFrame) {
						return;
					}
					
					var sHash = self._getHash();
					self._setIFrameSrc(sHash);
					
				}, 100);
	
				this._iframeHash = this._getHash();
				
			} else {
				
				this._orgHash = this._getHash();
				
				setInterval(function() {
					
					var sHash = self._getHash();
					if (self._orgHash == sHash) return;
	
					self._onChangeHash();
					self._orgHash = sHash;
					
				}, 100);
				
			}
			
		}
		
		/*
		setTimeout(function() {
			self._onChangeHash();
		}, 0);
		*/
		
	},
	
	_getIFrameSrcPostfix : function() {
		
		var sPostfix = '&nocache=' + new Date().getTime();
		var sDomain = this.option('domain');
		
		if (sDomain) {
			sPostfix += '&domain=' + sDomain;
		}
		
		return sPostfix;
		
	},
	
	_getHash : function() {
		var sHash = location.href.replace(/^[^#]*(?=#|$)/, '').substr(1);
		return this._iframe ? sHash : decodeURIComponent(sHash);
	},
	
	_onChangeHash : function() {
		this.fireEvent('change', { hash : this.get() });
	},

	_setIFrameSrc : function(sHash) {
		
		if (this._iframeHash == sHash || !this._iframe) {
			return;
		}
		
		var sEncodedHash = encodeURIComponent(sHash);

		var sSrc = this.option('frameSrc') + '?' + sEncodedHash;
		this._isWaitIFrame = true;
		this._iframe.src = sSrc + this._getIFrameSrcPostfix();

		this._iframeHash = sHash;

	},
	
	set : function(sHash) {
		
		var sEncodedHash = encodeURIComponent(sHash);
		
		var sFullURL = location.protocol + '//' + location.hostname + location.pathname + '#' + sEncodedHash;
		
		if (sFullURL.length > 2000) {
			return false;
		}
		
		if (this._iframe) {
			this._setIFrameSrc(sHash);
		} else {
			location.hash = sEncodedHash;
		}
		
		return true;
		
	},
	
	get : function() {
		return this._getHash();
	}
	
}).extend(jindo.Component);

jindo.Hash.onChangeIframeSrc = function(sQuery) {
	
	var self = this._object;
	
	if (self._first) {
		self._first = false;
		return;
	}

	var sEncodedHash = sQuery.substr(1);
	var sHash = decodeURIComponent(sEncodedHash);
	
	self._iframeHash = sHash;
	location.hash = sHash;

	self._onChangeHash();
	
	self._isWaitIFrame = false;
	
};
