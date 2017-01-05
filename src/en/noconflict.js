/**
 
* @fileOverview	For convenience use, copies Jindo objects to a window when using no other than Jindo.
  
 */
// copy jindo objects to window
if (typeof window != "undefined") {
	for (prop in jindo) {
		if (jindo.hasOwnProperty(prop)) {
			window[prop] = jindo[prop];
		}
	}
}
