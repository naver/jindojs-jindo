var jindo = window.jindo||{};

jindo._p_ = {};
jindo._p_.jindoName = "jindo";

!function() {
    if(window[jindo._p_.jindoName]){
        var __old_j = window[jindo._p_.jindoName];
        for(var x in __old_j){
            jindo[x] = __old_j[x];
        }
    }
}();

// DO_NOT_EDIT_THIS_LINE! - codes split from this line and will be inserted to the follow directions : <----- to the top [[script-insert]] to the bottom ----->

!function() {
    // Add jindo._p_.addExtension method to each class.
    var aClass = [ "$Agent","$Ajax","$A","$Cookie","$Date","$Document","$Element","$ElementList", "$Event","$Form","$Fn","$H","$Json","$S","$Template" ],
        sClass,oClass;

    for(var i=0, l=aClass.length; i<l; i++) {
        sClass = aClass[i];
        oClass = jindo[sClass];
        if(oClass){
            oClass.addExtension = (function(sClass) {
                return function(sMethod,fpFunc){
                    jindo._p_.addExtension(sClass,sMethod,fpFunc);
                    return this;
                };

            })(sClass);
        }
    }

    // Add hook method to $Element and $Event
    var hooks = ["$Element","$Event"];
    for(var i = 0, l = hooks.length; i < l ; i++) {
        var _className = hooks[i];
        if(jindo[_className]){
            jindo[_className].hook = (function(className ){
                var __hook = {};
                return function(sName, vRevisionKey){

                    var oArgs = jindo.$Jindo.checkVarType(arguments, {
                        'g'  : ["sName:String+"],
                        's4var' : ["sName:String+", "vRevisionKey:Variant"],
                        's4obj' : ["oObj:Hash+"]
                    },"jindo."+className+".hook");

                    switch(oArgs+"") {
                        case "g":
                            return __hook[oArgs.sName.toLowerCase()];
                        case "s4var":
                            if(vRevisionKey == null){
                                delete __hook[oArgs.sName.toLowerCase()];
                            }else{
                                __hook[oArgs.sName.toLowerCase()] = vRevisionKey;
                            }
                            return this;
                        case "s4obj":
                            var oObj = oArgs.oObj;
                            for(var i in oObj){
                                __hook[i.toLowerCase()] = oObj[i];
                            }
                            return this;
                    }
                };
            })(_className);
        }
    }

    //-!jindo.$Element.unload.hidden start!-//
    if(!jindo.$Jindo.isUndefined(window)&& !(jindo._p_._j_ag.indexOf("IEMobile") == -1 && jindo._p_._j_ag.indexOf("Mobile") > -1 && jindo._p_._JINDO_IS_SP)) {
        (new jindo.$Element(window)).attach("unload",function(e){
            jindo.$Element.eventManager.cleanUpAll();
        });
    }
    //-!jindo.$Element.unload.hidden end!-//

    // Register as a named AMD module
    if(typeof define === "function" && define.amd) {
        define( "jindo", [], function () { return jindo; } );
    }
}();