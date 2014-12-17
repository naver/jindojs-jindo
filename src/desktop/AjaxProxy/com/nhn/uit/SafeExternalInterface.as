package com.nhn.uit {
import flash.external.ExternalInterface;
import flash.utils.ByteArray;

/**
	XSS 위험의 제거를 위한 ExternalInterface.call 대체 함수
	
	사용방법 :
		ExternalInterface.call 대신에
		SafeExternalInterface.call 를 사용한다.
**/
public class SafeExternalInterface {
	
	// 객체를 escape 할 때 원본 데이터가 바뀌면 안되기 때문에 사용하는 깊은 복사 함수
	static private function clone(source:Object):* {
		var byteArray:ByteArray = new ByteArray();
		byteArray.writeObject(source);
		byteArray.position = 0;
		return(byteArray.readObject());
	}
	
	// 재귀적으로 배열이나 객체 안에 있는 역슬래쉬 문자를 escape 함
	static private function escapeString(source:*):* {
		
		switch (typeof source) {
		case 'object':
			for (var k in source) if (source.hasOwnProperty(k)) {
				source[k] = escapeString(source[k]);
			}
			break;
			
		case 'string':
			source = source.replace(/\\/g, '\\\\');
			break;
		}
		
		return source;

	}
	
	// ExternalInterfacel.call 대신에 쓰는 메서드
	static public function call(...args:Array):* {

		var i:Number, len:Number;
		
		// 두번째 인자부터 안에 역슬래쉬 문자를 escape 하도록 함
		for (i = 1, len = args.length; i < len; i++) {
			
			args[i] = escapeString(clone(args[i]));
			
			
		}
		
		// 첫번째 인자는 허용된 문자만 남기고 모두 삭제
		args[0] = args[0].replace(/[^\w\$\.]/g, '');
		
		
		// 2013-09-12 
		// 플래시 플레이어 버전 11,8,800,168 에서 
		// ExternalInterface 한글 깨지는 문제로 아래의 return 구문을 
		// NTS RIA 기술팀 코드 추가로 변경합니다.
		//return ExternalInterface.call.apply(ExternalInterface, args);		
		
		
		////////////////////////////////////////////////////////////////////
		// NTS RIA기술팀 코드 추가
		// 한글 인자 깨지는 문제 
		// escape(AS) - unescape(JS) 처리
		// 문제 처리를 위해 JS함수명, 분리된 인자를 하나로 합쳐 JS쪽에 던져야 함
		////////////////////////////////////////////////////////////////////
	    
		
		var allArg:String = "";
		// args[0]은 ExternalInterface 로 호출할 함수명이다.
		allArg = args[0];
		allArg += "(";
		
		for (var j:int = 1; j < len; j++) 
		{
			// args[1]은 통신 상태 결과값이다. 200, 404
			if(j == 1)
			{
				allArg += args[1] +",";
				continue;
			}
			
		/*	
		//var  str = "\\\\\"역사부동산\\\\\""  
		//trace(str) ->  \\"역사부동산\\"
		//ExternalInterface.call("alert", str) -> \"역사부동산\" 이된다                       /// 샘플 A ///
		
		하지만 escape를 걸게 되면
		// str = escape(str) 을 하게되면 url인코딩이 되어버려
		// ExternalInterface.call("alert(unescape('"+str+"'))") -> \\"역사부동산\\" 이된다    /// 샘플 A /// 와 결과가 다르다 
		
		이것을 방지하기 위해 replace함수를 사용하여 \\\\ 을 \\로 바꾸어준다		
		*/
		
			args[j] = (args[j] as String).replace(/\\\\/g, "\\")
			
			args[j] = escape(args[j]);
			allArg += "unescape('"+args[j]+"')";
			
			 if(j < len-1)
			 {
				 allArg += ",";
			 }			
		}	   
		
	    allArg += ")";
		return ExternalInterface.call.apply(ExternalInterface, [allArg]);
	}
}
}