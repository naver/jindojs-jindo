/**
 * JSMockTool 1.0.0
 *
 * Copyright 2009 Gary Jeon
 *  - mailto:i.nevalose@gmail.com
 *  - http://mixed.kr
 *
 *
 * Dependencies:
 *  - _toSource ( http://dev.naver.com/projects/jindo ) - toString code of $Json
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc, 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA
 */

 
 function Mock(vName,sType){
 	if(!(this instanceof arguments.callee)){
		return new arguments.callee(vName,sType);
	}else{
		this.createMock(vName,sType||Mock.OBJECT);
	}
 }
 
 Mock.prototype.createMock = function(vName,sType){
 	this._vReturnValue = "_js_mock_none";
 	this._mockType = Mock.OBJECT;
 	if(typeof vName=="string"){
		
		this.makeEnableObj(vName,sType);
		this._mockType = sType;
		
	}else if(typeof vName=="object"||typeof vName=="function"){
		this._mockObj = vName;
		this._mockType = sType;
	}else{
		throw new Error("Name of Mock is incorrect.The Type only have String or Object or Function.");
	}
 }
 
 Mock.prototype.getMock = function(){
	if(this._mockType==Mock.OBJECT){
		return this._mockObj;
	}else{
		return this._mockObj.prototype;
	}
 }
 
 Mock.prototype.makeEnableObj = function(sName,sType){
 	var depth = sName.split(".");
	var objectName = depth[0];
	var obj;
	if(depth.length > 1){
		 obj = window;
	
		for (var i = 0, l = depth.length; i < l-1 ; i++) {
			if (typeof obj[depth[i]] == "undefined"){
				obj[depth[i]] = {};
			} 
			
			obj = obj[depth[i]];
		}
		objectName = depth[depth.length-1];
	}else{
		obj = window;
	}
	var returnObj;
	if(sType==Mock.OBJECT){
		returnObj = obj[objectName];
		if(returnObj){
			this._mockObj = returnObj;
		}else{
			this._mockObj = obj[objectName] = {};
		}
	}else if(sType==Mock.INSTANCE){
		returnObj = obj[objectName];
		if(returnObj){
			this._mockObj = returnObj;
		}else{
			this._mockObj = obj[objectName] = function(){};
			this._mockObj.prototype = obj[objectName].prototype = {};
		}
	}
 }
 
 Mock.prototype.should_receive = function(sMethodName){
	return MockFactory.getMockMethod(this.getMock(),sMethodName);
 }

 Mock.prototype.clear_all = function(){
	var oObj = MockFactory.getData(this.getMock());
	for(var i in oObj){
		if(i!="current_obj") oObj[i].record = {"total":0,"param":{}};
	}
 }

 Mock.prototype.clear = function(sMethodName){
	var oObj = MockFactory.getData(this.getMock());
	oObj[sMethodName].record = {"total":0,"param":{}};
 }
 
 Mock.prototype.verify = function(sMethodName){
	var oObj = MockFactory.getData(this.getMock());
	if(oObj[sMethodName]){
		if(oObj[sMethodName].record.total == 0){
			throw new Error(sMethodName+" is not called.");
		}else{
			return oObj[sMethodName].record;
		}
	}else{
		throw new Error(sMethodName+" isn't method.");
	}
	
 }

 Mock.prototype.verify_all = function(){
	var oObj = MockFactory.getData(this.getMock());
	var oReturn = {};
	for(var i in oObj){
		if(i!="current_obj") oReturn[i] = this.verify(i);
	}
	return oReturn;
 }
 
 Mock.prototype.restore = function(sMethodName){
 	var oObj = MockFactory.getData(this.getMock());
	if (oObj[sMethodName]) {
		if(oObj[sMethodName].origin_fn){
			oObj.current_obj[sMethodName] = oObj[sMethodName].origin_fn;
			delete oObj[sMethodName];
		}else{
			delete oObj[sMethodName];
		}
	}
 }
 Mock.prototype.restore_all = function(){
 	var oObj = MockFactory.getData(this.getMock());
	for(var i in oObj){
		if(i!="current_obj") this.restore(i);
	}
	
 }
 
 Mock.INSTANCE = "instance";
 Mock.OBJECT = "object";
 
 Mock.anything = function(){
 	return "_js_mock_anything_param";
 }
 
 
 
 function MockMethod(oObj,sMethodName){
 	var that = this;
	this.excuteObjs = {
//		key:{
//			arg:[],
//			type:"function",
//			excute : function(){}
//		}
	};
	this.record = {"total":0,"param":{}};
	this.currentParam = _toSource([]);
	this.excuteObjs[this.currentParam] = {};
	if(oObj[sMethodName]){
		this.origin_fn = oObj[sMethodName];
	}
	oObj[sMethodName] = function(){
		that.record.total++;
		var argString = _toSource(argumentsToArray(arguments));
		if(that.record.param[argString]){
			that.record.param[argString] += 1;
		}else{
			that.record.param[argString] = 1;
		}
		var dataObj = that.excuteObjs[argString];
		if(dataObj){
			if(dataObj.type == "function"){
				return dataObj.excute.apply(dataObj,argumentsToArray(arguments));
			}else if(dataObj.type == "exception"){
				throw dataObj.excute;
			}else if(dataObj.type == "return"){
				return dataObj.excute;
			}
		}else{
			for(var i in that.excuteObjs){
				var  currentParam = argumentsToArray(arguments);
				var arg = that.excuteObjs[i].arg;
				
				if(arg&&(arg.length == currentParam.length)){
					var paramMatch = true;
					for(var j = 0 , l = arg.length; j < l ; j++){
						if(arg[j] != currentParam[j]&&arg[j]!="_js_mock_anything_param"){
							paramMatch = false;
							break;
						}
					}
					if(paramMatch){
						return 	that.excuteObjs[i].excute;
					}
				}
			}
		}
	}
 }

 MockMethod.prototype.with_param = function(){
 	var arg = argumentsToArray(arguments);
 	this.currentParam = _toSource(arg);
	this.excuteObjs[this.currentParam] = {
		arg : arg
	}
	
	return this;
 }
 
 MockMethod.prototype._and_template = function(sType,vExcute){

 	this.excuteObjs[this.currentParam].type = sType;
 	this.excuteObjs[this.currentParam].excute = vExcute;
	this.currentParam = _toSource([]);
 }
 
 MockMethod.prototype.and_return = function(vReturnValue){
 	this._and_template("return",vReturnValue);
 }
 
 MockMethod.prototype.and_function = function(fpFunction){
 	this._and_template("function",fpFunction); 	
 }
 
 MockMethod.prototype.and_throw = function(xException){
 	this._and_template("exception",xException); 	
 }
 
 
 var MockFactory = {
 	storage : [
//		{
//			current_obj : {}, object
//			current_functions : {} mock method
//		}
	],
	createData : function(oObj){
		var dataObj = {current_obj : oObj};
		this.storage.push(dataObj);
		
		return dataObj
	},
	createMockMethod : function(oObj,sMethodName){
		var dataObj = this.getData(oObj);
		dataObj[sMethodName] = new MockMethod(oObj,sMethodName);
		
		return dataObj[sMethodName];
	},
	getData : function(oObj){
		for (var i = 0, l = this.storage.length; i < l; i++) {
			if (this.storage[i].current_obj == oObj) {
				return this.storage[i];
			}
		}
		return this.createData(oObj);
	},
	getMockMethod : function(oObj,sMethodName){
		var dataObj = this.getData(oObj);
		if(!dataObj[sMethodName]){
			dataObj[sMethodName] = this.createMockMethod(oObj,sMethodName);
		}
		return dataObj[sMethodName];
	}
 };
 
 
 function argumentsToArray(aArg){
 	var returnVal = [];
 	if(!!aArg.length){
		for(var i = 0 , l = aArg.length; i < l; i++){
			returnVal[i] = aArg[i];
		}
	}
	return returnVal;
 }
 
 var mock = Mock;


 function Stub(vName, sType){
 	if(!(this instanceof arguments.callee)){
		return new arguments.callee(vName,sType);
	}else{
		this.createStub(vName,sType||"object");
	}
 }
 
 Stub.prototype.createStub = function(vName,sType){
 	this._vReturnValue = "_js_stub_none";
 	this._stubType = Stub.OBJECT;
 	if(typeof vName=="string"){
		this.makeEnableObj(vName,sType);
		this._stubType = sType;
	}else if(typeof vName=="object"||typeof vName=="function"){
		this._stubObj = vName;
		this._stubType = sType;
	}else{
		throw new Error("Name of Stub is incorrect.Type is String or Object or Function.");
	}
 }
 
 Stub.prototype.getStub = function(){
 	if(this._stubType==Stub.OBJECT){
		return this._stubObj;
	}else{
		return this._stubObj.prototype;
	}
 }
 
 Stub.prototype.makeEnableObj = function(sName,sType){
 	var depth = sName.split(".");
	var objectName = depth[0];
	var obj;
	if(depth.length > 1){
		 obj = window;
	
		for (var i = 0, l = depth.length; i < l-1 ; i++) {
			if (typeof obj[depth[i]] == "undefined"){
				obj[depth[i]] = {};
			} 
			
			obj = obj[depth[i]];
		}
		objectName = depth[depth.length-1];
	}else{
		obj = window;
	}
	var returnObj;
	if(sType==Stub.OBJECT){
		returnObj = obj[objectName];
		if(returnObj){
			this._stubObj = returnObj;
		}else{
			this._stubObj = obj[objectName] = {};
		}
	}else if(sType==Stub.INSTANCE){
		returnObj = obj[objectName];
		if(returnObj){
			this._stubObj = returnObj;
		}else{
			this._stubObj = obj[objectName] = function(){};
			this._stubObj.prototype = obj[objectName].prototype = {};
		}
	}
 }
 
 Stub.prototype.should_receive = function(sFunctionName){
	var that = this;
 	this.getStub()[sFunctionName] = function(){
		if(that._vReturnValue != "_js_stub_none"){
			return that._vReturnValue;
		}
	};
	return new StubMethod(this);
 }
 
 function StubMethod(iStub){
 	this.iStub = iStub;
 }
 
 StubMethod.prototype.and_return = function(vReturn){
 	this.iStub._vReturnValue = vReturn;
 }
 
 Stub.INSTANCE = "instance";
 Stub.OBJECT = "object";
 
 
 var stub = Stub;
	 
	 
 if(Object.prototype.toSource){
		_toSource = function(vValue){
			return vValue.toSource();
		}
	 }else{
		_toSource = function(vValue){
			var func = {
				$ : function($) {
					if (typeof $ == "undefined") return '""';
					if (typeof $ == "boolean") return $?"true":"false";
					if (typeof $ == "string") return this.s($);
					if (typeof $ == "number") return $;
					if ($ instanceof Array) return this.a($);
					if ($ instanceof Object) return this.o($);
				},
				s : function(s) {
					var e = {'"':'\\"',"\\":"\\\\","\n":"\\n","\r":"\\r","\t":"\\t"};
					var c = function(m){ return (typeof e[m] != "undefined")?e[m]:m };
					return '"'+s.replace(/[\\"'\n\r\t]/g, c)+'"';
				},
				a : function(a) {
					var s = "[",c = "",n=a.length;
					for(var i=0; i < n; i++) {
						if (typeof a[i] == "function") continue;
						s += c+this.$(a[i]);
						if (!c) c = ",";
					}
					return s+"]";
				},
				o : function(o) {
					var s = "{",c = "";
					for(var x in o) {
						if (typeof o[x] == "function") continue;
						s += c+this.s(x)+":"+this.$(o[x]);
						if (!c) c = ",";
					}
					return s+"}";
				}
			}
			return func.$(vValue);
		}
	 }
	 



var __mockConsole = {
	init : function(){
		if(window.console){
			if(console.log){
				var that = this;
				this._realLog = console.log;
				console.log = function(sMessage){
					that.log(sMessage);
				}
			}
			if(console.warn){
				var that = this;
				this._realWarn = console.warn;
				console.warn = function(sMessage){
					that.warn(sMessage);
				}
			}
		}else{
			this._setConsole = true;
			window.console = this;
		}
	},
	log:function(sMessage){
		this.msg = sMessage;
	},
	warn:function(sMessage){
		this.msg = sMessage;
	},
	get:function(){
		return this.msg;
	},
	reset : function(){
		this.msg = null;
	},
	rescue : function(){
	   if(this._setConsole){
	   	window.console = undefined;	
	   }
	   if(this._realLog){
	   	console.log = this._realLog;
	   }
	   if(this._realWarn){
	   	console.warn = this._realWarn;
	   }
	}
}