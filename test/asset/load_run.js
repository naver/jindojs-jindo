(function(callback) {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "tc/"+ _sModule +".js";

    (document.head || document.getElementsByTagName("head")[0]).appendChild(s);

    if(s.addEventListener) {
        s.onload = callback;
    } else if(s.readyState) {
        s.onreadystatechange = function() {
            s.readyState === "loaded" && callback();
        };
    }
})(QUnit.start);