var APISearch = (function() {

	var MAXIMUM = 15;
	
	var data = {};

	var tabs = [ 'all', 'keyword', 'class', /*'module',*/ 'method', 'property', /*'attribute',*/ 'event' ];
	var tabIdx = 0;

	var inputNode   = $Element('api-filter'),
		searchingNode = $Element('search-tab'),
		resultNode  = searchingNode.queryAll('.tc-panel'),
		resultPanel = searchingNode.query('.panels');
		
	var layerManager = new jindo.LayerManager(searchingNode, { sCheckEvent : 'mousedown', nCheckDelay : 0, nHideDelay : 100 }).link(searchingNode, inputNode);
	var fpFitResultLayer = function() {
		
		if (isMobile) { return; }
		
		if (!layerManager.getVisible()) { return; }
		
		resultPanel.css('height', '');
		if (resultPanel.height() > 550) {
			resultPanel.css('height', '550px');
		} 
		
	};
	
	layerManager.attach('show', fpFitResultLayer);
	
	searchingNode.hide();

	function toPlural(s) {
		
		var p = s + 's'; 
		
		return {
			'classs' : 'classes',
			'propertys' : 'properties'
		}[p] || p;
		
	}
	
	function changeTab(idx) {
		tabIdx = idx;
		refreshResults();
	}
	
	function highlightMatch(sStr, sNeedle) {
		
		var bMatch = false;
		var sRegNeedle = sNeedle.replace(/([\?\.\*\+\-\/\(\)\{\}\[\]\:\!\^\$\\\|])/g, "\\$1");
		
		var sRet = sStr.replace(new RegExp(sRegNeedle, 'i'), function(_) {
			bMatch = true;
			return '<strong>' + _ + '</strong>';
		});
		
		return bMatch ? sRet : null;
		
	}

	function getResults(data, field, value) {
		
		var result = null;
		if (!value) { return result; }
		
		if (field === 'all') {
			
			result = [];
			
			for (var i = 1, len = tabs.length; i < len; i++) {
				var r = getResults(data, tabs[i], value);
				if (r) { result = result.concat(r.slice(0, 3)); }
			}
			
			return result;
			
		}
		
		var fields = toPlural(field);
		
		var lists = data.detail[fields] || [];
		for (var i = 0, len = lists.length; i < len; i++) {
			
			var item = lists[i];
			var matchName = highlightMatch(item.name, value);
			
			if (!matchName) { continue; }
			
			item.matchName = matchName;
			item.type = field;
			
			result = result || [];
			result.push(item);
			
			if (result.length === MAXIMUM) {
				break;
			}
			
		}
		
		return result;
		
	}
	
	function memberAnchor(item) {
		switch (item.type) {
		case 'keyword': case 'class':
			return projectRoot + toPlural(item.type) + '/' + item.name + '.html';
		}
		
		return projectRoot + 'classes/' + item['class'] + '.html#' + item.type + '_' + item.name
	}
	
	function memberDetail(item) {
		
		var html = [];
		
		html.push('<li class="result">');
		
		{
			if (item.type !== 'keyword') { html.push('<a href="' + memberAnchor(item) + '">'); }
			
			html.push('<p class="title">' + item.matchName);
			html.push('<span class="flag ' + item.type + '">' + item.type + '</span></p>');
			
			if (item.type === 'keyword') {
				html.push('<ul>');
				for (var i = 0, len = item['class'].length; i < len; i++) {
					html.push('<li><a href="' + memberAnchor({ name : item['class'][i], type : 'class' }) + '">' + item['class'][i] + '</a></li>');   
				}
				html.push('</ul>');
			}
			
			html.push(item.description ? '<p class="description">' + item.description.replace(/<[^>]+>/g, '') + '</p>' : '');
			if (item.type !== 'keyword') { html.push('</a>'); }
			
		}
			
		html.push('</li>');
		
		return html.join('\n');
		
	}
  
	function refreshResults() {
		
		var value = inputNode.$value().value.replace(/(^\s+|\s+$)/g, '');
		layerManager[value ? 'show' : 'hide'](0);
		
		var html = [];

		var type = tabs[tabIdx];
		
		var results = getResults(data, type, value) || [];
		for (var j = 0, cnt = results.length; j < cnt; j++) {
			var item = results[j];
			html.push(memberDetail(item));
		}
		
		if (!results.length) {
			html.push('<li class="no-result">검색 결과가 없습니다.</li>');   
		}
		
		resultNode[tabIdx].html(html.join(''));
		
		fpFitResultLayer();
		
	}
	
	function setData(_data) {
		data = _data;
	}
	
	inputNode.attach('keyup', refreshResults);
	inputNode.attach('click', refreshResults);
	
	setTimeout(function() { refreshResults(); }, 0);
	
	//////////////////////////////////////////
	
	var oTab = new jindo.TabControl('search-tab').attach({
		select : function(oCustomEvent) {
			changeTab(oCustomEvent.nIndex);            
		}
	});
	
	return {
		setData : setData
	};
	
})();