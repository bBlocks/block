'use strict';
/**
 * Library building blocks 
 * @namespace
 * @version 0.1.2
 */
var component = function(name) {
	if (!name) {
		return;
	}
	if (!customElements.get(name)) {
		var proto = {};
		if (arguments.length >1 && window.bb && window.bb.compose) {
			let args = Array.prototype.slice.call(arguments);
			args[0] = proto;
			bb.compose.apply(proto, args);
		}

		let ElementConstructor = Class({extends: HTMLElement, constructor: function () {
			var self = this.super.apply(this, arguments);
			if (typeof self.onCreate == 'function') {
				if (!self._isCreated) { // Need to call onCreate only once.
					self._isCreated = true;
					self.onCreate();
				}
			}
			return self;
		}});

		if (proto) {
			bb.compose(ElementConstructor.prototype, proto);
		}
	
		// Observed attributes		
		if (ElementConstructor.prototype.getObservedAttributes) {
			var descriptor = {
				key: 'observedAttributes',
				get: function get() {
					return this.prototype.getObservedAttributes();
				}
			};		
			descriptor.enumerable = descriptor.enumerable || false; 
			descriptor.configurable = true; 
			if ("value" in descriptor) descriptor.writable = true; 
			Object.defineProperty(ElementConstructor, descriptor.key, descriptor); 	
		};
		
		customElements.define(name, ElementConstructor);
	}  
	return customElements.get(name);
};

