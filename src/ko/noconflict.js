/**
 
* @fileOverview	다른 프레임웍 없이 jindo만 사용할 경우 편의성을 위해 jindo 객체를 window에 붙임
  
 */
// copy jindo objects to window
if (typeof window != "undefined") {
	for (prop in jindo) {
		if (jindo.hasOwnProperty(prop)) {
			window[prop] = jindo[prop];
		}
	}
}
