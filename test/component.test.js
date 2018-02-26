describe('feature', function() {
	it('A constructor for features', function() {
		expect(typeof bb.feature).toBe('function');
		var feature = new bb.feature({
			test: 1
		}, {
			test: 2,
			prop: 3
		});
		expect(feature.on).toBeNull();
		expect(feature.test).toBe(2);
		expect(feature.prop).toBe(3);
	});
});
describe("component", function () {
	it("Creates a custom DOM element", function () {
		expect(typeof bb).toBe('object');
		expect(typeof bb.component).toBe('function');
		var MyElement = bb.component({extends: HTMLElement, is: 'my-element1'});
		isCustomElement(expect, 'my-element1', null, MyElement, HTMLElement);		
	});

	it('Can sync properties and attributes', function () {
		// Basic example 
		var MyElement11 = bb.component({extends: HTMLElement, is: 'my-element11'}, {
			define: { // Use this object to declare properties and use setters and getters see more https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
				value: {
					get: function () {
						return this._value;
					},
					set: function (newValue) {
						this._value = newValue + ' set';
					}
				}
			}
		});
		var elem = new MyElement11();
		elem.value = 'test';
		console.log(elem.value); // 'test set' is expected
	
		// How to syncronize attributes
		var MyElement12 = bb.component({extends: HTMLElement, is: 'my-element12'}, {
			setValue: function (str) {
				var newValue;
				if (str) {
					newValue = str + '';
				} else {
					newValue = '';
				}

				// Sync with attribute
				if (newValue != this.getAttribute('value')) {
					this.setAttribute('value', newValue);
				}

				this._value = newValue;
			},
			getValue: function () {
				return this._value || '';
			},
			define: {
				value: {
					get: function () {
						console.log('getter');
						return this.getValue();
					},
					set: function (newValue) {
						console.log('setter', newValue);
						this.setValue(newValue);
					}
				}
			},
			events: {
				attributeChange: function (e) {
					var attributeName = e.detail.attributeName;
					if (attributeName == 'value' && this.getAttribute('value') != this.value) {
						this.value = this.getAttribute('value');
					}
				}
			}
		});
		var elem = new MyElement12();
		elem.value = '1';
		console.log(elem.getAttribute('value')); // '1' is expected
		elem.setAttribute('value', '2');
		console.log(elem.value); // '2' is expected

	})
	
	it('supports custom tags', function() {
		// ES5 
		var flag = '';
		var elementClass = bb.component({
			extends: HTMLElement, 
			is: 'test-element',  
			on: {
				create: function() {
					flag = 'created';
				}
			}
		}); 
	
		var elem = document.createElement('test-element');
		document.body.appendChild(elem);		
		expect(flag).toBe('created');
		document.body.removeChild(elem);
	});

	it('can extend native elements', function() {
		var elementClass = bb.component({
			extends: HTMLButtonElement, 
			is: 'my-button', 
			tag: 'button', 
			on: {
				create: function() {
					this.innerHTML = 'my custom button';
				}
			}
		}); 
		var elem = new elementClass();
		
		document.body.appendChild(elem);
		expect(elem.innerHTML).toBe('my custom button');
		elem.setAttribute('value', 'test');
		expect(elem.value).toBe('test');
		expect(elem.getAttribute('is') == 'my-button').toBeTruthy();

		/*
		class MyParagraph extends HTMLParagraphElement {};
		customElements.define('my-paragraph',MyParagraph,{extends: 'p'});
		var elem = new MyParagraph();
		document.body.appendChild(elem);
		console.log(elem.getAttribute('is'));
		*/

		document.body.removeChild(elem);
		elem = document.createElement('button', 'my-button');
		document.body.appendChild(elem);
		expect(elem.innerHTML).toBe('my custom button');
		elem.setAttribute('value', 'test');
		expect(elem.value).toBe('test');
		document.body.removeChild(elem);
	});

	it('can add features', function () {
		expect(typeof bb.utils.addFeature).toBe('function');
		expect(typeof bb.utils.addCustomEvent).toBe('function');
		
		var obj = {
			prop: 1,
			prop1: 2,
			method: function () {

			}
		};
	
		var behavior = {
			prop1: 3,
			prop2: 4,
			method2: function() {

			},
			on: {
				test: function () {

				}
			},
			define: {
				prop3: {
					set: function (value) {
						this._prop3 = value + '_setter';
					},
					get: function () {
						return this._prop3;
					}
				}
			}
		};

		var behavior2 = {
			on: {
				test: function () {

				}
			}
		}

		bb.utils.addFeature(obj, behavior);
		bb.utils.addFeature(obj, behavior2);
		

		// Support event handlers
		expect(typeof obj.eventHandlers).toBe('object');
		expect(Array.isArray(obj.eventHandlers['test'])).toBeTruthy();
		expect(obj.eventHandlers['test'][0]).toBe(behavior.on.test);
		expect(obj.eventHandlers['test'][1]).toBe(behavior2.on.test);

		// Extend with properties and method
		expect(obj.prop).toBe(1);
		expect(obj.prop1).toBe(3);
		expect(obj.prop2).toBe(4);
		expect(typeof obj.method).toBe('function');
		expect(typeof obj.method2).toBe('function');


		// support property definitions (setters and getters)
		obj.prop3 = '3';
		expect(obj.prop3).toBe('3_setter');

	});

	describe('attributeChange delay', function () {
		var elem, delay, attrTime, attrTime2, renderTime, nChanges = 0, nExpected = 10, nChanges2 = 0, elem2;

		// Through custom elements helper
		var MyElement = bb.component({
			extends: HTMLElement, 
			is: 'my-element3', 
			observedAttributes: ['value'],
			on: {
				attributeChange: function () {
					nChanges++;
					console.log('ZS attribute change', 'delay', performance.now() - attrTime, 'changes', nChanges, 'value', this.getAttribute('value'));
					attrTime = performance.now();
				}
			}
		});

		// Direct polyfill usage
		var MyElement2 = document.registerElement(
			'my-element4',
			{
			prototype: Object.create(
				HTMLElement.prototype, {
				attributeChangedCallback: {
					value: function () {
						nChanges2++;
						console.log('Polyfill attribute change', 'delay', performance.now() - attrTime2, 'changes', nChanges2, 'value', this.getAttribute('value'));
						attrTime2 = performance.now();
					}
				}
				})
			}
		);

		beforeEach(function (done) {			
			elem = new MyElement();
			elem2 = new MyElement2();	

			document.body.appendChild(elem2);
			document.body.appendChild(elem);

			attrTime = performance.now();
			attrTime2 = performance.now();
			for (var i = 0; i < nExpected; i++) {
				elem2.setAttribute('value', i);
				elem.setAttribute('value', i);
			}

			setTimeout(function () {
				done();
			}, 100);

		});
		it('As expected', function () {

			expect(nChanges).toBe(nExpected);
			expect(nChanges2).toBe(nExpected);

		});

		afterEach(function () {
			elem.parentNode.removeChild(elem);
			elem2.parentNode.removeChild(elem2);
		})
	});

	describe('events', function () {
		// In IE11 attach, detach, attributeChange callbacks will be asynchronous due to polyfill nature.
		var attributeName, MyElement, element, element2, element3;
		var behavior = {
			flag: '',
			observedAttributes: ['test'],
			on: {
				clear: function(e) {
					this.flag += 'clear' + e.detail;
				},
				create: function () {
					this.flag += 'create';
				},
				attach: function () {
					this.flag += 'attach';
				},
				detach: function () {
					this.flag += 'detach';
				},
				attributeChange: function (e) {
					attributeName = e.detail.attributeName;
					this.flag += 'attributeChange';
				}
			}
		};


	
		MyElement = bb.component({
			extends: HTMLElement, 
			is: 'my-element2'}, behavior);
	
		beforeEach(function (done) {
			element = new MyElement();
			element2 = new MyElement();
			element3 = new MyElement();
			document.body.appendChild(element);
			document.body.appendChild(element3);
			element.setAttribute('test', '1');
			document.body.removeChild(element);			
			setTimeout(function () { done(); }, 0);
		});
	
		it('lifecycle events create, attach, detach and attributeChange', function () {
			expect(element.flag).toBe('createattachattributeChangedetach');
			expect(element2.flag).toBe('create'); 
			expect(attributeName).toBe('test');
		});

		it('custom events', function() {
			var event = new CustomEvent('clear', {detail: 'test'});
			element2.dispatchEvent(event);
			expect(element2.flag).toBe('createcleartest');
			expect(element3.flag).toBe('createattach');
		});

		afterEach(function () {
			document.body.removeChild(element3);
		});
	});

	describe('utils', function() {

	});

	describe('polyfills', function() {
		xit('coverd in https://github.com/WebReflection/document-register-element', function() {})
	})
});
