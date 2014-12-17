package com.nhn.uit
{
	import flash.net.*;
	import flash.events.*;
	import flash.external.*; 
	import flash.system.*;
	import flash.errors.*;
	
	public class HttpProxy {
		
		function HttpProxy(oArgs:Object) {
			//oArgs includes url,type,data,callback, header,charset
			if ( oArgs.charset.toUpperCase() != "UTF-8" ) {
				System.useCodePage = true;
			}
			
			var status:int = 0;
			var message:String = "";
			try{
				var fCallback:String = oArgs.callback;
				var params:URLVariables = new URLVariables();
				var request:URLRequest = new URLRequest(oArgs.url);
				if(oArgs.type=="POST")
					request.method = URLRequestMethod.POST;
				else
					request.method = URLRequestMethod.GET;
				
				var loader:URLLoader = new URLLoader();
			
				loader.addEventListener(Event.COMPLETE, function(event:Event) {
					try{
						System.useCodePage = false
						var loader:URLLoader = URLLoader(event.target);
						SafeExternalInterface.call (fCallback, 200, loader.data);
					}catch(e:Error){
						if(status==0) status=500;
						SafeExternalInterface.call (fCallback, status, e.message);
					}catch(e2:IOError){
						if(status==0) status=500;
						SafeExternalInterface.call (fCallback, status, e2.message);
					}
				});		
				loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, function(event:SecurityErrorEvent):void{									
					SafeExternalInterface.call (fCallback, 404, event.text);
				});
				loader.addEventListener(HTTPStatusEvent.HTTP_STATUS, function(event:HTTPStatusEvent):void{					
																									
//					SafeExternalInterface.call ("console.log", event.status);
					status = event.status;
				});
				loader.addEventListener(IOErrorEvent.IO_ERROR, function(event:IOErrorEvent):void{		
					SafeExternalInterface.call (fCallback, 404, event.text);
				});
			
				
				////////////////////////////////////////////////////////////////////
				// NTS RIA기술팀 코드 추가
				// 크롬 내장 플레이어 이용시
				// Referer가 SWF가 아닌 페이지 주소 또는 경로로
				// 표시되는걸 방지하기 위해 코드 추가
				// 
				// 리퍼러가 http://naver.com/request.swf 가 아닌
				// http://naver.com/photo/index.html 또는 http://naver.com/photo/ 
				// 나오는 경우는
				// 1. GET 방식으로 요청하는 경우
				// 2. URLRequest 에 URLVariables 가 없는 경우
				// 아래에 refererErrorPreventionValue 에 0을 넣은 이유는
				// 2번을 방지하기 위함입니다. (아무값이나 대입해서 URLVariables를 채움)
				////////////////////////////////////////////////////////////////////
				
				params.refererErrorPreventionValue = 0;
				
				
					
				for (var j in oArgs.data) {
					params[j] = oArgs.data[j];
				}
				for (var i in oArgs.header_json) {
//					SafeExternalInterface.call ("console.log", i+"="+oArgs.header_json[i]);
					request.requestHeaders.push(new URLRequestHeader(i, oArgs.header_json[i]));
				
				}
				request.data = params;
				loader.load(request);
			}catch(e:Error){
				if(status==0) status=404;
				SafeExternalInterface.call (fCallback, status, message);	
			}
		}	
	}
}