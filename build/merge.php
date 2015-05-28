<?php
/**
 * Merge each jindo object files located in '/src' folder for test purpose.
 * USAGE : <script src="YOUR_SERVER_URL/build/merge.php?OPTIONS_PARMETERS"></script>
 *
 * Options parameters :
 * nonconflict : Copy jindo object to window object for global use without namespace. ex) jindo.$Jindo() --> $Jindo()
 * type : desktop or mobile
 * jindo : Namespace
 *
 * ex)  <script src="http://YOUR_SERVER_URL/build/merge.php?nonconflict=true&type=desktop&jindo=jindo"></script>
*/

$download = $_GET['download'];

if($download=="true") {
	header("Content-Type: application/octet-stream;charset=utf-8");
	header("Content-Disposition: attachment; filename=jindo.js");
} else {
	header('Content-Type: text/javascript;charset=utf-8');
}

// namespace
$jindo = $_GET['jindo'];
if(!$jindo) { $jindo = "jindo"; }

// type (desktop|mobile)
$type = $_GET['type'];

$path = "../src/desktop";
if($type=="mobile") { $path = "../src/mobile"; }

// ift set, jindo object to the window
$nonconflict = $_GET['nonconflict'];

// files list to be merged
$files = array(
    "polyfill.js",
    "core.js",
    "cssquery.js",
    "agent.js",
    "array.js",
    "array.extend.js",
    "hash.js",
    "function.js",
    "event.js",
    "element.js",
    "element.extend.js",
    "elementlist.js",
    "form.js",
    "document.js",
    "window.js",
    "experimental/window.js",
    "string.js",
    "json.js",
    "ajax.js",
    "ajax.extend.js",
    "date.js",
    "cookie.js",
    "template.js",
    "template.extend.js"
);

$total = "";
foreach ( $files as $key=>$file ) {
	$fullpath = "$path/$file";
	if(file_exists($fullpath)) {
		if(filesize($fullpath)>0) {
			$fp = fopen($fullpath, "r");
			$total .= fread($fp, filesize($fullpath));
			$total .= "\n\r";
			fclose($fp);
		}
	}
}

// read namespace.js and put contents to the top and bottom using '[[script-insert]]' delimiter comment.
$fp = fopen("$path/namespace.js", "r");
$namespace = preg_split("/^\/\/[^\]]+\[\[script\-insert\]\][^>]+>/m", str_replace("@namespace@",$jindo,fread($fp, filesize("$path/namespace.js"))));
$total = $namespace[0] . $total . $namespace[1];

if($nonconflict) {
    $fp = fopen("$path/noconflict.js", "r");
    $total .= fread($fp, filesize("$path/noconflict.js"));
}
fclose($fp);

// If namespace value is given, then replace from the whole contents.
if($jindo != "jindo") {
    $total = preg_replace("/jindo/m", $jindo, $total);
}

echo $total;
?>