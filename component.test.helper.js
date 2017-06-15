function canDeclareCustomElement(expect, isWhat, tag, elementConstructor, parentElement) {
	if (!isWhat) { return; }

	var container = document.createElement('div');
	container.setAttribute('id', 'container');

	if (isWhat && tag) {
		container.innerHTML = '<' + tag + ' is="' + isWhat + '"></' + tag + '>';
		document.body.appendChild(container);
		var elem = container.querySelector(tag);
	} else if (isWhat) {
		container.innerHTML = '<' + isWhat + '></' + isWhat + '>';
		document.body.appendChild(container);
		var elem = container.querySelector(isWhat);
	}

	
	expect(elem == null).toBeFalsy();
	expect(elem instanceof HTMLElement).toBeTruthy();
	if (elementConstructor) {
		expect(elem instanceof (parentElement || HTMLElement)).toBeTruthy();
		//expect(elem instanceof elementConstructor).toBeTruthy(); // TODO: Doesn't work in IE11
	}
	document.body.removeChild(container);

}
	
function isCustomElement(expect, isWhat, tag, elementConstructor, parentElement) {
	var elem, container;

	// Can create an element via constructor
	if (elementConstructor) {
		expect(typeof elementConstructor).toBe('function');
		elem = new elementConstructor();
		expect(typeof elem).toBe('object');
		expect(elem == null).toBeFalsy();
		expect(elem instanceof (parentElement || HTMLElement)).toBeTruthy();
	}

	// Can create via tag name
	if (isWhat && tag) { // <div is="my-element"></div> 
		elem = document.createElement(tag, isWhat);
		expect(typeof elem).toBe('object');
		expect(elem == null).toBeFalsy();
		expect(elem instanceof (parentElement || HTMLElement)).toBeTruthy();
		
	} else if (isWhat) { // <my-element></my-element>
		elem = document.createElement(isWhat);
		expect(typeof elem).toBe('object');
		expect(elem == null).toBeFalsy();
		expect(elem instanceof (parentElement || HTMLElement)).toBeTruthy();
	}

	// Can create via HTML
	canDeclareCustomElement(expect, isWhat, tag, elementConstructor, parentElement);
}


function isFeature(expect, feature) {
	expect(typeof feature).toBe('object');
	expect(feature instanceof bb.feature).toBeTruthy();
}