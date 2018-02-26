function mixin() {
	var source = args[0];
	if (source == undefined) {return;}
	if (args.length <=1) {return source;}

	for (var i = 1; i<args.length;i++) {
		var obj = args[i];
		if (typeof obj != 'object')	{
			console.warn('Invalid parameter type "' + (typeof obj) + '" for the parameter #' + i );
			continue;
		}	
		Object.defineProperties(source, Object.getOwnPropertyDescriptors(obj));
	}
	return source;
}

if (!Object.hasOwnProperty('getOwnPropertyDescriptors')) {
	Object.defineProperty(
	  Object,
	  'getOwnPropertyDescriptors',
	  {
		configurable: true,
		writable: true,
		value: function getOwnPropertyDescriptors(object) {
		  return Reflect.ownKeys(object).reduce((descriptors, key) => {
			return Object.defineProperty(
			  descriptors,
			  key,
			  {
				configurable: true,
				enumerable: true,
				writable: true,
				value: Object.getOwnPropertyDescriptor(object, key)
			  }
			);
		  }, {});
		}
	  }
	);
  }