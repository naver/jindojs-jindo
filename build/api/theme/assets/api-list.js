var apiDocs = function(projectAssets) {
    
    prettyPrint(function() {
		var aLine = $$('#file li');
		for (var i = 0, len = aLine.length; i < len; i++) {
			aLine[i].id = 'l' + (i+1);	
		}
    });
    
    var fpRelocate = function() {};
   
    var onHashChange = function(oCustomEvent) {
    	
        var sHash = oCustomEvent.hash;
        
        /^([a-z0-9]+)(_(.+))?$/i.test(sHash);
        
        var welEl = jindo.$Element(sHash);
        if (welEl) {
            
            var nTop = welEl.offset().top;
            document.documentElement.scrollTop = document.body.scrollTop = nTop - 90;
            
            welEl.addClass('highlight');
            setTimeout(function() {
                welEl.removeClass('highlight');
            }, 1000);
        }
        
        // fpRelocate();
        
    };
    
    var oStorage = {
    	
    	set : function(sKey, sVal) {
	    	
	    	sKey = 'auidoc-' + sKey;
	    	sVal = String(sVal);
	    	
	    	$Cookie().set(sKey, sVal);
	    	if ($Cookie().get(sKey) !== sVal && window.localStorage) {
	    		window.localStorage.setItem(sKey, sVal);	
	    	}
    	
    	},
    	
    	get : function(sKey) {
    		sKey = 'auidoc-' + sKey;
    		return $Cookie().get(sKey) || (window.localStorage && window.localStorage.getItem(sKey));
    	}
    	
    };
    
    var oHash = new jindo.Hash({
        'frameSrc' : projectAssets + '/hash.html'
    }).attach('change', onHashChange);
    
    setTimeout(function() { onHashChange({ hash : oHash.get() }); }, 0);
    
    $Element(document).delegate('click', 'a', function(oEvent) {
        
        var el = oEvent.element;
        var sHref = el.getAttribute('href');
        
        if (/^#(.*)$/.test(sHref)) {
            var sHash = RegExp.$1;
            oHash.set(sHash);
            
            oEvent.stopDefault();   
        }

    });
        
    $Element(document).delegate('click', 'button.fold', function(oEvent) {
        
        var elButton = oEvent.element;
        var elParent = $$.getSingle('! .param', elButton);
        
        elParent && $Element(elParent).toggleClass('collapsed');
        
        // fpRelocate();
        
    });
    
	$Element(document).delegate('click', 'button.btn_open, button.btn_close', function(oEvent) {
	
		var elButton = oEvent.element;
		var elParent = $$.getSingle('! .history-table', elButton);
	
		elParent && $Element(elParent).toggleClass('tbl_fold');
	    
	});

	(function() {
		
		var welDemoList = $Element('demo_list');
		if (!welDemoList) { return; }
		
		var welDemoDesc = $Element('demo_desc');
		var welDemoExample = $Element('demo_example');
		var welDemoIframe = $Element('demo_iframe');
		var welBtnExternal = $Element('btn_external');
		
		var welLastLI = null;
		
		var fpSetDemo = function(elAnchor) {
			
			var welLI = $Element($$.getSingle('! li', elAnchor));
			
			welDemoDesc.html(elAnchor.title);
			welDemoIframe.$value().src = elAnchor.href + "?data-disable=true";
			
			welLastLI && welLastLI.removeClass('selected');
			welLI.addClass('selected');
			
			welLastLI = welLI;
			
		};

		welDemoList.delegate('click', 'a', function(oEvent) {
			
			if (welDemoExample.visible()) {
				fpSetDemo(oEvent.element);
				oEvent.stopDefault();
			}
			
		});
		
		welBtnExternal.attach('click', function(oEvent) {
			open(welDemoIframe.$value().src.replace(/\?data\-disable=true$/, ''));
			oEvent.stopDefault();
		});
		
		fpSetDemo(welDemoList.query('a').$value());
		
	})();
	
	(function() {
		
		var aHistoryTables = $$('div.history-table');
		
		for (var i = 0, nLen = aHistoryTables.length; i < nLen; i++) {
			var elTable = aHistoryTables[i];
		}
		
	})();
	
	(function() {
		
		if (isMobile) { return; }
		
		var elContainer = $('container');
		
		var elHeader = $('header');
		var elFooter = $('footer');
        var elLeft = $('left-columns');

		var elDepth1 = $$.getSingle('div.depth1');
		var elDepth2 = $$.getSingle('div.depth2');
		
		var oScrollTimer = null;
		
		if (false) {
			
			elDepth1.style.overflowY = 'auto';
			elDepth2 && (elDepth2.style.overflowY = 'auto');
			
		} else {
			
			$$.getSingle('.scrollbar-box', elDepth1).style.height = '100px';
			elDepth2 && ($$.getSingle('.scrollbar-box', elDepth2).style.height = '100px');
			
			var oScrBox1 = new jindo.ScrollBox(elDepth1, {
				sOverflowX : 'hidden',
				sOverflowY : 'auto',
				bAdjustThumbSize : true,
				nDelta : 32
			}).attach('scroll', function(oCustomEvent) {
				
				var nPosition = oCustomEvent.nPosition;
				
				if (oCustomEvent.sDirection !== 'top') { return; }
				
				if (oScrollTimer) { clearTimeout(oScrollTimer); }
				setTimeout(function() {
					oStorage.set('scroll-top', nPosition);
					oScrollTimer = null;
				}, 500);
							
			});
			
			var oScrBox2 = elDepth2 && (new jindo.ScrollBox(elDepth2, {
				sOverflowX : 'hidden',
				sOverflowY : 'auto',
				bAdjustThumbSize : true,
				nDelta : 32
			}));
			
		}
		
		var bScrollFirst = true;
		var elDepth1Selected = $$.getSingle('a.selected', elDepth1);
		
		fpRelocate = function() {

			var nHeight = elLeft.offsetHeight - elHeader.offsetHeight - elFooter.offsetHeight;
			
			if (false) {
				var nTmpTop = elDepth1.scrollTop;
				elDepth1.style.height = nHeight + 'px';
				elDepth1.scrollTop = nTmpTop;
			} else {
				var nTmpTop = oScrBox1.getScrollTop();
				oScrBox1.setSize(148, nHeight);
				oScrBox1.setScrollTop(nTmpTop);
			}
			
			if ((false && elDepth2) || oScrBox2) {
				
				if (false) {
					var nTmpTop = elDepth2.scrollTop;
					elDepth2.style.height = nHeight + 'px';
					elDepth2.scrollTop = nTmpTop;
				} else {
					nTmpTop = oScrBox2.getScrollTop();
					
					oScrBox2.setSize(148, nHeight);
					$Element(elLeft).cssClass('has_scrollbar', oScrBox2.hasScrollBarVertical());
					
					oScrBox2.setScrollTop(nTmpTop);
				}
				
			}
			
			if (bScrollFirst) {
				
				if (elDepth1Selected && elDepth1Selected.offsetParent) {
					
					var aItem = [ elDepth1Selected.offsetTop + elDepth1Selected.offsetParent.offsetTop ];
					aItem[1] = aItem[0] + elDepth1Selected.offsetHeight;
					
				}
				
				var nTop = Number(oStorage.get('scroll-top'));
				if (nTop) {
					
					if (false) {
						elDepth1.scrollTop = nTop + 'px';
					} else {
						oScrBox1.setScrollTop(nTop);
					}
					
				}
				
				if (elDepth1Selected && elDepth1Selected.offsetParent) {
					
					if (false) {

						var aRange = [ elDepth1.scrollTop ];
						aRange[1] = aRange[0] + elDepth1.offsetHeight;
						
						if (aItem[0] < aRange[0]) {
							elDepth1.scrollTop = (aRange[0] - (aRange[0] - aItem[0]));
						} else if (aItem[1] > aRange[1]) {
							elDepth1.scrollTop = (aRange[0] + (aItem[1] - aRange[1]));
						}
					
					} else {						
					
						var aRange = [ oScrBox1.getScrollTop() ];
						aRange[1] = aRange[0] + elDepth1.offsetHeight;
						
						if (aItem[0] < aRange[0]) {
							oScrBox1.setScrollTop(aRange[0] - (aRange[0] - aItem[0]));
						} else if (aItem[1] > aRange[1]) {
							oScrBox1.setScrollTop(aRange[0] + (aItem[1] - aRange[1]));
						}
						
					}
					
				}
				
				bScrollFirst = false;
			}

		};
		
		var oTimer = new jindo.Timer();
		$Element(window).attach('resize', function() {
			oTimer.start(fpRelocate, 100);
		}).attach('scroll', function() {
			oTimer.start(fpRelocate, 100);
		});
		
		setTimeout(fpRelocate, 0);
		
	})();
	
	(function() {
		
		var welWrap = $Element('wrap');
		
		var welBtnClose = $Element($$.getSingle('button.btn_close'));
		var welBtnOpen = $Element($$.getSingle('button.btn_open'));
		
		welWrap.cssClass('lft_fold', oStorage.get('show-left-fold') === 'true');
		
		welBtnClose.attach('click', function() {
			welWrap.addClass('lft_fold');
			oStorage.set('show-left-fold', true);
		});
		
		welBtnOpen.attach('click', function() {
			welWrap.removeClass('lft_fold');
			oStorage.set('show-left-fold', false);
			fpRelocate();
		});
		
		var welToggleSearchBtn = $Element('toggle_search_btn');
		var welToggleListBtn = $Element('toggle_list_btn');
		
		var welSearchEl = $Element($$.getSingle('div.sch_frm'));
		var welListEl = $Element($$.getSingle('div.depth1'));
		
		welToggleSearchBtn.attach('click', function() {
			this.toggleClass('btn_sch_on');
			welSearchEl.cssClass('hide_when_small', !this.hasClass('btn_sch_on'));
			oStorage.set('show-search', this.hasClass('btn_sch_on'));
		});
		
		welToggleListBtn.attach('click', function() {
			this.toggleClass('btn_snb_on');
			welListEl.cssClass('hide_when_small', !this.hasClass('btn_snb_on'));
			oStorage.set('show-list', this.hasClass('btn_snb_on'));
		});
		
		welToggleSearchBtn.cssClass('btn_sch_on', oStorage.get('show-search') === 'true');
		welToggleListBtn.cssClass('btn_snb_on', oStorage.get('show-list') === 'true');
		
		welSearchEl.cssClass('hide_when_small', !welToggleSearchBtn.hasClass('btn_sch_on'));
		welListEl.cssClass('hide_when_small', !welToggleListBtn.hasClass('btn_snb_on'));
		
		var welBtnTop = $Element('btn_top');
		welBtnTop && welBtnTop.attach('click', function(oEvent) {
			window.scrollTo(0);
			oEvent.stopDefault();
		});
		
	})();
        
    (function() {
        
        var elLeft = $('left-columns');
        var elMain = $('main');
        
        var showInherited = jindo.$('api-show-inherited');
        var showDeprecated = jindo.$('api-show-deprecated');
        
        if (!showInherited || !showDeprecated) { return; }
        
        showInherited.checked = oStorage.get('show-inherited') !== 'false';
        showDeprecated.checked = oStorage.get('show-deprecated') === 'true';
        
        var chkInherited = jindo.$('checkbox-inherited');
        var chkDeprecated = jindo.$('checkbox-deprecated');
        
        var oInherited = new jindo.CheckBox(chkInherited);
        var oDeprecated = new jindo.CheckBox(chkDeprecated);
        
        var refresh = function() {
        	
            $Element(document.body).cssClass({
               'hide-inherited' : !showInherited.checked,
               'hide-deprecated' : !showDeprecated.checked
            });
            
            oStorage.set('show-inherited', showInherited.checked); 
            oStorage.set('show-deprecated', showDeprecated.checked); 
            
            fpRelocate();
            
        };
        
        oInherited.attach('change', refresh);
        oDeprecated.attach('change', refresh);
        
        refresh();
        
    })();
    
};
