var bb = require('component.js');
var dom = new bb.feature({
	debounce: function (func, wait, immediate) { // taken from http://underscorejs.org/#debounce, but modified to support canceling
		var timeout;
		return function () {
			var context = this, args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) { func.apply(context, args); return null; }
			return timeout;
		};
	}
});

return {
	dom: dom
};