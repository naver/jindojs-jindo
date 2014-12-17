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