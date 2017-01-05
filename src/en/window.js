/**
 
 * @fileOverView A file to define the constructor and methods of $Window
 * @name window.js
  
 */

/**
 
 * Creates and returns the $Window object.
 * @class The $Window object wraps a window object provided by a browser and provides various methods to handle it.
 * @param {HTMLWidnow} el
 * <br>
 * The window element to be wrapped by $Window
 * @author gony
  
 */
jindo.$Window = function(el) {
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);

	this._win = el || window;
}

/**
 
 * The $value method returns the original window object.
 * @return {HTMLWindow} The window element
 * @example
     $Window().$value(); // Returns the original window object.
  
 */
jindo.$Window.prototype.$value = function() {
	return this._win;
};

/**
 
 * The resizeTo method resizes the size of a window to a specified size.<br>
 * The size of the actual contents may vary depending on types and settings of browsers because this size represents the size of the whole window including the frame.<br>

 * The security settings of some browsers may prevent the window from being resized beyond the current resolution of the screen.<br>
 * @param {Number} nWidth The width of a window
 * @param {Number} nHeight The height of a window
 * @return {$Window} The $Window object
 * @see $Window#resizeBy
 * @example
 * 	// Resizes the width to 400, the height to 300.
 *  $Window.resizeTo(400, 300);
  
 */
jindo.$Window.prototype.resizeTo = function(nWidth, nHeight) {
	this._win.resizeTo(nWidth, nHeight);
	return this;
};

/**
 
 * The resizeBy method resizes the size of a window as specified.
 * @param {Number} nWidth The width of a window to increase
 * @param {Number} nHeight The height of a window to increase
 * @see $Window#resizeTo
 * @example
 *   // Increases the width as much as 100, the height as much as 50.
 *   $Window().resize(100, 50);
  
 */
jindo.$Window.prototype.resizeBy = function(nWidth, nHeight) {
	this._win.resizeBy(nWidth, nHeight);
	return this;
};

/**
 
 * The moveTo method moves a window to a specified position. Coordinates are based on the upper-left corner of a window that includes a frame.
 * @param {Number} nLeft The x coordinate of a window to move (in pixels)
 * @param {Number} nTop The y coordinate of a window to move (in pixels)
 * @see $Window#moveBy
 * @example
 *  // Moves the current window to (15, 10).
 *  $Window().moveTo(15, 10);
  
 */
jindo.$Window.prototype.moveTo = function(nLeft, nTop) {
	this._win.moveTo(nLeft, nTop);
	return this;
};

/**
 
 * The moveBy method moves a window by a specified number of pixels in a certain direction.
 * @param {Number} nLeft The number of pixels of a window to move in the x coordinate (in pixels)
 * @param {Number} nTop The number of pixels of a window to move in the y coordinate (in pixels)
 * @see $Window#moveTo
 * @example
 *  // Moves the current window to the left by 15 pixels, and down by 10 pixels.
 *  $Window().moveBy(15, 10);
  
 */
 jindo.$Window.prototype.moveBy = function(nLeft, nTop) {
	this._win.moveBy(nLeft, nTop);
	return this;
};

/**
 
 * The sizeToContent method resizes the size of a window to fit the size of the contents of a document. There are several constraints.<br>
 * Use a parameter to circumvent constraints if necessary.
<ul>
	<li>This method must be executed after the internal document of this method is completely loaded.
	<li>The size of the window must be smaller than that of an internal document. Otherwise, the size of a document cannot be computed.</li>
	<li>The body size must be specified.</li>
	<li>This method does not work as intended when the DOCTYPE of an html is Quirks in Opera version 10 for Mac, Internet Explorer version 6 and higher, Opera version 10 for Windows, and Safari version 4 for Windows.</li>
	<li>A parent window should be executed if possible. If the state of a child window is invisible, Internet Explorer regards it as the contents not being exist. For this reason, the total size of the content decreases as much as the size of the hidden contents.</li>
</ul>
 * @param {Number} nWidth The width of a window
 * @param {Number} nHeight The height of a window
 * @example
 * // A function to open a new window and automatically resize the size of the window to fit its contents.
 * function winopen(url) {
 *		try {
 *			win = window.open(url, "", "toolbar=0,location=0,status=0,menubar=0,scrollbars=0,resizable=0,width=250,height=300");
 *			win.moveTo(200, 100);
 *			win.focus();
 *		} catch(e){}
 *
 *		setTimeout(function() {
 *			$Window(win).sizeToContent();
 *		}, 1000);
 *	}
 *
 * winopen('/samples/popup.html');
  
 */
	
jindo.$Window.prototype.sizeToContent = function(nWidth, nHeight) {
	if (typeof this._win.sizeToContent == "function") {
		this._win.sizeToContent();
	} else {
		if(arguments.length != 2){
			// use trick by Peter-Paul Koch
			// http://www.quirksmode.org/
			var innerX,innerY;
			var self = this._win;
			var doc = this._win.document;
			if (self.innerHeight) {
				// all except Explorer
				innerX = self.innerWidth;
				innerY = self.innerHeight;
			} else if (doc.documentElement && doc.documentElement.clientHeight) {
				// Explorer 6 Strict Mode
				innerX = doc.documentElement.clientWidth;
				innerY = doc.documentElement.clientHeight;
			} else if (doc.body) {
				// other Explorers
				innerX = doc.body.clientWidth;
				innerY = doc.body.clientHeight;
			}

			var pageX,pageY;
			var test1 = doc.body.scrollHeight;
			var test2 = doc.body.offsetHeight;

			if (test1 > test2) {
				// all but Explorer Mac
				pageX = doc.body.scrollWidth;
				pageY = doc.body.scrollHeight;
			} else {
				// Explorer Mac;
				//would also work in Explorer 6 Strict, Mozilla and Safari
				pageX = doc.body.offsetWidth;
				pageY = doc.body.offsetHeight;
			}
			nWidth  = pageX - innerX;
			nHeight = pageY - innerY;
		}
		this.resizeBy(nWidth, nHeight);
	}

	return this;
};