var _j_ag = navigator.userAgent;
var __browser;
var __version;
var _JINDO_IS_IE = /(MSIE|Trident)/.test(_j_ag);  // IE
var _JINDO_IS_FF = _j_ag.indexOf("Firefox") > -1;  // Firefox
var _JINDO_IS_OP = _j_ag.indexOf("Opera") > -1;  // Presto engine Opera
var _JINDO_IS_SF = /Version\/[\d\.]+\s(?=Safari)/.test(_j_ag);  // Safari
var _JINDO_IS_CH = /Chrome\/[\d\.]+\sSafari\/[\d\.]+$/.test(_j_ag);  // Chrome
var _JINDO_IS_WK = _j_ag.indexOf("WebKit") > -1;
var _JINDO_IS_MO = /(iPhone|iPod|Mobile|Tizen|Android|Nokia|webOS|BlackBerry|Opera Mobi|Opera Mini)/.test(_j_ag);


if(_JINDO_IS_IE){
	__browser = "ie";
	__version = parseInt(document.documentMode||_j_ag.match(/(?:MSIE) ([0-9.]+)/)[1])+"";
}else if(_JINDO_IS_FF){
	__browser = "firefox";
	__version = _j_ag.match(/(?:Firefox|Opera|OmniWeb)\/([0-9.]{3})/)[1];
}else if(_JINDO_IS_OP){
	__browser = "opera";
	__version = _j_ag.match(/Version\/([0-9.]+)/)[1];
}else if(_JINDO_IS_CH){
	__browser = "chrome";
	__version = _j_ag.match(/Chrome[ \/]([0-9.]{2})/)[1];
}else if(_JINDO_IS_SF){
	__browser = "safari";
	__version = _j_ag.match(/Version\/([0-9.]+)/)[1];
}