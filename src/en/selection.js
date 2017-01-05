/**
 
 *  Returns the $Selection object of a selected area.
 * @id selection.$Selection
  
 */
jindo.$Selection = function () {
}

/**
 
 * Returns the $Range object that corresponds to the current selected area.
 * If the $Range is paased as a first parameter, the given $Range is specified as a selected area.
 * @id core.$Range.range
 * @param {$Range} The $Range object for a selected area.
  
 */
jindo.$Selection.prototype.range = function(oRange) {
};

/**
 
 * Returns the $Range object of a selected area.
 * @id selection.$Range
  
 */
jindo.$Range = function () {
};

/**
 
 * Gets a HTML string in the given Text Range.
 * @id selection.$Range.getHTML
  
 */
jindo.$Range.prototype.getHTML = function() {
};

/**
 
 * Replaces HTML with the given Text Range.
 * @id selection.$Range.setHTML
  
 */
jindo.$Range.prototype.setHTML = function() {
};