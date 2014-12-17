QUnit.config.autostart = false;

module("$Window");
	QUnit.test("$Window는 정상적으로 실행되어야 한다.",function(){
		equal($Window()._win,window);
	});
	QUnit.test("$value는 window를 반환해야 한다.",function(){
		equal($Window().$value(),window);
	});
	QUnit.test("resizeTo는 정상적으로 동작해야 한다.",function(){
		var w = 0;
		var h = 0;
		var fakeWindow = {};
		fakeWindow.resizeTo = function(nWidth,nHeight){
			w = 10;
			h = 10;
		};
		var win = $Window();
		win._win = fakeWindow;
		win.resizeTo(10,10);

		equal(w,10);
		equal(h,10);
	});
	QUnit.test("resizeBy는 정상적으로 동작해야 한다.",function(){
		var w = 0;
		var h = 0;
		var fakeWindow = {};
		fakeWindow.resizeBy = function(nWidth,nHeight){
			w = 10;
			h = 10;
		};
		var win = $Window();
		win._win = fakeWindow;
		win.resizeBy(10,10);
		equal(w,10);
		equal(h,10);
	});
	QUnit.test("moveTo는 정상적으로 동작해야 한다.",function(){
		var w = 0;
		var h = 0;
		var fakeWindow = {};
		fakeWindow.moveTo = function(nWidth,nHeight){
			w = 10;
			h = 10;
		};
		var win = $Window();
		win._win = fakeWindow;
		win.moveTo(10,10);
		equal(w,10);
		equal(h,10);
	});
	QUnit.test("moveBy는 정상적으로 동작해야 한다.",function(){
		var w = 0;
		var h = 0;
		var fakeWindow = {};
		fakeWindow.moveBy = function(nWidth,nHeight){
			w = 10;
			h = 10;
		};
		var win = $Window();
		win._win = fakeWindow;
		win.moveBy(10,10);
		equal(w,10);
		equal(h,10);
	});
