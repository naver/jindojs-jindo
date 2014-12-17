/**
 {{title}}
 */
// copy jindo objects to window
!function() {
    if(typeof window != 'undefined') {
        for(var prop in jindo) {
            if(jindo.hasOwnProperty(prop)) {
                window[prop] = jindo[prop];
            }
        }
    }
}();