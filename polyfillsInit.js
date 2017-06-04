// Object.assign polyfill for IE11 and iOS 9
if (window && window.ObjectAssign) { window.ObjectAssign.polyfill(); }

// CustomEvent polyfill for IE11. We need custom events to attach detail to the event.
(function () {

	if (!window || typeof window.CustomEvent === "function") return false;

	function CustomEvent(event, params) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent('CustomEvent');
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
})();