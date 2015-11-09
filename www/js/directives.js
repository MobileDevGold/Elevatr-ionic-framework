angular.module('elevatr.directives', [])

.directive('ngEnter', function() {
    return function(scope, element, attrs) {
    	element.bind("keydown keypress", function(event) {
    		if (event.which === 13) {
    			scope.$apply(function() {
    				scope.$eval(attrs.ngEnter);
    			});
    			
    			event.preventDefault();
    		}
    	});
    }
})

.directive('focusMe', function($timeout) {
	return {
		scope: {trigger: '=focusMe'},
		link: function(scope, element, attrs) {
			scope.$watch('trigger', function(value) {
				if (value === true) {
					$timeout(function() {						
						element[0].focus();
					}, 750);
		
				}
			});
		}
	};
})
;