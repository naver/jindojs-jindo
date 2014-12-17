document.addEventListener("DOMContentLoaded",function(){
	var __AppCheck = {
		getData : function(eEle, sName){
			if(document.body.dataset){
				this.getData = function(eEle, sName){
					return eEle.dataset[sName];
				}
			}else{
				this.getData = function(eEle, sName){
					return eEle.getAttribute("data-"+sName);
				}
			}
			return this.getData(eEle, sName);
		},
		run : function(){
			Array.prototype.slice.apply(document.querySelectorAll("._appcheck")).forEach(function(eEle){
				eEle.addEventListener("click",function(eEvent){
					eEvent.preventDefault();
					var eDefine = eEvent.currentTarget;
					var getData = __AppCheck.getData;
					if(/Android/.test(navigator.userAgent)){
						window.location = getData(eDefine,"android");
					}else{
						var clickedAt = +new Date;
						setTimeout(function(){
							if (+new Date - clickedAt < 2000){
								window.location = getData(eDefine,"fail");
							}
						}, 500);
						var eCheckFrame = document.createElement('iframe'); 
						eCheckFrame.setAttribute('style','border:none;width:1px;height:1px');
						eCheckFrame.setAttribute('src',getData(eDefine,"ios"));
						var eBody = document.body;
						eBody.insertBefore(eCheckFrame,eBody.firstChild);
						eBody.removeChild(eCheckFrame);  
					}

				});
			});
		}
	};
	__AppCheck.run();
});

// 
// function createCORSRequest(method, url) {
  // var xhr = new XMLHttpRequest();
  // xhr.open(method, url, true);
  // return xhr;
// }
// 
// var xhr = createCORSRequest('GET', "navermaps://?menu=location&lat=37.4979502&lng=127.0276368&title=%EA%B0%95%EB%82%A8%EC%97%AD&m");
// 
// 
// xhr.onload = function() {
 // alert(1);
 // // process the response.
// };
// 
// xhr.onerror = function() {
  // alert(2);
// };
// 
// xhr.send();
