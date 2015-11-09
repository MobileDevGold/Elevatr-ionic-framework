angular.module('elevatr.controllers', [])

.controller('HomeCtrl', function($scope, $rootScope, $state, $ionicModal, $elevatrIdeaList, $cordovaSQLite) {
           
$scope.$watch('service.getIdeaList()', function(newVal) {
	$scope.idea_list = $elevatrIdeaList.idea_list;

});

$scope.$on('updateIdeaList', function(event, track) {
    $scope.idea_list = $elevatrIdeaList.idea_list;
    	$scope.$apply();
	$scope.$digest();
});

	$scope.$on('$locationChangeSuccess', function(event) { 
    	$scope.idea_list = $elevatrIdeaList.idea_list;
	 });

	$scope.idea_list = $elevatrIdeaList.idea_list;
	
	$scope.modal_data = {
		title: {},
		name: {}
	};
	  
	$scope.modal_title_focus = false;
	$scope.modal_name_focus = false;
	
	$scope.OnDeleteItem = function(event, id) {
			
		$elevatrIdeaList.deleteIdea(id);
		$scope.idea_list = $elevatrIdeaList.idea_list;
		
		return false;		
	}
	
	$scope.OnClickItem = function(event, id, deleteFlag) {
		$rootScope.ideaId = id;

		if (deleteFlag) {
			return;
		}
		
		$state.go('categorylist', {ideaId: id});
	}
	
	// Idea title view
	$ionicModal.fromTemplateUrl('templates/idea-title.html', {
		id: 'idea-title',	
    	scope: $scope,
    	animation: 'slide-in-up'
  	}).then(function(modal) {
    	$scope.modal_title = modal;
  	});
  	
  	// Idea name view
  	$ionicModal.fromTemplateUrl('templates/idea-name.html', {
		id: 'idea-name',
    	scope: $scope,
    	animation: 'slide-in-up'
  	}).then(function(modal) {
    	$scope.modal_name = modal;
  	});
  
	$scope.OnClickNewIdea = function() {
		
		if($rootScope.isLoggedIn == true) {
			$scope.initModal();
			$scope.modal_title.show();
			$scope.modal_title_focus = true;	
		}else{
			$state.go('settings');
		}
	}
	
	// Modal functions
	$scope.initModal = function(id) {
	
		$scope.modal_data.title.character_limit = 140;
		$scope.modal_data.title.character_entered = 0;
		$scope.modal_data.title.data = '';
		$scope.modal_data.title.character_remain = $scope.modal_data.title.character_limit - $scope.modal_data.title.character_entered;
	
		$scope.modal_data.name.character_limit = 30;
		$scope.modal_data.name.character_entered = 0;
		$scope.modal_data.name.data = '';
		$scope.modal_data.name.character_remain = $scope.modal_data.name.character_limit - $scope.modal_data.name.character_entered;		
	}
		
	$scope.onIdeaTitleKeyUp = function() {
		
		$scope.modal_data.title.character_entered = $scope.modal_data.title.data.length;		
		$scope.modal_data.title.character_remain = $scope.modal_data.title.character_limit - $scope.modal_data.title.character_entered;
	}
	
	$scope.OnClickIdeaTitleDone = function() {
	
		if ($scope.modal_data.title.character_entered > 0) {
			$scope.modal_name.show();
			$scope.modal_title.hide();
			
			$scope.modal_title_focus = false;
			$scope.modal_name_focus = true;
		} else {
			$scope.modal_title.hide();
			$scope.modal_title_focus = false;
		}
	}
	
	$scope.onIdeaNameKeyUp = function() {
		
		$scope.modal_data.name.character_entered = $scope.modal_data.name.data.length;		
		$scope.modal_data.name.character_remain = $scope.modal_data.name.character_limit - $scope.modal_data.name.character_entered;
	}
	
	$scope.OnClickIdeaNameDone = function() {
	
		if ($scope.modal_data.name.character_entered > 0) {
			$scope.modal_name.hide();
			$scope.modal_name_focus = false;
			
			var id = $elevatrIdeaList.addIdea($rootScope.userId, $scope.modal_data.title.data, $scope.modal_data.name.data);
			
			// Update list
			$scope.idea_list = $elevatrIdeaList.idea_list;
			
			// Go to category list
			$state.go('categorylist', {ideaId:id});
		} else {
			$scope.modal_name.hide();
			$scope.modal_name_focus = false;			
		}
	}
		
	
})

.controller('EditorMultiCtrl', function($scope, $stateParams) {
	
	$scope.titles = [
		{"type"	:	1,	"title"	:	"Problem"},
		{"type"	:	2,	"title"	:	"Solution"},

		{"type"	:	3,	"title"	:	"Target Market"},
		{"type"	:	4,	"title"	:	"Competition"},
		{"type"	:	5,	"title"	:	"Competitive Advantage"},

		{"type"	:	6,	"title"	:	"Use Cases"},
		{"type"	:	7,	"title"	:	"Product Features"},
		{"type"	:	8,	"title"	:	"Brand Identity"},
		{"type"	:	9,	"title"	:	"The Idea's Name"},
		
		{"type"	:	10,	"title"	:	"Monetization"},
		{"type"	:	11,	"title"	:	"Distribution"},
		{"type"	:	12,	"title"	:	"Financials"},
		
		{"type"	:	13,	"title"	:	"Key People"},
		{"type"	:	14,	"title"	:	"Milestones"},
		{"type"	:	15,	"title"	:	"Next Steps"}
	];
	
	$scope.type = $stateParams.titleType;
	
	$scope.data = {
		editor_content1 : "34",
		editor_content2 : "AB"
	};

	$scope.items = [];
	
	// test
	$scope.items.push(
		{
			item_type	:	"text",
			item_content:	"ABCDEFG"
		}
	);
	
	$scope.items.push(
		{
			item_type	:	"image",
			item_content:	"img/page/noteImageDummy.png"
		}
	);
	
})

.controller('IdeaListCtrl', function($scope, $rootScope, $state, $elevatrIdeaList) {

	$scope.idea_list = $elevatrIdeaList.idea_list;
	
	$scope.OnClickNewIdea = function() {
		
		$rootScope.operation = 'new';
		$rootScope.init_idea();
		
		$state.go('idea-title');
	}
})

.controller('CategoryListCtrl', function($scope, $rootScope, $state, $stateParams, $ionicModal, $cordovaCamera, $elevatrIdeaList, $cordovaEmailComposer, $cordovaClipboard, $cordovaSms, $ionicActionSheet){

	var Ideas = Parse.Object.extend("Ideas");
		var query = new Parse.Query(Ideas);
		query.equalTo("ideaId", $rootScope.ideaId);
		query.find({
		  success: function(results) {
			// Do something with the returned Parse.Object values
			for (var i = 0; i < results.length; i++) { 
			  var object = results[i];
			  var bFlag = object.getACL().getPublicReadAccess()
			  $scope.sharing = { checked: bFlag };
			  $scope.apply();
			}
		  },
		  error: function(error) {
			//alert("Error: " + error.code + " " + error.message);
		  }
	});
		
	
	$scope.idea = $elevatrIdeaList.findIdea($stateParams.ideaId);
	
	$scope.modal_data = {
		title: {},
		name: {}
	};
	$scope.modal_title_focus = false;
	$scope.modal_name_focus = false;
	
	
	// Idea title view
	$ionicModal.fromTemplateUrl('templates/idea-title.html', {
		id: 'idea-title',	
    	scope: $scope,
    	animation: 'slide-in-up'
  	}).then(function(modal) {
    	$scope.modal_title = modal;
  	});
  	
  	// Idea name view
  	$ionicModal.fromTemplateUrl('templates/idea-name.html', {
		id: 'idea-name',
    	scope: $scope,
    	animation: 'slide-in-up'
  	}).then(function(modal) {
    	$scope.modal_name = modal;
  	});

	$scope.categorylist = [
		{
			id: 10,
			title:	'The Idea',
			color:	'#03c2d9',
			shown:	false,
			subcategory: [
				{
					id:		11,
					title:	'Elevatr Pitch',
					lines:	[
						{
							type:	'text',
							data:	$scope.idea.idea_elevatr_pitch
						}
					]
				},
				{
					id:		12,
					title:	'Problem',
					lines:	$scope.idea.idea_problem_list
				},
				{
					id:		13,
					title:	'Solution',
					lines:	$scope.idea.idea_solution_list
				}
			]
		},
		{
			id: 20,
			title:	'The Market',
			color:	'#03d48f',
			shown:	false,
			subcategory: [
				{
					id:		21,
					title:	'Target Market',
					lines:	$scope.idea.market_target_list
				},
				{
					id:		22,
					title:	'Competition',
					lines:	$scope.idea.market_competition_list
				},
				{
					id:		23,
					title:	'Competitive Advantage',
					lines:	$scope.idea.market_advantage_list
				}
			]
		},
		{
			id: 30,
			title: 'The Product',
			color: '#038984',
			shown:	false,
			subcategory: [
				{
					id:		31,
					title:	'Use Cases',
					lines:	$scope.idea.product_usecase_list
				},
				{
					id:		32,
					title:	'Product Features',
					lines:	$scope.idea.product_feature_list
				},
				{
					id:		33,
					title:	'Brand Identity',
					lines:	$scope.idea.product_identity_list
				}
			]
		},
		{
			id: 40,
			title: 'Business Model',
			color: '#f3c303',
			shown:	false,
			subcategory: [
				{
					id:		41,
					title:	'Monetization',
					lines:	$scope.idea.business_monetization_list
				},
				{
					id:		42,
					title:	'Distribution',
					lines:	$scope.idea.business_distribution_list
				},
				{
					id:		43,
					title:	'Financials',
					lines:	$scope.idea.business_financial_list
				}
			]
		},
		{
			id: 50,
			title: 'Execution',
			color: '#de6e03',
			shown:	false,
			subcategory: [
				{
					id:		51,
					title:	'Key People',
					lines:	$scope.idea.execution_people_list
				},
				{
					id:		52,
					title:	'Milestones',
					lines:	$scope.idea.execution_milestone_list
				},
				{
					id:		53,
					title:	'Next Steps',
					lines:	$scope.idea.execution_step_list
				}
			]
		}
	];

	$scope.isCategoryShown = function(category_item) {
		return category_item.shown;
	}
	
	$scope.toggleCategory = function(category_item) {
		
		category_item.shown  = ! category_item.shown;
		
		for(var i=0; i < $scope.categorylist.length; ++i) {
			if (category_item.id == $scope.categorylist[i].id) {
				$scope.categorylist[i].shown = category_item.shown;
				return;
			}
		}
	}
	
	$scope.changeSharing = function() {
		
		var Ideas = Parse.Object.extend("Ideas");
		var query = new Parse.Query(Ideas);
		query.equalTo("ideaId", $rootScope.ideaId);
		query.find({
		  success: function(results) {
			// Do something with the returned Parse.Object values
			for (var i = 0; i < results.length; i++) { 
			  var object = results[i];
			  object.setACL(new Parse.ACL($rootScope.user));
			  var postACL = new Parse.ACL(Parse.User.current());
			  postACL.setPublicReadAccess($scope.sharing.checked);
			  object.setACL(postACL);
			  object.save();
			}
		  },
		  error: function(error) {
			//alert("Error: " + error.code + " " + error.message);
		  }
		});
		
	}

	$scope.OnClickMoves = function() {
		var body = '<div>Elevatr, <br/><br/>I\'d like to chat with you and your investor about my idea. I think it is something we should all make moves on.</div>';
	
		var email = {
			to: 'makemoves@elevatr.com',
			cc: '',
			bcc: [],
			attachments: [],
			subject: 'Make Moves',
			body: body,
			isHtml: true
		  };

		 $cordovaEmailComposer.open(email).then(null, function () {
		   // user cancelled email
		 });
	}

	$scope.OnClickShare = function() {
		
	    var Ideas = Parse.Object.extend("Ideas");
		var query = new Parse.Query(Ideas);
		query.equalTo("ideaId", $rootScope.ideaId);
		query.find({
		  success: function(results) {
			// Do something with the returned Parse.Object values
			for (var i = 0; i < results.length; i++) { 
			  var object = results[i];
			  object.setACL(new Parse.ACL($rootScope.user));
			  var postACL = new Parse.ACL(Parse.User.current());
			  postACL.setPublicReadAccess(true);
			  object.setACL(postACL);
			  object.save();
			}
		  },
		  error: function(error) {
			//alert("Error: " + error.code + " " + error.message);
		  }
		});
				
	  
	   var hideSheet = $ionicActionSheet.show({
		 buttons: [
		   { text: 'Email' },
		   { text: 'Message' },
		   { text: 'Copy' }
		 ],
		 titleText: 'Share Options',
		 cancelText: 'Cancel',
		 cancel: function() {
			  // add cancel code..
		 },
		 buttonClicked: function(buttonIndex) {
		   
		   var link = "https://share.elevatrapp.com/?idea=" + $rootScope.ideaId;
		   
		   if(buttonIndex == 0){//Email 			
				var body = '<a href="' + link + '">Check it out</a>';
			
				var email = {
					to: '',
					cc: '',
					bcc: [],
					attachments: [],
					subject: 'MakinMoves on an idea',
					body: body,
					isHtml: true
				  };

				 $cordovaEmailComposer.open(email).then(null, function () {
				   // user cancelled email
				 });
			}
			
			if(buttonIndex == 1){//Message 
				//CONFIGURATION
				   var msg = 'MakinMoves on an idea '+ link;
				var options = {
					replaceLineBreaks: false // true to replace \n by a new line, false by default
				};
			
				window.sms.send('', msg, options, null, null);
			}
			if(buttonIndex == 2){//Copy
				$cordovaClipboard
				.copy(link)
				.then(function () {
				  // success
				  alert("copied");
				}, function () {
				  // error
				  alert("copy failed");
				});
			}
	   
		   
		   return true;
		 }
	   });
	   
	   return;
   
	
		var options = {
			'androidTheme' : window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT,
			'title': 'Share Options',
			'buttonLabels': ['Email', 'Message', 'Copy'],
			'addCancelButtonWithLabel': 'Cancel',
			'androidEnableCancelButton' : true,
			'winphoneEnableCancelButton' : true
		};

		window.plugins.actionsheet.show(options, $scope.ShareCallback);
		
		
		$scope.ShareCallback = function(buttonIndex) {
			
			setTimeout(function() {
				var link = "https://share.elevatrapp.com/?idea=" + $rootScope.ideaId;
				
				if(buttonIndex == 1){//Email 
			var body = '<a href="' + link + '">Check it out</a>';
				
				var email = {
				to: '',
				cc: '',
				bcc: [],
				attachments: [],
				subject: 'MakinMoves on an idea',
				body: body,
				isHtml: true
		};
		
			 $cordovaEmailComposer.open(email).then(null, function () {
			   // user cancelled email
			 });
				}
				
			if(buttonIndex == 2){//Message
					//CONFIGURATION
                       var msg = 'MakinMoves on an idea '+ link;
					var options = {
						replaceLineBreaks: false // true to replace \n by a new line, false by default
					};
				
                    window.sms.send('', msg, options, null, null);
			}
			if(buttonIndex == 3){//Copy
					$cordovaClipboard
					.copy(link)
					.then(function () {
					  // success
					  alert("copied");
					}, function () {
					  // error
					  alert("copy failed");
					});
			}
			if(buttonIndex == 4){//Cancel

                    }
			}, 1000);
		};
		
		$scope.SMSsuccess = function () { 
			alert('Message sent successfully'); 
		}
		$scope.SMSerror = function (e) { 
			alert('Message Failed:' + e);
		}
	}

	$scope.UpdateIdea = function () {

		$scope.idea.idea_elevatr_pitch = $scope.categorylist[0].subcategory[0].lines[0].data;
  	    $scope.idea.idea_problem_list = $scope.categorylist[0].subcategory[1].lines;
		$scope.idea.idea_solution_list = $scope.categorylist[0].subcategory[2].lines;
		$scope.idea.market_target_list = $scope.categorylist[1].subcategory[0].lines;
		$scope.idea.market_competition_list = $scope.categorylist[1].subcategory[1].lines;
		$scope.idea.market_advantage_list = $scope.categorylist[1].subcategory[2].lines;
		$scope.idea.product_usecase_list = $scope.categorylist[2].subcategory[0].lines;
		$scope.idea.product_feature_list = $scope.categorylist[2].subcategory[1].lines;
		$scope.idea.product_identity_list = $scope.categorylist[2].subcategory[2].lines;
		$scope.idea.business_monetization_list = $scope.categorylist[3].subcategory[0].lines;
		$scope.idea.business_distribution_list = $scope.categorylist[3].subcategory[1].lines;
		$scope.idea.business_financial_list = $scope.categorylist[3].subcategory[2].lines;
		$scope.idea.execution_people_list = $scope.categorylist[4].subcategory[0].lines;
		$scope.idea.execution_milestone_list = $scope.categorylist[4].subcategory[1].lines;
		$scope.idea.execution_step_list = $scope.categorylist[4].subcategory[2].lines;

		$elevatrIdeaList.updateIdea($scope.idea);
	}

    $scope.onClickSave = function(){

        $scope.idea.idea_elevatr_pitch = $scope.categorylist[0].subcategory[0].lines[0].data;
  	    $scope.idea.idea_problem_list = $scope.categorylist[0].subcategory[1].lines;
		$scope.idea.idea_solution_list = $scope.categorylist[0].subcategory[2].lines;
		$scope.idea.market_target_list = $scope.categorylist[1].subcategory[0].lines;
		$scope.idea.market_competition_list = $scope.categorylist[1].subcategory[1].lines;
		$scope.idea.market_advantage_list = $scope.categorylist[1].subcategory[2].lines;
		$scope.idea.product_usecase_list = $scope.categorylist[2].subcategory[0].lines;
		$scope.idea.product_feature_list = $scope.categorylist[2].subcategory[1].lines;
		$scope.idea.product_identity_list = $scope.categorylist[2].subcategory[2].lines;
		$scope.idea.business_monetization_list = $scope.categorylist[3].subcategory[0].lines;
		$scope.idea.business_distribution_list = $scope.categorylist[3].subcategory[1].lines;
		$scope.idea.business_financial_list = $scope.categorylist[3].subcategory[2].lines;
		$scope.idea.execution_people_list = $scope.categorylist[4].subcategory[0].lines;
		$scope.idea.execution_milestone_list = $scope.categorylist[4].subcategory[1].lines;
		$scope.idea.execution_step_list = $scope.categorylist[4].subcategory[2].lines;

		$elevatrIdeaList.updateIdea($scope.idea);

		//$ionicGoBack($event);
		$state.go('home');
    }
            
	$scope.OnClickIdeaName = function() {
	
		$scope.initModal();
		$scope.modal_name.show();
		$scope.modal_name_focus = true;
	}
	
	// Modal functions	
	$scope.initModal = function(id) {
		if($scope.sub_item.id == 11) {
			$scope.sub_item.title = "Elevatr Pitch";
			$scope.modal_data.title.data = $scope.sub_item.lines[0].data;
		}else{
			$scope.sub_item.title = "The Idea";
			$scope.modal_data.title.data = $scope.idea.title;
		}

		$scope.modal_data.title.character_limit = 140;
		$scope.modal_data.title.character_entered = $scope.idea.title.length;
		
		$scope.modal_data.title.character_remain = $scope.modal_data.title.character_limit - $scope.modal_data.title.character_entered;
		
		$scope.modal_data.name.character_limit = 30;
		$scope.modal_data.name.character_entered = $scope.idea.name.length;
		$scope.modal_data.name.data = $scope.idea.name;
		$scope.modal_data.name.character_remain = $scope.modal_data.name.character_limit - $scope.modal_data.name.character_entered;		
	}
	
	$scope.onIdeaTitleKeyUp = function() {
		
		$scope.modal_data.title.character_entered = $scope.modal_data.title.data.length;		
		$scope.modal_data.title.character_remain = $scope.modal_data.title.character_limit - $scope.modal_data.title.character_entered;
	}
	
	$scope.OnClickIdeaTitleDone = function() {
	
		$scope.modal_title.hide();
		$scope.modal_title_focus = false;
			
		if ($scope.modal_data.title.character_entered > 0) {
			
			if($scope.sub_item.id == 11){
				$scope.idea.idea_elevatr_pitch = $scope.modal_data.title.data;
				$elevatrIdeaList.updateIdea($scope.idea);
			
				$scope.sub_item.lines[0].data = $scope.idea.idea_elevatr_pitch;
			}else{
				$scope.idea.title = $scope.modal_data.title.data;
				$elevatrIdeaList.updateIdea($scope.idea);
			
				$scope.sub_item.lines[0].data = $scope.idea.title;
			}
			
		}		
	}
	
	$scope.onIdeaNameKeyUp = function() {
		
		$scope.modal_data.name.character_entered = $scope.modal_data.name.data.length;		
		$scope.modal_data.name.character_remain = $scope.modal_data.name.character_limit - $scope.modal_data.name.character_entered;
	}
	
	$scope.OnClickIdeaNameDone = function() {
		
		$scope.modal_name.hide();
		$scope.modal_name_focus = false;
			
		if ($scope.modal_data.name.character_entered > 0) {
			
			$scope.idea.name = $scope.modal_data.name.data;			
			$elevatrIdeaList.updateIdea($scope.idea);
		}
	}
	
	// Sub Category edit
	$scope.sub_item = {};
	
	// Multi-line edit view
	$ionicModal.fromTemplateUrl('templates/note-editor.html', {
		id: 'note-editor',	
    	scope: $scope,
    	animation: 'slide-in-up'
  	}).then(function(modal) {
    	$scope.modal_editor = modal;
  	});
  	
  	$scope.shownModal = false;
	$scope.OnClickSubItem = function(sub_item) {
		$scope.sub_item  = sub_item;
		
		if ($scope.sub_item.id == 11) {
			$scope.initModal();
			$scope.modal_title.show();
			$scope.modal_title_focus = true;
		} else {
			// Add new line
			$scope.sub_item.lines.push({
				type:	'text',
				data:	''
			});
			$scope.modal_editor.show();
			$scope.shownModal = true;
		}
	}
	
	$scope.OnClickSubCategoryDone = function() {
		len = $scope.sub_item.lines.length;
		var temp = [];
		for(var i = 0; i < len; i ++){
			if($scope.sub_item.lines[i].type == "text" && $scope.sub_item.lines[i].data.length < 1) {
				//$scope.sub_item.lines.pop();
			}else{
				temp.push($scope.sub_item.lines[i]);
			}
		}
		$scope.sub_item.lines = [];
		$scope.sub_item.lines = temp;
		
		
		if ($scope.sub_item.id == 11) {
			$scope.modal_title_focus = false;
			$scope.modal_title.hide();
		} else {
			$scope.modal_editor.hide();
		}
		
		$scope.shownModal = false;
		$scope.UpdateIdea();
		$scope.$digest();


	}
	
	$scope.OnClickLineDone = function(line_item, index) {
		
		if (line_item.type == 'text') {
			if (line_item.data.length > 0 && index == ($scope.sub_item.lines.length-1)) {
				// Add new line
				$scope.sub_item.lines.push({
					type:	'text',
					data:	''
				});
			}
		}
		
		if (line_item.type == 'image') {
		}		
	}
	
	$scope.OnClickCamera = function() {
		
		$scope.openGallery();
	}
	
	$scope.openGallery = function() {
	
          		
		var options = {
            quality: 50,
            targetWidth: 250,
            targetHeight: 230,
			destinationType: Camera.DestinationType.DATA_URL,
        	sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        	mediaType: Camera.MediaType.PICTURE,
			encodingType: Camera.EncodingType.JPEG
		};
		
    	$cordovaCamera.getPicture(options)
      	.then(function(imageData) {
			len = $scope.sub_item.lines.length;
			
			if($scope.sub_item.lines[len-1].type == "text" && $scope.sub_item.lines[len-1].data.length < 1) {
				$scope.sub_item.lines[len-1].type = "image";
				$scope.sub_item.lines[len-1].data = "data:image/jpeg;base64," + imageData;
			}else{
              $scope.sub_item.lines.push({
				 type:	'image',
				 data:	"data:image/jpeg;base64," + imageData
			  });
			}
			// Add new line
			$scope.sub_item.lines.push({
				type:	'text',
				data:	''
			});
          		$scope.$digest();
      	}, function(error) {
      		alert('error');
      	});

  	};
})

.controller('SettingsCtrl', function($scope, $rootScope, $state, $location, $cordovaEmailComposer, $elevatrIdeaList) {

	$scope.SignInOutTitle = "Create an Account or Sign In";


	$scope.$on('$locationChangeStart', function(event) { 
	    	if($rootScope.isLoggedIn == true) {
				$scope.SignInOutTitle = "Sign Out";
			}else{
				$scope.SignInOutTitle = "Create an Account or Sign In";
			}
	 });

	$scope.OnClickCreateSignButton = function() {
		if($scope.SignInOutTitle == "Sign Out"){
			$rootScope.isLoggedIn = false;
			$state.go('account');
		}else{
			$state.go('account');	
		}
		
	}

	$scope.OnClickSignOutButton = function() {
		$rootScope.isLoggedIn = false;

		$elevatrIdeaList.resetIdeaList();
		window.localStorage.setItem("bAuto", "0");
		window.localStorage.setItem("email", "");
		window.localStorage.setItem("password", "");

		$state.go('account');		
	}

	$scope.OnClickAbout = function() {
		var ref = window.open('http://elevatr.com/static/about', '_blank', 'location=yes');
	}

	$scope.OnClickPrivacyPolicy = function() {
		var ref = window.open('http://elevatr.com/static/privacy', '_blank', 'location=yes');
	}
	
	$scope.OnClickFeedBack = function() {
	
		$cordovaEmailComposer.isAvailable().then(function() {
			// is available
		}, function() {
			// not available
		});
		
		var email = {
			to: 'feedback@elevatr.com',
			cc: [],
			bcc: [],
			attachments: [],
			subject: 'My Feedback for the Elevatr Team',
			body: '',
			isHtml: true
		};
		
		$cordovaEmailComposer.open(email).then(null, function() {
			// user cancelled email
		});
	}
	
	$scope.OnClickStatus = function() {
		var ref = window.open('http://elevatr.com/status', '_blank', 'location=yes');
	}
	
	
})

.controller('AccountCtrl', function($scope, $state, $ionicModal, $ionicPopup, $timeout, $ionicLoading, $rootScope, $elevatrIdeaList) {
		
	$scope.selectedTab = 0;	// default is 'New' tab
	$scope.buttonTitle = "Create an Account";
	
	$scope.popupTitle = "";
	$scope.popupContent = "";
	
	$scope.user = {
		email: "",
		password: ""
	};
	

	$scope.goWelcomePage  = function () {
		$state.go("welcome");
	}
	// Event Handler for New Account Tab
	$scope.onClickNew = function() {
		$scope.selectedTab = 0;
		$scope.buttonTitle = "Create an Account";
		$scope.movePointer();
	};
	
	// Event Handler for SignIn Tab
	$scope.onClickSignIn = function() {
		$scope.selectedTab =1;
		$scope.buttonTitle = "Sign In";
		$scope.movePointer();
	};
	
	// pointer-moving animation
	$scope.movePointer = function() {
		$timeout(function() {
		
			if ($scope.selectedTab == 0) {
				$scope.pointerPos = '25%';
			}
			else {
				$scope.pointerPos = '75%';
			}

		}, 100);
	};
	
	// alert
	$scope.showAlert = function() {
		var alertPopup = $ionicPopup.alert({
			title: $scope.popupTitle,
			template: $scope.popupContent
		});
		
		alertPopup.then(function(res) {
			
		});
	};
	
	// confirm
	$scope.showConfirm = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: $scope.popupTitle,
			template: $scope.popupContent
		});
		
		confirmPopup.then(function(res) {
			if (res) {
				
				return;
				
				// check user
				if (true) {
					$scope.popupTitle = "Email sent";
					$scope.popupContent = "We've sent you an email to reset your password. Check your inbox momentarily.";
			
					$scope.showAlert();					
				} else if (false) {
					$scope.popupTitle = "User Not Found";
					$scope.popupContent = "We couldn't find that email in our database. Maybe your account hasn't been created yet ?";
			
					$scope.showAlert();
				}
				
			} else {
				
			}
		});
	};
	
	// OnClickAccountButton
	$scope.OnClickAccountButton = function() {
	
		if (!validateEmail($scope.user.email)) {
			
			$scope.popupTitle = "Invalid Email";
			$scope.popupContent = "Please enter a valid email address";
			
			$scope.showAlert();
			return;
		}
		
		if ($scope.user.password.length < 5) {
			
			$scope.popupTitle = "Invalid Password";
			$scope.popupContent = "Please enter a password that is at least 5 characters";
			
			$scope.showAlert();
			return;
		}		

		$scope.register();

	}
	
	// OnClickForgotPasswordButton
	$scope.OnClickForgotPasswordButton = function() {
		
		if ($scope.selectedTab == 1) {
			
			$scope.popupTitle = "Reset Password ?";
			$scope.popupContent = "Would you like to reset your password ?";
		
			$scope.showConfirm();	
			$scope.reset();
			
		}
	}
	
	function validateEmail(email) { 
    	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email);
	}
	
	
	$scope.register = function() {

        // TODO: add age verification step

        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var user = new Parse.User();
        user.set("username", $scope.user.email);
        user.set("password", $scope.user.password);
        user.set("email", $scope.user.email);

        user.signUp(null, {
            success: function(user) {
                $ionicLoading.hide();
                $rootScope.user = user;
                $rootScope.isLoggedIn = true;
				$rootScope.userId = user.id;

				window.localStorage.setItem("bAuto", "1");
				window.localStorage.setItem("email", $scope.user.email);
				window.localStorage.setItem("password", $scope.user.password);

                $state.go("home");
            },
            error: function(user, error) {
                $ionicLoading.hide();
                if (error.code === 125) {
					$scope.popupTitle = "Alert";
					$scope.popupContent = "Please specify a valid email address.";			
					$scope.showAlert();
                } else if (error.code === 202) {
					$scope.login();
                } else {
					$scope.popupTitle = "Alert";
					$scope.popupContent = error.message;
                    $scope.showAlert();
                }
                $scope.$apply();
            }
        });
    };
	
	$scope.login = function() {
        $scope.loading = $ionicLoading.show({
            content: 'Logging in',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var user = $scope.user;
        Parse.User.logIn(('' + user.email).toLowerCase(), user.password, {
            success: function(user) {
                $ionicLoading.hide();
                $rootScope.user = user;
                $rootScope.isLoggedIn = true;                
				$rootScope.userId = user.id;
				$rootScope.objectId = "";
                         
				window.localStorage.setItem("bAuto", "1");
				window.localStorage.setItem("email", $scope.user.email);
				window.localStorage.setItem("password", $scope.user.password);


				var Ideas = Parse.Object.extend("Ideas");
				var query = new Parse.Query(Ideas);
				query.equalTo("userId", user.id);
				query.find({
				  success: function(results) {
				  	 for (var i = 0; i < results.length; i++) { 
					     var object = results[i];
					     var ideaId = 	object.get("ideaId");
					     var title = object.get("title");
					     var name = object.get("name");
						 var objectId = object.id;
						 $rootScope.objectId = objectId;
						 $rootScope.ideaId = ideaId;
					     
					     $elevatrIdeaList.getIdeaListById(objectId, ideaId, title, name);
					 }
				  },
				  error: function(error) {

				  }
				});


				$rootScope.importDatafromSqlite($scope.user.email);


				$state.go('home');
            },
            error: function(user, err) {
                $ionicLoading.hide();
                $rootScope.isLoggedIn = false;
                // The login failed. Check error to see why.
                if (err.code === 101) {
                    $scope.popupContent = 'Invalid login credentials';
                } else {
                    $scope.popupContent = 'An unexpected error has ' +
                        'occurred, please try again.';
                }
				$scope.popupTitle = "Login failed";
				$scope.showAlert();
                $scope.$apply();
            }
        });
    };
	
	
	$scope.reset = function() {
        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        Parse.User.requestPasswordReset($scope.user.email, {
            success: function() {
                // TODO: show success
                $ionicLoading.hide();
                $scope.state.success = true;
				$scope.popupTitle = "Alert";
				$scope.popupContent = 'Password reset mail sent.';
				$scope.showAlert();
                $scope.$apply();
            },
            error: function(err) {
                $ionicLoading.hide();
                if (err.code === 125) {
                    $scope.popupContent = 'Email address does not exist';
                } else {
                    $scope.popupContent = 'An unknown error has occurred, ' +
                        'please try again';
                }
				$scope.popupTitle = "Alert";
				$scope.showAlert();
                $scope.$apply();
            }
        });
    };



});