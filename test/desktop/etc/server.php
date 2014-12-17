<?
	// http://hooriza.com/cors/get/server.php 에 위치한 파일 내용

	header("Access-Control-Allow-Origin: http://127.0.0.1");
	header("Access-Control-Allow-Headers: X-Requested-With"); 
	header("Access-Control-Allow-Credentials: true");
?>
{
	"data" : "<?=$_GET['data']?>",
	"cookie" : "<?=$HTTP_COOKIE?>",
	"ts" : <?=time()?>
}
