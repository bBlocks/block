'use strict';

/**
 * Library building blocks 
 * @namespace
 * @version 0.1.2
 */
var component = function(Prototype, name, tagName) {
	if (!name) {
		return;
	}
	if (customElements.get(name)) {
		throw 'Element "' + name + '" is already defined.';
	}
	if (Prototype != HTMLElement && (!tagName)) {
		throw 'Tag name is required';
	}


	let proto = {extends: Prototype || HTMLElement, constructor: function () {
		var self = this.super.apply(this, arguments);
		if (typeof self.onCreate == 'function') {
			if (!self._isCreated) { // Need to call onCreate only once.
				self._isCreated = true;
				self.onCreate();
			}
		}
		return self;
	}};

	if (arguments.length >3 && window.bb && window.bb.compose) {
		let args = Array.prototype.slice.call(arguments, 2);
		console.log(args);
		args[0] = proto;
		bb.compose.apply(null, args);
	};

	let ElementConstructor = Class(proto);


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

	let config;
	if (tagName) {
		config = {
			extends: tagName
		}
	}

	customElements.define(name, ElementConstructor, config);
	
	return customElements.get(name);
};

