/**
 * Redefine object/function's value.
 *
 * @param {String} sName - object/function name.
 * @param {Object} re - RegExp for matched string pattern.
 * @param {String} sVal - string value which to be replaced for matched RegExp pattern.
 */
jindo._p_.redefineObjFunc = function(sName, re, sVal) {
    var vTemp = sName.split("."),
        sObjectName = vTemp[1],
        bObj = sName.indexOf("prototype") == -1,
        obj = window;

    if(!jindo[sObjectName]) { return; }

    for(var i=0, str; str = vTemp[i]; i++) {
        obj = obj[str];
    }

    // save original values.
    if(bObj) {
        (vTemp = function(){}).prototype = obj.prototype;
        for(var x in obj) { vTemp[x] = obj[x]; }
    }

    obj = eval(sName +"="+ obj.toString().replace(re, sVal));

    // restore original values.
    if(bObj) {
        obj.prototype = vTemp.prototype;
        for(var x in vTemp) { obj[x] = vTemp[x]; }

        if(window[sObjectName]) {
            window[sObjectName] = obj;
        }
    }
};