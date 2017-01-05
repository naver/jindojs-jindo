/**
 
 * 선택영역 $Selection 객체를 반환한다.
 * @id selection.$Selection
 * @ignore
  
 */
jindo.$Selection = function () {
}

/**
 
 * @description 현재의 Selection 영역에 해당하는 $Range 객체를 반환한다.
 * 첫번째 파라미터로 $Range 객체를 전달하면 주어진 $Range를 선택영역으로 설정한다.
 * @id core.$Range.range
 * @param {$Range} 선택영역에 대한 $Range 객체
 * @ignore
  
 */
jindo.$Selection.prototype.range = function(oRange) {
};

/**
 
 * 선택영역 $Range 객체를 반환한다
 * @id selection.$Range
 * @ignore
  
 */
jindo.$Range = function () {
};

/**
 
 * 주어진 Text Range에 있는 HTML 문자열을 가져온다.
 * @id selection.$Range.getHTML
 * @ignore
  
 */
jindo.$Range.prototype.getHTML = function() {
};

/**
 
 * 주어진 Text Range에 HTML을 대체한다.
 * @id selection.$Range.setHTML
 * @ignore
  
 */
jindo.$Range.prototype.setHTML = function() {
};