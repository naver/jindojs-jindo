/**
{{title}}
*/
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

/**
 {{version}}
 */
jindo._p_.redefineObjFunc(
    "jindo.$Jindo",
    /{/,
    "{this.version='"+ jindo.VERSION +"';"
);

/**
 {{version_1}}
 */
jindo.$Jindo.VERSION = jindo.VERSION;

/**
 {{event_element}}
 */
/*jindo._p_.redefineObjFunc(
    "jindo.$Event",
    /(this\.srcElement\s?=)/,
    "this.element=$1"
);*/

/**
 {{event_pos}}
 */
jindo._p_.redefineObjFunc(
    "jindo.$Event.prototype.pos",
    /(pageY\s*:[^}\r\n\t]*(\w+)\.clientY[^}\r\n\t]*)/,
    "$1, layerX:'offsetX' in $2 ? $2.offsetX : $2.layerX-1, layerY: 'offsetY' in $2 ? $2.offsetY : $2.layerY-1"
);

// WILL_BE_IMPLEMENTED_ON_NEXT_RELEASE - if(jindo && jindo.$Fn) {}
